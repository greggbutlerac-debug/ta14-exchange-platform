// apps/web/app/marketplace/opportunities/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type OpportunityStatus = 'OPEN' | 'REVIEWING' | 'MATCHED' | 'CLOSED';

type Opportunity = {
  id: string;
  title: string;
  requester: string;
  domain: string;
  status: OpportunityStatus;
  visibility: 'PUBLIC DEMONSTRATION' | 'PRIVATE DEMONSTRATION';
  summary: string;
  consequentialAction: string;
  deliverables: string[];
  evidenceAvailable: string[];
  evidenceMissing: string[];
  qualifications: string[];
  timeline: string;
  budget: string;
  deadline: string;
  posted: string;
};

const MARKETPLACE_ROUTES = {
  home: '/marketplace',
  postNeed: '/marketplace/post-a-need',
  professionals: '/marketplace/professionals',
  governedRecords: '/marketplace/governed-records',
  routes: '/marketplace/routes',
  dashboard: '/marketplace/dashboard',
} as const;

const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'TA-14-MKT-OPP-001',
    title: 'Independent review of an AI hiring governance route',
    requester: 'Northstar Workforce Systems',
    domain: 'AI Governance / Employment',
    status: 'OPEN',
    visibility: 'PUBLIC DEMONSTRATION',
    summary:
      'Independent bounded review requested for an AI-assisted hiring route covering applicability, evidence sufficiency, role allocation, human oversight, and escalation.',
    consequentialAction:
      'The route may influence whether the system proceeds toward deployment, remains on hold, or escalates for additional review.',
    deliverables: [
      'Applicability pathway review',
      'Evidence-gap report',
      'Human-oversight assessment',
      'Independent review record',
    ],
    evidenceAvailable: [
      'Intended-purpose statement',
      'System workflow',
      'Initial risk register',
      'Human-review policy',
    ],
    evidenceMissing: [
      'Complete role allocation',
      'Post-market monitoring design',
      'Current technical documentation package',
    ],
    qualifications: [
      'EU AI Act experience',
      'Employment-system review experience',
      'Independent evidence review',
    ],
    timeline: '21 days',
    budget: '$4,000-$8,000 demonstration range',
    deadline: 'August 15, 2026',
    posted: 'July 21, 2026',
  },
  {
    id: 'TA-14-MKT-OPP-002',
    title: 'Article 50 transparency evidence mapping',
    requester: 'Public Interest Media Lab',
    domain: 'AI Governance / Transparency',
    status: 'OPEN',
    visibility: 'PUBLIC DEMONSTRATION',
    summary:
      'A provider and deployer evidence map is needed for machine-readable marking, detectability, disclosure, notices, and record preservation.',
    consequentialAction:
      'The resulting map may guide implementation planning and internal compliance review before the applicable transparency duties begin.',
    deliverables: [
      'Provider-duty map',
      'Deployer-duty map',
      'Evidence requirements',
      'Alternative-measure gap analysis',
    ],
    evidenceAvailable: [
      'Product inventory',
      'Current disclosure language',
      'Content-generation workflow',
    ],
    evidenceMissing: [
      'Complete deployment-context inventory',
      'Machine-readable marking design',
      'Independent detectability testing',
    ],
    qualifications: [
      'AI transparency governance',
      'Provider and deployer role analysis',
      'Evidence mapping',
    ],
    timeline: '14 days',
    budget: '$2,500-$5,000 demonstration range',
    deadline: 'August 12, 2026',
    posted: 'July 20, 2026',
  },
  {
    id: 'TA-14-MKT-OPP-003',
    title: 'Hospital environmental record continuity review',
    requester: 'Clinical Facilities Demonstration Network',
    domain: 'Environmental Integrity / Healthcare',
    status: 'REVIEWING',
    visibility: 'PRIVATE DEMONSTRATION',
    summary:
      'A bounded continuity and interpretation review is requested for isolation-room pressure, temperature, humidity, alarm, and door-state records.',
    consequentialAction:
      'The review may inform whether further facilities investigation or separately authorized technical work is required.',
    deliverables: [
      'Chronology reconstruction',
      'Continuity-break report',
      'Threshold comparison',
      'Governed interpretation record',
    ],
    evidenceAvailable: [
      'BMS trend export',
      'Door-state logs',
      'Facilities response chronology',
    ],
    evidenceMissing: [
      'Verified calibration state',
      'Complete acknowledgement history',
      'Independent reference measurement',
    ],
    qualifications: [
      'Healthcare building systems',
      'Environmental record continuity',
      'Governed interpretation',
    ],
    timeline: '14 days',
    budget: '$4,000-$8,000 demonstration range',
    deadline: 'August 9, 2026',
    posted: 'July 20, 2026',
  },
  {
    id: 'TA-14-MKT-OPP-004',
    title: 'Vendor payment authority route challenge review',
    requester: 'Demonstration Procurement Network',
    domain: 'Financial Execution Integrity',
    status: 'OPEN',
    visibility: 'PUBLIC DEMONSTRATION',
    summary:
      'An independent challenge review is requested for a payment route currently returning HOLD because procurement authority and beneficiary identity remain unresolved.',
    consequentialAction:
      'The route may determine whether a proposed vendor payment receives standing to proceed toward execution.',
    deliverables: [
      'Challenge review record',
      'Authority-gap analysis',
      'Beneficiary-evidence review',
      'Corrective route recommendations',
    ],
    evidenceAvailable: [
      'Payment proposal',
      'Invoice record',
      'Vendor profile',
      'Initial route receipt',
    ],
    evidenceMissing: [
      'Current procurement authority',
      'Verified beneficiary-account ownership',
      'Fresh finance approval',
    ],
    qualifications: [
      'Financial controls',
      'Authority-chain review',
      'Governance route challenge',
    ],
    timeline: '10 days',
    budget: '$3,000-$6,000 demonstration range',
    deadline: 'August 18, 2026',
    posted: 'July 19, 2026',
  },
];

const domains = [
  'All',
  'AI Governance',
  'Environmental Integrity',
  'Financial Execution Integrity',
] as const;

function statusClass(status: OpportunityStatus) {
  return `status-${status.toLowerCase()}`;
}

export default function MarketplaceOpportunitiesPage() {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState<(typeof domains)[number]>('All');
  const [status, setStatus] = useState<'All' | OpportunityStatus>('All');

  const filteredOpportunities = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return OPPORTUNITIES.filter((opportunity) => {
      const queryMatch =
        !normalized ||
        [
          opportunity.id,
          opportunity.title,
          opportunity.requester,
          opportunity.domain,
          opportunity.summary,
          opportunity.consequentialAction,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalized);

      const domainMatch =
        domain === 'All' ||
        (domain === 'AI Governance' && opportunity.domain.startsWith('AI Governance')) ||
        (domain === 'Environmental Integrity' &&
          opportunity.domain.startsWith('Environmental Integrity')) ||
        opportunity.domain === domain;

      const statusMatch = status === 'All' || opportunity.status === status;

      return queryMatch && domainMatch && statusMatch;
    });
  }, [domain, query, status]);

  return (
    <main className="page-shell">
      <div className="cosmos" aria-hidden="true">
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="star star-four" />
        <span className="orbit orbit-one">
          <span />
        </span>
        <span className="orbit orbit-two">
          <span />
        </span>
        <span className="route-line route-one" />
        <span className="route-line route-two" />
      </div>

      <div className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href={MARKETPLACE_ROUTES.home}>Marketplace</Link>
          <span>/</span>
          <span>Opportunities</span>
        </nav>

        <header className="hero">
          <span className="eyebrow">TA-14 Collaborative Governance Marketplace</span>
          <h1>Governance Opportunities</h1>
          <p className="hero-copy">
            Browse bounded requests for independent review, route design, governed interpretation,
            evidence mapping, challenge review, and other consequential governance work.
          </p>

          <div className="boundary-banner">
            <strong>An opportunity is a declared need, not a verified engagement.</strong>
            <p>
              Listings do not establish requester identity, professional fit, authority, contract,
              payment, evidence sufficiency, or permission to access protected records.
            </p>
          </div>

          <div className="action-row">
            <Link className="primary-button" href={MARKETPLACE_ROUTES.postNeed}>
              Post a governance need
            </Link>
            <Link className="secondary-button" href={MARKETPLACE_ROUTES.professionals}>
              Browse professionals
            </Link>
            <Link className="text-link" href={MARKETPLACE_ROUTES.dashboard}>
              Open professional dashboard
            </Link>
          </div>
        </header>

        <section className="summary-grid" aria-label="Opportunity summary">
          <article>
            <span>Total demonstrations</span>
            <strong>{OPPORTUNITIES.length}</strong>
          </article>
          <article>
            <span>Open opportunities</span>
            <strong>{OPPORTUNITIES.filter((item) => item.status === 'OPEN').length}</strong>
          </article>
          <article>
            <span>Under review</span>
            <strong>{OPPORTUNITIES.filter((item) => item.status === 'REVIEWING').length}</strong>
          </article>
          <article>
            <span>AI governance</span>
            <strong>
              {OPPORTUNITIES.filter((item) => item.domain.startsWith('AI Governance')).length}
            </strong>
          </article>
          <article>
            <span>Environmental integrity</span>
            <strong>
              {
                OPPORTUNITIES.filter((item) =>
                  item.domain.startsWith('Environmental Integrity'),
                ).length
              }
            </strong>
          </article>
          <article>
            <span>Live backend</span>
            <strong>NOT CONNECTED</strong>
          </article>
        </section>

        <section className="filter-panel">
          <div className="filter-heading">
            <span className="eyebrow">OPPORTUNITY EXPLORER</span>
            <h2>Find work by need, domain, or state</h2>
          </div>

          <label>
            Search opportunities
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, requester, domain, consequence, or opportunity ID"
            />
          </label>

          <div className="filter-groups">
            <div>
              <span className="filter-label">Domain</span>
              <div className="filter-row">
                {domains.map((item) => (
                  <button
                    key={item}
                    className={domain === item ? 'filter-button selected' : 'filter-button'}
                    type="button"
                    onClick={() => setDomain(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="filter-label">Status</span>
              <div className="filter-row">
                {(['All', 'OPEN', 'REVIEWING', 'MATCHED', 'CLOSED'] as const).map((item) => (
                  <button
                    key={item}
                    className={status === item ? 'filter-button selected' : 'filter-button'}
                    type="button"
                    onClick={() => setStatus(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="results-meta">
          <span>{filteredOpportunities.length} opportunity demonstration(s)</span>
          <span>Every card opens a connected dynamic detail workspace.</span>
        </div>

        <section className="opportunity-grid">
          {filteredOpportunities.map((opportunity) => (
            <article className="opportunity-card" key={opportunity.id}>
              <div className="card-topline">
                <span className={`status-badge ${statusClass(opportunity.status)}`}>
                  {opportunity.status}
                </span>
                <span>{opportunity.visibility}</span>
              </div>

              <span className="opportunity-id">{opportunity.id}</span>
              <h2>{opportunity.title}</h2>
              <p className="requester">{opportunity.requester}</p>
              <p className="summary">{opportunity.summary}</p>

              <div className="consequence-box">
                <span>Consequential action</span>
                <p>{opportunity.consequentialAction}</p>
              </div>

              <div className="facts-grid">
                <div>
                  <span>Domain</span>
                  <strong>{opportunity.domain}</strong>
                </div>
                <div>
                  <span>Timeline</span>
                  <strong>{opportunity.timeline}</strong>
                </div>
                <div>
                  <span>Budget</span>
                  <strong>{opportunity.budget}</strong>
                </div>
                <div>
                  <span>Response deadline</span>
                  <strong>{opportunity.deadline}</strong>
                </div>
              </div>

              <div className="evidence-preview">
                <div>
                  <span>Available evidence</span>
                  <strong>{opportunity.evidenceAvailable.length} declared item(s)</strong>
                </div>
                <div>
                  <span>Missing evidence</span>
                  <strong>{opportunity.evidenceMissing.length} unresolved item(s)</strong>
                </div>
              </div>

              <div className="card-actions">
                <Link
                  className="card-primary"
                  href={`/marketplace/opportunities/${opportunity.id}`}
                >
                  Open opportunity
                </Link>
                <Link className="card-secondary" href={MARKETPLACE_ROUTES.professionals}>
                  Find a professional
                </Link>
              </div>
            </article>
          ))}
        </section>

        {filteredOpportunities.length === 0 && (
          <section className="empty-state">
            <h2>No demonstration opportunities match those filters.</h2>
            <p>Clear the search, select another domain, or choose another opportunity state.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setDomain('All');
                setStatus('All');
              }}
            >
              Reset filters
            </button>
          </section>
        )}

        <section className="pathway-section">
          <div className="section-intro">
            <span className="eyebrow">CONNECTED PATHWAYS</span>
            <h2>The opportunity listing is no longer a dead end.</h2>
            <p>
              Every primary action now leads to an existing Marketplace workspace. The listing page
              does not invent live application, messaging, payment, or matching capability.
            </p>
          </div>

          <div className="pathway-grid">
            <Link href={MARKETPLACE_ROUTES.postNeed}>
              <span>01</span>
              <h3>Post a governance need</h3>
              <p>Declare scope, evidence, consequence, timeline, and requested work.</p>
            </Link>
            <Link href={MARKETPLACE_ROUTES.professionals}>
              <span>02</span>
              <h3>Browse professionals</h3>
              <p>Review declared competence, records, routes, experience, and boundaries.</p>
            </Link>
            <Link href={MARKETPLACE_ROUTES.governedRecords}>
              <span>03</span>
              <h3>Governed record requests</h3>
              <p>Find record creation, continuity, interpretation, and comparison work.</p>
            </Link>
            <Link href={MARKETPLACE_ROUTES.routes}>
              <span>04</span>
              <h3>Route Marketplace</h3>
              <p>Inspect reusable routes with evidence requirements and declared limitations.</p>
            </Link>
            <Link href={MARKETPLACE_ROUTES.dashboard}>
              <span>05</span>
              <h3>Professional dashboard</h3>
              <p>Manage opportunity matches, responses, routes, records, and readiness.</p>
            </Link>
          </div>
        </section>

        <section className="final-cta">
          <span className="eyebrow">NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</span>
          <h2>Open the opportunity record before deciding whether the work is yours.</h2>
          <p>
            Each detail workspace exposes scope, requested deliverables, evidence available,
            evidence missing, qualifications, timeline, budget, visibility, and response
            boundaries before a professional creates a response preview.
          </p>

          <div className="action-row centered-actions">
            <Link className="primary-button" href={MARKETPLACE_ROUTES.postNeed}>
              Post a governance need
            </Link>
            <Link className="secondary-button" href={MARKETPLACE_ROUTES.dashboard}>
              Open professional dashboard
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #eef8ff;
          background: #06111d;
        }

        :global(a) {
          color: inherit;
        }

        button,
        input {
          font: inherit;
        }

        .page-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(rgba(4, 15, 26, 0.8), rgba(4, 15, 26, 0.97)),
            radial-gradient(circle at 15% 5%, rgba(21, 140, 181, 0.18), transparent 34%),
            radial-gradient(circle at 83% 7%, rgba(114, 70, 196, 0.14), transparent 31%);
        }

        .content-shell {
          width: min(1180px, calc(100% - 36px));
          margin: 0 auto;
          padding: 34px 0 96px;
          position: relative;
          z-index: 2;
        }

        .cosmos {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.72;
        }

        .star {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #e8fbff;
          box-shadow: 0 0 16px rgba(139, 229, 255, 0.95);
          animation: drift 13s ease-in-out infinite;
        }

        .star-one {
          top: 14%;
          left: 8%;
        }

        .star-two {
          top: 31%;
          right: 11%;
          animation-delay: -5s;
        }

        .star-three {
          bottom: 26%;
          left: 15%;
          animation-delay: -9s;
        }

        .star-four {
          bottom: 11%;
          right: 17%;
          animation-delay: -3s;
        }

        .orbit {
          position: absolute;
          width: 320px;
          height: 320px;
          border: 1px solid rgba(103, 205, 233, 0.12);
          border-radius: 50%;
          animation: rotate 32s linear infinite;
        }

        .orbit span {
          position: absolute;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #84e7fa;
          box-shadow: 0 0 20px rgba(99, 218, 242, 0.9);
          left: 50%;
          top: -5px;
        }

        .orbit-one {
          right: -165px;
          top: 5%;
        }

        .orbit-two {
          left: -185px;
          bottom: 12%;
          width: 390px;
          height: 390px;
          animation-direction: reverse;
        }

        .route-line {
          position: absolute;
          width: 42vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(78, 204, 233, 0.34), transparent);
          animation: pulse 7s ease-in-out infinite;
        }

        .route-one {
          top: 24%;
          left: -7%;
          transform: rotate(-18deg);
        }

        .route-two {
          right: -5%;
          bottom: 22%;
          transform: rotate(22deg);
          animation-delay: -3s;
        }

        .breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          color: #8eb4c5;
          font-size: 0.88rem;
          margin-bottom: 58px;
        }

        .breadcrumbs a {
          text-decoration: none;
        }

        .breadcrumbs a:hover,
        .text-link:hover {
          color: #ffffff;
        }

        .eyebrow {
          display: inline-block;
          color: #72d8ef;
          font-size: 0.75rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        .hero {
          max-width: 980px;
          padding-bottom: 54px;
        }

        h1 {
          margin: 18px 0 22px;
          font-size: clamp(3rem, 7vw, 6.5rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .hero-copy {
          max-width: 830px;
          color: #b8ced9;
          font-size: 1.1rem;
          line-height: 1.78;
        }

        .boundary-banner {
          margin-top: 26px;
          border-left: 3px solid #dfba58;
          border-radius: 0 15px 15px 0;
          padding: 18px 20px;
          background: rgba(205, 152, 31, 0.075);
        }

        .boundary-banner p {
          margin: 7px 0 0;
          color: #c4b88e;
          line-height: 1.65;
        }

        .action-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 30px;
        }

        .primary-button,
        .secondary-button {
          border-radius: 999px;
          padding: 14px 21px;
          font-weight: 900;
          text-decoration: none;
          transition: transform 180ms ease;
        }

        .primary-button {
          border: 1px solid #87e4f8;
          color: #031019;
          background: linear-gradient(135deg, #a5efff, #56cae7);
          box-shadow: 0 12px 34px rgba(60, 191, 222, 0.18);
        }

        .secondary-button {
          border: 1px solid rgba(147, 208, 227, 0.3);
          color: #eaf9ff;
          background: rgba(10, 29, 44, 0.82);
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-2px);
        }

        .text-link {
          color: #95cddd;
          font-weight: 800;
          text-decoration: none;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
          padding-bottom: 64px;
        }

        .summary-grid article {
          min-height: 115px;
          padding: 16px;
          border: 1px solid rgba(103, 194, 218, 0.15);
          border-radius: 18px;
          background: rgba(9, 29, 44, 0.72);
        }

        .summary-grid span {
          display: block;
          min-height: 38px;
          color: #789aaa;
          font-size: 0.72rem;
          line-height: 1.35;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .summary-grid strong {
          display: block;
          margin-top: 19px;
          font-size: 1.5rem;
        }

        .summary-grid article:last-child strong {
          color: #ffe09a;
          font-size: 0.78rem;
        }

        .filter-panel {
          padding: clamp(24px, 4vw, 40px);
          border: 1px solid rgba(103, 194, 220, 0.18);
          border-radius: 28px;
          background:
            linear-gradient(145deg, rgba(14, 38, 55, 0.94), rgba(7, 23, 36, 0.91));
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.18);
        }

        .filter-heading h2 {
          margin: 9px 0 25px;
          font-size: clamp(2rem, 4vw, 3.4rem);
          letter-spacing: -0.04em;
        }

        label {
          display: block;
          color: #edfaff;
          font-weight: 800;
        }

        input {
          width: 100%;
          display: block;
          margin-top: 9px;
          padding: 14px 15px;
          border: 1px solid rgba(130, 207, 227, 0.22);
          border-radius: 14px;
          color: #f5fbff;
          background: rgba(4, 16, 27, 0.78);
          outline: none;
        }

        input:focus {
          border-color: #70d8ef;
          box-shadow: 0 0 0 3px rgba(76, 198, 227, 0.13);
        }

        input::placeholder {
          color: #648091;
        }

        .filter-groups {
          display: grid;
          gap: 20px;
          margin-top: 22px;
        }

        .filter-label {
          display: block;
          margin-bottom: 9px;
          color: #7998a7;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .filter-button {
          border: 1px solid rgba(123, 202, 224, 0.18);
          border-radius: 999px;
          padding: 10px 13px;
          color: #acd3df;
          background: rgba(255, 255, 255, 0.025);
          cursor: pointer;
        }

        .filter-button.selected {
          border-color: #67d4eb;
          color: #031019;
          background: #77dff4;
          font-weight: 900;
        }

        .results-meta {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 4px;
          color: #7f9cab;
          font-size: 0.82rem;
        }

        .opportunity-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .opportunity-card {
          display: flex;
          flex-direction: column;
          padding: 25px;
          border: 1px solid rgba(103, 194, 220, 0.17);
          border-radius: 24px;
          background:
            linear-gradient(145deg, rgba(14, 38, 55, 0.93), rgba(7, 23, 36, 0.9));
          box-shadow: 0 22px 56px rgba(0, 0, 0, 0.15);
        }

        .card-topline {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          color: #7695a4;
          font-size: 0.68rem;
          letter-spacing: 0.07em;
        }

        .status-badge {
          display: inline-flex;
          width: fit-content;
          border-radius: 999px;
          padding: 7px 9px;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .status-open {
          color: #89efc5;
          border: 1px solid rgba(74, 213, 156, 0.3);
          background: rgba(53, 163, 119, 0.1);
        }

        .status-reviewing {
          color: #ffe29a;
          border: 1px solid rgba(228, 179, 54, 0.3);
          background: rgba(184, 131, 27, 0.1);
        }

        .status-matched {
          color: #a6dcff;
          border: 1px solid rgba(86, 167, 220, 0.3);
          background: rgba(45, 118, 168, 0.1);
        }

        .status-closed {
          color: #bac4ca;
          border: 1px solid rgba(160, 174, 182, 0.25);
          background: rgba(107, 121, 129, 0.08);
        }

        .opportunity-id {
          display: block;
          margin-top: 24px;
          color: #70909f;
          font-size: 0.76rem;
        }

        .opportunity-card h2 {
          margin: 10px 0 8px;
          font-size: 1.55rem;
          letter-spacing: -0.025em;
        }

        .requester {
          color: #ebcd78;
          font-weight: 800;
        }

        .summary {
          color: #a7bdc8;
          line-height: 1.68;
        }

        .consequence-box {
          margin-top: 12px;
          border-left: 3px solid #63cee8;
          border-radius: 0 14px 14px 0;
          padding: 15px 17px;
          background: rgba(59, 169, 198, 0.065);
        }

        .consequence-box span {
          color: #7fbbcb;
          font-size: 0.69rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .consequence-box p {
          margin: 8px 0 0;
          color: #adc3cd;
          line-height: 1.6;
        }

        .facts-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 20px;
        }

        .facts-grid div,
        .evidence-preview div {
          min-height: 84px;
          padding: 13px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.028);
        }

        .facts-grid span,
        .evidence-preview span {
          display: block;
          margin-bottom: 7px;
          color: #7593a2;
          font-size: 0.69rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .facts-grid strong,
        .evidence-preview strong {
          font-size: 0.86rem;
          line-height: 1.4;
        }

        .evidence-preview {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .evidence-preview div:first-child strong {
          color: #8de7c2;
        }

        .evidence-preview div:last-child strong {
          color: #f0ce7a;
        }

        .card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: auto;
          padding-top: 22px;
        }

        .card-primary,
        .card-secondary {
          border-radius: 999px;
          padding: 12px 16px;
          font-size: 0.86rem;
          font-weight: 900;
          text-decoration: none;
        }

        .card-primary {
          color: #04121a;
          background: #76dcef;
        }

        .card-secondary {
          border: 1px solid rgba(132, 203, 223, 0.25);
          color: #dff7ff;
          background: rgba(255, 255, 255, 0.025);
        }

        .empty-state {
          margin-top: 18px;
          padding: 48px 24px;
          border: 1px dashed rgba(127, 199, 219, 0.22);
          border-radius: 22px;
          text-align: center;
          color: #8fa9b5;
        }

        .empty-state button {
          margin-top: 13px;
          border: 1px solid rgba(126, 207, 228, 0.23);
          border-radius: 999px;
          padding: 11px 15px;
          color: #dff8ff;
          background: rgba(66, 178, 207, 0.07);
          font-weight: 800;
          cursor: pointer;
        }

        .pathway-section {
          padding-top: 82px;
        }

        .section-intro {
          max-width: 900px;
          margin-bottom: 28px;
        }

        .section-intro h2 {
          margin: 12px 0 15px;
          font-size: clamp(2.2rem, 5vw, 4.4rem);
          letter-spacing: -0.045em;
        }

        .section-intro p {
          color: #a8bdc7;
          line-height: 1.72;
        }

        .pathway-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 11px;
        }

        .pathway-grid a {
          min-height: 225px;
          padding: 20px;
          border: 1px solid rgba(103, 194, 220, 0.15);
          border-radius: 19px;
          background: rgba(10, 30, 45, 0.72);
          text-decoration: none;
        }

        .pathway-grid a > span {
          color: #5ed0e9;
          font-size: 0.75rem;
        }

        .pathway-grid h3 {
          margin: 42px 0 10px;
          font-size: 1.18rem;
        }

        .pathway-grid p {
          color: #95acb7;
          line-height: 1.58;
        }

        .pathway-grid a:hover {
          border-color: rgba(103, 194, 220, 0.42);
          background: rgba(20, 53, 73, 0.78);
        }

        .final-cta {
          max-width: 930px;
          margin: 80px auto 0;
          padding: clamp(32px, 5vw, 58px);
          border: 1px solid rgba(117, 205, 228, 0.19);
          border-radius: 30px;
          text-align: center;
          background:
            radial-gradient(circle at top, rgba(56, 173, 205, 0.11), transparent 48%),
            rgba(10, 30, 46, 0.84);
        }

        .final-cta h2 {
          margin: 12px 0 16px;
          font-size: clamp(2rem, 4vw, 3.5rem);
          letter-spacing: -0.035em;
        }

        .final-cta p {
          color: #aabec9;
          line-height: 1.75;
        }

        .centered-actions {
          justify-content: center;
        }

        @keyframes drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(0.9);
            opacity: 0.46;
          }
          50% {
            transform: translate3d(18px, -22px, 0) scale(1.35);
            opacity: 1;
          }
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.78;
          }
        }

        @media (max-width: 1080px) {
          .summary-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .pathway-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 780px) {
          .opportunity-grid,
          .pathway-grid {
            grid-template-columns: 1fr;
          }

          .results-meta {
            flex-direction: column;
          }
        }

        @media (max-width: 600px) {
          .content-shell {
            width: min(100% - 24px, 1180px);
            padding-top: 22px;
          }

          .breadcrumbs {
            margin-bottom: 42px;
          }

          .summary-grid,
          .facts-grid,
          .evidence-preview {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 430px) {
          .summary-grid,
          .facts-grid,
          .evidence-preview {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(html) {
            scroll-behavior: auto;
          }

          .star,
          .orbit,
          .route-line {
            animation: none;
          }

          .primary-button,
          .secondary-button {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
