'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type State = 'established' | 'missing' | 'changed';
type Result = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';

const moments = [
  ['01','PAUSE','Interrupt reflexive action before it becomes consequence.'],
  ['02','CONTEXT','Show the human what matters in this exact situation.'],
  ['03','MEMORY','Bring forward relevant prior records without converting memory into permission.'],
  ['04','GUIDANCE','Present bounded guidance, sequence, warnings, and options.'],
  ['05','AUTHORITY','Establish what the human is actually authorized to do here and now.'],
  ['06','CHOICE','The human evaluates the presented context and remains the actor.'],
  ['07','ACTION','A bounded human act crosses into physical, institutional, or digital reality.'],
  ['08','RECORD','Preserve what was known, shown, chosen, done, and produced.'],
  ['09','OUTCOME','The consequence becomes reviewable and creates a new reality.']
];

const distinctions = [
  ['SEE','RECORD'],['RECORD','RETAIN'],['RETAIN','TRANSMIT'],['RECOGNIZE','IDENTIFY'],
  ['INFER','KNOW'],['RECOMMEND','AUTHORITY TO ACT'],['CAPABILITY','AUTHORITY']
];

const operatingLayers = [
  ['HUMAN STATE','What does the system know about workload, attention, fatigue, stress, environment, or readiness—and what does it not know? Human-state signals are context, not automatic authority.'],
  ['SITUATIONAL CONTEXT','What is happening now? Identify the asset, place, task, hazard, people, constraints, and changed conditions that make this moment different from the last one.'],
  ['EVIDENCE PROVENANCE','Where did each material fact come from? Preserve source, time, identity, transformation, confidence, and continuity so guidance can be traced rather than merely trusted.'],
  ['SEQUENCE INTEGRITY','What must happen first, what must remain true, and what invalidates the next step? Sequence is governed as a dependency chain rather than a checklist to click through.'],
  ['INTERVENTION BOUNDARY','What exact action is being proposed? Bound the consequence before evaluating whether evidence, authority, and standing are sufficient for that action.'],
  ['CHANGED-CONDITION REVALIDATION','An ALLOW is not permanent. Material change returns the proposed consequence to examination before the next irreversible step.'],
  ['HUMAN COMMIT','The system may advise, warn, explain, or hold. The accountable human crosses the commit boundary when human execution is required.'],
  ['RECEIPT + REPLAY','Preserve what the human could see, what the system presented, the governing state, the choice, the action, and the resulting outcome so the moment can later be reconstructed.']
];

const failureModes = [
  ['AUTOMATION BIAS','A recommendation is treated as correct because a machine produced it.','Expose provenance, uncertainty, alternatives, and the independent authority question.'],
  ['STALE CONTEXT','Guidance was valid earlier but a material condition changed.','Invalidate reliance and re-run the NOW examination.'],
  ['AUTHORITY LEAKAGE','A system can perform an action and is therefore assumed permitted to perform it.','Separate capability from Applicable Authority and Established Standing.'],
  ['SEQUENCE COLLAPSE','A later step is attempted before a prerequisite has been established.','Hold the consequence at the failed dependency.'],
  ['UNTRACEABLE GUIDANCE','The human receives an instruction with no inspectable basis.','Bind material guidance to attributable evidence and the governing record.'],
  ['HUMAN OVERRIDE WITHOUT RECORD','A person departs from guidance but the reason disappears.','Preserve the choice, available context, stated basis, action, and outcome without converting the record into behavioral control.']
];

const receiptFields = [
  'Actor / role / standing','Proposed consequence','Time + place + operating context','Evidence presented','Source + provenance','Applicable authority','Changed conditions','Guidance shown','Warnings / alternatives','Human choice / commit','Action actually performed','Outcome + new baseline'
];

const domains = [
  ['FIELD SERVICE','Technician receives live context before a consequential intervention.'],
  ['NURSING','Clinical guidance can support a person without silently becoming clinical authority.'],
  ['PILOTS','Sequence, changed conditions, warnings, and human authority remain explicit.'],
  ['PUBLIC SAFETY','Information can arrive quickly while the authority to act remains separately governed.'],
  ['EMERGENCY RESPONSE','Urgency changes time available; it does not erase the execution boundary.'],
  ['HVACD/R','Baseline → NIRET → Declared Diagnostic Determination → Intervention → Post-Intervention Performance Record.'],
  ['WEARABLE AI','Smart glasses and near-ear prompts can guide perception without becoming the actor.'],
  ['PERSONAL DECISIONS','A system can create a pause and show context while preserving human choice.']
];

export default function HumanPerformanceStackShowroom(){
  const [evidence,setEvidence]=useState<State>('established');
  const [authority,setAuthority]=useState<State>('established');
  const [standing,setStanding]=useState<State>('established');
  const [conditions,setConditions]=useState<State>('established');

  const result:Result=useMemo(()=>{
    if(evidence==='missing') return 'HOLD';
    if(authority==='missing') return 'DENY';
    if(standing==='missing') return 'ESCALATE';
    if(conditions==='changed'||authority==='changed'||standing==='changed'||evidence==='changed') return 'HOLD';
    return 'ALLOW';
  },[evidence,authority,standing,conditions]);

  const color={ALLOW:'#72f1b8',HOLD:'#ffd36f',DENY:'#ff7b87',ESCALATE:'#baa8ff'}[result];
  const copy={
    ALLOW:'The presented record supports the proposed human action, authority and standing are established, and no changed condition presently defeats reliance. The human still chooses whether to act.',
    HOLD:'A required condition is missing, changed, or no longer current. Guidance may continue, but the proposed consequence does not cross the execution boundary yet.',
    DENY:'Applicable authority for this proposed action is not established. Capability, recommendation, urgency, or system confidence cannot manufacture permission.',
    ESCALATE:'The record does not establish the human actor\'s standing strongly enough for this consequence. Route the matter to the appropriate governed review.'
  }[result];

  const toggle=(label:string,value:State,setter:(v:State)=>void)=>(
    <div className="gate"><b>{label}</b><div>{(['established','changed','missing'] as State[]).map(v=><button key={v} onClick={()=>setter(v)} className={value===v?'active':''}>{v.toUpperCase()}</button>)}</div></div>
  );

  return <main className="page"><div className="glow"/><div className="shell">
    <nav><Link href="/showrooms">← TA-14 SHOWROOMS</Link><span>PUBLIC TECHNICAL SHOWROOM · HUMAN PERFORMANCE EXECUTION INTEGRITY</span></nav>

    <header>
      <p className="eyebrow">TA-14 · HUMAN PERFORMANCE STACK</p>
      <h1>THE MOMENT<br/><em>BEFORE HUMAN ACTION</em><br/>BECOMES CONSEQUENCE.</h1>
      <p className="lead">A human-facing execution architecture for high-consequence moments. The system creates a pause. The system shows what matters. <b>The human chooses and acts.</b> The record saves the truth of the moment.</p>
      <div className="doctrine"><strong>THE HUMAN REMAINS THE ACTOR.</strong><span>THE SYSTEM GUIDES.</span><span>THE RECORD PRESERVES THE TRUTH.</span><span>THE OUTCOME BECOMES REVIEWABLE.</span></div>
      <div className="actions"><a href="#exam">RUN THE HUMAN-ACTION EXAM ↓</a><a className="secondary" href="https://www.amazon.com/dp/B0H732NR2F" target="_blank" rel="noreferrer">READ THE MASTER EDITION ↗</a></div>
    </header>

    <section className="question">
      <p className="eyebrow">THE GOVERNING QUESTION</p>
      <h2>Does this proposed consequence have sufficient <em>Admissible Evidence</em>, <em>Applicable Authority</em>, and <em>Established Standing</em> to become reality <u>NOW</u>?</h2>
      <p>HPS applies that question at the human edge. It does not remove judgment. It makes the pre-action moment inspectable enough that assistance does not silently become authority.</p>
    </section>

    <section className="chain"><p className="eyebrow">THE HUMAN PERFORMANCE EXECUTION CHAIN</p><div className="chainGrid">{moments.map(([n,t,c])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}</div></section>

    <section className="boundary"><div><p className="eyebrow">THE BOUNDARY</p><h2>ASSISTANCE<br/><em>IS NOT EXECUTION.</em></h2><p>Wearables, AI, sensors, memory systems, copilots, checklists, near-ear prompts, and automated evidence capture can increase what a person can perceive and understand. None of those capabilities independently establish permission to create a consequence.</p></div><div className="neq">{distinctions.map(([a,b])=><div key={a+b}><b>{a}</b><span>≠</span><b>{b}</b></div>)}</div></section>

    <section id="exam" className="exam"><p className="eyebrow">INTERACTIVE EXAMINATION · CHANGE THE CONDITIONS</p><h2>Should this proposed human action cross into reality?</h2><p className="scenario"><b>PROPOSED CONSEQUENCE:</b> A human actor has received machine-assisted guidance and is ready to perform a consequential action.</p>
      <div className="gates">{toggle('ADMISSIBLE EVIDENCE',evidence,setEvidence)}{toggle('APPLICABLE AUTHORITY',authority,setAuthority)}{toggle('ESTABLISHED STANDING',standing,setStanding)}{toggle('PRESENT CONDITIONS / NOW',conditions,setConditions)}</div>
      <div className="result" style={{borderColor:color}}><small>CURRENT DETERMINATION</small><strong style={{color}}>{result}</strong><p>{copy}</p></div>
      <p className="note">This interactive surface demonstrates governance logic. It does not determine medical, legal, employment, law-enforcement, diagnostic, or professional authority.</p>
    </section>

    <section className="wearable"><p className="eyebrow">WEARABLE AI · SMART GLASSES · NEAR-EAR GUIDANCE</p><h2>The glasses can see.<br/><em>That does not mean they may decide.</em></h2><div className="flow"><article><b>PERCEIVE</b><p>Camera, audio, environmental sensors, context.</p></article><i>→</i><article><b>INTERPRET</b><p>Recognition, inference, memory, recommendation.</p></article><i>→</i><article className="stop"><b>GOVERN</b><p>Evidence, authority, standing, changed condition, scope.</p></article><i>→</i><article><b>HUMAN CHOICE</b><p>Pause, understand, choose, act—or do not act.</p></article><i>→</i><article><b>RECEIPT</b><p>Preserve what was shown, chosen, executed, and produced.</p></article></div></section>

    <section className="layers"><p className="eyebrow">THE OPERATING STACK · WHAT MUST BE GOVERNED IN THE MOMENT</p><h2>Human performance is not one signal.<br/><em>It is a governed state transition.</em></h2><p className="sectionLead">HPS does not ask a wearable or AI system to decide whether a person is good, bad, fit, unfit, safe, unsafe, competent, or incompetent. It asks what information is relevant to a specific proposed consequence, whether that information is attributable and current, what authority applies, whether standing exists, and what changed before execution.</p><div className="layerGrid">{operatingLayers.map(([t,c],i)=><article key={t}><span>{String(i+1).padStart(2,'0')}</span><b>{t}</b><p>{c}</p></article>)}</div></section>

    <section className="now"><p className="eyebrow">CONTINUOUS REVALIDATION · COMMISSIONED ONCE ≠ AUTHORIZED FOREVER</p><h2>An ALLOW expires when the facts that supported it stop being true.</h2><div className="nowFlow"><article><b>BASELINE</b><p>Establish the condition and the bounded action under examination.</p></article><i>→</i><article><b>ALLOW</b><p>Evidence, authority, standing, and present conditions support crossing now.</p></article><i>→</i><article className="change"><b>CHANGE</b><p>New hazard, new person, new asset state, new evidence, elapsed time, scope change, or authority change.</p></article><i>→</i><article><b>REVALIDATE</b><p>Return to the governing question before the next consequential commit.</p></article></div><strong className="nowRule">PAST PERMISSION ≠ PRESENT AUTHORITY.</strong></section>

    <section className="failure"><p className="eyebrow">FAILURE MODES · WHAT HPS IS DESIGNED TO MAKE VISIBLE</p><h2>The dangerous failure is often not bad information.<br/><em>It is an unjustified crossing.</em></h2><div className="failureGrid">{failureModes.map(([t,r,g])=><article key={t}><b>{t}</b><p>{r}</p><small>HPS RESPONSE</small><strong>{g}</strong></article>)}</div></section>

    <section className="receipt"><div><p className="eyebrow">THE HUMAN-ACTION RECEIPT</p><h2>Preserve the truth of the moment—not just the final click.</h2><p>A useful record must make the consequential moment replayable. The purpose is not to create a surveillance transcript of a person. It is to preserve the minimum attributable record needed to understand what supported the proposed consequence, what the human was shown, what authority existed, what choice crossed the boundary, and what became real.</p></div><div className="receiptGrid">{receiptFields.map((x,i)=><span key={x}><b>{String(i+1).padStart(2,'0')}</b>{x}</span>)}</div></section>

    <section className="domains"><p className="eyebrow">ONE ARCHITECTURE · MANY HUMAN MOMENTS</p><h2>Not a wearable product.<br/>A governed human-action layer.</h2><div>{domains.map(([t,c])=><article key={t}><b>{t}</b><p>{c}</p></article>)}</div></section>

    <section className="case"><p className="eyebrow">EXAMPLE · HVACD/R HUMAN PERFORMANCE INTEGRITY CHAIN</p><h2>From observation to intervention without skipping the consequence boundary.</h2><div className="caseFlow"><b>BASELINE</b><i>→</i><b>NIRET</b><i>→</i><b>DECLARED DIAGNOSTIC DETERMINATION</b><i>→</i><b>INTERVENTION</b><i>→</i><b>POST-INTERVENTION PERFORMANCE RECORD</b></div><p>The technician may receive live measurements, prior service history, sequence guidance, warnings, and AI assistance. Those inputs can improve the decision surface. They do not independently authorize opening equipment, changing a control sequence, replacing a component, altering a safety, or declaring the system corrected. The proposed intervention remains bounded by the evidence, authority, standing, present condition, and the accountable human commit.</p></section>

    <section className="limits"><p className="eyebrow">WHAT HPS IS NOT</p><h2>Accountable human agency—not control of the human.</h2><p>HPS is not surveillance, behavioral enforcement, medical advice, legal advice, employment discipline, law-enforcement authority, diagnostic authority, or a replacement for professional judgment. Its purpose is to support accountable human agency at the moment it matters most.</p></section>

    <section className="close"><p className="eyebrow">TA-14 HUMAN PERFORMANCE STACK</p><h2>The smallest consequential moment may be the one worth governing most.</h2><div><b>PAUSE.</b><b>SHOW WHAT MATTERS.</b><b>LET THE HUMAN CHOOSE.</b><b>PRESERVE THE RECORD.</b></div><strong>NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</strong></section>

    <footer>TA-14 AUTHORITY · HUMAN PERFORMANCE EXECUTION INTEGRITY GOVERNANCE<br/>REALITY → RECORD → CONTINUITY → ADMISSIBILITY → BINDING → COMMIT → EXECUTION → OUTCOME</footer>
  </div><style>{`
    *{box-sizing:border-box}.page{min-height:100vh;background:#02070c;color:#edf7fa;font-family:Inter,Arial,sans-serif;overflow:hidden}.glow{position:fixed;width:700px;height:700px;border-radius:50%;right:-280px;top:-260px;background:radial-gradient(circle,rgba(50,211,255,.15),transparent 65%);pointer-events:none}.shell{width:min(1240px,calc(100% - 36px));margin:auto;position:relative}nav{height:78px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.09);gap:16px}nav a{color:#8ee9ff;text-decoration:none;font-size:11px;font-weight:900}nav span{color:#708994;font-size:9px;font-weight:900;letter-spacing:.15em}header{padding:92px 0 80px}.eyebrow{color:#70dcff;font-size:10px;font-weight:950;letter-spacing:.2em}h1{font-size:clamp(54px,8.7vw,112px);line-height:.86;letter-spacing:-.065em;margin:20px 0 34px;max-width:1200px}h1 em,h2 em{font-style:normal;color:#72f1b8}.lead{font-size:clamp(18px,2vw,24px);line-height:1.65;color:#a9bec8;max-width:980px}.lead b{color:#fff}.doctrine{margin-top:38px;display:grid;grid-template-columns:repeat(4,1fr);border:1px solid rgba(114,241,184,.22)}.doctrine>*{padding:18px;border-right:1px solid rgba(114,241,184,.13);font-size:10px;letter-spacing:.08em;color:#9cb1bb}.doctrine strong{color:#72f1b8}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}.actions a{padding:12px 18px;border-radius:999px;background:#72f1b8;color:#02100a;text-decoration:none;font-size:10px;font-weight:950;letter-spacing:.08em}.actions .secondary{background:transparent;color:#9de8f7;border:1px solid rgba(112,220,255,.3)}section{padding:78px 0;border-top:1px solid rgba(255,255,255,.08)}section h2{font-size:clamp(40px,6vw,72px);line-height:1;letter-spacing:-.055em;margin:14px 0 24px;max-width:1050px}.question h2{font-size:clamp(38px,5.4vw,68px)}.question h2 u{text-decoration-color:#ffd36f;text-underline-offset:8px}.question>p:last-child,.boundary p,.limits p{color:#9db1bb;font-size:17px;line-height:1.75;max-width:930px}.chainGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:34px}.chain article,.domains article{padding:24px;border:1px solid rgba(112,220,255,.14);background:linear-gradient(145deg,rgba(7,30,43,.75),rgba(2,8,13,.94));border-radius:16px}.chain article span{color:#ffd36f;font:22px Georgia}.chain h3{font-size:20px;margin:15px 0 8px}.chain article p,.domains article p{color:#8fa5af;font-size:13px;line-height:1.6}.boundary{display:grid;grid-template-columns:1.1fr .9fr;gap:50px;align-items:center}.neq{border:1px solid rgba(255,255,255,.09);border-radius:20px;padding:12px;background:rgba(4,15,23,.8)}.neq div{display:grid;grid-template-columns:1fr 36px 1fr;align-items:center;padding:17px;border-bottom:1px solid rgba(255,255,255,.07);font-size:11px}.neq span{text-align:center;color:#ff8b95;font-size:20px}.neq b:last-child{text-align:right}.exam{scroll-margin-top:20px}.scenario{padding:20px;border-left:3px solid #70dcff;background:rgba(112,220,255,.06);color:#aec3cc;line-height:1.6}.gates{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:24px 0}.gate{padding:20px;border:1px solid rgba(255,255,255,.1);border-radius:15px;background:#06111a}.gate>b{display:block;font-size:10px;color:#dcebf0;letter-spacing:.08em;margin-bottom:14px}.gate div{display:flex;gap:7px;flex-wrap:wrap}.gate button{cursor:pointer;border:1px solid rgba(112,220,255,.18);background:#020a10;color:#748d98;border-radius:999px;padding:9px 11px;font-size:9px;font-weight:900}.gate button.active{border-color:#72f1b8;color:#eafff5;background:rgba(114,241,184,.09)}.result{border:1px solid;border-radius:20px;padding:28px;background:#030b11}.result small{display:block;color:#78909a;font-size:9px;letter-spacing:.16em;font-weight:950}.result strong{display:block;font-size:clamp(55px,8vw,100px);letter-spacing:-.06em;line-height:1;margin:8px 0}.result p{max-width:900px;color:#afc2ca;line-height:1.7}.note{color:#667d88;font-size:11px;line-height:1.6}.wearable h2 em{color:#ffd36f}.flow{display:flex;align-items:stretch;gap:8px;margin-top:35px}.flow article{flex:1;padding:20px;border:1px solid rgba(255,255,255,.1);border-radius:14px}.flow article.stop{border-color:rgba(255,211,111,.45);background:rgba(255,211,111,.05)}.flow i{align-self:center;color:#70dcff;font-style:normal}.flow b{font-size:10px;color:#dff9ff}.flow p{font-size:11px;color:#839aa5;line-height:1.55}.sectionLead{max-width:980px;color:#9db1bb;font-size:17px;line-height:1.75}.layerGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:32px}.layerGrid article{padding:25px;border:1px solid rgba(112,220,255,.14);border-radius:16px;background:rgba(4,16,24,.82)}.layerGrid span{display:block;color:#ffd36f;font:20px Georgia;margin-bottom:12px}.layerGrid b{font-size:11px;letter-spacing:.08em;color:#e8fbff}.layerGrid p{color:#8fa5af;font-size:13px;line-height:1.65}.nowFlow{display:flex;gap:8px;align-items:stretch;margin:34px 0}.nowFlow article{flex:1;padding:22px;border:1px solid rgba(114,241,184,.17);border-radius:15px}.nowFlow article.change{border-color:rgba(255,211,111,.45);background:rgba(255,211,111,.05)}.nowFlow i{align-self:center;color:#70dcff;font-style:normal}.nowFlow b{font-size:10px;color:#72f1b8}.nowFlow p{color:#899fa9;font-size:12px;line-height:1.6}.nowRule{display:block;color:#ffd36f;font-size:clamp(20px,3vw,34px);margin-top:30px}.failureGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:32px}.failureGrid article{padding:26px;border:1px solid rgba(255,123,135,.17);border-radius:16px;background:rgba(255,123,135,.025)}.failureGrid article>b{color:#ff9ca5;font-size:11px;letter-spacing:.08em}.failureGrid p{color:#9cafb8;line-height:1.6}.failureGrid small{display:block;color:#70dcff;font-size:8px;letter-spacing:.14em;margin:18px 0 7px}.failureGrid strong{display:block;color:#dbe9ee;font-size:12px;line-height:1.55}.receipt{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:start}.receipt>div>p:last-child,.case>p:last-child{color:#9db1bb;font-size:16px;line-height:1.75}.receiptGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.receiptGrid span{padding:15px;border:1px solid rgba(112,220,255,.13);border-radius:12px;color:#a9bec8;font-size:11px}.receiptGrid b{color:#ffd36f;margin-right:9px}.domains>div{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:30px}.caseFlow{display:flex;align-items:center;gap:8px;margin:30px 0;flex-wrap:wrap}.caseFlow b{padding:12px 14px;border:1px solid rgba(114,241,184,.2);border-radius:999px;font-size:9px;color:#cffff0}.caseFlow i{color:#70dcff;font-style:normal}.domains article b{color:#72f1b8;font-size:10px;letter-spacing:.08em}.limits{padding:60px;border:1px solid rgba(255,123,135,.18);border-radius:24px;background:rgba(255,123,135,.025);margin:60px 0}.limits h2{font-size:clamp(34px,5vw,58px)}.close{text-align:center;padding:110px 0}.close h2{margin:15px auto 35px}.close div{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.close div b{padding:10px 13px;border:1px solid rgba(114,241,184,.2);border-radius:999px;font-size:9px;color:#a9c9bc}.close>strong{display:block;margin-top:40px;color:#72f1b8;font-size:clamp(17px,2.3vw,28px)}footer{padding:45px 0 70px;border-top:1px solid rgba(255,255,255,.07);color:#617984;font-size:9px;line-height:1.8}@media(max-width:820px){nav{height:auto;padding:20px 0;flex-wrap:wrap}.doctrine,.chainGrid,.gates,.domains>div,.boundary,.layerGrid,.failureGrid,.receipt,.receiptGrid{grid-template-columns:1fr}.flow,.nowFlow{flex-direction:column}.nowFlow i{transform:rotate(90deg);text-align:center}.flow i{text-align:center;transform:rotate(90deg)}.limits{padding:30px}.doctrine>*{border-right:0;border-bottom:1px solid rgba(114,241,184,.13)}}`}</style></main>
}