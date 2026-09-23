"use client";
import Link from "next/link";
import {useState} from "react";
import "./showroom.css";

const stages=[
 ["01","PROPOSITION","DRAFTED","Candidate property stated; not yet frozen."],
 ["02","NATIVE CONTRACT","AWAITING HARMONIC","Harmonic identifies the implementation-facing input/output contract to be examined."],
 ["03","IMPLEMENTATION","NOT FROZEN","The examined implementation must be identified, hashed, timestamped and preserved before decisive specimens are disclosed."],
 ["04","FALSIFIER","NOT FROZEN","The falsifier will be constituted against the actual native contract, then frozen prospectively."],
 ["05","SPECIMENS","SEALED","Decisive specimens are intentionally not disclosed before implementation freeze."],
 ["06","EXECUTION","NOT AUTHORIZED","No examination run is authorized yet."],
 ["07","RECORD","PENDING","Inputs, provenance, derivation, disposition and integrity evidence will be preserved."],
 ["08","DETERMINATION","OPEN","No PASS / FAIL / NOT ESTABLISHED determination exists before execution."]
] as const;

const claims=[
 ["PRESENT STANDING","Harmonic publicly describes a runtime determination of whether a proposed action still has standing now after reality changes."],
 ["CURRENT INSTITUTIONAL STATE","Its public framing places present evidence, authority, obligations, operating conditions, continuity and consequence at the execution boundary."],
 ["BOUNDED COMPOSITION","Harmonic has described composition through a bounded interface while domain intelligence remains sovereign."],
 ["PROSPECTIVE EXAMINATION","Its published testing discipline calls for freezing implementation, proposition, scope, materiality and falsifier before an unseen qualifying transition."]
] as const;

export default function Page(){
 const[open,setOpen]=useState<number|null>(null);
 return <main className="hx">
  <div className="hx-matrix" aria-hidden="true">{["AUTHORITY","SCOPE","OBLIGATION","STANDING","PROVENANCE","CONSEQUENCE","T₀","ΔN","Tₙ","AUTHORITY","SCOPE","STANDING"].map((x,i)=><span key={i}>{x}</span>)}</div>
  <div className="hx-wrap">
   <nav><Link href="/registry/ta-14-admissible-execution-architecture">← TA-14 AEA</Link><Link href="/registry/ta-14-admissible-execution-architecture/showcase/changed-reality-test">TA-14 R1 RECORD →</Link></nav>

   <header className="hx-hero">
    <div className="hx-flags"><div><b>🇺🇸</b><span>TA-14 AUTHORITY</span></div><i>×</i><div><b>🇺🇸</b><span>HARMONIC · MORAL CLARITY AI</span></div></div>
    <div className="hx-badges"><b>PUBLIC TECHNICAL SHOWROOM</b><b>PROSPECTIVE EXAMINATION</b><b>PRE-FREEZE RECORD</b><b>NO RESULT CLAIMED</b></div>
    <p className="hx-eye">TA-14 × HARMONIC · PROSPECTIVE RUNTIME EXAMINATION</p>
    <h1>WHEN AUTHORITY<br/><em>STAYS VALID.</em></h1>
    <p className="hx-challenge">CAN THE CONSEQUENCE STILL LOSE STANDING?</p>
    <p className="hx-lede">This room opens before the examination begins. It records the proposed boundary, the public claim surface being examined, and the sequence required before any decisive specimen is introduced. It does not presume a Harmonic result.</p>
   </header>

   <section className="hx-question">
    <small>CANDIDATE PROPERTY · NOT YET FROZEN</small>
    <h2>Can Harmonic derive the present standing of a specific consequence when multiple independently valid authorities, scopes and obligations interact under changed reality—without receiving the standing verdict upstream?</h2>
    <p>The proposed examination concerns <strong>relational standing</strong>. Individual authority artifacts may remain genuine and current while the relationship required to support one particular consequence changes.</p>
   </section>

   <section>
    <p className="hx-eye">01 · WHAT HARMONIC HAS ALREADY EARNED</p>
    <h2 className="hx-title">Do not erase the prior evidence.</h2>
    <div className="hx-earned">
     <article><small>PRIOR BOUNDED EXAMINATION</small><strong>POSITIVE CONTROL</strong><span>CONSTRAINED / admissible=true</span></article>
     <article><small>ONE MATERIAL STATE TRANSITION</small><strong>NEGATIVE CONTROL</strong><span>REFUSED / admissible=false</span></article>
     <article><small>BOUNDED CLAIM</small><strong>ESTABLISHED THERE</strong><span>Historical validity did not silently retain consequential standing after a material change in present state.</span></article>
     <article><small>NOT CLAIMED HERE</small><strong>NO RETROACTIVE EXPANSION</strong><span>The earlier result is not treated as proof of every possible authority relationship or downstream physical execution.</span></article>
    </div>
   </section>

   <section>
    <p className="hx-eye">02 · PUBLIC CLAIM SURFACE</p>
    <h2 className="hx-title">The new examination stays inside Harmonic&apos;s stated boundary.</h2>
    <div className="hx-claims">{claims.map(([a,b],i)=><button key={a} onClick={()=>setOpen(open===i?null:i)} className={open===i?"active":""}><small>{String(i+1).padStart(2,"0")}</small><strong>{a}</strong><span>{open===i?b:"INSPECT CLAIM →"}</span></button>)}</div>
    <p className="hx-note">This showroom does not ask Harmonic to replace domain intelligence. The proposed test is intended to use authoritative institutional facts and relationships supplied through the native boundary Harmonic identifies.</p>
   </section>

   <section>
    <p className="hx-eye">03 · EXAMINATION RAIL</p>
    <h2 className="hx-title">Name the test. Freeze the test. Then run the test.</h2>
    <div className="hx-rail">{stages.map(([n,a,b,c])=><article key={n} className={b==="SEALED"?"sealed":""}><small>{n} · {a}</small><strong>{b}</strong><p>{c}</p></article>)}</div>
   </section>

   <section className="hx-seal">
    <div><small>DECISIVE SPECIMENS</small><h2>SEALED.</h2><p>The decisive cases are intentionally withheld before implementation freeze. Their purpose is to test a property the examined implementation was not specifically programmed around after seeing the answer.</p></div>
    <div className="hx-lock"><span>◈</span><b>NOT DISCLOSED</b><small>BEFORE IMPLEMENTATION FREEZE</small></div>
   </section>

   <section>
    <p className="hx-eye">04 · WHAT WILL REMAIN FIXED</p>
    <h2 className="hx-title">The examination cannot become a moving target.</h2>
    <div className="hx-fixed">
     {[
      ["IMPLEMENTATION","One identified Harmonic implementation for every specimen."],
      ["NATIVE CONTRACT","One frozen input/output contract for the examination."],
      ["CONSEQUENCE","One specific proposed consequence and consequence class."],
      ["ACTOR + PATH","Same actor and same governed execution path."],
      ["CONSTITUTION","Same constituted general authority relationships and obligations."],
      ["FALSIFIER","One prospectively frozen falsifier; no repair between specimens."]
     ].map(([a,b])=><article key={a}><small>{a}</small><strong>{b}</strong><span>TO BE FROZEN</span></article>)}
    </div>
   </section>

   <section className="hx-boundary">
    <p className="hx-eye">05 · EXAMINATION BOUNDARY</p>
    <h2>Facts and relationships may enter.<br/><em>The standing verdict may not.</em></h2>
    <div className="hx-flow"><b>AUTHORITATIVE CURRENT STATE</b><i>→</i><b>HARMONIC NATIVE CONTRACT</b><i>→</i><b>PRESENT CONSEQUENCE DISPOSITION</b></div>
    <p>Exact input semantics, admissible dispositions, and the formal falsifier remain open until Harmonic identifies the implementation and native contract it wants examined. That protects both architectures from post hoc requirements.</p>
   </section>

   <section>
    <p className="hx-eye">06 · CURRENT RECORD</p>
    <h2 className="hx-title">Nothing has been run.</h2>
    <div className="hx-status">
     <div><small>PROPOSITION</small><b>DRAFTED</b></div>
     <div><small>NATIVE CONTRACT</small><b>AWAITING HARMONIC</b></div>
     <div><small>IMPLEMENTATION</small><b>NOT FROZEN</b></div>
     <div><small>FALSIFIER</small><b>NOT FROZEN</b></div>
     <div><small>SPECIMENS</small><b>SEALED</b></div>
     <div><small>EXECUTION</small><b>NOT AUTHORIZED</b></div>
     <div><small>DETERMINATION</small><b>NONE</b></div>
     <div><small>CLAIM STATUS</small><b>OPEN</b></div>
    </div>
   </section>

   <footer>
    <p>TA-14 AUTHORITY · HARMONIC PROSPECTIVE EXAMINATION</p>
    <h2>THE IMPLEMENTATION FREEZES<br/><em>BEFORE THE ANSWER ARRIVES.</em></h2>
    <strong>NO RESULT IS PRESUMED.</strong>
    <div><Link href="/registry/ta-14-admissible-execution-architecture">TA-14 AEA</Link><Link href="/registry/ta-14-admissible-execution-architecture/showcase/changed-reality-test">TA-14 R1 EXAMINATION</Link></div>
   </footer>
  </div>
 </main>
}
