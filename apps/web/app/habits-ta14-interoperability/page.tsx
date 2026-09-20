"use client";

import Link from "next/link";
import { useState } from "react";

type Stage = 0|1|2|3|4|5;
type ContractCase = "both"|"habits-refuse"|"ta14-hold"|"habits-stale"|"ta14-stale"|"missing"|"unverifiable"|"changed";

const stageData = [
 {label:"DECLARED CONDITIONS SATISFIED",result:"EXAMINATION OPEN",tone:"#78dfff",explanation:"The proposed action satisfies the declared governing predicates and admitted evidence is current. This establishes only the starting state. It does not establish that the decision boundary adequately covers the affected living reality."},
 {label:"ECOLOGICAL CONDITION OBSERVED",result:"EVIDENTIARY STANDING OPEN",tone:"#c49ce8",explanation:"A condition becomes observable through the examination's frozen observation path. It is not evidence deliberately hidden for the demonstration. Its identity, provenance, materiality and standing must now be established."},
 {label:"MATERIALITY + STANDING ESTABLISHED",result:"HABITS UAB DETERMINATION REQUIRED",tone:"#f4ba54",explanation:"The newly observed condition has sufficient evidentiary standing to enter the examination. HABITS now applies its own admissibility responsibility through the UAB. TA-14 does not make that HABITS determination."},
 {label:"HABITS ADMISSIBILITY DOES NOT SUPPORT EXECUTION",result:"HOLD · HABITS BOUNDARY ENFORCES",tone:"#f4ba54",explanation:"For this examination branch, the HABITS UAB determination does not support execution and the HABITS execution boundary enforces that result without the UAB itself executing the action. TA-14 receives only the jointly frozen interface object/state and independently evaluates present standing for consequence."},
 {label:"UNKNOWN ADMITTED · UNCERTAINTY REMAINS",result:"HOLD PRESERVED",tone:"#f4ba54",explanation:"Bringing an UNKNOWN into the record does not resolve it. Revalidation remains open to ALLOW, HOLD, DENY or ESCALATE. In this branch, material uncertainty remains and protected consequence stays stopped."},
 {label:"SUFFICIENT GROUNDS ESTABLISHED",result:"ALLOW · BOUNDED / BYPASS UNPROVEN",tone:"#7ff0bd",explanation:"This branch establishes sufficient grounds for the exact bounded path examined. It does not establish that every alternate route to consequential execution is secured. Boundary adequacy and execution non-bypassability remain separate proof questions."}
];

const ledger = [
 ["E-01","Declared governing predicates satisfied"],
 ["OBS-01","Ecological condition becomes observable through frozen observation path"],
 ["E-02","Identity, provenance, materiality and evidentiary standing established"],
 ["HABITS UAB","Independent admissibility determination recorded"],
 ["HABITS BOUNDARY","UAB result enforced without UAB executing the action"],
 ["INTERFACE","Defined object/state presented across the seam; no permission transfer implied"],
 ["TA-14","Independent present-standing determination for exact consequence"],
 ["UNKNOWN","Admitted to record; resolution not presumed"],
 ["REVALIDATION","ALLOW / HOLD / DENY / ESCALATE remain open"],
 ["NON-BYPASS","Separate examination required for alternate execution paths"]
];

function EnforcementContractLab(){
 const [test,setTest]=useState<ContractCase>("both");
 const cases:Record<ContractCase,{habits:string;ta14:string;iface:string;release:string;why:string}>={
  "both":{habits:"CURRENT · SUPPORTS",ta14:"CURRENT · ALLOW",iface:"VERIFIED + CURRENT",release:"RELEASE ELIGIBLE · BOUNDED PATH",why:"Both independently required determinations and the interface object/state have current standing. Eligibility is limited to the exact jointly examined path and does not prove wider non-bypassability."},
  "habits-refuse":{habits:"CURRENT · REFUSE",ta14:"CURRENT · ALLOW",iface:"VERIFIED + CURRENT",release:"NO RELEASE · HABITS REFUSE",why:"TA-14 ALLOW cannot route around HABITS REFUSE. A positive result from one architecture is not the other's permission."},
  "ta14-hold":{habits:"CURRENT · SUPPORTS",ta14:"CURRENT · HOLD",iface:"VERIFIED + CURRENT",release:"NO RELEASE · TA-14 HOLD",why:"HABITS support cannot route around TA-14 HOLD on the jointly examined path."},
  "habits-stale":{habits:"STALE",ta14:"CURRENT · ALLOW",iface:"VERIFIED + CURRENT",release:"NO RELEASE · STALE DETERMINATION",why:"A stale HABITS determination lacks current standing for final release."},
  "ta14-stale":{habits:"CURRENT · SUPPORTS",ta14:"STALE",iface:"VERIFIED + CURRENT",release:"NO RELEASE · STALE DETERMINATION",why:"A stale TA-14 determination cannot be treated as present authority for consequence."},
  "missing":{habits:"CURRENT · SUPPORTS",ta14:"ABSENT",iface:"INCOMPLETE",release:"NO RELEASE · REQUIRED STATE ABSENT",why:"Absence is not permission. The release boundary remains closed until the required determination exists and is attributable to the same jointly examined state."},
  "unverifiable":{habits:"CURRENT · SUPPORTS",ta14:"CURRENT · ALLOW",iface:"UNVERIFIABLE",release:"NO RELEASE · INTERFACE NOT ESTABLISHED",why:"Two positive determinations cannot establish release if the object/state connecting them cannot itself be verified."},
  "changed":{habits:"CURRENT · SUPPORTS",ta14:"CURRENT · ALLOW",iface:"MATERIAL STATE CHANGED",release:"NO RELEASE · REVALIDATION REQUIRED",why:"A material change before irreversible release invalidates reliance on the prior release-eligible state. The changed state must be re-evaluated."}
 };
 const x=cases[test];
 return <section id="enforcement-contract"><p className="eyebrow">PROPOSED ENFORCEMENT CONTRACT</p><h2>Neither positive result releases execution by itself.</h2>
  <p className="lede small">This lab answers the final pre-freeze question raised by HABITS: what happens when the independent determinations meet, when they differ, or when one is stale, absent or unverifiable? The contract below is proposed for the jointly examined path and remains subject to joint freeze.</p>
  <div className="contractFlow"><div><small>HABITS</small><strong>{x.habits}</strong></div><i>+</i><div><small>INTERFACE OBJECT / STATE</small><strong>{x.iface}</strong></div><i>+</i><div><small>TA-14</small><strong>{x.ta14}</strong></div><i>→</i><div className={x.release.startsWith("RELEASE ELIGIBLE")?"release yes":"release no"}><small>FINAL RELEASE GATE</small><strong>{x.release}</strong></div></div>
  <div className="contractControls">
   <button className={test==="both"?"selected":""} onClick={()=>setTest("both")}>BOTH CURRENT + POSITIVE</button><button className={test==="habits-refuse"?"selected":""} onClick={()=>setTest("habits-refuse")}>HABITS REFUSE + TA-14 ALLOW</button><button className={test==="ta14-hold"?"selected":""} onClick={()=>setTest("ta14-hold")}>HABITS SUPPORT + TA-14 HOLD</button><button className={test==="habits-stale"?"selected":""} onClick={()=>setTest("habits-stale")}>HABITS STALE</button><button className={test==="ta14-stale"?"selected":""} onClick={()=>setTest("ta14-stale")}>TA-14 STALE</button><button className={test==="missing"?"selected":""} onClick={()=>setTest("missing")}>MISSING DETERMINATION</button><button className={test==="unverifiable"?"selected":""} onClick={()=>setTest("unverifiable")}>UNVERIFIABLE INTERFACE</button><button className={test==="changed"?"selected":""} onClick={()=>setTest("changed")}>MATERIAL CHANGE BEFORE RELEASE</button>
  </div>
  <div className="contractWhy"><b>WHY</b><p>{x.why}</p></div>
  <div className="rule">PROPOSED RELEASE RULE · For the jointly examined path, irreversible release remains unavailable unless every required determination and the interface object/state have current, attributable, verifiable standing for the same proposed consequence. This rule does not establish system-wide non-bypassability.</div>
 </section>
}

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
    <article><span>HABITS</span><h3>Does HABITS admit the proposed execution?</h3><p>HABITS retains its own determination responsibility. Its UAB determines admissibility against the affected living reality, and the HABITS execution boundary enforces that result without the UAB itself executing the action.</p></article>
    <div className="meet">MEET<br/>HERE</div>
    <article><span>TA-14</span><h3>What does TA-14 independently determine?</h3><p>TA-14 receives only the jointly defined interface object/state and independently determines whether record, continuity, admissibility, binding, authority, scope and present conditions establish standing for the exact protected consequence. Neither architecture's positive result becomes the other's permission.</p></article>
   </div>
   <div className="rule">THE RESULT IS NOT PREDETERMINED. This surface proposes an examination object. Neither HABITS nor TA-14 receives a positive interoperability finding unless the frozen record supports one.</div>
  </section>

  <section id="lab"><p className="eyebrow">BOUNDED EXECUTION SCENARIO</p><h2>One proposed intervention. One declared decision boundary. One material condition outside it.</h2>
   <div className="scenario">
    <div><small>PROPOSED ACTION</small><strong>Execute an environmental intervention affecting a living ecological system.</strong></div>
    <div><small>DECLARED STATE</small><strong>Every declared governing predicate is satisfied and supporting evidence is current.</strong></div>
    <div><small>EXAMINATION VARIABLE</small><strong>A materially affected ecological condition may exist outside the declared decision boundary; the examination must establish how it becomes observable and earns evidentiary standing.</strong></div>
   </div>
   <p className="note">This is a deliberately narrow proposed examination object derived from the question HABITS raised. The specific intervention, predicates, evidence, and ecological condition remain to be frozen jointly before any formal finding.</p>

   <div className="flow">
    {["PROPOSED ACTION","OBSERVATION","EVIDENTIARY STANDING","HABITS UAB","HABITS ENFORCEMENT","INTERFACE OBJECT","TA-14 DETERMINATION","CONSEQUENCE"].map((x,i)=><div key={x} className={"node "+(i<=Math.min(stage+2,7)?"active ":"")+(stage>=3&&i===7?"stop":"")}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span>{stage>=3&&i===7?<em>{stage===5?"BOUNDED":"PREVENTED"}</em>:null}</div>)}
   </div>

   <div className="console" style={{borderColor:s.tone}}>
    <div className="consoleTop"><div><small>CURRENT STATE</small><strong style={{color:s.tone}}>{s.label}</strong></div><div className="result" style={{color:s.tone,borderColor:s.tone}}>{s.result}</div></div>
    <p>{s.explanation}</p>
    <div className="burdens">
     <div><b>HABITS RESPONSIBILITY</b><br/>{stage<2?"Establish whether the affected reality is adequately represented for HABITS admissibility.":stage===2?"UAB independently determines admissibility from the standing evidence.":"UAB determination and HABITS execution-boundary enforcement remain HABITS responsibilities."}</div>
     <div><b>TA-14 RESPONSIBILITY</b><br/>{stage<3?"No HABITS determination is treated as TA-14 permission.":stage===3?"Receive the defined interface object/state and independently determine present standing for exact consequence.":stage===4?"Material uncertainty remains: HOLD is preserved.":"Bounded ALLOW, if earned, applies only to the exact path examined."}</div>
    </div>
    <div className="controls">
     <button onClick={reset}>RESET EXAMINATION</button>
     <button className="primary" disabled={stage!==0} onClick={()=>setStage(1)}>1 · OBSERVE ECOLOGICAL CONDITION</button>
     <button disabled={stage!==1} onClick={()=>setStage(2)}>2 · ESTABLISH MATERIALITY + STANDING</button>
     <button disabled={stage!==2} onClick={()=>setStage(3)}>3 · APPLY HABITS UAB + ENFORCEMENT</button>
     <button disabled={stage!==3} onClick={()=>setStage(4)}>4 · ADMIT UNKNOWN · UNCERTAINTY REMAINS</button>
     <button disabled={stage!==4} onClick={()=>setStage(5)}>5 · ESTABLISH SUFFICIENT GROUNDS</button>
    </div>
   </div>
  </section>

  <section><p className="eyebrow">EXAMINATION LEDGER</p><h2>The state change becomes a record.</h2>
   <div className="ledger">{ledger.slice(0,stage===0?1:stage===1?2:stage===2?3:stage===3?7:stage===4?9:10).map(([id,text],i)=><div key={i}><b>{id}</b><span>{text}</span></div>)}</div>
   <p className="note">The ledger is illustrative until the examination object is jointly frozen. An UNKNOWN entering the record is not treated as resolution. A later positive determination does not erase uncertainty that existed earlier, and it does not prove non-bypassability.</p>
  </section>

  <section><p className="eyebrow">WHAT THE HOLD MEANS</p><h2>The predicates did not necessarily fail. The evidence may have been incomplete for the consequence.</h2>
   <div className="grid">
    <article><b>NOT A RETROACTIVE FAILURE</b><p>A material UNKNOWN does not automatically prove the original predicates were false. It establishes that satisfying them may not have been sufficient to cover the affected reality.</p></article>
    <article><b>NO SILENT CORRECTION</b><p>The missing condition is preserved as a changed examination state. Revalidation is explicit rather than hidden inside implementation behavior.</p></article>
    <article><b>NO COMPETING PERMISSIONS</b><p>HABITS retains UAB admissibility and its execution-boundary enforcement. TA-14 independently determines present standing from the defined interface object/state. Neither architecture silently converts the other’s result into execution permission.</p></article>
    <article><b>NON-BYPASSABILITY IS SEPARATE</b><p>A successful HOLD on the examined path does not prove every alternate route to consequential execution is secured. That requires its own adversarial examination.</p></article>
   </div>
  </section>

  <EnforcementContractLab />

  <section><p className="eyebrow">PROPOSED JOINT FREEZE</p><h2>What we would freeze before a formal examination.</h2>
   <div className="chain">{["EXECUTION SCENARIO","PROPOSED CONSEQUENCE","OBSERVATION PATH","MATERIALITY TEST","GOVERNING PREDICATES","HABITS UAB + ENFORCEMENT","INTERFACE OBJECT / STATE","TA-14 RESPONSIBILITY","ENFORCEMENT CONTRACT + FINAL RELEASE","UNKNOWN / REVALIDATION BRANCHES","NON-BYPASSABILITY TEST"].map(x=><span key={x}>{x}</span>)}</div>
  </section>
  <footer><b>EXAMINATION PRINCIPLE</b><br/>Evidence that supports a declared predicate is not automatically evidence that the predicate set sufficiently covers the reality a consequence will affect. Admitting an UNKNOWN does not resolve it. A bounded HOLD does not prove every execution path is non-bypassable.</footer>
 </div><style>{`
 *{box-sizing:border-box}body{margin:0}.page{min-height:100vh;background:radial-gradient(circle at 8% 0,#173a5d77,transparent 30%),radial-gradient(circle at 92% 12%,#6d4d1f55,transparent 26%),linear-gradient(#02070d,#071522 55%,#02070d);color:#eef5fb;font-family:Arial,sans-serif}.wrap{width:min(1180px,calc(100% - 34px));margin:auto;padding-bottom:80px}nav{height:76px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ffffff16}a{color:#9dd6fa;text-decoration:none;font-size:11px;font-weight:900;letter-spacing:.08em}header{padding:78px 0 56px}.eyebrow{color:#f2c66d;font-size:10px;font-weight:950;letter-spacing:.17em}h1{max-width:1080px;font:clamp(48px,7vw,88px)/.97 Georgia,serif;letter-spacing:-.04em;margin:18px 0 25px}h2{max-width:1000px;font:clamp(34px,5vw,58px)/1.04 Georgia,serif;margin:12px 0 28px}.lede{max-width:930px;color:#a7bdcc;font-size:18px;line-height:1.72}.badges{display:flex;gap:8px;flex-wrap:wrap;margin-top:28px}.badges b{padding:8px 11px;border:1px solid #f2c66d44;border-radius:999px;color:#f2c66d;font-size:9px}section{padding:62px 0;border-top:1px solid #ffffff14}.split{display:grid;grid-template-columns:1fr 100px 1fr;gap:14px}.split article,.grid article{padding:25px;border:1px solid #ffffff18;border-radius:18px;background:#07131fbb}.split span,.grid b{color:#78dfff;font-size:10px;letter-spacing:.13em}.split h3{font:28px/1.1 Georgia,serif;margin:10px 0}.split p,.grid p{color:#9fb5c4;line-height:1.65}.meet{display:grid;place-items:center;text-align:center;color:#f2c66d;font-weight:950;font-size:10px;letter-spacing:.12em;border:1px dashed #f2c66d55;border-radius:18px}.rule{margin-top:16px;padding:18px;border-left:3px solid #f2c66d;background:#f2c66d10;color:#e8d7af;font-weight:850;line-height:1.5}.scenario{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.scenario div{padding:20px;border:1px solid #ffffff18;border-radius:15px;background:#06111c}.scenario small{display:block;color:#f2c66d;font-size:9px;font-weight:900;letter-spacing:.12em;margin-bottom:9px}.scenario strong{font-size:14px;line-height:1.5}.note{color:#829aaa;line-height:1.6;font-size:13px}.flow{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;margin:30px 0}.node{min-height:86px;padding:11px 7px;border:1px solid #ffffff13;border-radius:9px;color:#617787;display:flex;flex-direction:column;gap:7px}.node b{font-size:8px}.node span{font-size:8px;font-weight:900;line-height:1.3}.node.active{border-color:#78dfff44;color:#9bdcff}.node.stop{border-color:#f4ba5488;color:#f4ba54;background:#f4ba540d}.node em{font-style:normal;font-size:8px;font-weight:950;color:#f4ba54}.console{padding:28px;border:1px solid;border-radius:20px;background:#02080ddd;transition:.2s}.consoleTop{display:flex;justify-content:space-between;gap:20px;align-items:center}.consoleTop small,.consoleTop strong{display:block}.consoleTop small{color:#6f899b;font-size:9px;font-weight:900;letter-spacing:.14em}.consoleTop strong{font-size:16px;margin-top:6px}.result{padding:12px 16px;border:1px solid;border-radius:999px;font-weight:950;font-size:12px;letter-spacing:.08em}.console>p{color:#afc0cc;line-height:1.7;max-width:900px}.burdens{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}.burdens div{padding:16px;border:1px solid #ffffff12;border-radius:12px;color:#b9c9d3;font-size:12px;line-height:1.55}.burdens b{color:#78dfff;font-size:9px;letter-spacing:.1em}.controls{display:flex;gap:9px;flex-wrap:wrap}.controls button{cursor:pointer;background:#0b1a27;color:#cce2ef;border:1px solid #ffffff22;border-radius:10px;padding:12px 14px;font-weight:900;font-size:10px;letter-spacing:.05em}.controls button.primary{background:#f2c66d;color:#151006;border-color:#f2c66d}.controls button:disabled{cursor:not-allowed;opacity:.28}.ledger{border:1px solid #ffffff18;border-radius:16px;overflow:hidden}.ledger div{display:grid;grid-template-columns:150px 1fr;gap:15px;padding:14px 18px;border-bottom:1px solid #ffffff10}.ledger div:last-child{border-bottom:0}.ledger b{color:#f2c66d;font-size:10px;letter-spacing:.08em}.ledger span{color:#b6c6d0;font-size:13px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.contractFlow{display:grid;grid-template-columns:1fr auto 1.2fr auto 1fr auto 1.35fr;gap:8px;align-items:stretch;margin:25px 0 18px}.contractFlow>div{padding:18px;border:1px solid #ffffff18;border-radius:13px;background:#06111c;display:flex;flex-direction:column;gap:8px;justify-content:center}.contractFlow i{display:grid;place-items:center;color:#f2c66d;font-style:normal;font-weight:950}.contractFlow small{color:#7c98aa;font-size:8px;font-weight:950;letter-spacing:.12em}.contractFlow strong{font-size:12px;line-height:1.4}.contractFlow .release.no{border-color:#f4ba5466;background:#f4ba540d}.contractFlow .release.no strong{color:#f4ba54}.contractFlow .release.yes{border-color:#7ff0bd66;background:#7ff0bd0d}.contractFlow .release.yes strong{color:#7ff0bd}.contractControls{display:flex;gap:8px;flex-wrap:wrap}.contractControls button{cursor:pointer;background:#0b1a27;color:#a9c2d1;border:1px solid #ffffff22;border-radius:9px;padding:11px 12px;font-weight:900;font-size:9px}.contractControls button.selected{border-color:#78dfff88;background:#78dfff18;color:#dff7ff}.contractWhy{margin-top:16px;padding:18px;border:1px solid #ffffff16;border-radius:13px;background:#030b12}.contractWhy b{color:#78dfff;font-size:9px;letter-spacing:.12em}.contractWhy p{color:#b5c8d4;line-height:1.65;margin-bottom:0}.small{font-size:15px}.chain{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.chain span{padding:15px 8px;text-align:center;border:1px solid #78dfff33;border-radius:8px;color:#9bdcff;font-size:8px;font-weight:900}footer{margin-top:30px;padding:28px;border:1px solid #f2c66d33;border-radius:18px;color:#d8c49b;line-height:1.6}footer b{color:#f2c66d;letter-spacing:.12em;font-size:10px}@media(max-width:800px){.split,.scenario{grid-template-columns:1fr}.contractFlow{grid-template-columns:1fr}.contractFlow i{min-height:24px}.meet{min-height:70px}.grid,.burdens{grid-template-columns:1fr}.flow{grid-template-columns:repeat(2,1fr)}.chain{grid-template-columns:repeat(2,1fr)}.consoleTop{align-items:flex-start;flex-direction:column}.ledger div{grid-template-columns:1fr;gap:5px}}
 `}</style></main>
}