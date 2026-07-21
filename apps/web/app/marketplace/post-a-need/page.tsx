import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Post a Governance Need',
  description:
    'Declare a consequential governance need inside the TA-14 AI Governance Exchange Marketplace.',
};

const intakeSections = [
  {
    number: '01',
    title: 'The Real Problem',
    description:
      'Describe the actual situation that must be governed before describing a software feature, policy, dashboard, or model.',
    why:
      'Governance fails when the requested solution is declared before the problem, affected reality, and consequential decision are understood.',
    examples: [
      'A vendor payment may be released without verified procurement authority.',
      'A hospital environmental record lacks continuity across multiple contributors.',
      'An AI-generated public statement may be published without required disclosure.',
    ],
  },
  {
    number: '02',
    title: 'The Consequential Action',
    description:
      'Identify what may be approved, denied, paid, changed, released, executed, escalated, or preserved.',
    why:
      'The Exchange must know what action creates consequence so the route can govern the action rather than merely describe it.',
    examples: [
      'Release payment',
      'Approve access',
      'Publish content',
      'Change equipment state',
      'Issue a governed interpretation',
    ],
  },
  {
    number: '03',
    title: 'Evidence and Continuity',
    description:
      'Declare what evidence already exists, where it came from, who controls it, and whether continuity can be shown.',
    why:
      'A conclusion without attributable evidence and continuity cannot become admissible execution.',
    examples: [
      'Signed approvals',
      'Sensor records',
      'Laboratory reports',
      'Source documents',
      'Identity and authority records',
    ],
  },
  {
    number: '04',
    title: 'Authority and Boundaries',
    description:
      'Identify who may contribute, review, approve, verify, execute, own, or challenge the resulting work.',
    why:
      'Contribution authority is not approval authority, and approval authority is not execution authority.',
    examples: [
      'Requester',
      'Record Steward',
      'Domain specialist',
      'Independent reviewer',
      'Verifier',
      'Execution authority',
    ],
  },
  {
    number: '05',
    title: 'Deliverable and Proof',
    description:
      'State what must be delivered and how success will be tested without overstating what the result proves.',
    why:
      'The Marketplace should produce a bounded artifact, not an undefined promise of compliance, safety, accuracy, or certainty.',
    examples: [
      'Governance route',
      'Governed record',
      'Independent review',
      'Verification receipt',
      'Replay package',
      'Implementation architecture',
    ],
  },
];

const domains = [
  'AI Governance',
  'Financial Execution Governance',
  'Environmental Integrity Governance',
  'Healthcare Governance',
  'Building and BAS Governance',
  'HVAC Performance Governance',
  'Public-Sector Governance',
  'Data and Evidence Governance',
  'Other or Cross-Domain',
];

const deliverables = [
  'Custom governance route',
  'Governed record framework',
  'Governed interpretation',
  'Independent architecture review',
  'Evidence continuity review',
  'Verification and replay package',
  'Implementation plan',
  'Other bounded deliverable',
];

const expertise = [
  'Governance architecture',
  'Evidence and records',
  'Independent review',
  'Verification',
  'Domain specialist',
  'Legal or regulatory interpretation',
  'Technical implementation',
  'Operational execution',
];

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

function SparkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
    >
      <path
        d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
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

export default function PostGovernanceNeedPage() {
  return (
    <main className="needPage">
      <div className="background" aria-hidden="true">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="line lineOne" />
        <div className="line lineTwo" />
        <div className="star starOne" />
        <div className="star starTwo" />
        <div className="star starThree" />
        <div className="star starFour" />
      </div>

      <section className="hero">
        <div className="shell">
          <Link className="backLink" href="/marketplace">
            <span aria-hidden="true">←</span>
            Back to Marketplace
          </Link>

          <div className="heroGrid">
            <div>
              <span className="kicker">MARKETPLACE GUIDED INTAKE</span>
              <h1>Post a Governance Need</h1>
              <p className="heroLead">
                Bring the real problem into the TA-14 AI Governance Exchange.
                Declare the consequential action, the available evidence, the
                authorities involved, the intended deliverable, and the proof
                boundaries before qualified contributors are invited.
              </p>

              <div className="heroActions">
                <a className="primaryButton" href="#intake">
                  Begin guided intake
                  <ArrowIcon />
                </a>
                <a className="secondaryButton" href="#how-it-works">
                  Understand the process
                </a>
              </div>

              <div className="boundaryNotice">
                <SparkIcon />
                <span>
                  This page establishes the Marketplace intake architecture.
                  Submission, file storage, matching, messaging, payments, and
                  proposal workflows are not connected yet.
                </span>
              </div>
            </div>

            <div className="heroPanel" aria-label="Governance need structure">
              <div className="heroPanelHeader">
                <span>GOVERNANCE NEED</span>
                <strong>Five declarations before matching</strong>
              </div>

              {[
                'Problem',
                'Consequence',
                'Evidence',
                'Authority',
                'Proof',
              ].map((item, index) => (
                <div className="heroPanelRow" key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item}</strong>
                  <small>
                    {index === 0
                      ? 'What is actually happening?'
                      : index === 1
                        ? 'What action creates consequence?'
                        : index === 2
                          ? 'What can be shown and traced?'
                          : index === 3
                            ? 'Who may do what?'
                            : 'How will success be tested?'}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="shell">
          <div className="sectionHeading">
            <div>
              <span className="kicker">GUIDED MISSION SYSTEM</span>
              <h2>The intake explains every question before asking it.</h2>
            </div>
            <p>
              A requester should not need to arrive speaking governance
              language. Each declaration includes plain guidance, examples, and
              a clear explanation of why the information matters.
            </p>
          </div>

          <div className="explanationGrid">
            {intakeSections.map((section) => (
              <article className="explanationCard" key={section.number}>
                <div className="cardNumber">{section.number}</div>
                <h3>{section.title}</h3>
                <p>{section.description}</p>

                <div className="whyBox">
                  <span>WHY ARE WE ASKING THIS?</span>
                  <p>{section.why}</p>
                </div>

                <div className="exampleList">
                  <span>Examples</span>
                  {section.examples.map((example) => (
                    <div className="exampleItem" key={example}>
                      <CheckIcon />
                      <small>{example}</small>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section sectionTint" id="intake">
        <div className="shell">
          <div className="sectionHeading">
            <div>
              <span className="kicker">GOVERNANCE NEED DECLARATION</span>
              <h2>Structured intake preview</h2>
            </div>
            <p>
              Complete these sections before the opportunity is published,
              privately shared, or matched with qualified contributors.
            </p>
          </div>

          <form className="intakeForm">
            <fieldset className="formSection">
              <legend>
                <span>01</span>
                Requester and organization
              </legend>

              <div className="fieldGrid twoColumns">
                <label>
                  <span>Requester name</span>
                  <input
                    type="text"
                    name="requesterName"
                    placeholder="Full name"
                  />
                </label>

                <label>
                  <span>Organization</span>
                  <input
                    type="text"
                    name="organization"
                    placeholder="Organization or independent requester"
                  />
                </label>

                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                  />
                </label>

                <label>
                  <span>Requester role</span>
                  <input
                    type="text"
                    name="requesterRole"
                    placeholder="Founder, operator, counsel, engineer..."
                  />
                </label>
              </div>
            </fieldset>

            <fieldset className="formSection">
              <legend>
                <span>02</span>
                Problem and domain
              </legend>

              <div className="fieldGrid">
                <label>
                  <span>Governance need title</span>
                  <input
                    type="text"
                    name="title"
                    placeholder="A clear title for the problem that must be governed"
                  />
                  <small>
                    Describe the need, not the solution you assume must be built.
                  </small>
                </label>

                <label>
                  <span>Domain</span>
                  <select name="domain" defaultValue="">
                    <option value="" disabled>
                      Select the primary domain
                    </option>
                    {domains.map((domain) => (
                      <option value={domain} key={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>What is actually happening?</span>
                  <textarea
                    name="problem"
                    rows={7}
                    placeholder="Describe the real-world condition, current process, observed failure, ambiguity, or unresolved risk."
                  />
                  <small>
                    Include who is affected, where it occurs, and what currently
                    happens without governance.
                  </small>
                </label>
              </div>
            </fieldset>

            <fieldset className="formSection">
              <legend>
                <span>03</span>
                Consequential action
              </legend>

              <div className="fieldGrid">
                <label>
                  <span>What action may occur?</span>
                  <textarea
                    name="consequentialAction"
                    rows={5}
                    placeholder="What may be approved, denied, paid, released, changed, executed, escalated, or preserved?"
                  />
                </label>

                <label>
                  <span>What happens if the action is wrong?</span>
                  <textarea
                    name="consequence"
                    rows={5}
                    placeholder="Describe the operational, financial, environmental, legal, medical, public, or evidentiary consequence."
                  />
                </label>

                <div className="guidedPrompt">
                  <SparkIcon />
                  <div>
                    <strong>Guided Mission prompt</strong>
                    <p>
                      A route cannot govern consequence until the action that
                      creates consequence is declared.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="formSection">
              <legend>
                <span>04</span>
                Evidence and continuity
              </legend>

              <div className="fieldGrid">
                <label>
                  <span>What evidence already exists?</span>
                  <textarea
                    name="existingEvidence"
                    rows={6}
                    placeholder="List records, approvals, sensor data, reports, contracts, policies, logs, images, video, or other source evidence."
                  />
                </label>

                <label>
                  <span>Known evidence gaps</span>
                  <textarea
                    name="evidenceGaps"
                    rows={4}
                    placeholder="What is missing, stale, unverifiable, unattributed, inaccessible, or disputed?"
                  />
                </label>

                <label>
                  <span>Continuity concerns</span>
                  <textarea
                    name="continuity"
                    rows={4}
                    placeholder="Describe custody, transfer, version, timestamp, source, or identity concerns."
                  />
                </label>

                <label className="uploadPreview">
                  <span>Supporting files</span>
                  <input type="file" name="files" multiple disabled />
                  <small>
                    File upload will be connected with authenticated storage in
                    a later build. Do not treat this preview as a live upload.
                  </small>
                </label>
              </div>
            </fieldset>

            <fieldset className="formSection">
              <legend>
                <span>05</span>
                Authority and contributor needs
              </legend>

              <div className="fieldGrid">
                <label>
                  <span>Known authority holders</span>
                  <textarea
                    name="authorityHolders"
                    rows={4}
                    placeholder="Who may contribute, review, approve, verify, execute, own, or challenge the work?"
                  />
                </label>

                <div>
                  <span className="fieldLabel">Expertise requested</span>
                  <div className="choiceGrid">
                    {expertise.map((item) => (
                      <label className="choiceCard" key={item}>
                        <input type="checkbox" name="expertise" value={item} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label>
                  <span>Conflicts or exclusions</span>
                  <textarea
                    name="conflicts"
                    rows={4}
                    placeholder="Declare prohibited relationships, conflicts, restricted parties, or required independence."
                  />
                </label>
              </div>
            </fieldset>

            <fieldset className="formSection">
              <legend>
                <span>06</span>
                Deliverable, timing, and budget
              </legend>

              <div className="fieldGrid twoColumns">
                <label>
                  <span>Desired deliverable</span>
                  <select name="deliverable" defaultValue="">
                    <option value="" disabled>
                      Select the intended deliverable
                    </option>
                    {deliverables.map((deliverable) => (
                      <option value={deliverable} key={deliverable}>
                        {deliverable}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Target completion</span>
                  <input type="date" name="targetDate" />
                </label>

                <label>
                  <span>Budget range</span>
                  <input
                    type="text"
                    name="budget"
                    placeholder="$2,500-$5,000 or request proposals"
                  />
                </label>

                <label>
                  <span>Opportunity visibility</span>
                  <select name="visibility" defaultValue="private">
                    <option value="private">Private invitation</option>
                    <option value="network">Partner Review Network</option>
                    <option value="public">Public marketplace</option>
                  </select>
                </label>
              </div>

              <div className="fieldGrid">
                <label>
                  <span>How will success be tested?</span>
                  <textarea
                    name="successTest"
                    rows={6}
                    placeholder="Describe required test cases, replay, comparison, acceptance criteria, independent review, or post-intervention evidence."
                  />
                </label>

                <label>
                  <span>What must the deliverable not claim?</span>
                  <textarea
                    name="proofBoundary"
                    rows={4}
                    placeholder="Declare exclusions, unresolved matters, and claims that would exceed the available evidence or review scope."
                  />
                </label>
              </div>
            </fieldset>

            <div className="submissionPanel">
              <div>
                <span className="kicker">SUBMISSION BOUNDARY</span>
                <h3>This is an architectural preview, not a live intake.</h3>
                <p>
                  The final workflow will require authentication, preservation,
                  review of required fields, visibility selection, and explicit
                  confirmation before an opportunity can be published.
                </p>
              </div>

              <button className="disabledButton" type="button" disabled>
                Submission not connected
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="shell assuranceGrid">
          <div>
            <span className="kicker">WHAT HAPPENS NEXT</span>
            <h2>A declared need becomes a governed opportunity.</h2>
            <p>
              Once connected, the Exchange will preserve the intake as a
              versioned request, identify the required contributor roles, allow
              public or private matching, receive bounded proposals, and open a
              governed collaboration workspace.
            </p>
          </div>

          <div className="assuranceSteps">
            {[
              'Review required declarations',
              'Confirm visibility and invitation scope',
              'Identify qualification requirements',
              'Receive bounded proposals',
              'Select contributors',
              'Open governed work environment',
            ].map((item, index) => (
              <div className="assuranceStep" key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="finalSection">
        <div className="shell finalPanel">
          <div>
            <span className="kicker">TA-14 MARKETPLACE</span>
            <h2>Bring the problem before building the answer.</h2>
            <p>
              The Marketplace begins with reality, evidence, continuity,
              authority, and declared consequence. Only then should a route,
              record, review, or implementation be proposed.
            </p>
          </div>

          <div className="finalActions">
            <Link className="primaryButton" href="/marketplace">
              Return to Marketplace
              <ArrowIcon />
            </Link>
            <Link className="secondaryButton" href="/workspace">
              Open Workspace
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

        .needPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 12% 8%, rgba(37, 185, 189, 0.15), transparent 30%),
            radial-gradient(circle at 86% 18%, rgba(98, 169, 255, 0.12), transparent 28%),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .needPage::before {
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

        .background {
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
          background: linear-gradient(90deg, transparent, rgba(103, 224, 223, 0.58), transparent);
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
        .starFour { top: 74%; right: 22%; animation-delay: 0.8s; }

        .shell {
          position: relative;
          z-index: 2;
          width: min(1160px, calc(100% - 40px));
          margin: 0 auto;
        }

        .hero {
          padding: 86px 0 80px;
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
          font-size: clamp(3.3rem, 7vw, 7rem);
          line-height: 0.94;
          letter-spacing: -0.06em;
          text-wrap: balance;
        }

        .heroLead {
          max-width: 750px;
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
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
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
          font-size: 1.25rem;
        }

        .heroPanelRow {
          display: grid;
          grid-template-columns: 34px minmax(86px, auto) 1fr;
          gap: 12px;
          align-items: center;
          padding: 14px 0;
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
          box-shadow: 0 0 16px rgba(103, 224, 223, 0.28);
        }

        .heroPanelRow strong {
          font-size: 0.9rem;
        }

        .heroPanelRow small {
          color: var(--muted);
          font-size: 0.75rem;
          line-height: 1.45;
        }

        .section {
          position: relative;
          padding: 105px 0;
          scroll-margin-top: 70px;
        }

        .sectionTint {
          border-top: 1px solid rgba(118, 213, 220, 0.08);
          border-bottom: 1px solid rgba(118, 213, 220, 0.08);
          background: linear-gradient(180deg, rgba(9, 28, 39, 0.66), rgba(5, 18, 26, 0.45));
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 470px);
          gap: 38px;
          align-items: end;
          margin-bottom: 48px;
        }

        .sectionHeading h2,
        .assuranceGrid h2,
        .finalPanel h2 {
          margin: 10px 0 0;
          font-size: clamp(2.25rem, 4.5vw, 4.8rem);
          line-height: 1.04;
          letter-spacing: -0.05em;
          text-wrap: balance;
        }

        .sectionHeading p,
        .assuranceGrid > div:first-child p,
        .finalPanel p {
          margin: 0;
          color: var(--muted);
          font-size: 1.03rem;
          line-height: 1.75;
        }

        .explanationGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .explanationCard {
          position: relative;
          overflow: hidden;
          padding: 28px;
          border: 1px solid var(--border);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(10, 31, 43, 0.86), rgba(4, 18, 27, 0.95));
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.16);
        }

        .explanationCard:last-child {
          grid-column: 1 / -1;
        }

        .cardNumber {
          position: absolute;
          top: 16px;
          right: 22px;
          color: rgba(103, 224, 223, 0.12);
          font-size: 4.6rem;
          font-weight: 900;
          line-height: 1;
        }

        .explanationCard h3 {
          position: relative;
          z-index: 2;
          margin-bottom: 12px;
          font-size: 1.55rem;
        }

        .explanationCard > p {
          position: relative;
          z-index: 2;
          max-width: 680px;
          color: var(--muted);
          line-height: 1.7;
        }

        .whyBox {
          position: relative;
          z-index: 2;
          margin-top: 22px;
          padding: 16px;
          border: 1px solid rgba(255, 216, 120, 0.18);
          border-radius: 14px;
          background: rgba(255, 216, 120, 0.05);
        }

        .whyBox span,
        .exampleList > span {
          display: block;
          color: var(--gold);
          font-size: 0.66rem;
          font-weight: 850;
          letter-spacing: 0.14em;
        }

        .whyBox p {
          margin: 8px 0 0;
          color: #e8dfc8;
          line-height: 1.6;
        }

        .exampleList {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 9px;
          margin-top: 20px;
        }

        .exampleList > span {
          color: var(--teal);
          margin-bottom: 2px;
        }

        .exampleItem {
          display: flex;
          gap: 9px;
          align-items: flex-start;
          color: #dcebed;
        }

        .exampleItem svg {
          flex: 0 0 auto;
          margin-top: 1px;
          color: var(--teal);
        }

        .exampleItem small {
          line-height: 1.5;
        }

        .intakeForm {
          display: grid;
          gap: 22px;
        }

        .formSection {
          margin: 0;
          padding: 28px;
          border: 1px solid var(--border);
          border-radius: 24px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.08), transparent 25%),
            linear-gradient(145deg, rgba(10, 31, 43, 0.82), rgba(4, 18, 27, 0.95));
        }

        .formSection legend {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 0 10px;
          color: var(--text);
          font-size: 1.08rem;
          font-weight: 850;
        }

        .formSection legend span {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #031114;
          background: var(--teal);
          font-size: 0.72rem;
          font-weight: 900;
          box-shadow: 0 0 16px rgba(103, 224, 223, 0.25);
        }

        .fieldGrid {
          display: grid;
          gap: 18px;
          margin-top: 12px;
        }

        .twoColumns {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        label {
          display: grid;
          gap: 8px;
        }

        label > span,
        .fieldLabel {
          color: #dcebed;
          font-size: 0.83rem;
          font-weight: 800;
        }

        label > small,
        .uploadPreview small {
          color: #78959d;
          font-size: 0.75rem;
          line-height: 1.5;
        }

        input,
        textarea,
        select {
          width: 100%;
          border: 1px solid rgba(118, 213, 220, 0.18);
          border-radius: 12px;
          color: var(--text);
          background: rgba(2, 14, 22, 0.72);
          font: inherit;
          outline: none;
          transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }

        input,
        select {
          min-height: 48px;
          padding: 0 14px;
        }

        textarea {
          padding: 13px 14px;
          resize: vertical;
          line-height: 1.55;
        }

        input::placeholder,
        textarea::placeholder {
          color: #607b83;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: var(--teal);
          background: rgba(4, 21, 30, 0.92);
          box-shadow: 0 0 0 3px rgba(103, 224, 223, 0.08);
        }

        select option {
          color: #07151c;
          background: white;
        }

        .guidedPrompt {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 16px;
          border: 1px solid rgba(188, 164, 255, 0.2);
          border-radius: 14px;
          background: rgba(188, 164, 255, 0.06);
        }

        .guidedPrompt svg {
          flex: 0 0 auto;
          margin-top: 2px;
          color: var(--violet);
        }

        .guidedPrompt strong {
          color: #e8e1ff;
        }

        .guidedPrompt p {
          margin: 5px 0 0;
          color: #bcb3d5;
          line-height: 1.55;
        }

        .uploadPreview {
          padding: 16px;
          border: 1px dashed rgba(118, 213, 220, 0.28);
          border-radius: 14px;
          background: rgba(103, 224, 223, 0.025);
        }

        .uploadPreview input {
          opacity: 0.5;
        }

        .choiceGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .choiceCard {
          display: flex;
          gap: 10px;
          align-items: center;
          min-height: 46px;
          padding: 10px 12px;
          border: 1px solid rgba(118, 213, 220, 0.14);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.018);
        }

        .choiceCard input {
          width: 16px;
          min-height: auto;
          height: 16px;
          margin: 0;
          accent-color: var(--teal);
        }

        .choiceCard span {
          color: #dcebed;
          font-size: 0.78rem;
        }

        .submissionPanel {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
          padding: 26px;
          border: 1px solid rgba(255, 216, 120, 0.22);
          border-radius: 22px;
          background: rgba(255, 216, 120, 0.055);
        }

        .submissionPanel h3 {
          margin: 8px 0;
          font-size: 1.35rem;
        }

        .submissionPanel p {
          max-width: 760px;
          margin: 0;
          color: #cfc5aa;
          line-height: 1.65;
        }

        .disabledButton {
          min-height: 48px;
          padding: 0 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          color: #789098;
          background: rgba(255, 255, 255, 0.035);
          font-weight: 800;
          cursor: not-allowed;
        }

        .assuranceGrid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(380px, 0.8fr);
          gap: 60px;
          align-items: start;
        }

        .assuranceGrid > div:first-child p {
          margin-top: 20px;
        }

        .assuranceSteps {
          display: grid;
          gap: 10px;
        }

        .assuranceStep {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 12px;
          align-items: center;
          padding: 14px;
          border: 1px solid rgba(118, 213, 220, 0.13);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.018);
        }

        .assuranceStep span {
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

        .assuranceStep strong {
          font-size: 0.9rem;
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
          margin-top: 20px;
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
          .sectionHeading,
          .assuranceGrid {
            grid-template-columns: 1fr;
          }

          .explanationGrid {
            grid-template-columns: 1fr;
          }

          .explanationCard:last-child {
            grid-column: auto;
          }

          .submissionPanel {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .shell {
            width: min(100% - 24px, 1160px);
          }

          .hero {
            padding-top: 56px;
          }

          .backLink {
            margin-bottom: 38px;
          }

          .section {
            padding: 78px 0;
          }

          .twoColumns,
          .choiceGrid {
            grid-template-columns: 1fr;
          }

          .formSection,
          .explanationCard {
            padding: 22px 18px;
          }

          .heroPanelRow {
            grid-template-columns: 32px 1fr;
          }

          .heroPanelRow small {
            grid-column: 2;
          }

          .finalPanel {
            padding: 30px 22px;
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

          .heroPanel {
            padding: 18px;
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
