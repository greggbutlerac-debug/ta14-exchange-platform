'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type DecisionState = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';
type ValidationState = 'VERIFIED' | 'QUALIFIED' | 'MISSING' | 'FAILED';

type DemoRecord = {
  id: string;
  label: string;
  className: string;
  subject: string;
  period: string;
  state: DecisionState;
  summary: string;
};

type Lane = {
  title: string;
  eyebrow: string;
  body: string;
  tone: string;
};

const DEMO_RECORDS: DemoRecord[] = [
  {
    id: 'AIR-DEMO-014',
    label: 'Building Atmospheric Integrity Record',
    className: 'AIR',
    subject: 'Healthcare Isolation Room 214',
    period: 'July 18–19, 2026',
    state: 'HOLD',
    summary:
      'Negative-pressure continuity was interrupted during three documented intervals. Door-state evidence is incomplete.',
  },
  {
    id: 'PAIR-DEMO-007',
    label: 'Personal Atmospheric Integrity Record',
    className: 'PAIR',
    subject: 'Authorized exposure chronology',
    period: 'July 17–19, 2026',
    state: 'ESCALATE',
    summary:
      'Repeated exposure overlap is visible, but clinical interpretation requires an authorized professional review lane.',
  },
  {
    id: 'BER-DEMO-022',
    label: 'Building Environmental Record',
    className: 'BUILDING',
    subject: 'Commercial Office — AHU-3 Zone',
    period: 'July 1–19, 2026',
    state: 'ALLOW',
    summary:
      'The post-intervention record documents sustained change against the declared baseline within the stated scope.',
  },
];

const VALIDATIONS: Array<{
  name: string;
  state: ValidationState;
  detail: string;
}> = [
  {
    name: 'Integrity',
    state: 'VERIFIED',
    detail: 'Source digest and attachment manifest match the preserved intake object.',
  },
  {
    name: 'Provenance',
    state: 'QUALIFIED',
    detail: 'Sensor identity is present; latest field-calibration certificate is not attached.',
  },
  {
    name: 'Continuity',
    state: 'MISSING',
    detail: 'Three event-sensitive gaps overlap the pressure excursion window.',
  },
  {
    name: 'Admissibility',
    state: 'QUALIFIED',
    detail: 'Suitable for bounded interpretation, not unrestricted reliance.',
  },
  {
    name: 'Context',
    state: 'MISSING',
    detail: 'Door-state history and declared room-use status are incomplete.',
  },
];

const LANES: Lane[] = [
  {
    eyebrow: '01',
    title: 'Supported by the Record',
    body:
      'The record documents three pressure excursions below the declared threshold during the stated observation window.',
    tone: 'border-emerald-300 bg-emerald-50',
  },
  {
    eyebrow: '02',
    title: 'Possible but Unconfirmed',
    body:
      'The timing may be consistent with intermittent door opening, but the submitted record does not establish cause.',
    tone: 'border-amber-300 bg-amber-50',
  },
  {
    eyebrow: '03',
    title: 'Not Supported by the Record',
    body:
      'The record does not establish infection transmission, patient harm, equipment failure, negligence, or legal liability.',
    tone: 'border-rose-300 bg-rose-50',
  },
  {
    eyebrow: '04',
    title: 'Evidence Missing',
    body:
      'Door-state history, current calibration evidence, room-use status, and a verified outdoor/reference pressure channel are absent.',
    tone: 'border-sky-300 bg-sky-50',
  },
  {
    eyebrow: '05',
    title: 'Next Governed Steps',
    body:
      'Obtain the missing evidence, extend the observation window, and route the record to the designated facilities reviewer before reliance.',
    tone: 'border-violet-300 bg-violet-50',
  },
];

const WORKFLOW = [
  'Upload',
  'Identify',
  'Validate',
  'Bind Context',
  'Interpret',
  'Review',
  'Seal',
];

function stateClass(state: DecisionState) {
  if (state === 'ALLOW') {
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  }

  if (state === 'HOLD') {
    return 'bg-amber-100 text-amber-800 border-amber-300';
  }

  if (state === 'DENY') {
    return 'bg-rose-100 text-rose-800 border-rose-300';
  }

  return 'bg-violet-100 text-violet-800 border-violet-300';
}

function validationClass(state: ValidationState) {
  if (state === 'VERIFIED') {
    return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  }

  if (state === 'QUALIFIED') {
    return 'text-amber-700 bg-amber-50 border-amber-200';
  }

  if (state === 'FAILED') {
    return 'text-rose-700 bg-rose-50 border-rose-200';
  }

  return 'text-sky-700 bg-sky-50 border-sky-200';
}

export default function GovernedRecordInterpreterPage() {
  const [selectedRecordId, setSelectedRecordId] = useState(DEMO_RECORDS[0].id);
  const [activeStep, setActiveStep] = useState(4);
  const [showTrace, setShowTrace] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [moduleId, setModuleId] = useState('eri.environmental.v1');

  const selectedRecord = useMemo(
    () =>
      DEMO_RECORDS.find((record) => record.id === selectedRecordId) ??
      DEMO_RECORDS[0],
    [selectedRecordId],
  );

  return (
    <main className="min-h-screen bg-[#f4f6f7] text-slate-950">
      <section className="border-b border-slate-200 bg-[#082234] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
              TA-14 AI Governance Exchange
            </p>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              GRI™ Governed Record Interpreter
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">
              Turn governed records into bounded, traceable, replayable
              interpretations without changing the source evidence or pretending
              that interpretation is authority.
            </p>

            <div className="mt-8 rounded-2xl border border-cyan-400/30 bg-cyan-300/10 p-5 text-cyan-50">
              <p className="font-semibold">Constitutional boundary</p>

              <p className="mt-2 leading-7">
                No interpretation may exceed the evidence, authority, context,
                continuity, provenance, or declared scope that governs it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <div className="grid gap-3 md:grid-cols-7">
            {WORKFLOW.map((step, index) => {
              const active = index === activeStep;
              const complete = index < activeStep;

              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    active
                      ? 'border-cyan-700 bg-cyan-700 text-white'
                      : complete
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <span className="block text-xs font-semibold uppercase tracking-widest opacity-75">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="mt-1 block text-sm font-semibold">
                    {step}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-10 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Governed record intake
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Select or upload a record
                </h2>
              </div>

              <button
                type="button"
                className="rounded-xl bg-[#0a6a80] px-4 py-2 text-sm font-semibold text-white hover:bg-[#07596d]"
              >
                Upload record
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {DEMO_RECORDS.map((record) => {
                const selected = record.id === selectedRecordId;

                return (
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => setSelectedRecordId(record.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selected
                        ? 'border-cyan-600 bg-cyan-50 ring-2 ring-cyan-100'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{record.label}</p>

                        <p className="mt-1 text-sm text-slate-500">
                          {record.id}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${stateClass(
                          record.state,
                        )}`}
                      >
                        {record.state}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {record.summary}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <p className="text-sm font-semibold">Supported intake</p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                PDF, CSV, JSON, AIR, PAIR, laboratory report, sensor package,
                HVAC diagnostic record, building record, and governed replay
                package.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Bound source
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {selectedRecord.label}
                </h2>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold ${stateClass(
                  selectedRecord.state,
                )}`}
              >
                {selectedRecord.state}
              </span>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ['Record ID', selectedRecord.id],
                ['Record class', selectedRecord.className],
                ['Subject', selectedRecord.subject],
                ['Covered period', selectedRecord.period],
                ['Source digest', 'sha256: 4c9a…be21'],
                ['Preservation state', 'Immutable intake object'],
              ].map(([term, value]) => (
                <div key={term} className="rounded-2xl bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {term}
                  </dt>

                  <dd className="mt-2 text-sm font-medium text-slate-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              <label htmlFor="module" className="text-sm font-semibold">
                Interpretation module
              </label>

              <select
                id="module"
                value={moduleId}
                onChange={(event) => setModuleId(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-cyan-600 focus:ring-2"
              >
                <option value="eri.environmental.v1">
                  ERI™ Environmental Record Interpreter — Module 01 — Live
                </option>

                <option value="air.atmospheric.v1" disabled>
                  AIR Interpreter — Planned
                </option>

                <option value="pair.personal.v1" disabled>
                  PAIR Interpreter — Planned
                </option>

                <option value="ai.route.v1" disabled>
                  AI Route Interpreter — Planned
                </option>
              </select>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                ERI™ is the first live module inside the GRI™ constitutional
                interpretation platform. Future modules remain unavailable until
                they are separately implemented and verified.
              </p>

              <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                      Live interpretation module
                    </p>

                    <p className="mt-2 font-semibold text-slate-950">
                      ERI™ Environmental Record Interpreter
                    </p>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                      Open the live environmental interpretation workspace for
                      the selected governed record. Opening a module does not
                      authorize a decision, bind an actor, or permit execution.
                    </p>
                  </div>

                  <Link
                    href="/governed-record-interpreter/eri"
                    className="inline-flex items-center justify-center rounded-xl bg-[#0a6a80] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07596d] focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2"
                  >
                    Launch ERI™ Module 01
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Constitutional validation
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Validation matrix
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-slate-600">
              GRI™ separates cryptographic integrity, provenance quality,
              continuity, context, and interpretive support instead of hiding
              them inside one confidence score.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-5">
            {VALIDATIONS.map((validation) => (
              <article
                key={validation.name}
                className={`rounded-2xl border p-4 ${validationClass(
                  validation.state,
                )}`}
              >
                <p className="text-xs font-bold uppercase tracking-wider">
                  {validation.state}
                </p>

                <h3 className="mt-2 font-semibold text-slate-950">
                  {validation.name}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {validation.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Five-Lane Intelligence Model
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Bounded interpretation
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowTrace((value) => !value)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                {showTrace ? 'Hide evidence trace' : 'Open evidence trace'}
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {LANES.map((lane) => (
                <article
                  key={lane.title}
                  className={`rounded-2xl border p-5 ${lane.tone}`}
                >
                  <div className="flex gap-4">
                    <span className="text-xs font-bold tracking-widest text-slate-500">
                      {lane.eyebrow}
                    </span>

                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {lane.title}
                      </h3>

                      <p className="mt-2 leading-7 text-slate-700">
                        {lane.body}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {showTrace && (
              <div className="mt-6 rounded-2xl border border-slate-300 bg-slate-950 p-5 text-slate-100">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  Claim-to-evidence trace
                </p>

                <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-slate-200">
{`claim_id: GIR-CLAIM-001
statement: "Three pressure excursions occurred below the declared threshold."
source_record: AIR-DEMO-014
source_fragments: [pressure.samples.441-498, pressure.samples.731-759]
rule_id: eri.pressure.excursion.v1
context: isolation-room-214 / occupied / negative-pressure-mode
support: DIRECT
boundary: Does not establish cause, infection transmission, or clinical outcome.`}
                </pre>
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                Boundary Engine
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Interpretation restraint
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
                <p>
                  <strong>Prohibited:</strong> diagnosis, clinical causation,
                  legal liability, engineering approval, regulatory
                  determination, payment authority, or direct environmental
                  control.
                </p>

                <p>
                  <strong>Required:</strong> evidence link, context fit, module
                  authority, causation boundary, expiry, and reviewer requirement
                  for every material claim.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-rose-200 bg-white p-4 text-sm leading-6 text-rose-800">
                When a claim cannot be bounded safely, GRI™ rejects, qualifies,
                or escalates it and records why.
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Context binding
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Declared reliance
              </h2>

              <dl className="mt-5 space-y-4 text-sm">
                {[
                  [
                    'Purpose',
                    'Bounded healthcare environmental interpretation',
                  ],
                  ['Authority', 'Facilities review only'],
                  ['Jurisdiction', 'Organization policy — demo'],
                  ['Privacy', 'Restricted environmental record'],
                  ['Review', 'Technical reviewer required'],
                  ['Expiry', 'Reinterpret after new calibration evidence'],
                ].map(([term, value]) => (
                  <div
                    key={term}
                    className="border-b border-slate-100 pb-3 last:border-0"
                  >
                    <dt className="font-semibold text-slate-500">{term}</dt>

                    <dd className="mt-1 text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </aside>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Governed output
                </p>

                <h2 className="mt-2 text-2xl font-semibold">GIR™ preview</h2>
              </div>

              <span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                DRAFT — HOLD
              </span>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ['GIR ID', 'GIR-DEMO-2026-00014'],
                ['Source binding', selectedRecord.id],
                ['GRI engine', 'gri-core 0.1.0'],
                ['Module', moduleId],
                ['Ruleset', 'eri-healthcare-pressure 1.0.0'],
                ['Review state', 'Technical review required'],
                ['Receipt state', 'Not sealed'],
                ['Replay state', 'Draft package available'],
              ].map(([term, value]) => (
                <div key={term} className="rounded-2xl bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {term}
                  </dt>

                  <dd className="mt-2 break-words text-sm font-medium">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowReceipt((value) => !value)}
                className="rounded-xl bg-[#082234] px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {showReceipt ? 'Hide receipt' : 'Preview receipt'}
              </button>

              <button
                type="button"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Generate replay package
              </button>
            </div>

            {showReceipt && (
              <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-xs leading-6 text-slate-200">
{`receipt_id: GIR-RCPT-00014
source_manifest_hash: sha256:4c9a...be21
gir_hash: pending_seal
engine_version: gri-core-0.1.0
module_version: eri.environmental.v1.1
ruleset_version: eri-healthcare-pressure-1.0.0
review_state: REQUIRED
replay_package_id: RP-GIR-00014`}
              </pre>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Compare and reinterpret
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Preserve history, never rewrite it
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              A newer module or ruleset may produce a better-supported
              interpretation, but it does not erase what was known, under which
              rules, by whom, and when.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                className="rounded-2xl border border-slate-200 p-5 text-left hover:border-cyan-500 hover:bg-cyan-50"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Comparison
                </span>

                <span className="mt-2 block font-semibold">
                  Before vs. after intervention
                </span>

                <span className="mt-2 block text-sm leading-6 text-slate-600">
                  Normalize context, units, evidence quality, and declared
                  success criteria.
                </span>
              </button>

              <button
                type="button"
                className="rounded-2xl border border-slate-200 p-5 text-left hover:border-cyan-500 hover:bg-cyan-50"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Reinterpretation
                </span>

                <span className="mt-2 block font-semibold">
                  Apply a newer module version
                </span>

                <span className="mt-2 block text-sm leading-6 text-slate-600">
                  Create a new GIR™ linked to the same immutable source record.
                </span>
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-[#082234] p-8 text-white shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                What GRI™ is not
              </p>

              <h2 className="mt-3 text-3xl font-semibold">
                Interpretation is not authority.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Not a generic summarizer or chatbot',
                'Not a diagnosis or treatment engine',
                'Not an engineering approval system',
                'Not a regulator or legal decision-maker',
                'Not a controller or remediation command',
                'Not permission to execute consequential action',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/15 bg-white/5 p-4"
                >
                  <p className="text-sm font-semibold text-slate-100">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
