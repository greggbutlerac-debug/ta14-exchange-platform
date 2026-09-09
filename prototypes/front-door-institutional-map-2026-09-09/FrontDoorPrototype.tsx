'use client';

import Link from 'next/link';

const steps = [
  ['01','REGISTER','Give the governance a permanent, attributable identity.'],
  ['02','SHOWCASE','Make the architecture understandable without overstating it.'],
  ['03','EXAMINE','Freeze the proposition, measures, falsifiers, and stop rules.'],
  ['04','DEMONSTRATE','Run bounded tests and preserve failures as faithfully as passes.'],
  ['05','ARTIFACT','Produce an inspectable record of what the evidence established.'],
  ['06','PRESENT','Hand the record to a regulator, customer, auditor, partner, or reviewer.'],
];

const worlds = [
  ['AI','AI GOVERNANCE','Registry · provenance · interoperability · founding demonstrations','/workspace/ai-governance'],
  ['ACA','ADMISSIBLE COMPUTATION','Govern before computational commitment.','/ai-governance/admissible-computation'],
  ['AEA','ADMISSIBLE EXECUTION','Govern before consequence.','/registry/ta-14-admissible-execution-architecture'],
  ['FEIG','FINANCIAL EXECUTION','Proof-bound financial consequence.','/artifacts/ta14-feig'],
  ['EI','ENVIRONMENTAL INTEGRITY','AIR · PAIR · buildings · HVAC · field evidence','/environmental-integrity-governance'],
  ['AC','TA-14 ACADEMY','Learn the architecture, test the logic, build operator competence.','/academy'],
  ['LAW','LAW & REGULATION','EU AI Act · standards · public policy · readiness','/law-standards-public-policy'],
];

const proof = [
  ['30+','REGISTERED GOVERNANCES','Independent and TA-14 architectures with preserved identity and chronology.'],
  ['LIVE','SHOWROOMS','ACA, AEA, ONUMA/BIMgenie and governance-specific public evidence surfaces.'],
  ['R1+','EXAMINATIONS','Interoperability is treated as a separate evidentiary object, not a marketing claim.'],
  ['ART','GOVERNED ARTIFACTS','Portable records that preserve claims, evidence, determinations, limits and outcomes.'],
];

export default function FrontDoorPrototype(){
  return <main className="fdp">
    <style>{`
      *{box-sizing:border-box}html{scroll-behavior:smooth}.fdp{min-height:100vh;background:radial-gradient(circle at 15% 5%,rgba(39,136,187,.22),transparent 27%),radial-gradient(circle at 88% 8%,rgba(232,187,84,.12),transparent 24%),linear-gradient(180deg,#020712,#06111d 47%,#02070d);color:#f3f7fa;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.wrap{width:min(1220px,calc(100% - 36px));margin:0 auto}.nav{height:76px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid rgba(255,255,255,.07)}.brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:#fff}.brand b{font-size:20px;letter-spacing:.08em}.brand small{color:#748da2;letter-spacing:.12em;font-size:8px;font-weight:900}.navlinks{display:flex;gap:18px;flex-wrap:wrap}.navlinks a{color:#a9bccb;text-decoration:none;font-size:10px;font-weight:850;letter-spacing:.08em}.register{padding:11px 14px;border:1px solid rgba(118,231,193,.36);border-radius:10px;color:#8de4c5!important;background:rgba(55,145,111,.08)}.hero{padding:90px 0 46px;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(330px,.7fr);gap:46px;align-items:center}.eyebrow{color:#79dcff;font-size:10px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}.hero h1{font-size:clamp(52px,8vw,102px);line-height:.91;letter-spacing:-.055em;margin:18px 0 20px;max-width:900px}.hero h1 span{color:#efc966}.hero p{font-size:20px;line-height:1.6;color:#aebfcb;max-width:820px}.heroActions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.btn{display:inline-flex;min-height:48px;align-items:center;padding:0 17px;border-radius:11px;text-decoration:none;font-size:11px;font-weight:900;letter-spacing:.06em}.primary{background:linear-gradient(135deg,#81e5ff,#73e2b5);color:#04131b}.secondary{border:1px solid rgba(255,255,255,.16);color:#dce8f0;background:rgba(255,255,255,.025)}.heroCard{border:1px solid rgba(235,195,103,.26);border-radius:24px;padding:26px;background:linear-gradient(150deg,rgba(41,31,9,.48),rgba(5,19,31,.92));box-shadow:0 30px 90px rgba(0,0,0,.28)}.heroCard strong{font-size:26px}.heroCard p{font-size:14px}.chain{display:flex;flex-wrap:wrap;gap:7px;margin-top:18px}.chain span{padding:7px 8px;border:1px solid rgba(239,201,102,.19);border-radius:7px;color:#e8ce93;font-size:8px;font-weight:900;letter-spacing:.08em}.strip{margin:24px 0 70px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.proof{padding:20px;border:1px solid rgba(122,173,213,.14);border-radius:15px;background:rgba(6,18,30,.78)}.proof strong{font-size:26px;color:#79dcff}.proof b{display:block;margin-top:5px;font-size:9px;letter-spacing:.11em}.proof p{font-size:12px;line-height:1.55;color:#8097aa}.section{padding:64px 0;border-top:1px solid rgba(255,255,255,.06)}.sectionHead{max-width:900px}.sectionHead small{color:#77dfba;font-weight:900;letter-spacing:.17em;font-size:9px}.sectionHead h2{font-size:clamp(34px,5vw,58px);letter-spacing:-.04em;margin:10px 0 12px}.sectionHead p{color:#99adbc;line-height:1.7}.journey{display:grid;grid-template-columns:repeat(6,1fr);gap:9px;margin-top:30px}.step{position:relative;padding:20px 15px;min-height:190px;border:1px solid rgba(118,231,193,.16);border-radius:16px;background:rgba(6,21,31,.84)}.step span{color:#76e7c1;font-size:10px;font-weight:900}.step h3{font-size:15px;margin:17px 0 9px}.step p{font-size:11px;line-height:1.55;color:#869dac}.step:not(:last-child):after{content:'→';position:absolute;right:-12px;top:50%;z-index:2;color:#6fcfaf}.worldGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:28px}.world{padding:23px;border:1px solid rgba(116,172,215,.16);border-radius:17px;background:linear-gradient(145deg,rgba(7,22,36,.9),rgba(3,11,20,.93));text-decoration:none;color:#f3f7fa;min-height:190px}.world span{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:12px;border:1px solid rgba(116,218,255,.25);color:#7bdfff;font-weight:950;font-size:10px}.world h3{margin:20px 0 8px;font-size:17px}.world p{color:#8399aa;font-size:12px;line-height:1.55}.institution{margin-top:26px;padding:30px;border:1px solid rgba(235,195,103,.23);border-radius:20px;background:linear-gradient(135deg,rgba(47,35,10,.3),rgba(6,17,28,.8));display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center}.institution h3{font-size:28px;margin:0 0 8px}.institution p{color:#9dafbb;line-height:1.65;margin:0}.seal{width:132px;height:132px;border-radius:50%;border:1px solid rgba(239,201,102,.38);display:grid;place-items:center;text-align:center;color:#f0d38c;font-size:11px;font-weight:950;letter-spacing:.1em;box-shadow:0 0 50px rgba(231,185,81,.12) inset}.closing{padding:74px 0 100px;text-align:center}.closing h2{font-size:clamp(40px,6vw,72px);letter-spacing:-.05em;margin:0 auto 16px;max-width:980px}.closing p{max-width:780px;margin:0 auto;color:#99adba;line-height:1.7;font-size:17px}.closing strong{display:block;color:#76e7c1;margin-top:28px;letter-spacing:.08em}.note{margin:30px 0 0;padding:13px 16px;border:1px dashed rgba(239,201,102,.24);border-radius:10px;color:#aa9365;font-size:10px;text-align:center;letter-spacing:.07em}@media(max-width:980px){.hero{grid-template-columns:1fr}.strip,.worldGrid{grid-template-columns:repeat(2,1fr)}.journey{grid-template-columns:repeat(2,1fr)}.step:after{display:none}}@media(max-width:620px){.navlinks{display:none}.strip,.worldGrid,.journey{grid-template-columns:1fr}.institution{grid-template-columns:1fr}.seal{width:110px;height:110px}}
    `}</style>

    <div className="wrap">
      <nav className="nav">
        <Link href="/" className="brand"><b>TA-14</b><small>AUTHORITY · GOVERNANCE INSTITUTION</small></Link>
        <div className="navlinks"><a href="#how">HOW IT WORKS</a><a href="#worlds">GOVERNED WORLDS</a><a href="#proof">PUBLIC EVIDENCE</a><Link href="/workspace/ai-governance/registry/register" className="register">REGISTER GOVERNANCE</Link></div>
      </nav>

      <section className="hero">
        <div>
          <div className="eyebrow">THE TA-14 EXCHANGE · GOVERNANCE THAT LEAVES A RECORD</div>
          <h1>DON'T JUST CLAIM GOVERNANCE. <span>MAKE IT INSPECTABLE.</span></h1>
          <p>Register the architecture. Freeze the baseline. Examine the proposition. Demonstrate what actually happens. Preserve the result in an artifact another person can inspect without you standing in the room.</p>
          <div className="heroActions"><Link className="btn primary" href="/governance-showcase">EXPLORE THE GOVERNANCE SHOWCASE →</Link><Link className="btn secondary" href="/workspace/ai-governance/registry/register">REGISTER A GOVERNANCE →</Link></div>
        </div>
        <aside className="heroCard">
          <div className="eyebrow">ONE GOVERNING DISCIPLINE</div>
          <strong>No admissible evidence.<br/>No admissible execution.</strong>
          <p>Different domains can use different architectures. The institutional discipline stays recognizable: preserve the route from reality to consequence and never claim more than the evidence establishes.</p>
          <div className="chain">{['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'].map(x=><span key={x}>{x}</span>)}</div>
        </aside>
      </section>

      <section id="proof" className="strip">{proof.map(([n,t,p])=><article className="proof" key={t}><strong>{n}</strong><b>{t}</b><p>{p}</p></article>)}</section>

      <section id="how" className="section">
        <div className="sectionHead"><small>THE SIMPLE FRONT DOOR</small><h2>One journey. Six institutional stages.</h2><p>The Exchange can be enormous behind the front door without making the visitor decode the entire institution on arrival. Start with what they can do and what they receive.</p></div>
        <div className="journey">{steps.map(([n,t,p])=><article className="step" key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div>
      </section>

      <section id="worlds" className="section">
        <div className="sectionHead"><small>THEN SHOW THE DEPTH</small><h2>Choose the consequence domain.</h2><p>The worlds are not competing front doors. They are the institutional depth beneath the same evidence journey.</p></div>
        <div className="worldGrid">{worlds.map(([code,title,copy,href])=><Link className="world" href={href} key={code}><span>{code}</span><h3>{title}</h3><p>{copy}</p></Link>)}</div>
        <div className="institution"><div><h3>The Exchange already has a history.</h3><p>Registered governance objects, provenance reviews, HOLD decisions, bounded demonstrations, interoperability examinations, operational showrooms, public artifacts, and preserved limitations are not future promises. They are the institution's emerging record of conduct.</p></div><div className="seal">FREEZE<br/>EXAMINE<br/>PRESERVE</div></div>
      </section>

      <section className="closing">
        <h2>The architecture makes the claim. The evidence earns what comes next.</h2>
        <p>TA-14 should feel less like a catalogue of programs and more like a place where a governance claim enters, acquires identity, is challenged, produces evidence, and leaves behind a record that can travel.</p>
        <strong>REGISTER → SHOWCASE → EXAMINE → DEMONSTRATE → ARTIFACT → PRESENT</strong>
        <div className="note">NON-LIVE DESIGN PROTOTYPE · STORED OUTSIDE apps/web · DOES NOT CHANGE THE CURRENT EXCHANGE FRONT DOOR</div>
      </section>
    </div>
  </main>;
}
