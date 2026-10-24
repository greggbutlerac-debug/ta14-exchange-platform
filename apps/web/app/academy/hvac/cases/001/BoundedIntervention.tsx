"use client";
import {useState} from "react";
const stages=[
 {name:"Preserve",short:"Original condition",detail:"Record the loaded return filter and the simulated original-state baseline before disturbing the system. Preserve original observations separately from interpretation.",question:"Has the original state been recorded before alteration?"},
 {name:"Establish authority",short:"Permission and standing",detail:"Confirm customer permission, technician qualification and established standing, safe conditions, and a specifically bounded filter-replacement scope. An air-side finding alone does not authorize the action.",question:"Is there an independently established basis to execute this specific intervention?"},
 {name:"Intervene",short:"Filter correction only",detail:"Only after the authority gate is satisfied, replace the specified return filter within the authorized scope. Do not extend this permission to refrigerant-system entry or other repairs.",question:"Does the actual work stay within the approved scope?"},
 {name:"Recheck",short:"Compare without overclaiming",detail:"Record post-intervention measurements and operating conditions. The illustrative 13°F → 18°F and 0.92 → 0.61 in. w.c. changes suggest improvement, not independently verified restoration.",question:"Are test conditions comparable and is the conclusion bounded?"}
] as const;
export default function BoundedIntervention(){
 const [stage,setStage]=useState(0);
 const [authority,setAuthority]=useState<"unverified"|"established">("unverified");
 const canShowIntervention=authority==="established";
 return <section className="intervention" aria-labelledby="intervention-title">
 <style>{`
 .intervention{margin:20px 0;padding:clamp(16px,3vw,30px);border:1px solid #587a77;border-radius:20px;background:linear-gradient(145deg,#0d292c,#0a1a24);color:#eaf8f3}.intervention *{box-sizing:border-box}.intervention .eyebrow{font-size:12px;font-weight:800;letter-spacing:.12em;color:#a7ead5}.intervention h3{font-size:clamp(23px,3vw,33px);margin:8px 0 12px}.intervention p{line-height:1.6}.intervention .rail{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:24px 0}.intervention .step{font:inherit;cursor:pointer;border:2px solid #4d7671;border-radius:12px;background:#153d3e;color:#f2fff9;text-align:left;padding:14px;min-height:118px}.intervention .step[aria-pressed=true]{border-color:#9af4d6;background:#22645b}.intervention .step:focus-visible,.intervention .switch:focus-visible{outline:3px solid #ffde9c;outline-offset:3px}.intervention .step span{display:block;font-size:12px;color:#b6d8d0;margin-bottom:9px}.intervention .step strong{font-size:16px}.intervention .panel{background:#eaf2e8;color:#173031;border-radius:14px;padding:20px}.intervention .panel h4{font-size:22px;margin:0 0 12px}.intervention .panel p{margin:8px 0}.intervention .gate{margin-top:18px;padding:15px;border:1px solid #94b2a4;border-radius:10px;background:#d6e8da}.intervention .switch{font:inherit;background:#194d46;color:white;border:1px solid #23665a;padding:10px 14px;border-radius:7px;cursor:pointer;margin-top:9px}.intervention .hold{color:#7b2e1c;font-weight:900}.intervention .allow{color:#155b3d;font-weight:900}.intervention .fine{font-size:13px;color:#b8d8d1;margin-top:16px}@media(max-width:680px){.intervention .rail{grid-template-columns:repeat(2,minmax(0,1fr))}.intervention .step{min-height:105px}}
 `}</style>
 <div className="eyebrow">LESSON 11 · INTERVENTION SEQUENCE · HYPOTHETICAL CASE</div>
 <h3 id="intervention-title">The filter is loaded. May you change it?</h3>
 <p>Move through the four stages. The authority checkpoint is intentionally unresolved until you explicitly assume it has been established for this simulated exercise.</p>
 <div className="rail" role="group" aria-label="Intervention sequence">{stages.map((s,i)=><button key={s.name} className="step" type="button" aria-pressed={stage===i} onClick={()=>setStage(i)}><span>0{i+1} / 04</span><strong>{s.name}</strong></button>)}</div>
 <div className="panel" aria-live="polite" aria-atomic="true">
 <h4>{stages[stage].name} — {stages[stage].short}</h4>
 <p>{stages[stage].detail}</p>
 <p><strong>Student checkpoint:</strong> {stages[stage].question}</p>
 <div className="gate">
 <strong>Authority scenario switch</strong><p>This toggle changes a hypothetical teaching assumption only. It is not a credential check, customer consent, or a real authorization.</p>
 <button type="button" className="switch" aria-pressed={canShowIntervention} onClick={()=>setAuthority(canShowIntervention?"unverified":"established")}>{canShowIntervention?"Reset: authority unverified":"Assume authority and standing established"}</button>
 <p className={canShowIntervention?"allow":"hold"}>{canShowIntervention?"SIMULATED GATE SATISFIED — bounded filter correction may be considered within scope.":"HOLD — intervention not authorized while standing, permission or safety remains unverified."}</p>
 </div>
 </div>
 <p className="fine">The controlling case narrative describes an authorized filter correction; this switch teaches the independent authority gate. It does not establish that the simulated record contains authenticated permission or qualifications.</p>
 </section>;
}
