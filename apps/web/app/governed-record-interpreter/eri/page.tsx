'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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

type ChannelStatus =
  | 'NORMAL'
  | 'WATCH'
  | 'EXCURSION'
  | 'MISSING';

type Channel = {
  id: string;
  name: string;
  shortName: string;
  type: 'Measured' | 'Calculated' | 'Measured or calculated';
  value: string;
  status: ChannelStatus;
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

type FiveLaneItem = {
  number: string;
  title: string;
  body: string;
  accent: string;
  background: string;
  border: string;
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
      'Relative humidity must be interpreted with temperature, duration, surface conditions, and record continuity.',
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
      'Dew point depends on validated temperature and relative-humidity inputs.',
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
      'The calculation method and assumptions must remain declared.',
  },
  {
    id: 'humidity-ratio',
    name: 'Humidity ratio',
    shortName: 'Humidity Ratio',
    type: 'Calculated',
    value: '0.0106 lb/lb',
    status: 'WATCH',
    role: 'Absolute moisture-content context.',
    boundary:
      'Humidity ratio depends on pressure and valid psychrometric inputs.',
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
      'Enthalpy does not prove HVAC capacity or system efficiency by itself.',
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
      'Specific volume requires pressure and valid psychrometric inputs.',
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
      'Sensor location, reference side, operating mode, and door state are material to interpretation.',
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
      'CO₂ is not a universal indoor-air-quality score and does not identify every ventilation condition.',
  },
  {
    id: 'voc',
    name: 'Volatile organic compounds',
    shortName: 'VOC / TVOC',
    type: 'Measured',
    value: '384 ppb',
    status: 'WATCH',
    role: 'Chemical-event pattern and persistence context.',
    boundary:
      'Aggregate TVOC does not identify a specific compound, pathway, or source.',
  },
  {
    id: 'pm',
    name: 'Particulate matter',
    shortName: 'PM2.5',
    type: 'Measured',
    value: '19.6 µg/m³',
    status: 'EXCURSION',
    role: 'Particulate-event, infiltration, and persistence context.',
    boundary:
      'Mass concentration does not prove particle composition, pathway, or source.',
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
      'Radon interpretation requires an appropriate averaging window and declared test conditions.',
  },
  {
    id: 'sound',
    name: 'Sound pressure',
    shortName: 'Sound',
    type: 'Measured',
    value: '67 dBA',
    status: 'WATCH',
    role: 'Noise-event, recurrence, and dose-window context.',
    boundary:
      'Environmental and occupational sound interpretations must remain distinct.',
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
      'Relative humidity and derived moisture channels remained outside the declared baseline envelope for thirty-six minutes.',
    limitation:
      'The record does not establish condensation, biological growth, material damage, or equipment failure without surface and system evidence.',
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

const FIVE_LANES: FiveLaneItem[] = [
  {
    number: '01',
    title: 'What the record proves',
    body:
      'Pressure performance weakened during three bounded intervals, and two intervals overlapped with increased particulate concentration.',
    accent: '#34d399',
    background: 'rgba(52, 211, 153, 0.08)',
    border: 'rgba(52, 211, 153, 0.24)',
  },
  {
    number: '02',
    title: 'What the record may indicate',
    body:
      'The pressure and particulate pattern may be consistent with migration or infiltration, but source and pathway are not established.',
    accent: '#fbbf24',
    background: 'rgba(251, 191, 36, 0.08)',
    border: 'rgba(251, 191, 36, 0.24)',
  },
  {
    number: '03',
    title: 'What the record cannot prove',
    body:
      'The record does not establish infection transmission, occupant harm, negligence, equipment failure, or legal noncompliance.',
    accent: '#fb7185',
    background: 'rgba(251, 113, 133, 0.08)',
    border: 'rgba(251, 113, 133, 0.24)',
  },
  {
    number: '04',
    title: 'Missing evidence',
    body:
      'Door-state history, current calibration documentation, verified reference-pressure location, and room-use declarations are incomplete.',
    accent: '#38bdf8',
    background: 'rgba(56, 189, 248, 0.08)',
    border: 'rgba(56, 189, 248, 0.24)',
  },
  {
    number: '05',
    title: 'Recommended next evidence pathway',
    body:
      'Obtain the missing records, extend observation, verify the pressure reference, and route the GIR™ to the designated facility reviewer.',
    accent: '#c084fc',
    background: 'rgba(192, 132, 252, 0.08)',
    border: 'rgba(192, 132, 252, 0.24)',
  },
];

const BASELINE_ITEMS = [
  [
    'Baseline window',
    '06:00–08:00 / occupied / negative-pressure mode',
  ],
  [
    'Baseline support',
    'Qualified — outdoor reference and door-state evidence incomplete',
  ],
  [
    'Event trigger',
    'Pressure below the declared contextual threshold',
  ],
  [
    'Persistence rule',
    'Continuous or recurrent duration greater than ten minutes',
  ],
  ['Post-intervention record', 'Not yet supplied'],
  [
    'Outcome state',
    'HOLD — performance restoration not established',
  ],
];

const GIR_SUMMARY = [
  ['GIR ID', 'GIR-ERI-DEMO-00014'],
  ['Decision state', 'HOLD'],
  ['Interpretation class', 'COMPOUND EVENT'],
  ['Engine', 'gri-core 0.1.0'],
  ['Module', 'eri.atmospheric 1.1.0'],
  ['Ruleset', 'eri-healthcare-air 1.0.0'],
  ['Replay', 'EXPLANATORY READY'],
];

function channelTone(status: ChannelStatus) {
  if (status === 'NORMAL') {
    return {
      color: '#6ee7b7',
      background: 'rgba(52, 211, 153, 0.08)',
      border: 'rgba(52, 211, 153, 0.24)',
    };
  }

  if (status === 'WATCH') {
    return {
      color: '#fcd34d',
      background: 'rgba(251, 191, 36, 0.08)',
      border: 'rgba(251, 191, 36, 0.24)',
    };
  }

  if (status === 'EXCURSION') {
    return {
      color: '#fda4af',
      background: 'rgba(251, 113, 133, 0.08)',
      border: 'rgba(251, 113, 133, 0.24)',
    };
  }

  return {
    color: '#cbd5e1',
    background: 'rgba(148, 163, 184, 0.08)',
    border: 'rgba(148, 163, 184, 0.24)',
  };
}

function stateTone(state: InterpretationState) {
  if (state === 'COMPOUND_EVENT') {
    return {
      color: '#d8b4fe',
      background: 'rgba(192, 132, 252, 0.09)',
      border: 'rgba(192, 132, 252, 0.28)',
    };
  }

  if (state === 'PERSISTENT_EXCURSION') {
    return {
      color: '#fdba74',
      background: 'rgba(251, 146, 60, 0.09)',
      border: 'rgba(251, 146, 60, 0.28)',
    };
  }

  if (state === 'SENSOR_INTEGRITY_EXCEPTION') {
    return {
      color: '#cbd5e1',
      background: 'rgba(148, 163, 184, 0.09)',
      border: 'rgba(148, 163, 184, 0.28)',
    };
  }

  if (
    state === 'ACUTE_EVENT' ||
    state === 'ESCALATION_RECOMMENDED'
  ) {
    return {
      color: '#fda4af',
      background: 'rgba(251, 113, 133, 0.09)',
      border: 'rgba(251, 113, 133, 0.28)',
    };
  }

  return {
    color: '#7dd3fc',
    background: 'rgba(56, 189, 248, 0.09)',
    border: 'rgba(56, 189, 248, 0.28)',
  };
}

export default function EnvironmentalRecordInterpreterPage() {
  const searchParams = useSearchParams();

  const sourceRecordId =
    searchParams.get('record') || 'AIR-DEMO-014';

  const [activeChannelId, setActiveChannelId] = useState(
    CHANNELS[7].id,
  );

  const [activeEventId, setActiveEventId] = useState(
    EVENTS[0].id,
  );

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

  const activeEventTone = stateTone(
    activeEvent.classification,
  );

  return (
    <main style={styles.page}>
      <header style={styles.topBar}>
        <Link href="/workspace" style={styles.brand}>
          <span style={styles.brandMark}>TA</span>

          <span>
            <strong style={styles.brandTitle}>
              TA-14 AI GOVERNANCE PLAYGROUND
            </strong>

            <small style={styles.brandSubtitle}>
              Governed Records Experience
            </small>
          </span>
        </Link>

        <nav style={styles.topNav}>
          <Link href="/workspace" style={styles.topNavLink}>
            Playground Home
          </Link>

          <Link
            href="/workspace/routes/new"
            style={styles.topNavLink}
          >
            AI Governance
          </Link>

          <Link
            href="/governed-record-interpreter"
            style={styles.topNavLink}
          >
            GRI™ Workspace
          </Link>
        </nav>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroGlowOne} />
        <div style={styles.heroGlowTwo} />

        <div style={styles.heroCopy}>
          <Link
            href="/workspace"
            style={styles.returnLink}
          >
            <span aria-hidden="true">←</span>
            Return to Playground Home
          </Link>

          <p style={styles.eyebrow}>
            GRI™ MODULE 01 · LIVE
          </p>

          <h1 style={styles.heroTitle}>
            ERI™ Environmental
            <br />
            Record Interpreter
          </h1>

          <p style={styles.heroText}>
            Environmental intelligence without evidentiary
            overreach. Examine atmospheric, personal, building,
            hospital, laboratory, HVAC, water, soil, land, and sensor
            records while preserving the exact boundary between what
            the record proves and what it cannot prove.
          </p>

          <div style={styles.heroTags}>
            <span style={styles.heroTag}>
              Source evidence preserved
            </span>

            <span style={styles.heroTag}>
              Uncertainty exposed
            </span>

            <span style={styles.heroTag}>
              Interpretation bounded
            </span>
          </div>
        </div>

        <aside style={styles.heroPanel}>
          <div style={styles.heroPanelHeader}>
            <div>
              <p style={styles.panelEyebrow}>
                CURRENT DEMONSTRATION
              </p>

              <h2 style={styles.panelTitle}>
                Healthcare Isolation Room 214
              </h2>
            </div>

            <span style={styles.holdBadge}>HOLD</span>
          </div>

          <dl style={styles.panelDetails}>
            <div style={styles.panelDetailRow}>
              <dt style={styles.panelTerm}>Source record</dt>
              <dd style={styles.panelValue}>
                {sourceRecordId}
              </dd>
            </div>

            <div style={styles.panelDetailRow}>
              <dt style={styles.panelTerm}>Covered period</dt>
              <dd style={styles.panelValue}>24 hours</dd>
            </div>

            <div style={styles.panelDetailRow}>
              <dt style={styles.panelTerm}>Module</dt>
              <dd style={styles.panelValue}>
                eri.atmospheric 1.1.0
              </dd>
            </div>

            <div style={styles.panelDetailRowLast}>
              <dt style={styles.panelTerm}>Ruleset</dt>
              <dd style={styles.panelValue}>
                eri-healthcare-air 1.0.0
              </dd>
            </div>
          </dl>

          <div style={styles.panelBoundary}>
            <span style={styles.panelBoundaryLabel}>
              BOUNDARY
            </span>

            <p style={styles.panelBoundaryText}>
              Interpretation is not diagnosis, authority,
              intervention, certification, or permission to execute.
            </p>
          </div>
        </aside>
      </section>

      <section style={styles.content}>
        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionEyebrow}>
                THIRTEEN-CHANNEL ATMOSPHERIC CORE
              </p>

              <h2 style={styles.sectionTitle}>
                Governed environmental state
              </h2>
            </div>

            <p style={styles.sectionDescription}>
              Measured and calculated channels remain distinct.
              Every value retains its source, unit, timestamp,
              location, uncertainty, and transformation lineage.
            </p>
          </div>

          <div style={styles.channelGrid}>
            {CHANNELS.map((channel) => {
              const active =
                channel.id === activeChannelId;

              const tone = channelTone(channel.status);

              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() =>
                    setActiveChannelId(channel.id)
                  }
                  style={{
                    ...styles.channelCard,
                    borderColor: active
                      ? '#67e8f9'
                      : tone.border,
                    background: active
                      ? 'rgba(56, 189, 248, 0.13)'
                      : tone.background,
                    boxShadow: active
                      ? '0 0 0 2px rgba(103, 232, 249, 0.14)'
                      : 'none',
                  }}
                >
                  <div style={styles.channelCardTop}>
                    <span style={styles.channelType}>
                      {channel.type}
                    </span>

                    <span
                      style={{
                        ...styles.channelStatus,
                        color: tone.color,
                        borderColor: tone.border,
                        background: tone.background,
                      }}
                    >
                      {channel.status}
                    </span>
                  </div>

                  <h3 style={styles.channelName}>
                    {channel.shortName}
                  </h3>

                  <p style={styles.channelValue}>
                    {channel.value}
                  </p>
                </button>
              );
            })}
          </div>

          <div style={styles.channelExplanation}>
            <div style={styles.explanationColumn}>
              <p style={styles.supportedEyebrow}>
                INTERPRETIVE ROLE
              </p>

              <h3 style={styles.explanationTitle}>
                {activeChannel.name}
              </h3>

              <p style={styles.explanationText}>
                {activeChannel.role}
              </p>
            </div>

            <div style={styles.explanationColumn}>
              <p style={styles.boundaryEyebrow}>
                REQUIRED BOUNDARY
              </p>

              <p style={styles.explanationText}>
                {activeChannel.boundary}
              </p>
            </div>
          </div>
        </section>

        <section style={styles.twoColumnGrid}>
          <article style={styles.card}>
            <p style={styles.sectionEyebrow}>
              ENVIRONMENTAL CHRONOLOGY
            </p>

            <h2 style={styles.sectionTitleSmall}>
              Detected event windows
            </h2>

            <div style={styles.eventList}>
              {EVENTS.map((event) => {
                const active =
                  event.id === activeEventId;

                const tone = stateTone(
                  event.classification,
                );

                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() =>
                      setActiveEventId(event.id)
                    }
                    style={{
                      ...styles.eventButton,
                      borderColor: active
                        ? '#67e8f9'
                        : 'rgba(148, 163, 184, 0.16)',
                      background: active
                        ? 'rgba(56, 189, 248, 0.10)'
                        : 'rgba(255, 255, 255, 0.025)',
                    }}
                  >
                    <div style={styles.eventButtonTop}>
                      <div>
                        <h3 style={styles.eventTitle}>
                          {event.title}
                        </h3>

                        <p style={styles.eventMeta}>
                          {event.start}–{event.end} ·{' '}
                          {event.id}
                        </p>
                      </div>

                      <span
                        style={{
                          ...styles.eventBadge,
                          color: tone.color,
                          background: tone.background,
                          borderColor: tone.border,
                        }}
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
          </article>

          <article style={styles.card}>
            <div style={styles.selectedEventHeader}>
              <div>
                <p style={styles.sectionEyebrow}>
                  SELECTED EVENT INTERPRETATION
                </p>

                <h2 style={styles.sectionTitleSmall}>
                  {activeEvent.title}
                </h2>
              </div>

              <span
                style={{
                  ...styles.selectedEventBadge,
                  color: activeEventTone.color,
                  background:
                    activeEventTone.background,
                  borderColor: activeEventTone.border,
                }}
              >
                {activeEvent.classification.replaceAll(
                  '_',
                  ' ',
                )}
              </span>
            </div>

            <div style={styles.findingGrid}>
              <div style={styles.supportedFinding}>
                <p style={styles.supportedEyebrow}>
                  SUPPORTED FINDING
                </p>

                <p style={styles.findingText}>
                  {activeEvent.finding}
                </p>
              </div>

              <div style={styles.limitationFinding}>
                <p style={styles.boundaryEyebrow}>
                  EVIDENTIARY LIMITATION
                </p>

                <p style={styles.findingText}>
                  {activeEvent.limitation}
                </p>
              </div>
            </div>

            <div style={styles.boundChannels}>
              <p style={styles.boundChannelsLabel}>
                BOUND CHANNELS
              </p>

              <div style={styles.boundChannelList}>
                {activeEvent.channels.map((channel) => (
                  <span
                    key={channel}
                    style={styles.boundChannel}
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section style={styles.twoColumnGrid}>
          <article style={styles.card}>
            <p style={styles.sectionEyebrow}>
              FIVE-LANE INTELLIGENCE MODEL
            </p>

            <h2 style={styles.sectionTitleSmall}>
              Environmental interpretation
            </h2>

            <div style={styles.laneList}>
              {FIVE_LANES.map((lane) => (
                <div
                  key={lane.title}
                  style={{
                    ...styles.laneCard,
                    background: lane.background,
                    borderColor: lane.border,
                  }}
                >
                  <span
                    style={{
                      ...styles.laneNumber,
                      color: lane.accent,
                    }}
                  >
                    {lane.number}
                  </span>

                  <div>
                    <h3 style={styles.laneTitle}>
                      {lane.title}
                    </h3>

                    <p style={styles.laneText}>
                      {lane.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <div style={styles.stack}>
            <article style={styles.card}>
              <p style={styles.sectionEyebrow}>
                BASELINE AND OUTCOME LOGIC
              </p>

              <h2 style={styles.sectionTitleSmall}>
                No invented baseline.
                <br />
                No assumed success.
              </h2>

              <dl style={styles.baselineList}>
                {BASELINE_ITEMS.map(([term, value]) => (
                  <div
                    key={term}
                    style={styles.baselineRow}
                  >
                    <dt style={styles.baselineTerm}>
                      {term}
                    </dt>

                    <dd style={styles.baselineValue}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>

            <article style={styles.boundaryCard}>
              <p style={styles.boundaryEyebrow}>
                NON-NEGOTIABLE BOUNDARY
              </p>

              <p style={styles.boundaryCardText}>
                This interpretation does not modify the source
                evidence, establish medical causation, issue a
                diagnosis, prescribe treatment, condemn equipment,
                determine liability, certify compliance, or
                authorize environmental intervention.
              </p>
            </article>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.girHeader}>
            <div>
              <p style={styles.sectionEyebrow}>
                GOVERNED INTERPRETATION RECORD
              </p>

              <h2 style={styles.sectionTitleSmall}>
                GIR™ environmental output
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowGir((value) => !value)
              }
              style={styles.girButton}
            >
              {showGir
                ? 'Hide GIR™ object'
                : 'Preview GIR™ object'}
            </button>
          </div>

          <div style={styles.girGrid}>
            <div style={styles.girSummaryCard}>
              <p style={styles.girSummaryLabel}>
                SOURCE BINDING
              </p>

              <p style={styles.girSummaryValue}>
                {sourceRecordId}
              </p>
            </div>

            {GIR_SUMMARY.map(([term, value]) => (
              <div
                key={term}
                style={styles.girSummaryCard}
              >
                <p style={styles.girSummaryLabel}>
                  {term}
                </p>

                <p style={styles.girSummaryValue}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {showGir && (
            <pre style={styles.girObject}>
{`{
  "gir_id": "GIR-ERI-DEMO-00014",
  "source_record_ids": ["${sourceRecordId}"],
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

        <section style={styles.returnSection}>
          <div>
            <p style={styles.sectionEyebrow}>
              CONTINUE EXPLORING
            </p>

            <h2 style={styles.returnTitle}>
              Return to the playground or open GRI™.
            </h2>
          </div>

          <div style={styles.returnActions}>
            <Link
              href="/workspace"
              style={styles.returnPrimary}
            >
              Playground Home
            </Link>

            <Link
              href="/governed-record-interpreter"
              style={styles.returnSecondary}
            >
              Open GRI™ Workspace
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    overflowX: 'hidden',
    background: '#06131d',
    color: '#f8fafc',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  topBar: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 18,
    padding: '15px clamp(20px, 4vw, 64px)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.14)',
    background: 'rgba(5, 18, 27, 0.94)',
    backdropFilter: 'blur(18px)',
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: '#f8fafc',
    textDecoration: 'none',
  },

  brandMark: {
    display: 'grid',
    placeItems: 'center',
    width: 42,
    height: 42,
    border: '1px solid rgba(103, 232, 249, 0.32)',
    borderRadius: 12,
    background: 'rgba(56, 189, 248, 0.08)',
    color: '#67e8f9',
    fontSize: 13,
    fontWeight: 900,
  },

  brandTitle: {
    display: 'block',
    fontSize: 12,
    letterSpacing: '0.1em',
  },

  brandSubtitle: {
    display: 'block',
    marginTop: 3,
    color: '#7f96a7',
    fontSize: 10,
    letterSpacing: '0.05em',
  },

  topNav: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },

  topNavLink: {
    padding: '9px 12px',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: 999,
    color: '#c5d4de',
    fontSize: 12,
    fontWeight: 750,
    textDecoration: 'none',
  },

  hero: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
    alignItems: 'center',
    gap: 48,
    padding:
      'clamp(62px, 8vw, 118px) clamp(22px, 6vw, 92px)',
    overflow: 'hidden',
    background:
      'linear-gradient(135deg, #071724 0%, #08232c 55%, #071c1a 100%)',
  },

  heroGlowOne: {
    position: 'absolute',
    top: '-35%',
    right: '-8%',
    width: 680,
    height: 680,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(45, 212, 191, 0.16), transparent 68%)',
    pointerEvents: 'none',
  },

  heroGlowTwo: {
    position: 'absolute',
    bottom: '-55%',
    left: '10%',
    width: 620,
    height: 620,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(56, 189, 248, 0.13), transparent 68%)',
    pointerEvents: 'none',
  },

  heroCopy: {
    position: 'relative',
    zIndex: 1,
  },

  returnLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 35,
    color: '#a5f3fc',
    fontSize: 13,
    fontWeight: 800,
    textDecoration: 'none',
  },

  eyebrow: {
    margin: 0,
    color: '#5eead4',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: '0.2em',
  },

  heroTitle: {
    margin: '20px 0 26px',
    fontSize: 'clamp(48px, 6.7vw, 92px)',
    lineHeight: 0.94,
    letterSpacing: '-0.065em',
  },

  heroText: {
    maxWidth: 820,
    margin: 0,
    color: '#a8bac7',
    fontSize: 'clamp(17px, 1.8vw, 21px)',
    lineHeight: 1.7,
  },

  heroTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 30,
  },

  heroTag: {
    padding: '8px 11px',
    border: '1px solid rgba(148, 163, 184, 0.16)',
    borderRadius: 999,
    color: '#9db2c0',
    fontSize: 11,
    fontWeight: 750,
  },

  heroPanel: {
    position: 'relative',
    zIndex: 1,
    padding: 27,
    border: '1px solid rgba(125, 211, 252, 0.2)',
    borderRadius: 24,
    background:
      'linear-gradient(145deg, rgba(15, 38, 51, 0.93), rgba(8, 24, 33, 0.9))',
    boxShadow: '0 30px 90px rgba(0, 0, 0, 0.28)',
  },

  heroPanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 18,
  },

  panelEyebrow: {
    margin: 0,
    color: '#7dd3fc',
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: '0.17em',
  },

  panelTitle: {
    margin: '10px 0 0',
    fontSize: 24,
    lineHeight: 1.15,
    letterSpacing: '-0.035em',
  },

  holdBadge: {
    padding: '7px 10px',
    border: '1px solid rgba(251, 191, 36, 0.3)',
    borderRadius: 999,
    background: 'rgba(251, 191, 36, 0.09)',
    color: '#fcd34d',
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: '0.09em',
  },

  panelDetails: {
    display: 'grid',
    gap: 0,
    margin: '24px 0 0',
  },

  panelDetailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 24,
    padding: '14px 0',
    borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
  },

  panelDetailRowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 24,
    padding: '14px 0',
  },

  panelTerm: {
    color: '#879cab',
    fontSize: 12,
  },

  panelValue: {
    margin: 0,
    color: '#e4edf2',
    fontSize: 12,
    fontWeight: 800,
    textAlign: 'right',
  },

  panelBoundary: {
    marginTop: 18,
    padding: 17,
    border: '1px solid rgba(251, 113, 133, 0.2)',
    borderRadius: 15,
    background: 'rgba(251, 113, 133, 0.06)',
  },

  panelBoundaryLabel: {
    color: '#fda4af',
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: '0.15em',
  },

  panelBoundaryText: {
    margin: '8px 0 0',
    color: '#b9c7d0',
    fontSize: 12,
    lineHeight: 1.6,
  },

  content: {
    display: 'grid',
    gap: 24,
    padding:
      'clamp(36px, 5vw, 72px) clamp(18px, 5vw, 78px) clamp(70px, 8vw, 120px)',
    background: '#07151e',
  },

  card: {
    padding: 'clamp(22px, 3vw, 32px)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: 24,
    background:
      'linear-gradient(145deg, rgba(13, 35, 46, 0.9), rgba(8, 25, 34, 0.92))',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.12)',
  },

  sectionHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 24,
  },

  sectionEyebrow: {
    margin: 0,
    color: '#67e8f9',
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: '0.18em',
  },

  sectionTitle: {
    margin: '10px 0 0',
    fontSize: 'clamp(30px, 4vw, 50px)',
    lineHeight: 1.04,
    letterSpacing: '-0.045em',
  },

  sectionTitleSmall: {
    margin: '10px 0 0',
    fontSize: 'clamp(27px, 3vw, 39px)',
    lineHeight: 1.08,
    letterSpacing: '-0.04em',
  },

  sectionDescription: {
    maxWidth: 650,
    margin: 0,
    color: '#8fa4b3',
    fontSize: 14,
    lineHeight: 1.7,
  },

  channelGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(170px, 1fr))',
    gap: 12,
    marginTop: 28,
  },

  channelCard: {
    minHeight: 150,
    padding: 16,
    border: '1px solid',
    borderRadius: 17,
    color: '#f8fafc',
    cursor: 'pointer',
    textAlign: 'left',
    font: 'inherit',
  },

  channelCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },

  channelType: {
    color: '#8298a8',
    fontSize: 9,
    fontWeight: 850,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },

  channelStatus: {
    padding: '5px 7px',
    border: '1px solid',
    borderRadius: 999,
    fontSize: 8,
    fontWeight: 900,
    letterSpacing: '0.08em',
  },

  channelName: {
    margin: '25px 0 0',
    fontSize: 16,
    letterSpacing: '-0.025em',
  },

  channelValue: {
    margin: '10px 0 0',
    color: '#d8e5ec',
    fontSize: 18,
    fontWeight: 850,
  },

  channelExplanation: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 18,
    marginTop: 22,
    padding: 22,
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: 18,
    background: 'rgba(3, 14, 22, 0.35)',
  },

  explanationColumn: {
    minWidth: 0,
  },

  supportedEyebrow: {
    margin: 0,
    color: '#6ee7b7',
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: '0.16em',
  },

  boundaryEyebrow: {
    margin: 0,
    color: '#fda4af',
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: '0.16em',
  },

  explanationTitle: {
    margin: '10px 0 0',
    fontSize: 20,
    letterSpacing: '-0.025em',
  },

  explanationText: {
    margin: '10px 0 0',
    color: '#a8bac7',
    fontSize: 14,
    lineHeight: 1.7,
  },

  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(min(100%, 390px), 1fr))',
    gap: 24,
  },

  eventList: {
    display: 'grid',
    gap: 11,
    marginTop: 24,
  },

  eventButton: {
    width: '100%',
    padding: 17,
    border: '1px solid',
    borderRadius: 16,
    color: '#f8fafc',
    cursor: 'pointer',
    textAlign: 'left',
    font: 'inherit',
  },

  eventButtonTop: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 14,
  },

  eventTitle: {
    margin: 0,
    fontSize: 16,
  },

  eventMeta: {
    margin: '7px 0 0',
    color: '#7f95a5',
    fontSize: 11,
  },

  eventBadge: {
    maxWidth: 180,
    padding: '6px 8px',
    border: '1px solid',
    borderRadius: 999,
    fontSize: 8,
    fontWeight: 900,
    letterSpacing: '0.07em',
    textAlign: 'center',
  },

  selectedEventHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 18,
  },

  selectedEventBadge: {
    padding: '7px 10px',
    border: '1px solid',
    borderRadius: 999,
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: '0.07em',
  },

  findingGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 14,
    marginTop: 25,
  },

  supportedFinding: {
    padding: 19,
    border: '1px solid rgba(52, 211, 153, 0.22)',
    borderRadius: 17,
    background: 'rgba(52, 211, 153, 0.07)',
  },

  limitationFinding: {
    padding: 19,
    border: '1px solid rgba(251, 113, 133, 0.22)',
    borderRadius: 17,
    background: 'rgba(251, 113, 133, 0.07)',
  },

  findingText: {
    margin: '11px 0 0',
    color: '#b4c3cd',
    fontSize: 14,
    lineHeight: 1.7,
  },

  boundChannels: {
    marginTop: 16,
    padding: 18,
    border: '1px solid rgba(148, 163, 184, 0.13)',
    borderRadius: 16,
    background: 'rgba(3, 14, 22, 0.28)',
  },

  boundChannelsLabel: {
    margin: 0,
    color: '#7f95a5',
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: '0.16em',
  },

  boundChannelList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },

  boundChannel: {
    padding: '7px 10px',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    borderRadius: 999,
    color: '#d2dee6',
    fontSize: 11,
    fontWeight: 800,
  },

  laneList: {
    display: 'grid',
    gap: 12,
    marginTop: 24,
  },

  laneCard: {
    display: 'grid',
    gridTemplateColumns: '38px minmax(0, 1fr)',
    gap: 15,
    padding: 18,
    border: '1px solid',
    borderRadius: 17,
  },

  laneNumber: {
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: '0.13em',
  },

  laneTitle: {
    margin: 0,
    fontSize: 15,
  },

  laneText: {
    margin: '8px 0 0',
    color: '#b2c1cb',
    fontSize: 13,
    lineHeight: 1.68,
  },

  stack: {
    display: 'grid',
    gap: 24,
  },

  baselineList: {
    display: 'grid',
    gap: 0,
    margin: '22px 0 0',
  },

  baselineRow: {
    padding: '13px 0',
    borderBottom: '1px solid rgba(148, 163, 184, 0.11)',
  },

  baselineTerm: {
    color: '#7f95a5',
    fontSize: 11,
    fontWeight: 800,
  },

  baselineValue: {
    margin: '6px 0 0',
    color: '#d4e0e7',
    fontSize: 13,
    lineHeight: 1.55,
  },

  boundaryCard: {
    padding: 'clamp(22px, 3vw, 30px)',
    border: '1px solid rgba(251, 113, 133, 0.24)',
    borderRadius: 24,
    background:
      'linear-gradient(145deg, rgba(73, 26, 37, 0.52), rgba(34, 17, 25, 0.52))',
  },

  boundaryCardText: {
    margin: '14px 0 0',
    color: '#d8bec5',
    fontSize: 15,
    lineHeight: 1.75,
  },

  girHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 18,
  },

  girButton: {
    padding: '12px 16px',
    border: 0,
    borderRadius: 999,
    background:
      'linear-gradient(90deg, #67e8f9 0%, #34d399 100%)',
    color: '#04151b',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: 12,
    fontWeight: 900,
  },

  girGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
    marginTop: 25,
  },

  girSummaryCard: {
    padding: 16,
    border: '1px solid rgba(148, 163, 184, 0.13)',
    borderRadius: 15,
    background: 'rgba(3, 14, 22, 0.3)',
  },

  girSummaryLabel: {
    margin: 0,
    color: '#7f95a5',
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: '0.13em',
  },

  girSummaryValue: {
    margin: '9px 0 0',
    overflowWrap: 'anywhere',
    color: '#e1ebf0',
    fontSize: 12,
    fontWeight: 800,
  },

  girObject: {
    margin: '22px 0 0',
    padding: 20,
    overflowX: 'auto',
    border: '1px solid rgba(103, 232, 249, 0.14)',
    borderRadius: 17,
    background: '#020a10',
    color: '#b8d6df',
    fontSize: 11,
    lineHeight: 1.75,
  },

  returnSection: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 28,
    padding: 'clamp(25px, 4vw, 38px)',
    border: '1px solid rgba(94, 234, 212, 0.18)',
    borderRadius: 24,
    background:
      'linear-gradient(135deg, rgba(45, 212, 191, 0.10), rgba(56, 189, 248, 0.06))',
  },

  returnTitle: {
    maxWidth: 680,
    margin: '10px 0 0',
    fontSize: 'clamp(27px, 3vw, 42px)',
    lineHeight: 1.08,
    letterSpacing: '-0.04em',
  },

  returnActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 11,
  },

  returnPrimary: {
    display: 'inline-flex',
    justifyContent: 'center',
    padding: '13px 18px',
    borderRadius: 999,
    background:
      'linear-gradient(90deg, #67e8f9 0%, #34d399 100%)',
    color: '#04151b',
    fontSize: 12,
    fontWeight: 900,
    textDecoration: 'none',
  },

  returnSecondary: {
    display: 'inline-flex',
    justifyContent: 'center',
    padding: '12px 18px',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: 999,
    color: '#d5e1e8',
    fontSize: 12,
    fontWeight: 850,
    textDecoration: 'none',
  },
};
