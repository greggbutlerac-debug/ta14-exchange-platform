import Link from 'next/link';
import GuidedShowroom from '../../components/GuidedShowroom';
import InstitutionalSeamLab from '../../components/InstitutionalSeamLab';

const chain=['TEGELIKKUS','KIRJE','JÄRJEPIDEVUS','VASTUVÕETAVUS','SIDUMINE','COMMIT','TÄITMINE','TULEMUS'];

const institutionalTimeline=[
  ['16 Sep 2026','TA-14 → Estonia','Technical-conversation request sent to the Estonian Environment Agency and Ministry of Climate.'],
  ['23 Sep 2026','Martin Maddison → TA-14','Environment Agency adviser confirms the topic spans multiple Estonian institutions and refers TA-14 to Erik Teinemaa at EKUK and Mikk Toim at the Ministry of Climate.'],
  ['NEXT','TA-14 → EKUK + Ministry of Climate','Share the Estonia showroom and request a bounded technical discussion across the measurement-to-authority seam.']
];

const sources=[
  ['ESTONIAN ENVIRONMENT AGENCY','National environmental monitoring programme, ambient-air information, KESE monitoring data, environmental-state analysis.','https://keskkonnaagentuur.ee/en/goals-activities/environmental-monitoring'],
  ['EKUK','Air Quality and Climate Department; accredited ambient-air measurement, modelling and national Air Quality Management System.','https://ekuk.ee/en/about-our-company/'],
  ['MINISTRY OF CLIMATE','Ambient-air policy, regulatory requirements, air-pollutant reduction programme and implementation of EU air-quality law.','https://www.kliimaministeerium.ee/en/energy-mineral-resources/protection-ambient-air'],
  ['RIIGI TEATAJA','Atmospheric Air Protection Act: statutory air-quality obligations, permits, monitoring and pollution-control framework.','https://www.riigiteataja.ee/en/eli/ee/RK/Act/513042026001/consolide']
];

export const metadata={
  title:'Eesti · Õhukvaliteedi andmetest autoriseeritud tagajärjeni | TA-14',
  description:'TA-14 public technical showroom examining Estonia’s native path from national environmental monitoring and validated air-quality data to current authority for consequential action.'
};

export default function Page(){
return <main className="p">
<div className="matrix" aria-hidden="true">TEGELIKKUS  KIRJE  JÄRJEPIDEVUS  VASTUVÕETAVUS  SIDUMINE  COMMIT  TÄITMINE  TULEMUS  REALITY  RECORD  CONTINUITY  ADMISSIBILITY  BINDING  COMMIT  EXECUTION  OUTCOME</div>
<div className="s">
<nav>
  <Link className="brand" href="/"><b>TA-14</b> AUTHORITY</Link>
  <Link href="/global-institutional-engagement">GLOBAL INSTITUTIONAL ENGAGEMENT</Link>
  <Link href="/global-institutional-engagement/showrooms">COUNTRY SHOWROOMS</Link>
</nav>

<header>
  <div className="flag">🇪🇪</div>
  <p className="eye">EESTI · AVALIK TEHNILINE UURIMISPIND · SEPTEMBER 2026</p>
  <h1>Andmed võivad olla usaldusväärsed.<br/><em>Tagajärg vajab endiselt praegust volitust.</em></h1>
  <p className="lead">Eesti ei alusta nullist. Riiklik keskkonnaseire, EKUK-i õhukvaliteedi mõõtmine ja modelleerimine, KESE andmekiht ning Kliimaministeeriumi õigus- ja poliitikaraamistik moodustavad juba tugeva tõendusliku ahela. TA-14 ei asenda seda infrastruktuuri. See showroom uurib üht kitsast piiri: millal muutub tehniliselt usaldusväärne õhukvaliteedi kirje piisavalt praeguseks ja õigesti seotud tõendiks, et toetada konkreetset tagajärge?</p>
  <div className="boundary"><b>PUBLIC-RECORD BOUNDARY</b><p>This surface records a technical question and an institutional referral. It does not represent endorsement, adoption, certification, pilot authorization, procurement, partnership, or regulatory recognition by the Estonian Environment Agency, EKUK, the Ministry of Climate, Martin Maddison, Erik Teinemaa, or Mikk Toim.</p></div>
</header>

<div className="chain">{chain.map(x=><span key={x}>{x}</span>)}</div>

<section className="signal">
  <p className="eye">01 · MIKS SEE PIND OLEMAS ON</p>
  <h2>Estonia itself identified the institutional seam.</h2>
  <div className="quote"><b>MARTIN MADDISON · ESTONIAN ENVIRONMENT AGENCY</b><p>TA-14’s question is relevant to several Estonian institutions. For ambient-air monitoring and generation/validation of air-quality data, he referred us to Erik Teinemaa at EKUK. For ambient-air policy, regulatory requirements, and the use of environmental information in policy and decision-making, he referred us to Mikk Toim at the Ministry of Climate.</p></div>
  <div className="seamline"><div><small>TECHNICAL EVIDENCE</small><b>EKUK · ERIK TEINEMAA</b><p>measurement · sampling · modelling · accredited methods · air-quality management system</p></div><span>→</span><div><small>STATE MONITORING CONTEXT</small><b>ENVIRONMENT AGENCY</b><p>national monitoring · collection · analysis · KESE · environmental-state assessment</p></div><span>→</span><div><small>POLICY + REGULATION</small><b>MINISTRY · MIKK TOIM</b><p>ambient-air policy · legal requirements · programmes · decision context</p></div></div>
</section>

<InstitutionalSeamLab
  eyebrow="ESTONIA · EVIDENCE-TO-AUTHORITY LAB"
  title="A valid measurement is not yet a self-executing consequence."
  intro="Operate the seam between Estonia’s native measurement/monitoring architecture and a contemplated consequential act. The question is not whether the data are real. It is whether the exact record, current condition, competent authority and proposed consequence are bound at the moment of action."
  nativeLabel="ESTONIAN NATIVE SYSTEM"
  nativeValue="EKUK measurement + state monitoring + policy / legal framework"
  actionLabel="CONTEMPLATED CONSEQUENCE"
  actionValue="Permit, restriction, warning, intervention, enforcement or other consequential act"
  stages={[
    {label:'VALIDATED EVIDENCE',state:'TECHNICALLY SOUND',determination:'ALLOW',explanation:'The measurement object is technically valid and attributable within Estonia’s native system.'},
    {label:'CONTEXT CHANGES',state:'CURRENTNESS BROKEN',determination:'HOLD',changed:'NEW CONDITION / NEW AUTHORITY CONTEXT',explanation:'The earlier record remains historically valid, but it cannot silently authorize a later consequence if a material condition has changed.'},
    {label:'REVALIDATE BINDING',state:'CURRENT AGAIN',determination:'ALLOW',changed:'CURRENT EVIDENCE + CURRENT AUTHORITY + EXACT CONSEQUENCE',explanation:'The consequence may proceed only after the evidentiary object and present authority are re-bound to the exact contemplated act.'}
  ]}
/>

<GuidedShowroom
  eyebrow="EESTI · JUHITUD TEHNILINE RADA"
  title="Mõõtmisest tagajärjeni — ilma vahepealset sammu vahele jätmata."
  intro="This guided path preserves Estonia’s existing institutions and asks only what must be true before environmental information becomes a governed basis for consequential action."
  accent="#4896d8"
  gold="#ffffff"
  steps={[
    {label:'01 · MÕÕDA',title:'Measure the environmental condition',plain:'EKUK performs ambient-air measurements, sampling, analysis and modelling using accredited methods.'},
    {label:'02 · KINNITA',title:'Validate and contextualize the data',plain:'Identity, method, timing, provenance and modelling context establish what the data can support technically.'},
    {label:'03 · SÄILITA',title:'Preserve the state record',plain:'National monitoring and state information systems preserve monitoring results and the broader environmental context.'},
    {label:'04 · TÕLGENDADA',title:'Apply policy and law',plain:'Regulatory requirements, air-quality objectives, programmes and competent institutional responsibilities determine what consequences are legally available.'},
    {label:'05 · SIDUDA',title:'Bind evidence to the exact consequence now',plain:'Current evidence, current authority, exact scope and timing must remain aligned before a consequential act is committed.',result:'ALLOW · HOLD · DENY · ESCALATE'},
    {label:'06 · SÄILITA TULEMUS',title:'Preserve what actually happened',plain:'Execution and outcome become a new record; a later action requires a new current-state chain rather than inherited permission.'}
  ]}
/>

<section>
  <p className="eye">02 · EESTI NATIVE ARCHITECTURE</p>
  <h2>Three institutional layers. Different jobs. One consequential pathway.</h2>
  <div className="grid three">
    <article><span>STATE MONITORING</span><b>ESTONIAN ENVIRONMENT AGENCY</b><p>Organizes the national environmental monitoring programme, gathers and analyses environmental information, evaluates environmental status, and maintains the KESE monitoring-information layer. Ambient air is one of the national monitoring sub-programmes.</p></article>
    <article><span>MEASUREMENT + MODELLING</span><b>EKUK</b><p>The state-owned Environmental Research Centre is Estonia’s environmental research competence centre. Its Air Quality and Climate Department develops and maintains the Estonian Air Quality Management System, integrating continuous measurements, company self-monitoring, modelling and other air data.</p></article>
    <article><span>POLICY + REGULATION</span><b>MINISTRY OF CLIMATE</b><p>The Ministry develops and implements ambient-air policy and regulation. Its work connects air-quality objectives, EU obligations, permit architecture, pollutant-reduction programmes and broader environmental decision-making.</p></article>
  </div>
</section>

<section className="band"><div className="in">
  <p className="eye">03 · THE DATA PATH</p>
  <h2>Estonia already distinguishes observation, analysis and state decision context.</h2>
  <div className="rail">
    <div><b>OBSERVED AIR</b><p>PM₂.₅ · PM₁₀ · NOₓ · SO₂ · O₃ · CO · VOCs · meteorology · other pollutants</p></div><span>→</span>
    <div><b>TECHNICAL RECORD</b><p>sampling · continuous measurement · laboratory analysis · modelling · accredited methods</p></div><span>→</span>
    <div><b>STATE CONTEXT</b><p>monitoring programme · KESE · inventories · reporting · environmental-state assessment</p></div><span>→</span>
    <div className="gate"><b>CONSEQUENCE BOUNDARY</b><p>policy · permit · restriction · warning · enforcement · intervention</p></div>
  </div>
</div></section>

<section>
  <p className="eye">04 · THE PEOPLE MARTIN REFERRED US TO</p>
  <h2>The referral lands on the exact two sides of the seam.</h2>
  <div className="people">
    <article><small>EVIDENCE SIDE</small><h3>Dr. Erik Teinemaa</h3><b>Head · Air Quality and Climate Department · EKUK</b><p>Erik leads the department responsible for ambient-air measurement, modelling and air-quality management work. EKUK identifies him as the specialist contact for ambient-air and emission-gas analysis as well as indoor-air work. His research background includes aerosols, particulate matter, atmospheric pollution and air-quality measurement.</p><div className="ask">TECHNICAL QUESTION FOR ERIK<div>What makes an air-quality measurement or model output sufficiently validated, attributable and current to leave the technical evidence layer and enter a consequential decision process?</div></div></article>
    <article><small>POLICY / AUTHORITY SIDE</small><h3>Mikk Toim</h3><b>Adviser · Ambient Air Department · Ministry of Climate</b><p>Mikk works directly on Estonia’s ambient-air policy and regulatory architecture. He helped prepare the 2026 amendments implementing the EU’s new air-quality directive and is participating in the 2027 update of Estonia’s air-pollutant reduction programme.</p><div className="ask">TECHNICAL QUESTION FOR MIKK<div>When technically valid environmental information reaches the policy or regulatory layer, what establishes that a specific authority may attach a specific consequence to that information now?</div></div></article>
  </div>
  <div className="martin"><small>REFERRAL + STATE MONITORING CONTEXT</small><h3>Martin Maddison</h3><b>Adviser on Environmental Monitoring · Estonian Environment Agency</b><p>Martin’s reply is important because it did not collapse the problem into one institution. He identified a distributed architecture and pointed TA-14 toward the technical-data and policy sides separately. This showroom preserves that distinction.</p></div>
</section>

<section className="band"><div className="in">
  <p className="eye">05 · WHY ESTONIA IS ESPECIALLY INTERESTING IN 2026</p>
  <h2>The system is already changing while the evidentiary standard is getting stricter.</h2>
  <div className="grid four">
    <article><b>NEW EU AIR-QUALITY DIRECTIVE</b><p>Estonia adopted 2026 legislative amendments to align national law with the EU’s newer air-quality directive.</p></article>
    <article><b>MONITORING NETWORK RENEWAL</b><p>The Ministry says Estonia is renewing and expanding its nationwide air-quality monitoring network while maintaining one of Europe’s cleaner ambient-air profiles.</p></article>
    <article><b>2027 POLLUTANT-REDUCTION PROGRAMME</b><p>Estonia is updating its national air-pollutant reduction programme, with cross-government work already underway in 2026.</p></article>
    <article><b>PERMIT ARCHITECTURE REFORM</b><p>Recent work examines how air-pollution permitting can better reflect actual environmental impact while relying on current, high-quality data.</p></article>
  </div>
</div></section>

<section>
  <p className="eye">06 · THE TA-14 QUESTION</p>
  <h2>Not “Is the measurement valid?”<br/>But “What authorizes this consequence now?”</h2>
  <div className="hard">
    <p>Suppose an Estonian ambient-air record has been measured, validated, preserved and interpreted under the applicable air-quality framework. Before a contemplated consequence is executed, a material fact changes: the environmental condition, the measurement context, the applicable threshold, the permit status, the responsible authority, the affected place, the time window, or the proposed act itself.</p>
    <b>What mechanism prevents the earlier evidentiary basis from silently carrying forward as permission, and what explicitly re-establishes the binding between the current record, competent authority, exact consequence and execution moment?</b>
  </div>
</section>

<section>
  <p className="eye">07 · TA-14 BOLTS ON HERE</p>
  <h2>Estonian infrastructure remains Estonian.</h2>
  <div className="flow">
    <div><b>EKUK + NATIONAL MONITORING</b><p>measure · validate · model · preserve · report</p></div><span>→</span>
    <div><b>MINISTRY / COMPETENT AUTHORITY</b><p>policy · law · scope · permit · decision context</p></div><span>→</span>
    <div className="ta"><b>TA-14 EXECUTION BOUNDARY</b><p>continuity · admissibility · binding · currentness · commit</p></div><span>→</span>
    <div><b>EXECUTION + OUTCOME</b><p>consequence · result · preserved record · new chain</p></div>
  </div>
  <Link className="cta" href="/execution-authority-infrastructure/integration-boundary">OPEN CANONICAL TA-14 INTEGRATION BOUNDARY →</Link>
</section>

<section>
  <p className="eye">08 · PUBLIC SOURCE MAP</p>
  <h2>Native sources remain visible.</h2>
  <div className="sources">{sources.map(([name,copy,href])=><a key={name} href={href} target="_blank" rel="noreferrer"><b>{name}</b><p>{copy}</p><span>OPEN OFFICIAL SOURCE ↗</span></a>)}</div>
</section>

<section className="english">
  <p className="eye">ENGLISH TECHNICAL SUMMARY</p>
  <h2>Estonia already has a mature chain from environmental observation to state policy.</h2>
  <p>The open technical question is narrower: when a technically valid environmental record is about to support a consequential act, what makes that record current, attributable and bound to the competent authority and exact proposed consequence at that moment? TA-14 does not replace EKUK, the Environment Agency, KESE, Estonian law, permitting, modelling, public-health expertise or regulatory judgment. It examines the execution boundary between them.</p>
</section>

<section className="institutional-timeline">
  <p className="eye">INSTITUTIONAL CONTINUITY RECORD</p>
  <h2>What happened, when it happened, and what comes next.</h2>
  <div className="timeline-grid">{institutionalTimeline.map(([date,party,event])=><article key={date+party}><span>{date}</span><b>{party}</b><p>{event}</p></article>)}</div>
</section>

<footer>TA-14 AUTHORITY · GLOBAL INSTITUTIONAL ENGAGEMENT<br/>ESTONIA · PUBLIC TECHNICAL SHOWROOM · SEPTEMBER 2026</footer>
</div>

<style>{`
*{box-sizing:border-box}.p{min-height:100vh;background:radial-gradient(circle at 8% 0%,rgba(26,96,157,.34),transparent 28%),radial-gradient(circle at 92% 0%,rgba(255,255,255,.09),transparent 22%),linear-gradient(180deg,#02070c,#06121b 48%,#02070b);color:#f3f7f9;font-family:Arial,sans-serif;position:relative;overflow:hidden}.matrix{position:fixed;inset:0;color:rgba(74,163,221,.032);font:700 15px/3 monospace;word-spacing:28px;transform:rotate(-8deg) scale(1.28);pointer-events:none}.s,.in{position:relative;max-width:1220px;margin:auto;padding:0 28px}nav{height:76px;display:flex;align-items:center;gap:24px;border-bottom:1px solid #203441}nav a{color:#b7c8d2;text-decoration:none;font-size:9px;font-weight:900;letter-spacing:1px}.brand{margin-right:auto;font-size:15px!important}.brand b,.eye{color:#4aa3dd}header{padding:82px 0 48px;position:relative}.flag{position:absolute;right:0;top:68px;font-size:74px}.eye{font-size:10px;letter-spacing:2px;font-weight:950}h1{font:clamp(50px,7vw,84px)/.96 Georgia,serif;letter-spacing:-3px;max-width:1070px}h1 em{font-style:normal;color:#fff}.lead{max-width:980px;color:#afc0c9;font-size:18px;line-height:1.74}.boundary{margin-top:30px;padding:22px;border:1px solid rgba(74,163,221,.38);background:rgba(8,25,37,.72)}.boundary b{color:#78c7f4;font-size:9px}.boundary p{color:#a9b8c0;font-size:12px;line-height:1.65}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;padding:22px 0 55px}.chain span{text-align:center;border:1px solid rgba(74,163,221,.32);padding:12px 4px;color:#7bc9f4;font-size:8px;font-weight:900}section{padding:66px 0;border-top:1px solid #20313c}h2{font:clamp(35px,5vw,58px)/1.03 Georgia,serif;max-width:1000px}.quote{margin:28px 0;padding:26px;border-left:4px solid #4aa3dd;background:#081721}.quote b{color:#7bc9f4;font-size:10px}.quote p{color:#afbec6;line-height:1.7}.seamline,.rail,.flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:10px;margin-top:28px}.seamline div,.rail div,.flow div{padding:22px;border:1px solid #2a4658;background:#08151e}.seamline small{display:block;color:#8da5b2;font-size:8px;font-weight:900;margin-bottom:7px}.seamline b,.rail b,.flow b{color:#78c7f4}.seamline p,.rail p,.flow p{color:#95aab5;line-height:1.6;font-size:12px}.seamline span,.rail span,.flow>span{color:#fff;font-size:26px}.grid{display:grid;gap:12px;margin-top:28px}.three{grid-template-columns:repeat(3,1fr)}.four{grid-template-columns:repeat(4,1fr)}article{padding:23px;border:1px solid #274253;background:#07131c}article span,article small{display:block;color:#7bc9f4;font-size:8px;font-weight:950;letter-spacing:.12em;margin-bottom:10px}article b{color:#e9f4f9;font-size:10px;letter-spacing:.06em}article p{color:#9fb1bb;line-height:1.65}.band{margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);background:#07131c}.rail{grid-template-columns:1fr auto 1fr auto 1fr auto 1fr}.gate{border:2px solid #4aa3dd!important}.people{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:28px}.people article{padding:30px}.people h3,.martin h3{font:34px Georgia,serif;margin:8px 0}.ask{margin-top:22px;padding:18px;border-top:1px solid #2b4a5d;color:#7bc9f4;font-size:9px;font-weight:950;letter-spacing:.08em}.ask div{margin-top:9px;color:#dbe8ee;font:17px/1.55 Georgia,serif;letter-spacing:0}.martin{margin-top:16px;padding:28px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.025)}.martin small{color:#7bc9f4;font-size:8px;font-weight:950}.martin p{color:#9fb1bb;line-height:1.65}.hard{margin-top:26px;padding:30px;border-left:4px solid #4aa3dd;background:#101820}.hard p{color:#aebdc5;line-height:1.75}.hard b{font:23px/1.55 Georgia,serif}.flow{grid-template-columns:1fr auto 1fr auto 1.15fr auto 1fr}.flow .ta{border:2px solid #4aa3dd}.cta{display:inline-block;margin-top:22px;padding:14px 17px;border:1px solid #4aa3dd;color:#78c7f4;text-decoration:none;font-size:9px;font-weight:900}.sources{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:26px}.sources a{padding:24px;border:1px solid #2a4658;background:#07131c;color:#eef5f8;text-decoration:none}.sources a b{color:#7bc9f4;font-size:10px}.sources a p{color:#9fb1bb;line-height:1.6}.sources a span{font-size:8px;font-weight:900;color:#dfeef5}.english p{max-width:980px;color:#adbec7;font-size:17px;line-height:1.75}.institutional-timeline{padding:64px 0}.timeline-grid{display:grid;gap:10px}.timeline-grid article{display:grid;grid-template-columns:130px 220px 1fr;gap:18px;padding:16px 18px;border:1px solid #ffffff14;border-radius:12px;background:#ffffff05}.timeline-grid article>span{color:#7bc9f4;font-size:10px;font-weight:900}.timeline-grid article>b{color:#dcecf5;font-size:10px}.timeline-grid article>p{margin:0;color:#91a7b4;font-size:11px;line-height:1.55}footer{padding:45px 0 70px;color:#718690;font-size:9px;line-height:1.8}@media(max-width:900px){.three,.four,.people,.sources{grid-template-columns:1fr 1fr}.chain{grid-template-columns:repeat(2,1fr)}.seamline,.rail,.flow{grid-template-columns:1fr}.seamline span,.rail span,.flow>span{transform:rotate(90deg);justify-self:center}.flag{opacity:.22}}@media(max-width:650px){.three,.four,.people,.sources{grid-template-columns:1fr}.s,.in{padding:0 18px}nav{height:auto;padding:18px 0;flex-wrap:wrap}h1{letter-spacing:-1px}.timeline-grid article{grid-template-columns:1fr;gap:6px}}
`}</style>
</main>}
