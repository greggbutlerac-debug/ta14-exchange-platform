"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ModelState = "baseline"|"evidence-gap"|"authority-loss"|"continuity-break"|"changed";

const states: Record<ModelState,{label:string;result:string;detail:string;path:string[]}> = {
  baseline:{label:"PRESENT CONSTITUTIONAL STATE SUPPORTED",result:"ADMISSIBLE",detail:"Admitted evidence, valid authority, continuity, constraints, and current operating conditions support a bounded present-state determination.",path:["ADMITTED EVIDENCE","RECONSTRUCT STATE","EXAMINE CONSEQUENCE","ADMISSIBLE"]},
  "evidence-gap":{label:"ADMITTED EVIDENCE INSUFFICIENT",result:"ESCALATED",detail:"A material evidence gap cannot be silently converted into permission.",path:["EVIDENCE GAP","STATE UNRESOLVED","NO SILENT ASSUMPTION","ESCALATED"]},
  "authority-loss":{label:"VALID AUTHORITY NOT ESTABLISHED",result:"DENIED",detail:"The v1.0 declaration does not authorize consequential execution without valid authority and current constitutional admissibility.",path:["ADMITTED EVIDENCE","RECONSTRUCT STATE","AUTHORITY FAILURE","DENIED"]},
  "continuity-break":{label:"CONTINUITY NOT ESTABLISHED",result:"DENIED",detail:"Prior constitutional state does not automatically carry forward when material continuity cannot be established.",path:["PRIOR STATE","CONTINUITY BREAK","PRESENT STATE FAILS","DENIED"]},
  changed:{label:"MATERIAL CONDITIONS CHANGED",result:"RECOMPUTE PRESENT STATE",detail:"Material change requires a new present-state determination. Prior permission is not permanent permission.",path:["PRIOR DETERMINATION","MATERIAL CHANGE","RECOMPUTE STATE","NEW DETERMINATION"]}
};

function Samantha({text,title="SAMANTHA · GUIDED WALKTHROUGH"}:{text:string;title?:string}){
  const [state,setState]=useState<"idle"|"playing"|"paused">("idle");
  useEffect(()=>()=>window.speechSynthesis?.cancel(),[]);
  const play=()=>{if(typeof window==="undefined"||!("speechSynthesis" in window))return;if(state==="paused"){window.speechSynthesis.resume();setState("playing");return}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>/Samantha/i.test(v.name))||voices.find(v=>/female|zira|ava|victoria|karen/i.test(v.name))||voices.find(v=>v.lang.startsWith("en"))||null;u.rate=.82;u.pitch=.96;u.onend=()=>setState("idle");u.onerror=()=>setState("idle");window.speechSynthesis.speak(u);setState("playing")};
  const pause=()=>{window.speechSynthesis.pause();setState("paused")};
  const stop=()=>{window.speechSynthesis.cancel();setState("idle")};
  return <div className="samanthaPlayer"><div><b>🎧 {title}</b><span>Play, pause, resume, or stop · the page remains free-scroll</span></div><div className="samanthaButtons"><button type="button" onClick={play}>{state==="paused"?"▶ RESUME":state==="playing"?"↻ RESTART":"▶ PLAY"}</button>{state==="playing"&&<button type="button" onClick={pause}>Ⅱ PAUSE</button>}<button type="button" onClick={stop}>■ STOP</button></div></div>;
}
