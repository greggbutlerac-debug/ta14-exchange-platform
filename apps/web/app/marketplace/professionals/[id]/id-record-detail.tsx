// apps/web/app/marketplace/professionals/[id]/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

type VerificationState = 'VERIFIED DEMONSTRATION' | 'PARTIAL DEMONSTRATION' | 'UNVERIFIED';

type Professional = {
  id: string;
  name: string;
  headline: string;
  organization: string;
  location: string;
  availability: string;
  verification: VerificationState;
  summary: string;
  domains: string[];
  qualifications: string[];
  services: string[];
  governedRecords: number;
  routesBuilt: number;
  independentReviews: number;
  replaySuccessRate: string;
  verificationSuccessRate: string;
  challengeResolutionRate: string;
  portfolio: Array<{
    title: string;
    type: string;
    description: string;
    status: string;
  }>;
  reviewHistory: Array<{
    title: string;
    scope: string;
    outcome: string;
    date: string;
  }>;
  boundaries: string[];
};

const MARKETPLACE_ROUTES = {
  home: '/marketplace',
  professionals: '/marketplace/professionals',
  opportunities: '/marketplace/opportunities',
  postNeed: '/marketplace/post-a-need',
} as const;

const PROFESSIONALS: Professional[] = [
  {
    id: 'TA-14-PRO-001',
    name: 'Dr. Elena Marlowe',
    headline: 'Independent AI Governance Reviewer',
    organization: 'Marlowe Governance Studio',
    location: 'Brussels, Belgium',
    availability: 'Available for bounded reviews',
    verification: 'VERIFIED DEMONSTRATION',
    summary:
      'Independent reviewer focused on EU AI Act applicability, high-risk AI systems, evidence mapping, human oversight, and route-level governance review.',
    domains: [
      'EU AI Act',
      'High-risk AI',
      'Employment systems',
      'Human oversight',
      'Technical documentation',
      'Post-market monitoring',
    ],
    qualifications: [
      '12 years in AI governance and regulatory assurance',
      'Independent review experience across employment and public-sector AI',
      'Evidence-mapping and technical-documentation practice',
      'Multidisciplinary review coordination',
    ],
    services: [
      'Applicability and role analysis',
      'Requirement-to-evidence mapping',
      'Independent bounded review',
      'Human-oversight evaluation',
      'Governance route design',
      'Post-market monitoring review',
    ],
    governedRecords: 38,
    routesBuilt: 24,
    independentReviews: 31,
    replaySuccessRate: '94%',
    verificationSuccessRate: '91%',
    challengeResolutionRate: '88%',
    portfolio: [
      {
        title: 'AI Hiring Route Review',
        type: 'Independent Review',
        description:
          'Bounded review of a candidate-screening route covering role allocation, evidence gaps, human oversight, and escalation.',
        status: 'PRESERVED DEMONSTRATION',
      },
      {
        title: 'Article 50 Transparency Mapping',
        type: 'Evidence Map',
        description:
          'Mapped provider and deployer transparency duties to notices, markings, records, and verification points.',
        status: 'REVIEWED DEMONSTRATION',
      },
      {
        title: 'High-Risk Documentation Route',
        type: 'Governance Route',
        description:
          'Designed a route connecting intended purpose, classification, risk management, logging, oversight, and monitoring.',
        status: 'VERIFIED DEMONSTRATION',
      },
    ],
    reviewHistory: [
      {
        title: 'Public-sector eligibility system',
        scope: 'Independent evidence and oversight review',
        outcome: 'HOLD',
        date: 'June 2026',
      },
      {
        title: 'Workforce ranking model',
        scope: 'EU AI Act applicability and gap review',
        outcome: 'PARTIAL',
        date: 'May 2026',
      },
      {
        title: 'Customer-service disclosure route',
        scope: 'Article 50 transparency review',
        outcome: 'ALLOW',
        date: 'April 2026',
      },
    ],
    boundaries: [
      'Does not provide legal representation.',
      'Does not issue conformity assessment certificates.',
      'Does not replace competent authorities or notified bodies.',
      'Does not accept engagements where independence cannot be preserved.',
    ],
  },
  {
    id: 'TA-14-PRO-002',
    name: 'Marcus Chen',
    headline: 'Governed Records and Environmental Integrity Specialist',
    organization: 'Continuity Evidence Lab',
    location: 'Toronto, Canada',
    availability: 'Limited availability',
    verification: 'PARTIAL DEMONSTRATION',
    summary:
      'Specialist in governed environmental records, continuity review, atmospheric evidence, building systems, and post-intervention comparison.',
    domains: [
      'Governed records',
      'Environmental integrity',
      'Atmospheric records',
      'Building systems',
      'HVAC evidence',
      'Continuity review',
    ],
    qualifications: [
      'Building-science and HVAC systems background',
      'Environmental evidence continuity experience',
      'Governed interpretation workflow design',
      'Post-intervention comparison and preservation',
    ],
    services: [
      'Record identity and continuity review',
      'Governed interpretation support',
      'Environmental evidence-gap analysis',
      'Post-intervention record comparison',
      'Building-system route design',
    ],
    governedRecords: 61,
    routesBuilt: 17,
    independentReviews: 19,
    replaySuccessRate: '89%',
    verificationSuccessRate: '86%',
    challengeResolutionRate: '84%',
    portfolio: [
      {
        title: 'School Atmospheric Record Review',
        type: 'Governed Record',
        description:
          'Reviewed continuity, contributor identity, calibration evidence, and interpretation boundaries for a school record package.',
        status: 'PRESERVED DEMONSTRATION',
      },
      {
        title: 'HVAC Post-Intervention Comparison',
        type: 'Comparison Route',
        description:
          'Connected baseline conditions, declared intervention, and post-intervention performance without merging diagnosis and optimization.',
        status: 'REVIEWED DEMONSTRATION',
      },
    ],
    reviewHistory: [
      {
        title: 'Healthcare building record',
        scope: 'Continuity and admissibility review',
        outcome: 'HOLD',
        date: 'June 2026',
      },
      {
        title: 'Laboratory environmental record',
        scope: 'Record interpretation boundary review',
        outcome: 'ALLOW',
        date: 'May 2026',
      },
    ],
    boundaries: [
      'Record interpretation remains separate from diagnosis.',
      'No medical or legal conclusions are issued.',
      'Calibration and contributor gaps remain visible.',
      'Optimization requires a separately authorized scope.',
    ],
  },
];

function getProfessional(id: string | undefined): Professional {
  return PROFESSIONALS.find((professional) => professional.id === id) ?? PROFESSIONALS[0];
}

export default function MarketplaceProfessionalProfilePage() {
  const params = useParams<{ id: string }>();
  const professional = useMemo(() => getProfessional(params?.id), [params?.id]);

  const [contactOpen, setContactOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [submitted, setSubmitted] = useState<'contact' | 'invite' | null>(null);

  const submitDemo = (kind: 'contact' | 'invite') => {
    setSubmitted(kind);
    setContactOpen(false);
    setInviteOpen(false);
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
        <span className="route route-one" />
        <span className="route route-two" />
      </div>

      <div className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href={MARKETPLACE_ROUTES.home}>Marketplace</Link>
          <span>/</span>
          <Link href={MARKETPLACE_ROUTES.professionals}>Professionals</Link>
          <span>/</span>
          <span>{professional.id}</span>
        </nav>

        {submitted ? (
          <section className="submission-panel" aria-live="polite">
            <span className="eyebrow">DEMONSTRATION ONLY</span>
            <h1>
              {submitted === 'contact'
                ? 'Your contact request preview has been created.'
                : 'Your invitation preview has been created.'}
            </h1>
            <p>
              No message was sent and no engagement was formed. This browser-only demonstration
              preserves the boundary between expressing interest and creating a verified,
              authorized, compensated professional relationship.
            </p>
            <div className="action-row">
              <button className="primary-button" type="button" onClick={() => setSubmitted(null)}>
                Return to profile
              </button>
              <Link className="secondary-button" href={MARKETPLACE_ROUTES.professionals}>
                Browse professionals
              </Link>
            </div>
          </section>
        ) : (
          <>
            <header className="profile-hero">
              <div className="identity-mark" aria-hidden="true">
                {professional.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </div>

              <div className="profile-intro">
                <div className="hero-meta">
                  <span className="eyebrow">{professional.verification}</span>
                  <span className="record-id">{professional.id}</span>
                </div>

                <h1>{professional.name}</h1>
                <p className="headline">{professional.headline}</p>
                <p className="organization">
                  {professional.organization} · {professional.location}
                </p>
                <p className="hero-copy">{professional.summary}</p>

                <div className="availability-row">
                  <span className="availability-dot" />
                  <strong>{professional.availability}</strong>
                </div>

                <div className="action-row">
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => {
                      setContactOpen(true);
                      setInviteOpen(false);
                    }}
                  >
                    Request contact
                  </button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => {
                      setInviteOpen(true);
                      setContactOpen(false);
                    }}
                  >
                    Invite to opportunity
                  </button>
                  <Link className="text-link" href={MARKETPLACE_ROUTES.postNeed}>
                    Post a governance need
                  </Link>
                </div>
              </div>
            </header>

            <section className="evidence-metrics" aria-label="Evidence-based reputation">
              <article>
                <span>Governed records</span>
                <strong>{professional.governedRecords}</strong>
              </article>
              <article>
                <span>Routes built</span>
                <strong>{professional.routesBuilt}</strong>
              </article>
              <article>
                <span>Independent reviews</span>
                <strong>{professional.independentReviews}</strong>
              </article>
              <article>
                <span>Replay success</span>
                <strong>{professional.replaySuccessRate}</strong>
              </article>
              <article>
                <span>Verification success</span>
                <strong>{professional.verificationSuccessRate}</strong>
              </article>
              <article>
                <span>Challenge resolution</span>
                <strong>{professional.challengeResolutionRate}</strong>
              </article>
            </section>

            {(contactOpen || inviteOpen) && (
              <section className="interaction-panel">
                <div className="interaction-heading">
                  <div>
                    <span className="eyebrow">DEMONSTRATION INTERACTION</span>
                    <h2>{contactOpen ? 'Contact request preview' : 'Opportunity invitation preview'}</h2>
                  </div>
                  <button
                    className="close-button"
                    type="button"
                    onClick={() => {
                      setContactOpen(false);
                      setInviteOpen(false);
                    }}
                    aria-label="Close interaction panel"
                  >
                    ×
                  </button>
                </div>

                {contactOpen ? (
                  <div className="form-grid">
                    <label>
                      Your name or organization
                      <input placeholder="Name or organization" />
                    </label>
                    <label>
                      Governance need
                      <textarea
                        rows={5}
                        placeholder="Describe the problem, consequence, evidence state, and bounded result you are seeking."
                      />
                    </label>
                    <label>
                      Requested contact purpose
                      <textarea
                        rows={4}
                        placeholder="Explain whether you are seeking a conversation, review, route design, governed record, or another bounded service."
                      />
                    </label>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => submitDemo('contact')}
                    >
                      Create contact-request preview
                    </button>
                  </div>
                ) : (
                  <div className="form-grid">
                    <label>
                      Opportunity title
                      <input placeholder="Opportunity title" />
                    </label>
                    <label>
                      Proposed scope
                      <textarea
                        rows={5}
                        placeholder="State the proposed deliverables, evidence available, timeline, and boundaries."
                      />
                    </label>
                    <label>
                      Why this professional is being invited
                      <textarea
                        rows={4}
                        placeholder="Connect the invitation to declared domains, qualifications, portfolio, or review history."
                      />
                    </label>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => submitDemo('invite')}
                    >
                      Create invitation preview
                    </button>
                  </div>
                )}
              </section>
            )}

            <div className="profile-layout">
              <div className="main-column">
                <section className="detail-card">
                  <div className="section-heading">
                    <span>01</span>
                    <div>
                      <h2>Domains of competence</h2>
                      <p>Declared areas of work, not universal authority.</p>
                    </div>
                  </div>

                  <div className="tag-list">
                    {professional.domains.map((domain) => (
                      <span key={domain}>{domain}</span>
                    ))}
                  </div>
                </section>

                <section className="detail-card">
                  <div className="section-heading">
                    <span>02</span>
                    <div>
                      <h2>Qualifications</h2>
                      <p>Experience and capability statements that should later be evidence-backed.</p>
                    </div>
                  </div>

                  <div className="item-grid">
                    {professional.qualifications.map((qualification) => (
                      <article className="item-card" key={qualification}>
                        <span className="item-mark">✓</span>
                        <strong>{qualification}</strong>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="detail-card">
                  <div className="section-heading">
                    <span>03</span>
                    <div>
                      <h2>Services offered</h2>
                      <p>Every engagement remains subject to a separately accepted scope.</p>
                    </div>
                  </div>

                  <div className="service-grid">
                    {professional.services.map((service) => (
                      <article key={service}>
                        <span />
                        <strong>{service}</strong>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="detail-card">
                  <div className="section-heading">
                    <span>04</span>
                    <div>
                      <h2>Portfolio</h2>
                      <p>Demonstration artifacts showing the kinds of work the professional performs.</p>
                    </div>
                  </div>

                  <div className="portfolio-grid">
                    {professional.portfolio.map((item) => (
                      <article className="portfolio-card" key={item.title}>
                        <div className="portfolio-topline">
                          <span>{item.type}</span>
                          <span>{item.status}</span>
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <button type="button" disabled>
                          Public artifact not connected
                        </button>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="detail-card">
                  <div className="section-heading">
                    <span>05</span>
                    <div>
                      <h2>Independent review history</h2>
                      <p>Preserved outcomes matter more than likes, stars, or popularity.</p>
                    </div>
                  </div>

                  <div className="review-table" role="table" aria-label="Independent review history">
                    <div className="review-row review-header" role="row">
                      <span role="columnheader">Review</span>
                      <span role="columnheader">Scope</span>
                      <span role="columnheader">Outcome</span>
                      <span role="columnheader">Date</span>
                    </div>
                    {professional.reviewHistory.map((review) => (
                      <div className="review-row" role="row" key={`${review.title}-${review.date}`}>
                        <strong role="cell">{review.title}</strong>
                        <span role="cell">{review.scope}</span>
                        <span role="cell" className={`review-outcome outcome-${review.outcome.toLowerCase()}`}>
                          {review.outcome}
                        </span>
                        <span role="cell">{review.date}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="detail-card">
                  <div className="section-heading">
                    <span>06</span>
                    <div>
                      <h2>Declared professional boundaries</h2>
                      <p>Capability is strengthened when limitations remain visible.</p>
                    </div>
                  </div>

                  <div className="boundary-list">
                    {professional.boundaries.map((boundary) => (
                      <article key={boundary}>
                        <span>BOUNDARY</span>
                        <p>{boundary}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="sidebar">
                <section className="sidebar-card sticky-card">
                  <span className="eyebrow">Professional record</span>
                  <h2>Declared profile state</h2>

                  <dl>
                    <div>
                      <dt>Verification</dt>
                      <dd>{professional.verification}</dd>
                    </div>
                    <div>
                      <dt>Organization</dt>
                      <dd>{professional.organization}</dd>
                    </div>
                    <div>
                      <dt>Location</dt>
                      <dd>{professional.location}</dd>
                    </div>
                    <div>
                      <dt>Availability</dt>
                      <dd>{professional.availability}</dd>
                    </div>
                  </dl>

                  <div className="boundary-note">
                    <strong>Marketplace boundary</strong>
                    <p>
                      A profile is not certification, endorsement, licensing verification, legal
                      authority, or a guarantee of professional performance.
                    </p>
                  </div>
                </section>

                <section className="sidebar-card">
                  <span className="eyebrow">Related pathways</span>
                  <div className="link-stack">
                    <Link href={MARKETPLACE_ROUTES.opportunities}>Browse opportunities</Link>
                    <Link href={MARKETPLACE_ROUTES.professionals}>View all professionals</Link>
                    <Link href={MARKETPLACE_ROUTES.postNeed}>Post a governance need</Link>
                  </div>
                </section>
              </aside>
            </div>

            <section className="final-cta">
              <span className="eyebrow">EVIDENCE-BASED PROFESSIONAL REPUTATION</span>
              <h2>Judge the work by preserved records, routes, reviews, and outcomes.</h2>
              <p>
                TA-14 Marketplace reputation should be built from inspectable governance activity,
                declared boundaries, replay, verification, challenge resolution, and preserved
                history—not popularity.
              </p>
              <div className="action-row centered-actions">
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    setContactOpen(true);
                    setInviteOpen(false);
                    window.scrollTo({ top: 520, behavior: 'smooth' });
                  }}
                >
                  Request contact
                </button>
                <Link className="secondary-button" href={MARKETPLACE_ROUTES.professionals}>
                  Browse more professionals
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
            linear-gradient(rgba(4, 15, 26, 0.79), rgba(4, 15, 26, 0.97)),
            radial-gradient(circle at 15% 4%, rgba(24, 139, 181, 0.18), transparent 33%),
            radial-gradient(circle at 84% 9%, rgba(117, 72, 198, 0.14), transparent 31%);
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

        .route {
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
        .link-stack a:hover {
          color: #ffffff;
        }

        .profile-hero {
          display: grid;
          grid-template-columns: 210px minmax(0, 1fr);
          gap: 34px;
          align-items: start;
          padding-bottom: 48px;
        }

        .identity-mark {
          width: 190px;
          height: 230px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(234, 194, 84, 0.4);
          border-radius: 80px 80px 24px 24px;
          color: #fff3ba;
          background:
            radial-gradient(circle at 50% 25%, rgba(255, 230, 150, 0.24), transparent 28%),
            linear-gradient(145deg, rgba(119, 76, 8, 0.95), rgba(63, 39, 5, 0.95));
          box-shadow:
            inset 0 0 45px rgba(255, 218, 113, 0.07),
            0 24px 55px rgba(0, 0, 0, 0.22);
          font-size: 4rem;
          font-weight: 900;
          letter-spacing: -0.07em;
        }

        .hero-meta,
        .action-row,
        .availability-row,
        .interaction-heading {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .hero-meta {
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .eyebrow {
          display: inline-block;
          color: #72d8ef;
          font-size: 0.75rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .record-id {
          color: #839eac;
          font-size: 0.82rem;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          margin: 0 0 12px;
          font-size: clamp(3rem, 7vw, 6.2rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .headline {
          margin-bottom: 8px;
          color: #f0d27e;
          font-size: 1.28rem;
          font-weight: 900;
        }

        .organization {
          margin-bottom: 24px;
          color: #9bb5c1;
          font-weight: 700;
        }

        .hero-copy {
          max-width: 790px;
          color: #b8ced9;
          font-size: 1.08rem;
          line-height: 1.78;
        }

        .availability-row {
          margin-top: 22px;
          color: #bcebd8;
        }

        .availability-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #61dfaa;
          box-shadow: 0 0 16px rgba(71, 214, 157, 0.8);
        }

        .action-row {
          margin-top: 28px;
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

        .text-link {
          color: #95cddd;
          font-weight: 800;
          text-decoration: none;
        }

        .evidence-metrics {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          padding: 14px 0 66px;
        }

        .evidence-metrics article {
          min-height: 120px;
          padding: 16px;
          border: 1px solid rgba(103, 194, 218, 0.15);
          border-radius: 18px;
          background: rgba(9, 29, 44, 0.7);
        }

        .evidence-metrics span {
          display: block;
          min-height: 38px;
          color: #789aaa;
          font-size: 0.73rem;
          line-height: 1.35;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .evidence-metrics strong {
          display: block;
          margin-top: 19px;
          font-size: 1.7rem;
        }

        .interaction-panel,
        .submission-panel {
          margin-bottom: 28px;
          padding: clamp(24px, 4vw, 42px);
          border: 1px solid rgba(100, 201, 228, 0.22);
          border-radius: 28px;
          background:
            linear-gradient(145deg, rgba(14, 41, 59, 0.97), rgba(7, 23, 36, 0.95));
          box-shadow: 0 24px 65px rgba(0, 0, 0, 0.22);
        }

        .interaction-heading {
          justify-content: space-between;
          margin-bottom: 25px;
        }

        .interaction-heading h2 {
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

        label {
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

        .profile-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: 26px;
          align-items: start;
        }

        .main-column {
          display: grid;
          gap: 20px;
        }

        .detail-card,
        .sidebar-card {
          border: 1px solid rgba(103, 194, 220, 0.17);
          border-radius: 26px;
          background:
            linear-gradient(145deg, rgba(14, 38, 55, 0.93), rgba(7, 23, 36, 0.9));
          box-shadow: 0 22px 56px rgba(0, 0, 0, 0.16);
        }

        .detail-card {
          padding: clamp(24px, 4vw, 40px);
        }

        .section-heading {
          display: flex;
          gap: 17px;
          align-items: flex-start;
          padding-bottom: 24px;
          margin-bottom: 25px;
          border-bottom: 1px solid rgba(111, 197, 220, 0.14);
        }

        .section-heading > span {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 42px;
          height: 42px;
          border-radius: 50%;
          color: #78dcf3;
          background: rgba(80, 199, 227, 0.11);
          font-weight: 900;
        }

        .section-heading h2 {
          margin: 2px 0 6px;
          font-size: 1.55rem;
        }

        .section-heading p {
          margin: 0;
          color: #91aab7;
          line-height: 1.55;
        }

        .tag-list,
        .service-grid,
        .item-grid,
        .portfolio-grid {
          display: grid;
          gap: 12px;
        }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .tag-list span {
          padding: 10px 13px;
          border: 1px solid rgba(111, 201, 225, 0.2);
          border-radius: 999px;
          color: #cce9f2;
          background: rgba(74, 185, 214, 0.06);
          font-size: 0.84rem;
          font-weight: 800;
        }

        .item-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .item-card,
        .service-grid article {
          min-height: 96px;
          padding: 17px;
          border: 1px solid rgba(113, 196, 219, 0.14);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.027);
        }

        .item-mark {
          display: block;
          margin-bottom: 18px;
          color: #78e4bb;
          font-weight: 900;
        }

        .item-card strong,
        .service-grid strong {
          line-height: 1.45;
        }

        .service-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .service-grid article span {
          display: block;
          width: 30px;
          height: 2px;
          margin-bottom: 28px;
          background: linear-gradient(90deg, #63d6ed, transparent);
        }

        .portfolio-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .portfolio-card {
          padding: 22px;
          border: 1px solid rgba(113, 196, 219, 0.16);
          border-radius: 21px;
          background: rgba(255, 255, 255, 0.025);
        }

        .portfolio-topline {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 34px;
          color: #7fa5b6;
          font-size: 0.69rem;
          line-height: 1.35;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .portfolio-card h3 {
          font-size: 1.25rem;
        }

        .portfolio-card p {
          color: #9fb5c0;
          line-height: 1.65;
        }

        .portfolio-card button {
          margin-top: 8px;
          border: 1px solid rgba(128, 195, 214, 0.14);
          border-radius: 999px;
          padding: 10px 13px;
          color: #7795a4;
          background: rgba(255, 255, 255, 0.02);
          cursor: not-allowed;
        }

        .review-table {
          overflow: hidden;
          border: 1px solid rgba(113, 196, 219, 0.14);
          border-radius: 18px;
        }

        .review-row {
          display: grid;
          grid-template-columns: 1.25fr 1.55fr 0.7fr 0.75fr;
          gap: 12px;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid rgba(113, 196, 219, 0.11);
          color: #a8bdc8;
          font-size: 0.88rem;
        }

        .review-row:last-child {
          border-bottom: 0;
        }

        .review-header {
          color: #70909f;
          background: rgba(255, 255, 255, 0.025);
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .review-row strong {
          color: #eefaff;
        }

        .review-outcome {
          display: inline-flex;
          width: fit-content;
          border-radius: 999px;
          padding: 7px 9px;
          font-weight: 900;
          font-size: 0.7rem;
        }

        .outcome-allow {
          color: #89efc5;
          background: rgba(53, 163, 119, 0.1);
        }

        .outcome-hold {
          color: #ffb0a7;
          background: rgba(181, 65, 52, 0.1);
        }

        .outcome-partial {
          color: #ffe29a;
          background: rgba(184, 131, 27, 0.1);
        }

        .boundary-list {
          display: grid;
          gap: 12px;
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

        .sidebar {
          display: grid;
          gap: 18px;
        }

        .sidebar-card {
          padding: 23px;
        }

        .sticky-card {
          position: sticky;
          top: 22px;
        }

        .sidebar-card h2 {
          margin: 10px 0 22px;
          font-size: 1.45rem;
        }

        dl {
          margin: 0;
        }

        dl div {
          padding: 13px 0;
          border-bottom: 1px solid rgba(111, 197, 220, 0.12);
        }

        dt {
          color: #7595a4;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        dd {
          margin: 6px 0 0;
          color: #f0fbff;
          font-weight: 800;
          line-height: 1.45;
        }

        .boundary-note {
          margin-top: 21px;
          border-left: 3px solid #dfba58;
          border-radius: 0 15px 15px 0;
          padding: 17px 19px;
          background: rgba(205, 152, 31, 0.075);
        }

        .boundary-note p {
          margin: 7px 0 0;
          color: #c4b88e;
          line-height: 1.65;
        }

        .link-stack {
          display: grid;
        }

        .link-stack a {
          padding: 13px 0;
          border-bottom: 1px solid rgba(111, 197, 220, 0.12);
          color: #a9d5e2;
          text-decoration: none;
          font-weight: 800;
        }

        .final-cta {
          max-width: 910px;
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

        @media (max-width: 1040px) {
          .evidence-metrics {
            grid-template-columns: repeat(3, 1fr);
          }

          .profile-layout {
            grid-template-columns: 1fr;
          }

          .sticky-card {
            position: relative;
            top: 0;
          }
        }

        @media (max-width: 760px) {
          .profile-hero {
            grid-template-columns: 1fr;
          }

          .identity-mark {
            width: 145px;
            height: 175px;
            border-radius: 60px 60px 20px 20px;
            font-size: 3rem;
          }

          .service-grid,
          .portfolio-grid,
          .item-grid {
            grid-template-columns: 1fr;
          }

          .review-row {
            grid-template-columns: 1fr;
          }

          .review-header {
            display: none;
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

          .evidence-metrics {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero-meta {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(html) {
            scroll-behavior: auto;
          }

          .star,
          .orbit,
          .route {
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
