'use client';
import {useState} from 'react';
import Link from 'next/link';
type Disposition='ALLOW'|'HOLD'|'DENY'|'ESCALATE';
const evidence=['source','timestamp','calibration','continuity'] as const;
const authority=['actor','capacity','standing_basis','authority_relationship','applicable_policy'] as const;
const labels:Record<string,string>={source:'Sensor source documented',timestamp:'Timestamp documented',calibration:'Calibration verified',continuity:'Measurement continuity verified',actor:'Responsible actor identified',capacity:'Actor capacity established',standing_basis:'Standing basis documented',authority_relationship:'Authority relationship documented',applicable_policy:'Applicable policy established'};
type Action='investigate'|'change_ventilation'|'dismiss';
export default function ClassroomExam(){
 const [checked,setChecked]=useState<Record<string,boolean>>({});
 const [action,setAction]=useState<Action>('investigate');
 const [safety,setSafety]=useState(false);
 const [record,setRecord]=useState<Record<string,unknown>|null>(null);
 const examine=()=>{
  const missingEvidence=evidence.filter(k=>!checked[k]);
  const missingAuthority=authority.filter(k=>!checked[k]);
  let disposition:Disposition='HOLD';let reason='Evidence and/or authority not established';
  if(safety){disposition='ESCALATE';reason='Follow independently applicable safety procedures; no autonomous actuation'}
  else if(action==='dismiss'){reason='Dismissal is not authorized by this teaching fixture'}
  else if(missingEvidence.length||missingAuthority.length){reason='Evidence and/or authority not established'}
  else if(action==='change_ventilation'){reason='Physical intervention requires separate site-specific execution authorization'}
  else {disposition='ALLOW';reason='Simulated bounded investigation only; no real-world authority'}
  setRecord({case_id:'GA-CLASSROOM-001',simulation:true,observation:{CO2_ppm:1680,hypothetical:true},proposed_action:action,safety_escalation:safety,missingEvidence,missingAuthority,disposition,reason,examined_at:new Date().toISOString()});
 };
 const download=()=>{if(!record)return;const url=URL.createObjectURL(new Blob([JSON.stringify(record,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='governed-air-simulation.json';a.click();URL.revokeObjectURL(url)};
 return <main style={{minHeight:'100vh',background:'#071923',color:'#e7f5f9',padding:'40px 20px',fontFamily:'system-ui,sans-serif'}}>
 <div style={{maxWidth:980,margin:'auto'}}>
 <p style={{color:'#7ce2df',letterSpacing:3,fontSize:12}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · PRIVATE DEVELOPMENT PROTOTYPE</p>
 <h1 style={{fontSize:'clamp(42px,7vw,80px)',margin:'12px 0'}}>GOVERNED AIR<span style={{color:'#7ce2df'}}>.</span></h1>
 <p style={{fontSize:20}}>From environmental observation to accountable action.</p>
 <p><strong>SIMULATION ONLY.</strong> All readings, actors and policies are hypothetical. No clinical conclusion, regulatory approval, real-world execution authorization or equipment command.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))',gap:20,marginTop:30}}>
 <section style={{padding:24,border:'1px solid #346575',borderRadius:16,background:'#102d3b'}}>
 <p>CLASSROOM 001 · HYPOTHETICAL</p><h2 style={{fontSize:48,margin:'10px 0'}}>1,680 <small style={{fontSize:16}}>ppm CO₂</small></h2>
 <p>This number is not a universal health or legal threshold.</p><h3>Examine the evidence and authority</h3>
 {[...evidence,...authority].map(k=><label key={k} style={{display:'block',padding:'9px 0'}}><input type="checkbox" checked={!!checked[k]} onChange={e=>setChecked(v=>({...v,[k]:e.target.checked}))}/> {labels[k]}</label>)}
 </section>
 <section style={{padding:24,border:'1px solid #346575',borderRadius:16,background:'#102d3b'}}>
 <h2>Proposed consequence</h2>
 {([['investigate','Request bounded investigation'],['change_ventilation','Change ventilation controls'],['dismiss','Dismiss observation']] as const).map(([v,label])=><label key={v} style={{display:'block',padding:'10px 0'}}><input type="radio" name="action" checked={action===v} onChange={()=>setAction(v)}/> {label}</label>)}
 <label style={{display:'block',marginTop:15}}><input type="checkbox" checked={safety} onChange={e=>setSafety(e.target.checked)}/> Applicable safety procedure requires escalation</label>
 <button onClick={examine} style={{marginTop:20,padding:'13px 20px',background:'#79e0e0',color:'#07202b',border:0,borderRadius:9,fontWeight:700,cursor:'pointer'}}>Examine proposed action</button>
 <h3>Disposition</h3><div aria-live="polite" style={{fontSize:28,fontWeight:800,color:'#ffcf81'}}>{record?String(record.disposition):'AWAITING EXAMINATION'}</div>
 <p aria-live="polite">{record?String(record.reason):'Run the simulated examination to generate a decision record.'}</p>
 {record&&<><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',fontSize:12,background:'#061b25',padding:14,borderRadius:10}}>{JSON.stringify(record,null,2)}</pre><button onClick={download} style={{padding:12,cursor:'pointer'}}>Download JSON record</button></>}
 </section></div>
 <p style={{marginTop:35}}>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome.</p>
 <p><Link href="/" style={{color:'#82e6e7'}}>TA14 Exchange home</Link></p>
 </div></main>
}
