"use client";

import Link from "next/link";
import { useState } from "react";

type Stage = 0|1|2|3;

const stageData = [
 {label:"DECLARED CONDITIONS SATISFIED",result:"EXAMINATION OPEN",tone:"#78dfff",explanation:"The proposed action satisfies the declared governing predicates and the admitted evidence is current. That is the examination starting state — not proof that the predicate set covers every material part of the affected reality."},
 {label:"MATERIAL UNKNOWN REVEALED",result:"HOLD · EXECUTION PREVENTED",tone:"#f4ba54",explanation:"A materially affected ecological condition exists outside the declared decision boundary. The declared predicates have not been retroactively falsified. The record is insufficient for protected consequence."},
 {label:"UNKNOWN BOUNDED IN RECORD",result:"REVALIDATION REQUIRED",tone:"#b8e986",explanation:"The missing condition is now explicit evidence. Nothing silently resumes. Both the coverage question and TA-14 present standing must be examined again against the expanded record."},
 {label:"CURRENT COVERAGE REVALIDATED",result:"ALLOW · BOUNDED",tone:"#7ff0bd",explanation:"For this proposed demonstration state, the expanded record supports the material condition and present standing. ALLOW remains bounded to this examination state and is not permanent permission."}
];

const ledger = [
 ["E-01","Declared governing predicates satisfied"],
 ["E-02","Material ecological condition revealed outside decision boundary"],
 ["HABITS","Predicate coverage of affected reality unresolved"],
 ["TA-14","Present standing insufficient for protected consequence"],
 ["DETERMINATION","HOLD"],
 ["EXECUTION","PREVENTED"],
 ["E-03","Material UNKNOWN admitted and bounded in examination record"],
 ["REVALIDATION","Coverage and present standing examined against expanded record"],
 ["DETERMINATION","ALLOW · BOUNDED"]
];

export default function Page(){
 const [stage,setStage]=useState<Stage>(0);
 const s=stageData[stage];
 const reset=()=>setStage(0);
 return <main className="page"><div className="wrap">
  <nav><Link href="/">TA-14 EXCHANGE</Link><Link href="/governance-showcase">GOVERNANCE SHOWCASE →</Link></nav>
  <header>
   <p className="eyebrow">HABITS × TA-14 · INTEROPERABILITY EXAMINATION LAB</p>
   <h1>Every declared condition can pass — and reality can still be incomplete.</h1>
   <p className="lede">A proposed bounded examination of the question raised by HABITS Institute: how is it established that governing predicates adequately account for the living reality a proposed execution will affect? The surface preserves separate architectural responsibilities and does not presume the interoperability result.</p>
   <div className="badges"><b>PROPOSED JOINT EXAMINATION</b><b>SEPARATE ARCHITECTURAL RESPONSIBILITIES</b><b>NO INTEROPERABILITY FINDING YET</b></div>
  </header>

  <section><p className="eyebrow">THE INTEROPERABILITY SEAM</p><h2>Two neighboring evidentiary burdens.</h2>
   <div className="split">
    <article><span>HABITS</span><h3>Did the predicates cover the living reality?</h3><p>Current evidence may support every declared predicate while a materially affected condition remains outside the predicate set. The examination asks whether the governance basis adequately covers the consequence-bearing reality.</p></article>
    <div className="meet">MEET<br/>HERE</div>
    <article><span>TA-14</span><h3>Does present standing support consequence?</h3><p>TA-14 asks whether the available record, continuity, admissibility, binding, authority, scope, and present conditions are sufficient for the exact protected consequence before commit.</p></article>
   </div>
   <div className="rule">THE RESULT IS NOT PREDETERMINED. This surface proposes an examination object. Neither HABITS nor TA-14 receives a positive interoperability finding unless the frozen record supports one.</div>
  </section>

  <section id="lab"><p className="eyebrow">BOUNDED EXECUTION SCENARIO</p><h2>One proposed intervention. One declared decision boundary. One material condition outside it.</h2>
   <div className="scenario">
    <div><small>PROPOSED ACTION</small><strong>Execute an environmental intervention affecting a living ecological system.</strong></div>
    <div><small>DECLARED STATE</small><strong>Every declared governing predicate is satisfied and supporting evidence is current.</strong></div>
    <div><small>EXAMINATION VARIABLE</small><strong>A materially affected ecological condition exists outside the declared decision boundary.</strong></div>
   </div>
   <p className="note">This is a deliberately narrow proposed examination object derived from the question HABITS raised. The specific intervention, predicates, evidence, and ecological condition remain to be frozen jointly before any formal finding.</p>

   <div className="flow">
    {["PROPOSED ACTION","EVIDENCE","PREDICATES","MATERIAL UNKNOWN","HABITS COVERAGE","TA-14 STANDING","DETERMINATION","EXECUTION"].map((x,i)=>{
      const active = stage===0 ? i<3 : stage===1 ? i<8 : i<8;
      const stop = stage===1 && (i===3||i===6||i===7);
      return <div key={x} className={"node "+(active?"active ":"")+(stop?"stop":"")}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span>{stage===1&&i===6?<em>HOLD</em>:stage===1&&i===7?<em>PREVENTED</em>:null}</div>
    })}
   </div>

   <div className="console" style={{borderColor:s.tone}}>
    <div className="consoleTop"><div><small>CURRENT STATE</small><strong style={{color:s.tone}}>{s.label}</strong></div><div className="result" style={{color:s.tone,borderColor:s.tone}}>{s.result}</div></div>
    <p>{s.explanation}</p>
    <div className="burdens">
     <div><b>HABITS QUESTION</b><br/>{stage===0?"Do the governing predicates adequately account for the living reality the proposed execution will affect?":stage===1?"Coverage remains unresolved because a material ecological condition is outside the declared decision boundary.":stage===2?"Re-examine predicate adequacy against the expanded reality.":"Coverage is represented here as established only for the bounded demonstration state."}</div>
     <div><b>TA-14 QUESTION</b><br/>{stage===0?"Does the available record establish sufficient present standing for this exact consequence?":stage===1?"No. HOLD preserves the unresolved material condition before consequence.":stage===2?"Re-establish continuity, admissibility, binding, and present standing before commit.":"ALLOW is bound to the current evidence, actor, target, scope, conditions, and consequence."}</div>
    </div>
    <div className="controls">
     <button onClick={reset}>RESET EXAMINATION</button>
     <button className="primary" disabled={stage!==0} onClick={()=>setStage(1)}>1 · REVEAL MATERIAL UNKNOWN</button>
     <button disabled={stage!==1} onClick={()=>setStage(2)}>2 · BOUND UNKNOWN IN RECORD</button>
     <button disabled={stage!==2} onClick={()=>setStage(3)}>3 · REVALIDATE CURRENT STATE</button>
    </div>
   </div>
  </section>

  <section><p className="eyebrow">EXAMINATION LEDGER</p><h2>The state change becomes a record.</h2>
   <div className="ledger">{ledger.slice(0,stage===0?1:stage===1?6:stage===2?7:9).map(([id,text],i)=><div key={i}><b>{id}</b><span>{text}</span></div>)}</div>
   <p className="note">The ledger is illustrative until the examination object is jointly frozen. It demonstrates the intended record discipline: no material UNKNOWN disappears merely because execution later becomes admissible.</p>
  </section>

  <section><p className="eyebrow">WHAT THE HOLD MEANS</p><h2>The predicates did not necessarily fail. The evidence may have been incomplete for the consequence.</h2>
   <div className="grid">
    <article><b>NOT A RETROACTIVE FAILURE</b><p>A material UNKNOWN does not automatically prove the original predicates were false. It establishes that satisfying them may not have been sufficient to cover the affected reality.</p></article>
    <article><b>NO SILENT CORRECTION</b><p>The missing condition is preserved as a changed examination state. Revalidation is explicit rather than hidden inside implementation behavior.</p></article>
    <article><b>NO ARCHITECTURE MERGER</b><p>HABITS retains responsibility for its claims and questions. TA-14 retains responsibility for its determinations. Any interoperability finding must remain bounded to the defined seam.</p></article>
    <article><b>NO PERMANENT ALLOW</b><p>Any positive determination remains bound to the evidence and conditions actually examined. A later material change begins a new standing question.</p></article>
   </div>
  </section>

  <section><p className="eyebrow">PROPOSED JOINT FREEZE</p><h2>What we would freeze before a formal examination.</h2>
   <div className="chain">{["EXECUTION SCENARIO","PROPOSED CONSEQUENCE","GOVERNING PREDICATES","ADMITTED EVIDENCE","MATERIAL UNKNOWN","HABITS RESPONSIBILITY","TA-14 RESPONSIBILITY","HOLD / REVALIDATION CONDITIONS"].map(x=><span key={x}>{x}</span>)}</div>
  </section>
  <footer><b>EXAMINATION PRINCIPLE</b><br/>Evidence that supports a declared predicate is not automatically evidence that the predicate set sufficiently covers the reality a consequence will affect.</footer>
 </div><style>{`
 *{box-sizing:border-box}body{margin:0}.page{min-height:100vh;background:radial-gradient(circle at 8% 0,#173a5d77,transparent 30%),radial-gradient(circle at 92% 12%,#6d4d1f55,transparent 26%),linear-gradient(#02070d,#071522 55%,#02070d);color:#eef5fb;font-family:Arial,sans-serif}.wrap{width:min(1180px,calc(100% - 34px));margin:auto;padding-bottom:80px}nav{height:76px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ffffff16}a{color:#9dd6fa;text-decoration:none;font-size:11px;font-weight:900;letter-spacing:.08em}header{padding:78px 0 56px}.eyebrow{color:#f2c66d;font-size:10px;font-weight:950;letter-spacing:.17em}h1{max-width:1080px;font:clamp(48px,7vw,88px)/.97 Georgia,serif;letter-spacing:-.04em;margin:18px 0 25px}h2{max-width:1000px;font:clamp(34px,5vw,58px)/1.04 Georgia,serif;margin:12px 0 28px}.lede{max-width:930px;color:#a7bdcc;font-size:18px;line-height:1.72}.badges{display:flex;gap:8px;flex-wrap:wrap;margin-top:28px}.badges b{padding:8px 11px;border:1px solid #f2c66d44;border-radius:999px;color:#f2c66d;font-size:9px}section{padding:62px 0;border-top:1px solid #ffffff14}.split{display:grid;grid-template-columns:1fr 100px 1fr;gap:14px}.split article,.grid article{padding:25px;border:1px solid #ffffff18;border-radius:18px;background:#07131fbb}.split span,.grid b{color:#78dfff;font-size:10px;letter-spacing:.13em}.split h3{font:28px/1.1 Georgia,serif;margin:10px 0}.split p,.grid p{color:#9fb5c4;line-height:1.65}.meet{display:grid;place-items:center;text-align:center;color:#f2c66d;font-weight:950;font-size:10px;letter-spacing:.12em;border:1px dashed #f2c66d55;border-radius:18px}.rule{margin-top:16px;padding:18px;border-left:3px solid #f2c66d;background:#f2c66d10;color:#e8d7af;font-weight:850;line-height:1.5}.scenario{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.scenario div{padding:20px;border:1px solid #ffffff18;border-radius:15px;background:#06111c}.scenario small{display:block;color:#f2c66d;font-size:9px;font-weight:900;letter-spacing:.12em;margin-bottom:9px}.scenario strong{font-size:14px;line-height:1.5}.note{color:#829aaa;line-height:1.6;font-size:13px}.flow{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;margin:30px 0}.node{min-height:86px;padding:11px 7px;border:1px solid #ffffff13;border-radius:9px;color:#617787;display:flex;flex-direction:column;gap:7px}.node b{font-size:8px}.node span{font-size:8px;font-weight:900;line-height:1.3}.node.active{border-color:#78dfff44;color:#9bdcff}.node.stop{border-color:#f4ba5488;color:#f4ba54;background:#f4ba540d}.node em{font-style:normal;font-size:8px;font-weight:950;color:#f4ba54}.console{padding:28px;border:1px solid;border-radius:20px;background:#02080ddd;transition:.2s}.consoleTop{display:flex;justify-content:space-between;gap:20px;align-items:center}.consoleTop small,.consoleTop strong{display:block}.consoleTop small{color:#6f899b;font-size:9px;font-weight:900;letter-spacing:.14em}.consoleTop strong{font-size:16px;margin-top:6px}.result{padding:12px 16px;border:1px solid;border-radius:999px;font-weight:950;font-size:12px;letter-spacing:.08em}.console>p{color:#afc0cc;line-height:1.7;max-width:900px}.burdens{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}.burdens div{padding:16px;border:1px solid #ffffff12;border-radius:12px;color:#b9c9d3;font-size:12px;line-height:1.55}.burdens b{color:#78dfff;font-size:9px;letter-spacing:.1em}.controls{display:flex;gap:9px;flex-wrap:wrap}.controls button{cursor:pointer;background:#0b1a27;color:#cce2ef;border:1px solid #ffffff22;border-radius:10px;padding:12px 14px;font-weight:900;font-size:10px;letter-spacing:.05em}.controls button.primary{background:#f2c66d;color:#151006;border-color:#f2c66d}.controls button:disabled{cursor:not-allowed;opacity:.28}.ledger{border:1px solid #ffffff18;border-radius:16px;overflow:hidden}.ledger div{display:grid;grid-template-columns:150px 1fr;gap:15px;padding:14px 18px;border-bottom:1px solid #ffffff10}.ledger div:last-child{border-bottom:0}.ledger b{color:#f2c66d;font-size:10px;letter-spacing:.08em}.ledger span{color:#b6c6d0;font-size:13px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.chain{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.chain span{padding:15px 8px;text-align:center;border:1px solid #78dfff33;border-radius:8px;color:#9bdcff;font-size:8px;font-weight:900}footer{margin-top:30px;padding:28px;border:1px solid #f2c66d33;border-radius:18px;color:#d8c49b;line-height:1.6}footer b{color:#f2c66d;letter-spacing:.12em;font-size:10px}@media(max-width:800px){.split,.scenario{grid-template-columns:1fr}.meet{min-height:70px}.grid,.burdens{grid-template-columns:1fr}.flow{grid-template-columns:repeat(2,1fr)}.chain{grid-template-columns:repeat(2,1fr)}.consoleTop{align-items:flex-start;flex-direction:column}.ledger div{grid-template-columns:1fr;gap:5px}}
 `}</style></main>
}