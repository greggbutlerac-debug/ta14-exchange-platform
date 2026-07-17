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

const sample = JSON.stringify(
  {
    name: 'Autonomous customer refund',
    domain: 'AI Governance',
    owner: 'Customer Operations',
    reality: 'A verified customer dispute exists for a completed transaction.',
    record: 'Customer request, transaction record, policy version, model recommendation, and human approval evidence.',
    continuity: 'Preserve source identifiers, digests, timestamps, transformations, dependencies, and superseded versions.',
    admissibility: 'The dispute must be eligible, evidence must be complete, the policy must be current, and the refund must remain within the approval threshold.',
    binding: 'Bind the customer, account, transaction, approving authority, refund amount, destination, model version, and execution environment.',
    commit: 'Freeze the canonical refund payload, evidence set, decision receipt, bindings, route digest, version, and expiry time.',
    execution: 'Issue only the committed refund amount to the bound destination through the approved payment service.',
    outcome: 'Verify processor settlement, customer account credit, amount, destination, timestamp, and reconciliation result.',
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

  const parsedPreview = useMemo(() => {
    if (!source.trim()) return null;
    try {
      return JSON.parse(source) as unknown;
    } catch {
      return null;
    }
  }, [source]);

  function loadContent(content: string, name: string) {
    setSource(content);
    setFileName(name);
    setRoute(null);
    setError('');
    setState('LOADED');
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

  const unknowns = route?.importRecord.preservedUnknowns ?? 0;

  return (
    <main className="min-h-screen bg-[#05070a] px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Exchange Workspace · Import</p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Bring an existing route into TA-14 without hiding what is missing.</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/60 sm:text-lg">
              Upload or paste a JSON route. The importer preserves the source record, maps recognized fields into the Reality → Outcome chain, and leaves unresolved stages explicitly UNKNOWN.
            </p>
          </div>
          <Link href="/workspace" className="w-fit rounded-full border border-white/15 px-5 py-3 text-sm text-white/75 transition hover:border-white/35 hover:text-white">
            Back to Workspace
          </Link>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <div
              onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`rounded-[2rem] border border-dashed p-8 transition ${dragging ? 'border-cyan-300 bg-cyan-300/10' : 'border-white/15 bg-white/[0.035]'}`}
            >
              <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={onFileChange} />
              <p className="text-sm font-semibold text-cyan-200">JSON route intake</p>
              <h2 className="mt-3 text-2xl font-semibold">Drop a route file here</h2>
              <p className="mt-3 text-sm leading-6 text-white/55">Maximum 1 MB. The original content is not rewritten in place.</p>
              <button onClick={() => inputRef.current?.click()} className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-200">
                Choose JSON file
              </button>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Or paste JSON</p>
                  <p className="mt-1 text-xs text-white/45">Source: {fileName || 'No file selected'}</p>
                </div>
                <button onClick={() => loadContent(sample, 'sample-route.json')} className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/70 hover:border-white/30 hover:text-white">
                  Load sample
                </button>
              </div>
              <textarea
                value={source}
                onChange={(event) => loadContent(event.target.value, '')}
                spellCheck={false}
                placeholder={'{\n  "name": "My route",\n  "reality": "..."\n}'}
                className="mt-5 min-h-[360px] w-full resize-y rounded-2xl border border-white/10 bg-black/35 p-4 font-mono text-xs leading-6 text-white/75 outline-none transition focus:border-cyan-300/50"
              />
              {error && <p className="mt-4 rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-100">{error}</p>}
              <button
                onClick={importRoute}
                disabled={!parsedPreview}
                className="mt-5 w-full rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-35"
              >
                Normalize into TA-14 route
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.055] to-white/[0.02] p-6 sm:p-8">
            {!route ? (
              <div className="flex min-h-[720px] flex-col items-center justify-center text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-white/5 text-2xl">↥</div>
                <h2 className="mt-6 text-2xl font-semibold">No route imported yet</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/50">Load valid JSON to inspect normalization, preserved unknowns, source identity, and construction readiness.</p>
              </div>
            ) : (
              <div>
                <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">TA14_ROUTE_DRAFT_V1</p>
                    <h2 className="mt-3 text-3xl font-semibold">{route.metadata.name}</h2>
                    <p className="mt-2 font-mono text-xs text-white/45">{route.routeId}</p>
                  </div>
                  <span className={`w-fit rounded-full border px-4 py-2 text-xs font-semibold ${route.status === 'READY_FOR_TEST' ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200' : 'border-amber-300/30 bg-amber-300/10 text-amber-100'}`}>
                    {route.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <Metric label="Mapped stages" value={`${route.importRecord.normalizedFields}/8`} />
                  <Metric label="Preserved UNKNOWN" value={String(unknowns)} />
                  <Metric label="Source digest" value={route.importRecord.sourceDigest.split(':')[1]} mono />
                </div>

                <div className="mt-7 space-y-3">
                  {stages.map((stage) => {
                    const value = route.chain[stage.key];
                    const unresolved = value === 'UNKNOWN';
                    return (
                      <div key={stage.key} className={`rounded-2xl border p-4 ${unresolved ? 'border-amber-300/20 bg-amber-300/[0.06]' : 'border-white/10 bg-black/20'}`}>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-white/35">{stage.number}</span>
                          <span className="text-sm font-semibold">{stage.label}</span>
                          <span className={`ml-auto text-[10px] font-semibold uppercase tracking-[0.16em] ${unresolved ? 'text-amber-200' : 'text-emerald-200'}`}>
                            {unresolved ? 'Unresolved' : 'Mapped'}
                          </span>
                        </div>
                        <p className={`mt-3 text-sm leading-6 ${unresolved ? 'font-mono text-amber-100/80' : 'text-white/58'}`}>{value}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-7 rounded-2xl border border-white/10 bg-black/25 p-5">
                  <p className="text-sm font-semibold">Import record</p>
                  <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
                    <Info label="Original file" value={route.importRecord.originalFileName} />
                    <Info label="Original schema" value={route.importRecord.originalSchema} />
                    <Info label="Domain" value={route.metadata.domain} />
                    <Info label="Owner" value={route.metadata.owner} />
                  </dl>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <button onClick={copyRoute} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:border-white/35">
                    {copied ? 'Copied' : 'Copy normalized JSON'}
                  </button>
                  <button onClick={download} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-cyan-200">Download route</button>
                  <Link href="/workspace/build" className="rounded-full border border-white/15 px-5 py-3 text-center text-sm font-semibold text-white hover:border-white/35">Correct in Builder</Link>
                  <Link href="/workspace/scanner" className="rounded-full bg-cyan-300 px-5 py-3 text-center text-sm font-semibold text-black hover:bg-cyan-200">Open Scanner</Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Principle number="01" title="Preserve the source" text="Import creates a new normalized draft and retains source identity and digest information." />
          <Principle number="02" title="Never infer completeness" text="Missing stages remain UNKNOWN. The importer does not manufacture evidence or authority." />
          <Principle number="03" title="Correct through versions" text="Imported drafts advance through the Builder and Scanner before any executable commit exists." />
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</p><p className={`mt-2 text-lg font-semibold ${mono ? 'font-mono text-sm' : ''}`}>{value}</p></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-white/35">{label}</dt><dd className="mt-1 break-words text-white/70">{value}</dd></div>;
}

function Principle({ number, title, text: body }: { number: string; title: string; text: string }) {
  return <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5"><p className="font-mono text-xs text-cyan-300">{number}</p><h3 className="mt-3 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/50">{body}</p></div>;
}
