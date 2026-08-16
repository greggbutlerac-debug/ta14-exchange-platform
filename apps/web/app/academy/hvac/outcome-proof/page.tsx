"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Metric = { label: string; baseline: string; post: string; direction: "better" | "same" | "unresolved" };

const metrics: Metric[] = [
  { label: "Total external static pressure", baseline: "0.82 in. w.c.", post: "0.54 in. w.c.", direction: "better" },
  { label: "Return-to-supply temperature difference", baseline: "23.8°F", post: "19.6°F", direction: "better" },
  { label: "Compressor current", baseline: "14.2 A", post: "11.8 A", direction: "better" },
  { label: "Condenser discharge-air rise", baseline: "18.4°F", post: "13.1°F", direction: "better" },
  { label: "Refrigerant charge condition", baseline: "Not admissibly determined", post: "Still not determined", direction: "unresolved" },
];

const choices = [
  { id: "a", text: "The system is completely repaired and all possible HVAC faults have been eliminated.", correct: false },
  { id: "b", text: "The preserved post-state supports that the documented airflow and heat-rejection restrictions improved after the bounded intervention; unresolved conditions remain outside the claim.", correct: true },
  { id: "c", text: "Because every measured operating indicator improved, the original restrictions are proven to have been the only causes of the homeowner complaint.", correct: false },
  { id: "d", text: "The repair can be closed without a comparison because the intervention corrected two visibly abnormal conditions and the equipment is still operating.", correct: false },
];

export default function OutcomeProofLab() {
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [proved, setProved] = useState(false);
  const correct = useMemo(() => choices.find((c) => c.id === selected)?.correct ?? false, [selected]);

  function submit() {
    if (!selected) return;
    setAttempts((n) => n + 1);
    if (correct) setProved(true);
  }

  return (
    <main className="lab">
      <div className="shell">
        <nav><Link href="/academy/hvac">← HVAC WORLD</Link><Link href="/atlas-14-step-field-ops-lab">14-STEP FIELD OPS</Link></nav>
        <header>
          <small>TA-14 ACADEMY // HVAC // OUTCOME PROOF LAB</small>
          <h1>Finishing the repair does not prove the repair worked.</h1>
          <p>Build the post-intervention record, compare it to the preserved baseline, and make only the outcome claim the evidence can support.</p>
        </header>

        <section className="route">
          {["Original HVAC Performance Record","Evidence-Based Intervention","HVAC Post-Performance Record","Baseline Comparison","Supported Outcome"].map((x,i)=><div key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></div>)}
        </section>

        <section>
          <div className="sectionHead"><span>CASE</span><h2>Bounded intervention</h2></div>
          <div className="case"><p>The original record preserved excessive external static pressure, a loaded return filter, restricted condenser airflow, elevated compressor current, and abnormal temperature evidence. The declared determination supported correcting the documented airflow and heat-rejection restrictions. No refrigerant was added or removed.</p><strong>Intervention performed:</strong><p>Return filter replaced with the specified replacement; condenser coil cleaned. System stabilized before comparable post-state measurements were collected.</p></div>
        </section>

        <section>
          <div className="sectionHead"><span>PROOF</span><h2>Baseline → post-state comparison</h2></div>
          <div className="table"><div className="row head"><span>Metric</span><span>Original record</span><span>Post record</span><span>State</span></div>{metrics.map(m=><div className="row" key={m.label}><strong>{m.label}</strong><span>{m.baseline}</span><span>{m.post}</span><em className={m.direction}>{m.direction.toUpperCase()}</em></div>)}</div>
        </section>

        <section>
          <div className="sectionHead"><span>GATE</span><h2>Which outcome statement is admissible?</h2></div>
          <p className="lead">Do not choose the most reassuring sentence. Choose the statement whose scope matches the preserved comparison.</p>
          <div className="choices">{choices.map(c=><button key={c.id} className={selected===c.id?"selected":""} onClick={()=>setSelected(c.id)} disabled={proved}><b>{c.id.toUpperCase()}</b><span>{c.text}</span></button>)}</div>
          <button className="submit" onClick={submit} disabled={!selected||proved}>COMMIT OUTCOME DETERMINATION</button>
          {attempts>0&&!proved&&<div className="feedback fail"><b>NOT ADMISSIBLE.</b> The statement exceeds, bypasses, or collapses the preserved evidence boundary. Re-read what changed and what remains unresolved.</div>}
          {proved&&<div className="feedback pass"><b>OUTCOME PROVED.</b> The claim corresponds to the baseline, intervention, post-state, and unresolved boundary. Improvement is supported without manufacturing completeness.</div>}
        </section>

        <section className="rules">
          <div><b>01</b><span>No baseline, no defensible comparison.</span></div><div><b>02</b><span>No comparable post-state, no verified improvement.</span></div><div><b>03</b><span>Improvement does not prove every cause.</span></div><div><b>04</b><span>Unresolved conditions remain unresolved.</span></div><div><b>05</b><span>The outcome claim cannot exceed the record.</span></div>
        </section>

        <footer><strong>Evidence before intervention. Outcome evidence after execution.</strong><Link href="/atlas-14-step-field-ops-lab">RUN THE FULL 7 IN / 7 OUT ROUTE →</Link></footer>
      </div>
      <style>{`
        .lab{min-height:100vh;background:radial-gradient(circle at 15% 0,rgba(37,205,232,.13),transparent 28%),radial-gradient(circle at 90% 20%,rgba(47,225,150,.09),transparent 24%),#030a11;color:#eef8ff;font-family:Inter,system-ui,sans-serif}.lab *{box-sizing:border-box}.shell{width:min(1120px,calc(100% - 36px));margin:auto;padding:24px 0 70px}nav{display:flex;justify-content:space-between;border-bottom:1px solid #173044;padding-bottom:20px}nav a{color:#65e8ff;text-decoration:none;font-size:.68rem;font-weight:900;letter-spacing:.1em}header{max-width:980px;padding:70px 0 46px}header small{color:#45e6a2;font-weight:900;letter-spacing:.14em}h1{font-size:clamp(2.7rem,7vw,5.7rem);line-height:.95;letter-spacing:-.05em;margin:13px 0 18px}header p,.lead{color:#91a8b8;font-size:1.05rem;line-height:1.65;max-width:800px}.route{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:0}.route div{min-height:120px;padding:15px;border:1px solid #19384b;border-radius:14px;background:#07131d}.route b{color:#49e2ff;font-size:.68rem}.route span{display:block;margin-top:27px;font-size:.8rem;font-weight:850;line-height:1.4}section{margin-top:58px}.sectionHead{display:flex;gap:14px;align-items:center;margin-bottom:18px}.sectionHead>span{border:1px solid #275267;border-radius:999px;padding:8px 10px;color:#57e7ff;font-size:.62rem;font-weight:950;letter-spacing:.1em}.sectionHead h2{margin:0;font-size:1.65rem}.case{padding:25px;border:1px solid #1b4253;border-left:4px solid #39e6a0;border-radius:14px;background:#07151d}.case p{color:#a2b5c1;line-height:1.65}.case strong{color:#65f1b5}.table{border:1px solid #18394b;border-radius:15px;overflow:hidden}.row{display:grid;grid-template-columns:1.5fr 1fr 1fr .7fr;gap:12px;align-items:center;padding:15px 18px;border-top:1px solid #132c3b;background:#06121b;font-size:.78rem}.row:first-child{border-top:0}.row.head{color:#6f8b9d;background:#091a25;font-size:.62rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.row strong{color:#dceaf2}.row span{color:#9db0bd}.row em{font-style:normal;font-size:.61rem;font-weight:950}.better{color:#52e8a8}.same{color:#f0c35a}.unresolved{color:#ffba67}.choices{display:grid;gap:10px}.choices button{display:grid;grid-template-columns:38px 1fr;gap:13px;text-align:left;padding:18px;border:1px solid #1b3b4d;border-radius:13px;background:#07131d;color:#b7c7d2;cursor:pointer}.choices button:hover,.choices button.selected{border-color:#50dff7;background:#09202a}.choices button b{color:#59e6ff}.choices button span{line-height:1.55}.submit{margin-top:16px;padding:15px 20px;border:0;border-radius:11px;background:#45e6a2;color:#032116;font-weight:950;letter-spacing:.06em;cursor:pointer}.submit:disabled{opacity:.35;cursor:not-allowed}.feedback{margin-top:14px;padding:18px;border-radius:12px;line-height:1.55}.feedback.fail{border:1px solid #65323b;background:#211016;color:#efb3ba}.feedback.pass{border:1px solid #216345;background:#082419;color:#aef0cf}.rules{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.rules div{min-height:120px;padding:16px;border:1px solid #19384b;border-radius:13px;background:#06121b}.rules b{color:#47e2ff}.rules span{display:block;margin-top:22px;font-size:.77rem;line-height:1.45;color:#a7bac6}footer{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-top:60px;padding-top:25px;border-top:1px solid #173044}footer strong{color:#dceaf2}footer a{color:#64e8ff;text-decoration:none;font-size:.72rem;font-weight:950;letter-spacing:.07em}@media(max-width:800px){.route,.rules{grid-template-columns:1fr 1fr}.row{grid-template-columns:1fr 1fr}.row.head{display:none}footer{align-items:flex-start;flex-direction:column}}@media(max-width:500px){.route,.rules{grid-template-columns:1fr}.row{grid-template-columns:1fr}.shell{width:calc(100% - 22px)}nav{gap:15px;flex-direction:column}}
      `}</style>
    </main>
  );
}
