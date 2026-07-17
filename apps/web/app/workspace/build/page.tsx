'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type StageKey = 'reality' | 'record' | 'continuity' | 'admissibility' | 'binding' | 'commit' | 'execution' | 'outcome';
type RouteStatus = 'DRAFT' | 'HOLD' | 'READY_FOR_TEST';

type Stage = {
  key: StageKey;
  number: string;
  label: string;
  prompt: string;
  placeholder: string;
  value: string;
};

const stageDefinitions: Omit<Stage, 'value'>[] = [
  { key: 'reality', number: '01', label: 'Reality', prompt: 'What real-world condition gives rise to this route?', placeholder: 'Example: Invoice INV-2048 exists for delivered equipment.' },
  { key: 'record', number: '02', label: 'Record', prompt: 'What durable evidence represents that condition?', placeholder: 'Example: Signed invoice, purchase order, delivery receipt, and supplier identity record.' },
  { key: 'continuity', number: '03', label: 'Continuity', prompt: 'How will origin, custody, transformations, and versions remain provable?', placeholder: 'Example: Source digests, timestamps, signer identity, immutable version history, and dependency references.' },
  { key: 'admissibility', number: '04', label: 'Admissibility', prompt: 'What must be true before this route may proceed?', placeholder: 'Example: Invoice matches purchase order; delivery is confirmed; approval threshold is satisfied; evidence is temporally valid.' },
  { key: 'binding', number: '05', label: 'Binding', prompt: 'Which actor, authority, beneficiary, destination, object, and environment must be bound?', placeholder: 'Example: Finance agent A-17, authority policy AP-4, supplier S-91, account ending 4421, invoice INV-2048, production payment rail.' },
  { key: 'commit', number: '06', label: 'Commit', prompt: 'What exact route state must be frozen before execution?', placeholder: 'Example: Canonical route payload, evidence dependency set, decision receipt, route digest, and expiry boundary.' },
  { key: 'execution', number: '07', label: 'Execution', prompt: 'What action may occur, and how will correspondence be checked?', placeholder: 'Example: Release $12,450 to the bound supplier account only when the execution payload matches the committed route digest.' },
  { key: 'outcome', number: '08', label: 'Outcome', prompt: 'What authoritative artifact will prove what actually happened?', placeholder: 'Example: Settlement receipt, bank trace identifier, final amount, destination confirmation, timestamp, and reconciliation status.' },
];

const initialStages: Stage[] = stageDefinitions.map((stage) => ({ ...stage, value: '' }));

const templates: Record<string, Partial<Record<StageKey, string>>> = {
  'Vendor payment': {
    reality: 'An approved supplier invoice exists for goods or services received by the organization.',
    record: 'Invoice, purchase order, delivery confirmation, supplier identity record, and approval evidence.',
    continuity: 'Preserve source digests, timestamps, signer identities, dependency references, and all superseded versions.',
    admissibility: 'The invoice must match the purchase order, delivery must be confirmed, the supplier must be active, and approval must satisfy the payment threshold.',
    binding: 'Bind the requesting actor, approving authority, supplier beneficiary, bank destination, invoice object, amount, currency, and payment environment.',
    commit: 'Freeze the canonical payment route, evidence set, decision receipt, bindings, expiry time, and route digest.',
    execution: 'Release only the committed amount and currency to the bound destination through the approved payment rail.',
    outcome: 'Verify settlement using the processor receipt, bank trace, settled amount, destination confirmation, timestamp, and reconciliation result.',
  },
  'AI agent action': {
    reality: 'An AI agent has proposed a consequence-bearing action in an operating environment.',
    record: 'Prompt context, model and tool identifiers, retrieved evidence, proposed action payload, and policy inputs.',
    continuity: 'Preserve provenance for every input, transformation, model invocation, tool call, correction, and route version.',
    admissibility: 'Required evidence must be complete, current, attributable, policy-conforming, and sufficient for the proposed consequence.',
    binding: 'Bind the agent, delegated authority, affected party, tool destination, action object, model version, and execution environment.',
    commit: 'Commit the exact action payload, evidence dependency graph, authority receipt, admissibility decision, and cryptographic route identity.',
    execution: 'Permit only tool calls whose actor, arguments, destination, timing, and environment correspond to the committed route.',
    outcome: 'Capture authoritative tool and system receipts, resulting state, affected resources, exceptions, and independent verification status.',
  },
  'HVAC intervention': {
    reality: 'A measurable operating condition indicates that an HVAC system may require intervention.',
    record: 'Analyzer measurements, equipment identity, ambient conditions, electrical readings, airflow evidence, refrigerant data, and video.',
    continuity: 'Bind measurements to instrument identity, calibration state, technician, property, timestamps, media, and preserved revisions.',
    admissibility: 'The non-invasive evidence threshold must establish that intervention is justified and that required safety conditions are satisfied.',
    binding: 'Bind technician, company authority, equipment, property, intervention type, governed tools, refrigerant container, and environmental conditions.',
    commit: 'Freeze the diagnostic determination, supporting evidence, authorized intervention, limits, material identity, and route digest.',
    execution: 'Allow only the authorized intervention within committed limits while recording measurements and governed material movement.',
    outcome: 'Verify post-intervention performance, final readings, material balance, equipment response, technician record, and property outcome.',
  },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'untitled-route';
}

export default function BuildRoutePage() {
  const [routeName, setRouteName] = useState('Untitled governance route');
  const [domain, setDomain] = useState('AI Governance');
  const [owner, setOwner] = useState('UNKNOWN');
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [selected, setSelected] = useState<StageKey>('reality');
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const current = stages.find((stage) => stage.key === selected) ?? stages[0];
  const completed = stages.filter((stage) => stage.value.trim().length > 0).length;
  const missing = stages.filter((stage) => !stage.value.trim()).map((stage) => stage.label);
  const status: RouteStatus = completed === 8 ? 'READY_FOR_TEST' : completed >= 4 ? 'HOLD' : 'DRAFT';

  const route = useMemo(
    () => ({
      schema: 'TA14_ROUTE_DRAFT_V1',
      routeId: `draft:${slugify(routeName)}`,
      status,
      metadata: {
        name: routeName.trim() || 'Untitled governance route',
        domain: domain.trim() || 'UNKNOWN',
        owner: owner.trim() || 'UNKNOWN',
        version: 1,
      },
      chain: Object.fromEntries(stages.map((stage) => [stage.key, stage.value.trim() || 'UNKNOWN'])),
      readiness: {
        completedStages: completed,
        totalStages: 8,
        missingStages: missing,
        nextAction: completed === 8 ? 'SUBMIT_TO_SANDBOX' : 'COMPLETE_ROUTE_DEFINITION',
      },
      governingPrinciple: 'No admissible evidence. No admissible execution.',
    }),
    [completed, domain, missing, owner, routeName, stages, status],
  );

  const updateCurrent = (value: string) => {
    setStages((items) => items.map((stage) => (stage.key === selected ? { ...stage, value } : stage)));
  };

  const selectTemplate = (name: string) => {
    const template = templates[name];
    setRouteName(name);
    setStages((items) => items.map((stage) => ({ ...stage, value: template[stage.key] ?? stage.value })));
    setSelected('reality');
  };

  const clearRoute = () => {
    setRouteName('Untitled governance route');
    setDomain('AI Governance');
    setOwner('UNKNOWN');
    setStages(initialStages);
    setSelected('reality');
    setShowJson(false);
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(route, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${slugify(routeName)}.ta14-route.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(route, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <main className="builder-page">
      <style>{`
        * { box-sizing: border-box; }
        .builder-page { min-height: calc(100vh - 68px); padding: 28px 0 90px; color: #eef8ff; }
        .wrap { width: min(1440px, calc(100% - 40px)); margin: 0 auto; }
        .topbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; padding: 28px 30px; border: 1px solid rgba(120, 183, 219, .15); border-radius: 28px; background: radial-gradient(circle at 86% 8%, rgba(78, 237, 176, .12), transparent 28%), linear-gradient(145deg, rgba(14, 31, 47, .97), rgba(5, 12, 20, .98)); box-shadow: 0 30px 90px rgba(0,0,0,.3); }
        .eyebrow { color: #67e6f7; font-size: .68rem; font-weight: 950; letter-spacing: .16em; text-transform: uppercase; }
        h1 { margin: 10px 0 10px; font-size: clamp(2.35rem, 5vw, 5.1rem); line-height: .95; letter-spacing: -.065em; }
        .subtitle { max-width: 760px; margin: 0; color: #93a8ba; line-height: 1.65; }
        .top-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 9px; }
        .button, .action-link { display: inline-flex; align-items: center; justify-content: center; min-height: 43px; padding: 0 16px; border: 1px solid rgba(132, 181, 214, .18); border-radius: 999px; color: #b9cad7; background: rgba(255,255,255,.035); text-decoration: none; font: inherit; font-size: .76rem; font-weight: 900; cursor: pointer; transition: .2s ease; }
        .button:hover, .action-link:hover { transform: translateY(-2px); border-color: rgba(90, 224, 241, .42); color: #fff; }
        .button.primary { border: 0; color: #03130e; background: linear-gradient(100deg, #74eaff, #5cf0ae); }
        .button:disabled { opacity: .35; cursor: not-allowed; transform: none; }
        .meta { display: grid; grid-template-columns: 1.4fr 1fr 1fr auto; gap: 12px; margin: 18px 0; padding: 16px; border: 1px solid rgba(125, 179, 214, .13); border-radius: 22px; background: rgba(7, 17, 27, .78); }
        label { color: #9db0c0; font-size: .66rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
        input, select, textarea { width: 100%; border: 1px solid rgba(128, 180, 215, .16); outline: none; color: #edf8ff; background: rgba(2, 9, 15, .72); font: inherit; }
        input, select { height: 44px; margin-top: 7px; padding: 0 12px; border-radius: 13px; }
        select { color-scheme: dark; }
        textarea { min-height: 220px; padding: 17px; border-radius: 17px; resize: vertical; line-height: 1.65; }
        input:focus, select:focus, textarea:focus { border-color: rgba(87, 228, 244, .55); box-shadow: 0 0 0 4px rgba(70, 209, 233, .06); }
        .status-card { display: flex; flex-direction: column; justify-content: center; min-width: 150px; padding: 0 6px; }
        .status-label { color: #71879a; font-size: .62rem; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
        .status { margin-top: 7px; font-size: .78rem; font-weight: 1000; letter-spacing: .05em; }
        .status.ready { color: #6ff1b7; } .status.hold { color: #ffcb78; } .status.draft { color: #7eddf1; }
        .workspace { display: grid; grid-template-columns: 250px minmax(0, 1fr) 320px; gap: 16px; }
        .card { border: 1px solid rgba(126, 179, 213, .13); border-radius: 24px; background: rgba(7, 17, 28, .82); box-shadow: 0 24px 70px rgba(0,0,0,.2); }
        .sidebar { align-self: start; position: sticky; top: 84px; padding: 17px; }
        .sidebar-title { margin: 3px 4px 13px; color: #6f8395; font-size: .64rem; font-weight: 950; letter-spacing: .12em; text-transform: uppercase; }
        .stage-button { display: grid; grid-template-columns: 34px 1fr auto; align-items: center; gap: 10px; width: 100%; margin: 3px 0; padding: 11px 10px; border: 1px solid transparent; border-radius: 14px; color: #8296a8; background: transparent; text-align: left; font: inherit; cursor: pointer; }
        .stage-button:hover, .stage-button.active { color: #fff; border-color: rgba(91, 218, 240, .17); background: rgba(69, 204, 231, .07); }
        .stage-number { display: grid; place-items: center; width: 31px; height: 31px; border: 1px solid rgba(128, 179, 213, .14); border-radius: 10px; font-size: .62rem; font-weight: 950; }
        .stage-button.complete .stage-number { color: #6ff0b8; border-color: rgba(91, 232, 172, .26); background: rgba(65, 220, 157, .06); }
        .stage-label { font-size: .76rem; font-weight: 900; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,.12); }
        .stage-button.complete .dot { background: #58e9aa; box-shadow: 0 0 13px rgba(88,233,170,.45); }
        .editor { min-height: 640px; padding: clamp(23px, 3.5vw, 42px); }
        .editor-head { display: flex; justify-content: space-between; gap: 18px; align-items: flex-start; margin-bottom: 25px; }
        .editor-kicker { color: #5de3f5; font-size: .66rem; font-weight: 950; letter-spacing: .15em; text-transform: uppercase; }
        h2 { margin: 9px 0 0; font-size: clamp(2rem, 4vw, 3.5rem); letter-spacing: -.055em; line-height: 1; }
        .chain-position { padding: 8px 11px; border-radius: 999px; color: #89a0b2; background: rgba(255,255,255,.04); font-size: .66rem; font-weight: 900; white-space: nowrap; }
        .prompt { max-width: 760px; margin: 0 0 18px; color: #9dafbe; line-height: 1.7; }
        .editor-note { display: flex; gap: 10px; margin-top: 14px; padding: 13px 15px; border: 1px solid rgba(255, 193, 96, .15); border-radius: 15px; color: #c7a96f; background: rgba(255, 177, 58, .04); font-size: .74rem; line-height: 1.55; }
        .stage-nav { display: flex; justify-content: space-between; gap: 10px; margin-top: 24px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.055); }
        .right { align-self: start; position: sticky; top: 84px; padding: 18px; }
        .right h3 { margin: 2px 0 14px; font-size: .9rem; }
        .meter { height: 7px; overflow: hidden; border-radius: 999px; background: rgba(255,255,255,.055); }
        .meter span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #54d9ff, #57edaa); transition: width .25s ease; }
        .score { display: flex; justify-content: space-between; margin-top: 9px; color: #8398a9; font-size: .7rem; }
        .summary { display: grid; gap: 8px; margin-top: 18px; }
        .summary-row { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.05); color: #869aab; font-size: .72rem; }
        .summary-row strong { color: #dce8ef; }
        .missing { margin-top: 18px; padding: 14px; border: 1px solid rgba(255, 190, 87, .13); border-radius: 15px; background: rgba(255, 174, 43, .035); }
        .missing-title { color: #efbd6e; font-size: .66rem; font-weight: 950; letter-spacing: .1em; text-transform: uppercase; }
        .missing-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
        .chip { padding: 6px 8px; border-radius: 999px; color: #a9bac7; background: rgba(255,255,255,.045); font-size: .63rem; font-weight: 850; }
        .templates { margin-top: 18px; }
        .template-button { width: 100%; margin-top: 7px; padding: 10px 11px; border: 1px solid rgba(126, 181, 215, .13); border-radius: 12px; color: #9fb2c0; background: rgba(255,255,255,.025); text-align: left; font: inherit; font-size: .7rem; font-weight: 850; cursor: pointer; }
        .template-button:hover { color: #fff; border-color: rgba(87, 225, 242, .35); }
        .principle { margin-top: 17px; padding: 13px; border-radius: 14px; color: #9fefd0; background: rgba(67, 220, 159, .055); font-size: .7rem; font-weight: 900; line-height: 1.5; }
        .json-panel { margin-top: 16px; padding: 18px; border: 1px solid rgba(125, 180, 214, .13); border-radius: 22px; background: #030a10; }
        .json-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
        .json-head strong { font-size: .78rem; }
        pre { max-height: 420px; margin: 0; overflow: auto; color: #9fe9d2; font: 11px/1.65 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
        @media (max-width: 1120px) { .workspace { grid-template-columns: 220px minmax(0,1fr); } .right { position: static; grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; } .right > * { margin-top: 0; } }
        @media (max-width: 760px) { .wrap { width: min(100% - 22px, 1440px); } .topbar { padding: 25px 20px; flex-direction: column; } .top-actions { justify-content: flex-start; } .meta { grid-template-columns: 1fr; } .workspace { grid-template-columns: 1fr; } .sidebar { position: static; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; } .sidebar-title { grid-column: 1 / -1; } .stage-button { display: flex; justify-content: center; padding: 7px; } .stage-label, .dot { display: none; } .right { grid-column: auto; grid-template-columns: 1fr; } .editor { min-height: auto; } .editor-head { flex-direction: column; } }
      `}</style>

      <div className="wrap">
        <header className="topbar">
          <div>
            <span className="eyebrow">TA-14 Exchange · Route construction</span>
            <h1>Visual Route Builder</h1>
            <p className="subtitle">Construct the complete Reality → Outcome chain. Every empty stage remains explicitly unknown, and a route cannot advance to testing until all eight stages are defined.</p>
          </div>
          <div className="top-actions">
            <Link className="action-link" href="/workspace/discover">← Discovery</Link>
            <button className="button" type="button" onClick={() => setShowJson((value) => !value)}>{showJson ? 'Hide JSON' : 'Preview JSON'}</button>
            <button className="button" type="button" onClick={download}>Download draft</button>
            <button className="button" type="button" onClick={clearRoute}>Clear</button>
          </div>
        </header>

        <section className="meta" aria-label="Route metadata">
          <label>Route name<input value={routeName} onChange={(event) => setRouteName(event.target.value)} /></label>
          <label>Domain<select value={domain} onChange={(event) => setDomain(event.target.value)}><option>AI Governance</option><option>Finance</option><option>Healthcare</option><option>Manufacturing</option><option>HVAC</option><option>Government</option><option>Environmental</option><option>Other</option></select></label>
          <label>Route owner<input value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="Person, team, or organization" /></label>
          <div className="status-card"><span className="status-label">Construction state</span><span className={`status ${status === 'READY_FOR_TEST' ? 'ready' : status === 'HOLD' ? 'hold' : 'draft'}`}>{status.replaceAll('_', ' ')}</span></div>
        </section>

        <section className="workspace">
          <aside className="card sidebar" aria-label="Route stages">
            <div className="sidebar-title">Execution chain</div>
            {stages.map((stage) => (
              <button key={stage.key} className={`stage-button ${selected === stage.key ? 'active' : ''} ${stage.value.trim() ? 'complete' : ''}`} type="button" onClick={() => setSelected(stage.key)}>
                <span className="stage-number">{stage.value.trim() ? '✓' : stage.number}</span>
                <span className="stage-label">{stage.label}</span>
                <span className="dot" />
              </button>
            ))}
          </aside>

          <article className="card editor">
            <header className="editor-head">
              <div><span className="editor-kicker">Stage {current.number}</span><h2>{current.label}</h2></div>
              <span className="chain-position">{stages.findIndex((stage) => stage.key === selected) + 1} / 8</span>
            </header>
            <p className="prompt">{current.prompt}</p>
            <textarea value={current.value} onChange={(event) => updateCurrent(event.target.value)} placeholder={current.placeholder} aria-label={`${current.label} definition`} />
            <div className="editor-note"><strong>Rule:</strong><span>Do not invent missing facts. Define the required proof, binding, or correspondence. Unsupported values remain <strong>UNKNOWN</strong> until evidence resolves them.</span></div>
            <nav className="stage-nav" aria-label="Stage navigation">
              <button className="button" type="button" disabled={stages.findIndex((stage) => stage.key === selected) === 0} onClick={() => setSelected(stages[Math.max(0, stages.findIndex((stage) => stage.key === selected) - 1)].key)}>← Previous</button>
              {stages.findIndex((stage) => stage.key === selected) < 7 ? (
                <button className="button primary" type="button" onClick={() => setSelected(stages[stages.findIndex((stage) => stage.key === selected) + 1].key)}>Next stage →</button>
              ) : (
                <Link className="action-link" href={completed === 8 ? '/workspace/scanner' : '#'} aria-disabled={completed !== 8}>Send to Scanner →</Link>
              )}
            </nav>
          </article>

          <aside className="card right">
            <div>
              <h3>Construction readiness</h3>
              <div className="meter"><span style={{ width: `${(completed / 8) * 100}%` }} /></div>
              <div className="score"><span>{completed} stages defined</span><strong>{Math.round((completed / 8) * 100)}%</strong></div>
              <div className="summary">
                <div className="summary-row"><span>Schema</span><strong>ROUTE_DRAFT_V1</strong></div>
                <div className="summary-row"><span>Version</span><strong>1</strong></div>
                <div className="summary-row"><span>Unknown stages</span><strong>{missing.length}</strong></div>
                <div className="summary-row"><span>Next action</span><strong>{completed === 8 ? 'TEST' : 'COMPLETE'}</strong></div>
              </div>
            </div>
            <div className="missing">
              <div className="missing-title">{missing.length ? 'Unresolved stages' : 'Chain complete'}</div>
              <div className="missing-list">{missing.length ? missing.map((item) => <span className="chip" key={item}>{item}</span>) : <span className="chip">Ready for deterministic testing</span>}</div>
            </div>
            <div className="templates">
              <div className="sidebar-title">Start from a template</div>
              {Object.keys(templates).map((name) => <button className="template-button" key={name} type="button" onClick={() => selectTemplate(name)}>{name}</button>)}
            </div>
            <div className="principle">No admissible evidence.<br />No admissible execution.</div>
          </aside>
        </section>

        {showJson && (
          <section className="json-panel">
            <div className="json-head"><strong>TA14_ROUTE_DRAFT_V1</strong><button className="button" type="button" onClick={copyJson}>{copied ? 'Copied' : 'Copy JSON'}</button></div>
            <pre>{JSON.stringify(route, null, 2)}</pre>
          </section>
        )}
      </div>
    </main>
  );
}
