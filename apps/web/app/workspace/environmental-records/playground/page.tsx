'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { examineEnvironmentalReadiness, type ReadinessReport } from './readiness-engine';

const WORKSPACE_KEY='ta14-governed-record-interpreter-workspace-v2';
const READINESS_KEY='ta14-environmental-governance-readiness-v1';
const readableExtensions=['txt','md','csv','json','log','xml'];
function extension(name:string){const p=name.toLowerCase().split('.');return p.length>1?p.pop()||'':'';}
function stateLabel(state:string){return state.replaceAll('_',' ');}

export default function EnvironmentalRecordsPlayground(){
 const router=useRouter();
 const [recordClass,setRecordClass]=useState('Environmental Record');
 const [question,setQuestion]=useState('What can this environmental record actually support?');
 const [object,setObject]=useState('');
 const [notes,setNotes]=useState('');
 const [files,setFiles]=useState<File[]>([]);
 const [status,setStatus]=useState('');
 const [report,setReport]=useState<ReadinessReport|null>(null);
 const [sourceText,setSourceText]=useState('');
 const supported=useMemo(()=>files.filter(f=>readableExtensions.includes(extension(f.name))),[files]);
 const unsupported=useMemo(()=>files.filter(f=>!readableExtensions.includes(extension(f.name))),[files]);

 async function assemble(){
   const sections:string[]=[];
   for(const file of supported){const text=await file.text();sections.push(`SOURCE FILE: ${file.name}\nMEDIA TYPE: ${file.type||'unknown'}\nSIZE: ${file.size} bytes\n---\n${text}`);}
   if(notes.trim())sections.push(`SUBMITTED NOTES / PASTED RECORD\n---\n${notes.trim()}`);
   if(unsupported.length)sections.push(`UNPARSED ATTACHMENTS DECLARED\n---\n${unsupported.map(f=>`${f.name} (${f.type||'unknown'}, ${f.size} bytes)`).join('\n')}\nThese files were identified but not text-parsed. They are not inspected evidence.`);
   return sections.join('\n\n==============================\n\n');
 }

 async function examine(){
   if(!files.length&&!notes.trim()){setStatus('HOLD — bring at least one readable record or paste source material.');return;}
   const text=await assemble(); setSourceText(text);
   const next=examineEnvironmentalReadiness({text,inspectionObject:object,proposition:question,recordClass});
   setReport(next); setStatus(''); window.localStorage.setItem(READINESS_KEY,JSON.stringify({...next,recordClass,sourceText:text,declaredFiles:files.map(f=>({name:f.name,type:f.type,size:f.size,parsed:readableExtensions.includes(extension(f.name))}))}));
 }

 function enterEri(){
   if(!report||!report.eriEligible)return;
   const now=new Date().toISOString();
   const payload={interpretationId:'',status:'DRAFT',version:'1.0',recordClass:recordClass.trim()||'Environmental Record',interpretationQuestion:question.trim(),sourceRecordText:`GOVERNANCE READINESS RECORD\nEngine: ${report.engine} v${report.engineVersion}\nState: ${stateLabel(report.state)}\nGenerated: ${report.generatedAt}\nInspection object: ${report.inspectionObject}\n\nADMITTED SOURCE PACKAGE\n---\n${sourceText}`,resultSummary:'',supportedFinding:report.supportedNow.join('\n'),continuityFinding:report.findings.find(f=>f.id==='continuity')?.detail||'',calibrationFinding:report.findings.find(f=>f.id==='calibration')?.detail||'',timeBoundaryFinding:report.findings.find(f=>f.id==='time_boundary')?.detail||'',refusedConclusion:report.prohibitedInferences.join('\n'),nextAdmissibleStep:'Perform bounded ERI interpretation against the admitted evidence package.',hasGap:report.findings.find(f=>f.id==='continuity')?.status==='PARTIAL',hasCalibrationConcern:['MISSING','PARTIAL'].includes(report.findings.find(f=>f.id==='calibration')?.status||''),hasTimeBoundary:report.findings.find(f=>f.id==='time_boundary')?.status==='ESTABLISHED',createdAt:now,updatedAt:now};
   window.localStorage.setItem(WORKSPACE_KEY,JSON.stringify(payload));router.push('/workspace/environmental-records/interpreter');
 }

 function exportRecord(){if(!report)return;const blob=new Blob([JSON.stringify({...report,recordClass,declaredFiles:files.map(f=>({name:f.name,type:f.type,size:f.size,parsed:readableExtensions.includes(extension(f.name))}))},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`TA14_Governance_Readiness_${Date.now()}.json`;a.click();URL.revokeObjectURL(url);}

 return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 20% 0%,#17352d 0,#06110e 38%,#020706 80%)',color:'#effbf6',fontFamily:'Inter,system-ui,sans-serif'}}>
  <nav style={{display:'flex',justifyContent:'space-between',gap:16,padding:'18px clamp(20px,5vw,72px)',borderBottom:'1px solid rgba(120,240,190,.16)'}}><Link href='/environmental-integrity-governance' style={{color:'#7de8b5',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL INTEGRITY GOVERNANCE</Link><Link href='/workspace/environmental-records' style={{color:'#9bb8aa',textDecoration:'none'}}>Environmental Records Workspace</Link></nav>
  <section style={{maxWidth:1180,margin:'0 auto',padding:'68px 24px 28px'}}><p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.18em',fontSize:12}}>TA-14 ENVIRONMENTAL GOVERNANCE READINESS INTERPRETER · v1.0</p><h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(44px,7vw,76px)',lineHeight:1,margin:'14px 0 18px'}}>Bring what you have.<br/>Find what governance requires.</h1><p style={{maxWidth:920,color:'#b7cec3',fontSize:18,lineHeight:1.7}}>The Playground accepts imperfect environmental evidence and examines its present governance readiness. It distinguishes what is established, partial, missing, conflicting, and not applicable before any evidence is permitted to enter ERI.</p><div style={{marginTop:22,padding:18,border:'1px solid rgba(255,211,106,.3)',background:'rgba(78,56,10,.18)',borderRadius:14,color:'#ecd797'}}><strong>ADMISSIBILITY FIREWALL:</strong> ERI remains read-only and downstream. A readiness examination is not an ERI interpretation, and interpretation readiness is not authority to execute.</div></section>

  <section style={{maxWidth:1180,margin:'0 auto',padding:'18px 24px 36px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:18}}>
   <div style={{padding:26,border:'1px solid rgba(120,240,190,.22)',background:'rgba(5,23,17,.76)',borderRadius:18}}><small style={{color:'#71e5ad',fontWeight:900}}>01 · BOUND THE QUESTION</small><label style={{display:'block',marginTop:18,fontWeight:800}}>Record class</label><input value={recordClass} onChange={e=>setRecordClass(e.target.value)} style={input}/><label style={label}>What are you asking this record to establish?</label><textarea value={question} onChange={e=>setQuestion(e.target.value)} rows={4} style={area}/><label style={label}>Localized inspection object</label><textarea value={object} onChange={e=>setObject(e.target.value)} rows={4} placeholder='Example: PM2.5 condition affecting occupied Room 204 from 14:00–15:00; source and health consequence unresolved.' style={area}/></div>
   <div style={{padding:26,border:'1px solid rgba(130,187,255,.22)',background:'rgba(6,18,30,.76)',borderRadius:18}}><small style={{color:'#87bcff',fontWeight:900}}>02 · BRING WHAT YOU HAVE</small><input type='file' multiple onChange={e=>setFiles(Array.from(e.target.files||[]))} style={{display:'block',marginTop:18,width:'100%',padding:14,border:'1px dashed rgba(130,187,255,.35)',borderRadius:12,background:'rgba(255,255,255,.025)',color:'#dcecff'}}/><p style={{color:'#9db3c5',lineHeight:1.6,fontSize:13}}>Parsed now: TXT, MD, CSV, JSON, LOG, XML. Other formats are declared but explicitly marked unparsed.</p>{files.map(f=><div key={`${f.name}-${f.size}`} style={{fontSize:13,color:'#c7d9e7',lineHeight:1.7}}>{readableExtensions.includes(extension(f.name))?'✓ PARSED':'◇ DECLARED ONLY'} · {f.name}</div>)}<label style={label}>Paste record text or explanatory notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={9} placeholder='Sensor output, laboratory text, field notes, report excerpts, equipment state, chronology, provenance, calibration information…' style={area}/></div>
   <div style={{gridColumn:'1 / -1',padding:26,border:'1px solid rgba(181,150,255,.24)',background:'rgba(25,17,42,.58)',borderRadius:18}}><small style={{color:'#c9afff',fontWeight:900}}>03 · GOVERNANCE READINESS EXAMINATION</small><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:9,marginTop:15}}>{['Source identity','Time boundary','Location','Calibration','Continuity','Provenance','Threshold source','Object localization','Bounded proposition','Evidence conflict','Authority'].map(x=><div key={x} style={{padding:12,border:'1px solid rgba(201,175,255,.14)',borderRadius:10,color:'#d9d0e8',fontSize:13}}>{x}</div>)}</div><button onClick={examine} style={button}>EXAMINE GOVERNANCE READINESS →</button>{status&&<p style={{color:'#ffd78a',fontWeight:800}}>{status}</p>}</div>
  </section>

  {report&&<section style={{maxWidth:1180,margin:'0 auto',padding:'0 24px 80px'}}>
   <div style={{padding:28,border:'1px solid rgba(120,240,190,.3)',background:'rgba(5,24,17,.84)',borderRadius:18}}><small style={{color:'#71e5ad',fontWeight:900}}>GOVERNANCE READINESS RECORD · {report.engine} v{report.engineVersion}</small><div style={{display:'flex',flexWrap:'wrap',alignItems:'baseline',gap:18,marginTop:10}}><h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(30px,5vw,48px)',margin:0}}>{stateLabel(report.state)}</h2><strong style={{fontSize:28,color:'#8ff0c2'}}>{report.score}/100</strong></div><p style={{color:'#a9c5b7'}}>This score is a navigation aid, not an admissibility determination. The explicit findings control.</p></div>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12,marginTop:14}}>{report.findings.map(f=><article key={f.id} style={{padding:18,border:'1px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.025)',borderRadius:13}}><small style={{fontWeight:900,color:f.status==='ESTABLISHED'?'#8ff0c2':f.status==='MISSING'?'#ffad8e':f.status==='CONFLICT'?'#ff8f8f':'#f0cf75'}}>{f.status}</small><h3 style={{margin:'7px 0',fontSize:17}}>{f.label}</h3><p style={{margin:0,color:'#b7c9c0',lineHeight:1.55,fontSize:13}}>{f.detail}</p></article>)}</div>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:14,marginTop:14}}><Panel title='WHAT THE PACKAGE SUPPORTS NOW' items={report.supportedNow}/><Panel title='MISSING BEFORE STRONGER RELIANCE' items={report.missingBeforeStrongerReliance.length?report.missingBeforeStrongerReliance:['No readiness gaps detected by v1 rules.']}/><Panel title='PROHIBITED INFERENCES' items={report.prohibitedInferences}/><Panel title='NEXT ADMISSIBLE STEPS' items={report.nextAdmissibleSteps}/></div>
   <div style={{marginTop:16,padding:24,border:report.eriEligible?'1px solid rgba(120,240,190,.4)':'1px solid rgba(255,173,142,.35)',borderRadius:16,background:report.eriEligible?'rgba(8,43,30,.68)':'rgba(49,22,10,.55)'}}><small style={{fontWeight:900,color:report.eriEligible?'#8ff0c2':'#ffad8e'}}>ERI ADMISSIBILITY FIREWALL</small><h3 style={{fontFamily:'Georgia,serif',fontSize:28,margin:'8px 0'}}>{report.eriEligible?'Evidence package eligible to enter bounded ERI interpretation.':'HOLD — evidence package does not cross into ERI.'}</h3><p style={{color:'#c4d3cc',lineHeight:1.6}}>{report.eriEligible?'The v1 readiness requirements are established for the declared interpretation boundary. ERI may interpret the admitted package; it still cannot authorize execution.':'Resolve the identified readiness gaps. Raw or insufficient evidence remains outside the ERI interpretation boundary.'}</p><div style={{display:'flex',flexWrap:'wrap',gap:10}}><button onClick={exportRecord} style={secondaryButton}>EXPORT READINESS RECORD</button><button onClick={enterEri} disabled={!report.eriEligible} style={{...button,marginTop:0,opacity:report.eriEligible?1:.4,cursor:report.eriEligible?'pointer':'not-allowed'}}>ENTER ERI →</button></div></div>
  </section>}
 </main>;
}

const input={width:'100%',marginTop:8,padding:13,borderRadius:10,border:'1px solid rgba(120,240,190,.2)',background:'#06110e',color:'#effbf6'} as const;
const area={...input,resize:'vertical' as const};
const label={display:'block',marginTop:18,fontWeight:800} as const;
const button={marginTop:22,cursor:'pointer',padding:'15px 20px',border:0,borderRadius:11,background:'linear-gradient(135deg,#aaf6d6,#6fe2ae)',color:'#03120c',fontWeight:950,fontSize:14} as const;
const secondaryButton={...button,marginTop:0,background:'rgba(255,255,255,.06)',color:'#d9e8e1',border:'1px solid rgba(255,255,255,.15)'} as const;
function Panel({title,items}:{title:string;items:string[]}){return <div style={{padding:20,border:'1px solid rgba(255,255,255,.09)',background:'rgba(3,12,9,.66)',borderRadius:14}}><small style={{fontWeight:900,color:'#9fc7b5'}}>{title}</small>{items.map((x,i)=><p key={`${x}-${i}`} style={{color:'#c4d3cc',fontSize:13,lineHeight:1.55,margin:'10px 0 0'}}>• {x}</p>)}</div>}
