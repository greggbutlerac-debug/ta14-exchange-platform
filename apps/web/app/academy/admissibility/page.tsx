'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Requirement = {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'satisfied' | 'missing' | 'contradicted' | 'expired';
};

const initialRequirements: Requirement[] = [
  {
    id: 'route-identity',
    title: 'Route identity',
    category: 'Identity',
    description: 'The consequential action is represented by one stable route identifier.',
    status: 'satisfied',
  },
  {
    id: 'actor-authority',
    title: 'Actor authority',
    category: 'Authority',
    description: 'The initiating actor is known, but the required second approver has not been bound.',
    status: 'missing',
  },
  {
    id: 'beneficiary-proof',
    title: 'Beneficiary proof',
    category: 'Evidence',
    description: 'The named supplier is present, but independent beneficiary verification is absent.',
    status: 'missing',
  },
  {
    id: 'invoice-integrity',
    title: 'Invoice integrity',
    category: 'Evidence',
    description: 'The invoice digest matches the preserved source record.',
    status: 'satisfied',
  },
  {
    id: 'policy-scope',
    title: 'Policy scope',
    category: 'Policy',
    description: 'The payment threshold is covered by the applicable procurement policy.',
    status: 'satisfied',
  },
  {
    id: 'temporal-validity',
    title: 'Temporal validity',
    category: 'Time',
    description: 'The first approval has expired and cannot authorize execution now.',
    status: 'expired',
  },
];

const questions = [
  {
    question: 'What does admissibility determine?',
    choices: [
      'Whether a route looks reasonable to an operator.',
      'Whether the bounded route satisfies the mandatory requirements for the proposed consequence.',
      'Whether a policy document exists somewhere in the organization.',
    ],
    correctIndex: 1,
    explanation:
      'Admissibility is consequence-specific. It evaluates the actual bounded route, not general confidence or policy appearance.',
  },
  {
    question: 'A required approval expired before execution. What is the correct state?',
    choices: [
      'ALLOW because the approval was valid when first issued.',
      'HOLD until current authority is supplied and bound.',
      'Ignore the timestamp if the route is urgent.',
    ],
    correctIndex: 1,
    explanation:
      'Authority must remain temporally valid when consequence is created. Expired authority cannot be silently carried forward.',
  },
  {
    question: 'Which statement best distinguishes HOLD from DENY?',
    choices: [
      'HOLD is correctable; DENY identifies a route that must not proceed under the present facts or authority.',
      'HOLD and DENY mean exactly the same thing.',
      'DENY is only used when the software crashes.',
    ],
    correctIndex: 0,
    explanation:
      'HOLD pauses a route for correctable incompleteness or unresolved conditions. DENY blocks a route that is prohibited or invalid under the governing boundary.',
  },
];

const stateCards = [
  {
    state: 'ALLOW',
    tone: 'allow',
    description: 'Every mandatory requirement is satisfied for the exact bounded route.',
  },
  {
    state: 'HOLD',
    tone: 'hold',
    description: 'The route is not yet admissible, but identified defects may be corrected.',
  },
  {
    state: 'DENY',
    tone: 'deny',
    description: 'The route is prohibited, invalid, or cannot proceed under the present authority.',
  },
  {
    state: 'ESCALATE',
    tone: 'escalate',
    description: 'The route requires a higher authority, specialist review, or human determination.',
  },
];

export default function AdmissibilityPage() {
  const [requirements, setRequirements] = useState(initialRequirements);
  const [selected, setSelected] = useState(initialRequirements[1].id);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const active = requirements.find((item) => item.id === selected) || requirements[0];
  const unresolved = requirements.filter((item) => item.status !== 'satisfied');
  const decision = unresolved.length === 0 ? 'ALLOW' : 'HOLD';
  const completed = Object.keys(answers).length === questions.length;
  const score = useMemo(
    () =>
      questions.reduce(
        (total, item, index) => total + (answers[index] === item.correctIndex ? 1 : 0),
        0,
      ),
    [answers],
  );

  function correctRequirement(id: string) {
    setRequirements((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: 'satisfied' as const } : item,
      ),
    );
  }

  function resetLab() {
    setRequirements(initialRequirements);
    setSelected(initialRequirements[1].id);
  }

  return (
    <main className="lesson-page">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #02050a; color: #f4f8ff; }
        button, input { font: inherit; }
        a { color: inherit; }

        .lesson-page {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 12% 0%, rgba(45,185,255,.16), transparent 31%),
            radial-gradient(circle at 90% 8%, rgba(255,184,77,.11), transparent 27%),
            radial-gradient(circle at 48% 62%, rgba(111,82,255,.08), transparent 34%),
            linear-gradient(180deg, #02050a 0%, #07111c 48%, #02060b 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .lesson-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .2;
          background-image:
            linear-gradient(rgba(255,255,255,.026) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.026) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, #000, transparent 90%);
        }

        .shell { position: relative; z-index: 1; width: min(1220px, 92vw); margin: 0 auto; padding: 28px 0 110px; }
        .topbar { display: flex; align-items: center; justify-content: space-between; gap: 22px; margin-bottom: 72px; }
        .brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; font-weight: 950; letter-spacing: .09em; }
        .brand-mark { display: grid; place-items: center; width: 44px; height: 44px; border: 1px solid rgba(84,232,255,.46); border-radius: 14px; background: linear-gradient(145deg, rgba(84,232,255,.18), rgba(41,167,255,.04)); box-shadow: 0 0 32px rgba(41,167,255,.2); }
        .nav-actions, .hero-actions, .final-actions { display: flex; flex-wrap: wrap; gap: 11px; }
        .button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 17px; border: 1px solid rgba(255,255,255,.13); border-radius: 12px; background: rgba(255,255,255,.045); color: #f7fbff; text-decoration: none; font-weight: 800; transition: .2s ease; cursor: pointer; }
        .button:hover { transform: translateY(-2px); border-color: rgba(84,232,255,.48); background: rgba(84,232,255,.09); }
        .button.primary { border-color: rgba(84,232,255,.65); color: #021018; background: linear-gradient(135deg, #6de8ff, #58f0b5); box-shadow: 0 14px 40px rgba(44,198,255,.18); }
        .button.warn { border-color: rgba(255,184,77,.42); background: rgba(255,184,77,.08); }

        .eyebrow { color: #71e8ff; font-size: .76rem; font-weight: 950; letter-spacing: .18em; text-transform: uppercase; }
        .hero { display: grid; grid-template-columns: 1.16fr .84fr; gap: 42px; align-items: center; margin-bottom: 90px; }
        h1 { max-width: 850px; margin: 14px 0 20px; font-size: clamp(3.1rem, 7vw, 6.7rem); line-height: .94; letter-spacing: -.065em; }
        .lead { max-width: 760px; margin: 0 0 27px; color: #aebdce; font-size: clamp(1.03rem, 1.8vw, 1.24rem); line-height: 1.72; }
        .principle { margin-top: 28px; padding: 20px 22px; border-left: 3px solid #5de7ff; border-radius: 0 16px 16px 0; background: linear-gradient(90deg, rgba(84,232,255,.11), rgba(84,232,255,.025)); font-size: 1.06rem; font-weight: 900; }

        .decision-orb { position: relative; min-height: 390px; display: grid; place-items: center; }
        .decision-orb::before, .decision-orb::after { content: ""; position: absolute; border-radius: 50%; border: 1px solid rgba(84,232,255,.19); animation: spin 18s linear infinite; }
        .decision-orb::before { width: 330px; height: 330px; }
        .decision-orb::after { width: 255px; height: 255px; border-style: dashed; animation-direction: reverse; animation-duration: 13s; }
        .orb-core { position: relative; z-index: 2; width: 190px; height: 190px; display: grid; place-items: center; text-align: center; border: 1px solid rgba(255,184,77,.48); border-radius: 50%; background: radial-gradient(circle, rgba(255,184,77,.17), rgba(7,13,22,.95) 68%); box-shadow: 0 0 70px rgba(255,168,64,.15), inset 0 0 45px rgba(255,255,255,.025); }
        .orb-core strong { display: block; color: #ffc36e; font-size: 2rem; letter-spacing: .08em; }
        .orb-core span { color: #9dafc1; font-size: .78rem; text-transform: uppercase; letter-spacing: .16em; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .section { margin-top: 90px; }
        .section-head { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
        .section h2 { margin: 8px 0 0; font-size: clamp(2rem, 4vw, 3.5rem); letter-spacing: -.045em; }
        .section-copy { max-width: 650px; color: #9fb0c3; line-height: 1.7; }

        .state-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .state-card { min-height: 205px; padding: 22px; border: 1px solid rgba(255,255,255,.1); border-radius: 21px; background: rgba(8,16,27,.76); box-shadow: 0 16px 50px rgba(0,0,0,.18); }
        .state-card strong { display: inline-flex; margin-bottom: 18px; padding: 7px 10px; border-radius: 999px; font-size: .74rem; letter-spacing: .13em; }
        .state-card p { color: #a8b7c7; line-height: 1.6; }
        .allow strong { color: #71f2bd; background: rgba(70,226,159,.1); }
        .hold strong { color: #ffc36e; background: rgba(255,184,77,.1); }
        .deny strong { color: #ff8f99; background: rgba(255,95,111,.1); }
        .escalate strong { color: #baa8ff; background: rgba(139,110,255,.12); }

        .lab { display: grid; grid-template-columns: .9fr 1.1fr; gap: 20px; }
        .panel { border: 1px solid rgba(255,255,255,.1); border-radius: 24px; background: linear-gradient(145deg, rgba(11,22,36,.93), rgba(5,11,19,.9)); box-shadow: 0 24px 70px rgba(0,0,0,.24); overflow: hidden; }
        .panel-head { padding: 20px 22px; border-bottom: 1px solid rgba(255,255,255,.08); display: flex; align-items: center; justify-content: space-between; gap: 14px; }
        .panel-head h3 { margin: 0; font-size: 1.08rem; }
        .decision-pill { padding: 8px 11px; border-radius: 999px; font-size: .72rem; font-weight: 950; letter-spacing: .13em; background: rgba(255,184,77,.1); color: #ffc36e; }
        .decision-pill.allowing { background: rgba(70,226,159,.1); color: #71f2bd; }
        .requirements { padding: 10px; }
        .requirement { width: 100%; display: grid; grid-template-columns: 12px 1fr auto; gap: 13px; align-items: center; padding: 15px 13px; border: 0; border-radius: 15px; background: transparent; color: inherit; text-align: left; cursor: pointer; }
        .requirement:hover, .requirement.active { background: rgba(84,232,255,.065); }
        .dot { width: 10px; height: 10px; border-radius: 50%; background: #6ef0b5; box-shadow: 0 0 16px rgba(76,239,178,.4); }
        .dot.missing, .dot.expired { background: #ffbd64; box-shadow: 0 0 16px rgba(255,184,77,.35); }
        .dot.contradicted { background: #ff7481; box-shadow: 0 0 16px rgba(255,95,111,.35); }
        .requirement-title { font-weight: 850; }
        .category { color: #7f91a4; font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; }
        .status { color: #8fa1b4; font-size: .72rem; text-transform: uppercase; letter-spacing: .09em; }
        .detail { padding: 28px; }
        .detail-kicker { color: #71e8ff; font-size: .73rem; font-weight: 900; letter-spacing: .15em; text-transform: uppercase; }
        .detail h3 { margin: 10px 0 12px; font-size: 2rem; letter-spacing: -.035em; }
        .detail p { color: #a7b7c8; line-height: 1.72; }
        .finding { margin: 24px 0; padding: 18px; border: 1px solid rgba(255,184,77,.22); border-radius: 16px; background: rgba(255,184,77,.055); }
        .finding strong { display: block; margin-bottom: 6px; color: #ffc36e; }
        .finding.satisfied { border-color: rgba(70,226,159,.22); background: rgba(70,226,159,.055); }
        .finding.satisfied strong { color: #71f2bd; }
        .lab-footer { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-top: 22px; }
        .count { color: #91a4b8; font-size: .86rem; }

        .rules-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        .rule { padding: 24px; border: 1px solid rgba(255,255,255,.1); border-radius: 20px; background: rgba(8,16,27,.72); }
        .rule-number { color: #71e8ff; font-size: .76rem; font-weight: 950; letter-spacing: .14em; }
        .rule h3 { margin: 13px 0 9px; }
        .rule p { margin: 0; color: #9fb0c2; line-height: 1.65; }

        .quiz { display: grid; gap: 17px; }
        .question { padding: 25px; border: 1px solid rgba(255,255,255,.1); border-radius: 21px; background: rgba(8,16,27,.76); }
        .question h3 { margin: 0 0 17px; font-size: 1.06rem; }
        .choices { display: grid; gap: 9px; }
        .choice { display: flex; gap: 11px; align-items: flex-start; padding: 13px 14px; border: 1px solid rgba(255,255,255,.09); border-radius: 13px; background: rgba(255,255,255,.025); cursor: pointer; color: #c6d1dd; }
        .choice:hover { border-color: rgba(84,232,255,.34); }
        .choice.selected { border-color: rgba(84,232,255,.54); background: rgba(84,232,255,.07); }
        .choice.correct { border-color: rgba(70,226,159,.5); background: rgba(70,226,159,.07); }
        .choice.incorrect { border-color: rgba(255,95,111,.45); background: rgba(255,95,111,.06); }
        .explanation { margin: 14px 0 0; color: #a8b7c7; line-height: 1.58; }
        .quiz-result { padding: 28px; border: 1px solid rgba(84,232,255,.24); border-radius: 22px; background: linear-gradient(135deg, rgba(84,232,255,.09), rgba(70,226,159,.045)); }
        .quiz-result strong { display: block; margin-bottom: 8px; font-size: 1.5rem; }

        .final { margin-top: 90px; padding: clamp(28px, 5vw, 54px); border: 1px solid rgba(84,232,255,.21); border-radius: 28px; background: linear-gradient(135deg, rgba(84,232,255,.1), rgba(111,82,255,.06), rgba(70,226,159,.045)); }
        .final h2 { margin: 10px 0 14px; font-size: clamp(2rem, 4vw, 3.4rem); }
        .final p { max-width: 760px; color: #a8b8c8; line-height: 1.7; }

        @media (max-width: 960px) {
          .hero, .lab { grid-template-columns: 1fr; }
          .decision-orb { min-height: 310px; }
          .state-grid { grid-template-columns: repeat(2, 1fr); }
          .rules-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .shell { width: min(94vw, 1220px); }
          .topbar { align-items: flex-start; margin-bottom: 48px; }
          .topbar .nav-actions { display: none; }
          h1 { font-size: clamp(2.7rem, 15vw, 4.4rem); }
          .state-grid { grid-template-columns: 1fr; }
          .section-head { display: block; }
          .panel-head, .lab-footer { align-items: flex-start; flex-direction: column; }
          .requirement { grid-template-columns: 10px 1fr; }
          .requirement .status { grid-column: 2; }
        }
      `}</style>

      <div className="shell">
        <header className="topbar">
          <Link href="/academy" className="brand">
            <span className="brand-mark">14</span>
            <span>TA-14 ACADEMY</span>
          </Link>
          <div className="nav-actions">
            <Link href="/academy/continuity" className="button">Previous lesson</Link>
            <Link href="/workspace/demonstrations" className="button primary">Launch live demonstration</Link>
          </div>
        </header>

        <section className="hero">
          <div>
            <div className="eyebrow">Module 04 · Admissibility</div>
            <h1>Permission is not proof.</h1>
            <p className="lead">
              Admissibility asks whether the exact route is fit to create the exact consequence now. It examines evidence, authority, continuity, scope, timing, contradictions, and mandatory thresholds before execution is allowed to proceed.
            </p>
            <div className="hero-actions">
              <a href="#admissibility-lab" className="button primary">Open the gate lab</a>
              <Link href="/architecture" className="button">Review the full architecture</Link>
            </div>
            <div className="principle">No admissible evidence. No admissible execution.</div>
          </div>

          <div className="decision-orb" aria-label="Current route decision HOLD">
            <div className="orb-core">
              <div>
                <span>Current decision</span>
                <strong>{decision}</strong>
                <span>{unresolved.length} unresolved requirement{unresolved.length === 1 ? '' : 's'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Decision vocabulary</div>
              <h2>Four governed states.</h2>
            </div>
            <p className="section-copy">TA-14 does not collapse every failure into a single rejection. The decision state communicates what the route may do next and why.</p>
          </div>
          <div className="state-grid">
            {stateCards.map((card) => (
              <article className={`state-card ${card.tone}`} key={card.state}>
                <strong>{card.state}</strong>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="admissibility-lab">
          <div className="section-head">
            <div>
              <div className="eyebrow">Interactive gate lab</div>
              <h2>Test the route, not the dashboard.</h2>
            </div>
            <p className="section-copy">Inspect each requirement. Correct the unresolved findings one by one and watch the route move from HOLD to ALLOW without erasing the original defects.</p>
          </div>

          <div className="lab">
            <div className="panel">
              <div className="panel-head">
                <h3>Vendor payment · USD 32,500</h3>
                <span className={`decision-pill ${decision === 'ALLOW' ? 'allowing' : ''}`}>{decision}</span>
              </div>
              <div className="requirements">
                {requirements.map((item) => (
                  <button
                    className={`requirement ${selected === item.id ? 'active' : ''}`}
                    key={item.id}
                    onClick={() => setSelected(item.id)}
                    type="button"
                  >
                    <span className={`dot ${item.status}`} />
                    <span>
                      <span className="requirement-title">{item.title}</span><br />
                      <span className="category">{item.category}</span>
                    </span>
                    <span className="status">{item.status}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel detail">
              <div className="detail-kicker">Requirement inspection</div>
              <h3>{active.title}</h3>
              <p>{active.description}</p>
              <div className={`finding ${active.status === 'satisfied' ? 'satisfied' : ''}`}>
                <strong>{active.status === 'satisfied' ? 'Requirement satisfied' : 'Execution blocked'}</strong>
                {active.status === 'satisfied'
                  ? 'This requirement currently supports admissibility for the bounded route.'
                  : 'The route must remain on HOLD until this exact defect is corrected and the new evidence or authority is bound to a new route version.'}
              </div>

              {active.status !== 'satisfied' ? (
                <button className="button primary" type="button" onClick={() => correctRequirement(active.id)}>
                  Supply and bind correction
                </button>
              ) : (
                <span className="button" aria-disabled="true">No correction required</span>
              )}

              <div className="lab-footer">
                <span className="count">{unresolved.length} unresolved of {requirements.length} mandatory requirements</span>
                <button className="button warn" type="button" onClick={resetLab}>Reset route</button>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Admissibility discipline</div>
              <h2>Three rules that prevent false approval.</h2>
            </div>
          </div>
          <div className="rules-grid">
            <article className="rule">
              <div className="rule-number">RULE 01</div>
              <h3>Consequence-specific</h3>
              <p>Evidence may be authentic yet insufficient for the consequence being considered. Admissibility is never generic.</p>
            </article>
            <article className="rule">
              <div className="rule-number">RULE 02</div>
              <h3>Unknown stays unknown</h3>
              <p>Missing information cannot be converted into a favorable assumption merely because the route is urgent or commercially desirable.</p>
            </article>
            <article className="rule">
              <div className="rule-number">RULE 03</div>
              <h3>Correction preserves history</h3>
              <p>A corrected route creates a new version. The original HOLD remains part of the reconstructable execution record.</p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Knowledge check</div>
              <h2>Can you govern the gate?</h2>
            </div>
            <p className="section-copy">Answer all three questions, then submit your result.</p>
          </div>

          <div className="quiz">
            {questions.map((item, questionIndex) => (
              <article className="question" key={item.question}>
                <h3>{questionIndex + 1}. {item.question}</h3>
                <div className="choices">
                  {item.choices.map((choice, choiceIndex) => {
                    const chosen = answers[questionIndex] === choiceIndex;
                    const revealedClass = submitted
                      ? choiceIndex === item.correctIndex
                        ? 'correct'
                        : chosen
                          ? 'incorrect'
                          : ''
                      : chosen
                        ? 'selected'
                        : '';
                    return (
                      <label className={`choice ${revealedClass}`} key={choice}>
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          checked={chosen}
                          onChange={() => {
                            setAnswers((current) => ({ ...current, [questionIndex]: choiceIndex }));
                            setSubmitted(false);
                          }}
                        />
                        <span>{choice}</span>
                      </label>
                    );
                  })}
                </div>
                {submitted && <p className="explanation">{item.explanation}</p>}
              </article>
            ))}

            {!submitted ? (
              <button className="button primary" type="button" disabled={!completed} onClick={() => setSubmitted(true)}>
                {completed ? 'Submit knowledge check' : 'Answer every question'}
              </button>
            ) : (
              <div className="quiz-result">
                <strong>{score === questions.length ? 'Admissibility understood.' : `${score} of ${questions.length} correct.`}</strong>
                {score === questions.length
                  ? 'You correctly distinguished evidence-bound admissibility from ordinary approval.'
                  : 'Review the explanations, adjust your answers, and test the gate again.'}
              </div>
            )}
          </div>
        </section>

        <section className="final">
          <div className="eyebrow">Continue the route</div>
          <h2>Next: bind authority to the exact action.</h2>
          <p>
            Admissibility determines whether the route may advance. Binding proves that the actor, authority, evidence, beneficiary, destination, payload, scope, and time window belong to this exact execution object.
          </p>
          <div className="final-actions">
            <Link href="/workspace/demonstrations" className="button primary">Test the working route</Link>
            <Link href="/academy" className="button">Return to Academy</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
