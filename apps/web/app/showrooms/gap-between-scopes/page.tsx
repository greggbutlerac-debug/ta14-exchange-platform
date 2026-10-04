'use client';

import Link from 'next/link';
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

export default function GapBetweenScopesShowroom(){
 const [installed,setInstalled]=useState(true),[programmed,setProgrammed]=useState(true),[tab,setTab]=useState(false),[safeties,setSafeties]=useState(true),[authority,setAuthority]=useState(true),[accepted,setAccepted]=useState(false);
 const result:Disposition=useMemo(()=>!authority?'DENY':(!installed||!programmed||!safeties)?'HOLD':(!tab||!accepted)?'ESCALATE':'ALLOW',[installed,programmed,tab,safeties,authority,accepted]);
 const color={ALLOW:C.green,HOLD:C.gold,DENY:C.red,ESCALATE:C.purple}[result];
 const toggle=(label:string,value:boolean,setter:(v:boolean)=>void)=><button onClick={()=>setter(!value)} style={{...btn,border:value?'1px solid rgba(113,242,182,.5)':'1px solid rgba(255,120,133,.5)',color:value?C.green:C.red}}>{label}: {value?'YES':'NO'}</button>;

 return <main style={{minHeight:'100vh',padding:'42px 18px 100px',background:'radial-gradient(circle at 82% 0%,rgba(46,195,255,.15),transparent 28%),linear-gradient(180deg,#02060b,#06101a 48%,#02060b)',color:C.text,fontFamily:'Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
  <div style={{maxWidth:1260,margin:'0 auto'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',paddingBottom:20,borderBottom:'1px solid rgba(112,220,255,.12)'}}><Link href="/showrooms" style={{color:'#9de8f7',textDecoration:'none',fontWeight:900}}>← TA14 SHOWROOMS</Link><div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#718d9b'}}>PUBLIC TECHNICAL SHOWROOM · COMMISSIONING · HANDOFF · CONSEQUENCE</div></nav>

   <section style={{marginTop:26,padding:'clamp(38px,7vw,82px)',border:'1px solid rgba(112,220,255,.24)',borderRadius:32,background:'linear-gradient(145deg,rgba(7,38,56,.97),rgba(4,13,22,.99) 58%,rgba(19,28,50,.96))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.2em',color:C.cyan}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT TECHNICAL EXAMINATION</div>
    <h1 style={{fontSize:'clamp(52px,9vw,112px)',lineHeight:.87,letterSpacing:'-.07em',margin:'18px 0 24px'}}>THE GAP<br/><span style={{color:C.green}}>BETWEEN SCOPES</span></h1>
    <p style={{fontSize:'clamp(20px,2.6vw,30px)',lineHeight:1.5,maxWidth:1040,color:'#c5d8df'}}>RACI can identify who owns a task. Commissioning can define readiness and acceptance. But when one scope hands reality to another, a separate question appears: <b>what must actually be established before the next consequence is allowed to occur?</b></p>
    <div style={{marginTop:28,padding:'clamp(22px,4vw,38px)',borderRadius:20,border:'1px solid rgba(113,242,182,.34)',background:'rgba(2,10,17,.55)',fontSize:'clamp(22px,3.3vw,40px)',fontWeight:1000,lineHeight:1.15}}>Responsibility identifies an owner. <span style={{color:C.green}}>It does not manufacture readiness or execution authority.</span></div>
    <Samantha text="This showroom examines the gap between scopes. RACI remains valuable for defining responsibility and accountability. TA14 asks a different question at the handoff: before the next action becomes real, is the required evidence present, is the applicable authority established, and does standing exist now?"/>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.green}}>01 · THE PROJECT DELIVERY PROBLEM</div>
    <h2 style={{fontSize:'clamp(36px,5.7vw,70px)',lineHeight:.98,letterSpacing:'-.05em',margin:'12px 0 22px'}}>THE FAILURE OFTEN LIVES BETWEEN “DONE” STATES.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10}}>
     {[
      ['01','INSTALLED','Physical work exists. That does not establish completion.'],
      ['02','PROGRAMMED','Logic exists. That does not establish integration or readiness.'],
      ['03','TEST READY','Prerequisites are claimed complete. The claim still needs evidence.'],
      ['04','ACCEPTED','The authorized acceptance path has been satisfied for the defined scope.']
     ].map(([n,t,d])=><article key={n} style={{padding:22,borderRadius:17,border:'1px solid rgba(112,220,255,.14)',background:'rgba(2,10,17,.55)'}}><div style={{fontSize:10,color:C.cyan,fontWeight:950}}>{n}</div><div style={{marginTop:7,fontSize:20,fontWeight:1000}}>{t}</div><p style={{fontSize:14,lineHeight:1.6,color:C.muted}}>{d}</p></article>)}
    </div>
    <div style={{marginTop:22,padding:24,borderRadius:18,border:'1px solid rgba(255,211,111,.28)',background:'rgba(255,211,111,.05)',fontSize:'clamp(22px,3vw,36px)',fontWeight:1000,lineHeight:1.3}}>INSTALLED ≠ COMPLETE · COMPLETE ≠ VERIFIED · VERIFIED ≠ ACCEPTED</div>
    <Samantha text="Section one separates common project states. Installed is not complete. Complete is not verified. Verified is not accepted. Each transition needs its own evidence and applicable decision path. Calling something done cannot make the next state true."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.cyan}}>02 · RACI AND THE CONSEQUENCE BOUNDARY</div>
    <h2 style={{fontSize:'clamp(34px,5vw,64px)',lineHeight:1,letterSpacing:'-.05em',margin:'12px 0 22px'}}>WHO OWNS IT? ≠ MAY IT CROSS?</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(235px,1fr))',gap:10}}>
     {[
      ['R · RESPONSIBLE','Who performs the work?'],
      ['A · ACCOUNTABLE','Who owns the result?'],
      ['C · CONSULTED','Whose input is required?'],
      ['I · INFORMED','Who must know?']
     ].map(([t,d])=><div key={t} style={{padding:22,borderRadius:16,border:'1px solid rgba(112,220,255,.13)',background:'rgba(2,10,17,.52)'}}><div style={{fontSize:18,fontWeight:1000,color:C.cyan}}>{t}</div><p style={{color:C.muted,lineHeight:1.6}}>{d}</p></div>)}
    </div>
    <div style={{marginTop:20,padding:'clamp(24px,4vw,38px)',borderRadius:20,border:'1px solid rgba(113,242,182,.28)',background:'rgba(113,242,182,.04)'}}>
      <div style={{fontSize:11,fontWeight:950,letterSpacing:'.16em',color:C.green}}>TA14 ADDS A DIFFERENT QUESTION</div>
      <div style={{fontSize:'clamp(27px,4vw,48px)',fontWeight:1000,marginTop:10}}>RESPONSIBILITY <span style={{color:C.green}}>│</span> EXECUTION AUTHORITY</div>
      <p style={{color:'#b9ccd5',lineHeight:1.65}}>A person or organization can be responsible for a task without having unlimited authority to create every downstream consequence. Scope, evidence, prerequisites, acceptance criteria, current standing, and applicable authority still govern the boundary.</p>
    </div>
    <Samantha text="RACI answers who is responsible, accountable, consulted, and informed. TA14 does not replace those roles. It examines the separate execution boundary. Being responsible for work does not automatically authorize every downstream consequence that the work could cause."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.green}}>03 · HANDOFF PROOF PATH</div>
    <h2 style={{fontSize:'clamp(34px,5vw,64px)',lineHeight:1,letterSpacing:'-.05em',margin:'12px 0 22px'}}>TASK → DELIVERABLE → READINESS → VERIFICATION → ACCEPTANCE → EXECUTION → OUTCOME</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:8}}>
     {['TASK','DELIVERABLE','READINESS','VERIFICATION','ACCEPTANCE','EXECUTION','OUTCOME'].map((x,i)=><div key={x} style={{padding:18,borderRadius:15,border:'1px solid rgba(112,220,255,.14)',background:i===4?'rgba(113,242,182,.07)':'rgba(2,10,17,.55)',textAlign:'center'}}><div style={{fontSize:10,color:C.cyan,fontWeight:950}}>0{i+1}</div><div style={{marginTop:7,fontSize:13,fontWeight:1000}}>{x}</div></div>)}
    </div>
    <div style={{marginTop:22,padding:24,borderRadius:18,border:'1px solid rgba(255,211,111,.28)',background:'rgba(255,211,111,.05)',fontSize:'clamp(20px,2.8vw,34px)',fontWeight:1000,lineHeight:1.35}}>A handoff is not a sentence in a meeting. <span style={{color:C.gold}}>It is a proposed transition in reality.</span></div>
    <Samantha text="This is the handoff proof path. A task produces a deliverable. Readiness must be established. Verification examines the evidence. Acceptance must occur through the applicable path. Only then can an authorized execution cross the boundary, after which the actual outcome returns to the record."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.cyan}}>04 · WORKED COMMISSIONING EXAMPLE</div>
    <h2 style={{fontSize:'clamp(34px,5vw,64px)',lineHeight:1,letterSpacing:'-.05em',margin:'12px 0 22px'}}>THE AHU IS “READY.” PROVE IT.</h2>
    <p style={{fontSize:18,lineHeight:1.7,color:'#b9ccd5'}}>The mechanical contractor reports installation complete. Controls reports programming complete. Functional testing is scheduled. Before testing or turnover crosses the boundary, examine what actually stands.</p>
    <div style={{display:'grid',gap:10,marginTop:18}}>
     {[
      ['01 · INSTALLATION','Equipment, sensors, actuators, safeties, wiring, access, labeling and required physical work are complete for the declared test scope.'],
      ['02 · CONTROLS','Points, sequences, alarms, safeties and commanded states are mapped to the actual installed system.'],
      ['03 · TAB / PREREQUISITES','Required balancing, flows, pressures, calibration or other prerequisites are established where applicable to the proposed test.'],
      ['04 · EVIDENCE','The claims above are supported by identifiable, current records rather than assumption or verbal status alone.'],
      ['05 · AUTHORITY','The actor initiating testing, overrides, commands or acceptance is authorized for that exact consequence and scope.'],
      ['06 · ACCEPTANCE / OUTCOME','The applicable acceptance criteria are evaluated, exceptions are preserved, and the observed outcome becomes the next record.']
     ].map(([t,d])=><div key={t} style={{display:'grid',gridTemplateColumns:'minmax(150px,210px) 1fr',gap:14,padding:18,borderRadius:15,border:'1px solid rgba(112,220,255,.12)',background:'rgba(2,10,17,.52)'}}><div style={{fontWeight:1000,color:C.cyan}}>{t}</div><div style={{color:'#b9ccd5',lineHeight:1.6}}>{d}</div></div>)}
    </div>
    <Samantha text="The AHU example makes the boundary concrete. Installation and programming may both be complete while test readiness is not. Missing balancing, unverified safeties, stale records, or absent acceptance can block the transition. The question is not whether people worked. The question is whether this exact next consequence is supported now."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.green}}>05 · LIVE HANDOFF LAB</div>
    <h2 style={{fontSize:'clamp(34px,5vw,64px)',lineHeight:1,letterSpacing:'-.05em',margin:'12px 0 22px'}}>CHANGE THE PROJECT STATE. WATCH THE BOUNDARY MOVE.</h2>
    <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{toggle('INSTALLATION COMPLETE',installed,setInstalled)}{toggle('PROGRAMMING COMPLETE',programmed,setProgrammed)}{toggle('TAB / PREREQUISITES',tab,setTab)}{toggle('SAFETIES VERIFIED',safeties,setSafeties)}{toggle('APPLICABLE AUTHORITY',authority,setAuthority)}{toggle('ACCEPTANCE ESTABLISHED',accepted,setAccepted)}</div>
    <div style={{marginTop:22,padding:'clamp(30px,5vw,52px)',borderRadius:24,border:`1px solid ${color}66`,background:`linear-gradient(135deg,${color}10,rgba(2,10,17,.96))`,textAlign:'center'}}><div style={{fontSize:10,fontWeight:950,letterSpacing:'.2em',color:'#8099a5'}}>CURRENT HANDOFF DISPOSITION</div><div style={{fontSize:'clamp(66px,11vw,132px)',fontWeight:1000,lineHeight:.9,letterSpacing:'-.07em',margin:'17px 0',color}}>{result}</div><p style={{maxWidth:860,margin:'0 auto',fontSize:18,lineHeight:1.6,color:'#b9ccd5'}}>{result==='ALLOW'?'The declared prerequisites, authority and acceptance conditions are presently established for this bounded transition. ALLOW permits the transition; it does not compel it.':result==='HOLD'?'A required technical prerequisite is not established. Preserve the current state, cure the deficiency, and re-examine before crossing.':result==='DENY'?'Applicable Authority is absent. Responsibility, access or capability cannot manufacture permission.':'A readiness or acceptance decision remains unresolved. Route the boundary to the applicable accountable or acceptance path.'}</p></div>
    <Samantha text="Use the live handoff lab to change the project state. Missing technical prerequisites produce a hold. Missing authority produces deny. Unresolved readiness or acceptance routes the transition for escalation. When every required condition is established, allow permits the bounded handoff but never forces it."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(34px,6vw,68px)',border:'1px solid rgba(113,242,182,.3)',borderRadius:28,background:'radial-gradient(circle at 76% 0%,rgba(113,242,182,.11),transparent 28%),linear-gradient(145deg,rgba(8,36,48,.96),rgba(3,11,19,.98))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.green}}>06 · THE COMMIT BOUNDARY</div>
    <h2 style={{fontSize:'clamp(40px,6.3vw,78px)',lineHeight:.95,letterSpacing:'-.058em',margin:'14px 0 22px'}}>BEFORE “READY” BECOMES REALITY.</h2>
    <p style={{fontSize:'clamp(19px,2.6vw,30px)',lineHeight:1.55,color:'#c5d8df'}}>At the handoff, the project is no longer asking only who owns the next task. It is asking whether this specific transition has sufficient grounds to cross from claim into consequence.</p>
    <div style={{marginTop:26,padding:24,borderRadius:18,border:'1px solid rgba(113,242,182,.28)',background:'rgba(113,242,182,.05)',fontSize:'clamp(21px,3vw,36px)',fontWeight:1000,lineHeight:1.25}}>Does this proposed consequence have sufficient <span style={{color:C.green}}>Admissible Evidence</span>, <span style={{color:C.cyan}}>Applicable Authority</span>, and <span style={{color:C.purple}}>Established Standing</span> to become reality NOW?</div>
    <div style={{marginTop:24,padding:20,borderRadius:16,border:'1px solid rgba(112,220,255,.15)',background:'rgba(2,10,17,.55)',fontSize:'clamp(18px,2.5vw,29px)',fontWeight:1000}}>RACI → READINESS → HANDOFF → EVIDENCE → AUTHORITY → ACCEPTANCE → EXECUTION → OUTCOME</div>
    <Samantha text="At the commit boundary, ready is not merely a project-management label. It is a proposed transition into consequence. TA14 asks whether admissible evidence, applicable authority, and established standing are sufficient for that exact consequence now."/>
   </section>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,52px)',...card}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:C.cyan}}>07 · WHY THIS MATTERS</div>
    <h2 style={{fontSize:'clamp(34px,5vw,64px)',lineHeight:1,letterSpacing:'-.05em',margin:'12px 0 22px'}}>MAKE THE GAP EXAMINABLE.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:10}}>
     {[
      ['LESS ASSUMPTION','Replace “I thought they were doing that” with a preserved transition record.'],
      ['LESS PREMATURE TESTING','Do not schedule consequence ahead of established prerequisites.'],
      ['CLEARER EXCEPTIONS','A HOLD identifies what is missing without pretending the entire project failed.'],
      ['BETTER ACCOUNTABILITY','Preserve who proposed, verified, accepted, authorized and executed each transition.']
     ].map(([t,d])=><div key={t} style={{padding:22,borderRadius:16,border:'1px solid rgba(112,220,255,.13)',background:'rgba(2,10,17,.52)'}}><div style={{fontSize:18,fontWeight:1000,color:C.green}}>{t}</div><p style={{color:C.muted,lineHeight:1.6}}>{d}</p></div>)}
    </div>
   </section>

   <section style={{marginTop:24,padding:24,borderRadius:18,border:'1px solid rgba(112,220,255,.12)',background:'rgba(2,10,17,.55)',fontSize:12,lineHeight:1.75,color:'#78909b'}}><b style={{color:'#a8bdc7'}}>ORIGIN / ATTRIBUTION / NON-ENDORSEMENT.</b> This independent TA14 technical examination was prompted by a public commissioning discussion by Marcus Myers emphasizing RACI, roles and responsibilities, readiness gates, acceptance criteria, handoffs, and the observation that project gaps often occur between scopes. Marcus Myers did not commission, approve, or endorse this TA14 examination unless separately stated. RACI, commissioning, contractual requirements, professional standards, project specifications, codes, and applicable authority remain distinct and controlling within their proper domains.</section>
   <footer style={{marginTop:28,paddingTop:20,borderTop:'1px solid rgba(112,220,255,.1)',display:'flex',justifyContent:'space-between',gap:14,flexWrap:'wrap',color:'#66818e',fontSize:11}}><div>TA14 AUTHORITY GOVERNANCE INSTITUTION · THE GAP BETWEEN SCOPES</div><div>Responsibility ≠ Readiness ≠ Execution Authority</div></footer>
  </div>
 </main>
}