'use client';

import {useEffect,useRef,useState} from 'react';

type Lesson={title:string;learned:string;next:string};

export default function SamanthaNarration({lessons,lessonIndex}:{lessons:readonly Lesson[];lessonIndex:number}){
 const active=lessonIndex;
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

  const l=lessons[index];
  const u=new SpeechSynthesisUtterance('Lesson '+(index+1)+' of eight. '+l.title+'. What you just learned: '+l.learned+'. What comes next: '+l.next);
  if(voiceRef.current)u.voice=voiceRef.current;
  u.lang='en-US';u.rate=.91;u.pitch=1;
  u.onend=()=>setSpeaking(false);u.onerror=()=>setSpeaking(false);
  setSpeaking(true);window.speechSynthesis.speak(u);
 };
 return <div className="samanthaInline" aria-label={'Samantha narration for lesson '+(lessonIndex+1)}>
  <button type="button" className="samanthaPlay" onClick={()=>speaking?stop():play(active)} disabled={!supported}>{speaking?'■ STOP SAMANTHA':'▶ PLAY SAMANTHA'}</button>
  <span>LESSON {String(lessonIndex+1).padStart(2,'0')} / 08 · {lessons[lessonIndex].title}</span>
  {!supported?<span>Voice playback unavailable in this browser.</span>:null}
 </div>;
}
