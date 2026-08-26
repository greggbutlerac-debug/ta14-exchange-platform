import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { appendExaminationEvent } from './actions';

export const dynamic = 'force-dynamic';
const panel: React.CSSProperties = { border: '1px solid rgba(148,163,184,.25)', borderRadius: 16, padding: 20, background: 'rgba(15,23,42,.58)' };
const input: React.CSSProperties = { width:'100%', boxSizing:'border-box', padding:10, borderRadius:8, border:'1px solid rgba(148,163,184,.35)', background:'rgba(2,6,23,.6)', color:'#e5e7eb' };
const stages = [['S0','Frozen baseline'],['S1','Initial supportable state'],['S2','Authority / evidence established'],['S3','Material condition change'],['S4','Native reassessment'],['S5','Consequential commitment challenge'],['S6','Alternate-route / bypass challenge'],['S7','Outcome and restoration evidence']] as const;
type Run = { run_id:string; freeze_record_id:string; freeze_sha256:string; operator_name:string; status:string; started_at:string };
type Event = { id:string; event_type:string; stage_id:string|null; payload:{summary?:string;evidence_ref?:string|null}; payload_sha256:string; recorded_at:string };

export default async function RunPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params; const supabase = await createClient();
  const { data, error } = await supabase.from('consequence_examination_runs').select('run_id,freeze_record_id,freeze_sha256,operator_name,status,started_at').eq('run_id',runId).maybeSingle();
  if (error || !data) notFound(); const run=data as Run;
  const { data:eventData } = await supabase.from('consequence_examination_events').select('id,event_type,stage_id,payload,payload_sha256,recorded_at').eq('run_id',runId).order('recorded_at',{ascending:true});
  const events=(eventData ?? []) as Event[]; const open=run.status==='OPEN';
  const action=appendExaminationEvent.bind(null,runId);
  return <main style={{maxWidth:1120,margin:'0 auto',padding:'44px 24px 80px',color:'#e5e7eb'}}>
    <p style={{color:'#94a3b8',letterSpacing:'.14em',fontSize:12}}>TA-14 CONSEQUENCE EXAMINATION RUN</p><h1 style={{fontSize:'clamp(2rem,5vw,3.6rem)'}}>BaseLayerOS R1 — S0–S7 Workspace</h1>
    <section style={{...panel,margin:'24px 0'}}><p><strong>Run:</strong> {run.run_id}</p><p><strong>Status:</strong> {run.status}</p><p><strong>Operator:</strong> {run.operator_name}</p><p><strong>Freeze:</strong> {run.freeze_record_id}</p><p style={{overflowWrap:'anywhere'}}><strong>Freeze SHA-256:</strong> {run.freeze_sha256}</p></section>
    <section><h2>Scenario chronology</h2><div style={{display:'grid',gap:12}}>{stages.map(([id,title])=>{const count=events.filter(e=>e.stage_id===id).length;return <article key={id} style={panel}><small style={{color:'#94a3b8'}}>{id}</small><h3>{title}</h3><p>{count} preserved event(s).</p>{open&&<form action={action} style={{display:'grid',gap:8}}><input type="hidden" name="event_type" value="SCENARIO_STAGE"/><input type="hidden" name="stage_id" value={id}/><textarea name="summary" required maxLength={5000} placeholder={`Record ${id} observation`} style={input}/><input name="evidence_ref" placeholder="Evidence object / receipt reference" style={input}/><button type="submit">Append {id} Evidence</button></form>}</article>})}</div></section>
    {open&&<section style={{...panel,marginTop:28}}><h2>Append non-stage evidence</h2><form action={action} style={{display:'grid',gap:8}}><select name="event_type" required style={input}><option value="CHALLENGE">Adversarial challenge</option><option value="EVIDENCE_RECEIPT">Evidence receipt</option><option value="NATIVE_DETERMINATION">Native determination</option><option value="OUTCOME">Outcome</option></select><select name="stage_id" style={input}><option value="">No stage</option>{stages.map(([id])=><option key={id}>{id}</option>)}</select><textarea name="summary" required maxLength={5000} placeholder="Bounded factual record" style={input}/><input name="evidence_ref" placeholder="Evidence object / receipt reference" style={input}/><button type="submit">Append to Evidence Ledger</button></form></section>}
    <section style={{marginTop:28}}><h2>Append-only evidence ledger</h2><div style={{display:'grid',gap:10}}>{events.length===0?<div style={panel}>No execution evidence recorded yet.</div>:events.map((e,i)=><article key={e.id} style={panel}><small style={{color:'#94a3b8'}}>#{i+1} · {e.recorded_at} · {e.event_type}{e.stage_id?` · ${e.stage_id}`:''}</small><p>{e.payload?.summary}</p>{e.payload?.evidence_ref&&<p><strong>Evidence:</strong> {e.payload.evidence_ref}</p>}<p style={{overflowWrap:'anywhere',fontSize:12,color:'#94a3b8'}}>Event SHA-256: {e.payload_sha256}</p></article>)}</div></section>
    <section style={{...panel,marginTop:28}}><h2>Execution doctrine</h2><p>Entries are append-only. Corrections become later attributable events; earlier evidence is not rewritten.</p><p><strong>Evidence must establish whether consequential progression occurred, was refused, was contained, or remained indeterminate.</strong></p></section>
  </main>;
}
