'use client';

import { useMemo, useState } from 'react';

type State = 'ESTABLISHED' | 'MISSING' | 'CHANGED';
type ScenarioKey = 'co2' | 'filtration' | 'occupancy';

const scenarios: Record<ScenarioKey,{label:string,signal:string,proposal:string,why:string}> = {
  co2:{label:'HIGH CO₂',signal:'A publicly displayed monitor shows CO₂ above the chosen operating target.',proposal:'Increase outdoor-air delivery or otherwise change building operation.',why:'The measurement can establish a condition. It does not, by itself, establish equipment capability, applicable authority, present occupancy constraints, or whether this exact intervention is permitted now.'},
  filtration:{label:'AIR CLEANING',signal:'A display or index indicates the space is using an air-cleaning strategy.',proposal:'Change filtration / air-cleaning operation in response to current conditions.',why:'Visibility can help occupants understand the space. The execution question is separate: which device, which setting, which operator, under what authority, with what evidence of resulting performance?'},
  occupancy:{label:'OCCUPANCY DECISION',signal:'Current indoor-air evidence suggests conditions have materially changed.',proposal:'Change room use, occupancy guidance, or another consequential operating state.',why:'A consequential occupancy decision can affect people and operations. TA-14 asks whether the evidence, authority and standing supporting that consequence remain sufficient now.'}
};

export default function SaferAirExperience(){
  const [scenario,setScenario]=useState<ScenarioKey>('co2');
  const [evidence,setEvidence]=useState<State>('ESTABLISHED');
  const [authority,setAuthority]=useState<State>('MISSING');
  const [standing,setStanding]=useState<State>('ESTABLISHED');
  const [binding,setBinding]=useState<State>('ESTABLISHED');

  const decision=useMemo(()=>{
    if([evidence,authority,standing,binding].includes('CHANGED')) return {state:'ESCALATE',copy:'A material condition changed. Revalidation is required before the proposal crosses the commit boundary.'};
    if(authority==='MISSING') return {state:'HOLD',copy:'The condition may be visible and the evidence may be strong, but Applicable Authority has not been established for this consequence.'};
    if(evidence==='MISSING'||standing==='MISSING'||binding==='MISSING') return {state:'HOLD',copy:'One or more required predicates remain unestablished. Preserve the record; do not silently convert uncertainty into execution.'};
    return {state:'ALLOW',copy:'For this constructed example only, the required predicates are established for the proposed consequence now. Execution still remains bounded to the exact authorized scope.'};
  },[evidence,authority,standing,binding]);

  const s=scenarios[scenario];
  const setters:{name:string,value:State,set:(v:State)=>void,copy:string}[]=[
    {name:'ADMISSIBLE EVIDENCE',value:evidence,set:setEvidence,copy:'Is the relevant record attributable, continuous, current and sufficient for this proposal?'},
    {name:'APPLICABLE AUTHORITY',value:authority,set:setAuthority,copy:'Who may authorize this exact consequence in this exact domain?'},
    {name:'ESTABLISHED STANDING',value:standing,set:setStanding,copy:'Do the actor, role, condition and scope still have standing now?'},
    {name:'EXACT BINDING',value:binding,set:setBinding,copy:'Is the proposal bound to the correct place, equipment, people, scope and time?'}
  ];

  return <section className="lab">
    <div className="labHead">
      <p className="eye">INTERACTIVE · CONSEQUENCE LAB</p>
      <h2>Make the invisible visible.<br/><em>Then test what happens next.</em></h2>
      <p>Nothing below evaluates Safer Air Project policy or any real building. It is a constructed governance demonstration showing why measurement, public visibility and consequence authorization are different layers.</p>
    </div>

    <div className="scenarioTabs">
      {(Object.keys(scenarios) as ScenarioKey[]).map(k=><button key={k} onClick={()=>setScenario(k)} className={scenario===k?'active':''}>{scenarios[k].label}</button>)}
    </div>

    <div className="scenarioCard">
      <div><small>VISIBLE CONDITION</small><strong>{s.signal}</strong></div>
      <span>→</span>
      <div><small>PROPOSED CONSEQUENCE</small><strong>{s.proposal}</strong></div>
    </div>
    <p className="why">{s.why}</p>

    <div className="tests">
      {setters.map(x=><article key={x.name}>
        <div className="testTop"><b>{x.name}</b><span data-state={x.value}>{x.value}</span></div>
        <p>{x.copy}</p>
        <div className="choices">
          {(['ESTABLISHED','MISSING','CHANGED'] as State[]).map(v=><button key={v} onClick={()=>x.set(v)} className={x.value===v?'sel':''}>{v}</button>)}
        </div>
      </article>)}
    </div>

    <div className="decision" data-decision={decision.state}>
      <div><small>TA-14 CONSTRUCTED DETERMINATION</small><strong>{decision.state}</strong></div>
      <p>{decision.copy}</p>
    </div>
    <div className="mantra">NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</div>

    <style jsx>{`
      .lab{padding:72px 0;border-top:1px solid #ffffff14}.labHead h2{font:clamp(38px,5.4vw,66px) Georgia,serif;line-height:1.02;margin:10px 0 16px}.labHead h2 em{font-style:normal;color:#7fe5cb}.labHead>p:last-child{max-width:920px;color:#9db3bc;line-height:1.7}
      .scenarioTabs{display:flex;gap:9px;flex-wrap:wrap;margin:30px 0 16px}.scenarioTabs button,.choices button{cursor:pointer;border:1px solid #ffffff1c;background:#06131b;color:#90a8b3;border-radius:999px;padding:10px 13px;font-size:9px;font-weight:900}.scenarioTabs button.active,.choices button.sel{border-color:#76ddff;color:#dff8ff;background:#0c2a36}
      .scenarioCard{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;padding:26px;border:1px solid #76ddff33;border-radius:20px;background:linear-gradient(135deg,#071824,#041016)}.scenarioCard div{min-height:105px}.scenarioCard small{display:block;color:#76ddff;font-size:9px;font-weight:900;letter-spacing:.13em;margin-bottom:12px}.scenarioCard strong{font:22px Georgia,serif;line-height:1.4}.scenarioCard>span{color:#f0c86c;font-size:28px}.why{color:#9db3bc;line-height:1.75;max-width:980px}
      .tests{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:26px}.tests article{padding:22px;border:1px solid #ffffff17;border-radius:16px;background:#051219}.testTop{display:flex;justify-content:space-between;gap:12px;align-items:center}.testTop b{color:#dcecf2;font-size:11px}.testTop span{font-size:8px;font-weight:950;padding:7px 9px;border-radius:999px;border:1px solid #ffffff18}.testTop span[data-state="ESTABLISHED"]{color:#7fe5cb;border-color:#7fe5cb55}.testTop span[data-state="MISSING"]{color:#f0c86c;border-color:#f0c86c55}.testTop span[data-state="CHANGED"]{color:#ff9a8c;border-color:#ff9a8c55}.tests p{color:#8fa6b1;font-size:12px;line-height:1.6}.choices{display:flex;gap:6px;flex-wrap:wrap;margin-top:15px}.choices button{padding:7px 9px;font-size:8px}
      .decision{display:grid;grid-template-columns:220px 1fr;gap:26px;margin-top:26px;padding:28px;border-radius:18px;border:1px solid #f0c86c44;background:#261d091f}.decision small{display:block;color:#879da7;font-size:8px;font-weight:900;letter-spacing:.13em}.decision strong{display:block;margin-top:10px;font:34px Georgia,serif;color:#f0c86c}.decision[data-decision="ALLOW"] strong{color:#7fe5cb}.decision[data-decision="ESCALATE"] strong{color:#ff9a8c}.decision p{margin:0;color:#b6c8cf;line-height:1.7}.mantra{margin-top:14px;padding:16px;text-align:center;border:1px solid #7fe5cb33;border-radius:12px;color:#7fe5cb;font-size:10px;font-weight:950;letter-spacing:.14em}
      @media(max-width:760px){.scenarioCard,.decision,.tests{grid-template-columns:1fr}.scenarioCard>span{transform:rotate(90deg);justify-self:center}}
    `}</style>
  </section>
}