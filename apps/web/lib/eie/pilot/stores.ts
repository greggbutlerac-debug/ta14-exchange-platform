/**
 * Supabase-backed append-only stores for the Tier 1 pilot tables (supabase/migrations/2026092909*).
 * Inserts and selects only, through the service-role gateway; the database refuses update and delete.
 */
import type { KeyRecordEvent } from "../../../../../packages/domain/eie/key-record";
import type { WitnessRecord, WitnessStore } from "../../../../../packages/domain/eie/witness/checkpoint";
import { WitnessAppendViolation } from "../../../../../packages/domain/eie/witness/checkpoint";
import type { AssetEvent } from "../../../../../packages/domain/eie/pilot/asset-identity";
import type { InstrumentEvent } from "../../../../../packages/domain/eie/pilot/instrument-register";
import type { EieRowGateway } from "../supabase-evidence-store";

export const PILOT_TABLES = {
  keyEvents: "ta14_eie_recorder_key_events",
  witness: "ta14_eie_witness_checkpoints",
  assetEvents: "ta14_eie_asset_events",
  instrumentEvents: "ta14_eie_instrument_events",
} as const;

async function rows(gateway: EieRowGateway, table: string, columns: string, match: Record<string, unknown>, orderBy: string[]) {
  const { data, error } = await gateway.select(table, columns, match, orderBy);
  if (error || !data) throw new Error(`EIE_PILOT_STORE_READ_FAILED:${error?.code ?? "UNKNOWN"}`);
  return data;
}

async function insert(gateway: EieRowGateway, table: string, row: Record<string, unknown>) {
  const { error } = await gateway.insert(table, row);
  if (error) throw new Error(`EIE_PILOT_STORE_WRITE_FAILED:${error.code ?? "UNKNOWN"}`);
}

/** The Key Record is written only by the custodian and owner through the runbook; the application reads it. */
export async function readKeyRecord(gateway: EieRowGateway): Promise<KeyRecordEvent[]> {
  return (await rows(gateway, PILOT_TABLES.keyEvents, "event", {}, ["event_seq"])).map((r) => r.event as KeyRecordEvent);
}

export class SupabaseWitnessStore implements WitnessStore {
  constructor(private readonly gateway: EieRowGateway) {}
  async list(recorderId: string): Promise<readonly WitnessRecord[]> {
    return (await rows(this.gateway, PILOT_TABLES.witness, "record", { recorder_id: recorderId }, ["seq"])).map((r) => r.record as WitnessRecord);
  }
  async append(record: WitnessRecord): Promise<void> {
    const { error } = await this.gateway.insert(PILOT_TABLES.witness, {
      recorder_id: record.checkpoint.recorderId, seq: record.checkpoint.seq, window_id: record.checkpoint.windowId,
      seal_hash: record.checkpoint.sealHash, checkpoint_hash: record.checkpointHash, prev_checkpoint_hash: record.checkpoint.prevCheckpointHash,
      tsa_gen_time: record.tsa.genTime, record,
    });
    if (error) throw error.code === "23505" || error.code === "P0001" ? new WitnessAppendViolation(error.code) : new Error(`EIE_PILOT_STORE_WRITE_FAILED:${error.code ?? "UNKNOWN"}`);
  }
}

export class SupabaseAssetEventStore {
  constructor(private readonly gateway: EieRowGateway) {}
  async list(assetId: string): Promise<AssetEvent[]> {
    return (await rows(this.gateway, PILOT_TABLES.assetEvents, "event", { asset_id: assetId }, ["event_seq"])).map((r) => r.event as AssetEvent);
  }
  async append(event: AssetEvent): Promise<void> {
    await insert(this.gateway, PILOT_TABLES.assetEvents, { asset_id: event.assetId, event_type: event.type, actor_account_id: event.by.accountId, event });
  }
}

export class SupabaseInstrumentEventStore {
  constructor(private readonly gateway: EieRowGateway) {}
  async list(): Promise<InstrumentEvent[]> {
    return (await rows(this.gateway, PILOT_TABLES.instrumentEvents, "event", {}, ["event_seq"])).map((r) => r.event as InstrumentEvent);
  }
  async append(event: InstrumentEvent): Promise<void> {
    await insert(this.gateway, PILOT_TABLES.instrumentEvents, { instrument_id: event.instrumentId, event_type: event.type, actor_account_id: event.by.accountId, event });
  }
}
