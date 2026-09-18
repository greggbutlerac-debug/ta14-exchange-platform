"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Verdict="ALLOW"|"HOLD"|"DENY"|"ESCALATE";
type Choice={label:string;verdict:Verdict;why:string;points:number};
type Scenario={dispatch:string;scene:string;choices:Choice[]};

const scenarios:Scenario[]=[
 {dispatch:"NO COOLING · RESIDENTIAL SPLIT",scene:"The homeowner meets you at the door: “The last guy said it just needs refrigerant.” No measurements have been taken and equipment identity has not yet been verified.",choices:[
  {label:"Add refrigerant",verdict:"HOLD",why:"A customer statement is information, not a diagnostic determination. Preserve the original condition and establish evidence first.",points:0},
  {label:"Verify equipment identity and establish baseline",verdict:"ALLOW",why:"Begin with the actual equipment and current operating condition before disturbing the system.",points:100},
  {label:"Open the sealed system",verdict:"DENY",why:"Nothing in the current record supports sealed-system intervention.",points:0},
  {label:"Escalate immediately",verdict:"HOLD",why:"There is not yet an established condition requiring escalation. Gather non-invasive evidence first.",points:25}]},
 {dispatch:"CALLBACK · LOW SUCTION REPORTED",scene:"A prior ticket says “low suction = low charge.” You have the ticket, but no preserved measurements tying that conclusion to the equipment state you are standing in front of now.",choices:[
  {label:"Charge to the prior technician's target",verdict:"HOLD",why:"The prior claim is not enough to establish continuity with the present equipment condition.",points:0},
  {label:"Re-establish current-state measurements",verdict:"ALLOW",why:"Changed context requires a new trustworthy record before commitment.",points:100},
  {label:"Treat the prior diagnosis as authority",verdict:"DENY",why:"A recorded diagnosis does not itself establish present execution authority.",points:0},
  {label:"Call a supervisor before observing anything",verdict:"HOLD",why:"Escalation may become appropriate, but the current condition can first be bounded without intervention.",points:25}]},
 {dispatch:"SERVICE COMPLETE? · PERFORMANCE CHECK",scene:"A bounded repair has been completed. The unit starts and the space begins cooling. The customer says, “Looks fixed to me.”",choices:[
  {label:"Close the ticket immediately",verdict:"HOLD",why:"Operation alone does not prove the intended outcome. Compare post-intervention performance with the preserved baseline.",points:0},
  {label:"Capture post-intervention performance evidence",verdict:"ALLOW",why:"Outcome closure requires evidence of what changed and whether the intended result was achieved.",points:100},
  {label:"Erase the pre-repair readings",verdict:"DENY",why:"Destroying the baseline destroys the comparison record.",points:0},
  {label:"Escalate every completed repair",verdict:"HOLD",why:"Escalation is not automatically required when the bounded outcome can be verified.",points:25}]}
];

const chain=["REALITY","RECORD","CONTINUITY","ADMISSIBILITY","BINDING","COMMIT","EXECUTION","OUTCOME"];

export default function ServiceCallHold(){
 const [started,setStarted]=useState(false),[round,setRound]=useState(0),[score,setScore]=useState(0),[answered,setAnswered]=useState(false);
 const [result,setResult]=useState<Choice|null>(null);
 const s=scenarios[round]; const complete=round>=scenarios.length;
 const chainCount=complete?8:Math.min(7,1+round*2+(answered?1:0));
 const title=useMemo(()=>complete?(score>=250?"DISCIPLINED EXECUTION":"REMEDIATION REQUIRED"):"LIVE SERVICE CALL",[complete,score]);
 function choose(c:Choice){if(answered)return;setAnswered(true);setResult(c);setScore(v=>v+c.points)}
 function next(){if(round+1>=scenarios.length){setRound(scenarios.length)}else{setRound(v=>v+1);setAnswered(false);setResult(null)}}
 function restart(){setStarted(false);setRound(0);setScore(0);setAnswered(false);setResult(null)}
 return <main className="holdGame"><div className="scan"/><header><Link href="/academy/hvac">← HVAC ACADEMY</Link><span>ARCADE 03 // EIGHT24 SOLUTIONS × TA-14</span></header>
 {!started?<section className="intro"><div className="kicker">EPA 608 TECHNICIAN DECISION ARCADE</div><h1>SERVICE CALL:<br/><em>HOLD</em></h1><p>You already know how to move fast. This game tests whether you know when <strong>not</strong> to move. Establish reality. Preserve the record. Earn the right to intervene.</p><button onClick={()=>setStarted(true)}>ACCEPT DISPATCH →</button><div className="rule">NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</div></section>:
 complete?<section className="finish"><small>RUN COMPLETE</small><h1>{title}</h1><div className="bigScore">{score}<span> / {scenarios.length*100}</span></div><p>{score>=250?"You resisted premature commitment and preserved the evidence chain.":"Some decisions crossed the execution boundary before the record supported them. Run the calls again."}</p><button onClick={restart}>RUN ANOTHER SHIFT →</button></section>:
 <section className="console"><div className="hud"><span>CALL {String(round+1).padStart(2,"0")} / {String(scenarios.length).padStart(2,"0")}</span><strong>{score} PTS</strong></div><div className="dispatch"><small>DISPATCH</small><h2>{s.dispatch}</h2><p>{s.scene}</p></div>
 <div className="chain">{chain.map((x,i)=><div key={x} className={i<chainCount?"on":""}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></div>)}</div>
 <div className="actions">{s.choices.map(c=><button key={c.label} disabled={answered} onClick={()=>choose(c)}>{c.label}</button>)}</div>
 {result&&<div className={"verdict "+result.verdict.toLowerCase()}><small>TA-14 DETERMINATION</small><h2>{result.verdict}</h2><p>{result.why}</p><button onClick={next}>{round+1===scenarios.length?"CLOSE SHIFT":"NEXT DISPATCH"} →</button></div>}</section>}
 <style>{`
 .holdGame{min-height:100vh;background:#02070b;color:#eaf7fb;font-family:Inter,system-ui,sans-serif;padding:22px;position:relative;overflow:hidden}.holdGame *{box-sizing:border-box}.scan{position:fixed;inset:0;pointer-events:none;background:linear-gradient(rgba(255,255,255,.015) 50%,transparent 50%);background-size:100% 4px;opacity:.35}header{max-width:1180px;margin:auto;display:flex;justify-content:space-between;gap:16px;border-bottom:1px solid #17323c;padding:12px 0 20px;font-size:12px;font-weight:900;letter-spacing:.12em;color:#7896a2}header a{color:#5de9ff;text-decoration:none}.intro,.finish{max-width:1000px;margin:80px auto}.kicker,.finish small{color:#60efad;font-size:12px;font-weight:950;letter-spacing:.18em}.intro h1,.finish h1{font-size:clamp(4rem,11vw,9rem);line-height:.82;letter-spacing:-.07em;margin:18px 0 30px}.intro h1 em{font-style:normal;color:#ffd369}.intro p,.finish p{max-width:760px;font-size:clamp(1.1rem,2vw,1.4rem);line-height:1.7;color:#a9c0c9}.intro button,.finish button,.verdict button{margin-top:22px;padding:16px 22px;border:1px solid #5de9ff;background:#082833;color:#eaffff;border-radius:10px;font-weight:950;letter-spacing:.08em;cursor:pointer}.rule{margin-top:70px;border-top:1px solid #17323c;padding-top:18px;color:#7896a2;font-size:12px;font-weight:900;letter-spacing:.14em}.console{max-width:1180px;margin:40px auto}.hud{display:flex;justify-content:space-between;color:#6fe9ff;font-size:13px;font-weight:950;letter-spacing:.14em}.dispatch{margin-top:18px;padding:30px;border:1px solid #224451;border-radius:18px;background:linear-gradient(145deg,#071821,#041017)}.dispatch small,.verdict small{color:#60efad;font-weight:950;letter-spacing:.15em}.dispatch h2{font-size:clamp(1.8rem,4vw,3.5rem);margin:8px 0 14px}.dispatch p{color:#b4c8d0;line-height:1.7;font-size:1.05rem;max-width:900px}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;margin:18px 0}.chain div{padding:12px 8px;border:1px solid #152a32;border-radius:8px;color:#4f6570;background:#040c10}.chain div.on{border-color:#2d7b83;color:#bdf8ff;background:#072026}.chain b{display:block;font-size:9px;color:#47707c}.chain span{font-size:10px;font-weight:950;letter-spacing:.06em}.actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}.actions button{min-height:72px;text-align:left;padding:16px;border:1px solid #284754;border-radius:12px;background:#07151c;color:#e6f7fb;font-size:15px;font-weight:800;cursor:pointer}.actions button:hover:not(:disabled){border-color:#5de9ff;background:#0a222b}.actions button:disabled{opacity:.55}.verdict{margin-top:14px;padding:26px;border:1px solid #42505a;border-radius:16px;background:#071116}.verdict h2{font-size:3rem;margin:6px 0}.verdict p{color:#c2d2d8;line-height:1.6}.verdict.allow{border-color:#2c8c64}.verdict.allow h2{color:#60efad}.verdict.hold{border-color:#9a7730}.verdict.hold h2{color:#ffd369}.verdict.deny{border-color:#93444c}.verdict.deny h2{color:#ff8993}.verdict.escalate{border-color:#4f68a0}.bigScore{font-size:5rem;font-weight:950}.bigScore span{font-size:1.4rem;color:#718d98}
 @media(max-width:760px){header{flex-direction:column}.intro{margin-top:50px}.chain{grid-template-columns:repeat(4,1fr)}.actions{grid-template-columns:1fr}.intro h1{font-size:4rem}}
 `}</style></main>
}