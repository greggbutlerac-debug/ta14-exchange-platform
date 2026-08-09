'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type DeliveryHealth = 'healthy' | 'attention' | 'idle';

type DeliveryStatusResponse = {
  ok?: boolean;
  health?: DeliveryHealth;
  summary?: {
    deliveredCount?: number;
    failedCount?: number;
    uniqueNotificationsDelivered?: number;
    latestAttemptAt?: string | null;
    latestDeliveryAt?: string | null;
  };
  error?: string;
};

type RegistryDeliveryHealthProps = {
  className?: string;
  refreshIntervalMs?: number;
};

const DEFAULT_REFRESH_INTERVAL_MS = 60_000;

export function RegistryDeliveryHealth({
  className = '',
  refreshIntervalMs = DEFAULT_REFRESH_INTERVAL_MS,
}: RegistryDeliveryHealthProps) {
  const [payload, setPayload] =
    useState<DeliveryStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  const mountedRef = useRef(true);
  const requestInFlightRef = useRef(false);

  const load = useCallback(async () => {
    if (requestInFlightRef.current) return;

    requestInFlightRef.current = true;

    try {
      const response = await fetch(
        '/api/ai-governance/registry/admin-notifications/delivery-status',
        {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        if (mountedRef.current) {
          setUnavailable(true);
        }
        return;
      }

      const next =
        (await response.json()) as DeliveryStatusResponse;

      if (mountedRef.current) {
        setPayload(next);
        setUnavailable(false);
      }
    } catch {
      if (mountedRef.current) {
        setUnavailable(true);
      }
    } finally {
      requestInFlightRef.current = false;

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

  const health = payload?.health ?? 'idle';
  const delivered =
    payload?.summary?.deliveredCount ?? 0;
  const failed = payload?.summary?.failedCount ?? 0;

  const label = loading
    ? 'Checking delivery'
    : unavailable
      ? 'Delivery status unavailable'
      : health === 'attention'
        ? `${failed} failed delivery ${
            failed === 1 ? 'attempt' : 'attempts'
          }`
        : health === 'healthy'
          ? `${delivered} email ${
              delivered === 1 ? 'delivery' : 'deliveries'
            } recorded`
          : 'Email delivery idle';

  return (
    <div
      className={[
        'ta14-registry-delivery-health',
        `is-${health}`,
        unavailable ? 'is-unavailable' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      title={label}
      aria-label={`Registry notification email status: ${label}`}
    >
      <span
        className="ta14-registry-delivery-health__signal"
        aria-hidden="true"
      />

      <span className="ta14-registry-delivery-health__copy">
        <span className="ta14-registry-delivery-health__eyebrow">
          Email delivery
        </span>
        <span className="ta14-registry-delivery-health__label">
          {label}
        </span>
      </span>

      <style jsx>{`
        .ta14-registry-delivery-health {
          display: inline-flex;
          min-height: 42px;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 13px;
          padding: 8px 11px;
          background: rgba(255, 255, 255, 0.025);
        }

        .ta14-registry-delivery-health__signal {
          width: 9px;
          height: 9px;
          flex: 0 0 9px;
          border-radius: 999px;
          background: currentColor;
          opacity: 0.65;
        }

        .ta14-registry-delivery-health.is-healthy
          .ta14-registry-delivery-health__signal {
          box-shadow: 0 0 14px currentColor;
          opacity: 0.9;
        }

        .ta14-registry-delivery-health.is-attention {
          border-color: rgba(255, 199, 95, 0.42);
        }

        .ta14-registry-delivery-health.is-attention
          .ta14-registry-delivery-health__signal {
          box-shadow: 0 0 14px currentColor;
          opacity: 1;
        }

        .ta14-registry-delivery-health.is-unavailable {
          opacity: 0.58;
        }

        .ta14-registry-delivery-health__copy {
          display: grid;
          gap: 2px;
        }

        .ta14-registry-delivery-health__eyebrow {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
          opacity: 0.5;
          text-transform: uppercase;
        }

        .ta14-registry-delivery-health__label {
          font-size: 10px;
          font-weight: 800;
          line-height: 1.2;
        }
      `}</style>
    </div>
  );
}
