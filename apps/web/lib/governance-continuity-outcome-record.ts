import { createHash } from 'node:crypto';
import type { ExecutionRecord } from '@/lib/governance-continuity-execution-lifecycle';

export type OutcomeStatus = 'OBSERVED' | 'NOT_OBSERVED' | 'INDETERMINATE';

export type OutcomeRecord = {
  outcomeId: string;
  recordedAt: string;
  executionId: string;
  executionStatus: ExecutionRecord['status'];
  assetId: string;
  assetVersion: string;
  routeId: string;
  consequence: string;
  outcomeStatus: OutcomeStatus;
  observedEffect: string | null;
  evidenceId: string | null;
  sourceExecutionReceiptHash: string;
  sourceCommitId: string | null;
  reasonCodes: string[];
};

function digest(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function createOutcomeRecord(input: {
  execution: ExecutionRecord;
  recordedAt: string;
  outcomeStatus: OutcomeStatus;
  observedEffect?: string | null;
  evidenceId?: string | null;
}): OutcomeRecord {
  const reasons: string[] = [];

  if (input.execution.status !== 'EXECUTED') {
    reasons.push('OUTCOME_EXECUTION_NOT_ESTABLISHED');
    if (input.outcomeStatus === 'OBSERVED') reasons.push('OUTCOME_OBSERVATION_CONFLICTS_WITH_REFUSED_EXECUTION');
  } else {
    reasons.push('OUTCOME_LINKED_TO_EXECUTION');
  }

  if (input.outcomeStatus === 'OBSERVED' && !input.observedEffect) reasons.push('OUTCOME_EFFECT_DESCRIPTION_ABSENT');
  if (input.outcomeStatus === 'OBSERVED' && !input.evidenceId) reasons.push('OUTCOME_EVIDENCE_ABSENT');
  if (input.outcomeStatus === 'NOT_OBSERVED') reasons.push('OUTCOME_NOT_OBSERVED');
  if (input.outcomeStatus === 'INDETERMINATE') reasons.push('OUTCOME_INDETERMINATE');

  const seed = [
    input.execution.executionId,
    input.recordedAt,
    input.outcomeStatus,
    input.observedEffect ?? 'NO-EFFECT',
    input.evidenceId ?? 'NO-EVIDENCE',
    input.execution.executionReceiptHash,
  ].join(':');
  const hash = digest(seed);

  return {
    outcomeId: `TA14-GCEA-OUTCOME-${hash.slice(0, 20).toUpperCase()}`,
    recordedAt: input.recordedAt,
    executionId: input.execution.executionId,
    executionStatus: input.execution.status,
    assetId: input.execution.assetId,
    assetVersion: input.execution.assetVersion,
    routeId: input.execution.routeId,
    consequence: input.execution.consequence,
    outcomeStatus: input.outcomeStatus,
    observedEffect: input.observedEffect ?? null,
    evidenceId: input.evidenceId ?? null,
    sourceExecutionReceiptHash: input.execution.executionReceiptHash,
    sourceCommitId: input.execution.commitId,
    reasonCodes: reasons,
  };
}

export function buildOutcomeDemonstration(input: { executed: ExecutionRecord; refused: ExecutionRecord; now: string }) {
  const observed = createOutcomeRecord({
    execution: input.executed,
    recordedAt: input.now,
    outcomeStatus: 'OBSERVED',
    observedEffect: 'Bounded production progression completed within the declared route.',
    evidenceId: 'TA14-DEMO-OUTCOME-EVIDENCE-001',
  });

  const refused = createOutcomeRecord({
    execution: input.refused,
    recordedAt: input.now,
    outcomeStatus: 'NOT_OBSERVED',
    observedEffect: null,
    evidenceId: 'TA14-DEMO-OUTCOME-EVIDENCE-002',
  });

  return { observed, refused };
}
