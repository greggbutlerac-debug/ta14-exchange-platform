'use client';

import Link from 'next/link';
import { useState } from 'react';

const sensors=[
 ['RADON','Continuous radon measurement'],
 ['CO₂','Ventilation context'],
 ['HUMIDITY','Moisture context'],
 ['TEMPERATURE','Thermal context'],
 ['PRESSURE','Building / atmospheric context'],
 ['LIGHT','Space-use context'],
];

const consequences=[
 ['INVESTIGATE','Initiate a qualified radon investigation.'],
 ['VENTILATE','Propose an operational ventilation change.'],
 ['OCCUPANCY','Propose an occupancy-related precaution.'],
 ['REMEDIATE','Refer the condition for a remediation decision.'],
];

export default function AirthingsSpaceRadonShowroom(){
 const [phase,setPhase]=useState<'DETECTED'|'VALIDATED'|'ALLOW'|'HOLD'|'DENY'|'ESCALATE'|'VERIFIED'>('DETECTED');
 const [choice,setChoice]=useState('INVESTIGATE');
 const determination=phase==='ALLOW'||phase==='VERIFIED'?'ALLOW':['HOLD','DENY','ESCALATE'].includes(phase)?phase:'PENDING';
 const accent=phase==='ALLOW'||phase==='VERIFIED'?'#7ff0bd':phase==='DENY'?'#ff7d8c':phase==='ESCALATE'?'#c5a8ff':phase==='HOLD'?'#f2bf6a':'#6fdfff';
 const proposed=consequences.find(x=>x[0]===choice)?.[1];

 return <main style={{minHeight:'100vh',padding:'48px 22px 100px',background:'radial-gradient(circle at 84% 4%,rgba(68,207,255,.16),transparent 28%),radial-gradient(circle at 10% 44%,rgba(74,229,179,.10),transparent 30%),linear-gradient(180deg,#02070d,#06111c 52%,#02070d)',color:'#eef7fb',fontFamily:'Inter,system-ui,sans-serif'}}>
 <div style={{maxWidth:1220,margin:'0 auto'}}>
 <nav style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',paddingBottom:20,borderBottom:'1px solid rgba(113,231,255,.14)'}}><Link href="/environmental-integrity-governance" style={{color:'#9edff0',textDecoration:'none',fontWeight:800}}>← Environmental Integrity Governance</Link><Link href="/" style={{color:'#91a8b7',textDecoration:'none'}}>TA-14 Exchange →</Link></nav>

 <section style={{marginTop:26,padding:'clamp(34px,6vw,70px)',border:'1px solid rgba(113,231,255,.22)',borderRadius:30,background:'linear-gradient(145deg,rgba(8,35,52,.96),rgba(5,14,24,.98) 55%,rgba(15,35,42,.92))',boxShadow:'0 36px 110px rgba(0,0,0,.42)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.22em',color:'#78e8ff'}}>TA-14 · AIRTHINGS SPACE RADON DISCUSSION SURFACE · PUBLIC TECHNICAL SHOWROOM</div>
 <h1 style={{fontSize:'clamp(42px,7vw,84px)',lineHeight:.96,letterSpacing:'-.055em',margin:'20px 0 22px'}}>THE SENSOR DETECTED<br/><span style={{color:'#7ff0bd'}}>THE CONDITION.</span></h1>
 <h2 style={{fontSize:'clamp(24px,4vw,46px)',lineHeight:1.04,letterSpacing:'-.04em',margin:'0 0 20px'}}>Who authorized the consequence?</h2>
 <p style={{fontSize:'clamp(17px,2vw,24px)',lineHeight:1.5,maxWidth:1000,color:'#b7c9d5',margin:0}}>A bounded discussion surface using the publicly announced Space Radon sensing pathway to examine the point between continuous environmental evidence and consequential building action. Detection can establish a condition. It does not, by itself, establish authority to intervene.</p>
 </section>

 <section style={{margin:'22px 0',padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(127,240,189,.22)',borderRadius:26,background:'rgba(5,18,27,.88)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#7ff0bd'}}>THE EVIDENCE SOURCE</div>
 <h2 style={{fontSize:'clamp(29px,4.6vw,52px)',letterSpacing:'-.04em',margin:'10px 0 8px'}}>Six signals. One environmental chronology.</h2>
 <p style={{color:'#9fb3bf',lineHeight:1.6,maxWidth:900}}>Airthings announced Space Radon on September 21, 2026 with continuous radon monitoring alongside five additional measurements. On September 22, Airthings for Business replied to TA-14 that its platform provides the <b style={{color:'#eef7fb'}}>environmental evidence layer</b> through sensor data and historical trends, including live readings and API-accessible time-series data. For radon, Airthings also identified an hourly radon API value that estimates the current level and updates once per hour. TA-14 does not replace that sensing or data layer. This surface examines what must be established before evidence becomes a consequential act.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:10,marginTop:22}}>{sensors.map(([a,b])=><div key={a} style={{padding:17,borderRadius:14,border:'1px solid rgba(113,231,255,.14)',background:'rgba(2,9,15,.52)'}}><b style={{color:'#9eeaff'}}>{a}</b><div style={{marginTop:7,fontSize:13,lineHeight:1.45,color:'#91a8b7'}}>{b}</div></div>)}</div>
 </section>

 <section style={{margin:'22px 0',padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(197,168,255,.24)',borderRadius:26,background:'linear-gradient(135deg,rgba(27,18,45,.72),rgba(4,13,22,.94))'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#c5a8ff'}}>HOW THE BOUNDARY BECAME CONCRETE · DOCUMENTED TIMELINE</div>
 <h2 style={{fontSize:'clamp(29px,4.6vw,52px)',letterSpacing:'-.04em',margin:'10px 0 12px'}}>From interoperability question to an explicit evidence / consequence seam.</h2>
 <p style={{color:'#a9bbc4',lineHeight:1.65,maxWidth:980}}>The discussion did not begin with a claim of integration. It developed through a sequence of bounded public and private records. Each step narrowed the proposition.</p>
 <div style={{display:'grid',gap:12,marginTop:22}}>
 {[
  ['SEPTEMBER 1, 2026','PAIR INTEROPERABILITY OUTREACH','TA-14 asked whether an Airthings data stream could be transformed into a governed Personal Atmospheric Integrity Record while preserving source identity, chronology, location, continuity, and limitations. Airthings remained the environmental measurement source; PAIR was proposed only as a governed record layer.'],
  ['SEPTEMBER 21, 2026','SPACE RADON ANNOUNCED','The Space Radon announcement created a more concrete technical object: continuous radon monitoring together with CO₂, humidity, temperature, pressure and light, framed around monitoring conditions, taking action, and measuring impact over time.'],
  ['SEPTEMBER 22, 2026','TA-14 PUBLIC SHOWROOM','Instead of sending another abstract proposal, TA-14 published this independent examination surface and asked one bounded question: where does environmental evidence become an authorized consequence?'],
  ['SEPTEMBER 22, 2026','AIRTHINGS EVIDENCE-LAYER RESPONSE','Airthings for Business replied that the platform provides the environmental evidence layer through sensor data and historical trends, including live readings and queryable time-series data. It also identified an hourly radon API value that updates once per hour.'],
  ['SEPTEMBER 22, 2026','THE SEAM IS NOW EXPLICIT','Airthings stated that decision logic, authorization rules, and execution of actions are handled by the external system consuming the data. That does not establish a TA-14 integration or endorsement. It does make the architectural boundary concrete enough to examine.'],
 ].map(([d,t,b],i)=><div key={d+t} style={{display:'grid',gridTemplateColumns:'minmax(150px,220px) 1fr',gap:18,padding:20,borderRadius:16,border:i===4?'1px solid rgba(127,240,189,.42)':'1px solid rgba(197,168,255,.18)',background:i===4?'rgba(127,240,189,.06)':'rgba(2,9,15,.46)'}}><div><div style={{fontSize:11,fontWeight:950,letterSpacing:'.12em',color:i===4?'#7ff0bd':'#c5a8ff'}}>{d}</div><div style={{marginTop:6,fontWeight:950,color:'#eef7fb'}}>{t}</div></div><p style={{margin:0,color:'#9fb3bf',lineHeight:1.6}}>{b}</p></div>)}
 </div>
 <div style={{marginTop:18,padding:18,borderRadius:15,border:'1px solid rgba(127,240,189,.28)',background:'rgba(127,240,189,.05)'}}><b style={{color:'#7ff0bd'}}>WHAT CHANGED?</b><p style={{margin:'8px 0 0',color:'#b7c9d5',lineHeight:1.6}}>The original September 1 question concerned governed record interoperability. The September 22 response clarified the operational division of responsibility: Airthings exposes environmental evidence; the consuming external system supplies decision logic, authorization rules, and execution. The TA-14 examination therefore moves from an abstract data-governance proposition to a specific consequence-governance seam.</p></div>
 <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:18}}><a href="https://developer-business.airthings.com/docs/introduction-1" target="_blank" rel="noreferrer" style={{color:'#9eeaff',fontWeight:900,textDecoration:'none'}}>Airthings Business API →</a><a href="https://developer-business.airthings.com/changelog/api-hourly-radon-added" target="_blank" rel="noreferrer" style={{color:'#9eeaff',fontWeight:900,textDecoration:'none'}}>Hourly radon API note →</a></div>
 </section>

 <section style={{margin:'22px 0',padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(113,231,255,.22)',borderRadius:26,background:'linear-gradient(135deg,rgba(6,25,38,.96),rgba(7,20,27,.94))'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#78e8ff'}}>THE PUBLIC AIRTHINGS PATHWAY · THE GOVERNANCE SEAM</div>
 <p style={{fontSize:'clamp(18px,2.2vw,25px)',lineHeight:1.55,maxWidth:1000,color:'#c1d3dc',margin:'12px 0 22px'}}>Airthings describes the organizational pathway as <b style={{color:'#eef7fb'}}>“monitor, take action, and measure the impact of those actions over time.”</b> The TA-14 question sits precisely at the transition from evidence to consequence.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10,alignItems:'stretch'}}>
 {[
  ['MONITOR','Environmental conditions become observable evidence.'],
  ['GOVERNANCE BOUNDARY','Is the proposed consequence admissible, authorized, and standing now?'],
  ['TAKE ACTION','Only an appropriately authorized human or operational system executes a permitted consequence.'],
  ['MEASURE IMPACT','The observed result becomes new evidence for the next bounded chain.'],
 ].map(([a,b],i)=><div key={a} style={{padding:20,borderRadius:16,border:i===1?'1px solid rgba(127,240,189,.55)':'1px solid rgba(113,231,255,.16)',background:i===1?'rgba(127,240,189,.08)':'rgba(2,9,15,.52)',boxShadow:i===1?'0 0 40px rgba(127,240,189,.08)':'none'}}><b style={{color:i===1?'#7ff0bd':'#9eeaff',fontSize:i===1?16:14}}>{a}</b><p style={{fontSize:13,lineHeight:1.5,color:'#9fb3bf',margin:'8px 0 0'}}>{b}</p></div>)}
 </div>
 <p style={{fontSize:12,lineHeight:1.55,color:'#7f96a3',margin:'16px 0 0'}}>Quoted pathway attributed to Airthings’ September 21, 2026 public Space Radon announcement. TA-14’s governance-boundary framing is an independent examination and is not Airthings language.</p>
 </section>

 <section style={{padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(113,231,255,.16)',borderRadius:26,background:'rgba(4,13,22,.9)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#78e8ff'}}>THE CONSEQUENCE PATH</div>
 <h2 style={{fontSize:'clamp(29px,4.6vw,52px)',letterSpacing:'-.04em',margin:'10px 0 20px'}}>Detect → Record → Validate → Propose → Authority → Standing → Commit → Execute → Verify</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10}}>
 {[
 ['DETECT','A sustained radon condition is observed.'],
 ['RECORD','AIR can preserve attributable environmental chronology without diagnosing or controlling.'],
 ['VALIDATE','Identity, timing, continuity, provenance and relevant context are examined.'],
 ['PROPOSE','A specific consequence is stated rather than inferred from the signal.'],
 ['AUTHORITY','The person, policy or system empowered to approve that consequence is identified.'],
 ['STANDING','Authority and evidence must apply to this place, condition, scope and time.'],
 ['COMMIT','The bounded determination is attached before execution.'],
 ['EXECUTE','The authorized operational system performs any permitted action.'],
 ['VERIFY','Observed outcome becomes new evidence; changed conditions require revalidation.'],
 ].map(([a,b],i)=><div key={a} style={{padding:17,borderRadius:14,border:'1px solid rgba(113,231,255,.13)',background:i>=4&&i<=6?'rgba(127,240,189,.05)':'rgba(2,9,15,.52)'}}><b style={{color:i>=4&&i<=6?'#7ff0bd':'#eef7fb'}}>{a}</b><p style={{fontSize:13,lineHeight:1.5,color:'#91a8b7',margin:'7px 0 0'}}>{b}</p></div>)}
 </div>
 </section>

 <section style={{marginTop:22,padding:'clamp(26px,4vw,44px)',border:`1px solid ${accent}55`,borderRadius:26,background:'linear-gradient(135deg,rgba(15,56,49,.24),rgba(4,14,23,.95))'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#7ff0bd'}}>RUN ONE · SUSTAINED RADON CONDITION</div>
 <h2 style={{fontSize:'clamp(29px,4.6vw,52px)',letterSpacing:'-.04em',margin:'10px 0 8px'}}>Choose the proposed consequence.</h2>
 <p style={{color:'#9fb3bf',lineHeight:1.6}}>This is a governance demonstration, not a radon treatment recommendation. No numeric intervention threshold is asserted here.</p>
 <div style={{display:'flex',gap:9,flexWrap:'wrap',margin:'20px 0'}}>{consequences.map(([a,b])=><button key={a} onClick={()=>{setChoice(a);setPhase('DETECTED')}} style={{cursor:'pointer',padding:'11px 16px',borderRadius:999,border:`1px solid ${choice===a?'#7ff0bd':'#536c79'}`,background:choice===a?'rgba(127,240,189,.09)':'transparent',color:choice===a?'#7ff0bd':'#9ab0bc',fontWeight:950}}>{a}</button>)}</div>

 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:14}}>
 <div style={{padding:22,borderRadius:18,border:'1px solid rgba(127,240,189,.24)',background:'rgba(1,8,13,.68)',textAlign:'center'}}>
 <div style={{fontSize:11,color:'#9ab0bc',fontWeight:900,letterSpacing:'.12em'}}>TA-14 CONSEQUENCE BOUNDARY</div>
 <div style={{fontSize:'clamp(21px,3vw,34px)',fontWeight:950,margin:'14px 0'}}>Does this specific proposed consequence have <span style={{color:'#eef7fb'}}>sufficient admissibility, authority, and standing</span> to become reality <span style={{color:'#7ff0bd'}}>NOW?</span></div>
 <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap',marginTop:18}}>
 <button onClick={()=>setPhase('VALIDATED')} style={{cursor:'pointer',padding:'10px 14px',borderRadius:999,border:'1px solid #6fdfff',background:'rgba(111,223,255,.08)',color:'#9eeaff',fontWeight:950}}>VALIDATE EVIDENCE</button>
 <button disabled={phase==='DETECTED'} onClick={()=>setPhase('ALLOW')} style={{cursor:phase==='DETECTED'?'not-allowed':'pointer',opacity:phase==='DETECTED'?.38:1,padding:'10px 14px',borderRadius:999,border:'1px solid #7ff0bd',background:'rgba(127,240,189,.08)',color:'#7ff0bd',fontWeight:950}}>ALLOW</button>
 <button disabled={phase==='DETECTED'} onClick={()=>setPhase('HOLD')} style={{cursor:phase==='DETECTED'?'not-allowed':'pointer',opacity:phase==='DETECTED'?.38:1,padding:'10px 14px',borderRadius:999,border:'1px solid #f2bf6a',background:'rgba(242,191,106,.08)',color:'#f2bf6a',fontWeight:950}}>HOLD</button>
 <button disabled={phase==='DETECTED'} onClick={()=>setPhase('DENY')} style={{cursor:phase==='DETECTED'?'not-allowed':'pointer',opacity:phase==='DETECTED'?.38:1,padding:'10px 14px',borderRadius:999,border:'1px solid #ff7d8c',background:'rgba(255,125,140,.07)',color:'#ff7d8c',fontWeight:950}}>DENY</button>
 <button disabled={phase==='DETECTED'} onClick={()=>setPhase('ESCALATE')} style={{cursor:phase==='DETECTED'?'not-allowed':'pointer',opacity:phase==='DETECTED'?.38:1,padding:'10px 14px',borderRadius:999,border:'1px solid #c5a8ff',background:'rgba(197,168,255,.07)',color:'#c5a8ff',fontWeight:950}}>ESCALATE</button>
 </div>
 </div>

 <div style={{padding:22,borderRadius:18,border:`1px solid ${accent}66`,background:'rgba(1,8,13,.72)'}}>
 <div style={{fontSize:11,color:'#9ab0bc',fontWeight:900,letterSpacing:'.12em'}}>GOVERNED STATE</div>
 <div style={{marginTop:14,fontSize:12,color:'#879eac'}}>ENVIRONMENTAL CONDITION</div><div style={{fontWeight:900}}>SUSTAINED RADON CONDITION</div>
 <div style={{marginTop:14,fontSize:12,color:'#879eac'}}>PROPOSED CONSEQUENCE</div><div style={{fontWeight:900}}>{proposed}</div>
 <div style={{marginTop:14,fontSize:12,color:'#879eac'}}>DETERMINATION</div><div style={{fontSize:'clamp(24px,3vw,38px)',fontWeight:1000,color:accent}}>{determination}</div>
 <div style={{marginTop:14,fontSize:12,color:'#879eac'}}>EXECUTION</div><div style={{fontWeight:900}}>{phase==='VERIFIED'?'EXTERNALLY EXECUTED + OUTCOME OBSERVED':'NOT EXECUTED'}</div>
 <p style={{fontSize:13,lineHeight:1.55,color:'#a9bbc4'}}>{phase==='DETECTED'?'The sensor establishes a condition to examine, not permission to act.':phase==='VALIDATED'?'The evidence may be admissible while intervention authority or current standing remains unresolved.':phase==='ALLOW'?'ALLOW is a bounded governance determination; TA-14 does not perform the physical intervention.':phase==='HOLD'?'HOLD preserves the record while an unresolved condition prevents execution.':phase==='DENY'?'DENY represents a bounded finding that the proposed consequence is not authorized under the examined state.':phase==='ESCALATE'?'ESCALATE routes the unresolved consequential decision to an appropriate authority rather than silently treating uncertainty as permission.':'The observed post-action condition becomes the next record; a changed condition begins a new validation chain.'}</p>
 {phase==='ALLOW'&&<button onClick={()=>setPhase('VERIFIED')} style={{cursor:'pointer',padding:'10px 16px',borderRadius:999,border:'1px solid #7ff0bd',background:'rgba(127,240,189,.11)',color:'#7ff0bd',fontWeight:950}}>SIMULATE EXTERNAL EXECUTION + VERIFY</button>}
 </div>
 </div>
 </section>

 <section style={{marginTop:22,padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(113,231,255,.16)',borderRadius:26,background:'rgba(4,13,22,.9)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#78e8ff'}}>WHERE THE SYSTEMS MEET</div>
 <h2 style={{fontSize:'clamp(27px,4vw,46px)',letterSpacing:'-.035em',margin:'10px 0 18px'}}>Sensing, evidence preservation, governance and execution remain distinct.</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(245px,1fr))',gap:12}}>
 {[
 ['AIRTHINGS / ENVIRONMENTAL EVIDENCE LAYER','Measures environmental conditions and exposes sensor data, historical trends, live readings and API-accessible time-series data. Airthings for Business explicitly placed decision logic, authorization rules and action execution outside this layer in the consuming external system.'],
 ['AIR / RECORD LAYER','Preserves attributable atmospheric and mechanical chronology. AIR does not diagnose, optimize, or control.'],
 ['TA-14 GOVERNANCE LAYER','Examines whether the bounded proposed consequence has sufficient admissibility, authority, and standing now.'],
 ['OPERATIONAL EXECUTION','Any investigation, building-control change, occupancy decision, or remediation remains with the appropriately authorized human or operational system.'],
 ].map(([a,b])=><div key={a} style={{padding:20,borderRadius:16,border:'1px solid rgba(113,231,255,.15)',background:'rgba(3,10,17,.58)'}}><b style={{color:a.includes('TA-14')?'#7ff0bd':'#9eeaff'}}>{a}</b><p style={{color:'#94aab6',lineHeight:1.55}}>{b}</p></div>)}
 </div>
 </section>

 <section style={{marginTop:22,padding:'clamp(26px,4vw,40px)',borderRadius:24,border:'1px solid rgba(127,240,189,.2)',background:'linear-gradient(135deg,rgba(12,52,43,.28),rgba(4,14,23,.92))'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#7ff0bd'}}>TECHNICAL QUESTION FOR AIRTHINGS</div>
 <h2 style={{fontSize:'clamp(26px,4vw,44px)',letterSpacing:'-.035em',margin:'10px 0 12px'}}>Where, in the real Space Radon pathway, does evidence become an authorized consequence?</h2>
 <p style={{color:'#a9bbc4',lineHeight:1.65,maxWidth:960,margin:0}}>A bounded examination could use the states and evidence Airthings actually exposes, preserve the resulting environmental chronology, identify the exact proposed consequence, and test where authority and standing are established without asking TA-14 to replace sensing, analytics, cloud services, operators, controls, or remediation expertise.</p>
 </section>

 <section style={{marginTop:22,padding:'28px',borderRadius:24,border:'1px solid rgba(242,191,106,.18)',background:'rgba(45,33,10,.22)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#f2bf6a'}}>INDEPENDENCE + PROVENANCE NOTICE</div>
 <p style={{color:'#b8b2a2',lineHeight:1.6,marginBottom:8}}>This is an independent TA-14 technical discussion surface based on Airthings' September 21, 2026 public announcement of Space Radon and a September 22, 2026 technical response from Airthings for Business. The response clarified the platform boundary; it did not sponsor, approve, certify, or endorse this TA-14 examination. No partnership, integration, certification, affiliation, or transfer of authority is asserted.</p>
 <p style={{color:'#8f8a7e',lineHeight:1.55,fontSize:13,marginBottom:0}}>Product characteristics referenced here are limited to Airthings public materials and the September 22 Airthings for Business response: continuous radon monitoring; CO₂, humidity, temperature, pressure and light measurements; cloud connectivity through the Airthings Space Hub / SmartLink; live readings and historical trends exposed through the platform; API-accessible time-series data; and the hourly radon API value identified by Airthings. The simulated governance states and proposed consequences are TA-14 examples and are not Airthings recommendations. The Airthings response was composed by Airbot, Airthings for Business&apos;s AI agent.</p>
 </section>
 </div></main>
}