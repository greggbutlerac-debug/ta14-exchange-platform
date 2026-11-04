'use client';

import Link from 'next/link';
import IndependentExamination from './IndependentExamination';
import { useEffect, useMemo, useState } from 'react';

type GateState = { evidence: boolean; authority: boolean; standing: boolean; escalation: boolean };
type ScenarioKey = 'school' | 'agent' | 'finance' | 'infrastructure';

const mediaBase = '/';
const pdfFile = 'TA14_Consequence_Boundary_Independent_Examination.pdf';

const chapters = [
  {
    number: '01', title: 'The Consequence Boundary', kicker: 'THE REAL-WORLD QUESTION',
    image: 'The Consequence Boundary_ Classroom Exchange.png',
    alt: 'TA-14 Consequence Boundary. Illustrative classroom with elevated carbon dioxide and a proposed increase in outdoor-air ventilation.',
    summary: 'A classroom controller proposes an outdoor-air increase to address elevated carbon dioxide. A plausible recommendation is not yet permission to act.',
    samantha: "Welcome to the Consequence Boundary. Imagine Classroom 214, where the building controller sees elevated carbon dioxide and recommends increasing outdoor air. The display also shows particle pollution, temperature, and humidity. These numbers are hypothetical teaching values, not actual school measurements. The controller has identified a possible response, but that does not answer whether the response is justified, permitted, or appropriate at the moment of execution. Our examination begins with the difference between knowing something and having authority to change reality.",
    learned: 'A measurement can justify examination without authorizing a physical intervention. The proposed consequence must be identified precisely.',
    next: 'We will examine the decision itself, including the evidence gate, the authority gate, and the question of standing.'
  },
  {
    number: '02', title: 'The TA-14 Examination', kicker: 'THE DECISION AT THE BOUNDARY',
    image: 'TA-14 Examination_ Bounded Hold.png',
    alt: 'TA-14 classroom examination showing sufficient evidence, present authority, standing not established, and a HOLD determination.',
    summary: 'The illustrative decision records evidence as sufficient and applicable authority as present, but current standing is not established. The bounded result is HOLD.',
    samantha: "Now the recommendation reaches the governance boundary. The demonstration shows three distinct findings: the evidence is sufficient for the limited scenario, a relevant operating authority exists, and current standing has not been established. The bounded determination is HOLD. That does not mean the ventilation concern disappears. It means the system must not silently convert an unresolved condition into permission. The record should identify what remains unresolved and what additional examination is necessary. A HOLD is an active governance result, not an administrative shrug.",
    learned: 'A bounded HOLD stops the proposed command without erasing the underlying environmental concern or the evidence collected.',
    next: 'Next, separate admissibility, applicable authority, and established standing instead of treating them as a single approval.'
  },
  {
    number: '03', title: 'Three Different Governance Checks', kicker: 'DO NOT COLLAPSE THE GATES',
    image: 'Three Governance Checks Infographic.png',
    alt: 'Three TA-14 governance checks: admissibility, authority and standing, with distinct questions for each.',
    summary: 'Admissibility concerns evidence fit for purpose. Authority concerns what is legitimately permitted. Standing concerns the actor and capacity entitled to invoke that authority for this consequence.',
    samantha: "These three checks cannot substitute for one another. Admissibility asks whether the record is reliable, attributable, current, and sufficient for this particular consequence. Applicable Authority asks which rule, permission, or operational power governs the action. Established Standing asks whether the actor, in a declared capacity, has an admissibly supported relationship to that authority. Changed equipment or environmental conditions can also force a new evidence and binding examination. Even when one gate passes, the other gates must be examined separately. Applicable Authority is not Established Standing.",
    learned: 'Reliable readings do not create authority, and applicable authority does not by itself establish the actor’s standing.',
    next: 'A change in outdoor particulate conditions will test whether a previous recommendation still fits the current environment.'
  },
  {
    number: '04', title: 'The Environment Changes', kicker: 'YESTERDAY IS NOT NOW',
    image: 'Changed Conditions, New Standing Determination.png',
    alt: 'Hypothetical earlier and current conditions showing an increase in outdoor PM2.5 from 12 to 38 micrograms per cubic metre.',
    summary: 'Outdoor particulate concentration increases after the recommendation was formed. The earlier basis for increasing outdoor air can no longer be reused without examination.',
    samantha: "Look at what changed. When the recommendation was produced, the illustration shows lower outdoor particle pollution. Before the command is committed, outdoor P M two point five rises. The example values are invented for teaching. Increased outdoor-air ventilation might reduce indoor carbon dioxide while bringing in more particles, depending on filtration and system design. The previous recommendation therefore needs renewed assessment of evidence, safety, and the proposed action's binding conditions. The illustration marks standing unresolved, but changed air conditions do not automatically prove an actor lacks legal standing. TA-14 must examine those issues separately.",
    learned: 'A changed environmental condition can invalidate the fitness of a prior recommendation; it does not automatically revoke the actor’s authority or standing.',
    next: 'See what HOLD actually requires and how the institution prevents an unexamined command from becoming reality.'
  },
  {
    number: '05', title: 'What HOLD Means', kicker: 'THE FAIL-CLOSED CONSEQUENCE',
    image: 'TA-14 Bounded Determination_ HOLD.png',
    alt: 'HOLD determination with required steps: do not execute, reassess changed conditions, re-establish the missing basis and re-examine.',
    summary: 'The ventilation increase is withheld. The responsible process must preserve its reasons, reassess changed conditions, and return to the decision boundary.',
    samantha: "HOLD has a very practical meaning. Do not release the proposed ventilation increase on the strength of the old recommendation alone. Preserve the original proposal and all supporting evidence. Identify the changed outdoor conditions and the reason the authorization basis is not currently sufficient. Obtain the additional evidence or actor-standing record that is actually missing, rather than assuming a new sensor reading fixes every problem. Then issue a new bounded determination. HOLD is not proof that the air is safe, and it is not permission to ignore the classroom. It is a safeguard against unsupported execution.",
    learned: 'Fail-closed governance blocks the specific unsupported action while preserving the need for a properly justified response.',
    next: 'Follow the full evidence-to-outcome chain to see why an approved action still requires execution and outcome records.'
  },
  {
    number: '06', title: 'The Governed Route', kicker: 'PRESERVE THE ENTIRE CHAIN',
    image: 'The Governed Route_ TA-14 Exchange.png',
    alt: 'Eight-stage TA-14 chain: Reality, Record, Continuity, Admissibility, Binding, Commit, Execution, Outcome.',
    summary: 'Reality becomes a record. Continuity and admissibility are examined. A bounded authorization is bound, committed, executed, and followed by outcome verification.',
    samantha: "TA-14 follows the complete chain: Reality, Record, Continuity, Admissibility, Binding, Commit, Execution, Outcome. What happened must be documented truthfully. The record needs a verifiable connection across time and changing conditions. Only then can it be examined for admissibility. A binding record defines the exact consequence and its conditions. Commit is the point where the current authority and standing must still be satisfied. Execution records what was actually done. Outcome records what changed in reality. A recommendation without this continuity is not a verified result.",
    learned: 'A completed command and a verified improvement are different records. Governance has to connect the two without losing continuity.',
    next: 'Compare the four bounded determinations, including when the correct route is escalation rather than execution.'
  },
  {
    number: '07', title: 'Four Bounded Determinations', kicker: 'ONE GATE, FOUR POSSIBLE RESULTS',
    image: 'The Final Determination_ Allow, Hold, Deny, Escalate.png',
    alt: 'TA-14 outcomes ALLOW, HOLD, DENY and ESCALATE, each with meaning and a required next step.',
    summary: 'ALLOW permits a bounded action. HOLD stops execution pending a missing condition. DENY refuses an unauthorized action. ESCALATE routes a matter to another authority.',
    samantha: "Not every proposal receives the same result. ALLOW means the exact consequence may proceed within a verified scope and time. HOLD means the evidence or present conditions are not yet sufficient and execution must wait. DENY means the proposed action lacks legitimate applicable authority or is outside its permitted scope. ESCALATE means a higher, different, or additional authority must examine the issue. These are meaningful, distinct records. An operator must never convert a HOLD into an ALLOW by waiting, clicking again, or reusing yesterday's approval.",
    learned: 'ALLOW, HOLD, DENY, and ESCALATE are distinct decisions with different obligations and no automatic permission by default.',
    next: 'Finish with the principle that connects the entire classroom examination: current evidence, current authority, and current standing.'
  },
  {
    number: '08', title: 'The Consequence Must Be Justified Now', kicker: 'THE FINAL TAKEAWAY',
    image: 'TA-14 Takeaway_ Is It Valid Now_.png',
    alt: 'Final TA-14 takeaway: Was it valid? is not enough; is it valid NOW? Classroom result HOLD.',
    summary: 'The governing question is not whether a recommendation once appeared valid. It is whether the specific consequence is admissibly supported and legitimately permitted now.',
    samantha: "We have reached the final takeaway. The controller may have made an intelligent recommendation. The evidence may have supported that recommendation when it was created. A building policy may even permit this class of action. But none of that grants permanent permission. At the moment of commitment, the institution must still have sufficient admissible evidence, applicable authority, and established standing for this particular action. If not, the proper response is to stop, preserve the record, and examine again. No admissible evidence. No admissible execution.",
    learned: 'A prior recommendation is never permanent authorization. The consequence must remain justified at the commitment boundary.',
    next: 'Use the interactive examination and advanced evidence lab below to test how governance findings change, preserve a teaching receipt, and challenge three cases.'
  }
] as const;

const scenarios = {
  school: { label: 'SCHOOL CLASSROOM', consequence: 'Increase outdoor-air ventilation in Classroom 214.', note: 'Illustrative elevated CO₂ prompts a ventilation recommendation.', changed: 'Outdoor PM₂.₅ has risen since the recommendation was created.' },
  agent: { label: 'AI AGENT', consequence: 'Release an autonomous account action.', note: 'The agent has completed its computational decision route.', changed: 'The authorization context changed before execution.' },
  finance: { label: 'FINANCIAL TRANSACTION', consequence: 'Commit a high-value automated payment.', note: 'The transaction passed its computational checks.', changed: 'The signing authority may no longer apply to this transaction.' },
  infrastructure: { label: 'PUBLIC INFRASTRUCTURE', consequence: 'Execute a remote operational change.', note: 'The controller has prepared a technically valid command.', changed: 'Material field conditions changed before the command was committed.' }
} as const;

function Samantha({ text, number }: { text: string; number: string }) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    setAvailable(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => { if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);

  const stop = () => {
    window.speechSynthesis.cancel();
    setStatus('idle');
  };
  const play = () => {
    if (!available) return;
    if (status === 'paused') { window.speechSynthesis.resume(); setStatus('playing'); return; }
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(text);
    const choices = window.speechSynthesis.getVoices();
    voice.voice = choices.find(v => /Samantha/i.test(v.name))
      || choices.find(v => /Ava|Victoria|Karen|Zira/i.test(v.name))
      || choices.find(v => v.lang === 'en-US')
      || choices.find(v => v.lang.startsWith('en'))
      || null;
    voice.rate = 0.83;
    voice.pitch = 0.97;
    voice.onend = () => setStatus('idle');
    voice.onerror = () => setStatus('idle');
    window.speechSynthesis.speak(voice);
    setStatus('playing');
  };
  const toggle = () => {
    if (status === 'idle') play();
    else if (status === 'paused') play();
    else { window.speechSynthesis.pause(); setStatus('paused'); }
  };

  return (
    <div className="samantha" aria-label={`Samantha narration for image ${number}`}>
      <div className="sam-top">
        <div><span className="sam-kicker">SAMANTHA · GUIDED NARRATION</span><h3>Hear the examination explained.</h3></div>
        <div className="sam-controls">
          <button type="button" disabled={!available} onClick={toggle}>{status === 'playing' ? 'Ⅱ PAUSE' : status === 'paused' ? '▶ RESUME' : '▶ LISTEN TO SAMANTHA'}</button>
          {status !== 'idle' && <button type="button" onClick={stop}>■ STOP</button>}
        </div>
      </div>
      <p className="transcript">{text}</p>
      <small>Voice playback uses your browser's available speech voices. Samantha is selected when installed. The complete narration is readable above.</small>
    </div>
  );
}

export default function ConsequenceBoundaryPage() {
  const [scenario, setScenario] = useState<ScenarioKey>('school');
  const [gate, setGate] = useState<GateState>({ evidence: true, authority: true, standing: false, escalation: false });
  const [openImage, setOpenImage] = useState<string | null>(null);
  const selected = scenarios[scenario];
  const result = useMemo(() => {
    if (gate.escalation) return { word: 'ESCALATE', reason: 'A higher or different authority is required to resolve this boundary.' };
    if (!gate.evidence) return { word: 'HOLD', reason: 'The present evidence does not sufficiently support the proposed consequence.' };
    if (!gate.authority) return { word: 'DENY', reason: 'Applicable execution authority has not been established for this consequence.' };
    if (!gate.standing) return { word: 'HOLD', reason: 'The actor’s current standing to invoke the applicable authority is not established.' };
    return { word: 'ALLOW', reason: 'The illustrative gates are satisfied for this bounded consequence now, subject to current operational checks.' };
  }, [gate]);
  const reset = (key: ScenarioKey) => {
    window.speechSynthesis?.cancel();
    setScenario(key);
    setGate({ evidence: true, authority: true, standing: false, escalation: false });
  };

  return <main className="cb-page">
    <style>{`
      .cb-page{background:radial-gradient(ellipse at 15% 0%,rgba(48,156,216,.16),transparent 32%),linear-gradient(180deg,#061722 0%,#03101a 45%,#02090f 100%);color:#f3f7fa;font-family:Inter,system-ui,-apple-system,sans-serif;min-height:100vh}
      .cb-page *{box-sizing:border-box}.cb-wrap{width:min(1120px,calc(100% - 38px));margin:auto}.cb-nav{display:flex;align-items:center;justify-content:space-between;gap:18px;border-bottom:1px solid #295064;padding:22px 0}.cb-nav a{color:#fff;text-decoration:none;font-weight:900;letter-spacing:.08em}.cb-nav span{font-size:10px;color:#8dddf0;letter-spacing:.16em;font-weight:850}
      .cb-hero{padding:84px 0 68px}.cb-eyebrow{font-size:12px;letter-spacing:.2em;color:#ecc56d;font-weight:900}.cb-hero h1{font:800 clamp(48px,7.2vw,98px)/.98 Georgia,serif;letter-spacing:-.045em;margin:20px 0 25px}.cb-hero h1 em{font-style:normal;color:#f2c866}.cb-lead{max-width:870px;font-size:clamp(17px,2vw,23px);line-height:1.63;color:#bbd0dc;margin:0}.cb-heroquote{border-left:4px solid #efc962;padding:20px 24px;margin-top:32px;max-width:900px;background:rgba(230,191,94,.065);font-size:clamp(19px,2.4vw,29px);font-weight:750;line-height:1.45}
      .cb-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}.cb-action{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid #eec970;border-radius:10px;padding:15px 19px;background:#f1cc72;color:#061523;text-decoration:none;font-size:12px;letter-spacing:.04em;font-weight:900}.cb-action.secondary{background:transparent;color:#e4f5fb;border-color:#5c9cba}.cb-note{display:block;margin-top:18px;color:#a3b6c0;font-size:12px;line-height:1.6}
      .cb-intro{padding:35px 0 45px;border-top:1px solid #254454}.cb-sectionlabel{font-size:11px;font-weight:900;letter-spacing:.17em;color:#76d5f3}.cb-intro h2,.cb-sim-heading h2{font-size:clamp(27px,4vw,45px);letter-spacing:-.025em;margin:12px 0}.cb-intro p,.cb-sim-heading p{font-size:16px;color:#a8becb;line-height:1.7;max-width:800px}.cb-index{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:28px 0 10px}.cb-index a{padding:15px;border:1px solid #285064;border-radius:12px;background:#0b2533;color:#e4f1f6;text-decoration:none;font-size:12px;font-weight:800;min-height:85px;transition:transform .2s,border-color .2s}.cb-index a:hover,.cb-index a:focus-visible{border-color:#f0ca75;transform:translateY(-2px)}.cb-index b{display:block;color:#efc966;margin-bottom:9px;font-size:11px}
      .cb-chapter{padding:65px 0 34px;border-top:1px solid #244351;scroll-margin-top:24px}.cb-chapterhead{display:flex;justify-content:space-between;gap:25px;align-items:end;margin-bottom:23px}.cb-step{font-size:11px;letter-spacing:.18em;font-weight:900;color:#8bdbf2}.cb-chapter h2{font-size:clamp(27px,4.3vw,46px);letter-spacing:-.03em;margin:11px 0 12px}.cb-description{max-width:800px;color:#aabfc9;font-size:16px;line-height:1.65;margin:0}.cb-counter{font:700 clamp(34px,6vw,68px)/1 Georgia,serif;color:#345a6d;white-space:nowrap}
      .cb-figure{margin:0}.cb-figure button{border:1px solid #436779;background:#06131e;padding:0;display:block;width:100%;cursor:zoom-in;border-radius:17px;overflow:hidden;line-height:0}.cb-figure img{display:block;width:100%;height:auto}.cb-figure figcaption{padding:11px 4px 0;color:#91a8b5;font-size:12px;line-height:1.5}
      .samantha{margin:24px 0 0;padding:26px;border:1px solid #345b6b;border-radius:17px;background:linear-gradient(140deg,rgba(17,52,66,.84),rgba(4,17,27,.98))}.sam-top{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}.sam-kicker{color:#f3ce74;font-size:11px;letter-spacing:.14em;font-weight:900}.samantha h3{font-size:22px;margin:9px 0}.sam-controls{display:flex;gap:8px;flex-wrap:wrap}.sam-controls button{cursor:pointer;padding:12px 15px;border:1px solid #7bd6ec;border-radius:9px;background:#123746;color:#fff;font-weight:850;font-size:12px}.sam-controls button:disabled{opacity:.5;cursor:not-allowed}.transcript{line-height:1.85;color:#c9dae2;font-size:15px;margin:20px 0 11px}.samantha small{color:#8ea7b2;line-height:1.5}
      .cb-bridge{padding:29px 0 48px;display:grid;grid-template-columns:1fr 1fr;gap:15px}.cb-bridge article{border:1px solid #33576b;border-radius:15px;background:#0a222e;padding:23px}.cb-bridge article:last-child{border-color:rgba(239,201,102,.45);background:#1b231f}.cb-bridge h3{font-size:11px;letter-spacing:.15em;color:#7cdef0;margin:0 0 13px}.cb-bridge article:last-child h3{color:#efca75}.cb-bridge p{color:#d0dce2;line-height:1.7;margin:0;font-size:15px}
      .cb-simulator{margin:75px 0 70px;padding-top:65px;border-top:1px solid #2a5263}.cb-tabs{display:flex;gap:10px;flex-wrap:wrap;margin:29px 0 17px}.cb-tabs button{border:1px solid #386277;background:#0b2633;color:#bdd7e3;padding:13px 16px;border-radius:9px;font-weight:850;font-size:11px;cursor:pointer}.cb-tabs button[aria-pressed=true]{background:#153f50;color:#fff;border-color:#81d9f3}.cb-sim{display:grid;grid-template-columns:1.1fr .9fr;gap:16px}.cb-panel{background:#0a202d;border:1px solid #34576a;border-radius:17px;padding:26px}.cb-panel h3{font-size:26px;margin:10px 0}.cb-panel small{font-size:11px;color:#84d8ee;font-weight:850;letter-spacing:.12em}.cb-panel p{color:#b7cbd4;line-height:1.68}.cb-proposal{border-left:3px solid #e9c66d;padding:10px 17px;margin:22px 0 18px;background:#142d34}.cb-proposal p{margin:5px 0 0}.cb-gates{display:grid;gap:9px}.cb-gate{border:1px solid #325261;border-radius:11px;padding:15px;display:flex;justify-content:space-between;align-items:center;gap:16px}.cb-gate b{font-size:13px}.cb-gate span{display:block;color:#91abb8;font-size:12px;line-height:1.5;margin-top:5px}.cb-gate button{white-space:nowrap;border-radius:8px;cursor:pointer;border:1px solid #638c91;background:#0b3040;color:#fff;padding:10px;font-weight:850;font-size:11px}.cb-gate button.on{border-color:#4bb796;color:#82e5bb}.cb-gate button.off{border-color:#e99f68;color:#ffc08b}.cb-changed{margin-top:20px;padding:15px;border:1px dashed #a48955;border-radius:10px;color:#edcf8d;line-height:1.6;font-size:13px}.cb-result{text-align:center;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:430px}.cb-resultword{font:900 clamp(51px,7vw,89px)/1 Georgia,serif;margin-top:20px}.cb-resultword.allow{color:#75e5af}.cb-resultword.hold{color:#eec46a}.cb-resultword.deny{color:#ff8888}.cb-resultword.escalate{color:#c5abff}.cb-result p{max-width:420px}.cb-reset{margin-top:15px;border:1px solid #759ab1;padding:11px 15px;background:none;color:#fff;border-radius:8px;cursor:pointer;font-weight:800}.cb-limits{margin-top:17px;color:#9eb5be;font-size:12px;line-height:1.7}
      .cb-footer{border-top:1px solid #234a5b;padding:62px 0 70px;text-align:center}.cb-footer h2{font:800 clamp(30px,4vw,50px)/1.15 Georgia,serif;margin:0 0 22px}.cb-footer p{color:#a7c0ca;line-height:1.7}.cb-footer strong{color:#efc965}.cb-footer a{color:#8ee0f7;font-weight:850;text-decoration:none}.cb-modal{position:fixed;inset:0;background:rgba(0,5,10,.96);z-index:9999;display:flex;align-items:center;justify-content:center;padding:65px 15px 25px}.cb-modal img{max-width:min(1350px,100%);max-height:calc(100vh - 90px);object-fit:contain}.cb-modal button{position:absolute;right:22px;top:18px;background:#142d3b;border:1px solid #80d7ef;color:#fff;border-radius:8px;padding:12px 18px;cursor:pointer}
      @media(max-width:800px){.cb-index{grid-template-columns:repeat(2,minmax(0,1fr))}.cb-sim,.cb-bridge{grid-template-columns:1fr}.cb-chapter{padding-top:46px}.cb-hero{padding:53px 0}.cb-chapterhead{align-items:start}.cb-counter{font-size:36px}.cb-panel{padding:19px}.cb-gate{align-items:start;flex-direction:column}.cb-result{min-height:275px}}
      @media(prefers-reduced-motion:reduce){.cb-index a{transition:none}}
    `}</style>
    <div className="cb-wrap">
      <nav className="cb-nav"><Link href="/">TA-14 EXCHANGE</Link><span>THE CONSEQUENCE BOUNDARY · EIGHT-PART EXAMINATION</span></nav>
      <header className="cb-hero">
        <div className="cb-eyebrow">TA14 AUTHORITY GOVERNANCE INSTITUTION · EDUCATIONAL EXAMINATION</div>
        <h1>The Consequence<br/><em>Boundary.</em></h1>
        <p className="cb-lead">A measured condition is not an authorized action. Explore an eight-image, independently examinable walkthrough of evidence, environmental change, applicable authority, established standing, and the decision to act in a school building.</p>
        <div className="cb-heroquote">Does this proposed consequence have sufficient <span style={{color:'#f2c866'}}>Admissible Evidence, Applicable Authority, and Established Standing</span> to become reality <span style={{color:'#f2c866'}}>NOW</span>?</div>
        <div className="cb-actions">
          <a className="cb-action" href="#image-01">BEGIN THE EIGHT-IMAGE EXAMINATION ↓</a>
          <a className="cb-action secondary" href={mediaBase + encodeURIComponent(pdfFile)} target="_blank" rel="noopener noreferrer">↓ DOWNLOAD THE TECHNICAL PDF</a>
          <a className="cb-action secondary" href="#interactive">TRY THE INTERACTIVE BOUNDARY</a><a className="cb-action secondary" href="#independent-examination">ADVANCED EVIDENCE LAB</a>
        </div>
        <small className="cb-note">Independent TA-14 educational material · Classroom 214 and its numerical readings are hypothetical illustrative examples · Not a school inspection, regulatory finding, or certification.</small>
      </header>

      <section className="cb-intro" aria-labelledby="journey-heading">
        <span className="cb-sectionlabel">YOUR GUIDED LEARNING JOURNEY</span>
        <h2 id="journey-heading">Eight images. One consequence. No shortcuts.</h2>
        <p>Each image is followed by Samantha's optional spoken explanation and a readable transcript. Between the images, review <b>What You Learned</b> and <b>What You're About to Learn</b>. Click any image to examine it at a larger size.</p>
        <div className="cb-index">{chapters.map(item => <a href={`#image-${item.number}`} key={item.number}><b>IMAGE {item.number}</b>{item.title}</a>)}</div>
      </section>

      {chapters.map((item, i) => <div key={item.number}>
        <section id={`image-${item.number}`} className="cb-chapter" aria-labelledby={`heading-${item.number}`}>
          <div className="cb-chapterhead"><div><span className="cb-step">{item.kicker}</span><h2 id={`heading-${item.number}`}>{item.title}</h2><p className="cb-description">{item.summary}</p></div><span className="cb-counter">{item.number}/08</span></div>
          <figure className="cb-figure">
            <button type="button" onClick={() => setOpenImage(item.image)} aria-label={`Enlarge image ${item.number}: ${item.title}`}><img loading={i < 2 ? 'eager' : 'lazy'} src={mediaBase + encodeURIComponent(item.image)} alt={item.alt}/></button>
            <figcaption>Image {item.number} of 08 · TA-14 educational illustration. Select to enlarge.</figcaption>
          </figure>
          <Samantha number={item.number} text={item.samantha}/>
        </section>
        <div className="cb-bridge" aria-label={`Learning transition after image ${item.number}`}>
          <article><h3>✓ WHAT YOU JUST LEARNED</h3><p>{item.learned}</p></article>
          <article><h3>→ WHAT YOU'RE ABOUT TO LEARN</h3><p>{item.next}</p></article>
        </div>
      </div>)}

      <section id="interactive" className="cb-simulator" aria-labelledby="sim-heading">
        <div className="cb-sim-heading"><span className="cb-sectionlabel">APPLY THE LEARNING · INTERACTIVE EXAMINATION</span><h2 id="sim-heading">Now run the boundary yourself.</h2><p>Change the illustrative governance findings and watch the bounded determination update. This teaching simulator is not a live building controller and does not issue real-world authorization.</p></div>
        <div className="cb-tabs" role="group" aria-label="Select scenario">{(Object.keys(scenarios) as ScenarioKey[]).map(key => <button type="button" key={key} aria-pressed={scenario === key} onClick={() => reset(key)}>{scenarios[key].label}</button>)}</div>
        <div className="cb-sim">
          <article className="cb-panel">
            <small>PROPOSED CONSEQUENCE</small><h3>{selected.label}</h3>
            <div className="cb-proposal"><b>{selected.consequence}</b><p>{selected.note}</p></div>
            <div className="cb-gates">
              <div className="cb-gate"><div><b>ADMISSIBILITY</b><span>Is evidence sufficient, attributable, and current for this consequence?</span></div><button type="button" aria-pressed={gate.evidence} className={gate.evidence ? 'on' : 'off'} onClick={() => setGate(x => ({...x,evidence:!x.evidence}))}>{gate.evidence ? 'SUFFICIENT' : 'INSUFFICIENT'}</button></div>
              <div className="cb-gate"><div><b>APPLICABLE AUTHORITY</b><span>Does legitimate authority permit this specific action within scope?</span></div><button type="button" aria-pressed={gate.authority} className={gate.authority ? 'on' : 'off'} onClick={() => setGate(x => ({...x,authority:!x.authority}))}>{gate.authority ? 'PRESENT' : 'ABSENT'}</button></div>
              <div className="cb-gate"><div><b>ESTABLISHED STANDING</b><span>Is this actor, in its declared capacity, entitled to invoke that authority now?</span></div><button type="button" aria-pressed={gate.standing} className={gate.standing ? 'on' : 'off'} onClick={() => setGate(x => ({...x,standing:!x.standing}))}>{gate.standing ? 'ESTABLISHED' : 'NOT ESTABLISHED'}</button></div>
              <div className="cb-gate"><div><b>ESCALATION CONDITION</b><span>Does this matter require a higher or different authority?</span></div><button type="button" aria-pressed={gate.escalation} className={gate.escalation ? 'off' : 'on'} onClick={() => setGate(x => ({...x,escalation:!x.escalation}))}>{gate.escalation ? 'REQUIRED' : 'NONE'}</button></div>
            </div>
            <div className="cb-changed"><b>CHANGED CONDITION:</b> {selected.changed}</div>
            <p className="cb-limits">Important: for teaching purposes, the toggles independently represent gate findings. In an actual examination, environmental changes must be evaluated for evidence validity and binding conditions; they do not automatically revoke actor standing.</p>
          </article>
          <article className="cb-panel cb-result" aria-live="polite">
            <small>TA-14 · ILLUSTRATIVE BOUNDED DETERMINATION</small>
            <div className={`cb-resultword ${result.word.toLowerCase()}`}>{result.word}</div>
            <p>{result.reason}</p>
            <p style={{fontSize:13,color:'#efc966',fontWeight:800}}>WAS IT VALID THEN? IS IT JUSTIFIED NOW?</p>
            <button type="button" className="cb-reset" onClick={() => reset(scenario)}>RESET THIS EXAMINATION</button>
          </article>
        </div>
      </section>
      <IndependentExamination />
      <footer className="cb-footer"><h2>Intelligence is not authority.<br/>Authorization is not permanent.</h2><p>Admissible Execution Architecture examines the route:<br/><strong>REALITY → RECORD → CONTINUITY → ADMISSIBILITY → BINDING → COMMIT → EXECUTION → OUTCOME</strong></p><p><strong>NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</strong></p><div className="cb-actions" style={{justifyContent:'center'}}><a className="cb-action" href={mediaBase + encodeURIComponent(pdfFile)} target="_blank" rel="noopener noreferrer">DOWNLOAD THE FULL EXAMINATION PDF</a><a className="cb-action secondary" href="#image-01">↑ RETURN TO IMAGE 01</a></div><p style={{marginTop:28}}><Link href="/">← RETURN TO THE TA-14 EXCHANGE</Link></p></footer>
    </div>
    {openImage && <div className="cb-modal" role="dialog" aria-modal="true" aria-label="Enlarged educational image" onClick={() => setOpenImage(null)}><button type="button" onClick={() => setOpenImage(null)}>✕ CLOSE</button><img src={mediaBase + encodeURIComponent(openImage)} alt="Enlarged TA-14 educational illustration" onClick={e => e.stopPropagation()}/></div>}
  </main>;
}
