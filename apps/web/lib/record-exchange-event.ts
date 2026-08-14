export type ExchangeEventType =
  | 'TESTED'
  | 'FORKED'
  | 'CHALLENGED'
  | 'REVALIDATED'
  | 'DEGRADED'
  | 'REVISED'
  | 'REVIEWED';

export type ExchangeEventInput = {
  routeId: string;
  eventType: ExchangeEventType;
  eventState: string;
  summary: string;
  sourceRouteId?: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
  eventData?: Record<string, unknown>;
};

export type ExchangeEventResult =
  | { ok: true; event: Record<string, unknown> }
  | { ok: false; reason: 'AUTH_REQUIRED' | 'NOT_RECORDED' | 'NETWORK_ERROR'; status?: number };

/**
 * Best-effort governed Exchange event recorder.
 *
 * Product actions must never be represented as recorded merely because the
 * client attempted this call. Consumers should use the returned result when
 * they need to show a persistence receipt to the participant.
 */
export async function recordExchangeEvent(input: ExchangeEventInput): Promise<ExchangeEventResult> {
  try {
    const response = await fetch('/api/exchange/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(input),
    });

    if (response.status === 401) {
      return { ok: false, reason: 'AUTH_REQUIRED', status: 401 };
    }

    if (!response.ok) {
      return { ok: false, reason: 'NOT_RECORDED', status: response.status };
    }

    const payload = (await response.json()) as { event?: Record<string, unknown> };
    return { ok: true, event: payload.event ?? {} };
  } catch {
    return { ok: false, reason: 'NETWORK_ERROR' };
  }
}
