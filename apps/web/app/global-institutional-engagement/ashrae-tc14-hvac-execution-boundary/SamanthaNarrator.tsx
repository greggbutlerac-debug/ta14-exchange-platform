'use client';
import {useEffect,useRef,useState} from 'react';
type Lesson={id:string;title:string;narration:string;learned:string};
export default function SamanthaNarrator({lessons}:{lessons:Lesson[]}){
 const lesson=lessons[0];
 const [status,setStatus]=useState<'idle'|'playing'|'paused'>('idle');
 const [voiceName,setVoiceName]=useState('');
 const utterance=useRef<SpeechSynthesisUtterance|null>(null);
 useEffect(()=>{
  if(!('speechSynthesis' in window))return;
  const choose=()=>{const voices=window.speechSynthesis.getVoices();const v=voices.find(v=>v.lang.startsWith('en')&&/Samantha/i.test(v.name))||voices.find(v=>v.lang.startsWith('en')&&/aria|jenny|ava|zira/i.test(v.name))||voices.find(v=>v.lang.startsWith('en'));setVoiceName(v?.name||'');};
  choose();window.speechSynthesis.addEventListener('voiceschanged',choose);
  return ()=>{window.speechSynthesis.removeEventListener('voiceschanged',choose);if(utterance.current){window.speechSynthesis.cancel();utterance.current=null;}};
 },[]);
 const play=()=>{
  if(!('speechSynthesis' in window))return;
  if(status==='paused'&&utterance.current){window.speechSynthesis.resume();setStatus('playing');return;}
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance('Lesson '+lesson.id+'. '+lesson.title+'. '+lesson.narration+'. What you learned. '+lesson.learned);
  const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>v.name===voiceName)||null;u.lang='en-US';u.rate=.92;
  utterance.current=u;u.onend=()=>{if(utterance.current===u){utterance.current=null;setStatus('idle');}};u.onerror=()=>{if(utterance.current===u){utterance.current=null;setStatus('idle');}};
  window.speechSynthesis.speak(u);setStatus('playing');
 };
 const pause=()=>{if('speechSynthesis' in window){window.speechSynthesis.pause();setStatus('paused');}};
 const stop=()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();utterance.current=null;setStatus('idle');};
 return <div style={{padding:'16px 24px',background:'#102e3c',borderTop:'1px solid #315466',borderBottom:'1px solid #315466'}}>
  <div style={{fontSize:12,letterSpacing:1,color:'#6fe8ff',fontWeight:800,marginBottom:10}}>SAMANTHA · LESSON {lesson.id} AUDIO</div>
  <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
   <button type="button" onClick={play} style={{background:'#6fe8ff',color:'#06202c',padding:'11px 18px',fontWeight:800,borderRadius:8,cursor:'pointer'}}>{status==='paused'?'▶ Resume':'▶ Play Samantha'}</button>
   {status==='playing'&&<button type="button" onClick={pause} style={{padding:'10px 14px',background:'#244b5b',color:'#fff',borderRadius:8}}>Ⅱ Pause</button>}
   {status!=='idle'&&<button type="button" onClick={stop} style={{padding:'10px 14px',background:'#244b5b',color:'#fff',borderRadius:8}}>■ Stop</button>}
   <span role="status" style={{fontSize:12,color:'#bdd4df'}}>{status==='playing'?'Speaking…':status==='paused'?'Paused':'Ready to play'}</span>
  </div>
  <p style={{fontSize:12,color:'#a9c3cf',margin:'9px 0 0'}}>Voice uses your browser's available English voices; Samantha is preferred when available.</p>
 </div>;
}
