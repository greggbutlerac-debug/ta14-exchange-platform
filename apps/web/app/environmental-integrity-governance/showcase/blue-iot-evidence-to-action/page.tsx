'use client';

import Link from 'next/link';
import { useState } from 'react';

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

 <section style={{margin:'22px 0',padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(127,240,189,.22)',borderRadius:26,background:'rgba(5,18,27,.88)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#7ff0bd'}}>THE PRACTICAL PATHWAY</div>
 <h2 style={{fontSize:'clamp(29px,4.6vw,52px)',letterSpacing:'-.04em',margin:'10px 0 8px'}}>Sense it. Validate it. Govern the consequence. Verify the outcome.</h2>
 <div style={{display:'grid',gap:9,marginTop:24}}>{steps.map(([n,a,b,c],i)=><div key={n} style={{display:'grid',gridTemplateColumns:'48px minmax(150px,210px) minmax(180px,280px) 1fr',gap:14,alignItems:'center',padding:'15px 16px',borderRadius:14,border:'1px solid rgba(113,231,255,.13)',background:i===4?'rgba(127,240,189,.055)':'rgba(2,9,15,.52)'}}><span style={{fontWeight:950,color:i===4?'#7ff0bd':'#526e7e'}}>{n}</span><b style={{color:i===4?'#7ff0bd':'#eef7fb'}}>{a}</b><span style={{fontWeight:800,color:'#c5d7df'}}>{b}</span><span style={{fontSize:13,lineHeight:1.48,color:'#91a8b7'}}>{c}</span></div>)}</div>
 </section>

 <section style={{padding:'clamp(26px,4vw,44px)',border:`1px solid ${accent}55`,borderRadius:26,background:'linear-gradient(135deg,rgba(15,56,49,.24),rgba(4,14,23,.95))'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#7ff0bd'}}>RUN ONE · SUSTAINED CO₂ EVENT</div>
 <h2 style={{fontSize:'clamp(29px,4.6vw,52px)',letterSpacing:'-.04em',margin:'10px 0 20px'}}>Classroom 214 · proposed ventilation increase</h2>
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
 <div style={{marginTop:14,fontSize:12,color:'#879eac'}}>EXECUTION STATE</div><div style={{fontWeight:900}}>{phase==='VERIFIED'?'EXECUTED BY AUTHORIZED SYSTEM':'NOT EXECUTED'}</div>
 <p style={{fontSize:13,lineHeight:1.55,color:'#a9bbc4'}}>{phase==='DETECTED'?'Detection establishes a condition to examine. It does not itself establish intervention authority.':phase==='VALIDATED'?'Evidence has been validated, but admissible evidence is still not the same thing as authority to intervene.':phase==='ALLOW'?'ALLOW is a bounded governance determination. The authorized BMS / HVAC system still retains execution control.':phase==='HOLD'?'HOLD preserves the environmental evidence while preventing the proposed consequence from being treated as authorized under an unresolved authority or standing condition.':'The post-action environmental state becomes the next evidence record.'}</p>
 {phase==='ALLOW'&&<button onClick={()=>setPhase('VERIFIED')} style={{cursor:'pointer',padding:'10px 16px',borderRadius:999,border:'1px solid #7ff0bd',background:'rgba(127,240,189,.11)',color:'#7ff0bd',fontWeight:950}}>EXECUTE EXTERNALLY + VERIFY OUTCOME</button>}
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