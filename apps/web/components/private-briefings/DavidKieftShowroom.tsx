"use client";

import { useState } from "react";

/**
 * UNLISTED, SHAREABLE SHOWROOM. Anyone possessing the URL may access it.
 * The public image/PDF assets are not confidential.
 */
const lessons: [string,string,string,string,string][] = [["01","The Shared Challenge","From measurable standards to governed consequences","Governed Consequences Technical Showroom.png","What would make a monitored environmental condition sufficiently evidenced and locally authorized to support an engineering action?"],["02","Environmental Observation","Preserve what the instruments actually observed","Environmental Observation Dashboard.png","Capture the original reading, instrument, time, location, calibration context and uncertainty. Observation is not inference."],["03","Evidence Integrity and Continuity","Can the record withstand examination?","Evidence Integrity Dashboard.png","Examine provenance, gaps, calibration, continuity, relevance and integrity without replacing the raw record."],["04","Measurable Standards and Computation","Standards and models inform, but do not authorize","Measurable Standards and Computation.png","Determine which requirements actually apply. Examine computational inputs, assumptions, and limitations before treating an output as a proposed action."],["05","The Authority Boundary","Evidence, authority and standing must be established NOW","Authority Boundary Control Room.png","A technically plausible recommendation cannot cross into execution without current applicable authority, established standing and bounded scope."],["06","Engineering Intervention","Execution remains local and bounded","TA14 Engineering Intervention Blueprint.png","Qualified personnel act only within established permissions and safety constraints. Preserve who acted, when, why and within which scope."],["07","Verified Outcomes and Revalidation","New reality requires new examination","Verified Outcomes and Revalidation Dashboard.png","Record the actual outcome, distinguish observed changes from inferred benefits, and revalidate when conditions or authority change."],["08","The Opportunity to Collaborate","An invitation to compare complementary approaches","TA14 Collaboration Roadmap_ Measurable Impact.png","A bounded, mutually defined technical examination could explore interoperability without presuming a partnership, endorsement, or deficiency."]];

export default function DavidKieftShowroom() {
  const [answer,setAnswer]=useState<string | null>(null);
  const scenarios=[
    {name:"Evidence and authorization are current",correct:"ALLOW",why:"A bounded action may proceed only when all required checks are established."},
    {name:"Sensor provenance cannot be established",correct:"HOLD",why:"Insufficient admissible evidence means execution cannot proceed."},
    {name:"The proposed change exceeds the approved scope",correct:"DENY",why:"A proposed action outside established permission must not execute."},
    {name:"Approval belongs to another accountable authority",correct:"ESCALATE",why:"Refer the decision to the properly designated authority."}
  ];
  const [scenario,setScenario]=useState(0);
  const current=scenarios[scenario];
  return <main id="top" style={{minHeight:"100vh",background:"#081523",color:"#f2f8fc",fontFamily:"Inter,system-ui,sans-serif",padding:"clamp(20px,4vw,54px)"}}>
    <div style={{maxWidth:1180,margin:"auto"}}>
      <header style={{borderBottom:"1px solid #365268",paddingBottom:22,display:"flex",justifyContent:"space-between",gap:20,flexWrap:"wrap"}}>
        <div><strong style={{letterSpacing:".15em"}}>TA14 AUTHORITY GOVERNANCE INSTITUTION</strong><p style={{color:"#a9c4d4"}}>Private technical exploration prepared for David Kieft · Raven Delta Group</p></div>
        <span style={{color:"#a9c4d4"}}>UNLISTED · SHAREABLE BY LINK</span>
      </header>
      <h1 style={{fontSize:"clamp(2rem,5vw,4rem)",lineHeight:1.1,marginBottom:12}}>From Measurable Standards to Governed Consequences</h1>
      <p style={{color:"#b9d3df",maxWidth:800,lineHeight:1.7}}>A collaborative exploration of environmental observation, admissible evidence, local execution authority and verified engineering outcomes. Independent illustrative scenarios; no Raven Delta or third-party endorsement implied.</p>
      <nav aria-label="Jump to a section" style={{display:"flex",flexWrap:"wrap",gap:10,margin:"28px 0 42px"}}>
        {lessons.map((item)=><a key={item[0]} href={"#section-"+item[0]} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"11px 14px",borderRadius:10,border:"1px solid #49738b",background:"#112a3a",color:"white",textDecoration:"none",fontWeight:700}}><span style={{color:"#6ee5e3"}}>{item[0]}</span><span style={{fontWeight:400,fontSize:13}}>{item[1]}</span></a>)}
        <a href="#authority-exercise" style={{padding:"11px 14px",borderRadius:10,border:"1px solid #49738b",color:"white",textDecoration:"none"}}>Authority exercise ↓</a>
      </nav>
      {lessons.map((lesson)=><section id={"section-"+lesson[0]} key={lesson[0]} aria-labelledby={"heading-"+lesson[0]} style={{display:"grid",gridTemplateColumns:"minmax(0,1fr)",gap:18,padding:"30px 0 46px",borderTop:"1px solid #365268",scrollMarginTop:24}}>
        <div>
          <p style={{color:"#6ee5e3",fontWeight:700}}>{lesson[0]} / 08</p>
          <h2 id={"heading-"+lesson[0]} style={{fontSize:"clamp(1.6rem,3vw,2.5rem)",margin:"8px 0"}}>{lesson[1]}</h2>
          <h3 style={{fontWeight:500,color:"#9ed5e1"}}>{lesson[2]}</h3>
          <p style={{lineHeight:1.8,maxWidth:900}}>{lesson[4]}</p>
        </div>
        <div style={{aspectRatio:"16 / 9",background:"#123044",border:"1px solid #37657c",borderRadius:16,overflow:"hidden",display:"grid",placeItems:"center"}}>
          <img loading={lesson[0]==="01"?"eager":"lazy"} src={"/"+encodeURIComponent(lesson[3])} alt={lesson[1]+": "+lesson[2]} style={{width:"100%",height:"100%",objectFit:"contain"}} />
        </div>
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <a href="#top" style={{color:"#6ee5e3"}}>↑ Back to sections</a>
        </div>
      </section>)}
      <section id="authority-exercise" style={{marginTop:42,padding:24,border:"1px solid #38617b",borderRadius:16,scrollMarginTop:24}}>
        <h2>Explore the authority decision</h2>
        <p>Illustrative decision exercise, not a live governance determination.</p>
        <label htmlFor="scenario">Select a scenario</label>{" "}
        <select id="scenario" value={scenario} onChange={e=>{setScenario(Number(e.target.value));setAnswer(null);}}>{scenarios.map((s,i)=><option key={i} value={i}>{s.name}</option>)}</select>
        <p>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{["ALLOW","HOLD","DENY","ESCALATE"].map(x=><button key={x} onClick={()=>setAnswer(x)} style={{padding:"12px 20px",borderRadius:8}}>{x}</button>)}</div>
        {answer&&<p role="status"><strong>{answer===current.correct?"Supported illustrative disposition":"Consider the missing boundary"}: {current.correct}.</strong> {current.why}</p>}
      </section>
      <footer style={{padding:"40px 0",color:"#a9c4d4"}}><a href={"/"+encodeURIComponent("TA14_David_Kieft_Private_Technical_Exploration_v2.pdf")} target="_blank" rel="noopener noreferrer" style={{color:"#6ee5e3"}}>↓ Download technical reference v2.0 (PDF)</a> · Unlisted shareable link; no third-party endorsement. No live Raven Delta data or operational integration is represented.</footer>
    </div>
  </main>;
}
