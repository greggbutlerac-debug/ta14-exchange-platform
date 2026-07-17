'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type EventState = 'intact' | 'warning' | 'broken';

type ContinuityEvent = {
  id: string;
  time: string;
  title: string;
  actor: string;
  detail: string;
  hash: string;
  state: EventState;
};

const startingEvents: ContinuityEvent[] = [
  {
    id: 'capture',
    time: '10:14:08',
    title: 'Invoice captured',
    actor: 'Procurement system',
    detail: 'Invoice INV-1048 entered with supplier, amount, source, and observed time.',
    hash: '8f2c…c914',
    state: 'intact',
  },
  {
    id: 'identity',
    time: '10:14:42',
    title: 'Supplier identity attached',
    actor: 'Vendor registry',
    detail: 'Registry record attached to the same route identity and evidence index.',
    hash: '1ab7…55e0',
    state: 'intact',
  },
  {
    id: 'export',
    time: '10:15:27',
    title: 'Evidence exported',
    actor: 'Operator workstation',
    detail: 'The invoice was exported to a local file before the route test.',
    hash: '7d31…09af',
    state: 'warning',
  },
  {
    id: 'replacement',
    time: '10:16:03',
    title: 'File replaced without a recorded transformation',
    actor: 'Unknown process',
    detail: 'The route now points to a file whose digest does not match the captured source record.',
    hash: 'b902…2e17',
    state: 'broken',
  },
];

const checks = [
  {
    question: 'What does continuity prove?',
    choices: [
      'That a record looks plausible to the operator.',
      'That evidence remained traceably connected to its origin, versions, custody, and route.',
      'That a policy would normally permit the action.',
    ],
    correctIndex: 1,
    explanation:
      'Continuity is the preserved connection between the evidence used now and the reality and source from which it originated.',
  },
  {
    question: 'A file changes after capture, but no transformation event is recorded. What is the correct state?',
    choices: [
      'ALLOW because the filename is unchanged.',
      'Treat the change as harmless if the operator recognizes it.',
      'HOLD because the chain no longer proves that the tested evidence is the captured evidence.',
    ],
    correctIndex: 2,
    explanation:
      'An unexplained substitution breaks evidentiary continuity. Matching labels or filenames cannot repair a digest mismatch.',
  },
  {
    question: 'How should a legitimate correction be handled?',
    choices: [
      'Overwrite the old record so only the newest version remains.',
      'Create a new version and preserve the source, reason, actor, time, and relationship to the prior version.',
      'Create a different route with no relationship to the original.',
    ],
    correctIndex: 1,
    explanation:
      'Correction must be additive and reconstructable. The prior state remains part of the route history.',
  },
];

export default function ContinuityPage() {
  const [activeId, setActiveId] = useState(startingEvents[0].id);
  const [repairRecorded, setRepairRecorded] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const events = useMemo(() => {
    if (!repairRecorded) return startingEvents;
    return startingEvents.map((event) =>
      event.id === 'replacement'
        ? {
            ...event,
            title: 'Replacement rejected; verified source restored',
            actor: 'TA-14 continuity control',
            detail:
              'The unverified file was excluded. The last verified source digest was restored and the attempted substitution was preserved as an event.',
            hash: 'c438…6b91',
            state: 'intact' as EventState,
          }
        : event,
    );
  }, [repairRecorded]);

  const active = events.find((event) => event.id === activeId) || events[0];
  const complete = Object.keys(answers).length === checks.length;
  const score = checks.reduce(
    (total, check, index) => total + (answers[index] === check.correctIndex ? 1 : 0),
    0,
  );
  const chainState = events.some((event) => event.state === 'broken') ? 'BROKEN' : 'INTACT';

  return (
    <main className="lesson-page">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #02050a; color: #f5f8ff; }
        button, input { font: inherit; }
        a { color: inherit; }
        .lesson-page {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 10% 0%, rgba(153, 103, 255, .16), transparent 30%),
            radial-gradient(circle at 92% 10%, rgba(84, 232, 255, .13), transparent 28%),
            radial-gradient(circle at 52% 64%, rgba(57, 242, 161, .07), transparent 36%),
            linear-gradient(180deg, #02050a 0%, #07111c 50%, #02060b 100%);
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
        .shell { position: relative; z-index: 1; width: min(1220px, 92vw); margin: 0 auto; padding: 28px 0 110px; }
        .topbar { display: flex; align-items: center; justify-content: space-between; gap: 22px; margin-bottom: 74px; }
        .brand { display: inline-flex; align-items: center; gap: 12px; color: #fff; text-decoration: none; font-weight: 950; letter-spacing: .09em; }
        .brand-mark { display: grid; place-items: center; width: 44px; height: 44px; border: 1px solid rgba(153,103,255,.48); border-radius: 14px; background: linear-gradient(145deg, rgba(153,103,255,.22), rgba(84,232,255,.05)); box-shadow: 0 0 32px rgba(153,103,255,.18); }
        .nav-actions, .hero-actions, .final-actions { display: flex; flex-wrap: wrap; gap: 11px; }
        .nav-link, .primary, .secondary { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0 18px; border-radius: 999px; text-decoration: none; font-weight: 900; transition: .2s ease; }
        .nav-link, .secondary { border: 1px solid rgba(145,180,214,.20); color: #d7e4f0; background: rgba(8,17,29,.66); }
        .nav-link:hover, .secondary:hover { transform: translateY(-1px); border-color: rgba(153,103,255,.55); }
        .primary { border: 0; color: #07100d; background: linear-gradient(100deg, #a87cff, #54e8ff); box-shadow: 0 0 38px rgba(153,103,255,.18); cursor: pointer; }
        .primary:hover { transform: translateY(-1px); filter: brightness(1.07); }
        .eyebrow { color: #b69aff; font-size: .75rem; font-weight: 950; letter-spacing: .16em; text-transform: uppercase; }
        .hero { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(300px, .9fr); align-items: center; gap: clamp(40px, 8vw, 100px); padding: 28px 0 90px; }
        h1 { max-width: 900px; margin: 18px 0 24px; font-size: clamp(3rem, 7.2vw, 6.7rem); line-height: .92; letter-spacing: -.065em; }
        .gradient-text { color: transparent; background: linear-gradient(100deg, #f8fcff 5%, #b69aff 48%, #54e8ff 90%); -webkit-background-clip: text; background-clip: text; }
        .lede { max-width: 760px; margin: 0 0 30px; color: #aebed0; font-size: clamp(1.06rem, 2vw, 1.28rem); line-height: 1.75; }
        .principle-card, .panel, .quiz, .final-card { border: 1px solid rgba(145,180,214,.16); background: linear-gradient(145deg, rgba(13,27,44,.88), rgba(5,12,22,.82)); box-shadow: 0 24px 90px rgba(0,0,0,.28); backdrop-filter: blur(18px); }
        .principle-card { position: relative; padding: 28px; border-radius: 28px; overflow: hidden; }
        .principle-card::after { content: ""; position: absolute; width: 180px; height: 180px; right: -60px; bottom: -80px; border-radius: 50%; background: rgba(153,103,255,.14); filter: blur(20px); }
        .status { display: inline-flex; align-items: center; gap: 9px; padding: 8px 12px; border-radius: 999px; font-size: .72rem; font-weight: 950; letter-spacing: .12em; }
        .status.broken { color: #ffbdc8; background: rgba(255,72,113,.10); border: 1px solid rgba(255,72,113,.28); }
        .status.intact { color: #7af4be; background: rgba(57,242,161,.09); border: 1px solid rgba(57,242,161,.26); }
        .principle-card h2 { margin: 22px 0 14px; font-size: clamp(1.7rem, 3vw, 2.55rem); letter-spacing: -.035em; }
        .principle-card p, .muted { color: #9dafc2; line-height: 1.72; }
        .section { padding: 80px 0; }
        .section-heading { max-width: 780px; margin-bottom: 34px; }
        .section-heading h2 { margin: 12px 0 14px; font-size: clamp(2.2rem, 5vw, 4.6rem); line-height: 1; letter-spacing: -.05em; }
        .section-heading p { margin: 0; color: #9dafc2; font-size: 1.08rem; line-height: 1.75; }
        .lab-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, .78fr); gap: 22px; }
        .panel { border-radius: 28px; padding: 24px; }
        .timeline { display: grid; gap: 12px; }
        .event { width: 100%; text-align: left; display: grid; grid-template-columns: 84px 1fr auto; gap: 14px; align-items: center; border: 1px solid rgba(145,180,214,.13); border-radius: 18px; padding: 16px; color: #eef6ff; background: rgba(4,10,18,.55); cursor: pointer; }
        .event:hover, .event.active { border-color: rgba(84,232,255,.42); background: rgba(16,34,53,.75); }
        .time { color: #6f8298; font-size: .78rem; font-weight: 900; font-variant-numeric: tabular-nums; }
        .event-title { font-weight: 900; }
        .event-actor { margin-top: 4px; color: #8094a9; font-size: .82rem; }
        .dot { width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 18px currentColor; }
        .dot.intact { color: #39f2a1; background: currentColor; }
        .dot.warning { color: #ffcb66; background: currentColor; }
        .dot.broken { color: #ff4871; background: currentColor; }
        .detail-card { display: flex; flex-direction: column; min-height: 100%; }
        .detail-card h3 { margin: 16px 0 10px; font-size: 1.7rem; letter-spacing: -.035em; }
        .meta { display: grid; gap: 10px; margin: 24px 0; }
        .meta-row { display: flex; justify-content: space-between; gap: 20px; padding: 12px 0; border-bottom: 1px solid rgba(145,180,214,.11); }
        .meta-row span:first-child { color: #74889e; }
        .meta-row span:last-child { text-align: right; font-weight: 800; }
        .callout { margin-top: auto; padding: 16px; border-radius: 16px; border: 1px solid rgba(153,103,255,.24); background: rgba(153,103,255,.08); color: #cfbefd; line-height: 1.6; }
        .repair { margin-top: 18px; width: 100%; }
        .repair:disabled { cursor: default; opacity: .62; }
        .rules { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .rule { padding: 22px; border-radius: 22px; border: 1px solid rgba(145,180,214,.14); background: rgba(8,17,29,.65); }
        .rule strong { display: block; margin-bottom: 10px; color: #f5f8ff; font-size: 1.08rem; }
        .rule p { margin: 0; color: #90a3b7; line-height: 1.65; }
        .quiz { border-radius: 30px; padding: clamp(24px, 5vw, 46px); }
        .question { padding: 28px 0; border-bottom: 1px solid rgba(145,180,214,.13); }
        .question:last-of-type { border-bottom: 0; }
        .question h3 { margin: 0 0 18px; font-size: 1.18rem; line-height: 1.5; }
        .choices { display: grid; gap: 10px; }
        .choice { display: flex; align-items: flex-start; gap: 12px; width: 100%; padding: 15px; border-radius: 15px; border: 1px solid rgba(145,180,214,.15); background: rgba(2,7,13,.42); color: #cbd8e5; text-align: left; cursor: pointer; }
        .choice:hover, .choice.selected { border-color: rgba(84,232,255,.42); background: rgba(84,232,255,.07); }
        .choice.correct { border-color: rgba(57,242,161,.46); background: rgba(57,242,161,.08); }
        .choice.incorrect { border-color: rgba(255,72,113,.44); background: rgba(255,72,113,.07); }
        .choice-badge { flex: 0 0 auto; display: grid; place-items: center; width: 25px; height: 25px; border-radius: 50%; border: 1px solid rgba(145,180,214,.28); font-size: .72rem; font-weight: 900; }
        .explanation { margin: 12px 0 0; color: #91a5ba; line-height: 1.65; }
        .quiz-footer { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-top: 28px; }
        .score { color: #b69aff; font-weight: 950; }
        .final-card { border-radius: 32px; padding: clamp(28px, 6vw, 62px); text-align: center; }
        .final-card h2 { margin: 12px auto 16px; max-width: 820px; font-size: clamp(2.2rem, 5vw, 4.8rem); line-height: 1; letter-spacing: -.055em; }
        .final-card p { max-width: 760px; margin: 0 auto 28px; color: #9dafc2; line-height: 1.75; }
        .final-actions { justify-content: center; }
        @media (max-width: 900px) {
          .hero, .lab-grid { grid-template-columns: 1fr; }
          .hero { padding-top: 10px; }
          .rules { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .shell { width: min(94vw, 1220px); }
          .topbar { align-items: flex-start; margin-bottom: 42px; }
          .nav-actions .nav-link:first-child { display: none; }
          .event { grid-template-columns: 1fr auto; }
          .time { grid-column: 1 / -1; }
          .quiz-footer { align-items: stretch; flex-direction: column; }
          .primary, .secondary { width: 100%; }
        }
      `}</style>

      <div className="shell">
        <header className="topbar">
          <Link href="/academy" className="brand">
            <span className="brand-mark">14</span>
            <span>TA-14 ACADEMY</span>
          </Link>
          <nav className="nav-actions" aria-label="Lesson navigation">
            <Link href="/academy/reality-and-record" className="nav-link">Previous lesson</Link>
            <Link href="/workspace/demonstrations" className="nav-link">Launch lab</Link>
          </nav>
        </header>

        <section className="hero">
          <div>
            <div className="eyebrow">Module 03 · Continuity</div>
            <h1>Evidence must remain <span className="gradient-text">connected.</span></h1>
            <p className="lede">
              Capturing a record is not enough. A consequential route must prove that the evidence tested at the gate is still the same evidence that originated from the declared source.
            </p>
            <div className="hero-actions">
              <a href="#continuity-lab" className="primary">Inspect the chain</a>
              <Link href="/architecture" className="secondary">Open architecture</Link>
            </div>
          </div>

          <aside className="principle-card">
            <span className={`status ${chainState.toLowerCase()}`}>{chainState} CONTINUITY</span>
            <h2>No hidden substitution.</h2>
            <p>
              Continuity preserves provenance, custody, timestamps, transformations, hashes, version relationships, and route identity. When one required connection breaks, the route cannot honestly claim that its evidence remained intact.
            </p>
          </aside>
        </section>

        <section id="continuity-lab" className="section">
          <div className="section-heading">
            <div className="eyebrow">Interactive continuity lab</div>
            <h2>Find the break before consequence.</h2>
            <p>
              Select each event. The first three preserve or describe the chain. The fourth introduces an unexplained substitution that changes what the route is actually testing.
            </p>
          </div>

          <div className="lab-grid">
            <div className="panel timeline">
              {events.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  className={`event ${activeId === event.id ? 'active' : ''}`}
                  onClick={() => setActiveId(event.id)}
                >
                  <span className="time">{event.time} ET</span>
                  <span>
                    <span className="event-title">{event.title}</span>
                    <span className="event-actor">{event.actor}</span>
                  </span>
                  <span className={`dot ${event.state}`} aria-label={event.state} />
                </button>
              ))}
            </div>

            <aside className="panel detail-card">
              <div className="eyebrow">Selected continuity event</div>
              <h3>{active.title}</h3>
              <p className="muted">{active.detail}</p>
              <div className="meta">
                <div className="meta-row"><span>Actor</span><span>{active.actor}</span></div>
                <div className="meta-row"><span>Observed time</span><span>{active.time} ET</span></div>
                <div className="meta-row"><span>Digest</span><span>{active.hash}</span></div>
                <div className="meta-row"><span>State</span><span>{active.state.toUpperCase()}</span></div>
              </div>
              <div className="callout">
                {chainState === 'BROKEN'
                  ? 'The route must HOLD. The tested object no longer corresponds to the verified source record.'
                  : 'The attempted substitution remains preserved, but it no longer controls the evidence used by the route.'}
              </div>
              <button
                type="button"
                className="primary repair"
                onClick={() => {
                  setRepairRecorded(true);
                  setActiveId('replacement');
                }}
                disabled={repairRecorded}
              >
                {repairRecorded ? 'Continuity restored and event preserved' : 'Reject substitution and restore verified source'}
              </button>
            </aside>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div className="eyebrow">Continuity discipline</div>
            <h2>Three rules govern the chain.</h2>
          </div>
          <div className="rules">
            <article className="rule"><strong>Preserve origin</strong><p>Record where the evidence came from, who observed it, when it existed, and how it entered the route.</p></article>
            <article className="rule"><strong>Preserve transformation</strong><p>Every conversion, correction, extraction, redaction, or replacement must be explicit and attributable.</p></article>
            <article className="rule"><strong>Preserve versions</strong><p>Corrections create new states. They do not erase the original HOLD, failed evidence, or prior route history.</p></article>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div className="eyebrow">Knowledge check</div>
            <h2>Can you protect continuity?</h2>
            <p>Answer all three questions, then score the lesson.</p>
          </div>

          <div className="quiz">
            {checks.map((check, questionIndex) => (
              <div className="question" key={check.question}>
                <h3>{questionIndex + 1}. {check.question}</h3>
                <div className="choices">
                  {check.choices.map((choice, choiceIndex) => {
                    const selected = answers[questionIndex] === choiceIndex;
                    const resultClass = submitted
                      ? choiceIndex === check.correctIndex
                        ? 'correct'
                        : selected
                          ? 'incorrect'
                          : ''
                      : selected
                        ? 'selected'
                        : '';
                    return (
                      <button
                        type="button"
                        className={`choice ${resultClass}`}
                        key={choice}
                        onClick={() => {
                          if (!submitted) setAnswers((current) => ({ ...current, [questionIndex]: choiceIndex }));
                        }}
                      >
                        <span className="choice-badge">{String.fromCharCode(65 + choiceIndex)}</span>
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>
                {submitted && <p className="explanation">{check.explanation}</p>}
              </div>
            ))}

            <div className="quiz-footer">
              <span className="score">
                {submitted ? `Score: ${score} / ${checks.length}` : complete ? 'Ready to score' : 'Complete every question'}
              </span>
              <button type="button" className="primary" disabled={!complete} onClick={() => setSubmitted(true)}>
                Check answers
              </button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="final-card">
            <div className="eyebrow">Module 03 complete</div>
            <h2>Continuity is what keeps a record honest over time.</h2>
            <p>
              The next module moves from connection to admissibility: whether the preserved evidence is complete, relevant, fresh, sufficient, and fit for the exact consequence being considered.
            </p>
            <div className="final-actions">
              <Link href="/workspace/demonstrations" className="primary">Test the live route</Link>
              <Link href="/academy" className="secondary">Return to Academy</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
