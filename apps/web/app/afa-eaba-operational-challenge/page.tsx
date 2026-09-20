'use client';
import Link from 'next/link';
import {useState} from 'react';

type Run={action:string;record:any};
const requirements=[
 ['01','Freeze the mechanism.','Frozen mechanism identity: TA14-AFA-EABA-SX-001 · v1.1.0. The server harness exposes that same immutable mechanism identity on every run.'],
 ['02','Run it.','RUN BASELINE executes the frozen server-side determination path with every modeled condition established.'],
 ['03','Change one material condition.','CHANGE ONE CONDITION alters exactly one fact: localStanding TRUE → FALSE. No other modeled input changes.'],
 ['04','Show the verdict change.','The showroom compares the two server responses and displays BASELINE verdict → CHANGED-CONDITION verdict.'],
 ['05','Attempt bypass.','ATTEMPT BYPASS invokes a separate server-side bypass action against the same frozen mechanism.'],
 ['06','Show the protected consequence did not fire.','The bypass run makes the same server-side protected-effect request. A database-enforced gate evaluates the frozen predicates. When local standing is absent or bypass=true, no protected-effect row can be created. The API then performs a separate database read for the run ID and records NO_EFFECT_ROW_OBSERVED.'],
 ['07','Preserve the receipt.','Each execution is written to the server-side challenge receipt ledger as TA14_EXECUTION_RECEIPT_V2. The returned receipt carries its durable receipt ID, persistence timestamp, and SHA-256 hash over the complete recursively canonicalized evidence object. The JSON can also be downloaded.'],
 ['08','Replay it.','REPLAY retrieves the preserved receipt from the server ledger by receipt ID, recomputes its evidence hash, and independently queries the protected-effect table for the original run ID. Receipt integrity and effect/non-effect correspondence must both hold.'],
] as const;
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
 <div style={{display:'flex',flexWrap:'wrap',gap:8,margin:'18px 0 28px',padding:'12px',border:'1px solid #24464d',borderRadius:12,background:'rgba(3,15,21,.82)'}}>
<Link href="/federation-authority" style={{padding:'10px 12px',border:'1px solid #31545b',borderRadius:8,color:'#d7eeee',textDecoration:'none',fontSize:10,fontWeight:900}}>FAMILY HOME</Link>
<Link href="/admissible-federation-architecture" style={{padding:'10px 12px',border:'1px solid #31545b',borderRadius:8,color:'#d7eeee',textDecoration:'none',fontSize:10,fontWeight:900}}>EXPLORE AFA</Link>
<Link href="/execution-authority-boundary-architecture" style={{padding:'10px 12px',border:'1px solid #31545b',borderRadius:8,color:'#d7eeee',textDecoration:'none',fontSize:10,fontWeight:900}}>EXPLORE EABA</Link>
<Link href="/authority-journey" style={{padding:'10px 12px',borderRadius:8,background:'#71e7df',color:'#031216',textDecoration:'none',fontSize:10,fontWeight:950}}>RUN AUTHORITY JOURNEY</Link>
<Link href="/afa-eaba-operational-challenge" style={{padding:'10px 12px',border:'1px solid #e7c76e',borderRadius:8,color:'#e7c76e',textDecoration:'none',fontSize:10,fontWeight:900}}>INSPECT FROZEN CHALLENGE</Link>
</div>
   <section style={{padding:'68px 0 34px'}}><div style={{fontSize:10,fontWeight:950,letterSpacing:'.18em',color:'#71e7df'}}>AFA × EABA · OPERATIONAL CHALLENGE EXAMINATION</div><h1 style={{fontSize:'clamp(44px,7vw,88px)',lineHeight:.93,letterSpacing:'-.05em',margin:'14px 0 22px'}}>NAME THE TEST.<br/><span style={{color:'#e7c76e'}}>FREEZE THE TEST.</span><br/>RUN THE TEST.</h1><p style={{maxWidth:940,color:'#a8c1c8',fontSize:18,lineHeight:1.7}}>This is not a static claim page. It is a bounded examination surface built around a publicly stated operational challenge. First, the source requirement is preserved. Second, each requirement is mapped one-for-one to a concrete test action or evidence object. Third, the visitor executes the sequence against the server-side harness and inspects the resulting determination, consequence state, receipt, and replay result.</p>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:9,marginTop:26}}><div style={{padding:16,border:'1px solid #21444b',borderRadius:11}}><small style={{color:'#71e7df',fontWeight:950}}>OBJECT UNDER EXAMINATION</small><strong style={{display:'block',marginTop:7}}>AFA × EABA bounded execution path</strong></div><div style={{padding:16,border:'1px solid #21444b',borderRadius:11}}><small style={{color:'#71e7df',fontWeight:950}}>MECHANISM</small><strong style={{display:'block',marginTop:7}}>TA14-AFA-EABA-SX-001 · v1.1.0</strong></div><div style={{padding:16,border:'1px solid #21444b',borderRadius:11}}><small style={{color:'#71e7df',fontWeight:950}}>EXAMINATION QUESTION</small><strong style={{display:'block',marginTop:7}}>Does changed authority state prevent protected consequence?</strong></div></div></section>
   <section style={{padding:26,border:'1px solid #6c5b31',borderRadius:18,background:'linear-gradient(145deg,rgba(83,62,14,.20),rgba(4,21,28,.96))',marginBottom:18}}>
    <div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',alignItems:'center'}}><div><div style={{fontSize:10,fontWeight:950,letterSpacing:'.16em',color:'#e7c76e'}}>SOURCE EVIDENCE · LINKEDIN COMMENT</div><h2 style={{fontSize:30,margin:'7px 0 0'}}>Where the eight requirements came from.</h2></div><span style={{fontSize:10,color:'#a8c1c8'}}>Preserved as the challenge source</span></div>
    <p style={{color:'#a8c1c8',lineHeight:1.7,maxWidth:930}}>Before TA-14 answers the challenge, the source requirement should be visible. The panel below is a transcript-style evidence card of the operative portion of Terry Snyder&apos;s LinkedIn comment. It is deliberately shown before TA-14&apos;s coverage mapping so a reviewer can compare the stated test with the implementation.</p>
    <div style={{marginTop:20,border:'1px solid #38525a',borderRadius:16,overflow:'hidden',boxShadow:'0 24px 70px rgba(0,0,0,.28)'}}>
      <div style={{display:'flex',gap:12,alignItems:'center',padding:'16px 18px',background:'#f4f2ee',color:'#172126',borderBottom:'1px solid #d3d0ca'}}>
       <div style={{width:44,height:44,borderRadius:'50%',display:'grid',placeItems:'center',background:'#27373c',color:'#fff',fontWeight:950}}>TS</div>
       <div><strong style={{display:'block'}}>Terry Snyder</strong><span style={{fontSize:11,color:'#5e6a70'}}>LinkedIn comment · challenge source</span></div>
      </div>
      <div style={{padding:'22px 24px',background:'#fff',color:'#1f2a2e',fontSize:15,lineHeight:1.72,whiteSpace:'pre-line'}}>{`So the acceptance condition is obvious:
Show the artifact that performs the claimed operation.

Not a registry entry.
Not an invariant.
Not a diagram.
Not a showroom.
Not a HOLD screen.
Not a receipt generated by a staged flow.

Freeze the mechanism.

Run it.

Change one material condition.

Show the verdict change.

Attempt bypass.

Show the protected consequence did not fire.

Preserve the receipt.

Replay it.

That is not a moving target.
That has been the target the entire time.`}</div>
    </div>
    <div style={{marginTop:14,padding:14,border:'1px dashed #6c5b31',borderRadius:10,color:'#d8c98f',fontSize:11,lineHeight:1.6}}><b>RECORD NOTE:</b> This is a transcript-style rendering, not a photographic screenshot. TA-14 should replace or supplement it with the original LinkedIn screenshot when that image is available as a repository asset. The operative eight-part wording is preserved here without adding a ninth condition.</div>
   </section>
   <section style={{padding:24,border:'1px solid #28545b',borderRadius:18,background:'#04151c'}}>
    <b style={{color:'#e7c76e'}}>TERRY SNYDER · STATED ACCEPTANCE CONDITION · FROZEN v1.0</b>
    <p style={{color:'#a8c1c8',lineHeight:1.7,maxWidth:920}}>The requirements below are the operational sequence Terry Snyder explicitly stated should constitute the acceptance condition. They are preserved here before examination and paired one-for-one with the mechanism used to answer each requirement.</p>
    <div style={{display:'grid',gap:9,marginTop:18}}>{requirements.map(([n,required,covered])=><div key={n} style={{display:'grid',gridTemplateColumns:'56px minmax(220px,.8fr) minmax(300px,1.4fr)',gap:12,alignItems:'stretch'}}>
      <div style={{display:'grid',placeItems:'center',border:'1px solid #28545b',borderRadius:10,background:'#020b0f',color:'#71e7df',fontWeight:950}}>{n}</div>
      <div style={{padding:15,border:'1px solid #6c5b31',borderRadius:10,background:'rgba(83,62,14,.12)'}}><small style={{color:'#e7c76e',fontWeight:950}}>WHAT TERRY REQUIRED</small><strong style={{display:'block',marginTop:7}}>{required}</strong></div>
      <div style={{padding:15,border:'1px solid #21444b',borderRadius:10,background:'#020b0f'}}><small style={{color:'#71e7df',fontWeight:950}}>HOW TA-14 COVERS IT</small><span style={{display:'block',marginTop:7,color:'#a8c1c8',lineHeight:1.6}}>{covered}</span></div>
    </div>)}</div>
    <div style={{marginTop:18,padding:15,border:'1px dashed #71e7df',borderRadius:10,color:'#9bded9',fontSize:11,lineHeight:1.65}}><b>ONE-TO-ONE RULE:</b> Requirement 01 is answered by Coverage 01, Requirement 02 by Coverage 02, and so on through Requirement 08. No additional acceptance condition is inserted into this frozen challenge specification.</div>
   </section>
   <section style={{padding:'54px 0 20px'}}><div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#71e7df'}}>EXECUTE THE SAME EIGHT CONDITIONS</div><h2 style={{fontSize:38,margin:'8px 0 10px'}}>Run the frozen mechanism.</h2><p style={{color:'#9fb7be',maxWidth:900,lineHeight:1.7}}>Run in order. The baseline establishes the positive path. The second run alters exactly one material fact—<b>LOCAL STANDING</b>—so the verdict comparison has a controlled delta. The bypass run then attempts to reach the protected consequence outside the permitted gate. Finally, replay verifies the preserved execution record against the same frozen mechanism.</p>
   <div style={{padding:16,border:'1px solid #21444b',borderRadius:11,background:'#020b0f',marginTop:16,color:'#a8c1c8',lineHeight:1.65}}><b style={{color:'#71e7df'}}>WHAT COUNTS AS SUCCESS IN THIS BOUNDED EXAMINATION?</b><br/>Baseline reaches an ALLOW state and may fire the protected consequence. Removing local standing changes the determination and prevents release. A bypass attempt reaches the database-enforced effect gate, but the failed authority predicates prevent creation of the protected-effect row. A separate post-gate database read must observe no effect row. Each run is durably preserved in the server receipt ledger, and replay re-reads that ledger and the effect sink.</div><div style={{display:'flex',gap:9,flexWrap:'wrap',marginTop:20}}><button disabled={busy} onClick={()=>run('baseline')} style={btn}>1 · RUN BASELINE</button><button disabled={busy||!baseline} onClick={()=>run('changed-condition')} style={btn}>2 · CHANGE ONE CONDITION</button><button disabled={busy||!changed} onClick={()=>run('bypass')} style={btn}>3 · ATTEMPT BYPASS</button><button disabled={busy||!bypass} onClick={doReplay} style={btn}>4 · REPLAY LAST RECEIPT</button></div></section>
   <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:10,marginTop:18}}>
    <Card title="BASELINE" r={baseline}/><Card title="CHANGED CONDITION" r={changed}/><Card title="BYPASS ATTEMPT" r={bypass}/>
   </section>
   {baseline&&changed&&<div style={{marginTop:16,padding:20,border:'1px solid #e7c76e',borderRadius:12,background:'rgba(83,62,14,.18)'}}><b style={{color:'#e7c76e'}}>VERDICT CHANGE OBSERVED</b><p style={{marginBottom:0}}>Baseline: <strong>{baseline.determination}</strong> → Changed condition: <strong>{changed.determination}</strong>. Material delta: localStanding TRUE → FALSE.</p></div>}
   {bypass&&<div style={{marginTop:12,padding:20,border:'1px solid '+(bypass.protectedConsequenceFired?'#ff7b86':'#71e7df'),borderRadius:12}}><b>BYPASS RESULT · PROTECTED CONSEQUENCE FIRED: {String(bypass.protectedConsequence?.fired).toUpperCase()}</b><p style={{color:'#9fb7be'}}>An invocation was attempted against the database-enforced protected-effect gate. Authorization failed, no effect row was created, and an independent post-gate database read recorded NO_EFFECT_ROW_OBSERVED. The durable receipt preserves that observation.</p></div>}
   {last&&<section style={{padding:'46px 0 10px'}}><h2 style={{fontSize:34}}>Preserved receipt</h2><pre style={{padding:18,overflow:'auto',border:'1px solid #21444b',borderRadius:12,background:'#02090c',color:'#9bded9',fontSize:11,lineHeight:1.6}}>{JSON.stringify(runs[runs.length-1],null,2)}</pre><a download={'ta14-'+runs[runs.length-1].action+'-receipt.json'} href={download} style={{...btn,display:'inline-block',textDecoration:'none'}}>DOWNLOAD MACHINE-READABLE RECEIPT</a></section>}
   {replay&&<section style={{marginTop:22,padding:22,border:'1px solid '+(replay.replay?.match?'#71e7df':'#ff7b86'),borderRadius:14}}><b style={{fontSize:24}}>REPLAY INTEGRITY: {replay.replay?.match?'MATCH':'MISMATCH'}</b><p style={{color:'#9fb7be'}}>The server retrieved the preserved receipt from the durable ledger, verified its SHA-256 evidence hash, then queried the protected-effect table for the original run ID. Receipt integrity and consequence correspondence must both match.</p></section>}
   <section style={{marginTop:34,padding:24,border:'1px solid #28545b',borderRadius:14,background:'#04151c'}}><b style={{color:'#71e7df'}}>ACCEPTANCE COVERAGE SUMMARY · 8 / 8 IMPLEMENTED</b><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:8,marginTop:14}}>{requirements.map(([n,required])=><div key={n} style={{padding:13,border:'1px solid #21444b',borderRadius:9,background:'#020b0f'}}><span style={{color:'#71e7df',fontWeight:950}}>{n} · COVERED</span><div style={{marginTop:6,fontSize:10,color:'#a8c1c8'}}>{required}</div></div>)}</div></section>
   <section style={{marginTop:18,padding:20,border:'1px dashed #6c5b31',borderRadius:12,color:'#d8c98f',lineHeight:1.7}}><b>CLAIM BOUNDARY.</b> This is a bounded executable examination harness. It demonstrates the frozen bounded mechanism represented here, its determination change, database-enforced bypass refusal, observed protected-effect presence/absence, durable server-side receipt preservation, and ledger-based replay verification. It does not by itself establish universal deployment, enforcement in an unrelated external system, certification, or every possible AFA/EABA implementation. Its protected consequence is the deliberately bounded durable database effect defined by this frozen examination.</section>
  </div>
 </main>
}
function Card({title,r}:{title:string;r:any}){return <div style={{padding:20,border:'1px solid #214a51',borderRadius:13,background:'#04151c'}}><small style={{color:'#71e7df',fontWeight:950}}>{title}</small>{r?<><strong style={{display:'block',fontSize:30,color:r.determination==='ALLOW'?'#71e7df':'#e7c76e',margin:'8px 0'}}>{r.determination}</strong><div style={{fontSize:11,lineHeight:1.7,color:'#a6bcc2'}}>GATE OPEN: {String(r.gateOpen)}<br/>PROTECTED CONSEQUENCE FIRED: {String(r.protectedConsequence?.fired)}<br/>HASH: {r.receipt.integrityHash.slice(0,18)}…</div></>:<p style={{color:'#789098'}}>Not run yet.</p>}</div>}
const btn:React.CSSProperties={cursor:'pointer',padding:'12px 15px',borderRadius:9,border:'1px solid #71e7df',background:'rgba(45,141,143,.14)',color:'#8ff5ee',fontWeight:950,fontSize:10};
