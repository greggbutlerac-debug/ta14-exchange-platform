"use client";

import { useState } from "react";

/**
 * DRAFT COMPONENT ONLY. Do not expose via an app route until server-side
 * invitation authorization protects HTML, image assets, and the PDF.
 * Static /public files are not private, even when the page is hidden.
 */
const lessons: [string,string,string,string,string][] = [["01","The Shared Challenge","From measurable standards to governed consequences","ta14-david-kieft-01-shared-challenge.png","What would make a monitored environmental condition sufficiently evidenced and locally authorized to support an engineering action?"],["02","Environmental Observation","Preserve what the instruments actually observed","ta14-david-kieft-02-environmental-observation.png","Capture the original reading, instrument, time, location, calibration context and uncertainty. Observation is not inference."],["03","Evidence Integrity and Continuity","Can the record withstand examination?","ta14-david-kieft-03-evidence-integrity-continuity.png","Examine provenance, gaps, calibration, continuity, relevance and integrity without replacing the raw record."],["04","Measurable Standards and Computation","Standards and models inform, but do not authorize","ta14-david-kieft-04-measurable-standards-computation.png","Determine which requirements actually apply. Examine computational inputs, assumptions, and limitations before treating an output as a proposed action."],["05","The Authority Boundary","Evidence, authority and standing must be established NOW","ta14-david-kieft-05-authority-boundary.png","A technically plausible recommendation cannot cross into execution without current applicable authority, established standing and bounded scope."],["06","Engineering Intervention","Execution remains local and bounded","ta14-david-kieft-06-engineering-intervention.png","Qualified personnel act only within established permissions and safety constraints. Preserve who acted, when, why and within which scope."],["07","Verified Outcomes and Revalidation","New reality requires new examination","ta14-david-kieft-07-verified-outcomes-revalidation.png","Record the actual outcome, distinguish observed changes from inferred benefits, and revalidate when conditions or authority change."],["08","The Opportunity to Collaborate","An invitation to compare complementary approaches","ta14-david-kieft-08-opportunity-to-collaborate.png","A bounded, mutually defined technical examination could explore interoperability without presuming a partnership, endorsement, or deficiency."]];

export default function DavidKieftShowroom() {
  const [index,setIndex]=useState(0);
  const [answer,setAnswer]=useState<string | null>(null);
  const [spanish,setSpanish]=useState(false);
  const lesson=lessons[index];
  const scenarios=[
    {name:"Evidence and authorization are current",correct:"ALLOW",why:"A bounded action may proceed only when all required checks are established."},
    {name:"Sensor provenance cannot be established",correct:"HOLD",why:"Insufficient admissible evidence means execution cannot proceed."},
    {name:"The proposed change exceeds the approved scope",correct:"DENY",why:"A proposed action outside established permission must not execute."},
    {name:"Approval belongs to another accountable authority",correct:"ESCALATE",why:"Refer the decision to the properly designated authority."}
  ];
  const [scenario,setScenario]=useState(0);
  const current=scenarios[scenario];
  return <main style={{minHeight:"100vh",background:"#081523",color:"#f2f8fc",fontFamily:"Inter,system-ui,sans-serif",padding:"clamp(20px,4vw,54px)"}}>
    <div style={{maxWidth:1180,margin:"auto"}}>
      <header style={{borderBottom:"1px solid #365268",paddingBottom:22,display:"flex",justifyContent:"space-between",gap:20,flexWrap:"wrap"}}>
        <div><strong style={{letterSpacing:".15em"}}>TA14 AUTHORITY GOVERNANCE INSTITUTION</strong><p style={{color:"#a9c4d4"}}>Private technical exploration prepared for David Kieft · Raven Delta Group</p></div>
        <span style={{color:"#a9c4d4"}}>DRAFT · NOT FOR DISTRIBUTION</span>
      </header>
      <h1 style={{fontSize:"clamp(2rem,5vw,4rem)",lineHeight:1.1,marginBottom:12}}>From Measurable Standards to Governed Consequences</h1>
      <p style={{color:"#b9d3df",maxWidth:800,lineHeight:1.7}}>A collaborative exploration of environmental observation, admissible evidence, local execution authority and verified engineering outcomes. Independent illustrative scenarios; no Raven Delta or third-party endorsement implied.</p>
      <nav aria-label="Eight lessons" style={{display:"flex",flexWrap:"wrap",gap:8,margin:"28px 0"}}>
        {lessons.map((item,i)=><button key={item[0]} onClick={()=>setIndex(i)} aria-current={i===index?"step":undefined} style={{cursor:"pointer",padding:"10px 13px",borderRadius:10,border:"1px solid #49738b",background:i===index?"#0d7e99":"#112a3a",color:"white"}}>{item[0]}</button>)}
      </nav>
      <section aria-live="polite" style={{display:"grid",gridTemplateColumns:"minmax(0,1fr)",gap:18}}>
        <div><p style={{color:"#6ee5e3",fontWeight:700}}>{lesson[0]} / 08</p><h2 style={{fontSize:"clamp(1.6rem,3vw,2.5rem)",margin:"8px 0"}}>{lesson[1]}</h2><h3 style={{fontWeight:500,color:"#9ed5e1"}}>{lesson[2]}</h3><p style={{lineHeight:1.8,maxWidth:900}}>{lesson[4]}</p></div>
        <div style={{aspectRatio:"16 / 9",background:"#123044",border:"1px solid #37657c",borderRadius:16,overflow:"hidden",display:"grid",placeItems:"center"}}>
          {/* Asset is deliberately unresolved until verified and served from a protected endpoint. */}
          <div style={{textAlign:"center",padding:25}}><strong>IMAGE {lesson[0]}</strong><p>{lesson[3]}</p><small>Protected asset pending verification</small></div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}>
          <button disabled={index===0} onClick={()=>setIndex(v=>Math.max(0,v-1))}>← Previous</button>
          <button disabled={index===7} onClick={()=>setIndex(v=>Math.min(7,v+1))}>Next lesson →</button>
        </div>
      </section>
      <section style={{marginTop:42,padding:24,border:"1px solid #38617b",borderRadius:16}}>
        <h2>Explore the authority decision</h2>
        <p>Illustrative decision exercise, not a live governance determination.</p>
        <label htmlFor="scenario">Select a scenario</label>{" "}
        <select id="scenario" value={scenario} onChange={e=>{setScenario(Number(e.target.value));setAnswer(null);}}>{scenarios.map((s,i)=><option key={i} value={i}>{s.name}</option>)}</select>
        <p>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{["ALLOW","HOLD","DENY","ESCALATE"].map(x=><button key={x} onClick={()=>setAnswer(x)} style={{padding:"12px 20px",borderRadius:8}}>{x}</button>)}</div>
        {answer&&<p role="status"><strong>{answer===current.correct?"Supported illustrative disposition":"Consider the missing boundary"}: {current.correct}.</strong> {current.why}</p>}
      </section>
      <footer style={{padding:"40px 0",color:"#a9c4d4"}}>PDF companion: protected download to be enabled after secure guest invitation and asset verification. No live Raven Delta data or operational integration is represented.</footer>
    </div>
  </main>;
}
