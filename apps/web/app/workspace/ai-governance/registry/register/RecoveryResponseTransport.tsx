'use client';

import { useEffect } from 'react';

const RECOVERY_ROUTE = '/api/ai-governance/registry/registration-recovery';

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function stableErrorText(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (value instanceof Error && value.message.trim()) return value.message.trim();
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (typeof record.message === 'string' && record.message.trim()) return record.message.trim();
    if (typeof record.details === 'string' && record.details.trim()) return record.details.trim();
    try {
      const serialized = JSON.stringify(value);
      if (serialized && serialized !== '{}') return serialized.slice(0, 1000);
    } catch {
      // Use the stable fallback below.
    }
  }
  return fallback;
}

export default function RecoveryResponseTransport() {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    const governedFetch: typeof window.fetch = async (input, init) => {
      const url = requestUrl(input);
      if (!url.includes(RECOVERY_ROUTE)) return originalFetch(input, init);

      const response = await originalFetch(input, init);
      const contentType = response.headers.get('content-type') ?? '';
      const raw = await response.clone().text();

      let payload: Record<string, unknown> = {};
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          payload = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
            ? (parsed as Record<string, unknown>)
            : {};
        } catch {
          payload = { error: raw.slice(0, 1000) };
        }
      }

      if (!response.ok) {
        payload.error = stableErrorText(
          payload.error,
          `Unable to preserve registration recovery state (${response.status}).`,
        );
      }

      if (!contentType.includes('application/json') || !raw || typeof payload.error !== 'string') {
        return new Response(JSON.stringify(payload), {
          status: response.status,
          statusText: response.statusText,
          headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
        });
      }

      return response;
    };

    window.fetch = governedFetch;
    return () => {
      if (window.fetch === governedFetch) window.fetch = originalFetch;
    };
  }, []);

  return null;
}
