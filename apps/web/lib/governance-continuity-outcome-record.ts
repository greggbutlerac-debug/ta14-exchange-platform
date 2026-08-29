import { createHash } from 'node:crypto';
import type { AuthorityDetermination } from '@/lib/governance-continuity-execution-authority';
import type { ExecutionRecordEvaluation } from '@/lib/governance-continuity-execution-lifecycle';

export type OutcomeStatus = 'OBSERVED' | 'NOT_OBSERVED' | 'INDETERMINATE';
export type OutcomeRecord = { outcomeId: string; recordedAt: string; executionId: string; assetId: string; assetVersion: string; routeId: string; consequence: string; outcomeStatus: OutcomeStatus; observedEffect: string | null; evidenceId: string; sourceExecutionRecordReceiptHash: string; sourceExecutionRecordReplayId: string; sourceCommitId: string; reasonCodes: string[] };
export type OutcomeReceipt = { algorithm: 'SHA-256'; canonicalVersion: 'TA14.GCEA.OUTCOME.v1'; hash: string; replayId: string; payload: unknown };
export type OutcomeEvaluation = { determination: AuthorityDetermination; outcomePermitted: boolean; outcome: OutcomeRecord | null; reasonCodes: string[]; receipt: OutcomeReceipt };

function stable(value: unknown): string { if (value === null || typeof value !== 'object') return JSON.stringify(value); if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`; return `{${Object.entries(value as Record<string, unknown>).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${stable(v)}`).join(',')}}`; }
function digest(value: string) { return createHash('sha256').update(value).digest('hex'); }
function receipt(payload: unknown): OutcomeReceipt { const hash = digest(stable(payload)); return { algorithm: 'SHA-256', canonicalVersion: 'TA14.GCEA.OUTCOME.v1', hash, replayId: `TA14-GCEA-OUTCOME-${hash.slice(0,20).toUpperCase()}`, payload }; }

export function createOutcomeRecord(input: { execution: ExecutionRecordEvaluation; recordedAt: string; outcomeStatus: OutcomeStatus; observedEffect?: string | null; evidenceId?: string | null }): OutcomeEvaluation {
  const reasons: string[] = [];
  let determination: AuthorityDetermination = 'ALLOW';
  let permitted = true;
  const execution = input.execution.record;
  if (execution.status !== 'EXECUTED' || !execution.executedAt || !input.execution.executionPermitted) { permitted = false; determination = 'DENY'; reasons.push('OUTCOME_EXECUTION_NOT_ESTABLISHED'); }
  if (execution.executedAt && new Date(input.recordedAt).getTime() < new Date(execution.executedAt).getTime()) { permitted = false; determination = 'DENY'; reasons.push('OUTCOME_PRECEDES_EXECUTION'); }
  if (!input.evidenceId?.trim()) { permitted = false; if (determination !== 'DENY') determination = 'HOLD'; reasons.push('OUTCOME_EVIDENCE_ABSENT'); }
  if (input.outcomeStatus === 'OBSERVED' && !input.observedEffect?.trim()) { permitted = false; if (determination !== 'DENY') determination = 'HOLD'; reasons.push('OUTCOME_EFFECT_DESCRIPTION_ABSENT'); }
  if (permitted) reasons.push('OUTCOME_BOUNDARY_ESTABLISHED'); else reasons.push('OUTCOME_BOUNDARY_REFUSED');

  let outcome: OutcomeRecord | null = null;
  if (permitted) {
    const hash = digest([execution.executionId, input.recordedAt, input.outcomeStatus, input.observedEffect ?? 'NO-EFFECT', input.evidenceId!, input.execution.receipt.hash].join(':'));
    outcome = { outcomeId: `TA14-GCEA-OUTCOME-${hash.slice(0,20).toUpperCase()}`, recordedAt: input.recordedAt, executionId: execution.executionId, assetId: execution.assetId, assetVersion: execution.assetVersion, routeId: execution.routeId, consequence: execution.consequence, outcomeStatus: input.outcomeStatus, observedEffect: input.observedEffect ?? null, evidenceId: input.evidenceId!, sourceExecutionRecordReceiptHash: input.execution.receipt.hash, sourceExecutionRecordReplayId: input.execution.receipt.replayId, sourceCommitId: execution.commitId!, reasonCodes: reasons };
  }
  const outcomeReceipt = receipt({ canonicalVersion: 'TA14.GCEA.OUTCOME.v1', executionRecordReceiptHash: input.execution.receipt.hash, executionRecordReplayId: input.execution.receipt.replayId, executionId: execution.executionId, commitId: execution.commitId, scope: { assetId: execution.assetId, assetVersion: execution.assetVersion, routeId: execution.routeId, consequence: execution.consequence }, recordedAt: input.recordedAt, requestedOutcome: { outcomeStatus: input.outcomeStatus, observedEffect: input.observedEffect ?? null, evidenceId: input.evidenceId ?? null }, determination, outcomePermitted: permitted, outcome, reasonCodes: reasons });
  return { determination, outcomePermitted: permitted, outcome, reasonCodes: reasons, receipt: outcomeReceipt };
}

export function buildOutcomeDemonstration(input: { executed: ExecutionRecordEvaluation; refused: ExecutionRecordEvaluation; now: string }) {
  const observed = createOutcomeRecord({ execution: input.executed, recordedAt: input.now, outcomeStatus: 'OBSERVED', observedEffect: 'Bounded production progression completed within the declared route.', evidenceId: 'TA14-DEMO-OUTCOME-EVIDENCE-001' });
  const refused = createOutcomeRecord({ execution: input.refused, recordedAt: input.now, outcomeStatus: 'NOT_OBSERVED', evidenceId: 'TA14-DEMO-OUTCOME-EVIDENCE-002' });
  return { observed, refused };
}
