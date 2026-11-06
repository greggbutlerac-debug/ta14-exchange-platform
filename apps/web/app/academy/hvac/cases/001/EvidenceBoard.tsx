"use client";
import {useState} from "react";
const evidence=[
 {id:"observation",name:"Observed condition",kind:"SCENARIO OBSERVATION",fact:"The simulated original-state return filter is heavily loaded.",limit:"This does not establish the only cause of inadequate cooling."},
 {id:"measurement",name:"Illustrative measurements",kind:"WORKING VALUES",fact:"Original-state air temperature difference: 13°F. Total external static pressure: 0.92 in. w.c.",limit:"Raw temperatures, port configuration, instrument traceability and applicable OEM limits are not established."},
 {id:"inference",name:"Bounded inference",kind:"REASONED HYPOTHESIS",fact:"The loaded filter is an evidence-supported contributor to an air-side concern.",limit:"Actual design airflow, capacity and other possible faults remain unproven."},
 {id:"authority",name:"Execution authority",kind:"SEPARATE GATE",fact:"Only a separately authorized, safe, bounded filter correction can proceed under established standing.",limit:"Observations and a plausible diagnosis do not grant permission to intervene."}
] as const;
export default function EvidenceBoard(){
 const [selected,setSelected]=useState<string>("observation");
 const [claim,setClaim]=useState<"supported"|"overreach">("supported");
 const item=evidence.find(e=>e.id===selected)!;
 return <section className="evidence-board" aria-labelledby="evidence-board-title">
 <style>{`
 .evidence-board{border:1px solid #78684c;border-radius:18px;background:#191d21;color:#f5efe2;padding:clamp(16px,3vw,30px);margin:20px 0}.evidence-board *{box-sizing:border-box}.evidence-board h3{font-size:clamp(22px,3vw,32px);margin:8px 0 14px}.evidence-board .eyebrow{color:#e6c78e;letter-spacing:.12em;font-size:12px;font-weight:800}.evidence-board .note{color:#d7d0c1;line-height:1.6}.evidence-board .cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:24px 0}.evidence-board .card{font:inherit;cursor:pointer;text-align:left;background:#f4e9cf;color:#25282b;border:3px solid transparent;border-radius:3px;padding:15px;min-height:140px;box-shadow:3px 5px 0 #0a0b0c;transform:rotate(-1deg)}.evidence-board .card:nth-child(even){transform:rotate(1deg)}.evidence-board .card[aria-pressed=true]{border-color:#e2a955;background:#fff7e5}.evidence-board .card:focus-visible,.evidence-board .choice:focus-visible{outline:3px solid #f9d07b;outline-offset:3px}.evidence-board .card strong{display:block;margin-bottom:12px}.evidence-board .card small{font-size:11px;letter-spacing:.04em}.evidence-board .record{background:#f3e9d5;color:#272a2e;padding:22px;border-radius:4px;line-height:1.6;border-left:7px solid #c9934b}.evidence-board .record h4{font-size:22px;margin:0 0 10px}.evidence-board .record p{margin:10px 0}.evidence-board .test{margin-top:18px;border-top:1px dashed #9b8767;padding-top:18px}.evidence-board .choices{display:flex;gap:10px;flex-wrap:wrap}.evidence-board .choice{font:inherit;color:#f6eee0;background:#30363a;border:1px solid #9d947d;padding:11px 14px;border-radius:7px;cursor:pointer}.evidence-board .choice[aria-pressed=true]{background:#67502c;border-color:#e4bd78}.evidence-board .verdict{margin-top:12px;color:#f5dba8;line-height:1.5}.evidence-board .foot{color:#d1c4ad;font-size:13px;margin-top:15px}@media(max-width:750px){.evidence-board .cards{grid-template-columns:repeat(2,minmax(0,1fr))}.evidence-board .card{min-height:115px}}
 `}</style>
 <div className="eyebrow">LESSON 10 · FORENSIC EVIDENCE BOARD · SIMULATION</div>
 <h3 id="evidence-board-title">What does the record actually prove?</h3>
 <p className="note">Examine each evidence card. Then test the proposed conclusion against the admissibility boundary.</p>
 <div className="cards" role="group" aria-label="Evidence categories">
 {evidence.map(e=><button type="button" className="card" key={e.id} aria-pressed={selected===e.id} onClick={()=>setSelected(e.id)}><strong>{e.name}</strong><small>{e.kind}</small></button>)}
 </div>
 <div className="record" aria-live="polite" aria-atomic="true"><h4>{item.name}</h4><p><strong>Record:</strong> {item.fact}</p><p><strong>Limit:</strong> {item.limit}</p></div>
 <div className="test"><p><strong>Test a proposed determination:</strong></p><div className="choices" role="group" aria-label="Choose diagnostic claim"><button type="button" className="choice" aria-pressed={claim==="supported"} onClick={()=>setClaim("supported")}>Filter is a supported contributor</button><button type="button" className="choice" aria-pressed={claim==="overreach"} onClick={()=>setClaim("overreach")}>Filter proves the only fault</button></div><div className="verdict" role="status">{claim==="supported"?"BOUNDED: Consistent with the simulated observations, subject to missing verification.":"OVERREACH: The record does not exclude controls, load, coil, duct or refrigerant-side causes."}</div></div>
 <p className="foot">The student exercise below separately checks reasoning. This board is exploratory, not an independently graded certification.</p>
 </section>;
}
