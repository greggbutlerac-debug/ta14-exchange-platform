"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

const workspaces = [
  {
    id: "ai",
    code: "AI",
    title: "AI Governance",
    href: "/workspace/ai-governance",
    description:
      "Build, test, correct, and verify consequential AI routes before they become execution.",
    color: "#60a9ff",
    glow: "rgba(74, 150, 255, 0.46)",
    world: "aiWorld",
    features: [
      "AI agents, models, tools, and APIs",
      "Authority, evidence, and commit gates",
      "Runtime decisions and outcome verification",
      "Execution routes with full integrity",
    ],
  },
  {
    id: "gr",
    code: "GR",
    title: "Governed Records",
    href: "/workspace/governed-records",
    description:
      "Create, upload, interpret, preserve, and review records without collapsing evidence into conclusion.",
    color: "#9ee648",
    glow: "rgba(147, 226, 60, 0.40)",
    world: "recordsWorld",
    features: [
      "Create and upload governed records",
      "Bounded interpretation and review",
      "Preserve uncertainty and limitations",
      "Export attributable evidence packages",
    ],
  },
  {
    id: "er",
    code: "ER",
    title: "Environmental Records",
    href: "/workspace/environmental-records",
    description:
      "Interpret land, water, air, building, hospital, HVAC, and sensor evidence through bounded environmental review.",
    color: "#5de2ec",
    glow: "rgba(59, 214, 225, 0.40)",
    world: "environmentWorld",
    features: [
      "Atmospheric and environmental integrity",
      "Buildings, IAQ, HVAC, and sensors",
      "Land, water, air, and outcome records",
      "Daily records with bounded interpretation",
    ],
  },
  {
    id: "entity",
    code: "◎",
    title: "Entity Review",
    href: "/workspace/entity-review",
    description:
      "Submit an organization, AI system, architecture, program, or route for independent governed review.",
    color: "#dc7dff",
    glow: "rgba(201, 92, 255, 0.42)",
    world: "entityWorld",
    features: [
      "Organizations and AI systems",
      "Architectures and governance programs",
      "Route reviews, findings, and boundaries",
      "Review status with clear outcomes",
    ],
  },
];

const chain = [
  ["Reality", "◉"],
  ["Record", "▤"],
  ["Continuity", "∞"],
  ["Admissibility", "⬡"],
  ["Binding", "⌁"],
  ["Commit", "◆"],
  ["Execution", "▷"],
  ["Outcome", "♛"],
];

const steps = [
  ["01", "Build and test", "Use AI Governance to examine consequential AI routes."],
  ["02", "Preserve the evidence", "Use Governed Records to create a bounded record."],
  ["03", "Review the whole entity", "Use Entity Review for organizations, systems, architectures, and routes."],
];

export default function HomePage() {
  return (
    <main>
      <div className="cosmos" aria-hidden="true">
        <div className="stars starsOne" />
        <div className="stars starsTwo" />
        <div className="stars starsThree" />
        <div className="governedRoutes">
          <i className="route routeOne" />
          <i className="route routeTwo" />
          <i className="route routeThree" />
        </div>
        <div className="orbitCluster orbitLeft">
          <span className="planet planetBlue" />
          <span className="planet planetGold" />
          <i className="orbit orbitA" />
          <i className="orbit orbitB" />
          <i className="orbit orbitC" />
        </div>
        <div className="orbitCluster orbitRight">
          <span className="planet planetGold large" />
          <span className="planet planetBlue small" />
          <i className="orbit orbitA" />
          <i className="orbit orbitB" />
          <i className="orbit orbitC" />
        </div>
        <div className="burst burstOne" />
        <div className="burst burstTwo" />
        <div className="ambient ambientOne" />
        <div className="ambient ambientTwo" />
      </div>

      <header className="topbar shell">
        <Link href="/" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>AI Governance Exchange</strong>
            <small>No admissible evidence. No admissible execution.</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Exchange</Link>
          <Link href="/workspace">Workspace</Link>
          <Link href="/workspace/ai-governance/eu-ai-act">EU AI Act</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/workspace/governed-records">Records</Link>
          <Link href="/workspace/verification">Verification</Link>
        </nav>

        <Link className="postButton" href="/marketplace/post">
          Post a Need
          <span>✦</span>
        </Link>
      </header>

      <section className="institution shell">
        <p>TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
        <div className="institutionRule">
          <i />
          <span>AI GOVERNANCE EXCHANGE</span>
          <i />
        </div>
      </section>

      <section className="hero shell">
        <p className="eyebrow">THE GRAND EXCHANGE HALL</p>
        <h1>
          Enter the governed workspace that matches <em>the consequence.</em>
        </h1>
        <p>
          Build, preserve, interpret, review, and verify consequential execution
          through workspaces that maintain clear evidence boundaries from reality
          through outcome.
        </p>
      </section>

      <section className="hall shell">
        <div className="hallGlow" aria-hidden="true" />
        <div className="doors">
          {workspaces.map((workspace) => (
            <Link
              href={workspace.href}
              className="workspace"
              key={workspace.id}
              style={
                {
                  "--accent": workspace.color,
                  "--accentGlow": workspace.glow,
                } as CSSProperties
              }
            >
              <div className="doorStage">
                <div className="portalHalo" />
                <div className="columns leftColumn">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="columns rightColumn">
                  <i />
                  <i />
                  <i />
                </div>

                <div className="archFrame">
                  <div className="archCrown">
                    <i className="crownLine one" />
                    <i className="crownLine two" />
                    <i className="crownLine three" />
                    <span className="crownGem" />
                  </div>

                  <div className="doorOpening">
                    <div className={`portalWorld ${workspace.world}`}>
                      <span className="worldGrid" />
                      <span className="worldOrb orbOne" />
                      <span className="worldOrb orbTwo" />
                      <span className="worldOrb orbThree" />
                      <span className="worldLine worldLineOne" />
                      <span className="worldLine worldLineTwo" />
                      <span className="worldLine worldLineThree" />
                      <span className="worldParticle p1" />
                      <span className="worldParticle p2" />
                      <span className="worldParticle p3" />
                      <span className="worldParticle p4" />
                      <span className="worldParticle p5" />
                    </div>
                    <div className="lightWithin" />
                    <div className="doorLeaf">
                      <div className="doorEmblem">
                        <span>{workspace.code}</span>
                      </div>
                      <div className="doorPanels">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                      <span className="doorHandle" />
                    </div>
                  </div>
                </div>

                <div className="steps">
                  <i />
                  <i />
                  <i />
                </div>

                <div className="lightSpill" />
                <div className="floorReflection" />
              </div>

              <div className="workspaceCard">
                <span className="miniCode">{workspace.code}</span>
                <h2>{workspace.title}</h2>
                <p>{workspace.description}</p>

                <ul>
                  {workspace.features.map((feature) => (
                    <li key={feature}>
                      <span>✧</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="workspaceCta">
                  Enter {workspace.title}
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="obsidianFloor" aria-hidden="true" />
      </section>

      <section className="governanceBand shell">
        <div className="chainBlock">
          <p className="bandEyebrow">ONE GOVERNING DISCIPLINE</p>
          <div className="chain">
            {chain.map(([label, icon], index) => (
              <div className="chainNode" key={label}>
                <span className="chainIcon">{icon}</span>
                <strong>{label}</strong>
                {index < chain.length - 1 && <i>→</i>}
              </div>
            ))}
          </div>
          <p>
            TA-14 separates reality, records, continuity, admissibility, binding,
            commit, execution, and outcome so each layer remains attributable and
            open to scrutiny.
          </p>
        </div>

        <div className="stepsBlock">
          {steps.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="euBlock">
          <div className="euShield">
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
          </div>
          <div>
            <p className="bandEyebrow">EU AI ACT</p>
            <h3>Relevant workflows live inside the relevant doors.</h3>
            <p>
              Enter AI Governance, Governed Records, or Entity Review to access
              requirements and supporting governance workflows.
            </p>
            <Link href="/workspace/ai-governance/eu-ai-act">
              Explore EU AI Act Workflows
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="closingSeal shell">
        <p>TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
        <div className="sealChain">
          {chain.map(([label], index) => (
            <span key={label}>
              {label}
              {index < chain.length - 1 && <i>→</i>}
            </span>
          ))}
        </div>
        <strong>No admissible evidence. No admissible execution.</strong>
      </section>

      <footer className="shell">
        <span>TA-14 AI Governance Exchange</span>
        <span>Architectural legibility without architectural assimilation.</span>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { background: #020711; }
        :global(body) {
          margin: 0;
          color: #f9fbff;
          background:
            radial-gradient(circle at 50% -8%, rgba(31, 100, 165, 0.2), transparent 34%),
            linear-gradient(180deg, #020711 0%, #07111e 48%, #030711 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        main {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .shell {
          width: min(1500px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 3;
        }

        .cosmos {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: -5;
        }

        .stars {
          position: absolute;
          inset: -12%;
        }

        .starsOne {
          background-image: radial-gradient(circle, rgba(255,255,255,.85) 0 1px, transparent 1.5px);
          background-size: 110px 110px;
          animation: starsOne 42s linear infinite;
        }

        .starsTwo {
          background-image: radial-gradient(circle, rgba(69,180,255,.72) 0 1px, transparent 1.5px);
          background-size: 170px 170px;
          background-position: 44px 67px;
          animation: starsTwo 56s linear infinite reverse;
        }

        .starsThree {
          background-image: radial-gradient(circle, rgba(255,190,65,.75) 0 1px, transparent 1.5px);
          background-size: 250px 250px;
          background-position: 90px 28px;
          opacity: .32;
          animation: pulseStars 7s ease-in-out infinite alternate;
        }

        .governedRoutes {
          position: absolute;
          inset: 0;
        }

        .route {
          position: absolute;
          height: 1px;
          width: 74vw;
          background: linear-gradient(90deg, transparent, rgba(90,190,255,.65), rgba(255,194,72,.52), transparent);
          filter: drop-shadow(0 0 8px rgba(90,190,255,.45));
        }

        .route::after {
          content: "";
          position: absolute;
          top: -3px;
          left: 25%;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #ffe7a5;
          box-shadow: 0 0 18px rgba(255, 211, 103, .9);
          animation: packet 6s linear infinite;
        }

        .routeOne { top: 24%; left: -15%; transform: rotate(-9deg); animation: lineOne 16s linear infinite; }
        .routeTwo { top: 60%; right: -20%; transform: rotate(11deg); animation: lineTwo 20s linear infinite; }
        .routeThree { top: 78%; left: 10%; transform: rotate(-4deg); animation: lineThree 24s linear infinite; }

        .orbitCluster { position: absolute; width: 360px; height: 240px; animation: drift 12s ease-in-out infinite alternate; }
        .orbitLeft { left: -30px; top: 70px; }
        .orbitRight { right: -40px; top: 80px; transform: scale(.9); animation-delay: -4s; }

        .orbit {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 120px;
          border: 1px solid rgba(255,181,47,.45);
          border-radius: 50%;
          transform: rotate(-12deg);
        }

        .orbitB { transform: rotate(13deg) scale(.82); opacity: .7; }
        .orbitC { transform: rotate(-28deg) scale(.62); opacity: .55; }

        .planet { position: absolute; z-index: 2; border-radius: 999px; }
        .planetBlue {
          left: 95px;
          top: 54px;
          width: 72px;
          height: 72px;
          background: radial-gradient(circle at 34% 30%, #d9f5ff, #3c97ff 24%, #0d2e76 58%, #06112c 75%);
          box-shadow: 0 0 28px rgba(67,152,255,.65);
        }
        .planetGold {
          left: 24px;
          top: 118px;
          width: 38px;
          height: 38px;
          background: radial-gradient(circle at 34% 30%, #fff4b2, #f5ad27 34%, #7c3604 70%);
          box-shadow: 0 0 22px rgba(255,173,39,.7);
        }
        .planetGold.large { left: 195px; top: 36px; width: 66px; height: 66px; }
        .planetBlue.small { left: 70px; top: 126px; width: 26px; height: 26px; }

        .ambient {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(70px);
          opacity: .16;
          animation: ambientBreath 9s ease-in-out infinite alternate;
        }

        .ambientOne { left: 12%; top: 34%; background: #0a69ff; }
        .ambientTwo { right: 10%; top: 42%; background: #ff9f1a; animation-delay: -3s; }

        .burst {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #fff0a6;
          box-shadow: 0 0 18px rgba(255,222,112,.95), 0 0 40px rgba(255,180,54,.55);
          transform: rotate(45deg);
          animation: burst 4.8s ease-in-out infinite;
        }

        .burst::before,
        .burst::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          background: linear-gradient(90deg, transparent, #ffe49a, transparent);
          transform: translate(-50%, -50%);
        }

        .burst::before { width: 82px; height: 1px; }
        .burst::after { width: 1px; height: 82px; }
        .burstOne { left: 48%; top: 16%; }
        .burstTwo { right: 8%; top: 24%; animation-delay: -2.1s; }

        .topbar {
          min-height: 72px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 24px;
          border-bottom: 1px solid rgba(92, 142, 174, 0.16);
        }

        .brand { display: flex; align-items: center; gap: 13px; color: white; text-decoration: none; }
        .brandMark {
          min-width: 76px;
          height: 42px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 194, 72, 0.75);
          color: #ffd166;
          font-weight: 950;
          letter-spacing: .06em;
          box-shadow: inset 0 0 16px rgba(255, 184, 50, 0.08), 0 0 18px rgba(255, 176, 38, .08);
        }

        .brand > span:last-child { display: flex; flex-direction: column; }
        .brand strong { font-size: 17px; }
        .brand small { margin-top: 3px; color: #ffcf67; font-size: 11px; }

        nav { display: flex; justify-content: center; gap: 28px; }
        nav a { color: #c5d3dc; text-decoration: none; font-size: 13px; font-weight: 800; }
        nav a:hover { color: white; }

        .postButton {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          gap: 16px;
          padding: 0 20px;
          border-radius: 999px;
          border: 1px solid rgba(255, 190, 64, 0.46);
          color: #ffe2a1;
          background: rgba(83, 55, 8, 0.18);
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          box-shadow: 0 0 20px rgba(255, 170, 31, 0.12);
        }

        .postButton span { color: #ffd15f; text-shadow: 0 0 16px rgba(255, 203, 82, 0.9); }

        .institution {
          padding-top: 22px;
          text-align: center;
        }

        .institution > p {
          margin: 0;
          color: #d6be86;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .34em;
        }

        .institutionRule {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
        }

        .institutionRule span {
          color: #ffe7b0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
          letter-spacing: .18em;
        }

        .institutionRule i {
          width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c78a22);
        }

        .institutionRule i:last-child {
          background: linear-gradient(90deg, #c78a22, transparent);
        }

        .hero {
          padding: 18px 0 12px;
          text-align: center;
        }

        .eyebrow,
        .bandEyebrow {
          margin: 0;
          color: #63d4ed;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .24em;
        }

        .hero h1 {
          max-width: 1100px;
          margin: 10px auto 8px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 5.4vw, 76px);
          line-height: .98;
          letter-spacing: -.045em;
          text-wrap: balance;
        }

        .hero h1 em { color: #ffc541; font-style: italic; text-shadow: 0 0 30px rgba(255, 184, 48, .16); }

        .hero > p:last-child {
          max-width: 900px;
          margin: 0 auto;
          color: #d1dde4;
          font-size: 16px;
          line-height: 1.55;
          text-wrap: balance;
        }

        .hall {
          margin-top: 10px;
          padding: 20px 12px 32px;
          border-radius: 28px;
          border: 1px solid rgba(255, 194, 74, .16);
          background:
            linear-gradient(180deg, rgba(7, 18, 30, .44), rgba(3, 8, 14, .18)),
            radial-gradient(circle at 50% 0%, rgba(255, 185, 57, .07), transparent 42%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.03), 0 30px 80px rgba(0,0,0,.26);
          overflow: hidden;
        }

        .hallGlow {
          position: absolute;
          left: 50%;
          top: -160px;
          width: 900px;
          height: 380px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(255, 200, 99, .12), transparent 68%);
          filter: blur(24px);
          pointer-events: none;
        }

        .doors {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          position: relative;
          z-index: 2;
        }

        .workspace { display: block; min-width: 0; color: inherit; text-decoration: none; }
        .doorStage { position: relative; height: 330px; overflow: visible; perspective: 1400px; }

        .portalHalo {
          position: absolute;
          left: 50%;
          top: 24px;
          width: 230px;
          height: 240px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(circle, var(--accentGlow), transparent 68%);
          filter: blur(22px);
          opacity: .42;
          transition: opacity 320ms ease, transform 500ms ease;
        }

        .archFrame {
          position: absolute;
          left: 50%;
          bottom: 54px;
          width: 192px;
          height: 230px;
          transform: translateX(-50%);
          border: 9px solid #b87b16;
          border-radius: 100px 100px 12px 12px;
          background:
            linear-gradient(90deg, #633604, #f1c869 17%, #a76510 50%, #f6d07a 82%, #5e3203),
            repeating-linear-gradient(100deg, rgba(255,255,255,.08) 0 2px, transparent 2px 8px);
          box-shadow:
            0 0 0 2px rgba(255, 222, 153, 0.5),
            0 0 30px rgba(255, 182, 45, 0.35),
            inset 0 0 18px rgba(255, 232, 180, 0.18);
          transition: transform 520ms cubic-bezier(.2,.75,.18,1), box-shadow 320ms ease;
        }

        .archFrame::before {
          content: "";
          position: absolute;
          left: -20px;
          right: -20px;
          top: 96px;
          height: 13px;
          background: linear-gradient(180deg, #f7d07a, #8c5109);
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(255, 197, 79, 0.35);
        }

        .archCrown {
          position: absolute;
          left: 50%;
          top: -23px;
          width: 126px;
          height: 80px;
          transform: translateX(-50%);
          border-radius: 76px 76px 14px 14px;
          border: 2px solid rgba(255, 224, 160, 0.5);
          background:
            radial-gradient(circle at 50% 70%, rgba(255, 221, 146, 0.16), transparent 56%),
            linear-gradient(180deg, #e2aa3b, #764005);
          overflow: hidden;
        }

        .crownLine {
          position: absolute;
          left: 50%;
          bottom: 4px;
          width: 2px;
          height: 68px;
          background: linear-gradient(180deg, #ffe4a5, #6f3702);
          transform-origin: bottom center;
        }

        .crownLine.one { transform: rotate(-28deg); }
        .crownLine.two { transform: rotate(0deg); }
        .crownLine.three { transform: rotate(28deg); }

        .crownGem {
          position: absolute;
          left: 50%;
          top: 10px;
          width: 21px;
          height: 21px;
          transform: translateX(-50%) rotate(45deg);
          border: 1px solid #ffe2a0;
          background: linear-gradient(135deg, #fff4bd, #f4ae24 55%, #7b3400);
          box-shadow: 0 0 16px rgba(255, 194, 65, 0.7);
        }

        .doorOpening {
          position: absolute;
          left: 10px;
          right: 10px;
          top: 10px;
          bottom: 8px;
          overflow: hidden;
          border-radius: 82px 82px 3px 3px;
          background: #07101b;
          box-shadow: inset 0 0 32px rgba(255, 246, 197, 0.28);
        }

        .portalWorld {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 44%, color-mix(in srgb, var(--accent) 44%, white), transparent 10%),
            radial-gradient(circle at 50% 54%, var(--accentGlow), transparent 46%),
            linear-gradient(180deg, #07111b 0%, #02080f 100%);
          opacity: .82;
        }

        .worldGrid {
          position: absolute;
          inset: 0;
          opacity: .22;
          background-image:
            linear-gradient(color-mix(in srgb, var(--accent) 42%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--accent) 42%, transparent) 1px, transparent 1px);
          background-size: 24px 24px;
          transform: perspective(260px) rotateX(58deg) scale(1.35);
          transform-origin: center bottom;
          animation: gridMove 10s linear infinite;
        }

        .worldOrb {
          position: absolute;
          border-radius: 999px;
          background: var(--accent);
          box-shadow: 0 0 18px var(--accentGlow);
          animation: worldFloat 5.5s ease-in-out infinite alternate;
        }

        .orbOne { width: 12px; height: 12px; left: 25%; top: 34%; }
        .orbTwo { width: 8px; height: 8px; right: 22%; top: 48%; animation-delay: -2s; }
        .orbThree { width: 6px; height: 6px; left: 48%; top: 22%; animation-delay: -3.4s; }

        .worldLine {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          filter: drop-shadow(0 0 5px var(--accentGlow));
          transform-origin: left center;
          animation: worldSweep 4.8s linear infinite;
        }

        .worldLineOne { width: 120px; left: 16px; top: 68px; transform: rotate(22deg); }
        .worldLineTwo { width: 132px; left: 28px; top: 110px; transform: rotate(-16deg); animation-delay: -1.4s; }
        .worldLineThree { width: 100px; left: 44px; top: 145px; transform: rotate(8deg); animation-delay: -2.8s; }

        .worldParticle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--accent) 82%, white);
          box-shadow: 0 0 10px var(--accentGlow);
          animation: particleRise 6s linear infinite;
        }

        .p1 { left: 18%; bottom: 8%; }
        .p2 { left: 36%; bottom: 0; animation-delay: -1.4s; }
        .p3 { left: 54%; bottom: 12%; animation-delay: -2.8s; }
        .p4 { left: 72%; bottom: 4%; animation-delay: -4.1s; }
        .p5 { left: 86%; bottom: 18%; animation-delay: -5.2s; }

        .recordsWorld .worldGrid { opacity: .12; background-size: 34px 18px; }
        .recordsWorld::after {
          content: "";
          position: absolute;
          inset: 30px 34px 44px;
          background:
            linear-gradient(180deg, rgba(255,255,255,.82), rgba(255,244,210,.62)),
            repeating-linear-gradient(180deg, transparent 0 10px, rgba(50,65,42,.18) 10px 11px);
          border-radius: 4px;
          transform: rotate(-4deg);
          opacity: .16;
          box-shadow: 20px 14px 0 rgba(255,255,255,.08), -14px 22px 0 rgba(255,255,255,.06);
        }

        .environmentWorld::before,
        .environmentWorld::after {
          content: "";
          position: absolute;
          left: -20%;
          width: 140%;
          height: 40px;
          border-radius: 50%;
          border-top: 2px solid color-mix(in srgb, var(--accent) 72%, transparent);
          filter: blur(2px);
          animation: airflow 5s ease-in-out infinite alternate;
        }

        .environmentWorld::before { top: 42%; transform: rotate(-8deg); }
        .environmentWorld::after { top: 62%; transform: rotate(9deg); animation-delay: -2s; }

        .entityWorld .worldGrid {
          opacity: .34;
          background-size: 18px 18px;
        }

        .entityWorld::after {
          content: "";
          position: absolute;
          inset: 34px 22px 48px;
          border: 1px solid color-mix(in srgb, var(--accent) 56%, transparent);
          clip-path: polygon(50% 0, 100% 25%, 88% 82%, 50% 100%, 12% 82%, 0 25%);
          box-shadow: inset 0 0 20px var(--accentGlow);
          animation: entityPulse 3.8s ease-in-out infinite alternate;
        }

        .lightWithin {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(255,255,255,.48), transparent 28%),
            radial-gradient(circle at 50% 48%, rgba(255,255,255,.42), transparent 36%);
          animation: lightPulse 2.6s ease-in-out infinite alternate;
        }

        .doorLeaf {
          position: absolute;
          inset: 0;
          transform-origin: left center;
          transform-style: preserve-3d;
          border-radius: 80px 80px 3px 3px;
          background:
            linear-gradient(98deg, rgba(255,255,255,.16), transparent 18%, transparent 78%, rgba(0,0,0,.28)),
            repeating-linear-gradient(96deg, rgba(255,255,255,.04) 0 2px, transparent 2px 7px),
            linear-gradient(90deg, #a9650e 0 18%, #d89c2b 18% 36%, #b97514 36% 52%, #dda431 52% 70%, #965708 70% 100%);
          border: 1px solid rgba(255, 227, 166, 0.5);
          box-shadow:
            inset 0 0 0 3px rgba(93, 51, 5, 0.35),
            inset 0 0 22px rgba(255, 222, 151, 0.12);
          transition: transform 650ms cubic-bezier(.16,.78,.16,1), box-shadow 320ms ease, filter 320ms ease;
          z-index: 2;
        }

        .doorLeaf::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(110deg, transparent 24%, rgba(255,255,255,.28) 42%, transparent 58%);
          transform: translateX(-130%);
          animation: bronzeSweep 7s ease-in-out infinite;
        }

        .doorEmblem {
          position: absolute;
          left: 50%;
          top: 30px;
          width: 78px;
          height: 78px;
          transform: translateX(-50%);
          border-radius: 999px;
          border: 5px solid #c78a20;
          background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 70%, #06111a), #09111a 72%);
          box-shadow: 0 0 0 2px rgba(255, 225, 157, 0.55), 0 0 24px var(--accentGlow);
          display: grid;
          place-items: center;
        }

        .doorEmblem span { color: #fff4c7; font-size: 29px; font-weight: 950; text-shadow: 0 0 14px var(--accentGlow); }

        .doorPanels {
          position: absolute;
          left: 22px;
          right: 22px;
          top: 126px;
          bottom: 22px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .doorPanels i {
          border: 2px solid rgba(101, 54, 5, 0.62);
          border-radius: 3px;
          box-shadow: inset 0 0 0 2px rgba(255, 214, 132, 0.12), inset 0 0 12px rgba(77, 36, 0, 0.22);
        }

        .doorHandle {
          position: absolute;
          right: 14px;
          top: 59%;
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: #fff0aa;
          box-shadow: 0 0 12px rgba(255, 231, 151, 0.85);
          transition: box-shadow 240ms ease, transform 240ms ease;
        }

        .columns {
          position: absolute;
          bottom: 48px;
          width: 30px;
          height: 190px;
          display: flex;
          gap: 2px;
          z-index: 3;
        }

        .leftColumn { left: calc(50% - 124px); }
        .rightColumn { right: calc(50% - 124px); }

        .columns i {
          flex: 1;
          border-radius: 4px;
          background: linear-gradient(90deg, #653704, #f0c96b 45%, #8b4e08 80%);
          box-shadow: 0 0 12px rgba(255, 189, 60, 0.25);
        }

        .steps {
          position: absolute;
          left: 50%;
          bottom: 18px;
          width: 260px;
          transform: translateX(-50%);
          display: grid;
          gap: 4px;
          z-index: 4;
        }

        .steps i {
          height: 10px;
          border-radius: 2px;
          background: linear-gradient(180deg, #e0aa44, #704000);
          box-shadow: 0 2px 8px rgba(255, 180, 39, 0.3);
        }

        .steps i:nth-child(2) { margin-inline: -12px; }
        .steps i:nth-child(3) { margin-inline: -24px; }

        .lightSpill {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 46px;
          height: 96px;
          transform: translateX(-50%) scaleX(.12);
          transform-origin: top center;
          clip-path: polygon(44% 0, 56% 0, 100% 100%, 0 100%);
          background: linear-gradient(180deg, rgba(255, 248, 205, .98), rgba(255, 185, 45, .62) 42%, transparent 100%);
          filter: blur(4px);
          opacity: 0;
          transition: transform 620ms cubic-bezier(.2,.75,.18,1), opacity 260ms ease;
          z-index: 1;
        }

        .floorReflection {
          position: absolute;
          left: 50%;
          bottom: -14px;
          width: 180px;
          height: 90px;
          transform: translateX(-50%) perspective(260px) rotateX(62deg);
          background: radial-gradient(ellipse, var(--accentGlow), transparent 68%);
          filter: blur(8px);
          opacity: .18;
          transition: opacity 320ms ease, transform 620ms ease;
        }

        .workspace:hover .doorLeaf,
        .workspace:focus-visible .doorLeaf {
          transform: rotateY(-46deg) translateX(-8px);
          box-shadow: 28px 0 44px rgba(255, 190, 57, 0.22);
          filter: saturate(1.1) brightness(1.06);
        }

        .workspace:hover .doorHandle,
        .workspace:focus-visible .doorHandle {
          transform: scale(1.25);
          box-shadow: 0 0 18px rgba(255, 240, 170, 1);
        }

        .workspace:hover .lightSpill,
        .workspace:focus-visible .lightSpill {
          opacity: 1;
          transform: translateX(-50%) scaleX(5.8);
        }

        .workspace:hover .portalHalo,
        .workspace:focus-visible .portalHalo {
          opacity: .85;
          transform: translateX(-50%) scale(1.1);
        }

        .workspace:hover .floorReflection,
        .workspace:focus-visible .floorReflection {
          opacity: .42;
          transform: translateX(-50%) perspective(260px) rotateX(62deg) scale(1.18);
        }

        .workspace:hover .archFrame,
        .workspace:focus-visible .archFrame {
          transform: translateX(-50%) translateY(-4px) scale(1.015);
          box-shadow:
            0 0 0 2px rgba(255, 222, 153, 0.68),
            0 0 48px rgba(255, 182, 45, 0.52),
            inset 0 0 18px rgba(255, 232, 180, 0.18);
        }

        .workspaceCard {
          min-height: 330px;
          margin-top: -6px;
          padding: 20px 20px 18px;
          border-radius: 18px;
          border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
          background:
            radial-gradient(circle at 50% 0%, var(--accentGlow), transparent 42%),
            linear-gradient(180deg, rgba(7, 18, 30, .96), rgba(4, 10, 18, .98));
          box-shadow: 0 14px 40px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.03);
          transition: transform 260ms ease, border-color 220ms ease, box-shadow 260ms ease;
        }

        .workspace:hover .workspaceCard,
        .workspace:focus-visible .workspaceCard {
          transform: translateY(-8px);
          border-color: var(--accent);
          box-shadow: 0 24px 54px rgba(0,0,0,.36), 0 0 32px var(--accentGlow);
        }

        .miniCode {
          display: inline-grid;
          place-items: center;
          min-width: 28px;
          height: 28px;
          padding: 0 7px;
          border-radius: 6px;
          border: 1px solid var(--accent);
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 10%, transparent);
          font-size: 12px;
          font-weight: 950;
          box-shadow: 0 0 12px var(--accentGlow);
        }

        .workspaceCard h2 {
          margin: 10px 0 6px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 27px;
          letter-spacing: -.025em;
        }

        .workspaceCard > p {
          min-height: 72px;
          margin: 0;
          color: color-mix(in srgb, var(--accent) 78%, white);
          line-height: 1.45;
        }

        .workspaceCard ul { display: grid; gap: 8px; margin: 16px 0 0; padding: 0; list-style: none; }
        .workspaceCard li {
          display: grid;
          grid-template-columns: 16px 1fr;
          gap: 8px;
          color: #d4e0e8;
          font-size: 12px;
          line-height: 1.4;
        }
        .workspaceCard li span { color: var(--accent); text-shadow: 0 0 10px var(--accentGlow); }

        .workspaceCta {
          min-height: 44px;
          margin-top: 16px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          border-radius: 9px;
          border: 1px solid var(--accent);
          color: color-mix(in srgb, var(--accent) 70%, white);
          background: color-mix(in srgb, var(--accent) 8%, transparent);
          box-shadow: inset 0 0 16px color-mix(in srgb, var(--accent) 8%, transparent);
          font-size: 12px;
          font-weight: 900;
        }

        .obsidianFloor {
          position: absolute;
          left: -6%;
          right: -6%;
          bottom: -120px;
          height: 260px;
          background:
            linear-gradient(180deg, rgba(7, 12, 18, .1), rgba(0,0,0,.78)),
            repeating-linear-gradient(90deg, transparent 0 119px, rgba(255,255,255,.025) 120px),
            repeating-linear-gradient(0deg, transparent 0 59px, rgba(255,255,255,.018) 60px);
          transform: perspective(700px) rotateX(66deg);
          transform-origin: center top;
          opacity: .7;
          z-index: 0;
        }

        .governanceBand {
          display: grid;
          grid-template-columns: 1.18fr .86fr 1fr;
          gap: 28px;
          margin-top: 20px;
          padding: 20px 24px;
          border-radius: 20px;
          border: 1px solid rgba(255, 185, 54, .32);
          background:
            radial-gradient(circle at 15% 0%, rgba(255, 172, 32, .07), transparent 35%),
            linear-gradient(180deg, rgba(6, 16, 27, .96), rgba(3, 9, 16, .98));
          box-shadow: 0 18px 50px rgba(0,0,0,.3);
        }

        .bandEyebrow { color: #ffc64e; letter-spacing: .12em; }

        .chain {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 2px;
          margin-top: 14px;
        }

        .chainNode { position: relative; text-align: center; }

        .chainIcon {
          width: 42px;
          height: 42px;
          margin: 0 auto 6px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: 2px solid #ffc345;
          color: #ffd87c;
          background: rgba(112, 69, 5, .16);
          box-shadow: 0 0 15px rgba(255, 184, 48, .18);
          font-size: 18px;
        }

        .chainNode strong { display: block; color: #ffd16b; font-size: 9px; }
        .chainNode i { position: absolute; right: -7px; top: 15px; color: #f6b62f; font-style: normal; }

        .chainBlock > p:last-child {
          margin: 12px 0 0;
          color: #aebdc7;
          font-size: 11px;
          line-height: 1.45;
          text-align: center;
        }

        .stepsBlock {
          display: grid;
          gap: 10px;
          padding-inline: 10px;
          border-left: 1px solid rgba(255,185,54,.18);
          border-right: 1px solid rgba(255,185,54,.18);
        }

        .stepsBlock article { display: grid; grid-template-columns: 42px 1fr; gap: 12px; align-items: start; }
        .stepsBlock article > span {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: 1px solid rgba(255, 190, 65, .52);
          color: #ffd168;
          font-size: 12px;
          font-weight: 900;
        }
        .stepsBlock strong { color: #f3f6f8; font-size: 13px; }
        .stepsBlock p { margin: 3px 0 0; color: #a6b6c0; font-size: 11px; line-height: 1.35; }

        .euBlock { display: grid; grid-template-columns: 94px 1fr; gap: 18px; align-items: center; }

        .euShield {
          width: 82px;
          height: 96px;
          position: relative;
          clip-path: polygon(50% 0, 92% 14%, 86% 74%, 50% 100%, 14% 74%, 8% 14%);
          border: 2px solid #ffc24a;
          background: linear-gradient(180deg, #16418f, #071b4a);
          box-shadow: 0 0 22px rgba(40, 111, 220, .3);
        }

        .euShield span { position: absolute; color: #ffd139; font-size: 11px; }
        .euShield span:nth-child(1) { left: 34px; top: 14px; }
        .euShield span:nth-child(2) { right: 16px; top: 28px; }
        .euShield span:nth-child(3) { right: 18px; bottom: 22px; }
        .euShield span:nth-child(4) { left: 34px; bottom: 12px; }
        .euShield span:nth-child(5) { left: 16px; bottom: 22px; }
        .euShield span:nth-child(6) { left: 14px; top: 28px; }

        .euBlock h3 { margin: 6px 0 5px; color: #f6f8fa; font-size: 15px; }
        .euBlock p:not(.bandEyebrow) { margin: 0; color: #aab9c3; font-size: 11px; line-height: 1.4; }

        .euBlock a {
          min-height: 34px;
          margin-top: 10px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          border-radius: 8px;
          border: 1px solid rgba(255, 190, 65, .54);
          color: #ffd273;
          background: rgba(112, 70, 5, .14);
          text-decoration: none;
          font-size: 11px;
          font-weight: 900;
        }

        .closingSeal {
          margin-top: 22px;
          padding: 26px 20px;
          text-align: center;
          border-radius: 20px;
          border: 1px solid rgba(255, 191, 67, .2);
          background: linear-gradient(180deg, rgba(10,18,28,.78), rgba(4,8,14,.88));
        }

        .closingSeal > p {
          margin: 0;
          color: #d4bd88;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .28em;
        }

        .sealChain {
          margin: 14px auto 12px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px 12px;
          color: #ffd06a;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 15px;
        }

        .sealChain span { display: inline-flex; align-items: center; gap: 12px; }
        .sealChain i { color: #b87818; font-style: normal; }
        .closingSeal strong { color: #f6e0a7; font-size: 14px; }

        footer {
          min-height: 78px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #718694;
          font-size: 11px;
        }

        @keyframes starsOne { from { transform: translate3d(0,0,0); } to { transform: translate3d(110px,145px,0); } }
        @keyframes starsTwo { from { transform: translate3d(0,0,0); } to { transform: translate3d(-120px,100px,0); } }
        @keyframes pulseStars { from { opacity: .18; transform: scale(.98); } to { opacity: .4; transform: scale(1.02); } }
        @keyframes lineOne { from { transform: translateX(-30vw) rotate(-9deg); opacity: 0; } 16% { opacity: .5; } 82% { opacity: .35; } to { transform: translateX(105vw) rotate(-9deg); opacity: 0; } }
        @keyframes lineTwo { from { transform: translateX(30vw) rotate(11deg); opacity: 0; } 18% { opacity: .45; } 85% { opacity: .3; } to { transform: translateX(-105vw) rotate(11deg); opacity: 0; } }
        @keyframes lineThree { from { transform: translateX(-50vw) rotate(-4deg); opacity: 0; } 20% { opacity: .38; } 82% { opacity: .28; } to { transform: translateX(90vw) rotate(-4deg); opacity: 0; } }
        @keyframes packet { from { transform: translateX(-20vw); opacity: 0; } 15% { opacity: 1; } 80% { opacity: 1; } to { transform: translateX(80vw); opacity: 0; } }
        @keyframes burst { 0%, 55%, 100% { transform: rotate(45deg) scale(.35); opacity: .15; } 66% { transform: rotate(45deg) scale(1.15); opacity: 1; } }
        @keyframes lightPulse { from { opacity: .42; } to { opacity: .86; } }
        @keyframes drift { from { translate: 0 0; } to { translate: 8px 12px; } }
        @keyframes ambientBreath { from { transform: scale(.92); opacity: .1; } to { transform: scale(1.08); opacity: .2; } }
        @keyframes gridMove { from { background-position: 0 0, 0 0; } to { background-position: 0 24px, 24px 0; } }
        @keyframes worldFloat { from { transform: translate3d(-4px, -6px, 0) scale(.9); } to { transform: translate3d(7px, 12px, 0) scale(1.15); } }
        @keyframes worldSweep { from { opacity: 0; translate: -30px 0; } 25% { opacity: .8; } 75% { opacity: .55; } to { opacity: 0; translate: 70px 0; } }
        @keyframes particleRise { from { transform: translateY(18px) scale(.7); opacity: 0; } 20% { opacity: .8; } 80% { opacity: .6; } to { transform: translateY(-170px) scale(1.2); opacity: 0; } }
        @keyframes bronzeSweep { 0%, 58% { transform: translateX(-130%); } 78%, 100% { transform: translateX(130%); } }
        @keyframes airflow { from { translate: -14px -4px; opacity: .28; } to { translate: 16px 6px; opacity: .7; } }
        @keyframes entityPulse { from { transform: scale(.94) rotate(-2deg); opacity: .35; } to { transform: scale(1.04) rotate(2deg); opacity: .75; } }

        @media (max-width: 1250px) {
          nav { display: none; }
          .topbar { grid-template-columns: 1fr auto; }
          .doors { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .governanceBand { grid-template-columns: 1fr; }
          .stepsBlock {
            border: 0;
            border-top: 1px solid rgba(255,185,54,.18);
            border-bottom: 1px solid rgba(255,185,54,.18);
            padding-block: 14px;
          }
          .chain { grid-template-columns: repeat(4, minmax(0, 1fr)); row-gap: 16px; }
          .chainNode i { display: none; }
        }

        @media (max-width: 700px) {
          .shell { width: min(100% - 20px, 1500px); }
          .brand small { display: none; }
          .postButton { padding: 0 14px; }
          .postButton span { display: none; }
          .institutionRule i { width: 46px; }
          .institutionRule span { font-size: 14px; letter-spacing: .1em; }
          .hero { padding-top: 24px; }
          .hero h1 { font-size: clamp(38px, 11vw, 58px); }
          .doors { grid-template-columns: 1fr; }
          .workspaceCard > p { min-height: auto; }
          .chain { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .euBlock { grid-template-columns: 1fr; }
          .sealChain { font-size: 13px; }
          footer {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 6px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 1ms !important;
          }
        }
      `}</style>
    </main>
  );
}
