'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type CheckKey = 'payload' | 'destination' | 'amount' | 'environment' | 'actor';

type Check = {
  key: CheckKey;
  label: string;
  committed: string;
  observed: string;
  detail: string;
};

const baseChecks: Check[] = [
  {
    key: 'payload',
    label: 'Execution payload',
    committed: 'PAY-VENDOR-042',
    observed: 'PAY-VENDOR-042',
    detail: 'The executed instruction must be the same canonical object that was admitted and committed.',
  },
  {
    key: 'destination',
    label: 'Destination binding',
    committed: 'Account ending 2916',
    observed: 'Account ending 7340',
    detail: 'A substituted destination creates a different route, even when the supplier name appears unchanged.',
  },
  {
    key: 'amount',
    label: 'Consequence amount',
    committed: '$48,750.00',
    observed: '$48,750.00',
    detail: 'The consequence must remain within the exact amount and limits authorized at commit.',
  },
  {
    key: 'environment',
    label: 'Execution environment',
    committed: 'Treasury production / us-east-1',
    observed: 'Treasury production / us-east-1',
    detail: 'The action must occur inside the environment that was evaluated and bound to the route.',
  },
  {
    key: 'actor',
    label: 'Executing actor',
    committed: 'Treasury service identity TS-04',
    observed: 'Treasury service identity TS-04',
    detail: 'The executing identity must correspond to the authority and service identity preserved at commit.',
  },
];

const questions = [
  {
    question: 'What is execution correspondence?',
    choices: [
      'Proof that some action occurred after approval.',
      'Proof that the action actually performed matched the exact route that was admitted and committed.',
      'A later explanation of why the operator changed the route.',
    ],
    correctIndex: 1,
    explanation:
      'Approval alone is not enough. Correspondence proves that the committed payload, actor, destination, amount, timing, and environment survived into execution.',
  },
  {
    question: 'A payment is admitted for one account but sent to another account owned by the same supplier. What happened?',
    choices: [
      'Nothing material changed because the supplier name is the same.',
      'Execution correspondence failed because the destination binding changed.',
      'The original commit automatically expands to all supplier accounts.',
    ],
    correctIndex: 1,
    explanation:
      'The destination is part of the committed route. Substitution produces a different consequence-bearing path and requires a new route decision.',
  },
  {
    question: 'What should the system do when correspondence fails before consequence is released?',
    choices: [
      'Block or hold execution and preserve a mismatch receipt.',
      'Execute anyway and reconcile the record later.',
      'Delete the committed route and replace it with the observed action.',
    ],
    correctIndex: 0,
    explanation:
      'A mismatch must stop or hold the consequence before release. The original commit and the observed mismatch must both remain preserved.',
  },
];

const correspondenceDimensions = [
  ['Payload', 'The canonical instruction executed must match the committed payload digest.'],
  ['Actor', 'The identity performing the action must be the identity authorized and bound to the route.'],
  ['Object', 'The account, model, file, device, person, or other target must be the committed object.'],
  ['Limits', 'Amount, quantity, scope, duration, and other consequence limits must remain unchanged.'],
  ['Environment', 'Execution must occur in the approved system, tenant, region, device, or operational context.'],
  ['Time', 'The action must occur while authority, evidence, and route validity remain temporally admissible.'],
];

export default function ExecutionCorrespondencePage() {
  const [checks, setChecks] = useState<Check[]>(baseChecks);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [receiptCreated, setReceiptCreated] = useState(false);

  const mismatches = checks.filter((check) => check.committed !== check.observed);
  const status = mismatches.length === 0 ? 'CORRESPONDENCE VERIFIED' : 'EXECUTION BLOCKED';
  const score = useMemo(
    () => questions.reduce((total, item, index) => total + (answers[index] === item.correctIndex ? 1 : 0), 0),
    [answers],
  );

  function restoreCommittedDestination() {
    setChecks((current) =>
      current.map((check) =>
        check.key === 'destination' ? { ...check, observed: check.committed } : check,
      ),
    );
    setReceiptCreated(true);
  }

  function introduceAmountDrift() {
    setChecks((current) =>
      current.map((check) =>
        check.key === 'amount' ? { ...check, observed: '$52,500.00' } : check,
      ),
    );
    setReceiptCreated(false);
  }

  function resetLab() {
    setChecks(baseChecks);
    setReceiptCreated(false);
  }

  return (
    <main className="lesson-page">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #02050a; color: #f4f8ff; }
        button { font: inherit; }
        a { color: inherit; }
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
        .beam { position:absolute; width:390px; height:2px; background:linear-gradient(90deg,transparent,#6de8ff,transparent); box-shadow:0 0 30px rgba(84,232,255,.55); }
        .beam.b2 { transform:rotate(60deg); opacity:.55; }
        .beam.b3 { transform:rotate(-60deg); opacity:.55; }
        .core { position:relative; z-index:2; width:225px; height:225px; display:grid; place-items:center; text-align:center; border:1px solid ${mismatches.length === 0 ? 'rgba(87,239,184,.62)' : 'rgba(255,117,128,.62)'}; border-radius:50%; background:radial-gradient(circle,${mismatches.length === 0 ? 'rgba(72,225,160,.18)' : 'rgba(255,95,111,.17)'},rgba(7,13,22,.96) 69%); box-shadow:0 0 75px ${mismatches.length === 0 ? 'rgba(72,225,160,.16)' : 'rgba(255,95,111,.14)'}; }
        .core strong { display:block; color:${mismatches.length === 0 ? '#69efb9' : '#ff8793'}; font-size:1.3rem; letter-spacing:.05em; }
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
        .status { padding:8px 12px; border-radius:999px; font-size:.72rem; font-weight:950; letter-spacing:.12em; color:${mismatches.length === 0 ? '#76efbd' : '#ff8793'}; background:${mismatches.length === 0 ? 'rgba(72,225,160,.1)' : 'rgba(255,95,111,.1)'}; }
        .lab-body { display:grid; grid-template-columns:1.15fr .85fr; min-height:560px; }
        .check-list { padding:22px; border-right:1px solid rgba(255,255,255,.08); }
        .check { display:grid; grid-template-columns:14px 1fr auto; gap:14px; align-items:start; padding:18px; margin-bottom:11px; border:1px solid rgba(255,255,255,.09); border-radius:16px; background:rgba(255,255,255,.025); }
        .check.mismatch { border-color:rgba(255,111,126,.28); background:rgba(255,95,111,.055); }
        .dot { width:11px; height:11px; margin-top:5px; border-radius:50%; background:#64eab5; box-shadow:0 0 12px rgba(72,225,160,.45); }
        .mismatch .dot { background:#ff7481; box-shadow:0 0 12px rgba(255,95,111,.45); }
        .check h3 { margin:0 0 7px; font-size:1rem; }
        .check p { margin:0; color:#91a5ba; line-height:1.55; font-size:.9rem; }
        .check-values { min-width:235px; text-align:right; }
        .check-values span { display:block; color:#7f93a8; font-size:.65rem; font-weight:900; letter-spacing:.1em; text-transform:uppercase; }
        .check-values strong { display:block; margin:4px 0 9px; font-size:.86rem; overflow-wrap:anywhere; }
        .decision { padding:34px; }
        .decision h3 { margin:9px 0 12px; font-size:clamp(1.8rem,3vw,2.6rem); }
        .decision > p { color:#a6b7c9; line-height:1.68; }
        .finding { margin:24px 0; padding:18px; border:1px solid ${mismatches.length === 0 ? 'rgba(72,225,160,.2)' : 'rgba(255,95,111,.22)'}; border-radius:15px; background:${mismatches.length === 0 ? 'rgba(72,225,160,.055)' : 'rgba(255,95,111,.055)'}; }
        .finding strong { display:block; margin-bottom:8px; color:${mismatches.length === 0 ? '#75efbd' : '#ff8b96'}; }
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
        .final p { max-width:760px; color:#a9bbcc; line-height:1.68; }
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
            <Link className="button" href="/academy/commit-and-version-history">Previous lesson</Link>
            <Link className="button" href="/workspace/demonstrations">Open demonstration</Link>
          </div>
        </header>

        <section className="hero">
          <div>
            <div className="eyebrow">Module 07 · Execution Correspondence</div>
            <h1>The action must match the route.</h1>
            <p className="lead">
              An admitted and committed route does not authorize a vaguely similar action. Execution correspondence proves that the consequence actually released was the same consequence the evidence, authority, bindings, and commit allowed.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#correspondence-lab">Run the correspondence lab</a>
              <a className="button" href="#knowledge-check">Take the knowledge check</a>
            </div>
            <div className="principle">A valid decision cannot legitimize a different execution.</div>
          </div>
          <div className="visual" aria-hidden="true">
            <div className="beam" />
            <div className="beam b2" />
            <div className="beam b3" />
            <div className="core">
              <div>
                <span>Live state</span>
                <strong>{status}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">The correspondence surface</div>
              <h2>What must survive into execution</h2>
            </div>
            <p className="section-copy">
              Each dimension is independently material. A route can preserve four or five of them and still fail because the released consequence no longer corresponds to the committed route.
            </p>
          </div>
          <div className="dimension-grid">
            {correspondenceDimensions.map(([title, copy], index) => (
              <article className="dimension" key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="correspondence-lab">
          <div className="section-head">
            <div>
              <div className="eyebrow">Interactive lab</div>
              <h2>Catch the substituted consequence</h2>
            </div>
            <p className="section-copy">
              The route was validly admitted and committed. Compare the committed execution object to what the execution service is about to release.
            </p>
          </div>

          <div className="lab">
            <div className="lab-bar">
              <strong>Route PAY-2026-0717 · Commit sha256:b2e8…91af</strong>
              <span className="status">{status}</span>
            </div>
            <div className="lab-body">
              <div className="check-list">
                {checks.map((check) => {
                  const mismatch = check.committed !== check.observed;
                  return (
                    <article className={`check ${mismatch ? 'mismatch' : ''}`} key={check.key}>
                      <span className="dot" />
                      <div>
                        <h3>{check.label}</h3>
                        <p>{check.detail}</p>
                      </div>
                      <div className="check-values">
                        <span>Committed</span>
                        <strong>{check.committed}</strong>
                        <span>Observed</span>
                        <strong>{check.observed}</strong>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="decision">
                <div className="eyebrow">Execution gate</div>
                <h3>{mismatches.length === 0 ? 'Route corresponds.' : 'Mismatch detected.'}</h3>
                <p>
                  {mismatches.length === 0
                    ? 'Every observed execution dimension matches the committed route. The consequence may proceed to the controlled release boundary.'
                    : `${mismatches.length} material mismatch${mismatches.length === 1 ? '' : 'es'} prevent execution from inheriting the route’s ALLOW decision.`}
                </p>

                <div className="finding">
                  <strong>{mismatches.length === 0 ? 'ALLOW EXECUTION' : 'BLOCK EXECUTION'}</strong>
                  <p>
                    {mismatches.length === 0
                      ? 'The execution object preserves payload, destination, amount, actor, and environment correspondence.'
                      : `The observed ${mismatches.map((item) => item.label.toLowerCase()).join(' and ')} differs from the committed route.`}
                  </p>
                </div>

                <div className="lab-actions">
                  <button className="button primary" disabled={mismatches.length === 0} onClick={restoreCommittedDestination}>
                    Restore committed destination
                  </button>
                  <button className="button" onClick={introduceAmountDrift}>Introduce amount drift</button>
                  <button className="button" onClick={resetLab}>Reset lab</button>
                </div>

                {receiptCreated && (
                  <div className="receipt">
                    <strong>Mismatch receipt preserved</strong><br />
                    The attempted destination substitution remains recorded as <code>EXEC-CORR-HOLD-0042</code>. Restoring the valid destination did not erase the failed attempt.
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Controlled execution sequence</div>
              <h2>From commit to consequence</h2>
            </div>
          </div>
          <div className="sequence">
            <article className="sequence-item"><strong>01 · Load commit</strong><p>Retrieve the exact committed route, canonical payload, bindings, authority state, and decision receipt.</p></article>
            <article className="sequence-item"><strong>02 · Observe intent</strong><p>Capture the actor, target, amount, environment, timing, and instruction presented at the execution boundary.</p></article>
            <article className="sequence-item"><strong>03 · Compare</strong><p>Deterministically compare every material execution dimension against the committed route.</p></article>
            <article className="sequence-item"><strong>04 · Gate</strong><p>ALLOW only exact correspondence. HOLD, DENY, or ESCALATE when the observed consequence differs.</p></article>
            <article className="sequence-item"><strong>05 · Preserve</strong><p>Create an execution or mismatch receipt so later verification can prove what was committed, attempted, and released.</p></article>
          </div>
        </section>

        <section className="section" id="knowledge-check">
          <div className="section-head">
            <div>
              <div className="eyebrow">Knowledge check</div>
              <h2>Can you govern correspondence?</h2>
            </div>
          </div>
          <div className="quiz">
            {questions.map((item, index) => (
              <article className="question" key={item.question}>
                <h3>{index + 1}. {item.question}</h3>
                <div className="choices">
                  {item.choices.map((choice, choiceIndex) => {
                    const selected = answers[index] === choiceIndex;
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
                        onClick={() => !submitted && setAnswers((current) => ({ ...current, [index]: choiceIndex }))}
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
              <div className="section-copy">A perfect score confirms the core execution-correspondence concepts.</div>
            </div>
            <div className="lab-actions">
              <button className="button primary" disabled={Object.keys(answers).length !== questions.length} onClick={() => setSubmitted(true)}>Check answers</button>
              {submitted && <button className="button" onClick={() => { setAnswers({}); setSubmitted(false); }}>Try again</button>}
            </div>
          </div>
        </section>

        <section className="final">
          <div className="eyebrow">Module 08 preview</div>
          <h2>Execution is not the end of the chain.</h2>
          <p>
            The next lesson follows the released action into outcome correspondence, preserved receipts, independent verification, and replay. A legitimate route must prove not only what was authorized and executed, but what consequence actually occurred.
          </p>
          <div className="final-actions">
            <Link className="button primary" href="/academy/outcome-and-verification">Continue to Outcome and Verification</Link>
            <Link className="button" href="/workspace/demonstrations">Test the live route engine</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
