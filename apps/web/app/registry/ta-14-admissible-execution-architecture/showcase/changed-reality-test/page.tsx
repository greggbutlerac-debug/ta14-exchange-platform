"use client";
import Link from "next/link";
import {useState} from "react";
import "./showroom.css";
type Run="baseline"|"preserved"|"defeated";
const fixed=[["T₀ AUTHORITY","Facilities authority A-214 · active"],["ACTOR","Building automation controller BAC-07"],["PROPOSED CONSEQUENCE","Increase outdoor-air ventilation in Classroom 214"],["EXECUTION PATH","Controller → governed commit → AHU-2 outside-air command"]];
type RawState={tag:string;name:string;tone:string;change:string;fact:string;source:string;occupancy?:number;fireSmokeOverride?:boolean};
type DerivedState=RawState&{evidence:string;authority:string;standing:string;decision:string;gate:string;why:string};
const raw:Record<Run,RawState>={
 baseline:{tag:"T₀",name:"FROZEN BASELINE",tone:"blue",change:"No changed-context event has been introduced. The governed proposition is frozen so both runs can be compared against the same starting state.",fact:"Baseline frozen",source:"Authority + actor + object + scope + path",occupancy:21,fireSmokeOverride:false},
 preserved:{tag:"ΔN₁",name:"OCCUPANCY CHANGED",tone:"green",change:"Occupancy increases from 21 to 27. The evaluator receives the changed fact and provenance; it is not supplied a standing classification or determination.",fact:"Occupancy: 21 → 27",source:"Room occupancy service · signed event · sequence continuous",occupancy:27,fireSmokeOverride:false},
 defeated:{tag:"ΔN₂",name:"FIRE-SMOKE OVERRIDE CHANGED",tone:"gold",change:"AHU-2 enters an active fire-smoke control override. The evaluator receives the changed fact and provenance; it is not supplied a standing classification or determination.",fact:"Fire-smoke override: INACTIVE → ACTIVE",source:"Life-safety control record · signed event · sequence continuous",occupancy:21,fireSmokeOverride:true}
};
function derive(run:Run):DerivedState{
 const x=raw[run];
 const evidence=x.source.includes("signed event")||run==="baseline"?"ESTABLISHED":"UNRESOLVED";
 const authority=x.fireSmokeOverride===true?"NORMAL PATH DISPLACED":"APPLICABLE";
 const standing=evidence!=="ESTABLISHED"?"UNRESOLVED":authority==="NORMAL PATH DISPLACED"?"DEFEATED":"ESTABLISHED";
 const decision=run==="baseline"?"READY TO TEST":standing==="ESTABLISHED"?"ALLOW":standing==="DEFEATED"?"HOLD":"ESCALATE";
 const gate=run==="baseline"?"COMMIT NOT YET REQUESTED":decision==="ALLOW"?"COMMIT MAY PROCEED":decision==="HOLD"?"COMMIT BLOCKED":"COMMIT WITHHELD";
 const why=run==="baseline"?"The baseline is the control, not the answer. Run ΔN₁ and ΔN₂ against this same frozen proposition.":standing==="DEFEATED"?"TA-14 derives the refusal from the raw authoritative fire-smoke override and preserved provenance. The normal command path is displaced before commit.":"TA-14 derives that the raw occupancy change does not alter the authority or standing-bearing relationship for this bounded consequence. The same consequence remains eligible to cross the boundary if all remaining execution conditions are satisfied.";
 return {...x,evidence,authority,standing,decision,gate,why};
}
const data:Record<Run,DerivedState>={baseline:derive("baseline"),preserved:derive("preserved"),defeated:derive("defeated")};
const chain=["REALITY","RECORD","CONTINUITY","ADMISSIBILITY","BINDING","COMMIT","EXECUTION","OUTCOME"];
const receiptId=(run:Run)=>`TA14-AEA-CRR-R1-${run==="preserved"?"DN1":run==="defeated"?"DN2":"T0"}`;
async function downloadReceipt(run:Run){
 const r=data[run], timestamp=new Date().toISOString();
 const runId=`${receiptId(run)}-${timestamp.replace(/[-:.TZ]/g,"").slice(0,14)}Z`;
 const frozenRecord="T0:A-214|ACTOR:BAC-07|CONSEQUENCE:OA-VENT-CLASSROOM-214|PATH:BAC-07>GOVERNED-COMMIT>AHU-2-OA";
 const deltaId=run==="preserved"?"DN1:OCCUPANCY-21-TO-27":run==="defeated"?"DN2:FIRE-SMOKE-OVERRIDE-ACTIVE":"T0:NO-DELTA";
 const integrityPayload=[runId,frozenRecord,deltaId,r.fact,r.source,String(r.occupancy??""),String(r.fireSmokeOverride??""),r.evidence,r.authority,r.standing,r.decision,r.gate].join("|");
 const bytes=new TextEncoder().encode(integrityPayload);
 const digest=await crypto.subtle.digest("SHA-256",bytes);
 const hash=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("");
 const lines=[
 "TA-14 AUTHORITY · CHANGED-REALITY RUNTIME EXAMINATION R1",
 "EXAMINATION RECEIPT",
 "",
 `Receipt ID: ${receiptId(run)}`,
 `Run ID: ${runId}`,
 `Timestamp (UTC): ${timestamp}`,
 `Frozen-record identifier: ${frozenRecord}`,
 `Delta identifier: ${deltaId}`,
 `Integrity algorithm: SHA-256`,
 `Integrity hash: ${hash}`,
 `Runtime state: ${r.tag} · ${r.name}`,
 "",
 "FROZEN CONTROL",
 ...fixed.map(([a,b])=>`${a}: ${b}`),
 "",
 "AUTHORITATIVE INPUT",
 `Changed fact: ${r.fact}`,
 `Provenance: ${r.source}`,
 "",
 "TA-14 DERIVATION",
 `Admissible Evidence: ${r.evidence}`,
 `Applicable Authority: ${r.authority}`,
 `Standing: ${r.standing}`,
 `Determination: ${r.decision}`,
 `Execution disposition: ${r.gate}`,
 `Decision point: TA-14 consequence boundary · before commit`,
 "",
 "DERIVATION NOTE",
 r.why,
 "",
 "R1 CONTROL: Same T0 authority · same actor · same proposed consequence · same execution path.",
 "ONLY TEST VARIABLE: Delta N · authoritative changed reality.",
 "RAW FIXTURE INPUT: changed fact + provenance + raw condition fields. No standing classification or determination is supplied to the evaluator.",
 "NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION."
 ];
 const blob=new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`${receiptId(run)}-receipt.txt`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
export default function Page(){const[run,setRun]=useState<Run>("baseline"),[inspect,setInspect]=useState(false),[compare,setCompare]=useState(false);const r=data[run];return <main className={"crt "+r.tone}><div className="crt-mx" aria-hidden="true">{["REALITY","RECORD","CONTINUITY","ADMISSIBILITY","BINDING","COMMIT","EXECUTION","OUTCOME","REALIDAD","REGISTRO","CONTINUIDAD","AUTORIDAD","STANDING","RÉALITÉ","PREUVE","EXÉCUTION","現実","記録","実行","현실","기록","실행"].map((x,i)=><span key={i}>{x}</span>)}</div><div className="crt-w">
<nav><Link href="/registry/ta-14-admissible-execution-architecture">← TA-14 AEA</Link><Link href="/registry/ta-14-admissible-execution-architecture/showcase/cross-architecture-revalidation">FLAGSHIP FOUNDING SHOWCASE →</Link></nav>
<header className="crt-hero"><div className="crt-badges"><b>TA-14 AUTHORITY</b><b>PUBLIC TECHNICAL SHOWROOM</b><b>CONTROLLED RUNTIME TEST</b><b>R1 · FROZEN EXAMINATION RECORD</b></div><p className="crt-eye">THE CONSEQUENCE BOUNDARY · FORMAL CHANGED-REALITY EXAMINATION</p><h1>THE CHANGED-<br/><em>REALITY</em> TEST</h1><p className="crt-challenge">CAN ONE AUTHORITATIVE FACT STOP THE SAME CONSEQUENCE?</p><p className="crt-lede">R1 freezes the examination boundary: same T₀ authority, same actor, same proposed consequence, and same execution path. Only ΔN changes. Inspect whether TA-14 derives the consequence state from authoritative facts before commit.</p></header>
<section className="crt-question"><small>THE QUESTION TA-14 MUST ANSWER AT RUNTIME</small><h2>Does this proposed consequence have <i>Admissible Evidence</i>, <i>Applicable Authority</i>, and <i>Established Standing</i> to become <i>Reality Now</i>?</h2><div className="crt-dets"><b>ALLOW</b><b>HOLD</b><b>DENY</b><b>ESCALATE</b></div></section>
<section><p className="crt-eye">01 · FREEZE THE CONTROL</p><h2 className="crt-title">Four things are not allowed to move.</h2><div className="crt-fixed">{fixed.map(([a,b])=><article key={a}><small>{a}</small><strong>{b}</strong><span>LOCKED</span></article>)}</div></section>
<section><p className="crt-eye">02 · RUN THE TEST</p><h2 className="crt-title">Same consequence. Raw changed reality enters the evaluator.</h2><div className="crt-runs">{([["baseline","T₀","FREEZE BASELINE"],["preserved","ΔN₁","PRESERVE STANDING"],["defeated","ΔN₂","DEFEAT STANDING"]] as const).map(([k,a,b])=><button key={k} className={run===k?"active":""} onClick={()=>{setRun(k);setInspect(false)}}><small>{a}</small><strong>{b}</strong><span>{k==="baseline"?"Establish the control":k==="preserved"?"Change a non-standing-bearing fact":"Change a standing-bearing fact"}</span></button>)}</div>
<div className="crt-runtime"><div className="crt-rhead"><div><small>ACTIVE RUNTIME STATE · {r.tag}</small><h3>{r.name}</h3></div><div className="crt-decision">{r.decision}</div></div><p className="crt-change">{r.change}</p><div className="crt-pipe">{[["AUTHORITATIVE REALITY",r.fact],["PROVENANCE",r.source],["ADMISSIBLE EVIDENCE",r.evidence],["APPLICABLE AUTHORITY",r.authority],["DERIVED STANDING",r.standing],["EXECUTION STATE",r.decision]].map(([a,b],i)=><div key={a}><small>0{i+1} · {a}</small><strong>{b}</strong>{i<5&&<i>→</i>}</div>)}</div><div className="crt-gate"><small>CONSEQUENCE GATE</small><strong>{r.gate}</strong><p>{r.why}</p></div><button className="crt-action" onClick={()=>setInspect(!inspect)}>{inspect?"CLOSE DERIVATION RECORD ↑":"INSPECT WHERE THE DETERMINATION HAPPENED ↓"}</button>{inspect&&<div className="crt-record"><div><small>INPUT TYPE</small><b>Raw changed facts + preserved provenance</b></div><div><small>NOT ACCEPTED AS PROOF</small><b>Upstream standing verdict</b></div><div><small>DERIVATION LOCATION</small><b>derive(run) · TA-14 consequence boundary · before commit</b></div><div><small>BINDING EFFECT</small><b>{run==="defeated"?"HOLD prevents governed commit":"Determination controls whether commit may proceed"}</b></div></div>}</div></section>
<section><p className="crt-eye">03 · COMPARE THE EVIDENCE</p><h2 className="crt-title">Inspect the raw input and the derived divergence.</h2><button className="crt-action compareBtn" onClick={()=>setCompare(!compare)}>{compare?"HIDE SIDE-BY-SIDE DIFF":"OPEN ΔN₁ ↔ ΔN₂ SIDE-BY-SIDE DIFF"}</button>{compare&&<div className="crt-cmp"><article><small>RUN A · ΔN₁</small><h3>STANDING PRESERVED</h3><p><b>Changed fact:</b> Occupancy 21 → 27</p><p><b>Evidence:</b> Established</p><p><b>Authority:</b> Applicable</p><p><b>Standing:</b> Established</p><strong>ALLOW · COMMIT MAY PROCEED</strong></article><div className="crt-only"><small>ONLY MATERIAL DIFFERENCE</small><b>AUTHORITATIVE ΔN</b><span>Everything in the frozen control remains identical.</span></div><article><small>RUN B · ΔN₂</small><h3>STANDING DEFEATED</h3><p><b>Changed fact:</b> Fire-smoke override activates</p><p><b>Evidence:</b> Established</p><p><b>Authority:</b> Normal path displaced</p><p><b>Standing:</b> Defeated</p><strong>HOLD · COMMIT BLOCKED</strong></article></div>}</section>
<section><p className="crt-eye">04 · EXAMINATION RECEIPT</p><h2 className="crt-title">Preserve what TA-14 actually determined.</h2><div className="crt-runtime"><div className="crt-rhead"><div><small>RECEIPT ID</small><h3>{receiptId(run)}</h3></div><div className="crt-decision">{r.decision}</div></div><p className="crt-change">The receipt captures the raw changed fact and provenance separately from the evaluator-derived evidence, authority, standing, determination, and execution disposition, plus the exact pre-commit decision point, UTC timestamp, run identifier, ΔN identifier, and SHA-256 integrity hash.</p><div className="crt-record"><div><small>ADMISSIBLE EVIDENCE</small><b>{r.evidence}</b></div><div><small>APPLICABLE AUTHORITY</small><b>{r.authority}</b></div><div><small>STANDING</small><b>{r.standing}</b></div><div><small>EXECUTION DISPOSITION</small><b>{r.gate}</b></div></div><button className="crt-action" onClick={()=>downloadReceipt(run)}>DOWNLOAD R1 EXAMINATION RECEIPT ↓</button></div></section>
<section><p className="crt-eye">05 · THE PUBLIC CHAIN</p><div className="crt-chain">{chain.map((x,i)=><div key={x}><small>0{i+1}</small><b>{x}</b></div>)}</div><div className="crt-bound"><span>PROPOSAL</span><i>→</i><strong>TA-14 CONSEQUENCE BOUNDARY</strong><i>→</i><span>REALITY</span></div></section>
<section className="crt-falsify"><p className="crt-eye">R1 · FROZEN EXAMINATION RECORD</p><h2 className="crt-title">The claim survives only if the preserved record survives its falsifier.</h2><div className="crt-record"><div><small>CONTROL VARIABLES</small><b>Same T₀ authority · same actor · same proposed consequence · same execution path</b></div><div><small>ONLY TEST VARIABLE</small><b>ΔN · authoritative changed reality</b></div><div><small>PRESERVED FOR BOTH RUNS</small><b>Authoritative inputs · provenance · derivation trace · exact decision point · determination · execution disposition</b></div><div><small>DERIVATION REQUIREMENT</small><b>TA-14 must derive standing from underlying authoritative facts before consequence binds.</b></div><div><small>FIXTURE DISCIPLINE</small><b>ΔN fixtures supply raw condition facts and provenance only; standing, determination, and commit disposition are evaluator outputs.</b></div></div><p className="crt-eye">FALSIFICATION CONDITIONS</p><div className="crt-fgrid">{["The runs do not begin from the same frozen T₀ authority, actor, proposed consequence, and execution path.","The ΔN event cannot be traced to an authoritative source with preserved provenance.","TA-14 receives standing upstream instead of deriving it from underlying authoritative facts.","A different execution path is used between runs.","A hidden manual judgment determines the standing result.","The record cannot show where ΔN changes the derivation before consequence binds.","A HOLD or DENY can be ignored while the governed consequence still commits."].map((x,i)=><p key={x}><b>{String(i+1).padStart(2,"0")}</b>{x}</p>)}</div></section>
<section className="crt-falsify"><p className="crt-eye">R1 · BOUNDED EXAMINATION RESULT</p><h2 className="crt-title">Corrected R1 runs now establish the bounded derivation result.</h2><div className="crt-record"><div><small>CONTROL</small><b>Frozen across T₀, ΔN₁, and ΔN₂</b></div><div><small>ΔN₁</small><b>Standing established · ALLOW · commit may proceed</b></div><div><small>ΔN₂</small><b>Standing defeated · HOLD · commit blocked</b></div><div><small>RECORD INTEGRITY</small><b>Run-specific receipt · timestamp · ΔN identifier · SHA-256 integrity hash</b></div></div><p className="crt-change"><b>Bounded conclusion · corrected examination run 2026-09-22:</b> With the frozen T₀ control held constant, ΔN₁ (occupancy 21 → 27) produced ESTABLISHED standing → ALLOW → COMMIT MAY PROCEED, while ΔN₂ (fire-smoke override INACTIVE → ACTIVE) produced DEFEATED standing → HOLD → COMMIT BLOCKED. The corrected fixtures supplied raw changed facts, provenance, and raw condition fields only; standing, determination, and commit disposition were evaluator outputs. This establishes the published bounded derivation property for these R1 runs only. It does not establish universal runtime efficacy or independent physical enforcement outside this examination environment.</p></section>
<footer><p>THE ARCHITECTURE DID NOT ASK WHETHER STANDING HAD BEEN DECLARED.</p><h2>It asked whether standing was established from authoritative reality <em>now.</em></h2><strong>NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</strong><div className="crt-links"><Link href="/registry/ta-14-admissible-execution-architecture">OPEN AEA REGISTRY RECORD →</Link><Link href="/registry/ta-14-admissible-execution-architecture/showcase/cross-architecture-revalidation">OPEN FLAGSHIP FOUNDING SHOWCASE →</Link></div></footer>
</div></main>}