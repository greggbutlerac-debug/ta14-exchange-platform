import { createHash } from 'node:crypto';
import type { AuthorityEvaluation, GovernedAsset } from '@/lib/governance-continuity-execution-authority';

export type GceaEventType = 'BASELINE' | 'MATERIAL_CHANGE' | 'AUTHORITY_CHALLENGE' | 'BOUNDARY_DETERMINATION' | 'REAUTHORIZATION' | 'RESTORATION' | 'REPLAY_VERIFICATION';

export type GceaChronologyEvent = {
  runId: string;
  sequenceNo: number;
  eventType: GceaEventType;
  assetId: string;
  assetVersion: string;
  routeId: string;
  determination: AuthorityEvaluation['determination'] | null;
  standing: AuthorityEvaluation['standing'] | null;
  receiptHash: string;
  replayId: string;
  eventPayload: unknown;
  previousEventHash: string | null;
  eventHash: string;
};

function stable(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(',')}}`;
}

export function sha256(value: unknown): string {
  return createHash('sha256').update(stable(value)).digest('hex');
}

export function makeChronologyEvent(input: {
  runId: string;
  sequenceNo: number;
  eventType: GceaEventType;
  asset: GovernedAsset;
  evaluation: AuthorityEvaluation;
  previousEventHash?: string | null;
  additionalPayload?: unknown;
}): GceaChronologyEvent {
  const base = {
    runId: input.runId,
    sequenceNo: input.sequenceNo,
    eventType: input.eventType,
    assetId: input.asset.assetId,
    assetVersion: input.asset.version,
    routeId: input.asset.routeId,
    determination: input.evaluation.determination,
    standing: input.evaluation.standing,
    receiptHash: input.evaluation.receipt.hash,
    replayId: input.evaluation.receipt.replayId,
    eventPayload: { receipt: input.evaluation.receipt.payload, additional: input.additionalPayload ?? null },
    previousEventHash: input.previousEventHash ?? null,
  };
  return { ...base, eventHash: sha256(base) };
}

export function verifyChronology(events: GceaChronologyEvent[]) {
  const ordered = [...events].sort((a, b) => a.sequenceNo - b.sequenceNo);
  const failures: string[] = [];
  ordered.forEach((event, index) => {
    if (event.sequenceNo !== index + 1) failures.push(`SEQUENCE_GAP:${event.sequenceNo}`);
    const { eventHash, ...base } = event;
    if (sha256(base) !== eventHash) failures.push(`EVENT_HASH_MISMATCH:${event.sequenceNo}`);
    const expectedPrevious = index === 0 ? null : ordered[index - 1].eventHash;
    if (event.previousEventHash !== expectedPrevious) failures.push(`CHAIN_MISMATCH:${event.sequenceNo}`);
    if (sha256((event.eventPayload as { receipt?: unknown })?.receipt) !== event.receiptHash) failures.push(`RECEIPT_REPLAY_MISMATCH:${event.sequenceNo}`);
  });
  return { status: failures.length === 0 ? 'PASS' as const : 'FAIL' as const, eventCount: ordered.length, failures, terminalHash: ordered.at(-1)?.eventHash ?? null };
}
