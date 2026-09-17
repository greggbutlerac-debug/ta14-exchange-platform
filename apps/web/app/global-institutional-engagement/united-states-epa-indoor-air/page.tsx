import Link from 'next/link';

const chain = [
  ['01','REALITY','The actual indoor and outdoor environmental condition at a defined place and time.'],
  ['02','RECORD','Measurements retain pollutant, sensor, zone, time, method, status and provenance.'],
  ['03','CONTINUITY','Determine whether the evidence remains current through the interval before action.'],
  ['04','ADMISSIBILITY','Determine exactly what the evidence supports — and what it does not.'],
  ['05','BINDING','Bind evidence to the correct zone, equipment, policy and authority.'],
  ['06','COMMIT','Preserve the determination before a physical command is released.'],
  ['07','EXECUTION','Automated or human mitigation proceeds only within current authority.'],
  ['08','OUTCOME','Monitor the result; material context change requires a new validation chain.'],
];

const sources = [
  ['U.S. EPA · Framework for Effective School IAQ Management','https://www.epa.gov/iaq-schools/framework-effective-school-iaq-management'],
  ['U.S. EPA · Heating, Ventilation and Air-Conditioning Systems for Schools','https://www.epa.gov/iaq-schools/heating-ventilation-and-air-conditioning-systems-part-indoor-air-quality-design-tools'],
  ['U.S. EPA · Wildfires and Indoor Air Quality in Schools and Commercial Buildings','https://www.epa.gov/emergencies-iaq/wildfires-and-indoor-air-quality-schools-and-commercial-buildings'],
  ['U.S. EPA · Reference Guide for Indoor Air Quality in Schools','https://www.epa.gov/iaq-schools/reference-guide-indoor-air-quality-schools'],
  ['ASHRAE · Wildfire Response Resources','https://www.ashrae.org/technical-resources/wildfire-response-resources'],
];

export const metadata = {
  title: 'United States · EPA Indoor Air | TA-14',
  description: 'A bounded TA-14 technical examination of the execution-authority boundary created when valid environmental conditions change after a building action is prepared but before it executes.',
};

export default function USEPAIndoorAirShowroom() {
  return <main className="page"><div className="shell">
    <nav>
      <Link className="brand" href="/"><b>TA-14</b> AUTHORITY</Link>
      <Link href="/global-institutional-engagement">GLOBAL INSTITUTIONAL ENGAGEMENT</Link>
      <Link href="/environmental-integrity-governance">ENVIRONMENTAL INTEGRITY</Link>
    </nav>

    <header>
      <div className="bilateral">
        <div><strong>UNITED STATES</strong><span>🇺🇸</span><small>U.S. EPA · INDOOR AIR QUALITY</small></div>
        <i>BOUNDED TECHNICAL EXAMINATION</i>
        <div className="right"><strong>TA-14 AUTHORITY</strong><span>🇺🇸</span><small>EVIDENCE · CONTEXT · AUTHORITY · EXECUTION</small></div>
      </div>
      <p className="eyebrow">PUBLIC INSTITUTIONAL TECHNICAL RECORD · UPDATED SEPTEMBER 17, 2026</p>
      <h1>The sensors can all be right.<br/><em>The building can still act wrong.</em></h1>
      <p className="lead">EPA's latest response accepts the central operational premise: with continuous indoor/outdoor PM₂.₅ and indoor CO₂ monitoring, a building can actively adjust ventilation as conditions change. TA-14 now freezes the question one instant later — after the system knows reality changed, but before the prepared physical action executes.</p>
      <div className="rule"><small>THE EXECUTION-AUTHORITY QUESTION</small><b>What prevents a command established at T₀ from executing at T₁ after the material conditions that justified it have changed?</b></div>
    </header>

    <section className="band"><div className="inner">
      <p className="eyebrow">EPA'S LATEST TECHNICAL RESPONSE</p>
      <h2>Continuous monitoring answers the knowledge question.</h2>
      <div className="cards">
        <article><b>INDOOR CO₂</b><p>The classroom condition can be measured continuously.</p></article>
        <article><b>OUTDOOR PM₂.₅</b><p>Wildfire smoke and outdoor pollution can also be measured continuously.</p></article>
        <article><b>ACTIVE ADJUSTMENT</b><p>EPA notes that ventilation can be actively adjusted as indoor and outdoor conditions change.</p></article>
        <article><b>ASHRAE WILDFIRE GUIDANCE</b><p>EPA points to ASHRAE wildfire-smoke guidance as an additional technical resource.</p></article>
      </div>
      <div className="callout"><b>TA-14 ACCEPTS ALL FOUR POINTS.</b><p>The examination is no longer asking whether the building can know that the environment changed. It asks what gives that new knowledge authority to stop, revoke, or require revalidation of a physical action that was already prepared under the prior state.</p></div>
    </div></section>

    <section>
      <p className="eyebrow">INSTITUTIONAL EXAMINATION RECORD · SEPTEMBER 17, 2026</p>
      <h2>What the EPA exchange now establishes — and what remains unresolved.</h2>
      <div className="questions">
        <article><span>01</span><p><b>EPA · AUTOMATION + CONTINUOUS MONITORING</b><br/>EPA explained that mitigation may be automated or human-directed and that continuous monitoring before and after mitigation can show whether an action addressed the indoor-air issue.</p></article>
        <article><span>02</span><p><b>EPA · ACTIVE RESPONSE TO CHANGING CONDITIONS</b><br/>For the classroom CO₂ / wildfire PM₂.₅ example, EPA stated that continuous indoor/outdoor monitoring can support active ventilation adjustment as indoor and outdoor pollution conditions change, and pointed to ASHRAE wildfire-smoke guidance.</p></article>
        <article><span>03</span><p><b>EPA · REALITY REMAINS DYNAMIC</b><br/>EPA further noted that indoor and outdoor air-quality conditions are continuously in flux and that some delay necessarily exists between HVAC system changes and the resulting air-quality response.</p></article>
        <article><span>04</span><p><b>TA-14 · UNRESOLVED PRE-EXECUTION SEAM</b><br/>Those points explain sensing, adjustment and post-action observation. The exchange has not yet identified the mechanism that determines whether authority established under T₀ remains valid after a material ΔN but before the prepared physical action executes.</p></article>
      </div>
      <div className="callout gold"><b>STATUS · QUESTION RETURNED TO EPA</b><p>TA-14 has now put the counterfactual directly into the institutional record: if the outdoor condition changes after the ventilation action has been established but before it executes, and nobody and nothing explicitly says HOLD, what would the building do? If it executes, absence of refusal has effectively become permission. If it does not, something must have withheld, revoked or conditioned that authority. The examination is awaiting EPA's response to that boundary.</p></div>
    </section>

    <section>
      <p className="eyebrow">FREEZE THE SYSTEM ONE INSTANT BEFORE EXECUTION</p>
      <h2>Nothing has to malfunction for the governance problem to exist.</h2>
      <div className="timeline">
        <article><span>T₀</span><h3>VALID INDOOR CONDITION</h3><p>Classroom CO₂ rises. Under the building's established control logic, increasing outdoor-air ventilation is appropriate.</p></article>
        <article><span>T₀+</span><h3>ACTION PREPARED</h3><p>The control system prepares the outdoor-air damper command. The decision may be entirely reasonable when established.</p></article>
        <article><span>ΔN</span><h3>REALITY CHANGES</h3><p>Before physical execution, outdoor PM₂.₅ rises materially because wildfire smoke moves into the area.</p></article>
        <article><span>T₁</span><h3>CHANGE DETECTED</h3><p>The outdoor monitor detects the new PM₂.₅ condition correctly. The sensors, communications and controls are all working.</p></article>
        <article className="critical"><span>?</span><h3>AUTHORITY SEAM</h3><p>What makes the new evidence capable of invalidating, withholding or requiring revalidation of the already-prepared command?</p></article>
        <article><span>T₁+</span><h3>PHYSICAL CONSEQUENCE</h3><p>If no mechanism says HOLD, does the earlier command execute simply because nothing explicitly revoked it?</p></article>
      </div>
    </section>

    <section className="band"><div className="inner">
      <p className="eyebrow">THE COUNTERFACTUAL</p>
      <h2>If nobody and nothing explicitly says HOLD, what does the building do?</h2>
      <div className="counterfactual">
        <p>The CO₂ monitor is correct.</p>
        <p>The PM₂.₅ monitor is correct.</p>
        <p>The network is working.</p>
        <p>The BMS is working.</p>
        <p>The actuator is working.</p>
        <p>The changed condition is detected.</p>
      </div>
      <div className="bigQuestion">EVERY COMPONENT CAN WORK EXACTLY AS DESIGNED — AND THE BUILDING CAN STILL EXECUTE AN ACTION WHOSE EVIDENTIARY BASIS BELONGED TO A REALITY THAT NO LONGER EXISTS.</div>
      <div className="forks">
        <article><b>IF IT EXECUTES</b><p>Then absence of refusal has effectively become permission.</p></article>
        <article><b>IF IT DOES NOT EXECUTE</b><p>Then some mechanism must have withheld, revoked or conditioned the authority to act.</p></article>
        <article><b>IF IT RE-EVALUATES</b><p>Then some mechanism must require that re-evaluation before consequence.</p></article>
      </div>
    </div></section>

    <section>
      <p className="eyebrow">THE QUESTION TA-14 IS ASKING EPA TO LOCATE</p>
      <h2>Detection is not revocation.</h2>
      <div className="questions">
        <article><span>1</span><p><b>What object holds execution authority?</b><br/>A sensor value, a policy rule, a control sequence, an operator decision, a supervisory controller, or something else?</p></article>
        <article><span>2</span><p><b>What event revokes or suspends that authority?</b><br/>Does material environmental change automatically invalidate the prepared action, or only if the control logic explicitly says so?</p></article>
        <article><span>3</span><p><b>What requires revalidation?</b><br/>If the evidence changed after assessment but before execution, what requires the action to be rebound to the current state before consequence?</p></article>
        <article><span>4</span><p><b>Where is that requirement governed?</b><br/>EPA guidance, ASHRAE guidance, building design, school-district policy, the BMS sequence, facility procedure, or nowhere explicitly?</p></article>
      </div>
    </section>

    <section className="band"><div className="inner">
      <p className="eyebrow">TA-14 GOVERNING CHAIN</p>
      <h2>Preserve the transition before consequence.</h2>
      <div className="chain">{chain.map(([n,a,b]) => <article key={n}><span>{n}</span><h3>{a}</h3><p>{b}</p></article>)}</div>
      <div className="states"><b>ALLOW</b><b>HOLD</b><b>DENY</b><b>ESCALATE</b></div>
      <div className="callout gold"><b>WHY HOLD MATTERS</b><p>A HOLD does not claim the earlier CO₂ evidence was wrong. It means that evidence was established under a context that materially changed before physical execution. TA-14 therefore does not let the absence of an explicit refusal silently become permission.</p></div>
    </div></section>

    <section>
      <div className="boundary"><b>PUBLIC-RECORD BOUNDARY</b><p>This page records a technical exchange with the U.S. EPA Indoor Air Quality Customer Care Team and TA-14's bounded examination of the execution-authority seam. It does not represent EPA endorsement, validation, certification, partnership, adoption, procurement, pilot authorization, regulatory recognition, or an assertion that EPA prescribes a particular building-control response. EPA and ASHRAE source materials remain authoritative for their own positions. The counterfactual, governance chain, and execution-authority questions are TA-14's proposed technical examination.</p></div>
    </section>

    <section className="sources">
      <p className="eyebrow">PUBLIC TECHNICAL SOURCES</p>
      <h2>Environmental guidance first. Execution-authority question second.</h2>
      {sources.map(([a,u]) => <a key={u} href={u} target="_blank" rel="noreferrer"><b>{a}</b><span>OPEN SOURCE ↗</span></a>)}
    </section>

    <footer>TA-14 AUTHORITY · GLOBAL INSTITUTIONAL ENGAGEMENT<br/>UNITED STATES · U.S. EPA INDOOR AIR · PUBLIC TECHNICAL SHOWROOM</footer>
  </div><style>{`
    *{box-sizing:border-box}.page{min-height:100vh;background:#07101a;color:#edf4f7;font-family:Arial,Helvetica,sans-serif}.shell,.inner{max-width:1220px;margin:auto;padding:0 28px}nav{min-height:76px;display:flex;align-items:center;gap:28px;border-bottom:1px solid #263848;font-size:12px;letter-spacing:1.5px}nav a{color:#b9c8d2;text-decoration:none}.brand{margin-right:auto;font-size:14px}.brand b{color:#e8b95e}header{padding:80px 0 70px}.bilateral{display:grid;grid-template-columns:1fr auto 1fr;gap:24px;align-items:center;border:1px solid #294152;padding:22px;margin-bottom:58px}.bilateral div{display:grid;gap:5px}.bilateral span{font-size:30px}.bilateral small{color:#91a5b3}.bilateral i{font-style:normal;color:#e8b95e;font-size:11px;letter-spacing:2px}.bilateral .right{text-align:right}.eyebrow{font-size:11px;letter-spacing:2.3px;color:#7fb8d5;font-weight:700}h1{font-size:clamp(48px,7vw,86px);line-height:.98;margin:16px 0 28px;letter-spacing:-3px}h1 em{font-style:normal;color:#e8b95e}h2{font-size:clamp(30px,4vw,46px);max-width:960px;margin:12px 0 30px}.lead{font-size:20px;line-height:1.7;color:#bdcad2;max-width:980px}.rule{margin-top:38px;border-left:4px solid #e8b95e;padding:20px 24px;background:#0d1924}.rule small{display:block;color:#8fa5b3;margin-bottom:8px}.rule b{font-size:23px;line-height:1.4}section{padding:70px 0;border-top:1px solid #1d3140}.band{margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);background:#0a151f}.cards,.forks{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.cards article,.forks article,.timeline article,.questions article,.chain article{border:1px solid #294152;background:#0b1721;padding:22px}.cards b,.forks b{color:#e8b95e;font-size:12px;letter-spacing:1.3px}.cards p,.forks p,.timeline p,.questions p,.chain p{color:#afc0ca;line-height:1.58}.callout{margin-top:26px;border-left:4px solid #7fb8d5;padding:20px 24px;background:#0d1924}.callout b{color:#7fb8d5}.callout p{color:#bdcad2;line-height:1.65}.callout.gold{border-color:#e8b95e}.callout.gold b{color:#e8b95e}.timeline{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.timeline span,.chain span,.questions span{color:#e8b95e;font-size:12px;font-weight:bold}.timeline h3,.chain h3{font-size:16px}.timeline .critical{border-color:#e8b95e;box-shadow:0 0 0 1px rgba(232,185,94,.16) inset}.counterfactual{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.counterfactual p{margin:0;border:1px solid #345064;padding:18px;text-align:center;color:#dbe8ee;background:#0b1721}.bigQuestion{margin:30px 0;padding:30px;border:1px solid #e8b95e;background:#15150f;color:#f3d28d;font-size:clamp(22px,3vw,34px);font-weight:800;line-height:1.3}.forks{grid-template-columns:repeat(3,1fr)}.questions{display:grid;grid-template-columns:1fr 1fr;gap:14px}.questions article{display:grid;grid-template-columns:42px 1fr;gap:8px}.questions p{margin:0}.questions p b{color:#edf4f7}.chain{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.states{display:flex;gap:12px;margin-top:18px}.states b{flex:1;text-align:center;padding:14px;border:1px solid #345064}.boundary{border:1px solid #8b6b32;background:#15150f;padding:28px}.boundary b{color:#e8b95e;letter-spacing:1.5px}.boundary p{color:#c9c4b6;line-height:1.65}.sources a{display:flex;justify-content:space-between;gap:20px;padding:18px 0;border-bottom:1px solid #294152;color:#dbe8ee;text-decoration:none}.sources span{color:#e8b95e;font-size:11px}footer{padding:55px 0 70px;color:#718896;font-size:11px;line-height:1.8;letter-spacing:1.3px}@media(max-width:980px){.cards{grid-template-columns:1fr 1fr}.timeline,.chain{grid-template-columns:1fr 1fr}}@media(max-width:760px){.shell,.inner{padding:0 18px}.bilateral{grid-template-columns:1fr}.bilateral .right{text-align:left}h1{letter-spacing:-1.5px}.cards,.timeline,.counterfactual,.forks,.questions,.chain{grid-template-columns:1fr}.states{flex-wrap:wrap}.states b{min-width:45%}nav{gap:12px;flex-wrap:wrap;height:auto;padding:18px 0}}
  `}</style></main>;
}
