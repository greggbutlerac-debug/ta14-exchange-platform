'use client';

import Link from 'next/link';
import { useState } from 'react';

type Phase='baseline'|'early'|'correlated'|'commit'|'outcome';

const phaseData:Record<Phase,{title:string;atm:string;mech:string;context:string;status:string}> = {
 baseline:{title:'ESTABLISHED BASELINE',atm:'Occupied atmospheric values remain within the bounded baseline.',mech:'AHU-17 mechanical performance is stable under known operating conditions.',context:'Outdoor and load context is preserved so later comparison is not detached from demand.',status:'RECORDING'},
 early:{title:'EARLY MECHANICAL DRIFT',atm:'The occupied atmosphere has not yet crossed a consequential threshold.',mech:'Vibration, current, runtime, or another attributable mechanical signal begins departing from baseline.',context:'Like-for-like context remains available for comparison.',status:'DRIFT VISIBLE'},
 correlated:{title:'CORRELATED CHRONOLOGY',atm:'Atmospheric behavior now begins departing from its established pattern.',mech:'Mechanical effort and performance have also changed across the same chronology.',context:'AIR preserves what changed first and what changed next. Correlation is not diagnosis.',status:'REVIEW REQUIRED'},
 commit:{title:'CONSEQUENCE BOUNDARY',atm:'The preserved atmospheric record is available for admissibility review.',mech:'Mechanical history supplies operating context without silently becoming a diagnosis.',context:'A proposed intervention must be bound to admissible evidence, applicable authority, and current standing.',status:'HOLD PENDING DETERMINATION'},
 outcome:{title:'POST-INTERVENTION OUTCOME',atm:'AIR continues recording the atmosphere after the authorized intervention.',mech:'Mechanical performance continues in the same chronology.',context:'The record can now show whether the intended environmental outcome actually occurred and establish a new baseline.',status:'OUTCOME RECORDED'}
};

const proof=['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'];
const mechanical=['Vibration','Equipment temperature','Amp draw / electrical','Power + energy','Runtime + cycling','Airflow + ventilation','Static / differential pressure','Filter loading','Refrigeration / hydronic','Control + command state','Faults + alarms','Maintenance events'];
const atmospheric=['Pressure','Radon','CO₂','Particulate matter','VOCs','Enthalpy','Density','Grains moisture / ft³','Humidity ratio','Dew point','Wet bulb','Dry bulb'];

export default function AirChronologyShowroom(){
 const [phase,setPhase]=useState<Phase>('baseline');
 const d=phaseData[phase];
 return <main style={{minHeight:'100vh',padding:'46px 20px 100px',background:'radial-gradient(circle at 82% 2%,rgba(75,215,255,.17),transparent 29%),radial-gradient(circle at 8% 45%,rgba(103,241,184,.09),transparent 30%),linear-gradient(180deg,#02070d,#06111c 50%,#02070d)',color:'#eef7fb',fontFamily:'Inter,system-ui,sans-serif'}}>
  <div style={{maxWidth:1240,margin:'0 auto'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:14,flexWrap:'wrap',paddingBottom:20,borderBottom:'1px solid rgba(113,231,255,.14)'}}>
    <Link href="/environmental-integrity-governance" style={{color:'#9edff0',textDecoration:'none',fontWeight:850}}>← Environmental Integrity Governance</Link>
    <Link href="/registry/ta-14-admissible-execution-architecture/showcase/owner-to-consequence-collaboration" style={{color:'#91a8b7',textDecoration:'none'}}>Owner-to-Consequence →</Link>
   </nav>

   <section style={{marginTop:26,padding:'clamp(36px,6vw,72px)',border:'1px solid rgba(113,231,255,.23)',borderRadius:30,background:'linear-gradient(145deg,rgba(8,37,54,.96),rgba(5,14,24,.98) 58%,rgba(16,42,36,.94))',boxShadow:'0 34px 100px rgba(0,0,0,.42)'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.2em',color:'#78e8ff'}}>TA-14 · ATMOSPHERIC INTEGRITY RECORD · PUBLIC TECHNICAL SHOWROOM</div>
    <h1 style={{fontSize:'clamp(43px,7vw,86px)',lineHeight:.94,letterSpacing:'-.055em',margin:'20px 0 22px'}}>THE BUILDING WAS CHANGING<br/><span style={{color:'#7ff0bd'}}>BEFORE THE CONSEQUENCE ATTACHED.</span></h1>
    <p style={{fontSize:'clamp(18px,2.2vw,26px)',lineHeight:1.5,maxWidth:1020,color:'#b8cad5',margin:0}}>AIR preserves a continuous, append-only atmospheric and mechanical-performance chronology. It does not diagnose, optimize, or control. It preserves what happened, when it happened, and the operating context needed for qualified review.</p>
    <div style={{marginTop:28,padding:'18px 20px',borderLeft:'3px solid #7ff0bd',background:'rgba(127,240,189,.045)',fontSize:'clamp(17px,2vw,23px)',fontWeight:900}}>ATMOSPHERIC REALITY + MECHANICAL PERFORMANCE → ONE SYNCHRONIZED AIR CHRONOLOGY</div>
   </section>

   <section style={{marginTop:24,padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(113,231,255,.18)',borderRadius:26,background:'rgba(5,18,27,.9)'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:'#78e8ff'}}>THE TWO EVIDENCE DOMAINS</div>
    <h2 style={{fontSize:'clamp(30px,4.8vw,54px)',letterSpacing:'-.04em',margin:'10px 0 22px'}}>Outcome and operating history stay synchronized.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:14}}>
     <article style={{padding:24,border:'1px solid rgba(113,231,255,.2)',borderRadius:18,background:'rgba(5,34,48,.42)'}}><div style={{fontSize:11,fontWeight:950,letterSpacing:'.14em',color:'#78e8ff'}}>ATMOSPHERIC REALITY</div><p style={{color:'#b8cad5',lineHeight:1.65}}>What occupants actually experienced in the breathable environment.</p><div style={{display:'flex',gap:7,flexWrap:'wrap'}}>{atmospheric.map(x=><span key={x} style={{padding:'7px 9px',border:'1px solid rgba(113,231,255,.13)',borderRadius:999,fontSize:11,color:'#bcd7e1'}}>{x}</span>)}</div></article>
     <article style={{padding:24,border:'1px solid rgba(127,240,189,.2)',borderRadius:18,background:'rgba(13,45,37,.38)'}}><div style={{fontSize:11,fontWeight:950,letterSpacing:'.14em',color:'#7ff0bd'}}>MECHANICAL PERFORMANCE</div><p style={{color:'#b8cad5',lineHeight:1.65}}>How the systems responsible for producing that environment performed over the same chronology.</p><div style={{display:'flex',gap:7,flexWrap:'wrap'}}>{mechanical.map(x=><span key={x} style={{padding:'7px 9px',border:'1px solid rgba(127,240,189,.13)',borderRadius:999,fontSize:11,color:'#c4ddd3'}}>{x}</span>)}</div></article>
    </div>
    <div style={{marginTop:14,padding:18,border:'1px solid rgba(242,204,104,.2)',borderRadius:15,background:'rgba(242,204,104,.035)',color:'#d8cfb3',lineHeight:1.65}}><b style={{color:'#f2cc68'}}>OUTDOOR + LOAD CONTEXT</b> · Outdoor temperature, humidity, enthalpy, weather, occupancy, schedules and other available load variables remain visible so changing demand is not silently confused with equipment degradation.</div>
   </section>

   <section style={{marginTop:24,padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(127,240,189,.2)',borderRadius:26,background:'linear-gradient(135deg,rgba(16,68,54,.18),rgba(5,17,28,.94))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:'#7ff0bd'}}>RUN THE CHRONOLOGY · AHU-17</div>
    <h2 style={{fontSize:'clamp(30px,4.8vw,54px)',letterSpacing:'-.04em',margin:'10px 0 8px'}}>What changed first?</h2>
    <p style={{color:'#b8cad5',fontSize:17,lineHeight:1.65,maxWidth:900}}>Move through the record. AIR preserves the sequence; it does not convert a correlated signal into a diagnosis or automatic permission to act.</p>
    <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'22px 0'}}>{(['baseline','early','correlated','commit','outcome'] as Phase[]).map((p,i)=><button key={p} onClick={()=>setPhase(p)} style={{cursor:'pointer',padding:'11px 14px',borderRadius:999,border:phase===p?'1px solid #7ff0bd':'1px solid rgba(113,231,255,.18)',background:phase===p?'rgba(127,240,189,.09)':'rgba(2,10,17,.5)',color:phase===p?'#9affcf':'#a8bec9',fontWeight:900}}>{String(i+1).padStart(2,'0')} · {p.toUpperCase()}</button>)}</div>
    <div style={{padding:'clamp(22px,4vw,34px)',border:'1px solid rgba(127,240,189,.24)',borderRadius:20,background:'rgba(1,9,14,.7)'}}>
     <div style={{fontSize:11,fontWeight:950,letterSpacing:'.14em',color:'#7ff0bd'}}>{d.status}</div><h3 style={{fontSize:'clamp(25px,4vw,42px)',margin:'8px 0 20px'}}>{d.title}</h3>
     <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:10}}>{[['ATMOSPHERE',d.atm],['MECHANICAL',d.mech],['CONTEXT / GOVERNANCE',d.context]].map(([a,b])=><div key={a} style={{padding:18,border:'1px solid rgba(113,231,255,.12)',borderRadius:14,background:'rgba(6,23,33,.55)'}}><b style={{fontSize:10,letterSpacing:'.12em',color:'#78e8ff'}}>{a}</b><p style={{margin:'8px 0 0',lineHeight:1.55,color:'#bdcdd5'}}>{b}</p></div>)}</div>
    </div>
    <div style={{marginTop:18,fontSize:'clamp(21px,3vw,34px)',fontWeight:950,lineHeight:1.25}}>WHAT CHANGED FIRST? <span style={{color:'#7ff0bd'}}>WHAT CHANGED NEXT?</span><br/>HOW LONG DID MEANINGFUL INTERVENTION REMAIN AVAILABLE BEFORE ENVIRONMENTAL CONSEQUENCE ATTACHED?</div>
   </section>

   <section style={{marginTop:24,padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(113,231,255,.18)',borderRadius:26,background:'rgba(5,18,27,.9)'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:'#78e8ff'}}>THE TA-14 PROOF CHAIN</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginTop:18}}>{proof.map((x,i)=><div key={x} style={{padding:'18px 10px',textAlign:'center',border:'1px solid rgba(113,231,255,.14)',borderRadius:14,background:'rgba(2,10,17,.5)'}}><div style={{fontSize:10,color:'#536d7b',fontWeight:950}}>{String(i+1).padStart(2,'0')}</div><b style={{fontSize:12,letterSpacing:'.06em'}}>{x}</b></div>)}</div>
    <p style={{margin:'18px 0 0',color:'#b8cad5',lineHeight:1.7}}>AIR operates inside this chain. It supplies the continuity-preserving atmospheric record layer; the record does not automatically prove safety, causation, compliance, liability, diagnosis, authority, or standing.</p>
   </section>

   <section style={{marginTop:24,padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(242,204,104,.22)',borderRadius:26,background:'rgba(55,42,12,.14)'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:'#f2cc68'}}>BOUNDARIES THAT MUST NOT COLLAPSE</div>
    <div style={{fontSize:'clamp(22px,3.5vw,38px)',fontWeight:950,lineHeight:1.45,marginTop:14}}>DRIFT ≠ FAILURE · CORRELATION ≠ CAUSATION · DETECTION ≠ DIAGNOSIS<br/><span style={{color:'#7ff0bd'}}>EVIDENCE ≠ AUTHORITY · PRIOR ALLOW ≠ ALLOW NOW</span></div>
   </section>

   <section style={{marginTop:24,padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(127,240,189,.2)',borderRadius:26,background:'rgba(8,31,27,.45)'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:'#7ff0bd'}}>APPEND-ONLY · BEFORE AND AFTER</div>
    <h2 style={{fontSize:'clamp(30px,4.8vw,54px)',letterSpacing:'-.04em',margin:'10px 0'}}>The intervention does not end the record.</h2>
    <p style={{fontSize:17,lineHeight:1.7,color:'#c2d2cc',maxWidth:980}}>Original capture remains preserved. Later interpretations, corrections, exclusions, interventions and governance conclusions are appended rather than silently rewriting history. After execution, the same chronology continues so the institution can compare the preserved baseline with what actually happened next.</p>
   </section>
  </div>
 </main>;
}
