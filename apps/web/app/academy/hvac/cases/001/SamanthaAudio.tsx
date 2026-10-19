"use client";
import {useEffect,useRef,useState} from "react";

const START_EVENT="ta14-case001-narration-start";

export default function SamanthaAudio({text,lesson}:{text:string;lesson:number}){
 const [status,setStatus]=useState<"idle"|"playing"|"paused"|"unavailable">("idle");
 const utterance=useRef<SpeechSynthesisUtterance|null>(null);
 const [rate,setRate]=useState(0.94);
 const [voiceName,setVoiceName]=useState("");
 const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);
 const supported=typeof window!=="undefined"&&"speechSynthesis" in window;
 useEffect(()=>{
  if(!("speechSynthesis" in window))return;
  const refresh=()=>setVoices(window.speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith("en")));
  refresh();window.speechSynthesis.addEventListener("voiceschanged",refresh);
  return()=>window.speechSynthesis.removeEventListener("voiceschanged",refresh);
 },[]);
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
  u.lang="en-US";u.rate=rate;u.pitch=1;
  const preferred=voices.find(v=>v.name===voiceName)||voices.find(v=>/samantha|zira|aria|jenny|ava|susan|victoria/i.test(v.name))||voices.find(v=>v.lang.toLowerCase()==="en-us")||voices[0];
  if(preferred){u.voice=preferred;u.lang=preferred.lang;}
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
 <label>Speaking pace <select aria-label="Narration speed" value={rate} onChange={e=>setRate(Number(e.target.value))}><option value={0.8}>Slow</option><option value={0.94}>Teaching pace</option><option value={1.05}>Normal</option><option value={1.2}>Fast</option></select></label>
 {voices.length>0&&<label>Voice <select aria-label="Narration voice" value={voiceName} onChange={e=>setVoiceName(e.target.value)}><option value="">Preferred English voice</option>{voices.map(v=><option key={v.voiceURI} value={v.name}>{v.name} ({v.lang})</option>)}</select></label>}
 <button type="button" onClick={play} disabled={!supported}>▶ Play from start</button>
 {status==="playing"&&<button type="button" onClick={pause}>⏸ Pause</button>}
 {status==="paused"&&<button type="button" onClick={resume}>▶ Resume</button>}
 {(status==="playing"||status==="paused")&&<button type="button" onClick={stop}>■ Stop</button>}
 </div>
 <small role="status">{!supported?"Audio narration is not supported in this browser.":status==="playing"?"Narration playing":status==="paused"?"Narration paused":"Browser-generated narration, not a custom Samantha recording. Changes apply on the next playback."}</small>
 </div>;
}
