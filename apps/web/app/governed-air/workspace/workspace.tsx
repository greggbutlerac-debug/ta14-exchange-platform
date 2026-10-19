'use client';
import {useState} from 'react';
import classroomCase from '../../../../../governed-air/cases/classroom-ventilation-hold.v0.1.json';
import {examineUnverifiedClaims} from '../../../../../governed-air/workspace-boundary.mjs';
import {explainUnverifiedExamination, type BrowserExamination} from '../../../../../governed-air/browser-explanation.mjs';
import {explainGovernanceGaps, type GovernanceGap} from '../../../../../governed-air/gap-explanation.mjs';

const evidenceKeys=['source','timestamp','calibration','continuity'] as const;
const authorityKeys=['actor','capacity','standing_basis','authority_relationship','applicable_policy'] as const;
const labels:Record<string,string>={
 source:'Observation source',timestamp:'Observation timestamp',calibration:'Calibration / verification basis',continuity:'Continuity and provenance',
 actor:'Responsible actor',capacity:'Actor capacity',standing_basis:'Established standing basis',
 authority_relationship:'Authority relationship',applicable_policy:'Applicable policy or rule'
};
const anchors=['Reality','Record','Continuity','Admissibility','Binding','Commit','Execution','Outcome'];
type Action='investigate'|'change_ventilation'|'dismiss';
type Result={disposition:string;reason:string;missingEvidence:string[];missingAuthority:string[];simulation:boolean};
type Examination={gaps:GovernanceGap[];pipeline:BrowserExamination;case_id:string;simulation:true;created_at:string;observation:{description:string;value:string;unit:string};evidence:Record<string,string>;authority:Record<string,string>;proposed_action:Action;safety_escalation:boolean;result:Result};
export default function ExaminationWorkspace(){
 const [caseId,setCaseId]=useState('GA-WORKSPACE-DEMO-001');
 const [description,setDescription]=useState('Hypothetical classroom CO₂ observation; no verified field record.');
 const [value,setValue]=useState('1680');
 const [unit,setUnit]=useState('ppm');
 const [fields,setFields]=useState<Record<string,string>>({});
 const [action,setAction]=useState<Action>('investigate');
 const [escalation,setEscalation]=useState(false);
 const [record,setRecord]=useState<Examination|null>(null);
 const [serverResult,setServerResult]=useState<{disposition:string;reason:string;trace:{anchor:string;status:string;note:string}[];executionAuthorized:boolean}|null>(null);
 const [serverError,setServerError]=useState('');
 const [examining,setExamining]=useState(false);
 const [loadedFixture,setLoadedFixture]=useState(false);
 const loadClassroomCase=()=>{const c=classroomCase;setCaseId(c.case_id);setDescription(c.observation.description);setValue(c.observation.value);setUnit(c.observation.unit);setFields({...c.evidence,...c.authority});setAction('change_ventilation');setEscalation(false);setRecord(null);setServerResult(null);setServerError('');setLoadedFixture(true)};
 const change=(key:string,value:string)=>{setFields(v=>({...v,[key]:value}));setRecord(null);setServerResult(null)};
 const examine=async()=>{
  const evidence=Object.fromEntries(evidenceKeys.map(k=>[k,fields[k]||'']));
  const authority=Object.fromEntries(authorityKeys.map(k=>[k,fields[k]||'']));
  const result=examineUnverifiedClaims({evidence,authority,proposed_action:action,safety_escalation:escalation}) as Result;
  const pipeline=explainUnverifiedExamination({observation:{description,value,unit},evidence,authority,proposed_action:action});
  const gaps=explainGovernanceGaps({evidence,authority});
  setRecord({gaps,pipeline,case_id:caseId,simulation:true,created_at:new Date().toISOString(),observation:{description,value,unit},evidence,authority,proposed_action:action,safety_escalation:escalation,result});
  setServerResult(null);setServerError('');setExamining(true);
  try {
   const response=await fetch('/api/governed-air/examine',{method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',body:JSON.stringify({observation:{description,value,unit},evidence,authority,proposed_action:action,safety_escalation:escalation,binding:{tenant_id:'unverified-demo',case_id:caseId,subject_id:'unverified-observation',action,site_id:'unverified-site',policy_version:'unverified-policy'}})});
   if(!response.ok) throw new Error('Server examination unavailable ('+response.status+')');
   const data=await response.json();
   if(!Array.isArray(data.trace)||data.executionAuthorized!==false||data.disposition!=='HOLD')throw new Error('Unexpected examination response; authorization not accepted');
   setServerResult(data);
  }catch(error){setServerError(error instanceof Error?error.message:'Server examination unavailable');}
  finally{setExamining(false)}
 };
 const download=()=>{if(!record)return;const blob=new Blob([JSON.stringify(record,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='governed-air-examination-simulation.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 const input=(label:string,v:string,set:(v:string)=>void,placeholder='')=><label style={{display:'grid',gap:6,fontSize:13,color:'#a9d4df'}}>{label}<input aria-label={label} value={v} placeholder={placeholder} onChange={e=>{set(e.target.value);setRecord(null)}} style={{background:'#071e2b',border:'1px solid #457483',borderRadius:8,color:'white',padding:11,fontSize:15}}/></label>;
 const section={padding:22,border:'1px solid #346575',borderRadius:14,background:'#102d3b'};
 return <main style={{minHeight:'100vh',background:'#071923',color:'#e7f5f9',padding:'35px 18px',fontFamily:'system-ui,sans-serif'}}>
 <div style={{maxWidth:1150,margin:'auto'}}>
 <p style={{color:'#7ce2df',letterSpacing:2,fontSize:12}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · PRIVATE DEVELOPMENT</p>
 <h1 style={{fontSize:'clamp(32px,5vw,60px)',margin:'8px 0'}}>Governed Air <span style={{color:'#7ce2df'}}>Examination Workspace</span></h1>
 <p style={{maxWidth:880,lineHeight:1.65}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p>
 <p style={{borderLeft:'3px solid #f1bb71',paddingLeft:14,lineHeight:1.6}}><strong>SIMULATION ONLY.</strong> All information is hypothetical and entered for teaching. Text entries are claims, not independently verified evidence or authority. This tool cannot approve field work, control equipment, or confer legal standing. Records remain in this browser session until downloaded.</p>
 <section style={{...section,marginTop:20,borderColor:'#638e9a'}}><h2>Guided hypothetical case</h2><p>Load a fictional classroom observation and examine a proposed ventilation control change. No reading here is a health threshold, site instruction, or verified instrument record.</p><button type="button" onClick={loadClassroomCase} style={{padding:'12px 18px',borderRadius:8,background:'#79e0e0',color:'#071923',fontWeight:800,cursor:'pointer'}}>Load classroom ventilation case</button>{loadedFixture&&<p style={{fontSize:13,color:'#a9d4df'}}>Case GA-CASE-SCHOOL-001 loaded. Select “Examine proposed consequence” below. You may edit claims and examine again; text alone never establishes authority.</p>}</section>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(310px,1fr))',gap:18,marginTop:24}}>
 <section style={section}><h2>01 · Proposed reality</h2>
 <div style={{display:'grid',gap:14}}>
 {input('Case identifier',caseId,setCaseId)}
 <label style={{display:'grid',gap:6,fontSize:13,color:'#a9d4df'}}>Observation description<textarea aria-label="Observation description" value={description} onChange={e=>{setDescription(e.target.value);setRecord(null)}} rows={4} style={{background:'#071e2b',border:'1px solid #457483',borderRadius:8,color:'white',padding:11}}/></label>
 {input('Observed value (hypothetical)',value,setValue)}
 {input('Unit',unit,setUnit)}
 </div></section>
 <section style={section}><h2>02 · Admissible evidence claims</h2><p style={{fontSize:13,color:'#a9d4df'}}>Provide the claimed source, timestamp, verification and continuity. Blank entries hold the simulated investigation.</p><div style={{display:'grid',gap:14}}>{evidenceKeys.map(k=><label key={k} style={{display:'grid',gap:6,fontSize:13,color:'#a9d4df'}}>{labels[k]}<input aria-label={labels[k]} value={fields[k]||''} onChange={e=>change(k,e.target.value)} placeholder="Enter hypothetical record or reference" style={{background:'#071e2b',border:'1px solid #457483',borderRadius:8,color:'white',padding:11}}/></label>)}</div></section>
 <section style={section}><h2>03 · Authority and standing claims</h2><p style={{fontSize:13,color:'#a9d4df'}}>An identified actor is not automatically authorized. Each relationship must be established independently in a real examination.</p><div style={{display:'grid',gap:14}}>{authorityKeys.map(k=><label key={k} style={{display:'grid',gap:6,fontSize:13,color:'#a9d4df'}}>{labels[k]}<input aria-label={labels[k]} value={fields[k]||''} onChange={e=>change(k,e.target.value)} placeholder="Enter hypothetical basis or reference" style={{background:'#071e2b',border:'1px solid #457483',borderRadius:8,color:'white',padding:11}}/></label>)}</div></section>
 <section style={section}><h2>04 · Proposed consequence</h2>
 <div style={{display:'grid',gap:12}}>{([['investigate','Request bounded investigation'],['change_ventilation','Change ventilation controls'],['dismiss','Dismiss observation']] as const).map(([v,label])=><label key={v}><input type="radio" name="workspace-action" checked={action===v} onChange={()=>{setAction(v);setRecord(null)}}/> {label}</label>)}
 <label><input type="checkbox" checked={escalation} onChange={e=>{setEscalation(e.target.checked);setRecord(null)}}/> Safety procedure requires escalation</label>
 <button disabled={examining} onClick={examine} style={{padding:14,background:'#79e0e0',color:'#071923',fontWeight:800,border:0,borderRadius:8,cursor:'pointer'}}>{examining?'Examining…':'Examine proposed consequence'}</button>
 {serverError&&<p role="alert" style={{color:'#ffce83'}}>Server examination unavailable: {serverError}. Local claim review remains simulation-only.</p>}
 {serverResult&&<p style={{fontSize:13,color:'#86dfce'}}>Server-side examination received: {serverResult.disposition}. Execution authorized: No.</p>}
 <h3>Disposition: <span aria-live="polite" style={{color:'#ffce83'}}>{record?.result.disposition||'AWAITING EXAMINATION'}</span></h3>
 <p aria-live="polite">{record?.result.reason||'No examination has been performed for the current inputs.'}</p>
 {record&&<><div style={{border:'1px solid #457483',borderRadius:10,padding:14,background:'#071e2b'}}><h4 style={{margin:'0 0 10px'}}>Examination requirement review</h4><p style={{fontSize:12,color:'#a9d4df'}}>Claim present means text was supplied, not that the claim is verified or admissible. No real-world authority is established.</p>{[...evidenceKeys,...authorityKeys].map(k=>{const missing=[...record.result.missingEvidence,...record.result.missingAuthority].includes(k);return <div key={k} style={{display:'flex',justifyContent:'space-between',gap:12,borderTop:'1px solid #274958',padding:'9px 0',fontSize:13}}><span>{labels[k]}</span><strong style={{color:missing?'#ffce83':'#86dfce',textAlign:'right'}}>{missing?'MISSING':'CLAIM PRESENT · UNVERIFIED'}</strong></div>})}</div><p><strong>Missing evidence:</strong> {record.result.missingEvidence.map(k=>labels[k]).join(', ')||'No blank fields; claims unverified'}</p><p><strong>Missing authority or standing:</strong> {record.result.missingAuthority.map(k=>labels[k]).join(', ')||'No blank fields; claims unverified'}</p><p style={{fontSize:13,color:'#a9d4df'}}><strong>Disposition boundary:</strong> {record.result.disposition==='ALLOW'?'Simulation-only bounded investigation; not execution authorization.':record.result.disposition==='ESCALATE'?'Refer to the independently applicable safety process.':record.result.disposition==='DENY'?'The request cannot proceed in this fixture.':'Do not advance this proposed consequence without resolving the stated limitation.'}</p><button onClick={download} style={{padding:12,cursor:'pointer'}}>Download simulated examination JSON</button></>}
 </div></section>
 </div>
 <section style={{...section,marginTop:18}}><h2>Evidence and authority requirements</h2><p style={{fontSize:13,color:'#a9d4df'}}>A completed field is not an established fact. Every requirement below remains unverified until independent examination. These instructions are not an authorization to act.</p>{record?<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',gap:10}}>{record.gaps.map(gap=><div key={gap.id} style={{padding:13,background:'#071e2b',border:'1px solid #457483',borderRadius:9}}><strong>{gap.gate} · {gap.label}</strong><p style={{fontSize:12,color:'#ffce83',fontWeight:700}}>{gap.claimStatus.replaceAll('_',' ')}</p><p style={{fontSize:13,color:'#a9d4df'}}><strong>Required proof:</strong> {gap.requiredProof}</p></div>)}</div>:<p>Run an examination to display the exact missing or unverified requirements.</p>}</section>
 <section style={{...section,marginTop:18}}><h2>Eight-anchor consequence chain</h2><p style={{fontSize:13,color:'#a9d4df'}}>Live examination trace of the current simulated record. No institutional trust keys or attestation are configured in this browser workspace. Anchor statuses do not authorize execution.</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10}}>{(serverResult?.trace||record?.pipeline.trace||anchors.map(anchor=>({anchor,status:'AWAITING_EXAMINATION',note:'Run an examination to inspect this gate'}))).map((item,i)=><div key={item.anchor} style={{background:'#071e2b',border:'1px solid #457483',borderRadius:9,padding:13}}><strong>{String(i+1).padStart(2,'0')} · {item.anchor}</strong><p style={{color:'#ffce83',fontSize:12,fontWeight:700,overflowWrap:'anywhere'}}>{item.status.replaceAll('_',' ')}</p><p style={{fontSize:12,color:'#a9d4df'}}>{item.note}</p></div>)}</div>{record&&<p style={{fontSize:13}}><strong>Examination source:</strong> {serverResult?'Server-side fail-closed pipeline':'Local explanatory fallback'}. <strong>Execution authorized:</strong> No.</p>}</section>
 </div></main>;
}
