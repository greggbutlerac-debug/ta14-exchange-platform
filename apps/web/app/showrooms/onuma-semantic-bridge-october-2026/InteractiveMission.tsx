'use client';
import {useState} from 'react';

const stages=[
 {name:'01 · CONNECTED BUILDING',title:'The building is represented',desc:'A semantic model connects spaces, floors, sensors, equipment, and work orders. That relationship provides context—not proof of current field conditions.',signal:'REPRESENTED',detail:'The graph can identify the floor and associated systems, but an asset link does not establish the actual fault.'},
 {name:'02 · OBSERVATION',title:'An overheating-floor report arrives',desc:'A reported floor-temperature anomaly is associated with a modeled space. Before any intervention, the source, timestamp, calibration, and continuity must be examined.',signal:'EVIDENCE NEEDED',detail:'A complaint, modeled relationship, or dashboard alert is not automatically admissible evidence of a specific cause.'},
 {name:'03 · PROPOSED ACTION',title:'An operator proposes intervention',desc:'The system can help find a likely asset and suggest a work order. The proposed physical action now needs a separate authority examination.',signal:'ACTION PROPOSED',detail:'Finding the relevant equipment is not the same as permission to change its state.'},
 {name:'04 · AUTHORITY GATE',title:'Can the consequence become reality NOW?',desc:'TA14 examines Admissible Evidence, Applicable Authority, and Established Standing for this specific actor, action, asset, location, and moment.',signal:'EXAMINE',detail:'Capability ≠ Authority. The authority to execute must be established locally.'},
 {name:'05 · DISPOSITION',title:'A bounded outcome, not a blanket approval',desc:'A non-invasive investigation may be supported while physical adjustment remains on HOLD until identity, conditions, standing, and authorization are established.',signal:'HOLD / INVESTIGATE',detail:'The example illustrates a conditional decision, not a real ruling on an ONUMA system.'},
 {name:'06 · ACCOUNTABILITY',title:'Record what actually happened',desc:'If a later intervention is authorized, preserve the authority basis, evidence chain, execution record, and observed result separately.',signal:'RECORD OUTCOME',detail:'The graph can carry context. It does not substitute for a locally established execution authority.'}
];
const colors={teal:'#7de8df',gold:'#f5c979',ink:'#071522'};
export default function InteractiveMission(){
 const [step,setStep]=useState(0);
 const [evidence,setEvidence]=useState(false);
 const [authority,setAuthority]=useState(false);
 const [standing,setStanding]=useState(false);
 const [showDecision,setShowDecision]=useState(false);
 const all=evidence&&authority&&standing;
 const button=(selected:boolean)=>({border:selected?'1px solid #76e8dd':'1px solid #426379',background:selected?'#123c46':'#0c2537',color:'#eaf7ff',borderRadius:12,padding:'14px 16px',cursor:'pointer',textAlign:'left' as const,fontWeight:700});
 return <section style={{background:'linear-gradient(150deg,#0b2d40,#071827)',border:'1px solid #347587',borderRadius:24,padding:'clamp(20px,4vw,40px)',marginBottom:28}}>
 <p style={{fontSize:12,fontWeight:900,letterSpacing:2,color:colors.gold}}>INTERACTIVE TEACHING MISSION · ORIGINAL TA14 SIMULATION</p>
 <h2 style={{fontSize:'clamp(28px,4vw,43px)',margin:'12px 0'}}>Follow the overheating-floor decision</h2>
 <p style={{color:'#c6dbe6',lineHeight:1.75}}>Explore a hypothetical building case inspired by the session's discussion. These original illustrations and outcomes are educational, not footage or evidence of an ONUMA–TA14 integration.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',gap:22,marginTop:26}}>
 <div style={{background:'#061725',border:'1px solid #31566c',borderRadius:18,padding:15}}>
 <svg viewBox="0 0 500 360" role="img" aria-label="Original conceptual illustration of a multistory building with semantic graph nodes, an overheating floor, and an execution gate" style={{width:'100%',height:'auto'}}>
 <defs><linearGradient id="missionGlass" x1="0" x2="1"><stop stopColor="#133d51"/><stop offset="1" stopColor="#0a2237"/></linearGradient></defs>
 <rect width="500" height="360" rx="15" fill="#071b2a"/>
 <g opacity=".35" stroke="#3ca9bd" strokeWidth="1">{Array.from({length:13},(_,i)=><line key={i} x1={0} y1={i*28} x2="500" y2={i*28}/>)}</g>
 <path d="M80 295V94L238 28L356 93V295Z" fill="url(#missionGlass)" stroke="#8ddde2" strokeWidth="3"/>
 <path d="M80 94L238 150L356 93M238 150V295M80 162H356M80 228H356" fill="none" stroke="#6acbd4" strokeWidth="2"/>
 {Array.from({length:4},(_,i)=><g key={i} fill="#2a5b70" stroke="#69a5ba"><rect x={102+i*31} y="109" width="22" height="32"/><rect x={102+i*31} y="177" width="22" height="32"/><rect x={102+i*31} y="243" width="22" height="32"/></g>)}
 <rect x="81" y="164" width="273" height="62" fill={step>=1?'#9a542e':'#17465a'} opacity=".75"/>
 <path d="M81 164H354M81 226H354" stroke={step>=1?'#ffc06e':'#61d0dc'} strokeWidth="3"/>
 <g stroke="#75e8de" strokeWidth="2" fill="none"><path d="M355 122L421 71M355 196L438 185M355 265L420 304"/></g>
 {[[421,71],[438,185],[420,304]].map((p,i)=><g key={i}><circle cx={p[0]} cy={p[1]} r="20" fill={i===1&&step>=1?'#7c4a23':'#164658'} stroke={i===1&&step>=1?'#f4bd72':'#7ce6df'} strokeWidth="3"/><circle cx={p[0]} cy={p[1]} r="5" fill="#e8fbfc"/></g>)}
 <text x="92" y="327" fill="#d7f3f4" fontSize="15" fontWeight="700">SEMANTIC BUILDING CONTEXT</text>
 <text x="90" y="347" fill="#9ebfcf" fontSize="12">{step>=1?'FLOOR REPORT · CAUSE NOT VERIFIED':'ASSETS · FLOORS · RELATIONSHIPS'}</text>
 </svg>
 <div style={{padding:'10px 6px',display:'flex',justifyContent:'space-between',gap:8,alignItems:'center'}}><span style={{fontSize:12,color:'#9ebac8'}}>ILLUSTRATIVE DIGITAL BUILDING</span><strong style={{fontSize:12,color:colors.gold}}>{stages[step].signal}</strong></div>
 </div>
 <div>
 <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:22}}>{stages.map((s,i)=><button key={i} type="button" aria-label={'Show stage '+(i+1)} aria-pressed={step===i} onClick={()=>{setStep(i);setShowDecision(false)}} style={{padding:'10px 14px',borderRadius:9,cursor:'pointer',fontWeight:800,color:step===i?colors.ink:'#c0d9e5',background:step===i?colors.teal:'#143246',border:'1px solid #406679'}}>{i+1}</button>)}</div>
 <p style={{fontSize:12,letterSpacing:1.5,fontWeight:800,color:colors.gold}}>{stages[step].name}</p>
 <h3 style={{fontSize:26,lineHeight:1.2,margin:'12px 0'}}>{stages[step].title}</h3>
 <p style={{color:'#d3e7ed',lineHeight:1.8}}>{stages[step].desc}</p>
 <p style={{color:'#9edfdc',lineHeight:1.7,borderLeft:'3px solid #75dcd4',paddingLeft:14}}>{stages[step].detail}</p>
 <div style={{display:'flex',gap:10,marginTop:22,flexWrap:'wrap'}}>
 <button type="button" disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))} style={{padding:'12px 20px',borderRadius:10,border:'1px solid #63869a',background:'#102b3d',color:'#fff',opacity:step===0?.4:1,cursor:'pointer'}}>← Previous</button>
 <button type="button" onClick={()=>setStep(s=>(s+1)%stages.length)} style={{padding:'12px 20px',borderRadius:10,border:0,background:colors.teal,color:colors.ink,fontWeight:900,cursor:'pointer'}}>{step===5?'Replay mission ↺':'Next consequence →'}</button>
 </div>
 </div>
 </div>
 <div style={{marginTop:32,borderTop:'1px solid #36576c',paddingTop:24}}>
 <h3 style={{fontSize:26,margin:'0 0 12px'}}>Try the authority examination</h3>
 <p style={{color:'#bfd4e1',lineHeight:1.7}}>Select which conditions have actually been established for a proposed physical adjustment. The simulation cannot issue a real ALLOW disposition: the toggles are declarations, not admissible records.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginTop:18}}>
 <button type="button" aria-pressed={evidence} onClick={()=>{setEvidence(!evidence);setShowDecision(false)}} style={button(evidence)}>{evidence?'✓':'○'} Admissible Evidence</button>
 <button type="button" aria-pressed={authority} onClick={()=>{setAuthority(!authority);setShowDecision(false)}} style={button(authority)}>{authority?'✓':'○'} Applicable Authority</button>
 <button type="button" aria-pressed={standing} onClick={()=>{setStanding(!standing);setShowDecision(false)}} style={button(standing)}>{standing?'✓':'○'} Established Standing</button>
 </div>
 <button type="button" onClick={()=>setShowDecision(true)} style={{marginTop:18,padding:'14px 20px',borderRadius:10,background:colors.gold,color:colors.ink,border:0,fontWeight:900,cursor:'pointer'}}>EXAMINE PROPOSED CONSEQUENCE →</button>
 {showDecision&&<div role="status" aria-live="polite" style={{marginTop:18,padding:22,border:'1px solid #d5b474',borderRadius:12,background:'#28291f'}}>
 <strong style={{color:colors.gold,fontSize:20}}>{all?'HOLD · VALIDATION REQUIRED':'HOLD · INSUFFICIENT ESTABLISHMENT'}</strong>
 <p style={{lineHeight:1.7,color:'#e2e8e6',marginBottom:0}}>{all?'All three conditions were selected, but a checkbox cannot establish admissibility, authority, or standing. The underlying records and scope still require examination before any real-world authorization.':'At least one required condition has not been selected. Do not infer permission from a connected model, work order, or operational alert.'}</p>
 </div>}
 </div>
 </section>;
}
