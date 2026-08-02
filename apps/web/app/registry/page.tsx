'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type RegistryStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'FOUNDING' | 'SUSPENDED';
type GovernanceRecord = {
  registrationId: string;
  organization: string;
  architecture: string;
  version: string;
  status: RegistryStatus;
  steward: string;
  sectors: string[];
  jurisdictions: string[];
  routes: number;
  artifacts: number;
  verification: number;
  openChallenges: number;
  updated: string;
  href: string;
  summary: string;
};

const RECORDS: GovernanceRecord[] = [
  {
    registrationId: 'TA-14-AIGR-0001',
    organization: 'TA-14 Authority',
    architecture: 'TA-14 Admissible Execution Architecture',
    version: 'v1.0',
    status: 'FOUNDING',
    steward: 'Governance Institution for Admissible Execution Architecture',
    sectors: ['Cross-sector', 'AI operations', 'Cybersecurity'],
    jurisdictions: ['United States', 'European Union', 'United Kingdom'],
    routes: 8,
    artifacts: 12,
    verification: 6,
    openChallenges: 0,
    updated: '2026-08-02',
    href: '/registry/ta-14-admissible-execution-architecture',
    summary:
      'Founding architecture record connecting evidence, authority, continuity, admissibility, binding, commitment, execution control, and outcome closure.',
  },
  {
    registrationId: 'TA-14-AIGR-CAND-0002',
    organization: 'Demonstration Governance Laboratory',
    architecture: 'Bounded Decision Assurance Architecture',
    version: 'v0.9',
    status: 'UNDER_REVIEW',
    steward: 'Candidate accountable owner',
    sectors: ['Enterprise operations'],
    jurisdictions: ['Organization-specific private domain'],
    routes: 2,
    artifacts: 0,
    verification: 0,
    openChallenges: 0,
    updated: '2026-08-01',
    href: '/governance/directory',
    summary:
      'Candidate registration included to demonstrate the review boundary. No permanent registration ID or artifact eligibility has been issued.',
  },
];

const HIERARCHY = [
  {
    number: '01',
    eyebrow: 'THE CREDENTIALS & PARENT PUBLIC RECORD',
    title: 'TA-14 Credentials & Public Record',
    description:
      'Architecture, standards, chronology, publications, repositories, reference implementations, and institutional systems.',
    action: 'Explore the Foundation',
    href: '/foundation',
    tone: 'gold',
  },
  {
    number: '02',
    eyebrow: 'THE CANONICAL ARCHITECTURAL RECORD',
    title: 'Foundational Architectural Registry',
    description:
      'The connected architectural record for the TA-14 architecture family, standards family, public timeline, evidence relationships, and implementations.',
    action: 'Open the Architectural Registry',
    href: '/workspace/ai-governance/registry',
    tone: 'blue',
  },
  {
    number: '03',
    eyebrow: 'THE REGISTRATION INSTITUTION',
    title: 'AI Governance Registry',
    description:
      'A dated, searchable, attributable system preserving governance records submitted by TA-14 or third parties.',
    action: 'Browse registered governance',
    href: '/governance/directory',
    tone: 'violet',
  },
  {
    number: '04',
    eyebrow: 'THE INDIVIDUAL ENTRY',
    title: 'Registry Record',
    description:
      'A bounded record containing one architecture’s identity, steward, claims, non-claims, evidence, chronology, version, and status.',
    action: 'Open the Founding Record',
    href: '/registry/ta-14-admissible-execution-architecture',
    tone: 'green',
  },
] as const;

const JOURNEY = [
  {
    number: '01',
    title: 'Register governance',
    description: 'Create an attributable identity, architecture version, accountable owner, declared scope, claims, and limits.',
    href: '/governance/register',
    action: 'Start registration',
  },
  {
    number: '02',
    title: 'Receive a registration ID',
    description: 'Institutional review must complete before an active Governance Registration ID and artifact eligibility are issued.',
    href: '/governance/directory',
    action: 'Browse active records',
  },
  {
    number: '03',
    title: 'Enter the workspace',
    description: 'Manage versions, owners, routes, artifacts, challenges, verification, and portfolio evidence from Mission Control.',
    href: '/governance/workspace',
    action: 'Open Mission Control',
  },
  {
    number: '04',
    title: 'Build and freeze a route',
    description: 'Bind sector, jurisdiction, evidence, authority, limits, and determination logic to a versioned governed route.',
    href: '/workspace/routes/new',
    action: 'Build a route',
  },
  {
    number: '05',
    title: 'Produce execution proof',
    description: 'Create the bounded record, technical receipt, outcome evidence, integrity package, and claims boundary.',
    href: '/artifacts/studio',
    action: 'Open Artifact Studio',
  },
  {
    number: '06',
    title: 'Register and verify artifacts',
    description: 'Submit eligible artifacts for registry admission, public inspection, challenge, correction, and bounded verification.',
    href: '/artifacts',
    action: 'Inspect artifact registry',
  },
] as const;

const QUICK_ACTIONS = [
  {
    title: 'Register AI governance',
    label: 'REGISTRATION',
    description: 'Create the governance record required before any artifact may enter the permanent registry.',
    href: '/governance/register',
  },
  {
    title: 'Browse governance records',
    label: 'DISCOVERY',
    description: 'Search active, founding, candidate, suspended, corrected, and withdrawn governance records.',
    href: '/governance/directory',
  },
  {
    title: 'Open Governance Mission Control',
    label: 'OPERATIONS',
    description: 'Manage routes, artifacts, verification, challenges, people, controls, and portfolio evidence.',
    href: '/governance/workspace',
  },
  {
    title: 'Inspect execution artifacts',
    label: 'PUBLIC PROOF',
    description: 'Review registered execution records and their permanent IDs, producers, verifiers, outcomes, and boundaries.',
    href: '/artifacts',
  },
  {
    title: 'Verify a record',
    label: 'VERIFICATION',
    description: 'Resolve artifact, route, receipt, package, and verification identifiers against preserved records.',
    href: '/artifacts/verify',
  },
  {
    title: 'Read the registry boundary',
    label: 'REGISTRY GUIDE',
    description: 'Understand exactly what registration preserves—and what it does not certify, approve, or validate.',
    href: '/registry/about',
  },
] as const;

function statusClass(status: RegistryStatus) {
  return status.toLowerCase().replaceAll('_', '-');
}

export default function RegistryHomePage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'ALL' | RegistryStatus>('ALL');

  const visibleRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return RECORDS.filter((record) => {
      const haystack = [
        record.registrationId,
        record.organization,
        record.architecture,
        record.version,
        record.steward,
        record.sectors.join(' '),
        record.jurisdictions.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return (status === 'ALL' || record.status === status) && (!normalized || haystack.includes(normalized));
    });
  }, [query, status]);

  const active = RECORDS.filter((record) => record.status === 'ACTIVE' || record.status === 'FOUNDING').length;
  const pending = RECORDS.filter((record) => record.status === 'UNDER_REVIEW').length;
  const artifacts = RECORDS.reduce((total, record) => total + record.artifacts, 0);
  const routes = RECORDS.reduce((total, record) => total + record.routes, 0);

  return (
    <main className="page">
      <div className="background" aria-hidden="true">
        <div className="stars stars-one" />
        <div className="stars stars-two" />
        <div className="glow glow-one" />
        <div className="glow glow-two" />
      </div>

      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">TA-14</span>
          <span>
            <strong>TA-14 Registry Institution</strong>
            <small>Foundation • Architecture • Governance • Public Proof</small>
          </span>
        </Link>

        <nav aria-label="Registry navigation">
          <a href="#registry-live">Live Registry</a>
          <a href="#institutional-hierarchy">Structure</a>
          <a href="#journey">How it works</a>
          <Link href="/governance/directory">Directory</Link>
        </nav>

        <Link href="/governance/register" className="top-action">
          Register governance
        </Link>
      </header>

      <section className="lifecycle" aria-label="TA-14 institutional lifecycle">
        {[
          ['Credentials', '/foundation'],
          ['Architecture', '/workspace/ai-governance/registry'],
          ['Governance Registry', '/registry'],
          ['Workspace', '/governance/workspace'],
          ['Route Builder', '/workspace/routes/new'],
          ['Artifact Studio', '/artifacts/studio'],
          ['Artifact Registry', '/artifacts'],
          ['Verification', '/artifacts/verify'],
        ].map(([label, href], index) => (
          <div className={label === 'Governance Registry' ? 'current' : ''} key={label}>
            <Link href={href}>{label}</Link>
            {index < 7 ? <span>→</span> : null}
          </div>
        ))}
      </section>

      <section className="hero">
        <div className="status-row">
          <span>TA-14 REGISTRY INSTITUTION</span>
          <span>PUBLIC</span>
          <span>SEARCHABLE</span>
          <span>ATTRIBUTABLE</span>
          <span>CHALLENGEABLE</span>
        </div>
        <p className="eyebrow">GOVERNANCE IDENTITY • REGISTRATION • ELIGIBILITY • PUBLIC RECORD</p>
        <h1>
          A registry should do more than explain itself.
          <span>It should let the public inspect who is registered.</span>
        </h1>
        <p className="hero-copy">
          The TA-14 AI Governance Registry preserves dated, attributable governance records and connects them to the routes,
          execution artifacts, verification history, challenges, corrections, and public evidence those governances produce.
        </p>
        <div className="hero-actions">
          <Link href="/governance/register" className="button button-gold">
            Register AI governance <span>→</span>
          </Link>
          <Link href="/governance/directory" className="button button-primary">
            Browse registered governance <span>→</span>
          </Link>
          <a href="#registry-live" className="button button-secondary">
            Inspect live registry <span>↓</span>
          </a>
        </div>
        <div className="governing-rule">
          <small>Registry eligibility rule</small>
          <strong>No registered governance. No registered artifact.</strong>
          <p>Registration creates attributable identity and eligibility. It is not certification, approval, or proof of performance.</p>
        </div>
      </section>

      <section className="metrics shell" aria-label="Registry metrics">
        <article><small>Governance records</small><strong>{RECORDS.length}</strong><span>Founding and candidate records</span></article>
        <article><small>Active registrations</small><strong>{active}</strong><span>Eligible to own registered artifacts</span></article>
        <article><small>Under review</small><strong>{pending}</strong><span>No permanent ID or artifact eligibility yet</span></article>
        <article><small>Governed routes</small><strong>{routes}</strong><span>Versioned operational pathways</span></article>
        <article><small>Published artifacts</small><strong>{artifacts}</strong><span>Bounded execution-proof records</span></article>
      </section>

      <section id="registry-live" className="section shell live-registry">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">LIVE AI GOVERNANCE REGISTRY</p>
            <h2>Search the records—not just the institution.</h2>
            <p>
              Every active record should expose its permanent ID, organization, architecture, version, accountable steward,
              declared scope, operational evidence, verification level, and challenge state.
            </p>
          </div>
          <Link href="/governance/directory" className="inline-action">Open complete directory →</Link>
        </div>

        <div className="registry-console">
          <label>
            <span>Search governance records</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Registration ID, organization, architecture, steward, sector..."
            />
          </label>
          <label>
            <span>Registration status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as 'ALL' | RegistryStatus)}>
              <option value="ALL">All records</option>
              <option value="FOUNDING">Founding</option>
              <option value="ACTIVE">Active</option>
              <option value="UNDER_REVIEW">Under review</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </label>
        </div>

        <div className="result-line">
          <span>{visibleRecords.length} governance records visible</span>
          <button type="button" onClick={() => { setQuery(''); setStatus('ALL'); }}>Reset search</button>
        </div>

        <div className="record-grid">
          {visibleRecords.map((record) => (
            <article className={`governance-record ${statusClass(record.status)}`} key={record.registrationId}>
              <div className="record-topline">
                <span>{record.registrationId}</span>
                <strong>{record.status.replaceAll('_', ' ')}</strong>
              </div>
              <p className="record-organization">{record.organization}</p>
              <h3>{record.architecture}</h3>
              <p className="record-summary">{record.summary}</p>
              <div className="record-facts">
                <span><small>Version</small>{record.version}</span>
                <span><small>Accountable steward</small>{record.steward}</span>
                <span><small>Routes</small>{record.routes}</span>
                <span><small>Artifacts</small>{record.artifacts}</span>
                <span><small>Verification ceiling</small>L{record.verification}</span>
                <span><small>Open challenges</small>{record.openChallenges}</span>
              </div>
              <div className="scope-line">
                {record.sectors.map((sector) => <span key={sector}>{sector}</span>)}
              </div>
              <div className="record-actions">
                <Link href={record.href}>Open public record →</Link>
                <Link href="/artifacts">Inspect evidence portfolio</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="journey" className="section shell journey-section">
        <div className="section-heading">
          <p className="eyebrow">FIRST-TIME PARTICIPANT PATH</p>
          <h2>From governance registration to public execution proof.</h2>
          <p>
            Registration is the beginning of the lifecycle. The governance must still build bounded routes, produce execution artifacts,
            pass registry admission, support verification, and remain open to challenge and correction.
          </p>
        </div>
        <div className="journey-grid">
          {JOURNEY.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <Link href={step.href}>{step.action} →</Link>
            </article>
          ))}
        </div>
      </section>

      <section id="institutional-hierarchy" className="section shell hierarchy-section">
        <div className="section-heading hierarchy-heading">
          <p className="eyebrow">INSTITUTIONAL HIERARCHY</p>
          <h2>Four distinct layers. One connected public record.</h2>
          <p>
            Keeping the layers separate prevents a public architecture from being mistaken for a registration—and prevents a
            registration from being mistaken for certification, validation, legal approval, or execution proof.
          </p>
        </div>
        <div className="hierarchy-grid">
          {HIERARCHY.map((layer) => (
            <Link href={layer.href} className={`hierarchy-card ${layer.tone}`} key={layer.number}>
              <span className="hierarchy-number">{layer.number}</span>
              <p>{layer.eyebrow}</p>
              <h3>{layer.title}</h3>
              <strong>{layer.description}</strong>
              <div>{layer.action} <b>→</b></div>
            </Link>
          ))}
        </div>
        <div className="hierarchy-chain">
          <span>Credentials & Public Record</span><b>→</b><span>Architectural Registry</span><b>→</b>
          <span>AI Governance Registry</span><b>→</b><span>Individual Records</span><b>→</b><span>Execution Evidence</span>
        </div>
      </section>

      <section className="section shell founding-section">
        <div className="featured-record">
          <div className="featured-copy">
            <div className="featured-topline"><span>FOUNDING REGISTRY RECORD</span><strong>TA-14-AIGR-0001</strong></div>
            <p className="eyebrow">ACTIVE • PUBLIC • ARTIFACT ELIGIBLE</p>
            <h2>TA-14 Admissible Execution Architecture</h2>
            <p>
              The founding record connects governance identity to declared claims, limitations, chronology, evidence, rights,
              versions, governed routes, execution artifacts, verification, and challenge history.
            </p>
            <div className="record-details">
              <div><small>Status</small><strong>Active</strong></div>
              <div><small>Version</small><strong>v1.0</strong></div>
              <div><small>Routes</small><strong>8</strong></div>
              <div><small>Artifacts</small><strong>12</strong></div>
              <div><small>Verification</small><strong>L6</strong></div>
              <div><small>Challenges</small><strong>0 open</strong></div>
            </div>
            <div className="featured-actions">
              <Link href="/registry/ta-14-admissible-execution-architecture" className="featured-action">Open complete governance record <b>→</b></Link>
              <Link href="/artifacts" className="featured-secondary">Inspect execution artifacts</Link>
            </div>
          </div>
          <div className="record-map">
            {[
              'Governance identity', 'Claims and boundaries', 'Accountable stewardship', 'Chronology and versions',
              'Supporting evidence', 'Governed routes', 'Execution artifacts', 'Verification history',
              'Challenges and corrections', 'Portfolio evidence',
            ].map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="section shell access-section">
        <div className="section-heading">
          <p className="eyebrow">REGISTRY OPERATIONS</p>
          <h2>Enter the correct surface for the work you need to do.</h2>
          <p>Registration, discovery, operations, proof, and verification are now connected as one institutional lifecycle.</p>
        </div>
        <div className="quick-grid">
          {QUICK_ACTIONS.map((entry) => (
            <Link key={entry.title} href={entry.href} className="quick-card">
              <div><span>{entry.label}</span><b>→</b></div>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section shell boundary-section">
        <div className="boundary-card">
          <p className="eyebrow">REGISTRY BOUNDARY</p>
          <h2>A Registry record preserves a claim. It does not automatically validate it.</h2>
          <div className="boundary-grid">
            <div>
              <h3>The Registry preserves</h3>
              <ul>
                <li>Governance identity, architecture version, and claimed establishment date.</li>
                <li>Founder, author, organization, accountable owner, and steward attribution.</li>
                <li>Claims, non-claims, limitations, sectors, jurisdictions, and declared scope.</li>
                <li>Evidence, publications, filings, route history, artifacts, and version history.</li>
                <li>Challenges, corrections, disputes, suspensions, supersessions, and withdrawals.</li>
              </ul>
            </div>
            <div>
              <h3>The Registry does not automatically provide</h3>
              <ul>
                <li>Certification, accreditation, regulatory approval, or legal authorization.</li>
                <li>Legal priority, ownership, validity, enforceability, or technical performance proof.</li>
                <li>Endorsement by TA-14, an independent reviewer, or any Registry participant.</li>
                <li>Permission to exceed the governance’s declared scope, authority, or execution boundaries.</li>
                <li>Artifact eligibility before an active permanent Governance Registration ID is issued.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <div><strong>TA-14 Registry Institution</strong><span>Identity, registration, operations, and public proof kept distinct—and connected.</span></div>
        <p>No registered governance. No registered artifact.</p>
        <nav><Link href="/governance/register">Register</Link><Link href="/governance/directory">Directory</Link><Link href="/artifacts">Artifacts</Link><Link href="/artifacts/verify">Verify</Link></nav>
      </footer>

      <style jsx global>{`
        :root{color-scheme:dark;--bg:#020813;--text:#f2f7ff;--muted:#9fb2c3;--line:rgba(129,192,239,.18);--blue:#6dd8ff;--gold:#f2bf6d;--green:#62e0ad;--violet:#aa88ff}
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit;text-decoration:none}button,input,select{font:inherit}.page{position:relative;min-height:100vh;overflow:hidden;background:radial-gradient(circle at 50% 0%,rgba(38,112,178,.22),transparent 30%),linear-gradient(180deg,#020711 0%,#06121f 52%,#020811 100%)}
        .background{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:0}.stars{position:absolute;inset:-20%;opacity:.55;background-repeat:repeat}.stars-one{background-image:radial-gradient(circle,rgba(255,255,255,.72) 0 1px,transparent 1.4px);background-size:91px 91px;animation:drift 48s linear infinite}.stars-two{background-image:radial-gradient(circle,rgba(109,216,255,.7) 0 1px,transparent 1.7px);background-size:149px 149px;animation:drift 72s linear infinite reverse}.glow{position:absolute;border-radius:50%;filter:blur(120px);opacity:.18}.glow-one{width:560px;height:560px;top:0;left:-220px;background:#2a8bd3}.glow-two{width:660px;height:660px;top:35%;right:-340px;background:#b87822}
        .topbar,.hero,.section,.footer,.lifecycle,.metrics{position:relative;z-index:2}.topbar{width:min(1480px,calc(100% - 40px));min-height:76px;margin:18px auto 0;padding:12px 14px 12px 18px;display:flex;align-items:center;justify-content:space-between;gap:24px;border:1px solid rgba(139,201,247,.18);border-radius:20px;background:rgba(2,10,19,.76);backdrop-filter:blur(18px);box-shadow:0 18px 70px rgba(0,0,0,.32)}.brand{display:flex;align-items:center;gap:13px;min-width:280px}.brand-mark{width:52px;height:52px;display:grid;place-items:center;border-radius:16px;border:1px solid rgba(242,191,109,.46);background:linear-gradient(145deg,rgba(138,86,29,.34),rgba(29,100,153,.22));color:var(--gold);font-size:13px;font-weight:900}.brand>span:last-child{display:grid;gap:3px}.brand strong{font-family:Georgia,"Times New Roman",serif;font-size:17px}.brand small{color:#91a9bc;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.topbar nav{display:flex;align-items:center;gap:7px}.topbar nav a{padding:10px 12px;border-radius:11px;color:#b5c8d8;font-size:12px;font-weight:800}.topbar nav a:hover{color:#fff;background:rgba(109,216,255,.08)}.top-action{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 17px;border-radius:13px;border:1px solid rgba(255,224,158,.72);background:linear-gradient(135deg,#fff0b8,#f2bf6d 58%,#bd7419);color:#251500;font-size:11px;font-weight:900}
        .lifecycle{width:min(1480px,calc(100% - 40px));margin:12px auto 0;padding:10px 14px;display:flex;align-items:center;justify-content:center;gap:8px;overflow:auto;border:1px solid var(--line);border-radius:15px;background:rgba(3,13,24,.68);backdrop-filter:blur(15px)}.lifecycle>div{display:flex;align-items:center;gap:8px;white-space:nowrap}.lifecycle a{padding:7px 9px;border-radius:8px;color:#8299ad;font-size:9px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}.lifecycle span{color:#4d6578}.lifecycle .current a{color:#07101a;background:linear-gradient(135deg,#c7f2ff,#68ceff);box-shadow:0 8px 22px rgba(53,170,247,.18)}
        .hero{width:min(1240px,calc(100% - 40px));margin:0 auto;padding:96px 0 70px;text-align:center}.status-row{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-bottom:28px}.status-row span{min-height:31px;display:inline-flex;align-items:center;padding:0 12px;border-radius:999px;border:1px solid rgba(137,205,255,.2);background:rgba(7,28,45,.72);color:#a9c9df;font-size:9px;font-weight:900;letter-spacing:.1em}.status-row span:first-child{color:#ffdb98;border-color:rgba(242,191,109,.3);background:rgba(100,62,20,.2)}.eyebrow{margin:0 0 16px;color:var(--gold);font-size:10px;font-weight:900;letter-spacing:.24em;text-transform:uppercase}.hero h1{max-width:1160px;margin:0 auto;font-family:Georgia,"Times New Roman",serif;font-size:clamp(56px,8.5vw,108px);font-weight:500;line-height:.92;letter-spacing:-.058em}.hero h1 span{display:block;margin-top:12px;color:transparent;background:linear-gradient(100deg,#f9fcff 0%,#7bdcff 45%,#ffd48b 84%);-webkit-background-clip:text;background-clip:text;font-style:italic}.hero-copy{max-width:920px;margin:34px auto 0;color:#c0cfdb;font-size:clamp(17px,2vw,22px);line-height:1.72}.hero-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:34px}.button{min-height:52px;display:inline-flex;align-items:center;justify-content:center;gap:12px;padding:0 21px;border-radius:14px;border:1px solid transparent;font-size:11px;font-weight:900;letter-spacing:.045em;transition:transform .22s ease}.button:hover{transform:translateY(-2px)}.button-primary{color:#03111d;border-color:rgba(209,243,255,.9);background:linear-gradient(135deg,#c7f2ff,#68ceff 55%,#369cec);box-shadow:0 14px 34px rgba(53,170,247,.22)}.button-secondary{color:#e4f2ff;border-color:rgba(139,204,249,.24);background:linear-gradient(180deg,rgba(36,78,109,.7),rgba(7,24,39,.88))}.button-gold{color:#271500;border-color:rgba(255,224,158,.9);background:linear-gradient(135deg,#fff0b8,#f2bf6d 58%,#bd7419);box-shadow:0 14px 34px rgba(214,146,35,.22)}.governing-rule{max-width:760px;margin:36px auto 0;padding:20px 24px;border:1px solid rgba(242,191,109,.25);border-left:3px solid var(--gold);border-radius:14px;background:rgba(63,43,17,.24);text-align:left}.governing-rule small,.governing-rule strong{display:block}.governing-rule small{color:#d2ac65;font-size:8px;letter-spacing:.16em;text-transform:uppercase}.governing-rule strong{margin:8px 0;font-family:Georgia,serif;font-size:23px}.governing-rule p{margin:0;color:#aebdca;line-height:1.6}
        .shell{width:min(1200px,calc(100% - 40px));margin:0 auto}.metrics{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.metrics article{min-height:135px;padding:20px;border:1px solid var(--line);border-radius:17px;background:linear-gradient(155deg,rgba(12,35,54,.9),rgba(4,15,26,.94));box-shadow:0 20px 50px rgba(0,0,0,.22)}.metrics small,.metrics strong,.metrics span{display:block}.metrics small{color:#7893a8;font-size:8px;letter-spacing:.13em;text-transform:uppercase}.metrics strong{margin:12px 0 7px;font-size:39px}.metrics span{color:#8499aa;font-size:9px;line-height:1.4}.section{padding:92px 0}.section-heading{max-width:930px;margin-bottom:40px}.section-heading h2,.featured-copy h2,.boundary-card h2{margin:0;font-family:Georgia,"Times New Roman",serif;font-size:clamp(38px,5vw,64px);font-weight:500;line-height:1.03;letter-spacing:-.04em}.section-heading>p:last-child,.featured-copy>p:not(.eyebrow){margin:20px 0 0;color:var(--muted);font-size:15px;line-height:1.8}.split-heading{max-width:none;display:grid;grid-template-columns:1fr auto;gap:30px;align-items:end}.split-heading>div{max-width:900px}.inline-action{padding:12px 15px;border:1px solid var(--line);border-radius:11px;color:#bdeeff;font-size:11px;font-weight:900;background:rgba(109,216,255,.06)}
        .registry-console{display:grid;grid-template-columns:1fr 260px;gap:12px;padding:14px;border:1px solid var(--line);border-radius:17px;background:rgba(5,18,31,.78)}.registry-console label>span{display:block;margin-bottom:8px;color:#7d96aa;font-size:8px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.registry-console input,.registry-console select{width:100%;height:49px;border:1px solid var(--line);border-radius:10px;background:#04101c;color:#eaf5ff;padding:0 13px;outline:none}.registry-console input:focus,.registry-console select:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(109,216,255,.07)}.result-line{display:flex;justify-content:space-between;padding:14px 3px;color:#7f94a7;font-size:9px}.result-line button{border:0;background:transparent;color:#8edcff;cursor:pointer}.record-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.governance-record{position:relative;padding:26px;border:1px solid var(--line);border-radius:22px;background:radial-gradient(circle at 100% 0%,rgba(109,216,255,.11),transparent 38%),linear-gradient(155deg,rgba(12,35,54,.94),rgba(4,15,26,.97));box-shadow:0 24px 60px rgba(0,0,0,.24)}.governance-record.founding{border-color:rgba(242,191,109,.34);background:radial-gradient(circle at 100% 0%,rgba(242,191,109,.15),transparent 38%),linear-gradient(155deg,rgba(42,31,16,.92),rgba(4,15,26,.97))}.governance-record.under-review{border-color:rgba(170,136,255,.28)}.record-topline{display:flex;justify-content:space-between;gap:14px}.record-topline span{color:#a9dff8;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px}.record-topline strong{padding:6px 9px;border-radius:999px;border:1px solid rgba(98,224,173,.28);color:var(--green);font-size:8px;letter-spacing:.1em}.under-review .record-topline strong{color:#c6b0ff;border-color:rgba(170,136,255,.35)}.record-organization{margin:30px 0 7px!important;color:var(--gold)!important;font-size:10px!important;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.governance-record h3{margin:0;font-family:Georgia,serif;font-size:32px;font-weight:500;line-height:1.08}.record-summary{min-height:78px;color:#9fb1c0;line-height:1.65}.record-facts{display:grid;grid-template-columns:1fr 1fr;gap:8px}.record-facts span{padding:11px;border-radius:10px;background:rgba(255,255,255,.025);color:#c6d3de;font-size:9px;overflow-wrap:anywhere}.record-facts small{display:block;margin-bottom:5px;color:#71879a;font-size:7px;letter-spacing:.1em;text-transform:uppercase}.scope-line{display:flex;flex-wrap:wrap;gap:6px;margin-top:15px}.scope-line span{padding:6px 8px;border:1px solid var(--line);border-radius:999px;color:#8ca7b9;font-size:7px}.record-actions{display:flex;justify-content:space-between;gap:12px;margin-top:20px;padding-top:18px;border-top:1px solid var(--line)}.record-actions a{color:#b9eaff;font-size:9px;font-weight:900}
        .journey-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.journey-grid article{min-height:285px;padding:24px;border:1px solid var(--line);border-radius:20px;background:linear-gradient(155deg,rgba(12,35,54,.9),rgba(4,15,26,.96));display:flex;flex-direction:column}.journey-grid article>span{width:45px;height:45px;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(242,191,109,.35);color:var(--gold);font-weight:900}.journey-grid h3{margin:30px 0 10px;font-family:Georgia,serif;font-size:27px;font-weight:500}.journey-grid p{color:#9fb1c0;line-height:1.65}.journey-grid a{margin-top:auto;color:#9de4ff;font-size:10px;font-weight:900}
        .hierarchy-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.hierarchy-card{min-height:390px;display:flex;flex-direction:column;padding:25px;position:relative;overflow:hidden;border-radius:24px;border:1px solid rgba(109,216,255,.18);background:radial-gradient(circle at 100% 0%,rgba(109,216,255,.1),transparent 38%),linear-gradient(155deg,rgba(12,35,54,.92),rgba(4,15,26,.97));transition:.24s}.hierarchy-card:hover{transform:translateY(-7px);border-color:rgba(109,216,255,.42);box-shadow:0 24px 58px rgba(0,0,0,.3)}.hierarchy-card.gold{border-color:rgba(242,191,109,.32);background:radial-gradient(circle at 100% 0%,rgba(242,191,109,.16),transparent 40%),linear-gradient(155deg,rgba(50,34,14,.94),rgba(6,17,28,.98))}.hierarchy-card.violet{border-color:rgba(170,136,255,.28)}.hierarchy-card.green{border-color:rgba(98,224,173,.25)}.hierarchy-number{width:46px;height:46px;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(109,216,255,.28);color:#9de4ff;background:rgba(28,103,139,.11);font-size:11px;font-weight:900}.hierarchy-card>p{margin:30px 0 0;color:var(--gold);font-size:9px;font-weight:900;letter-spacing:.12em}.hierarchy-card h3{margin:11px 0 14px;font-family:Georgia,serif;font-size:30px;font-weight:500;line-height:1.04}.hierarchy-card>strong{color:#a8bac8;font-size:12px;font-weight:500;line-height:1.7}.hierarchy-card>div{display:flex;justify-content:space-between;gap:16px;margin-top:auto;padding-top:30px;color:#d9f2ff;font-size:11px;font-weight:900}.hierarchy-chain{margin-top:18px;padding:18px 22px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px 14px;border-radius:17px;border:1px solid rgba(242,191,109,.22);background:rgba(33,24,11,.46)}.hierarchy-chain span{color:#d8e5ee;font-size:11px;font-weight:800}.hierarchy-chain b{color:var(--gold)}
        .featured-record{display:grid;grid-template-columns:1.12fr .88fr;gap:20px;padding:24px;border-radius:30px;border:1px solid rgba(242,191,109,.26);background:radial-gradient(circle at 8% 0%,rgba(189,119,32,.16),transparent 32%),linear-gradient(145deg,rgba(9,28,45,.96),rgba(4,13,23,.98));box-shadow:0 28px 90px rgba(0,0,0,.32)}.featured-copy{padding:24px}.featured-topline{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:42px}.featured-topline span,.featured-topline strong{padding:7px 10px;border-radius:999px;border:1px solid rgba(109,216,255,.18);background:rgba(8,39,62,.5);color:#a6ddfb;font-size:9px;font-weight:900;letter-spacing:.08em}.featured-topline strong{color:#ffda97;border-color:rgba(242,191,109,.26);background:rgba(92,55,18,.24)}.record-details{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:28px}.record-details div{padding:15px;border-radius:14px;border:1px solid rgba(109,216,255,.15);background:rgba(5,22,36,.68)}.record-details small,.record-details strong{display:block}.record-details small{color:#809caf;font-size:8px;font-weight:900;letter-spacing:.09em;text-transform:uppercase}.record-details strong{margin-top:7px;font-family:Georgia,serif;font-size:17px}.featured-actions{display:grid;grid-template-columns:1fr auto;gap:10px;margin-top:24px}.featured-action,.featured-secondary{min-height:56px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:0 18px;border-radius:15px;font-size:11px;font-weight:900}.featured-action{border:1px solid rgba(209,243,255,.88);background:linear-gradient(135deg,#c7f2ff,#68ceff 55%,#369cec);color:#03111d}.featured-secondary{border:1px solid var(--line);background:rgba(109,216,255,.05);color:#c8efff}.record-map{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:18px;border-radius:22px;border:1px solid rgba(109,216,255,.15);background:rgba(3,16,28,.72)}.record-map span{min-height:72px;display:flex;align-items:center;padding:15px;border-radius:14px;border:1px solid rgba(109,216,255,.14);background:linear-gradient(145deg,rgba(12,39,60,.8),rgba(5,20,33,.92));color:#c5d7e4;font-size:11px;font-weight:800;line-height:1.4}
        .quick-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.quick-card{min-height:250px;display:flex;flex-direction:column;padding:25px;border:1px solid var(--line);border-radius:20px;background:linear-gradient(155deg,rgba(12,35,54,.9),rgba(4,15,26,.94));transition:.22s}.quick-card:hover{transform:translateY(-4px);border-color:rgba(109,216,255,.38)}.quick-card>div{display:flex;justify-content:space-between;color:var(--gold);font-size:9px;font-weight:900;letter-spacing:.1em}.quick-card h3{margin:42px 0 12px;font-family:Georgia,serif;font-size:28px;font-weight:500}.quick-card p{margin:0;color:#9fb1c0;font-size:13px;line-height:1.7}
        .boundary-card{padding:42px;border-radius:28px;border:1px solid rgba(242,191,109,.23);background:radial-gradient(circle at 12% 0%,rgba(189,119,32,.15),transparent 34%),linear-gradient(145deg,rgba(9,28,45,.96),rgba(4,13,23,.98))}.boundary-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:32px}.boundary-grid>div{padding:24px;border-radius:18px;border:1px solid var(--line);background:rgba(5,20,33,.75)}.boundary-grid h3{margin:0 0 16px;font-family:Georgia,serif;font-size:22px;font-weight:500}.boundary-grid ul{margin:0;padding-left:20px;color:#aebdca}.boundary-grid li{margin:10px 0;font-size:13px;line-height:1.6}.footer{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:30px;padding:45px 0 60px;border-top:1px solid var(--line);color:#8599aa}.footer div{display:grid;gap:5px}.footer strong{color:#d7e7f3;font-family:Georgia,serif;font-size:16px}.footer span,.footer p{margin:0;font-size:12px}.footer p{color:var(--gold);font-family:Georgia,serif;font-style:italic}.footer nav{display:flex;justify-content:flex-end;gap:12px}.footer nav a{font-size:10px;color:#9fb8ca}
        @keyframes drift{from{transform:translate3d(0,0,0)}to{transform:translate3d(120px,90px,0)}}
        @media(max-width:1100px){.topbar nav{display:none}.metrics{grid-template-columns:repeat(2,1fr)}.record-grid,.featured-record{grid-template-columns:1fr}.journey-grid,.quick-grid{grid-template-columns:repeat(2,1fr)}.hierarchy-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:760px){.topbar{width:min(100% - 22px,1480px)}.brand{min-width:0}.brand small,.top-action{display:none}.lifecycle{width:min(100% - 22px,1480px);justify-content:flex-start}.hero{width:min(100% - 28px,1240px);padding:70px 0 60px}.hero h1{font-size:54px}.shell{width:min(100% - 28px,1200px)}.section{padding:72px 0}.metrics,.record-grid,.journey-grid,.quick-grid,.hierarchy-grid,.boundary-grid,.record-map,.record-details{grid-template-columns:1fr}.registry-console,.split-heading{grid-template-columns:1fr}.featured-record{padding:14px}.featured-copy{padding:18px 8px}.featured-actions{grid-template-columns:1fr}.record-facts{grid-template-columns:1fr}.footer{grid-template-columns:1fr;text-align:center}.footer nav{justify-content:center}}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.001ms!important}}
      `}</style>
    </main>
  );
}
