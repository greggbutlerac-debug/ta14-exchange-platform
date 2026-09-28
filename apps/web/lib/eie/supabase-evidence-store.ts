/**
 * TA-14-EIE-ARCH-1.0 s19: durable append-only EvidenceStore over the tables in
 * supabase/migrations/20260928130000_ta14_eie_evidence_windows.sql (NOT APPLIED; owner approval required).
 *
 * Writes use the service role only (the Recorder is the historian; submitters never write directly).
 * The adapter issues inserts and selects only: no update, upsert or delete exists on this path, and the
 * database refuses them independently. Every read is re-verified against its preserved hash, so a row
 * altered outside the application fails closed instead of being trusted.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { computeEntryHash, objectHash } from "../../../../packages/domain/eie/chain";
import {
  AppendOnlyViolation, preservedObservationIds, type EvidenceStore, type StoredWindow, type WindowSeal,
} from "../../../../packages/domain/eie/store";
import type { ChainRecord, WindowHeader } from "../../../../packages/domain/eie/types";

export const EIE_TABLES = {
  windows: "ta14_eie_evidence_windows",
  entries: "ta14_eie_window_entries",
  seals: "ta14_eie_window_seals",
} as const;

type Row = Record<string, unknown>;

/** The only two database operations this adapter performs. */
export interface EieRowGateway {
  insert(table: string, row: Row): Promise<{ error: { code?: string; message?: string } | null }>;
  select(table: string, columns: string, match: Row, orderBy?: string[]): Promise<{ data: Row[] | null; error: { code?: string } | null }>;
}

/** Postgres unique violation, and exceptions raised by the append-only / linkage triggers. */
const APPEND_ONLY_CODES = new Set(["23505", "P0001"]);

export class StoreIntegrityError extends Error {}

export function supabaseRowGateway(db: SupabaseClient): EieRowGateway {
  return {
    async insert(table, row) {
      const { error } = await db.from(table).insert(row);
      return { error };
    },
    async select(table, columns, match, orderBy = []) {
      let query = db.from(table).select(columns).match(match);
      for (const column of orderBy) query = query.order(column, { ascending: true });
      const { data, error } = await query;
      return { data: (data ?? null) as Row[] | null, error };
    },
  };
}

/** Service-role gateway. Missing configuration fails closed. */
export function serviceRoleRowGateway(): EieRowGateway {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("EIE_EVIDENCE_STORE_NOT_CONFIGURED");
  return supabaseRowGateway(createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }));
}

export class SupabaseEvidenceStore implements EvidenceStore {
  constructor(private readonly gateway: EieRowGateway) {}

  async #insert(table: string, row: Row): Promise<void> {
    const { error } = await this.gateway.insert(table, row);
    if (!error) return;
    if (error.code && APPEND_ONLY_CODES.has(error.code)) throw new AppendOnlyViolation(error.message ?? error.code);
    throw new Error(`EIE_EVIDENCE_STORE_WRITE_FAILED:${error.code ?? "UNKNOWN"}`);
  }

  async #select(table: string, columns: string, match: Row, orderBy?: string[]): Promise<Row[]> {
    const { data, error } = await this.gateway.select(table, columns, match, orderBy);
    if (error || !data) throw new Error(`EIE_EVIDENCE_STORE_READ_FAILED:${error?.code ?? "UNKNOWN"}`);
    return data;
  }

  async appendWindow(windowId: string, header: WindowHeader, headerHash: string): Promise<void> {
    await this.#insert(EIE_TABLES.windows, {
      window_id: windowId, header_hash: headerHash, architecture_fingerprint: header.architectureFingerprint,
      recorder_id: header.recorderId, recorder_mode: header.recorderMode, purpose: header.purpose, asset_id: header.assetId,
      opened_at: header.openedAt, gate_a_receipt_id: header.openTrigger.gateAReceiptId, header,
    });
  }

  async appendRecord(record: ChainRecord): Promise<void> {
    const [preserved] = preservedObservationIds(record);
    await this.#insert(EIE_TABLES.entries, {
      window_id: record.windowId, window_seq: record.windowSeq, kind: record.kind, recorded_at: record.recordedAt,
      prev_entry_hash: record.prevEntryHash, entry_hash: record.entryHash,
      observation_id: preserved?.observationId ?? null, observation_hash: preserved?.observationHash ?? null, record,
    });
  }

  async appendSeal(seal: WindowSeal): Promise<void> {
    await this.#insert(EIE_TABLES.seals, {
      window_id: seal.windowId, close_trigger: seal.closeTrigger, closed_at: seal.closedAt, continuity_status: seal.continuityStatus,
      last_entry_hash: seal.lastEntryHash, seal_hash: seal.sealHash,
      recorder_key_id: seal.recorderSignature.keyId, recorder_signature: seal.recorderSignature.signature, seal,
    });
  }

  async readWindow(windowId: string): Promise<StoredWindow | undefined> {
    const [row] = await this.#select(EIE_TABLES.windows, "header,header_hash", { window_id: windowId });
    if (!row) return undefined;
    const header = row.header as WindowHeader;
    if (objectHash(header) !== row.header_hash || windowId !== `EIE-WIN-${row.header_hash}`) {
      throw new StoreIntegrityError("EIE_WINDOW_HEADER_DIGEST_MISMATCH");
    }
    return { header, headerHash: row.header_hash as string };
  }

  async readRecords(windowId: string): Promise<readonly ChainRecord[]> {
    const rows = await this.#select(EIE_TABLES.entries, "record,entry_hash,window_seq", { window_id: windowId }, ["window_seq"]);
    return rows.map((row, index) => {
      const record = row.record as ChainRecord;
      const { entryHash, ...unhashed } = record;
      if (row.window_seq !== index + 1 || record.windowSeq !== index + 1 || entryHash !== row.entry_hash
        || computeEntryHash(record.prevEntryHash, unhashed) !== entryHash) {
        throw new StoreIntegrityError("EIE_WINDOW_ENTRY_DIGEST_MISMATCH");
      }
      return record;
    });
  }

  async readSeal(windowId: string): Promise<WindowSeal | undefined> {
    // The exact seal is preserved as JSON: timestamp columns are re-rendered by the database, the seal hash is not.
    const [row] = await this.#select(EIE_TABLES.seals, "seal,seal_hash,last_entry_hash", { window_id: windowId });
    if (!row) return undefined;
    const seal = row.seal as WindowSeal;
    if (seal.windowId !== windowId || seal.sealHash !== row.seal_hash || seal.lastEntryHash !== row.last_entry_hash) {
      throw new StoreIntegrityError("EIE_WINDOW_SEAL_DIGEST_MISMATCH");
    }
    return seal;
  }

  async listWindowIds(assetId: string): Promise<readonly string[]> {
    const rows = await this.#select(EIE_TABLES.windows, "window_id", { asset_id: assetId }, ["opened_at", "window_id"]);
    return rows.map((row) => row.window_id as string);
  }

  async findObservation(observationId: string) {
    const [row] = await this.#select(EIE_TABLES.entries, "window_id,observation_hash", { observation_id: observationId });
    return row ? { windowId: row.window_id as string, observationHash: row.observation_hash as string } : undefined;
  }
}
