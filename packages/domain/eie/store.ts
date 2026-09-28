/**
 * s19 append-only persistence boundary for evidence windows, window entries and seals.
 *
 * The interface has append and read operations only. There is no update or delete. The Recorder
 * holds no authoritative state of its own: it derives every decision from what the store preserved,
 * so any number of Recorder instances can share one store. The Supabase tables in
 * supabase/migrations/20260928130000_ta14_eie_evidence_windows.sql enforce the same rules at the
 * database boundary.
 */
import { deepFreeze, frozenCopy } from "./chain";
import type { SealSignature } from "./signer";
import type { ChainRecord, CloseTrigger, ContinuityStatus, WindowHeader } from "./types";

export interface WindowSeal {
  windowId: string;
  closeTrigger: CloseTrigger;
  closedAt: string;
  continuityStatus: ContinuityStatus;
  lastEntryHash: string;
  sealHash: string;
  recorderSignature: SealSignature;
}

export interface StoredWindow {
  header: WindowHeader;
  headerHash: string;
}

export interface EvidenceStore {
  appendWindow(windowId: string, header: WindowHeader, headerHash: string): Promise<void>;
  appendRecord(record: ChainRecord): Promise<void>;
  appendSeal(seal: WindowSeal): Promise<void>;
  readWindow(windowId: string): Promise<StoredWindow | undefined>;
  readRecords(windowId: string): Promise<readonly ChainRecord[]>;
  readSeal(windowId: string): Promise<WindowSeal | undefined>;
  /** Window ids for an asset, in the order they were opened. */
  listWindowIds(assetId: string): Promise<readonly string[]>;
  /** Where an observationId was first preserved (as an observation or a correction replacement). */
  findObservation(observationId: string): Promise<{ windowId: string; observationHash: string } | undefined>;
}

export class AppendOnlyViolation extends Error {}

/** Observation ids a record preserves as admitted evidence. */
export function preservedObservationIds(record: ChainRecord): Array<{ observationId: string; observationHash: string }> {
  if (record.kind === "OBSERVATION") return [{ observationId: record.observation.observationId, observationHash: record.observationHash }];
  if (record.kind === "CORRECTION" && record.replacement) {
    return [{ observationId: record.replacement.observationId, observationHash: record.replacementHash! }];
  }
  return [];
}

/** In-memory reference store for simulation and tests. Everything stored is frozen. */
export class InMemoryEvidenceStore implements EvidenceStore {
  readonly #windows = new Map<string, StoredWindow>();
  readonly #records = new Map<string, ChainRecord[]>();
  readonly #seals = new Map<string, WindowSeal>();
  readonly #observations = new Map<string, { windowId: string; observationHash: string }>();

  async appendWindow(windowId: string, header: WindowHeader, headerHash: string): Promise<void> {
    if (this.#windows.has(windowId)) throw new AppendOnlyViolation(`window ${windowId} already exists`);
    this.#windows.set(windowId, frozenCopy({ header, headerHash }));
    this.#records.set(windowId, []);
  }

  async appendRecord(record: ChainRecord): Promise<void> {
    const records = this.#records.get(record.windowId);
    if (!records) throw new AppendOnlyViolation(`window ${record.windowId} does not exist`);
    if (this.#seals.has(record.windowId)) throw new AppendOnlyViolation(`window ${record.windowId} is sealed`);
    if (record.windowSeq !== records.length + 1) throw new AppendOnlyViolation("window sequence must be contiguous");
    const previous = records.at(-1)?.entryHash ?? this.#windows.get(record.windowId)!.headerHash;
    if (record.prevEntryHash !== previous) throw new AppendOnlyViolation("predecessor linkage mismatch");
    const ids = preservedObservationIds(record);
    if (ids.some(({ observationId }) => this.#observations.has(observationId))) throw new AppendOnlyViolation("observationId already preserved");
    records.push(frozenCopy(record));
    for (const { observationId, observationHash } of ids) this.#observations.set(observationId, { windowId: record.windowId, observationHash });
  }

  async appendSeal(seal: WindowSeal): Promise<void> {
    if (!this.#windows.has(seal.windowId)) throw new AppendOnlyViolation(`window ${seal.windowId} does not exist`);
    if (this.#seals.has(seal.windowId)) throw new AppendOnlyViolation(`window ${seal.windowId} is already sealed`);
    const head = this.#records.get(seal.windowId)!.at(-1)?.entryHash ?? this.#windows.get(seal.windowId)!.headerHash;
    if (seal.lastEntryHash !== head) throw new AppendOnlyViolation("seal does not close on the chain head");
    this.#seals.set(seal.windowId, frozenCopy(seal));
  }

  async readWindow(windowId: string) {
    return this.#windows.get(windowId);
  }

  async readRecords(windowId: string): Promise<readonly ChainRecord[]> {
    return deepFreeze([...(this.#records.get(windowId) ?? [])]);
  }

  async readSeal(windowId: string) {
    return this.#seals.get(windowId);
  }

  async listWindowIds(assetId: string): Promise<readonly string[]> {
    return [...this.#windows].filter(([, w]) => w.header.assetId === assetId).map(([id]) => id);
  }

  async findObservation(observationId: string) {
    return this.#observations.get(observationId);
  }
}
