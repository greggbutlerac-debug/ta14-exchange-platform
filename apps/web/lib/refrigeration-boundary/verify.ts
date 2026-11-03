/*
 * Verification of a Refrigeration Consequence Boundary incident record (SIMULATION).
 * Pure and dependency-free: the caller supplies SHA-256, so the same code runs on the server
 * (node:crypto) and in the browser (WebCrypto).
 *
 * Checks: the sealed baseline hashes to its seal; the chain starts from that seal; every entry's
 * hash recomputes; every entry links to its predecessor; sequence numbers are contiguous;
 * recorder time never runs backwards. It establishes integrity of the record as exported. It
 * does not establish that the record is true, complete, or admissible.
 */
import { canonical } from './canonical';

export type Sha256Hex = (text: string) => string | Promise<string>;
export type EirEntry = {
  seq: number;
  type: string;
  recordedAt: string;
  observedAt: string | null;
  source: { kind: 'EIN' | 'AEA_GATE' | 'CONTROLLER_REPORTED' | 'HUMAN' | 'RECORDER'; id: string };
  independentOfController: boolean;
  payload: unknown;
  prevHash: string;
  entryHash: string;
};
export type IncidentRecord = {
  schema: 'ta14.rcb.incident-record.v1';
  label: string;
  scenarioId: string;
  sealedBaseline: { baseline: unknown; sealedAt: string; sealSha256: string };
  entries: EirEntry[];
  chainHead: string;
};
export type VerificationResult = { valid: boolean; entriesChecked: number; chainHead: string | null; failures: string[] };

export const genesisHash = (sealSha256: string) => `GENESIS:${sealSha256}`;
export const entryBody = (e: EirEntry) => { const { entryHash: _omit, ...body } = e; return body; };

export async function verifyIncidentRecord(record: IncidentRecord, sha256: Sha256Hex): Promise<VerificationResult> {
  const failures: string[] = [];
  if (record?.schema !== 'ta14.rcb.incident-record.v1') return { valid: false, entriesChecked: 0, chainHead: null, failures: ['SCHEMA_UNSUPPORTED'] };
  const seal = await sha256(canonical(record.sealedBaseline.baseline));
  if (seal !== record.sealedBaseline.sealSha256) failures.push('BASELINE_SEAL_MISMATCH');
  let prev = genesisHash(record.sealedBaseline.sealSha256);
  let lastTime = -Infinity;
  let checked = 0;
  for (const [i, e] of record.entries.entries()) {
    checked++;
    if (e.seq !== i) failures.push(`SEQUENCE_GAP_OR_REORDER@${i}`);
    if (e.prevHash !== prev) failures.push(`CHAIN_LINK_BROKEN@${i}`);
    const recomputed = await sha256(canonical(entryBody(e)));
    if (recomputed !== e.entryHash) failures.push(`ENTRY_HASH_MISMATCH@${i}`);
    const t = Date.parse(e.recordedAt);
    if (!(t >= lastTime)) failures.push(`RECORDER_TIME_REGRESSED@${i}`);
    lastTime = t;
    prev = e.entryHash;
  }
  if (record.chainHead !== prev) failures.push('CHAIN_HEAD_MISMATCH');
  return { valid: failures.length === 0, entriesChecked: checked, chainHead: prev, failures };
}
