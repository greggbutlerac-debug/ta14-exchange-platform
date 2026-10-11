import { describe, expect, it } from 'vitest';
import { evaluateCommit, type ExecutionAuthorityInput } from '../apps/web/lib/governance-continuity-execution-authority';
import { createExecutionRecord } from '../apps/web/lib/governance-continuity-execution-lifecycle';

const baseline = (): ExecutionAuthorityInput => ({
  asset: { assetId: 'AE001-ASSET', version: '1', routeId: 'AE001-ROUTE', consequence: 'mock_payment' },
  authority: { authorityId: 'AE001-AUTH', assetId: 'AE001-ASSET', assetVersion: '1', routeId: 'AE001-ROUTE', consequence: 'mock_payment', effectiveAt: '2026-01-01T00:00:00Z', expiresAt: '2027-01-01T00:00:00Z', revoked: false },
  change: null,
  evidence: { continuitySupported: true, admissibilitySupported: true, evidenceId: 'AE001-ASSERTED' },
  now: '2026-10-10T12:00:00Z',
});
const attempt = (at: string) => ({ attemptId: 'AE001-ATT', attemptedAt: at, consequence: 'mock_payment' });

describe('TA14 AE001 commit/attempt binding characterization — no external effect', () => {
  it('AE001-14: mutating commit ID without updating receipt still permits an internal execution record', () => {
    const input = baseline(); const prior = evaluateCommit(input);
    if (!prior.commit) throw new Error('baseline commit missing');
    const tampered = { ...prior, commit: { ...prior.commit, commitId: 'SUBSTITUTED-COMMIT-ID' } };
    const result = createExecutionRecord({ commitEvaluation: tampered, authorityInput: input, attempt: attempt(input.now) });
    expect(result.executionPermitted).toBe(true);
    expect(result.record.commitId).toBe('SUBSTITUTED-COMMIT-ID');
  });
  it('AE001-15: mutating commit bindingScope without updating receipt still permits an internal execution record', () => {
    const input = baseline(); const prior = evaluateCommit(input);
    if (!prior.commit) throw new Error('baseline commit missing');
    const tampered = { ...prior, commit: { ...prior.commit, bindingScope: 'unrelated_consequence' } };
    const result = createExecutionRecord({ commitEvaluation: tampered, authorityInput: input, attempt: attempt(input.now) });
    expect(result.executionPermitted).toBe(true);
  });
  it('AE001-16: changing authority to revoked between commit and attempt is refused', () => {
    const input = baseline(); const prior = evaluateCommit(input);
    const challenged = baseline(); challenged.authority!.revoked = true;
    const result = createExecutionRecord({ commitEvaluation: prior, authorityInput: challenged, attempt: attempt(input.now) });
    expect(result.executionPermitted).toBe(false);
    expect(result.record.status).toBe('REFUSED');
  });
  it('AE001-17: changing evidence ID between commit and attempt is refused', () => {
    const input = baseline(); const prior = evaluateCommit(input);
    const challenged = baseline(); challenged.evidence.evidenceId = 'REPLACED-EVIDENCE';
    const result = createExecutionRecord({ commitEvaluation: prior, authorityInput: challenged, attempt: attempt(input.now) });
    expect(result.executionPermitted).toBe(false);
    expect(result.record.reasonCodes).toContain('COMMIT_EVIDENCE_MISMATCH');
  });
  it('AE001-18: expired authority at attempt time is refused despite earlier commit', () => {
    const input = baseline(); const prior = evaluateCommit(input);
    const result = createExecutionRecord({ commitEvaluation: prior, authorityInput: input, attempt: attempt('2027-01-01T00:00:00Z') });
    expect(result.executionPermitted).toBe(false);
    expect(result.record.status).toBe('REFUSED');
  });
  it('AE001-19: malformed attempt time currently permits internal EXECUTED labeling', () => {
    const input = baseline(); const prior = evaluateCommit(input);
    const result = createExecutionRecord({ commitEvaluation: prior, authorityInput: input, attempt: attempt('invalid-date') });
    expect(result.executionPermitted).toBe(true);
    expect(result.record.status).toBe('EXECUTED');
  });
});
