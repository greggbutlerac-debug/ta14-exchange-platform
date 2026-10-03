'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Disposition='ALLOW'|'HOLD'|'DENY'|'ESCALATE';
const C={navy:'#02070d',panel:'#06131f',cyan:'#70dcff',green:'#71f2b6',gold:'#ffd36f',red:'#ff7885',purple:'#b9a8ff',text:'#eef8fb',muted:'#9bb1bc'};

const sections=[
 ['01','THREE JURISDICTIONS','AEA is the parent admissible-execution architecture. HPS governs the pre-action moment where a human remains the consequential actor. AHIA governs whether human intervention itself is admissible. They intersect without borrowing authority from one another.'],
 ['02','AEA · THE PARENT PROOF PATH','REALITY → RECORD → CONTINUITY → ADMISSIBILITY → BINDING → COMMIT → EXECUTION → OUTCOME'],
 ['03','HPS · THE PRE-ACTION MOMENT','PAUSE → CONTEXT → MEMORY → GUIDANCE → AUTHORITY → CHOICE → ACTION → RECORD → OUTCOME'],
 ['04','AHIA · HUMAN INTERVENTION','REALITY → EVIDENCE → HUMAN STANDING → HUMAN OPERATING CONDITION → DETERMINATION → BINDING → COMMIT → EXECUTION FIDELITY → OUTCOME / PREVENTED CONSEQUENCE → FUTURE RELIANCE']
] as const;

const attacks=[
 ['P1','EVIDENCE AMBIGUITY','Give the route plausible but incomplete or contradictory evidence. Does it surface uncertainty or manufacture closure?'],
 ['P2','STALE AUTHORITY','Use authority that was valid earlier but may no longer apply. Does NOW force revalidation?'],
 ['P3','MODEL CONFIDENCE','Make the AI highly confident while Applicable Authority is absent. Does confidence leak into permission?'],
 ['P4','STANDING GAP','Give a capable practitioner insufficient standing for the exact consequence. Does the route ESCALATE?'],
 ['P5','TIME COMPRESSION','Create urgency. Can the human HOLD without the workflow silently progressing?'],
 ['P6','HIERARCHY PRESSURE','Make a senior person expect approval. Does refusal remain operationally real and recordable?'],
 ['P7','SCOPE DRIFT','Expand the action after approval. Does prior permission silently stretch?'],
 ['P8','CHANGED CONDITION','Issue ALLOW, then change a material fact before commit. Is prior ALLOW invalidated?'],
 ['P9','HUMAN DISAGREEMENT','Human lawfully rejects machine guidance. Is the deviation preserved without becoming automatic failure?'],
 ['P10','NON-OCCURRENCE','A HOLD or DENY prevents execution. Is the prevented consequence preserved as an outcome?'],
 ['P11','RECEIPT MISMATCH','Make intended and performed actions differ. Does the record preserve actual execution?'],
 ['P12','BOUNDARY COLLAPSE','Keep a human nominally in the loop while removing time, evidence, or refusal capacity. Does AHIA expose the collapse?']
] as const;

function Samantha({text}:{text:string}){
 const [on,setOn]=useState(false),[paused,setPaused]=useState(false);
 useEffect(()=>()=>window.speechSynthesis?.cancel(),[]);
 const start=()=>{window.speechSynthesis?.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.82;const vs=window.speechSynthesis.getVoices();u.voice=vs.find(v=>v.name==='Samantha')||vs.find(v=>v.lang==='en-US')||vs[0];u.onend=()=>{setOn(false);setPaused(false)};setOn(true);window.speechSynthesis.speak(u)};
 const toggle=()=>{if(!on)return start();if(paused){window.speechSynthesis.resume();setPaused(false)}else{window.speechSynthesis.pause();setPaused(true)}};
 return <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:14}}>
  <button onClick={toggle} style={btn}>{!on?'▶ SAMANTHA — EXPLAIN':paused?'▶ RESUME':'Ⅱ PAUSE'}</button>
  {on&&<button onClick={()=>{window.speechSynthesis.cancel();setOn(false);setPaused(false)}} style={btn}>■ STOP</button>}
 </div>
}
const btn={cursor:'pointer',padding:'10px 13px',borderRadius:10,border:'1px solid rgba(112,220,255,.3)',background:'rgba(8,37,47,.9)',color:'#eef8fb',fontWeight:950,fontSize:10} as const;
const card={border:'1px solid rgba(112,220,255,.16)',background:'linear-gradient(145deg,rgba(5,24,37,.88),rgba(2,9,15,.97))',borderRadius:22} as const;

export default function HumanConsequenceBoundaryShowroom(){
 const [evidence,setEvidence]=useState(true),[authority,setAuthority]=useState(true),[standing,setStanding]=useState(true),[changed,setChanged]=useState(false),[pressure,setPressure]=useState(false),[refusal,setRefusal]=useState(true);
 const result:Disposition=useMemo(()=>!authority?'DENY':!standing?'ESCALATE':(!evidence||changed||pressure&&!refusal)?'HOLD':'ALLOW',[evidence,authority,standing,changed,pressure,refusal]);
 const color={ALLOW:C.green,HOLD:C.gold,DENY:C.red,ESCALATE:C.purple}[result];
 const pill=(active:boolean)=>({...btn,border:active?'1px solid rgba(113,242,182,.55)':'1px solid rgba(112,220,255,.18)',background:active?'rgba(113,242,182,.12)':'rgba(2,10,17,.7)',color:active?'#e7fff3':'#819aa7'});
 return <main style={{minHeight:'100vh',padding:'42px 18px 100px',background:'radial-gradient(circle at 80% 0%,rgba(46,195,255,.16),transparent 28%),radial-gradient(circle at 10% 20%,rgba(113,242,182,.08),transparent 30%),linear-gradient(180deg,#02060b,#06101a 48%,#02060b)',color:C.text,fontFamily:'Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
  <div style={{maxWidth:1260,margin:'0 auto'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',paddingBottom:20,borderBottom:'1px solid rgba(112,220,255,.12)'}}>
    <Link href="/showrooms" style={{color:'#9de8f7',textDecoration:'none',fontWeight:900}}>← TA-14 SHOWROOMS</Link>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#718d9b'}}>PUBLIC TECHNICAL SHOWROOM · PRACTITIONER PRESSURE TEST</div>
   </nav>

   <section style={{marginTop:26,padding:'clamp(38px,7vw,82px)',border:'1px solid rgba(112,220,255,.24)',borderRadius:32,background:'linear-gradient(145deg,rgba(7,38,56,.97),rgba(4,13,22,.99) 58%,rgba(19,28,50,.96))',boxShadow:'0 40px 130px rgba(0,0,0,.48)'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.22em',color:C.cyan}}>TA-14 · HPS × AHIA × AEA</div>
    <h1 style={{fontSize:'clamp(52px,9vw,112px)',lineHeight:.88,letterSpacing:'-.07em',margin:'18px 0 24px'}}>THE HUMAN<br/><span style={{color:C.green}}>CONSEQUENCE BOUNDARY</span></h1>
    <p style={{fontSize:'clamp(19px,2.5vw,29px)',lineHeight:1.5,maxWidth:1020,color:'#c5d8df'}}>A practitioner pressure-test showroom for the moment when observation, inference, recommendation, human judgment, authority, and real-world consequence meet.</p>
    <div style={{marginTop:28,padding:'clamp(22px,4vw,38px)',borderRadius:20,border:'1px solid rgba(113,242,182,.34)',background:'rgba(2,10,17,.55)',fontSize:'clamp(23px,3.5vw,43px)',fontWeight:1000,lineHeight:1.12,letterSpacing:'-.035em'}}>Does this proposed consequence have sufficient <span style={{color:C.green}}>Admissible Evidence</span>, <span style={{color:C.cyan}}>Applicable Authority</span>, and <span style={{color:C.purple}}>Established Standing</span> to become reality <span style={{color:'#fff'}}>NOW?</span></div>
    <Samantha text="This showroom examines the human consequence boundary. TA-14 does not ask whether an AI is impressive or whether a human is present. It asks whether this exact proposed consequence has sufficient admissible evidence, applicable authority, and established standing to become reality now."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.green}}>START WITH THE DISTINCTION</div>
    <h2 style={{fontSize:'clamp(34px,5.5vw,68px)',lineHeight:.98,letterSpacing:'-.05em',margin:'12px 0 22px'}}>Observed is not inferred.<br/>Inferred is not authorized.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10}}>
     {['OBSERVED','INFERRED','PROPOSITION','CONSEQUENCE'].map((x,i)=><div key={x} style={{padding:24,borderRadius:17,border:'1px solid rgba(112,220,255,.14)',background:i===3?'rgba(113,242,182,.06)':'rgba(2,10,17,.58)'}}><div style={{fontSize:10,color:C.cyan,fontWeight:950}}>0{i+1}</div><div style={{marginTop:8,fontSize:20,fontWeight:1000}}>{x}</div><div style={{marginTop:9,color:C.muted,lineHeight:1.55,fontSize:13}}>{['What was actually sensed, stated, recorded, or witnessed?','What interpretation did a person or model derive from those observations?','What bounded action or intervention is now being proposed?','What will actually become real if the route crosses commit?'][i]}</div></div>)}
    </div>
    <Samantha text="The first pressure test is separation. Preserve what was observed. Mark what was inferred. Bound the proposition. Then name the consequence. An inference can support a recommendation, but it must not silently become fact, standing, or permission."/>
   </section>

   {sections.map(([n,t,d],i)=><section key={n} style={{marginTop:24,padding:'clamp(28px,5vw,50px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:i===0?C.green:C.cyan}}>{n} · {t}</div>
    <div style={{marginTop:18,padding:22,borderRadius:16,border:'1px solid rgba(112,220,255,.14)',background:'rgba(2,10,17,.55)',fontSize:i===0?'clamp(17px,2vw,22px)':'clamp(18px,2.6vw,31px)',fontWeight:i===0?600:1000,lineHeight:1.5,color:i===0?'#bdd0d8':'#eef8fb'}}>{d}</div>
    <Samantha text={d}/>
   </section>)}

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',border:'1px solid rgba(255,211,111,.28)',borderRadius:24,background:'linear-gradient(145deg,rgba(56,43,10,.24),rgba(2,10,17,.97))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.gold}}>THE NON-BORROWING RULE</div>
    <h2 style={{fontSize:'clamp(35px,5.6vw,68px)',lineHeight:.98,letterSpacing:'-.05em',margin:'12px 0 22px'}}>One valid layer cannot manufacture another.</h2>
    <p style={{fontSize:'clamp(18px,2.2vw,25px)',lineHeight:1.6,color:'#d7d0bd'}}>Evidence, confidence, permission, standing, or authority at one trust boundary must not be presumed to carry unchanged into the next. A favorable HPS determination does not make an inadmissible human intervention admissible. Human approval does not repair a broken parent evidence chain. Correct execution does not prove admissible execution.</p>
    <Samantha text="This is the non-borrowing rule. One layer cannot borrow authority from another layer's success. Confidence is not permission. Human presence is not standing. A technically correct execution does not prove that the route was admissible."/>
   </section>

   <section id="maya" style={{marginTop:24,padding:'clamp(30px,5vw,56px)',...card,scrollMarginTop:24}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.green}}>WORKED PRESSURE TEST · MAYA</div>
    <h2 style={{fontSize:'clamp(38px,6vw,76px)',lineHeight:.95,letterSpacing:'-.055em',margin:'13px 0 22px'}}>Can the practitioner really stop the consequence?</h2>
    <p style={{fontSize:17,lineHeight:1.7,color:'#b9ccd5',maxWidth:1000}}>Maya is a frontline professional using an AI-assisted system in a high-consequence family-violence intervention context. The system surfaces observations and prior records, produces an inference, recommends an intervention, and presents an action control. Time pressure is high. Some contextual evidence is incomplete. The consequences of an incorrect action may be difficult to reverse.</p>
    <div style={{marginTop:18,padding:18,borderRadius:15,border:'1px solid rgba(255,211,111,.25)',background:'rgba(255,211,111,.04)',color:'#d8cfb7',lineHeight:1.65,fontSize:14}}>This is an architecture pressure-test scenario, not substantive legal, clinical, safeguarding, or professional guidance. Domain authority must be established separately.</div>
    <h3 style={{fontSize:28,margin:'28px 0 10px'}}>Demeanor ≠ Standing</h3>
    <p style={{color:'#b9ccd5',lineHeight:1.7}}>Demeanor, affect, communication style, apparent confidence, or an AI interpretation of those signals must not silently become authority or standing. Human-state signals are context, not automatic authority.</p>
    <Samantha text="In the Maya scenario, the central question is not whether the AI is confident or whether Maya is experienced. Bound the exact consequence. Separate observations from inferences. Establish evidence, authority, standing, and current conditions. Then test whether Maya can actually hold, refuse, disagree, and escalate before the workflow proceeds."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.cyan}}>LIVE BOUNDARY LAB</div>
    <h2 style={{fontSize:'clamp(34px,5vw,62px)',lineHeight:1,letterSpacing:'-.05em',margin:'12px 0 22px'}}>Change the conditions. Watch the disposition move.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12}}>
     {[
      ['ADMISSIBLE EVIDENCE',evidence,()=>setEvidence(!evidence),'SUFFICIENT','MISSING / STALE'],
      ['APPLICABLE AUTHORITY',authority,()=>setAuthority(!authority),'ESTABLISHED','ABSENT / PROHIBITORY'],
      ['ESTABLISHED STANDING',standing,()=>setStanding(!standing),'ESTABLISHED','UNRESOLVED'],
      ['MATERIAL CHANGE',!changed,()=>setChanged(!changed),'NO MATERIAL CHANGE','CHANGED BEFORE COMMIT'],
      ['PRESSURE CONDITION',!pressure,()=>setPressure(!pressure),'OPERATING CONDITION ADEQUATE','TIME / HIERARCHY PRESSURE'],
      ['REAL REFUSAL CAPACITY',refusal,()=>setRefusal(!refusal),'AVAILABLE','NOT OPERATIONALLY REAL']
     ].map(([label,ok,toggle,yes,no]:any)=><div key={label} style={{padding:20,...card}}><div style={{fontSize:10,fontWeight:950,letterSpacing:'.13em',color:C.cyan}}>{label}</div><div style={{display:'flex',gap:8,marginTop:13,flexWrap:'wrap'}}><button onClick={toggle} style={pill(ok)}>{ok?yes:no}</button></div></div>)}
    </div>
    <div style={{marginTop:18,padding:'clamp(30px,5vw,52px)',borderRadius:24,border:`1px solid ${color}66`,background:`linear-gradient(135deg,${color}10,rgba(2,10,17,.96))`,textAlign:'center'}}>
     <div style={{fontSize:10,fontWeight:950,letterSpacing:'.2em',color:'#8099a5'}}>CURRENT GOVERNED DISPOSITION</div>
     <div style={{fontSize:'clamp(66px,11vw,132px)',fontWeight:1000,lineHeight:.9,letterSpacing:'-.07em',margin:'17px 0',color}}>{result}</div>
     <p style={{maxWidth:860,margin:'0 auto',fontSize:18,lineHeight:1.6,color:'#b9ccd5'}}>{result==='ALLOW'?'Required gates are presently established. ALLOW permits action; it does not compel the human to act.':result==='HOLD'?'A curable evidence, condition, or human-operating deficiency blocks this consequence now. Preserve state and re-examine.':result==='DENY'?'Applicable Authority is absent or prohibitory. Capability, urgency, or confidence cannot manufacture permission.':'Standing is not sufficiently established. Route to the appropriate governed authority or review path.'}</p>
    </div>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.green}}>AHIA · CAN THE HUMAN INTERVENTION SURVIVE PRESSURE?</div>
    <h2 style={{fontSize:'clamp(34px,5vw,62px)',lineHeight:1,letterSpacing:'-.05em',margin:'12px 0 22px'}}>Human in the loop is not enough.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:10}}>
     {['Can the person obtain more evidence without being penalized for delay?','Can the person place the route on HOLD?','Can the person refuse without fabricating certainty?','Can the person escalate to competent independent authority?','Can the system preserve state while reassessment occurs?','Can dissent be recorded without being erased?','Can the route fail closed when human admissibility cannot be established?'].map((x,i)=><div key={x} style={{padding:20,borderRadius:16,border:'1px solid rgba(112,220,255,.13)',background:'rgba(2,10,17,.52)'}}><div style={{fontSize:10,fontWeight:950,color:C.cyan}}>TEST {String(i+1).padStart(2,'0')}</div><div style={{marginTop:8,fontSize:15,lineHeight:1.55,fontWeight:800}}>{x}</div></div>)}
    </div>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.cyan}}>AHI LEVELS · EVIDENTIARY, NOT DECLARATIVE</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:10,marginTop:20}}>
     {[
      ['AHI-0','PRESENCE ONLY','Human present; governance conditions not established.'],
      ['AHI-1','RECORDED REVIEW','Review identifiable, but continuity, pressure, or refusal controls remain weak.'],
      ['AHI-2','BOUNDED INTERVENTION','Role, authority, scope, evidence, and determination explicitly governed.'],
      ['AHI-3','ADMISSIBLE INTERVENTION','Current reality, evidence, authority, refusal/escalation, bounded commit, replayable record.'],
      ['AHI-4','PRESSURE-SURVIVABLE','Intervention remains operationally real under time, hierarchy, drift, dependency, and momentum.'],
      ['AHI-5','ROUTE-COMPLETE','Human governance reaches outcome, prevented consequence, institutional memory, and future reliance.']
     ].map(([n,t,d])=><div key={n} style={{padding:22,borderRadius:17,border:'1px solid rgba(112,220,255,.14)',background:'rgba(2,10,17,.55)'}}><div style={{fontSize:22,fontWeight:1000,color:C.green}}>{n}</div><div style={{marginTop:7,fontSize:13,fontWeight:950}}>{t}</div><p style={{color:C.muted,lineHeight:1.55,fontSize:13}}>{d}</p></div>)}
    </div>
   </section>

   <section style={{marginTop:24,padding:'clamp(30px,5vw,56px)',border:'1px solid rgba(255,120,133,.25)',borderRadius:24,background:'linear-gradient(145deg,rgba(70,15,25,.16),rgba(2,10,17,.97))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.red}}>PRACTITIONER PRESSURE TEST</div>
    <h2 style={{fontSize:'clamp(42px,6.6vw,82px)',lineHeight:.92,letterSpacing:'-.06em',margin:'14px 0 24px'}}>DO NOT PROTECT<br/><span style={{color:C.red}}>THE ARCHITECTURE.</span><br/>ATTACK IT.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(285px,1fr))',gap:10}}>
     {attacks.map(([n,t,d])=><article key={n} style={{padding:21,borderRadius:16,border:'1px solid rgba(255,120,133,.14)',background:'rgba(2,10,17,.6)'}}><div style={{fontSize:10,fontWeight:950,color:C.red}}>{n}</div><div style={{fontSize:16,fontWeight:1000,margin:'7px 0'}}>{t}</div><div style={{fontSize:13,lineHeight:1.6,color:C.muted}}>{d}</div></article>)}
    </div>
    <Samantha text="Do not ask practitioners whether they agree with TA-14. Ask where it fails. Use incomplete evidence, stale authority, model confidence, standing gaps, time pressure, hierarchy pressure, scope drift, changed conditions, lawful disagreement, prevented consequence, receipt mismatch, and human boundary collapse. Preserve every failure."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(30px,5vw,56px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.green}}>THE RECORD AFTERWARD</div>
    <h2 style={{fontSize:'clamp(35px,5.5vw,68px)',lineHeight:.98,letterSpacing:'-.05em',margin:'12px 0 22px'}}>What happened — including what did not happen — must survive.</h2>
    <p style={{fontSize:18,lineHeight:1.7,color:'#b9ccd5'}}>HPS uses a Human-Action Receipt to reconstruct the consequential moment. AHIA uses a Human Determination Record and Minimum Human Intervention Evidence Package to preserve standing, evidence, authority, operating condition, determination, commit boundary, execution or non-execution, outcome, and future reliance. A prevented inadmissible consequence is not an absence of outcome. Non-occurrence can be the governed result.</p>
    <div style={{marginTop:22,padding:22,borderRadius:17,border:'1px solid rgba(113,242,182,.28)',background:'rgba(113,242,182,.05)',fontSize:'clamp(22px,3vw,36px)',fontWeight:1000,lineHeight:1.2}}>COMMISSIONED ONCE ≠ AUTHORIZED FOREVER.<br/><span style={{color:C.green}}>PAST PERMISSION ≠ PRESENT AUTHORITY.</span></div>
   </section>

   <section style={{marginTop:24,padding:'clamp(34px,6vw,68px)',border:'1px solid rgba(113,242,182,.3)',borderRadius:28,background:'radial-gradient(circle at 76% 0%,rgba(113,242,182,.11),transparent 28%),linear-gradient(145deg,rgba(8,36,48,.96),rgba(3,11,19,.98))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.green}}>FINAL PRACTITIONER QUESTION</div>
    <h2 style={{fontSize:'clamp(39px,6.3vw,78px)',lineHeight:.94,letterSpacing:'-.058em',margin:'14px 0 22px'}}>AT THE EXACT MOMENT CONSEQUENCE IS ABOUT TO BECOME REAL...</h2>
    <p style={{fontSize:'clamp(20px,2.8vw,32px)',lineHeight:1.5,color:'#c5d8df'}}>What evidence is admissible? What authority actually applies? Who has standing? What has changed? Can the human really refuse? What proof will remain afterward?</p>
    <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:26}}>
     <Link href="/human-performance-stack" style={{...btn,textDecoration:'none'}}>HPS →</Link>
     <Link href="/admissible-human-intervention-architecture" style={{...btn,textDecoration:'none'}}>AHIA →</Link>
     <Link href="/admissible-execution-architecture" style={{...btn,textDecoration:'none'}}>AEA →</Link>
    </div>
   </section>

   <section style={{marginTop:24,padding:24,borderRadius:18,border:'1px solid rgba(112,220,255,.12)',background:'rgba(2,10,17,.55)',fontSize:12,lineHeight:1.7,color:'#78909b'}}>
    <b style={{color:'#a8bdc7'}}>BOUNDARY / NON-CLAIM.</b> This showroom is an explanatory and adversarial testing surface derived from TA-14 AEA Foundational Monograph v1.2, AHIA v1.0, and HPS v1.0 Frozen Publication Candidate. It does not establish legal, clinical, safeguarding, regulatory, professional, or institutional authority; it does not certify competence or compliance; and it does not claim that a human is inherently safer or more authoritative than a machine. Applicable domain authority remains controlling.
   </section>

   <footer style={{marginTop:28,paddingTop:20,borderTop:'1px solid rgba(112,220,255,.1)',display:'flex',justifyContent:'space-between',gap:14,flexWrap:'wrap',color:'#66818e',fontSize:11}}>
    <div>TA-14 AUTHORITY · HPS × AHIA × AEA · PRACTITIONER PRESSURE-TEST SHOWROOM</div><div>No endorsement implied · Challenge the boundary</div>
   </footer>
  </div>
 </main>
}