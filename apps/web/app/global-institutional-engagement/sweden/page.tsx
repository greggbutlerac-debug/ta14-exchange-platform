import Link from 'next/link';

const flow = [
  ['1','REAL-TIME SIGNAL','NO₂, SO₂ or ground-level ozone indicates an alert-threshold exceedance.'],
  ['2','TIME CONDITION','The exceedance must persist for three consecutive hours.'],
  ['3','AREA CONDITION','The affected area must be representative and cover at least 100 km².'],
  ['4','VERIFY','The responsible measurement authority would reasonably verify that the exceedance is not caused by instrument malfunction.'],
  ['5','CONSEQUENCE','If the legal conditions are met, the short-term action-plan requirement applies.'],
];

export const metadata = {
  title: 'Sweden · From Air-Quality Evidence to Action | TA-14',
  description: 'A bounded public technical record of the Swedish EPA response on real-time air-quality evidence, verification, short-term action plans and the remaining execution-boundary question.',
};

export default function SwedenPage() {
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
              A sensor reading does not automatically become permission to act. The reading must satisfy time, area,
              legal and verification conditions before the consequence is established.
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
              <p>Instrument malfunction is a verification concern before relying on the exceedance.</p>
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
        *{box-sizing:border-box}.page{min-height:100vh;background:radial-gradient(circle at 15% 0%,rgba(31,103,177,.24),transparent 32%),linear-gradient(180deg,#03101a,#071721 48%,#02090e);color:#eff7fb;font-family:Arial,sans-serif}.shell{width:min(1120px,calc(100% - 34px));margin:auto}nav{height:74px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff14}nav a{text-decoration:none;color:#dbeaf2;font-size:10px;font-weight:900;letter-spacing:.1em}.brand{font-size:17px!important}.brand span,.eyebrow{color:#77bff2}header{padding:64px 0 56px}.country{display:flex;align-items:center;gap:14px;margin-bottom:38px}.flag{font-size:44px}.country b{display:block;font-size:14px}.country small{display:block;margin-top:4px;color:#8ba5b4;font-size:9px;font-weight:800;letter-spacing:.08em}.eyebrow{font-size:10px;font-weight:950;letter-spacing:.17em}h1{max-width:900px;margin:14px 0 22px;font:clamp(54px,8vw,94px)/.94 Georgia,serif;letter-spacing:-.045em}h1 em,h2 em{color:#ffd34e;font-style:normal}.lead,.copy{max-width:900px;color:#a8bbc6;font-size:16px;line-height:1.75}.status{display:flex;gap:8px;flex-wrap:wrap;margin-top:28px}.status b{padding:8px 11px;border:1px solid #77bff23d;border-radius:999px;color:#cfeaff;font-size:8px;letter-spacing:.08em}section{padding:62px 0;border-top:1px solid #ffffff12}h2{max-width:900px;margin:10px 0 26px;font:clamp(35px,5vw,58px)/1.04 Georgia,serif}.flow{display:grid;grid-template-columns:repeat(5,1fr);gap:9px;margin-top:28px}.flow article,.two article,.next,.question,.plain{border:1px solid #ffffff14;border-radius:16px;background:#071722cc}.flow article{padding:20px;min-height:190px}.flow span{display:block;color:#ffd34e;font:28px Georgia,serif;margin-bottom:16px}.flow b,.two b,.plain b{font-size:9px;letter-spacing:.1em;color:#83c9f5}.flow p,.two p,.next p{color:#91a7b4;font-size:12px;line-height:1.65}.plain{margin-top:18px;padding:24px;border-color:#ffd34e40;background:#392f0c2b}.plain p{margin:8px 0 0;color:#d6d2b7;font:19px/1.55 Georgia,serif}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}.two article{padding:25px}.questionSection{background:linear-gradient(135deg,#ffffff04,#ffd34e08);margin:0 -18px;padding-left:18px;padding-right:18px}.question{padding:30px;border-color:#ffd34e55}.question p{color:#a8bbc6;font-size:15px;line-height:1.65}.question strong{display:block;margin-top:22px;color:#fff5bc;font:24px/1.45 Georgia,serif}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;margin:28px 0}.chain span{padding:12px 5px;text-align:center;border:1px solid #77bff22d;border-radius:8px;color:#9fd5f5;font-size:8px;font-weight:900}.next{padding:26px;max-width:900px}.next strong{color:#ffd34e}.rows{display:grid;gap:10px}.rows article{display:grid;grid-template-columns:130px 250px 1fr;gap:18px;padding:17px 18px;border:1px solid #ffffff14;border-radius:12px;background:#ffffff05}.rows span{color:#ffd34e;font-size:10px;font-weight:900}.rows b{font-size:10px;color:#d9e9f1}.rows p{margin:0;color:#91a7b4;font-size:11px;line-height:1.55}footer{padding:44px 0 72px;border-top:1px solid #ffffff12;color:#718994;font-size:9px;line-height:1.8}footer span{color:#ffd34e}@media(max-width:900px){.flow{grid-template-columns:1fr}.two{grid-template-columns:1fr}.chain{grid-template-columns:repeat(2,1fr)}}@media(max-width:760px){.rows article{grid-template-columns:1fr;gap:6px}h1{font-size:52px}}
      `}</style>
    </main>
  );
}
