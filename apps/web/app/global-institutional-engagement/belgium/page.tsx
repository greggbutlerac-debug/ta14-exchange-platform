import Link from 'next/link';
import GuidedShowroom from '../../components/GuidedShowroom';

const chain=['REALITY','MEASUREMENT','CONTEXT','RISK ANALYSIS','ACTION PLAN','AUTHORITY','ACTION','OUTCOME'];

const timeline=[
  ['15 Sep 2026','TA-14 → FPS Public Health','Bounded technical question submitted: when does indoor-air-quality data become a sufficiently governed, current and auditable evidentiary record to support consequential action?'],
  ['29 Sep 2026','Belgian national helpdesk → TA-14','Ticket 105350 answered. The helpdesk described Belgium’s approach as combining air-quality measurements, operator risk analysis and, where applicable, an action plan.'],
  ['29 Sep 2026','BOUNDARY PRESERVED','The helpdesk expressly stated that its response is not an official legal interpretation and that only European courts can provide legally binding interpretations.'],
  ['NEXT','TA-14 → Belgium','Return the preserved showroom for factual correction and invite a bounded technical examination of the remaining evidence-to-consequence boundary.']
];

export const metadata={
  title:'Belgium · Indoor Air Evidence to Consequence | TA-14',
  description:'Public technical showroom preserving Belgium national helpdesk ticket 105350 and examining the bounded path from indoor-air measurement, context and risk analysis to consequential action.'
};

export default function Page(){
return <main className="p"><div className="s">
<nav><Link className="brand" href="/"><b>TA-14</b> AUTHORITY</Link><Link href="/global-institutional-engagement">GLOBAL INSTITUTIONAL ENGAGEMENT</Link><Link href="/global-institutional-engagement/showrooms">COUNTRY SHOWROOMS</Link></nav>

<header>
<div className="bilateral"><div className="nation"><span>🇧🇪</span><b>KINGDOM OF BELGIUM</b><small>FPS PUBLIC HEALTH · INDOOR AIR QUALITY</small></div><i>×</i><div className="nation right"><span>🇺🇸</span><b>TA-14 AUTHORITY</b><small>UNITED STATES · INDEPENDENT GOVERNANCE INSTITUTION</small></div></div>
<p className="eye">BELGIUM × TA-14 · PUBLIC TECHNICAL SHOWROOM · TICKET 105350 · 29 SEPTEMBER 2026</p>
<h1>A measurement can be correct.<br/><em>That does not make it sufficient by itself.</em></h1>
<p className="lead">Belgium’s national helpdesk answered a narrow TA-14 question about the transition from indoor-air evidence to consequential action. Its response did not establish a TA-14 proposition as Belgian law. It did establish something useful for examination: Belgium’s described approach does not rest a particular action on one isolated measurement alone.</p>
<div className="status"><b>SUBSTANTIVE HELPDESK RESPONSE RECEIVED</b><b>TICKET 105350 PRESERVED</b><b>NO ENDORSEMENT OR LEGAL APPROVAL CLAIMED</b></div>
<div className="boundary"><b>LEGAL / INSTITUTIONAL BOUNDARY</b><p>The source response expressly states that it is not an official statement of legal interpretation. This showroom therefore records a national-helpdesk answer and TA-14’s technical analysis of that answer. It does not claim endorsement, adoption, certification, partnership, regulatory approval or a legally binding Belgian interpretation.</p></div>
</header>

<div className="chain">{chain.map(x=><span key={x}>{x}</span>)}</div>

<section>
<p className="eye">01 · WHAT BELGIUM ACTUALLY SAID</p><h2>The answer is contextual, not single-signal.</h2>
<div className="cards">
<article><small>MEASUREMENT</small><b>AIR-QUALITY DATA MATTERS</b><p>The helpdesk described air-quality measurements as one element in the Belgian indoor-air approach.</p></article>
<article><small>CONTEXT</small><b>AN ISOLATED OBSERVATION IS NOT THE WHOLE DECISION</b><p>The response says collected information should be interpreted in context, including characteristics of the place, potential pollution sources and ventilation conditions.</p></article>
<article><small>RISK</small><b>OPERATOR RISK ANALYSIS MATTERS</b><p>The operator’s risk analysis is part of the described framework for evaluating the overall situation.</p></article>
<article><small>ACTION</small><b>ACTION PLANS MAY FOLLOW</b><p>Where applicable, the framework includes an action plan rather than treating the measurement itself as a self-executing command.</p></article>
</div>
<div className="finding"><small>THE PRESERVED FINDING</small><b>At this stage, the helpdesk says the regulation does not establish one criterion by which a measurement datum, by itself, becomes sufficient proof for a particular action.</b></div>
</section>

<GuidedShowroom eyebrow="BELGIUM · EVIDENCE-TO-ACTION PATH" title="Do not skip from measurement directly to consequence." intro="Walk the sequence using only the distinctions supported by the September 29 helpdesk response, then expose the remaining TA-14 question at the consequence boundary." accent="#f3d44a" gold="#f3d44a" steps={[
{label:'01 · MEASURE',title:'Observe indoor-air conditions',plain:'A CO₂ meter or other indoor-air measurement contributes evidence about the condition of the place.'},
{label:'02 · INTERPRET',title:'Put the measurement in context',plain:'Consider the characteristics of the location, potential pollution sources, ventilation conditions and the meaning of the observed data.'},
{label:'03 · ANALYZE RISK',title:'Evaluate the overall situation',plain:'The operator’s risk analysis is part of the described Belgian approach; the decision is not reduced to one isolated observation.'},
{label:'04 · PLAN',title:'Establish an action plan where applicable',plain:'The framework can move from measurement and risk analysis toward planned improvement actions.'},
{label:'05 · ASK THE REMAINING QUESTION',title:'What makes this exact consequence authorized now?',plain:'TA-14 asks a separate execution-boundary question: what evidence, applicable authority and present standing bind the assembled record to the exact proposed consequence?',result:'ALLOW · HOLD · DENY · ESCALATE'},
{label:'06 · PRESERVE OUTCOME',title:'Record what actually happened',plain:'Any action and resulting condition become part of the next evidentiary baseline.'}
]}/>

<section className="band"><div className="in">
<p className="eye">02 · THE IMPORTANT SEPARATION</p><h2>Belgium answered one question. It exposed the next one.</h2>
<div className="flow"><div><b>MEASUREMENT</b><p>What was observed?</p></div><span>→</span><div><b>CONTEXT + RISK</b><p>What does the evidence mean here?</p></div><span>→</span><div><b>ACTION PLAN</b><p>What response is contemplated?</p></div><span>→</span><div className="gate"><b>CONSEQUENCE BOUNDARY</b><p>What establishes that this exact action may occur now?</p></div></div>
</div></section>

<section>
<p className="eye">03 · THE TA-14 QUESTION NOW</p><h2>The measurement question is no longer the whole question.</h2>
<div className="hard"><p>Assume the measurement is attributable. Assume the place has been evaluated in context. Assume the operator has completed the relevant risk analysis. Assume an action plan exists.</p><b>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</b><p>That question is TA-14’s examination boundary. It is not presented here as a statement of Belgian law.</p></div>
</section>

<section>
<p className="eye">04 · A BOUNDED EXAMINATION</p><h2>One room. One record. One proposed consequence.</h2>
<div className="exam">
<article><span>01</span><b>FREEZE THE EVIDENCE</b><p>Select one bounded indoor-air condition and preserve the measurements, timing and provenance.</p></article>
<article><span>02</span><b>PRESERVE CONTEXT</b><p>Record the location characteristics, ventilation conditions, relevant pollution sources and risk-analysis context.</p></article>
<article><span>03</span><b>NAME THE ACTION</b><p>State exactly what is proposed: ventilation adjustment, occupancy response, communication, maintenance intervention or another defined consequence.</p></article>
<article><span>04</span><b>ESTABLISH AUTHORITY</b><p>Identify the applicable basis, responsible actor, scope and current standing for that exact action.</p></article>
<article><span>05</span><b>CHANGE ONE MATERIAL CONDITION</b><p>Change time, occupancy, ventilation state, evidence freshness, responsible actor or proposed action and test whether the earlier basis still supports consequence.</p></article>
<article><span>06</span><b>PRESERVE THE RESULT</b><p>Return ALLOW, HOLD, DENY or ESCALATE with the reason visible and preserve what actually happened.</p></article>
</div>
</section>

<section>
<p className="eye">05 · WHAT THIS SHOWROOM DOES NOT CLAIM</p><h2>The boundary is part of the record.</h2>
<div className="not"><p>It does <b>not</b> claim that Belgium has adopted TA-14.</p><p>It does <b>not</b> claim that the helpdesk endorsed TA-14.</p><p>It does <b>not</b> turn the helpdesk response into a binding legal interpretation.</p><p>It does <b>not</b> replace Belgian legislation, competent authorities, public-health expertise, risk analysis or operator responsibility.</p><p>It does preserve the helpdesk’s substantive answer as received and makes the next technical question inspectable.</p></div>
</section>

<section className="timeline"><p className="eye">INSTITUTIONAL CONTINUITY RECORD</p><h2>What happened, what was established, and what comes next.</h2>{timeline.map(([d,p,e])=><article key={d+p}><span>{d}</span><b>{p}</b><p>{e}</p></article>)}</section>

<section className="return"><p className="eye">RETURN-TO-INSTITUTION PROTOCOL</p><h2>Belgium gets the record back.</h2><p>TA-14’s next contact should provide this showroom to the helpdesk, thank them for the substantive clarification, invite correction of any inaccurate representation, and ask whether the remaining evidence-to-consequence boundary is suitable for a bounded technical conversation with the appropriate Belgian institution.</p></section>

<footer>TA-14 AUTHORITY · GLOBAL INSTITUTIONAL ENGAGEMENT<br/>BELGIUM · PUBLIC TECHNICAL SHOWROOM · TICKET 105350 · SEPTEMBER 2026</footer>
</div>
<style>{`
*{box-sizing:border-box}.p{min-height:100vh;background:radial-gradient(circle at 12% 0%,rgba(0,0,0,.7),transparent 30%),radial-gradient(circle at 88% 0%,rgba(230,45,45,.14),transparent 28%),linear-gradient(180deg,#080706,#13100b 52%,#050505);color:#f7f3e8;font-family:Arial,sans-serif}.s,.in{max-width:1220px;margin:auto;padding:0 28px}nav{height:76px;display:flex;align-items:center;gap:24px;border-bottom:1px solid #393126}nav a{color:#c9bea9;text-decoration:none;font-size:9px;font-weight:900;letter-spacing:.08em}.brand{margin-right:auto;font-size:15px!important}.brand b,.eye{color:#f3d44a}header{padding:54px 0}.bilateral{display:grid;grid-template-columns:1fr auto 1fr;gap:24px;align-items:center;padding:22px 0;margin-bottom:48px;border-block:1px solid #443b2c}.bilateral i{font:32px Georgia,serif;color:#f3d44a}.nation{display:grid;grid-template-columns:auto 1fr;gap:6px 15px;align-items:center}.nation span{grid-row:1/3;font-size:54px}.nation b{font-size:14px}.nation small{color:#a99f8d;font-size:8px}.nation.right{text-align:right;grid-template-columns:1fr auto}.nation.right span{grid-column:2;grid-row:1/3}.nation.right b,.nation.right small{grid-column:1}.eye{font-size:10px;font-weight:950;letter-spacing:2px}h1{font:clamp(48px,7vw,82px)/.98 Georgia,serif;letter-spacing:-3px;max-width:1080px}h1 em{font-style:normal;color:#f3d44a}.lead,.return>p{max-width:980px;color:#c3b9a7;font-size:18px;line-height:1.72}.status{display:flex;gap:8px;flex-wrap:wrap;margin-top:28px}.status b{padding:10px 12px;border:1px solid #665b40;color:#f3d44a;font-size:8px}.boundary{margin-top:18px;padding:22px;border:1px solid #6a5b35;background:#17140e}.boundary b{color:#f3d44a;font-size:9px}.boundary p{color:#c0b6a5;line-height:1.65}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;padding:18px 0 55px}.chain span{text-align:center;padding:12px 4px;border:1px solid #554a32;color:#f3d44a;font-size:8px;font-weight:900}section{padding:64px 0;border-top:1px solid #342e24}h2{font:clamp(34px,5vw,58px)/1.05 Georgia,serif;max-width:1000px}.cards,.exam{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:28px}.cards article,.exam article{padding:24px;border:1px solid #51462f;background:#15120d}.cards small{display:block;color:#f3d44a;font-size:8px;font-weight:950;margin-bottom:10px}.cards b,.exam b{font-size:10px}.cards p,.exam p{color:#b9af9e;line-height:1.65}.finding{margin-top:16px;padding:28px;border-left:4px solid #f3d44a;background:#18150e}.finding small{display:block;color:#f3d44a;font-size:8px;font-weight:950;margin-bottom:10px}.finding b{font:22px/1.5 Georgia,serif}.band{margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);background:#15120d}.flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;gap:10px;align-items:center;margin-top:28px}.flow div{padding:22px;border:1px solid #51462f}.flow span{font-size:26px;color:#f3d44a}.flow b{color:#f3d44a}.flow p{color:#b8ae9d}.gate{border:2px solid #f3d44a!important}.hard{padding:30px;margin-top:28px;border-left:4px solid #f3d44a;background:#17140e}.hard p{color:#c1b7a5;line-height:1.7}.hard b{display:block;font:25px/1.5 Georgia,serif;margin:16px 0}.exam{grid-template-columns:repeat(3,1fr)}.exam span{display:block;color:#f3d44a;font:28px Georgia,serif;margin-bottom:10px}.not{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.not p{margin:0;padding:20px;border:1px solid #4b422f;color:#bfb5a3}.timeline article{display:grid;grid-template-columns:130px 230px 1fr;gap:18px;padding:16px;border-bottom:1px solid #3b3428}.timeline article span{color:#f3d44a;font-size:10px;font-weight:900}.timeline article b{font-size:10px}.timeline article p{margin:0;color:#b6ad9d;font-size:11px;line-height:1.55}.return{background:linear-gradient(90deg,rgba(243,212,74,.06),transparent);padding-inline:26px}footer{padding:45px 0 70px;color:#827967;font-size:9px;line-height:1.8}@media(max-width:900px){.cards{grid-template-columns:1fr 1fr}.exam{grid-template-columns:1fr 1fr}.flow{grid-template-columns:1fr}.flow span{transform:rotate(90deg);justify-self:center}.chain{grid-template-columns:repeat(2,1fr)}.bilateral{grid-template-columns:1fr}.bilateral i{justify-self:center}.nation.right{text-align:left;grid-template-columns:auto 1fr}.nation.right span{grid-column:1}.nation.right b,.nation.right small{grid-column:2}}@media(max-width:650px){.cards,.exam,.not{grid-template-columns:1fr}.s,.in{padding:0 18px}.timeline article{grid-template-columns:1fr;gap:6px}h1{letter-spacing:-1px}}
`}</style></main>
}