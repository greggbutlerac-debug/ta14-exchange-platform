'use client';

import { useMemo, useState } from 'react';

type Channel = {
  id: string;
  label: string;
  group: 'Psychrometrics' | 'Atmospheric' | 'Expandable';
  unit: string;
  value: string;
  source: string;
  qualified: boolean;
  required: boolean;
};

const initialChannels: Channel[] = [
  { id: 'dry-bulb', label: 'Dry-bulb temperature', group: 'Psychrometrics', unit: '°F', value: '72.0', source: 'SENSOR-TEMP-01', qualified: true, required: true },
  { id: 'wet-bulb', label: 'Wet-bulb temperature', group: 'Psychrometrics', unit: '°F', value: '60.1', source: 'CALCULATED-PSYCH-01', qualified: true, required: true },
  { id: 'rh', label: 'Relative humidity', group: 'Psychrometrics', unit: '%', value: '48.0', source: 'SENSOR-RH-01', qualified: true, required: true },
  { id: 'dew-point', label: 'Dew point', group: 'Psychrometrics', unit: '°F', value: '51.2', source: 'CALCULATED-PSYCH-01', qualified: true, required: true },
  { id: 'enthalpy', label: 'Enthalpy', group: 'Psychrometrics', unit: 'Btu/lb', value: '27.3', source: 'CALCULATED-PSYCH-01', qualified: true, required: true },
  { id: 'humidity-ratio', label: 'Humidity ratio', group: 'Psychrometrics', unit: 'gr/lb', value: '58.4', source: 'CALCULATED-PSYCH-01', qualified: true, required: true },
  { id: 'specific-volume', label: 'Specific volume', group: 'Psychrometrics', unit: 'ft³/lb', value: '13.5', source: 'CALCULATED-PSYCH-01', qualified: true, required: true },
  { id: 'pressure', label: 'Differential pressure', group: 'Atmospheric', unit: 'Pa', value: '-2.5', source: 'SENSOR-DP-01', qualified: true, required: true },
  { id: 'voc', label: 'Total VOC', group: 'Atmospheric', unit: 'ppb', value: '180', source: 'SENSOR-VOC-01', qualified: true, required: true },
  { id: 'radon', label: 'Radon', group: 'Atmospheric', unit: 'pCi/L', value: '1.1', source: 'SENSOR-RADON-01', qualified: true, required: true },
  { id: 'pm', label: 'Particulate matter PM2.5', group: 'Atmospheric', unit: 'µg/m³', value: '6', source: 'SENSOR-PM-01', qualified: true, required: true },
  { id: 'sound', label: 'Sound pressure level', group: 'Atmospheric', unit: 'dBA', value: '43', source: 'METER-SPL-01', qualified: true, required: true },
  { id: 'co2', label: 'Carbon dioxide', group: 'Atmospheric', unit: 'ppm', value: '690', source: 'SENSOR-CO2-01', qualified: true, required: true },
  { id: 'co', label: 'Carbon monoxide', group: 'Expandable', unit: 'ppm', value: '0', source: 'SENSOR-CO-01', qualified: true, required: false },
  { id: 'ozone', label: 'Ozone', group: 'Expandable', unit: 'ppb', value: '12', source: 'SENSOR-O3-01', qualified: false, required: false },
  { id: 'formaldehyde', label: 'Formaldehyde', group: 'Expandable', unit: 'ppb', value: '18', source: 'SENSOR-HCHO-01', qualified: false, required: false },
];

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

function makeHash(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0').toUpperCase();
}

export default function AtmosphericIntegrityRecordBuilderPage() {
  const [spaceName, setSpaceName] = useState('Critical Environment Demo Room');
  const [activity, setActivity] = useState('Environmental validity assessment');
  const [consequenceClass, setConsequenceClass] = useState('C4');
  const [timeWindow, setTimeWindow] = useState('30 minutes');
  const [authority, setAuthority] = useState('Facility Environmental Authority');
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [decision, setDecision] = useState<'DRAFT' | 'HOLD' | 'ALLOW'>('DRAFT');
  const [recordId, setRecordId] = useState('');
  const [recordHash, setRecordHash] = useState('');
  const [preserved, setPreserved] = useState(false);

  const requiredChannels = channels.filter((channel) => channel.required);
  const unqualifiedRequired = requiredChannels.filter((channel) => !channel.qualified);
  const completedRequired = requiredChannels.filter(
    (channel) => channel.value.trim() && channel.source.trim(),
  );
  const completion = Math.round(
    (completedRequired.length / requiredChannels.length) * 100,
  );

  const groupedChannels = useMemo(
    () => ({
      Psychrometrics: channels.filter((channel) => channel.group === 'Psychrometrics'),
      Atmospheric: channels.filter((channel) => channel.group === 'Atmospheric'),
      Expandable: channels.filter((channel) => channel.group === 'Expandable'),
    }),
    [channels],
  );

  function updateChannel(
    id: string,
    patch: Partial<Pick<Channel, 'value' | 'source' | 'qualified' | 'required'>>,
  ) {
    setChannels((current) =>
      current.map((channel) =>
        channel.id === id ? { ...channel, ...patch } : channel,
      ),
    );
    setDecision('DRAFT');
    setPreserved(false);
  }

  function evaluateRecord() {
    const hasCoreFields =
      spaceName.trim() &&
      activity.trim() &&
      consequenceClass.trim() &&
      timeWindow.trim() &&
      authority.trim();

    const allRequiredComplete =
      completedRequired.length === requiredChannels.length;

    if (!hasCoreFields || !allRequiredComplete || unqualifiedRequired.length > 0) {
      setDecision('HOLD');
      setPreserved(false);
      return;
    }

    setDecision('ALLOW');
    setPreserved(false);
  }

  function preserveRecord() {
    if (decision !== 'ALLOW') return;

    const id = makeId('TA-14-AIR');
    const payload = [
      id,
      spaceName,
      activity,
      consequenceClass,
      timeWindow,
      authority,
      channels
        .filter((channel) => channel.required)
        .map((channel) => `${channel.id}:${channel.value}:${channel.source}`)
        .join('|'),
    ].join('::');

    setRecordId(id);
    setRecordHash(makeHash(payload));
    setPreserved(true);
  }

  return (
    <main style={{ minHeight: '100vh', background: '#03060b', color: '#f5f9ff', padding: '32px' }}>
      <div style={{ width: 'min(1220px, 100%)', margin: '0 auto' }}>
        <a href="/built-environment" style={{ color: '#54e8ff', textDecoration: 'none', fontWeight: 800 }}>
          ← Built Environment Exchange
        </a>

        <p style={{ color: '#54e8ff', letterSpacing: '.18em', fontSize: 12, fontWeight: 900, marginTop: 34 }}>
          BUILD 3 · ATMOSPHERIC INTEGRITY RECORD
        </p>

        <h1 style={{ fontSize: 'clamp(44px, 7vw, 82px)', lineHeight: .98, letterSpacing: '-.05em', margin: '14px 0 18px' }}>
          Create a bounded Atmospheric Integrity Record.
        </h1>

        <p style={{ maxWidth: 900, color: '#aebfd0', fontSize: 18, lineHeight: 1.7 }}>
          Declare the place, activity, consequence, evidence purpose, physical boundary, time window, authority,
          qualified measurements, intervention, and outcome before preserving the record.
        </p>

        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, .8fr) minmax(0, 1.2fr)', gap: 22, alignItems: 'start', marginTop: 36 }}>
          <aside style={{ position: 'sticky', top: 24, padding: 24, borderRadius: 24, border: '1px solid rgba(114,177,232,.18)', background: 'rgba(8,18,30,.9)' }}>
            <h2>AIR Context</h2>

            {[
              ['Declared space', spaceName, setSpaceName],
              ['Declared activity', activity, setActivity],
              ['Time boundary', timeWindow, setTimeWindow],
              ['Named authority', authority, setAuthority],
            ].map(([label, value, setter]) => (
              <label key={label as string} style={{ display: 'block', marginTop: 14, color: '#93a8bd', fontSize: 12, fontWeight: 800 }}>
                {label as string}
                <input
                  value={value as string}
                  onChange={(event) => {
                    (setter as React.Dispatch<React.SetStateAction<string>>)(event.target.value);
                    setDecision('DRAFT');
                    setPreserved(false);
                  }}
                  style={{ width: '100%', minHeight: 44, marginTop: 7, borderRadius: 12, border: '1px solid rgba(255,255,255,.1)', background: '#07101a', color: 'white', padding: '0 12px' }}
                />
              </label>
            ))}

            <label style={{ display: 'block', marginTop: 14, color: '#93a8bd', fontSize: 12, fontWeight: 800 }}>
              Consequence class
              <select
                value={consequenceClass}
                onChange={(event) => {
                  setConsequenceClass(event.target.value);
                  setDecision('DRAFT');
                  setPreserved(false);
                }}
                style={{ width: '100%', minHeight: 44, marginTop: 7, borderRadius: 12, border: '1px solid rgba(255,255,255,.1)', background: '#07101a', color: 'white', padding: '0 12px' }}
              >
                <option value="C1">C1 · Informational</option>
                <option value="C2">C2 · Operational</option>
                <option value="C3">C3 · Business / financial</option>
                <option value="C4">C4 · Health / safety</option>
                <option value="C5">C5 · Critical / life-safety</option>
              </select>
            </label>

            <div style={{ marginTop: 22, padding: 18, borderRadius: 16, border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.03)' }}>
              <div style={{ fontSize: 46, fontWeight: 950, color: decision === 'HOLD' ? '#ffd46a' : decision === 'ALLOW' ? '#39f2a1' : '#54e8ff' }}>
                {decision}
              </div>
              <p style={{ color: '#93a8bd', lineHeight: 1.55 }}>
                Required channels: {requiredChannels.length}<br />
                Completion: {completion}%<br />
                Unqualified required: {unqualifiedRequired.length}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <button onClick={evaluateRecord} style={buttonStyle('#54e8ff', '#39f2a1')}>
                  Evaluate AIR
                </button>
                {decision === 'ALLOW' && (
                  <button onClick={preserveRecord} style={buttonStyle('#ffd46a', '#ffb95f')}>
                    Preserve Record
                  </button>
                )}
              </div>
            </div>
          </aside>

          <div style={{ display: 'grid', gap: 18 }}>
            <ChannelGroup title="Seven Psychrometrics" channels={groupedChannels.Psychrometrics} onChange={updateChannel} />
            <ChannelGroup title="Primary Atmospheric Channels" channels={groupedChannels.Atmospheric} onChange={updateChannel} />
            <ChannelGroup title="Expandable Evidence" channels={groupedChannels.Expandable} onChange={updateChannel} />

            {preserved && (
              <section style={{ padding: 24, borderRadius: 22, border: '1px solid rgba(57,242,161,.26)', background: 'linear-gradient(145deg, rgba(57,242,161,.08), rgba(43,156,255,.06))' }}>
                <p style={{ color: '#39f2a1', letterSpacing: '.14em', fontSize: 11, fontWeight: 900 }}>
                  GOVERNED DEMONSTRATION RECORD
                </p>
                <h2>Atmospheric Integrity Record Preserved</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                  {[
                    ['Record ID', recordId],
                    ['Decision', 'ALLOW'],
                    ['Manifest hash', recordHash],
                    ['Declared space', spaceName],
                    ['Authority', authority],
                    ['Time boundary', timeWindow],
                    ['Consequence', consequenceClass],
                    ['Evidence channels', String(requiredChannels.length)],
                    ['Proof boundary', 'Bounded AIR demonstration only; no universal safety or compliance claim.'],
                  ].map(([label, value]) => (
                    <div key={label} style={{ minHeight: 88, padding: 13, borderRadius: 13, border: '1px solid rgba(255,255,255,.07)', background: 'rgba(3,8,14,.5)' }}>
                      <small style={{ display: 'block', color: '#93a8bd', marginBottom: 7 }}>{label}</small>
                      <strong style={{ wordBreak: 'break-word' }}>{value}</strong>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>

        <p style={{ color: '#93a8bd', marginTop: 44, lineHeight: 1.65 }}>
          A measurement becomes governed evidence only when its source, identity, qualification, timestamp,
          location, purpose, relationship, limitations, and time boundary remain visible.
        </p>
        <p style={{ color: '#f5f9ff', fontWeight: 900 }}>
          No admissible evidence. No admissible execution.
        </p>
      </div>
    </main>
  );
}

function ChannelGroup({
  title,
  channels,
  onChange,
}: {
  title: string;
  channels: Channel[];
  onChange: (
    id: string,
    patch: Partial<Pick<Channel, 'value' | 'source' | 'qualified' | 'required'>>,
  ) => void;
}) {
  return (
    <section style={{ padding: 22, borderRadius: 22, border: '1px solid rgba(114,177,232,.18)', background: 'rgba(8,18,30,.82)' }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <div style={{ display: 'grid', gap: 10 }}>
        {channels.map((channel) => (
          <div
            key={channel.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.25fr .75fr 1fr auto',
              gap: 10,
              alignItems: 'center',
              padding: 12,
              borderRadius: 14,
              border: channel.qualified
                ? '1px solid rgba(255,255,255,.07)'
                : '1px solid rgba(255,212,106,.28)',
              background: channel.qualified
                ? 'rgba(3,8,14,.5)'
                : 'rgba(255,212,106,.04)',
            }}
          >
            <div>
              <strong>{channel.label}</strong>
              <small style={{ display: 'block', color: '#93a8bd', marginTop: 4 }}>
                {channel.required ? 'Required' : 'Optional'} · {channel.unit}
              </small>
            </div>

            <input
              value={channel.value}
              onChange={(event) => onChange(channel.id, { value: event.target.value })}
              aria-label={`${channel.label} value`}
              style={inputStyle}
            />

            <input
              value={channel.source}
              onChange={(event) => onChange(channel.id, { source: event.target.value })}
              aria-label={`${channel.label} source`}
              style={inputStyle}
            />

            <button
              type="button"
              onClick={() => onChange(channel.id, { qualified: !channel.qualified })}
              style={{
                minHeight: 40,
                padding: '0 12px',
                borderRadius: 11,
                border: channel.qualified
                  ? '1px solid rgba(57,242,161,.25)'
                  : '1px solid rgba(255,212,106,.28)',
                background: 'rgba(255,255,255,.03)',
                color: channel.qualified ? '#39f2a1' : '#ffd46a',
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              {channel.qualified ? 'QUALIFIED' : 'UNQUALIFIED'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 40,
  padding: '0 10px',
  borderRadius: 11,
  border: '1px solid rgba(255,255,255,.08)',
  background: '#07101a',
  color: 'white',
};

function buttonStyle(start: string, end: string): React.CSSProperties {
  return {
    minHeight: 44,
    padding: '0 16px',
    border: 0,
    borderRadius: 12,
    background: `linear-gradient(90deg, ${start}, ${end})`,
    color: '#03110d',
    fontWeight: 900,
    cursor: 'pointer',
  };
}
