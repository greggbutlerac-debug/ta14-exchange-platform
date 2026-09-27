'use client';
import {useMemo,useState} from 'react';

const consequences=[
 {name:'Inform',burden:1,desc:'Show the signal with provenance and uncertainty.'},
 {name:'Inspect',burden:2,desc:'Recommend qualified investigation or confirmatory testing.'},
 {name:'Sample',burden:3,desc:'Collect organism-specific or material evidence.'},
 {name:'Notify',burden:3,desc:'Notify a responsible party of a governed environmental concern.'},
 {name:'Remediate',burden:5,desc:'Change building materials, systems or operations.'},
 {name:'Robot remediation',burden:6,desc:'Permit an automated system to physically change the building.'}
];
const signals=[
 {name:'Moldmap report',quality:1,desc:'Experience/location record; not proof of a building condition.'},
 {name:'Aerlume signal',quality:2,desc:'Sensor observation; validation, identity and operating context remain material.'},
 {name:'Visual observation',quality:2,desc:'Observed condition that may justify investigation, not automatic organism identification.'},
 {name:'Corroborated record',quality:4,desc:'Multiple attributable observations support a stronger proposition.'}
];

export default function InvivusExperience(){
 const[moisture,setMoisture]=useState(2),[duration,setDuration]=useState(2),[material,setMaterial]=useState(2);
 const[signal,setSignal]=useState(0),[provenance,setProvenance]=useState(false),[continuity,setContinuity]=useState(false),[validated,setValidated]=useState(false);
 const[action,setAction]=useState(1),[authority,setAuthority]=useState(false),[standing,setStanding]=useState(false),[binding,setBinding]=useState(false);
 const[executed,setExecuted]=useState(false),[verified,setVerified]=useState(false);
 const risk=moisture+duration+material;
 const conditionState=risk<=2?'LOW':risk<=5?'ELEVATED':'PERSISTENT';
 const evidence=signals[signal].quality+[provenance,continuity,validated].filter(Boolean).length;
 const burden=consequences[action].burden;
 const missing=useMemo(()=>{const m:string[]=[];if(evidence<burden)m.push('evidence appropriate to this consequence');if(!authority)m.push('Applicable Authority');if(!standing)m.push('Established Standing');if(burden>=4&&!binding)m.push('exact execution binding');return m},[evidence,burden,authority,standing,binding]);
 const determination=missing.length===0?'ALLOW': burden>=5?'HOLD':'HOLD → ESCALATE';
 const canExecute=determination==='ALLOW';
 function reset(){setMoisture(2);setDuration(2);setMaterial(2);setSignal(0);setProvenance(false);setContinuity(false);setValidated(false);setAction(1);setAuthority(false);setStanding(false);setBinding(false);setExecuted(false);setVerified(false)}
 return <section className="ix">
  <p className="ey">04 · INTERACTIVE ENVIRONMENT → CONSEQUENCE EXAM</p>
  <h2>Build the condition. Propose the action.<br/><em>Try to cross the boundary.</em></h2>
  <p className="intro">This is a teaching simulation, not a mold diagnosis or an evaluation of an actual Invivus product. Change the inputs and watch the evidentiary and execution burden move.</p>

  <div className="steps">
   <article><small>1 · MOLD RISK ENVELOPE</small><h3>Build the environmental condition</h3>
    <label>Moisture persistence <b>{moisture}/3</b><input aria-label="Moisture persistence" type="range" min="0" max="3" value={moisture} onChange={e=>setMoisture(+e.target.value)}/></label>
    <label>Duration / recurrence <b>{duration}/3</b><input aria-label="Duration and recurrence" type="range" min="0" max="3" value={duration} onChange={e=>setDuration(+e.target.value)}/></label>
    <label>Material vulnerability <b>{material}/3</b><input aria-label="Material vulnerability" type="range" min="0" max="3" value={material} onChange={e=>setMaterial(+e.target.value)}/></label>
    <div className="state"><b>Environmental condition teaching state</b><strong>{conditionState}</strong></div><p>This describes the modeled persistence of mold-favorable environmental conditions only. It is not a scientific threshold and does not establish contamination.</p>
   </article>

   <article><small>2 · SIGNAL + RECORD</small><h3>What was actually observed?</h3>
    <select aria-label="Observed signal" value={signal} onChange={e=>setSignal(+e.target.value)}>{signals.map((s,i)=><option value={i} key={s.name}>{s.name}</option>)}</select>
    <p>{signals[signal].desc}</p>
    <Check label="Identity / provenance established" value={provenance} set={setProvenance}/>
    <Check label="Continuity / time context established" value={continuity} set={setContinuity}/>
    <Check label="Validation / fitness for proposition established" value={validated} set={setValidated}/>
    <p className="score">Evidence teaching strength: <b>{evidence}/7</b></p>
   </article>

   <article><small>3 · PROPOSED CONSEQUENCE</small><h3>What do you want reality to do?</h3>
    <select aria-label="Proposed consequence" value={action} onChange={e=>{setAction(+e.target.value);setExecuted(false);setVerified(false)}}>{consequences.map((c,i)=><option value={i} key={c.name}>{c.name}</option>)}</select>
    <p><b>{consequences[action].name}</b> — {consequences[action].desc}</p>
    <div className="burden">Consequence burden <b>{burden}/6</b></div>
    <Check label="Applicable Authority established" value={authority} set={setAuthority}/>
    <Check label="Established Standing established" value={standing} set={setStanding}/>
    <Check label="Exact object / scope / time binding established" value={binding} set={setBinding}/>
   </article>
  </div>

  <div className={`gate ${canExecute?'allow':'hold'}`}>
   <div><small>4 · TA-14 EXECUTION GATE</small><strong>{determination}</strong><p>{canExecute?'The teaching inputs establish the modeled boundary for this proposed consequence. Authorization still applies only to the exact modeled object, scope and time.':<>Execution remains blocked. Missing: <b>{missing.join(' · ')}</b>.</>}</p></div>
   <button disabled={!canExecute||executed} onClick={()=>setExecuted(true)}>{executed?'EXECUTED':'EXECUTE CONSEQUENCE'}</button>
  </div>

  {action===5&&!canExecute&&<div className="robot"><b>ROBOT BLOCKED</b><span>The system may be capable of acting. Capability ≠ Authority. Physical execution stays locked until the consequence boundary is established.</span></div>}

  <div className="outcome">
   <small>5 · BEFORE → EXECUTION → AFTER</small>
   <div className="timeline"><b>BEFORE<br/><span>Condition: {conditionState}</span></b><i>→</i><b className={executed?'live':''}>EXECUTION<br/><span>{executed?consequences[action].name:'Locked'}</span></b><i>→</i><b className={verified?'live':''}>AFTER<br/><span>{verified?'New evidence preserved':'Not verified'}</span></b></div>
   {executed&&!verified&&<button onClick={()=>setVerified(true)}>VERIFY OUTCOME</button>}
   {verified&&<p className="success"><b>Outcome recorded.</b> ALLOW authorized execution; it did not guarantee success. The post-execution observation becomes evidence for the new baseline and any next consequence.</p>}
  </div>
  <button className="reset" onClick={reset}>RESET EXAMINATION</button>
  <p className="notice">Teaching model only. Condition states and evidence/consequence indicators are explanatory interface devices, not scientific mold thresholds, product validation, legal determinations, or TA-14 certification.</p>
  <style jsx>{`
.ix{padding:72px 0;border-top:1px solid #ffffff12}.ey,.ix small{color:#72dcff;font-size:9px;font-weight:950;letter-spacing:.16em}.ix h2{max-width:1050px;margin:9px 0 14px;font:clamp(38px,5vw,66px) Georgia,serif;line-height:1.02}.ix h2 em{font-style:normal;color:#79e6bb}.intro{max-width:850px;color:#8ea5ae;line-height:1.7}.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:30px}.steps article{padding:22px;border:1px solid #ffffff16;border-radius:15px;background:#051219}.steps h3{font:24px Georgia,serif;margin:10px 0 18px}.steps p{font-size:11px;color:#91a8b1;line-height:1.6}.steps label{display:block;font-size:10px;color:#b6c8cf;margin:13px 0}.steps label b{float:right}.steps input[type=range]{display:block;width:100%;margin-top:8px}.steps select{width:100%;background:#071a23;color:#e6f6fa;border:1px solid #ffffff20;border-radius:8px;padding:12px;font-size:11px}.check{display:flex!important;gap:9px;align-items:center}.check b{float:none!important}.state{margin-top:16px;padding:12px;border:1px solid #efc66a44;border-radius:9px}.state b{display:block;color:#9eb2ba;font-size:9px}.state strong{display:block;color:#efc66a;font:24px Georgia,serif;margin-top:5px}.score,.burden{margin-top:16px!important;padding:10px;border:1px solid #ffffff12;border-radius:8px}.gate{margin-top:12px;padding:24px;border:1px solid;border-radius:15px;display:flex;justify-content:space-between;gap:20px;align-items:center}.gate strong{display:block;font:34px Georgia,serif;margin:8px 0}.gate p{margin:0;color:#a9bec5;font-size:11px}.gate.hold{border-color:#efc66a55;background:#2a200a33}.gate.hold strong{color:#efc66a}.gate.allow{border-color:#79e6bb66;background:#0d2b2238}.gate.allow strong{color:#79e6bb}.gate button,.outcome button,.reset{padding:13px 16px;border:1px solid #79e6bb66;border-radius:9px;background:#102c25;color:#eafff8;font-size:9px;font-weight:950;cursor:pointer}.gate button:disabled{opacity:.35;cursor:not-allowed}.robot{margin-top:10px;padding:18px;border:1px solid #efc66a55;border-radius:12px;display:flex;gap:16px;color:#efc66a}.robot span{color:#b7a97e;font-size:11px}.outcome{margin-top:12px;padding:24px;border:1px solid #ffffff16;border-radius:15px}.timeline{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:10px;margin:18px 0}.timeline b{padding:16px;border:1px solid #ffffff12;border-radius:10px;font-size:10px}.timeline b span{color:#78909a;font-weight:500}.timeline b.live{border-color:#79e6bb66;color:#79e6bb}.success{font-size:11px;color:#9fc7b7}.reset{margin-top:12px;background:transparent;border-color:#ffffff20;color:#91a8b1}.notice{color:#687f89;font-size:9px;margin-top:14px}@media(max-width:900px){.steps{grid-template-columns:1fr}.gate{align-items:flex-start;flex-direction:column}}@media(max-width:560px){.timeline{grid-template-columns:1fr}.timeline i{text-align:center;transform:rotate(90deg)}}
  `}</style>
 </section>
}
function Check({label,value,set}:{label:string,value:boolean,set:(v:boolean)=>void}){return <label className="check"><input type="checkbox" checked={value} onChange={e=>set(e.target.checked)}/><b>{label}</b></label>}
