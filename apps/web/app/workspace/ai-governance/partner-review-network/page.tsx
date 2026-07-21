"use client";

import { useMemo, useState } from "react";

type Partner = {
  name: string;
  initials: string;
  status: string;
  lane: string;
  summary: string;
  governs: string[];
  contribution: string;
  boundary: string;
  pathwayUrl: string;
  accent: "cyan" | "violet" | "amber";
};

const partners: Partner[] = [
  {
    name: "Elias / LOVE-OS",
    initials: "EL",
    status: "Signed Partner Review Pathway",
    lane:
      "Runtime Misexecution Pressure Assessment + TA-14 Admissible Execution Boundary Review",
    summary:
      "A specialized runtime-governance pathway focused on how systems behave under ambiguity, pressure, changing conditions, and consequence-bearing decision risk.",
    governs: [
      "Runtime misexecution exposure",
      "Refusal and escalation behavior",
      "Witness continuity",
      "Bounded execution behavior",
      "Operational pressure dynamics",
      "Intervention survivability",
    ],
    contribution:
      "Elias / LOVE-OS contributes the specialized runtime-governance and misexecution-pressure assessment layer. TA-14 contributes the second-layer review of the broader consequence-bearing route.",
    boundary:
      "This pathway is not a merger, certification, endorsement, production validation, security assurance, legal opinion, or claim that either architecture implements or absorbs the other.",
    pathwayUrl:
      "https://sites.google.com/view/ta-14partnerreviewnetworkanewc/elias-love-os-partner-review-pathway",
    accent: "cyan",
  },
  {
    name: "AnchorStack",
    initials: "AS",
    status: "Signed Partner Review Pathway",
    lane:
      "Evidence Maturity / Pressure-Route Assessment + TA-14 Admissible Execution Boundary Review",
    summary:
      "A specialized evidence-maturity and pressure-route pathway examining whether governance evidence and route behavior remain credible before consequence attaches.",
    governs: [
      "Evidence maturity",
      "Pressure-route behavior",
      "Invalid operational continuation",
      "Bypass resistance",
      "Replay packets",
      "Assumption governance",
      "Route-governance artifacts",
      "Claim discipline",
    ],
    contribution:
      "AnchorStack contributes the evidence-maturity and pressure-route assessment layer. TA-14 reviews whether those findings support admissible execution across the full route from reality through outcome.",
    boundary:
      "Evidence maturity is not automatically route-complete admissibility. The pathway does not imply certification, endorsement, production validation, a source-code audit, or unrestricted TA-14 status.",
    pathwayUrl:
      "https://sites.google.com/view/ta-14partnerreviewnetworkanewc/anchorstack-partner-review-pathway",
    accent: "violet",
  },
  {
    name: "AB / BIGMAE / Elias",
    initials: "AB",
    status: "Accepted-in-Writing Partner Review Pathway",
    lane:
      "Governed Multi-Agent Execution / Identity & Binding Review + TA-14 Admissible Execution Boundary Review",
    summary:
      "A governed-agent and runtime-governance pathway focused on identity, consequence classification, authority, scope, cryptographic binding, continuity, and controlled execution.",
    governs: [
      "Governed multi-agent execution",
      "Agent identity and runtime-state separation",
      "Consequence classification",
      "Cryptographic binding",
      "Admissibility continuity",
      "Permit / Constrain / Refuse / Escalate logic",
      "Non-bypass behavior",
      "Formed-outcome verification",
    ],
    contribution:
      "AB / BIGMAE / Elias contributes the governed-agent, identity, binding, and runtime-governance assessment layer. TA-14 contributes the route-complete admissible-execution boundary and gap review.",
    boundary:
      "Strong identity, binding, receipts, or runtime controls do not independently prove full-chain admissible execution. The relationship remains independent, written, bounded, and claim-disciplined.",
    pathwayUrl:
      "https://sites.google.com/view/ta-14partnerreviewnetworkanewc/ab-bigmae-elias-partner-review-pathway",
    accent: "amber",
  },
];

export default function PartnerReviewNetworkWorkspacePage() {
  const [openPartner, setOpenPartner] = useState<number | null>(0);

  const stars = useMemo(
    () =>
      Array.from({ length: 72 }, (_, index) => ({
        left: `${(index * 37) % 100}%`,
        top: `${(index * 53) % 100}%`,
        size: index % 9 === 0 ? 3 : index % 4 === 0 ? 2 : 1,
        delay: `${(index % 12) * 0.35}s`,
      })),
    [],
  );

  return (
    <>
      <style>{`
        :root {
          --prn-bg: #030712;
          --prn-panel: rgba(7, 15, 28, 0.78);
          --prn-panel-strong: rgba(5, 11, 22, 0.94);
          --prn-line: rgba(255, 255, 255, 0.10);
          --prn-text: #f7fbff;
          --prn-muted: #9fb0c4;
          --prn-cyan: #54e8ff;
          --prn-violet: #b59bff;
          --prn-amber: #ffd66e;
        }

        .prn-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--prn-text);
          background:
            radial-gradient(circle at 12% 12%, rgba(28, 183, 255, 0.16), transparent 28%),
            radial-gradient(circle at 88% 18%, rgba(153, 102, 255, 0.14), transparent 30%),
            radial-gradient(circle at 52% 92%, rgba(255, 190, 66, 0.08), transparent 28%),
            linear-gradient(180deg, #020611 0%, #06101c 54%, #02060d 100%);
        }

        .prn-page *,
        .prn-page *::before,
        .prn-page *::after {
          box-sizing: border-box;
        }

        .prn-background {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .prn-grid {
          position: absolute;
          inset: 0;
          opacity: 0.13;
          background-image:
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: radial-gradient(circle at center, black, transparent 82%);
        }

        .prn-star {
          position: absolute;
          border-radius: 999px;
          background: white;
          animation: prnStar 4.8s ease-in-out infinite;
        }

        .prn-orbit {
          position: absolute;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          animation: prnSpin 36s linear infinite;
        }

        .prn-orbit.one {
          width: 42rem;
          height: 42rem;
          left: -15rem;
          top: 8rem;
        }

        .prn-orbit.two {
          width: 34rem;
          height: 34rem;
          right: -12rem;
          top: 24rem;
          animation-direction: reverse;
          animation-duration: 29s;
        }

        .prn-orbit.three {
          width: 48rem;
          height: 48rem;
          left: 30%;
          bottom: -30rem;
          animation-duration: 44s;
        }

        .prn-orbit::after {
          content: "";
          position: absolute;
          left: 50%;
          top: -5px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--prn-cyan);
          box-shadow: 0 0 24px rgba(84, 232, 255, 0.95);
        }

        .prn-shell {
          position: relative;
          z-index: 2;
          width: min(1240px, calc(100% - 40px));
          margin: 0 auto;
          padding: 34px 0 76px;
        }

        .prn-hero {
          position: relative;
          display: grid;
          grid-template-columns: 1.16fr 0.84fr;
          align-items: center;
          gap: 44px;
          overflow: hidden;
          padding: 52px;
          border: 1px solid var(--prn-line);
          border-radius: 36px;
          background: rgba(4, 11, 22, 0.66);
          backdrop-filter: blur(24px);
          box-shadow: 0 30px 110px rgba(0, 0, 0, 0.42);
        }

        .prn-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 80% 25%, rgba(84,232,255,0.12), transparent 25%),
            radial-gradient(circle at 18% 82%, rgba(181,155,255,0.10), transparent 28%);
        }

        .prn-copy,
        .prn-visual {
          position: relative;
          z-index: 1;
        }

        .prn-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 9px 14px;
          border: 1px solid rgba(84,232,255,0.22);
          border-radius: 999px;
          color: #c9f7ff;
          background: rgba(84,232,255,0.07);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .prn-kicker::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--prn-cyan);
          box-shadow: 0 0 14px rgba(84,232,255,0.95);
          animation: prnPulse 2s ease-in-out infinite;
        }

        .prn-title {
          margin: 24px 0 20px;
          font-size: clamp(48px, 6.6vw, 82px);
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .prn-title span {
          display: block;
          color: transparent;
          background: linear-gradient(90deg, #aaf6ff, #ffffff 46%, #d3c5ff);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .prn-lead {
          max-width: 760px;
          margin: 0;
          color: #b8c7d8;
          font-size: 18px;
          line-height: 1.75;
        }

        .prn-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .prn-button {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          padding: 0 22px;
          border: 1px solid var(--prn-line);
          border-radius: 14px;
          color: white;
          background: rgba(255,255,255,0.045);
          text-decoration: none;
          font-weight: 850;
          transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
        }

        .prn-button.primary {
          color: #03100c;
          border-color: transparent;
          background: linear-gradient(90deg, var(--prn-cyan), #8cf0ff);
        }

        .prn-button:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.24);
          background: rgba(255,255,255,0.08);
        }

        .prn-button.primary:hover {
          background: linear-gradient(90deg, #8cf0ff, #c5f8ff);
        }

        .prn-visual {
          display: grid;
          place-items: center;
          aspect-ratio: 1;
          width: min(100%, 430px);
          margin: 0 auto;
        }

        .prn-ring {
          position: absolute;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%;
          animation: prnSpin 24s linear infinite;
        }

        .prn-ring.one { inset: 4%; border-color: rgba(84,232,255,0.22); }
        .prn-ring.two { inset: 16%; border-color: rgba(181,155,255,0.22); animation-direction: reverse; animation-duration: 18s; }
        .prn-ring.three { inset: 28%; border-color: rgba(255,214,110,0.22); animation-duration: 12s; }

        .prn-core {
          position: absolute;
          inset: 24%;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 50%;
          background:
            radial-gradient(circle at 35% 30%, #ffffff 0 2%, #54e8ff 4%, #0b4d78 34%, #05111f 70%);
          box-shadow:
            0 0 80px rgba(84,232,255,0.24),
            inset 0 0 36px rgba(255,255,255,0.16);
        }

        .prn-core img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .prn-core-fallback {
          text-align: center;
          font-weight: 950;
          letter-spacing: 0.11em;
          line-height: 1.35;
        }

        .prn-section {
          padding: 84px 0 0;
          scroll-margin-top: 100px;
        }

        .prn-network-grid {
          display: grid;
          grid-template-columns: minmax(270px, 0.68fr) minmax(0, 1.32fr);
          gap: 34px;
          align-items: start;
        }

        .prn-sticky {
          position: sticky;
          top: 28px;
        }

        .prn-eyebrow {
          color: var(--prn-cyan);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .prn-section-title {
          margin: 14px 0 14px;
          font-size: clamp(34px, 4.4vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.04em;
        }

        .prn-section-copy {
          margin: 0;
          color: var(--prn-muted);
          font-size: 16px;
          line-height: 1.75;
        }

        .prn-rule {
          margin-top: 28px;
          padding: 24px;
          border: 1px solid rgba(84,232,255,0.16);
          border-radius: 24px;
          background: rgba(84,232,255,0.045);
          backdrop-filter: blur(16px);
        }

        .prn-rule strong {
          display: block;
          margin-top: 12px;
          font-size: 21px;
          line-height: 1.45;
        }

        .prn-card-stack {
          display: grid;
          gap: 20px;
        }

        .prn-card {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--prn-line);
          border-radius: 28px;
          background: var(--prn-panel);
          backdrop-filter: blur(22px);
          box-shadow: 0 20px 70px rgba(0,0,0,0.26);
          transition: transform 220ms ease, border-color 220ms ease, background 220ms ease;
        }

        .prn-card:hover {
          transform: translateY(-3px);
          background: rgba(7, 15, 28, 0.90);
        }

        .prn-card.cyan { border-color: rgba(84,232,255,0.24); }
        .prn-card.violet { border-color: rgba(181,155,255,0.24); }
        .prn-card.amber { border-color: rgba(255,214,110,0.24); }

        .prn-card-main {
          padding: 28px;
        }

        .prn-card-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .prn-partner-id {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .prn-initials {
          display: grid;
          width: 56px;
          height: 56px;
          place-items: center;
          border: 1px solid var(--prn-line);
          border-radius: 17px;
          background: rgba(255,255,255,0.045);
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .prn-pathway {
          color: #7f92a8;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .prn-card h3 {
          margin: 5px 0 0;
          font-size: 26px;
          letter-spacing: -0.025em;
        }

        .prn-independent {
          padding: 7px 11px;
          border: 1px solid var(--prn-line);
          border-radius: 999px;
          color: #dce8f5;
          background: rgba(255,255,255,0.04);
          font-size: 11px;
          font-weight: 850;
        }

        .prn-status {
          display: inline-flex;
          margin-top: 22px;
          padding: 7px 11px;
          border: 1px solid rgba(255,214,110,0.20);
          border-radius: 999px;
          color: #ffe8a8;
          background: rgba(255,214,110,0.07);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.10em;
          text-transform: uppercase;
        }

        .prn-lane {
          margin: 18px 0 0;
          font-weight: 800;
          line-height: 1.55;
        }

        .prn-card.cyan .prn-lane { color: #aaf6ff; }
        .prn-card.violet .prn-lane { color: #d8ccff; }
        .prn-card.amber .prn-lane { color: #ffe4a1; }

        .prn-summary {
          margin: 14px 0 0;
          color: #b6c5d6;
          line-height: 1.72;
        }

        .prn-toggle {
          display: inline-flex;
          min-width: 290px;
          min-height: 48px;
          align-items: center;
          justify-content: space-between;
          margin-top: 22px;
          padding: 0 17px;
          border: 1px solid var(--prn-line);
          border-radius: 14px;
          color: white;
          background: rgba(255,255,255,0.04);
          font-weight: 850;
          cursor: pointer;
        }

        .prn-toggle:hover {
          background: rgba(255,255,255,0.07);
        }

        .prn-detail {
          overflow: hidden;
          border-top: 1px solid var(--prn-line);
          background: rgba(0,0,0,0.20);
        }

        .prn-detail-inner {
          display: grid;
          grid-template-columns: 0.86fr 1.14fr;
          gap: 28px;
          padding: 28px;
        }

        .prn-detail h4 {
          margin: 0 0 14px;
          color: var(--prn-cyan);
          font-size: 11px;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .prn-list {
          display: grid;
          gap: 10px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .prn-list li {
          position: relative;
          padding-left: 17px;
          color: #cad6e3;
          font-size: 14px;
          line-height: 1.55;
        }

        .prn-list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.62em;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--prn-cyan);
          box-shadow: 0 0 10px rgba(84,232,255,0.7);
        }

        .prn-box {
          padding: 18px;
          border: 1px solid var(--prn-line);
          border-radius: 17px;
          background: rgba(255,255,255,0.035);
        }

        .prn-box + .prn-box {
          margin-top: 12px;
        }

        .prn-box.amber {
          border-color: rgba(255,214,110,0.15);
          background: rgba(255,214,110,0.035);
        }

        .prn-box p {
          margin: 8px 0 0;
          color: #b4c4d4;
          font-size: 14px;
          line-height: 1.67;
        }

        .prn-detail-action {
          grid-column: 1 / -1;
          padding-top: 20px;
          border-top: 1px solid var(--prn-line);
        }

        .prn-architecture {
          padding: 34px;
          border: 1px solid var(--prn-line);
          border-radius: 32px;
          background: var(--prn-panel);
          backdrop-filter: blur(22px);
          box-shadow: 0 24px 90px rgba(0,0,0,0.26);
        }

        .prn-steps {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 34px;
        }

        .prn-step {
          padding: 22px;
          border: 1px solid var(--prn-line);
          border-radius: 20px;
          background: rgba(255,255,255,0.035);
        }

        .prn-step-number {
          display: grid;
          width: 46px;
          height: 46px;
          place-items: center;
          border: 1px solid rgba(84,232,255,0.22);
          border-radius: 14px;
          color: #c9f7ff;
          background: rgba(84,232,255,0.07);
          font-weight: 950;
        }

        .prn-step h3 {
          margin: 18px 0 9px;
          font-size: 19px;
        }

        .prn-step p {
          margin: 0;
          color: var(--prn-muted);
          font-size: 14px;
          line-height: 1.64;
        }

        .prn-chain {
          margin-top: 26px;
          padding: 28px;
          border: 1px solid rgba(84,232,255,0.16);
          border-radius: 24px;
          background:
            linear-gradient(135deg, rgba(84,232,255,0.07), rgba(181,155,255,0.05), rgba(255,214,110,0.04));
        }

        .prn-chain strong {
          display: block;
          margin-top: 14px;
          font-size: clamp(20px, 2.4vw, 30px);
          line-height: 1.5;
        }

        .prn-chain p {
          max-width: 900px;
          margin: 15px 0 0;
          color: #b8c6d5;
          line-height: 1.72;
        }

        .prn-principle {
          padding: 86px 20px 16px;
          text-align: center;
        }

        .prn-principle h2 {
          margin: 16px 0 0;
          font-size: clamp(42px, 6vw, 72px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .prn-principle h2 span {
          display: block;
          color: #aab9ca;
        }

        .prn-principle p {
          max-width: 850px;
          margin: 22px auto 0;
          color: var(--prn-muted);
          font-size: 17px;
          line-height: 1.75;
        }

        @keyframes prnSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes prnPulse {
          0%, 100% { opacity: 0.45; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes prnStar {
          0%, 100% { opacity: 0.18; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.25); }
        }

        @media (max-width: 980px) {
          .prn-hero,
          .prn-network-grid {
            grid-template-columns: 1fr;
          }

          .prn-sticky {
            position: relative;
            top: auto;
          }

          .prn-visual {
            max-width: 390px;
          }

          .prn-steps {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .prn-shell {
            width: min(100% - 24px, 1240px);
            padding-top: 16px;
          }

          .prn-hero,
          .prn-architecture {
            padding: 24px;
            border-radius: 24px;
          }

          .prn-title {
            font-size: 48px;
          }

          .prn-card-main,
          .prn-detail-inner {
            padding: 22px;
          }

          .prn-detail-inner,
          .prn-steps {
            grid-template-columns: 1fr;
          }

          .prn-card-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .prn-toggle {
            width: 100%;
            min-width: 0;
          }

          .prn-independent {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .prn-page *,
          .prn-page *::before,
          .prn-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="prn-page">
        <div className="prn-background" aria-hidden="true">
          <div className="prn-grid" />
          {stars.map((star, index) => (
            <span
              key={index}
              className="prn-star"
              style={{
                left: star.left,
                top: star.top,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: star.delay,
              }}
            />
          ))}
          <div className="prn-orbit one" />
          <div className="prn-orbit two" />
          <div className="prn-orbit three" />
        </div>

        <main className="prn-shell">
          <section className="prn-hero">
            <div className="prn-copy">
              <div className="prn-kicker">Independent Governance Network</div>

              <h1 className="prn-title">
                TA-14 Partner
                <span>Review Network</span>
              </h1>

              <p className="prn-lead">
                Independent architectures remain independent. Their specialized
                findings enter a written pathway, meet declared boundaries, and
                receive TA-14 second-layer admissible-execution review.
              </p>

              <div className="prn-actions">
                <a className="prn-button primary" href="#network">
                  Enter the Network
                </a>
                <a className="prn-button" href="#architecture">
                  See the Architecture
                </a>
              </div>
            </div>

            <div className="prn-visual" aria-label="TA-14 Partner Review Network">
              <div className="prn-ring one" />
              <div className="prn-ring two" />
              <div className="prn-ring three" />
              <div className="prn-core">
                <div className="prn-core-fallback">
                  TA-14
                  <br />
                  PARTNER
                  <br />
                  NETWORK
                </div>
              </div>
            </div>
          </section>

          <section id="network" className="prn-section">
            <div className="prn-network-grid">
              <div className="prn-sticky">
                <div className="prn-eyebrow">Current pathways</div>
                <h2 className="prn-section-title">
                  Three specialized governance lenses. One bounded network.
                </h2>
                <p className="prn-section-copy">
                  Each pathway declares what it reviews, what it contributes, and
                  what it does not prove. TA-14 does not absorb the partner
                  architecture. It reviews the consequence-bearing route around it.
                </p>

                <div className="prn-rule">
                  <div className="prn-eyebrow">Network rule</div>
                  <strong>
                    Independence is preserved. Boundaries are written. Claims stay
                    attached to evidence.
                  </strong>
                </div>
              </div>

              <div className="prn-card-stack">
                {partners.map((partner, index) => {
                  const open = openPartner === index;

                  return (
                    <article className={`prn-card ${partner.accent}`} key={partner.name}>
                      <div className="prn-card-main">
                        <div className="prn-card-head">
                          <div className="prn-partner-id">
                            <div className="prn-initials">{partner.initials}</div>
                            <div>
                              <div className="prn-pathway">
                                Pathway {String(index + 1).padStart(2, "0")}
                              </div>
                              <h3>{partner.name}</h3>
                            </div>
                          </div>
                          <span className="prn-independent">Independent</span>
                        </div>

                        <span className="prn-status">{partner.status}</span>
                        <p className="prn-lane">{partner.lane}</p>
                        <p className="prn-summary">{partner.summary}</p>

                        <button
                          className="prn-toggle"
                          type="button"
                          aria-expanded={open}
                          onClick={() => setOpenPartner(open ? null : index)}
                        >
                          <span>
                            {open ? "Close Governance View" : "Open Governance View"}
                          </span>
                          <span aria-hidden="true">{open ? "×" : "+"}</span>
                        </button>
                      </div>

                      {open && (
                        <div className="prn-detail">
                          <div className="prn-detail-inner">
                            <section>
                              <h4>Specialized review surfaces</h4>
                              <ul className="prn-list">
                                {partner.governs.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </section>

                            <section>
                              <div className="prn-box">
                                <h4>Network contribution</h4>
                                <p>{partner.contribution}</p>
                              </div>

                              <div className="prn-box amber">
                                <h4>Declared boundary</h4>
                                <p>{partner.boundary}</p>
                              </div>
                            </section>

                            <div className="prn-detail-action">
                              <a
                                className="prn-button primary"
                                href={partner.pathwayUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open Full Public Pathway
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="architecture" className="prn-section">
            <div className="prn-architecture">
              <div className="prn-eyebrow">Network architecture</div>
              <h2 className="prn-section-title">
                Specialized governance without architectural absorption
              </h2>

              <div className="prn-steps">
                {[
                  [
                    "01",
                    "Independent architecture",
                    "The partner preserves its own identity, methods, system, expertise, and review layer.",
                  ],
                  [
                    "02",
                    "Written boundary",
                    "The pathway states what is reviewed, what the evidence supports, and what remains outside scope.",
                  ],
                  [
                    "03",
                    "Specialized assessment",
                    "The partner reviews the governance surfaces inside its declared field of competence.",
                  ],
                  [
                    "04",
                    "TA-14 second layer",
                    "TA-14 reviews whether the larger consequence-bearing route supports admissible execution.",
                  ],
                ].map(([number, title, text]) => (
                  <article className="prn-step" key={number}>
                    <div className="prn-step-number">{number}</div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>

              <div className="prn-chain">
                <div className="prn-eyebrow">The TA-14 admissibility chain</div>
                <strong>
                  Reality → Record → Continuity → Admissibility → Binding → Commit
                  → Execution → Outcome
                </strong>
                <p>
                  A specialized review may be strong without being route-complete.
                  TA-14 asks whether the evidence, authority, binding, execution,
                  and formed outcome remain admissible across the entire route.
                </p>
              </div>
            </div>
          </section>

          <section className="prn-principle">
            <div className="prn-eyebrow">Network principle</div>
            <h2>
              No admissible evidence.
              <span>No admissible execution.</span>
            </h2>
            <p>
              The TA-14 Partner Review Network does not sell blanket approval. It
              preserves independence, written boundaries, evidence discipline, and
              second-layer scrutiny before stronger claims are permitted.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
