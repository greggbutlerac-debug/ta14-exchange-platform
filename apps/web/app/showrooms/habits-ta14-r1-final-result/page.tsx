"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const established = [
  "Bidirectional transport",
  "Object identity / provenance preservation",
  "Attribution preservation",
  "Inspectable cross-architecture context",
  "Material UNKNOWN preservation",
  "Freshness / currentness preservation",
  "Continuity preservation",
  "Consequence binding preservation"
];

const notEstablished = [
  "Authority transfer",
  "Determination transfer",
  "Execution authority transfer"
];

export default function Page() {
  const [direction,setDirection]=useState<"habits"|"ta14">("habits");
  const [crossed,setCrossed]=useState(false);
  const [field,setField]=useState("Object identity & provenance");
  const replayRef=useRef<HTMLElement | null>(null);
  const autoPlayed=useRef(false);
  useEffect(()=>{
    const el=replayRef.current;
    if(!el) return;
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting && !autoPlayed.current){
        autoPlayed.current=true;
        window.setTimeout(()=>setCrossed(true),450);
        observer.disconnect();
      }
    },{threshold:.45});
    observer.observe(el);
    return ()=>observer.disconnect();
  },[]);
  const preserved=["Object identity & provenance","Originating architecture / state owner","Determination identity & state","Evidentiary standing & limitations","Applicability","Material UNKNOWNs","Freshness / currentness","Governance-authorisation context","Continuity state","Consequence binding","Effective examination point"];
  const blocked=["Local constitutional authority","Receiving architecture determination","Execution authority"];
  const source=direction==="habits"?"HABITS / P-01: UAB: HOLD":"TA-14 / P-01: HOLD";
  const receiver=direction==="habits"?"TA-14":"HABITS";
  return <main className="page"><div className="wrap">
    <nav>
      <Link href="/">TA-14 EXCHANGE</Link>
      <div><Link href="/governance-showcase/TA-14-AIGR-000044">HABITS GOVERNANCE</Link><Link href="/showrooms/artifacts-examination-records">ARTIFACT RECORDS</Link></div>
    </nav>

    <header>
      <p className="eyebrow">HABITS × TA-14 · INTEROPERABILITY EXAMINATION · R1</p>
      <div className="status">v1.0-PRESERVED · BILATERALLY CONFIRMED</div>
      <h1>Two architectures.<br/><em>One tested seam.</em></h1>
      <p className="lede">R1 tested whether HABITS and TA-14 could transport and recognize independently attributable determination state across a frozen interface without either architecture inheriting the other's authority or determination.</p>
      <div className="result"><small>R1 RESULT</small><strong>BOUNDED INTERFACE-STATE INTEROPERABILITY ESTABLISHED FOR THE TESTED R1 OBJECTS, FIELDS, DIRECTIONS AND FROZEN INTERFACE CONDITIONS.</strong></div>
    </header>

    <section className="interactive" ref={replayRef}>
      <p className="eyebrow">INTERACTIVE R1 REPLAY · PRESERVED RESULT</p>
      <h2>Run the crossing yourself.</h2>
      <p className="note">This replay does not create a new examination. It demonstrates the already-preserved R1 crossing once on arrival, then remains available for manual replay and direction switching.</p>
      <div className="controls"><button className={direction==="habits"?"active":""} onClick={()=>{setDirection("habits");setCrossed(false)}}>HABITS → TA-14</button><button className={direction==="ta14"?"active":""} onClick={()=>{setDirection("ta14");setCrossed(false)}}>TA-14 → HABITS</button><button className="run" onClick={()=>setCrossed(true)}>{crossed?"REPLAY COMPLETE ✓":"RUN PRESERVED CROSSING →"}</button></div>
      <div className={"replay "+(crossed?"crossed":"")}><div className="node"><small>ORIGINATING STATE</small><strong>{source}</strong><p>Independently owned determination.</p></div><div className="rail"><span>{crossed?"ATTRIBUTABLE CONTEXT CROSSED":"READY"}</span><div className="track"><i>→</i>{crossed&&<b className="packet">AUTHORITY<br/>CONTEXT</b>}</div></div><div className="node receiver"><small>RECEIVING ARCHITECTURE</small><strong>{receiver}</strong><p>{crossed?"Recognized as inspectable context. Local determination remains independent.":"No received context yet."}</p></div></div>
      {crossed&&<div className="inspect"><div><h3>11 frozen fields survive the crossing</h3><div className="fieldlist">{preserved.map(x=><button key={x} className={field===x?"selected":""} onClick={()=>setField(x)}>✓ {x}</button>)}</div><p className="fieldread"><b>INSPECTING:</b> {field}<br/><span>Preserved as attributable R1 context; receipt does not establish new local authority.</span></p></div><div><h3>Hard-stop gates</h3><p className="gateintro">The attributable context arrives. These three states do not cross with it.</p>{blocked.map((x,i)=><div className={"blocked gate g"+i} key={x}><span>✕</span><div><small>HARD STOP {i+1}</small><b>{x}</b></div></div>)}<div className="verdict"><small>R1 RECEIPT TEST</small><strong>LOCAL INDEPENDENCE PRESERVED</strong><p>RECEIPT ≠ ACCEPTANCE · RECOGNITION ≠ ADOPTION</p></div></div></div>}
    </section>

    <section>
      <p className="eyebrow">THE TESTED SEAM</p>
      <h2>Recognition without adoption.</h2>
      <div className="crossing">
        <article><span>HABITS → TA-14</span><h3>UAB: HOLD crossed.</h3><p>TA-14 received the HABITS determination as independently attributable context. Receipt did not convert it into a TA-14 determination, Admissible Evidence, Applicable Authority or Established Standing.</p></article>
        <div className="seam">RECEIPT<br/>≠<br/>ACCEPTANCE</div>
        <article><span>TA-14 → HABITS</span><h3>TA-14: HOLD crossed.</h3><p>HABITS received the TA-14 determination as attributable context. It did not become a HABITS determination, PAF standing, represented site-specific DAS, governance authorization or execution authority.</p></article>
      </div>
    </section>

    <section>
      <p className="eyebrow">WHAT R1 ESTABLISHED</p>
      <h2>The state could cross. The authority did not.</h2>
      <div className="grid">{established.map(x=><article key={x}><b>ESTABLISHED</b><p>{x}</p></article>)}</div>
      <div className="independence"><div><small>LOCAL DETERMINATION INDEPENDENCE AT RECEIPT</small><strong>PRESERVED</strong></div><div><small>LOCAL AUTHORITY INDEPENDENCE AT RECEIPT</small><strong>PRESERVED</strong></div></div>
    </section>

    <section>
      <p className="eyebrow">WHAT DID NOT CROSS</p>
      <div className="grid three">{notEstablished.map(x=><article key={x} className="no"><b>NOT ESTABLISHED</b><p>{x}</p></article>)}</div>
      <div className="rules"><b>R1 SUCCESS ≠ GENERAL INTEROPERABILITY.</b><b>TRANSPORT ≠ AUTHORITY TRANSFER.</b><b>RECOGNITION ≠ ADOPTION.</b><b>CONVERGENCE ≠ DERIVATION.</b></div>
    </section>

    <section>
      <p className="eyebrow">DYNAMIC-INDEPENDENCE BOUNDARY</p>
      <h2>R1 stops exactly where the evidence stops.</h2>
      <div className="boundary"><div><small>INDEPENDENCE AT RECEIPT</small><strong>ESTABLISHED</strong></div><div><small>INDEPENDENCE UNDER SUBSEQUENT STATE CHANGE</small><strong>NOT YET TESTED</strong></div></div>
      <p className="note">R1 did not test later disagreement, staleness, changed evidence, changed authority, changed standing, changed freshness or changed consequence state. Any such examination must be separately constituted and cannot modify the preserved R1 result.</p>
    </section>

    <section>
      <p className="eyebrow">CENTRAL R1 FINDING</p>
      <blockquote>THE TWO ARCHITECTURES DID NOT HAVE TO BECOME ONE ARCHITECTURE IN ORDER TO INTEROPERATE AT THE TESTED DETERMINATION-STATE SEAM.</blockquote>
    </section>

    <section>
      <p className="eyebrow">PRESERVED RECORD</p>
      <div className="record">
        <div><small>RECORD</small><strong>HABITS × TA-14 INTEROPERABILITY EXAMINATION — R1 FINAL RESULT RECORD — v1.0-PRESERVED</strong></div>
        <div><small>STATUS</small><strong>BILATERALLY CONFIRMED / PRESERVED · R1 CLOSED</strong></div>
        <div><small>PRESERVATION TIMESTAMP</small><strong>28 September 2026 — 21:19:50 AEST (UTC+10:00), Australia/Sydney</strong></div>
        <div><small>FINAL PDF SHA-256</small><code>9e1e8832239a13f1e72be4e3fcef983c3879ce8912e321b24c1f19505d81bcb6</code></div>
      </div>
      <div className="discipline"><b>CONSOLIDATION ≠ REINTERPRETATION.</b><b>PRESERVATION ≠ EXPANSION.</b></div>
    </section>

    <footer><div><b>R1: CLOSED</b><p>This public showroom describes the preserved bilateral result. It does not reopen, expand or reinterpret R1.</p></div><Link href="/habits-ta14-interoperability">VIEW THE EXAMINATION LAB →</Link></footer>
  </div><style>{`
    *{box-sizing:border-box}body{margin:0}.page{min-height:100vh;background:radial-gradient(circle at 12% 0,#173c5f66,transparent 28%),radial-gradient(circle at 88% 8%,#73552244,transparent 26%),linear-gradient(180deg,#02070c,#071522 55%,#02070c);color:#eef6fb;font-family:Arial,sans-serif}.wrap{width:min(1180px,calc(100% - 34px));margin:auto}nav{min-height:76px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff17}nav div{display:flex;gap:18px}a{color:#8ddcff;text-decoration:none;font-size:10px;font-weight:950;letter-spacing:.09em}header{padding:90px 0 70px}.eyebrow{color:#efc86c;font-size:10px;font-weight:950;letter-spacing:.17em}.status{display:inline-block;margin-top:18px;padding:9px 12px;border:1px solid #7ff0bd55;border-radius:999px;color:#7ff0bd;font-size:9px;font-weight:950;letter-spacing:.1em}h1{font:clamp(55px,8vw,100px)/.94 Georgia,serif;letter-spacing:-.045em;margin:24px 0}h1 em{color:#efc86c;font-weight:400}.lede{max-width:920px;color:#a7bdca;font-size:19px;line-height:1.7}.result{margin-top:35px;max-width:1000px;padding:23px;border:1px solid #7ff0bd55;border-radius:16px;background:#7ff0bd09}.result small,.record small,.boundary small,.independence small{display:block;color:#829dab;font-size:8px;font-weight:950;letter-spacing:.13em;margin-bottom:8px}.result strong{color:#bdf8dc;line-height:1.55;font-size:13px}section{padding:65px 0;border-top:1px solid #ffffff14}h2{font:clamp(35px,5vw,60px)/1.04 Georgia,serif;margin:12px 0 30px}.crossing{display:grid;grid-template-columns:1fr 120px 1fr;gap:14px}.crossing article,.grid article{padding:25px;border:1px solid #ffffff18;border-radius:17px;background:#06121c}.crossing span,.grid b{color:#8ddcff;font-size:9px;font-weight:950;letter-spacing:.12em}.crossing h3{font:28px Georgia,serif;margin:12px 0}.crossing p,.grid p,.note,footer p{color:#9db3c0;line-height:1.65}.seam{display:grid;place-items:center;text-align:center;color:#efc86c;font-size:10px;font-weight:950;line-height:1.7}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.grid article p{margin-bottom:0;font-weight:800}.grid.three{grid-template-columns:repeat(3,1fr)}.grid .no{border-color:#efc86c44}.grid .no b{color:#efc86c}.independence,.boundary{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.independence div,.boundary div,.record>div{padding:20px;border:1px solid #ffffff17;border-radius:13px;background:#030b12}.independence strong,.boundary strong{color:#7ff0bd}.boundary div:last-child strong{color:#efc86c}.rules,.discipline{display:flex;gap:9px;flex-wrap:wrap;margin-top:18px}.rules b,.discipline b{padding:10px 12px;border:1px solid #efc86c33;border-radius:999px;color:#efc86c;font-size:9px}blockquote{margin:20px 0;padding:35px;border-left:3px solid #efc86c;background:#efc86c08;font:clamp(27px,4vw,47px)/1.22 Georgia,serif;color:#f1dfb4}.record{display:grid;gap:8px}.record strong,.record code{font-size:12px;line-height:1.55;color:#d8e7ee;overflow-wrap:anywhere}footer{padding:40px 0 70px;border-top:1px solid #ffffff18;display:flex;justify-content:space-between;gap:25px;align-items:center}footer b{color:#7ff0bd;letter-spacing:.1em}.controls{display:flex;gap:9px;flex-wrap:wrap;margin:22px 0}.controls button,.fieldlist button{appearance:none;border:1px solid #ffffff22;background:#06121c;color:#a9c0cc;border-radius:10px;padding:13px 15px;font-weight:900;cursor:pointer}.controls button.active,.fieldlist button.selected{border-color:#8ddcff88;color:#8ddcff;background:#8ddcff0d}.controls .run{margin-left:auto;border-color:#efc86c66;color:#efc86c}.replay{display:grid;grid-template-columns:1fr 180px 1fr;gap:12px;align-items:stretch}.node{padding:24px;border:1px solid #ffffff1c;border-radius:16px;background:#06121c}.node small{display:block;color:#839eac;font-size:8px;font-weight:950;letter-spacing:.13em;margin-bottom:10px}.node strong{font:24px Georgia,serif}.node p{color:#91aab7;line-height:1.5}.rail{display:grid;place-items:center;text-align:center;color:#657d89;font-size:9px;font-weight:950;letter-spacing:.1em}.track{position:relative;width:100%;height:54px;display:grid;place-items:center;overflow:visible}.track:before{content:"";position:absolute;left:5%;right:5%;top:50%;height:1px;background:#ffffff25}.rail i{position:relative;z-index:1;font-size:38px;font-style:normal;background:#071522;padding:0 8px}.packet{position:absolute;z-index:2;left:0;top:5px;padding:7px 9px;border:1px solid #7ff0bd88;border-radius:8px;background:#09251c;color:#bdf8dc;font-size:7px;line-height:1.15;box-shadow:0 0 24px #7ff0bd44;animation:crossPacket 1.05s cubic-bezier(.2,.75,.25,1) forwards}@keyframes crossPacket{0%{left:0;opacity:.25;transform:scale(.85)}45%{opacity:1;transform:scale(1.06)}100%{left:calc(100% - 58px);opacity:1;transform:scale(1)}}.crossed .rail{color:#7ff0bd}.crossed .receiver{border-color:#7ff0bd55}.inspect{display:grid;grid-template-columns:1.35fr .65fr;gap:12px;margin-top:12px;padding-top:12px;border-top:1px solid #ffffff16}.inspect>div{padding:22px;border:1px solid #ffffff18;border-radius:16px;background:#030b12}.inspect h3{font:24px Georgia,serif;margin:0 0 15px}.fieldlist{display:flex;gap:7px;flex-wrap:wrap}.fieldlist button{padding:9px 10px;font-size:9px}.fieldread{padding:15px;border-left:2px solid #8ddcff;color:#c9d9e1;line-height:1.6}.fieldread span{color:#91aab7}.gateintro{color:#829aa7;font-size:11px;line-height:1.5}.blocked{display:flex;align-items:center;gap:12px;padding:12px;margin:7px 0;border:1px solid #efc86c33;border-radius:9px;color:#efc86c;font-size:11px;font-weight:900;animation:gateStop .35s ease both}.blocked>span{display:grid;place-items:center;min-width:28px;height:28px;border:1px solid #efc86c77;border-radius:50%;font-size:15px}.blocked small{display:block;color:#8f7d54;font-size:7px;letter-spacing:.12em;margin-bottom:3px}.blocked b{display:block}.g1{animation-delay:.12s}.g2{animation-delay:.24s}@keyframes gateStop{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}.verdict{margin-top:16px;padding:15px;border:1px solid #7ff0bd44;border-radius:10px}.verdict small{display:block;color:#7893a0;font-size:8px}.verdict strong{display:block;color:#7ff0bd;margin:7px 0}.verdict p{font-size:9px;color:#91aab7}@media(max-width:800px){nav,footer{align-items:flex-start;flex-direction:column;padding:22px 0}.crossing,.grid,.grid.three,.independence,.boundary,.replay,.inspect{grid-template-columns:1fr}.controls .run{margin-left:0}.rail{min-height:70px}.rail i{transform:rotate(90deg)}.seam{min-height:70px}nav div{flex-wrap:wrap}}
  `}</style></main>
}