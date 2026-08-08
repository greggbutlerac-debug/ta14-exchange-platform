"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CheckChoice = "A" | "B" | "C" | "D";

type Check = {
  id: string;
  question: string;
  choices: Record<CheckChoice, string>;
  answer: CheckChoice;
  explanation: string;
};

const checks: Check[] = [
  {
    id: "bounded-finding",
    question: "What was the most important TA-14 discipline in the Harmonic V1 finding?",
    choices: {
      A: "Declaring the architecture production-ready",
      B: "Separating demonstrated runtime behavior from unproven surrounding chronology",
      C: "Requiring Harmonic to adopt TA-14 terminology",
      D: "Replacing the participant's engineering judgment",
    },
    answer: "B",
    explanation:
      "The case is valuable because the finding remained evidence-bounded. TA-14 preserved what the admitted runtime artifact demonstrated while refusing to convert missing external chronology into a claim that Harmonic lacked the capability.",
  },
  {
    id: "version-lineage",
    question: "Why should Version 2 remain a new lineage rather than rewriting Version 1?",
    choices: {
      A: "So the original evidence, finding, and engineering response remain historically inspectable",
      B: "Because Version 1 can never be used again",
      C: "Because every review must produce a new company",
      D: "So TA-14 owns the revised architecture",
    },
    answer: "A",
    explanation:
      "Preserving V1 keeps the institutional record intact: what was demonstrated, what remained incomplete, what TA-14 found, and how the participant responded. V2 can then demonstrate whether the bridge was actually built.",
  },
  {
    id: "exchange-purpose",
    question: "What does the Exchange accomplish when a participant uses a finding to improve the next version?",
    choices: {
      A: "It converts the participant into a TA-14 implementation",
      B: "It turns a review into a punitive compliance action",
      C: "It creates an evidence-to-improvement feedback loop without erasing history",
      D: "It guarantees future admissibility",
    },
    answer: "C",
    explanation:
      "The Exchange is working when evidence exposes a bounded gap, the gap becomes understandable, engineering responds, and a future artifact can test whether the new evidence closes that gap.",
  },
];

const chain = [
  { label: "Reality", note: "What condition actually existed when the consequential state formed?" },
  { label: "Record", note: "What evidence preserved that condition and who can attribute it?" },
  { label: "Continuity", note: "Can the evidence remain connected across the relevant historical interval?" },
  { label: "Admissibility", note: "Was the evidence sufficient for the exact determination being made?" },
  { label: "Binding", note: "Did valid authority exist for the decision and consequence?" },
  { label: "Commit", note: "Was the approved state fixed and protected from silent change?" },
  { label: "Execution", note: "Did the runtime permit, refuse, hold, or escalate the consequential action?" },
  { label: "Outcome", note: "Can the resulting consequence or non-consequence be independently verified?" },
];

const demonstrated = [
  "Harmonic V1 processed the admitted execution packet under the constitutional state represented in that packet.",
  "The runtime reached a refusal/block determination rather than permitting the consequential execution represented by the case.",
  "The runtime behavior was inspectable enough for TA-14 to issue an evidence-bounded independent finding.",
  "The participant accepted the evidentiary distinction and preserved V1 rather than retroactively changing the reviewed implementation.",
];

const notDemonstrated = [
  "An independently preserved pre-change authority state outside the admitted packet.",
  "Independent attribution of the revocation event as a real-world historical change rather than only a represented runtime condition.",
  "Independent preservation of the post-change constitutional state across the full chronology surrounding the case.",
  "External corroboration that the consequential execution did not occur outside the runtime evidence supplied for review.",
];

const v2Bridge = [
  "Independently attributable evidence objects",
  "Constitutional state snapshots",
  "Authority and state-change receipts",
  "Execution outcome records",
  "Replay artifacts",
  "Route-complete evidence bundles",
];

export default function HarmonicCaseLessonPage() {
  const [answers, setAnswers] = useState<Record<string, CheckChoice>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [activeChain, setActiveChain] = useState(0);

  const score = useMemo(
    () => checks.reduce((total, check) => total + (answers[check.id] === check.answer ? 1 : 0), 0),
    [answers],
  );

  const complete = Object.keys(answers).length === checks.length;

  return (
    <main className="lesson-shell">
      <div className="stars" aria-hidden="true" />
      <div className="orbit orbit-a" aria-hidden="true" />
      <div className="orbit orbit-b" aria-hidden="true" />
      <div className="glow glow-a" aria-hidden="true" />
      <div className="glow glow-b" aria-hidden="true" />

      <header className="topbar">
        <Link className="brand" href="/academy">
          <span className="brand-mark">14</span>
          <span>
            <strong>TA-14 ACADEMY</strong>
            <small>Case-Based Governance Learning</small>
          </span>
        </Link>
        <nav>
          <Link href="/academy">Academy</Link>
          <Link href="/artifacts/registry">Artifact Registry</Link>
          <Link href="/artifacts/fd-2026-0002-case-001">Source Artifact</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="badge-row">
            <span className="badge academy">TA-14 ACADEMY LESSON</span>
            <span className="badge case">FD-2026-0002 · CASE 001</span>
          </div>
          <p className="eyebrow">EXTERNAL GOVERNANCE ARTIFACT LEARNING MODULE</p>
          <h1>Harmonic V1: When a Gap Becomes a Bridge</h1>
          <p className="lede">
            Learn how a governed review can expose an evidentiary boundary without diminishing the participant, preserve the
            original version without rewriting history, and create the conditions for stronger engineering in the next version.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#lesson">Begin Lesson</a>
            <Link className="button secondary" href="/artifacts/fd-2026-0002-case-001">Inspect Source Artifact</Link>
          </div>
        </div>

        <aside className="case-card">
          <div className="case-card-head">
            <span>CASE LEARNING RECORD</span>
            <strong>Harmonic Constitutional Runtime V1.0</strong>
          </div>
          <dl>
            <div><dt>Governance</dt><dd>TA-14-AIGR-000008</dd></div>
            <div><dt>Demonstration</dt><dd>FD-2026-0002</dd></div>
            <div><dt>Case</dt><dd>Authority Revoked Before Consequential Execution</dd></div>
            <div><dt>Artifact</dt><dd>TA14-EAR-000013</dd></div>
            <div><dt>TA-14 Finding</dt><dd>PARTIALLY DEMONSTRATED — EVIDENCE-BOUNDED</dd></div>
            <div><dt>Runtime Result</dt><dd className="deny">REFUSAL / BLOCK DEMONSTRATED</dd></div>
          </dl>
        </aside>
      </section>

      <section className="lesson-goal" id="lesson">
        <div>
          <p className="section-kicker">LESSON OBJECTIVE</p>
          <h2>Do not confuse a demonstrated runtime result with a fully demonstrated historical chain.</h2>
        </div>
        <p>
          The central discipline in this case is evidence bounding. A runtime artifact can prove something important without proving
          everything around it. The reviewer must preserve both truths at the same time.
        </p>
      </section>

      <section className="content-grid two-column">
        <article className="panel green-panel">
          <p className="section-kicker green">WHAT THE EVIDENCE SUPPORTED</p>
          <h2>Runtime behavior was demonstrated.</h2>
          <div className="evidence-list">
            {demonstrated.map((item, index) => (
              <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>
            ))}
          </div>
        </article>

        <article className="panel red-panel">
          <p className="section-kicker red">WHAT REMAINED OUTSIDE THE PROOF</p>
          <h2>The surrounding chronology was not independently demonstrated.</h2>
          <div className="evidence-list">
            {notDemonstrated.map((item, index) => (
              <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>
            ))}
          </div>
        </article>
      </section>

      <section className="principle-panel">
        <p className="section-kicker gold">THE TA-14 REVIEW DISCIPLINE</p>
        <h2>Absence of submitted proof is not proof of architectural absence.</h2>
        <p>
          TA-14 did not convert an evidentiary limit into an accusation about Harmonic. It preserved the narrower finding: the admitted
          runtime behavior was demonstrated, while the broader chronology needed additional independently attributable evidence.
        </p>
        <div className="principles">
          <div><strong>Examine</strong><span>without diminishing</span></div>
          <div><strong>Expose gaps</strong><span>without accusation</span></div>
          <div><strong>Preserve history</strong><span>without retroactive repair</span></div>
          <div><strong>Drive improvement</strong><span>without architectural capture</span></div>
        </div>
      </section>

      <section className="chain-lab">
        <div className="chain-copy">
          <p className="section-kicker">CHAIN ANALYSIS</p>
          <h2>Where does the Harmonic case teach the most?</h2>
          <p>
            Select each TA-14 chain element. The point is not that every element failed. The point is to understand where runtime proof
            ends and where independent historical proof must begin.
          </p>
          <div className="chain-buttons" role="tablist" aria-label="TA-14 chain elements">
            {chain.map((step, index) => (
              <button
                key={step.label}
                type="button"
                className={activeChain === index ? "active" : ""}
                onClick={() => setActiveChain(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {step.label}
              </button>
            ))}
          </div>
        </div>
        <div className="chain-focus">
          <span>{String(activeChain + 1).padStart(2, "0")}</span>
          <p>TA-14 CHAIN ELEMENT</p>
          <h3>{chain[activeChain].label}</h3>
          <strong>{chain[activeChain].note}</strong>
          <div className="focus-note">
            {activeChain === 6 || activeChain === 7
              ? "This case becomes especially instructive here: the runtime determination can be preserved while the surrounding real-world execution/outcome chronology still requires independent corroboration."
              : "A route-complete review asks whether this element remains attributable and connected to the rest of the consequence-bearing chain."
            }
          </div>
        </div>
      </section>

      <section className="bridge-panel">
        <div className="bridge-copy">
          <p className="section-kicker gold">THE ENGINEERING CONSEQUENCE</p>
          <h2>Harmonic did not erase V1. It began building V2.</h2>
          <p>
            The participant stated that the V1 finding directly influenced the engineering direction of Version 2. That is the Exchange
            working as intended: the finding exposed a bounded gap, and the participant chose to build the evidence bridge in a new lineage.
          </p>
        </div>
        <div className="bridge-visual">
          <div className="bank bank-left">
            <small>V1 PRESERVED</small>
            <strong>What the artifact demonstrated</strong>
          </div>
          <div className="bridge-line">
            {v2Bridge.map((item, index) => (
              <div className="bridge-segment" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
          <div className="bank bank-right">
            <small>V2 LINEAGE</small>
            <strong>What future evidence can now prove</strong>
          </div>
        </div>
      </section>

      <section className="feedback-loop">
        <p className="section-kicker">EXCHANGE FEEDBACK LOOP</p>
        <h2>A review becomes valuable when the record can drive better future proof.</h2>
        <div className="loop-row">
          {["Evidence", "Bounded Gap", "Understanding", "Engineering Response", "Stronger Future Evidence"].map((item, index, list) => (
            <div className="loop-step" key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
              {index < list.length - 1 && <b>→</b>}
            </div>
          ))}
        </div>
      </section>

      <section className="knowledge-panel">
        <div className="knowledge-head">
          <div>
            <p className="section-kicker gold">KNOWLEDGE CHECK</p>
            <h2>Can you preserve the evidentiary boundary?</h2>
          </div>
          <div className="score-card">
            <span>{showAnswers ? `${score}/${checks.length}` : `${Object.keys(answers).length}/${checks.length}`}</span>
            <small>{showAnswers ? "CORRECT" : "ANSWERED"}</small>
          </div>
        </div>

        <div className="checks">
          {checks.map((check, checkIndex) => (
            <article className="check-card" key={check.id}>
              <span className="question-number">0{checkIndex + 1}</span>
              <h3>{check.question}</h3>
              <div className="choice-grid">
                {(Object.entries(check.choices) as [CheckChoice, string][]).map(([letter, text]) => {
                  const selected = answers[check.id] === letter;
                  const correct = showAnswers && letter === check.answer;
                  const incorrect = showAnswers && selected && letter !== check.answer;
                  return (
                    <button
                      key={letter}
                      type="button"
                      className={`${selected ? "selected" : ""} ${correct ? "correct" : ""} ${incorrect ? "incorrect" : ""}`}
                      onClick={() => !showAnswers && setAnswers((current) => ({ ...current, [check.id]: letter }))}
                    >
                      <span>{letter}</span>
                      <p>{text}</p>
                    </button>
                  );
                })}
              </div>
              {showAnswers && <div className="explanation">{check.explanation}</div>}
            </article>
          ))}
        </div>

        <div className="check-actions">
          <button
            type="button"
            className="button primary"
            disabled={!complete}
            onClick={() => setShowAnswers(true)}
          >
            Score Knowledge Check
          </button>
          {showAnswers && (
            <button
              type="button"
              className="button secondary"
              onClick={() => { setAnswers({}); setShowAnswers(false); }}
            >
              Retake Lesson Check
            </button>
          )}
        </div>
      </section>

      <section className="closing">
        <p>CASE LESSON TAKEAWAY</p>
        <h2>The goal is not to find a gap so TA-14 can point at it.</h2>
        <strong>
          The goal is to expose the gap clearly enough that the participant can build the right bridge — and then preserve enough history
          to prove whether the bridge was actually built.
        </strong>
        <div className="closing-actions">
          <Link className="button primary" href="/artifacts/fd-2026-0002-case-001">Return to Harmonic Artifact</Link>
          <Link className="button secondary" href="/artifacts/registry">Open Artifact Registry</Link>
          <Link className="button ghost" href="/academy">Continue TA-14 Academy</Link>
        </div>
        <blockquote>No admissible evidence. No admissible execution.</blockquote>
      </section>

      <footer>
        <div>
          <strong>TA-14 Academy · External Governance Case Lesson</strong>
          <span>Harmonic V1 · FD-2026-0002 · Case 001 · TA14-EAR-000013</span>
        </div>
        <p>Learn → Examine → Preserve → Build the Bridge → Demonstrate Again</p>
      </footer>

      <style jsx>{`
        :global(*){box-sizing:border-box}
        :global(html){background:#02060c;scroll-behavior:smooth}
        :global(body){margin:0;background:#02060c;color:#eef9ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        :global(a){color:inherit;text-decoration:none}
        button{font:inherit}
        .lesson-shell{--gold:#f3bd5f;--blue:#63d8ff;--green:#6ff2b4;--red:#ff7784;min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 82% 7%,rgba(19,125,181,.25),transparent 27%),radial-gradient(circle at 8% 42%,rgba(243,189,95,.1),transparent 22%),linear-gradient(180deg,#02060c 0%,#06111d 44%,#02070d 100%)}
        .stars{position:absolute;inset:0;pointer-events:none;opacity:.48;background-image:radial-gradient(circle,rgba(255,255,255,.8) 0 1px,transparent 1.3px),radial-gradient(circle,rgba(99,216,255,.6) 0 1px,transparent 1.4px);background-size:137px 137px,211px 211px;background-position:14px 25px,71px 88px;animation:drift 30s linear infinite}
        .glow{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none;opacity:.18}.glow-a{width:600px;height:600px;background:#00a6ff;right:-230px;top:760px}.glow-b{width:540px;height:540px;background:#dc9a32;left:-260px;top:1900px}
        .orbit{position:absolute;border:1px solid rgba(99,216,255,.12);border-radius:50%;pointer-events:none}.orbit:after{content:"";position:absolute;width:9px;height:9px;border-radius:50%;background:var(--gold);box-shadow:0 0 18px var(--gold);animation:orbitDot 9s linear infinite}.orbit-a{width:560px;height:560px;right:-170px;top:180px;transform:rotate(18deg)}.orbit-b{width:420px;height:420px;left:-150px;top:1240px;transform:rotate(-12deg)}
        .topbar{min-height:78px;position:relative;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:28px;padding:0 5vw;border-bottom:1px solid rgba(143,222,255,.13);background:rgba(2,7,13,.9);backdrop-filter:blur(24px)}
        .brand{display:flex;align-items:center;gap:12px}.brand-mark{width:44px;height:44px;display:grid;place-items:center;border:1px solid rgba(243,189,95,.62);border-radius:13px;color:var(--gold);font-weight:950;background:linear-gradient(145deg,rgba(243,189,95,.2),rgba(12,23,37,.9))}.brand strong,.brand small{display:block}.brand strong{letter-spacing:.18em;font-size:.9rem}.brand small{margin-top:3px;color:#87a8bd;font-size:.67rem;letter-spacing:.11em;text-transform:uppercase}.topbar nav{display:flex;gap:26px;color:#9ab6c8;font-size:.82rem}.topbar nav a:hover{color:#fff}
        .hero{position:relative;z-index:2;max-width:1500px;margin:0 auto;display:grid;grid-template-columns:1.1fr .9fr;gap:58px;align-items:center;padding:96px 5vw 84px}.hero-copy{max-width:880px}.badge-row{display:flex;gap:10px;flex-wrap:wrap}.badge{display:inline-flex;border-radius:999px;padding:8px 12px;font-size:.68rem;font-weight:900;letter-spacing:.12em}.academy{border:1px solid rgba(243,189,95,.45);background:rgba(243,189,95,.12);color:#ffd887}.case{border:1px solid rgba(99,216,255,.35);background:rgba(99,216,255,.09);color:#9eeaff}.eyebrow{margin:24px 0 10px;color:#7dcced;font-size:.75rem;font-weight:900;letter-spacing:.18em}.hero h1{margin:0;font-size:clamp(3.2rem,6.5vw,7rem);line-height:.91;letter-spacing:-.055em;max-width:1000px}.lede{max-width:850px;margin:28px 0;color:#b7cddb;font-size:1.12rem;line-height:1.78}.hero-actions,.closing-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.button{border:1px solid rgba(143,222,255,.2);border-radius:12px;padding:12px 17px;font-weight:900;font-size:.82rem;cursor:pointer;transition:.2s ease}.button:hover{transform:translateY(-2px)}.primary{background:linear-gradient(135deg,#0c97cd,#116483);color:white}.secondary{background:rgba(14,34,52,.82);color:#d0f1ff}.ghost{background:transparent;color:#9bb7c8}.button:disabled{opacity:.35;cursor:not-allowed;transform:none}
        .case-card{border:1px solid rgba(143,222,255,.18);border-radius:26px;padding:27px;background:linear-gradient(180deg,rgba(7,18,31,.94),rgba(5,14,24,.84));box-shadow:0 30px 85px rgba(0,0,0,.36),inset 0 0 50px rgba(99,216,255,.03)}.case-card-head{padding-bottom:18px;border-bottom:1px solid rgba(143,222,255,.12)}.case-card-head span{display:block;color:#89a9bd;font-size:.68rem;letter-spacing:.16em}.case-card-head strong{display:block;margin-top:7px;font-size:1.32rem}.case-card dl{margin:10px 0 0}.case-card dl div{display:grid;grid-template-columns:145px 1fr;gap:16px;padding:13px 0;border-bottom:1px solid rgba(143,222,255,.09)}dt{color:#7896aa;font-size:.75rem}dd{margin:0;color:#e7f6ff;font-size:.84rem;line-height:1.5}.deny{color:#ff9aa3!important;font-weight:900}
        .lesson-goal{position:relative;z-index:2;max-width:1370px;margin:0 auto 26px;padding:34px 5vw;border-top:1px solid rgba(143,222,255,.11);border-bottom:1px solid rgba(143,222,255,.11);display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}.lesson-goal h2{font-size:clamp(1.8rem,3vw,3.1rem);line-height:1.08;margin:8px 0}.lesson-goal>p{color:#adc4d2;line-height:1.75;font-size:1rem}.section-kicker{margin:0 0 10px;color:#79cceb;font-size:.7rem;font-weight:950;letter-spacing:.17em}.section-kicker.gold{color:#efbd67}.section-kicker.green{color:#74f2b5}.section-kicker.red{color:#ff9099}
        .content-grid,.principle-panel,.chain-lab,.bridge-panel,.feedback-loop,.knowledge-panel{position:relative;z-index:2;max-width:1500px;margin:22px auto;padding-left:5vw;padding-right:5vw}.two-column{display:grid;grid-template-columns:1fr 1fr;gap:22px}.panel{padding:34px;border:1px solid rgba(143,222,255,.14);border-radius:24px;background:rgba(7,18,31,.78);box-shadow:0 20px 60px rgba(0,0,0,.2)}.panel h2,.principle-panel h2,.chain-copy h2,.bridge-copy h2,.feedback-loop h2,.knowledge-head h2{margin:0 0 17px;font-size:clamp(1.8rem,3.1vw,3.25rem);line-height:1.06}.green-panel{border-color:rgba(111,242,180,.2)}.red-panel{border-color:rgba(255,119,132,.2)}.evidence-list{display:grid;gap:10px;margin-top:24px}.evidence-list div{display:grid;grid-template-columns:38px 1fr;gap:12px;padding:15px;border:1px solid rgba(143,222,255,.08);border-radius:14px;background:rgba(11,28,44,.82)}.green-panel .evidence-list span{color:var(--green)}.red-panel .evidence-list span{color:var(--red)}.evidence-list span{font-weight:950;font-size:.72rem}.evidence-list p{margin:0;color:#d2e2eb;line-height:1.58;font-size:.88rem}
        .principle-panel{padding-top:72px;padding-bottom:72px;margin-top:28px;border-top:1px solid rgba(243,189,95,.12);border-bottom:1px solid rgba(243,189,95,.12);background:linear-gradient(90deg,transparent,rgba(243,189,95,.055),transparent)}.principle-panel>p:not(.section-kicker){max-width:1100px;color:#adc3d1;line-height:1.78;font-size:1.02rem}.principles{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:30px}.principles div{padding:20px;border-radius:16px;border:1px solid rgba(243,189,95,.15);background:rgba(7,18,31,.72)}.principles strong,.principles span{display:block}.principles strong{color:#f4c979;font-size:.96rem}.principles span{margin-top:6px;color:#94adbd;font-size:.8rem}
        .chain-lab{display:grid;grid-template-columns:1.2fr .8fr;gap:24px;align-items:stretch;padding-top:62px;padding-bottom:62px}.chain-copy{padding:34px;border:1px solid rgba(143,222,255,.14);border-radius:24px;background:rgba(7,18,31,.78)}.chain-copy>p:not(.section-kicker){color:#a9c0cf;line-height:1.72;max-width:850px}.chain-buttons{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:25px}.chain-buttons button{min-height:78px;padding:12px;border-radius:13px;border:1px solid rgba(143,222,255,.1);background:rgba(10,27,43,.78);color:#abc1cf;cursor:pointer;text-align:left;transition:.2s ease}.chain-buttons button:hover,.chain-buttons button.active{border-color:rgba(243,189,95,.45);background:linear-gradient(135deg,rgba(243,189,95,.13),rgba(14,42,61,.9));color:#fff;transform:translateY(-2px)}.chain-buttons span{display:block;color:#e9b95f;font-size:.66rem;font-weight:950;margin-bottom:6px}.chain-focus{position:relative;overflow:hidden;padding:38px;border:1px solid rgba(243,189,95,.2);border-radius:24px;background:linear-gradient(150deg,rgba(243,189,95,.1),rgba(7,18,31,.9) 45%,rgba(99,216,255,.06))}.chain-focus>span{font-size:5rem;font-weight:950;line-height:1;color:rgba(243,189,95,.18)}.chain-focus>p{margin:20px 0 5px;color:#7ccdeb;font-size:.67rem;font-weight:950;letter-spacing:.17em}.chain-focus h3{font-size:2.7rem;margin:0 0 15px}.chain-focus strong{display:block;font-size:1rem;line-height:1.6;color:#dcecf4}.focus-note{margin-top:26px;padding:18px;border-radius:15px;background:rgba(3,10,17,.5);border:1px solid rgba(143,222,255,.1);color:#9fb8c7;line-height:1.64;font-size:.86rem}
        .bridge-panel{padding-top:56px;padding-bottom:56px}.bridge-copy{max-width:1050px}.bridge-copy>p:not(.section-kicker){color:#a9c0cf;line-height:1.76}.bridge-visual{display:grid;grid-template-columns:.68fr 2.2fr .68fr;gap:13px;align-items:stretch;margin-top:34px}.bank{display:flex;flex-direction:column;justify-content:center;padding:22px;border-radius:18px;border:1px solid rgba(143,222,255,.13);background:rgba(7,18,31,.84)}.bank small{color:#e8b963;letter-spacing:.13em;font-weight:950;font-size:.65rem}.bank strong{margin-top:8px;line-height:1.4;font-size:.9rem}.bridge-line{display:grid;grid-template-columns:repeat(6,1fr);gap:7px;padding:12px;border:1px solid rgba(243,189,95,.18);border-radius:20px;background:linear-gradient(180deg,rgba(243,189,95,.07),rgba(7,18,31,.5))}.bridge-segment{min-height:118px;padding:14px 10px;border-radius:13px;border:1px solid rgba(143,222,255,.1);background:rgba(11,28,44,.84);display:flex;flex-direction:column;align-items:flex-start;justify-content:center}.bridge-segment span{width:27px;height:27px;display:grid;place-items:center;border-radius:50%;background:rgba(243,189,95,.13);color:#f5c56e;font-size:.68rem;font-weight:950}.bridge-segment p{margin:10px 0 0;color:#c4d7e2;font-size:.73rem;line-height:1.42}
        .feedback-loop{padding-top:65px;padding-bottom:65px;border-top:1px solid rgba(143,222,255,.1);border-bottom:1px solid rgba(143,222,255,.1)}.loop-row{display:flex;gap:8px;align-items:stretch;margin-top:28px;overflow-x:auto;padding-bottom:6px}.loop-step{position:relative;min-width:180px;flex:1;padding:20px;border-radius:15px;border:1px solid rgba(143,222,255,.1);background:rgba(7,18,31,.78)}.loop-step span{display:block;color:#efbd67;font-size:.7rem;font-weight:950}.loop-step strong{display:block;margin-top:7px;line-height:1.35}.loop-step b{position:absolute;right:-10px;top:50%;z-index:3;color:#63d8ff;font-size:1.2rem}
        .knowledge-panel{padding-top:76px;padding-bottom:76px}.knowledge-head{display:flex;justify-content:space-between;gap:30px;align-items:flex-start}.score-card{min-width:128px;padding:18px;border-radius:18px;border:1px solid rgba(243,189,95,.2);background:rgba(243,189,95,.07);text-align:center}.score-card span{display:block;color:#f5c76f;font-size:2rem;font-weight:950}.score-card small{font-size:.62rem;letter-spacing:.14em;color:#95adbd}.checks{display:grid;gap:16px;margin-top:28px}.check-card{position:relative;padding:30px;border:1px solid rgba(143,222,255,.13);border-radius:22px;background:rgba(7,18,31,.8)}.question-number{position:absolute;right:24px;top:20px;color:rgba(243,189,95,.2);font-size:2.5rem;font-weight:950}.check-card h3{max-width:980px;margin:0 0 20px;font-size:1.12rem;line-height:1.5}.choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.choice-grid button{display:grid;grid-template-columns:34px 1fr;gap:11px;align-items:start;text-align:left;padding:15px;border-radius:14px;border:1px solid rgba(143,222,255,.1);background:rgba(10,27,43,.78);color:#c9dce6;cursor:pointer}.choice-grid button:hover,.choice-grid button.selected{border-color:rgba(99,216,255,.45);background:rgba(30,83,111,.36)}.choice-grid button.correct{border-color:rgba(111,242,180,.55);background:rgba(111,242,180,.09)}.choice-grid button.incorrect{border-color:rgba(255,119,132,.55);background:rgba(255,119,132,.08)}.choice-grid button>span{width:28px;height:28px;display:grid;place-items:center;border-radius:50%;background:rgba(99,216,255,.1);color:#85e4ff;font-weight:950;font-size:.7rem}.choice-grid p{margin:3px 0 0;line-height:1.45;font-size:.82rem}.explanation{margin-top:16px;padding:16px 18px;border-left:3px solid #f1bd62;background:rgba(243,189,95,.07);color:#c5d6e0;font-size:.84rem;line-height:1.6}.check-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}
        .closing{position:relative;z-index:2;text-align:center;padding:96px 5vw;border-top:1px solid rgba(243,189,95,.14);background:radial-gradient(circle at 50% 100%,rgba(243,189,95,.11),transparent 48%)}.closing>p{color:#e5b65f;font-size:.68rem;letter-spacing:.18em;font-weight:950}.closing h2{max-width:950px;margin:12px auto 16px;font-size:clamp(2.2rem,4.4vw,4.5rem);line-height:1.02}.closing>strong{display:block;max-width:1000px;margin:0 auto;color:#b7cbd8;line-height:1.7;font-size:1rem;font-weight:500}.closing-actions{justify-content:center}.closing blockquote{margin:42px auto 0;color:#f2c36a;font-size:.78rem;letter-spacing:.12em;font-weight:950}
        footer{position:relative;z-index:2;min-height:110px;padding:30px 5vw;border-top:1px solid rgba(143,222,255,.1);display:flex;align-items:center;justify-content:space-between;gap:24px;color:#7897aa}footer strong,footer span{display:block}footer strong{color:#e8f7ff}footer span{margin-top:5px;font-size:.75rem}footer p{font-size:.76rem;letter-spacing:.05em}
        @keyframes drift{from{transform:translateY(0)}to{transform:translateY(137px)}}
        @keyframes orbitDot{0%{left:8%;top:24%}25%{left:76%;top:4%}50%{left:92%;top:72%}75%{left:30%;top:92%}100%{left:8%;top:24%}}
        @media(max-width:1100px){.hero,.lesson-goal,.chain-lab{grid-template-columns:1fr}.two-column{grid-template-columns:1fr}.principles{grid-template-columns:1fr 1fr}.bridge-visual{grid-template-columns:1fr}.bridge-line{grid-template-columns:repeat(3,1fr)}.topbar nav{display:none}}
        @media(max-width:720px){.hero{padding-top:65px}.hero h1{font-size:3rem}.principles,.choice-grid{grid-template-columns:1fr}.chain-buttons{grid-template-columns:1fr 1fr}.bridge-line{grid-template-columns:1fr 1fr}.knowledge-head{display:block}.score-card{margin-top:18px;max-width:140px}.case-card dl div{grid-template-columns:1fr}.topbar{padding:0 18px}.hero,.lesson-goal,.content-grid,.principle-panel,.chain-lab,.bridge-panel,.feedback-loop,.knowledge-panel{padding-left:18px;padding-right:18px}.panel,.chain-copy,.chain-focus,.check-card{padding:22px}.loop-row{display:grid}.loop-step b{display:none}footer{align-items:flex-start;flex-direction:column;padding-left:18px;padding-right:18px}}
      `}</style>
    </main>
  );
}
