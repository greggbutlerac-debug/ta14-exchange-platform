// apps/web/app/marketplace/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type DashboardTab = 'Overview' | 'Opportunities' | 'Responses' | 'Routes' | 'Records';

type Opportunity = {
  id: string;
  title: string;
  domain: string;
  requester: string;
  status: 'OPEN' | 'REVIEWING' | 'MATCHED';
  fit: 'STRONG' | 'POSSIBLE' | 'LIMITED';
  deadline: string;
};

type Response = {
  id: string;
  opportunity: string;
  submitted: string;
  status: 'DRAFT' | 'PREVIEWED' | 'UNDER REVIEW' | 'ACCEPTED' | 'DECLINED';
  scope: string;
};

type RouteRecord = {
  id: string;
  title: string;
  version: string;
  state: 'DRAFT' | 'IN REVIEW' | 'AVAILABLE';
  classification: 'ALLOW' | 'HOLD' | 'PARTIAL';
};

type GovernedRecord = {
  id: string;
  title: string;
  type: string;
  state: 'PRESERVED' | 'IN REVIEW' | 'HOLD';
  updated: string;
};

const MARKETPLACE_ROUTES = {
  home: '/marketplace',
  opportunities: '/marketplace/opportunities',
  professionals: '/marketplace/professionals',
  governedRecords: '/marketplace/governed-records',
  routes: '/marketplace/routes',
  postNeed: '/marketplace/post-a-need',
} as const;

const opportunities: Opportunity[] = [
  {
    id: 'TA-14-MKT-OPP-001',
    title: 'Independent review of an AI hiring governance route',
    domain: 'AI Governance / Employment',
    requester: 'Northstar Workforce Systems',
    status: 'OPEN',
    fit: 'STRONG',
    deadline: 'August 15, 2026',
  },
  {
    id: 'TA-14-GRR-001',
    title: 'School atmospheric record continuity and interpretation review',
    domain: 'Environmental Integrity',
    requester: 'Demonstration Public Facilities Group',
    status: 'OPEN',
    fit: 'POSSIBLE',
    deadline: 'August 10, 2026',
  },
  {
    id: 'TA-14-MKT-OPP-004',
    title: 'Vendor payment authority route challenge review',
    domain: 'Financial Execution Integrity',
    requester: 'Demonstration Procurement Network',
    status: 'REVIEWING',
    fit: 'LIMITED',
    deadline: 'August 18, 2026',
  },
];

const responses: Response[] = [
  {
    id: 'TA-14-RESP-001',
    opportunity: 'AI hiring governance route',
    submitted: 'July 21, 2026',
    status: 'PREVIEWED',
    scope: 'Applicability, evidence mapping, oversight, and bounded review.',
  },
  {
    id: 'TA-14-RESP-002',
    opportunity: 'Hospital environmental record review',
    submitted: 'July 20, 2026',
    status: 'DRAFT',
    scope: 'Continuity, threshold comparison, and interpretation boundary review.',
  },
];

const routes: RouteRecord[] = [
  {
    id: 'TA-14-ROUTE-101',
    title: 'Article 50 Transparency Review Route',
    version: 'v1.0.2',
    state: 'AVAILABLE',
    classification: 'ALLOW',
  },
  {
    id: 'TA-14-ROUTE-102',
    title: 'High-Risk Employment Applicability Route',
    version: 'v0.8.0',
    state: 'IN REVIEW',
    classification: 'PARTIAL',
  },
  {
    id: 'TA-14-ROUTE-103',
    title: 'Independent Review Intake Route',
    version: 'v0.4.1',
    state: 'DRAFT',
    classification: 'HOLD',
  },
];

const records: GovernedRecord[] = [
  {
    id: 'TA-14-GR-301',
    title: 'AI Hiring Independent Review Record',
    type: 'Independent Review Record',
    state: 'PRESERVED',
    updated: 'July 19, 2026',
  },
  {
    id: 'TA-14-GR-302',
    title: 'Article 50 Evidence Map',
    type: 'Requirement-to-Evidence Record',
    state: 'IN REVIEW',
    updated: 'July 18, 2026',
  },
  {
    id: 'TA-14-GR-303',
    title: 'Human Oversight Gap Record',
    type: 'Governance Gap Record',
    state: 'HOLD',
    updated: 'July 17, 2026',
  },
];

function badgeClass(value: string) {
  return value.toLowerCase().replaceAll(' ', '-');
}

export default function MarketplaceProfessionalDashboardPage() {
  const [tab, setTab] = useState<DashboardTab>('Overview');
  const [profileComplete, setProfileComplete] = useState(82);
  const [notice, setNotice] = useState<string | null>(null);

  const metrics = useMemo(
    () => [
      { label: 'Profile completeness', value: `${profileComplete}%` },
      { label: 'Matched opportunities', value: '3' },
      { label: 'Active responses', value: '2' },
      { label: 'Published routes', value: '1' },
      { label: 'Governed records', value: '3' },
      { label: 'Review readiness', value: 'PARTIAL' },
    ],
    [profileComplete],
  );

  const showNotice = (message: string) => {
    setNotice(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <span>Professional Dashboard</span>
        </nav>

        {notice && (
          <section className="notice-panel" aria-live="polite">
            <div>
              <span className="eyebrow">DEMONSTRATION ONLY</span>
              <h2>{notice}</h2>
              <p>
                No profile, response, route, record, payment, message, or marketplace state was
                persisted. This dashboard currently demonstrates front-end behavior only.
              </p>
            </div>
            <button type="button" onClick={() => setNotice(null)}>
              Dismiss
            </button>
          </section>
        )}

        <header className="hero">
          <div className="hero-heading">
            <div>
              <span className="eyebrow">TA-14 Collaborative Governance Marketplace</span>
              <h1>Professional Dashboard</h1>
              <p className="hero-copy">
                Manage your declared professional identity, opportunity responses, governance
                routes, governed records, review history, and visible boundaries from one
                evidence-centered workspace.
              </p>
            </div>

            <div className="identity-card">
              <span className="identity-mark">EM</span>
              <div>
                <strong>Dr. Elena Marlowe</strong>
                <span>Independent AI Governance Reviewer</span>
                <small>TA-14-PRO-001</small>
              </div>
            </div>
          </div>

          <div className="action-row">
            <Link className="primary-button" href="/marketplace/professionals/TA-14-PRO-001">
              View public profile
            </Link>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setProfileComplete(100);
                showNotice('Profile completion preview updated to 100%.');
              }}
            >
              Complete profile
            </button>
            <Link className="text-link" href={MARKETPLACE_ROUTES.opportunities}>
              Browse opportunities
            </Link>
          </div>
        </header>

        <section className="metrics-grid" aria-label="Professional dashboard metrics">
          {metrics.map((metric) => (
            <article key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </section>

        <section className="governance-boundary">
          <strong>A professional profile is a declaration, not universal authority.</strong>
          <p>
            Qualifications, portfolio items, routes, records, reviews, and metrics must remain
            inspectable and must never be presented as certification, licensing, legal authority,
            or guaranteed competence.
          </p>
        </section>

        <div className="dashboard-layout">
          <aside className="dashboard-nav">
            <span className="eyebrow">DASHBOARD SECTIONS</span>
            <div className="tab-list" role="tablist" aria-label="Professional dashboard sections">
              {(['Overview', 'Opportunities', 'Responses', 'Routes', 'Records'] as DashboardTab[]).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={tab === item}
                    className={tab === item ? 'active' : ''}
                    onClick={() => setTab(item)}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>

            <div className="quick-links">
              <span className="eyebrow">MARKETPLACE PATHWAYS</span>
              <Link href={MARKETPLACE_ROUTES.opportunities}>All opportunities</Link>
              <Link href={MARKETPLACE_ROUTES.governedRecords}>Governed record requests</Link>
              <Link href={MARKETPLACE_ROUTES.routes}>Route Marketplace</Link>
              <Link href={MARKETPLACE_ROUTES.postNeed}>Post a governance need</Link>
            </div>
          </aside>

          <div className="dashboard-content">
            {tab === 'Overview' && (
              <>
                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">READINESS</span>
                      <h2>Professional readiness state</h2>
                    </div>
                    <span className="state-badge state-partial">PARTIAL</span>
                  </div>

                  <div className="readiness-grid">
                    {[
                      ['Identity declaration', 'COMPLETE'],
                      ['Domain declarations', 'COMPLETE'],
                      ['Qualifications evidence', 'PARTIAL'],
                      ['Conflict disclosure', 'COMPLETE'],
                      ['Portfolio artifacts', 'PARTIAL'],
                      ['Payment readiness', 'NOT CONNECTED'],
                    ].map(([label, value]) => (
                      <article key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">RECOMMENDED NEXT ACTIONS</span>
                      <h2>Strengthen the professional record</h2>
                    </div>
                  </div>

                  <div className="action-grid">
                    <article>
                      <span>01</span>
                      <h3>Add qualification evidence</h3>
                      <p>Attach inspectable support for declared expertise and review experience.</p>
                      <button
                        type="button"
                        onClick={() => showNotice('Qualification evidence upload preview opened.')}
                      >
                        Add evidence
                      </button>
                    </article>
                    <article>
                      <span>02</span>
                      <h3>Publish a route artifact</h3>
                      <p>Move one reviewed route from draft or review into an available state.</p>
                      <button type="button" onClick={() => setTab('Routes')}>
                        Open routes
                      </button>
                    </article>
                    <article>
                      <span>03</span>
                      <h3>Preserve a review outcome</h3>
                      <p>Create an inspectable record showing scope, evidence, outcome, and limits.</p>
                      <button type="button" onClick={() => setTab('Records')}>
                        Open records
                      </button>
                    </article>
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">MATCHED WORK</span>
                      <h2>Current opportunity matches</h2>
                    </div>
                    <button className="small-button" type="button" onClick={() => setTab('Opportunities')}>
                      View all
                    </button>
                  </div>

                  <div className="compact-list">
                    {opportunities.slice(0, 2).map((opportunity) => (
                      <article key={opportunity.id}>
                        <div>
                          <span>{opportunity.id}</span>
                          <h3>{opportunity.title}</h3>
                          <p>{opportunity.requester}</p>
                        </div>
                        <span className={`fit-badge fit-${badgeClass(opportunity.fit)}`}>
                          {opportunity.fit} FIT
                        </span>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}

            {tab === 'Opportunities' && (
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">OPPORTUNITIES</span>
                    <h2>Matched and discoverable work</h2>
                  </div>
                  <Link className="small-button link-button" href={MARKETPLACE_ROUTES.opportunities}>
                    Browse marketplace
                  </Link>
                </div>

                <div className="table-list">
                  {opportunities.map((opportunity) => (
                    <article key={opportunity.id}>
                      <div className="record-main">
                        <span>{opportunity.id}</span>
                        <h3>{opportunity.title}</h3>
                        <p>
                          {opportunity.requester} · {opportunity.domain}
                        </p>
                      </div>
                      <div className="record-meta">
                        <span className={`fit-badge fit-${badgeClass(opportunity.fit)}`}>
                          {opportunity.fit} FIT
                        </span>
                        <span className={`state-badge state-${badgeClass(opportunity.status)}`}>
                          {opportunity.status}
                        </span>
                        <small>Deadline: {opportunity.deadline}</small>
                      </div>
                      <Link
                        className="row-button"
                        href={`/marketplace/opportunities/${opportunity.id}`}
                      >
                        Open
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {tab === 'Responses' && (
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">RESPONSES</span>
                    <h2>Draft and submitted response records</h2>
                  </div>
                  <button
                    className="small-button"
                    type="button"
                    onClick={() => showNotice('New response preview created.')}
                  >
                    New response
                  </button>
                </div>

                <div className="table-list">
                  {responses.map((response) => (
                    <article key={response.id}>
                      <div className="record-main">
                        <span>{response.id}</span>
                        <h3>{response.opportunity}</h3>
                        <p>{response.scope}</p>
                      </div>
                      <div className="record-meta">
                        <span className={`state-badge state-${badgeClass(response.status)}`}>
                          {response.status}
                        </span>
                        <small>{response.submitted}</small>
                      </div>
                      <button
                        className="row-button"
                        type="button"
                        onClick={() => showNotice(`${response.id} response preview opened.`)}
                      >
                        Open
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {tab === 'Routes' && (
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">ROUTES</span>
                    <h2>Professional governance routes</h2>
                  </div>
                  <button
                    className="small-button"
                    type="button"
                    onClick={() => showNotice('New route draft preview created.')}
                  >
                    Create route
                  </button>
                </div>

                <div className="table-list">
                  {routes.map((route) => (
                    <article key={route.id}>
                      <div className="record-main">
                        <span>{route.id}</span>
                        <h3>{route.title}</h3>
                        <p>Version {route.version}</p>
                      </div>
                      <div className="record-meta">
                        <span className={`state-badge state-${badgeClass(route.state)}`}>
                          {route.state}
                        </span>
                        <span
                          className={`classification-badge classification-${badgeClass(
                            route.classification,
                          )}`}
                        >
                          {route.classification}
                        </span>
                      </div>
                      <Link className="row-button" href={MARKETPLACE_ROUTES.routes}>
                        Open
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {tab === 'Records' && (
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">GOVERNED RECORDS</span>
                    <h2>Preserved professional work</h2>
                  </div>
                  <button
                    className="small-button"
                    type="button"
                    onClick={() => showNotice('New governed record preview created.')}
                  >
                    Create record
                  </button>
                </div>

                <div className="table-list">
                  {records.map((record) => (
                    <article key={record.id}>
                      <div className="record-main">
                        <span>{record.id}</span>
                        <h3>{record.title}</h3>
                        <p>{record.type}</p>
                      </div>
                      <div className="record-meta">
                        <span className={`state-badge state-${badgeClass(record.state)}`}>
                          {record.state}
                        </span>
                        <small>Updated {record.updated}</small>
                      </div>
                      <Link className="row-button" href={MARKETPLACE_ROUTES.governedRecords}>
                        Open
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <section className="final-cta">
          <span className="eyebrow">PROFESSIONAL REPUTATION SHOULD BE EVIDENCE-BACKED</span>
          <h2>Build trust from preserved work, declared boundaries, and inspectable outcomes.</h2>
          <p>
            A future live dashboard should connect authenticated profiles, account-scoped
            opportunities, governed responses, routes, records, review history, notifications,
            contracts, payments, and reputation evidence without overstating what has been verified.
          </p>
          <div className="action-row centered-actions">
            <Link className="primary-button" href={MARKETPLACE_ROUTES.opportunities}>
              Browse opportunities
            </Link>
            <Link className="secondary-button" href="/marketplace/professionals/TA-14-PRO-001">
              View professional profile
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
        input,
        textarea {
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
        .text-link:hover,
        .quick-links a:hover {
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

        .notice-panel {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
          padding: 24px;
          border: 1px solid rgba(111, 205, 229, 0.24);
          border-radius: 22px;
          background: rgba(12, 37, 54, 0.94);
        }

        .notice-panel h2 {
          margin: 8px 0 7px;
        }

        .notice-panel p {
          margin: 0;
          color: #a9bec8;
          line-height: 1.6;
        }

        .notice-panel button {
          align-self: flex-start;
          border: 1px solid rgba(143, 210, 229, 0.24);
          border-radius: 999px;
          padding: 10px 13px;
          color: #dff8ff;
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
        }

        .hero {
          padding-bottom: 46px;
        }

        .hero-heading {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 310px;
          gap: 32px;
          align-items: start;
        }

        h1 {
          margin: 18px 0 22px;
          font-size: clamp(3rem, 7vw, 6.2rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .hero-copy {
          max-width: 790px;
          color: #b8ced9;
          font-size: 1.08rem;
          line-height: 1.78;
        }

        .identity-card {
          display: flex;
          gap: 15px;
          align-items: center;
          padding: 20px;
          border: 1px solid rgba(220, 185, 85, 0.24);
          border-radius: 22px;
          background: rgba(70, 45, 8, 0.24);
        }

        .identity-mark {
          width: 68px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 68px;
          border-radius: 50%;
          color: #fff0b2;
          background: linear-gradient(145deg, #8d5d0c, #4c3005);
          font-size: 1.45rem;
          font-weight: 900;
        }

        .identity-card strong,
        .identity-card span,
        .identity-card small {
          display: block;
        }

        .identity-card span {
          margin-top: 5px;
          color: #d9c486;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .identity-card small {
          margin-top: 7px;
          color: #8fa5af;
        }

        .action-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 29px;
        }

        .primary-button,
        .secondary-button {
          border-radius: 999px;
          padding: 14px 21px;
          font-weight: 900;
          text-decoration: none;
          transition: transform 180ms ease;
          cursor: pointer;
        }

        .primary-button {
          border: 1px solid #87e4f8;
          color: #031019;
          background: linear-gradient(135deg, #a5efff, #56cae7);
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

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 20px;
        }

        .metrics-grid article {
          min-height: 115px;
          padding: 16px;
          border: 1px solid rgba(103, 194, 218, 0.15);
          border-radius: 18px;
          background: rgba(9, 29, 44, 0.72);
        }

        .metrics-grid span {
          display: block;
          min-height: 38px;
          color: #789aaa;
          font-size: 0.72rem;
          line-height: 1.35;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .metrics-grid strong {
          display: block;
          margin-top: 19px;
          font-size: 1.55rem;
        }

        .governance-boundary {
          margin-bottom: 34px;
          border-left: 3px solid #dfba58;
          border-radius: 0 15px 15px 0;
          padding: 18px 20px;
          background: rgba(205, 152, 31, 0.075);
        }

        .governance-boundary p {
          margin: 7px 0 0;
          color: #c4b88e;
          line-height: 1.65;
        }

        .dashboard-layout {
          display: grid;
          grid-template-columns: 230px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        .dashboard-nav,
        .panel {
          border: 1px solid rgba(103, 194, 220, 0.17);
          border-radius: 24px;
          background:
            linear-gradient(145deg, rgba(14, 38, 55, 0.93), rgba(7, 23, 36, 0.9));
        }

        .dashboard-nav {
          position: sticky;
          top: 20px;
          padding: 20px;
        }

        .tab-list,
        .quick-links {
          display: grid;
          gap: 7px;
        }

        .tab-list {
          margin-top: 15px;
        }

        .tab-list button {
          border: 1px solid transparent;
          border-radius: 13px;
          padding: 12px 13px;
          color: #9fc3cf;
          background: transparent;
          text-align: left;
          font-weight: 800;
          cursor: pointer;
        }

        .tab-list button.active {
          border-color: rgba(100, 204, 229, 0.26);
          color: #eafaff;
          background: rgba(70, 188, 216, 0.1);
        }

        .quick-links {
          margin-top: 28px;
          padding-top: 22px;
          border-top: 1px solid rgba(111, 197, 220, 0.12);
        }

        .quick-links a {
          color: #92b9c6;
          text-decoration: none;
          font-size: 0.86rem;
          line-height: 1.4;
        }

        .dashboard-content {
          display: grid;
          gap: 18px;
        }

        .panel {
          padding: clamp(22px, 4vw, 36px);
        }

        .panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding-bottom: 21px;
          margin-bottom: 23px;
          border-bottom: 1px solid rgba(111, 197, 220, 0.13);
        }

        .panel-heading h2 {
          margin: 8px 0 0;
          font-size: clamp(1.7rem, 3vw, 2.7rem);
          letter-spacing: -0.035em;
        }

        .state-badge,
        .fit-badge,
        .classification-badge {
          display: inline-flex;
          width: fit-content;
          border-radius: 999px;
          padding: 7px 9px;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.07em;
        }

        .state-partial,
        .state-under-review,
        .state-in-review,
        .state-previewed {
          color: #ffe29a;
          background: rgba(184, 131, 27, 0.11);
        }

        .state-open,
        .state-available,
        .state-preserved,
        .state-complete,
        .state-accepted {
          color: #89efc5;
          background: rgba(53, 163, 119, 0.11);
        }

        .state-draft,
        .state-not-connected {
          color: #a9c5d0;
          background: rgba(94, 119, 130, 0.11);
        }

        .state-hold,
        .state-declined {
          color: #ffb0a7;
          background: rgba(181, 65, 52, 0.11);
        }

        .fit-strong {
          color: #89efc5;
          background: rgba(53, 163, 119, 0.11);
        }

        .fit-possible {
          color: #ffe29a;
          background: rgba(184, 131, 27, 0.11);
        }

        .fit-limited {
          color: #ffb0a7;
          background: rgba(181, 65, 52, 0.11);
        }

        .classification-allow {
          color: #89efc5;
          background: rgba(53, 163, 119, 0.11);
        }

        .classification-hold {
          color: #ffb0a7;
          background: rgba(181, 65, 52, 0.11);
        }

        .classification-partial {
          color: #ffe29a;
          background: rgba(184, 131, 27, 0.11);
        }

        .readiness-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 11px;
        }

        .readiness-grid article {
          min-height: 90px;
          padding: 15px;
          border: 1px solid rgba(113, 196, 219, 0.13);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.022);
        }

        .readiness-grid span {
          display: block;
          color: #7e9ba9;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .readiness-grid strong {
          display: block;
          margin-top: 21px;
          font-size: 0.9rem;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .action-grid article {
          padding: 20px;
          border: 1px solid rgba(113, 196, 219, 0.14);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.023);
        }

        .action-grid > article > span {
          color: #61d0e9;
          font-size: 0.75rem;
        }

        .action-grid h3 {
          margin: 22px 0 10px;
        }

        .action-grid p {
          min-height: 67px;
          color: #9fb5c0;
          line-height: 1.55;
        }

        .action-grid button,
        .small-button,
        .row-button {
          border: 1px solid rgba(126, 207, 228, 0.23);
          border-radius: 999px;
          padding: 10px 13px;
          color: #dff8ff;
          background: rgba(66, 178, 207, 0.07);
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
        }

        .compact-list,
        .table-list {
          display: grid;
          gap: 11px;
        }

        .compact-list article,
        .table-list article {
          display: grid;
          align-items: center;
          gap: 15px;
          padding: 17px;
          border: 1px solid rgba(113, 196, 219, 0.13);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.022);
        }

        .compact-list article {
          grid-template-columns: minmax(0, 1fr) auto;
        }

        .table-list article {
          grid-template-columns: minmax(0, 1fr) auto auto;
        }

        .record-main > span,
        .compact-list article > div > span {
          color: #6f909f;
          font-size: 0.72rem;
        }

        .record-main h3,
        .compact-list h3 {
          margin: 7px 0 5px;
        }

        .record-main p,
        .compact-list p {
          margin: 0;
          color: #98afba;
          line-height: 1.5;
        }

        .record-meta {
          display: grid;
          justify-items: end;
          gap: 7px;
        }

        .record-meta small {
          color: #7894a1;
        }

        .link-button {
          display: inline-flex;
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

        @media (max-width: 1060px) {
          .metrics-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .hero-heading {
            grid-template-columns: 1fr;
          }

          .identity-card {
            max-width: 420px;
          }
        }

        @media (max-width: 900px) {
          .dashboard-layout {
            grid-template-columns: 1fr;
          }

          .dashboard-nav {
            position: relative;
            top: 0;
          }

          .tab-list {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }

          .tab-list button {
            text-align: center;
          }
        }

        @media (max-width: 760px) {
          .readiness-grid,
          .action-grid {
            grid-template-columns: 1fr;
          }

          .table-list article {
            grid-template-columns: 1fr;
          }

          .record-meta {
            justify-items: start;
          }

          .row-button {
            width: fit-content;
          }

          .notice-panel {
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

          .metrics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .tab-list {
            grid-template-columns: 1fr 1fr;
          }

          .compact-list article {
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
