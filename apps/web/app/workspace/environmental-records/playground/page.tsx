'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const WORKSPACE_KEY = 'ta14-governed-record-interpreter-workspace-v2';
const readableExtensions = ['txt','md','csv','json','log','xml'];

function extension(name:string){
  const parts=name.toLowerCase().split('.');
  return parts.length>1?parts.pop()||'':'';
}

export default function EnvironmentalRecordsPlayground(){
  const router=useRouter();
  const [recordClass,setRecordClass]=useState('Environmental Record');
  const [question,setQuestion]=useState('What can this environmental record actually support?');
  const [object,setObject]=useState('');
  const [notes,setNotes]=useState('');
  const [files,setFiles]=useState<File[]>([]);
  const [status,setStatus]=useState('');

  const supported=useMemo(()=>files.filter(f=>readableExtensions.includes(extension(f.name))),[files]);
  const unsupported=useMemo(()=>files.filter(f=>!readableExtensions.includes(extension(f.name))),[files]);

  async function process(){
    if(!files.length && !notes.trim()){
      setStatus('HOLD — bring at least one readable record or paste source material.');
      return;
    }
    const sections:string[]=[];
    for(const file of supported){
      const text=await file.text();
      sections.push(`SOURCE FILE: ${file.name}\nMEDIA TYPE: ${file.type||'unknown'}\nSIZE: ${file.size} bytes\n---\n${text}`);
    }
    if(notes.trim()) sections.push(`SUBMITTED NOTES / PASTED RECORD\n---\n${notes.trim()}`);
    if(unsupported.length){
      sections.push(`UNPARSED ATTACHMENTS DECLARED\n---\n${unsupported.map(f=>`${f.name} (${f.type||'unknown'}, ${f.size} bytes)`).join('\n')}\nThese files were identified but not text-parsed in this browser intake. They must not be treated as inspected evidence.`);
    }
    if(object.trim()) sections.unshift(`LOCALIZED INSPECTION OBJECT\n---\n${object.trim()}`);

    const now=new Date().toISOString();
    const payload={
      interpretationId:'',
      status:'DRAFT',
      version:'1.0',
      recordClass:recordClass.trim()||'Environmental Record',
      interpretationQuestion:question.trim()||'What can this environmental record actually support?',
      sourceRecordText:sections.join('\n\n==============================\n\n'),
      resultSummary:'',supportedFinding:'',continuityFinding:'',calibrationFinding:'',timeBoundaryFinding:'',refusedConclusion:'',nextAdmissibleStep:'',
      hasGap:false,hasCalibrationConcern:false,hasTimeBoundary:false,createdAt:now,updatedAt:now,
    };
    window.localStorage.setItem(WORKSPACE_KEY,JSON.stringify(payload));
    router.push('/workspace/environmental-records/interpreter');
  }

  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 20% 0%,#17352d 0,#06110e 38%,#020706 80%)',color:'#effbf6',fontFamily:'Inter,system-ui,sans-serif'}}>
    <nav style={{display:'flex',justifyContent:'space-between',gap:16,padding:'18px clamp(20px,5vw,72px)',borderBottom:'1px solid rgba(120,240,190,.16)'}}>
      <Link href='/environmental-integrity-governance' style={{color:'#7de8b5',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL INTEGRITY GOVERNANCE</Link>
      <Link href='/workspace/environmental-records' style={{color:'#9bb8aa',textDecoration:'none'}}>Environmental Records Workspace</Link>
    </nav>

    <section style={{maxWidth:1180,margin:'0 auto',padding:'72px 24px 32px'}}>
      <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.18em',fontSize:12}}>DOOR 03 · ENVIRONMENTAL RECORDS PLAYGROUND</p>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(44px,7vw,78px)',lineHeight:1,margin:'14px 0 18px'}}>Bring the evidence.<br/>Ask the bounded question.</h1>
      <p style={{maxWidth:900,color:'#b7cec3',fontSize:18,lineHeight:1.7}}>Start with the environmental record as it exists. The Playground normalizes readable source material and passes it into the existing TA-14 Governed Record Interpreter so the evidence can be tested without silently becoming diagnosis, certification, causation, or permission to act.</p>
      <div style={{marginTop:24,padding:18,border:'1px solid rgba(255,211,106,.3)',background:'rgba(78,56,10,.18)',borderRadius:14,color:'#ecd797'}}><strong>GOVERNING RULE:</strong> Localization identifies the inspection object. Interpretation tests what the record can support. Neither step automatically establishes authority for consequence.</div>
    </section>

    <section style={{maxWidth:1180,margin:'0 auto',padding:'20px 24px 72px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:18}}>
      <div style={{padding:26,border:'1px solid rgba(120,240,190,.22)',background:'rgba(5,23,17,.76)',borderRadius:18}}>
        <small style={{color:'#71e5ad',fontWeight:900}}>01 · BOUND THE QUESTION</small>
        <label style={{display:'block',marginTop:18,fontWeight:800}}>Record class</label>
        <input value={recordClass} onChange={e=>setRecordClass(e.target.value)} style={{width:'100%',marginTop:8,padding:13,borderRadius:10,border:'1px solid rgba(120,240,190,.2)',background:'#06110e',color:'#effbf6'}} />
        <label style={{display:'block',marginTop:18,fontWeight:800}}>What are you asking this record to establish?</label>
        <textarea value={question} onChange={e=>setQuestion(e.target.value)} rows={4} style={{width:'100%',marginTop:8,padding:13,borderRadius:10,border:'1px solid rgba(120,240,190,.2)',background:'#06110e',color:'#effbf6',resize:'vertical'}} />
        <label style={{display:'block',marginTop:18,fontWeight:800}}>Localized inspection object <span style={{color:'#839b90',fontWeight:500}}>(optional)</span></label>
        <textarea value={object} onChange={e=>setObject(e.target.value)} rows={4} placeholder='Example: Humidity condition affecting Rooms 201–203 during occupied hours; cause unresolved.' style={{width:'100%',marginTop:8,padding:13,borderRadius:10,border:'1px solid rgba(120,240,190,.2)',background:'#06110e',color:'#effbf6',resize:'vertical'}} />
      </div>

      <div style={{padding:26,border:'1px solid rgba(130,187,255,.22)',background:'rgba(6,18,30,.76)',borderRadius:18}}>
        <small style={{color:'#87bcff',fontWeight:900}}>02 · BRING THE RECORD</small>
        <input type='file' multiple onChange={e=>setFiles(Array.from(e.target.files||[]))} style={{display:'block',marginTop:18,width:'100%',padding:14,border:'1px dashed rgba(130,187,255,.35)',borderRadius:12,background:'rgba(255,255,255,.025)',color:'#dcecff'}} />
        <p style={{color:'#9db3c5',lineHeight:1.6,fontSize:13}}>Text-readable intake now: TXT, MD, CSV, JSON, LOG, XML. PDF, XLSX, images and other binaries can be declared here, but this browser intake will not pretend it inspected their contents.</p>
        {files.length>0 && <div style={{marginTop:14,fontSize:13,lineHeight:1.7,color:'#c7d9e7'}}>{files.map(f=><div key={`${f.name}-${f.size}`}>{readableExtensions.includes(extension(f.name))?'✓':'◇'} {f.name}</div>)}</div>}
        <label style={{display:'block',marginTop:20,fontWeight:800}}>Paste record text or explanatory notes</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={10} placeholder='Paste sensor output, laboratory text, field notes, report excerpts, equipment state, chronology, or other environmental evidence.' style={{width:'100%',marginTop:8,padding:13,borderRadius:10,border:'1px solid rgba(130,187,255,.2)',background:'#050d14',color:'#effbf6',resize:'vertical'}} />
      </div>

      <div style={{gridColumn:'1 / -1',padding:26,border:'1px solid rgba(181,150,255,.24)',background:'rgba(25,17,42,.58)',borderRadius:18}}>
        <small style={{color:'#c9afff',fontWeight:900}}>03 · PROCESS THROUGH GOVERNANCE</small>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:10,marginTop:16}}>{['Localize object','Inventory sources','Test continuity','Test calibration','Test time boundary','Bound admissibility','Refuse overreach','Identify next step'].map(x=><div key={x} style={{padding:14,border:'1px solid rgba(201,175,255,.14)',borderRadius:10,color:'#d9d0e8'}}>{x}</div>)}</div>
        <button onClick={process} style={{marginTop:22,cursor:'pointer',padding:'15px 20px',border:0,borderRadius:11,background:'linear-gradient(135deg,#aaf6d6,#6fe2ae)',color:'#03120c',fontWeight:950,fontSize:15}}>SEND RECORD INTO GOVERNED INTERPRETER →</button>
        {status && <p style={{marginTop:14,color:'#ffd78a',fontWeight:800}}>{status}</p>}
      </div>
    </section>
  </main>;
}
