import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Independent Governance Reviews',
  description:
    'Explore bounded governance reviews, architecture assessments, evidence-chain reviews, replay checks, and implementation readiness findings inside the TA-14 AI Governance Exchange Marketplace.',
};

const reviews = [
  {
    slug: 'runtime-refusal-architecture-review',
    title: 'Runtime Refusal Architecture Review',
    subject: 'Bounded Runtime Governance Framework',
    reviewer: 'Patel Review Studio',
    reviewerType: 'Independent Review Entity',
    date: 'July 18, 2026',
    status: 'PUBLISHED',
    result: 'PASSED WITH BOUNDED CORRECTIONS',
    scope:
      'Refusal, escalation, witness continuity, receipt integrity, authority separation, and no-bind outcomes.',
    summary:
      'The reviewed architecture demonstrated a coherent refusal path and preserved no-bind evidence, but required clearer distinction between runtime standing and downstream execution authority.',
    strengths: [
      'Refusal before consequence',
      'Preserved no-bind receipts',
      'Explicit escalation state',
      'Declared authority boundaries',
    ],
    gaps: [
      'Standing expiration not fully specified',
      'Cross-system authority transfer needs evidence',
    ],
    artifacts: 8,
    findings: 12,
    openItems: 2,
    reviewClass: 'Architecture Review',
  },
  {
    slug: 'multi-agent-payment-route-review',
    title: 'Multi-Agent Payment Route Review',
    subject: 'Governed Vendor Payment Architecture',
    reviewer: 'Independent Governance Practice',
    reviewerType: 'Governance Architecture Practice',
    date: 'July 14, 2026',
    status: 'PUBLISHED',
    result: 'HOLD PENDING AUTHORITY CORRECTION',
    scope:
      'Identity, standing, procurement authority, finance authority, beneficiary evidence, commit integrity, and execution correspondence.',
    summary:
      'The route correctly refused progression when procurement authority and beneficiary evidence were incomplete. The architecture remained reviewable and independently replayable.',
    strengths: [
      'Clear HOLD logic',
      'Beneficiary evidence dependency',
      'Commit-state preservation',
      'Replayable route package',
    ],
    gaps: [
      'Procurement authority missing',
      'Finance authority not independently verified',
    ],
    artifacts: 11,
    findings: 14,
    openItems: 2,
    reviewClass: 'Execution Route Review',
  },
  {
    slug: 'building-record-continuity-review',
    title: 'Building Record Continuity Review',
    subject: 'Daily Building Environmental Record',
    reviewer: 'Building Evidence Collaborative',
    reviewerType: 'Environmental Record Institution',
    date: 'July 10, 2026',
    status: 'PUBLISHED',
    result: 'PASSED',
    scope:
      'Source attribution, timestamps, version transitions, sensor replacement continuity, correction history, and daily record preservation.',
    summary:
      'The record model preserved source changes and correction events without erasing prior state. The review confirmed that interpretation remained separated from diagnosis and optimization.',
    strengths: [
      'Daily continuity preserved',
      'Source replacement events recorded',
      'Prior states remain addressable',
      'Interpretation separated from diagnosis',
    ],
    gaps: [
      'Restricted-source disclosure policy should be expanded',
    ],
    artifacts: 15,
    findings: 9,
    openItems: 1,
    reviewClass: 'Record Continuity Review',
  },
  {
    slug: 'independent-route-replay-review',
    title: 'Independent Route Replay Review',
    subject: 'Consequential Execution Package',
    reviewer: 'Replay Integrity Lab',
    reviewerType: 'Execution Verification Laboratory',
    date: 'July 7, 2026',
    status: 'PUBLISHED',
    result: 'VERIFIED',
    scope:
      'Package integrity, Ed25519 signatures, SHA-256 digests, route identity, evidence dependencies, commit integrity, and execution-to-outcome correspondence.',
    summary:
      'The route package replayed to the same ALLOW decision. Evidence dependencies, signatures, receipt continuity, and execution correspondence were reproducible from the preserved package.',
    strengths: [
      'Decision reproducibility',
      'Signature verification',
      'Dependency continuity',
      'Execution correspondence',
    ],
    gaps: [
      'External clock source not independently anchored',
    ],
    artifacts: 19,
    findings: 10,
    openItems: 1,
    reviewClass: 'Technical Verification',
  },
  {
    slug: 'hospital-environment-boundary-review',
    title: 'Hospital Environmental Boundary Review',
    subject: 'Hospital Environmental Record Framework',
    reviewer: 'Clinical Environment Review Group',
    reviewerType: 'Healthcare Environmental Review Entity',
    date: 'July 3, 2026',
    status: 'PUBLISHED',
    result: 'PASSED WITH CORRECTIONS',
    scope:
      'Restricted evidence, contributor roles, environmental interpretation, non-diagnosis boundaries, correction handling, and disclosure controls.',
    summary:
      'The framework appropriately separated environmental evidence from patient diagnosis, but needed stronger language preventing inferred clinical causation from environmental records alone.',
    strengths: [
      'Restricted evidence roles',
      'Non-diagnosis boundary',
      'Correction and supersession logic',
      'Environmental interpretation controls',
    ],
    gaps: [
      'Clinical causation language too broad',
      'Disclosure events need stronger receipts',
    ],
    artifacts: 13,
    findings: 16,
    openItems: 2,
    reviewClass: 'Domain Boundary Review',
  },
  {
    slug: 'constitutional-governance-gap-review',
    title: 'Constitutional Governance Gap Review',
    subject: 'AI Governance Constitution and Runtime Model',
    reviewer: 'Bose Consequence Systems',
    reviewerType: 'Authority and Commit Governance Practice',
    date: 'June 28, 2026',
    status: 'PUBLISHED',
    result: 'PASSED WITH EXCEPTIONS',
    scope:
      'Constitutional authority, runtime standing, binding, commit, escalation, execution limits, and outcome accountability.',
    summary:
      'The constitution provided strong first principles and refusal logic. The review identified unresolved transfer conditions between constitutional approval and operational commit authority.',
    strengths: [
      'Constitutional first principles',
      'Runtime refusal logic',
      'Commit boundaries',
      'Outcome accountability',
    ],
    gaps: [
      'Authority transfer conditions incomplete',
      'Execution revocation timing unspecified',
    ],
    artifacts: 17,
    findings: 18,
    openItems: 2,
    reviewClass: 'Constitutional Review',
  },
];

const reviewTypes = [
  {
    title: 'Architecture Review',
    description:
      'Examines the design, boundaries, assumptions, authority model, evidence requirements, and unresolved gaps of a governance architecture.',
  },
  {
    title: 'Execution Route Review',
    description:
      'Examines a specific consequential route from Reality through Outcome, including evidence, binding, commit, execution, and receipts.',
  },
  {
    title: 'Record Continuity Review',
    description:
      'Examines source attribution, timestamps, version history, corrections, supersessions, and preservation of prior states.',
  },
  {
    title: 'Technical Verification',
    description:
      'Tests signatures, hashes, dependencies, replay reproducibility, package integrity, and execution correspondence.',
  },
  {
    title: 'Domain Boundary Review',
    description:
      'Tests whether domain evidence remains inside declared limits and avoids silent diagnosis, causation, or execution claims.',
  },
  {
    title: 'Constitutional Review',
    description:
      'Examines first principles, authority boundaries, runtime interpretation, refusal, amendment, and constitutional continuity.',
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

function DocumentIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none">
      <path
        d="M7 3h7l4 4v14H7V3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h5M10 12h5M10 16h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MarketplaceReviewsPage() {
  return (
    <main className="reviewsPage">
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
          <Link className="backLink" href="/marketplace">
            <span aria-hidden="true">←</span>
            Back to Marketplace
          </Link>

          <div className="heroGrid">
            <div>
              <span className="kicker">INDEPENDENT GOVERNANCE REVIEWS</span>
              <h1>Review the architecture before trusting the claim.</h1>
              <p className="heroLead">
                Explore bounded reviews of governance architectures, execution
                routes, environmental records, evidence chains, constitutional
                models, and verification packages. Every published review
                declares its scope, method, findings, limitations, and unresolved
                items.
              </p>

              <div className="heroActions">
                <a className="primaryButton" href="#published-reviews">
                  Browse published reviews
                  <ArrowIcon />
                </a>
                <Link className="secondaryButton" href="/marketplace/post-a-need">
                  Request a Governance Review
                </Link>
              </div>

              <div className="boundaryNotice">
                <AlertIcon />
                <span>
                  These are demonstration review records. Live review
                  submissions, reviewer assignment, evidence-room access,
                  conflict disclosures, signatures, payment, publication, and
                  dispute workflows are not connected yet.
                </span>
              </div>
            </div>

            <aside className="heroPanel">
              <div className="heroPanelHeader">
                <span>REVIEW EVIDENCE MODEL</span>
                <strong>A review should be attributable, bounded, and reproducible.</strong>
              </div>

              {[
                ['Scope', 'Exactly what the reviewer examined'],
                ['Method', 'How evidence and claims were assessed'],
                ['Evidence', 'Artifacts, records, and references reviewed'],
                ['Findings', 'Strengths, gaps, exceptions, and unresolved items'],
                ['Conflicts', 'Declared relationships and limitations'],
                ['Receipt', 'Preserved review state and publication event'],
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

      <section className="sectionBlock sectionTint">
        <div className="pageShell">
          <div className="sectionHeading">
            <div>
              <span className="kicker">REVIEW CLASSES</span>
              <h2>Different reviews answer different questions.</h2>
            </div>
            <p>
              Architecture quality, record continuity, execution integrity,
              domain boundaries, constitutional authority, and technical replay
              should not be collapsed into one vague review label.
            </p>
          </div>

          <div className="typeGrid">
            {reviewTypes.map((reviewType) => (
              <article className="typeCard" key={reviewType.title}>
                <DocumentIcon />
                <h3>{reviewType.title}</h3>
                <p>{reviewType.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock" id="published-reviews">
        <div className="pageShell">
          <div className="sectionHeading">
            <div>
              <span className="kicker">PUBLISHED REVIEWS</span>
              <h2>Read the finding, the evidence, and the boundary.</h2>
            </div>
            <p>
              A result without scope is not trustworthy. Every review below
              identifies the subject, reviewer, review class, evidence volume,
              outcome, open items, and proof limits.
            </p>
          </div>

          <div className="filterBar" aria-label="Review filters">
            <label>
              <span>Search reviews</span>
              <input
                type="search"
                placeholder="Search by subject, reviewer, result, or domain"
                disabled
              />
            </label>

            <label>
              <span>Review class</span>
              <select defaultValue="all" disabled>
                <option value="all">All review classes</option>
                <option value="architecture">Architecture review</option>
                <option value="route">Execution route review</option>
                <option value="continuity">Record continuity review</option>
                <option value="technical">Technical verification</option>
                <option value="domain">Domain boundary review</option>
                <option value="constitutional">Constitutional review</option>
              </select>
            </label>

            <label>
              <span>Result</span>
              <select defaultValue="all" disabled>
                <option value="all">All results</option>
                <option value="passed">Passed</option>
                <option value="verified">Verified</option>
                <option value="hold">Hold</option>
                <option value="corrections">Corrections required</option>
              </select>
            </label>

            <div className="filterBoundary">Preview filters</div>
          </div>

          <div className="reviewsGrid">
            {reviews.map((review) => (
              <article className="reviewCard" key={review.slug}>
                <div className="reviewTopline">
                  <span className="reviewClass">{review.reviewClass}</span>
                  <span className="publishedBadge">{review.status}</span>
                </div>

                <h3>{review.title}</h3>
                <p className="subjectLine">{review.subject}</p>

                <div className="reviewerLine">
                  <strong>{review.reviewer}</strong>
                  <span>{review.reviewerType}</span>
                  <small>{review.date}</small>
                </div>

                <div className="resultBox">
                  <span>REVIEW RESULT</span>
                  <strong>{review.result}</strong>
                </div>

                <div className="scopeBlock">
                  <span>Declared scope</span>
                  <p>{review.scope}</p>
                </div>

                <p className="reviewSummary">{review.summary}</p>

                <div className="findingColumns">
                  <div>
                    <span>Strengths</span>
                    {review.strengths.map((strength) => (
                      <div key={strength}>
                        <CheckIcon />
                        <small>{strength}</small>
                      </div>
                    ))}
                  </div>

                  <div className="gapColumn">
                    <span>Open gaps</span>
                    {review.gaps.map((gap) => (
                      <div key={gap}>
                        <AlertIcon />
                        <small>{gap}</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="reviewStats">
                  <div>
                    <strong>{review.artifacts}</strong>
                    <span>Artifacts</span>
                  </div>
                  <div>
                    <strong>{review.findings}</strong>
                    <span>Findings</span>
                  </div>
                  <div>
                    <strong>{review.openItems}</strong>
                    <span>Open items</span>
                  </div>
                </div>

                <div className="cardActions">
                  <Link
                    className="reviewLink"
                    href={`/marketplace/reviews/${review.slug}`}
                  >
                    Read full review
                    <ArrowIcon />
                  </Link>
                  <button type="button" disabled>
                    Request related review
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock sectionTint">
        <div className="pageShell processGrid">
          <div>
            <span className="kicker">BOUNDED REVIEW PROCESS</span>
            <h2>A review should never silently become certification.</h2>
            <p>
              The Marketplace review process separates submission, conflict
              disclosure, evidence access, reviewer method, findings, response,
              publication, correction, and dispute history.
            </p>
          </div>

          <div className="processSteps">
            {[
              ['01', 'Submit', 'Declare the subject, requested scope, evidence, and desired outcome.'],
              ['02', 'Disclose', 'Reviewer and subject disclose conflicts, prior work, and limitations.'],
              ['03', 'Examine', 'Reviewer evaluates only the accepted scope and evidence package.'],
              ['04', 'Respond', 'Subject may answer factual errors or provide missing evidence.'],
              ['05', 'Publish', 'Final findings, boundaries, and unresolved items are preserved.'],
              ['06', 'Version', 'Corrections and later reviews create new events without erasing history.'],
            ].map(([number, title, description]) => (
              <div key={number}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock">
        <div className="pageShell statePanel">
          <div>
            <span className="kicker">REVIEW STATES</span>
            <h2>Every status must say what happened.</h2>
            <p>
              “Reviewed” alone is ambiguous. A review state should identify
              whether the work was submitted, accepted, under review, returned,
              published, disputed, corrected, superseded, or withdrawn.
            </p>
          </div>

          <div className="stateGrid">
            {[
              ['SUBMITTED', 'A review request and evidence package were received.'],
              ['ACCEPTED', 'A reviewer accepted a declared scope and disclosed conflicts.'],
              ['IN REVIEW', 'The reviewer is actively examining the accepted evidence.'],
              ['RETURNED', 'The package requires clarification or additional evidence.'],
              ['PUBLISHED', 'The bounded review and its findings were preserved publicly.'],
              ['DISPUTED', 'A formal challenge to findings or evidence was recorded.'],
              ['CORRECTED', 'A later event corrected a preserved review statement.'],
              ['SUPERSEDED', 'A newer review replaced the current decision without erasing it.'],
            ].map(([state, description]) => (
              <div key={state}>
                <strong>{state}</strong>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock sectionTint">
        <div className="pageShell requestPanel">
          <div>
            <span className="kicker">REQUEST A REVIEW</span>
            <h2>Bring the architecture, route, record, or claim.</h2>
            <p>
              The connected workflow will match the requested scope with an
              appropriate reviewer while preserving reviewer independence,
              conflict disclosures, evidence access, review boundaries, fees,
              response rights, and publication preferences.
            </p>

            <div className="requirementsGrid">
              {[
                'Subject of review',
                'Requested review class',
                'Declared claims',
                'Explicit non-claims',
                'Evidence package',
                'Known conflicts',
                'Visibility preference',
                'Expected deliverable',
              ].map((item) => (
                <div key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="requestAction">
            <span>REVIEW WORKFLOW NOT CONNECTED</span>
            <button type="button" disabled>
              Start review request
            </button>
            <small>
              This control remains disabled until authenticated submission,
              evidence-room permissions, matching, reviewer assignment,
              payment, publication, and dispute workflows are implemented.
            </small>
          </div>
        </div>
      </section>

      <section className="finalSection">
        <div className="pageShell finalPanel">
          <div>
            <span className="kicker">MARKETPLACE PRINCIPLE</span>
            <h2>A review is only as strong as its scope and preserved evidence.</h2>
            <p>
              The TA-14 AI Governance Exchange Marketplace distinguishes review
              from endorsement, verification from certification, and findings
              from execution authority.
            </p>
          </div>

          <div className="finalActions">
            <Link className="primaryButton" href="/marketplace/post-a-need">
              Request a Governance Review
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

        .reviewsPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 12% 8%, rgba(37, 185, 189, 0.15), transparent 30%),
            radial-gradient(circle at 86% 18%, rgba(98, 169, 255, 0.12), transparent 28%),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .reviewsPage::before {
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
          top: 42%;
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
          font-size: clamp(3.25rem, 6.7vw, 6.9rem);
          line-height: 0.95;
          letter-spacing: -0.06em;
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
        .processGrid h2,
        .statePanel h2,
        .requestPanel h2,
        .finalPanel h2 {
          margin: 10px 0 0;
          font-size: clamp(2.3rem, 4.6vw, 4.8rem);
          line-height: 1.04;
          letter-spacing: -0.05em;
          text-wrap: balance;
        }

        .sectionHeading p,
        .processGrid > div:first-child p,
        .statePanel > div:first-child p,
        .requestPanel p,
        .finalPanel p {
          margin: 0;
          color: var(--muted);
          font-size: 1.03rem;
          line-height: 1.75;
        }

        .typeGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .typeCard {
          min-height: 210px;
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: linear-gradient(
            145deg,
            rgba(10, 31, 43, 0.8),
            rgba(4, 18, 27, 0.94)
          );
        }

        .typeCard svg {
          margin-bottom: 20px;
          color: var(--teal);
        }

        .typeCard h3 {
          margin-bottom: 11px;
          font-size: 1.25rem;
        }

        .typeCard p {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
        }

        .filterBar {
          display: grid;
          grid-template-columns:
            minmax(0, 1.5fr)
            minmax(180px, 0.7fr)
            minmax(180px, 0.7fr)
            auto;
          gap: 12px;
          align-items: end;
          margin-bottom: 24px;
          padding: 16px;
          border: 1px solid rgba(118, 213, 220, 0.14);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.018);
        }

        .filterBar label {
          display: grid;
          gap: 7px;
        }

        .filterBar label span {
          color: #cfe0e3;
          font-size: 0.74rem;
          font-weight: 800;
        }

        .filterBar input,
        .filterBar select {
          min-height: 44px;
          width: 100%;
          padding: 0 12px;
          border: 1px solid rgba(118, 213, 220, 0.15);
          border-radius: 10px;
          color: #789098;
          background: rgba(2, 14, 22, 0.72);
          font: inherit;
        }

        .filterBoundary {
          display: grid;
          place-items: center;
          min-height: 44px;
          padding: 0 14px;
          border: 1px solid rgba(255, 216, 120, 0.2);
          border-radius: 10px;
          color: var(--gold);
          background: rgba(255, 216, 120, 0.05);
          font-size: 0.7rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .reviewsGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .reviewCard {
          display: grid;
          align-content: start;
          padding: 24px;
          border: 1px solid var(--border);
          border-radius: 22px;
          background:
            radial-gradient(circle at 0 0, rgba(188, 164, 255, 0.08), transparent 28%),
            linear-gradient(145deg, rgba(10, 31, 43, 0.86), rgba(4, 18, 27, 0.95));
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.14);
        }

        .reviewTopline {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .reviewClass,
        .publishedBadge {
          display: inline-flex;
          align-items: center;
          min-height: 27px;
          padding: 0 9px;
          border-radius: 999px;
          font-size: 0.61rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .reviewClass {
          border: 1px solid rgba(188, 164, 255, 0.18);
          color: #d7c9ff;
          background: rgba(188, 164, 255, 0.06);
        }

        .publishedBadge {
          border: 1px solid rgba(103, 224, 223, 0.18);
          color: var(--teal);
          background: rgba(103, 224, 223, 0.05);
        }

        .reviewCard h3 {
          margin-bottom: 7px;
          font-size: 1.55rem;
          letter-spacing: -0.025em;
        }

        .subjectLine {
          margin: 0;
          color: #dce9eb;
          font-size: 0.88rem;
        }

        .reviewerLine {
          display: grid;
          gap: 4px;
          margin-top: 18px;
          padding: 13px 0;
          border-top: 1px solid rgba(118, 213, 220, 0.1);
          border-bottom: 1px solid rgba(118, 213, 220, 0.1);
        }

        .reviewerLine strong {
          font-size: 0.84rem;
        }

        .reviewerLine span,
        .reviewerLine small {
          color: var(--muted);
          font-size: 0.72rem;
        }

        .resultBox {
          display: grid;
          gap: 6px;
          margin-top: 18px;
          padding: 14px;
          border: 1px solid rgba(255, 216, 120, 0.2);
          border-radius: 13px;
          background: rgba(255, 216, 120, 0.05);
        }

        .resultBox span {
          color: #bba96f;
          font-size: 0.62rem;
          font-weight: 850;
          letter-spacing: 0.1em;
        }

        .resultBox strong {
          color: var(--gold);
          font-size: 0.86rem;
          line-height: 1.45;
        }

        .scopeBlock {
          margin-top: 18px;
        }

        .scopeBlock > span {
          color: var(--teal);
          font-size: 0.64rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .scopeBlock p,
        .reviewSummary {
          color: var(--muted);
          line-height: 1.62;
        }

        .scopeBlock p {
          margin: 7px 0 0;
        }

        .reviewSummary {
          margin: 16px 0 0;
        }

        .findingColumns {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .findingColumns > div {
          display: grid;
          align-content: start;
          gap: 8px;
          padding: 13px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.016);
        }

        .findingColumns > div > span {
          color: var(--teal);
          font-size: 0.63rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .findingColumns > div > div {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          color: #dcebed;
        }

        .findingColumns svg {
          flex: 0 0 auto;
          margin-top: 1px;
          color: var(--teal);
        }

        .findingColumns small {
          line-height: 1.45;
        }

        .findingColumns .gapColumn {
          border-color: rgba(255, 216, 120, 0.16);
          background: rgba(255, 216, 120, 0.025);
        }

        .findingColumns .gapColumn > span,
        .findingColumns .gapColumn svg {
          color: var(--gold);
        }

        .reviewStats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin-top: 18px;
        }

        .reviewStats > div {
          display: grid;
          gap: 4px;
          padding: 11px 8px;
          border: 1px solid rgba(118, 213, 220, 0.1);
          border-radius: 10px;
          text-align: center;
          background: rgba(255, 255, 255, 0.016);
        }

        .reviewStats strong {
          color: var(--teal);
          font-size: 1.15rem;
        }

        .reviewStats span {
          color: #78959d;
          font-size: 0.61rem;
        }

        .cardActions {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 10px;
          margin-top: 22px;
          padding-top: 17px;
          border-top: 1px solid rgba(118, 213, 220, 0.1);
        }

        .reviewLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--teal);
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 850;
        }

        .cardActions button {
          min-height: 38px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color: #718890;
          background: rgba(255, 255, 255, 0.025);
          font-weight: 800;
          cursor: not-allowed;
        }

        .processGrid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(440px, 0.9fr);
          gap: 58px;
          align-items: start;
        }

        .processGrid > div:first-child p {
          margin-top: 20px;
        }

        .processSteps {
          display: grid;
          gap: 10px;
        }

        .processSteps > div {
          display: grid;
          grid-template-columns: 42px minmax(90px, auto) 1fr;
          gap: 12px;
          align-items: center;
          padding: 13px;
          border: 1px solid rgba(118, 213, 220, 0.13);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
        }

        .processSteps > div > span {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #031114;
          background: var(--teal);
          font-size: 0.7rem;
          font-weight: 900;
        }

        .processSteps strong {
          font-size: 0.82rem;
        }

        .processSteps p {
          margin: 0;
          color: var(--muted);
          font-size: 0.76rem;
          line-height: 1.5;
        }

        .statePanel {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 50px;
          align-items: start;
        }

        .statePanel > div:first-child p {
          margin-top: 20px;
        }

        .stateGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .stateGrid > div {
          display: grid;
          gap: 7px;
          padding: 14px;
          border: 1px solid rgba(118, 213, 220, 0.13);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
        }

        .stateGrid strong {
          color: var(--gold);
          font-size: 0.68rem;
          letter-spacing: 0.08em;
        }

        .stateGrid span {
          color: #d8cfb9;
          font-size: 0.76rem;
          line-height: 1.5;
        }

        .requestPanel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 0.42fr);
          gap: 44px;
          align-items: center;
          padding: 34px;
          border: 1px solid var(--border-strong);
          border-radius: 28px;
          background:
            radial-gradient(circle at 0 0, rgba(188, 164, 255, 0.11), transparent 26%),
            linear-gradient(145deg, rgba(18, 24, 43, 0.9), rgba(4, 17, 25, 0.96));
        }

        .requestPanel p {
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

        .requestAction {
          display: grid;
          gap: 12px;
          padding: 22px;
          border: 1px solid rgba(255, 216, 120, 0.2);
          border-radius: 20px;
          background: rgba(255, 216, 120, 0.05);
        }

        .requestAction > span {
          color: var(--gold);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.13em;
        }

        .requestAction button {
          min-height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          color: #789098;
          background: rgba(255, 255, 255, 0.035);
          font-weight: 800;
          cursor: not-allowed;
        }

        .requestAction small {
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
          .processGrid,
          .statePanel,
          .requestPanel {
            grid-template-columns: 1fr;
          }

          .typeGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .filterBar {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 760px) {
          .pageShell {
            width: min(100% - 24px, 1180px);
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

          .reviewsGrid,
          .typeGrid,
          .filterBar,
          .requirementsGrid,
          .stateGrid {
            grid-template-columns: 1fr;
          }

          .heroPanelRow,
          .processSteps > div {
            grid-template-columns: 32px 1fr;
          }

          .heroPanelRow small,
          .processSteps p {
            grid-column: 2;
          }

          .requestPanel,
          .finalPanel {
            padding: 28px 22px;
          }
        }

        @media (max-width: 540px) {
          h1 {
            font-size: clamp(2.8rem, 16vw, 4.2rem);
          }

          .findingColumns {
            grid-template-columns: 1fr;
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

          .reviewCard {
            padding: 20px 17px;
          }

          .reviewTopline {
            align-items: flex-start;
            flex-direction: column;
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
