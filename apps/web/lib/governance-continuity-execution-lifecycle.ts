import { createHash } from 'node:crypto';
import {
  evaluateCommit,
  evaluateExecutionAttempt,
  type CommitEvaluation,
  type ExecutionAuthorityInput,
  type ExecutionAttempt,
  type AuthorityDetermination,
} from '@/lib/governance-continuity-execution-authority';

export type ExecutionRecordStatus = 'EXECUTED' | 'REFUSED';
export type ExecutionRecordReceipt = { algorithm: 'SHA-256'; canonicalVersion: 'TA14.GCEA.EXECUTION_RECORD.v1'; hash: string; replayId: string; payload: unknown };

export type ExecutionRecord = {
  executionId: string;
  status: ExecutionRecordStatus;
  attemptedAt: string;
  executedAt: string | null;
  assetId: string;
  assetVersion: string;
  routeId: string;
  consequence: string;
  commitId: string | null;
  commitReceiptHash: string;
  executionAttemptReceiptHash: string;
  executionAttemptReplayId: string;
  determination: AuthorityDetermination;
  executionPermitted: boolean;
  reasonCodes: string[];
};

export type ExecutionRecordEvaluation = {
  determination: AuthorityDetermination;
  executionPermitted: boolean;
  record: ExecutionRecord;
  receipt: ExecutionRecordReceipt;
};

function stable(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(',')}}`;
}
function digest(value: string) { return createHash('sha256').update(value).digest('hex'); }
function receipt(payload: unknown): ExecutionRecordReceipt {
  const hash = digest(stable(payload));
  return { algorithm: 'SHA-256', canonicalVersion: 'TA14.GCEA.EXECUTION_RECORD.v1', hash, replayId: `TA14-GCEA-EXECREC-${hash.slice(0, 20).toUpperCase()}`, payload };
}
function recordId(parts: string[]) { return `TA14-GCEA-EXEC-${digest(parts.join(':')).slice(0, 20).toUpperCase()}`; }

export function createExecutionRecord(input: {
  commitEvaluation: CommitEvaluation;
  authorityInput: ExecutionAuthorityInput;
  attempt: ExecutionAttempt;
}): ExecutionRecordEvaluation {
  const prior = input.commitEvaluation;
  const committed = prior.commit;
  const reasons: string[] = [];
  const expectedCommitReceiptHash = digest(stable(prior.receipt.payload));
  let commitValid = true;

  if (!prior.commitPermitted || !committed) { commitValid = false; reasons.push('COMMIT_REQUIRED', 'COMMIT_NOT_PERMITTED'); }
  if (prior.receipt.hash !== expectedCommitReceiptHash) { commitValid = false; reasons.push('COMMIT_RECEIPT_INVALID'); }
  if (committed && (committed.assetId !== input.authorityInput.asset.assetId || committed.assetVersion !== input.authorityInput.asset.version || committed.routeId !== input.authorityInput.asset.routeId || committed.consequence !== input.attempt.consequence)) { commitValid = false; reasons.push('COMMIT_SCOPE_MISMATCH'); }
  if (committed && input.authorityInput.authority && committed.authorityId !== input.authorityInput.authority.authorityId) { commitValid = false; reasons.push('COMMIT_AUTHORITY_MISMATCH'); }
  if (committed && committed.evidenceId !== input.authorityInput.evidence.evidenceId) { commitValid = false; reasons.push('COMMIT_EVIDENCE_MISMATCH'); }

  const executionEvaluation = evaluateExecutionAttempt({ authorityInput: input.authorityInput, attempt: input.attempt });
  const executionPermitted = commitValid && executionEvaluation.executionPermitted && executionEvaluation.determination === 'ALLOW';
  const determination: AuthorityDetermination = executionPermitted ? 'ALLOW' : executionEvaluation.determination === 'ESCALATE' ? 'ESCALATE' : 'DENY';
  const status: ExecutionRecordStatus = executionPermitted ? 'EXECUTED' : 'REFUSED';
  reasons.push(...executionEvaluation.reasonCodes, executionPermitted ? 'EXECUTION_RECORD_ESTABLISHED' : 'EXECUTION_RECORD_REFUSED');
  const reasonCodes = [...new Set(reasons)];
  const executionId = recordId([committed?.commitId ?? 'NO-COMMIT', input.attempt.attemptId, input.attempt.attemptedAt, input.attempt.consequence, executionEvaluation.receipt.hash, status]);
  const record: ExecutionRecord = {
    executionId, status, attemptedAt: input.attempt.attemptedAt, executedAt: executionPermitted ? input.attempt.attemptedAt : null,
    assetId: input.authorityInput.asset.assetId, assetVersion: input.authorityInput.asset.version, routeId: input.authorityInput.asset.routeId,
    consequence: input.attempt.consequence, commitId: committed?.commitId ?? null, commitReceiptHash: prior.receipt.hash,
    executionAttemptReceiptHash: executionEvaluation.receipt.hash, executionAttemptReplayId: executionEvaluation.receipt.replayId,
    determination, executionPermitted, reasonCodes,
  };
  const recordReceipt = receipt({ canonicalVersion: 'TA14.GCEA.EXECUTION_RECORD.v1', priorCommitReceiptHash: prior.receipt.hash, executionAttemptReceiptHash: executionEvaluation.receipt.hash, record, determination, executionPermitted, reasonCodes });
  return { determination, executionPermitted, record, receipt: recordReceipt };
}

export function buildExecutionLifecycleDemonstration(now = new Date()) {
  const t = now.toISOString();
  const asset = { assetId: 'TA14-DEMO-ASSET-001', version: '1.1.0', routeId: 'ROUTE-CONSEQUENCE-001', consequence: 'bounded_production_progression' };
  const authority = { authorityId: 'TA14-DEMO-AUTH-002', assetId: asset.assetId, assetVersion: asset.version, routeId: asset.routeId, consequence: asset.consequence, effectiveAt: new Date(now.getTime() - 3600000).toISOString(), expiresAt: new Date(now.getTime() + 3600000).toISOString(), revoked: false };
  const evidence = { evidenceId: 'TA14-DEMO-EVIDENCE-002', continuitySupported: true, admissibilitySupported: true };
  const baselineInput: ExecutionAuthorityInput = { asset, authority, change: null, evidence, now: t };
  const baselineCommit = evaluateCommit(baselineInput);
  const allowed = createExecutionRecord({ commitEvaluation: baselineCommit, authorityInput: baselineInput, attempt: { attemptId: 'TA14-DEMO-EXEC-ALLOW-001', attemptedAt: t, consequence: asset.consequence } });

  const challengedInput: ExecutionAuthorityInput = { ...baselineInput, change: { changeId: 'TA14-DEMO-CHANGE-002', detectedAt: t, category: 'MODEL', material: true, description: 'Material change challenges present standing without rewriting the historical commit.' } };
  const refused = createExecutionRecord({ commitEvaluation: baselineCommit, authorityInput: challengedInput, attempt: { attemptId: 'TA14-DEMO-EXEC-DENY-001', attemptedAt: t, consequence: asset.consequence } });

  const restoredAuthority = { ...authority, authorityId: 'TA14-DEMO-AUTH-003' };
  const restoredEvidence = { ...evidence, evidenceId: 'TA14-DEMO-EVIDENCE-003' };
  const restoredInput: ExecutionAuthorityInput = { asset, authority: restoredAuthority, change: null, evidence: restoredEvidence, now: t };
  const restoredCommit = evaluateCommit(restoredInput);
  const restored = createExecutionRecord({ commitEvaluation: restoredCommit, authorityInput: restoredInput, attempt: { attemptId: 'TA14-DEMO-EXEC-RESTORED-001', attemptedAt: t, consequence: asset.consequence } });
  return { baselineCommit, restoredCommit, allowed, refused, restored };
}
