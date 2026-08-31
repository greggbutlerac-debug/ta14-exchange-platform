import type { TA14AdversarialFinding } from './adversarial-examination';
import type { TA14GovernedObject } from './examination-run-receipt';
import {
  deriveChallengeCoverage,
  validateChallengeSelectionProtocol,
  type ChallengeCoverage,
  type ChallengeSelectionProtocol,
} from './challenge-selection-protocol';

export type TA14ExaminationRunReceiptV2 = {
  schema: 'TA14-Examination-Run-Receipt-v2';
  receiptId: string;
  suiteId: 'TA14-AE-27-v1';
  evaluatorVersion: string;
  createdAt: string;
  governedObject: TA14GovernedObject;
  challengeSelection: ChallengeSelectionProtocol;
  challengeCoverage: ChallengeCoverage;
  observations: Record<string, Record<string, unknown>>;
  evidenceRefs: Record<string, string[]>;
  findings: TA14AdversarialFinding[];
  counts: { pass: number; fail: number; unresolved: number; total: number };
  workingStanding: 'SUPPORTED WITHIN TESTED BOUNDARY' | 'NOT SUPPORTED' | 'UNRESOLVED';
  institutionalStanding: 'NOT ISSUED';
  coverageBoundary: 'TESTED CONDITIONS ONLY';
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

export async function createTA14ExaminationRunReceiptV2(input: {
  receiptId: string;
  evaluatorVersion: string;
  governedObject: TA14GovernedObject;
  challengeSelection: ChallengeSelectionProtocol;
  observations: Record<string, Record<string, unknown>>;
  evidenceRefs: Record<string, string[]>;
  findings: TA14AdversarialFinding[];
}): Promise<TA14ExaminationRunReceiptV2> {
  if (!input.receiptId.trim()) throw new Error('Receipt ID is required.');
  const object = input.governedObject;
  if (![object.objectId, object.objectType, object.name, object.version, object.frozenRef, object.frozenDigest].every(v => v.trim())) {
    throw new Error('Governed object identity, version, frozen reference, and frozen digest are required.');
  }
  const selectionFailures = validateChallengeSelectionProtocol(input.challengeSelection);
  if (selectionFailures.length) throw new Error(`Challenge selection protocol invalid: ${selectionFailures.join(', ')}`);
  if (input.findings.length !== 27) throw new Error('AE-27 receipt requires exactly 27 findings.');
  const challengeCoverage = deriveChallengeCoverage(input.challengeSelection);
  const pass = input.findings.filter(f => f.result === 'PASS').length;
  const fail = input.findings.filter(f => f.result === 'FAIL').length;
  const unresolved = input.findings.filter(f => f.result === 'UNRESOLVED').length;
  const workingStanding: TA14ExaminationRunReceiptV2['workingStanding'] = fail
    ? 'NOT SUPPORTED'
    : unresolved
      ? 'UNRESOLVED'
      : 'SUPPORTED WITHIN TESTED BOUNDARY';
  const body = {
    schema: 'TA14-Examination-Run-Receipt-v2' as const,
    receiptId: input.receiptId.trim(),
    suiteId: 'TA14-AE-27-v1' as const,
    evaluatorVersion: input.evaluatorVersion,
    createdAt: new Date().toISOString(),
    governedObject: object,
    challengeSelection: input.challengeSelection,
    challengeCoverage,
    observations: input.observations,
    evidenceRefs: input.evidenceRefs,
    findings: input.findings,
    counts: { pass, fail, unresolved, total: input.findings.length },
    workingStanding,
    institutionalStanding: 'NOT ISSUED' as const,
    coverageBoundary: 'TESTED CONDITIONS ONLY' as const,
  };
  const canonicalDigest = await sha256(stable(body));
  return { ...body, canonicalDigest };
}

export async function verifyTA14ExaminationRunReceiptV2(receipt: TA14ExaminationRunReceiptV2): Promise<boolean> {
  if (receipt.schema !== 'TA14-Examination-Run-Receipt-v2') return false;
  if (validateChallengeSelectionProtocol(receipt.challengeSelection).length) return false;
  const expectedCoverage = deriveChallengeCoverage(receipt.challengeSelection);
  if (stable(expectedCoverage) !== stable(receipt.challengeCoverage)) return false;
  const { canonicalDigest, ...body } = receipt;
  return canonicalDigest === await sha256(stable(body));
}
