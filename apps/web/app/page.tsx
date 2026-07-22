"use client";

import Link from "next/link";

const workspaces = [
  {
    id: "ai-governance",
    code: "AI",
    title: "AI Governance",
    href: "/workspace/ai-governance",
    description:
      "Build, test, correct, and verify consequential AI routes before they become execution.",
    points: [
      "Agents, models, tools, and APIs",
      "Authority, evidence, and commit gates",
      "Runtime decisions and outcome verification",
    ],
  },
  {
    id: "governed-records",
    code: "GR",
    title: "Governed Records",
    href: "/workspace/governed-records",
    description:
      "Create, upload, interpret, preserve, and review records without collapsing evidence into conclusion.",
    points: [
      "Create and upload governed records",
      "Preserve uncertainty and limitations",
      "Export attributable evidence packages",
    ],
  },
  {
    id: "environmental-records",
    code: "ER",
    title: "Environmental Records",
    href: "/workspace/environmental-records",
    description:
      "Interpret land, water, air, building, hospital, HVAC, and sensor evidence through bounded environmental review.",
    points: [
      "Atmospheric and environmental integrity",
      "Buildings, IAQ, HVAC, and sensors",
      "Land, water, air, and outcome records",
    ],
  },
  {
    id: "entity-review",
    code: "◎",
    title: "Entity Review",
    href: "/workspace/entity-review",
    description:
      "Submit an organization, AI system, architecture, program, or route for independent governed review.",
    points: [
      "Organizations and AI systems",
      "Architectures and governance programs",
      "Review findings, status, and boundaries",
    ],
  },
];

const discipline = [
  {
    number: "01",
    title: "Build and test",
    text: "Use AI Governance to examine consequential routes, inputs, authorities, failure states, and outcomes.",
  },
  {
    number: "02",
    title: "Preserve the evidence",
    text: "Use Governed Records to keep the original record distinct from interpretation and determination.",
  },
  {
    number: "03",
    title: "Interpret the environment",
    text: "Use Environmental Records to examine land, water, air, buildings, HVAC, hospitals, and sensor evidence.",
  },
  {
    number: "04",
    title: "Review the whole entity",
    text: "Use Entity Review when the object under scrutiny is an organization, system, architecture, or route.",
  },
];

export default function HomePage() {
  return (
    <main>
      <div className="cosmos" aria-hidden="true">
        <div className="starField starsOne" />
        <div className="starField starsTwo" />
        <div className="starField starsThree" />

        <div className="movingLine lineOne" />
        <div className="movingLine lineTwo" />
        <div className="movingLine lineThree" />

        <div className="burst burstOne">
          {Array.from({ length: 12 }).map((_, index) => (
            <i key={index} style={{ "--i": index } as React.CSSProperties} />
          ))}
        </div>

        <div className="burst burstTwo">
          {Array.from({ length: 10 }).map((_, index) => (
            <i key={index} style={{ "--i": index } as React.CSSProperties} />
          ))}
        </div>

        <div className="orbitSystem orbitSystemOne">
          <div className="orbit orbitA">
            <span />
          </div>
          <div className="orbit orbitB">
            <span />
          </div>
          <div className="orbitCore" />
        </div>

        <div className="orbitSystem orbitSystemTwo">
          <div className="orbit orbitA">
            <span />
          </div>
          <div className="orbit orbitB">
            <span />
          </div>
          <div className="orbitCore" />
        </div>

        <div className="floatingSphere sphereOne" />
        <div className="floatingSphere sphereTwo" />
        <div className="floatingSphere sphereThree" />
      </div>

      <header className="topbar shell">
        <Link href="/" className="brand">
          <span className="brandMark">TA-14</span>
          <span className="brandText">
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
          <Link href="/marketplace/post">Post a Need</Link>
        </nav>

        <Link href="/workspace" className="workspaceButton">
          Open Workspace
          <span>→</span>
        </Link>
      </header>

      <section className="hero shell">
        <div className="heroBadge">
          <span>TA-14</span>
          <strong>AI Governance Exchange</strong>
        </div>

        <p className="eyebrow">THE FRONT DOOR TO GOVERNED WORK</p>

        <h1>Choose the door that matches what you are bringing.</h1>

        <p className="lead">
          Four governed workspaces. Each one preserves its own evidence
          boundary, purpose, and review path so records, interpretation,
          determination, optimization, and execution do not corrupt one
          another.
        </p>

        <div className="heroActions">
          <a className="primaryButton" href="#doors">
            Open a Door
            <span>↓</span>
          </a>

          <Link className="secondaryButton" href="/workspace">
            Enter the Full Workspace
            <span>→</span>
          </Link>
        </div>
      </section>

      <section className="doorsSection shell" id="doors">
        <div className="sectionIntro">
          <p className="eyebrow">FOUR GOVERNED WORKSPACES</p>
          <h2>The entire door is the invitation.</h2>
          <p>
            Hover over any portal to open it slightly and reveal the light
            beyond. Click anywhere on the door to enter that workspace.
          </p>
        </div>

        <div className="doorsGrid">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={workspace.href}
              className={`portalCard ${workspace.id}`}
              aria-label={`Enter ${workspace.title}`}
            >
              <div className="portalScene">
                <div className="portalFloor">
                  <div className="lightSpill" />
                </div>

                <div className="doorFrame">
                  <div className="doorGlow" />
                  <div className="doorPanel">
                    <div className="doorFace">
                      <span className="doorCode">{workspace.code}</span>
                      <span className="doorTitle">{workspace.title}</span>
                    </div>

                    <div className="doorEdge" />
                    <div className="doorInterior">
                      <div className="interiorLight" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="portalContent">
                <span className="portalKicker">{workspace.code}</span>
                <h3>{workspace.title}</h3>
                <p>{workspace.description}</p>

                <ul>
                  {workspace.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <div className="portalAction">
                  Enter {workspace.title}
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="discipline shell">
        <div className="disciplineHeader">
          <div>
            <p className="eyebrow">ONE GOVERNING DISCIPLINE</p>
            <h2>Reality → Record → Continuity → Admissibility → Execution → Outcome</h2>
          </div>

          <p>
            TA-14 separates records, interpretations, determinations,
            optimizations, and execution so each layer remains attributable,
            inspectable, and open to scrutiny.
          </p>
        </div>

        <div className="disciplineGrid">
          {discipline.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="actSection shell">
        <div className="actVisual" aria-hidden="true">
          <div className="actRing ringOne" />
          <div className="actRing ringTwo" />
          <div className="actCore">
            <span>EU</span>
            <strong>AI ACT</strong>
          </div>
        </div>

        <div className="actCopy">
          <p className="eyebrow">EU AI ACT</p>
          <h2>Regulatory workflows live inside the workspaces they actually govern.</h2>
          <p>
            Enter AI Governance for requirements and routes, Governed Records
            for evidence obligations, or Entity Review for requirement-by-
            requirement review. The Act is not treated as a detached compliance
            page.
          </p>

          <div className="actActions">
            <Link className="primaryButton" href="/workspace/ai-governance/eu-ai-act">
              Open EU AI Act Workspace
              <span>→</span>
            </Link>

            <Link className="secondaryButton" href="/workspace/governed-records/eu-ai-act">
              View Record Requirements
            </Link>
          </div>
        </div>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">START AT THE FRONT DOOR</p>
          <h2>Choose the workspace that matches what you are bringing.</h2>
          <p>
            Start with the object, record, environment, or entity under
            scrutiny. The Exchange will preserve the boundary from there.
          </p>
        </div>

        <a className="returnButton" href="#doors">
          Return to the Doors
          <span>↑</span>
        </a>
      </section>

      <footer className="shell">
        <div>
          <strong>TA-14 Authority Governance Institution</strong>
          <span>No admissible evidence. No admissible execution.</span>
        </div>

        <Link href="/workspace">Open Workspace</Link>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #02070d;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #f6fbff;
          background:
            radial-gradient(circle at 18% 0%, rgba(23, 104, 145, 0.15), transparent 32%),
            radial-gradient(circle at 84% 18%, rgba(2, 73, 109, 0.12), transparent 28%),
            linear-gradient(180deg, #02070d 0%, #06111c 46%, #02070d 100%);
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
          width: min(1320px, calc(100% - 40px));
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

        .starField {
          position: absolute;
          inset: -15%;
          opacity: 0.42;
        }

        .starsOne {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.9) 0 1px, transparent 1.5px);
          background-size: 98px 98px;
          animation: starDriftOne 40s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(88,205,255,.7) 0 1px, transparent 1.5px);
          background-size: 156px 156px;
          background-position: 47px 63px;
          animation: starDriftTwo 52s linear infinite reverse;
        }

        .starsThree {
          background-image:
            radial-gradient(circle, rgba(255,210,112,.72) 0 1px, transparent 1.5px);
          background-size: 244px 244px;
          background-position: 83px 27px;
          opacity: 0.24;
          animation: starPulse 8s ease-in-out infinite alternate;
        }

        .movingLine {
          position: absolute;
          width: 62vw;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(95, 205, 255, 0.52),
            transparent
          );
          filter: drop-shadow(0 0 8px rgba(95, 205, 255, 0.45));
          transform-origin: center;
        }

        .lineOne {
          left: -12vw;
          top: 24%;
          transform: rotate(13deg);
          animation: lineSweepOne 14s linear infinite;
        }

        .lineTwo {
          right: -22vw;
          top: 62%;
          transform: rotate(-18deg);
          animation: lineSweepTwo 18s linear infinite;
        }

        .lineThree {
          left: 18vw;
          top: 82%;
          transform: rotate(6deg);
          animation: lineSweepThree 24s linear infinite;
        }

        .burst {
          position: absolute;
          width: 160px;
          height: 160px;
        }

        .burst i {
          --angle: calc(var(--i) * 30deg);
          position: absolute;
          left: 50%;
          top: 50%;
          width: 70px;
          height: 1px;
          transform-origin: left center;
          transform: rotate(var(--angle)) scaleX(0.08);
          background: linear-gradient(
            90deg,
            rgba(255, 220, 138, 0.9),
            transparent
          );
          opacity: 0;
          animation: explode 5.8s ease-out infinite;
          animation-delay: calc(var(--i) * 70ms);
        }

        .burstOne {
          left: 6%;
          top: 18%;
        }

        .burstTwo {
          right: 8%;
          top: 44%;
          transform: scale(0.72);
        }

        .orbitSystem {
          position: absolute;
          width: 260px;
          height: 260px;
        }

        .orbitSystemOne {
          right: 5%;
          top: 7%;
        }

        .orbitSystemTwo {
          left: 5%;
          bottom: 10%;
          transform: scale(0.7);
        }

        .orbit {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          border: 1px solid rgba(80, 189, 244, 0.18);
        }

        .orbitA {
          animation: orbitSpin 21s linear infinite;
        }

        .orbitB {
          inset: 34px;
          border-color: rgba(255, 194, 89, 0.2);
          animation: orbitSpin 15s linear infinite reverse;
        }

        .orbit span {
          position: absolute;
          top: 50%;
          right: -6px;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #70d2ff;
          box-shadow: 0 0 18px rgba(112, 210, 255, 0.9);
        }

        .orbitB span {
          top: 8%;
          right: 18%;
          background: #ffd16f;
          box-shadow: 0 0 18px rgba(255, 209, 111, 0.9);
        }

        .orbitCore {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 28px;
          height: 28px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: radial-gradient(circle, #d8f6ff 0%, #5fc4f2 45%, transparent 70%);
          box-shadow: 0 0 32px rgba(95, 196, 242, 0.7);
        }

        .floatingSphere {
          position: absolute;
          border-radius: 999px;
          background:
            radial-gradient(circle at 30% 28%, rgba(255,255,255,.95), rgba(101,206,255,.72) 20%, rgba(11,89,132,.38) 55%, transparent 72%);
          box-shadow: 0 0 22px rgba(87, 195, 255, 0.48);
        }

        .sphereOne {
          width: 18px;
          height: 18px;
          left: 23%;
          top: 14%;
          animation: sphereFloat 7s ease-in-out infinite alternate;
        }

        .sphereTwo {
          width: 10px;
          height: 10px;
          right: 18%;
          top: 68%;
          animation: sphereFloat 9s ease-in-out infinite alternate-reverse;
        }

        .sphereThree {
          width: 24px;
          height: 24px;
          left: 48%;
          bottom: 8%;
          animation: sphereFloat 11s ease-in-out infinite alternate;
        }

        .topbar {
          min-height: 92px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 28px;
          border-bottom: 1px solid rgba(107, 162, 190, 0.15);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
          color: white;
          text-decoration: none;
        }

        .brandMark {
          min-width: 68px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: #07111a;
          background: linear-gradient(135deg, #72cff8, #d9f7ff);
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.06em;
          box-shadow: 0 0 24px rgba(84, 196, 244, 0.2);
        }

        .brandText {
          display: flex;
          flex-direction: column;
        }

        .brandText strong {
          font-size: 15px;
        }

        .brandText small {
          margin-top: 3px;
          color: #7f9cad;
          font-size: 11px;
        }

        nav {
          display: flex;
          justify-content: center;
          gap: 22px;
        }

        nav a {
          color: #a8bcc8;
          text-decoration: none;
          font-size: 13px;
          font-weight: 750;
          transition:
            color 180ms ease,
            transform 180ms ease;
        }

        nav a:hover {
          color: #f4fbff;
          transform: translateY(-1px);
        }

        .workspaceButton {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 0 16px;
          border-radius: 12px;
          color: #07111a;
          background: linear-gradient(135deg, #6ccaf4, #d9f7ff);
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          box-shadow: 0 12px 30px rgba(52, 166, 219, 0.18);
        }

        .hero {
          min-height: 680px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 90px 0 84px;
          text-align: center;
        }

        .heroBadge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(112, 205, 245, 0.22);
          background: rgba(28, 86, 117, 0.08);
          box-shadow: inset 0 0 18px rgba(92, 197, 240, 0.05);
        }

        .heroBadge span {
          color: #7ad3fa;
          font-weight: 950;
        }

        .heroBadge strong {
          color: #dcecf3;
          font-size: 13px;
        }

        .eyebrow {
          margin: 0;
          color: #72d1f8;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.18em;
        }

        .hero > .eyebrow {
          margin-top: 24px;
        }

        h1 {
          max-width: 1080px;
          margin: 18px 0 22px;
          font-size: clamp(58px, 8vw, 108px);
          line-height: 0.94;
          letter-spacing: -0.065em;
          text-wrap: balance;
        }

        .lead {
          max-width: 860px;
          margin: 0;
          color: #9eb4c1;
          font-size: 19px;
          line-height: 1.72;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 32px;
        }

        .primaryButton,
        .secondaryButton,
        .returnButton {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 22px;
          padding: 0 20px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 900;
        }

        .primaryButton {
          color: #07111a;
          background: linear-gradient(135deg, #69caf4, #dcf8ff);
          box-shadow: 0 14px 38px rgba(71, 183, 231, 0.19);
        }

        .secondaryButton,
        .returnButton {
          color: #e7f5fb;
          border: 1px solid rgba(107, 186, 222, 0.24);
          background: rgba(20, 53, 72, 0.18);
        }

        .doorsSection {
          padding: 28px 0 34px;
        }

        .sectionIntro {
          max-width: 900px;
        }

        .sectionIntro h2,
        .disciplineHeader h2,
        .actCopy h2,
        .finalCta h2 {
          margin: 14px 0 16px;
          font-size: clamp(38px, 5.6vw, 68px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .sectionIntro > p:not(.eyebrow),
        .disciplineHeader > p,
        .actCopy > p:not(.eyebrow),
        .finalCta p:not(.eyebrow) {
          color: #9eb3c1;
          line-height: 1.7;
        }

        .doorsGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-top: 34px;
        }

        .portalCard {
          position: relative;
          min-height: 650px;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid rgba(195, 154, 73, 0.28);
          background:
            radial-gradient(circle at 50% 22%, rgba(255, 204, 105, 0.08), transparent 28%),
            linear-gradient(180deg, rgba(12, 18, 24, 0.96), rgba(5, 10, 15, 0.98));
          color: inherit;
          text-decoration: none;
          box-shadow:
            0 28px 80px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.025);
          transition:
            transform 260ms ease,
            border-color 260ms ease,
            box-shadow 260ms ease;
        }

        .portalCard:hover,
        .portalCard:focus-visible {
          transform: translateY(-9px);
          border-color: rgba(255, 203, 104, 0.68);
          box-shadow:
            0 38px 100px rgba(0, 0, 0, 0.34),
            0 0 44px rgba(255, 182, 46, 0.1);
          outline: none;
        }

        .portalScene {
          position: relative;
          height: 360px;
          overflow: hidden;
          perspective: 1100px;
          background:
            radial-gradient(circle at 50% 26%, rgba(255, 202, 102, 0.12), transparent 26%),
            linear-gradient(180deg, rgba(3, 8, 13, 0.4), rgba(8, 11, 12, 0.96));
        }

        .portalScene::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, transparent 49.5%, rgba(255, 215, 137, 0.08) 50%, transparent 50.5%);
          opacity: 0.7;
        }

        .portalFloor {
          position: absolute;
          left: -10%;
          right: -10%;
          bottom: -4px;
          height: 125px;
          transform: perspective(340px) rotateX(62deg);
          transform-origin: bottom;
          background:
            linear-gradient(90deg, transparent, rgba(255, 190, 70, 0.05), transparent),
            linear-gradient(180deg, rgba(74, 47, 10, 0.05), rgba(5, 8, 10, 0.92));
        }

        .portalFloor::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              90deg,
              transparent 0 44px,
              rgba(255, 205, 109, 0.06) 45px 46px
            );
          opacity: 0.5;
        }

        .lightSpill {
          position: absolute;
          left: 50%;
          top: 0;
          width: 30px;
          height: 110px;
          transform: translateX(-50%) scaleX(0.12);
          transform-origin: top center;
          clip-path: polygon(45% 0, 55% 0, 100% 100%, 0 100%);
          background:
            linear-gradient(
              180deg,
              rgba(255, 246, 190, 0.88),
              rgba(255, 192, 68, 0.48) 46%,
              transparent 100%
            );
          filter: blur(3px);
          opacity: 0;
          transition:
            transform 420ms cubic-bezier(.2,.72,.2,1),
            opacity 280ms ease;
        }

        .doorFrame {
          position: absolute;
          left: 50%;
          top: 24px;
          width: 170px;
          height: 280px;
          transform: translateX(-50%);
          border-radius: 10px 10px 4px 4px;
          border: 8px solid #a26b16;
          background:
            linear-gradient(90deg, #6c3f08, #e3ad45 18%, #8a510d 50%, #e0aa41 82%, #603704);
          box-shadow:
            0 0 0 2px rgba(255, 215, 133, 0.4),
            0 0 38px rgba(255, 176, 43, 0.2),
            inset 0 0 22px rgba(255, 224, 154, 0.16);
        }

        .doorGlow {
          position: absolute;
          inset: 5px;
          border-radius: 4px;
          background: rgba(255, 214, 130, 0.2);
          filter: blur(14px);
          opacity: 0.4;
          transition: opacity 280ms ease;
        }

        .doorPanel {
          position: absolute;
          inset: 7px;
          transform-origin: left center;
          transform-style: preserve-3d;
          transition:
            transform 460ms cubic-bezier(.2,.7,.15,1),
            box-shadow 280ms ease;
        }

        .doorFace,
        .doorInterior {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
        }

        .doorFace {
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-radius: 3px;
          background:
            linear-gradient(90deg, rgba(255,255,255,.06), transparent 18%, transparent 82%, rgba(0,0,0,.18)),
            repeating-linear-gradient(
              90deg,
              #c88a23 0 22px,
              #b4781e 22px 44px
            );
          border: 1px solid rgba(255, 228, 170, 0.42);
          box-shadow:
            inset 0 0 0 3px rgba(90, 49, 3, 0.34),
            inset 0 0 24px rgba(255, 216, 134, 0.14);
        }

        .doorFace::before,
        .doorFace::after {
          content: "";
          position: absolute;
          left: 17px;
          right: 17px;
          border: 2px solid rgba(90, 49, 3, 0.5);
          border-radius: 3px;
        }

        .doorFace::before {
          top: 18px;
          height: 74px;
        }

        .doorFace::after {
          bottom: 18px;
          height: 74px;
        }

        .doorCode {
          position: relative;
          z-index: 2;
          color: #fff2c8;
          font-size: 46px;
          font-weight: 950;
          text-shadow:
            0 0 18px rgba(255, 214, 124, 0.58),
            0 2px 0 rgba(87, 45, 0, 0.7);
        }

        .doorTitle {
          position: relative;
          z-index: 2;
          max-width: 120px;
          color: #fff5d8;
          text-align: center;
          font-size: 14px;
          font-weight: 900;
          line-height: 1.18;
        }

        .doorEdge {
          position: absolute;
          top: 0;
          right: -12px;
          width: 12px;
          height: 100%;
          transform-origin: left center;
          transform: rotateY(90deg);
          background: linear-gradient(180deg, #f1bd55, #6a3905);
        }

        .doorInterior {
          z-index: 1;
          overflow: hidden;
          border-radius: 3px;
          background:
            radial-gradient(circle at 50% 40%, rgba(255, 250, 210, 1), rgba(255, 196, 72, 0.88) 32%, rgba(164, 80, 9, 0.7) 68%, #351601 100%);
          box-shadow: inset 0 0 30px rgba(255, 247, 195, 0.45);
        }

        .interiorLight {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(255,255,255,.55), transparent 20%),
            radial-gradient(circle at 50% 55%, rgba(255,255,255,.72), transparent 34%);
          animation: interiorPulse 2.8s ease-in-out infinite alternate;
        }

        .portalCard:hover .doorPanel,
        .portalCard:focus-visible .doorPanel {
          transform: rotateY(-24deg) translateX(-4px);
          box-shadow: 18px 0 28px rgba(255, 195, 69, 0.13);
        }

        .portalCard:hover .lightSpill,
        .portalCard:focus-visible .lightSpill {
          opacity: 1;
          transform: translateX(-50%) scaleX(3.6);
        }

        .portalCard:hover .doorGlow,
        .portalCard:focus-visible .doorGlow {
          opacity: 0.9;
        }

        .portalContent {
          padding: 26px 24px 28px;
        }

        .portalKicker {
          color: #f0b84f;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.16em;
        }

        .portalContent h3 {
          margin: 10px 0 12px;
          font-size: 29px;
          letter-spacing: -0.035em;
        }

        .portalContent > p {
          margin: 0;
          min-height: 88px;
          color: #9eb2bf;
          line-height: 1.58;
        }

        .portalContent ul {
          display: grid;
          gap: 8px;
          margin: 20px 0 0;
          padding: 0;
          list-style: none;
        }

        .portalContent li {
          position: relative;
          padding-left: 18px;
          color: #d6e2e8;
          font-size: 13px;
          line-height: 1.45;
        }

        .portalContent li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.55em;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #e8b349;
          box-shadow: 0 0 10px rgba(232, 179, 73, 0.55);
        }

        .portalAction {
          min-height: 48px;
          margin-top: 24px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 12px;
          border: 1px solid rgba(232, 179, 73, 0.24);
          background: rgba(181, 111, 14, 0.06);
          color: #f8ce7a;
          font-size: 13px;
          font-weight: 900;
          transition:
            background 180ms ease,
            border-color 180ms ease;
        }

        .portalCard:hover .portalAction,
        .portalCard:focus-visible .portalAction {
          border-color: rgba(255, 207, 114, 0.55);
          background: rgba(186, 116, 20, 0.12);
        }

        .discipline,
        .actSection,
        .finalCta {
          border: 1px solid rgba(99, 166, 195, 0.16);
          background:
            linear-gradient(180deg, rgba(8, 21, 31, 0.9), rgba(3, 10, 15, 0.95));
          border-radius: 28px;
          box-shadow: 0 26px 80px rgba(0, 0, 0, 0.25);
        }

        .discipline {
          margin-top: 84px;
          padding: 48px;
        }

        .disciplineHeader {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 38px;
          align-items: end;
        }

        .disciplineHeader > p {
          margin: 0;
        }

        .disciplineGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 34px;
        }

        .disciplineGrid article {
          min-height: 230px;
          padding: 22px;
          border-radius: 18px;
          border: 1px solid rgba(104, 177, 207, 0.16);
          background: rgba(32, 87, 111, 0.05);
        }

        .disciplineGrid span {
          color: #69cdf7;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.16em;
        }

        .disciplineGrid h3 {
          margin: 16px 0 10px;
          font-size: 24px;
        }

        .disciplineGrid p {
          margin: 0;
          color: #9fb3c0;
          line-height: 1.58;
        }

        .actSection {
          margin-top: 22px;
          padding: 48px;
          display: grid;
          grid-template-columns: 0.78fr 1.22fr;
          gap: 42px;
          align-items: center;
        }

        .actVisual {
          min-height: 330px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .actRing {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(101, 194, 232, 0.22);
        }

        .ringOne {
          width: 290px;
          height: 290px;
          animation: orbitSpin 18s linear infinite;
        }

        .ringTwo {
          width: 220px;
          height: 220px;
          border-color: rgba(255, 196, 79, 0.22);
          animation: orbitSpin 13s linear infinite reverse;
        }

        .actCore {
          width: 150px;
          height: 150px;
          border-radius: 999px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(107, 205, 245, 0.42);
          background:
            radial-gradient(circle, rgba(83, 180, 223, 0.14), rgba(6, 17, 26, 0.95) 68%);
          box-shadow:
            0 0 36px rgba(84, 191, 236, 0.18),
            inset 0 0 22px rgba(84, 191, 236, 0.08);
        }

        .actCore span {
          color: #75d4fb;
          font-size: 34px;
          font-weight: 950;
        }

        .actCore strong {
          margin-top: 3px;
          color: #edf9fd;
          font-size: 16px;
        }

        .actActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 26px;
        }

        .finalCta {
          margin-top: 78px;
          padding: 56px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 34px;
        }

        .finalCta > div {
          max-width: 820px;
        }

        footer {
          min-height: 130px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          color: #768d9a;
          font-size: 12px;
        }

        footer > div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        footer strong {
          color: #a9bbc5;
        }

        footer a {
          color: #8fd8f8;
          text-decoration: none;
          font-weight: 850;
        }

        @keyframes starDriftOne {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(110px, 150px, 0); }
        }

        @keyframes starDriftTwo {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-130px, 100px, 0); }
        }

        @keyframes starPulse {
          from { opacity: 0.14; transform: scale(0.98); }
          to { opacity: 0.34; transform: scale(1.02); }
        }

        @keyframes lineSweepOne {
          0% { transform: translateX(-28vw) rotate(13deg); opacity: 0; }
          15% { opacity: 0.6; }
          80% { opacity: 0.35; }
          100% { transform: translateX(105vw) rotate(13deg); opacity: 0; }
        }

        @keyframes lineSweepTwo {
          0% { transform: translateX(28vw) rotate(-18deg); opacity: 0; }
          18% { opacity: 0.5; }
          85% { opacity: 0.3; }
          100% { transform: translateX(-105vw) rotate(-18deg); opacity: 0; }
        }

        @keyframes lineSweepThree {
          0% { transform: translateX(-55vw) rotate(6deg); opacity: 0; }
          20% { opacity: 0.38; }
          82% { opacity: 0.28; }
          100% { transform: translateX(92vw) rotate(6deg); opacity: 0; }
        }

        @keyframes explode {
          0%, 58% {
            transform: rotate(var(--angle)) scaleX(0.08);
            opacity: 0;
          }
          65% {
            opacity: 0.9;
          }
          100% {
            transform: rotate(var(--angle)) scaleX(1.15);
            opacity: 0;
          }
        }

        @keyframes orbitSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes sphereFloat {
          from { transform: translate3d(0, -10px, 0); }
          to { transform: translate3d(18px, 14px, 0); }
        }

        @keyframes interiorPulse {
          from { opacity: 0.48; }
          to { opacity: 0.84; }
        }

        @media (max-width: 1120px) {
          .topbar {
            grid-template-columns: auto auto;
          }

          nav {
            display: none;
          }

          .doorsGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .disciplineGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .disciplineHeader,
          .actSection {
            grid-template-columns: 1fr;
          }

          .finalCta {
            flex-direction: column;
            align-items: flex-start;
          }

          .actVisual {
            min-height: 290px;
          }
        }

        @media (max-width: 640px) {
          .shell {
            width: min(100% - 20px, 1320px);
          }

          .brandText small {
            display: none;
          }

          .workspaceButton {
            padding: 0 12px;
          }

          .workspaceButton span {
            display: none;
          }

          .hero {
            min-height: auto;
            padding: 72px 0 62px;
          }

          h1 {
            font-size: clamp(48px, 16vw, 72px);
          }

          .doorsGrid,
          .disciplineGrid {
            grid-template-columns: 1fr;
          }

          .portalCard {
            min-height: 630px;
          }

          .discipline,
          .actSection,
          .finalCta {
            padding: 30px 24px;
          }

          .actVisual {
            transform: scale(0.86);
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
