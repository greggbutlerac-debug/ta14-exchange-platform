'use client';
import { useEffect, useState } from 'react';
export default function SamanthaNarration({text}:{text:string}){
 const [playing,setPlaying]=useState(false);
 const [supported,setSupported]=useState(false);
 useEffect(()=>{setSupported(typeof window!=='undefined'&&'speechSynthesis' in window);return ()=>{if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();};},[]);
 function toggle(){
  if(!('speechSynthesis' in window))return;
  window.speechSynthesis.cancel();
  if(playing){setPlaying(false);return;}
  const u=new SpeechSynthesisUtterance(text);
  u.lang='en-US';u.rate=0.92;
  const voices=window.speechSynthesis.getVoices();
  const voice=voices.find(v=>/samantha/i.test(v.name)&&v.lang.startsWith('en'))||voices.find(v=>v.lang.startsWith('en')&&/ava|zira|jenny/i.test(v.name))||voices.find(v=>v.lang.startsWith('en'));
  if(voice)u.voice=voice;
  u.onend=()=>setPlaying(false);u.onerror=()=>setPlaying(false);
  setPlaying(true);window.speechSynthesis.speak(u);
 }
 return <div><button type="button" disabled={!supported} onClick={toggle} style={{background:'#f0b62e',color:'#102235',padding:'12px 18px',border:0,borderRadius:8,fontWeight:700,cursor:'pointer'}}>{playing?'Stop narration':'Listen to Samantha'}</button>{!supported&&<p>Audio is unavailable in this browser. The script remains visible.</p>}</div>;
}
