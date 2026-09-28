/**
 * Independent verification of an exported evidence window (s03, s18): header hash, profile hash,
 * predecessor linkage, entry-hash chain, contiguous sequence, Recorder-clock chronology, continuity
 * status, preserved Gate A receipt integrity, seal hash and Recorder signature. It establishes the
 * integrity of preserved history only; it says nothing about what the evidence means.
 */
import { computeEntryHash, objectHash } from "./chain";
import { gateAReceiptIntact } from "./gate-a-binding";
import { receiptCitesManifest } from "./gate-a-input/adapter";
import { EIE_REASON } from "./reason-codes";
import { continuityStatusOf } from "./recorder";
import { verifySealSignature, type RecorderKeyResolver } from "./signer";
import { EIE_ARCHITECTURE_FINGERPRINT } from "./spec-guard";
import { parseInstant } from "./time";
import type { ChainRecord, EvidenceWindow, WindowHeader } from "./types";

const HEADER_KEYS: ReadonlyArray<keyof WindowHeader> = [
  "contract", "architectureFingerprint", "recorderId", "recorderMode", "purpose", "assetId", "openTrigger", "openedAt",
  "openedBy", "admittedChannels", "admittedSources", "continuityProfile", "continuityProfileHash", "predecessorWindowIds",
  "predecessorSealHashes",
];

export interface WindowVerification {
  valid: boolean;
  sealed: boolean;
  reasonCodes: string[];
}

export function verifyWindow(window: EvidenceWindow, resolveKey: RecorderKeyResolver): WindowVerification {
  const codes = new Set<string>();
  const header = Object.fromEntries(HEADER_KEYS.map((key) => [key, window[key]]));
  const headerHash = objectHash(header);
  if (headerHash !== window.headerHash || window.windowId !== `EIE-WIN-${headerHash}`) codes.add(EIE_REASON.HASH_MISMATCH);
  if (objectHash(window.continuityProfile) !== window.continuityProfileHash) codes.add(EIE_REASON.HASH_MISMATCH);
  if (window.architectureFingerprint !== EIE_ARCHITECTURE_FINGERPRINT) codes.add(EIE_REASON.LINEAGE_BROKEN);

  // Each projection must itself be in chain order; the union must be the contiguous chain 1..n.
  const inOrder = (list: ChainRecord[]) => list.every((r, i) => i === 0 || list[i - 1].windowSeq < r.windowSeq);
  if (!inOrder(window.entries) || !inOrder(window.events) || !inOrder(window.gaps)) codes.add(EIE_REASON.LINEAGE_BROKEN);
  const chain: ChainRecord[] = [...window.entries, ...window.events, ...window.gaps].sort((a, b) => a.windowSeq - b.windowSeq);

  let prev = window.headerHash;
  let prevRecordedMs = parseInstant(window.openedAt) ?? Number.NaN;
  chain.forEach((record, index) => {
    if (record.windowSeq !== index + 1 || record.windowId !== window.windowId || record.prevEntryHash !== prev) {
      codes.add(EIE_REASON.LINEAGE_BROKEN);
    }
    const { entryHash, ...unhashed } = record;
    if (computeEntryHash(record.prevEntryHash, unhashed) !== entryHash) codes.add(EIE_REASON.HASH_MISMATCH);
    if ((record.kind === "OBSERVATION" || record.kind === "PREMATURE_PRESSURE_ENTRY") && objectHash(record.observation) !== record.observationHash) {
      codes.add(EIE_REASON.HASH_MISMATCH);
    }
    if (record.kind === "GATE_A_RECEIPT" && (!gateAReceiptIntact(record.receipt) || record.receipt.content_hash !== record.receiptContentHash
      || !receiptCitesManifest(record.receipt, record.inputManifest))) {
      codes.add(EIE_REASON.HASH_MISMATCH);
    }
    const recordedMs = parseInstant(record.recordedAt);
    if (recordedMs === null || !(recordedMs >= prevRecordedMs)) codes.add(EIE_REASON.CHRONOLOGY_VIOLATION);
    else prevRecordedMs = recordedMs;
    prev = entryHash;
  });
  if (window.lastEntryHash !== prev) codes.add(EIE_REASON.LINEAGE_BROKEN);
  if (window.continuityStatus !== continuityStatusOf(chain)) codes.add(EIE_REASON.CONTINUITY_BROKEN);

  const sealed = window.sealHash !== null;
  if (sealed) {
    const body = {
      windowId: window.windowId, headerHash: window.headerHash, closeTrigger: window.closeTrigger, closedAt: window.closedAt,
      continuityStatus: window.continuityStatus, lastEntryHash: prev, entryCount: chain.length,
    };
    if (objectHash(body) !== window.sealHash) codes.add(EIE_REASON.SEAL_MISMATCH);
    const closedMs = parseInstant(window.closedAt);
    if (closedMs === null || closedMs < prevRecordedMs) codes.add(EIE_REASON.CHRONOLOGY_VIOLATION);
    if (!verifySealSignature({ windowId: window.windowId, sealHash: window.sealHash }, window.recorderSignature, resolveKey, window.closedAt)) {
      codes.add(EIE_REASON.SIGNATURE_INVALID);
    }
  } else if (window.closedAt !== null || window.closeTrigger !== null || window.recorderSignature !== null) {
    codes.add(EIE_REASON.SEAL_MISMATCH);
  }

  return { valid: codes.size === 0, sealed, reasonCodes: [...codes].sort() };
}
