'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Lesson = {
  number: string;
  title: string;
  objective: string;
  image: string;
  narration: string;
  question: string;
  answers: [string, string, string];
  correct: number;
  rationale: string;
  principle: string;
};

const lessons: Lesson[] = [
  {
    number: '01',
    title: 'The Birth of FGAI',
    objective: 'Distinguish autonomous capability from justified execution.',
    image: '/Fully%20Governed%20Autonomy%20Institute%20Atrium.png',
    narration: 'Founded as an initiative of TA-14 Authority Governance Institution LLC, FGAI advances Justified Autonomy, Consequence Governance and Institutional Accountability. The founding charter dated November 26, 2026 remains a draft pending adoption.',
    question: 'A building operator installs an autonomous controller. Does installation alone authorize every action the controller can propose?',
    answers: ['Yes. Installation grants general execution permission.', 'No. Each consequential action needs applicable authority and conditions.', 'Yes, provided the controller has an AI capability.'],
    correct: 1,
    rationale: 'Capability is not permission. Establish the applicable authority and conditions for each consequential action.',
    principle: 'AUTONOMOUS CAPABILITY IS NOT PERMISSION.'
  },
  {
    number: '02',
    title: 'The Evolution of Autonomy',
    objective: 'Understand the proposed distinction between Level 4 and Level 5.',
    image: '/The%20Evolution%20of%20Governed%20Autonomy.png',
    narration: 'Level zero: No Connectivity. Level one: Connected. Level two: Described. Level three: Interoperable. Level four: Autonomy-Ready. Level five: Fully Governed Autonomy. Level five is TA-14’s proposal, not an adopted industry standard. It adds an enforceable execution boundary rather than merely more automation.',
    question: 'An interoperable system can autonomously adjust ventilation. Is it necessarily Level 5?',
    answers: ['Yes. Interoperability is enough.', 'Yes. Any autonomous optimization qualifies.', 'No. Consequential commands must also be independently governed at execution.'],
    correct: 2,
    rationale: 'Level 4 describes the ability to act; the proposed Level 5 requires justified permission enforced at the moment of execution.',
    principle: 'LEVEL 4: CAN ACT. LEVEL 5: MAY ACT, IF JUSTIFIED NOW.'
  },
  {
    number: '03',
    title: 'Justified Autonomy',
    objective: 'Separate prediction from present justification.',
    image: '/Justified%20Autonomy_%20Prediction%20Is%20Not%20Permission.png',
    narration: 'Prediction can inform a decision but cannot independently establish permission now. Evidence must remain admissible, authority applicable and standing established when execution occurs. A forecast is not proof that these conditions currently hold.',
    question: 'A forecast predicts clean outdoor air, but the current outdoor sensor record is stale. Should the automated damper open on that forecast alone?',
    answers: ['ALLOW: the prediction is sufficient.', 'HOLD: obtain admissible evidence and follow authorized safety fallback policy.', 'ALLOW: the forecast is more useful than the stale sensor.'],
    correct: 1,
    rationale: 'HOLD the proposed action pending adequate evidence; follow applicable safety procedures and authorized fallback policies. The image includes a misleading green check beside stale evidence; the actual instructional determination is that stale evidence is NOT admissible.',
    principle: 'PREDICTION IS NOT PERMISSION.'
  },
  {
    number: '04',
    title: 'The Architecture of Governance',
    objective: 'Identify the three prerequisites for admissible execution.',
    image: '/The%20Architecture%20of%20Governance.png',
    narration: 'Admissible Evidence concerns attributable, relevant and sufficiently current evidence. Applicable Authority concerns the governing rules and permissions for the action. Established Standing concerns whether the actor is entitled to exercise that authority in context. Admissible Execution Architecture provides the execution boundary; Admissible Computation Architecture, Atmospheric Integrity Records and Environmental Integrity Governance contribute computation, atmospheric evidence and environmental consequence governance respectively.',
    question: 'A valid sensor reading supports a command, but the requesting actor has no established standing. Is the evidence enough?',
    answers: ['Yes. Accurate evidence always authorizes action.', 'Yes, if energy savings are forecast.', 'No. Evidence, authority and standing must all be established.'],
    correct: 2,
    rationale: 'All three prerequisites must be established. Without standing, do not authorize the command.',
    principle: 'ADMISSIBLE EVIDENCE · APPLICABLE AUTHORITY · ESTABLISHED STANDING.'
  },
  {
    number: '05',
    title: 'TA-14 AuthorityGate',
    objective: 'Distinguish a proposed decision from authorized execution.',
    image: '/AuthorityGate%E2%84%A2_%20Decision%20to%20Consequence.png',
    narration: 'AuthorityGate is TA-14’s execution-governance software based on Admissible Execution Architecture. Its canonical dispositions are ALLOW, HOLD, DENY and ESCALATE. ALLOW authorizes a bounded action when prerequisites are satisfied; HOLD withholds pending resolution; DENY refuses an inadmissible action; ESCALATE refers a matter to appropriate authority without granting execution permission. This is an architectural explanation, not a claim of independently verified production readiness.',
    question: 'A command was authorized earlier, but its authority is revoked before execution. What should happen?',
    answers: ['Execute because the prior authorization was valid then.', 'Reevaluate at execution; refuse action under revoked authority.', 'Execute first and notify the owner later.'],
    correct: 1,
    rationale: 'Do not execute under revoked authority. Reevaluate at the boundary and refuse invalid authorization. No prior ALLOW survives loss of applicable authority.',
    principle: 'ALLOW · HOLD · DENY · ESCALATE.'
  },
  {
    number: '06',
    title: 'Institutional Accountability',
    objective: 'Make governance attributable beyond individual leadership.',
    image: '/Institutional%20Accountability%20Exhibit.png',
    narration: 'Accountability requires identifiable authority, documented decisions, auditable evidence and verifiable outcomes. Institutional continuity requires that policies, responsibilities and records survive leadership changes. A founder’s personal approval cannot substitute for a durable governance process.',
    question: 'A founder leaves and a successor cannot locate the basis for an automated decision. Is accountability established?',
    answers: ['Yes. The founder was trusted.', 'No. Preserve authority assignments and reviewable evidence of execution.', 'Yes. The system is already deployed.'],
    correct: 1,
    rationale: 'Not adequately. Institutional accountability depends on attributable records, authority assignments and reviewable execution evidence that endure.',
    principle: 'GOVERNANCE MUST OUTLAST ANY ONE OPERATOR.'
  },
  {
    number: '07',
    title: 'Consequence Governance Across Industries',
    objective: 'Recognize the common execution boundary across domains.',
    image: '/Consequence%20Governance%20Across%20Industries.png',
    narration: 'Consequence governance applies wherever interpretation of data becomes a binding action: buildings, healthcare, finance, insurance, robotics, transport, energy, water and human decisions. Domain-specific laws and safety requirements remain controlling. Atmospheric Integrity Records can support atmospheric evidence; Environmental Integrity Governance addresses environmental trade-offs without treating energy savings alone as proof of acceptable outcomes.',
    question: 'A controller saves energy by reducing ventilation, but indoor air evidence indicates a possible harmful consequence. Is energy optimization sufficient justification?',
    answers: ['No. Evaluate applicable safety and environmental constraints and current evidence.', 'Yes. Optimizing energy always takes precedence.', 'Yes. A lower utility bill is sufficient proof.'],
    correct: 0,
    rationale: 'No. Consequential actions require evaluation of evidence quality, authority, and relevant environmental and safety constraints.',
    principle: 'CONSEQUENCE GOVERNANCE EXTENDS BEYOND AI GOVERNANCE.'
  },
  {
    number: '08',
    title: 'The Future of Fully Governed Autonomy',
    objective: 'Connect justification, accountability and verification.',
    image: '/The%20Future%20of%20Fully%20Governed%20Autonomy.png',
    narration: 'FGAI invites independent examination, education and interdisciplinary collaboration. Demonstrated capabilities must be distinguished from proposals and independently verified capabilities. Participation is not certification, accreditation or execution authority. The founding commitment is justification before execution, accountability through governance and verification after consequence.',
    question: 'A participant claims FGAI membership certifies a product as fully governed. Is the claim supported?',
    answers: ['Yes. Membership is equivalent to certification.', 'Yes. Attendance qualifies as independent validation.', 'No. Participation does not confer certification or execution authority.'],
    correct: 2,
    rationale: 'Membership does not confer certification. Technical and institutional claims require an appropriate, independently supportable basis.',
    principle: 'JUSTIFICATION BEFORE EXECUTION. VERIFICATION AFTER CONSEQUENCE.'
  }
];


const learningTransitions = [
  [
    "An installed autonomous controller may be capable of action, but capability alone never supplies permission to bind a consequence to reality.",
    "We will trace the proposed progression from connectivity and interoperability to Level 4 Autonomy-Ready and TA-14's proposed Level 5, Fully Governed Autonomy."
  ],
  [
    "Level 4 describes autonomous capability. Proposed Level 5 adds independent evaluation of whether a particular consequence is justified at execution.",
    "We will test why even a convincing prediction cannot substitute for current, attributable evidence when a real damper action is proposed."
  ],
  [
    "A forecast can inform an operator, but stale sensor evidence cannot authorize an opening command. In this teaching case, the correct disposition is HOLD.",
    "We will examine the three prerequisites that must be established together: Admissible Evidence, Applicable Authority and Established Standing."
  ],
  [
    "Accurate data cannot authorize action by itself. An execution boundary must establish the evidence, applicable authority and the actor's standing together.",
    "We will see how TA-14 AuthorityGate evaluates a proposed command and returns ALLOW, HOLD, DENY or ESCALATE before the consequence occurs."
  ],
  [
    "An earlier authorization is not permanent. AuthorityGate must reassess current conditions, including revocation, at the moment of execution.",
    "We will move from one governed command to the larger question: how institutions preserve accountable decisions and authority when people and leadership change."
  ],
  [
    "Accountability requires enduring authority records, attributable decisions and verifiable outcomes—not reliance on a founder's personal approval.",
    "We will apply consequence governance beyond buildings to healthcare, finance, transport, water, energy and other fields where interpreted data can change reality."
  ],
  [
    "Energy or financial optimization is not sufficient if it violates applicable safety and environmental constraints. Consequence governance concerns the governed action across domains.",
    "We will close by exploring independent examination, the limits of membership claims and the founding commitment of the Fully Governed Autonomy Institute."
  ]
] as const;

function LearningBridge({ index }: { index: number }) {
  const [learned, next] = learningTransitions[index];
  const nextNumber = String(index + 2).padStart(2, '0');
  return (
    <aside aria-label={'Learning transition to exhibit ' + nextNumber} style={{
      margin: '22px 0 30px', padding: 'clamp(23px,4vw,39px)', borderRadius: 22,
      border: '1px solid rgba(237,199,119,.34)',
      background: 'linear-gradient(110deg,rgba(25,43,67,.95),rgba(9,20,40,.98))'
    }}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24}}>
        <div>
          <div style={{fontSize: 11, fontWeight: 900, letterSpacing: '.16em', color: '#edc777'}}>WHAT WE JUST LEARNED</div>
          <p style={{fontSize: 18, color: '#ecf3fc', lineHeight: 1.7, margin: '12px 0 0'}}>{learned}</p>
        </div>
        <div style={{borderLeft: '3px solid rgba(237,199,119,.5)', paddingLeft: 23}}>
          <div style={{fontSize: 11, fontWeight: 900, letterSpacing: '.16em', color: '#edc777'}}>WHAT WE'RE ABOUT TO LEARN · EXHIBIT {nextNumber}</div>
          <p style={{fontSize: 18, color: '#ecf3fc', lineHeight: 1.7, margin: '12px 0 0'}}>{next}</p>
          <a href={'#exhibit-' + nextNumber} style={{display:'inline-block',marginTop: 14, color: '#f0d28c',fontWeight: 800,textDecoration:'underline'}}>Continue to exhibit {nextNumber} ↓</a>
        </div>
      </div>
    </aside>
  );
}

const gold = '#edc777';
const panel = { background: 'linear-gradient(145deg,rgba(12,27,49,.98),rgba(3,11,25,.98))', border: '1px solid rgba(237,199,119,.27)', borderRadius: 22 } as const;
const buttonStyle = { border: '1px solid rgba(237,199,119,.4)', background: 'rgba(237,199,119,.08)', color: '#f7e8c8', borderRadius: 10, padding: '11px 15px', fontSize: 13, fontWeight: 800, cursor: 'pointer' } as const;

function Samantha({ text, number }: { text: string; number: string }) {
  const [mode, setMode] = useState<'idle' | 'playing' | 'paused'>('idle');
  useEffect(() => () => { if (typeof window !== 'undefined') window.speechSynthesis?.cancel(); }, []);

  const play = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(v => /samantha/i.test(v.name)) || voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en')) || null;
    utterance.lang = 'en-US';
    utterance.rate = 0.84;
    utterance.pitch = 0.97;
    utterance.onend = () => setMode('idle');
    utterance.onerror = () => setMode('idle');
    window.speechSynthesis.speak(utterance);
    setMode('playing');
  };
  const pause = () => { window.speechSynthesis.pause(); setMode('paused'); };
  const resume = () => { window.speechSynthesis.resume(); setMode('playing'); };
  const stop = () => { window.speechSynthesis.cancel(); setMode('idle'); };
  return (
    <div style={{ marginTop: 21, border: '1px solid rgba(237,199,119,.24)', background: 'rgba(237,199,119,.055)', borderRadius: 14, padding: 20 }}>
      <div style={{ color: gold, fontWeight: 900, fontSize: 11, letterSpacing: '.14em' }}>SAMANTHA · EXHIBIT {number} NARRATION</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 12 }}>
        <button type="button" style={buttonStyle} onClick={play}>▶ Play</button>
        <button type="button" style={buttonStyle} onClick={pause} disabled={mode !== 'playing'}>Ⅱ Pause</button>
        <button type="button" style={buttonStyle} onClick={resume} disabled={mode !== 'paused'}>▶ Resume</button>
        <button type="button" style={buttonStyle} onClick={stop} disabled={mode === 'idle'}>■ Stop</button>
      </div>
      <p style={{ color: '#c7d2e0', lineHeight: 1.8, marginBottom: 0, fontSize: 15 }}>{text}</p>
      <p style={{ fontSize: 11, marginTop: 10, color: '#889bb3' }}>Browser-based narration selects the Samantha voice when available; otherwise an available English voice is used.</p>
    </div>
  );
}

function Challenge({ lesson }: { lesson: Lesson }) {
  const [answer, setAnswer] = useState<number | null>(null);
  return (
    <div style={{ marginTop: 20, border: '1px solid rgba(133,169,211,.23)', borderRadius: 16, padding: 'clamp(18px,3vw,26px)', background: 'rgba(11,24,43,.89)' }}>
      <div style={{ color: '#acc9e9', letterSpacing: '.14em', fontSize: 11, fontWeight: 900 }}>INTERACTIVE GOVERNANCE CHALLENGE</div>
      <h3 style={{ fontSize: 'clamp(18px,2.5vw,23px)', margin: '12px 0 17px', lineHeight: 1.5 }}>{lesson.question}</h3>
      <div style={{ display: 'grid', gap: 10 }}>
        {lesson.answers.map((option, idx) => (
          <button key={option} type="button" onClick={() => setAnswer(idx)} aria-pressed={answer === idx} style={{
            textAlign: 'left', cursor: 'pointer', padding: '15px 17px', borderRadius: 11, fontSize: 14, lineHeight: 1.55,
            border: answer === idx ? '1px solid #edc777' : '1px solid rgba(175,201,229,.23)',
            background: answer === idx ? 'rgba(237,199,119,.15)' : 'rgba(24,42,64,.62)',
            color: '#f2f5fc', fontWeight: answer === idx ? 800 : 500
          }}>{String.fromCharCode(65 + idx)}. {option}</button>
        ))}
      </div>
      {answer !== null && <div role="status" style={{
        marginTop: 14, padding: 17, borderRadius: 10, background: answer === lesson.correct ? 'rgba(69,170,118,.13)' : 'rgba(237,199,119,.10)',
        border: answer === lesson.correct ? '1px solid rgba(102,216,152,.5)' : '1px solid rgba(237,199,119,.4)',
        color: '#ecf2fa', lineHeight: 1.7
      }}>
        <strong style={{ color: answer === lesson.correct ? '#9ee9ba' : '#f3d88b' }}>{answer === lesson.correct ? 'Correct determination' : 'Not yet admissible — review the governing principle'}</strong>
        <div>{lesson.rationale}</div>
        <button type="button" onClick={() => setAnswer(null)} style={{ ...buttonStyle, marginTop: 12 }}>Try again</button>
      </div>}
    </div>
  );
}

export default function FGAIShowroom() {
  return (
    <main style={{ minHeight: '100vh', background: 'radial-gradient(circle at 55% 0%,#13294a 0%,#060f21 38%,#030814 100%)', color: '#f6f1e7', fontFamily: 'Inter,system-ui,sans-serif', padding: '22px 16px 90px' }}>
      <div style={{ maxWidth: 1250, margin: '0 auto' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '11px 0 20px', borderBottom: '1px solid rgba(237,199,119,.25)' }}>
          <Link href="/" style={{ color: gold, textDecoration: 'none', fontWeight: 800 }}>← TA-14 Exchange</Link>
          <div style={{ fontSize: 11, letterSpacing: '.13em', color: '#aebdd1', fontWeight: 800 }}>FGAI · EDUCATIONAL SHOWROOM · v1.0</div>
          <a href="https://www.linkedin.com/groups/42843654/" target="_blank" rel="noopener noreferrer" style={{ color: '#cce0ff', textDecoration: 'none', fontWeight: 800 }}>Official Community ↗</a>
        </nav>

        <header style={{ ...panel, marginTop: 26, overflow: 'hidden' }}>
          <Image src="/The%20Architecture%20of%20Accountable%20Autonomy.png" alt="FGAI institutional banner depicting Levels 0 through 5 of autonomy, with a global consequence-governance scope" width={1648} height={928} priority sizes="(max-width: 1250px) 100vw, 1250px" style={{ display: 'block', width: '100%', height: 'auto' }} />
          <div style={{ padding: 'clamp(25px,5vw,57px)' }}>
            <div style={{ fontSize: 11, color: gold, letterSpacing: '.19em', fontWeight: 900 }}>AN INITIATIVE OF TA-14 AUTHORITY GOVERNANCE INSTITUTION LLC</div>
            <h1 style={{ fontSize: 'clamp(38px,6.5vw,78px)', letterSpacing: '-.055em', lineHeight: 1.03, margin: '16px 0' }}>Fully Governed<br/><span style={{ color: gold }}>Autonomy Institute</span></h1>
            <p style={{ fontSize: 'clamp(17px,2.2vw,23px)', color: '#c5d2e3', lineHeight: 1.6, maxWidth: 930 }}>The architecture of accountable autonomy. Eight educational exhibits connecting evidence, authority, standing, execution and verifiable consequences.</p>
            <p style={{ fontSize: 16, color: '#f4dca6', fontWeight: 800 }}>Justified Autonomy. Accountable Execution. Verifiable Consequences.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 25 }}>
              <a href="/FGAI_Showroom_Educational_Guide%20(1).pdf" target="_blank" rel="noopener noreferrer" style={{ ...buttonStyle, display: 'inline-block', textDecoration: 'none', background: '#edc777', color: '#101a2c' }}>Download educational guide + founding charter (PDF) ↗</a>
              <a href="#exhibits" style={{ ...buttonStyle, display: 'inline-block', textDecoration: 'none' }}>Explore eight exhibits ↓</a>
            </div>
            <p style={{ fontSize: 13, color: '#9eb0c9', marginTop: 20, lineHeight: 1.7 }}>Founded November 26, 2026. The founding charter remains a draft pending formal adoption. Level 5 is a TA-14 proposed classification, not an adopted industry standard. Lessons and challenges are educational demonstrations, not operational authorizations or certification.</p>
          </div>
        </header>

        <section style={{ ...panel, marginTop: 22, padding: 'clamp(22px,4vw,42px)' }}>
          <div style={{ fontSize: 11, color: gold, letterSpacing: '.17em', fontWeight: 900 }}>FOUNDATIONAL DOCTRINE</div>
          <h2 style={{ fontSize: 'clamp(27px,4.5vw,45px)', lineHeight: 1.15, margin: '14px 0' }}>Autonomous capability does not independently constitute permission.</h2>
          <p style={{ color: '#c4d3e5', fontSize: 17, lineHeight: 1.75 }}>Intelligence is not authority. A forecast is not proof of current permission. Before a consequential act becomes binding on reality, examine Admissible Evidence, Applicable Authority and Established Standing at the execution boundary.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginTop: 22 }}>
            {['ADMISSIBLE EVIDENCE', 'APPLICABLE AUTHORITY', 'ESTABLISHED STANDING'].map((label, i) => <div key={label} style={{ border: '1px solid rgba(237,199,119,.3)', borderRadius: 12, padding: 19, color: gold, fontWeight: 900, letterSpacing: '.05em' }}>{'0' + (i + 1)} · {label}</div>)}
          </div>
        </section>

        <div id="exhibits" style={{ padding: '45px 4px 8px', scrollMarginTop: 20 }}>
          <div style={{ fontSize: 11, color: gold, fontWeight: 900, letterSpacing: '.2em' }}>EIGHT EXHIBITS · EIGHT GOVERNANCE CHALLENGES</div>
          <h2 style={{ fontSize: 'clamp(34px,5.5vw,62px)', letterSpacing: '-.045em', margin: '10px 0' }}>Walk the boundary from capability to consequence.</h2>
        </div>

        {lessons.map((lesson, index) => (
          <div key={lesson.number}>
          <section key={lesson.number} id={'exhibit-' + lesson.number} style={{ ...panel, marginTop: 20, padding: 'clamp(18px,3.7vw,42px)', scrollMarginTop: 22 }}>
            <div style={{ color: gold, letterSpacing: '.17em', fontSize: 11, fontWeight: 900 }}>EXHIBIT {lesson.number} OF 08</div>
            <h2 style={{ fontSize: 'clamp(30px,4.8vw,53px)', lineHeight: 1.12, letterSpacing: '-.04em', margin: '11px 0' }}>{lesson.title}</h2>
            <p style={{ fontSize: 17, color: '#c7d5e4', lineHeight: 1.7, marginTop: 0 }}><strong style={{ color: '#f3d99d' }}>Learning objective:</strong> {lesson.objective}</p>
            <Image src={lesson.image} alt={lesson.title + ' — FGAI educational illustration'} width={1648} height={928} sizes="(max-width: 1250px) 100vw, 1250px" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 14, border: '1px solid rgba(237,199,119,.24)' }} />
            {lesson.number === '03' && <p style={{ borderLeft: '3px solid #edc777', padding: '10px 15px', color: '#f6e1af', background: 'rgba(237,199,119,.09)', lineHeight: 1.65, fontSize: 13 }}>Illustration clarification: the green check alongside stale evidence is a graphic error. A stale outdoor sensor record is not admissible current evidence; the correct instructional disposition is HOLD. The challenge and narration below govern the teaching case.</p>}
            <div style={{ marginTop: 17, padding: '17px 21px', background: 'rgba(237,199,119,.075)', borderLeft: '3px solid #edc777', borderRadius: 8, fontWeight: 900, letterSpacing: '.02em', color: gold }}>{lesson.principle}</div>
            <Samantha text={lesson.narration} number={lesson.number} />
            <Challenge lesson={lesson} />
          </section>
          {index < lessons.length - 1 && <LearningBridge index={index} />}
          </div>
        ))}

        <footer style={{ ...panel, marginTop: 28, padding: 'clamp(24px,4vw,43px)' }}>
          <div style={{ color: gold, fontSize: 11, letterSpacing: '.17em', fontWeight: 900 }}>FOUNDING COMMITMENT</div>
          <h2 style={{ fontSize: 'clamp(24px,4vw,43px)', lineHeight: 1.4, margin: '15px 0' }}>JUSTIFICATION BEFORE EXECUTION.<br/>ACCOUNTABILITY THROUGH GOVERNANCE.<br/>VERIFICATION AFTER CONSEQUENCE.</h2>
          <p style={{ color: '#c4d3e5', fontSize: 16, lineHeight: 1.7, maxWidth: 800 }}>FGAI welcomes independent examination, interdisciplinary education and constructive collaboration. Participation is not certification, accreditation, endorsement or authority to execute consequential actions.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 23 }}>
            <a href="https://www.linkedin.com/groups/42843654/" target="_blank" rel="noopener noreferrer" style={{ ...buttonStyle, textDecoration: 'none', background: '#edc777', color: '#08162c' }}>Join the official FGAI LinkedIn community ↗</a>
            <a href="/FGAI_Showroom_Educational_Guide%20(1).pdf" target="_blank" rel="noopener noreferrer" style={{ ...buttonStyle, textDecoration: 'none' }}>Read founding charter + educational guide ↗</a>
          </div>
          <p style={{ fontSize: 12, color: '#8ea2bf', marginTop: 27 }}>TA-14 Authority Governance Institution LLC · FGAI educational showroom · Version 1.0 · November 26, 2026</p>
        </footer>
      </div>
    </main>
  );
}
