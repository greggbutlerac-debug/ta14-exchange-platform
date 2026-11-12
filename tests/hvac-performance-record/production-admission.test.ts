import {describe, expect, it} from 'vitest';
import {evaluateProductionBaselineAdmission, type VerifiedEvidenceReceipt} from '../../apps/web/lib/hvac-performance-record/production-admission';

const baseline = () => ({
  intakeId: 'INTAKE-1', frozenAt: null, unresolvedSafetyStops: [] as string[],
  steps: Array.from({length: 14}, (_, i) => ({
    number: i + 1, technicianAttested: true, evidenceRefs: ['EV-' + (i + 1)],
  })),
});
const receipts = (): VerifiedEvidenceReceipt[] => Array.from({length: 14}, (_, i) => ({
  recordId: 'EV-' + (i + 1), intakeId: 'INTAKE-1', stepNumber: i + 1,
  verification: 'VERIFIED', stored: true, digestVerified: true,
  identityVerified: true, calibrationVerified: true, verifiedBy: 'independent-verifier',
}));

describe('HPR production baseline admission (not freeze or DDD)', () => {
  it('admits only complete independently verified evidence', () => {
    expect(evaluateProductionBaselineAdmission(baseline(), receipts()).admissible).toBe(true);
  });
  it('rejects unverified technician evidence and missing storage', () => {
    const r = receipts(); r[0].verification = 'UNVERIFIED'; r[1].stored = false;
    expect(evaluateProductionBaselineAdmission(baseline(), r).admissible).toBe(false);
  });
  it('rejects missing identity, digest, calibration, and verifier attribution', () => {
    const r = receipts();
    r[0].identityVerified = false; r[1].digestVerified = false;
    r[2].calibrationVerified = false; r[3].verifiedBy = null;
    expect(evaluateProductionBaselineAdmission(baseline(), r).admissible).toBe(false);
  });
  it('rejects safety stops and misattributed evidence', () => {
    const b = baseline(); b.unresolvedSafetyStops.push('electrical hazard');
    const r = receipts(); r[0].intakeId = 'OTHER';
    expect(evaluateProductionBaselineAdmission(b, r).admissible).toBe(false);
  });
  it('rejects duplicate, absent, and mismatched step receipts', () => {
    const r = receipts(); r[1].recordId = r[0].recordId;
    expect(evaluateProductionBaselineAdmission(baseline(), r).admissible).toBe(false);
    const wrong = receipts(); wrong[0].stepNumber = 2;
    expect(evaluateProductionBaselineAdmission(baseline(), wrong).admissible).toBe(false);
  });
  it('rejects already frozen and incomplete baselines', () => {
    const b = baseline(); b.frozenAt = '2026-11-12T15:00:00Z'; b.steps.pop();
    expect(evaluateProductionBaselineAdmission(b, receipts()).admissible).toBe(false);
  });
});
