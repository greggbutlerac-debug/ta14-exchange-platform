'use client';

import Link from 'next/link';
import {useState} from 'react';

type Scene={title:string;eyebrow:string;voice:string;lesson:string;accent:string};
const scenes:Scene[]=[
  {title:'The classroom alert',eyebrow:'01 / THE CLASSROOM ALERT',voice:'At fictional Riverdale Elementary, classroom carbon dioxide reaches 1,850 parts per million. Meanwhile, wildfire smoke moves into the region. Two environmental concerns now require investigation. Neither a sensor reading nor an alarm can decide which physical intervention is justified.',lesson:'A measurement identifies a condition; it does not authorize an intervention.',accent:'#7dd3fc'},
  {title:'The wider environment',eyebrow:'02 / AEGIS ASSESSES CONTEXT',voice:'AEGIS examines regional wildfire information, indoor carbon dioxide, fine particles, and the vulnerability of the children. The illustrated regional air-quality index is context, not verified local outdoor-air evidence for a damper command.',lesson:'Indoor and outdoor consequences must be assessed together. Regional AQI cannot substitute for the local evidence needed for a specific action.',accent:'#93c5fd'},
  {title:'Intelligence proposes',eyebrow:'03 / PROMPTOR ANALYZES',voice:'PROMPTOR is trying to help. He recommends increasing ventilation and using filtration, based on the information he has. But his display shows atmospheric carbon dioxide at 431 parts per million. That is not the classroom reading of 1,850 parts per million, and it cannot independently authorize a classroom damper change.',lesson:'A helpful recommendation is not execution authority. Scene 3 is the intentionally retained illustration; its atmospheric reading must not be confused with indoor classroom CO₂.',accent:'#ffcf71'},
  {title:'Joint reassessment',eyebrow:'04 / INTELLIGENCE AND GOVERNANCE COOPERATE',voice:'When the larger environmental context becomes clear, PROMPTOR and AEGIS agree to reassess the proposed ventilation change through TA-14 AuthorityGate before any command can reach the equipment. Neither character is an adversary. They share responsibility for protecting the children.',lesson:'A recommendation is not authorization. Cooperation improves the decision without bypassing its execution boundary.',accent:'#c4b5fd'},
  {title:'The execution boundary',eyebrow:'05 / HOLD THE ORIGINAL COMMAND',voice:'The proposed increase in outdoor-air intake reaches the execution boundary. Outdoor smoke evidence for the action is incomplete, combined consequences remain unresolved, and applicable authority and standing must be established. The gate returns HOLD. That particular command is not executed.',lesson:'Admissible Evidence, Applicable Authority, and Established Standing must be satisfied for the exact action at execution time. The illustration’s green checks are not proof that those conditions passed. HOLD is not a declaration of occupant safety.',accent:'#fca5a5'},
  {title:'A cooperative response',eyebrow:'06 / ASSESS PROTECTIVE OPTIONS',voice:'PROMPTOR and AEGIS cooperate on next steps. Qualified school personnel must assess ventilation, filtration, monitoring, and protective procedures. Any new physical change is a distinct action requiring its own evidence and authorization. The team does not treat the first HOLD as an instruction to reduce outdoor air automatically.',lesson:'The action-plan checkmarks in the artwork are illustrative, not verified execution records. Reduced outdoor-air intake is not universally safe.',accent:'#86efac'},
  {title:'Examining the outcome',eyebrow:'07 / VERIFY THE WHOLE ENVIRONMENT',voice:'The illustration depicts a later reduction in classroom carbon dioxide from 1,850 to 1,120 parts per million. That imagined trend is not proof of its cause. Ordinary particle filtration does not remove carbon dioxide. Occupancy, outdoor-air exchange, particle exposure, instrument validity, and timing all matter.',lesson:'An improved number is not proof of comprehensive safety. Atmospheric Integrity Records require attributable measurements and verification of the full environmental consequence.',accent:'#67e8f9'},
  {title:'Renewed authorization',eyebrow:'08 / A DIFFERENT ACTION MAY BE ALLOWED',voice:'A separately assessed protective plan may receive ALLOW if admissible evidence, applicable authority, and established standing are demonstrated at execution time. This is not a reversal of the original HOLD without evidence. The scenario depicts what renewed justification could make possible.',lesson:'Each proposed consequence needs its own authorization. The displayed ALLOW is conditional and illustrative, not documented proof that a real school met every requirement.',accent:'#a7f3d0'},
  {title:'Physical verification',eyebrow:'09 / TEST THE EQUIPMENT AND THE OUTCOME',voice:'In the mechanical room, the team reviews the air-handling unit and the purported execution record. Authorized school personnel would need to establish actual equipment response, airflow, indoor carbon dioxide, smoke exposure, and other relevant outcomes before accepting the result.',lesson:'Authorization, execution, and outcome verification are different events. Stable airflow and lower CO₂ alone do not certify indoor-air safety.',accent:'#f9c997'},
  {title:'Together for the children',eyebrow:'10 / A SHARED COMMITMENT',voice:'PROMPTOR and AEGIS stand alongside the children with a shared commitment to better decisions. Intelligence can identify possibilities. Governance establishes which actions are justified. Their cooperation illustrates the goal, not a measured safety certification. Intelligence and governance, together for the children.',lesson:'The final illustration is an aspirational fictional ending. A claim that the air is clean would require measured, attributable evidence.',accent:'#fde68a'}
];
const decisions=['ALLOW','HOLD','DENY','ESCALATE'] as const;
const pdf='/TA14_Consequence_Wars_Episode_2_Illustrated_Edition.pdf';

export default function ConsequenceWarsEpisode2(){
  const [answer,setAnswer]=useState<string|null>(null);
  const [speaking,setSpeaking]=useState<number|null>(null);
  function stop(){
    if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();
    setSpeaking(null);
  }
  function narrate(index:number){
    if(typeof window==='undefined'||!('speechSynthesis' in window))return;
    if(speaking===index){stop();return;}
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(scenes[index].voice+' '+scenes[index].lesson);
    utterance.lang='en-US';
    utterance.rate=.9;
    utterance.onend=()=>setSpeaking(null);
    utterance.onerror=()=>setSpeaking(null);
    setSpeaking(index);
    window.speechSynthesis.speak(utterance);
  }
  return <main style={{background:'radial-gradient(ellipse at 80% 0%,#30201a,#0b1428 42%,#040913 100%)',minHeight:'100vh',color:'#f4f7ff',fontFamily:'Arial,sans-serif'}}>
    <div style={{maxWidth:1160,margin:'auto',padding:'26px 18px 100px'}}>
      <nav style={{display:'flex',flexWrap:'wrap',gap:20,fontSize:12,letterSpacing:1.2,fontWeight:800}}>
        <Link href="/comics" style={{color:'#90dafa'}}>← COMICS LIBRARY</Link>
        <Link href="/showrooms/the-consequence-wars" style={{color:'#90dafa'}}>EPISODE 1</Link>
        <Link href="/showrooms" style={{color:'#90dafa'}}>ALL SHOWROOMS</Link>
      </nav>
      <header style={{padding:'65px 0 40px'}}>
        <p style={{color:'#ffd38b',fontSize:12,letterSpacing:2.4,fontWeight:900}}>TA-14 ORIGINAL GRAPHIC STORIES · SEASON ONE · EPISODE 02</p>
        <h1 style={{fontSize:'clamp(40px,7.5vw,94px)',lineHeight:1.02,letterSpacing:-2,margin:'20px 0',fontWeight:900}}>THE AIR THAT<br/><span style={{color:'#ffb36b'}}>BETRAYED THEM</span></h1>
        <p style={{fontSize:'clamp(18px,2.4vw,25px)',maxWidth:870,lineHeight:1.5,color:'#d3deec'}}>A school. A wildfire. Two environmental concerns. One shared responsibility.</p>
        <p style={{maxWidth:880,color:'#b8c9de',lineHeight:1.7}}>PROMPTOR and AEGIS work together. The original unsupported damper command receives HOLD. A different intervention can proceed only through renewed evidence, authority, standing and verification.</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:12,margin:'28px 0'}}>
          <a href="#scene-01" style={{background:'#ffcc79',color:'#091529',fontWeight:900,padding:'14px 22px',borderRadius:9,textDecoration:'none'}}>READ ALL TEN SCENES ↓</a>
          <a href={pdf} target="_blank" rel="noopener noreferrer" style={{border:'1px solid #66839d',color:'#e9f5ff',fontWeight:800,padding:'14px 22px',borderRadius:9,textDecoration:'none'}}>OPEN ILLUSTRATED PDF ↗</a>
        </div>
        <p style={{fontSize:13,color:'#a3b4cb',lineHeight:1.65}}>Fictional educational simulation. All readings, characters, commands and outcomes are illustrative. Artwork labels are not field-validated evidence or occupant-safety certification. Editorial explanations below clarify where the pictures simplify or contradict execution logic.</p>
      </header>
      <div style={{display:'flex',flexDirection:'column',gap:42}}>
        {scenes.map((scene,index)=>{
          const file='/scene-'+String(index+1).padStart(2,'0')+'.jpg';
          return <section id={'scene-'+String(index+1).padStart(2,'0')} key={index} aria-label={'Scene '+(index+1)+': '+scene.title} style={{background:'#0b172a',border:'1px solid #344e6b',borderRadius:18,overflow:'hidden',boxShadow:'0 16px 55px #0007'}}>
            <div style={{background:'linear-gradient(100deg,#0e213b,#1a2035)',padding:'18px 24px',display:'flex',gap:10,justifyContent:'space-between',flexWrap:'wrap',alignItems:'center'}}>
              <strong style={{fontSize:12,letterSpacing:1.8,color:scene.accent}}>{scene.eyebrow}</strong><span style={{color:'#b9c9dc',fontSize:13}}>SCENE {String(index+1).padStart(2,'0')} / 10</span>
            </div>
            <img src={file} alt={'Episode 2 illustrated scene '+(index+1)+': '+scene.title} loading={index===0?'eager':'lazy'} style={{display:'block',width:'100%',height:'auto'}}/>
            <div style={{padding:'clamp(22px,4vw,42px)'}}>
              <h2 style={{fontSize:'clamp(27px,4vw,42px)',margin:'0 0 18px',color:'#fff'}}>{scene.title}</h2>
              <p style={{fontSize:'clamp(16px,1.8vw,19px)',lineHeight:1.75,color:'#e2eaf5'}}>{scene.voice}</p>
              <div style={{borderLeft:'4px solid '+scene.accent,padding:'6px 0 6px 18px',margin:'22px 0',color:'#c9d8e8',lineHeight:1.65}}>
                <strong style={{color:scene.accent}}>WHAT WE JUST LEARNED</strong><p style={{margin:'8px 0 0'}}>{scene.lesson}</p>
              </div>
              <button onClick={()=>narrate(index)} style={{background:'#213a56',border:'1px solid #6c8bab',borderRadius:9,padding:'11px 18px',color:'#fff',fontWeight:800,cursor:'pointer'}}>{speaking===index?'■ STOP NARRATION':'▶ LISTEN TO THIS SCENE'}</button>
            </div>
          </section>;
        })}
      </div>
      <section style={{marginTop:55,background:'#101f36',border:'1px solid #49617f',borderRadius:18,padding:'clamp(22px,4vw,42px)'}}>
        <p style={{fontSize:12,letterSpacing:2,color:'#ffcc79',fontWeight:900}}>THE EXECUTION CHALLENGE</p>
        <h2 style={{fontSize:'clamp(24px,3.6vw,38px)'}}>Classroom CO₂ is elevated, but the proposed damper increase lacks sufficient outdoor-smoke evidence. What happens to that original command?</h2>
        <div style={{display:'flex',flexWrap:'wrap',gap:12,margin:'20px 0'}}>
          {decisions.map(d=><button key={d} onClick={()=>setAnswer(d)} style={{padding:'14px 24px',border:'1px solid '+(answer===d?'#ffe0a3':'#526b8b'),borderRadius:9,color:'#fff',background:answer===d?'#4b3b29':'#23364d',fontWeight:900,cursor:'pointer'}}>{d}</button>)}
        </div>
        {answer&&<div role="status" style={{padding:20,borderRadius:12,background:answer==='HOLD'?'#173d35':'#432c30',lineHeight:1.7}}>
          <strong>{answer==='HOLD'?'CORRECT — HOLD THE ORIGINAL DAMPPER CHANGE'.replace('DAMPPER','DAMPER'):'NOT FOR THIS SPECIFIC COMMAND'}</strong>
          <p>The original increase must not execute without sufficient evidence, applicable authority and established standing. Qualified personnel should assess protective options. A later, separately justified action may receive its own decision; the initial HOLD does not automatically become ALLOW.</p>
        </div>}
      </section>
      <footer style={{marginTop:40,lineHeight:1.7,color:'#b6c8d9'}}>
        <h2 style={{color:'#fff'}}>Intelligence and governance — together for the children.</h2>
        <p>Atmospheric Integrity Records (AIR) examine measurement provenance and continuity. Environmental Integrity Governance (EIG) examines combined consequences. Admissible Execution Architecture (AEA), implemented through TA-14 AuthorityGate, evaluates Admissible Evidence (AE), Applicable Authority (AA), and Established Standing (ES) at execution time.</p>
        <p><a href={pdf} target="_blank" rel="noopener noreferrer" style={{color:'#ffcc79',fontWeight:800}}>Read or download the 11-page illustrated PDF ↗</a></p>
        <p style={{fontSize:13}}>This comic is fiction for education, not operational guidance. No depicted value, result or safety declaration is independently verified.</p>
      </footer>
    </div>
  </main>;
}
