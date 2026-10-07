"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ModelState = "baseline"|"evidence-gap"|"authority-loss"|"continuity-break"|"changed";

const states: Record<ModelState,{label:string;result:string;detail:string;path:string[]}> = {
  baseline:{label:"PRESENT CONSTITUTIONAL STATE SUPPORTED",result:"ADMISSIBLE",detail:"Admitted evidence, valid authority, continuity, constraints, and current operating conditions support a bounded present-state determination.",path:["ADMITTED EVIDENCE","RECONSTRUCT STATE","EXAMINE CONSEQUENCE","ADMISSIBLE"]},
  "evidence-gap":{label:"ADMITTED EVIDENCE INSUFFICIENT",result:"ESCALATED",detail:"A material evidence gap cannot be silently converted into permission.",path:["EVIDENCE GAP","STATE UNRESOLVED","NO SILENT ASSUMPTION","ESCALATED"]},
  "authority-loss":{label:"VALID AUTHORITY NOT ESTABLISHED",result:"DENIED",detail:"The v1.0 declaration does not authorize consequential execution without valid authority and current constitutional admissibility.",path:["ADMITTED EVIDENCE","RECONSTRUCT STATE","AUTHORITY FAILURE","DENIED"]},
  "continuity-break":{label:"CONTINUITY NOT ESTABLISHED",result:"DENIED",detail:"Prior constitutional state does not automatically carry forward when material continuity cannot be established.",path:["PRIOR STATE","CONTINUITY BREAK","PRESENT STATE FAILS","DENIED"]},
  changed:{label:"MATERIAL CONDITIONS CHANGED",result:"ESCALATED",detail:"Material change defeats reliance on the prior determination. The present constitutional state must be reconstructed before a new v1.0 disposition can be reached.",path:["PRIOR DETERMINATION","MATERIAL CHANGE","RECOMPUTE STATE","ESCALATED"]}
};

function Samantha({text,label="GUIDED EXPLANATION"}:{text:string;label?:string}){
  const [state,setState]=useState<"idle"|"playing"|"paused">("idle");
  useEffect(()=>()=>window.speechSynthesis?.cancel(),[]);
  const play=()=>{if(typeof window==="undefined"||!("speechSynthesis" in window))return;if(state==="paused"){window.speechSynthesis.resume();setState("playing");return}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>/Samantha/i.test(v.name))||voices.find(v=>/female|zira|ava|victoria|karen/i.test(v.name))||voices.find(v=>v.lang.startsWith("en"))||null;u.rate=.8;u.pitch=.95;u.onend=()=>setState("idle");u.onerror=()=>setState("idle");window.speechSynthesis.speak(u);setState("playing")};
  const pause=()=>{window.speechSynthesis.pause();setState("paused")};
  const stop=()=>{window.speechSynthesis.cancel();setState("idle")};
  return <div className="samanthaPlayer"><div><b>🎧 SAMANTHA · {label}</b><span>Listen to the numbered walkthrough · page remains free-scroll</span></div><div className="samanthaButtons"><button type="button" onClick={play}>{state==="paused"?"▶ RESUME":state==="playing"?"↻ RESTART":"▶ PLAY"}</button>{state==="playing"&&<button type="button" onClick={pause}>Ⅱ PAUSE</button>}<button type="button" onClick={stop}>■ STOP</button></div></div>;
}

export default function HarmonicGovernanceShowroom(){
  const [state,setState]=useState<ModelState>("baseline");
  const s=states[state];
  return <main className="page"><div className="wrap">
    <nav><Link href="/">TA-14 EXCHANGE</Link><Link href="/artifacts/registry">ARTIFACT REGISTRY →</Link></nav>

    <header>
      <div className="badges"><b>REGISTERED GOVERNANCE</b><b>INTERACTIVE SHOWROOM</b><b>TA-14-AIGR-000008 · v1.0 ORIGINAL BASELINE</b></div>
      <p className="eyebrow">HARMONIC CONSTITUTIONAL RUNTIME · MORAL CLARITY AI</p>
      <h1>Harmonic Constitutional Runtime v1.0</h1>
      <p className="lede">A sovereign constitutional runtime for consequence-bearing autonomous systems. This showroom preserves the original registered v1.0 baseline separately from later Harmonic versions.</p>
      <div className="identityStrip">
        <div><small>STEWARD</small><b>Timothy E. Zlomke</b></div>
        <div><small>ORGANIZATION</small><b>Moral Clarity AI</b></div>
        <div><small>CATEGORY</small><b>Constitutional Runtime Governance</b></div>
        <div><small>REGISTERED</small><b>August 7, 2026</b></div>
      </div>
      <div className="orientation"><b>READ THIS SHOWROOM IN FOUR LAYERS</b><span>01 · DECLARED v1.0 ARCHITECTURE</span><span>02 · PRESERVED EVIDENCE</span><span>03 · VERSION LINEAGE</span><span>04 · OPEN PROOF SURFACES</span></div>
    </header>

    <figure className="teachingImage"><img src="/Harmonic%20Constitutional%20Governance%20Registry.png" alt="Harmonic Constitutional Runtime v1.0 registered governance infographic" /><figcaption>HARMONIC CONSTITUTIONAL RUNTIME · ORIGINAL REGISTERED BASELINE · TA-14-AIGR-000008</figcaption></figure>
    <Samantha label="ORIGINAL BASELINE GUIDE" text="This first image is the front door to Harmonic Constitutional Runtime version one, the original registered baseline under TA-14-AIGR-000008. Read it as a present-state constitutional model, not as permanent permission. Harmonic begins with admitted evidence and reconstructs the institution's present constitutional state. That state includes valid authority, obligations, continuity, constraints, and current operating conditions. Only then does the architecture examine a proposed consequential execution. The registered version one outcomes are admissible, denied, or escalated. The critical word is present. A prior admissible determination does not authorize every later consequence. If evidence changes, authority is revoked, continuity breaks, or operating conditions materially change, the constitutional state must be reconstructed again. This image teaches the declared architecture. It does not by itself prove runtime performance, certify Harmonic, or create execution authority." />
    <div className="samantha"><b>SAMANTHA · ORIGINAL BASELINE IMAGE TRANSCRIPT</b><p>This first image teaches Harmonic v1.0 itself: admitted evidence supports reconstruction of present constitutional state; present authority, continuity, constraints, obligations and operating conditions matter; and the proposed consequence is then examined for an ADMISSIBLE, DENIED or ESCALATED disposition. Prior permission is not permanent permission, and the image is not runtime proof or execution authority.</p></div>

    <section>
      <p className="eyebrow">HOW THE GOVERNANCE WORKS</p>
      <h2>Reconstruct the present state. Then ask what is constitutionally admissible NOW.</h2>
      <div className="model">
        {s.path.map((x,i)=><div key={x} className="node"><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b>{i<s.path.length-1&&<i>→</i>}</div>)}
      </div>
      <div className="state">
        <small>CURRENT MODEL STATE</small><strong>{s.label}</strong><h3>{s.result}</h3><p>{s.detail}</p>
      </div>
      <div className="controls">
        <button onClick={()=>setState("baseline")}>BASELINE</button>
        <button onClick={()=>setState("evidence-gap")}>REMOVE ADMITTED EVIDENCE</button>
        <button onClick={()=>setState("authority-loss")}>CHANGE AUTHORITY</button>
        <button onClick={()=>setState("continuity-break")}>BREAK CONTINUITY</button>
        <button onClick={()=>setState("changed")}>CHANGE MATERIAL CONDITIONS</button>
      </div>
      <div className="rule"><b>IMPORTANT BOUNDARY</b> This interactive model explains Harmonic's declared architecture from the public record. It does not convert declaration into runtime proof. The demonstrations below show what TA-14 actually observed and what remained unestablished.</div>
    </section>

    <section className="ecosystem">
      <p className="eyebrow">HARMONIC GOVERNANCE ECOSYSTEM · PRESERVED RECORD</p>
      <h2>One architecture. Many artifacts. One attributable history.</h2>
      <p className="teach">Harmonic v1.0 does not stand alone. Its demonstrations, evidence artifacts, interoperability examinations, later versions, and domain materials form a larger preserved record without silently expanding the claims of the original baseline.</p>
      <figure className="teachingImage">
        <img src="/Harmonic%20Governance%20Ecosystem%20Dashboard.png" alt="Harmonic Governance Ecosystem showing the v1.0 baseline, demonstrations, evidence artifacts, interoperability examinations, version lineage, and future attributable records" />
        <figcaption>HARMONIC GOVERNANCE ECOSYSTEM · ARCHITECTURE + ARTIFACTS + EXAMINATIONS + LINEAGE</figcaption>
      </figure>
      <Samantha label="GOVERNANCE ECOSYSTEM GUIDE" text="This image shows the larger Harmonic governance ecosystem. At the center is Harmonic Constitutional Runtime version one, the original registered baseline, TA-14-AIGR-000008. Around it are different kinds of records, and they must not be collapsed into one claim. Founding demonstrations preserve what TA-14 actually observed under governed test conditions. Evidence artifacts strengthen architecture, lineage, and methodology, but evidence does not automatically prove executable runtime behavior. Additional evidence artifacts, such as the Building Specialty Packs, can constitute domain reality for evaluation without becoming execution authority. Interoperability examinations ask how Harmonic relates to other architectures, systems, and governance boundaries. Version lineage preserves the distinction between Harmonic version one and Harmonic version two, TA-14-AIGR-000010. New versions may add claims, but they do not rewrite the original baseline. The governing principle across the whole ecosystem is simple: chronology is preserved, continuity is not manufactured, and a determination does not create execution authority." />
      <div className="samantha"><b>SAMANTHA · ECOSYSTEM TRANSCRIPT</b><p>Start at the center with Harmonic v1.0, then move outward. Demonstrations preserve observed behavior. Evidence artifacts preserve support and open proof surfaces. Domain artifacts can provide structured reality for evaluation. Interoperability records examine boundaries with other systems. Version lineage keeps v1.0 and v2.0 attributable rather than blending them together. Chronology is preserved. Continuity is not manufactured. Execution authority remains separate.</p></div>
      <div className="ecosystemLinks">
        <Link href="/artifacts/fd-2026-0002-case-001"><b>FOUNDING DEMONSTRATIONS</b><span>Open preserved runtime examinations →</span></Link>
        <Link href="/artifacts/fd-2026-0002-case-002"><b>EVIDENCE ARTIFACTS</b><span>Inspect evidence advancement →</span></Link>
        <Link href="/artifacts/fd-2026-0002-case-004"><b>PRESSURE TESTS</b><span>Open the frozen A/B examination →</span></Link>
        <Link href="/governance-showcase/TA-14-AIGR-000010"><b>VERSION LINEAGE</b><span>Continue to Harmonic v2.0 →</span></Link>
      </div>
      <div className="rule"><b>ECOSYSTEM BOUNDARY</b> A larger evidence record can deepen what is known without retroactively enlarging what Harmonic v1.0 originally claimed.</div>
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
      <Samantha label="SPECIALTY PACKS GUIDE" text="Start with the three numbered ideas below the image. One: the pack constitutes domain reality. Two: Harmonic evaluates that constituted reality and makes its own bounded determination. Three: neither the pack nor the determination silently becomes execution authority. That final boundary remains separate. This is why the examination earns a bounded pass without becoming certification, endorsement, or universal proof of Harmonic behavior." />
      <div className="samantha"><b>SAMANTHA · IMAGE 01 TRANSCRIPT</b><p>Start with the three numbered ideas below the image. One: the pack constitutes domain reality. Two: Harmonic evaluates that constituted reality and makes its own bounded determination. Three: neither the pack nor the determination silently becomes execution authority. That final boundary remains separate. This is why the examination earns a bounded pass without becoming certification, endorsement, or universal proof of Harmonic behavior.</p></div>
      <div className="rule"><b>BOUNDARY OF THE FINDING</b> This additional artifact does not certify Harmonic, endorse Moral Clarity AI, validate every statement in the publication, or expand prior Harmonic findings. It preserves only what the examined pre-release artifact supports.</div>
      <div className="downloadBox"><div><small>EXAMINED PUBLICATION · TIM ZLOMKE</small><h3>Building Specialty Packs — First Edition 2026</h3><p>Download the exact PDF examined as this additional evidence artifact. The publication remains Tim Zlomke’s work; availability here does not imply TA-14 authorship, endorsement, certification, or expanded findings.</p></div><a href="/building-specialty-packs-first-edition.pdf" download>DOWNLOAD BUILDING SPECIALTY PACKS — FREE PDF ↓</a></div>
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

    <section className="boundarySection">
      <p className="eyebrow">CLAIM DISCIPLINE · WHAT THE RECORD DOES AND DOES NOT SAY</p>
      <h2>Keep declaration, demonstration, and execution proof separate.</h2>
      <div className="boundaryGrid">
        <article><span>DECLARED</span><h3>Harmonic v1.0</h3><p>The registered baseline declares present-state constitutional reconstruction and the v1.0 dispositions ADMISSIBLE, DENIED, and ESCALATED.</p></article>
        <article><span>DEMONSTRATED</span><h3>Preserved examinations</h3><p>TA-14 records preserve what was actually observed in specific governed demonstrations and prospective examinations.</p></article>
        <article><span>NOT AUTOMATICALLY PROVEN</span><h3>Universal runtime behavior</h3><p>No single artifact silently proves every implementation, future version, operating condition, or consequential execution.</p></article>
        <article><span>SEPARATE BURDEN</span><h3>Execution authority</h3><p>A constitutional determination does not itself establish permission for a downstream real-world consequence.</p></article>
      </div>
      <div className="rule"><b>VERSION RULE</b> Harmonic v2.0 is a separately attributable registered version. Later claims, mechanisms, or evidence do not rewrite the original v1.0 baseline.</div>
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

    <footer><b>HARMONIC CONSTITUTIONAL RUNTIME · INTERACTIVE GOVERNANCE SHOWROOM</b><br/>Guided public technical showroom · Original v1.0 baseline preserved. The registered finding does not change.</footer>
  </div><style>{`
    *{box-sizing:border-box}body{margin:0}.page{min-height:100vh;background:radial-gradient(circle at 82% 3%,#173f5f66,transparent 30%),radial-gradient(circle at 12% 40%,#6d4c1c44,transparent 27%),linear-gradient(#02070c,#071522 52%,#02070c);color:#eef6fb;font-family:Arial,sans-serif}.wrap{width:min(1180px,calc(100% - 34px));margin:auto;padding-bottom:80px}nav{height:76px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ffffff16}a{color:inherit;text-decoration:none}nav a{color:#9dd6fa;font-size:11px;font-weight:900;letter-spacing:.08em}header{padding:78px 0 58px}.eyebrow{color:#f2c66d;font-size:10px;font-weight:950;letter-spacing:.17em}.badges{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px}.badges b{padding:8px 11px;border:1px solid #f2c66d44;border-radius:999px;color:#f2c66d;font-size:9px}h1{max-width:1080px;font:clamp(48px,7vw,88px)/.97 Georgia,serif;letter-spacing:-.04em;margin:14px 0 24px}h2{max-width:980px;font:clamp(34px,5vw,58px)/1.04 Georgia,serif;margin:12px 0 26px}.lede{max-width:930px;color:#abc0cd;font-size:18px;line-height:1.72}section{padding:62px 0;border-top:1px solid #ffffff14}.model{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.node{position:relative;padding:20px;border:1px solid #78dfff33;border-radius:14px;background:#06131e;min-height:105px}.node span{display:block;color:#f2c66d;font-size:9px}.node b{display:block;margin-top:12px;font-size:12px;letter-spacing:.05em}.node i{position:absolute;right:-11px;top:40%;color:#f2c66d;font-style:normal;z-index:2}.state{margin-top:12px;padding:26px;border:1px solid #f2c66d55;border-radius:18px;background:#f2c66d0b}.state small{color:#8299a8;font-size:9px;font-weight:900;letter-spacing:.14em}.state strong{display:block;color:#9edfff;margin:8px 0}.state h3{font:30px Georgia,serif;color:#f2c66d;margin:8px 0}.state p{max-width:900px;color:#b3c4ce;line-height:1.65}.controls{display:flex;gap:9px;flex-wrap:wrap;margin:16px 0}.controls button{cursor:pointer;background:#0b1a27;color:#cce2ef;border:1px solid #ffffff22;border-radius:10px;padding:12px 14px;font-weight:900;font-size:10px}.rule{padding:18px;border-left:3px solid #f2c66d;background:#f2c66d0d;color:#bcae8d;line-height:1.65;font-size:13px}.rule b{color:#f2c66d}.teachingImage{margin:0 0 58px;padding:10px;border:1px solid #ffffff18;border-radius:22px;background:#06131e;overflow:hidden}.teachingImage img{display:block;width:100%;height:auto;border-radius:14px}.teachingImage figcaption{padding:12px 6px 4px;color:#78dfff;font-size:9px;font-weight:900;letter-spacing:.13em}.ecosystem .teach{max-width:980px;color:#abc0cd;font-size:17px;line-height:1.7}.ecosystemLinks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:18px 0}.ecosystemLinks a{display:flex;flex-direction:column;gap:7px;padding:18px;border:1px solid #4fdcff44;border-radius:14px;background:#071827;color:#eefaff;text-decoration:none}.ecosystemLinks a:hover{border-color:#4fdcff}.ecosystemLinks span{color:#8fb4c8;font-size:13px}@media(max-width:720px){.ecosystemLinks{grid-template-columns:1fr}}.specialty .teach{max-width:960px;color:#abc0cd;font-size:17px;line-height:1.75}.teachingImage{margin:30px 0 16px;padding:10px;border:1px solid #ffffff18;border-radius:20px;background:#06131e;overflow:hidden}.teachingImage img{display:block;width:100%;height:auto;border-radius:13px}.teachingImage figcaption{padding:12px 6px 4px;color:#78dfff;font-size:9px;font-weight:900;letter-spacing:.13em}.findingBox{margin:18px 0;padding:25px;border:1px solid #f2c66d55;border-radius:18px;background:#f2c66d0b}.findingBox small{color:#8299a8;font-size:9px;font-weight:900;letter-spacing:.14em}.findingBox h3{margin:8px 0;color:#f2c66d;font:32px Georgia,serif}.findingBox .maxim{margin:0;color:#d7e7ef;font:22px/1.45 Georgia,serif}.lessonGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0}.lessonGrid article{padding:22px;border:1px solid #ffffff16;border-radius:16px;background:#06111c}.lessonGrid span{color:#f2c66d;font-size:9px;font-weight:900}.lessonGrid b{display:block;margin:10px 0;color:#78dfff;font-size:10px;letter-spacing:.1em}.lessonGrid p{margin:0;color:#9fb5c4;line-height:1.65;font-size:14px}.samanthaPlayer{margin:16px 0 8px;padding:18px 20px;border:1px solid #78dfff44;border-radius:16px;background:#78dfff0b;display:flex;justify-content:space-between;gap:16px;align-items:center}.samanthaPlayer b{display:block;color:#78dfff;font-size:10px;letter-spacing:.12em}.samanthaPlayer span{display:block;margin-top:6px;color:#9fb5c4;font-size:12px}.samanthaButtons{display:flex;gap:8px;flex-wrap:wrap}.samanthaButtons button{cursor:pointer;padding:11px 14px;border-radius:10px;border:1px solid #78dfff55;background:#081d2a;color:#eef8fb;font-weight:900;font-size:10px}.samantha{margin:8px 0 16px;padding:20px 22px;border-left:3px solid #78dfff;background:#78dfff0b}.samantha b{color:#78dfff;font-size:10px;letter-spacing:.12em}.samantha p{margin:10px 0 0;color:#b6c8d2;line-height:1.7}.downloadBox{margin:18px 0 0;padding:22px;border:1px solid #78dfff44;border-radius:18px;background:#78dfff09;display:flex;gap:20px;align-items:center;justify-content:space-between}.downloadBox small{color:#78dfff;font-size:9px;font-weight:900;letter-spacing:.12em}.downloadBox h3{margin:7px 0;color:#eef6fb;font:24px Georgia,serif}.downloadBox p{max-width:720px;margin:0;color:#9fb5c4;line-height:1.55;font-size:13px}.downloadBox a{flex:0 0 auto;padding:14px 16px;border:1px solid #f2c66d66;border-radius:10px;background:#f2c66d12;color:#f2c66d;font-size:10px;font-weight:900;letter-spacing:.05em}.cards{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.cards a{padding:24px;border:1px solid #ffffff18;border-radius:18px;background:#07131fbb;transition:.15s}.cards a:hover{border-color:#78dfff55}.cards span{color:#78dfff;font-size:9px;font-weight:900;letter-spacing:.12em}.cards h3{font:26px/1.08 Georgia,serif;margin:12px 0}.cards p{color:#98aebb;line-height:1.6;font-size:14px}.cards b{color:#f2c66d;font-size:10px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.grid article{padding:22px;border:1px solid #ffffff16;border-radius:16px;background:#06111c}.grid b{color:#78dfff;font-size:10px;letter-spacing:.12em}.grid p{color:#9fb5c4;line-height:1.6}footer{margin-top:30px;padding:28px;border:1px solid #f2c66d33;border-radius:18px;color:#d4c49f;line-height:1.6}.identityStrip{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:28px}.identityStrip div{padding:15px;border:1px solid #ffffff16;border-radius:13px;background:#06131e}.identityStrip small{display:block;color:#7892a2;font-size:8px;font-weight:900;letter-spacing:.13em}.identityStrip b{display:block;margin-top:7px;color:#d9edf7;font-size:12px}.orientation{display:flex;gap:9px;flex-wrap:wrap;align-items:center;margin-top:12px;padding:14px 16px;border:1px solid #f2c66d33;border-radius:13px;background:#f2c66d08}.orientation b{color:#f2c66d;font-size:9px;letter-spacing:.1em}.orientation span{color:#9fb5c4;font-size:9px;font-weight:900}.boundaryGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px}.boundaryGrid article{padding:22px;border:1px solid #ffffff16;border-radius:16px;background:#06111c}.boundaryGrid span{color:#f2c66d;font-size:9px;font-weight:900;letter-spacing:.12em}.boundaryGrid h3{font:25px Georgia,serif;margin:10px 0}.boundaryGrid p{color:#9fb5c4;line-height:1.65;font-size:14px}footer b{color:#f2c66d;font-size:10px;letter-spacing:.12em}@media(max-width:800px){.model,.cards,.grid,.lessonGrid,.identityStrip,.boundaryGrid{grid-template-columns:1fr}.samanthaPlayer{display:block}.samanthaButtons{margin-top:14px}.downloadBox{display:block}.downloadBox a{display:inline-block;margin-top:16px}.node i{right:50%;top:auto;bottom:-21px;transform:rotate(90deg)}}
  `}</style></main>
}
