'use client';

import Link from 'next/link';
import { useState } from 'react';

type State='baseline'|'changed'|'authority'|'source';
const states:Record<State,{label:string,evidence:string,authority:string,standing:string,result:'ALLOW'|'HOLD'|'DENY',reason:string}>={
baseline:{label:'Current evidence + competent authority remain aligned',evidence:'ESTABLISHED',authority:'ESTABLISHED',standing:'ESTABLISHED',result:'ALLOW',reason:'For this bounded demonstration, the evidence basis and competent authority remain current.'},
changed:{label:'Air-quality condition materially changes',evidence:'REVALIDATION REQUIRED',authority:'ESTABLISHED',standing:'NOT YET ESTABLISHED',result:'HOLD',reason:'The earlier evidence record may remain valid historically, but present sufficiency must be re-established before consequence.'},
authority:{label:'Authority or applicable authorization changes',evidence:'ESTABLISHED',authority:'RE-ESTABLISH',standing:'NOT ESTABLISHED',result:'HOLD',reason:'Evidence alone does not carry execution authority forward when the competent authority context changes.'},
source:{label:'Source / facility / regulated activity identity changes',evidence:'PARTIAL',authority:'RECONFIRM SCOPE',standing:'NOT ESTABLISHED',result:'HOLD',reason:'The proposed consequence must remain bound to the correct source, facility, activity and current regulatory context.'}
};

export default function GuyanaPage(){
 const [state,setState]=useState<State>('baseline'); const s=states[state];
 return <main className="p"><div className="shell">
  <nav><Link className="brand" href="/"><b>TA-14</b> AUTHORITY</Link><Link href="/global-institutional-engagement/showrooms">COUNTRY SHOWROOMS</Link><Link href="/global-institutional-engagement/control-board">CONTROL BOARD</Link></nav>

  <header>
   <div className="flags"><span>🇬🇾 <b>CO-OPERATIVE REPUBLIC OF GUYANA</b></span><span>×</span><span>🇺🇸 <b>TA-14 AUTHORITY</b></span></div>
   <p className="eye">PUBLIC TECHNICAL SHOWROOM · ENVIRONMENTAL PROTECTION AGENCY · AIR, NOISE & RADIATION</p>
   <h1>Guyana can measure the condition.<br/><em>What authorizes the consequence?</em></h1>
   <p className="lead">Guyana's Environmental Protection Agency already carries regulatory, permitting, compliance and air-quality responsibilities. TA-14 does not replace those functions. This showroom isolates a narrower seam: when air-quality evidence supports a proposed real-world action, what establishes that the evidence, authority and standing remain sufficient at the moment the action becomes real?</p>
   <div className="status"><b>INSTITUTIONAL ROUTING RECEIVED · 25 SEP 2026</b><b>FORMAL EXECUTIVE-DIRECTOR SUBMISSION NEXT</b><b>NOT ENDORSED BY EPA GUYANA</b><b>OPEN FOR CORRECTION</b></div>
  </header>

  <section>
   <p className="eye">PUBLIC RECORD · WHAT IS ALREADY ESTABLISHED</p>
   <h2>Guyana already has an air-quality authority framework.</h2>
   <div className="cards">
    <article><b>EPA AIR-QUALITY ROLE</b><p>EPA Guyana publicly describes air-quality and noise inspections, complaint investigations, compliance work and environmental authorisation activity.</p><a href="https://epaguyana.org/article/air-quality-and-noise-inspections/" target="_blank" rel="noreferrer">EPA PUBLIC RECORD →</a></article>
    <article><b>AIR-QUALITY AUTHORISATION</b><p>EPA guidance states that activities emitting air contaminants may require EPA authorisation and describes the Agency's role in monitoring, compliance assessment and management of air contaminants.</p><a href="https://epaguyana.org/download/08-05-air-quality-and-noise-management/" target="_blank" rel="noreferrer">EPA AIR-QUALITY GUIDANCE →</a></article>
    <article><b>EXECUTIVE AUTHORITY</b><p>Public EPA records identify Kemraj Parsram as Executive Director. TA-14's current institutional route is therefore being prepared for formal executive-level consideration.</p></article>
   </div>
   <div className="boundary"><b>PROCEDURAL RESPONSE ≠ TECHNICAL DETERMINATION</b><p>TA-14 has received institutional routing on how the formal request should be submitted. That establishes a procedural path only. It does not establish agreement with TA-14, a technical finding, a partnership, a pilot, or adoption of this architecture.</p></div>
  </section>

  <section>
   <p className="eye">THE BOUNDED QUESTION</p>
   <h2>From air-quality evidence to authorized environmental action.</h2>
   <div className="flow"><span>MEASUREMENT / INSPECTION<small>what is observed</small></span><i>→</i><span>EVIDENCE RECORD<small>what the record supports</small></span><i>→</i><span className="gate">PRESENT SUFFICIENCY<small>evidence · authority · standing</small></span><i>→</i><span>ENVIRONMENTAL CONSEQUENCE<small>what becomes real</small></span></div>
   <blockquote>Does this proposed consequence have sufficient <b>Admissible Evidence, Applicable Authority, and Established Standing</b> to become reality NOW?</blockquote>
   <p className="mantra">No admissible evidence. No admissible execution.</p>
  </section>

  <section>
   <p className="eye">INTERACTIVE GUYANA EXAMINATION</p>
   <h2>Keep the proposed action fixed. Change one material condition.</h2>
   <p className="copy">This is not a simulation of Guyana's law. It is a TA-14 examination object offered so EPA Guyana can identify where its own current regulatory, permitting, compliance or enforcement mechanisms already resolve the seam.</p>
   <div className="controls">{(Object.keys(states) as State[]).map(k=><button key={k} className={state===k?'active':''} onClick={()=>setState(k)}>{states[k].label}</button>)}</div>
   <div className="triplet"><div><small>ADMISSIBLE EVIDENCE</small><b>{s.evidence}</b></div><div><small>APPLICABLE AUTHORITY</small><b>{s.authority}</b></div><div><small>ESTABLISHED STANDING</small><b>{s.standing}</b></div></div>
   <div className={'result '+s.result.toLowerCase()}><small>TA-14 DETERMINATION</small><b>{s.result}</b><p>{s.reason}</p></div>
  </section>

  <section>
   <p className="eye">FORMAL REQUEST · PURPOSE</p>
   <h2>TA-14 is not asking Guyana to surrender its authority. We are asking Guyana to describe it precisely.</h2>
   <div className="qs">
    <p><b>01</b> What official evidence is used when EPA Guyana determines that an air-quality condition warrants a specific regulatory, compliance, advisory or enforcement consequence?</p>
    <p><b>02</b> What establishes that the evidence remains current and applicable when the consequence is actually authorized or carried out?</p>
    <p><b>03</b> Which office, officer, permit, regulation or other authority establishes that a specific consequence may occur?</p>
    <p><b>04</b> What happens when a material condition changes between the original evidence record and execution?</p>
    <p><b>05</b> Which Guyana use case would best test whether TA-14's proposed evidence-to-consequence boundary duplicates an existing EPA mechanism or identifies a distinct seam?</p>
   </div>
  </section>

  <section>
   <p className="eye">PROPOSED FIRST EXAMINATION</p>
   <h2>A bounded air-quality case, chosen by EPA Guyana.</h2>
   <p className="copy">Rather than invent a Guyana scenario, TA-14 proposes that EPA Guyana select one real or representative air-quality pathway—such as inspection, complaint, permit-compliance, exceedance or another pathway the Agency considers appropriate. EPA retains ownership of the native legal and technical context. TA-14 examines only the transition from evidence to proposed consequence.</p>
   <div className="chain">{['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'].map(x=><span key={x}>{x}</span>)}</div>
  </section>

  <section className="final">
   <p className="eye">CURRENT INSTITUTIONAL STATE</p>
   <h2>ROUTE ESTABLISHED.<br/><em>TECHNICAL DETERMINATION NOT YET ESTABLISHED.</em></h2>
   <p>The next admissible step is a formal submission to EPA Guyana's Executive Director, stating the specific information requested, the purpose of the request, and the relevant scope. This showroom is the public technical companion to that submission—not a representation that EPA Guyana has accepted the proposition.</p>
  </section>
  <footer>TA-14 AUTHORITY · GUYANA · PUBLIC TECHNICAL SHOWROOM · 2026</footer>
 </div><style jsx>{`
 .p{min-height:100vh;background:#03100d;color:#f1fff9;font-family:Arial,sans-serif}.shell{max-width:1180px;margin:auto;padding:0 22px}.p nav{height:70px;display:flex;align-items:center;gap:22px;border-bottom:1px solid #ffffff18;font-size:10px;font-weight:900;letter-spacing:.1em}.p nav a{color:#d5fff0;text-decoration:none}.brand{margin-right:auto}.flags{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;font-size:11px;color:#bee9d7}.p header,.p section{padding:72px 0;border-bottom:1px solid #ffffff14}.eye{font-size:9px;font-weight:950;letter-spacing:.17em;color:#63dfad}.p h1,.p h2{font-family:Georgia,serif;letter-spacing:-.04em}.p h1{font-size:clamp(46px,7vw,88px);line-height:.98;max-width:1080px}.p h1 em{font-style:normal;color:#ffd166}.p h2{font-size:clamp(32px,4.6vw,58px);line-height:1.02;max-width:1000px}.lead,.copy,.boundary p,.final p{font-size:16px;line-height:1.7;color:#a8c9bc;max-width:980px}.status,.controls{display:flex;gap:8px;flex-wrap:wrap;margin-top:26px}.status b{padding:9px 12px;border:1px solid #ffffff22;border-radius:99px;font-size:8px;color:#b9d8cc}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:24px}.cards article{padding:24px;border:1px solid #ffffff18;border-radius:13px;background:#071915}.cards b{font-size:11px;color:#8df0c8}.cards p{color:#9bb9ae;font-size:12px;line-height:1.65}.cards a{font-size:9px;color:#ffd166;text-decoration:none;font-weight:900}.boundary{margin-top:18px;padding:22px;border-left:3px solid #ffd166;background:#ffd1660a}.boundary b{color:#ffd166}.flow{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin:28px 0}.flow span{padding:17px;border:1px solid #ffffff1c;border-radius:10px;background:#071915;font-size:10px;font-weight:900}.flow small{display:block;margin-top:7px;color:#86a69a;font-weight:400}.flow .gate{border-color:#ffd16688;color:#ffd166}blockquote{margin:30px 0;padding:28px;border:1px solid #ffffff1a;border-radius:12px;background:#06130f;font-family:Georgia,serif;font-size:clamp(26px,3.5vw,46px);line-height:1.08}.mantra{font-weight:950;color:#ffd166}.controls button{padding:12px 14px;border:1px solid #67ddb044;border-radius:9px;background:#071915;color:#bce9d7;font-size:9px;font-weight:900;cursor:pointer}.controls .active{border-color:#ffd166;color:#ffd166;background:#211b08}.triplet{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}.triplet div{padding:18px;border:1px solid #ffffff17;border-radius:10px;background:#06120f}.triplet small,.result small{display:block;font-size:8px;color:#7ea295;font-weight:900}.triplet b{display:block;margin-top:8px;font-size:12px}.result{margin-top:12px;padding:25px;border:1px solid #ffffff22;border-radius:12px}.result b{display:block;font-size:42px;margin:8px 0}.result p{color:#acc8be;margin:0}.allow{border-color:#5ce2a26b}.hold{border-color:#ffd16677}.deny{border-color:#ff757577}.qs{display:grid;gap:9px;margin-top:24px}.qs p{margin:0;padding:18px;border:1px solid #ffffff17;border-radius:10px;background:#071915;color:#a3c1b6;line-height:1.6}.qs b{color:#63dfad;margin-right:10px}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:7px;margin-top:28px}.chain span{padding:12px 5px;text-align:center;border:1px solid #ffffff17;border-radius:8px;font-size:8px;font-weight:900;color:#9ed9c2}.final{border-bottom:0}.final em{font-style:normal;color:#ffd166}footer{padding:30px 0 70px;color:#668a7c;font-size:9px}@media(max-width:800px){.cards,.triplet,.chain{grid-template-columns:1fr}.p nav a:not(.brand){display:none}}
 `}</style></main>
}