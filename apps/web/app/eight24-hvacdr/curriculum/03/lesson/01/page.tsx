'use client';

import Link from 'next/link';
import { useState } from 'react';

const questions = [
  { q: 'Why must airflow be examined before concluding that a refrigerant charge is incorrect?', options: ['Airflow has no effect on refrigeration readings', 'Airflow changes coil loading and can alter refrigerant-side measurements', 'Airflow determines the refrigerant type', 'Airflow alone proves compressor failure'], correct: 1, why: 'Airflow affects coil heat transfer and therefore the meaning of refrigerant-side observations.' },
  { q: 'Which statement is a direct observation rather than a diagnosis?', options: ['The blower motor is defective', 'The filter is restricting the system', 'The supply register has little observable airflow', 'The refrigerant charge is low'], correct: 2, why: 'A low-airflow observation does not by itself establish its cause.' },
  { q: 'What must accompany a static-pressure reading to make it useful evidence?', options: ['Only the numeric value', 'The homeowner\'s preferred repair', 'Measurement location, operating state, instrument context and units', 'A preselected replacement part'], correct: 2, why: 'A number without its source and operating context cannot support a bounded conclusion.' },
  { q: 'A system reaches the thermostat setpoint but indoor relative humidity remains elevated. What follows?', options: ['Moisture performance is automatically acceptable', 'The compressor must be replaced', 'Temperature and moisture performance require separate examination', 'A refrigerant adjustment is automatically authorized'], correct: 2, why: 'Sensible temperature control and latent moisture control are distinct performance propositions.' },
  { q: 'What is the correct action when required airflow evidence is missing?', options: ['Assume design airflow', 'Record the gap and HOLD the unsupported conclusion', 'Attach gauges immediately', 'Issue the final DDD from experience'], correct: 1, why: 'Missing evidence cannot be replaced by assumption.' }
] as const;

export default function AirIsPartOfTheSystem() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [record, setRecord] = useState({ asset: '', mode: '', airflowPath: '', observation: '', instrument: '', conditions: '', gap: '' });
  const score = questions.reduce((sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0), 0);
  const complete = Object.keys(answers).length === questions.length;
  const field = (key: keyof typeof record, label: string, placeholder: string) => (
    <label style={{ display: 'grid', gap: 6, fontSize: 14, color: '#d5e9f1' }} key={key}>
      <strong>{label}</strong>
      <textarea value={record[key]} onChange={e => setRecord(v => ({ ...v, [key]: e.target.value }))} placeholder={placeholder} rows={2} style={{ padding: 12, borderRadius: 10, background: '#071c2b', color: '#f2f8fa', border: '1px solid #33576a', font: 'inherit' }} />
    </label>
  );
  return <main style={{ minHeight: '100vh', background: '#061421', color: '#f2f8fa', fontFamily: 'Arial, sans-serif', padding: '28px 20px 90px' }}>
    <div style={{ maxWidth: 980, margin: 'auto' }}>
      <nav style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13 }}>
        <Link href="/eight24-hvacdr/curriculum/03" style={{ color: '#7edbfa' }}>Module 03 overview</Link>
        <Link href="/eight24-hvacdr" style={{ color: '#7edbfa' }}>120-hour curriculum</Link>
      </nav>
      <p style={{ marginTop: 55, color: '#efc86c', fontWeight: 800, letterSpacing: 2 }}>TA-14 ACADEMY · MODULE 03 · LESSON 3.01 · 20 MINUTES</p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(38px, 6vw, 64px)', lineHeight: 1.08 }}>Air Is Part of the System</h1>
      <p style={{ fontSize: 19, lineHeight: 1.75, color: '#b9d0dd' }}>Airflow is a required operating condition, not a secondary comfort variable. A valid HVACD/R examination preserves the relationship between air movement, heat transfer, moisture removal and equipment operation before drawing a diagnostic conclusion.</p>
      <section style={{ borderLeft: '4px solid #efc86c', padding: '12px 24px', margin: '35px 0', background: '#102737' }}>
        <strong>GOVERNING RULE</strong>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 24, lineHeight: 1.5 }}>An airflow observation is not a component diagnosis. A measurement is not an authorization to intervene.</p>
      </section>
      <h2>1. Follow the complete air path</h2>
      <p style={{ lineHeight: 1.8 }}>Trace return openings, filters, blower, indoor coil, supply distribution and occupied spaces. Identify the equipment serving the complaint and preserve the present operating state. Restrictions, bypass, leakage and control behavior may change what is observed.</p>
      <h2>2. Separate four different propositions</h2>
      <ol style={{ lineHeight: 2 }}>
        <li><strong>Reported:</strong> what the occupant or work order says.</li>
        <li><strong>Observed:</strong> what is directly visible, audible or otherwise apparent.</li>
        <li><strong>Measured:</strong> quantified evidence with units, source, location and operating context.</li>
        <li><strong>Determined:</strong> only what the completed, admissible evidence record supports.</li>
      </ol>
      <h2>3. Airflow affects sensible and latent performance</h2>
      <p style={{ lineHeight: 1.8 }}>The airflow condition changes coil heat transfer and can influence temperature, condensate formation and refrigeration measurements. An acceptable thermostat reading does not establish acceptable moisture control. A low temperature split, high relative humidity or unusual refrigerant reading is not a stand-alone verdict.</p>
      <h2>4. Guided evidence worksheet</h2>
      <p style={{ color: '#b9d0dd', lineHeight: 1.7 }}>Practice describing a simulated or observed condition. This worksheet is local to this page: it does not create an institutional record, a DDD, a credential or permission to perform work.</p>
      <div style={{ display: 'grid', gap: 14, padding: 22, background: '#102737', borderRadius: 16 }}>
        {field('asset', 'Equipment identity', 'Model/serial or simulated asset identifier')}
        {field('mode', 'Operating mode and call', 'Cooling call, blower state, runtime and relevant context')}
        {field('airflowPath', 'Air path', 'Return → filter → blower → coil → supply → space')}
        {field('observation', 'Direct observation', 'Describe what is observed without assigning a cause')}
        {field('instrument', 'Instrument and measurement', 'Instrument, units, location and measured value, if available')}
        {field('conditions', 'Environmental and operating conditions', 'Temperature, RH, load, occupancy, weather or other context')}
        {field('gap', 'Missing or contradictory evidence', 'What cannot yet be concluded? What requires further examination?')}
        <button onClick={() => navigator.clipboard?.writeText(JSON.stringify({ lesson: '3.01', status: 'PRACTICE_ONLY_NOT_ADMITTED', ...record }, null, 2))} style={{ padding: 14, border: 0, borderRadius: 10, background: '#78c9e8', color: '#001827', fontWeight: 800, cursor: 'pointer' }}>Copy practice worksheet</button>
      </div>
      <h2 style={{ marginTop: 45 }}>5. Knowledge and evidence check</h2>
      <p>Answer all five questions. A score of at least 80% demonstrates this practice check only; no institutional completion is recorded here.</p>
      <div style={{ display: 'grid', gap: 18 }}>
        {questions.map((q, i) => <fieldset key={i} style={{ border: '1px solid #33576a', borderRadius: 14, padding: 20 }}>
          <legend style={{ fontWeight: 800, padding: '0 8px' }}>{i + 1}. {q.q}</legend>
          {q.options.map((o, j) => <label key={j} style={{ display: 'flex', alignItems: 'start', gap: 10, padding: '10px 0', cursor: 'pointer' }}>
            <input type="radio" name={`question-${i}`} checked={answers[i] === j} disabled={submitted} onChange={() => setAnswers(v => ({ ...v, [i]: j }))} />
            <span>{o}</span>
          </label>)}
          {submitted && <p style={{ color: answers[i] === q.correct ? '#9ce4b6' : '#f3c18c' }}>{q.why}</p>}
        </fieldset>)}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <button disabled={!complete || submitted} onClick={() => setSubmitted(true)} style={{ padding: '13px 22px', borderRadius: 10, border: 0, background: complete && !submitted ? '#efc86c' : '#78838b', color: '#001827', fontWeight: 800 }}>Score practice check</button>
        <button onClick={() => { setSubmitted(false); setAnswers({}); }} style={{ padding: '13px 22px', borderRadius: 10, border: '1px solid #547589', background: 'transparent', color: '#fff' }}>Try again</button>
        {submitted && <strong role="status">{score} / 5 · {score >= 4 ? 'PRACTICE PASS' : 'REVIEW REQUIRED'}</strong>}
      </div>
      <section style={{ marginTop: 48, borderTop: '1px solid #33576a', paddingTop: 20 }}>
        <h2>Handoff to Lesson 3.02</h2>
        <p style={{ lineHeight: 1.8 }}>Next: Airflow Path & System Boundaries. The learner moves from recognizing airflow as a necessary condition to tracing the physical return-to-supply path and identifying valid examination boundaries.</p>
        <p style={{ color: '#9cb6c4' }}>No refrigerant entry, repair, final DDD or field authorization is granted by this lesson.</p>
      </section>
    </div>
  </main>;
}
