'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type PathwayId = 'foundations' | 'builder' | 'reviewer' | 'credential';

type AnswerMap = {
  experience: string;
  goal: string;
  confidence: string;
};

const anchors = [
  'Reality',
  'Record',
  'Continuity',
  'Admissibility',
  'Binding',
  'Commit',
  'Execution',
  'Outcome',
];

const pathways: Array<{
  id: PathwayId;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
}> = [
  {
    id: 'foundations',
    eyebrow: 'New to TA-14',
    title: 'Start with governance foundations',
    description:
      'Learn what a governed route is, why evidence is not automatically admissible, and where consequential execution must stop.',
    href: '/academy/what-is-a-route',
    action: 'Begin foundations',
  },
  {
    id: 'builder',
    eyebrow: 'Ready to construct',
    title: 'Learn to build a governed route',
    description:
      'Move through bounded questions covering purpose, actors, consequence, boundary, evidence, authority, continuity, and determination.',
    href: '/workspace/build',
    action: 'Enter Route Builder',
  },
  {
    id: 'reviewer',
    eyebrow: 'Ready to challenge',
    title: 'Learn bounded review',
    description:
      'Inspect preserved routes, identify the earliest failure, issue attributable findings, and preserve objections and corrections.',
    href: '/workspace/demonstrations',
    action: 'Open demonstrations',
  },
  {
    id: 'credential',
    eyebrow: 'Professional progression',
    title: 'Prepare for competency evidence',
    description:
      'Understand the distinction between learning, practice, assessment, certification, and public Registry verification.',
    href: '/academy/what-is-a-route',
    action: 'Review requirements',
  },
];

const questions = [
  {
    id: 'experience' as const,
    step: '01',
    title: 'How familiar are you with governed routes?',
    helper: 'Choose the answer that best reflects your current experience.',
    options: [
      ['new', 'I am completely new'],
      ['some', 'I understand the basic idea'],
      ['experienced', 'I have already built or reviewed routes'],
    ],
  },
  {
    id: 'goal' as const,
    step: '02',
    title: 'What do you want to accomplish first?',
    helper: 'This only recommends a starting point. It does not grant authority or competency.',
    options: [
      ['learn', 'Understand the architecture'],
      ['build', 'Build a governed route'],
      ['review', 'Review and challenge routes'],
      ['credential', 'Prepare for assessment and credentials'],
    ],
  },
  {
    id: 'confidence' as const,
    step: '03',
    title: 'Can you currently explain why an action should be allowed to proceed?',
    helper: 'There is no penalty for uncertainty. “Not yet” is an honest starting condition.',
    options: [
      ['not-yet', 'Not yet'],
      ['partly', 'Partly, but I need structure'],
      ['yes', 'Yes, with preserved evidence and authority'],
    ],
  },
];

function recommendationFor(answers: AnswerMap): PathwayId {
  if (answers.goal === 'credential') return 'credential';
  if (answers.goal === 'review' && answers.experience === 'experienced') return 'reviewer';
  if (
    answers.goal === 'build' &&
    answers.experience !== 'new' &&
    answers.confidence !== 'not-yet'
  ) {
    return 'builder';
  }
  return 'foundations';
}

export default function AcademyStartPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({
    experience: '',
    goal: '',
    confidence: '',
  });
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[step];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : '';
  const recommendation = useMemo(
    () => pathways.find((pathway) => pathway.id === recommendationFor(answers)) ?? pathways[0],
    [answers],
  );

  function chooseAnswer(value: string) {
    setAnswers((existing) => ({ ...existing, [currentQuestion.id]: value }));
  }

  function continueFlow() {
    if (!currentAnswer) return;
    if (step === questions.length - 1) {
      setFinished(true);
      return;
    }
    setStep((value) => value + 1);
  }

  function restart() {
    setAnswers({ experience: '', goal: '', confidence: '' });
    setStep(0);
    setFinished(false);
  }

  return (
    <main className="start-page">
      <div className="cosmos" aria-hidden="true">
        <span className="nebula nebula-a" />
        <span className="nebula nebula-b" />
        <span className="stars stars-a" />
        <span className="stars stars-b" />
        <span className="meteor meteor-a" />
        <span className="meteor meteor-b" />
        <span className="planet planet-a" />
        <span className="planet planet-b" />
      </div>

      <header className="shell-header">
        <Link className="brand" href="/academy" aria-label="Return to TA-14 Academy">
          <span className="brand-mark">TA-14</span>
          <span>
            <strong>Academy</strong>
            <small>Start Here</small>
          </span>
        </Link>
        <div className="header-status">
          <span className="status-dot" />
          <span>Orientation · Education</span>
          <b>v1.0</b>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Gate B · Orientation</p>
          <h1>
            Before you use the tools,
            <em> understand what earns the right to proceed.</em>
          </h1>
          <p className="lede">
            TA-14 Academy guides you from uncertainty to governed execution without inventing
            evidence, authority, or favorable answers. Start with the architecture, choose a
            pathway, and receive a recommended next step.
          </p>
          <div className="hero-actions">
            <a className="primary" href="#readiness">Find my starting point <span>→</span></a>
            <Link className="secondary" href="/academy/what-is-a-route">Begin the first lesson</Link>
          </div>
        </div>

        <aside className="orientation-card">
          <p>What the Academy protects</p>
          <h2>Consequence must never outrun its evidence.</h2>
          <div className="guardrails">
            <span>Missing evidence remains missing</span>
            <span>Expired authority remains invalid</span>
            <span>Broken continuity stops progression</span>
            <span>Completion never equals competence</span>
          </div>
        </aside>
      </section>

      <section className="distinctions" aria-label="Essential Academy distinctions">
        <article>
          <span>01</span>
          <h2>Workflow is not a governed route.</h2>
          <p>A workflow moves work. A governed route preserves the conditions that justify consequence.</p>
        </article>
        <article>
          <span>02</span>
          <h2>A record is not automatically evidence.</h2>
          <p>Evidence requires provenance, attribution, freshness, continuity, scope, and relevance.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Completion is not ALLOW.</h2>
          <p>A finished form cannot substitute for admissibility, valid authority, or supported reasoning.</p>
        </article>
      </section>

      <section className="architecture" id="architecture">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The visible governing movement</p>
            <h2>Eight anchors. One consequence-bearing chain.</h2>
          </div>
          <p>
            These eight anchors orient the learner. They remain distinct from the verified complete
            24-link TA-14 runtime architecture.
          </p>
        </div>

        <ol className="chain" aria-label="Eight visible TA-14 architecture anchors">
          {anchors.map((anchor, index) => (
            <li key={anchor}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{anchor}</strong>
              {index < anchors.length - 1 ? <b aria-hidden="true">→</b> : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="readiness" id="readiness">
        <div className="readiness-copy">
          <p className="eyebrow">Guided readiness check</p>
          <h2>Three questions. One clear next step.</h2>
          <p>
            This is an orientation recommendation only. It is not an assessment, credential,
            determination, or authorization to execute.
          </p>
          <div className="progress-labels" aria-hidden="true">
            {questions.map((question, index) => (
              <span key={question.id} className={finished || index <= step ? 'active' : ''}>
                {question.step}
              </span>
            ))}
          </div>
        </div>

        <div className="interview-card" aria-live="polite">
          {!finished ? (
            <>
              <div className="interview-topline">
                <span>Step {step + 1} of {questions.length}</span>
                <b>{Math.round(((step + 1) / questions.length) * 100)}%</b>
              </div>
              <div className="progress-track"><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
              <h3>{currentQuestion.title}</h3>
              <p>{currentQuestion.helper}</p>

              <div className="options" role="radiogroup" aria-label={currentQuestion.title}>
                {currentQuestion.options.map(([value, label]) => {
                  const selected = currentAnswer === value;
                  return (
                    <button
                      className={selected ? 'selected' : ''}
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => chooseAnswer(value)}
                    >
                      <span className="radio"><i /></span>
                      <strong>{label}</strong>
                    </button>
                  );
                })}
              </div>

              <div className="interview-actions">
                <button
                  className="back"
                  type="button"
                  disabled={step === 0}
                  onClick={() => setStep((value) => Math.max(0, value - 1))}
                >
                  ← Back
                </button>
                <button className="continue" type="button" disabled={!currentAnswer} onClick={continueFlow}>
                  {step === questions.length - 1 ? 'Show my pathway' : 'Continue'} <span>→</span>
                </button>
              </div>
            </>
          ) : (
            <div className="result">
              <span className="result-mark">✓</span>
              <p className="result-eyebrow">Recommended starting pathway</p>
              <h3>{recommendation.title}</h3>
              <p>{recommendation.description}</p>
              <div className="result-boundary">
                Recommendation only · No authority granted · No competency inferred
              </div>
              <div className="result-actions">
                <Link className="continue" href={recommendation.href}>{recommendation.action} <span>→</span></Link>
                <button className="back" type="button" onClick={restart}>Retake check</button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="pathway-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Choose directly</p>
            <h2>Four pathways. No dead ends.</h2>
          </div>
          <p>Every pathway returns to the same governing principle: no admissible evidence, no admissible execution.</p>
        </div>
        <div className="pathway-grid">
          {pathways.map((pathway, index) => (
            <article key={pathway.id}>
              <div className="pathway-number">{String(index + 1).padStart(2, '0')}</div>
              <p>{pathway.eyebrow}</p>
              <h3>{pathway.title}</h3>
              <span>{pathway.description}</span>
              <Link href={pathway.href}>{pathway.action} <b>↗</b></Link>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <div>
          <strong>No admissible evidence. No admissible execution.</strong>
          <span>TA-14 Academy · Seventh major door of the Exchange</span>
        </div>
        <Link href="/academy">Return to Academy</Link>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; }
        :global(body) { margin: 0; background: #02070d; }

        .start-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #edf7ff;
          background:
            radial-gradient(circle at 18% 10%, rgba(40, 164, 255, .13), transparent 31%),
            radial-gradient(circle at 82% 16%, rgba(53, 240, 166, .08), transparent 30%),
            linear-gradient(180deg, #030a12 0%, #06111d 42%, #02070d 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .cosmos { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .nebula { position: absolute; border-radius: 50%; filter: blur(70px); opacity: .28; animation: drift 18s ease-in-out infinite alternate; }
        .nebula-a { width: 430px; height: 430px; left: -150px; top: 180px; background: rgba(31, 150, 255, .26); }
        .nebula-b { width: 500px; height: 500px; right: -230px; top: 520px; background: rgba(43, 235, 160, .14); animation-delay: -7s; }
        .stars { position: absolute; inset: -20%; background-repeat: repeat; opacity: .58; }
        .stars-a { background-image: radial-gradient(circle, rgba(255,255,255,.85) 0 1px, transparent 1.4px); background-size: 83px 83px; animation: starMove 48s linear infinite; }
        .stars-b { background-image: radial-gradient(circle, rgba(85,216,255,.8) 0 1px, transparent 1.5px); background-size: 137px 137px; animation: starMove 70s linear infinite reverse; opacity: .34; }
        .meteor { position: absolute; width: 170px; height: 1px; background: linear-gradient(90deg, transparent, rgba(114,229,255,.9)); transform: rotate(-27deg); filter: drop-shadow(0 0 6px #54e8ff); animation: meteor 9s linear infinite; opacity: 0; }
        .meteor-a { top: 15%; left: -15%; }
        .meteor-b { top: 48%; left: -20%; animation-delay: 4.2s; }
        .planet { position: absolute; border-radius: 50%; opacity: .46; }
        .planet-a { width: 86px; height: 86px; right: 7%; top: 20%; background: radial-gradient(circle at 35% 30%, #75e8ff, #19466c 47%, #07131f 72%); box-shadow: -24px 12px 60px rgba(48,180,255,.22); animation: float 9s ease-in-out infinite; }
        .planet-b { width: 32px; height: 32px; left: 7%; top: 62%; background: radial-gradient(circle at 30% 30%, #8ff7c0, #1b5b46 58%, #071811); animation: float 7s ease-in-out infinite reverse; }

        .shell-header, .hero, .distinctions, .architecture, .readiness, .pathway-section, footer { position: relative; z-index: 2; }
        .shell-header {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(131, 178, 214, .14);
        }
        .brand { display: inline-flex; align-items: center; gap: 12px; color: inherit; text-decoration: none; }
        .brand-mark { display: grid; place-items: center; min-width: 58px; height: 42px; border: 1px solid rgba(83, 228, 255, .35); border-radius: 12px; color: #62eaff; background: rgba(6,18,30,.72); font-size: .72rem; font-weight: 950; letter-spacing: .08em; box-shadow: inset 0 0 24px rgba(64,210,255,.08); }
        .brand > span:last-child { display: flex; flex-direction: column; gap: 2px; }
        .brand strong { font-size: .95rem; letter-spacing: .02em; }
        .brand small { color: #8ea6b9; font-size: .7rem; }
        .header-status { display: flex; align-items: center; gap: 9px; color: #a9bdcc; font-size: .72rem; }
        .header-status b { padding: 6px 9px; border: 1px solid rgba(117,159,190,.18); border-radius: 999px; color: #d9e8f3; }
        .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #39f2a1; box-shadow: 0 0 14px rgba(57,242,161,.8); }

        .hero { width: min(1180px, calc(100% - 40px)); margin: 0 auto; padding: 92px 0 72px; display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(320px, .65fr); gap: 70px; align-items: center; }
        .eyebrow { margin: 0 0 14px; color: #60e6ff; font-size: .72rem; font-weight: 950; letter-spacing: .18em; text-transform: uppercase; }
        .hero h1 { max-width: 820px; margin: 0; font-size: clamp(2.8rem, 6.2vw, 5.9rem); line-height: .98; letter-spacing: -.055em; }
        .hero h1 em { display: block; margin-top: 10px; color: transparent; background: linear-gradient(90deg, #62eaff, #44f0a9); -webkit-background-clip: text; background-clip: text; font-style: normal; }
        .lede { max-width: 760px; margin: 28px 0 0; color: #adbfcd; font-size: 1.08rem; line-height: 1.78; }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
        .primary, .secondary { min-height: 50px; display: inline-flex; align-items: center; justify-content: center; gap: 16px; padding: 0 20px; border-radius: 14px; text-decoration: none; font-size: .84rem; font-weight: 900; }
        .primary { color: #03120e; background: linear-gradient(135deg, #66efff, #42f0a5); box-shadow: 0 16px 45px rgba(56,231,176,.18); }
        .secondary { color: #eaf7ff; border: 1px solid rgba(120,178,214,.27); background: rgba(8,22,34,.6); }

        .orientation-card { padding: 30px; border: 1px solid rgba(99,218,255,.24); border-radius: 26px; background: linear-gradient(145deg, rgba(10,28,43,.83), rgba(4,13,22,.9)); box-shadow: 0 30px 100px rgba(0,0,0,.3), inset 0 1px rgba(255,255,255,.04); backdrop-filter: blur(18px); }
        .orientation-card > p { margin: 0 0 12px; color: #62eaff; font-size: .7rem; font-weight: 950; letter-spacing: .14em; text-transform: uppercase; }
        .orientation-card h2 { margin: 0; font-size: 1.65rem; line-height: 1.18; letter-spacing: -.025em; }
        .guardrails { display: grid; gap: 10px; margin-top: 24px; }
        .guardrails span { padding: 13px 14px; border: 1px solid rgba(111,161,197,.15); border-radius: 12px; color: #bfd0dc; background: rgba(255,255,255,.025); font-size: .78rem; }

        .distinctions { width: min(1180px, calc(100% - 40px)); margin: 0 auto 90px; display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid rgba(115,166,201,.16); border-radius: 24px; overflow: hidden; background: rgba(4,14,23,.62); }
        .distinctions article { padding: 28px; }
        .distinctions article + article { border-left: 1px solid rgba(115,166,201,.13); }
        .distinctions span { color: #52e9b0; font-size: .68rem; font-weight: 950; letter-spacing: .16em; }
        .distinctions h2 { margin: 12px 0 10px; font-size: 1.08rem; }
        .distinctions p { margin: 0; color: #91a8ba; font-size: .82rem; line-height: 1.6; }

        .architecture, .pathway-section { width: min(1180px, calc(100% - 40px)); margin: 0 auto; padding: 78px 0; border-top: 1px solid rgba(118,169,205,.14); }
        .section-heading { display: grid; grid-template-columns: 1.2fr .8fr; gap: 70px; align-items: end; }
        .section-heading h2 { margin: 0; font-size: clamp(2rem, 4.2vw, 3.8rem); line-height: 1.05; letter-spacing: -.045em; }
        .section-heading > p { margin: 0; color: #9db1c0; line-height: 1.75; }
        .chain { list-style: none; margin: 42px 0 0; padding: 0; display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); border: 1px solid rgba(92,224,255,.2); border-radius: 20px; overflow: hidden; background: rgba(5,18,28,.72); }
        .chain li { position: relative; min-height: 112px; display: flex; flex-direction: column; justify-content: center; gap: 8px; padding: 20px 18px; }
        .chain li + li { border-left: 1px solid rgba(110,160,196,.13); }
        .chain span { color: #49efad; font-size: .65rem; font-weight: 950; letter-spacing: .13em; }
        .chain strong { font-size: .83rem; }
        .chain b { position: absolute; right: -7px; top: 50%; z-index: 2; transform: translateY(-50%); color: #4bdcb5; font-weight: 400; }

        .readiness { width: min(1180px, calc(100% - 40px)); margin: 44px auto; padding: 46px; display: grid; grid-template-columns: .75fr 1.25fr; gap: 70px; align-items: start; border: 1px solid rgba(91,226,255,.2); border-radius: 30px; background: radial-gradient(circle at 0 0, rgba(41,166,255,.09), transparent 35%), linear-gradient(145deg, rgba(8,25,39,.88), rgba(3,12,20,.92)); box-shadow: 0 40px 120px rgba(0,0,0,.32); }
        .readiness-copy h2 { margin: 0; font-size: clamp(2rem, 4vw, 3.5rem); line-height: 1.05; letter-spacing: -.04em; }
        .readiness-copy > p:not(.eyebrow) { color: #9fb2c1; line-height: 1.75; }
        .progress-labels { display: flex; gap: 10px; margin-top: 28px; }
        .progress-labels span { display: grid; place-items: center; width: 38px; height: 38px; border: 1px solid rgba(120,164,194,.2); border-radius: 50%; color: #6f8799; font-size: .68rem; font-weight: 900; }
        .progress-labels span.active { color: #04140e; border-color: transparent; background: #4cebae; box-shadow: 0 0 22px rgba(76,235,174,.24); }
        .interview-card { min-height: 500px; padding: 32px; border: 1px solid rgba(126,177,211,.16); border-radius: 24px; background: rgba(2,10,17,.66); }
        .interview-topline { display: flex; justify-content: space-between; color: #91a9bb; font-size: .7rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
        .interview-topline b { color: #51eeb0; }
        .progress-track { height: 3px; margin: 13px 0 32px; overflow: hidden; border-radius: 999px; background: rgba(111,151,180,.17); }
        .progress-track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #58e8ff, #45eca7); transition: width .25s ease; }
        .interview-card h3 { margin: 0; font-size: clamp(1.55rem, 3vw, 2.45rem); line-height: 1.18; letter-spacing: -.03em; }
        .interview-card > p, .result > p:not(.result-eyebrow) { color: #9fb2c1; line-height: 1.65; }
        .options { display: grid; gap: 11px; margin-top: 26px; }
        .options button { width: 100%; min-height: 58px; display: flex; align-items: center; gap: 14px; padding: 12px 15px; border: 1px solid rgba(115,161,193,.18); border-radius: 14px; color: #dce9f2; background: rgba(255,255,255,.025); text-align: left; cursor: pointer; transition: .18s ease; }
        .options button:hover, .options button.selected { border-color: rgba(78,235,178,.58); background: rgba(62,225,167,.08); transform: translateY(-1px); }
        .options strong { font-size: .84rem; }
        .radio { display: grid; place-items: center; flex: 0 0 auto; width: 21px; height: 21px; border: 1px solid rgba(134,178,208,.5); border-radius: 50%; }
        .selected .radio { border-color: #4cebae; }
        .selected .radio i { width: 9px; height: 9px; border-radius: 50%; background: #4cebae; box-shadow: 0 0 12px rgba(76,235,174,.7); }
        .interview-actions, .result-actions { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 30px; }
        .back, .continue { min-height: 46px; display: inline-flex; align-items: center; justify-content: center; gap: 12px; padding: 0 18px; border-radius: 12px; font: 900 .78rem/1 Inter, ui-sans-serif, system-ui; cursor: pointer; text-decoration: none; }
        .back { border: 1px solid rgba(123,164,192,.2); color: #a9bdcb; background: transparent; }
        .back:disabled { opacity: .32; cursor: not-allowed; }
        .continue { border: 0; color: #03120d; background: linear-gradient(135deg, #62eaff, #43efa5); }
        .continue:disabled { opacity: .35; cursor: not-allowed; }
        .result { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; min-height: 430px; }
        .result-mark { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; color: #03130d; background: #4cebae; box-shadow: 0 0 34px rgba(76,235,174,.26); font-size: 1.25rem; font-weight: 950; }
        .result-eyebrow { margin: 24px 0 10px; color: #54e8ff; font-size: .7rem; font-weight: 950; letter-spacing: .14em; text-transform: uppercase; }
        .result-boundary { margin-top: 16px; padding: 11px 13px; border: 1px solid rgba(123,166,195,.17); border-radius: 10px; color: #8ea6b8; font-size: .69rem; }

        .pathway-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 42px; }
        .pathway-grid article { min-height: 310px; display: flex; flex-direction: column; padding: 25px; border: 1px solid rgba(113,161,194,.16); border-radius: 20px; background: linear-gradient(150deg, rgba(8,24,37,.78), rgba(3,11,19,.83)); transition: .2s ease; }
        .pathway-grid article:hover { transform: translateY(-4px); border-color: rgba(79,229,185,.36); box-shadow: 0 24px 70px rgba(0,0,0,.22); }
        .pathway-number { color: #4cebae; font-size: .66rem; font-weight: 950; letter-spacing: .15em; }
        .pathway-grid article > p { margin: 24px 0 9px; color: #5ee7ff; font-size: .66rem; font-weight: 950; letter-spacing: .14em; text-transform: uppercase; }
        .pathway-grid h3 { margin: 0; font-size: 1.2rem; line-height: 1.25; }
        .pathway-grid article > span { margin-top: 15px; color: #91a7b8; font-size: .79rem; line-height: 1.65; }
        .pathway-grid a { margin-top: auto; padding-top: 24px; color: #e9f7ff; text-decoration: none; font-size: .78rem; font-weight: 900; }
        .pathway-grid a b { color: #4cebae; }

        footer { width: min(1180px, calc(100% - 40px)); margin: 70px auto 0; padding: 34px 0 44px; display: flex; justify-content: space-between; align-items: center; gap: 30px; border-top: 1px solid rgba(115,166,201,.14); }
        footer div { display: flex; flex-direction: column; gap: 7px; }
        footer strong { font-size: .86rem; }
        footer span { color: #71899c; font-size: .72rem; }
        footer a { color: #55e8ff; text-decoration: none; font-size: .76rem; font-weight: 900; }

        @keyframes drift { to { transform: translate3d(40px, -30px, 0) scale(1.08); } }
        @keyframes starMove { to { transform: translate3d(9%, 6%, 0); } }
        @keyframes meteor { 0%, 76% { transform: translate(-20vw, -10vh) rotate(-27deg); opacity: 0; } 79% { opacity: 1; } 88% { opacity: 0; } 100% { transform: translate(135vw, 70vh) rotate(-27deg); opacity: 0; } }
        @keyframes float { 50% { transform: translateY(-16px); } }

        @media (max-width: 980px) {
          .hero, .readiness { grid-template-columns: 1fr; gap: 40px; }
          .distinctions { grid-template-columns: 1fr; }
          .distinctions article + article { border-left: 0; border-top: 1px solid rgba(115,166,201,.13); }
          .section-heading { grid-template-columns: 1fr; gap: 22px; }
          .chain { grid-template-columns: repeat(4, 1fr); }
          .chain li:nth-child(5) { border-left: 0; }
          .chain li:nth-child(n+5) { border-top: 1px solid rgba(110,160,196,.13); }
          .pathway-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .shell-header { width: min(100% - 28px, 1180px); min-height: 72px; }
          .header-status span:not(.status-dot) { display: none; }
          .hero, .distinctions, .architecture, .readiness, .pathway-section, footer { width: min(100% - 28px, 1180px); }
          .hero { padding: 62px 0 54px; }
          .hero h1 { font-size: clamp(2.55rem, 14vw, 4rem); }
          .hero-actions { flex-direction: column; align-items: stretch; }
          .orientation-card { padding: 22px; }
          .architecture, .pathway-section { padding: 58px 0; }
          .chain { grid-template-columns: repeat(2, 1fr); }
          .chain li:nth-child(odd) { border-left: 0; }
          .chain li:nth-child(n+3) { border-top: 1px solid rgba(110,160,196,.13); }
          .readiness { padding: 22px; border-radius: 22px; }
          .interview-card { min-height: 0; padding: 22px; }
          .interview-actions, .result-actions { flex-direction: column-reverse; align-items: stretch; }
          .pathway-grid { grid-template-columns: 1fr; }
          footer { align-items: flex-start; flex-direction: column; }
          .planet-a { right: -28px; opacity: .3; }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(html) { scroll-behavior: auto; }
          .nebula, .stars, .meteor, .planet { animation: none !important; }
          .options button, .pathway-grid article { transition: none; }
        }
      `}</style>
    </main>
  );
}
