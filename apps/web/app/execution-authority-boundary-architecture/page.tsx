'use client';

import Link from 'next/link';
import {useState} from 'react';

const proofs=[
 ['P-01','PRESENT STATE'],['P-02','TARGET IDENTITY'],['P-03','EVIDENCE CONTINUITY'],['P-04','ACTOR IDENTITY'],['P-05','AUTHORITY'],
 ['P-06','SCOPE'],['P-07','LOCAL STANDING'],['P-08','CHANGED CONDITIONS'],['P-09','COMMIT INTEGRITY'],['P-10','OUTCOME OBLIGATION']
];
const gates=[['P-AUTH','Present authority'],['P-CONT','Continuity'],['P-ADM','Admissibility'],['P-BIND','Binding'],['P-TGT','Target'],['P-EVID','Evidence']];
const attacks=[
 ['STALE EVIDENCE','HOLD','Present-state evidence is outside its permitted freshness bound.'],
 ['REVOKED AUTHORITY','DENY','The presented authority is affirmatively revoked.'],
 ['CHANGED TARGET','HOLD','The protected target no longer matches the evaluated target/version.'],
 ['REPLAYED ATTEMPT','DENY','A prior attempt identity or receipt is presented again.'],
 ['UNRESOLVED AUTHORITY','ESCALATE','Conflicting or unresolved authority cannot be settled inside the frozen rule set.'],
 ['RECEIPT LOSS','HOLD / INDETERMINATE','Effect may have occurred, but outcome cannot be proved.']
];

export default function EABAShowroom(){
 const [proof,setProof]=useState(0);
 const [gate,setGate]=useState(0);
 const [attack,setAttack]=useState(0);
 const [run,setRun]=useState(false);
 const [effect,setEffect]=useState(false);
 const a=attacks[attack];
 return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0,#16263c 0,#07111f 36%,#02060c 80%)',color:'#f4f8ff',fontFamily:'Inter,system-ui,sans-serif'}}>
  <div style={{width:'min(1220px,calc(100% - 34px))',margin:'0 auto',padding:'26px 0 100px'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:18,alignItems:'center',paddingBottom:22,borderBottom:'1px solid #23364e'}}>
    <Link href="/" style={{color:'#fff',textDecoration:'none',fontWeight:950,letterSpacing:'.13em'}}>TA-14 EXCHANGE</Link>
    <span style={{fontSize:10,color:'#79d8ff',fontWeight:900,letterSpacing:'.14em'}}>EABA v1.0-RC1 · PUBLISHED · DOI 10.5281/zenodo.22851885</span>
   </nav>

   <section style={{padding:'82px 0 54px',maxWidth:1100}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.2em',color:'#79d8ff'}}>EXECUTION AUTHORITY BOUNDARY ARCHITECTURE</div>
    <h1 style={{fontSize:'clamp(48px,8vw,100px)',lineHeight:.91,letterSpacing:'-.055em',margin:'18px 0 28px'}}>UNDERSTANDING<br/><span style={{color:'#79d8ff'}}>IS NOT PERMISSION.</span><br/>AUTHORIZATION<br/><span style={{color:'#f1cb73'}}>IS NOT PRESENT AUTHORITY.</span></h1>
    <p style={{fontSize:20,lineHeight:1.7,color:'#adc1d8',maxWidth:900}}>EABA governs the seam where information, reasoning, accepted context, or prior authorization seeks to become protected consequence. The boundary asks one question at commit: is present, admissible, bound execution authority established for this exact attempt?</p>
    <div style={{display:'flex',flexWrap:'wrap',gap:10,marginTop:28}}>
     <a href="https://doi.org/10.5281/zenodo.22851885" target="_blank" rel="noreferrer" style={{padding:'13px 16px',borderRadius:9,background:'#79d8ff',color:'#03101c',fontWeight:950,fontSize:11,textDecoration:'none'}}>OPEN CANONICAL RC1 · ZENODO ↗</a>
     <Link href="/admissible-federation-architecture" style={{padding:'13px 16px',border:'1px solid #31506d',borderRadius:9,color:'#d9e8f6',fontWeight:900,fontSize:11,textDecoration:'none'}}>AFA SHOWROOM →</Link>
    </div>
   </section>

   <section style={{padding:30,border:'1px solid #2b5275',borderRadius:22,background:'rgba(5,18,34,.9)',boxShadow:'0 28px 90px rgba(0,0,0,.35)'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.18em',color:'#79d8ff'}}>CANONICAL EXECUTION CHAIN</div>
    <h2 style={{fontSize:36,margin:'10px 0 24px'}}>The consequence boundary is not a suggestion.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(125px,1fr))',gap:8}}>
     {['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'].map((x,i)=><div key={x} style={{padding:'18px 8px',borderRadius:10,border:x==='COMMIT'?'1px solid #f1cb73':'1px solid #29445f',background:x==='COMMIT'?'rgba(114,82,15,.22)':'#071726',textAlign:'center',fontWeight:950,fontSize:10,color:x==='COMMIT'?'#f1cb73':'#bdd2e5'}}>{x}{i<7?' →':''}</div>)}
    </div>
    <div style={{marginTop:18,padding:'16px 18px',border:'1px dashed #f1cb73',borderRadius:10,color:'#f1cb73',fontSize:12,fontWeight:950,textAlign:'center'}}>PARENT INVARIANT · PROTECTED CONSEQUENCE REQUIRES PRESENT, ADMISSIBLE, BOUND EXECUTION AUTHORITY AT THE POINT OF COMMIT.</div>
   </section>

   <section style={{padding:'72px 0 24px'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#79d8ff'}}>EABS · PROOF BOUNDARY</div>
    <h2 style={{fontSize:42,letterSpacing:'-.03em',margin:'10px 0'}}>Ten burdens before consequence.</h2>
    <p style={{color:'#9fb5ca',lineHeight:1.7,maxWidth:850}}>Click a proof burden. None may be silently replaced by another, and applicable burdens must be established for the exact consequence class.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(185px,1fr))',gap:9,marginTop:22}}>{proofs.map((p,i)=><button key={p[0]} onClick={()=>setProof(i)} style={{cursor:'pointer',padding:17,textAlign:'left',borderRadius:10,border:i===proof?'1px solid #79d8ff':'1px solid #263f58',background:i===proof?'rgba(56,151,197,.16)':'#071522',color:i===proof?'#8ee1ff':'#a9bed1',fontWeight:900}}><span style={{fontSize:9,opacity:.7}}>{p[0]}</span><br/>{p[1]}</button>)}</div>
    <div style={{marginTop:12,padding:20,border:'1px solid #2b5275',borderRadius:12,background:'#06111d'}}><strong style={{color:'#79d8ff'}}>{proofs[proof][0]} · {proofs[proof][1]}</strong><p style={{color:'#a9bfd2',lineHeight:1.65,marginBottom:0}}>This burden remains explicit at the EABA parent level. A bounded gateway may enforce part of it, but cannot erase residual profile obligations.</p></div>
   </section>

   <section style={{padding:'70px 0',borderTop:'1px solid #1c3045'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#79d8ff'}}>EBG · COMMIT GATEWAY</div>
    <h2 style={{fontSize:42,letterSpacing:'-.03em',margin:'10px 0'}}>Six predicates. No substitution.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:9,marginTop:24}}>{gates.map((g,i)=><button key={g[0]} onClick={()=>setGate(i)} style={{cursor:'pointer',padding:22,borderRadius:12,border:i===gate?'1px solid #79d8ff':'1px solid #28445e',background:i===gate?'rgba(56,151,197,.15)':'#071522',color:i===gate?'#8ee1ff':'#aec2d4',fontWeight:950}}>{g[0]}<div style={{fontSize:10,marginTop:7,opacity:.7}}>{g[1]}</div></button>)}</div>
    <div style={{marginTop:18,padding:22,border:'1px solid #38556c',borderRadius:13,background:'#050d17'}}><b style={{color:'#f1cb73'}}>PARENT ALLOW RULE</b><p style={{color:'#afc2d3',lineHeight:1.7}}>Every applicable EABS proof must be established, every required EBG predicate must be ESTABLISHED, commit binding must remain valid at the instant of protected commit, and no disqualifying condition may exist. Six green gateway predicates alone are not universal EABA conformance.</p></div>
   </section>

   <section style={{padding:'70px 0',borderTop:'1px solid #1c3045'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#79d8ff'}}>ADVERSARIAL EXAMINATION</div>
    <h2 style={{fontSize:42,letterSpacing:'-.03em',margin:'10px 0'}}>Attack the boundary.</h2>
    <div style={{display:'grid',gridTemplateColumns:'minmax(220px,.8fr) minmax(300px,1.4fr)',gap:14,marginTop:24}}>
     <div style={{display:'grid',gap:8}}>{attacks.map((x,i)=><button key={x[0]} onClick={()=>{setAttack(i);setRun(false);setEffect(false)}} style={{cursor:'pointer',textAlign:'left',padding:15,borderRadius:10,border:i===attack?'1px solid #79d8ff':'1px solid #263f58',background:i===attack?'rgba(56,151,197,.15)':'#071522',color:i===attack?'#8ee1ff':'#a9bed1',fontWeight:900}}>{x[0]}</button>)}</div>
     <div style={{padding:26,border:'1px solid #2b5275',borderRadius:14,background:'#071522'}}><div style={{fontSize:10,color:'#8299ad'}}>EXPECTED GOVERNED RESULT</div><strong style={{display:'block',fontSize:30,color:'#f1cb73',margin:'10px 0'}}>{a[1]}</strong><p style={{color:'#a9bfd2',lineHeight:1.7}}>{a[2]}</p><button onClick={()=>setRun(true)} style={{cursor:'pointer',padding:'11px 14px',borderRadius:8,border:'1px solid #f1cb73',background:'transparent',color:'#f1cb73',fontWeight:950}}>RUN BOUNDARY TEST</button>{run&&<div style={{marginTop:18,padding:15,borderRadius:9,background:'#030a11',color:'#8ee1ff',fontSize:11,fontWeight:900}}>DETERMINATION: {a[1]} · PROTECTED EFFECT: {a[1]==='ALLOW'?'ELIGIBLE':'BLOCKED'} · RECEIPT REQUIRED</div>}</div>
    </div>
   </section>

   <section style={{padding:'70px 0',borderTop:'1px solid #1c3045'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#79d8ff'}}>EFFECT TRUTH LAB</div>
    <h2 style={{fontSize:42,letterSpacing:'-.03em',margin:'10px 0'}}>A decision is not proof of what happened.</h2>
    <p style={{color:'#a7bbcd',lineHeight:1.7,maxWidth:880}}>EABA separates determination from effect outcome. Matching endpoint state cannot prove zero mutation if a transient effect may have occurred.</p>
    <button onClick={()=>setEffect(!effect)} style={{cursor:'pointer',marginTop:16,padding:'12px 16px',borderRadius:9,border:'1px solid #79d8ff',background:'rgba(56,151,197,.12)',color:'#8ee1ff',fontWeight:950}}>SIMULATE CRASH AFTER COMMIT</button>
    {effect&&<div style={{marginTop:18,padding:22,border:'1px solid #8c6334',borderRadius:12,background:'rgba(75,47,11,.2)'}}><strong style={{fontSize:26,color:'#f1cb73'}}>INDETERMINATE</strong><p style={{color:'#c9b995',lineHeight:1.7}}>The effect may have occurred, but outcome evidence cannot prove the result. No clean PASS. No silent replay. Preserve the indeterminate state and reconstruct or escalate.</p></div>}
   </section>

   <section style={{padding:'70px 0',borderTop:'1px solid #1c3045'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#79d8ff'}}>INDEPENDENT EXAMINATION GATE</div>
    <h2 style={{fontSize:42,letterSpacing:'-.03em',margin:'10px 0'}}>The implementation does not get to grade itself.</h2>
    <p style={{color:'#a8bdcf',lineHeight:1.75,maxWidth:920}}>A release candidate remains unproven until an independently derived implementation is examined against frozen requirements and negative vectors without using the TA-14 reference gate as its decision oracle. Ambiguity that permits materially different safety behavior returns to the specification; an implementation defect fails the implementation.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginTop:22}}>
     {['FROZEN REQUIREMENTS','NEGATIVE VECTORS','PREDICATE + REASON EVIDENCE','EFFECT EVIDENCE','INTEGRITY REFERENCES','AMBIGUITIES RETURNED'].map(x=><div key={x} style={{padding:18,border:'1px solid #294760',borderRadius:11,background:'#071522',fontSize:10,fontWeight:950,color:'#b7ccdd'}}>{x}</div>)}
    </div>
   </section>

   <section style={{padding:34,border:'1px solid #315778',borderRadius:20,background:'linear-gradient(135deg,rgba(27,73,107,.34),rgba(5,17,30,.9))'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#79d8ff'}}>THE COMPLETE LOOP</div>
    <h2 style={{fontSize:'clamp(29px,5vw,52px)',lineHeight:1.05,letterSpacing:'-.04em',margin:'12px 0'}}>SPECIFY → ESTABLISH → BIND → GATE → DETERMINE → COMMIT → EFFECT → PROVE → CLOSE</h2>
    <p style={{color:'#adc1d3',fontSize:16,lineHeight:1.7,maxWidth:900}}>EABA does not ask intelligent systems to know less or connected systems to communicate less. It requires consequential systems to establish more before acting, preserve what changed, refuse when standing is absent, and return evidence sufficient to reconstruct what actually happened.</p>
    <a href="https://doi.org/10.5281/zenodo.22851885" target="_blank" rel="noreferrer" style={{display:'inline-block',marginTop:12,padding:'13px 16px',borderRadius:9,background:'#79d8ff',color:'#03101c',fontWeight:950,fontSize:11,textDecoration:'none'}}>READ THE PUBLISHED ARCHITECTURE ↗</a>
   </section>
  </div>
 </main>
}