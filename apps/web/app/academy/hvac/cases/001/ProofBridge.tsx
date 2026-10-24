"use client";
import {useState} from "react";
const requirements=[
 {id:"raw",name:"Raw and traceable measurements",why:"Original and post readings, instruments, points, units and times must be preserved and independently attributable.",state:"NOT ESTABLISHED"},
 {id:"comparable",name:"Comparable operating conditions",why:"Operating mode, load, test locations and other confounders need documentation before comparing performance.",state:"NOT ESTABLISHED"},
 {id:"criteria",name:"Applicable performance criteria",why:"Manufacturer data, verified system configuration and acceptance criteria are required before claiming design performance.",state:"NOT ESTABLISHED"},
 {id:"comfort",name:"Restored service outcome",why:"Sustained indoor comfort and the customer's original concern have not been independently verified.",state:"NOT ESTABLISHED"}
] as const;
export default function ProofBridge(){
 const [open,setOpen]=useState<string>("raw");
 const [claimed,setClaimed]=useState(false);
 const current=requirements.find(r=>r.id===open)!;
 return <section className="proof-bridge" aria-labelledby="proof-title">
 <style>{`
 .proof-bridge{margin:20px 0;border:1px solid #796d8c;border-radius:20px;padding:clamp(16px,3vw,30px);background:linear-gradient(145deg,#171c35,#241c30);color:#f4efff}.proof-bridge *{box-sizing:border-box}.proof-bridge h3{font-size:clamp(22px,3vw,33px);margin:8px 0 12px}.proof-bridge .eyebrow{font-size:12px;color:#e3c5fa;letter-spacing:.12em;font-weight:800}.proof-bridge p{line-height:1.6}.proof-bridge .bridge{display:grid;grid-template-columns:1fr 2fr 1fr;align-items:center;gap:12px;margin:26px 0}.proof-bridge .bank{padding:18px 10px;text-align:center;border-radius:13px;background:#364461;border:1px solid #7283a3;font-weight:900}.proof-bridge .bank.last{background:#543747;border-color:#b78a9c}.proof-bridge .gap{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.proof-bridge .plank{height:76px;display:flex;align-items:center;justify-content:center;border:2px dashed #e2a8ac;border-radius:8px;background:repeating-linear-gradient(135deg,#4e303e,#4e303e 8px,#422938 8px,#422938 16px);font-size:23px;font-weight:900;color:#ffd5d5}.proof-bridge .selector{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.proof-bridge button{font:inherit;cursor:pointer;border:2px solid #736585;background:#342e4a;color:#f8f1ff;border-radius:10px;padding:13px;text-align:left}.proof-bridge button[aria-pressed=true]{border-color:#e2baf5;background:#51406b}.proof-bridge button:focus-visible{outline:3px solid #ffdc93;outline-offset:3px}.proof-bridge .detail{background:#302b41;border-left:4px solid #f1b8c4;border-radius:8px;padding:18px;margin-top:14px}.proof-bridge .detail h4{margin:0 0 8px;font-size:20px}.proof-bridge .missing{color:#ffc7bb;font-weight:900}.proof-bridge .claim{margin-top:20px;border-top:1px solid #74667c;padding-top:16px}.proof-bridge .claim button{margin-top:5px}.proof-bridge .verdict{color:#ffddae;font-weight:800}.proof-bridge .foot{font-size:13px;color:#d9cce5;margin-top:16px}@media(max-width:700px){.proof-bridge .bridge{grid-template-columns:1fr;gap:8px}.proof-bridge .gap{min-height:68px}.proof-bridge .plank{height:58px}.proof-bridge .selector{grid-template-columns:1fr}}
 `}</style>
 <div className="eyebrow">LESSON 13 · PROOF-OF-PERFORMANCE BRIDGE · SIMULATION</div>
 <h3 id="proof-title">Improvement is not the same as restoration.</h3>
 <p>Four missing evidence planks separate an illustrative improvement from a defensible restoration claim. Select each gap to inspect the proof burden.</p>
 <div className="bridge" role="img" aria-label="An incomplete bridge between improved indicators and restored performance. Four evidence requirements remain unestablished."><div className="bank">IMPROVED<br/><small>illustrative</small></div><div className="gap" aria-hidden="true">{requirements.map((r,i)=><div key={r.id} className="plank">{i+1} ?</div>)}</div><div className="bank last">RESTORED<br/><small>not established</small></div></div>
 <div className="selector" role="group" aria-label="Missing proof requirements">{requirements.map((r,i)=><button key={r.id} type="button" aria-pressed={open===r.id} onClick={()=>setOpen(r.id)}>{i+1}. {r.name}</button>)}</div>
 <div className="detail" aria-live="polite" aria-atomic="true"><h4>{current.name}</h4><div className="missing">{current.state}</div><p>{current.why}</p></div>
 <div className="claim"><strong>Test the proposed final claim:</strong><p><button type="button" aria-pressed={claimed} onClick={()=>setClaimed(!claimed)}>{claimed?"Withdraw restoration claim":"Attempt to declare RESTORED"}</button></p>{claimed&&<p className="verdict" role="status">DENY THE CLAIM — the record does not establish all four required proof elements. The appropriate case disposition remains IMPROVED; RESTORED NOT ESTABLISHED.</p>}</div>
 <p className="foot">The missing planks cannot be marked complete by clicking. Real proof requires admissible records and applicable authority, not a simulated checkbox.</p>
 </section>;
}
