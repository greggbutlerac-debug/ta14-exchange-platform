'use client';
import { useEffect, useState } from 'react';

export default function SpokenNarration({ latvian, english }: { latvian: string; english: string }) {
  const [active, setActive] = useState<'lv' | 'en' | null>(null);
  const [message, setMessage] = useState('');
  useEffect(() => () => { if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);
  function speak(language: 'lv' | 'en') {
    if (!('speechSynthesis' in window)) { setMessage('Audio playback is not supported in this browser.'); return; }
    const engine = window.speechSynthesis;
    engine.cancel();
    if (active === language) { setActive(null); setMessage(''); return; }
    const code = language === 'lv' ? 'lv-LV' : 'en-US';
    const voices = engine.getVoices();
    const voice = voices.find(v => v.lang.toLowerCase() === code.toLowerCase()) || voices.find(v => v.lang.toLowerCase().startsWith(language));
    if (!voice && language === 'lv') {
      setMessage('Latvian speech voice is unavailable on this device. Try a browser or device with a Latvian voice installed.');
      setActive(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(language === 'lv' ? latvian : english);
    utterance.lang = code;
    if (voice) utterance.voice = voice;
    utterance.rate = 0.92;
    utterance.onend = () => setActive(null);
    utterance.onerror = () => { setActive(null); setMessage('Audio could not play. Try again or use another browser.'); };
    setMessage('');
    setActive(language);
    engine.speak(utterance);
  }
  return <div aria-label="Samantha audio narration" style={{display:'flex',flexWrap:'wrap',gap:10,alignItems:'center',margin:'12px 0 18px'}}>
    <button type="button" onClick={() => speak('en')} aria-label="Play Samantha narration in English" style={{cursor:'pointer',padding:'11px 16px',borderRadius:9,border:'1px solid #8da4b5',background:'#17364b',color:'#fff',fontWeight:700}}>{active==='en'?'■ Stop English':'▶ Samantha · English'}</button>
    <button type="button" onClick={() => speak('lv')} aria-label="Play Samantha narration in Latvian" style={{cursor:'pointer',padding:'11px 16px',borderRadius:9,border:'1px solid #8da4b5',background:'#17364b',color:'#fff',fontWeight:700}}>{active==='lv'?'■ Apturēt latviski':'▶ Samanta · Latviešu'}</button>
    <small style={{width:'100%',opacity:.75}}>Spoken using your device's available voices. Latvian playback requires a Latvian voice.</small>
    {message && <small role="status" style={{width:'100%',color:'#b94a32'}}>{message}</small>}
  </div>;
}
