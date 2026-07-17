'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Domain = 'AI' | 'Finance' | 'Healthcare' | 'Manufacturing' | 'HVAC' | 'Government' | 'Environmental' | 'Other';
type Consequence = 'Informational' | 'Operational' | 'Financial' | 'Safety' | 'Legal' | 'Environmental';

type DiscoveryState = {
  domain: Domain | '';
  system: string;
  proposedAction: string;
  consequence: Consequence | '';
  actor: string;
  authority: string;
  evidence: string;
  beneficiary: string;
  destination: string;
  intendedOutcome: string;
};

const initialState: DiscoveryState = {
  domain: '',
  system: '',
  proposedAction: '',
  consequence: '',
  actor: '',
  authority: '',
  evidence: '',
  beneficiary: '',
  destination: '',
  intendedOutcome: '',
};

const domains: Domain[] = ['AI', 'Finance', 'Healthcare', 'Manufacturing', 'HVAC', 'Government', 'Environmental', 'Other'];
const consequences: Consequence[] = ['Informational', 'Operational', 'Financial', 'Safety', 'Legal', 'Environmental'];

const steps = [
  { number: '01', label: 'Context' },
  { number: '02', label: 'Action' },
  { number: '03', label: 'Authority' },
  { number: '04', label: 'Evidence' },
  { number: '05', label: 'Outcome' },
  { number: '06', label: 'Route brief' },
];

function clean(value: string) {
  return value.trim();
}

export default function DiscoverRoutePage() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<DiscoveryState>(initialState);

  const update = <K extends keyof DiscoveryState>(key: K, value: DiscoveryState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const missing = useMemo(() => {
    const items: string[] = [];
    if (!state.actor.trim()) items.push('Accountable actor');
    if (!state.authority.trim()) items.push('Authority source');
    if (!state.evidence.trim()) items.push('Required evidence');
    if (!state.beneficiary.trim()) items.push('Beneficiary or affected party');
    if (!state.destination.trim()) items.push('Execution destination');
    if (!state.intendedOutcome.trim()) items.push('Verifiable intended outcome');
    return items;
  }, [state]);

  const routeBrief = useMemo(
    () => ({
      schema: 'TA14_ROUTE_DISCOVERY_V1',
      status: missing.length === 0 ? 'READY_FOR_CONSTRUCTION' : 'DISCOVERY_INCOMPLETE',
      createdAt: new Date().toISOString(),
      context: {
        domain: state.domain || 'UNKNOWN',
        system: clean(state.system) || 'UNKNOWN',
      },
      proposal: {
        action: clean(state.proposedAction) || 'UNKNOWN',
        consequence: state.consequence || 'UNKNOWN',
      },
      bindings: {
        actor: clean(state.actor) || 'UNKNOWN',
        authority: clean(state.authority) || 'UNKNOWN',
        beneficiary: clean(state.beneficiary) || 'UNKNOWN',
        destination: clean(state.destination) || 'UNKNOWN',
      },
      record: {
        requiredEvidence: clean(state.evidence) || 'UNKNOWN',
      },
      outcome: {
        intended: clean(state.intendedOutcome) || 'UNKNOWN',
      },
      unresolvedRequirements: missing,
      governingPrinciple: 'No admissible evidence. No admissible execution.',
    }),
    [missing, state],
  );

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(state.domain && clean(state.system));
    if (step === 1) return Boolean(clean(state.proposedAction) && state.consequence);
    if (step === 2) return Boolean(clean(state.actor));
    if (step === 3) return true;
    if (step === 4) return Boolean(clean(state.intendedOutcome));
    return true;
  }, [state, step]);

  const downloadBrief = () => {
    const blob = new Blob([JSON.stringify(routeBrief, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ta14-route-discovery.json';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const restart = () => {
    setState(initialState);
    setStep(0);
  };

  return (
    <main className="discover-page">
      <style>{`
        * { box-sizing: border-box; }
        .discover-page { min-height: calc(100vh - 68px); padding: 42px 0 100px; color: #edf7ff; }
        .wrap { width: min(1320px, calc(100% - 48px)); margin: 0 auto; }
        .hero { position: relative; overflow: hidden; padding: clamp(32px, 6vw, 72px); border: 1px solid rgba(126, 190, 225, .16); border-radius: 34px; background: radial-gradient(circle at 85% 18%, rgba(76, 244, 175, .13), transparent 26%), radial-gradient(circle at 14% 0%, rgba(58, 195, 255, .16), transparent 35%), linear-gradient(140deg, rgba(15, 33, 51, .97), rgba(5, 12, 20, .98)); box-shadow: 0 38px 120px rgba(0, 0, 0, .34); }
        .hero::after { content: 'DISCOVER'; position: absolute; right: -10px; bottom: -35px; color: rgba(255,255,255,.025); font-size: clamp(5rem, 15vw, 12rem); font-weight: 1000; letter-spacing: -.08em; line-height: 1; }
        .hero-copy { position: relative; z-index: 1; max-width: 900px; }
        .eyebrow { color: #61e8fa; font-size: .74rem; font-weight: 950; letter-spacing: .16em; text-transform: uppercase; }
        h1 { margin: 17px 0 22px; font-size: clamp(3.1rem, 7vw, 7rem); line-height: .92; letter-spacing: -.07em; }
        .gradient { color: transparent; background: linear-gradient(100deg, #fff 5%, #8feaff 48%, #5cf1b7 96%); background-clip: text; -webkit-background-clip: text; }
        .hero p { max-width: 760px; margin: 0; color: #9fb3c8; font-size: clamp(1rem, 1.7vw, 1.22rem); line-height: 1.75; }
        .principle { display: inline-flex; margin-top: 25px; padding: 11px 16px; border: 1px solid rgba(90, 239, 183, .24); border-radius: 999px; color: #aef8d2; background: rgba(59, 220, 159, .06); font-size: .8rem; font-weight: 900; letter-spacing: .06em; }
        .workspace { display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 22px; margin-top: 24px; }
        .rail, .panel { border: 1px solid rgba(124, 174, 212, .14); background: rgba(8, 18, 29, .8); backdrop-filter: blur(18px); box-shadow: 0 28px 80px rgba(0,0,0,.22); }
        .rail { padding: 20px; border-radius: 26px; align-self: start; position: sticky; top: 88px; }
        .step { display: flex; align-items: center; gap: 12px; width: 100%; padding: 13px 10px; border: 0; border-radius: 14px; color: #71869a; background: transparent; text-align: left; font: inherit; }
        .step.active { color: #fff; background: rgba(81, 214, 241, .08); }
        .step.complete { color: #a8efd0; }
        .step-number { display: grid; place-items: center; width: 30px; height: 30px; border: 1px solid rgba(125, 181, 216, .17); border-radius: 10px; font-size: .66rem; font-weight: 950; }
        .step.active .step-number { border-color: rgba(82, 226, 248, .46); color: #65eafa; }
        .step-label { font-size: .83rem; font-weight: 850; }
        .progress { height: 4px; margin: 18px 10px 2px; border-radius: 99px; background: rgba(255,255,255,.06); overflow: hidden; }
        .progress > span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #55d9ff, #54ecaa); transition: width .3s ease; }
        .panel { min-height: 580px; padding: clamp(25px, 4vw, 48px); border-radius: 28px; }
        .panel-head { display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; margin-bottom: 32px; }
        .panel-kicker { color: #5de4f7; font-size: .68rem; font-weight: 950; letter-spacing: .15em; text-transform: uppercase; }
        h2 { margin: 10px 0 0; font-size: clamp(2rem, 4vw, 3.8rem); letter-spacing: -.05em; line-height: 1; }
        .stage { min-width: 82px; padding: 8px 12px; border-radius: 999px; color: #92a7b9; background: rgba(255,255,255,.045); font-size: .7rem; font-weight: 900; text-align: center; }
        .prompt { margin: 0 0 24px; color: #9caec0; line-height: 1.7; }
        .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .choice-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-bottom: 24px; }
        .choice { min-height: 75px; padding: 13px; border: 1px solid rgba(128, 179, 215, .14); border-radius: 17px; color: #a9bac8; background: rgba(255,255,255,.025); font: inherit; font-size: .78rem; font-weight: 900; cursor: pointer; transition: .2s ease; }
        .choice:hover, .choice.selected { transform: translateY(-2px); border-color: rgba(86, 230, 247, .48); color: #fff; background: rgba(71, 211, 235, .08); }
        label { display: block; color: #c8d6e2; font-size: .76rem; font-weight: 900; letter-spacing: .03em; }
        input, textarea { width: 100%; margin-top: 9px; border: 1px solid rgba(128, 179, 215, .16); border-radius: 16px; outline: none; color: #eef8ff; background: rgba(2, 9, 16, .62); font: inherit; transition: border-color .2s ease, box-shadow .2s ease; }
        input { height: 52px; padding: 0 15px; }
        textarea { min-height: 132px; padding: 15px; resize: vertical; line-height: 1.55; }
        input:focus, textarea:focus { border-color: rgba(85, 229, 247, .55); box-shadow: 0 0 0 4px rgba(65, 203, 232, .07); }
        .hint { margin-top: 9px; color: #6f8295; font-size: .72rem; line-height: 1.5; }
        .actions { display: flex; justify-content: space-between; gap: 12px; margin-top: 34px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.06); }
        .button, .link-button { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 20px; border-radius: 999px; text-decoration: none; font: inherit; font-size: .82rem; font-weight: 950; cursor: pointer; transition: .2s ease; }
        .button { border: 1px solid rgba(139, 181, 211, .18); color: #b2c2cf; background: rgba(255,255,255,.035); }
        .button.primary, .link-button.primary { border: 0; color: #02120e; background: linear-gradient(100deg, #75e9ff, #5af0ad); box-shadow: 0 13px 35px rgba(61, 224, 174, .14); }
        .button:disabled { opacity: .35; cursor: not-allowed; }
        .button:not(:disabled):hover, .link-button:hover { transform: translateY(-2px); }
        .brief-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 18px; }
        .brief, .requirements { padding: 20px; border: 1px solid rgba(128, 179, 215, .13); border-radius: 20px; background: rgba(255,255,255,.025); }
        .brief-row { padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,.055); }
        .brief-row:last-child { border-bottom: 0; }
        .brief-key { color: #6ee6f5; font-size: .65rem; font-weight: 950; letter-spacing: .11em; text-transform: uppercase; }
        .brief-value { margin-top: 7px; color: #dce8f0; line-height: 1.5; overflow-wrap: anywhere; }
        .status { display: inline-flex; padding: 8px 12px; border-radius: 999px; font-size: .68rem; font-weight: 950; letter-spacing: .06em; }
        .status.ready { color: #aaf6d0; background: rgba(68, 224, 159, .09); border: 1px solid rgba(68, 224, 159, .2); }
        .status.hold { color: #ffd798; background: rgba(255, 177, 62, .08); border: 1px solid rgba(255, 177, 62, .2); }
        .requirements h3 { margin: 0 0 15px; font-size: 1rem; }
        .requirements ul { margin: 0; padding: 0; list-style: none; }
        .requirements li { display: flex; gap: 10px; padding: 10px 0; color: #9dafbf; font-size: .82rem; border-bottom: 1px solid rgba(255,255,255,.05); }
        .requirements li:last-child { border-bottom: 0; }
        .check { color: #5ee9af; font-weight: 1000; }
        .warn { color: #ffc36d; font-weight: 1000; }
        .json { max-height: 260px; margin-top: 18px; padding: 16px; overflow: auto; border-radius: 16px; color: #9debd4; background: #030b11; font: 11px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } .rail { position: static; display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; } .step { padding: 10px 7px; } .step-label { display: none; } .progress { grid-column: 1 / -1; } .choice-grid { grid-template-columns: repeat(2, 1fr); } .brief-grid { grid-template-columns: 1fr; } }
        @media (max-width: 620px) { .wrap { width: min(100% - 24px, 1320px); } .discover-page { padding-top: 18px; } .hero { border-radius: 24px; padding: 28px 22px 40px; } .grid { grid-template-columns: 1fr; } .choice-grid { grid-template-columns: 1fr 1fr; } .panel { padding: 24px 18px; border-radius: 22px; } .panel-head { flex-direction: column; } .actions { align-items: stretch; } .button, .link-button { flex: 1; padding: 0 13px; } }
      `}</style>

      <div className="wrap">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">TA-14 Exchange · Guided intake</span>
            <h1><span className="gradient">Discover My Route</span></h1>
            <p>Start with the consequence you are trying to govern. The Exchange will turn your description into a structured route-discovery brief while preserving every unsupported field as explicitly unknown.</p>
            <span className="principle">No admissible evidence. No admissible execution.</span>
          </div>
        </section>

        <section className="workspace">
          <aside className="rail" aria-label="Discovery progress">
            {steps.map((item, index) => (
              <button key={item.number} type="button" className={`step ${index === step ? 'active' : ''} ${index < step ? 'complete' : ''}`} onClick={() => index < step && setStep(index)}>
                <span className="step-number">{index < step ? '✓' : item.number}</span>
                <span className="step-label">{item.label}</span>
              </button>
            ))}
            <div className="progress"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
          </aside>

          <div className="panel">
            {step === 0 && (
              <>
                <header className="panel-head"><div><span className="panel-kicker">Context</span><h2>What are you governing?</h2></div><span className="stage">Step 1 of 6</span></header>
                <p className="prompt">Choose the closest operating domain and identify the system, workflow, model, machine, or process where consequence can occur.</p>
                <div className="choice-grid">
                  {domains.map((domain) => <button key={domain} type="button" className={`choice ${state.domain === domain ? 'selected' : ''}`} onClick={() => update('domain', domain)}>{domain}</button>)}
                </div>
                <label>System or process<input value={state.system} onChange={(event) => update('system', event.target.value)} placeholder="Example: autonomous supplier-payment agent" /></label>
              </>
            )}

            {step === 1 && (
              <>
                <header className="panel-head"><div><span className="panel-kicker">Proposed action</span><h2>What may the system do?</h2></div><span className="stage">Step 2 of 6</span></header>
                <p className="prompt">Describe the action in plain language, then classify the primary consequence created if that action executes.</p>
                <label>Proposed consequential action<textarea value={state.proposedAction} onChange={(event) => update('proposedAction', event.target.value)} placeholder="Example: release a supplier payment above the organization's autonomous-execution threshold" /></label>
                <div className="choice-grid" style={{ marginTop: 20 }}>
                  {consequences.map((item) => <button key={item} type="button" className={`choice ${state.consequence === item ? 'selected' : ''}`} onClick={() => update('consequence', item)}>{item}</button>)}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <header className="panel-head"><div><span className="panel-kicker">Authority boundary</span><h2>Who may cause the consequence?</h2></div><span className="stage">Step 3 of 6</span></header>
                <p className="prompt">Separate the actor from the authority. Identity alone does not establish permission, and permission alone does not prove that it applies to this exact route.</p>
                <div className="grid">
                  <label>Accountable actor<input value={state.actor} onChange={(event) => update('actor', event.target.value)} placeholder="Person, service, agent, device, or organization" /></label>
                  <label>Authority source<input value={state.authority} onChange={(event) => update('authority', event.target.value)} placeholder="Policy, mandate, approval, role, license, or rule" /></label>
                  <label>Beneficiary or affected party<input value={state.beneficiary} onChange={(event) => update('beneficiary', event.target.value)} placeholder="Who receives value or bears the consequence?" /></label>
                  <label>Execution destination<input value={state.destination} onChange={(event) => update('destination', event.target.value)} placeholder="Account, endpoint, machine, environment, or physical location" /></label>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <header className="panel-head"><div><span className="panel-kicker">Evidence requirement</span><h2>What must be true before execution?</h2></div><span className="stage">Step 4 of 6</span></header>
                <p className="prompt">State the evidence needed to prove reality, identity, authority, continuity, destination, timing, and any domain-specific threshold. Unsupported values remain unknown rather than silently assumed.</p>
                <label>Required evidence<textarea value={state.evidence} onChange={(event) => update('evidence', event.target.value)} placeholder="Example: approved purchase order, current delegation, verified supplier identity, bound bank account, invoice match, sanctions check, and valid time window" /></label>
                <p className="hint">This is discovery, not an admissibility decision. The scanner and route engine will later test whether the required artifacts are present, valid, continuous, and correctly bound.</p>
              </>
            )}

            {step === 4 && (
              <>
                <header className="panel-head"><div><span className="panel-kicker">Outcome correspondence</span><h2>What result must be verified?</h2></div><span className="stage">Step 5 of 6</span></header>
                <p className="prompt">Define the intended result in a way that can be checked after execution. A completed command is not automatically a verified outcome.</p>
                <label>Intended verifiable outcome<textarea value={state.intendedOutcome} onChange={(event) => update('intendedOutcome', event.target.value)} placeholder="Example: the authorized supplier receives the exact approved amount in the bound account, and an authoritative settlement receipt confirms finality" /></label>
              </>
            )}

            {step === 5 && (
              <>
                <header className="panel-head"><div><span className="panel-kicker">Generated discovery record</span><h2>Your route brief</h2></div><span className="stage">Step 6 of 6</span></header>
                <div className="brief-grid">
                  <div className="brief">
                    <span className={`status ${missing.length ? 'hold' : 'ready'}`}>{missing.length ? 'DISCOVERY INCOMPLETE' : 'READY FOR CONSTRUCTION'}</span>
                    {[
                      ['Domain', state.domain || 'UNKNOWN'], ['System', state.system || 'UNKNOWN'], ['Action', state.proposedAction || 'UNKNOWN'], ['Consequence', state.consequence || 'UNKNOWN'], ['Actor', state.actor || 'UNKNOWN'], ['Authority', state.authority || 'UNKNOWN'], ['Evidence', state.evidence || 'UNKNOWN'], ['Beneficiary', state.beneficiary || 'UNKNOWN'], ['Destination', state.destination || 'UNKNOWN'], ['Outcome', state.intendedOutcome || 'UNKNOWN'],
                    ].map(([key, value]) => <div className="brief-row" key={key}><div className="brief-key">{key}</div><div className="brief-value">{value}</div></div>)}
                  </div>
                  <div>
                    <div className="requirements">
                      <h3>Construction readiness</h3>
                      {missing.length === 0 ? <ul><li><span className="check">✓</span> Core discovery fields are defined. The route may proceed to structured construction and deterministic testing.</li></ul> : <ul>{missing.map((item) => <li key={item}><span className="warn">!</span>{item} remains unresolved.</li>)}</ul>}
                    </div>
                    <pre className="json">{JSON.stringify(routeBrief, null, 2)}</pre>
                  </div>
                </div>
              </>
            )}

            <div className="actions">
              <div>{step > 0 && <button className="button" type="button" onClick={() => setStep((value) => value - 1)}>← Back</button>}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {step === 5 ? (
                  <>
                    <button className="button" type="button" onClick={restart}>Restart</button>
                    <button className="button" type="button" onClick={downloadBrief}>Download JSON</button>
                    <Link className="link-button primary" href="/workspace/build">Continue to builder →</Link>
                  </>
                ) : <button className="button primary" type="button" disabled={!canContinue} onClick={() => setStep((value) => Math.min(value + 1, 5))}>Continue →</button>}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
