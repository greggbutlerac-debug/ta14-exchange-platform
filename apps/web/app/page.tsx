"use client";

import Link from "next/link";

const doors = [
  {
    code: "AI",
    title: "AI Governance",
    description:
      "Build, test, correct, and verify consequential AI routes.",
    items: ["AI agents", "Tools and APIs", "Payloads", "Commitments", "Outcomes"],
    href: "/workspace/ai-governance",
    action: "Enter AI Governance",
    accent: "#67dfcf",
  },
  {
    code: "GR",
    title: "Governed Records",
    description:
      "Create, upload, interpret, preserve, and review governed records.",
    items: [
      "Create records",
      "Upload records",
      "Bounded interpretation",
      "Preserve uncertainty",
      "Export records",
    ],
    href: "/workspace/governed-records",
    action: "Enter Governed Records",
    accent: "#5eafff",
  },
  {
    code: "ER",
    title: "Environmental Records",
    description:
      "Interpret land, water, air, building, hospital, HVAC, and sensor evidence.",
    items: [
      "Atmospheric integrity",
      "Environmental data",
      "Building systems",
      "IAQ and sensors",
      "Land, water, air",
    ],
    href: "/workspace/environmental-records",
    action: "Enter Environmental Records",
    accent: "#c271ff",
  },
  {
    code: "◎",
    title: "Entity Review",
    description:
      "Submit an organization, AI system, architecture, program, or route for review.",
    items: [
      "Organizations",
      "AI systems",
      "Architectures",
      "Route reviews",
      "Review status",
    ],
    href: "/workspace/entity-review",
    action: "Enter Entity Review",
    accent: "#ffb320",
  },
];

export default function HomePage() {
  return (
    <main id="top">
      <div className="starField starFieldOne" />
      <div className="starField starFieldTwo" />
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />

      <header className="header shell">
        <Link href="/" className="brand">
          <span className="brandBadge">TA-14</span>
          <span className="brandText">
            <strong>AI Governance Exchange</strong>
            <small>No admissible evidence. No admissible execution.</small>
          </span>
        </Link>

        <Link href="/workspace" className="headerButton">
          Open Workspace
        </Link>
      </header>

      <section className="hero shell">
        <p className="eyebrow">TA-14 AI GOVERNANCE EXCHANGE</p>
        <h1>Choose the door that matches the work.</h1>
        <p className="heroText">
          Four governed workspaces. Each preserves its own evidence boundary,
          purpose, and review path.
        </p>

        <div className="startPrompt">
          <span>Open a door to begin</span>
          <b aria-hidden="true">↓</b>
        </div>
      </section>

      <section className="doors shell">
        {doors.map((door) => (
          <article
            className="doorCard"
            style={{ "--door-accent": door.accent } as React.CSSProperties}
            key={door.title}
          >
            <div className="doorTitleRow">
              <div className="categoryIcon">{door.code}</div>
              <div>
                <h2>{door.title}</h2>
                <p>{door.description}</p>
              </div>
            </div>

            <div className="doorContent">
              <ul>
                {door.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="goldenDoor" aria-hidden="true">
                <div className="lightRays" />
                <div className="outerGlow" />
                <div className="doorFrame">
                  <div className="doorPanel">
                    <div className="doorMedallion">{door.code}</div>
                    <span className="doorKnob" />
                    <span className="doorLine doorLineOne" />
                    <span className="doorLine doorLineTwo" />
                  </div>
                </div>
                <div className="threshold thresholdOne" />
                <div className="threshold thresholdTwo" />
                <div className="threshold thresholdThree" />
              </div>
            </div>

            <Link href={door.href} className="enterButton">
              <span>{door.action}</span>
              <b aria-hidden="true">→</b>
            </Link>
          </article>
        ))}
      </section>

      <section className="shortExplanation shell">
        <div>
          <p className="eyebrow">ONE GOVERNING DISCIPLINE</p>
          <h2>Reality → Record → Continuity → Admissibility → Execution → Outcome</h2>
        </div>
        <p>
          TA-14 separates records, interpretations, determinations, and
          execution so each layer remains attributable and open to scrutiny.
        </p>
      </section>

      <section className="smallCards shell">
        <article>
          <span>01</span>
          <h3>Build and test</h3>
          <p>Use the AI Governance workspace to examine consequential routes.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Preserve the evidence</h3>
          <p>Use Governed Records to create a bounded, attributable record.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Review the whole entity</h3>
          <p>Use Entity Review for organizations, systems, architectures, and routes.</p>
        </article>
      </section>

      <section className="euNote shell">
        <div>
          <p className="eyebrow">EU AI ACT</p>
          <h2>EU AI Act workflows are available inside the relevant doors.</h2>
          <p>
            Enter AI Governance, Governed Records, or Entity Review to access
            the applicable requirements and supporting governance workflows.
          </p>
        </div>
      </section>

      <section className="finalPrompt shell">
        <div>
          <p className="eyebrow">START AT THE FRONT DOOR</p>
          <h2>Choose the workspace that matches what you are bringing.</h2>
        </div>
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Return to the doors ↑
        </a>
      </section>

      <footer className="footer shell">
        <span>TA-14 Authority Governance Institution</span>
        <span>No admissible evidence. No admissible execution.</span>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #050b15;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #f6f8fc;
          background:
            radial-gradient(circle at 15% 8%, rgba(55, 200, 183, 0.08), transparent 26%),
            radial-gradient(circle at 85% 20%, rgba(68, 105, 177, 0.09), transparent 28%),
            linear-gradient(180deg, #050b15 0%, #08101d 48%, #050913 100%);
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
          width: min(1660px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .starField {
          position: fixed;
          inset: -10%;
          pointer-events: none;
          z-index: -5;
          opacity: 0.34;
        }

        .starFieldOne {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.5px);
          background-size: 94px 94px;
          animation: starDrift 36s linear infinite;
        }

        .starFieldTwo {
          background-image:
            radial-gradient(circle, rgba(108,222,211,.55) 0 1px, transparent 1.5px);
          background-size: 164px 164px;
          background-position: 48px 62px;
          animation: starDrift 50s linear infinite reverse;
        }

        .ambient {
          position: fixed;
          width: 520px;
          height: 520px;
          border-radius: 999px;
          filter: blur(130px);
          opacity: 0.1;
          z-index: -4;
          pointer-events: none;
          animation: ambientMove 16s ease-in-out infinite alternate;
        }

        .ambientOne {
          background: #50dec9;
          left: -230px;
          top: -210px;
        }

        .ambientTwo {
          background: #6d62ff;
          right: -220px;
          top: 42%;
          animation-delay: -7s;
        }

        .header {
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          border-bottom: 1px solid rgba(134, 155, 190, 0.15);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
        }

        .brandBadge {
          min-width: 66px;
          height: 40px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #06100f;
          background: linear-gradient(135deg, #5cdbc9, #b9fff7);
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.05em;
        }

        .brandText {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .brandText small {
          color: #8193a8;
          font-size: 11px;
        }

        .headerButton {
          padding: 11px 17px;
          border-radius: 999px;
          border: 1px solid rgba(103, 221, 206, 0.3);
          background: rgba(70, 200, 184, 0.07);
          color: #dffff9;
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
        }

        .hero {
          text-align: center;
          padding: 76px 20px 40px;
        }

        .eyebrow {
          margin: 0;
          color: #70ddce;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .hero h1 {
          max-width: 980px;
          margin: 17px auto 18px;
          font-size: clamp(44px, 7vw, 86px);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .heroText {
          max-width: 730px;
          margin: 0 auto;
          color: #9dafc4;
          font-size: 18px;
          line-height: 1.65;
        }

        .startPrompt {
          width: min(830px, 92%);
          margin: 34px auto 0;
          min-height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          border: 1px solid rgba(104, 220, 206, 0.18);
          border-radius: 18px;
          background: rgba(6, 15, 27, 0.75);
          color: #e2fff9;
          font-weight: 850;
        }

        .startPrompt b {
          color: #5edccb;
          animation: bounce 1.5s ease-in-out infinite;
        }

        .doors {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          padding-bottom: 76px;
        }

        .doorCard {
          min-height: 700px;
          display: flex;
          flex-direction: column;
          padding: 28px;
          border-radius: 30px;
          border: 1px solid color-mix(in srgb, var(--door-accent) 48%, transparent);
          background:
            radial-gradient(circle at 50% 72%, rgba(255, 177, 31, 0.08), transparent 34%),
            linear-gradient(180deg, rgba(13, 22, 37, 0.95), rgba(6, 11, 22, 0.98));
          box-shadow:
            0 28px 90px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255,255,255,.035);
          position: relative;
          overflow: hidden;
          transition:
            transform 230ms ease,
            border-color 230ms ease;
        }

        .doorCard:hover {
          transform: translateY(-6px);
          border-color: var(--door-accent);
        }

        .doorTitleRow {
          display: grid;
          grid-template-columns: 66px 1fr;
          gap: 18px;
          min-height: 180px;
          position: relative;
          z-index: 2;
        }

        .categoryIcon {
          width: 66px;
          height: 66px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          border: 1px solid var(--door-accent);
          background: color-mix(in srgb, var(--door-accent) 9%, transparent);
          color: var(--door-accent);
          font-size: 23px;
          font-weight: 950;
        }

        .doorTitleRow h2 {
          margin: 3px 0 10px;
          font-size: 25px;
          letter-spacing: -0.03em;
        }

        .doorTitleRow p {
          margin: 0;
          color: #9fafc3;
          line-height: 1.57;
          font-size: 14px;
        }

        .doorContent {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(116px, 0.72fr) minmax(175px, 1.28fr);
          gap: 12px;
          align-items: end;
          position: relative;
          z-index: 2;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0 0 30px;
        }

        li {
          margin: 0 0 16px;
          padding-left: 20px;
          color: #c5d0df;
          font-size: 14px;
          line-height: 1.4;
          position: relative;
        }

        li::before {
          content: "✦";
          position: absolute;
          left: 0;
          top: 3px;
          color: var(--door-accent);
          font-size: 10px;
        }

        .goldenDoor {
          height: 350px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          position: relative;
          filter: drop-shadow(0 0 22px rgba(255, 184, 48, 0.45));
        }

        .lightRays {
          position: absolute;
          inset: 0 -26px 24px;
          clip-path: polygon(36% 0, 64% 0, 100% 100%, 0 100%);
          opacity: 0.42;
          background:
            repeating-conic-gradient(
              from 190deg at 50% 100%,
              transparent 0 7deg,
              rgba(255, 196, 76, 0.9) 8deg 9deg,
              transparent 10deg 20deg
            );
          animation: rays 3.5s ease-in-out infinite alternate;
        }

        .outerGlow {
          position: absolute;
          bottom: 36px;
          width: 235px;
          height: 280px;
          border-radius: 120px 120px 20px 20px;
          background: radial-gradient(
            ellipse at 50% 65%,
            rgba(255, 189, 48, 0.32),
            rgba(255, 180, 27, 0.09) 48%,
            transparent 72%
          );
          filter: blur(8px);
          animation: glowPulse 2.8s ease-in-out infinite alternate;
        }

        .doorFrame {
          width: 190px;
          height: 275px;
          padding: 17px;
          border-radius: 100px 100px 12px 12px;
          border: 4px solid #ffc44d;
          background:
            linear-gradient(180deg, rgba(255, 202, 91, 0.17), rgba(75, 40, 3, 0.96)),
            #251500;
          box-shadow:
            0 0 12px #ffd263,
            0 0 28px rgba(255, 181, 28, 0.85),
            0 0 60px rgba(255, 171, 13, 0.42),
            inset 0 0 28px rgba(255, 193, 61, 0.38);
          position: relative;
          z-index: 3;
          animation: doorPulse 3s ease-in-out infinite alternate;
        }

        .doorFrame::before {
          content: "";
          position: absolute;
          inset: -17px;
          border-radius: 116px 116px 11px 11px;
          border: 1px solid rgba(255, 198, 76, 0.72);
          border-bottom: 0;
        }

        .doorFrame::after {
          content: "";
          position: absolute;
          inset: -29px -24px -8px;
          border-radius: 130px 130px 13px 13px;
          border: 1px solid rgba(255, 188, 48, 0.35);
          border-bottom: 0;
        }

        .doorPanel {
          width: 100%;
          height: 100%;
          border-radius: 78px 78px 7px 7px;
          border: 1px solid #ffe09a;
          background:
            linear-gradient(90deg, transparent 49.4%, rgba(255,239,190,.22) 50%, transparent 50.6%),
            linear-gradient(180deg, rgba(255, 206, 94, 0.15), rgba(65, 34, 3, 0.78));
          position: relative;
          display: grid;
          place-items: center;
          box-shadow: inset 0 0 24px rgba(255, 188, 45, 0.28);
        }

        .doorMedallion {
          width: 72px;
          height: 72px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          border: 2px solid #fff1c2;
          background: rgba(47, 25, 2, 0.92);
          color: #fff3c7;
          font-size: 21px;
          font-weight: 950;
          box-shadow:
            0 0 16px #ffc24b,
            inset 0 0 16px rgba(255, 197, 72, 0.2);
        }

        .doorKnob {
          position: absolute;
          width: 11px;
          height: 11px;
          right: -6px;
          top: 50%;
          border-radius: 999px;
          background: #fff0a9;
          box-shadow:
            0 0 7px #fff1ac,
            0 0 16px #ffb819;
        }

        .doorLine {
          position: absolute;
          left: 16px;
          right: 16px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 220, 137, 0.42),
            transparent
          );
        }

        .doorLineOne {
          top: 29%;
        }

        .doorLineTwo {
          bottom: 25%;
        }

        .threshold {
          position: absolute;
          bottom: 4px;
          border-radius: 50%;
          border: 1px solid rgba(255, 194, 64, 0.8);
          transform: perspective(120px) rotateX(67deg);
          box-shadow:
            0 0 9px rgba(255, 190, 54, 0.7),
            inset 0 0 9px rgba(255, 194, 58, 0.22);
        }

        .thresholdOne {
          width: 230px;
          height: 40px;
        }

        .thresholdTwo {
          width: 260px;
          height: 48px;
          bottom: -2px;
          opacity: 0.65;
        }

        .thresholdThree {
          width: 290px;
          height: 56px;
          bottom: -8px;
          opacity: 0.32;
        }

        .enterButton {
          min-height: 66px;
          margin-top: 18px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 15px;
          border: 1px solid #eeb23b;
          background:
            linear-gradient(180deg, rgba(183, 132, 36, 0.82), rgba(77, 43, 5, 0.97));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.2),
            0 12px 30px rgba(0,0,0,.25);
          color: #fff6dc;
          text-decoration: none;
          font-weight: 900;
          position: relative;
          z-index: 3;
        }

        .shortExplanation {
          padding: 62px 48px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 44px;
          align-items: center;
          border-top: 1px solid rgba(127, 148, 181, 0.15);
          border-bottom: 1px solid rgba(127, 148, 181, 0.15);
        }

        .shortExplanation h2,
        .euNote h2,
        .finalPrompt h2 {
          margin: 12px 0 0;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.05;
          letter-spacing: -0.045em;
        }

        .shortExplanation > p {
          margin: 0;
          color: #9fafc2;
          line-height: 1.68;
        }

        .smallCards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          padding: 62px 0;
        }

        .smallCards article {
          min-height: 210px;
          padding: 28px;
          border-radius: 20px;
          border: 1px solid rgba(131, 153, 188, 0.16);
          background: linear-gradient(
            180deg,
            rgba(13, 22, 37, 0.84),
            rgba(7, 13, 24, 0.92)
          );
        }

        .smallCards span {
          color: #69dbcc;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .smallCards h3 {
          margin: 17px 0 10px;
          font-size: 25px;
          letter-spacing: -0.03em;
        }

        .smallCards p {
          margin: 0;
          color: #9fafc2;
          line-height: 1.62;
        }

        .euNote {
          padding: 28px 34px;
          border-radius: 20px;
          border: 1px solid rgba(129, 151, 186, 0.14);
          background: rgba(8, 15, 27, 0.7);
        }

        .euNote h2 {
          font-size: clamp(23px, 3vw, 34px);
        }

        .euNote p:not(.eyebrow) {
          max-width: 900px;
          margin: 12px 0 0;
          color: #96a7ba;
          line-height: 1.62;
        }

        .finalPrompt {
          margin-top: 58px;
          padding: 48px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          border-radius: 26px;
          border: 1px solid rgba(103, 218, 202, 0.18);
          background: linear-gradient(
            180deg,
            rgba(12, 22, 37, 0.9),
            rgba(7, 13, 24, 0.95)
          );
        }

        .finalPrompt > div {
          max-width: 850px;
        }

        .finalPrompt a {
          min-width: 205px;
          padding: 14px 18px;
          border-radius: 999px;
          border: 1px solid rgba(104, 220, 206, 0.28);
          background: rgba(75, 200, 184, 0.07);
          color: #dcfff9;
          text-decoration: none;
          text-align: center;
          font-weight: 850;
        }

        .footer {
          min-height: 110px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          color: #728397;
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

        @keyframes ambientMove {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(60px, 38px, 0) scale(1.12);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(5px);
          }
        }

        @keyframes rays {
          from {
            opacity: 0.25;
            transform: scaleX(0.94);
          }
          to {
            opacity: 0.5;
            transform: scaleX(1.06);
          }
        }

        @keyframes glowPulse {
          from {
            opacity: 0.65;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes doorPulse {
          from {
            filter: brightness(0.92);
          }
          to {
            filter: brightness(1.18);
          }
        }

        @media (max-width: 1420px) {
          .doors {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .doorCard {
            min-height: 660px;
          }
        }

        @media (max-width: 900px) {
          .shortExplanation {
            grid-template-columns: 1fr;
          }

          .smallCards {
            grid-template-columns: 1fr;
          }

          .finalPrompt {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 720px) {
          .shell,
          .header {
            width: min(100% - 20px, 1660px);
          }

          .brandText small,
          .headerButton {
            display: none;
          }

          .hero {
            padding-top: 54px;
          }

          .doors {
            grid-template-columns: 1fr;
          }

          .doorCard {
            min-height: auto;
            padding: 22px;
          }

          .doorTitleRow {
            min-height: auto;
            margin-bottom: 22px;
          }

          .doorContent {
            grid-template-columns: 1fr;
          }

          ul {
            margin-bottom: 4px;
          }

          .goldenDoor {
            height: 350px;
          }

          .shortExplanation,
          .euNote,
          .finalPrompt {
            padding: 28px 24px;
          }

          .footer {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
