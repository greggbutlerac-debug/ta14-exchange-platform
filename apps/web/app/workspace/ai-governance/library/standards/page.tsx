"use client";

import Link from "next/link";

const standards = [
  {
    title: "ISO/IEC 42001",
    subtitle: "AI management system standard",
    description:
      "Explore organizational governance, policy, objectives, risk treatment, operational controls, monitoring, internal review, corrective action, and continual improvement for an AI management system.",
    status: "Priority module",
    href: "/workspace/ai-governance/library/standards/iso-iec-42001",
  },
  {
    title: "ISO/IEC 23894",
    subtitle: "AI risk management guidance",
    description:
      "Review risk identification, analysis, evaluation, treatment, communication, monitoring, and lifecycle considerations for AI systems and organizational decision-making.",
    status: "Priority module",
    href: "/workspace/ai-governance/library/standards/iso-iec-23894",
  },
  {
    title: "ISO/IEC 38507",
    subtitle: "Governance implications of organizational AI use",
    description:
      "Examine the responsibilities of governing bodies, organizational oversight, accountability, strategic alignment, and the governance implications of deploying and using AI.",
    status: "Priority module",
    href: "/workspace/ai-governance/library/standards/iso-iec-38507",
  },
  {
    title: "IEEE AI Standards",
    subtitle: "Technical and ethical standards ecosystem",
    description:
      "Navigate relevant IEEE work involving transparency, bias, explainability, safety, accountability, system design, and responsible technology development.",
    status: "Catalog module",
    href: "/workspace/ai-governance/library/standards/ieee",
  },
];

const preservedFields = [
  "Issuing organization",
  "Official title",
  "Standard number",
  "Edition and version",
  "Publication date",
  "Amendments and corrections",
  "Legal or contractual force",
  "Scope and exclusions",
  "Applicable roles",
  "Requirement or guidance status",
  "Source locator",
  "Interpretation boundary",
  "Crosswalk relationships",
  "Review history",
];

const workflow = [
  "Read the standard context",
  "Identify applicable clauses",
  "Preserve source authority",
  "Map evidence expectations",
  "Crosswalk related obligations",
  "Build a TA-14 route",
  "Test governance conditions",
  "Preserve and verify the result",
];

export default function StandardsLibraryPage() {
  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="orb orbOne" />
      <div className="orb orbTwo" />

      <header className="topbar shell">
        <Link href="/workspace/ai-governance/library" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>AI Governance Standards</strong>
            <small>Governance Library</small>
          </span>
        </Link>

        <nav>
          <Link href="/workspace/ai-governance/library">Library</Link>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/workspace">Playground</Link>
          <Link href="/workspace/routes/new">Build Route</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">STANDARDS LIBRARY</p>
          <h1>Turn published standards into governed execution routes.</h1>
          <p className="lead">
            Explore AI governance, risk, management-system, oversight, and
            technical standards without collapsing guidance, requirements,
            legal obligations, certification claims, and implementation
            evidence into one unsupported declaration.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="#standards">
              Explore Standards
              <span>→</span>
            </Link>
            <Link className="secondaryButton" href="/workspace/routes/new">
              Build From a Standard
            </Link>
          </div>
        </div>

        <div className="heroVisual" aria-hidden="true">
          <div className="orbit orbitOne">
            <span />
          </div>
          <div className="orbit orbitTwo">
            <span />
          </div>
          <div className="orbit orbitThree">
            <span />
          </div>
          <div className="core">
            <strong>ISO</strong>
            <small>Governed Standard</small>
          </div>
        </div>
      </section>

      <section className="principle shell">
        <div>
          <p className="eyebrow">TA-14 STANDARD BOUNDARY</p>
          <h2>A standard is not automatically a law, certification, or execution control.</h2>
        </div>
        <p>
          The library preserves what a standard says, who issued it, which
          edition is being interpreted, whether a clause is mandatory or
          advisory within its own structure, and what evidence is needed before
          a related governance claim can support execution.
        </p>
      </section>

      <section className="standards shell" id="standards">
        <div className="sectionIntro">
          <p className="eyebrow">INITIAL STANDARDS CATALOG</p>
          <h2>Begin with the standards most directly connected to organizational AI governance.</h2>
          <p>
            Each module is designed to preserve source identity, version,
            interpretation boundaries, applicability, evidence expectations,
            crosswalks, and direct transition into TA-14 route construction.
          </p>
        </div>

        <div className="standardGrid">
          {standards.map((standard, index) => (
            <article key={standard.title}>
              <div className="cardTop">
                <span className="number">{String(index + 1).padStart(2, "0")}</span>
                <span className="status">{standard.status}</span>
              </div>
              <p className="subtitle">{standard.subtitle}</p>
              <h3>{standard.title}</h3>
              <p>{standard.description}</p>
              <Link href={standard.href}>
                Open standard module
                <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="preservation shell">
        <div className="preservationCopy">
          <p className="eyebrow">SOURCE AUTHORITY RECORD</p>
          <h2>Preserve the standard before interpreting the standard.</h2>
          <p>
            Every standards module should make the source, edition, authority,
            scope, interpretation status, and review history visible before a
            clause is mapped to evidence or execution.
          </p>
        </div>

        <div className="fieldGrid">
          {preservedFields.map((field) => (
            <span key={field}>{field}</span>
          ))}
        </div>
      </section>

      <section className="workflow shell">
        <div className="sectionIntro">
          <p className="eyebrow">FROM STANDARD TO ROUTE</p>
          <h2>Follow a controlled governance sequence.</h2>
        </div>

        <div className="workflowGrid">
          {workflow.map((step, index) => (
            <div key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="crosswalk shell">
        <div>
          <p className="eyebrow">CROSSWALK WITHOUT COLLAPSE</p>
          <h2>Related requirements are not always equivalent requirements.</h2>
          <p>
            TA-14 crosswalks preserve whether a relationship is equivalent,
            partial, related, conflicting, unmapped, or still unreviewed. A
            similarity in language does not prove that the same evidence,
            authority, timing, or execution condition satisfies both sources.
          </p>
        </div>

        <Link
          className="secondaryButton"
          href="/workspace/ai-governance/library/crosswalks"
        >
          Open Crosswalk Engine
        </Link>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>TA-14 does not reproduce or replace controlled standards text.</h2>
        </div>
        <p>
          Library summaries, mappings, and implementation routes should point
          users back to the authoritative source and preserve the limits of the
          interpretation. Access to a standards module does not create
          accreditation, certification, legal compliance, or proof that an
          implementation conforms to the official standard.
        </p>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">BUILD FROM THE SOURCE</p>
          <h2>Select a standard. Bind the evidence. Govern the route.</h2>
          <p>
            Move from published governance expectations into explicit
            applicability, evidence, authority, decision, commitment,
            execution, and outcome conditions.
          </p>
        </div>

        <Link className="primaryButton" href="/workspace/routes/new">
          Build a Governance Route
          <span>→</span>
        </Link>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/workspace/ai-governance/library">Return to Governance Library</Link>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
          background: #040914;
        }

        :global(body) {
          margin: 0;
          background:
            radial-gradient(circle at 12% 8%, rgba(66, 207, 190, 0.13), transparent 28%),
            radial-gradient(circle at 88% 22%, rgba(56, 104, 180, 0.13), transparent 26%),
            linear-gradient(180deg, #040914 0%, #07101f 50%, #050914 100%);
          color: #f7fbff;
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
            radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.4px);
          background-size: 92px 92px;
          animation: starDrift 34s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(99,225,209,.62) 0 1px, transparent 1.4px);
          background-size: 156px 156px;
          background-position: 39px 58px;
          animation: starDrift 48s linear infinite reverse;
        }

        .orb {
          position: fixed;
          width: 470px;
          height: 470px;
          border-radius: 999px;
          filter: blur(120px);
          opacity: 0.12;
          z-index: -3;
          animation: orbMove 14s ease-in-out infinite alternate;
        }

        .orbOne {
          left: -170px;
          top: -180px;
          background: #56dec9;
        }

        .orbTwo {
          right: -180px;
          top: 44%;
          background: #4777ff;
          animation-delay: -6s;
        }

        .topbar {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(132, 154, 188, 0.16);
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
          color: #03110f;
          background: linear-gradient(135deg, #57d9c8, #b8fff7);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          color: #7e91a6;
          margin-top: 2px;
        }

        nav {
          display: flex;
          gap: 22px;
        }

        nav a,
        footer a {
          color: #a9b8ca;
          text-decoration: none;
          font-size: 14px;
        }

        .hero {
          min-height: 650px;
          display: grid;
          grid-template-columns: 1.18fr 0.82fr;
          gap: 40px;
          align-items: center;
          padding: 76px 0;
        }

        .eyebrow {
          margin: 0;
          color: #71dfd0;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        h1 {
          max-width: 900px;
          margin: 18px 0 22px;
          font-size: clamp(48px, 7vw, 90px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .lead {
          max-width: 790px;
          margin: 0;
          color: #9fb0c4;
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
        .secondaryButton {
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
          color: #04110f;
          background: linear-gradient(135deg, #5bd9c9, #b4fff6);
          box-shadow: 0 14px 38px rgba(70, 214, 196, 0.18);
        }

        .secondaryButton {
          color: #dce8f4;
          border: 1px solid rgba(130, 162, 188, 0.25);
          background: rgba(255, 255, 255, 0.035);
        }

        .heroVisual {
          min-height: 440px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .core {
          width: 190px;
          height: 190px;
          border-radius: 999px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 1px solid rgba(102, 226, 211, 0.62);
          background:
            radial-gradient(circle, rgba(84, 218, 200, 0.18), rgba(5, 15, 25, 0.93) 62%);
          box-shadow:
            0 0 50px rgba(84, 218, 200, 0.22),
            inset 0 0 34px rgba(84, 218, 200, 0.12);
        }

        .core strong {
          font-size: 46px;
          letter-spacing: -0.04em;
        }

        .core small {
          margin-top: 6px;
          color: #84dacc;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .orbit {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(105, 221, 208, 0.2);
          animation: rotate 18s linear infinite;
        }

        .orbit span {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #72e3d4;
          box-shadow: 0 0 14px #72e3d4;
          top: 50%;
          right: -5px;
        }

        .orbitOne {
          width: 260px;
          height: 260px;
        }

        .orbitTwo {
          width: 340px;
          height: 340px;
          animation-duration: 26s;
          animation-direction: reverse;
        }

        .orbitTwo span {
          background: #78aaff;
          box-shadow: 0 0 14px #78aaff;
        }

        .orbitThree {
          width: 420px;
          height: 420px;
          animation-duration: 34s;
        }

        .orbitThree span {
          background: #c178ff;
          box-shadow: 0 0 14px #c178ff;
        }

        .principle,
        .preservation,
        .crosswalk,
        .boundary,
        .finalCta {
          border: 1px solid rgba(131, 155, 189, 0.16);
          background:
            linear-gradient(180deg, rgba(12, 21, 36, 0.9), rgba(7, 13, 24, 0.94));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.22);
        }

        .principle,
        .crosswalk,
        .boundary {
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .principle h2,
        .sectionIntro h2,
        .preservation h2,
        .crosswalk h2,
        .boundary h2,
        .finalCta h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .principle > p,
        .sectionIntro > p:not(.eyebrow),
        .preservation p:not(.eyebrow),
        .crosswalk p:not(.eyebrow),
        .boundary > p,
        .finalCta p:not(.eyebrow) {
          color: #9fafc2;
          line-height: 1.68;
        }

        .principle > p,
        .boundary > p {
          margin: 0;
        }

        .standards,
        .workflow {
          padding: 90px 0;
        }

        .sectionIntro {
          max-width: 840px;
          margin-bottom: 34px;
        }

        .sectionIntro > p:not(.eyebrow) {
          margin: 0;
        }

        .standardGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .standardGrid article {
          min-height: 340px;
          display: flex;
          flex-direction: column;
          padding: 30px;
          border-radius: 22px;
          border: 1px solid rgba(130, 154, 188, 0.17);
          background:
            radial-gradient(circle at 18% 0%, rgba(85, 137, 255, 0.1), transparent 40%),
            linear-gradient(180deg, rgba(13, 22, 38, 0.86), rgba(7, 13, 24, 0.94));
          transition:
            transform 220ms ease,
            border-color 220ms ease;
        }

        .standardGrid article:hover {
          transform: translateY(-5px);
          border-color: rgba(111, 157, 255, 0.55);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          gap: 18px;
        }

        .number {
          color: #61dccb;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .status {
          color: #8eaee8;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .subtitle {
          margin: 26px 0 0;
          color: #74dfd0;
          font-size: 11px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .standardGrid h3 {
          margin: 8px 0 12px;
          font-size: 31px;
          letter-spacing: -0.03em;
        }

        .standardGrid article > p:not(.subtitle) {
          color: #9eafc2;
          line-height: 1.65;
        }

        .standardGrid a {
          margin-top: auto;
          display: inline-flex;
          gap: 20px;
          color: #7de5d7;
          text-decoration: none;
          font-weight: 850;
        }

        .preservation {
          padding: 48px;
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 42px;
        }

        .fieldGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .fieldGrid span {
          min-height: 52px;
          display: flex;
          align-items: center;
          padding: 12px 14px;
          border-radius: 13px;
          border: 1px solid rgba(113, 224, 210, 0.15);
          background: rgba(73, 189, 176, 0.05);
          color: #d3f7f1;
          font-size: 12px;
          font-weight: 750;
        }

        .workflowGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .workflowGrid > div {
          min-height: 130px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          border-radius: 18px;
          border: 1px solid rgba(130, 154, 188, 0.16);
          background: rgba(255, 255, 255, 0.025);
        }

        .workflowGrid span {
          color: #61dccb;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .workflowGrid strong {
          font-size: 15px;
          line-height: 1.45;
        }

        .crosswalk {
          grid-template-columns: 1fr auto;
        }

        .crosswalk h2,
        .boundary h2 {
          font-size: clamp(28px, 4vw, 44px);
        }

        .crosswalk p {
          max-width: 850px;
        }

        .boundary {
          margin-top: 24px;
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
          max-width: 790px;
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
          color: #74869a;
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

        @keyframes orbMove {
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

        @media (max-width: 980px) {
          nav {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
          }

          .heroVisual {
            min-height: 460px;
          }

          .preservation,
          .principle,
          .crosswalk,
          .boundary {
            grid-template-columns: 1fr;
          }

          .workflowGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .crosswalk,
          .finalCta {
            align-items: flex-start;
          }

          .finalCta {
            flex-direction: column;
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

          .heroVisual {
            transform: scale(0.78);
            min-height: 380px;
          }

          .principle,
          .preservation,
          .crosswalk,
          .boundary,
          .finalCta {
            padding: 28px 24px;
          }

          .standardGrid,
          .fieldGrid,
          .workflowGrid {
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
