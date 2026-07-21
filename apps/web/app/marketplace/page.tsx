import type { Metadata } from 'next';
import Link from 'next/link';

import {
  marketplaceActions,
  marketplaceRoutes,
} from '../../lib/marketplace-routes';

export const metadata: Metadata = {
  title: 'TA-14 AI Governance Exchange Marketplace',
  description:
    'Discover governance professionals, organizations, opportunities, records, reviews, and governed collaboration pathways inside the TA-14 AI Governance Exchange Marketplace.',
};

const categories = [
  {
    title: 'Governance Professionals',
    description:
      'Find independent architects, reviewers, verification specialists, domain experts, record stewards, and implementation partners.',
    href: marketplaceRoutes.professionals,
    eyebrow: 'PEOPLE',
    metric: '6 featured profiles',
  },
  {
    title: 'Governance Organizations',
    description:
      'Explore governance practices, review entities, verification laboratories, record institutions, and partner organizations.',
    href: marketplaceRoutes.organizations,
    eyebrow: 'INSTITUTIONS',
    metric: '6 featured organizations',
  },
  {
    title: 'Open Opportunities',
    description:
      'Browse governance needs, review requests, implementation scopes, licensing opportunities, and collaboration pathways.',
    href: marketplaceRoutes.opportunities,
    eyebrow: 'WORK',
    metric: 'Governed opportunities',
  },
  {
    title: 'Governed Records',
    description:
      'Explore environmental, atmospheric, building, hospital, HVAC, land, water, and laboratory record offerings.',
    href: marketplaceRoutes.records,
    eyebrow: 'RECORDS',
    metric: '8 record categories',
  },
  {
    title: 'Independent Reviews',
    description:
      'Read bounded architecture reviews, execution-route findings, continuity reviews, technical verifications, and domain assessments.',
    href: marketplaceRoutes.reviews,
    eyebrow: 'REVIEW',
    metric: '6 published reviews',
  },
  {
    title: 'Post a Governance Need',
    description:
      'Declare the problem, consequential action, required evidence, expected deliverable, budget, timing, and visibility.',
    href: marketplaceActions.postNeed.href,
    eyebrow: 'START HERE',
    metric: 'Guided intake',
  },
];

const featuredActivity = [
  {
    type: 'REVIEW',
    title: 'Runtime Refusal Architecture Review',
    detail: 'Passed with bounded corrections',
    href: '/marketplace/reviews/runtime-refusal-architecture-review',
  },
  {
    type: 'ORGANIZATION',
    title: 'Replay Integrity Lab',
    detail: 'Execution verification laboratory',
    href: '/marketplace/organizations/replay-integrity-lab',
  },
  {
    type: 'PROFESSIONAL',
    title: 'Nina Patel',
    detail: 'Independent governance reviewer',
    href: '/marketplace/professionals/nina-patel',
  },
  {
    type: 'RECORD',
    title: 'Building Environmental Record',
    detail: 'Daily governed environmental evidence',
    href: '/marketplace/records/building-environmental-record',
  },
];

const ecosystem = [
  {
    name: 'TA-14 AI Governance Registry',
    responsibility:
      'Register, preserve, version, and discover governance architectures.',
    state: 'Separate product',
  },
  {
    name: 'TA-14 AI Governance Exchange',
    responsibility:
      'Build, evaluate, test, and preserve governed execution routes.',
    state: 'Core platform',
  },
  {
    name: 'Marketplace',
    responsibility:
      'Connect architecture owners, reviewers, organizations, and governance needs.',
    state: 'This product',
  },
  {
    name: 'Partner Review Network',
    responsibility:
      'Provide independent bounded review, mapping, testing, and replication.',
    state: 'Connected layer',
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none">
      <path
        d="m5 12.5 4 4L19 7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 8v5M12 17.2v.1M10.3 3.7 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path
        d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MarketplaceLandingPage() {
  return (
    <main className="marketplacePage">
      <div className="backgroundLayer" aria-hidden="true">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="star starOne" />
        <div className="star starTwo" />
        <div className="star starThree" />
        <div className="line lineOne" />
        <div className="line lineTwo" />
      </div>

      <section className="heroSection">
        <div className="pageShell">
          <div className="heroGrid">
            <div>
              <span className="kicker">TA-14 AI GOVERNANCE EXCHANGE MARKETPLACE</span>
              <h1>Where governance architectures find work, review, evidence, and collaborators.</h1>
              <p className="heroLead">
                The Marketplace connects organizations with governance
                professionals, review entities, verification laboratories,
                record institutions, implementation partners, and architecture
                owners through declared scopes and preserved evidence.
              </p>

              <div className="heroActions">
                <Link
                  aria-label={marketplaceActions.postNeed.description}
                  className="primaryButton"
                  href={marketplaceActions.postNeed.href}
                >
                  Post a Governance Need
                  <ArrowIcon />
                </Link>
                <a className="secondaryButton" href="#marketplace-categories">
                  Explore the Marketplace
                </a>
              </div>

              <div className="boundaryNotice">
                <AlertIcon />
                <span>
                  The Marketplace structure is now visible, but live accounts,
                  search, matching, messaging, evidence rooms, contracting,
                  payment, licensing, reputation, and dispute workflows are not
                  fully connected yet.
                </span>
              </div>
            </div>

            <aside className="heroPanel">
              <div className="heroPanelHeader">
                <span>MARKETPLACE MODEL</span>
                <strong>Discover by declared role, scope, evidence, and review history.</strong>
              </div>

              {[
                ['Professionals', 'Independent people and domain specialists'],
                ['Organizations', 'Practices, labs, institutions, and review entities'],
                ['Opportunities', 'Governance needs, work, licensing, and collaboration'],
                ['Records', 'Governed evidence and interpretation offerings'],
                ['Reviews', 'Bounded findings, gaps, and verification history'],
                ['Engagement', 'Scoped contact, contracting, and delivery pathways'],
              ].map(([title, description], index) => (
                <div className="heroPanelRow" key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      <section className="sectionBlock sectionTint" id="marketplace-categories">
        <div className="pageShell">
          <div className="sectionHeading">
            <div>
              <span className="kicker">MARKETPLACE DIRECTORY</span>
              <h2>Enter through the category that matches your need.</h2>
            </div>
            <p>
              Each Marketplace path preserves a different responsibility.
              Professionals are not organizations. Reviews are not
              certifications. Records are not diagnoses. Opportunities are not
              execution authority.
            </p>
          </div>

          <div className="categoryGrid">
            {categories.map((category) => (
              <Link className="categoryCard" href={category.href} key={category.title}>
                <div className="categoryTopline">
                  <span>{category.eyebrow}</span>
                  <GridIcon />
                </div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <div className="categoryFooter">
                  <span>{category.metric}</span>
                  <strong>
                    Open
                    <ArrowIcon />
                  </strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock">
        <div className="pageShell activityLayout">
          <div>
            <span className="kicker">MARKETPLACE ACTIVITY</span>
            <h2>See what the ecosystem is preserving and reviewing.</h2>
            <p>
              The live Marketplace will surface recent profiles, organizations,
              open needs, record offerings, published reviews, and verified
              activity. The current cards are demonstration records already
              built into the Marketplace.
            </p>
          </div>

          <div className="activityList">
            {featuredActivity.map((item) => (
              <Link className="activityCard" href={item.href} key={item.title}>
                <span>{item.type}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </div>
                <ArrowIcon />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock sectionTint">
        <div className="pageShell">
          <div className="sectionHeading">
            <div>
              <span className="kicker">HOW THE MARKETPLACE WORKS</span>
              <h2>Bring the need. Declare the scope. Preserve the work.</h2>
            </div>
            <p>
              The Marketplace should not begin with vague introductions. It
              should begin with a declared governance need, consequential
              action, evidence package, expected deliverable, and reviewable
              engagement boundary.
            </p>
          </div>

          <div className="processGrid">
            {[
              ['01', 'Declare', 'State the problem, consequential action, evidence, boundaries, budget, and timing.'],
              ['02', 'Discover', 'Find professionals, organizations, records, and reviewers by declared scope and evidence.'],
              ['03', 'Match', 'Compare fit, conflicts, availability, methods, reviews, and proof boundaries.'],
              ['04', 'Engage', 'Open a governed contact route with permissions, terms, deliverables, and accountability.'],
              ['05', 'Deliver', 'Preserve submissions, versions, reviews, decisions, corrections, and final artifacts.'],
              ['06', 'Verify', 'Publish or retain bounded evidence of what was reviewed, delivered, and concluded.'],
            ].map(([number, title, description]) => (
              <article className="processCard" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock">
        <div className="pageShell ecosystemPanel">
          <div>
            <span className="kicker">TA-14 ECOSYSTEM SEPARATION</span>
            <h2>The Marketplace connects the products. It does not replace them.</h2>
            <p>
              The TA-14 AI Governance Registry remains a separate future product
              for permanent architecture registration, chronology, versions,
              documents, and discovery. The Marketplace connects architecture
              owners with work, review, licensing, services, and collaboration.
            </p>

            <div className="ecosystemList">
              {ecosystem.map((item) => (
                <div key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.responsibility}</p>
                  </div>
                  <span>{item.state}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="separationCard">
            <span>PRODUCT BOUNDARY</span>
            <h3>Registry and Marketplace remain distinct.</h3>
            <div className="smallList">
              {[
                'Registry records what an architecture is and when it was registered.',
                'Marketplace connects that architecture to people, organizations, work, review, and licensing.',
                'Exchange evaluates specific governed execution routes.',
                'Partner Review Network provides independent bounded review.',
              ].map((item) => (
                <div key={item}>
                  <CheckIcon />
                  <small>{item}</small>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="sectionBlock sectionTint">
        <div className="pageShell trustPanel">
          <div>
            <span className="kicker">MARKETPLACE TRUST MODEL</span>
            <h2>Trust should follow preserved evidence, not profile language.</h2>
            <p>
              The Marketplace distinguishes registration, documentation,
              identity verification, independent review, technical
              verification, delivery history, and execution authority. No one
              badge should silently imply all of them.
            </p>
          </div>

          <div className="trustGrid">
            {[
              ['REGISTERED', 'A Marketplace profile or record exists.'],
              ['DOCUMENTED', 'Supporting materials or methods were supplied.'],
              ['IDENTITY VERIFIED', 'A person or organization identity was checked.'],
              ['INDEPENDENTLY REVIEWED', 'A separate reviewer examined a declared scope.'],
              ['TECHNICALLY VERIFIED', 'A specific replay, signature, continuity, or dependency check passed.'],
              ['DELIVERED', 'A declared engagement produced preserved deliverables.'],
            ].map(([state, description]) => (
              <div key={state}>
                <strong>{state}</strong>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock">
        <div className="pageShell ctaPanel">
          <div>
            <span className="kicker">START WITH THE NEED</span>
            <h2>What governance work needs to be done?</h2>
            <p>
              Post the problem, consequential action, current evidence,
              expected deliverable, desired reviewer or specialist, budget,
              timing, visibility, and known conflicts. The Marketplace can then
              route the need without pretending that every expert, record, or
              organization is interchangeable.
            </p>

            <div className="requirementsGrid">
              {[
                'Governance need',
                'Consequential action',
                'Evidence available',
                'Scope and exclusions',
                'Expected deliverable',
                'Budget and timing',
                'Visibility preference',
                'Known conflicts',
              ].map((item) => (
                <div key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ctaActions">
            <Link
              aria-label={marketplaceActions.postNeed.description}
              className="primaryButton"
              href={marketplaceActions.postNeed.href}
            >
              Post a Governance Need
              <ArrowIcon />
            </Link>
            <Link className="secondaryButton" href={marketplaceRoutes.reviews}>
              Browse Independent Reviews
            </Link>
            <small>
              Live matching and engagement workflows will be connected after
              the Marketplace front-end architecture is complete.
            </small>
          </div>
        </div>
      </section>

      <section className="finalSection">
        <div className="pageShell finalPanel">
          <div>
            <span className="kicker">MARKETPLACE PRINCIPLE</span>
            <h2>Others review slivers. TA-14 reviews the route.</h2>
            <p>
              The Marketplace is where governed architectures, bounded
              professionals, independent reviewers, attributable organizations,
              preserved records, and consequential needs become discoverable
              without collapsing their responsibilities.
            </p>
          </div>

          <div className="finalActions">
            <Link
              aria-label={marketplaceActions.postNeed.description}
              className="primaryButton"
              href={marketplaceActions.postNeed.href}
            >
              Enter the Marketplace
              <ArrowIcon />
            </Link>
            <Link className="secondaryButton" href="/">
              Return to TA-14 Exchange
            </Link>
          </div>

          <div className="maxim">
            No admissible evidence. No admissible execution.
          </div>
        </div>
      </section>

      <style>{`
        :root {
          --bg: #041019;
          --border: rgba(118, 213, 220, 0.2);
          --border-strong: rgba(118, 213, 220, 0.42);
          --text: #f3fbfc;
          --muted: #a9c1c8;
          --teal: #67e0df;
          --blue: #62a9ff;
          --gold: #ffd878;
          --violet: #bca4ff;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--bg);
        }

        .marketplacePage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 12% 8%, rgba(37, 185, 189, 0.15), transparent 30%),
            radial-gradient(circle at 86% 18%, rgba(98, 169, 255, 0.12), transparent 28%),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .marketplacePage::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.22;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }

        .backgroundLayer {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .glow {
          position: absolute;
          width: 390px;
          height: 390px;
          border-radius: 50%;
          filter: blur(95px);
          opacity: 0.13;
          animation: glowPulse 9s ease-in-out infinite;
        }

        .glowOne {
          top: 4%;
          left: -130px;
          background: var(--teal);
        }

        .glowTwo {
          top: 40%;
          right: -150px;
          background: var(--violet);
          animation-delay: 3s;
        }

        .line {
          position: absolute;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(103, 224, 223, 0.58),
            transparent
          );
          filter: drop-shadow(0 0 7px rgba(103, 224, 223, 0.35));
          animation: lineMove 13s linear infinite;
        }

        .lineOne {
          top: 13%;
          left: -10%;
          width: 46vw;
          transform: rotate(17deg);
        }

        .lineTwo {
          top: 58%;
          right: -8%;
          width: 38vw;
          transform: rotate(-19deg);
          animation-delay: -6s;
        }

        .star {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 12px white;
          animation: twinkle 4.2s ease-in-out infinite;
        }

        .starOne { top: 7%; left: 24%; }
        .starTwo { top: 16%; right: 14%; animation-delay: 1.2s; }
        .starThree { top: 44%; left: 7%; animation-delay: 2.4s; }

        .pageShell {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .heroSection {
          padding: 112px 0 104px;
        }

        .heroGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(380px, 0.72fr);
          gap: 58px;
          align-items: center;
        }

        .kicker {
          display: inline-flex;
          color: var(--teal);
          font-size: 0.74rem;
          font-weight: 850;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          margin: 14px 0 24px;
          font-size: clamp(3.35rem, 6.8vw, 7rem);
          line-height: 0.94;
          letter-spacing: -0.063em;
          text-wrap: balance;
        }

        .heroLead {
          max-width: 780px;
          color: var(--muted);
          font-size: clamp(1.05rem, 1.6vw, 1.28rem);
          line-height: 1.75;
        }

        .heroActions,
        .finalActions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 32px;
        }

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 48px;
          padding: 0 20px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 0.94rem;
          font-weight: 800;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .primaryButton {
          color: #031114;
          background: linear-gradient(135deg, var(--teal), #b2f7f1);
          box-shadow: 0 12px 34px rgba(37, 185, 189, 0.24);
        }

        .secondaryButton {
          color: var(--text);
          border: 1px solid var(--border-strong);
          background: rgba(10, 30, 42, 0.64);
          backdrop-filter: blur(12px);
        }

        .primaryButton:hover,
        .secondaryButton:hover {
          transform: translateY(-2px);
        }

        .secondaryButton:hover {
          border-color: var(--teal);
          background: rgba(14, 42, 54, 0.9);
        }

        .boundaryNotice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          max-width: 760px;
          margin-top: 28px;
          padding: 14px 16px;
          border: 1px solid rgba(255, 216, 120, 0.22);
          border-radius: 14px;
          color: #eadfbf;
          background: rgba(255, 216, 120, 0.06);
          font-size: 0.85rem;
          line-height: 1.6;
        }

        .boundaryNotice svg {
          flex: 0 0 auto;
          margin-top: 2px;
          color: var(--gold);
        }

        .heroPanel {
          padding: 24px;
          border: 1px solid var(--border-strong);
          border-radius: 26px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.13), transparent 30%),
            linear-gradient(145deg, rgba(9, 32, 44, 0.92), rgba(4, 17, 25, 0.97));
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
        }

        .heroPanelHeader {
          display: grid;
          gap: 6px;
          margin-bottom: 20px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(118, 213, 220, 0.15);
        }

        .heroPanelHeader span {
          color: var(--teal);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.15em;
        }

        .heroPanelHeader strong {
          line-height: 1.45;
        }

        .heroPanelRow {
          display: grid;
          grid-template-columns: 34px minmax(94px, auto) 1fr;
          gap: 12px;
          align-items: center;
          padding: 13px 0;
          border-bottom: 1px solid rgba(118, 213, 220, 0.09);
        }

        .heroPanelRow:last-child {
          border-bottom: 0;
        }

        .heroPanelRow > span {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #031114;
          background: var(--teal);
          font-size: 0.7rem;
          font-weight: 900;
        }

        .heroPanelRow strong {
          font-size: 0.86rem;
        }

        .heroPanelRow small {
          color: var(--muted);
          line-height: 1.45;
        }

        .sectionBlock {
          position: relative;
          padding: 105px 0;
          scroll-margin-top: 70px;
        }

        .sectionTint {
          border-top: 1px solid rgba(118, 213, 220, 0.08);
          border-bottom: 1px solid rgba(118, 213, 220, 0.08);
          background: linear-gradient(
            180deg,
            rgba(9, 28, 39, 0.66),
            rgba(5, 18, 26, 0.45)
          );
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 480px);
          gap: 38px;
          align-items: end;
          margin-bottom: 48px;
        }

        .sectionHeading h2,
        .activityLayout h2,
        .ecosystemPanel h2,
        .trustPanel h2,
        .ctaPanel h2,
        .finalPanel h2 {
          margin: 10px 0 0;
          font-size: clamp(2.3rem, 4.6vw, 4.9rem);
          line-height: 1.04;
          letter-spacing: -0.052em;
          text-wrap: balance;
        }

        .sectionHeading p,
        .activityLayout > div:first-child p,
        .ecosystemPanel > div:first-child > p,
        .trustPanel > div:first-child p,
        .ctaPanel p,
        .finalPanel p {
          margin: 0;
          color: var(--muted);
          font-size: 1.03rem;
          line-height: 1.75;
        }

        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .categoryCard {
          display: grid;
          min-height: 305px;
          padding: 24px;
          border: 1px solid var(--border);
          border-radius: 20px;
          color: var(--text);
          text-decoration: none;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.08), transparent 28%),
            linear-gradient(145deg, rgba(10, 31, 43, 0.84), rgba(4, 18, 27, 0.95));
          box-shadow: 0 18px 46px rgba(0, 0, 0, 0.14);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .categoryCard:hover {
          transform: translateY(-4px);
          border-color: var(--border-strong);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.22);
        }

        .categoryTopline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .categoryTopline span {
          color: var(--teal);
          font-size: 0.66rem;
          font-weight: 850;
          letter-spacing: 0.12em;
        }

        .categoryTopline svg {
          color: var(--teal);
        }

        .categoryCard h3 {
          margin: 44px 0 14px;
          font-size: 1.55rem;
          letter-spacing: -0.025em;
        }

        .categoryCard p {
          margin: 0;
          color: var(--muted);
          line-height: 1.67;
        }

        .categoryFooter {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid rgba(118, 213, 220, 0.1);
        }

        .categoryFooter > span {
          color: #78959d;
          font-size: 0.72rem;
        }

        .categoryFooter strong {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--teal);
          font-size: 0.8rem;
        }

        .activityLayout {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(430px, 1.15fr);
          gap: 58px;
          align-items: start;
        }

        .activityLayout > div:first-child p {
          margin-top: 20px;
        }

        .activityList {
          display: grid;
          gap: 12px;
        }

        .activityCard {
          display: grid;
          grid-template-columns: 100px 1fr auto;
          gap: 15px;
          align-items: center;
          padding: 16px;
          border: 1px solid rgba(118, 213, 220, 0.14);
          border-radius: 14px;
          color: var(--text);
          text-decoration: none;
          background: rgba(255, 255, 255, 0.018);
          transition: border-color 180ms ease, transform 180ms ease;
        }

        .activityCard:hover {
          transform: translateX(3px);
          border-color: var(--border-strong);
        }

        .activityCard > span {
          color: var(--gold);
          font-size: 0.65rem;
          font-weight: 850;
          letter-spacing: 0.09em;
        }

        .activityCard > div {
          display: grid;
          gap: 5px;
        }

        .activityCard small {
          color: var(--muted);
        }

        .activityCard > svg {
          color: var(--teal);
        }

        .processGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .processCard {
          min-height: 245px;
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: linear-gradient(
            145deg,
            rgba(10, 31, 43, 0.8),
            rgba(4, 18, 27, 0.94)
          );
        }

        .processCard > span {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          color: #031114;
          background: var(--teal);
          font-size: 0.72rem;
          font-weight: 900;
        }

        .processCard h3 {
          margin: 36px 0 11px;
          font-size: 1.3rem;
        }

        .processCard p {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
        }

        .ecosystemPanel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.45fr);
          gap: 42px;
          align-items: start;
        }

        .ecosystemPanel > div:first-child > p {
          margin-top: 20px;
        }

        .ecosystemList {
          display: grid;
          gap: 10px;
          margin-top: 28px;
        }

        .ecosystemList > div {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          align-items: center;
          padding: 15px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
        }

        .ecosystemList > div > div {
          display: grid;
          gap: 5px;
        }

        .ecosystemList p {
          margin: 0;
          color: var(--muted);
          font-size: 0.8rem;
          line-height: 1.5;
        }

        .ecosystemList > div > span {
          color: var(--gold);
          font-size: 0.67rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .separationCard {
          padding: 24px;
          border: 1px solid rgba(188, 164, 255, 0.22);
          border-radius: 22px;
          background:
            radial-gradient(circle at 0 0, rgba(188, 164, 255, 0.12), transparent 30%),
            linear-gradient(145deg, rgba(22, 23, 45, 0.88), rgba(4, 18, 27, 0.96));
        }

        .separationCard > span {
          color: #d7c9ff;
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.12em;
        }

        .separationCard h3 {
          margin: 12px 0 20px;
          font-size: 1.55rem;
          line-height: 1.2;
        }

        .smallList {
          display: grid;
          gap: 12px;
        }

        .smallList > div {
          display: flex;
          gap: 9px;
          align-items: flex-start;
          color: #dcebed;
        }

        .smallList svg {
          flex: 0 0 auto;
          margin-top: 2px;
          color: var(--teal);
        }

        .smallList small {
          line-height: 1.55;
        }

        .trustPanel {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          gap: 50px;
          align-items: start;
        }

        .trustPanel > div:first-child p {
          margin-top: 20px;
        }

        .trustGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .trustGrid > div {
          display: grid;
          gap: 7px;
          padding: 14px;
          border: 1px solid rgba(118, 213, 220, 0.13);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
        }

        .trustGrid strong {
          color: var(--gold);
          font-size: 0.68rem;
          letter-spacing: 0.08em;
        }

        .trustGrid span {
          color: #d8cfb9;
          font-size: 0.76rem;
          line-height: 1.5;
        }

        .ctaPanel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 0.42fr);
          gap: 44px;
          align-items: center;
          padding: 34px;
          border: 1px solid var(--border-strong);
          border-radius: 28px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.12), transparent 26%),
            linear-gradient(145deg, rgba(9, 32, 44, 0.9), rgba(4, 17, 25, 0.96));
        }

        .ctaPanel p {
          margin-top: 18px;
        }

        .requirementsGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 26px;
        }

        .requirementsGrid > div {
          display: flex;
          gap: 9px;
          align-items: center;
          padding: 11px 12px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.018);
          color: #dcebed;
          font-size: 0.78rem;
        }

        .requirementsGrid svg {
          flex: 0 0 auto;
          color: var(--teal);
        }

        .ctaActions {
          display: grid;
          gap: 12px;
          align-content: center;
        }

        .ctaActions .primaryButton,
        .ctaActions .secondaryButton {
          width: 100%;
        }

        .ctaActions small {
          color: #8fa8ae;
          line-height: 1.55;
          text-align: center;
        }

        .finalSection {
          padding: 60px 0 80px;
        }

        .finalPanel {
          display: grid;
          gap: 30px;
          padding: 42px;
          border: 1px solid var(--border-strong);
          border-radius: 30px;
          background:
            radial-gradient(circle at 86% 12%, rgba(98, 169, 255, 0.13), transparent 32%),
            radial-gradient(circle at 10% 88%, rgba(103, 224, 223, 0.12), transparent 32%),
            linear-gradient(145deg, rgba(8, 30, 42, 0.95), rgba(3, 15, 23, 0.98));
        }

        .finalPanel p {
          max-width: 860px;
          margin-top: 18px;
        }

        .maxim {
          padding-top: 24px;
          border-top: 1px solid rgba(118, 213, 220, 0.14);
          color: var(--teal);
          font-size: 0.84rem;
          font-weight: 850;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.09;
            transform: scale(0.92);
          }
          50% {
            opacity: 0.17;
            transform: scale(1.08);
          }
        }

        @keyframes lineMove {
          0% {
            opacity: 0;
            translate: -12% 0;
          }
          20%,
          80% {
            opacity: 0.72;
          }
          100% {
            opacity: 0;
            translate: 38% 0;
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

        @media (max-width: 1020px) {
          .heroGrid,
          .sectionHeading,
          .activityLayout,
          .ecosystemPanel,
          .trustPanel,
          .ctaPanel {
            grid-template-columns: 1fr;
          }

          .categoryGrid,
          .processGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .pageShell {
            width: min(100% - 24px, 1180px);
          }

          .heroSection {
            padding: 78px 0 86px;
          }

          .sectionBlock {
            padding: 78px 0;
          }

          .categoryGrid,
          .processGrid,
          .trustGrid,
          .requirementsGrid {
            grid-template-columns: 1fr;
          }

          .heroPanelRow {
            grid-template-columns: 32px 1fr;
          }

          .heroPanelRow small {
            grid-column: 2;
          }

          .activityCard {
            grid-template-columns: 82px 1fr auto;
          }

          .ecosystemList > div {
            grid-template-columns: 1fr;
          }

          .ctaPanel,
          .finalPanel {
            padding: 28px 22px;
          }
        }

        @media (max-width: 520px) {
          h1 {
            font-size: clamp(2.8rem, 16vw, 4.3rem);
          }

          .heroActions,
          .finalActions {
            flex-direction: column;
            align-items: stretch;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          .activityCard {
            grid-template-columns: 1fr auto;
          }

          .activityCard > span {
            grid-column: 1 / -1;
          }

          .categoryCard {
            min-height: 285px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </main>
  );
}
