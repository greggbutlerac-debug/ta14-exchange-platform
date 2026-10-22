"use client";

import { useEffect, useState } from "react";
import { narration } from "./narration";

const assets = [
  "CO₂ Signal in Room 412.png",
  "Preserve the Record_ Healthcare Evidence Dashboard.png",
  "Healthcare HVAC Intervention Infographic.png",
  "Authority and Standing_ Healthcare HVAC Governance.png",
  "Risk Examination_ Healthcare HVAC Dashboard.png",
  "Hospital HVAC Governance Determination Dashboard.png",
  "TA14 HVAC Intervention Execution Dashboard.png",
  "Healthcare HVAC Outcome Verification Dashboard.png",
];
const lessons = [
  ["The signal", "A sustained CO₂ reading in Room 412 is an observation, not a diagnosis or an instruction. Establish the room, sensor, occupancy and clinical context before proposing any consequence."],
  ["Preserve the record", "Retain raw readings, timestamps, calibration status, provenance and continuity. Preserve adjusted dashboard data separately so another examiner can reconstruct the observation."],
  ["Propose the consequence", "A facilities engineer proposes a bounded AHU-3B ventilation adjustment. Equipment, duration, constraints, rollback criteria and intended result must be explicit. A recommendation is not authorization."],
  ["Authority and standing", "Applicable policy alone is insufficient. Establish actor, capacity, standing basis and authority relationship for this equipment and time. Infection prevention and clinical approvals may be required."],
  ["Risk examination", "Review pressure relationships, infection control, filtration, patient vulnerability, temperature, humidity and equipment capacity. Unresolved clinical risk supports HOLD, not an automatic intervention."],
  ["Governance determination", "Ask: Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW? Record a bounded ALLOW, HOLD, DENY or ESCALATE with reasons."],
  ["External execution", "Only after missing conditions are resolved and a fresh ALLOW is established may authorized site personnel consider the action under local safety controls. TA14 does not operate the building."],
  ["Verify the outcome", "Preserve post-action observations and equipment response. Compare against the authorized proposition while accounting for changing conditions. A command acknowledgment or a lower CO₂ reading alone does not prove causation."],
] as const;

export default function BlueIotHealthcarePage() {
  const [selected, setSelected] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => { return () => { if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); }; }, []);
  const stopNarration = () => { if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); setSpeaking(false); };
  const playNarration = () => { if (typeof window === "undefined" || !("speechSynthesis" in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(narration[selected]); utterance.rate = 0.92; utterance.onend = () => setSpeaking(false); utterance.onerror = () => setSpeaking(false); setSpeaking(true); window.speechSynthesis.speak(utterance); };
  const chooseLesson = (index: number) => { stopNarration(); setSelected(index); };
  const [evidence, setEvidence] = useState(false);
  const [clinical, setClinical] = useState(false);
  const [capacity, setCapacity] = useState(false);
  const [standing, setStanding] = useState(false);
  const [rollback, setRollback] = useState(false);
  const [examined, setExamined] = useState(false);
  const ready = evidence && clinical && capacity && standing && rollback;
  const result = !examined ? "PENDING" : ready ? "SIMULATED ALLOW" : "HOLD";
  const toggle = (setter: (v: boolean) => void, value: boolean) => { setter(!value); setExamined(false); };
  return <main style={{background:"#071a2b",color:"#f3f7fb",minHeight:"100vh",padding:"clamp(20px,4vw,64px)",fontFamily:"Arial,sans-serif"}}>
    <div style={{maxWidth:1180,margin:"auto"}}>
      <p style={{color:"#79c8fa",letterSpacing:2,fontSize:12}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT EDUCATIONAL DEMONSTRATION</p>
      <h1 style={{fontSize:"clamp(32px,5vw,60px)",lineHeight:1.1,marginBottom:12}}>Healthcare HVAC: Evidence to Action</h1>
      <p style={{fontSize:18,maxWidth:850,lineHeight:1.6}}>Blue IoT / Encompass Blue discussion surface. A hypothetical hospital examination demonstrating the boundary between environmental intelligence and authorized consequence.</p>
      <p style={{borderLeft:"4px solid #f4bd55",padding:"12px 18px",background:"#153047",lineHeight:1.5}}>Illustrative only. All sensor values, equipment states, approvals, clinical risks and outcomes shown in the artwork are synthetic. This is not a live integration, medical guidance, a verified hospital record, or an endorsement by Blue IoT.</p>
      <section aria-label="Eight healthcare lessons" style={{marginTop:32}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>{lessons.map((lesson,i)=><button key={i} onClick={()=>chooseLesson(i)} aria-pressed={selected===i} style={{padding:"12px 16px",background:selected===i?"#0b84d6":"#1a3449",color:"white",border:"1px solid #49708b",borderRadius:8,cursor:"pointer"}}>{String(i+1).padStart(2,"0")}</button>)}</div>
        <img src={"/"+encodeURIComponent(assets[selected])} alt={`Healthcare governance illustration ${selected+1}: ${lessons[selected][0]}`} style={{width:"100%",height:"auto",borderRadius:12}}/>
        <h2>{String(selected+1).padStart(2,"0")} · {lessons[selected][0]}</h2>
        <p style={{fontSize:18,lineHeight:1.7,maxWidth:950}}>{lessons[selected][1]}</p>
        <details style={{margin:"18px 0",lineHeight:1.75}}><summary style={{cursor:"pointer",fontWeight:700}}>Read Samantha\u0027s full narration</summary><p>{narration[selected]}</p></details>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}><button onClick={speaking ? stopNarration : playNarration}>{speaking ? "Stop Samantha narration" : "Play Samantha narration"}</button><button disabled={selected===0} onClick={()=>chooseLesson(selected-1)}>Previous</button><button disabled={selected===7} onClick={()=>chooseLesson(selected+1)}>Next lesson</button></div>
      </section>
      <section style={{marginTop:54,padding:24,background:"#102e45",borderRadius:14}}>
        <h2>Interactive examination · Room 412</h2>
        <p>Toggle illustrative evidence and approval conditions, then examine the proposed AHU-3B adjustment. This simulation changes display state only and never commands equipment.</p>
        {([
          ["Sensor provenance, calibration and continuity established",evidence,(v:boolean)=>toggle(setEvidence,v)],
          ["Infection prevention / clinical approval established",clinical,(v:boolean)=>toggle(setClinical,v)],
          ["Equipment, pressure and filtration constraints checked",capacity,(v:boolean)=>toggle(setCapacity,v)],
          ["Actor, capacity, standing basis and authority relationship established",standing,(v:boolean)=>toggle(setStanding,v)],
          ["Monitoring and rollback plan approved",rollback,(v:boolean)=>toggle(setRollback,v)],
        ] as const).map(([label,checked,onChange])=><label key={label} style={{display:"block",padding:"11px 0",lineHeight:1.5}}><input type="checkbox" checked={checked} onChange={()=>onChange(checked)} style={{marginRight:12}}/>{label}</label>)}
        <button onClick={()=>setExamined(true)} style={{marginTop:14,padding:"12px 20px",background:"#1486d4",color:"white",border:0,borderRadius:8,cursor:"pointer"}}>Examine proposed consequence</button>
        <p role="status" style={{fontSize:25,fontWeight:700}}>Determination: {result}</p>
        <p>{!examined?"No determination issued.":ready?"Illustrative conditions are marked established. A real-world ALLOW would still require validated evidence, applicable local authority, current conditions and site-specific clinical approval.":"At least one required condition is unresolved. Preserve the record; do not execute. Resolve gaps and re-examine."}</p>
      </section>
      <section style={{marginTop:38,paddingBottom:50}}>
        <h2>Technical examination</h2>
        <p><a href={"/"+encodeURIComponent("TA14_Blue_IoT_Healthcare_Examination_v1.pdf")} style={{color:"#8dd7ff"}}>Download healthcare technical PDF (v1)</a></p>
        <p><a href="/environmental-integrity-governance/showcase/blue-iot-evidence-to-action" style={{color:"#8dd7ff"}}>Explore the existing classroom CO₂ demonstration</a></p>
        <p style={{fontSize:13,color:"#b3c9d8"}}>No affiliation, adoption, certification, clinical validation, or production integration is claimed. Site operators retain physical execution authority.</p>
      </section>
    </div>
  </main>;
}
