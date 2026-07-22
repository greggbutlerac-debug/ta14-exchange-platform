'use client';

import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useMemo, useState } from 'react';

type RegistryRecord = {
  id: string;
  governanceName: string;
  shortName: string | null;
  currentVersion: string;
  category: string;
  status: string;
  registryIdentifier: string | null;
  visibility: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  acceptedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type ApiSuccess = {
  records: RegistryRecord[];
  count: number;
  generatedAt: string;
};

type ApiFailure = {
  error?: string;
  message?: string;
  detail?: unknown;
};

type FilterValue =
  | 'all'
  | 'draft'
  | 'submitted'
  | 'accepted'
  | 'registered'
  | 'other';

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

function statusGroup(status: string): FilterValue {
  const normalized = status.trim().toLowerCase();

  if (normalized === 'draft') return 'draft';
  if (normalized === 'submitted' || normalized === 'under_review') {
    return 'submitted';
  }
  if (normalized === 'accepted') return 'accepted';
  if (normalized === 'registered') return 'registered';

  return 'other';
}

export default function MyRegistryRecordsPage() {
  const [records, setRecords] = useState<RegistryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterValue>('all');
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return null;

    return createBrowserClient(url, anonKey);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRecords() {
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
            'Your Registry session is missing or expired. Sign in again.',
          );
        }

        const response = await fetch('/api/registry/my-records', {
          method: 'GET',
          cache: 'no-store',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            Accept: 'application/json',
          },
        });

        const payload = (await response.json()) as ApiSuccess | ApiFailure;

        if (!response.ok) {
          const failure = payload as ApiFailure;
          throw new Error(
            failure.message || 'Your Registry records could not be loaded.',
          );
        }

        if (cancelled) return;

        const success = payload as ApiSuccess;
        setRecords(success.records);
        setGeneratedAt(success.generatedAt);
      } catch (caught) {
        if (cancelled) return;

        setError(
          caught instanceof Error
            ? caught.message
            : 'Your Registry records could not be loaded.',
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadRecords();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const counts = useMemo(() => {
    return records.reduce(
      (accumulator, record) => {
        const group = statusGroup(record.status);
        accumulator[group] += 1;
        accumulator.all += 1;
        return accumulator;
      },
      {
        all: 0,
        draft: 0,
        submitted: 0,
        accepted: 0,
        registered: 0,
        other: 0,
      } satisfies Record<FilterValue, number>,
    );
  }, [records]);

  const visibleRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesFilter =
        filter === 'all' || statusGroup(record.status) === filter;

      const matchesQuery =
        !normalizedQuery ||
        [
          record.governanceName,
          record.shortName,
          record.registryIdentifier,
          record.category,
          record.currentVersion,
          record.status,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedQuery),
          );

      return matchesFilter && matchesQuery;
    });
  }, [records, query, filter]);

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
          href="/workspace/ai-governance/registry/register"
          className="primaryButton"
        >
          Register Architecture
        </Link>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">AUTHENTICATED REGISTRY WORKSPACE</p>
          <h1>My Registry Records</h1>
          <p className="lead">
            Review your drafts, submitted records, accepted records, and
            completed registrations in one account-scoped workspace.
          </p>
        </div>

        <aside className="summaryPanel">
          <span>Total accessible records</span>
          <strong>{counts.all}</strong>
          <p>
            The list is governed by the Registry&apos;s existing row-level
            security policies.
          </p>
        </aside>
      </section>

      <section className="boundaryCard">
        <p className="eyebrow">ACCOUNT BOUNDARY</p>
        <h2>Access does not imply registration.</h2>
        <p>
          Draft, review, acceptance, finalization, publication, and dispute
          handling remain separate Registry states. Registration is not
          certification.
        </p>
      </section>

      <section className="controlsCard">
        <div className="searchField">
          <label htmlFor="registry-record-search">Search records</label>
          <input
            id="registry-record-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Governance name, identifier, category, version…"
          />
        </div>

        <div className="filterRow" aria-label="Filter Registry records">
          {(
            [
              ['all', 'All'],
              ['draft', 'Drafts'],
              ['submitted', 'Submitted'],
              ['accepted', 'Accepted'],
              ['registered', 'Registered'],
              ['other', 'Other'],
            ] as Array<[FilterValue, string]>
          ).map(([value, text]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? 'filterButton active' : 'filterButton'}
              onClick={() => setFilter(value)}
            >
              {text}
              <span>{counts[value]}</span>
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <section className="stateCard">
          <span className="pulseDot" aria-hidden="true" />
          <div>
            <p className="eyebrow">LOADING ACCOUNT RECORDS</p>
            <h2>Opening your Registry workspace.</h2>
            <p>
              Retrieving the records available to the signed-in Registry
              account.
            </p>
          </div>
        </section>
      ) : null}

      {!loading && error ? (
        <section className="stateCard errorCard">
          <div>
            <p className="eyebrow">REGISTRY RECORDS UNAVAILABLE</p>
            <h2>Your account records could not be loaded.</h2>
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

      {!loading && !error && records.length === 0 ? (
        <section className="stateCard">
          <div>
            <p className="eyebrow">NO REGISTRY RECORDS YET</p>
            <h2>Begin the first governance registration.</h2>
            <p>
              Create a draft and preserve the architecture&apos;s identity,
              authority, claims, non-claims, limitations, evidence, and
              requested visibility.
            </p>
          </div>

          <Link
            href="/workspace/ai-governance/registry/register"
            className="primaryButton"
          >
            Start Registration
          </Link>
        </section>
      ) : null}

      {!loading &&
      !error &&
      records.length > 0 &&
      visibleRecords.length === 0 ? (
        <section className="stateCard">
          <div>
            <p className="eyebrow">NO MATCHING RECORDS</p>
            <h2>Adjust the search or status filter.</h2>
            <p>
              No accessible Registry records match the current view.
            </p>
          </div>

          <button
            type="button"
            className="secondaryButton"
            onClick={() => {
              setQuery('');
              setFilter('all');
            }}
          >
            Clear Filters
          </button>
        </section>
      ) : null}

      {!loading && !error && visibleRecords.length > 0 ? (
        <section className="recordsGrid">
          {visibleRecords.map((record) => {
            const group = statusGroup(record.status);
            const isRegistered =
              group === 'registered' && Boolean(record.registryIdentifier);
            const isEditable = group === 'draft';

            return (
              <article className="recordCard" key={record.id}>
                <div className="recordTopline">
                  <span className={`statusBadge status-${group}`}>
                    {label(record.status)}
                  </span>
                  <span className="visibilityBadge">
                    {label(record.visibility, 'Visibility not declared')}
                  </span>
                </div>

                <div>
                  <p className="recordIdentifier">
                    {record.registryIdentifier ?? 'Permanent identifier pending'}
                  </p>
                  <h2>{record.governanceName}</h2>
                  <p className="recordMeta">
                    {record.shortName ? `${record.shortName} · ` : ''}
                    {record.category} · Version {record.currentVersion}
                  </p>
                </div>

                <dl className="dateGrid">
                  <div>
                    <dt>Created</dt>
                    <dd>{formatDate(record.createdAt)}</dd>
                  </div>
                  <div>
                    <dt>Updated</dt>
                    <dd>{formatDate(record.updatedAt)}</dd>
                  </div>
                  <div>
                    <dt>Submitted</dt>
                    <dd>{formatDate(record.submittedAt)}</dd>
                  </div>
                  <div>
                    <dt>Accepted</dt>
                    <dd>{formatDate(record.acceptedAt)}</dd>
                  </div>
                </dl>

                <div className="recordActions">
                  {isRegistered ? (
                    <>
                      <Link
                        href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
                          record.registryIdentifier ?? '',
                        )}/citation`}
                        className="secondaryButton"
                      >
                        Cite Record
                      </Link>

                      <Link
                        href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
                          record.registryIdentifier ?? '',
                        )}`}
                        className="primaryButton"
                      >
                        Open Permanent Record
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={`/workspace/ai-governance/registry/register/${encodeURIComponent(
                        record.id,
                      )}`}
                      className="primaryButton"
                    >
                      {isEditable ? 'Continue Draft' : 'Open Record'}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      ) : null}

      {!loading && !error && generatedAt ? (
        <footer className="pageFooter">
          <p>
            Account record view generated {formatDate(generatedAt)}. Results
            are not cached.
          </p>
        </footer>
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
      radial-gradient(circle at 10% 8%, rgba(74, 122, 255, 0.18), transparent 32rem),
      radial-gradient(circle at 90% 12%, rgba(103, 231, 195, 0.12), transparent 30rem),
      radial-gradient(circle at 50% 92%, rgba(255, 184, 82, 0.08), transparent 32rem),
      #07101f;
    color: #eef4ff;
  }

  .pageShell {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    padding: 32px 24px 86px;
  }

  .pageShell > *:not(.stars):not(.orbit) {
    position: relative;
    z-index: 2;
  }

  .stars {
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.43;
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
    top: 5%;
    right: -200px;
  }

  .orbitTwo {
    width: 540px;
    height: 540px;
    left: -240px;
    bottom: 3%;
    animation-duration: 52s;
    animation-direction: reverse;
  }

  .topBar,
  .hero,
  .boundaryCard,
  .controlsCard,
  .recordsGrid,
  .stateCard,
  .pageFooter {
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
    margin-bottom: 22px;
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(260px, 0.45fr);
    gap: 28px;
    align-items: end;
  }

  h1,
  h2,
  p {
    margin-top: 0;
  }

  h1 {
    margin-bottom: 18px;
    font-size: clamp(2.7rem, 6.5vw, 6rem);
    line-height: 0.95;
    letter-spacing: -0.06em;
  }

  h2 {
    margin-bottom: 10px;
    font-size: clamp(1.55rem, 3vw, 2.45rem);
    letter-spacing: -0.035em;
  }

  .eyebrow {
    margin-bottom: 10px;
    color: #7fe4c4;
    font-size: 0.76rem;
    font-weight: 900;
    letter-spacing: 0.18em;
  }

  .lead {
    max-width: 820px;
    margin-bottom: 0;
    color: #b9c7df;
    font-size: 1.06rem;
    line-height: 1.75;
  }

  .summaryPanel,
  .boundaryCard,
  .controlsCard,
  .recordCard,
  .stateCard {
    border: 1px solid rgba(164, 190, 231, 0.18);
    background: rgba(11, 25, 47, 0.86);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(18px);
  }

  .summaryPanel {
    padding: 24px;
    border-radius: 22px;
  }

  .summaryPanel span {
    color: #91a2be;
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .summaryPanel strong {
    display: block;
    margin: 10px 0;
    font-size: 3rem;
  }

  .summaryPanel p,
  .boundaryCard p,
  .stateCard p,
  .pageFooter p {
    margin-bottom: 0;
    color: #9cadc8;
    line-height: 1.65;
  }

  .boundaryCard {
    margin-bottom: 18px;
    padding: 24px;
    border-left: 4px solid #ffd27f;
    border-radius: 18px;
  }

  .controlsCard {
    margin-bottom: 20px;
    padding: 22px;
    display: grid;
    gap: 18px;
    border-radius: 20px;
  }

  .searchField {
    display: grid;
    gap: 8px;
  }

  .searchField label {
    color: #c9d6e8;
    font-weight: 800;
  }

  .searchField input {
    width: 100%;
    min-height: 50px;
    padding: 12px 15px;
    border: 1px solid rgba(164, 190, 231, 0.25);
    border-radius: 13px;
    outline: none;
    background: rgba(6, 16, 32, 0.76);
    color: #eef4ff;
    font: inherit;
  }

  .searchField input:focus {
    border-color: rgba(127, 228, 196, 0.65);
    box-shadow: 0 0 0 3px rgba(127, 228, 196, 0.08);
  }

  .filterRow {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }

  .filterButton {
    min-height: 40px;
    padding: 9px 12px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(164, 190, 231, 0.22);
    border-radius: 999px;
    background: rgba(15, 34, 63, 0.7);
    color: #dce6f5;
    font: inherit;
    font-weight: 800;
    cursor: pointer;
  }

  .filterButton span {
    min-width: 24px;
    height: 24px;
    display: inline-grid;
    place-items: center;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    font-size: 0.75rem;
  }

  .filterButton.active {
    border-color: rgba(127, 228, 196, 0.5);
    background: rgba(32, 91, 73, 0.45);
    color: #d9fff2;
  }

  .recordsGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .recordCard {
    min-width: 0;
    padding: 24px;
    display: grid;
    gap: 20px;
    border-radius: 22px;
  }

  .recordTopline {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 9px;
  }

  .statusBadge,
  .visibilityBadge {
    padding: 7px 10px;
    border-radius: 999px;
    font-size: 0.74rem;
    font-weight: 900;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .statusBadge {
    border: 1px solid rgba(158, 200, 255, 0.25);
    background: rgba(49, 82, 129, 0.42);
    color: #cfe2ff;
  }

  .status-accepted,
  .status-registered {
    border-color: rgba(127, 228, 196, 0.3);
    background: rgba(32, 91, 73, 0.42);
    color: #c8f6e7;
  }

  .status-draft {
    border-color: rgba(255, 210, 127, 0.25);
    background: rgba(112, 75, 24, 0.34);
    color: #ffe0a8;
  }

  .visibilityBadge {
    border: 1px solid rgba(164, 190, 231, 0.18);
    background: rgba(255,255,255,0.04);
    color: #9cadc8;
  }

  .recordIdentifier {
    margin-bottom: 8px;
    color: #ffd27f;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.82rem;
    font-weight: 900;
    overflow-wrap: anywhere;
  }

  .recordMeta {
    margin-bottom: 0;
    color: #9cadc8;
    line-height: 1.6;
  }

  .dateGrid {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .dateGrid > div {
    min-width: 0;
    padding: 13px;
    border: 1px solid rgba(164, 190, 231, 0.1);
    border-radius: 12px;
    background: rgba(7, 17, 33, 0.38);
  }

  dt {
    margin-bottom: 5px;
    color: #8092ae;
    font-size: 0.69rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .recordActions {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
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

  .recordActions .primaryButton,
  .recordActions .secondaryButton {
    flex: 1 1 190px;
  }

  .stateCard {
    min-height: 300px;
    padding: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    border-radius: 23px;
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

  .pageFooter {
    margin-top: 24px;
    text-align: center;
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
    .recordsGrid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 650px) {
    .pageShell {
      padding-inline: 16px;
    }

    .topBar,
    .stateCard {
      align-items: stretch;
      flex-direction: column;
    }

    .dateGrid {
      grid-template-columns: 1fr;
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
