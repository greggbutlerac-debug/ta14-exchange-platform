'use client';

import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useMemo, useState } from 'react';

type ReviewQueueItem = {
  id: string;
  governance_name: string;
  short_name: string | null;
  current_version: string | null;
  governance_category: string | null;
  record_visibility: string | null;
  status: string;
  submitted_at: string | null;
  updated_at: string | null;
  created_at: string | null;
};

type QueueFilter = 'all' | 'submitted' | 'accepted' | 'disputed';

function formatDate(value: string | null) {
  if (!value) return 'Not recorded';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function label(value: string | null | undefined, fallback = 'Not declared') {
  if (!value?.trim()) return fallback;

  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizedStatus(value: string) {
  return value.trim().toLowerCase().replaceAll(' ', '_');
}

export default function RegistryReviewerQueuePage() {
  const [records, setRecords] = useState<ReviewQueueItem[]>([]);
  const [filter, setFilter] = useState<QueueFilter>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return null;

    return createBrowserClient(url, anonKey);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadQueue() {
      setLoading(true);
      setError('');

      try {
        if (!supabase) {
          throw new Error('Supabase environment variables are not configured.');
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.access_token) {
          throw new Error(
            'Your reviewer session is missing or expired. Sign in again.',
          );
        }

        const { data, error: queryError } = await supabase
          .from('ai_governance_registry_submissions')
          .select(
            [
              'id',
              'governance_name',
              'short_name',
              'current_version',
              'governance_category',
              'record_visibility',
              'status',
              'submitted_at',
              'updated_at',
              'created_at',
            ].join(','),
          )
          .in('status', ['submitted', 'accepted', 'disputed'])
          .order('submitted_at', { ascending: true, nullsFirst: false });

        if (queryError) throw queryError;
        if (cancelled) return;

        setRecords((data ?? []) as ReviewQueueItem[]);
      } catch (caught) {
        if (cancelled) return;

        setError(
          caught instanceof Error
            ? caught.message
            : 'The reviewer queue could not be loaded.',
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadQueue();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const status = normalizedStatus(record.status);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'submitted' && status === 'submitted') ||
        (filter === 'accepted' && status === 'accepted') ||
        (filter === 'disputed' && status === 'disputed');

      if (!matchesFilter) return false;
      if (!query) return true;

      return [
        record.governance_name,
        record.short_name,
        record.current_version,
        record.governance_category,
        record.id,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [filter, records, search]);

  const counts = useMemo(() => {
    return records.reduce(
      (current, record) => {
        const status = normalizedStatus(record.status);

        current.all += 1;
        if (status === 'submitted') current.submitted += 1;
        if (status === 'accepted') current.accepted += 1;
        if (status === 'disputed') current.disputed += 1;

        return current;
      },
      { all: 0, submitted: 0, accepted: 0, disputed: 0 },
    );
  }, [records]);

  return (
    <main className="pageShell">
      <div className="stars starsOne" aria-hidden="true" />
      <div className="stars starsTwo" aria-hidden="true" />
      <div className="orbit orbitOne" aria-hidden="true" />
      <div className="orbit orbitTwo" aria-hidden="true" />

      <nav className="topBar">
        <Link
          href="/workspace/ai-governance/registry"
          className="secondaryButton"
        >
          Registry Home
        </Link>

        <Link
          href="/workspace/ai-governance/registry/directory"
          className="textLink"
        >
          Public Directory
        </Link>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">CONTROLLED REVIEW WORKSPACE</p>
          <h1>Registry Reviewer Queue</h1>
          <p className="lead">
            Review submitted AI governance records, preserve bounded reviewer
            decisions, resolve disputes, and finalize only records that have
            reached the required lifecycle state.
          </p>
        </div>

        <aside className="boundaryPanel">
          <p className="eyebrow">REVIEW BOUNDARY</p>
          <strong>Review is not certification.</strong>
          <p>
            Reviewer actions evaluate Registry completeness and lifecycle
            requirements. They do not certify effectiveness, legality, safety,
            compliance, or operational fitness.
          </p>
        </aside>
      </section>

      <section className="controlCard">
        <div className="filterRow" role="group" aria-label="Queue filters">
          {(
            [
              ['all', 'All', counts.all],
              ['submitted', 'Submitted', counts.submitted],
              ['accepted', 'Accepted', counts.accepted],
              ['disputed', 'Disputed', counts.disputed],
            ] as const
          ).map(([value, text, count]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? 'filter activeFilter' : 'filter'}
              onClick={() => setFilter(value)}
            >
              {text}
              <span>{count}</span>
            </button>
          ))}
        </div>

        <label className="searchBox">
          <span>Search reviewer queue</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Governance name, category, version, or submission ID"
          />
        </label>
      </section>

      {loading ? (
        <section className="stateCard">
          <span className="pulseDot" aria-hidden="true" />
          <div>
            <p className="eyebrow">REVIEWER QUEUE</p>
            <h2>Loading controlled submissions.</h2>
            <p>
              Retrieving records available under the current reviewer
              permissions.
            </p>
          </div>
        </section>
      ) : null}

      {!loading && error ? (
        <section className="stateCard errorCard">
          <div>
            <p className="eyebrow">QUEUE UNAVAILABLE</p>
            <h2>The reviewer queue could not be opened.</h2>
            <p>{error}</p>
          </div>

          <button
            type="button"
            className="primaryButton"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </section>
      ) : null}

      {!loading && !error && filteredRecords.length === 0 ? (
        <section className="stateCard">
          <div>
            <p className="eyebrow">NO MATCHING RECORDS</p>
            <h2>The current reviewer queue is clear.</h2>
            <p>
              No submissions match this lifecycle filter and search query.
            </p>
          </div>
        </section>
      ) : null}

      {!loading && !error && filteredRecords.length > 0 ? (
        <section className="queueGrid">
          {filteredRecords.map((record) => {
            const status = normalizedStatus(record.status);

            return (
              <article className="recordCard" key={record.id}>
                <div className="cardTop">
                  <div>
                    <p className="eyebrow">{label(record.status)}</p>
                    <h2>{record.governance_name}</h2>
                  </div>

                  <span className={`statusBadge status-${status}`}>
                    {label(record.status)}
                  </span>
                </div>

                <p className="submissionId">{record.id}</p>

                <dl className="detailGrid">
                  <div>
                    <dt>Short name</dt>
                    <dd>{record.short_name || 'Not declared'}</dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{label(record.governance_category)}</dd>
                  </div>
                  <div>
                    <dt>Version</dt>
                    <dd>{record.current_version || 'Not declared'}</dd>
                  </div>
                  <div>
                    <dt>Visibility</dt>
                    <dd>{label(record.record_visibility)}</dd>
                  </div>
                  <div>
                    <dt>Submitted</dt>
                    <dd>{formatDate(record.submitted_at)}</dd>
                  </div>
                  <div>
                    <dt>Last updated</dt>
                    <dd>{formatDate(record.updated_at || record.created_at)}</dd>
                  </div>
                </dl>

                <div className="cardFooter">
                  <p>
                    Open the controlled submission to review evidence,
                    preserve a decision, manage a dispute, or finalize an
                    accepted record.
                  </p>

                  <Link
                    href={`/workspace/ai-governance/registry/review/${encodeURIComponent(
                      record.id,
                    )}`}
                    className="primaryButton"
                  >
                    Open Review
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}

      <style jsx global>{styles}</style>
    </main>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background:
      radial-gradient(circle at 10% 8%, rgba(72, 122, 255, 0.18), transparent 32rem),
      radial-gradient(circle at 88% 12%, rgba(103, 231, 195, 0.12), transparent 30rem),
      radial-gradient(circle at 50% 95%, rgba(255, 184, 82, 0.08), transparent 32rem),
      #07101f;
    color: #eef4ff;
  }

  .pageShell {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    padding: 32px 24px 88px;
  }

  .pageShell > *:not(.stars):not(.orbit) {
    position: relative;
    z-index: 2;
  }

  .stars {
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.42;
    background-image:
      radial-gradient(circle, rgba(255,255,255,.8) 0 1px, transparent 1.3px);
    background-size: 54px 54px;
    animation: starDrift 28s linear infinite;
  }

  .starsTwo {
    opacity: 0.18;
    background-size: 86px 86px;
    animation-duration: 48s;
    animation-direction: reverse;
  }

  .orbit {
    position: fixed;
    width: 430px;
    height: 430px;
    border: 1px solid rgba(127, 228, 196, 0.12);
    border-radius: 50%;
    pointer-events: none;
    animation: rotateOrbit 36s linear infinite;
  }

  .orbit::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    top: 22px;
    left: 210px;
    border-radius: 50%;
    background: rgba(127, 228, 196, 0.85);
    box-shadow: 0 0 24px rgba(127, 228, 196, 0.9);
  }

  .orbitOne {
    top: 4%;
    right: -200px;
  }

  .orbitTwo {
    width: 540px;
    height: 540px;
    left: -250px;
    bottom: 2%;
    animation-duration: 52s;
    animation-direction: reverse;
  }

  .topBar,
  .hero,
  .controlCard,
  .queueGrid,
  .stateCard {
    width: min(1180px, 100%);
    margin-inline: auto;
  }

  .topBar {
    margin-bottom: 38px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
  }

  .hero {
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
    gap: 24px;
  }

  .hero > div,
  .boundaryPanel,
  .controlCard,
  .recordCard,
  .stateCard {
    border: 1px solid rgba(164, 190, 231, 0.18);
    background: rgba(11, 25, 47, 0.86);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(18px);
  }

  .hero > div,
  .boundaryPanel,
  .controlCard,
  .recordCard,
  .stateCard {
    border-radius: 24px;
  }

  .hero > div {
    padding: clamp(28px, 5vw, 52px);
  }

  .boundaryPanel {
    padding: 26px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .boundaryPanel strong {
    margin-bottom: 12px;
    font-size: 1.7rem;
  }

  h1,
  h2,
  p {
    margin-top: 0;
  }

  h1 {
    margin-bottom: 18px;
    font-size: clamp(2.8rem, 6vw, 5.8rem);
    line-height: 0.95;
    letter-spacing: -0.055em;
  }

  h2 {
    margin-bottom: 10px;
    font-size: clamp(1.45rem, 2.8vw, 2.2rem);
    letter-spacing: -0.035em;
  }

  .eyebrow {
    margin-bottom: 10px;
    color: #7fe4c4;
    font-size: 0.76rem;
    font-weight: 900;
    letter-spacing: 0.18em;
  }

  .lead,
  .boundaryPanel p,
  .recordCard p,
  .stateCard p {
    margin-bottom: 0;
    color: #aebdd4;
    line-height: 1.7;
  }

  .controlCard {
    margin-bottom: 18px;
    padding: 20px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 0.65fr);
    gap: 20px;
    align-items: end;
  }

  .filterRow {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }

  .filter {
    min-height: 42px;
    padding: 8px 12px;
    display: inline-flex;
    gap: 8px;
    align-items: center;
    border: 1px solid rgba(164, 190, 231, 0.2);
    border-radius: 999px;
    background: rgba(8, 19, 37, 0.58);
    color: #c3cee0;
    font: inherit;
    font-weight: 850;
    cursor: pointer;
  }

  .filter span {
    min-width: 24px;
    padding: 3px 6px;
    border-radius: 999px;
    background: rgba(127, 228, 196, 0.12);
    color: #9ff0d6;
    text-align: center;
    font-size: 0.76rem;
  }

  .activeFilter {
    border-color: rgba(127, 228, 196, 0.55);
    background: rgba(31, 71, 91, 0.6);
    color: #effff9;
  }

  .searchBox {
    display: grid;
    gap: 7px;
    color: #9dadc3;
    font-size: 0.74rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .searchBox input {
    min-height: 46px;
    width: 100%;
    border: 1px solid rgba(164, 190, 231, 0.22);
    border-radius: 12px;
    outline: none;
    padding: 0 14px;
    background: rgba(7, 17, 33, 0.72);
    color: #eef4ff;
    font: inherit;
  }

  .searchBox input:focus {
    border-color: rgba(127, 228, 196, 0.7);
    box-shadow: 0 0 0 3px rgba(127, 228, 196, 0.08);
  }

  .queueGrid {
    display: grid;
    gap: 16px;
  }

  .recordCard {
    padding: 24px;
  }

  .cardTop,
  .cardFooter {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 22px;
  }

  .statusBadge {
    padding: 8px 11px;
    flex: 0 0 auto;
    border: 1px solid rgba(164, 190, 231, 0.22);
    border-radius: 999px;
    color: #dbe7f9;
    font-size: 0.77rem;
    font-weight: 900;
  }

  .status-submitted {
    border-color: rgba(126, 182, 255, 0.42);
    background: rgba(69, 111, 174, 0.22);
    color: #bcd9ff;
  }

  .status-accepted {
    border-color: rgba(127, 228, 196, 0.42);
    background: rgba(34, 118, 92, 0.22);
    color: #bff7e5;
  }

  .status-disputed {
    border-color: rgba(255, 184, 82, 0.42);
    background: rgba(161, 99, 20, 0.22);
    color: #ffdda7;
  }

  .submissionId {
    margin: 2px 0 18px !important;
    color: #ffd27f !important;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.8rem;
    overflow-wrap: anywhere;
  }

  .detailGrid {
    margin: 0 0 20px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .detailGrid > div {
    min-width: 0;
    padding: 14px;
    border: 1px solid rgba(164, 190, 231, 0.1);
    border-radius: 13px;
    background: rgba(7, 17, 33, 0.36);
  }

  dt {
    margin-bottom: 6px;
    color: #8092ae;
    font-size: 0.68rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .cardFooter {
    align-items: center;
    padding-top: 18px;
    border-top: 1px solid rgba(164, 190, 231, 0.1);
  }

  .cardFooter p {
    max-width: 720px;
  }

  .stateCard {
    min-height: 300px;
    padding: 34px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
  }

  .errorCard {
    border-color: rgba(255, 124, 145, 0.28);
  }

  .pulseDot {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: #7fe4c4;
    box-shadow: 0 0 28px rgba(127, 228, 196, 0.9);
    animation: pulse 1.5s ease-in-out infinite;
  }

  .primaryButton,
  .secondaryButton {
    min-height: 46px;
    padding: 11px 17px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 13px;
    font: inherit;
    font-weight: 900;
    text-decoration: none;
    cursor: pointer;
  }

  .primaryButton {
    border: 1px solid rgba(255, 226, 167, 0.72);
    background: linear-gradient(135deg, #ffe4a6, #e8a33d);
    color: #171005;
  }

  .secondaryButton {
    border: 1px solid rgba(164, 190, 231, 0.3);
    background: rgba(15, 34, 63, 0.74);
    color: #eef4ff;
  }

  .textLink {
    color: #9ec8ff;
    font-weight: 800;
    text-decoration: none;
  }

  @keyframes starDrift {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(54px, 54px, 0); }
  }

  @keyframes rotateOrbit {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(0.85); opacity: 0.6; }
    50% { transform: scale(1.2); opacity: 1; }
  }

  @media (max-width: 920px) {
    .hero,
    .controlCard,
    .detailGrid {
      grid-template-columns: 1fr;
    }

    .cardFooter {
      align-items: stretch;
      flex-direction: column;
    }
  }

  @media (max-width: 650px) {
    .pageShell {
      padding-inline: 16px;
    }

    .topBar,
    .cardTop,
    .stateCard {
      align-items: stretch;
      flex-direction: column;
    }

    .primaryButton,
    .secondaryButton {
      width: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .stars,
    .orbit,
    .pulseDot {
      animation: none;
    }
  }
`;
