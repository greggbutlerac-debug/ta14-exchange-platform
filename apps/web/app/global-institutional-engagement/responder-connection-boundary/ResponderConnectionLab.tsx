'use client';

import { useState } from 'react';

type Mode = 'normal' | 'declared' | 'revoked' | 'stale' | 'conflict';

const states = {
  normal: {
    id: 'R1-01',
    title: 'No emergency declaration',
    inputs: 'No emergency declaration · ordinary responder identity · no emergency COMMAND connection.',
    expected: 'CP-01 may support bounded READ. CP-02 remains fixed but no emergency COMMAND connection is established.',
    connection: 'READ may remain available under ordinary policy. COMMAND is not established for emergency intervention.',
    cp: 'The Profiles remain unchanged and discoverable.',
    ta14: 'No emergency command reaches local commit.',
    result: 'NO EMERGENCY COMMAND PATH'
  },
  declared: {
    id: 'R1-02',
    title: 'Emergency declared',
    inputs: 'Emergency declaration present · named responder · bounded READ and COMMAND connections · defined duration.',
    expected: 'Connection policy may establish both connections without changing either Profile or pre-authorizing execution.',
    connection: 'Responder READ and COMMAND connections are established under their fixed Profiles for the named responder, bounded scope and defined duration.',
    cp: 'The Profiles do not change. Connection policy changes.',
    ta14: 'A command may now reach TA-14 — but it still requires an independent local consequence determination.',
    result: 'CONNECTED ≠ AUTHORIZED TO EXECUTE'
  },
  revoked: {
    id: 'R1-03',
    title: 'Emergency stands down',
    inputs: 'Stand-down recorded · prior emergency connection exists · COMMAND connection is narrowed, expired or revoked.',
    expected: 'Revocation changes the live connection, not CP-02. Prior connection state cannot silently preserve permission.',
    connection: 'The emergency COMMAND connection is revoked or narrowed when the declaration or operational need ends.',
    cp: 'The Responder Command Profile still exists. Only the live connection changes.',
    ta14: 'A later command arriving through an expired or revoked connection cannot inherit the old standing.',
    result: 'HOLD / DENY BEFORE COMMIT'
  },
  stale: {
    id: 'R1-04',
    title: 'Connection valid, context stale',
    inputs: 'Valid COMMAND connection · responder remains recognized · material building or incident context changes before commit.',
    expected: 'The governed connection may remain valid while the receiving domain independently re-examines the consequence.',
    connection: 'The responder remains correctly connected under a valid COMMAND Profile, but building or incident context materially changes before commit.',
    cp: 'CNS/CP can remain valid on its own terms.',
    ta14: 'TA-14 re-tests Admissible Evidence, Applicable Authority and Established Standing at the local commit boundary.',
    result: 'VALID CONNECTION · LOCAL HOLD'
  },
  conflict: {
    id: 'R1-05',
    title: 'Authority context conflicts',
    inputs: 'Valid connection · recognized responder · incoming authority context conflicts with a local restriction, asset state or competent-authority record.',
    expected: 'The crossing remains attributable and governed, but the conflict is not resolved by transport or connection validity.',
    connection: 'The connection is valid and the responder is recognized, but incoming authority context conflicts with a local restriction, asset state or competent authority record.',
    cp: 'The Profile and connection still do their job: the request arrived through the governed interaction.',
    ta14: 'The receiving domain does not inherit execution authority from transport. It can HOLD, DENY or ESCALATE.',
    result: 'CROSSING IS NOT COMMITMENT'
  }
};

export default function ResponderConnectionLab(){
  const [mode,setMode] = useState<Mode>('declared');
  const s = states[mode];
  return <section className="lab">
    <p className="eye">R1 EXAMINATION HARNESS · INTERACTIVE · PRE-FREEZE</p>
    <h2>Keep the Profiles fixed. <em>Change reality.</em></h2>
    <p className="intro">These are proposed examination cases, not executed results. CP-01 and CP-02 remain CANDIDATE / NOT FROZEN / NOT REGISTERED until CNS/CP representation is corrected and the test is frozen.</p>
    <div className="status"><span>CP-01 FIXED CANDIDATE</span><span>CP-02 FIXED CANDIDATE</span><span>OBSERVATION PENDING</span></div>
    <div className="buttons" role="group" aria-label="Choose R1 examination case">
      <button className={mode==='normal'?'active':''} onClick={()=>setMode('normal')}>R1-01 · No emergency</button>
      <button className={mode==='declared'?'active':''} onClick={()=>setMode('declared')}>R1-02 · Emergency declared</button>
      <button className={mode==='revoked'?'active':''} onClick={()=>setMode('revoked')}>R1-03 · Stand-down</button>
      <button className={mode==='stale'?'active':''} onClick={()=>setMode('stale')}>R1-04 · Context changes</button>
      <button className={mode==='conflict'?'active':''} onClick={()=>setMode('conflict')}>R1-05 · Authority conflict</button>
    </div>
    <div className="state" aria-live="polite">
      <small>{s.id} · SELECTED EXAMINATION CASE</small><h3>{s.title}</h3>
      <div className="examrow">
        <article><b>MANIPULATED INPUTS</b><p>{s.inputs}</p></article>
        <article><b>EXPECTED OBSERVATION</b><p>{s.expected}</p></article>
      </div>
      <div className="cols">
        <article><b>CONNECTION POLICY</b><p>{s.connection}</p></article>
        <article><b>CNS/CP</b><p>{s.cp}</p></article>
        <article><b>TA-14 LOCAL COMMIT</b><p>{s.ta14}</p></article>
      </div>
      <div className="result">{s.result}</div>
      <div className="pending"><b>ACTUAL OBSERVATION</b><p>NOT RUN · No result or durable receipt may be claimed until the candidate Profiles are corrected, frozen and the examination is executed.</p></div>
    </div>
    <div className="immutables">
      <article><b>FROZEN VARIABLES — AFTER FREEZE</b><p>CP-01 READ · CP-02 COMMAND · profile purpose · interaction shape · required fields · negative-space boundary.</p></article>
      <article><b>MANIPULATED VARIABLES</b><p>Declaration · named connection · parties · instance scope · duration · revocation · authority context · present reality.</p></article>
      <article><b>OBSERVED VARIABLE</b><p>Whether the receiving domain still performs an independent ALLOW / HOLD / DENY / ESCALATE consequence determination.</p></article>
    </div>
    <div className="falsifier">
      <p className="eye">FALSIFIABLE PROPOSITION</p>
      <h3>The crossing must not silently become the permission.</h3>
      <p><b>FAIL:</b> changing the live connection or authority context automatically changes local permission to execute without an independent receiving-domain determination.</p>
      <p><b>SUPPORTED:</b> the fixed Profiles can survive changing connections and context while the receiving domain independently determines whether the proposed consequence may become reality now.</p>
    </div>
    <style>{`
      .lab{padding:76px 0;border-top:1px solid #ffffff12}.eye{color:#65ddff;font-size:10px;font-weight:950;letter-spacing:.18em}.lab h2{font-size:clamp(37px,5.3vw,66px);line-height:1.03;letter-spacing:-.045em;max-width:1000px;margin:12px 0 18px}.lab h2 em{font-style:normal;color:#ffcf60}.intro{max-width:960px;color:#a8bac4;font-size:17px;line-height:1.65}.status{display:flex;gap:8px;flex-wrap:wrap;margin:22px 0}.status span{border:1px solid #65ddff42;background:#65ddff0b;color:#9ceaff;border-radius:999px;padding:8px 11px;font-size:8px;font-weight:950;letter-spacing:.1em}.buttons{display:flex;gap:8px;flex-wrap:wrap;margin:24px 0 12px}.buttons button{cursor:pointer;border:1px solid #ffffff20;background:#081823;color:#b7cad4;border-radius:999px;padding:12px 15px;font-size:10px;font-weight:950}.buttons button.active{border-color:#ffd35f;background:#ffd35f;color:#172027}.state{padding:28px;border:1px solid #ffffff18;border-radius:22px;background:linear-gradient(135deg,#07151f,#09131d)}.state>small{color:#718c9a;font-size:8px;font-weight:950;letter-spacing:.13em}.state>h3{font:38px/1.08 Georgia,serif;margin:8px 0 22px}.examrow,.cols{display:grid;gap:10px}.examrow{grid-template-columns:repeat(2,1fr);margin-bottom:10px}.cols{grid-template-columns:repeat(3,1fr)}.examrow article,.cols article,.immutables article,.pending{padding:19px;border:1px solid #ffffff13;border-radius:13px;background:#ffffff05}.examrow b,.cols b,.immutables b,.pending b{color:#74dfff;font-size:9px;letter-spacing:.11em}.examrow p,.cols p,.immutables p,.pending p{color:#9fb2bd;font-size:12px;line-height:1.62}.result{margin-top:16px;padding:18px;border:1px solid #ffd35f45;border-radius:12px;background:#ffd35f09;color:#fff0ad;font-size:clamp(18px,2.4vw,27px);font-weight:950;letter-spacing:.02em}.pending{margin-top:10px;border-color:#ffcf6030}.pending b{color:#ffcf60}.immutables{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}.falsifier{margin-top:18px;padding:28px;border:1px solid #ffcf6035;border-radius:20px;background:#ffcf6007}.falsifier h3{font:30px/1.1 Georgia,serif;margin:8px 0 16px}.falsifier p:not(.eye){color:#a8bac4;line-height:1.65}.falsifier b{color:#fff0ad}@media(max-width:780px){.examrow,.cols,.immutables{grid-template-columns:1fr}}
    `}</style>
  </section>
}
