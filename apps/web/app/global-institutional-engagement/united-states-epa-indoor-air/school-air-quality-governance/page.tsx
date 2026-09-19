import Link from 'next/link';

const fellowshipFacts = [
  ['53', 'school-system leaders'],
  ['25', 'states represented'],
  ['2M+', 'students served across participating districts'],
  ['9 months', 'September 2026 through May 2027'],
];

const executionTrace = [
  ['01', 'REALITY', 'An occupied classroom is trending upward in CO₂ while the outdoor-air condition is initially acceptable.'],
  ['02', 'RECORD', 'Indoor CO₂, outdoor PM2.5, zone identity, HVAC state, timestamps and sensor provenance are bound into the evidence record.'],
  ['03', 'CONTINUITY', 'The system checks whether the evidence remains current between assessment and the moment a consequential command would execute.'],
  ['04', 'ADMISSIBILITY', 'The indoor evidence supports a ventilation response at T₀, but that support is bounded to the conditions actually recorded.'],
  ['05', 'BINDING', 'The evidence is bound to the classroom, the serving air system, the district IAQ plan and the authority permitted to change operation.'],
  ['06', 'COMMIT', 'Before the command is released, outdoor PM2.5 rises because wildfire smoke reaches the area. The previously prepared command is not silently grandfathered forward.'],
  ['07', 'EXECUTION', 'TA-14 returns HOLD until the changed outdoor-air condition is revalidated against the applicable policy and authority.'],
  ['08', 'OUTCOME', 'After a newly authorized action executes, post-action monitoring verifies what changed and begins a new chain if context changes again.'],
];

const decisions = [
  ['ALLOW', 'Current evidence and authority still support the exact proposed action.'],
  ['HOLD', 'The action may still be appropriate, but changed context requires revalidation before execution.'],
  ['DENY', 'Current evidence or policy no longer supports the proposed action.'],
  ['ESCALATE', 'The available policy cannot resolve the competing conditions without an authorized human or institutional determination.'],
];

const implementationQuestions = [
  'What evidence must still be current when a school HVAC command crosses from recommendation into physical execution?',
  'How is the applicable district IAQ plan bound to the exact school, zone, equipment and operating state?',
  'What causes a prepared command to expire when outdoor air changes after the indoor condition was assessed?',
  'Who or what has authority to convert an IAQ recommendation into an executable building command?',
  'How is the pre-execution determination preserved so the district can later reconstruct why the action was allowed, held, denied or escalated?',
  'How does the post-action record distinguish a good outcome from a command that happened to work despite stale or incomplete authority?',
];

const sources = [
  ['USGBC · Center for Green Schools Announces 2026-2027 School Air Quality Fellowship Cohort', 'https://www.usgbc.org/articles/center-green-schools-announces-2026-2027-school-air-quality-fellowship-cohort'],
  ['U.S. EPA · Framework for Effective School IAQ Management', 'https://www.epa.gov/iaq-schools/framework-effective-school-iaq-management'],
  ['U.S. EPA · Heating, Ventilation and Air-Conditioning Systems for Schools', 'https://www.epa.gov/iaq-schools/heating-ventilation-and-air-conditioning-systems-part-indoor-air-quality-design-tools'],
  ['U.S. EPA · Wildfires and Indoor Air Quality in Schools and Commercial Buildings', 'https://www.epa.gov/emergencies-iaq/wildfires-and-indoor-air-quality-schools-and-commercial-buildings'],
];

export const metadata = {
  title: 'School Air Quality Governance | U.S. EPA Indoor Air · TA-14',
  description: 'A bounded school IAQ execution-governance scenario connecting current school air-quality planning with admissible evidence, authority and verified execution.',
};

export default function SchoolAirQualityGovernancePage() {
  return (
    <main className="page">
      <div className="shell">
        <nav>
          <Link className="brand" href="/"><b>TA-14</b> AUTHORITY</Link>
          <Link href="/global-institutional-engagement/united-states-epa-indoor-air">EPA INDOOR AIR SHOWROOM</Link>
          <Link href="/environmental-integrity-governance">ENVIRONMENTAL INTEGRITY</Link>
        </nav>

        <header>
          <p className="eyebrow">CURRENT SCHOOL IAQ CONTEXT · SEPTEMBER 17, 2026</p>
          <h1>School air-quality planning<br/><em>meets execution governance.</em></h1>
          <p className="lead">The U.S. Green Building Council's Center for Green Schools announced a 2026–2027 School Air Quality Fellowship for 53 school-system leaders across 25 states, collectively serving more than 2 million students. The program is designed to help participants build practical plans for healthier indoor air and energy-efficient schools. This page uses that public development only as current context for a bounded TA-14 technical scenario.</p>
          <div className="rule"><small>TA-14 GOVERNING PRINCIPLE</small><b>No admissible evidence. No admissible execution.</b></div>
        </header>

        <section>
          <p className="eyebrow">WHY THIS MATTERS NOW</p>
          <h2>School districts are strengthening the planning layer.</h2>
          <p className="intro">The fellowship runs from September 2026 through May 2027 and supports district leaders in facilities, environmental health and safety, business operations and sustainability. Participants will use a school-district energy-efficient IAQ management-plan toolkit developed by the Center for Green Schools with the American Lung Association, Go Green Initiative and the University of Utah. The announcement states that the project is funded wholly or in part by the U.S. Environmental Protection Agency.</p>
          <div className="facts">{fellowshipFacts.map(([n, label]) => <article key={label}><strong>{n}</strong><span>{label}</span></article>)}</div>
        </section>

        <section className="band"><div className="inner">
          <p className="eyebrow">THE COMPLEMENTARY QUESTION</p>
          <h2>A strong plan can say what should happen. Execution governance asks what is allowed to happen now.</h2>
          <div className="split">
            <article><b>IAQ MANAGEMENT PLAN</b><p>Defines goals, responsibilities, operating procedures, mitigation strategies, communication and evaluation.</p></article>
            <div className="plus">+</div>
            <article><b>EXECUTION GOVERNANCE</b><p>Preserves whether the evidence, context, equipment binding and authority remain valid at the instant a consequential action is committed and executed.</p></article>
          </div>
          <div className="handoff"><span>SENSE</span><i>→</i><span>UNDERSTAND</span><i>→</i><span>RECOMMEND</span><i>→</i><span className="seam">EVIDENCE + AUTHORITY CHECK</span><i>→</i><span>EXECUTE</span><i>→</i><span>VERIFY</span></div>
        </div></section>

        <section>
          <p className="eyebrow">BOUNDED SCHOOL SCENARIO</p>
          <h2>The indoor condition calls for more ventilation. Then the outdoor air changes.</h2>
          <p className="intro">An occupied classroom experiences rising CO₂ and the building prepares an outdoor-air ventilation response. Before that command executes, outdoor PM2.5 rises materially because wildfire smoke reaches the area. The original recommendation may have been reasonable when created. The governance question is whether that earlier evidence and authority remain sufficient for the same physical action after context changes.</p>
          <div className="signals">
            <article><small>INDOOR SIGNAL</small><strong>CO₂ ↑</strong><p>Potential ventilation or occupancy pressure.</p><b>Prepared direction: increase outdoor air.</b></article>
            <div className="versus">Δ</div>
            <article><small>CHANGED OUTDOOR SIGNAL</small><strong>PM2.5 ↑</strong><p>Wildfire smoke changes the risk represented by outdoor air.</p><b>Required response: revalidate before execution.</b></article>
          </div>
        </section>

        <section className="band"><div className="inner">
          <p className="eyebrow">TA-14 EXECUTION TRACE</p>
          <h2>Eight anchors preserve the transition before consequence.</h2>
          <div className="trace">{executionTrace.map(([n, a, b]) => <article key={n}><span>{n}</span><div><h3>{a}</h3><p>{b}</p></div></article>)}</div>
        </div></section>

        <section>
          <p className="eyebrow">DETERMINATION</p>
          <h2>In this scenario, changed context produces HOLD—not silent permission.</h2>
          <div className="decisions">{decisions.map(([a,b]) => <article key={a} className={a === 'HOLD' ? 'active' : ''}><b>{a}</b><p>{b}</p></article>)}</div>
          <div className="callout"><b>WHY HOLD IS THE IMPORTANT RESULT</b><p>HOLD does not say the original CO₂ evidence was wrong. It says the execution context changed materially and the earlier record should not silently remain sufficient authority for a later physical act. Revalidation is required before a new commit.</p></div>
        </section>

        <section className="band"><div className="inner">
          <p className="eyebrow">WHAT A DISTRICT COULD PRESERVE</p>
          <h2>One machine-readable execution record, not just a dashboard history.</h2>
          <div className="recordGrid">
            <article><b>IDENTITY</b><p>School, classroom, zone, equipment and responsible authority.</p></article>
            <article><b>EVIDENCE</b><p>CO₂, PM2.5, timestamps, sensor provenance, calibration/context and HVAC state.</p></article>
            <article><b>POLICY BINDING</b><p>The district IAQ plan, operating procedure or other authority applicable to this action.</p></article>
            <article><b>DETERMINATION</b><p>ALLOW, HOLD, DENY or ESCALATE with the evidence boundary frozen at commit.</p></article>
            <article><b>EXECUTION</b><p>The exact command or authorized human action actually released.</p></article>
            <article><b>OUTCOME</b><p>Post-action conditions proving what changed and whether a new chain is required.</p></article>
          </div>
        </div></section>

        <section>
          <p className="eyebrow">QUESTIONS FOR TECHNICAL DISCUSSION</p>
          <h2>The planning work creates the opportunity to make execution reconstructable.</h2>
          <div className="questions">{implementationQuestions.map((q, i) => <article key={q}><span>{String(i + 1).padStart(2,'0')}</span><p>{q}</p></article>)}</div>
        </section>

        <section>
          <div className="boundary"><b>PUBLIC-RECORD BOUNDARY</b><p>This page does not represent EPA, USGBC, Center for Green Schools, fellowship-participant, school-district or toolkit endorsement of TA-14. It does not state that any participating district currently uses AI for consequential HVAC control or that any named institution would make the operational decisions shown here. The fellowship announcement is used only as timely public context. The execution-governance scenario, TA-14 chain and ALLOW / HOLD / DENY / ESCALATE determinations are TA-14's proposed technical objects for discussion.</p></div>
        </section>

        <section className="sources">
          <p className="eyebrow">PUBLIC SOURCES</p>
          <h2>Current school-IAQ context plus EPA guidance.</h2>
          {sources.map(([a,u]) => <a key={u} href={u} target="_blank" rel="noreferrer"><b>{a}</b><span>OPEN SOURCE ↗</span></a>)}
        </section>

        <footer>TA-14 AUTHORITY · U.S. EPA INDOOR AIR SHOWROOM<br/>SCHOOL AIR QUALITY GOVERNANCE · PUBLIC TECHNICAL SCENARIO</footer>
      </div>

      <style>{`*{box-sizing:border-box}.page{min-height:100vh;background:#07101a;color:#edf4f7;font-family:Arial,Helvetica,sans-serif}.shell,.inner{max-width:1220px;margin:auto;padding:0 28px}nav{min-height:76px;display:flex;align-items:center;gap:28px;border-bottom:1px solid #263848;font-size:12px;letter-spacing:1.5px}nav a{color:#b9c8d2;text-decoration:none}.brand{margin-right:auto;font-size:14px}.brand b{color:#e8b95e}header{padding:88px 0 74px}.eyebrow{font-size:11px;letter-spacing:2.3px;color:#7fb8d5;font-weight:700}h1{font-size:clamp(48px,7vw,86px);line-height:.98;margin:16px 0 28px;letter-spacing:-3px}h1 em{font-style:normal;color:#e8b95e}h2{font-size:clamp(30px,4vw,44px);max-width:940px;margin:12px 0 30px}.lead,.intro{font-size:19px;line-height:1.7;color:#bdcad2;max-width:980px}.rule{margin-top:38px;border-left:4px solid #e8b95e;padding:16px 22px;background:#0d1924}.rule small{display:block;color:#8fa5b3;margin-bottom:6px}.rule b{font-size:22px}section{padding:70px 0;border-top:1px solid #1d3140}.band{margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);background:#0a151f}.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:30px}.facts article,.split article,.signals article,.decisions article,.recordGrid article,.questions article{border:1px solid #294152;background:#0b1721;padding:22px}.facts strong{display:block;font-size:42px;color:#e8b95e;margin-bottom:8px}.facts span{color:#b9c8d2;line-height:1.45}.split{display:grid;grid-template-columns:1fr auto 1fr;gap:18px;align-items:center}.split b,.recordGrid b{color:#e8b95e;font-size:12px;letter-spacing:1.3px}.split p,.recordGrid p,.decisions p,.questions p,.trace p{color:#afc0ca;line-height:1.55}.plus,.versus{font-size:42px;color:#617c8c;text-align:center}.handoff{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;margin-top:30px}.handoff span{padding:12px 15px;border:1px solid #355064;font-size:11px;letter-spacing:1.2px}.handoff .seam{border-color:#e8b95e;color:#e8b95e}.handoff i{color:#607b8e}.signals{display:grid;grid-template-columns:1fr auto 1fr;gap:18px;align-items:center;margin-top:26px}.signals article{min-height:260px}.signals small{display:block;color:#8aa2b0;letter-spacing:1.6px}.signals strong{display:block;font-size:50px;margin:18px 0;color:#e8b95e}.signals b{display:block;margin-top:18px;color:#d9e7ed}.trace{display:grid;grid-template-columns:1fr 1fr;gap:12px}.trace article{display:grid;grid-template-columns:48px 1fr;gap:14px;border:1px solid #294152;background:#0b1721;padding:20px}.trace span{color:#e8b95e;font-weight:700}.trace h3{margin:0 0 8px;font-size:15px}.trace p{margin:0}.decisions{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.decisions b{font-size:15px;letter-spacing:1.2px}.decisions .active{border-color:#e8b95e;box-shadow:0 0 0 1px #e8b95e inset}.decisions .active b{color:#e8b95e}.callout{margin-top:26px;border-left:4px solid #7fb8d5;padding:18px 22px;background:#0d1924}.callout b{color:#7fb8d5}.callout p{color:#bdcad2;line-height:1.6}.recordGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.questions{display:grid;grid-template-columns:1fr 1fr;gap:12px}.questions article{display:grid;grid-template-columns:46px 1fr;gap:12px}.questions span{color:#e8b95e;font-size:12px;font-weight:700}.questions p{margin:0}.boundary{border:1px solid #8b6b32;background:#15150f;padding:28px}.boundary b{color:#e8b95e;letter-spacing:1.5px}.boundary p{color:#c9c4b6;line-height:1.65}.sources a{display:flex;justify-content:space-between;gap:20px;padding:18px 0;border-bottom:1px solid #294152;color:#dbe8ee;text-decoration:none}.sources span{color:#e8b95e;font-size:11px}footer{padding:55px 0 70px;color:#718896;font-size:11px;line-height:1.8;letter-spacing:1.3px}@media(max-width:980px){.facts,.decisions{grid-template-columns:1fr 1fr}.recordGrid{grid-template-columns:1fr 1fr}}@media(max-width:760px){.shell,.inner{padding:0 18px}h1{letter-spacing:-1.5px}.facts,.split,.signals,.trace,.decisions,.recordGrid,.questions{grid-template-columns:1fr}.plus,.versus{text-align:center}nav{gap:12px;flex-wrap:wrap;height:auto;padding:18px 0}}`}</style>
    </main>
  );
}
