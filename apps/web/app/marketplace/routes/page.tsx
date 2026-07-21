// apps/web/app/marketplace/routes/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type RouteDomain =
  | 'AI Governance'
  | 'Environmental Integrity'
  | 'HVAC'
  | 'Finance'
  | 'Healthcare'
  | 'Public Sector'
  | 'Buildings';

type RouteStatus = 'AVAILABLE' | 'IN REVIEW' | 'LICENSED' | 'ARCHIVED';

type MarketplaceRoute = {
  id: string;
  title: string;
  creator: string;
  domain: RouteDomain;
  status: RouteStatus;
  classification: 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE' | 'PARTIAL';
  summary: string;
  intendedUse: string;
  consequence: string;
  inputs: string[];
  requiredEvidence: string[];
  outputs: string[];
  boundaries: string[];
  verification: {
    version: string;
    lastReviewed: string;
    replayState: string;
    receiptState: string;
  };
  commercialModel: string;
  demonstrationPrice: string;
};

const MARKETPLACE_ROUTES = {
  home: '/marketplace',
  opportunities: '/marketplace/opportunities',
  professionals: '/marketplace/professionals',
  governedRecords: '/marketplace/governed-records',
  postNeed: '/marketplace/post-a-need',
} as const;

const ROUTES: MarketplaceRoute[] = [
  {
    id: 'TA-14-ROUTE-001',
    title: 'AI Hiring High-Risk Applicability Route',
    creator: 'Marlowe Governance Studio',
    domain: 'AI Governance',
    status: 'AVAILABLE',
    classification: 'PARTIAL',
    summary:
      'A reusable governance route for evaluating whether an AI-assisted hiring system is likely to fall within an EU AI Act high-risk pathway and what evidence must be assembled next.',
    intendedUse:
      'For providers, deployers, reviewers, and governance teams assessing AI systems that rank, screen, recommend, or influence access to employment.',
    consequence:
      'The route may influence whether deployment proceeds, pauses, escalates for legal review, or requires additional evidence before use.',
    inputs: [
      'Intended-purpose statement',
      'System workflow',
      'Provider and deployer role declarations',
      'Affected-person description',
      'Decision influence map',
      'Existing technical documentation',
    ],
    requiredEvidence: [
      'System identity and version',
      'Declared employment use',
      'Human-review procedure',
      'Risk-management record',
      'Data-governance record',
      'Logging and monitoring design',
    ],
    outputs: [
      'Applicability pathway',
      'Role allocation map',
      'Evidence-gap report',
      'Human-oversight review',
      'Route classification',
      'Preserved review record',
    ],
    boundaries: [
      'Not legal advice.',
      'Not a conformity assessment.',
      'Does not certify compliance.',
      'Does not replace a competent authority determination.',
    ],
    verification: {
      version: 'v1.2.0',
      lastReviewed: 'July 18, 2026',
      replayState: 'Replay demonstrated',
      receiptState: 'Receipt schema available',
    },
    commercialModel: 'Single-scope license',
    demonstrationPrice: '$750 demonstration price',
  },
  {
    id: 'TA-14-ROUTE-002',
    title: 'Building Atmospheric Record Interpretation Route',
    creator: 'Continuity Evidence Lab',
    domain: 'Environmental Integrity',
    status: 'AVAILABLE',
    classification: 'HOLD',
    summary:
      'A bounded route for receiving a building atmospheric record package, checking continuity and evidence identity, and producing a governed interpretation record.',
    intendedUse:
      'For schools, offices, hospitals, laboratories, and other buildings seeking a daily interpretation layer over preserved atmospheric records.',
    consequence:
      'The interpretation may inform whether additional investigation, maintenance review, or separately authorized diagnostic work is justified.',
    inputs: [
      'Atmospheric record package',
      'Instrument identity',
      'Contributor identity',
      'Building and zone identity',
      'Declared thresholds',
      'Outdoor reference conditions',
    ],
    requiredEvidence: [
      'Timestamp continuity',
      'Calibration evidence',
      'Sensor placement record',
      'Occupancy context',
      'HVAC operating state',
      'Missing-data declaration',
    ],
    outputs: [
      'Continuity assessment',
      'Admissibility state',
      'Governed interpretation record',
      'Evidence-gap report',
      'Declared limitations',
      'Post-intervention comparison pathway',
    ],
    boundaries: [
      'Interpretation is not diagnosis.',
      'No medical conclusion is produced.',
      'Optimization is a separate scope.',
      'Missing evidence remains visible.',
    ],
    verification: {
      version: 'v1.0.3',
      lastReviewed: 'July 17, 2026',
      replayState: 'Replay partially demonstrated',
      receiptState: 'Receipt schema draft',
    },
    commercialModel: 'Per-record route license',
    demonstrationPrice: '$450 demonstration price',
  },
  {
    id: 'TA-14-ROUTE-003',
    title: 'Vendor Payment Authority Route',
    creator: 'TA-14 Demonstration Lab',
    domain: 'Finance',
    status: 'IN REVIEW',
    classification: 'HOLD',
    summary:
      'A consequential payment route that checks authority, beneficiary identity, amount, scope, proposal freshness, and state consistency before release.',
    intendedUse:
      'For finance teams, procurement systems, and AI agents proposing or executing vendor payments.',
    consequence:
      'The route determines whether a proposed payment receives standing to bind and proceed toward execution.',
    inputs: [
      'Payment proposal',
      'Vendor identity',
      'Beneficiary account',
      'Procurement authority',
      'Finance authority',
      'Current system state',
    ],
    requiredEvidence: [
      'Current authority records',
      'Beneficiary verification',
      'Invoice identity',
      'Amount and currency',
      'Proposal expiry',
      'Route integrity record',
    ],
    outputs: [
      'ALLOW, HOLD, DENY, or ESCALATE classification',
      'Reason codes',
      'Evidence-gap list',
      'Verification receipt',
      'Replay package',
    ],
    boundaries: [
      'Does not move funds.',
      'Does not create authority.',
      'Does not verify bank ownership without connected evidence.',
      'HOLD remains non-execution.',
    ],
    verification: {
      version: 'v0.9.0',
      lastReviewed: 'July 19, 2026',
      replayState: 'Replay demonstrated',
      receiptState: 'Receipt demonstrated',
    },
    commercialModel: 'Enterprise evaluation',
    demonstrationPrice: 'Contact for demonstration scope',
  },
];

const domains: Array<'All' | RouteDomain> = [
  'All',
  'AI Governance',
  'Environmental Integrity',
  'HVAC',
  'Finance',
  'Healthcare',
  'Public Sector',
  'Buildings',
];

function classNameForClassification(classification: MarketplaceRoute['classification']) {
  return `classification-${classification.toLowerCase()}`;
}

function classNameForStatus(status: RouteStatus) {
  return `status-${status.toLowerCase().replaceAll(' ', '-')}`;
}

export default function RouteMarketplacePage() {
  const [domain, setDomain] = useState<(typeof domains)[number]>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<MarketplaceRoute>(ROUTES[0]);
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredRoutes = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return ROUTES.filter((route) => {
      const domainMatch = domain === 'All' || route.domain === domain;
      const queryMatch =
        !normalized ||
        [
          route.title,
          route.creator,
          route.domain,
          route.summary,
          route.intendedUse,
          route.classification,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalized);

      return domainMatch && queryMatch;
    });
  }, [domain, query]);

  const openRoute = (route: MarketplaceRoute) => {
    setSelected(route);
    setLicenseOpen(false);
    setSubmitted(false);
    window.scrollTo({ top: 560, behavior: 'smooth' });
  };

  const createLicensePreview = () => {
    setSubmitted(true);
    setLicenseOpen(false);
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
          <span>Route Marketplace</span>
        </nav>

        {submitted ? (
          <section className="submission-panel" aria-live="polite">
            <span className="eyebrow">DEMONSTRATION LICENSE REQUEST CREATED</span>
            <h1>Your route-license preview has been created.</h1>
            <p>
              No license was granted, no payment was processed, no route package was transferred,
              and no right to execute was created. This front-end demonstration shows the bounded
              commercial request that a future Marketplace workflow should preserve.
            </p>
            <div className="action-row">
              <button className="primary-button" type="button" onClick={() => setSubmitted(false)}>
                Return to Route Marketplace
              </button>
              <Link className="secondary-button" href={MARKETPLACE_ROUTES.opportunities}>
                Browse opportunities
              </Link>
            </div>
          </section>
        ) : (
          <>
            <header className="hero">
              <span className="eyebrow">TA-14 Collaborative Governance Marketplace</span>
              <h1>Route Marketplace</h1>
              <p className="hero-copy">
                Discover bounded governance routes that declare their intended use, evidence
                requirements, outputs, verification state, limitations, and commercial model before
                anyone relies on them.
              </p>

              <div className="boundary-banner">
                <strong>A route is not authority.</strong>
                <p>
                  Licensing, reviewing, or inspecting a route does not create evidence, satisfy
                  missing requirements, authorize execution, or certify an outcome.
                </p>
              </div>

              <div className="action-row">
                <Link className="primary-button" href={MARKETPLACE_ROUTES.postNeed}>
                  Request a custom route
                </Link>
                <Link className="secondary-button" href={MARKETPLACE_ROUTES.professionals}>
                  Find a route designer
                </Link>
              </div>
            </header>

            <section className="route-sequence" aria-label="Governance route sequence">
              {[
                'Reality',
                'Record',
                'Continuity',
                'Admissibility',
                'Binding',
                'Commit',
                'Execution',
                'Outcome',
              ].map((step, index) => (
                <article key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{step}</strong>
                </article>
              ))}
            </section>

            <section className="explorer">
              <div className="filter-panel">
                <div className="filter-heading">
                  <span className="eyebrow">ROUTE EXPLORER</span>
                  <h2>Browse governed routes</h2>
                </div>

                <label>
                  Search routes
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search title, creator, domain, use, or classification"
                  />
                </label>

                <div className="domain-row" aria-label="Route domain filters">
                  {domains.map((item) => (
                    <button
                      className={domain === item ? 'domain-button selected' : 'domain-button'}
                      key={item}
                      type="button"
                      onClick={() => setDomain(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="results-meta">
                <span>{filteredRoutes.length} demonstration route(s)</span>
                <span>No route package, payment, or license backend is connected.</span>
              </div>

              <div className="route-grid">
                {filteredRoutes.map((route) => (
                  <article className="route-card" key={route.id}>
                    <div className="route-topline">
                      <span className={`status-badge ${classNameForStatus(route.status)}`}>
                        {route.status}
                      </span>
                      <span
                        className={`classification-badge ${classNameForClassification(
                          route.classification,
                        )}`}
                      >
                        {route.classification}
                      </span>
                    </div>

                    <span className="route-id">{route.id}</span>
                    <h2>{route.title}</h2>
                    <p className="creator">{route.creator}</p>
                    <p>{route.summary}</p>

                    <div className="route-facts">
                      <div>
                        <span>Domain</span>
                        <strong>{route.domain}</strong>
                      </div>
                      <div>
                        <span>Version</span>
                        <strong>{route.verification.version}</strong>
                      </div>
                      <div>
                        <span>Commercial model</span>
                        <strong>{route.commercialModel}</strong>
                      </div>
                      <div>
                        <span>Price</span>
                        <strong>{route.demonstrationPrice}</strong>
                      </div>
                    </div>

                    <button className="card-button" type="button" onClick={() => openRoute(route)}>
                      Open route workspace
                    </button>
                  </article>
                ))}
              </div>

              {filteredRoutes.length === 0 && (
                <div className="empty-state">
                  <h2>No demonstration routes match those filters.</h2>
                  <p>Clear the search or select another route domain.</p>
                </div>
              )}
            </section>

            <section className="workspace">
              <div className="workspace-header">
                <div>
                  <span className="eyebrow">SELECTED GOVERNANCE ROUTE</span>
                  <h2>{selected.title}</h2>
                  <p>{selected.creator}</p>
                </div>

                <div className="workspace-badges">
                  <span className={`status-badge ${classNameForStatus(selected.status)}`}>
                    {selected.status}
                  </span>
                  <span
                    className={`classification-badge ${classNameForClassification(
                      selected.classification,
                    )}`}
                  >
                    {selected.classification}
                  </span>
                </div>
              </div>

              <div className="workspace-layout">
                <div className="workspace-main">
                  <section className="detail-card">
                    <div className="section-heading">
                      <span>01</span>
                      <div>
                        <h3>Intended use</h3>
                        <p>The declared problem and environment this route was designed for.</p>
                      </div>
                    </div>
                    <p className="body-copy">{selected.intendedUse}</p>
                  </section>

                  <section className="detail-card">
                    <div className="section-heading">
                      <span>02</span>
                      <div>
                        <h3>Consequential effect</h3>
                        <p>What the route may influence if someone relies on it.</p>
                      </div>
                    </div>
                    <p className="body-copy">{selected.consequence}</p>
                  </section>

                  <section className="detail-card">
                    <div className="section-heading">
                      <span>03</span>
                      <div>
                        <h3>Inputs and required evidence</h3>
                        <p>Route inputs and evidentiary requirements remain distinct.</p>
                      </div>
                    </div>

                    <div className="dual-grid">
                      <div className="evidence-panel inputs">
                        <h3>Declared inputs</h3>
                        <ul>
                          {selected.inputs.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="evidence-panel required">
                        <h3>Required evidence</h3>
                        <ul>
                          {selected.requiredEvidence.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section className="detail-card">
                    <div className="section-heading">
                      <span>04</span>
                      <div>
                        <h3>Outputs</h3>
                        <p>Artifacts the route is designed to produce when properly supplied.</p>
                      </div>
                    </div>

                    <div className="item-grid">
                      {selected.outputs.map((item) => (
                        <article key={item}>
                          <span>✓</span>
                          <strong>{item}</strong>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="detail-card">
                    <div className="section-heading">
                      <span>05</span>
                      <div>
                        <h3>Verification state</h3>
                        <p>Version, review, replay, and receipt claims remain inspectable.</p>
                      </div>
                    </div>

                    <div className="verification-grid">
                      <article>
                        <span>Version</span>
                        <strong>{selected.verification.version}</strong>
                      </article>
                      <article>
                        <span>Last reviewed</span>
                        <strong>{selected.verification.lastReviewed}</strong>
                      </article>
                      <article>
                        <span>Replay</span>
                        <strong>{selected.verification.replayState}</strong>
                      </article>
                      <article>
                        <span>Receipt</span>
                        <strong>{selected.verification.receiptState}</strong>
                      </article>
                    </div>
                  </section>

                  <section className="detail-card">
                    <div className="section-heading">
                      <span>06</span>
                      <div>
                        <h3>Declared boundaries</h3>
                        <p>What this route does not establish or authorize.</p>
                      </div>
                    </div>

                    <div className="boundary-list">
                      {selected.boundaries.map((boundary) => (
                        <article key={boundary}>
                          <span>BOUNDARY</span>
                          <p>{boundary}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>

                <aside className="workspace-sidebar">
                  <section className="sidebar-card sticky-card">
                    <span className="eyebrow">ROUTE RECORD</span>
                    <dl>
                      <div>
                        <dt>Route ID</dt>
                        <dd>{selected.id}</dd>
                      </div>
                      <div>
                        <dt>Domain</dt>
                        <dd>{selected.domain}</dd>
                      </div>
                      <div>
                        <dt>Classification</dt>
                        <dd>{selected.classification}</dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd>{selected.status}</dd>
                      </div>
                      <div>
                        <dt>Commercial model</dt>
                        <dd>{selected.commercialModel}</dd>
                      </div>
                      <div>
                        <dt>Demonstration price</dt>
                        <dd>{selected.demonstrationPrice}</dd>
                      </div>
                    </dl>

                    <button
                      className="primary-button full-width"
                      type="button"
                      onClick={() => setLicenseOpen(true)}
                    >
                      Request route license
                    </button>

                    <div className="license-boundary">
                      <strong>License boundary</strong>
                      <p>
                        A future license may grant access or use rights. It must not create
                        authority, evidence, certification, or execution standing.
                      </p>
                    </div>
                  </section>
                </aside>
              </div>
            </section>

            {licenseOpen && (
              <section className="license-panel">
                <div className="license-heading">
                  <div>
                    <span className="eyebrow">DEMONSTRATION LICENSE REQUEST</span>
                    <h2>Request access to {selected.id}</h2>
                  </div>
                  <button
                    className="close-button"
                    type="button"
                    onClick={() => setLicenseOpen(false)}
                    aria-label="Close license panel"
                  >
                    ×
                  </button>
                </div>

                <div className="form-grid">
                  <label>
                    Requesting organization
                    <input placeholder="Organization name" />
                  </label>

                  <label>
                    Intended deployment or review context
                    <textarea
                      rows={5}
                      placeholder="Describe the environment, consequential action, users, affected parties, and intended purpose."
                    />
                  </label>

                  <label>
                    Requested rights
                    <textarea
                      rows={4}
                      placeholder="State whether you seek inspection, evaluation, internal use, limited deployment, adaptation, or another bounded right."
                    />
                  </label>

                  <label>
                    Evidence and integration readiness
                    <textarea
                      rows={4}
                      placeholder="Describe the evidence, data, systems, reviewers, and controls available to support the route."
                    />
                  </label>

                  <label>
                    Known limitations or conflicts
                    <textarea
                      rows={4}
                      placeholder="Declare unresolved authority, evidence, jurisdiction, technical, commercial, or independence issues."
                    />
                  </label>

                  <div className="license-boundary">
                    <strong>Demonstration boundary</strong>
                    <p>
                      This preview does not grant a license, process payment, transfer intellectual
                      property, approve deployment, or authorize execution.
                    </p>
                  </div>

                  <button className="primary-button" type="button" onClick={createLicensePreview}>
                    Create license-request preview
                  </button>
                </div>
              </section>
            )}

            <section className="final-cta">
              <span className="eyebrow">OTHERS REVIEW SLIVERS. TA-14 REVIEWS THE ROUTE.</span>
              <h2>Reusable governance only works when every boundary travels with the route.</h2>
              <p>
                The future Route Marketplace should preserve route identity, version, creator,
                intended use, evidence requirements, review history, license scope, modifications,
                receipts, replay, and final outcomes.
              </p>
              <div className="action-row centered-actions">
                <Link className="primary-button" href={MARKETPLACE_ROUTES.postNeed}>
                  Request a custom route
                </Link>
                <Link className="secondary-button" href={MARKETPLACE_ROUTES.professionals}>
                  Find a route professional
                </Link>
              </div>
            </section>
          </>
        )}
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

        .breadcrumbs a:hover {
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
          max-width: 970px;
          padding-bottom: 54px;
        }

        h1 {
          margin: 18px 0 22px;
          font-size: clamp(3rem, 7vw, 6.5rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .hero-copy,
        .body-copy {
          color: #b8ced9;
          font-size: 1.09rem;
          line-height: 1.78;
        }

        .hero-copy {
          max-width: 830px;
        }

        .boundary-banner,
        .license-boundary {
          margin-top: 26px;
          border-left: 3px solid #dfba58;
          border-radius: 0 15px 15px 0;
          padding: 18px 20px;
          background: rgba(205, 152, 31, 0.075);
        }

        .boundary-banner p,
        .license-boundary p {
          margin: 7px 0 0;
          color: #c4b88e;
          line-height: 1.65;
        }

        .action-row,
        .workspace-header,
        .license-heading {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .action-row {
          margin-top: 30px;
        }

        .primary-button,
        .secondary-button {
          border-radius: 999px;
          padding: 14px 21px;
          font-weight: 900;
          text-decoration: none;
          transition:
            transform 180ms ease,
            border-color 180ms ease;
          cursor: pointer;
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

        .route-sequence {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 9px;
          padding: 10px 0 70px;
        }

        .route-sequence article {
          min-height: 112px;
          padding: 15px;
          border: 1px solid rgba(103, 194, 218, 0.15);
          border-radius: 17px;
          background: rgba(9, 29, 44, 0.7);
        }

        .route-sequence span {
          display: block;
          margin-bottom: 33px;
          color: #57cee9;
          font-size: 0.73rem;
        }

        .route-sequence strong {
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .explorer {
          padding-bottom: 70px;
        }

        .filter-panel,
        .workspace,
        .license-panel,
        .submission-panel {
          border: 1px solid rgba(103, 194, 220, 0.18);
          border-radius: 28px;
          background:
            linear-gradient(145deg, rgba(14, 38, 55, 0.94), rgba(7, 23, 36, 0.91));
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.18);
        }

        .filter-panel {
          padding: clamp(24px, 4vw, 40px);
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

        input,
        textarea {
          width: 100%;
          display: block;
          margin-top: 9px;
          padding: 14px 15px;
          border: 1px solid rgba(130, 207, 227, 0.22);
          border-radius: 14px;
          color: #f5fbff;
          background: rgba(4, 16, 27, 0.78);
          outline: none;
          resize: vertical;
        }

        input:focus,
        textarea:focus {
          border-color: #70d8ef;
          box-shadow: 0 0 0 3px rgba(76, 198, 227, 0.13);
        }

        input::placeholder,
        textarea::placeholder {
          color: #648091;
        }

        .domain-row {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 20px;
        }

        .domain-button {
          border: 1px solid rgba(123, 202, 224, 0.18);
          border-radius: 999px;
          padding: 10px 13px;
          color: #acd3df;
          background: rgba(255, 255, 255, 0.025);
          cursor: pointer;
        }

        .domain-button.selected {
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

        .route-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .route-card {
          padding: 25px;
          border: 1px solid rgba(103, 194, 220, 0.17);
          border-radius: 24px;
          background:
            linear-gradient(145deg, rgba(14, 38, 55, 0.93), rgba(7, 23, 36, 0.9));
          box-shadow: 0 22px 56px rgba(0, 0, 0, 0.15);
        }

        .route-topline,
        .workspace-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          align-items: center;
          justify-content: space-between;
        }

        .status-badge,
        .classification-badge {
          display: inline-flex;
          width: fit-content;
          border-radius: 999px;
          padding: 7px 9px;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .status-available {
          color: #89efc5;
          border: 1px solid rgba(74, 213, 156, 0.3);
          background: rgba(53, 163, 119, 0.1);
        }

        .status-in-review {
          color: #ffe29a;
          border: 1px solid rgba(228, 179, 54, 0.3);
          background: rgba(184, 131, 27, 0.1);
        }

        .status-licensed {
          color: #a6dcff;
          border: 1px solid rgba(86, 167, 220, 0.3);
          background: rgba(45, 118, 168, 0.1);
        }

        .status-archived {
          color: #bac4ca;
          border: 1px solid rgba(160, 174, 182, 0.25);
          background: rgba(107, 121, 129, 0.08);
        }

        .classification-allow {
          color: #89efc5;
          background: rgba(53, 163, 119, 0.11);
        }

        .classification-hold {
          color: #ffb0a7;
          background: rgba(181, 65, 52, 0.11);
        }

        .classification-deny {
          color: #ff9990;
          background: rgba(151, 42, 34, 0.15);
        }

        .classification-escalate,
        .classification-partial {
          color: #ffe29a;
          background: rgba(184, 131, 27, 0.11);
        }

        .route-id {
          display: block;
          margin-top: 24px;
          color: #70909f;
          font-size: 0.76rem;
        }

        .route-card h2 {
          margin: 10px 0 8px;
          font-size: 1.55rem;
          letter-spacing: -0.025em;
        }

        .creator {
          color: #ebcd78;
          font-weight: 800;
        }

        .route-card > p:not(.creator) {
          color: #a7bdc8;
          line-height: 1.68;
        }

        .route-facts {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 22px;
        }

        .route-facts div {
          min-height: 84px;
          padding: 13px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.028);
        }

        .route-facts span,
        .verification-grid span {
          display: block;
          margin-bottom: 7px;
          color: #7593a2;
          font-size: 0.69rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .route-facts strong {
          font-size: 0.86rem;
          line-height: 1.4;
        }

        .card-button {
          width: 100%;
          margin-top: 21px;
          border: 1px solid rgba(124, 209, 231, 0.27);
          border-radius: 999px;
          padding: 12px 15px;
          color: #dff8ff;
          background: rgba(64, 177, 207, 0.08);
          font-weight: 900;
          cursor: pointer;
        }

        .empty-state {
          padding: 50px 24px;
          border: 1px dashed rgba(127, 199, 219, 0.22);
          border-radius: 22px;
          text-align: center;
          color: #8fa9b5;
        }

        .workspace {
          padding: clamp(24px, 4vw, 42px);
        }

        .workspace-header {
          justify-content: space-between;
          padding-bottom: 26px;
          margin-bottom: 26px;
          border-bottom: 1px solid rgba(111, 197, 220, 0.14);
        }

        .workspace-header h2 {
          margin: 9px 0 8px;
          font-size: clamp(2rem, 4vw, 3.2rem);
          letter-spacing: -0.04em;
        }

        .workspace-header p {
          margin: 0;
          color: #e5c873;
          font-weight: 800;
        }

        .workspace-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 290px;
          gap: 22px;
          align-items: start;
        }

        .workspace-main {
          display: grid;
          gap: 16px;
        }

        .detail-card,
        .sidebar-card {
          padding: 24px;
          border: 1px solid rgba(103, 194, 220, 0.14);
          border-radius: 21px;
          background: rgba(255, 255, 255, 0.022);
        }

        .section-heading {
          display: flex;
          gap: 15px;
          align-items: flex-start;
          padding-bottom: 20px;
          margin-bottom: 21px;
          border-bottom: 1px solid rgba(111, 197, 220, 0.12);
        }

        .section-heading > span {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 40px;
          height: 40px;
          border-radius: 50%;
          color: #78dcf3;
          background: rgba(80, 199, 227, 0.11);
          font-weight: 900;
        }

        .section-heading h3 {
          margin: 2px 0 5px;
          font-size: 1.35rem;
        }

        .section-heading p {
          margin: 0;
          color: #8fa7b3;
          line-height: 1.5;
        }

        .dual-grid,
        .item-grid,
        .verification-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .evidence-panel {
          padding: 20px;
          border-radius: 18px;
        }

        .evidence-panel.inputs {
          border: 1px solid rgba(91, 174, 226, 0.2);
          background: rgba(50, 115, 163, 0.065);
        }

        .evidence-panel.required {
          border: 1px solid rgba(229, 170, 64, 0.22);
          background: rgba(177, 115, 23, 0.07);
        }

        .evidence-panel h3 {
          font-size: 1rem;
        }

        .evidence-panel ul {
          margin: 0;
          padding-left: 19px;
          color: #adc2cc;
          line-height: 1.72;
        }

        .item-grid article,
        .verification-grid article {
          min-height: 90px;
          padding: 16px;
          border: 1px solid rgba(113, 196, 219, 0.13);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.022);
        }

        .item-grid span {
          display: block;
          margin-bottom: 17px;
          color: #78e4bb;
          font-weight: 900;
        }

        .item-grid strong,
        .verification-grid strong {
          line-height: 1.42;
        }

        .boundary-list {
          display: grid;
          gap: 11px;
        }

        .boundary-list article {
          border-left: 3px solid #dfba58;
          border-radius: 0 15px 15px 0;
          padding: 17px 19px;
          background: rgba(205, 152, 31, 0.075);
        }

        .boundary-list span {
          color: #e4c46d;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .boundary-list p {
          margin: 8px 0 0;
          color: #c4b88e;
          line-height: 1.65;
        }

        .sticky-card {
          position: sticky;
          top: 22px;
        }

        dl {
          margin: 0;
        }

        dl div {
          padding: 12px 0;
          border-bottom: 1px solid rgba(111, 197, 220, 0.11);
        }

        dt {
          color: #7595a4;
          font-size: 0.69rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        dd {
          margin: 6px 0 0;
          color: #f0fbff;
          font-weight: 800;
          line-height: 1.45;
        }

        .full-width {
          width: 100%;
          margin-top: 21px;
        }

        .license-panel {
          margin-top: 24px;
          padding: clamp(24px, 4vw, 42px);
        }

        .license-heading {
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .license-heading h2 {
          margin: 8px 0 0;
          font-size: 2rem;
        }

        .close-button {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(139, 210, 230, 0.22);
          border-radius: 50%;
          color: #dff7ff;
          background: rgba(255, 255, 255, 0.035);
          font-size: 1.45rem;
          cursor: pointer;
        }

        .form-grid {
          display: grid;
          gap: 18px;
        }

        .submission-panel {
          max-width: 880px;
          margin: 20px auto;
          padding: clamp(35px, 6vw, 70px);
        }

        .submission-panel h1 {
          margin-top: 20px;
          font-size: clamp(2.6rem, 6vw, 5rem);
        }

        .submission-panel p {
          color: #aec2cc;
          line-height: 1.75;
          font-size: 1.08rem;
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
          .route-sequence {
            grid-template-columns: repeat(4, 1fr);
          }

          .workspace-layout {
            grid-template-columns: 1fr;
          }

          .sticky-card {
            position: relative;
            top: 0;
          }
        }

        @media (max-width: 760px) {
          .route-grid,
          .dual-grid,
          .item-grid,
          .verification-grid {
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

          .route-sequence {
            grid-template-columns: repeat(2, 1fr);
          }

          .route-facts {
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
