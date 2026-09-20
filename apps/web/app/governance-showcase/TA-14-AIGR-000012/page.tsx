"use client";

import { useState } from "react";
import Link from "next/link";

const states = [
  {label:"BOUNDARY ACCEPTED",result:"NOT AUTHORIZED",text:"Boundary v0.4.1 defines what may be examined. Acceptance does not authorize the examination."},
  {label:"STAGE B FROZEN",result:"NOT AUTHORIZED",text:"Stage B v0.2.1 freezes E-001 through E-007, S-01 through S-08, F-01 through F-10, authority boundaries, and protection controls."},
  {label:"TA-14 AUTHORIZED",result:"WAIT",text:"TA-14 has authorized its own participation. That authorization cannot substitute for ANDEKS™ authority."},
  {label:"DUAL AUTHORIZATION",result:"EXAMINATION AUTHORIZED",text:"Both sovereign participation authorizations are verified against the same unchanged freeze. No finding is presumed."},
  {label:"DOCUMENTARY EXAMINATION",result:"SUPPORTED · BOUNDED",text:"The frozen record supports the documentary governance interface across S-01 through S-08 without merging authority, provenance, normative lineage, or architectural sovereignty."},
  {label:"TRY TO CROSS INTO RUNTIME",result:"STOP",text:"The finding does not establish runtime interoperability, API compatibility, deployment readiness, certification, or pilot authority."},
];

export default function AndeksGovernanceShowroom(){
  const [i,setI]=useState(0); const s=states[i];
  return <main className="shell">
    <header><Link href="/">TA-14 EXCHANGE</Link><span>ANDEKS™ · INTERACTIVE GOVERNANCE SHOWROOM</span></header>
    <section className="hero">
      <p className="eyebrow">REGISTERED GOVERNANCE · TA-14-AIGR-000012</p>
      <h1>Interoperate without surrendering who governs what.</h1>
      <p className="lede">This showroom reconstructs the bounded ANDEKS™ × TA-14 governance seam from the preserved examination record. Change the institutional state and watch what becomes authorized—and what still does not.</p>
      <div className="notice">THIS MODEL EXPLAINS THE PRESERVED RECORD. IT DOES NOT CREATE A NEW FINDING, AUTHORIZE A PILOT, OR CONVERT DOCUMENTARY SUPPORT INTO RUNTIME PROOF.</div>
    </section>
    <section className="lab">
      <div className="controls">
        <p className="eyebrow">ENTER THE GOVERNANCE</p>
        {states.map((x,n)=><button key={x.label} onClick={()=>setI(n)} className={i===n?"active":""}>{n+1}. {x.label}</button>)}
        <button onClick={()=>setI(0)}>RESTORE BASELINE</button>
      </div>
      <div className="state">
        <p className="eyebrow">CURRENT CONTROLLED STATE</p><h2>{s.label}</h2>
        <strong>{s.result}</strong><p>{s.text}</p>
        <div className="seam"><span>TA-14 AUTHORITY</span><b>FROZEN DOCUMENTARY INTERFACE</b><span>ANDEKS™ AUTHORITY</span></div>
      </div>
    </section>
    <section className="cards">
      <article><p className="eyebrow">HOW THIS GOVERNANCE WORKS</p><h2>Separate authority is a control, not an inconvenience.</h2><p>TA-14 and ANDEKS™ remain independently attributable. A valid object, boundary, or authorization on one side does not silently become authority on the other.</p></article>
      <article><p className="eyebrow">PRESERVED EXAMINATION</p><h2>TA-14-ANDEKS-IE-2026-001</h2><p><b>SUPPORTED INTEROPERABILITY — DOCUMENTARY GOVERNANCE-INTERFACE ONLY.</b> The limitation travels with the finding.</p><Link href="/artifacts/ta14-andeks-ie-2026-001">OPEN INTERACTIVE EXAMINATION →</Link></article>
      <article><p className="eyebrow">NEGATIVE SPACE</p><h2>What this record does not establish.</h2><p>No runtime interoperability. No API compatibility. No deployment readiness. No certification. No joint methodology. No pilot authorization.</p></article>
    </section>
    <section className="close"><h2>Presentation can become richer. The preserved finding does not change.</h2><Link href="/artifacts/ta14-andeks-ie-2026-001">Inspect the frozen examination record →</Link></section>
    <style jsx>{`
      :global(*){box-sizing:border-box}:global(body){margin:0;background:#02060b;color:#edf9ff;font-family:Inter,system-ui,sans-serif}:global(a){color:inherit;text-decoration:none}.shell{min-height:100vh;background:radial-gradient(circle at 80% 5%,#073b55 0,transparent 28%),linear-gradient(180deg,#02060b,#06131f 55%,#02060b)}header{padding:22px 5vw;display:flex;justify-content:space-between;border-bottom:1px solid #163246;color:#9edff5;font-size:.78rem;letter-spacing:.12em}.hero,.lab,.cards,.close{max-width:1400px;margin:auto;padding-left:5vw;padding-right:5vw}.hero{padding-top:90px;padding-bottom:45px}.eyebrow{font-size:.7rem;letter-spacing:.15em;color:#74dfff}.hero h1{font-size:clamp(3rem,6vw,6.5rem);line-height:.92;max-width:1050px;margin:10px 0 22px}.lede{max-width:900px;color:#b5ccd8;font-size:1.08rem;line-height:1.7}.notice{margin-top:28px;padding:16px;border:1px solid #7b6332;border-radius:14px;color:#f1c96d;background:#191508}.lab{display:grid;grid-template-columns:.7fr 1.3fr;gap:18px;padding-bottom:30px}.controls,.state,.cards article{border:1px solid #17394c;border-radius:20px;background:#06111b;padding:24px}.controls button{width:100%;text-align:left;margin:5px 0;padding:13px;border:1px solid #20475c;border-radius:11px;background:#071722;color:#bad4df;cursor:pointer}.controls button.active{border-color:#74dfff;color:white;background:#0b3142}.state h2{font-size:2.3rem;margin:8px 0}.state strong{display:inline-block;padding:8px 11px;border:1px solid #4d9c82;border-radius:9px;color:#77efbd}.state>p:last-of-type{color:#b6cbd6;line-height:1.7}.seam{margin-top:35px;display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:8px;align-items:center;text-align:center}.seam span,.seam b{padding:18px 10px;border:1px solid #245067;border-radius:12px;font-size:.72rem}.seam b{border-color:#8b7136;color:#f1c96d}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding-bottom:55px}.cards h2{font-size:1.6rem}.cards p{color:#aec4d0;line-height:1.65}.cards a,.close a{color:#74dfff;font-weight:800}.close{padding-top:45px;padding-bottom:90px;border-top:1px solid #17394c}.close h2{font-size:clamp(2rem,4vw,4rem);max-width:900px}@media(max-width:850px){.lab,.cards{grid-template-columns:1fr}.seam{grid-template-columns:1fr}.hero{padding-top:55px}header{gap:15px;flex-wrap:wrap}}
    `}</style>
  </main>
}
