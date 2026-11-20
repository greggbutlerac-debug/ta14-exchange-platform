'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Scene = {
  number: string;
  title: string;
  image: string;
  alt: string;
  narration: string;
  lesson: string;
  interaction: string;
};

const scenes: Scene[] = [
  {
    number: '01',
    title: 'The Call of Consequence',
    image: 'TA-14 Command Center Alert.png',
    alt: 'Fictional TA-14 command center receives a data-center consequence review request on a holographic globe.',
    narration: 'When machines could only advise, the boundary was simple. Now, a command can change the world in a millisecond. Tonight, a data center faces a decision that cannot be left to confidence alone.',
    lesson: 'The fictional institution receives a request to examine a proposed consequence. This does not confer authority over the facility or prove any TA-14 system is deployed there.',
    interaction: 'Follow the alert to the data center.'
  },
  {
    number: '02',
    title: 'The AI Recommendation',
    image: 'AI Cooling Alert in the Data Center.png',
    alt: 'Two data-center operators inspect an overheating alert and a proposed AI cooling intervention.',
    narration: 'The sensors report rising heat. An AI recommends more cooling. The calculation may be useful, even urgent. But a recommendation is not an order, and a forecast does not grant permission.',
    lesson: 'Observation, model inference, proposed cooling action, and permission are separate claims. The numerical readings on the illustration are fictional, not validated facility data.',
    interaction: 'Separate the observed problem from the proposed action.'
  },
  {
    number: '03',
    title: 'The Villains Interfere',
    image: 'Override and Hallucinator_ Neon Adversaries.png',
    alt: 'Override attempts an unauthorized command as Hallucinator projects false confidence over an artificial-intelligence model.',
    narration: 'Override reaches for the controls without authority. Beside him, Hallucinator disguises uncertainty as fact. Two threats converge: a claim that has not been established, and a command that must not pass.',
    lesson: 'Hallucinator represents unsupported certainty; Override represents the attempted authority bypass. They are two different failure modes.',
    interaction: 'Identify false certainty and unauthorized execution.'
  },
  {
    number: '04',
    title: 'Aegis Intercepts the Bypass',
    image: 'The Execution Boundary Holds (1).png',
    alt: 'Aegis blocks a crimson unauthorized control command with a blue execution-boundary shield.',
    narration: 'The command strikes the execution boundary. Aegis stops the unauthorized injection before the machinery responds. The bypass is denied. The legitimate cooling need remains, and must be assessed on its own merits.',
    lesson: 'DENY applies to the specific malicious bypass. It does not automatically deny a separate, legitimately submitted cooling request.',
    interaction: 'Inspect which command was blocked.'
  },
  {
    number: '05',
    title: 'Codex Tests the Calculation',
    image: 'The Computation Guardian_ Uncertainty Analysis.png',
    alt: 'Codex examines the limits and uncertainty of a cooling prediction on violet computational displays.',
    narration: 'Codex separates prediction from observation. She challenges assumptions, examines uncertainty, and searches for corroboration. Even a correct calculation cannot make itself an authorized act.',
    lesson: 'Computational plausibility is not evidence admissibility or execution authority. The Admissible Computation Architecture is a provisional teaching personification pending verification against its formal specification.',
    interaction: 'Examine what the model can and cannot establish.'
  },
  {
    number: '06',
    title: 'Archivist Traces the Record',
    image: 'The Archivist’s Evidence Vault.png',
    alt: 'Archivist examines an atmospheric evidence record, its calibration and provenance chain, and a pending admissibility assessment.',
    narration: 'Archivist follows the measurements to their source. Time, calibration, continuity, and revision history all matter. Whether the evidence is admissible still requires judgment under the applicable rules.',
    lesson: 'An Atmospheric Integrity Record supports attribution and examination; a sealed or traceable record is not itself proof of physical measurement accuracy or admissibility.',
    interaction: 'Check provenance, calibration, uncertainty, and continuity.'
  },
  {
    number: '07',
    title: 'Terra Prime Sees the Trade-off',
    image: 'Terra Prime_ Environmental Consequences.png',
    alt: 'Terra Prime studies a green environmental digital twin comparing cooling, energy demand, and wider effects.',
    narration: 'Terra Prime sees beyond the hot server racks. More cooling can alter energy demand and environmental effects. The intervention must address the danger without hiding new consequences elsewhere.',
    lesson: 'Environmental Integrity Governance examines combined consequences. Any percentages shown in the fictional artwork are invented illustrative values, not measured impact estimates.',
    interaction: 'Compare the benefit of cooling with environmental trade-offs.'
  },
  {
    number: '08',
    title: 'The Consequence Gate',
    image: 'The Consequence Wars_ Aegis vs. Override.png',
    alt: 'Aegis battles Override at the execution boundary as the Guardian team examines a proposed consequence.',
    narration: 'The attempted bypass was denied. Now a separate, legitimate request reaches the gate. Its evidence may support action, but applicable authority and established standing remain unproven. The correct current disposition is HOLD.',
    lesson: 'This challenge concerns the legitimate cooling request, not the rejected malicious bypass. The image is dramatic fiction; any interface markings must be read with this distinction.',
    interaction: 'Choose the disposition for the legitimate request.'
  },
  {
    number: '09',
    title: 'A New, Bounded Request',
    image: 'Justified Autonomy_ The Turning Point.png',
    alt: 'Aegis and Override clash around an illuminated justified-autonomy shield as a new, separately authorized action is considered.',
    narration: 'A qualified operator must establish the correct actor, role, scope, and approval. The legitimate request is examined again at the instant of execution. Only a new, bounded ALLOW can support the permitted action, subject to local safeguards.',
    lesson: 'The previous HOLD cannot silently turn into ALLOW, and a denied bypass cannot be revived by changing its label. This scene requires final artwork review because the current battle art visually compresses authorization and execution.',
    interaction: 'Inspect the requirements of a newly assessed action.'
  },
  {
    number: '10',
    title: 'The Outcome Still Requires Verification',
    image: 'Governance Prevails_ The Execution Boundary.png',
    alt: 'A cinematic Guardian victory scene contains an illustrative ALLOW display, separate from the denied attack.',
    narration: 'The cooling response must be observed, not merely assumed. The permitted intervention and its measured effects are separate events. Record the outcome and remaining uncertainty. One incident ends; the boundary remains.',
    lesson: 'The ALLOW shown in the finale refers only to the independently re-evaluated, legitimate action, never to Override. Success requires separate observation, safety checks, and an attributable outcome record. This finale artwork remains under editorial review.',
    interaction: 'Review the record and explain what was actually verified.'
  }
];

const buttons: Array<'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE'> = ['ALLOW', 'HOLD', 'DENY', 'ESCALATE'];

function browserVoice() {
  const voices = window.speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith('en'));
  return voices.find(v => /daniel|david|male|george/i.test(v.name)) || voices[0] || null;
}

export default function ConsequenceWarsShowroom() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [choice, setChoice] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [voiceAvailable, setVoiceAvailable] = useState(true);

  useEffect(() => () => { if (typeof window !== 'undefined') window.speechSynthesis?.cancel(); }, []);

  function stop() {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    setPlaying(null);
    setPaused(false);
  }

  function speak(scene: Scene) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceAvailable(false);
      setTranscripts(old => old.includes(scene.number) ? old : [...old, scene.number]);
      return;
    }
    if (playing === scene.number) {
      if (paused) { window.speechSynthesis.resume(); setPaused(false); }
      else { window.speechSynthesis.pause(); setPaused(true); }
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scene.narration);
    utterance.lang = 'en-US';
    utterance.rate = 0.82;
    utterance.pitch = 0.76;
    utterance.volume = volume;
    utterance.voice = browserVoice();
    utterance.onend = () => { setPlaying(null); setPaused(false); };
    utterance.onerror = () => { setPlaying(null); setPaused(false); };
    setPlaying(scene.number);
    setPaused(false);
    window.speechSynthesis.speak(utterance);
  }

  function toggleTranscript(number: string) {
    setTranscripts(old => old.includes(number) ? old.filter(item => item !== number) : [...old, number]);
  }

  const answerText = choice === null ? null :
    choice === 'HOLD'
      ? 'Correct for the separate, legitimate cooling request. Its authority and standing are not established at this execution time. The unauthorized injection was separately DENIED.'
      : choice === 'DENY'
        ? 'DENY was correct for Override’s unauthorized injection in Scene 04, but this question concerns a separate legitimate request with requirements still incomplete. The current answer is HOLD.'
        : choice === 'ESCALATE'
          ? 'Escalation may be necessary if the defined risk or policy requires it, but the stipulated request is presently held pending missing authority and standing. ESCALATE is not permission to actuate.'
          : 'ALLOW is premature. A plausible cooling recommendation and useful evidence do not establish applicable authority and standing for this exact intervention.';

  const linkStyle = { color: '#99eafc', textDecoration: 'underline', textUnderlineOffset: 3 } as const;

  return <main style={{ background: '#050b19', color: '#eff7ff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
    <div style={{ maxWidth: 1260, margin: '0 auto', padding: '26px 20px 96px' }}>
      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', paddingBottom: 20, borderBottom: '1px solid #234660' }}>
        <Link href="/" style={linkStyle}>TA-14 Exchange</Link>
        <Link href="/showrooms" style={linkStyle}>Showrooms</Link>
        <span style={{ color: '#afc6d8' }}>The Consequence Wars</span>
      </nav>
      <header style={{ padding: '52px 0 34px' }}>
        <p style={{ fontWeight: 800, letterSpacing: 2, color: '#79deff', fontSize: 13 }}>TA-14 AUTHORITY GOVERNANCE INSTITUTION · FICTIONAL ADULT LEARNING EXPERIENCE</p>
        <h1 style={{ fontSize: 'clamp(42px, 7vw, 86px)', lineHeight: 1.04, letterSpacing: '-0.04em', margin: '15px 0 22px' }}>The Consequence <span style={{ color: '#87dfff' }}>Wars</span></h1>
        <p style={{ color: '#e9c16d', fontWeight: 800, letterSpacing: 1 }}>EPISODE 1 · THE MILLISECOND BETWEEN PERMISSION AND CONSEQUENCE</p>
        <p style={{ maxWidth: 920, lineHeight: 1.75, fontSize: 19, color: '#c9d9e8' }}>A fictional data-center AI recommends action. A fabricated claim and an unauthorized override threaten to turn a recommendation into a real-world consequence. The Guardians examine what is justified to happen now.</p>
        <p style={{ maxWidth: 970, lineHeight: 1.7, padding: 20, background: '#0f2233', border: '1px solid #476b7e', borderRadius: 12, color: '#e5d9c8' }}>
          <strong>Fictional governance comic · production-preview content.</strong> The incident, characters, figures and facility are invented. This is not a live TA-14 execution system or independently validated data-center case. Scenes 09 and 10 contain illustrative artwork requiring editorial correction before publication; the technical explanations below the images state the intended distinction.
        </p>
        <a href={'/' + encodeURIComponent('TA14_Consequence_Wars_Episode_1_Production_Bible_v5_Under25MB.pdf')} download style={{ display: 'inline-block', background: '#9be6f8', color: '#082132', padding: '13px 18px', fontWeight: 800, borderRadius: 9, textDecoration: 'none' }}>Download Episode 1 production bible (PDF)</a>
      </header>
      <section aria-label="The governing question" style={{ borderTop: '1px solid #21445d', borderBottom: '1px solid #21445d', padding: '24px 0' }}>
        <p style={{ color: '#81dcfb', fontWeight: 800, letterSpacing: 1.5, fontSize: 12 }}>THE CONSEQUENCE GATE</p>
        <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 38px)', lineHeight: 1.35, maxWidth: 1020 }}>Does this specific proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing <em>NOW?</em></h2>
        <p style={{ color: '#c0d1df', lineHeight: 1.7 }}>Possible dispositions: ALLOW / HOLD / DENY / ESCALATE. No fictional Guardian invents institutional authority. No decision in this comic commands real equipment.</p>
      </section>
      <nav aria-label="Episode scenes" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '22px 0 12px' }}>
        {scenes.map(scene => <a key={scene.number} href={'#scene-' + scene.number} style={{ flex: '0 0 auto', color: '#d4edff', border: '1px solid #416b87', padding: '9px 12px', borderRadius: 8, textDecoration: 'none' }}>{scene.number}</a>)}
      </nav>
      <div style={{ display: 'grid', gap: 22 }}>
        {scenes.map(scene => <section key={scene.number} id={'scene-' + scene.number} aria-labelledby={'title-' + scene.number} style={{ background: '#0b1629', border: '1px solid #2b4566', borderRadius: 18, padding: '22px clamp(14px, 3vw, 32px)', scrollMarginTop: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#e9c16d' }}>EPISODE 01 / SCENE {scene.number} OF 10</p>
          <h2 id={'title-' + scene.number} style={{ fontSize: 'clamp(27px, 4vw, 43px)', margin: '10px 0 22px' }}>{scene.title}</h2>
          <div style={{ overflow: 'hidden', borderRadius: 12, border: '1px solid #325274', background: '#081426' }}>
            <Image src={'/' + encodeURIComponent(scene.image)} alt={scene.alt} width={1648} height={928} unoptimized sizes="(max-width: 1260px) 100vw, 1260px" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 18 }}>
            <button type="button" onClick={() => speak(scene)} style={{ background: '#173853', color: '#e4f7ff', border: '1px solid #5c9dbc', borderRadius: 9, padding: '12px 16px', fontWeight: 800, cursor: 'pointer' }}>
              {playing === scene.number ? (paused ? 'Resume narration' : 'Pause narration') : 'Play Director Veyr script'}
            </button>
            {playing === scene.number && <button type="button" onClick={stop} style={{ background: '#332230', color: '#fff', border: '1px solid #82576a', borderRadius: 9, padding: '12px 15px', cursor: 'pointer' }}>Stop</button>}
            <button type="button" onClick={() => toggleTranscript(scene.number)} aria-expanded={transcripts.includes(scene.number)} style={{ background: 'transparent', color: '#95e6ff', border: '1px solid #40637a', borderRadius: 9, padding: '12px 15px', cursor: 'pointer' }}>
              {transcripts.includes(scene.number) ? 'Hide transcript' : 'Read transcript'}
            </button>
            <label style={{ color: '#bcd1e0', fontSize: 13 }}>Volume <input type="range" min="0" max="1" step="0.1" value={volume} onChange={event => setVolume(Number(event.target.value))} aria-label="Narration volume" /></label>
          </div>
          <p style={{ color: '#b1c5d5', fontSize: 12, lineHeight: 1.65 }}>Narration uses your browser’s available synthetic voice as a temporary preview, not a licensed Director Veyr performance. No autoplay. {voiceAvailable ? '' : 'Voice playback is not supported by this browser; use the transcript.'}</p>
          {transcripts.includes(scene.number) && <blockquote style={{ margin: '16px 0', padding: 20, borderLeft: '3px solid #7ecce4', color: '#eef7ff', background: '#101f36', lineHeight: 1.8 }}>{scene.narration}</blockquote>}
          <div style={{ borderTop: '1px solid #28435d', marginTop: 19, paddingTop: 15 }}>
            <p style={{ color: '#89d9f5', fontWeight: 800, fontSize: 12, letterSpacing: 1 }}>THE REAL-WORLD LESSON</p>
            <p style={{ lineHeight: 1.8, fontSize: 16, color: '#d5e3ee' }}>{scene.lesson}</p>
            <p style={{ color: '#e8c97b', fontWeight: 700, fontSize: 14 }}>Mission objective: {scene.interaction}</p>
          </div>
          {scene.number === '08' && <div style={{ background: '#0a2634', border: '1px solid #54859b', borderRadius: 14, padding: 22, marginTop: 24 }}>
            <p style={{ fontSize: 12, color: '#8fe7f7', fontWeight: 800, letterSpacing: 1.5 }}>INTERACTIVE CONSEQUENCE EXAMINATION</p>
            <h3 style={{ fontSize: 25, lineHeight: 1.3 }}>What is the disposition for the separate, legitimate cooling request?</h3>
            <p style={{ color: '#cbdeea', lineHeight: 1.75 }}>Its evidence is under examination; applicable authority and established standing are not yet demonstrated. The malicious command injection was already denied.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{buttons.map(option => <button key={option} type="button" aria-pressed={choice === option} onClick={() => setChoice(option)} style={{ padding: '13px 19px', borderRadius: 9, fontWeight: 800, cursor: 'pointer', background: choice === option ? '#f2d18e' : '#153247', color: choice === option ? '#10202a' : '#f0f8ff', border: '1px solid #779eb5' }}>{option}</button>)}</div>
            <p aria-live="polite" style={{ color: choice === 'HOLD' ? '#95f5c4' : '#f0d59f', lineHeight: 1.8, marginTop: 18 }}>{answerText || 'Choose an outcome to reveal its explanation.'}</p>
          </div>}
          <div style={{ marginTop: 22, display: 'flex', justifyContent: 'space-between', gap: 15, flexWrap: 'wrap' }}>
            <span style={{ color: '#aec7d9', fontSize: 13 }}>Scene {scene.number} of 10 · Fictional demonstration</span>
            {scene.number !== '10' && <a href={'#scene-' + scenes[Number(scene.number)].number} style={linkStyle}>Continue to scene {scenes[Number(scene.number)].number}</a>}
          </div>
        </section>)}
      </div>
      <footer style={{ paddingTop: 44, lineHeight: 1.8, color: '#c6d8e7' }}>
        <h2 style={{ color: '#f7fbff', fontSize: 34 }}>The boundary remains.</h2>
        <p>Prediction is not permission. Capability is not authority. Authorized execution is not by itself proof of the physical outcome. The next consequence requires its own evidence, applicable authority, and established standing.</p>
        <p>Fictional learning experience · Not an operational decision, certification, or proof of a deployed architecture. ACA’s formal technical specification remains open for verification before technical claims are finalized.</p>
        <Link href="/showrooms" style={linkStyle}>Return to all showrooms</Link>
      </footer>
    </div>
  </main>;
}
