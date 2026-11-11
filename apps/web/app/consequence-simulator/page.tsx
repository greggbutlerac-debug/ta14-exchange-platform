"use client";
import { useEffect, useState } from "react";

type Choice = "execute" | "approve" | "hold" | "escalate";
type Phase = "intro" | "decision" | "consequence" | "rewind" | "exam" | "comparison";
const images = {
  city:"/The%20City%20That%20Runs%20Itself.png",
  proposal:"/AI%20Grid%20Decision_%20Demand%20Spike.png",
  warning:"/Hospital%20Cooling%20Failure%20Alert.png",
  crisis:"/Hospital%20HVAC%20Crisis%20Dashboard.png",
  hold:"/TA14%20Blocks%20Hospital%20Cooling%20Command.png",
  cascade:"/Cascading%20Hospital%20Crisis_%20Operations%20Impacted.png",
  regional:"/Beyond%20One%20Building.png",
  comparison:"/TA14_%20From%20Crisis%20to%20Accountability.png"
};
const choices:Record<Choice,{label:string;consequence:string;governed:string;disposition:string;image:string}> = {
 execute:{label:"Execute the AI recommendation",consequence:"The hypothetical load-reduction command executes without a verified authority boundary. Hospital cooling is curtailed; temperature and clinical risks increase.",governed:"The proposed command is held because the evidence, authority and standing for curtailing protected hospital cooling have not been established.",disposition:"HOLD",image:images.crisis},
 approve:{label:"Obtain supervisor approval",consequence:"A supervisor approves, but the supervisor's authority over protected hospital loads is not established. In this modeled branch, the command proceeds and cooling is disrupted.",governed:"A signature alone does not establish standing. The conflicting obligations are escalated for an accountable determination.",disposition:"ESCALATE",image:images.warning},
 hold:{label:"Hold the action",consequence:"The proposed curtailment does not execute. Hospital cooling remains operational in this scenario, but the grid demand emergency remains unresolved.",governed:"The HOLD is recorded with missing evidence and a defined path to examine authorized alternatives. Grid risk remains.",disposition:"HOLD",image:images.hold},
 escalate:{label:"Escalate to responsible authorities",consequence:"The proposed command is not dispatched while operators consult. The grid problem remains; the authority trail is incomplete.",governed:"ESCALATE records the authority conflict and routes it to designated decision-makers. Any revised command requires a new examination.",disposition:"ESCALATE",image:images.hold}
};
const narratives:Record<Phase,string> = {
 intro:"Welcome to a city that runs on connected intelligence. Its systems can coordinate power, buildings and critical services in seconds. But the ability to send a command is not the authority to impose its consequence.",
 decision:"A grid optimization system proposes a fifteen percent reduction in hospital electrical demand. That may relieve the grid, but it could compromise protected cooling. You are at the execution boundary. What do you authorize?",
 consequence:"The decision has consequences. This branch is hypothetical, not an observed incident. Look carefully at the difference between a proposed command, a dispatched command, and an outcome.",
 rewind:"Rewind to the instant before execution. The grid emergency has not disappeared. The question is not whether the AI can issue the command. It is whether this consequence is authorized now.",
 exam:"Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW? Missing prerequisites require HOLD or ESCALATE, not invented authority.",
 comparison:"You have seen two possible decision pathways. The TA14 examination can document and enforce a boundary when properly integrated. It does not guarantee a safe outcome, supply missing authority, or eliminate the original grid emergency."
};
const sequence:Phase[]=["intro","decision","consequence","rewind","exam","comparison"];
const imageFor=(phase:Phase,choice:Choice,governed:boolean)=>phase==="intro"?images.city:phase==="decision"?images.proposal:phase==="consequence"?choices[choice].image:phase==="rewind"?images.regional:phase==="exam"?images.hold:images.comparison;
export default function ConsequenceSimulator(){
 const [phase,setPhase]=useState<Phase>("intro");
 const [choice,setChoice]=useState<Choice|null>(null);
 const [governed,setGoverned]=useState(false);
 const [speaking,setSpeaking]=useState(false);
 const [audioAvailable,setAudioAvailable]=useState(false);
 const [record,setRecord]=useState<Array<{choice:Choice;path:"without"|"with";outcome:string;disposition:string}>>([]);
 const current=choice?choices[choice]:null;
 useEffect(()=>{setAudioAvailable(typeof window!=="undefined"&&"speechSynthesis" in window);return()=>{if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();};},[]);
 const stop=()=>{if(audioAvailable)window.speechSynthesis.cancel();setSpeaking(false);};
 const narration=phase==="consequence"&&current?current.consequence:phase==="exam"&&current?current.governed:narratives[phase];
 function hear(){if(!audioAvailable)return;if(speaking){stop();return;}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(narration);u.rate=.91;u.onend=()=>setSpeaking(false);u.onerror=()=>setSpeaking(false);window.speechSynthesis.speak(u);setSpeaking(true);}
 function go(next:Phase){stop();setPhase(next);window.scrollTo({top:0,behavior:"smooth"});}
 function choose(c:Choice){setChoice(c);setGoverned(false);go("consequence");}
 function recordPath(){if(!current||!choice)return;setRecord(prev=>[...prev,{choice,path:governed?"with":"without",outcome:governed?current.governed:current.consequence,disposition:governed?current.disposition:"NOT EXAMINED"}]);}
 function restart(){stop();setChoice(null);setGoverned(false);setRecord([]);go("intro");}
 const step=sequence.indexOf(phase)+1;
 return <main style={{minHeight:"100vh",background:"radial-gradient(ellipse at top,#18334b 0%,#06111e 62%)",color:"#f0f6ff",fontFamily:"system-ui,Arial,sans-serif"}}>
  <div style={{maxWidth:1120,margin:"auto",padding:"clamp(16px,4vw,52px)"}}>
   <header style={{borderBottom:"1px solid #3e657a",paddingBottom:24}}>
    <p style={{color:"#91d8f5",letterSpacing:3,fontSize:12,fontWeight:800}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INTERACTIVE EXPERIENCE</p>
    <h1 style={{fontSize:"clamp(2rem,5.5vw,4.5rem)",lineHeight:1.04,margin:"12px 0",letterSpacing:"-.04em"}}>YOU AUTHORIZED<br/><span style={{color:"#ffc978"}}>WHAT HAPPENS NEXT</span></h1>
    <p style={{color:"#b6cadc",maxWidth:740}}>One proposed command. A consequential choice. Two different authority pathways. All scenes and outcomes are fictional teaching examples.</p>
   </header>
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,margin:"26px 0 14px",flexWrap:"wrap"}}>
    <strong style={{color:"#a9e6ff",letterSpacing:2}}>ACT {String(step).padStart(2,"0")} / 06 · {phase.toUpperCase()}</strong>
    <span style={{color:"#b7cbdd",fontSize:13}}>SAMANTHA · narrated experience</span>
   </div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:5,marginBottom:18}}>{sequence.map((p,i)=><div key={p} style={{height:5,background:i<=step-1?"#ffc978":"#294559",borderRadius:10}}/>)}</div>
   <div style={{position:"relative",border:"1px solid #4e7287",borderRadius:18,overflow:"hidden",boxShadow:"0 25px 80px #0009"}}>
    <img src={imageFor(phase,choice||"execute",governed)} alt={phase==="consequence"&&current?"Illustration of selected simulated consequence": "Illustrative TA14 scenario scene"} style={{width:"100%",display:"block",height:"auto"}}/>
    <div style={{position:"absolute",top:14,left:14,background:"#061827e8",padding:"8px 12px",borderRadius:8,fontSize:12,fontWeight:800,letterSpacing:1}}>{phase==="consequence"?"SIMULATED CONSEQUENCE":phase==="exam"?"AUTHORITY EXAMINATION":"FICTIONAL SCENARIO"}</div>
   </div>
   <section aria-live="polite" style={{marginTop:18,padding:"clamp(20px,3vw,34px)",background:"#10273c",border:"1px solid #34556d",borderRadius:16}}>
    <p style={{color:"#91d8f5",fontSize:12,letterSpacing:2,fontWeight:800}}>SAMANTHA · NARRATION</p>
    <p style={{fontSize:"clamp(1.1rem,2vw,1.45rem)",lineHeight:1.7,margin:"12px 0 22px"}}>{narration}</p>
    <button type="button" onClick={hear} disabled={!audioAvailable} style={buttonStyle(false)}>{speaking?"■ Stop narration":"▶ Hear narration"}</button>
    <p style={{fontSize:12,color:"#a8bccc"}}>Browser speech synthesis; dedicated Samantha voice not yet integrated.</p>
   </section>
   {phase==="intro"&&<div style={actions}><button style={buttonStyle(true)} onClick={()=>go("decision")}>Enter the decision room →</button></div>}
   {phase==="decision"&&<section style={panel}><h2>YOU ARE AT THE EXECUTION BOUNDARY</h2><p>Choose what happens next. The simulation will follow your actual selection.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>{(Object.keys(choices) as Choice[]).map(k=><button key={k} onClick={()=>choose(k)} style={{...buttonStyle(false),minHeight:95,textAlign:"left",fontSize:16}}>{choices[k].label} →</button>)}</div></section>}
   {phase==="consequence"&&current&&<section style={panel}><h2>YOUR DECISION: {current.label}</h2><p style={{color:"#ffcc9e"}}>Modeled pathway without a TA14 authority examination. This is not a claim that this outcome occurred or would always occur.</p><div style={actions}><button style={buttonStyle(false)} onClick={()=>go("decision")}>← Change decision</button><button style={buttonStyle(true)} onClick={()=>go("rewind")}>Rewind the consequence ↶</button></div></section>}
   {phase==="rewind"&&<section style={panel}><h2>THE COMMAND HAS NOT EXECUTED YET</h2><p>Return to the same proposed action and examine whether its authority is established before any dispatch.</p><div style={actions}><button style={buttonStyle(true)} onClick={()=>go("exam")}>Examine execution authority →</button></div></section>}
   {phase==="exam"&&current&&<section style={panel}><h2>TA14 DISPOSITION: {current.disposition}</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>{["Admissible Evidence","Applicable Authority","Established Standing"].map(t=><div key={t} style={{padding:18,border:"1px solid #57758c",borderRadius:12}}><strong>{t}</strong><p style={{color:"#ffcf9c"}}>Not established in the supplied scenario</p></div>)}</div><p>The gate is a modeled control, not a claim of real-world installation or guaranteed protection.</p><div style={actions}><button style={buttonStyle(true)} onClick={()=>go("comparison")}>Compare both realities →</button></div></section>}
   {phase==="comparison"&&current&&<section style={panel}><h2>THE SAME DECISION. TWO PATHWAYS.</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:14}}>{([{key:false,title:"WITHOUT TA14 EXAMINATION",text:current.consequence},{key:true,title:"WITH TA14 EXAMINATION",text:current.governed}] as const).map(item=><div key={String(item.key)} style={{padding:20,border:"1px solid "+(item.key?"#74c6b4":"#d88d75"),borderRadius:12,background:"#081d2e"}}><h3 style={{color:item.key?"#9ee3d0":"#ffbc9f"}}>{item.title}</h3><p style={{lineHeight:1.7}}>{item.text}</p><button style={buttonStyle(governed===item.key)} onClick={()=>setGoverned(item.key)}>{governed===item.key?"Selected for record":"Select for record"}</button></div>)}</div><div style={actions}><button style={buttonStyle(true)} onClick={recordPath}>Record selected pathway →</button><button style={buttonStyle(false)} onClick={()=>go("decision")}>Try another decision</button></div></section>}
   <section style={{...panel,marginTop:24}}><h2>CONSEQUENCE ACCOUNTABILITY RECORD</h2>{record.length===0?<p style={{color:"#adc2d2"}}>Complete a decision and comparison to create a record.</p>:<ol>{record.map((r,i)=><li key={i} style={{marginBottom:16}}><strong>{choices[r.choice].label} · {r.path==="with"?"TA14 examination":"No TA14 examination"} · {r.disposition}</strong><p>{r.outcome}</p></li>)}</ol>}<div style={actions}><button style={buttonStyle(false)} onClick={restart}>Reset entire experience</button>{record.length>0&&<button style={buttonStyle(false)} onClick={()=>{const blob=JSON.stringify({simulation:"TA14 fictional consequence simulator",records:record},null,2);const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([blob],{type:"application/json"}));a.download="ta14-consequence-record.json";a.click();URL.revokeObjectURL(a.href);}}>Download fictional decision record</button>}</div></section>
   <footer style={{padding:"24px 0",fontSize:13,color:"#a9bdcd",lineHeight:1.7}}>Independent educational concept. All people, outcomes, authority findings and impacts are hypothetical. Images may contain illustrative numbers, not verified metrics. TA14 does not guarantee safety, confer legal authority, or resolve a grid emergency merely by issuing HOLD or ESCALATE.</footer>
  </div>
 </main>;
}
const actions:React.CSSProperties={display:"flex",gap:12,flexWrap:"wrap",marginTop:20};
const panel:React.CSSProperties={padding:"clamp(20px,3vw,32px)",marginTop:20,background:"#10273c",border:"1px solid #3d6279",borderRadius:16,lineHeight:1.7};
function buttonStyle(primary:boolean):React.CSSProperties{return {padding:"14px 20px",background:primary?"#f1b65f":"#1d4561",color:primary?"#091521":"#f4f9ff",border:"1px solid "+(primary?"#ffd58f":"#527a94"),borderRadius:10,fontWeight:800,cursor:"pointer"};}
