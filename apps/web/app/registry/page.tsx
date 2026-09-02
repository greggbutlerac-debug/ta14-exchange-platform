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
  available?: boolean;
  records?: PublicRegistryRecord[] | null;
  count?: number | null;
  generatedAt?: string;
  error?: string;
  message?: string;
};

type SortMode = 'REGISTERED_DESC' | 'REGISTERED_ASC' | 'NAME_ASC' | 'NAME_DESC' | 'IDENTIFIER_ASC';
const STATUS_OPTIONS = ['ALL', 'REGISTERED', 'PUBLISHED', 'SUPERSEDED', 'WITHDRAWN', 'ARCHIVED'] as const;

function normalizeStatus(value: string) { return value.trim().toUpperCase().replaceAll(' ', '_'); }
function formatDate(value: string | null) {
  if (!value) return 'Not published';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}
function statusLabel(value: string) {
  return value.toLowerCase().split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}
function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
}

export default function PublicRegistryDirectoryPage() {
  const [records, setRecords] = useState<PublicRegistryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>('ALL');
  const [category, setCategory] = useState('ALL');
  const [sortMode, setSortMode] = useState<SortMode>('REGISTERED_DESC');
  const [showFilters, setShowFilters] = useState(false);

  const loadDirectory = useCallback(async () => {
    setLoading(true); setError(null); setAvailable(null);
    try {
      const response = await fetch('/api/registry/public', { method: 'GET', cache: 'no-store', headers: { Accept: 'application/json' } });
      const payload = (await response.json()) as DirectoryResponse;
      if (!response.ok || payload.available === false) throw new Error(payload.message || 'The public Registry directory could not be loaded.');
      if (!Array.isArray(payload.records)) throw new Error('The public Registry returned an invalid directory response.');
      setRecords(payload.records); setGeneratedAt(payload.generatedAt || null); setAvailable(true);
    } catch (caught) {
      setRecords([]); setAvailable(false); setError(caught instanceof Error ? caught.message : 'The public Registry directory is unavailable.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadDirectory(); }, [loadDirectory]);

  const categories = useMemo(() => ['ALL', ...Array.from(new Set(records.map((r) => r.category?.trim()).filter(Boolean) as string[])).sort((a,b)=>a.localeCompare(b))], [records]);
  const filteredRecords = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const next = records.filter((record) => {
      const normalized = normalizeStatus(record.status);
      const haystack = [record.registryIdentifier, record.governanceName, record.shortName || '', record.version || '', record.category || '', record.steward || '', record.summary || '', record.domains.join(' ')].join(' ').toLowerCase();
      return (status === 'ALL' || normalized === status) && (category === 'ALL' || record.category === category) && (!needle || haystack.includes(needle));
    });
    next.sort((a,b) => {
      if (sortMode === 'NAME_ASC') return a.governanceName.localeCompare(b.governanceName);
      if (sortMode === 'NAME_DESC') return b.governanceName.localeCompare(a.governanceName);
      if (sortMode === 'IDENTIFIER_ASC') return a.registryIdentifier.localeCompare(b.registryIdentifier);
      const at = a.registeredAt ? new Date(a.registeredAt).getTime() : 0; const bt = b.registeredAt ? new Date(b.registeredAt).getTime() : 0;
      return sortMode === 'REGISTERED_ASC' ? at - bt : bt - at;
    }); return next;
  }, [records, query, status, category, sortMode]);

  const metrics = useMemo(() => ({
    publicRecords: records.length,
    evidence: records.reduce((sum,r)=>sum+r.evidenceCount,0),
    disputes: records.reduce((sum,r)=>sum+r.disputeCount,0),
    registered: records.filter((r)=>['REGISTERED','PUBLISHED'].includes(normalizeStatus(r.status))).length,
  }), [records]);
  const metric = (value:number) => available === false ? '—' : loading ? '…' : String(value);
  const resetFilters = () => { setQuery(''); setStatus('ALL'); setCategory('ALL'); setSortMode('REGISTERED_DESC'); };
  const exportDirectory = () => downloadJson(`ta14-public-ai-governance-registry-${new Date().toISOString().slice(0,10)}.json`, { schema:'TA-14-PUBLIC-AI-GOVERNANCE-REGISTRY-DIRECTORY', schemaVersion:'1.0', generatedAt:new Date().toISOString(), registryBoundary:'Registration is not certification, regulatory approval, ownership adjudication, or proof of technical performance.', filters:{query,status,category,sortMode}, count:filteredRecords.length, records:filteredRecords });

  return <main className="registry-page">
    <div className="ambient ambient-one" aria-hidden="true"/><div className="ambient ambient-two" aria-hidden="true"/>
    <header className="topbar"><Link href="/" className="brand" aria-label="TA-14 home"><span className="brand-mark">TA-14</span><span className="brand-copy"><strong>AI Governance Registry</strong><small>Public directory of registered governance architectures</small></span></Link><nav className="topnav" aria-label="Registry navigation"><Link href="/workspace/ai-governance/registry">Registry method</Link><Link href="/workspace/ai-governance/registry/register">Register governance</Link><Link href="/workspace/ai-governance/registry/my-records">My records</Link></nav></header>
    <section className="hero"><div className="hero-copy"><p className="eyebrow">A DATED, SEARCHABLE, ATTRIBUTABLE PUBLIC RECORD</p><h1>The public directory for registered AI governance architectures.</h1><p className="hero-lead">Search permanent Registry identifiers, governance names, versions, categories, stewards, declared domains, evidence counts, and lifecycle status. Every published record remains bounded by its accepted declaration and preserved Registry history.</p><div className="boundary-banner"><strong>Registration is not certification.</strong><span>A public Registry record preserves identity, declarations, provenance, evidence references, status, and lineage. It does not create regulatory approval, legal priority, technical validation, or endorsement.</span></div><div className="hero-actions"><Link href="/workspace/ai-governance/registry/register" className="button button-primary">Register a governance architecture</Link><Link href="/workspace/ai-governance/registry" className="button button-secondary">Read the Registry method</Link></div></div>
      <aside className="hero-panel" aria-label="Registry status"><div className="panel-kicker">PUBLIC DIRECTORY STATUS</div><div className="status-orb">{metric(metrics.publicRecords)}</div><h2>{available === false ? 'Directory temporarily unavailable' : 'Published public records'}</h2><p>{available === false ? 'The public Registry could not be read. TA-14 does not convert an unavailable data source into authoritative zero counts.' : 'This number counts records authorized for publication in the public directory. A TA-14-AIGR identifier may be assigned before an entity authorizes a public directory profile.'}</p><div className="panel-list"><span><b>{metric(metrics.publicRecords)}</b> directory-published records</span><span><b>{metric(metrics.evidence)}</b> evidence references attached to those records</span><span><b>{metric(metrics.disputes)}</b> disputes attached to those records</span></div><button type="button" onClick={()=>void loadDirectory()} className="refresh-button" disabled={loading}>{loading?'Refreshing…':'Refresh directory'}</button></aside>
    </section>
    <section className="metrics" aria-label="Registry metrics"><article><span>01</span><strong>{metric(metrics.publicRecords)}</strong><p>Public Registry records</p></article><article><span>02</span><strong>{metric(metrics.registered)}</strong><p>Directory records in registered/published lifecycle states</p></article><article><span>03</span><strong>{metric(metrics.evidence)}</strong><p>Evidence references</p></article><article><span>04</span><strong>{metric(metrics.disputes)}</strong><p>Open or preserved disputes</p></article></section>
    <section className="publication-boundary" aria-label="Registry publication boundary"><div><p className="eyebrow">IDENTIFIER ≠ PUBLIC DIRECTORY PROFILE</p><h2>Registry identity and directory publication are separate governance states.</h2></div><p>An entity can receive a permanent TA-14-AIGR identifier and have that identifier cited in a governed artifact, review, or demonstration while its public Registry profile remains unpublished. The metrics on this page count only records released into this public directory; they are not a count of every governance identity that may exist elsewhere in the Exchange.</p></section>
    <section className="directory-shell"><div className="directory-header"><div><p className="eyebrow">SEARCH THE PUBLIC RECORD</p><h2>Registered governance architectures</h2><p>Resolve records by permanent identifier, governance name, steward, category, declared domain, or public summary.</p></div><div className="directory-actions"><button type="button" className="button button-secondary" onClick={()=>setShowFilters(v=>!v)}>{showFilters?'Hide filters':'Show filters'}</button><button type="button" className="button button-secondary" onClick={exportDirectory} disabled={filteredRecords.length===0}>Export visible records</button></div></div>
      <div className="search-row"><label className="search-field"><span>Search Registry</span><input type="search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Governance name, Registry ID, steward, category, or domain"/></label><div className="result-count"><strong>{available===false?'—':filteredRecords.length}</strong><span>{available===false?'directory unavailable':filteredRecords.length===1?'record shown':'records shown'}</span></div></div>
      {showFilters?<div className="filters"><label><span>Status</span><select value={status} onChange={(e)=>setStatus(e.target.value as (typeof STATUS_OPTIONS)[number])}>{STATUS_OPTIONS.map(o=><option key={o} value={o}>{o==='ALL'?'All public states':statusLabel(o)}</option>)}</select></label><label><span>Category</span><select value={category} onChange={(e)=>setCategory(e.target.value)}>{categories.map(o=><option key={o} value={o}>{o==='ALL'?'All categories':o}</option>)}</select></label><label><span>Sort</span><select value={sortMode} onChange={(e)=>setSortMode(e.target.value as SortMode)}><option value="REGISTERED_DESC">Newest registration first</option><option value="REGISTERED_ASC">Oldest registration first</option><option value="NAME_ASC">Governance name A–Z</option><option value="NAME_DESC">Governance name Z–A</option><option value="IDENTIFIER_ASC">Registry identifier</option></select></label><button type="button" onClick={resetFilters} className="reset-button">Reset filters</button></div>:null}
      {error?<div className="state-card error-card"><div className="state-icon">!</div><div><h3>Public Registry directory unavailable</h3><p>{error}</p><p className="state-note">No Registry count is being represented while the authoritative public data source is unavailable. Existing institutional records are not converted to zero by a transport or configuration failure.</p><button type="button" onClick={()=>void loadDirectory()} className="button button-primary">Try again</button></div></div>:loading?<div className="record-grid" aria-live="polite">{Array.from({length:4}).map((_,i)=><article className="record-card skeleton" key={i}><div className="skeleton-line short"/><div className="skeleton-line title"/><div className="skeleton-line"/><div className="skeleton-line"/><div className="skeleton-line half"/></article>)}</div>:filteredRecords.length===0?<div className="state-card empty-card"><div className="state-icon">0</div><div><h3>No public Registry records match this view</h3><p>The authoritative public directory is available, but no records match the current search or filters.</p><div className="empty-actions"><button type="button" className="button button-secondary" onClick={resetFilters}>Clear filters</button><Link href="/workspace/ai-governance/registry/register" className="button button-primary">Begin a Registry filing</Link></div></div></div>:<div className="record-grid">{filteredRecords.map(record=><article className="record-card" key={record.id}><div className="record-topline"><span className="record-id">{record.registryIdentifier}</span><span className={`status-pill status-${normalizeStatus(record.status).toLowerCase()}`}>{statusLabel(record.status)}</span></div><h3>{record.governanceName}</h3>{record.shortName?<p className="short-name">{record.shortName}</p>:null}<p className="summary">{record.summary||'No public summary has been published for this Registry record.'}</p><dl><div><dt>Version</dt><dd>{record.version||'Not declared'}</dd></div><div><dt>Category</dt><dd>{record.category||'Not declared'}</dd></div><div><dt>Steward</dt><dd>{record.steward||'Not published'}</dd></div><div><dt>Registered</dt><dd>{formatDate(record.registeredAt)}</dd></div></dl><div className="record-footer"><div className="record-counts"><span>{record.evidenceCount} evidence</span><span>{record.disputeCount} disputes</span></div><Link href={`/registry/records/${encodeURIComponent(record.registryIdentifier)}`} className="record-link">Open record →</Link></div></article>)}</div>}
      <div className="directory-footnote"><span>Last directory refresh: {generatedAt?formatDate(generatedAt):'Not available'}</span><span>Public directory data is served from the Registry publication projection, not browser-local filing state.</span></div>
    </section>
  </main>;
}
