'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';

const exhibits = [
 {file:'Rivermere Library Airflow Exhibit.png',title:'The Asset',subtitle:'Establish one asset and its authorized operating envelope.',narration:'Welcome to Governing One Intake Damper. We begin with one hypothetical occupied public library, its primary air handling unit, and exactly one outdoor-air intake damper. The initial simulated position is twenty percent. The owner and qualified engineers must determine lawful operating requirements, safety interlocks, permitted actions, and delegation. Damper position alone does not measure airflow.',lesson:'Before an action can be governed, the asset, applicable policy, and authorized actors must be identified.'},
 {file:'Library HVAC Reality Changes.png',title:'Reality Changes',subtitle:'Capture conditions before interpretation.',narration:'Occupancy increases, and the illustrative indoor carbon dioxide concentration reaches fourteen hundred parts per million. Initial outdoor particulate matter concentration is twelve micrograms per cubic meter. Atmospheric Integrity Records preserve identity, timestamp, instrument qualification, uncertainty, and continuity. Carbon dioxide is a ventilation indicator, not a comprehensive measure of indoor air quality.',lesson:'A reading without provenance and continuity cannot automatically become admissible evidence.'},
 {file:'Intelligence Proposes, Permission Decides.png',title:'Intelligence Proposes',subtitle:'A recommendation is not execution permission.',narration:'Admissible Computation Architecture evaluates evidence eligibility before building intelligence interprets the admissible inputs. The intelligence proposes increasing the single outdoor-air damper from twenty to fifty percent. That proposal identifies the asset, reason, evidence, and policy version. It is not permission to move the actuator.',lesson:'Intelligence may propose a consequential action. It must not authorize itself.'},
 {file:'Wildfire Smoke Challenges Library HVAC Governance.png',title:'The World Does Not Wait',subtitle:'Reality can change before the command reaches the asset.',narration:'Before the proposed command is committed, simulated outdoor fine particulate concentration rises from twelve to eighty five micrograms per cubic meter. The original ventilation recommendation still exists, but its environmental premises have changed. An earlier favorable measurement cannot independently justify execution now.',lesson:'The proposal must be checked against current conditions at the moment of consequence.'},
 {file:'AuthorityGate Execution Boundary_ Escalate.png',title:'The Execution Boundary',subtitle:'Independent examination at the point of consequence.',narration:'The parent Admissible Execution Architecture independently checks Admissible Evidence, Applicable Authority, and Established Standing. TA-14 AuthorityGate represents the proposed software enforcement boundary. Although evidence identity, authority, and standing can pass, current outdoor conditions conflict with the illustrative operating policy. The modeled determination is escalate, and the proposed increase is not released.',lesson:'A passing evidence check is not enough when an applicable operating constraint conflicts.'},
 {file:'Governed Intervention_ Damper Escalated.png',title:'Governed Intervention',subtitle:'Refuse the unjustified increase without defeating safety.',narration:'The proposed discretionary increase is not executed. In this synthetic case the damper remains at its previous permitted state while the matter is escalated to an authorized operator. That is not a command to shut ventilation. Required ventilation, fire and life safety controls, and engineered fallback remain independent and must be preserved.',lesson:'Restraint can be a governed outcome; it is not a waiver of ventilation or life-safety duties.'},
 {file:'Renewed Justification Governance Dashboard.png',title:'Renewed Justification',subtitle:'A new action requires fresh evidence and permission.',narration:'The outdoor particulate concentration returns to the illustrative twelve micrograms per cubic meter. Indoor carbon dioxide remains elevated. The system must re-evaluate current evidence, applicable policy, authority, and actor standing. Only a new bounded authorization may permit the simulated damper target of fifty percent; earlier authorization may not be replayed.',lesson:'Approval is action-specific and time-specific. Changed conditions require a new examination.'},
 {file:'Independent Verification Airflow Dashboard.png',title:'Proof of Outcome',subtitle:'Distinguish a command from a verified environmental result.',narration:'A simulated actuator reports the newly authorized damper position. Separate measurements of outdoor airflow and the indoor environmental response are necessary to examine what happened. An approved command is not evidence by itself that airflow increased or that occupants received cleaner air. The images use illustrative readings, not observations from a real building. The verification record must preserve uncertainty, feedback, provenance, and any unresolved discrepancy.',lesson:'Authorization, movement, airflow, and environmental outcome are four distinct claims.'}
] as const;

const pdf='/' + encodeURIComponent('TA14_Governing_One_Intake_Damper_Examination_v1 (1).pdf');
const teal='#76e7e8', ink='#effcff', muted='#b5cad2';
type Decision='ALLOW'|'HOLD'|'DENY'|'ESCALATE'|'NO REQUEST';

function decisionFor(co2:number,pm:number,fresh:boolean,authority:boolean,standing:boolean):Decision {
 if(co2<=1000)return 'NO REQUEST';
 if(!authority||!standing)return 'DENY';
 if(!fresh)return 'HOLD';
 if(pm>35)return 'ESCALATE';
 return 'ALLOW';
}

export default function GoverningOneIntakeDamper(){
 const [speaking,setSpeaking]=useState<number|null>(null);
 const [voiceAvailable,setVoiceAvailable]=useState(true);
 const [showTranscripts,setShowTranscripts]=useState(false);
 const voice=useRef<SpeechSynthesisVoice|null>(null);
 const speechEpoch=useRef(0);
 const [co2,setCo2]=useState(1400);
 const [pm,setPm]=useState(85);
 const [fresh,setFresh]=useState(true);
 const [authority,setAuthority]=useState(true);
 const [standing,setStanding]=useState(true);
 const [actuatorFeedback,setActuatorFeedback]=useState(true);
 const [tests,setTests]=useState(false);
 const decision=decisionFor(co2,pm,fresh,authority,standing);
 const proposed=co2>1000;

 useEffect(()=>{
   if(!('speechSynthesis' in window)){setVoiceAvailable(false);return;}
   const choose=()=>{
     const voices=window.speechSynthesis.getVoices();
     voice.current=voices.find(v=>/samantha/i.test(v.name))
       || voices.find(v=>v.lang.startsWith('en-US'))
       || voices.find(v=>v.lang.startsWith('en')) || null;
   };
   choose();
   window.speechSynthesis.addEventListener('voiceschanged',choose);
   return ()=>{speechEpoch.current++;window.speechSynthesis.cancel();window.speechSynthesis.removeEventListener('voiceschanged',choose);};
 },[]);

 function play(i:number){
   if(!voiceAvailable)return;
   const epoch=++speechEpoch.current;
   window.speechSynthesis.cancel();
   if(speaking===i){setSpeaking(null);return;}
   const utterance=new SpeechSynthesisUtterance(exhibits[i].narration);
   if(voice.current)utterance.voice=voice.current;
   utterance.lang='en-US';utterance.rate=.9;
   utterance.onend=()=>{if(speechEpoch.current===epoch)setSpeaking(null);};
   utterance.onerror=()=>{if(speechEpoch.current===epoch)setSpeaking(null);};
   window.speechSynthesis.speak(utterance);setSpeaking(i);
 }

 function reset(){setCo2(1400);setPm(85);setFresh(true);setAuthority(true);setStanding(true);setActuatorFeedback(true);}
 const resultColor=decision==='ALLOW'?'#98efb9':decision==='DENY'?'#ff8f8f':decision==='NO REQUEST'?'#c2ced3':'#ffd28a';
 const scenarioRows=[
  ['Current evidence; permitted policy; authority and standing valid','ALLOW — one bounded simulated command'],
  ['Required evidence stale or missing','HOLD — no new command'],
  ['Authority absent or revoked','DENY — no new command'],
  ['Actor lacks valid standing','DENY — no new command'],
  ['Outdoor conditions conflict before commit','ESCALATE — no discretionary increase'],
  ['Authorization replay or altered target','DENY — re-evaluate'],
  ['Command issued but feedback missing','Outcome unverified — escalate'],
  ['New intervention after circumstances change','Fresh independent examination'],
  ['Safety interlock or required ventilation conflict','Preserve approved safety path']
 ];
 return <main style={{minHeight:'100vh',background:'linear-gradient(150deg,#061622,#0c303c 45%,#07141e)',color:ink,fontFamily:'Arial,Helvetica,sans-serif'}}>
  <div style={{maxWidth:1210,margin:'0 auto',padding:'24px 20px 100px'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',fontSize:14}}>
    <Link href="/showrooms" style={{color:teal}}>← All showrooms</Link>
    <span style={{color:muted}}>TA-14 Authority Governance Institution · Examination Edition 1.0</span>
   </nav>
   <header style={{padding:'64px 0 34px'}}>
    <p style={{letterSpacing:3,fontSize:12,fontWeight:800,color:teal}}>ONE ASSET · ONE DECISION · ONE CONSEQUENCE</p>
    <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(37px,6vw,68px)',lineHeight:1.06,margin:'16px 0'}}>Governing One <span style={{color:teal}}>Intake Damper</span></h1>
    <p style={{fontSize:'clamp(18px,2.2vw,24px)',color:muted,maxWidth:950,lineHeight:1.55}}>An eight-exhibit examination of the distance between a building intelligence recommendation and permission to change physical reality.</p>
    <p style={{padding:20,borderRadius:12,background:'#192d36',border:'1px solid #ab8b4d',lineHeight:1.65}}>
     <strong style={{color:'#ffd58c'}}>Virtual educational demonstration, not a deployed control system.</strong> The library, numerical readings, decisions and pictured outcomes are simulated. No operational safety, field measurement, partner endorsement, certification, or independently tested software enforcement is asserted. Qualified engineering and owner approval are mandatory for any real implementation.
    </p>
    <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:23}}>
     <a href="#exhibits" style={{background:teal,color:'#05212a',padding:'13px 19px',borderRadius:9,textDecoration:'none',fontWeight:800}}>Explore the eight exhibits</a>
     <a href={pdf} download style={{border:'1px solid #75a8b1',color:ink,padding:'13px 19px',borderRadius:9,textDecoration:'none',fontWeight:800}}>Download examination PDF</a>
     <a href="#simulation" style={{border:'1px solid #75a8b1',color:ink,padding:'13px 19px',borderRadius:9,textDecoration:'none',fontWeight:800}}>Try the virtual AuthorityGate</a>
    </div>
   </header>
   <section id="exhibits" aria-label="Eight sequential showroom exhibits">
    {exhibits.map((exhibit,i)=><article key={exhibit.file} id={'exhibit-'+(i+1)} style={{margin:'43px 0',padding:'clamp(16px,2.5vw,28px)',border:'1px solid #315c69',borderRadius:16,background:'#0b2632'}}>
     <p style={{letterSpacing:2,color:teal,fontSize:12,fontWeight:800}}>EXHIBIT {String(i+1).padStart(2,'0')} / 08</p>
     <h2 style={{fontSize:'clamp(25px,3.5vw,40px)',margin:'10px 0'}}>{exhibit.title}</h2>
     <p style={{fontSize:17,color:muted,margin:'0 0 21px'}}>{exhibit.subtitle}</p>
     <div style={{position:'relative',aspectRatio:'16 / 9',borderRadius:12,overflow:'hidden',background:'#05121b',border:'1px solid #3a6974'}}>
      <Image src={'/'+encodeURIComponent(exhibit.file)} alt={'Exhibit '+(i+1)+': '+exhibit.title+'. Simulated one-damper scenario artwork.'} fill sizes="(max-width: 900px) 100vw, 1150px" style={{objectFit:'contain'}} priority={i===0}/>
     </div>
     {i===6&&<p style={{fontSize:13,color:'#ffd58c',lineHeight:1.65}}>Artwork note: the scene illustrates an improving indoor CO₂ trend. The examination scenario requires a fresh admissibility check; do not read the pictured CO₂ change as a measured physical outcome before the new opening.</p>}
     {i===7&&<p style={{fontSize:13,color:'#ffd58c',lineHeight:1.65}}>Artwork note: displayed airflow and CO₂ values and the pictured ventilation-effectiveness calculation are illustrative, not validated measurements or an established engineering formula. Only a qualified, independently reviewed measurement protocol can support a real outcome claim.</p>}
     <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',margin:'18px 0'}}>
      <button type="button" disabled={!voiceAvailable} onClick={()=>play(i)} style={{background:teal,border:0,borderRadius:8,padding:'12px 17px',fontWeight:800,color:'#05202a',cursor:'pointer'}}>{speaking===i?'■ Stop Samantha':'▶ Play Samantha narration'}</button>
      <button type="button" onClick={()=>setShowTranscripts(v=>!v)} style={{background:'transparent',border:'1px solid #587b88',borderRadius:8,padding:'12px 17px',color:ink,cursor:'pointer'}}>{showTranscripts?'Hide transcripts':'Read transcripts'}</button>
      {!voiceAvailable&&<span>Speech synthesis is not supported by this browser.</span>}
     </div>
     {showTranscripts&&<p style={{color:muted,lineHeight:1.75}}><strong>Narration: </strong>{exhibit.narration}</p>}
     <p style={{background:'#153946',padding:'14px 18px',borderLeft:'4px solid '+teal,borderRadius:6,lineHeight:1.7}}><strong>Examination lesson:</strong> {exhibit.lesson}</p>
     <aside aria-label="Learning transition" style={{marginTop:24,padding:'20px 22px',border:'1px solid #315c69',borderRadius:10,background:'#102f3c'}}>
      <p style={{color:teal,fontSize:12,fontWeight:800,letterSpacing:2}}>WHAT WE JUST LEARNED</p>
      <p style={{lineHeight:1.7,margin:'8px 0 20px'}}>{exhibit.lesson}</p>
      <p style={{color:teal,fontSize:12,fontWeight:800,letterSpacing:2}}>WHAT WE WILL LEARN NEXT</p>
      <p style={{lineHeight:1.7,margin:'8px 0 0'}}>{[
       'Next, we will see how rising occupancy changes the library environment and why attributable measurements must precede interpretation.',
       'Next, we will examine how building intelligence turns admissible observations into a proposed damper action without granting itself permission.',
       'Next, we will discover why a recommendation can lose its justification when outdoor conditions change before execution.',
       'Next, we will examine how AuthorityGate evaluates current evidence, applicable authority and established standing at the execution boundary.',
       'Next, we will see how escalation prevents an unjustified discretionary increase while preserving required ventilation and independent safety controls.',
       'Next, we will examine how changed conditions can support a new, independently justified authorization rather than reuse an earlier permission.',
       'Next, we will distinguish reported damper movement from independently verified airflow and environmental outcomes.',
       'Next, you will apply these principles yourself by changing the simulated conditions and examining the resulting AuthorityGate determination.'
      ][i]}</p>
     </aside>
     <div style={{marginTop:16,display:'flex',justifyContent:'flex-end'}}>
      <a href={i===7?'#simulation':'#exhibit-'+(i+2)} style={{color:teal,fontWeight:800,textUnderlineOffset:4}}>{i===7?'Continue to the simulation →':'Continue to Exhibit '+String(i+2).padStart(2,'0')+' →'}</a>
     </div>
    </article>)}
   </section>
   <section id="simulation" style={{padding:'clamp(20px,3vw,36px)',background:'#112f3c',border:'1px solid #4b8390',borderRadius:16}}>
    <p style={{letterSpacing:2,color:teal,fontWeight:800,fontSize:12}}>INTERACTIVE EXAMINATION · SYNTHETIC CONDITIONS ONLY</p>
    <h2 style={{fontSize:'clamp(27px,3.5vw,41px)',margin:'10px 0'}}>Would you authorize the damper increase now?</h2>
    <p style={{color:muted,lineHeight:1.8}}>The hypothetical building intelligence proposes increasing one intake damper from 20% to 50% because of elevated indoor CO₂. Adjust the inputs to see how illustrative evidence, authority, standing, and outdoor conditions change the proposed decision. These rules are teaching fixtures, not building-control setpoints.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))',gap:20,margin:'24px 0'}}>
     <label style={{display:'grid',gap:10,border:'1px solid #3d6876',borderRadius:10,padding:18}}>
      <span>Indoor CO₂: <strong style={{color:teal}}>{co2.toLocaleString()} ppm</strong></span>
      <input type="range" min={400} max={2500} step={50} value={co2} onChange={e=>setCo2(Number(e.currentTarget.value))}/>
     </label>
     <label style={{display:'grid',gap:10,border:'1px solid #3d6876',borderRadius:10,padding:18}}>
      <span>Outdoor PM2.5: <strong style={{color:teal}}>{pm} µg/m³</strong></span>
      <input type="range" min={0} max={180} step={1} value={pm} onChange={e=>setPm(Number(e.currentTarget.value))}/>
     </label>
    </div>
    <div style={{display:'flex',gap:18,flexWrap:'wrap',margin:'15px 0 25px'}}>
     <label><input type="checkbox" checked={fresh} onChange={e=>setFresh(e.currentTarget.checked)}/> Current admissible evidence</label>
     <label><input type="checkbox" checked={authority} onChange={e=>setAuthority(e.currentTarget.checked)}/> Applicable authority</label>
     <label><input type="checkbox" checked={standing} onChange={e=>setStanding(e.currentTarget.checked)}/> Established standing</label>
     <label><input type="checkbox" checked={actuatorFeedback} onChange={e=>setActuatorFeedback(e.currentTarget.checked)}/> Simulated actuator feedback</label>
    </div>
    <div role="status" aria-live="polite" style={{padding:21,background:'#071b25',borderRadius:12,border:'1px solid #4d7783'}}>
     <p style={{fontSize:14,color:muted,margin:'0 0 8px'}}>INTELLIGENCE PROPOSAL</p>
     <p style={{fontWeight:700,margin:'0 0 20px'}}>{proposed?'Increase damper opening: 20% → 50%':'No additional discretionary increase proposed'}</p>
     <p style={{fontSize:14,color:muted,margin:'0 0 8px'}}>INDEPENDENT EXECUTION DETERMINATION</p>
     <strong style={{fontSize:'clamp(32px,5vw,50px)',color:resultColor}}>{decision}</strong>
     <p style={{lineHeight:1.7}}>{decision==='ALLOW'?'The illustrative prerequisites permit one bounded command.':decision==='DENY'?'Required applicable authority or established standing is absent. No new command.':decision==='HOLD'?'Required current admissible evidence is missing. No new command.':decision==='ESCALATE'?'Outdoor environmental conditions conflict with the scenario policy. No discretionary increase; obtain authorized review.':'The synthetic CO₂ trigger does not propose an additional opening.'}</p>
     {decision==='ALLOW'&&<p style={{color:actuatorFeedback?'#98efb9':'#ffd58c',lineHeight:1.7}}>Illustrative feedback: {actuatorFeedback?'target position reported, but actual airflow and occupant outcome still require independent evidence.':'missing — environmental outcome unverified; escalate.'}</p>}
    </div>
    <button type="button" onClick={reset} style={{marginTop:17,border:'1px solid #75a8b1',background:'transparent',color:ink,padding:'11px 16px',borderRadius:8,cursor:'pointer'}}>Reset the demonstration</button>
    <p style={{fontSize:12,color:muted,lineHeight:1.75}}>The CO₂ trigger of 1,000 ppm and PM2.5 comparison of 35 µg/m³ are arbitrary educational fixture values, not ventilation requirements, health standards or operational limits. A real control sequence must preserve mandatory ventilation, engineered fail-safe behavior and independent life-safety functions.</p>
   </section>
   <section style={{padding:'50px 0 15px'}}>
    <h2 style={{fontSize:32}}>Independent examination criteria</h2>
    <p style={{lineHeight:1.8,color:muted,maxWidth:950}}>The nine expected outcomes below are proposed tests from the companion PDF. They are not reported software test results. Independent examiners must use frozen fixtures, explicit policy precedence, event timestamps, authorization scope, actuator isolation and replay prevention.</p>
    <button type="button" onClick={()=>setTests(v=>!v)} style={{padding:'12px 18px',border:'1px solid #76e7e8',color:ink,borderRadius:8,background:'#163947',cursor:'pointer'}}>{tests?'Hide acceptance matrix':'Show nine acceptance tests'}</button>
    {tests&&<div style={{overflowX:'auto',marginTop:19}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:14}}><thead><tr><th style={{padding:14,textAlign:'left',background:'#205060'}}>Proposed condition</th><th style={{padding:14,textAlign:'left',background:'#205060'}}>Expected result</th></tr></thead><tbody>{scenarioRows.map(([condition,result])=><tr key={condition}><td style={{borderBottom:'1px solid #365767',padding:14}}>{condition}</td><td style={{borderBottom:'1px solid #365767',padding:14}}>{result}</td></tr>)}</tbody></table></div>}
   </section>
   <section style={{marginTop:25,padding:25,border:'1px solid #3f6877',borderRadius:13,background:'#102d39'}}>
    <h2 style={{fontSize:27,marginTop:0}}>Read the examination document</h2>
    <p style={{color:muted,lineHeight:1.75}}>Examination Edition 1.0 includes the eight exhibit descriptions, the full proposed governance chain, acceptance-test matrix and minimum independent review record. It is for technical discussion with Michael Bordenaro and Lloyd Helferty and does not imply their endorsement.</p>
    <a href={pdf} download style={{color:teal,fontWeight:800}}>Download 12-page examination PDF →</a>
   </section>
   <footer style={{marginTop:46,color:muted,fontSize:13,lineHeight:1.8}}>TA-14 Authority Governance Institution LLC · <a href="https://www.ta14exchange.com/" style={{color:teal}}>TA-14 Exchange</a><br/>Prediction can propose a consequence. Prediction cannot independently establish permission to execute now.</footer>
  </div>
 </main>;
}
