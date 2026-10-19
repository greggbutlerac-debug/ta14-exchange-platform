"use client";
import {useEffect,useRef,useState} from "react";

export default function SamanthaAudio({text,lesson}:{text:string;lesson:number}){
 const [status,setStatus]=useState<"idle"|"playing"|"paused"|"unavailable">("idle");
 const utterance=useRef<SpeechSynthesisUtterance|null>(null);
 const supported=typeof window!=="undefined"&&"speechSynthesis" in window;
 useEffect(()=>()=>{if(typeof window!=="undefined"&&"speechSynthesis" in window){window.speechSynthesis.cancel()}},[]);
 function play(){
  if(!supported){setStatus("unavailable");return;}
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang="en-US";u.rate=0.94;u.pitch=1;
  u.onend=()=>setStatus("idle");
  u.onerror=()=>setStatus("idle");
  utterance.current=u;
  window.speechSynthesis.speak(u);
  setStatus("playing");
 }
 function pause(){if(supported){window.speechSynthesis.pause();setStatus("paused");}}
 function resume(){if(supported){window.speechSynthesis.resume();setStatus("playing");}}
 function stop(){if(supported){window.speechSynthesis.cancel();setStatus("idle");}}
 return <div className="samantha-audio" aria-label={`Samantha narration for lesson ${lesson}`}>
 <strong>🔊 Listen to Samantha</strong>
 <div className="samantha-controls">
 <button type="button" onClick={play} disabled={!supported}>▶ Play from start</button>
 {status==="playing"&&<button type="button" onClick={pause}>⏸ Pause</button>}
 {status==="paused"&&<button type="button" onClick={resume}>▶ Resume</button>}
 {(status==="playing"||status==="paused")&&<button type="button" onClick={stop}>■ Stop</button>}
 </div>
 <small role="status">{!supported?"Audio narration is not supported in this browser.":status==="playing"?"Narration playing":status==="paused"?"Narration paused":"Browser voice narration — not Samantha's custom recorded voice."}</small>
 </div>;
}
