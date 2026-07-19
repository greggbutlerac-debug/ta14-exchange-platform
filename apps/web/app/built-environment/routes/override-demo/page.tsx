'use client';

import { useEffect, useMemo, useState } from 'react';

type RouteState = 'READY' | 'RUNNING' | 'HOLD' | 'ALLOW' | 'COMPLETE';

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

const initialEvidence = [
  { label: 'Room temperature trend', present: true },
  { label: 'Valve position feedback', present: true },
  { label: 'Supply-water temperature', present: true },
  { label: 'Operator identity', present: true },
  { label: 'Override reason', present: false },
  { label: 'Override duration', present: false },
  { label: 'Release condition', present: false },
  { label: 'Post-check window', present: false },
];

function makeRid() {
  return `TA-14-BE-RID-${Date.now().toString(36).toUpperCase()}`;
}

function makeHash(value: string) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, '0').toUpperCase();
}

export default function BuiltEnvironmentOverrideDemoPage() {
  const [routeState, setRouteState] = useState<RouteState>('READY');
  const [activeStage, setActiveStage] = useState(-1);
  const [corrected, setCorrected] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [rid, setRid] = useState('');
  const [manifestHash, setManifestHash] = useState('');

  const evidence = useMemo(
    () =>
      initialEvidence.map((item) =>
        corrected && !item.present ? { ...item, present: true } : item,
      ),
    [corrected],
  );

  const missingEvidence = evidence.filter((item) => !item.present);

  useEffect(() => {
    if (routeState !== 'RUNNING') return;

    if (activeStage >= chain.length - 1) {
      const timer = window.setTimeout(() => {
        if (corrected) {
          const newRid = makeRid();
          setRid(newRid);
          setManifestHash(
            makeHash(
              `${newRid}|chilled-water-valve|100-percent|20-minutes|auto-release`,
            ),
          );
          setRouteState('ALLOW');
          setRecordOpen(true);
        } else {
          setRouteState('HOLD');
        }
      }, 650);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setActiveStage((current) => current + 1);
    }, 420);

    return () => window.clearTimeout(timer);
  }, [routeState, activeStage, corrected]);

  function runRoute() {
    setRecordOpen(false);
    setRid('');
    setManifestHash('');
    setActiveStage(0);
    setRouteState('RUNNING');
  }

  function correctRoute() {
    setCorrected(true);
    setRecordOpen(false);
    setRid('');
    setManifestHash('');
    setActiveStage(0);
    setRouteState('RUNNING');
  }

  function resetRoute() {
    setRouteState('READY');
    setActiveStage(-1);
    setCorrected(false);
    setRecordOpen(false);
    setRid('');
    setManifestHash('');
  }

  return (
    <>
      <style>{`
        :root {
          color-scheme: dark;
          --bg: #03060b;
          --panel: rgba(9, 19, 31, 0.82);
          --line: rgba(113, 171, 225, 0.18);
          --text: #f3f8ff;
          --muted: #93a8bd;
          --cyan: #54e8ff;
          --blue: #2b9cff;
          --green: #39f2a1;
          --amber: #ffd46a;
          --red: #ff5f78;
        }

        * { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        body {
          margin: 0;
          color: var(--text);
          background:
            radial-gradient(circle at 15% 10%, rgba(43,156,255,.15), transparent 30%),
            radial-gradient(circle at 85% 18%, rgba(57,242,161,.08), transparent 28%),
            radial-gradient(circle at 50% 90%, rgba(255,95,120,.07), transparent 32%),
            linear-gradient(180deg, #02050a 0%, #06101b 48%, #02050a 100%);
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
          pointer-events: none;
          overflow: hidden;
        }

        .grid {
          position: absolute;
          inset: 0;
          opacity: .24;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: linear-gradient(to bottom, black, transparent 92%);
        }

        .beam {
          position: absolute;
          width: 70vw;
          height: 2px;
          opacity: .23;
          background: linear-gradient(90deg, transparent, rgba(84,232,255,.82), transparent);
          box-shadow: 0 0 24px rgba(84,232,255,.25);
          animation: sweep 15s ease-in-out infinite alternate;
        }

        .beam.one {
          top: 28vh;
          left: -14vw;
          transform: rotate(-12deg);
        }

        .beam.two {
          right: -18vw;
          bottom: 22vh;
          transform: rotate(14deg);
          background: linear-gradient(90deg, transparent, rgba(57,242,161,.74), transparent);
          animation-duration: 19s;
        }

        @keyframes sweep {
          to { transform: translate3d(24vw, 12vh, 0) rotate(-6deg); }
        }

        .container {
          width: min(1220px, 92vw);
          margin: 0 auto;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          border-bottom: 1px solid var(--line);
          background: rgba(3,7,13,.82);
          backdrop-filter: blur(18px);
        }

        .topbar-inner {
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
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
          gap: 16px;
          align-items: center;
          color: var(--muted);
          font-size: 13px;
        }

        .nav a {
          text-decoration: none;
        }

        .nav a:hover { color: white; }

        .button {
          min-height: 46px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,.035);
          color: white;
          font-weight: 850;
          cursor: pointer;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .button:hover {
          transform: translateY(-2px);
          border-color: rgba(84,232,255,.4);
        }

        .button.primary {
          border: 0;
          color: #03110d;
          background: linear-gradient(90deg, var(--cyan), var(--green));
          box-shadow: 0 0 28px rgba(84,232,255,.2);
        }

        .button.warning {
          border: 0;
          color: #171004;
          background: linear-gradient(90deg, #ffd46a, #ffb95f);
          box-shadow: 0 0 26px rgba(255,212,106,.18);
        }

        .hero {
          padding: 76px 0 46px;
        }

        .eyebrow {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        h1 {
          margin: 16px 0 18px;
          max-width: 960px;
          font-size: clamp(46px, 6.5vw, 82px);
          line-height: .98;
          letter-spacing: -.052em;
        }

        .hero-copy {
          max-width: 840px;
          color: #afc1d4;
          font-size: 18px;
          line-height: 1.72;
        }

        .boundary-note {
          margin-top: 24px;
          padding: 16px 18px;
          border-radius: 16px;
          border: 1px solid rgba(255,212,106,.22);
          background: rgba(255,212,106,.045);
          color: #c4cfda;
          line-height: 1.6;
          font-size: 13px;
        }

        .demo {
          padding: 30px 0 84px;
        }

        .demo-grid {
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 22px;
        }

        .panel {
          border-radius: 26px;
          border: 1px solid var(--line);
          background: var(--panel);
          backdrop-filter: blur(16px);
          padding: 26px;
          box-shadow: 0 20px 60px rgba(0,0,0,.26);
        }

        .panel h2,
        .panel h3 {
          margin: 0;
        }

        .scenario-top,
        .state-top,
        .record-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .scenario-top p,
        .state-top p {
          color: var(--muted);
          line-height: 1.6;
          margin: 8px 0 0;
        }

        .chip {
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
          white-space: nowrap;
        }

        .fields {
          display: grid;
          gap: 11px;
          margin-top: 22px;
        }

        .field {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.06);
          background: rgba(255,255,255,.025);
        }

        .field span:first-child {
          color: var(--muted);
        }

        .field span:last-child {
          text-align: right;
          font-weight: 800;
        }

        .evidence-grid {
          display: grid;
          gap: 10px;
          margin-top: 22px;
        }

        .evidence-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 13px 14px;
          border-radius: 13px;
          border: 1px solid rgba(255,255,255,.06);
          background: rgba(255,255,255,.022);
        }

        .evidence-item.missing {
          border-color: rgba(255,212,106,.28);
          background: rgba(255,212,106,.04);
        }

        .evidence-state {
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .11em;
        }

        .evidence-state.present { color: var(--green); }
        .evidence-state.missing { color: var(--amber); }

        .state-display {
          margin: 18px 0 12px;
          font-size: clamp(52px, 8vw, 96px);
          font-weight: 950;
          line-height: .95;
          letter-spacing: -.05em;
        }

        .state-display.ready { color: var(--cyan); }
        .state-display.running { color: var(--blue); }
        .state-display.hold { color: var(--amber); }
        .state-display.allow,
        .state-display.complete { color: var(--green); }

        .state-copy {
          min-height: 62px;
          color: var(--muted);
          line-height: 1.7;
        }

        .progress {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 7px;
          margin: 24px 0;
        }

        .step {
          height: 7px;
          border-radius: 999px;
          background: rgba(255,255,255,.07);
        }

        .step.active {
          background: var(--blue);
          box-shadow: 0 0 14px rgba(43,156,255,.65);
        }

        .step.complete {
          background: var(--green);
        }

        .step.failed {
          background: var(--amber);
          box-shadow: 0 0 14px rgba(255,212,106,.45);
        }

        .receipt {
          margin: 0 0 20px;
          padding: 17px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.06);
          background: #040810;
          color: #9eb2c6;
          font-family: "SFMono-Regular", Consolas, monospace;
          font-size: 12px;
          line-height: 1.72;
          white-space: pre-wrap;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
        }

        .record {
          margin-top: 22px;
          border-color: rgba(57,242,161,.26);
          background: linear-gradient(135deg, rgba(57,242,161,.075), rgba(43,156,255,.055));
          box-shadow: 0 0 58px rgba(57,242,161,.09);
        }

        .record-status {
          color: var(--green);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .record-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 11px;
          margin-top: 20px;
        }

        .record-cell {
          min-height: 92px;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.06);
          background: rgba(3,8,14,.5);
        }

        .record-cell small {
          display: block;
          margin-bottom: 7px;
          color: var(--muted);
          font-size: 10px;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .record-cell strong {
          display: block;
          font-size: 13px;
          word-break: break-word;
        }

        .explanation {
          padding: 84px 0;
        }

        .explanation-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .explanation-card {
          min-height: 220px;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: linear-gradient(145deg, rgba(255,255,255,.04), rgba(255,255,255,.014));
        }

        .explanation-card h3 {
          margin: 0 0 12px;
          font-size: 22px;
        }

        .explanation-card p {
          margin: 0;
          color: var(--muted);
          line-height: 1.68;
        }

        .footer {
          margin-top: 30px;
          padding: 46px 0;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 13px;
        }

        @media (max-width: 1000px) {
          .demo-grid {
            grid-template-columns: 1fr;
          }

          .record-grid,
          .explanation-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 720px) {
          .nav a:not(.button) {
            display: none;
          }

          .brand span:last-child {
            display: none;
          }

          h1 {
            font-size: 47px;
          }

          .scenario-top,
          .state-top,
          .record-top {
            flex-direction: column;
          }

          .record-grid,
          .explanation-grid {
            grid-template-columns: 1fr;
          }

          .progress {
            grid-template-columns: repeat(4, 1fr);
          }

          .field {
            flex-direction: column;
          }

          .field span:last-child {
            text-align: left;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .beam {
            animation: none !important;
          }

          * {
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div className="page">
        <div className="ambient" aria-hidden="true">
          <div className="grid" />
          <div className="beam one" />
          <div className="beam two" />
        </div>

        <header className="topbar">
          <div className="container topbar-inner">
            <a className="brand" href="/built-environment">
              <span className="brand-mark">TA-14</span>
              <span>BAS OVERRIDE GOVERNANCE DEMONSTRATION</span>
            </a>

            <nav className="nav" aria-label="Override demonstration navigation">
              <a href="/built-environment">Built Environment</a>
              <a href="/built-environment/routes">Routes</a>
              <a href="/built-environment/atmospheric-integrity/new">Create AIR</a>
              <a className="button primary" href="/built-environment/routes/new">
                Build Route
              </a>
            </nav>
          </div>
        </header>

        <main>
          <section className="container hero">
            <div className="eyebrow">Demonstration route · C4 operational consequence</div>
            <h1>Watch a building override move from HOLD to admissible execution.</h1>
            <p className="hero-copy">
              A BAS operator intends to override a chilled-water valve from 35%
              to 100% after a complaint that a critical room is warming. The
              demonstration preserves the route from observed condition to
              verified outcome.
            </p>

            <div className="boundary-note">
              Demonstration only. TA-14 does not control a live BAS or issue a
              live command from this page. The scenario illustrates evidence,
              authority, binding, commitment, execution, release, and outcome
              verification.
            </div>
          </section>

          <section className="container demo">
            <div className="demo-grid">
              <article className="panel">
                <div className="scenario-top">
                  <div>
                    <h2>Chilled-Water Valve Override</h2>
                    <p>Critical Room 204 · AHU-2 · CHWV-204</p>
                  </div>
                  <span className="chip">DEMONSTRATION</span>
                </div>

                <div className="fields">
                  <div className="field">
                    <span>Current room temperature</span>
                    <span>78.6°F and rising</span>
                  </div>
                  <div className="field">
                    <span>Current valve position</span>
                    <span>35%</span>
                  </div>
                  <div className="field">
                    <span>Requested override</span>
                    <span>100%</span>
                  </div>
                  <div className="field">
                    <span>Operator</span>
                    <span>Authenticated BAS Operator</span>
                  </div>
                  <div className="field">
                    <span>Consequence class</span>
                    <span>C4 · Health / safety</span>
                  </div>
                </div>

                <div className="evidence-grid">
                  {evidence.map((item) => (
                    <div
                      key={item.label}
                      className={`evidence-item ${item.present ? '' : 'missing'}`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`evidence-state ${
                          item.present ? 'present' : 'missing'
                        }`}
                      >
                        {item.present ? 'PRESENT' : 'MISSING'}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel">
                <div className="state-top">
                  <div>
                    <div className="eyebrow">Route evaluation</div>
                    <h2>Reality → Outcome</h2>
                  </div>
                  <span className="chip">ALLOW · HOLD · DENY · ESCALATE</span>
                </div>

                <div className={`state-display ${routeState.toLowerCase()}`}>
                  {routeState}
                </div>

                <div className="state-copy" aria-live="polite">
                  {routeState === 'READY' &&
                    'The route is ready to evaluate. Missing route dependencies will be tested.'}
                  {routeState === 'RUNNING' &&
                    `Evaluating ${chain[Math.max(activeStage, 0)]}.`}
                  {routeState === 'HOLD' &&
                    `The route is paused. ${missingEvidence.length} required dependencies remain missing.`}
                  {routeState === 'ALLOW' &&
                    'The corrected route reached explicit commit before simulated execution.'}
                  {routeState === 'COMPLETE' &&
                    'Execution and outcome have been preserved.'}
                </div>

                <div className="progress" aria-label="Route progress">
                  {chain.map((stage, index) => (
                    <div
                      key={stage}
                      className={`step ${
                        index === activeStage
                          ? routeState === 'HOLD'
                            ? 'failed'
                            : 'active'
                          : index < activeStage
                            ? 'complete'
                            : ''
                      }`}
                      title={stage}
                    />
                  ))}
                </div>

                <div className="receipt">
{routeState === 'READY' &&
`route: CHILLED_WATER_VALVE_OVERRIDE
state: READY
requested_value: 100%
current_value: 35%
live_command: false`}
{routeState === 'RUNNING' &&
`route: CHILLED_WATER_VALVE_OVERRIDE
state: RUNNING
active_stage: ${chain[Math.max(activeStage, 0)]}
evidence_missing: ${missingEvidence.length}`}
{routeState === 'HOLD' &&
`decision: HOLD
reason: required route dependencies absent
missing:
- override reason
- override duration
- release condition
- post-check window
execution_released: false`}
{routeState === 'ALLOW' &&
`decision: ALLOW
reason: required dependencies restored
override_duration: 20 minutes
release_condition: return to automatic control
post_check_window: 15 minutes
execution_mode: simulated`}
                </div>

                <div className="actions">
                  {(routeState === 'READY' || routeState === 'ALLOW') && (
                    <button className="button primary" type="button" onClick={runRoute}>
                      {routeState === 'READY' ? 'Run Route' : 'Run Again'}
                    </button>
                  )}

                  {routeState === 'HOLD' && (
                    <button className="button warning" type="button" onClick={correctRoute}>
                      Add Missing Dependencies and Rerun
                    </button>
                  )}

                  <button className="button" type="button" onClick={resetRoute}>
                    Reset
                  </button>
                </div>
              </article>
            </div>

            {recordOpen && (
              <article className="panel record">
                <div className="record-top">
                  <div>
                    <div className="record-status">Governed record created</div>
                    <h2 style={{ marginTop: 8 }}>BAS Override Demonstration Record</h2>
                  </div>
                  <span className="chip">SELF-DECLARED DEMONSTRATION</span>
                </div>

                <div className="record-grid">
                  <div className="record-cell">
                    <small>Route ID</small>
                    <strong>{rid}</strong>
                  </div>
                  <div className="record-cell">
                    <small>Decision</small>
                    <strong>ALLOW</strong>
                  </div>
                  <div className="record-cell">
                    <small>Manifest hash</small>
                    <strong>{manifestHash}</strong>
                  </div>
                  <div className="record-cell">
                    <small>Command</small>
                    <strong>CHWV-204 → 100%</strong>
                  </div>
                  <div className="record-cell">
                    <small>Duration</small>
                    <strong>20 minutes</strong>
                  </div>
                  <div className="record-cell">
                    <small>Release</small>
                    <strong>Automatic control restored</strong>
                  </div>
                  <div className="record-cell">
                    <small>Outcome</small>
                    <strong>Room temperature recovered</strong>
                  </div>
                  <div className="record-cell">
                    <small>Stability window</small>
                    <strong>15 minutes · no new alarm</strong>
                  </div>
                  <div className="record-cell">
                    <small>Proof boundary</small>
                    <strong>Demonstrates route logic only; no live BAS command</strong>
                  </div>
                </div>
              </article>
            )}
          </section>

          <section className="container explanation">
            <div className="explanation-grid">
              <article className="explanation-card">
                <h3>Why HOLD occurred</h3>
                <p>
                  Authentication alone was not enough. The route lacked a reason,
                  duration, release condition, and post-check window. Without
                  those objects, the proposed override was not execution-ready.
                </p>
              </article>

              <article className="explanation-card">
                <h3>What correction changed</h3>
                <p>
                  The correction added bounded duration, safe limits, automatic
                  release, and an outcome check without replacing the original
                  route history.
                </p>
              </article>

              <article className="explanation-card">
                <h3>What the record preserves</h3>
                <p>
                  The record shows the condition, evidence, authority, binding,
                  exact commit, simulated command, release, outcome, unresolved
                  limitations, and proof boundary.
                </p>
              </article>
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
