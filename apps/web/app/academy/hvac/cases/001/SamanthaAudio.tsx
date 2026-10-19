"use client";
import {useEffect,useRef,useState} from "react";

const START_EVENT="ta14-case001-narration-start";

export default function SamanthaAudio({text,lesson}:{text:string;lesson:number}){
 const [status,setStatus]=useState<"idle"|"playing"|"paused"|"unavailable">("idle");
 const utterance=useRef<SpeechSynthesisUtterance|null>(null);
 const supported=typeof window!=="undefined"&&"speechSynthesis" in window;
 useEffect(()=>{
  const onOtherStart=(event:Event)=>{
   const detail=(event as CustomEvent<number>).detail;
   if(detail!==lesson){utterance.current=null;setStatus("idle");}
  };
  window.addEventListener(START_EVENT,onOtherStart);
  return ()=>{
   window.removeEventListener(START_EVENT,onOtherStart);
   if(utterance.current&&"speechSynthesis" in window){
    window.speechSynthesis.cancel();
    utterance.current=null;
   }
  };
 },[lesson]);
 function play(){
  if(!supported){setStatus("unavailable");return;}
  window.speechSynthesis.cancel();
  window.dispatchEvent(new CustomEvent(START_EVENT,{detail:lesson}));
  const u=new SpeechSynthesisUtterance(text);
  u.lang="en-US";u.rate=0.94;u.pitch=1;
  u.onend=()=>{if(utterance.current===u){utterance.current=null;setStatus("idle");}};
  u.onerror=()=>{if(utterance.current===u){utterance.current=null;setStatus("idle");}};
  utterance.current=u;
  window.speechSynthesis.speak(u);
  setStatus("playing");
 }
 function pause(){if(supported&&utterance.current){window.speechSynthesis.pause();setStatus("paused");}}
 function resume(){if(supported&&utterance.current){window.speechSynthesis.resume();setStatus("playing");}}
 function stop(){if(supported&&utterance.current){window.speechSynthesis.cancel();utterance.current=null;setStatus("idle");}}
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
