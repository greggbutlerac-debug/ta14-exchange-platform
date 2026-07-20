'use client';

import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
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

type ChannelStatus = 'NORMAL' | 'WATCH' | 'EXCURSION' | 'MISSING';

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
      'CO₂ is not a universal indoor-air-quality score.',
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

const FIVE_LANES = [
  {
    title: 'What the record proves',
    body:
      'Pressure performance weakened during three bounded intervals, and two intervals overlapped with increased particulate concentration.',
  },
  {
    title: 'What the record may indicate',
    body:
      'The pressure and particulate pattern may be consistent with migration or infiltration, but source and pathway are not established.',
  },
  {
    title: 'What the record cannot prove',
    body:
      'The record does not establish infection transmission, occupant harm, negligence, equipment failure, or legal noncompliance.',
  },
  {
    title: 'Missing evidence',
    body:
      'Door-state history, current calibration documentation, verified reference-pressure location, and room-use declarations are incomplete.',
  },
  {
    title: 'Recommended next evidence pathway',
    body:
      'Obtain the missing records, extend observation, verify the pressure reference, and route the GIR™ to the designated facility reviewer.',
  },
];

function tone(status: ChannelStatus) {
  if (status === 'NORMAL') return { color: '#6ee7b7', border: 'rgba(52,211,153,.3)' };
  if (status === 'WATCH') return { color: '#fcd34d', border: 'rgba(251,191,36,.3)' };
  if (status === 'EXCURSION') return { color: '#fda4af', border: 'rgba(251,113,133,.3)' };
  return { color: '#cbd5e1', border: 'rgba(148,163,184,.3)' };
}

function EnvironmentalRecordInterpreterContent() {
  const searchParams = useSearchParams();
  const sourceRecordId = searchParams.get('record') || 'AIR-DEMO-014';

  const [activeChannelId, setActiveChannelId] = useState('pressure');
  const [activeEventId, setActiveEventId] = useState('EVT-001');
  const [showGir, setShowGir] = useState(false);

  const activeChannel = useMemo(
    () => CHANNELS.find((channel) => channel.id === activeChannelId) ?? CHANNELS[0],
    [activeChannelId],
  );

  const activeEvent = useMemo(
    () => EVENTS.find((event) => event.id === activeEventId) ?? EVENTS[0],
    [activeEventId],
  );

  return (
    <main style={styles.page}>
      <header style={styles.topBar}>
        <Link href="/workspace" style={styles.brand}>
          <span style={styles.brandMark}>TA</span>
          <span>
            <strong style={styles.brandTitle}>TA-14 AI GOVERNANCE PLAYGROUND</strong>
            <small style={styles.brandSubtitle}>Governed Records Experience</small>
          </span>
        </Link>

        <nav style={styles.nav}>
          <Link href="/workspace" style={styles.navLink}>Playground Home</Link>
          <Link href="/workspace/routes/new" style={styles.navLink}>AI Governance</Link>
          <Link href="/governed-record-interpreter" style={styles.navLink}>GRI™ Workspace</Link>
        </nav>
      </header>

      <section style={styles.hero}>
        <div>
          <Link href="/workspace" style={styles.backLink}>← Return to Playground Home</Link>
          <p style={styles.eyebrow}>GRI™ MODULE 01 · LIVE</p>
          <h1 style={styles.heroTitle}>ERI™ Environmental Record Interpreter</h1>
          <p style={styles.heroText}>
            Environmental intelligence without evidentiary overreach. Examine environmental
            records while preserving the exact boundary between what the record proves and
            what it cannot prove.
          </p>
        </div>

        <aside style={styles.heroPanel}>
          <div style={styles.panelTop}>
            <div>
              <p style={styles.panelLabel}>CURRENT DEMONSTRATION</p>
              <h2 style={styles.panelTitle}>Healthcare Isolation Room 214</h2>
            </div>
            <span style={styles.holdBadge}>HOLD</span>
          </div>

          <dl style={styles.details}>
            <div style={styles.detailRow}><dt>Source record</dt><dd>{sourceRecordId}</dd></div>
            <div style={styles.detailRow}><dt>Covered period</dt><dd>24 hours</dd></div>
            <div style={styles.detailRow}><dt>Module</dt><dd>eri.atmospheric 1.1.0</dd></div>
            <div style={styles.detailRow}><dt>Ruleset</dt><dd>eri-healthcare-air 1.0.0</dd></div>
          </dl>
        </aside>
      </section>

      <section style={styles.content}>
        <article style={styles.card}>
          <p style={styles.eyebrow}>THIRTEEN-CHANNEL ATMOSPHERIC CORE</p>
          <h2 style={styles.sectionTitle}>Governed environmental state</h2>

          <div style={styles.channelGrid}>
            {CHANNELS.map((channel) => {
              const selected = channel.id === activeChannelId;
              const channelTone = tone(channel.status);

              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => setActiveChannelId(channel.id)}
                  style={{
                    ...styles.channel,
                    borderColor: selected ? '#67e8f9' : channelTone.border,
                    boxShadow: selected ? '0 0 0 2px rgba(103,232,249,.18)' : 'none',
                  }}
                >
                  <div style={styles.channelTop}>
                    <span style={styles.channelType}>{channel.type}</span>
                    <span style={{ ...styles.status, color: channelTone.color }}>
                      {channel.status}
                    </span>
                  </div>
                  <h3 style={styles.channelName}>{channel.shortName}</h3>
                  <p style={styles.channelValue}>{channel.value}</p>
                </button>
              );
            })}
          </div>

          <div style={styles.boundaryGrid}>
            <div>
              <p style={styles.supportedLabel}>INTERPRETIVE ROLE</p>
              <h3>{activeChannel.name}</h3>
              <p style={styles.bodyText}>{activeChannel.role}</p>
            </div>
            <div>
              <p style={styles.limitLabel}>REQUIRED BOUNDARY</p>
              <p style={styles.bodyText}>{activeChannel.boundary}</p>
            </div>
          </div>
        </article>

        <section style={styles.twoCol}>
          <article style={styles.card}>
            <p style={styles.eyebrow}>ENVIRONMENTAL CHRONOLOGY</p>
            <h2 style={styles.sectionTitle}>Detected event windows</h2>

            <div style={styles.eventList}>
              {EVENTS.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setActiveEventId(event.id)}
                  style={{
                    ...styles.eventButton,
                    borderColor: event.id === activeEventId
                      ? '#67e8f9'
                      : 'rgba(148,163,184,.18)',
                  }}
                >
                  <strong>{event.title}</strong>
                  <span style={styles.eventMeta}>
                    {event.start}–{event.end} · {event.id}
                  </span>
                </button>
              ))}
            </div>
          </article>

          <article style={styles.card}>
            <p style={styles.eyebrow}>SELECTED EVENT INTERPRETATION</p>
            <h2 style={styles.sectionTitle}>{activeEvent.title}</h2>

            <div style={styles.findingGrid}>
              <div style={styles.supportedBox}>
                <p style={styles.supportedLabel}>SUPPORTED FINDING</p>
                <p style={styles.bodyText}>{activeEvent.finding}</p>
              </div>
              <div style={styles.limitBox}>
                <p style={styles.limitLabel}>EVIDENTIARY LIMITATION</p>
                <p style={styles.bodyText}>{activeEvent.limitation}</p>
              </div>
            </div>

            <div style={styles.boundChannels}>
              {activeEvent.channels.map((channel) => (
                <span key={channel} style={styles.pill}>{channel}</span>
              ))}
            </div>
          </article>
        </section>

        <section style={styles.twoCol}>
          <article style={styles.card}>
            <p style={styles.eyebrow}>FIVE-LANE INTELLIGENCE MODEL</p>
            <h2 style={styles.sectionTitle}>Environmental interpretation</h2>

            <div style={styles.laneList}>
              {FIVE_LANES.map((lane, index) => (
                <div key={lane.title} style={styles.lane}>
                  <span style={styles.laneNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 style={styles.laneTitle}>{lane.title}</h3>
                    <p style={styles.bodyText}>{lane.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article style={styles.card}>
            <p style={styles.eyebrow}>BASELINE AND OUTCOME LOGIC</p>
            <h2 style={styles.sectionTitle}>No invented baseline. No assumed success.</h2>

            <dl style={styles.baselineList}>
              {[
                ['Baseline window', '06:00–08:00 / occupied / negative-pressure mode'],
                ['Baseline support', 'Qualified — outdoor reference and door-state incomplete'],
                ['Event trigger', 'Pressure below declared contextual threshold'],
                ['Persistence rule', 'Continuous or recurrent duration greater than ten minutes'],
                ['Post-intervention record', 'Not yet supplied'],
                ['Outcome state', 'HOLD — performance restoration not established'],
              ].map(([term, value]) => (
                <div key={term} style={styles.detailRow}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <div style={styles.nonNegotiable}>
              <p style={styles.limitLabel}>NON-NEGOTIABLE BOUNDARY</p>
              <p style={styles.bodyText}>
                This interpretation does not modify source evidence, establish medical
                causation, issue a diagnosis, prescribe treatment, determine liability,
                certify compliance, or authorize environmental intervention.
              </p>
            </div>
          </article>
        </section>

        <article style={styles.card}>
          <div style={styles.girHeader}>
            <div>
              <p style={styles.eyebrow}>GOVERNED INTERPRETATION RECORD</p>
              <h2 style={styles.sectionTitle}>GIR™ environmental output</h2>
            </div>

            <button
              type="button"
              onClick={() => setShowGir((value) => !value)}
              style={styles.primaryButton}
            >
              {showGir ? 'Hide GIR™ object' : 'Preview GIR™ object'}
            </button>
          </div>

          <div style={styles.girGrid}>
            {[
              ['GIR ID', 'GIR-ERI-DEMO-00014'],
              ['Source binding', sourceRecordId],
              ['Decision state', 'HOLD'],
              ['Interpretation class', 'COMPOUND EVENT'],
              ['Engine', 'gri-core 0.1.0'],
              ['Module', 'eri.atmospheric 1.1.0'],
              ['Ruleset', 'eri-healthcare-air 1.0.0'],
              ['Replay', 'EXPLANATORY READY'],
            ].map(([term, value]) => (
              <div key={term} style={styles.summaryCard}>
                <p style={styles.summaryLabel}>{term}</p>
                <p style={styles.summaryValue}>{value}</p>
              </div>
            ))}
          </div>

          {showGir && (
            <pre style={styles.pre}>
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
        </article>
      </section>
    </main>
  );
}

function EriLoadingState() {
  return (
    <main style={styles.loadingPage}>
      <div style={styles.loadingCard}>
        <p style={styles.eyebrow}>TA-14 AI GOVERNANCE PLAYGROUND</p>
        <h1 style={styles.loadingTitle}>Loading ERI™</h1>
        <p style={styles.bodyText}>Preparing the governed environmental record experience.</p>
      </div>
    </main>
  );
}

export default function EnvironmentalRecordInterpreterPage() {
  return (
    <Suspense fallback={<EriLoadingState />}>
      <EnvironmentalRecordInterpreterContent />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
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
    borderBottom: '1px solid rgba(148,163,184,.14)',
    background: 'rgba(5,18,27,.94)',
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
    border: '1px solid rgba(103,232,249,.32)',
    borderRadius: 12,
    color: '#67e8f9',
    fontSize: 13,
    fontWeight: 900,
  },
  brandTitle: {
    display: 'block',
    fontSize: 12,
    letterSpacing: '.1em',
  },
  brandSubtitle: {
    display: 'block',
    marginTop: 3,
    color: '#7f96a7',
    fontSize: 10,
  },
  nav: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },
  navLink: {
    padding: '9px 12px',
    border: '1px solid rgba(148,163,184,.15)',
    borderRadius: 999,
    color: '#c5d4de',
    fontSize: 12,
    fontWeight: 750,
    textDecoration: 'none',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
    alignItems: 'center',
    gap: 48,
    padding: 'clamp(62px, 8vw, 118px) clamp(22px, 6vw, 92px)',
    background: 'linear-gradient(135deg, #071724 0%, #08232c 55%, #071c1a 100%)',
  },
  backLink: {
    display: 'inline-flex',
    marginBottom: 32,
    color: '#a5f3fc',
    fontSize: 13,
    fontWeight: 800,
    textDecoration: 'none',
  },
  eyebrow: {
    margin: 0,
    color: '#5eead4',
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: '.18em',
  },
  heroTitle: {
    margin: '18px 0 24px',
    fontSize: 'clamp(48px, 6.5vw, 90px)',
    lineHeight: .95,
    letterSpacing: '-.06em',
  },
  heroText: {
    maxWidth: 780,
    margin: 0,
    color: '#a8bac7',
    fontSize: 'clamp(17px, 1.8vw, 21px)',
    lineHeight: 1.7,
  },
  heroPanel: {
    padding: 27,
    border: '1px solid rgba(125,211,252,.2)',
    borderRadius: 24,
    background: 'rgba(10,29,39,.92)',
  },
  panelTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 18,
  },
  panelLabel: {
    margin: 0,
    color: '#7dd3fc',
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: '.16em',
  },
  panelTitle: {
    margin: '10px 0 0',
    fontSize: 24,
  },
  holdBadge: {
    alignSelf: 'flex-start',
    padding: '7px 10px',
    border: '1px solid rgba(251,191,36,.3)',
    borderRadius: 999,
    color: '#fcd34d',
    fontSize: 10,
    fontWeight: 900,
  },
  details: {
    display: 'grid',
    margin: '22px 0 0',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 22,
    padding: '13px 0',
    borderBottom: '1px solid rgba(148,163,184,.12)',
    color: '#a8bac7',
    fontSize: 12,
  },
  content: {
    display: 'grid',
    gap: 24,
    padding: 'clamp(36px, 5vw, 72px) clamp(18px, 5vw, 78px) clamp(70px, 8vw, 120px)',
  },
  card: {
    padding: 'clamp(22px, 3vw, 32px)',
    border: '1px solid rgba(148,163,184,.15)',
    borderRadius: 24,
    background: 'linear-gradient(145deg, rgba(13,35,46,.9), rgba(8,25,34,.92))',
  },
  sectionTitle: {
    margin: '10px 0 0',
    fontSize: 'clamp(28px, 3.4vw, 46px)',
    lineHeight: 1.05,
    letterSpacing: '-.045em',
  },
  channelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: 12,
    marginTop: 28,
  },
  channel: {
    minHeight: 145,
    padding: 16,
    border: '1px solid',
    borderRadius: 17,
    background: 'rgba(255,255,255,.025)',
    color: '#f8fafc',
    cursor: 'pointer',
    textAlign: 'left',
    font: 'inherit',
  },
  channelTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
  },
  channelType: {
    color: '#8298a8',
    fontSize: 9,
    fontWeight: 850,
    textTransform: 'uppercase',
  },
  status: {
    fontSize: 8,
    fontWeight: 900,
  },
  channelName: {
    margin: '24px 0 0',
    fontSize: 16,
  },
  channelValue: {
    margin: '10px 0 0',
    color: '#d8e5ec',
    fontSize: 18,
    fontWeight: 850,
  },
  boundaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 18,
    marginTop: 22,
    padding: 22,
    border: '1px solid rgba(148,163,184,.15)',
    borderRadius: 18,
    background: 'rgba(3,14,22,.35)',
  },
  supportedLabel: {
    margin: 0,
    color: '#6ee7b7',
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: '.14em',
  },
  limitLabel: {
    margin: 0,
    color: '#fda4af',
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: '.14em',
  },
  bodyText: {
    color: '#a8bac7',
    fontSize: 14,
    lineHeight: 1.7,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 390px), 1fr))',
    gap: 24,
  },
  eventList: {
    display: 'grid',
    gap: 11,
    marginTop: 24,
  },
  eventButton: {
    display: 'grid',
    gap: 7,
    padding: 17,
    border: '1px solid',
    borderRadius: 16,
    background: 'rgba(255,255,255,.025)',
    color: '#f8fafc',
    cursor: 'pointer',
    textAlign: 'left',
    font: 'inherit',
  },
  eventMeta: {
    color: '#7f95a5',
    fontSize: 11,
  },
  findingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 14,
    marginTop: 24,
  },
  supportedBox: {
    padding: 19,
    border: '1px solid rgba(52,211,153,.22)',
    borderRadius: 17,
    background: 'rgba(52,211,153,.07)',
  },
  limitBox: {
    padding: 19,
    border: '1px solid rgba(251,113,133,.22)',
    borderRadius: 17,
    background: 'rgba(251,113,133,.07)',
  },
  boundChannels: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  pill: {
    padding: '7px 10px',
    border: '1px solid rgba(148,163,184,.18)',
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
  lane: {
    display: 'grid',
    gridTemplateColumns: '38px minmax(0, 1fr)',
    gap: 15,
    padding: 18,
    border: '1px solid rgba(148,163,184,.16)',
    borderRadius: 17,
    background: 'rgba(255,255,255,.025)',
  },
  laneNumber: {
    color: '#67e8f9',
    fontSize: 10,
    fontWeight: 900,
  },
  laneTitle: {
    margin: 0,
    fontSize: 15,
  },
  baselineList: {
    display: 'grid',
    marginTop: 22,
  },
  nonNegotiable: {
    marginTop: 22,
    padding: 19,
    border: '1px solid rgba(251,113,133,.22)',
    borderRadius: 17,
    background: 'rgba(251,113,133,.07)',
  },
  girHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 18,
  },
  primaryButton: {
    padding: '12px 16px',
    border: 0,
    borderRadius: 999,
    background: 'linear-gradient(90deg, #67e8f9 0%, #34d399 100%)',
    color: '#04151b',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: 12,
    fontWeight: 900,
  },
  girGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
    marginTop: 25,
  },
  summaryCard: {
    padding: 16,
    border: '1px solid rgba(148,163,184,.13)',
    borderRadius: 15,
    background: 'rgba(3,14,22,.3)',
  },
  summaryLabel: {
    margin: 0,
    color: '#7f95a5',
    fontSize: 9,
    fontWeight: 900,
    textTransform: 'uppercase',
  },
  summaryValue: {
    margin: '9px 0 0',
    overflowWrap: 'anywhere',
    color: '#e1ebf0',
    fontSize: 12,
    fontWeight: 800,
  },
  pre: {
    margin: '22px 0 0',
    padding: 20,
    overflowX: 'auto',
    border: '1px solid rgba(103,232,249,.14)',
    borderRadius: 17,
    background: '#020a10',
    color: '#b8d6df',
    fontSize: 11,
    lineHeight: 1.75,
  },
  loadingPage: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: '#06131d',
    color: '#f8fafc',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  loadingCard: {
    maxWidth: 560,
    padding: 32,
    border: '1px solid rgba(103,232,249,.2)',
    borderRadius: 24,
    background: 'rgba(8,29,40,.92)',
  },
  loadingTitle: {
    margin: '12px 0',
    fontSize: 42,
    letterSpacing: '-.04em',
  },
};
