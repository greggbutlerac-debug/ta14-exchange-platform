import { createHash, timingSafeEqual } from 'node:crypto';

export const TA14_ACCEPTANCE_EXECUTOR_ID = 'TA14_ACCEPTANCE_EXECUTOR_V1' as const;
export const TA14_ACCEPTANCE_FIXTURE_PREFIX = 'TA14-ACCEPTANCE-' as const;

export type TA14AcceptanceExecutorDecision =
  | { authorized: true; executorId: typeof TA14_ACCEPTANCE_EXECUTOR_ID }
  | { authorized: false; reason: string };

function digest(value: string) {
  return createHash('sha256').update(value, 'utf8').digest();
}

function constantTimeEqual(left: string, right: string) {
  return timingSafeEqual(digest(left), digest(right));
}

export function verifyTA14AcceptanceExecutor(input: {
  presentedCredential: string | null;
  recordId: string | null | undefined;
  fixtureMarker: string | null;
}): TA14AcceptanceExecutorDecision {
  const configuredCredential = process.env.TA14_ACCEPTANCE_EXECUTOR_SECRET?.trim();
  if (!configuredCredential) return { authorized: false, reason: 'Acceptance executor credential is not configured.' };
  if (!input.presentedCredential) return { authorized: false, reason: 'Acceptance executor credential is absent.' };
  if (!constantTimeEqual(input.presentedCredential, configuredCredential)) return { authorized: false, reason: 'Acceptance executor credential is invalid.' };
  if (input.fixtureMarker !== 'acceptance-only') return { authorized: false, reason: 'Explicit acceptance-only fixture marker is required.' };
  if (!input.recordId?.startsWith(TA14_ACCEPTANCE_FIXTURE_PREFIX)) return { authorized: false, reason: `Acceptance fixture recordId must begin with ${TA14_ACCEPTANCE_FIXTURE_PREFIX}.` };
  return { authorized: true, executorId: TA14_ACCEPTANCE_EXECUTOR_ID };
}

export function acceptanceExecutorCredentialFrom(request: Request) {
  return request.headers.get('x-ta14-acceptance-executor')?.trim() || null;
}

export function acceptanceFixtureMarkerFrom(request: Request) {
  return request.headers.get('x-ta14-acceptance-fixture')?.trim() || null;
}
