'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type RouteState = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';

type Check = {
  id: number;
  name: string;
  group: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  detail: string;
};

const baselineChecks: Check[] = [
  { id: 1, name: 'Route identity', group: 'Identity', status: 'PASS', detail: 'A unique route identity is present and stable.' },
  { id: 2, name: 'Actor identity', group: 'Identity', status: 'PASS', detail: 'The initiating actor is attributable and authenticated.' },
  { id: 3, name: 'Organization identity', group: 'Identity', status: 'PASS', detail: 'The responsible organization is bound to the route.' },
  { id: 4, name: 'Authority source', group: 'Authority', status: 'PASS', detail: 'A declared authority source is attached to the execution.' },
  { id: 5, name: 'Authority validity', group: 'Authority', status: 'PASS', detail: 'The declared authority remains active and applicable.' },
  { id: 6, name: 'Policy applicability', group: 'Authority', status: 'PASS', detail: 'Applicable policy has been resolved for this route.' },
  { id: 7, name: 'Evidence existence', group: 'Evidence', status: 'PASS', detail: 'Required evidence objects are present.' },
  { id: 8, name: 'Evidence freshness', group: 'Evidence', status: 'PASS', detail: 'Evidence is current enough for the proposed consequence.' },
  { id: 9, name: 'Evidence provenance', group: 'Evidence', status: 'PASS', detail: 'Evidence origin and custody are reconstructable.' },
  { id: 10, name: 'Evidence integrity', group: 'Evidence', status: 'PASS', detail: 'No integrity conflict is detected in the evidence package.' },
  { id: 11, name: 'Required completeness', group: 'Evidence', status: 'PASS', detail: 'All mandatory evidence fields are populated.' },
  { id: 12, name: 'Contradiction review', group: 'Evidence', status: 'PASS', detail: 'No unresolved contradiction invalidates the route.' },
  { id: 13, name: 'Scope boundary', group: 'Binding', status: 'PASS', detail: 'The execution remains inside the declared scope.' },
  { id: 14, name: 'Object binding', group: 'Binding', status: 'PASS', detail: 'The approved object matches the object prepared for execution.' },
  { id: 15, name: 'Beneficiary binding', group: 'Binding', status: 'PASS', detail: 'The intended beneficiary is declared and unchanged.' },
  { id: 16, name: 'Destination binding', group: 'Binding', status: 'PASS', detail: 'The execution destination remains the approved destination.' },
  { id: 17, name: 'Tool and model binding', group: 'Binding', status: 'PASS', detail: 'The active tool and model match the approved route.' },
  { id: 18, name: 'Environment binding', group: 'Binding', status: 'PASS', detail: 'The execution environment matches the approved environment.' },
  { id: 19, name: 'Commit correspondence', group: 'Commit', status: 'PASS', detail: 'The committed manifest matches the route being executed.' },
  { id: 20, name: 'Temporal validity', group: 'Commit', status: 'PASS', detail: 'The route remains valid at the moment of execution.' },
  { id: 21, name: 'Required receipts', group: 'Execution', status: 'PASS', detail: 'All required dependency receipts are present.' },
  { id: 22, name: 'Bypass resistance', group: 'Execution', status: 'PASS', detail: 'No unauthorized bypass condition is detected.' },
  { id: 23, name: 'Execution correspondence', group: 'Execution', status: 'PASS', detail: 'The executed action corresponds to the committed route.' },
  { id: 24, name: 'Outcome correspondence', group: 'Outcome', status: 'PASS', detail: 'The recorded outcome corresponds to the authorized consequence.' },
];

const scenarios = [
  {
    name: 'Compliant enterprise payment',
    description: 'Complete evidence, valid authority, bound destination, and preserved receipts.',
    overrides: {},
  },
  {
    name: 'Expired authority',
    description: 'The actor is known, but the underlying authority expired before execution.',
    overrides: { 5: 'FAIL', 20: 'FAIL' },
  },
  {
    name: 'Incomplete evidence package',
    description: 'Evidence exists, but mandatory records are missing and continuity is incomplete.',
    overrides: { 9: 'WARN', 11: 'FAIL', 12: 'WARN' },
  },
  {
    name: 'Destination changed after approval',
    description: 'The committed route was approved for one destination and redirected before execution.',
    overrides: { 16: 'FAIL', 19: 'FAIL', 23: 'FAIL' },
  },
  {
    name: 'Specialized human review required',
    description: 'The route is bounded, but the consequence requires accountable expert review.',
    overrides: { 12: 'WARN', 20: 'WARN' },
  },
] as const;

function deriveState(checks: Check[], scenarioIndex: number): RouteState {
  if (scenarioIndex === 4) return 'ESCALATE';

  const failCount = checks.filter((check) => check.status === 'FAIL').length;
  const warnCount = checks.filter((check) => check.status === 'WARN').length;

  if (failCount >= 2) return 'DENY';
  if (failCount === 1 || warnCount > 0) return 'HOLD';
  return 'ALLOW';
}

function stateCopy(state: RouteState) {
  switch (state) {
    case 'ALLOW':
      return 'The exact route satisfies every mandatory runtime requirement.';
    case 'HOLD':
      return 'Execution is paused until the identified defects are corrected.';
    case 'DENY':
      return 'The route cannot legitimately create consequence in its present form.';
    case 'ESCALATE':
      return 'The route requires qualified higher review before consequence can occur.';
  }
}

export default function RuntimePage() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  const checks = useMemo(() => {
    const overrides = scenarios[scenarioIndex].overrides as Record<number, Check['status']>;

    return baselineChecks.map((check) => ({
      ...check,
      status: overrides[check.id] ?? 'PASS',
    }));
  }, [scenarioIndex]);

  const state = deriveState(checks, scenarioIndex);
  const passed = checks.filter((check) => check.status === 'PASS').length;
  const warnings = checks.filter((check) => check.status === 'WARN').length;
  const failed = checks.filter((check) => check.status === 'FAIL').length;

  function runRoute() {
    setIsRunning(true);
    setHasRun(false);
    setSelectedCheck(null);

    window.setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 1100);
  }

  return (
    <>
      <style>{`
        :root {
          --bg: #02050a;
          --panel: rgba(8, 17, 29, 0.78);
          --line: rgba(126, 180, 230, 0.16);
          --text: #f5f9ff;
          --muted: #91a5ba;
          --cyan: #59e7ff;
          --blue: #2f9cff;
          --green: #38f2a2;
          --gold: #ffd36b;
          --red: #ff4b70;
        }

        * { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        body {
          margin: 0;
          color: var(--text);
          background:
            radial-gradient(circle at 18% 0%, rgba(47, 156, 255, 0.17), transparent 30%),
            radial-gradient(circle at 84% 22%, rgba(56, 242, 162, 0.08), transparent 28%),
            linear-gradient(180deg, #02050a 0%, #07111d 48%, #02050a 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        button, select { font: inherit; }

        .runtime-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .runtime-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.2;
          background-image:
            linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: linear-gradient(to bottom, black, transparent 95%);
        }

        .shell {
          width: min(1240px, 92vw);
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
          border-radius: 14px;
          display: grid;
          place-items: center;
          color: var(--cyan);
          border: 1px solid rgba(89, 231, 255, 0.38);
          background: linear-gradient(145deg, rgba(47,156,255,0.18), rgba(56,242,162,0.06));
          box-shadow: 0 0 28px rgba(89,231,255,0.16);
        }

        .top-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .top-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
        }

        .top-links a:hover { color: white; }

        .hero {
          padding: 88px 0 54px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 34px;
          align-items: end;
        }

        .eyebrow {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        h1 {
          margin: 14px 0 20px;
          max-width: 920px;
          font-size: clamp(56px, 7.3vw, 100px);
          line-height: 0.92;
          letter-spacing: -0.06em;
        }

        .gradient {
          color: transparent;
          background: linear-gradient(90deg, white, var(--cyan), var(--green));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero p {
          max-width: 820px;
          margin: 0;
          color: #b1c1d4;
          font-size: 19px;
          line-height: 1.7;
        }

        .route-id {
          min-width: 250px;
          padding: 18px;
          border-radius: 18px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.025);
        }

        .route-id span {
          display: block;
          color: var(--muted);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .route-id strong {
          display: block;
          margin-top: 8px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 14px;
          color: var(--cyan);
        }

        .control-grid {
          display: grid;
          grid-template-columns: 0.76fr 1.24fr;
          gap: 20px;
          padding-bottom: 28px;
        }

        .panel {
          border: 1px solid var(--line);
          border-radius: 26px;
          background: var(--panel);
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 70px rgba(0,0,0,0.22);
        }

        .control-panel {
          padding: 26px;
        }

        .panel-label {
          color: var(--muted);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .control-panel h2,
        .gate-panel h2 {
          margin: 10px 0 12px;
          font-size: 28px;
          letter-spacing: -0.03em;
        }

        .control-panel p {
          margin: 0 0 22px;
          color: var(--muted);
          line-height: 1.65;
        }

        .scenario-list {
          display: grid;
          gap: 10px;
        }

        .scenario-button {
          width: 100%;
          padding: 16px;
          text-align: left;
          color: white;
          border-radius: 16px;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.025);
          cursor: pointer;
          transition: 180ms ease;
        }

        .scenario-button:hover {
          transform: translateX(3px);
          background: rgba(255,255,255,0.045);
        }

        .scenario-button.active {
          border-color: rgba(89,231,255,0.26);
          background: linear-gradient(90deg, rgba(47,156,255,0.11), rgba(56,242,162,0.035));
        }

        .scenario-button strong {
          display: block;
          margin-bottom: 6px;
          font-size: 15px;
        }

        .scenario-button span {
          display: block;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.55;
        }

        .run-button {
          width: 100%;
          margin-top: 18px;
          padding: 15px 18px;
          border: 0;
          border-radius: 15px;
          color: #03110b;
          font-weight: 950;
          cursor: pointer;
          background: linear-gradient(90deg, var(--cyan), var(--green));
          box-shadow: 0 0 34px rgba(89,231,255,0.2);
          transition: transform 180ms ease, opacity 180ms ease;
        }

        .run-button:hover { transform: translateY(-2px); }
        .run-button:disabled { opacity: 0.6; cursor: wait; }

        .gate-panel {
          padding: 26px;
        }

        .gate-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .stats {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .stat {
          min-width: 82px;
          padding: 11px 13px;
          border-radius: 14px;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--line);
        }

        .stat span {
          display: block;
          color: var(--muted);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .stat strong {
          display: block;
          margin-top: 5px;
          font-size: 20px;
        }

        .gate-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          min-height: 430px;
          position: relative;
        }

        .check-card {
          min-height: 116px;
          padding: 15px;
          position: relative;
          overflow: hidden;
          text-align: left;
          color: white;
          border-radius: 16px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.022);
          cursor: pointer;
          transition: 180ms ease;
        }

        .check-card:hover {
          transform: translateY(-3px);
          border-color: rgba(89,231,255,0.28);
        }

        .check-card.PASS {
          background: linear-gradient(145deg, rgba(56,242,162,0.055), rgba(255,255,255,0.018));
        }

        .check-card.WARN {
          border-color: rgba(255,211,107,0.3);
          background: linear-gradient(145deg, rgba(255,211,107,0.09), rgba(255,255,255,0.018));
        }

        .check-card.FAIL {
          border-color: rgba(255,75,112,0.34);
          background: linear-gradient(145deg, rgba(255,75,112,0.1), rgba(255,255,255,0.018));
        }

        .check-index {
          color: var(--muted);
          font-size: 10px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        .check-card strong {
          display: block;
          margin-top: 13px;
          padding-right: 15px;
          font-size: 13px;
          line-height: 1.35;
        }

        .status-light {
          position: absolute;
          right: 13px;
          top: 13px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .PASS .status-light {
          background: var(--green);
          box-shadow: 0 0 13px var(--green);
        }

        .WARN .status-light {
          background: var(--gold);
          box-shadow: 0 0 13px var(--gold);
        }

        .FAIL .status-light {
          background: var(--red);
          box-shadow: 0 0 13px var(--red);
        }

        .scanner {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          background: linear-gradient(to bottom, transparent, rgba(89,231,255,0.12), transparent);
          animation: scan 1.05s ease-in-out infinite;
        }

        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }

        .result-panel {
          margin-bottom: 28px;
          padding: 30px;
          display: grid;
          grid-template-columns: 0.62fr 1.38fr;
          gap: 28px;
          align-items: center;
        }

        .state {
          font-size: clamp(62px, 9vw, 122px);
          line-height: 0.86;
          font-weight: 950;
          letter-spacing: -0.06em;
        }

        .state.ALLOW { color: var(--green); text-shadow: 0 0 45px rgba(56,242,162,0.25); }
        .state.HOLD { color: var(--gold); text-shadow: 0 0 45px rgba(255,211,107,0.22); }
        .state.DENY { color: var(--red); text-shadow: 0 0 45px rgba(255,75,112,0.25); }
        .state.ESCALATE { color: var(--blue); text-shadow: 0 0 45px rgba(47,156,255,0.25); }

        .result-copy h3 {
          margin: 0 0 10px;
          font-size: 27px;
        }

        .result-copy p {
          margin: 0;
          color: var(--muted);
          font-size: 17px;
          line-height: 1.7;
        }

        .finding {
          margin-top: 18px;
          padding: 15px;
          border-radius: 15px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.025);
        }

        .finding strong {
          display: block;
          margin-bottom: 5px;
        }

        .finding span {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.55;
        }

        .receipt-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          padding-bottom: 90px;
        }

        .receipt {
          padding: 22px;
        }

        .receipt code {
          display: inline-block;
          color: var(--cyan);
          font-size: 11px;
          letter-spacing: 0.08em;
        }

        .receipt h3 {
          margin: 14px 0 8px;
          font-size: 20px;
        }

        .receipt p {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
          font-size: 14px;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(0,0,0,0.72);
          backdrop-filter: blur(10px);
        }

        .modal {
          width: min(560px, 94vw);
          padding: 28px;
          border-radius: 24px;
          border: 1px solid rgba(89,231,255,0.24);
          background: #07111d;
          box-shadow: 0 30px 100px rgba(0,0,0,0.5);
        }

        .modal-top {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .modal h3 {
          margin: 8px 0 12px;
          font-size: 28px;
        }

        .modal p {
          margin: 0;
          color: var(--muted);
          line-height: 1.7;
        }

        .close {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          border: 1px solid var(--line);
          color: white;
          background: rgba(255,255,255,0.04);
          cursor: pointer;
        }

        .modal-status {
          margin-top: 20px;
          display: inline-flex;
          padding: 8px 11px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          border: 1px solid var(--line);
        }

        @media (max-width: 1000px) {
          .hero,
          .control-grid,
          .result-panel {
            grid-template-columns: 1fr;
          }

          .route-id { min-width: 0; }
          .gate-grid { grid-template-columns: repeat(3, 1fr); }
          .receipt-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 700px) {
          .top-links a:not(:last-child) { display: none; }
          .hero { padding-top: 60px; }
          h1 { font-size: 54px; }
          .gate-grid { grid-template-columns: repeat(2, 1fr); }
          .gate-header { flex-direction: column; }
          .state { font-size: 68px; }
        }
      `}</style>

      <div className="runtime-page">
        <header className="topbar">
          <div className="shell topbar-inner">
            <Link className="brand" href="/">
              <span className="brand-mark">14</span>
              <span>TA-14 RUNTIME GATE</span>
            </Link>

            <nav className="top-links">
              <Link href="/architecture">Architecture</Link>
              <a href="#gate">Gate</a>
              <a href="#receipt">Records</a>
              <Link href="/">Exchange</Link>
            </nav>
          </div>
        </header>

        <main className="shell">
          <section className="hero">
            <div>
              <div className="eyebrow">Live admissibility simulation</div>
              <h1>
                Test the route
                <br />
                <span className="gradient">before consequence.</span>
              </h1>
              <p>
                This interactive runtime surface demonstrates how TA-14 evaluates
                identity, authority, evidence, continuity, binding, commit,
                execution, and outcome as one connected route.
              </p>
            </div>

            <div className="route-id">
              <span>Active route identity</span>
              <strong>TA14-RID-7F2A-91C4</strong>
            </div>
          </section>

          <section id="gate" className="control-grid">
            <aside className="panel control-panel">
              <div className="panel-label">Scenario control</div>
              <h2>Select a route condition</h2>
              <p>
                Choose a scenario, run the gate, and inspect the exact links that
                determine the route state.
              </p>

              <div className="scenario-list">
                {scenarios.map((scenario, index) => (
                  <button
                    className={`scenario-button ${scenarioIndex === index ? 'active' : ''}`}
                    key={scenario.name}
                    type="button"
                    onClick={() => {
                      setScenarioIndex(index);
                      setHasRun(false);
                    }}
                  >
                    <strong>{scenario.name}</strong>
                    <span>{scenario.description}</span>
                  </button>
                ))}
              </div>

              <button
                className="run-button"
                type="button"
                onClick={runRoute}
                disabled={isRunning}
              >
                {isRunning ? 'Evaluating 24 Links…' : 'Run Admissibility Gate'}
              </button>
            </aside>

            <section className="panel gate-panel">
              <div className="gate-header">
                <div>
                  <div className="panel-label">24-link execution chain</div>
                  <h2>Runtime integrity map</h2>
                </div>

                <div className="stats">
                  <div className="stat">
                    <span>Pass</span>
                    <strong>{passed}</strong>
                  </div>
                  <div className="stat">
                    <span>Warn</span>
                    <strong>{warnings}</strong>
                  </div>
                  <div className="stat">
                    <span>Fail</span>
                    <strong>{failed}</strong>
                  </div>
                </div>
              </div>

              <div className="gate-grid">
                {isRunning && <div className="scanner" />}

                {checks.map((check) => (
                  <button
                    className={`check-card ${check.status}`}
                    key={check.id}
                    type="button"
                    onClick={() => setSelectedCheck(check)}
                  >
                    <span className="status-light" />
                    <span className="check-index">
                      LINK {String(check.id).padStart(2, '0')} · {check.group}
                    </span>
                    <strong>{check.name}</strong>
                  </button>
                ))}
              </div>
            </section>
          </section>

          {hasRun && (
            <section className="panel result-panel">
              <div className={`state ${state}`}>{state}</div>

              <div className="result-copy">
                <div className="panel-label">Deterministic route state</div>
                <h3>{stateCopy(state)}</h3>
                <p>
                  The result is derived from the route’s current evidence and
                  authority state. Payment, preference, operator status, and
                  desired outcome do not alter the governing findings.
                </p>

                {(warnings > 0 || failed > 0) && (
                  <div className="finding">
                    <strong>
                      {failed > 0 ? `${failed} blocking defect${failed > 1 ? 's' : ''}` : `${warnings} review condition${warnings > 1 ? 's' : ''}`}
                    </strong>
                    <span>
                      Open the highlighted links above to inspect the exact
                      runtime condition producing this state.
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          <section id="receipt" className="receipt-grid">
            <article className="panel receipt">
              <code>TA14-DR</code>
              <h3>Decision Receipt</h3>
              <p>
                Preserves the state, findings, timestamps, governing links, and
                correction path for this route.
              </p>
            </article>

            <article className="panel receipt">
              <code>TA14-AER</code>
              <h3>Admissible Execution Record</h3>
              <p>
                Binds the route evidence, authority, commit, execution, and
                outcome into one reconstructable record.
              </p>
            </article>

            <article className="panel receipt">
              <code>TA14-RP</code>
              <h3>Replay Package</h3>
              <p>
                Allows an independent reviewer to test whether the preserved
                route corresponds to the decision and resulting consequence.
              </p>
            </article>
          </section>
        </main>

        {selectedCheck && (
          <div
            className="modal-backdrop"
            role="presentation"
            onClick={() => setSelectedCheck(null)}
          >
            <article
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="check-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="modal-top">
                <div>
                  <div className="panel-label">
                    Link {String(selectedCheck.id).padStart(2, '0')} · {selectedCheck.group}
                  </div>
                  <h3 id="check-title">{selectedCheck.name}</h3>
                </div>

                <button
                  className="close"
                  type="button"
                  aria-label="Close"
                  onClick={() => setSelectedCheck(null)}
                >
                  ×
                </button>
              </div>

              <p>{selectedCheck.detail}</p>

              <span className="modal-status">
                CURRENT STATE · {selectedCheck.status}
              </span>
            </article>
          </div>
        )}
      </div>
    </>
  );
}
