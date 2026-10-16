'use client';

import {useEffect,useRef,useState} from 'react';

type Lesson={title:string;learned:string;next:string};

export default function SamanthaNarration({lessons}:{lessons:readonly Lesson[]}){
 const [active,setActive]=useState(0);
 const [speaking,setSpeaking]=useState(false);
 const [supported,setSupported]=useState(true);
 const voiceRef=useRef<SpeechSynthesisVoice|null>(null);
 useEffect(()=>{
  if(!('speechSynthesis' in window)){setSupported(false);return;}
  const choose=()=>{
   const voices=window.speechSynthesis.getVoices();
   voiceRef.current=voices.find(v=>/samantha/i.test(v.name))||voices.find(v=>v.lang.startsWith('en')&&/female|ava|jenny|aria/i.test(v.name))||voices.find(v=>v.lang.startsWith('en'))||null;
  };
  choose();
  window.speechSynthesis.addEventListener('voiceschanged',choose);
  return ()=>{window.speechSynthesis.cancel();window.speechSynthesis.removeEventListener('voiceschanged',choose)};
 },[]);
 const stop=()=>{if(supported)window.speechSynthesis.cancel();setSpeaking(false)};
 const play=(index:number)=>{
  if(!supported)return;
  window.speechSynthesis.cancel();
  setActive(index);
  const l=lessons[index];
  const u=new SpeechSynthesisUtterance('Lesson '+(index+1)+' of eight. '+l.title+'. What you just learned: '+l.learned+'. What comes next: '+l.next);
  if(voiceRef.current)u.voice=voiceRef.current;
  u.lang='en-US';u.rate=.91;u.pitch=1;
  u.onend=()=>setSpeaking(false);u.onerror=()=>setSpeaking(false);
  setSpeaking(true);window.speechSynthesis.speak(u);
 };
 return <div className="samanthaPanel" aria-label="Samantha audio narration">
  <div><small>SAMANTHA · GUIDED NARRATION</small><h3>Listen as Samantha walks you through all eight lessons.</h3><p>Choose a lesson and press Play. Narration uses your device's available voice; Samantha is preferred when installed. The images remain free-scroll, and playback never starts without your choice.</p></div>
  <div className="samanthaControls">
   <div className="samanthaButtons"><button type="button" onClick={()=>play(active)} disabled={!supported}>{speaking?'↻ RESTART':'▶ PLAY'} LESSON {String(active+1).padStart(2,'0')}</button><button type="button" onClick={stop} disabled={!speaking}>■ STOP</button><button type="button" onClick={()=>{stop();setActive(i=>Math.max(0,i-1))}} disabled={active===0}>←</button><button type="button" onClick={()=>{stop();setActive(i=>Math.min(7,i+1))}} disabled={active===7}>→</button></div>
   <div className="samanthaLessonList">{lessons.map((l,i)=><button type="button" key={i} aria-pressed={active===i} onClick={()=>{stop();setActive(i)}}>{String(i+1).padStart(2,'0')}</button>)}</div>
   {!supported?<p>Audio narration is not supported in this browser. The written lesson narration remains available below every image.</p>:null}
  </div>
 </div>;
}
