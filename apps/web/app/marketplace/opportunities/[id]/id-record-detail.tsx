// apps/web/app/marketplace/opportunities/[id]/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

type OpportunityStatus = 'OPEN' | 'REVIEWING' | 'MATCHED' | 'CLOSED';

type Opportunity = {
  id: string;
  title: string;
  organization: string;
  domain: string;
  status: OpportunityStatus;
  visibility: 'PUBLIC DEMONSTRATION' | 'PRIVATE DEMONSTRATION';
  summary: string;
  consequentialAction: string;
  requestedDeliverables: string[];
  evidenceAvailable: string[];
  evidenceMissing: string[];
  qualifications: string[];
  timeline: string;
  budget: string;
  posted: string;
  responseDeadline: string;
  reviewBoundary: string;
  routeOutcome: 'READY FOR REVIEW' | 'PARTIAL' | 'HOLD';
};

const MARKETPLACE_ROUTES = {
  home: '/marketplace',
  opportunities: '/marketplace/opportunities',
  professionals: '/marketplace/professionals',
  postNeed: '/marketplace/post-a-need',
} as const;

const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'TA-14-MKT-OPP-001',
    title: 'Independent review of an AI hiring governance route',
    organization: 'Northstar Workforce Systems',
    domain: 'AI Governance / Employment',
    status: 'OPEN',
    visibility: 'PUBLIC DEMONSTRATION',
    summary:
      'A workforce technology provider is seeking an independent, bounded review of a proposed AI-assisted candidate screening route before expanding deployment into the European Union.',
    consequentialAction:
      'The system may influence whether applicants advance, are delayed, or are excluded from further review. The requester wants the route evaluated for role clarity, evidence sufficiency, human oversight, logging, and likely EU AI Act high-risk obligations.',
    requestedDeliverables: [
      'Provider and deployer role analysis',
      'Annex III and Article 6 classification pathway',
      'Requirement-to-evidence map',
      'Human-oversight and escalation review',
      'Bounded gap report',
      'Independent review record',
    ],
    evidenceAvailable: [
      'System architecture overview',
      'Model card and intended-purpose statement',
      'Candidate-screening workflow diagram',
      'Current human-review procedure',
      'Sample decision logs',
    ],
    evidenceMissing: [
      'Validated bias and performance testing record',
      'Formal Article 9 risk-management record',
      'Complete data-governance provenance package',
      'Fundamental-rights impact assessment',
    ],
    qualifications: [
      'AI governance or EU AI Act experience',
      'Employment or workforce-system knowledge',
      'Independent review capability',
      'Evidence-mapping and documentation experience',
    ],
    timeline: '30 days from engagement',
    budget: '$4,000-$7,500 demonstration range',
    posted: 'July 21, 2026',
    responseDeadline: 'August 15, 2026',
    reviewBoundary:
      'The engagement requests a bounded governance review. It does not request legal representation, certification, conformity assessment, or a regulator determination.',
    routeOutcome: 'PARTIAL',
  },
  {
    id: 'TA-14-MKT-OPP-002',
    title: 'Governed environmental record interpretation for a school',
    organization: 'Demonstration Public Facilities Group',
    domain: 'Environmental Integrity / Buildings',
    status: 'OPEN',
    visibility: 'PUBLIC DEMONSTRATION',
    summary:
      'A facilities group wants a governed interpretation pathway for building atmospheric records covering classrooms, mechanical spaces, and occupied common areas.',
    consequentialAction:
      'The resulting interpretation may inform maintenance prioritization, occupant communication, and requests for additional investigation.',
    requestedDeliverables: [
      'Record intake and identity review',
      'Continuity and admissibility assessment',
      'Governed interpretation record',
      'Evidence-gap report',
      'Post-intervention comparison route',
    ],
    evidenceAvailable: [
      'Seven days of sensor exports',
      'Building floor plan',
      'HVAC equipment schedule',
      'Maintenance chronology',
    ],
    evidenceMissing: [
      'Calibrated instrument certificates',
      'Outdoor reference conditions',
      'Contributor identity record for two data periods',
    ],
    qualifications: [
      'Building science or HVAC expertise',
      'Environmental record interpretation',
      'Evidence continuity review',
      'Ability to preserve diagnostic boundaries',
    ],
    timeline: '21 days',
    budget: '$2,500-$5,000 demonstration range',
    posted: 'July 20, 2026',
    responseDeadline: 'August 10, 2026',
    reviewBoundary:
      'The requested work concerns record interpretation and continuity. Diagnosis and optimization remain separate scopes.',
    routeOutcome: 'HOLD',
  },
];

function getOpportunity(id: string | undefined): Opportunity {
  return OPPORTUNITIES.find((opportunity) => opportunity.id === id) ?? OPPORTUNITIES[0];
}

function StatusBadge({
  status,
  outcome,
}: {
  status: OpportunityStatus;
  outcome: Opportunity['routeOutcome'];
}) {
  return (
    <div className="status-row">
      <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
      <span className={`outcome-badge outcome-${outcome.toLowerCase().replaceAll(' ', '-')}`}>
        {outcome}
      </span>
    </div>
  );
}

export default function MarketplaceOpportunityDetailPage() {
  const params = useParams<{ id: string }>();
  const opportunity = useMemo(() => getOpportunity(params?.id), [params?.id]);

  const [applicationOpen, setApplicationOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [submitted, setSubmitted] = useState<'application' | 'question' | null>(null);

  const submitDemo = (kind: 'application' | 'question') => {
    setSubmitted(kind);
    setApplicationOpen(false);
    setQuestionOpen(false);
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
          <Link href={MARKETPLACE_ROUTES.opportunities}>Opportunities</Link>
          <span>/</span>
          <span>{opportunity.id}</span>
        </nav>

        {submitted ? (
          <section className="submission-confirmation" aria-live="polite">
            <span className="eyebrow">DEMONSTRATION ONLY</span>
            <h1>
              {submitted === 'application'
                ? 'Your application preview has been created.'
                : 'Your question preview has been created.'}
            </h1>
            <p>
              No information was transmitted or persisted. This page demonstrates the future
              Marketplace interaction while preserving the boundary that no live matching,
              messaging, identity verification, payment, or engagement has occurred.
            </p>
            <div className="action-row">
              <button className="primary-button" type="button" onClick={() => setSubmitted(null)}>
                Return to opportunity
              </button>
              <Link className="secondary-button" href={MARKETPLACE_ROUTES.opportunities}>
                Browse opportunities
              </Link>
            </div>
          </section>
        ) : (
          <>
            <header className="hero">
              <div className="hero-meta">
                <span className="eyebrow">{opportunity.visibility}</span>
                <span className="record-id">{opportunity.id}</span>
              </div>

              <StatusBadge status={opportunity.status} outcome={opportunity.routeOutcome} />

              <h1>{opportunity.title}</h1>
              <p className="organization">{opportunity.organization}</p>
              <p className="hero-copy">{opportunity.summary}</p>

              <div className="hero-facts">
                <article>
                  <span>Domain</span>
                  <strong>{opportunity.domain}</strong>
                </article>
                <article>
                  <span>Timeline</span>
                  <strong>{opportunity.timeline}</strong>
                </article>
                <article>
                  <span>Budget</span>
                  <strong>{opportunity.budget}</strong>
                </article>
                <article>
                  <span>Response deadline</span>
                  <strong>{opportunity.responseDeadline}</strong>
                </article>
              </div>

              <div className="action-row">
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    setApplicationOpen(true);
                    setQuestionOpen(false);
                  }}
                >
                  Apply to this opportunity
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    setQuestionOpen(true);
                    setApplicationOpen(false);
                  }}
                >
                  Ask a scoped question
                </button>
                <Link className="text-link" href={MARKETPLACE_ROUTES.postNeed}>
                  Post a governance need
                </Link>
              </div>
            </header>

            <section className="governed-sequence" aria-label="Opportunity workflow">
              {[
                'Need preserved',
                'Scope reviewed',
                'Evidence declared',
                'Professional selected',
                'Work bounded',
                'Review preserved',
              ].map((step, index) => (
                <div className="sequence-step" key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{step}</strong>
                </div>
              ))}
            </section>

            {(applicationOpen || questionOpen) && (
              <section className="interaction-panel">
                <div className="interaction-heading">
                  <div>
                    <span className="eyebrow">DEMONSTRATION INTERACTION</span>
                    <h2>{applicationOpen ? 'Application preview' : 'Scoped question preview'}</h2>
                  </div>
                  <button
                    className="close-button"
                    type="button"
                    onClick={() => {
                      setApplicationOpen(false);
                      setQuestionOpen(false);
                    }}
                    aria-label="Close interaction panel"
                  >
                    ×
                  </button>
                </div>

                {applicationOpen ? (
                  <div className="form-grid">
                    <label>
                      Professional or organization
                      <input placeholder="Name" />
                    </label>
                    <label>
                      Relevant expertise
                      <textarea
                        rows={4}
                        placeholder="Explain your relevant governance, technical, legal, review, or domain experience."
                      />
                    </label>
                    <label>
                      Proposed scope
                      <textarea
                        rows={5}
                        placeholder="Describe what you can review, produce, verify, or preserve—and what remains outside your scope."
                      />
                    </label>
                    <label>
                      Independence and conflicts
                      <textarea
                        rows={4}
                        placeholder="Disclose any conflicts, prior involvement, commercial relationships, or limitations."
                      />
                    </label>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => submitDemo('application')}
                    >
                      Create application preview
                    </button>
                  </div>
                ) : (
                  <div className="form-grid">
                    <label>
                      Your question
                      <textarea
                        rows={5}
                        placeholder="Ask a question about scope, evidence, timeline, deliverables, qualifications, or review boundaries."
                      />
                    </label>
                    <label>
                      Why the answer matters
                      <textarea
                        rows={4}
                        placeholder="Explain how the answer changes your ability to respond or define a bounded scope."
                      />
                    </label>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => submitDemo('question')}
                    >
                      Create question preview
                    </button>
                  </div>
                )}
              </section>
            )}

            <div className="detail-layout">
              <div className="main-column">
                <section className="detail-card">
                  <div className="section-heading">
                    <span>01</span>
                    <div>
                      <h2>Consequential action</h2>
                      <p>What may bind, change, deny, approve, release, or affect someone?</p>
                    </div>
                  </div>
                  <p className="body-copy">{opportunity.consequentialAction}</p>
                </section>

                <section className="detail-card">
                  <div className="section-heading">
                    <span>02</span>
                    <div>
                      <h2>Requested deliverables</h2>
                      <p>The declared outputs expected from the engagement.</p>
                    </div>
                  </div>
                  <div className="item-grid">
                    {opportunity.requestedDeliverables.map((item) => (
                      <article className="item-card" key={item}>
                        <span className="check-mark">✓</span>
                        <strong>{item}</strong>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="detail-card">
                  <div className="section-heading">
                    <span>03</span>
                    <div>
                      <h2>Evidence state</h2>
                      <p>Available evidence and declared gaps remain visibly separate.</p>
                    </div>
                  </div>

                  <div className="evidence-columns">
                    <div className="evidence-panel available">
                      <h3>Evidence available</h3>
                      <ul>
                        {opportunity.evidenceAvailable.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="evidence-panel missing">
                      <h3>Evidence missing or unresolved</h3>
                      <ul>
                        {opportunity.evidenceMissing.map((item) => (
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
                      <h2>Required qualifications</h2>
                      <p>
                        Evidence-based qualifications should replace popularity-based reputation.
                      </p>
                    </div>
                  </div>
                  <div className="qualification-list">
                    {opportunity.qualifications.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </section>

                <section className="detail-card">
                  <div className="section-heading">
                    <span>05</span>
                    <div>
                      <h2>Review boundary</h2>
                      <p>The opportunity must not silently expand beyond the declared engagement.</p>
                    </div>
                  </div>
                  <div className="boundary-box">
                    <strong>Declared boundary</strong>
                    <p>{opportunity.reviewBoundary}</p>
                  </div>
                </section>
              </div>

              <aside className="sidebar">
                <section className="sidebar-card sticky-card">
                  <span className="eyebrow">Opportunity record</span>
                  <h2>Current declared state</h2>

                  <dl>
                    <div>
                      <dt>Status</dt>
                      <dd>{opportunity.status}</dd>
                    </div>
                    <div>
                      <dt>Route readiness</dt>
                      <dd>{opportunity.routeOutcome}</dd>
                    </div>
                    <div>
                      <dt>Posted</dt>
                      <dd>{opportunity.posted}</dd>
                    </div>
                    <div>
                      <dt>Response deadline</dt>
                      <dd>{opportunity.responseDeadline}</dd>
                    </div>
                    <div>
                      <dt>Visibility</dt>
                      <dd>{opportunity.visibility}</dd>
                    </div>
                  </dl>

                  <div className="boundary-note">
                    <strong>Marketplace boundary</strong>
                    <p>
                      A listing is not an endorsement, certification, identity verification,
                      compliance finding, or promise of work.
                    </p>
                  </div>
                </section>

                <section className="sidebar-card">
                  <span className="eyebrow">Related pathways</span>
                  <div className="link-stack">
                    <Link href={MARKETPLACE_ROUTES.professionals}>Browse professionals</Link>
                    <Link href={MARKETPLACE_ROUTES.opportunities}>View all opportunities</Link>
                    <Link href={MARKETPLACE_ROUTES.postNeed}>Post another need</Link>
                  </div>
                </section>
              </aside>
            </div>

            <section className="final-cta">
              <span className="eyebrow">READY TO RESPOND?</span>
              <h2>Bring a bounded scope, declared expertise, and visible limitations.</h2>
              <p>
                The Marketplace should preserve who proposed what, which evidence was available,
                which boundaries were declared, and what work was ultimately accepted.
              </p>
              <div className="action-row centered-actions">
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    setApplicationOpen(true);
                    setQuestionOpen(false);
                    window.scrollTo({ top: 520, behavior: 'smooth' });
                  }}
                >
                  Apply to opportunity
                </button>
                <Link className="secondary-button" href={MARKETPLACE_ROUTES.opportunities}>
                  Browse more opportunities
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
            linear-gradient(rgba(4, 15, 26, 0.78), rgba(4, 15, 26, 0.97)),
            radial-gradient(circle at 18% 5%, rgba(22, 139, 180, 0.17), transparent 34%),
            radial-gradient(circle at 82% 8%, rgba(111, 70, 193, 0.13), transparent 31%);
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
          top: 15%;
          left: 9%;
        }

        .star-two {
          top: 29%;
          right: 12%;
          animation-delay: -5s;
        }

        .star-three {
          bottom: 24%;
          left: 14%;
          animation-delay: -9s;
        }

        .star-four {
          bottom: 12%;
          right: 16%;
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
          top: 25%;
          left: -7%;
          transform: rotate(-18deg);
        }

        .route-two {
          right: -5%;
          bottom: 21%;
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

        .hero {
          max-width: 980px;
          padding-bottom: 58px;
        }

        .hero-meta,
        .status-row,
        .action-row,
        .interaction-heading {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
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

        .status-row {
          margin-bottom: 22px;
        }

        .status-badge,
        .outcome-badge {
          border-radius: 999px;
          padding: 8px 11px;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.09em;
        }

        .status-open {
          color: #87efc4;
          border: 1px solid rgba(90, 224, 169, 0.34);
          background: rgba(51, 170, 123, 0.09);
        }

        .outcome-partial {
          color: #ffe49b;
          border: 1px solid rgba(239, 191, 67, 0.34);
          background: rgba(191, 137, 28, 0.09);
        }

        .outcome-hold {
          color: #ffb4aa;
          border: 1px solid rgba(245, 105, 89, 0.34);
          background: rgba(183, 63, 50, 0.1);
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 950px;
          margin: 0 0 18px;
          font-size: clamp(3rem, 7vw, 6.5rem);
          line-height: 0.96;
          letter-spacing: -0.055em;
        }

        .organization {
          margin-bottom: 24px;
          color: #e9ca77;
          font-size: 1.1rem;
          font-weight: 800;
        }

        .hero-copy,
        .body-copy {
          color: #b8ced9;
          font-size: 1.09rem;
          line-height: 1.78;
        }

        .hero-copy {
          max-width: 820px;
        }

        .hero-facts {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 34px;
        }

        .hero-facts article {
          min-height: 100px;
          padding: 17px;
          border: 1px solid rgba(106, 197, 221, 0.16);
          border-radius: 17px;
          background: rgba(11, 31, 47, 0.7);
        }

        .hero-facts span {
          display: block;
          margin-bottom: 9px;
          color: #7596a6;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        .hero-facts strong {
          line-height: 1.45;
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

        .text-link {
          color: #95cddd;
          font-weight: 800;
          text-decoration: none;
        }

        .governed-sequence {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          padding: 20px 0 68px;
        }

        .sequence-step {
          min-height: 115px;
          border: 1px solid rgba(103, 194, 218, 0.15);
          border-radius: 17px;
          padding: 15px;
          background: rgba(9, 29, 44, 0.69);
        }

        .sequence-step span {
          display: block;
          margin-bottom: 34px;
          color: #57cee9;
          font-size: 0.75rem;
        }

        .sequence-step strong {
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .interaction-panel,
        .submission-confirmation {
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

        .detail-layout {
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

        .item-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .item-card {
          min-height: 96px;
          padding: 17px;
          border: 1px solid rgba(113, 196, 219, 0.14);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.027);
        }

        .check-mark {
          display: block;
          margin-bottom: 18px;
          color: #78e4bb;
          font-weight: 900;
        }

        .item-card strong {
          line-height: 1.45;
        }

        .evidence-columns {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .evidence-panel {
          padding: 21px;
          border-radius: 20px;
        }

        .evidence-panel.available {
          border: 1px solid rgba(79, 205, 151, 0.2);
          background: rgba(46, 145, 105, 0.065);
        }

        .evidence-panel.missing {
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

        .qualification-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .qualification-list span {
          padding: 10px 13px;
          border: 1px solid rgba(111, 201, 225, 0.2);
          border-radius: 999px;
          color: #cce9f2;
          background: rgba(74, 185, 214, 0.06);
          font-size: 0.84rem;
          font-weight: 800;
        }

        .boundary-box,
        .boundary-note {
          border-left: 3px solid #dfba58;
          border-radius: 0 15px 15px 0;
          padding: 17px 19px;
          background: rgba(205, 152, 31, 0.075);
        }

        .boundary-box p,
        .boundary-note p {
          margin: 7px 0 0;
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

        .submission-confirmation {
          max-width: 880px;
          margin: 20px auto;
          padding: clamp(35px, 6vw, 70px);
        }

        .submission-confirmation h1 {
          margin-top: 20px;
          font-size: clamp(2.6rem, 6vw, 5rem);
        }

        .submission-confirmation p {
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

        @media (max-width: 980px) {
          .hero-facts {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .governed-sequence {
            grid-template-columns: repeat(3, 1fr);
          }

          .detail-layout {
            grid-template-columns: 1fr;
          }

          .sticky-card {
            position: relative;
            top: 0;
          }
        }

        @media (max-width: 680px) {
          .content-shell {
            width: min(100% - 24px, 1180px);
            padding-top: 22px;
          }

          .breadcrumbs {
            margin-bottom: 42px;
          }

          .hero-facts,
          .item-grid,
          .evidence-columns {
            grid-template-columns: 1fr;
          }

          .governed-sequence {
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
