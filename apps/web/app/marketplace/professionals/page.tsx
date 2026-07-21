// apps/web/app/marketplace/professionals/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type ProfessionalStatus = 'AVAILABLE' | 'LIMITED AVAILABILITY' | 'NOT ACCEPTING WORK';

type Professional = {
  id: string;
  name: string;
  title: string;
  organization: string;
  location: string;
  status: ProfessionalStatus;
  verificationState: 'DECLARED' | 'PARTIALLY EVIDENCED' | 'REVIEWED';
  summary: string;
  domains: string[];
  services: string[];
  qualifications: string[];
  evidenceSignals: string[];
  boundaries: string[];
  completedReviews: number;
  publishedRoutes: number;
  governedRecords: number;
  responseTime: string;
  availability: string;
};

const MARKETPLACE_ROUTES = {
  home: '/marketplace',
  opportunities: '/marketplace/opportunities',
  postNeed: '/marketplace/post-a-need',
  governedRecords: '/marketplace/governed-records',
  routes: '/marketplace/routes',
  dashboard: '/marketplace/dashboard',
} as const;

const PROFESSIONALS: Professional[] = [
  {
    id: 'TA-14-PRO-001',
    name: 'Dr. Elena Marlowe',
    title: 'Independent AI Governance Reviewer',
    organization: 'Marlowe Governance Studio',
    location: 'London, United Kingdom',
    status: 'AVAILABLE',
    verificationState: 'PARTIALLY EVIDENCED',
    summary:
      'Independent reviewer focused on AI governance applicability, evidence mapping, human oversight, high-risk pathways, and bounded review records.',
    domains: [
      'AI Governance',
      'Employment Systems',
      'EU AI Act',
      'Independent Review',
    ],
    services: [
      'Applicability review',
      'Evidence-gap analysis',
      'Human-oversight assessment',
      'Independent review records',
    ],
    qualifications: [
      'AI governance research',
      'Employment-system review',
      'Regulatory evidence mapping',
    ],
    evidenceSignals: [
      'Three published route artifacts',
      'Six preserved review records',
      'Declared conflict policy',
      'Visible review boundaries',
    ],
    boundaries: [
      'Not legal counsel',
      'Does not issue conformity assessments',
      'Does not certify compliance',
    ],
    completedReviews: 18,
    publishedRoutes: 3,
    governedRecords: 11,
    responseTime: 'Within 3 business days',
    availability: 'Accepting two review scopes',
  },
  {
    id: 'TA-14-PRO-002',
    name: 'Marcus Vale',
    title: 'Environmental Record Continuity Specialist',
    organization: 'Continuity Evidence Lab',
    location: 'Toronto, Canada',
    status: 'LIMITED AVAILABILITY',
    verificationState: 'DECLARED',
    summary:
      'Environmental record specialist working across atmospheric, building, HVAC, and healthcare records with emphasis on identity, chronology, continuity, and interpretation boundaries.',
    domains: [
      'Environmental Integrity',
      'Atmospheric Records',
      'Buildings',
      'HVAC',
    ],
    services: [
      'Record continuity review',
      'Evidence identity review',
      'Governed interpretation',
      'Post-intervention comparison',
    ],
    qualifications: [
      'Building systems analysis',
      'Sensor and instrument records',
      'Environmental chronology reconstruction',
    ],
    evidenceSignals: [
      'Two demonstration governed records',
      'One route artifact',
      'Declared instrument limitations',
      'Visible interpretation boundaries',
    ],
    boundaries: [
      'Interpretation is not diagnosis',
      'No medical conclusions',
      'Optimization requires separate authorization',
    ],
    completedReviews: 9,
    publishedRoutes: 1,
    governedRecords: 7,
    responseTime: 'Within 5 business days',
    availability: 'One limited scope available',
  },
  {
    id: 'TA-14-PRO-003',
    name: 'Amina Rahman',
    title: 'Financial Execution Integrity Reviewer',
    organization: 'Bounded Authority Partners',
    location: 'New York, United States',
    status: 'AVAILABLE',
    verificationState: 'REVIEWED',
    summary:
      'Reviewer focused on payment authority, procurement evidence, beneficiary identity, approval continuity, route challenge, and non-execution HOLD states.',
    domains: [
      'Financial Execution Integrity',
      'Procurement',
      'Payment Authority',
      'Challenge Review',
    ],
    services: [
      'Authority-chain review',
      'Beneficiary-evidence review',
      'Payment route challenge',
      'Corrective governance design',
    ],
    qualifications: [
      'Financial controls',
      'Procurement governance',
      'Execution-route review',
    ],
    evidenceSignals: [
      'Eight preserved challenge records',
      'Four reviewed route artifacts',
      'Declared independence policy',
      'Visible reason-code methodology',
    ],
    boundaries: [
      'Does not move funds',
      'Does not create authority',
      'Does not verify bank ownership without evidence',
    ],
    completedReviews: 22,
    publishedRoutes: 4,
    governedRecords: 14,
    responseTime: 'Within 2 business days',
    availability: 'Accepting one challenge review',
  },
  {
    id: 'TA-14-PRO-004',
    name: 'Dr. Rafael Chen',
    title: 'Healthcare Facilities Governance Reviewer',
    organization: 'Clinical Systems Evidence Group',
    location: 'Boston, United States',
    status: 'NOT ACCEPTING WORK',
    verificationState: 'PARTIALLY EVIDENCED',
    summary:
      'Healthcare facilities reviewer focused on isolation-room records, environmental continuity, BMS evidence, alarm history, and bounded facilities interpretation.',
    domains: [
      'Healthcare Facilities',
      'Environmental Records',
      'BMS',
      'Isolation Rooms',
    ],
    services: [
      'Hospital environmental review',
      'BMS chronology reconstruction',
      'Threshold comparison',
      'Evidence-gap reporting',
    ],
    qualifications: [
      'Healthcare building systems',
      'Pressure-control records',
      'Facilities event reconstruction',
    ],
    evidenceSignals: [
      'Five preserved review records',
      'Two hospital demonstration studies',
      'Declared clinical boundary',
      'Visible evidence dependencies',
    ],
    boundaries: [
      'No clinical diagnosis',
      'No infection-control determination',
      'No legal compliance certification',
    ],
    completedReviews: 13,
    publishedRoutes: 2,
    governedRecords: 10,
    responseTime: 'Not currently responding',
    availability: 'Waitlist only',
  },
];

const domainFilters = [
  'All',
  'AI Governance',
  'Environmental Integrity',
  'Financial Execution Integrity',
  'Healthcare Facilities',
] as const;

const availabilityFilters = [
  'All',
  'AVAILABLE',
  'LIMITED AVAILABILITY',
  'NOT ACCEPTING WORK',
] as const;

function statusClass(status: ProfessionalStatus) {
  return `status-${status.toLowerCase().replaceAll(' ', '-')}`;
}

function verificationClass(state: Professional['verificationState']) {
  return `verification-${state.toLowerCase().replaceAll(' ', '-')}`;
}

export default function MarketplaceProfessionalsPage() {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState<(typeof domainFilters)[number]>('All');
  const [availability, setAvailability] =
    useState<(typeof availabilityFilters)[number]>('All');

  const filteredProfessionals = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return PROFESSIONALS.filter((professional) => {
      const queryMatch =
        !normalized ||
        [
          professional.id,
          professional.name,
          professional.title,
          professional.organization,
          professional.location,
          professional.summary,
          ...professional.domains,
          ...professional.services,
          ...professional.qualifications,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalized);

      const domainMatch =
        domain === 'All' ||
        professional.domains.some((item) => item === domain || item.startsWith(domain));

      const availabilityMatch =
        availability === 'All' || professional.status === availability;

      return queryMatch && domainMatch && availabilityMatch;
    });
  }, [availability, domain, query]);

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
          <span>Professionals</span>
        </nav>

        <header className="hero">
          <span className="eyebrow">TA-14 Collaborative Governance Marketplace</span>
          <h1>Governance Professionals</h1>
          <p className="hero-copy">
            Discover professionals through declared expertise, inspectable work, route artifacts,
            governed records, review history, evidence signals, availability, and explicit
            limitations.
          </p>

          <div className="boundary-banner">
            <strong>A profile is a professional declaration, not universal authority.</strong>
            <p>
              Marketplace profiles do not independently establish identity, licensing,
              certification, legal authority, regulator acceptance, competence for every scope, or
              guaranteed performance.
            </p>
          </div>

          <div className="action-row">
            <Link className="primary-button" href={MARKETPLACE_ROUTES.opportunities}>
              Browse opportunities
            </Link>
            <Link className="secondary-button" href={MARKETPLACE_ROUTES.postNeed}>
              Post a governance need
            </Link>
            <Link className="text-link" href={MARKETPLACE_ROUTES.dashboard}>
              Open professional dashboard
            </Link>
          </div>
        </header>

        <section className="summary-grid" aria-label="Professional directory summary">
          <article>
            <span>Professional demonstrations</span>
            <strong>{PROFESSIONALS.length}</strong>
          </article>
          <article>
            <span>Available now</span>
            <strong>{PROFESSIONALS.filter((item) => item.status === 'AVAILABLE').length}</strong>
          </article>
          <article>
            <span>Completed reviews</span>
            <strong>{PROFESSIONALS.reduce((total, item) => total + item.completedReviews, 0)}</strong>
          </article>
          <article>
            <span>Published routes</span>
            <strong>{PROFESSIONALS.reduce((total, item) => total + item.publishedRoutes, 0)}</strong>
          </article>
          <article>
            <span>Governed records</span>
            <strong>{PROFESSIONALS.reduce((total, item) => total + item.governedRecords, 0)}</strong>
          </article>
          <article>
            <span>Identity verification</span>
            <strong>NOT CONNECTED</strong>
          </article>
        </section>

        <section className="filter-panel">
          <div className="filter-heading">
            <span className="eyebrow">PROFESSIONAL EXPLORER</span>
            <h2>Find expertise by domain, service, or availability</h2>
          </div>

          <label>
            Search professionals
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, organization, domain, service, qualification, or profile ID"
            />
          </label>

          <div className="filter-groups">
            <div>
              <span className="filter-label">Domain</span>
              <div className="filter-row">
                {domainFilters.map((item) => (
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
              <span className="filter-label">Availability</span>
              <div className="filter-row">
                {availabilityFilters.map((item) => (
                  <button
                    key={item}
                    className={
                      availability === item ? 'filter-button selected' : 'filter-button'
                    }
                    type="button"
                    onClick={() => setAvailability(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="results-meta">
          <span>{filteredProfessionals.length} professional demonstration(s)</span>
          <span>Every card opens a connected dynamic professional profile.</span>
        </div>

        <section className="professional-grid">
          {filteredProfessionals.map((professional) => (
            <article className="professional-card" key={professional.id}>
              <div className="card-topline">
                <span className={`status-badge ${statusClass(professional.status)}`}>
                  {professional.status}
                </span>
                <span
                  className={`verification-badge ${verificationClass(
                    professional.verificationState,
                  )}`}
                >
                  {professional.verificationState}
                </span>
              </div>

              <div className="identity-row">
                <span className="identity-mark">
                  {professional.name
                    .split(' ')
                    .filter((part) => !part.includes('.'))
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join('')}
                </span>

                <div>
                  <span className="professional-id">{professional.id}</span>
                  <h2>{professional.name}</h2>
                  <p className="title">{professional.title}</p>
                  <p className="organization">{professional.organization}</p>
                </div>
              </div>

              <p className="summary">{professional.summary}</p>

              <div className="tag-row">
                {professional.domains.slice(0, 4).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <div className="metrics-grid">
                <div>
                  <span>Completed reviews</span>
                  <strong>{professional.completedReviews}</strong>
                </div>
                <div>
                  <span>Published routes</span>
                  <strong>{professional.publishedRoutes}</strong>
                </div>
                <div>
                  <span>Governed records</span>
                  <strong>{professional.governedRecords}</strong>
                </div>
                <div>
                  <span>Response time</span>
                  <strong>{professional.responseTime}</strong>
                </div>
              </div>

              <div className="evidence-panel">
                <span>Visible evidence signals</span>
                <ul>
                  {professional.evidenceSignals.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="boundary-preview">
                <span>Declared boundary</span>
                <p>{professional.boundaries[0]}</p>
              </div>

              <div className="card-actions">
                <Link
                  className="card-primary"
                  href={`/marketplace/professionals/${professional.id}`}
                >
                  Open professional profile
                </Link>
                <Link className="card-secondary" href={MARKETPLACE_ROUTES.postNeed}>
                  Post a relevant need
                </Link>
              </div>
            </article>
          ))}
        </section>

        {filteredProfessionals.length === 0 && (
          <section className="empty-state">
            <h2>No demonstration professionals match those filters.</h2>
            <p>Clear the search or select another domain or availability state.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setDomain('All');
                setAvailability('All');
              }}
            >
              Reset filters
            </button>
          </section>
        )}

        <section className="reputation-section">
          <div className="section-intro">
            <span className="eyebrow">EVIDENCE-BASED REPUTATION</span>
            <h2>Reputation should come from inspectable work, not unexplained stars.</h2>
            <p>
              A future Marketplace reputation system should distinguish declared experience,
              independently reviewed evidence, preserved work products, client feedback, challenge
              history, corrections, disputes, and outcomes.
            </p>
          </div>

          <div className="reputation-grid">
            <article>
              <span>01</span>
              <h3>Identity record</h3>
              <p>Who is making the professional claim, under what organization and jurisdiction?</p>
            </article>
            <article>
              <span>02</span>
              <h3>Qualification evidence</h3>
              <p>Which credentials, publications, projects, or records support the declared role?</p>
            </article>
            <article>
              <span>03</span>
              <h3>Scope history</h3>
              <p>What work was accepted, declined, completed, corrected, or challenged?</p>
            </article>
            <article>
              <span>04</span>
              <h3>Route artifacts</h3>
              <p>Which reusable methods have visible versions, evidence requirements, and limits?</p>
            </article>
            <article>
              <span>05</span>
              <h3>Governed records</h3>
              <p>Which work products preserve scope, evidence, findings, boundaries, and outcome?</p>
            </article>
            <article>
              <span>06</span>
              <h3>Dispute continuity</h3>
              <p>How were objections, corrections, withdrawals, and superseded claims preserved?</p>
            </article>
          </div>
        </section>

        <section className="pathway-section">
          <div className="section-intro">
            <span className="eyebrow">CONNECTED PATHWAYS</span>
            <h2>The professional directory now leads somewhere useful.</h2>
            <p>
              Each profile card opens a dynamic professional workspace, and every secondary action
              routes to an existing Marketplace page rather than a placeholder or dead route.
            </p>
          </div>

          <div className="pathway-grid">
            <Link href={MARKETPLACE_ROUTES.opportunities}>
              <span>01</span>
              <h3>Browse opportunities</h3>
              <p>Find bounded governance, review, record, route, and evidence work.</p>
            </Link>
            <Link href={MARKETPLACE_ROUTES.postNeed}>
              <span>02</span>
              <h3>Post a governance need</h3>
              <p>Declare the problem, evidence state, consequence, timeline, and requested work.</p>
            </Link>
            <Link href={MARKETPLACE_ROUTES.governedRecords}>
              <span>03</span>
              <h3>Governed record requests</h3>
              <p>Browse continuity, interpretation, comparison, and record-preservation scopes.</p>
            </Link>
            <Link href={MARKETPLACE_ROUTES.routes}>
              <span>04</span>
              <h3>Route Marketplace</h3>
              <p>Inspect bounded route artifacts with versions, outputs, and limitations.</p>
            </Link>
            <Link href={MARKETPLACE_ROUTES.dashboard}>
              <span>05</span>
              <h3>Professional dashboard</h3>
              <p>Manage profile readiness, responses, routes, records, and opportunity matches.</p>
            </Link>
          </div>
        </section>

        <section className="final-cta">
          <span className="eyebrow">DECLARATION IS NOT VERIFICATION</span>
          <h2>Open the professional record before relying on the professional claim.</h2>
          <p>
            Each connected profile exposes domains, qualifications, services, review history,
            portfolio artifacts, governed records, professional boundaries, availability, and
            demonstration contact pathways.
          </p>

          <div className="action-row centered-actions">
            <Link className="primary-button" href={MARKETPLACE_ROUTES.opportunities}>
              Browse opportunities
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
          max-width: 840px;
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

        .professional-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .professional-card {
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
        }

        .status-badge,
        .verification-badge {
          display: inline-flex;
          width: fit-content;
          border-radius: 999px;
          padding: 7px 9px;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.07em;
        }

        .status-available {
          color: #89efc5;
          border: 1px solid rgba(74, 213, 156, 0.3);
          background: rgba(53, 163, 119, 0.1);
        }

        .status-limited-availability {
          color: #ffe29a;
          border: 1px solid rgba(228, 179, 54, 0.3);
          background: rgba(184, 131, 27, 0.1);
        }

        .status-not-accepting-work {
          color: #bac4ca;
          border: 1px solid rgba(160, 174, 182, 0.25);
          background: rgba(107, 121, 129, 0.08);
        }

        .verification-declared {
          color: #a9c6d1;
          background: rgba(89, 119, 132, 0.11);
        }

        .verification-partially-evidenced {
          color: #ffe29a;
          background: rgba(184, 131, 27, 0.11);
        }

        .verification-reviewed {
          color: #9bdcff;
          background: rgba(60, 135, 180, 0.11);
        }

        .identity-row {
          display: grid;
          grid-template-columns: 72px minmax(0, 1fr);
          gap: 16px;
          margin-top: 24px;
          align-items: center;
        }

        .identity-mark {
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #fff0b2;
          background: linear-gradient(145deg, #8d5d0c, #4c3005);
          font-size: 1.35rem;
          font-weight: 900;
        }

        .professional-id {
          color: #70909f;
          font-size: 0.74rem;
        }

        .professional-card h2 {
          margin: 7px 0 6px;
          font-size: 1.55rem;
          letter-spacing: -0.025em;
        }

        .title {
          margin-bottom: 4px;
          color: #e8cf82;
          font-weight: 800;
        }

        .organization {
          margin-bottom: 0;
          color: #8fa9b4;
          font-size: 0.88rem;
        }

        .summary {
          margin-top: 22px;
          color: #a7bdc8;
          line-height: 1.68;
        }

        .tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .tag-row span {
          border: 1px solid rgba(118, 201, 223, 0.18);
          border-radius: 999px;
          padding: 8px 10px;
          color: #9fc9d5;
          background: rgba(255, 255, 255, 0.022);
          font-size: 0.74rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 20px;
        }

        .metrics-grid div {
          min-height: 84px;
          padding: 13px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.028);
        }

        .metrics-grid span,
        .evidence-panel > span,
        .boundary-preview > span {
          display: block;
          margin-bottom: 7px;
          color: #7593a2;
          font-size: 0.69rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .metrics-grid strong {
          font-size: 0.86rem;
          line-height: 1.4;
        }

        .evidence-panel {
          margin-top: 12px;
          padding: 17px;
          border: 1px solid rgba(79, 205, 151, 0.18);
          border-radius: 16px;
          background: rgba(46, 145, 105, 0.055);
        }

        .evidence-panel ul {
          margin: 0;
          padding-left: 18px;
          color: #a8c3ba;
          line-height: 1.62;
        }

        .boundary-preview {
          margin-top: 12px;
          border-left: 3px solid #dfba58;
          border-radius: 0 14px 14px 0;
          padding: 15px 17px;
          background: rgba(205, 152, 31, 0.07);
        }

        .boundary-preview p {
          margin: 0;
          color: #c2b78e;
          line-height: 1.58;
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

        .reputation-section,
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

        .reputation-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .reputation-grid article {
          min-height: 225px;
          padding: 21px;
          border: 1px solid rgba(103, 194, 220, 0.15);
          border-radius: 20px;
          background: rgba(10, 30, 45, 0.72);
        }

        .reputation-grid > article > span,
        .pathway-grid a > span {
          color: #5ed0e9;
          font-size: 0.75rem;
        }

        .reputation-grid h3,
        .pathway-grid h3 {
          margin: 43px 0 10px;
          font-size: 1.2rem;
        }

        .reputation-grid p,
        .pathway-grid p {
          color: #95acb7;
          line-height: 1.6;
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

        @media (max-width: 800px) {
          .professional-grid,
          .reputation-grid,
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
          .metrics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 430px) {
          .summary-grid,
          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .identity-row {
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
