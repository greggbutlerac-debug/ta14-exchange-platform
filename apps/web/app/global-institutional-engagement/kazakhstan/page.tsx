import Link from 'next/link';
import { SixthWorldShowroomRail } from '../../../components/sixth-world-showroom-rail';

export const metadata={
  title:'Kazakhstan · Ministry of Ecology and Natural Resources | TA-14',
  description:'TA-14 country-specific technical examination showroom for Kazakhstan, Kazhydromet, environmental monitoring, evidence continuity and authorized consequence.'
};

const chain=[
  ['Шындық','Реальность','Reality'],
  ['Жазба','Запись','Record'],
  ['Үздіксіздік','Непрерывность','Continuity'],
  ['Қолайлылық','Допустимость','Admissibility'],
  ['Байлау','Связывание','Binding'],
  ['Бекіту','Фиксация','Commit'],
  ['Орындау','Исполнение','Execution'],
  ['Нәтиже','Результат','Outcome'],
];

const milestones=[
  ['2021','Environmental Code and automated emissions monitoring','Kazakhstan strengthened statutory environmental monitoring, emissions transparency and automated monitoring requirements for major industrial operators.'],
  ['2024','National Development Plan through 2029','The national plan reinforced cleaner production, best available techniques, technical regulation, metrology and laboratory capacity as part of environmental modernization.'],
  ['2025','BAT transition begins for major enterprises','Large operators move into integrated environmental permitting and best available techniques, creating a stronger link between measured emissions, compliance and corrective action.'],
  ['2025-2026','Real-time industrial monitoring expands','Official ministry reporting states that dozens of Category I operators are already transmitting automated emissions-monitoring data in real time.'],
  ['29 Jun 2026','Ministry Development Plan 2026-2030','The Ministry published its current five-year institutional development plan, giving this showroom a defined planning horizon for a bounded technical examination.'],
  ['2026','National monitoring remains active at scale','Kazhydromet reports atmospheric-air monitoring across 70 settlements, 175 observation posts and mobile laboratories, including 131 continuous automatic posts.'],
];

const architecture=[
  ['Kazhydromet + state monitoring','NATIVE','Preserve Kazakhstan’s observation networks, laboratories, public bulletins, AirKZ/public information and official monitoring authority.'],
  ['Industrial automated emissions data','NATIVE','Preserve operator-side automated emissions monitoring and direct regulatory data flows already required by Kazakhstan’s environmental framework.'],
  ['Evidence identity + context','AIR','Bind source, station/operator, location, timestamp, method, operating state, pollutant, threshold context, calibration/quality status and known limitations.'],
  ['Evidence sufficiency','EIG','Test chronology, currentness, conflicts, changed conditions and what bounded proposition the record actually supports.'],
  ['Authority boundary','AEA','Separate evidence from permission before a consequential inspection, restriction, intervention, escalation or other authorized action.'],
  ['Verified result','AIR + EIG','Preserve what happened after action and require revalidation before prior evidence or authority is silently reused.'],
];

const demo=[
  ['1','Choose one native evidence path','Select a bounded Kazakhstan case: one Kazhydromet air-quality condition, one industrial automated-emissions event, or one linked public/regulatory scenario.'],
  ['2','Freeze the proposition','Define the exact claim, data inputs, quality state, applicable threshold, falsifier, authority path and proposed consequence before examination.'],
  ['3','Create the AIR','Preserve who/what produced the observation, where, when, by which method, under what operating context and with what limitations.'],
  ['4','Run EIG prospectively','Determine whether the record remains continuous, attributable, current and sufficient for the proposed proposition.'],
  ['5','Expose AEA','If consequence is proposed, verify that the exact institution, official, system or operator has current authority for that exact action.'],
  ['6','Return the outcome','Preserve action and result, compare against the frozen pre-action state, and require revalidation when conditions or authority change.'],
];

const sources=[
  ['Ministry of Ecology and Natural Resources · Development Plan 2026-2030','https://www.gov.kz/memleket/entities/ecogeo/documents/details/1033645?lang=ru'],
  ['Ministry · State environmental monitoring and environmental bulletins','https://www.gov.kz/memleket/entities/ecogeo/activities/14830?parentId=14790'],
  ['Kazhydromet · Monitoring the state of the environment','https://www.kazhydromet.kz/en/ecology/monitoring-sostoyaniya-okruzhayuschey-sredy'],
  ['Kazhydromet · About environmental monitoring','https://www.kazhydromet.kz/en/ecology/ob-ekologicheskom-monitoringe'],
  ['Environmental Code of the Republic of Kazakhstan','https://www.gov.kz/memleket/entities/ecogeo/documents/details/188628?lang=ru'],
  ['National Development Plan through 2029 · environmental direction','https://www.gov.kz/memleket/entities/ecogeo/press/news/details/836261?lang=ru'],
  ['Ministry · digitalization of environmental control / automated monitoring','https://www.gov.kz/memleket/entities/ecogeo/press/news/details/1168187?lang=ru'],
];

export default function KazakhstanShowroom(){return <main className="page">
  <div className="kzStripe"><i/><i/></div>
  <div className="sky" aria-hidden="true"><div className="grid"/><div className="orb one"/><div className="orb two"/></div>
  <nav className="nav shell">
    <Link href="/" className="brand"><span>TA</span><b>TA-14 AUTHORITY</b></Link>
    <div><a href="#architecture">ARCHITECTURE</a><a href="#demonstration">EXAMINATION</a><a href="#sources">OFFICIAL SOURCES</a></div>
  </nav>

  <section className="hero shell">
    <div className="bilateral">
      <div className="country"><div className="emojiFlag" aria-label="Flag of Kazakhstan">🇰🇿</div><div><b>ҚАЗАҚСТАН РЕСПУБЛИКАСЫ</b><small>ЭКОЛОГИЯ ЖӘНЕ ТАБИҒИ РЕСУРСТАР МИНИСТРЛІГІ</small></div></div>
      <div className="bridge">INSTITUTIONAL EXAMINATION ↔</div>
      <div className="country right"><div><b>TA-14 AUTHORITY · UNITED STATES</b><small>INDEPENDENT GOVERNANCE INSTITUTION</small></div><div className="emojiFlag" aria-label="Flag of the United States">🇺🇸</div></div>
    </div>
    <p className="eyebrow">KAZAKHSTAN · MINISTRY OF ECOLOGY AND NATURAL RESOURCES · PUBLIC TECHNICAL SHOWROOM</p>
    <h1>Өлшеуден басқарылатын салдарға дейін.<br/><em>От измерения к управляемому последствию.</em></h1>
    <p className="englishTitle">From environmental measurement to governed consequence.</p>
    <p className="lead">A TA-14 examination environment built around Kazakhstan’s existing state environmental monitoring, Kazhydromet atmospheric-air network, industrial automated emissions monitoring, Environmental Code and the Ministry’s 2026-2030 development horizon. The proposition is complementary: <b>keep Kazakhstan’s native systems and authority intact, and examine the evidence-and-authority handoff before consequence.</b></p>
    <div className="status"><span>FORMAL MINISTRY LETTER REQUESTED</span><span>2026-2030 HORIZON</span><span>KAZAKH + RUSSIAN + ENGLISH</span><span>NO ENDORSEMENT IMPLIED</span></div>
    <div className="heroGrid">
      <article><span>KAZAKHSTAN DIRECTION</span><strong>A large native monitoring and regulatory evidence system already exists.</strong><p>State monitoring integrates environmental observations and analysis for management and economic decision-making; Kazhydromet maintains the national atmospheric-air observation layer while industrial monitoring increasingly supplies real-time regulatory data.</p></article>
      <article><span>TA-14 QUESTION</span><strong>When has environmental evidence earned consequence?</strong><p>When does a valid observation or emissions signal become sufficiently attributable, current, continuous, legally bound and authorized to support inspection, restriction, intervention, escalation or another consequential action?</p></article>
    </div>
    <div className="rule"><small>THE GOVERNING RULE</small><b>No admissible environmental evidence. No admissible environmental execution.</b></div>
  </section>

  <SixthWorldShowroomRail current="kazakhstan"/>

  <section className="shell section">
    <p className="eyebrow">KAZAKHSTAN HAS ALREADY BUILT THE OBSERVATION SIDE</p>
    <h2>This showroom starts with Kazakhstan’s own infrastructure and planning horizon.</h2>
    <p className="intro">Kazakhstan does not need another generic dashboard. Official sources already describe a multi-layer state monitoring system, continuous automatic air-quality observation, laboratory analysis, public environmental bulletins, operator-side automated emissions monitoring and statutory environmental quality targets. The unresolved governance question sits later: what must remain demonstrably true when evidence begins to trigger consequence?</p>
    <div className="timeline">{milestones.map(([date,title,text])=><article key={date+title}><time>{date}</time><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
  </section>

  <section className="band"><div className="shell section">
    <p className="eyebrow">THE KAZAKHSTAN SEAM</p>
    <h2>Observation, evidence, legal relevance and authority are different states.</h2>
    <div className="quote">Kazakhstan’s unified state environmental monitoring is expressly designed to support management and economic decisions. TA-14 asks what evidence, continuity, binding and authority controls should be preserved between the monitored condition and the decision that follows.</div>
    <div className="three">
      <article><b>01 · OBSERVATION</b><p>Kazhydromet, laboratories and operator systems produce native environmental observations and emissions data.</p></article>
      <article><b>02 · GOVERNED EVIDENCE</b><p>AIR and EIG preserve identity, quality state, chronology, limitations, changed context and the proposition actually supported.</p></article>
      <article><b>03 · AUTHORIZED CONSEQUENCE</b><p>AEA appears only at the execution boundary so data, alerts or analytics cannot silently become permission.</p></article>
    </div>
  </div></section>

  <section id="architecture" className="shell section">
    <p className="eyebrow">PROPOSED COMPLEMENTARY ARCHITECTURE</p>
    <h2>Kazakhstan’s systems remain native. TA-14 governs the handoff.</h2>
    <div className="flow"><span>KAZHYDROMET / OPERATOR DATA</span><i>→</i><span>STATE MONITORING / REGULATORY CONTEXT</span><i>→</i><span className="hot">AIR</span><i>→</i><span className="hot">EIG</span><i>→</i><span className="gold">AEA</span><i>→</i><span>AUTHORIZED CONSEQUENCE</span><i>→</i><span>VERIFIED OUTCOME</span></div>
    <div className="table">{architecture.map(([a,b,c])=><div className="row" key={a}><b>{a}</b><strong>{b}</strong><p>{c}</p></div>)}</div>
    <div className="notice"><b>Boundary:</b> This showroom does not claim Kazakhstan lacks environmental law, technical controls, permitting, monitoring or enforcement authority. It proposes a bounded examination of whether a persistent evidence-and-authority layer can make the transition from observation to consequential action more explicit, inspectable and revalidatable.</div>
  </section>

  <section className="band"><div className="shell section">
    <p className="eyebrow">TA-14 GOVERNING CHAIN</p><h2>One preserved route from reality to outcome.</h2>
    <div className="chain">{chain.map(([kz,ru,en],i)=><article key={en}><span>{String(i+1).padStart(2,'0')}</span><h3>{kz}</h3><small>{ru}</small><p>{en}</p></article>)}</div>
    <div className="states"><b>ALLOW</b><b>HOLD</b><b>DENY</b><b>ESCALATE</b></div>
    <div className="notice"><b>Changed context requires revalidation.</b> The absence of a refusal does not become authority.</div>
  </div></section>

  <section id="demonstration" className="shell section">
    <p className="eyebrow">BOUNDED KAZAKHSTAN TECHNICAL EXAMINATION</p>
    <h2>Start with one native environmental case. Freeze it before the consequence.</h2>
    <div className="demo">{demo.map(([n,t,x])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{x}</p></article>)}</div>
  </section>

  <section className="impact"><div className="shell section">
    <p className="eyebrow">WHY THIS FITS THE 2026-2030 HORIZON</p><h2>More evidentiary value from modernization already underway.</h2>
    <div className="three">
      <article><b>FOR STATE MONITORING</b><p>Observations gain a preserved relationship to the exact proposition, authority and later consequence they support.</p></article>
      <article><b>FOR INDUSTRIAL DIGITALIZATION</b><p>Real-time emissions data can remain evidence, not implicit execution authority; conflicts and changed context can force HOLD or ESCALATE.</p></article>
      <article><b>FOR MINISTRY OVERSIGHT</b><p>The record can show not only what was measured, but what was relied upon, under what authority, what action followed and whether the outcome justified renewed reliance.</p></article>
    </div>
  </div></section>

  <section className="shell section engagement">
    <p className="eyebrow">PRESERVED ENGAGEMENT RECORD</p><h2>Why Kazakhstan is in the Global Institutional Engagement world now.</h2>
    <div className="engagementGrid">
      <article><time>16 SEP 2026</time><b>Institutional outreach</b><p>TA-14 transmitted a bilingual request for a bounded technical conversation on the transition from air-quality evidence to governed action.</p></article>
      <article><time>17 SEP 2026</time><b>Ministry routing response</b><p>The Ministry channel requested that TA-14 submit an official letter addressed formally to the Ministry.</p></article>
      <article><time>NEXT</time><b>Formal Ministry package</b><p>This showroom and the formal institutional letter provide the requested bounded technical context without implying adoption, endorsement or project authorization.</p></article>
    </div>
  </section>

  <section className="shell section">
    <p className="eyebrow">WHAT A FIRST EXAMINATION WOULD REQUIRE</p><h2>A narrow technical case - not a national deployment.</h2>
    <div className="requirements">
      <p><b>Kazakhstan side:</b> one representative environmental evidence path, its native data-quality state, relevant threshold/standard, the responsible authority path and one proposed consequential action.</p>
      <p><b>TA-14 side:</b> map the evidence path, define AIR identity/context fields, freeze the proposition and falsifier, execute EIG, expose AEA and preserve the outcome.</p>
      <p><b>Not required initially:</b> replacement sensors, replacement Kazhydromet systems, national integration, procurement, regulatory recognition or a claim of governmental adoption.</p>
    </div>
  </section>

  <section className="cta"><div className="shell">
    <p className="eyebrow">THE EXAMINATION QUESTION</p>
    <h2>Can Kazakhstan preserve a demonstrable chain from environmental observation to authorized consequence - and prove exactly when that chain must stop?</h2>
    <p>TA-14 proposes to examine that question alongside Kazakhstan’s existing environmental monitoring, regulatory and institutional architecture.</p>
    <div><Link href="/environmental-integrity-governance">Environmental Integrity Governance</Link><a href="mailto:ta14admissibleexecution@gmail.com">Request Technical Examination</a></div>
  </div></section>

  <section id="sources" className="shell section sources"><p className="eyebrow">OFFICIAL KAZAKHSTAN BASIS</p><h2>Built from Kazakhstan’s own public institutional record.</h2>{sources.map(([name,url])=><a key={url} href={url} target="_blank" rel="noreferrer"><b>{name}</b><span>Official source ↗</span></a>)}<p className="fine">TA-14 is an independent governance institution. This showroom is a technical examination proposal and does not represent endorsement, adoption, procurement, certification, partnership, pilot authorization, governmental approval or regulatory recognition by the Republic of Kazakhstan, the Ministry of Ecology and Natural Resources or Kazhydromet.</p></section>

  <footer className="footer shell">TA-14 AUTHORITY · GOVERNANCE INSTITUTION · KAZAKHSTAN COUNTRY SHOWROOM</footer>

  <style>{`
    *{box-sizing:border-box}.page{min-height:100vh;background:#031116;color:#eef9fb;font-family:Arial,Helvetica,sans-serif;position:relative;overflow:hidden}.shell{width:min(1180px,calc(100% - 40px));margin:auto}.kzStripe{height:8px;display:grid;grid-template-columns:6fr 1fr;position:relative;z-index:5}.kzStripe i:first-child{background:#00afca}.kzStripe i:last-child{background:#f2c94c}.sky{position:absolute;inset:8px 0 auto;height:850px;pointer-events:none;background:radial-gradient(circle at 78% 13%,rgba(0,175,202,.24),transparent 27%),radial-gradient(circle at 17% 17%,rgba(242,201,76,.09),transparent 28%),linear-gradient(#06212a,transparent)}.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(121,226,242,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(121,226,242,.05) 1px,transparent 1px);background-size:54px 54px;mask-image:linear-gradient(#000,transparent)}.orb{position:absolute;border:1px solid rgba(121,226,242,.12);border-radius:50%}.orb.one{width:420px;height:420px;right:7%;top:130px}.orb.two{width:250px;height:250px;right:14%;top:215px}.nav{position:relative;z-index:3;padding:22px 0;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ffffff17}.nav>div{display:flex;gap:24px}.nav a{color:#c5d8df;text-decoration:none;font-size:9px;font-weight:900;letter-spacing:.09em}.brand{display:flex;align-items:center;gap:10px!important;color:#fff!important;font-size:12px!important}.brand span{display:grid;place-items:center;width:34px;height:34px;border:1px solid #70dceb;color:#9eeef6}.hero{position:relative;z-index:2;padding:48px 0 64px}.bilateral{display:grid;grid-template-columns:1fr auto 1fr;gap:18px;align-items:center;margin-bottom:54px}.country{display:flex;align-items:center;gap:14px}.country.right{justify-content:flex-end;text-align:right}.country b{display:block;font-size:10px;letter-spacing:.09em}.country small{display:block;margin-top:5px;color:#73929c;font-size:8px;line-height:1.5}.bridge{font-size:8px;font-weight:950;letter-spacing:.14em;color:#7d9cac}.emojiFlag{font-size:56px;line-height:1;filter:drop-shadow(0 8px 18px rgba(0,0,0,.35))}.eyebrow{color:#7ce6f2;font-size:9px;font-weight:950;letter-spacing:.16em}.hero h1{margin:18px 0 8px;font-size:clamp(46px,6vw,78px);line-height:1.02;letter-spacing:-.045em;max-width:1030px}.hero h1 em{color:#f2d06b;font-style:normal}.englishTitle{margin:0 0 18px;color:#87a5af;font:700 15px/1.5 Georgia,serif}.lead{max-width:950px;color:#b3c8cf;font-size:17px;line-height:1.72}.status{display:flex;gap:8px;flex-wrap:wrap;margin-top:25px}.status span,.states b{padding:9px 12px;border:1px solid #7ce6f240;border-radius:999px;color:#c3eff5;font-size:9px}.heroGrid,.three{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:30px}.heroGrid article,.three article{padding:22px;border:1px solid #ffffff18;border-radius:14px;background:#04151dcc}.heroGrid span{color:#7ce6f2;font-size:8px;font-weight:950;letter-spacing:.14em}.heroGrid strong{display:block;margin:10px 0;font-size:18px}.heroGrid p,.three p{margin:0;color:#91a9b2;font-size:12px;line-height:1.65}.rule{margin-top:18px;padding:19px 22px;border-left:3px solid #f2c94c;background:#f2c94c0d}.rule small{display:block;color:#f2c94c;font-size:8px;font-weight:950;letter-spacing:.16em}.rule b{display:block;margin-top:7px;font-size:16px}.section{position:relative;z-index:2;padding:62px 0;border-top:1px solid #ffffff12}.section h2,.cta h2{margin:10px 0 16px;font-size:clamp(31px,4.3vw,54px);line-height:1.08;max-width:950px}.intro{max-width:950px;color:#a9bdc7;font-size:15px;line-height:1.75}.timeline{margin-top:30px;border-left:1px solid #00afca66}.timeline article{display:grid;grid-template-columns:150px 1fr;gap:24px;padding:0 0 28px 24px;position:relative}.timeline article:before{content:'';position:absolute;width:9px;height:9px;border-radius:50%;background:#7ce6f2;left:-5px;top:5px}.timeline time{color:#7ce6f2;font-size:10px;font-weight:950}.timeline h3{margin:0 0 7px;font-size:18px}.timeline p{margin:0;color:#879eaa;font-size:12px;line-height:1.65}.band{background:#061a22;border-top:1px solid #ffffff0c;border-bottom:1px solid #ffffff0c}.quote{margin-top:25px;padding:28px;border:1px solid #f2c94c38;border-radius:16px;background:#f2c94c0b;color:#d7e3e7;font-size:17px;line-height:1.7}.three{grid-template-columns:repeat(3,1fr)}.three b{color:#d9edf2;font-size:10px}.flow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:30px 0}.flow span{padding:13px 14px;border:1px solid #ffffff17;border-radius:9px;background:#041018;color:#c9dbe4;font-size:9px;font-weight:900}.flow .hot{border-color:#55d7e966;color:#bdeff5}.flow .gold{border-color:#f2c94c70;color:#f6df91}.flow i{color:#577684}.table{border-top:1px solid #ffffff16}.row{display:grid;grid-template-columns:1.15fr .55fr 2fr;gap:18px;padding:18px 4px;border-bottom:1px solid #ffffff12}.row b{font-size:11px}.row strong{font-size:10px;color:#8fdcea}.row p{margin:0;color:#8499a4;font-size:11px;line-height:1.55}.notice{margin-top:25px;padding:20px 22px;border-left:3px solid #f2c94c;background:#f2c94c0d;color:#9eafb8;font-size:12px;line-height:1.7}.chain{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:28px}.chain article{padding:19px;border:1px solid #7ce6f22c;border-radius:12px;background:#031018}.chain span{color:#7ce6f2;font-size:8px;font-weight:950}.chain h3{margin:8px 0 3px;font-size:16px}.chain small{color:#f2d06b;font-size:8px;font-weight:900}.chain p{color:#78909b;font-size:9px}.states{display:flex;gap:9px;flex-wrap:wrap;margin-top:22px}.demo{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-top:28px}.demo article{padding:23px;border:1px solid #ffffff17;border-radius:14px;background:#031018}.demo span{display:grid;place-items:center;width:31px;height:31px;border:1px solid #7ce6f248;border-radius:50%;color:#9eeef6;font-size:9px;font-weight:950}.demo h3{margin:13px 0 8px;font-size:17px}.demo p{margin:0;color:#8da1ab;font-size:11px;line-height:1.65}.impact{background:linear-gradient(90deg,#06212a,#05151c)}.engagementGrid,.requirements{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-top:25px}.engagementGrid article,.requirements p{margin:0;padding:22px;border:1px solid #ffffff16;border-radius:13px;background:#041018;color:#91a6b1;font-size:12px;line-height:1.7}.engagementGrid time{display:block;color:#7ce6f2;font-size:8px;font-weight:950;letter-spacing:.12em}.engagementGrid b{display:block;margin:9px 0;color:#e0eef2}.requirements b{color:#dcecf3}.cta{position:relative;z-index:2;padding:68px 0;background:linear-gradient(90deg,#08303a,#061821);border-top:1px solid #7ce6f226}.cta p{max-width:850px;color:#a5bbc5;line-height:1.7}.cta>div>div{display:flex;gap:10px;flex-wrap:wrap;margin-top:25px}.cta a{padding:12px 16px;border:1px solid #7ce6f245;border-radius:9px;color:#d9f2f5;text-decoration:none;font-size:10px;font-weight:900}.sources a{display:flex;justify-content:space-between;gap:16px;padding:17px 0;border-bottom:1px solid #ffffff14;color:#d7e4ea;text-decoration:none}.sources a span{color:#7290a0;font-size:9px}.fine{margin-top:28px;color:#718792;font-size:10px;line-height:1.7}.footer{position:relative;z-index:2;padding:40px 0 70px;color:#657f8c;font-size:9px}@media(max-width:820px){.bilateral{grid-template-columns:1fr}.bridge{text-align:center}.country.right{justify-content:flex-start;text-align:left}.heroGrid,.three,.demo,.requirements,.engagementGrid{grid-template-columns:1fr}.chain{grid-template-columns:repeat(2,1fr)}.row,.timeline article{grid-template-columns:1fr}.nav>div{display:none}.hero h1{font-size:clamp(40px,11vw,64px)}}
  `}</style>
</main>}
