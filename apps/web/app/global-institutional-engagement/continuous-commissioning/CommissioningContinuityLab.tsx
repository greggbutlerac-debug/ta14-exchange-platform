'use client';
import {useMemo,useState} from 'react';

const scenarios=[
  {id:'sensor',label:'SENSOR DRIFT',title:'A pressure sensor drifts after handoff',change:'The commissioned baseline remains preserved, but the live sensor is now outside its accepted calibration condition.',risk:'A control action based on the old assumption could be technically executable while evidentially stale.'},
  {id:'sequence',label:'SEQUENCE CHANGE',title:'The control sequence changes after acceptance',change:'A software revision changes how equipment stages under load. The original functional test no longer describes the exact operating path.',risk:'Historical verification cannot silently become proof of the revised sequence.'},
  {id:'utility',label:'CRITICAL UTILITY',title:'A semiconductor utility enters a degraded mode',change:'The system is still online, but a dependency state changed after the commissioned condition was established.',risk:'The action may remain inside normal authority while failing a present admissibility condition.'},
  {id:'correction',label:'CORRECTION',title:'A correction is made but never verified',change:'A technician changes the system and the immediate alarm clears, but no post-action evidence establishes that the environmental or process condition actually recovered.',risk:'Execution occurred. Outcome remains unproven.'}
];

export default function CommissioningContinuityLab(){
  const [active,setActive]=useState(0);
  const [continuity,setContinuity]=useState(true);
  const [reality,setReality]=useState(false);
  const [authority,setAuthority]=useState(true);
  const [binding,setBinding]=useState(false);
  const [correctionVerified,setCorrectionVerified]=useState(false);
  const [correctionHeld,setCorrectionHeld]=useState(false);
  const scenario=scenarios[active];

  const determination=useMemo(()=>{
    if(!authority)return {state:'DENY',copy:'The actor or route lacks present authority for the proposed consequence.'};
    if(!continuity||!reality||!binding)return {state:'HOLD',copy:'Execution does not proceed until continuity, present reality and exact action binding are established.'};
    if(active===3 && (!correctionVerified||!correctionHeld))return {state:'HOLD',copy:'The correction exists, but outcome standing is incomplete until the correction is verified and shown to hold.'};
    return {state:'ALLOW',copy:'The bounded action has present standing for this demonstration state. Outcome evidence is still required after execution.'};
  },[continuity,reality,authority,binding,active,correctionVerified,correctionHeld]);

  const reset=(i:number)=>{setActive(i);setContinuity(true);setReality(false);setAuthority(true);setBinding(false);setCorrectionVerified(false);setCorrectionHeld(false)};

  return <section className="lab">
    <style>{`
      .lab{padding:30px;border:1px solid #2a6475;border-radius:24px;background:linear-gradient(145deg,rgba(12,54,68,.6),rgba(3,12,18,.97));box-shadow:0 30px 80px rgba(0,0,0,.3)}.labTop small{color:#63e7b3;font-weight:950;letter-spacing:.15em}.labTop h2{font-size:clamp(30px,5vw,54px);line-height:1;margin:9px 0}.labTop p{color:#a9bdc8;line-height:1.7;max-width:900px}.scenarios{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:24px 0}.scenarios button{cursor:pointer;padding:14px;border:1px solid #2c4f5c;border-radius:10px;background:#07141c;color:#9bb0bb;font-weight:950;font-size:9px;letter-spacing:.08em}.scenarios button.on{border-color:#67dfff;background:#0b2a37;color:#fff}.case{display:grid;grid-template-columns:1.05fr .95fr;gap:16px}.panel{padding:22px;border:1px solid #2a4652;border-radius:15px;background:#030b10}.panel h3{font-size:24px;margin:0 0 10px}.panel p{color:#a9bdc8;line-height:1.65;font-size:13px}.change{padding:13px;border-left:3px solid #f0c35a;background:rgba(240,195,90,.07);color:#d9c78e;font-size:12px;line-height:1.6}.toggles{display:grid;gap:9px;margin-top:16px}.toggle{display:flex;justify-content:space-between;gap:14px;align-items:center;padding:13px;border:1px solid #274856;border-radius:10px}.toggle b{font-size:12px}.toggle small{display:block;color:#78939f;margin-top:4px}.toggle button{cursor:pointer;min-width:84px;padding:9px;border-radius:8px;border:1px solid #355d6e;background:#071821;color:#fff;font-weight:950}.toggle button.yes{border-color:#55e5ad;color:#55e5ad}.toggle button.no{border-color:#f0c35a;color:#f0c35a}.result{padding:24px;border-radius:15px;border:1px solid #31596a;background:#051018}.resultState{font-size:clamp(44px,7vw,76px);font-weight:1000;letter-spacing:-.05em}.ALLOW{color:#59e6ae}.HOLD{color:#f0c35a}.DENY{color:#ff7373}.result p{color:#b3c5ce;line-height:1.7}.route{margin-top:20px;display:grid;gap:8px}.route div{padding:10px;border:1px solid #263f49;border-radius:8px;color:#8399a4;font-size:10px;font-weight:900}.route .ok{border-color:#3f7c68;color:#62e6b3}.route .bad{border-color:#765f2e;color:#f0c35a}@media(max-width:900px){.case{grid-template-columns:1fr}.scenarios{grid-template-columns:1fr 1fr}}@media(max-width:560px){.scenarios{grid-template-columns:1fr}.toggle{align-items:flex-start;flex-direction:column}}
    `}</style>
    <div className="labTop"><small>INTERACTIVE CONTINUOUS COMMISSIONING LAB</small><h2>Change the building. Watch the standing change.</h2><p>Start with a commissioned condition, introduce an operational change, then re-establish what must be true before consequence can proceed.</p></div>
    <div className="scenarios">{scenarios.map((s,i)=><button key={s.id} className={i===active?'on':''} onClick={()=>reset(i)}>{s.label}</button>)}</div>
    <div className="case">
      <div className="panel">
        <h3>{scenario.title}</h3>
        <p>{scenario.change}</p>
        <div className="change"><b>WHY THIS MATTERS:</b> {scenario.risk}</div>
        <div className="toggles">
          <Gate title="Evidence continuity survives" note="The relevant record remains intact, attributable and current enough for review." value={continuity} set={setContinuity}/>
          <Gate title="Present reality re-established" note="The live condition has been checked after the change." value={reality} set={setReality}/>
          <Gate title="Authority remains valid" note="The actor or system still has authority for this bounded consequence." value={authority} set={setAuthority}/>
          <Gate title="Exact action is bound" note="The evidence and authority attach to this target, action, condition and moment." value={binding} set={setBinding}/>
          {active===3&&<><Gate title="Correction independently verified" note="Post-action evidence establishes that the intended condition actually recovered." value={correctionVerified} set={setCorrectionVerified}/><Gate title="Correction shown to hold" note="Follow-up evidence establishes that recovery persisted rather than merely clearing momentarily." value={correctionHeld} set={setCorrectionHeld}/></>}
        </div>
      </div>
      <div className="result">
        <small>TA-14 DEMONSTRATION DETERMINATION</small>
        <div className={'resultState '+determination.state}>{determination.state}</div>
        <p>{determination.copy}</p>
        <div className="route">
          <div className={continuity?'ok':'bad'}>CONTINUITY · {continuity?'ESTABLISHED':'NOT ESTABLISHED'}</div>
          <div className={reality?'ok':'bad'}>PRESENT REALITY · {reality?'ESTABLISHED':'NOT ESTABLISHED'}</div>
          <div className={authority?'ok':'bad'}>AUTHORITY · {authority?'STANDING':'NO STANDING'}</div>
          <div className={binding?'ok':'bad'}>BINDING · {binding?'EXACT':'NOT ESTABLISHED'}</div>
          {active===3&&<><div className={correctionVerified?'ok':'bad'}>CORRECTION · {correctionVerified?'VERIFIED':'NOT VERIFIED'}</div><div className={correctionHeld?'ok':'bad'}>PERSISTENCE · {correctionHeld?'HELD':'NOT ESTABLISHED'}</div></>}
        </div>
      </div>
    </div>
  </section>
}

function Gate({title,note,value,set}:{title:string;note:string;value:boolean;set:(v:boolean)=>void}){
  return <div className="toggle"><div><b>{title}</b><small>{note}</small></div><button className={value?'yes':'no'} onClick={()=>set(!value)}>{value?'YES':'NO'}</button></div>
}
