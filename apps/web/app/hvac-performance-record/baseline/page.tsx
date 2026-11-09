'use client';

import { useState } from 'react';
import { baselineReadyToFreeze, freezeBaseline, newBaselineDraft, recordStepEvidence } from '@/lib/hvac-performance-record/baseline-gate';
import { HVAC_BASELINE_STEP_TITLES } from '@/lib/hvac-performance-record/step-definitions';

export default function BaselinePrototype() {
  const [draft, setDraft] = useState(() => newBaselineDraft('PROTOTYPE-INTAKE'));
  const [selected, setSelected] = useState(1);
  const [reference, setReference] = useState('');
  const [attested, setAttested] = useState(false);
  const [message, setMessage] = useState('');
  const complete = draft.steps.filter(step => step.technicianAttested && step.evidenceRefs.length).length;

  function choose(stepNumber: number) {
    setSelected(stepNumber);
    const step = draft.steps[stepNumber - 1];
    setReference(step.evidenceRefs.join(', '));
    setAttested(step.technicianAttested);
    setMessage('');
  }
  function save() {
    try {
      const refs = reference.split(',').map(s => s.trim()).filter(Boolean);
      setDraft(current => recordStepEvidence(current, selected, refs, attested));
      setMessage('Step recorded in browser memory only; evidence references are not verified.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Step could not be recorded');
    }
  }
  function freeze() {
    try {
      setDraft(current => freezeBaseline(current, new Date().toISOString()));
      setMessage('Prototype gate frozen in browser memory. No admissibility determination or durable seal created.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Baseline not ready');
    }
  }

  return <main style={{maxWidth:800,margin:'auto',padding:'28px 20px 72px',fontFamily:'system-ui,sans-serif'}}>
    <p style={{fontSize:12,fontWeight:800,letterSpacing:2}}>TA-14 · HVAC PERFORMANCE RECORD · PROTOTYPE</p>
    <h1>Fourteen-step baseline</h1>
    <p>This is an interface prototype, not an operational evidence vault. It is not connected to equipment or a diagnostic Analyzer.</p>
    <div role="status" style={{padding:16,border:'1px solid #987b40',borderRadius:10,marginBottom:20}}>
      <strong>{complete}/14 steps recorded · {draft.frozenAt ? 'PROTOTYPE FROZEN' : 'NOT FROZEN'}</strong>
      <p>DDD: LOCKED · Intervention: NONE</p>
    </div>
    <label style={{display:'grid',gap:8}}>Inspection step
      <select value={selected} disabled={Boolean(draft.frozenAt)} onChange={e=>choose(Number(e.target.value))} style={{padding:12,font:'inherit'}}>
        {HVAC_BASELINE_STEP_TITLES.map((title,i)=><option key={title} value={i+1}>{i+1}. {title}</option>)}
      </select>
    </label>
    <p>Phase: {selected <= 7 ? 'SEVEN IN' : 'SEVEN OUT'}</p>
    <label style={{display:'grid',gap:8,marginTop:18}}>Evidence reference identifiers (comma separated)
      <textarea rows={3} value={reference} disabled={Boolean(draft.frozenAt)} onChange={e=>setReference(e.target.value)} style={{padding:12,font:'inherit'}} />
    </label>
    <label style={{display:'flex',alignItems:'center',gap:10,margin:'18px 0'}}>
      <input type="checkbox" checked={attested} disabled={Boolean(draft.frozenAt)} onChange={e=>setAttested(e.target.checked)} />
      Technician attests that referenced observations were collected
    </label>
    <button type="button" onClick={save} disabled={Boolean(draft.frozenAt)} style={{padding:12,marginRight:12}}>Record step</button>
    <button type="button" onClick={freeze} disabled={Boolean(draft.frozenAt) || !baselineReadyToFreeze(draft)} style={{padding:12}}>Freeze prototype baseline</button>
    {message && <p role="status">{message}</p>}
    <p style={{marginTop:28,fontSize:13}}>References are entered manually and are not uploaded or authenticated. Browser refresh loses the draft. A frozen prototype is not Admissible Evidence and cannot unlock DDD.</p>
  </main>;
}
