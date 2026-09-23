"use client";
import Link from "next/link";
import {useState} from "react";
import "./showroom.css";

const stages=[
 ["01","PROPOSITION","DRAFTED","Candidate continuation-admissibility property stated; not yet frozen."],
 ["02","NATIVE CONTRACT","AWAITING HARMONIC","Harmonic identifies the implementation-facing input/output contract to be examined."],
 ["03","RUNTIME + GOVERNANCE MAPPING","NOT FROZEN","The runtime implementation and governance mapping must be identified, hashed, timestamped and preserved before decisive specimens are disclosed."],
 ["04","FALSIFIER","NOT FROZEN","The falsifier will be constituted against the native contract, frozen governance mapping and constituted authority model, then frozen prospectively."],
 ["05","SPECIMENS","SEALED","Decisive specimens are intentionally not disclosed before implementation freeze."],
 ["06","EXECUTION","NOT AUTHORIZED","No examination run is authorized yet."],
 ["07","RECORD","PENDING","Inputs, provenance, derivation, disposition and integrity evidence will be preserved."],
 ["08","DETERMINATION","OPEN","No PASS / FAIL / NOT ESTABLISHED determination exists before execution."]
] as const;

const claims=[
 ["PRESENT STANDING","Harmonic publicly describes a runtime determination of whether a proposed action still has standing now after reality changes."],
 ["CURRENT INSTITUTIONAL STATE","Its public framing places present evidence, authority, obligations, operating conditions, continuity and consequence at the execution boundary."],
 ["CONTINUATION ADMISSIBILITY","Harmonic publicly frames its constitutional runtime around whether consequential execution remains admissible under the institution’s present state before consequence binds."],
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
    <h1>WHEN THE BASIS CHANGES.<br/><em>DOES CONTINUATION REMAIN ADMISSIBLE?</em></h1>
    <p className="hx-challenge">PRESENT CONTINUATION MUST BE DERIVED FROM CURRENT AUTHORITATIVE STATE.</p>
    <p className="hx-lede">This room opens before the examination begins. It records the proposed boundary, the public claim surface being examined, and the sequence required before any decisive specimen is introduced. It does not presume a Harmonic result.</p>
   </header>

   <section className="hx-question">
    <small>CANDIDATE PROPERTY · NOT YET FROZEN</small>
    <h2>Given a frozen Harmonic runtime, native contract, governance mapping and constituted authority model, can Harmonic derive whether the same attempted continuation remains admissible under present authoritative state after a qualifying material ΔN changes the authority basis supporting the consequence—without receiving standing, admissibility or an equivalent continuation verdict upstream?</h2>
    <p>The proposed examination concerns <strong>continuation admissibility under changed authority</strong>. Upstream systems may establish authoritative facts. Harmonic must determine what those facts mean for the same attempted continuation at the consequence boundary.</p>
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
    <h2 className="hx-title">The proposed examination stays inside Harmonic&apos;s stated continuation boundary.</h2>
    <div className="hx-claims">{claims.map(([a,b],i)=><button key={a} onClick={()=>setOpen(open===i?null:i)} className={open===i?"active":""}><small>{String(i+1).padStart(2,"0")}</small><strong>{a}</strong><span>{open===i?b:"INSPECT CLAIM →"}</span></button>)}</div>
    <p className="hx-note">This showroom does not ask Harmonic to establish domain truth. Authoritative institutional facts may enter through the native boundary Harmonic identifies. Standing, admissibility, or an equivalent continuation verdict may not be supplied upstream.</p>
   </section>

   <section>
    <p className="hx-eye">03 · EXAMINATION RAIL</p>
    <h2 className="hx-title">Name the test. Freeze the test. Then run the test.</h2>
    <div className="hx-rail">{stages.map(([n,a,b,c])=><article key={n} className={b==="SEALED"?"sealed":""}><small>{n} · {a}</small><strong>{b}</strong><p>{c}</p></article>)}</div>
   </section>

   <section className="hx-seal">
    <div><small>DECISIVE SPECIMENS</small><h2>SEALED.</h2><p>The decisive cases are intentionally withheld until the runtime implementation, native contract, governance mapping, constituted authority model, proposition, materiality boundary and falsifier are frozen. No specimen-specific repair is permitted after disclosure.</p></div>
    <div className="hx-lock"><span>◈</span><b>NOT DISCLOSED</b><small>BEFORE RUNTIME + GOVERNANCE FREEZE</small></div>
   </section>

   <section>
    <p className="hx-eye">04 · WHAT WILL REMAIN FIXED</p>
    <h2 className="hx-title">The examination cannot become a moving target.</h2>
    <div className="hx-fixed">
     {[
      ["RUNTIME IMPLEMENTATION","One identified Harmonic runtime implementation for every specimen."],
      ["NATIVE CONTRACT","One frozen input/output contract and native disposition vocabulary."],
      ["CONSEQUENCE","One specific proposed consequence and consequence class."],
      ["ACTOR + PATH","Same actor and same governed execution path."],
      ["GOVERNANCE MAPPING","Same governance pack/mapping, authority model, obligations and consequence semantics."],
      ["EVENT CLASS","One qualifying authority-supersession event class; decisive values remain sealed."],
      ["FALSIFIER","One prospectively frozen falsifier; no runtime or mapping repair between specimens."]
     ].map(([a,b])=><article key={a}><small>{a}</small><strong>{b}</strong><span>TO BE FROZEN</span></article>)}
    </div>
   </section>

   <section className="hx-boundary">
    <p className="hx-eye">05 · EXAMINATION BOUNDARY</p>
    <h2>Authoritative facts may enter.<br/><em>The continuation verdict may not.</em></h2>
    <div className="hx-flow"><b>AUTHORITATIVE CURRENT STATE</b><i>→</i><b>HARMONIC NATIVE CONTRACT</b><i>→</i><b>PRESENT CONSEQUENCE DISPOSITION</b></div>
    <p>Exact input semantics, native dispositions, governance mapping, constituted authority model and formal falsifier remain open until Harmonic identifies what it wants examined. Once frozen, those elements cannot change after decisive specimens are disclosed.</p>
   </section>

   <section>
    <p className="hx-eye">06 · CURRENT RECORD</p>
    <h2 className="hx-title">Nothing has been run.</h2>
    <div className="hx-status">
     <div><small>PROPOSITION</small><b>DRAFTED</b></div>
     <div><small>NATIVE CONTRACT</small><b>AWAITING HARMONIC</b></div>
     <div><small>RUNTIME + MAPPING</small><b>NOT FROZEN</b></div>
     <div><small>FALSIFIER</small><b>NOT FROZEN</b></div>
     <div><small>SPECIMENS</small><b>SEALED</b></div>
     <div><small>EXECUTION</small><b>NOT AUTHORIZED</b></div>
     <div><small>DETERMINATION</small><b>NONE</b></div>
     <div><small>CLAIM STATUS</small><b>OPEN</b></div>
    </div>
   </section>

   <footer>
    <p>TA-14 AUTHORITY · HARMONIC PROSPECTIVE EXAMINATION</p>
    <h2>THE RUNTIME AND MAPPING FREEZE<br/><em>BEFORE THE ANSWER ARRIVES.</em></h2>
    <strong>NO RESULT IS PRESUMED.</strong>
    <div><Link href="/registry/ta-14-admissible-execution-architecture">TA-14 AEA</Link><Link href="/registry/ta-14-admissible-execution-architecture/showcase/changed-reality-test">TA-14 R1 EXAMINATION</Link></div>
   </footer>
  </div>
 </main>
}
