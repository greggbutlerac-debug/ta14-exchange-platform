'use client';

import Link from 'next/link';
import { ChangeEvent, useMemo, useState } from 'react';

type Decision = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';
type Severity = 'PASS' | 'WARNING' | 'FAIL';
type StageKey = 'reality' | 'record' | 'continuity' | 'admissibility' | 'binding' | 'commit' | 'execution' | 'outcome';

type Finding = {
  id: string;
  stage: StageKey;
  severity: Severity;
  title: string;
  detail: string;
  correction: string;
};

type RouteLike = {
  schema?: string;
  routeId?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  chain?: Partial<Record<StageKey, unknown>>;
  [key: string]: unknown;
};

const stages: { key: StageKey; number: string; label: string }[] = [
  { key: 'reality', number: '01', label: 'Reality' },
  { key: 'record', number: '02', label: 'Record' },
  { key: 'continuity', number: '03', label: 'Continuity' },
  { key: 'admissibility', number: '04', label: 'Admissibility' },
  { key: 'binding', number: '05', label: 'Binding' },
  { key: 'commit', number: '06', label: 'Commit' },
  { key: 'execution', number: '07', label: 'Execution' },
  { key: 'outcome', number: '08', label: 'Outcome' },
];

const sampleRoute: RouteLike = {
  schema: 'TA14_ROUTE_DRAFT_V1',
  routeId: 'draft:vendor-payment',
  status: 'READY_FOR_TEST',
  metadata: {
    name: 'Vendor payment',
    domain: 'Finance',
    owner: 'Accounts Payable Governance',
    version: 1,
  },
  chain: {
    reality: 'An approved supplier invoice exists for equipment received by the organization.',
    record: 'Signed invoice, purchase order, delivery confirmation, supplier identity record, and approval evidence.',
    continuity: 'Source digests, timestamps, signer identities, dependency references, and superseded versions are preserved.',
    admissibility: 'Invoice must match the purchase order, delivery must be confirmed, supplier status must be active, and the approval threshold must be satisfied.',
    binding: 'Bind the requesting actor, approving authority, supplier beneficiary, bank destination, invoice, amount, currency, and payment environment.',
    commit: 'Freeze the canonical payment route, evidence set, decision receipt, bindings, expiry time, and route digest.',
    execution: 'Release only the committed amount and currency to the bound destination through the approved payment rail.',
    outcome: 'Verify settlement using the processor receipt, bank trace, settled amount, destination confirmation, timestamp, and reconciliation result.',
  },
};

const brokenRoute: RouteLike = {
  schema: 'TA14_ROUTE_DRAFT_V1',
  routeId: 'draft:incomplete-ai-action',
  status: 'DRAFT',
  metadata: {
    name: 'Autonomous refund approval',
    domain: 'AI Governance',
    owner: 'UNKNOWN',
    version: 1,
  },
  chain: {
    reality: 'An AI agent proposes a customer refund.',
    record: 'Prompt and customer request.',
    continuity: 'UNKNOWN',
    admissibility: 'Refund appears reasonable.',
    binding: 'Customer account.',
    commit: 'UNKNOWN',
    execution: 'Issue the refund.',
    outcome: 'UNKNOWN',
  },
};

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return JSON.stringify(value);
}

function isUnknown(value: unknown) {
  const text = asText(value).toUpperCase();
  return !text || text === 'UNKNOWN' || text === 'UNDEFINED' || text === 'N/A';
}

function includesAny(value: unknown, words: string[]) {
  const text = asText(value).toLowerCase();
  return words.some((word) => text.includes(word));
}

function scanRoute(route: RouteLike): Finding[] {
  const chain = route.chain ?? {};
  const findings: Finding[] = [];

  for (const stage of stages) {
    const value = chain[stage.key];
    if (isUnknown(value)) {
      findings.push({
        id: `${stage.key}-missing`,
        stage: stage.key,
        severity: 'FAIL',
        title: `${stage.label} is unresolved`,
        detail: `The route does not contain an admissible definition for ${stage.label}. UNKNOWN values remain visible and cannot be treated as satisfied.`,
        correction: `Define the ${stage.label} stage with evidence-bound, route-specific language before testing again.`,
      });
    } else if (asText(value).length < 24) {
      findings.push({
        id: `${stage.key}-thin`,
        stage: stage.key,
        severity: 'WARNING',
        title: `${stage.label} may be under-specified`,
        detail: `The ${stage.label} definition is present but may not contain enough specificity to survive independent review.`,
        correction: `Add actors, objects, conditions, dependencies, limits, or authoritative artifacts relevant to this stage.`,
      });
    } else {
      findings.push({
        id: `${stage.key}-present`,
        stage: stage.key,
        severity: 'PASS',
        title: `${stage.label} is defined`,
        detail: `A non-empty route definition is present for ${stage.label}.`,
        correction: 'No structural correction is required at this stage.',
      });
    }
  }

  if (!route.schema || !asText(route.schema).startsWith('TA14_')) {
    findings.push({
      id: 'schema-unrecognized',
      stage: 'record',
      severity: 'WARNING',
      title: 'Schema identity is missing or unrecognized',
      detail: 'The scanner could not confirm a TA-14 route schema identifier.',
      correction: 'Declare a supported schema such as TA14_ROUTE_DRAFT_V1 and preserve it with the route record.',
    });
  }

  if (!route.routeId || isUnknown(route.routeId)) {
    findings.push({
      id: 'route-id-missing',
      stage: 'continuity',
      severity: 'FAIL',
      title: 'Route identity is missing',
      detail: 'The route cannot be reliably referenced, versioned, replayed, or compared without a stable route identifier.',
      correction: 'Assign a stable routeId and preserve it across corrections and superseding versions.',
    });
  }

  const owner = route.metadata?.owner;
  if (isUnknown(owner)) {
    findings.push({
      id: 'owner-unknown',
      stage: 'binding',
      severity: 'FAIL',
      title: 'Route ownership is unknown',
      detail: 'No accountable person, team, or organization is bound to the route definition.',
      correction: 'Bind an accountable route owner before the route can advance beyond HOLD.',
    });
  }

  if (!includesAny(chain.continuity, ['digest', 'hash', 'provenance', 'version', 'custody', 'timestamp', 'source'])) {
    findings.push({
      id: 'continuity-mechanism',
      stage: 'continuity',
      severity: 'FAIL',
      title: 'Continuity mechanism is not evident',
      detail: 'The continuity stage does not identify a recognizable method for preserving provenance, custody, digests, timestamps, or version history.',
      correction: 'Specify how source identity, transformations, dependencies, and superseded versions remain provable.',
    });
  }

  if (!includesAny(chain.admissibility, ['must', 'required', 'threshold', 'valid', 'complete', 'current', 'confirmed'])) {
    findings.push({
      id: 'admissibility-test',
      stage: 'admissibility',
      severity: 'WARNING',
      title: 'Admissibility rule may be subjective',
      detail: 'The stated rule does not clearly express deterministic requirements or thresholds.',
      correction: 'Replace preference language with testable conditions that can produce ALLOW, HOLD, DENY, or ESCALATE.',
    });
  }

  if (!includesAny(chain.binding, ['actor', 'authority', 'beneficiary', 'destination', 'environment', 'object', 'bind'])) {
    findings.push({
      id: 'binding-dimensions',
      stage: 'binding',
      severity: 'FAIL',
      title: 'Critical binding dimensions are absent',
      detail: 'The route does not clearly bind the acting party, authority, affected party, destination, governed object, or execution environment.',
      correction: 'Bind every identity and destination that could change the legitimacy or consequence of execution.',
    });
  }

  if (!includesAny(chain.commit, ['digest', 'canonical', 'freeze', 'receipt', 'expiry', 'commit'])) {
    findings.push({
      id: 'commit-boundary',
      stage: 'commit',
      severity: 'FAIL',
      title: 'Executable commit boundary is not established',
      detail: 'The route does not identify the exact state that becomes immutable before execution.',
      correction: 'Define the canonical payload, dependency set, decision receipt, route digest, version, and temporal boundary.',
    });
  }

  if (!includesAny(chain.execution, ['match', 'correspond', 'only', 'bound', 'committed', 'limit'])) {
    findings.push({
      id: 'execution-correspondence',
      stage: 'execution',
      severity: 'WARNING',
      title: 'Execution correspondence is not explicit',
      detail: 'The route describes an action but does not clearly require the executed action to match the admitted and committed route.',
      correction: 'Require actor, payload, destination, timing, environment, and limits to correspond to the committed route.',
    });
  }

  if (!includesAny(chain.outcome, ['receipt', 'verify', 'trace', 'result', 'artifact', 'reconcile', 'confirmation'])) {
    findings.push({
      id: 'outcome-proof',
      stage: 'outcome',
      severity: 'FAIL',
      title: 'Authoritative outcome proof is not identified',
      detail: 'The route does not identify an external or authoritative artifact capable of proving what actually occurred.',
      correction: 'Name the authoritative outcome receipt, resulting state, reconciliation artifact, and divergence handling rule.',
    });
  }

  return findings;
}

function decisionFor(findings: Finding[]): Decision {
  const failures = findings.filter((finding) => finding.severity === 'FAIL').length;
  const warnings = findings.filter((finding) => finding.severity === 'WARNING').length;
  if (failures >= 6) return 'DENY';
  if (failures > 0) return 'HOLD';
  if (warnings >= 3) return 'ESCALATE';
  return 'ALLOW';
}

export default function ScannerPage() {
  const [sourceText, setSourceText] = useState(JSON.stringify(sampleRoute, null, 2));
  const [route, setRoute] = useState<RouteLike>(sampleRoute);
  const [parseError, setParseError] = useState('');
  const [selectedFinding, setSelectedFinding] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(true);

  const findings = useMemo(() => scanRoute(route), [route]);
  const decision = decisionFor(findings);
  const failures = findings.filter((finding) => finding.severity === 'FAIL').length;
  const warnings = findings.filter((finding) => finding.severity === 'WARNING').length;
  const passes = findings.filter((finding) => finding.severity === 'PASS').length;
  const score = Math.max(0, Math.round((passes / Math.max(findings.length, 1)) * 100));
  const activeFinding = findings.find((finding) => finding.id === selectedFinding) ?? findings.find((finding) => finding.severity !== 'PASS') ?? findings[0];

  const runScan = () => {
    try {
      const parsed = JSON.parse(sourceText) as RouteLike;
      setRoute(parsed);
      setParseError('');
      setSelectedFinding(null);
      setHasScanned(true);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'The route JSON could not be parsed.');
      setHasScanned(false);
    }
  };

  const loadRoute = (nextRoute: RouteLike) => {
    const text = JSON.stringify(nextRoute, null, 2);
    setSourceText(text);
    setRoute(nextRoute);
    setParseError('');
    setSelectedFinding(null);
    setHasScanned(true);
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setSourceText(text);
    try {
      const parsed = JSON.parse(text) as RouteLike;
      setRoute(parsed);
      setParseError('');
      setSelectedFinding(null);
      setHasScanned(true);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'The uploaded route could not be parsed.');
      setHasScanned(false);
    }
    event.target.value = '';
  };

  const downloadReport = () => {
    const report = {
      schema: 'TA14_ROUTE_SCAN_REPORT_V1',
      scannedRouteId: route.routeId ?? 'UNKNOWN',
      scannedAt: new Date().toISOString(),
      decision,
      score,
      summary: { failures, warnings, passes, totalFindings: findings.length },
      findings,
      governingPrinciple: 'No admissible evidence. No admissible execution.',
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ta14-route-scan-report.json';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="scanner-page">
      <style>{`
        * { box-sizing: border-box; }
        .scanner-page { min-height: calc(100vh - 68px); padding: 28px 0 90px; color: #eef8ff; }
        .wrap { width: min(1440px, calc(100% - 40px)); margin: 0 auto; }
        .hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 28px; padding: 30px; border: 1px solid rgba(120,183,219,.15); border-radius: 28px; background: radial-gradient(circle at 84% 4%, rgba(255,182,73,.12), transparent 28%), linear-gradient(145deg, rgba(14,31,47,.97), rgba(5,12,20,.98)); box-shadow: 0 30px 90px rgba(0,0,0,.3); }
        .eyebrow { color: #67e6f7; font-size: .68rem; font-weight: 950; letter-spacing: .16em; text-transform: uppercase; }
        h1 { margin: 10px 0; font-size: clamp(2.4rem, 5vw, 5.2rem); line-height: .95; letter-spacing: -.065em; }
        .subtitle { max-width: 800px; margin: 0; color: #9fb2c1; line-height: 1.7; }
        .hero-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 9px; }
        .button, .link-button, .file-label { display: inline-flex; align-items: center; justify-content: center; min-height: 43px; padding: 0 16px; border: 1px solid rgba(132,181,214,.18); border-radius: 999px; color: #b9cad7; background: rgba(255,255,255,.035); text-decoration: none; font: inherit; font-size: .74rem; font-weight: 900; cursor: pointer; transition: .2s ease; }
        .button:hover, .link-button:hover, .file-label:hover { transform: translateY(-2px); border-color: rgba(90,224,241,.42); color: #fff; }
        .button.primary { border: 0; color: #03130e; background: linear-gradient(100deg,#74eaff,#5cf0ae); }
        .file-label input { display: none; }
        .decision-strip { display: grid; grid-template-columns: 1.2fr repeat(4, minmax(100px, .55fr)); gap: 12px; margin: 18px 0; }
        .metric { padding: 18px; border: 1px solid rgba(126,179,213,.13); border-radius: 20px; background: rgba(7,17,28,.82); }
        .metric-label { color: #71879a; font-size: .62rem; font-weight: 950; letter-spacing: .1em; text-transform: uppercase; }
        .metric-value { margin-top: 8px; font-size: 1.45rem; font-weight: 1000; letter-spacing: -.03em; }
        .decision.allow { color: #69efb3; } .decision.hold { color: #ffc76c; } .decision.deny { color: #ff7f88; } .decision.escalate { color: #a9a1ff; }
        .metric-value.fail { color: #ff858d; } .metric-value.warn { color: #ffc66d; } .metric-value.pass { color: #69efb3; }
        .workspace { display: grid; grid-template-columns: minmax(0,1.05fr) minmax(420px,.95fr); gap: 16px; }
        .card { border: 1px solid rgba(126,179,213,.13); border-radius: 24px; background: rgba(7,17,28,.82); box-shadow: 0 24px 70px rgba(0,0,0,.2); }
        .source { padding: 20px; }
        .card-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 14px; }
        .card-head h2 { margin: 0; font-size: 1rem; }
        .small { color: #73899a; font-size: .68rem; }
        textarea { width: 100%; min-height: 630px; padding: 18px; border: 1px solid rgba(128,180,215,.16); border-radius: 17px; outline: none; color: #9fe9d2; background: #030a10; resize: vertical; font: 11px/1.65 ui-monospace,SFMono-Regular,Menlo,monospace; }
        textarea:focus { border-color: rgba(87,228,244,.55); box-shadow: 0 0 0 4px rgba(70,209,233,.06); }
        .error { margin-top: 12px; padding: 12px 14px; border: 1px solid rgba(255,103,112,.18); border-radius: 14px; color: #ffabb1; background: rgba(255,74,85,.055); font-size: .73rem; line-height: 1.5; }
        .results { display: grid; gap: 16px; }
        .chain-card { padding: 18px; }
        .chain { display: grid; grid-template-columns: repeat(8,1fr); gap: 6px; }
        .stage { padding: 11px 5px; border: 1px solid rgba(126,179,213,.11); border-radius: 12px; text-align: center; background: rgba(255,255,255,.025); }
        .stage.fail { border-color: rgba(255,105,116,.22); background: rgba(255,75,86,.05); }
        .stage.warn { border-color: rgba(255,195,90,.2); background: rgba(255,175,45,.045); }
        .stage.pass { border-color: rgba(87,235,172,.17); background: rgba(62,213,151,.04); }
        .stage-number { color: #657b8d; font-size: .56rem; font-weight: 950; }
        .stage-label { margin-top: 5px; color: #c9d7e0; font-size: .62rem; font-weight: 900; }
        .findings-card { overflow: hidden; }
        .findings-head { padding: 18px; border-bottom: 1px solid rgba(255,255,255,.05); }
        .findings-head h2 { margin: 0; font-size: 1rem; }
        .finding-list { max-height: 390px; overflow: auto; }
        .finding { display: grid; grid-template-columns: 10px 1fr auto; gap: 12px; width: 100%; padding: 14px 17px; border: 0; border-bottom: 1px solid rgba(255,255,255,.045); color: #9fb0bd; background: transparent; text-align: left; font: inherit; cursor: pointer; }
        .finding:hover, .finding.active { background: rgba(73,199,229,.055); }
        .finding-dot { width: 8px; height: 8px; margin-top: 5px; border-radius: 50%; }
        .finding-dot.FAIL { background: #ff737d; box-shadow: 0 0 12px rgba(255,91,103,.35); }
        .finding-dot.WARNING { background: #ffc465; box-shadow: 0 0 12px rgba(255,182,67,.3); }
        .finding-dot.PASS { background: #5de9aa; }
        .finding strong { display: block; color: #dce8ef; font-size: .73rem; }
        .finding span { display: block; margin-top: 4px; color: #758b9b; font-size: .65rem; }
        .severity { padding: 5px 7px; border-radius: 999px; color: #8498a7; background: rgba(255,255,255,.04); font-size: .56rem; font-weight: 950; }
        .detail-card { padding: 20px; }
        .detail-kicker { color: #60e1f4; font-size: .62rem; font-weight: 950; letter-spacing: .12em; text-transform: uppercase; }
        .detail-card h3 { margin: 8px 0 10px; font-size: 1.35rem; letter-spacing: -.03em; }
        .detail-card p { color: #94a9b8; font-size: .75rem; line-height: 1.65; }
        .correction { margin-top: 15px; padding: 14px; border: 1px solid rgba(94,229,177,.14); border-radius: 15px; color: #a8dec9; background: rgba(53,206,146,.04); font-size: .72rem; line-height: 1.6; }
        .principle { margin-top: 16px; padding: 14px; border-radius: 15px; color: #9fefd0; background: rgba(67,220,159,.055); font-size: .72rem; font-weight: 900; text-align: center; }
        .footer-actions { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px; margin-top: 18px; }
        @media (max-width: 1040px) { .workspace { grid-template-columns: 1fr; } .decision-strip { grid-template-columns: repeat(3,1fr); } .metric:first-child { grid-column: span 2; } textarea { min-height: 480px; } }
        @media (max-width: 700px) { .wrap { width: min(100% - 22px,1440px); } .hero { padding: 24px 20px; flex-direction: column; } .hero-actions { justify-content: flex-start; } .decision-strip { grid-template-columns: 1fr 1fr; } .metric:first-child { grid-column: 1 / -1; } .chain { grid-template-columns: repeat(4,1fr); } .workspace { grid-template-columns: minmax(0,1fr); } }
      `}</style>

      <div className="wrap">
        <header className="hero">
          <div>
            <span className="eyebrow">TA-14 Exchange · Deterministic route review</span>
            <h1>Readiness Scanner</h1>
            <p className="subtitle">Paste or upload a route draft and inspect it against the complete Reality → Outcome chain. The scanner preserves unknowns, identifies structural defects, and produces a bounded ALLOW, HOLD, DENY, or ESCALATE decision.</p>
          </div>
          <div className="hero-actions">
            <Link className="link-button" href="/workspace/build">← Route Builder</Link>
            <button className="button" type="button" onClick={() => loadRoute(sampleRoute)}>Load complete sample</button>
            <button className="button" type="button" onClick={() => loadRoute(brokenRoute)}>Load defective sample</button>
            <label className="file-label">Upload JSON<input type="file" accept="application/json,.json" onChange={handleFile} /></label>
          </div>
        </header>

        <section className="decision-strip" aria-label="Scan summary">
          <div className="metric"><div className="metric-label">Route decision</div><div className={`metric-value decision ${decision.toLowerCase()}`}>{hasScanned ? decision : 'UNSCANNED'}</div></div>
          <div className="metric"><div className="metric-label">Readiness score</div><div className="metric-value">{hasScanned ? `${score}%` : '—'}</div></div>
          <div className="metric"><div className="metric-label">Failures</div><div className="metric-value fail">{hasScanned ? failures : '—'}</div></div>
          <div className="metric"><div className="metric-label">Warnings</div><div className="metric-value warn">{hasScanned ? warnings : '—'}</div></div>
          <div className="metric"><div className="metric-label">Passed checks</div><div className="metric-value pass">{hasScanned ? passes : '—'}</div></div>
        </section>

        <section className="workspace">
          <div className="card source">
            <div className="card-head"><div><h2>Route source</h2><div className="small">TA-14 route JSON or compatible object</div></div><button className="button primary" type="button" onClick={runScan}>Run scanner</button></div>
            <textarea value={sourceText} onChange={(event) => setSourceText(event.target.value)} spellCheck={false} aria-label="Route JSON" />
            {parseError && <div className="error"><strong>JSON parse failure.</strong><br />{parseError}</div>}
          </div>

          <div className="results">
            <section className="card chain-card">
              <div className="card-head"><div><h2>Execution chain coverage</h2><div className="small">Worst finding determines each stage state</div></div></div>
              <div className="chain">
                {stages.map((stage) => {
                  const stageFindings = findings.filter((finding) => finding.stage === stage.key);
                  const state = stageFindings.some((finding) => finding.severity === 'FAIL') ? 'fail' : stageFindings.some((finding) => finding.severity === 'WARNING') ? 'warn' : 'pass';
                  return <div className={`stage ${state}`} key={stage.key}><div className="stage-number">{stage.number}</div><div className="stage-label">{stage.label}</div></div>;
                })}
              </div>
            </section>

            <section className="card findings-card">
              <div className="findings-head"><h2>Scanner findings</h2><div className="small">Select any finding to inspect its correction path</div></div>
              <div className="finding-list">
                {findings.map((finding) => (
                  <button className={`finding ${activeFinding?.id === finding.id ? 'active' : ''}`} type="button" key={finding.id} onClick={() => setSelectedFinding(finding.id)}>
                    <span className={`finding-dot ${finding.severity}`} />
                    <span><strong>{finding.title}</strong><span>{stages.find((stage) => stage.key === finding.stage)?.label}</span></span>
                    <span className="severity">{finding.severity}</span>
                  </button>
                ))}
              </div>
            </section>

            {activeFinding && <section className="card detail-card">
              <div className="detail-kicker">{activeFinding.severity} · {activeFinding.stage}</div>
              <h3>{activeFinding.title}</h3>
              <p>{activeFinding.detail}</p>
              <div className="correction"><strong>Correction path:</strong><br />{activeFinding.correction}</div>
            </section>}
          </div>
        </section>

        <div className="principle">No admissible evidence. No admissible execution.</div>
        <div className="footer-actions">
          <Link className="link-button" href="/workspace/build">Revise in Route Builder</Link>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <button className="button" type="button" onClick={downloadReport}>Download scan report</button>
            <Link className="link-button" href="/workspace/demonstrations">Open Demonstration Lab →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
