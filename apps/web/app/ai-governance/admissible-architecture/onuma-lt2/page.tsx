import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ONUMA / BIMgenie LT-2 Evidence Case',
  description: 'Work Order 3593-22790 examined through TA-14 ACA and AEA with the physical-state boundary preserved.',
};

const facts = [
  ['Request', '3593-22790'], ['Location', 'RE-7 · Living Room Small'], ['Priority', 'Urgent'], ['Trade', 'Electrical'],
  ['Assigned technician', 'Greggory Don Butler'], ['Assigned hours', '1.0'], ['Component field', 'Panelboard Distribution V03'], ['Operational state', 'Work In Progress'],
] as const;

const limits = [
  'The affected physical light has not yet been verified as LT-2.',
  'Panelboard Distribution V03 has not yet been independently established as physically identical to DB-2.',
  '“Appears ON” is a reported observation, not verified energized state.',
  'The cause of the lighting condition has not been established.',
  'No breaker operation, panel access, measurement, switching, repair, or replacement is authorized by this record.',
] as const;

const visualExaminations = [
  {
    number: '01',
    title: 'The Building Knows. Who Authorizes Reality?',
    image: '/Building%20Knowledge%20to%20Authorized%20Action.png',
    alt: 'Connected BIM, IFC, document, AI, and sensor sources approach an authority boundary before physical HVAC action.',
    lesson: 'Connected information can support decisions without independently authorizing physical intervention.',
    narration: 'A building model may identify equipment. AI may infer a condition. Sensors may indicate change. None of these, alone, establishes the evidence, authority, and standing needed for a physical consequence.',
  },
  {
    number: '02',
    title: 'The Information Continuity Chain',
    image: '/From%20Design%20to%20Reality_%20Information%20Continuity%20Chain.png',
    alt: 'Five-stage conceptual lifecycle from design and construction to operation, adaptation, and transfer.',
    lesson: 'Meaningful building knowledge should survive software changes, project handoffs, and ownership transfers.',
    narration: 'Design decisions, as-built changes, live performance, and maintenance history should remain connected through the life of a building. Semantic continuity preserves meaning; admissibility still needs to be examined when action is proposed.',
  },
  {
    number: '03',
    title: 'The Consequence Boundary',
    image: '/The%20Consequence%20Boundary%20Infographic.png',
    alt: 'Models, AI, sensors, and records feed an AEA gateway with ALLOW, HOLD, DENY, and ESCALATE determinations.',
    lesson: 'The transition from information to action requires an explicit, evidence-bound decision.',
    narration: 'Admissible Execution Architecture examines Admissible Evidence, Applicable Authority, and Established Standing. Its decisions can allow, hold, deny, or escalate a proposed consequence. HOLD is a valid protective outcome, not a failure.',
  },
  {
    number: '04',
    title: 'From Authorized Intervention to Verified Outcome',
    image: '/Closed-Loop%20HVAC%20Accountability%20Flow.png',
    alt: 'Illustrative HVAC accountability sequence from identifying a condition through field examination and verified outcome.',
    lesson: 'An authorized work order does not, by itself, establish that the intended result was achieved.',
    narration: 'In this separate illustrative HVAC workflow, technicians gather and freeze baseline evidence before a system-issued diagnostic determination. Any justified intervention is bounded by authority and followed, when applicable, by post-intervention verification.',
  },
] as const;

export default function OnumaLt2Case() {
  return <main className="page"><div className="shell">
    <nav><Link href="/ai-governance/admissible-architecture">← ACA + AEA Showroom</Link><b>LT-2 · INTERIM / OPEN CHAIN</b><Link href="/ai-governance/admissible-computation">ACA →</Link></nav>
    <header><div><p className="eyebrow">ONUMA / BIMGENIE · EXTERNALLY GENERATED OPERATIONAL CASE</p><h1>The evidence reached the room.<br/><em>Authority stopped at the physical boundary.</em></h1><p className="lead">BIMgenie carried a reported condition through the confirmed occupant → facility manager → technician sequence. ACA examined represented topology. AEA determined what the resulting record could—and could not—authorize.</p></div><aside><small>WORK ORDER</small><strong>3593-22790</strong><span>RE-7 · Living Room Small</span><div className="state"><b>ALLOW</b><p>Bounded non-intervention investigation</p></div><div className="state hold"><b>HOLD</b><p>Physical electrical intervention</p></div></aside></header>
    <section><p className="eyebrow">THE OPERATIONAL OBJECT</p><h2>What BIMgenie actually established.</h2><div className="facts">{facts.map(([a,b]) => <article key={a}><small>{a}</small><b>{b}</b></article>)}</div><blockquote>“The light in this room is not illuminating. The local Circuit 2 breaker appears ON and is not visibly tripped.”<cite>BIMgenie Work Order 3593-22790 · preserved as a reported condition</cite></blockquote></section>
    <section><p className="eyebrow">TWO ARCHITECTURES · TWO CONSEQUENCE BOUNDARIES</p><div className="gates"><article><small>GATE 01 · ACA</small><h2>What does the model support?</h2><p>The frozen Turtle evidence supports a bounded represented electrical relationship associated with LT-2. Forward and reverse traversal converged on the represented path.</p><strong>SUPPORTED · REPRESENTED TOPOLOGY ONLY</strong><Link href="/ai-governance/admissible-computation/onuma-bim-rerun">Review the ONUMA/BIM rerun →</Link></article><article className="aea"><small>GATE 02 · AEA</small><h2>What may become consequence?</h2><p>The assignment supports identifying the room and affected object, observing accessible conditions, comparing visible identifiers, preserving discrepancies, and returning evidence.</p><strong>ALLOW INVESTIGATION · HOLD INTERVENTION</strong><Link href="/registry/ta-14-admissible-execution-architecture">Open the AEA Registry record →</Link></article></div></section>
    <section className="limits"><div><p className="eyebrow">CURRENT EVIDENCE LIMITS</p><h2>The record must not say more than reality has supplied.</h2></div><ol>{limits.map((limit,index)=><li key={limit}><span>0{index+1}</span><p>{limit}</p></li>)}</ol></section>
    <section><p className="eyebrow">CURRENTLY ADMISSIBLE NEXT ACTION</p><div className="next"><div className="allow"><small>ALLOW</small><h3>Non-intervention evidence collection</h3><p>Confirm the assigned location, identify the affected physical light, observe accessible current conditions, compare visible labels with the represented record, preserve discrepancies, and return new evidence to the same work order.</p></div><div className="holdBox"><small>HOLD</small><h3>Physical electrical consequence</h3><p>Breaker operation, panel access, electrical measurement, switching, energization or de-energization, repair, replacement, rewiring, alteration, and work-order closure remain outside current standing.</p></div></div></section>
    <section className="chain"><small>CURRENT CONTROLLING STATE</small><div><span>ACA</span><b>SUPPORTED</b><p>Represented topology</p></div><i>→</i><div><span>AEA</span><b>ALLOW</b><p>Bounded investigation</p></div><i>→</i><div className="stop"><span>PHYSICAL</span><b>HOLD</b><p>New field evidence required</p></div></section>
    <section className="visualStudy" aria-labelledby="visual-study-heading"><p className="eyebrow">FOUR-VISUAL EDUCATIONAL EXAMINATION</p><h2 id="visual-study-heading">From preserved building knowledge to accountable consequence.</h2><p className="visualIntro">These illustrations explain semantic continuity and the AEA decision boundary. They are conceptual teaching materials, not additional evidence for BIMgenie Work Order 3593-22790 or a claim of deployed ONUMA–TA-14 integration.</p><div className="visualGrid">{visualExaminations.map((v)=><article className="visualCard" key={v.number}><div className="visualHeading"><small>EXAMINATION {v.number} / 04</small><h3>{v.title}</h3></div><img src={v.image} alt={v.alt} loading="lazy" /><p className="visualLesson"><b>What you learned:</b> {v.lesson}</p><details><summary>Samantha narration script</summary><p>{v.narration}</p></details></article>)}</div><div className="visualNext"><b>What comes next</b><p>Return to the LT-2 evidence record above. That record permits bounded investigation while physical electrical intervention remains on HOLD until new field evidence supports a fresh determination.</p></div></section>
    <section className="cta"><small>THE GOVERNANCE RESULT IS THE PRESERVED BOUNDARY</small><h2>Continue through the architecture.</h2><div><Link className="primary" href="/ai-governance/admissible-architecture">Return to the Company Showroom →</Link><Link href="/ai-governance/admissible-computation">Explore ACA</Link><Link href="/registry/ta-14-admissible-execution-architecture">Explore AEA</Link><Link href="/public/ai-governance/operational-mission-records/onuma-re1">Compare the Earlier ONUMA Mission</Link></div></section>
  </div><style>{`
    *{box-sizing:border-box}.page{min-height:100vh;background:radial-gradient(circle at 80% 0,#17394a,#06131e 31%,#02070c 74%);color:#f5fbff;font-family:Arial,sans-serif}.shell{width:min(1180px,calc(100% - 36px));margin:auto;padding:26px 0 95px}nav{display:flex;justify-content:space-between;gap:15px;padding:16px 18px;border:1px solid #ffffff17;border-radius:14px;background:#071622;color:#8da4b1;font-size:12px}a{color:#73e7ff;text-decoration:none}nav b{color:#efc66f;letter-spacing:.1em}.eyebrow,small{color:#6fe7ff;font-size:11px;font-weight:900;letter-spacing:.15em}header{display:grid;grid-template-columns:1.35fr .65fr;gap:42px;align-items:end;padding:78px 0 62px}h1,h2,h3{font-family:Georgia,serif}h1{font-size:clamp(48px,6.7vw,84px);line-height:.96;margin:16px 0}h1 em{color:#efc66f}.lead{color:#afc2cd;font-size:18px;line-height:1.72}header aside{padding:26px;border:1px solid #6fe7ff55;border-radius:22px;background:#071a27}header aside>strong{display:block;font-size:34px;margin:9px 0}header aside>span{color:#9fb5c0}.state{margin-top:18px;padding:15px;border:1px solid #62e5a455;border-radius:12px}.state b{color:#64e5a7}.state p{margin:5px 0;color:#a7bcc6}.state.hold{border-color:#efc66f66}.state.hold b{color:#efc66f}section{padding:68px 0;border-top:1px solid #ffffff11}h2{font-size:clamp(34px,4.7vw,57px);line-height:1.04;margin:12px 0}.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:28px}.facts article{padding:18px;border:1px solid #ffffff16;border-radius:14px;background:#071521}.facts small,.facts b{display:block}.facts small{font-size:9px;margin-bottom:9px}.facts b{line-height:1.4}blockquote{margin:25px 0 0;padding:28px;border-left:4px solid #6fe7ff;background:#ffffff07;font:28px/1.45 Georgia,serif}blockquote cite{display:block;margin-top:13px;color:#8ea6b3;font:11px/1.5 Arial,sans-serif;letter-spacing:.08em}.gates{display:grid;grid-template-columns:1fr 1fr;gap:16px}.gates article{display:flex;min-height:420px;flex-direction:column;padding:28px;border:1px solid #6fe7ff55;border-radius:22px;background:#08202e}.gates .aea{border-color:#efc66f66;background:#211b10}.gates h2{font-size:39px}.gates p{color:#a9bdc7;line-height:1.68}.gates strong{display:block;margin-top:auto;color:#6fe7ff}.gates .aea strong{color:#efc66f}.gates a{margin-top:20px;font-weight:800}.limits{display:grid;grid-template-columns:.75fr 1.25fr;gap:50px}.limits ol{list-style:none;margin:0;padding:0}.limits li{display:grid;grid-template-columns:44px 1fr;gap:14px;padding:14px 0;border-bottom:1px solid #ffffff15}.limits li span{color:#efc66f;font-weight:900}.limits li p{margin:0;color:#afc1cb;line-height:1.6}.next{display:grid;grid-template-columns:1fr 1fr;gap:16px}.next>div{padding:27px;border:1px solid #62e5a455;border-radius:20px;background:#071c19}.next .holdBox{border-color:#efc66f66;background:#211b10}.next h3{font-size:28px;margin:10px 0}.next p{color:#a9bdc7;line-height:1.68}.holdBox small{color:#efc66f}.chain{display:flex;align-items:center;justify-content:center;gap:12px;padding:44px 24px;border:1px solid #ffffff18;border-radius:22px;background:#071622}.chain>small{align-self:flex-start}.chain div{min-width:190px;padding:18px;border:1px solid #6fe7ff55;border-radius:13px}.chain div span,.chain div b,.chain div p{display:block}.chain div b{margin-top:7px;font-size:21px}.chain div p{margin:5px 0;color:#9fb3be;font-size:12px}.chain i{color:#718c98}.chain .stop{border-color:#efc66f}.chain .stop b{color:#efc66f}.cta{text-align:center;margin-top:68px;padding:65px 28px;border:1px solid #efc66f55;border-radius:26px;background:#091821}.cta>div{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:27px}.cta a{padding:14px 17px;border:1px solid #6fe7ff55;border-radius:10px;font-weight:800}.cta .primary{background:#9cecff;color:#05202a}@media(max-width:850px){header,.gates,.limits,.next{grid-template-columns:1fr}.facts{grid-template-columns:1fr 1fr}.chain{align-items:stretch;flex-direction:column}.chain>small{align-self:auto}.chain i{transform:rotate(90deg);align-self:center}}@media(max-width:540px){nav{flex-direction:column}.facts{grid-template-columns:1fr}blockquote{font-size:23px}}
    .visualStudy h2{max-width:900px}.visualIntro{max-width:900px;color:#afc2cd;font-size:17px;line-height:1.7;margin-bottom:26px}.visualGrid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.visualCard{overflow:hidden;border:1px solid #6fe7ff35;border-radius:18px;background:#071521}.visualHeading{padding:22px 24px 14px}.visualHeading h3{font-size:26px;margin:8px 0}.visualCard img{display:block;width:100%;height:auto;background:#04101c}.visualLesson{padding:18px 24px;color:#bbced7;line-height:1.65}.visualLesson b{color:#efc66f}.visualCard details{padding:0 24px 24px;color:#b9ced8}.visualCard summary{cursor:pointer;color:#73e7ff;font-weight:700}.visualCard details p{line-height:1.7}.visualNext{border-left:3px solid #efc66f;padding:18px 23px;margin-top:26px;background:#efc66f0d}.visualNext b{color:#efc66f}.visualNext p{color:#afc2cd;line-height:1.7}@media(max-width:850px){.visualGrid{grid-template-columns:1fr}}
  `}</style></main>;
}
