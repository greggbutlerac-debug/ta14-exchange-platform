import { createHash } from 'node:crypto';
import {
  evaluateCommit,
  evaluateExecutionAttempt,
  type CommitRecord,
  type ExecutionAuthorityInput,
  type ExecutionAttempt,
  type AuthorityDetermination,
} from '@/lib/governance-continuity-execution-authority';

export type ExecutionRecordStatus = 'EXECUTED' | 'REFUSED';

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
  executionReceiptHash: string;
  executionReplayId: string;
  determination: AuthorityDetermination;
  executionPermitted: boolean;
  reasonCodes: string[];
};

export type ExecutionRecordEvaluation = {
  determination: AuthorityDetermination;
  executionPermitted: boolean;
  record: ExecutionRecord;
};

function digest(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function recordId(parts: string[]) {
  const hash = digest(parts.join(':'));
  return `TA14-GCEA-EXEC-${hash.slice(0, 20).toUpperCase()}`;
}

export function createExecutionRecord(input: {
  authorityInput: ExecutionAuthorityInput;
  attempt: ExecutionAttempt;
}): ExecutionRecordEvaluation {
  const commitEvaluation = evaluateCommit({ ...input.authorityInput, now: input.attempt.attemptedAt });
  const executionEvaluation = evaluateExecutionAttempt({ authorityInput: input.authorityInput, attempt: input.attempt });

  const committed: CommitRecord | null = commitEvaluation.commit;
  const executionPermitted = Boolean(
    commitEvaluation.commitPermitted &&
    committed &&
    executionEvaluation.executionPermitted &&
    executionEvaluation.determination === 'ALLOW'
  );

  const determination: AuthorityDetermination = executionPermitted ? 'ALLOW' : executionEvaluation.determination === 'ALLOW' ? 'DENY' : executionEvaluation.determination;
  const status: ExecutionRecordStatus = executionPermitted ? 'EXECUTED' : 'REFUSED';
  const reasonCodes = [...new Set([
    ...commitEvaluation.reasonCodes,
    ...executionEvaluation.reasonCodes,
    executionPermitted ? 'EXECUTION_RECORD_ESTABLISHED' : 'EXECUTION_RECORD_REFUSED',
  ])];

  const executionId = recordId([
    committed?.commitId ?? 'NO-COMMIT',
    input.attempt.attemptId,
    input.attempt.attemptedAt,
    input.attempt.consequence,
    executionEvaluation.receipt.hash,
    status,
  ]);

  const record: ExecutionRecord = {
    executionId,
    status,
    attemptedAt: input.attempt.attemptedAt,
    executedAt: executionPermitted ? input.attempt.attemptedAt : null,
    assetId: input.authorityInput.asset.assetId,
    assetVersion: input.authorityInput.asset.version,
    routeId: input.authorityInput.asset.routeId,
    consequence: input.attempt.consequence,
    commitId: committed?.commitId ?? null,
    commitReceiptHash: commitEvaluation.receipt.hash,
    executionReceiptHash: executionEvaluation.receipt.hash,
    executionReplayId: executionEvaluation.receipt.replayId,
    determination,
    executionPermitted,
    reasonCodes,
  };

  return { determination, executionPermitted, record };
}

export function buildExecutionLifecycleDemonstration(now = new Date()) {
  const asset = {
    assetId: 'TA14-DEMO-ASSET-001',
    version: '1.1.0',
    routeId: 'ROUTE-CONSEQUENCE-001',
    consequence: 'bounded_production_progression',
  };
  const authority = {
    authorityId: 'TA14-DEMO-AUTH-002',
    assetId: asset.assetId,
    assetVersion: asset.version,
    routeId: asset.routeId,
    consequence: asset.consequence,
    effectiveAt: new Date(now.getTime() - 3600000).toISOString(),
    expiresAt: new Date(now.getTime() + 3600000).toISOString(),
    revoked: false,
  };
  const evidence = { evidenceId: 'TA14-DEMO-EVIDENCE-002', continuitySupported: true, admissibilitySupported: true };
  const authorityInput: ExecutionAuthorityInput = { asset, authority, change: null, evidence, now: now.toISOString() };
  const allowed = createExecutionRecord({ authorityInput, attempt: { attemptId: 'TA14-DEMO-EXEC-ALLOW-001', attemptedAt: now.toISOString(), consequence: asset.consequence } });
  const challengedInput: ExecutionAuthorityInput = {
    ...authorityInput,
    change: { changeId: 'TA14-DEMO-CHANGE-002', detectedAt: now.toISOString(), category: 'MODEL', material: true, description: 'Material change blocks commit inheritance and execution.' },
  };
  const refused = createExecutionRecord({ authorityInput: challengedInput, attempt: { attemptId: 'TA14-DEMO-EXEC-DENY-001', attemptedAt: now.toISOString(), consequence: asset.consequence } });
  return { allowed, refused };
}
