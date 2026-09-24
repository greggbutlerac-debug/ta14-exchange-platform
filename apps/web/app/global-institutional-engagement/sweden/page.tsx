'use client';

import Link from 'next/link';
import { useState } from 'react';

const flow = [
  ['1','REAL-TIME SIGNAL','NO₂, SO₂ or ground-level ozone indicates an alert-threshold exceedance.'],
  ['2','TIME CONDITION','The exceedance must persist for three consecutive hours.'],
  ['3','AREA CONDITION','The affected area must be representative and cover at least 100 km².'],
  ['4','ACTION-PLAN REQUIREMENT','If the statutory conditions are met, the short-term action-plan requirement applies.'],
  ['5','PRACTICAL CHECK','The EPA noted that responsible measurement authorities would reasonably first verify that the exceedance is not caused by instrument malfunction.'],
];

export const metadata = {
  title: 'Sweden · From Air-Quality Evidence to Action | TA-14',
  description: 'A bounded public technical record of the Swedish EPA response on real-time air-quality evidence, verification, short-term action plans and the remaining execution-boundary question.',
};

export default function SwedenPage() {
  const [scenario, setScenario] = useState<'normal'|'fault'|'conflict'|'changed'>('normal');
  const scenarios = {
    normal: { title:'Evidence remains valid', sweden:'Sweden continues through its existing legal and operational process.', ta14:'TA-14 preserves the evidence, authority, standing and execution record. No Swedish process is replaced.', result:'ALLOW can remain supportable if the native authority conditions remain established.' },
    fault: { title:'Instrument fault discovered', sweden:'A reading that helped establish the action state is later found to be unreliable.', ta14:'The layer detects that the evidence supporting the pending consequence has materially changed and requires revalidation before execution.', result:'HOLD the consequence until the native Swedish evidence state is re-established.' },
    conflict: { title:'Measurements conflict', sweden:'A second authoritative measurement conflicts with the evidence that supported the earlier action state.', ta14:'The layer preserves both records, identifies the unresolved contradiction and prevents stale authority from silently carrying forward.', result:'HOLD or ESCALATE under the locally established Swedish authority path.' },
    changed: { title:'Conditions change before execution', sweden:'The evidence was valid when the action state was established, but relevant conditions change before the consequence occurs.', ta14:'The layer asks the governing question again at the execution boundary instead of assuming the earlier state remains sufficient.', result:'Revalidate now; the earlier decision is not treated as permanent permission.' },
  };
  const active = scenarios[scenario];
  return (
    <main className="page">
      <div className="shell">
        <nav>
          <Link href="/global-institutional-engagement">← GLOBAL INSTITUTIONAL ENGAGEMENT</Link>
          <Link className="brand" href="/"><span>TA-14</span> AUTHORITY</Link>
        </nav>

        <header>
          <div className="country">
            <span className="flag">🇸🇪</span>
            <div>
              <b>SWEDEN</b>
              <small>SWEDISH ENVIRONMENTAL PROTECTION AGENCY · AIR QUALITY UNIT</small>
            </div>
          </div>

          <p className="eyebrow">PUBLIC TECHNICAL RECORD · CASE NV202670253</p>
          <h1>The question is now <em>smaller.</em></h1>
          <p className="lead">
            Sweden has now identified a concrete path from real-time air-quality evidence to legally consequential action.
            TA-14 is no longer asking whether that path exists. We are asking what governs the final boundary between an
            established action state and the moment a specific consequence is executed.
          </p>

          <div className="status">
            <b>SUBSTANTIVE EPA RESPONSE RECEIVED</b>
            <b>NATIVE SWEDISH PATH IDENTIFIED</b>
            <b>NO GAP PRESUMED</b>
            <b>ONE EXECUTION-BOUNDARY QUESTION REMAINS</b>
          </div>
        </header>

        <section className="answer">
          <p className="eyebrow">WHAT SWEDEN TOLD US · 24 SEPTEMBER 2026</p>
          <h2>Real-time evidence can lead to action — but not by itself.</h2>
          <p className="copy">
            The Swedish EPA explained that a short-term action plan is required when alert thresholds for nitrogen dioxide,
            sulphur dioxide or ground-level ozone are exceeded under the conditions established by the EU Ambient Air Quality
            Directive and Sweden's Air Quality Ordinance (SFS 2010:477).
          </p>

          <div className="flow">
            {flow.map(([n,t,d]) => (
              <article key={n}>
                <span>{n}</span>
                <b>{t}</b>
                <p>{d}</p>
              </article>
            ))}
          </div>

          <div className="plain">
            <b>IN PLAIN LANGUAGE</b>
            <p>
              A sensor reading does not automatically become permission to act. The statutory pathway includes threshold, time and area conditions. The EPA separately noted that responsible measurement authorities would reasonably first verify that an apparent exceedance is not caused by instrument malfunction.
            </p>
          </div>
        </section>

        <section>
          <p className="eyebrow">TA-14 · WHAT IS NOW ESTABLISHED</p>
          <h2>The evidence-to-action pathway is real.</h2>
          <div className="two">
            <article>
              <b>SWEDEN HAS ESTABLISHED</b>
              <p>Real-time measurements can participate in a legally consequential pathway.</p>
              <p>The relevant alert condition is not a single isolated reading.</p>
              <p>Temporal and spatial conditions must be satisfied.</p>
              <p>The EPA identified instrument malfunction as a practical verification concern; TA-14 is asking whether that check has a defined native procedural home.</p>
            </article>
            <article>
              <b>TA-14 IS NOT CLAIMING</b>
              <p>That Sweden lacks air-quality governance.</p>
              <p>That TA-14 replaces Swedish law, monitoring or measurement authority.</p>
              <p>That the Swedish EPA has endorsed, adopted or validated TA-14.</p>
              <p>That a governance gap has already been demonstrated.</p>
            </article>
          </div>
        </section>

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
            <button className={scenario==='normal'?'active':''} onClick={()=>setScenario('normal')}>Evidence holds</button>
            <button className={scenario==='fault'?'active':''} onClick={()=>setScenario('fault')}>Instrument fault</button>
            <button className={scenario==='conflict'?'active':''} onClick={()=>setScenario('conflict')}>Conflicting data</button>
            <button className={scenario==='changed'?'active':''} onClick={()=>setScenario('changed')}>Conditions change</button>
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
        </section>

        <section className="questionSection">
          <p className="eyebrow">THE ONE QUESTION THAT REMAINS</p>
          <h2>What happens if the evidence changes <em>after</em> the action state is established?</h2>
          <div className="question">
            <p>
              Assume the legal threshold conditions have been satisfied and a short-term action plan has been activated.
            </p>
            <p>
              Before a particular action is executed, new information appears: an instrument problem, conflicting measurement,
              changed spatial representativeness, or another material change in the evidentiary basis.
            </p>
            <strong>
              What Swedish mechanism requires that earlier action state to be revalidated, constrained, suspended or withdrawn before execution?
            </strong>
          </div>
        </section>

        <section>
          <p className="eyebrow">WHY TA-14 CARES ABOUT THIS BOUNDARY</p>
          <h2>Evidence can support a decision without remaining sufficient forever.</h2>
          <div className="chain">
            {['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'].map(x => <span key={x}>{x}</span>)}
          </div>
          <p className="copy">
            TA-14 separates the existence of evidence from the authority to create a consequence from it. The remaining Swedish
            question sits between <strong>COMMIT</strong> and <strong>EXECUTION</strong>: what forces the system to check again when
            the basis for action materially changes before the action becomes reality?
          </p>
        </section>

        <section>
          <p className="eyebrow">NEXT TECHNICAL CLARIFICATION</p>
          <h2>We only need to identify the native Swedish control.</h2>
          <div className="next">
            <p><strong>1.</strong> Is the instrument-malfunction verification governed by a defined Swedish procedure, reference method, quality-assurance protocol or responsible authority?</p>
            <p><strong>2.</strong> If material evidence changes after activation but before execution, what native rule causes revalidation, suspension, withdrawal or escalation?</p>
            <p><strong>3.</strong> If Sweden already governs both points, TA-14 should document that control accurately rather than claim a gap.</p>
          </div>
        </section>

        <section className="timeline">
          <p className="eyebrow">INSTITUTIONAL CONTINUITY</p>
          <div className="rows">
            <article><span>18 SEP 2026</span><b>TA-14 → SWEDISH EPA / SMHI</b><p>Asked what gives near-real-time evidence sufficient status to support consequential action, and what requires revalidation if conditions change before execution.</p></article>
            <article><span>24 SEP 2026</span><b>SWEDISH EPA AIR QUALITY UNIT → TA-14</b><p>Identified the statutory alert-threshold pathway, the three-hour and 100 km² conditions, and the practical need to verify that an apparent exceedance is not caused by instrument malfunction.</p></article>
            <article><span>NEXT</span><b>BOUNDED CLARIFICATION</b><p>Identify the Swedish verification and revalidation control at the execution boundary.</p></article>
          </div>
        </section>

        <footer>
          <b>SWEDEN × TA-14 AUTHORITY</b><br/>
          BOUNDED PUBLIC TECHNICAL RECORD · NO ENDORSEMENT OR ADOPTION CLAIMED<br/>
          <span>No admissible evidence. No admissible execution.</span>
        </footer>
      </div>

      <style>{`
        *{box-sizing:border-box}.page{min-height:100vh;background:radial-gradient(circle at 15% 0%,rgba(31,103,177,.24),transparent 32%),linear-gradient(180deg,#03101a,#071721 48%,#02090e);color:#eff7fb;font-family:Arial,sans-serif}.shell{width:min(1120px,calc(100% - 34px));margin:auto}nav{height:74px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff14}nav a{text-decoration:none;color:#dbeaf2;font-size:10px;font-weight:900;letter-spacing:.1em}.brand{font-size:17px!important}.brand span,.eyebrow{color:#77bff2}header{padding:64px 0 56px}.country{display:flex;align-items:center;gap:14px;margin-bottom:38px}.flag{font-size:44px}.country b{display:block;font-size:14px}.country small{display:block;margin-top:4px;color:#8ba5b4;font-size:9px;font-weight:800;letter-spacing:.08em}.eyebrow{font-size:10px;font-weight:950;letter-spacing:.17em}h1{max-width:900px;margin:14px 0 22px;font:clamp(54px,8vw,94px)/.94 Georgia,serif;letter-spacing:-.045em}h1 em,h2 em{color:#ffd34e;font-style:normal}.lead,.copy{max-width:900px;color:#a8bbc6;font-size:16px;line-height:1.75}.status{display:flex;gap:8px;flex-wrap:wrap;margin-top:28px}.status b{padding:8px 11px;border:1px solid #77bff23d;border-radius:999px;color:#cfeaff;font-size:8px;letter-spacing:.08em}section{padding:62px 0;border-top:1px solid #ffffff12}h2{max-width:900px;margin:10px 0 26px;font:clamp(35px,5vw,58px)/1.04 Georgia,serif}.flow{display:grid;grid-template-columns:repeat(5,1fr);gap:9px;margin-top:28px}.flow article,.two article,.next,.question,.plain{border:1px solid #ffffff14;border-radius:16px;background:#071722cc}.flow article{padding:20px;min-height:190px}.flow span{display:block;color:#ffd34e;font:28px Georgia,serif;margin-bottom:16px}.flow b,.two b,.plain b{font-size:9px;letter-spacing:.1em;color:#83c9f5}.flow p,.two p,.next p{color:#91a7b4;font-size:12px;line-height:1.65}.plain{margin-top:18px;padding:24px;border-color:#ffd34e40;background:#392f0c2b}.plain p{margin:8px 0 0;color:#d6d2b7;font:19px/1.55 Georgia,serif}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}.two article{padding:25px}.questionSection{background:linear-gradient(135deg,#ffffff04,#ffd34e08);margin:0 -18px;padding-left:18px;padding-right:18px}.question{padding:30px;border-color:#ffd34e55}.question p{color:#a8bbc6;font-size:15px;line-height:1.65}.question strong{display:block;margin-top:22px;color:#fff5bc;font:24px/1.45 Georgia,serif}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;margin:28px 0}.chain span{padding:12px 5px;text-align:center;border:1px solid #77bff22d;border-radius:8px;color:#9fd5f5;font-size:8px;font-weight:900}.next{padding:26px;max-width:900px}.next strong{color:#ffd34e}.layerStack{display:grid;gap:10px;margin:28px 0}.native,.taLayer{padding:24px;border-radius:16px}.native{border:1px solid #ffffff1f;background:#ffffff07}.taLayer{border:2px solid #ffd34e66;background:#ffd34e0b}.native>b,.taLayer>b{font-size:9px;letter-spacing:.12em}.native>b{color:#a9c2cf}.taLayer>b{color:#ffd34e}.nativeFlow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:18px}.nativeFlow span{padding:9px 11px;border:1px solid #ffffff1c;border-radius:8px;font-size:9px;font-weight:900}.nativeFlow i{color:#607987;font-style:normal}.taLayer p{margin:12px 0 0;color:#d7d4bd;line-height:1.6}.scenarioButtons{display:flex;gap:8px;flex-wrap:wrap;margin:24px 0 12px}.scenarioButtons button{cursor:pointer;border:1px solid #ffffff20;background:#0b1d28;color:#b8c9d2;border-radius:999px;padding:11px 15px;font-size:10px;font-weight:900}.scenarioButtons button.active{border-color:#ffd34e;background:#ffd34e;color:#172027}.scenarioPanel{border:1px solid #ffffff18;border-radius:18px;background:#06131c;padding:26px}.scenarioHead small{color:#6e8998;font-size:8px;font-weight:900;letter-spacing:.12em}.scenarioHead h3{font:30px/1.1 Georgia,serif;margin:7px 0 20px}.three{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.three article{padding:18px;border-radius:12px;background:#ffffff06;border:1px solid #ffffff12}.three b{color:#83c9f5;font-size:9px;letter-spacing:.1em}.three p{color:#9fb1bb;font-size:12px;line-height:1.6}.notReplacement{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:12px;align-items:stretch;margin-top:22px}.notReplacement>div{padding:20px;border:1px solid #ffffff14;border-radius:14px;background:#ffffff05}.notReplacement>span{align-self:center;color:#ffd34e;font:28px Georgia,serif}.notReplacement strong{font-size:9px;color:#ffd34e;letter-spacing:.1em}.notReplacement p{color:#91a7b4;font-size:11px;line-height:1.6;margin-bottom:0}.rows{display:grid;gap:10px}.rows article{display:grid;grid-template-columns:130px 250px 1fr;gap:18px;padding:17px 18px;border:1px solid #ffffff14;border-radius:12px;background:#ffffff05}.rows span{color:#ffd34e;font-size:10px;font-weight:900}.rows b{font-size:10px;color:#d9e9f1}.rows p{margin:0;color:#91a7b4;font-size:11px;line-height:1.55}footer{padding:44px 0 72px;border-top:1px solid #ffffff12;color:#718994;font-size:9px;line-height:1.8}footer span{color:#ffd34e}@media(max-width:900px){.flow{grid-template-columns:1fr}.two,.three{grid-template-columns:1fr}.chain{grid-template-columns:repeat(2,1fr)}.notReplacement{grid-template-columns:1fr}.notReplacement>span{text-align:center}.nativeFlow i{display:none}}@media(max-width:760px){.rows article{grid-template-columns:1fr;gap:6px}h1{font-size:52px}}
      `}</style>
    </main>
  );
}
