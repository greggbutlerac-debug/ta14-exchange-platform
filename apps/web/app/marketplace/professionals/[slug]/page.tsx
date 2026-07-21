import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type ProfessionalRecord = {
  slug: string;
  name: string;
  title: string;
  organization: string;
  location: string;
  availability: string;
  verification: string;
  summary: string;
  domains: string[];
  qualifications: string[];
  governedRecords: number;
  routesBuilt: number;
  independentReviews: number;
  replaySuccess: string;
  continuityScore: string;
  routeMaturity: string;
  evidenceHistory: string[];
  portfolio: {
    title: string;
    type: string;
    description: string;
    status: string;
  }[];
  reviewHistory: {
    title: string;
    scope: string;
    result: string;
    date: string;
  }[];
  proofBoundaries: string[];
};

const professionals: ProfessionalRecord[] = [
  {
    slug: 'mara-ellington',
    name: 'Mara Ellington',
    title: 'Governance Route Architect',
    organization: 'Independent Governance Practice',
    location: 'United States',
    availability: 'Available for scoped engagements',
    verification: 'Identity verified',
    summary:
      'Designs consequential execution routes, authority boundaries, evidence requirements, and replay cases for financial, organizational, and AI-assisted decisions.',
    domains: [
      'AI Governance',
      'Financial Execution Governance',
      'Authority Governance',
      'Evidence Continuity',
    ],
    qualifications: [
      'Consequential execution design',
      'Route architecture',
      'Approval and authority separation',
      'Replay-case construction',
      'Independent architecture review',
    ],
    governedRecords: 18,
    routesBuilt: 11,
    independentReviews: 7,
    replaySuccess: '96%',
    continuityScore: 'Strong',
    routeMaturity: 'Demonstrated',
    evidenceHistory: [
      'Identity and organization record verified',
      'Public methodology statement preserved',
      'Three portfolio artifacts independently reviewed',
      'Conflict disclosure on file',
      'Current availability declaration dated July 21, 2026',
    ],
    portfolio: [
      {
        title: 'Vendor Payment Authority Route',
        type: 'Governance Route',
        description:
          'Bounded route for procurement authority, beneficiary identity, financial approval, and execution release.',
        status: 'Verified demonstration',
      },
      {
        title: 'Public AI Disclosure Route',
        type: 'Governance Route',
        description:
          'Publication route requiring source attribution, disclosure, review authority, and challenge handling.',
        status: 'Reviewed',
      },
      {
        title: 'Evidence Continuity Checklist',
        type: 'Method Artifact',
        description:
          'Reusable checklist for custody, source identity, version state, timestamp, and transfer continuity.',
        status: 'Published',
      },
    ],
    reviewHistory: [
      {
        title: 'Financial Approval Architecture Review',
        scope: 'Authority, evidence continuity, and replay states',
        result: 'Passed with bounded corrections',
        date: 'July 2026',
      },
      {
        title: 'Public AI Publication Route Review',
        scope: 'Disclosure, attribution, and escalation',
        result: 'Passed',
        date: 'June 2026',
      },
      {
        title: 'Cross-Organization Approval Route',
        scope: 'Identity and execution authority',
        result: 'HOLD pending authority correction',
        date: 'May 2026',
      },
    ],
    proofBoundaries: [
      'Profile verification does not certify legal competence.',
      'Replay success is limited to preserved test cases.',
      'Portfolio status does not imply universal applicability.',
      'Marketplace reputation does not replace engagement-specific review.',
    ],
  },
  {
    slug: 'daniel-cho',
    name: 'Daniel Cho',
    title: 'Environmental Record Steward',
    organization: 'Building Evidence Collaborative',
    location: 'Canada',
    availability: 'Limited availability',
    verification: 'Identity and organization verified',
    summary:
      'Structures attributable environmental records, contributor roles, continuity controls, and bounded interpretation workflows for buildings and facilities.',
    domains: [
      'Environmental Integrity Governance',
      'Building Records',
      'Indoor Environmental Quality',
      'Evidence Stewardship',
    ],
    qualifications: [
      'Environmental record architecture',
      'Contributor-role design',
      'Sensor and service-record continuity',
      'Governed interpretation',
      'Correction and supersession workflows',
    ],
    governedRecords: 31,
    routesBuilt: 6,
    independentReviews: 12,
    replaySuccess: '93%',
    continuityScore: 'Very strong',
    routeMaturity: 'Operational pilot',
    evidenceHistory: [
      'Identity and organization record verified',
      'Record-steward methodology published',
      'Six governed-record templates preserved',
      'Independent conflict disclosure on file',
      'Current availability declaration dated July 21, 2026',
    ],
    portfolio: [
      {
        title: 'Daily Building Environmental Record',
        type: 'Governed Record',
        description:
          'Daily preservation structure for sensor, service, occupancy, and environmental evidence.',
        status: 'Pilot reviewed',
      },
      {
        title: 'Hospital Environmental Record Schema',
        type: 'Record Framework',
        description:
          'Contributor, source, interpretation, correction, and preservation architecture for hospital environments.',
        status: 'Demonstration',
      },
      {
        title: 'Interpretation Boundary Protocol',
        type: 'Method Artifact',
        description:
          'Separates source record, bounded interpretation, diagnosis, attribution, and optimization.',
        status: 'Published',
      },
    ],
    reviewHistory: [
      {
        title: 'Building Record Continuity Review',
        scope: 'Source attribution and daily preservation',
        result: 'Passed',
        date: 'July 2026',
      },
      {
        title: 'Hospital Record Interpretation Review',
        scope: 'Interpretation and diagnosis separation',
        result: 'Passed with corrections',
        date: 'June 2026',
      },
      {
        title: 'Sensor Continuity Challenge',
        scope: 'Timestamp conflict and source replacement',
        result: 'Resolved',
        date: 'May 2026',
      },
    ],
    proofBoundaries: [
      'Environmental records do not diagnose occupants.',
      'Record continuity does not prove causation.',
      'Profile verification does not certify every domain claim.',
      'Interpretation remains limited to preserved evidence.',
    ],
  },
  {
    slug: 'nina-patel',
    name: 'Nina Patel',
    title: 'Independent Governance Reviewer',
    organization: 'Patel Review Studio',
    location: 'United Kingdom',
    availability: 'Open for independent review',
    verification: 'Identity verified',
    summary:
      'Performs bounded independent reviews of governance architectures, evidence chains, route claims, and verification packages.',
    domains: [
      'Independent Review',
      'Evidence Integrity',
      'AI Governance',
      'Route Verification',
    ],
    qualifications: [
      'Architecture gap review',
      'Claim-boundary review',
      'Evidence-chain review',
      'Challenge-case design',
      'Verification-package assessment',
    ],
    governedRecords: 14,
    routesBuilt: 3,
    independentReviews: 24,
    replaySuccess: '98%',
    continuityScore: 'Strong',
    routeMaturity: 'Reviewer track',
    evidenceHistory: [
      'Identity record verified',
      'Review methodology preserved',
      'Twenty-four review summaries logged',
      'Independence declaration on file',
      'Current availability declaration dated July 21, 2026',
    ],
    portfolio: [
      {
        title: 'Runtime Governance Gap Review',
        type: 'Independent Review',
        description:
          'Bounded review of authority, refusal, continuity, execution, and outcome claims.',
        status: 'Completed',
      },
      {
        title: 'Evidence Integrity Challenge Suite',
        type: 'Review Artifact',
        description:
          'Challenge cases for stale, missing, contradictory, or unattributed evidence.',
        status: 'Published',
      },
      {
        title: 'Certification Claim Boundary Review',
        type: 'Independent Review',
        description:
          'Assesses whether public claims exceed testing, documentation, or review scope.',
        status: 'Completed',
      },
    ],
    reviewHistory: [
      {
        title: 'Governed Multi-Agent Route Review',
        scope: 'Identity, authority, commit, and outcome',
        result: 'Passed with bounded exceptions',
        date: 'July 2026',
      },
      {
        title: 'Evidence Maturity Review',
        scope: 'Assumption drift and guardian state',
        result: 'Passed',
        date: 'June 2026',
      },
      {
        title: 'Runtime Refusal Architecture',
        scope: 'Refusal and escalation continuity',
        result: 'Passed',
        date: 'June 2026',
      },
    ],
    proofBoundaries: [
      'Independent review is limited to the declared scope.',
      'A passed review is not legal certification.',
      'Review history does not guarantee future performance.',
      'Unreviewed claims remain the responsibility of the claimant.',
    ],
  },
];

function getProfessional(slug: string) {
  return professionals.find((professional) => professional.slug === slug);
}

export function generateStaticParams() {
  return professionals.map((professional) => ({
    slug: professional.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const professional = getProfessional(slug);

  if (!professional) {
    return {
      title: 'Marketplace Professional',
    };
  }

  return {
    title: professional.name,
    description: professional.summary,
  };
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
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

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 3 5 6v5c0 4.7 2.9 8.2 7 10 4.1-1.8 7-5.3 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
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

export default async function ProfessionalProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const professional = getProfessional(slug);

  if (!professional) {
    notFound();
  }

  return (
    <main className="profilePage">
      <div className="backgroundLayer" aria-hidden="true">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="star starOne" />
        <div className="star starTwo" />
        <div className="star starThree" />
      </div>

      <section className="heroSection">
        <div className="pageShell">
          <Link className="backLink" href="/marketplace#professionals">
            <span aria-hidden="true">←</span>
            Back to Marketplace Professionals
          </Link>

          <div className="heroGrid">
            <div>
              <div className="identityRow">
                <div className="avatar" aria-hidden="true">
                  {professional.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </div>

                <div>
                  <span className="verificationBadge">
                    <ShieldIcon />
                    {professional.verification}
                  </span>
                  <h1>{professional.name}</h1>
                  <p className="roleLine">
                    {professional.title} · {professional.organization}
                  </p>
                </div>
              </div>

              <p className="heroLead">{professional.summary}</p>

              <div className="heroMeta">
                <span>{professional.location}</span>
                <span>{professional.availability}</span>
                <span>{professional.routeMaturity}</span>
              </div>

              <div className="heroActions">
                <a className="primaryButton" href="#contact">
                  Request contact
                  <ArrowIcon />
                </a>
                <a className="secondaryButton" href="#portfolio">
                  Review portfolio
                </a>
              </div>

              <div className="boundaryNotice">
                <AlertIcon />
                <span>
                  This profile is a demonstration record. Contact requests,
                  messaging, contracting, credential upload, and payment
                  workflows are not connected yet.
                </span>
              </div>
            </div>

            <aside className="scoreCard" aria-label="Evidence-based reputation">
              <div className="scoreHeader">
                <span>EVIDENCE-BASED REPUTATION</span>
                <strong>Not likes. Not stars. Preserved work history.</strong>
              </div>

              <div className="scoreGrid">
                <div>
                  <strong>{professional.governedRecords}</strong>
                  <span>Governed records</span>
                </div>
                <div>
                  <strong>{professional.routesBuilt}</strong>
                  <span>Routes built</span>
                </div>
                <div>
                  <strong>{professional.independentReviews}</strong>
                  <span>Independent reviews</span>
                </div>
                <div>
                  <strong>{professional.replaySuccess}</strong>
                  <span>Replay success</span>
                </div>
              </div>

              <dl>
                <div>
                  <dt>Continuity</dt>
                  <dd>{professional.continuityScore}</dd>
                </div>
                <div>
                  <dt>Route maturity</dt>
                  <dd>{professional.routeMaturity}</dd>
                </div>
                <div>
                  <dt>Availability</dt>
                  <dd>{professional.availability}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="sectionBlock">
        <div className="pageShell twoColumnLayout">
          <div className="mainColumn">
            <article className="contentCard">
              <span className="sectionKicker">DOMAINS</span>
              <h2>Declared fields of practice</h2>

              <div className="chipList">
                {professional.domains.map((domain) => (
                  <span className="chip" key={domain}>
                    {domain}
                  </span>
                ))}
              </div>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">QUALIFICATIONS</span>
              <h2>Declared competence</h2>

              <div className="checkList">
                {professional.qualifications.map((qualification) => (
                  <div className="checkItem" key={qualification}>
                    <CheckIcon />
                    <span>{qualification}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard" id="portfolio">
              <span className="sectionKicker">PORTFOLIO</span>
              <h2>Preserved work examples</h2>

              <div className="portfolioGrid">
                {professional.portfolio.map((item) => (
                  <div className="portfolioCard" key={item.title}>
                    <div className="portfolioTopline">
                      <span>{item.type}</span>
                      <strong>{item.status}</strong>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">REVIEW HISTORY</span>
              <h2>Independent review record</h2>

              <div className="reviewList">
                {professional.reviewHistory.map((review) => (
                  <div className="reviewItem" key={`${review.title}-${review.date}`}>
                    <div>
                      <h3>{review.title}</h3>
                      <p>{review.scope}</p>
                    </div>
                    <div className="reviewResult">
                      <strong>{review.result}</strong>
                      <span>{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard proofCard">
              <span className="sectionKicker">PROOF BOUNDARIES</span>
              <h2>What this profile does not prove</h2>

              <div className="boundaryList">
                {professional.proofBoundaries.map((boundary) => (
                  <div className="boundaryItem" key={boundary}>
                    <AlertIcon />
                    <span>{boundary}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="sideColumn">
            <div className="sideCard">
              <span className="sectionKicker">EVIDENCE HISTORY</span>
              <h3>Preserved profile evidence</h3>

              <div className="smallList">
                {professional.evidenceHistory.map((item) => (
                  <div key={item}>
                    <CheckIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sideCard">
              <span className="sectionKicker">ENGAGEMENT FIT</span>
              <h3>Appropriate uses</h3>

              <div className="smallList">
                {[
                  'Scoped architecture work',
                  'Independent review',
                  'Governed record design',
                  'Replay and challenge cases',
                  'Evidence continuity review',
                ].map((item) => (
                  <div key={item}>
                    <CheckIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sideCard governanceCard">
              <span className="sectionKicker">PROFILE STATUS</span>
              <h3>Current record state</h3>

              <div className="statusList">
                <div>
                  <span>Identity</span>
                  <strong>VERIFIED</strong>
                </div>
                <div>
                  <span>Organization</span>
                  <strong>
                    {professional.verification.includes('organization')
                      ? 'VERIFIED'
                      : 'DECLARED'}
                  </strong>
                </div>
                <div>
                  <span>Portfolio</span>
                  <strong>PRESERVED</strong>
                </div>
                <div>
                  <span>Availability</span>
                  <strong>CURRENT</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="sectionBlock sectionTint" id="contact">
        <div className="pageShell contactPanel">
          <div>
            <span className="sectionKicker">CONTACT REQUEST</span>
            <h2>Open a governed conversation.</h2>
            <p>
              The connected workflow will require the requester to declare the
              problem, desired scope, evidence available, timing, budget,
              visibility, conflicts, and intended deliverable before contact is
              released.
            </p>

            <div className="contactRequirements">
              {[
                'Declared governance need',
                'Intended scope',
                'Evidence available',
                'Budget and timing',
                'Conflict disclosure',
                'Visibility preference',
              ].map((item) => (
                <div key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="contactAction">
            <span>CONTACT WORKFLOW NOT CONNECTED</span>
            <button type="button" disabled>
              Request governed contact
            </button>
            <small>
              This control remains disabled until authenticated messaging and
              contact permissions are implemented.
            </small>
          </div>
        </div>
      </section>

      <section className="finalSection">
        <div className="pageShell finalPanel">
          <div>
            <span className="sectionKicker">MARKETPLACE PRINCIPLE</span>
            <h2>Professional reputation should be based on preserved work.</h2>
            <p>
              The Marketplace records qualifications, governed artifacts,
              independent reviews, replay results, continuity history, and
              challenge resolution instead of popularity signals.
            </p>
          </div>

          <div className="finalActions">
            <Link className="primaryButton" href="/marketplace/post-a-need">
              Post a Governance Need
              <ArrowIcon />
            </Link>
            <Link className="secondaryButton" href="/marketplace">
              Return to Marketplace
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

        .profilePage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 12% 8%, rgba(37, 185, 189, 0.15), transparent 30%),
            radial-gradient(circle at 86% 18%, rgba(98, 169, 255, 0.12), transparent 28%),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .profilePage::before {
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
          width: 380px;
          height: 380px;
          border-radius: 50%;
          filter: blur(90px);
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
          background: var(--blue);
          animation-delay: 3s;
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

        .starOne {
          top: 7%;
          left: 24%;
        }

        .starTwo {
          top: 16%;
          right: 14%;
          animation-delay: 1.2s;
        }

        .starThree {
          top: 44%;
          left: 7%;
          animation-delay: 2.4s;
        }

        .pageShell {
          position: relative;
          z-index: 2;
          width: min(1160px, calc(100% - 40px));
          margin: 0 auto;
        }

        .heroSection {
          padding: 86px 0 90px;
        }

        .backLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 52px;
          color: var(--muted);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 700;
          transition: color 180ms ease, transform 180ms ease;
        }

        .backLink:hover {
          color: var(--teal);
          transform: translateX(-3px);
        }

        .heroGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.72fr);
          gap: 58px;
          align-items: start;
        }

        .identityRow {
          display: flex;
          gap: 22px;
          align-items: center;
        }

        .avatar {
          flex: 0 0 auto;
          width: 96px;
          height: 96px;
          display: grid;
          place-items: center;
          border: 1px solid var(--border-strong);
          border-radius: 28px;
          color: #031114;
          background: linear-gradient(135deg, var(--teal), #b2f7f1);
          box-shadow: 0 18px 46px rgba(37, 185, 189, 0.24);
          font-size: 1.55rem;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .verificationBadge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 30px;
          padding: 0 10px;
          border: 1px solid rgba(103, 224, 223, 0.2);
          border-radius: 999px;
          color: var(--teal);
          background: rgba(103, 224, 223, 0.06);
          font-size: 0.67rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          margin: 12px 0 8px;
          font-size: clamp(3rem, 6vw, 6.2rem);
          line-height: 0.96;
          letter-spacing: -0.058em;
          text-wrap: balance;
        }

        .roleLine {
          margin: 0;
          color: #d8e6e9;
          font-size: 1rem;
          line-height: 1.6;
        }

        .heroLead {
          max-width: 780px;
          margin-top: 26px;
          color: var(--muted);
          font-size: clamp(1.05rem, 1.6vw, 1.28rem);
          line-height: 1.75;
        }

        .heroMeta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        .heroMeta span {
          display: inline-flex;
          align-items: center;
          min-height: 32px;
          padding: 0 11px;
          border: 1px solid rgba(118, 213, 220, 0.14);
          border-radius: 999px;
          color: #cfe0e3;
          background: rgba(255, 255, 255, 0.018);
          font-size: 0.75rem;
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

        .primaryButton:hover {
          box-shadow: 0 16px 42px rgba(37, 185, 189, 0.34);
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

        .scoreCard {
          padding: 24px;
          border: 1px solid var(--border-strong);
          border-radius: 26px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.13), transparent 30%),
            linear-gradient(145deg, rgba(9, 32, 44, 0.92), rgba(4, 17, 25, 0.97));
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
        }

        .scoreHeader {
          display: grid;
          gap: 6px;
          margin-bottom: 20px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(118, 213, 220, 0.15);
        }

        .scoreHeader span {
          color: var(--teal);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.15em;
        }

        .scoreHeader strong {
          line-height: 1.45;
        }

        .scoreGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .scoreGrid > div {
          display: grid;
          gap: 4px;
          padding: 14px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
        }

        .scoreGrid strong {
          color: var(--teal);
          font-size: 1.7rem;
        }

        .scoreGrid span {
          color: var(--muted);
          font-size: 0.72rem;
          line-height: 1.4;
        }

        dl {
          display: grid;
          gap: 0;
          margin: 18px 0 0;
        }

        dl > div {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 13px 0;
          border-bottom: 1px solid rgba(118, 213, 220, 0.09);
        }

        dl > div:last-child {
          border-bottom: 0;
        }

        dt {
          color: #78959d;
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        dd {
          margin: 0;
          color: #e4f0f2;
          font-size: 0.82rem;
          text-align: right;
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

        .twoColumnLayout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 0.38fr);
          gap: 26px;
          align-items: start;
        }

        .mainColumn,
        .sideColumn {
          display: grid;
          gap: 20px;
        }

        .sideColumn {
          position: sticky;
          top: 24px;
        }

        .contentCard,
        .sideCard {
          border: 1px solid var(--border);
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.08), transparent 28%),
            linear-gradient(145deg, rgba(10, 31, 43, 0.86), rgba(4, 18, 27, 0.95));
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.16);
        }

        .contentCard {
          padding: 30px;
          border-radius: 24px;
        }

        .sideCard {
          padding: 22px;
          border-radius: 20px;
        }

        .sectionKicker {
          display: inline-flex;
          color: var(--teal);
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .contentCard h2 {
          margin: 10px 0 20px;
          font-size: clamp(2rem, 3.7vw, 3.7rem);
          line-height: 1.08;
          letter-spacing: -0.045em;
          text-wrap: balance;
        }

        .sideCard h3 {
          margin: 10px 0 18px;
          font-size: 1.2rem;
        }

        .chipList {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(103, 224, 223, 0.16);
          border-radius: 999px;
          color: #dcebed;
          background: rgba(103, 224, 223, 0.06);
          font-size: 0.76rem;
          line-height: 1.4;
        }

        .checkList,
        .boundaryList {
          display: grid;
          gap: 12px;
        }

        .checkItem,
        .boundaryItem {
          display: flex;
          gap: 11px;
          align-items: flex-start;
          padding: 14px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
          color: #dcebed;
          line-height: 1.6;
        }

        .checkItem svg {
          flex: 0 0 auto;
          margin-top: 3px;
          color: var(--teal);
        }

        .boundaryItem svg {
          flex: 0 0 auto;
          margin-top: 3px;
          color: var(--gold);
        }

        .portfolioGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .portfolioCard {
          padding: 18px;
          border: 1px solid rgba(118, 213, 220, 0.13);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.018);
        }

        .portfolioCard:last-child {
          grid-column: 1 / -1;
        }

        .portfolioTopline {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 14px;
        }

        .portfolioTopline span {
          color: var(--teal);
          font-size: 0.66rem;
          font-weight: 850;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .portfolioTopline strong {
          color: var(--gold);
          font-size: 0.66rem;
        }

        .portfolioCard h3 {
          margin-bottom: 8px;
          font-size: 1.05rem;
        }

        .portfolioCard p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .reviewList {
          display: grid;
          gap: 12px;
        }

        .reviewItem {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          padding: 16px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.018);
        }

        .reviewItem h3 {
          margin-bottom: 6px;
          font-size: 1rem;
        }

        .reviewItem p {
          margin: 0;
          color: var(--muted);
          line-height: 1.55;
        }

        .reviewResult {
          display: grid;
          gap: 6px;
          justify-items: end;
          align-content: start;
          text-align: right;
        }

        .reviewResult strong {
          color: var(--teal);
          font-size: 0.78rem;
        }

        .reviewResult span {
          color: #78959d;
          font-size: 0.72rem;
        }

        .proofCard {
          border-color: rgba(255, 216, 120, 0.22);
          background:
            radial-gradient(circle at 0 0, rgba(255, 216, 120, 0.08), transparent 28%),
            linear-gradient(145deg, rgba(35, 30, 18, 0.72), rgba(15, 18, 22, 0.95));
        }

        .smallList {
          display: grid;
          gap: 10px;
        }

        .smallList > div {
          display: flex;
          gap: 9px;
          align-items: flex-start;
          color: #dbe9eb;
          font-size: 0.78rem;
          line-height: 1.55;
        }

        .smallList svg {
          flex: 0 0 auto;
          margin-top: 2px;
          color: var(--teal);
        }

        .governanceCard {
          background:
            radial-gradient(circle at 0 0, rgba(188, 164, 255, 0.1), transparent 28%),
            linear-gradient(145deg, rgba(22, 23, 45, 0.84), rgba(4, 18, 27, 0.95));
        }

        .statusList {
          display: grid;
          gap: 10px;
        }

        .statusList > div {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 11px 12px;
          border: 1px solid rgba(188, 164, 255, 0.14);
          border-radius: 11px;
          background: rgba(188, 164, 255, 0.04);
        }

        .statusList span {
          color: #bcb3d5;
          font-size: 0.72rem;
        }

        .statusList strong {
          color: #e8e1ff;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
        }

        .contactPanel {
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

        .contactPanel h2,
        .finalPanel h2 {
          margin: 10px 0 16px;
          font-size: clamp(2.2rem, 4.4vw, 4.6rem);
          line-height: 1.05;
          letter-spacing: -0.05em;
          text-wrap: balance;
        }

        .contactPanel p,
        .finalPanel p {
          color: var(--muted);
          font-size: 1.02rem;
          line-height: 1.75;
        }

        .contactRequirements {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 26px;
        }

        .contactRequirements > div {
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

        .contactRequirements svg {
          flex: 0 0 auto;
          color: var(--teal);
        }

        .contactAction {
          display: grid;
          gap: 12px;
          padding: 22px;
          border: 1px solid rgba(255, 216, 120, 0.2);
          border-radius: 20px;
          background: rgba(255, 216, 120, 0.05);
        }

        .contactAction > span {
          color: var(--gold);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.13em;
        }

        .contactAction button {
          min-height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          color: #789098;
          background: rgba(255, 255, 255, 0.035);
          font-weight: 800;
          cursor: not-allowed;
        }

        .contactAction small {
          color: #a99f87;
          line-height: 1.5;
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
          max-width: 820px;
          margin: 0;
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

        @media (max-width: 980px) {
          .heroGrid,
          .twoColumnLayout,
          .contactPanel {
            grid-template-columns: 1fr;
          }

          .sideColumn {
            position: static;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .pageShell {
            width: min(100% - 24px, 1160px);
          }

          .heroSection {
            padding-top: 56px;
          }

          .backLink {
            margin-bottom: 38px;
          }

          .sectionBlock {
            padding: 78px 0;
          }

          .identityRow {
            align-items: flex-start;
            flex-direction: column;
          }

          .sideColumn,
          .portfolioGrid,
          .contactRequirements {
            grid-template-columns: 1fr;
          }

          .portfolioCard:last-child {
            grid-column: auto;
          }

          .reviewItem {
            grid-template-columns: 1fr;
          }

          .reviewResult {
            justify-items: start;
            text-align: left;
          }

          .contentCard {
            padding: 23px 19px;
          }

          .contactPanel,
          .finalPanel {
            padding: 28px 22px;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: clamp(2.8rem, 16vw, 4.2rem);
          }

          .avatar {
            width: 82px;
            height: 82px;
            border-radius: 24px;
          }

          .heroActions,
          .finalActions {
            align-items: stretch;
            flex-direction: column;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
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
