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

const coverageGroups=[
 {label:'Record Identity',ids:['source_identity','location']},
 {label:'Environmental Continuity',ids:['time_boundary','continuity']},
 {label:'Evidence Reliability',ids:['calibration','provenance']},
 {label:'Context Preservation',ids:['threshold_source','object_localization','proposition']},
 {label:'Change / Intervention Traceability',ids:['authority','conflict']},
] as const;

function coverageStatus(report:ReadinessReport,ids:readonly string[]){
 const found=ids.map(id=>report.findings.find(f=>f.id===id)).filter(Boolean);
 if(found.some(f=>f?.status==='CONFLICT'))return 'WEAK';
 const established=found.filter(f=>f?.status==='ESTABLISHED').length;
 const partial=found.filter(f=>f?.status==='PARTIAL').length;
 if(established===found.length&&found.length)return 'STRONG';
 if(established+partial>0)return 'PARTIAL';
 return 'MISSING';
}

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
   const entitlement=report.entitlement;
   const entitlementBlock=`PROPOSITION ENTITLEMENT\nEntitlement ID: ${entitlement.entitlementId}\nStanding: ${entitlement.standing}\nEntitled proposition: ${entitlement.proposition}\nInspection object: ${entitlement.boundary.inspectionObject}\nTemporal boundary: ${entitlement.boundary.temporalBoundary||'Not separately established'}\nSpatial boundary: ${entitlement.boundary.spatialBoundary||'Not separately established'}\nThreshold reference: ${entitlement.boundary.thresholdReference||'Not separately established'}\nLimitations:\n${entitlement.limitations.length?entitlement.limitations.map(x=>`- ${x}`).join('\n'):'- None declared'}\nProhibited extensions:\n${entitlement.prohibitedExtensions.map(x=>`- ${x}`).join('\n')}`;
   const payload={interpretationId:'',status:'DRAFT',version:'1.0',recordClass:recordClass.trim()||'Environmental Record',interpretationQuestion:entitlement.proposition,sourceRecordText:`GOVERNANCE READINESS RECORD\nEngine: ${report.engine} v${report.engineVersion}\nState: ${stateLabel(report.state)}\nGenerated: ${report.generatedAt}\nInspection object: ${report.inspectionObject}\n\n${entitlementBlock}\n\nADMITTED SOURCE PACKAGE\n---\n${sourceText}`,resultSummary:'',supportedFinding:report.supportedNow.join('\n'),continuityFinding:report.findings.find(f=>f.id==='continuity')?.detail||'',calibrationFinding:report.findings.find(f=>f.id==='calibration')?.detail||'',timeBoundaryFinding:report.findings.find(f=>f.id==='time_boundary')?.detail||'',refusedConclusion:entitlement.prohibitedExtensions.join('\n'),nextAdmissibleStep:'Perform bounded ERI interpretation only within the admitted proposition entitlement.',hasGap:report.findings.find(f=>f.id==='continuity')?.status==='PARTIAL',hasCalibrationConcern:['MISSING','PARTIAL'].includes(report.findings.find(f=>f.id==='calibration')?.status||''),hasTimeBoundary:report.findings.find(f=>f.id==='time_boundary')?.status==='ESTABLISHED',entitlementId:entitlement.entitlementId,entitlementStanding:entitlement.standing,entitledProposition:entitlement.proposition,entitlementBoundary:entitlement.boundary,entitlementLimitations:entitlement.limitations,prohibitedExtensions:entitlement.prohibitedExtensions,evidenceRefs:entitlement.evidenceRefs,createdAt:now,updatedAt:now};
   window.localStorage.setItem(WORKSPACE_KEY,JSON.stringify(payload));router.push('/workspace/environmental-records/interpreter');
 }

 function exportRecord(){if(!report)return;const publicRecord={recordClass,generatedAt:report.generatedAt,currentState:stateLabel(report.state),currentCoverageIndicator:report.score,coverageDomains:coverageGroups.map(g=>({domain:g.label,status:coverageStatus(report,g.ids)})),supportedNow:report.supportedNow,prohibitedInferences:report.prohibitedInferences,airComparison:{positioning:'Atmospheric Integrity Records are designed to provide broader governed environmental evidence coverage than ordinary monitoring or reporting records.',potentialCoverageDomains:['Attributable environmental history','Environmental continuity','Operating-context preservation','Changed-condition preservation','Intervention-to-outcome traceability','Bounded interpretation','Future-reliance capability','Environmental Integrity Governance compatibility']},notice:'This public comparison does not disclose TA-14 internal examination logic, admissibility rules, or AIR implementation architecture.'};const blob=new Blob([JSON.stringify(publicRecord,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`TA14_Environmental_Coverage_Comparison_${Date.now()}.json`;a.click();URL.revokeObjectURL(url);}

 return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 20% 0%,#17352d 0,#06110e 38%,#020706 80%)',color:'#effbf6',fontFamily:'Inter,system-ui,sans-serif'}}>
  <nav style={{display:'flex',justifyContent:'space-between',gap:16,padding:'18px clamp(20px,5vw,72px)',borderBottom:'1px solid rgba(120,240,190,.16)'}}><Link href='/environmental-integrity-governance' style={{color:'#7de8b5',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL INTEGRITY GOVERNANCE</Link><Link href='/workspace/environmental-records' style={{color:'#9bb8aa',textDecoration:'none'}}>Environmental Records Workspace</Link></nav>
  <section style={{maxWidth:1180,margin:'0 auto',padding:'68px 24px 28px'}}><p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.18em',fontSize:12}}>ENVIRONMENTAL RECORDS PLAYGROUND · CURRENT RECORD vs. AIR</p><h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(44px,7vw,76px)',lineHeight:1,margin:'14px 0 18px'}}>Bring what you have.<br/>See what stronger governance would cover.</h1><p style={{maxWidth:920,color:'#b7cec3',fontSize:18,lineHeight:1.7}}>TA-14 examines the environmental record you already use and shows its present governance coverage without requiring it to be a TA-14 record. The public result shows what your record currently supports, where consequential reliance remains limited, and the additional governance capabilities Atmospheric Integrity Records are designed to provide.</p><div style={{marginTop:22,padding:18,border:'1px solid rgba(255,211,106,.3)',background:'rgba(78,56,10,.18)',borderRadius:14,color:'#ecd797'}}><strong>PUBLIC BOUNDARY:</strong> The Playground shows governance coverage and value gaps. TA-14 internal examination logic, admissibility rules, weighting, dependencies, and AIR implementation architecture are not disclosed.</div></section>

  <section style={{maxWidth:1180,margin:'0 auto',padding:'18px 24px 36px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:18}}>
   <div style={{padding:26,border:'1px solid rgba(120,240,190,.22)',background:'rgba(5,23,17,.76)',borderRadius:18}}><small style={{color:'#71e5ad',fontWeight:900}}>01 · YOUR RECORD</small><label style={{display:'block',marginTop:18,fontWeight:800}}>Record class</label><input value={recordClass} onChange={e=>setRecordClass(e.target.value)} style={input}/><label style={label}>What are you asking this record to support?</label><textarea value={question} onChange={e=>setQuestion(e.target.value)} rows={4} style={area}/><label style={label}>Inspection object or condition</label><textarea value={object} onChange={e=>setObject(e.target.value)} rows={4} placeholder='Example: PM2.5 condition affecting occupied Room 204 from 14:00–15:00; cause and health consequence unresolved.' style={area}/></div>
   <div style={{padding:26,border:'1px solid rgba(130,187,255,.22)',background:'rgba(6,18,30,.76)',borderRadius:18}}><small style={{color:'#87bcff',fontWeight:900}}>02 · BRING WHAT YOU ALREADY HAVE</small><input type='file' multiple onChange={e=>setFiles(Array.from(e.target.files||[]))} style={{display:'block',marginTop:18,width:'100%',padding:14,border:'1px dashed rgba(130,187,255,.35)',borderRadius:12,background:'rgba(255,255,255,.025)',color:'#dcecff'}}/><p style={{color:'#9db3c5',lineHeight:1.6,fontSize:13}}>Parsed now: TXT, MD, CSV, JSON, LOG, XML. Other formats are declared but explicitly marked unparsed.</p>{files.map(f=><div key={`${f.name}-${f.size}`} style={{fontSize:13,color:'#c7d9e7',lineHeight:1.7}}>{readableExtensions.includes(extension(f.name))?'✓ PARSED':'◇ DECLARED ONLY'} · {f.name}</div>)}<label style={label}>Paste record text or explanatory notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={9} placeholder='Sensor output, laboratory text, field notes, report excerpts, equipment state, chronology, provenance, calibration information…' style={area}/></div>
   <div style={{gridColumn:'1 / -1',padding:26,border:'1px solid rgba(181,150,255,.24)',background:'rgba(25,17,42,.58)',borderRadius:18}}><small style={{color:'#c9afff',fontWeight:900}}>03 · COMPARE GOVERNANCE COVERAGE</small><p style={{maxWidth:850,color:'#cfc3df',lineHeight:1.65}}>The internal TA-14 engine evaluates the package privately. The public result exposes only high-level governance coverage, consequential limitations, and the capabilities an AIR implementation is designed to add.</p><button onClick={examine} style={button}>COMPARE MY RECORD TO AIR GOVERNANCE COVERAGE →</button>{status&&<p style={{color:'#ffd78a',fontWeight:800}}>{status}</p>}</div>
  </section>

  {report&&<section style={{maxWidth:1180,margin:'0 auto',padding:'0 24px 80px'}}>
   <div style={{padding:28,border:'1px solid rgba(120,240,190,.3)',background:'rgba(5,24,17,.84)',borderRadius:18}}><small style={{color:'#71e5ad',fontWeight:900}}>YOUR CURRENT RECORD · PUBLIC GOVERNANCE COVERAGE</small><div style={{display:'flex',flexWrap:'wrap',alignItems:'baseline',gap:18,marginTop:10}}><h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(30px,5vw,48px)',margin:0}}>{stateLabel(report.state)}</h2><strong style={{fontSize:28,color:'#8ff0c2'}}>{report.score}%</strong></div><p style={{color:'#a9c5b7'}}>Coverage indicator = percentage of evaluated governance capabilities presently evidenced. It is not an admissibility determination, certification, or statement that governance can be reduced to a score.</p></div>

   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12,marginTop:14}}>{coverageGroups.map(g=>{const s=coverageStatus(report,g.ids);return <article key={g.label} style={{padding:18,border:'1px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.025)',borderRadius:13}}><small style={{fontWeight:900,color:s==='STRONG'?'#8ff0c2':s==='MISSING'?'#ffad8e':'#f0cf75'}}>{s}</small><h3 style={{margin:'7px 0',fontSize:17}}>{g.label}</h3><p style={{margin:0,color:'#b7c9c0',lineHeight:1.55,fontSize:13}}>Public coverage classification only. Internal TA-14 examination criteria are not disclosed.</p></article>})}</div>

   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:14,marginTop:14}}><Panel title='WHAT YOUR RECORD CAN SUPPORT NOW' items={report.supportedNow}/><Panel title='WHERE RELIANCE REMAINS LIMITED' items={report.missingBeforeStrongerReliance.length?['Additional governance coverage is required before stronger reliance.','One or more internal readiness conditions remain unresolved.','TA-14 can provide an implementation review without disclosing proprietary examination logic.']:['No material readiness limitation was exposed by this public comparison.']}/><Panel title='PROHIBITED OVERREACH' items={report.prohibitedInferences}/></div>

   <div style={{marginTop:16,padding:28,border:'1px solid rgba(201,175,255,.34)',borderRadius:18,background:'linear-gradient(135deg,rgba(35,22,58,.8),rgba(10,18,24,.8))'}}><small style={{fontWeight:900,color:'#c9afff'}}>WITH TA-14 ATMOSPHERIC INTEGRITY RECORDS</small><h3 style={{fontFamily:'Georgia,serif',fontSize:'clamp(30px,5vw,46px)',margin:'8px 0 12px'}}>More than monitoring. A governed environmental evidence architecture.</h3><p style={{color:'#c9c5d4',lineHeight:1.7,maxWidth:900}}>AIR is designed to add governance capabilities ordinary environmental records often do not preserve consistently. This comparison shows the capability difference without exposing how TA-14 implements the architecture.</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginTop:16}}>{['Attributable environmental history','Stronger environmental continuity','Operating-context preservation','Changed-condition preservation','Intervention-to-outcome traceability','Bounded interpretation','Future-reliance capability','Environmental Integrity Governance compatibility'].map(x=><div key={x} style={{padding:14,border:'1px solid rgba(201,175,255,.16)',borderRadius:11,color:'#e4dcf0'}}>{x}</div>)}</div><div style={{marginTop:20,padding:16,borderLeft:'3px solid #c9afff',background:'rgba(255,255,255,.03)',color:'#d9d1e6'}}><strong>We show you the gap. We do not disclose the architecture that closes it.</strong></div><div style={{display:'flex',flexWrap:'wrap',gap:10,marginTop:18}}><button onClick={exportRecord} style={secondaryButton}>EXPORT COVERAGE COMPARISON</button><Link href='/environmental-integrity-governance' style={{...button,marginTop:0,textDecoration:'none',display:'inline-flex',alignItems:'center'}}>EXPLORE AIR / EIG IMPLEMENTATION →</Link></div></div>

   {report.eriEligible&&<div style={{marginTop:16,padding:24,border:'1px solid rgba(120,240,190,.4)',borderRadius:16,background:'rgba(8,43,30,.68)'}}><small style={{fontWeight:900,color:'#8ff0c2'}}>BOUNDED INTERPRETATION AVAILABLE</small><h3 style={{fontFamily:'Georgia,serif',fontSize:28,margin:'8px 0'}}>This package may enter the protected ERI interpretation boundary.</h3><p style={{color:'#c4d3cc',lineHeight:1.6}}>The admitted evidence package will carry its established proposition entitlement into ERI. Interpretation remains bounded by that entitlement and does not create intervention authority.</p><button onClick={enterEri} style={button}>ENTER ERI WITH ENTITLED EVIDENCE →</button></div>}
  </section>}
 </main>;
}

function Panel({title,items}:{title:string;items:string[]}){return <div style={{padding:22,border:'1px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.025)',borderRadius:14}}><h3 style={{fontSize:14,letterSpacing:'.08em',color:'#d8e8e0'}}>{title}</h3>{items.map((x,i)=><p key={i} style={{color:'#b7c9c0',lineHeight:1.55,fontSize:14}}>• {x}</p>)}</div>}
const input={width:'100%',boxSizing:'border-box' as const,marginTop:8,padding:12,borderRadius:10,border:'1px solid rgba(255,255,255,.14)',background:'#07100d',color:'#eefbf5'};
const area={...input,resize:'vertical' as const,lineHeight:1.55};
const label={display:'block',marginTop:16,fontWeight:800};
const button={marginTop:12,border:0,borderRadius:10,padding:'13px 17px',fontWeight:950,background:'#7de8b5',color:'#042217',cursor:'pointer'};
const secondaryButton={...button,background:'transparent',color:'#c9afff',border:'1px solid rgba(201,175,255,.42)'};
