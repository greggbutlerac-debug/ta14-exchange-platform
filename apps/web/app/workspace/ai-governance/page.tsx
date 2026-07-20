import Link from 'next/link';

const PRIMARY_TOOLS = [
  {
    eyebrow: 'Construct',
    title: 'Build a Governed AI Route',
    description:
      'Define the proposed consequence through Reality, Record, Continuity, Admissibility, Binding, Commit, Execution, and Outcome.',
    href: '/workspace/build',
    action: 'Open Route Builder',
    glyph: '◇',
  },
  {
    eyebrow: 'Evaluate',
    title: 'Test the Route',
    description:
      'Run repeatable simulations, expose missing evidence or authority, and receive an ALLOW, HOLD, DENY, or ESCALATE determination.',
    href: '/workspace/testing',
    action: 'Open Testing Desk',
    glyph: '◎',
  },
  {
    eyebrow: 'Correct',
    title: 'Resolve Broken Links',
    description:
      'Return findings to the route, correct the precise failed stage, and preserve the difference between the prior and corrected state.',
    href: '/workspace/corrections',
    action: 'Open Corrections',
    glyph: '↺',
  },
] as const;

const RECORD_TOOLS = [
  {
    title: 'My Routes',
    description:
      'Open account-scoped and locally preserved route drafts without returning to the general workspace gateway.',
    href: '/workspace/routes',
    glyph: 'R',
  },
  {
    title: 'Route Registry',
    description:
      'Inspect registered route identities, states, domains, and preserved governance references.',
    href: '/workspace/registry',
    glyph: '⌁',
  },
  {
    title: 'Replay',
    description:
      'Re-evaluate preserved route packages and compare current findings with earlier determinations.',
    href: '/workspace/replay',
    glyph: '▶',
  },
  {
    title: 'Verification',
    description:
      'Verify receipts and preserved artifacts independently from the interface that created them.',
    href: '/workspace/verify',
    glyph: '✓',
  },
  {
    title: 'Receipts',
    description:
      'Review the records produced by route testing, review, correction, and execution-boundary activity.',
    href: '/workspace/receipts',
    glyph: '▤',
  },
  {
    title: 'Preservation',
    description:
      'Preserve canonical route state, dependencies, findings, and continuity before consequential execution.',
    href: '/workspace/preservation',
    glyph: '⬡',
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

export default function AIGovernancePlaygroundPage() {
  return (
    <main className="aiPlayground">
      <section className="hero">
        <div className="heroGlow" aria-hidden="true" />

        <div className="heroTopline">
          <span className="statusDot" />
          DEDICATED PLAYGROUND · AI GOVERNANCE
        </div>

        <div className="heroGrid">
          <div>
            <p className="eyebrow">TA-14 AI Governance Exchange</p>
            <h1>
              Govern the route
              <span>before the AI acts.</span>
            </h1>
            <p className="heroCopy">
              This is the dedicated AI Governance playground. Build a
              consequence-bearing route, test its evidence and authority,
              correct failed links, preserve the admitted state, and verify the
              resulting record without being sent back through the general
              workspace gateway.
            </p>

            <div className="heroActions">
              <Link className="primaryButton" href="/workspace/build">
                Build an AI Route
              </Link>
              <Link className="secondaryButton" href="/workspace/testing">
                Run a Free Simulation
              </Link>
            </div>
          </div>

          <aside className="principleCard">
            <p className="eyebrow">Governing principle</p>
            <blockquote>
              No admissible evidence.
              <br />
              No admissible execution.
            </blockquote>
            <p>
              A confident model output, policy declaration, approval screen, or
              dashboard status is not proof that a consequential action is
              legitimate.
            </p>
          </aside>
        </div>
      </section>

      <section className="chainPanel" aria-label="TA-14 admissibility chain">
        {CHAIN.map((stage, index) => (
          <div className="chainItem" key={stage}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{stage}</strong>
            {index < CHAIN.length - 1 ? (
              <i aria-hidden="true">→</i>
            ) : null}
          </div>
        ))}
      </section>

      <section className="section">
        <div className="sectionHeading">
          <p className="eyebrow">Start here</p>
          <h2>Build, test, and correct the actual route.</h2>
          <p>
            These are the primary working areas for AI governance. Each opens
            directly into its own tool rather than returning you to the
            workspace choice screen.
          </p>
        </div>

        <div className="primaryGrid">
          {PRIMARY_TOOLS.map((tool) => (
            <Link className="primaryCard" href={tool.href} key={tool.title}>
              <div className="cardTop">
                <span className="cardGlyph">{tool.glyph}</span>
                <span className="cardArrow">↗</span>
              </div>
              <p className="eyebrow">{tool.eyebrow}</p>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <strong>{tool.action}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sectionHeading compact">
          <p className="eyebrow">Continue the lifecycle</p>
          <h2>Preserve and verify what the route became.</h2>
          <p>
            AI governance does not end with a test result. The route, findings,
            corrections, replay history, receipts, and verification path must
            remain connected.
          </p>
        </div>

        <div className="recordGrid">
          {RECORD_TOOLS.map((tool) => (
            <Link className="recordCard" href={tool.href} key={tool.title}>
              <span className="recordGlyph">{tool.glyph}</span>
              <div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
              </div>
              <span className="recordArrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="partnerNetwork">
        <div className="partnerNetworkCopy">
          <p className="eyebrow">TA-14 Partner Review Network</p>
          <h2>Three independent governance pathways. One bounded review network.</h2>
          <p>
            Explore the current TA-14 Partner Review Network, including Elias /
            LOVE-OS, AnchorStack, and AB / BIGMAE / Elias. Each pathway preserves
            the partner's independent architecture while adding written review
            boundaries and TA-14 second-layer admissible-execution review.
          </p>

          <div className="partnerPills" aria-label="Current partner pathways">
            <span>Elias / LOVE-OS</span>
            <span>AnchorStack</span>
            <span>AB / BIGMAE / Elias</span>
          </div>

          <Link className="partnerButton" href="/partner-review-network">
            Explore the Partner Review Network
          </Link>
        </div>

        <div className="partnerNetworkEmblem">
          <img
            src="/images/ta-14-partner-review-network-emblem.png"
            alt="TA-14 Partner Review Network emblem"
          />
          <p>Interactive partner profiles and governance boundaries</p>
        </div>
      </section>

      <section className="boundary">
        <div>
          <p className="eyebrow">Declared boundary</p>
          <h2>A simulation is not production authority.</h2>
        </div>
        <p>
          Free exploration can reveal route defects and teach the TA-14
          discipline. It does not manufacture evidence, validate a false
          assertion, confer organizational authority, or create a
          production-admissible execution receipt. Those boundaries must remain
          explicit.
        </p>
      </section>

      <footer className="playgroundFooter">
        <Link href="/">← Public homepage</Link>
        <Link href="/workspace">All playgrounds</Link>
        <Link href="/workspace/routes">My Routes →</Link>
      </footer>

      <style>{`
        .aiPlayground {
          --cyan: #68e5ff;
          --green: #62efb9;
          --violet: #a495ff;
          --ink: #071019;
          --panel: rgba(9, 25, 36, 0.84);
          --line: rgba(145, 205, 225, 0.16);
          position: relative;
          min-height: 100vh;
          padding: 42px clamp(18px, 4vw, 64px) 56px;
          overflow: hidden;
          color: #f3f9fc;
          background:
            radial-gradient(circle at 78% 8%, rgba(104, 229, 255, 0.12), transparent 28%),
            radial-gradient(circle at 8% 48%, rgba(164, 149, 255, 0.09), transparent 34%),
            linear-gradient(180deg, #061019 0%, #03090e 100%);
        }

        .aiPlayground::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.28;
          background-image:
            linear-gradient(rgba(104, 229, 255, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(104, 229, 255, 0.045) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        .hero,
        .chainPanel,
        .section,
        .partnerNetwork,
        .boundary,
        .playgroundFooter {
          position: relative;
          z-index: 1;
          width: min(1240px, 100%);
          margin-inline: auto;
        }

        .hero {
          padding: clamp(28px, 5vw, 68px);
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 28px;
          background:
            linear-gradient(145deg, rgba(15, 39, 53, 0.94), rgba(5, 16, 24, 0.96));
          box-shadow: 0 32px 90px rgba(0, 0, 0, 0.28);
        }

        .heroGlow {
          position: absolute;
          top: -180px;
          right: -120px;
          width: 440px;
          height: 440px;
          border-radius: 999px;
          background: var(--cyan);
          filter: blur(110px);
          opacity: 0.14;
        }

        .heroTopline,
        .eyebrow {
          color: var(--cyan);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .heroTopline {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 36px;
        }

        .statusDot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--green);
          box-shadow: 0 0 16px var(--green);
        }

        .heroGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
          gap: clamp(30px, 6vw, 76px);
          align-items: end;
        }

        .eyebrow {
          margin: 0 0 13px;
        }

        .hero h1 {
          max-width: 780px;
          margin: 0;
          font-size: clamp(3.2rem, 7vw, 7.4rem);
          line-height: 0.9;
          letter-spacing: -0.07em;
        }

        .hero h1 span {
          display: block;
          margin-top: 0.12em;
          color: transparent;
          background: linear-gradient(90deg, #fff, var(--cyan), var(--green));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .heroCopy {
          max-width: 760px;
          margin: 28px 0 0;
          color: #9bb1bf;
          font-size: 16px;
          line-height: 1.8;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 19px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 850;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .primaryButton {
          color: #031118;
          background: linear-gradient(135deg, var(--cyan), var(--green));
        }

        .secondaryButton {
          border: 1px solid rgba(104, 229, 255, 0.25);
          color: #dff7ff;
          background: rgba(104, 229, 255, 0.055);
        }

        .primaryButton:hover,
        .secondaryButton:hover {
          transform: translateY(-2px);
        }

        .principleCard {
          padding: 26px;
          border: 1px solid rgba(98, 239, 185, 0.2);
          border-radius: 20px;
          background: rgba(4, 15, 22, 0.72);
        }

        .principleCard blockquote {
          margin: 18px 0;
          color: #fff;
          font-size: clamp(1.45rem, 3vw, 2.25rem);
          line-height: 1.18;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .principleCard > p:last-child {
          margin: 0;
          color: #8fa6b4;
          font-size: 13px;
          line-height: 1.7;
        }

        .chainPanel {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          margin-top: 18px;
          border: 1px solid var(--line);
          border-radius: 18px;
          overflow: hidden;
          background: rgba(7, 20, 29, 0.9);
        }

        .chainItem {
          position: relative;
          min-width: 0;
          padding: 17px 12px;
          border-right: 1px solid var(--line);
          text-align: center;
        }

        .chainItem:last-child {
          border-right: 0;
        }

        .chainItem span {
          display: block;
          margin-bottom: 5px;
          color: #527080;
          font-size: 9px;
          font-weight: 900;
        }

        .chainItem strong {
          color: #c9dce5;
          font-size: 10px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .chainItem i {
          position: absolute;
          top: 50%;
          right: -5px;
          z-index: 2;
          color: var(--green);
          font-style: normal;
          transform: translateY(-50%);
        }

        .section {
          padding-top: 72px;
        }

        .sectionHeading {
          max-width: 790px;
          margin-bottom: 28px;
        }

        .sectionHeading.compact {
          max-width: 720px;
        }

        .sectionHeading h2,
        .boundary h2 {
          margin: 0;
          font-size: clamp(2.1rem, 4vw, 4.4rem);
          line-height: 1;
          letter-spacing: -0.055em;
        }

        .sectionHeading > p:last-child {
          margin: 18px 0 0;
          color: #8fa7b6;
          line-height: 1.75;
        }

        .primaryGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .primaryCard {
          display: flex;
          min-height: 330px;
          flex-direction: column;
          padding: 26px;
          border: 1px solid var(--line);
          border-radius: 20px;
          color: inherit;
          text-decoration: none;
          background:
            linear-gradient(145deg, rgba(12, 32, 44, 0.9), rgba(5, 16, 24, 0.94));
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }

        .primaryCard:hover {
          transform: translateY(-7px);
          border-color: rgba(104, 229, 255, 0.42);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 48px;
        }

        .cardGlyph,
        .recordGlyph {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(104, 229, 255, 0.25);
          border-radius: 14px;
          color: var(--cyan);
          background: rgba(104, 229, 255, 0.055);
          font-weight: 900;
        }

        .cardArrow {
          color: #577484;
          font-size: 21px;
        }

        .primaryCard h3,
        .recordCard h3 {
          margin: 0;
          font-size: 1.55rem;
          letter-spacing: -0.035em;
        }

        .primaryCard > p:not(.eyebrow) {
          flex: 1;
          margin: 16px 0 28px;
          color: #91a8b6;
          font-size: 14px;
          line-height: 1.7;
        }

        .primaryCard > strong {
          color: var(--green);
          font-size: 12px;
        }

        .recordGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .recordCard {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
          padding: 22px;
          border: 1px solid var(--line);
          border-radius: 17px;
          color: inherit;
          text-decoration: none;
          background: rgba(8, 23, 33, 0.78);
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .recordCard:hover {
          transform: translateX(4px);
          border-color: rgba(98, 239, 185, 0.34);
        }

        .recordGlyph {
          width: 43px;
          height: 43px;
          border-color: rgba(98, 239, 185, 0.22);
          color: var(--green);
          background: rgba(98, 239, 185, 0.045);
        }

        .recordCard p {
          margin: 8px 0 0;
          color: #8199a8;
          font-size: 12px;
          line-height: 1.6;
        }

        .recordArrow {
          color: var(--green);
        }

        .partnerNetwork {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.85fr);
          gap: clamp(28px, 5vw, 64px);
          align-items: center;
          margin-top: 72px;
          padding: clamp(28px, 5vw, 52px);
          overflow: hidden;
          border: 1px solid rgba(255, 191, 105, 0.24);
          border-radius: 24px;
          background:
            radial-gradient(circle at 88% 18%, rgba(255, 191, 105, 0.12), transparent 34%),
            linear-gradient(145deg, rgba(16, 34, 47, 0.96), rgba(8, 20, 29, 0.96));
          box-shadow: 0 28px 72px rgba(0, 0, 0, 0.24);
        }

        .partnerNetwork h2 {
          max-width: 760px;
          margin: 0;
          font-size: clamp(2.1rem, 4vw, 4.4rem);
          line-height: 1;
          letter-spacing: -0.055em;
        }

        .partnerNetworkCopy > p:not(.eyebrow) {
          max-width: 760px;
          margin: 20px 0 0;
          color: #91a8b6;
          line-height: 1.78;
        }

        .partnerPills {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 24px;
        }

        .partnerPills span {
          padding: 8px 11px;
          border: 1px solid rgba(104, 229, 255, 0.18);
          border-radius: 999px;
          color: #c9eefa;
          background: rgba(104, 229, 255, 0.05);
          font-size: 11px;
          font-weight: 800;
        }

        .partnerButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          margin-top: 28px;
          padding: 0 19px;
          border-radius: 12px;
          color: #171006;
          background: linear-gradient(135deg, #ffe0a6, #ffbf69);
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .partnerButton:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(255, 191, 105, 0.16);
        }

        .partnerNetworkEmblem {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 24px;
          background: rgba(2, 10, 16, 0.52);
          text-align: center;
        }

        .partnerNetworkEmblem img {
          display: block;
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
          border-radius: 18px;
        }

        .partnerNetworkEmblem p {
          margin: 14px 0 2px;
          color: #8da4b2;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .boundary {
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          gap: 50px;
          align-items: center;
          margin-top: 72px;
          padding: clamp(28px, 5vw, 48px);
          border: 1px solid rgba(255, 191, 105, 0.2);
          border-radius: 22px;
          background: rgba(31, 23, 13, 0.48);
        }

        .boundary .eyebrow {
          color: #ffbf69;
        }

        .boundary > p {
          margin: 0;
          color: #a8a092;
          font-size: 14px;
          line-height: 1.8;
        }

        .playgroundFooter {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          margin-top: 34px;
          padding: 22px 4px 0;
          border-top: 1px solid var(--line);
        }

        .playgroundFooter a {
          color: #87a1b0;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
        }

        .playgroundFooter a:hover {
          color: var(--cyan);
        }

        @media (max-width: 980px) {
          .heroGrid,
          .partnerNetwork,
          .boundary {
            grid-template-columns: 1fr;
          }

          .primaryGrid {
            grid-template-columns: 1fr;
          }

          .primaryCard {
            min-height: 280px;
          }

          .chainPanel {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .chainItem:nth-child(4) {
            border-right: 0;
          }

          .chainItem:nth-child(-n + 4) {
            border-bottom: 1px solid var(--line);
          }
        }

        @media (max-width: 700px) {
          .aiPlayground {
            padding-inline: 12px;
          }

          .hero {
            padding: 25px 20px 28px;
            border-radius: 20px;
          }

          .hero h1 {
            font-size: clamp(3rem, 16vw, 5.2rem);
          }

          .recordGrid {
            grid-template-columns: 1fr;
          }

          .chainPanel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .chainItem {
            border-bottom: 1px solid var(--line);
          }

          .chainItem:nth-child(even) {
            border-right: 0;
          }

          .chainItem:nth-child(n + 7) {
            border-bottom: 0;
          }

          .playgroundFooter {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
