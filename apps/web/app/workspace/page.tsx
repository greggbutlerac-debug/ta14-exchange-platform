'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';

const PLAYGROUNDS = [
  {
    number: '01',
    title: 'AI Governance',
    subtitle: 'Govern consequential AI execution',
    description:
      'Learn how governed routes work, explore guided scenarios, and enter the route-building playground to test authority, evidence, admissibility, execution, and outcome continuity.',
    href: '/workspace/ai-governance',
    action: 'Enter AI Governance',
    accent: '#68e5ff',
    glow: 'rgba(104, 229, 255, 0.34)',
    icon: 'AI',
  },
  {
    number: '02',
    title: 'Governed Records',
    subtitle: 'Turn source material into governed evidence',
    description:
      'Bring a record, preserve what it proves, expose what it does not prove, and create a replayable governed interpretation without manufacturing certainty.',
    href: '/workspace/governed-records',
    action: 'Enter Governed Records',
    accent: '#a495ff',
    glow: 'rgba(164, 149, 255, 0.34)',
    icon: 'GR',
  },
  {
    number: '03',
    title: 'Environmental Records',
    subtitle: 'Govern land, water, air, and built environments',
    description:
      'Explore atmospheric, building, hospital, laboratory, manufacturing, land, water, and environmental records through bounded interpretation.',
    href: '/workspace/environmental-records',
    action: 'Enter Environmental Records',
    accent: '#62efb9',
    glow: 'rgba(98, 239, 185, 0.34)',
    icon: 'ER',
  },
  {
    number: '04',
    title: 'Entity Review Center',
    subtitle: 'Bring the system, program, architecture, or evidence',
    description:
      'Submit an AI system, governance program, execution architecture, policy framework, environmental system, or organization for a scoped TA-14 review.',
    href: '/workspace/entity-reviews',
    action: 'Enter Entity Review Center',
    accent: '#ffbf69',
    glow: 'rgba(255, 191, 105, 0.34)',
    icon: 'RV',
  },
] as const;

const PRINCIPLES = [
  'Free to explore',
  'No credit card required',
  'Come and go as you please',
  'Use real tools, not a guided sales demo',
];

export default function PlaygroundGatewayPage() {
  return (
    <main className="gateway">
      <div className="grid" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />
      <div className="aurora auroraOne" aria-hidden="true" />
      <div className="aurora auroraTwo" aria-hidden="true" />
      <div className="aurora auroraThree" aria-hidden="true" />

      <div className="orbital orbitalOne" aria-hidden="true">
        <span />
      </div>
      <div className="orbital orbitalTwo" aria-hidden="true">
        <span />
      </div>

      <div className="robot robotLeft" aria-hidden="true">
        <div className="robotHead">
          <span className="robotEye" />
          <span className="robotEye" />
        </div>
        <div className="robotNeck" />
        <div className="robotBody">
          <span className="robotCore" />
          <span className="robotLine robotLineOne" />
          <span className="robotLine robotLineTwo" />
        </div>
        <div className="robotArm robotArmLeft" />
        <div className="robotArm robotArmRight" />
      </div>

      <div className="robot robotRight" aria-hidden="true">
        <div className="robotHead">
          <span className="robotEye" />
          <span className="robotEye" />
        </div>
        <div className="robotNeck" />
        <div className="robotBody">
          <span className="robotCore" />
          <span className="robotLine robotLineOne" />
          <span className="robotLine robotLineTwo" />
        </div>
        <div className="robotArm robotArmLeft" />
        <div className="robotArm robotArmRight" />
      </div>

      <section className="shell">
        <header className="hero">
          <div className="institution">
            <span className="institutionMark">TA</span>
            <span>TA-14 AI GOVERNANCE EXCHANGE</span>
          </div>

          <div className="freeBadge">
            <span className="freePulse" />
            FREE TO PLAY
          </div>

          <h1>
            Which playground
            <span>would you like to enter?</span>
          </h1>

          <p className="intro">
            TA-14 gives people, organizations, and institutions a place to
            explore what happens when evidence, authority, interpretation, and
            execution are governed instead of assumed.
          </p>

          <div className="principles" aria-label="Free access details">
            {PRINCIPLES.map((principle) => (
              <span key={principle}>
                <i aria-hidden="true">✓</i>
                {principle}
              </span>
            ))}
          </div>

          <div className="pulseRule" aria-hidden="true">
            <span />
          </div>
        </header>

        <section className="mission">
          <div className="missionLabel">WHY THIS EXISTS</div>
          <p>
            Society increasingly depends on systems that interpret records,
            recommend actions, control environments, and affect real people.
            TA-14 creates a visible path from reality to record, from record to
            determination, and from determination to accountable execution.
          </p>
        </section>

        <section className="doors" aria-label="Available TA-14 playgrounds">
          {PLAYGROUNDS.map((playground) => (
            <Link
              key={playground.title}
              href={playground.href}
              className="door"
              style={
                {
                  '--accent': playground.accent,
                  '--glow': playground.glow,
                } as CSSProperties
              }
            >
              <div className="doorGlow" aria-hidden="true" />

              <div className="doorTop">
                <span className="doorNumber">{playground.number}</span>
                <span className="doorIcon">{playground.icon}</span>
              </div>

              <div className="doorContent">
                <p className="doorSubtitle">{playground.subtitle}</p>
                <h2>{playground.title}</h2>
                <p className="doorDescription">{playground.description}</p>
              </div>

              <div className="doorAction">
                <span>{playground.action}</span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </div>

              <div className="doorCorners" aria-hidden="true">
                <span className="corner cornerOne" />
                <span className="corner cornerTwo" />
                <span className="corner cornerThree" />
                <span className="corner cornerFour" />
              </div>
            </Link>
          ))}
        </section>

        <section className="society">
          <div>
            <p className="societyEyebrow">ONE PUBLIC FRONT DOOR</p>
            <h3>Different domains. One governing discipline.</h3>
          </div>
          <p>
            Each playground has its own tools and purpose, but all four preserve
            the same principle: records, interpretations, decisions, and
            executions should remain visible, bounded, and reviewable.
          </p>
        </section>

        <footer className="footer">
          <span>No admissible evidence.</span>
          <span className="footerDot" />
          <span>No admissible execution.</span>
        </footer>
      </section>

      <style jsx global>{`
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          min-height: 100%;
          margin: 0;
          background: #02070d;
        }

        body {
          overflow-x: hidden;
        }

        .gateway {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f7fbff;
          background:
            radial-gradient(circle at 50% -10%, rgba(40, 111, 154, 0.3), transparent 35%),
            radial-gradient(circle at 10% 68%, rgba(70, 78, 190, 0.15), transparent 35%),
            radial-gradient(circle at 90% 76%, rgba(20, 160, 120, 0.13), transparent 35%),
            linear-gradient(180deg, #02070d 0%, #04111b 50%, #02070d 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .grid {
          position: absolute;
          inset: 0;
          opacity: 0.22;
          background-image:
            linear-gradient(rgba(100, 210, 255, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 210, 255, 0.07) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: linear-gradient(to bottom, transparent, black 12%, black 86%, transparent);
          animation: gridShift 16s linear infinite;
        }

        .scanline {
          position: absolute;
          inset: -100% 0 auto;
          height: 42%;
          opacity: 0.14;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(99, 230, 255, 0.12),
            transparent
          );
          animation: scan 10s linear infinite;
        }

        .aurora {
          position: absolute;
          width: 42rem;
          height: 42rem;
          border-radius: 999px;
          filter: blur(90px);
          opacity: 0.16;
          pointer-events: none;
        }

        .auroraOne {
          top: -15rem;
          left: -12rem;
          background: #3cd5ff;
          animation: driftOne 18s ease-in-out infinite alternate;
        }

        .auroraTwo {
          right: -16rem;
          bottom: -16rem;
          background: #5df2b2;
          animation: driftTwo 22s ease-in-out infinite alternate;
        }

        .auroraThree {
          top: 42%;
          left: 42%;
          width: 26rem;
          height: 26rem;
          background: #8f7cff;
          opacity: 0.08;
          animation: driftThree 20s ease-in-out infinite alternate;
        }

        .orbital {
          position: absolute;
          z-index: 1;
          border: 1px solid rgba(115, 229, 255, 0.08);
          border-radius: 999px;
          pointer-events: none;
        }

        .orbital span {
          position: absolute;
          top: 50%;
          left: -4px;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #69e7ff;
          box-shadow: 0 0 18px #69e7ff;
        }

        .orbitalOne {
          top: 7rem;
          left: 50%;
          width: 58rem;
          height: 58rem;
          transform: translateX(-50%);
          animation: orbit 24s linear infinite;
        }

        .orbitalTwo {
          top: 18rem;
          left: 50%;
          width: 36rem;
          height: 36rem;
          transform: translateX(-50%) rotate(45deg);
          animation: orbitReverse 18s linear infinite;
        }

        .shell {
          position: relative;
          z-index: 5;
          width: min(1380px, calc(100% - 36px));
          margin: 0 auto;
          padding: 48px 0 38px;
        }

        .hero {
          max-width: 980px;
          margin: 0 auto;
          text-align: center;
        }

        .institution {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #9fb7c7;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.16em;
        }

        .institutionMark {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border: 1px solid rgba(99, 230, 255, 0.35);
          border-radius: 10px;
          color: #6ee8ff;
          background: rgba(99, 230, 255, 0.06);
          box-shadow: 0 0 30px rgba(99, 230, 255, 0.08);
        }

        .freeBadge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 54px;
          padding: 10px 15px;
          border: 1px solid rgba(98, 239, 185, 0.24);
          border-radius: 999px;
          color: #82f4c5;
          background: rgba(98, 239, 185, 0.06);
          box-shadow: 0 0 30px rgba(98, 239, 185, 0.08);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.2em;
        }

        .freePulse {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #62efb9;
          box-shadow: 0 0 14px #62efb9;
          animation: freePulse 2s ease-in-out infinite;
        }

        h1 {
          margin: 25px 0 0;
          font-size: clamp(3.2rem, 8vw, 7.7rem);
          line-height: 0.91;
          letter-spacing: -0.075em;
          text-wrap: balance;
        }

        h1 span {
          display: block;
          margin-top: 0.08em;
          color: transparent;
          background: linear-gradient(90deg, #ffffff 0%, #8de9ff 48%, #82f1c0 100%);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .intro {
          max-width: 760px;
          margin: 30px auto 0;
          color: #9ab0be;
          font-size: clamp(1rem, 2vw, 1.22rem);
          line-height: 1.78;
        }

        .principles {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 28px;
        }

        .principles span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border: 1px solid rgba(151, 194, 212, 0.12);
          border-radius: 999px;
          color: #9fb5c3;
          background: rgba(255, 255, 255, 0.025);
          font-size: 11px;
          font-weight: 750;
        }

        .principles i {
          color: #62efb9;
          font-style: normal;
        }

        .pulseRule {
          position: relative;
          width: min(520px, 78%);
          height: 1px;
          margin: 38px auto 0;
          overflow: hidden;
          background: rgba(145, 200, 220, 0.16);
        }

        .pulseRule span {
          position: absolute;
          top: 0;
          left: -30%;
          width: 30%;
          height: 100%;
          background: linear-gradient(90deg, transparent, #75eaff, transparent);
          animation: pulseRule 3.8s ease-in-out infinite;
        }

        .mission {
          display: grid;
          grid-template-columns: 180px minmax(0, 1fr);
          gap: 26px;
          align-items: start;
          max-width: 1040px;
          margin: 54px auto 0;
          padding: 22px 0;
          border-top: 1px solid rgba(151, 194, 212, 0.12);
          border-bottom: 1px solid rgba(151, 194, 212, 0.12);
        }

        .missionLabel {
          color: #64e7d1;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.2em;
        }

        .mission p {
          margin: 0;
          color: #90a8b7;
          font-size: 14px;
          line-height: 1.8;
        }

        .doors {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
          margin-top: 50px;
        }

        .door {
          --accent: #63e6ff;
          --glow: rgba(99, 230, 255, 0.3);
          position: relative;
          display: flex;
          min-height: 400px;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          padding: 28px;
          border: 1px solid rgba(160, 205, 225, 0.15);
          border-radius: 24px;
          color: inherit;
          text-decoration: none;
          background:
            linear-gradient(160deg, rgba(15, 37, 50, 0.9), rgba(5, 17, 25, 0.96)),
            rgba(5, 17, 25, 0.92);
          box-shadow:
            0 30px 70px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
          backdrop-filter: blur(18px);
          transition:
            transform 240ms ease,
            border-color 240ms ease,
            box-shadow 240ms ease;
          isolation: isolate;
        }

        .door::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -2;
          opacity: 0;
          background: linear-gradient(
            145deg,
            color-mix(in srgb, var(--accent) 12%, transparent),
            transparent 42%
          );
          transition: opacity 240ms ease;
        }

        .door:hover,
        .door:focus-visible {
          transform: translateY(-10px);
          border-color: color-mix(in srgb, var(--accent) 58%, transparent);
          box-shadow:
            0 38px 90px rgba(0, 0, 0, 0.38),
            0 0 50px var(--glow),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          outline: none;
        }

        .door:hover::before,
        .door:focus-visible::before {
          opacity: 1;
        }

        .doorGlow {
          position: absolute;
          z-index: -1;
          top: -130px;
          right: -130px;
          width: 280px;
          height: 280px;
          border-radius: 999px;
          opacity: 0.16;
          background: var(--accent);
          filter: blur(70px);
          transition: opacity 240ms ease;
        }

        .door:hover .doorGlow,
        .door:focus-visible .doorGlow {
          opacity: 0.31;
        }

        .doorTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .doorNumber {
          color: #6f8797;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .doorIcon {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          border: 1px solid color-mix(in srgb, var(--accent) 38%, transparent);
          border-radius: 18px;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 7%, transparent);
          box-shadow: 0 0 32px color-mix(in srgb, var(--accent) 10%, transparent);
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.05em;
        }

        .doorContent {
          margin-top: 50px;
        }

        .doorSubtitle {
          margin: 0 0 13px;
          color: var(--accent);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .door h2 {
          margin: 0;
          font-size: clamp(2.25rem, 4vw, 4.15rem);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .doorDescription {
          max-width: 560px;
          margin: 22px 0 0;
          color: #91a8b7;
          font-size: 14px;
          line-height: 1.74;
        }

        .doorAction {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-top: 44px;
          padding-top: 20px;
          border-top: 1px solid rgba(150, 195, 215, 0.12);
          color: #dceaf0;
          font-size: 12px;
          font-weight: 850;
        }

        .arrow {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          flex: 0 0 auto;
          border-radius: 999px;
          color: #031018;
          background: var(--accent);
          transition: transform 220ms ease;
        }

        .door:hover .arrow,
        .door:focus-visible .arrow {
          transform: translateX(5px);
        }

        .doorCorners span {
          position: absolute;
          width: 16px;
          height: 16px;
          opacity: 0.48;
          border-color: var(--accent);
        }

        .cornerOne {
          top: 12px;
          left: 12px;
          border-top: 1px solid;
          border-left: 1px solid;
        }

        .cornerTwo {
          top: 12px;
          right: 12px;
          border-top: 1px solid;
          border-right: 1px solid;
        }

        .cornerThree {
          right: 12px;
          bottom: 12px;
          border-right: 1px solid;
          border-bottom: 1px solid;
        }

        .cornerFour {
          bottom: 12px;
          left: 12px;
          border-bottom: 1px solid;
          border-left: 1px solid;
        }

        .society {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          gap: 54px;
          align-items: center;
          margin-top: 30px;
          padding: 34px;
          border: 1px solid rgba(151, 194, 212, 0.12);
          border-radius: 22px;
          background: rgba(7, 23, 33, 0.72);
          backdrop-filter: blur(14px);
        }

        .societyEyebrow {
          margin: 0 0 10px;
          color: #68e5ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.18em;
        }

        .society h3 {
          margin: 0;
          font-size: clamp(1.8rem, 3vw, 3.1rem);
          line-height: 1.02;
          letter-spacing: -0.045em;
        }

        .society > p {
          margin: 0;
          color: #91a8b7;
          font-size: 14px;
          line-height: 1.78;
        }

        .footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 42px;
          color: #637d8d;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .footerDot {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: #65e8d2;
          box-shadow: 0 0 12px #65e8d2;
        }

        .robot {
          position: absolute;
          z-index: 2;
          width: 145px;
          height: 300px;
          opacity: 0.12;
          filter: drop-shadow(0 0 18px rgba(101, 232, 210, 0.28));
          pointer-events: none;
        }

        .robotLeft {
          top: 32%;
          left: -28px;
          transform: rotate(4deg);
          animation: robotFloatLeft 8s ease-in-out infinite;
        }

        .robotRight {
          top: 20%;
          right: -36px;
          transform: rotate(-7deg) scale(0.9);
          animation: robotFloatRight 10s ease-in-out infinite;
        }

        .robotHead {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          width: 88px;
          height: 62px;
          margin: 0 auto;
          border: 1px solid #72e8ff;
          border-radius: 22px 22px 16px 16px;
          background: rgba(55, 140, 170, 0.08);
        }

        .robotEye {
          width: 9px;
          height: 5px;
          border-radius: 999px;
          background: #7bf0ff;
          box-shadow: 0 0 12px #7bf0ff;
          animation: robotBlink 4.6s infinite;
        }

        .robotNeck {
          width: 24px;
          height: 18px;
          margin: 0 auto;
          border-right: 1px solid #72e8ff;
          border-left: 1px solid #72e8ff;
        }

        .robotBody {
          position: relative;
          width: 116px;
          height: 138px;
          margin: 0 auto;
          border: 1px solid #72e8ff;
          border-radius: 26px 26px 40px 40px;
          background: rgba(55, 140, 170, 0.05);
        }

        .robotCore {
          position: absolute;
          top: 28px;
          left: 50%;
          width: 28px;
          height: 28px;
          transform: translateX(-50%);
          border: 1px solid #5df2b2;
          border-radius: 999px;
          box-shadow:
            0 0 18px rgba(93, 242, 178, 0.5),
            inset 0 0 10px rgba(93, 242, 178, 0.3);
          animation: robotCore 2.8s ease-in-out infinite;
        }

        .robotLine {
          position: absolute;
          left: 50%;
          height: 1px;
          transform: translateX(-50%);
          background: #72e8ff;
        }

        .robotLineOne {
          top: 84px;
          width: 54px;
        }

        .robotLineTwo {
          top: 101px;
          width: 34px;
        }

        .robotArm {
          position: absolute;
          top: 93px;
          width: 24px;
          height: 112px;
          border: 1px solid #72e8ff;
          border-radius: 999px;
        }

        .robotArmLeft {
          left: 0;
          transform: rotate(10deg);
          transform-origin: top center;
          animation: robotArmLeft 5.5s ease-in-out infinite;
        }

        .robotArmRight {
          right: 0;
          transform: rotate(-10deg);
          transform-origin: top center;
          animation: robotArmRight 5.5s ease-in-out infinite;
        }

        @keyframes gridShift {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(54px);
          }
        }

        @keyframes scan {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(480%);
          }
        }

        @keyframes driftOne {
          from {
            transform: translate(0, 0);
          }
          to {
            transform: translate(80px, 60px);
          }
        }

        @keyframes driftTwo {
          from {
            transform: translate(0, 0);
          }
          to {
            transform: translate(-70px, -40px);
          }
        }

        @keyframes driftThree {
          from {
            transform: translate(-20px, -20px);
          }
          to {
            transform: translate(80px, 45px);
          }
        }

        @keyframes orbit {
          from {
            transform: translateX(-50%) rotate(0deg);
          }
          to {
            transform: translateX(-50%) rotate(360deg);
          }
        }

        @keyframes orbitReverse {
          from {
            transform: translateX(-50%) rotate(45deg);
          }
          to {
            transform: translateX(-50%) rotate(-315deg);
          }
        }

        @keyframes pulseRule {
          0%,
          20% {
            left: -30%;
          }
          75%,
          100% {
            left: 100%;
          }
        }

        @keyframes freePulse {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @keyframes robotFloatLeft {
          0%,
          100% {
            transform: translateY(0) rotate(4deg);
          }
          50% {
            transform: translateY(-18px) rotate(1deg);
          }
        }

        @keyframes robotFloatRight {
          0%,
          100% {
            transform: translateY(0) rotate(-7deg) scale(0.9);
          }
          50% {
            transform: translateY(22px) rotate(-3deg) scale(0.9);
          }
        }

        @keyframes robotBlink {
          0%,
          44%,
          52%,
          100% {
            transform: scaleY(1);
          }
          48% {
            transform: scaleY(0.08);
          }
        }

        @keyframes robotCore {
          0%,
          100% {
            transform: translateX(-50%) scale(0.9);
            opacity: 0.55;
          }
          50% {
            transform: translateX(-50%) scale(1.12);
            opacity: 1;
          }
        }

        @keyframes robotArmLeft {
          0%,
          100% {
            transform: rotate(10deg);
          }
          50% {
            transform: rotate(22deg);
          }
        }

        @keyframes robotArmRight {
          0%,
          100% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(-24deg);
          }
        }

        @media (max-width: 1040px) {
          .robot {
            opacity: 0.06;
          }

          .mission {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        @media (max-width: 820px) {
          .doors {
            grid-template-columns: 1fr;
          }

          .door {
            min-height: 360px;
          }

          .society {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        @media (max-width: 700px) {
          .shell {
            width: min(100% - 24px, 1380px);
            padding-top: 28px;
          }

          .institution {
            font-size: 9px;
            letter-spacing: 0.12em;
          }

          .freeBadge {
            margin-top: 44px;
          }

          h1 {
            font-size: clamp(3rem, 15vw, 5.6rem);
          }

          .doors {
            margin-top: 38px;
          }

          .door {
            min-height: 390px;
            padding: 22px;
          }

          .doorContent {
            margin-top: 38px;
          }

          .society {
            padding: 24px;
          }

          .footer {
            flex-wrap: wrap;
            text-align: center;
          }

          .robot,
          .orbital {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </main>
  );
}
