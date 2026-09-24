'use client';

import { useState } from 'react';

type Mode = 'normal' | 'declared' | 'revoked' | 'stale' | 'conflict';

const states = {
  normal: {
    title: 'No emergency declaration',
    connection: 'READ may remain available under ordinary policy. COMMAND is not established for emergency intervention.',
    cp: 'The Profiles remain unchanged and discoverable.',
    ta14: 'No emergency command reaches local commit.',
    result: 'NO EMERGENCY COMMAND PATH'
  },
  declared: {
    title: 'Emergency declared',
    connection: 'Responder READ and COMMAND connections are established under their fixed Profiles for the named responder, bounded scope and defined duration.',
    cp: 'The Profiles do not change. Connection policy changes.',
    ta14: 'A command may now reach TA-14 — but it still requires an independent local consequence determination.',
    result: 'CONNECTED ≠ AUTHORIZED TO EXECUTE'
  },
  revoked: {
    title: 'Emergency stands down',
    connection: 'The emergency COMMAND connection is revoked or narrowed when the declaration or operational need ends.',
    cp: 'The Responder Command Profile still exists. Only the live connection changes.',
    ta14: 'A later command arriving through an expired or revoked connection cannot inherit the old standing.',
    result: 'HOLD / DENY BEFORE COMMIT'
  },
  stale: {
    title: 'Connection valid, context stale',
    connection: 'The responder remains correctly connected under a valid COMMAND Profile, but building or incident context materially changes before commit.',
    cp: 'CNS/CP can remain valid on its own terms.',
    ta14: 'TA-14 re-tests Admissible Evidence, Applicable Authority and Established Standing at the local commit boundary.',
    result: 'VALID CONNECTION · LOCAL HOLD'
  },
  conflict: {
    title: 'Authority context conflicts',
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
    <p className="eye">RUN THE SEAM · INTERACTIVE</p>
    <h2>Change the situation. <em>Watch which layer moves.</em></h2>
    <p className="intro">The Profiles stay fixed. The connection policy can change. TA-14 remains independent at the local commit boundary.</p>
    <div className="buttons" role="group" aria-label="Choose responder scenario">
      <button className={mode==='normal'?'active':''} onClick={()=>setMode('normal')}>No emergency</button>
      <button className={mode==='declared'?'active':''} onClick={()=>setMode('declared')}>Emergency declared</button>
      <button className={mode==='revoked'?'active':''} onClick={()=>setMode('revoked')}>Stand-down / revoke</button>
      <button className={mode==='stale'?'active':''} onClick={()=>setMode('stale')}>Context changes</button>
      <button className={mode==='conflict'?'active':''} onClick={()=>setMode('conflict')}>Authority conflict</button>
    </div>
    <div className="state" aria-live="polite">
      <small>SELECTED STATE</small><h3>{s.title}</h3>
      <div className="cols">
        <article><b>CONNECTION POLICY</b><p>{s.connection}</p></article>
        <article><b>CNS/CP</b><p>{s.cp}</p></article>
        <article><b>TA-14 LOCAL COMMIT</b><p>{s.ta14}</p></article>
      </div>
      <div className="result">{s.result}</div>
    </div>
    <div className="immutables">
      <article><b>STAYS FIXED</b><p>Profile name · purpose · interaction shape · discoverability · reusable contract definition.</p></article>
      <article><b>CAN CHANGE</b><p>Named connection · parties · current scope · duration · emergency context · revocation state.</p></article>
      <article><b>REMAINS LOCAL</b><p>Whether this exact consequence may cross the receiving domain's commit boundary now.</p></article>
    </div>
    <style jsx>{`
      .lab{padding:66px 0;border-top:1px solid #ffffff12}.eye{color:#74dfff;font-size:10px;font-weight:950;letter-spacing:.18em}.lab h2{font-size:clamp(32px,4.8vw,58px);line-height:1.03;letter-spacing:-.045em;max-width:1000px;margin:12px 0 18px}.lab h2 em{font-style:normal;color:#ffd35f}.intro{max-width:900px;color:#a8bac4;font-size:17px;line-height:1.65}.buttons{display:flex;gap:8px;flex-wrap:wrap;margin:24px 0 12px}.buttons button{cursor:pointer;border:1px solid #ffffff20;background:#081823;color:#b7cad4;border-radius:999px;padding:12px 15px;font-size:10px;font-weight:950}.buttons button.active{border-color:#ffd35f;background:#ffd35f;color:#172027}.state{padding:28px;border:1px solid #ffffff18;border-radius:20px;background:linear-gradient(135deg,#07151f,#09131d)}.state>small{color:#718c9a;font-size:8px;font-weight:950;letter-spacing:.13em}.state>h3{font:32px/1.08 Georgia,serif;margin:8px 0 22px}.cols{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.cols article,.immutables article{padding:19px;border:1px solid #ffffff13;border-radius:13px;background:#ffffff05}.cols b,.immutables b{color:#74dfff;font-size:9px;letter-spacing:.11em}.cols p,.immutables p{color:#9fb2bd;font-size:12px;line-height:1.62}.result{margin-top:16px;padding:18px;border:1px solid #ffd35f45;border-radius:12px;background:#ffd35f09;color:#fff0ad;font-size:clamp(18px,2.4vw,27px);font-weight:950;letter-spacing:.02em}.immutables{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}@media(max-width:780px){.cols,.immutables{grid-template-columns:1fr}}
    `}</style>
  </section>
}
