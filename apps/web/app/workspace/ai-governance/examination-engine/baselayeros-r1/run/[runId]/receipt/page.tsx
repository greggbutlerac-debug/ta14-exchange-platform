import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
const panel: React.CSSProperties={border:'1px solid rgba(148,163,184,.25)',borderRadius:16,padding:20,background:'rgba(15,23,42,.58)'};
type Run={run_id:string;freeze_record_id:string;freeze_sha256:string;operator_name:string;started_at:string;sealed_at:string|null;final_determination:string|null;run_sha256:string|null;outcome_record:{rationale?:string;semantics?:string;event_count?:number}|null;governance_registry_identifier:string|null;events:Event[]};
type Event={id:string;event_type:string;stage_id:string|null;payload:{summary?:string;evidence_ref?:string|null};payload_sha256:string;recorded_at:string};

export default async function ReceiptPage({params}:{params:Promise<{runId:string}>}){
 const {runId}=await params; const supabase=await createClient();
 const {data,error}=await supabase.rpc('ta14_public_sealed_examination_receipt_v1',{p_run_id:runId});
 const row=Array.isArray(data)?data[0]:null;
 if(error||!row||!row.run_sha256) notFound(); const run=row as Run; const events=Array.isArray(run.events)?run.events:[];
 return <main style={{maxWidth:1040,margin:'0 auto',padding:'44px 24px 80px',color:'#e5e7eb'}}>
  <p style={{color:'#94a3b8',letterSpacing:'.14em',fontSize:12}}>TA-14 SEALED EXAMINATION RECEIPT</p><h1>BaseLayerOS R1 — Examination Evidence Object</h1>
  <section style={{...panel,margin:'24px 0'}}><p><strong>Run identity:</strong> {run.run_id}</p><p><strong>Technical Freeze:</strong> {run.freeze_record_id}</p><p style={{overflowWrap:'anywhere'}}><strong>Freeze SHA-256:</strong> {run.freeze_sha256}</p><p><strong>Operator:</strong> {run.operator_name}</p><p><strong>Started:</strong> {run.started_at}</p><p><strong>Sealed:</strong> {run.sealed_at}</p>{run.governance_registry_identifier&&<p><strong>Registry identity:</strong> {run.governance_registry_identifier}</p>}</section>
  <section style={{...panel,margin:'24px 0'}}><h2>Bounded finding</h2><p style={{fontSize:24,fontWeight:900}}>{run.final_determination}</p><p>{run.outcome_record?.rationale}</p><p>{run.outcome_record?.semantics}</p><p><strong>Preserved events:</strong> {run.outcome_record?.event_count??events.length}</p></section>
  <section><h2>Preserved execution chronology</h2><div style={{display:'grid',gap:10}}>{events.map((e,i)=><article key={e.id} style={panel}><small style={{color:'#94a3b8'}}>#{i+1} · {e.recorded_at} · {e.event_type}{e.stage_id?` · ${e.stage_id}`:''}</small><p>{e.payload?.summary}</p>{e.payload?.evidence_ref&&<p><strong>Evidence reference:</strong> {e.payload.evidence_ref}</p>}<p style={{overflowWrap:'anywhere',fontSize:12}}>Event SHA-256: {e.payload_sha256}</p></article>)}</div></section>
  <section style={{...panel,marginTop:28}}><h2>Sealed object identity</h2><p style={{overflowWrap:'anywhere',fontSize:16}}><strong>Run SHA-256:</strong> {run.run_sha256}</p><p>This receipt represents the persisted sealed examination record. Registration or publication does not expand the bounded finding, certify universal effectiveness, or replace the participant architecture's native determination.</p><p><strong>Replay, correction, or successor examination requires a separately attributable evidence object.</strong></p></section>
  <p style={{marginTop:24}}>{run.governance_registry_identifier?<Link href={`/workspace/ai-governance/registry/showcase/${encodeURIComponent(run.governance_registry_identifier)}/examinations`}>← Return to examination chronology</Link>:<Link href="/workspace/ai-governance/registry/showcase">← Governance Showcase</Link>}</p>
 </main>;
}
