"use client";

import {useState} from "react";

type Gate="air"|"refrigerant";
export default function NiretAuthorityGate(){
 const [selected,setSelected]=useState<Gate>("refrigerant");
 const isHold=selected==="refrigerant";
 return <section className="gate" aria-labelledby="gate-title">
 <style>{`
 .gate{border:1px solid #41677f;background:radial-gradient(ellipse at 20% 0%,#153d56,#071625 72%);border-radius:18px;padding:clamp(15px,3vw,30px);margin:20px 0;color:#f0f8ff}
 .gate *{box-sizing:border-box}.gate .eyebrow{font-size:12px;color:#8cdbef;letter-spacing:.14em;font-weight:800}.gate h3{font-size:clamp(22px,3vw,34px);margin:9px 0}.gate .intro{color:#c1d9e7;line-height:1.55;max-width:800px}.gate .paths{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0}.gate .path{border:2px solid #53778b;border-radius:14px;padding:22px;min-height:220px;background:#0c2739;color:inherit;text-align:left;cursor:pointer;font:inherit;display:flex;flex-direction:column;gap:12px}.gate .path:focus-visible{outline:3px solid #ffdc89;outline-offset:3px}.gate .path[aria-pressed=true]{border-color:#90e4ff;box-shadow:0 0 0 3px #24526a}.gate .path .symbol{font-size:42px;font-weight:900;line-height:1}.gate .path strong{font-size:clamp(18px,2.5vw,25px)}.gate .path span:last-child{line-height:1.5;color:#c9e2f0}.gate .path.hold{background:#351f22;border-color:#b76b69}.gate .path.hold[aria-pressed=true]{border-color:#ffba9e;box-shadow:0 0 0 3px #71413c}.gate .decision{border:1px solid #5d8299;background:#102c3c;border-radius:13px;padding:18px;min-height:150px}.gate .decision h4{margin:0 0 10px;font-size:19px}.gate .decision p{line-height:1.6;margin:7px 0}.gate .decision .status{font-weight:900;color:#ffcb9e}.gate .decision .allowed{color:#9de9c4}.gate .footer{font-size:13px;margin-top:18px;color:#bcd1e1}.gate .footer strong{color:#fff}@media(max-width:640px){.gate .paths{grid-template-columns:1fr}.gate .path{min-height:0;padding:17px}}
 `}</style>
 <div className="eyebrow">LESSON 08 · INTERACTIVE AUTHORITY GATE · SIMULATION ONLY</div>
 <h3 id="gate-title">Two paths. Different permissions.</h3>
 <p className="intro">Select a diagnostic path to inspect what the Case 001 evidence permits. Choosing a path does not authorize real-world work.</p>
 <div className="paths" role="group" aria-label="Choose diagnostic pathway">
  <button type="button" className="path" aria-pressed={!isHold} onClick={()=>setSelected("air")}>
   <span className="symbol" aria-hidden="true">↗</span><strong>AIR-SIDE PATH</strong>
   <span>Investigate the loaded return filter and bounded air-side evidence. Individual tests and intervention still require safety, scope, authority and standing.</span>
  </button>
  <button type="button" className="path hold" aria-pressed={isHold} onClick={()=>setSelected("refrigerant")}>
   <span className="symbol" aria-hidden="true">⊘</span><strong>REFRIGERANT ENTRY</strong>
   <span>No gauge connection, refrigerant pressures, superheat or subcooling established in this case.</span>
  </button>
 </div>
 <div className="decision" role="status" aria-live="polite">
  {isHold?<><h4 className="status">HOLD — NO REFRIGERANT ENTRY</h4><p>The NIRET threshold is not established for refrigerant-system access. No refrigerant readings exist in the controlling simulated record.</p><p>Even a future justified threshold would not itself establish technician standing or execution authority.</p></>:<><h4 className="allowed">BOUNDED AIR-SIDE INVESTIGATION</h4><p>The loaded return filter supports an air-side concern, not a complete diagnosis. Continue only with specifically authorized and safe observations or tests.</p><p>Filter replacement is a separate intervention requiring established authority, standing and documented scope.</p></>}
 </div>
 <p className="footer"><strong>Controlling distinction:</strong> Capability ≠ Authority. Observed is not inferred. Inferred is not authorized.</p>
 </section>;
}
