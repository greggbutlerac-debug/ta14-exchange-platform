import Link from 'next/link';

const CAPABILITIES = [
  {
    title: 'Build a Consequential Route',
    description:
      'Define the proposed action across Reality, Record, Continuity, Admissibility, Binding, Commit, Execution, and Outcome.',
    icon: '01',
  },
  {
    title: 'Test the Route',
    description:
      'Run repeatable simulations and expose missing evidence, broken continuity, invalid authority, or unsupported bindings.',
    icon: '02',
  },
  {
    title: 'Correct Failed Links',
    description:
      'Return findings to the exact failed stage and repair the route without hiding the prior state.',
    icon: '03',
  },
  {
    title: 'Preserve the Admitted State',
    description:
      'Save the route, findings, evidence references, declared boundaries, and replay continuity before execution.',
    icon: '04',
  },
  {
    title: 'Verify Independently',
    description:
      'Use receipts, replay, and verification tools to confirm that preserved route records remain intact and reviewable.',
    icon: '05',
  },
  {
    title: 'Understand the Determination',
    description:
      'See why a route was classified ALLOW, HOLD, DENY, or ESCALATE instead of receiving an unexplained score.',
    icon: '06',
  },
] as const;

const CHAIN = [
  'Reality',
  'Record',
  'Continuity',
  'Admissibility',
  'Binding',
  'Commit',
  'Execution',
  'Outcome',
] as const;

const ROUTE_EXAMPLES = [
  'AI agent actions',
  'Autonomous workflows',
  'Payments and financial commitments',
  'Human approvals and delegated authority',
  'Operational control changes',
  'Building and environmental actions',
  'Healthcare and safety-critical decisions',
  'Vendor, procurement, and enterprise execution',
] as const;

const DETERMINATIONS = [
  {
    label: 'ALLOW',
    description:
      'The route satisfies the declared evidence, authority, continuity, and binding requirements for the tested scope.',
  },
  {
    label: 'HOLD',
    description:
      'The route cannot proceed yet because required evidence, authority, continuity, or binding remains incomplete.',
  },
  {
    label: 'DENY',
    description:
      'The route fails a governing requirement or attempts execution outside an admissible boundary.',
  },
  {
    label: 'ESCALATE',
    description:
      'The route requires qualified human or institutional review before any further commitment or execution.',
  },
] as const;

export default function AIGovernanceIntroductionPage() {
  return (
    <main className="aiIntro">
      <div className="grid" aria-hidden="true" />
      <div className="glow glowOne" aria-hidden="true" />
      <div className="glow glowTwo" aria-hidden="true" />

      <section className="shell">
        <header className="topbar">
          <Link className="brand" href="/">
            <span className="brandMark">TA</span>
            <span>
              <strong>TA-14 AI Governance Exchange</strong>
              <small>AI Governance</small>
            </span>
          </Link>

          <nav>
            <Link href="/">Homepage</Link>
            <Link href="/workspace">All Playgrounds</Link>
            <Link className="navButton" href="/workspace/ai-governance">
              Enter Workspace
            </Link>
          </nav>
        </header>

        <section className="hero">
          <div className="heroCopy">
            <p className="eyebrow">AI Governance Introduction</p>

            <h1>
              Govern the route
              <span>before the AI acts.</span>
            </h1>

            <p className="lede">
              The AI Governance section is where consequential AI actions are
              constructed, tested, corrected, preserved, and verified before
              they are treated as admissible execution. It governs the full
              route from reality to outcome instead of reviewing only a model,
              policy, prompt, or approval screen.
            </p>

            <div className="actions">
              <Link className="primaryButton" href="/workspace/ai-governance">
                Enter the AI Governance Workspace
              </Link>

              <a className="secondaryButton" href="#purpose">
                Learn What It Does
              </a>
            </div>

            <p className="accessNote">
              Free to explore · No credit card required · Simulate, test, and
              learn before preserving a formal route
            </p>
          </div>

          <aside className="principleCard">
            <p className="eyebrow">Governing principle</p>
            <h2>No admissible evidence. No admissible execution.</h2>
            <p>
              A confident model output, policy statement, approval, dashboard,
              or system recommendation is not proof that a consequential action
              is legitimate.
            </p>

            <div className="definitionRule" />

            <strong>
              TA-14 does not ask only whether the AI appears safe or useful.
            </strong>

            <span>
              It asks whether the complete route remains admissible under
              scrutiny.
            </span>
          </aside>
        </section>

        <section className="chain" aria-label="TA-14 admissibility chain">
          {CHAIN.map((stage, index) => (
            <div className="chainStep" key={stage}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{stage}</strong>
              {index < CHAIN.length - 1 ? <i>→</i> : null}
            </div>
          ))}
        </section>

        <section className="section purpose" id="purpose">
          <div className="sectionHeading">
            <p className="eyebrow">Purpose</p>
            <h2>Govern consequential execution, not just model behavior.</h2>
          </div>

          <div className="purposeGrid">
            <article>
              <h3>Why this section exists</h3>
              <p>
                Most AI governance stops at policy, risk classification,
                approval, or monitoring. TA-14 continues through authority,
                binding, commitment, execution, and recorded outcome so the
                consequence-bearing route remains reviewable from end to end.
              </p>
            </article>

            <article>
              <h3>What it protects against</h3>
              <p>
                Admissibility drift, stale authority, broken continuity,
                unsupported payloads, unauthorized commitments, execution
                outside the tested route, and outcomes that no longer match the
                original governed purpose.
              </p>
            </article>

            <article>
              <h3>Who it is for</h3>
              <p>
                AI builders, enterprises, auditors, governance teams,
                regulators, operational leaders, reviewers, developers, and
                institutions responsible for systems that can affect people,
                money, property, environments, or public trust.
              </p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="sectionHeading">
            <p className="eyebrow">What you can do</p>
            <h2>Move from proposed action to governed execution route.</h2>
            <p>
              The playground lets users build the route, test its dependencies,
              correct failures, preserve the admitted state, and verify the
              record without reducing governance to a score or checklist.
            </p>
          </div>

          <div className="capabilityGrid">
            {CAPABILITIES.map((capability) => (
              <article className="capabilityCard" key={capability.title}>
                <span>{capability.icon}</span>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section routeExamples">
          <div className="routeExamplesCopy">
            <p className="eyebrow">What can be governed</p>
            <h2>Any route capable of carrying a real consequence.</h2>
            <p>
              TA-14 is not limited to one model type, vendor, industry, or
              software architecture. The governing discipline follows the
              consequential route wherever evidence, authority, commitment,
              execution, and outcome must remain connected.
            </p>

            <Link className="primaryButton" href="/workspace/ai-governance">
              Enter the AI Governance Workspace
            </Link>
          </div>

          <div className="routeList">
            {ROUTE_EXAMPLES.map((example) => (
              <span key={example}>
                <i>✓</i>
                {example}
              </span>
            ))}
          </div>
        </section>

        <section className="section determinations">
          <div className="sectionHeading">
            <p className="eyebrow">Route determinations</p>
            <h2>Clear outcomes with visible reasons.</h2>
            <p>
              Every tested route should explain why it can proceed, why it must
              stop, or why qualified review is required.
            </p>
          </div>

          <div className="determinationGrid">
            {DETERMINATIONS.map((determination) => (
              <article key={determination.label}>
                <strong>{determination.label}</strong>
                <p>{determination.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="boundary">
          <div>
            <p className="eyebrow">Declared boundary</p>
            <h2>A successful simulation is not production authority.</h2>
          </div>

          <p>
            Free exploration can teach the discipline and reveal route defects,
            but it does not create missing evidence, grant organizational
            authority, validate a false assertion, or convert a test into a
            production-admissible execution receipt. Those distinctions must
            remain explicit.
          </p>
        </section>

        <section className="enterPanel">
          <div>
            <p className="eyebrow">Ready to begin?</p>
            <h2>Enter the AI Governance playground.</h2>
            <p>
              Build a route, test it against the TA-14 chain, correct the failed
              links, and see exactly why the route was allowed, held, denied,
              or escalated.
            </p>
          </div>

          <Link className="enterButton" href="/workspace/ai-governance">
            Enter Workspace
            <span>→</span>
          </Link>
        </section>

        <footer>
          <Link href="/">← Return to public homepage</Link>
          <span>No admissible evidence. No admissible execution.</span>
          <Link href="/workspace">View all playgrounds →</Link>
        </footer>
      </section>

      <style>{`
        .aiIntro {
          --cyan: #68e5ff;
          --violet: #a495ff;
          --green: #62efb9;
          --gold: #ffbf69;
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f5fbff;
          background:
            radial-gradient(circle at 84% 9%, rgba(104, 229, 255, 0.14), transparent 29%),
            radial-gradient(circle at 8% 48%, rgba(164, 149, 255, 0.1), transparent 36%),
            linear-gradient(180deg, #04101a 0%, #03090f 54%, #02070b 100%);
        }

        .aiIntro * {
          box-sizing: border-box;
        }

        .grid {
          position: absolute;
          inset: 0;
          opacity: 0.22;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(104, 229, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(104, 229, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: linear-gradient(to bottom, black, transparent 92%);
        }

        .glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(100px);
          pointer-events: none;
        }

        .glowOne {
          top: -170px;
          right: -110px;
          width: 460px;
          height: 460px;
          opacity: 0.13;
          background: var(--cyan);
        }

        .glowTwo {
          top: 43%;
          left: -190px;
          width: 380px;
          height: 380px;
          opacity: 0.08;
          background: var(--violet);
        }

        .shell {
          position: relative;
          z-index: 1;
          width: min(1280px, calc(100% - 28px));
          margin-inline: auto;
          padding: 24px 0 44px;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 12px 4px 26px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: inherit;
          text-decoration: none;
        }

        .brandMark {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(104, 229, 255, 0.3);
          border-radius: 12px;
          color: var(--cyan);
          background: rgba(104, 229, 255, 0.06);
          font-size: 13px;
          font-weight: 950;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          font-size: 12px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .brand small {
          margin-top: 3px;
          color: #748a9a;
          font-size: 10px;
        }

        .topbar nav {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .topbar nav a {
          color: #8ca1b0;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
        }

        .topbar nav a:hover {
          color: var(--cyan);
        }

        .navButton {
          padding: 10px 14px;
          border: 1px solid rgba(104, 229, 255, 0.28);
          border-radius: 10px;
          background: rgba(104, 229, 255, 0.06);
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.32fr) minmax(300px, 0.68fr);
          gap: clamp(34px, 6vw, 82px);
          align-items: center;
          padding: clamp(34px, 6vw, 76px);
          border: 1px solid rgba(140, 197, 222, 0.15);
          border-radius: 28px;
          background:
            linear-gradient(145deg, rgba(10, 31, 47, 0.95), rgba(4, 15, 24, 0.97));
          box-shadow: 0 34px 90px rgba(0, 0, 0, 0.3);
        }

        .eyebrow {
          margin: 0 0 14px;
          color: var(--cyan);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 820px;
          margin: 0;
          font-size: clamp(3.1rem, 7vw, 7.2rem);
          line-height: 0.91;
          letter-spacing: -0.072em;
        }

        .hero h1 span {
          display: block;
          margin-top: 0.11em;
          color: transparent;
          background: linear-gradient(90deg, #fff, var(--cyan), var(--green));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .lede {
          max-width: 780px;
          margin: 28px 0 0;
          color: #98adbb;
          font-size: 16px;
          line-height: 1.82;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton,
        .enterButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 19px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 850;
          text-decoration: none;
          transition: transform 180ms ease;
        }

        .primaryButton {
          color: #031118;
          background: linear-gradient(135deg, var(--cyan), var(--green));
        }

        .secondaryButton {
          border: 1px solid rgba(104, 229, 255, 0.25);
          color: #e3f8ff;
          background: rgba(104, 229, 255, 0.05);
        }

        .primaryButton:hover,
        .secondaryButton:hover,
        .enterButton:hover {
          transform: translateY(-2px);
        }

        .accessNote {
          margin: 17px 0 0;
          color: #647989;
          font-size: 11px;
          font-weight: 700;
        }

        .principleCard {
          padding: 27px;
          border: 1px solid rgba(98, 239, 185, 0.2);
          border-radius: 21px;
          background: rgba(3, 13, 21, 0.76);
        }

        .principleCard h2 {
          margin: 0;
          font-size: 2rem;
          line-height: 1.08;
          letter-spacing: -0.045em;
        }

        .principleCard > p:not(.eyebrow) {
          margin: 18px 0 0;
          color: #8ca2b1;
          font-size: 13px;
          line-height: 1.72;
        }

        .definitionRule {
          height: 1px;
          margin: 24px 0;
          background: linear-gradient(90deg, var(--green), transparent);
          opacity: 0.35;
        }

        .principleCard strong {
          display: block;
          color: #e8f7fb;
          font-size: 14px;
          line-height: 1.6;
        }

        .principleCard span {
          display: block;
          margin-top: 12px;
          color: var(--green);
          font-size: 13px;
          line-height: 1.6;
        }

        .chain {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          margin-top: 18px;
          overflow: hidden;
          border: 1px solid rgba(140, 197, 222, 0.13);
          border-radius: 17px;
          background: rgba(5, 18, 29, 0.9);
        }

        .chainStep {
          position: relative;
          padding: 17px 12px;
          border-right: 1px solid rgba(140, 197, 222, 0.13);
          text-align: center;
        }

        .chainStep:last-child {
          border-right: 0;
        }

        .chainStep span {
          display: block;
          margin-bottom: 5px;
          color: #4e6878;
          font-size: 9px;
          font-weight: 900;
        }

        .chainStep strong {
          color: #c9d9e2;
          font-size: 10px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .chainStep i {
          position: absolute;
          top: 50%;
          right: -5px;
          z-index: 2;
          color: var(--green);
          font-style: normal;
          transform: translateY(-50%);
        }

        .section {
          padding-top: 76px;
        }

        .sectionHeading {
          max-width: 850px;
          margin-bottom: 30px;
        }

        .sectionHeading h2,
        .routeExamplesCopy h2,
        .boundary h2,
        .enterPanel h2 {
          margin: 0;
          font-size: clamp(2.1rem, 4.5vw, 4.6rem);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .sectionHeading > p:last-child,
        .routeExamplesCopy > p:not(.eyebrow) {
          margin: 18px 0 0;
          color: #8ca1af;
          line-height: 1.78;
        }

        .purposeGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .purposeGrid article,
        .capabilityCard,
        .determinationGrid article {
          padding: 26px;
          border: 1px solid rgba(140, 197, 222, 0.14);
          border-radius: 19px;
          background:
            linear-gradient(145deg, rgba(9, 27, 41, 0.9), rgba(4, 15, 24, 0.94));
        }

        .purposeGrid h3,
        .capabilityCard h3 {
          margin: 0;
          font-size: 1.35rem;
          letter-spacing: -0.035em;
        }

        .purposeGrid p,
        .capabilityCard p,
        .determinationGrid p {
          margin: 15px 0 0;
          color: #879dab;
          font-size: 13px;
          line-height: 1.74;
        }

        .capabilityGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .capabilityCard {
          min-height: 230px;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .capabilityCard:hover {
          transform: translateY(-5px);
          border-color: rgba(104, 229, 255, 0.32);
        }

        .capabilityCard > span {
          display: inline-grid;
          place-items: center;
          width: 44px;
          height: 44px;
          margin-bottom: 34px;
          border: 1px solid rgba(104, 229, 255, 0.24);
          border-radius: 13px;
          color: var(--cyan);
          background: rgba(104, 229, 255, 0.05);
          font-size: 11px;
          font-weight: 950;
        }

        .routeExamples {
          display: grid;
          grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
          gap: 52px;
          align-items: center;
        }

        .routeExamplesCopy .primaryButton {
          margin-top: 26px;
        }

        .routeList {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .routeList span {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 48px;
          padding: 11px 14px;
          border: 1px solid rgba(140, 197, 222, 0.12);
          border-radius: 12px;
          color: #a2b4bf;
          background: rgba(5, 18, 29, 0.7);
          font-size: 12px;
          font-weight: 700;
        }

        .routeList i {
          color: var(--green);
          font-style: normal;
        }

        .determinationGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .determinationGrid strong {
          color: var(--cyan);
          font-size: 13px;
          letter-spacing: 0.1em;
        }

        .determinationGrid article:nth-child(2) strong {
          color: var(--gold);
        }

        .determinationGrid article:nth-child(3) strong {
          color: #ff8f8f;
        }

        .determinationGrid article:nth-child(4) strong {
          color: var(--violet);
        }

        .boundary {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          gap: 48px;
          align-items: center;
          margin-top: 76px;
          padding: clamp(28px, 5vw, 48px);
          border: 1px solid rgba(255, 191, 105, 0.19);
          border-radius: 22px;
          background: rgba(36, 27, 14, 0.43);
        }

        .boundary .eyebrow {
          color: var(--gold);
        }

        .boundary > p {
          margin: 0;
          color: #aaa294;
          font-size: 14px;
          line-height: 1.82;
        }

        .enterPanel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 34px;
          margin-top: 26px;
          padding: clamp(28px, 5vw, 48px);
          border: 1px solid rgba(104, 229, 255, 0.2);
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(10, 37, 54, 0.78), rgba(5, 19, 30, 0.92));
        }

        .enterPanel > div {
          max-width: 760px;
        }

        .enterPanel p:last-child {
          margin: 17px 0 0;
          color: #91a7b4;
          line-height: 1.72;
        }

        .enterButton {
          gap: 26px;
          flex: 0 0 auto;
          min-height: 58px;
          padding-inline: 24px;
          color: #031118;
          background: linear-gradient(135deg, var(--cyan), var(--green));
        }

        .enterButton span {
          font-size: 20px;
        }

        footer {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          margin-top: 34px;
          padding: 22px 4px 0;
          border-top: 1px solid rgba(140, 197, 222, 0.12);
          color: #657b89;
          font-size: 11px;
          font-weight: 750;
        }

        footer a {
          color: #8198a6;
          text-decoration: none;
        }

        footer a:hover {
          color: var(--cyan);
        }

        @media (max-width: 980px) {
          .hero,
          .routeExamples,
          .boundary {
            grid-template-columns: 1fr;
          }

          .purposeGrid,
          .capabilityGrid,
          .determinationGrid {
            grid-template-columns: 1fr;
          }

          .chain {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .chainStep:nth-child(4) {
            border-right: 0;
          }

          .chainStep:nth-child(-n + 4) {
            border-bottom: 1px solid rgba(140, 197, 222, 0.13);
          }
        }

        @media (max-width: 720px) {
          .shell {
            width: min(100% - 20px, 1280px);
          }

          .topbar nav a:not(.navButton) {
            display: none;
          }

          .hero {
            padding: 26px 20px 30px;
            border-radius: 20px;
          }

          .hero h1 {
            font-size: clamp(3rem, 15.5vw, 5.1rem);
          }

          .routeList {
            grid-template-columns: 1fr;
          }

          .chain {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .chainStep {
            border-bottom: 1px solid rgba(140, 197, 222, 0.13);
          }

          .chainStep:nth-child(even) {
            border-right: 0;
          }

          .chainStep:nth-child(n + 7) {
            border-bottom: 0;
          }

          .enterPanel,
          footer {
            align-items: stretch;
            flex-direction: column;
          }

          .enterButton {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
