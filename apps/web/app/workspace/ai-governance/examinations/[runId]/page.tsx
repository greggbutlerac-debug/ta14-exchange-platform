import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic='force-dynamic';
const panel:React.CSSProperties={border:'1px solid rgba(148,163,184,.25)',borderRadius:16,padding:20,background:'rgba(15,23,42,.58)'};
type Event={id:string;event_type:string;stage_id:string|null;payload:{summary?:string;evidence_ref?:string|null};payload_sha256:string;recorded_at:string};
type Receipt={run_id:string;freeze_record_id:string;freeze_sha256:string;operator_name:string;final_determination:string;run_sha256:string;started_at:string;sealed_at:string;outcome_record:{rationale?:string;semantics?:string;event_count?:number}|null;governance_registry_identifier:string|null;events:Event[]};

export default async function PublicExaminationReceipt({params}:{params:Promise<{runId:string}>}){
 const {runId}=await params; const supabase=await createClient();
 const {data,error}=await supabase.rpc('ta14_public_sealed_examination_receipt_v1',{p_run_id:decodeURIComponent(runId)});
 const receipt=(Array.isArray(data)?data[0]:null) as Receipt|null;
 if(error||!receipt) notFound();
 const events=Array.isArray(receipt.events)?receipt.events:[];
 return <main style={{maxWidth:1040,margin:'0 auto',padding:'44px 24px 80px',color:'#e5e7eb'}}>
  <p style={{color:'#dcae55',letterSpacing:'.14em',fontSize:12,fontWeight:900}}>TA-14 PUBLIC SEALED EXAMINATION RECEIPT</p>
  <h1 style={{fontSize:'clamp(2rem,5vw,4rem)',letterSpacing:'-.04em'}}>Examination Evidence Object</h1>
  <section style={{...panel,margin:'24px 0'}}><p><strong>Run:</strong> {receipt.run_id}</p><p><strong>Registry:</strong> {receipt.governance_registry_identifier??'Not linked to a Registry identity'}</p><p><strong>Technical Freeze:</strong> {receipt.freeze_record_id}</p><p style={{overflowWrap:'anywhere'}}><strong>Freeze SHA-256:</strong> {receipt.freeze_sha256}</p><p><strong>Operator:</strong> {receipt.operator_name}</p><p><strong>Started:</strong> {receipt.started_at}</p><p><strong>Sealed:</strong> {receipt.sealed_at}</p></section>
  <section style={{...panel,margin:'24px 0'}}><h2>Bounded finding</h2><p style={{fontSize:26,fontWeight:900}}>{receipt.final_determination}</p><p>{receipt.outcome_record?.rationale}</p><p>{receipt.outcome_record?.semantics}</p><p><strong>Preserved events:</strong> {receipt.outcome_record?.event_count??events.length}</p></section>
  <section><h2>Preserved chronology</h2><div style={{display:'grid',gap:10}}>{events.map((e,i)=><article key={e.id} style={panel}><small style={{color:'#94a3b8'}}>#{i+1} · {e.recorded_at} · {e.event_type}{e.stage_id?` · ${e.stage_id}`:''}</small><p>{e.payload?.summary}</p>{e.payload?.evidence_ref&&<p><strong>Evidence:</strong> {e.payload.evidence_ref}</p>}<p style={{overflowWrap:'anywhere',fontSize:12}}>Event SHA-256: {e.payload_sha256}</p></article>)}</div></section>
  <section style={{...panel,marginTop:28}}><h2>Sealed object identity</h2><p style={{overflowWrap:'anywhere'}}><strong>Run SHA-256:</strong> {receipt.run_sha256}</p><p>This public receipt is bounded to the frozen proposition, admitted evidence, environment, chronology, and stated determination. Publication does not convert the finding into universal certification or comparative superiority.</p></section>
  {receipt.governance_registry_identifier&&<p style={{marginTop:24}}><Link href={`/workspace/ai-governance/registry/showcase/${encodeURIComponent(receipt.governance_registry_identifier)}/examinations`}>View governance examination chronology →</Link></p>}
 </main>;
}
