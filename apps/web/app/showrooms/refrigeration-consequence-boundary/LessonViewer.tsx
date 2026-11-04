'use client';

/*
 * Lesson viewer with Samantha narration (browser speechSynthesis, preferring the "Samantha" voice,
 * the pattern of LessonVisualSamantha). Narration sits outside the teaching image; there is no
 * overlay. Autoplay progression is opt-in and starts only after the visitor presses play, because
 * browsers allow speech only after a user gesture. Speech availability depends on the visitor's
 * browser and installed voices.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Lesson } from './lessons';

const btn: React.CSSProperties = { minHeight: 44, padding: '10px 14px', borderRadius: 10, border: '1px solid #7BAFD4', background: '#031a2e', color: '#C9E0EF', fontWeight: 800, cursor: 'pointer' };

export function LessonViewer({ lessons, figures }: { lessons: Lesson[]; figures: Record<string, ReactNode> }) {
  const [index, setIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [explain, setExplain] = useState(false);
  const [active, setActive] = useState(-1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [supported, setSupported] = useState<boolean | null>(null);
  const continueRef = useRef(false);
  const lesson = lessons[index];
  const words = useMemo(() => [...lesson.narration.matchAll(/\S+/g)].map((m) => ({ word: m[0], start: m.index ?? 0 })), [lesson.narration]);

  useEffect(() => {
    const ok = typeof window !== 'undefined' && 'speechSynthesis' in window;
    setSupported(ok);
    if (!ok) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => { window.speechSynthesis.cancel(); window.speechSynthesis.removeEventListener('voiceschanged', load); };
  }, []);

  useEffect(() => {
    const fromHash = lessons.findIndex((l) => `#lesson-${l.number}` === window.location.hash);
    if (fromHash >= 0) setIndex(fromHash);
  }, [lessons]);

  const stop = useCallback(() => { if (supported) window.speechSynthesis.cancel(); setSpeaking(false); setPaused(false); setActive(-1); }, [supported]);

  const speak = useCallback((i: number) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const text = lessons[i].narration;
    const wordStarts = [...text.matchAll(/\S+/g)].map((m) => m.index ?? 0);
    const u = new SpeechSynthesisUtterance(text);
    const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    const voice = en.find((v) => v.name === 'Samantha') ?? en.find((v) => v.lang === 'en-US') ?? en[0];
    if (voice) u.voice = voice;
    u.lang = 'en-US'; u.rate = 0.8; u.pitch = 0.95;
    u.onboundary = (e) => { if (e.name !== 'word') return; let z = 0; for (let k = 0; k < wordStarts.length; k++) { if (wordStarts[k] <= e.charIndex) z = k; else break; } setActive(z); };
    u.onend = () => { setSpeaking(false); setPaused(false); setActive(-1); if (continueRef.current && i < lessons.length - 1) { setIndex(i + 1); setTimeout(() => speak(i + 1), 900); } };
    setSpeaking(true); setPaused(false);
    window.speechSynthesis.speak(u);
  }, [lessons, supported, voices]);

  useEffect(() => { continueRef.current = autoplay; }, [autoplay]);

  const go = (i: number) => { stop(); setExplain(false); setIndex(i); history.replaceState(null, '', `#lesson-${lessons[i].number}`); };
  const toggle = () => { if (!speaking) return speak(index); if (paused) { window.speechSynthesis.resume(); setPaused(false); } else { window.speechSynthesis.pause(); setPaused(true); } };

  return (
    <section id="lessons" aria-label="Eight lessons" style={{ margin: '0 0 32px' }}>
      <nav aria-label="Lesson list" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {lessons.map((l, i) => <button key={l.number} onClick={() => go(i)} aria-current={i === index ? 'step' : undefined} style={{ ...btn, minWidth: 48, background: i === index ? '#7BAFD4' : '#031a2e', color: i === index ? '#001426' : '#C9E0EF' }}>{l.number}</button>)}
      </nav>
      <article id={`lesson-${lesson.number}`} style={{ padding: 'clamp(14px, 3vw, 24px)', border: '1px solid #285b78', borderRadius: 18, background: 'linear-gradient(145deg,#062945,#041e35)' }}>
        <small style={{ color: '#7BAFD4', fontWeight: 900, letterSpacing: 1 }}>LESSON {lesson.number} OF 08 · SIMULATION</small>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 4vw, 34px)', margin: '6px 0 16px' }}>{lesson.number} — {lesson.title}</h2>

        <ImageSlot spec={lesson.image} number={lesson.number} />
        {figures[lesson.number] && <div style={{ marginTop: 16 }}>{figures[lesson.number]}</div>}

        <div style={{ marginTop: 16, padding: 16, border: '1px solid #316987', borderRadius: 14, background: '#031a2e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div><b style={{ color: '#B9D9EB' }}>🎧 SAMANTHA · GUIDED NARRATION</b><div style={{ color: '#89A9BF', fontSize: 12, marginTop: 4 }}>{supported === false ? 'Speech is not available in this browser. The narration text is below.' : 'Browser speech. Voice availability varies by device.'}</div></div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={toggle} disabled={supported === false} style={btn} aria-label={!speaking ? 'Play narration' : paused ? 'Resume narration' : 'Pause narration'}>{!speaking ? '▶ PLAY' : paused ? '▶ RESUME' : 'Ⅱ PAUSE'}</button>
              <button onClick={() => speak(index)} disabled={supported === false} style={btn}>↻ RESTART</button>
              {speaking && <button onClick={stop} style={btn}>■ STOP</button>}
              <label style={{ ...btn, display: 'inline-flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} /> AUTOPLAY NEXT</label>
            </div>
          </div>
          <p style={{ color: '#C9E0EF', lineHeight: 1.9, fontSize: 16, marginBottom: 0 }}>{words.map((w, i) => <span key={i} style={{ background: active === i ? '#2d6c8a' : 'transparent', color: active === i ? '#fff' : undefined, borderRadius: 3 }}>{w.word} </span>)}</p>
        </div>

        <div style={{ marginTop: 14 }}>
          <button onClick={() => setExplain((v) => !v)} aria-expanded={explain} aria-controls={`explain-${lesson.number}`} style={btn}>{explain ? '− HIDE EXPLANATION' : '+ EXPLAIN'}</button>
          {explain && <div id={`explain-${lesson.number}`} style={{ marginTop: 10, padding: 16, borderLeft: '4px solid #B9D9EB', background: '#031a2e' }}>
            <ul style={{ color: '#C9E0EF', lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>{lesson.explain.map((e) => <li key={e}>{e}</li>)}</ul>
          </div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginTop: 14 }}>
          <div style={{ padding: 14, border: '1px solid #316987', borderRadius: 12 }}><b style={{ color: '#7BAFD4', fontSize: 12 }}>ARCHITECTURAL INTENT</b><p style={{ color: '#C9E0EF', lineHeight: 1.7, marginBottom: 0 }}>{lesson.intent}</p></div>
          <div style={{ padding: 14, border: '1px solid #E8B04B', borderRadius: 12 }}><b style={{ color: '#E8B04B', fontSize: 12 }}>DEMONSTRATED IN SIMULATION</b><p style={{ color: '#C9E0EF', lineHeight: 1.7, marginBottom: 0 }}>{lesson.demonstrated}</p></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
          <button onClick={() => go(index - 1)} disabled={index === 0} style={{ ...btn, opacity: index === 0 ? 0.4 : 1 }}>← PREVIOUS</button>
          <button onClick={() => go(index + 1)} disabled={index === lessons.length - 1} style={{ ...btn, opacity: index === lessons.length - 1 ? 0.4 : 1 }}>NEXT →</button>
        </div>
      </article>
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
