import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ACA + AEA Company Showroom',
  description: 'TA-14 governs computational commitment, execution authority, and the evidence boundary between them through the ONUMA/BIMgenie LT-2 case.',
};

const layers = [
  { mark: 'ACA', label: 'BEFORE COMPUTE', title: 'Admissible Computation Architecture', copy: 'Tests whether a bounded computational proposal has sufficient standing before resources are committed.', href: '/ai-governance/admissible-computation', action: 'Enter the ACA showroom', tone: 'cyan' },
  { mark: 'AEA', label: 'BEFORE CONSEQUENCE', title: 'Admissible Execution Architecture', copy: 'Tests whether evidence, identity, continuity, authority, and present conditions support the proposed consequence.', href: '/registry/ta-14-admissible-execution-architecture', action: 'Open the AEA record', tone: 'gold' },
  { mark: 'LT-2', label: 'EXTERNAL OPERATIONAL CASE', title: 'ONUMA / BIMgenie Work Order 3593-22790', copy: 'A real occupant-to-facility-manager-to-technician workflow showing why represented topology and operational assignment do not manufacture physical truth.', href: '/ai-governance/admissible-architecture/onuma-lt2', action: 'Inspect the evidence boundary', tone: 'green' },
] as const;

const boundaries = [
  ['Reported', 'The light is not illuminating. Circuit 2 appears ON and is not visibly tripped.'],
  ['Represented', 'The frozen semantic model supports a bounded upstream electrical relationship associated with LT-2.'],
  ['Authorized', 'The BIMgenie assignment supports bounded, non-intervention investigation.'],
  ['Not established', 'Present energized state, physical topology, defect, repair authority, intervention, or outcome.'],
] as const;

export default function AdmissibleArchitectureShowroom() {
  return <main className="page">
    <div className="grid" aria-hidden="true" />
    <div className="shell">
      <nav><Link href="/">TA-14 Exchange</Link><span>Company Showroom</span><Link href="/governance-showcase">Governance Showcase</Link></nav>
      <header className="hero">
        <p className="eyebrow">TA-14 ADMISSIBLE ARCHITECTURE · PUBLIC SHOWROOM</p>
        <h1>Govern the compute.<br/><em>Govern the consequence.</em></h1>
        <p className="lead">ACA asks whether computation has standing. AEA asks whether its result has standing to become consequence. The ONUMA/BIMgenie LT-2 case shows both boundaries operating against an externally generated work order without inventing the physical state the record does not establish.</p>
        <div className="heroActions"><Link className="primary" href="/ai-governance/admissible-architecture/onuma-lt2">Open the LT-2 case →</Link><Link href="/ai-governance/admissible-computation/pilot-lab">Run the ACA Pilot Lab</Link></div>
      </header>
      <section className="sequence" aria-label="Architecture sequence">
        <div><small>01</small><b>Reality / Request</b></div><i>→</i><div className="aca"><small>02</small><b>ACA Gate</b></div><i>→</i><div><small>03</small><b>Computation</b></div><i>→</i><div><small>04</small><b>Bounded Finding</b></div><i>→</i><div className="aea"><small>05</small><b>AEA Gate</b></div><i>→</i><div><small>06</small><b>Execution</b></div><i>→</i><div><small>07</small><b>Outcome / New Reality</b></div>
      </section>
      <section>
        <div className="sectionHead"><div><p className="eyebrow">ONE CONTINUOUS GOVERNANCE HANDOFF</p><h2>Three doors. One evidence journey.</h2></div><p>Each architecture retains its own role. The case demonstrates their connection without collapsing model evidence, operational records, or physical reality into one claim.</p></div>
        <div className="layerGrid">{layers.map(layer => <Link href={layer.href} className={`layer ${layer.tone}`} key={layer.mark}><div className="orb">{layer.mark}</div><small>{layer.label}</small><h3>{layer.title}</h3><p>{layer.copy}</p><strong>{layer.action} <span>→</span></strong></Link>)}</div>
      </section>
      <section className="proof">
        <div><p className="eyebrow">THE PROOF IS THE RESTRAINT</p><h2>The architecture knew where the evidence stopped.</h2><p className="lead">A successful governance result is not always execution. In LT-2, the represented path earned bounded computational support and the assignment earned bounded investigation authority. Physical electrical intervention remained HOLD.</p></div>
        <aside><small>CURRENT CONTROLLING STATE</small><div><b>ACA</b><span>SUPPORTED · REPRESENTED TOPOLOGY</span></div><div><b>AEA</b><span>ALLOW · BOUNDED INVESTIGATION</span></div><div className="hold"><b>PHYSICAL</b><span>HOLD · FIELD EVIDENCE REQUIRED</span></div><div><b>ORDER</b><span>WORK IN PROGRESS</span></div></aside>
      </section>
      <section>
        <p className="eyebrow">EVIDENCE CLASSES MUST NOT COLLAPSE</p><h2>What the record says—and what it cannot yet say.</h2>
        <div className="boundaryGrid">{boundaries.map(([title,copy], index) => <article key={title} className={index === 3 ? 'stop' : ''}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>
      <section className="cta"><small>CAPABILITY IS NOT STANDING</small><h2>See the architecture, test the gate, inspect the evidence.</h2><div><Link className="primary" href="/ai-governance/admissible-architecture/onuma-lt2">Inspect Work Order 3593-22790 →</Link><Link href="/ai-governance/admissible-computation">Explore ACA</Link><Link href="/registry/ta-14-admissible-execution-architecture">Explore AEA</Link><Link href="/public/ai-governance/operational-mission-records/onuma-re1">Earlier ONUMA Mission</Link></div></section>
    </div>
    <style>{`
      *{box-sizing:border-box}.page{position:relative;min-height:100vh;overflow:hidden;background:radial-gradient(circle at 50% -5%,#153a50 0,#06121e 31%,#02070d 72%);color:#f5fbff;font-family:Arial,sans-serif}.grid{position:absolute;inset:0;opacity:.12;background-image:linear-gradient(#62dafc22 1px,transparent 1px),linear-gradient(90deg,#62dafc22 1px,transparent 1px);background-size:52px 52px;mask-image:linear-gradient(to bottom,#000,transparent 56%)}.shell{position:relative;width:min(1220px,calc(100% - 36px));margin:auto;padding:26px 0 100px}nav{display:flex;justify-content:space-between;gap:18px;padding-bottom:22px;border-bottom:1px solid #ffffff17;color:#829aaa;font-size:12px}nav a{color:#d5e9f5;text-decoration:none}.hero{padding:90px 0 72px;max-width:1100px}.eyebrow,small{color:#6fe7ff;font-size:11px;font-weight:900;letter-spacing:.16em}h1,h2,h3{font-family:Georgia,serif}h1{margin:18px 0;font-size:clamp(54px,8vw,108px);line-height:.91;letter-spacing:-.055em}h1 em{color:#efc66f}.lead{max-width:1000px;color:#afc2ce;font-size:19px;line-height:1.72}.heroActions,.cta>div{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.heroActions a,.cta a{padding:15px 19px;border:1px solid #6fe7ff55;border-radius:11px;color:#eafaff;text-decoration:none;font-weight:850}.heroActions .primary,.cta .primary{background:#9cecff;color:#05202a}.sequence{display:flex;align-items:center;gap:7px;overflow:auto;padding:22px;border:1px solid #ffffff17;border-radius:18px;background:#061522aa}.sequence div{min-width:max-content;padding:13px;border:1px solid #ffffff18;border-radius:10px}.sequence small,.sequence b{display:block}.sequence small{margin-bottom:6px;font-size:9px}.sequence i{color:#68838f}.sequence .aca{border-color:#6fe7ff88;background:#092838}.sequence .aea{border-color:#efc66f88;background:#2a2110}section{padding:76px 0;border-top:1px solid #ffffff11}.sectionHead{display:grid;grid-template-columns:1.25fr .75fr;gap:36px;align-items:end}.sectionHead>p{color:#93a9b6;line-height:1.7}h2{font-size:clamp(36px,5vw,62px);line-height:1;margin:12px 0}.layerGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:34px}.layer{display:flex;min-height:455px;flex-direction:column;padding:28px;border:1px solid #ffffff18;border-radius:24px;background:linear-gradient(155deg,#0b2132,#04101a);color:#f5fbff;text-decoration:none;transition:.25s}.layer:hover{transform:translateY(-7px)}.layer.cyan:hover{border-color:#6fe7ff}.layer.gold:hover{border-color:#efc66f}.layer.green:hover{border-color:#67e4ad}.orb{display:grid;width:84px;height:84px;place-items:center;margin-bottom:32px;border:1px solid #6fe7ff88;border-radius:50%;background:radial-gradient(circle at 35% 25%,#eafcff,#64daf4 8%,#0c4862 39%,#03101a 72%);box-shadow:0 0 38px #4edcff33;font:900 20px Georgia,serif}.gold .orb{border-color:#efc66f;background:radial-gradient(circle at 35% 25%,#fff8e5,#e5b85e 8%,#604513 39%,#120d04 72%);box-shadow:0 0 38px #e5b85e2c}.green .orb{border-color:#67e4ad;background:radial-gradient(circle at 35% 25%,#edfff7,#55d99e 8%,#15543d 39%,#04150e 72%);box-shadow:0 0 38px #55d99e2b}.layer h3{font-size:31px;line-height:1.05;margin:13px 0}.layer p{color:#9db2bd;line-height:1.65}.layer strong{margin-top:auto;color:#dff9ff}.layer strong span{color:#6fe7ff}.proof{display:grid;grid-template-columns:1.3fr .7fr;gap:48px;align-items:center}.proof aside{padding:27px;border:1px solid #6fe7ff55;border-radius:21px;background:#071926}.proof aside div{display:grid;grid-template-columns:90px 1fr;gap:15px;padding:15px 0;border-bottom:1px solid #ffffff12}.proof aside b{color:#6fe7ff}.proof aside span{color:#afc2cd;font-size:12px;font-weight:800}.proof aside .hold{border-color:#efc66f44}.proof aside .hold b,.proof aside .hold span{color:#efc66f}.boundaryGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:30px}.boundaryGrid article{padding:24px;border:1px solid #ffffff17;border-radius:17px;background:#071522}.boundaryGrid span{color:#6fe7ff;font-size:11px;font-weight:900}.boundaryGrid h3{font-size:25px;margin:12px 0}.boundaryGrid p{color:#9fb3be;line-height:1.6}.boundaryGrid .stop{border-color:#efc66f55;background:#211b0f}.boundaryGrid .stop span{color:#efc66f}.cta{text-align:center;padding:76px 30px;border:1px solid #efc66f55;border-radius:28px;background:radial-gradient(circle at 50% 0,#3a2a1029,transparent 45%),#07141d}.cta h2{max-width:900px;margin:18px auto}.cta>div{justify-content:center}@media(max-width:900px){.layerGrid,.proof,.sectionHead{grid-template-columns:1fr}.boundaryGrid{grid-template-columns:1fr 1fr}}@media(max-width:600px){.boundaryGrid{grid-template-columns:1fr}.hero{padding-top:58px}nav{flex-direction:column}.layer{min-height:390px}}
    `}</style>
  </main>;
}
