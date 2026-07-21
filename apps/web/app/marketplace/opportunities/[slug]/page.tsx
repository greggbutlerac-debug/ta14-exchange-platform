import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  marketplaceActions,
  marketplaceRoutes,
} from '../../../../lib/marketplace-routes';

type OpportunityRecord = {
  slug: string;
  title: string;
  domain: string;
  state: 'OPEN' | 'INVITATION ONLY' | 'PREVIEW';
  visibility: string;
  summary: string;
  problem: string;
  consequentialAction: string;
  deliverable: string;
  budget: string;
  timing: string;
  postedBy: string;
  postedDate: string;
  proposalDeadline: string;
  evidence: string[];
  gaps: string[];
  qualifications: string[];
  responsibilities: string[];
  proofBoundaries: string[];
  milestones: {
    title: string;
    description: string;
  }[];
};

const opportunityRecords: OpportunityRecord[] = [
  {
    slug: 'high-risk-vendor-payment-approval-route',
    title: 'High-Risk Vendor Payment Approval Route',
    domain: 'Financial Execution Governance',
    state: 'OPEN',
    visibility: 'Public demonstration opportunity',
    summary:
      'Design a bounded consequential execution route that prevents vendor payment when procurement authority, financial authority, beneficiary identity, or evidence continuity is unresolved.',
    problem:
      'The current approval process can collect multiple approvals without proving that the approving parties hold current authority, that the beneficiary is the intended recipient, or that the evidence presented belongs to the same transaction state.',
    consequentialAction:
      'Release or withhold a vendor payment valued at $27,500 or more.',
    deliverable:
      'A complete route architecture, declared decision logic, evidence requirements, authority checks, challenge states, replay cases, and bounded verification record.',
    budget: '$3,200 fixed scope',
    timing: 'Requested within 12 days',
    postedBy: 'Demonstration Organization',
    postedDate: 'July 21, 2026',
    proposalDeadline: 'Preview only - proposals are not yet connected',
    evidence: [
      'Demonstration purchase order',
      'Demonstration invoice',
      'Procurement approval record',
      'Finance approval record',
      'Beneficiary identity record',
    ],
    gaps: [
      'Current procurement authority has not been proven.',
      'Current finance authority has not been proven.',
      'Beneficiary identity is not yet bound to the approved vendor record.',
      'No replay record exists for conflicting approval states.',
    ],
    qualifications: [
      'AI governance architecture',
      'Financial controls',
      'Consequential execution design',
      'Evidence continuity',
      'Route verification and replay',
    ],
    responsibilities: [
      'Translate the declared problem into a bounded execution route.',
      'Separate evidence, authority, approval, verification, and execution roles.',
      'Define ALLOW, HOLD, DENY, and ESCALATE conditions.',
      'Create test cases for missing, stale, contradictory, and valid evidence.',
      'Declare what the route proves and what remains outside scope.',
    ],
    proofBoundaries: [
      'The route does not prove that an invoice is commercially reasonable.',
      'The route does not replace legal, accounting, tax, or sanctions review.',
      'The route does not execute payment by itself.',
      'Verification is limited to the declared cases and supplied evidence model.',
    ],
    milestones: [
      {
        title: 'Problem and Authority Review',
        description:
          'Confirm the consequential action, authority holders, evidence classes, exclusions, and route boundaries.',
      },
      {
        title: 'Route Architecture',
        description:
          'Draft the decision sequence, evidence gates, authority checks, and exception handling.',
      },
      {
        title: 'Replay and Challenge Cases',
        description:
          'Test valid, missing, stale, conflicting, and manipulated evidence scenarios.',
      },
      {
        title: 'Verification Package',
        description:
          'Preserve the route version, test results, limitations, reviewer identity, and declared proof boundaries.',
      },
    ],
  },
  {
    slug: 'hospital-environmental-record-framework',
    title: 'Hospital Environmental Record Framework',
    domain: 'Healthcare Environmental Governance',
    state: 'INVITATION ONLY',
    visibility: 'Invitation-only demonstration opportunity',
    summary:
      'Create a governed environmental record framework for a hospital environment with attributable contributors, continuity review, interpretation boundaries, and daily preservation.',
    problem:
      'Environmental data may exist across building systems, laboratories, facilities teams, clinicians, and external vendors without a governed record that preserves identity, continuity, interpretation scope, and proof boundaries.',
    consequentialAction:
      'Issue and preserve a hospital environmental record and governed interpretation that may inform operational review.',
    deliverable:
      'Record architecture, contributor roles, evidence schema, continuity controls, interpretation boundaries, review workflow, and preservation requirements.',
    budget: '$12,000 proposed budget',
    timing: 'Four-week target',
    postedBy: 'Demonstration Healthcare Organization',
    postedDate: 'July 21, 2026',
    proposalDeadline: 'Invitation workflow not yet connected',
    evidence: [
      'Building sensor exports',
      'HVAC service records',
      'Laboratory reports',
      'Room pressure records',
      'Facilities incident history',
    ],
    gaps: [
      'No unified record steward has been declared.',
      'Evidence continuity differs across source systems.',
      'Interpretations are not consistently separated from diagnosis.',
      'No shared proof-boundary language exists.',
    ],
    qualifications: [
      'Healthcare operations',
      'Environmental records',
      'Indoor environmental quality',
      'Evidence continuity',
      'Governed interpretation',
    ],
    responsibilities: [
      'Define the hospital environmental record structure.',
      'Separate source record, interpretation, diagnosis, and optimization.',
      'Declare bounded contributor roles and permissions.',
      'Define review, correction, supersession, and preservation states.',
      'Create a daily governed record workflow.',
    ],
    proofBoundaries: [
      'The framework does not diagnose a patient or occupant.',
      'The record does not prove causation without additional evidence.',
      'The framework does not replace clinical judgment.',
      'Interpretation remains limited to the evidence actually preserved.',
    ],
    milestones: [
      {
        title: 'Source and Contributor Mapping',
        description:
          'Identify source systems, responsible parties, evidence classes, and custody transitions.',
      },
      {
        title: 'Record Schema',
        description:
          'Define required fields, continuity controls, version states, and contributor permissions.',
      },
      {
        title: 'Interpretation Boundaries',
        description:
          'Separate what the record shows from diagnosis, attribution, and optimization.',
      },
      {
        title: 'Daily Preservation Workflow',
        description:
          'Create the repeatable process for issuance, review, correction, and archival.',
      },
    ],
  },
  {
    slug: 'hvac-baseline-post-intervention-record',
    title: 'HVAC Baseline and Post-Intervention Record',
    domain: 'HVAC Performance Governance',
    state: 'PREVIEW',
    visibility: 'Public demonstration opportunity',
    summary:
      'Create an evidence-governed workflow that preserves original operating state, declared diagnostic determinations, intervention evidence, and post-intervention performance comparison.',
    problem:
      'HVAC work is often performed without a complete baseline, without declared evidence-bound determinations, and without a post-intervention record proving what changed.',
    consequentialAction:
      'Authorize intervention, declare completion, and represent that system performance improved.',
    deliverable:
      'Baseline record, evidence requirements, diagnostic-determination structure, intervention record, post-state comparison, and bounded performance report.',
    budget: '$2,100 fixed scope',
    timing: 'Two-week target',
    postedBy: 'Demonstration Mechanical Contractor',
    postedDate: 'July 21, 2026',
    proposalDeadline: 'Preview only - proposals are not yet connected',
    evidence: [
      'Equipment identification',
      'Electrical measurements',
      'Airflow and static-pressure measurements',
      'Refrigerant-system measurements',
      'Pre-intervention and post-intervention video',
    ],
    gaps: [
      'Original state is not consistently preserved.',
      'Diagnostic determinations are often mixed with interventions.',
      'Performance claims are not tied to baseline comparison.',
      'Evidence timing and technician identity may be incomplete.',
    ],
    qualifications: [
      'HVAC diagnostics',
      'Performance measurement',
      'Evidence-governed records',
      'Refrigerant-system analysis',
      'Post-intervention verification',
    ],
    responsibilities: [
      'Define the non-invasive baseline sequence.',
      'Separate measurements from diagnostic determinations.',
      'Declare intervention authorization and execution evidence.',
      'Create post-intervention comparison requirements.',
      'State what improvement can and cannot be claimed.',
    ],
    proofBoundaries: [
      'The record does not guarantee future equipment life.',
      'The record does not prove causation beyond measured evidence.',
      'The record does not replace manufacturer requirements.',
      'Post-state comparison is limited to the declared test conditions.',
    ],
    milestones: [
      {
        title: 'Baseline Definition',
        description:
          'Declare required original-state evidence before intervention is authorized.',
      },
      {
        title: 'Determination Structure',
        description:
          'Separate observations, measurements, evidence-bound determinations, and exclusions.',
      },
      {
        title: 'Intervention Record',
        description:
          'Preserve authorization, technician identity, action, materials, and timestamps.',
      },
      {
        title: 'Post-State Comparison',
        description:
          'Compare performance against the original state under declared conditions.',
      },
    ],
  },
];

function findOpportunity(slug: string) {
  return opportunityRecords.find((record) => record.slug === slug);
}

export function generateStaticParams() {
  return opportunityRecords.map((record) => ({
    slug: record.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = findOpportunity(slug);

  if (!opportunity) {
    return {
      title: 'Marketplace Opportunity',
    };
  }

  return {
    title: opportunity.title,
    description: opportunity.summary,
  };
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
    >
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
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
    >
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
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
    >
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

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opportunity = findOpportunity(slug);

  if (!opportunity) {
    notFound();
  }

  return (
    <main className="opportunityPage">
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
          <Link className="backLink" href={marketplaceRoutes.opportunities}>
            <span aria-hidden="true">←</span>
            Back to Marketplace Opportunities
          </Link>

          <div className="heroGrid">
            <div className="heroCopy">
              <div className="heroTopline">
                <span className="stateBadge">{opportunity.state}</span>
                <span className="demoBadge">DEMONSTRATION RECORD</span>
              </div>

              <span className="kicker">{opportunity.domain}</span>
              <h1>{opportunity.title}</h1>
              <p className="heroLead">{opportunity.summary}</p>

              <div className="heroActions">
                <a className="primaryButton" href="#apply">
                  Review application boundary
                  <ArrowIcon />
                </a>
                <a className="secondaryButton" href="#scope">
                  Read full scope
                </a>
              </div>

              <div className="boundaryNotice">
                <AlertIcon />
                <span>
                  This is a demonstration opportunity record. Applications,
                  messaging, proposal submission, contracting, file exchange,
                  and payments are not yet connected.
                </span>
              </div>
            </div>

            <aside className="summaryCard" aria-label="Opportunity summary">
              <div className="summaryHeader">
                <span>OPPORTUNITY SUMMARY</span>
                <strong>{opportunity.visibility}</strong>
              </div>

              <dl>
                <div>
                  <dt>Budget</dt>
                  <dd>{opportunity.budget}</dd>
                </div>
                <div>
                  <dt>Timing</dt>
                  <dd>{opportunity.timing}</dd>
                </div>
                <div>
                  <dt>Posted by</dt>
                  <dd>{opportunity.postedBy}</dd>
                </div>
                <div>
                  <dt>Posted</dt>
                  <dd>{opportunity.postedDate}</dd>
                </div>
                <div>
                  <dt>Proposal status</dt>
                  <dd>{opportunity.proposalDeadline}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="sectionBlock" id="scope">
        <div className="pageShell contentGrid">
          <div className="mainColumn">
            <article className="contentCard">
              <span className="sectionKicker">THE PROBLEM</span>
              <h2>What must be governed</h2>
              <p>{opportunity.problem}</p>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">CONSEQUENTIAL ACTION</span>
              <h2>What may occur</h2>
              <p>{opportunity.consequentialAction}</p>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">REQUESTED DELIVERABLE</span>
              <h2>What must be produced</h2>
              <p>{opportunity.deliverable}</p>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">RESPONSIBILITIES</span>
              <h2>What the selected contributor must do</h2>

              <div className="checkList">
                {opportunity.responsibilities.map((item) => (
                  <div className="checkItem" key={item}>
                    <CheckIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">MILESTONES</span>
              <h2>Proposed work sequence</h2>

              <div className="milestoneList">
                {opportunity.milestones.map((milestone, index) => (
                  <div className="milestone" key={milestone.title}>
                    <div className="milestoneNumber">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3>{milestone.title}</h3>
                      <p>{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard proofCard">
              <span className="sectionKicker">PROOF BOUNDARIES</span>
              <h2>What the work must not overclaim</h2>

              <div className="boundaryList">
                {opportunity.proofBoundaries.map((item) => (
                  <div className="boundaryItem" key={item}>
                    <AlertIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="sideColumn">
            <div className="sideCard">
              <span className="sectionKicker">AVAILABLE EVIDENCE</span>
              <h3>Evidence already declared</h3>

              <div className="chipList">
                {opportunity.evidence.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="sideCard warningCard">
              <span className="sectionKicker">KNOWN GAPS</span>
              <h3>What remains unresolved</h3>

              <div className="smallList">
                {opportunity.gaps.map((item) => (
                  <div key={item}>
                    <AlertIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sideCard">
              <span className="sectionKicker">QUALIFICATIONS</span>
              <h3>Requested competence</h3>

              <div className="chipList">
                {opportunity.qualifications.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="sideCard governanceCard">
              <span className="sectionKicker">TA-14 DECISION STATES</span>
              <h3>Route outcomes</h3>

              <div className="decisionList">
                <span>ALLOW</span>
                <span>HOLD</span>
                <span>DENY</span>
                <span>ESCALATE</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="sectionBlock sectionTint" id="apply">
        <div className="pageShell applicationPanel">
          <div>
            <span className="sectionKicker">APPLICATION BOUNDARY</span>
            <h2>Apply with a bounded proposal, not a generic claim.</h2>
            <p>
              The connected workflow will require the applicant to declare
              relevant qualifications, proposed method, exclusions, conflicts,
              timing, price, deliverables, and the evidence needed to perform
              the work.
            </p>

            <div className="applicationRequirements">
              {[
                'Identity and organization',
                'Relevant qualifications',
                'Proposed method',
                'Declared exclusions',
                'Conflict disclosure',
                'Timeline and price',
                'Required evidence',
                'Proof-boundary agreement',
              ].map((item) => (
                <div key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="applicationAction">
            <span>APPLICATIONS NOT CONNECTED</span>
            <button type="button" disabled>
              Submit bounded proposal
            </button>
            <small>
              This control remains disabled until authenticated Marketplace
              proposals are implemented.
            </small>
          </div>
        </div>
      </section>

      <section className="finalSection">
        <div className="pageShell finalPanel">
          <div>
            <span className="sectionKicker">MARKETPLACE PRINCIPLE</span>
            <h2>
              The opportunity record preserves the problem before contributors
              propose the answer.
            </h2>
            <p>
              Scope, evidence, authority, consequence, qualifications,
              deliverables, and proof boundaries remain visible before work
              begins.
            </p>
          </div>

          <div className="finalActions">
            <Link
              aria-label={marketplaceActions.postNeed.description}
              className="primaryButton"
              href={marketplaceActions.postNeed.href}
            >
              Post a Governance Need
              <ArrowIcon />
            </Link>
            <Link
              className="secondaryButton"
              href={marketplaceRoutes.home}
            >
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
          --panel: rgba(8, 29, 40, 0.84);
          --border: rgba(118, 213, 220, 0.2);
          --border-strong: rgba(118, 213, 220, 0.42);
          --text: #f3fbfc;
          --muted: #a9c1c8;
          --teal: #67e0df;
          --blue: #62a9ff;
          --gold: #ffd878;
          --violet: #bca4ff;
          --red: #ff9d9d;
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

        .opportunityPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 12% 8%, rgba(37, 185, 189, 0.15), transparent 30%),
            radial-gradient(circle at 86% 18%, rgba(98, 169, 255, 0.12), transparent 28%),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .opportunityPage::before {
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

        .heroTopline {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 22px;
        }

        .stateBadge,
        .demoBadge {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 0 11px;
          border-radius: 999px;
          font-size: 0.64rem;
          font-weight: 850;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .stateBadge {
          color: #042125;
          background: var(--gold);
        }

        .demoBadge {
          color: var(--muted);
          border: 1px solid rgba(169, 193, 200, 0.18);
          background: rgba(169, 193, 200, 0.05);
        }

        .kicker,
        .sectionKicker {
          display: inline-flex;
          align-items: center;
          color: var(--teal);
          font-size: 0.75rem;
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
          font-size: clamp(3.2rem, 6.5vw, 6.8rem);
          line-height: 0.95;
          letter-spacing: -0.058em;
          text-wrap: balance;
        }

        .heroLead {
          max-width: 760px;
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

        .summaryCard {
          padding: 24px;
          border: 1px solid var(--border-strong);
          border-radius: 26px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.13), transparent 30%),
            linear-gradient(145deg, rgba(9, 32, 44, 0.92), rgba(4, 17, 25, 0.97));
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
        }

        .summaryHeader {
          display: grid;
          gap: 6px;
          margin-bottom: 20px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(118, 213, 220, 0.15);
        }

        .summaryHeader span {
          color: var(--teal);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.15em;
        }

        .summaryHeader strong {
          line-height: 1.45;
        }

        dl {
          display: grid;
          gap: 0;
          margin: 0;
        }

        dl > div {
          display: grid;
          gap: 5px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(118, 213, 220, 0.09);
        }

        dl > div:last-child {
          border-bottom: 0;
        }

        dt {
          color: #78959d;
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        dd {
          margin: 0;
          color: #e4f0f2;
          font-size: 0.9rem;
          line-height: 1.5;
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

        .contentGrid {
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

        .contentCard h2 {
          margin: 10px 0 14px;
          font-size: clamp(2rem, 3.7vw, 3.7rem);
          line-height: 1.08;
          letter-spacing: -0.045em;
          text-wrap: balance;
        }

        .contentCard > p {
          margin: 0;
          color: var(--muted);
          font-size: 1.02rem;
          line-height: 1.78;
        }

        .checkList,
        .boundaryList {
          display: grid;
          gap: 12px;
          margin-top: 24px;
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

        .proofCard {
          border-color: rgba(255, 216, 120, 0.22);
          background:
            radial-gradient(circle at 0 0, rgba(255, 216, 120, 0.08), transparent 28%),
            linear-gradient(145deg, rgba(35, 30, 18, 0.72), rgba(15, 18, 22, 0.95));
        }

        .milestoneList {
          display: grid;
          gap: 12px;
          margin-top: 24px;
        }

        .milestone {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 14px;
          align-items: start;
          padding: 16px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.018);
        }

        .milestoneNumber {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #031114;
          background: var(--teal);
          font-size: 0.7rem;
          font-weight: 900;
          box-shadow: 0 0 18px rgba(103, 224, 223, 0.24);
        }

        .milestone h3 {
          margin: 2px 0 7px;
          font-size: 1rem;
        }

        .milestone p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .sideCard {
          padding: 22px;
          border-radius: 20px;
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
          min-height: 32px;
          padding: 0 11px;
          border: 1px solid rgba(103, 224, 223, 0.16);
          border-radius: 999px;
          color: #dcebed;
          background: rgba(103, 224, 223, 0.06);
          font-size: 0.74rem;
          line-height: 1.4;
        }

        .warningCard {
          border-color: rgba(255, 216, 120, 0.2);
        }

        .smallList {
          display: grid;
          gap: 10px;
        }

        .smallList > div {
          display: flex;
          gap: 9px;
          align-items: flex-start;
          color: #dfd5bc;
          font-size: 0.78rem;
          line-height: 1.55;
        }

        .smallList svg {
          flex: 0 0 auto;
          margin-top: 2px;
          color: var(--gold);
        }

        .governanceCard {
          background:
            radial-gradient(circle at 0 0, rgba(188, 164, 255, 0.1), transparent 28%),
            linear-gradient(145deg, rgba(22, 23, 45, 0.84), rgba(4, 18, 27, 0.95));
        }

        .decisionList {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .decisionList span {
          display: grid;
          place-items: center;
          min-height: 38px;
          border: 1px solid rgba(188, 164, 255, 0.18);
          border-radius: 10px;
          color: #e8e1ff;
          background: rgba(188, 164, 255, 0.06);
          font-size: 0.7rem;
          font-weight: 850;
          letter-spacing: 0.08em;
        }

        .applicationPanel {
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

        .applicationPanel h2,
        .finalPanel h2 {
          margin: 10px 0 16px;
          font-size: clamp(2.2rem, 4.4vw, 4.6rem);
          line-height: 1.05;
          letter-spacing: -0.05em;
          text-wrap: balance;
        }

        .applicationPanel p,
        .finalPanel p {
          color: var(--muted);
          font-size: 1.02rem;
          line-height: 1.75;
        }

        .applicationRequirements {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 26px;
        }

        .applicationRequirements > div {
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

        .applicationRequirements svg {
          flex: 0 0 auto;
          color: var(--teal);
        }

        .applicationAction {
          display: grid;
          gap: 12px;
          padding: 22px;
          border: 1px solid rgba(255, 216, 120, 0.2);
          border-radius: 20px;
          background: rgba(255, 216, 120, 0.05);
        }

        .applicationAction > span {
          color: var(--gold);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.13em;
        }

        .applicationAction button {
          min-height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          color: #789098;
          background: rgba(255, 255, 255, 0.035);
          font-weight: 800;
          cursor: not-allowed;
        }

        .applicationAction small {
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

        @media (max-width: 980px) {
          .heroGrid,
          .contentGrid,
          .applicationPanel {
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

          .sideColumn,
          .applicationRequirements {
            grid-template-columns: 1fr;
          }

          .contentCard {
            padding: 23px 19px;
          }

          .applicationPanel,
          .finalPanel {
            padding: 28px 22px;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: clamp(2.8rem, 16vw, 4.2rem);
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

          .milestone {
            grid-template-columns: 1fr;
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
