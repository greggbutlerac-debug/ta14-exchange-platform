'use client';
import Link from 'next/link';
import {useState} from 'react';

type Run={action:string;record:any};
const steps=['FREEZE MECHANISM','RUN BASELINE','CHANGE ONE MATERIAL CONDITION','SHOW VERDICT CHANGE','ATTEMPT BYPASS','PROVE CONSEQUENCE DID NOT FIRE','PRESERVE RECEIPT','REPLAY'];
export default function ChallengeExam(){
 const [runs,setRuns]=useState<Run[]>([]);
 const [busy,setBusy]=useState(false);
 const [replay,setReplay]=useState<any>(null);
 async function run(action:string){
  setBusy(true);setReplay(null);
  const res=await fetch('/api/afa-eaba-challenge',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action})});
  const data=await res.json(); setRuns(v=>[...v,data]); setBusy(false);
 }
 async function doReplay(){
  const last=runs[runs.length-1]; if(!last)return;
  setBusy(true);
  const res=await fetch('/api/afa-eaba-challenge',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'replay',receipt:last})});
  setReplay(await res.json());setBusy(false);
 }
 const last=runs[runs.length-1]?.record;
 const baseline=runs.find(x=>x.action==='baseline')?.record;
 const changed=runs.find(x=>x.action==='changed-condition')?.record;
 const bypass=runs.find(x=>x.action==='bypass')?.record;
 const download=last?'data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(runs[runs.length-1],null,2)):'#';
 return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0,#102d35,#031015 38%,#010609 80%)',color:'#efffff',fontFamily:'Inter,system-ui,sans-serif'}}>
  <div style={{width:'min(1180px,calc(100% - 32px))',margin:'0 auto',padding:'26px 0 90px'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',paddingBottom:20,borderBottom:'1px solid #17363e'}}><Link href="/" style={{color:'#fff',textDecoration:'none',fontWeight:950}}>TA-14 EXCHANGE</Link><span style={{fontSize:10,color:'#71e7df',fontWeight:900}}>TA14-AFA-EABA-SX-001 · FROZEN CHALLENGE SPEC</span></nav>
   <section style={{padding:'68px 0 34px'}}><div style={{fontSize:10,fontWeight:950,letterSpacing:'.18em',color:'#71e7df'}}>AFA × EABA · OPERATIONAL CHALLENGE EXAMINATION</div><h1 style={{fontSize:'clamp(44px,7vw,88px)',lineHeight:.93,letterSpacing:'-.05em',margin:'14px 0 22px'}}>NAME THE TEST.<br/><span style={{color:'#e7c76e'}}>FREEZE THE TEST.</span><br/>RUN THE TEST.</h1><p style={{maxWidth:900,color:'#a8c1c8',fontSize:18,lineHeight:1.7}}>This surface implements the stated acceptance sequence as a server-executed bounded harness. The showroom is the control and evidence surface; the API route performs the determination and returns the preserved receipt.</p></section>
   <section style={{padding:24,border:'1px solid #28545b',borderRadius:18,background:'#04151c'}}><b style={{color:'#e7c76e'}}>FROZEN ACCEPTANCE CONDITION · v1.0</b><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:8,marginTop:16}}>{steps.map((s,i)=><div key={s} style={{padding:14,border:'1px solid #21444b',borderRadius:9,background:'#020b0f',fontSize:10,fontWeight:900}}><span style={{color:'#71e7df'}}>0{i+1}</span> · {s}</div>)}</div></section>
   <section style={{padding:'54px 0 20px'}}><h2 style={{fontSize:38,margin:'0 0 10px'}}>Run the frozen mechanism.</h2><p style={{color:'#9fb7be'}}>Run in order. The changed-condition test alters exactly one material fact: LOCAL STANDING.</p><div style={{display:'flex',gap:9,flexWrap:'wrap',marginTop:20}}><button disabled={busy} onClick={()=>run('baseline')} style={btn}>1 · RUN BASELINE</button><button disabled={busy||!baseline} onClick={()=>run('changed-condition')} style={btn}>2 · CHANGE ONE CONDITION</button><button disabled={busy||!changed} onClick={()=>run('bypass')} style={btn}>3 · ATTEMPT BYPASS</button><button disabled={busy||!bypass} onClick={doReplay} style={btn}>4 · REPLAY LAST RECEIPT</button></div></section>
   <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:10,marginTop:18}}>
    <Card title="BASELINE" r={baseline}/><Card title="CHANGED CONDITION" r={changed}/><Card title="BYPASS ATTEMPT" r={bypass}/>
   </section>
   {baseline&&changed&&<div style={{marginTop:16,padding:20,border:'1px solid #e7c76e',borderRadius:12,background:'rgba(83,62,14,.18)'}}><b style={{color:'#e7c76e'}}>VERDICT CHANGE OBSERVED</b><p style={{marginBottom:0}}>Baseline: <strong>{baseline.determination}</strong> → Changed condition: <strong>{changed.determination}</strong>. Material delta: localStanding TRUE → FALSE.</p></div>}
   {bypass&&<div style={{marginTop:12,padding:20,border:'1px solid '+(bypass.protectedConsequenceFired?'#ff7b86':'#71e7df'),borderRadius:12}}><b>BYPASS RESULT · PROTECTED CONSEQUENCE FIRED: {String(bypass.protectedConsequenceFired).toUpperCase()}</b><p style={{color:'#9fb7be'}}>The bypass route is not permitted to invoke the protected consequence. The returned trace and receipt preserve the observed server-side result.</p></div>}
   {last&&<section style={{padding:'46px 0 10px'}}><h2 style={{fontSize:34}}>Preserved receipt</h2><pre style={{padding:18,overflow:'auto',border:'1px solid #21444b',borderRadius:12,background:'#02090c',color:'#9bded9',fontSize:11,lineHeight:1.6}}>{JSON.stringify(runs[runs.length-1],null,2)}</pre><a download={'ta14-'+runs[runs.length-1].action+'-receipt.json'} href={download} style={{...btn,display:'inline-block',textDecoration:'none'}}>DOWNLOAD MACHINE-READABLE RECEIPT</a></section>}
   {replay&&<section style={{marginTop:22,padding:22,border:'1px solid '+(replay.replay?.match?'#71e7df':'#ff7b86'),borderRadius:14}}><b style={{fontSize:24}}>REPLAY INTEGRITY: {replay.replay?.match?'MATCH':'MISMATCH'}</b><p style={{color:'#9fb7be'}}>The server recomputed the same action under the frozen mechanism and compared the SHA-256 integrity hash.</p></section>}
   <section style={{marginTop:48,padding:20,border:'1px dashed #6c5b31',borderRadius:12,color:'#d8c98f',lineHeight:1.7}}><b>CLAIM BOUNDARY.</b> This is a bounded executable examination harness. It demonstrates the mechanism represented here, its determination change, bypass refusal, consequence-state record, receipt preservation, and deterministic replay. It does not by itself establish universal deployment, external-system enforcement, certification, or every possible AFA/EABA implementation.</section>
  </div>
 </main>
}
function Card({title,r}:{title:string;r:any}){return <div style={{padding:20,border:'1px solid #214a51',borderRadius:13,background:'#04151c'}}><small style={{color:'#71e7df',fontWeight:950}}>{title}</small>{r?<><strong style={{display:'block',fontSize:30,color:r.determination==='ALLOW'?'#71e7df':'#e7c76e',margin:'8px 0'}}>{r.determination}</strong><div style={{fontSize:11,lineHeight:1.7,color:'#a6bcc2'}}>GATE OPEN: {String(r.gateOpen)}<br/>PROTECTED CONSEQUENCE FIRED: {String(r.protectedConsequenceFired)}<br/>HASH: {r.receipt.integrityHash.slice(0,18)}…</div></>:<p style={{color:'#789098'}}>Not run yet.</p>}</div>}
const btn:React.CSSProperties={cursor:'pointer',padding:'12px 15px',borderRadius:9,border:'1px solid #71e7df',background:'rgba(45,141,143,.14)',color:'#8ff5ee',fontWeight:950,fontSize:10};
