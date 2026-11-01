'use client';

import Link from 'next/link';
import {useEffect, useMemo, useState} from 'react';
import './showroom.css';

type Determination = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';
type SpeechMode = 'idle' | 'speaking' | 'paused';
type VoiceState = 'checking' | 'ready' | 'unavailable' | 'unsupported';

const lessons = [
  {
    title: 'Justified Autonomy: The Framework',
    label: 'The central question',
    image: 'Justified Autonomy Framework at Dusk.png',
    alt: 'TA-14 teaching graphic introducing Justified Autonomy and the three requirements at the execution boundary.',
    takeaway: 'Autonomy establishes capability. Justification governs whether a proposed consequence may become reality NOW.',
    explanation: 'A system may know what to do and have the technical capacity to do it while lacking the grounds or authority to execute. Independent justification concerns the particular action, not an unrestricted approval of the system.',
    question: 'What must be established before a consequential autonomous action is committed?',
    narration: 'Lesson one. Justified Autonomy. Today, a machine can observe, recommend and act. That is capability, not automatic permission. TA-14 Authority asks one governing question. Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW? This examination is specific to the action. It must remain valid at binding and at the moment of execution commitment. Our example is educational, not proof of a deployed system. In the next lesson, notice why intelligence and legitimate authority are different things.'
  },
  {
    title: 'Autonomy Is Capability, Not Authority',
    label: 'Separate ability from permission',
    image: 'Autonomy Is Capability, Not Authority.png',
    alt: 'Teaching comparison of what an autonomous system can do versus the actions it is legitimately authorized to perform.',
    takeaway: 'A system being technically capable of an action does not create the legitimate authority to perform it.',
    explanation: 'A connected agent may be able to transfer funds. A controller may be able to change ventilation. A technician may be able to diagnose equipment. None of those capabilities independently establishes permission for the proposed consequence.',
    question: 'Can a system have access and technical ability but still lack permission to execute?',
    narration: 'Lesson two. Capability is not authority. A controller may know how to open a damper. An artificial intelligence agent may know how to transfer funds. A technician may know how to repair equipment. Those are capabilities. Permission is a separate question, established by an applicable responsible authority and bounded by scope and conditions. TA-14 does not invent that authority. It examines whether legitimate authority applies to the specific proposed consequence. The key distinction is simple. A recommendation is not an authorization. Access is not permission. Being able to act does not mean an action may proceed.'
  },
  {
    title: 'The Three Requirements',
    label: 'Evidence + authority + standing',
    image: 'The Three Requirements of Justified Autonomy.png',
    alt: 'Three TA-14 requirements shown together: Admissible Evidence, Applicable Authority, and Established Standing.',
    takeaway: 'All three requirements are necessary for the particular consequence. None substitutes for another.',
    explanation: 'Admissible Evidence concerns a sufficient, attributable and examinable record. Applicable Authority concerns legitimate permission for the action and its limits. Established Standing concerns whether necessary conditions are satisfied NOW.',
    question: 'What happens when evidence and authority are present, but current standing is not established?',
    narration: 'Lesson three. Three requirements, examined together. First, Admissible Evidence. Is the supporting record sufficiently attributable, continuous, relevant and examinable for this consequence? Second, Applicable Authority. Does legitimate authority permit this precise action, within its scope and limitations? Third, Established Standing. Are the required conditions and relationships satisfied in present reality, NOW? Evidence without authority is insufficient. Authority without evidence is insufficient. Both can exist while standing has changed. This is why a previously favorable determination cannot become a permanent license to execute.'
  },
  {
    title: 'The Eight-Link Execution Chain',
    label: 'From reality to outcome',
    image: 'The Eight-Link Execution Chain.png',
    alt: 'Eight numbered links: Reality, Record, Continuity, Admissibility, Binding, Commit, Execution, and Outcome.',
    takeaway: 'Binding and Commit are distinct governance checkpoints; revalidation is required before consequence.',
    explanation: 'Reality, Record, Continuity and Admissibility establish the evidentiary path. Binding associates the particular proposed consequence with evidence, authority and standing. Commit is the final authorization checkpoint. Execution and Outcome remain separately recorded.',
    question: 'Which two links must revalidate the action against present evidence, authority and standing?',
    narration: 'Lesson four. The eight-link execution chain. Reality. Record. Continuity. Admissibility. Binding. Commit. Execution. Outcome. Each link answers a different question. A record is not reality itself. A record is not automatically admissible. Admissible evidence does not create authority. At Binding, the precise consequence is tied to its evidence, authority and standing. At Commit, those conditions are revalidated immediately before execution. Only then can an authorized actor or system carry out the bounded action. Afterwards, Outcome preserves what actually happened. A successful command is not automatically proof of a successful physical result.'
  },
  {
    title: 'When Reality Changes: ALLOW Becomes HOLD',
    label: 'Revalidate at commitment',
    image: 'ALLOW Becomes HOLD_ Revalidation at Commit.png',
    alt: 'Three-step example showing initial ALLOW, changed outdoor conditions, and HOLD at revalidation before commitment.',
    takeaway: 'PRIOR ALLOW + CHANGED REALITY = HOLD UNTIL REVALIDATED.',
    explanation: 'A building controller initially has evidence, permission, and conditions supporting a bounded outside-air adjustment. Before commitment, new outdoor particulate readings undermine the required conditions. The earlier ALLOW does not authorize execution against this new reality.',
    question: 'Should the controller execute because ALLOW was granted earlier?',
    narration: 'Lesson five. This is the moment that changes everything. A building controller proposes increasing outside-air intake. Its record is sufficient, its delegated authority applies, and operating conditions support the change. An initial bounded ALLOW may be appropriate. But before the command is committed, new outdoor measurements undermine the conditions that supported the proposal. The controller still knows how to act. Its general authority may still exist. Yet standing for this particular consequence is no longer established. The correct illustrative disposition is HOLD. Execution is withheld until the required conditions are re-established. Prior ALLOW plus changed reality equals HOLD until revalidated.'
  },
  {
    title: 'The Four Governance Determinations',
    label: 'Make the disposition explicit',
    image: 'The Four Governance Determinations.png',
    alt: 'Four color-coded determinations: ALLOW, HOLD, DENY, and ESCALATE, with concise educational explanations.',
    takeaway: 'ALLOW, HOLD, DENY and ESCALATE govern whether the proposed action may proceed, not whether it is technically possible.',
    explanation: 'ALLOW is bounded permission when all requirements are met. HOLD withholds execution while a resolvable condition is missing. DENY rejects an action that fails a governing requirement or is prohibited as proposed. ESCALATE refers a matter beyond the present decision authority.',
    question: 'If an explicit authority prohibition applies, is that a HOLD or a DENY?',
    narration: 'Lesson six. Four determinations, four meanings. ALLOW means the requirements are satisfied for a specific action within its limits. HOLD means execution is withheld because something necessary is unresolved or no longer established and may be re-examined. DENY means the proposed action fails a governing requirement or is prohibited as proposed. ESCALATE means the matter requires a designated higher or different authority. The distinction matters. Missing evidence is not always a permanent prohibition. A prohibited action cannot simply be held until convenient. These dispositions evaluate justified execution, not predicted technical success.'
  },
  {
    title: 'Keeping the Lanes Separate',
    label: 'Independent examination',
    image: 'Keeping the Lanes Separate.png',
    alt: 'Comparison between an integrated self-evaluating process and distinguishable evidence, diagnosis and intervention responsibilities.',
    takeaway: 'Independent examinability must survive, even when operational functions are integrated.',
    explanation: 'Measurement, interpretation, optimization and reporting can coexist in one technical platform. That alone does not corrupt the data. The risk appears when the operational system also treats its own claims as sufficient independent proof or authority. TA-14 examines the proposed consequence without becoming the operator.',
    question: 'Does combining operational functions automatically invalidate every measurement?',
    narration: 'Lesson seven. Keep the lanes distinguishable. An operational platform may measure, diagnose, optimize and report its results. Integration can be useful, and it does not automatically corrupt data. The governance problem is treating the same operational process as sufficient independent proof of its own authority and success. Preserve the original record, make interpretation examinable, identify the responsible authority, and keep the consequence decision distinct. TA-14 does not become the model, technician, controller or regulator. Its examination is deliberately narrow. Independence protects the difference between what a system claims and what its record and authority actually support.'
  },
  {
    title: 'From Capability to Admissible Execution',
    label: 'Bring the architecture together',
    image: 'Justified Autonomy_ Admissible Execution.png',
    alt: 'Summary diagram connecting capability, evidence, authority, standing, and authorized execution under present conditions.',
    takeaway: 'A consequential action becomes eligible to proceed only when all three requirements are sufficient at binding and commit.',
    explanation: 'The governing question applies to one proposed action NOW. A valid examination does not replace operating interlocks, competent human responsibilities, safety systems, or sector-specific law. The actual enforcement must be demonstrated by reproducible tests.',
    question: 'What is the difference between a persuasive architecture graphic and a validated deployment?',
    narration: 'Lesson eight. From capability to admissible execution. A system can propose an action. Evidence must support that exact consequence. Legitimate authority must apply within defined limits. Standing must exist in the present reality. The requirements must be revalidated at binding and commitment. If one is not satisfied, the governing rules produce HOLD, DENY or ESCALATE rather than an unsupported execution. This educational showroom is an architectural demonstration, not a certification or proof of a deployed integration. The next proof is a reproducible decision trace under changed reality. Remember the principle. No admissible evidence. No admissible execution.'
  }
] as const;

const decisionOptions: Determination[] = ['ALLOW','HOLD','DENY','ESCALATE'];
const challenges: {title:string;facts:string;correct:Determination;reason:string}[] = [
  {title:'All three requirements are established', facts:'The baseline is preserved, delegated authority covers the specified ventilation adjustment, and current equipment and outdoor conditions support it. The proposed action is within scope at commit.',correct:'ALLOW',reason:'All three requirements support this specific, bounded consequence at the moment of commitment.'},
  {title:'Reality changes after an earlier ALLOW',facts:'The controller received an earlier bounded ALLOW, but new outdoor particulate measurements undermine present standing before commitment. Updated examination may resolve the issue.',correct:'HOLD',reason:'The earlier ALLOW cannot survive material standing drift without revalidation. Execution is withheld while the new conditions are examined.'},
  {title:'Authority is expressly revoked',facts:'The owner revoked the controller’s delegation for this action. The proposal still attempts the prohibited operation under the revoked permission.',correct:'DENY',reason:'The action lacks Applicable Authority and is explicitly prohibited as proposed; the existing proposal must not proceed.'},
  {title:'A decision exceeds delegated scope',facts:'The proposed action requires a separate statutory or designated responsible authority that the current examination is not empowered to substitute for.',correct:'ESCALATE',reason:'A competent designated authority must resolve the matter. Escalation is not permission to execute while waiting.'}
];

const imagePath = (name:string) => '/' + encodeURIComponent(name);
const technicalPdf = imagePath('TA-14_Justified_Autonomy_Institutional_Technical_Publication_v3 (1).pdf');

export default function JustifiedAutonomyShowroom(){
  const [lessonIndex,setLessonIndex]=useState(0);
  const [voice,setVoice]=useState<SpeechSynthesisVoice|null>(null);
  const [voiceState,setVoiceState]=useState<VoiceState>('checking');
  const [speechMode,setSpeechMode]=useState<SpeechMode>('idle');
  const [changed,setChanged]=useState(false);
  const [challengeIndex,setChallengeIndex]=useState(0);
  const [answers,setAnswers]=useState<Record<number,Determination>>({});
  const lesson=lessons[lessonIndex];
  const challenge=challenges[challengeIndex];
  const selected=answers[challengeIndex];
  const score=useMemo(()=>challenges.filter((c,i)=>answers[i]===c.correct).length,[answers]);
  const answeredCount=Object.keys(answers).length;

  useEffect(()=>{
    if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){
      setVoiceState('unsupported');return;
    }
    const synth=window.speechSynthesis;
    const choose=()=>{
      const match=synth.getVoices().find(v=>v.lang.toLowerCase().startsWith('en')&&/^samantha(?:\b|$)/i.test(v.name.trim()));
      setVoice(match||null);
      setVoiceState(match?'ready':'unavailable');
    };
    choose();
    synth.addEventListener('voiceschanged',choose);
    const retry=window.setTimeout(choose,1200);
    return ()=>{window.clearTimeout(retry);synth.removeEventListener('voiceschanged',choose);synth.cancel();};
  },[]);

  const stop=()=>{
    if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();
    setSpeechMode('idle');
  };
  const navigate=(index:number)=>{
    stop();setLessonIndex(Math.max(0,Math.min(lessons.length-1,index)));
  };
  const play=(preview=false)=>{
    if(!voice||!('speechSynthesis' in window))return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(preview?
      'Hello. I am Samantha, your TA-14 Justified Autonomy teaching guide. The voice you are hearing is the Samantha voice selected by this device.':
      lesson.narration);
    u.voice=voice;
    u.lang=voice.lang;
    u.rate=.9;
    u.pitch=1;
    u.onstart=()=>setSpeechMode('speaking');
    u.onend=()=>setSpeechMode('idle');
    u.onerror=()=>setSpeechMode('idle');
    setSpeechMode('speaking');
    window.speechSynthesis.speak(u);
  };
  const pause=()=>{
    if(!('speechSynthesis' in window))return;
    window.speechSynthesis.pause();setSpeechMode('paused');
  };
  const resume=()=>{
    if(!('speechSynthesis' in window))return;
    window.speechSynthesis.resume();setSpeechMode('speaking');
  };
  const recordAnswer=(answer:Determination)=>{
    if(answers[challengeIndex])return;
    setAnswers(current=>({...current,[challengeIndex]:answer}));
  };

  return <main className="ja-room">
    <div className="ja-wrap">
      <nav className="ja-nav" aria-label="Showroom navigation">
        <Link href="/">← TA-14 EXCHANGE</Link>
        <Link href="/showrooms">ALL SHOWROOMS</Link>
        <span>PUBLIC EDUCATIONAL EXPLORATION · NOVEMBER 2026</span>
      </nav>

      <header className="ja-hero">
        <img className="ja-hero-image" src={imagePath('Justified Autonomy Framework at Dusk.png')} alt="" aria-hidden="true" />
        <div className="ja-hero-inner">
          <div className="ja-eyebrow">TA-14 AUTHORITY · EIGHT-LESSON INTERACTIVE SHOWROOM</div>
          <h1>Justified <span style={{color:'#f7cd73'}}>Autonomy.</span></h1>
          <p className="ja-lead">An autonomous system can be capable of acting without having sufficient grounds to act. Discover the execution boundary between intelligent capability and legitimate consequence.</p>
          <div className="ja-hero-actions">
            <a className="ja-primary" href="#lessons">EXPLORE THE EIGHT LESSONS ↓</a>
            <a className="ja-secondary" href="#challenge">TEST THE EXECUTION BOUNDARY ↓</a>
          </div>
        </div>
      </header>

      <section className="ja-summary" aria-label="Three requirements">
        <article><strong>01 · ADMISSIBLE EVIDENCE</strong><p>Is the supporting record sufficient, attributable, continuous, relevant, and independently examinable for this particular consequence?</p></article>
        <article><strong>02 · APPLICABLE AUTHORITY</strong><p>Does legitimate authority permit this precise action, within the specified scope, conditions and limitations?</p></article>
        <article><strong>03 · ESTABLISHED STANDING</strong><p>Are the necessary conditions and relationships actually satisfied in the present reality—NOW?</p></article>
      </section>

      <section id="lessons" aria-label="Eight teaching lessons">
        <div className="ja-section-heading"><div className="ja-eyebrow">STEP INTO THE ARCHITECTURE</div><h2>Eight images. Eight lessons. One consequential question.</h2><p>Choose any lesson, review its teaching image, then listen to Samantha explain the reasoning. Narration is manual; the page does not auto-play or auto-scroll.</p></div>
        <div className="ja-stage-tabs" role="group" aria-label="Select a lesson">
          {lessons.map((l,i)=><button key={l.title} type="button" className="ja-tab" aria-current={lessonIndex===i?'step':undefined} onClick={()=>navigate(i)}><span>{String(i+1).padStart(2,'0')} / 08</span><strong>{l.title}</strong></button>)}
        </div>
        <article className="ja-lesson">
          <div className="ja-lesson-head">
            <div><div className="ja-lesson-tag">LESSON {String(lessonIndex+1).padStart(2,'0')} / 08 · {lesson.label.toUpperCase()}</div><h2>{lesson.title}</h2></div>
            <span className="ja-lesson-tag">TEACHING IMAGE · {lessonIndex+1} OF 8</span>
          </div>
          <figure className="ja-lesson-image">
            <img src={imagePath(lesson.image)} alt={lesson.alt} loading={lessonIndex===0?'eager':'lazy'}/>
            <figcaption>Illustrative educational graphic. Read the explanation below for the governing technical distinctions.</figcaption>
          </figure>
          <div className="ja-takeaway"><strong>THE LESSON TO REMEMBER</strong><p>{lesson.takeaway}</p></div>
          <div className="ja-lesson-details">
            <div className="ja-panel"><small>WHY IT MATTERS</small><p>{lesson.explanation}</p></div>
            <div className="ja-panel"><small>ASK YOURSELF</small><p>{lesson.question}</p></div>
          </div>
          <div className="ja-voice" aria-label="Samantha narration player">
            <div className="ja-voice-top">
              <div>
                <small>SAMANTHA · GUIDED LESSON NARRATION</small>
                <div className="ja-voice-status" aria-live="polite">{voiceState==='ready'&&voice ? 'Verified voice selected: '+voice.name+' ('+voice.lang+')' : voiceState==='checking' ? 'Checking voices installed on this device…' : voiceState==='unsupported' ? 'Speech playback is not supported in this browser.' : 'Samantha voice is unavailable on this device. Narration remains disabled; no other voice is substituted.'}</div>
              </div>
              <div className="ja-voice-controls">
                <button className="ja-control" type="button" onClick={()=>play(true)} disabled={!voice}>TEST SAMANTHA</button>
                <button className="ja-control" type="button" onClick={()=>play()} disabled={!voice}>▶ PLAY LESSON</button>
                <button className="ja-control" type="button" onClick={pause} disabled={speechMode!=='speaking'}>Ⅱ PAUSE</button>
                <button className="ja-control" type="button" onClick={resume} disabled={speechMode!=='paused'}>▶ RESUME</button>
                <button className="ja-control" type="button" onClick={stop} disabled={speechMode==='idle'}>■ STOP</button>
              </div>
            </div>
            <p className="ja-voice-note">Voice safeguard: the player selects a named English Samantha voice only. Browser operating systems supply the voice; if Samantha is missing, the site will not silently fall back to a male or unspecified voice. Install or enable Samantha in your device speech settings to use narration.</p>
            <details className="ja-script"><summary>Read the complete narration transcript</summary><p>{lesson.narration}</p></details>
          </div>
          <div className="ja-lesson-nav">
            <button className="ja-secondary" type="button" onClick={()=>navigate(lessonIndex-1)} disabled={lessonIndex===0}>← PREVIOUS LESSON</button>
            <span style={{alignSelf:'center',color:'#b5d5de',fontSize:13}}>{lessonIndex+1} of {lessons.length}</span>
            <button className="ja-primary" type="button" onClick={()=>navigate(lessonIndex+1)} disabled={lessonIndex===lessons.length-1}>NEXT LESSON →</button>
          </div>
        </article>
      </section>

      <section className="ja-demo" id="demonstration">
        <div className="ja-eyebrow">INTERACTIVE EXAMINATION · THE MOMENT REALITY CHANGES</div>
        <h2>A building can receive ALLOW—and still be stopped.</h2>
        <p>Run the same educational case shown in lesson five. The controller proposes increasing outside-air intake to address elevated indoor particulate readings. This is a simulation, not a live building connection.</p>
        <div className="ja-demo-grid">
          <div className="ja-state">
            <h3>Proposed consequence</h3>
            <p>Increase outside-air intake within the delegated operating envelope.</p>
            <ul><li>Evidence: preserved baseline and calibrated readings</li><li>Authority: controller delegation is active and in scope</li><li>Standing: {changed?'NEW OUTDOOR CONDITIONS NO LONGER SUPPORT ACTION':'initial outdoor and equipment conditions support action'}</li></ul>
            <div className={'ja-status '+(changed?'ja-hold':'ja-allow')} aria-live="polite">{changed?'HOLD':'ALLOW · INITIAL'}</div>
          </div>
          <div className="ja-state">
            <h3>{changed?'New reality detected':'Conditions at initial examination'}</h3>
            <p>{changed?'Updated outdoor particulate readings undermine the standing for the proposed intake increase. The previous determination cannot be reused at commit.':'All three requirements support the specific proposal at the time of the initial examination. Nothing has been physically executed yet.'}</p>
            <div className="ja-demo-explain"><strong>{changed?'COMMIT GATE · EXECUTION WITHHELD':'INITIAL EXAMINATION · NOT YET COMMITTED'}</strong><p>{changed?'The action must remain HOLD until the relevant requirements are re-established.':'A bounded ALLOW remains subject to revalidation before commitment.'}</p></div>
          </div>
        </div>
        <button className="ja-primary" type="button" onClick={()=>setChanged(c=>!c)}>{changed?'↺ RESTORE INITIAL CONDITIONS':'⚡ INTRODUCE CHANGED REALITY'}</button>
        <p style={{fontSize:13}}>This demonstration evaluates a declared hypothetical scenario only. It does not actuate equipment or demonstrate a production integration.</p>
      </section>

      <section className="ja-exam" id="challenge">
        <div className="ja-eyebrow">AUTHORITY JOURNEY · FOUR SCENARIOS</div>
        <h2>Can you make the correct governance determination?</h2>
        <p>Review the declared evidence, authority and standing. Choose the disposition that follows from each hypothetical case. All answers explain the reason—not just the result.</p>
        <div className="ja-case">
          <div className="ja-lesson-tag">SCENARIO {challengeIndex+1} OF {challenges.length}</div>
          <h3>{challenge.title}</h3><p>{challenge.facts}</p>
          <div className="ja-answers" role="group" aria-label="Choose a determination">
            {decisionOptions.map(option=><button key={option} type="button" className="ja-answer" data-chosen={selected===option} disabled={!!selected} onClick={()=>recordAnswer(option)}>{option}</button>)}
          </div>
          {selected&&<div className={'ja-feedback '+(selected!==challenge.correct?'bad':'')} role="status"><strong>{selected===challenge.correct?'CORRECT':'REEXAMINE THE REQUIREMENTS'} · {challenge.correct}</strong><p>{challenge.reason}</p></div>}
          <div className="ja-lesson-nav">
            <button type="button" className="ja-secondary" onClick={()=>setChallengeIndex(i=>Math.max(0,i-1))} disabled={challengeIndex===0}>← PREVIOUS CASE</button>
            <span style={{alignSelf:'center',fontSize:13}}>Your score: {score} / {answeredCount} answered correctly</span>
            {challengeIndex<challenges.length-1?<button type="button" className="ja-primary" onClick={()=>setChallengeIndex(i=>Math.min(challenges.length-1,i+1))} disabled={!selected}>NEXT CASE →</button>:<button type="button" className="ja-primary" onClick={()=>{setAnswers({});setChallengeIndex(0)}}>↺ RESTART CHALLENGE</button>}
          </div>
        </div>
      </section>

      <section className="ja-doc" aria-label="Technical reference">
        <div className="ja-eyebrow">PRIMARY TECHNICAL REFERENCE · VERSION 3.0</div>
        <strong>Justified Autonomy — Institutional Technical Publication</strong>
        <p>Eleven-page architectural exploration by Greggory Don Butler. Covers the three requirements, eight-link chain, commitment revalidation, changed-reality scenario, and the limits of what a demonstration can establish.</p>
        <a className="ja-primary" href={technicalPdf} target="_blank" rel="noopener noreferrer">OPEN TECHNICAL PUBLICATION (PDF) ↗</a>
      </section>

      <footer className="ja-foot">
        <div className="ja-eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION</div>
        <h2>Autonomy is capability.<br/><span style={{color:'#f6cd72'}}>Justification governs permission.</span></h2>
        <p><strong>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</strong></p>
        <p>No admissible evidence. No admissible execution.</p>
        <p>Founder: Greggory Don Butler · <a href="https://www.ta14exchange.com">TA-14 AI Governance Exchange</a></p>
        <p style={{fontSize:12}}>Public educational architectural exploration · November 2026. Illustrations and simulation are hypothetical, not third-party validation, legal certification, deployed implementation or authorization to operate any real facility.</p>
      </footer>
    </div>
  </main>;
}
