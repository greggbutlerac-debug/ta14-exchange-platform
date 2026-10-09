"use client";
import { useEffect, useState } from "react";

export default function SamanthaNarration({ number, title, script }: { number: string; title: string; script: string }) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => { if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); };
  }, []);
  function stop() {
    window.speechSynthesis.cancel();
    setPlaying(false);
  }
  function play() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Section " + number + ". " + title + ". " + script);
    const voices = window.speechSynthesis.getVoices();
    const samantha = voices.find(v => /samantha/i.test(v.name) && /^en/i.test(v.lang));
    const fallback = voices.find(v => /^en-US/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
    if (samantha || fallback) utterance.voice = samantha || fallback || null;
    utterance.rate = 0.91;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  }
  return <div className="samanthaNarration" aria-label={`Narration for image ${number}`}>
    <div><strong>SAMANTHA · AUDIO GUIDE {number}</strong><p>{script}</p></div>
    <button type="button" onClick={playing ? stop : play} disabled={!supported}>{!supported ? "Audio unavailable" : playing ? "■ Stop Samantha" : "▶ Play Samantha"}</button>
    <style jsx>{`
      .samanthaNarration{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:20px 26px;background:#0a2b40;color:#fff}
      strong{font-size:.72rem;letter-spacing:.12em;color:#8ee4f2}p{font-size:.9rem;line-height:1.6;color:#d9edf3;margin:8px 0 0}
      button{flex-shrink:0;padding:12px 17px;border:1px solid #7ad4e8;border-radius:9px;background:#e5f8fc;color:#06384b;font-weight:900;cursor:pointer}
      button:disabled{opacity:.55;cursor:not-allowed}
      @media(max-width:720px){.samanthaNarration{flex-direction:column;align-items:stretch}button{width:100%}}
    `}</style>
  </div>;
}
