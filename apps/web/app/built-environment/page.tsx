'use client';

import { useMemo, useState } from 'react';

type EnvironmentCard = {
  slug: string;
  title: string;
  mission: string;
  routes: string[];
  evidence: string[];
  consequence: 'C3' | 'C4' | 'C5';
  status: 'DEMONSTRATION' | 'PLANNED';
};

const environments: EnvironmentCard[] = [
  {
    slug: 'healthcare',
    title: 'Healthcare & Critical Care',
    mission:
      'Protect patients, staff, clinical environments, and continuity of care.',
    routes: [
      'Isolation pressure',
      'Operating-room humidity',
      'NICU environmental validity',
      'Emergency power',
    ],
    evidence: ['Pressure', 'Humidity', 'Particles', 'Power', 'Authority'],
    consequence: 'C5',
    status: 'DEMONSTRATION',
  },
  {
    slug: 'data-centers',
    title: 'Data Centers & Digital Infrastructure',
    mission:
      'Protect computation, connectivity, thermal margin, and electrical continuity.',
    routes: [
      'Cooling failure',
      'Generator transfer',
      'UPS-room validity',
      'Water-leak response',
    ],
    evidence: ['Temperature', 'Dew point', 'Power', 'Leak', 'Access'],
    consequence: 'C5',
    status: 'DEMONSTRATION',
  },
  {
    slug: 'battery-semiconductor',
    title: 'Battery, Semiconductor & Electronics',
    mission:
      'Protect precision manufacturing, moisture limits, contamination control, and product quality.',
    routes: [
      'Dry-room validity',
      'Entry gate',
      'Equipment start',
      'Moisture excursion',
    ],
    evidence: ['Dew point', 'Pressure', 'Particles', 'VOC', 'Process state'],
    consequence: 'C4',
    status: 'DEMONSTRATION',
  },
  {
    slug: 'cold-chain',
    title: 'Cold Chain',
    mission:
      'Protect product condition from production through storage and transfer.',
    routes: [
      'Temperature excursion',
      'Door event',
      'Compressor failure',
      'Product hold or release',
    ],
    evidence: ['Temperature', 'Humidity', 'Custody', 'Door state', 'Elapsed time'],
    consequence: 'C4',
    status: 'DEMONSTRATION',
  },
  {
    slug: 'laboratories-pharmaceutical',
    title: 'Laboratories & Pharmaceutical',
    mission:
      'Protect containment, research integrity, sample handling, and product release.',
    routes: [
      'Containment validity',
      'Pressure excursion',
      'Instrument release',
      'Verified restoration',
    ],
    evidence: ['Pressure', 'Temperature', 'Humidity', 'Particles', 'Workflow'],
    consequence: 'C5',
    status: 'PLANNED',
  },
  {
    slug: 'manufacturing',
    title: 'Manufacturing & Industrial',
    mission:
      'Protect production continuity, quality, energy, and safe restart.',
    routes: [
      'Process-condition gate',
      'Restart',
      'Robotic action',
      'Utility-loss response',
    ],
    evidence: ['Process state', 'Energy', 'Equipment', 'Authority', 'Outcome'],
    consequence: 'C4',
    status: 'PLANNED',
  },
  {
    slug: 'utilities',
    title: 'Utilities & Energy',
    mission:
      'Protect switching, dispatch, generation, storage, distribution, and restoration.',
    routes: [
      'Grid switching',
      'Demand response',
      'Generator synchronization',
      'Black start',
    ],
    evidence: ['Topology', 'Authority', 'Interlocks', 'Feedback', 'Recovery'],
    consequence: 'C5',
    status: 'DEMONSTRATION',
  },
  {
    slug: 'public-buildings',
    title: 'Public Buildings & Venues',
    mission:
      'Protect occupants, activity validity, ventilation, and event continuity.',
    routes: [
      'School IAQ validity',
      'Arena dew-point gate',
      'Closure or reopening',
      'Airport environmental response',
    ],
    evidence: ['Occupancy', 'Ventilation', 'Dew point', 'Pressure', 'Authority'],
    consequence: 'C4',
    status: 'PLANNED',
  },
  {
    slug: 'environmental-systems',
    title: 'Environmental Systems',
    mission:
      'Protect atmospheric and environmental reality across indoor, outdoor, industrial, and marine contexts.',
    routes: [
      'AIR creation',
      'Contamination response',
      'Remediation',
      'Verified outcome',
    ],
    evidence: ['Psychrometrics', 'VOC', 'Radon', 'Particulates', 'Sound'],
    consequence: 'C4',
    status: 'DEMONSTRATION',
  },
];

const chain = [
  'Reality',
  'Record',
  'Continuity',
  'Admissibility',
  'Binding',
  'Commit',
  'Execution',
  'Outcome',
];

const atmosphericChannels = [
  'Dry-bulb',
  'Wet-bulb',
  'Relative humidity',
  'Dew point',
  'Enthalpy',
  'Humidity ratio',
  'Specific volume',
  'Pressure',
  'VOCs',
  'Radon',
  'Particulate matter',
  'Sound',
  'CO₂',
];

export default function BuiltEnvironmentPage() {
  const [selected, setSelected] = useState<EnvironmentCard>(environments[0]);
  const [activeStage, setActiveStage] = useState(0);

  const selectedIndex = useMemo(
    () => environments.findIndex((item) => item.slug === selected.slug),
    [selected],
  );

  function advanceRoute() {
    setActiveStage((current) =>
      current >= chain.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <>
      <style>{`
        :root {
          color-scheme: dark;
          --bg: #03060b;
          --surface: rgba(7, 15, 25, 0.78);
          --surface-strong: rgba(10, 20, 33, 0.94);
          --line: rgba(112, 174, 229, 0.18);
          --line-strong: rgba(84, 232, 255, 0.32);
          --text: #f4f8ff;
          --muted: #93a8bd;
          --cyan: #54e8ff;
          --blue: #2b9cff;
          --green: #39f2a1;
          --amber: #ffd46a;
          --red: #ff5f78;
          --violet: #b98cff;
        }

        * { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        body {
          margin: 0;
          color: var(--text);
          background:
            radial-gradient(circle at 16% 8%, rgba(43,156,255,0.16), transparent 28%),
            radial-gradient(circle at 85% 20%, rgba(57,242,161,0.09), transparent 28%),
            radial-gradient(circle at 52% 92%, rgba(185,140,255,0.08), transparent 34%),
            linear-gradient(180deg, #02050a 0%, #06101b 52%, #02050a 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow-x: hidden;
        }

        a { color: inherit; }

        button { font: inherit; }

        .page {
          min-height: 100vh;
          position: relative;
          isolation: isolate;
        }

        .ambient {
          position: fixed;
          inset: 0;
          z-index: -2;
          overflow: hidden;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(28px);
          opacity: 0.28;
        }

        .orb.one {
          width: 38vw;
          height: 38vw;
          min-width: 380px;
          min-height: 380px;
          left: -12vw;
          top: 6vh;
          background: radial-gradient(circle, rgba(43,156,255,.48), transparent 70%);
          animation: driftOne 20s ease-in-out infinite alternate;
        }

        .orb.two {
          width: 34vw;
          height: 34vw;
          min-width: 340px;
          min-height: 340px;
          right: -10vw;
          top: 28vh;
          background: radial-gradient(circle, rgba(57,242,161,.32), transparent 70%);
          animation: driftTwo 24s ease-in-out infinite alternate;
        }

        .grid {
          position: absolute;
          inset: 0;
          opacity: .23;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: linear-gradient(to bottom, black 20%, transparent 92%);
        }

        @keyframes driftOne {
          to { transform: translate3d(18vw, 11vh, 0) scale(1.08); }
        }

        @keyframes driftTwo {
          to { transform: translate3d(-16vw, 12vh, 0) scale(1.12); }
        }

        .container {
          width: min(1220px, 92vw);
          margin: 0 auto;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 30;
          border-bottom: 1px solid var(--line);
          background: rgba(3, 7, 13, 0.82);
          backdrop-filter: blur(18px);
        }

        .topbar-inner {
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: .07em;
        }

        .brand-mark {
          min-width: 48px;
          height: 42px;
          padding: 0 8px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          border: 1px solid rgba(84,232,255,.4);
          background: linear-gradient(145deg, rgba(43,156,255,.18), rgba(57,242,161,.07));
          color: var(--cyan);
          box-shadow: 0 0 26px rgba(84,232,255,.18);
        }

        .nav {
          display: flex;
          gap: 18px;
          align-items: center;
          color: var(--muted);
          font-size: 13px;
        }

        .nav a {
          text-decoration: none;
        }

        .nav a:hover { color: white; }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 14px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,.035);
          color: white;
          font-weight: 850;
          text-decoration: none;
          cursor: pointer;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        }

        .button:hover {
          transform: translateY(-2px);
          border-color: var(--line-strong);
        }

        .button.primary {
          color: #03110d;
          border: 0;
          background: linear-gradient(90deg, var(--cyan), var(--green));
          box-shadow: 0 0 28px rgba(84,232,255,.2);
        }

        .hero {
          padding: 88px 0 68px;
          display: grid;
          grid-template-columns: 1.03fr .97fr;
          gap: 54px;
          align-items: center;
        }

        .eyebrow {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        h1 {
          margin: 18px 0 22px;
          font-size: clamp(52px, 7vw, 88px);
          line-height: .96;
          letter-spacing: -.055em;
        }

        .gradient {
          color: transparent;
          background: linear-gradient(90deg, white 0%, var(--cyan) 42%, var(--green) 76%, white 100%);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .hero-copy {
          max-width: 720px;
          color: #afc1d4;
          font-size: 19px;
          line-height: 1.72;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 28px;
        }

        .trust-note {
          margin-top: 25px;
          padding-left: 14px;
          border-left: 2px solid var(--cyan);
          color: var(--muted);
          line-height: 1.65;
          font-size: 13px;
        }

        .living-field {
          min-height: 500px;
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          border: 1px solid var(--line);
          background:
            radial-gradient(circle at 50% 45%, rgba(43,156,255,.11), transparent 46%),
            linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.012));
          box-shadow: 0 28px 90px rgba(0,0,0,.4), inset 0 0 90px rgba(43,156,255,.035);
        }

        .building {
          position: absolute;
          left: 50%;
          top: 51%;
          width: 240px;
          height: 310px;
          transform: translate(-50%, -50%) perspective(900px) rotateY(-13deg);
          border-radius: 18px 18px 8px 8px;
          border: 1px solid rgba(84,232,255,.34);
          background:
            repeating-linear-gradient(90deg, rgba(84,232,255,.08) 0 1px, transparent 1px 40px),
            repeating-linear-gradient(180deg, rgba(84,232,255,.08) 0 1px, transparent 1px 42px),
            linear-gradient(145deg, rgba(12,31,51,.96), rgba(5,12,21,.96));
          box-shadow: 0 0 65px rgba(43,156,255,.23);
        }

        .building::before {
          content: "";
          position: absolute;
          inset: 10%;
          background:
            radial-gradient(circle at 28% 22%, rgba(57,242,161,.75) 0 3px, transparent 4px),
            radial-gradient(circle at 72% 36%, rgba(255,212,106,.78) 0 3px, transparent 4px),
            radial-gradient(circle at 42% 62%, rgba(84,232,255,.9) 0 3px, transparent 4px),
            radial-gradient(circle at 68% 78%, rgba(185,140,255,.8) 0 3px, transparent 4px);
          animation: pulse 3.5s ease-in-out infinite;
        }

        @keyframes pulse {
          50% { opacity: .45; filter: blur(.5px); }
        }

        .air-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 390px;
          height: 170px;
          transform: translate(-50%, -50%) rotate(-12deg);
          border-radius: 50%;
          border: 1px solid rgba(84,232,255,.2);
          box-shadow: 0 0 30px rgba(84,232,255,.12);
          animation: orbit 18s linear infinite;
        }

        .air-ring.two {
          width: 470px;
          height: 220px;
          transform: translate(-50%, -50%) rotate(18deg);
          border-color: rgba(57,242,161,.16);
          animation-duration: 24s;
          animation-direction: reverse;
        }

        @keyframes orbit {
          to { transform: translate(-50%, -50%) rotate(348deg); }
        }

        .field-label {
          position: absolute;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.09);
          background: rgba(4,10,18,.82);
          color: #c5d4e4;
          font-size: 11px;
          font-weight: 850;
          backdrop-filter: blur(12px);
        }

        .label-one { left: 7%; top: 16%; }
        .label-two { right: 7%; top: 26%; }
        .label-three { left: 8%; bottom: 18%; }
        .label-four { right: 8%; bottom: 14%; }

        .field-caption {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 22px;
          display: flex;
          justify-content: space-between;
          gap: 14px;
          color: var(--muted);
          font-size: 11px;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .section {
          padding: 84px 0;
        }

        .section-head {
          max-width: 850px;
          margin-bottom: 32px;
        }

        .section-head h2 {
          margin: 10px 0 14px;
          font-size: clamp(38px, 5vw, 60px);
          line-height: 1.02;
          letter-spacing: -.045em;
        }

        .section-head p {
          margin: 0;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.7;
        }

        .environment-layout {
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 22px;
        }

        .environment-list {
          display: grid;
          gap: 10px;
        }

        .environment-button {
          width: 100%;
          padding: 18px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          text-align: left;
          color: white;
          cursor: pointer;
          border-radius: 16px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,.026);
        }

        .environment-button:hover,
        .environment-button.active {
          border-color: rgba(84,232,255,.35);
          background: linear-gradient(135deg, rgba(43,156,255,.08), rgba(57,242,161,.035));
        }

        .environment-button strong {
          display: block;
          font-size: 14px;
        }

        .environment-button small {
          color: var(--muted);
        }

        .detail-card {
          min-height: 620px;
          position: sticky;
          top: 96px;
          padding: 30px;
          border-radius: 28px;
          border: 1px solid var(--line-strong);
          background:
            radial-gradient(circle at 80% 0%, rgba(57,242,161,.07), transparent 38%),
            linear-gradient(145deg, rgba(9,20,33,.94), rgba(4,10,18,.92));
          box-shadow: 0 24px 70px rgba(0,0,0,.33);
        }

        .detail-top {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-start;
        }

        .detail-card h3 {
          margin: 14px 0 10px;
          font-size: 34px;
          letter-spacing: -.035em;
        }

        .detail-card > p {
          color: var(--muted);
          line-height: 1.7;
        }

        .status-chip,
        .class-chip {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid rgba(84,232,255,.22);
          color: var(--cyan);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 24px;
        }

        .detail-panel {
          min-height: 190px;
          padding: 18px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.025);
        }

        .detail-panel h4 {
          margin: 0 0 14px;
          color: var(--cyan);
          font-size: 11px;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .detail-panel ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 10px;
          color: #c1cfdd;
          font-size: 13px;
        }

        .detail-panel li::before {
          content: "→";
          color: var(--green);
          margin-right: 9px;
        }

        .selected-index {
          margin-top: 22px;
          color: #6f8599;
          font-family: "SFMono-Regular", Consolas, monospace;
          font-size: 11px;
        }

        .chain-panel {
          padding: 32px;
          border-radius: 28px;
          border: 1px solid var(--line);
          background: var(--surface);
          backdrop-filter: blur(14px);
        }

        .chain-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 9px;
          margin-top: 24px;
        }

        .chain-stage {
          min-height: 98px;
          padding: 14px 9px;
          display: grid;
          place-items: center;
          text-align: center;
          border-radius: 15px;
          border: 1px solid var(--line);
          color: var(--muted);
          background: rgba(255,255,255,.025);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .chain-stage.active {
          color: white;
          border-color: rgba(84,232,255,.46);
          background: linear-gradient(145deg, rgba(43,156,255,.16), rgba(57,242,161,.07));
          box-shadow: 0 0 26px rgba(84,232,255,.12);
        }

        .chain-stage.complete {
          color: var(--green);
          border-color: rgba(57,242,161,.24);
        }

        .chain-actions {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          margin-top: 22px;
        }

        .chain-state {
          color: var(--muted);
          font-size: 13px;
        }

        .air-layout {
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 22px;
        }

        .air-core {
          min-height: 500px;
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 28px;
          border: 1px solid rgba(84,232,255,.24);
          background: radial-gradient(circle at center, rgba(43,156,255,.12), transparent 48%), var(--surface);
          overflow: hidden;
        }

        .air-orb {
          width: 166px;
          height: 166px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          text-align: center;
          font-weight: 950;
          letter-spacing: .1em;
          background: radial-gradient(circle at 34% 27%, white 0 2%, var(--cyan) 4%, #0d4c80 34%, #061321 68%);
          box-shadow: 0 0 65px rgba(43,156,255,.5), 0 0 110px rgba(57,242,161,.13);
          z-index: 3;
        }

        .air-core-ring {
          position: absolute;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          border: 1px solid rgba(84,232,255,.18);
          animation: orbit 22s linear infinite;
        }

        .air-core-ring.two {
          width: 430px;
          height: 230px;
          border-color: rgba(57,242,161,.15);
          animation-direction: reverse;
        }

        .channels {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 11px;
        }

        .channel {
          min-height: 68px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 15px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,.025);
        }

        .channel-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 14px rgba(84,232,255,.75);
        }

        .channel strong {
          display: block;
          font-size: 13px;
        }

        .channel small {
          color: var(--muted);
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .action-card {
          min-height: 210px;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: linear-gradient(145deg, rgba(255,255,255,.042), rgba(255,255,255,.014));
          text-decoration: none;
        }

        .action-card:hover {
          border-color: rgba(84,232,255,.34);
          transform: translateY(-2px);
        }

        .action-card span {
          display: inline-flex;
          min-height: 28px;
          padding: 0 9px;
          align-items: center;
          border-radius: 999px;
          color: var(--cyan);
          border: 1px solid rgba(84,232,255,.18);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .action-card h3 {
          margin: 20px 0 10px;
          font-size: 22px;
        }

        .action-card p {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
        }

        .boundary {
          padding: 36px;
          border-radius: 28px;
          border: 1px solid rgba(255,212,106,.26);
          background: linear-gradient(145deg, rgba(255,212,106,.06), rgba(255,255,255,.015));
        }

        .boundary h2 {
          margin: 10px 0 14px;
          font-size: clamp(34px, 4.7vw, 56px);
          line-height: 1.04;
          letter-spacing: -.04em;
        }

        .boundary p {
          max-width: 920px;
          color: #bdcad6;
          font-size: 17px;
          line-height: 1.72;
        }

        .boundary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 13px;
          margin-top: 24px;
        }

        .boundary-item {
          padding: 16px;
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(0,0,0,.13);
        }

        .boundary-item strong {
          display: block;
          margin-bottom: 7px;
          color: var(--amber);
        }

        .boundary-item small {
          color: var(--muted);
          line-height: 1.5;
        }

        .footer {
          margin-top: 54px;
          padding: 46px 0;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 13px;
        }

        @media (max-width: 1050px) {
          .hero,
          .environment-layout,
          .air-layout {
            grid-template-columns: 1fr;
          }

          .detail-card {
            position: static;
            min-height: auto;
          }

          .chain-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .action-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .boundary-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 760px) {
          .nav a:not(.button) {
            display: none;
          }

          .brand span:last-child {
            display: none;
          }

          .hero {
            padding-top: 58px;
          }

          h1 {
            font-size: 48px;
          }

          .detail-grid,
          .channels,
          .action-grid,
          .boundary-grid {
            grid-template-columns: 1fr;
          }

          .chain-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .chain-actions {
            align-items: flex-start;
            flex-direction: column;
          }

          .living-field {
            min-height: 440px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .orb,
          .building::before,
          .air-ring,
          .air-core-ring {
            animation: none !important;
          }

          * {
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div className="page">
        <div className="ambient" aria-hidden="true">
          <div className="orb one" />
          <div className="orb two" />
          <div className="grid" />
        </div>

        <header className="topbar">
          <div className="container topbar-inner">
            <a className="brand" href="/">
              <span className="brand-mark">TA-14</span>
              <span>BUILT ENVIRONMENT EXCHANGE</span>
            </a>

            <nav className="nav" aria-label="Built Environment navigation">
              <a href="#environments">Environments</a>
              <a href="#architecture">Architecture</a>
              <a href="#atmospheric-integrity">Atmospheric Integrity</a>
              <a href="#actions">Actions</a>
              <a className="button primary" href="/built-environment/routes/new">
                Build Route
              </a>
            </nav>
          </div>
        </header>

        <main>
          <section className="container hero">
            <div>
              <div className="eyebrow">Mission-specific constitutional execution</div>

              <h1>
                Govern consequential execution across
                <br />
                <span className="gradient">critical environments.</span>
              </h1>

              <p className="hero-copy">
                Choose an environment, build or select a governed route, bind
                qualified evidence and authority, correct HOLD conditions,
                preserve execution and outcome, and independently verify what
                occurred.
              </p>

              <div className="hero-actions">
                <a className="button primary" href="#environments">
                  Choose Environment
                </a>
                <a className="button" href="/built-environment/routes/override-demo">
                  Run BAS Override Demo
                </a>
                <a
                  className="button"
                  href="/built-environment/atmospheric-integrity/new"
                >
                  Create AIR
                </a>
              </div>

              <p className="trust-note">
                TA-14 does not replace BAS, SCADA, clinical authority,
                engineering, commissioning, grid operations, or professional
                judgment. Operational systems retain control. TA-14 evaluates
                and preserves the bounded route from Reality to Outcome.
              </p>
            </div>

            <div
              className="living-field"
              aria-label="Living critical-environment field"
            >
              <div className="air-ring" />
              <div className="air-ring two" />
              <div className="building" />
              <div className="field-label label-one">ATMOSPHERIC REALITY</div>
              <div className="field-label label-two">ELECTRICAL CONTINUITY</div>
              <div className="field-label label-three">GOVERNED ROUTES</div>
              <div className="field-label label-four">REPLAYABLE OUTCOMES</div>
              <div className="field-caption">
                <span>Living environment preview</span>
                <span>Demonstration</span>
              </div>
            </div>
          </section>

          <section id="environments" className="container section">
            <div className="section-head">
              <div className="eyebrow">Choose your environment</div>
              <h2>Organized by mission and consequence—not device category.</h2>
              <p>
                Every workspace uses the same constitutional object, decision,
                record, replay, and verification architecture while adapting its
                route library, evidence patterns, authority model, and outcome
                windows to the mission.
              </p>
            </div>

            <div className="environment-layout">
              <div className="environment-list">
                {environments.map((environment) => (
                  <button
                    key={environment.slug}
                    className={`environment-button ${
                      selected.slug === environment.slug ? 'active' : ''
                    }`}
                    type="button"
                    onClick={() => setSelected(environment)}
                    aria-pressed={selected.slug === environment.slug}
                  >
                    <span>
                      <strong>{environment.title}</strong>
                      <small>{environment.consequence} default lane</small>
                    </span>
                    <span className="status-chip">{environment.status}</span>
                  </button>
                ))}
              </div>

              <article className="detail-card" aria-live="polite">
                <div className="detail-top">
                  <div>
                    <div className="eyebrow">Mission workspace</div>
                    <h3>{selected.title}</h3>
                  </div>
                  <span className="class-chip">{selected.consequence}</span>
                </div>

                <p>{selected.mission}</p>

                <div className="detail-grid">
                  <div className="detail-panel">
                    <h4>Representative governed routes</h4>
                    <ul>
                      {selected.routes.map((route) => (
                        <li key={route}>{route}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="detail-panel">
                    <h4>Representative evidence</h4>
                    <ul>
                      {selected.evidence.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="hero-actions">
                  <a
                    className="button primary"
                    href={`/built-environment/${selected.slug}`}
                  >
                    Open Workspace
                  </a>
                  <a
                    className="button"
                    href={`/built-environment/routes/new?environment=${selected.slug}`}
                  >
                    Create Route
                  </a>
                </div>

                <div className="selected-index">
                  ENVIRONMENT {String(selectedIndex + 1).padStart(2, '0')} /{' '}
                  {String(environments.length).padStart(2, '0')}
                </div>
              </article>
            </div>
          </section>

          <section id="architecture" className="container section">
            <div className="section-head">
              <div className="eyebrow">Shared constitutional core</div>
              <h2>Every environment speaks the same execution language.</h2>
              <p>
                The mission changes. The governing chain does not. Use the
                demonstration control to move through the route one stage at a
                time.
              </p>
            </div>

            <div className="chain-panel">
              <div className="chain-grid">
                {chain.map((stage, index) => (
                  <div
                    key={stage}
                    className={`chain-stage ${
                      index === activeStage
                        ? 'active'
                        : index < activeStage
                          ? 'complete'
                          : ''
                    }`}
                  >
                    {stage}
                  </div>
                ))}
              </div>

              <div className="chain-actions">
                <div className="chain-state" aria-live="polite">
                  Active stage: <strong>{chain[activeStage]}</strong>
                </div>
                <button className="button primary" type="button" onClick={advanceRoute}>
                  Advance Route
                </button>
              </div>
            </div>
          </section>

          <section id="atmospheric-integrity" className="container section">
            <div className="section-head">
              <div className="eyebrow">Atmospheric Integrity Record</div>
              <h2>Environmental reality becomes governed evidence.</h2>
              <p>
                An AIR is not a sensor dashboard. It preserves a declared place,
                activity, time boundary, evidence set, intervention, outcome,
                limitations, and proof boundary.
              </p>
            </div>

            <div className="air-layout">
              <div className="air-core" aria-label="Atmospheric Integrity core">
                <div className="air-core-ring" />
                <div className="air-core-ring two" />
                <div className="air-orb">
                  AIR
                  <br />
                  CORE
                </div>
              </div>

              <div className="channels">
                {atmosphericChannels.map((channel, index) => (
                  <div className="channel" key={channel}>
                    <span className="channel-dot" />
                    <span>
                      <strong>{channel}</strong>
                      <small>
                        {index < 7
                          ? 'Psychrometric evidence'
                          : 'Qualified atmospheric evidence'}
                      </small>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="actions" className="container section">
            <div className="section-head">
              <div className="eyebrow">Shared operating surfaces</div>
              <h2>Build, inspect, preserve, replay, and verify.</h2>
              <p>
                The domain landing page is the entry point. Every action leads
                into a bounded operating surface within the Built Environment
                Exchange.
              </p>
            </div>

            <div className="action-grid">
              <a className="action-card" href="/built-environment/routes/new">
                <span>LIVE PATH</span>
                <h3>Create Governed Route</h3>
                <p>
                  Choose a mission workspace and begin from a governed route
                  template.
                </p>
              </a>

              <a
                className="action-card"
                href="/built-environment/atmospheric-integrity/new"
              >
                <span>DEMONSTRATION</span>
                <h3>Create Atmospheric Integrity Record</h3>
                <p>
                  Declare the place, activity, evidence purpose, boundaries, and
                  outcome window.
                </p>
              </a>

              <a className="action-card" href="/built-environment/records">
                <span>PLANNED</span>
                <h3>Inspect Governed Records</h3>
                <p>
                  Review decision, evidence, authority, execution, outcome, and
                  unresolved findings.
                </p>
              </a>

              <a className="action-card" href="/built-environment/verify">
                <span>PLANNED</span>
                <h3>Verify Record Package</h3>
                <p>
                  Check hashes, signatures, continuity, dependencies, replay
                  status, and proof boundaries.
                </p>
              </a>
            </div>
          </section>

          <section className="container section">
            <div className="boundary">
              <div className="eyebrow">Constitutional boundary</div>
              <h2>Strong records preserve exactly what was proven.</h2>
              <p>
                Every route must identify what TA-14 evaluated, what another
                operational system controls, what remains professional
                responsibility, what was assumed, what is unknown, the valid
                time and physical boundaries, and what the resulting record does
                and does not demonstrate.
              </p>

              <div className="boundary-grid">
                <div className="boundary-item">
                  <strong>Operational-system boundary</strong>
                  <small>
                    What BAS, SCADA, controllers, AI, CMMS, or digital twins
                    control or determine.
                  </small>
                </div>
                <div className="boundary-item">
                  <strong>Professional boundary</strong>
                  <small>
                    What remains with clinicians, engineers, operators,
                    commissioning, TAB, cybersecurity, and code authority.
                  </small>
                </div>
                <div className="boundary-item">
                  <strong>Proof boundary</strong>
                  <small>
                    What the governed record demonstrates—and what it does not
                    demonstrate.
                  </small>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container">
            <strong>TA-14 Built Environment Exchange</strong>
            <p>
              The Built Environment supplies operational reality. TA-14 supplies
              admissible execution.
            </p>
            <p>No admissible evidence. No admissible execution.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
