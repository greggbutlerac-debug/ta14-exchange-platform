'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const steps=[
['01','DETECT','Sustained CO₂ event','Environmental sensing identifies a condition that may warrant attention. Detection is evidence of a condition, not authority to intervene.'],
['02','VALIDATE','Evidence + provenance','Sensor identity, timing, continuity, attribution, and relevant environmental context are checked before the signal is treated as admissible evidence.'],
['03','PROPOSE','Explicit consequence','A specific ventilation or HVAC consequence is stated—for example, increasing outdoor-air ventilation for the affected zone.'],
['04','AUTHORITY','Who may approve or execute?','The asserted authority is identified and checked against the equipment, place, scope, and current condition.'],
['05','GOVERN','TA-14 consequence boundary','TA-14 asks whether the proposed consequence has admissible evidence, applicable authority, and established standing to become reality now.'],
['06','EXECUTE','BMS / HVAC action','Any physical or operational intervention remains under the appropriate operational system and authority. A TA-14 determination is not the execution itself.'],
['07','VERIFY','Outcome becomes new evidence','The resulting environmental state is observed and preserved as the next record rather than inferred from the command.'],
];

export default function BlueIotEvidenceToActionShowroom(){
 const [phase,setPhase]=useState<'DETECTED'|'VALIDATED'|'ALLOW'|'HOLD'|'VERIFIED'>('DETECTED');
 const [speakingImage,setSpeakingImage]=useState<string|null>(null);
 const [speechAvailable,setSpeechAvailable]=useState(false);
 useEffect(()=>{
  setSpeechAvailable(typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
  return ()=>{ if(typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel(); };
 },[]);
 const stopNarration=()=>{if(typeof window !== 'undefined' && 'speechSynthesis' in window)window.speechSynthesis.cancel();setSpeakingImage(null);};
 const playNarration=(number:string,title:string,script:string)=>{
  if(typeof window==='undefined'||!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window))return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance('Image '+number+' of eight. '+title+'. '+script);
  const voices=window.speechSynthesis.getVoices();
  const selected=voices.find(v=>/samantha/i.test(v.name))||voices.find(v=>/^en[-_]/i.test(v.lang)&&/female|zira|ava|allison/i.test(v.name))||voices.find(v=>/^en[-_]/i.test(v.lang));
  if(selected)utterance.voice=selected;
  utterance.rate=0.9;
  utterance.onend=()=>setSpeakingImage(null);
  utterance.onerror=()=>setSpeakingImage(null);
  setSpeakingImage(number);
  window.speechSynthesis.speak(utterance);
 };
 const determination=phase==='ALLOW'||phase==='VERIFIED'?'ALLOW':phase==='HOLD'?'HOLD':'PENDING';
 const accent=phase==='ALLOW'||phase==='VERIFIED'?'#7ff0bd':phase==='HOLD'?'#f2bf6a':'#6fdfff';
 return <main style={{minHeight:'100vh',padding:'48px 22px 100px',background:'radial-gradient(circle at 84% 4%,rgba(68,207,255,.16),transparent 28%),radial-gradient(circle at 10% 44%,rgba(74,229,179,.10),transparent 30%),linear-gradient(180deg,#02070d,#06111c 52%,#02070d)',color:'#eef7fb',fontFamily:'Inter,system-ui,sans-serif'}}>
 <div style={{maxWidth:1220,margin:'0 auto'}}>
 <nav style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',paddingBottom:20,borderBottom:'1px solid rgba(113,231,255,.14)'}}><Link href="/environmental-integrity-governance" style={{color:'#9edff0',textDecoration:'none',fontWeight:800}}>← Environmental Integrity Governance</Link><Link href="/" style={{color:'#91a8b7',textDecoration:'none'}}>TA-14 Exchange →</Link></nav>

 <section style={{marginTop:26,padding:'clamp(34px,6vw,70px)',border:'1px solid rgba(113,231,255,.22)',borderRadius:30,background:'linear-gradient(145deg,rgba(8,35,52,.96),rgba(5,14,24,.98) 55%,rgba(15,35,42,.92))',boxShadow:'0 36px 110px rgba(0,0,0,.42)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.22em',color:'#78e8ff'}}>TA-14 · BLUE IOT / ENCOMPASS BLUE DISCUSSION SURFACE · PUBLIC TECHNICAL SHOWROOM</div>
 <h1 style={{fontSize:'clamp(43px,7vw,86px)',lineHeight:.95,letterSpacing:'-.055em',margin:'20px 0 22px'}}>EVIDENCE<br/><span style={{color:'#7ff0bd'}}>TO ACTION</span></h1>
 <p style={{fontSize:'clamp(18px,2.2vw,26px)',lineHeight:1.48,maxWidth:980,color:'#b7c9d5',margin:0}}>A bounded CO₂ example for examining the point between environmental intelligence and consequential building action: when does evidence become sufficient not merely to inform a response, but to support an authorized consequence now?</p>
 </section>

 <section id="guided-examination" aria-label="Eight-image guided technical examination" style={{margin:'22px 0',padding:'clamp(22px,4vw,42px)',border:'1px solid rgba(113,231,255,.22)',borderRadius:26,background:'rgba(4,16,26,.95)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#78e8ff'}}>GUIDED TECHNICAL EXAMINATION · EIGHT TEACHING IMAGES</div>
 <h2 style={{fontSize:'clamp(28px,4.6vw,50px)',letterSpacing:'-.04em',margin:'10px 0 12px'}}>Evidence to action: the complete teaching sequence</h2>
 <p style={{color:'#aec1cd',lineHeight:1.65,maxWidth:960}}>Eight numbered illustrations explain the distinction between observation, admissible evidence, a bounded proposed consequence, applicable authority, established standing, external execution and verified outcome. The Classroom 214 examples and operational values are illustrative, not verified Blue IoT data or operating recommendations.</p>
 <a href="/TA14_Blue_IoT_Evidence_to_Action_Technical_Examination_v2%20(1).pdf" download style={{display:'inline-block',padding:'14px 22px',borderRadius:999,background:'#7ff0bd',color:'#04151a',fontWeight:950,textDecoration:'none',marginBottom:20}}>DOWNLOAD THE TECHNICAL EXAMINATION V2.0 (PDF) ↓</a>
 <nav aria-label="Teaching image navigation" style={{display:'flex',flexWrap:'wrap',gap:8,margin:'0 0 24px'}}>
 {Array.from({length:8},(_,i)=>String(i+1).padStart(2,'0')).map(n=><a key={n} href={`#teaching-${n}`} style={{padding:'10px 14px',borderRadius:999,border:'1px solid rgba(113,231,255,.35)',color:'#a5efff',textDecoration:'none',fontWeight:900}}>{n}</a>)}
 <a href="#classroom-simulation" style={{padding:'10px 14px',color:'#7ff0bd',fontWeight:900}}>TRY THE SIMULATION ↓</a>
 </nav>
 {[
 ['01','THE SIGNAL','CO₂ Detection in Classroom 214.png','Start with what is actually observed. In this illustrative Classroom 214 case, a sensor reports sustained elevated carbon dioxide during an occupied interval. The observation may justify examining ventilation conditions, but it does not reveal the cause by itself. Occupancy, sensor placement, device condition, outdoor conditions and time history matter. At this stage we can say a condition was reported. We cannot yet say that a particular intervention is required, safe or authorized. Detection begins the examination; it does not make the decision.'],
 ['02','PRESERVE THE RECORD','Validating Classroom Sensor Records.png','Before a signal can support a consequential decision, preserve its record. Identify the sensor, room, measurement units, timestamps, source history and available quality and calibration information. Retain raw observations as the primary record. If a dashboard smooths, adjusts or summarizes them, preserve the derived version separately with its method and source references. Look for gaps, clock drift and changes in sensor-to-room attribution. The result is not simply a pretty graph. It is a record that an independent examiner can reconstruct, challenge and trace.'],
 ['03','PROPOSE THE CONSEQUENCE','Proposed Classroom Ventilation Consequence.png','Now state exactly what action is under consideration. For this hypothetical case, the proposition is to adjust outdoor-air ventilation serving Classroom 214. Name the equipment, zone, initiating actor, proposed operating duration, conditions, limits and rollback criteria. Do not presume that more outdoor air is always beneficial: humidity, equipment capability, filtration, weather, safety and site rules may change what is appropriate. A dashboard recommendation is not a control command. This proposition is a specific question that must still pass evidence, authority and standing examination.'],
 ['04','FIND THE AUTHORITY','Authority Verification Technical Showroom Slide.png','Applicable Authority and Established Standing are different tests. A building may have a policy permitting ventilation changes, but that does not prove that this particular person or system may invoke the policy now. Examine the four standing anchors: ACTOR, CAPACITY, STANDING BASIS and AUTHORITY RELATIONSHIP. Identify who is acting, in what role, by what established basis, and for which equipment, site, action and time. Authority context may travel between systems, but execution authority must be established locally. An API credential or technical capability does not, by itself, prove standing.'],
 ['05','THE CONSEQUENCE BOUNDARY','TA-14_ The Consequence Boundary.png','This is the TA14 consequence boundary. Ask the exact governing question: Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW? The answer is scoped to this specific proposition and current conditions. A determination may be ALLOW, HOLD, DENY or ESCALATE. Record the reason, source references, time, limitations, and conditions requiring revalidation. Even an ALLOW is not a building-control instruction. It is a bounded governance determination, separate from physical execution.'],
 ['06','THE AUTHORITY GAP','Authority Gap_ Classroom 214 Ventilation Hold.png','Consider the authority-gap branch. The Classroom 214 environmental evidence may be adequate, and the proposed action may be clearly described, yet the actor’s permission to change the relevant equipment remains unestablished. The correct illustrative determination is HOLD, with the missing authority relationship recorded. HOLD is not a failure to collect sensor data; it is successful recognition that good measurements cannot confer permission. Preserve the evidence, identify the remediable gap and require a fresh determination when the necessary standing is established.'],
 ['07','EXTERNAL EXECUTION','TA-14 Execute_ Authorized BMS Control Flow.png','If the relevant conditions are established and a bounded ALLOW is issued, execution still belongs to the authorized site operator or building-management system. That system must independently apply its current safety and operating constraints. Record whether the action was accepted, declined, modified or attempted. If a command is issued, preserve its time, target, acknowledgment and observable equipment response. A successful acknowledgment only shows that a command was received. It does not establish that equipment changed as intended or that the air in Classroom 214 improved.'],
 ['08','OUTCOME BECOMES EVIDENCE','Verifying Classroom CO₂ Outcomes.png','Finally examine what actually happened. Compare the proposed effect with post-action equipment states and time-stamped environmental observations, preserving changed occupancy, conditions, missing data and uncertainty. Distinguish NOT EXECUTED, EXECUTION UNCONFIRMED, EXECUTED WITH OUTCOME UNVERIFIED and VERIFIED OUTCOME. Do not infer causation from a single lower carbon-dioxide reading, and do not treat an apparent benefit as retroactive permission. Preserve the observed outcome as a new evidence record. That record informs the next examination; it does not automatically authorize the next consequence.']
 ].map(([number,title,file,narration])=><article id={`teaching-${number}`} key={number} style={{scrollMarginTop:24,marginTop:24,padding:'clamp(14px,2.5vw,26px)',border:'1px solid rgba(113,231,255,.16)',borderRadius:18,background:'rgba(1,10,18,.65)'}}>
 <div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',marginBottom:14,alignItems:'center'}}><h3 style={{fontSize:'clamp(19px,2.6vw,28px)',margin:0,color:'#eef7fb'}}>{number} / 08 · {title}</h3><span style={{fontSize:11,color:'#7ff0bd',fontWeight:900}}>ILLUSTRATIVE EXAMINATION</span></div>
 <img src={`/${encodeURIComponent(file)}`} alt={`TA14 Blue IoT teaching image ${number} of 08: ${title}. ${narration}`} loading="lazy" style={{display:'block',width:'100%',height:'auto',borderRadius:12,border:'1px solid rgba(113,231,255,.16)'}}/>
 <p style={{margin:'16px 0 10px',lineHeight:1.65,color:'#b8cbd6'}}><strong style={{color:'#7ff0bd'}}>NARRATION SCRIPT:</strong> {narration}</p>
 <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
 <button type="button" disabled={!speechAvailable} onClick={()=>playNarration(number,title,narration)} aria-label={`Read image ${number} narration aloud`} style={{padding:'10px 16px',borderRadius:999,cursor:speechAvailable?'pointer':'not-allowed',background:'rgba(111,223,255,.12)',border:'1px solid rgba(111,223,255,.5)',color:'#adf0ff',fontWeight:800}}>{speakingImage===number?'RESTART NARRATION':'▶ LISTEN TO NARRATION'}</button>
 <button type="button" disabled={!speakingImage} onClick={stopNarration} style={{padding:'10px 16px',borderRadius:999,cursor:speakingImage?'pointer':'not-allowed',background:'transparent',border:'1px solid rgba(255,255,255,.24)',color:'#e7f2f7',fontWeight:800}}>■ STOP</button>
 </div>
 </article>)}
 <p style={{margin:'20px 0 0',fontSize:13,color:'#8fa8b7'}}>Read-aloud controls use the visitor's browser/device voice. The Samantha voice is preferred automatically when installed, but is not guaranteed; this is not a studio-recorded Samantha audio track. Scripts remain visible for accessibility. Scroll freely through all eight images.</p>
 </section>

 <section style={{margin:'22px 0',padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(127,240,189,.22)',borderRadius:26,background:'rgba(5,18,27,.88)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#7ff0bd'}}>THE PRACTICAL PATHWAY</div>
 <h2 style={{fontSize:'clamp(29px,4.6vw,52px)',letterSpacing:'-.04em',margin:'10px 0 8px'}}>Sense it. Validate it. Govern the consequence. Verify the outcome.</h2>
 <div style={{display:'grid',gap:9,marginTop:24}}>{steps.map(([n,a,b,c],i)=><div key={n} style={{display:'grid',gridTemplateColumns:'48px minmax(150px,210px) minmax(180px,280px) 1fr',gap:14,alignItems:'center',padding:'15px 16px',borderRadius:14,border:'1px solid rgba(113,231,255,.13)',background:i===4?'rgba(127,240,189,.055)':'rgba(2,9,15,.52)'}}><span style={{fontWeight:950,color:i===4?'#7ff0bd':'#526e7e'}}>{n}</span><b style={{color:i===4?'#7ff0bd':'#eef7fb'}}>{a}</b><span style={{fontWeight:800,color:'#c5d7df'}}>{b}</span><span style={{fontSize:13,lineHeight:1.48,color:'#91a8b7'}}>{c}</span></div>)}</div>
 </section>

 <section id="classroom-simulation" style={{scrollMarginTop:24,padding:'clamp(26px,4vw,44px)',border:`1px solid ${accent}55`,borderRadius:26,background:'linear-gradient(135deg,rgba(15,56,49,.24),rgba(4,14,23,.95))'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#7ff0bd'}}>RUN ONE · SUSTAINED CO₂ EVENT · ILLUSTRATIVE SIMULATION ONLY</div>
 <h2 style={{fontSize:'clamp(29px,4.6vw,52px)',letterSpacing:'-.04em',margin:'10px 0 20px'}}>Classroom 214 · proposed ventilation increase</h2><p style={{color:'#f2bf6a',lineHeight:1.55}}>Training simulation: buttons change this demonstration's displayed state only. No live evidence is validated, no real authority is established, and no command is sent to building equipment.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10}}>
 {[
 ['DETECTION','CO₂ remains elevated beyond the bounded observation period.'],
 ['EVIDENCE','Sensor identity, timestamps, provenance, and continuity are addressable.'],
 ['PROPOSITION','Increase outdoor-air ventilation for Classroom 214.'],
 ['AUTHORITY','Building operator / control authority must be established for this consequence.'],
 ['STANDING','Evidence and authority must apply to this room, equipment, condition, and time.'],
 ].map(([a,b])=><div key={a} style={{padding:17,borderRadius:14,border:'1px solid rgba(127,240,189,.15)',background:'rgba(2,10,17,.52)'}}><div style={{fontSize:10,fontWeight:950,color:'#7ff0bd',letterSpacing:'.1em'}}>{a}</div><div style={{marginTop:7,color:'#c5d7df',lineHeight:1.48,fontSize:13}}>{b}</div></div>)}
 </div>

 <div style={{marginTop:22,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:14}}>
 <div style={{padding:22,borderRadius:18,border:'1px solid rgba(127,240,189,.24)',background:'rgba(1,8,13,.68)',textAlign:'center'}}>
 <div style={{fontSize:11,color:'#9ab0bc',fontWeight:900,letterSpacing:'.12em'}}>TA-14 CONSEQUENCE BOUNDARY</div>
 <div style={{fontSize:'clamp(21px,3vw,34px)',fontWeight:950,margin:'14px 0'}}>Does this proposed ventilation consequence have <span style={{color:'#eef7fb'}}>admissible evidence, applicable authority, and established standing</span> to become reality <span style={{color:'#7ff0bd'}}>NOW?</span></div>
 <div style={{display:'flex',gap:9,justifyContent:'center',flexWrap:'wrap',marginTop:18}}>
 <button onClick={()=>setPhase('VALIDATED')} style={{cursor:'pointer',padding:'11px 18px',borderRadius:999,border:'1px solid #6fdfff',background:'rgba(111,223,255,.08)',color:'#9eeaff',fontWeight:950}}>VALIDATE EVIDENCE</button>
 <button disabled={phase==='DETECTED'} onClick={()=>setPhase('ALLOW')} style={{cursor:phase==='DETECTED'?'not-allowed':'pointer',opacity:phase==='DETECTED'?.38:1,padding:'11px 18px',borderRadius:999,border:'1px solid #7ff0bd',background:'rgba(127,240,189,.09)',color:'#7ff0bd',fontWeight:950}}>SIMULATE ESTABLISHED STATE</button>
 <button disabled={phase==='DETECTED'} onClick={()=>setPhase('HOLD')} style={{cursor:phase==='DETECTED'?'not-allowed':'pointer',opacity:phase==='DETECTED'?.38:1,padding:'11px 18px',borderRadius:999,border:'1px solid #f2bf6a',background:'rgba(242,191,106,.08)',color:'#f2bf6a',fontWeight:950}}>SIMULATE AUTHORITY GAP</button>
 <button onClick={()=>setPhase('DETECTED')} style={{cursor:'pointer',padding:'11px 18px',borderRadius:999,border:'1px solid #536c79',background:'transparent',color:'#8fa6b5',fontWeight:900}}>RESET</button>
 </div>
 </div>

 <div style={{padding:22,borderRadius:18,border:`1px solid ${accent}66`,background:'rgba(1,8,13,.72)'}}>
 <div style={{fontSize:11,color:'#9ab0bc',fontWeight:900,letterSpacing:'.12em'}}>GOVERNED STATE</div>
 <div style={{marginTop:16,fontSize:12,color:'#879eac'}}>ENVIRONMENTAL CONDITION</div><div style={{fontWeight:900}}>SUSTAINED CO₂ EVENT</div>
 <div style={{marginTop:14,fontSize:12,color:'#879eac'}}>PROPOSED CONSEQUENCE</div><div style={{fontWeight:900}}>INCREASE OUTDOOR-AIR VENTILATION</div>
 <div style={{marginTop:14,fontSize:12,color:'#879eac'}}>TA-14 DETERMINATION</div><div style={{fontSize:'clamp(24px,3vw,38px)',fontWeight:1000,color:accent}}>{determination}</div>
 <div style={{marginTop:14,fontSize:12,color:'#879eac'}}>EXECUTION STATE</div><div style={{fontWeight:900}}>{phase==='VERIFIED'?'SIMULATED EXECUTION / OUTCOME':'NOT EXECUTED'}</div>
 <p style={{fontSize:13,lineHeight:1.55,color:'#a9bbc4'}}>{phase==='DETECTED'?'Detection establishes a condition to examine. It does not itself establish intervention authority.':phase==='VALIDATED'?'Evidence has been validated, but admissible evidence is still not the same thing as authority to intervene.':phase==='ALLOW'?'ALLOW is a bounded governance determination. The authorized BMS / HVAC system still retains execution control.':phase==='HOLD'?'HOLD preserves the environmental evidence while preventing the proposed consequence from being treated as authorized under an unresolved authority or standing condition.':'In this training branch, a hypothetical post-action environmental state is represented as new evidence; no real outcome has been independently verified.'}</p>
 {phase==='ALLOW'&&<button onClick={()=>setPhase('VERIFIED')} style={{cursor:'pointer',padding:'10px 16px',borderRadius:999,border:'1px solid #7ff0bd',background:'rgba(127,240,189,.11)',color:'#7ff0bd',fontWeight:950}}>SIMULATE EXTERNAL EXECUTION + OBSERVATION</button>}
 </div>
 </div>
 </section>

 <section style={{marginTop:22,padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(113,231,255,.16)',borderRadius:26,background:'rgba(4,13,22,.9)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#78e8ff'}}>WHAT THE TECHNICAL DISCUSSION WOULD TEST</div>
 <h2 style={{fontSize:'clamp(27px,4vw,46px)',letterSpacing:'-.035em',margin:'10px 0 18px'}}>One event. Five questions. No assumed integration.</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10}}>
 {[
 ['01','What evidence arrives?','Which CO₂ measurements, timestamps, sensor identities, and context are available to support the proposition?'],
 ['02','What can Encompass Blue establish?','Which sensing, analytics, equipment relationships, recommendations, or control states are already represented?'],
 ['03','Where is authority represented?','What identifies the person, policy, control system, or operating role permitted to approve this specific intervention?'],
 ['04','What does TA-14 return?','What bounded determination and reason can be attached to the proposed consequence without taking over execution?'],
 ['05','What proves the outcome?','Which post-action observations establish what actually changed and become the next environmental record?'],
 ].map(([n,a,b])=><div key={n} style={{padding:18,borderRadius:14,border:'1px solid rgba(113,231,255,.13)',background:'rgba(2,9,15,.52)'}}><div style={{fontSize:10,fontWeight:950,color:'#78e8ff'}}>{n}</div><b style={{display:'block',marginTop:7,color:'#e9f6fa'}}>{a}</b><p style={{fontSize:13,lineHeight:1.5,color:'#91a8b7',margin:'7px 0 0'}}>{b}</p></div>)}
 </div>
 </section>

 <section style={{marginTop:22,padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(113,231,255,.16)',borderRadius:26,background:'rgba(4,13,22,.9)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#78e8ff'}}>WHERE THE SYSTEMS MEET</div>
 <h2 style={{fontSize:'clamp(27px,4vw,46px)',letterSpacing:'-.035em',margin:'10px 0 18px'}}>Environmental intelligence and execution governance remain distinct.</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12}}>
 <div style={{padding:20,borderRadius:16,border:'1px solid rgba(113,231,255,.15)',background:'rgba(3,10,17,.58)'}}><b style={{color:'#9eeaff'}}>ENVIRONMENTAL / BUILDING SYSTEM LAYER</b><p style={{color:'#94aab6',lineHeight:1.55}}>Sensing, environmental data, analytics, equipment context, recommendations, controls, and outcome observations may be provided by platforms such as Encompass Blue, BMS, HVAC, operators, and other building systems.</p></div>
 <div style={{padding:20,borderRadius:16,border:'1px solid rgba(127,240,189,.18)',background:'rgba(3,14,13,.58)'}}><b style={{color:'#7ff0bd'}}>TA-14 GOVERNANCE LAYER</b><p style={{color:'#94aab6',lineHeight:1.55}}>TA-14 evaluates the bounded proposition at the consequence boundary: whether it has admissible evidence, applicable authority, and established standing for that proposed consequence now. It does not replace the sensing platform, BMS, HVAC controls, or operator.</p></div>
 </div>
 </section>

 <section style={{marginTop:22,padding:'clamp(26px,4vw,40px)',borderRadius:24,border:'1px solid rgba(127,240,189,.2)',background:'linear-gradient(135deg,rgba(12,52,43,.28),rgba(4,14,23,.92))'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#7ff0bd'}}>PROPOSED NEXT STEP</div>
 <h2 style={{fontSize:'clamp(26px,4vw,44px)',letterSpacing:'-.035em',margin:'10px 0 12px'}}>Run this exact CO₂ pathway together.</h2>
 <p style={{color:'#a9bbc4',lineHeight:1.65,maxWidth:900,margin:0}}>Use the states, evidence, equipment relationships, recommendations, control context, and post-action observations that Encompass Blue actually exposes. Then examine where the bounded consequence proposition reaches TA-14, what governance determination can be returned without taking over execution, and what evidence closes the resulting outcome.</p>
 </section>

 <section style={{marginTop:22,padding:'28px',borderRadius:24,border:'1px solid rgba(242,191,106,.18)',background:'rgba(45,33,10,.22)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#f2bf6a'}}>BOUNDARY NOTICE</div>
 <p style={{color:'#b8b2a2',lineHeight:1.6,marginBottom:0}}>This showroom is a TA-14 discussion surface derived from the technical pathway proposed in correspondence with Robert Sharon. It does not state or imply that Blue IoT, Encompass Blue, Robert Sharon, or any associated party has adopted, integrated, certified, endorsed, or transferred authority to TA-14. The example is conceptual until a bounded technical examination is mutually defined and performed.</p>
 </section>
 </div></main>
}