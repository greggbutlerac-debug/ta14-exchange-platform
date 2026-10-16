import { describe, expect, it } from 'vitest';
import { evaluateCommit, type ExecutionAuthorityInput } from '../apps/web/lib/governance-continuity-execution-authority';
import { createExecutionRecord } from '../apps/web/lib/governance-continuity-execution-lifecycle';

const authorityInput = (): ExecutionAuthorityInput => ({
  asset: { assetId: 'AE001-ASSET', version: '1', routeId: 'AE001-PAYMENT', consequence: 'payment_transfer' },
  authority: { authorityId: 'AE001-GRANT', assetId: 'AE001-ASSET', assetVersion: '1', routeId: 'AE001-PAYMENT', consequence: 'payment_transfer', effectiveAt: '2026-01-01T00:00:00Z', expiresAt: '2027-01-01T00:00:00Z', revoked: false },
  evidence: { continuitySupported: true, admissibilitySupported: true, evidenceId: 'AE001-ASSERTED' },
  change: null,
  now: '2026-10-10T12:00:00Z',
});

describe('TA14 AE001 independent outcome boundary — characterization, not certification', () => {
  it('AE001-07: internally permitted execution is labeled EXECUTED without an external outcome input', () => {
    const source = authorityInput();
    const commitEvaluation = evaluateCommit(source);
    const record = createExecutionRecord({ commitEvaluation, authorityInput: source, attempt: { attemptId: 'AE001-ATTEMPT', attemptedAt: source.now, consequence: source.asset.consequence } });
    expect(record.executionPermitted).toBe(true);
    expect(record.record.status).toBe('EXECUTED');
    expect(record.record.executedAt).toBe(source.now);
    // No bank settlement, actuator acknowledgment, or independent outcome was supplied.
  });
  it('AE001-08: invalid commit receipt hash refuses the internal execution record', () => {
    const source = authorityInput();
    const commitEvaluation = evaluateCommit(source);
    const tampered = { ...commitEvaluation, receipt: { ...commitEvaluation.receipt, hash: '0'.repeat(64) } };
    const record = createExecutionRecord({ commitEvaluation: tampered, authorityInput: source, attempt: { attemptId: 'AE001-TAMPER', attemptedAt: source.now, consequence: source.asset.consequence } });
    expect(record.executionPermitted).toBe(false);
    expect(record.record.status).toBe('REFUSED');
    expect(record.record.reasonCodes).toContain('COMMIT_RECEIPT_INVALID');
  });
  it('AE001-09: altered consequence refuses the internal execution record', () => {
    const source = authorityInput();
    const commitEvaluation = evaluateCommit(source);
    const record = createExecutionRecord({ commitEvaluation, authorityInput: source, attempt: { attemptId: 'AE001-WRONG-CONSEQUENCE', attemptedAt: source.now, consequence: 'other_transfer' } });
    expect(record.executionPermitted).toBe(false);
    expect(record.record.status).toBe('REFUSED');
  });
});
