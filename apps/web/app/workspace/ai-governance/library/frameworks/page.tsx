"use client";

import Link from "next/link";

const frameworks = [
  {
    title: "NIST AI Risk Management Framework",
    acronym: "NIST AI RMF",
    issuer: "National Institute of Standards and Technology",
    force: "Voluntary framework",
    description:
      "A structured approach for identifying, measuring, managing, and governing risks associated with artificial intelligence systems.",
    functions: ["Govern", "Map", "Measure", "Manage"],
    href: "/workspace/ai-governance/library/frameworks/nist-ai-rmf",
    status: "Foundation module",
  },
  {
    title: "AI Verify",
    acronym: "AI Verify",
    issuer: "Infocomm Media Development Authority of Singapore",
    force: "Testing and governance framework",
    description:
      "A testing-oriented governance framework that connects responsible AI principles with technical tests, process checks, and evidence.",
    functions: ["Testing", "Process review", "Evidence", "Reporting"],
    href: "/workspace/ai-governance/library/frameworks/ai-verify",
    status: "Foundation module",
  },
  {
    title: "Responsible AI Frameworks",
    acronym: "RAI",
    issuer: "Multiple organizations",
    force: "Organization-defined frameworks",
    description:
      "A family of governance approaches that organize principles, policies, controls, reviews, and accountability around responsible AI development and use.",
    functions: ["Accountability", "Fairness", "Transparency", "Safety"],
    href: "/workspace/ai-governance/library/frameworks/responsible-ai",
    status: "Catalog module",
  },
  {
    title: "Enterprise AI Risk Frameworks",
    acronym: "AI Risk",
    issuer: "Organizations and assurance bodies",
    force: "Internal or advisory framework",
    description:
      "Enterprise structures that connect AI inventories, ownership, risk classification, controls, monitoring, incidents, and executive oversight.",
    functions: ["Inventory", "Risk tiers", "Controls", "Monitoring"],
    href: "/workspace/ai-governance/library/frameworks/enterprise-risk",
    status: "Catalog module",
  },
];

const comparisonFields = [
  "Issuing authority",
  "Purpose and intended users",
  "Legal or organizational force",
  "Lifecycle coverage",
  "Risk and control structure",
  "Evidence expectations",
  "Testing and assurance",
  "Human oversight",
  "Incident and change governance",
  "TA-14 route mapping",
];

export default function FrameworksLibraryPage() {
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
            <strong>Governance Frameworks</strong>
            <small>AI Governance Library</small>
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
          <p className="eyebrow">FRAMEWORKS</p>
          <h1>Understand the structure before adopting the language.</h1>
          <p className="lead">
            Frameworks organize governance activity, but they do not all carry
            the same authority, scope, evidence expectations, or operational
            depth. This library preserves those differences and shows how each
            framework can be translated into reviewable TA-14 governance routes.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="#frameworks">
              Explore Frameworks
              <span>→</span>
            </Link>
            <Link
              className="secondaryButton"
              href="/workspace/ai-governance/library/compare"
            >
              Compare Frameworks
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
            <strong>FW</strong>
            <small>Governance Structure</small>
          </div>
        </div>
      </section>

      <section className="definition shell">
        <div>
          <p className="eyebrow">WHAT A FRAMEWORK IS</p>
          <h2>A framework organizes governance work.</h2>
        </div>
        <p>
          A framework can define functions, domains, practices, outcomes,
          questions, controls, tests, or review steps. It may guide an
          organization without creating legal duties by itself. The library
          keeps frameworks distinct from laws, regulations, standards,
          principles, certifications, and independent assurance.
        </p>
      </section>

      <section className="frameworkSection shell" id="frameworks">
        <div className="sectionIntro">
          <p className="eyebrow">FRAMEWORK CATALOG</p>
          <h2>Start with the frameworks most organizations encounter.</h2>
          <p>
            Each module preserves source identity, intended use, authority,
            scope, lifecycle coverage, evidence expectations, relationships,
            known limitations, and TA-14 implementation pathways.
          </p>
        </div>

        <div className="frameworkGrid">
          {frameworks.map((framework, index) => (
            <article key={framework.title}>
              <div className="cardTop">
                <span className="number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="status">{framework.status}</span>
              </div>

              <p className="acronym">{framework.acronym}</p>
              <h3>{framework.title}</h3>
              <p className="issuer">{framework.issuer}</p>
              <p className="force">{framework.force}</p>
              <p className="description">{framework.description}</p>

              <div className="tags">
                {framework.functions.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <Link href={framework.href}>
                Open framework module
                <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="comparison shell">
        <div className="comparisonCopy">
          <p className="eyebrow">COMPARISON ENGINE</p>
          <h2>Compare substance, not just terminology.</h2>
          <p>
            Two frameworks may use similar words while governing different
            risks, actors, evidence, or lifecycle stages. Comparison should
            expose both overlap and boundary rather than flattening distinct
            systems into a false equivalence.
          </p>

          <Link
            className="secondaryButton"
            href="/workspace/ai-governance/library/compare"
          >
            Open Framework Comparison
          </Link>
        </div>

        <div className="fieldList">
          {comparisonFields.map((field, index) => (
            <div key={field}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{field}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="routeSection shell">
        <div>
          <p className="eyebrow">FROM FRAMEWORK TO ROUTE</p>
          <h2>Translate governance structure into execution conditions.</h2>
          <p>
            A framework becomes operational only when its expectations are
            connected to identity, evidence, authority, continuity, decision
            logic, bindings, commitments, execution boundaries, and outcome
            records.
          </p>
        </div>

        <div className="routeChain">
          {[
            "Framework",
            "Requirement",
            "Evidence",
            "Decision",
            "Binding",
            "Commit",
            "Execution",
            "Outcome",
          ].map((item, index, items) => (
            <div key={item}>
              <span>{item}</span>
              {index < items.length - 1 && <b>→</b>}
            </div>
          ))}
        </div>

        <Link className="primaryButton" href="/workspace/routes/new">
          Build From a Framework
          <span>→</span>
        </Link>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>Using a framework is not the same as proving governance.</h2>
        </div>
        <p>
          A framework can organize work, but it does not automatically prove
          that requirements were met, evidence was admissible, authority was
          valid, controls operated as intended, or outcomes corresponded to the
          committed route. TA-14 preserves those questions separately.
        </p>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/workspace/ai-governance/library">
          Return to Governance Library
        </Link>
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
            radial-gradient(circle at 88% 22%, rgba(87, 83, 190, 0.15), transparent 27%),
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
            radial-gradient(circle, rgba(144,113,255,.62) 0 1px, transparent 1.4px);
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
          background: #765eff;
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
          grid-template-columns: 1.2fr 0.8fr;
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
          border: 1px solid rgba(151, 119, 255, 0.62);
          background:
            radial-gradient(circle, rgba(130, 94, 255, 0.2), rgba(5, 15, 25, 0.93) 62%);
          box-shadow:
            0 0 50px rgba(125, 92, 255, 0.24),
            inset 0 0 34px rgba(84, 218, 200, 0.08);
        }

        .core strong {
          font-size: 52px;
          letter-spacing: -0.04em;
        }

        .core small {
          margin-top: 6px;
          color: #c3b1ff;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          text-align: center;
        }

        .orbit {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(150, 119, 255, 0.23);
          animation: rotate 18s linear infinite;
        }

        .orbit span {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #9b7cff;
          box-shadow: 0 0 14px #9b7cff;
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
          background: #72e3d4;
          box-shadow: 0 0 14px #72e3d4;
        }

        .orbitThree {
          width: 420px;
          height: 420px;
          animation-duration: 34s;
        }

        .definition,
        .comparison,
        .routeSection,
        .boundary {
          border: 1px solid rgba(131, 155, 189, 0.16);
          background:
            linear-gradient(180deg, rgba(12, 21, 36, 0.9), rgba(7, 13, 24, 0.94));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.22);
        }

        .definition {
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .definition h2,
        .sectionIntro h2,
        .comparison h2,
        .routeSection h2,
        .boundary h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .definition > p,
        .sectionIntro > p:not(.eyebrow),
        .comparison p,
        .routeSection p,
        .boundary > p {
          color: #9fafc2;
          line-height: 1.68;
        }

        .definition > p,
        .sectionIntro > p:not(.eyebrow),
        .comparison p,
        .routeSection p,
        .boundary > p {
          margin-top: 0;
        }

        .frameworkSection {
          padding: 90px 0;
        }

        .sectionIntro {
          max-width: 830px;
          margin-bottom: 34px;
        }

        .frameworkGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .frameworkGrid article {
          min-height: 390px;
          display: flex;
          flex-direction: column;
          padding: 30px;
          border-radius: 22px;
          border: 1px solid rgba(142, 123, 217, 0.2);
          background:
            radial-gradient(circle at 10% 0%, rgba(123, 94, 238, 0.1), transparent 34%),
            linear-gradient(180deg, rgba(13, 22, 38, 0.86), rgba(7, 13, 24, 0.94));
          transition:
            transform 220ms ease,
            border-color 220ms ease;
        }

        .frameworkGrid article:hover {
          transform: translateY(-5px);
          border-color: rgba(161, 128, 255, 0.55);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: center;
        }

        .number {
          color: #9c82ff;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .status {
          color: #8596aa;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .acronym {
          margin: 24px 0 4px;
          color: #75dfd0;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .frameworkGrid h3 {
          margin: 8px 0 10px;
          font-size: 28px;
          letter-spacing: -0.03em;
        }

        .issuer {
          margin: 0;
          color: #b6c3d1;
          font-size: 13px;
          font-weight: 750;
        }

        .force {
          margin: 7px 0 0;
          color: #a38aff;
          font-size: 12px;
          font-weight: 850;
        }

        .description {
          color: #9eafc2;
          line-height: 1.65;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 10px 0 24px;
        }

        .tags span {
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid rgba(156, 130, 255, 0.18);
          background: rgba(122, 91, 220, 0.07);
          color: #dfd6ff;
          font-size: 10px;
          font-weight: 800;
        }

        .frameworkGrid a {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 20px;
          color: #a68dff;
          text-decoration: none;
          font-weight: 850;
        }

        .comparison {
          padding: 46px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 42px;
          align-items: start;
        }

        .comparisonCopy .secondaryButton {
          margin-top: 8px;
        }

        .fieldList {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .fieldList div {
          min-height: 58px;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(131, 155, 189, 0.15);
          background: rgba(255, 255, 255, 0.025);
        }

        .fieldList span {
          color: #9c82ff;
          font-size: 10px;
          font-weight: 900;
        }

        .fieldList strong {
          font-size: 13px;
        }

        .routeSection {
          margin-top: 24px;
          padding: 46px;
        }

        .routeSection > div:first-child {
          max-width: 830px;
        }

        .routeChain {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin: 28px 0;
        }

        .routeChain > div {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .routeChain span {
          padding: 10px 15px;
          border-radius: 999px;
          border: 1px solid rgba(105, 224, 208, 0.2);
          background: rgba(72, 195, 179, 0.07);
          color: #ddfff9;
          font-size: 13px;
          font-weight: 800;
        }

        .routeChain b {
          color: #5bd9c8;
        }

        .boundary {
          margin-top: 24px;
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .boundary h2 {
          font-size: clamp(28px, 4vw, 44px);
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

        @media (max-width: 920px) {
          nav {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
          }

          .heroVisual {
            min-height: 460px;
          }

          .definition,
          .comparison,
          .boundary {
            grid-template-columns: 1fr;
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

          .definition,
          .comparison,
          .routeSection,
          .boundary {
            padding: 28px 24px;
          }

          .frameworkGrid,
          .fieldList {
            grid-template-columns: 1fr;
          }

          .routeChain b {
            display: none;
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
