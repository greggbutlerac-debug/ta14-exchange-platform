'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function P3479TechnicalProposition(){
  const [changed,setChanged]=useState(false);
  const [authority,setAuthority]=useState(true);
  const determination=!authority?'DENY':changed?'HOLD':'ALLOW';
  return <main className="p">
    <nav><Link href="/">TA-14 AUTHORITY</Link><span>TECHNICAL PROPOSITION · OPEN FOR CHAIR REVIEW</span></nav>
    <section className="hero">
      <p className="eyebrow">IEEE P3479 · BOUNDED TECHNICAL PROPOSITION</p>
      <h1>Safe operation is not the same question as <em>present execution authority.</em></h1>
      <p className="lead">When a building AI reaches a technically valid decision, what must still be established before that decision is permitted to become physical execution <b>NOW?</b></p>
      <div className="status"><b>v0.1-CANDIDATE · 25 SEP 2026</b><b>NOT FROZEN</b><b>NOT AN IEEE CONTRIBUTION</b><b>NOT ENDORSED BY IEEE</b><b>OPEN FOR P3479 CORRECTION</b></div>
      <div className="why"><small>30-SECOND ORIENTATION · WHY P3479?</small><p>This candidate examination starts <b>after</b> a building AI has produced a technically valid decision. It asks a separate downstream question: before that decision becomes a physical building action, what must establish that execution is permitted under the conditions that exist now?</p></div>
    </section>
    <section className="seam">
      <p className="eyebrow">PROPOSED EXAMINATION BOUNDARY · FOR P3479 CORRECTION</p><h2>The model can still be right while execution must stop.</h2>
      <p className="copy">TA-14 is proposing this boundary for correction, not asserting where P3479's formal scope ends.</p>
      <div className="flow"><span>AI / MODEL DECISION<br/><small>technically valid</small></span><i>→</i><span>PROPOSED PHYSICAL ACTION<br/><small>start · stop · close · open · shed · reset</small></span><i>→</i><span className="gate">EXECUTION BOUNDARY<br/><small>prove present sufficiency</small></span><i>→</i><span>BUILDING REALITY</span></div>
      <div className="question">Does this proposed consequence have sufficient <b>Admissible Evidence, Applicable Authority, and Established Standing</b> to become reality NOW?</div>
    </section>
    <section className="lab">
      <p className="eyebrow">RUN ONE CHANGED-CONDITION TEST</p><h2>AI proposes: START AHU-3.</h2>
      <p className="copy">Assume the model's reasoning remains technically valid. Change only the execution context below.</p>
      <div className="controls">
        <button onClick={()=>setCondition('evidence')} className={condition==='evidence'?'on':''}>SENSOR EVIDENCE CHANGED</button>
        <button onClick={()=>setCondition('binding')} className={condition==='binding'?'on':''}>EQUIPMENT BINDING CHANGED</button>
        <button onClick={()=>setCondition('safety')} className={condition==='safety'?'on':''}>DOWNSTREAM SAFETY CHANGED</button>
        <button onClick={()=>setAuthority(v=>!v)} className={!authority?'deny':''}>{authority?'REVOKE CURRENT AUTHORITY':'✓ AUTHORITY REVOKED'}</button>
        <button onClick={()=>{setCondition('none');setAuthority(true)}}>RESET TEST</button>
      </div>
      <div className="cards">
        <article><small>MODEL DECISION</small><strong>START AHU-3</strong><p>Decision remains technically valid for this demonstration.</p></article>
        <article><small>CURRENT CONTEXT</small><strong>{changed?'MATERIAL CHANGE':'UNCHANGED'}</strong><p>{conditionText}</p></article>
        <article><small>EXECUTION AUTHORITY</small><strong>{authority?'PRESENT':'REVOKED'}</strong><p>A valid decision does not create authority. Present authority is examined separately.</p></article>
      </div>
      <div className="triplet">
        <div><small>ADMISSIBLE EVIDENCE</small><b>{changed?'REVALIDATION REQUIRED':'ESTABLISHED'}</b></div>
        <div><small>APPLICABLE AUTHORITY</small><b>{authority?'ESTABLISHED':'NOT ESTABLISHED'}</b></div>
        <div><small>ESTABLISHED STANDING</small><b>{authority?'ESTABLISHED':'NOT SUFFICIENT FOR EXECUTION'}</b></div>
      </div>
      <div className={'result '+determination.toLowerCase()}><small>TA-14 EXECUTION-BOUNDARY DETERMINATION</small><b>{determination}</b><p>{determination==='ALLOW'?'The examined conditions remain sufficient for this demonstration.':determination==='HOLD'?'The model decision is not erased. A material condition changed, so execution pauses until the affected evidence or binding is revalidated.':'The proposed action does not have present execution authority.'}</p></div>
    </section>
    <section className="boundary"><p className="eyebrow">WHAT THIS PROPOSITION DOES NOT CLAIM</p><h2>TA-14 is not proposing to replace the work of P3479.</h2>
      <div className="grid"><article><b>UPSTREAM TECHNICAL VALIDITY</b><p>For purposes of this examination, technical validity of the model decision is treated as an upstream condition. TA-14 does not evaluate or replace P3479 requirements governing model performance, safety, validation, or technical correctness.</p></article><article><b>NOT BUILDING SEMANTICS</b><p>TA-14 does not replace the building's data, control, semantic, or cybersecurity systems.</p></article><article><b>NOT IEEE AUTHORITY</b><p>This page is a TA-14 technical examination object. It does not represent IEEE, P3479, its chair, or its working group.</p></article><article><b>THE QUESTION</b><p>Should safe-operation requirements distinguish a valid AI decision from present authority for that decision to become physical execution?</p></article></div>
    </section>
    <section className="chain"><p className="eyebrow">TA-14 FAIL-CLOSED CHAIN</p><div>{['Reality','Record','Continuity','Admissibility','Binding','Commit','Execution','Outcome'].map((x,i)=><span key={x}><small>{String(i+1).padStart(2,'0')}</small>{x}</span>)}</div><p>Capability ≠ Authority. Understanding is not permission. No admissible evidence. No admissible execution.</p></section>
    <section className="ask"><p className="eyebrow">QUESTIONS FOR P3479 TECHNICAL SCRUTINY</p><h2>If the AI decision remains technically valid but the evidence, binding, identity, downstream state, or authority materially changes before execution, what should a safe-operation standard require the system to prove before acting?</h2>
      <div className="reviewQs"><p><b>01</b> Does this proposition overlap a condition P3479 already addresses?</p><p><b>02</b> Is the proposed boundary represented correctly? If not, where is it wrong?</p><p><b>03</b> If the boundary is legitimate, is it appropriate for examination by the working group?</p></div>
      <p>This is a candidate examination object. TA-14 is asking for correction before any boundary is treated as established. No adoption or endorsement is requested.</p></section>
    <footer>TA-14 AUTHORITY · INDEPENDENT GOVERNANCE INSTITUTION · TECHNICAL PROPOSITION</footer>
    <style jsx>{`
      *{box-sizing:border-box}.p{min-height:100vh;background:#05080d;color:#edf4f7;font-family:Arial,Helvetica,sans-serif}.p nav{height:66px;display:flex;justify-content:space-between;align-items:center;padding:0 max(24px,calc((100vw - 1160px)/2));border-bottom:1px solid #ffffff18;font-size:10px;font-weight:900;letter-spacing:.12em}.p nav a{color:#fff;text-decoration:none}.p nav span{color:#7f96a3}.hero,.seam,.lab,.boundary,.chain,.ask{width:min(1160px,calc(100% - 42px));margin:auto;padding:72px 0;border-bottom:1px solid #ffffff13}.hero{padding-top:100px}.eyebrow{font-size:9px;font-weight:950;letter-spacing:.18em;color:#76c8ef}.hero h1,.p h2{font-size:clamp(38px,6vw,78px);line-height:1.02;letter-spacing:-.045em;margin:18px 0}.hero h1 em{font-style:normal;color:#8ed8fa}.lead{font-size:19px;line-height:1.7;color:#aabac3;max-width:900px}.status{display:flex;gap:8px;flex-wrap:wrap;margin-top:30px}.status b{font-size:8px;letter-spacing:.1em;padding:9px 12px;border:1px solid #ffffff24;border-radius:99px;color:#9eb2bd}.why{margin-top:28px;padding:24px;border:1px solid #76c8ef38;border-radius:12px;background:#76c8ef09;max-width:900px}.why small{font-size:8px;font-weight:900;color:#76c8ef;letter-spacing:.12em}.why p{line-height:1.65;color:#aabac3;margin-bottom:0}.p h2{font-size:clamp(32px,4.5vw,55px);max-width:980px}.flow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:35px 0}.flow span{padding:20px;border:1px solid #ffffff20;border-radius:12px;background:#0a1018;font-size:11px;font-weight:900}.flow small{display:block;color:#7e929d;margin-top:7px;font-weight:400}.flow i{color:#637986}.flow .gate{border-color:#e9bc5966;color:#f1d28b}.question{padding:28px;border-left:4px solid #e9bc59;background:#e9bc590c;font-size:20px;line-height:1.55}.copy{color:#91a4ae}.controls{display:flex;gap:12px;flex-wrap:wrap;margin:28px 0}.controls button{cursor:pointer;padding:14px 18px;border-radius:9px;border:1px solid #69bce858;background:#09141d;color:#bce7fb;font-weight:900;font-size:10px}.controls .on{border-color:#e9bc59;color:#f1d28b}.controls .deny{border-color:#ff7474;color:#ffaaaa}.cards,.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.cards article,.grid article{padding:23px;border:1px solid #ffffff17;border-radius:13px;background:#090e14}.cards small{font-size:8px;color:#7793a2;font-weight:900}.cards strong{display:block;font-size:20px;margin:10px 0}.cards p,.grid p{color:#8397a2;font-size:12px;line-height:1.65}.triplet{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}.triplet div{padding:18px;border:1px solid #ffffff17;border-radius:10px;background:#070c12}.triplet small{display:block;font-size:8px;color:#7793a2;font-weight:900}.triplet b{display:block;margin-top:8px;font-size:12px}.result{margin-top:14px;padding:26px;border-radius:13px;border:1px solid #ffffff20}.result small{font-size:8px;font-weight:900}.result b{display:block;font-size:46px;margin:7px 0}.result p{margin:0;color:#a8b7bf}.allow{border-color:#65d79a66}.hold{border-color:#e9bc5977}.deny{border-color:#ff747477}.grid{grid-template-columns:repeat(2,1fr);margin-top:28px}.grid b{font-size:10px;color:#cbeafa}.chain>div{display:grid;grid-template-columns:repeat(8,1fr);gap:7px;margin:25px 0}.chain span{padding:16px 8px;border:1px solid #ffffff17;border-radius:9px;font-size:10px;font-weight:900}.chain small{display:block;color:#67bce5;margin-bottom:7px}.chain p,.ask p{color:#899da8;line-height:1.7}.ask h2{font-size:clamp(29px,4vw,48px)}.reviewQs{margin:28px 0;display:grid;gap:9px}.reviewQs p{margin:0;padding:17px;border:1px solid #ffffff17;border-radius:9px;background:#080d13}.reviewQs b{color:#76c8ef;margin-right:12px}footer{width:min(1160px,calc(100% - 42px));margin:auto;padding:45px 0 70px;color:#60737e;font-size:9px}@media(max-width:760px){.cards,.grid,.triplet{grid-template-columns:1fr}.chain>div{grid-template-columns:repeat(2,1fr)}.p nav span{display:none}}
    `}</style>
  </main>
}