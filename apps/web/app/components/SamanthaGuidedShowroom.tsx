'use client';

import {useEffect,useRef,useState} from 'react';

export type SamanthaSection={
  id:string;
  number:string;
  title:string;
  narration:string;
  startSeconds:number;
};

export type SamanthaLanguage={
  code:string;
  label:string;
  status?:string;
  audioSrc?:string;
  sections:SamanthaSection[];
};

export default function SamanthaGuidedShowroom({
  languages,
  defaultLanguage,
}:{
  languages:SamanthaLanguage[];
  defaultLanguage:string;
}){
  const [language,setLanguage]=useState(defaultLanguage);
  const [active,setActive]=useState(0);
  const [started,setStarted]=useState(false);
  const [follow,setFollow]=useState(true);
  const [paused,setPaused]=useState(false);
  const [voicesReady,setVoicesReady]=useState(false);
  const [speechSupported,setSpeechSupported]=useState(true);
  const [voiceName,setVoiceName]=useState('');
  const canNarrate=Boolean(current.audioSrc)||(language==='en'&&speechSupported);
  const guidedMode=canNarrate?'GUIDED':'EXPLORE';
  const audioRef=useRef<HTMLAudioElement|null>(null);
  const programmaticScroll=useRef(false);
  const speechRun=useRef(0);
  const current=languages.find(x=>x.code===language)??languages[0];

  const center=(id:string)=>{
    programmaticScroll.current=true;
    document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'center'});
    window.setTimeout(()=>{programmaticScroll.current=false},900);
  };

  const speak=(index:number,run:number)=>{
    if(typeof window==='undefined'||!('speechSynthesis' in window)||current.audioSrc||language!=='en')return;
    const section=current.sections[index]; if(!section)return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(section.narration);
    u.lang=language==='en'?'en-US':'en-US';
    const voices=window.speechSynthesis.getVoices();
    u.voice=voices.find(v=>/samantha/i.test(v.name))??voices.find(v=>v.lang.toLowerCase().startsWith('en-us'))??null;
    setVoiceName(u.voice?.name??'Browser default');
    u.rate=.92; u.pitch=1;
    u.onend=()=>{
      if(speechRun.current!==run)return;
      const next=index+1;
      if(next<current.sections.length){setActive(next);if(follow)center(current.sections[next].id);window.setTimeout(()=>speak(next,run),450)}
      else setStarted(false);
    };
    window.speechSynthesis.speak(u);
  };

  const go=(index:number)=>{
    const next=Math.max(0,Math.min(index,current.sections.length-1));
    setActive(next); setStarted(true); setFollow(true); setPaused(false);
    const run=speechRun.current+1; speechRun.current=run;
    if(audioRef.current){audioRef.current.currentTime=current.sections[next].startSeconds; void audioRef.current.play();}
    else window.setTimeout(()=>speak(next,run),100);
    center(current.sections[next].id);
  };

  const togglePause=()=>{
    if(typeof window==='undefined')return;
    if(audioRef.current){
      if(audioRef.current.paused){void audioRef.current.play();setPaused(false)}else{audioRef.current.pause();setPaused(true)}
      return;
    }
    if(!('speechSynthesis' in window)||language!=='en')return;
    if(window.speechSynthesis.paused){window.speechSynthesis.resume();setPaused(false)}else{window.speechSynthesis.pause();setPaused(true)}
  };

  const restart=()=>{
    speechRun.current+=1;
    if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();
    setPaused(false);go(0);
  };

  useEffect(()=>{
    if(typeof window==='undefined')return;
    if(!('speechSynthesis' in window)){setSpeechSupported(false);return;}
    const load=()=>{const voices=window.speechSynthesis.getVoices();setVoicesReady(true);const preferred=voices.find(v=>/samantha/i.test(v.name))??voices.find(v=>v.lang.toLowerCase().startsWith('en-us'));setVoiceName(preferred?.name??'Browser default')};
    load(); window.speechSynthesis.addEventListener('voiceschanged',load);
    return()=>{window.speechSynthesis.removeEventListener('voiceschanged',load);window.speechSynthesis.cancel()};
  },[]);

  useEffect(()=>{
    document.documentElement.dataset.showroomLanguage=language;
    return()=>{delete document.documentElement.dataset.showroomLanguage};
  },[language]);

  useEffect(()=>{
    if(!started)return;
    const manual=()=>{if(!programmaticScroll.current)setFollow(false)};
    const keyboard=(e:KeyboardEvent)=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key))manual()};
    window.addEventListener('wheel',manual,{passive:true});
    window.addEventListener('touchmove',manual,{passive:true});
    window.addEventListener('scroll',manual,{passive:true});
    window.addEventListener('keydown',keyboard);
    return()=>{window.removeEventListener('wheel',manual);window.removeEventListener('touchmove',manual);window.removeEventListener('scroll',manual);window.removeEventListener('keydown',keyboard)};
  },[started]);

  useEffect(()=>{
    const a=audioRef.current; if(!a)return;
    const sync=()=>{
      let next=0;
      current.sections.forEach((s,i)=>{if(a.currentTime>=s.startSeconds)next=i});
      if(next!==active){setActive(next);if(follow)center(current.sections[next].id)}
    };
    a.addEventListener('timeupdate',sync); return()=>a.removeEventListener('timeupdate',sync);
  },[active,current,follow]);

  return <aside className="samanthaGuide" aria-label="Samantha guided showroom">
    <div className="samanthaHead"><b>SAMANTHA</b><span>{guidedMode} SHOWROOM</span></div>
    <div className="samanthaLanguages">{languages.map(l=><button key={l.code} className={l.code===language?'on':''} onClick={()=>{
      const wasStarted=started;
      const sectionId=current.sections[active]?.id;
      speechRun.current+=1;
      if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();
      setLanguage(l.code);
      setPaused(false);
      setFollow(true);
      const nextCanNarrate=Boolean(l.audioSrc)||(l.code==='en'&&speechSupported);
      if(wasStarted&&nextCanNarrate){
        const nextSections=l.sections;
        const nextIndex=Math.max(0,nextSections.findIndex(s=>s.id===sectionId));
        setActive(nextIndex);
        window.setTimeout(()=>center(nextSections[nextIndex].id),0);
      }else{
        setStarted(false);
        if(sectionId){const nextIndex=Math.max(0,l.sections.findIndex(s=>s.id===sectionId));setActive(nextIndex);window.setTimeout(()=>center(l.sections[nextIndex].id),0)}else setActive(0);
      }
    }}>{l.label}<small>{l.status}</small></button>)}</div>
    {!started?(canNarrate?<button className="samanthaPlay" onClick={()=>go(0)}>▶ LET SAMANTHA WALK ME THROUGH THIS SHOWROOM</button>:<div className="samanthaExplore"><b>EXPLORE THIS SHOWROOM</b><span>LOCAL GUIDED NARRATION WILL ACTIVATE AFTER LANGUAGE REVIEW.</span></div>):null}
    {current.audioSrc?<audio ref={audioRef} src={current.audioSrc} controls preload="metadata"/>:<div className="samanthaPending">{language==='en'?(!speechSupported?'DEVICE NARRATION · NOT AVAILABLE IN THIS BROWSER':voicesReady?`VOICE READY · ${voiceName||'BROWSER NARRATION'}`:'SAMANTHA VOICE · LOADING DEVICE VOICES'):'LOCAL NARRATION · PENDING LANGUAGE REVIEW'}</div>}
    <nav>{current.sections.map((s,i)=><button key={s.id} className={i===active?'active':''} onClick={()=>canNarrate?go(i):(setActive(i),setFollow(false),center(s.id))}><span>{s.number}</span><b>{s.title}</b></button>)}</nav>
    {started?<div className="samanthaControls"><button onClick={togglePause} disabled={!speechSupported&&!current.audioSrc}>{paused?'▶ RESUME':'Ⅱ PAUSE'}</button><button onClick={restart}>↺ RESTART</button></div>:null}
    {started?<div className="samanthaNow"><small>NOW EXPLAINING</small><b>{current.sections[active]?.title}</b><p>{current.sections[active]?.narration}</p>{!follow?<button onClick={()=>{setFollow(true);center(current.sections[active].id)}}>↳ RETURN TO SAMANTHA</button>:null}</div>:null}
    <style jsx>{`
      .samanthaGuide{position:fixed;left:14px;top:88px;z-index:900;width:250px;max-height:calc(100vh - 110px);overflow:auto;background:#061318f2;border:1px solid #d9b85a66;border-radius:14px;padding:13px;box-shadow:0 18px 60px #0009;color:#fff;font-family:Arial,sans-serif}
      .samanthaHead{display:flex;justify-content:space-between;align-items:end;border-bottom:1px solid #ffffff1f;padding-bottom:9px}.samanthaHead b{color:#f1cb73;font-size:13px}.samanthaHead span{font-size:7px;letter-spacing:.16em;color:#9bb0b9}
      .samanthaLanguages{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:10px 0}.samanthaLanguages button,.samanthaPlay,nav button,.samanthaNow button{cursor:pointer;border:1px solid #31505a;background:#0a2027;color:#dce8eb;border-radius:7px;padding:8px;font-weight:800}.samanthaLanguages button.on{border-color:#f1cb73;color:#f1cb73}.samanthaLanguages small{display:block;font-size:6px;margin-top:3px;color:#8fa5ad}.samanthaExplore{border:1px solid #31505a;border-radius:7px;padding:9px;text-align:center;margin-bottom:8px}.samanthaExplore b{display:block;color:#f1cb73;font-size:8px}.samanthaExplore span{display:block;color:#8fa5ad;font-size:6px;line-height:1.45;margin-top:4px}.samanthaPlay{width:100%;border-color:#f1cb73;color:#071719;background:#f1cb73;font-size:8px;letter-spacing:.05em}
      audio{width:100%;height:32px;margin:9px 0}.samanthaPending{font-size:7px;color:#8fa5ad;text-align:center;padding:9px;border:1px dashed #31505a;border-radius:6px;margin:9px 0}
      nav{display:grid;gap:5px}nav button{display:grid;grid-template-columns:28px 1fr;text-align:left;align-items:center;font-size:8px}nav button span{color:#6f8992;font-size:10px}nav button.active{border-color:#f1cb73;background:#f1cb7315}nav button.active span{color:#f1cb73}
      .samanthaControls{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}.samanthaControls button{cursor:pointer;border:1px solid #31505a;background:#0a2027;color:#dce8eb;border-radius:7px;padding:8px;font-size:7px;font-weight:900}.samanthaControls button:disabled{opacity:.45;cursor:not-allowed}.samanthaNow{margin-top:9px;border-top:1px solid #ffffff1f;padding-top:9px}.samanthaNow small{font-size:6px;color:#f1cb73}.samanthaNow b{display:block;font-size:10px;margin:4px 0}.samanthaNow p{font-size:8px;line-height:1.5;color:#aebfc5}
      :global(html[data-showroom-language="en"] .tp),:global(html[data-showroom-language="en"] .hm){display:none!important}
      :global(html[data-showroom-language="en"] .en){display:initial!important}
      :global(html[data-showroom-language="local"] .en){display:none!important}
      @media(max-width:900px){.samanthaGuide{position:relative;left:auto;top:auto;width:auto;max-height:none;margin:12px}.samanthaGuide nav{grid-template-columns:repeat(auto-fit,minmax(120px,1fr))}}
    `}</style>
  </aside>;
}
