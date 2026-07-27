"use client";

import Link from "next/link";

const architectures = [
  {
    code: "RE",
    title: "Runtime Execution",
    lane: "runtime-execution",
    eyebrow: "Execution Governance",
    description:
      "Govern whether an AI action remains admissible at the moment of execution.",
    accent: "#63e6ff",
    glow: "rgba(99, 230, 255, 0.32)",
  },
  {
    code: "ME",
    title: "Model Evaluation",
    lane: "model-evaluation",
    eyebrow: "Model Governance",
    description:
      "Evaluate model identity, version, capability, limitations, and approved use.",
    accent: "#b58cff",
    glow: "rgba(181, 140, 255, 0.30)",
  },
  {
    code: "DP",
    title: "Data Provenance",
    lane: "data-provenance",
    eyebrow: "Evidence Governance",
    description:
      "Preserve where governing data came from, who controlled it, and whether it changed.",
    accent: "#6fe0b2",
    glow: "rgba(111, 224, 178, 0.28)",
  },
  {
    code: "AT",
    title: "Agent & Tool Governance",
    lane: "agent-tools",
    eyebrow: "Delegated Authority",
    description:
      "Govern agent identity, delegated authority, tool access, and bounded action.",
    accent: "#ffc65c",
    glow: "rgba(255, 198, 92, 0.28)",
  },
  {
    code: "HO",
    title: "Human Oversight",
    lane: "human-oversight",
    eyebrow: "Intervention Authority",
    description:
      "Preserve meaningful human intervention, escalation, review, and override authority.",
    accent: "#ff8db5",
    glow: "rgba(255, 141, 181, 0.28)",
  },
  {
    code: "PC",
    title: "Policy Controls",
    lane: "policy-controls",
    eyebrow: "Control Binding",
    description:
      "Bind proposed actions to applicable policies, control conditions, and failure states.",
    accent: "#7da6ff",
    glow: "rgba(125, 166, 255, 0.28)",
  },
  {
    code: "CR",
    title: "Compliance & Regulatory",
    lane: "compliance-regulatory",
    eyebrow: "Obligation Mapping",
    description:
      "Translate legal and regulatory duties into inspectable evidence and execution gates.",
    accent: "#b7ef68",
    glow: "rgba(183, 239, 104, 0.26)",
  },
  {
    code: "DG",
    title: "Decision Governance",
    lane: "decision",
    eyebrow: "Decision Integrity",
    description:
      "Separate the proposed decision, governing evidence, authority, determination, and result.",
    accent: "#c68cff",
    glow: "rgba(198, 140, 255, 0.28)",
  },
  {
    code: "RG",
    title: "Risk Governance",
    lane: "risk",
    eyebrow: "Risk Disposition",
    description:
      "Identify consequential risk, unresolved conditions, thresholds, and required dispositions.",
    accent: "#ff826f",
    glow: "rgba(255, 130, 111, 0.28)",
  },
  {
    code: "GG",
    title: "General Governance",
    lane: "general",
    eyebrow: "Complete Route",
    description:
      "Build and test a complete governed route when no narrower architecture is appropriate.",
    accent: "#dce8f3",
    glow: "rgba(220, 232, 243, 0.20)",
  },
];

const chain = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

export default function GovernanceLibraryPage() {
  return (
    <main className="libraryMain">
      <section className="libraryShell">
        <div className="topActions">
          <Link href="/" className="topLink secondary">
            ← Return to Exchange
          </Link>

          <Link href="/workspace/ai-governance" className="topLink primary">
            Enter AI Governance Workspace →
          </Link>
        </div>

        <header className="hero">
          <p className="institution">TA-14 AI Governance Exchange</p>

          <div className="heroMark" aria-hidden="true">
            <span>GL</span>
          </div>

          <p className="eyebrow">THE ARCHITECTURE BEFORE THE ROUTE</p>

          <h1>AI Governance Architecture Library</h1>

          <p className="lead">
            Choose the governance architecture that matches the control boundary
            you need to examine. Each architecture opens a bounded playground
            lane for testing evidence, authority, continuity, admissibility,
            commitment, execution, and outcome.
          </p>

          <div className="motto">
            <i />
            <strong>No admissible evidence. No admissible execution.</strong>
            <i />
          </div>
        </header>

        <section className="introBand">
          <article>
            <span>01</span>
            <div>
              <strong>Choose the right architecture</strong>
              <p>
                Start with the governing problem instead of forcing every system
                into the same framework.
              </p>
            </div>
          </article>

          <article>
            <span>02</span>
            <div>
              <strong>Preserve the evidence boundary</strong>
              <p>
                Keep model, data, policy, authority, decision, and runtime
                evidence visible as separate governed layers.
              </p>
            </div>
          </article>

          <article>
            <span>03</span>
            <div>
              <strong>Build an inspectable route</strong>
              <p>
                Move from architecture into a governed playground where evidence
                can be tested before consequential execution.
              </p>
            </div>
          </article>
        </section>

        <section className="architectureSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">TEN GOVERNANCE LANES</p>
              <h2>Choose the lane that matches the governing need.</h2>
            </div>

            <p>
              Each lane preserves its own evidence boundary, authority,
              admissibility conditions, failure states, and execution purpose.
            </p>
          </div>

          <div className="architectureGrid">
            {architectures.map((architecture, index) => (
              <article
                className="architectureCard"
                key={architecture.lane}
                style={
                  {
                    "--accent": architecture.accent,
                    "--glow": architecture.glow,
                  } as React.CSSProperties
                }
              >
                <div className="cardAura" aria-hidden="true" />
                <div className="cardGrid" aria-hidden="true" />

                <div className="cardTop">
                  <div className="code">{architecture.code}</div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>

                <p className="cardEyebrow">{architecture.eyebrow}</p>
                <h3>{architecture.title}</h3>
                <p className="cardDescription">{architecture.description}</p>

                <div className="boundary">
                  <span>Evidence</span>
                  <i />
                  <span>Authority</span>
                  <i />
                  <span>Execution</span>
                </div>

                <Link
                  href={`/ai-governance/playground?lane=${architecture.lane}`}
                  className="laneButton"
                >
                  Open governed lane <span>→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="chainSection">
          <p className="eyebrow gold">THE TA-14 GOVERNING CHAIN</p>
          <h2>Every governing link remains visible.</h2>

          <div className="chain">
            {chain.map((item, index) => (
              <div className="chainItem" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                {index < chain.length - 1 ? <i>→</i> : null}
              </div>
            ))}
          </div>

          <p className="chainText">
            Reality becomes a preserved record. Continuity is tested.
            Admissibility is determined. Authority is bound. Commitment is
            explicit. Execution is controlled. The outcome is preserved.
          </p>
        </section>
      </section>

      <style jsx>{`
        .libraryMain {
          min-height: 100vh;
          color: #f7fbff;
        }

        .libraryShell {
          width: min(1480px, calc(100% - 40px));
          margin: 0 auto;
          padding: 24px 0 72px;
        }

        .topActions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          background: rgba(5, 18, 31, 0.72);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
        }

        .topLink {
          min-height: 46px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          transition: transform 0.22s ease, border-color 0.22s ease,
            background 0.22s ease;
        }

        .topLink:hover {
          transform: translateY(-2px);
        }

        .topLink.secondary {
          color: #c4d5de;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .topLink.secondary:hover {
          color: #ffffff;
          border-color: rgba(99, 230, 255, 0.36);
          background: rgba(99, 230, 255, 0.08);
        }

        .topLink.primary {
          color: #041a23;
          border: 1px solid #aaf2ff;
          background: linear-gradient(135deg, #d9fbff, #76deef 64%, #38aeca);
          box-shadow: 0 14px 30px rgba(63, 190, 218, 0.18);
        }

        .hero {
          max-width: 1120px;
          margin: 0 auto;
          padding: 84px 0 62px;
          text-align: center;
        }

        .institution,
        .eyebrow {
          margin: 0;
          color: #6fe8ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .heroMark {
          width: 118px;
          height: 118px;
          margin: 28px auto 24px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 199, 82, 0.38);
          border-radius: 50%;
          background:
            radial-gradient(circle, rgba(255, 193, 64, 0.13), transparent 62%),
            rgba(4, 18, 30, 0.86);
          box-shadow:
            0 0 48px rgba(255, 186, 42, 0.13),
            inset 0 0 28px rgba(99, 230, 255, 0.08);
        }

        .heroMark span {
          color: #ffe6a0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 34px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-shadow: 0 0 18px rgba(255, 201, 92, 0.38);
        }

        .hero h1 {
          margin: 15px auto 0;
          max-width: 1050px;
          color: transparent;
          background: linear-gradient(180deg, #ffffff 0%, #eef7ff 58%, #8599aa 100%);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(52px, 6.5vw, 96px);
          line-height: 0.95;
          letter-spacing: -0.052em;
        }

        .lead {
          max-width: 860px;
          margin: 26px auto 0;
          color: #b1c5cf;
          font-size: 18px;
          line-height: 1.72;
        }

        .motto {
          max-width: 760px;
          margin: 34px auto 0;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .motto i {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 199, 82, 0.56));
        }

        .motto i:last-child {
          background: linear-gradient(90deg, rgba(255, 199, 82, 0.56), transparent);
        }

        .motto strong {
          color: #ffe8ad;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 15px;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .introBand {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin: 0 auto 72px;
        }

        .introBand article {
          min-height: 168px;
          padding: 22px;
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 15px;
          border: 1px solid rgba(103, 221, 245, 0.14);
          border-radius: 20px;
          background:
            radial-gradient(circle at 100% 0%, rgba(99, 230, 255, 0.06), transparent 40%),
            linear-gradient(145deg, rgba(11, 32, 48, 0.84), rgba(5, 16, 27, 0.92));
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.18);
        }

        .introBand article > span {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.28);
          border-radius: 50%;
          color: #8fefff;
          background: rgba(99, 230, 255, 0.06);
          font-size: 10px;
          font-weight: 900;
        }

        .introBand strong {
          display: block;
          color: #ffffff;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
          line-height: 1.15;
        }

        .introBand p {
          margin: 10px 0 0;
          color: #92a8b3;
          font-size: 13px;
          line-height: 1.6;
        }

        .architectureSection {
          padding-top: 20px;
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
          gap: 42px;
          align-items: end;
          margin-bottom: 34px;
        }

        .sectionHeading h2,
        .chainSection h2 {
          margin: 12px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(38px, 4.4vw, 64px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .sectionHeading > p {
          margin: 0;
          color: #9eb2bc;
          font-size: 15px;
          line-height: 1.72;
        }

        .architectureGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .architectureCard {
          --accent: #63e6ff;
          --glow: rgba(99, 230, 255, 0.28);
          position: relative;
          min-height: 362px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--accent) 28%, rgba(255, 255, 255, 0.07));
          border-radius: 28px;
          background: linear-gradient(145deg, rgba(10, 29, 46, 0.95), rgba(4, 13, 23, 0.98));
          box-shadow:
            0 24px 58px rgba(0, 0, 0, 0.31),
            inset 0 1px rgba(255, 255, 255, 0.04);
          transition: transform 0.28s ease, border-color 0.28s ease,
            box-shadow 0.28s ease;
        }

        .architectureCard:hover {
          transform: translateY(-7px);
          border-color: var(--accent);
          box-shadow:
            0 30px 68px rgba(0, 0, 0, 0.38),
            0 0 34px var(--glow);
        }

        .cardAura {
          position: absolute;
          right: -92px;
          top: -102px;
          width: 270px;
          height: 270px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--glow), transparent 68%);
          filter: blur(14px);
          opacity: 0.78;
        }

        .cardGrid {
          position: absolute;
          inset: 0;
          opacity: 0.07;
          background-image:
            linear-gradient(var(--accent) 1px, transparent 1px),
            linear-gradient(90deg, var(--accent) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: linear-gradient(to bottom left, black, transparent 72%);
        }

        .cardTop,
        .cardEyebrow,
        .architectureCard h3,
        .cardDescription,
        .boundary,
        .laneButton {
          position: relative;
          z-index: 2;
        }

        .cardTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .code {
          width: 68px;
          height: 68px;
          display: grid;
          place-items: center;
          border: 1px solid var(--accent);
          border-radius: 18px;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.24);
          box-shadow: 0 0 22px var(--glow);
          font-size: 20px;
          font-weight: 950;
          letter-spacing: 0.1em;
        }

        .cardTop > span {
          padding: 7px 11px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 999px;
          color: #6f8490;
          background: rgba(0, 0, 0, 0.2);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .cardEyebrow {
          margin: 27px 0 0;
          color: var(--accent);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .architectureCard h3 {
          margin: 10px 0 0;
          color: #ffffff;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 29px;
          line-height: 1.04;
          letter-spacing: -0.025em;
        }

        .cardDescription {
          flex: 1;
          margin: 15px 0 0;
          color: #9bb0bb;
          font-size: 14px;
          line-height: 1.7;
        }

        .boundary {
          margin-top: 22px;
          display: flex;
          align-items: center;
          gap: 9px;
          color: color-mix(in srgb, var(--accent) 65%, white);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .boundary i {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, var(--accent), transparent);
          opacity: 0.32;
        }

        .laneButton {
          min-height: 50px;
          margin-top: 19px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid color-mix(in srgb, var(--accent) 44%, transparent);
          border-radius: 14px;
          color: color-mix(in srgb, var(--accent) 74%, white);
          background: color-mix(in srgb, var(--accent) 9%, rgba(0, 0, 0, 0.2));
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          transition: transform 0.22s ease, background 0.22s ease,
            border-color 0.22s ease;
        }

        .laneButton:hover {
          transform: translateY(-2px);
          border-color: var(--accent);
          background: color-mix(in srgb, var(--accent) 16%, rgba(0, 0, 0, 0.18));
        }

        .chainSection {
          margin-top: 90px;
          padding: 52px 34px;
          overflow: hidden;
          border: 1px solid rgba(255, 197, 82, 0.22);
          border-radius: 32px;
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 185, 44, 0.10), transparent 42%),
            linear-gradient(180deg, rgba(8, 20, 33, 0.96), rgba(3, 10, 18, 0.98));
          box-shadow: 0 28px 74px rgba(0, 0, 0, 0.33);
          text-align: center;
        }

        .eyebrow.gold {
          color: #efbd59;
        }

        .chain {
          margin-top: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .chainItem {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chainItem > span {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 216, 138, 0.27);
          border-radius: 50%;
          color: #d7ad5d;
          background: rgba(255, 194, 76, 0.06);
          font-size: 9px;
          font-weight: 900;
        }

        .chainItem strong {
          padding: 11px 15px;
          border: 1px solid rgba(255, 220, 151, 0.15);
          border-radius: 999px;
          color: #fff0bd;
          background: rgba(0, 0, 0, 0.2);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .chainItem i {
          color: rgba(255, 211, 123, 0.36);
          font-style: normal;
        }

        .chainText {
          max-width: 980px;
          margin: 30px auto 0;
          color: #9faeb5;
          font-size: 15px;
          line-height: 1.72;
        }

        @media (max-width: 1180px) {
          .architectureGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .sectionHeading {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }

        @media (max-width: 820px) {
          .introBand {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .libraryShell {
            width: min(100% - 22px, 1480px);
          }

          .topActions {
            flex-direction: column;
          }

          .topLink {
            width: 100%;
          }

          .hero {
            padding: 60px 0 48px;
          }

          .hero h1 {
            font-size: clamp(46px, 15vw, 68px);
          }

          .lead {
            font-size: 16px;
          }

          .motto i {
            display: none;
          }

          .motto strong {
            white-space: normal;
          }

          .architectureGrid {
            grid-template-columns: 1fr;
          }

          .chainSection {
            padding: 42px 20px;
          }

          .chain {
            align-items: stretch;
            flex-direction: column;
          }

          .chainItem {
            width: 100%;
          }

          .chainItem strong {
            flex: 1;
          }

          .chainItem i {
            transform: rotate(90deg);
          }
        }
      `}</style>
    </main>
  );
}
