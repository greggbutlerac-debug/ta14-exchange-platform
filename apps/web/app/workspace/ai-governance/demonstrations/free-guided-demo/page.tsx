"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Step = {
  label: string;
  title: string;
  explanation: string;
  evidence: string[];
  decision: "RECORD" | "HOLD" | "CORRECT" | "PRESERVE";
};

const steps: Step[] = [
  {
    label: "01 · REALITY",
    title: "A consequential payment is proposed",
    explanation:
      "An AI-enabled workflow requests permission to release $27,500 to a vendor. The request exists, but existence is not authority.",
    evidence: [
      "Declared payment amount: $27,500",
      "Named vendor",
      "Declared business purpose",
      "Initiating user recorded",
    ],
    decision: "RECORD",
  },
  {
    label: "02 · RECORD",
    title: "The available evidence is captured",
    explanation:
      "TA-14 records what is present without turning missing information into an assumption. The route now has a reviewable starting state.",
    evidence: [
      "Payment request preserved",
      "Vendor identity submitted",
      "Supporting purpose recorded",
      "No procurement approval attached",
    ],
    decision: "RECORD",
  },
  {
    label: "03 · CONTINUITY",
    title: "The route tests whether the evidence stays connected",
    explanation:
      "The request, authority, beneficiary, and intended outcome must remain bound to the same route. Here, continuity is incomplete.",
    evidence: [
      "Request continuity present",
      "Finance authority unproven",
      "Procurement authority missing",
      "Beneficiary verification incomplete",
    ],
    decision: "HOLD",
  },
  {
    label: "04 · ADMISSIBILITY",
    title: "The route is classified before execution",
    explanation:
      "A strong model or confident recommendation cannot repair missing authority. The route cannot proceed merely because the action appears reasonable.",
    evidence: [
      "Required authority not established",
      "Beneficiary not sufficiently verified",
      "Evidence boundary declared",
      "Execution prevented before commit",
    ],
    decision: "HOLD",
  },
  {
    label: "05 · CORRECTION",
    title: "The system declares what must change",
    explanation:
      "A governed HOLD is not a dead end. It identifies the exact missing evidence required for reconsideration without erasing the original failure state.",
    evidence: [
      "Attach procurement approval",
      "Prove finance authority",
      "Verify the beneficiary",
      "Preserve all corrections in the same route",
    ],
    decision: "CORRECT",
  },
  {
    label: "06 · OUTCOME",
    title: "The decision and correction path are preserved",
    explanation:
      "The result is a bounded, reviewable governance record showing what was proposed, what was proven, why execution was held, and what happens next.",
    evidence: [
      "Original state retained",
      "Decision basis retained",
      "Correction requirements declared",
      "Outcome state available for replay",
    ],
    decision: "PRESERVE",
  },
];

const decisionClass: Record<Step["decision"], string> = {
  RECORD: "record",
  HOLD: "hold",
  CORRECT: "correct",
  PRESERVE: "preserve",
};

export default function FreeGuidedDemoPage() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const step = steps[active];
  const progress = useMemo(
    () => Math.round(((active + 1) / steps.length) * 100),
    [active],
  );

  function selectStep(index: number) {
    setActive(index);
    setRevealed(false);
  }

  return (
    <>
      <style>{`
        :root {
          --fgd-bg: #030712;
          --fgd-panel: rgba(7, 15, 28, 0.84);
          --fgd-border: rgba(255,255,255,0.10);
          --fgd-text: #f7fbff;
          --fgd-muted: #9fb0c4;
          --fgd-cyan: #54e8ff;
          --fgd-violet: #b59bff;
          --fgd-amber: #ffd66e;
          --fgd-red: #ff9292;
          --fgd-green: #75f0b2;
        }

        .fgd-page {
          min-height: 100vh;
          color: var(--fgd-text);
          background:
            radial-gradient(circle at 12% 12%, rgba(84,232,255,0.15), transparent 28%),
            radial-gradient(circle at 88% 18%, rgba(181,155,255,0.14), transparent 31%),
            radial-gradient(circle at 50% 95%, rgba(255,214,110,0.08), transparent 30%),
            linear-gradient(180deg, #020611 0%, #07111e 52%, #02060d 100%);
        }

        .fgd-page *,
        .fgd-page *::before,
        .fgd-page *::after {
          box-sizing: border-box;
        }

        .fgd-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.12;
          background-image:
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: radial-gradient(circle at center, black, transparent 82%);
        }

        .fgd-shell {
          position: relative;
          z-index: 1;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding: 30px 0 80px;
        }

        .fgd-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 26px;
        }

        .fgd-brand,
        .fgd-back {
          color: white;
          text-decoration: none;
        }

        .fgd-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 900;
        }

        .fgd-mark {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border: 1px solid rgba(84,232,255,0.25);
          border-radius: 14px;
          color: #c9f7ff;
          background: rgba(84,232,255,0.08);
          font-size: 11px;
          letter-spacing: 0.08em;
        }

        .fgd-back {
          color: #c6d3e0;
          font-size: 14px;
          font-weight: 800;
        }

        .fgd-hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 34px;
          align-items: center;
          padding: 48px;
          border: 1px solid var(--fgd-border);
          border-radius: 34px;
          background: rgba(4,11,22,0.72);
          backdrop-filter: blur(22px);
          box-shadow: 0 30px 100px rgba(0,0,0,0.38);
        }

        .fgd-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 13px;
          border: 1px solid rgba(84,232,255,0.22);
          border-radius: 999px;
          color: #c9f7ff;
          background: rgba(84,232,255,0.065);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .fgd-kicker::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--fgd-cyan);
          box-shadow: 0 0 14px rgba(84,232,255,0.9);
        }

        .fgd-title {
          margin: 22px 0 18px;
          font-size: clamp(46px, 6vw, 76px);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .fgd-title span {
          display: block;
          color: transparent;
          background: linear-gradient(90deg, #aaf6ff, #ffffff 48%, #d3c5ff);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .fgd-lead {
          margin: 0;
          color: #b9c8d8;
          font-size: 18px;
          line-height: 1.72;
        }

        .fgd-case {
          padding: 28px;
          border: 1px solid var(--fgd-border);
          border-radius: 26px;
          background: rgba(255,255,255,0.035);
        }

        .fgd-case-label {
          color: var(--fgd-cyan);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .fgd-amount {
          margin: 12px 0 4px;
          font-size: 44px;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .fgd-case p {
          margin: 0;
          color: var(--fgd-muted);
          line-height: 1.65;
        }

        .fgd-hold {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: 22px;
          padding-top: 20px;
          border-top: 1px solid var(--fgd-border);
        }

        .fgd-hold strong {
          color: var(--fgd-amber);
          font-size: 24px;
        }

        .fgd-hold span {
          color: var(--fgd-muted);
          font-size: 13px;
          text-align: right;
        }

        .fgd-workspace {
          display: grid;
          grid-template-columns: 280px minmax(0,1fr);
          gap: 24px;
          margin-top: 34px;
        }

        .fgd-sidebar,
        .fgd-stage {
          border: 1px solid var(--fgd-border);
          border-radius: 28px;
          background: var(--fgd-panel);
          backdrop-filter: blur(22px);
        }

        .fgd-sidebar {
          padding: 22px;
        }

        .fgd-progress-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: #d7e4ef;
          font-size: 12px;
          font-weight: 850;
        }

        .fgd-progress {
          height: 8px;
          margin: 13px 0 22px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,0.07);
        }

        .fgd-progress > div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--fgd-cyan), var(--fgd-violet));
          transition: width 220ms ease;
        }

        .fgd-step-list {
          display: grid;
          gap: 9px;
        }

        .fgd-step {
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 11px;
          align-items: center;
          width: 100%;
          padding: 11px;
          border: 1px solid transparent;
          border-radius: 15px;
          color: #b7c5d4;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .fgd-step:hover {
          color: white;
          background: rgba(255,255,255,0.04);
        }

        .fgd-step.active {
          color: white;
          border-color: rgba(84,232,255,0.20);
          background: rgba(84,232,255,0.07);
        }

        .fgd-step-number {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border: 1px solid var(--fgd-border);
          border-radius: 12px;
          font-size: 12px;
          font-weight: 900;
        }

        .fgd-step-title {
          font-size: 13px;
          font-weight: 850;
        }

        .fgd-stage {
          min-height: 560px;
          padding: 34px;
        }

        .fgd-stage-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .fgd-eyebrow {
          color: var(--fgd-cyan);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .fgd-stage h2 {
          margin: 12px 0 14px;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.05;
          letter-spacing: -0.04em;
        }

        .fgd-decision {
          padding: 8px 12px;
          border: 1px solid var(--fgd-border);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.10em;
        }

        .fgd-decision.record { color: #c9f7ff; background: rgba(84,232,255,0.07); }
        .fgd-decision.hold { color: #ffe8a8; background: rgba(255,214,110,0.07); }
        .fgd-decision.correct { color: #ded4ff; background: rgba(181,155,255,0.07); }
        .fgd-decision.preserve { color: #c9f8dd; background: rgba(117,240,178,0.07); }

        .fgd-explanation {
          margin: 0;
          color: #afbfce;
          line-height: 1.75;
        }

        .fgd-question {
          margin-top: 28px;
          padding: 24px;
          border: 1px solid rgba(181,155,255,0.18);
          border-radius: 22px;
          background: rgba(181,155,255,0.05);
        }

        .fgd-question h3 {
          margin: 10px 0 0;
          font-size: 22px;
          line-height: 1.4;
        }

        .fgd-reveal {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
          padding: 0 18px;
          border: 1px solid rgba(84,232,255,0.24);
          border-radius: 13px;
          color: #03100c;
          background: linear-gradient(90deg, var(--fgd-cyan), #92f2ff);
          font-weight: 900;
          cursor: pointer;
        }

        .fgd-evidence {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .fgd-evidence-item {
          padding: 15px;
          border: 1px solid rgba(84,232,255,0.15);
          border-radius: 16px;
          color: #d7e5f1;
          background: rgba(84,232,255,0.04);
          font-size: 14px;
          line-height: 1.55;
        }

        .fgd-navigation {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 30px;
          padding-top: 24px;
          border-top: 1px solid var(--fgd-border);
        }

        .fgd-button,
        .fgd-link {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border: 1px solid var(--fgd-border);
          border-radius: 13px;
          color: white;
          background: rgba(255,255,255,0.045);
          text-decoration: none;
          font-weight: 850;
          cursor: pointer;
        }

        .fgd-button:hover,
        .fgd-link:hover {
          background: rgba(255,255,255,0.08);
        }

        .fgd-button:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .fgd-link.primary {
          color: #03100c;
          border-color: transparent;
          background: linear-gradient(90deg, var(--fgd-cyan), #92f2ff);
        }

        .fgd-conclusion {
          margin-top: 34px;
          padding: 34px;
          border: 1px solid rgba(84,232,255,0.17);
          border-radius: 28px;
          background: linear-gradient(
            135deg,
            rgba(84,232,255,0.07),
            rgba(181,155,255,0.05),
            rgba(255,214,110,0.04)
          );
        }

        .fgd-conclusion h2 {
          margin: 12px 0 14px;
          font-size: clamp(30px,4vw,48px);
          letter-spacing: -0.04em;
        }

        .fgd-conclusion p {
          max-width: 860px;
          margin: 0;
          color: #b8c7d7;
          line-height: 1.75;
        }

        .fgd-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        @media (max-width: 920px) {
          .fgd-hero,
          .fgd-workspace {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .fgd-shell {
            width: min(100% - 24px, 1180px);
            padding-top: 16px;
          }

          .fgd-topbar,
          .fgd-stage-head,
          .fgd-navigation {
            align-items: stretch;
            flex-direction: column;
          }

          .fgd-hero,
          .fgd-stage,
          .fgd-conclusion {
            padding: 24px;
            border-radius: 24px;
          }

          .fgd-title {
            font-size: 46px;
          }

          .fgd-decision {
            align-self: flex-start;
          }

          .fgd-evidence {
            grid-template-columns: 1fr;
          }

          .fgd-button,
          .fgd-link {
            width: 100%;
          }
        }
      `}</style>

      <div className="fgd-page">
        <div className="fgd-grid" aria-hidden="true" />

        <main className="fgd-shell">
          <header className="fgd-topbar">
            <Link className="fgd-brand" href="/workspace/ai-governance">
              <span className="fgd-mark">TA-14</span>
              <span>AI Governance Exchange</span>
            </Link>

            <Link className="fgd-back" href="/workspace/ai-governance">
              Return to AI Governance Playground
            </Link>
          </header>

          <section className="fgd-hero">
            <div>
              <div className="fgd-kicker">Free Guided Demonstration</div>
              <h1 className="fgd-title">
                Watch a route become
                <span>governable before execution.</span>
              </h1>
              <p className="fgd-lead">
                Walk through a consequence-bearing AI governance route one
                decision at a time. No payment, technical knowledge, or sales
                conversation is required.
              </p>
            </div>

            <aside className="fgd-case">
              <div className="fgd-case-label">Demonstration route</div>
              <div className="fgd-amount">$27,500</div>
              <p>
                Vendor payment requested through an AI-assisted operational
                workflow.
              </p>
              <div className="fgd-hold">
                <strong>HOLD</strong>
                <span>
                  Missing authority
                  <br />
                  Beneficiary unproven
                </span>
              </div>
            </aside>
          </section>

          <section className="fgd-workspace">
            <aside className="fgd-sidebar">
              <div className="fgd-progress-row">
                <span>Guided progress</span>
                <span>{progress}%</span>
              </div>

              <div className="fgd-progress" aria-hidden="true">
                <div style={{ width: `${progress}%` }} />
              </div>

              <div className="fgd-step-list">
                {steps.map((item, index) => (
                  <button
                    className={`fgd-step ${index === active ? "active" : ""}`}
                    key={item.label}
                    type="button"
                    onClick={() => selectStep(index)}
                  >
                    <span className="fgd-step-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="fgd-step-title">{item.title}</span>
                  </button>
                ))}
              </div>
            </aside>

            <article className="fgd-stage">
              <div className="fgd-stage-head">
                <div>
                  <div className="fgd-eyebrow">{step.label}</div>
                  <h2>{step.title}</h2>
                </div>

                <span
                  className={`fgd-decision ${decisionClass[step.decision]}`}
                >
                  {step.decision}
                </span>
              </div>

              <p className="fgd-explanation">{step.explanation}</p>

              <div className="fgd-question">
                <div className="fgd-eyebrow">What does the route show?</div>
                <h3>
                  Reveal the evidence and boundary recorded at this stage.
                </h3>

                {!revealed ? (
                  <button
                    className="fgd-reveal"
                    type="button"
                    onClick={() => setRevealed(true)}
                  >
                    Reveal This Stage
                  </button>
                ) : (
                  <div className="fgd-evidence">
                    {step.evidence.map((item) => (
                      <div className="fgd-evidence-item" key={item}>
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="fgd-navigation">
                <button
                  className="fgd-button"
                  type="button"
                  disabled={active === 0}
                  onClick={() => selectStep(active - 1)}
                >
                  Previous Stage
                </button>

                {active < steps.length - 1 ? (
                  <button
                    className="fgd-button"
                    type="button"
                    onClick={() => selectStep(active + 1)}
                  >
                    Continue the Route
                  </button>
                ) : (
                  <Link
                    className="fgd-link primary"
                    href="/workspace/ai-governance/build"
                  >
                    Build a Free AI Route
                  </Link>
                )}
              </div>
            </article>
          </section>

          <section className="fgd-conclusion">
            <div className="fgd-eyebrow">What this demonstration proves</div>
            <h2>A governed route is more than a model decision.</h2>
            <p>
              TA-14 separates the underlying record from diagnosis, correction,
              execution, and outcome. The original failed state remains visible.
              Missing evidence remains missing. Authority must be proven before
              commit. The formed outcome can then be preserved and replayed under
              scrutiny.
            </p>

            <div className="fgd-actions">
              <Link
                className="fgd-link primary"
                href="/workspace/ai-governance/build"
              >
                Build a Free AI Route
              </Link>
              <Link
                className="fgd-link"
                href="/workspace/ai-governance/demonstrations"
              >
                View All Demonstrations
              </Link>
              <Link
                className="fgd-link"
                href="/workspace/ai-governance/pricing"
              >
                Return to Pricing
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
