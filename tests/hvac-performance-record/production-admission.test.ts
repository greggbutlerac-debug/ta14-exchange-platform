import {describe, expect, it} from 'vitest';
import {
  PRODUCTION_ADMISSION_OPERATIONAL,
  evaluateProductionBaselineAdmission as admit,
} from '../../apps/web/lib/hvac-performance-record/production-admission';
import {claimCodes, codes, consistent} from './production-admission.fixture';

// The original scenarios from this PR, retained. Each negative case now
// asserts its specific rejection code: because the gate is non-operational,
// `admissible === false` alone would hold vacuously.
describe('HPR production baseline admission (not freeze or DDD)', () => {
  it('is non-operational: even fully consistent claims are not admissible', () => {
    const r = admit(consistent());
    expect(PRODUCTION_ADMISSION_OPERATIONAL).toBe(false);
    expect(r.admissible).toBe(false);
    expect(r.operational).toBe(false);
    expect(r.claimsConsistent).toBe(true);
    expect(codes(r)).toEqual(['TRUSTED_VERIFICATION_AUTHORITY_UNAVAILABLE']);
  });
  it('rejects unverified technician evidence and missing storage', () => {
    const input = consistent();
    input.receipts[0].verification = 'UNVERIFIED';
    input.receipts[1].stored = false;
    const r = admit(input);
    expect(r.claimsConsistent).toBe(false);
    expect(claimCodes(r)).toEqual(['RECEIPT_NOT_VERIFIED', 'RECEIPT_CHECK_FAILED']);
  });
  it('rejects missing identity, digest, calibration, and verifier attribution', () => {
    const input = consistent();
    input.receipts[0].identityVerified = false;
    input.receipts[1].digestVerified = false;
    input.receipts[2].calibrationVerified = false;
    (input.receipts[3] as Record<string, unknown>).verifierPrincipalId = null;
    expect(claimCodes(admit(input))).toEqual(['MALFORMED_INPUT']);
    input.receipts[3].verifierPrincipalId = 'VERIFIER-1';
    const r = admit(input);
    expect(r.rejections.filter(x => x.code === 'RECEIPT_CHECK_FAILED').map(x => x.detail)).toEqual([
      'identityVerified is not true', 'digestVerified is not true', 'calibrationVerified is not true',
    ]);
  });
  it('rejects safety stops and misattributed evidence', () => {
    const input = consistent();
    input.baseline.unresolvedSafetyStops.push('electrical hazard');
    input.receipts[0].intakeId = 'OTHER';
    expect(claimCodes(admit(input))).toEqual(['UNRESOLVED_SAFETY_STOP', 'RECEIPT_BINDING_MISMATCH']);
  });
  it('rejects duplicate, absent, and mismatched step receipts', () => {
    const dup = consistent();
    dup.receipts[1].receiptId = dup.receipts[0].receiptId;
    expect(claimCodes(admit(dup))).toEqual(['RECEIPT_DUPLICATE_ID', 'RECEIPT_MISSING']);
    const wrong = consistent();
    wrong.receipts[0].stepNumber = 2;
    expect(claimCodes(admit(wrong))).toEqual(['RECEIPT_BINDING_MISMATCH']);
  });
  it('rejects already frozen and incomplete baselines', () => {
    const input = consistent();
    input.baseline.frozenAt = '2026-11-12T15:00:00Z';
    input.baseline.steps.pop();
    expect(claimCodes(admit(input))).toEqual(expect.arrayContaining(['BASELINE_ALREADY_FROZEN', 'STEP_COUNT_INVALID']));
  });
});
