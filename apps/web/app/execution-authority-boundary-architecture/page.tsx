'use client';

import Link from 'next/link';
import {useMemo,useState} from 'react';

type Result='ALLOW'|'HOLD'|'DENY'|'ESCALATE';
type Proof={id:string;name:string;question:string;plain:string;failure:string;gate:string};
type Attack={name:string;result:Result;breaks:string[];why:string;receipt:string};

const chain=['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'];
const proofs:Proof[]=[
 {id:'P-01',name:'PRESENT STATE',question:'Do we know what is true now?',plain:'The evidence must describe the current state closely enough for this consequence. Old truth cannot silently become present truth.',failure:'Stale or missing current-state evidence.',gate:'P-EVID'},
 {id:'P-02',name:'TARGET IDENTITY',question:'Are we acting on the exact thing we examined?',plain:'The target, version, asset, endpoint, or protected object must be the same target that was evaluated.',failure:'Target changed, alias drifted, or version no longer matches.',gate:'P-TGT'},
 {id:'P-03',name:'EVIDENCE CONTINUITY',question:'Can we trust the path from reality to this evidence?',plain:'Identity, chronology, integrity, custody, and relevant transformations must remain reconstructable.',failure:'A gap breaks the evidentiary chain.',gate:'P-CONT / P-EVID'},
 {id:'P-04',name:'ACTOR IDENTITY',question:'Do we know who or what is attempting the consequence?',plain:'The acting human, agent, service, or machine identity must be established for this exact attempt.',failure:'Unknown, substituted, or unverifiable actor.',gate:'P-AUTH'},
 {id:'P-05',name:'AUTHORITY',question:'Does that actor have present authority to do this?',plain:'Capability, intelligence, credentials, or prior approval do not themselves establish present execution authority.',failure:'Authority expired, was revoked, or was never established.',gate:'P-AUTH'},
 {id:'P-06',name:'SCOPE',question:'Does the authority actually cover this consequence?',plain:'Authority must cover the requested action, target, consequence class, limits, and relevant conditions.',failure:'Valid authority exists, but not for this action or scope.',gate:'P-AUTH / P-BIND'},
 {id:'P-07',name:'LOCAL STANDING',question:'Is authority valid here, in the receiving domain?',plain:'Imported context may inform a decision, but local standing must be established where the protected consequence will occur.',failure:'Accepted foreign context is mistaken for local permission.',gate:'P-ADM / P-AUTH'},
 {id:'P-08',name:'CHANGED CONDITIONS',question:'Has anything material changed since evaluation?',plain:'A previously valid route must be re-evaluated when a material condition changes before commit.',failure:'State, authority, target, environment, or constraints changed.',gate:'P-CONT / P-EVID'},
 {id:'P-09',name:'COMMIT INTEGRITY',question:'Is this exact attempt still bound at commit?',plain:'The authorized request, evidence, target, attempt identity, and commit must remain atomically bound at the consequence seam.',failure:'TOCTOU drift, replay, substitution, or duplicate consumption.',gate:'P-BIND / P-TGT'},
 {id:'P-10',name:'OUTCOME OBLIGATION',question:'Can we prove what happened after the decision?',plain:'The route must preserve effect and outcome evidence sufficient to distinguish what was decided from what actually occurred.',failure:'Effect happened or may have happened, but the outcome cannot be reconstructed.',gate:'RECEIPT / EFFECT EVIDENCE'}
];
const gates=[
 ['P-AUTH','AUTHORITY','Is present authority established for this actor, action and scope?'],
 ['P-CONT','CONTINUITY','Does the relied-upon record retain required continuity?'],
 ['P-ADM','ADMISSIBILITY','Is the evidence admissible for this consequence now?'],
 ['P-BIND','BINDING','Are authority, evidence, request and attempt bound together?'],
 ['P-TGT','TARGET','Does the commit still address the exact evaluated target?'],
 ['P-EVID','EVIDENCE','Is the required evidence present, current and integrity-bound?']
];
const attacks:Attack[]=[
 {name:'STALE EVIDENCE',result:'HOLD',breaks:['P-01','P-08','P-EVID'],why:'The evidence may once have been true, but it is outside the permitted freshness bound. The system cannot convert historical truth into present standing.',receipt:'HOLD · stale evidence · protected commit not consumed'},
 {name:'REVOKED AUTHORITY',result:'DENY',breaks:['P-05','P-AUTH'],why:'Authority is affirmatively revoked. A credential, earlier approval, or successful connection cannot override revocation.',receipt:'DENY · authority revoked · zero authorized effect'},
 {name:'CHANGED TARGET',result:'HOLD',breaks:['P-02','P-09','P-TGT','P-BIND'],why:'The object at commit is not the exact target/version that was evaluated. Re-establish the route against the new target.',receipt:'HOLD · target mismatch · revalidation required'},
 {name:'REPLAYED ATTEMPT',result:'DENY',breaks:['P-09','P-BIND'],why:'One ALLOW cannot silently authorize a second commit. The attempt identity has already been consumed or presented before.',receipt:'DENY · replay detected · duplicate consequence blocked'},
 {name:'UNRESOLVED AUTHORITY',result:'ESCALATE',breaks:['P-05','P-07','P-AUTH','P-ADM'],why:'The frozen rule set cannot settle conflicting authority or local standing. The architecture preserves uncertainty instead of inventing permission.',receipt:'ESCALATE · authority unresolved · human/institutional resolution required'},
 {name:'RECEIPT LOSS',result:'HOLD',breaks:['P-10'],why:'A commit may have occurred, but effect evidence is missing. The correct state is not success and not automatic retry: effect truth is indeterminate.',receipt:'HOLD · EFFECT INDETERMINATE · reconstruct before any retry'}
];

const C={bg:'#02060c',panel:'#071522',line:'#28445e',cyan:'#79d8ff',gold:'#f1cb73',text:'#f4f8ff',muted:'#9fb5ca',green:'#7cf2b1',red:'#ff7b86'};

export default function EABAShowroom(){
 const [proof,setProof]=useState(0),[gate,setGate]=useState(0),[attack,setAttack]=useState(0);
 const [ran,setRan]=useState(false),[effect,setEffect]=useState(false),[tour,setTour]=useState(0);
 const [scenario,setScenario]=useState({state:true,target:true,authority:true,scope:true,standing:true,binding:true,evidence:true});
 const selected=proofs[proof], a=attacks[attack];
 const scenarioResult=useMemo<Result>(()=>{
  if(!scenario.authority) return 'DENY';
  if(!scenario.standing) return 'ESCALATE';
  if(!scenario.state||!scenario.target||!scenario.scope||!scenario.binding||!scenario.evidence) return 'HOLD';
  return 'ALLOW';
 },[scenario]);
 const toggle=(k:keyof typeof scenario)=>setScenario(v=>({...v,[k]:!v[k]}));
 const tourSteps=[
  ['1 · START WITH REALITY','A system may understand a request perfectly. EABA still asks whether protected consequence is permitted now.'],
  ['2 · PROVE STANDING','EABS keeps ten proof burdens explicit so one kind of proof cannot silently substitute for another.'],
  ['3 · GATE THE COMMIT','EBG checks the bounded commit seam. The gateway is an enforcement surface inside the larger EABA architecture.'],
  ['4 · REFUSE SAFELY','If a required condition fails, the route produces HOLD, DENY, or ESCALATE instead of treating absence of refusal as permission.'],
  ['5 · PROVE THE EFFECT','After commit, outcome evidence must establish what actually happened. A decision receipt is not effect truth.']
 ];
 return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0,#19314b 0,#07111f 30%,#02060c 72%)',color:C.text,fontFamily:'Inter,system-ui,sans-serif'}}>
  <div style={{width:'min(1280px,calc(100% - 28px))',margin:'0 auto',padding:'22px 0 100px'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'center',paddingBottom:20,borderBottom:'1px solid '+C.line,flexWrap:'wrap'}}>
    <Link href="/" style={{color:'#fff',textDecoration:'none',fontWeight:950,letterSpacing:'.13em'}}>TA-14 EXCHANGE</Link>
    <span style={{fontSize:10,color:C.cyan,fontWeight:900,letterSpacing:'.13em'}}>EABA v1.0-RC1 · REGISTERED · TA-14-AIGR-000043</span>
   </nav>

   <section style={{padding:'72px 0 44px',maxWidth:1120}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.2em',color:C.cyan}}>EXECUTION AUTHORITY BOUNDARY ARCHITECTURE</div>
    <h1 style={{fontSize:'clamp(46px,7.6vw,96px)',lineHeight:.91,letterSpacing:'-.055em',margin:'18px 0 24px'}}>THE SYSTEM CAN KNOW.<br/><span style={{color:C.cyan}}>THAT DOES NOT MEAN</span><br/>THE SYSTEM MAY ACT.</h1>
    <p style={{fontSize:'clamp(17px,2vw,22px)',lineHeight:1.65,color:'#bdd0e2',maxWidth:940}}>EABA is the architecture between <b style={{color:'#fff'}}>knowing</b> and <b style={{color:C.gold}}>doing</b>. It requires a consequential system to prove that authority is present, evidence is admissible, the exact target is bound, conditions have not materially changed, and the protected commit is still authorized <em>now</em>.</p>
    <div style={{display:'flex',flexWrap:'wrap',gap:10,marginTop:26}}>
     <a href="#learn" style={primary}>UNDERSTAND EABA IN 60 SECONDS ↓</a>
     <a href="https://www.ta14exchange.com/workspace/ai-governance/registry/records/TA-14-AIGR-000043" target="_blank" rel="noreferrer" style={secondary}>REGISTRY · TA-14-AIGR-000043 ↗</a>
     <a href="#lab" style={secondary}>TRY THE CONSEQUENCE LAB ↓</a>
     <a href="https://doi.org/10.5281/zenodo.22851885" target="_blank" rel="noreferrer" style={secondary}>CANONICAL RC1 ↗</a>
    </div>
   </section>

   <section style={{...feature,marginBottom:22}}>
    <Eyebrow>REGISTERED GOVERNANCE · PUBLIC EVIDENCE DRAWER</Eyebrow><h2 style={h2}>One architecture. Three inspectable records.</h2>
    <p style={lead}>EABA now has a permanent governed identity, a canonical public archive, and a public explanatory article. Registration preserves identity and boundaries; it does not convert RC1 into Technical Freeze or certification.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:10,marginTop:20}}>
     <a href="https://www.ta14exchange.com/workspace/ai-governance/registry/records/TA-14-AIGR-000043" target="_blank" rel="noreferrer" style={{...secondary,padding:20}}><b style={{display:'block',color:C.cyan,marginBottom:8}}>REGISTRY RECORD</b>TA-14-AIGR-000043 · Registered Sep 20, 2026</a>
     <a href="https://doi.org/10.5281/zenodo.22851885" target="_blank" rel="noreferrer" style={{...secondary,padding:20}}><b style={{display:'block',color:C.gold,marginBottom:8}}>CANONICAL ARCHIVE</b>DOI 10.5281/zenodo.22851885 · v1.0-RC1</a>
     <a href="https://www.linkedin.com/feed/update/urn:li:activity:7507281412740308992" target="_blank" rel="noreferrer" style={{...secondary,padding:20}}><b style={{display:'block',color:C.green,marginBottom:8}}>PUBLIC EXPLANATION</b>The Crossing Can Be Valid and the Answer Can Still Be HOLD</a>
    </div>
   </section>

   <section id="learn" style={feature}>
    <Eyebrow>60-SECOND GUIDED TOUR</Eyebrow><h2 style={h2}>What did we actually create?</h2>
    <p style={lead}>A governed boundary that stops information, intelligence, interoperability, or old authorization from silently becoming permission to cause a protected consequence.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:8,margin:'24px 0'}}>
     {tourSteps.map((x,i)=><button key={x[0]} onClick={()=>setTour(i)} style={button(tour===i)}><small style={{color:C.cyan}}>{x[0]}</small><strong style={{display:'block',marginTop:7}}>{['KNOW','PROVE','GATE','REFUSE','PROVE AGAIN'][i]}</strong></button>)}
    </div>
    <div style={{padding:24,borderRadius:14,background:'#030b13',border:'1px solid #315778'}}><b style={{fontSize:20,color:C.gold}}>{tourSteps[tour][0]}</b><p style={{fontSize:16,lineHeight:1.7,color:'#bfd0df',marginBottom:0}}>{tourSteps[tour][1]}</p></div>
    <div style={{marginTop:20,padding:18,border:'1px dashed '+C.gold,borderRadius:12,textAlign:'center',fontWeight:950,color:C.gold}}>PROTECTED CONSEQUENCE REQUIRES PRESENT, ADMISSIBLE, BOUND EXECUTION AUTHORITY AT THE POINT OF COMMIT.</div>
   </section>

   <section style={{padding:'68px 0 28px'}}>
    <Eyebrow>THE SIMPLEST POSSIBLE MODEL</Eyebrow><h2 style={h2}>Meaning can cross the boundary. Permission cannot be assumed across it.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:7,marginTop:24}}>
     {['SYSTEM UNDERSTANDS','ACTION PROPOSED','EABS PROVES','EBG GATES','DETERMINATION','ATOMIC COMMIT','PROTECTED EFFECT','EFFECT EVIDENCE','OUTCOME / CLOSURE'].map((x,i)=><div key={x} style={{padding:'20px 10px',minHeight:82,borderRadius:11,border:i===5?'1px solid '+C.gold:'1px solid '+C.line,background:i===5?'rgba(119,82,13,.22)':C.panel,textAlign:'center',fontWeight:900,fontSize:10,color:i===5?C.gold:'#c4d5e4'}}><span style={{display:'block',fontSize:9,color:C.cyan,marginBottom:8}}>{String(i+1).padStart(2,'0')}</span>{x}</div>)}
    </div>
    <div style={{marginTop:14,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(125px,1fr))',gap:6}}>{chain.map(x=><div key={x} style={{padding:12,textAlign:'center',border:'1px solid #1d354b',borderRadius:8,fontSize:9,color:'#8fa9bf'}}>{x}</div>)}</div>
   </section>

   <section style={{padding:'62px 0 28px'}}>
    <Eyebrow>EABS · PROOF BOUNDARY</Eyebrow><h2 style={h2}>Ten questions before consequence.</h2>
    <p style={lead}>Click any burden. Each answers a different question. None may silently stand in for another.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:9,marginTop:22}}>{proofs.map((p,i)=><button key={p.id} onClick={()=>setProof(i)} style={button(i===proof)}><small style={{color:C.cyan}}>{p.id}</small><strong style={{display:'block',margin:'7px 0 5px'}}>{p.name}</strong><span style={{fontSize:10,color:'#91a9bd'}}>{p.question}</span></button>)}</div>
    <div style={{marginTop:12,padding:24,border:'1px solid #315778',borderRadius:14,background:'#050f1a',display:'grid',gridTemplateColumns:'minmax(180px,.65fr) minmax(280px,1.35fr)',gap:22}}>
     <div><small style={{color:C.cyan,fontWeight:950}}>{selected.id} · {selected.name}</small><h3 style={{fontSize:24,margin:'9px 0',color:'#fff'}}>{selected.question}</h3><span style={{fontSize:10,color:C.gold,fontWeight:900}}>MAPS TOWARD {selected.gate}</span></div>
     <div><p style={{color:'#b5c8d8',lineHeight:1.7,marginTop:0}}>{selected.plain}</p><div style={{padding:12,borderLeft:'3px solid '+C.gold,background:'rgba(241,203,115,.06)',color:'#cdbf9e',fontSize:12}}><b>WHEN IT FAILS:</b> {selected.failure}</div></div>
    </div>
   </section>

   <section style={{padding:'62px 0 28px'}}>
    <Eyebrow>EBG · BOUNDED COMMIT GATEWAY</Eyebrow><h2 style={h2}>Six gateway predicates. Still not the whole architecture.</h2>
    <p style={lead}>EBG makes the commit seam executable. EABA remains the parent architecture: all applicable proof obligations must still be satisfied.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:9,marginTop:22}}>{gates.map((g,i)=><button key={g[0]} onClick={()=>setGate(i)} style={button(i===gate)}><small style={{color:C.cyan}}>{g[0]}</small><strong style={{display:'block',marginTop:7}}>{g[1]}</strong></button>)}</div>
    <div style={{marginTop:12,padding:20,border:'1px solid '+C.line,borderRadius:12,background:'#050d17'}}><b style={{color:C.gold}}>{gates[gate][0]} · {gates[gate][1]}</b><p style={{color:'#afc2d3',lineHeight:1.7,marginBottom:0}}>{gates[gate][2]}</p></div>
   </section>

   <section id="lab" style={{padding:'70px 0 30px'}}>
    <Eyebrow>LIVE CONSEQUENCE LAB</Eyebrow><h2 style={h2}>Change one fact. Watch permission disappear.</h2>
    <p style={lead}>Start with a fully established route. Toggle any condition. EABA recomputes the governed determination without silently repairing the failure.</p>
    <div style={{display:'grid',gridTemplateColumns:'minmax(280px,1.2fr) minmax(260px,.8fr)',gap:14,marginTop:24}}>
     <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:8}}>
      {([['state','PRESENT STATE'],['target','TARGET MATCH'],['authority','AUTHORITY'],['scope','SCOPE'],['standing','LOCAL STANDING'],['binding','COMMIT BINDING'],['evidence','EVIDENCE']] as const).map(([k,label])=><button key={k} onClick={()=>toggle(k)} style={{padding:17,borderRadius:10,border:'1px solid '+(scenario[k]?C.green:C.red),background:scenario[k]?'rgba(40,126,85,.13)':'rgba(150,42,51,.14)',color:scenario[k]?C.green:C.red,textAlign:'left',cursor:'pointer',fontWeight:950}}><span style={{fontSize:16}}>{scenario[k]?'●':'×'}</span> {label}<small style={{display:'block',marginTop:6,color:'#93aabd'}}>{scenario[k]?'ESTABLISHED · click to break':'NOT ESTABLISHED · click to restore'}</small></button>)}
     </div>
     <div style={{padding:28,borderRadius:16,border:'1px solid '+(scenarioResult==='ALLOW'?C.green:scenarioResult==='DENY'?C.red:C.gold),background:'#050d17'}}>
      <small style={{color:'#8299ad'}}>CURRENT DETERMINATION</small><strong style={{display:'block',fontSize:42,margin:'8px 0',color:scenarioResult==='ALLOW'?C.green:scenarioResult==='DENY'?C.red:C.gold}}>{scenarioResult}</strong>
      <p style={{color:'#afc2d3',lineHeight:1.65}}>{scenarioResult==='ALLOW'?'All modeled conditions are established. This attempt is eligible to proceed to protected commit; effect and outcome evidence are still required.':scenarioResult==='DENY'?'Authority is affirmatively absent. Protected commit is refused.':scenarioResult==='ESCALATE'?'Local standing is unresolved. The architecture refuses to invent permission and routes the question for resolution.':'At least one required condition is not established. Protected commit remains blocked until the route is re-established.'}</p>
      <button onClick={()=>setScenario({state:true,target:true,authority:true,scope:true,standing:true,binding:true,evidence:true})} style={secondary}>RESET ALL CONDITIONS</button>
     </div>
    </div>
   </section>

   <section style={{padding:'66px 0 30px'}}>
    <Eyebrow>ADVERSARIAL EXAMINATION</Eyebrow><h2 style={h2}>Attack the boundary. See exactly what breaks.</h2>
    <div style={{display:'grid',gridTemplateColumns:'minmax(220px,.75fr) minmax(300px,1.25fr)',gap:14,marginTop:22}}>
     <div style={{display:'grid',gap:8}}>{attacks.map((x,i)=><button key={x.name} onClick={()=>{setAttack(i);setRan(false)}} style={button(i===attack)}>{x.name}</button>)}</div>
     <div style={{padding:26,border:'1px solid #315778',borderRadius:14,background:C.panel}}>
      <small style={{color:'#8299ad'}}>EXPECTED GOVERNED RESULT</small><strong style={{display:'block',fontSize:34,color:C.gold,margin:'8px 0'}}>{a.result}{a.name==='RECEIPT LOSS'?' / EFFECT INDETERMINATE':''}</strong>
      <div style={{display:'flex',gap:6,flexWrap:'wrap',margin:'10px 0 16px'}}>{a.breaks.map(x=><span key={x} style={{padding:'6px 8px',borderRadius:20,background:'rgba(255,123,134,.1)',border:'1px solid rgba(255,123,134,.35)',fontSize:9,color:'#ff9aa3',fontWeight:900}}>BREAKS {x}</span>)}</div>
      <p style={{color:'#b6c8d7',lineHeight:1.7}}>{a.why}</p><button onClick={()=>setRan(true)} style={primary}>RUN BOUNDARY TEST</button>
      {ran&&<div style={{marginTop:16,padding:16,borderRadius:10,background:'#02070c',border:'1px solid #233b50'}}><small style={{color:C.cyan}}>RECEIPT / RESULT TRACE</small><div style={{marginTop:7,color:'#d8e7f2',fontWeight:900}}>{a.receipt}</div><div style={{marginTop:8,color:a.result==='ALLOW'?C.green:C.gold,fontSize:11}}>PROTECTED EFFECT: {a.result==='ALLOW'?'ELIGIBLE':'BLOCKED OR UNPROVEN'}</div></div>}
     </div>
    </div>
   </section>

   <section style={{padding:'66px 0 30px'}}>
    <Eyebrow>EFFECT TRUTH LAB</Eyebrow><h2 style={h2}>ALLOW tells you what was permitted. It does not tell you what happened.</h2>
    <p style={lead}>This is one of the most important EABA distinctions. Determination truth and effect truth are separate records.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:9,margin:'22px 0'}}>
     {['DETERMINATION\nWhat was permitted?','COMMIT\nWas the attempt consumed?','EFFECT\nWhat physically/digitally changed?','OUTCOME\nCan the result be reconstructed?'].map(x=><div key={x} style={{whiteSpace:'pre-line',padding:20,border:'1px solid '+C.line,borderRadius:11,background:C.panel,fontWeight:900,lineHeight:1.6}}>{x}</div>)}
    </div>
    <button onClick={()=>setEffect(!effect)} style={primary}>SIMULATE CRASH AFTER COMMIT</button>
    {effect&&<div style={{marginTop:16,padding:24,border:'1px solid '+C.gold,borderRadius:13,background:'rgba(98,64,12,.18)'}}><strong style={{fontSize:30,color:C.gold}}>EFFECT: INDETERMINATE</strong><p style={{color:'#d0c3a4',lineHeight:1.7}}>The endpoint may even look unchanged, yet a transient mutation could have occurred. EABA therefore forbids a clean PASS or silent retry. Preserve the uncertainty, reconstruct the effect record, or escalate.</p></div>}
   </section>

   <section style={{padding:'66px 0 30px'}}>
    <Eyebrow>INDEPENDENT EXAMINATION GATE</Eyebrow><h2 style={h2}>The implementation does not get to grade itself.</h2>
    <p style={lead}>RC1 is published architecture, not a claim that every implementation is proven. Independent implementation examination remains a separate gate.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:9,marginTop:20}}>{['FROZEN REQUIREMENTS','NEGATIVE VECTORS','INDEPENDENT IMPLEMENTATION','PREDICATE + REASON EVIDENCE','EFFECT EVIDENCE','INTEGRITY REFERENCES','AMBIGUITY RETURN PATH'].map((x,i)=><div key={x} style={{padding:18,border:'1px solid '+C.line,borderRadius:10,background:C.panel}}><small style={{color:C.cyan}}>0{i+1}</small><strong style={{display:'block',marginTop:6,fontSize:11}}>{x}</strong></div>)}</div>
   </section>

   <section style={feature}>
    <Eyebrow>WHY EABA EXISTS</Eyebrow><h2 style={h2}>The missing layer is not intelligence. It is admissible permission at consequence.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10,marginTop:22}}>
     {[['AI CAN REASON','Reasoning can propose a consequence. It does not establish authority to cause it.'],['SYSTEMS CAN CONNECT','Interoperability can carry meaning and context. It does not automatically transfer execution authority.'],['HUMANS CAN APPROVE','Prior approval can become stale, revoked, out of scope, or detached from the exact commit attempt.'],['EABA GOVERNS THE SEAM','Proof, authority, binding, refusal, commit integrity, effect evidence, and closure meet at one consequence boundary.']].map(x=><article key={x[0]} style={{padding:22,border:'1px solid '+C.line,borderRadius:12,background:C.panel}}><b style={{color:C.gold}}>{x[0]}</b><p style={{fontSize:12,lineHeight:1.65,color:'#aabfd0'}}>{x[1]}</p></article>)}
    </div>
   </section>

   <section style={{padding:'70px 0 10px',textAlign:'center'}}>
    <Eyebrow>REGISTERED RC1 · THE COMPLETE LOOP</Eyebrow><h2 style={{...h2,fontSize:'clamp(30px,5vw,58px)'}}>SPECIFY → ESTABLISH → BIND → GATE → DETERMINE → COMMIT → EFFECT → PROVE → CLOSE</h2>
    <p style={{...lead,margin:'0 auto',maxWidth:920}}>EABA does not ask intelligent systems to know less. It requires consequential systems to establish more before acting—and to leave behind enough evidence to prove what actually happened.</p>
    <div style={{display:'flex',justifyContent:'center',gap:10,flexWrap:'wrap',marginTop:25}}><a href="https://www.ta14exchange.com/workspace/ai-governance/registry/records/TA-14-AIGR-000043" target="_blank" rel="noreferrer" style={primary}>OPEN PERMANENT REGISTRY RECORD ↗</a><a href="https://doi.org/10.5281/zenodo.22851885" target="_blank" rel="noreferrer" style={secondary}>READ CANONICAL EABA RC1 ↗</a><Link href="/admissible-federation-architecture" style={secondary}>EXPLORE AFA →</Link><Link href="/" style={secondary}>RETURN TO EXCHANGE →</Link></div>
   </section>
  </div>
 </main>
}

function Eyebrow({children}:{children:React.ReactNode}){return <div style={{fontSize:10,fontWeight:950,letterSpacing:'.18em',color:C.cyan}}>{children}</div>}
const h2:React.CSSProperties={fontSize:'clamp(34px,4.6vw,52px)',lineHeight:1.02,letterSpacing:'-.035em',margin:'10px 0'};
const lead:React.CSSProperties={color:C.muted,lineHeight:1.72,maxWidth:900,fontSize:15};
const feature:React.CSSProperties={padding:30,border:'1px solid #315778',borderRadius:22,background:'linear-gradient(135deg,rgba(20,59,88,.48),rgba(5,17,30,.94))',boxShadow:'0 28px 90px rgba(0,0,0,.3)'};
const primary:React.CSSProperties={display:'inline-block',cursor:'pointer',padding:'13px 16px',borderRadius:9,border:'1px solid '+C.cyan,background:C.cyan,color:'#03101c',fontWeight:950,fontSize:10,textDecoration:'none'};
const secondary:React.CSSProperties={display:'inline-block',cursor:'pointer',padding:'13px 16px',borderRadius:9,border:'1px solid #3b5870',background:'transparent',color:'#d9e8f6',fontWeight:900,fontSize:10,textDecoration:'none'};
function button(active:boolean):React.CSSProperties{return {cursor:'pointer',padding:17,textAlign:'left',borderRadius:10,border:active?'1px solid '+C.cyan:'1px solid '+C.line,background:active?'rgba(56,151,197,.16)':C.panel,color:active?'#8ee1ff':'#b3c6d6',fontWeight:900}}
