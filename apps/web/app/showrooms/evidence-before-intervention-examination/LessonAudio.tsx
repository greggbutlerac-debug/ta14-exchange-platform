"use client";
import { useEffect, useRef, useState } from "react";

const START_EVENT = "ta14-samantha-start";

export default function LessonAudio({number,title,script}:{number:number;title:string;script:string}) {
  const [supported,setSupported] = useState(false);
  const [playing,setPlaying] = useState(false);
  const id = useRef("hvac-examination-" + number);
  const utterance = useRef<SpeechSynthesisUtterance|null>(null);
  const generation = useRef(0);

  useEffect(() => {
    const available = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setSupported(available);
    const otherStarted = (event:Event) => {
      if ((event as CustomEvent<string>).detail !== id.current) {
        generation.current++;
        utterance.current = null;
        setPlaying(false);
      }
    };
    window.addEventListener(START_EVENT,otherStarted);
    return () => {
      window.removeEventListener(START_EVENT,otherStarted);
      if (utterance.current && available) window.speechSynthesis.cancel();
      utterance.current = null;
      generation.current++;
    };
  },[]);

  const stop = () => {
    generation.current++;
    window.speechSynthesis.cancel();
    utterance.current = null;
    setPlaying(false);
  };

  const play = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    window.dispatchEvent(new CustomEvent(START_EVENT,{detail:id.current}));
    const thisRun = ++generation.current;
    setPlaying(true);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v=>/samantha/i.test(v.name) && /^en/i.test(v.lang))
      || voices.find(v=>/^en-US/i.test(v.lang)) || voices.find(v=>/^en/i.test(v.lang));
    const paragraphs = script.split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean);
    const segments = [`Lesson ${number}. ${title}.`,...paragraphs];
    let index = 0;
    const speakNext = () => {
      if (generation.current !== thisRun) return;
      if (index >= segments.length) {
        utterance.current = null;
        setPlaying(false);
        return;
      }
      const next = new SpeechSynthesisUtterance(segments[index++]);
      utterance.current = next;
      if (voice) next.voice = voice;
      next.lang = voice?.lang || "en-US";
      next.rate = 0.91;
      next.onend = speakNext;
      next.onerror = () => {
        if (generation.current === thisRun) {
          utterance.current = null;
          setPlaying(false);
        }
      };
      try { window.speechSynthesis.speak(next); }
      catch { next.onerror?.(new Event("error") as SpeechSynthesisErrorEvent); }
    };
    speakNext();
  };

  return (
    <div aria-label={`Samantha audio guide for lesson ${number}`} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap",padding:"13px 18px",background:"#0a2b40",color:"#fff",borderRadius:12,margin:"10px 0 20px"}}>
      <div><strong style={{fontSize:13,letterSpacing:".08em"}}>SAMANTHA · AUDIO GUIDE {String(number).padStart(2,"0")}</strong><div style={{fontSize:12,color:"#c6e4ee"}}>Listen to the complete explanation of this image</div></div>
      <button type="button" onClick={playing?stop:play} aria-pressed={playing} disabled={!supported} style={{padding:"11px 16px",background:"#e5f8fc",color:"#06384b",border:"1px solid #7ad4e8",borderRadius:9,fontWeight:800,cursor:supported?"pointer":"not-allowed"}}>
        {!supported?"Audio unavailable":playing?"■ Stop narration":"▶ Play narration"}
      </button>
      <small style={{width:"100%",fontSize:11,color:"#c6e4ee"}}>Voice depends on the English voices installed on your device. The full written narration appears below.</small>
    </div>
  );
}
