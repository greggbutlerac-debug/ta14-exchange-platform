'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type OutcomeKey = 'execution' | 'settlement' | 'beneficiary' | 'amount' | 'receipt' | 'replay';

type OutcomeCheck = {
  key: OutcomeKey;
  label: string;
  expected: string;
  observed: string;
  detail: string;
};

const originalChecks: OutcomeCheck[] = [
  {
    key: 'execution',
    label: 'Execution identity',
    expected: 'PAY-VENDOR-042 / commit 7F2A',
    observed: 'PAY-VENDOR-042 / commit 7F2A',
    detail: 'The observed consequence must remain linked to the exact admitted and committed route.',
  },
  {
    key: 'settlement',
    label: 'Settlement state',
    expected: 'SETTLED',
    observed: 'SETTLED',
    detail: 'The system must verify the real-world completion state instead of assuming success from an API response.',
  },
  {
    key: 'beneficiary',
    label: 'Beneficiary outcome',
    expected: 'Northstar Components LLC',
    observed: 'Northstar Components LLC',
    detail: 'The actual recipient must correspond to the beneficiary bound before execution.',
  },
  {
    key: 'amount',
    label: 'Final consequence amount',
    expected: '$48,750.00',
    observed: '$48,750.00',
    detail: 'The final amount must remain within the exact committed consequence boundary.',
  },
  {
    key: 'receipt',
    label: 'External outcome receipt',
    expected: 'BANK-ACK-98114',
    observed: 'BANK-ACK-98114',
    detail: 'An independently attributable receipt binds the claimed outcome to an external system of record.',
  },
  {
    key: 'replay',
    label: 'Replay package',
    expected: 'COMPLETE',
    observed: 'MISSING OUTCOME ARTIFACT',
    detail: 'Independent verification requires the evidence, decisions, commit, execution receipt, and outcome artifact together.',
  },
];

const questions = [
  {
    question: 'What is outcome correspondence?',
    choices: [
      'Proof that the system attempted the action.',
      'Proof that the real consequence matched the consequence admitted, committed, and executed.',
      'A narrative written after the route closes.',
    ],
    correctIndex: 1,
    explanation:
      'Execution proves what the system did. Outcome correspondence proves what consequence actually occurred in the external world.',
  },
  {
    question: 'Why is an API success response insufficient by itself?',
    choices: [
      'API responses are never useful.',
      'A request can be accepted while settlement, delivery, or the real-world consequence later fails or changes.',
      'The operator should replace it with a screenshot.',
    ],
    correctIndex: 1,
    explanation:
      'A transport or service acknowledgement is not always the final outcome. Verification must reach the authoritative consequence record.',
  },
  {
    question: 'What makes a route independently replayable?',
    choices: [
      'A dashboard showing a green status.',
      'A preserved package containing the evidence, authority, decisions, commit, execution correspondence, and outcome receipts.',
      'The operator remembering what happened.',
    ],
    correctIndex: 1,
    explanation:
      'Replay depends on preserved artifacts and deterministic relationships, not continued trust in the original operator or interface.',
  },
];

const verificationLayers = [
  ['Execution receipt', 'Shows what instruction was released, by whom, where, and under which commit.'],
  ['External outcome', 'Shows what the destination system or physical environment says actually occurred.'],
  ['Correspondence', 'Compares the final consequence with the admitted and committed route boundaries.'],
  ['Continuity', 'Preserves origin, transformations, timestamps, signatures, and dependencies across the full route.'],
  ['Replay package', 'Allows another verifier to reconstruct the route without trusting the original dashboard.'],
  ['Outcome classification', 'Closes the route as VERIFIED, DIVERGENT, INCOMPLETE, or DISPUTED.'],
];

export default function OutcomeAndVerificationPage() {
  const [checks, setChecks] = useState<OutcomeCheck[]>(originalChecks);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [artifactAttached, setArtifactAttached] = useState(false);

  const mismatches = checks.filter((check) => check.expected !== check.observed);
  const status = mismatches.length === 0 ? 'OUTCOME VERIFIED' : 'VERIFICATION INCOMPLETE';
  const score = useMemo(
    () => questions.reduce((total, item, index) => total + (answers[index] === item.correctIndex ? 1 : 0), 0),
    [answers],
  );

  function attachOutcomeArtifact() {
    setChecks((current) =>
      current.map((check) =>
        check.key === 'replay' ? { ...check, observed: check.expected } : check,
      ),
    );
    setArtifactAttached(true);
  }

  function introduceSettlementDivergence() {
    setChecks((current) =>
      current.map((check) =>
        check.key === 'settlement' ? { ...check, observed: 'RETURNED AFTER SETTLEMENT' } : check,
      ),
    );
    setArtifactAttached(false);
  }

  function resetLab() {
    setChecks(originalChecks);
    setArtifactAttached(false);
  }

  return (
    <main className="lesson-page">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body { margin:0; background:#02050a; color:#f4f8ff; }
        button { font:inherit; }
        a { color:inherit; }
        .lesson-page { min-height:100vh; overflow:hidden; background:radial-gradient(circle at 8% 0%,rgba(79,215,255,.15),transparent 30%),radial-gradient(circle at 92% 14%,rgba(167,111,255,.15),transparent 28%),linear-gradient(180deg,#02050a 0%,#07101b 52%,#02060b 100%); font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
        .lesson-page::before { content:""; position:fixed; inset:0; pointer-events:none; opacity:.2; background-image:linear-gradient(rgba(255,255,255,.026) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.026) 1px,transparent 1px); background-size:42px 42px; mask-image:linear-gradient(to bottom,#000,transparent 92%); }
        .shell { position:relative; z-index:1; width:min(1220px,92vw); margin:0 auto; padding:28px 0 110px; }
        .topbar { display:flex; align-items:center; justify-content:space-between; gap:22px; margin-bottom:72px; }
        .brand { display:inline-flex; align-items:center; gap:12px; text-decoration:none; font-weight:950; letter-spacing:.09em; }
        .brand-mark { display:grid; place-items:center; width:44px; height:44px; border:1px solid rgba(84,232,255,.46); border-radius:14px; background:linear-gradient(145deg,rgba(84,232,255,.18),rgba(41,167,255,.04)); box-shadow:0 0 32px rgba(41,167,255,.2); }
        .nav-actions,.hero-actions,.final-actions,.lab-actions { display:flex; flex-wrap:wrap; gap:11px; }
        .button { display:inline-flex; align-items:center; justify-content:center; min-height:44px; padding:0 17px; border:1px solid rgba(255,255,255,.13); border-radius:12px; background:rgba(255,255,255,.045); color:#f7fbff; text-decoration:none; font-weight:800; transition:.2s ease; cursor:pointer; }
        .button:hover { transform:translateY(-2px); border-color:rgba(84,232,255,.48); background:rgba(84,232,255,.09); }
        .button.primary { border-color:rgba(84,232,255,.65); color:#021018; background:linear-gradient(135deg,#6de8ff,#58f0b5); box-shadow:0 14px 40px rgba(44,198,255,.18); }
        .button:disabled { opacity:.45; cursor:not-allowed; transform:none; }
        .eyebrow { color:#71e8ff; font-size:.76rem; font-weight:950; letter-spacing:.18em; text-transform:uppercase; }
        .hero { display:grid; grid-template-columns:1.12fr .88fr; gap:46px; align-items:center; margin-bottom:90px; }
        h1 { max-width:850px; margin:14px 0 20px; font-size:clamp(3.1rem,7vw,6.5rem); line-height:.94; letter-spacing:-.065em; }
        .lead { max-width:760px; margin:0 0 27px; color:#aebdce; font-size:clamp(1.03rem,1.8vw,1.24rem); line-height:1.72; }
        .principle { margin-top:28px; padding:20px 22px; border-left:3px solid #62e6ff; border-radius:0 16px 16px 0; background:linear-gradient(90deg,rgba(84,232,255,.11),rgba(84,232,255,.025)); font-size:1.06rem; font-weight:900; }
        .visual { position:relative; min-height:410px; display:grid; place-items:center; }
        .ring { position:absolute; border:1px solid rgba(100,229,255,.2); border-radius:50%; animation:pulse 4s ease-in-out infinite; }
        .ring.r1 { width:330px; height:330px; }
        .ring.r2 { width:260px; height:260px; animation-delay:.7s; }
        .ring.r3 { width:190px; height:190px; animation-delay:1.4s; }
        @keyframes pulse { 0%,100% { transform:scale(.97); opacity:.42; } 50% { transform:scale(1.04); opacity:.9; } }
        .core { position:relative; z-index:2; width:225px; height:225px; display:grid; place-items:center; text-align:center; border:1px solid ${mismatches.length === 0 ? 'rgba(87,239,184,.62)' : 'rgba(255,196,95,.62)'}; border-radius:50%; background:radial-gradient(circle,${mismatches.length === 0 ? 'rgba(72,225,160,.18)' : 'rgba(255,177,60,.16)'},rgba(7,13,22,.96) 69%); box-shadow:0 0 75px ${mismatches.length === 0 ? 'rgba(72,225,160,.16)' : 'rgba(255,177,60,.14)'}; }
        .core strong { display:block; color:${mismatches.length === 0 ? '#69efb9' : '#ffc56b'}; font-size:1.25rem; letter-spacing:.04em; }
        .core span { color:#9dafc1; font-size:.7rem; text-transform:uppercase; letter-spacing:.16em; }
        .section { margin-top:90px; }
        .section-head { display:flex; align-items:end; justify-content:space-between; gap:24px; margin-bottom:28px; }
        .section h2 { margin:8px 0 0; font-size:clamp(2rem,4vw,3.5rem); letter-spacing:-.045em; }
        .section-copy { max-width:660px; color:#9fb0c3; line-height:1.7; }
        .dimension-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .dimension { min-height:175px; padding:22px; border:1px solid rgba(255,255,255,.1); border-radius:20px; background:rgba(8,16,27,.76); }
        .dimension span { display:block; color:#73e8ff; font-size:.72rem; font-weight:900; letter-spacing:.15em; text-transform:uppercase; margin-bottom:14px; }
        .dimension h3 { margin:0 0 9px; font-size:1.15rem; }
        .dimension p { margin:0; color:#9fb0c3; line-height:1.62; }
        .lab { overflow:hidden; border:1px solid rgba(111,226,255,.18); border-radius:26px; background:rgba(5,12,21,.86); box-shadow:0 30px 90px rgba(0,0,0,.28); }
        .lab-bar { display:flex; justify-content:space-between; align-items:center; gap:18px; padding:20px 23px; border-bottom:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.025); }
        .status { padding:8px 12px; border-radius:999px; font-size:.72rem; font-weight:950; letter-spacing:.12em; color:${mismatches.length === 0 ? '#76efbd' : '#ffc56b'}; background:${mismatches.length === 0 ? 'rgba(72,225,160,.1)' : 'rgba(255,177,60,.1)'}; }
        .lab-body { display:grid; grid-template-columns:1.15fr .85fr; min-height:570px; }
        .check-list { padding:22px; border-right:1px solid rgba(255,255,255,.08); }
        .check { display:grid; grid-template-columns:14px 1fr auto; gap:14px; align-items:start; padding:18px; margin-bottom:11px; border:1px solid rgba(255,255,255,.09); border-radius:16px; background:rgba(255,255,255,.025); }
        .check.mismatch { border-color:rgba(255,190,92,.28); background:rgba(255,177,60,.055); }
        .dot { width:11px; height:11px; margin-top:5px; border-radius:50%; background:#64eab5; box-shadow:0 0 12px rgba(72,225,160,.45); }
        .mismatch .dot { background:#ffc15f; box-shadow:0 0 12px rgba(255,177,60,.45); }
        .check h3 { margin:0 0 7px; font-size:1rem; }
        .check p { margin:0; color:#91a5ba; line-height:1.55; font-size:.9rem; }
        .check-values { min-width:245px; text-align:right; }
        .check-values span { display:block; color:#7f93a8; font-size:.65rem; font-weight:900; letter-spacing:.1em; text-transform:uppercase; }
        .check-values strong { display:block; margin:4px 0 9px; font-size:.86rem; overflow-wrap:anywhere; }
        .decision { padding:34px; }
        .decision h3 { margin:9px 0 12px; font-size:clamp(1.8rem,3vw,2.6rem); }
        .decision > p { color:#a6b7c9; line-height:1.68; }
        .finding { margin:24px 0; padding:18px; border:1px solid ${mismatches.length === 0 ? 'rgba(72,225,160,.2)' : 'rgba(255,177,60,.22)'}; border-radius:15px; background:${mismatches.length === 0 ? 'rgba(72,225,160,.055)' : 'rgba(255,177,60,.055)'}; }
        .finding strong { display:block; margin-bottom:8px; color:${mismatches.length === 0 ? '#75efbd' : '#ffc56b'}; }
        .finding p { margin:0; color:#b7c6d5; line-height:1.58; }
        .receipt { margin-top:18px; padding:17px; border:1px solid rgba(111,226,255,.17); border-radius:14px; background:rgba(84,232,255,.055); color:#bfd0df; line-height:1.6; }
        .receipt code { color:#71e8ff; }
        .sequence { display:grid; gap:14px; }
        .sequence-item { display:grid; grid-template-columns:130px 1fr; gap:18px; padding:20px; border:1px solid rgba(255,255,255,.09); border-radius:17px; background:rgba(8,16,27,.66); }
        .sequence-item strong { color:#72e8ff; }
        .sequence-item p { margin:4px 0 0; color:#9fb0c3; line-height:1.62; }
        .quiz { display:grid; gap:16px; }
        .question { padding:23px; border:1px solid rgba(255,255,255,.1); border-radius:19px; background:rgba(8,16,27,.76); }
        .question h3 { margin:0 0 16px; font-size:1.08rem; }
        .choices { display:grid; gap:9px; }
        .choice { padding:13px 14px; border:1px solid rgba(255,255,255,.1); border-radius:11px; background:rgba(255,255,255,.025); color:#dce8f4; text-align:left; cursor:pointer; }
        .choice.selected { border-color:rgba(99,229,255,.5); background:rgba(84,232,255,.08); }
        .choice.correct { border-color:rgba(80,231,167,.5); background:rgba(70,226,159,.08); }
        .choice.wrong { border-color:rgba(255,113,130,.5); background:rgba(255,95,111,.08); }
        .explanation { margin-top:12px; color:#a8bbcc; line-height:1.58; }
        .quiz-result { display:flex; align-items:center; justify-content:space-between; gap:20px; margin-top:18px; padding:22px; border:1px solid rgba(84,232,255,.2); border-radius:16px; background:rgba(84,232,255,.055); }
        .final { margin-top:95px; padding:38px; border:1px solid rgba(108,232,255,.18); border-radius:26px; background:linear-gradient(135deg,rgba(84,232,255,.08),rgba(154,104,255,.07)); }
        .final h2 { margin:8px 0 13px; }
        .final p { max-width:790px; color:#a9bbcc; line-height:1.68; }
        @media (max-width:900px) { .hero,.lab-body { grid-template-columns:1fr; } .visual { min-height:310px; } .check-list { border-right:0; border-bottom:1px solid rgba(255,255,255,.08); } .dimension-grid { grid-template-columns:1fr 1fr; } }
        @media (max-width:640px) { .topbar,.section-head,.quiz-result { align-items:flex-start; flex-direction:column; } .nav-actions { width:100%; } .dimension-grid { grid-template-columns:1fr; } .check { grid-template-columns:12px 1fr; } .check-values { grid-column:2; min-width:0; text-align:left; } .sequence-item { grid-template-columns:1fr; } .shell { width:min(94vw,1220px); } h1 { font-size:clamp(2.75rem,17vw,4.5rem); } }
      `}</style>

      <div className="shell">
        <header className="topbar">
          <Link className="brand" href="/academy">
            <span className="brand-mark">14</span>
            <span>TA-14 ACADEMY</span>
          </Link>
          <div className="nav-actions">
            <Link className="button" href="/academy/execution-correspondence">Previous lesson</Link>
            <Link className="button" href="/workspace/demonstrations">Open demonstration</Link>
          </div>
        </header>

        <section className="hero">
          <div>
            <div className="eyebrow">Module 08 · Outcome and Verification</div>
            <h1>The route is not complete until consequence is proven.</h1>
            <p className="lead">
              Execution is an event. Outcome is the consequence that remains after the event. TA-14 closes the route only when the real outcome corresponds to the admitted, bound, committed, and executed route—and another verifier can independently replay that proof.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#outcome-lab">Run the outcome lab</a>
              <a className="button" href="#knowledge-check">Take the knowledge check</a>
            </div>
            <div className="principle">No verified outcome. No complete route.</div>
          </div>
          <div className="visual" aria-hidden="true">
            <div className="ring r1" />
            <div className="ring r2" />
            <div className="ring r3" />
            <div className="core">
              <div>
                <span>Route closure</span>
                <strong>{status}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Verification architecture</div>
              <h2>Proof must survive beyond the interface.</h2>
            </div>
            <p className="section-copy">
              A green dashboard is a claim. A verifiable route is a preserved chain of evidence and receipts that lets an independent party reconstruct what was allowed, what occurred, and what consequence resulted.
            </p>
          </div>
          <div className="dimension-grid">
            {verificationLayers.map(([title, copy], index) => (
              <article className="dimension" key={title}>
                <span>Layer {String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="outcome-lab">
          <div className="section-head">
            <div>
              <div className="eyebrow">Interactive lab</div>
              <h2>Close the route with admissible outcome proof.</h2>
            </div>
            <p className="section-copy">
              The payment executed correctly, but the replay package is missing the authoritative outcome artifact. Inspect the route, preserve the incomplete state, and attach the missing proof.
            </p>
          </div>

          <div className="lab">
            <div className="lab-bar">
              <strong>Outcome verification · PAY-VENDOR-042</strong>
              <span className="status">{status}</span>
            </div>
            <div className="lab-body">
              <div className="check-list">
                {checks.map((check) => {
                  const mismatch = check.expected !== check.observed;
                  return (
                    <article className={`check${mismatch ? ' mismatch' : ''}`} key={check.key}>
                      <span className="dot" />
                      <div>
                        <h3>{check.label}</h3>
                        <p>{check.detail}</p>
                      </div>
                      <div className="check-values">
                        <span>Expected</span>
                        <strong>{check.expected}</strong>
                        <span>Observed</span>
                        <strong>{check.observed}</strong>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="decision">
                <div className="eyebrow">Route finding</div>
                <h3>{mismatches.length === 0 ? 'The consequence is independently verifiable.' : 'The route cannot yet be closed.'}</h3>
                <p>
                  {mismatches.length === 0
                    ? 'Every required outcome artifact corresponds to the committed route. The preserved package can now support independent replay and verification.'
                    : 'A claimed successful outcome exists, but the preserved package does not yet contain everything another verifier needs to prove it.'}
                </p>

                <div className="finding">
                  <strong>{mismatches.length === 0 ? 'VERIFIED' : `${mismatches.length} unresolved verification finding${mismatches.length === 1 ? '' : 's'}`}</strong>
                  <p>
                    {mismatches.length === 0
                      ? 'Outcome receipt BANK-ACK-98114 is bound to the route, preserved with its dependencies, and available for replay.'
                      : mismatches.map((item) => item.label).join(' · ')}
                  </p>
                </div>

                <div className="lab-actions">
                  <button className="button primary" onClick={attachOutcomeArtifact} disabled={mismatches.length === 0}>
                    Attach outcome artifact
                  </button>
                  <button className="button" onClick={introduceSettlementDivergence}>Simulate later return</button>
                  <button className="button" onClick={resetLab}>Reset lab</button>
                </div>

                {artifactAttached && (
                  <div className="receipt">
                    Preserved correction receipt: <code>OUTCOME-ARTIFACT-ATTACHED</code>. The earlier incomplete verification state remains in history; the completed package is a new preserved route state.
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Route closure sequence</div>
              <h2>Outcome is governed, not merely reported.</h2>
            </div>
          </div>
          <div className="sequence">
            {[
              ['01 · Observe', 'Collect the authoritative external or physical outcome artifact after execution.'],
              ['02 · Bind', 'Bind the outcome artifact to the route identity, commit, execution receipt, beneficiary, and time window.'],
              ['03 · Compare', 'Determine whether the observed consequence corresponds to the exact consequence that was admitted and committed.'],
              ['04 · Classify', 'Close the route as VERIFIED, DIVERGENT, INCOMPLETE, or DISPUTED.'],
              ['05 · Preserve', 'Preserve every prior state, correction, dependency, signature, and receipt without silent replacement.'],
              ['06 · Replay', 'Allow an independent verifier to reconstruct the route and reach the same determination.'],
            ].map(([label, copy]) => (
              <article className="sequence-item" key={label}>
                <strong>{label}</strong>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="knowledge-check">
          <div className="section-head">
            <div>
              <div className="eyebrow">Knowledge check</div>
              <h2>Can you verify route closure?</h2>
            </div>
          </div>
          <div className="quiz">
            {questions.map((item, questionIndex) => (
              <article className="question" key={item.question}>
                <h3>{questionIndex + 1}. {item.question}</h3>
                <div className="choices">
                  {item.choices.map((choice, choiceIndex) => {
                    const selected = answers[questionIndex] === choiceIndex;
                    const className = submitted
                      ? choiceIndex === item.correctIndex
                        ? 'choice correct'
                        : selected
                          ? 'choice wrong'
                          : 'choice'
                      : selected
                        ? 'choice selected'
                        : 'choice';
                    return (
                      <button
                        className={className}
                        key={choice}
                        onClick={() => {
                          setAnswers((current) => ({ ...current, [questionIndex]: choiceIndex }));
                          setSubmitted(false);
                        }}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
                {submitted && <p className="explanation">{item.explanation}</p>}
              </article>
            ))}
          </div>
          <div className="quiz-result">
            <div>
              <strong>{submitted ? `${score} of ${questions.length} correct` : 'Answer all three questions.'}</strong>
              <div className="section-copy">The route is complete only when the outcome can be proven without trusting the original operator.</div>
            </div>
            <button
              className="button primary"
              disabled={Object.keys(answers).length !== questions.length}
              onClick={() => setSubmitted(true)}
            >
              Check answers
            </button>
          </div>
        </section>

        <section className="final">
          <div className="eyebrow">Academy foundation complete</div>
          <h2>You have now governed the full TA-14 route.</h2>
          <p>
            Reality became a record. Continuity preserved its history. Admissibility determined whether consequence could proceed. Authority and binding constrained the route. Commit fixed the executable version. Execution correspondence protected the consequence boundary. Outcome verification closed the route with independently replayable proof.
          </p>
          <div className="final-actions">
            <Link className="button primary" href="/workspace/demonstrations">Run the live route</Link>
            <Link className="button" href="/workspace">Enter the Exchange workspace</Link>
            <Link className="button" href="/academy">Return to Academy</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
