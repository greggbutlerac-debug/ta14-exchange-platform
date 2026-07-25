"use client";

import Link from "next/link";

const assuranceMethods = [
  {
    title: "Technical Testing",
    description:
      "Evaluate model and system behavior through repeatable tests, benchmarks, adversarial exercises, scenario analysis, and threshold-based review.",
    examples: ["Performance tests", "Robustness tests", "Bias testing", "Red teaming"],
    href: "/workspace/ai-governance/library/testing/technical",
  },
  {
    title: "Process Assurance",
    description:
      "Review whether governance procedures, approvals, ownership, controls, escalation paths, and documentation were actually followed.",
    examples: ["Control review", "Approval trace", "Role verification", "Change review"],
    href: "/workspace/ai-governance/library/testing/process",
  },
  {
    title: "Evidence Assurance",
    description:
      "Examine whether claims are supported by attributable, current, bounded, reviewable, and independently interpretable evidence.",
    examples: ["Source review", "Evidence lineage", "Record integrity", "Claim boundaries"],
    href: "/workspace/ai-governance/library/testing/evidence",
  },
  {
    title: "Operational Assurance",
    description:
      "Determine whether controls remain effective during deployment, runtime, change, incident response, and post-execution review.",
    examples: ["Runtime monitoring", "Drift review", "Incident testing", "Outcome verification"],
    href: "/workspace/ai-governance/library/testing/operational",
  },
];

const lifecycle = [
  "Define the claim",
  "Identify the governing source",
  "Specify the test or review method",
  "Establish the evidence boundary",
  "Run the test",
  "Preserve the result",
  "Interpret against the threshold",
  "Bind the decision",
  "Verify execution and outcome",
];

const distinctions = [
  {
    label: "Testing",
    text: "Produces observations or measurements under defined conditions.",
  },
  {
    label: "Assessment",
    text: "Evaluates evidence against stated criteria, requirements, or expectations.",
  },
  {
    label: "Audit",
    text: "Independently examines whether defined controls, records, or processes conform to an established basis.",
  },
  {
    label: "Certification",
    text: "Provides a formal attestation under a specific scheme and within a stated scope.",
  },
  {
    label: "Validation",
    text: "Evaluates whether a system or method is suitable for its intended use.",
  },
  {
    label: "Verification",
    text: "Determines whether specified requirements, conditions, or commitments were satisfied.",
  },
];

export default function TestingAssurancePage() {
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
            <strong>Testing & Assurance</strong>
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
          <p className="eyebrow">TESTING & ASSURANCE</p>
          <h1>Test the claim. Preserve the evidence. Verify the outcome.</h1>
          <p className="lead">
            AI governance testing is not one activity. Technical tests, process
            reviews, audits, assessments, validation, verification, and
            certification each answer different questions. This library keeps
            those functions separate and connects them to admissible evidence,
            bounded decisions, controlled execution, and preserved outcomes.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="#methods">
              Explore Assurance Methods
              <span>→</span>
            </Link>
            <Link className="secondaryButton" href="/workspace/routes/new">
              Build an Assurance Route
            </Link>
          </div>
        </div>

        <div className="heroVisual" aria-hidden="true">
          <div className="ring ringOne" />
          <div className="ring ringTwo" />
          <div className="beam beamOne" />
          <div className="beam beamTwo" />
          <div className="core">
            <strong>QA</strong>
            <small>Evidence Before Assurance</small>
          </div>
        </div>
      </section>

      <section className="definition shell">
        <div>
          <p className="eyebrow">ASSURANCE PURPOSE</p>
          <h2>Assurance reduces uncertainty about a defined claim.</h2>
        </div>
        <p>
          Assurance should identify what is being claimed, which authority or
          requirement governs that claim, what evidence is acceptable, who may
          evaluate it, which threshold applies, and what the result authorizes
          or prevents. Without those boundaries, an assurance label can create
          confidence without proving control.
        </p>
      </section>

      <section className="methods shell" id="methods">
        <div className="sectionIntro">
          <p className="eyebrow">ASSURANCE METHODS</p>
          <h2>Different methods govern different questions.</h2>
          <p>
            A technically successful model may still fail process, evidence,
            legal, operational, or outcome review. Each assurance method must
            preserve its own scope and non-claims.
          </p>
        </div>

        <div className="methodGrid">
          {assuranceMethods.map((method, index) => (
            <article key={method.title}>
              <div className="cardTop">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>Assurance lane</small>
              </div>
              <h3>{method.title}</h3>
              <p>{method.description}</p>
              <div className="tags">
                {method.examples.map((example) => (
                  <span key={example}>{example}</span>
                ))}
              </div>
              <Link href={method.href}>
                Open assurance module
                <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="distinction shell">
        <div className="sectionIntro">
          <p className="eyebrow">TERMINOLOGY BOUNDARIES</p>
          <h2>Do not collapse every review into the word “audit.”</h2>
          <p>
            Governance becomes clearer when each term is used only for the
            function it actually performs.
          </p>
        </div>

        <div className="distinctionGrid">
          {distinctions.map((item, index) => (
            <article key={item.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.label}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lifecycle shell">
        <div className="lifecycleCopy">
          <p className="eyebrow">ASSURANCE LIFECYCLE</p>
          <h2>Move from claim to verified outcome.</h2>
          <p>
            TA-14 treats assurance as a governed route rather than a detached
            report. The route preserves the basis, method, evidence, threshold,
            decision, execution effect, and outcome.
          </p>
        </div>

        <div className="steps">
          {lifecycle.map((step, index) => (
            <div key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>

        <Link className="primaryButton" href="/workspace/routes/new">
          Build the Assurance Route
          <span>→</span>
        </Link>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>A test result is not automatic permission to execute.</h2>
        </div>
        <p>
          A passing test may support a decision, but it does not by itself prove
          current authority, complete evidence, valid scope, preserved
          continuity, proper binding, safe execution, or acceptable outcome.
          TA-14 keeps assurance evidence separate from execution permission.
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
            radial-gradient(circle at 12% 8%, rgba(60, 185, 255, 0.12), transparent 28%),
            radial-gradient(circle at 88% 22%, rgba(87, 83, 190, 0.14), transparent 27%),
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
            radial-gradient(circle, rgba(85,193,255,.58) 0 1px, transparent 1.4px);
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
          background: #49b9ff;
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
          color: #031018;
          background: linear-gradient(135deg, #55c1ff, #b9ecff);
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
          color: #63c8ff;
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
          color: #031018;
          background: linear-gradient(135deg, #55c1ff, #b9ecff);
          box-shadow: 0 14px 38px rgba(73, 185, 255, 0.18);
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
          border: 1px solid rgba(99, 200, 255, 0.6);
          background:
            radial-gradient(circle, rgba(73, 185, 255, 0.18), rgba(5, 15, 25, 0.93) 62%);
          box-shadow:
            0 0 50px rgba(73, 185, 255, 0.22),
            inset 0 0 34px rgba(118, 94, 255, 0.08);
        }

        .core strong {
          font-size: 52px;
          letter-spacing: -0.04em;
        }

        .core small {
          max-width: 130px;
          margin-top: 6px;
          color: #9cddff;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          text-align: center;
        }

        .ring {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(99, 200, 255, 0.22);
          animation: pulse 4s ease-in-out infinite;
        }

        .ringOne {
          width: 300px;
          height: 300px;
        }

        .ringTwo {
          width: 420px;
          height: 420px;
          animation-delay: -2s;
        }

        .beam {
          position: absolute;
          width: 420px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #63c8ff, transparent);
          opacity: 0.5;
          animation: rotate 14s linear infinite;
        }

        .beamTwo {
          transform: rotate(90deg);
          animation-direction: reverse;
          animation-duration: 20s;
        }

        .definition,
        .lifecycle,
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
        .lifecycle h2,
        .boundary h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .definition > p,
        .sectionIntro > p:not(.eyebrow),
        .lifecycle p,
        .boundary > p {
          color: #9fafc2;
          line-height: 1.68;
        }

        .definition > p,
        .sectionIntro > p:not(.eyebrow),
        .lifecycle p,
        .boundary > p {
          margin-top: 0;
        }

        .methods,
        .distinction {
          padding: 90px 0;
        }

        .sectionIntro {
          max-width: 830px;
          margin-bottom: 34px;
        }

        .methodGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .methodGrid article {
          min-height: 330px;
          display: flex;
          flex-direction: column;
          padding: 30px;
          border-radius: 22px;
          border: 1px solid rgba(86, 174, 225, 0.2);
          background:
            radial-gradient(circle at 10% 0%, rgba(73, 185, 255, 0.09), transparent 34%),
            linear-gradient(180deg, rgba(13, 22, 38, 0.86), rgba(7, 13, 24, 0.94));
          transition:
            transform 220ms ease,
            border-color 220ms ease;
        }

        .methodGrid article:hover {
          transform: translateY(-5px);
          border-color: rgba(99, 200, 255, 0.55);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: center;
        }

        .cardTop span {
          color: #63c8ff;
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

        .methodGrid h3 {
          margin: 24px 0 10px;
          font-size: 28px;
          letter-spacing: -0.03em;
        }

        .methodGrid p {
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
          border: 1px solid rgba(99, 200, 255, 0.18);
          background: rgba(73, 185, 255, 0.06);
          color: #d8f3ff;
          font-size: 10px;
          font-weight: 800;
        }

        .methodGrid a {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 20px;
          color: #63c8ff;
          text-decoration: none;
          font-weight: 850;
        }

        .distinction {
          padding-top: 0;
        }

        .distinctionGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .distinctionGrid article {
          min-height: 210px;
          padding: 26px;
          border-radius: 20px;
          border: 1px solid rgba(131, 155, 189, 0.16);
          background:
            linear-gradient(180deg, rgba(13, 22, 38, 0.84), rgba(7, 13, 24, 0.94));
        }

        .distinctionGrid span {
          color: #63c8ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .distinctionGrid h3 {
          margin: 18px 0 8px;
          font-size: 23px;
        }

        .distinctionGrid p {
          margin: 0;
          color: #a2b2c4;
          line-height: 1.65;
        }

        .lifecycle {
          padding: 46px;
        }

        .lifecycleCopy {
          max-width: 850px;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin: 28px 0;
        }

        .steps div {
          min-height: 64px;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(99, 200, 255, 0.15);
          background: rgba(73, 185, 255, 0.035);
        }

        .steps span {
          color: #63c8ff;
          font-size: 10px;
          font-weight: 900;
        }

        .steps strong {
          font-size: 13px;
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

        @keyframes pulse {
          0%,
          100% {
            transform: scale(0.96);
            opacity: 0.28;
          }
          50% {
            transform: scale(1.04);
            opacity: 0.72;
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
          .boundary {
            grid-template-columns: 1fr;
          }

          .distinctionGrid,
          .steps {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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
          .lifecycle,
          .boundary {
            padding: 28px 24px;
          }

          .methodGrid,
          .distinctionGrid,
          .steps {
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
