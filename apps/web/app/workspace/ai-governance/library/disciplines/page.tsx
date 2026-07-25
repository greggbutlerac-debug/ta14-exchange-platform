"use client";

import Link from "next/link";

const disciplines = [
  {
    title: "Model Governance",
    description:
      "Govern model selection, development, validation, approval, change, retirement, and the evidence supporting each lifecycle decision.",
    themes: ["Model inventory", "Validation", "Change control", "Retirement"],
  },
  {
    title: "Data Governance",
    description:
      "Govern data origin, authority, quality, consent, lineage, access, retention, transformation, and permitted use.",
    themes: ["Lineage", "Quality", "Access", "Retention"],
  },
  {
    title: "Risk Governance",
    description:
      "Govern risk ownership, classification, treatment, acceptance, escalation, monitoring, and residual exposure.",
    themes: ["Risk ownership", "Treatment", "Acceptance", "Monitoring"],
  },
  {
    title: "Human Oversight",
    description:
      "Define when humans must review, intervene, approve, override, escalate, or stop an AI-supported action.",
    themes: ["Review", "Intervention", "Override", "Escalation"],
  },
  {
    title: "Third-Party Governance",
    description:
      "Govern external models, vendors, data providers, platforms, integrations, dependencies, and inherited risk.",
    themes: ["Vendor review", "Dependencies", "Contracts", "Inherited risk"],
  },
  {
    title: "Runtime Governance",
    description:
      "Govern proposed AI actions at decision time before they are released into the outside world.",
    themes: ["Pre-execution checks", "Decision evidence", "Release control", "Runtime records"],
  },
  {
    title: "Incident Governance",
    description:
      "Govern detection, classification, containment, investigation, reporting, remediation, and lessons learned.",
    themes: ["Detection", "Containment", "Investigation", "Remediation"],
  },
  {
    title: "Records Governance",
    description:
      "Govern the creation, interpretation, preservation, access, challenge, export, and retention of governance records.",
    themes: ["Preservation", "Interpretation", "Challenge", "Retention"],
  },
];

const operatingLayers = [
  "Board and executive oversight",
  "Legal and regulatory governance",
  "Policy and standards governance",
  "Risk and control governance",
  "Technical and model governance",
  "Operational and runtime governance",
  "Assurance and independent review",
  "Records, evidence, and outcome governance",
];

export default function GovernanceDisciplinesPage() {
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
            <strong>Governance Disciplines</strong>
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
          <p className="eyebrow">GOVERNANCE DISCIPLINES</p>
          <h1>AI governance is not one function. It is a coordinated system.</h1>
          <p className="lead">
            Effective governance requires distinct disciplines to operate
            together without collapsing their boundaries. The TA-14 Governance
            Library separates model, data, risk, human oversight, third-party,
            runtime, incident, and records governance while showing how they
            connect through admissible execution routes.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="#disciplines">
              Explore Governance Disciplines
              <span>→</span>
            </Link>
            <Link className="secondaryButton" href="/workspace/routes/new">
              Build a Governance Route
            </Link>
          </div>
        </div>

        <div className="heroVisual" aria-hidden="true">
          <div className="node nodeOne">DATA</div>
          <div className="node nodeTwo">RISK</div>
          <div className="node nodeThree">MODEL</div>
          <div className="node nodeFour">RUNTIME</div>
          <div className="node nodeFive">RECORDS</div>
          <div className="core">
            <strong>GD</strong>
            <small>Coordinated Governance</small>
          </div>
        </div>
      </section>

      <section className="definition shell">
        <div>
          <p className="eyebrow">WHY DISCIPLINES MATTER</p>
          <h2>Different governance functions answer different questions.</h2>
        </div>
        <p>
          Model governance does not replace data governance. Risk governance
          does not replace runtime control. Human oversight does not replace
          evidence. Records governance does not replace admissibility. Each
          discipline must preserve its own authority, decisions, controls, and
          non-claims while contributing to a unified execution route.
        </p>
      </section>

      <section className="disciplines shell" id="disciplines">
        <div className="sectionIntro">
          <p className="eyebrow">DISCIPLINE CATALOG</p>
          <h2>Build the complete governance operating model.</h2>
          <p>
            Each discipline can become its own review lane, evidence package,
            route template, control set, and verification record inside the
            Exchange.
          </p>
        </div>

        <div className="disciplineGrid">
          {disciplines.map((item, index) => (
            <article key={item.title}>
              <div className="cardTop">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>Governance discipline</small>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="tags">
                {item.themes.map((theme) => (
                  <span key={theme}>{theme}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="layers shell">
        <div className="layersCopy">
          <p className="eyebrow">OPERATING LAYERS</p>
          <h2>Coordinate governance from oversight to outcome.</h2>
          <p>
            A mature governance system connects executive authority, legal
            obligations, policies, risk, technical controls, runtime decisions,
            independent assurance, and preserved records.
          </p>
        </div>

        <div className="layerGrid">
          {operatingLayers.map((layer, index) => (
            <div key={layer}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{layer}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="route shell">
        <div>
          <p className="eyebrow">DISCIPLINE-TO-ROUTE TRANSLATION</p>
          <h2>Turn organizational responsibility into reviewable execution.</h2>
          <p>
            TA-14 connects every governance discipline to evidence, authority,
            decisions, bindings, commitments, execution conditions, and
            preserved outcomes.
          </p>
        </div>

        <div className="routeChain">
          {[
            "Discipline",
            "Owner",
            "Requirement",
            "Evidence",
            "Decision",
            "Binding",
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
          Build the Discipline Route
          <span>→</span>
        </Link>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>Governance coordination is not governance compression.</h2>
        </div>
        <p>
          A unified program should connect disciplines without erasing their
          differences. TA-14 preserves who decided what, under which authority,
          using which evidence, with what execution effect, and what outcome was
          actually produced.
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
            radial-gradient(circle at 12% 8%, rgba(144, 113, 255, 0.14), transparent 28%),
            radial-gradient(circle at 88% 22%, rgba(66, 207, 190, 0.12), transparent 27%),
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
            radial-gradient(circle, rgba(144,113,255,.56) 0 1px, transparent 1.4px);
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
          background: #9071ff;
        }

        .orbTwo {
          right: -180px;
          top: 44%;
          background: #42cfbe;
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
          color: #0b0618;
          background: linear-gradient(135deg, #9071ff, #d9ceff);
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
          color: #a68dff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        h1 {
          max-width: 930px;
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
          color: #0b0618;
          background: linear-gradient(135deg, #9071ff, #d9ceff);
          box-shadow: 0 14px 38px rgba(144, 113, 255, 0.18);
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
          border: 1px solid rgba(166, 141, 255, 0.6);
          background:
            radial-gradient(circle, rgba(144, 113, 255, 0.19), rgba(5, 15, 25, 0.93) 62%);
          box-shadow:
            0 0 50px rgba(144, 113, 255, 0.22),
            inset 0 0 34px rgba(66, 207, 190, 0.08);
        }

        .core strong {
          font-size: 52px;
          letter-spacing: -0.04em;
        }

        .core small {
          max-width: 130px;
          margin-top: 6px;
          color: #c8b9ff;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          text-align: center;
        }

        .node {
          position: absolute;
          min-width: 78px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: 1px solid rgba(166, 141, 255, 0.3);
          background: rgba(11, 16, 30, 0.94);
          color: #d9ceff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          box-shadow: 0 0 20px rgba(144, 113, 255, 0.1);
          animation: float 5s ease-in-out infinite;
        }

        .nodeOne { transform: translate(-150px, -130px); }
        .nodeTwo { transform: translate(145px, -110px); animation-delay: -1s; }
        .nodeThree { transform: translate(-185px, 65px); animation-delay: -2s; }
        .nodeFour { transform: translate(175px, 85px); animation-delay: -3s; }
        .nodeFive { transform: translate(5px, 185px); animation-delay: -4s; }

        .definition,
        .layers,
        .route,
        .boundary {
          border: 1px solid rgba(131, 155, 189, 0.16);
          background:
            linear-gradient(180deg, rgba(12, 21, 36, 0.9), rgba(7, 13, 24, 0.94));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.22);
        }

        .definition,
        .boundary {
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .definition h2,
        .sectionIntro h2,
        .layers h2,
        .route h2,
        .boundary h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .definition > p,
        .sectionIntro > p:not(.eyebrow),
        .layers p,
        .route p,
        .boundary > p {
          color: #9fafc2;
          line-height: 1.68;
          margin-top: 0;
        }

        .disciplines {
          padding: 90px 0;
        }

        .sectionIntro {
          max-width: 830px;
          margin-bottom: 34px;
        }

        .disciplineGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .disciplineGrid article {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          padding: 30px;
          border-radius: 22px;
          border: 1px solid rgba(144, 113, 255, 0.2);
          background:
            radial-gradient(circle at 10% 0%, rgba(144, 113, 255, 0.09), transparent 34%),
            linear-gradient(180deg, rgba(13, 22, 38, 0.86), rgba(7, 13, 24, 0.94));
          transition:
            transform 220ms ease,
            border-color 220ms ease;
        }

        .disciplineGrid article:hover {
          transform: translateY(-5px);
          border-color: rgba(166, 141, 255, 0.55);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: center;
        }

        .cardTop span {
          color: #a68dff;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .cardTop small {
          color: #8596aa;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .disciplineGrid h3 {
          margin: 24px 0 10px;
          font-size: 28px;
          letter-spacing: -0.03em;
        }

        .disciplineGrid p {
          color: #9eafc2;
          line-height: 1.65;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
        }

        .tags span {
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid rgba(166, 141, 255, 0.18);
          background: rgba(144, 113, 255, 0.06);
          color: #e7e0ff;
          font-size: 10px;
          font-weight: 800;
        }

        .layers,
        .route {
          padding: 46px;
          margin-top: 24px;
        }

        .layersCopy,
        .route > div:first-child {
          max-width: 850px;
        }

        .layerGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 28px;
        }

        .layerGrid div {
          min-height: 64px;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(166, 141, 255, 0.15);
          background: rgba(144, 113, 255, 0.035);
        }

        .layerGrid span {
          color: #a68dff;
          font-size: 10px;
          font-weight: 900;
        }

        .layerGrid strong {
          font-size: 13px;
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
          border: 1px solid rgba(166, 141, 255, 0.2);
          background: rgba(144, 113, 255, 0.06);
          color: #ebe6ff;
          font-size: 13px;
          font-weight: 800;
        }

        .routeChain b {
          color: #a68dff;
        }

        .boundary {
          margin-top: 24px;
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
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(90px, 140px, 0); }
        }

        @keyframes orbMove {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(55px, 35px, 0) scale(1.1); }
        }

        @keyframes float {
          0%, 100% { margin-top: 0; }
          50% { margin-top: -12px; }
        }

        @media (max-width: 920px) {
          nav { display: none; }

          .hero { grid-template-columns: 1fr; }

          .heroVisual { min-height: 460px; }

          .definition,
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
          .layers,
          .route,
          .boundary {
            padding: 28px 24px;
          }

          .disciplineGrid,
          .layerGrid {
            grid-template-columns: 1fr;
          }

          .routeChain b { display: none; }

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
