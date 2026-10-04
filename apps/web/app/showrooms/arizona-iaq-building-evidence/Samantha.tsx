'use client';

import { useEffect, useState } from 'react';

const btn={cursor:'pointer',padding:'12px 16px',borderRadius:10,border:'1px solid rgba(112,220,255,.34)',background:'rgba(8,37,47,.9)',color:'#eef8fb',fontWeight:900,fontSize:11} as const;

export default function Samantha({text}:{text:string}){
 const [on,setOn]=useState(false),[paused,setPaused]=useState(false);
 useEffect(()=>()=>window.speechSynthesis?.cancel(),[]);
 const start=()=>{window.speechSynthesis?.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.82;const vs=window.speechSynthesis.getVoices();u.voice=vs.find(v=>v.name==='Samantha')||vs.find(v=>v.lang==='en-US')||vs[0];u.onend=()=>{setOn(false);setPaused(false)};setOn(true);window.speechSynthesis.speak(u)};
 const toggle=()=>{if(!on)return start();if(paused){window.speechSynthesis.resume();setPaused(false)}else{window.speechSynthesis.pause();setPaused(true)}};
 return <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:18}}><button onClick={toggle} style={btn}>{!on?'▶ SAMANTHA — EXPLAIN':paused?'▶ RESUME':'Ⅱ PAUSE'}</button>{on&&<button onClick={()=>{window.speechSynthesis.cancel();setOn(false);setPaused(false)}} style={btn}>■ STOP</button>}</div>
}
