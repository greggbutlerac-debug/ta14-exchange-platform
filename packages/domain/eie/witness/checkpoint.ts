/**
 * Checkpoint witness (Phase 2C / P3 = 3b): an independent RFC 3161 timestamp over a hash chain of
 * Recorder seals, so the operator of the Recorder is not the sole historian of its own chronology.
 *
 *   checkpoint_k = { recorderId, seq: k, windowId, sealHash, closedAt, prevCheckpointHash }
 *   checkpointHash_k = SHA-256(canonical(checkpoint_k))  -> the only thing the TSA ever receives
 *
 * Deleting, replacing or reordering a sealed window breaks the chain. The witness cannot sign, rewrite
 * or authorize evidence; a timestamp proves the checkpoint existed by genTime and nothing more. Sealing
 * never waits on the TSA: a seal stands, and an unwitnessed window simply cannot supply Gate A input.
 */
import { objectHash } from "../chain";
import { EIE_REASON } from "../reason-codes";
import type { EvidenceWindow } from "../types";
import {
  buildTimestampRequest, positiveNonceHex, pemToDer, verifyTimestampResponse, verifyTimestampToken, type TimestampFields,
} from "./rfc3161";

export const CHECKPOINT_CONTRACT = "TA-14-EIE-ARCH-1.0/witness-checkpoint/1" as const;

export interface WitnessCheckpoint {
  contract: typeof CHECKPOINT_CONTRACT;
  recorderId: string;
  seq: number;
  windowId: string;
  sealHash: string;
  closedAt: string;
  prevCheckpointHash: string | null;
}

export interface WitnessRecord {
  checkpoint: WitnessCheckpoint;
  checkpointHash: string;
  tsa: TimestampFields & { url: string };
  /** Recorder time the request was made (not a trust claim; the TSA genTime is the witnessed time). */
  requestedAt: string;
}

export interface WitnessStore {
  /** Records for a Recorder, ordered by seq. */
  list(recorderId: string): Promise<readonly WitnessRecord[]>;
  /** Append-only: refuses a seq or predecessor that does not extend the chain. */
  append(record: WitnessRecord): Promise<void>;
}

export interface TsaTransport {
  url: string;
  /** POSTs an application/timestamp-query and returns the application/timestamp-reply body. */
  request(queryDer: Uint8Array): Promise<Uint8Array>;
}

export interface WitnessTrust {
  /** Pinned TSA trust anchors (PEM certificates). */
  trustAnchorsPem: readonly string[];
}

export class WitnessAppendViolation extends Error {}

export class InMemoryWitnessStore implements WitnessStore {
  readonly #records = new Map<string, WitnessRecord[]>();
  async list(recorderId: string) {
    return structuredClone(this.#records.get(recorderId) ?? []);
  }
  async append(record: WitnessRecord) {
    const chain = this.#records.get(record.checkpoint.recorderId) ?? [];
    const head = chain.at(-1);
    if (record.checkpoint.seq !== chain.length + 1 || record.checkpoint.prevCheckpointHash !== (head?.checkpointHash ?? null)
      || chain.some((r) => r.checkpoint.windowId === record.checkpoint.windowId)) {
      throw new WitnessAppendViolation("witness record does not extend the checkpoint chain");
    }
    chain.push(structuredClone(record));
    this.#records.set(record.checkpoint.recorderId, chain);
  }
}

export function checkpointFor(recorderId: string, previous: WitnessRecord | null, window: EvidenceWindow): WitnessCheckpoint {
  return {
    contract: CHECKPOINT_CONTRACT, recorderId, seq: (previous?.checkpoint.seq ?? 0) + 1, windowId: window.windowId,
    sealHash: window.sealHash!, closedAt: window.closedAt!, prevCheckpointHash: previous?.checkpointHash ?? null,
  };
}

/**
 * Timestamps every sealed, not-yet-witnessed window of the Recorder, in (closedAt, windowId) order.
 * Stops at the first failure so the chain never skips a window; a later call resumes there.
 */
export async function witnessSealedWindows(args: {
  recorderId: string;
  sealedWindows: readonly EvidenceWindow[];
  store: WitnessStore;
  tsa: TsaTransport;
  trust: WitnessTrust;
  now: () => string;
  randomBytes: (n: number) => Uint8Array;
}): Promise<{ witnessed: string[]; pending: string[]; failure: { windowId: string; detail: string[] } | null }> {
  const existing = await args.store.list(args.recorderId);
  const done = new Set(existing.map((r) => r.checkpoint.windowId));
  const queue = args.sealedWindows
    .filter((w) => w.sealHash !== null && w.recorderId === args.recorderId && !done.has(w.windowId))
    .sort((a, b) => a.closedAt!.localeCompare(b.closedAt!) || a.windowId.localeCompare(b.windowId));
  const witnessed: string[] = [];
  let previous = existing.at(-1) ?? null;
  for (const window of queue) {
    const checkpoint = checkpointFor(args.recorderId, previous, window);
    const checkpointHash = objectHash(checkpoint);
    const nonceHex = positiveNonceHex(args.randomBytes(16));
    const requestedAt = args.now();
    let verification;
    try {
      const reply = await args.tsa.request(buildTimestampRequest(checkpointHash, nonceHex));
      verification = await verifyTimestampResponse(reply, {
        digestHex: checkpointHash, nonceHex, trustAnchorsDer: args.trust.trustAnchorsPem.map(pemToDer), notBefore: window.closedAt!,
      });
    } catch {
      verification = { valid: false as const, fields: {}, detail: ["TSA_UNREACHABLE"] };
    }
    if (!verification.valid) {
      return { witnessed, pending: queue.slice(witnessed.length).map((w) => w.windowId), failure: { windowId: window.windowId, detail: verification.detail } };
    }
    const record: WitnessRecord = { checkpoint, checkpointHash, tsa: { ...verification.fields, url: args.tsa.url }, requestedAt };
    await args.store.append(record);
    witnessed.push(window.windowId);
    previous = record;
  }
  return { witnessed, pending: [], failure: null };
}

export interface ChainVerification {
  valid: boolean;
  reasonCodes: string[];
  /** windowId -> sealHash for every window the chain validly witnesses. */
  witnessed: ReadonlyMap<string, string>;
}

/** Re-verifies the whole chain offline: hashes, contiguity, linkage, uniqueness and every stored token. */
export async function verifyWitnessChain(records: readonly WitnessRecord[], trust: WitnessTrust): Promise<ChainVerification> {
  const codes = new Set<string>();
  const witnessed = new Map<string, string>();
  let previousHash: string | null = null;
  for (const [index, record] of records.entries()) {
    const cp = record.checkpoint;
    if (cp.contract !== CHECKPOINT_CONTRACT || cp.seq !== index + 1 || cp.prevCheckpointHash !== previousHash
      || objectHash(cp) !== record.checkpointHash || witnessed.has(cp.windowId)) {
      codes.add(EIE_REASON.WITNESS_CHAIN_BROKEN);
      break;
    }
    const token = await verifyTimestampToken(Uint8Array.from(Buffer.from(record.tsa.tokenDerBase64, "base64")), {
      digestHex: record.checkpointHash, nonceHex: record.tsa.nonceHex, trustAnchorsDer: trust.trustAnchorsPem.map(pemToDer), notBefore: cp.closedAt,
    });
    if (!token.valid || token.fields.genTime !== record.tsa.genTime || token.fields.serialNumberHex !== record.tsa.serialNumberHex) {
      codes.add(EIE_REASON.WITNESS_INVALID);
      break;
    }
    witnessed.set(cp.windowId, cp.sealHash);
    previousHash = record.checkpointHash;
  }
  return { valid: codes.size === 0, reasonCodes: [...codes].sort(), witnessed };
}

/** Recorder port: a sealed evidence window is witnessed only if the verified chain binds its exact seal. */
export function witnessPort(store: WitnessStore, recorderId: string, trust: WitnessTrust) {
  return async (window: EvidenceWindow): Promise<boolean> => {
    const chain = await verifyWitnessChain(await store.list(recorderId), trust);
    return window.sealHash !== null && chain.witnessed.get(window.windowId) === window.sealHash;
  };
}
