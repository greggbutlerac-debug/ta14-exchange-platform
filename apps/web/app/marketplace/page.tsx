// apps/web/app/marketplace/page.tsx
'use client';

import Link from 'next/link';

const MARKETPLACE_LINKS = {
  opportunities: '/marketplace/opportunities',
  postNeed: '/marketplace/post-a-need',
  professionals: '/marketplace/professionals',
  governedRecords: '/marketplace/governed-records',
  routes: '/marketplace/routes',
  dashboard: '/marketplace/dashboard',
} as const;

const marketplaceAreas = [
  {
    number: '01',
    eyebrow: 'GOVERNANCE NEEDS',
    title: 'Opportunities',
    description:
      'Browse bounded requests for independent review, route design, evidence mapping, governed interpretation, technical analysis, and other governance work.',
    primaryLabel: 'Browse opportunities',
    primaryHref: MARKETPLACE_LINKS.opportunities,
    secondaryLabel: 'Post a governance need',
    secondaryHref: MARKETPLACE_LINKS.postNeed,
    state: 'CONNECTED',
  },
  {
    number: '02',
    eyebrow: 'EVIDENCE-BASED PROFESSIONALS',
    title: 'Professional Profiles',
    description:
      'Discover professionals through declared competence, qualifications, routes, governed records, review history, visible limitations, and preserved outcomes.',
    primaryLabel: 'Browse professionals',
    primaryHref: MARKETPLACE_LINKS.professionals,
    secondaryLabel: 'Open professional dashboard',
    secondaryHref: MARKETPLACE_LINKS.dashboard,
    state: 'CONNECTED',
  },
  {
    number: '03',
    eyebrow: 'RECORD-CENTERED WORK',
    title: 'Governed Record Requests',
    description:
      'Find requests for record creation, continuity review, interpretation, comparison, verification, and preservation across operational and governance domains.',
    primaryLabel: 'Browse record requests',
    primaryHref: MARKETPLACE_LINKS.governedRecords,
    secondaryLabel: 'Find record specialists',
    secondaryHref: MARKETPLACE_LINKS.professionals,
    state: 'CONNECTED',
  },
  {
    number: '04',
    eyebrow: 'REUSABLE GOVERNANCE',
    title: 'Route Marketplace',
    description:
      'Inspect bounded governance routes with declared inputs, evidence requirements, outputs, verification state, limitations, versions, and commercial models.',
    primaryLabel: 'Browse governed routes',
    primaryHref: MARKETPLACE_LINKS.routes,
    secondaryLabel: 'Request a custom route',
    secondaryHref: MARKETPLACE_LINKS.postNeed,
    state: 'CONNECTED',
  },
  {
    number: '05',
    eyebrow: 'PROFESSIONAL WORKSPACE',
    title: 'Professional Dashboard',
    description:
      'Manage opportunity matches, responses, routes, governed records, readiness state, review history, and professional boundaries from one workspace.',
    primaryLabel: 'Open dashboard',
    primaryHref: MARKETPLACE_LINKS.dashboard,
    secondaryLabel: 'View opportunities',
    secondaryHref: MARKETPLACE_LINKS.opportunities,
    state: 'CONNECTED',
  },
];

const workflow = [
  {
    number: '01',
    title: 'Need declared',
    description: 'The requester states the problem, consequence, scope, evidence state, and desired result.',
  },
  {
    number: '02',
    title: 'Boundary preserved',
    description: 'The request remains separate from certification, authority, execution, and unsupported claims.',
  },
  {
    number: '03',
    title: 'Professionals respond',
    description: 'Responders declare expertise, proposed scope, limitations, conflicts, and dependencies.',
  },
  {
    number: '04',
    title: 'Work is selected',
    description: 'A future live system will preserve selection, authorization, scope, identity, and payment state.',
  },
  {
    number: '05',
    title: 'Evidence is produced',
    description: 'Routes, reviews, interpretations, findings, records, and outcomes remain inspectable.',
  },
  {
    number: '06',
    title: 'History remains',
    description: 'Versions, challenges, corrections, boundaries, receipts, and final states remain attributable.',
  },
];

export default function MarketplacePage() {
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
        <header className="hero">
          <div className="hero-topline">
            <span className="eyebrow">TA-14 Collaborative Governance Marketplace</span>
            <span className="connection-badge">CORE WORKSPACES CONNECTED</span>
          </div>

          <h1>
            Find the work.
            <br />
            Preserve the boundaries.
          </h1>

          <p className="hero-copy">
            The TA-14 Marketplace is a governed coordination environment for people who need
            review, interpretation, route design, evidence mapping, professional expertise, and
            preserved governance work.
          </p>

          <div className="hero-boundary">
            <strong>The Marketplace does not certify people, routes, records, or outcomes.</strong>
            <p>
              It creates a visible pathway for declaring needs, qualifications, evidence,
              limitations, scope, responses, work products, review history, and future commercial
              relationships without confusing participation with authority.
            </p>
          </div>

          <div className="action-row">
            <Link className="primary-button" href={MARKETPLACE_LINKS.opportunities}>
              Browse opportunities
            </Link>
            <Link className="secondary-button" href={MARKETPLACE_LINKS.postNeed}>
              Post a governance need
            </Link>
            <Link className="text-link" href={MARKETPLACE_LINKS.professionals}>
              Browse professionals
            </Link>
          </div>
        </header>

        <section className="marketplace-status" aria-label="Marketplace workspace status">
          <article>
            <span>Opportunity workspace</span>
            <strong>CONNECTED</strong>
          </article>
          <article>
            <span>Professional profiles</span>
            <strong>CONNECTED</strong>
          </article>
          <article>
            <span>Governed record requests</span>
            <strong>CONNECTED</strong>
          </article>
          <article>
            <span>Route Marketplace</span>
            <strong>CONNECTED</strong>
          </article>
          <article>
            <span>Professional dashboard</span>
            <strong>CONNECTED</strong>
          </article>
          <article>
            <span>Live backend services</span>
            <strong>NOT YET CONNECTED</strong>
          </article>
        </section>

        <section className="marketplace-grid-section">
          <div className="section-intro">
            <span className="eyebrow">MARKETPLACE WORKSPACES</span>
            <h2>Every primary Marketplace pathway now has a destination.</h2>
            <p>
              These workspaces are currently front-end demonstrations. They intentionally avoid
              claiming live messaging, matching, identity verification, contracting, payment,
              licensing, or data persistence.
            </p>
          </div>

          <div className="marketplace-grid">
            {marketplaceAreas.map((area) => (
              <article className="marketplace-card" key={area.title}>
                <div className="card-topline">
                  <span>{area.number}</span>
                  <span className="card-state">{area.state}</span>
                </div>

                <span className="eyebrow">{area.eyebrow}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>

                <div className="card-actions">
                  <Link className="card-primary" href={area.primaryHref}>
                    {area.primaryLabel}
                  </Link>
                  <Link className="card-secondary" href={area.secondaryHref}>
                    {area.secondaryLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="workflow-section">
          <div className="section-intro narrow">
            <span className="eyebrow">GOVERNED MARKETPLACE SEQUENCE</span>
            <h2>Commercial coordination should not erase admissibility.</h2>
            <p>
              The Marketplace should preserve the difference between expressing a need, proposing
              work, selecting a professional, authorizing a scope, producing evidence, and relying
              on an outcome.
            </p>
          </div>

          <div className="workflow-grid">
            {workflow.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="architecture-section">
          <div className="architecture-card">
            <span className="eyebrow">WHAT THE MARKETPLACE PRESERVES</span>
            <h2>A transaction is not the whole record.</h2>

            <div className="architecture-grid">
              <article>
                <span>Need identity</span>
                <strong>Who requested what, when, and why?</strong>
              </article>
              <article>
                <span>Scope identity</span>
                <strong>What work was proposed, accepted, rejected, or changed?</strong>
              </article>
              <article>
                <span>Evidence state</span>
                <strong>What evidence existed, what was missing, and what changed?</strong>
              </article>
              <article>
                <span>Professional identity</span>
                <strong>Who performed the work, under which declared qualifications?</strong>
              </article>
              <article>
                <span>Boundary identity</span>
                <strong>What was explicitly outside the scope or authority?</strong>
              </article>
              <article>
                <span>Outcome identity</span>
                <strong>What was produced, reviewed, challenged, corrected, and preserved?</strong>
              </article>
            </div>
          </div>
        </section>

        <section className="boundary-section">
          <div className="boundary-heading">
            <span className="eyebrow">PLATFORM BOUNDARIES</span>
            <h2>Connected pages do not imply connected authority.</h2>
          </div>

          <div className="boundary-grid">
            <article>
              <span>NO LIVE MATCHING</span>
              <p>
                Demonstration fit and opportunity states do not represent a live recommendation
                engine or verified professional match.
              </p>
            </article>
            <article>
              <span>NO IDENTITY VERIFICATION</span>
              <p>
                Demonstration profiles and organizations are not authenticated, licensed,
                certified, or independently verified.
              </p>
            </article>
            <article>
              <span>NO CONTRACTING</span>
              <p>
                Preview responses, invitations, and license requests do not create agreements,
                obligations, authority, or commercial rights.
              </p>
            </article>
            <article>
              <span>NO PAYMENT PROCESSING</span>
              <p>
                Demonstration prices and commercial models do not process funds, escrow payments,
                commissions, refunds, or Marketplace fees.
              </p>
            </article>
            <article>
              <span>NO CERTIFICATION</span>
              <p>
                Listings, records, routes, reviews, and profile metrics do not establish compliance,
                certification, admissibility, or regulator acceptance.
              </p>
            </article>
            <article>
              <span>NO EXECUTION AUTHORITY</span>
              <p>
                The Marketplace may coordinate governance work, but it does not itself authorize
                consequential execution.
              </p>
            </article>
          </div>
        </section>

        <section className="final-cta">
          <span className="eyebrow">THE MARKETPLACE FRONT DOOR IS CONNECTED</span>
          <h2>Choose the path that matches the work you are trying to govern.</h2>
          <p>
            Browse opportunities, find a professional, request a governed record, inspect reusable
            routes, or enter the professional dashboard. Each path now leads to a working
            Marketplace workspace.
          </p>

          <div className="final-action-grid">
            <Link href={MARKETPLACE_LINKS.opportunities}>Browse opportunities</Link>
            <Link href={MARKETPLACE_LINKS.professionals}>Browse professionals</Link>
            <Link href={MARKETPLACE_LINKS.governedRecords}>Governed record requests</Link>
            <Link href={MARKETPLACE_LINKS.routes}>Route Marketplace</Link>
            <Link href={MARKETPLACE_LINKS.dashboard}>Professional dashboard</Link>
            <Link href={MARKETPLACE_LINKS.postNeed}>Post a governance need</Link>
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

        .page-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(rgba(4, 15, 26, 0.79), rgba(4, 15, 26, 0.97)),
            radial-gradient(circle at 15% 4%, rgba(22, 139, 181, 0.18), transparent 34%),
            radial-gradient(circle at 84% 8%, rgba(116, 72, 198, 0.14), transparent 31%);
        }

        .content-shell {
          width: min(1180px, calc(100% - 36px));
          margin: 0 auto;
          padding: 78px 0 96px;
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
          top: 13%;
          left: 8%;
        }

        .star-two {
          top: 29%;
          right: 11%;
          animation-delay: -5s;
        }

        .star-three {
          bottom: 24%;
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
          max-width: 1040px;
          padding-bottom: 60px;
        }

        .hero-topline {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: center;
          flex-wrap: wrap;
        }

        .connection-badge {
          border: 1px solid rgba(80, 220, 164, 0.28);
          border-radius: 999px;
          padding: 9px 12px;
          color: #8af0c6;
          background: rgba(42, 145, 103, 0.08);
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.09em;
        }

        h1 {
          margin: 24px 0 24px;
          font-size: clamp(3.4rem, 8vw, 7.4rem);
          line-height: 0.92;
          letter-spacing: -0.06em;
        }

        .hero-copy {
          max-width: 840px;
          color: #b8ced9;
          font-size: 1.13rem;
          line-height: 1.8;
        }

        .hero-boundary {
          max-width: 890px;
          margin-top: 28px;
          border-left: 3px solid #dfba58;
          border-radius: 0 16px 16px 0;
          padding: 19px 21px;
          background: rgba(205, 152, 31, 0.075);
        }

        .hero-boundary p {
          margin: 7px 0 0;
          color: #c4b88e;
          line-height: 1.66;
        }

        .action-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 31px;
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

        .marketplace-status {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
          padding-bottom: 82px;
        }

        .marketplace-status article {
          min-height: 116px;
          padding: 16px;
          border: 1px solid rgba(103, 194, 218, 0.15);
          border-radius: 18px;
          background: rgba(9, 29, 44, 0.7);
        }

        .marketplace-status span {
          display: block;
          min-height: 39px;
          color: #789aaa;
          font-size: 0.72rem;
          line-height: 1.35;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .marketplace-status strong {
          display: block;
          margin-top: 20px;
          color: #8cebc5;
          font-size: 0.78rem;
          line-height: 1.4;
        }

        .marketplace-status article:last-child strong {
          color: #ffe19a;
        }

        .section-intro {
          max-width: 900px;
          margin-bottom: 30px;
        }

        .section-intro.narrow {
          max-width: 820px;
        }

        .section-intro h2,
        .boundary-heading h2 {
          margin: 12px 0 16px;
          font-size: clamp(2.3rem, 5vw, 4.6rem);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .section-intro p {
          color: #a9bec8;
          font-size: 1.04rem;
          line-height: 1.74;
        }

        .marketplace-grid-section {
          padding-bottom: 88px;
        }

        .marketplace-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .marketplace-card {
          display: flex;
          flex-direction: column;
          min-height: 370px;
          padding: 27px;
          border: 1px solid rgba(103, 194, 220, 0.17);
          border-radius: 26px;
          background:
            linear-gradient(145deg, rgba(14, 38, 55, 0.93), rgba(7, 23, 36, 0.9));
          box-shadow: 0 22px 56px rgba(0, 0, 0, 0.16);
        }

        .marketplace-card:last-child {
          grid-column: span 2;
          min-height: 310px;
        }

        .card-topline {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 38px;
          color: #7192a1;
          font-size: 0.73rem;
        }

        .card-state {
          color: #8cebc5;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .marketplace-card h3 {
          margin: 11px 0 13px;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          letter-spacing: -0.035em;
        }

        .marketplace-card p {
          max-width: 680px;
          color: #a5bbc6;
          line-height: 1.7;
        }

        .card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: auto;
          padding-top: 28px;
        }

        .card-primary,
        .card-secondary {
          border-radius: 999px;
          padding: 12px 16px;
          font-size: 0.88rem;
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

        .workflow-section {
          padding-bottom: 88px;
        }

        .workflow-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 13px;
        }

        .workflow-grid article {
          min-height: 220px;
          padding: 22px;
          border: 1px solid rgba(103, 194, 220, 0.15);
          border-radius: 21px;
          background: rgba(10, 30, 45, 0.72);
        }

        .workflow-grid > article > span {
          color: #5ed0e9;
          font-size: 0.75rem;
        }

        .workflow-grid h3 {
          margin: 44px 0 11px;
          font-size: 1.35rem;
        }

        .workflow-grid p {
          color: #95acb7;
          line-height: 1.62;
        }

        .architecture-section {
          padding-bottom: 88px;
        }

        .architecture-card {
          padding: clamp(28px, 5vw, 54px);
          border: 1px solid rgba(116, 204, 227, 0.18);
          border-radius: 30px;
          background:
            radial-gradient(circle at top left, rgba(48, 171, 204, 0.1), transparent 42%),
            linear-gradient(145deg, rgba(14, 38, 55, 0.95), rgba(7, 23, 36, 0.92));
        }

        .architecture-card h2 {
          max-width: 850px;
          margin: 13px 0 30px;
          font-size: clamp(2.3rem, 5vw, 4.5rem);
          letter-spacing: -0.045em;
        }

        .architecture-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .architecture-grid article {
          min-height: 150px;
          padding: 19px;
          border: 1px solid rgba(111, 198, 221, 0.13);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.022);
        }

        .architecture-grid span {
          display: block;
          color: #7798a7;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .architecture-grid strong {
          display: block;
          margin-top: 36px;
          line-height: 1.47;
        }

        .boundary-section {
          padding-bottom: 82px;
        }

        .boundary-heading {
          max-width: 840px;
          margin-bottom: 30px;
        }

        .boundary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .boundary-grid article {
          border-left: 3px solid #dfba58;
          border-radius: 0 17px 17px 0;
          padding: 20px;
          background: rgba(205, 152, 31, 0.07);
        }

        .boundary-grid span {
          color: #e5c66d;
          font-size: 0.71rem;
          font-weight: 900;
          letter-spacing: 0.09em;
        }

        .boundary-grid p {
          margin: 12px 0 0;
          color: #bcb28e;
          line-height: 1.62;
        }

        .final-cta {
          padding: clamp(34px, 6vw, 66px);
          border: 1px solid rgba(117, 205, 228, 0.19);
          border-radius: 32px;
          text-align: center;
          background:
            radial-gradient(circle at top, rgba(56, 173, 205, 0.11), transparent 48%),
            rgba(10, 30, 46, 0.84);
        }

        .final-cta h2 {
          max-width: 920px;
          margin: 13px auto 17px;
          font-size: clamp(2.3rem, 5vw, 4.7rem);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .final-cta p {
          max-width: 810px;
          margin: 0 auto;
          color: #aabec9;
          line-height: 1.75;
        }

        .final-action-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 11px;
          margin-top: 32px;
        }

        .final-action-grid a {
          border: 1px solid rgba(126, 207, 228, 0.22);
          border-radius: 16px;
          padding: 15px;
          color: #dcf7ff;
          background: rgba(255, 255, 255, 0.025);
          font-weight: 900;
          text-decoration: none;
        }

        .final-action-grid a:hover {
          border-color: rgba(126, 207, 228, 0.52);
          background: rgba(82, 190, 219, 0.08);
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
          .marketplace-status {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .architecture-grid,
          .boundary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 780px) {
          .marketplace-grid,
          .workflow-grid,
          .architecture-grid,
          .boundary-grid,
          .final-action-grid {
            grid-template-columns: 1fr;
          }

          .marketplace-card:last-child {
            grid-column: auto;
          }

          .marketplace-card {
            min-height: 330px;
          }
        }

        @media (max-width: 600px) {
          .content-shell {
            width: min(100% - 24px, 1180px);
            padding-top: 52px;
          }

          .marketplace-status {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .hero-topline {
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
