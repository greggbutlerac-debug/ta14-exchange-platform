'use client';
import {useEffect,useRef,useState} from 'react';

type Lesson={id:string;title:string;narration:string;learned:string};
export default function SamanthaNarrator({lessons}:{lessons:Lesson[]}){
 const [active,setActive]=useState<number|null>(null);
 const [paused,setPaused]=useState(false);
 const [supported,setSupported]=useState(true);
 const [voiceName,setVoiceName]=useState('');
 const [autoNext,setAutoNext]=useState(false);
 const sequence=useRef(false);
 const activeRef=useRef<number|null>(null);
 const voices=useRef<SpeechSynthesisVoice[]>([]);
 useEffect(()=>{
  if(!('speechSynthesis' in window)){setSupported(false);return;}
  const load=()=>{voices.current=window.speechSynthesis.getVoices();const chosen=voices.current.find(v=>v.lang.startsWith('en')&&/Samantha/i.test(v.name))||voices.current.find(v=>v.lang.startsWith('en')&&/female|zira|aria|jenny|ava/i.test(v.name))||voices.current.find(v=>v.lang.startsWith('en'));setVoiceName(chosen?.name||'System default');};
  load();window.speechSynthesis.addEventListener('voiceschanged',load);
  return ()=>{sequence.current=false;window.speechSynthesis.cancel();window.speechSynthesis.removeEventListener('voiceschanged',load);};
 },[]);
 const stop=()=>{sequence.current=false;window.speechSynthesis.cancel();activeRef.current=null;setActive(null);setPaused(false);};
 const speak=(index:number,continuous:boolean)=>{
  if(!supported)return;
  window.speechSynthesis.cancel();sequence.current=continuous;
  activeRef.current=index;setActive(index);setPaused(false);
  const lesson=lessons[index];
  const utterance=new SpeechSynthesisUtterance('Lesson '+(index+1)+'. '+lesson.title+'. '+lesson.narration+'. What you learned: '+lesson.learned+'.');
  const chosen=voices.current.find(v=>v.name===voiceName);if(chosen)utterance.voice=chosen;
  utterance.rate=0.92;utterance.pitch=1.02;utterance.lang='en-US';
  utterance.onend=()=>{if(activeRef.current!==index)return;if(sequence.current&&index+1<lessons.length){speak(index+1,true);}else{activeRef.current=null;setActive(null);setPaused(false);}};
  utterance.onerror=()=>{if(activeRef.current===index){activeRef.current=null;setActive(null);setPaused(false);sequence.current=false;}};
  window.speechSynthesis.speak(utterance);
 };
 const togglePause=()=>{if(window.speechSynthesis.paused){window.speechSynthesis.resume();setPaused(false);}else{window.speechSynthesis.pause();setPaused(true);}};
 return <div style={{border:'1px solid #4c7986',borderRadius:16,padding:20,margin:'14px 0 28px',background:'#0a2532'}}>
  <div style={{color:'#6fe8ff',fontWeight:900,letterSpacing:1}}>SAMANTHA · AUDIO NARRATOR</div>
  <p style={{lineHeight:1.65}}>Hear each illustrated lesson spoken aloud. Audio uses the voices available in your browser; a voice named Samantha is selected when available. Playback begins only after you press Play.</p>
  {!supported?<p role="status">Audio narration is not supported by this browser. The complete written narration remains available below.</p>:<>
   <div style={{display:'flex',flexWrap:'wrap',gap:10,alignItems:'center',marginBottom:12}}>
    <button type="button" onClick={()=>speak(0,true)} style={{padding:'11px 16px',background:'#6fe8ff',color:'#06202c',fontWeight:800,borderRadius:8}}>▶ Play all 8 lessons</button>
    <button type="button" disabled={active===null} onClick={togglePause} style={{padding:'11px 16px',border:'1px solid #7ca6b7',borderRadius:8,color:'#fff',background:'#173847'}}>{paused?'▶ Resume':'Ⅱ Pause'}</button>
    <button type="button" disabled={active===null} onClick={stop} style={{padding:'11px 16px',border:'1px solid #7ca6b7',borderRadius:8,color:'#fff',background:'#173847'}}>■ Stop</button>
   </div>
   <p aria-live="polite" style={{color:'#c4dce6',fontSize:13}}>{active===null?'Ready to narrate':(paused?'Paused: ':'Now speaking: ')+lessons[active].title} · Voice: {voiceName||'System default'}</p>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:8}}>{lessons.map((lesson,i)=><button type="button" key={lesson.id} onClick={()=>speak(i,false)} aria-label={'Play narration for lesson '+lesson.id} style={{textAlign:'left',padding:'10px 12px',border:'1px solid '+(active===i?'#6fe8ff':'#365b6c'),borderRadius:8,background:active===i?'#124d62':'#112e3c',color:'#fff',cursor:'pointer'}}>▶ Lesson {lesson.id}</button>)}</div>
  </>}
 </div>;
}
