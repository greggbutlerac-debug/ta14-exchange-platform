import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
const panel: React.CSSProperties = { border: '1px solid rgba(148,163,184,.25)', borderRadius: 16, padding: 20, background: 'rgba(15,23,42,.58)' };
const stages = [
  ['S0','Frozen baseline'], ['S1','Initial supportable state'], ['S2','Authority / evidence established'], ['S3','Material condition change'],
  ['S4','Native reassessment'], ['S5','Consequential commitment challenge'], ['S6','Alternate-route / bypass challenge'], ['S7','Outcome and restoration evidence']
] as const;

type Run = { run_id:string; freeze_record_id:string; freeze_sha256:string; operator_name:string; status:string; started_at:string; scenario_state:Record<string,string>; challenge_records:unknown[]; evidence_receipts:unknown[]; native_determinations:unknown[]; outcome_record:unknown };

export default async function RunPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from('consequence_examination_runs').select('run_id,freeze_record_id,freeze_sha256,operator_name,status,started_at,scenario_state,challenge_records,evidence_receipts,native_determinations,outcome_record').eq('run_id', runId).maybeSingle();
  if (error || !data) notFound();
  const run = data as Run;
  return <main style={{maxWidth:1120,margin:'0 auto',padding:'44px 24px 80px',color:'#e5e7eb'}}>
    <p style={{color:'#94a3b8',letterSpacing:'.14em',fontSize:12}}>TA-14 CONSEQUENCE EXAMINATION RUN</p>
    <h1 style={{fontSize:'clamp(2rem,5vw,3.6rem)'}}>BaseLayerOS R1 — S0–S7 Workspace</h1>
    <section style={{...panel,margin:'24px 0'}}><p><strong>Run:</strong> {run.run_id}</p><p><strong>Status:</strong> {run.status}</p><p><strong>Operator:</strong> {run.operator_name}</p><p><strong>Freeze:</strong> {run.freeze_record_id}</p><p style={{overflowWrap:'anywhere'}}><strong>Freeze SHA-256:</strong> {run.freeze_sha256}</p><p><strong>Started:</strong> {run.started_at}</p></section>
    <section><h2>Scenario chronology</h2><div style={{display:'grid',gap:12}}>{stages.map(([id,title])=><article key={id} style={panel}><small style={{color:'#94a3b8'}}>{id}</small><h3>{title}</h3><p><strong>State:</strong> {run.scenario_state?.[id] ?? 'NOT_RECORDED'}</p></article>)}</div></section>
    <section style={{display:'grid',gap:12,marginTop:28}}><article style={panel}><h2>Adversarial challenges</h2><p>{run.challenge_records?.length ?? 0} challenge record(s) preserved.</p></article><article style={panel}><h2>Evidence receipts</h2><p>{run.evidence_receipts?.length ?? 0} receipt(s) preserved.</p></article><article style={panel}><h2>Native determinations</h2><p>{run.native_determinations?.length ?? 0} determination(s) preserved.</p></article><article style={panel}><h2>Outcome</h2><p>{run.outcome_record ? 'Outcome recorded.' : 'No outcome recorded. Run cannot be sealed yet.'}</p></article></section>
    <section style={{...panel,marginTop:28}}><h2>Execution doctrine</h2><p>The workspace records what happened against the frozen object. It does not rewrite the participant architecture, substitute TA-14 semantics for native semantics, or infer success from the existence of a control.</p><p><strong>Evidence must establish whether consequential progression occurred, was refused, was contained, or remained indeterminate.</strong></p></section>
  </main>;
}
