'use client';

import {useEffect,useMemo,useState} from 'react';

type System={id:string;system_key:string;name:string;version:string|null;operator_role:string|null;jurisdiction:string|null;article_50_state:string|null};
type Props={actorRole:string;contentTypes:string[];pathwaySet:string[];declaredEvidence:string[];derivedDetermination:string};
const sourceStates=['CURRENT OFFICIAL SOURCE VERIFIED','SOURCE REVIEW REQUIRED','SOURCE STATE UNVERIFIED'];

export default function Article50ReceiptBridge({actorRole,contentTypes,pathwaySet,declaredEvidence,derivedDetermination}:Props){
 const[systems,setSystems]=useState<System[]>([]),[systemId,setSystemId]=useState(''),[sourceState,setSourceState]=useState('SOURCE STATE UNVERIFIED'),[admitted,setAdmitted]=useState<string[]>([]),[basis,setBasis]=useState(''),[limitations,setLimitations]=useState(''),[status,setStatus]=useState(''),[saving,setSaving]=useState(false);
 useEffect(()=>{fetch('/api/eu-ai-act/article-50/receipts',{cache:'no-store'}).then(async r=>{const j=await r.json();if(!r.ok)throw new Error(j.error||'Unable to load System Passports.');setSystems(j.systems||[]);if(j.systems?.length)setSystemId(j.systems[0].id)}).catch(e=>setStatus(e.message));},[]);
 useEffect(()=>setAdmitted(a=>a.filter(x=>declaredEvidence.includes(x))),[declaredEvidence]);
 const selected=useMemo(()=>systems.find(s=>s.id===systemId),[systems,systemId]);
 function toggle(item:string){setAdmitted(a=>a.includes(item)?a.filter(x=>x!==item):[...a,item]);}
 async function record(){
  setStatus('');if(!systemId){setStatus('Select a System Passport before recording.');return}if(!basis.trim()){setStatus('Reviewer basis is required.');return}
  setSaving(true);
  try{const r=await fetch('/api/eu-ai-act/article-50/receipts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({systemId,actorRole,contentTypes,pathwaySet,declaredEvidence,admittedEvidence:admitted,sourceState,derivedDetermination,reviewerBasis:basis,limitations})});const j=await r.json();if(!r.ok)throw new Error(j.error||'Unable to record receipt.');setStatus(`Governed receipt recorded: ${j.receipt.receipt_key}`)}catch(e){setStatus(e instanceof Error?e.message:'Unable to record receipt.')}finally{setSaving(false)}
 }
 return <section style={{marginTop:22,padding:18,border:'1px solid #55d8ff35',background:'#04111bcf'}}>
  <span style={{fontSize:9,fontWeight:900,letterSpacing:'.14em',color:'#76e5ff'}}>DURABLE SYSTEM PASSPORT RECEIPT</span>
  <h3 style={{margin:'8px 0 6px'}}>Record the governed Article 50 determination</h3>
  <p style={{fontSize:12,lineHeight:1.6,color:'#91a9b9'}}>Declared evidence is not automatically admitted. Select the System Passport, record source state, and explicitly admit only evidence actually accepted into this determination.</p>
  <label style={{display:'grid',gap:6,marginTop:14,fontSize:10}}>SYSTEM PASSPORT<select value={systemId} onChange={e=>setSystemId(e.target.value)} style={{padding:11,background:'#020a11',color:'#eaf7ff',border:'1px solid #31536a'}}><option value="">Select passport</option>{systems.map(s=><option key={s.id} value={s.id}>{s.name} · {s.version||'unversioned'} · {s.system_key}</option>)}</select></label>
  {selected&&<div style={{marginTop:8,fontSize:10,color:'#7795a8'}}>Bound to {selected.name} · current Article 50 state: {selected.article_50_state||'UNRECORDED'}</div>}
  <label style={{display:'grid',gap:6,marginTop:14,fontSize:10}}>LEGAL SOURCE STATE<select value={sourceState} onChange={e=>setSourceState(e.target.value)} style={{padding:11,background:'#020a11',color:'#eaf7ff',border:'1px solid #31536a'}}>{sourceStates.map(s=><option key={s}>{s}</option>)}</select></label>
  <div style={{marginTop:14,fontSize:10,fontWeight:800}}>ADMITTED EVIDENCE · {admitted.length} OF {declaredEvidence.length} DECLARED</div>
  <div style={{display:'grid',gap:7,marginTop:8}}>{declaredEvidence.length?declaredEvidence.map(item=><label key={item} style={{display:'flex',gap:9,alignItems:'center',padding:9,border:'1px solid #ffffff14',fontSize:11}}><input type="checkbox" checked={admitted.includes(item)} onChange={()=>toggle(item)}/><span>{item}</span></label>):<span style={{fontSize:11,color:'#7891a2'}}>No evidence has been declared available.</span>}</div>
  <label style={{display:'grid',gap:6,marginTop:14,fontSize:10}}>REVIEWER BASIS<textarea value={basis} onChange={e=>setBasis(e.target.value)} placeholder="State why the selected pathways, admitted evidence, source state, and resulting determination are supportable." rows={4} style={{padding:11,background:'#020a11',color:'#eaf7ff',border:'1px solid #31536a'}}/></label>
  <label style={{display:'grid',gap:6,marginTop:14,fontSize:10}}>LIMITATIONS<textarea value={limitations} onChange={e=>setLimitations(e.target.value)} placeholder="Record unresolved facts, exclusions, or reliance limits." rows={3} style={{padding:11,background:'#020a11',color:'#eaf7ff',border:'1px solid #31536a'}}/></label>
  <div style={{marginTop:12,fontSize:10,color:'#8aa3b3'}}>Derived determination: <b style={{color:'#d8f5ff'}}>{derivedDetermination}</b> · Pathways: {pathwaySet.length}</div>
  <button type="button" onClick={record} disabled={saving||!systemId||!pathwaySet.length} style={{marginTop:14,padding:'12px 16px',border:'1px solid #67e2ff',background:'#0a2634',color:'#dff9ff',fontSize:10,fontWeight:900,cursor:'pointer'}}>{saving?'RECORDING…':'RECORD GOVERNED DETERMINATION →'}</button>
  {status&&<div role="status" style={{marginTop:10,padding:10,border:'1px solid #ffffff18',fontSize:11,color:'#bcd5e4'}}>{status}</div>}
 </section>
}
