'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type StageKey =
  | 'reality'
  | 'record'
  | 'continuity'
  | 'admissibility'
  | 'binding'
  | 'commit'
  | 'execution'
  | 'outcome';

type ExtractedRoute = {
  schema: 'TA14_PASTED_ROUTE_EXTRACTION_V1';
  extractionId: string;
  status: 'HOLD' | 'READY_FOR_REVIEW';
  createdAt: string;
  source: {
    title: string;
    sourceType: string;
    characterCount: number;
    digest: string;
  };
  route: {
    name: string;
    domain: string;
    owner: string;
    chain: Record<StageKey, string>;
  };
  findings: Array<{
    stage: StageKey | 'route';
    severity: 'INFO' | 'HOLD';
    message: string;
  }>;
};

const stages: Array<{
  key: StageKey;
  number: string;
  label: string;
  question: string;
  signals: string[];
}> = [
  {
    key: 'reality',
    number: '01',
    label: 'Reality',
    question: 'What condition or event exists before action?',
    signals: ['when', 'if', 'trigger', 'condition', 'request', 'incident', 'detected'],
  },
  {
    key: 'record',
    number: '02',
    label: 'Record',
    question: 'What evidence represents that reality?',
    signals: ['record', 'evidence', 'document', 'receipt', 'log', 'report', 'data'],
  },
  {
    key: 'continuity',
    number: '03',
    label: 'Continuity',
    question: 'How is provenance and custody preserved?',
    signals: ['provenance', 'lineage', 'custody', 'digest', 'hash', 'timestamp', 'version'],
  },
  {
    key: 'admissibility',
    number: '04',
    label: 'Admissibility',
    question: 'What rules must pass before consequence?',
    signals: ['must', 'eligible', 'policy', 'threshold', 'valid', 'approved', 'allowed'],
  },
  {
    key: 'binding',
    number: '05',
    label: 'Binding',
    question: 'Who and what must be bound to the route?',
    signals: ['bind', 'actor', 'authority', 'beneficiary', 'destination', 'identity', 'account'],
  },
  {
    key: 'commit',
    number: '06',
    label: 'Commit',
    question: 'What exact payload becomes immutable?',
    signals: ['commit', 'freeze', 'canonical', 'signed', 'signature', 'immutable', 'payload'],
  },
  {
    key: 'execution',
    number: '07',
    label: 'Execution',
    question: 'What consequence-bearing action occurs?',
    signals: ['execute', 'issue', 'send', 'pay', 'change', 'release', 'act'],
  },
  {
    key: 'outcome',
    number: '08',
    label: 'Outcome',
    question: 'How is the result independently verified?',
    signals: ['outcome', 'result', 'verify', 'settlement', 'confirmation', 'reconcile', 'completed'],
  },
];

const sample = `Autonomous vendor payment approval

When an approved invoice is received, the accounts-payable agent compares the invoice to the purchase order and receiving record. The payment may proceed only when the supplier is active, the amount is within the delegated approval threshold, and the destination account matches the verified supplier profile.

The system should preserve the invoice, purchase order, receiving record, approval identity, policy version, timestamps, and document hashes. It should bind the supplier, invoice, approving authority, amount, bank destination, payment processor, and execution environment.

Before payment, freeze and sign the canonical payment payload. Execute only that committed payload. After execution, verify processor settlement, destination, amount, timestamp, and ledger reconciliation.`;

function digest(input: string): string {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sentences(input: string): string[] {
  return input
    .replace(/\r/g, '')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 12);
}

function inferDomain(input: string): string {
  const lower = input.toLowerCase();
  const domains: Array<[string, string[]]> = [
    ['Financial Governance', ['payment', 'invoice', 'refund', 'bank', 'supplier', 'transaction']],
    ['AI Governance', ['model', 'agent', 'prompt', 'ai ', 'autonomous', 'inference']],
    ['Healthcare Governance', ['patient', 'clinical', 'medical', 'diagnosis', 'medication']],
    ['HVAC Governance', ['refrigerant', 'compressor', 'airflow', 'temperature', 'hvac']],
    ['Environmental Governance', ['emission', 'environment', 'air quality', 'water', 'pollution']],
    ['Government Governance', ['agency', 'public', 'benefit', 'permit', 'government']],
  ];

  let best = 'General Governance';
  let score = 0;
  for (const [name, words] of domains) {
    const current = words.filter((word) => lower.includes(word)).length;
    if (current > score) {
      score = current;
      best = name;
    }
  }
  return best;
}

function inferName(input: string): string {
  const firstLine = input
    .split(/\n/)
    .map((line) => line.trim())
    .find((line) => line.length >= 4 && line.length <= 90);
  return firstLine || 'Untitled pasted route';
}

function extractStage(allSentences: string[], signals: string[]): string {
  const ranked = allSentences
    .map((sentence) => ({
      sentence,
      score: signals.reduce(
        (total, signal) => total + (sentence.toLowerCase().includes(signal) ? 1 : 0),
        0,
      ),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.sentence.length - b.sentence.length);

  if (!ranked.length) return 'UNKNOWN';
  return ranked
    .slice(0, 2)
    .map((item) => item.sentence)
    .join(' ')
    .slice(0, 520);
}

function extract(input: string, title: string, sourceType: string): ExtractedRoute {
  const clean = input.trim();
  const allSentences = sentences(clean);
  const chain = Object.fromEntries(
    stages.map((stage) => [stage.key, extractStage(allSentences, stage.signals)]),
  ) as Record<StageKey, string>;

  const findings: ExtractedRoute['findings'] = [];
  for (const stage of stages) {
    if (chain[stage.key] === 'UNKNOWN') {
      findings.push({
        stage: stage.key,
        severity: 'HOLD',
        message: `${stage.label} could not be established from the pasted material.`,
      });
    } else {
      findings.push({
        stage: stage.key,
        severity: 'INFO',
        message: `${stage.label} contains a candidate statement and requires human confirmation.`,
      });
    }
  }

  findings.unshift({
    stage: 'route',
    severity: 'INFO',
    message:
      'Extraction identifies candidate route content only. It does not establish evidence truth, authority, continuity, or admissibility.',
  });

  const unknownCount = Object.values(chain).filter((value) => value === 'UNKNOWN').length;
  const sourceDigest = digest(clean);

  return {
    schema: 'TA14_PASTED_ROUTE_EXTRACTION_V1',
    extractionId: `paste:${sourceDigest.split(':')[1]}`,
    status: unknownCount === 0 ? 'READY_FOR_REVIEW' : 'HOLD',
    createdAt: new Date().toISOString(),
    source: {
      title: title.trim() || inferName(clean),
      sourceType: sourceType.trim() || 'UNSPECIFIED_TEXT',
      characterCount: clean.length,
      digest: sourceDigest,
    },
    route: {
      name: inferName(clean),
      domain: inferDomain(clean),
      owner: 'UNKNOWN',
      chain,
    },
    findings,
  };
}

export default function PasteAnythingPage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [sourceType, setSourceType] = useState('Policy, workflow, procedure, or architecture notes');
  const [result, setResult] = useState<ExtractedRoute | null>(null);
  const [copied, setCopied] = useState(false);

  const characterCount = content.length;
  const canExtract = content.trim().length >= 40;
  const unknownCount = useMemo(
    () =>
      result
        ? Object.values(result.route.chain).filter((value) => value === 'UNKNOWN').length
        : 0,
    [result],
  );

  function runExtraction() {
    if (!canExtract) return;
    setResult(extract(content, title, sourceType));
    setCopied(false);
  }

  function loadSample() {
    setContent(sample);
    setTitle('Autonomous vendor payment approval');
    setSourceType('Operational workflow');
    setResult(null);
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadResult() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = `${result.extractionId.replace(':', '-')}.json`;
    anchor.click();
    URL.revokeObjectURL(href);
  }

  return (
    <main className="paste-page">
      <section className="hero">
        <div className="eyebrow">TA-14 Exchange / Paste Anything</div>
        <div className="hero-grid">
          <div>
            <h1>Turn unstructured governance material into a reviewable route draft.</h1>
            <p>
              Paste a policy, procedure, architecture description, workflow, control narrative, or
              AI-generated governance proposal. TA-14 identifies candidate content across the full
              Reality → Outcome chain without pretending that extracted language is admissible evidence.
            </p>
          </div>
          <div className="principle">
            <span>Governing principle</span>
            <strong>No admissible evidence. No admissible execution.</strong>
          </div>
        </div>
      </section>

      <section className="notice">
        <strong>Extraction is not validation.</strong>
        <span>
          This tool maps words into candidate route stages. It does not verify source truth,
          provenance, authority, policy validity, or execution legitimacy.
        </span>
      </section>

      <section className="workspace-grid">
        <div className="input-panel panel">
          <div className="panel-heading">
            <div>
              <span className="step">INPUT</span>
              <h2>Paste source material</h2>
            </div>
            <button type="button" className="secondary" onClick={loadSample}>
              Load example
            </button>
          </div>

          <div className="field-grid">
            <label>
              <span>Source title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Optional title"
              />
            </label>
            <label>
              <span>Source type</span>
              <input
                value={sourceType}
                onChange={(event) => setSourceType(event.target.value)}
                placeholder="Policy, workflow, notes..."
              />
            </label>
          </div>

          <label className="text-field">
            <span>Material to inspect</span>
            <textarea
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setResult(null);
              }}
              placeholder="Paste a governance policy, process description, AI-generated framework, operating procedure, control narrative, or route concept..."
            />
          </label>

          <div className="input-footer">
            <span>{characterCount.toLocaleString()} characters</span>
            <button type="button" className="primary" disabled={!canExtract} onClick={runExtraction}>
              Extract candidate route
            </button>
          </div>
        </div>

        <aside className="guidance panel">
          <span className="step">WHAT TO PASTE</span>
          <h2>Any material that describes action and consequence.</h2>
          <ul>
            <li>AI governance frameworks and control narratives</li>
            <li>Standard operating procedures</li>
            <li>Payment, approval, or authorization workflows</li>
            <li>Healthcare or safety intervention protocols</li>
            <li>Technical architecture notes</li>
            <li>Regulatory or policy language</li>
          </ul>
          <div className="boundary">
            Missing concepts remain <strong>UNKNOWN</strong>. The extractor does not manufacture a
            complete route from unsupported text.
          </div>
        </aside>
      </section>

      {result ? (
        <>
          <section className="result-header panel">
            <div>
              <span className="step">EXTRACTION RESULT</span>
              <h2>{result.route.name}</h2>
              <p>
                {result.route.domain} · {result.source.digest} · {result.source.characterCount} characters
              </p>
            </div>
            <div className={`status ${result.status === 'HOLD' ? 'hold' : 'ready'}`}>
              <span>{result.status}</span>
              <strong>{unknownCount} unknown stages</strong>
            </div>
          </section>

          <section className="chain-grid">
            {stages.map((stage) => {
              const value = result.route.chain[stage.key];
              const unknown = value === 'UNKNOWN';
              return (
                <article className={`stage-card ${unknown ? 'unknown' : ''}`} key={stage.key}>
                  <div className="stage-top">
                    <span>{stage.number}</span>
                    <em>{unknown ? 'UNKNOWN' : 'CANDIDATE'}</em>
                  </div>
                  <h3>{stage.label}</h3>
                  <p className="question">{stage.question}</p>
                  <div className="stage-value">{value}</div>
                </article>
              );
            })}
          </section>

          <section className="findings panel">
            <div className="panel-heading">
              <div>
                <span className="step">REVIEW BOUNDARY</span>
                <h2>What this extraction means</h2>
              </div>
              <div className="actions">
                <button type="button" className="secondary" onClick={copyResult}>
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
                <button type="button" className="secondary" onClick={downloadResult}>
                  Download
                </button>
              </div>
            </div>

            <div className="finding-list">
              {result.findings.map((finding, index) => (
                <div className={`finding ${finding.severity.toLowerCase()}`} key={`${finding.stage}-${index}`}>
                  <span>{finding.severity}</span>
                  <p>{finding.message}</p>
                </div>
              ))}
            </div>

            <div className="next-actions">
              <Link className="primary link-button" href="/workspace/build">
                Open Route Builder
              </Link>
              <Link className="secondary link-button" href="/workspace/scanner">
                Open Readiness Scanner
              </Link>
            </div>
          </section>
        </>
      ) : (
        <section className="empty-result panel">
          <span>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</span>
          <h2>Your candidate route will appear here.</h2>
          <p>
            The extraction stays visibly provisional until a person reviews the mapped stages and
            supplies the evidence, authority, bindings, and verification requirements the source does
            not establish.
          </p>
        </section>
      )}

      <style jsx>{`
        .paste-page {
          max-width: 1480px;
          margin: 0 auto;
          padding: 52px 34px 90px;
          color: #f6f7fb;
        }
        .hero {
          padding: 34px 0 28px;
        }
        .eyebrow,
        .step {
          color: #8fa8ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.55fr);
          gap: 34px;
          align-items: end;
          margin-top: 18px;
        }
        h1 {
          max-width: 920px;
          margin: 0;
          font-size: clamp(42px, 6vw, 82px);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }
        .hero p {
          max-width: 820px;
          margin: 26px 0 0;
          color: #a9afc0;
          font-size: 18px;
          line-height: 1.7;
        }
        .principle {
          border-left: 1px solid rgba(143, 168, 255, 0.38);
          padding: 4px 0 4px 24px;
        }
        .principle span {
          display: block;
          color: #7d8497;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 10px;
        }
        .principle strong {
          font-size: 20px;
          line-height: 1.45;
        }
        .notice {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 17px 20px;
          margin: 24px 0;
          border: 1px solid rgba(255, 190, 86, 0.28);
          background: rgba(255, 190, 86, 0.055);
          border-radius: 14px;
          color: #d6c397;
        }
        .notice span {
          color: #a9a18f;
        }
        .workspace-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(300px, 0.58fr);
          gap: 18px;
        }
        .panel,
        .stage-card {
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: linear-gradient(180deg, rgba(17, 20, 30, 0.94), rgba(9, 11, 18, 0.94));
          border-radius: 20px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.28);
        }
        .input-panel,
        .guidance,
        .findings,
        .result-header,
        .empty-result {
          padding: 26px;
        }
        .panel-heading,
        .result-header,
        .input-footer,
        .stage-top,
        .next-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        h2 {
          margin: 7px 0 0;
          font-size: 26px;
          letter-spacing: -0.025em;
        }
        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin: 24px 0 14px;
        }
        label span {
          display: block;
          margin-bottom: 8px;
          color: #8e95a8;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        input,
        textarea {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.11);
          background: #080a10;
          color: #f7f8fc;
          border-radius: 12px;
          outline: none;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }
        input {
          padding: 13px 14px;
        }
        textarea {
          min-height: 430px;
          resize: vertical;
          padding: 18px;
          font: inherit;
          line-height: 1.65;
        }
        input:focus,
        textarea:focus {
          border-color: rgba(143, 168, 255, 0.68);
          box-shadow: 0 0 0 3px rgba(90, 116, 224, 0.12);
        }
        .input-footer {
          margin-top: 14px;
          color: #767d90;
          font-size: 13px;
        }
        button,
        .link-button {
          border-radius: 11px;
          padding: 11px 15px;
          font: inherit;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          text-decoration: none;
          transition: transform 150ms ease, opacity 150ms ease, border-color 150ms ease;
        }
        button:hover,
        .link-button:hover {
          transform: translateY(-1px);
        }
        button:disabled {
          cursor: not-allowed;
          opacity: 0.4;
          transform: none;
        }
        .primary {
          border: 1px solid #dfe5ff;
          background: #eef1ff;
          color: #090b12;
        }
        .secondary {
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.035);
          color: #dce0ec;
        }
        .guidance h2 {
          font-size: 24px;
          line-height: 1.25;
        }
        .guidance ul {
          margin: 24px 0;
          padding-left: 19px;
          color: #a6adbd;
          line-height: 1.75;
        }
        .boundary {
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.025);
          border-radius: 13px;
          color: #9ba2b3;
          line-height: 1.6;
        }
        .boundary strong {
          color: #ffcb70;
        }
        .result-header {
          margin-top: 18px;
        }
        .result-header p {
          margin: 8px 0 0;
          color: #777f92;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
        }
        .status {
          min-width: 168px;
          padding: 14px 16px;
          border-radius: 13px;
          text-align: right;
        }
        .status span,
        .status strong {
          display: block;
        }
        .status span {
          font-size: 12px;
          font-weight: 850;
          letter-spacing: 0.1em;
        }
        .status strong {
          margin-top: 5px;
          font-size: 13px;
        }
        .status.hold {
          border: 1px solid rgba(255, 190, 86, 0.3);
          background: rgba(255, 190, 86, 0.07);
          color: #ffd58c;
        }
        .status.ready {
          border: 1px solid rgba(112, 232, 175, 0.28);
          background: rgba(112, 232, 175, 0.065);
          color: #8ceabb;
        }
        .chain-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
          margin: 18px 0;
        }
        .stage-card {
          min-height: 285px;
          padding: 20px;
        }
        .stage-card.unknown {
          border-color: rgba(255, 190, 86, 0.27);
        }
        .stage-top span {
          color: #697085;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
        }
        .stage-top em {
          color: #82d8af;
          font-size: 10px;
          font-style: normal;
          font-weight: 800;
          letter-spacing: 0.11em;
        }
        .stage-card.unknown .stage-top em {
          color: #ffcb70;
        }
        .stage-card h3 {
          margin: 26px 0 6px;
          font-size: 22px;
        }
        .question {
          min-height: 38px;
          margin: 0 0 18px;
          color: #6f7789;
          font-size: 12px;
          line-height: 1.5;
        }
        .stage-value {
          color: #bbc1ce;
          font-size: 13px;
          line-height: 1.62;
        }
        .stage-card.unknown .stage-value {
          color: #d7b674;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }
        .actions {
          display: flex;
          gap: 9px;
        }
        .finding-list {
          display: grid;
          gap: 9px;
          margin: 24px 0;
        }
        .finding {
          display: grid;
          grid-template-columns: 68px 1fr;
          gap: 13px;
          align-items: start;
          padding: 13px 14px;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.025);
        }
        .finding span {
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.11em;
        }
        .finding p {
          margin: 0;
          color: #a8afbf;
          font-size: 13px;
          line-height: 1.5;
        }
        .finding.info span {
          color: #8fa8ff;
        }
        .finding.hold span {
          color: #ffcb70;
        }
        .next-actions {
          justify-content: flex-start;
        }
        .empty-result {
          margin-top: 18px;
          text-align: center;
          padding: 62px 26px;
        }
        .empty-result > span {
          color: #687087;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
        }
        .empty-result h2 {
          margin-top: 19px;
          font-size: 30px;
        }
        .empty-result p {
          max-width: 700px;
          margin: 14px auto 0;
          color: #858da0;
          line-height: 1.7;
        }
        @media (max-width: 1120px) {
          .hero-grid,
          .workspace-grid {
            grid-template-columns: 1fr;
          }
          .chain-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 680px) {
          .paste-page {
            padding: 30px 17px 70px;
          }
          h1 {
            font-size: 45px;
          }
          .field-grid,
          .chain-grid {
            grid-template-columns: 1fr;
          }
          .notice,
          .panel-heading,
          .result-header,
          .input-footer,
          .next-actions {
            align-items: stretch;
            flex-direction: column;
          }
          .status {
            text-align: left;
          }
          textarea {
            min-height: 340px;
          }
        }
      `}</style>
    </main>
  );
}
