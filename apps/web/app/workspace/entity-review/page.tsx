"use client";

import Link from "next/link";

const reviewTypes = [
  {
    title: "Organization Review",
    description:
      "Review an organization’s declared governance architecture, authority structure, evidence practices, review boundaries, and execution controls.",
    href: "/workspace/entity-review/organization",
    action: "Start organization review",
  },
  {
    title: "AI System Review",
    description:
      "Review an AI system across identity, purpose, authority, evidence, tools, payloads, commitments, execution conditions, and outcomes.",
    href: "/workspace/entity-review/ai-system",
    action: "Start AI system review",
  },
  {
    title: "Architecture Review",
    description:
      "Examine a governance, runtime, operational, or technical architecture without treating a diagram or claim as proof of performance.",
    href: "/workspace/entity-review/architecture",
    action: "Start architecture review",
  },
  {
    title: "Consequential Route Review",
    description:
      "Review a complete route from declared reality and evidence through authority, commitment, execution, and outcome verification.",
    href: "/workspace/entity-review/route",
    action: "Start route review",
  },
];

const reviewLayers = [
  "Identity",
  "Declared purpose",
  "Scope",
  "Authority",
  "Evidence",
  "Continuity",
  "Architecture",
  "Tools and dependencies",
  "Payloads",
  "Commitments",
  "Execution controls",
  "Outcome verification",
  "Change history",
  "Limitations",
];

const partnerLanes = [
  {
    name: "Boundary-only",
    text: "A specialist identifies limits, exclusions, and conditions without reviewing the whole entity.",
  },
  {
    name: "Referral-only",
    text: "A partner identifies the appropriate review route and transfers the entity without making a final determination.",
  },
  {
    name: "Scoped review",
    text: "A qualified reviewer examines a declared layer while preserving the limits of that specialty.",
  },
  {
    name: "Partner-track",
    text: "A reviewer participates in a broader governed route with attributable findings and second-layer review.",
  },
];

export default function EntityReviewPage() {
  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="glow glowOne" />
      <div className="glow glowTwo" />

      <header className="topbar shell">
        <Link href="/" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>Entity Review</strong>
            <small>TA-14 AI Governance Exchange</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/workspace/governed-records">Governed Records</Link>
          <Link href="/workspace/environmental-records">
            Environmental Records
          </Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">ENTITY REVIEW WORKSPACE</p>
          <h1>Review the whole route, not a polished fragment.</h1>
          <p className="lead">
            Submit an organization, AI system, governance architecture,
            operational model, or consequential route for bounded review across
            identity, authority, evidence, continuity, commitments, execution,
            and outcomes.
          </p>

          <div className="heroActions">
            <Link
              className="primaryButton"
              href="/workspace/entity-review/new"
            >
              Start an Entity Review
              <span>→</span>
            </Link>
            <Link
              className="secondaryButton"
              href="/workspace/entity-review/status"
            >
              Review Status
            </Link>
          </div>
        </div>

        <div className="reviewVisual" aria-hidden="true">
          <div className="reviewRing ringOne" />
          <div className="reviewRing ringTwo" />
          <div className="reviewRing ringThree" />

          <div className="reviewCore">
            <span className="coreMark">◎</span>
            <strong>Entity Review</strong>
            <small>Full-chain · Bounded · Attributable</small>
          </div>

          <span className="node nodeOne">ID</span>
          <span className="node nodeTwo">EV</span>
          <span className="node nodeThree">AU</span>
          <span className="node nodeFour">EX</span>
          <span className="node nodeFive">OUT</span>
        </div>
      </section>

      <section className="principle shell">
        <p className="eyebrow">THE REVIEW PRINCIPLE</p>
        <h2>Others may review a sliver. TA-14 reviews the route.</h2>
        <p>
          A favorable policy, control, model card, risk score, or architecture
          diagram does not establish that the complete entity can support
          admissible execution. Entity Review preserves the whole chain and the
          boundary of every finding.
        </p>
      </section>

      <section className="reviewTypes shell">
        <div className="sectionIntro">
          <p className="eyebrow">CHOOSE THE ENTITY</p>
          <h2>Start with what is actually being reviewed.</h2>
          <p>
            Every review begins with a declared entity, purpose, scope, evidence
            boundary, and review question.
          </p>
        </div>

        <div className="reviewGrid">
          {reviewTypes.map((item, index) => (
            <article key={item.title}>
              <span className="number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link href={item.href}>
                {item.action}
                <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="layers shell">
        <div>
          <p className="eyebrow">REVIEW LAYERS</p>
          <h2>A review can remain complete without pretending every layer is valid.</h2>
          <p>
            Each layer can be supported, unresolved, disputed, outside scope, or
            insufficient. Missing evidence remains visible instead of being
            silently converted into confidence.
          </p>
        </div>

        <div className="layerGrid">
          {reviewLayers.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="outcomes shell">
        <div className="outcomeIntro">
          <p className="eyebrow">REVIEW OUTCOMES</p>
          <h2>A review produces a bounded record—not a marketing badge.</h2>
        </div>

        <div className="outcomeGrid">
          <article className="allow">
            <span>ALLOW</span>
            <h3>Supported for the declared route</h3>
            <p>
              The submitted evidence and authority support the stated review
              condition within the preserved scope.
            </p>
          </article>

          <article className="hold">
            <span>HOLD</span>
            <h3>Evidence or authority is incomplete</h3>
            <p>
              The route cannot advance until specified missing or unresolved
              conditions are corrected.
            </p>
          </article>

          <article className="deny">
            <span>DENY</span>
            <h3>The declared route is not admissible</h3>
            <p>
              Evidence, authority, continuity, or execution conditions conflict
              with the declared route.
            </p>
          </article>

          <article className="escalate">
            <span>ESCALATE</span>
            <h3>Specialized or higher authority is required</h3>
            <p>
              The review exceeds the present scope, authority, expertise, or
              evidence boundary.
            </p>
          </article>
        </div>
      </section>

      <section className="partnerNetwork shell">
        <div className="partnerIntro">
          <p className="eyebrow">PARTNER REVIEW NETWORK</p>
          <h2>Independent expertise without collapsing review boundaries.</h2>
          <p>
            Qualified partners can review specialized layers while their
            findings remain attributable, bounded, and available for second-layer
            TA-14 review.
          </p>

          <Link
            className="partnerButton"
            href="/workspace/entity-review/partner-network"
          >
            Explore the Partner Review Network
            <span>→</span>
          </Link>
        </div>

        <div className="partnerLanes">
          {partnerLanes.map((lane) => (
            <article key={lane.name}>
              <h3>{lane.name}</h3>
              <p>{lane.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="euSection shell">
        <div>
          <p className="eyebrow">EU AI ACT</p>
          <h2>Review an entity against applicable EU AI Act requirements.</h2>
          <p>
            Identify applicable obligations, map each requirement to the
            relevant entity and evidence layer, preserve declared compliance
            measures, and expose unresolved or unsupported claims.
          </p>
        </div>

        <Link
          className="euButton"
          href="/workspace/entity-review/eu-ai-act"
        >
          EU AI Act Entity Review
          <span>→</span>
        </Link>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>Submission does not equal approval, certification, or legal compliance.</h2>
        </div>
        <p>
          Entity Review creates a dated, attributable, bounded record of what
          was submitted, what was examined, what was supported, what remained
          unresolved, and which reviewer or authority made each finding.
        </p>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">BEGIN THE REVIEW</p>
          <h2>Bring the entity. Declare the route. Preserve the evidence.</h2>
          <p>
            Start with the entity and review question, then build the complete
            attributable chain around it.
          </p>
        </div>

        <Link
          className="primaryButton"
          href="/workspace/entity-review/new"
        >
          Start Entity Review
          <span>→</span>
        </Link>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/">Return to the four doors</Link>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #090a0d;
        }

        :global(body) {
          margin: 0;
          color: #fffaf0;
          background:
            radial-gradient(circle at 12% 8%, rgba(255, 177, 30, 0.12), transparent 28%),
            radial-gradient(circle at 88% 24%, rgba(202, 118, 22, 0.1), transparent 28%),
            linear-gradient(180deg, #090a0d 0%, #11100f 50%, #08090d 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        main {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .shell {
          width: min(1260px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .stars {
          position: fixed;
          inset: -12%;
          pointer-events: none;
          z-index: -4;
          opacity: 0.34;
        }

        .starsOne {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.72) 0 1px, transparent 1.4px);
          background-size: 92px 92px;
          animation: starDrift 34s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(255,183,48,.6) 0 1px, transparent 1.4px);
          background-size: 156px 156px;
          background-position: 39px 58px;
          animation: starDrift 48s linear infinite reverse;
        }

        .glow {
          position: fixed;
          width: 470px;
          height: 470px;
          border-radius: 999px;
          filter: blur(120px);
          opacity: 0.11;
          z-index: -3;
          animation: glowMove 14s ease-in-out infinite alternate;
        }

        .glowOne {
          left: -170px;
          top: -180px;
          background: #ffb31e;
        }

        .glowTwo {
          right: -180px;
          top: 44%;
          background: #ca6f18;
          animation-delay: -6s;
        }

        .topbar {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(190, 160, 112, 0.17);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
        }

        .brandMark {
          min-width: 64px;
          height: 38px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #1a1003;
          background: linear-gradient(135deg, #ffb31f, #ffe7a8);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          color: #958a78;
          margin-top: 2px;
        }

        nav {
          display: flex;
          gap: 22px;
        }

        nav a,
        footer a {
          color: #b9ae9e;
          text-decoration: none;
          font-size: 14px;
        }

        .hero {
          min-height: 650px;
          display: grid;
          grid-template-columns: 1.12fr 0.88fr;
          gap: 50px;
          align-items: center;
          padding: 76px 0;
        }

        .eyebrow {
          margin: 0;
          color: #ffb421;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        h1 {
          max-width: 850px;
          margin: 18px 0 22px;
          font-size: clamp(48px, 7vw, 90px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .lead {
          max-width: 760px;
          margin: 0;
          color: #b5aa9b;
          font-size: 18px;
          line-height: 1.68;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton,
        .partnerButton,
        .euButton {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          border-radius: 14px;
          padding: 0 20px;
          text-decoration: none;
          font-weight: 850;
        }

        .primaryButton {
          color: #1b1002;
          background: linear-gradient(135deg, #ffb51f, #ffe6a4);
          box-shadow: 0 14px 38px rgba(255, 174, 28, 0.18);
        }

        .secondaryButton {
          color: #efe6d8;
          border: 1px solid rgba(187, 156, 107, 0.27);
          background: rgba(255, 255, 255, 0.035);
        }

        .reviewVisual {
          min-height: 470px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .reviewCore {
          width: 210px;
          height: 210px;
          border-radius: 999px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 190, 71, 0.72);
          background:
            radial-gradient(circle, rgba(255, 180, 31, 0.16), rgba(24, 16, 6, 0.96) 68%);
          box-shadow:
            0 0 50px rgba(255, 175, 25, 0.28),
            inset 0 0 34px rgba(255, 181, 31, 0.15);
          z-index: 3;
        }

        .coreMark {
          font-size: 52px;
          color: #ffd16c;
          line-height: 1;
        }

        .reviewCore strong {
          margin-top: 8px;
          font-size: 22px;
        }

        .reviewCore small {
          margin-top: 7px;
          color: #d2a95f;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .reviewRing {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(255, 180, 34, 0.2);
          animation: rotate 22s linear infinite;
        }

        .ringOne {
          width: 285px;
          height: 285px;
        }

        .ringTwo {
          width: 365px;
          height: 365px;
          animation-duration: 31s;
          animation-direction: reverse;
        }

        .ringThree {
          width: 445px;
          height: 445px;
          animation-duration: 39s;
        }

        .node {
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 191, 72, 0.55);
          background: rgba(42, 26, 6, 0.94);
          color: #ffd476;
          font-size: 11px;
          font-weight: 900;
          box-shadow: 0 0 18px rgba(255, 174, 25, 0.2);
          z-index: 4;
        }

        .nodeOne {
          top: 52px;
          left: 42%;
        }

        .nodeTwo {
          left: 34px;
          top: 47%;
        }

        .nodeThree {
          right: 38px;
          top: 36%;
        }

        .nodeFour {
          left: 24%;
          bottom: 40px;
        }

        .nodeFive {
          right: 20%;
          bottom: 50px;
        }

        .principle,
        .layers,
        .outcomes,
        .partnerNetwork,
        .euSection,
        .boundary,
        .finalCta {
          border: 1px solid rgba(181, 148, 96, 0.17);
          background:
            linear-gradient(180deg, rgba(24, 20, 15, 0.91), rgba(12, 11, 10, 0.96));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.24);
        }

        .principle {
          padding: 52px;
          text-align: center;
        }

        .principle h2,
        .sectionIntro h2,
        .layers h2,
        .outcomes h2,
        .partnerNetwork h2,
        .euSection h2,
        .boundary h2,
        .finalCta h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .principle > p:not(.eyebrow),
        .sectionIntro > p:not(.eyebrow),
        .layers p:not(.eyebrow),
        .outcomes p,
        .partnerNetwork p:not(.eyebrow),
        .euSection p:not(.eyebrow),
        .boundary > p,
        .finalCta p:not(.eyebrow) {
          color: #b4aa9d;
          line-height: 1.68;
        }

        .principle > p:not(.eyebrow) {
          max-width: 800px;
          margin: 0 auto;
        }

        .reviewTypes {
          padding: 90px 0;
        }

        .sectionIntro {
          max-width: 740px;
          margin-bottom: 34px;
        }

        .sectionIntro > p:not(.eyebrow) {
          margin: 0;
        }

        .reviewGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .reviewGrid article {
          min-height: 300px;
          padding: 30px;
          border-radius: 22px;
          border: 1px solid rgba(176, 144, 95, 0.18);
          background:
            linear-gradient(180deg, rgba(25, 21, 16, 0.88), rgba(12, 11, 10, 0.96));
          transition:
            transform 220ms ease,
            border-color 220ms ease;
        }

        .reviewGrid article:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 180, 34, 0.48);
        }

        .number {
          color: #ffb421;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .reviewGrid h3 {
          margin: 18px 0 12px;
          font-size: 28px;
          letter-spacing: -0.03em;
        }

        .reviewGrid p {
          color: #b4aa9d;
          line-height: 1.65;
          min-height: 84px;
        }

        .reviewGrid a {
          display: inline-flex;
          gap: 20px;
          color: #ffc457;
          text-decoration: none;
          font-weight: 850;
        }

        .layers {
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 42px;
          align-items: center;
        }

        .layers h2 {
          font-size: clamp(30px, 4.5vw, 50px);
        }

        .layerGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .layerGrid span {
          padding: 10px 13px;
          border-radius: 999px;
          border: 1px solid rgba(255, 182, 36, 0.2);
          background: rgba(180, 112, 20, 0.06);
          color: #f1e5d3;
          font-size: 13px;
          font-weight: 750;
        }

        .outcomes {
          margin-top: 22px;
          padding: 42px;
        }

        .outcomeIntro {
          max-width: 920px;
        }

        .outcomes h2 {
          font-size: clamp(30px, 4.5vw, 50px);
        }

        .outcomeGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 30px;
        }

        .outcomeGrid article {
          padding: 24px 20px;
          border-radius: 18px;
          border: 1px solid rgba(181, 149, 102, 0.16);
          background: rgba(100, 73, 34, 0.05);
        }

        .outcomeGrid span {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .outcomeGrid h3 {
          margin: 15px 0 10px;
          font-size: 21px;
          line-height: 1.15;
        }

        .outcomeGrid p {
          margin: 0;
          line-height: 1.58;
        }

        .allow span {
          color: #6fe0b3;
        }

        .hold span {
          color: #ffd15d;
        }

        .deny span {
          color: #ff7a7a;
        }

        .escalate span {
          color: #b99aff;
        }

        .partnerNetwork {
          margin-top: 22px;
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 42px;
          align-items: start;
        }

        .partnerNetwork h2 {
          font-size: clamp(30px, 4.5vw, 48px);
        }

        .partnerButton {
          margin-top: 8px;
          color: #fff3da;
          border: 1px solid rgba(255, 184, 42, 0.32);
          background: rgba(168, 101, 17, 0.09);
        }

        .partnerLanes {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .partnerLanes article {
          padding: 20px;
          border-radius: 17px;
          border: 1px solid rgba(179, 145, 95, 0.16);
          background: rgba(96, 67, 29, 0.05);
        }

        .partnerLanes h3 {
          margin: 0 0 8px;
          font-size: 20px;
        }

        .partnerLanes p {
          margin: 0;
          line-height: 1.56;
        }

        .euSection {
          margin-top: 22px;
          padding: 38px 42px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
        }

        .euSection > div {
          max-width: 820px;
        }

        .euSection h2 {
          font-size: clamp(28px, 4vw, 42px);
        }

        .euButton {
          flex: 0 0 auto;
          color: #fff7e7;
          border: 1px solid rgba(255, 184, 42, 0.34);
          background: rgba(173, 104, 17, 0.1);
        }

        .boundary {
          margin-top: 22px;
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .boundary h2 {
          font-size: clamp(28px, 4vw, 44px);
        }

        .boundary > p {
          margin: 0;
        }

        .finalCta {
          margin-top: 74px;
          padding: 54px 46px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
        }

        .finalCta > div {
          max-width: 760px;
        }

        .finalCta h2 {
          font-size: clamp(36px, 5vw, 58px);
        }

        footer {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          color: #887d6e;
          font-size: 12px;
        }

        @keyframes starDrift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(90px, 140px, 0);
          }
        }

        @keyframes glowMove {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(55px, 35px, 0) scale(1.1);
          }
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          nav {
            display: none;
          }

          .hero,
          .layers,
          .partnerNetwork,
          .boundary {
            grid-template-columns: 1fr;
          }

          .outcomeGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .euSection,
          .finalCta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 680px) {
          .shell {
            width: min(100% - 20px, 1260px);
          }

          .hero {
            min-height: auto;
            padding: 58px 0;
          }

          .reviewVisual {
            min-height: 430px;
            transform: scale(0.8);
          }

          .principle,
          .layers,
          .outcomes,
          .partnerNetwork,
          .euSection,
          .boundary,
          .finalCta {
            padding: 28px 24px;
          }

          .reviewGrid,
          .outcomeGrid,
          .partnerLanes {
            grid-template-columns: 1fr;
          }

          footer {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
