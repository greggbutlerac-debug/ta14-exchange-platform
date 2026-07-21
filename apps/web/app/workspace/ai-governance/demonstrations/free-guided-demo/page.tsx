import Link from "next/link";

export const metadata = {
  title: "AI Governance Demonstrations | TA-14 AI Governance Exchange",
  description:
    "Explore TA-14 AI governance demonstrations showing how consequential routes are recorded, evaluated, held, corrected, preserved, and replayed.",
};

const demonstrations = [
  {
    status: "LIVE",
    decision: "HOLD",
    title: "Free Guided Vendor Payment Demo",
    summary:
      "Walk through a $27,500 vendor-payment route and see how missing authority and unverified beneficiary evidence stop execution before commit.",
    lessons: [
      "Reality is recorded without assumption",
      "Authority must be proven",
      "Missing evidence produces HOLD",
      "Correction does not erase the original state",
    ],
    href: "/workspace/ai-governance/demonstrations/free-guided-demo",
    cta: "Run Guided Demo",
    featured: true,
  },
  {
    status: "AVAILABLE",
    decision: "ALLOW",
    title: "Admissible Route Demonstration",
    summary:
      "Review a route that satisfies its declared evidence, authority, continuity, binding, commit, execution, and outcome requirements.",
    lessons: [
      "Evidence is sufficient",
      "Authority remains current",
      "Binding is established",
      "Execution may proceed",
    ],
    href: "/workspace/ai-governance",
    cta: "Open Playground",
    featured: false,
  },
  {
    status: "AVAILABLE",
    decision: "DENY",
    title: "Inadmissible Request Demonstration",
    summary:
      "See how a malformed or unauthorized request is refused before it can bind to a protected consequence.",
    lessons: [
      "The object lacks standing",
      "Bind is refused",
      "No downstream command is emitted",
      "The refusal remains reviewable",
    ],
    href: "/workspace/ai-governance",
    cta: "Test a Denied Route",
    featured: false,
  },
  {
    status: "AVAILABLE",
    decision: "ESCALATE",
    title: "Human Authority Escalation",
    summary:
      "Explore a route that cannot be safely resolved automatically and must be transferred to a declared human authority.",
    lessons: [
      "Automation boundary is declared",
      "Authority transfer is preserved",
      "Execution remains blocked",
      "Escalation does not imply approval",
    ],
    href: "/workspace/ai-governance",
    cta: "Test Escalation",
    featured: false,
  },
];

export default function AIGovernanceDemonstrationsPage() {
  return (
    <>
      <style>{`
        :root {
          --demo-bg: #030712;
          --demo-panel: rgba(8, 17, 31, 0.84);
          --demo-border: rgba(255, 255, 255, 0.1);
          --demo-text: #f8fbff;
          --demo-muted: #9fb0c4;
          --demo-cyan: #58e6ff;
          --demo-violet: #b7a2ff;
          --demo-amber: #ffd66b;
          --demo-green: #75efb0;
          --demo-red: #ff9191;
        }

        .demo-page {
          min-height: 100vh;
          color: var(--demo-text);
          background:
            radial-gradient(circle at 12% 10%, rgba(88, 230, 255, 0.14), transparent 28%),
            radial-gradient(circle at 88% 18%, rgba(183, 162, 255, 0.14), transparent 30%),
            linear-gradient(180deg, #020611 0%, #07121f 52%, #02060d 100%);
        }

        .demo-page *,
        .demo-page *::before,
        .demo-page *::after {
          box-sizing: border-box;
        }

        .demo-grid-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.1;
          background-image:
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: radial-gradient(circle at center, black, transparent 82%);
        }

        .demo-shell {
          position: relative;
          z-index: 1;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding: 28px 0 76px;
        }

        .demo-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 30px;
        }

        .demo-brand,
        .demo-return {
          color: white;
          text-decoration: none;
        }

        .demo-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 900;
        }

        .demo-mark {
          display: grid;
          width: 46px;
          height: 46px;
          place-items: center;
          border: 1px solid rgba(88,230,255,0.25);
          border-radius: 14px;
          color: #c7f8ff;
          background: rgba(88,230,255,0.08);
          font-size: 11px;
          letter-spacing: 0.08em;
        }

        .demo-return {
          color: #c2cfdb;
          font-size: 14px;
          font-weight: 800;
        }

        .demo-hero {
          padding: 54px;
          border: 1px solid var(--demo-border);
          border-radius: 34px;
          background: rgba(4, 11, 22, 0.72);
          backdrop-filter: blur(22px);
          box-shadow: 0 30px 100px rgba(0,0,0,0.36);
        }

        .demo-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 13px;
          border: 1px solid rgba(88,230,255,0.22);
          border-radius: 999px;
          color: #c7f8ff;
          background: rgba(88,230,255,0.06);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .demo-kicker::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--demo-cyan);
          box-shadow: 0 0 14px rgba(88,230,255,0.85);
        }

        .demo-title {
          max-width: 920px;
          margin: 22px 0 18px;
          font-size: clamp(48px, 7vw, 82px);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .demo-title span {
          display: block;
          color: transparent;
          background: linear-gradient(90deg, #a9f5ff, #ffffff 48%, #d3c7ff);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .demo-lead {
          max-width: 880px;
          margin: 0;
          color: #b5c4d3;
          font-size: 18px;
          line-height: 1.72;
        }

        .demo-chain {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 34px;
        }

        .demo-chain-item {
          padding: 16px;
          border: 1px solid var(--demo-border);
          border-radius: 17px;
          background: rgba(255,255,255,0.035);
        }

        .demo-chain-item strong {
          display: block;
          color: white;
          font-size: 14px;
        }

        .demo-chain-item span {
          display: block;
          margin-top: 6px;
          color: var(--demo-muted);
          font-size: 12px;
          line-height: 1.5;
        }

        .demo-section {
          margin-top: 34px;
        }

        .demo-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 18px;
        }

        .demo-eyebrow {
          color: var(--demo-cyan);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .demo-section h2 {
          margin: 10px 0 0;
          font-size: clamp(30px, 4vw, 48px);
          letter-spacing: -0.04em;
        }

        .demo-section-head p {
          max-width: 520px;
          margin: 0;
          color: var(--demo-muted);
          line-height: 1.65;
        }

        .demo-card-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .demo-card {
          display: flex;
          flex-direction: column;
          min-height: 430px;
          padding: 26px;
          border: 1px solid var(--demo-border);
          border-radius: 24px;
          background: var(--demo-panel);
          backdrop-filter: blur(20px);
        }

        .demo-card.featured {
          grid-column: 1 / -1;
          min-height: 360px;
          background:
            linear-gradient(135deg, rgba(88,230,255,0.08), rgba(183,162,255,0.055)),
            var(--demo-panel);
        }

        .demo-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .demo-status,
        .demo-decision {
          display: inline-flex;
          align-items: center;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.11em;
        }

        .demo-status {
          color: #c7f8ff;
          border: 1px solid rgba(88,230,255,0.2);
          background: rgba(88,230,255,0.07);
        }

        .demo-decision {
          border: 1px solid var(--demo-border);
        }

        .demo-decision.allow {
          color: #c9f7dd;
          background: rgba(117,239,176,0.07);
        }

        .demo-decision.hold {
          color: #ffe8a6;
          background: rgba(255,214,107,0.07);
        }

        .demo-decision.deny {
          color: #ffc4c4;
          background: rgba(255,145,145,0.07);
        }

        .demo-decision.escalate {
          color: #ddd3ff;
          background: rgba(183,162,255,0.07);
        }

        .demo-card h3 {
          margin: 24px 0 12px;
          font-size: clamp(26px, 3vw, 38px);
          line-height: 1.08;
          letter-spacing: -0.04em;
        }

        .demo-summary {
          margin: 0;
          color: #aebdcc;
          line-height: 1.72;
        }

        .demo-lessons-title {
          margin-top: 24px;
          color: var(--demo-cyan);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .demo-lessons {
          flex: 1;
          margin: 14px 0 24px;
          padding-left: 20px;
          color: #d8e4ee;
        }

        .demo-lessons li {
          margin-bottom: 9px;
          line-height: 1.5;
        }

        .demo-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
        }

        .demo-primary,
        .demo-secondary {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border-radius: 13px;
          text-decoration: none;
          font-weight: 900;
        }

        .demo-primary {
          color: #03100c;
          background: linear-gradient(90deg, var(--demo-cyan), #93f1ff);
        }

        .demo-secondary {
          color: white;
          border: 1px solid var(--demo-border);
          background: rgba(255,255,255,0.045);
        }

        .demo-principle {
          margin-top: 34px;
          padding: 34px;
          border: 1px solid rgba(88,230,255,0.16);
          border-radius: 26px;
          background:
            linear-gradient(135deg, rgba(88,230,255,0.06), rgba(183,162,255,0.04));
        }

        .demo-principle h2 {
          margin: 10px 0 14px;
          font-size: clamp(30px, 4vw, 46px);
          letter-spacing: -0.04em;
        }

        .demo-principle p {
          max-width: 900px;
          margin: 0;
          color: #b5c4d3;
          line-height: 1.75;
        }

        @media (max-width: 900px) {
          .demo-card-grid,
          .demo-chain {
            grid-template-columns: 1fr;
          }

          .demo-card.featured {
            grid-column: auto;
          }

          .demo-section-head {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 660px) {
          .demo-shell {
            width: min(100% - 24px, 1180px);
            padding-top: 16px;
          }

          .demo-topbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .demo-hero,
          .demo-card,
          .demo-principle {
            padding: 24px;
            border-radius: 23px;
          }

          .demo-title {
            font-size: 46px;
          }

          .demo-primary,
          .demo-secondary {
            width: 100%;
          }
        }
      `}</style>

      <div className="demo-page">
        <div className="demo-grid-bg" aria-hidden="true" />

        <main className="demo-shell">
          <header className="demo-topbar">
            <Link className="demo-brand" href="/workspace/ai-governance">
              <span className="demo-mark">TA-14</span>
              <span>AI Governance Exchange</span>
            </Link>

            <Link className="demo-return" href="/workspace/ai-governance">
              Return to AI Governance Playground
            </Link>
          </header>

          <section className="demo-hero">
            <div className="demo-kicker">AI Governance Demonstrations</div>

            <h1 className="demo-title">
              See what happens
              <span>before consequential execution.</span>
            </h1>

            <p className="demo-lead">
              These demonstrations show how TA-14 records reality, preserves
              evidence boundaries, evaluates authority and continuity, and
              prevents an inadmissible route from forming a protected
              consequence.
            </p>

            <div className="demo-chain">
              <div className="demo-chain-item">
                <strong>ALLOW</strong>
                <span>Declared conditions are satisfied.</span>
              </div>
              <div className="demo-chain-item">
                <strong>HOLD</strong>
                <span>Correction or additional evidence is required.</span>
              </div>
              <div className="demo-chain-item">
                <strong>DENY</strong>
                <span>The request lacks standing or violates its boundary.</span>
              </div>
              <div className="demo-chain-item">
                <strong>ESCALATE</strong>
                <span>A declared human authority must decide.</span>
              </div>
            </div>
          </section>

          <section className="demo-section">
            <div className="demo-section-head">
              <div>
                <div className="demo-eyebrow">Current demonstration library</div>
                <h2>Choose a route and inspect the decision.</h2>
              </div>

              <p>
                Start with the guided demonstration, then use the playground to
                construct, break, correct, and replay your own AI governance
                routes.
              </p>
            </div>

            <div className="demo-card-grid">
              {demonstrations.map((demo) => (
                <article
                  className={`demo-card ${demo.featured ? "featured" : ""}`}
                  key={demo.title}
                >
                  <div className="demo-card-top">
                    <span className="demo-status">{demo.status}</span>
                    <span
                      className={`demo-decision ${demo.decision.toLowerCase()}`}
                    >
                      {demo.decision}
                    </span>
                  </div>

                  <h3>{demo.title}</h3>
                  <p className="demo-summary">{demo.summary}</p>

                  <div className="demo-lessons-title">What this route shows</div>
                  <ul className="demo-lessons">
                    {demo.lessons.map((lesson) => (
                      <li key={lesson}>{lesson}</li>
                    ))}
                  </ul>

                  <div className="demo-actions">
                    <Link className="demo-primary" href={demo.href}>
                      {demo.cta}
                    </Link>

                    {demo.featured ? (
                      <Link
                        className="demo-secondary"
                        href="/workspace/ai-governance/pricing"
                      >
                        View Governance Services
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="demo-principle">
            <div className="demo-eyebrow">Governing principle</div>
            <h2>No admissible evidence. No admissible execution.</h2>
            <p>
              A demonstration is not merely a result screen. It must reveal the
              route, evidence boundary, authority condition, decision basis,
              correction requirement, and preserved outcome so another reviewer
              can understand what happened without reconstructing the event from
              memory.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
