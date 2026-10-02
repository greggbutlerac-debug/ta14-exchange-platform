'use client';

import Image from 'next/image';
import {useEffect,useMemo,useState} from 'react';

export type LessonVisual = {
  id:string;
  title:string;
  image:string;
  intro:{en:string;es:string};
  narration:{en:string;es:string};
  outcome:{en:string;es:string};
};

export function LessonVisualSamantha({visual}:{visual:LessonVisual}){
  const [language,setLanguage]=useState<'en'|'es'>('en');
  const [speaking,setSpeaking]=useState(false);
  const [paused,setPaused]=useState(false);
  const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);
  const [active,setActive]=useState(-1);
  const text=visual.narration[language];
  const words=useMemo(()=>[...text.matchAll(/\S+/g)].map(m=>({word:m[0],start:m.index||0})),[text]);

  useEffect(()=>{
    if(typeof window==='undefined'||!('speechSynthesis' in window))return;
    const load=()=>setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener('voiceschanged',load);
    return()=>{window.speechSynthesis.cancel();window.speechSynthesis.removeEventListener('voiceschanged',load)};
  },[]);

  useEffect(()=>{if(typeof window!=='undefined')window.speechSynthesis.cancel();setSpeaking(false);setPaused(false);setActive(-1)},[language]);

  const stop=()=>{if(typeof window!=='undefined')window.speechSynthesis.cancel();setSpeaking(false);setPaused(false);setActive(-1)};
  const start=()=>{
    if(typeof window==='undefined'||!('speechSynthesis' in window))return;
    stop();
    const utterance=new SpeechSynthesisUtterance(text);
    const candidates=voices.filter(v=>v.lang.toLowerCase().startsWith(language));
    const voice=language==='en'
      ? candidates.find(v=>v.name==='Samantha')||candidates.find(v=>v.lang==='en-US')||candidates[0]
      : candidates.find(v=>/paulina|monica|jorge|español|spanish/i.test(v.name))||candidates.find(v=>v.lang.toLowerCase()==='es-us')||candidates.find(v=>v.lang.toLowerCase()==='es-mx')||candidates[0];
    if(voice)utterance.voice=voice;
    utterance.lang=language==='en'?'en-US':'es-US';
    utterance.rate=.76;
    utterance.pitch=.95;
    utterance.onboundary=e=>{if(e.name!=='word')return;let z=0;for(let i=0;i<words.length;i++){if(words[i].start<=e.charIndex)z=i;else break}setActive(z)};
    utterance.onend=stop;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };
  const toggle=()=>{if(!speaking)return start();if(paused){window.speechSynthesis.resume();setPaused(false)}else{window.speechSynthesis.pause();setPaused(true)}};

  return <section style={{margin:'0 0 28px',padding:22,border:'1px solid #285b78',borderRadius:18,background:'linear-gradient(145deg,#062945,#041e35)'}}>
    <div style={{display:'flex',justifyContent:'space-between',gap:14,alignItems:'end',flexWrap:'wrap',marginBottom:15}}>
      <div><small style={{color:'#7BAFD4',fontWeight:900}}>LESSON {visual.id} · TEACHING VISUAL</small><h2 style={{fontFamily:'Georgia,serif',fontSize:30,margin:'6px 0'}}>{visual.title}</h2></div>
      <div style={{display:'flex',gap:7}}><button onClick={()=>setLanguage('en')} style={{padding:'9px 13px',borderRadius:999,border:'1px solid #7BAFD4',background:language==='en'?'#7BAFD4':'#031a2e',color:language==='en'?'#001426':'#C9E0EF',fontWeight:900,cursor:'pointer'}}>ENGLISH</button><button onClick={()=>setLanguage('es')} style={{padding:'9px 13px',borderRadius:999,border:'1px solid #7BAFD4',background:language==='es'?'#7BAFD4':'#031a2e',color:language==='es'?'#001426':'#C9E0EF',fontWeight:900,cursor:'pointer'}}>ESPAÑOL</button></div>
    </div>
    <div style={{position:'relative',width:'100%',aspectRatio:'3 / 2',borderRadius:14,overflow:'hidden',border:'1px solid #285b78',background:'#001426'}}><Image src={visual.image} alt={visual.title+' teaching board'} fill sizes="(max-width: 1120px) 100vw, 1080px" style={{objectFit:'contain'}}/></div>
    <div style={{marginTop:18,padding:18,borderLeft:'4px solid #B9D9EB',background:'#031a2e'}}><b style={{color:'#B9D9EB'}}>{language==='en'?'BEFORE YOU LISTEN':'ANTES DE ESCUCHAR'}</b><p style={{color:'#C9E0EF',lineHeight:1.8,marginBottom:0}}>{visual.intro[language]}</p></div>
    <div style={{marginTop:14,padding:18,border:'1px solid #316987',borderRadius:14,background:'#031a2e'}}>
      <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',flexWrap:'wrap'}}><div><b style={{color:'#B9D9EB'}}>🎧 {language==='en'?'SAMANTHA · GUIDED WALKTHROUGH':'GUÍA EN ESPAÑOL · RECORRIDO'}</b><div style={{color:'#89A9BF',fontSize:11,marginTop:4}}>{language==='en'?'Slower pace · follow numbers 1 → 8':'Ritmo más lento · sigue los números 1 → 8'}</div></div><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><button onClick={toggle} style={{padding:'10px 13px',cursor:'pointer',fontWeight:900}}>{!speaking?'▶ PLAY':paused?'▶ RESUME':'Ⅱ PAUSE'}</button><button onClick={start} style={{padding:'10px 13px',cursor:'pointer'}}>↻ {language==='en'?'RESTART':'REINICIAR'}</button>{speaking&&<button onClick={stop} style={{padding:'10px 13px',cursor:'pointer'}}>■ STOP</button>}</div></div>
      <p style={{color:'#C9E0EF',lineHeight:1.9,fontSize:15,marginBottom:0}}>{words.map((w,i)=><span key={i} style={{background:active===i?'#2d6c8a':'transparent',color:active===i?'#fff':undefined,borderRadius:3}}>{w.word} </span>)}</p>
    </div>
    <div style={{marginTop:14,padding:18,border:'1px solid #316987',borderRadius:12}}><b style={{color:'#7BAFD4'}}>{language==='en'?'WHEN THIS BOARD IS DONE':'AL TERMINAR ESTE TABLERO'}</b><p style={{color:'#C9E0EF',lineHeight:1.8,marginBottom:0}}>{visual.outcome[language]}</p></div>
  </section>;
}
