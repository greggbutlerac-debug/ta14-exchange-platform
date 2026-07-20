'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type InterpretationState =
  | 'STABLE'
  | 'EMERGING_DRIFT'
  | 'THRESHOLD_EXCURSION'
  | 'PERSISTENT_EXCURSION'
  | 'ACUTE_EVENT'
  | 'COMPOUND_EVENT'
  | 'POST_INTERVENTION_CHANGE'
  | 'SENSOR_INTEGRITY_EXCEPTION'
  | 'CONFLICTING_EVIDENCE'
  | 'INSUFFICIENT_EVIDENCE'
  | 'ESCALATION_RECOMMENDED';

type Channel = {
  id: string;
  name: string;
  shortName: string;
  type: 'Measured' | 'Calculated' | 'Measured or calculated';
  value: string;
  status: 'NORMAL' | 'WATCH' | 'EXCURSION' | 'MISSING';
  role: string;
  boundary: string;
};

type EventWindow = {
  id: string;
  start: string;
  end: string;
  classification: InterpretationState;
  title: string;
  channels: string[];
  finding: string;
  limitation: string;
};

const CHANNELS: Channel[] = [
  {
    id: 'dry-bulb',
    name: 'Dry-bulb temperature',
    shortName: 'Dry Bulb',
    type: 'Measured',
    value: '72.4 °F',
    status: 'NORMAL',
    role: 'Thermal state and rate-of-change context.',
    boundary:
      'Temperature alone does not establish comfort, safety, or equipment performance.',
  },
  {
    id: 'relative-humidity',
    name: 'Relative humidity',
    shortName: 'RH',
    type: 'Measured',
    value: '61.8%',
    status: 'WATCH',
    role: 'Moisture state relative to temperature.',
    boundary:
      'Must be interpreted with temperature, duration, and surface conditions.',
  },
  {
    id: 'dew-point',
    name: 'Dew-point temperature',
    shortName: 'Dew Point',
    type: 'Calculated',
    value: '58.5 °F',
    status: 'WATCH',
    role: 'Condensation and moisture-risk context.',
    boundary:
      'Depends on validated temperature and relative-humidity inputs.',
  },
  {
    id: 'wet-bulb',
    name: 'Wet-bulb temperature',
    shortName: 'Wet Bulb',
    type: 'Calculated',
    value: '63.7 °F',
    status: 'NORMAL',
    role: 'Combined heat-and-moisture state.',
    boundary:
      'Calculation method and assumptions must remain declared.',
  },
  {
    id: 'humidity-ratio',
    name: 'Humidity ratio',
    shortName: 'Humidity Ratio',
    type: 'Calculated',
    value: '0.0106 lb/lb',
    status: 'WATCH',
    role: 'Absolute moisture content.',
    boundary:
      'Depends on pressure and valid psychrometric inputs.',
  },
  {
    id: 'enthalpy',
    name: 'Enthalpy',
    shortName: 'Enthalpy',
    type: 'Calculated',
    value: '28.9 Btu/lb',
    status: 'NORMAL',
    role: 'Total sensible and latent energy state.',
    boundary:
      'Does not prove HVAC capacity or efficiency by itself.',
  },
  {
    id: 'specific-volume',
    name: 'Specific volume',
    shortName: 'Specific Volume',
    type: 'Calculated',
    value: '13.62 ft³/lb',
    status: 'NORMAL',
    role: 'Air-volume-to-mass relationship.',
    boundary:
      'Requires pressure and psychrometric inputs.',
  },
  {
    id: 'pressure',
    name: 'Differential pressure',
    shortName: 'Pressure',
    type: 'Measured',
    value: '-0.006 in. w.c.',
    status: 'EXCURSION',
    role: 'Pressure relationship to the declared reference space.',
    boundary:
      'Sensor location, reference side, and operating mode are mandatory.',
  },
  {
    id: 'co2',
    name: 'Carbon dioxide',
    shortName: 'CO₂',
    type: 'Measured',
    value: '1,018 ppm',
    status: 'WATCH',
    role: 'Occupancy and ventilation context.',
    boundary:
      'CO₂ is not a universal indoor-air-quality score.',
  },
  {
    id: 'voc',
    name: 'Volatile organic compounds',
    shortName: 'VOC / TVOC',
    type: 'Measured',
    value: '384 ppb',
    status: 'WATCH',
    role: 'Chemical-event pattern and persistence.',
    boundary:
      'Aggregate TVOC does not identify a specific compound or source.',
  },
  {
    id: 'pm',
    name: 'Particulate matter',
    shortName: 'PM2.5',
    type: 'Measured',
    value: '19.6 µg/m³',
    status: 'EXCURSION',
    role: 'Particulate event, infiltration, and persistence context.',
    boundary:
      'Mass concentration does not prove particle composition or source.',
  },
  {
    id: 'radon',
    name: 'Radon',
    shortName: 'Radon',
    type: 'Measured',
    value: '2.1 pCi/L',
    status: 'NORMAL',
    role: 'Long-duration accumulation and exposure context.',
    boundary:
      'Requires an appropriate averaging window and declared test conditions.',
  },
  {
    id: 'sound',
    name: 'Sound pressure',
    shortName: 'Sound',
    type: 'Measured',
    value: '67 dBA',
    status: 'WATCH',
    role: 'Noise events, recurrence, and dose-window context.',
    boundary:
      'Environmental and occupational interpretations must remain distinct.',
  },
];

const EVENTS: EventWindow[] = [
  {
    id: 'EVT-001',
    start: '09:14',
    end: '09:27',
    classification: 'COMPOUND_EVENT',
    title: 'Pressure and particulate event',
    channels: ['Pressure', 'PM2.5'],
    finding:
      'Negative-pressure performance weakened while particulate concentration increased within the same bounded interval.',
    limitation:
      'The temporal overlap does not establish the cause of the particulate increase or prove migration through the doorway.',
  },
  {
    id: 'EVT-002',
    start: '11:08',
    end: '11:44',
    classification: 'PERSISTENT_EXCURSION',
    title: 'Moisture-state persistence',
    channels: ['RH', 'Dew Point', 'Humidity Ratio'],
    finding:
      'Relative humidity and derived moisture channels remained outside the declared baseline envelope for 36 minutes.',
    limitation:
      'The record does not establish condensation, biological growth, or equipment failure without surface and system evidence.',
  },
  {
    id: 'EVT-003',
    start: '14:02',
    end: '14:18',
    classification: 'SENSOR_INTEGRITY_EXCEPTION',
    title: 'CO₂ continuity interruption',
    channels: ['CO₂'],
    finding:
      'A sixteen-minute flatline is inconsistent with the surrounding signal pattern and is classified as a sensor-integrity exception.',
    limitation:
      'The missing interval cannot be reconstructed from the submitted record.',
  },
];

const STATE_STYLES: Record<InterpretationState, string> = {
  STABLE: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  EMERGING_DRIFT: 'border-sky-300 bg-sky-50 text-sky-800',
  THRESHOLD_EXCURSION:
    'border-amber-300 bg-amber-50 text-amber-800',
  PERSISTENT_EXCURSION:
    'border-orange-300 bg-orange-50 text-orange-800',
  ACUTE_EVENT: 'border-rose-300 bg-rose-50 text-rose-800',
  COMPOUND_EVENT:
    'border-violet-300 bg-violet-50 text-violet-800',
  POST_INTERVENTION_CHANGE:
    'border-cyan-300 bg-cyan-50 text-cyan-800',
  SENSOR_INTEGRITY_EXCEPTION:
    'border-slate-300 bg-slate-100 text-slate-800',
  CONFLICTING_EVIDENCE:
    'border-fuchsia-300 bg-fuchsia-50 text-fuchsia-800',
  INSUFFICIENT_EVIDENCE:
    'border-zinc-300 bg-zinc-100 text-zinc-800',
  ESCALATION_RECOMMENDED:
    'border-red-300 bg-red-50 text-red-800',
};

function channelStyle(status: Channel['status']) {
  if (status === 'NORMAL') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  }

  if (status === 'WATCH') {
    return 'border-amber-200 bg-amber-50 text-amber-800';
  }

  if (status === 'EXCURSION') {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }

  return 'border-slate-200 bg-slate-100 text-slate-700';
}

export default function EnvironmentalRecordInterpreterPage() {
  const [activeChannelId, setActiveChannelId] = useState(
    CHANNELS[7].id,
  );
  const [activeEventId, setActiveEventId] = useState(EVENTS[0].id);
  const [showGir, setShowGir] = useState(false);

  const activeChannel = useMemo(
    () =>
      CHANNELS.find(
        (channel) => channel.id === activeChannelId,
      ) ?? CHANNELS[0],
    [activeChannelId],
  );

  const activeEvent = useMemo(
    () =>
      EVENTS.find((event) => event.id === activeEventId) ??
      EVENTS[0],
    [activeEventId],
  );

  return (
    <main className="min-h-screen bg-[#f4f6f7] text-slate-950">
      <section className="border-b border-slate-200 bg-[#073847] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="mb-8">
            <Link
              href="/governed-record-interpreter"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#073847]"
            >
              <span aria-hidden="true">←</span>
              Back to GRI™ Workspace
            </Link>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            GRI™ Module 01
          </p>

          <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                ERI™ Environmental Record Interpreter
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
                Environmental intelligence without evidentiary
                overreach. Interpret atmospheric, personal, building,
                hospital, laboratory, HVAC, water, soil, land, and
                sensor records while preserving the exact boundary
                between what the record proves and what it cannot
                prove.
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-300/25 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Current demonstration
              </p>

              <h2 className="mt-3 text-xl font-semibold">
                Healthcare Isolation Room 214
              </h2>

              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-slate-300">Record</dt>
                  <dd className="font-medium">AIR-DEMO-014</dd>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-slate-300">Period</dt>
                  <dd className="font-medium">24 hours</dd>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-slate-300">
                    Interpretation state
                  </dt>
                  <dd className="font-medium text-amber-300">
                    HOLD
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-slate-300">Module</dt>
                  <dd className="font-medium">
                    eri.atmospheric 1.1.0
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-10 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Thirteen-channel atmospheric core
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Governed environmental state
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Measured and calculated channels remain distinct. Every
              value retains its source, unit, timestamp, location,
              uncertainty, and transformation lineage.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map((channel) => {
              const active = channel.id === activeChannelId;

              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() =>
                    setActiveChannelId(channel.id)
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    active
                      ? 'border-cyan-600 bg-cyan-50 ring-2 ring-cyan-100'
                      : 'border-slate-200 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {channel.type}
                      </p>

                      <h3 className="mt-2 font-semibold">
                        {channel.shortName}
                      </h3>
                    </div>

                    <span
                      className={`rounded-full border px-2 py-1 text-[10px] font-bold ${channelStyle(
                        channel.status,
                      )}`}
                    >
                      {channel.status}
                    </span>
                  </div>

                  <p className="mt-4 text-xl font-semibold">
                    {channel.value}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Interpretive role
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                {activeChannel.name}
              </h3>

              <p className="mt-3 leading-7 text-slate-700">
                {activeChannel.role}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                Required boundary
              </p>

              <p className="mt-2 leading-7 text-slate-700">
                {activeChannel.boundary}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Environmental chronology
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Detected event windows
            </h2>

            <div className="mt-6 space-y-3">
              {EVENTS.map((event) => {
                const active = event.id === activeEventId;

                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() =>
                      setActiveEventId(event.id)
                    }
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active
                        ? 'border-cyan-600 bg-cyan-50 ring-2 ring-cyan-100'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {event.title}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {event.start}–{event.end} · {event.id}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] font-bold ${STATE_STYLES[event.classification]}`}
                      >
                        {event.classification.replaceAll(
                          '_',
                          ' ',
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Selected event interpretation
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {activeEvent.title}
                </h2>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold ${STATE_STYLES[activeEvent.classification]}`}
              >
                {activeEvent.classification.replaceAll('_', ' ')}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                  Supported finding
                </p>

                <p className="mt-3 leading-7 text-slate-700">
                  {activeEvent.finding}
                </p>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-800">
                  Evidentiary limitation
                </p>

                <p className="mt-3 leading-7 text-slate-700">
                  {activeEvent.limitation}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Bound channels
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {activeEvent.channels.map((channel) => (
                  <span
                    key={channel}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-semibold"
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Five-Lane Intelligence Model
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Environmental interpretation
            </h2>

            <div className="mt-6 space-y-4">
              {[
                [
                  'What the record proves',
                  'Pressure performance weakened during three bounded intervals, and two intervals overlapped with increased particulate concentration.',
                  'border-emerald-200 bg-emerald-50',
                ],
                [
                  'What the record may indicate',
                  'The pressure and particulate pattern may be consistent with migration or infiltration, but source and pathway are not established.',
                  'border-amber-200 bg-amber-50',
                ],
                [
                  'What the record cannot prove',
                  'The record does not establish infection transmission, occupant harm, negligence, equipment failure, or legal noncompliance.',
                  'border-rose-200 bg-rose-50',
                ],
                [
                  'Missing evidence',
                  'Door-state history, current calibration documentation, verified reference-pressure location, and room-use declarations are incomplete.',
                  'border-sky-200 bg-sky-50',
                ],
                [
                  'Recommended next evidence pathway',
                  'Obtain missing records, extend observation, verify the pressure reference, and route the GIR™ to the designated facility reviewer.',
                  'border-violet-200 bg-violet-50',
                ],
              ].map(([title, body, tone], index) => (
                <article
                  key={title}
                  className={`rounded-2xl border p-5 ${tone}`}
                >
                  <div className="flex gap-4">
                    <span className="text-xs font-bold tracking-widest text-slate-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div>
                      <h3 className="font-semibold">{title}</h3>

                      <p className="mt-2 leading-7 text-slate-700">
                        {body}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Baseline and outcome logic
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                No invented baseline. No assumed success.
              </h2>

              <dl className="mt-6 space-y-4 text-sm">
                {[
                  [
                    'Baseline window',
                    '06:00–08:00 / occupied / negative-pressure mode',
                  ],
                  [
                    'Baseline support',
                    'Qualified — outdoor reference and door-state incomplete',
                  ],
                  [
                    'Event trigger',
                    'Pressure below declared contextual threshold',
                  ],
                  [
                    'Persistence rule',
                    'Continuous or recurrent duration greater than 10 minutes',
                  ],
                  [
                    'Post-intervention record',
                    'Not yet supplied',
                  ],
                  [
                    'Outcome state',
                    'HOLD — performance restoration not established',
                  ],
                ].map(([term, value]) => (
                  <div
                    key={term}
                    className="border-b border-slate-100 pb-3 last:border-0"
                  >
                    <dt className="font-semibold text-slate-500">
                      {term}
                    </dt>

                    <dd className="mt-1 text-slate-900">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                Non-negotiable boundary
              </p>

              <p className="mt-3 leading-7 text-slate-700">
                This interpretation does not modify the source
                evidence, establish medical causation, issue a
                diagnosis, prescribe treatment, condemn equipment,
                determine liability, certify compliance, or
                authorize environmental intervention.
              </p>
            </section>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Governed Interpretation Record
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                GIR™ environmental output
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowGir((value) => !value)}
              className="rounded-xl bg-[#073847] px-4 py-2 text-sm font-semibold text-white hover:bg-[#052c38]"
            >
              {showGir
                ? 'Hide GIR™ object'
                : 'Preview GIR™ object'}
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['GIR ID', 'GIR-ERI-DEMO-00014'],
              ['Source binding', 'AIR-DEMO-014'],
              ['Decision state', 'HOLD'],
              ['Interpretation class', 'COMPOUND EVENT'],
              ['Engine', 'gri-core 0.1.0'],
              ['Module', 'eri.atmospheric 1.1.0'],
              ['Ruleset', 'eri-healthcare-air 1.0.0'],
              ['Replay', 'EXPLANATORY READY'],
            ].map(([term, value]) => (
              <div
                key={term}
                className="rounded-2xl bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {term}
                </p>

                <p className="mt-2 break-words text-sm font-semibold">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {showGir && (
            <pre className="mt-6 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-xs leading-6 text-slate-200">
{`{
  "gir_id": "GIR-ERI-DEMO-00014",
  "source_record_ids": ["AIR-DEMO-014"],
  "module": "eri.atmospheric",
  "module_version": "1.1.0",
  "ruleset_version": "eri-healthcare-air-1.0.0",
  "status": "HOLD",
  "classification": "COMPOUND_EVENT",
  "supported": [
    "Three negative-pressure excursions occurred.",
    "Two excursions overlapped with increased PM2.5."
  ],
  "possible_unconfirmed": [
    "The pattern may be consistent with migration or infiltration."
  ],
  "unsupported": [
    "Infection transmission",
    "Medical causation",
    "Equipment failure",
    "Legal liability"
  ],
  "missing_evidence": [
    "Door-state history",
    "Current calibration certificate",
    "Verified reference-pressure location",
    "Room-use declaration"
  ],
  "next_governed_steps": [
    "Obtain missing evidence",
    "Extend observation",
    "Route to facility reviewer"
  ],
  "receipt_state": "DRAFT",
  "replay_mode": "EXPLANATORY"
}`}
            </pre>
          )}
        </section>

        <section className="flex justify-start">
          <Link
            href="/governed-record-interpreter"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-cyan-600 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2"
          >
            <span aria-hidden="true">←</span>
            Return to GRI™ Workspace
          </Link>
        </section>
      </div>
    </main>
  );
}
