import Link from "next/link";

const chain = ["REALITY","RECORD","CONTINUITY","ADMISSIBILITY","BINDING","COMMIT","EXECUTION","OUTCOME"];
const contexts = ["HOME","VEHICLE","TRAFFIC","STREET","WORKPLACE","SCHOOL","HOSPITAL","PUBLIC SPACE","TRANSPORTATION"];

const capabilities = [
  ["01","PERSON-CENTERED CONTINUITY","Preserve atmospheric evidence as a person moves across spaces, vehicles, buildings and public environments."],
  ["02","PORTABLE SENSING","Support wearable, handbag, backpack, satchel, phone-associated and other portable sensing implementations without making the carrier the architecture."],
  ["03","ATTRIBUTABLE MEASUREMENT","Bind instrument identity, time, place, calibration state, environmental context and declared limitations to the record."],
  ["04","EXPOSURE CHRONOLOGY","Build time-sequenced histories across indoor, outdoor, vehicle, workplace, healthcare, school and travel contexts."],
  ["05","BOUNDED PROMPTS","Support alerts such as close windows, change route, move away or leave an affected environment when evidence and rules support the prompt."],
  ["06","PROVENANCE & CONTINUITY","Preserve gaps, transitions, corrections, confidence and source lineage instead of silently repairing history."],
  ["07","ADMISSIBILITY","Determine what atmospheric evidence can support now—and explicitly preserve what it cannot support."],
  ["08","GOVERNED RELIANCE","Separate awareness from logged history, continuity-preserved history, admissibility, reliance workflows and bound consequence."],
];

const publicResources = [
  ["PAIR™ PUBLIC SITE","PAIR™ — Personal Atmospheric Integrity Records","https://sites.google.com/view/pair-ta14/home"],
  ["PAIR BOOK · AMAZON","The Lung’s Missing Record: Personal Atmospheric Integrity Records and the Next Medical-Record Layer for the Human Body","https://www.amazon.com/dp/B0H6L6R187"],
  ["TA-14 PUBLIC CORPUS","Search TA-14 publications, books and architecture","/foundation"],
];

const exchangeActions = [
  ["BUILD A GOVERNED RECORD","Create a governed environmental record inside the Exchange.","/workspace/governed-records/build"],
  ["PASTE + INSPECT A RECORD","Bring a record into the governed-record workflow for review.","/workspace/governed-records/paste"],
  ["MY GOVERNED RECORDS","Open the workspace record inventory, including PAIR examples.","/workspace/governed-records/my-records"],
  ["GOVERNED RECORDS","Open the Exchange governed-record environment.","/governed-records"],
  ["ENVIRONMENTAL INTEGRITY GOVERNANCE","Return to the parent Environmental Integrity Governance world.","/environmental-integrity-governance"],
  ["TA-14 PUBLIC CORPUS","Search the public institutional corpus.","/foundation"],
];

export default function PairWorld(){
  return <main className="pairPage">
    <style>{`
      *{box-sizing:border-box}.pairPage{min-height:100vh;background:#050912;color:#eaf7ff;font-family:Arial,Helvetica,sans-serif}.wrap{width:min(1220px,92vw);margin:auto}.hero{padding:88px 0 62px;background:radial-gradient(circle at 72% 30%,rgba(95,55,180,.3),transparent 34%),radial-gradient(circle at 20% 20%,rgba(0,180,220,.16),transparent 35%),linear-gradient(180deg,#07101e,#050912);border-bottom:1px solid #26374b}.eyebrow{letter-spacing:.22em;color:#83ddff;font-size:12px;font-weight:800}.hero h1{font-size:clamp(50px,8vw,104px);line-height:.88;margin:18px 0 20px;letter-spacing:-.055em}.hero h1 span{color:#b494ff}.lead{max-width:930px;font-size:21px;line-height:1.55;color:#bfd0df}.maxim{margin-top:35px;padding:22px 25px;border-left:4px solid #b494ff;background:#0b1423;font-size:22px;font-weight:800}.chain{display:flex;flex-wrap:wrap;gap:8px;margin-top:26px}.chain span{font-size:11px;border:1px solid #2e455c;padding:9px 11px;background:#091321}.heroActions{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}.button{display:inline-block;padding:14px 17px;text-decoration:none;font-weight:800;font-size:12px;border:1px solid #69dcff;color:#fff;background:#0b1828}.primary{background:#b494ff;color:#080d16;border-color:#b494ff}.section{padding:70px 0;border-bottom:1px solid #1c2a3a}.section h2{font-size:42px;margin:8px 0 14px}.intro{max-width:930px;color:#aebfd0;line-height:1.65;font-size:18px}.context{display:grid;grid-template-columns:repeat(9,1fr);gap:7px;margin-top:30px}.context div{padding:22px 8px;text-align:center;border:1px solid #29415b;background:#0a1422;font-size:11px;font-weight:800}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:32px}.card{background:linear-gradient(145deg,#0b1625,#07101b);border:1px solid #253d56;padding:24px}.card b{color:#b494ff}.card h3{margin:9px 0}.card p{color:#aebfd0;line-height:1.55}.ladder{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-top:30px}.ladder div{background:#0c1725;border-top:3px solid #68d8ff;padding:20px 12px;min-height:112px;font-weight:800;font-size:13px}.pubs,.actions{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:30px}.pub,.action{display:block;text-decoration:none;color:#fff;border:1px solid #35516d;background:#0b1624;padding:24px}.pub:hover,.action:hover{border-color:#8fdfff}.pub small,.action b{color:#72dfff;letter-spacing:.1em}.pub h3{margin:8px 0}.pub p,.action span{color:#aebfd0;line-height:1.5}.principle{padding:28px;border:1px solid #533f67;background:rgba(180,148,255,.08);margin-top:30px}.principle h3{font-size:28px;margin-top:0}.principle p{color:#c8d3de;line-height:1.65}.warning{color:#ffb1b1;font-size:13px;margin-top:18px;max-width:930px;line-height:1.5}.footer{padding:60px 0 90px;text-align:center}.footer h2{font-size:46px;margin:0}.footer p{color:#aebfd0}@media(max-width:850px){.context{grid-template-columns:repeat(3,1fr)}.grid,.pubs,.actions{grid-template-columns:1fr}.ladder{grid-template-columns:repeat(2,1fr)}}
    `}</style>

    <section className="hero"><div className="wrap">
      <div className="eyebrow">ENVIRONMENTAL INTEGRITY GOVERNANCE · DEDICATED PAIR™ WORLD</div>
      <h1>PERSONAL ATMOSPHERIC<br/><span>INTEGRITY RECORDS</span></h1>
      <p className="lead">PAIR™ is the person-centered atmospheric continuity layer inside Environmental Integrity Governance: a governed record of the conditions encountered by an individual across places, transitions and durations—preserving measurement, provenance, limitations, continuity and future reliance without turning atmospheric evidence into unsupported medical certainty.</p>
      <div className="maxim">THE PERSON MOVES. THE ATMOSPHERE CHANGES. THE RECORD REMAINS.</div>
      <div className="chain">{chain.map(x=><span key={x}>{x}</span>)}</div>
      <div className="heroActions"><a className="button primary" href="https://sites.google.com/view/pair-ta14/home" target="_blank" rel="noreferrer">OPEN PAIR™ PUBLIC SITE →</a><a className="button" href="https://www.amazon.com/dp/B0H6L6R187" target="_blank" rel="noreferrer">READ THE LUNG’S MISSING RECORD →</a><Link className="button" href="/workspace/governed-records/build">BUILD A GOVERNED RECORD →</Link></div>
    </div></section>

    <section className="section"><div className="wrap"><div className="eyebrow">THE MISSING INDIVIDUAL LAYER</div><h2>One person. Multiple environments. One attributable chronology.</h2><p className="intro">PAIR™ is not merely a wearable, sensor, dashboard or alert. Those may participate. The architecture preserves what air was encountered, where and when it was encountered, which instrument or source produced the evidence, what changed during transitions, where continuity was lost, what the record can support, and what remains unknown.</p><div className="context">{contexts.map(x=><div key={x}>{x}</div>)}</div></div></section>

    <section className="section"><div className="wrap"><div className="eyebrow">PAIR™ ARCHITECTURE</div><h2>From sensing to governed reliance.</h2><div className="grid">{capabilities.map(([n,t,p])=><article className="card" key={n}><b>{n}</b><h3>{t}</h3><p>{p}</p></article>)}</div><div className="ladder">{["AWARENESS","LOGGED HISTORY","CONTINUITY-PRESERVED HISTORY","ADMISSIBILITY","RELIANCE WORKFLOWS","BOUND CONSEQUENCE"].map((x,i)=><div key={x}><small>LEVEL {i+1}</small><br/><br/>{x}</div>)}</div><div className="principle"><h3>Atmospheric evidence is not medical diagnosis.</h3><p>PAIR™ preserves environmental continuity so future interpretation can begin from a stronger record. It does not silently convert a sensor reading, exposure chronology or environmental association into diagnosis, causation, liability or authority to intervene.</p></div></div></section>

    <section className="section"><div className="wrap"><div className="eyebrow">PAIR™ PUBLIC RESOURCES</div><h2>Architecture, publication and public corpus.</h2><p className="intro">These references focus on TA-14’s own PAIR™ architecture and publications.</p><div className="pubs">{publicResources.map(([k,t,h])=>h.startsWith("http")?<a className="pub" href={h} key={t} target="_blank" rel="noreferrer"><small>{k}</small><h3>{t} →</h3><p>{h}</p></a>:<Link className="pub" href={h} key={t}><small>{k}</small><h3>{t} →</h3></Link>)}</div></div></section>

    <section className="section"><div className="wrap"><div className="eyebrow">PAIR™ INSIDE THE EXCHANGE</div><h2>Move from explanation into governed record work.</h2><p className="intro">The dedicated PAIR™ world connects the architecture to working governed-record pathways inside TA-14 Exchange.</p><div className="actions">{exchangeActions.map(([t,p,h])=><Link className="action" href={h} key={t}><b>{t} →</b><br/><br/><span>{p}</span></Link>)}</div><p className="warning">PAIR™ records atmospheric and environmental evidence. It does not, by itself, establish medical diagnosis, individual causation, legal liability or patent infringement. Those determinations require their own competent evidence, method and authority.</p></div></section>

    <footer className="footer"><div className="wrap"><div className="eyebrow">TA-14 AUTHORITY · ENVIRONMENTAL INTEGRITY GOVERNANCE · PAIR™</div><h2>PRESERVE THE RECORD.</h2><p>The person moves. The atmosphere changes. The record remains.</p><Link className="button" href="/environmental-integrity-governance">← RETURN TO ENVIRONMENTAL INTEGRITY GOVERNANCE</Link></div></footer>
  </main>
}
