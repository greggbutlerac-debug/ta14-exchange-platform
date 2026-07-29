'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
type Disposition = 'Open' | 'Accepted' | 'Corrected' | 'Rejected';
type Finding = {
  id: string;
  category: string;
  severity: Severity;
  disposition: Disposition;
  summary: string;
  rationale: string;
  createdAt: string;
};

const STORAGE_KEY = 'ta14-academy-review-findings-v1';

const categories = [
  'Evidence',
  'Authority',
  'Continuity',
  'Boundary',
  'Dependencies',
  'Correspondence',
  'Outcome',
];

const severityOrder: Record<Severity, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

function readFindings(): Finding[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Finding[]) : [];
  } catch {
    return [];
  }
}

export default function ReviewWorkspacePage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [category, setCategory] = useState(categories[0]);
  const [severity, setSeverity] = useState<Severity>('Medium');
  const [summary, setSummary] = useState('');
  const [rationale, setRationale] = useState('');
  const [filter, setFilter] = useState<'All' | Disposition>('All');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFindings(readFindings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(findings));
  }, [findings, hydrated]);

  const visibleFindings = useMemo(() => {
    return [...findings]
      .filter((finding) => filter === 'All' || finding.disposition === filter)
      .sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
  }, [findings, filter]);

  const metrics = useMemo(() => {
    const open = findings.filter((item) => item.disposition === 'Open').length;
    const highRisk = findings.filter(
      (item) => item.severity === 'High' || item.severity === 'Critical',
    ).length;
    const resolved = findings.filter(
      (item) => item.disposition === 'Accepted' || item.disposition === 'Corrected',
    ).length;
    return { total: findings.length, open, highRisk, resolved };
  }, [findings]);

  function addFinding() {
    if (!summary.trim() || !rationale.trim()) return;
    const finding: Finding = {
      id: crypto.randomUUID(),
      category,
      severity,
      disposition: 'Open',
      summary: summary.trim(),
      rationale: rationale.trim(),
      createdAt: new Date().toISOString(),
    };
    setFindings((current) => [finding, ...current]);
    setSummary('');
    setRationale('');
  }

  function updateDisposition(id: string, disposition: Disposition) {
    setFindings((current) =>
      current.map((finding) =>
        finding.id === id ? { ...finding, disposition } : finding,
      ),
    );
  }

  function removeFinding(id: string) {
    setFindings((current) => current.filter((finding) => finding.id !== id));
  }

  function exportRecord() {
    const record = {
      recordType: 'TA-14 Academy Review Record',
      exportedAt: new Date().toISOString(),
      findings,
    };
    const blob = new Blob([JSON.stringify(record, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ta14-academy-review-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="reviewWorkspace">
      <div className="cosmos" aria-hidden="true">
        <span className="glow glowOne" />
        <span className="glow glowTwo" />
        <span className="stars starsOne" />
        <span className="stars starsTwo" />
      </div>

      <header className="topbar">
        <Link className="brand" href="/academy/dashboard">
          <span className="mark">TA-14</span>
          <span>
            <strong>Academy Review Workspace</strong>
            <small>Challenge before consequence</small>
          </span>
        </Link>
        <nav aria-label="Review Workspace navigation">
          <Link href="/academy/dashboard">Mission Control</Link>
          <Link href="/academy/simulator">Simulator</Link>
          <Link href="/academy/assessment">Assessment</Link>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">Independent review · preserved challenge</p>
          <h1>Review the execution, not merely the explanation.</h1>
          <p>
            Record defects in evidence, authority, continuity, boundaries,
            dependencies, correspondence, or outcome before a determination is
            treated as admissible.
          </p>
        </div>
        <aside>
          <span>Review boundary</span>
          <strong>A finding does not alter the source record until disposition is preserved.</strong>
        </aside>
      </section>

      <section className="metrics" aria-label="Review metrics">
        <article><span>Total findings</span><strong>{hydrated ? metrics.total : '—'}</strong></article>
        <article><span>Open</span><strong>{hydrated ? metrics.open : '—'}</strong></article>
        <article><span>High risk</span><strong>{hydrated ? metrics.highRisk : '—'}</strong></article>
        <article><span>Resolved</span><strong>{hydrated ? metrics.resolved : '—'}</strong></article>
      </section>

      <section className="workspaceGrid">
        <article className="panel composer">
          <p className="eyebrow">Create finding</p>
          <h2>Preserve the objection</h2>

          <div className="fieldGrid">
            <label>
              <span>Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>Severity</span>
              <select value={severity} onChange={(event) => setSeverity(event.target.value as Severity)}>
                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
              </select>
            </label>
          </div>

          <label>
            <span>Finding summary</span>
            <input
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="State the defect precisely"
            />
          </label>

          <label>
            <span>Review rationale</span>
            <textarea
              rows={7}
              value={rationale}
              onChange={(event) => setRationale(event.target.value)}
              placeholder="Explain what failed, why it matters, and what must be revalidated."
            />
          </label>

          <button
            type="button"
            className="primaryButton"
            onClick={addFinding}
            disabled={!summary.trim() || !rationale.trim()}
          >
            Preserve finding
          </button>
        </article>

        <article className="panel queue">
          <div className="queueHeader">
            <div>
              <p className="eyebrow">Review record</p>
              <h2>Findings and dispositions</h2>
            </div>
            <button type="button" className="secondaryButton" onClick={exportRecord} disabled={findings.length === 0}>
              Export record
            </button>
          </div>

          <div className="filters" role="group" aria-label="Filter findings">
            {(['All', 'Open', 'Accepted', 'Corrected', 'Rejected'] as const).map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setFilter(item)}
                className={filter === item ? 'active' : ''}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="findingList">
            {visibleFindings.length === 0 ? (
              <div className="emptyState">
                <strong>No findings in this view.</strong>
                <span>Create a finding or select another disposition filter.</span>
              </div>
            ) : visibleFindings.map((finding) => (
              <article className="finding" key={finding.id}>
                <div className="findingTopline">
                  <div>
                    <span className={`severity ${finding.severity.toLowerCase()}`}>{finding.severity}</span>
                    <span className="category">{finding.category}</span>
                  </div>
                  <time>{new Date(finding.createdAt).toLocaleString()}</time>
                </div>
                <h3>{finding.summary}</h3>
                <p>{finding.rationale}</p>
                <div className="findingActions">
                  <select
                    aria-label={`Disposition for ${finding.summary}`}
                    value={finding.disposition}
                    onChange={(event) => updateDisposition(finding.id, event.target.value as Disposition)}
                  >
                    <option>Open</option><option>Accepted</option><option>Corrected</option><option>Rejected</option>
                  </select>
                  <button type="button" onClick={() => removeFinding(finding.id)}>Remove</button>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="boundary">
        <p className="eyebrow">Institutional distinction</p>
        <h2>Review is not approval.</h2>
        <p>
          This workspace preserves challenge, rationale, and disposition for Academy
          practice. It does not create execution authority, amend an authoritative
          Registry record, or authorize consequence.
        </p>
      </section>

      <style jsx>{`
        .reviewWorkspace{position:relative;min-height:100vh;overflow:hidden;background:#030712;color:#eef8ff;padding:28px}.cosmos{position:fixed;inset:0;pointer-events:none}.glow{position:absolute;border-radius:999px;filter:blur(90px);opacity:.2}.glowOne{width:420px;height:420px;background:#13d8ff;left:-120px;top:100px}.glowTwo{width:520px;height:520px;background:#7c4dff;right:-160px;top:280px}.stars{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.6) 0 1px,transparent 1px);opacity:.18}.starsOne{background-size:145px 145px}.starsTwo{background-size:230px 230px;transform:translate(40px,70px)}.topbar,.hero,.metrics,.workspaceGrid,.boundary{position:relative;z-index:1;max-width:1280px;margin-left:auto;margin-right:auto}.topbar{display:flex;justify-content:space-between;align-items:center;gap:24px}.brand{display:flex;gap:12px;align-items:center;color:inherit;text-decoration:none}.brand>span:last-child{display:flex;flex-direction:column}.brand small{color:#7f91a7}.mark{border:1px solid rgba(73,220,255,.45);background:rgba(45,207,255,.08);border-radius:12px;padding:10px;font-weight:900;color:#8cecff}.topbar nav{display:flex;gap:18px}.topbar nav a{color:#b9c8d9;text-decoration:none}.topbar nav a:hover{color:#fff}.hero{display:grid;grid-template-columns:1fr 360px;gap:32px;align-items:end;padding:76px 0 32px}.eyebrow{text-transform:uppercase;letter-spacing:.2em;color:#62dfff;font-size:12px;font-weight:800}.hero h1{font-size:clamp(40px,6vw,72px);line-height:1.02;margin:12px 0 18px;max-width:880px}.hero>div>p:last-child{color:#aabbd0;font-size:18px;line-height:1.7;max-width:780px}.hero aside{border:1px solid rgba(76,218,255,.2);background:rgba(12,30,48,.7);border-radius:22px;padding:22px}.hero aside span{display:block;color:#6f879f;font-size:12px;text-transform:uppercase;letter-spacing:.16em}.hero aside strong{display:block;margin-top:10px;line-height:1.5}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}.metrics article,.panel,.boundary{border:1px solid rgba(255,255,255,.1);background:rgba(7,16,31,.82);backdrop-filter:blur(14px);box-shadow:0 22px 70px rgba(0,0,0,.25)}.metrics article{border-radius:18px;padding:18px}.metrics span{display:block;color:#8192a8;font-size:13px}.metrics strong{display:block;font-size:30px;margin-top:6px}.workspaceGrid{display:grid;grid-template-columns:minmax(320px,.78fr) minmax(0,1.22fr);gap:18px}.panel{border-radius:24px;padding:24px}.panel h2{margin:8px 0 22px;font-size:27px}.composer label{display:block;margin-bottom:16px}.composer label>span{display:block;color:#9fb0c3;font-size:13px;font-weight:700;margin-bottom:8px}.fieldGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}input,textarea,select{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.13);border-radius:13px;background:#081426;color:#eef8ff;padding:13px 14px;font:inherit}textarea{resize:vertical}option{background:#081426}.primaryButton,.secondaryButton{border:0;border-radius:13px;padding:13px 18px;font-weight:900;cursor:pointer}.primaryButton{width:100%;background:#62dfff;color:#03101a}.primaryButton:disabled,.secondaryButton:disabled{opacity:.4;cursor:not-allowed}.secondaryButton{background:transparent;color:#dff8ff;border:1px solid rgba(98,223,255,.3)}.queueHeader{display:flex;justify-content:space-between;align-items:start;gap:18px}.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}.filters button{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:#8fa3b8;border-radius:999px;padding:8px 12px;cursor:pointer}.filters button.active{color:#03101a;background:#62dfff;border-color:#62dfff}.findingList{display:grid;gap:12px}.finding{border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025);border-radius:18px;padding:18px}.findingTopline{display:flex;justify-content:space-between;gap:12px;align-items:center}.findingTopline>div{display:flex;gap:8px}.severity,.category{border-radius:999px;padding:5px 9px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.severity.low{background:rgba(62,207,142,.12);color:#81efbb}.severity.medium{background:rgba(255,194,71,.12);color:#ffd47d}.severity.high{background:rgba(255,126,69,.12);color:#ffad87}.severity.critical{background:rgba(255,66,105,.15);color:#ff90a8}.category{background:rgba(98,223,255,.1);color:#8eeaff}.finding time{font-size:11px;color:#6f8198}.finding h3{font-size:18px;margin:14px 0 8px}.finding p{color:#a9bbcf;line-height:1.6;margin:0}.findingActions{display:flex;gap:10px;margin-top:16px}.findingActions select{max-width:180px;padding:9px 11px}.findingActions button{border:0;background:transparent;color:#ff9aaf;cursor:pointer}.emptyState{border:1px dashed rgba(255,255,255,.15);border-radius:18px;padding:44px 20px;text-align:center;color:#8295aa}.emptyState strong,.emptyState span{display:block}.emptyState span{margin-top:8px}.boundary{margin-top:18px;border-radius:24px;padding:28px}.boundary h2{font-size:28px;margin:8px 0}.boundary p:last-child{color:#9eb0c4;line-height:1.7;max-width:850px}@media(max-width:900px){.hero,.workspaceGrid{grid-template-columns:1fr}.hero{padding-top:52px}.metrics{grid-template-columns:1fr 1fr}.topbar{align-items:flex-start}.topbar nav{display:none}}@media(max-width:560px){.reviewWorkspace{padding:18px}.metrics,.fieldGrid{grid-template-columns:1fr}.queueHeader{flex-direction:column}.hero h1{font-size:42px}.findingTopline{align-items:flex-start;flex-direction:column}.findingActions{flex-direction:column}.findingActions select{max-width:none}}
      `}</style>
    </main>
  );
}
