"use client";
import Link from "next/link";
import {useState} from "react";
import "./showroom.css";

const stages=[
 ["01","PROPOSITION","FROZEN","Present continuation disposition must be derived from attributable present-state facts without an upstream standing, admissibility, continue/stop, or equivalent verdict."],
 ["02","NATIVE CONTRACT","FROZEN","Governance Compare · Frozen Primary · POST /api/evaluate · Harmonic V4.1 single-call runtime (runtime_version 4.1.0)."],
 ["03","INPUT SURFACE","FROZEN","Only the native contract fields and attributable constitutional facts/provenance may be supplied. No final continuation verdict may enter upstream."],
 ["04","MATERIALITY + FALSIFIER","FROZEN","Materiality identifies a qualifying authority-basis change without encoding the expected disposition. The three-part native-semantic falsifier is frozen."],
 ["05","SPECIMENS","SEALED","Decisive paired specimens remain sealed until this prospective freeze is published."],
 ["06","EXECUTION","AUTHORIZED AFTER FREEZE","Run both specimens against the same Frozen Primary surface with no repair between them."],
 ["07","RECORD","REQUIRED","Preserve the complete Studio export available for each run, including packet, primitives, determination/directive, hashes, lineage, provenance and transaction digest."],
 ["08","DETERMINATION","OPEN","Judge only against the frozen proposition and falsifier after both records are preserved."]
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
    <div className="hx-badges"><b>PUBLIC TECHNICAL SHOWROOM</b><b>PROSPECTIVE EXAMINATION</b><b>PROSPECTIVE FREEZE RECORD</b><b>NO RESULT CLAIMED</b></div>
    <p className="hx-eye">TA-14 × HARMONIC · PROSPECTIVE RUNTIME EXAMINATION</p>
    <h1>WHEN THE BASIS CHANGES.<br/><em>DOES CONTINUATION REMAIN ADMISSIBLE?</em></h1>
    <p className="hx-challenge">PRESENT CONTINUATION MUST BE DERIVED FROM CURRENT AUTHORITATIVE STATE.</p>
    <p className="hx-lede">This room opens before the examination begins. It records the proposed boundary, the public claim surface being examined, and the sequence required before any decisive specimen is introduced. It does not presume a Harmonic result.</p>
   </header>

   <section className="hx-question">
    <small>FROZEN PROPOSITION · BEFORE SPECIMEN OPENING</small>
    <h2>Given attributable present-state facts showing a material change relevant to the same proposed consequence, can the frozen Harmonic runtime determine the present continuation disposition without receiving standing, admissibility, continue/stop, or an equivalent verdict upstream?</h2>
    <p>The examination concerns <strong>continuation admissibility under changed authority</strong>. The caller may supply attributable constitutional facts and provenance, but may not manufacture standing or supply the final continuation verdict.</p>
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
    <div><small>DECISIVE SPECIMENS</small><h2>SEALED.</h2><p>The decisive paired specimens remain withheld until this prospective freeze is published. The same Frozen Primary runtime is used for both. No repair, code change, policy change, or runtime substitution is permitted between specimens.</p></div>
    <div className="hx-lock"><span>◈</span><b>NOT DISCLOSED</b><small>UNTIL PROSPECTIVE FREEZE IS PUBLISHED</small></div>
   </section>

   <section>
    <p className="hx-eye">04 · WHAT WILL REMAIN FIXED</p>
    <h2 className="hx-title">The examination cannot become a moving target.</h2>
    <div className="hx-fixed">
     {[
      ["RUNTIME","Governance Compare · Frozen Primary · Harmonic V4.1 /api/evaluate."],
      ["T₀ AUTHORITY BASIS","Same T₀ authority basis for both specimens."],
      ["ACTOR + CONSEQUENCE","Same actor, proposed action/consequence, consequence boundary and execution path."],
      ["NON-ΔN CONDITIONS","All materially relevant non-ΔN conditions remain the same."],
      ["EVENT CLASS","Only the authoritative material change being examined varies between specimens."],
      ["MATERIALITY RULE","Defines a qualifying authority-basis change but cannot encode the expected runtime disposition."],
      ["UPSTREAM BOUNDARY","Attributable facts and provenance may enter; standing/admissibility/continue-stop or semantic equivalents may not."],
      ["FALSIFIER","Frozen against Harmonic native semantics; no repair, code change, policy change or runtime substitution between specimens."]
     ].map(([a,b])=><article key={a}><small>{a}</small><strong>{b}</strong><span>FROZEN</span></article>)}
    </div>
   </section>

   <section className="hx-boundary">
    <p className="hx-eye">05 · EXAMINATION BOUNDARY</p>
    <h2>Authoritative facts may enter.<br/><em>The continuation verdict may not.</em></h2>
    <div className="hx-flow"><b>AUTHORITATIVE CURRENT STATE</b><i>→</i><b>HARMONIC NATIVE CONTRACT</b><i>→</i><b>PRESENT CONSEQUENCE DISPOSITION</b></div>
    <p>Native determination vocabulary: PERMITTED · CONSTRAINED · ESCALATED · REFUSED · EMERGENCY_CONTINUITY. Native directives: ALLOW · CONSTRAIN · ESCALATE · BLOCK. The examination is judged against those native semantics, not an artificial binary.</p>
   </section>

   <section>
    <p className="hx-eye">06 · FROZEN FALSIFIER</p>
    <h2 className="hx-title">The property can lose.</h2>
    <div className="hx-earned">
     <article><small>FALSIFIER 01</small><strong>PRESERVED STANDING</strong><span>Falsified if preserved relevant standing becomes non-permitting solely because the tested ΔN is misclassified as standing-defeating.</span></article>
     <article><small>FALSIFIER 02</small><strong>DEFEATED / UNESTABLISHED</strong><span>Falsified if relevant standing is defeated or not established but remains executable through inherited historical validity.</span></article>
     <article><small>FALSIFIER 03</small><strong>UPSTREAM VERDICT</strong><span>Falsified if the runtime requires the upstream system to supply the standing/admissibility conclusion instead of deriving its own continuation disposition.</span></article>
     <article><small>LIMITATION</small><strong>GOVERNANCE DETERMINATION</strong><span>This examination does not establish downstream external executor behavior unless Secure Execution is separately exercised and evidenced.</span></article>
    </div>
   </section>

   <section>
    <p className="hx-eye">07 · CURRENT RECORD</p>
    <h2 className="hx-title">Frozen before specimen opening. Nothing has been run.</h2>
    <div className="hx-status">
     <div><small>PROPOSITION</small><b>FROZEN</b></div>
     <div><small>NATIVE CONTRACT</small><b>FROZEN</b></div>
     <div><small>RUNTIME + INPUT SURFACE</small><b>FROZEN</b></div>
     <div><small>FALSIFIER</small><b>FROZEN</b></div>
     <div><small>SPECIMENS</small><b>SEALED</b></div>
     <div><small>EXECUTION</small><b>NEXT</b></div>
     <div><small>DETERMINATION</small><b>NONE</b></div>
     <div><small>CLAIM STATUS</small><b>OPEN</b></div>
    </div>
   </section>

   <footer>
    <p>TA-14 AUTHORITY · HARMONIC PROSPECTIVE EXAMINATION</p>
    <h2>THE TEST IS FROZEN<br/><em>BEFORE THE SPECIMENS OPEN.</em></h2>
    <strong>NO RESULT IS PRESUMED.</strong>
    <div><Link href="/registry/ta-14-admissible-execution-architecture">TA-14 AEA</Link><Link href="/registry/ta-14-admissible-execution-architecture/showcase/changed-reality-test">TA-14 R1 EXAMINATION</Link></div>
   </footer>
  </div>
 </main>
}
