"use client";
import { useEffect, useState } from "react";

const scenes = [
  { title:"The Connected City", narration:"Welcome. This is a hypothetical city, where intelligent systems coordinate electrical power, healthcare, transportation, and buildings. They can exchange commands and respond quickly. But technical connectivity does not establish authority to impose every consequence." },
  { title:"The Grid Detects a Threat", narration:"Regional demand is rising. A grid optimization system proposes reducing hospital electricity use by fifteen percent. The recommendation may help the grid. It may also affect cooling required for clinical operations. A useful objective is not yet an authorized instruction." },
  { title:"The Authority Conflict", narration:"Two obligations now intersect. The grid operator must manage electrical stability. The hospital must protect patient care. Before a command can proceed, we must know which actor has authority over the specific equipment, under which conditions, and on what evidence." },
  { title:"You Decide", narration:"Now you must choose. You can execute the recommendation, seek a supervisor's approval, hold the action, or escalate the conflict. Your choice will affect the simulated execution pathway. A command can be technically accepted and still lack admissible authority." },
  { title:"The Consequence Binds", narration:"Your selected pathway now has a modeled consequence. Distinguish the proposed action from the command actually dispatched, and distinguish execution from its resulting outcome. A successful command is not the same as a justified consequence." },
  { title:"Rewind the Decision", narration:"We return to the instant before execution. The initial grid problem has not disappeared. The question is whether the proposed consequence had sufficient admissible evidence, applicable authority, and established standing to become reality now." },
  { title:"The TA14 Examination", narration:"At the execution boundary, examine the actor, capacity, standing basis, authority relationship, evidence, scope, and time. If essential prerequisites are missing, the disposition is hold or escalate. A human signature or an AI recommendation alone is not enough." },
  { title:"Accountability and Reality", narration:"Compare what was proposed, what was permitted, what executed, and what occurred in each simulated branch. Governance cannot guarantee a safe outcome. It can make the authority examination explicit, enforceable at an integrated boundary, and auditable. No admissible evidence. No admissible execution." }
];
export default function SamanthaScenes({onDecisionScene}:{onDecisionScene?:()=>void}) {
  const [index,setIndex]=useState(0);
  const [speaking,setSpeaking]=useState(false);
  const [supported,setSupported]=useState(false);
  useEffect(()=>{setSupported(typeof window!=="undefined" && "speechSynthesis" in window);return ()=>{if(typeof window!=="undefined" && "speechSynthesis" in window)window.speechSynthesis.cancel();};},[]);
  function stop(){if(supported)window.speechSynthesis.cancel();setSpeaking(false);}
  function speak(){
    if(!supported)return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(scenes[index].narration);
    utterance.rate=0.92;
    utterance.onend=()=>setSpeaking(false);
    utterance.onerror=()=>setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }
  function navigate(next:number){stop();setIndex(next);if(next===3)onDecisionScene?.();}
  return <section aria-label="Samantha narrated eight-scene experience" style={{marginTop:32,padding:24,background:"#11283b",borderRadius:18}}>
    <p style={{color:"#9dd4ff",letterSpacing:2}}>SAMANTHA · NARRATED CONSEQUENCE EXPERIENCE</p>
    <p>Scene {index+1} of {scenes.length}</p>
    <div role="img" aria-label={scenes[index].title+" conceptual scene placeholder"} style={{minHeight:180,display:"grid",placeItems:"center",textAlign:"center",padding:24,background:"linear-gradient(135deg,#071624,#183d58)",border:"1px solid #54728a",borderRadius:12}}>
      <div><span style={{fontSize:42}}>◈</span><h2>{scenes[index].title}</h2><p style={{color:"#a7c6dd"}}>Cinematic scene artwork pending</p></div>
    </div>
    <p style={{lineHeight:1.7,fontSize:17}}>{scenes[index].narration}</p>
    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
      <button type="button" disabled={!supported} onClick={speaking?stop:speak} style={buttonStyle}>{speaking?"Stop Samantha":"Hear Samantha"}</button>
      <button type="button" disabled={index===0} onClick={()=>navigate(index-1)} style={buttonStyle}>Previous scene</button>
      <button type="button" disabled={index===scenes.length-1} onClick={()=>navigate(index+1)} style={buttonStyle}>Next scene</button>
    </div>
    {!supported&&<p>Speech playback is unavailable in this browser. The complete narration is displayed above.</p>}
    <p style={{fontSize:12,color:"#9fb4c7"}}>Uses the browser's available text-to-speech voice. A dedicated Samantha voice recording is not yet integrated. All outcomes are hypothetical.</p>
  </section>;
}
const buttonStyle:React.CSSProperties={padding:"12px 16px",background:"#285779",color:"#fff",border:"1px solid #7796ad",borderRadius:8,cursor:"pointer"};
