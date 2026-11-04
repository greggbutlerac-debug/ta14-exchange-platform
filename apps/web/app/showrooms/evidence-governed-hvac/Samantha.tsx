'use client';

import {useEffect,useState} from 'react';

const btn={cursor:'pointer',padding:'11px 14px',borderRadius:10,border:'1px solid rgba(112,220,255,.30)',background:'rgba(8,37,47,.9)',color:'#eef8fb',fontWeight:900,fontSize:11} as const;

export default function Samantha({text}:{text:string}){
  const [on,setOn]=useState(false),[paused,setPaused]=useState(false);
  useEffect(()=>()=>window.speechSynthesis?.cancel(),[]);
  const start=()=>{window.speechSynthesis?.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.82;u.pitch=.95;const vs=window.speechSynthesis.getVoices();u.voice=vs.find(v=>v.name==='Samantha')||vs.find(v=>v.lang==='en-US')||vs[0];u.onend=()=>{setOn(false);setPaused(false)};setOn(true);window.speechSynthesis.speak(u)};
  const toggle=()=>{if(!on)return start();if(paused){window.speechSynthesis.resume();setPaused(false)}else{window.speechSynthesis.pause();setPaused(true)}};
  return <div style={{marginTop:22,padding:16,border:'1px solid rgba(112,220,255,.20)',borderRadius:14,background:'#041019'}}>
    <b style={{color:'#70dcff',fontSize:11,letterSpacing:1}}>🎧 SAMANTHA · GUIDED WALKTHROUGH</b>
    <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:10}}>
      <button onClick={toggle} style={btn}>{!on?'▶ PLAY':paused?'▶ RESUME':'Ⅱ PAUSE'}</button>
      <button onClick={start} style={btn}>↻ RESTART</button>
      {on&&<button onClick={()=>{window.speechSynthesis.cancel();setOn(false);setPaused(false)}} style={btn}>■ STOP</button>}
    </div>
    <p style={{color:'#8099a3',fontSize:12,margin:'10px 0 0'}}>Samantha teaches this section only. The page does not auto-scroll.</p>
  </div>
}
