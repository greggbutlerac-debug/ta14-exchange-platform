'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type Disposition='ALLOW'|'HOLD'|'DENY'|'ESCALATE';
const C={cyan:'#70dcff',green:'#71f2b6',gold:'#ffd36f',red:'#ff7885',purple:'#b9a8ff',text:'#eef8fb',muted:'#9bb1bc'};
const btn={cursor:'pointer',padding:'11px 14px',borderRadius:10,border:'1px solid rgba(112,220,255,.3)',background:'rgba(8,37,47,.9)',color:'#eef8fb',fontWeight:950,fontSize:11} as const;
const card={border:'1px solid rgba(112,220,255,.16)',background:'linear-gradient(145deg,rgba(5,24,37,.88),rgba(2,9,15,.97))',borderRadius:22} as const;

function Samantha({text}:{text:string}){
 const [on,setOn]=useState(false),[paused,setPaused]=useState(false);
 useEffect(()=>()=>window.speechSynthesis?.cancel(),[]);
 const start=()=>{window.speechSynthesis?.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.82;const vs=window.speechSynthesis.getVoices();u.voice=vs.find(v=>v.name==='Samantha')||vs.find(v=>v.lang==='en-US')||vs[0];u.onend=()=>{setOn(false);setPaused(false)};setOn(true);window.speechSynthesis.speak(u)};
 const toggle=()=>{if(!on)return start();if(paused){window.speechSynthesis.resume();setPaused(false)}else{window.speechSynthesis.pause();setPaused(true)}};
 return <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:14}}><button onClick={toggle} style={btn}>{!on?'▶ SAMANTHA — EXPLAIN':paused?'▶ RESUME':'Ⅱ PAUSE'}</button>{on&&<button onClick={()=>{window.speechSynthesis.cancel();setOn(false);setPaused(false)}} style={btn}>■ STOP</button>}</div>
}

export default function AaronHastingsBuildingMLShowroom(){
 const [valid,setValid]=useState(true),[admissible,setAdmissible]=useState(true),[authority,setAuthority]=useState(true),[standing,setStanding]=useState(true),[changed,setChanged]=useState(false);
 const result:Disposition=useMemo(()=>!authority?'DENY':!standing?'ESCALATE':(!valid||!admissible||changed)?'HOLD':'ALLOW',[valid,admissible,authority,standing,changed]);
 const color={ALLOW:C.green,HOLD:C.gold,DENY:C.red,ESCALATE:C.purple}[result];
 const toggle=(label:string,value:boolean,setter:(v:boolean)=>void)=><button onClick={()=>setter(!value)} style={{...btn,border:value?'1px solid rgba(113,242,182,.5)':'1px solid rgba(255,120,133,.5)',color:value?C.green:C.red}}>{label}: {value?'YES':'NO'}</button>;
 return <main style={{minHeight:'100vh',padding:'42px 18px 100px',background:'radial-gradient(circle at 80% 0%,rgba(46,195,255,.16),transparent 28%),linear-gradient(180deg,#02060b,#06101a 48%,#02060b)',color:C.text,fontFamily:'Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
  <div style={{maxWidth:1260,margin:'0 auto'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',paddingBottom:20,borderBottom:'1px solid rgba(112,220,255,.12)'}}><Link href="/showrooms" style={{color:'#9de8f7',textDecoration:'none',fontWeight:900}}>← TA-14 SHOWROOMS</Link><div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#718d9b'}}>PUBLIC TECHNICAL SHOWROOM · BUILDING ML CONSEQUENCE BOUNDARY</div></nav>

   <section style={{marginTop:26,padding:'clamp(38px,7vw,82px)',border:'1px solid rgba(112,220,255,.24)',borderRadius:32,background:'linear-gradient(145deg,rgba(7,38,56,.97),rgba(4,13,22,.99) 58%,rgba(19,28,50,.96))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.22em',color:C.cyan}}>TA-14 · PRACTITIONER TECHNICAL REFERENCE · AARON HASTINGS</div>
    <h1 style={{fontSize:'clamp(50px,8.5vw,108px)',lineHeight:.88,letterSpacing:'-.07em',margin:'18px 0 24px'}}>BUILDING ML<br/><span style={{color:C.green}}>CONSEQUENCE BOUNDARY</span></h1>
    <p style={{fontSize:'clamp(19px,2.5vw,29px)',lineHeight:1.5,maxWidth:1020,color:'#c5d8df'}}>Machine learning may reconstruct missing data, predict future performance, and produce deterministic results. None of those capabilities, by themselves, establish permission for a proposed consequence to become real.</p>
    <div style={{marginTop:28,padding:'clamp(22px,4vw,38px)',borderRadius:20,border:'1px solid rgba(113,242,182,.34)',background:'rgba(2,10,17,.55)',fontSize:'clamp(22px,3.3vw,40px)',fontWeight:1000,lineHeight:1.15}}>Prediction or inference does not create <span style={{color:C.green}}>authority to act.</span></div>
    <Samantha text="This showroom answers two questions directly. Admissible to what? To the specific decision path that may produce a consequence. Authority to do what? To cause that specific consequence. Machine learning can improve prediction and verification, but prediction is not permission."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.green}}>01 · DISAMBIGUATION</div>
    <h2 style={{fontSize:'clamp(35px,5.5vw,68px)',lineHeight:.98,letterSpacing:'-.05em',margin:'12px 0 22px'}}>VALID ≠ ADMISSIBLE ≠ AUTHORIZED</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12}}>
     {[
      ['VALID','Is the observation technically credible?','A sensor may be calibrated, current, correctly addressed, and functioning.'],
      ['ADMISSIBLE','May this evidence legitimately support this proposed consequence now?','Validity matters, but context, continuity, applicable rules, scope, and other required evidence may still be missing.'],
      ['AUTHORIZED','May this actor or system cause this specific consequence?','Credentials, access, capability, or human approval do not automatically establish authority.']
     ].map(([t,q,d],i)=><article key={t} style={{padding:24,borderRadius:18,border:'1px solid rgba(112,220,255,.15)',background:'rgba(2,10,17,.58)'}}><div style={{fontSize:11,color:[C.cyan,C.green,C.purple][i],fontWeight:1000}}>0{i+1}</div><h3 style={{fontSize:25,margin:'8px 0'}}>{t}</h3><div style={{fontWeight:900,lineHeight:1.45}}>{q}</div><p style={{color:C.muted,lineHeight:1.6,fontSize:14}}>{d}</p></article>)}
    </div>
    <div style={{marginTop:22,marginBottom:10,fontSize:10,fontWeight:950,letterSpacing:".18em",color:C.cyan}}>TEACHING VISUAL 01 / 04</div><Image src="/TA14_Aaron_Hastings_Building_ML_01_Valid_Admissible_Authorized.png" alt="Valid admissible and authorized building ML teaching visual" width={1536} height={1024} style={{display:"block",width:"100%",height:"auto",marginTop:22,borderRadius:20}}/><Samantha text="This visual separates technical validity, decision-specific admissibility, authority, and execution. A valid inference does not automatically become admissible evidence, and admissible evidence does not automatically create authority to act."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.cyan}}>02 · SAME INFERENCE · DIFFERENT CONSEQUENCE</div>
    <h2 style={{fontSize:'clamp(34px,5vw,64px)',lineHeight:1,letterSpacing:'-.05em',margin:'12px 0 22px'}}>The model does not decide the evidence threshold.</h2>
    <p style={{fontSize:18,lineHeight:1.7,color:'#b9ccd5'}}>Assume an ML model predicts that an AHU is likely to exceed an operating limit. The inference may be identical. The proposed consequence is not.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginTop:18}}>
     {[
      ['01','DISPLAY ADVISORY','Informational consequence. Preserve the prediction, provenance, and uncertainty.'],
      ['02','CREATE WORK ORDER','Operational consequence. Establish routing, scope, and accountable recipient.'],
      ['03','CHANGE SETPOINT','Control consequence. Establish current evidence, applicable authority, standing, bounds, and rollback.'],
      ['04','SHUT DOWN EQUIPMENT','Higher-consequence action. Require the evidence and authority appropriate to that exact shutdown now.']
     ].map(([n,t,d])=><article key={n} style={{padding:22,borderRadius:17,border:'1px solid rgba(112,220,255,.14)',background:'rgba(2,10,17,.55)'}}><div style={{fontSize:10,color:C.cyan,fontWeight:950}}>{n}</div><div style={{marginTop:7,fontSize:17,fontWeight:1000}}>{t}</div><p style={{fontSize:13,lineHeight:1.6,color:C.muted}}>{d}</p></article>)}
    </div>
    <div style={{marginTop:20,padding:22,borderRadius:17,border:'1px solid rgba(255,211,111,.28)',background:'rgba(255,211,111,.05)',fontWeight:1000,fontSize:'clamp(20px,2.7vw,32px)',lineHeight:1.3}}>Same prediction. Different consequence. <span style={{color:C.gold}}>Different proof burden.</span></div>
    <div style={{marginTop:22,marginBottom:10,fontSize:10,fontWeight:950,letterSpacing:".18em",color:C.cyan}}>TEACHING VISUAL 02 / 04</div><Image src="/TA14_Aaron_Hastings_Building_ML_02_Same_Inference_Four_Consequences.png" alt="Same ML inference four different consequences teaching visual" width={1536} height={1024} style={{display:"block",width:"100%",height:"auto",marginTop:22,borderRadius:20}}/><Samantha text="This visual holds the machine learning inference constant while the proposed consequence changes from advisory, to work order, to physical control. As consequence increases, evidence, authority, safeguards, and verification must fit the exact action being proposed."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.green}}>03 · BUILDING ML PROOF PATH</div>
    <h2 style={{fontSize:'clamp(34px,5vw,64px)',lineHeight:1,letterSpacing:'-.05em',margin:'12px 0 22px'}}>OBSERVATION → ML INFERENCE → PROPOSITION → AUTHORITY → EXECUTION → OUTCOME</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:9}}>
     {['OBSERVATION','ML INFERENCE','PROPOSITION','AUTHORITY','EXECUTION','OUTCOME'].map((x,i)=><div key={x} style={{padding:20,borderRadius:15,border:'1px solid rgba(112,220,255,.14)',background:i===3?'rgba(113,242,182,.07)':'rgba(2,10,17,.55)',textAlign:'center'}}><div style={{fontSize:10,color:C.cyan,fontWeight:950}}>0{i+1}</div><div style={{marginTop:7,fontSize:14,fontWeight:1000}}>{x}</div></div>)}
    </div>
    <div style={{marginTop:22,padding:'clamp(24px,4vw,38px)',borderRadius:20,border:'1px solid rgba(113,242,182,.28)',background:'rgba(113,242,182,.04)'}}>
     <div style={{fontSize:11,fontWeight:950,letterSpacing:'.16em',color:C.green}}>COMMIT BOUNDARY</div>
     <div style={{fontSize:'clamp(27px,4vw,48px)',fontWeight:1000,marginTop:10}}>KNOW / INFER / RECOMMEND <span style={{color:C.green}}>│</span> ACT</div>
     <p style={{color:'#b9ccd5',lineHeight:1.65}}>The boundary is not where intelligence ends. It is where a proposition is about to become consequence. At that point, TA-14 resolves the route as ALLOW, HOLD, DENY, or ESCALATE.</p>
    </div>
    <div style={{marginTop:22,marginBottom:10,fontSize:10,fontWeight:950,letterSpacing:".18em",color:C.cyan}}>TEACHING VISUAL 03 / 04</div><Image src="/TA14_Aaron_Hastings_Building_ML_03_Commit_Boundary.png" alt="Building ML commit boundary teaching visual" width={1536} height={1024} style={{display:"block",width:"100%",height:"auto",marginTop:22,borderRadius:20}}/><Samantha text="This visual moves from knowing, to inference, to recommendation. At the commit boundary the route becomes allow, hold, deny, or escalate. Only an allowed bounded action crosses into execution, followed by verification and the recorded outcome."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',border:'1px solid rgba(255,211,111,.28)',borderRadius:24,background:'linear-gradient(145deg,rgba(56,43,10,.24),rgba(2,10,17,.97))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.gold}}>04 · THREE NON-EQUIVALENCES</div>
    <h2 style={{fontSize:'clamp(38px,6vw,74px)',lineHeight:.98,letterSpacing:'-.055em',margin:'12px 0 22px'}}>MODEL CONFIDENCE ≠ EVIDENTIARY SUFFICIENCY<br/>DETERMINISM ≠ AUTHORITY<br/>PREDICTION ≠ PERMISSION</h2>
    <p style={{fontSize:18,lineHeight:1.7,color:'#d7d0bd'}}>Deterministic ML can be highly valuable because its results can be repeatable, testable, and verifiable. That strengthens computation. It does not answer the separate execution question: who or what may cause the proposed consequence under the conditions that apply now?</p>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.cyan}}>05 · AHU WORKED EXAMPLE</div>
    <h2 style={{fontSize:'clamp(34px,5vw,64px)',lineHeight:1,letterSpacing:'-.05em',margin:'12px 0 22px'}}>A correct prediction is still a new proposition.</h2>
    <div style={{display:'grid',gap:10}}>
     {[
      ['REALITY','AHU operating data, sensor observations, occupancy, outdoor conditions, current control state.'],
      ['COMPUTATION','ML reconstructs missing data or predicts future performance from governed inputs.'],
      ['PROPOSITION','Model recommends changing a setpoint to avoid the predicted condition.'],
      ['BOUNDARY','Do current evidence, applicable authority, established standing, scope, timing, and execution constraints support that exact setpoint change NOW?'],
      ['EXECUTION','Only after the route is ALLOW may the bounded action cross commit. ALLOW permits; it does not compel.'],
      ['OUTCOME','Return to reality. Capture what actually happened, whether the action matched the proposition, and whether the expected result occurred.']
     ].map(([t,d],i)=><div key={t} style={{display:'grid',gridTemplateColumns:'minmax(115px,180px) 1fr',gap:14,padding:18,borderRadius:15,border:'1px solid rgba(112,220,255,.12)',background:'rgba(2,10,17,.52)'}}><div style={{fontWeight:1000,color:i===3?C.green:C.cyan}}>{t}</div><div style={{color:'#b9ccd5',lineHeight:1.6}}>{d}</div></div>)}
    </div>
    <Samantha text="In this AHU example, governed data may support a strong machine learning prediction. The recommendation to change a setpoint is still a new proposition. New proposition, new consequence, new now. The execution side must be established before the control change becomes real."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.green}}>06 · LIVE CONSEQUENCE LAB</div>
    <h2 style={{fontSize:'clamp(34px,5vw,64px)',lineHeight:1,letterSpacing:'-.05em',margin:'12px 0 22px'}}>Change the conditions. Watch the disposition move.</h2>
    <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{toggle('TECHNICALLY VALID',valid,setValid)}{toggle('ADMISSIBLE EVIDENCE',admissible,setAdmissible)}{toggle('APPLICABLE AUTHORITY',authority,setAuthority)}{toggle('ESTABLISHED STANDING',standing,setStanding)}<button onClick={()=>setChanged(!changed)} style={{...btn,border:changed?'1px solid rgba(255,120,133,.5)':'1px solid rgba(113,242,182,.5)',color:changed?C.red:C.green}}>MATERIAL CHANGE: {changed?'YES':'NO'}</button></div>
    <div style={{marginTop:22,padding:'clamp(30px,5vw,52px)',borderRadius:24,border:`1px solid ${color}66`,background:`linear-gradient(135deg,${color}10,rgba(2,10,17,.96))`,textAlign:'center'}}><div style={{fontSize:10,fontWeight:950,letterSpacing:'.2em',color:'#8099a5'}}>CURRENT GOVERNED DISPOSITION</div><div style={{fontSize:'clamp(66px,11vw,132px)',fontWeight:1000,lineHeight:.9,letterSpacing:'-.07em',margin:'17px 0',color}}>{result}</div><p style={{maxWidth:850,margin:'0 auto',fontSize:18,lineHeight:1.6,color:'#b9ccd5'}}>{result==='ALLOW'?'Required conditions for this bounded consequence are presently established.':result==='HOLD'?'A curable evidence, validity, or changed-condition deficiency blocks action now. Preserve state and re-examine.':result==='DENY'?'Applicable Authority is absent or prohibitory. Capability cannot manufacture permission.':'Standing is unresolved. Route to the appropriate governed authority or review path.'}</p></div>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.cyan}}>07 · AIR × ACA × AEA</div>
    <h2 style={{fontSize:'clamp(34px,5vw,64px)',lineHeight:1,letterSpacing:'-.05em',margin:'12px 0 22px'}}>Govern both sides of intelligence.</h2>
    <div style={{padding:22,borderRadius:17,border:'1px solid rgba(112,220,255,.14)',background:'rgba(2,10,17,.55)',fontSize:'clamp(18px,2.5vw,30px)',fontWeight:1000,lineHeight:1.6}}>REALITY → <span style={{color:C.cyan}}>AIR</span> → <span style={{color:C.green}}>ACA</span> → INTELLIGENCE → PROPOSED CONSEQUENCE → <span style={{color:C.purple}}>AEA</span> → EXECUTION → OUTCOME → NEW REALITY</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:10,marginTop:16}}>
     {[
      ['AIR','Protects the atmospheric integrity record: what was observed, when, where, by what source, with continuity and provenance.'],
      ['ACA','Governs what intelligence may rely upon before computation. Governed input does not guarantee governed output.'],
      ['AEA','Governs what intelligence may cause before execution. The proposed consequence must establish its own route to reality.']
     ].map(([t,d])=><div key={t} style={{padding:22,borderRadius:16,border:'1px solid rgba(112,220,255,.13)',background:'rgba(2,10,17,.52)'}}><div style={{fontSize:22,fontWeight:1000,color:C.green}}>{t}</div><p style={{color:C.muted,lineHeight:1.6}}>{d}</p></div>)}
    </div>
   </section>

   <div style={{marginTop:22}}><div style={{marginTop:22,marginBottom:10,fontSize:10,fontWeight:950,letterSpacing:".18em",color:C.cyan}}>TEACHING VISUAL 04 / 04</div><Image src="/TA14_Aaron_Hastings_Building_ML_04_Governed_Building_ML_Loop.png" alt="Governed Building ML Loop teaching visual" width={1536} height={1024} style={{display:"block",width:"100%",height:"auto",borderRadius:20}}/><Samantha text="This visual follows the governed building machine learning loop from reality, through AIR and ACA, into intelligence and a proposed consequence, then through AEA before execution. The measured outcome returns to reality and begins the record again."/></div>
   <section style={{marginTop:24,padding:'clamp(34px,6vw,68px)',border:'1px solid rgba(113,242,182,.3)',borderRadius:28,background:'radial-gradient(circle at 76% 0%,rgba(113,242,182,.11),transparent 28%),linear-gradient(145deg,rgba(8,36,48,.96),rgba(3,11,19,.98))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.green}}>PRESENTATION-READY DISTINCTION</div>
    <h2 style={{fontSize:'clamp(38px,6vw,76px)',lineHeight:.95,letterSpacing:'-.058em',margin:'14px 0 22px'}}>AN ADMISSIBLE INPUT DOES NOT CREATE AN ADMISSIBLE OUTPUT.</h2>
    <p style={{fontSize:'clamp(19px,2.6vw,30px)',lineHeight:1.55,color:'#c5d8df'}}>A machine-learning model may receive valid, governed evidence and produce a deterministic, repeatable prediction. If that prediction proposes a real-world action, the proposal is a new object of governance. Its evidence, authority, standing, scope, timing, and execution conditions must be established before it becomes consequence.</p>
    <div style={{marginTop:26,padding:24,borderRadius:18,border:'1px solid rgba(113,242,182,.28)',background:'rgba(113,242,182,.05)',fontSize:'clamp(21px,3vw,36px)',fontWeight:1000,lineHeight:1.25}}>Does this proposed consequence have sufficient <span style={{color:C.green}}>Admissible Evidence</span>, <span style={{color:C.cyan}}>Applicable Authority</span>, and <span style={{color:C.purple}}>Established Standing</span> to become reality NOW?</div>
    <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:24}}><a href="/TA14_Admissibility_Authority_Building_ML_Technical_Reference_v2.pdf" download style={{...btn,textDecoration:'none'}}>DOWNLOAD TECHNICAL REFERENCE PDF ↓</a><Link href="/admissible-computation-architecture" style={{...btn,textDecoration:'none'}}>ACA →</Link><Link href="/admissible-execution-architecture" style={{...btn,textDecoration:'none'}}>AEA →</Link></div>
   </section>

   <section style={{marginTop:24,padding:24,borderRadius:18,border:'1px solid rgba(112,220,255,.12)',background:'rgba(2,10,17,.55)',fontSize:12,lineHeight:1.7,color:'#78909b'}}><b style={{color:'#a8bdc7'}}>BOUNDARY / NON-CLAIM.</b> This is an explanatory practitioner surface for examining building ML at the consequence boundary. It does not establish legal, regulatory, professional, contractual, or institutional authority; certify a model, sensor, control sequence, building, or practitioner; or claim adoption by Aaron Hastings, SkySpark, SkyPosium, NexusCon, or any other organization. Applicable domain authority remains controlling.</section>
   <footer style={{marginTop:28,paddingTop:20,borderTop:'1px solid rgba(112,220,255,.1)',display:'flex',justifyContent:'space-between',gap:14,flexWrap:'wrap',color:'#66818e',fontSize:11}}><div>TA-14 AUTHORITY · BUILDING ML CONSEQUENCE BOUNDARY</div><div>Capability ≠ Authority · Prediction ≠ Permission</div></footer>
  </div>
 </main>
}