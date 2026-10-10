"use client";

import { useState } from "react";

const lessons = [
  { number: "01", title: "The Shared Challenge", kicker: "From measurable standards to governed consequences", image: "Governed Consequences Technical Showroom.png", body: "What would make a monitored environmental condition sufficiently evidenced and locally authorized to support an engineering action?", takeaway: "Measuring a condition and proving permission to act are different engineering questions." },
  { number: "02", title: "Environmental Observation", kicker: "Preserve what the instruments actually observed", image: "Environmental Observation Dashboard.png", body: "Capture the original reading, instrument identity, time, location, calibration context and uncertainty. Separate raw observation from later interpretation.", takeaway: "Observed is not inferred. Inferred is not authorized." },
  { number: "03", title: "Evidence Integrity and Continuity", kicker: "Can the record withstand examination?", image: "Evidence Integrity Dashboard.png", body: "Examine provenance, gaps, calibration, continuity, relevance and integrity. Preserve the original record while making any adjustments and their uncertainty explicit.", takeaway: "A defensible record must survive the journey from sensor to decision." },
  { number: "04", title: "Measurable Standards and Computation", kicker: "Standards and models inform; they do not authorize", image: "Measurable Standards and Computation.png", body: "Establish which requirements actually apply. Examine inputs, assumptions, methods, model limitations and uncertainty before elevating a computed result into a proposed action.", takeaway: "A computational recommendation is a proposal, not permission.", note: "Illustrative image only. Any numerical limits or named standards shown in the artwork must be independently verified against the applicable standard before use in a compliance determination." },
  { number: "05", title: "The Authority Boundary", kicker: "Evidence, authority and standing must be established NOW", image: "Authority Boundary Control Room.png", body: "A technically plausible recommendation cannot cross into execution without current applicable authority, established standing and a clearly bounded scope.", takeaway: "Capability is not authority. Commissioned once does not mean authorized forever." },
  { number: "06", title: "Engineering Intervention", kicker: "Execution remains local and bounded", image: "TA14 Engineering Intervention Blueprint.png", body: "Qualified personnel act only within established permissions, safety constraints and operating conditions. Preserve who acted, when, why and within which authorized scope.", takeaway: "Authority context may travel; execution permission must be established locally." },
  { number: "07", title: "Verified Outcomes and Revalidation", kicker: "New reality requires new examination", image: "Verified Outcomes and Revalidation Dashboard.png", body: "Record the actual outcome, distinguish observed changes from inferred benefits and revalidate when conditions, assumptions or authority change.", takeaway: "An executed action is not a verified outcome." },
  { number: "08", title: "The Opportunity to Collaborate", kicker: "An invitation to compare complementary approaches", image: "TA14 Collaboration Roadmap_ Measurable Impact.png", body: "A small, mutually defined technical examination could explore how monitoring, evidence continuity, measurable standards and local execution authority fit together—without presuming a partnership, endorsement or operational integration.", takeaway: "Begin with a bounded technical question, not an assumed commitment.", note: "Collaboration concepts are exploratory. No partnership, pilot, approval or third-party endorsement is implied." },
] as const;

const scenarios = [
  { label: "Evidence and authorization are current", disposition: "ALLOW", explanation: "A bounded action may proceed only when admissible evidence, applicable authority, established standing and required safeguards are all demonstrated." },
  { label: "Sensor provenance cannot be established", disposition: "HOLD", explanation: "The evidence chain is incomplete. Preserve the proposal and resolve the missing provenance before execution." },
  { label: "The proposed change exceeds approved scope", disposition: "DENY", explanation: "The requested action exceeds the authority that was established. It cannot execute under the existing permission." },
  { label: "Approval belongs to another accountable authority", disposition: "ESCALATE", explanation: "The decision must go to the person or institution that actually holds the applicable authority." },
] as const;

const colors = { bg: "#071522", surface: "#10283a", line: "#2b5268", ink: "#f4f9fd", muted: "#b6cfdd", accent: "#72e2e5" };
const sectionLink = (n: string) => "#section-" + n;
const asset = (filename: string) => "/" + encodeURIComponent(filename);

export default function DavidKieftShowroom() {
  const [scenario, setScenario] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const selected = scenarios[scenario];
  return (
    <main id="top" style={{ minHeight: "100vh", background: colors.bg, color: colors.ink, fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .dk-shell { max-width: 1120px; margin: 0 auto; padding: 28px clamp(18px,4vw,56px) 70px; }
        .dk-nav { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 10px; margin: 30px 0 40px; }
        .dk-nav a { display:flex; align-items:center; gap:12px; min-height:58px; border:1px solid #2b5268; border-radius:12px; padding:12px 14px; color:#f4f9fd; text-decoration:none; background:#10283a; transition:background .15s,border-color .15s; }
        .dk-nav a:hover,.dk-nav a:focus-visible { background:#19435a; border-color:#72e2e5; }
        .dk-section { scroll-margin-top: 24px; padding: 48px 0; border-top:1px solid #2b5268; }
        .dk-figure { margin: 24px 0; background:#0e2637; border:1px solid #2b5268; border-radius:16px; overflow:hidden; }
        .dk-figure img { display:block; width:100%; height:auto; aspect-ratio:16/9; object-fit:contain; }
        .dk-button { display:inline-flex; justify-content:center; align-items:center; gap:8px; border:1px solid #72e2e5; border-radius:10px; padding:12px 18px; background:#72e2e5; color:#062030; font-weight:800; text-decoration:none; cursor:pointer; }
        .dk-button:focus-visible,.dk-back:focus-visible { outline:3px solid white; outline-offset:3px; }
        .dk-choice { padding:12px 18px; background:#10283a; border:1px solid #5a8294; color:white; border-radius:10px; cursor:pointer; font-weight:700; }
        .dk-choice:hover,.dk-choice:focus-visible { border-color:#72e2e5; background:#19435a; }
        .dk-back { color:#72e2e5; text-decoration:underline; text-underline-offset:3px; }
        @media (prefers-reduced-motion:reduce) { html { scroll-behavior:auto; } }
      `}</style>
      <div className="dk-shell">
        <header style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,borderBottom:"1px solid "+colors.line,paddingBottom:20}}>
          <div><strong style={{letterSpacing:".11em",fontSize:13}}>TA14 AUTHORITY GOVERNANCE INSTITUTION</strong><p style={{color:colors.muted,marginBottom:0}}>Independent technical exploration prepared for David Kieft · Raven Delta Group</p></div>
          <span style={{border:"1px solid "+colors.line,borderRadius:100,padding:"8px 13px",fontSize:12,color:colors.accent}}>UNLISTED · SHAREABLE BY LINK</span>
        </header>
        <div style={{padding:"42px 0 12px"}}>
          <p style={{color:colors.accent,fontSize:12,letterSpacing:".15em",fontWeight:800}}>EIGHT-PART TECHNICAL EXPLORATION</p>
          <h1 style={{fontSize:"clamp(2.2rem,5vw,4.4rem)",lineHeight:1.08,maxWidth:960,margin:"12px 0 24px"}}>From Measurable Standards to <span style={{color:colors.accent}}>Governed Consequences</span></h1>
          <p style={{color:colors.muted,fontSize:"clamp(1rem,2vw,1.2rem)",lineHeight:1.8,maxWidth:850}}>Environmental observation becomes useful evidence only when provenance and continuity survive examination. Even then, a recommendation needs current authority before an engineering consequence becomes real.</p>
          <p style={{color:colors.muted,fontSize:13,maxWidth:850,lineHeight:1.7}}>Independent TA14 illustrative demonstration. Not commissioned, approved or endorsed by Raven Delta Group or any other third party. No actual site data, live integration or verified project outcomes are represented.</p>
          <a className="dk-button" href={asset("TA14_David_Kieft_Private_Technical_Exploration_v2.pdf")} target="_blank" rel="noopener noreferrer">↓ Download technical reference v2.0 (PDF)</a>
        </div>
        <nav aria-label="Jump to one of eight sections">
          <p style={{fontSize:13,color:colors.muted,letterSpacing:".08em",fontWeight:700}}>SELECT A SECTION — OR SCROLL THROUGH ALL EIGHT</p>
          <div className="dk-nav">{lessons.map(lesson=><a href={sectionLink(lesson.number)} key={lesson.number}><strong style={{fontSize:22,color:colors.accent}}>{lesson.number}</strong><span style={{fontSize:14,lineHeight:1.35}}>{lesson.title}</span></a>)}</div>
        </nav>
        {lessons.map(lesson=><section className="dk-section" id={"section-"+lesson.number} key={lesson.number} aria-labelledby={"heading-"+lesson.number}>
          <p style={{color:colors.accent,fontWeight:800,letterSpacing:".12em",fontSize:13}}>{lesson.number} / 08</p>
          <h2 id={"heading-"+lesson.number} style={{fontSize:"clamp(1.8rem,3.5vw,2.8rem)",lineHeight:1.2,margin:"10px 0"}}>{lesson.title}</h2>
          <h3 style={{fontSize:"clamp(1.1rem,2vw,1.4rem)",fontWeight:500,color:colors.accent,margin:"10px 0 20px"}}>{lesson.kicker}</h3>
          <p style={{maxWidth:880,color:colors.muted,lineHeight:1.8,fontSize:17}}>{lesson.body}</p>
          <figure className="dk-figure"><img src={asset(lesson.image)} alt={lesson.title+" — illustrative technical diagram"} loading={lesson.number==="01"?"eager":"lazy"}/><figcaption style={{padding:"12px 16px",fontSize:12,color:colors.muted}}>Illustrative educational visualization · {lesson.number} of 08</figcaption></figure>
          <div style={{padding:"16px 20px",borderLeft:"3px solid "+colors.accent,background:colors.surface,borderRadius:8}}><strong style={{color:colors.accent}}>THE GOVERNANCE BOUNDARY</strong><p style={{margin:"8px 0 0",lineHeight:1.7}}>{lesson.takeaway}</p></div>
          {"note" in lesson && <p style={{fontSize:13,color:colors.muted,lineHeight:1.7}}>{lesson.note}</p>}
          <p style={{textAlign:"right",marginTop:22}}><a className="dk-back" href="#top">↑ Back to sections</a></p>
        </section>)}
        <section id="authority-exercise" style={{scrollMarginTop:24,padding:"40px 24px",border:"1px solid "+colors.line,borderRadius:18,background:colors.surface}}>
          <p style={{fontSize:13,color:colors.accent,letterSpacing:".1em",fontWeight:800}}>INTERACTIVE TECHNICAL EXERCISE</p>
          <h2 style={{fontSize:"clamp(1.6rem,3vw,2.5rem)"}}>Where does the proposed consequence stop?</h2>
          <p style={{color:colors.muted,lineHeight:1.7}}>Illustrative decision exercise, not a live governance determination. Select a condition and choose a disposition.</p>
          <label htmlFor="dk-scenario" style={{display:"block",fontWeight:700,margin:"22px 0 8px"}}>Select a scenario</label>
          <select id="dk-scenario" value={scenario} onChange={e=>{setScenario(Number(e.target.value));setAnswer(null);}} style={{width:"100%",maxWidth:650,padding:"14px",borderRadius:10,background:"#f7fbff",color:"#082034",fontSize:16}}>{scenarios.map((s,i)=><option key={s.label} value={i}>{s.label}</option>)}</select>
          <p style={{fontSize:"clamp(1.05rem,2vw,1.25rem)",fontWeight:650,lineHeight:1.65,margin:"24px 0"}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>{["ALLOW","HOLD","DENY","ESCALATE"].map(choice=><button className="dk-choice" type="button" key={choice} aria-pressed={answer===choice} onClick={()=>setAnswer(choice)}>{choice}</button>)}</div>
          {answer && <div role="status" style={{marginTop:24,padding:20,border:"1px solid "+colors.line,borderRadius:10,background:"#071522"}}><strong style={{color:colors.accent}}>{answer===selected.disposition?"SUPPORTED ILLUSTRATIVE DISPOSITION":"REEXAMINE THE BOUNDARY"} · {selected.disposition}</strong><p style={{lineHeight:1.7,marginBottom:0}}>{selected.explanation}</p></div>}
        </section>
        <section style={{padding:"50px 0",textAlign:"center"}}>
          <h2 style={{fontSize:"clamp(1.6rem,3vw,2.4rem)"}}>A practical place to begin</h2>
          <p style={{color:colors.muted,lineHeight:1.8,maxWidth:760,margin:"12px auto 24px"}}>Compare one real-world engineering decision against its observation record, governing requirements, proposed action and locally established authority. Any examination would require mutually agreed scope and permission.</p>
          <a className="dk-button" href={asset("TA14_David_Kieft_Private_Technical_Exploration_v2.pdf")} target="_blank" rel="noopener noreferrer">↓ Read the technical reference (PDF)</a>
        </section>
        <footer style={{borderTop:"1px solid "+colors.line,paddingTop:24,display:"flex",flexWrap:"wrap",gap:20,justifyContent:"space-between",fontSize:13,color:colors.muted}}>
          <span>© TA14 Authority Governance Institution · Independent illustrative exploration</span>
          <a className="dk-back" href="#top">↑ Return to top</a>
        </footer>
      </div>
    </main>
  );
}
