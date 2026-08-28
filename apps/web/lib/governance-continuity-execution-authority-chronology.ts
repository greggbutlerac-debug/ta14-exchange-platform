import { createHash } from 'node:crypto';
import { evaluateExecutionAuthority, type AuthorityEvaluation, type ExecutionAuthorityInput, type GovernedAsset } from '@/lib/governance-continuity-execution-authority';

export type GceaEventType = 'BASELINE' | 'MATERIAL_CHANGE' | 'AUTHORITY_CHALLENGE' | 'BOUNDARY_DETERMINATION' | 'REAUTHORIZATION' | 'RESTORATION' | 'REPLAY_VERIFICATION';
export type GceaChronologyEvent = { runId: string; sequenceNo: number; eventType: GceaEventType; assetId: string; assetVersion: string; routeId: string; determination: AuthorityEvaluation['determination'] | null; standing: AuthorityEvaluation['standing'] | null; receiptHash: string; replayId: string; eventPayload: unknown; previousEventHash: string | null; eventHash: string };

function stable(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(',')}}`;
}
export function sha256(value: unknown): string { return createHash('sha256').update(stable(value)).digest('hex'); }

export function makeChronologyEvent(input: { runId: string; sequenceNo: number; eventType: GceaEventType; asset: GovernedAsset; evaluation: AuthorityEvaluation; authorityInput?: ExecutionAuthorityInput; previousEventHash?: string | null; additionalPayload?: unknown }): GceaChronologyEvent {
  const base = { runId: input.runId, sequenceNo: input.sequenceNo, eventType: input.eventType, assetId: input.asset.assetId, assetVersion: input.asset.version, routeId: input.asset.routeId, determination: input.evaluation.determination, standing: input.evaluation.standing, receiptHash: input.evaluation.receipt.hash, replayId: input.evaluation.receipt.replayId, eventPayload: { input: input.authorityInput ?? null, receipt: input.evaluation.receipt.payload, additional: input.additionalPayload ?? null }, previousEventHash: input.previousEventHash ?? null };
  return { ...base, eventHash: sha256(base) };
}

export function verifyChronology(events: GceaChronologyEvent[]) {
  const ordered = [...events].sort((a, b) => a.sequenceNo - b.sequenceNo);
  const failures: string[] = [];
  let semanticReplayCount = 0;
  ordered.forEach((event, index) => {
    if (event.sequenceNo !== index + 1) failures.push(`SEQUENCE_GAP:${event.sequenceNo}`);
    const { eventHash, ...base } = event;
    if (sha256(base) !== eventHash) failures.push(`EVENT_HASH_MISMATCH:${event.sequenceNo}`);
    const expectedPrevious = index === 0 ? null : ordered[index - 1].eventHash;
    if (event.previousEventHash !== expectedPrevious) failures.push(`CHAIN_MISMATCH:${event.sequenceNo}`);
    const payload = event.eventPayload as { input?: ExecutionAuthorityInput | null; receipt?: unknown };
    if (sha256(payload?.receipt) !== event.receiptHash) failures.push(`RECEIPT_REPLAY_MISMATCH:${event.sequenceNo}`);
    if (payload?.input) {
      semanticReplayCount += 1;
      const replay = evaluateExecutionAuthority(payload.input);
      if (replay.receipt.hash !== event.receiptHash) failures.push(`SEMANTIC_RECEIPT_MISMATCH:${event.sequenceNo}`);
      if (replay.receipt.replayId !== event.replayId) failures.push(`SEMANTIC_REPLAY_ID_MISMATCH:${event.sequenceNo}`);
      if (replay.determination !== event.determination) failures.push(`SEMANTIC_DETERMINATION_MISMATCH:${event.sequenceNo}`);
      if (replay.standing !== event.standing) failures.push(`SEMANTIC_STANDING_MISMATCH:${event.sequenceNo}`);
    }
  });
  return { status: failures.length === 0 ? 'PASS' as const : 'FAIL' as const, eventCount: ordered.length, semanticReplayCount, failures, terminalHash: ordered.at(-1)?.eventHash ?? null };
}
