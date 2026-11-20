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

export default function EclimaiPilotShowroom(){
 const [playing,setPlaying]=useState<string|null>(null);
 const [complete,setComplete]=useState(false);
 useEffect(()=>()=>{if(typeof window!=='undefined')window.speechSynthesis?.cancel()},[]);
 function narrate(id:string,title:string,description:string){
  if(typeof window==='undefined'||!('speechSynthesis' in window))return;
  window.speechSynthesis.cancel();
  if(playing===id){setPlaying(null);return;}
  const u=new SpeechSynthesisUtterance('Exhibit '+id+'. '+title+'. '+description+' All data and diagrams are illustrative. No deployed integration or validated result is claimed.');
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
   <div className="eclLinks"><a href="#exhibits">Explore eight exhibits ↓</a><a href="/EclimAi_TA14_Private_Pilot_Concept_v1%20(1).pdf" target="_blank" rel="noopener noreferrer">Read earlier PDF v1 ↗</a></div>
   <p className="eclFine">Revised PDF v2 is not yet verified in the repository. This page is unlisted and marked noindex, but the repository and URL are public; it is not access-controlled.</p>
  </header>
  <section className="eclIntro"><p className="eclEyebrow">ONE BOUNDED QUESTION</p><h2>Can a proposed HVAC consequence be examined before and after execution?</h2><p>EclimAi provides privacy-conscious occupancy intelligence and an optimization proposal. Independently sourced AIR measurements establish outdoor conditions, room outcomes and equipment evidence. AEA then evaluates evidence, authority and standing at the intended execution boundary. A future pilot must independently establish whether the command was actually issued, equipment responded and the intended conditions were maintained.</p><div className="eclChain">Occupancy + AIR evidence <span>→</span> Optimization proposal <span>→</span> AEA decision <span>→</span> Authorized action <span>→</span> Outcome verification</div></section>
  <section id="exhibits" className="eclExhibits"><p className="eclEyebrow">EIGHT EXHIBITS · FREE SCROLL</p><h2>Follow the evidence.</h2>
   {exhibits.map(([id,title,image,description])=><article className="eclExhibit" key={id} id={'exhibit-'+id}>
    <div className="eclHeading"><span>{id}</span><h3>{title}</h3></div>
    <figure><img src={'/'+encodeURIComponent(image)} alt={title+' — hypothetical teaching illustration'} loading="lazy"/><figcaption>ILLUSTRATIVE / SYNTHETIC · NOT LIVE ECLIMAI OR TA-14 MEASUREMENT</figcaption></figure>
    <p>{description}</p>
    <div className="eclNarration"><div><strong>SAMANTHA · EXHIBIT {id}</strong><small>Spoken guide · scrolling remains available</small></div><button type="button" onClick={()=>narrate(id,title,description)}>{playing===id?'■ Stop Samantha':'▶ Play Samantha'}</button></div>
   </article>)}
  </section>
  <section className="eclTest"><p className="eclEyebrow">SYNTHETIC · READ-ONLY DECISION TEST</p><h2>Would the pre-cooling request proceed?</h2><p>A model proposes pre-cooling a meeting room. Choose the evidence fixture. This is a scripted teaching demonstration, not a running governor, authorization service or controller.</p><div className="eclOptions"><button className={!complete?'active':''} onClick={()=>setComplete(false)}>Stale sensor / missing calibration</button><button className={complete?'active':''} onClick={()=>setComplete(true)}>All required checks satisfied</button></div><div className="eclDecision"><strong>{complete?'ALLOW · SIMULATED':'HOLD · SIMULATED'}</strong><p>{complete?'The synthetic decision criteria are satisfied. This is not permission for a real building command.':'Mandatory evidence is stale or unqualified. The illustrative decision blocks discretionary actuation until new evidence is evaluated.'}</p></div></section>
  <section className="eclNext"><p className="eclEyebrow">PILOT PATH · SUBJECT TO SEPARATE APPROVAL</p><h2>Discovery. Shadow evaluation. Bounded field test.</h2><p>Before any real pilot: establish site and owner/operator permission; verify EclimAi interface and data handling; agree on sensor qualification, BACnet routing, fail-closed behavior and safety constraints; then reproduce a shadow decision record. Physical tests and any outcome claims require a separately authorized protocol and independent verification.</p><p>Supplier-reported case-study energy comparisons are not independent causal proof of this proposed integration. EclimAi has not approved this co-branded presentation.</p></section>
  <footer>TA-14 · Exploratory EclimAi technical discussion · November 2026 · Hypothetical only</footer>
 </div></main>;
}