'use client';

import { useState } from 'react';
import { createIntakeRecord, emptyIntake, requiredIntakeFields, type Intake } from '@/lib/hvac-performance-record/intake';

const labels: Record<keyof Intake, string> = {
  manufacturer: 'Manufacturer', model: 'Model number', serial: 'Serial number',
  equipmentType: 'Equipment type', concern: 'Homeowner concern',
  operatingMode: 'Observed operating mode', technicianId: 'Technician identifier',
};

export default function HVACPerformanceRecordIntake() {
  const [intake, setIntake] = useState<Intake>(emptyIntake);
  const [error, setError] = useState('');
  const [record, setRecord] = useState<ReturnType<typeof createIntakeRecord> | null>(null);

  function capture(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setRecord(createIntakeRecord(intake, new Date().toISOString()));
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to validate intake');
    }
  }

  return <main style={{maxWidth:740,margin:'0 auto',padding:'32px 20px 80px',fontFamily:'system-ui,sans-serif'}}>
    <p style={{fontWeight:700,letterSpacing:2,fontSize:12}}>TA-14 · HVAC PERFORMANCE RECORD</p>
    <h1>New inspection</h1>
    <p>Capture the equipment identity and the homeowner's reported concern before the 14-step baseline begins. This screen does not diagnose equipment.</p>
    <div role="status" style={{padding:16,border:'1px solid #9a6c24',borderRadius:8,margin:'22px 0'}}>
      <strong>DDD: LOCKED</strong>
      <p>Baseline: 0 of 14 steps complete · Not frozen · No intervention authorized</p>
    </div>
    <form onSubmit={capture} style={{display:'grid',gap:16}}>
      {requiredIntakeFields.map(field=><label key={field} style={{display:'grid',gap:6,fontWeight:600}}>
        {labels[field]}
        {field==='concern' ? <textarea required rows={4} value={intake[field]} onChange={e=>{setRecord(null);setIntake(prev=>({...prev,[field]:e.target.value}));}} style={{padding:12,font: 'inherit'}}/> :
          <input required value={intake[field]} onChange={e=>{setRecord(null);setIntake(prev=>({...prev,[field]:e.target.value}));}} style={{padding:12,font:'inherit'}}/>}
      </label>)}
      <button type="submit" style={{padding:16,fontWeight:700,cursor:'pointer'}}>Validate intake record</button>
    </form>
    {error && <p role="alert">{error}</p>}
    {record && <section aria-label="Validated intake" style={{marginTop:24,padding:18,border:'1px solid #39765b',borderRadius:8}}>
      <h2>Intake validated</h2>
      <p>Capture time: {record.capturedAt}</p>
      <p>DDD remains {record.dddStatus}. No diagnostic determination has been issued.</p>
      <p><strong>Prototype only:</strong> this record is held in the current browser session and has not been uploaded, persisted, or frozen as Admissible Evidence.</p>
    </section>}
  </main>;
}
