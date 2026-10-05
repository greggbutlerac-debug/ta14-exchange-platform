"use client";

import Link from "next/link";
import { useState } from "react";

type ModelState = "baseline"|"unknown"|"authority-loss"|"stale"|"revalidated";

const states: Record<ModelState,{label:string;result:string;detail:string;path:string[]}> = {
  baseline:{label:"CURRENT CONSTITUTIONAL STATE",result:"CONTINUATION MAY BE CONSIDERED",detail:"The declared model evaluates present constitutional state rather than treating a prior determination as permanent permission.",path:["CURRENT STATE","ADMISSIBILITY","DETERMINATION","EXECUTION BOUNDARY"]},
  unknown:{label:"MATERIAL STATE UNRESOLVED",result:"UNKNOWN PRESERVED",detail:"Harmonic Version 2 declares that unresolved constitutional state is preserved rather than converted into affirmative permission to continue.",path:["CURRENT STATE","UNKNOWN","RE-EVALUATION","NO SILENT CONTINUATION"]},
  "authority-loss":{label:"AUTHORITY CHANGED",result:"RE-EVALUATION REQUIRED",detail:"The declared architecture treats materially relevant authority change as a reason prior reliance cannot simply carry forward.",path:["PRIOR STATE","AUTHORITY CHANGE","RE-EVALUATION","NEW DETERMINATION"]},
  stale:{label:"PRIOR RELIANCE STALE",result:"CONTINUATION NOT INHERITED",detail:"The public evidence package describes present-state continuation admissibility and stale-reliance handling as distinct from downstream execution authority.",path:["PRIOR DETERMINATION","MATERIAL CHANGE","STALE RELIANCE","REASSESS"]},
  revalidated:{label:"NEW CURRENT BASIS",result:"NEW BOUNDED DETERMINATION",detail:"A new determination can only be attributed to the newly evaluated state. TA-14 has not treated this declaration alone as end-to-end runtime proof.",path:["UPDATED STATE","RE-EVALUATION","NEW DETERMINATION","SEPARATE EXECUTION AUTHORITY"]}
};

export default function HarmonicGovernanceShowroom(){
  const [state,setState]=useState<ModelState>("baseline");
  const s=states[state];
  return <main className="page"><div className="wrap">
    <nav><Link href="/">TA-14 EXCHANGE</Link><Link href="/artifacts/registry">ARTIFACT REGISTRY →</Link></nav>

    <header>
      <div className="badges"><b>REGISTERED GOVERNANCE</b><b>INTERACTIVE SHOWROOM</b><b>TA-14-AIGR-000008 / VERSION SERIES</b></div>
      <p className="eyebrow">HARMONIC CONSTITUTIONAL RUNTIME · MORAL CLARITY AI</p>
      <h1>See how Harmonic represents continuation, change, uncertainty, and authority.</h1>
      <p className="lede">This page separates two things on purpose: Harmonic's declared governance model, and the bounded evidence TA-14 has actually examined. Use the model below to understand the architecture, then open the preserved demonstrations to replay what the record earned.</p>
    </header>

    <section>
      <p className="eyebrow">HOW THE GOVERNANCE WORKS</p>
      <h2>Operate the declared continuation-admissibility model.</h2>
      <div className="model">
        {s.path.map((x,i)=><div key={x} className="node"><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b>{i<s.path.length-1&&<i>→</i>}</div>)}
      </div>
      <div className="state">
        <small>CURRENT MODEL STATE</small><strong>{s.label}</strong><h3>{s.result}</h3><p>{s.detail}</p>
      </div>
      <div className="controls">
        <button onClick={()=>setState("baseline")}>BASELINE</button>
        <button onClick={()=>setState("unknown")}>INTRODUCE UNKNOWN</button>
        <button onClick={()=>setState("authority-loss")}>CHANGE AUTHORITY</button>
        <button onClick={()=>setState("stale")}>MAKE PRIOR RELIANCE STALE</button>
        <button onClick={()=>setState("revalidated")}>RE-EVALUATE CURRENT STATE</button>
      </div>
      <div className="rule"><b>IMPORTANT BOUNDARY</b> This interactive model explains Harmonic's declared architecture from the public record. It does not convert declaration into runtime proof. The demonstrations below show what TA-14 actually observed and what remained unestablished.</div>
    </section>

    <section className="specialty">
      <p className="eyebrow">ADDITIONAL EVIDENCE ARTIFACT · BUILDING SPECIALTY PACKS</p>
      <h2>The pack can constitute domain reality without becoming execution authority.</h2>
      <p className="teach">TA-14 examined the pre-release <strong>Building Specialty Packs — First Edition 2026</strong> as an additional evidence artifact beneath Harmonic's existing governance identity. The bounded question was not whether the publication certifies Harmonic or authorizes a downstream consequence. It was whether the pack establishes a structured domain-reality layer that Harmonic can evaluate while keeping determination and execution authority separate.</p>
      <figure className="teachingImage">
        <img src="/harmonic-building-specialty-packs-pre-release-examination.png" alt="TA-14 pre-release examination of Harmonic Building Specialty Packs showing the bounded relationship between constituted domain reality, Harmonic determination, and the execution boundary." />
        <figcaption>IMAGE 01 · PRE-RELEASE EXAMINATION · ADDITIONAL EVIDENCE ARTIFACT</figcaption>
      </figure>
      <div className="findingBox">
        <small>TA-14 BOUNDED FINDING</small>
        <h3>SUPPORTED — BOUNDED PASS</h3>
        <p className="maxim">The pack constitutes. Harmonic determines. The execution boundary enforces.</p>
      </div>
      <div className="lessonGrid">
        <article><span>01</span><b>THE PACK CONSTITUTES</b><p>The publication can establish structured domain facts, definitions, constraints and relationships for evaluation. That makes the pack evidence-bearing without turning it into a decision-maker.</p></article>
        <article><span>02</span><b>HARMONIC DETERMINES</b><p>Constituted domain reality enters a separate governance determination layer. The existence of an admissible input does not itself create an admissible output.</p></article>
        <article><span>03</span><b>EXECUTION REMAINS SEPARATE</b><p>A determination still does not inherit permission to produce a real-world consequence. Execution authority must remain independently established at the execution boundary.</p></article>
      </div>
      <div className="samantha">
        <b>SAMANTHA · IMAGE 01</b>
        <p>Start with the three numbered ideas below the image. One: the pack constitutes domain reality. Two: Harmonic evaluates that constituted reality and makes its own bounded determination. Three: neither the pack nor the determination silently becomes execution authority. That final boundary remains separate. This is why the examination earns a bounded pass without becoming certification, endorsement, or universal proof of Harmonic behavior.</p>
      </div>
      <div className="rule"><b>BOUNDARY OF THE FINDING</b> This additional artifact does not certify Harmonic, endorse Moral Clarity AI, validate every statement in the publication, or expand prior Harmonic findings. It preserves only what the examined pre-release artifact supports.</div>
    </section>

    <section>
      <p className="eyebrow">PRESERVED TA-14 RECORD</p>
      <h2>Do not take the finding on faith. Open the examination.</h2>
      <div className="cards">
        <Link href="/artifacts/fd-2026-0002-case-001"><span>FOUNDING DEMONSTRATION · CASE 001</span><h3>Authority Revoked Before Consequential Execution</h3><p>Replay the Version 1 bounded runtime refusal / block and see why the surrounding chronology remained evidence-bounded.</p><b>OPEN INTERACTIVE RECORD →</b></Link>
        <Link href="/artifacts/fd-2026-0002-case-002"><span>EVIDENCE ARTIFACT · CASE 002</span><h3>Version 2 Evidence Advancement</h3><p>Inspect how seven evidence records strengthened architecture, lineage and methodology while executable runtime validation remained open.</p><b>OPEN INTERACTIVE RECORD →</b></Link>
        <Link href="/artifacts/fd-2026-0002-case-003"><span>FOUNDING DEMONSTRATION · CASE 003</span><h3>When the Frozen Test Did Not Produce the Expected Record</h3><p>Replay the actual mismatch between the frozen test object and the returned evidence, including the supported BLOCK response and unestablished transition.</p><b>OPEN INTERACTIVE RECORD →</b></Link>
              <Link href="/artifacts/fd-2026-0002-case-004"><span>EXECUTED PROSPECTIVE EXAMINATION · ARTIFACT 004</span><h3>When the Frozen A/B Test Reached the Runtime</h3><p>Open the preserved V4.1 paired-specimen record: $90K standing-preserving ΔN versus $50K standing-defeating ΔN. Both returned REFUSED / inadmissible / BLOCK before the decisive ΔN produced a differentiated authority result.</p><p><strong>R1: INDETERMINATE ON THE FROZEN PROPOSITION</strong><br/>No frozen falsifier established on the preserved native record.</p><b>OPEN HARMONIC ARTIFACT 004 →</b></Link>
      </div>
    </section>

    <section>
      <p className="eyebrow">WHAT THIS SHOWROOM GIVES THE GOVERNANCE OWNER</p>
      <h2>One public URL for the architecture and its preserved examination history.</h2>
      <div className="grid">
        <article><b>ARCHITECTURE MODEL</b><p>Visitors can operate the governance's own concepts rather than reading a static description.</p></article>
        <article><b>ARTIFACT CTAs</b><p>Every founding demonstration, evidence artifact, and interoperability examination can become a new interactive page attached here.</p></article>
        <article><b>CLAIM BOUNDARIES</b><p>Declared behavior, demonstrated behavior, open proof surfaces and non-claims remain visibly separate.</p></article>
        <article><b>LIVING HISTORY</b><p>New versions and examinations can extend the public record without rewriting prior findings.</p></article>
      </div>
    </section>

    <footer><b>HARMONIC CONSTITUTIONAL RUNTIME · INTERACTIVE GOVERNANCE SHOWROOM</b><br/>Presentation can become richer. The preserved finding does not change.</footer>
  </div><style>{`
    *{box-sizing:border-box}body{margin:0}.page{min-height:100vh;background:radial-gradient(circle at 82% 3%,#173f5f66,transparent 30%),radial-gradient(circle at 12% 40%,#6d4c1c44,transparent 27%),linear-gradient(#02070c,#071522 52%,#02070c);color:#eef6fb;font-family:Arial,sans-serif}.wrap{width:min(1180px,calc(100% - 34px));margin:auto;padding-bottom:80px}nav{height:76px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ffffff16}a{color:inherit;text-decoration:none}nav a{color:#9dd6fa;font-size:11px;font-weight:900;letter-spacing:.08em}header{padding:78px 0 58px}.eyebrow{color:#f2c66d;font-size:10px;font-weight:950;letter-spacing:.17em}.badges{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px}.badges b{padding:8px 11px;border:1px solid #f2c66d44;border-radius:999px;color:#f2c66d;font-size:9px}h1{max-width:1080px;font:clamp(48px,7vw,88px)/.97 Georgia,serif;letter-spacing:-.04em;margin:14px 0 24px}h2{max-width:980px;font:clamp(34px,5vw,58px)/1.04 Georgia,serif;margin:12px 0 26px}.lede{max-width:930px;color:#abc0cd;font-size:18px;line-height:1.72}section{padding:62px 0;border-top:1px solid #ffffff14}.model{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.node{position:relative;padding:20px;border:1px solid #78dfff33;border-radius:14px;background:#06131e;min-height:105px}.node span{display:block;color:#f2c66d;font-size:9px}.node b{display:block;margin-top:12px;font-size:12px;letter-spacing:.05em}.node i{position:absolute;right:-11px;top:40%;color:#f2c66d;font-style:normal;z-index:2}.state{margin-top:12px;padding:26px;border:1px solid #f2c66d55;border-radius:18px;background:#f2c66d0b}.state small{color:#8299a8;font-size:9px;font-weight:900;letter-spacing:.14em}.state strong{display:block;color:#9edfff;margin:8px 0}.state h3{font:30px Georgia,serif;color:#f2c66d;margin:8px 0}.state p{max-width:900px;color:#b3c4ce;line-height:1.65}.controls{display:flex;gap:9px;flex-wrap:wrap;margin:16px 0}.controls button{cursor:pointer;background:#0b1a27;color:#cce2ef;border:1px solid #ffffff22;border-radius:10px;padding:12px 14px;font-weight:900;font-size:10px}.rule{padding:18px;border-left:3px solid #f2c66d;background:#f2c66d0d;color:#bcae8d;line-height:1.65;font-size:13px}.rule b{color:#f2c66d}.specialty .teach{max-width:960px;color:#abc0cd;font-size:17px;line-height:1.75}.teachingImage{margin:30px 0 16px;padding:10px;border:1px solid #ffffff18;border-radius:20px;background:#06131e;overflow:hidden}.teachingImage img{display:block;width:100%;height:auto;border-radius:13px}.teachingImage figcaption{padding:12px 6px 4px;color:#78dfff;font-size:9px;font-weight:900;letter-spacing:.13em}.findingBox{margin:18px 0;padding:25px;border:1px solid #f2c66d55;border-radius:18px;background:#f2c66d0b}.findingBox small{color:#8299a8;font-size:9px;font-weight:900;letter-spacing:.14em}.findingBox h3{margin:8px 0;color:#f2c66d;font:32px Georgia,serif}.findingBox .maxim{margin:0;color:#d7e7ef;font:22px/1.45 Georgia,serif}.lessonGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0}.lessonGrid article{padding:22px;border:1px solid #ffffff16;border-radius:16px;background:#06111c}.lessonGrid span{color:#f2c66d;font-size:9px;font-weight:900}.lessonGrid b{display:block;margin:10px 0;color:#78dfff;font-size:10px;letter-spacing:.1em}.lessonGrid p{margin:0;color:#9fb5c4;line-height:1.65;font-size:14px}.samantha{margin:16px 0;padding:20px 22px;border-left:3px solid #78dfff;background:#78dfff0b}.samantha b{color:#78dfff;font-size:10px;letter-spacing:.12em}.samantha p{margin:10px 0 0;color:#b6c8d2;line-height:1.7}.cards{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.cards a{padding:24px;border:1px solid #ffffff18;border-radius:18px;background:#07131fbb;transition:.15s}.cards a:hover{border-color:#78dfff55}.cards span{color:#78dfff;font-size:9px;font-weight:900;letter-spacing:.12em}.cards h3{font:26px/1.08 Georgia,serif;margin:12px 0}.cards p{color:#98aebb;line-height:1.6;font-size:14px}.cards b{color:#f2c66d;font-size:10px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.grid article{padding:22px;border:1px solid #ffffff16;border-radius:16px;background:#06111c}.grid b{color:#78dfff;font-size:10px;letter-spacing:.12em}.grid p{color:#9fb5c4;line-height:1.6}footer{margin-top:30px;padding:28px;border:1px solid #f2c66d33;border-radius:18px;color:#d4c49f;line-height:1.6}footer b{color:#f2c66d;font-size:10px;letter-spacing:.12em}@media(max-width:800px){.model,.cards,.grid,.lessonGrid{grid-template-columns:1fr}.node i{right:50%;top:auto;bottom:-21px;transform:rotate(90deg)}}
  `}</style></main>
}
