'use client';
import {useMemo,useState} from 'react';

const scenarios={
  CO2:{label:'OCCUPIED CLASSROOM · CO₂ RISING',signal:'CO₂ rises persistently while the classroom is occupied.',context:'CO₂ can be useful as an operational indicator of whether enough outdoor air is reaching the occupied space. It does not by itself identify every pollutant or prove a health outcome.',proposal:'Increase outdoor-air ventilation.'},
  PM:{label:'PM₂.₅ · OUTDOOR AIR POOR',signal:'Outdoor particulate pollution is elevated and indoor PM₂.₅ is also elevated.',context:'Opening windows may increase outdoor-air delivery while also importing particulate pollution. Ventilation and filtration are different controls.',proposal:'Increase filtration while protecting required ventilation.'},
  BOTH:{label:'CO₂ + PM₂.₅ · COMPETING PRESSURES',signal:'CO₂ is rising indoors while outdoor PM₂.₅ is high.',context:'The classroom now has competing environmental signals. A single-number rule is unlikely to establish the whole consequence.',proposal:'Use a bounded ventilation + filtration response.'},
  UNKNOWN:{label:'NO CONTINUOUS CLASSROOM RECORD',signal:'The school has no continuous classroom-level IAQ record for the occupied period.',context:'A purifier, filter, fan or code provision is not itself evidence of current occupied performance.',proposal:'Establish a measurement and verification record before escalation.'},
  FAILURE:{label:'SYSTEM INSTALLED · PERFORMANCE UNKNOWN',signal:'Ventilation or filtration equipment exists, but maintenance, bypass, pressure drop or actual delivery is not established.',context:'Installed equipment is not the same as verified performance. The execution record has to reach the occupied classroom.',proposal:'Inspect, test, correct and verify system performance.'}
};

const actions={
  MEASURE:{title:'MEASURE',desc:'Collect an attributable classroom record before treating a signal as permission to intervene.'},
  VENTILATE:{title:'VENTILATE',desc:'Change outdoor-air delivery only within the authority and operating conditions that apply locally.'},
  FILTER:{title:'FILTER',desc:'Change particulate control while preserving the ventilation duty and documenting maintenance consequences.'},
  MAINTAIN:{title:'MAINTAIN',desc:'Inspect filters, fans, pressure drop, bypass, controls and physical condition before relying on installed equipment.'},
  RELOCATE:{title:'RELOCATE / CHANGE USE',desc:'Change occupancy or use only when the actor with authority and standing to do so is established.'},
  ESCALATE:{title:'ESCALATE',desc:'Move the matter to the actor whose authority is required when the current boundary cannot execute the proposed consequence.'}
};

const chain=[
 ['REALITY','An occupied classroom has a real environmental condition.'],
 ['RECORD','The observation, measurement, complaint or operating state is preserved with time, place and method.'],
 ['CONTINUITY','The record remains attributable as it moves between school, operator, authority and reviewer.'],
 ['ADMISSIBILITY','The evidence is sufficient for the specific consequence being proposed.'],
 ['BINDING','The applicable standard, duty, policy, instruction or local authority is connected to that consequence.'],
 ['COMMIT','An actor with authority accepts responsibility for the proposed action.'],
 ['EXECUTION','Access, resources and permission exist to perform the action.'],
 ['OUTCOME','What actually happened is measured and preserved as the next baseline.']
];

export default function IndiaSchoolAir(){
 const [scenario,setScenario]=useState<keyof typeof scenarios>('BOTH');
 const [action,setAction]=useState<keyof typeof actions>('FILTER');
 const s=scenarios[scenario], a=actions[action];
 const state=useMemo(()=>{
   if(scenario==='UNKNOWN') return {det:'HOLD',e:'PARTIAL',auth:'UNESTABLISHED',stand:'UNESTABLISHED',why:'The record is not yet sufficient to support a physical consequence. Establish the occupied classroom condition first.'};
   if(action==='MEASURE') return {det:'ALLOW / BOUNDED',e:'SUPPORTED',auth:'LOCAL',stand:'LOCAL',why:'Measurement can proceed when installation, access, data handling and school authority are locally established. The result remains evidence, not automatic execution authority.'};
   if(scenario==='FAILURE' && action==='MAINTAIN') return {det:'HOLD → VERIFY',e:'PARTIAL',auth:'LOCAL',stand:'LOCAL',why:'The installed system is known, but performance is not. Inspection and verification should precede claims about delivered IAQ.'};
   return {det:'HOLD',e:'SCENARIO-SPECIFIC',auth:'MUST BE ESTABLISHED',stand:'MUST BE ESTABLISHED',why:'The environmental signal can justify examination, but the selected physical consequence still requires evidence, authority and standing at the local execution boundary.'};
 },[scenario,action]);

 return <main className="page">
  <nav className="nav shell"><a href="/showrooms/environmental-atmospheric">← ENVIRONMENTAL & ATMOSPHERIC</a><div><a href="#exam">EXAM</a><a href="#lab">LAB</a><a href="#sources">SOURCES</a></div></nav>

  <header className="hero shell">
   <div className="flagBand"><div className="flag" aria-label="Flag of India" role="img"><span/><i/></div><div><small>INDIA · COUNTRY EXAMINATION</small><b>14.71 LAKH SCHOOLS · 24.69 CRORE STUDENTS</b></div></div>
   <p className="eyebrow">INDIA SCHOOL AIR · INDEPENDENT PUBLIC EXAMINATION · 2026</p>
   <h1>THE SENSOR SEES IT.<br/><em>WHO MAY ACT?</em></h1>
   <p className="lead">India can measure the classroom. The harder boundary is what the measurement is allowed to cause.</p>
   <p className="intro">This examination begins with a practical school question: PM₂.₅, CO₂, ventilation, filtration, maintenance and verification can all matter at the same time. TA-14 examines the missing seam between an environmental signal and an authorized real-world consequence.</p>
   <div className="notice">INDEPENDENT TA-14 EXAMINATION · OPEN FOR CORRECTION · NO GOVERNMENT, SCHOOL, ISHRAE, WHO OR INDIVIDUAL ENDORSEMENT IMPLIED · NO NATIONAL GAP PRESUMED</div>
  </header>

  <section className="question"><div className="shell"><small>TA-14 GOVERNING QUESTION</small><h2>Does this proposed consequence have sufficient <em>Admissible Evidence</em>, <em>Applicable Authority</em>, and <em>Established Standing</em> to become reality <strong>NOW?</strong></h2></div></section>

  <section className="shell section facts">
   <p className="eyebrow">01 · WHAT INDIA ALREADY HAS</p><h2>This is not a blank-slate problem.</h2>
   <div className="factGrid">
    <article><b>14.71 LAKH</b><span>SCHOOLS</span><p>UDISE+ 2024–25 reports 14.71 lakh schools nationally.</p></article>
    <article><b>24.69 CRORE</b><span>STUDENTS</span><p>UDISE+ 2024–25 reports 24.69 crore students.</p></article>
    <article><b>69 / 5 / 26%</b><span>SCHOOL MANAGEMENT SHARE</span><p>Government / government-aided / private share of schools in the official 2024–25 summary.</p></article>
   </div>
   <div className="evidenceGrid">
    <article><small>NATIONAL AMBIENT REFERENCE</small><h3>PM₂.₅</h3><p>India’s National Ambient Air Quality Standards use 40 µg/m³ annual and 60 µg/m³ 24-hour PM₂.₅ values. These are ambient standards, not a universal classroom action trigger.</p></article>
    <article><small>BUILDING-CODE LAYER</small><h3>ECSBC 2024</h3><p>Within its defined applicability, ECSBC 2024 includes mandatory indoor-air-quality provisions for PM₁₀/PM₂.₅ source control and ventilation designed to required rates.</p></article>
    <article><small>SCHOOL HEALTH LAYER</small><h3>AIR-POLLUTION ADVISORY</h3><p>India’s health advisory for school children includes classroom ventilation, closing windows when outdoor air is poor, wet mopping, AQI awareness and limiting outdoor activity during high-pollution periods.</p></article>
    <article><small>PROFESSIONAL STANDARD</small><h3>ISHRAE IEQ</h3><p>ISHRAE publishes an Indoor Environmental Quality Standard for India. A professional standard can inform design and operation, but applicability and authority still have to be established for the consequence at hand.</p></article>
   </div>
   <p className="warning"><strong>Critical distinction:</strong> a national ambient value, a building-code provision, a professional standard, a school advisory and a live classroom sensor reading are not the same kind of authority.</p>
  </section>

  <section id="exam" className="dark"><div className="shell section">
   <p className="eyebrow">02 · THE EXECUTION PATH</p><h2>MEASURE is the beginning.<br/>VERIFY is not the end.</h2>
   <p className="copy">The evidence has to survive the whole path from occupied reality to consequence and back to a verified outcome.</p>
   <div className="chain">{chain.map(([t,d],i)=><article key={t}><span>{String(i+1).padStart(2,'0')}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
   <p className="rule">Monitoring is not evidence. Evidence is not authority. Authority is not execution.</p>
  </div></section>

  <section id="lab" className="shell section lab">
   <p className="eyebrow">03 · INTERACTIVE CLASSROOM LAB</p><h2>Same classroom. Different signal. Different consequence.</h2>
   <p className="copy">Choose what is happening, then choose what someone proposes to do. The point is not to manufacture an answer. It is to expose what still has to be established.</p>
   <div className="scenarioButtons">{Object.entries(scenarios).map(([k,v])=><button key={k} className={scenario===k?'active':''} onClick={()=>setScenario(k as keyof typeof scenarios)}><b>{v.label}</b><span>{v.signal}</span></button>)}</div>
   <div className="scenario"><small>CLASSROOM CONDITION</small><h3>{s.label}</h3><p>{s.context}</p><b>INITIAL PROPOSAL: {s.proposal}</b></div>
   <div className="actionButtons">{Object.entries(actions).map(([k,v])=><button key={k} className={action===k?'active':''} onClick={()=>setAction(k as keyof typeof actions)}><b>{v.title}</b><span>{v.desc}</span></button>)}</div>
   <div className="determination">
    <div><small>PROPOSED CONSEQUENCE</small><strong>{a.title}</strong><p>{a.desc}</p></div>
    <article><small>ADMISSIBLE EVIDENCE</small><b>{state.e}</b><p>What measurement, method, duration, calibration, occupancy context and corroboration support this specific action?</p></article>
    <article><small>APPLICABLE AUTHORITY</small><b>{state.auth}</b><p>Which school, operator, owner, local body, code, health instruction or delegated role can authorize this consequence here?</p></article>
    <article><small>ESTABLISHED STANDING</small><b>{state.stand}</b><p>Who is entitled to request, approve, fund, direct, execute and verify this action?</p></article>
    <aside><small>CURRENT TA-14 STATE</small><strong>{state.det}</strong><p>{state.why}</p></aside>
   </div>
  </section>

  <section className="split">
   <div className="shell section">
    <p className="eyebrow">04 · THE SCHOOL-AIR PARADOX</p><h2>Ventilation can help one signal and worsen another.</h2>
    <div className="paradox">
     <article><span>CO₂ ↑</span><h3>OPEN / VENTILATE?</h3><p>More outdoor air may improve occupied-space ventilation.</p></article>
     <b>≠</b>
     <article><span>OUTDOOR PM₂.₅ ↑</span><h3>OPEN / VENTILATE?</h3><p>The same outdoor-air pathway may import more particulate pollution.</p></article>
    </div>
    <div className="callout">That is why “open the window,” “buy a purifier,” and “install a filter” are not universal governance answers. The action has to fit the real condition, the building, the equipment, the local authority and the moment.</div>
   </div>
  </section>

  <section className="shell section">
   <p className="eyebrow">05 · THE NATIONAL QUESTION</p><h2>What would a measurable institutional promise require?</h2>
   <div className="five">
    <article><b>MEASURE</b><p>Occupied PM₂.₅, CO₂, temperature and humidity where those measurements are relevant and technically defensible.</p></article>
    <article><b>INTERPRET</b><p>Preserve method, calibration, location, occupancy, outdoor conditions and limits of inference.</p></article>
    <article><b>AUTHORIZE</b><p>Identify who may change operation, spend money, alter occupancy, procure equipment or escalate.</p></article>
    <article><b>EXECUTE</b><p>Record the actual intervention, not just the recommendation or purchase order.</p></article>
    <article><b>VERIFY</b><p>Measure the resulting classroom reality and preserve it as the next baseline.</p></article>
   </div>
   <p className="bigline">A school should not only be able to say <em>“we have a system.”</em><br/>It should be able to show <strong>what the occupied classroom delivered.</strong></p>
  </section>

  <section id="sources" className="sources"><div className="shell section">
   <p className="eyebrow">06 · PUBLIC SOURCE RECORD</p><h2>Inspect the basis.</h2>
   <div className="sourceList">
    <a href="https://www.education.gov.in/sites/upload_files/mhrd/files/statistics-new/UDISE%2BReport%202024-25%20-%20NEP%20Structure.pdf" target="_blank" rel="noreferrer"><b>Ministry of Education · UDISE+ 2024–25</b><span>School, student and management totals.</span></a>
    <a href="https://beeindia.gov.in/sites/default/files/ECSBC_2024.pdf" target="_blank" rel="noreferrer"><b>Bureau of Energy Efficiency · ECSBC 2024</b><span>Scope, ventilation and indoor-air-quality provisions.</span></a>
    <a href="https://ncdc.mohfw.gov.in/wp-content/uploads/2025/04/Updated-Draft-Health-Advisory-on-Air-Pollution-under-NPCCHH_latest-version_15-04-2025.pdf" target="_blank" rel="noreferrer"><b>Ministry of Health / NCDC · Health Advisory on Air Pollution</b><span>School-child precautions and classroom ventilation guidance.</span></a>
    <a href="https://cpcb.nic.in/displaypdf.php?id=bWFudWFsLW1vbml0b3JpbmcvQVFJX05BTVBfUmVwX1NlcHRlbWJlcjIwMTYucGRm" target="_blank" rel="noreferrer"><b>Central Pollution Control Board · NAAQS table</b><span>National ambient PM₂.₅ standard: 40 µg/m³ annual and 60 µg/m³ 24-hour.</span></a>
    <a href="https://www.ishrae.in/standards-position-published" target="_blank" rel="noreferrer"><b>ISHRAE Standards Committee</b><span>Indoor Environmental Quality Standard and related technical standards.</span></a>
    <a href="https://www.who.int/news/item/07-09-2022-who-releases-new-repository-of-resources-for-air-quality-management" target="_blank" rel="noreferrer"><b>World Health Organization · 2021 Air Quality Guidelines</b><span>Health-based PM₂.₅ guideline values; not legally binding standards.</span></a>
   </div>
   <div className="sourceNote"><strong>Open correction rule.</strong> If an Indian authority, school operator, engineer, researcher or practitioner can establish a more applicable source, authority, threshold, enforcement route or implementation record, TA-14 should admit the correction rather than defend the page.</div>
  </div></section>

  <section className="final shell section"><p className="eyebrow">TA-14 · INDIA SCHOOL AIR</p><h2>THE AIR CAN BE MEASURED.<br/><em>THE CONSEQUENCE MUST STILL BE AUTHORIZED.</em></h2><p>No admissible evidence. No admissible execution.</p></section>

  <style>{`
   *{box-sizing:border-box}.page{background:#f4f1e9;color:#101010;min-height:100vh;font-family:Arial,Helvetica,sans-serif}.shell{width:min(1180px,calc(100% - 40px));margin:auto}.nav{height:72px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #b7b1a5;font-size:11px;font-weight:900;letter-spacing:.12em}.nav a{color:inherit;text-decoration:none;margin-left:18px}.hero{padding:48px 0 72px}.flagBand{display:flex;gap:24px;align-items:center;padding:20px 0 42px}.flagBand small,.flagBand b{display:block}.flagBand b{font-size:26px;margin-top:8px}.flag{width:180px;height:108px;position:relative;background:linear-gradient(#ff9933 0 33.33%,#fff 33.33% 66.66%,#138808 66.66%);box-shadow:0 10px 26px #0002}.flag span{position:absolute;width:29px;height:29px;border:2px solid #000080;border-radius:50%;left:75px;top:39px}.flag i{position:absolute;width:2px;height:29px;background:#000080;left:89px;top:39px;box-shadow:5px 0 0 -0.5px #000080,-5px 0 0 -0.5px #000080;transform:rotate(45deg)}.eyebrow,small{font-size:11px;font-weight:900;letter-spacing:.18em}.hero h1{font-size:clamp(54px,9.2vw,124px);line-height:.83;letter-spacing:-.065em;margin:26px 0 38px}.hero h1 em,.final em{font-weight:400}.lead{font-size:clamp(27px,4.2vw,50px);max-width:950px;line-height:1.04}.intro,.copy{font-size:18px;line-height:1.6;max-width:880px}.notice{margin-top:42px;border:1px solid #111;padding:15px;font-size:10px;font-weight:900;letter-spacing:.07em}.question{background:#0a3b26;color:white;border-top:9px solid #ff9933;border-bottom:9px solid #138808;padding:68px 0}.question h2{font-size:clamp(31px,5vw,62px);line-height:1.05;max-width:1060px}.question em{color:#ffd36b;font-style:normal}.section{padding:86px 0}.section h2{font-size:clamp(38px,6vw,74px);letter-spacing:-.045em;line-height:.98;max-width:980px}.factGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:48px}.factGrid article{border:1px solid #111;padding:28px;background:#fff}.factGrid b{display:block;font-size:38px}.factGrid span{display:block;font-size:10px;font-weight:900;letter-spacing:.15em;margin:8px 0 18px}.factGrid p,.evidenceGrid p{line-height:1.5}.evidenceGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:12px}.evidenceGrid article{background:#0d231a;color:#fff;padding:26px;min-height:250px}.evidenceGrid small{color:#ffd36b}.evidenceGrid h3{font-size:27px}.warning{margin-top:20px;border-left:6px solid #ff9933;background:#fff;padding:22px;font-size:17px;line-height:1.5}.dark{background:#081713;color:#f8f4ea}.dark h2{color:white}.chain{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid #547266;border-left:1px solid #547266;margin-top:50px}.chain article{border-right:1px solid #547266;border-bottom:1px solid #547266;padding:24px;min-height:215px}.chain span{color:#ffcc63;font-weight:900}.chain h3{margin-top:35px}.chain p{color:#b9c8c1;line-height:1.5}.rule{font-size:21px;font-weight:900;margin-top:34px}.lab{background:#f4f1e9}.scenarioButtons{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:40px 0 14px}.scenarioButtons button,.actionButtons button{border:1px solid #8e897f;background:#fff;text-align:left;padding:18px;cursor:pointer}.scenarioButtons button{min-height:155px}.scenarioButtons button.active,.actionButtons button.active{background:#0a3b26;color:#fff;border-color:#0a3b26}.scenarioButtons b,.scenarioButtons span,.actionButtons b,.actionButtons span{display:block}.scenarioButtons span,.actionButtons span{font-size:12px;line-height:1.4;margin-top:10px}.scenario{background:#fff;border:1px solid #111;padding:28px;margin-bottom:14px}.scenario h3{font-size:32px;margin:12px 0}.scenario p{font-size:17px;line-height:1.55;max-width:900px}.actionButtons{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}.actionButtons button{min-height:130px}.determination{display:grid;grid-template-columns:1.1fr repeat(3,1fr);border:1px solid #111;margin-top:14px;background:#fff}.determination>div,.determination article{padding:24px;border-right:1px solid #111}.determination strong,.determination b{display:block;margin:12px 0;font-size:25px}.determination p{line-height:1.45;font-size:13px}.determination aside{grid-column:1/-1;background:#111;color:#fff;padding:28px}.determination aside strong{font-size:48px;color:#ffd36b}.split{background:linear-gradient(90deg,#ff9933 0 9px,#fff 9px 50%,#e8f1ea 50% 100%)}.paradox{display:grid;grid-template-columns:1fr auto 1fr;gap:24px;align-items:stretch;margin-top:45px}.paradox article{background:#0b2218;color:white;padding:34px}.paradox span{font-size:36px;font-weight:900;color:#ffd36b}.paradox h3{font-size:26px}.paradox p{line-height:1.5;color:#c7d1cc}.paradox>b{display:flex;align-items:center;font-size:44px}.callout{margin-top:18px;border:1px solid #111;padding:26px;font-size:20px;line-height:1.5;background:white}.five{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:48px}.five article{border-top:5px solid #0a3b26;background:#fff;padding:23px}.five b{font-size:18px}.five p{line-height:1.5;font-size:14px}.bigline{font-size:clamp(25px,4vw,48px);line-height:1.18;margin-top:60px}.bigline em{font-weight:400}.sources{background:#e3e0d7}.sourceList{margin-top:40px;border-top:1px solid #111}.sourceList a{display:grid;grid-template-columns:1fr 1fr;gap:25px;padding:20px 0;border-bottom:1px solid #aaa;color:#111;text-decoration:none}.sourceList a:hover b{text-decoration:underline}.sourceList span{color:#555}.sourceNote{margin-top:32px;background:white;padding:24px;border-left:6px solid #0a3b26;line-height:1.5}.final{border-top:10px solid #ff9933}.final h2{font-size:clamp(45px,7.5vw,100px);line-height:.9}.final p{font-size:22px;font-weight:900}@media(max-width:900px){.evidenceGrid,.chain{grid-template-columns:1fr 1fr}.scenarioButtons{grid-template-columns:1fr 1fr}.actionButtons,.factGrid,.five{grid-template-columns:1fr 1fr}.determination{grid-template-columns:1fr}.determination>div,.determination article{border-right:0;border-bottom:1px solid #111}.paradox{grid-template-columns:1fr}.paradox>b{justify-content:center}.sourceList a{grid-template-columns:1fr}.nav div{display:none}.flagBand{align-items:flex-start;flex-direction:column}}@media(max-width:560px){.evidenceGrid,.chain,.scenarioButtons,.actionButtons,.factGrid,.five{grid-template-columns:1fr}.flag{width:150px;height:90px}.flag span{left:62px;top:32px}.flag i{left:76px;top:32px}.hero{padding-top:30px}}
  `}</style>
 </main>
}