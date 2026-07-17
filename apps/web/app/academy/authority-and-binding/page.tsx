'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type BindingItem = {
  id: string;
  label: string;
  value: string;
  expected: string;
  state: 'bound' | 'missing' | 'mismatch';
  explanation: string;
};

const initialBindings: BindingItem[] = [
  {
    id: 'actor',
    label: 'Actor',
    value: 'Maya Chen · AP-1042',
    expected: 'Maya Chen · AP-1042',
    state: 'bound',
    explanation: 'The initiating person is identified by the same stable identity carried by the route.',
  },
  {
    id: 'authority',
    label: 'Authority',
    value: 'Procurement Policy P-17 · dual approval',
    expected: 'Procurement Policy P-17 · dual approval',
    state: 'bound',
    explanation: 'The route cites the authority source and the exact approval condition required by the payment threshold.',
  },
  {
    id: 'beneficiary',
    label: 'Beneficiary',
    value: 'Northstar Industrial Supply LLC',
    expected: 'Northstar Industrial Supply LLC',
    state: 'bound',
    explanation: 'The named beneficiary matches the verified supplier identity.',
  },
  {
    id: 'destination',
    label: 'Destination',
    value: 'Account ending 8841',
    expected: 'Account ending 2916',
    state: 'mismatch',
    explanation: 'The proposed destination does not match the independently verified supplier account.',
  },
  {
    id: 'object',
    label: 'Execution object',
    value: 'Invoice NS-88420 · USD 48,750',
    expected: 'Invoice NS-88420 · USD 48,750',
    state: 'bound',
    explanation: 'The invoice identifier, amount, and currency are bound to the route object.',
  },
  {
    id: 'environment',
    label: 'Execution environment',
    value: 'Not supplied',
    expected: 'Treasury production tenant · US-East',
    state: 'missing',
    explanation: 'The route has not yet identified the system and environment permitted to create the consequence.',
  },
];

const questions = [
  {
    question: 'What does binding prevent?',
    choices: [
      'A route from ever being corrected.',
      'Approved evidence or authority from being reused for a different actor, object, destination, or consequence.',
      'An organization from creating policies.',
    ],
    correctIndex: 1,
    explanation:
      'Binding makes authority and evidence specific to one execution object. It prevents substitution after review.',
  },
  {
    question: 'The supplier is verified, but the payment account differs from the verified destination. What should happen?',
    choices: [
      'ALLOW because the supplier name is correct.',
      'HOLD because destination binding has failed.',
      'Change the account after execution.',
    ],
    correctIndex: 1,
    explanation:
      'Beneficiary identity does not automatically validate every destination. The destination must independently correspond to the bounded route.',
  },
  {
    question: 'Why must the execution environment be bound?',
    choices: [
      'So the route can only create consequence through the approved system and context.',
      'Because every route must use the same software.',
      'Only to make the route package longer.',
    ],
    correctIndex: 0,
    explanation:
      'A valid route executed through an unapproved model, tool, tenant, or environment may create a different consequence than the one reviewed.',
  },
];

const bindingDimensions = [
  ['Identity', 'Who is acting, approving, receiving, and operating the route.'],
  ['Authority', 'Which source grants power, under what scope, threshold, and time boundary.'],
  ['Object', 'The exact payload, request, invoice, instruction, model action, or intervention.'],
  ['Destination', 'Where value, data, authority, or physical consequence will be delivered.'],
  ['Environment', 'The tool, model, tenant, system state, location, and runtime context.'],
  ['Consequence', 'The specific result the route is permitted to create—and no broader result.'],
];

export default function AuthorityAndBindingPage() {
  const [bindings, setBindings] = useState(initialBindings);
  const [selectedId, setSelectedId] = useState('destination');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const selected = bindings.find((item) => item.id === selectedId) ?? bindings[0];
  const unresolved = bindings.filter((item) => item.state !== 'bound');
  const decision = unresolved.length === 0 ? 'BOUND' : 'HOLD';
  const score = useMemo(
    () => questions.reduce((sum, item, index) => sum + (answers[index] === item.correctIndex ? 1 : 0), 0),
    [answers],
  );

  function repairBinding(id: string) {
    setBindings((current) =>
      current.map((item) =>
        item.id === id ? { ...item, value: item.expected, state: 'bound' as const } : item,
      ),
    );
  }

  function resetLab() {
    setBindings(initialBindings);
    setSelectedId('destination');
  }

  return (
    <main className="lesson-page">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #02050a; color: #f4f8ff; }
        button { font: inherit; }
        a { color: inherit; }

        .lesson-page {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 10% 0%, rgba(79, 215, 255, .15), transparent 31%),
            radial-gradient(circle at 91% 12%, rgba(167, 111, 255, .15), transparent 28%),
            radial-gradient(circle at 48% 68%, rgba(74, 239, 181, .07), transparent 34%),
            linear-gradient(180deg, #02050a 0%, #07101b 52%, #02060b 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .lesson-page::before {
          content: ""; position: fixed; inset: 0; pointer-events: none; opacity: .2;
          background-image: linear-gradient(rgba(255,255,255,.026) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.026) 1px, transparent 1px);
          background-size: 42px 42px; mask-image: linear-gradient(to bottom, #000, transparent 92%);
        }
        .shell { position: relative; z-index: 1; width: min(1220px, 92vw); margin: 0 auto; padding: 28px 0 110px; }
        .topbar { display: flex; align-items: center; justify-content: space-between; gap: 22px; margin-bottom: 72px; }
        .brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; font-weight: 950; letter-spacing: .09em; }
        .brand-mark { display: grid; place-items: center; width: 44px; height: 44px; border: 1px solid rgba(84,232,255,.46); border-radius: 14px; background: linear-gradient(145deg, rgba(84,232,255,.18), rgba(41,167,255,.04)); box-shadow: 0 0 32px rgba(41,167,255,.2); }
        .nav-actions, .hero-actions, .final-actions { display: flex; flex-wrap: wrap; gap: 11px; }
        .button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 17px; border: 1px solid rgba(255,255,255,.13); border-radius: 12px; background: rgba(255,255,255,.045); color: #f7fbff; text-decoration: none; font-weight: 800; transition: .2s ease; cursor: pointer; }
        .button:hover { transform: translateY(-2px); border-color: rgba(84,232,255,.48); background: rgba(84,232,255,.09); }
        .button.primary { border-color: rgba(84,232,255,.65); color: #021018; background: linear-gradient(135deg, #6de8ff, #58f0b5); box-shadow: 0 14px 40px rgba(44,198,255,.18); }
        .button.purple { border-color: rgba(171,130,255,.5); background: rgba(148,104,255,.09); }

        .eyebrow { color: #71e8ff; font-size: .76rem; font-weight: 950; letter-spacing: .18em; text-transform: uppercase; }
        .hero { display: grid; grid-template-columns: 1.13fr .87fr; gap: 46px; align-items: center; margin-bottom: 90px; }
        h1 { max-width: 850px; margin: 14px 0 20px; font-size: clamp(3.1rem, 7vw, 6.5rem); line-height: .94; letter-spacing: -.065em; }
        .lead { max-width: 760px; margin: 0 0 27px; color: #aebdce; font-size: clamp(1.03rem, 1.8vw, 1.24rem); line-height: 1.72; }
        .principle { margin-top: 28px; padding: 20px 22px; border-left: 3px solid #62e6ff; border-radius: 0 16px 16px 0; background: linear-gradient(90deg, rgba(84,232,255,.11), rgba(84,232,255,.025)); font-size: 1.06rem; font-weight: 900; }

        .binding-orbit { position: relative; min-height: 410px; display: grid; place-items: center; }
        .orbit { position: absolute; width: 360px; height: 360px; border: 1px solid rgba(135,210,255,.2); border-radius: 50%; animation: spin 22s linear infinite; }
        .orbit.two { width: 275px; height: 275px; border-style: dashed; animation-duration: 16s; animation-direction: reverse; }
        .orbit::before, .orbit::after { content: ""; position: absolute; width: 13px; height: 13px; border-radius: 50%; background: #70e7ff; box-shadow: 0 0 22px rgba(84,232,255,.8); }
        .orbit::before { left: 38px; top: 55px; }
        .orbit::after { right: 34px; bottom: 60px; background: #aa8cff; }
        .core { position: relative; z-index: 2; width: 194px; height: 194px; display: grid; place-items: center; text-align: center; border: 1px solid rgba(167,132,255,.55); border-radius: 50%; background: radial-gradient(circle, rgba(151,105,255,.2), rgba(7,13,22,.96) 69%); box-shadow: 0 0 75px rgba(142,101,255,.18); }
        .core strong { display: block; font-size: 1.85rem; letter-spacing: .08em; color: ${decision === 'BOUND' ? '#69efb9' : '#ffc36e'}; }
        .core span { color: #9dafc1; font-size: .75rem; text-transform: uppercase; letter-spacing: .16em; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .section { margin-top: 90px; }
        .section-head { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
        .section h2 { margin: 8px 0 0; font-size: clamp(2rem, 4vw, 3.5rem); letter-spacing: -.045em; }
        .section-copy { max-width: 660px; color: #9fb0c3; line-height: 1.7; }
        .dimension-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .dimension { min-height: 175px; padding: 22px; border: 1px solid rgba(255,255,255,.1); border-radius: 20px; background: rgba(8,16,27,.76); }
        .dimension span { display: block; color: #73e8ff; font-size: .72rem; font-weight: 900; letter-spacing: .15em; text-transform: uppercase; margin-bottom: 14px; }
        .dimension h3 { margin: 0 0 9px; font-size: 1.15rem; }
        .dimension p { margin: 0; color: #9fb0c3; line-height: 1.62; }

        .lab { overflow: hidden; border: 1px solid rgba(111,226,255,.18); border-radius: 26px; background: rgba(5,12,21,.86); box-shadow: 0 30px 90px rgba(0,0,0,.28); }
        .lab-bar { display: flex; justify-content: space-between; align-items: center; gap: 18px; padding: 20px 23px; border-bottom: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.025); }
        .decision { padding: 8px 12px; border-radius: 999px; font-size: .76rem; font-weight: 950; letter-spacing: .13em; color: ${decision === 'BOUND' ? '#76efbd' : '#ffc36e'}; background: ${decision === 'BOUND' ? 'rgba(72,225,160,.1)' : 'rgba(255,184,77,.1)'}; }
        .lab-grid { display: grid; grid-template-columns: .9fr 1.1fr; min-height: 540px; }
        .binding-list { padding: 18px; border-right: 1px solid rgba(255,255,255,.08); }
        .binding-row { width: 100%; display: grid; grid-template-columns: 12px 1fr auto; align-items: center; gap: 13px; padding: 16px; margin-bottom: 8px; color: #eef6ff; text-align: left; border: 1px solid transparent; border-radius: 14px; background: transparent; cursor: pointer; }
        .binding-row:hover, .binding-row.active { border-color: rgba(88,224,255,.25); background: rgba(88,224,255,.055); }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot.bound { background: #67eeb8; box-shadow: 0 0 12px rgba(72,225,160,.5); }
        .dot.missing { background: #ffc36e; box-shadow: 0 0 12px rgba(255,184,77,.5); }
        .dot.mismatch { background: #ff8493; box-shadow: 0 0 12px rgba(255,95,111,.5); }
        .row-label { font-weight: 850; }
        .row-state { color: #8fa3b8; font-size: .68rem; letter-spacing: .1em; text-transform: uppercase; }
        .inspection { padding: 36px; }
        .inspection h3 { margin: 9px 0 12px; font-size: clamp(1.8rem, 3vw, 2.6rem); }
        .inspection > p { color: #a6b7c9; line-height: 1.68; }
        .comparison { display: grid; gap: 12px; margin: 27px 0; }
        .value-box { padding: 17px; border: 1px solid rgba(255,255,255,.1); border-radius: 15px; background: rgba(255,255,255,.03); }
        .value-box span { display: block; color: #8195aa; font-size: .68rem; font-weight: 900; letter-spacing: .13em; text-transform: uppercase; margin-bottom: 9px; }
        .value-box strong { display: block; overflow-wrap: anywhere; }
        .value-box.expected { border-color: rgba(87,231,184,.22); }
        .finding { margin: 22px 0; padding: 18px; border-radius: 15px; background: ${selected.state === 'bound' ? 'rgba(70,226,159,.07)' : 'rgba(255,184,77,.07)'}; border: 1px solid ${selected.state === 'bound' ? 'rgba(70,226,159,.2)' : 'rgba(255,184,77,.2)'}; color: #c5d3e0; line-height: 1.6; }
        .lab-footer { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 19px 23px; border-top: 1px solid rgba(255,255,255,.08); }
        .lab-footer p { margin: 0; color: #879aaf; }

        .rule-panel { display: grid; grid-template-columns: .8fr 1.2fr; gap: 22px; padding: 30px; border: 1px solid rgba(169,132,255,.2); border-radius: 24px; background: linear-gradient(135deg, rgba(151,105,255,.08), rgba(42,204,255,.035)); }
        .formula { display: grid; place-items: center; min-height: 250px; padding: 26px; border: 1px solid rgba(255,255,255,.09); border-radius: 18px; background: rgba(3,8,15,.6); text-align: center; }
        .formula strong { font-size: clamp(1.5rem, 3vw, 2.45rem); line-height: 1.35; }
        .formula em { color: #75e9ff; font-style: normal; }
        .rule-copy h3 { margin: 0 0 14px; font-size: 1.55rem; }
        .rule-copy p, .rule-copy li { color: #a7b7c8; line-height: 1.68; }
        .rule-copy ul { padding-left: 20px; }

        .quiz { display: grid; gap: 18px; }
        .question { padding: 24px; border: 1px solid rgba(255,255,255,.1); border-radius: 20px; background: rgba(8,16,27,.76); }
        .question h3 { margin: 0 0 18px; font-size: 1.08rem; line-height: 1.5; }
        .choices { display: grid; gap: 9px; }
        .choice { padding: 14px 16px; text-align: left; color: #dbe8f5; border: 1px solid rgba(255,255,255,.09); border-radius: 12px; background: rgba(255,255,255,.025); cursor: pointer; }
        .choice:hover, .choice.selected { border-color: rgba(90,229,255,.4); background: rgba(84,232,255,.065); }
        .choice.correct { border-color: rgba(80,230,167,.48); background: rgba(70,226,159,.08); }
        .choice.incorrect { border-color: rgba(255,100,116,.44); background: rgba(255,95,111,.07); }
        .explanation { margin: 14px 0 0; color: #a9bbc9; line-height: 1.6; }
        .quiz-result { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 23px; border: 1px solid rgba(84,232,255,.2); border-radius: 18px; background: rgba(84,232,255,.055); }
        .quiz-result strong { font-size: 1.35rem; }

        .final { margin-top: 90px; padding: 38px; border: 1px solid rgba(84,232,255,.24); border-radius: 27px; background: linear-gradient(135deg, rgba(84,232,255,.1), rgba(144,103,255,.08)); }
        .final h2 { margin: 8px 0 14px; font-size: clamp(2rem, 4vw, 3.4rem); }
        .final p { max-width: 760px; color: #aebdce; line-height: 1.7; }

        @media (max-width: 920px) {
          .hero, .lab-grid, .rule-panel { grid-template-columns: 1fr; }
          .binding-list { border-right: 0; border-bottom: 1px solid rgba(255,255,255,.08); }
          .dimension-grid { grid-template-columns: repeat(2, 1fr); }
          .binding-orbit { min-height: 360px; }
        }
        @media (max-width: 640px) {
          .topbar, .section-head, .lab-bar, .lab-footer, .quiz-result { align-items: flex-start; flex-direction: column; }
          .nav-actions { width: 100%; }
          .nav-actions .button { flex: 1; }
          .dimension-grid { grid-template-columns: 1fr; }
          .inspection { padding: 24px 20px; }
          .final { padding: 28px 22px; }
          h1 { font-size: clamp(2.8rem, 16vw, 4.5rem); }
          .orbit { width: 310px; height: 310px; }
        }
      `}</style>

      <div className="shell">
        <header className="topbar">
          <Link className="brand" href="/academy">
            <span className="brand-mark">14</span>
            <span>TA-14 ACADEMY</span>
          </Link>
          <div className="nav-actions">
            <Link className="button" href="/academy">Academy</Link>
            <Link className="button" href="/workspace">Exchange</Link>
          </div>
        </header>

        <section className="hero">
          <div>
            <div className="eyebrow">Module 05 · Authority and Binding</div>
            <h1>Permission is not enough. It must bind to the route.</h1>
            <p className="lead">
              Authority can be genuine and evidence can be admissible while the proposed execution is still wrong.
              Binding connects every approved element to the exact actor, object, beneficiary, destination,
              environment, and consequence that may proceed.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#binding-lab">Open the binding lab</a>
              <Link className="button purple" href="/workspace/demonstrations">Launch demonstration</Link>
            </div>
            <div className="principle">No exact binding. No legitimate transfer of authority into execution.</div>
          </div>

          <div className="binding-orbit" aria-label={`Current binding state: ${decision}`}>
            <div className="orbit" />
            <div className="orbit two" />
            <div className="core">
              <div>
                <strong>{decision}</strong>
                <span>{unresolved.length} unresolved binding{unresolved.length === 1 ? '' : 's'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">The binding surface</div>
              <h2>Six things must correspond.</h2>
            </div>
            <p className="section-copy">
              A route is not one field. It is a bounded relationship. Changing one consequential dimension can create a different route—even when every other field remains unchanged.
            </p>
          </div>
          <div className="dimension-grid">
            {bindingDimensions.map(([title, description], index) => (
              <article className="dimension" key={title}>
                <span>Binding {String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="binding-lab">
          <div className="section-head">
            <div>
              <div className="eyebrow">Interactive lab</div>
              <h2>Find the substitution risk.</h2>
            </div>
            <p className="section-copy">
              This payment route passed evidence review. Inspect each binding before consequence. Correcting a mismatch creates a valid route state; it does not make the original mismatch disappear from history.
            </p>
          </div>

          <div className="lab">
            <div className="lab-bar">
              <div>
                <strong>Route TA14-DEMO-PAY-048750</strong>
                <div style={{ color: '#8195aa', marginTop: 5, fontSize: '.83rem' }}>Proposed supplier payment · USD 48,750</div>
              </div>
              <span className="decision">{decision}</span>
            </div>

            <div className="lab-grid">
              <div className="binding-list">
                {bindings.map((item) => (
                  <button
                    className={`binding-row ${selectedId === item.id ? 'active' : ''}`}
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    type="button"
                  >
                    <span className={`dot ${item.state}`} />
                    <span className="row-label">{item.label}</span>
                    <span className="row-state">{item.state}</span>
                  </button>
                ))}
              </div>

              <div className="inspection">
                <div className="eyebrow">Selected binding</div>
                <h3>{selected.label}</h3>
                <p>{selected.explanation}</p>
                <div className="comparison">
                  <div className="value-box">
                    <span>Proposed route value</span>
                    <strong>{selected.value}</strong>
                  </div>
                  <div className="value-box expected">
                    <span>Verified bounded value</span>
                    <strong>{selected.expected}</strong>
                  </div>
                </div>
                <div className="finding">
                  {selected.state === 'bound'
                    ? 'Correspondence confirmed. This element is attached to the exact route under review.'
                    : selected.state === 'mismatch'
                      ? 'Substitution detected. The proposed value differs from the verified route value and cannot inherit its authority.'
                      : 'Required binding is absent. The route cannot prove where or through what environment consequence will occur.'}
                </div>
                {selected.state !== 'bound' ? (
                  <button className="button primary" onClick={() => repairBinding(selected.id)} type="button">
                    Bind verified value
                  </button>
                ) : (
                  <span style={{ color: '#75efbd', fontWeight: 850 }}>✓ Binding confirmed</span>
                )}
              </div>
            </div>

            <div className="lab-footer">
              <p>{unresolved.length === 0 ? 'Every required element now corresponds to the route.' : `${unresolved.length} consequential binding defect${unresolved.length === 1 ? '' : 's'} remain.`}</p>
              <button className="button" onClick={resetLab} type="button">Reset scenario</button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="rule-panel">
            <div className="formula">
              <strong>Authority + Evidence<br />without <em>Exact Binding</em><br />≠ Admissible Execution</strong>
            </div>
            <div className="rule-copy">
              <div className="eyebrow">The governing distinction</div>
              <h3>Authority does not float.</h3>
              <p>
                An approval is not a transferable token that can be attached to any later action. It is valid only for the bounded conditions under which it was granted.
              </p>
              <ul>
                <li>A verified supplier does not validate an unverified bank account.</li>
                <li>An approved amount does not authorize a larger payload.</li>
                <li>An authorized operator does not authorize an unapproved model or tool.</li>
                <li>A permitted purpose does not authorize a different beneficiary or destination.</li>
                <li>A valid route cannot be silently widened after review.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Knowledge check</div>
              <h2>Can you preserve route identity?</h2>
            </div>
            <p className="section-copy">Choose one answer for each question, then score the lesson.</p>
          </div>

          <div className="quiz">
            {questions.map((item, questionIndex) => (
              <article className="question" key={item.question}>
                <h3>{questionIndex + 1}. {item.question}</h3>
                <div className="choices">
                  {item.choices.map((choice, choiceIndex) => {
                    const selectedChoice = answers[questionIndex] === choiceIndex;
                    const resultClass = submitted
                      ? choiceIndex === item.correctIndex
                        ? 'correct'
                        : selectedChoice
                          ? 'incorrect'
                          : ''
                      : selectedChoice
                        ? 'selected'
                        : '';
                    return (
                      <button
                        className={`choice ${resultClass}`}
                        key={choice}
                        onClick={() => {
                          setAnswers((current) => ({ ...current, [questionIndex]: choiceIndex }));
                          setSubmitted(false);
                        }}
                        type="button"
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
                {submitted && <p className="explanation">{item.explanation}</p>}
              </article>
            ))}

            <div className="quiz-result">
              <div>
                <div className="eyebrow">Lesson result</div>
                <strong>{submitted ? `${score} of ${questions.length} correct` : 'Complete all three questions'}</strong>
              </div>
              <button
                className="button primary"
                disabled={Object.keys(answers).length !== questions.length}
                onClick={() => setSubmitted(true)}
                style={{ opacity: Object.keys(answers).length !== questions.length ? .45 : 1 }}
                type="button"
              >
                Score lesson
              </button>
            </div>
          </div>
        </section>

        <section className="final">
          <div className="eyebrow">Continue the route</div>
          <h2>Next: Commit and version history.</h2>
          <p>
            Once the route is exactly bound, TA-14 must preserve what was approved so that the execution object cannot be replaced, expanded, or redirected after authorization.
          </p>
          <div className="final-actions">
            <Link className="button primary" href="/workspace/demonstrations">Test the live demonstration</Link>
            <Link className="button" href="/academy">Return to Academy</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
