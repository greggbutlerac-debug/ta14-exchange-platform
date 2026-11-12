import { describe, expect, it } from 'vitest';
import { evaluateExecutionAuthority, evaluateExecutionAttempt, type ExecutionAuthorityInput } from '../apps/web/lib/governance-continuity-execution-authority';

const baseline = (): ExecutionAuthorityInput => ({
  asset: { assetId: 'ASSET-1', version: '1', routeId: 'PAY-1', consequence: 'transfer_10000' },
  authority: { authorityId: 'AUTH-1', assetId: 'ASSET-1', assetVersion: '1', routeId: 'PAY-1', consequence: 'transfer_10000', effectiveAt: '2026-01-01T00:00:00Z', expiresAt: '2027-01-01T00:00:00Z', revoked: false },
  change: null,
  evidence: { continuitySupported: true, admissibilitySupported: true, evidenceId: 'UNVERIFIED-CLAIM' },
  now: '2026-10-10T00:00:00Z',
});

describe('TA14 AE001 temporal and disposition characterization (not conformance)', () => {
  it('AE001-10: invalid expiration timestamp currently admits an otherwise asserted route', () => {
    const input = baseline(); input.authority!.expiresAt = 'invalid-date';
    const result = evaluateExecutionAuthority(input);
    expect(result.determination).toBe('ALLOW');
  });
  it('AE001-11: invalid evaluation timestamp currently admits an otherwise asserted route', () => {
    const input = baseline(); input.now = 'invalid-date';
    const result = evaluateExecutionAuthority(input);
    expect(result.determination).toBe('ALLOW');
  });
  it('AE001-12: invalid attempt timestamp currently permits an asserted execution attempt', () => {
    const input = baseline();
    const result = evaluateExecutionAttempt({ authorityInput: input, attempt: { attemptId: 'ATT-INVALID-TIME', attemptedAt: 'invalid-date', consequence: input.asset.consequence } });
    expect(result.executionPermitted).toBe(true);
    expect(result.determination).toBe('ALLOW');
  });
  it('AE001-13: invalid intervention authority overrides a scope-mismatch DENY with ESCALATE', () => {
    const input = baseline(); input.authority!.assetVersion = 'wrong';
    const result = evaluateExecutionAttempt({
      authorityInput: input,
      attempt: { attemptId: 'ATT-DENIED', attemptedAt: input.now, consequence: input.asset.consequence },
      interventionAuthority: { authorityId: 'OVERRIDE-1', routeId: input.asset.routeId, consequence: input.asset.consequence, effectiveAt: '2026-01-01T00:00:00Z', expiresAt: '2027-01-01T00:00:00Z', revoked: true },
    });
    expect(result.executionPermitted).toBe(false);
    expect(result.reasonCodes).toContain('AUTHORITY_SCOPE_MISMATCH');
    expect(result.reasonCodes).toContain('INTERVENTION_AUTHORITY_INVALID_OR_UNSCOPED');
    expect(result.determination).toBe('ESCALATE');
  });
});
