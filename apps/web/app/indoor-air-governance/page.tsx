import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Do We Actually Govern Indoor Air Quality? | TA-14',
  description: 'Follow environmental observation through preserved records, admissible evidence, established authority, bounded execution and verified outcome.',
  alternates: { canonical: '/indoor-air-governance' },
};

const chain = [
  ['01','REALITY','Identify the actual occupied-space condition and its operating context.'],
  ['02','RECORD','Preserve raw readings, time, location, instrument identity and relevant HVAC state.'],
  ['03','CONTINUITY','Keep the record attributable through changes, handoffs and missing intervals.'],
  ['04','ADMISSIBILITY','Determine whether the evidence supports this specific proposed action.'],
  ['05','BINDING','Connect the evidence, applicable policy and responsible equipment to the proposal.'],
  ['06','COMMIT','Confirm established standing and locally applicable authority at the decision point.'],
  ['07','EXECUTION','Allow, hold, deny or escalate the bounded action before physical execution.'],
  ['08','OUTCOME','Verify what actually changed and preserve the new environmental reality.'],
];

const links = [
  {href:'/environmental-integrity-governance',title:'Environmental Integrity Governance',desc:'Examine the governance layer connecting environmental observations to accountable decisions.'},
  {href:'/environmental-records',title:'Atmospheric and Environmental Records',desc:'Explore provenance, preservation, continuity and evidence limitations.'},
  {href:'/global-institutional-engagement/united-states-epa-indoor-air/school-air-quality-governance',title:'School Air: The Execution Boundary',desc:'Follow a hypothetical ventilation decision when outdoor wildfire smoke changes before execution.'},
  {href:'/showrooms/uk-school-air',title:'Interactive School-Air Consequence Test',desc:'Compare proposed actions and their evidence, authority and standing requirements.'},
  {href:'/foundation/public-corpus',title:'Public Technical Corpus',desc:'Review the published architecture and its documented development history.'},
  {href:'/workspace/ai-governance/registry/register',title:'Registered Governance',desc:'Establish the registration pathway before requesting a formal examination.'},
];

export default function IndoorAirGovernance() {
  return <main className="page">
    <div className="shell">
      <nav><Link href="/showrooms/environmental-atmospheric">← ENVIRONMENTAL & ATMOSPHERIC</Link><Link href="/showrooms">ALL SHOWROOMS →</Link></nav>
      <header>
        <p className="eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT TECHNICAL GUIDE</p>
        <h1>How Do We Actually<br/><em>Govern Indoor Air Quality?</em></h1>
        <p className="lead">Monitoring observes a condition. Governance examines whether a proposed consequence has sufficient evidence, applicable authority and established standing to become reality now.</p>
        <p className="notice">EDUCATIONAL ARCHITECTURAL DEMONSTRATION · NO LIVE BUILDING CONTROL · NO REGULATORY OR INSTITUTIONAL ENDORSEMENT IMPLIED</p>
      </header>
      <section><p className="eyebrow">THE DISTINCTION</p><h2>Monitoring is not governance.</h2><p>A sensor reading may justify investigation. A dashboard may support understanding. Neither automatically creates admissible evidence or permission to change a building. Atmospheric Integrity Records (AIR) address preserved environmental chronology; Environmental Integrity Governance (EIG) examines how environmental evidence is used responsibly. TA-14 tests the boundary between a proposed action and an authorized consequence.</p></section>
      <section className="question"><p className="eyebrow">THE GOVERNING QUESTION</p><h2>Does this proposed consequence have sufficient <em>Admissible Evidence</em>, <em>Applicable Authority</em>, and <em>Established Standing</em> to become reality <strong>NOW?</strong></h2></section>
      <section><p className="eyebrow">THE EIGHT-ANCHOR EXAMINATION</p><h2>From reality to verified outcome.</h2><div className="grid">{chain.map(([n,title,desc])=><article key={n}><small>{n}</small><h3>{title}</h3><p>{desc}</p></article>)}</div></section>
      <section className="scenario"><p className="eyebrow">WORKED EXAMPLE · ILLUSTRATIVE</p><h2>A school needs ventilation. Then the outdoor air changes.</h2><p>An occupied classroom's CO₂ level supports consideration of additional ventilation. Before a prepared HVAC command executes, outdoor PM2.5 rises with wildfire smoke. The earlier observation does not automatically authorize the same command under changed conditions.</p><div className="decision"><b>HOLD</b><span>Revalidate the changed evidence, applicable policy and local authority before releasing the proposed action.</span></div><p>This is a teaching scenario, not a claim that TA-14 controls a real school or that HOLD is the correct determination for every building.</p><Link className="cta" href="/global-institutional-engagement/united-states-epa-indoor-air/school-air-quality-governance">EXAMINE THE SCHOOL-AIR SCENARIO →</Link></section>
      <section><p className="eyebrow">FOLLOW THE EVIDENCE</p><h2>Explore the existing TA-14 architecture.</h2><div className="links">{links.map(link=><Link href={link.href} key={link.href}><strong>{link.title} →</strong><span>{link.desc}</span></Link>)}</div></section>
      <footer><p>TA-14 examines evidence and authority boundaries. Actual decisions remain subject to the applicable law, policy, professional responsibilities and locally established authority.</p><Link href="/showrooms">RETURN TO SHOWROOM DIRECTORY →</Link></footer>
    </div>
    <style>{`
      *{box-sizing:border-box}.page{min-height:100vh;background:#08131b;color:#e8f1f3;font-family:Arial,Helvetica,sans-serif}.shell{max-width:1160px;margin:auto;padding:0 26px}nav{display:flex;justify-content:space-between;gap:16px;padding:30px 0;border-bottom:1px solid #29404b}a{color:inherit;text-decoration:none}nav a,.eyebrow{font-size:11px;letter-spacing:.14em;font-weight:700;color:#8fdcc5}header{padding:90px 0 70px}h1{font-size:clamp(42px,6vw,82px);letter-spacing:-.055em;line-height:1.03;margin:24px 0}h1 em,.question em{font-style:normal;color:#9ee7d1}.lead{font-size:clamp(19px,2.3vw,26px);line-height:1.5;max-width:870px;color:#c8d7dd}.notice{font-size:11px;letter-spacing:.09em;color:#d6bb83;margin-top:32px}section{padding:62px 0;border-top:1px solid #29404b}h2{font-size:clamp(28px,3.5vw,48px);line-height:1.15;letter-spacing:-.035em;margin:18px 0 24px}section>p:not(.eyebrow),article p{font-size:17px;line-height:1.75;color:#b9cbd3;max-width:900px}.question{background:#102530;padding:45px;border-left:4px solid #9ee7d1}.question h2{max-width:970px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.grid article{padding:22px;background:#10222c;border:1px solid #2a4653}.grid small{color:#9ee7d1}.grid h3{font-size:18px;margin:15px 0}.grid p{font-size:14px;line-height:1.6}.scenario{background:#0c1d26;padding:50px 35px}.decision{display:flex;align-items:center;gap:25px;background:#1b291e;border:1px solid #bca66a;padding:24px;margin:25px 0}.decision b{font-size:30px;color:#e4bf6b}.decision span{line-height:1.5}.cta{display:inline-block;padding:16px 22px;border:1px solid #9ee7d1;color:#9ee7d1;font-size:12px;font-weight:700;letter-spacing:.07em;margin-top:18px}.links{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.links a{display:flex;flex-direction:column;gap:12px;border:1px solid #2a4653;padding:24px;background:#10222c}.links strong{color:#9ee7d1}.links span{color:#bdcdd4;line-height:1.55}footer{padding:50px 0 80px;color:#a1b8c2;line-height:1.7}footer a{color:#9ee7d1;font-size:12px;font-weight:700}@media(max-width:800px){.grid{grid-template-columns:repeat(2,1fr)}.links{grid-template-columns:1fr}.question,.scenario{padding:26px}}@media(max-width:480px){.grid{grid-template-columns:1fr}nav{flex-wrap:wrap}.decision{flex-direction:column;align-items:flex-start}header{padding:55px 0}}
    `}</style>
  </main>;
}
