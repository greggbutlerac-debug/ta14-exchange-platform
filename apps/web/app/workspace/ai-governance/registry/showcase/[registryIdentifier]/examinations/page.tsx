import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic='force-dynamic';
const panel:React.CSSProperties={border:'1px solid rgba(148,163,184,.22)',borderRadius:18,padding:22,background:'rgba(7,22,37,.72)'};
type Run={run_id:string;freeze_record_id:string;freeze_sha256:string;operator_name:string;final_determination:string;run_sha256:string;started_at:string;sealed_at:string;outcome_record:{rationale?:string;semantics?:string;event_count?:number}|null};

export default async function ExaminationChronologyPage({params}:{params:Promise<{registryIdentifier:string}>}){
 const {registryIdentifier:encoded}=await params; const registryIdentifier=decodeURIComponent(encoded).toUpperCase(); const supabase=await createClient();
 const {data:directory}=await supabase.rpc('ta14_registry_public_directory_v1');
 const registered=Array.isArray(directory)&&directory.some((r:any)=>r.registry_identifier?.toUpperCase()===registryIdentifier&&r.status?.toLowerCase()==='registered');
 if(!registered) notFound();
 const {data,error}=await supabase.rpc('ta14_public_sealed_examinations_v1',{p_registry_identifier:registryIdentifier});
 const runs=(error?[]:(data??[])) as Run[];
 return <main style={{maxWidth:1100,margin:'0 auto',padding:'48px 24px 90px',color:'#e5e7eb'}}>
  <p style={{color:'#dcae55',fontSize:11,fontWeight:900,letterSpacing:'.14em'}}>TA-14 GOVERNANCE SHOWCASE · EXAMINATION CHRONOLOGY</p>
  <h1 style={{fontSize:'clamp(2.2rem,5vw,4.5rem)',letterSpacing:'-.04em'}}>Sealed Examination Record</h1>
  <p style={{color:'#94aabd',lineHeight:1.7}}>Registry identity <strong>{registryIdentifier}</strong>. Only sealed, explicitly linked examination objects appear here. A finding remains bounded to its frozen proposition, admitted evidence, environment, and run chronology.</p>
  {error&&<section style={{...panel,marginTop:30}}><h2>Public chronology unavailable.</h2><p>The Exchange will not substitute private or unverified run data when the bounded publication view cannot be established.</p></section>}
  {!error&&<div style={{display:'grid',gap:14,marginTop:30}}>{runs.length===0?<section style={panel}><h2>No sealed examinations linked yet.</h2><p>The architecture may be registered without implying examination, validation, certification, or universal effectiveness.</p></section>:runs.map((run,i)=><article key={run.run_id} style={panel}>
   <small style={{color:'#94a3b8'}}>SEALED OBJECT {String(runs.length-i).padStart(2,'0')} · {run.sealed_at}</small>
   <h2 style={{marginBottom:8}}>{run.final_determination}</h2><p>{run.outcome_record?.rationale}</p>
   <p><strong>Run:</strong> {run.run_id}<br/><strong>Freeze:</strong> {run.freeze_record_id}<br/><strong>Operator:</strong> {run.operator_name}<br/><strong>Events:</strong> {run.outcome_record?.event_count??'Preserved'}</p>
   <p style={{overflowWrap:'anywhere',fontSize:12,color:'#94a3b8'}}><strong>Freeze SHA-256:</strong> {run.freeze_sha256}<br/><strong>Run SHA-256:</strong> {run.run_sha256}</p>
   <Link href={`/workspace/ai-governance/examinations/${encodeURIComponent(run.run_id)}`} style={{color:'#efc66e',fontWeight:900}}>Inspect sealed receipt →</Link>
  </article>)}</div>}
  <section style={{...panel,marginTop:28}}><h2>Institutional boundary</h2><p>Chronology preserves what was examined and what survived examination. It does not permit retrospective claim expansion. Replays, corrections, changed environments, or successor versions require separately attributable records.</p></section>
  <p style={{marginTop:24}}><Link href={`/workspace/ai-governance/registry/showcase/${encodeURIComponent(registryIdentifier)}`}>← Return to governance showcase</Link></p>
 </main>;
}
