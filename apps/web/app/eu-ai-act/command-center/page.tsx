'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type State = 'SUPPORTED' | 'CONDITIONAL' | 'EVIDENCE GAP' | 'STALE' | 'REVIEW REQUIRED';

type SystemRecord = {
  id: string;
  name: string;
  version: string;
  role: string;
  jurisdiction: string;
  risk: string;
  obligations: number;
  supported: number;
  gaps: number;
  stale: number;
  review: number;
  state: State;
};

const systems: SystemRecord[] = [
  { id:'EU-SYS-001', name:'Customer Support Copilot', version:'4.2', role:'Deployer', jurisdiction:'EU / EEA', risk:'Transparency-scoped', obligations:24, supported:19, gaps:2, stale:2, review:1, state:'CONDITIONAL' },
  { id:'EU-SYS-002', name:'Recruitment Ranking Engine', version:'3.8', role:'Provider + Deployer', jurisdiction:'EU', risk:'High-risk indicator', obligations:41, supported:29, gaps:6, stale:2, review:4, state:'REVIEW REQUIRED' },
  { id:'EU-SYS-003', name:'Synthetic Media Studio', version:'2.1', role:'Provider', jurisdiction:'EU / Global', risk:'Article 50', obligations:18, supported:15, gaps:1, stale:2, review:0, state:'CONDITIONAL' },
  { id:'EU-SYS-004', name:'Fraud Decision Support', version:'7.0', role:'Deployer', jurisdiction:'EU', risk:'Essential-service review', obligations:37, supported:30, gaps:3, stale:1, review:3, state:'REVIEW REQUIRED' },
];

const obligations = [
  ['A4-001','Article 4','AI literacy','SUPPORTED','Training record + role matrix','12 Aug 2026'],
  ['A9-004','Article 9','Risk management lifecycle','EVIDENCE GAP','Current mitigation verification','—'],
  ['A12-002','Article 12','Recordkeeping / logs','SUPPORTED','Logging specification v3','11 Aug 2026'],
  ['A13-003','Article 13','Transparency to deployers','CONDITIONAL','Instructions + known limitations','09 Aug 2026'],
  ['A14-002','Article 14','Human oversight','REVIEW REQUIRED','Intervention authority evidence','—'],
  ['A15-006','Article 15','Accuracy / robustness / cybersecurity','STALE','Testing predates version 4.2','02 Jun 2026'],
  ['A26-005','Article 26','Deployer obligations','SUPPORTED','Deployment governance record','13 Aug 2026'],
  ['A27-001','Article 27','FRIA pathway','REVIEW REQUIRED','Applicability determination','—'],
  ['A50-001','Article 50','Direct interaction disclosure','SUPPORTED','UI disclosure capture','14 Aug 2026'],
  ['A50-002','Article 50','Synthetic-content marking','EVIDENCE GAP','Detectability test missing','—'],
] as const;

const changes = [
  ['MODEL CHANGE','Customer Support Copilot','4.1 → 4.2','6 prior determinations may require revalidation','HIGH'],
  ['SOURCE DELTA','Article 50 guidance','Official guidance state changed','11 evidence routes reference prior source state','HIGH'],
  ['EVIDENCE AGE','Recruitment Ranking Engine','Robustness test','Evidence freshness threshold exceeded','MEDIUM'],
  ['VENDOR UPDATE','Fraud Decision Support','Foundation model provider','Downstream technical information changed','MEDIUM'],
];

const actions = [
  ['01','Revalidate six determinations','Customer Support Copilot changed from v4.1 to v4.2. Prior evidence does not automatically travel.','OPEN CHANGE IMPACT'],
  ['02','Resolve Article 50 evidence gap','Synthetic-content detectability evidence is absent from the current record.','OPEN EVIDENCE ROUTE'],
  ['03','Review high-risk classification','Recruitment Ranking Engine carries a high-risk indicator with four unresolved determinations.','OPEN CLASSIFICATION'],
  ['04','Confirm human oversight authority','Recorded oversight role exists; intervention capability remains unsupported.','OPEN OVERSIGHT'],
  ['05','Review regulatory delta','Official source state changed after eleven routes were last determined.','OPEN SOURCE IMPACT'],
];

const graphNodes = [
  ['SYSTEM','System 4.2'],['ROLE','Provider'],['LAW','EU 2024/1689'],['OBLIGATION','Article 50'],['CONTROL','Disclosure'],['EVIDENCE','UI Capture'],['REVIEW','Supported'],['CHANGE','v4.2'],['REVALIDATE','Required']
];

function badgeClass(state:string){ return state.toLowerCase().replaceAll(' ','-'); }

export default function EuAiActCommandCenter(){
  const [selected,setSelected] = useState(systems[0].id);
  const [filter,setFilter] = useState('ALL');
  const current = systems.find(s=>s.id===selected) || systems[0];
  const visibleObligations = useMemo(()=>filter==='ALL' ? obligations : obligations.filter(o=>o[3]===filter),[filter]);
  const totals = useMemo(()=>systems.reduce((a,s)=>({obligations:a.obligations+s.obligations,supported:a.supported+s.supported,gaps:a.gaps+s.gaps,stale:a.stale+s.stale,review:a.review+s.review}),{obligations:0,supported:0,gaps:0,stale:0,review:0}),[]);

  return <main className="shell">
    <div className="cosmos" aria-hidden="true"><i className="stars one"/><i className="stars two"/><i className="orb o1"/><i className="orb o2"/><i className="beam b1"/><i className="beam b2"/></div>

    <nav className="topbar">
      <Link href="/eu-ai-act" className="brand">TA-14 <span>· EU AI ACT WORLD</span></Link>
      <div className="navlinks"><Link href="/eu-ai-act/classifier">CLASSIFIER</Link><Link href="/eu-ai-act/commercial">ACCESS</Link><Link href="/">INSTITUTION</Link></div>
    </nav>

    <header className="hero">
      <div>
        <span className="eyebrow">GOVERNED WORLD 05 · OPERATING ENVIRONMENT</span>
        <h1>EU AI ACT<br/><em>COMMAND CENTER</em></h1>
        <p>Know what applies. Know why. Know what evidence supports it. Know what changed. Know whether yesterday&apos;s determination can still be relied upon today.</p>
        <div className="heroActions"><Link href="/eu-ai-act/classifier" className="primary">ADD / CLASSIFY A SYSTEM →</Link><Link href="/eu-ai-act" className="secondary">OPEN LAW WORLD</Link></div>
      </div>
      <aside className="pulsePanel">
        <span>PORTFOLIO STATE</span><strong>{systems.length}</strong><b>AI SYSTEMS UNDER GOVERNANCE</b>
        <div className="pulseLine"><i/><span>Evidence state live</span></div>
      </aside>
    </header>

    <section className="truthBar"><strong>THE REPRESENTATION DOES NOT ESTABLISH THE UNDERLYING CONDITION.</strong><span>The condition has to be independently supported by the relevant evidence.</span></section>

    <section className="metricGrid">
      <article><span>APPLICABLE / MAPPED</span><strong>{totals.obligations}</strong><small>obligations</small></article>
      <article className="good"><span>SUPPORTED</span><strong>{totals.supported}</strong><small>with current evidence</small></article>
      <article className="warn"><span>EVIDENCE GAPS</span><strong>{totals.gaps}</strong><small>unsupported routes</small></article>
      <article className="stale"><span>STALE</span><strong>{totals.stale}</strong><small>reliance at risk</small></article>
      <article className="review"><span>REVIEW REQUIRED</span><strong>{totals.review}</strong><small>human determination</small></article>
    </section>

    <section className="section">
      <div className="sectionHead"><div><span className="eyebrow">TODAY</span><h2>What requires attention now?</h2></div><span className="live">● LIVE GOVERNANCE STATE</span></div>
      <div className="actionList">{actions.map(([n,title,copy,cta])=><article key={n}><span className="num">{n}</span><div><h3>{title}</h3><p>{copy}</p></div><button>{cta} →</button></article>)}</div>
    </section>

    <section className="section">
      <div className="sectionHead"><div><span className="eyebrow">SYSTEM PASSPORTS</span><h2>One identity. Every obligation. Every change.</h2><p>Each system carries a persistent governed identity across classification, evidence, review, change, and revalidation.</p></div><Link href="/eu-ai-act/classifier" className="textLink">CREATE PASSPORT →</Link></div>
      <div className="passportGrid">{systems.map(s=><button key={s.id} className={`passport ${selected===s.id?'active':''}`} onClick={()=>setSelected(s.id)}><div className="passportTop"><span>{s.id}</span><b className={badgeClass(s.state)}>{s.state}</b></div><h3>{s.name}</h3><p>VERSION {s.version} · {s.role}</p><div className="passportMeta"><span>{s.risk}</span><span>{s.jurisdiction}</span></div><div className="miniStats"><i><b>{s.supported}</b> supported</i><i><b>{s.gaps}</b> gaps</i><i><b>{s.stale}</b> stale</i><i><b>{s.review}</b> review</i></div></button>)}</div>
    </section>

    <section className="systemFocus section">
      <div className="focusHead"><div><span className="eyebrow">ACTIVE PASSPORT</span><h2>{current.name}</h2><p>{current.id} · VERSION {current.version} · {current.role} · {current.jurisdiction}</p></div><div className={`bigState ${badgeClass(current.state)}`}>{current.state}</div></div>
      <div className="chain"><span>REALITY</span><i>→</i><span>RECORD</span><i>→</i><span>CONTINUITY</span><i>→</i><span>ADMISSIBILITY</span><i>→</i><span>BINDING</span><i>→</i><span>COMMIT</span><i>→</i><span>EXECUTION</span><i>→</i><span>OUTCOME</span></div>
      <div className="focusGrid"><article><span>RISK PATH</span><strong>{current.risk}</strong><p>Classification remains bounded to the recorded system, role, intended purpose, jurisdiction and evidence state.</p></article><article><span>OBLIGATION STATE</span><strong>{current.supported} / {current.obligations}</strong><p>Supported does not mean globally compliant. It means the mapped proposition currently has evidence within its stated boundary.</p></article><article><span>RELIANCE PRESSURE</span><strong>{current.stale + current.review}</strong><p>Items require freshness review or a new determination before prior reliance should continue.</p></article></div>
    </section>

    <section className="section">
      <div className="sectionHead"><div><span className="eyebrow">OBLIGATION LEDGER</span><h2>Stop counting checkboxes. Govern propositions.</h2><p>Every obligation carries source, applicability, evidence, state, chronology and the reason that state exists.</p></div><div className="filters">{['ALL','SUPPORTED','CONDITIONAL','EVIDENCE GAP','STALE','REVIEW REQUIRED'].map(f=><button className={filter===f?'on':''} onClick={()=>setFilter(f)} key={f}>{f}</button>)}</div></div>
      <div className="ledger"><div className="ledgerRow header"><span>ID</span><span>SOURCE</span><span>OBLIGATION</span><span>STATE</span><span>EVIDENCE / ISSUE</span><span>LAST ESTABLISHED</span></div>{visibleObligations.map(o=><div className="ledgerRow" key={o[0]}><span>{o[0]}</span><span>{o[1]}</span><strong>{o[2]}</strong><span><b className={`pill ${badgeClass(o[3])}`}>{o[3]}</b></span><span>{o[4]}</span><span>{o[5]}</span></div>)}</div>
    </section>

    <section className="split section">
      <div><span className="eyebrow">CHANGE RADAR</span><h2>When reality moves, prior reliance is questioned.</h2><p className="lead">A model update, vendor change, deployment change or source delta can affect evidence without making the historical record false.</p><div className="changeList">{changes.map(c=><article key={c[1]+c[2]}><b>{c[0]}</b><div><strong>{c[1]}</strong><span>{c[2]}</span><p>{c[3]}</p></div><em>{c[4]}</em></article>)}</div></div>
      <aside className="revalidate"><span>REVALIDATION ENGINE</span><strong>20</strong><h3>prior reliance points under pressure</h3><p>TA-14 does not silently carry yesterday&apos;s evidence into today&apos;s changed condition.</p><button>OPEN IMPACT GRAPH →</button></aside>
    </section>

    <section className="section graphSection">
      <div className="sectionHead"><div><span className="eyebrow">REGULATORY EVIDENCE GRAPH</span><h2>See the chain behind the claim.</h2></div></div>
      <div className="graph">{graphNodes.map((n,i)=><div className="nodeWrap" key={n[0]}><article className="node"><span>{n[0]}</span><strong>{n[1]}</strong></article>{i<graphNodes.length-1?<i className="connector">→</i>:null}</div>)}</div>
    </section>

    <section className="section examiner">
      <div><span className="eyebrow">CONTROLLED EXAMINATION</span><h2>Stop emailing mystery folders.</h2><p>Open a governed examiner room where counsel, auditors, buyers, assurance teams or regulators can inspect the exact relationship between obligation, evidence, version, limitation, review and change.</p></div><div className="examCards"><article><span>01</span><h3>Choose scope</h3><p>Expose only the systems, obligations and evidence the examination requires.</p></article><article><span>02</span><h3>Preserve boundaries</h3><p>Protected evidence does not travel merely because a finding or summary does.</p></article><article><span>03</span><h3>Record challenge</h3><p>Questions, objections, corrections and determinations remain attributable and dated.</p></article><article><span>04</span><h3>Close honestly</h3><p>The record shows what was established, what was not, and when the evidentiary interval ended.</p></article></div><button className="primary disabled">EXAMINER ROOMS · NEXT RELEASE</button>
    </section>

    <section className="section atlasPanel"><div className="atlasOrb">A</div><div><span className="eyebrow">ATLAS · GOVERNED EXAMINER</span><h2>Don&apos;t ask a generic chatbot. Ask your governed record.</h2><p>Atlas will reason over the recorded system identity, mapped obligations, admitted evidence, source state, limitations and change history — while preserving the difference between assistance and a legal or regulatory determination.</p><div className="prompt">“What am I missing before I can rely on this Article 50 route?” <button>ASK ATLAS →</button></div></div></section>

    <section className="section commercial"><span className="eyebrow">FROM READING THE LAW TO OPERATING UNDER IT</span><h2>The EU AI Act world should become infrastructure your organization keeps open.</h2><p>Start with classification. Build a persistent passport. Map obligations. Attach evidence. Preserve decisions. Detect change. Revalidate reliance. Open controlled examination when scrutiny arrives.</p><div><Link href="/eu-ai-act/classifier" className="primary">START WITH MY SYSTEM →</Link><Link href="/eu-ai-act/commercial" className="secondary">VIEW ACCESS LEVELS →</Link></div></section>

    <footer><Link href="/">TA-14 AUTHORITY GOVERNANCE INSTITUTION</Link><span>EU AI ACT WORLD · GOVERNED WORLD 05</span><span>Evidence readiness is not legal advice, certification, regulatory approval, CE marking, or notified-body conformity assessment.</span></footer>

    <style jsx>{`
      *{box-sizing:border-box}.shell{min-height:100vh;background:#02050a;color:#eef6ff;font-family:Inter,ui-sans-serif,system-ui,sans-serif;overflow:hidden;position:relative}.cosmos{position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(circle at 50% -10%,#0b3971 0,transparent 38%),radial-gradient(circle at 10% 40%,#071d3c 0,transparent 32%),linear-gradient(#02050a,#010205)}.stars{position:absolute;inset:-30%;background-image:radial-gradient(#fff 0.7px,transparent .8px);background-size:43px 43px;opacity:.18;animation:drift 70s linear infinite}.stars.two{background-size:71px 71px;opacity:.12;animation-duration:110s;transform:rotate(12deg)}.orb{position:absolute;border-radius:50%;filter:blur(1px);opacity:.3}.o1{width:360px;height:360px;right:-160px;top:18%;background:radial-gradient(circle at 35% 30%,#6ce7ff,#124d9d 20%,#03101e 70%);box-shadow:0 0 100px #1674d7}.o2{width:180px;height:180px;left:-90px;top:68%;background:radial-gradient(circle at 40% 30%,#ffe09a,#744d10 25%,#090704 70%)}.beam{position:absolute;height:1px;width:70vw;background:linear-gradient(90deg,transparent,#54c8ff,transparent);opacity:.18;transform:rotate(-18deg)}.b1{top:26%;left:-10%}.b2{top:74%;right:-10%;transform:rotate(13deg)}.topbar,.hero,.truthBar,.metricGrid,.section,footer{position:relative;z-index:1;max-width:1540px;margin-left:auto;margin-right:auto}.topbar{padding:28px 4vw;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #15314c}.brand,.navlinks a{color:#eef6ff;text-decoration:none;font-weight:900;letter-spacing:.12em;font-size:11px}.brand span{color:#70dcff}.navlinks{display:flex;gap:24px}.hero{padding:90px 4vw 70px;display:grid;grid-template-columns:1fr 330px;gap:70px;align-items:center}.eyebrow{color:#6ddcff;font-size:10px;letter-spacing:.26em;font-weight:900}.hero h1{font-family:Georgia,serif;font-size:clamp(58px,8vw,118px);line-height:.82;margin:22px 0 30px;letter-spacing:-.045em}.hero h1 em{font-style:normal;color:#78e5ff;text-shadow:0 0 34px #1579b5}.hero p,.lead{color:#a9bed1;line-height:1.8;font-size:17px;max-width:900px}.heroActions,.commercial>div{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.primary,.secondary{display:inline-block;padding:15px 18px;text-decoration:none;font-size:10px;letter-spacing:.12em;font-weight:900;border-radius:8px}.primary{background:#78e5ff;color:#03101a;border:1px solid #78e5ff}.secondary{color:#dcecff;border:1px solid #315270;background:#07111c}.pulsePanel{border:1px solid #255579;background:linear-gradient(180deg,#071a2d,#040a12);padding:32px;border-radius:24px;box-shadow:0 0 70px #0c4f7c33}.pulsePanel>span{font-size:9px;letter-spacing:.22em;color:#73dcff}.pulsePanel>strong{font-size:94px;font-family:Georgia,serif;display:block;line-height:1;margin-top:20px}.pulsePanel>b{font-size:9px;letter-spacing:.14em;color:#9bb0c2}.pulseLine{display:flex;align-items:center;gap:10px;margin-top:30px;color:#7fe4c5;font-size:11px}.pulseLine i{width:9px;height:9px;background:#65e7bd;border-radius:50%;box-shadow:0 0 16px #65e7bd}.truthBar{margin-top:10px;padding:22px 4vw;border:1px solid #725d26;background:linear-gradient(90deg,#171206,#080b10);display:flex;gap:20px;justify-content:center;flex-wrap:wrap;color:#ffe49a}.truthBar strong{letter-spacing:.08em}.truthBar span{color:#b9aa7e}.metricGrid{padding:28px 4vw 20px;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.metricGrid article{border:1px solid #18354d;background:#06101a;padding:22px;border-radius:16px}.metricGrid span{display:block;font-size:8px;letter-spacing:.18em;color:#7897b0}.metricGrid strong{display:block;font:52px Georgia,serif;margin:9px 0}.metricGrid small{color:#8298aa}.metricGrid .good strong{color:#75e5bd}.metricGrid .warn strong{color:#ffd36f}.metricGrid .stale strong{color:#ff9b71}.metricGrid .review strong{color:#d9a0ff}.section{padding:85px 4vw;border-top:1px solid #10283c}.sectionHead,.focusHead{display:flex;justify-content:space-between;gap:30px;align-items:end;margin-bottom:34px}.section h2{font:clamp(34px,4vw,62px)/1 Georgia,serif;margin:10px 0 0}.sectionHead p{max-width:760px;color:#91a9bc;line-height:1.7}.live{color:#6fe4bc;font-size:9px;letter-spacing:.16em}.actionList{display:grid;gap:8px}.actionList article{display:grid;grid-template-columns:50px 1fr auto;gap:20px;align-items:center;border:1px solid #18364f;background:linear-gradient(90deg,#071522,#050a11);padding:20px 22px;border-radius:14px}.num{font:28px Georgia,serif;color:#4fcce9}.actionList h3{margin:0 0 5px}.actionList p{margin:0;color:#849caf;font-size:12px}.actionList button,.revalidate button{border:1px solid #3a6788;background:#0a1c2b;color:#bfeaff;padding:12px 14px;border-radius:7px;font-size:8px;font-weight:900;letter-spacing:.1em}.textLink{color:#73dcff;text-decoration:none;font-size:10px;font-weight:900;letter-spacing:.12em}.passportGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.passport{text-align:left;color:#eaf5ff;border:1px solid #183950;background:#06111c;padding:22px;border-radius:18px;cursor:pointer}.passport.active{border-color:#62d9ff;box-shadow:0 0 32px #2cb8e51c;background:linear-gradient(180deg,#0a2031,#06111c)}.passportTop{display:flex;justify-content:space-between;gap:8px;font-size:8px;color:#7795aa}.passportTop b,.pill,.bigState{font-size:7px;letter-spacing:.08em;padding:6px 8px;border:1px solid #345166;border-radius:999px}.passport h3{font-size:20px;margin:24px 0 7px}.passport>p{font-size:9px;color:#7594aa}.passportMeta{display:flex;gap:6px;flex-wrap:wrap;margin:20px 0}.passportMeta span{border:1px solid #1e3c52;padding:6px;color:#8db1c8;font-size:8px}.miniStats{display:grid;grid-template-columns:1fr 1fr;gap:6px}.miniStats i{font-style:normal;font-size:8px;color:#7994a7}.miniStats b{color:#d9f4ff}.supported{color:#69dfb5!important;border-color:#2a765d!important}.conditional{color:#78dfff!important;border-color:#286d82!important}.evidence-gap{color:#ffd36f!important;border-color:#806728!important}.stale{color:#ff9a74!important;border-color:#80452f!important}.review-required{color:#dda8ff!important;border-color:#70468b!important}.systemFocus{background:linear-gradient(180deg,#050d16,#02060b)}.focusHead p{color:#7f9aaf}.bigState{font-size:10px;padding:12px 16px}.chain{display:flex;align-items:center;justify-content:space-between;gap:8px;overflow:auto;padding:20px;border:1px solid #1c4059;background:#07131e;border-radius:12px}.chain span{font-size:8px;letter-spacing:.12em;font-weight:900;color:#a7cce2;white-space:nowrap}.chain i{font-style:normal;color:#3cccf1}.focusGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:12px}.focusGrid article{padding:24px;border:1px solid #18374e;background:#06101a;border-radius:14px}.focusGrid span{font-size:8px;letter-spacing:.16em;color:#6ed9f7}.focusGrid strong{display:block;font:28px Georgia,serif;margin:14px 0}.focusGrid p{color:#8199ab;font-size:11px;line-height:1.7}.filters{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.filters button{border:1px solid #24465d;background:#07131d;color:#789bb2;padding:8px 9px;font-size:7px;border-radius:999px}.filters button.on{color:#061018;background:#6eddf8;border-color:#6eddf8}.ledger{border:1px solid #19384e;border-radius:14px;overflow:hidden}.ledgerRow{display:grid;grid-template-columns:90px 100px 1.1fr 150px 1.3fr 130px;gap:12px;padding:15px 18px;border-top:1px solid #102a3d;align-items:center;font-size:10px;color:#8ea6b8}.ledgerRow.header{border-top:0;background:#091724;color:#6bd9f8;font-size:7px;letter-spacing:.12em}.ledgerRow strong{color:#d8e7f1}.pill{display:inline-block}.split{display:grid;grid-template-columns:1fr 360px;gap:50px}.changeList{display:grid;gap:8px;margin-top:28px}.changeList article{display:grid;grid-template-columns:110px 1fr 70px;gap:15px;padding:18px;border:1px solid #19384d;background:#06111b;border-radius:12px}.changeList>article>b{font-size:7px;color:#6ddcfb;letter-spacing:.12em}.changeList div span{display:block;color:#7896aa;font-size:9px;margin:5px 0}.changeList p{margin:0;color:#9fb0bd;font-size:11px}.changeList em{font-style:normal;color:#ffd170;font-size:8px;text-align:right}.revalidate{border:1px solid #7b5e25;background:radial-gradient(circle at 50% 0,#31250b,#0a0b0d 65%);border-radius:24px;padding:34px;align-self:start}.revalidate>span{font-size:8px;letter-spacing:.18em;color:#ffd470}.revalidate>strong{display:block;font:90px Georgia,serif;color:#ffe19a;margin-top:18px}.revalidate h3{font:25px Georgia,serif}.revalidate p{color:#a99c7a;line-height:1.7}.graph{display:flex;align-items:center;overflow:auto;padding:30px 10px}.nodeWrap{display:flex;align-items:center}.node{width:145px;min-height:100px;border:1px solid #235372;background:radial-gradient(circle at 50% 0,#0d2b42,#06101a);border-radius:50%;display:grid;place-content:center;text-align:center;padding:14px;box-shadow:0 0 28px #1a8fc31c}.node span{font-size:7px;color:#68d7f5;letter-spacing:.13em}.node strong{font-size:11px;margin-top:7px}.connector{font-style:normal;color:#43c9ed;font-size:20px;margin:0 8px}.examiner{background:radial-gradient(circle at 50% 0,#0b2237,#03070c 60%)}.examiner>div:first-child{max-width:850px}.examiner>div:first-child p{color:#96adbe;line-height:1.8}.examCards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:34px 0}.examCards article{padding:24px;border:1px solid #21425a;background:#07121c;border-radius:15px}.examCards span{color:#68d9f8;font:24px Georgia,serif}.examCards h3{margin:16px 0 8px}.examCards p{color:#819aac;font-size:11px;line-height:1.7}.disabled{border:0;opacity:.7}.atlasPanel{display:grid;grid-template-columns:160px 1fr;gap:40px;align-items:center}.atlasOrb{width:140px;height:140px;border-radius:50%;display:grid;place-items:center;font:70px Georgia,serif;background:radial-gradient(circle at 35% 25%,#e9fbff,#55cbea 12%,#0d4f7c 35%,#02070c 72%);box-shadow:0 0 70px #2dc8f44d}.atlasPanel p{color:#96adbe;line-height:1.8;max-width:900px}.prompt{margin-top:24px;border:1px solid #23506b;background:#071521;padding:18px;border-radius:12px;color:#b9d4e5;display:flex;justify-content:space-between;gap:20px;align-items:center}.prompt button{border:0;background:#72e0fb;color:#031018;padding:11px 14px;font-weight:900;font-size:8px}.commercial{text-align:center;padding-top:110px;padding-bottom:110px;background:radial-gradient(circle at 50% 40%,#0b2d46,#02060b 65%)}.commercial p{max-width:900px;margin:20px auto;color:#9ab1c2;line-height:1.8;font-size:16px}.commercial>div{justify-content:center}footer{padding:30px 4vw 60px;border-top:1px solid #153048;display:flex;gap:24px;justify-content:space-between;color:#607d92;font-size:8px;letter-spacing:.08em}footer a{color:#8bcbe0;text-decoration:none}@keyframes drift{to{transform:translate3d(180px,100px,0) rotate(4deg)}}@media(max-width:1050px){.hero,.split{grid-template-columns:1fr}.metricGrid{grid-template-columns:repeat(2,1fr)}.passportGrid,.examCards{grid-template-columns:repeat(2,1fr)}.ledger{overflow:auto}.ledgerRow{min-width:950px}.pulsePanel{max-width:500px}.atlasPanel{grid-template-columns:1fr}.atlasOrb{width:100px;height:100px;font-size:48px}}@media(max-width:650px){.navlinks{display:none}.hero{padding-top:60px}.hero h1{font-size:52px}.metricGrid,.passportGrid,.examCards,.focusGrid{grid-template-columns:1fr}.sectionHead,.focusHead{align-items:flex-start;flex-direction:column}.actionList article{grid-template-columns:40px 1fr}.actionList button{grid-column:2}.changeList article{grid-template-columns:1fr}.split{gap:25px}.prompt{align-items:flex-start;flex-direction:column}footer{flex-direction:column}.truthBar{justify-content:flex-start}}
    `}</style>
  </main>;
}
