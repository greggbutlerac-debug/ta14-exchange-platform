import { buildExecutionLifecycleDemonstration } from '@/lib/governance-continuity-execution-lifecycle';
import { buildOutcomeDemonstration } from '@/lib/governance-continuity-outcome-record';

export type CompleteLifecycleVerification = {
  status: 'PASS' | 'FAIL';
  checks: Record<string, boolean>;
  failures: string[];
};

export function verifyCompleteGceaLifecycle(now = new Date()): CompleteLifecycleVerification {
  const execution = buildExecutionLifecycleDemonstration(now);
  const outcome = buildOutcomeDemonstration({
    executed: execution.allowed.record,
    refused: execution.refused.record,
    now: now.toISOString(),
  });

  const checks = {
    allowed_execution_has_commit: Boolean(execution.allowed.record.commitId),
    allowed_execution_status_executed: execution.allowed.record.status === 'EXECUTED',
    allowed_execution_permitted: execution.allowed.executionPermitted === true,
    refused_execution_has_no_commit: execution.refused.record.commitId === null,
    refused_execution_status_refused: execution.refused.record.status === 'REFUSED',
    refused_execution_permitted_false: execution.refused.executionPermitted === false,
    observed_outcome_links_executed_record: outcome.observed.executionId === execution.allowed.record.executionId && outcome.observed.executionStatus === 'EXECUTED',
    observed_outcome_has_evidence: Boolean(outcome.observed.evidenceId),
    refused_outcome_links_refused_record: outcome.refused.executionId === execution.refused.record.executionId && outcome.refused.executionStatus === 'REFUSED',
    refused_outcome_not_observed: outcome.refused.outcomeStatus === 'NOT_OBSERVED',
    refused_outcome_cannot_claim_execution: outcome.refused.reasonCodes.includes('OUTCOME_EXECUTION_NOT_ESTABLISHED'),
  };

  const failures = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
  return { status: failures.length === 0 ? 'PASS' : 'FAIL', checks, failures };
}
