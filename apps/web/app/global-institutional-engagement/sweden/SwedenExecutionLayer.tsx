'use client';

import { useState } from 'react';

export default function SwedenExecutionLayer() {
  const [scenario, setScenario] = useState<'normal'|'fault'|'conflict'|'changed'>('normal');
  const scenarios = {
    normal: { title:'Evidence remains valid', sweden:'Sweden continues through its existing legal and operational process.', ta14:'TA-14 preserves the evidence, authority, standing and execution record. No Swedish process is replaced.', result:'ALLOW can remain supportable if the native authority conditions remain established.' },
    fault: { title:'Instrument fault discovered', sweden:'A reading that helped establish the action state is later found to be unreliable.', ta14:'The layer detects that the evidence supporting the pending consequence has materially changed and requires revalidation before execution.', result:'HOLD the consequence until the native Swedish evidence state is re-established.' },
    conflict: { title:'Measurements conflict', sweden:'A second authoritative measurement conflicts with the evidence that supported the earlier action state.', ta14:'The layer preserves both records, identifies the unresolved contradiction and prevents stale authority from silently carrying forward.', result:'HOLD or ESCALATE under the locally established Swedish authority path.' },
    changed: { title:'Conditions change before execution', sweden:'The evidence was valid when the action state was established, but relevant conditions change before the consequence occurs.', ta14:'The layer asks the governing question again at the execution boundary instead of assuming the earlier state remains sufficient.', result:'Revalidate now; the earlier decision is not treated as permanent permission.' },
  } as const;
  const active = scenarios[scenario];

  return (
    <section className="layerDemo">
      <p className="eyebrow">SEE THE BOUNDARY · INTERACTIVE</p>
      <h2>Sweden stays Sweden. TA-14 sits <em>around the consequence.</em></h2>
      <p className="copy">Nothing in Sweden's monitoring, law, thresholds, competent authorities, QA/QC or action plans has to be replaced. TA-14 is an additional governance layer that keeps asking whether the evidence and authority supporting a pending consequence are still sufficient <strong>now</strong>.</p>

      <div className="layerStack">
        <div className="native">
          <b>SWEDEN · EXISTING SYSTEM — UNCHANGED</b>
          <div className="nativeFlow"><span>MEASURE</span><i>→</i><span>THRESHOLD</span><i>→</i><span>3 HOURS</span><i>→</i><span>≥100 km²</span><i>→</i><span>ACTION PLAN</span><i>→</i><span>EXECUTE</span></div>
        </div>
        <div className="taLayer">
          <b>TA-14 · ADDITIVE EXECUTION-INTEGRITY LAYER</b>
          <p>At the boundary before consequence: <strong>Does this proposed consequence still have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</strong></p>
        </div>
      </div>

      <div className="scenarioButtons" role="group" aria-label="Choose a scenario">
        <button type="button" className={scenario==='normal'?'active':''} onClick={()=>setScenario('normal')}>Evidence holds</button>
        <button type="button" className={scenario==='fault'?'active':''} onClick={()=>setScenario('fault')}>Instrument fault</button>
        <button type="button" className={scenario==='conflict'?'active':''} onClick={()=>setScenario('conflict')}>Conflicting data</button>
        <button type="button" className={scenario==='changed'?'active':''} onClick={()=>setScenario('changed')}>Conditions change</button>
      </div>

      <div className="scenarioPanel" aria-live="polite">
        <div className="scenarioHead"><small>SELECTED SCENARIO</small><h3>{active.title}</h3></div>
        <div className="three">
          <article><b>WHAT CAN HAPPEN</b><p>{active.sweden}</p></article>
          <article><b>WHAT TA-14 ADDS</b><p>{active.ta14}</p></article>
          <article><b>EXECUTION EFFECT</b><p>{active.result}</p></article>
        </div>
      </div>

      <div className="notReplacement">
        <div><strong>SWEDEN KEEPS</strong><p>Its sensors · methods · QA/QC · environmental law · thresholds · competent authorities · decision rights · action plans.</p></div>
        <span>+</span>
        <div><strong>TA-14 ADDS</strong><p>Continuity · admissibility · authority binding · standing · revalidation · bounded determination · execution receipt.</p></div>
        <span>=</span>
        <div><strong>THE POINT</strong><p>No replacement architecture. A layer that helps prevent yesterday's valid evidence or authority from becoming today's unauthorized consequence.</p></div>
      </div>

      <style jsx>{`
        .layerStack{display:grid;gap:10px;margin:28px 0}.native,.taLayer{padding:24px;border-radius:16px}.native{border:1px solid #ffffff1f;background:#ffffff07}.taLayer{border:2px solid #ffd34e66;background:#ffd34e0b}.native>b,.taLayer>b{font-size:9px;letter-spacing:.12em}.native>b{color:#a9c2cf}.taLayer>b{color:#ffd34e}.nativeFlow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:18px}.nativeFlow span{padding:9px 11px;border:1px solid #ffffff1c;border-radius:8px;font-size:9px;font-weight:900}.nativeFlow i{color:#607987;font-style:normal}.taLayer p{margin:12px 0 0;color:#d7d4bd;line-height:1.6}.scenarioButtons{display:flex;gap:8px;flex-wrap:wrap;margin:24px 0 12px}.scenarioButtons button{cursor:pointer;border:1px solid #ffffff20;background:#0b1d28;color:#b8c9d2;border-radius:999px;padding:11px 15px;font-size:10px;font-weight:900}.scenarioButtons button.active{border-color:#ffd34e;background:#ffd34e;color:#172027}.scenarioPanel{border:1px solid #ffffff18;border-radius:18px;background:#06131c;padding:26px}.scenarioHead small{color:#6e8998;font-size:8px;font-weight:900;letter-spacing:.12em}.scenarioHead h3{font:30px/1.1 Georgia,serif;margin:7px 0 20px}.three{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.three article{padding:18px;border-radius:12px;background:#ffffff06;border:1px solid #ffffff12}.three b{color:#83c9f5;font-size:9px;letter-spacing:.1em}.three p{color:#9fb1bb;font-size:12px;line-height:1.6}.notReplacement{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:12px;align-items:stretch;margin-top:22px}.notReplacement>div{padding:20px;border:1px solid #ffffff14;border-radius:14px;background:#ffffff05}.notReplacement>span{align-self:center;color:#ffd34e;font:28px Georgia,serif}.notReplacement strong{font-size:9px;color:#ffd34e;letter-spacing:.1em}.notReplacement p{color:#91a7b4;font-size:11px;line-height:1.6;margin-bottom:0}@media(max-width:900px){.three{grid-template-columns:1fr}.notReplacement{grid-template-columns:1fr}.notReplacement>span{text-align:center}.nativeFlow i{display:none}}
      `}</style>
    </section>
  );
}
