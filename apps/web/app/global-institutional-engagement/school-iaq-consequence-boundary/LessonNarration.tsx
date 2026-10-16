'use client';
import { useEffect, useState } from 'react';

type Props={lesson:number; learned:string; next:string};
export default function LessonNarration({lesson,learned,next}:Props){
 const [speaking,setSpeaking]=useState(false);
 const [available,setAvailable]=useState(false);
 useEffect(()=>{setAvailable(typeof window!=='undefined'&&'speechSynthesis' in window);return ()=>{if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();};},[]);
 const play=()=>{
  if(!available)return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance('Lesson '+lesson+'. What we learned. '+learned+' Coming next. '+next);
  utterance.lang='en-US';utterance.rate=0.92;utterance.pitch=1.03;
  const voices=window.speechSynthesis.getVoices();
  const english=voices.filter(v=>v.lang.toLowerCase().startsWith('en'));
  utterance.voice=english.find(v=>/samantha/i.test(v.name))||english.find(v=>/female|ava|allison|victoria|zira/i.test(v.name))||english[0]||null;
  utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>setSpeaking(false);
  window.speechSynthesis.speak(utterance);setSpeaking(true);
 };
 const stop=()=>{window.speechSynthesis.cancel();setSpeaking(false);};
 return <div className="narration"><strong>SAMANTHA · LESSON NARRATION</strong><p>{learned}</p><p className="next">{next}</p><div className="voiceControl">{available?<button type="button" onClick={speaking?stop:play} aria-label={speaking?'Stop narration':'Play narration for lesson '+lesson}>{speaking?'■ Stop narration':'▶ Listen to lesson '+String(lesson).padStart(2,'0')}</button>:<span>Audio playback is unavailable in this browser.</span>}<small>Browser voice narration · voice varies by device</small></div></div>;
}
