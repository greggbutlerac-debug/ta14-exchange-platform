"use client";

import Link from "next/link";

const workspaces = [
  {
    id: "ai",
    code: "AI",
    title: "AI Governance",
    href: "/workspace/ai-governance",
    description:
      "Build, test, correct, and verify consequential AI routes before they become execution.",
    color: "#60a9ff",
    glow: "rgba(74, 150, 255, 0.42)",
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
    glow: "rgba(147, 226, 60, 0.36)",
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
    glow: "rgba(59, 214, 225, 0.36)",
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
    glow: "rgba(201, 92, 255, 0.38)",
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
        <div className="line lineOne" />
        <div className="line lineTwo" />
        <div className="line lineThree" />
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
          <Link className="navActive" href="/workspace/ai-governance/eu-ai-act">
            EU AI Act
          </Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/workspace/governed-records">Records</Link>
          <Link href="/workspace/verification">Verification</Link>
        </nav>

        <Link className="postButton" href="/marketplace/post">
          Post a Need
          <span>✦</span>
        </Link>
      </header>

      <section className="hero shell">
        <p className="eyebrow">TA-14 AI GOVERNANCE EXCHANGE</p>
        <h1>
          Choose the door that matches <em>the work.</em>
        </h1>
        <p>
          Four governed workspaces. Each preserves its own evidence boundary,
          purpose, and review path.
        </p>
      </section>

      <section className="doors shell">
        {workspaces.map((workspace) => (
          <Link
            href={workspace.href}
            className="workspace"
            key={workspace.id}
            style={
              {
                "--accent": workspace.color,
                "--accentGlow": workspace.glow,
              } as React.CSSProperties
            }
          >
            <div className="doorStage">
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
            TA-14 separates records, interpretations, determinations, and execution
            so each layer remains attributable and open to scrutiny.
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

      <section className="frontDoor shell">
        <p>START AT THE FRONT DOOR</p>
        <div>
          <i />
          <span>Choose the workspace that matches what you are bringing.</span>
          <i />
        </div>
      </section>

      <footer className="shell">
        <strong>TA-14 Authority Governance Institution</strong>
        <span>No admissible evidence. No admissible execution.</span>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #020711;
        }

        :global(body) {
          margin: 0;
          color: #f9fbff;
          background:
            radial-gradient(circle at 50% -8%, rgba(31, 100, 165, 0.2), transparent 34%),
            linear-gradient(180deg, #020711 0%, #07111e 48%, #030711 100%);
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

        .line {
          position: absolute;
          height: 1px;
          width: 70vw;
          background: linear-gradient(90deg, transparent, rgba(90,190,255,.55), transparent);
          filter: drop-shadow(0 0 8px rgba(90,190,255,.45));
        }

        .lineOne {
          top: 24%;
          left: -15%;
          transform: rotate(-9deg);
          animation: lineOne 16s linear infinite;
        }

        .lineTwo {
          top: 60%;
          right: -20%;
          transform: rotate(11deg);
          animation: lineTwo 20s linear infinite;
        }

        .lineThree {
          top: 78%;
          left: 10%;
          transform: rotate(-4deg);
          animation: lineThree 24s linear infinite;
        }

        .orbitCluster {
          position: absolute;
          width: 360px;
          height: 240px;
        }

        .orbitLeft {
          left: -30px;
          top: 70px;
        }

        .orbitRight {
          right: -40px;
          top: 80px;
          transform: scale(.9);
        }

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

        .orbitB {
          transform: rotate(13deg) scale(.82);
          opacity: .7;
        }

        .orbitC {
          transform: rotate(-28deg) scale(.62);
          opacity: .55;
        }

        .planet {
          position: absolute;
          z-index: 2;
          border-radius: 999px;
        }

        .planetBlue {
          left: 95px;
          top: 54px;
          width: 72px;
          height: 72px;
          background:
            radial-gradient(circle at 34% 30%, #d9f5ff, #3c97ff 24%, #0d2e76 58%, #06112c 75%);
          box-shadow: 0 0 28px rgba(67,152,255,.65);
        }

        .planetGold {
          left: 24px;
          top: 118px;
          width: 38px;
          height: 38px;
          background:
            radial-gradient(circle at 34% 30%, #fff4b2, #f5ad27 34%, #7c3604 70%);
          box-shadow: 0 0 22px rgba(255,173,39,.7);
        }

        .planetGold.large {
          left: 195px;
          top: 36px;
          width: 66px;
          height: 66px;
        }

        .planetBlue.small {
          left: 70px;
          top: 126px;
          width: 26px;
          height: 26px;
        }

        .burst {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #fff0a6;
          box-shadow:
            0 0 18px rgba(255,222,112,.95),
            0 0 40px rgba(255,180,54,.55);
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

        .burst::before {
          width: 82px;
          height: 1px;
        }

        .burst::after {
          width: 1px;
          height: 82px;
        }

        .burstOne {
          left: 48%;
          top: 16%;
        }

        .burstTwo {
          right: 8%;
          top: 24%;
          animation-delay: -2.1s;
        }

        .topbar {
          min-height: 70px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 24px;
          border-bottom: 1px solid rgba(92, 142, 174, 0.16);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
          color: white;
          text-decoration: none;
        }

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
          box-shadow: inset 0 0 16px rgba(255, 184, 50, 0.08);
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand strong {
          font-size: 17px;
        }

        .brand small {
          margin-top: 3px;
          color: #ffcf67;
          font-size: 11px;
        }

        nav {
          display: flex;
          justify-content: center;
          gap: 28px;
        }

        nav a {
          color: #c5d3dc;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
        }

        nav a:hover {
          color: white;
        }

        .navActive {
          padding: 12px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 190, 64, 0.38);
          color: #ffd273 !important;
          background: rgba(112, 74, 10, 0.12);
        }

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

        .postButton span {
          color: #ffd15f;
          text-shadow: 0 0 16px rgba(255, 203, 82, 0.9);
        }

        .hero {
          padding: 22px 0 10px;
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
          margin: 8px 0 6px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(40px, 5.6vw, 72px);
          line-height: .98;
          letter-spacing: -.04em;
        }

        .hero h1 em {
          color: #ffc541;
          font-style: italic;
        }

        .hero > p:last-child {
          margin: 0;
          color: #d1dde4;
          font-size: 16px;
        }

        .doors {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-top: 16px;
        }

        .workspace {
          display: block;
          min-width: 0;
          color: inherit;
          text-decoration: none;
        }

        .doorStage {
          position: relative;
          height: 285px;
          overflow: visible;
          perspective: 1100px;
        }

        .archFrame {
          position: absolute;
          left: 50%;
          bottom: 42px;
          width: 176px;
          height: 205px;
          transform: translateX(-50%);
          border: 8px solid #b87b16;
          border-radius: 92px 92px 10px 10px;
          background:
            linear-gradient(90deg, #6c3e05, #f0bd54 18%, #9c5d0c 50%, #f1bf55 82%, #653804);
          box-shadow:
            0 0 0 2px rgba(255, 222, 153, 0.5),
            0 0 26px rgba(255, 182, 45, 0.35),
            inset 0 0 18px rgba(255, 232, 180, 0.18);
        }

        .archFrame::before {
          content: "";
          position: absolute;
          left: -18px;
          right: -18px;
          top: 84px;
          height: 12px;
          background: linear-gradient(180deg, #f4c968, #8c5109);
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(255, 197, 79, 0.35);
        }

        .archCrown {
          position: absolute;
          left: 50%;
          top: -20px;
          width: 116px;
          height: 74px;
          transform: translateX(-50%);
          border-radius: 70px 70px 14px 14px;
          border: 2px solid rgba(255, 224, 160, 0.5);
          background:
            radial-gradient(circle at 50% 70%, rgba(255, 221, 146, 0.16), transparent 56%),
            linear-gradient(180deg, #d89a28, #7d4305);
          overflow: hidden;
        }

        .crownLine {
          position: absolute;
          left: 50%;
          bottom: 4px;
          width: 2px;
          height: 62px;
          background: linear-gradient(180deg, #ffe4a5, #6f3702);
          transform-origin: bottom center;
        }

        .crownLine.one {
          transform: rotate(-28deg);
        }

        .crownLine.two {
          transform: rotate(0deg);
        }

        .crownLine.three {
          transform: rotate(28deg);
        }

        .crownGem {
          position: absolute;
          left: 50%;
          top: 10px;
          width: 20px;
          height: 20px;
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
          border-radius: 74px 74px 2px 2px;
          background:
            radial-gradient(circle at 50% 42%, #fff6c6 0%, #ffc44d 32%, #a84e03 64%, #321300 100%);
          box-shadow: inset 0 0 32px rgba(255, 246, 197, 0.5);
        }

        .lightWithin {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(255,255,255,.65), transparent 30%),
            radial-gradient(circle at 50% 48%, rgba(255,255,255,.76), transparent 36%);
          animation: lightPulse 2.6s ease-in-out infinite alternate;
        }

        .doorLeaf {
          position: absolute;
          inset: 0;
          transform-origin: left center;
          transform-style: preserve-3d;
          border-radius: 72px 72px 2px 2px;
          background:
            linear-gradient(90deg, rgba(255,255,255,.08), transparent 18%, transparent 82%, rgba(0,0,0,.22)),
            linear-gradient(90deg, #b97514 0 18%, #d49523 18% 36%, #b97514 36% 52%, #d49523 52% 70%, #a8630d 70% 100%);
          border: 1px solid rgba(255, 227, 166, 0.5);
          box-shadow:
            inset 0 0 0 3px rgba(93, 51, 5, 0.35),
            inset 0 0 22px rgba(255, 222, 151, 0.12);
          transition:
            transform 520ms cubic-bezier(.2,.75,.18,1),
            box-shadow 280ms ease;
          z-index: 2;
        }

        .doorEmblem {
          position: absolute;
          left: 50%;
          top: 28px;
          width: 74px;
          height: 74px;
          transform: translateX(-50%);
          border-radius: 999px;
          border: 5px solid #c78a20;
          background:
            radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 70%, #06111a), #09111a 72%);
          box-shadow:
            0 0 0 2px rgba(255, 225, 157, 0.55),
            0 0 22px var(--accentGlow);
          display: grid;
          place-items: center;
        }

        .doorEmblem span {
          color: #fff4c7;
          font-size: 28px;
          font-weight: 950;
          text-shadow: 0 0 14px var(--accentGlow);
        }

        .doorPanels {
          position: absolute;
          left: 22px;
          right: 22px;
          top: 115px;
          bottom: 20px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 9px;
        }

        .doorPanels i {
          border: 2px solid rgba(101, 54, 5, 0.62);
          border-radius: 3px;
          box-shadow:
            inset 0 0 0 2px rgba(255, 214, 132, 0.12),
            inset 0 0 12px rgba(77, 36, 0, 0.22);
        }

        .doorHandle {
          position: absolute;
          right: 14px;
          top: 58%;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #fff0aa;
          box-shadow: 0 0 10px rgba(255, 231, 151, 0.85);
        }

        .columns {
          position: absolute;
          bottom: 38px;
          width: 26px;
          height: 170px;
          display: flex;
          gap: 2px;
          z-index: 3;
        }

        .leftColumn {
          left: calc(50% - 112px);
        }

        .rightColumn {
          right: calc(50% - 112px);
        }

        .columns i {
          flex: 1;
          border-radius: 4px;
          background:
            linear-gradient(90deg, #6c3a04, #e8b64f 45%, #8b4e08 80%);
          box-shadow: 0 0 10px rgba(255, 189, 60, 0.25);
        }

        .steps {
          position: absolute;
          left: 50%;
          bottom: 16px;
          width: 236px;
          transform: translateX(-50%);
          display: grid;
          gap: 4px;
          z-index: 4;
        }

        .steps i {
          height: 9px;
          border-radius: 2px;
          background: linear-gradient(180deg, #d79b2e, #704000);
          box-shadow: 0 2px 8px rgba(255, 180, 39, 0.3);
        }

        .steps i:nth-child(2) {
          margin-inline: -10px;
        }

        .steps i:nth-child(3) {
          margin-inline: -20px;
        }

        .lightSpill {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 40px;
          height: 74px;
          transform: translateX(-50%) scaleX(.15);
          transform-origin: top center;
          clip-path: polygon(44% 0, 56% 0, 100% 100%, 0 100%);
          background: linear-gradient(180deg, rgba(255, 248, 205, .94), rgba(255, 185, 45, .56) 42%, transparent 100%);
          filter: blur(3px);
          opacity: 0;
          transition:
            transform 500ms cubic-bezier(.2,.75,.18,1),
            opacity 260ms ease;
          z-index: 1;
        }

        .workspace:hover .doorLeaf,
        .workspace:focus-visible .doorLeaf {
          transform: rotateY(-28deg) translateX(-5px);
          box-shadow: 20px 0 34px rgba(255, 190, 57, 0.2);
        }

        .workspace:hover .lightSpill,
        .workspace:focus-visible .lightSpill {
          opacity: 1;
          transform: translateX(-50%) scaleX(4.7);
        }

        .workspace:hover .archFrame,
        .workspace:focus-visible .archFrame {
          box-shadow:
            0 0 0 2px rgba(255, 222, 153, 0.65),
            0 0 42px rgba(255, 182, 45, 0.5),
            inset 0 0 18px rgba(255, 232, 180, 0.18);
        }

        .workspaceCard {
          min-height: 330px;
          margin-top: -2px;
          padding: 20px 20px 18px;
          border-radius: 16px;
          border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
          background:
            radial-gradient(circle at 50% 0%, var(--accentGlow), transparent 42%),
            linear-gradient(180deg, rgba(7, 18, 30, .96), rgba(4, 10, 18, .98));
          box-shadow:
            0 14px 40px rgba(0,0,0,.28),
            inset 0 1px 0 rgba(255,255,255,.03);
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease;
        }

        .workspace:hover .workspaceCard,
        .workspace:focus-visible .workspaceCard {
          transform: translateY(-5px);
          border-color: var(--accent);
          box-shadow:
            0 22px 50px rgba(0,0,0,.34),
            0 0 30px var(--accentGlow);
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

        .workspaceCard ul {
          display: grid;
          gap: 8px;
          margin: 16px 0 0;
          padding: 0;
          list-style: none;
        }

        .workspaceCard li {
          display: grid;
          grid-template-columns: 16px 1fr;
          gap: 8px;
          color: #d4e0e8;
          font-size: 12px;
          line-height: 1.4;
        }

        .workspaceCard li span {
          color: var(--accent);
          text-shadow: 0 0 10px var(--accentGlow);
        }

        .workspaceCta {
          min-height: 42px;
          margin-top: 16px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          border-radius: 8px;
          border: 1px solid var(--accent);
          color: color-mix(in srgb, var(--accent) 70%, white);
          background: color-mix(in srgb, var(--accent) 8%, transparent);
          box-shadow: inset 0 0 16px color-mix(in srgb, var(--accent) 8%, transparent);
          font-size: 12px;
          font-weight: 900;
        }

        .governanceBand {
          display: grid;
          grid-template-columns: 1.12fr .9fr 1fr;
          gap: 28px;
          margin-top: 18px;
          padding: 18px 24px;
          border-radius: 20px;
          border: 1px solid rgba(255, 185, 54, .32);
          background:
            radial-gradient(circle at 15% 0%, rgba(255, 172, 32, .07), transparent 35%),
            linear-gradient(180deg, rgba(6, 16, 27, .96), rgba(3, 9, 16, .98));
          box-shadow: 0 18px 50px rgba(0,0,0,.3);
        }

        .bandEyebrow {
          color: #ffc64e;
          letter-spacing: .12em;
        }

        .chain {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 4px;
          margin-top: 12px;
        }

        .chainNode {
          position: relative;
          text-align: center;
        }

        .chainIcon {
          width: 46px;
          height: 46px;
          margin: 0 auto 6px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: 2px solid #ffc345;
          color: #ffd87c;
          background: rgba(112, 69, 5, .16);
          box-shadow: 0 0 15px rgba(255, 184, 48, .18);
          font-size: 20px;
        }

        .chainNode strong {
          display: block;
          color: #ffd16b;
          font-size: 10px;
        }

        .chainNode i {
          position: absolute;
          right: -8px;
          top: 18px;
          color: #f6b62f;
          font-style: normal;
        }

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

        .stepsBlock article {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 12px;
          align-items: start;
        }

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

        .stepsBlock strong {
          color: #f3f6f8;
          font-size: 13px;
        }

        .stepsBlock p {
          margin: 3px 0 0;
          color: #a6b6c0;
          font-size: 11px;
          line-height: 1.35;
        }

        .euBlock {
          display: grid;
          grid-template-columns: 94px 1fr;
          gap: 18px;
          align-items: center;
        }

        .euShield {
          width: 82px;
          height: 96px;
          position: relative;
          clip-path: polygon(50% 0, 92% 14%, 86% 74%, 50% 100%, 14% 74%, 8% 14%);
          border: 2px solid #ffc24a;
          background: linear-gradient(180deg, #16418f, #071b4a);
          box-shadow: 0 0 22px rgba(40, 111, 220, .3);
        }

        .euShield span {
          position: absolute;
          color: #ffd139;
          font-size: 11px;
        }

        .euShield span:nth-child(1) { left: 34px; top: 14px; }
        .euShield span:nth-child(2) { right: 16px; top: 28px; }
        .euShield span:nth-child(3) { right: 18px; bottom: 22px; }
        .euShield span:nth-child(4) { left: 34px; bottom: 12px; }
        .euShield span:nth-child(5) { left: 16px; bottom: 22px; }
        .euShield span:nth-child(6) { left: 14px; top: 28px; }

        .euBlock h3 {
          margin: 6px 0 5px;
          color: #f6f8fa;
          font-size: 15px;
        }

        .euBlock p:not(.bandEyebrow) {
          margin: 0;
          color: #aab9c3;
          font-size: 11px;
          line-height: 1.4;
        }

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

        .frontDoor {
          padding: 16px 0 8px;
          text-align: center;
        }

        .frontDoor > p {
          margin: 0;
          color: #63d4ed;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .32em;
        }

        .frontDoor > div {
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: #c3d0d8;
          font-size: 12px;
        }

        .frontDoor i {
          width: 96px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #ffc03d);
        }

        .frontDoor i:last-child {
          background: linear-gradient(90deg, #ffc03d, transparent);
        }

        footer {
          min-height: 78px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #718694;
          font-size: 11px;
        }

        footer strong {
          color: #94a8b4;
        }

        @keyframes starsOne {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(110px,145px,0); }
        }

        @keyframes starsTwo {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(-120px,100px,0); }
        }

        @keyframes pulseStars {
          from { opacity: .18; transform: scale(.98); }
          to { opacity: .4; transform: scale(1.02); }
        }

        @keyframes lineOne {
          from { transform: translateX(-30vw) rotate(-9deg); opacity: 0; }
          16% { opacity: .5; }
          82% { opacity: .35; }
          to { transform: translateX(105vw) rotate(-9deg); opacity: 0; }
        }

        @keyframes lineTwo {
          from { transform: translateX(30vw) rotate(11deg); opacity: 0; }
          18% { opacity: .45; }
          85% { opacity: .3; }
          to { transform: translateX(-105vw) rotate(11deg); opacity: 0; }
        }

        @keyframes lineThree {
          from { transform: translateX(-50vw) rotate(-4deg); opacity: 0; }
          20% { opacity: .38; }
          82% { opacity: .28; }
          to { transform: translateX(90vw) rotate(-4deg); opacity: 0; }
        }

        @keyframes burst {
          0%, 55%, 100% { transform: rotate(45deg) scale(.35); opacity: .15; }
          66% { transform: rotate(45deg) scale(1.15); opacity: 1; }
        }

        @keyframes lightPulse {
          from { opacity: .48; }
          to { opacity: .88; }
        }

        @media (max-width: 1200px) {
          nav {
            display: none;
          }

          .topbar {
            grid-template-columns: 1fr auto;
          }

          .doors {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .governanceBand {
            grid-template-columns: 1fr;
          }

          .stepsBlock {
            border: 0;
            border-top: 1px solid rgba(255,185,54,.18);
            border-bottom: 1px solid rgba(255,185,54,.18);
            padding-block: 14px;
          }
        }

        @media (max-width: 700px) {
          .shell {
            width: min(100% - 20px, 1500px);
          }

          .brand small {
            display: none;
          }

          .postButton {
            padding: 0 14px;
          }

          .postButton span {
            display: none;
          }

          .hero {
            padding-top: 30px;
          }

          .doors {
            grid-template-columns: 1fr;
          }

          .workspaceCard > p {
            min-height: auto;
          }

          .chain {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            row-gap: 14px;
          }

          .chainNode i {
            display: none;
          }

          .euBlock {
            grid-template-columns: 1fr;
          }

          footer {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 6px;
          }
        }
      `}</style>
    </main>
  );
}
