import { describe, expect, it } from 'vitest';
import { evaluateCommit, evaluateExecutionAuthority, evaluateExecutionAttempt, type ExecutionAuthorityInput } from '../apps/web/lib/governance-continuity-execution-authority';
import { createExecutionRecord } from '../apps/web/lib/governance-continuity-execution-lifecycle';

const baseline = (): ExecutionAuthorityInput => ({
  asset: { assetId: 'A', version: '1', routeId: 'R', consequence: 'mock_action' },
  authority: { authorityId: 'AUTH', assetId: 'A', assetVersion: '1', routeId: 'R', consequence: 'mock_action', effectiveAt: '2026-01-01T00:00:00Z', expiresAt: '2027-01-01T00:00:00Z', revoked: false },
  change: null, evidence: { continuitySupported: true, admissibilitySupported: true, evidenceId: 'E' }, now: '2026-10-10T12:00:00Z',
});
const attempt = (time: string) => ({ attemptId: 'ATT', attemptedAt: time, consequence: 'mock_action' });

describe('AE001 remediation regression expectations', () => {
  for (const field of ['effectiveAt', 'expiresAt'] as const) {
    it('rejects invalid ' + field, () => {
      const input = baseline(); input.authority![field] = 'invalid-date';
      expect(evaluateExecutionAuthority(input).determination).toBe('DENY');
      expect(evaluateCommit(input).commitPermitted).toBe(false);
    });
  }
  it('rejects invalid now', () => { const input = baseline(); input.now = 'invalid-date'; expect(evaluateExecutionAuthority(input).determination).toBe('DENY'); });
  it('rejects invalid attemptedAt even with prior commit', () => {
    const input = baseline(); const prior = evaluateCommit(input);
    expect(evaluateExecutionAttempt({ authorityInput: input, attempt: attempt('invalid-date') }).executionPermitted).toBe(false);
    const result = createExecutionRecord({ authorityInput: input, commitEvaluation: prior, attempt: attempt('invalid-date') });
    expect(result.executionPermitted).toBe(false); expect(result.record.status).toBe('REFUSED');
  });
  it('does not overwrite DENY with ESCALATE on invalid intervention', () => {
    const input = baseline();
    const result = evaluateExecutionAttempt({ authorityInput: input, attempt: { ...attempt(input.now), consequence: 'wrong' }, interventionAuthority: { authorityId: 'I', routeId: 'R', consequence: 'mock_action', effectiveAt: '2026-01-01T00:00:00Z', expiresAt: '2027-01-01T00:00:00Z', revoked: true } });
    expect(result.determination).toBe('DENY'); expect(result.executionPermitted).toBe(false);
  });
  it('rejects substituted commit ID', () => {
    const input = baseline(); const prior = evaluateCommit(input);
    const changed = { ...prior, commit: { ...prior.commit!, commitId: 'TAMPERED' } };
    const result = createExecutionRecord({ authorityInput: input, commitEvaluation: changed, attempt: attempt(input.now) });
    expect(result.executionPermitted).toBe(false);
    expect(result.record.reasonCodes).toContain('COMMIT_OBJECT_RECEIPT_MISMATCH');
  });
  it('rejects substituted commit binding scope', () => {
    const input = baseline(); const prior = evaluateCommit(input);
    const changed = { ...prior, commit: { ...prior.commit!, bindingScope: 'unrelated' } };
    const result = createExecutionRecord({ authorityInput: input, commitEvaluation: changed, attempt: attempt(input.now) });
    expect(result.executionPermitted).toBe(false);
  });
  it('rejects altered authority input after commit', () => {
    const input = baseline(); const prior = evaluateCommit(input);
    const changed = baseline(); changed.evidence.evidenceId = 'DIFFERENT';
    const result = createExecutionRecord({ authorityInput: changed, commitEvaluation: prior, attempt: attempt(input.now) });
    expect(result.executionPermitted).toBe(false);
    expect(result.record.reasonCodes).toContain('COMMIT_INPUT_RECEIPT_MISMATCH');
  });
  it('allows valid bounded internal demonstration, without claiming external effect', () => {
    const input = baseline(); const prior = evaluateCommit(input);
    const result = createExecutionRecord({ authorityInput: input, commitEvaluation: prior, attempt: attempt(input.now) });
    expect(result.executionPermitted).toBe(true);
  });
});
