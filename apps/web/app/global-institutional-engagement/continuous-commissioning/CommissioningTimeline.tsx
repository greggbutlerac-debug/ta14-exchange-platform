'use client';
import {useState} from 'react';
const stages=[
['COMMISSIONED BASELINE','VERIFIED','Requirements, functional tests, accepted configuration and baseline state are established.','Commissioning record exists and describes the accepted condition.'],
['HANDOFF','TRANSFER','The accepted condition enters operations. The record must remain attributable and reachable after project handoff.','Baseline evidence survives the transition into operations.'],
['OPERATIONS','LIVE','The building operates under real loads, schedules, occupants, maintenance and interventions.','Operational evidence begins accumulating against the accepted baseline.'],
['DRIFT DETECTED','CHANGE','A sensor, sequence, utility, component or environmental condition no longer matches an earlier assumption.','Changed condition exists. Historical verification alone is no longer sufficient for the next consequence.'],
['INVESTIGATE','HOLD','The changed condition is attributed and its materiality is tested before intervention.','Present reality is being re-established. Execution standing is not presumed.'],
['CORRECT','ACTION','A bounded correction is proposed or performed against the identified condition.','The intervention itself does not prove recovery.'],
['VERIFY CORRECTION','PROVE','Post-action evidence tests whether the intended condition actually recovered and whether the correction held.','Outcome evidence must establish recovery, not merely disappearance of an alarm.'],
['REVALIDATE + COMMIT','GATE','Current evidence, authority, target identity, scope and exact action are resolved at the consequence boundary.','Only present standing can support present execution.'],
['OUTCOME','RECORD','What actually happened becomes the governed outcome and the basis for the next chain.','Execution closes with outcome evidence rather than an assumption of success.']
];
export default function CommissioningTimeline(){
 const [active,setActive]=useState(0); const s=stages[active];
 return <div className="timelineLab"><style>{`.timelineButtons{display:grid;grid-template-columns:repeat(9,1fr);gap:6px;margin-top:24px}.timelineButtons button{cursor:pointer;padding:12px 7px;border:1px solid #294957;border-radius:9px;background:#041018;color:#94afbb;font-size:8px;font-weight:950;min-height:58px}.timelineButtons button.on{border-color:#62e9b4;color:#fff;background:#0a2932;box-shadow:0 0 0 1px rgba(98,233,180,.18)}.timelineReadout{margin-top:10px;padding:20px;border:1px solid #294957;border-radius:14px;background:rgba(4,16,24,.85);display:grid;grid-template-columns:140px 1fr;gap:20px}.timelineStatus{color:#f0c35a;font-weight:950;font-size:11px;letter-spacing:.12em}.timelineReadout h3{margin:3px 0 8px;font-size:22px}.timelineReadout p{margin:0;color:#a7b9c3;line-height:1.6;font-size:13px}.timelineEvidence{margin-top:9px!important;color:#62e9b4!important}@media(max-width:920px){.timelineButtons{grid-template-columns:repeat(3,1fr)}}@media(max-width:620px){.timelineReadout{grid-template-columns:1fr}}`}</style><div className="timelineButtons">{stages.map((x,i)=><button key={x[0]} className={i===active?'on':''} onClick={()=>setActive(i)}>{x[0]}</button>)}</div><div className="timelineReadout"><div className="timelineStatus">{String(active+1).padStart(2,'0')} · {s[1]}</div><div><h3>{s[0]}</h3><p>{s[2]}</p><p className="timelineEvidence"><b>EVIDENCE STATE:</b> {s[3]}</p></div></div></div>
}
