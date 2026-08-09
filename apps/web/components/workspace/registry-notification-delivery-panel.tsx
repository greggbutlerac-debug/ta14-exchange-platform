'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type DeliveryState = 'delivered' | 'failed';
type AggregateStatus = 'delivered' | 'failed' | 'not_attempted';

type DeliveryHistoryRow = {
  id: string;
  notification_id: string;
  channel: string;
  provider: string;
  recipient: string;
  delivery_state: DeliveryState;
  provider_message_id: string | null;
  failure_reason: string | null;
  attempted_at: string;
  delivered_at: string | null;
  created_at: string;
};

type DeliveryHistoryResponse = {
  ok?: boolean;
  notification?: {
    id: string;
    notificationType: string;
    registryIdentifier: string | null;
    governanceName: string;
    occurredAt: string;
  };
  delivery?: {
    status: AggregateStatus;
    deliveredCount: number;
    failedCount: number;
    recipientsDelivered: string[];
    latestAttemptAt: string | null;
    latestDeliveredAt: string | null;
  };
  history?: DeliveryHistoryRow[];
  error?: string;
};

type RegistryNotificationDeliveryPanelProps = {
  notificationId: string;
  compact?: boolean;
  className?: string;
};

function formatTimestamp(value: string | null | undefined): string {
  if (!value) {
    return 'Not recorded';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function statusCopy(status: AggregateStatus): {
  title: string;
  detail: string;
} {
  if (status === 'delivered') {
    return {
      title: 'Email delivered',
      detail:
        'At least one successful external delivery receipt is preserved for this registration notification.',
    };
  }

  if (status === 'failed') {
    return {
      title: 'Delivery needs attention',
      detail:
        'One or more delivery attempts failed and no successful delivery is yet preserved.',
    };
  }

  return {
    title: 'Email not attempted',
    detail:
      'The Registry notification exists, but no external email delivery attempt is recorded yet.',
  };
}

export function RegistryNotificationDeliveryPanel({
  notificationId,
  compact = false,
  className = '',
}: RegistryNotificationDeliveryPanelProps) {
  const [payload, setPayload] =
    useState<DeliveryHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const requestRef = useRef(false);

  const load = useCallback(async () => {
    if (!notificationId || requestRef.current) {
      return;
    }

    requestRef.current = true;

    try {
      const response = await fetch(
        `/api/ai-governance/registry/admin-notifications/delivery-history?notificationId=${encodeURIComponent(
          notificationId,
        )}&limit=25`,
        {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const next =
        (await response.json().catch(() => null)) as
          | DeliveryHistoryResponse
          | null;

      if (!response.ok || !next) {
        setUnavailable(true);
        return;
      }

      setPayload(next);
      setUnavailable(false);
    } catch {
      setUnavailable(true);
    } finally {
      requestRef.current = false;
      setLoading(false);
    }
  }, [notificationId]);

  useEffect(() => {
    void load();
  }, [load]);

  const deliveryStatus: AggregateStatus =
    payload?.delivery?.status ?? 'not_attempted';

  const copy = useMemo(
    () => statusCopy(deliveryStatus),
    [deliveryStatus],
  );

  const history = payload?.history ?? [];

  const deliveredCount =
    payload?.delivery?.deliveredCount ?? 0;

  const failedCount =
    payload?.delivery?.failedCount ?? 0;

  if (compact) {
    return (
      <div
        className={[
          'ta14-registry-delivery-panel',
          'is-compact',
          `is-${deliveryStatus}`,
          unavailable ? 'is-unavailable' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span
          className="ta14-registry-delivery-panel__signal"
          aria-hidden="true"
        />

        <span className="ta14-registry-delivery-panel__compact-label">
          {loading
            ? 'Checking email'
            : unavailable
              ? 'Email status unavailable'
              : copy.title}
        </span>

        <style jsx>{`
          .ta14-registry-delivery-panel.is-compact {
            display: inline-flex;
            min-height: 32px;
            align-items: center;
            gap: 7px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 999px;
            padding: 5px 9px;
            background: rgba(255, 255, 255, 0.025);
          }

          .ta14-registry-delivery-panel__signal {
            width: 7px;
            height: 7px;
            border-radius: 999px;
            background: currentColor;
            opacity: 0.68;
          }

          .ta14-registry-delivery-panel.is-delivered
            .ta14-registry-delivery-panel__signal {
            box-shadow: 0 0 12px currentColor;
            opacity: 0.95;
          }

          .ta14-registry-delivery-panel.is-failed {
            border-color: rgba(255, 199, 95, 0.42);
          }

          .ta14-registry-delivery-panel.is-unavailable {
            opacity: 0.55;
          }

          .ta14-registry-delivery-panel__compact-label {
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }
        `}</style>
      </div>
    );
  }

  return (
    <section
      className={[
        'ta14-registry-delivery-panel',
        `is-${deliveryStatus}`,
        unavailable ? 'is-unavailable' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Registration email delivery status"
    >
      <div className="ta14-registry-delivery-panel__header">
        <div className="ta14-registry-delivery-panel__heading">
          <span
            className="ta14-registry-delivery-panel__signal"
            aria-hidden="true"
          />

          <div>
            <span className="ta14-registry-delivery-panel__eyebrow">
              External notification
            </span>

            <strong className="ta14-registry-delivery-panel__title">
              {loading
                ? 'Checking email delivery'
                : unavailable
                  ? 'Email delivery unavailable'
                  : copy.title}
            </strong>
          </div>
        </div>

        <button
          type="button"
          className="ta14-registry-delivery-panel__refresh"
          onClick={() => void load()}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {!loading && !unavailable ? (
        <>
          <p className="ta14-registry-delivery-panel__detail">
            {copy.detail}
          </p>

          <div className="ta14-registry-delivery-panel__metrics">
            <div>
              <span>Delivered</span>
              <strong>{deliveredCount}</strong>
            </div>

            <div>
              <span>Failed</span>
              <strong>{failedCount}</strong>
            </div>

            <div>
              <span>Latest attempt</span>
              <strong>
                {formatTimestamp(
                  payload?.delivery?.latestAttemptAt,
                )}
              </strong>
            </div>
          </div>

          {history.length > 0 ? (
            <div className="ta14-registry-delivery-panel__history">
              <button
                type="button"
                className="ta14-registry-delivery-panel__toggle"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
              >
                <span>
                  Delivery audit trail ({history.length})
                </span>
                <span aria-hidden="true">
                  {expanded ? '−' : '+'}
                </span>
              </button>

              {expanded ? (
                <div className="ta14-registry-delivery-panel__rows">
                  {history.map((row) => (
                    <article
                      key={row.id}
                      className={[
                        'ta14-registry-delivery-panel__row',
                        `is-${row.delivery_state}`,
                      ].join(' ')}
                    >
                      <div className="ta14-registry-delivery-panel__row-top">
                        <strong>
                          {row.delivery_state === 'delivered'
                            ? 'Delivered'
                            : 'Failed'}
                        </strong>

                        <span>
                          {formatTimestamp(row.attempted_at)}
                        </span>
                      </div>

                      <dl className="ta14-registry-delivery-panel__row-data">
                        <div>
                          <dt>Recipient</dt>
                          <dd>{row.recipient}</dd>
                        </div>

                        <div>
                          <dt>Provider</dt>
                          <dd>{row.provider}</dd>
                        </div>

                        {row.provider_message_id ? (
                          <div>
                            <dt>Provider receipt</dt>
                            <dd>{row.provider_message_id}</dd>
                          </div>
                        ) : null}

                        {row.failure_reason ? (
                          <div>
                            <dt>Failure</dt>
                            <dd>{row.failure_reason}</dd>
                          </div>
                        ) : null}
                      </dl>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}

      <style jsx>{`
        .ta14-registry-delivery-panel {
          display: grid;
          gap: 14px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 17px;
          padding: 15px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.016)
            );
        }

        .ta14-registry-delivery-panel.is-failed {
          border-color: rgba(255, 199, 95, 0.42);
        }

        .ta14-registry-delivery-panel.is-unavailable {
          opacity: 0.62;
        }

        .ta14-registry-delivery-panel__header,
        .ta14-registry-delivery-panel__heading,
        .ta14-registry-delivery-panel__row-top {
          display: flex;
          align-items: center;
        }

        .ta14-registry-delivery-panel__header {
          justify-content: space-between;
          gap: 12px;
        }

        .ta14-registry-delivery-panel__heading {
          gap: 10px;
        }

        .ta14-registry-delivery-panel__signal {
          width: 10px;
          height: 10px;
          flex: 0 0 10px;
          border-radius: 999px;
          background: currentColor;
          opacity: 0.64;
        }

        .ta14-registry-delivery-panel.is-delivered
          .ta14-registry-delivery-panel__signal {
          box-shadow: 0 0 15px currentColor;
          opacity: 0.95;
        }

        .ta14-registry-delivery-panel__eyebrow {
          display: block;
          margin-bottom: 2px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.13em;
          opacity: 0.5;
          text-transform: uppercase;
        }

        .ta14-registry-delivery-panel__title {
          font-size: 12px;
          line-height: 1.25;
        }

        .ta14-registry-delivery-panel__refresh,
        .ta14-registry-delivery-panel__toggle {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: inherit;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.035);
          font: inherit;
        }

        .ta14-registry-delivery-panel__refresh {
          border-radius: 10px;
          padding: 7px 10px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .ta14-registry-delivery-panel__refresh:disabled {
          cursor: default;
          opacity: 0.45;
        }

        .ta14-registry-delivery-panel__detail {
          margin: 0;
          max-width: 720px;
          font-size: 11px;
          line-height: 1.6;
          opacity: 0.68;
        }

        .ta14-registry-delivery-panel__metrics {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
        }

        .ta14-registry-delivery-panel__metrics > div {
          display: grid;
          gap: 4px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.018);
        }

        .ta14-registry-delivery-panel__metrics span {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          opacity: 0.46;
          text-transform: uppercase;
        }

        .ta14-registry-delivery-panel__metrics strong {
          overflow-wrap: anywhere;
          font-size: 11px;
          line-height: 1.3;
        }

        .ta14-registry-delivery-panel__history {
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 13px;
        }

        .ta14-registry-delivery-panel__toggle {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          border: 0;
          border-radius: 0;
          padding: 11px 12px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-align: left;
          text-transform: uppercase;
        }

        .ta14-registry-delivery-panel__rows {
          display: grid;
          gap: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px;
        }

        .ta14-registry-delivery-panel__row {
          display: grid;
          gap: 9px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 11px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.018);
        }

        .ta14-registry-delivery-panel__row.is-failed {
          border-color: rgba(255, 199, 95, 0.3);
        }

        .ta14-registry-delivery-panel__row-top {
          justify-content: space-between;
          gap: 10px;
          font-size: 9px;
        }

        .ta14-registry-delivery-panel__row-top span {
          opacity: 0.52;
        }

        .ta14-registry-delivery-panel__row-data {
          display: grid;
          gap: 6px;
          margin: 0;
        }

        .ta14-registry-delivery-panel__row-data > div {
          display: grid;
          grid-template-columns: 108px minmax(0, 1fr);
          gap: 10px;
        }

        .ta14-registry-delivery-panel__row-data dt {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          opacity: 0.45;
          text-transform: uppercase;
        }

        .ta14-registry-delivery-panel__row-data dd {
          margin: 0;
          overflow-wrap: anywhere;
          font-size: 9px;
          line-height: 1.45;
        }

        @media (max-width: 700px) {
          .ta14-registry-delivery-panel__metrics {
            grid-template-columns: 1fr;
          }

          .ta14-registry-delivery-panel__row-data > div {
            grid-template-columns: 1fr;
            gap: 3px;
          }
        }
      `}</style>
    </section>
  );
}
