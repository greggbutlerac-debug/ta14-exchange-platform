"use client";
import {useState} from "react";
const metrics={
 temperature:{title:"Air temperature difference",unit:"°F",before:13,after:18,max:24,caveat:"Individual raw temperatures, test locations, operating mode and comparability are not authenticated."},
 static:{title:"Total external static pressure",unit:"in. w.c.",before:0.92,after:0.61,max:1.2,caveat:"Measurement port configuration, instrument provenance, fan data and applicable OEM limits are not established."}
} as const;
export default function ComparisonDashboard(){
 const [selected,setSelected]=useState<keyof typeof metrics>("temperature");
 const m=metrics[selected];
 return <section className="comparison" aria-labelledby="comparison-heading">
 <style>{`
 .comparison{margin:20px 0;padding:clamp(16px,3vw,28px);border:1px solid #4d819e;border-radius:18px;background:#091c30;color:#e8f5ff}.comparison *{box-sizing:border-box}.comparison h3{font-size:clamp(22px,3vw,32px);margin:8px 0 12px}.comparison .eyebrow{font-size:12px;letter-spacing:.12em;color:#9bd7f3;font-weight:800}.comparison p{line-height:1.6}.comparison .tabs{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}.comparison button{cursor:pointer;font:inherit;background:#1b405a;color:white;border:2px solid #557e99;border-radius:9px;padding:11px 14px}.comparison button[aria-pressed=true]{background:#246786;border-color:#a2e9ff}.comparison button:focus-visible{outline:3px solid #ffdc95;outline-offset:3px}.comparison .pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}.comparison .measure{background:#16344b;border-radius:13px;padding:18px}.comparison .measure.after{background:#16494b}.comparison .label{font-size:12px;letter-spacing:.1em;color:#c6ddeb;font-weight:800}.comparison .value{font-size:clamp(30px,5vw,52px);font-weight:900;margin:8px 0}.comparison .value small{font-size:14px;font-weight:500}.comparison .track{height:12px;background:#071725;border-radius:20px;overflow:hidden}.comparison .bar{height:100%;background:#8bc9eb;border-radius:20px}.comparison .after .bar{background:#93e4ce}.comparison .warning{border-left:4px solid #f0c27a;background:#2e2c2b;color:#ffe4b8;padding:14px;margin-top:18px}.comparison .foot{font-size:13px;color:#c7dce9;margin-top:16px}@media(max-width:600px){.comparison .pair{grid-template-columns:1fr}}
 `}</style>
 <div className="eyebrow">LESSON 12 · ILLUSTRATIVE COMPARISON · NOT FIELD-VERIFIED</div>
 <h3 id="comparison-heading">What changed? What remains unproven?</h3>
 <p>Choose a metric to inspect its before-and-after values. Bar lengths show relative magnitude only; they are not calibrated displays or OEM acceptance thresholds.</p>
 <div className="tabs" role="group" aria-label="Select comparison metric"><button type="button" aria-pressed={selected==="temperature"} onClick={()=>setSelected("temperature")}>Temperature difference</button><button type="button" aria-pressed={selected==="static"} onClick={()=>setSelected("static")}>External static pressure</button></div>
 <div aria-live="polite" aria-atomic="true"><h4>{m.title}</h4><div className="pair"><div className="measure"><div className="label">ORIGINAL STATE</div><div className="value">{m.before} <small>{m.unit}</small></div><div className="track" aria-hidden="true"><div className="bar" style={{width:`${100*m.before/m.max}%`}}/></div></div><div className="measure after"><div className="label">POST-INTERVENTION</div><div className="value">{m.after} <small>{m.unit}</small></div><div className="track" aria-hidden="true"><div className="bar" style={{width:`${100*m.after/m.max}%`}}/></div></div></div><div className="warning"><strong>Admissibility limit:</strong> {m.caveat}</div></div>
 <p className="foot"><strong>Bounded conclusion:</strong> The hypothetical record indicates directional improvement. Design airflow, OEM compliance and restored comfort remain unestablished. No refrigerant entry.</p>
 </section>;
}
