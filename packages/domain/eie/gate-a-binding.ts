/**
 * Gate A receipt binding for PRESSURE_EVIDENCE windows (s02 S5 -> S6, s03 openTriggers, s09).
 *
 * The only admissible source of a Gate A receipt is the Recorder's own preservation of the C1-R7
 * engine's output (s09: "The C1-R7 receipt is preserved into the Recorder"). A caller cannot supply a
 * receipt object or an authorization flag. The binding reads the C1-R7 contract; it never modifies,
 * re-decides or extends it. Gate A ALLOW opens pressure evidence only: it implies no diagnosis, no
 * Gate B authority, no refrigerant movement and no Governor authority.
 *
 * C1-R7 receipts expire by state change, not by elapsed time, so no age limit is applied. A receipt
 * is inapplicable once a state change it names in validity_terminating_conditions is recorded for the
 * asset after it, or once it has opened a pressure window (s02: transitions are forward-only).
 */
import { FROZEN_SPEC_SHA256 as C1_R7_FINGERPRINT, GATE_A_SCOPE, GATE_A_VERSION } from "../niret/propositions";
import { computeEntryHash, objectHash } from "./chain";
import { receiptCitesManifest } from "./gate-a-input/adapter";
import { EIE_REASON } from "./reason-codes";
import { parseInstant } from "./time";
import type { ChainRecord, GateAReceiptRecord, MaterialChangeRecord, WindowHeader } from "./types";

/** C1-R7 receipt identity (packages/domain/niret/receipt.ts): this prefix plus the leading content-hash characters, upper-cased. */
export const GATE_A_RECEIPT_ID_PREFIX = "NIRET-GA-C1-";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** C1-R7 receipt integrity: the content hash covers everything but receipt_id and content_hash, and the id derives from it. */
export function gateAReceiptIntact(receipt: unknown): receipt is Record<string, unknown> & { receipt_id: string; content_hash: string } {
  if (!isRecord(receipt)) return false;
  const { receipt_id: receiptId, content_hash: contentHash, ...body } = receipt;
  if (typeof receiptId !== "string" || typeof contentHash !== "string" || objectHash(body) !== contentHash) return false;
  const suffix = receiptId.startsWith(GATE_A_RECEIPT_ID_PREFIX) ? receiptId.slice(GATE_A_RECEIPT_ID_PREFIX.length) : "";
  return suffix.length > 0 && contentHash.toUpperCase().startsWith(suffix)
    && receipt.gate_version === GATE_A_VERSION && receipt.frozen_spec_sha256 === C1_R7_FINGERPRINT;
}

/** Only a full C1-R7 ALLOW (technical and execution authority) crosses into pressure evidence, and never into Gate B. */
export function gateAReceiptAuthorizesPressureEvidence(receipt: Record<string, unknown>): boolean {
  const technical = receipt.technical_determination;
  const execution = receipt.execution_authority;
  return receipt.determination === "ALLOW"
    && isRecord(technical) && technical.determination === "ALLOW"
    && isRecord(execution) && execution.determination === "ALLOW"
    && receipt.scope === GATE_A_SCOPE
    && receipt.gate_b_authorized === false;
}

export interface PreservedWindow {
  windowId: string;
  header: WindowHeader;
  headerHash: string;
  records: readonly ChainRecord[];
  sealed: boolean;
}

export type BindingResult =
  | { ok: true; record: GateAReceiptRecord; windowId: string }
  | { ok: false; reasonCodes: string[] };

/**
 * @param receiptId the trigger ref
 * @param assetId the asset of the window being opened
 * @param predecessors the requested predecessor windows (must be sealed)
 * @param assetWindows every preserved window of the asset (for challenges and consumption)
 * @param nowMs Recorder time
 */
export function bindGateAReceipt(receiptId: string, assetId: string, predecessors: readonly PreservedWindow[], assetWindows: readonly PreservedWindow[], nowMs: number): BindingResult {
  let source: { window: PreservedWindow; record: GateAReceiptRecord } | undefined;
  for (const window of predecessors) {
    const record = window.records.find((r): r is GateAReceiptRecord => r.kind === "GATE_A_RECEIPT" && r.receiptId === receiptId);
    if (record && window.sealed) source = { window, record };
  }
  if (!source) return { ok: false, reasonCodes: [EIE_REASON.RECEIPT_NOT_PRESERVED] };
  const { window, record } = source;
  const codes = new Set<string>();

  if (window.header.assetId !== assetId || record.assetId !== assetId || record.inputManifest?.assetId !== assetId) codes.add(EIE_REASON.RECEIPT_ASSET_MISMATCH);
  // s09: a receipt without its sealed-evidence lineage is not a Recorder-preserved Gate A result.
  if (!record.inputManifest || !receiptCitesManifest(record.receipt, record.inputManifest)) codes.add(EIE_REASON.RECEIPT_EVIDENCE_MISMATCH);

  const { entryHash, ...unhashed } = record;
  const receipt = record.receipt;
  if (computeEntryHash(record.prevEntryHash, unhashed) !== entryHash || !gateAReceiptIntact(receipt)
    || receipt.receipt_id !== record.receiptId || receipt.content_hash !== record.receiptContentHash) {
    codes.add(EIE_REASON.RECEIPT_INTEGRITY);
  }

  if (!gateAReceiptAuthorizesPressureEvidence(receipt)) codes.add(EIE_REASON.RECEIPT_NOT_ALLOW);

  const evaluatedMs = parseInstant(receipt.evaluated_at);
  const openedMs = parseInstant(window.header.openedAt)!;
  const preservedMs = parseInstant(record.recordedAt)!;
  if (evaluatedMs === null || evaluatedMs < openedMs || evaluatedMs > preservedMs || preservedMs > nowMs) {
    codes.add(EIE_REASON.RECEIPT_CHRONOLOGY);
  }

  const terminating = new Set(Array.isArray(receipt.validity_terminating_conditions) ? receipt.validity_terminating_conditions as string[] : []);
  if (terminating.size === 0) codes.add(EIE_REASON.RECEIPT_INTEGRITY);
  const challenged = assetWindows.some((w) => w.records.some((r): r is MaterialChangeRecord =>
    r.kind === "MATERIAL_CHANGE" && terminating.has(r.changeType)
    && (w.windowId === window.windowId ? r.windowSeq > record.windowSeq : parseInstant(r.recordedAt)! >= preservedMs)));
  if (challenged) codes.add(EIE_REASON.RECEIPT_CHALLENGED);

  if (assetWindows.some((w) => w.header.purpose === "PRESSURE_EVIDENCE" && w.header.openTrigger.gateAReceiptId === receiptId)) {
    codes.add(EIE_REASON.RECEIPT_CONSUMED);
  }

  if (codes.size > 0) return { ok: false, reasonCodes: [...codes].sort() };
  return { ok: true, record, windowId: window.windowId };
}
