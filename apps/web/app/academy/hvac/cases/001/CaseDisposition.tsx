"use client";
import {useState} from "react";
type Choice="allow"|"hold"|"deny"|"escalate";
const options=[
 {id:"allow",label:"ALLOW — system restored",reason:"Not supported. Directional improvement does not establish restored comfort, applicable OEM performance, or admissible proof."},
 {id:"hold",label:"HOLD — restoration claim",reason:"Correct for the proposed restoration claim. Preserve the bounded improvement finding, document missing evidence and do not authorize a broader conclusion."},
 {id:"deny",label:"DENY — any improvement occurred",reason:"Overstated. The scenario contains illustrative before/after indicators consistent with improvement; it does not justify rejecting every bounded observation."},
 {id:"escalate",label:"ESCALATE — request further examination",reason:"Appropriate as a follow-up when additional qualified review is needed, but escalation does not itself establish restoration or override the current HOLD."}
] as const;
export default function CaseDisposition(){
 const [choice,setChoice]=useState<Choice|null>(null);
 const [ack,setAck]=useState(false);
 const selected=options.find(o=>o.id===choice);
 return <section className="case-disposition" aria-labelledby="disposition-heading">
 <style>{`
 .case-disposition{margin:20px 0;padding:clamp(18px,3vw,32px);border:1px solid #8b6c51;border-radius:18px;background:#191919;color:#fff8e8}.case-disposition *{box-sizing:border-box}.case-disposition .eyebrow{font-size:12px;letter-spacing:.12em;color:#f1c38d;font-weight:900}.case-disposition h3{font-size:clamp(24px,3vw,35px);margin:8px 0 12px}.case-disposition p{line-height:1.6}.case-disposition .verdict{border:3px solid #d9b176;background:#2c241b;padding:clamp(16px,3vw,26px);text-align:center;margin:22px 0;transform:rotate(-1deg)}.case-disposition .verdict span{display:block;font-size:clamp(28px,5vw,52px);font-weight:950;letter-spacing:.04em}.case-disposition .verdict small{display:block;font-size:15px;margin-top:9px;color:#f8d9aa}.case-disposition .choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:16px 0}.case-disposition button{font:inherit;cursor:pointer;border:2px solid #776b5e;background:#35312c;color:#fff9ef;border-radius:9px;padding:14px;text-align:left}.case-disposition button[aria-pressed=true]{border-color:#f0c584;background:#59472f}.case-disposition button:focus-visible,.case-disposition input:focus-visible{outline:3px solid #a8e7ff;outline-offset:3px}.case-disposition .feedback{border-left:5px solid #f0c584;padding:16px;background:#302b24;margin:15px 0}.case-disposition .correct{color:#b8f1d0}.case-disposition .caution{color:#ffd6a5}.case-disposition .ack{display:flex;align-items:flex-start;gap:12px;margin:20px 0;font-size:15px}.case-disposition .ack input{width:20px;height:20px;flex-shrink:0;margin-top:3px}.case-disposition .fine{font-size:13px;color:#e0cfb7}@media(max-width:650px){.case-disposition .choices{grid-template-columns:1fr}}
 `}</style>
 <div className="eyebrow">LESSON 14 · FINAL DISPOSITION · SIMULATED CASE</div>
 <h3 id="disposition-heading">The record closes. The boundary remains.</h3>
 <div className="verdict" aria-label="Final bounded case conclusion"><span>IMPROVED</span><small>RESTORED NOT ESTABLISHED</small></div>
 <p>Choose the appropriate disposition for a proposed declaration that the customer's cooling problem has been fully resolved. This is not a real-world certification or release.</p>
 <div className="choices" role="group" aria-label="Select a disposition">{options.map(o=><button type="button" key={o.id} aria-pressed={choice===o.id} onClick={()=>{setChoice(o.id);setAck(false);}}>{o.label}</button>)}</div>
 {selected&&<div className="feedback" role="status"><strong className={choice==="hold"?"correct":"caution"}>{choice==="hold"?"SUPPORTED BOUNDED DECISION":"RECONSIDER THE CLAIM"}</strong><p>{selected.reason}</p></div>}
 {choice==="hold"&&<label className="ack"><input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)}/><span>I will preserve the original and post-intervention observations separately, disclose missing verification and not claim restoration without admissible evidence, applicable authority and established standing.</span></label>}
 {choice==="hold"&&ack&&<p className="correct" role="status"><strong>Case decision acknowledged.</strong> This practice interaction is not an independently assessed qualification; complete the lesson's written reasoning exercise below.</p>}
 <p className="fine">Illustrative readings: ΔT 13°F → 18°F; TESP 0.92 → 0.61 in. w.c. No verified OEM compliance, design airflow, sustained comfort or refrigerant-system examination. Technical engineering release remains HOLD.</p>
 </section>;
}
