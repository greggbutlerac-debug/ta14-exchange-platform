'use client';
import {useEffect,useRef,useState} from 'react';
export default function Samantha({text}:{text:string}){
 const [mode,setMode]=useState<'idle'|'playing'|'paused'>('idle');
 const utterance=useRef<SpeechSynthesisUtterance|null>(null);
 useEffect(()=>()=>{if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel()},[]);
 const play=()=>{
  if(!('speechSynthesis' in window))return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.rate=.86;u.pitch=.98;u.lang='en-US';
  const voices=window.speechSynthesis.getVoices();
  u.voice=voices.find(v=>/samantha/i.test(v.name))||voices.find(v=>v.lang==='en-US')||null;
  u.onend=()=>setMode('idle');u.onerror=()=>setMode('idle');
  utterance.current=u;setMode('playing');window.speechSynthesis.speak(u);
 };
 const toggle=()=>{
  if(!('speechSynthesis' in window))return;
  if(mode==='idle')play(); else if(mode==='playing'){window.speechSynthesis.pause();setMode('paused')}
  else {window.speechSynthesis.resume();setMode('playing')}
 };
 const stop=()=>{window.speechSynthesis.cancel();setMode('idle')};
 return <div aria-label="Samantha narration" style={{margin:'16px 0 0',padding:'16px 18px',border:'1px solid #31516a',borderRadius:12,background:'#081a29'}}>
  <div style={{fontSize:11,color:'#d7b96b',letterSpacing:1.5,fontWeight:900}}>SAMANTHA · OPTIONAL AUDIO GUIDANCE</div>
  <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:12}}>
   <button onClick={toggle} style={{padding:'11px 16px',border:'1px solid #72cde0',borderRadius:9,color:'#effcff',background:'#11394a',cursor:'pointer',fontWeight:800}}>{mode==='idle'?'▶ Play Samantha':mode==='paused'?'▶ Resume Samantha':'Ⅱ Pause Samantha'}</button>
   {mode!=='idle'&&<button onClick={stop} style={{padding:'11px 16px',border:'1px solid #6b7b8c',borderRadius:9,color:'#eaf6fa',background:'#172532',cursor:'pointer'}}>■ Stop</button>}
  </div>
  <p style={{fontSize:12,lineHeight:1.5,color:'#91a8b6',margin:'12px 0 0'}}>Browser speech uses the Samantha voice when available. Narration does not scroll the page.</p>
 </div>
}