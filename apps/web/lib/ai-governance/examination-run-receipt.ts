import type { TA14AdversarialFinding } from './adversarial-examination';

export type TA14GovernedObject = {
  objectId: string;
  objectType: string;
  name: string;
  version: string;
  frozenRef: string;
  frozenDigest: string;
};

export type TA14ExaminationRunReceipt = {
  schema: 'TA14-Examination-Run-Receipt-v1';
  receiptId: string;
  suiteId: 'TA14-AE-27-v1';
  evaluatorVersion: string;
  createdAt: string;
  governedObject: TA14GovernedObject;
  observations: Record<string, Record<string, unknown>>;
  evidenceRefs: Record<string, string[]>;
  findings: TA14AdversarialFinding[];
  counts: { pass: number; fail: number; unresolved: number; total: number };
  workingStanding: 'SUPPORTED WITHIN TESTED BOUNDARY' | 'NOT SUPPORTED' | 'UNRESOLVED';
  institutionalStanding: 'NOT ISSUED';
  canonicalDigest: string;
};

function stable(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map(key => `${JSON.stringify(key)}:${stable(object[key])}`).join(',')}}`;
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function createTA14ExaminationRunReceipt(input: {
  receiptId: string;
  evaluatorVersion: string;
  governedObject: TA14GovernedObject;
  observations: Record<string, Record<string, unknown>>;
  evidenceRefs: Record<string, string[]>;
  findings: TA14AdversarialFinding[];
}): Promise<TA14ExaminationRunReceipt> {
  if (!input.receiptId.trim()) throw new Error('Receipt ID is required.');
  const object = input.governedObject;
  if (![object.objectId, object.objectType, object.name, object.version, object.frozenRef, object.frozenDigest].every(v => v.trim())) {
    throw new Error('Governed object identity, version, frozen reference, and frozen digest are required.');
  }
  if (input.findings.length !== 27) throw new Error('AE-27 receipt requires exactly 27 findings.');
  const pass = input.findings.filter(f => f.result === 'PASS').length;
  const fail = input.findings.filter(f => f.result === 'FAIL').length;
  const unresolved = input.findings.filter(f => f.result === 'UNRESOLVED').length;
  const workingStanding = fail ? 'NOT SUPPORTED' : unresolved ? 'UNRESOLVED' : 'SUPPORTED WITHIN TESTED BOUNDARY';
  const body = {
    schema: 'TA14-Examination-Run-Receipt-v1' as const,
    receiptId: input.receiptId.trim(),
    suiteId: 'TA14-AE-27-v1' as const,
    evaluatorVersion: input.evaluatorVersion,
    createdAt: new Date().toISOString(),
    governedObject: object,
    observations: input.observations,
    evidenceRefs: input.evidenceRefs,
    findings: input.findings,
    counts: { pass, fail, unresolved, total: input.findings.length },
    workingStanding,
    institutionalStanding: 'NOT ISSUED' as const,
  };
  const canonicalDigest = await sha256(stable(body));
  return { ...body, canonicalDigest };
}

export async function verifyTA14ExaminationRunReceipt(receipt: TA14ExaminationRunReceipt): Promise<boolean> {
  const { canonicalDigest, ...body } = receipt;
  return canonicalDigest === await sha256(stable(body));
}
