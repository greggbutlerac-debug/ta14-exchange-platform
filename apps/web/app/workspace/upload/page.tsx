'use client';

import Link from 'next/link';
import { ChangeEvent, DragEvent, useMemo, useRef, useState } from 'react';

type StageKey =
  | 'reality'
  | 'record'
  | 'continuity'
  | 'admissibility'
  | 'binding'
  | 'commit'
  | 'execution'
  | 'outcome';

type ImportState = 'EMPTY' | 'LOADED' | 'NORMALIZED' | 'ERROR';

type RouteDraft = {
  schema: 'TA14_ROUTE_DRAFT_V1';
  routeId: string;
  status: 'DRAFT' | 'HOLD' | 'READY_FOR_TEST';
  metadata: {
    name: string;
    domain: string;
    owner: string;
    version: number;
    importedAt: string;
    sourceFormat: string;
  };
  chain: Record<StageKey, string>;
  importRecord: {
    originalFileName: string;
    originalSchema: string;
    preservedUnknowns: number;
    normalizedFields: number;
    sourceDigest: string;
  };
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

const workflow = ['Source', 'Normalize', 'Preserve UNKNOWN', 'Builder', 'Scanner'];

const sample = JSON.stringify(
  {
    name: 'Autonomous customer refund',
    domain: 'AI Governance',
    owner: 'Customer Operations',
    reality: 'A verified customer dispute exists for a completed transaction.',
    record:
      'Customer request, transaction record, policy version, model recommendation, and human approval evidence.',
    continuity:
      'Preserve source identifiers, digests, timestamps, transformations, dependencies, and superseded versions.',
    admissibility:
      'The dispute must be eligible, evidence must be complete, the policy must be current, and the refund must remain within the approval threshold.',
    binding:
      'Bind the customer, account, transaction, approving authority, refund amount, destination, model version, and execution environment.',
    commit:
      'Freeze the canonical refund payload, evidence set, decision receipt, bindings, route digest, version, and expiry time.',
    execution:
      'Issue only the committed refund amount to the bound destination through the approved payment service.',
    outcome:
      'Verify processor settlement, customer account credit, amount, destination, timestamp, and reconciliation result.',
  },
  null,
  2,
);

function text(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

function first(source: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = text(source[key]);
    if (value) return value;
  }
  return 'UNKNOWN';
}

function stableDigest(input: string): string {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function normalize(raw: unknown, fileName: string): RouteDraft {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('The uploaded content must contain a JSON object.');
  }

  const source = raw as Record<string, unknown>;
  const chainSource =
    source.chain && typeof source.chain === 'object' && !Array.isArray(source.chain)
      ? (source.chain as Record<string, unknown>)
      : source;
  const metadata =
    source.metadata && typeof source.metadata === 'object' && !Array.isArray(source.metadata)
      ? (source.metadata as Record<string, unknown>)
      : source;

  const chain = {
    reality: first(chainSource, ['reality', 'sourceReality', 'condition', 'trigger']),
    record: first(chainSource, ['record', 'evidence', 'records', 'artifacts']),
    continuity: first(chainSource, ['continuity', 'provenance', 'custody', 'lineage']),
    admissibility: first(chainSource, ['admissibility', 'policy', 'rules', 'criteria']),
    binding: first(chainSource, ['binding', 'bindings', 'authority', 'identity']),
    commit: first(chainSource, ['commit', 'commitment', 'freeze', 'canonicalPayload']),
    execution: first(chainSource, ['execution', 'action', 'operation', 'effect']),
    outcome: first(chainSource, ['outcome', 'result', 'verification', 'receipt']),
  } satisfies Record<StageKey, string>;

  const preservedUnknowns = Object.values(chain).filter((value) => value === 'UNKNOWN').length;
  const normalizedFields = Object.values(chain).filter((value) => value !== 'UNKNOWN').length;
  const routeId = first(source, ['routeId', 'route_id', 'id']);
  const originalSchema = first(source, ['schema', 'type', 'format']);
  const serialized = JSON.stringify(raw);

  return {
    schema: 'TA14_ROUTE_DRAFT_V1',
    routeId: routeId === 'UNKNOWN' ? `import:${stableDigest(serialized).split(':')[1]}` : routeId,
    status: preservedUnknowns === 0 ? 'READY_FOR_TEST' : 'HOLD',
    metadata: {
      name: first(metadata, ['name', 'title', 'routeName']),
      domain: first(metadata, ['domain', 'industry', 'category']),
      owner: first(metadata, ['owner', 'routeOwner', 'accountableParty']),
      version: Number(metadata.version) > 0 ? Number(metadata.version) : 1,
      importedAt: new Date().toISOString(),
      sourceFormat: fileName.toLowerCase().endsWith('.json') ? 'JSON_FILE' : 'PASTED_JSON',
    },
    chain,
    importRecord: {
      originalFileName: fileName || 'pasted-route.json',
      originalSchema,
      preservedUnknowns,
      normalizedFields,
      sourceDigest: stableDigest(serialized),
    },
  };
}

export default function UploadRoutePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState('');
  const [fileName, setFileName] = useState('');
  const [state, setState] = useState<ImportState>('EMPTY');
  const [error, setError] = useState('');
  const [route, setRoute] = useState<RouteDraft | null>(null);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedStage, setExpandedStage] = useState<StageKey | null>(null);

  const parsedPreview = useMemo(() => {
    if (!source.trim()) return null;
    try {
      return JSON.parse(source) as unknown;
    } catch {
      return null;
    }
  }, [source]);

  const sourceStatus = useMemo(() => {
    if (state === 'ERROR') return 'Source rejected';
    if (route) return 'Normalized';
    if (source.trim() && parsedPreview) return 'Valid JSON loaded';
    if (source.trim()) return 'JSON requires correction';
    return 'Waiting for source';
  }, [parsedPreview, route, source, state]);

  function loadContent(content: string, name: string) {
    setSource(content);
    setFileName(name);
    setRoute(null);
    setExpandedStage(null);
    setError('');
    setState(content.trim() ? 'LOADED' : 'EMPTY');
  }

  async function receiveFile(file?: File) {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      setError('Upload a JSON route file. Other formats are not silently converted.');
      setState('ERROR');
      return;
    }

    if (file.size > 1_000_000) {
      setError('The route file exceeds the 1 MB import limit.');
      setState('ERROR');
      return;
    }

    loadContent(await file.text(), file.name);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    void receiveFile(event.target.files?.[0]);
    event.target.value = '';
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void receiveFile(event.dataTransfer.files?.[0]);
  }

  function importRoute() {
    try {
      const parsed = JSON.parse(source) as unknown;
      const normalized = normalize(parsed, fileName);
      setRoute(normalized);
      setError('');
      setState('NORMALIZED');
    } catch (caught) {
      setRoute(null);
      setError(caught instanceof Error ? caught.message : 'The route could not be imported.');
      setState('ERROR');
    }
  }

  function clearImport() {
    setSource('');
    setFileName('');
    setRoute(null);
    setError('');
    setExpandedStage(null);
    setState('EMPTY');
  }

  function download() {
    if (!route) return;
    const blob = new Blob([JSON.stringify(route, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = `${route.routeId.replace(/[^a-z0-9-_]/gi, '-')}.json`;
    anchor.click();
    URL.revokeObjectURL(href);
  }

  async function copyRoute() {
    if (!route) return;
    await navigator.clipboard.writeText(JSON.stringify(route, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  const mapped = route?.importRecord.normalizedFields ?? 0;
  const unknowns = route?.importRecord.preservedUnknowns ?? 8;

  return (
    <main className="uploadPage">
      <div className="shell">
        <header className="hero">
          <div className="heroGlow" />
          <div className="heroTop">
            <div>
              <div className="eyebrowRow">
                <span className="eyebrowPill">Exchange Workspace</span>
                <span className="eyebrowText">Governed route intake</span>
              </div>
              <h1>Import without concealing what the source cannot prove.</h1>
              <p className="heroCopy">
                Preserve the submitted record, normalize recognized fields, expose every unresolved stage, and move the route forward without manufacturing completeness.
              </p>
            </div>

            <div className="heroActions">
              <Link href="/workspace" className="button secondary">
                Back to Workspace
              </Link>
              <button type="button" onClick={clearImport} className="button secondary">
                Clear intake
              </button>
            </div>
          </div>

          <div className="workflow">
            {workflow.map((step, index) => {
              const active =
                index === 0 ||
                (index === 1 && Boolean(source.trim())) ||
                (index >= 2 && Boolean(route));

              return (
                <div className="workflowItem" key={step}>
                  <div className={`workflowStep ${active ? 'active' : ''}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{step}</strong>
                  </div>
                  {index < workflow.length - 1 && <span className="workflowArrow">→</span>}
                </div>
              );
            })}
          </div>
        </header>

        <section className="workspaceGrid">
          <section className="panel">
            <div className="panelHeader">
              <div>
                <p className="sectionLabel">Import console</p>
                <h2>Provide the source route</h2>
                <p>Upload a JSON file or paste the original source. The submitted content remains separate from the normalized draft.</p>
              </div>
              <span className={`statusBadge ${state.toLowerCase()}`}>{sourceStatus}</span>
            </div>

            <div
              className={`dropZone ${dragging ? 'dragging' : ''}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <input
                ref={inputRef}
                type="file"
                accept="application/json,.json"
                onChange={onFileChange}
                className="fileInput"
              />
              <div className="uploadIcon">⇧</div>
              <h3>Drop a route file here</h3>
              <p>JSON only · Maximum 1 MB · Original source preserved</p>
              <button type="button" onClick={() => inputRef.current?.click()} className="button primary white">
                Choose JSON file
              </button>
            </div>

            <div className="separator">
              <span />
              <strong>or paste source</strong>
              <span />
            </div>

            <div className="editorCard">
              <div className="editorHeader">
                <div>
                  <h3>Source editor</h3>
                  <p>{fileName ? `Loaded file: ${fileName}` : 'No file selected · pasted input will be identified separately'}</p>
                </div>
                <button type="button" onClick={() => loadContent(sample, 'sample-route.json')} className="button small secondary">
                  Load sample
                </button>
              </div>

              <textarea
                value={source}
                onChange={(event) => loadContent(event.target.value, '')}
                spellCheck={false}
                placeholder={'{\n  "name": "My route",\n  "reality": "..."\n}'}
              />

              {error && (
                <div className="errorBox">
                  <strong>Import blocked</strong>
                  <p>{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={importRoute}
                disabled={!parsedPreview}
                className="button primary normalizeButton"
              >
                Normalize into TA-14 route
              </button>
            </div>
          </section>

          <section className="panel resultPanel">
            <div className="panelHeader">
              <div>
                <p className="sectionLabel">Normalization record</p>
                <h2>{route ? route.metadata.name : 'Awaiting route source'}</h2>
                <p className="routeId">{route?.routeId ?? 'A normalized route identity will appear here.'}</p>
              </div>
              <span className={`statusBadge ${route?.status === 'READY_FOR_TEST' ? 'normalized' : route ? 'hold' : 'empty'}`}>
                {route?.status ?? 'WAITING'}
              </span>
            </div>

            <div className="metricGrid">
              <Metric label="Mapped" value={`${mapped}/8`} detail="recognized stages" />
              <Metric label="UNKNOWN" value={String(unknowns)} detail="preserved gaps" />
              <Metric
                label="Readiness"
                value={route?.status === 'READY_FOR_TEST' ? 'TEST' : route ? 'HOLD' : '—'}
                detail={route ? 'construction state' : 'waiting'}
              />
            </div>

            {!route ? (
              <div className="inspectionCard">
                <div className="inspectionHeader">
                  <div>
                    <h3>Reality → Outcome inspection</h3>
                    <p>Normalization has not started.</p>
                  </div>
                  <span>0 of 8 mapped</span>
                </div>

                <div className="stageList">
                  {stages.map((stage) => (
                    <div className="stageRow waiting" key={stage.key}>
                      <span className="stageNumber">{stage.number}</span>
                      <strong>{stage.label}</strong>
                      <span className="stageState">Waiting</span>
                    </div>
                  ))}
                </div>

                <div className="principleBox">
                  <p className="sectionLabel">Governing principle</p>
                  <h3>No admissible evidence. No admissible execution.</h3>
                  <p>Import does not convert missing fields into proof. Unresolved stages remain visible until corrected through a governed version.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="inspectionCard">
                  <div className="inspectionHeader">
                    <div>
                      <h3>Reality → Outcome inspection</h3>
                      <p>Select a stage to inspect the normalized value.</p>
                    </div>
                    <span>{mapped} of 8 mapped</span>
                  </div>

                  <div className="stageList">
                    {stages.map((stage) => {
                      const value = route.chain[stage.key];
                      const unresolved = value === 'UNKNOWN';
                      const expanded = expandedStage === stage.key;

                      return (
                        <button
                          type="button"
                          className={`stageRow ${unresolved ? 'unresolved' : 'mapped'} ${expanded ? 'expanded' : ''}`}
                          key={stage.key}
                          onClick={() => setExpandedStage(expanded ? null : stage.key)}
                        >
                          <span className="stageNumber">{stage.number}</span>
                          <strong>{stage.label}</strong>
                          <span className="stageState">{unresolved ? 'UNKNOWN' : 'Mapped'}</span>
                          <span className="expandMark">{expanded ? '−' : '+'}</span>
                          {expanded && <p className="stageValue">{value}</p>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="recordCard">
                  <div className="recordHeader">
                    <div>
                      <h3>Preserved import record</h3>
                      <p>Source identity remains attached to the normalized route.</p>
                    </div>
                    <code>{route.importRecord.sourceDigest}</code>
                  </div>

                  <dl className="infoGrid">
                    <Info label="Original file" value={route.importRecord.originalFileName} />
                    <Info label="Original schema" value={route.importRecord.originalSchema} />
                    <Info label="Domain" value={route.metadata.domain} />
                    <Info label="Owner" value={route.metadata.owner} />
                    <Info label="Source format" value={route.metadata.sourceFormat} />
                    <Info label="Version" value={String(route.metadata.version)} />
                  </dl>
                </div>

                <div className="actionGrid">
                  <button type="button" onClick={copyRoute} className="button secondary">
                    {copied ? 'Copied' : 'Copy normalized JSON'}
                  </button>
                  <button type="button" onClick={download} className="button primary white">
                    Download route
                  </button>
                  <Link href="/workspace/build" className="button secondary">
                    Correct in Builder
                  </Link>
                  <Link href="/workspace/scanner" className="button primary">
                    Open Scanner
                  </Link>
                </div>
              </>
            )}
          </section>
        </section>

        <section className="sequencePanel">
          <div className="sequenceHeader">
            <div>
              <p className="sectionLabel">Governed import sequence</p>
              <h2>The source moves forward without being rewritten into certainty.</h2>
            </div>
            <p>Every imported route remains reviewable because identity, missing stages, and correction history stay visible.</p>
          </div>

          <div className="principleGrid">
            <Principle
              number="01"
              title="Preserve source identity"
              text="Retain the original filename, source format, schema declaration, and digest before normalization."
            />
            <Principle
              number="02"
              title="Expose unresolved stages"
              text="Map only recognized content. Missing evidence, authority, continuity, or correspondence remains UNKNOWN."
            />
            <Principle
              number="03"
              title="Correct through governed versions"
              text="Move the normalized draft into the Builder and Scanner before any route can approach executable commitment."
            />
          </div>
        </section>
      </div>

      <style jsx>{`
        .uploadPage {
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
          background:
            radial-gradient(circle at 20% 0%, rgba(31, 190, 216, 0.08), transparent 30%),
            radial-gradient(circle at 95% 25%, rgba(25, 224, 174, 0.05), transparent 32%),
            #061016;
          color: #f4f7fb;
          padding: 24px;
        }

        .shell {
          width: 100%;
          max-width: 1480px;
          margin: 0 auto;
        }

        .hero,
        .panel,
        .sequencePanel {
          position: relative;
          border: 1px solid rgba(151, 188, 213, 0.15);
          background: linear-gradient(145deg, rgba(15, 35, 46, 0.96), rgba(7, 18, 25, 0.98));
          box-shadow: 0 26px 80px rgba(0, 0, 0, 0.28);
        }

        .hero {
          overflow: hidden;
          border-radius: 28px;
          padding: 34px;
        }

        .heroGlow {
          position: absolute;
          inset: -120px auto auto -120px;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: rgba(27, 195, 226, 0.11);
          filter: blur(80px);
          pointer-events: none;
        }

        .heroTop {
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
        }

        .eyebrowRow,
        .heroActions,
        .editorHeader,
        .recordHeader {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .eyebrowPill,
        .workflowStep,
        .statusBadge {
          border: 1px solid rgba(79, 223, 237, 0.24);
          background: rgba(67, 219, 231, 0.08);
          color: #8feef4;
          border-radius: 999px;
        }

        .eyebrowPill {
          padding: 7px 11px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .eyebrowText {
          color: #738b9b;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h1 {
          max-width: 980px;
          margin: 20px 0 0;
          font-size: clamp(38px, 4.2vw, 66px);
          line-height: 1.02;
          letter-spacing: -0.045em;
        }

        .heroCopy {
          max-width: 820px;
          margin: 20px 0 0;
          color: #9db0bd;
          font-size: 17px;
          line-height: 1.7;
        }

        .button {
          appearance: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          border-radius: 999px;
          border: 1px solid transparent;
          padding: 0 20px;
          font: inherit;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
          transition: 160ms ease;
        }

        .button:hover {
          transform: translateY(-1px);
        }

        .button.primary {
          border-color: #4edeea;
          background: linear-gradient(135deg, #63e6f1, #42e7bb);
          color: #031015;
        }

        .button.white {
          border-color: #eef5f7;
          background: #eef5f7;
          color: #071017;
        }

        .button.secondary {
          border-color: rgba(152, 184, 203, 0.2);
          background: rgba(5, 14, 20, 0.5);
          color: #dce7ed;
        }

        .button.small {
          min-height: 36px;
          padding: 0 14px;
          font-size: 12px;
        }

        .workflow {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          overflow-x: auto;
          margin-top: 30px;
          padding: 14px;
          border: 1px solid rgba(151, 188, 213, 0.12);
          border-radius: 18px;
          background: rgba(2, 10, 15, 0.48);
        }

        .workflowItem {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1 0 auto;
        }

        .workflowStep {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 13px;
          border-color: rgba(151, 188, 213, 0.11);
          background: rgba(255, 255, 255, 0.02);
          color: #607786;
          white-space: nowrap;
        }

        .workflowStep.active {
          border-color: rgba(79, 223, 237, 0.26);
          background: rgba(67, 219, 231, 0.08);
          color: #c7fbff;
        }

        .workflowStep span {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px;
        }

        .workflowStep strong {
          font-size: 12px;
        }

        .workflowArrow {
          color: rgba(151, 188, 213, 0.25);
        }

        .workspaceGrid {
          display: grid;
          grid-template-columns: minmax(0, 0.96fr) minmax(0, 1.04fr);
          gap: 22px;
          margin-top: 22px;
        }

        .panel,
        .sequencePanel {
          border-radius: 26px;
          padding: 26px;
        }

        .panelHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 22px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(151, 188, 213, 0.12);
        }

        .sectionLabel {
          margin: 0;
          color: #66e2ed;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        h2 {
          margin: 8px 0 0;
          font-size: 26px;
          line-height: 1.15;
          letter-spacing: -0.025em;
        }

        .panelHeader p:not(.sectionLabel),
        .editorHeader p,
        .inspectionHeader p,
        .recordHeader p {
          margin: 8px 0 0;
          color: #8197a5;
          font-size: 13px;
          line-height: 1.6;
        }

        .statusBadge {
          flex: 0 0 auto;
          padding: 9px 12px;
          font-size: 11px;
          font-weight: 800;
        }

        .statusBadge.error,
        .statusBadge.empty {
          border-color: rgba(151, 188, 213, 0.13);
          background: rgba(255, 255, 255, 0.03);
          color: #728795;
        }

        .statusBadge.hold {
          border-color: rgba(255, 196, 80, 0.24);
          background: rgba(255, 196, 80, 0.08);
          color: #ffd993;
        }

        .statusBadge.normalized {
          border-color: rgba(57, 222, 162, 0.24);
          background: rgba(57, 222, 162, 0.08);
          color: #8cf2c7;
        }

        .dropZone {
          margin-top: 22px;
          padding: 34px 24px;
          text-align: center;
          border: 1px dashed rgba(151, 188, 213, 0.22);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.012));
          transition: 160ms ease;
        }

        .dropZone.dragging {
          border-color: #61e5ee;
          background: rgba(72, 221, 232, 0.08);
        }

        .fileInput {
          display: none;
        }

        .uploadIcon {
          display: grid;
          place-items: center;
          width: 62px;
          height: 62px;
          margin: 0 auto;
          border: 1px solid rgba(151, 188, 213, 0.15);
          border-radius: 18px;
          background: rgba(2, 10, 15, 0.62);
          color: #73e8ef;
          font-size: 26px;
        }

        .dropZone h3,
        .editorCard h3,
        .inspectionCard h3,
        .recordCard h3,
        .principleCard h3 {
          margin: 17px 0 0;
          font-size: 19px;
        }

        .dropZone p {
          margin: 8px 0 20px;
          color: #738995;
          font-size: 13px;
        }

        .separator {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 22px 0;
        }

        .separator span {
          height: 1px;
          flex: 1;
          background: rgba(151, 188, 213, 0.12);
        }

        .separator strong {
          color: #566e7c;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .editorCard,
        .inspectionCard,
        .recordCard {
          border: 1px solid rgba(151, 188, 213, 0.12);
          border-radius: 22px;
          background: rgba(2, 10, 15, 0.45);
        }

        .editorCard {
          padding: 20px;
        }

        .editorHeader {
          justify-content: space-between;
        }

        .editorHeader h3,
        .inspectionHeader h3,
        .recordHeader h3 {
          margin: 0;
        }

        textarea {
          width: 100%;
          min-height: 360px;
          margin-top: 16px;
          resize: vertical;
          border: 1px solid rgba(151, 188, 213, 0.13);
          border-radius: 17px;
          outline: none;
          background: #040b10;
          color: #d9e5eb;
          padding: 16px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
          line-height: 1.65;
          box-sizing: border-box;
        }

        textarea:focus {
          border-color: rgba(88, 226, 237, 0.5);
          box-shadow: 0 0 0 3px rgba(88, 226, 237, 0.06);
        }

        .normalizeButton {
          width: 100%;
          margin-top: 16px;
        }

        .normalizeButton:disabled {
          cursor: not-allowed;
          opacity: 0.3;
          transform: none;
        }

        .errorBox {
          margin-top: 14px;
          padding: 14px;
          border: 1px solid rgba(255, 106, 124, 0.25);
          border-radius: 15px;
          background: rgba(255, 92, 112, 0.08);
        }

        .errorBox strong {
          color: #ffb7c0;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .errorBox p {
          margin: 7px 0 0;
          color: #ffd4d9;
          font-size: 13px;
        }

        .routeId {
          word-break: break-all;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        .metricGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 22px;
        }

        .metric {
          border: 1px solid rgba(151, 188, 213, 0.11);
          border-radius: 17px;
          background: rgba(2, 10, 15, 0.42);
          padding: 16px;
        }

        .metricLabel {
          margin: 0;
          color: #617986;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .metricValue {
          margin: 10px 0 0;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .metricDetail {
          margin: 3px 0 0;
          color: #607682;
          font-size: 11px;
        }

        .inspectionCard,
        .recordCard {
          margin-top: 20px;
          overflow: hidden;
        }

        .inspectionHeader,
        .recordHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          padding: 18px;
          border-bottom: 1px solid rgba(151, 188, 213, 0.11);
        }

        .inspectionHeader > span {
          border: 1px solid rgba(151, 188, 213, 0.12);
          border-radius: 999px;
          padding: 7px 10px;
          color: #7b909c;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .stageList {
          padding: 10px;
        }

        .stageRow {
          position: relative;
          display: grid;
          grid-template-columns: 34px 1fr auto auto;
          align-items: center;
          gap: 10px;
          width: 100%;
          min-height: 48px;
          margin: 0 0 7px;
          border: 1px solid rgba(151, 188, 213, 0.09);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
          color: #d6e1e7;
          padding: 10px 12px;
          text-align: left;
          box-sizing: border-box;
        }

        button.stageRow {
          cursor: pointer;
          font: inherit;
        }

        .stageRow:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .stageNumber {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          color: #546d7b;
          font-size: 10px;
        }

        .stageRow strong {
          font-size: 13px;
        }

        .stageState {
          color: #607783;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .mapped .stageState {
          color: #6be7b6;
        }

        .unresolved .stageState {
          color: #ffd177;
        }

        .expandMark {
          color: #526a77;
        }

        .stageValue {
          grid-column: 2 / -1;
          margin: 4px 0 0;
          padding-top: 10px;
          border-top: 1px solid rgba(151, 188, 213, 0.09);
          color: #94a8b4;
          font-size: 12px;
          line-height: 1.6;
        }

        .principleBox {
          margin: 10px;
          padding: 18px;
          border: 1px solid rgba(79, 223, 237, 0.12);
          border-radius: 17px;
          background: rgba(66, 219, 231, 0.045);
        }

        .principleBox h3 {
          margin: 10px 0 0;
          font-size: 20px;
        }

        .principleBox > p:last-child {
          margin: 10px 0 0;
          color: #8297a3;
          font-size: 13px;
          line-height: 1.65;
        }

        .recordHeader code {
          max-width: 48%;
          overflow-wrap: anywhere;
          border: 1px solid rgba(151, 188, 213, 0.11);
          border-radius: 999px;
          padding: 8px 10px;
          color: #728895;
          font-size: 9px;
        }

        .infoGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin: 0;
          padding: 16px;
        }

        .infoItem {
          border: 1px solid rgba(151, 188, 213, 0.08);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.016);
          padding: 11px;
        }

        .infoItem dt {
          color: #566e7b;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .infoItem dd {
          margin: 7px 0 0;
          overflow-wrap: anywhere;
          color: #b5c4cc;
          font-size: 12px;
        }

        .actionGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .sequencePanel {
          margin-top: 22px;
        }

        .sequenceHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 26px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(151, 188, 213, 0.11);
        }

        .sequenceHeader > p {
          max-width: 560px;
          margin: 0;
          color: #7f949f;
          font-size: 13px;
          line-height: 1.65;
        }

        .principleGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 20px;
        }

        .principleCard {
          border: 1px solid rgba(151, 188, 213, 0.1);
          border-radius: 19px;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.028), rgba(255, 255, 255, 0.01));
          padding: 18px;
        }

        .principleTitle {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .principleNumber {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border: 1px solid rgba(79, 223, 237, 0.2);
          border-radius: 50%;
          background: rgba(67, 219, 231, 0.07);
          color: #79e8ef;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px;
        }

        .principleCard h3 {
          margin: 0;
          font-size: 16px;
        }

        .principleCard > p {
          margin: 14px 0 0;
          color: #758b97;
          font-size: 12px;
          line-height: 1.65;
        }

        @media (max-width: 1100px) {
          .workspaceGrid {
            grid-template-columns: 1fr;
          }

          .heroTop,
          .sequenceHeader {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 720px) {
          .uploadPage {
            padding: 14px;
          }

          .hero,
          .panel,
          .sequencePanel {
            border-radius: 20px;
            padding: 20px;
          }

          .heroTop,
          .panelHeader,
          .editorHeader,
          .recordHeader {
            flex-direction: column;
            align-items: flex-start;
          }

          .heroActions {
            width: 100%;
            flex-wrap: wrap;
          }

          .heroActions .button {
            flex: 1;
          }

          .metricGrid,
          .principleGrid,
          .infoGrid,
          .actionGrid {
            grid-template-columns: 1fr;
          }

          .recordHeader code {
            max-width: 100%;
          }

          .stageRow {
            grid-template-columns: 30px 1fr auto;
          }

          .expandMark {
            display: none;
          }

          .stageValue {
            grid-column: 2 / -1;
          }
        }
      `}</style>
    </main>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="metric">
      <p className="metricLabel">{label}</p>
      <p className="metricValue">{value}</p>
      <p className="metricDetail">{detail}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="infoItem">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Principle({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="principleCard">
      <div className="principleTitle">
        <span className="principleNumber">{number}</span>
        <h3>{title}</h3>
      </div>
      <p>{text}</p>
    </div>
  );
}
