'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type EvidenceItem = {
  id: string;
  label: string;
  source: string;
  observedAt: string;
  direct: boolean;
  durable: boolean;
  bound: boolean;
};

const startingEvidence: EvidenceItem[] = [
  {
    id: 'invoice',
    label: 'Supplier invoice',
    source: 'Procurement system',
    observedAt: '10:14:08 ET',
    direct: true,
    durable: true,
    bound: true,
  },
  {
    id: 'dashboard',
    label: 'Dashboard says “approved”',
    source: 'Approval dashboard',
    observedAt: '10:16:31 ET',
    direct: false,
    durable: true,
    bound: false,
  },
  {
    id: 'beneficiary',
    label: 'Beneficiary identity proof',
    source: 'Vendor registry',
    observedAt: 'Not supplied',
    direct: true,
    durable: false,
    bound: false,
  },
  {
    id: 'request',
    label: 'Payment request',
    source: 'Accounts payable queue',
    observedAt: '10:15:02 ET',
    direct: true,
    durable: true,
    bound: true,
  },
];

const knowledgeChecks = [
  {
    question: 'Which statement is closest to reality?',
    choices: [
      'The dashboard reports that the payment is approved.',
      'A payment of USD 32,500 is proposed for a named supplier.',
      'The policy permits supplier payments above USD 25,000.',
    ],
    correctIndex: 1,
    explanation:
      'Reality is the actual condition or proposed consequence. Dashboard and policy statements are records about it, not the reality itself.',
  },
  {
    question: 'What makes a record usable later?',
    choices: [
      'It exists somewhere in a system.',
      'It looks complete to the operator.',
      'Its source, time, content, identity, and route relationship are durably preserved.',
    ],
    correctIndex: 2,
    explanation:
      'A record must preserve enough context to remain attributable and inspectable. Mere existence does not establish evidentiary value.',
  },
  {
    question: 'Beneficiary proof has not been supplied. How should the record represent it?',
    choices: [
      'Infer the beneficiary from the supplier name.',
      'Leave the field explicitly unknown and prevent the route from treating it as satisfied.',
      'Copy the beneficiary from a previous transaction.',
    ],
    correctIndex: 1,
    explanation:
      'Unknown must remain unknown. TA-14 does not convert an assumption into evidence merely to complete a route.',
  },
];

export default function RealityAndRecordPage() {
  const [selectedId, setSelectedId] = useState(startingEvidence[0].id);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showRecord, setShowRecord] = useState(false);

  const selected =
    startingEvidence.find((item) => item.id === selectedId) || startingEvidence[0];

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
            radial-gradient(circle at 12% 0%, rgba(57, 242, 161, .15), transparent 30%),
            radial-gradient(circle at 88% 8%, rgba(84, 232, 255, .13), transparent 28%),
            radial-gradient(circle at 52% 62%, rgba(111, 82, 255, .08), transparent 35%),
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
          border: 1px solid rgba(57, 242, 161, .42);
          border-radius: 14px;
          background: linear-gradient(145deg, rgba(57, 242, 161, .18), rgba(84, 232, 255, .04));
          box-shadow: 0 0 32px rgba(57, 242, 161, .18), inset 0 0 18px rgba(84, 232, 255, .05);
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
          transition: transform .2s ease, border-color .2s ease, filter .2s ease;
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
          color: #63f0ba;
          font-size: .75rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(300px, .85fr);
          align-items: center;
          gap: clamp(40px, 8vw, 100px);
          padding: 28px 0 90px;
        }

        h1 {
          max-width: 850px;
          margin: 18px 0 24px;
          font-size: clamp(3rem, 7.2vw, 6.7rem);
          line-height: .92;
          letter-spacing: -.065em;
        }

        .gradient-text {
          color: transparent;
          background: linear-gradient(100deg, #f8fcff 5%, #63f0ba 48%, #54e8ff 90%);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .lede {
          max-width: 760px;
          margin: 0 0 30px;
          color: #aebed0;
          font-size: clamp(1.06rem, 2vw, 1.28rem);
          line-height: 1.75;
        }

        .principle-card {
          padding: 26px;
          border: 1px solid rgba(84, 232, 255, .20);
          border-radius: 26px;
          background: linear-gradient(145deg, rgba(10, 24, 38, .88), rgba(4, 12, 21, .75));
          box-shadow: 0 30px 90px rgba(0, 0, 0, .28);
        }

        .principle-card strong {
          display: block;
          margin: 10px 0 14px;
          font-size: clamp(1.6rem, 3.2vw, 2.7rem);
          line-height: 1.04;
          letter-spacing: -.04em;
        }

        .principle-card p, .section-copy, .card-copy, .evidence-meta, .record-row span {
          color: #9eb0c4;
          line-height: 1.7;
        }

        .section { padding: 76px 0; }
        .section-header { max-width: 820px; margin-bottom: 34px; }
        h2 { margin: 12px 0 16px; font-size: clamp(2.25rem, 5vw, 4.2rem); line-height: 1; letter-spacing: -.05em; }
        h3 { margin: 0 0 10px; font-size: 1.24rem; }

        .split-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .concept-card {
          min-height: 310px;
          padding: 30px;
          border: 1px solid rgba(124, 160, 195, .17);
          border-radius: 26px;
          background: rgba(6, 15, 25, .76);
          box-shadow: 0 24px 70px rgba(0, 0, 0, .22);
        }

        .concept-number {
          display: inline-grid;
          place-items: center;
          width: 48px;
          height: 48px;
          margin-bottom: 52px;
          border-radius: 15px;
          font-weight: 950;
          color: #07120d;
          background: linear-gradient(135deg, #63f0ba, #54e8ff);
        }

        .comparison {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 26px;
        }

        .comparison article {
          padding: 20px;
          border-radius: 19px;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(145,180,214,.12);
        }

        .comparison small { display: block; margin-bottom: 9px; color: #63f0ba; font-weight: 900; letter-spacing: .09em; text-transform: uppercase; }

        .lab {
          display: grid;
          grid-template-columns: .88fr 1.12fr;
          gap: 20px;
          padding: 24px;
          border: 1px solid rgba(84, 232, 255, .18);
          border-radius: 30px;
          background: rgba(4, 12, 21, .80);
          box-shadow: 0 34px 100px rgba(0, 0, 0, .30);
        }

        .evidence-list { display: grid; gap: 10px; align-content: start; }

        .evidence-button {
          width: 100%;
          padding: 17px;
          border: 1px solid rgba(145,180,214,.14);
          border-radius: 17px;
          color: #eaf5ff;
          text-align: left;
          background: rgba(255,255,255,.028);
          cursor: pointer;
          transition: border-color .2s ease, transform .2s ease, background .2s ease;
        }

        .evidence-button:hover, .evidence-button.active {
          transform: translateY(-1px);
          border-color: rgba(99,240,186,.46);
          background: rgba(57,242,161,.07);
        }

        .evidence-button strong { display: block; margin-bottom: 5px; }
        .evidence-button span { color: #879bb0; font-size: .86rem; }

        .inspection {
          min-height: 430px;
          padding: 28px;
          border-radius: 22px;
          background:
            radial-gradient(circle at 90% 0%, rgba(84,232,255,.10), transparent 32%),
            #07121e;
        }

        .inspection-title { display: flex; justify-content: space-between; gap: 18px; align-items: flex-start; }
        .badge { display: inline-flex; padding: 7px 10px; border-radius: 999px; color: #63f0ba; background: rgba(57,242,161,.09); font-size: .72rem; font-weight: 950; letter-spacing: .08em; text-transform: uppercase; }
        .inspection-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; margin: 28px 0; }
        .check-cell { padding: 15px; border-radius: 16px; background: rgba(255,255,255,.035); }
        .check-cell small { display: block; color: #8498ad; margin-bottom: 7px; }
        .yes { color: #63f0ba; font-weight: 950; }
        .no { color: #ffbe73; font-weight: 950; }

        .record-preview {
          margin-top: 18px;
          padding: 20px;
          border: 1px solid rgba(57,242,161,.18);
          border-radius: 18px;
          background: rgba(2,8,14,.78);
        }
        .record-row { display: grid; grid-template-columns: 150px 1fr; gap: 16px; padding: 10px 0; border-bottom: 1px solid rgba(145,180,214,.09); }
        .record-row:last-child { border-bottom: 0; }
        .record-row strong { color: #dceaf5; }

        .unknown-card {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
          padding: 30px;
          border: 1px solid rgba(255,190,115,.24);
          border-radius: 26px;
          background: linear-gradient(120deg, rgba(255,190,115,.08), rgba(7,16,26,.8));
        }
        .unknown-value { font: 950 clamp(2rem,5vw,4.5rem)/1 Inter, ui-monospace, monospace; color: #ffbe73; letter-spacing: -.05em; }

        .checks { display: grid; gap: 16px; }
        .check-card { padding: 25px; border: 1px solid rgba(145,180,214,.15); border-radius: 22px; background: rgba(6,15,25,.76); }
        .choice-list { display: grid; gap: 9px; margin-top: 18px; }
        .choice { display: flex; gap: 12px; align-items: flex-start; width: 100%; padding: 14px 15px; border: 1px solid rgba(145,180,214,.13); border-radius: 15px; color: #dce8f3; text-align: left; background: rgba(255,255,255,.025); cursor: pointer; }
        .choice.selected { border-color: rgba(84,232,255,.45); background: rgba(84,232,255,.07); }
        .choice.correct { border-color: rgba(57,242,161,.48); background: rgba(57,242,161,.08); }
        .choice.incorrect { border-color: rgba(255,119,119,.45); background: rgba(255,119,119,.07); }
        .choice-index { display: grid; place-items: center; flex: 0 0 27px; height: 27px; border-radius: 8px; background: rgba(255,255,255,.07); font-size: .75rem; font-weight: 950; }
        .explanation { margin: 15px 0 0; padding: 14px 16px; border-radius: 14px; color: #b7c8d8; background: rgba(255,255,255,.035); line-height: 1.65; }

        .score-card { display: flex; justify-content: space-between; align-items: center; gap: 28px; margin-top: 20px; padding: 26px; border: 1px solid rgba(57,242,161,.20); border-radius: 24px; background: rgba(57,242,161,.06); }
        .score { font-size: clamp(2.4rem,6vw,5.2rem); font-weight: 950; letter-spacing: -.06em; }

        .final-card {
          margin-top: 76px;
          padding: clamp(30px,6vw,64px);
          border: 1px solid rgba(84,232,255,.22);
          border-radius: 32px;
          text-align: center;
          background: radial-gradient(circle at 50% 0%, rgba(84,232,255,.12), transparent 42%), rgba(5,14,24,.82);
        }
        .final-card .final-actions { justify-content: center; margin-top: 28px; }

        @media (max-width: 900px) {
          .hero, .lab { grid-template-columns: 1fr; }
          .split-grid, .comparison { grid-template-columns: 1fr; }
          .hero { padding-top: 10px; }
          .inspection-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .topbar { align-items: flex-start; margin-bottom: 42px; }
          .nav-actions { justify-content: flex-end; }
          .nav-link { min-height: 40px; padding: 0 12px; font-size: .8rem; }
          .brand span:last-child { display: none; }
          .section { padding: 54px 0; }
          .unknown-card, .score-card { grid-template-columns: 1fr; flex-direction: column; align-items: flex-start; }
          .record-row { grid-template-columns: 1fr; gap: 4px; }
        }
      `}</style>

      <div className="shell">
        <header className="topbar">
          <Link className="brand" href="/academy">
            <span className="brand-mark">14</span>
            <span>TA-14 ACADEMY</span>
          </Link>
          <nav className="nav-actions" aria-label="Lesson navigation">
            <Link className="nav-link" href="/academy">Academy</Link>
            <Link className="nav-link" href="/workspace">Workspace</Link>
          </nav>
        </header>

        <section className="hero">
          <div>
            <span className="eyebrow">Module 02 · Foundation</span>
            <h1>
              Reality is not the same as <span className="gradient-text">the record.</span>
            </h1>
            <p className="lede">
              A governance route begins with what actually exists. The record is the bounded evidence used to represent that reality. Confusing the two allows a system assertion to replace the thing it claims to describe.
            </p>
            <div className="hero-actions">
              <a className="primary" href="#evidence-lab">Inspect the evidence</a>
              <Link className="secondary" href="/academy/what-is-a-route">Review Module 01</Link>
            </div>
          </div>

          <aside className="principle-card">
            <span className="eyebrow">The governing distinction</span>
            <strong>Reality occurs. Records represent.</strong>
            <p>
              The record can be incomplete, delayed, altered, misbound, or wrong even when the underlying reality is clear. TA-14 therefore tests the record rather than assuming that recorded means true.
            </p>
          </aside>
        </section>

        <section className="section">
          <div className="section-header">
            <span className="eyebrow">Two different objects</span>
            <h2>Do not govern the representation as though it were the event.</h2>
            <p className="section-copy">
              Reality and Record are adjacent because governance must preserve their relationship without collapsing them into one object.
            </p>
          </div>

          <div className="split-grid">
            <article className="concept-card">
              <span className="concept-number">01</span>
              <h3>Reality</h3>
              <p className="card-copy">
                A purchasing agent has proposed a USD 32,500 payment to a supplier. That proposal, the named beneficiary, the amount, the actor, and the intended consequence exist before a governance interface describes them.
              </p>
              <div className="comparison">
                <article><small>Condition</small><strong>Payment proposed</strong></article>
                <article><small>Consequence</small><strong>Funds may move</strong></article>
                <article><small>Boundary</small><strong>Before execution</strong></article>
              </div>
            </article>

            <article className="concept-card">
              <span className="concept-number">02</span>
              <h3>Record</h3>
              <p className="card-copy">
                The invoice, payment request, supplier identity, beneficiary proof, timestamps, source systems, and authority artifacts become the inspectable record. Each element must retain its own source and status.
              </p>
              <div className="comparison">
                <article><small>Content</small><strong>Evidence fields</strong></article>
                <article><small>Context</small><strong>Source and time</strong></article>
                <article><small>Status</small><strong>Known or unknown</strong></article>
              </div>
            </article>
          </div>
        </section>

        <section className="section" id="evidence-lab">
          <div className="section-header">
            <span className="eyebrow">Interactive evidence lab</span>
            <h2>Inspect what the route actually possesses.</h2>
            <p className="section-copy">
              Select each item. A useful record preserves directness, durability, and route binding separately instead of awarding trust to the entire package at once.
            </p>
          </div>

          <div className="lab">
            <div className="evidence-list">
              {startingEvidence.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`evidence-button ${selected.id === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.source}</span>
                </button>
              ))}
            </div>

            <div className="inspection">
              <div className="inspection-title">
                <div>
                  <span className="badge">Record inspection</span>
                  <h3 style={{ marginTop: 15, fontSize: '1.7rem' }}>{selected.label}</h3>
                  <p className="evidence-meta">Source: {selected.source}<br />Observed: {selected.observedAt}</p>
                </div>
              </div>

              <div className="inspection-grid">
                <div className="check-cell"><small>Direct evidence</small><span className={selected.direct ? 'yes' : 'no'}>{selected.direct ? 'YES' : 'NO'}</span></div>
                <div className="check-cell"><small>Durably captured</small><span className={selected.durable ? 'yes' : 'no'}>{selected.durable ? 'YES' : 'NO'}</span></div>
                <div className="check-cell"><small>Bound to route</small><span className={selected.bound ? 'yes' : 'no'}>{selected.bound ? 'YES' : 'NO'}</span></div>
              </div>

              <p className="card-copy">
                {selected.id === 'dashboard' && 'This is a system assertion about approval. It may be relevant, but it cannot replace the underlying authority and beneficiary evidence.'}
                {selected.id === 'beneficiary' && 'The route knows this proof is required, but the evidence has not been supplied. Its correct value is unknown, not presumed.'}
                {selected.id === 'invoice' && 'This directly represents the transaction object, but it still requires continuity and correspondence with the beneficiary and authority records.'}
                {selected.id === 'request' && 'This identifies the proposed action and amount. It does not independently prove that the destination or beneficiary is authorized.'}
              </p>

              <button className="secondary" type="button" onClick={() => setShowRecord((value) => !value)}>
                {showRecord ? 'Hide bounded record' : 'Build bounded record'}
              </button>

              {showRecord && (
                <div className="record-preview">
                  <div className="record-row"><strong>route_object</strong><span>Supplier payment · USD 32,500</span></div>
                  <div className="record-row"><strong>actor</strong><span>Purchasing agent · recorded</span></div>
                  <div className="record-row"><strong>invoice</strong><span>Present · source retained · route bound</span></div>
                  <div className="record-row"><strong>beneficiary_proof</strong><span style={{ color: '#ffbe73' }}>UNKNOWN · not supplied</span></div>
                  <div className="record-row"><strong>dashboard_status</strong><span>“Approved” · assertion only</span></div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="unknown-card">
            <div>
              <span className="eyebrow">Required discipline</span>
              <h2 style={{ marginBottom: 12 }}>Unknown must remain unknown.</h2>
              <p className="section-copy" style={{ margin: 0 }}>
                Missing evidence is not a blank waiting for an AI to complete. It is a governed state that prevents unsupported certainty from entering the route.
              </p>
            </div>
            <div className="unknown-value">UNKNOWN</div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <span className="eyebrow">Knowledge check</span>
            <h2>Can you preserve the distinction?</h2>
            <p className="section-copy">Answer all three questions, then inspect the reasoning.</p>
          </div>

          <div className="checks">
            {knowledgeChecks.map((check, checkIndex) => (
              <article className="check-card" key={check.question}>
                <h3>{checkIndex + 1}. {check.question}</h3>
                <div className="choice-list">
                  {check.choices.map((choice, choiceIndex) => {
                    const selectedChoice = answers[checkIndex] === choiceIndex;
                    const resultClass = submitted
                      ? choiceIndex === check.correctIndex
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
                        type="button"
                        onClick={() => {
                          setAnswers((current) => ({ ...current, [checkIndex]: choiceIndex }));
                          setSubmitted(false);
                        }}
                      >
                        <span className="choice-index">{String.fromCharCode(65 + choiceIndex)}</span>
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>
                {submitted && <p className="explanation">{check.explanation}</p>}
              </article>
            ))}
          </div>

          <div className="score-card">
            <div>
              <span className="eyebrow">Lesson result</span>
              <div className="score">{submitted ? `${score}/3` : '—/3'}</div>
              <p className="section-copy" style={{ margin: 0 }}>
                {submitted
                  ? score === knowledgeChecks.length
                    ? 'Reality and Record are correctly separated.'
                    : 'Review the explanations and test the distinction again.'
                  : 'Complete every answer to evaluate the lesson.'}
              </p>
            </div>
            <button className="primary" type="button" disabled={!complete} onClick={() => setSubmitted(true)}>
              Check answers
            </button>
          </div>
        </section>

        <section className="final-card">
          <span className="eyebrow">Module 02 complete</span>
          <h2>The route now has a reality boundary and a bounded record.</h2>
          <p className="section-copy" style={{ maxWidth: 760, margin: '0 auto' }}>
            The next problem is continuity: whether those records remain connected to their origin through collection, transfer, transformation, correction, and use.
          </p>
          <div className="final-actions">
            <Link className="primary" href="/workspace/demonstrations">See the record used at the gate</Link>
            <Link className="secondary" href="/academy">Return to Academy</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
