'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type RouteState = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';
type StageStatus = 'complete' | 'active' | 'warning' | 'failed' | 'pending';

type Stage = {
  name: string;
  short: string;
  description: string;
  evidence: string[];
};

type Scenario = {
  id: string;
  title: string;
  subtitle: string;
  state: RouteState;
  activeStage: number;
  integrity: number;
  authority: number;
  continuity: number;
  evidence: number;
  stages: StageStatus[];
  findings: string[];
};

const stages: Stage[] = [
  {
    name: 'Reality',
    short: 'Observe',
    description:
      'The route begins with the condition that actually exists, not the condition an operator assumes exists.',
    evidence: ['Sensor state', 'Source event', 'Observed condition'],
  },
  {
    name: 'Record',
    short: 'Capture',
    description:
      'Reality is converted into attributable, timestamped, durable evidence objects.',
    evidence: ['Primary record', 'Timestamp', 'Actor attribution'],
  },
  {
    name: 'Continuity',
    short: 'Preserve',
    description:
      'The system proves that evidence remained connected, ordered, and free from unexplained substitution.',
    evidence: ['Hash continuity', 'Custody history', 'Version lineage'],
  },
  {
    name: 'Admissibility',
    short: 'Evaluate',
    description:
      'Evidence is tested against governing requirements before execution may proceed.',
    evidence: ['Threshold result', 'Contradiction check', 'Completeness result'],
  },
  {
    name: 'Binding',
    short: 'Bind',
    description:
      'The actor, authority, object, destination, and intended consequence are bound into one route identity.',
    evidence: ['Actor identity', 'Authority basis', 'Destination binding'],
  },
  {
    name: 'Commit',
    short: 'Freeze',
    description:
      'The authorized execution object is frozen so later action can be compared against what was approved.',
    evidence: ['Commit hash', 'Approved object', 'Execution boundary'],
  },
  {
    name: 'Execution',
    short: 'Act',
    description:
      'The system permits only the committed action and preserves execution receipts.',
    evidence: ['Execution receipt', 'Action trace', 'Runtime state'],
  },
  {
    name: 'Outcome',
    short: 'Verify',
    description:
      'The resulting consequence is tested against the committed route and preserved as a verifiable outcome.',
    evidence: ['Outcome record', 'Correspondence result', 'Replay package'],
  },
];

const scenarios: Scenario[] = [
  {
    id: 'allow',
    title: 'Admissible Supplier Payment',
    subtitle: 'Dual authority, beneficiary proof, and route continuity remain intact.',
    state: 'ALLOW',
    activeStage: 7,
    integrity: 99,
    authority: 100,
    continuity: 98,
    evidence: 96,
    stages: [
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'active',
    ],
    findings: [
      'All required evidence objects are present.',
      'Dual authority is valid and route-bound.',
      'Committed payment object matches execution.',
      'Outcome correspondence is preserved.',
    ],
  },
  {
    id: 'hold',
    title: 'Missing Beneficiary Proof',
    subtitle: 'The route is structurally valid but cannot execute until one required proof is supplied.',
    state: 'HOLD',
    activeStage: 3,
    integrity: 96,
    authority: 88,
    continuity: 97,
    evidence: 71,
    stages: [
      'complete',
      'complete',
      'complete',
      'warning',
      'pending',
      'pending',
      'pending',
      'pending',
    ],
    findings: [
      'Beneficiary ownership proof is missing.',
      'Existing records remain authentic.',
      'The route may be corrected without deleting the original HOLD.',
      'Execution remains unavailable.',
    ],
  },
  {
    id: 'deny',
    title: 'Authority Conflict',
    subtitle: 'The approving actor lacks valid authority for the requested consequence.',
    state: 'DENY',
    activeStage: 4,
    integrity: 98,
    authority: 21,
    continuity: 96,
    evidence: 89,
    stages: [
      'complete',
      'complete',
      'complete',
      'complete',
      'failed',
      'pending',
      'pending',
      'pending',
    ],
    findings: [
      'Actor identity is valid.',
      'Authority scope excludes this transaction class.',
      'No admissible binding can be formed.',
      'The requested execution is denied.',
    ],
  },
  {
    id: 'escalate',
    title: 'Material Contradiction',
    subtitle: 'Conflicting evidence is authentic and consequential, requiring independent review.',
    state: 'ESCALATE',
    activeStage: 3,
    integrity: 94,
    authority: 92,
    continuity: 90,
    evidence: 64,
    stages: [
      'complete',
      'complete',
      'warning',
      'warning',
      'pending',
      'pending',
      'pending',
      'pending',
    ],
    findings: [
      'Two authentic records materially conflict.',
      'No evidence object can be silently preferred.',
      'Automated execution is suspended.',
      'Independent review is required.',
    ],
  },
];

function stateColor(state: RouteState) {
  if (state === 'ALLOW') return 'var(--green)';
  if (state === 'HOLD') return 'var(--gold)';
  if (state === 'DENY') return 'var(--red)';
  return 'var(--violet)';
}

export default function ExecutionMapPage() {
  const [scenarioId, setScenarioId] = useState('allow');
  const [selectedStage, setSelectedStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenario = useMemo(
    () => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0],
    [scenarioId],
  );

  const stage = stages[selectedStage];

  function replayRoute() {
    setIsPlaying(true);
    setSelectedStage(0);

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setSelectedStage(Math.min(index, scenario.activeStage));

      if (index >= scenario.activeStage) {
        window.clearInterval(timer);
        window.setTimeout(() => setIsPlaying(false), 450);
      }
    }, 520);
  }

  return (
    <>
      <style>{`
        :root {
          --bg: #02050a;
          --panel: rgba(8, 17, 29, 0.78);
          --line: rgba(126, 180, 230, 0.16);
          --text: #f4f8ff;
          --muted: #91a5ba;
          --cyan: #57e6ff;
          --blue: #319cff;
          --green: #38f2a2;
          --gold: #ffd36b;
          --red: #ff5577;
          --violet: #b88cff;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          color: var(--text);
          background:
            radial-gradient(circle at 12% 0%, rgba(49,156,255,0.17), transparent 30%),
            radial-gradient(circle at 88% 12%, rgba(184,140,255,0.10), transparent 28%),
            linear-gradient(180deg, #02050a 0%, #06111d 52%, #02050a 100%);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button {
          font: inherit;
        }

        .map-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .map-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.2;
          background-image:
            linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: linear-gradient(to bottom, black, transparent 96%);
        }

        .shell {
          width: min(1280px, 94vw);
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid var(--line);
          background: rgba(3, 8, 15, 0.82);
          backdrop-filter: blur(20px);
        }

        .topbar-inner {
          min-height: 72px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: var(--cyan);
          border: 1px solid rgba(87,230,255,0.38);
          background: linear-gradient(145deg, rgba(49,156,255,0.18), rgba(56,242,162,0.06));
          box-shadow: 0 0 28px rgba(87,230,255,0.16);
        }

        .top-links {
          display: flex;
          gap: 20px;
        }

        .top-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
        }

        .top-links a:hover {
          color: white;
        }

        .hero {
          padding: 84px 0 44px;
          text-align: center;
        }

        .eyebrow {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        h1 {
          margin: 14px auto 20px;
          max-width: 1050px;
          font-size: clamp(56px, 7.4vw, 104px);
          line-height: 0.91;
          letter-spacing: -0.065em;
        }

        .gradient {
          color: transparent;
          background: linear-gradient(90deg, white, var(--cyan), var(--green));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero p {
          max-width: 860px;
          margin: 0 auto;
          color: #b2c2d4;
          font-size: 19px;
          line-height: 1.7;
        }

        .scenario-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin: 30px 0 18px;
        }

        .scenario-button {
          min-height: 92px;
          padding: 16px;
          text-align: left;
          border-radius: 18px;
          border: 1px solid var(--line);
          color: white;
          background: rgba(255,255,255,0.026);
          cursor: pointer;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .scenario-button:hover {
          transform: translateY(-3px);
        }

        .scenario-button.active {
          border-color: color-mix(in srgb, var(--scenario-color) 42%, transparent);
          background: color-mix(in srgb, var(--scenario-color) 9%, rgba(255,255,255,0.025));
          box-shadow: 0 0 38px color-mix(in srgb, var(--scenario-color) 14%, transparent);
        }

        .scenario-button span {
          display: block;
          color: var(--scenario-color);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .scenario-button strong {
          display: block;
          margin-top: 8px;
          font-size: 15px;
          line-height: 1.3;
        }

        .workspace {
          margin-bottom: 92px;
          padding: 20px;
          border: 1px solid var(--line);
          border-radius: 28px;
          background: var(--panel);
          box-shadow: 0 30px 90px rgba(0,0,0,0.28);
        }

        .workspace-top {
          padding: 12px 10px 24px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          align-items: center;
        }

        .workspace-top h2 {
          margin: 7px 0 7px;
          font-size: 30px;
          letter-spacing: -0.04em;
        }

        .workspace-top p {
          margin: 0;
          color: var(--muted);
          line-height: 1.55;
        }

        .state-block {
          text-align: right;
        }

        .state-label {
          color: var(--muted);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .state-value {
          margin-top: 5px;
          color: var(--state-color);
          font-size: 44px;
          font-weight: 950;
          letter-spacing: -0.05em;
          text-shadow: 0 0 32px color-mix(in srgb, var(--state-color) 30%, transparent);
        }

        .map-shell {
          min-height: 560px;
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid var(--line);
          background:
            radial-gradient(circle at center, rgba(49,156,255,0.08), transparent 38%),
            linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.008));
        }

        .orbit {
          position: absolute;
          left: 50%;
          top: 46%;
          width: 760px;
          height: 340px;
          transform: translate(-50%, -50%) perspective(900px) rotateX(62deg);
          border: 1px solid rgba(87,230,255,0.18);
          border-radius: 50%;
          box-shadow:
            inset 0 0 60px rgba(87,230,255,0.05),
            0 0 70px rgba(49,156,255,0.05);
        }

        .orbit::before,
        .orbit::after {
          content: "";
          position: absolute;
          inset: 12%;
          border-radius: 50%;
          border: 1px dashed rgba(255,255,255,0.09);
        }

        .orbit::after {
          inset: 27%;
        }

        .core {
          position: absolute;
          left: 50%;
          top: 46%;
          width: 150px;
          height: 150px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          display: grid;
          place-items: center;
          text-align: center;
          border: 1px solid color-mix(in srgb, var(--state-color) 35%, transparent);
          background:
            radial-gradient(circle, color-mix(in srgb, var(--state-color) 18%, rgba(5,12,22,.95)), rgba(5,12,22,.92));
          box-shadow:
            0 0 70px color-mix(in srgb, var(--state-color) 18%, transparent),
            inset 0 0 40px rgba(255,255,255,0.03);
          z-index: 4;
        }

        .core span {
          display: block;
          color: var(--muted);
          font-size: 9px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .core strong {
          display: block;
          margin-top: 7px;
          color: var(--state-color);
          font-size: 25px;
        }

        .stage-node {
          --angle: calc(var(--i) * 45deg);
          position: absolute;
          left: 50%;
          top: 46%;
          width: 112px;
          height: 112px;
          transform:
            translate(-50%, -50%)
            rotate(var(--angle))
            translateX(360px)
            rotate(calc(var(--angle) * -1));
          border-radius: 22px;
          border: 1px solid var(--line);
          color: white;
          background: rgba(5,12,22,0.92);
          cursor: pointer;
          z-index: 5;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease;
        }

        .stage-node:hover {
          transform:
            translate(-50%, -50%)
            rotate(var(--angle))
            translateX(360px)
            rotate(calc(var(--angle) * -1))
            scale(1.07);
        }

        .stage-node.selected {
          border-color: rgba(87,230,255,0.55);
          box-shadow: 0 0 34px rgba(87,230,255,0.18);
        }

        .stage-node.complete {
          border-color: rgba(56,242,162,0.33);
        }

        .stage-node.active {
          border-color: rgba(87,230,255,0.52);
          box-shadow: 0 0 34px rgba(87,230,255,0.2);
        }

        .stage-node.warning {
          border-color: rgba(255,211,107,0.46);
        }

        .stage-node.failed {
          border-color: rgba(255,85,119,0.5);
        }

        .stage-node.pending {
          opacity: 0.55;
        }

        .stage-node-inner {
          height: 100%;
          padding: 13px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .node-number {
          color: var(--muted);
          font-size: 10px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        .node-name {
          font-weight: 900;
          font-size: 15px;
        }

        .node-status {
          color: var(--muted);
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .stage-node.complete .node-status {
          color: var(--green);
        }

        .stage-node.active .node-status {
          color: var(--cyan);
        }

        .stage-node.warning .node-status {
          color: var(--gold);
        }

        .stage-node.failed .node-status {
          color: var(--red);
        }

        .pulse {
          position: absolute;
          left: 50%;
          top: 46%;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--state-color);
          box-shadow: 0 0 28px var(--state-color);
          transform:
            translate(-50%, -50%)
            rotate(calc(var(--progress) * 45deg))
            translateX(250px);
          transition: transform 460ms ease;
          z-index: 6;
        }

        .map-caption {
          position: absolute;
          left: 24px;
          bottom: 20px;
          color: var(--muted);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .details {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 1fr 1fr 0.9fr;
          gap: 14px;
        }

        .panel {
          padding: 22px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: rgba(255,255,255,0.024);
        }

        .panel-label {
          color: var(--muted);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .panel h3 {
          margin: 9px 0 10px;
          font-size: 23px;
          letter-spacing: -0.03em;
        }

        .panel p {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
          font-size: 14px;
        }

        .evidence-list,
        .finding-list {
          margin: 18px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 9px;
        }

        .evidence-list li,
        .finding-list li {
          padding: 11px 12px;
          border: 1px solid var(--line);
          border-radius: 12px;
          color: #dce7f2;
          background: rgba(255,255,255,0.018);
          font-size: 13px;
          line-height: 1.45;
        }

        .metric-grid {
          margin-top: 15px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .metric {
          padding: 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
        }

        .metric span {
          display: block;
          color: var(--muted);
          font-size: 9px;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .metric strong {
          display: block;
          margin-top: 6px;
          font-size: 19px;
        }

        .actions {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .primary,
        .secondary {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 17px;
          border-radius: 13px;
          text-decoration: none;
          font-weight: 900;
        }

        .primary {
          border: 0;
          cursor: pointer;
          color: #03110b;
          background: linear-gradient(90deg, var(--cyan), var(--green));
          box-shadow: 0 0 34px rgba(87,230,255,0.16);
        }

        .primary:disabled {
          opacity: 0.62;
          cursor: wait;
        }

        .secondary {
          color: white;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.03);
        }

        @media (max-width: 1100px) {
          .scenario-bar {
            grid-template-columns: repeat(2, 1fr);
          }

          .details {
            grid-template-columns: 1fr;
          }

          .map-shell {
            min-height: 820px;
          }

          .orbit {
            width: 560px;
            height: 560px;
            transform: translate(-50%, -50%);
            top: 47%;
          }

          .stage-node {
            top: 47%;
            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translateX(280px)
              rotate(calc(var(--angle) * -1));
          }

          .stage-node:hover {
            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translateX(280px)
              rotate(calc(var(--angle) * -1))
              scale(1.05);
          }

          .pulse {
            top: 47%;
            transform:
              translate(-50%, -50%)
              rotate(calc(var(--progress) * 45deg))
              translateX(198px);
          }

          .core {
            top: 47%;
          }
        }

        @media (max-width: 720px) {
          .top-links a:not(:last-child) {
            display: none;
          }

          .hero {
            padding-top: 58px;
          }

          h1 {
            font-size: 52px;
          }

          .scenario-bar {
            grid-template-columns: 1fr;
          }

          .workspace-top {
            grid-template-columns: 1fr;
          }

          .state-block {
            text-align: left;
          }

          .map-shell {
            min-height: 1060px;
            padding: 18px;
            display: grid;
            gap: 10px;
          }

          .orbit,
          .pulse,
          .core {
            display: none;
          }

          .stage-node {
            --angle: 0deg;
            position: relative;
            left: auto;
            top: auto;
            width: 100%;
            height: 104px;
            transform: none;
          }

          .stage-node:hover {
            transform: translateY(-2px);
          }

          .map-caption {
            display: none;
          }
        }
      `}</style>

      <div className="map-page">
        <header className="topbar">
          <div className="shell topbar-inner">
            <Link className="brand" href="/">
              <span className="brand-mark">14</span>
              <span>TA-14 EXECUTION MAP</span>
            </Link>

            <nav className="top-links">
              <Link href="/architecture">Architecture</Link>
              <Link href="/runtime">Runtime Gate</Link>
              <Link href="/records">Records</Link>
              <Link href="/verify">Verify</Link>
            </nav>
          </div>
        </header>

        <main className="shell">
          <section className="hero">
            <div className="eyebrow">Cinematic route intelligence</div>

            <h1>
              Watch consequence move
              <br />
              <span className="gradient">through admissibility.</span>
            </h1>

            <p>
              Explore how evidence, authority, continuity, binding, commitment,
              execution, and outcome interact before a consequential route is
              allowed to create reality.
            </p>
          </section>

          <section className="scenario-bar">
            {scenarios.map((item) => (
              <button
                className={`scenario-button ${scenarioId === item.id ? 'active' : ''}`}
                key={item.id}
                type="button"
                style={
                  {
                    '--scenario-color': stateColor(item.state),
                  } as React.CSSProperties
                }
                onClick={() => {
                  setScenarioId(item.id);
                  setSelectedStage(Math.min(item.activeStage, 3));
                }}
              >
                <span>{item.state}</span>
                <strong>{item.title}</strong>
              </button>
            ))}
          </section>

          <section
            className="workspace"
            style={
              {
                '--state-color': stateColor(scenario.state),
              } as React.CSSProperties
            }
          >
            <div className="workspace-top">
              <div>
                <div className="eyebrow">Active route</div>
                <h2>{scenario.title}</h2>
                <p>{scenario.subtitle}</p>
              </div>

              <div className="state-block">
                <div className="state-label">Current route state</div>
                <div className="state-value">{scenario.state}</div>
              </div>
            </div>

            <div className="map-shell">
              <div className="orbit" />

              <div className="core">
                <div>
                  <span>Execution state</span>
                  <strong>{scenario.state}</strong>
                </div>
              </div>

              <div
                className="pulse"
                style={
                  {
                    '--progress': Math.min(selectedStage, scenario.activeStage),
                  } as React.CSSProperties
                }
              />

              {stages.map((item, index) => (
                <button
                  className={`stage-node ${scenario.stages[index]} ${
                    selectedStage === index ? 'selected' : ''
                  }`}
                  key={item.name}
                  type="button"
                  style={
                    {
                      '--i': index,
                    } as React.CSSProperties
                  }
                  onClick={() => setSelectedStage(index)}
                >
                  <div className="stage-node-inner">
                    <span className="node-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <strong className="node-name">{item.name}</strong>
                    <span className="node-status">
                      {scenario.stages[index]}
                    </span>
                  </div>
                </button>
              ))}

              <div className="map-caption">
                Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome
              </div>
            </div>

            <div className="details">
              <article className="panel">
                <div className="panel-label">Selected stage</div>
                <h3>{stage.name}</h3>
                <p>{stage.description}</p>

                <ul className="evidence-list">
                  {stage.evidence.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="panel">
                <div className="panel-label">Route findings</div>
                <h3>{scenario.state} rationale</h3>

                <ul className="finding-list">
                  {scenario.findings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="panel">
                <div className="panel-label">Execution telemetry</div>
                <h3>Route integrity</h3>
                <p>
                  These indicators summarize the current demonstration route.
                </p>

                <div className="metric-grid">
                  <div className="metric">
                    <span>Integrity</span>
                    <strong>{scenario.integrity}%</strong>
                  </div>
                  <div className="metric">
                    <span>Authority</span>
                    <strong>{scenario.authority}%</strong>
                  </div>
                  <div className="metric">
                    <span>Continuity</span>
                    <strong>{scenario.continuity}%</strong>
                  </div>
                  <div className="metric">
                    <span>Evidence</span>
                    <strong>{scenario.evidence}%</strong>
                  </div>
                </div>
              </article>
            </div>

            <div className="actions">
              <button
                className="primary"
                type="button"
                onClick={replayRoute}
                disabled={isPlaying}
              >
                {isPlaying ? 'Replaying Route…' : 'Replay Execution Route'}
              </button>

              <Link className="secondary" href="/runtime">
                Open Runtime Gate
              </Link>

              <Link className="secondary" href="/verify">
                Verify a Record
              </Link>

              <Link className="secondary" href="/review">
                Request Review
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
