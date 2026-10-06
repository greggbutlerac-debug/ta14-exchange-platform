'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';

type State='SUPPORTED'|'UNESTABLISHED';
type Result='ALLOW'|'HOLD'|'DENY'|'ESCALATE';

const stages=[
 ['01','CLAIM','What exactly is being claimed?','Installed, connected, interoperable, accurate, effective, safe, scalable and authorized are different propositions. Freeze the proposition before examining the proof.'],
 ['02','EVIDENCE','Proof of what?','A pilot, commissioning record, sensor observation, model output, operator verification or test result can support a proposition. Evidence has scope; it does not become universal permission.'],
 ['03','SCOPE','Where does the proof stop?','Name the asset, operating state, population, time window, conditions and consequence actually supported. Do not let a bounded result silently expand.'],
 ['04','REALITY','Does the record still represent reality?','Verified once does not mean established now. Conditions change. Continuity must survive between the record and the moment of proposed execution.'],
 ['05','CROSSING','The crossing is not the permission.','Identity, information, recommendations, authority context and validly derived authority may cross systems. The crossing alone does not establish permission for this consequence.'],
 ['06','AUTHORITY','Locally established ≠ locally originated.','Authority may originate elsewhere and derived authority may traverse multiple entities. At execution, establish that the authority reaching the boundary is current, applicable, sufficient and in scope.'],
 ['07','DETERMINATION','Governance must terminate operationally.','ALLOW. HOLD. DENY. ESCALATE. The examination must produce a bounded disposition rather than vague confidence.'],
 ['08','CONSEQUENCE','Execution creates new reality.','Preserve what was executed, what outcome became real, and the new baseline. Proof supports propositions. It does not authorize itself.']
] as const;

const stageImages=[
 '/wide_infographic_style_educational_slide_diagram_w.png',
 '/a_wide_clean_infographic_educational_slide_style.png',
 '/wide_infographic_educational_presentation_image_wi.png',
 '/wide_infographic_poster_style_image_with_graphic_p.png',
 '/wide_infographic_poster_with_clean_corporate_tech.png',
 '/wide_infographic_poster_with_clean_corporate_educa.png',
 '/wide_infographic_poster_clean_educational_infogra.png',
 '/wide_infographic_poster_with_clean_glossy_educat.png'
] as const;

const samantha=[
 'Freeze the proposition before evaluating the proof. Installed, connected, accurate, effective, safe, scalable and authorized are different claims. A claim begins the examination; it is not yet proof, permission, or consequence.',
 'Ask what the evidence actually establishes. Measurements, records, tests and verified observations may support a proposition, but evidence has scope. Preserve what was measured, how it was established, and what the record does not prove.',
 'Define where the proof stops. Identify the asset, location, operating state, time window, conditions and consequence actually supported. A bounded result must not silently become a universal claim.',
 'Return to physical reality. Verified once does not mean established now. Conditions change, sensors drift, overrides occur and equipment states move. Current consequence requires sufficient continuity between the record and reality now.',
 'The crossing is not the permission. Identity, context, semantics, evidence and validly derived authority may cross independently governed systems. The receiving execution boundary still has to establish whether this specific consequence is permitted.',
 'Authority may originate elsewhere and derived authority may traverse multiple entities. The receiver does not manufacture new authority. It establishes whether the authority reaching execution is valid, current, applicable, sufficient and within scope. Locally established does not mean locally originated.',
 'Governance must terminate in an operational disposition. ALLOW, HOLD, DENY or ESCALATE. The purpose is not vague confidence. It is an inspectable determination before a consequence becomes reality.',
 'Execution creates outcome, and outcome creates new reality. Preserve what was executed, verify what actually happened, compare it with the baseline, record the result and establish the new reality for the next consequence.'
] as const;

function Samantha({text}:{text:string}){
 const speak=()=>{ if(typeof window==='undefined'||!window.speechSynthesis)return; window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); const voices=window.speechSynthesis.getVoices(); u.voice=voices.find(v=>v.name==='Samantha')||voices.find(v=>v.lang==='en-US')||null; u.rate=.84; window.speechSynthesis.speak(u); };
 const pause=()=>{ if(typeof window!=='undefined') window.speechSynthesis?.pause(); };
 const resume=()=>{ if(typeof window!=='undefined') window.speechSynthesis?.resume(); };
 const stop=()=>{ if(typeof window!=='undefined') window.speechSynthesis?.cancel(); };
 const b={padding:'9px 12px',borderRadius:9,border:'1px solid rgba(111,220,255,.28)',background:'rgba(8,37,47,.88)',color:'#eef8fb',fontWeight:900,cursor:'pointer'} as const;
 return <div style={{marginTop:15,padding:17,border:'1px solid rgba(113,242,182,.22)',borderRadius:14,background:'rgba(2,10,17,.65)'}}>
  <div style={{fontSize:10,fontWeight:950,letterSpacing:'.16em',color:'#71f2b6'}}>SAMANTHA · IMAGE NARRATION</div>
  <div style={{display:'flex',gap:7,flexWrap:'wrap',marginTop:11}}><button onClick={speak} style={b}>PLAY</button><button onClick={pause} style={b}>PAUSE</button><button onClick={resume} style={b}>RESUME</button><button onClick={stop} style={b}>STOP</button></div>
  <p style={{margin:'13px 0 0',fontSize:15,lineHeight:1.7,color:'#b9ccd5'}}>{text}</p>
 </div>;
}

export default function ProofAuthorityShowroom(){
 const [evidence,setEvidence]=useState<State>('SUPPORTED');
 const [continuity,setContinuity]=useState<State>('SUPPORTED');
 const [authority,setAuthority]=useState<State>('SUPPORTED');
 const [standing,setStanding]=useState<State>('SUPPORTED');
 const [scope,setScope]=useState<State>('SUPPORTED');
 const result:Result=useMemo(()=>scope==='UNESTABLISHED'?'DENY':evidence==='UNESTABLISHED'||continuity==='UNESTABLISHED'||authority==='UNESTABLISHED'?'HOLD':standing==='UNESTABLISHED'?'ESCALATE':'ALLOW',[evidence,continuity,authority,standing,scope]);
 const accent=result==='ALLOW'?'#71f2b6':result==='HOLD'?'#ffd36f':result==='DENY'?'#ff7885':'#b9a8ff';
 const toggle=(label:string,value:State,set:(x:State)=>void)=><button onClick={()=>set(value==='SUPPORTED'?'UNESTABLISHED':'SUPPORTED')} style={{padding:'11px 14px',borderRadius:999,border:'1px solid rgba(112,220,255,.25)',background:value==='SUPPORTED'?'rgba(113,242,182,.10)':'rgba(255,211,111,.08)',color:value==='SUPPORTED'?'#dffff0':'#ffe8aa',fontWeight:900,cursor:'pointer'}}>{label} · {value}</button>;
 return <main style={{minHeight:'100vh',padding:'38px 18px 100px',background:'radial-gradient(circle at 82% 0%,rgba(61,190,255,.16),transparent 27%),linear-gradient(180deg,#02060b,#06101a 48%,#02060b)',color:'#eef8fb',fontFamily:'Inter,system-ui,sans-serif'}}>
  <div style={{maxWidth:1240,margin:'0 auto'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',paddingBottom:18,borderBottom:'1px solid rgba(111,220,255,.13)'}}><Link href="/showrooms/proof-over-promise-chicago" style={{color:'#9de8f7',textDecoration:'none',fontWeight:900}}>← PROOF OVER PROMISE · CHICAGO</Link><span style={{fontSize:10,fontWeight:950,letterSpacing:'.16em',color:'#7896a3'}}>INDEPENDENT TA14 TECHNICAL EXAMINATION</span></nav>
   <header style={{marginTop:25,padding:'clamp(38px,7vw,78px)',border:'1px solid rgba(111,220,255,.24)',borderRadius:30,background:'linear-gradient(145deg,rgba(7,38,56,.96),rgba(3,11,19,.99))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.2em',color:'#70dcff'}}>PROOF → AUTHORITY → CONSEQUENCE</div>
    <h1 style={{fontSize:'clamp(50px,8vw,102px)',lineHeight:.9,letterSpacing:'-.065em',margin:'15px 0 24px'}}>WHAT DOES PROOF<br/><span style={{color:'#71f2b6'}}>ACTUALLY AUTHORIZE?</span></h1>
    <p style={{maxWidth:950,fontSize:'clamp(20px,2.5vw,29px)',lineHeight:1.5,color:'#bfd0d7'}}>A system can be technically correct. The proof can be real. The connection can work. None of those facts, standing alone, establish permission for a proposed consequence to become physical reality.</p>
    <div style={{marginTop:28,padding:24,borderRadius:18,border:'1px solid rgba(113,242,182,.35)',background:'rgba(113,242,182,.05)',fontSize:'clamp(22px,3vw,38px)',fontWeight:1000,lineHeight:1.15}}>PROOF DOES NOT AUTHORIZE ITSELF.</div>
   </header>

   <section style={{marginTop:24,padding:'clamp(28px,5vw,48px)',border:'1px solid rgba(111,220,255,.17)',borderRadius:24,background:'rgba(3,13,22,.82)'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:'#70dcff'}}>ONE CONTINUOUS CASE</div>
    <h2 style={{fontSize:'clamp(32px,5vw,58px)',letterSpacing:'-.045em',margin:'12px 0'}}>Autonomous HVAC optimization.</h2>
    <p style={{fontSize:17,lineHeight:1.7,color:'#b7c9d1',maxWidth:1000}}>An optimization layer has a verified model, current telemetry, a demonstrated energy-saving sequence and a successful pilot. It proposes changing discharge-air temperature and static-pressure targets across an occupied building. The question is not whether the technology is impressive. The question is whether this specific consequence has earned execution now.</p>
   </section>

   {stages.map(([n,k,title,copy])=><section key={n} style={{marginTop:18,padding:'clamp(25px,4vw,42px)',border:'1px solid rgba(111,220,255,.15)',borderRadius:22,background:'linear-gradient(145deg,rgba(5,24,37,.82),rgba(2,9,15,.97))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:n==='06'?'#71f2b6':'#70dcff'}}>{n} · {k}</div>
    <h2 style={{fontSize:'clamp(30px,4.4vw,54px)',lineHeight:1,letterSpacing:'-.045em',margin:'11px 0 15px'}}>{title}</h2>
    <p style={{fontSize:17,lineHeight:1.7,color:'#b8cad2',maxWidth:1000,margin:0}}>{copy}</p>
    <Image src={stageImages[Number(n)-1]} alt={title} width={1536} height={1024} sizes="(max-width: 1240px) 100vw, 1240px" style={{display:'block',width:'100%',height:'auto',marginTop:18,borderRadius:16,border:'1px solid rgba(111,220,255,.23)',boxShadow:'0 24px 70px rgba(0,0,0,.42)'}}/>
    <Samantha text={samantha[Number(n)-1]}/>
    {n==='06'&&<div style={{marginTop:22,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:9}}>{['ORIGINATING AUTHORITY','DELEGATION','DERIVED AUTHORITY','RECEIVING ENTITY','EXECUTION BOUNDARY'].map((x,i)=><div key={x} style={{padding:16,borderRadius:14,border:'1px solid rgba(113,242,182,.2)',background:'rgba(113,242,182,.035)',fontWeight:950,fontSize:12}}>{String(i+1).padStart(2,'0')} · {x}</div>)}</div>}
   </section>)}

   <section style={{marginTop:24,padding:'clamp(30px,5vw,55px)',border:'1px solid rgba(113,242,182,.25)',borderRadius:25,background:'rgba(4,18,25,.94)'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:'#71f2b6'}}>RUN THE BOUNDARY</div>
    <h2 style={{fontSize:'clamp(35px,5vw,64px)',letterSpacing:'-.05em',lineHeight:1,margin:'12px 0 18px'}}>Change the conditions. Watch the disposition move.</h2>
    <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>{toggle('EVIDENCE',evidence,setEvidence)}{toggle('CONTINUITY',continuity,setContinuity)}{toggle('AUTHORITY',authority,setAuthority)}{toggle('STANDING',standing,setStanding)}{toggle('SCOPE',scope,setScope)}</div>
    <div style={{marginTop:25,padding:'clamp(30px,5vw,55px)',borderRadius:22,border:'1px solid '+accent+'66',background:'rgba(2,9,15,.7)',textAlign:'center'}}><div style={{fontSize:10,fontWeight:950,letterSpacing:'.18em',color:'#829ba7'}}>DETERMINATION</div><div style={{fontSize:'clamp(70px,12vw,140px)',fontWeight:1000,lineHeight:.9,letterSpacing:'-.07em',color:accent,margin:'18px 0'}}>{result}</div></div>
   </section>

   <section style={{marginTop:24,padding:'clamp(30px,5vw,52px)',border:'1px solid rgba(112,220,255,.28)',borderRadius:24,background:'linear-gradient(145deg,rgba(5,28,42,.96),rgba(3,11,19,.98))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:'#70dcff'}}>PUBLIC TECHNICAL REFERENCE · v1.0</div>
    <h2 style={{fontSize:'clamp(32px,5vw,58px)',letterSpacing:'-.045em',lineHeight:1,margin:'12px 0 16px'}}>Take the examination with you.</h2>
    <p style={{fontSize:17,lineHeight:1.7,color:'#b8cad2',maxWidth:900}}>The 12-page independent technical reference preserves the full consequence examination: claim, evidence, scope, reality, crossing, authority, determination, consequence, and the governing question.</p>
    <a href="/TA14_What_Does_Proof_Actually_Authorize_Technical_Reference_v1_under25MB.pdf" download style={{display:'inline-block',marginTop:20,padding:'15px 19px',borderRadius:11,border:'1px solid rgba(113,242,182,.42)',background:'rgba(113,242,182,.08)',color:'#dffff0',textDecoration:'none',fontWeight:950}}>DOWNLOAD TECHNICAL REFERENCE — PDF →</a>
   </section>

   <section style={{marginTop:24,padding:'clamp(34px,6vw,68px)',border:'1px solid rgba(113,242,182,.34)',borderRadius:28,background:'linear-gradient(145deg,rgba(8,36,48,.96),rgba(3,11,19,.98))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#71f2b6'}}>THE GOVERNING QUESTION</div>
    <h2 style={{fontSize:'clamp(31px,5vw,62px)',lineHeight:1.05,letterSpacing:'-.045em',margin:'15px 0'}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</h2>
    <p style={{fontSize:20,lineHeight:1.55,color:'#c1d2d9'}}>Bring the proof. Name the proposed consequence. Walk the boundary.</p>
    <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:24}}><Link href="/showrooms/proof-over-promise-chicago" style={{padding:'13px 17px',borderRadius:11,border:'1px solid rgba(111,220,255,.27)',color:'#b9f2ff',textDecoration:'none',fontWeight:950}}>PROOF OVER PROMISE →</Link><Link href="/registry/ta-14-admissible-execution-architecture/showcase/governed-connection-profile" style={{padding:'13px 17px',borderRadius:11,border:'1px solid rgba(111,220,255,.27)',color:'#b9f2ff',textDecoration:'none',fontWeight:950}}>THE GOVERNED CROSSING →</Link></div>
   </section>
   <footer style={{marginTop:28,paddingTop:20,borderTop:'1px solid rgba(111,220,255,.1)',color:'#6f8995',fontSize:11,lineHeight:1.6}}>TA14 Authority Governance Institution · Independent technical examination · No endorsement, adoption, certification, or institutional approval implied.</footer>
  </div>
 </main>
}
