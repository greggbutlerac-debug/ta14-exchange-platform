"use client";

import Link from "next/link";
import { useState } from "react";

type Scenario = "baseline" | "unknown" | "coverage" | "revalidated";

const states: Record<Scenario, {label:string; result:string; tone:string; explanation:string; habits:string; ta14:string}> = {
  baseline: {
    label:"DECLARED CONDITIONS SATISFIED",
    result:"EXAMINATION OPEN",
    tone:"#78dfff",
    explanation:"The proposed action satisfies the declared governing predicates and the admitted evidence is current. That establishes a starting point for examination — not yet a claim that the consequence is fully covered.",
    habits:"HABITS QUESTION · Do the governing predicates adequately account for the living reality the proposed execution will affect?",
    ta14:"TA-14 QUESTION · Does the available record establish sufficient present standing for this exact consequence?"
  },
  unknown: {
    label:"MATERIAL UNKNOWN REVEALED",
    result:"HOLD",
    tone:"#f4ba54",
    explanation:"A materially affected condition exists outside the declared predicates. The original predicates may still be satisfied, but the evidence no longer establishes sufficient coverage for consequence.",
    habits:"HABITS BURDEN · Predicate support and consequence coverage remain distinct evidentiary questions.",
    ta14:"TA-14 DETERMINATION · HOLD. Material uncertainty prevents the present record from supporting protected execution."
  },
  coverage: {
    label:"UNKNOWN BOUNDED IN RECORD",
    result:"REVALIDATE",
    tone:"#b8e986",
    explanation:"The previously missing condition has been brought into the examination record. The system does not silently resume. The governing basis must be evaluated again against the expanded reality.",
    habits:"HABITS EXAMINATION · Test whether the governing predicates now adequately account for the materially affected reality.",
    ta14:"TA-14 EXAMINATION · Re-establish continuity, admissibility, binding, and present standing before commit."
  },
  revalidated: {
    label:"CURRENT COVERAGE ESTABLISHED",
    result:"ALLOW · BOUNDED",
    tone:"#7ff0bd",
    explanation:"For this demonstration, the expanded record now supports the declared predicates and the material condition has been bounded for the proposed consequence. The result remains limited to the examined state.",
    habits:"HABITS SIDE · The coverage question has been answered for the bounded examination object represented here.",
    ta14:"TA-14 SIDE · ALLOW is bound to the present evidence, actor, target, scope, conditions, and consequence — not permanent permission."
  }
};

const steps = [
  ["01","PROPOSED ACTION","Define the exact consequence under examination."],
  ["02","EVIDENCE","Admit the current evidence supporting the proposed action."],
  ["03","GOVERNING PREDICATES","Identify the conditions the governance model says must hold."],
  ["04","LIVING REALITY","Ask what materially affected conditions exist beyond those predicates."],
  ["05","MATERIAL UNKNOWNS","Expose uncertainty instead of converting absence into permission."],
  ["06","DETERMINATION","Bind ALLOW / HOLD / DENY / ESCALATE to the examined state."],
];

export default function HabitsTa14InteroperabilityLab(){
  const [scenario,setScenario] = useState<Scenario>("baseline");
  const current = states[scenario];
  return <main className="page"><div className="wrap">
    <nav><Link href="/">TA-14 EXCHANGE</Link><Link href="/governance-showcase">GOVERNANCE SHOWCASE →</Link></nav>

    <header>
      <p className="eyebrow">HABITS × TA-14 · INTEROPERABILITY EXAMINATION LAB</p>
      <h1>Every declared condition can pass — and reality can still be incomplete.</h1>
      <p className="lede">A bounded interactive examination of a question raised by HABITS Institute: how is it established that governing predicates adequately account for the living reality a proposed execution will affect? TA-14 meets that question at the consequence boundary without absorbing HABITS or asking HABITS to absorb TA-14.</p>
      <div className="badges"><b>PROPOSED EXAMINATION SURFACE</b><b>SEPARATE ARCHITECTURAL RESPONSIBILITIES</b><b>NO CLAIM OF HABITS ENDORSEMENT</b></div>
    </header>

    <section>
      <p className="eyebrow">THE INTEROPERABILITY SEAM</p>
      <h2>Two neighboring evidentiary burdens.</h2>
      <div className="split">
        <article><span>HABITS</span><h3>Did the predicates cover the living reality?</h3><p>Current evidence may support every declared predicate while a materially affected condition remains outside the predicate set. The examination asks whether the governance basis adequately covers the consequence-bearing reality.</p></article>
        <div className="meet">MEET<br/>HERE</div>
        <article><span>TA-14</span><h3>Does present standing support consequence?</h3><p>TA-14 asks whether the available record, continuity, admissibility, binding, authority, scope, and present conditions are sufficient for the exact protected consequence before commit.</p></article>
      </div>
      <div className="rule">CONTINUING AUTHORITY DOES NOT BY ITSELF ESTABLISH PRESENT ADMISSIBILITY. PRESENT ADMISSIBILITY DOES NOT GRANT AN UNAUTHORIZED ACTOR EXECUTION AUTHORITY.</div>
    </section>

    <section id="lab">
      <p className="eyebrow">INTERACTIVE EXAMINATION</p>
      <h2>Start with everything declared as satisfied. Then reveal what the predicates did not see.</h2>
      <div className="steps">{steps.map(([n,t,p])=><div className="step" key={n}><b>{n}</b><div><strong>{t}</strong><p>{p}</p></div></div>)}</div>

      <div className="console" style={{borderColor:current.tone}}>
        <div className="consoleTop"><div><small>CURRENT STATE</small><strong style={{color:current.tone}}>{current.label}</strong></div><div className="result" style={{color:current.tone,borderColor:current.tone}}>{current.result}</div></div>
        <p>{current.explanation}</p>
        <div className="burdens"><div>{current.habits}</div><div>{current.ta14}</div></div>
        <div className="controls">
          <button onClick={()=>setScenario("baseline")}>RESET DECLARED STATE</button>
          <button className="primary" onClick={()=>setScenario("unknown")}>REVEAL MATERIAL UNKNOWN</button>
          <button onClick={()=>setScenario("coverage")}>BOUND UNKNOWN IN RECORD</button>
          <button onClick={()=>setScenario("revalidated")}>REVALIDATE CURRENT STATE</button>
        </div>
      </div>
    </section>

    <section>
      <p className="eyebrow">WHAT THE HOLD MEANS</p>
      <h2>The predicates did not necessarily fail. The evidence may have been incomplete for the consequence.</h2>
      <div className="grid">
        <article><b>NOT A RETROACTIVE FAILURE</b><p>A material UNKNOWN does not automatically prove the original predicates were false. It establishes that satisfying them may not have been sufficient to cover the affected reality.</p></article>
        <article><b>NO SILENT CORRECTION</b><p>The missing condition is preserved as a changed examination state. Revalidation is explicit rather than hidden inside implementation behavior.</p></article>
        <article><b>NO ARCHITECTURE MERGER</b><p>HABITS retains responsibility for its claims and questions. TA-14 retains responsibility for its determinations. Interoperability occurs at the defined evidentiary seam.</p></article>
        <article><b>NO PERMANENT ALLOW</b><p>Any positive determination remains bound to the evidence and conditions actually examined. A later material change begins a new standing question.</p></article>
      </div>
    </section>

    <section>
      <p className="eyebrow">PROPOSED JOINT EXAMINATION OBJECT</p>
      <h2>One action. One evidence set. One predicate set. One material UNKNOWN.</h2>
      <p className="lede">A formal examination can begin with a proposed consequence, the evidence and governing predicates supplied to the boundary, the treatment of material UNKNOWNs, and the mechanism by which the resulting determination binds or prevents the next execution.</p>
      <div className="chain">{["PROPOSED ACTION","EVIDENCE","PREDICATES","MATERIAL UNKNOWN","COVERAGE TEST","TA-14 STANDING","DETERMINATION","NEXT EXECUTION"].map(x=><span key={x}>{x}</span>)}</div>
    </section>

    <footer><b>EXAMINATION PRINCIPLE</b><br/>Evidence that supports a declared predicate is not automatically evidence that the predicate set sufficiently covers the reality a consequence will affect.</footer>
  </div><style>{`
    *{box-sizing:border-box}body{margin:0}.page{min-height:100vh;background:radial-gradient(circle at 8% 0,#173a5d77,transparent 30%),radial-gradient(circle at 92% 12%,#6d4d1f55,transparent 26%),linear-gradient(#02070d,#071522 55%,#02070d);color:#eef5fb;font-family:Arial,sans-serif}.wrap{width:min(1180px,calc(100% - 34px));margin:auto;padding-bottom:80px}nav{height:76px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ffffff16}a{color:#9dd6fa;text-decoration:none;font-size:11px;font-weight:900;letter-spacing:.08em}header{padding:78px 0 56px}.eyebrow{color:#f2c66d;font-size:10px;font-weight:950;letter-spacing:.17em}h1{max-width:1080px;font:clamp(48px,7vw,88px)/.97 Georgia,serif;letter-spacing:-.04em;margin:18px 0 25px}h2{max-width:1000px;font:clamp(34px,5vw,58px)/1.04 Georgia,serif;margin:12px 0 28px}.lede{max-width:930px;color:#a7bdcc;font-size:18px;line-height:1.72}.badges{display:flex;gap:8px;flex-wrap:wrap;margin-top:28px}.badges b{padding:8px 11px;border:1px solid #f2c66d44;border-radius:999px;color:#f2c66d;font-size:9px}section{padding:62px 0;border-top:1px solid #ffffff14}.split{display:grid;grid-template-columns:1fr 100px 1fr;gap:14px;align-items:stretch}.split article,.grid article{padding:25px;border:1px solid #ffffff18;border-radius:18px;background:#07131fbb}.split span,.grid b{color:#78dfff;font-size:10px;letter-spacing:.13em}.split h3{font:28px/1.1 Georgia,serif;margin:10px 0}.split p,.grid p{color:#9fb5c4;line-height:1.65}.meet{display:grid;place-items:center;text-align:center;color:#f2c66d;font-weight:950;font-size:10px;letter-spacing:.12em;border:1px dashed #f2c66d55;border-radius:18px}.rule{margin-top:16px;padding:18px;border-left:3px solid #f2c66d;background:#f2c66d10;color:#e8d7af;font-weight:850;line-height:1.5}.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:28px 0}.step{display:flex;gap:13px;padding:18px;border:1px solid #ffffff15;border-radius:14px;background:#06111c}.step>b{color:#f2c66d}.step strong{font-size:11px;letter-spacing:.08em}.step p{color:#829aaa;font-size:13px;line-height:1.5;margin:7px 0 0}.console{padding:28px;border:1px solid;border-radius:20px;background:#02080ddd;transition:.2s}.consoleTop{display:flex;justify-content:space-between;gap:20px;align-items:center}.consoleTop small,.consoleTop strong{display:block}.consoleTop small{color:#6f899b;font-size:9px;font-weight:900;letter-spacing:.14em}.consoleTop strong{font-size:16px;margin-top:6px}.result{padding:12px 16px;border:1px solid;border-radius:999px;font-weight:950;font-size:12px;letter-spacing:.08em}.console>p{color:#afc0cc;line-height:1.7;max-width:900px}.burdens{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}.burdens div{padding:16px;border:1px solid #ffffff12;border-radius:12px;color:#b9c9d3;font-size:12px;line-height:1.55}.controls{display:flex;gap:9px;flex-wrap:wrap}.controls button{cursor:pointer;background:#0b1a27;color:#cce2ef;border:1px solid #ffffff22;border-radius:10px;padding:12px 14px;font-weight:900;font-size:10px;letter-spacing:.05em}.controls button.primary{background:#f2c66d;color:#151006;border-color:#f2c66d}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;margin-top:28px}.chain span{padding:12px 5px;text-align:center;border:1px solid #78dfff33;border-radius:8px;color:#9bdcff;font-size:8px;font-weight:900}footer{margin-top:30px;padding:28px;border:1px solid #f2c66d33;border-radius:18px;color:#d8c49b;line-height:1.6}footer b{color:#f2c66d;letter-spacing:.12em;font-size:10px}@media(max-width:800px){.split{grid-template-columns:1fr}.meet{min-height:70px}.steps,.grid{grid-template-columns:1fr}.burdens{grid-template-columns:1fr}.chain{grid-template-columns:repeat(2,1fr)}.consoleTop{align-items:flex-start;flex-direction:column}}
  `}</style></main>
}
