'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type JourneyState =
  | 'account_only'
  | 'opened'
  | 'started'
  | 'draft_saved'
  | 'submitted'
  | 'registered'
  | 'failed';

type RegistrationJourney = {
  userId: string;
  accountEmail: string | null;
  accountCreatedAt: string | null;
  lastSignInAt: string | null;
  firstRegistrationPageOpenedAt: string | null;
  firstRegistrationStartedAt: string | null;
  latestDraftSavedAt: string | null;
  latestSubmissionSubmittedAt: string | null;
  latestRegistrationCompletedAt: string | null;
  latestRegistrationFailedAt: string | null;
  lifecycleEventCount: number;
  governanceSubmissionCount: number;
  latestSubmissionStatus: string | null;
  journeyState: JourneyState;
  latestJourneyAt: string | null;
};

type JourneyResponse = {
  ok?: boolean;
  summary?: {
    totalAccounts: number;
    accountOnly: number;
    opened: number;
    started: number;
    draftSaved: number;
    submitted: number;
    registered: number;
    failed: number;
  };
  journeys?: RegistrationJourney[];
  error?: string;
};

function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function stateLabel(state: JourneyState): string {
  switch (state) {
    case 'account_only':
      return 'Account only';
    case 'opened':
      return 'Opened registration';
    case 'started':
      return 'Started registration';
    case 'draft_saved':
      return 'Draft saved';
    case 'submitted':
      return 'Submitted';
    case 'registered':
      return 'Registered';
    case 'failed':
      return 'Needs attention';
  }
}

export function RegistryRegistrationJourneyPanel() {
  const [payload, setPayload] = useState<JourneyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        '/api/ai-governance/registry/admin-registration-journeys?limit=250',
        {
          credentials: 'same-origin',
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        },
      );

      const next = (await response.json()) as JourneyResponse;

      if (!response.ok) {
        throw new Error(next.error || 'Unable to load registration journeys.');
      }

      setPayload(next);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Unable to load registration journeys.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const journeys = useMemo(() => {
    const rows = payload?.journeys ?? [];
    const needle = search.trim().toLowerCase();

    if (!needle) return rows;

    return rows.filter((row) =>
      [
        row.accountEmail,
        row.latestSubmissionStatus,
        stateLabel(row.journeyState),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle)),
    );
  }, [payload, search]);

  const summary = payload?.summary;

  return (
    <section className="journeyPanel">
      <div className="journeyHeader">
        <div>
          <span className="eyebrow">Registration awareness</span>
          <h2>Registration Journeys</h2>
          <p>
            See who entered the Exchange, opened registration, started,
            saved a draft, submitted, completed, or encountered a failure.
          </p>
        </div>

        <button type="button" onClick={() => void load()} disabled={loading}>
          {loading ? 'Checking…' : 'Refresh'}
        </button>
      </div>

      {summary ? (
        <div className="summaryGrid">
          <article><span>Accounts</span><strong>{summary.totalAccounts}</strong></article>
          <article><span>Account only</span><strong>{summary.accountOnly}</strong></article>
          <article><span>Opened</span><strong>{summary.opened}</strong></article>
          <article><span>Started</span><strong>{summary.started}</strong></article>
          <article><span>Draft saved</span><strong>{summary.draftSaved}</strong></article>
          <article><span>Submitted</span><strong>{summary.submitted}</strong></article>
          <article><span>Registered</span><strong>{summary.registered}</strong></article>
          <article><span>Failed</span><strong>{summary.failed}</strong></article>
        </div>
      ) : null}

      <div className="toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search email, state, or submission status"
          aria-label="Search registration journeys"
        />
        <span>{journeys.length} visible</span>
      </div>

      {error ? <div className="errorBox">{error}</div> : null}

      {!loading && !error && journeys.length === 0 ? (
        <div className="emptyBox">No registration journeys match this view.</div>
      ) : null}

      <div className="journeyList">
        {journeys.map((journey) => (
          <article className="journeyCard" key={journey.userId}>
            <div className="cardTop">
              <div>
                <strong>{journey.accountEmail || 'Email unavailable'}</strong>
                <span>{formatDate(journey.latestJourneyAt)}</span>
              </div>
              <span className={`state state-${journey.journeyState}`}>
                {stateLabel(journey.journeyState)}
              </span>
            </div>

            <div className="timeline">
              <div className={journey.accountCreatedAt ? 'complete' : ''}>
                <span>Account</span>
                <strong>{formatDate(journey.accountCreatedAt)}</strong>
              </div>
              <div className={journey.firstRegistrationPageOpenedAt ? 'complete' : ''}>
                <span>Opened</span>
                <strong>{formatDate(journey.firstRegistrationPageOpenedAt)}</strong>
              </div>
              <div className={journey.firstRegistrationStartedAt ? 'complete' : ''}>
                <span>Started</span>
                <strong>{formatDate(journey.firstRegistrationStartedAt)}</strong>
              </div>
              <div className={journey.latestDraftSavedAt ? 'complete' : ''}>
                <span>Draft</span>
                <strong>{formatDate(journey.latestDraftSavedAt)}</strong>
              </div>
              <div className={journey.latestSubmissionSubmittedAt ? 'complete' : ''}>
                <span>Submitted</span>
                <strong>{formatDate(journey.latestSubmissionSubmittedAt)}</strong>
              </div>
              <div className={journey.latestRegistrationCompletedAt ? 'complete' : ''}>
                <span>Registered</span>
                <strong>{formatDate(journey.latestRegistrationCompletedAt)}</strong>
              </div>
            </div>

            <div className="cardFooter">
              <span>Lifecycle events: {journey.lifecycleEventCount}</span>
              <span>Governance submissions: {journey.governanceSubmissionCount}</span>
              <span>Latest submission: {journey.latestSubmissionStatus || 'none'}</span>
              <span>Last sign-in: {formatDate(journey.lastSignInAt)}</span>
            </div>

            {journey.latestRegistrationFailedAt ? (
              <div className="failure">
                Registration failure recorded {formatDate(journey.latestRegistrationFailedAt)}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <div className="boundary">
        Journey telemetry is administrative awareness only. It does not create
        a governance submission or establish registered status.
      </div>

      <style jsx>{`
        .journeyPanel { display:grid; gap:18px; padding:22px; border:1px solid rgba(255,255,255,.1); border-radius:22px; background:rgba(255,255,255,.025); }
        .journeyHeader { display:flex; justify-content:space-between; gap:18px; align-items:flex-start; }
        .journeyHeader h2 { margin:4px 0 7px; font-size:24px; }
        .journeyHeader p { margin:0; max-width:760px; opacity:.68; line-height:1.6; font-size:12px; }
        .eyebrow { font-size:9px; font-weight:900; letter-spacing:.14em; text-transform:uppercase; opacity:.5; }
        button { border:1px solid rgba(255,255,255,.14); border-radius:12px; padding:9px 13px; background:rgba(255,255,255,.045); color:inherit; cursor:pointer; font-weight:800; }
        button:disabled { opacity:.5; cursor:default; }
        .summaryGrid { display:grid; grid-template-columns:repeat(8,minmax(0,1fr)); gap:8px; }
        .summaryGrid article { display:grid; gap:5px; padding:11px; border:1px solid rgba(255,255,255,.08); border-radius:13px; }
        .summaryGrid span { font-size:8px; text-transform:uppercase; letter-spacing:.08em; opacity:.48; font-weight:900; }
        .summaryGrid strong { font-size:18px; }
        .toolbar { display:flex; align-items:center; gap:12px; }
        .toolbar input { flex:1; min-width:0; border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:11px 12px; background:rgba(0,0,0,.18); color:inherit; outline:none; }
        .toolbar span { font-size:10px; opacity:.55; white-space:nowrap; }
        .journeyList { display:grid; gap:11px; }
        .journeyCard { display:grid; gap:13px; padding:15px; border:1px solid rgba(255,255,255,.09); border-radius:16px; background:rgba(255,255,255,.018); }
        .cardTop { display:flex; justify-content:space-between; gap:12px; align-items:flex-start; }
        .cardTop > div { display:grid; gap:3px; }
        .cardTop strong { overflow-wrap:anywhere; font-size:12px; }
        .cardTop div span { font-size:9px; opacity:.5; }
        .state { border:1px solid rgba(255,255,255,.12); border-radius:999px; padding:5px 8px; font-size:8px; font-weight:900; text-transform:uppercase; letter-spacing:.07em; white-space:nowrap; }
        .state-failed { border-color:rgba(255,190,90,.5); }
        .state-registered { box-shadow:0 0 14px rgba(255,255,255,.08); }
        .timeline { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:7px; }
        .timeline > div { display:grid; gap:4px; padding:9px; border:1px solid rgba(255,255,255,.06); border-radius:10px; opacity:.42; }
        .timeline > div.complete { opacity:1; border-color:rgba(255,255,255,.14); }
        .timeline span { font-size:8px; text-transform:uppercase; letter-spacing:.07em; font-weight:900; }
        .timeline strong { font-size:9px; line-height:1.35; overflow-wrap:anywhere; }
        .cardFooter { display:flex; flex-wrap:wrap; gap:8px 14px; font-size:9px; opacity:.58; }
        .failure { padding:9px 10px; border:1px solid rgba(255,190,90,.32); border-radius:10px; font-size:9px; }
        .boundary,.emptyBox,.errorBox { padding:11px 12px; border:1px solid rgba(255,255,255,.08); border-radius:12px; font-size:10px; line-height:1.5; opacity:.68; }
        .errorBox { border-color:rgba(255,190,90,.35); opacity:1; }
        @media(max-width:1050px){ .summaryGrid{grid-template-columns:repeat(4,minmax(0,1fr));}.timeline{grid-template-columns:repeat(3,minmax(0,1fr));} }
        @media(max-width:650px){ .journeyPanel{padding:15px}.journeyHeader{display:grid}.summaryGrid{grid-template-columns:repeat(2,minmax(0,1fr));}.timeline{grid-template-columns:1fr 1fr}.toolbar{align-items:stretch;flex-direction:column}.cardTop{display:grid}.state{width:fit-content} }
      `}</style>
    </section>
  );
}
