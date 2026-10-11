import { describe, expect, it } from 'vitest';
import { evaluateExecutionAuthority, evaluateExecutionAttempt, type ExecutionAuthorityInput } from '../apps/web/lib/governance-continuity-execution-authority';

const input = (): ExecutionAuthorityInput => ({
  asset: { assetId: 'ASSET-1', version: '1', routeId: 'PAY-1', consequence: 'transfer_10000' },
  authority: { authorityId: 'AUTH-1', assetId: 'ASSET-1', assetVersion: '1', routeId: 'PAY-1', consequence: 'transfer_10000', effectiveAt: '2026-01-01T00:00:00Z', expiresAt: '2027-01-01T00:00:00Z', revoked: false },
  change: null,
  evidence: { continuitySupported: true, admissibilitySupported: true, evidenceId: 'UNVERIFIED-CLAIM' },
  now: '2026-10-10T00:00:00Z',
});

describe('TA14 Internal Adversarial Examination 001: evaluator boundary', () => {
  it('AE001-01: documents ALLOW from asserted booleans alone (not proof of verified evidence)', () => {
    const result = evaluateExecutionAuthority(input());
    expect(result.determination).toBe('ALLOW');
    expect(result.reasonCodes).toContain('PRESENT_STANDING_ESTABLISHED');
    // Characterization: this evaluator does not receive provenance, attestor identity or evidence signature.
  });
  it('AE001-02: rejects unsupported admissibility', () => {
    const sample = input(); sample.evidence.admissibilitySupported = false;
    expect(evaluateExecutionAuthority(sample).determination).toBe('HOLD');
  });
  it('AE001-03: rejects revoked authority', () => {
    const sample = input(); sample.authority!.revoked = true;
    expect(evaluateExecutionAuthority(sample).determination).toBe('DENY');
  });
  it('AE001-04: material change refuses execution', () => {
    const sample = input(); sample.change = { changeId: 'CHG-1', detectedAt: sample.now, category: 'MODEL', material: true, description: 'Changed model' };
    const result = evaluateExecutionAttempt({ authorityInput: sample, attempt: { attemptId: 'ATT-1', attemptedAt: sample.now, consequence: sample.asset.consequence } });
    expect(result.executionPermitted).toBe(false);
  });
  it('AE001-05: documents a HOLD being overwritten by a scope mismatch DENY', () => {
    const sample = input(); sample.evidence.continuitySupported = false; sample.authority!.assetVersion = 'wrong';
    const result = evaluateExecutionAuthority(sample);
    expect(result.determination).toBe('DENY');
    expect(result.reasonCodes).toContain('CONTINUITY_UNSUPPORTED');
    expect(result.reasonCodes).toContain('AUTHORITY_SCOPE_MISMATCH');
  });
  it('AE001-06: invalid date input must not be assumed validated', () => {
    const sample = input(); sample.authority!.effectiveAt = 'invalid-date';
    const result = evaluateExecutionAuthority(sample);
    // Characterization of present behavior; a secure input boundary should reject invalid dates.
    expect(result.determination).toBe('ALLOW');
  });
});
