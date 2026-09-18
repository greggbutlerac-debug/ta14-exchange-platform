import Link from 'next/link';

export const metadata = {
  title: 'UAE Environmental Integrity Governance Showroom | TA-14',
  description: 'A bounded TA-14 showroom mapping Atmospheric Integrity Records and Environmental Integrity Governance to the UAE National Air Quality Agenda 2031 and existing monitoring infrastructure.',
};

const milestones = [
  ['15 Sep 2026', 'MOCCAE requests details', 'MOCCAE asks TA-14 for a work paper or additional proposal details and direct contact information.'],
  ['16 Sep 2026', 'UAE showroom returned', 'TA-14 provides the dedicated UAE technical showroom and bounds the request to technical examination rather than infrastructure replacement.'],
  ['16 Sep 2026', 'MOCCAE confirms follow-up', 'MOCCAE states that the request is under follow-up and that TA-14 will be informed as soon as possible.'],
  ['17 Sep 2026', 'Suggestion 5200001108 closed', '171 Tawasul records the MOCCAE suggestion as resolved; TA-14 returns a clarification that no procurement, expenditure or paid pilot is being requested at this stage.'],
  ['2007', 'Abu Dhabi monitoring network', 'Environment Agency - Abu Dhabi has operated a fixed and mobile air-quality monitoring network since 2007, contributing detailed pollutant concentration data.'],
  ['07 Sep 2020', 'National Air Quality Platform', 'MOCCAE launched a centralized platform designed to connect ambient-air monitoring stations, unify reporting, and provide real-time air-quality information.'],
  ['June 2022', 'National Air Quality Agenda 2031 approved', 'The Cabinet-approved agenda established a national framework for federal, local and private-sector coordination.'],
  ['2023', 'Monitoring · Management · Mitigation', 'MOCCAE described the Agenda around three strategic pillars and identified indoor air quality as a principal workstream.'],
  ['15 Oct 2025', 'National MRV system launched', 'MOCCAE launched the national Measurement, Reporting and Verification system integrating greenhouse-gas emissions and air-pollutant monitoring to support accurate, reliable, evidence-based decisions.'],
  ['2025–2026', 'Implementation expands', 'Government reporting describes connected continuous-emissions systems, Dubai Air Quality Strategy 2030, environmental AI work in Ajman, and indoor-air assessment of schools, local authorities and government institutions in Fujairah.'],
];

const chain = [
  ['Reality', 'The actual atmospheric condition in a room, school, government facility, industrial site or outdoor environment.'],
  ['Record', 'Sensor observations become a bounded Atmospheric Integrity Record with identity, time, place, method and operating context.'],
  ['Continuity', 'The record is tested for chronology, attribution, instrument continuity, gaps and comparability.'],
  ['Admissibility', 'Determine what the evidence actually supports - and what it does not.'],
  ['Binding', 'Bind the supported proposition to the correct place, activity, threshold, authority and consequence.'],
  ['Commit', 'Preserve the determination before consequential reliance or intervention.'],
  ['Execution', 'AEA governs whether the proposed physical or institutional action is authorized now.'],
  ['Outcome', 'Return the verified result to the record; changed conditions require revalidation rather than silent continuation.'],
];

const sensorMap = [
  ['Existing UAE sensor / monitoring layer', 'Keep it', 'TA-14 does not replace deployed stations, indoor sensors, CEMS, MRV or local platforms.'],
  ['Measurement identity + context', 'AIR', 'Bind instrument, location, timestamp, operating state, calibration/context and observation into an attributable record.'],
  ['Evidence sufficiency', 'EIG', 'Test continuity, currentness, conflicts, changed conditions and the bounded proposition the evidence can support.'],
  ['Authority boundary', 'AEA', 'Separate evidence from permission: determine whether a consequential intervention is actually authorized.'],
  ['Post-action verification', 'AIR + EIG', 'Preserve the outcome and compare it with the pre-intervention state for future reliance.'],
];

const sources = [
  ['UAE National Air Quality Agenda 2031', 'https://www.moccae.gov.ae/assets/download/b989a286/UAE%20National%20Air%20Quality%20Agenda%202031.pdf.aspx'],
  ['MOCCAE - National MRV system launch, 15 Oct 2025', 'https://www.moccae.gov.ae/ar/media-center/news/15/10/2025/%D8%A7%D9%84%D8%A5%D9%85%D8%A7%D8%B1%D8%A7%D8%AA-%D8%AA%D8%B7%D9%84%D9%82-%D8%A7%D9%84%D9%86%D8%B8%D8%A7%D9%85-%D8%A7%D9%84%D9%88%D8%B7%D9%86%D9%8A-%D9%84%D9%84%D9%82%D9%8A%D8%A7%D8%B3-%D9%88%D8%A7%D9%84%D8%A5%D8%A8%D9%84%D8%A7%D8%BA-%D9%88%D8%A7%D9%84%D8%AA%D8%AD%D9%82%D9%82-%D9%84%D8%AD%D9%88%D9%83%D9%85%D8%A9-%D8%A7%D9%84%D8%A8%D9%8A%D8%A6%D8%A9-%D8%A7%D9%84%D9%85%D9%86%D8%A7%D8%AE%D9%8A%D8%A9'],
  ['MOCCAE - National Air Quality Platform, 07 Sep 2020', 'https://moccae.gov.ae/ar/media-center/news/7/9/2020/ministry-of-climate-change-and-environment-inaugurates-national-air-quality-platform'],
  ['UAE Cabinet - National Air Quality Agenda implementation results', 'https://uaecabinet.ae/ar/news/uae-cabinet-chaired-by-mohammed-bin-rashid-approves-national-policy-for-economic-clusters-agenda-of-uae-government-s-annual-meetings'],
  ['MOCCAE - Agenda pillars and implementation, 17 May 2023', 'https://www.moccae.gov.ae/ar/media-center/news/17/5/2023/power-generation-study-by-ministry-of-climate-change-and-environment-reveals-20-reduction-in-nitroge'],
];

export default function UAEEnvironmentalIntegrityShowroom(){
  return <main className="page">
    <div className="sky" aria-hidden="true"><div className="grid"/><div className="orb one"/><div className="orb two"/></div>
    <nav className="nav shell">
      <Link href="/environmental-integrity-governance" className="brand"><span>TA</span><b>TA-14 Environmental Integrity Governance</b></Link>
      <div><a href="#architecture">Architecture</a><a href="#demonstration">Demonstration</a><a href="#sources">UAE Sources</a></div>
    </nav>

    <section className="hero shell">
      <div className="flagline"><i/><i/><i/><i/></div>
      <p className="eyebrow">UNITED ARAB EMIRATES · TECHNICAL SHOWROOM · PUBLIC REFERENCE</p>
      <h1>From national air-quality measurement<br/><em>to governed environmental action.</em></h1>
      <p className="lead">A TA-14 examination environment for how <b>Atmospheric Integrity Records (AIR)</b>, <b>Environmental Integrity Governance (EIG)</b> and a bounded <b>Admissible Execution Architecture (AEA)</b> layer could complement the UAE's existing sensors, monitoring platforms and National MRV system - without replacing them.</p>
      <div className="heroGrid">
        <article><span>UAE DIRECTION</span><strong>Monitoring · Management · Mitigation</strong><p>The National Air Quality Agenda 2031 coordinates federal, local and private-sector efforts to monitor and manage air quality and mitigate pollution.</p></article>
        <article><span>TA-14 QUESTION</span><strong>When has measurement earned consequence?</strong><p>When does environmental data become a sufficiently governed record to support a decision, intervention, restriction, notification or other consequential action?</p></article>
      </div>
      <div className="rule"><small>THE GOVERNING RULE</small><b>No admissible environmental evidence. No admissible environmental execution.</b></div>
    </section>

    <section className="shell section">
      <p className="eyebrow">THE UAE HAS ALREADY BUILT THE MEASUREMENT SIDE</p>
      <h2>This showroom starts with what exists.</h2>
      <p className="intro">The opportunity is not to sell the UAE another dashboard. Official UAE materials describe national and emirate-level monitoring networks, a centralized national air-quality platform, continuous-emissions connections, indoor-air initiatives and a National MRV system intended to provide accurate and reliable data for evidence-based policy. TA-14 proposes a distinct question: what governs the evidentiary and authority transition after measurement?</p>
      <div className="timeline">{milestones.map(([date,title,text])=><article key={date}><time>{date}</time><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
    </section>

    <section className="band"><div className="shell section">
      <p className="eyebrow">THE INDOOR-AIR SEAM</p><h2>The UAE Agenda names the institutional problem.</h2>
      <div className="quote">The Agenda's indoor-air program calls for a stronger institutional framework and government capacity to monitor and manage indoor air quality and mitigate indoor-air pollution. It also records stakeholder uncertainty around roles and responsibilities and calls for a clearer regulatory and administrative framework.</div>
      <div className="three"><article><b>01 · MEASUREMENT</b><p>Sensors can establish observations. They do not, by themselves, establish the authority or sufficiency of a consequential conclusion.</p></article><article><b>02 · GOVERNED RECORD</b><p>AIR preserves what was measured, where, when, by what instrument and under what operating conditions - including continuity and limitations.</p></article><article><b>03 · AUTHORIZED CONSEQUENCE</b><p>EIG tests what the record supports. AEA appears only at the execution boundary, where evidence must not silently become permission.</p></article></div>
    </div></section>

    <section id="architecture" className="shell section">
      <p className="eyebrow">PROPOSED COMPLEMENTARY ARCHITECTURE</p><h2>UAE measurement stays native. TA-14 governs the handoff.</h2>
      <div className="flow"><span>UAE SENSORS</span><i>→</i><span>NATIONAL / LOCAL PLATFORMS + MRV</span><i>→</i><span className="hot">AIR</span><i>→</i><span className="hot">EIG</span><i>→</i><span className="gold">AEA</span><i>→</i><span>AUTHORIZED ACTION</span><i>→</i><span>VERIFIED OUTCOME</span></div>
      <div className="table">{sensorMap.map(([layer,role,benefit])=><div className="row" key={layer}><b>{layer}</b><strong>{role}</strong><p>{benefit}</p></div>)}</div>
      <div className="notice"><b>Boundary:</b> This showroom does not claim that UAE systems currently lack required legal, regulatory or technical controls. It identifies a governance proposition for technical examination: whether a persistent evidence-and-authority layer can make the transition from observation to consequence more explicit, auditable and revalidatable.</div>
    </section>

    <section className="band"><div className="shell section">
      <p className="eyebrow">TA-14 GOVERNING CHAIN</p><h2>One preserved route from reality to outcome.</h2>
      <div className="chain">{chain.map(([name,text],i)=><article key={name}><span>{String(i+1).padStart(2,'0')}</span><h3>{name}</h3><p>{text}</p></article>)}</div>
      <div className="states"><b>ALLOW</b><b>HOLD</b><b>DENY</b><b>ESCALATE</b></div>
    </div></section>

    <section id="demonstration" className="shell section">
      <p className="eyebrow">BOUNDED UAE TECHNICAL EXAMINATION</p><h2>Start with one school or government building. Prove only what the evidence earns.</h2>
      <div className="demo">
        <article><span>1</span><h3>Use existing sensors</h3><p>Select one bounded UAE indoor environment already instrumented or being assessed. No sensor replacement is required for the examination.</p></article>
        <article><span>2</span><h3>Freeze the scenario</h3><p>Define the room/zone, activity, instruments, data channels, applicable threshold or proposition, proposed response and authority boundary before the run.</p></article>
        <article><span>3</span><h3>Create the AIR</h3><p>Preserve measurement identity, chronology, location, environmental context, occupancy/operating state, limitations and any material change.</p></article>
        <article><span>4</span><h3>Run EIG prospectively</h3><p>Test continuity, admissibility and binding. Return ALLOW, HOLD, DENY or ESCALATE rather than allowing absence of refusal to become permission.</p></article>
        <article><span>5</span><h3>Expose the execution boundary</h3><p>If a physical or institutional intervention is proposed, AEA determines whether that exact action has authority at that exact state.</p></article>
        <article><span>6</span><h3>Preserve the outcome</h3><p>Compare the post-action environment with the frozen baseline. If conditions change, close or revalidate the chain instead of inheriting stale authority.</p></article>
      </div>
    </section>

    <section className="impact"><div className="shell section"><p className="eyebrow">WHAT SUCCESS WOULD MEAN</p><h2>More value from the infrastructure already deployed.</h2><div className="three"><article><b>FOR SENSOR NETWORKS</b><p>Measurements gain attributable context, continuity review and a preserved relationship to later decisions and outcomes.</p></article><article><b>FOR GOVERNMENT</b><p>Federal and local actors can inspect not only what was observed, but what proposition the record supported, who/what held authority and why an action occurred.</p></article><article><b>FOR FUTURE AI</b><p>AI may interpret or recommend, but it does not acquire implicit physical authority merely because a model, dashboard or alert produced an answer.</p></article></div></div></section>

    <section className="shell section clarification">
      <p className="eyebrow">MOCCAE CLARIFICATION · SUGGESTION 5200001108</p>
      <h2>Technical examination first. No financial request at this stage.</h2>
      <p className="intro">Following MOCCAE review, TA-14 has clarified the proposed examination boundary. TA-14 is not requesting procurement, expenditure, deployment, sensor replacement, platform replacement or approval of a paid pilot at this stage. The requested first step is a bounded technical conversation to determine whether the architecture merits joint technical examination using infrastructure and data already available to the UAE.</p>
      <div className="stages">
        <article><span>STAGE 1 · CURRENT REQUEST</span><h3>Bounded technical examination</h3><p>Use one existing UAE use case and existing sensors, data, monitoring platforms and MRV infrastructure. Define the record, continuity conditions, applicable threshold, authority boundary and proposed consequence; then run the governance chain prospectively.</p><b>Financial commitment: NONE REQUESTED</b></article>
        <article><span>STAGE 2 · ONLY IF UAE CHOOSES TO CONTINUE</span><h3>Optional operational pilot</h3><p>If MOCCAE later wishes to examine live operational use, scope, duration, responsibilities, required data, implementation conditions and any associated costs would be documented separately before any commitment or execution.</p><b>Separate scope + approval required</b></article>
      </div>
      <div className="notice"><b>Procedural boundary:</b> Suggestion 5200001108 is referenced here only to document TA-14's clarification following Ministry review. It does not represent endorsement, approval, partnership, validation or authorization by MOCCAE or the Government of the United Arab Emirates.</div>
    </section>

    <section className="shell section">
      <p className="eyebrow">WHAT IT WOULD TAKE</p><h2>A small examination before any large deployment.</h2>
      <div className="requirements"><p><b>UAE side:</b> one bounded use case; access to a representative data stream or preserved sample; identification of the relevant institutional/technical authority; applicable standards/thresholds; and the proposed consequence to examine.</p><p><b>TA-14 side:</b> map the evidence path; define AIR fields and continuity conditions; freeze the proposition and falsifier; configure EIG determinations and the AEA execution boundary; preserve the run and return a bounded finding.</p><p><b>Not required initially:</b> procurement, expenditure, national replacement infrastructure, replacement sensors, platform replacement, a paid pilot, a procurement-scale deployment, or any claim that TA-14 has already been validated for UAE governmental use.</p></div>
    </section>

    <section className="cta"><div className="shell"><p className="eyebrow">THE EXAMINATION QUESTION</p><h2>Can the UAE preserve a demonstrable chain from environmental observation to authorized consequence - and prove when that chain must stop?</h2><p>TA-14 proposes to examine that question alongside the UAE's existing air-quality and environmental-data infrastructure.</p><div><Link href="/environmental-integrity-governance">Environmental Integrity Governance</Link><a href="mailto:ta14admissibleexecution@gmail.com">Request Technical Examination</a></div></div></section>

    <section id="sources" className="shell section sources"><p className="eyebrow">OFFICIAL UAE BASIS</p><h2>Built from the UAE's own published direction.</h2>{sources.map(([name,url])=><a key={url} href={url} target="_blank" rel="noreferrer"><b>{name}</b><span>Official UAE source ↗</span></a>)}<p className="fine">TA-14 is an independent governance institution. This showroom is a technical examination proposal and is not an endorsement, partnership, procurement, certification or representation of the Government of the United Arab Emirates or MOCCAE.</p></section>

    <style>{`
      *{box-sizing:border-box}.page{min-height:100vh;background:#03100d;color:#eef9f4;font-family:Arial,Helvetica,sans-serif;position:relative;overflow:hidden}.shell{width:min(1180px,calc(100% - 40px));margin:auto}.sky{position:absolute;inset:0 0 auto;height:760px;pointer-events:none;background:radial-gradient(circle at 78% 15%,rgba(207,171,74,.18),transparent 26%),radial-gradient(circle at 15% 20%,rgba(0,170,110,.18),transparent 30%),linear-gradient(#071c17,transparent)}.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(95,240,186,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(95,240,186,.05) 1px,transparent 1px);background-size:54px 54px;mask-image:linear-gradient(#000,transparent)}.nav{position:relative;z-index:2;padding:22px 0;display:flex;justify-content:space-between;gap:24px;align-items:center;border-bottom:1px solid rgba(255,255,255,.1)}.brand{display:flex;gap:12px;align-items:center;color:white;text-decoration:none}.brand span{display:grid;place-items:center;width:42px;height:42px;border:1px solid #58e4b1;border-radius:50%;font-weight:900}.nav div{display:flex;gap:20px}.nav div a{color:#b8d7cc;text-decoration:none;font-size:13px}.hero{position:relative;padding:95px 0 75px}.flagline{display:flex;width:120px;height:5px;margin-bottom:26px}.flagline i:nth-child(1){background:#ef3340;width:25%}.flagline i:nth-child(2){background:#009739;width:25%}.flagline i:nth-child(3){background:#fff;width:25%}.flagline i:nth-child(4){background:#000;width:25%}.eyebrow{font-size:12px;letter-spacing:.19em;font-weight:900;color:#68e8b7}.hero h1,.section h2,.cta h2{font-size:clamp(38px,6vw,76px);line-height:.98;letter-spacing:-.045em;margin:16px 0 24px}.hero h1 em{font-style:normal;color:#d7b85b}.lead{font-size:20px;line-height:1.65;color:#c7ddd5;max-width:900px}.heroGrid,.three{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:42px}.heroGrid article,.three article,.demo article{padding:25px;border:1px solid rgba(104,232,183,.2);background:rgba(8,30,24,.7);border-radius:18px}.heroGrid span,.heroGrid article>span{color:#d7b85b;font-size:11px;font-weight:900;letter-spacing:.14em}.heroGrid strong{display:block;font-size:22px;margin:10px 0}.heroGrid p,.three p,.demo p,.timeline p,.intro,.requirements p{color:#b8d0c7;line-height:1.65}.rule{margin-top:20px;padding:24px 28px;border-left:4px solid #d7b85b;background:rgba(215,184,91,.08)}.rule small{display:block;color:#d7b85b;font-weight:900;letter-spacing:.15em;margin-bottom:8px}.rule b{font-size:20px}.section{padding:85px 0}.section h2{font-size:clamp(34px,5vw,60px);max-width:900px}.intro{font-size:19px;max-width:900px}.timeline{margin-top:42px;border-left:1px solid rgba(104,232,183,.35)}.timeline article{display:grid;grid-template-columns:150px 1fr;gap:25px;padding:0 0 34px 28px;position:relative}.timeline article:before{content:'';position:absolute;width:9px;height:9px;border-radius:50%;background:#68e8b7;left:-5px;top:5px;box-shadow:0 0 18px #68e8b7}.timeline time{color:#d7b85b;font-weight:900}.timeline h3{margin:0;font-size:20px}.timeline p{margin:7px 0 0}.band{background:linear-gradient(90deg,rgba(0,151,57,.08),rgba(255,255,255,.025),rgba(215,184,91,.06));border-top:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07)}.quote{font-size:23px;line-height:1.55;padding:30px;border:1px solid rgba(215,184,91,.3);background:rgba(215,184,91,.06);border-radius:20px}.three{grid-template-columns:repeat(3,1fr)}.three b{color:#68e8b7}.flow{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:38px 0}.flow span{padding:13px 16px;border:1px solid rgba(255,255,255,.14);border-radius:999px;font-size:12px;font-weight:900}.flow .hot{border-color:#68e8b7;color:#68e8b7}.flow .gold{border-color:#d7b85b;color:#d7b85b}.flow i{font-style:normal;color:#64867a}.table{border:1px solid rgba(255,255,255,.1);border-radius:18px;overflow:hidden}.row{display:grid;grid-template-columns:1.1fr .45fr 2fr;gap:20px;padding:20px;border-bottom:1px solid rgba(255,255,255,.08);align-items:center}.row:last-child{border:0}.row strong{color:#d7b85b}.row p{margin:0;color:#b8d0c7;line-height:1.5}.notice{margin-top:24px;padding:22px;border:1px solid rgba(255,255,255,.13);border-radius:14px;color:#a9c4ba;line-height:1.6}.chain{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:36px}.chain article{padding:20px;border-top:2px solid #68e8b7;background:#071b16}.chain span{color:#d7b85b;font-weight:900}.chain h3{font-size:20px;margin:9px 0}.chain p{color:#aac5bb;line-height:1.5;font-size:14px}.states{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:18px}.states b{text-align:center;padding:14px;border:1px solid rgba(215,184,91,.3);color:#d7b85b;border-radius:10px}.demo{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.demo article>span{font-size:34px;color:#d7b85b;font-weight:900}.impact{background:#061a14}.clarification{border-top:1px solid rgba(215,184,91,.2);border-bottom:1px solid rgba(215,184,91,.2)}.stages{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:34px}.stages article{padding:28px;border:1px solid rgba(215,184,91,.28);border-radius:18px;background:rgba(215,184,91,.055)}.stages span{display:block;color:#68e8b7;font-size:11px;font-weight:900;letter-spacing:.13em}.stages h3{font-size:25px;margin:10px 0 12px}.stages p{color:#b8d0c7;line-height:1.65}.stages b{display:block;margin-top:18px;color:#d7b85b;font-size:13px;letter-spacing:.08em}.requirements{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.requirements p{padding:22px;border:1px solid rgba(255,255,255,.1);border-radius:16px;margin:0}.requirements b{color:white}.cta{padding:90px 0;background:radial-gradient(circle at 50% 0,rgba(0,151,57,.22),transparent 60%),#020b09;text-align:center}.cta h2{font-size:clamp(34px,5vw,58px);margin-left:auto;margin-right:auto;max-width:1000px}.cta p{color:#b9d0c8;font-size:18px}.cta div div{display:flex;justify-content:center;gap:12px;margin-top:28px;flex-wrap:wrap}.cta a{padding:14px 20px;border-radius:10px;text-decoration:none;font-weight:900;background:#68e8b7;color:#02100c}.cta a+ a{background:transparent;color:#d7b85b;border:1px solid #d7b85b}.sources a{display:flex;justify-content:space-between;gap:20px;padding:18px 0;border-bottom:1px solid rgba(255,255,255,.1);color:#dceee7;text-decoration:none}.sources a span{color:#68e8b7}.fine{margin-top:32px;color:#78988c;font-size:12px;line-height:1.6}
      @media(max-width:800px){.nav{align-items:flex-start}.nav div{display:none}.hero{padding-top:65px}.heroGrid,.three,.demo,.requirements,.stages{grid-template-columns:1fr}.timeline article{grid-template-columns:1fr;gap:4px}.row{grid-template-columns:1fr}.chain{grid-template-columns:repeat(2,1fr)}.states{grid-template-columns:repeat(2,1fr)}.sources a{flex-direction:column}.section{padding:60px 0}}
    `}</style>
  </main>
}
