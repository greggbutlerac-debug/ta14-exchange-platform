"use client";

import { useState } from "react";

const steps = [
  { name: "01 · Observe", title: "A classroom is tested", question: "What do we actually know?", detail: "A radon measurement records a concentration at a location over a defined period. It does not establish a child's lifetime exposure.", evidence: "Preserve the location, date, method, duration, result, and limitations." },
  { name: "02 · Examine", title: "A result requires interpretation", question: "What follows from the measurement?", detail: "Applicable testing guidance and follow-up requirements determine what additional testing or action may be appropriate. A single reading is not a complete building history.", evidence: "Preserve applicable criteria, responsible parties, and the basis for the next decision." },
  { name: "03 · Respond", title: "A plan becomes work", question: "Was the proposed response actually carried out?", detail: "A mitigation plan describes intended work. An installation or completion record documents what was performed. Neither alone proves radon levels improved.", evidence: "Preserve scope, work dates, accountable parties, and completion documentation." },
  { name: "04 · Verify", title: "The outcome must be measured", question: "Did the intervention achieve its purpose?", detail: "Appropriate post-mitigation testing helps establish whether radon concentrations were reduced under the measured conditions. Continued obligations may still apply.", evidence: "Preserve follow-up results, conditions, dates, and any remaining uncertainties." },
];

const stageImages = ["Radon Evidence Records Infographic.png","Radon Mitigation Decision Authority.png","Radon Mitigation Evidence Continuity.png","Radon Evidence Continuity Workflow.png"];

export default function MemorialExperience() {
  const [active, setActive] = useState(0);
  const item = steps[active];
  return (
    <section aria-labelledby="memorial-experience-title" style={{padding:"58px 0 64px",borderBottom:"1px solid #385365"}}>
      <p style={{color:"#e8c98d",letterSpacing:3,fontSize:12,fontWeight:700}}>A LIVING LESSON · INTERACTIVE EDUCATIONAL EXAMPLE</p>
      <h2 id="memorial-experience-title" style={{fontFamily:"Georgia,serif",fontSize:"clamp(34px,5vw,58px)",lineHeight:1.12,maxWidth:850,margin:"16px 0 20px"}}>A test is a moment.<br/><span style={{color:"#e8c98d"}}>Protection is a responsibility over time.</span></h2>
      <p style={{color:"#cbdbe2",fontSize:18,lineHeight:1.8,maxWidth:800}}>Gail's advocacy helped make school radon testing a public responsibility. Follow one illustrative classroom from measurement to verification. Select each stage to see what the record can—and cannot—establish.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10,margin:"32px 0 18px"}} role="group" aria-label="Choose a stage of the classroom evidence journey">
        {steps.map((step,i)=><button key={step.name} type="button" onClick={()=>setActive(i)} aria-pressed={active===i} style={{padding:"18px 14px",textAlign:"left",cursor:"pointer",background:active===i?"#d9bc85":"#102b39",color:active===i?"#081722":"#d4e4e9",border:active===i?"2px solid #f5dca9":"1px solid #466475",borderRadius:10,fontSize:15,fontWeight:700}}>{step.name}</button>)}
      </div>
      <div aria-live="polite" style={{background:"linear-gradient(135deg,#102f3e,#0b1e2c)",border:"1px solid #537080",borderRadius:16,padding:"clamp(22px,4vw,44px)",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:30}}>
        <div>
          <p style={{color:"#f0d29a",fontSize:13,fontWeight:700,letterSpacing:2}}>STAGE {String(active+1).padStart(2,"0")} OF 04</p>
          <h3 style={{fontFamily:"Georgia,serif",fontSize:"clamp(27px,3vw,40px)",lineHeight:1.2}}>{item.title}</h3>
          <p style={{fontFamily:"Georgia,serif",fontSize:22,color:"#e9d5af"}}>{item.question}</p>
          <p style={{lineHeight:1.85,fontSize:17,color:"#d0dfe5"}}>{item.detail}</p>
        </div>
        <aside style={{borderLeft:"3px solid #d9bc85",padding:"8px 0 8px 22px",alignSelf:"center"}}>
          <p style={{color:"#e8c98d",fontSize:12,fontWeight:700,letterSpacing:2}}>WHAT THE RECORD MUST CARRY</p>
          <p style={{fontSize:20,lineHeight:1.7,color:"#f3f5f2"}}>{item.evidence}</p>
          <p style={{fontSize:13,lineHeight:1.6,color:"#aebfca"}}>Illustrative educational sequence only. Not a real school case, legal determination, or deployed TA14 authorization.</p>
        </aside>
      </div>
      <figure style={{margin:"22px 0 10px"}}>
        <img key={active} src={"/"+encodeURIComponent(stageImages[active])} alt={"Illustrative radon evidence and governance diagram for "+item.name} loading="lazy" style={{width:"100%",height:"auto",display:"block",borderRadius:14,border:"1px solid #537080"}}/>
        <figcaption style={{fontSize:13,color:"#aebfca",marginTop:10}}>Educational reference illustration for {item.name}; this does not represent a real Gail Orcutt classroom, certified test, or deployed authorization.</figcaption>
      </figure>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,marginTop:18,flexWrap:"wrap"}}>
        <p style={{fontSize:13,color:"#b7cbd3"}}>Select any stage to revisit the evidence journey.</p>
        <button type="button" onClick={()=>setActive((active+1)%steps.length)} style={{padding:"13px 22px",background:"#bce9ed",border:0,borderRadius:8,color:"#06202b",fontWeight:800,cursor:"pointer"}}>{active===3?"Start again ↺":"Next stage →"}</button>
      </div>
    </section>
  );
}
