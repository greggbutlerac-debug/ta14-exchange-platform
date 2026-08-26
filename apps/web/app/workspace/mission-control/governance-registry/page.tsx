'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

type NotificationState = 'unread' | 'acknowledged' | 'resolved';
type NotificationPriority =
  | 'informational'
  | 'attention'
  | 'action_required'
  | 'critical';

type NotificationRow = {
  id: string;
  notification_key: string;
  notification_type: string;
  priority: NotificationPriority;
  state: NotificationState;
  submission_id: string | null;
  registry_identifier: string | null;
  governance_name: string;
  claimant_name: string | null;
  organization_name: string | null;
  requested_review_pathway: string | null;
  title: string;
  message: string;
  event_payload: Record<string, unknown> | null;
  occurred_at: string;
  created_at: string;
};

type NotificationSummary = {
  unreadCount: number;
  acknowledgedCount: number;
  resolvedCount: number;
  actionRequiredCount: number;
  totalCount: number;
};

type InboxResponse = {
  notifications?: NotificationRow[];
  summary?: NotificationSummary;
  error?: string;
};

type RegistryStatus = 'Issued' | 'Pending review' | 'Submitted' | 'Exception' | 'Other';

const REFRESH_INTERVAL_MS = 60_000;
const DAY_MS = 24 * 60 * 60 * 1000;

function statusFor(notification: NotificationRow): RegistryStatus {
  if (notification.notification_type === 'governance_registered') return 'Issued';
  if (notification.notification_type === 'governance_review_requested') return 'Pending review';
  if (notification.notification_type === 'governance_submission_received') return 'Submitted';
  if (notification.notification_type === 'governance_registration_exception') return 'Exception';
  return 'Other';
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function relativeTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const delta = date.getTime() - Date.now();
  const absolute = Math.abs(delta);
  const formatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

  if (absolute < 60_000) return formatter.format(Math.round(delta / 1000), 'second');
  if (absolute < 3_600_000) return formatter.format(Math.round(delta / 60_000), 'minute');
  if (absolute < DAY_MS) return formatter.format(Math.round(delta / 3_600_000), 'hour');
  return formatter.format(Math.round(delta / DAY_MS), 'day');
}

function recordKey(notification: NotificationRow) {
  return (
    notification.submission_id ||
    notification.registry_identifier ||
    `${notification.governance_name}::${notification.claimant_name || notification.organization_name || 'unknown'}`
  );
}

export default function GovernanceRegistryMissionControlPage() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastLoadedAt, setLastLoadedAt] = useState<Date | null>(null);

  const load = useCallback(async (initial = false) => {
    if (initial) setLoading(true);
    else setRefreshing(true);
    setError('');

    try {
      const response = await fetch(
        '/api/ai-governance/registry/admin-notifications?limit=200',
        {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        },
      );

      const body = (await response.json()) as InboxResponse;

      if (!response.ok) {
        throw new Error(body.error || 'Registry activity could not be loaded.');
      }

      setNotifications(body.notifications ?? []);
      setSummary(body.summary ?? null);
      setLastLoadedAt(new Date());
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Registry activity could not be loaded.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(true);

    const timer = window.setInterval(() => void load(false), REFRESH_INTERVAL_MS);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void load(false);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [load]);

  const registryEvents = useMemo(
    () =>
      notifications
        .filter((item) =>
          [
            'governance_submission_received',
            'governance_registered',
            'governance_review_requested',
            'governance_registration_exception',
          ].includes(item.notification_type),
        )
        .sort(
          (a, b) =>
            new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime(),
        ),
    [notifications],
  );

  const latestByGovernance = useMemo(() => {
    const map = new Map<string, NotificationRow>();

    for (const item of registryEvents) {
      const key = recordKey(item);
      if (!map.has(key)) map.set(key, item);
    }

    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime(),
    );
  }, [registryEvents]);

  const cutoff = Date.now() - DAY_MS;
  const last24Events = registryEvents.filter(
    (item) => new Date(item.occurred_at).getTime() >= cutoff,
  );
  const issuedLast24 = last24Events.filter(
    (item) => item.notification_type === 'governance_registered',
  );
  const pending = latestByGovernance.filter((item) => {
    const status = statusFor(item);
    return status === 'Submitted' || status === 'Pending review' || status === 'Exception';
  });
  const issued = latestByGovernance.filter((item) => statusFor(item) === 'Issued');

  const rows = last24Events.length > 0 ? last24Events : registryEvents.slice(0, 12);

  return (
    <main className="pageShell">
      <section className="hero">
        <div>
          <p className="eyebrow">TA-14 MISSION CONTROL · PRIVATE</p>
          <h1>Governance Registry Watch</h1>
          <p className="lead">
            Live institutional awareness for governance submissions, pending review,
            issued registrations, exceptions, and the last 24 hours of registry activity.
          </p>
        </div>

        <div className="heroActions">
          <button type="button" onClick={() => void load(false)} disabled={refreshing}>
            {refreshing ? 'Refreshing…' : 'Refresh now'}
          </button>
          <Link href="/workspace/ai-governance/registry/inbox">Open Registry Inbox</Link>
        </div>
      </section>

      <section className="metrics" aria-label="Governance registry watch summary">
        <article>
          <span>Last 24h events</span>
          <strong>{loading ? '…' : last24Events.length}</strong>
          <small>Submission, review, issue, and registration events</small>
        </article>
        <article>
          <span>New registrations · 24h</span>
          <strong>{loading ? '…' : issuedLast24.length}</strong>
          <small>Governance registrations issued in the rolling window</small>
        </article>
        <article>
          <span>Pending / attention</span>
          <strong>{loading ? '…' : pending.length}</strong>
          <small>Latest state has not reached issued registration</small>
        </article>
        <article>
          <span>Issued in loaded history</span>
          <strong>{loading ? '…' : issued.length}</strong>
          <small>Latest state is registered within the current 200-event view</small>
        </article>
        <article>
          <span>Unread admin events</span>
          <strong>{loading ? '…' : summary?.unreadCount ?? 0}</strong>
          <small>{summary?.actionRequiredCount ?? 0} currently marked action required</small>
        </article>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">REGISTRY ACTIVITY</p>
            <h2>{last24Events.length > 0 ? 'Last 24 hours' : 'Most recent registry events'}</h2>
          </div>
          <div className="syncState">
            <span className="pulse" aria-hidden="true" />
            {lastLoadedAt ? `Synced ${relativeTimestamp(lastLoadedAt.toISOString())}` : 'Synchronizing'}
          </div>
        </div>

        {error ? <div className="errorBox">{error}</div> : null}

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Architecture</th>
                <th>Steward / claimant</th>
                <th>Status</th>
                <th>Registry ID</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="emptyCell">
                    No governance registry events are present in the loaded administration history.
                  </td>
                </tr>
              ) : null}

              {rows.map((item) => {
                const status = statusFor(item);
                return (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.governance_name || 'Unnamed governance'}</strong>
                      <span>{item.title}</span>
                    </td>
                    <td>{item.claimant_name || item.organization_name || 'Not declared'}</td>
                    <td>
                      <span className={`status status-${status.toLowerCase().replaceAll(' ', '-')}`}>
                        {status}
                      </span>
                    </td>
                    <td>{item.registry_identifier || 'Not issued'}</td>
                    <td>
                      <strong>{formatTimestamp(item.occurred_at)}</strong>
                      <span>{relativeTimestamp(item.occurred_at)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="boundary">
        <strong>Institutional boundary</strong>
        <p>
          This dashboard reports registry administration events. A submission is not an
          issued registration, an acknowledgement is not approval, and an exception does
          not erase the underlying chronology. Registry identity is shown only when the
          recorded event supplies one.
        </p>
      </section>

      <style jsx>{`
        .pageShell {
          min-height: 100vh;
          padding: 42px clamp(18px, 4vw, 58px) 72px;
          background:
            radial-gradient(circle at 12% 0%, rgba(54, 188, 255, 0.12), transparent 32%),
            radial-gradient(circle at 88% 10%, rgba(103, 232, 171, 0.08), transparent 30%),
            #030811;
          color: #eef6ff;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .hero {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 24px;
          max-width: 1480px;
          margin: 0 auto 28px;
        }

        .eyebrow {
          margin: 0 0 8px;
          color: #72dfff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        h1,
        h2,
        p {
          margin-top: 0;
        }

        h1 {
          margin-bottom: 14px;
          font-size: clamp(2.4rem, 5vw, 5.2rem);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        h2 {
          margin-bottom: 0;
          font-size: clamp(1.55rem, 3vw, 2.4rem);
        }

        .lead {
          max-width: 840px;
          margin-bottom: 0;
          color: #9db1c6;
          font-size: 15px;
          line-height: 1.7;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .heroActions button,
        .heroActions :global(a) {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(114, 223, 255, 0.28);
          border-radius: 12px;
          padding: 0 15px;
          background: rgba(114, 223, 255, 0.08);
          color: #effbff;
          text-decoration: none;
          font: inherit;
          font-size: 12px;
          font-weight: 850;
          cursor: pointer;
        }

        .metrics {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          max-width: 1480px;
          margin: 0 auto 18px;
        }

        .metrics article {
          display: grid;
          min-height: 150px;
          align-content: space-between;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.035);
        }

        .metrics span {
          color: #9db1c6;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .metrics strong {
          font-size: clamp(2rem, 4vw, 3.5rem);
          letter-spacing: -0.05em;
        }

        .metrics small {
          color: #71869c;
          font-size: 11px;
          line-height: 1.45;
        }

        .panel,
        .boundary {
          max-width: 1480px;
          margin-inline: auto;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.028);
        }

        .panel {
          overflow: hidden;
        }

        .panelHeader {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          padding: 22px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .syncState {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #94a8bc;
          font-size: 11px;
          font-weight: 800;
        }

        .pulse {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #68e3aa;
          box-shadow: 0 0 16px rgba(104, 227, 170, 0.45);
        }

        .tableWrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 950px;
        }

        th,
        td {
          border-bottom: 1px solid rgba(255, 255, 255, 0.065);
          padding: 15px 18px;
          text-align: left;
          vertical-align: top;
        }

        th {
          color: #71869c;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        td {
          color: #c9d6e4;
          font-size: 12px;
          line-height: 1.45;
        }

        td strong,
        td span {
          display: block;
        }

        td strong {
          color: #eef6ff;
        }

        td span:not(.status) {
          margin-top: 4px;
          color: #71869c;
          font-size: 10px;
        }

        .status {
          display: inline-flex;
          width: fit-content;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          padding: 5px 9px;
          background: rgba(255, 255, 255, 0.045);
          color: #d9e6f4;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .status-issued {
          border-color: rgba(104, 227, 170, 0.34);
          color: #bff7d9;
        }

        .status-pending-review,
        .status-submitted {
          border-color: rgba(114, 223, 255, 0.34);
          color: #bdefff;
        }

        .status-exception {
          border-color: rgba(255, 189, 92, 0.4);
          color: #ffd79b;
        }

        .errorBox {
          margin: 18px;
          border: 1px solid rgba(255, 117, 117, 0.28);
          border-radius: 13px;
          padding: 13px 15px;
          background: rgba(255, 117, 117, 0.07);
          color: #ffd0d0;
          font-size: 12px;
        }

        .emptyCell {
          padding: 34px 18px;
          color: #71869c;
          text-align: center;
        }

        .boundary {
          margin-top: 18px;
          padding: 18px 20px;
        }

        .boundary strong {
          color: #ffd27e;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .boundary p {
          max-width: 1050px;
          margin: 7px 0 0;
          color: #8398ad;
          font-size: 12px;
          line-height: 1.65;
        }

        @media (max-width: 1120px) {
          .metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .pageShell {
            padding-top: 28px;
          }

          .hero,
          .panelHeader {
            align-items: stretch;
            flex-direction: column;
          }

          .metrics {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
