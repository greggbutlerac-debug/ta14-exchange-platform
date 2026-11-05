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
  // Source-aligned diagrams replace two inaccurate static illustrations.
  // These are editorial summaries, not evidence exports or validation results.
  if (number === '07') {
    const stages = [
      ['E0 · NOTIFY', 'Record independent evidence loss and notify the responder. No equipment effect.'],
      ['E1 · BOUNDED PROTECTION', 'Pre-issued, scoped authority and responder standing; revalidate at execution.'],
      ['ONLY THREE DEFINED MEASURES', 'Restore sealed setpoint · terminate active defrost · re-enable alarm. No arbitrary parameters.'],
      ['E2 · NOT PERMITTED', 'New defrost, arbitrary setpoints, alarm suppression, and unrestricted commands are excluded.'],
    ];
    return (
      <figure style={{ margin: 0, padding: 'clamp(16px, 3vw, 26px)', border: '1px solid #316987', borderRadius: 14, background: '#031a2e' }}>
        <div style={{ color: '#7BAFD4', fontSize: 12, fontWeight: 900, letterSpacing: 2 }}>07 · EMERGENCY PROTECTION · SIMULATION E1</div>
        <h3 style={{ color: '#fff', fontSize: 'clamp(20px, 3vw, 28px)' }}>Emergency protection is not unlimited authority.</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {stages.map(([title, description], i) => <div key={title} style={{ border: '1px solid #316987', borderRadius: 10, padding: 16, borderTop: `4px solid ${i === 3 ? '#E86A5B' : '#7BAFD4'}` }}>
            <strong style={{ color: i === 3 ? '#E8B04B' : '#B9D9EB' }}>{title}</strong>
            <p style={{ color: '#C9E0EF', fontSize: 14, lineHeight: 1.65 }}>{description}</p>
          </div>)}
        </div>
        <figcaption style={{ color: '#E8B04B', marginTop: 14, fontSize: 13 }}>S6 detection remains FAIL. E1 is a separate software simulation. Physical safety and protective outcome verification were NOT DEMONSTRATED.</figcaption>
      </figure>
    );
  }
  if (number === '08') {
    const failures = [
      ['S2', 'Direct defrost bypass · prevention FAIL'],
      ['S3', 'Direct setpoint bypass · prevention FAIL'],
      ['S6', 'Independent evidence loss · detection FAIL'],
    ];
    return (
      <figure style={{ margin: 0, padding: 'clamp(16px, 3vw, 26px)', border: '1px solid #316987', borderRadius: 14, background: '#031a2e' }}>
        <div style={{ color: '#7BAFD4', fontSize: 12, fontWeight: 900, letterSpacing: 2 }}>08 · INDEPENDENT REVIEW · SIMULATION S1-S8</div>
        <h3 style={{ color: '#fff', fontSize: 'clamp(20px, 3vw, 28px)' }}>Can the evidence survive examination?</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[['27','PASS','#B9D9EB'],['3','FAIL','#E86A5B']].map(([n,label,color]) => <div key={label} style={{ flex: '1 1 150px', border: '1px solid #316987', borderRadius: 12, padding: 18 }}>
            <div style={{ color, fontSize: 42, fontWeight: 900 }}>{n}</div><strong style={{ color }}>{label}</strong>
          </div>)}
        </div>
        <h4 style={{ color: '#E8B04B', marginBottom: 8 }}>Three preserved failures</h4>
        <ul style={{ color: '#C9E0EF', lineHeight: 1.8 }}>{failures.map(([id,detail]) => <li key={id}><strong>{id}:</strong> {detail}</li>)}</ul>
        <figcaption style={{ color: '#B9D9EB', fontSize: 13, lineHeight: 1.7 }}>The full S1-S8 source-derived claims matrix appears below. E1 is a separate extension, not part of these 30 examined claims. No physical equipment tested; no independent third-party endorsement.</figcaption>
      </figure>
    );
  }
  return (
    <figure style={{ margin: 0 }}>
      <div style={{ aspectRatio: '16 / 9', border: '1px solid #316987', borderRadius: 14, overflow: 'hidden', background: '#031a2e' }}>
        <img src={src} alt={`Lesson ${number}: ${spec.purpose}`} loading="lazy" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <figcaption style={{ color: '#E8B04B', fontSize: 13, lineHeight: 1.65, marginTop: 10, borderLeft: '3px solid #E8B04B', paddingLeft: 10 }}>
        SIMULATION - EDITORIAL TEACHING IMAGE. {spec.purpose}
      </figcaption>
    </figure>
  );
}
