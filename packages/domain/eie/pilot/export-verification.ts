/**
 * Offline verification of a Tier 1 pilot export, from public material only: the Key Record, the pinned TSA
 * trust anchors, and the exported windows and witness chain. It re-establishes integrity and lineage; it
 * says nothing about the truth of declared propositions or the meaning of the evidence.
 *
 * Checks: every window verifies (chain, seal, and a signature by the key that was active when it sealed);
 * the witness chain verifies and binds every sealed window's exact seal; every preserved Gate A receipt
 * cites exactly the measurements its manifest mapped, and each mapped measurement traces to an admitted
 * observation in a sealed, witnessed evidence window of the same asset.
 */
import { objectHash } from "../chain";
import { deriveKeyRecord, keyRecordResolver, type KeyEnvironment, type KeyRecordEvent } from "../key-record";
import type { EvidenceWindow, GateAReceiptRecord } from "../types";
import { verifyWindow } from "../verify";
import { verifyWitnessChain, type WitnessRecord, type WitnessTrust } from "../witness/checkpoint";

export interface PilotExport {
  contract: "TA-14-EIE-PILOT-EXPORT/1";
  recorderId: string;
  windows: EvidenceWindow[];
  keyRecord: KeyRecordEvent[];
  witness: WitnessRecord[];
}

export interface ReceiptTrace {
  receiptId: string;
  determination: unknown;
  preservingWindowId: string;
  measurements: Array<{ key: string; windowId: string; entryHash: string; observationId: string; traced: boolean }>;
}

export interface ExportVerification {
  valid: boolean;
  findings: string[];
  windows: Array<{ windowId: string; valid: boolean; reasonCodes: string[]; witnessed: boolean }>;
  receipts: ReceiptTrace[];
}

export async function verifyPilotExport(bundle: PilotExport, trust: WitnessTrust, environments: readonly KeyEnvironment[]): Promise<ExportVerification> {
  const findings: string[] = [];
  if (bundle?.contract !== "TA-14-EIE-PILOT-EXPORT/1") return { valid: false, findings: ["EXPORT_CONTRACT"], windows: [], receipts: [] };
  const resolver = keyRecordResolver(deriveKeyRecord(bundle.keyRecord), environments);
  const chain = await verifyWitnessChain(bundle.witness, trust);
  if (!chain.valid) findings.push(...chain.reasonCodes);

  const byId = new Map(bundle.windows.map((w) => [w.windowId, w]));
  const windows = bundle.windows.map((w) => {
    const result = verifyWindow(w, resolver);
    const witnessed = w.sealHash !== null && chain.witnessed.get(w.windowId) === w.sealHash;
    if (!result.valid) findings.push(`WINDOW_INVALID:${w.windowId}`);
    if (w.sealHash !== null && !witnessed) findings.push(`WINDOW_UNWITNESSED:${w.windowId}`);
    return { windowId: w.windowId, valid: result.valid, reasonCodes: result.reasonCodes, witnessed };
  });

  const receipts: ReceiptTrace[] = [];
  for (const w of bundle.windows) {
    for (const record of w.events.filter((e): e is GateAReceiptRecord => e.kind === "GATE_A_RECEIPT")) {
      const measurements = record.inputManifest.measurements.map((m) => {
        const source = byId.get(m.windowId);
        const entry = source?.entries.find((e) => e.entryHash === m.entryHash);
        const traced = !!source && source.sealHash === m.sealHash && source.assetId === w.assetId
          && w.predecessorWindowIds.includes(source.windowId) && chain.witnessed.get(source.windowId) === source.sealHash
          && entry?.kind === "OBSERVATION" && objectHash(entry.observation) === m.observationHash
          && record.receipt.evidence_hashes !== undefined && (record.receipt.evidence_hashes as Record<string, string>)[m.measurementKey] === m.measurementHash;
        if (!traced) findings.push(`MEASUREMENT_UNTRACED:${record.receiptId}:${m.measurementKey}`);
        return { key: m.measurementKey, windowId: m.windowId, entryHash: m.entryHash, observationId: m.observationId, traced };
      });
      receipts.push({ receiptId: record.receiptId, determination: record.receipt.determination, preservingWindowId: w.windowId, measurements });
    }
  }
  return { valid: findings.length === 0, findings, windows, receipts };
}
