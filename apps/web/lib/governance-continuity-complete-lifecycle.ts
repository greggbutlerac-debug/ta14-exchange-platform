import { buildExecutionLifecycleDemonstration } from '@/lib/governance-continuity-execution-lifecycle';
import { buildOutcomeDemonstration } from '@/lib/governance-continuity-outcome-record';

export type CompleteLifecycleVerification = { status: 'PASS' | 'FAIL'; checks: Record<string, boolean>; failures: string[] };

export function verifyCompleteGceaLifecycle(now = new Date()): CompleteLifecycleVerification {
  const execution = buildExecutionLifecycleDemonstration(now);
  const outcome = buildOutcomeDemonstration({ executed: execution.allowed, refused: execution.refused, now: now.toISOString() });
  const checks = {
    prior_commit_permitted: execution.baselineCommit.commitPermitted === true && Boolean(execution.baselineCommit.commit),
    current_prior_commit_executes: execution.allowed.record.status === 'EXECUTED' && execution.allowed.executionPermitted === true,
    challenged_execution_retains_same_historical_commit: execution.refused.record.commitId === execution.baselineCommit.commit?.commitId,
    challenged_execution_refused: execution.refused.record.status === 'REFUSED' && execution.refused.executionPermitted === false,
    challenged_execution_record_receipt_present: Boolean(execution.refused.receipt.hash && execution.refused.receipt.replayId),
    reauthorization_requires_new_commit: execution.restoredCommit.commit?.commitId !== execution.baselineCommit.commit?.commitId,
    restored_new_commit_executes: execution.restored.record.status === 'EXECUTED' && execution.restored.executionPermitted === true,
    observed_outcome_established_only_from_execution: outcome.observed.outcomePermitted === true && outcome.observed.outcome?.executionId === execution.allowed.record.executionId,
    observed_outcome_receipt_present: Boolean(outcome.observed.receipt.hash && outcome.observed.receipt.replayId),
    refused_execution_cannot_establish_outcome: outcome.refused.outcomePermitted === false && outcome.refused.outcome === null,
    refused_outcome_reason_preserved: outcome.refused.reasonCodes.includes('OUTCOME_EXECUTION_NOT_ESTABLISHED'),
  };
  const failures = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
  return { status: failures.length === 0 ? 'PASS' : 'FAIL', checks, failures };
}
