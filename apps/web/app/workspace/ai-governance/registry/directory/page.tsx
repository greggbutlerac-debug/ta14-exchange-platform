'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type PublicRegistryRecord = {
  id: string;
  registryIdentifier: string;
  governanceName: string;
  shortName?: string | null;
  version?: string | null;
  category?: string | null;
  steward?: string | null;
  claimedEstablishmentDate?: string | null;
  registeredAt?: string | null;
  status: string;
  summary?: string | null;
  domains?: string[];
  evidenceCount?: number;
  disputeCount?: number;
};

type RegistryResponse = {
  records: PublicRegistryRecord[];
  count: number;
  generatedAt?: string;
};

const STATUS_OPTIONS = [
  'All',
  'Registered',
  'Disputed',
  'Superseded',
  'Withdrawn',
  'Archived',
];

function formatDate(value?: string | null) {
  if (!value) return 'Not declared';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function statusClass(status: string) {
  return `status status-${status.toLowerCase().replace(/\s+/g, '-')}`;
}

export default function RegistryDirectoryPage() {
  const [records, setRecords] = useState<PublicRegistryRecord[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [serviceReady, setServiceReady] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadRegistry() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/registry/public', {
          method: 'GET',
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          if (response.status === 404 || response.status === 501 || response.status === 503) {
            if (!cancelled) {
              setServiceReady(false);
              setRecords([]);
            }
            return;
          }

          throw new Error(`Registry request failed with status ${response.status}.`);
        }

        const payload = (await response.json()) as RegistryResponse;

        if (!cancelled) {
          setServiceReady(true);
          setRecords(Array.isArray(payload.records) ? payload.records : []);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : 'The Registry directory could not be loaded.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadRegistry();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesStatus = status === 'All' || record.status === status;
      const haystack = [
        record.registryIdentifier,
        record.governanceName,
        record.shortName,
        record.category,
        record.steward,
        record.summary,
        ...(record.domains ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [query, records, status]);

  return (
    <main className="directory-page">
      <div className="cosmos" aria-hidden="true">
        <i className="star-field star-field-one" />
        <i className="star-field star-field-two" />
        <i className="orb orb-one" />
        <i className="orb orb-two" />
        <i className="orbit orbit-one" />
        <i className="orbit orbit-two" />
      </div>

      <header className="topbar">
        <Link href="/workspace/ai-governance/registry" className="brand">
          <span className="brand-mark">TA-14</span>
          <span>
            <strong>Public Registry Directory</strong>
            <small>TA-14 AI Governance Registry</small>
          </span>
        </Link>

        <div className="top-actions">
          <Link href="/workspace/ai-governance/registry" className="button button-secondary">
            Registry Home
          </Link>
          <Link href="/workspace/ai-governance/registry/register" className="button button-primary">
            Register an Architecture
          </Link>
        </div>
      </header>

      <section className="hero shell">
        <p className="eyebrow">SEARCHABLE PUBLIC GOVERNANCE RECORDS</p>
        <h1>
          Registered governance
          <span>architectures and their preserved histories.</span>
        </h1>
        <p className="hero-copy">
          Search public TA-14 Registry records by governance name, Registry identifier, category,
          steward, domain, version, or status. Registration preserves an attributable declaration;
          it does not certify legal compliance, effectiveness, ownership priority, or fitness for use.
        </p>

        <div className="boundary">
          <strong>Registration is not certification.</strong>
          <span>
            Each public record must be read together with its claims, non-claims, evidence,
            limitations, lifecycle events, and any linked disputes.
          </span>
        </div>
      </section>

      <section className="search-shell shell">
        <div className="search-panel">
          <label>
            <span>Search the Registry</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Governance name, Registry ID, steward, category, or domain"
            />
          </label>

          <label>
            <span>Registry status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              {STATUS_OPTIONS.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div className="result-count">
            <strong>{loading ? '—' : filteredRecords.length}</strong>
            <span>{filteredRecords.length === 1 ? 'public record' : 'public records'}</span>
          </div>
        </div>
      </section>

      <section className="records-shell shell" aria-live="polite">
        {loading && (
          <div className="state-card">
            <div className="loader" aria-hidden="true" />
            <h2>Opening the public Registry</h2>
            <p>Retrieving public, finalized governance records.</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-card state-error">
            <span className="state-code">DIRECTORY LOAD ERROR</span>
            <h2>The public directory could not be loaded.</h2>
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()} className="button button-primary">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && !serviceReady && (
          <div className="state-card">
            <span className="state-code">PUBLIC DATA CONNECTION NEXT</span>
            <h2>The directory page is established.</h2>
            <p>
              The public Registry directory is connected to finalized, publication-safe records.
              Private drafts, submitted records, reviewer notes, and controlled evidence remain outside
              the public projection.
            </p>
            <div className="state-actions">
              <Link href="/workspace/ai-governance/registry/register" className="button button-primary">
                Begin a Registry Filing
              </Link>
              <Link href="/workspace/ai-governance/registry" className="button button-secondary">
                Read the Registry Method
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && serviceReady && records.length === 0 && (
          <div className="state-card">
            <span className="state-code">NO PUBLIC RECORDS YET</span>
            <h2>The Registry is operational and awaiting its first finalized public record.</h2>
            <p>
              Drafts and submitted records do not appear here. A governance architecture is published
              only after review, finalization, permanent identifier assignment, and authorization for
              public visibility.
            </p>
            <Link href="/workspace/ai-governance/registry/register" className="button button-primary">
              Register the First Architecture
            </Link>
          </div>
        )}

        {!loading && !error && serviceReady && records.length > 0 && filteredRecords.length === 0 && (
          <div className="state-card">
            <span className="state-code">NO MATCHING RECORDS</span>
            <h2>No public Registry record matches this search.</h2>
            <p>Change the search terms or status filter. No hidden or private records are searched.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setStatus('All');
              }}
              className="button button-secondary"
            >
              Clear Search
            </button>
          </div>
        )}

        {!loading && !error && serviceReady && filteredRecords.length > 0 && (
          <div className="record-grid">
            {filteredRecords.map((record) => (
              <article className="record-card" key={record.id}>
                <div className="record-heading">
                  <span className={statusClass(record.status)}>{record.status}</span>
                  <span className="registry-id">{record.registryIdentifier}</span>
                </div>

                <div>
                  <p className="category">{record.category || 'AI Governance Architecture'}</p>
                  <h2>{record.governanceName}</h2>
                  {record.shortName && <p className="short-name">{record.shortName}</p>}
                </div>

                <p className="summary">
                  {record.summary ||
                    'Open the permanent Registry record to examine the architecture’s declared scope, claims, non-claims, evidence, lineage, and limitations.'}
                </p>

                <dl>
                  <div>
                    <dt>Current version</dt>
                    <dd>{record.version || 'Not declared'}</dd>
                  </div>
                  <div>
                    <dt>Steward</dt>
                    <dd>{record.steward || 'Not publicly declared'}</dd>
                  </div>
                  <div>
                    <dt>Claimed establishment</dt>
                    <dd>{formatDate(record.claimedEstablishmentDate)}</dd>
                  </div>
                  <div>
                    <dt>Registered</dt>
                    <dd>{formatDate(record.registeredAt)}</dd>
                  </div>
                </dl>

                {!!record.domains?.length && (
                  <div className="domain-list">
                    {record.domains.slice(0, 5).map((domain) => (
                      <span key={domain}>{domain}</span>
                    ))}
                  </div>
                )}

                <div className="record-footer">
                  <div>
                    <span>{record.evidenceCount ?? 0} evidence records</span>
                    <span>{record.disputeCount ?? 0} disputes</span>
                  </div>

                  <div className="record-actions">
                    <Link
                      href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
                        record.registryIdentifier,
                      )}/citation`}
                      className="record-link record-link-secondary"
                    >
                      Cite Record
                    </Link>

                    <Link
                      href={`/workspace/ai-governance/registry/records/${encodeURIComponent(
                        record.registryIdentifier,
                      )}`}
                      className="record-link"
                    >
                      Open Permanent Record <b aria-hidden="true">→</b>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="institutional-note shell">
        <div>
          <p className="eyebrow">PUBLICATION BOUNDARY</p>
          <h2>Only finalized records authorized for public visibility belong here.</h2>
        </div>
        <p>
          Drafts, incomplete submissions, reviewer deliberations, controlled evidence, private
          registrations, and records awaiting finalization must remain outside the public directory.
          Adverse lifecycle events are preserved rather than silently erased.
        </p>
      </section>

      <footer className="shell">
        <div>
          <strong>TA-14 AI Governance Registry</strong>
          <span>Dated. Searchable. Attributable. Challengeable.</span>
        </div>
        <p>No admissible evidence. No admissible execution.</p>
      </footer>

      <style jsx global>{`
        :root {
          color-scheme: dark;
          --ink: #edf7ff;
          --muted: #9db2c3;
          --blue: #75dfff;
          --gold: #ffd68c;
          --green: #6ce3b0;
          --red: #ff9696;
          --violet: #c9a7ff;
          --panel: rgba(5, 18, 31, 0.9);
          --line: rgba(125, 203, 255, 0.18);
        }

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #020914; color: var(--ink); }
        a { color: inherit; text-decoration: none; }
        button, input, select { font: inherit; }

        .directory-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 52% 5%, rgba(23, 105, 175, 0.23), transparent 31%),
            linear-gradient(180deg, #020812 0%, #061321 52%, #020812 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .cosmos { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
        .star-field { position: absolute; inset: -25%; opacity: .7; }
        .star-field-one {
          background-image: radial-gradient(circle, rgba(255,255,255,.85) 0 1px, transparent 1.5px);
          background-size: 94px 94px;
          animation: drift 55s linear infinite;
        }
        .star-field-two {
          background-image: radial-gradient(circle, rgba(101,214,255,.75) 0 1px, transparent 1.6px);
          background-size: 157px 157px;
          transform: rotate(14deg);
          animation: drift 75s linear infinite reverse;
        }
        .orb { position: absolute; border-radius: 50%; box-shadow: 0 0 55px currentColor; }
        .orb-one { width: 14px; height: 14px; top: 12%; left: 8%; color: #69dbff; background: currentColor; animation: float 8s ease-in-out infinite; }
        .orb-two { width: 20px; height: 20px; top: 30%; right: 9%; color: #e4a34a; background: currentColor; animation: float 11s ease-in-out infinite reverse; }
        .orbit { position: absolute; border: 1px solid rgba(255, 207, 130, .18); border-radius: 50%; }
        .orbit-one { width: 520px; height: 145px; top: 7%; left: -190px; transform: rotate(-18deg); }
        .orbit-two { width: 610px; height: 170px; top: 11%; right: -230px; transform: rotate(19deg); }

        .shell, .topbar { position: relative; z-index: 2; width: min(1240px, calc(100% - 40px)); margin-inline: auto; }
        .topbar {
          margin-top: 18px;
          min-height: 76px;
          padding: 12px 14px 12px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: rgba(2, 10, 19, .76);
          backdrop-filter: blur(18px);
        }
        .brand { display: flex; align-items: center; gap: 12px; }
        .brand-mark {
          width: 52px; height: 52px; display: grid; place-items: center;
          border: 1px solid rgba(255, 214, 140, .5); border-radius: 16px;
          color: var(--gold); background: linear-gradient(145deg, rgba(213,154,69,.25), rgba(26,98,155,.18));
          font-weight: 950; font-size: 13px;
        }
        .brand > span:last-child { display: grid; gap: 3px; }
        .brand strong { font-family: Georgia, serif; font-size: 17px; }
        .brand small { color: var(--muted); font-size: 10px; letter-spacing: .09em; text-transform: uppercase; }
        .top-actions { display: flex; gap: 9px; }

        .button {
          min-height: 44px; padding: 0 16px; display: inline-flex; align-items: center; justify-content: center;
          border: 1px solid transparent; border-radius: 13px; cursor: pointer;
          font-size: 11px; font-weight: 900; letter-spacing: .045em; transition: .22s ease;
        }
        .button:hover { transform: translateY(-2px); }
        .button-primary {
          color: #00121e; border-color: rgba(205,246,255,.86);
          background: linear-gradient(135deg, #bcf1ff, #66ceff 55%, #399ff4);
          box-shadow: 0 12px 28px rgba(55,172,255,.22);
        }
        .button-secondary {
          color: #dceeff; border-color: rgba(136,204,255,.26);
          background: linear-gradient(180deg, rgba(35,75,108,.72), rgba(8,26,42,.9));
        }

        .hero { padding: 105px 0 64px; text-align: center; }
        .eyebrow { margin: 0 0 16px; color: var(--gold); font-size: 10px; font-weight: 950; letter-spacing: .22em; }
        .hero h1 {
          margin: 0 auto; max-width: 1050px; font-family: Georgia, serif;
          font-size: clamp(44px, 7vw, 82px); line-height: .98; letter-spacing: -.04em; font-weight: 500;
        }
        .hero h1 span {
          display: block; margin-top: 10px; color: transparent;
          background: linear-gradient(100deg, #f8fbff, #7edcff 48%, #ffd18b);
          -webkit-background-clip: text; background-clip: text; font-style: italic;
        }
        .hero-copy { max-width: 900px; margin: 28px auto 0; color: #bdcedb; font-size: 16px; line-height: 1.8; }
        .boundary {
          max-width: 900px; margin: 28px auto 0; padding: 18px 20px;
          display: grid; gap: 6px; text-align: left; border: 1px solid rgba(255,199,108,.25);
          border-radius: 16px; background: linear-gradient(90deg, rgba(113,67,17,.22), rgba(9,24,38,.75));
        }
        .boundary strong { color: #ffe1a8; font-family: Georgia, serif; font-size: 17px; }
        .boundary span { color: #c3d0db; font-size: 13px; line-height: 1.6; }

        .search-shell { padding: 10px 0 34px; }
        .search-panel {
          display: grid; grid-template-columns: 1fr 220px 130px; gap: 14px; align-items: end;
          padding: 20px; border: 1px solid var(--line); border-radius: 20px; background: var(--panel);
          box-shadow: 0 24px 80px rgba(0,0,0,.3);
        }
        .search-panel label { display: grid; gap: 8px; }
        .search-panel label > span { color: #b9cbd8; font-size: 10px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
        .search-panel input, .search-panel select {
          width: 100%; min-height: 48px; padding: 0 14px; color: #edf7ff;
          border: 1px solid rgba(126,199,248,.22); border-radius: 13px; outline: none;
          background: rgba(3,15,26,.9);
        }
        .search-panel input:focus, .search-panel select:focus { border-color: rgba(111,215,255,.6); box-shadow: 0 0 0 3px rgba(76,182,235,.1); }
        .result-count { min-height: 48px; display: grid; place-content: center; text-align: center; border-left: 1px solid var(--line); }
        .result-count strong { font-family: Georgia, serif; color: var(--gold); font-size: 24px; }
        .result-count span { color: var(--muted); font-size: 10px; }

        .records-shell { min-height: 420px; padding: 20px 0 100px; }
        .state-card {
          max-width: 820px; margin: 30px auto; padding: 48px; text-align: center;
          border: 1px solid var(--line); border-radius: 24px; background: var(--panel);
          box-shadow: 0 24px 90px rgba(0,0,0,.34);
        }
        .state-card h2 { margin: 10px 0 13px; font-family: Georgia, serif; font-weight: 500; font-size: clamp(28px, 4vw, 42px); }
        .state-card p { max-width: 680px; margin: 0 auto 24px; color: #aebfcd; line-height: 1.75; }
        .state-code { color: var(--blue); font-size: 9px; font-weight: 950; letter-spacing: .18em; }
        .state-error { border-color: rgba(255,130,130,.24); }
        .state-actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; }
        .loader {
          width: 54px; height: 54px; margin: 0 auto 18px; border-radius: 50%;
          border: 2px solid rgba(115,216,255,.18); border-top-color: var(--blue);
          animation: spin 1s linear infinite;
        }

        .record-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .record-card {
          min-height: 480px; padding: 25px; display: flex; flex-direction: column; gap: 22px;
          border: 1px solid var(--line); border-radius: 22px;
          background: radial-gradient(circle at 100% 0%, rgba(62,165,222,.12), transparent 35%), linear-gradient(155deg, rgba(12,35,54,.9), rgba(4,15,26,.94));
          box-shadow: 0 20px 60px rgba(0,0,0,.28); transition: .25s ease;
        }
        .record-card:hover { transform: translateY(-5px); border-color: rgba(116,215,255,.38); }
        .record-heading { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .status {
          min-height: 28px; padding: 0 10px; display: inline-flex; align-items: center;
          border: 1px solid; border-radius: 999px; font-size: 9px; font-weight: 950; letter-spacing: .08em;
        }
        .status-registered { color: var(--green); border-color: rgba(108,227,176,.3); background: rgba(55,180,130,.1); }
        .status-disputed { color: var(--red); border-color: rgba(255,150,150,.3); background: rgba(197,60,60,.1); }
        .status-superseded { color: var(--violet); border-color: rgba(201,167,255,.3); background: rgba(133,88,194,.1); }
        .status-withdrawn, .status-archived { color: #becbd4; border-color: rgba(180,196,208,.24); background: rgba(132,151,168,.08); }
        .registry-id { color: var(--gold); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }
        .category { margin: 0 0 8px; color: var(--blue); font-size: 9px; font-weight: 950; letter-spacing: .15em; text-transform: uppercase; }
        .record-card h2 { margin: 0; font-family: Georgia, serif; font-size: 31px; line-height: 1.1; font-weight: 500; }
        .short-name { margin: 8px 0 0; color: var(--gold); font-size: 12px; font-weight: 800; }
        .summary { margin: 0; color: #aebfcd; line-height: 1.68; font-size: 13px; }
        .record-card dl { margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .record-card dl div { padding: 12px; border: 1px solid rgba(126,191,240,.12); border-radius: 12px; background: rgba(3,15,25,.52); }
        .record-card dt { margin-bottom: 5px; color: #7894a8; font-size: 9px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
        .record-card dd { margin: 0; color: #dce9f2; font-size: 12px; line-height: 1.45; }
        .domain-list { display: flex; flex-wrap: wrap; gap: 7px; }
        .domain-list span { padding: 7px 9px; border: 1px solid rgba(115,205,255,.16); border-radius: 999px; color: #a9c8da; background: rgba(8,31,48,.65); font-size: 9px; }
        .record-footer { margin-top: auto; padding-top: 18px; display: flex; justify-content: space-between; align-items: end; gap: 15px; border-top: 1px solid rgba(126,191,240,.12); }
        .record-footer > div:first-child { display: grid; gap: 5px; color: #7f96a8; font-size: 9px; }
        .record-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 10px; }
        .record-link { color: var(--blue); font-size: 11px; font-weight: 900; }
        .record-link-secondary { padding: 7px 10px; border: 1px solid rgba(125,203,255,.2); border-radius: 10px; background: rgba(8,24,40,.62); }
        .record-link b { margin-left: 7px; font-size: 16px; }

        .institutional-note {
          margin-bottom: 80px; padding: 34px; display: grid; grid-template-columns: .9fr 1.1fr; gap: 45px;
          border: 1px solid rgba(255,205,120,.2); border-radius: 22px;
          background: linear-gradient(135deg, rgba(75,46,14,.35), rgba(5,20,34,.92) 55%);
        }
        .institutional-note h2 { margin: 0; font-family: Georgia, serif; font-size: 34px; font-weight: 500; }
        .institutional-note > p { margin: 0; color: #aebfcd; line-height: 1.75; font-size: 13px; }

        footer {
          padding: 38px 0 55px; display: flex; justify-content: space-between; gap: 30px;
          border-top: 1px solid var(--line); color: #8499aa;
        }
        footer div { display: grid; gap: 5px; }
        footer strong { color: #d7e7f3; font-family: Georgia, serif; }
        footer span, footer p { margin: 0; font-size: 11px; }
        footer p { color: var(--gold); font-family: Georgia, serif; font-style: italic; }

        @keyframes drift { to { transform: translate3d(130px, 80px, 0); } }
        @keyframes float { 50% { transform: translateY(-18px); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 850px) {
          .search-panel { grid-template-columns: 1fr 1fr; }
          .result-count { grid-column: 1 / -1; border-left: 0; border-top: 1px solid var(--line); padding-top: 12px; }
          .record-grid { grid-template-columns: 1fr; }
          .institutional-note { grid-template-columns: 1fr; gap: 20px; }
        }

        @media (max-width: 650px) {
          .shell, .topbar { width: min(100% - 24px, 1240px); }
          .topbar { min-height: 68px; }
          .brand small { display: none; }
          .top-actions .button-secondary { display: none; }
          .hero { padding-top: 75px; }
          .hero-copy { font-size: 14px; }
          .search-panel { grid-template-columns: 1fr; }
          .result-count { grid-column: auto; }
          .state-card { padding: 34px 22px; }
          .record-card { padding: 21px; }
          .record-card dl { grid-template-columns: 1fr; }
          .record-footer { align-items: start; flex-direction: column; }
          footer { flex-direction: column; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            scroll-behavior: auto !important;
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
          }
        }
      `}</style>
    </main>
  );
}
