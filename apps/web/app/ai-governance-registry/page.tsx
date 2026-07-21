// apps/web/app/ai-governance-registry/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type RegistryStatus = 'ACTIVE' | 'UNDER REVIEW' | 'SUPERSEDED' | 'WITHDRAWN';
type GovernanceType =
  | 'AI System'
  | 'Governance Framework'
  | 'Model'
  | 'Review Method'
  | 'Evidence Standard';

type RegistryEntry = {
  id: string;
  name: string;
  type: GovernanceType;
  status: RegistryStatus;
  steward: string;
  established: string;
  lastReviewed: string;
  jurisdiction: string;
  purpose: string;
  claims: string[];
  nonClaims: string[];
  evidence: string[];
  reviewers: string[];
  versions: string[];
  routes: string[];
};

const entries: RegistryEntry[] = [
  {
    id: 'TA-14-REG-0001',
    name: 'TA-14 Admissible Execution Architecture',
    type: 'Governance Framework',
    status: 'ACTIVE',
    steward: 'TA-14 Authority Governance Institution',
    established: '2025-05-01',
    lastReviewed: '2026-07-21',
    jurisdiction: 'Cross-domain governance architecture',
    purpose:
      'Structures consequential execution through evidence, continuity, admissibility, authority, binding, commitment, execution, and outcome records.',
    claims: [
      'Defines a bounded route for consequential execution',
      'Separates evidence from determination and execution',
      'Supports ALLOW, HOLD, DENY, and ESCALATE outcomes',
    ],
    nonClaims: [
      'Does not independently establish legal compliance',
      'Does not certify factual truth without admissible evidence',
      'Does not replace domain-specific professional judgment',
    ],
    evidence: [
      'Published architecture records',
      'Demonstration routes',
      'Verification receipts',
      'Replay and continuity tests',
    ],
    reviewers: ['Independent review pending expansion'],
    versions: ['v1.0', 'v1.1', 'v2.0 architecture route'],
    routes: ['/marketplace/routes', '/verification', '/records'],
  },
  {
    id: 'TA-14-REG-0002',
    name: 'Article 50 Transparency Assessment Route',
    type: 'Review Method',
    status: 'UNDER REVIEW',
    steward: 'TA-14 EU AI Act Workspace',
    established: '2026-07-21',
    lastReviewed: '2026-07-21',
    jurisdiction: 'European Union AI Act',
    purpose:
      'Maps provider and deployer transparency pathways for direct interaction, marking, detectability, deepfakes, and public-interest text.',
    claims: [
      'Separates provider and deployer duties',
      'Maps declared evidence and unresolved gaps',
      'Preserves implementation and review boundaries',
    ],
    nonClaims: [
      'Does not provide legal advice',
      'Does not certify Article 50 compliance',
      'Does not submit evidence to authorities',
    ],
    evidence: [
      'Article 50 pathway records',
      'Disclosure evidence maps',
      'Detectability test requirements',
      'Exception and limitation records',
    ],
    reviewers: ['Legal review required', 'Technical review required'],
    versions: ['Initial public workspace'],
    routes: ['/eu-ai-act/article-50', '/eu-ai-act/requirements'],
  },
  {
    id: 'TA-14-REG-0003',
    name: 'High-Risk AI Lifecycle Governance Route',
    type: 'Review Method',
    status: 'ACTIVE',
    steward: 'TA-14 EU AI Act Workspace',
    established: '2026-07-21',
    lastReviewed: '2026-07-21',
    jurisdiction: 'European Union AI Act',
    purpose:
      'Structures classification, risk management, data governance, documentation, logging, oversight, conformity, deployment, monitoring, and incident response.',
    claims: [
      'Represents high-risk governance as a lifecycle',
      'Defines evidence gates and failure states',
      'Connects classification to operation and outcome',
    ],
    nonClaims: [
      'Does not classify a real system by itself',
      'Does not complete conformity assessment',
      'Does not issue registration or CE marking',
    ],
    evidence: [
      'Lifecycle gate definitions',
      'Failure-state records',
      'Governed-output definitions',
      'Deployment and monitoring pathways',
    ],
    reviewers: ['Sector review required', 'Conformity review required'],
    versions: ['Initial high-risk workspace'],
    routes: ['/eu-ai-act/high-risk', '/eu-ai-act/fundamental-rights'],
  },
  {
    id: 'TA-14-REG-0004',
    name: 'Governed Record Interpreter',
    type: 'AI System',
    status: 'UNDER REVIEW',
    steward: 'TA-14 AI Governance Exchange',
    established: '2026-07-20',
    lastReviewed: '2026-07-21',
    jurisdiction: 'Land, water, air, building, and personal environmental records',
    purpose:
      'Produces bounded interpretations of governed records while preserving what the source record proves, does not prove, and requires for further review.',
    claims: [
      'Separates source record from interpretation',
      'Preserves evidentiary boundaries',
      'Supports governed interpretation outputs',
    ],
    nonClaims: [
      'Does not diagnose',
      'Does not optimise',
      'Does not replace licensed or clinical judgment',
    ],
    evidence: [
      'Record-type definitions',
      'Interpretation workflow',
      'Admissibility and continuity fields',
      'Governed Interpretation Record specification',
    ],
    reviewers: ['Environmental review pending', 'Clinical review required for medical use'],
    versions: ['GRI initial architecture'],
    routes: ['/marketplace/governed-records', '/records'],
  },
];

const statusClass: Record<RegistryStatus, string> = {
  ACTIVE: 'active',
  'UNDER REVIEW': 'under-review',
  SUPERSEDED: 'superseded',
  WITHDRAWN: 'withdrawn',
};

export default function AiGovernanceRegistryPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'All' | GovernanceType>('All');
  const [status, setStatus] = useState<'All' | RegistryStatus>('All');

  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return entries.filter((entry) => {
      const queryMatch =
        !normalized ||
        [
          entry.id,
          entry.name,
          entry.type,
          entry.status,
          entry.steward,
          entry.jurisdiction,
          entry.purpose,
          ...entry.claims,
          ...entry.nonClaims,
          ...entry.evidence,
          ...entry.reviewers,
          ...entry.versions,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalized);

      const typeMatch = type === 'All' || entry.type === type;
      const statusMatch = status === 'All' || entry.status === status;

      return queryMatch && typeMatch && statusMatch;
    });
  }, [query, status, type]);

  return (
    <main className="page-shell">
      <div className="ambient" aria-hidden="true">
        <span className="node n1" />
        <span className="node n2" />
        <span className="node n3" />
        <span className="orbit o1" />
        <span className="orbit o2" />
      </div>

      <div className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">TA-14 AI Governance Exchange</Link>
          <span>/</span>
          <span>AI Governance Registry</span>
        </nav>

        <header className="hero">
          <span className="eyebrow">AI GOVERNANCE REGISTRY</span>
          <h1>Preserve what a governance system is, what it claims, and what it cannot claim.</h1>
          <p className="hero-copy">
            Governance cannot remain inspectable when its identity, stewardship, versions, claims,
            evidence, review history, and supersession status are scattered across websites,
            presentations, policies, and private documents. The registry creates a public proof
            surface for governance identity and continuity.
          </p>

          <div className="boundary-banner">
            <strong>Registration does not equal validation.</strong>
            <p>
              A registry entry preserves declared facts, evidence references, review status, and
              limitations. Inclusion does not certify effectiveness, legality, safety, truth, or
              regulatory compliance.
            </p>
          </div>

          <div className="action-row">
            <a className="primary-button" href="#registry">
              Browse registry
            </a>
            <Link className="secondary-button" href="/marketplace/opportunities">
              Post a registry review need
            </Link>
            <Link className="text-link" href="/marketplace/professionals">
              Find independent reviewers
            </Link>
          </div>
        </header>

        <section className="summary-grid">
          <article>
            <span>Registry entries</span>
            <strong>{entries.length}</strong>
            <p>Current demonstration records across frameworks, systems, and review methods.</p>
          </article>
          <article>
            <span>Active entries</span>
            <strong>{entries.filter((entry) => entry.status === 'ACTIVE').length}</strong>
            <p>Entries currently declared active by their steward.</p>
          </article>
          <article>
            <span>Under review</span>
            <strong>{entries.filter((entry) => entry.status === 'UNDER REVIEW').length}</strong>
            <p>Entries with unresolved independent review requirements.</p>
          </article>
          <article>
            <span>Core boundary</span>
            <strong>NO SELF-CERTIFICATION</strong>
            <p>Steward declarations remain separate from independent review and public acceptance.</p>
          </article>
        </section>

        <section className="principle-section">
          <div className="section-heading">
            <span className="eyebrow">WHY A REGISTRY EXISTS</span>
            <h2>Governance identity must remain continuous before governance claims can be tested.</h2>
            <p>
              A system cannot be meaningfully reviewed when reviewers do not know which version is
              being assessed, who controls it, what evidence supports its claims, what changed, or
              whether the current implementation has superseded earlier public descriptions.
            </p>
          </div>

          <div className="principle-grid">
            {[
              ['Identity', 'The exact governance system, framework, model, method, or standard being represented.'],
              ['Stewardship', 'The person or institution accountable for maintaining the entry and declaring changes.'],
              ['Claims', 'What the registered system affirmatively says it can do.'],
              ['Non-claims', 'What the system does not prove, decide, certify, replace, or authorise.'],
              ['Evidence', 'The records, artifacts, tests, publications, demonstrations, and review materials supporting the entry.'],
              ['Continuity', 'Versions, effective dates, supersession, withdrawal, and current operational status.'],
            ].map(([title, description]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="registry-section" id="registry">
          <div className="section-heading">
            <span className="eyebrow">PUBLIC REGISTRY SURFACE</span>
            <h2>Inspect entries by identity, status, type, claim, or evidence.</h2>
          </div>

          <div className="filter-panel">
            <label className="search-field">
              <span>Search registry</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, steward, claim, evidence, reviewer, or registry ID"
              />
            </label>

            <label>
              <span>Registry type</span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as 'All' | GovernanceType)}
              >
                <option>All</option>
                <option>AI System</option>
                <option>Governance Framework</option>
                <option>Model</option>
                <option>Review Method</option>
                <option>Evidence Standard</option>
              </select>
            </label>

            <label>
              <span>Status</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as 'All' | RegistryStatus)}
              >
                <option>All</option>
                <option>ACTIVE</option>
                <option>UNDER REVIEW</option>
                <option>SUPERSEDED</option>
                <option>WITHDRAWN</option>
              </select>
            </label>
          </div>

          <div className="results-meta">
            <span>{filteredEntries.length} registry entry or entries</span>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setType('All');
                setStatus('All');
              }}
            >
              Reset filters
            </button>
          </div>

          <div className="registry-grid">
            {filteredEntries.map((entry) => (
              <article className="registry-card" key={entry.id}>
                <div className="card-topline">
                  <div>
                    <span>{entry.type}</span>
                    <small>{entry.id}</small>
                  </div>
                  <span className={`status-badge ${statusClass[entry.status]}`}>
                    {entry.status}
                  </span>
                </div>

                <h3>{entry.name}</h3>
                <p className="purpose">{entry.purpose}</p>

                <dl className="metadata">
                  <div>
                    <dt>Steward</dt>
                    <dd>{entry.steward}</dd>
                  </div>
                  <div>
                    <dt>Established</dt>
                    <dd>{entry.established}</dd>
                  </div>
                  <div>
                    <dt>Last reviewed</dt>
                    <dd>{entry.lastReviewed}</dd>
                  </div>
                  <div>
                    <dt>Scope</dt>
                    <dd>{entry.jurisdiction}</dd>
                  </div>
                </dl>

                <div className="detail-grid">
                  <div>
                    <span>Declared claims</span>
                    <ul>
                      {entry.claims.map((claim) => (
                        <li key={claim}>{claim}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span>Declared non-claims</span>
                    <ul>
                      {entry.nonClaims.map((claim) => (
                        <li key={claim}>{claim}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span>Evidence references</span>
                    <ul>
                      {entry.evidence.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span>Review and version continuity</span>
                    <ul>
                      {[...entry.reviewers, ...entry.versions].map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="route-row">
                  {entry.routes.map((route) => (
                    <Link key={route} href={route}>
                      Open connected route
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="empty-state">
              <h3>No registry entries match those filters.</h3>
              <p>Reset the filters or broaden the search terms.</p>
            </div>
          )}
        </section>

        <section className="record-section">
          <div className="section-heading">
            <span className="eyebrow">REQUIRED REGISTRY RECORDS</span>
            <h2>A credible entry requires more than a title and a description.</h2>
          </div>

          <div className="record-grid">
            {[
              ['Identity Record', 'Name, registry ID, type, scope, steward, establishment date, and current status.'],
              ['Claim Record', 'Every material capability, purpose, assertion, and declared governance outcome.'],
              ['Non-Claim Record', 'Explicit boundaries showing what the registered system cannot establish or replace.'],
              ['Evidence Record', 'Artifacts, publications, demonstrations, tests, records, and proof references supporting each claim.'],
              ['Review Record', 'Reviewer identity, scope, evidence inspected, objections, corrections, findings, and limitations.'],
              ['Version Record', 'Current version, prior versions, effective dates, material changes, supersession, and withdrawal.'],
              ['Stewardship Record', 'Who maintains the entry, who may change it, and who must answer for inaccurate declarations.'],
              ['Public Challenge Record', 'Disputes, corrections, counter-evidence, unresolved objections, and final disposition.'],
            ].map(([title, description]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lifecycle-section">
          <div className="section-heading">
            <span className="eyebrow">REGISTRY LIFECYCLE</span>
            <h2>Every entry should move through visible states.</h2>
          </div>

          <div className="lifecycle-chain">
            {[
              ['01', 'Declared', 'The steward submits identity, claims, non-claims, evidence, and version information.'],
              ['02', 'Evidence mapped', 'Each material claim is bound to inspectable evidence or marked unsupported.'],
              ['03', 'Under review', 'Independent reviewers inspect scope, evidence, reasoning, and boundaries.'],
              ['04', 'Active', 'The entry is current, attributable, and open to inspection and challenge.'],
              ['05', 'Superseded', 'A later version replaces the entry while preserving prior public history.'],
              ['06', 'Withdrawn', 'The steward or authority removes active standing without erasing the record.'],
            ].map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="connected-section">
          <div className="section-heading">
            <span className="eyebrow">CONNECTED EXCHANGE SURFACES</span>
            <h2>The registry identifies the system. Other workspaces test and preserve the route.</h2>
          </div>

          <div className="connected-grid">
            <Link href="/marketplace/governed-records">
              <span>01</span>
              <h3>Governed Records</h3>
              <p>Preserve identity, claims, evidence, review, version, stewardship, and challenge records.</p>
            </Link>
            <Link href="/marketplace/routes">
              <span>02</span>
              <h3>Governance Routes</h3>
              <p>Test how registered claims move through evidence gates, authority, review, and outcome.</p>
            </Link>
            <Link href="/verification">
              <span>03</span>
              <h3>Verification</h3>
              <p>Inspect continuity, replay conditions, evidence integrity, and claimed route behavior.</p>
            </Link>
            <Link href="/marketplace/professionals">
              <span>04</span>
              <h3>Independent Review</h3>
              <p>Find reviewers for legal, technical, sector, rights, evidence, and governance evaluation.</p>
            </Link>
            <Link href="/eu-ai-act/requirements">
              <span>05</span>
              <h3>EU AI Act Requirements</h3>
              <p>Bind registered systems and governance methods to specific regulatory requirement routes.</p>
            </Link>
          </div>
        </section>

        <section className="final-cta">
          <span className="eyebrow">PUBLIC CLAIMS REQUIRE PUBLIC CONTINUITY</span>
          <h2>A governance system should not be able to change invisibly after people rely on it.</h2>
          <p>
            The registry makes stewardship, claims, evidence, review, versions, corrections,
            supersession, and withdrawal visible so governance identity can remain inspectable over
            time.
          </p>

          <div className="action-row centered">
            <a className="primary-button" href="#registry">
              Inspect registry entries
            </a>
            <Link className="secondary-button" href="/marketplace/opportunities">
              Post a registry review opportunity
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; }
        :global(body) { margin: 0; color: #eef8ff; background: #06101b; }
        :global(a) { color: inherit; }
        button, input, select { font: inherit; }

        .page-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(rgba(4,14,24,.83), rgba(4,14,24,.98)),
            radial-gradient(circle at 11% 5%, rgba(18,132,174,.21), transparent 32%),
            radial-gradient(circle at 88% 9%, rgba(76,61,176,.16), transparent 31%);
        }

        .content-shell {
          width: min(1220px, calc(100% - 36px));
          margin: 0 auto;
          padding: 34px 0 96px;
          position: relative;
          z-index: 2;
        }

        .ambient { position: fixed; inset: 0; pointer-events: none; opacity: .68; }
        .node {
          position: absolute; width: 7px; height: 7px; border-radius: 50%;
          background: #87e7f9; box-shadow: 0 0 22px rgba(91,215,243,.95);
          animation: drift 12s ease-in-out infinite;
        }
        .n1 { top: 14%; right: 11%; }
        .n2 { top: 49%; left: 8%; animation-delay: -4s; }
        .n3 { bottom: 15%; right: 18%; animation-delay: -8s; }
        .orbit {
          position: absolute; width: 46vw; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(79,205,234,.3), transparent);
          animation: pulse 8s ease-in-out infinite;
        }
        .o1 { top: 23%; left: -5%; transform: rotate(-16deg); }
        .o2 { bottom: 21%; right: -8%; transform: rotate(20deg); animation-delay: -3s; }

        .breadcrumbs {
          display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 58px;
          color: #83a7b6; font-size: .86rem;
        }
        .breadcrumbs a, .text-link { text-decoration: none; }
        .breadcrumbs a:hover, .text-link:hover { color: #fff; }

        .eyebrow {
          display: inline-block; color: #70d8ef; font-size: .73rem;
          font-weight: 950; letter-spacing: .13em; text-transform: uppercase;
        }

        h1, h2, h3, p { margin-top: 0; }
        .hero { max-width: 1030px; padding-bottom: 70px; }
        h1 {
          margin: 18px 0 24px; font-size: clamp(3.1rem,7vw,6.75rem);
          line-height: .95; letter-spacing: -.058em;
        }
        .hero-copy { max-width: 930px; color: #b5cbd6; font-size: 1.09rem; line-height: 1.8; }

        .boundary-banner {
          margin-top: 27px; border-left: 3px solid #d9b656;
          border-radius: 0 15px 15px 0; padding: 18px 20px;
          background: rgba(201,149,29,.07);
        }
        .boundary-banner p { margin: 8px 0 0; color: #beb28b; line-height: 1.64; }

        .action-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 30px; }
        .primary-button, .secondary-button {
          border-radius: 999px; padding: 14px 21px; font-weight: 950;
          text-decoration: none; transition: transform 170ms ease;
        }
        .primary-button {
          border: 1px solid #88e5f8; color: #031019;
          background: linear-gradient(135deg,#a5efff,#55cae7);
          box-shadow: 0 12px 34px rgba(60,191,222,.17);
        }
        .secondary-button {
          border: 1px solid rgba(147,208,227,.3); color: #eaf9ff;
          background: rgba(10,29,44,.82);
        }
        .primary-button:hover, .secondary-button:hover { transform: translateY(-2px); }
        .text-link { color: #96ccdc; font-weight: 850; }

        .summary-grid {
          display: grid; grid-template-columns: repeat(4,minmax(0,1fr));
          gap: 12px; padding-bottom: 82px;
        }
        .summary-grid article {
          min-height: 190px; padding: 21px; border: 1px solid rgba(103,194,218,.16);
          border-radius: 20px; background: rgba(9,29,44,.74);
        }
        .summary-grid span {
          color: #7899a8; font-size: .7rem; font-weight: 900;
          letter-spacing: .08em; text-transform: uppercase;
        }
        .summary-grid strong { display: block; margin: 40px 0 11px; font-size: 1.28rem; }
        .summary-grid p { color: #91aab5; line-height: 1.57; }

        .principle-section, .registry-section, .record-section, .lifecycle-section, .connected-section {
          padding-top: 82px;
        }
        .section-heading { max-width: 940px; margin-bottom: 28px; }
        .section-heading h2 {
          margin: 12px 0 14px; font-size: clamp(2.3rem,5vw,4.6rem);
          line-height: 1; letter-spacing: -.05em;
        }
        .section-heading p { color: #a5bbc5; line-height: 1.72; }

        .principle-grid, .record-grid {
          display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 11px;
        }
        .principle-grid article, .record-grid article {
          min-height: 220px; padding: 21px; border: 1px solid rgba(103,194,220,.15);
          border-radius: 19px; background: rgba(10,30,45,.72);
        }
        .principle-grid h3, .record-grid h3 { margin-bottom: 14px; font-size: 1.2rem; }
        .principle-grid p, .record-grid p { color: #94abb6; line-height: 1.62; }

        .filter-panel {
          display: grid; grid-template-columns: 1.6fr .7fr .7fr; gap: 12px;
          padding: 24px; border: 1px solid rgba(103,194,220,.18);
          border-radius: 24px;
          background: linear-gradient(145deg,rgba(14,38,55,.94),rgba(7,23,36,.91));
        }
        label > span {
          display: block; margin-bottom: 8px; color: #7899a7; font-size: .7rem;
          font-weight: 900; letter-spacing: .08em; text-transform: uppercase;
        }
        input, select {
          width: 100%; min-height: 46px; border: 1px solid rgba(130,207,227,.22);
          border-radius: 13px; padding: 11px 13px; color: #f5fbff;
          background: rgba(4,16,27,.82); outline: none;
        }
        select option { color: #eaf7fb; background: #091b2a; }
        input:focus, select:focus {
          border-color: #70d8ef; box-shadow: 0 0 0 3px rgba(76,198,227,.13);
        }
        input::placeholder { color: #648091; }

        .results-meta {
          display: flex; justify-content: space-between; gap: 15px;
          align-items: center; padding: 18px 4px; color: #7f9cab; font-size: .82rem;
        }
        .results-meta button {
          border: 0; color: #92d5e5; background: transparent; cursor: pointer; font-weight: 850;
        }

        .registry-grid { display: grid; gap: 17px; }
        .registry-card {
          padding: 25px; border: 1px solid rgba(103,194,220,.17);
          border-radius: 24px;
          background: linear-gradient(145deg,rgba(14,38,55,.93),rgba(7,23,36,.9));
          box-shadow: 0 22px 56px rgba(0,0,0,.15);
        }
        .card-topline {
          display: flex; justify-content: space-between; gap: 14px; align-items: flex-start;
        }
        .card-topline > div { display: grid; gap: 5px; }
        .card-topline > div > span {
          color: #83d5e7; font-size: .72rem; font-weight: 950;
          letter-spacing: .08em; text-transform: uppercase;
        }
        .card-topline small { color: #678492; }

        .status-badge {
          border-radius: 999px; padding: 7px 9px; font-size: .64rem;
          font-weight: 950; letter-spacing: .07em; white-space: nowrap;
        }
        .status-badge.active { color: #8cebc3; background: rgba(45,163,113,.11); }
        .status-badge.under-review { color: #a7dcff; background: rgba(52,129,178,.11); }
        .status-badge.superseded { color: #ffe09a; background: rgba(184,131,27,.12); }
        .status-badge.withdrawn { color: #ffaca7; background: rgba(177,67,58,.12); }

        .registry-card h3 {
          margin: 22px 0 10px; font-size: 1.7rem; letter-spacing: -.025em;
        }
        .purpose { color: #a4bac4; line-height: 1.67; }

        .metadata {
          display: grid; grid-template-columns: repeat(4,minmax(0,1fr));
          gap: 9px; margin: 18px 0;
        }
        .metadata div {
          padding: 13px; border-radius: 13px; background: rgba(255,255,255,.025);
        }
        .metadata dt {
          color: #6f8c99; font-size: .67rem; font-weight: 900;
          letter-spacing: .07em; text-transform: uppercase;
        }
        .metadata dd {
          margin: 8px 0 0; color: #d6e8ee; font-size: .82rem; line-height: 1.45;
        }

        .detail-grid {
          display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px;
        }
        .detail-grid > div {
          padding: 16px; border-radius: 15px; background: rgba(255,255,255,.027);
        }
        .detail-grid > div > span {
          color: #79a8b6; font-size: .69rem; font-weight: 950;
          letter-spacing: .08em; text-transform: uppercase;
        }
        .detail-grid ul { margin: 10px 0 0; padding-left: 18px; color: #9fb5bf; line-height: 1.64; }

        .route-row { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 20px; }
        .route-row a {
          border: 1px solid rgba(120,202,224,.2); border-radius: 999px;
          padding: 11px 14px; color: #dff7fd; background: rgba(255,255,255,.025);
          font-size: .8rem; font-weight: 850; text-decoration: none;
        }

        .empty-state {
          margin-top: 18px; padding: 45px 24px;
          border: 1px dashed rgba(127,199,219,.22);
          border-radius: 22px; color: #849fab; text-align: center;
        }

        .lifecycle-chain {
          display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); gap: 10px;
        }
        .lifecycle-chain article, .connected-grid a {
          min-height: 235px; padding: 20px; border: 1px solid rgba(103,194,220,.15);
          border-radius: 19px; background: rgba(10,30,45,.72);
        }
        .lifecycle-chain article > span, .connected-grid a > span { color: #5ed0e9; font-size: .74rem; }
        .lifecycle-chain h3, .connected-grid h3 { margin: 48px 0 10px; font-size: 1.17rem; }
        .lifecycle-chain p, .connected-grid p { color: #94abb6; line-height: 1.58; }

        .connected-grid {
          display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: 11px;
        }
        .connected-grid a { text-decoration: none; }
        .connected-grid a:hover {
          border-color: rgba(103,194,220,.42); background: rgba(20,53,73,.78);
        }

        .final-cta {
          max-width: 960px; margin: 86px auto 0; padding: clamp(32px,5vw,60px);
          border: 1px solid rgba(117,205,228,.19); border-radius: 30px; text-align: center;
          background: radial-gradient(circle at top,rgba(56,173,205,.11),transparent 48%),
            rgba(10,30,46,.84);
        }
        .final-cta h2 {
          margin: 12px 0 17px; font-size: clamp(2rem,4vw,3.55rem); letter-spacing: -.04em;
        }
        .final-cta p { color: #aabec9; line-height: 1.77; }
        .centered { justify-content: center; }

        @keyframes drift {
          0%,100% { transform: translate3d(0,0,0) scale(.85); opacity: .4; }
          50% { transform: translate3d(20px,-24px,0) scale(1.35); opacity: 1; }
        }
        @keyframes pulse { 0%,100% { opacity: .2; } 50% { opacity: .82; } }

        @media (max-width: 1080px) {
          .summary-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .principle-grid, .record-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .lifecycle-chain { grid-template-columns: repeat(3,minmax(0,1fr)); }
          .connected-grid { grid-template-columns: repeat(3,minmax(0,1fr)); }
          .metadata { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }

        @media (max-width: 760px) {
          .filter-panel, .detail-grid, .connected-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 620px) {
          .content-shell { width: min(100% - 24px,1220px); padding-top: 22px; }
          .breadcrumbs { margin-bottom: 42px; }
          .summary-grid, .principle-grid, .record-grid, .metadata, .lifecycle-chain {
            grid-template-columns: 1fr;
          }
          .results-meta { align-items: flex-start; flex-direction: column; }
          .card-topline { flex-direction: column; }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(html) { scroll-behavior: auto; }
          .node, .orbit { animation: none; }
          .primary-button, .secondary-button { transition: none; }
        }
      `}</style>
    </main>
  );
}
