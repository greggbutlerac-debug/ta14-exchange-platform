'use client';

import Link from 'next/link';
import { RegistryNotificationDeliveryMount } from '@/components/workspace/registry-notification-delivery-mount';
import { RegistryRegistrationJourneyPanel } from '@/components/workspace/registry-registration-journey-panel';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  acknowledged_at: string | null;
  acknowledged_by_user_id: string | null;
  resolved_at: string | null;
  resolved_by_user_id: string | null;
};

type NotificationSummary = {
  unreadCount: number;
  acknowledgedCount: number;
  resolvedCount: number;
  actionRequiredCount: number;
  totalCount: number;
};

type InboxResponse = {
  notifications: NotificationRow[];
  summary: NotificationSummary;
  administrator?: {
    email?: string;
  };
  error?: string;
};

type FilterState = 'all' | NotificationState;
type FilterPriority = 'all' | NotificationPriority;
type MutationAction = 'acknowledge' | 'resolve' | 'reopen';

const REFRESH_INTERVAL_MS = 60_000;

const emptySummary: NotificationSummary = {
  unreadCount: 0,
  acknowledgedCount: 0,
  resolvedCount: 0,
  actionRequiredCount: 0,
  totalCount: 0,
};

function readable(value: string | null | undefined, fallback = 'Not declared') {
  if (!value?.trim()) return fallback;

  return value
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatTimestamp(value: string | null | undefined) {
  if (!value) return 'Not recorded';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function relativeTimestamp(value: string | null | undefined) {
  if (!value) return '';
  const date = new Date(value);
  const now = new Date();
  const difference = date.getTime() - now.getTime();
  const absolute = Math.abs(difference);

  if (Number.isNaN(date.getTime())) return '';

  const formatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

  if (absolute < 60_000) return formatter.format(Math.round(difference / 1000), 'second');
  if (absolute < 3_600_000) return formatter.format(Math.round(difference / 60_000), 'minute');
  if (absolute < 86_400_000) return formatter.format(Math.round(difference / 3_600_000), 'hour');
  if (absolute < 2_592_000_000) return formatter.format(Math.round(difference / 86_400_000), 'day');

  return formatter.format(Math.round(difference / 2_592_000_000), 'month');
}

function priorityWeight(priority: NotificationPriority) {
  if (priority === 'critical') return 4;
  if (priority === 'action_required') return 3;
  if (priority === 'attention') return 2;
  return 1;
}

function stateWeight(state: NotificationState) {
  if (state === 'unread') return 3;
  if (state === 'acknowledged') return 2;
  return 1;
}

function registryRecordHref(notification: NotificationRow) {
  if (!notification.registry_identifier) return null;
  return `/workspace/ai-governance/registry/records/${encodeURIComponent(
    notification.registry_identifier,
  )}`;
}

function reviewHref(notification: NotificationRow) {
  if (!notification.submission_id) return null;
  return `/workspace/ai-governance/registry/review/${encodeURIComponent(
    notification.submission_id,
  )}`;
}

function hasExternalDeliveryTracking(notification: NotificationRow) {
  return notification.notification_type === 'governance_registered';
}

function notificationActionLabel(notification: NotificationRow) {
  if (notification.notification_type === 'governance_registration_exception') {
    return 'Registration exception';
  }

  if (notification.notification_type === 'governance_review_requested') {
    return 'Review requested';
  }

  return 'Registration completed';
}

export default function RegistryAdministrationInboxPage() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [summary, setSummary] = useState<NotificationSummary>(emptySummary);
  const [administratorEmail, setAdministratorEmail] = useState('');
  const [stateFilter, setStateFilter] = useState<FilterState>('all');
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastLoadedAt, setLastLoadedAt] = useState<Date | null>(null);
  const [activeMutationId, setActiveMutationId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const firstLoad = useRef(true);

  const loadInbox = useCallback(async (mode: 'initial' | 'refresh' = 'refresh') => {
    if (mode === 'initial') setLoading(true);
    else setRefreshing(true);

    setError('');

    try {
      const response = await fetch(
        '/api/ai-governance/registry/admin-notifications?limit=200',
        {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const body = (await response.json()) as InboxResponse;

      if (!response.ok) {
        throw new Error(
          body.error || 'The Registry Administration Inbox could not be loaded.',
        );
      }

      setNotifications(body.notifications ?? []);
      setSummary(body.summary ?? emptySummary);
      setAdministratorEmail(body.administrator?.email ?? '');
      setLastLoadedAt(new Date());
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'The Registry Administration Inbox could not be loaded.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
      firstLoad.current = false;
    }
  }, []);

  useEffect(() => {
    void loadInbox('initial');

    const timer = window.setInterval(() => {
      void loadInbox('refresh');
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [loadInbox]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !firstLoad.current) {
        void loadInbox('refresh');
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [loadInbox]);

  const mutateNotification = useCallback(
    async (notification: NotificationRow, action: MutationAction) => {
      setActiveMutationId(notification.id);
      setError('');

      try {
        const response = await fetch(
          '/api/ai-governance/registry/admin-notifications',
          {
            method: 'PATCH',
            credentials: 'include',
            cache: 'no-store',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              notificationId: notification.id,
              action,
            }),
          },
        );

        const body = (await response.json()) as {
          notification?: NotificationRow;
          error?: string;
        };

        if (!response.ok || !body.notification) {
          throw new Error(body.error || 'The notification could not be updated.');
        }

        setNotifications((current) =>
          current.map((item) =>
            item.id === body.notification?.id ? body.notification : item,
          ),
        );

        await loadInbox('refresh');
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : 'The notification could not be updated.',
        );
      } finally {
        setActiveMutationId(null);
      }
    },
    [loadInbox],
  );

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...notifications]
      .filter((notification) => {
        if (stateFilter !== 'all' && notification.state !== stateFilter) return false;
        if (priorityFilter !== 'all' && notification.priority !== priorityFilter) {
          return false;
        }

        if (!query) return true;

        const searchable = [
          notification.registry_identifier,
          notification.governance_name,
          notification.claimant_name,
          notification.organization_name,
          notification.requested_review_pathway,
          notification.title,
          notification.message,
          notification.notification_type,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchable.includes(query);
      })
      .sort((a, b) => {
        const stateDifference = stateWeight(b.state) - stateWeight(a.state);
        if (stateDifference !== 0) return stateDifference;

        const priorityDifference = priorityWeight(b.priority) - priorityWeight(a.priority);
        if (priorityDifference !== 0) return priorityDifference;

        return new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime();
      });
  }, [notifications, priorityFilter, search, stateFilter]);

  const visibleUnreadCount = useMemo(
    () => filteredNotifications.filter((item) => item.state === 'unread').length,
    [filteredNotifications],
  );

  return (
    <main className="pageShell">
      <div className="ambient ambientOne" aria-hidden="true" />
      <div className="ambient ambientTwo" aria-hidden="true" />
      <div className="gridVeil" aria-hidden="true" />

      <header className="topBar">
        <div className="topBarGroup">
          <Link href="/workspace/ai-governance/registry" className="ghostButton">
            Registry Home
          </Link>
          <Link href="/workspace/ai-governance/registry/review" className="ghostButton">
            Reviewer Queue
          </Link>
        </div>

        <div className="topBarGroup topBarRight">
          <span className="systemStatus">
            <span className="statusDot" aria-hidden="true" />
            Auto-refresh: 60 sec
          </span>
          <button
            type="button"
            className="primaryButton compactButton"
            onClick={() => void loadInbox('refresh')}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing…' : 'Refresh now'}
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">TA-14 REGISTRY ADMINISTRATION</p>
          <div className="heroTitleRow">
            <h1>Registry Inbox</h1>
            {summary.unreadCount > 0 ? (
              <span className="unreadHeroBadge">{summary.unreadCount} unread</span>
            ) : (
              <span className="clearHeroBadge">All caught up</span>
            )}
          </div>
          <p className="lead">
            Institutional awareness for governance registrations and Registry events.
            Automatic registration remains automatic; this inbox records what happened
            so completed registrations do not disappear into the database unnoticed.
          </p>

          <div className="heroMetaRow">
            <span>
              Administrator: <strong>{administratorEmail || 'Authorized reviewer'}</strong>
            </span>
            <span className="metaSeparator" aria-hidden="true">•</span>
            <span>
              Last synchronized:{' '}
              <strong>{lastLoadedAt ? formatTimestamp(lastLoadedAt.toISOString()) : 'Loading'}</strong>
            </span>
          </div>
        </div>

        <aside className="boundaryCard">
          <p className="eyebrow">ADMINISTRATIVE BOUNDARY</p>
          <strong>Acknowledgement does not alter registration.</strong>
          <p>
            Inbox state records administrative awareness only. Acknowledging or resolving
            an item does not certify, endorse, approve, revoke, or modify the underlying
            governance registration.
          </p>
        </aside>
      </section>

      <section className="summaryGrid" aria-label="Registry inbox summary">
        <button
          type="button"
          className={`summaryCard ${stateFilter === 'unread' ? 'summaryCardActive' : ''}`}
          onClick={() => setStateFilter(stateFilter === 'unread' ? 'all' : 'unread')}
        >
          <span className="summaryLabel">Unread</span>
          <strong className="summaryNumber">{summary.unreadCount}</strong>
          <span className="summaryHint">Not yet acknowledged</span>
        </button>

        <button
          type="button"
          className={`summaryCard ${stateFilter === 'acknowledged' ? 'summaryCardActive' : ''}`}
          onClick={() =>
            setStateFilter(stateFilter === 'acknowledged' ? 'all' : 'acknowledged')
          }
        >
          <span className="summaryLabel">Acknowledged</span>
          <strong className="summaryNumber">{summary.acknowledgedCount}</strong>
          <span className="summaryHint">Seen, still preserved</span>
        </button>

        <button
          type="button"
          className={`summaryCard ${stateFilter === 'resolved' ? 'summaryCardActive' : ''}`}
          onClick={() => setStateFilter(stateFilter === 'resolved' ? 'all' : 'resolved')}
        >
          <span className="summaryLabel">Resolved</span>
          <strong className="summaryNumber">{summary.resolvedCount}</strong>
          <span className="summaryHint">Administrative disposition complete</span>
        </button>

        <button
          type="button"
          className={`summaryCard ${
            priorityFilter === 'action_required' ? 'summaryCardActive' : ''
          }`}
          onClick={() =>
            setPriorityFilter(
              priorityFilter === 'action_required' ? 'all' : 'action_required',
            )
          }
        >
          <span className="summaryLabel">Action required</span>
          <strong className="summaryNumber">{summary.actionRequiredCount}</strong>
          <span className="summaryHint">Needs administrative intervention</span>
        </button>

        <button
          type="button"
          className={`summaryCard ${stateFilter === 'all' ? 'summaryCardActive' : ''}`}
          onClick={() => {
            setStateFilter('all');
            setPriorityFilter('all');
          }}
        >
          <span className="summaryLabel">Total events</span>
          <strong className="summaryNumber">{summary.totalCount}</strong>
          <span className="summaryHint">Preserved inbox history</span>
        </button>
      </section>

      <section className="controlPanel">
        <div className="controlHeader">
          <div>
            <p className="eyebrow">INBOX CONTROLS</p>
            <h2>Registration awareness queue</h2>
          </div>
          <div className="queueReadout">
            <span>{filteredNotifications.length} shown</span>
            <span>{visibleUnreadCount} unread in view</span>
          </div>
        </div>

        <div className="filterGrid">
          <label className="searchField">
            <span>Search inbox</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Governance, claimant, identifier, pathway…"
              type="search"
            />
          </label>

          <label className="selectField">
            <span>State</span>
            <select
              value={stateFilter}
              onChange={(event) => setStateFilter(event.target.value as FilterState)}
            >
              <option value="all">All states</option>
              <option value="unread">Unread</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>
          </label>

          <label className="selectField">
            <span>Priority</span>
            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value as FilterPriority)
              }
            >
              <option value="all">All priorities</option>
              <option value="informational">Informational</option>
              <option value="attention">Attention</option>
              <option value="action_required">Action required</option>
              <option value="critical">Critical</option>
            </select>
          </label>

          <button
            type="button"
            className="resetButton"
            onClick={() => {
              setSearch('');
              setStateFilter('all');
              setPriorityFilter('all');
            }}
          >
            Reset filters
          </button>
        </div>
      </section>

      {error ? (
        <section className="errorPanel" role="alert">
          <div>
            <p className="eyebrow">INBOX ERROR</p>
            <strong>{error}</strong>
          </div>
          <button
            type="button"
            className="ghostButton"
            onClick={() => void loadInbox('refresh')}
          >
            Try again
          </button>
        </section>
      ) : null}

      <RegistryRegistrationJourneyPanel />

      <section className="inboxSection">
        {loading ? (
          <div className="loadingPanel">
            <div className="spinner" aria-hidden="true" />
            <div>
              <strong>Loading Registry Inbox</strong>
              <p>Reading preserved registration notifications…</p>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="emptyPanel">
            <div className="emptyIcon" aria-hidden="true">✓</div>
            <div>
              <p className="eyebrow">NO MATCHING EVENTS</p>
              <h2>{summary.unreadCount === 0 ? 'Nothing is waiting on you.' : 'No events match these filters.'}</h2>
              <p>
                Automatic registration remains active. Completed registrations, review
                requests, and registration exceptions will appear here as preserved
                institutional awareness events.
              </p>
            </div>
          </div>
        ) : (
          <div className="notificationStack">
            {filteredNotifications.map((notification) => {
              const isExpanded = expandedId === notification.id;
              const isMutating = activeMutationId === notification.id;
              const recordHref = registryRecordHref(notification);
              const reviewerHref = reviewHref(notification);

              return (
                <article
                  key={notification.id}
                  className={`notificationCard state-${notification.state} priority-${notification.priority}`}
                >
                  <div className="notificationAccent" aria-hidden="true" />

                  <div className="notificationMain">
                    <div className="notificationHeader">
                      <div className="badgeRow">
                        <span className={`stateBadge stateBadge-${notification.state}`}>
                          {readable(notification.state)}
                        </span>
                        <span className={`priorityBadge priorityBadge-${notification.priority}`}>
                          {readable(notification.priority)}
                        </span>
                        <span className="typeBadge">
                          {readable(notification.notification_type)}
                        </span>
                      </div>

                      <div className="timestampBlock">
                        <strong>{formatTimestamp(notification.occurred_at)}</strong>
                        <span>{relativeTimestamp(notification.occurred_at)}</span>
                      </div>
                    </div>

                    <div className="identityRow">
                      <div className="identityCopy">
                        <p className="eyebrow">
                          {notificationActionLabel(notification)} · {notification.title}
                        </p>
                        <h2>{notification.governance_name}</h2>
                        <p className="notificationMessage">{notification.message}</p>
                      </div>

                      {notification.registry_identifier ? (
                        <div className="identifierPlate">
                          <span>Registry identifier</span>
                          <strong>{notification.registry_identifier}</strong>
                        </div>
                      ) : null}
                    </div>

                    <dl className="metadataGrid">
                      <div>
                        <dt>Claimant</dt>
                        <dd>{notification.claimant_name || 'Not declared'}</dd>
                      </div>
                      <div>
                        <dt>Organization</dt>
                        <dd>{notification.organization_name || 'Not declared'}</dd>
                      </div>
                      <div>
                        <dt>Pathway</dt>
                        <dd>{readable(notification.requested_review_pathway)}</dd>
                      </div>
                      <div>
                        <dt>Submission</dt>
                        <dd className="monoText">
                          {notification.submission_id || 'Not linked'}
                        </dd>
                      </div>
                    </dl>

                    {hasExternalDeliveryTracking(notification) ? (
                      <RegistryNotificationDeliveryMount
                        notificationId={notification.id}
                        compact
                        className="notificationDeliveryStatus"
                      />
                    ) : null}

                    {isExpanded ? (
                      <div className="detailsPanel">
                        <div className="detailsHeader">
                          <div>
                            <p className="eyebrow">PRESERVED EVENT DETAILS</p>
                            <strong>Administrative chronology</strong>
                          </div>
                          <span className="monoText">{notification.notification_key}</span>
                        </div>

                        <dl className="detailList">
                          <div>
                            <dt>Occurred</dt>
                            <dd>{formatTimestamp(notification.occurred_at)}</dd>
                          </div>
                          <div>
                            <dt>Notification created</dt>
                            <dd>{formatTimestamp(notification.created_at)}</dd>
                          </div>
                          <div>
                            <dt>Acknowledged</dt>
                            <dd>{formatTimestamp(notification.acknowledged_at)}</dd>
                          </div>
                          <div>
                            <dt>Resolved</dt>
                            <dd>{formatTimestamp(notification.resolved_at)}</dd>
                          </div>
                        </dl>

                        {notification.event_payload ? (
                          <details className="payloadDetails">
                            <summary>View preserved event payload</summary>
                            <pre>{JSON.stringify(notification.event_payload, null, 2)}</pre>
                          </details>
                        ) : null}

                        {hasExternalDeliveryTracking(notification) ? (
                          <RegistryNotificationDeliveryMount
                            notificationId={notification.id}
                            className="notificationDeliveryAudit"
                          />
                        ) : null}
                      </div>
                    ) : null}

                    <div className="actionRow">
                      <div className="actionGroup">
                        {notification.state === 'unread' ? (
                          <button
                            type="button"
                            className="primaryButton"
                            disabled={isMutating}
                            onClick={() => void mutateNotification(notification, 'acknowledge')}
                          >
                            {isMutating ? 'Updating…' : 'Acknowledge'}
                          </button>
                        ) : null}

                        {notification.state !== 'resolved' ? (
                          <button
                            type="button"
                            className="secondaryButton"
                            disabled={isMutating}
                            onClick={() => void mutateNotification(notification, 'resolve')}
                          >
                            {isMutating ? 'Updating…' : 'Resolve'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="secondaryButton"
                            disabled={isMutating}
                            onClick={() => void mutateNotification(notification, 'reopen')}
                          >
                            {isMutating ? 'Updating…' : 'Reopen'}
                          </button>
                        )}

                        <button
                          type="button"
                          className="textButton"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : notification.id)
                          }
                        >
                          {isExpanded ? 'Hide details' : 'Event details'}
                        </button>
                      </div>

                      <div className="actionGroup actionGroupRight">
                        {recordHref ? (
                          <Link href={recordHref} className="linkButton">
                            Open registry record
                          </Link>
                        ) : null}

                        {reviewerHref ? (
                          <Link href={reviewerHref} className="textLink">
                            Open submission
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="doctrinePanel">
        <div>
          <p className="eyebrow">TA-14 REGISTRY DOCTRINE</p>
          <h2>Automatic registration should not create invisible administration.</h2>
        </div>
        <p>
          The Registry may automatically complete eligible registration pathways without
          manual intervention. The Administration Inbox provides the separate awareness
          layer: what registered, when it registered, who claimed it, which pathway was
          used, and whether administrative attention remains outstanding.
        </p>
      </section>

      <footer className="footer">
        <div>
          <strong>TA-14 AI Governance Exchange</strong>
          <span>Registry Administration Inbox</span>
        </div>
        <div className="footerLinks">
          <Link href="/workspace/ai-governance/registry">Registry</Link>
          <Link href="/workspace/ai-governance/registry/directory">Directory</Link>
          <Link href="/workspace/ai-governance/registry/review">Reviewer Queue</Link>
        </div>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background: #05070d;
        }

        .pageShell {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 24px clamp(18px, 3vw, 52px) 42px;
          background:
            radial-gradient(circle at 15% 5%, rgba(79, 117, 255, 0.13), transparent 28%),
            radial-gradient(circle at 88% 10%, rgba(62, 211, 187, 0.09), transparent 24%),
            linear-gradient(180deg, #070a12 0%, #05070d 48%, #070910 100%);
          color: #eef3ff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .ambient {
          position: absolute;
          pointer-events: none;
          border-radius: 999px;
          filter: blur(80px);
          opacity: 0.22;
        }

        .ambientOne {
          top: 10%;
          left: -140px;
          width: 420px;
          height: 420px;
          background: #4164ff;
        }

        .ambientTwo {
          top: 46%;
          right: -120px;
          width: 360px;
          height: 360px;
          background: #25c9b5;
        }

        .gridVeil {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.18;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: linear-gradient(to bottom, black, transparent 86%);
        }

        .topBar,
        .hero,
        .summaryGrid,
        .controlPanel,
        .errorPanel,
        .inboxSection,
        .doctrinePanel,
        .footer {
          position: relative;
          z-index: 2;
          width: min(1500px, 100%);
          margin-left: auto;
          margin-right: auto;
        }

        .topBar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 6px 0 26px;
        }

        .topBarGroup {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .topBarRight {
          justify-content: flex-end;
        }

        .systemStatus {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          color: #aeb9cf;
          background: rgba(9, 13, 23, 0.72);
          font-size: 12px;
          letter-spacing: 0.03em;
        }

        .statusDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #5ce1c8;
          box-shadow: 0 0 16px rgba(92, 225, 200, 0.8);
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.72fr);
          gap: 28px;
          align-items: stretch;
          padding: clamp(34px, 5vw, 72px) 0 34px;
        }

        .heroCopy {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .eyebrow {
          margin: 0;
          color: #7f96c8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          line-height: 1.4;
        }

        .heroTitleRow {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 12px;
        }

        h1 {
          margin: 0;
          font-size: clamp(46px, 7vw, 92px);
          line-height: 0.94;
          letter-spacing: -0.055em;
          font-weight: 800;
        }

        .lead {
          max-width: 900px;
          margin: 24px 0 0;
          color: #b8c4da;
          font-size: clamp(17px, 1.8vw, 22px);
          line-height: 1.65;
        }

        .unreadHeroBadge,
        .clearHeroBadge {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .unreadHeroBadge {
          color: #06110f;
          background: #67e7cf;
          box-shadow: 0 12px 34px rgba(69, 215, 188, 0.18);
        }

        .clearHeroBadge {
          color: #bdd6ce;
          background: rgba(53, 137, 116, 0.14);
          border: 1px solid rgba(92, 225, 200, 0.2);
        }

        .heroMetaRow {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 26px;
          color: #72809b;
          font-size: 12px;
        }

        .heroMetaRow strong {
          color: #b9c6db;
          font-weight: 700;
        }

        .metaSeparator {
          color: #35415a;
        }

        .boundaryCard {
          position: relative;
          overflow: hidden;
          padding: 26px;
          border: 1px solid rgba(125, 150, 205, 0.18);
          border-radius: 24px;
          background:
            linear-gradient(145deg, rgba(19, 28, 47, 0.94), rgba(9, 14, 25, 0.95));
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.26);
        }

        .boundaryCard::before {
          content: '';
          position: absolute;
          inset: 0 auto auto 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #5576ff, #62dbc5, transparent 82%);
        }

        .boundaryCard strong {
          display: block;
          margin-top: 14px;
          color: #f6f8ff;
          font-size: 20px;
          line-height: 1.3;
        }

        .boundaryCard p:last-child {
          margin: 14px 0 0;
          color: #9faec7;
          font-size: 14px;
          line-height: 1.65;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-top: 8px;
        }

        .summaryCard {
          min-width: 0;
          min-height: 134px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          background: rgba(11, 16, 28, 0.84);
          color: inherit;
          text-align: left;
          cursor: pointer;
          transition:
            transform 150ms ease,
            border-color 150ms ease,
            background 150ms ease;
        }

        .summaryCard:hover {
          transform: translateY(-2px);
          border-color: rgba(113, 143, 211, 0.35);
          background: rgba(15, 22, 38, 0.96);
        }

        .summaryCardActive {
          border-color: rgba(98, 219, 197, 0.42);
          box-shadow: inset 0 0 0 1px rgba(98, 219, 197, 0.08);
        }

        .summaryLabel,
        .summaryHint {
          display: block;
        }

        .summaryLabel {
          color: #8393b0;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .summaryNumber {
          display: block;
          margin-top: 10px;
          font-size: 34px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .summaryHint {
          margin-top: 10px;
          color: #64718a;
          font-size: 11px;
          line-height: 1.4;
        }

        .controlPanel {
          margin-top: 24px;
          padding: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 22px;
          background: rgba(9, 13, 22, 0.86);
          backdrop-filter: blur(14px);
        }

        .controlHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
        }

        .controlHeader h2 {
          margin: 6px 0 0;
          font-size: 22px;
          letter-spacing: -0.025em;
        }

        .queueReadout {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
          color: #7b8ba7;
          font-size: 12px;
        }

        .queueReadout span {
          padding: 6px 9px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.025);
        }

        .filterGrid {
          display: grid;
          grid-template-columns: minmax(260px, 1.7fr) minmax(160px, 0.7fr) minmax(180px, 0.8fr) auto;
          gap: 12px;
          margin-top: 18px;
          align-items: end;
        }

        .searchField,
        .selectField {
          display: grid;
          gap: 7px;
        }

        .searchField span,
        .selectField span {
          color: #7f8ca5;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        input,
        select {
          width: 100%;
          min-height: 44px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 12px;
          outline: none;
          background: #0b101b;
          color: #e9eef9;
          font: inherit;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }

        input:focus,
        select:focus {
          border-color: rgba(98, 219, 197, 0.48);
          box-shadow: 0 0 0 3px rgba(98, 219, 197, 0.08);
        }

        input::placeholder {
          color: #56627a;
        }

        select {
          cursor: pointer;
        }

        .errorPanel,
        .loadingPanel,
        .emptyPanel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 18px;
          padding: 22px;
          border-radius: 18px;
        }

        .errorPanel {
          border: 1px solid rgba(255, 104, 126, 0.25);
          background: rgba(94, 25, 37, 0.18);
        }

        .errorPanel strong {
          display: block;
          margin-top: 6px;
          color: #ffbdc7;
          font-size: 14px;
        }

        .inboxSection {
          margin-top: 18px;
        }

        .loadingPanel,
        .emptyPanel {
          min-height: 180px;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(9, 13, 22, 0.72);
          color: #9daac1;
        }

        .loadingPanel strong,
        .emptyPanel h2 {
          color: #edf2ff;
        }

        .loadingPanel p,
        .emptyPanel p {
          margin: 6px 0 0;
          line-height: 1.6;
        }

        .spinner {
          width: 34px;
          height: 34px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #62dbc5;
          border-radius: 50%;
          animation: spin 900ms linear infinite;
        }

        .emptyIcon {
          display: grid;
          place-items: center;
          width: 52px;
          height: 52px;
          flex: 0 0 52px;
          border: 1px solid rgba(98, 219, 197, 0.2);
          border-radius: 16px;
          background: rgba(98, 219, 197, 0.08);
          color: #72e4cf;
          font-size: 25px;
          font-weight: 800;
        }

        .notificationStack {
          display: grid;
          gap: 14px;
        }

        .notificationCard {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 22px;
          background:
            linear-gradient(145deg, rgba(14, 20, 34, 0.97), rgba(7, 11, 20, 0.97));
          box-shadow: 0 22px 65px rgba(0, 0, 0, 0.19);
        }

        .notificationCard.state-unread {
          border-color: rgba(103, 231, 207, 0.19);
        }

        .notificationCard.priority-critical {
          border-color: rgba(255, 82, 113, 0.36);
        }

        .notificationCard.priority-action_required {
          border-color: rgba(255, 174, 76, 0.29);
        }

        .notificationAccent {
          position: absolute;
          inset: 0 auto 0 0;
          width: 3px;
          background: #485978;
        }

        .state-unread .notificationAccent {
          background: #62dbc5;
          box-shadow: 0 0 25px rgba(98, 219, 197, 0.35);
        }

        .priority-action_required .notificationAccent {
          background: #ffb250;
        }

        .priority-critical .notificationAccent {
          background: #ff607b;
        }

        .notificationMain {
          padding: 22px 24px 20px 26px;
        }

        .notificationHeader,
        .identityRow,
        .actionRow,
        .detailsHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .badgeRow {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
        }

        .stateBadge,
        .priorityBadge,
        .typeBadge {
          display: inline-flex;
          align-items: center;
          min-height: 26px;
          padding: 0 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .stateBadge {
          border: 1px solid rgba(255, 255, 255, 0.09);
          color: #9eabc1;
          background: rgba(255, 255, 255, 0.035);
        }

        .stateBadge-unread {
          color: #8ff2df;
          border-color: rgba(98, 219, 197, 0.21);
          background: rgba(98, 219, 197, 0.075);
        }

        .stateBadge-acknowledged {
          color: #aebee1;
          border-color: rgba(111, 142, 213, 0.23);
          background: rgba(78, 106, 170, 0.09);
        }

        .stateBadge-resolved {
          color: #8794aa;
        }

        .priorityBadge-informational {
          color: #b6c1d4;
          background: rgba(116, 135, 169, 0.1);
          border: 1px solid rgba(116, 135, 169, 0.17);
        }

        .priorityBadge-attention {
          color: #e4d28e;
          background: rgba(197, 160, 47, 0.11);
          border: 1px solid rgba(197, 160, 47, 0.18);
        }

        .priorityBadge-action_required {
          color: #ffd096;
          background: rgba(255, 163, 64, 0.1);
          border: 1px solid rgba(255, 163, 64, 0.2);
        }

        .priorityBadge-critical {
          color: #ffafbd;
          background: rgba(255, 82, 113, 0.1);
          border: 1px solid rgba(255, 82, 113, 0.2);
        }

        .typeBadge {
          color: #71809b;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.025);
        }

        .timestampBlock {
          display: grid;
          justify-items: end;
          gap: 3px;
          color: #65728a;
          font-size: 11px;
          white-space: nowrap;
        }

        .timestampBlock strong {
          color: #8b99b0;
          font-weight: 700;
        }

        .identityRow {
          margin-top: 20px;
        }

        .identityCopy {
          min-width: 0;
        }

        .identityCopy h2 {
          margin: 5px 0 0;
          color: #f2f5fc;
          font-size: clamp(24px, 3vw, 34px);
          line-height: 1.12;
          letter-spacing: -0.035em;
        }

        .notificationMessage {
          max-width: 920px;
          margin: 10px 0 0;
          color: #9ba9bf;
          font-size: 14px;
          line-height: 1.65;
        }

        .identifierPlate {
          min-width: 220px;
          padding: 12px 14px;
          border: 1px solid rgba(98, 219, 197, 0.16);
          border-radius: 13px;
          background: rgba(98, 219, 197, 0.055);
        }

        .identifierPlate span {
          display: block;
          color: #739187;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .identifierPlate strong {
          display: block;
          margin-top: 5px;
          color: #c7f3e9;
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
          font-size: 13px;
          letter-spacing: 0.02em;
        }

        .metadataGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1px;
          margin: 20px 0 0;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.055);
        }

        .metadataGrid > div {
          min-width: 0;
          padding: 13px 14px;
          background: #0a0f19;
        }

        dt {
          color: #60708a;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        dd {
          margin: 5px 0 0;
          color: #b9c3d4;
          font-size: 12px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .monoText {
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
          font-size: 10px;
          color: #8290a8;
        }

        .detailsPanel {
          margin-top: 16px;
          padding: 18px;
          border: 1px solid rgba(117, 143, 199, 0.13);
          border-radius: 15px;
          background: rgba(5, 8, 14, 0.62);
        }

        .detailsHeader {
          align-items: center;
        }

        .detailsHeader strong {
          display: block;
          margin-top: 4px;
          color: #cad3e4;
          font-size: 14px;
        }

        .detailList {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin: 16px 0 0;
        }

        .detailList > div {
          padding: 10px 0 0;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .payloadDetails {
          margin-top: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 13px;
        }

        .payloadDetails summary {
          color: #8da0c4;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .payloadDetails pre {
          overflow: auto;
          max-height: 360px;
          margin: 12px 0 0;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          background: #05070c;
          color: #8997ac;
          font-size: 10px;
          line-height: 1.6;
        }

        :global(.notificationDeliveryStatus) {
          margin-top: 14px;
          width: fit-content;
          max-width: 100%;
        }

        :global(.notificationDeliveryAudit) {
          margin-top: 14px;
          width: 100%;
        }

        .actionRow {
          align-items: center;
          margin-top: 18px;
          padding-top: 17px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .actionGroup {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .actionGroupRight {
          justify-content: flex-end;
        }

        .primaryButton,
        .secondaryButton,
        .ghostButton,
        .linkButton,
        .resetButton,
        .textButton,
        .textLink {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
          cursor: pointer;
          transition:
            transform 140ms ease,
            opacity 140ms ease,
            border-color 140ms ease,
            background 140ms ease;
        }

        .primaryButton,
        .secondaryButton,
        .ghostButton,
        .resetButton,
        .textButton {
          font-family: inherit;
        }

        .primaryButton:hover:not(:disabled),
        .secondaryButton:hover:not(:disabled),
        .ghostButton:hover:not(:disabled),
        .linkButton:hover,
        .resetButton:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .primaryButton {
          padding: 0 14px;
          border: 1px solid rgba(98, 219, 197, 0.38);
          background: linear-gradient(135deg, #60dfc8, #4ec8b9);
          color: #07110f;
          box-shadow: 0 10px 30px rgba(62, 202, 180, 0.13);
        }

        .secondaryButton,
        .ghostButton,
        .resetButton {
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.035);
          color: #b8c4d7;
        }

        .ghostButton {
          background: rgba(10, 15, 25, 0.72);
        }

        .compactButton {
          min-height: 38px;
        }

        .linkButton {
          padding: 0 13px;
          border: 1px solid rgba(87, 119, 202, 0.22);
          background: rgba(73, 102, 174, 0.09);
          color: #b4c8f6;
        }

        .textButton,
        .textLink {
          min-height: 34px;
          padding: 0 6px;
          border: 0;
          background: transparent;
          color: #8295bc;
        }

        .textButton:hover,
        .textLink:hover {
          color: #c1cff0;
        }

        button:disabled {
          opacity: 0.48;
          cursor: not-allowed;
        }

        .doctrinePanel {
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          gap: 36px;
          margin-top: 28px;
          padding: 28px;
          border: 1px solid rgba(98, 219, 197, 0.12);
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(20, 39, 48, 0.56), rgba(9, 13, 22, 0.9));
        }

        .doctrinePanel h2 {
          margin: 8px 0 0;
          color: #eaf5f2;
          font-size: clamp(22px, 2.5vw, 32px);
          line-height: 1.18;
          letter-spacing: -0.03em;
        }

        .doctrinePanel > p {
          margin: 0;
          align-self: center;
          color: #91a5ac;
          font-size: 14px;
          line-height: 1.75;
        }

        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          margin-top: 26px;
          padding: 24px 2px 4px;
          color: #56637b;
          font-size: 11px;
        }

        .footer > div:first-child {
          display: grid;
          gap: 3px;
        }

        .footer strong {
          color: #7d8ca7;
        }

        .footerLinks {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 14px;
        }

        .footerLinks a {
          color: #667691;
          text-decoration: none;
        }

        .footerLinks a:hover {
          color: #a9b8d2;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1180px) {
          .summaryGrid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .filterGrid {
            grid-template-columns: minmax(240px, 1.4fr) minmax(160px, 0.7fr) minmax(180px, 0.8fr);
          }

          .resetButton {
            grid-column: 1 / -1;
            width: fit-content;
          }

          .metadataGrid,
          .detailList {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .summaryGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .controlHeader,
          .notificationHeader,
          .identityRow,
          .actionRow,
          .detailsHeader,
          .doctrinePanel {
            grid-template-columns: 1fr;
            flex-direction: column;
            align-items: stretch;
          }

          .identifierPlate {
            min-width: 0;
          }

          .timestampBlock {
            justify-items: start;
          }

          .actionGroupRight {
            justify-content: flex-start;
          }

          .doctrinePanel {
            display: grid;
            gap: 16px;
          }
        }

        @media (max-width: 720px) {
          .pageShell {
            padding-left: 14px;
            padding-right: 14px;
          }

          .topBar,
          .footer {
            align-items: stretch;
            flex-direction: column;
          }

          .topBarRight,
          .footerLinks {
            justify-content: flex-start;
          }

          .filterGrid,
          .metadataGrid,
          .detailList {
            grid-template-columns: 1fr;
          }

          .summaryGrid {
            grid-template-columns: 1fr 1fr;
          }

          .notificationMain {
            padding: 19px 17px 18px 20px;
          }

          .hero {
            padding-top: 26px;
          }

          h1 {
            font-size: clamp(42px, 14vw, 64px);
          }
        }

        @media (max-width: 470px) {
          .summaryGrid {
            grid-template-columns: 1fr;
          }

          .summaryCard {
            min-height: 112px;
          }

          .heroMetaRow {
            display: grid;
          }

          .metaSeparator {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
