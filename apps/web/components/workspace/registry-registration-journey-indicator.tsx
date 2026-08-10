'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type JourneySummary = {
  totalAccounts: number;
  accountOnly: number;
  opened: number;
  started: number;
  draftSaved: number;
  submitted: number;
  registered: number;
  failed: number;
  stalled: number;
  inProgress: number;
  needsAttention: number;
};

type JourneySummaryResponse = {
  ok?: boolean;
  summary?: JourneySummary;
  error?: string;
};

type RegistryRegistrationJourneyIndicatorProps = {
  className?: string;
  refreshIntervalMs?: number;
};

const DEFAULT_REFRESH_INTERVAL_MS = 60_000;

function normalizeCount(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.trunc(value));
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.trunc(parsed));
    }
  }

  return 0;
}

export function RegistryRegistrationJourneyIndicator({
  className = '',
  refreshIntervalMs = DEFAULT_REFRESH_INTERVAL_MS,
}: RegistryRegistrationJourneyIndicatorProps) {
  const [summary, setSummary] = useState<JourneySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);

  const load = useCallback(async () => {
    if (inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;

    try {
      const response = await fetch(
        '/api/ai-governance/registry/admin-registration-journeys?limit=500',
        {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const payload =
        (await response.json().catch(() => null)) as
          | JourneySummaryResponse
          | null;

      if (!response.ok || !payload?.summary) {
        if (mountedRef.current) {
          setUnavailable(true);
        }

        return;
      }

      const next: JourneySummary = {
        totalAccounts: normalizeCount(payload.summary.totalAccounts),
        accountOnly: normalizeCount(payload.summary.accountOnly),
        opened: normalizeCount(payload.summary.opened),
        started: normalizeCount(payload.summary.started),
        draftSaved: normalizeCount(payload.summary.draftSaved),
        submitted: normalizeCount(payload.summary.submitted),
        registered: normalizeCount(payload.summary.registered),
        failed: normalizeCount(payload.summary.failed),
        stalled: normalizeCount(payload.summary.stalled),
        inProgress: normalizeCount(payload.summary.inProgress),
        needsAttention: normalizeCount(payload.summary.needsAttention),
      };

      if (mountedRef.current) {
        setSummary(next);
        setUnavailable(false);
      }
    } catch {
      if (mountedRef.current) {
        setUnavailable(true);
      }
    } finally {
      inFlightRef.current = false;

      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    void load();

    const interval =
      refreshIntervalMs > 0
        ? window.setInterval(
            () => void load(),
            refreshIntervalMs,
          )
        : null;

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void load();
      }
    };

    window.addEventListener('focus', load);
    document.addEventListener(
      'visibilitychange',
      handleVisibility,
    );

    return () => {
      mountedRef.current = false;

      if (interval !== null) {
        window.clearInterval(interval);
      }

      window.removeEventListener('focus', load);
      document.removeEventListener(
        'visibilitychange',
        handleVisibility,
      );
    };
  }, [load, refreshIntervalMs]);

  const active = summary?.inProgress ?? 0;
  const failed = summary?.failed ?? 0;
  const stalled = summary?.stalled ?? 0;
  const needsAttention = summary?.needsAttention ?? 0;

  const label = loading
    ? 'Checking registration journeys'
    : unavailable
      ? 'Registration journey status unavailable'
      : needsAttention > 0
        ? `${needsAttention} registration ${
            needsAttention === 1 ? 'journey needs' : 'journeys need'
          } attention`
        : active > 0
          ? `${active} registration ${
              active === 1 ? 'journey is' : 'journeys are'
            } in progress`
          : 'No registration journeys need attention';

  return (
    <div
      className={[
        'ta14-registration-journey-indicator',
        active > 0 ? 'has-active' : '',
        needsAttention > 0 ? 'needs-attention' : '',
        failed > 0 ? 'has-failed' : '',
        stalled > 0 ? 'has-stalled' : '',
        unavailable ? 'is-unavailable' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={label}
      title={label}
    >
      <div className="ta14-registration-journey-indicator__heading">
        <span
          className="ta14-registration-journey-indicator__signal"
          aria-hidden="true"
        />

        <div>
          <span className="ta14-registration-journey-indicator__eyebrow">
            Registration journeys
          </span>

          <strong className="ta14-registration-journey-indicator__label">
            {label}
          </strong>
        </div>
      </div>

      {!loading && !unavailable && summary ? (
        <div className="ta14-registration-journey-indicator__metrics">
          <span>
            <strong>{summary.opened}</strong>
            Opened
          </span>

          <span>
            <strong>{summary.started}</strong>
            Started
          </span>

          <span>
            <strong>{summary.draftSaved}</strong>
            Drafts
          </span>

          <span>
            <strong>{summary.submitted}</strong>
            Submitted
          </span>

          <span>
            <strong>{summary.inProgress}</strong>
            In progress
          </span>

          <span>
            <strong>{summary.stalled}</strong>
            Stalled
          </span>

          <span>
            <strong>{summary.failed}</strong>
            Failed
          </span>

          <span>
            <strong>{summary.needsAttention}</strong>
            Attention
          </span>
        </div>
      ) : null}

      <style jsx>{`
        .ta14-registration-journey-indicator {
          display: grid;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 13px;
          padding: 10px 11px;
          background: rgba(255, 255, 255, 0.025);
        }

        .ta14-registration-journey-indicator.has-active {
          border-color: rgba(126, 231, 135, 0.36);
        }

        .ta14-registration-journey-indicator.needs-attention {
          border-color: rgba(255, 199, 95, 0.58);
          box-shadow: inset 0 0 0 1px rgba(255, 199, 95, 0.08);
        }

        .ta14-registration-journey-indicator.has-failed {
          border-color: rgba(255, 118, 118, 0.58);
        }

        .ta14-registration-journey-indicator.has-stalled:not(.has-failed) {
          border-color: rgba(255, 199, 95, 0.58);
        }

        .ta14-registration-journey-indicator.is-unavailable {
          opacity: 0.58;
        }

        .ta14-registration-journey-indicator__heading {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .ta14-registration-journey-indicator__signal {
          width: 9px;
          height: 9px;
          flex: 0 0 9px;
          border-radius: 999px;
          background: currentColor;
          opacity: 0.62;
        }

        .has-active
          .ta14-registration-journey-indicator__signal {
          box-shadow: 0 0 14px currentColor;
          opacity: 0.92;
        }

        .has-failed
          .ta14-registration-journey-indicator__signal {
          box-shadow: 0 0 14px currentColor;
          opacity: 1;
        }

        .ta14-registration-journey-indicator__eyebrow {
          display: block;
          margin-bottom: 2px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
          opacity: 0.5;
          text-transform: uppercase;
        }

        .ta14-registration-journey-indicator__label {
          font-size: 10px;
          line-height: 1.3;
        }

        .ta14-registration-journey-indicator__metrics {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 6px;
        }

        .ta14-registration-journey-indicator__metrics span {
          display: grid;
          gap: 2px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 9px;
          padding: 6px;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.06em;
          opacity: 0.62;
          text-transform: uppercase;
        }

        .ta14-registration-journey-indicator__metrics strong {
          font-size: 12px;
          opacity: 1;
        }

        @media (max-width: 680px) {
          .ta14-registration-journey-indicator__metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
