'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

type PublicRegistryRecord = {
  id: string;
  registryIdentifier: string;
  governanceName: string;
  shortName: string | null;
  version: string | null;
  category: string | null;
  steward: string | null;
  claimedEstablishmentDate: string | null;
  registeredAt: string | null;
  status: string;
  summary: string | null;
  domains: string[];
  evidenceCount: number;
  disputeCount: number;
};

type DirectoryResponse = {
  records?: PublicRegistryRecord[];
  count?: number;
  generatedAt?: string;
  error?: string;
  message?: string;
};

type SortMode = 'REGISTERED_DESC' | 'REGISTERED_ASC' | 'NAME_ASC' | 'NAME_DESC' | 'IDENTIFIER_ASC';

const STATUS_OPTIONS = ['ALL', 'REGISTERED', 'PUBLISHED', 'SUPERSEDED', 'WITHDRAWN', 'ARCHIVED'] as const;

function normalizeStatus(value: string) {
  return value.trim().toUpperCase().replaceAll(' ', '_');
}

function formatDate(value: string | null) {
  if (!value) return 'Not published';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function statusLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function PublicRegistryDirectoryPage() {
  const [records, setRecords] = useState<PublicRegistryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>('ALL');
  const [category, setCategory] = useState('ALL');
  const [sortMode, setSortMode] = useState<SortMode>('REGISTERED_DESC');
  const [showFilters, setShowFilters] = useState(false);

  const loadDirectory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/registry/public', {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      const payload = (await response.json()) as DirectoryResponse;

      if (!response.ok) {
        throw new Error(payload.message || 'The public Registry directory could not be loaded.');
      }

      setRecords(Array.isArray(payload.records) ? payload.records : []);
      setGeneratedAt(payload.generatedAt || null);
    } catch (caught) {
      setRecords([]);
      setError(caught instanceof Error ? caught.message : 'The public Registry directory is unavailable.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDirectory();
  }, [loadDirectory]);

  const categories = useMemo(() => {
    const values = new Set<string>();
    records.forEach((record) => {
      if (record.category?.trim()) values.add(record.category.trim());
    });
    return ['ALL', ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [records]);

  const filteredRecords = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const next = records.filter((record) => {
      const normalized = normalizeStatus(record.status);
      const statusMatch = status === 'ALL' || normalized === status;
      const categoryMatch = category === 'ALL' || record.category === category;
      const haystack = [
        record.registryIdentifier,
        record.governanceName,
        record.shortName || '',
        record.version || '',
        record.category || '',
        record.steward || '',
        record.summary || '',
        record.domains.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return statusMatch && categoryMatch && (!needle || haystack.includes(needle));
    });

    next.sort((a, b) => {
      if (sortMode === 'NAME_ASC') return a.governanceName.localeCompare(b.governanceName);
      if (sortMode === 'NAME_DESC') return b.governanceName.localeCompare(a.governanceName);
      if (sortMode === 'IDENTIFIER_ASC') return a.registryIdentifier.localeCompare(b.registryIdentifier);
      const aTime = a.registeredAt ? new Date(a.registeredAt).getTime() : 0;
      const bTime = b.registeredAt ? new Date(b.registeredAt).getTime() : 0;
      return sortMode === 'REGISTERED_ASC' ? aTime - bTime : bTime - aTime;
    });

    return next;
  }, [records, query, status, category, sortMode]);

  const metrics = useMemo(() => {
    const publicRecords = records.length;
    const evidence = records.reduce((sum, record) => sum + record.evidenceCount, 0);
    const disputes = records.reduce((sum, record) => sum + record.disputeCount, 0);
    const registered = records.filter((record) => {
      const normalized = normalizeStatus(record.status);
      return normalized === 'REGISTERED' || normalized === 'PUBLISHED';
    }).length;
    return { publicRecords, evidence, disputes, registered };
  }, [records]);

  const resetFilters = () => {
    setQuery('');
    setStatus('ALL');
    setCategory('ALL');
    setSortMode('REGISTERED_DESC');
  };

  const exportDirectory = () => {
    downloadJson(`ta14-public-ai-governance-registry-${new Date().toISOString().slice(0, 10)}.json`, {
      schema: 'TA-14-PUBLIC-AI-GOVERNANCE-REGISTRY-DIRECTORY',
      schemaVersion: '1.0',
      generatedAt: new Date().toISOString(),
      registryBoundary:
        'Registration is not certification, regulatory approval, ownership adjudication, or proof of technical performance.',
      filters: { query, status, category, sortMode },
      count: filteredRecords.length,
      records: filteredRecords,
    });
  };

  return (
    <main className="registry-page">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <header className="topbar">
        <Link href="/" className="brand" aria-label="TA-14 home">
          <span className="brand-mark">TA-14</span>
          <span className="brand-copy">
            <strong>AI Governance Registry</strong>
            <small>Public directory of registered governance architectures</small>
          </span>
        </Link>

        <nav className="topnav" aria-label="Registry navigation">
          <Link href="/workspace/ai-governance/registry">Registry method</Link>
          <Link href="/workspace/ai-governance/registry/register">Register governance</Link>
          <Link href="/workspace/ai-governance/registry/my-records">My records</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A DATED, SEARCHABLE, ATTRIBUTABLE PUBLIC RECORD</p>
          <h1>The public directory for registered AI governance architectures.</h1>
          <p className="hero-lead">
            Search permanent Registry identifiers, governance names, versions, categories, stewards,
            declared domains, evidence counts, and lifecycle status. Every published record remains
            bounded by its accepted declaration and preserved Registry history.
          </p>

          <div className="boundary-banner">
            <strong>Registration is not certification.</strong>
            <span>
              A public Registry record preserves identity, declarations, provenance, evidence references,
              status, and lineage. It does not create regulatory approval, legal priority, technical validation,
              or endorsement.
            </span>
          </div>

          <div className="hero-actions">
            <Link href="/workspace/ai-governance/registry/register" className="button button-primary">
              Register a governance architecture
            </Link>
            <Link href="/workspace/ai-governance/registry" className="button button-secondary">
              Read the Registry method
            </Link>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Registry status">
          <div className="panel-kicker">PUBLIC DIRECTORY STATUS</div>
          <div className="status-orb">{loading ? '…' : metrics.publicRecords}</div>
          <h2>Published public records</h2>
          <p>
            Records appear here only after intake, review, acceptance, permanent identifier assignment,
            and authorized public publication.
          </p>
          <div className="panel-list">
            <span><b>{metrics.registered}</b> registered or published</span>
            <span><b>{metrics.evidence}</b> referenced evidence items</span>
            <span><b>{metrics.disputes}</b> preserved disputes</span>
          </div>
          <button type="button" onClick={() => void loadDirectory()} className="refresh-button" disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh directory'}
          </button>
        </aside>
      </section>

      <section className="metrics" aria-label="Registry metrics">
        <article>
          <span>01</span>
          <strong>{metrics.publicRecords}</strong>
          <p>Public Registry records</p>
        </article>
        <article>
          <span>02</span>
          <strong>{metrics.registered}</strong>
          <p>Registered or published</p>
        </article>
        <article>
          <span>03</span>
          <strong>{metrics.evidence}</strong>
          <p>Evidence references</p>
        </article>
        <article>
          <span>04</span>
          <strong>{metrics.disputes}</strong>
          <p>Open or preserved disputes</p>
        </article>
      </section>

      <section className="directory-shell">
        <div className="directory-header">
          <div>
            <p className="eyebrow">SEARCH THE PUBLIC RECORD</p>
            <h2>Registered governance architectures</h2>
            <p>
              Resolve records by permanent identifier, governance name, steward, category, declared domain,
              or public summary.
            </p>
          </div>
          <div className="directory-actions">
            <button type="button" className="button button-secondary" onClick={() => setShowFilters((value) => !value)}>
              {showFilters ? 'Hide filters' : 'Show filters'}
            </button>
            <button type="button" className="button button-secondary" onClick={exportDirectory} disabled={filteredRecords.length === 0}>
              Export visible records
            </button>
          </div>
        </div>

        <div className="search-row">
          <label className="search-field">
            <span>Search Registry</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Governance name, Registry ID, steward, category, or domain"
            />
          </label>
          <div className="result-count">
            <strong>{filteredRecords.length}</strong>
            <span>{filteredRecords.length === 1 ? 'record' : 'records'} shown</span>
          </div>
        </div>

        {showFilters ? (
          <div className="filters">
            <label>
              <span>Status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value as (typeof STATUS_OPTIONS)[number])}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option === 'ALL' ? 'All public states' : statusLabel(option)}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((option) => (
                  <option key={option} value={option}>{option === 'ALL' ? 'All categories' : option}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Sort</span>
              <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
                <option value="REGISTERED_DESC">Newest registration first</option>
                <option value="REGISTERED_ASC">Oldest registration first</option>
                <option value="NAME_ASC">Governance name A–Z</option>
                <option value="NAME_DESC">Governance name Z–A</option>
                <option value="IDENTIFIER_ASC">Registry identifier</option>
              </select>
            </label>
            <button type="button" onClick={resetFilters} className="reset-button">Reset filters</button>
          </div>
        ) : null}

        {error ? (
          <div className="state-card error-card">
            <div className="state-icon">!</div>
            <div>
              <h3>Public Registry directory unavailable</h3>
              <p>{error}</p>
              <p className="state-note">
                The public directory database function may not yet be installed. The page will become live as soon as
                the Registry publication workflow and public database function are deployed.
              </p>
              <button type="button" onClick={() => void loadDirectory()} className="button button-primary">Try again</button>
            </div>
          </div>
        ) : loading ? (
          <div className="record-grid" aria-live="polite">
            {Array.from({ length: 4 }).map((_, index) => (
              <article className="record-card skeleton" key={index}>
                <div className="skeleton-line short" />
                <div className="skeleton-line title" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line half" />
              </article>
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="state-card empty-card">
            <div className="state-icon">0</div>
            <div>
              <h3>No public Registry records match this view</h3>
              <p>
                Adjust the search or filters. If the Registry has not published its first accepted architecture yet,
                this directory will remain empty until a record receives a permanent Registry identifier and public status.
              </p>
              <div className="empty-actions">
                <button type="button" className="button button-secondary" onClick={resetFilters}>Clear filters</button>
                <Link href="/workspace/ai-governance/registry/register" className="button button-primary">Begin a Registry filing</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="record-grid">
            {filteredRecords.map((record) => (
              <article className="record-card" key={record.id}>
                <div className="record-topline">
                  <span className={`status status-${normalizeStatus(record.status).toLowerCase()}`}>{statusLabel(record.status)}</span>
                  <span className="identifier">{record.registryIdentifier}</span>
                </div>

                <div className="record-heading">
                  <p>{record.category || 'AI governance architecture'}</p>
                  <h3>{record.governanceName}</h3>
                  {record.shortName ? <span className="short-name">{record.shortName}</span> : null}
                </div>

                <p className="record-summary">
                  {record.summary || 'No public summary has been published for this Registry record.'}
                </p>

                <dl className="record-details">
                  <div>
                    <dt>Version</dt>
                    <dd>{record.version || 'Not stated'}</dd>
                  </div>
                  <div>
                    <dt>Steward</dt>
                    <dd>{record.steward || 'Not publicly stated'}</dd>
                  </div>
                  <div>
                    <dt>Registered</dt>
                    <dd>{formatDate(record.registeredAt)}</dd>
                  </div>
                  <div>
                    <dt>Claimed establishment</dt>
                    <dd>{formatDate(record.claimedEstablishmentDate)}</dd>
                  </div>
                </dl>

                {record.domains.length > 0 ? (
                  <div className="domain-list" aria-label="Declared domains">
                    {record.domains.slice(0, 6).map((domain) => <span key={domain}>{domain}</span>)}
                  </div>
                ) : null}

                <div className="record-evidence">
                  <div><strong>{record.evidenceCount}</strong><span>evidence item{record.evidenceCount === 1 ? '' : 's'}</span></div>
                  <div><strong>{record.disputeCount}</strong><span>dispute{record.disputeCount === 1 ? '' : 's'}</span></div>
                </div>

                <div className="record-actions">
                  <Link href={`/registry/${encodeURIComponent(record.registryIdentifier)}`} className="button button-primary">
                    Open permanent record
                  </Link>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => {
                      void navigator.clipboard.writeText(record.registryIdentifier);
                    }}
                  >
                    Copy Registry ID
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="directory-footnote">
          <p>
            Directory generated {generatedAt ? formatDate(generatedAt) : 'when requested'}. Public records are returned by
            the TA-14 Registry publication service and may include registered, published, superseded, withdrawn, or archived states
            according to public disclosure policy.
          </p>
        </div>
      </section>

      <section className="method-grid">
        <article>
          <span>01</span>
          <h3>Persistent identity</h3>
          <p>Every accepted architecture receives a permanent Registry identifier that remains stable across descriptive updates.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Version lineage</h3>
          <p>Material changes create linked versions rather than silently replacing the record relied upon previously.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Evidence traceability</h3>
          <p>Public records disclose bounded evidence counts and preserve the underlying integrity references under Registry controls.</p>
        </article>
        <article>
          <span>04</span>
          <h3>Dispute preservation</h3>
          <p>Challenges, corrections, supersession, withdrawal, and archival events remain part of the public lifecycle where authorized.</p>
        </article>
      </section>

      <section className="closing">
        <p className="eyebrow">THE REGISTRY PRESERVES THE DECLARATION. IT DOES NOT ENDORSE THE DECLARATION.</p>
        <h2>Identity, claims, evidence, boundaries, status, and history—preserved together.</h2>
        <div className="closing-actions">
          <Link href="/workspace/ai-governance/registry/register" className="button button-primary">Register governance</Link>
          <Link href="/workspace/ai-governance/registry/my-records" className="button button-secondary">Open my Registry records</Link>
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>TA-14 AI Governance Registry</strong>
          <span>Identity · Claims · Evidence · Rights · Review · Lineage</span>
        </div>
        <p>No admissible evidence. No admissible execution.</p>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(body) { margin: 0; background: #07101f; color: #eef4ff; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        :global(a) { color: inherit; }
        .registry-page { min-height: 100vh; position: relative; overflow: hidden; background: radial-gradient(circle at top left, rgba(25, 76, 142, .22), transparent 34%), linear-gradient(180deg, #07101f 0%, #081425 42%, #07101f 100%); }
        .ambient { position: fixed; border-radius: 999px; filter: blur(120px); pointer-events: none; opacity: .25; z-index: 0; }
        .ambient-one { width: 440px; height: 440px; background: #2c71ff; top: -160px; right: -120px; }
        .ambient-two { width: 380px; height: 380px; background: #a78536; bottom: -140px; left: -120px; }
        .topbar, .hero, .metrics, .directory-shell, .method-grid, .closing, .footer { position: relative; z-index: 1; }
        .topbar { max-width: 1440px; margin: 0 auto; padding: 24px 36px; display: flex; align-items: center; justify-content: space-between; gap: 28px; border-bottom: 1px solid rgba(255,255,255,.1); }
        .brand { display: flex; gap: 14px; align-items: center; text-decoration: none; }
        .brand-mark { display: grid; place-items: center; width: 58px; height: 58px; border: 1px solid rgba(219,180,82,.62); border-radius: 16px; background: linear-gradient(145deg, rgba(219,180,82,.18), rgba(219,180,82,.04)); color: #f0cf78; font-weight: 900; letter-spacing: .06em; }
        .brand-copy { display: grid; gap: 4px; }
        .brand-copy strong { font-size: 16px; }
        .brand-copy small { color: #91a2bc; font-size: 12px; }
        .topnav { display: flex; gap: 20px; flex-wrap: wrap; }
        .topnav a { color: #b8c7dc; text-decoration: none; font-size: 13px; }
        .topnav a:hover { color: #fff; }
        .hero { max-width: 1440px; margin: 0 auto; padding: 88px 36px 52px; display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(320px, .75fr); gap: 46px; align-items: start; }
        .eyebrow { margin: 0 0 18px; color: #e3bd62; letter-spacing: .16em; font-size: 12px; font-weight: 800; }
        h1 { margin: 0; max-width: 980px; font-family: Georgia, "Times New Roman", serif; font-size: clamp(44px, 6vw, 86px); line-height: .98; letter-spacing: -.045em; }
        .hero-lead { max-width: 900px; color: #bac8dc; font-size: 19px; line-height: 1.75; margin: 28px 0 0; }
        .boundary-banner { margin-top: 32px; padding: 20px 22px; display: grid; gap: 6px; border-left: 4px solid #e3bd62; background: rgba(255,255,255,.045); border-radius: 0 14px 14px 0; }
        .boundary-banner strong { color: #f0cf78; }
        .boundary-banner span { color: #aebdd1; line-height: 1.6; }
        .hero-actions, .closing-actions, .empty-actions, .record-actions, .directory-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-actions { margin-top: 32px; }
        .button { min-height: 46px; display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; padding: 0 18px; text-decoration: none; border: 1px solid transparent; font-weight: 800; font-size: 13px; cursor: pointer; }
        .button:disabled { opacity: .45; cursor: not-allowed; }
        .button-primary { background: linear-gradient(135deg, #e2ba5a, #b8872f); color: #111827; box-shadow: 0 12px 30px rgba(184,135,47,.18); }
        .button-secondary { background: rgba(255,255,255,.04); color: #dbe7f7; border-color: rgba(255,255,255,.15); }
        .hero-panel { border: 1px solid rgba(255,255,255,.13); border-radius: 24px; padding: 28px; background: linear-gradient(155deg, rgba(255,255,255,.08), rgba(255,255,255,.025)); box-shadow: 0 28px 80px rgba(0,0,0,.25); }
        .panel-kicker { color: #8ea4c2; font-size: 11px; letter-spacing: .14em; font-weight: 800; }
        .status-orb { width: 110px; height: 110px; display: grid; place-items: center; margin: 26px 0 20px; border-radius: 50%; border: 1px solid rgba(227,189,98,.55); color: #f3d47e; font-size: 38px; font-weight: 900; background: radial-gradient(circle, rgba(227,189,98,.18), rgba(227,189,98,.02)); }
        .hero-panel h2 { margin: 0; font-size: 23px; }
        .hero-panel p { color: #aab9ce; line-height: 1.65; }
        .panel-list { display: grid; gap: 10px; margin: 22px 0; }
        .panel-list span { display: flex; justify-content: space-between; gap: 12px; color: #9fb0c6; padding-bottom: 9px; border-bottom: 1px solid rgba(255,255,255,.08); }
        .panel-list b { color: #fff; }
        .refresh-button { width: 100%; min-height: 42px; border-radius: 10px; border: 1px solid rgba(255,255,255,.14); color: #dce8f7; background: rgba(255,255,255,.04); cursor: pointer; }
        .metrics { max-width: 1440px; margin: 0 auto; padding: 0 36px 64px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .metrics article { padding: 22px; border: 1px solid rgba(255,255,255,.1); border-radius: 16px; background: rgba(255,255,255,.035); }
        .metrics article > span { color: #677b99; font-size: 11px; font-weight: 900; }
        .metrics strong { display: block; margin-top: 16px; font-size: 32px; }
        .metrics p { margin: 6px 0 0; color: #98a9c0; font-size: 13px; }
        .directory-shell { max-width: 1440px; margin: 0 auto; padding: 46px 36px 72px; }
        .directory-header { display: flex; align-items: end; justify-content: space-between; gap: 28px; margin-bottom: 28px; }
        .directory-header h2, .closing h2 { margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(34px, 4vw, 56px); letter-spacing: -.03em; }
        .directory-header p:not(.eyebrow) { color: #9fb0c6; max-width: 760px; line-height: 1.65; }
        .search-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 16px; align-items: end; padding: 20px; border: 1px solid rgba(255,255,255,.12); border-radius: 18px; background: rgba(255,255,255,.035); }
        .search-field, .filters label { display: grid; gap: 8px; }
        .search-field span, .filters span { color: #9fb0c6; font-size: 12px; font-weight: 800; }
        input, select { width: 100%; min-height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,.14); background: #0b1728; color: #eef4ff; outline: none; }
        input:focus, select:focus { border-color: rgba(227,189,98,.68); box-shadow: 0 0 0 3px rgba(227,189,98,.1); }
        .result-count { min-width: 120px; padding: 8px 4px; text-align: right; }
        .result-count strong { display: block; font-size: 26px; }
        .result-count span { color: #8fa1b9; font-size: 12px; }
        .filters { margin-top: 14px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)) auto; gap: 14px; align-items: end; padding: 18px; border: 1px solid rgba(255,255,255,.1); border-radius: 16px; background: rgba(255,255,255,.025); }
        .reset-button { min-height: 48px; padding: 0 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,.14); background: transparent; color: #cbd8e9; cursor: pointer; }
        .record-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 26px; }
        .record-card { display: flex; flex-direction: column; min-height: 520px; padding: 24px; border: 1px solid rgba(255,255,255,.12); border-radius: 20px; background: linear-gradient(160deg, rgba(255,255,255,.06), rgba(255,255,255,.018)); box-shadow: 0 24px 60px rgba(0,0,0,.16); }
        .record-topline { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
        .status { padding: 6px 9px; border-radius: 999px; font-size: 10px; letter-spacing: .08em; font-weight: 900; background: rgba(68,165,116,.15); color: #78dfa5; border: 1px solid rgba(68,165,116,.28); }
        .status-superseded { background: rgba(227,189,98,.12); color: #efd17c; border-color: rgba(227,189,98,.25); }
        .status-withdrawn, .status-archived { background: rgba(157,170,190,.12); color: #b3c0d1; border-color: rgba(157,170,190,.22); }
        .identifier { color: #91a6c2; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
        .record-heading { margin-top: 26px; }
        .record-heading p { margin: 0 0 8px; color: #d5b35f; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; font-weight: 800; }
        .record-heading h3 { margin: 0; font-size: 28px; line-height: 1.15; }
        .short-name { display: inline-block; margin-top: 8px; color: #8fa2ba; font-weight: 800; }
        .record-summary { color: #a9b8cb; line-height: 1.7; min-height: 82px; }
        .record-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin: 20px 0 0; }
        .record-details div { padding: 13px; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; background: rgba(255,255,255,.025); }
        .record-details dt { color: #7f93ae; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; }
        .record-details dd { margin: 6px 0 0; color: #e4ecf7; font-size: 13px; line-height: 1.4; }
        .domain-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
        .domain-list span { padding: 7px 9px; border-radius: 8px; background: rgba(62,115,190,.12); color: #a9c9f2; font-size: 11px; }
        .record-evidence { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: auto; padding-top: 22px; }
        .record-evidence div { display: flex; align-items: baseline; justify-content: space-between; padding: 12px; border-top: 1px solid rgba(255,255,255,.1); color: #8fa2ba; }
        .record-evidence strong { color: #fff; font-size: 22px; }
        .record-evidence span { font-size: 11px; }
        .record-actions { margin-top: 16px; }
        .record-actions .button-primary { flex: 1; }
        .state-card { margin-top: 26px; padding: 28px; display: grid; grid-template-columns: auto 1fr; gap: 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.035); }
        .state-icon { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%; border: 1px solid rgba(227,189,98,.4); color: #f0cf78; font-weight: 900; }
        .state-card h3 { margin: 0 0 8px; }
        .state-card p { color: #9fb0c6; line-height: 1.65; }
        .state-note { font-size: 13px; }
        .error-card { border-color: rgba(223,103,103,.26); }
        .skeleton { min-height: 360px; }
        .skeleton-line { height: 14px; margin-bottom: 14px; border-radius: 999px; background: linear-gradient(90deg, rgba(255,255,255,.04), rgba(255,255,255,.1), rgba(255,255,255,.04)); background-size: 200% 100%; animation: shimmer 1.4s linear infinite; }
        .skeleton-line.short { width: 32%; }
        .skeleton-line.title { width: 76%; height: 28px; margin-top: 30px; }
        .skeleton-line.half { width: 55%; }
        @keyframes shimmer { to { background-position: -200% 0; } }
        .directory-footnote { margin-top: 22px; color: #7388a4; font-size: 12px; line-height: 1.6; }
        .method-grid { max-width: 1440px; margin: 0 auto; padding: 12px 36px 80px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .method-grid article { padding: 22px; border-top: 1px solid rgba(227,189,98,.38); background: rgba(255,255,255,.025); }
        .method-grid span { color: #d7b35d; font-weight: 900; font-size: 11px; }
        .method-grid h3 { margin: 16px 0 8px; }
        .method-grid p { color: #91a3bc; line-height: 1.6; font-size: 13px; }
        .closing { max-width: 1368px; margin: 0 auto 72px; padding: 50px; border: 1px solid rgba(255,255,255,.12); border-radius: 24px; background: linear-gradient(135deg, rgba(227,189,98,.08), rgba(44,113,255,.06)); }
        .closing h2 { max-width: 1000px; }
        .closing-actions { margin-top: 28px; }
        .footer { max-width: 1440px; margin: 0 auto; padding: 30px 36px 44px; display: flex; justify-content: space-between; gap: 28px; border-top: 1px solid rgba(255,255,255,.1); color: #8194ad; }
        .footer div { display: grid; gap: 5px; }
        .footer strong { color: #dbe6f5; }
        .footer span, .footer p { font-size: 12px; }
        @media (max-width: 1050px) {
          .hero { grid-template-columns: 1fr; }
          .metrics, .method-grid { grid-template-columns: repeat(2, 1fr); }
          .record-grid { grid-template-columns: 1fr; }
          .filters { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 760px) {
          .topbar { align-items: flex-start; }
          .topnav { display: none; }
          .topbar, .hero, .metrics, .directory-shell, .method-grid { padding-left: 20px; padding-right: 20px; }
          .hero { padding-top: 56px; }
          h1 { font-size: 46px; }
          .metrics, .method-grid { grid-template-columns: 1fr; }
          .directory-header { align-items: flex-start; flex-direction: column; }
          .search-row { grid-template-columns: 1fr; }
          .result-count { text-align: left; }
          .filters { grid-template-columns: 1fr; }
          .record-details { grid-template-columns: 1fr; }
          .closing { margin-left: 20px; margin-right: 20px; padding: 30px 24px; }
          .footer { padding-left: 20px; padding-right: 20px; flex-direction: column; }
        }
      `}</style>
    </main>
  );
}
