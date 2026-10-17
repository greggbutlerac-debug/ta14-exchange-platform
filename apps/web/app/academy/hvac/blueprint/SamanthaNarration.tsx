"use client";
import { useEffect, useRef, useState } from "react";

const START_EVENT = "ta14-samantha-start";

export default function SamanthaNarration({ number, title, script }: { number: string; title: string; script: string }) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(false);
  const activeUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const instanceId = useRef<string | null>(null);

  useEffect(() => {
    instanceId.current = "lesson-" + number + "-" + Math.random().toString(36).slice(2);
    const available = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setSupported(available);
    const onOtherStart = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== instanceId.current) {
        activeUtterance.current = null;
        setPlaying(false);
      }
    };
    window.addEventListener(START_EVENT, onOtherStart);
    return () => {
      window.removeEventListener(START_EVENT, onOtherStart);
      if (activeUtterance.current && available) window.speechSynthesis.cancel();
      activeUtterance.current = null;
    };
  }, [number]);

  function stop() {
    if (supported) window.speechSynthesis.cancel();
    activeUtterance.current = null;
    setPlaying(false);
  }

  function play() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    window.dispatchEvent(new CustomEvent(START_EVENT, { detail: instanceId.current }));
    const utterance = new SpeechSynthesisUtterance("Section " + number + ". " + title + ". " + script);
    activeUtterance.current = utterance;
    const voices = window.speechSynthesis.getVoices();
    const samantha = voices.find(v => /samantha/i.test(v.name) && /^en/i.test(v.lang));
    const englishUS = voices.find(v => /^en-US/i.test(v.lang));
    const english = voices.find(v => /^en/i.test(v.lang));
    const selected = samantha || englishUS || english;
    if (selected) utterance.voice = selected;
    utterance.lang = selected?.lang || "en-US";
    utterance.rate = 0.91;
    const finish = () => {
      if (activeUtterance.current === utterance) {
        activeUtterance.current = null;
        setPlaying(false);
      }
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    setPlaying(true);
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      finish();
    }
  }

  return <div className="samanthaNarration" aria-label={`Narration for image ${number}`}>
    <div><strong>SAMANTHA · AUDIO GUIDE {number}</strong><p>{script}</p><small>Voice depends on the voices available on your device. Written narration is always available.</small></div>
    <button type="button" aria-pressed={playing} onClick={playing ? stop : play} disabled={!supported}>{!supported ? "Audio unavailable" : playing ? "■ Stop narration" : "▶ Play narration"}</button>
    <style jsx>{`
      .samanthaNarration{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:20px 26px;background:#0a2b40;color:#fff}
      strong{font-size:.72rem;letter-spacing:.12em;color:#8ee4f2}p{font-size:.9rem;line-height:1.6;color:#d9edf3;margin:8px 0 0}
      small{display:block;margin-top:10px;font-size:.72rem;color:#b6d7e1}
      button{flex-shrink:0;padding:12px 17px;border:1px solid #7ad4e8;border-radius:9px;background:#e5f8fc;color:#06384b;font-weight:900;cursor:pointer}
      button:disabled{opacity:.55;cursor:not-allowed}
      @media(max-width:720px){.samanthaNarration{flex-direction:column;align-items:stretch}button{width:100%}}
    `}</style>
  </div>;
}
