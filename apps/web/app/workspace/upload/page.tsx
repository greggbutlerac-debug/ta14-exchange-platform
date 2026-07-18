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
  const readiness = route?.status ?? 'WAITING';

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05070a] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1500px]">
        <header className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.018))] p-6 shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Exchange Workspace
                </span>
                <span className="text-xs uppercase tracking-[0.22em] text-white/35">Governed route intake</span>
              </div>
              <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Import without concealing what the source cannot prove.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-white/58 sm:text-lg">
                Preserve the submitted record, normalize recognized fields, expose every unresolved stage, and move the route forward without manufacturing completeness.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/workspace"
                className="rounded-full border border-white/15 bg-black/20 px-5 py-3 text-sm font-semibold text-white/75 transition hover:border-white/35 hover:text-white"
              >
                Back to Workspace
              </Link>
              <button
                type="button"
                onClick={clearImport}
                className="rounded-full border border-white/15 bg-black/20 px-5 py-3 text-sm font-semibold text-white/75 transition hover:border-white/35 hover:text-white"
              >
                Clear intake
              </button>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/25">
            <div className="flex min-w-max items-center gap-2 px-4 py-4 sm:min-w-0 sm:justify-between">
              {workflow.map((step, index) => {
                const active =
                  index === 0 ||
                  (index === 1 && Boolean(source.trim())) ||
                  (index === 2 && Boolean(route)) ||
                  (index > 2 && Boolean(route));
                return (
                  <div key={step} className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                        active
                          ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100'
                          : 'border-white/10 bg-white/[0.03] text-white/35'
                      }`}
                    >
                      <span className="font-mono text-[10px]">{String(index + 1).padStart(2, '0')}</span>
                      <span>{step}</span>
                    </div>
                    {index < workflow.length - 1 && <span className="text-white/20">→</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Import console</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Provide the source route</h2>
                <p className="mt-2 text-sm leading-6 text-white/48">
                  Upload a JSON file or paste the original source. The submitted content remains separate from the normalized draft.
                </p>
              </div>
              <span
                className={`w-fit rounded-full border px-3 py-2 text-xs font-semibold ${
                  state === 'ERROR'
                    ? 'border-red-300/25 bg-red-300/10 text-red-100'
                    : route
                      ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100'
                      : source.trim()
                        ? 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'
                        : 'border-white/10 bg-white/[0.04] text-white/45'
                }`}
              >
                {sourceStatus}
              </span>
            </div>

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`mt-6 rounded-[1.75rem] border border-dashed p-7 text-center transition sm:p-9 ${
                dragging
                  ? 'border-cyan-300 bg-cyan-300/10'
                  : 'border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))]'
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={onFileChange}
              />
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-black/30 text-2xl text-cyan-200">
                ⇧
              </div>
              <h3 className="mt-5 text-xl font-semibold">Drop a route file here</h3>
              <p className="mt-2 text-sm text-white/45">JSON only · Maximum 1 MB · Original source preserved</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-200"
              >
                Choose JSON file
              </button>
            </div>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/30">or paste source</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Source editor</p>
                  <p className="mt-1 truncate text-xs text-white/40">
                    {fileName ? `Loaded file: ${fileName}` : 'No file selected · pasted input will be identified separately'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => loadContent(sample, 'sample-route.json')}
                  className="w-fit rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-white/35 hover:text-white"
                >
                  Load sample
                </button>
              </div>

              <textarea
                value={source}
                onChange={(event) => loadContent(event.target.value, '')}
                spellCheck={false}
                placeholder={'{\n  "name": "My route",\n  "reality": "..."\n}'}
                className="mt-4 min-h-[360px] w-full resize-y rounded-2xl border border-white/10 bg-[#070a0e] p-4 font-mono text-xs leading-6 text-white/76 outline-none transition placeholder:text-white/20 focus:border-cyan-300/45"
              />

              {error && (
                <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-400/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-200">Import blocked</p>
                  <p className="mt-2 text-sm leading-6 text-red-100/85">{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={importRoute}
                disabled={!parsedPreview}
                className="mt-5 w-full rounded-full bg-cyan-300 px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Normalize into TA-14 route
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Normalization record</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  {route ? route.metadata.name : 'Awaiting route source'}
                </h2>
                <p className="mt-2 break-all font-mono text-xs text-white/38">
                  {route?.routeId ?? 'A normalized route identity will appear here.'}
                </p>
              </div>
              <span
                className={`w-fit rounded-full border px-4 py-2 text-xs font-semibold ${
                  route?.status === 'READY_FOR_TEST'
                    ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100'
                    : route?.status === 'HOLD'
                      ? 'border-amber-300/25 bg-amber-300/10 text-amber-100'
                      : 'border-white/10 bg-white/[0.04] text-white/40'
                }`}
              >
                {readiness}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Metric label="Mapped" value={`${mapped}/8`} detail="recognized stages" />
              <Metric label="UNKNOWN" value={String(unknowns)} detail="preserved gaps" />
              <Metric
                label="Readiness"
                value={route?.status === 'READY_FOR_TEST' ? 'TEST' : route ? 'HOLD' : '—'}
                detail={route ? 'construction state' : 'waiting'}
              />
            </div>

            {!route ? (
              <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-black/20 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm font-semibold">Reality → Outcome inspection</p>
                    <p className="mt-1 text-xs text-white/40">Normalization has not started.</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    0 of 8 mapped
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {stages.map((stage) => (
                    <div
                      key={stage.key}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3"
                    >
                      <span className="font-mono text-[10px] text-white/25">{stage.number}</span>
                      <span className="text-sm text-white/50">{stage.label}</span>
                      <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
                        Waiting
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.045] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Governing principle</p>
                  <p className="mt-3 text-xl font-semibold tracking-tight">No admissible evidence. No admissible execution.</p>
                  <p className="mt-3 text-sm leading-6 text-white/45">
                    Import does not convert missing fields into proof. Unresolved stages remain visible until corrected through a governed version.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20">
                  <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold">Reality → Outcome inspection</p>
                      <p className="mt-1 text-xs text-white/40">Select a stage to inspect the normalized value.</p>
                    </div>
                    <span className="w-fit rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                      {mapped} of 8 mapped
                    </span>
                  </div>

                  <div className="divide-y divide-white/[0.07]">
                    {stages.map((stage) => {
                      const value = route.chain[stage.key];
                      const unresolved = value === 'UNKNOWN';
                      const expanded = expandedStage === stage.key;

                      return (
                        <button
                          key={stage.key}
                          type="button"
                          onClick={() => setExpandedStage(expanded ? null : stage.key)}
                          className="block w-full px-5 py-4 text-left transition hover:bg-white/[0.035]"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] text-white/28">{stage.number}</span>
                            <span className="text-sm font-semibold text-white/80">{stage.label}</span>
                            <span
                              className={`ml-auto text-[10px] font-semibold uppercase tracking-[0.16em] ${
                                unresolved ? 'text-amber-200' : 'text-emerald-200'
                              }`}
                            >
                              {unresolved ? 'UNKNOWN' : 'Mapped'}
                            </span>
                            <span className="text-white/25">{expanded ? '−' : '+'}</span>
                          </div>
                          {expanded && (
                            <p
                              className={`mt-3 border-t border-white/[0.07] pt-3 text-sm leading-6 ${
                                unresolved ? 'font-mono text-amber-100/75' : 'text-white/55'
                              }`}
                            >
                              {value}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold">Preserved import record</p>
                      <p className="mt-1 text-xs text-white/40">Source identity remains attached to the normalized route.</p>
                    </div>
                    <span className="break-all rounded-full border border-white/10 px-3 py-2 font-mono text-[10px] text-white/45">
                      {route.importRecord.sourceDigest}
                    </span>
                  </div>

                  <dl className="mt-5 grid gap-4 text-xs sm:grid-cols-2">
                    <Info label="Original file" value={route.importRecord.originalFileName} />
                    <Info label="Original schema" value={route.importRecord.originalSchema} />
                    <Info label="Domain" value={route.metadata.domain} />
                    <Info label="Owner" value={route.metadata.owner} />
                    <Info label="Source format" value={route.metadata.sourceFormat} />
                    <Info label="Version" value={String(route.metadata.version)} />
                  </dl>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={copyRoute}
                    className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35"
                  >
                    {copied ? 'Copied' : 'Copy normalized JSON'}
                  </button>
                  <button
                    type="button"
                    onClick={download}
                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-200"
                  >
                    Download route
                  </button>
                  <Link
                    href="/workspace/build"
                    className="rounded-full border border-white/15 px-5 py-3 text-center text-sm font-semibold text-white transition hover:border-white/35"
                  >
                    Correct in Builder
                  </Link>
                  <Link
                    href="/workspace/scanner"
                    className="rounded-full bg-cyan-300 px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-cyan-200"
                  >
                    Open Scanner
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Governed import sequence</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">The source moves forward without being rewritten into certainty.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/45">
              Every imported route remains reviewable because identity, missing stages, and correction history stay visible.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
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
    </main>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/32">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-white/38">{detail}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">{label}</dt>
      <dd className="mt-2 break-words text-sm text-white/68">{value}</dd>
    </div>
  );
}

function Principle({
  number,
  title,
  text: body,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 font-mono text-xs text-cyan-200">
          {number}
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/48">{body}</p>
    </div>
  );
}
