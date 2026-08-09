'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

type NotificationSummary = {
  unreadCount: number;
  acknowledgedCount: number;
  resolvedCount: number;
  actionRequiredCount: number;
  totalCount: number;
};

type RegistryInboxResponse = {
  summary?: NotificationSummary;
  error?: string;
};

type RegistryInboxIndicatorProps = {
  className?: string;
  compact?: boolean;
  refreshIntervalMs?: number;
};

const DEFAULT_REFRESH_INTERVAL_MS = 60_000;
const REGISTRY_INBOX_HREF =
  '/workspace/ai-governance/registry/inbox';
const REGISTRY_INBOX_API =
  '/api/ai-governance/registry/admin-notifications?limit=1';

function normalizeCount(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.trunc(value));
}

export function RegistryInboxIndicator({
  className = '',
  compact = false,
  refreshIntervalMs = DEFAULT_REFRESH_INTERVAL_MS,
}: RegistryInboxIndicatorProps) {
  const [summary, setSummary] =
    useState<NotificationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  const mountedRef = useRef(true);
  const requestInFlightRef = useRef(false);

  const loadSummary = useCallback(async () => {
    if (requestInFlightRef.current) {
      return;
    }

    requestInFlightRef.current = true;

    try {
      const response = await fetch(REGISTRY_INBOX_API, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        if (mountedRef.current) {
          setUnavailable(true);
        }

        return;
      }

      const payload =
        (await response.json()) as RegistryInboxResponse;

      const nextSummary: NotificationSummary = {
        unreadCount: normalizeCount(
          payload.summary?.unreadCount,
        ),
        acknowledgedCount: normalizeCount(
          payload.summary?.acknowledgedCount,
        ),
        resolvedCount: normalizeCount(
          payload.summary?.resolvedCount,
        ),
        actionRequiredCount: normalizeCount(
          payload.summary?.actionRequiredCount,
        ),
        totalCount: normalizeCount(
          payload.summary?.totalCount,
        ),
      };

      if (mountedRef.current) {
        setSummary(nextSummary);
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

    void loadSummary();

    const interval =
      refreshIntervalMs > 0
        ? window.setInterval(
            () => void loadSummary(),
            refreshIntervalMs,
          )
        : null;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void loadSummary();
      }
    };

    window.addEventListener('focus', loadSummary);
    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    );

    return () => {
      mountedRef.current = false;

      if (interval !== null) {
        window.clearInterval(interval);
      }

      window.removeEventListener('focus', loadSummary);
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
    };
  }, [loadSummary, refreshIntervalMs]);

  const unreadCount = summary?.unreadCount ?? 0;
  const actionRequiredCount =
    summary?.actionRequiredCount ?? 0;
  const hasUnread = unreadCount > 0;
  const hasActionRequired = actionRequiredCount > 0;

  const statusLabel = loading
    ? 'Checking Registry Inbox'
    : unavailable
      ? 'Registry Inbox unavailable'
      : hasActionRequired
        ? `${actionRequiredCount} action required`
        : hasUnread
          ? `${unreadCount} unread registration ${
              unreadCount === 1 ? 'event' : 'events'
            }`
          : 'Registry Inbox clear';

  const ariaLabel = unavailable
    ? 'Open Registry Inbox. Notification count is temporarily unavailable.'
    : hasActionRequired
      ? `Open Registry Inbox. ${actionRequiredCount} ${
          actionRequiredCount === 1
            ? 'notification requires'
            : 'notifications require'
        } action and ${unreadCount} ${
          unreadCount === 1
            ? 'notification is'
            : 'notifications are'
        } unread.`
      : hasUnread
        ? `Open Registry Inbox. ${unreadCount} unread ${
            unreadCount === 1
              ? 'notification'
              : 'notifications'
          }.`
        : 'Open Registry Inbox. No unread notifications.';

  return (
    <Link
      href={REGISTRY_INBOX_HREF}
      aria-label={ariaLabel}
      title={statusLabel}
      className={[
        'ta14-registry-inbox-indicator',
        hasUnread ? 'has-unread' : '',
        hasActionRequired ? 'has-action-required' : '',
        unavailable ? 'is-unavailable' : '',
        compact ? 'is-compact' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        className="ta14-registry-inbox-indicator__icon"
        aria-hidden="true"
      >
        RI
      </span>

      {!compact ? (
        <span className="ta14-registry-inbox-indicator__copy">
          <span className="ta14-registry-inbox-indicator__label">
            Registry Inbox
          </span>

          <span className="ta14-registry-inbox-indicator__status">
            {statusLabel}
          </span>
        </span>
      ) : null}

      <span
        className={[
          'ta14-registry-inbox-indicator__count',
          hasUnread ? 'is-visible' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!hasUnread}
      >
        {loading
          ? '…'
          : unreadCount > 99
            ? '99+'
            : String(unreadCount)}
      </span>

      <style jsx>{`
        .ta14-registry-inbox-indicator {
          position: relative;
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 14px;
          padding: 8px 11px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.065),
              rgba(255, 255, 255, 0.025)
            );
          color: inherit;
          text-decoration: none;
          transition:
            transform 160ms ease,
            border-color 160ms ease,
            background 160ms ease;
        }

        .ta14-registry-inbox-indicator:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 255, 255, 0.24);
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.095),
              rgba(255, 255, 255, 0.04)
            );
        }

        .ta14-registry-inbox-indicator:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 3px;
        }

        .ta14-registry-inbox-indicator.has-unread {
          border-color: rgba(126, 231, 135, 0.5);
        }

        .ta14-registry-inbox-indicator.has-action-required {
          border-color: rgba(255, 199, 95, 0.58);
        }

        .ta14-registry-inbox-indicator.is-unavailable {
          opacity: 0.68;
        }

        .ta14-registry-inbox-indicator.is-compact {
          min-width: 44px;
          justify-content: center;
          padding-inline: 9px;
        }

        .ta14-registry-inbox-indicator__icon {
          display: grid;
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.05);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .ta14-registry-inbox-indicator__copy {
          display: grid;
          min-width: 0;
          gap: 2px;
        }

        .ta14-registry-inbox-indicator__label {
          overflow: hidden;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          line-height: 1.2;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .ta14-registry-inbox-indicator__status {
          overflow: hidden;
          max-width: 230px;
          font-size: 10px;
          line-height: 1.25;
          opacity: 0.68;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ta14-registry-inbox-indicator__count {
          display: grid;
          min-width: 24px;
          height: 24px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          padding-inline: 6px;
          background: rgba(255, 255, 255, 0.06);
          font-size: 10px;
          font-weight: 900;
          line-height: 1;
          opacity: 0.58;
        }

        .ta14-registry-inbox-indicator__count.is-visible {
          opacity: 1;
        }

        .has-unread
          .ta14-registry-inbox-indicator__count.is-visible {
          box-shadow: 0 0 18px rgba(126, 231, 135, 0.18);
        }

        .has-action-required
          .ta14-registry-inbox-indicator__count.is-visible {
          box-shadow: 0 0 18px rgba(255, 199, 95, 0.2);
        }

        @media (prefers-reduced-motion: reduce) {
          .ta14-registry-inbox-indicator {
            transition: none;
          }

          .ta14-registry-inbox-indicator:hover {
            transform: none;
          }
        }
      `}</style>
    </Link>
  );
}
