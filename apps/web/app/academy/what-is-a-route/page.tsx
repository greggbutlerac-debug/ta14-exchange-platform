'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type RouteElement = {
  id: string;
  number: string;
  title: string;
  label: string;
  description: string;
  example: string;
};

const routeElements: RouteElement[] = [
  {
    id: 'reality',
    number: '01',
    title: 'Reality',
    label: 'What is actually happening?',
    description:
      'The route begins with a real condition, request, event, or proposed action. Governance cannot begin with a dashboard claim that has already abstracted away the underlying reality.',
    example: 'A purchasing agent proposes a USD 32,500 payment to a named supplier.',
  },
  {
    id: 'record',
    number: '02',
    title: 'Record',
    label: 'What evidence represents that reality?',
    description:
      'The route needs a durable record of the actor, action object, destination, value, time, source evidence, and declared scope. A record is not automatically trustworthy merely because it exists.',
    example: 'The invoice, supplier identity, payment request, timestamps, and source system are recorded.',
  },
  {
    id: 'continuity',
    number: '03',
    title: 'Continuity',
    label: 'Can the evidence remain connected?',
    description:
      'Continuity preserves origin, custody, versions, transformations, and dependencies so the evidence used at the gate can be traced back to its source without hidden substitution.',
    example: 'The invoice and identity evidence remain bound to the same route through every version.',
  },
  {
    id: 'admissibility',
    number: '04',
    title: 'Admissibility',
    label: 'Is the route allowed to advance?',
    description:
      'The route is tested before consequence. Missing or invalid proof produces HOLD, DENY, or ESCALATE rather than allowing the action to proceed on confidence, urgency, or policy appearance alone.',
    example: 'The first test returns HOLD because dual authority and beneficiary proof are incomplete.',
  },
  {
    id: 'binding',
    number: '05',
    title: 'Binding',
    label: 'Is authority connected to this exact action?',
    description:
      'Generic permission is not enough. The accountable authority must be bound to the exact actor, object, destination, beneficiary, value, scope, and valid time window.',
    example: 'Procurement and finance authority are bound to this invoice and this beneficiary.',
  },
  {
    id: 'commit',
    number: '06',
    title: 'Commit',
    label: 'What state is durably accepted?',
    description:
      'A corrected route creates a new immutable version. The original HOLD remains visible. Commit establishes the exact route state against which execution must later correspond.',
    example: 'Version 2 contains the missing proof while version 1 remains preserved as HOLD.',
  },
  {
    id: 'execution',
    number: '07',
    title: 'Execution',
    label: 'Did the approved action actually occur?',
    description:
      'Governance must remain attached to the action after approval. The executed actor, object, destination, value, and timing must correspond to the committed route.',
    example: 'The authorized payment is issued to the exact bound supplier for the exact approved amount.',
  },
  {
    id: 'outcome',
    number: '08',
    title: 'Outcome',
    label: 'What consequence was created?',
    description:
      'The final route state records and verifies the result. Outcome correspondence tests whether the observed consequence matches the route that was admitted, committed, and executed.',
    example: 'The payment settled to the approved beneficiary and the reconstructable record is preserved.',
  },
];

const knowledgeChecks = [
  {
    question: 'Which statement best defines a governance route?',
    choices: [
      'A diagram showing the steps in a business workflow.',
      'An inspectable path that binds evidence, authority, continuity, execution, and consequence.',
      'A policy document that says which actions are generally permitted.',
    ],
    correctIndex: 1,
    explanation:
      'A workflow shows movement. A governance route proves whether that movement is legitimate before and after consequence.',
  },
  {
    question: 'A policy check passes, but beneficiary evidence is missing. What should happen?',
    choices: [
      'ALLOW because the written policy passed.',
      'Execute and request the evidence afterward.',
      'HOLD the route until the missing proof is supplied and bound.',
    ],
    correctIndex: 2,
    explanation:
      'Policy permission cannot replace missing evidence. The route remains inadmissible until the required proof exists.',
  },
  {
    question: 'What happens when a HOLD is corrected in TA-14?',
    choices: [
      'The failed version is overwritten with the corrected information.',
      'A new immutable version is created while the original HOLD remains preserved.',
      'The route identity is discarded and an unrelated route is created.',
    ],
    correctIndex: 1,
    explanation:
      'Correction must preserve history. The route advances by versioning, not by erasing the evidence of what previously failed.',
  },
];

export default function WhatIsARoutePage() {
  const [activeElement, setActiveElement] = useState(routeElements[0].id);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const active =
    routeElements.find((element) => element.id === activeElement) || routeElements[0];

  const score = useMemo(
    () =>
      knowledgeChecks.reduce(
        (total, check, index) =>
          total + (answers[index] === check.correctIndex ? 1 : 0),
        0,
      ),
    [answers],
  );

  const complete = Object.keys(answers).length === knowledgeChecks.length;

  return (
    <main className="lesson-page">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #02050a; color: #f5f8ff; }
        button, input { font: inherit; }
        a { color: inherit; }

        .lesson-page {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 12% 0%, rgba(45, 185, 255, .17), transparent 30%),
            radial-gradient(circle at 91% 10%, rgba(61, 241, 169, .10), transparent 27%),
            radial-gradient(circle at 52% 58%, rgba(111, 82, 255, .08), transparent 35%),
            linear-gradient(180deg, #02050a 0%, #07111c 48%, #02060b 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .lesson-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .22;
          background-image:
            linear-gradient(rgba(255,255,255,.026) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.026) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, #000, transparent 90%);
        }

        .shell {
          position: relative;
          z-index: 1;
          width: min(1220px, 92vw);
          margin: 0 auto;
          padding: 28px 0 110px;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          margin-bottom: 74px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          text-decoration: none;
          font-weight: 950;
          letter-spacing: .09em;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(84, 232, 255, .46);
          border-radius: 14px;
          background: linear-gradient(145deg, rgba(84, 232, 255, .18), rgba(41, 167, 255, .04));
          box-shadow: 0 0 32px rgba(41, 167, 255, .20), inset 0 0 18px rgba(84, 232, 255, .05);
        }

        .nav-actions, .hero-actions, .final-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
        }

        .nav-link, .primary, .secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 900;
          transition: transform .2s ease, border-color .2s ease, filter .2s ease, background .2s ease;
        }

        .nav-link, .secondary {
          border: 1px solid rgba(145, 180, 214, .20);
          color: #d7e4f0;
          background: rgba(8, 17, 29, .66);
        }

        .nav-link:hover, .secondary:hover {
          transform: translateY(-1px);
          border-color: rgba(84, 232, 255, .44);
        }

        .primary {
          border: 0;
          color: #03100c;
          background: linear-gradient(100deg, #54e8ff, #39f2a1);
          box-shadow: 0 0 38px rgba(57, 242, 161, .16);
        }

        .primary:hover { transform: translateY(-1px); filter: brightness(1.07); }
        .primary:disabled { cursor: not-allowed; opacity: .5; }

        .eyebrow {
          color: #65e9ff;
          font-size: .75rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.18fr) minmax(300px, .82fr);
          gap: 48px;
          align-items: end;
          margin-bottom: 84px;
        }

        .hero h1 {
          max-width: 900px;
          margin: 18px 0 24px;
          font-size: clamp(3.7rem, 8.5vw, 7.6rem);
          line-height: .89;
          letter-spacing: -.075em;
        }

        .gradient {
          color: transparent;
          background: linear-gradient(100deg, #fff 8%, #8deeff 48%, #50f0b4 94%);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero p {
          max-width: 780px;
          margin: 0;
          color: #9db0c4;
          font-size: clamp(1.04rem, 2vw, 1.25rem);
          line-height: 1.78;
        }

        .hero-actions { margin-top: 28px; }

        .lesson-card {
          padding: 28px;
          border: 1px solid rgba(137, 174, 213, .16);
          border-radius: 28px;
          background: linear-gradient(180deg, rgba(14, 27, 44, .86), rgba(5, 12, 21, .92));
          box-shadow: 0 30px 90px rgba(0,0,0,.28);
        }

        .lesson-card h2 {
          margin: 12px 0 12px;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          letter-spacing: -.045em;
        }

        .lesson-meta { display: grid; gap: 12px; margin-top: 22px; }
        .meta-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding-top: 12px;
          border-top: 1px solid rgba(137,174,213,.12);
          color: #8195aa;
          font-size: .84rem;
        }
        .meta-row strong { color: #edf7ff; text-align: right; }

        .principle {
          margin-bottom: 84px;
          padding: clamp(28px, 6vw, 58px);
          border: 1px solid rgba(84, 232, 255, .21);
          border-radius: 30px;
          background:
            radial-gradient(circle at 80% 40%, rgba(57,242,161,.10), transparent 28%),
            linear-gradient(115deg, rgba(18,41,61,.95), rgba(6,15,25,.96));
          box-shadow: 0 35px 100px rgba(0,0,0,.28);
        }

        .principle blockquote {
          margin: 18px 0 16px;
          font-size: clamp(2.2rem, 5.4vw, 5.2rem);
          line-height: .98;
          letter-spacing: -.06em;
          font-weight: 950;
        }

        .principle p { max-width: 820px; margin: 0; color: #9eb2c6; line-height: 1.75; }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 28px;
        }

        .section-heading h2 {
          max-width: 780px;
          margin: 12px 0 0;
          font-size: clamp(2.2rem, 5vw, 4.4rem);
          line-height: .98;
          letter-spacing: -.06em;
        }

        .section-heading p { max-width: 430px; margin: 0; color: #91a5ba; line-height: 1.7; }

        .anatomy { margin-bottom: 92px; }
        .anatomy-grid {
          display: grid;
          grid-template-columns: minmax(280px, .72fr) minmax(0, 1.28fr);
          gap: 22px;
          align-items: start;
        }

        .element-list {
          display: grid;
          gap: 10px;
          padding: 12px;
          border: 1px solid rgba(137,174,213,.14);
          border-radius: 24px;
          background: rgba(6,14,24,.72);
        }

        .element-button {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 13px;
          align-items: center;
          width: 100%;
          padding: 15px;
          border: 1px solid transparent;
          border-radius: 16px;
          color: #9fb1c4;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: border-color .2s ease, background .2s ease, transform .2s ease;
        }

        .element-button:hover { transform: translateX(2px); background: rgba(84,232,255,.045); }
        .element-button.active {
          border-color: rgba(84,232,255,.30);
          color: #eef8ff;
          background: rgba(84,232,255,.075);
        }

        .element-number {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(84,232,255,.20);
          border-radius: 13px;
          color: #6ee9ff;
          background: rgba(5,15,25,.72);
          font-size: .72rem;
          font-weight: 950;
          letter-spacing: .09em;
        }

        .element-button strong { display: block; font-size: .95rem; }
        .element-button span:last-child { display: block; margin-top: 3px; color: #71869a; font-size: .76rem; }

        .element-detail {
          min-height: 520px;
          padding: clamp(28px, 5vw, 54px);
          border: 1px solid rgba(84,232,255,.18);
          border-radius: 28px;
          background:
            radial-gradient(circle at 82% 15%, rgba(84,232,255,.10), transparent 28%),
            linear-gradient(180deg, rgba(14,27,44,.90), rgba(5,12,21,.94));
          box-shadow: 0 30px 90px rgba(0,0,0,.30);
        }

        .element-detail h3 {
          margin: 14px 0 12px;
          font-size: clamp(2.8rem, 6vw, 5.6rem);
          line-height: .92;
          letter-spacing: -.065em;
        }

        .element-label { color: #67e8ff; font-weight: 900; }
        .element-description { max-width: 780px; color: #9db0c4; line-height: 1.8; font-size: 1.05rem; }
        .example {
          margin-top: 30px;
          padding: 20px;
          border: 1px solid rgba(57,242,161,.18);
          border-radius: 18px;
          color: #bad2c7;
          background: rgba(57,242,161,.055);
          line-height: 1.65;
        }
        .example strong { display: block; margin-bottom: 7px; color: #65f1b1; font-size: .74rem; letter-spacing: .13em; text-transform: uppercase; }

        .scenario { margin-bottom: 92px; }
        .scenario-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 16px; }
        .scenario-card {
          min-height: 260px;
          padding: 25px;
          border: 1px solid rgba(137,174,213,.14);
          border-radius: 22px;
          background: linear-gradient(180deg, rgba(13,25,41,.86), rgba(5,12,21,.91));
        }
        .scenario-card h3 { margin: 14px 0 12px; font-size: 1.55rem; letter-spacing: -.035em; }
        .scenario-card p { margin: 0; color: #8fa4b9; line-height: 1.68; }
        .scenario-card.hold { border-color: rgba(255,90,122,.24); }
        .scenario-card.allow { border-color: rgba(57,242,161,.23); }
        .status {
          display: inline-flex;
          min-height: 29px;
          align-items: center;
          padding: 0 10px;
          border-radius: 999px;
          font-size: .7rem;
          font-weight: 950;
          letter-spacing: .11em;
        }
        .status.ready { color: #83eaff; background: rgba(84,232,255,.09); border: 1px solid rgba(84,232,255,.20); }
        .status.hold { color: #ff9bb0; background: rgba(255,69,107,.09); border: 1px solid rgba(255,69,107,.22); }
        .status.allow { color: #72f6b8; background: rgba(57,242,161,.09); border: 1px solid rgba(57,242,161,.22); }

        .knowledge { margin-bottom: 92px; }
        .questions { display: grid; gap: 18px; }
        .question {
          padding: clamp(24px, 4vw, 36px);
          border: 1px solid rgba(137,174,213,.15);
          border-radius: 24px;
          background: rgba(8,18,30,.78);
        }
        .question h3 { margin: 10px 0 20px; font-size: clamp(1.35rem, 3vw, 2rem); letter-spacing: -.035em; }
        .choices { display: grid; gap: 10px; }
        .choice {
          display: grid;
          grid-template-columns: 22px 1fr;
          gap: 12px;
          align-items: start;
          padding: 15px;
          border: 1px solid rgba(137,174,213,.13);
          border-radius: 14px;
          color: #9fb1c4;
          background: rgba(2,8,14,.44);
          cursor: pointer;
        }
        .choice.selected { border-color: rgba(84,232,255,.38); color: #edf8ff; background: rgba(84,232,255,.065); }
        .choice.correct { border-color: rgba(57,242,161,.35); background: rgba(57,242,161,.065); }
        .choice.incorrect { border-color: rgba(255,69,107,.32); background: rgba(255,69,107,.055); }
        .choice input { margin-top: 3px; accent-color: #54e8ff; }
        .explanation { margin: 16px 0 0; color: #a8bdca; line-height: 1.65; }

        .submit-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 22px; }
        .score { color: #9db0c4; font-weight: 800; }
        .score strong { color: #fff; }

        .completion {
          padding: clamp(30px, 6vw, 62px);
          border: 1px solid rgba(57,242,161,.24);
          border-radius: 30px;
          text-align: center;
          background:
            radial-gradient(circle at 50% 0%, rgba(57,242,161,.12), transparent 34%),
            linear-gradient(180deg, rgba(13,30,37,.92), rgba(5,13,21,.96));
          box-shadow: 0 35px 100px rgba(0,0,0,.30);
        }
        .completion h2 { margin: 14px auto 16px; max-width: 850px; font-size: clamp(2.4rem, 5vw, 4.8rem); line-height: .98; letter-spacing: -.06em; }
        .completion p { max-width: 760px; margin: 0 auto; color: #9fb5c3; line-height: 1.75; }
        .final-actions { justify-content: center; margin-top: 28px; }

        @media (max-width: 960px) {
          .hero, .anatomy-grid { grid-template-columns: 1fr; }
          .scenario-grid { grid-template-columns: 1fr; }
          .section-heading { display: block; }
          .section-heading p { margin-top: 16px; }
          .element-detail { min-height: 0; }
        }

        @media (max-width: 720px) {
          .topbar { margin-bottom: 54px; }
          .nav-actions { display: none; }
          .hero h1 { font-size: 3.7rem; }
          .submit-row { align-items: stretch; flex-direction: column; }
          .submit-row .primary { width: 100%; }
          .meta-row { align-items: flex-start; flex-direction: column; gap: 6px; }
          .meta-row strong { text-align: left; }
        }
      `}</style>

      <div className="shell">
        <nav className="topbar" aria-label="Academy lesson navigation">
          <Link className="brand" href="/academy">
            <span className="brand-mark">14</span>
            <span>TA-14 ACADEMY</span>
          </Link>

          <div className="nav-actions">
            <Link className="nav-link" href="/academy">Academy hub</Link>
            <Link className="nav-link" href="/workspace">Workspace</Link>
            <Link className="nav-link" href="/workspace/demonstrations">Live demonstrations</Link>
          </div>
        </nav>

        <section className="hero">
          <div>
            <div className="eyebrow">Module 01 · Orientation</div>
            <h1>
              <span className="gradient">What is a governance route?</span>
            </h1>
            <p>
              A governance route is the inspectable path through which reality,
              evidence, authority, admissibility, execution, and consequence remain
              connected. It does not merely describe what should happen. It provides
              the structure for proving whether an action was legitimate.
            </p>
            <div className="hero-actions">
              <button
                className="primary"
                onClick={() =>
                  document.getElementById('route-anatomy')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Begin the lesson →
              </button>
              <Link className="secondary" href="/workspace/demonstrations">
                Open the live route engine
              </Link>
            </div>
          </div>

          <aside className="lesson-card">
            <div className="eyebrow">Lesson objective</div>
            <h2>Recognize the route before trying to govern it.</h2>
            <p style={{ color: '#93a6ba', lineHeight: 1.7, margin: 0 }}>
              By the end of this module, you should be able to identify the proposed
              consequence, accountable actor, action object, destination, evidence,
              authority, and governing boundary.
            </p>
            <div className="lesson-meta">
              <div className="meta-row"><span>Level</span><strong>Foundation</strong></div>
              <div className="meta-row"><span>Estimated time</span><strong>12–18 minutes</strong></div>
              <div className="meta-row"><span>Practice</span><strong>Live Exchange demonstration</strong></div>
            </div>
          </aside>
        </section>

        <section className="principle">
          <div className="eyebrow">The governing principle</div>
          <blockquote>No admissible evidence. No admissible execution.</blockquote>
          <p>
            A route cannot become legitimate merely because an actor is authorized,
            a policy appears to permit the action, or a system reports confidence.
            The evidence, authority, continuity, binding, and execution state must be
            admissible for the exact consequence being proposed.
          </p>
        </section>

        <section className="anatomy" id="route-anatomy">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Interactive route anatomy</div>
              <h2>Follow the route from reality to outcome.</h2>
            </div>
            <p>
              Select each stage to see what it contributes and how it appears in a
              consequential payment route.
            </p>
          </div>

          <div className="anatomy-grid">
            <div className="element-list" role="tablist" aria-label="TA-14 route stages">
              {routeElements.map((element) => (
                <button
                  className={`element-button ${active.id === element.id ? 'active' : ''}`}
                  key={element.id}
                  onClick={() => setActiveElement(element.id)}
                  role="tab"
                  aria-selected={active.id === element.id}
                >
                  <span className="element-number">{element.number}</span>
                  <span>
                    <strong>{element.title}</strong>
                    <span>{element.label}</span>
                  </span>
                </button>
              ))}
            </div>

            <article className="element-detail" role="tabpanel">
              <div className="eyebrow">Stage {active.number}</div>
              <h3>{active.title}</h3>
              <div className="element-label">{active.label}</div>
              <p className="element-description">{active.description}</p>
              <div className="example">
                <strong>Route example</strong>
                {active.example}
              </div>
            </article>
          </div>
        </section>

        <section className="scenario">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Consequence walkthrough</div>
              <h2>A route is tested, corrected, and preserved.</h2>
            </div>
            <p>
              This is the same basic lifecycle you can operate inside the live TA-14
              Exchange demonstration.
            </p>
          </div>

          <div className="scenario-grid">
            <article className="scenario-card">
              <span className="status ready">PROPOSED</span>
              <h3>USD 32,500 vendor payment</h3>
              <p>
                An accountable purchasing system proposes a payment to a named
                supplier. The route includes the actor, invoice, beneficiary, value,
                and policy family.
              </p>
            </article>

            <article className="scenario-card hold">
              <span className="status hold">HOLD</span>
              <h3>The consequence is stopped.</h3>
              <p>
                The engine finds incomplete dual authority and beneficiary proof.
                The action does not execute. The failed version remains part of the
                route history.
              </p>
            </article>

            <article className="scenario-card allow">
              <span className="status allow">ALLOW</span>
              <h3>Correction creates a new version.</h3>
              <p>
                Missing proof is supplied, bound, and retested. The corrected route
                advances without erasing the original HOLD, then generates a
                preserved Admissible Execution Record.
              </p>
            </article>
          </div>
        </section>

        <section className="knowledge">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Knowledge check</div>
              <h2>Can you recognize an admissible route?</h2>
            </div>
            <p>
              Answer all three questions. Your result is local to this lesson and is
              not a credential or certification decision.
            </p>
          </div>

          <div className="questions">
            {knowledgeChecks.map((check, questionIndex) => (
              <article className="question" key={check.question}>
                <div className="eyebrow">Question 0{questionIndex + 1}</div>
                <h3>{check.question}</h3>
                <div className="choices">
                  {check.choices.map((choice, choiceIndex) => {
                    const selected = answers[questionIndex] === choiceIndex;
                    const resultClass = submitted
                      ? choiceIndex === check.correctIndex
                        ? 'correct'
                        : selected
                          ? 'incorrect'
                          : ''
                      : '';

                    return (
                      <label
                        className={`choice ${selected ? 'selected' : ''} ${resultClass}`}
                        key={choice}
                      >
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          checked={selected}
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
                {submitted && <p className="explanation">{check.explanation}</p>}
              </article>
            ))}
          </div>

          <div className="submit-row">
            <div className="score">
              {submitted ? (
                <span>Result: <strong>{score} of {knowledgeChecks.length}</strong> correct</span>
              ) : (
                <span>Select one answer for each question.</span>
              )}
            </div>
            <button
              className="primary"
              disabled={!complete}
              onClick={() => setSubmitted(true)}
            >
              Check my answers →
            </button>
          </div>
        </section>

        <section className="completion">
          <div className="eyebrow">Practice the concept</div>
          <h2>Now watch a real route encounter the admissibility gate.</h2>
          <p>
            Launch the prepared Vendor Payment Route. Run the initial submission,
            inspect why TA-14 returns HOLD, supply the missing authority and
            beneficiary evidence, rerun the route, and preserve the resulting record.
          </p>
          <div className="final-actions">
            <Link className="primary" href="/workspace/demonstrations">
              Launch the live exercise →
            </Link>
            <Link className="secondary" href="/academy">
              Return to Academy
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
