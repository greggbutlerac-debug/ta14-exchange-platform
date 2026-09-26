'use client';

import Link from 'next/link';
import { useState } from 'react';

const established = [
  ['AUTHORITATIVE T0 OBJECT','ESTABLISHED'],
  ['T0 PRESERVATION / FREEZE CONTINUITY','ESTABLISHED'],
  ['AUTHORITATIVE BASELINE SOURCE VALUES','PRESENT'],
  ['ORIGIN CHAIN ID','NOT ESTABLISHED'],
  ['EXAMINED PROPOSITION ID','NOT ESTABLISHED'],
  ['RUN 1 PRECONDITIONS','NOT SATISFIED'],
  ['RUN 1','NOT CONSTITUTED'],
  ['RUN 1 DETERMINATION','NOT ISSUED'],
  ['NO DELTA','PRESERVED'],
  ['EXECUTION AUTHORITY','NONE']
];

const attempts = [
  ['USE ESGL-T0-TN-001 AS THE ORIGIN CHAIN ID','Existing test identity does not establish origin-chain identity.'],
  ['CREATE AN ID FROM THE PROPOSITION TEXT','Authoritative proposition text does not establish that a proposition identifier historically existed.'],
  ['ADD THE MISSING IDENTITIES NOW','A prospective identifier cannot establish retrospective historical continuity.'],
  ['CHANGE RUN 1 SO THE IDENTITIES ARE OPTIONAL','The examination contract was frozen before the evidence was evaluated.'],
  ['CONTINUE WITHOUT THE REQUIRED IDENTITIES','The frozen prerequisites are not satisfied. Run 1 cannot be constituted.']
];

export default function EliasTA14Examination(){
  const [attempt,setAttempt]=useState<number|null>(null);
  return <main className="page"><div className="shell">
    <nav><Link href="/showrooms">← TA-14 SHOWROOMS</Link><span>ELIAS SYSTEMS × TA-14 AUTHORITY · INTEROPERABILITY EXAMINATION</span></nav>
    <header>
      <p className="eyebrow">FROZEN EXAMINATION · HISTORICAL EVIDENCE · IDENTITY CONTINUITY</p>
      <h1>WHEN THE EXAMINATION<br/><em>REFUSES TO INVENT THE EVIDENCE.</em></h1>
      <p className="lede">Two independent governance architectures established a bounded examination, froze the rules, preserved the historical Elias record, and stopped when required identity continuity could not be established without retrospective construction.</p>
      <div className="heroRule">FREEZE THE RULES. PRESERVE THE RECORD. STOP WHERE THE EVIDENCE STOPS.</div>
    </header>

    <section className="panel">
      <p className="eyebrow">01 · THE PROPOSITION</p>
      <blockquote>“Historical validity does not, by itself, establish present governing standing at Tn after material delta-N.”</blockquote>
      <p>The Elias historical record preserved this proposition together with its T0 state and historical decision. The examination question was narrower: can that historical record enter the frozen Run 1 CONTROL exactly as it exists?</p>
    </section>

    <section className="split">
      <article className="panel"><p className="eyebrow">02 · FREEZE THE TEST FIRST</p><h2>Rules before evidence.</h2><p><b>Interactive Examination Object v1.0 — FROZEN</b></p><code>SHA-256 f91b6f64d6da70455cc37ab8949da57bf47fa03ebc527bcf43980b3f68e6e012</code><p><b>Run 1 Control Definition v1.0 — FROZEN</b></p><code>SHA-256 96548c722b08110d4c0464c54d62132a782ce928e04ab93aed08bcb474e6c711</code><p className="muted">The examination requirements were not rewritten after the Elias baseline recovery arrived.</p></article>
      <article className="panel"><p className="eyebrow">03 · WHAT ELIAS ESTABLISHED</p><h2>The historical object exists.</h2><dl><dt>OBJECT / TEST ID</dt><dd>ESGL-T0-TN-001</dd><dt>AUTHORITATIVE OBJECT</dt><dd>evidence/ESGL-T0-TN-001.json</dd><dt>ELIAS VERSION</dt><dd>1.0</dd><dt>FROZEN GIT COMMIT</dt><dd>3538a2647474f48f96b5212465e43fb30f770dca</dd><dt>FREEZE → HEAD DIFF</dt><dd>NONE</dd><dt>PRESERVED OBJECT SHA-256</dt><dd>390D7ABEB131113912C015B529988DF1FDCAA2B928A7EC8DD7DB5B6D12EEDD1A</dd><dt>HISTORICAL DECISION</dt><dd>ADMISSIBLE</dd></dl></article>
    </section>

    <section className="boundary">
      <p className="eyebrow">04 · THE BOUNDARY</p><h2>Two identities were not established.</h2>
      <div className="missing"><div><small>ORIGIN CHAIN ID</small><strong>NOT ESTABLISHED</strong></div><div><small>EXAMINED PROPOSITION ID</small><strong>NOT ESTABLISHED</strong></div></div>
      <p>Elias reported a final recovery pass across independently pre-existing records, including current text records, repository history and the relevant PDF corpus. Neither required identity was found. The existing test identity and proposition text were not substituted for the missing historical identities.</p>
    </section>

    <section className="panel interactive">
      <p className="eyebrow">05 · TRY TO MAKE IT PASS</p><h2>Can you make the examination continue?</h2><p>Choose a shortcut. The frozen boundary answers it.</p>
      <div className="attempts">{attempts.map(([label],i)=><button key={label} onClick={()=>setAttempt(i)}>{label}</button>)}</div>
      {attempt!==null&&<div className="receipt"><small>BOUNDARY RESPONSE</small><strong>{attempt===4?'RUN 1 NOT CONSTITUTED':'HOLD'}</strong><p>{attempts[attempt][1]}</p>{attempt===4&&<p className="muted">NOT CONSTITUTED ≠ DENY. No Run 1 existed from which a determination could issue.</p>}</div>}
    </section>

    <section className="panel"><p className="eyebrow">06 · FINAL EXAMINATION STATE</p><div className="status">{established.map(([a,b])=><div key={a}><span>{a}</span><strong className={b.includes('NOT')||b==='NONE'?'stop':'ok'}>{b}</strong></div>)}</div></section>

    <section className="cards">
      {[['NOT CONSTITUTED ≠ DENY','No Run 1 existed from which DENY could issue.'],['NOT CONSTITUTED ≠ ELIAS FAILED','The result concerns frozen examination prerequisites, not the validity of Elias as an architecture.'],['HISTORICAL VALIDITY ≠ PRESENT AUTHORITY','A preserved historical determination does not automatically establish authority for a new consequence.'],['MISSING IDENTITY ≠ PERMISSION TO INVENT IDENTITY','The examination cannot create the evidence required to admit itself.']].map(([h,p])=><article key={h}><h3>{h}</h3><p>{p}</p></article>)}
    </section>

    <section className="split">
      <article className="panel"><p className="eyebrow">07 · ELIAS DID NOT</p><ul><li>Backfill its historical object.</li><li>Rename fields to satisfy TA-14.</li><li>Invent an origin chain.</li><li>Invent a proposition identifier.</li></ul></article>
      <article className="panel"><p className="eyebrow">08 · TA-14 DID NOT</p><ul><li>Alter the frozen Run 1 contract.</li><li>Treat similar fields as automatically equivalent.</li><li>Turn NOT ESTABLISHED into FALSE.</li><li>Issue DENY without a constituted run.</li><li>Create execution authority.</li></ul></article>
    </section>

    <section className="lesson"><p className="eyebrow">09 · THE GOVERNANCE LESSON</p><h2>THE STOP IS THE DEMONSTRATION.</h2><p>A governance architecture is easiest to admire when it returns the answer somebody wanted. A stronger examination occurs when the available evidence cannot satisfy the frozen requirements. Then the question becomes: will the system preserve the boundary—or manufacture what it needs to continue?</p><div className="doctrine">RECORD ≠ CONTINUITY<br/>PROPOSITION ≠ PROPOSITION IDENTITY<br/>HISTORICAL VALIDITY ≠ PRESENT STANDING<br/>INSPECTION ≠ EXECUTION<br/>NOT CONSTITUTED ≠ DENY</div><h3>NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</h3></section>

    <section className="panel artifacts"><p className="eyebrow">10 · EXAMINATION ARTIFACTS</p><h2>Exact objects. Exact boundaries.</h2><p><b>Frozen Examination Object v1.0</b><br/><code>f91b6f64d6da70455cc37ab8949da57bf47fa03ebc527bcf43980b3f68e6e012</code></p><p><b>Frozen Run 1 Control Definition v1.0</b><br/><code>96548c722b08110d4c0464c54d62132a782ce928e04ab93aed08bcb474e6c711</code></p><p><b>Elias T0 source object</b><br/><code>ESGL-T0-TN-001</code></p><p className="muted">Independent architectures. Preserved records. No implied endorsement. No retrospective repair.</p></section>

    <footer><h2>EVIDENCE STOPS WHERE THE EVIDENCE STOPS.</h2><p>ELIAS SYSTEMS × TA-14 AUTHORITY</p><p>An interoperability examination of historical evidence, identity continuity, admissibility and the boundary before consequence.</p><p className="muted">Public examination record · Factual corrections invited · No endorsement, certification, approval or execution authorization implied.</p></footer>
  </div><style>{`
    .page{min-height:100vh;background:radial-gradient(circle at 85% 0,rgba(112,220,255,.13),transparent 28%),#02070c;color:#edf7fa;font-family:Inter,Arial,sans-serif}.shell{width:min(1200px,calc(100% - 36px));margin:auto}nav{min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:18px;border-bottom:1px solid rgba(255,255,255,.09);font-size:9px;font-weight:900;letter-spacing:.12em;color:#75909d}nav a{color:#9de8f7;text-decoration:none}header{padding:90px 0 62px}header h1{font-size:clamp(48px,7.8vw,98px);line-height:.9;letter-spacing:-.065em;margin:18px 0 28px}header h1 em{font-style:normal;color:#71f2b6}.eyebrow{font-size:10px;font-weight:950;letter-spacing:.19em;color:#70dcff}.lede{max-width:1000px;font-size:20px;line-height:1.7;color:#b3c7d0}.heroRule{margin-top:32px;padding:18px 22px;border:1px solid rgba(113,242,182,.3);background:rgba(113,242,182,.05);color:#71f2b6;font-size:11px;font-weight:950;letter-spacing:.1em}.panel,.boundary,.lesson{margin-top:18px;padding:clamp(25px,4.5vw,48px);border:1px solid rgba(112,220,255,.17);border-radius:22px;background:linear-gradient(145deg,rgba(7,29,42,.82),rgba(2,9,15,.96))}.panel h2,.boundary h2{font-size:clamp(30px,4vw,50px);letter-spacing:-.045em;margin:10px 0 20px}.panel p,.boundary p,.lesson p{color:#a9bdc7;line-height:1.7}.panel blockquote{margin:20px 0;padding:24px;border-left:3px solid #71f2b6;background:rgba(113,242,182,.04);font-size:clamp(23px,3.2vw,40px);font-weight:900;line-height:1.2}.split{display:grid;grid-template-columns:1fr 1fr;gap:18px}.split .panel{height:auto}code{overflow-wrap:anywhere;color:#9de8f7;font-size:11px}dl{display:grid;grid-template-columns:180px 1fr;gap:10px 18px}dt{color:#7895a2;font-size:9px;font-weight:950;letter-spacing:.1em}dd{margin:0;color:#e7f3f7;font-size:12px;overflow-wrap:anywhere}.muted{color:#718994!important;font-size:12px}.boundary{border-color:rgba(255,211,111,.28);background:linear-gradient(145deg,rgba(48,35,9,.24),rgba(2,9,15,.96))}.missing{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:25px 0}.missing div{padding:25px;border:1px solid rgba(255,211,111,.25);border-radius:15px;background:rgba(255,211,111,.04)}.missing small{display:block;color:#9b8c68;font-size:9px;font-weight:950;letter-spacing:.12em}.missing strong{display:block;margin-top:10px;color:#ffd36f;font-size:22px}.attempts{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.attempts button{cursor:pointer;text-align:left;padding:16px;border-radius:12px;border:1px solid rgba(112,220,255,.2);background:#030d15;color:#cde4ec;font-weight:900;font-size:11px}.attempts button:hover{border-color:#70dcff}.receipt{margin-top:18px;padding:28px;border-radius:17px;border:1px solid rgba(255,211,111,.35);background:rgba(255,211,111,.05)}.receipt small{display:block;color:#8e8164;font-weight:950;letter-spacing:.15em}.receipt strong{display:block;color:#ffd36f;font-size:clamp(40px,6vw,70px);letter-spacing:-.05em;margin:10px 0}.status{display:grid;gap:7px}.status div{display:flex;justify-content:space-between;gap:18px;padding:13px 15px;border:1px solid rgba(255,255,255,.07);border-radius:10px;background:rgba(0,0,0,.2);font-size:11px;font-weight:900}.ok{color:#71f2b6}.stop{color:#ffd36f}.cards{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:18px}.cards article{padding:25px;border:1px solid rgba(112,220,255,.14);border-radius:18px;background:#041019}.cards h3{color:#71f2b6;font-size:17px}.cards p,li{color:#9fb4be;line-height:1.65;font-size:13px}.lesson{text-align:center;border-color:rgba(113,242,182,.25)}.lesson h2{font-size:clamp(44px,7vw,88px);letter-spacing:-.06em;line-height:.9;margin:18px 0;color:#71f2b6}.lesson>p{max-width:900px;margin:20px auto}.doctrine{margin:30px auto;max-width:760px;padding:25px;border:1px solid rgba(112,220,255,.18);line-height:2;color:#d9edf3;font-weight:950;letter-spacing:.06em}.lesson h3{font-size:clamp(25px,4vw,48px)}.artifacts p{margin:24px 0}footer{text-align:center;padding:80px 0 100px}footer h2{font-size:clamp(38px,6vw,74px);letter-spacing:-.055em;margin:0 0 20px}footer>p{color:#9db1ba}@media(max-width:760px){nav{padding:18px 0;flex-wrap:wrap}.split,.cards,.missing,.attempts{grid-template-columns:1fr}dl{grid-template-columns:1fr;gap:4px}.status div{align-items:flex-start;flex-direction:column}header{padding-top:60px}}
  `}</style></main>
}