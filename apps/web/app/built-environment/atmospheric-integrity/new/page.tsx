'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

type Decision = 'DRAFT' | 'HOLD' | 'ALLOW';
type StepId = 'context' | 'boundary' | 'evidence' | 'intervention' | 'outcome' | 'proof';
type ChannelGroup = 'Psychrometrics' | 'Atmospheric' | 'Expandable';

type Channel = {
  id: string;
  label: string;
  group: ChannelGroup;
  unit: string;
  value: string;
  source: string;
  qualified: boolean;
  required: boolean;
  note: string;
};

type Finding = {
  level: 'PASS' | 'HOLD' | 'NOTICE';
  title: string;
  detail: string;
};

const steps: { id: StepId; number: string; label: string; description: string }[] = [
  { id: 'context', number: '01', label: 'Context', description: 'Declare place, activity, consequence, purpose, and authority.' },
  { id: 'boundary', number: '02', label: 'Boundary', description: 'Define physical, temporal, operational, and professional limits.' },
  { id: 'evidence', number: '03', label: 'Evidence', description: 'Bind qualified atmospheric and psychrometric channels.' },
  { id: 'intervention', number: '04', label: 'Intervention', description: 'Preserve what changed, who authorized it, and why.' },
  { id: 'outcome', number: '05', label: 'Outcome', description: 'Record the observed result and the observation window.' },
  { id: 'proof', number: '06', label: 'Proof', description: 'Evaluate, preserve, export, and verify the bounded record.' },
];

const initialChannels: Channel[] = [
  { id: 'dry-bulb', label: 'Dry-bulb temperature', group: 'Psychrometrics', unit: '°F', value: '72.0', source: 'SENSOR-TEMP-01', qualified: true, required: true, note: 'Direct temperature used with the declared pressure basis.' },
  { id: 'wet-bulb', label: 'Wet-bulb temperature', group: 'Psychrometrics', unit: '°F', value: '60.1', source: 'CALCULATED-PSYCH-01', qualified: true, required: true, note: 'Measured or calculated wet-bulb value with method identified.' },
  { id: 'rh', label: 'Relative humidity', group: 'Psychrometrics', unit: '%', value: '48.0', source: 'SENSOR-RH-01', qualified: true, required: true, note: 'Relative humidity evidence bounded to the declared place and time.' },
  { id: 'dew-point', label: 'Dew point', group: 'Psychrometrics', unit: '°F', value: '51.2', source: 'CALCULATED-PSYCH-01', qualified: true, required: true, note: 'Calculated dew point with inputs and method preserved.' },
  { id: 'enthalpy', label: 'Enthalpy', group: 'Psychrometrics', unit: 'Btu/lb', value: '27.3', source: 'CALCULATED-PSYCH-01', qualified: true, required: true, note: 'Calculated moist-air enthalpy for the declared atmospheric state.' },
  { id: 'humidity-ratio', label: 'Humidity ratio', group: 'Psychrometrics', unit: 'gr/lb', value: '58.4', source: 'CALCULATED-PSYCH-01', qualified: true, required: true, note: 'Moisture mass ratio derived from qualified inputs.' },
  { id: 'specific-volume', label: 'Specific volume', group: 'Psychrometrics', unit: 'ft³/lb', value: '13.5', source: 'CALCULATED-PSYCH-01', qualified: true, required: true, note: 'Specific volume used for air-mass and flow interpretation.' },
  { id: 'pressure', label: 'Differential pressure', group: 'Atmospheric', unit: 'Pa', value: '-2.5', source: 'SENSOR-DP-01', qualified: true, required: true, note: 'Pressure relationship across the declared boundary.' },
  { id: 'voc', label: 'Total VOC', group: 'Atmospheric', unit: 'ppb', value: '180', source: 'SENSOR-VOC-01', qualified: true, required: true, note: 'Qualified volatile-organic-compound evidence with method limits.' },
  { id: 'radon', label: 'Radon', group: 'Atmospheric', unit: 'pCi/L', value: '1.1', source: 'SENSOR-RADON-01', qualified: true, required: true, note: 'Time-bounded radon evidence with device and placement identified.' },
  { id: 'pm', label: 'Particulate matter PM2.5', group: 'Atmospheric', unit: 'µg/m³', value: '6', source: 'SENSOR-PM-01', qualified: true, required: true, note: 'Particle concentration with size fraction and instrument identified.' },
  { id: 'sound', label: 'Sound pressure level', group: 'Atmospheric', unit: 'dBA', value: '43', source: 'METER-SPL-01', qualified: true, required: true, note: 'Sound evidence bounded to method, weighting, position, and duration.' },
  { id: 'co2', label: 'Carbon dioxide', group: 'Atmospheric', unit: 'ppm', value: '690', source: 'SENSOR-CO2-01', qualified: true, required: true, note: 'CO₂ concentration used as contextual atmospheric evidence.' },
  { id: 'co', label: 'Carbon monoxide', group: 'Expandable', unit: 'ppm', value: '0', source: 'SENSOR-CO-01', qualified: true, required: false, note: 'Optional combustion-safety evidence.' },
  { id: 'ozone', label: 'Ozone', group: 'Expandable', unit: 'ppb', value: '12', source: 'SENSOR-O3-01', qualified: false, required: false, note: 'Optional ozone evidence; currently not qualified for reliance.' },
  { id: 'formaldehyde', label: 'Formaldehyde', group: 'Expandable', unit: 'ppb', value: '18', source: 'SENSOR-HCHO-01', qualified: false, required: false, note: 'Optional aldehyde evidence with method-specific limitations.' },
  { id: 'airflow', label: 'Airflow', group: 'Expandable', unit: 'CFM', value: '0', source: 'INSTRUMENT-AIRFLOW-01', qualified: false, required: false, note: 'Optional airflow evidence requiring declared traverse or device method.' },
  { id: 'outdoor-air', label: 'Outdoor air fraction', group: 'Expandable', unit: '%', value: '0', source: 'CALCULATED-OA-01', qualified: false, required: false, note: 'Optional outdoor-air estimate with calculation inputs preserved.' },

];

const consequenceDescriptions: Record<string, string> = {
  C1: 'Informational consequence with no direct operational effect.',
  C2: 'Operational consequence that can affect workflow or equipment state.',
  C3: 'Material business, financial, contractual, or service consequence.',
  C4: 'Health, safety, environmental, or significant public-interest consequence.',
  C5: 'Critical, life-safety, mission-continuity, or irreversible consequence.',
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

function makeHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0').toUpperCase();
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function AtmosphericIntegrityRecordBuilderPage() {
  const [activeStep, setActiveStep] = useState<StepId>('context');
  const [spaceName, setSpaceName] = useState('Critical Environment Demo Room');
  const [facilityName, setFacilityName] = useState('TA-14 Demonstration Facility');
  const [spaceIdentifier, setSpaceIdentifier] = useState('ROOM-CE-01');
  const [activity, setActivity] = useState('Environmental validity assessment');
  const [purpose, setPurpose] = useState('Determine whether the declared environment is suitable for the stated activity during the observation window.');
  const [consequenceClass, setConsequenceClass] = useState('C4');
  const [timeWindow, setTimeWindow] = useState('30 minutes');
  const [startTime, setStartTime] = useState('2026-08-02T21:00');
  const [endTime, setEndTime] = useState('2026-08-02T21:30');
  const [authority, setAuthority] = useState('Facility Environmental Authority');
  const [authorityReference, setAuthorityReference] = useState('FEA-2026-001');
  const [physicalBoundary, setPhysicalBoundary] = useState('Declared room envelope, including occupied zone and pressure relationship to adjacent corridor.');
  const [operationalBoundary, setOperationalBoundary] = useState('TA-14 evaluates and preserves the evidence route. BAS and local controllers retain operational control.');
  const [professionalBoundary, setProfessionalBoundary] = useState('Clinical, engineering, commissioning, TAB, code, and safety determinations remain with qualified authorities.');
  const [assumptions, setAssumptions] = useState('Sensors are installed at representative locations and are operating within their declared qualification window.');
  const [unknowns, setUnknowns] = useState('No destructive inspection was performed. Hidden envelope pathways and unobserved transient conditions remain outside this record.');
  const [intervention, setIntervention] = useState('No intervention during baseline observation.');
  const [interventionAuthority, setInterventionAuthority] = useState('Not applicable — baseline observation only.');
  const [interventionTime, setInterventionTime] = useState('');
  const [outcome, setOutcome] = useState('Observed atmospheric conditions remained stable throughout the declared window.');
  const [outcomeWindow, setOutcomeWindow] = useState('30-minute observation following baseline confirmation.');
  const [limitations, setLimitations] = useState('This record demonstrates the preserved atmospheric state within the declared place and time. It does not certify future conditions or replace professional judgment.');
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [decision, setDecision] = useState<Decision>('DRAFT');
  const [findings, setFindings] = useState<Finding[]>([]);
  const [recordId, setRecordId] = useState('');
  const [recordHash, setRecordHash] = useState('');
  const [preservedAt, setPreservedAt] = useState('');
  const [preserved, setPreserved] = useState(false);

  const groupedChannels = useMemo(() => ({
    Psychrometrics: channels.filter((channel) => channel.group === 'Psychrometrics'),
    Atmospheric: channels.filter((channel) => channel.group === 'Atmospheric'),
    Expandable: channels.filter((channel) => channel.group === 'Expandable'),
  }), [channels]);

  const requiredChannels = useMemo(() => channels.filter((channel) => channel.required), [channels]);
  const completedRequired = useMemo(() => requiredChannels.filter((channel) => channel.value.trim() && channel.source.trim()), [requiredChannels]);
  const unqualifiedRequired = useMemo(() => requiredChannels.filter((channel) => !channel.qualified), [requiredChannels]);
  const completion = requiredChannels.length ? Math.round((completedRequired.length / requiredChannels.length) * 100) : 0;

  function markChanged() {
    setDecision('DRAFT');
    setPreserved(false);
    setRecordId('');
    setRecordHash('');
    setPreservedAt('');
  }

  function updateChannel(id: string, patch: Partial<Channel>) {
    setChannels((current) => current.map((channel) => channel.id === id ? { ...channel, ...patch } : channel));
    markChanged();
  }

  function evaluateRecord() {
    const next: Finding[] = [];
    const requiredContext = [spaceName, facilityName, activity, purpose, timeWindow, startTime, endTime, authority, authorityReference];
    if (requiredContext.some((value) => !value.trim())) {
      next.push({ level: 'HOLD', title: 'Context incomplete', detail: 'Place, purpose, time, authority, and authority reference must be complete.' });
    } else {
      next.push({ level: 'PASS', title: 'Context declared', detail: 'Core context and authority fields are present.' });
    }
    if (!physicalBoundary.trim() || !operationalBoundary.trim() || !professionalBoundary.trim()) {
      next.push({ level: 'HOLD', title: 'Boundary incomplete', detail: 'Physical, operational, and professional boundaries must be declared.' });
    } else {
      next.push({ level: 'PASS', title: 'Boundaries declared', detail: 'Physical, operational, and professional limits are preserved.' });
    }
    if (completedRequired.length !== requiredChannels.length) {
      next.push({ level: 'HOLD', title: 'Required evidence incomplete', detail: `${requiredChannels.length - completedRequired.length} required channel(s) lack a value or source.` });
    } else {
      next.push({ level: 'PASS', title: 'Required evidence complete', detail: `${requiredChannels.length} required channels contain values and sources.` });
    }
    if (unqualifiedRequired.length > 0) {
      next.push({ level: 'HOLD', title: 'Qualification failure', detail: `${unqualifiedRequired.length} required channel(s) are not qualified for reliance.` });
    } else {
      next.push({ level: 'PASS', title: 'Qualification confirmed', detail: 'Every required channel is marked qualified.' });
    }
    if (!outcome.trim() || !outcomeWindow.trim()) {
      next.push({ level: 'HOLD', title: 'Outcome incomplete', detail: 'Observed outcome and outcome window must be recorded.' });
    } else {
      next.push({ level: 'PASS', title: 'Outcome bounded', detail: 'Observed result and observation window are declared.' });
    }
    if (!limitations.trim() || !unknowns.trim()) {
      next.push({ level: 'HOLD', title: 'Proof boundary incomplete', detail: 'Unknowns and limitations are required before preservation.' });
    } else {
      next.push({ level: 'NOTICE', title: 'Proof boundary preserved', detail: 'The record states what remains unknown and what it does not demonstrate.' });
    }
    setFindings(next);
    setDecision(next.some((finding) => finding.level === 'HOLD') ? 'HOLD' : 'ALLOW');
    setPreserved(false);
    setActiveStep('proof');
  }

  function buildPayload(id = recordId || makeId('TA-14-AIR')) {
    return {
      schema: 'TA14.AIR.v1',
      recordId: id,
      status: preserved ? 'PRESERVED' : decision,
      context: { facilityName, spaceName, spaceIdentifier, activity, purpose, consequenceClass, consequenceDescription: consequenceDescriptions[consequenceClass], authority, authorityReference },
      timeBoundary: { startTime, endTime, declaredWindow: timeWindow },
      boundaries: { physical: physicalBoundary, operational: operationalBoundary, professional: professionalBoundary, assumptions, unknowns },
      evidence: channels,
      intervention: { description: intervention, authority: interventionAuthority, time: interventionTime || null },
      outcome: { observation: outcome, window: outcomeWindow },
      proofBoundary: limitations,
      determination: decision,
      findings,
      integrity: { preserved, preservedAt: preservedAt || null, recordHash: recordHash || null },
    };
  }

  function preserveRecord() {
    if (decision !== 'ALLOW') return;
    const id = makeId('TA-14-AIR');
    const payload = buildPayload(id);
    const hash = makeHash(JSON.stringify(payload));
    setRecordId(id);
    setRecordHash(hash);
    setPreservedAt(new Date().toISOString());
    setPreserved(true);
  }

  function exportRecord() {
    const payload = buildPayload();
    downloadJson(`${payload.recordId || 'TA-14-AIR-DRAFT'}.json`, payload);
  }

  return (
    <main className="pageShell">
      <style>{styles}</style>
      <header className="institutionalHeader">
        <div className="headerInner">
          <div className="brandBlock">
            <a className="brandMark" href="/">TA-14</a>
            <div>
              <div className="eyebrow">ENVIRONMENTAL INTEGRITY GOVERNANCE</div>
              <div className="headerTitle">Atmospheric Integrity Record Builder</div>
            </div>
          </div>
          <nav className="headerNav" aria-label="Institutional navigation">
            <a href="/environmental-integrity-governance">Environmental Integrity</a>
            <a href="/built-environment">Built Environment Exchange</a>
            <a href="/academy">TA-14 Academy</a>
          </nav>
        </div>
      </header>

      <div className="pageWidth">
        <div className="backRow">
          <a className="backLink" href="/built-environment">← Back to Built Environment Exchange</a>
          <span className="routeCode">AIR / CREATE / GOVERNED WORKSPACE</span>
        </div>

        <section className="hero">
          <div>
            <p className="heroKicker">ATMOSPHERIC INTEGRITY RECORD</p>
            <h1>Create a bounded record of atmospheric reality.</h1>
            <p className="heroLead">An AIR is not a dashboard reading. It is a governed record that binds a declared place, activity, time boundary, evidence set, authority, intervention, outcome, limitations, and proof boundary.</p>
          </div>
          <div className="heroActions">
            <button className="primaryButton" onClick={evaluateRecord}>Evaluate AIR</button>
            <a className="secondaryButton" href="/built-environment/routes/override-demo">Run BAS Override Demo</a>
          </div>
        </section>

        <section className="principleBar" aria-label="Governing principle">
          <strong>No admissible evidence. No admissible execution.</strong>
          <span>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</span>
        </section>

        <section className="stepRail" aria-label="AIR builder steps">
          {steps.map((step) => (
            <button key={step.id} className={`stepButton ${activeStep === step.id ? 'active' : ''}`} onClick={() => setActiveStep(step.id)}>
              <span className="stepNumber">{step.number}</span>
              <span><strong>{step.label}</strong><small>{step.description}</small></span>
            </button>
          ))}
        </section>

        <div className="workspaceGrid">
          <aside className="statusPanel">
            <div className="statusHead">
              <span>Current determination</span>
              <strong className={`decision ${decision.toLowerCase()}`}>{decision}</strong>
            </div>
            <div className="meter"><span style={{ width: `${completion}%` }} /></div>
            <div className="metricGrid">
              <div><strong>{completion}%</strong><span>required evidence complete</span></div>
              <div><strong>{requiredChannels.length}</strong><span>required channels</span></div>
              <div><strong>{unqualifiedRequired.length}</strong><span>unqualified required</span></div>
              <div><strong>{findings.filter((finding) => finding.level === 'HOLD').length}</strong><span>open HOLD findings</span></div>
            </div>
            <div className="statusActions">
              <button className="primaryButton full" onClick={evaluateRecord}>Evaluate AIR</button>
              <button className="goldButton full" disabled={decision !== 'ALLOW'} onClick={preserveRecord}>Preserve Record</button>
              <button className="secondaryButton full" onClick={exportRecord}>Export JSON</button>
            </div>
            <div className="boundaryNotice">
              <strong>Operational boundary</strong>
              <p>TA-14 evaluates and preserves the bounded route. BAS, controllers, clinical authority, engineering authority, and professional responsibility remain outside TA-14 control.</p>
            </div>
          </aside>

          <section className="formSurface">

            {activeStep === 'context' && (
              <div className="sectionBlock">
                <SectionHeader number="01" title="Declare the AIR context" text="Identify the place, activity, purpose, consequence, authority, and time boundary before evidence is interpreted." />
                <div className="fieldGrid two">
                  <Field label="Facility or site" value={facilityName} onChange={(value) => { setFacilityName(value); markChanged(); }} />
                  <Field label="Declared space" value={spaceName} onChange={(value) => { setSpaceName(value); markChanged(); }} />
                  <Field label="Space identifier" value={spaceIdentifier} onChange={(value) => { setSpaceIdentifier(value); markChanged(); }} />
                  <Field label="Declared activity" value={activity} onChange={(value) => { setActivity(value); markChanged(); }} />
                  <Field label="Named authority" value={authority} onChange={(value) => { setAuthority(value); markChanged(); }} />
                  <Field label="Authority reference" value={authorityReference} onChange={(value) => { setAuthorityReference(value); markChanged(); }} />
                  <Field label="Start time" type="datetime-local" value={startTime} onChange={(value) => { setStartTime(value); markChanged(); }} />
                  <Field label="End time" type="datetime-local" value={endTime} onChange={(value) => { setEndTime(value); markChanged(); }} />
                  <Field label="Declared time window" value={timeWindow} onChange={(value) => { setTimeWindow(value); markChanged(); }} />
                  <label className="field"><span>Consequence class</span><select value={consequenceClass} onChange={(event) => { setConsequenceClass(event.target.value); markChanged(); }}>{['C1','C2','C3','C4','C5'].map((value) => <option key={value} value={value}>{value} · {consequenceDescriptions[value]}</option>)}</select></label>
                </div>
                <TextArea label="Evidence purpose" value={purpose} onChange={(value) => { setPurpose(value); markChanged(); }} />
                <InfoCard title="Why context comes first">The same measurement can support different conclusions depending on place, activity, consequence, authority, and time. AIR prevents a free-floating value from being mistaken for governed evidence.</InfoCard>
                <StepFooter backHref="/built-environment" backLabel="Built Environment Exchange" nextLabel="Continue to Boundary" onNext={() => setActiveStep('boundary')} />
              </div>
            )}

            {activeStep === 'boundary' && (
              <div className="sectionBlock">
                <SectionHeader number="02" title="Declare the record boundaries" text="Strong records preserve where the claim starts, where it stops, what remains outside the system, and what is still unknown." />
                <TextArea label="Physical boundary" value={physicalBoundary} onChange={(value) => { setPhysicalBoundary(value); markChanged(); }} />
                <TextArea label="Operational-system boundary" value={operationalBoundary} onChange={(value) => { setOperationalBoundary(value); markChanged(); }} />
                <TextArea label="Professional boundary" value={professionalBoundary} onChange={(value) => { setProfessionalBoundary(value); markChanged(); }} />
                <TextArea label="Declared assumptions" value={assumptions} onChange={(value) => { setAssumptions(value); markChanged(); }} />
                <TextArea label="Known unknowns" value={unknowns} onChange={(value) => { setUnknowns(value); markChanged(); }} />
                <div className="boundaryGrid">
                  <BoundaryCard title="Operational-system boundary" text="What BAS, SCADA, controllers, AI, CMMS, digital twins, or other operational systems control or determine." />
                  <BoundaryCard title="Professional boundary" text="What remains with clinicians, engineers, operators, commissioning, TAB, cybersecurity, safety, and code authority." />
                  <BoundaryCard title="Proof boundary" text="What this governed record demonstrates, what it does not demonstrate, and how long reliance remains valid." />
                </div>
                <StepFooter backLabel="Context" onBack={() => setActiveStep('context')} nextLabel="Continue to Evidence" onNext={() => setActiveStep('evidence')} />
              </div>
            )}

            {activeStep === 'evidence' && (
              <div className="sectionBlock">
                <SectionHeader number="03" title="Bind qualified evidence" text="Required evidence must contain a value, unit, source identity, qualification state, and relationship to the declared place and time." />
                {(Object.keys(groupedChannels) as ChannelGroup[]).map((group) => (
                  <div key={group} className="channelGroup">
                    <div className="channelGroupHead"><div><span>{group.toUpperCase()}</span><h3>{group === 'Psychrometrics' ? 'Psychrometric state' : group === 'Atmospheric' ? 'Atmospheric evidence' : 'Expandable evidence channels'}</h3></div><strong>{groupedChannels[group].filter((channel) => channel.required).length} required</strong></div>
                    <div className="channelList">
                      {groupedChannels[group].map((channel) => (
                        <article className={`channelCard ${channel.required ? 'required' : ''}`} key={channel.id}>
                          <div className="channelTitle"><div><span>{channel.id}</span><h4>{channel.label}</h4><p>{channel.note}</p></div><div className="channelFlags"><label><input type="checkbox" checked={channel.required} onChange={(event) => updateChannel(channel.id, { required: event.target.checked })} /> Required</label><label><input type="checkbox" checked={channel.qualified} onChange={(event) => updateChannel(channel.id, { qualified: event.target.checked })} /> Qualified</label></div></div>
                          <div className="channelInputs"><label><span>Value</span><input value={channel.value} onChange={(event) => updateChannel(channel.id, { value: event.target.value })} /></label><label><span>Unit</span><input value={channel.unit} onChange={(event) => updateChannel(channel.id, { unit: event.target.value })} /></label><label className="source"><span>Source / instrument / method</span><input value={channel.source} onChange={(event) => updateChannel(channel.id, { source: event.target.value })} /></label></div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
                <InfoCard title="Evidence qualification is not a decoration">A required channel marked unqualified forces HOLD. Qualification should be supported by instrument identity, calibration or validation status, method suitability, placement, continuity, and a valid time window.</InfoCard>
                <StepFooter backLabel="Boundary" onBack={() => setActiveStep('boundary')} nextLabel="Continue to Intervention" onNext={() => setActiveStep('intervention')} />
              </div>
            )}

            {activeStep === 'intervention' && (
              <div className="sectionBlock">
                <SectionHeader number="04" title="Preserve the intervention" text="Record what changed, who authorized the change, when it occurred, and whether the intervention is inside or outside the AIR claim." />
                <TextArea label="Intervention description" value={intervention} onChange={(value) => { setIntervention(value); markChanged(); }} />
                <div className="fieldGrid two">
                  <Field label="Intervention authority" value={interventionAuthority} onChange={(value) => { setInterventionAuthority(value); markChanged(); }} />
                  <Field label="Intervention time" type="datetime-local" value={interventionTime} onChange={(value) => { setInterventionTime(value); markChanged(); }} />
                </div>
                <div className="methodGrid">
                  <MethodCard number="1" title="Baseline" text="Preserve the pre-intervention state and the evidence window used to characterize it." />
                  <MethodCard number="2" title="Authority" text="Identify the person, role, order, route, or other authority that permitted the change." />
                  <MethodCard number="3" title="Action" text="Describe the actual operational change without implying that TA-14 performed it." />
                  <MethodCard number="4" title="Revalidation" text="Reassess evidence after any material change before relying on the result." />
                </div>
                <StepFooter backLabel="Evidence" onBack={() => setActiveStep('evidence')} nextLabel="Continue to Outcome" onNext={() => setActiveStep('outcome')} />
              </div>
            )}

            {activeStep === 'outcome' && (
              <div className="sectionBlock">
                <SectionHeader number="05" title="Bind the observed outcome" text="The outcome is the observed state after the declared route, not a promise that conditions will remain unchanged." />
                <TextArea label="Observed outcome" value={outcome} onChange={(value) => { setOutcome(value); markChanged(); }} />
                <TextArea label="Outcome observation window" value={outcomeWindow} onChange={(value) => { setOutcomeWindow(value); markChanged(); }} />
                <TextArea label="Limitations and proof boundary" value={limitations} onChange={(value) => { setLimitations(value); markChanged(); }} />
                <div className="outcomeGrid">
                  <OutcomeCard title="Observed" text="What was actually measured, seen, calculated, or preserved during the declared window." />
                  <OutcomeCard title="Attributed" text="Which authority, action, instrument, method, and record version the outcome is bound to." />
                  <OutcomeCard title="Bounded" text="Where and when the outcome applies, including assumptions and known unknowns." />
                  <OutcomeCard title="Revisitable" text="What new evidence, drift, change, or elapsed time would require revalidation." />
                </div>
                <StepFooter backLabel="Intervention" onBack={() => setActiveStep('intervention')} nextLabel="Evaluate Record" onNext={evaluateRecord} />
              </div>
            )}

            {activeStep === 'proof' && (
              <div className="sectionBlock">
                <SectionHeader number="06" title="Evaluate and preserve the proof package" text="The AIR may be preserved only after required context, boundaries, evidence, authority, outcome, and limitations support ALLOW." />
                <div className={`determinationBanner ${decision.toLowerCase()}`}><div><span>DETERMINATION</span><strong>{decision}</strong></div><p>{decision === 'ALLOW' ? 'The current record satisfies the builder checks and may be preserved.' : decision === 'HOLD' ? 'One or more required conditions are incomplete or unqualified.' : 'Evaluate the record to determine whether it may be preserved.'}</p></div>
                <div className="findingList">
                  {findings.length === 0 ? <div className="emptyState">No evaluation has been run. Select “Evaluate AIR” to generate findings.</div> : findings.map((finding, index) => <article key={`${finding.title}-${index}`} className={`finding ${finding.level.toLowerCase()}`}><span>{finding.level}</span><div><h4>{finding.title}</h4><p>{finding.detail}</p></div></article>)}
                </div>
                <div className="proofActions"><button className="primaryButton" onClick={evaluateRecord}>Re-evaluate AIR</button><button className="goldButton" disabled={decision !== 'ALLOW'} onClick={preserveRecord}>Preserve Record</button><button className="secondaryButton" onClick={exportRecord}>Export JSON</button></div>
                {preserved && <div className="preservedCard"><span>PRESERVED AIR PACKAGE</span><h3>{recordId}</h3><div className="integrityGrid"><div><small>Record hash</small><strong>{recordHash}</strong></div><div><small>Preserved at</small><strong>{preservedAt}</strong></div><div><small>Schema</small><strong>TA14.AIR.v1</strong></div><div><small>Determination</small><strong>ALLOW</strong></div></div><p>This demonstration hash is generated locally for the exported package. Production verification requires the Exchange integrity and registry services.</p></div>}
                <div className="proofBoundary"><h3>What this AIR demonstrates</h3><p>{limitations}</p><div className="proofColumns"><div><strong>Included</strong><ul><li>Declared place and activity</li><li>Bounded time window</li><li>Named authority</li><li>Required evidence channels</li><li>Qualification states</li><li>Intervention and outcome</li><li>Known limitations</li></ul></div><div><strong>Not implied</strong><ul><li>Future environmental conditions</li><li>Code compliance certification</li><li>Clinical suitability beyond named authority</li><li>Engineering design approval</li><li>Control of BAS or equipment</li><li>Absence of unmeasured hazards</li><li>Universal applicability</li></ul></div></div></div>
                <StepFooter backLabel="Outcome" onBack={() => setActiveStep('outcome')} nextLabel="Return to Exchange" nextHref="/built-environment" />
              </div>
            )}
          </section>
        </div>

        <section className="academySection">
          <div><p className="heroKicker">TA-14 ACADEMY</p><h2>Learn how atmospheric evidence becomes a governed record.</h2><p>The Academy explains evidence qualification, psychrometric relationships, authority, continuity, proof boundaries, and the distinction between an AIR and a dashboard.</p></div>
          <a className="secondaryButton" href="/academy">Enter TA-14 Academy</a>
        </section>

        <footer className="pageFooter">
          <div><strong>TA-14 Environmental Integrity Governance</strong><p>The Built Environment supplies operational reality. TA-14 supplies admissible execution.</p></div>
          <nav><a href="/environmental-integrity-governance">Environmental Integrity Home</a><a href="/built-environment">Built Environment Exchange</a><a href="/academy">TA-14 Academy</a><a href="/">TA-14 Authority Home</a></nav>
        </footer>
      </div>
    </main>
  );
}

function SectionHeader({ number, title, text }: { number: string; title: string; text: string }) {
  return <div className="sectionHeader"><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div></div>;
}
function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="field wide"><span>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="infoCard"><strong>{title}</strong><p>{children}</p></div>;
}
function BoundaryCard({ title, text }: { title: string; text: string }) { return <article className="boundaryCard"><h3>{title}</h3><p>{text}</p></article>; }
function MethodCard({ number, title, text }: { number: string; title: string; text: string }) { return <article className="methodCard"><span>{number}</span><h3>{title}</h3><p>{text}</p></article>; }
function OutcomeCard({ title, text }: { title: string; text: string }) { return <article className="outcomeCard"><h3>{title}</h3><p>{text}</p></article>; }
function StepFooter({ backLabel, backHref, onBack, nextLabel, nextHref, onNext }: { backLabel: string; backHref?: string; onBack?: () => void; nextLabel: string; nextHref?: string; onNext?: () => void }) {
  return <div className="stepFooter">{backHref ? <a className="secondaryButton" href={backHref}>← {backLabel}</a> : <button className="secondaryButton" onClick={onBack}>← {backLabel}</button>}{nextHref ? <a className="primaryButton" href={nextHref}>{nextLabel} →</a> : <button className="primaryButton" onClick={onNext}>{nextLabel} →</button>}</div>;
}

const styles = `

:root{color-scheme:dark}.pageShell{min-height:100vh;background:radial-gradient(circle at 15% 0%,rgba(24,118,149,.18),transparent 28%),radial-gradient(circle at 85% 5%,rgba(42,224,175,.09),transparent 25%),#03060b;color:#f4f8fc;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.pageShell *{box-sizing:border-box}.institutionalHeader{position:sticky;top:0;z-index:30;border-bottom:1px solid rgba(120,190,220,.16);background:rgba(3,6,11,.9);backdrop-filter:blur(18px)}.headerInner{width:min(1500px,calc(100% - 32px));margin:auto;min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:24px}.brandBlock{display:flex;align-items:center;gap:16px}.brandMark{display:grid;place-items:center;width:58px;height:44px;border:1px solid rgba(84,232,255,.4);border-radius:12px;color:#54e8ff;text-decoration:none;font-weight:950;letter-spacing:.04em}.eyebrow{font-size:10px;letter-spacing:.2em;color:#54e8ff;font-weight:900}.headerTitle{font-size:15px;font-weight:850;margin-top:4px}.headerNav{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px}.headerNav a,.pageFooter a{color:#aebfd0;text-decoration:none;font-size:13px;font-weight:750;padding:9px 11px;border-radius:10px}.headerNav a:hover,.pageFooter a:hover{color:white;background:rgba(255,255,255,.05)}.pageWidth{width:min(1500px,calc(100% - 32px));margin:auto}.backRow{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:28px 0 10px}.backLink{color:#54e8ff;text-decoration:none;font-weight:850}.routeCode{font-size:11px;letter-spacing:.16em;color:#6f8598;font-weight:900}.hero{padding:44px 0 34px;display:grid;grid-template-columns:minmax(0,1.4fr) minmax(250px,.6fr);gap:40px;align-items:end}.heroKicker{color:#54e8ff;font-size:12px;letter-spacing:.2em;font-weight:950;margin:0 0 14px}.hero h1{font-size:clamp(46px,7vw,92px);line-height:.94;letter-spacing:-.055em;margin:0;max-width:1060px}.heroLead{max-width:940px;color:#afc0d0;font-size:18px;line-height:1.75;margin:24px 0 0}.heroActions{display:flex;flex-direction:column;align-items:stretch;gap:12px}.primaryButton,.secondaryButton,.goldButton{min-height:46px;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;padding:0 18px;font-weight:900;font-size:14px;text-decoration:none;cursor:pointer;transition:.2s ease;border:1px solid transparent}.primaryButton{background:linear-gradient(135deg,#54e8ff,#39f2a1);color:#021017}.secondaryButton{background:rgba(255,255,255,.03);border-color:rgba(155,201,227,.22);color:#eaf5ff}.goldButton{background:linear-gradient(135deg,#ffd46a,#ffae57);color:#211200}.primaryButton:hover,.secondaryButton:hover,.goldButton:hover{transform:translateY(-1px);filter:brightness(1.04)}.primaryButton:disabled,.goldButton:disabled{opacity:.36;cursor:not-allowed;transform:none}.full{width:100%}.principleBar{display:flex;justify-content:space-between;gap:24px;align-items:center;padding:18px 22px;border:1px solid rgba(84,232,255,.18);border-radius:16px;background:rgba(9,21,31,.72);color:#9bb0c3}.principleBar strong{color:white}.principleBar span{font-size:12px;letter-spacing:.04em}.stepRail{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin:24px 0}.stepButton{text-align:left;min-height:118px;padding:16px;border-radius:16px;border:1px solid rgba(124,183,215,.15);background:rgba(7,14,23,.72);color:#e8f3fb;display:flex;gap:12px;cursor:pointer}.stepButton:hover,.stepButton.active{border-color:rgba(84,232,255,.5);background:rgba(20,61,74,.55)}.stepNumber{color:#54e8ff;font-weight:950;font-size:11px}.stepButton strong{display:block;font-size:14px}.stepButton small{display:block;color:#8197aa;line-height:1.45;margin-top:7px}.workspaceGrid{display:grid;grid-template-columns:330px minmax(0,1fr);gap:20px;align-items:start}.statusPanel{position:sticky;top:102px;padding:22px;border-radius:20px;border:1px solid rgba(122,181,212,.16);background:rgba(7,14,23,.9);box-shadow:0 24px 80px rgba(0,0,0,.25)}.statusHead{display:flex;justify-content:space-between;align-items:center;gap:12px;color:#8da2b5;font-size:12px;text-transform:uppercase;letter-spacing:.11em;font-weight:900}.decision{font-size:22px;letter-spacing:.02em}.decision.draft{color:#54e8ff}.decision.hold{color:#ffd46a}.decision.allow{color:#39f2a1}.meter{height:8px;border-radius:99px;background:#101d29;margin:18px 0;overflow:hidden}.meter span{display:block;height:100%;background:linear-gradient(90deg,#54e8ff,#39f2a1);border-radius:inherit}.metricGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.metricGrid div{padding:12px;border:1px solid rgba(255,255,255,.06);border-radius:12px;background:rgba(255,255,255,.025)}.metricGrid strong{display:block;font-size:22px}.metricGrid span{display:block;color:#7f94a7;font-size:11px;line-height:1.35;margin-top:4px}.statusActions{display:grid;gap:9px;margin-top:18px}.boundaryNotice{padding:16px;margin-top:18px;border-radius:14px;border:1px solid rgba(255,212,106,.16);background:rgba(255,212,106,.04)}.boundaryNotice strong{color:#ffd46a}.boundaryNotice p{color:#8fa4b6;font-size:12px;line-height:1.55;margin:8px 0 0}.formSurface{min-width:0;border:1px solid rgba(125,185,216,.16);border-radius:22px;background:rgba(6,13,21,.84);overflow:hidden}.sectionBlock{padding:clamp(22px,4vw,48px)}.sectionHeader{display:flex;gap:18px;align-items:flex-start;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:26px}.sectionHeader>span{display:grid;place-items:center;min-width:46px;height:46px;border-radius:13px;background:rgba(84,232,255,.1);color:#54e8ff;font-weight:950}.sectionHeader h2{font-size:clamp(28px,4vw,48px);letter-spacing:-.035em;margin:0}.sectionHeader p{color:#9fb1c1;line-height:1.65;max-width:840px;margin:10px 0 0}.fieldGrid{display:grid;gap:16px}.fieldGrid.two{grid-template-columns:1fr 1fr}.field{display:block;margin:0 0 16px}.field>span,.channelInputs span{display:block;color:#91a6b8;font-size:11px;text-transform:uppercase;letter-spacing:.1em;font-weight:900;margin-bottom:7px}.field input,.field select,.field textarea,.channelInputs input{width:100%;border:1px solid rgba(146,196,221,.16);border-radius:12px;background:#07101a;color:#f5f9ff;padding:12px 13px;outline:none;font:inherit}.field textarea{min-height:120px;resize:vertical;line-height:1.55}.field input:focus,.field select:focus,.field textarea:focus,.channelInputs input:focus{border-color:#54e8ff;box-shadow:0 0 0 3px rgba(84,232,255,.08)}.infoCard{padding:20px;border-radius:16px;background:linear-gradient(135deg,rgba(84,232,255,.07),rgba(57,242,161,.035));border:1px solid rgba(84,232,255,.16);margin:20px 0}.infoCard strong{color:#54e8ff}.infoCard p{color:#9fb2c2;line-height:1.65;margin:8px 0 0}.boundaryGrid,.outcomeGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:24px 0}.boundaryCard,.outcomeCard,.methodCard{padding:20px;border-radius:16px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025)}.boundaryCard h3,.outcomeCard h3,.methodCard h3{margin:0;font-size:16px}.boundaryCard p,.outcomeCard p,.methodCard p{color:#8fa4b5;line-height:1.55;margin:9px 0 0;font-size:13px}.methodGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin:22px 0}.methodCard>span{color:#54e8ff;font-weight:950;font-size:12px}.methodCard h3{margin-top:10px}.channelGroup{margin:0 0 30px}.channelGroupHead{display:flex;justify-content:space-between;align-items:end;gap:18px;margin-bottom:12px}.channelGroupHead span{font-size:10px;letter-spacing:.16em;color:#54e8ff;font-weight:900}.channelGroupHead h3{margin:5px 0 0;font-size:24px}.channelGroupHead>strong{color:#8297aa;font-size:12px}.channelList{display:grid;gap:10px}.channelCard{padding:18px;border:1px solid rgba(255,255,255,.07);border-radius:16px;background:rgba(255,255,255,.018)}.channelCard.required{border-color:rgba(84,232,255,.17)}.channelTitle{display:flex;justify-content:space-between;gap:20px}.channelTitle span{color:#5f788c;font-size:10px;text-transform:uppercase;letter-spacing:.12em;font-weight:900}.channelTitle h4{margin:5px 0 0;font-size:17px}.channelTitle p{color:#8195a8;font-size:12px;line-height:1.45;margin:7px 0 0;max-width:720px}.channelFlags{display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap;justify-content:flex-end}.channelFlags label{font-size:11px;color:#9cb0c1;font-weight:800;white-space:nowrap}.channelInputs{display:grid;grid-template-columns:1fr .7fr 2fr;gap:12px;margin-top:16px}.channelInputs label{display:block}.determinationBanner{display:flex;justify-content:space-between;gap:30px;align-items:center;padding:22px;border-radius:18px;border:1px solid rgba(84,232,255,.18);background:rgba(84,232,255,.04)}.determinationBanner.hold{border-color:rgba(255,212,106,.24);background:rgba(255,212,106,.04)}.determinationBanner.allow{border-color:rgba(57,242,161,.24);background:rgba(57,242,161,.04)}.determinationBanner span{display:block;font-size:10px;letter-spacing:.16em;color:#88a1b5;font-weight:900}.determinationBanner strong{display:block;font-size:42px;line-height:1;margin-top:5px}.determinationBanner p{color:#9eb1c0;line-height:1.55;max-width:620px}.findingList{display:grid;gap:10px;margin:20px 0}.finding{display:flex;gap:16px;padding:17px;border-radius:14px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.02)}.finding>span{min-width:62px;font-size:10px;letter-spacing:.1em;font-weight:950}.finding.pass>span{color:#39f2a1}.finding.hold>span{color:#ffd46a}.finding.notice>span{color:#54e8ff}.finding h4{margin:0}.finding p{margin:6px 0 0;color:#8ea3b5;font-size:13px;line-height:1.5}.emptyState{padding:28px;text-align:center;border:1px dashed rgba(255,255,255,.12);border-radius:14px;color:#7f94a7}.proofActions{display:flex;gap:10px;flex-wrap:wrap}.preservedCard{padding:24px;margin:24px 0;border-radius:18px;border:1px solid rgba(57,242,161,.24);background:rgba(57,242,161,.045)}.preservedCard>span{color:#39f2a1;font-size:10px;letter-spacing:.16em;font-weight:950}.preservedCard h3{font-size:28px;margin:8px 0 18px}.integrityGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.integrityGrid div{padding:14px;border-radius:12px;background:rgba(0,0,0,.2)}.integrityGrid small{display:block;color:#7f95a8}.integrityGrid strong{display:block;margin-top:5px;overflow-wrap:anywhere}.preservedCard p{color:#8ca1b2;line-height:1.55}.proofBoundary{padding:24px;margin-top:22px;border:1px solid rgba(255,255,255,.08);border-radius:18px;background:rgba(255,255,255,.02)}.proofBoundary h3{margin:0}.proofBoundary>p{color:#9eb1c1;line-height:1.65}.proofColumns{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:18px}.proofColumns>div{padding:18px;border-radius:14px;background:rgba(0,0,0,.18)}.proofColumns ul{padding-left:20px;color:#8da2b4;line-height:1.75}.stepFooter{display:flex;justify-content:space-between;gap:12px;padding-top:28px;margin-top:30px;border-top:1px solid rgba(255,255,255,.07)}.academySection{display:flex;justify-content:space-between;align-items:end;gap:30px;margin:38px 0;padding:34px;border-radius:22px;border:1px solid rgba(84,232,255,.16);background:linear-gradient(135deg,rgba(10,43,57,.8),rgba(8,24,34,.7))}.academySection h2{font-size:clamp(28px,4vw,48px);letter-spacing:-.035em;margin:0}.academySection p:not(.heroKicker){max-width:850px;color:#9db0c0;line-height:1.65}.pageFooter{display:flex;justify-content:space-between;gap:30px;padding:34px 0 50px;border-top:1px solid rgba(255,255,255,.08)}.pageFooter p{color:#8298aa}.pageFooter nav{display:flex;flex-wrap:wrap;justify-content:flex-end;align-items:flex-start}.outcomeGrid{grid-template-columns:repeat(4,1fr)}@media(max-width:1100px){.stepRail{grid-template-columns:repeat(3,1fr)}.workspaceGrid{grid-template-columns:1fr}.statusPanel{position:relative;top:auto}.methodGrid,.outcomeGrid{grid-template-columns:repeat(2,1fr)}}@media(max-width:760px){.headerInner,.hero,.academySection,.pageFooter,.principleBar,.backRow{display:block}.headerNav{justify-content:flex-start;margin:12px 0}.heroActions{margin-top:24px}.routeCode{display:block;margin-top:10px}.stepRail{grid-template-columns:1fr 1fr}.fieldGrid.two,.boundaryGrid,.channelInputs,.integrityGrid,.proofColumns{grid-template-columns:1fr}.channelTitle{display:block}.channelFlags{justify-content:flex-start;margin-top:14px}.methodGrid,.outcomeGrid{grid-template-columns:1fr}.determinationBanner{display:block}.stepFooter{flex-direction:column}.pageFooter nav{justify-content:flex-start}.academySection>a{margin-top:16px}.principleBar span{display:block;margin-top:8px}}@media(max-width:480px){.pageWidth,.headerInner{width:min(100% - 20px,1500px)}.sectionBlock{padding:18px}.hero h1{font-size:43px}.stepRail{grid-template-columns:1fr}.metricGrid{grid-template-columns:1fr}.proofActions{display:grid}.primaryButton,.secondaryButton,.goldButton{width:100%}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
`;
