'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type VersionState = 'committed' | 'superseded' | 'proposed';

type RouteVersion = {
  id: string;
  created: string;
  state: VersionState;
  amount: string;
  destination: string;
  authority: string;
  digest: string;
  note: string;
};

const initialVersions: RouteVersion[] = [
  {
    id: 'v1',
    created: '14:02:11 UTC',
    state: 'superseded',
    amount: '$48,750',
    destination: 'Account ending 8841',
    authority: 'P-17 dual approval',
    digest: 'sha256:7f91…18c4',
    note: 'Original proposed route. The destination later failed binding review.',
  },
  {
    id: 'v2',
    created: '14:08:39 UTC',
    state: 'committed',
    amount: '$48,750',
    destination: 'Account ending 2916',
    authority: 'P-17 dual approval',
    digest: 'sha256:b2e8…91af',
    note: 'Corrected destination, revalidated evidence, and committed as the execution candidate.',
  },
];

const questions = [
  {
    question: 'What does a commit establish?',
    choices: [
      'That a route can never be reviewed again.',
      'The exact, immutable route version authorized to proceed toward execution.',
      'That every future version is automatically valid.',
    ],
    correctIndex: 1,
    explanation:
      'A commit fixes the precise evidence, authority, bindings, payload, and decision state that may proceed. Later changes require a new version and a new decision.',
  },
  {
    question: 'A committed route needs a destination change. What is the correct action?',
    choices: [
      'Silently edit the committed record.',
      'Execute first and update the record afterward.',
      'Create a new version, preserve the old version, and re-run admissibility.',
    ],
    correctIndex: 2,
    explanation:
      'A material change breaks correspondence with the committed route. The correction must become a new version that is independently evaluated.',
  },
  {
    question: 'Why preserve superseded versions?',
    choices: [
      'To prove what was proposed, what changed, who changed it, and why the final route differs.',
      'Only to increase storage use.',
      'Because superseded routes may still execute.',
    ],
    correctIndex: 0,
    explanation:
      'Version history preserves the route’s truth. It prevents corrections from rewriting the past and supports later replay, audit, and dispute resolution.',
  },
];

const commitElements = [
  ['Route identity', 'A stable route ID and a unique version ID distinguish the route from every other proposal.'],
  ['Canonical payload', 'The exact execution object is normalized so the same route always produces the same digest.'],
  ['Evidence set', 'The admissible records, receipts, and provenance references are fixed to the committed version.'],
  ['Authority state', 'The applicable authority, limits, approvals, and temporal validity are captured at commit time.'],
  ['Decision receipt', 'The ALLOW, HOLD, DENY, or ESCALATE determination is preserved with its reasons.'],
  ['Cryptographic digest', 'A deterministic fingerprint makes any post-commit alteration detectable.'],
];

export default function CommitAndVersionHistoryPage() {
  const [versions, setVersions] = useState<RouteVersion[]>(initialVersions);
  const [selectedId, setSelectedId] = useState('v2');
  const [draftDestination, setDraftDestination] = useState('Account ending 7340');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const selected = versions.find((version) => version.id === selectedId) ?? versions[0];
  const committed = versions.find((version) => version.state === 'committed');
  const proposed = versions.find((version) => version.state === 'proposed');
  const status = proposed ? 'REVIEW REQUIRED' : 'COMMITTED';
  const score = useMemo(
    () => questions.reduce((total, item, index) => total + (answers[index] === item.correctIndex ? 1 : 0), 0),
    [answers],
  );

  function createVersion() {
    if (proposed || !committed) return;
    setVersions((current) => [
      ...current,
      {
        id: `v${current.length + 1}`,
        created: '14:17:04 UTC',
        state: 'proposed',
        amount: committed.amount,
        destination: draftDestination,
        authority: committed.authority,
        digest: 'pending canonicalization',
        note: 'Material destination change. This version cannot inherit the prior ALLOW decision.',
      },
    ]);
    setSelectedId(`v${versions.length + 1}`);
  }

  function commitProposed() {
    if (!proposed) return;
    setVersions((current) =>
      current.map((version) => {
        if (version.id === proposed.id) {
          return {
            ...version,
            state: 'committed',
            digest: 'sha256:de44…0a73',
            note: 'New version re-evaluated, approved, and committed without altering prior history.',
          };
        }
        return version.state === 'committed' ? { ...version, state: 'superseded' } : version;
      }),
    );
  }

  function resetLab() {
    setVersions(initialVersions);
    setSelectedId('v2');
    setDraftDestination('Account ending 7340');
  }

  return (
    <main className="lesson-page">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #02050a; color: #f4f8ff; }
        button, input { font: inherit; }
        a { color: inherit; }
        .lesson-page { min-height: 100vh; overflow: hidden; background: radial-gradient(circle at 8% 0%, rgba(79,215,255,.15), transparent 30%), radial-gradient(circle at 92% 14%, rgba(167,111,255,.15), transparent 28%), linear-gradient(180deg,#02050a 0%,#07101b 52%,#02060b 100%); font-family: Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
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
        .commit-visual { position:relative; min-height:410px; display:grid; place-items:center; }
        .ring { position:absolute; width:360px; height:360px; border:1px solid rgba(135,210,255,.22); border-radius:50%; animation:spin 22s linear infinite; }
        .ring.two { width:280px; height:280px; border-style:dashed; animation-duration:15s; animation-direction:reverse; }
        .ring::before { content:""; position:absolute; width:13px; height:13px; border-radius:50%; left:38px; top:55px; background:#70e7ff; box-shadow:0 0 22px rgba(84,232,255,.8); }
        .core { position:relative; z-index:2; width:210px; height:210px; display:grid; place-items:center; text-align:center; border:1px solid rgba(167,132,255,.55); border-radius:50%; background:radial-gradient(circle,rgba(151,105,255,.2),rgba(7,13,22,.96) 69%); box-shadow:0 0 75px rgba(142,101,255,.18); }
        .core strong { display:block; color:${status === 'COMMITTED' ? '#69efb9' : '#ffc36e'}; font-size:1.45rem; letter-spacing:.07em; }
        .core span { color:#9dafc1; font-size:.72rem; text-transform:uppercase; letter-spacing:.16em; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .section { margin-top:90px; }
        .section-head { display:flex; align-items:end; justify-content:space-between; gap:24px; margin-bottom:28px; }
        .section h2 { margin:8px 0 0; font-size:clamp(2rem,4vw,3.5rem); letter-spacing:-.045em; }
        .section-copy { max-width:660px; color:#9fb0c3; line-height:1.7; }
        .element-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .element { min-height:175px; padding:22px; border:1px solid rgba(255,255,255,.1); border-radius:20px; background:rgba(8,16,27,.76); }
        .element span { display:block; color:#73e8ff; font-size:.72rem; font-weight:900; letter-spacing:.15em; text-transform:uppercase; margin-bottom:14px; }
        .element h3 { margin:0 0 9px; font-size:1.15rem; }
        .element p { margin:0; color:#9fb0c3; line-height:1.62; }
        .lab { overflow:hidden; border:1px solid rgba(111,226,255,.18); border-radius:26px; background:rgba(5,12,21,.86); box-shadow:0 30px 90px rgba(0,0,0,.28); }
        .lab-bar { display:flex; justify-content:space-between; align-items:center; gap:18px; padding:20px 23px; border-bottom:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.025); }
        .status { padding:8px 12px; border-radius:999px; font-size:.72rem; font-weight:950; letter-spacing:.12em; color:${status === 'COMMITTED' ? '#76efbd' : '#ffc36e'}; background:${status === 'COMMITTED' ? 'rgba(72,225,160,.1)' : 'rgba(255,184,77,.1)'}; }
        .lab-grid { display:grid; grid-template-columns:.82fr 1.18fr; min-height:560px; }
        .version-list { padding:18px; border-right:1px solid rgba(255,255,255,.08); }
        .version-row { width:100%; display:grid; grid-template-columns:12px 1fr auto; align-items:center; gap:13px; padding:16px; margin-bottom:8px; color:#eef6ff; text-align:left; border:1px solid transparent; border-radius:14px; background:transparent; cursor:pointer; }
        .version-row:hover,.version-row.active { border-color:rgba(88,224,255,.25); background:rgba(88,224,255,.055); }
        .dot { width:10px; height:10px; border-radius:50%; }
        .dot.committed { background:#67eeb8; box-shadow:0 0 12px rgba(72,225,160,.5); }
        .dot.superseded { background:#8195aa; }
        .dot.proposed { background:#ffc36e; box-shadow:0 0 12px rgba(255,184,77,.5); }
        .version-name { font-weight:850; }
        .version-state { color:#8fa3b8; font-size:.66rem; letter-spacing:.1em; text-transform:uppercase; }
        .inspection { padding:34px; }
        .inspection h3 { margin:9px 0 12px; font-size:clamp(1.8rem,3vw,2.6rem); }
        .inspection > p { color:#a6b7c9; line-height:1.68; }
        .facts { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:25px 0; }
        .fact { padding:16px; border:1px solid rgba(255,255,255,.1); border-radius:14px; background:rgba(255,255,255,.03); }
        .fact span { display:block; margin-bottom:8px; color:#8195aa; font-size:.67rem; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .fact strong { overflow-wrap:anywhere; }
        .note { padding:17px; border:1px solid rgba(111,226,255,.17); border-radius:14px; background:rgba(84,232,255,.055); color:#bfd0df; line-height:1.6; }
        .change-box { margin-top:22px; padding:19px; border:1px solid rgba(255,195,110,.2); border-radius:16px; background:rgba(255,184,77,.055); }
        .change-box label { display:block; margin-bottom:9px; color:#ffc36e; font-size:.71rem; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .input { width:100%; min-height:45px; padding:0 13px; border:1px solid rgba(255,255,255,.14); border-radius:11px; outline:none; background:rgba(0,0,0,.24); color:#fff; margin-bottom:12px; }
        .timeline { display:grid; gap:14px; }
        .timeline-item { display:grid; grid-template-columns:110px 1fr; gap:18px; padding:20px; border:1px solid rgba(255,255,255,.09); border-radius:17px; background:rgba(8,16,27,.66); }
        .timeline-item strong { color:#72e8ff; }
        .timeline-item p { margin:4px 0 0; color:#9fb0c3; line-height:1.62; }
        .quiz { display:grid; gap:16px; }
        .question { padding:23px; border:1px solid rgba(255,255,255,.1); border-radius:19px; background:rgba(8,16,27,.76); }
        .question h3 { margin:0 0 16px; font-size:1.08rem; }
        .choices { display:grid; gap:9px; }
        .choice { padding:13px 14px; border:1px solid rgba(255,255,255,.1); border-radius:11px; background:rgba(255,255,255,.025); color:#dce8f4; text-align:left; cursor:pointer; }
        .choice.selected { border-color:rgba(99,229,255,.5); background:rgba(84,232,255,.08); }
        .choice.correct { border-color:rgba(80,231,167,.5); background:rgba(70,226,159,.08); }
        .choice.wrong { border-color:rgba(255,113,130,.5); background:rgba(255,95,111,.08); }
        .explanation { margin-top:13px; color:#aebdce; line-height:1.58; }
        .score { padding:22px; border:1px solid rgba(84,232,255,.2); border-radius:18px; background:linear-gradient(135deg,rgba(84,232,255,.08),rgba(151,105,255,.06)); }
        .final { margin-top:90px; padding:34px; border:1px solid rgba(111,226,255,.18); border-radius:25px; background:linear-gradient(135deg,rgba(84,232,255,.08),rgba(151,105,255,.07)); }
        .final h2 { margin:7px 0 12px; }
        .final p { color:#afbfce; line-height:1.7; }
        @media (max-width:900px) { .hero,.lab-grid { grid-template-columns:1fr; } .binding-orbit,.commit-visual { min-height:330px; } .element-grid { grid-template-columns:1fr 1fr; } .version-list { border-right:0; border-bottom:1px solid rgba(255,255,255,.08); } }
        @media (max-width:620px) { .topbar,.section-head,.lab-bar { align-items:flex-start; flex-direction:column; } .element-grid,.facts { grid-template-columns:1fr; } .timeline-item { grid-template-columns:1fr; gap:7px; } h1 { font-size:3.05rem; } .inspection { padding:24px; } }
      `}</style>

      <div className="shell">
        <header className="topbar">
          <Link className="brand" href="/academy"><span className="brand-mark">14</span><span>TA-14 ACADEMY</span></Link>
          <div className="nav-actions"><Link className="button" href="/academy">Academy</Link><Link className="button" href="/workspace">Exchange</Link></div>
        </header>

        <section className="hero">
          <div>
            <div className="eyebrow">Module 06 · Commit and Version History</div>
            <h1>Fix the route before consequence.</h1>
            <p className="lead">A governance route is not ready merely because its parts were reviewed. The exact admissible version must be committed so execution can be compared against one stable, deterministic object.</p>
            <div className="hero-actions"><a className="button primary" href="#commit-lab">Open commit lab</a><Link className="button" href="/workspace/demonstrations">View live engine</Link></div>
            <div className="principle">A correction creates a new version. It does not rewrite the route that existed before the correction.</div>
          </div>
          <div className="commit-visual" aria-hidden="true"><div className="ring"/><div className="ring two"/><div className="core"><div><span>Current route state</span><strong>{status}</strong></div></div></div>
        </section>

        <section className="section">
          <div className="section-head"><div><div className="eyebrow">Commit anatomy</div><h2>What becomes fixed</h2></div><p className="section-copy">The commit is the boundary between an evaluated proposal and an execution candidate. Every material element needed to reproduce the decision must be captured.</p></div>
          <div className="element-grid">{commitElements.map(([title, copy], index) => <article className="element" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </section>

        <section className="section" id="commit-lab">
          <div className="section-head"><div><div className="eyebrow">Interactive lab</div><h2>Change a committed route</h2></div><p className="section-copy">Create a material destination change and observe why the earlier commit cannot be silently edited or reused.</p></div>
          <div className="lab">
            <div className="lab-bar"><strong>Route PAY-2026-0717</strong><span className="status">{status}</span></div>
            <div className="lab-grid">
              <div className="version-list">
                {versions.map((version) => <button className={`version-row ${selectedId === version.id ? 'active' : ''}`} key={version.id} onClick={() => setSelectedId(version.id)}><span className={`dot ${version.state}`}/><span className="version-name">{version.id.toUpperCase()} · {version.created}</span><span className="version-state">{version.state}</span></button>)}
                <div className="lab-actions"><button className="button" onClick={resetLab}>Reset</button></div>
              </div>
              <div className="inspection">
                <div className="eyebrow">Selected version</div><h3>{selected.id.toUpperCase()} · {selected.state}</h3><p>{selected.note}</p>
                <div className="facts"><div className="fact"><span>Amount</span><strong>{selected.amount}</strong></div><div className="fact"><span>Destination</span><strong>{selected.destination}</strong></div><div className="fact"><span>Authority</span><strong>{selected.authority}</strong></div><div className="fact"><span>Digest</span><strong>{selected.digest}</strong></div></div>
                <div className="note">The digest corresponds to this exact version. Any material alteration changes the canonical payload and therefore requires a new digest, decision receipt, and commit.</div>
                {!proposed && <div className="change-box"><label>Propose a new payment destination</label><input className="input" value={draftDestination} onChange={(event) => setDraftDestination(event.target.value)} /><button className="button primary" onClick={createVersion}>Create new version</button></div>}
                {proposed && <div className="change-box"><label>Version {proposed.id.toUpperCase()} is not yet executable</label><p className="section-copy">The prior ALLOW decision belongs to the prior committed payload. Re-evaluate this version, then issue a new commit.</p><button className="button primary" onClick={commitProposed}>Revalidate and commit</button></div>}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head"><div><div className="eyebrow">Preserved sequence</div><h2>History remains visible</h2></div><p className="section-copy">A trustworthy route explains not only what executed, but how the route arrived at that state.</p></div>
          <div className="timeline"><div className="timeline-item"><strong>Version 1</strong><div><b>Original proposal preserved</b><p>The first destination mismatch remains visible as historical truth rather than being erased by correction.</p></div></div><div className="timeline-item"><strong>Version 2</strong><div><b>Corrected and committed</b><p>The verified destination receives its own digest and decision receipt.</p></div></div><div className="timeline-item"><strong>Version 3</strong><div><b>Material change requires renewed governance</b><p>A new destination cannot inherit the prior version’s authority, admissibility, or execution permission.</p></div></div></div>
        </section>

        <section className="section">
          <div className="section-head"><div><div className="eyebrow">Knowledge check</div><h2>Prove the distinction</h2></div><p className="section-copy">Select one answer for each question, then score the lesson.</p></div>
          <div className="quiz">{questions.map((item,index) => { const answer=answers[index]; return <article className="question" key={item.question}><h3>{index + 1}. {item.question}</h3><div className="choices">{item.choices.map((choice,choiceIndex) => { let state=''; if(answer===choiceIndex) state='selected'; if(submitted && choiceIndex===item.correctIndex) state='correct'; else if(submitted && answer===choiceIndex && answer!==item.correctIndex) state='wrong'; return <button className={`choice ${state}`} key={choice} onClick={() => { setAnswers((current)=>({...current,[index]:choiceIndex})); setSubmitted(false); }}>{choice}</button>; })}</div>{submitted && <div className="explanation">{item.explanation}</div>}</article>; })}</div>
          <div className="score"><strong>{submitted ? `Score: ${score} / ${questions.length}` : 'Complete all three questions.'}</strong><div className="lab-actions" style={{marginTop:14}}><button className="button primary" disabled={Object.keys(answers).length !== questions.length} onClick={() => setSubmitted(true)}>Score lesson</button><button className="button" onClick={() => { setAnswers({}); setSubmitted(false); }}>Clear answers</button></div></div>
        </section>

        <section className="final"><div className="eyebrow">Next module</div><h2>Execution must correspond to the commit.</h2><p>The next lesson moves from the immutable execution candidate to the live act itself: proving that what the system did is the same thing the route authorized.</p><div className="final-actions"><Link className="button primary" href="/academy/execution-correspondence">Continue to Module 07</Link><Link className="button" href="/workspace/demonstrations">Launch demonstration</Link></div></section>
      </div>
    </main>
  );
}
