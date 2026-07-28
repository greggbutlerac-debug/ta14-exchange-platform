"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

type WorkspaceCard = {
  code: string;
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  accent: string;
  features: string[];
};

const workspaceCards: WorkspaceCard[] = [
  {
    code: "PG",
    title: "AI Governance Playground",
    eyebrow: "BUILD, TEST, AND CHALLENGE",
    description:
      "Construct and test consequential AI governance routes before execution is allowed to bind to reality.",
    href: "/workspace/ai-governance/playground",
    accent: "#63e6ff",
    features: [
      "Evidence and authority testing",
      "ALLOW, HOLD, DENY, and ESCALATE",
      "Preserved governance runs",
    ],
  },
  {
    code: "EU",
    title: "EU AI Act Workspace",
    eyebrow: "REVIEW REGULATORY APPLICABILITY",
    description:
      "Examine provider, deployer, system, risk, transparency, documentation, oversight, and evidence requirements.",
    href: "/workspace/ai-governance/eu-ai-act",
    accent: "#8eb6ff",
    features: [
      "Role and system classification",
      "Requirement-by-requirement review",
      "Supported, partial, and unresolved findings",
    ],
  },
  {
    code: "DM",
    title: "Demonstrations",
    eyebrow: "SEE GOVERNANCE IN OPERATION",
    description:
      "Inspect guided demonstrations showing how evidence, admissibility, binding, execution, and outcomes remain distinct.",
    href: "/workspace/ai-governance/demonstrations",
    accent: "#72e6b2",
    features: [
      "Guided governance examples",
      "Visible execution boundaries",
      "Inspectable governed records",
    ],
  },
  {
    code: "GL",
    title: "Governance Library",
    eyebrow: "UNDERSTAND THE AUTHORITY LANDSCAPE",
    description:
      "Explore connected laws, regulations, standards, frameworks, principles, recommendations, and assurance systems.",
    href: "/workspace/ai-governance/library",
    accent: "#ffc65c",
    features: [
      "Source and authority intelligence",
      "Applicability and relationship mapping",
      "Crosswalks, coverage, and references",
    ],
  },
  {
    code: "RG",
    title: "AI Governance Registry",
    eyebrow: "PRESERVE ATTRIBUTION AND PRIOR ART",
    description:
      "Review dated, attributable, searchable, challengeable, and preserved governance architectures, claims, and records.",
    href: "/workspace/ai-governance/registry",
    accent: "#c68cff",
    features: [
      "Dated registry entries",
      "Architecture attribution",
      "Challenge and review history",
    ],
  },
  {
    code: "PRN",
    title: "Partner Review Network",
    eyebrow: "REQUEST BOUNDED INDEPENDENT REVIEW",
    description:
      "Connect governance architectures, implementations, and evidence packages to declared review pathways.",
    href: "/workspace/ai-governance/partner-review-network",
    accent: "#ff8db5",
    features: [
      "Scoped independent review",
      "Declared expertise and limitations",
      "Preserved findings and objections",
    ],
  },
  {
    code: "$",
    title: "Pricing",
    eyebrow: "REVIEW THE SERVICE MODEL",
    description:
      "Understand preserved-run pricing, governed-record services, review pathways, and implementation options.",
    href: "/workspace/ai-governance/pricing",
    accent: "#ff9d72",
    features: [
      "Workspace access",
      "Preserved governance runs",
      "Review and implementation scopes",
    ],
  },
];

const anchorChain = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

export default function AiGovernanceWorkspacePage() {
  return (
    <main className="workspacePage">
      <div className="gridOverlay" />
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />

      <section className="shell">
        <div className="topbar">
          <Link href="/" className="button quiet">
            ← Return to Exchange
          </Link>

          <div className="status">
            <span />
            Consequential execution workspace
          </div>

          <Link href="/governance-library" className="button primary">
            Open Governance Library →
          </Link>
        </div>

        <header className="hero">
          <div className="seal">
            <strong>AI</strong>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">TA-14 AI GOVERNANCE WORKSPACE</p>

          <h1>
            Govern the route
            <span> before execution becomes reality.</span>
          </h1>

          <p className="lead">
            Build, test, review, preserve, and verify consequential AI
            governance routes. The workspace keeps authority, evidence,
            admissibility, commitment, execution, and outcome separate so no
            layer can silently substitute for another.
          </p>

          <div className="heroActions">
            <Link
              href="/workspace/ai-governance/playground"
              className="button primary"
            >
              Enter the Playground →
            </Link>

            <Link
              href="/workspace/ai-governance/eu-ai-act"
              className="button secondary"
            >
              Open EU AI Act Workspace →
            </Link>

            <Link
              href="/workspace/ai-governance/demonstrations"
              className="button gold"
            >
              View Demonstrations →
            </Link>
          </div>

          <div className="metrics">
            <article>
              <span>24</span>
              <small>Governed runtime links</small>
            </article>
            <article>
              <span>08</span>
              <small>Visible chain anchors</small>
            </article>
            <article>
              <span>04</span>
              <small>Execution determinations</small>
            </article>
            <article>
              <span>01</span>
              <small>Preserved governed route</small>
            </article>
          </div>
        </header>

        <section className="workspaceSection">
          <div className="heading">
            <div>
              <p className="eyebrow">AI GOVERNANCE OPERATING SYSTEM</p>
              <h2>Choose what you need to do.</h2>
            </div>

            <p>
              The Library explains governance sources. This workspace is where
              those sources become operational through structured testing,
              review, records, registry, and controlled execution pathways.
            </p>
          </div>

          <div className="cardGrid">
            {workspaceCards.map((card, index) => (
              <Link
                href={card.href}
                className="workspaceCard"
                key={card.title}
                style={{ "--accent": card.accent } as CSSProperties}
              >
                <div className="cardTop">
                  <span className="cardCode">{card.code}</span>
                  <span className="cardNumber">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="cardEyebrow">{card.eyebrow}</p>
                <h3>{card.title}</h3>
                <p className="cardDescription">{card.description}</p>

                <ul>
                  {card.features.map((feature) => (
                    <li key={feature}>
                      <span>✦</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="cardAction">
                  <strong>Open workspace</strong>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="chainSection">
          <div className="heading">
            <div>
              <p className="eyebrow goldText">
                ADMISSIBLE EXECUTION ARCHITECTURE
              </p>
              <h2>Eight anchors. Twenty-four governed links.</h2>
            </div>

            <p>
              The anchor chain makes the route legible. The complete runtime
              architecture applies the deeper authority, evidence, continuity,
              admissibility, review, and verification controls required before
              consequence is released.
            </p>
          </div>

          <div className="chain">
            {anchorChain.map((item, index) => (
              <div className="chainNode" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                {index < anchorChain.length - 1 ? <i>→</i> : null}
              </div>
            ))}
          </div>

          <div className="principle">
            <span>TA-14 GOVERNING PRINCIPLE</span>
            <strong>No admissible evidence. No admissible execution.</strong>
          </div>
        </section>

        <section className="boundary">
          <div className="boundarySeal">
            <strong>EB</strong>
            <small>Execution boundary</small>
          </div>

          <p className="eyebrow goldText">
            GOVERNANCE AND EXECUTION BOUNDARY
          </p>

          <h2>
            A policy, framework, assessment, or approval is not the execution.
          </h2>

          <p>
            The workspace preserves the distinction between what an authority
            requires, what a system claims, what the evidence supports, what a
            reviewer determines, what an authorized actor commits, what the
            system executes, and what actually occurs.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>DECLARE</span>
              <strong>
                Governed object, intended action, authority, scope, actor, and
                operating conditions
              </strong>
            </article>

            <article>
              <span>DETERMINE</span>
              <strong>
                Evidence sufficiency, continuity, admissibility, limitations,
                conflicts, and unresolved requirements
              </strong>
            </article>

            <article>
              <span>PRESERVE</span>
              <strong>
                Commitment, execution, outcome, objections, corrections, and
                review history
              </strong>
            </article>
          </div>
        </section>
      </section>

      <style jsx>{`
        .workspacePage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f7fbff;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(31, 120, 169, 0.2),
              transparent 36%
            ),
            radial-gradient(
              circle at 8% 34%,
              rgba(65, 203, 227, 0.08),
              transparent 24%
            ),
            radial-gradient(
              circle at 88% 66%,
              rgba(239, 185, 89, 0.07),
              transparent 27%
            ),
            linear-gradient(
              180deg,
              #04101b 0%,
              #020913 48%,
              #01060c 100%
            );
        }

        .gridOverlay,
        .ambient {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .gridOverlay {
          opacity: 0.17;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black, transparent 84%);
        }

        .ambientOne {
          background: radial-gradient(
            circle at 18% 12%,
            rgba(99, 230, 255, 0.08),
            transparent 25%
          );
        }

        .ambientTwo {
          background: radial-gradient(
            circle at 82% 42%,
            rgba(255, 198, 92, 0.06),
            transparent 26%
          );
        }

        .shell {
          position: relative;
          z-index: 2;
          width: min(1480px, calc(100% - 40px));
          margin: auto;
          padding: 24px 0 90px;
        }

        .topbar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 14px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          background: rgba(5, 19, 32, 0.78);
          box-shadow: 0 18px 54px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(18px);
        }

        .status {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #8fa9b6;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .status span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #72e6b2;
          box-shadow: 0 0 16px rgba(114, 230, 178, 0.9);
        }

        .button {
          min-height: 48px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          transition: transform 0.22s;
        }

        .button:hover {
          transform: translateY(-2px);
        }

        .quiet {
          justify-self: start;
          color: #c4d5de;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .primary {
          justify-self: end;
          color: #041a23;
          border: 1px solid #aaf2ff;
          background: linear-gradient(
            135deg,
            #d9fbff,
            #76deef 64%,
            #38aeca
          );
        }

        .secondary {
          color: #dffbff;
          border: 1px solid rgba(104, 224, 245, 0.34);
          background: linear-gradient(
            135deg,
            rgba(34, 123, 151, 0.35),
            rgba(7, 31, 45, 0.84)
          );
        }

        .gold {
          color: #241704;
          border: 1px solid #ffe09a;
          background: linear-gradient(135deg, #fff0bd, #eeb84b);
        }

        .hero {
          max-width: 1200px;
          margin: auto;
          padding: 92px 0 74px;
          text-align: center;
        }

        .seal {
          width: 120px;
          height: 120px;
          margin: 0 auto 30px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 4px;
          border: 1px solid rgba(255, 199, 82, 0.44);
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 50% 34%,
              rgba(255, 220, 146, 0.18),
              transparent 34%
            ),
            radial-gradient(
              circle,
              rgba(99, 230, 255, 0.12),
              rgba(4, 18, 30, 0.96) 68%
            );
          box-shadow:
            0 0 70px rgba(99, 230, 255, 0.12),
            inset 0 0 32px rgba(255, 198, 92, 0.07);
        }

        .seal strong {
          color: #ffe1a0;
          font: 900 38px Georgia, serif;
        }

        .seal small {
          color: #86a1ae;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.2em;
        }

        .eyebrow {
          margin: 0;
          color: #6fe8ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .goldText {
          color: #efbd59;
        }

        h1,
        h2,
        h3 {
          font-family: Georgia, "Times New Roman", serif;
        }

        .hero h1 {
          max-width: 1120px;
          margin: 15px auto 0;
          font-size: clamp(54px, 6.8vw, 100px);
          line-height: 0.94;
          letter-spacing: -0.056em;
          text-wrap: balance;
        }

        .hero h1 span {
          display: block;
          color: #9fb4bf;
          font-style: italic;
          font-weight: 500;
        }

        .lead {
          max-width: 950px;
          margin: 28px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroActions {
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }

        .heroActions .button {
          justify-self: auto;
        }

        .metrics {
          max-width: 980px;
          margin: 38px auto 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .metrics article {
          padding: 20px 14px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 17px;
          background: rgba(5, 19, 31, 0.62);
        }

        .metrics span {
          display: block;
          color: #f0d28f;
          font: 700 28px Georgia, serif;
        }

        .metrics small {
          display: block;
          margin-top: 6px;
          color: #788f9a;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .workspaceSection {
          padding-top: 88px;
        }

        .heading {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
          margin-bottom: 34px;
        }

        .heading h2,
        .boundary h2 {
          margin: 12px 0 0;
          font-size: clamp(40px, 4.6vw, 68px);
          line-height: 0.98;
          letter-spacing: -0.048em;
        }

        .heading > p {
          margin: 0;
          color: #98adb7;
          font-size: 15px;
          line-height: 1.75;
        }

        .cardGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .workspaceCard {
          --accent: #63e6ff;
          min-height: 440px;
          padding: 26px;
          display: flex;
          flex-direction: column;
          border: 1px solid
            color-mix(
              in srgb,
              var(--accent) 31%,
              rgba(255, 255, 255, 0.05)
            );
          border-radius: 28px;
          color: inherit;
          text-decoration: none;
          background: linear-gradient(
            145deg,
            rgba(10, 30, 47, 0.96),
            rgba(4, 13, 23, 0.99)
          );
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
          transition:
            transform 0.26s,
            border-color 0.26s,
            box-shadow 0.26s;
        }

        .workspaceCard:hover {
          transform: translateY(-8px);
          border-color: var(--accent);
          box-shadow:
            0 34px 76px rgba(0, 0, 0, 0.38),
            0 0 34px color-mix(in srgb, var(--accent) 20%, transparent);
        }

        .cardTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cardCode {
          min-width: 66px;
          height: 66px;
          padding: 0 10px;
          display: grid;
          place-items: center;
          border: 1px solid var(--accent);
          border-radius: 18px;
          color: var(--accent);
          background: rgba(0, 0, 0, 0.22);
          font-size: 15px;
          font-weight: 950;
        }

        .cardNumber {
          color: #6f8590;
          font-size: 9px;
          font-weight: 900;
        }

        .cardEyebrow {
          margin: 26px 0 0;
          color: var(--accent);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .workspaceCard h3 {
          margin: 10px 0 0;
          font-size: 33px;
          line-height: 1.02;
        }

        .cardDescription {
          margin: 15px 0 0;
          color: #9bb0ba;
          font-size: 14px;
          line-height: 1.68;
        }

        .workspaceCard ul {
          margin: 22px 0 0;
          padding: 0;
          display: grid;
          gap: 10px;
          list-style: none;
        }

        .workspaceCard li {
          display: grid;
          grid-template-columns: 16px 1fr;
          gap: 8px;
          color: #d2e0e5;
          font-size: 11px;
          line-height: 1.45;
        }

        .workspaceCard li span {
          color: var(--accent);
        }

        .cardAction {
          margin-top: auto;
          padding-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.065);
          color: var(--accent);
          font-size: 11px;
        }

        .cardAction > span {
          font-size: 19px;
        }

        .chainSection {
          margin-top: 88px;
          padding: 54px 40px;
          border: 1px solid rgba(255, 197, 82, 0.2);
          border-radius: 32px;
          background:
            radial-gradient(
              circle at 50% 0,
              rgba(255, 190, 61, 0.1),
              transparent 40%
            ),
            linear-gradient(
              145deg,
              rgba(10, 29, 44, 0.95),
              rgba(3, 11, 20, 0.99)
            );
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.32);
        }

        .chain {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 8px;
          margin-top: 38px;
        }

        .chainNode {
          position: relative;
          min-height: 104px;
          padding: 15px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 198, 92, 0.16);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.2);
          text-align: center;
        }

        .chainNode span {
          color: #857249;
          font-size: 8px;
          font-weight: 900;
        }

        .chainNode strong {
          margin-top: 10px;
          color: #f0d38f;
          font-size: 11px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .chainNode i {
          position: absolute;
          right: -9px;
          top: 43px;
          z-index: 3;
          color: #e7b64f;
          font-style: normal;
        }

        .principle {
          margin-top: 24px;
          padding: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border: 1px solid rgba(255, 198, 92, 0.18);
          border-radius: 17px;
          background: rgba(84, 54, 8, 0.1);
        }

        .principle span {
          color: #b79655;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .principle strong {
          color: #ffe4a5;
          font: 700 23px Georgia, serif;
        }

        .boundary {
          margin-top: 90px;
          padding: 58px 36px;
          border: 1px solid rgba(255, 197, 82, 0.24);
          border-radius: 32px;
          background:
            radial-gradient(
              circle at 50% 0,
              rgba(255, 185, 44, 0.12),
              transparent 42%
            ),
            linear-gradient(
              180deg,
              rgba(8, 20, 33, 0.97),
              rgba(3, 10, 18, 0.99)
            );
          box-shadow: 0 28px 78px rgba(0, 0, 0, 0.35);
          text-align: center;
        }

        .boundarySeal {
          width: 84px;
          height: 84px;
          margin: 0 auto 22px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 197, 82, 0.32);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.18);
        }

        .boundarySeal strong {
          color: #f2ca75;
          font: 700 23px Georgia, serif;
        }

        .boundarySeal small {
          color: #788b94;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .boundary h2 {
          max-width: 1080px;
          margin: 14px auto 0;
        }

        .boundary > p:not(.eyebrow) {
          max-width: 1000px;
          margin: 24px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .boundaryGrid {
          max-width: 1120px;
          margin: 32px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .boundaryGrid article {
          padding: 21px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.17);
        }

        .boundaryGrid span {
          display: block;
          color: #e3b759;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .boundaryGrid strong {
          display: block;
          margin-top: 10px;
          color: #d9e4e8;
          font-size: 12px;
          line-height: 1.48;
        }

        @media (max-width: 1180px) {
          .cardGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .chain {
            grid-template-columns: repeat(4, 1fr);
          }

          .chainNode i {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .status {
            display: none;
          }

          .heading {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .metrics,
          .boundaryGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .principle {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 650px) {
          .shell {
            width: calc(100% - 22px);
          }

          .topbar {
            grid-template-columns: 1fr;
          }

          .quiet,
          .primary {
            justify-self: stretch;
          }

          .button {
            width: 100%;
          }

          .hero {
            padding: 64px 0;
          }

          .hero h1 {
            font-size: clamp(45px, 14vw, 68px);
          }

          .cardGrid,
          .metrics,
          .boundaryGrid {
            grid-template-columns: 1fr;
          }

          .chain {
            grid-template-columns: repeat(2, 1fr);
          }

          .chainSection,
          .boundary {
            padding: 38px 20px;
          }

          .workspaceCard {
            min-height: auto;
          }
        }
      `}</style>
    </main>
  );
}
