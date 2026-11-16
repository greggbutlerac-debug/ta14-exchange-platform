"use client";
import {useState} from "react";
type Hypothesis={id:string;title:string;state:string;why:string;missing:string};
const hypotheses:Hypothesis[]=[
{id:"filter",title:"Return-air restriction",state:"SUPPORTED CONCERN",why:"A heavily loaded return filter is part of the simulated original-state record. The illustrative static-pressure change is consistent with an air-side concern, but not proof of design airflow.",missing:"Fan data, measurement configuration, verified raw readings and competing causes."},
{id:"controls",title:"Controls or operating mode",state:"UNRESOLVED",why:"The complaint alone cannot rule out thermostat, control, operating-mode or sequencing issues.",missing:"Authenticated control state, operating mode, demand and sequence observations."},
{id:"coil",title:"Coil, duct or load",state:"UNRESOLVED",why:"Other air-side and load-related causes may coexist with a loaded filter.",missing:"Condition and configuration evidence, applicable design information and authorized testing."},
{id:"refrigerant",title:"Refrigerant circuit",state:"HOLD — NO ENTRY",why:"No admissible refrigerant pressures, superheat, subcooling or circuit-fault evidence exists. NIRET remains HOLD.",missing:"An independently established basis to reconsider entry, plus applicable authority and technician standing."}
];
export default function HypothesisTree(){
 const [active,setActive]=useState("filter");
 const h=hypotheses.find(x=>x.id===active)!;
 return <section className="hyp-tree" aria-labelledby="hyp-title">
 <style>{`
 .hyp-tree{border:1px solid #365b75;border-radius:20px;padding:clamp(15px,3vw,28px);margin:20px 0;background:#071827;color:#e9f6ff}
 .hyp-tree *{box-sizing:border-box}.hyp-tree h3{font-size:clamp(22px,3vw,32px);margin:8px 0 12px}.hyp-tree .eyebrow{font-size:12px;color:#91dcef;letter-spacing:.12em;font-weight:800}.hyp-tree p{line-height:1.55}.hyp-tree .root{max-width:520px;margin:24px auto 0;text-align:center;background:#19364b;border:1px solid #638ba4;border-radius:14px;padding:18px}.hyp-tree .root strong{font-size:21px}.hyp-tree .stem{height:28px;width:2px;background:#7ba3b8;margin:auto}.hyp-tree .branches{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;position:relative}.hyp-tree .branches:before{content:"";position:absolute;top:-1px;left:12%;right:12%;border-top:2px solid #6a94aa}.hyp-tree button{font:inherit;text-align:left;cursor:pointer;color:#e9f6ff;background:#112b3e;border:2px solid #4d7188;border-radius:13px;padding:15px;min-height:145px;position:relative}.hyp-tree button:before{content:"";position:absolute;top:-14px;left:50%;height:13px;border-left:2px solid #6a94aa}.hyp-tree button[aria-pressed=true]{border-color:#8ee2ff;background:#17455a;box-shadow:0 0 0 2px #23566e}.hyp-tree button:focus-visible{outline:3px solid #ffe19d;outline-offset:3px}.hyp-tree button strong{display:block;font-size:16px;margin-bottom:12px}.hyp-tree button small{font-weight:800;letter-spacing:.05em;color:#a7e6c9}.hyp-tree button .pending{color:#ffdb9d}.hyp-tree .detail{border:1px solid #4b7690;background:#10283a;border-radius:14px;padding:18px;margin-top:17px}.hyp-tree .detail h4{font-size:21px;margin:0 0 10px}.hyp-tree .detail .state{font-size:13px;letter-spacing:.07em;color:#f4cf91;font-weight:800}.hyp-tree .detail p{margin:10px 0}.hyp-tree .foot{color:#b5d2e3;font-size:13px;margin-top:16px}@media(max-width:720px){.hyp-tree .branches{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:14px}.hyp-tree .branches:before,.hyp-tree button:before{display:none}.hyp-tree button{min-height:120px}}
 `}</style>
 <div className="eyebrow">LESSON 09 · SELECT A COMPETING HYPOTHESIS · SIMULATION ONLY</div>
 <h3 id="hyp-title">One complaint. Four possible explanations.</h3>
 <p>Follow a branch to see what the evidence supports, what remains unknown, and which action is held. Selecting a branch does not diagnose the system or authorize work.</p>
 <div className="root"><strong>HOUSE WON’T COOL</strong><p>Customer-reported condition — not yet a proven cause</p></div>
 <div className="stem" aria-hidden="true"/>
 <div className="branches" role="group" aria-label="Competing diagnostic hypotheses">
 {hypotheses.map(x=><button key={x.id} type="button" aria-pressed={active===x.id} onClick={()=>setActive(x.id)}><strong>{x.title}</strong><small className={x.id==="filter"?"":"pending"}>{x.state}</small></button>)}
 </div>
 <div className="detail" aria-live="polite" aria-atomic="true">
 <div className="state">{h.state}</div><h4>{h.title}</h4><p><strong>What we can say:</strong> {h.why}</p><p><strong>What is missing:</strong> {h.missing}</p>
 </div>
 <p className="foot"><strong>Boundary:</strong> A supported contributor does not eliminate other causes. Observed is not inferred. Inferred is not authorized.</p>
 </section>;
}
