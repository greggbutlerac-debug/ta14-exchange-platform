'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const exhibits = [
 ['01','Exterior baseline, interior outcome','EclimAi_ Exterior Baseline, Interior Outcome-1.png','Compare independent outdoor environmental conditions with indoor measurements, aligned by time and qualified by calibration, uncertainty and source.'],
 ['02','Mechanical effort meets human context','HVAC Effort Meets Human Context-2.png','Relate measured HVAC electrical and thermal performance to EclimAi occupancy estimates. Occupancy is not a substitute for measured environmental conditions.'],
 ['03','Proposed integration blueprint','EclimAi × TA-14_ Proposed Integration Blueprint-3.png','Separate occupancy intelligence, attributable AIR records, optimization proposals, execution authorization and post-action verification. No live interface has been validated.'],
 ['04','Synchronized environmental record','Synchronized Building Environmental Dashboard-4.png','Align exterior, interior, occupancy and equipment evidence while preserving original timestamps, quality flags and missing-data limitations.'],
 ['05','HVAC thermal performance','EclimAi HVAC Thermal Performance Dashboard-5.png','Distinguish measured electrical input from independently established thermal delivery. The illustration does not validate its pictured engineering calculations.'],
 ['06','Atmospheric Integrity Record','Air Record_ HVAC Evidence Dashboard-6.png','Preserve attributable observations, derived values, revisions and continuity gaps. Illustrated record IDs and verification indicators are fictional.'],
 ['07','Independent execution governance','EclimAi × TA-14 Governance Dashboard.png','AEA examines Admissible Evidence, Applicable Authority and Established Standing at the execution boundary. Stale mandatory evidence means HOLD in the teaching scenario.'],
 ['08','Verify the consequence','eclimai-ta14-08-verify.png','Separate the proposed action, authorized decision, actual equipment response and observed environmental outcomes. Energy and occupant-hour calculations require a defensible method.']
] as const;

const transitions = [["The outdoor baseline and indoor outcome are separate observations. Both need source identity, aligned timestamps, calibration and uncertainty before a comparison is defensible.","Next, add the energy and thermal effort of HVAC equipment and the human context of occupancy."],["Electrical input, delivered conditioning and occupancy answer different questions. A credible efficiency claim needs a defined method and defensible attribution.","Next, see how optimization proposals and independent evidence could connect without conflating their responsibilities."],["A proposed architecture is not a deployed integration. Prediction proposes; evidence qualifies; authority is checked separately before any physical command.","Next, inspect the time-aligned environmental record that would support such a decision."],["A synchronized dashboard can reveal relationships, but must preserve gaps, provenance and uncertainty. Visualization alone does not repair missing evidence.","Next, distinguish electricity consumed from the cooling or heating actually delivered."],["Electrical kW and thermal output are different quantities. Any claimed performance ratio depends on validated measurements and explicit assumptions.","Next, see how an Atmospheric Integrity Record could preserve observations and revisions."],["An AIR should separate source measurements, derived values, forecasts and control events. Pictured verification badges are illustrative, not audited proof.","Next, apply admissible evidence, applicable authority and established standing to a hypothetical HVAC command."],["Forecast confidence does not grant execution permission. In the stale-sensor example the proposed result is HOLD, with no discretionary actuation.","Next, examine what post-action verification would require in a separately authorized case; the next illustration is not the result of this HOLD."],["An ALLOW record is not proof of equipment response or environmental improvement. Actual verification needs observations and a declared comparison method.","Next, try the read-only governance challenge, comparing a missing-evidence HOLD with a separate hypothetical ALLOW."]] as const;

export default function EclimaiPilotShowroom(){
 const [playing,setPlaying]=useState<string|null>(null);
 const [complete,setComplete]=useState(false);
 useEffect(()=>()=>{if(typeof window!=='undefined')window.speechSynthesis?.cancel()},[]);
 function narrate(id:string,title:string,description:string){
  if(typeof window==='undefined'||!('speechSynthesis' in window))return;
  window.speechSynthesis.cancel();
  if(playing===id){setPlaying(null);return;}
  const lesson=transitions[Number(id)-1];
  const specificCorrection=id==='05'?'The depicted performance calculations have not been validated.':id==='07'?'Any approval wording shown inside this illustration is incorrect. EclimAi has not approved this pilot or presentation.':id==='08'?'This is a separate hypothetical scenario, not a continuation of the HOLD decision in exhibit seven. No depicted savings or occupant-hour figures are validated.':'';
  const u=new SpeechSynthesisUtterance('Exhibit '+id+'. '+title+'. '+description+' '+specificCorrection+' Here is what you just learned. '+lesson[0]+' Here is what you will learn next. '+lesson[1]+' All data and diagrams are illustrative. No deployed integration or validated result is claimed.');
  const voices=window.speechSynthesis.getVoices();
  u.voice=voices.find(v=>/Samantha/i.test(v.name))||voices.find(v=>v.lang.startsWith('en-US'))||null;
  u.rate=.87;u.onend=()=>setPlaying(null);u.onerror=()=>setPlaying(null);
  window.speechSynthesis.speak(u);setPlaying(id);
 }
 return <main className="eclPilot"><div className="eclShell">
  <nav className="eclNav"><Link href="/showrooms">← TA-14 Exchange</Link><span>UNAPPROVED TECHNICAL DISCUSSION DRAFT</span></nav>
  <header className="eclHero">
   <p className="eclEyebrow">ECLIMAI × TA-14 · PROPOSED PILOT EXAMINATION</p>
   <h1>From predictive intelligence<br/><em>to justified autonomy.</em></h1>
   <p className="eclLead">Eight visual exhibits tracing a hypothetical occupancy-aware HVAC proposal from independent environmental evidence to an execution decision and post-action verification.</p>
   <p className="eclWarning"><strong>Concept only.</strong> No approved joint pilot, deployed integration, real facility, live control, independent validation, measured occupant protection or partner endorsement is claimed. All pictured readings, costs and decisions are hypothetical.</p>
   <div className="eclLinks"><a href="#exhibits">Explore eight exhibits ↓</a><Link href="/showrooms/eclimai-ta14-pilot/review">Read revised technical review v2 ↗</Link></div>
   <p className="eclFine">Revised technical review v2 is available as an accessible web document; the PDF file has not yet been committed. This page is unlisted and marked noindex, but the repository and URL are public; it is not access-controlled.</p>
  </header>
  <section className="eclIntro"><p className="eclEyebrow">ONE BOUNDED QUESTION</p><h2>Can a proposed HVAC consequence be examined before and after execution?</h2><p>EclimAi provides privacy-conscious occupancy intelligence and an optimization proposal. Independently sourced AIR measurements establish outdoor conditions, room outcomes and equipment evidence. AEA then evaluates evidence, authority and standing at the intended execution boundary. A future pilot must independently establish whether the command was actually issued, equipment responded and the intended conditions were maintained.</p><div className="eclChain">Occupancy + AIR evidence <span>→</span> Optimization proposal <span>→</span> AEA decision <span>→</span> Authorized action <span>→</span> Outcome verification</div></section>
  <section id="exhibits" className="eclExhibits"><p className="eclEyebrow">EIGHT EXHIBITS · FREE SCROLL</p><h2>Follow the evidence.</h2>
   {exhibits.map(([id,title,image,description])=><article className="eclExhibit" key={id} id={'exhibit-'+id}>
    <div className="eclHeading"><span>{id}</span><h3>{title}</h3></div>
    {(id==='05'||id==='07'||id==='08')&&<aside className="eclPreImageNotice" role="note"><strong>Important illustration correction:</strong> {id==='05'?'The calculations and performance figures pictured below are illustrative, not validated measurements.':id==='07'?'The picture below may contain the word “approved.” That wording is incorrect: no pilot or partner endorsement has been approved.': 'This is a separate hypothetical verification scenario, not a continuation of the HOLD in Exhibit 07. Its numbers are not validated.'}</aside>}
    {(id==='05'||id==='07'||id==='08')?
    <figure className="eclSafeDiagram" aria-label={title+' — corrected conceptual schematic'}>
      <div className="eclDiagramTitle">{id==='05'?'THERMAL PERFORMANCE: REQUIRED EVIDENCE':id==='07'?'EXECUTION GOVERNANCE: UNAPPROVED CONCEPT':'POST-ACTION VERIFICATION: SEPARATE SCENARIO'}</div>
      <div className="eclDiagramFlow">{(id==='05'?['Measured electrical input','Independently measured thermal output','Documented calculation + uncertainty']:id==='07'?['Optimizer proposes','AEA checks evidence, authority, standing','Missing evidence → HOLD']:['Separately authorized command','Observed equipment response','Independent environmental outcome']).map((step,i)=><div className="eclDiagramNode" key={step}><span>{String(i+1).padStart(2,'0')}</span><strong>{step}</strong></div>)}</div>
      <figcaption>CONCEPTUAL SCHEMATIC · NO PILOT APPROVAL · NO VALIDATED RESULTS</figcaption>
    </figure>:
    <figure><img src={'/'+encodeURIComponent(image)} alt={title+' — hypothetical teaching illustration'} loading="lazy"/><figcaption>ILLUSTRATIVE / SYNTHETIC · NOT LIVE ECLIMAI OR TA-14 MEASUREMENT</figcaption></figure>}
    <p>{description}</p>
    {id==='05'&&<p className="eclCorrection"><strong>Engineering limitation:</strong> The numerical thermal-performance illustration is not a validated calculation. Do not interpret depicted kW, BTU/h, efficiency or savings as measured results.</p>}
    {id==='07'&&<p className="eclCorrection"><strong>Approval correction:</strong> Any wording embedded in the image suggesting an “approved” pilot is incorrect. No joint pilot, field authorization or EclimAi endorsement has been granted. This is a synthetic HOLD teaching case.</p>}
    {id==='08'&&<p className="eclCorrection"><strong>Scenario separation:</strong> This image illustrates a different hypothetical post-authorization verification pathway. It does not follow from the HOLD in Exhibit 07. Pictured numerical outcomes, occupant-hour and savings values are unvalidated and must not be cited as results.</p>}
    <div className="eclNarration"><div><strong>SAMANTHA · EXHIBIT {id}</strong><small>Spoken guide · scrolling remains available</small></div><button type="button" onClick={()=>narrate(id,title,description)}>{playing===id?'■ Stop Samantha':'▶ Play Samantha'}</button></div>
    <div className="eclTransition" aria-label={'Learning transition after exhibit '+id}>
      <div><span className="eclEyebrow">HERE'S WHAT YOU JUST LEARNED</span><p>{transitions[Number(id)-1][0]}</p></div>
      <div><span className="eclEyebrow">HERE'S WHAT YOU'LL LEARN NEXT</span><p>{transitions[Number(id)-1][1]}</p></div>
    </div>
   </article>)}
  </section>
  <section className="eclTest"><p className="eclEyebrow">SYNTHETIC · READ-ONLY DECISION TEST</p><h2>Would the pre-cooling request proceed?</h2><p>A model proposes pre-cooling a meeting room. Choose the evidence fixture. This is a scripted teaching demonstration, not a running governor, authorization service or controller.</p><div className="eclOptions"><button className={!complete?'active':''} onClick={()=>setComplete(false)}>Stale sensor / missing calibration</button><button className={complete?'active':''} onClick={()=>setComplete(true)}>All required checks satisfied</button></div><div className="eclDecision"><strong>{complete?'ALLOW · SIMULATED':'HOLD · SIMULATED'}</strong><p>{complete?'The synthetic decision criteria are satisfied. This is not permission for a real building command.':'Mandatory evidence is stale or unqualified. The illustrative decision blocks discretionary actuation until new evidence is evaluated.'}</p></div></section>
  <section className="eclNext"><p className="eclEyebrow">PILOT PATH · SUBJECT TO SEPARATE APPROVAL</p><h2>Discovery. Shadow evaluation. Bounded field test.</h2><p>Before any real pilot: establish site and owner/operator permission; verify EclimAi interface and data handling; agree on sensor qualification, BACnet routing, fail-closed behavior and safety constraints; then reproduce a shadow decision record. Physical tests and any outcome claims require a separately authorized protocol and independent verification.</p><p>Supplier-reported case-study energy comparisons are not independent causal proof of this proposed integration. EclimAi has not approved this co-branded presentation.</p></section>
  <footer>TA-14 · Exploratory EclimAi technical discussion · November 2026 · Hypothetical only</footer>
 </div></main>;
}