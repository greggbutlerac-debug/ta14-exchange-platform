'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Lesson } from './lessons';

const btn: React.CSSProperties = { minHeight: 44, padding: '10px 14px', borderRadius: 10, border: '1px solid #7BAFD4', background: '#031a2e', color: '#C9E0EF', fontWeight: 800, cursor: 'pointer' };

export function LessonViewer({ lessons, figures }: { lessons: Lesson[]; figures: Record<string, ReactNode> }) {
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => {
    const ok = typeof window !== 'undefined' && 'speechSynthesis' in window;
    setSupported(ok);
    if (!ok) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => { window.speechSynthesis.cancel(); window.speechSynthesis.removeEventListener('voiceschanged', load); };
  }, []);
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    utteranceRef.current = null; setSpeaking(null); setPaused(false);
  }, []);
  const play = useCallback((lesson: Lesson) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(lesson.narration);
    const english = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
    const voice = english.find(v => v.name === 'Samantha') ?? english.find(v => v.lang === 'en-US') ?? english[0];
    if (voice) u.voice = voice;
    u.lang = 'en-US'; u.rate = 0.8; u.pitch = 0.95;
    u.onend = () => { if (utteranceRef.current === u) { setSpeaking(null); setPaused(false); utteranceRef.current = null; } };
    u.onerror = () => { if (utteranceRef.current === u) { setSpeaking(null); setPaused(false); utteranceRef.current = null; } };
    utteranceRef.current = u; setSpeaking(lesson.number); setPaused(false);
    window.speechSynthesis.speak(u);
  }, [supported, voices]);
  const toggle = (lesson: Lesson) => {
    if (speaking !== lesson.number) { play(lesson); return; }
    if (paused) { window.speechSynthesis.resume(); setPaused(false); }
    else { window.speechSynthesis.pause(); setPaused(true); }
  };
  return (
    <section id="lessons" aria-label="Eight sequential teaching lessons" style={{ margin: '0 0 36px' }}>
      <div style={{ marginBottom: 22, padding: 18, border: '1px solid #316987', borderRadius: 14, background: '#031a2e' }}>
        <h2 style={{ color: '#fff', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>Eight lessons · one continuous teaching experience</h2>
        <p style={{ color: '#C9E0EF', lineHeight: 1.7, margin: 0 }}>Scroll to see every teaching image in order. Samantha's spoken explanation, the evidence-based learning summary, and the next lesson preview are visible beneath each image. No lesson selection or explanation button is required.</p>
      </div>
      {lessons.map((lesson, index) => (
        <article key={lesson.number} id={`lesson-${lesson.number}`} style={{ padding: 'clamp(14px, 3vw, 24px)', border: '1px solid #285b78', borderRadius: 18, background: 'linear-gradient(145deg,#062945,#041e35)', marginBottom: 28 }}>
          <small style={{ color: '#7BAFD4', fontWeight: 900, letterSpacing: 1 }}>LESSON {lesson.number} OF 08 · SIMULATION</small>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 4vw, 34px)', margin: '6px 0 16px', color: '#fff' }}>{lesson.number} — {lesson.title}</h2>
          <ImageSlot spec={lesson.image} number={lesson.number} />
          {figures[lesson.number] && <div style={{ marginTop: 16 }}>{figures[lesson.number]}</div>}
          <section aria-label={`Samantha narration for lesson ${lesson.number}`} style={{ marginTop: 18, padding: 18, border: '1px solid #316987', borderRadius: 14, background: '#031a2e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div><strong style={{ color: '#B9D9EB' }}>🎧 SAMANTHA · TEACHING NARRATION</strong><div style={{ color: '#89A9BF', fontSize: 12, marginTop: 4 }}>{supported === false ? 'Audio unavailable in this browser; full narration remains readable.' : 'Press Play to hear the lesson. Samantha voice is preferred when installed.'}</div></div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" disabled={supported === false} onClick={() => toggle(lesson)} style={btn}>{speaking !== lesson.number ? '▶ PLAY' : paused ? '▶ RESUME' : 'Ⅱ PAUSE'}</button>
                <button type="button" disabled={supported === false} onClick={() => play(lesson)} style={btn}>↻ RESTART</button>
                {speaking === lesson.number && <button type="button" onClick={stop} style={btn}>■ STOP</button>}
              </div>
            </div>
            <p style={{ color: '#C9E0EF', lineHeight: 1.9, fontSize: 16, marginBottom: 0, whiteSpace: 'pre-wrap' }}>{lesson.narration}</p>
          </section>
          <section style={{ marginTop: 18, padding: 18, borderLeft: '4px solid #7BAFD4', background: '#031a2e', borderRadius: 10 }}>
            <h3 style={{ color: '#B9D9EB', margin: '0 0 12px' }}>WHAT YOU JUST LEARNED</h3>
            <p style={{ color: '#C9E0EF', lineHeight: 1.75 }}><strong>Architectural intent:</strong> {lesson.intent}</p>
            <p style={{ color: '#C9E0EF', lineHeight: 1.75 }}><strong>Demonstrated in simulation:</strong> {lesson.demonstrated}</p>
            <ul style={{ color: '#C9E0EF', lineHeight: 1.85, paddingLeft: 22, marginBottom: 0 }}>{lesson.explain.map((item, i) => <li key={i}>{item}</li>)}</ul>
          </section>
          <section style={{ marginTop: 16, padding: 18, border: '1px solid #E8B04B', borderRadius: 12 }}>
            <h3 style={{ color: '#E8B04B', margin: '0 0 8px' }}>WHAT YOU'RE ABOUT TO LEARN</h3>
            {index < lessons.length - 1 ? <p style={{ color: '#C9E0EF', lineHeight: 1.75, margin: 0 }}>Next, lesson {lessons[index + 1].number}: <strong>{lessons[index + 1].title}</strong>. {lessons[index + 1].intent}</p> : <p style={{ color: '#C9E0EF', lineHeight: 1.75, margin: 0 }}>You've completed all eight teaching images. Next, examine the interactive simulated scenarios, the evidence records, and the independent review challenge below.</p>}
          </section>
        </article>
      ))}
    </section>
  );
}

/** Static teaching illustration. The underlying examination data and charts remain authoritative. */
function ImageSlot({ spec, number }: { spec: Lesson['image']; number: string }) {
  const src = '/'+encodeURIComponent(spec.filename);
  // Show the supplied lesson artwork for every lesson, including 07 and 08.
  // The original artwork contains known technical inaccuracies; keep explicit
  // disclosures and the source-derived simulation/claims matrix as authoritative.
  return (
    <figure style={{ margin: 0 }}>
      <div style={{ aspectRatio: '16 / 9', border: '1px solid #316987', borderRadius: 14, overflow: 'hidden', background: '#031a2e' }}>
        <img src={src} alt={`Lesson ${number}: ${spec.purpose}`} loading="lazy" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <figcaption style={{ color: '#E8B04B', fontSize: 13, lineHeight: 1.65, marginTop: 10, borderLeft: '3px solid #E8B04B', paddingLeft: 10 }}>
        SIMULATION - EDITORIAL TEACHING IMAGE. {spec.purpose}{number === '08' ? ' CAUTION: The artwork summarizes whole scenarios, not individual capability claims. It simplifies some scenario examples; the live claims matrix and records below control.' : ''}
      </figcaption>
    </figure>
  );
}
