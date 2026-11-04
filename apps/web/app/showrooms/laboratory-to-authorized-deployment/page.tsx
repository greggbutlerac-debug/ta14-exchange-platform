'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
const frames=[
  {
    "title": "Laboratory Efficacy Is Not Field Authorization",
    "file": "Laboratory Efficacy vs Real-World Authorization.png",
    "script": "A laboratory finding is evidence about a bounded test. It does not by itself establish field performance, occupant safety, regulatory permission or authority to install. We must examine the actual proposed consequence and its site.",
    "description": "Define the gap between a controlled experiment and a real occupied environment."
  },
  {
    "title": "Precisely Bounded Claims and Quantitative Evidence",
    "file": "Bounded Claims and Evidence Framework.png",
    "script": "State the target, endpoint, population, site, comparison, duration and uncertainty. Record the original observations and prohibit extrapolations the test cannot support. An unsupported health claim stays on hold even when a narrower laboratory finding is defensible.",
    "description": "Bind scientific claims to a precise endpoint and supporting evidence."
  },
  {
    "title": "Evidence Provenance, Raw Observations, and Baseline Continuity",
    "file": "Evidence Provenance and IAQ Continuity.png",
    "script": "Preserve instrument identity, calibration, methodology, timestamps and raw observations. Keep raw and adjusted data separately and document every transformation. Baselines must remain comparable as occupancy, ventilation, equipment and operating conditions change.",
    "description": "Protect provenance, unaltered readings, corrections and time continuity."
  },
  {
    "title": "Scientific Transferability Matrix and Six Examination Gates",
    "file": "Scientific Transferability Matrix and Examination Gates.png",
    "script": "Compare seven transfer dimensions: target, airflow, population, dose and time, performance, safety and continuity. Then examine the claim, transfer, safety, continuity, authority and verification gates. A difference or unknown may require hold or escalation, not a presumed pass.",
    "description": "Compare laboratory conditions with field conditions and examine six gates."
  },
  {
    "title": "Human Consequence Boundary",
    "file": "Human Consequence Boundary Infographic (1).png",
    "script": "Examine who may be affected, how exposure may occur, potential byproducts, vulnerable occupants, operating faults and stop conditions. Safety is a competent-specialist determination, not an inference from a performance graph. All scenario values shown are illustrations, not verified study results.",
    "description": "Protect people through bounded exposure, safety review and stop conditions."
  },
  {
    "title": "Applicable Authority and Established Standing",
    "file": "Authority and Standing Governance Infographic (3).png",
    "script": "Applicable authority asks which requirements permit or constrain a proposed consequence. Established standing asks who may act. Record actor, capacity, standing basis and authority relationship. Neither capability nor institutional access establishes authority.",
    "description": "Establish both governing rules and actor-specific standing."
  },
  {
    "title": "Separate Efficacy and Deployment Dispositions",
    "file": "Efficacy and Deployment Decision Framework.png",
    "script": "Maintain separate records for the scientific claim and for site deployment. A claim may remain on hold while a narrower, independently approved evaluation is considered. Conversely, a valid efficacy finding never grants permission to install or operate.",
    "description": "Keep efficacy findings separate from permission to execute."
  },
  {
    "title": "Verified Outcomes and Accountable Deployment",
    "file": "Verified Outcomes and Accountable Deployment.png",
    "script": "Execute only a specifically authorized action, monitor against a declared baseline, preserve deviations and adverse effects, and reassess changed conditions. The numbers and outcomes in the illustration are hypothetical; they are not EPA, Blueprint or real classroom findings.",
    "description": "Record execution, verify outcomes and renew or withdraw permission as conditions change."
  }
];
const deepExamination=[
  {
    "question": "What does the laboratory result actually establish, and what decision is now being proposed?",
    "evidence": [
      "Test protocol, apparatus, aerosol or surrogate identity, control design and performance endpoint",
      "Site description: classroom volume, occupancy, ventilation, source characteristics and proposed device placement",
      "Separate scope statements for a laboratory finding, a proposed field evaluation and any claimed health benefit"
    ],
    "failure": [
      "A chamber reduction becomes a claimed classroom infection-risk reduction without bridging evidence",
      "A manufacturer’s ability to operate equipment is mistaken for a school’s permission to install it"
    ],
    "release": "Specify the actual proposed consequence, site, actor and decision time. Keep laboratory findings and installation permission as separate records."
  },
  {
    "question": "Can each proposed assertion be traced to the precise measured endpoint and its uncertainty?",
    "evidence": [
      "Claim register: exact target, endpoint, time, comparator, population, site and exclusions",
      "Method version, calibration, controls, replicates, uncertainty interval, detection limits and data gaps",
      "Predeclared, scientifically justified acceptance criteria; no invented universal efficacy threshold"
    ],
    "failure": [
      "An aerosol-surrogate result is advertised as prevention of clinical infections",
      "Percentage reduction is reported without test conditions, uncertainty, comparator or unit"
    ],
    "release": "Retain only claims supported by the stated method and evidence; HOLD broader extrapolations pending new competent scientific review."
  },
  {
    "question": "Could an independent reviewer reconstruct the observation and every subsequent transformation?",
    "evidence": [
      "Device identity, calibration, location, clock/time-zone, operator and custody history",
      "Original unaltered time series with file integrity, missing intervals and known limitations",
      "Distinct adjusted records with adjustment reason, formula, version, author, timestamp and uncertainty impact"
    ],
    "failure": [
      "Corrected values silently overwrite the original measurements",
      "Baseline periods differ in occupancy or ventilation without documented comparability analysis"
    ],
    "release": "Restore an inspectable chain from raw observation to derived result. Where comparability cannot be justified, HOLD the comparison instead of hiding the difference."
  },
  {
    "question": "Which assumptions fail when a controlled chamber test is translated to this occupied location?",
    "evidence": [
      "Seven dimensions: target; airflow; population; dose and time; performance; safety; continuity",
      "For each dimension: matched, bounded difference, materially different or unknown, supported by a citation and rationale",
      "Gates G1 claim, G2 transfer, G3 safety, G4 continuity, G5 authority, G6 verification with independent reviewers where appropriate"
    ],
    "failure": [
      "A transfer matrix is marked matched without a defensible reference criterion",
      "An unknown byproduct or uncharacterized occupant exposure is silently treated as pass"
    ],
    "release": "Resolve material differences or narrow the proposal to a justified field evaluation. ESCALATE unresolved specialist safety issues."
  },
  {
    "question": "Who may experience intended and unintended consequences, and what safeguards are actually supported?",
    "evidence": [
      "Affected populations and exposures: occupants, workers, sensitive groups, adjacent spaces and bystanders",
      "Technology-specific byproducts, fault conditions, secondary pathways and cumulative or long-duration exposure",
      "Competent safety reviewer, monitored limits, incident-reporting route, stop triggers and rollback responsibilities"
    ],
    "failure": [
      "An IAQ trend is presented as proof of improved health or absence of adverse effects",
      "A favorable hypothetical image disposition substitutes for a documented toxicology or risk review"
    ],
    "release": "Require competent safety review, bounded conditions and a valid stop protocol. Do not claim human outcomes without an independent study designed for those endpoints."
  },
  {
    "question": "Do the governing permissions exist, and does this actor have standing to use them here and now?",
    "evidence": [
      "Applicable rules and site permissions, including procurement, building operations and competent safety oversight",
      "ASA: ACTOR, CAPACITY, STANDING BASIS and AUTHORITY RELATIONSHIP each documented separately",
      "Exact equipment, site, action boundary, duration, restrictions, expiry and responsible decision maker"
    ],
    "failure": [
      "Site access is mistaken for authority to approve installation",
      "Professional expertise or ownership of lab data is mistaken for regulatory or school-district authority"
    ],
    "release": "Document both applicable authority and established standing at the precise decision boundary. DENY an action prohibited by the governing rule; HOLD incomplete remediable standing."
  },
  {
    "question": "What is scientifically supported, and what separate action is legally and institutionally permitted?",
    "evidence": [
      "Record A: tested claim, protocol, uncertainty, comparator, scientific reviewer and transfer limitations",
      "Record B: site/asset, authorized actor, permissions, standing, safety interfaces and decision conditions",
      "Distinct dispositions and reasons, preserving rejected, pending and bounded alternatives"
    ],
    "failure": [
      "A scientific PASS is used as a deployment permit",
      "A HOLD on a broad infection-risk claim is treated as a blanket prohibition on all narrower evaluation proposals"
    ],
    "release": "Issue separate claim and execution records. Consider a narrowly scoped evaluation only after its own evidence, safety, ethical and site-authorization prerequisites are met."
  },
  {
    "question": "Was only the authorized action executed, and what can the post-action record genuinely demonstrate?",
    "evidence": [
      "Authorized action identity, effective time, responsible actor, equipment configuration and deviation log",
      "Defined baseline, post-action monitoring, confounders, raw/adjusted observations and uncertainty",
      "Outcome criteria, adverse-event reports, new risk review, expiration and reassessment triggers"
    ],
    "failure": [
      "A post-versus-pre change is asserted to prove causal effect without a valid comparison",
      "HOLD is interpreted as permission to modify, or DENY is confused with an emergency stop order"
    ],
    "release": "Continue only within a current bounded ALLOW and ongoing safeguards. Changed conditions require a new versioned decision; emergency stop follows its own valid safety authority."
  }
];
const classroomProposals=[
  {
    "label": "Broad infection-risk claim",
    "finding": "A chamber surrogate reduction cannot independently establish reduction of infection risk in occupied classrooms.",
    "disposition": "HOLD",
    "reopen": "Provide an appropriately designed endpoint-specific evaluation, analysis of uncertainty, and competent scientific review."
  },
  {
    "label": "Occupied classroom deployment",
    "finding": "The example has no classroom characterization, site safety review, or documented deployment permission.",
    "disposition": "HOLD",
    "reopen": "Characterize site conditions; obtain competent safety review, authority and established standing; define operating and stop limits."
  },
  {
    "label": "Narrow bounded field evaluation",
    "finding": "A limited study may be examined as a separate proposal, but there is no protocol or authority record yet.",
    "disposition": "NOT YET DETERMINED",
    "reopen": "Prepare a field protocol, safeguards, applicable approvals, measurable endpoints, and site-specific signing authority."
  }
];
const imageNotices=["This laboratory and classroom comparison is conceptual. A chamber measurement does not establish field performance or grant installation authority.","The illustrated transferability and evidence examples are not real test reports. Criteria and numeric limits must be selected for the actual technology and use case.","The displayed readings, adjustments and time series are invented teaching values, not field data. No observed effectiveness can be inferred from the chart.","Matrix labels and gate outcomes are hypothetical examples, not findings for a real site. Unresolved safety questions require review by competent specialists.","The classroom measurements, health changes and green ALLOW panel are fictional. They do not establish health benefits, safety or permission to deploy.","The pictured school permissions and actor roles are illustrative, not actual approvals. Real standing requires site-specific documentary verification.","The illustrated efficacy PASS and deployment outcomes are examples, not technical certifications or real authorizations. Separate decisions must remain independently grounded.","The illustration shows an example process for authorized execution, monitoring, comparison and accountability. Any sample measurements, safety conclusions, outcomes or dispositions are hypothetical; none represents verified field results or an actual authorization."];
const transitions=[
['You learned that a controlled laboratory result cannot authorize an occupied-site intervention.','Next: define exactly what scientific claim the result supports and which quantitative evidence is required.'],
['You learned to bound claims by endpoint, comparator, population, uncertainty, and prohibited extrapolations.','Next: preserve the provenance, raw observations and comparable baseline needed to examine that claim.'],
['You learned why source identity, unmodified raw readings, documented adjustments and operating continuity matter.','Next: test whether laboratory evidence transfers to field conditions and examine the six decision gates.'],
['You learned to classify transfer differences and examine claim, field, safety, continuity, authority and verification separately.','Next: examine the people exposed, possible byproducts and adverse-effect stop conditions.'],
['You learned that evidence of improved air measurements is not automatically evidence of occupant safety or clinical benefit.','Next: identify the applicable authority and whether the particular actor has established standing.'],
['You learned that applicable rules and an actor’s standing are distinct requirements; neither is inferred from technical capability.','Next: keep the scientific efficacy decision separate from permission to deploy.'],
['You learned that efficacy findings and deployment authorization have independent scopes and dispositions.','Next: examine post-execution monitoring, outcome verification and reassessment.'],
['You learned that outcomes require separate verification and that changing conditions can require renewed authorization.','You have completed the sequence. Inspect the reference PDF and propose a bounded technical examination before any real deployment.']
];
const pdf='/'+encodeURIComponent('TA14_Laboratory_to_Authorized_Deployment_v2_1_Readability_Repaired.pdf');
function speak(script:string,onDone:()=>void){if(!('speechSynthesis' in window))return false;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(script);const v=window.speechSynthesis.getVoices();u.voice=v.find(x=>/Samantha/i.test(x.name))||v.find(x=>x.lang==='en-US')||null;u.rate=.91;u.onend=onDone;u.onerror=onDone;window.speechSynthesis.speak(u);return true}
export default function LaboratoryDeploymentShowroom(){const [active,setActive]=useState(-1);useEffect(()=>()=>{window.speechSynthesis?.cancel()},[]);function narrate(i:number){if(active===i){window.speechSynthesis?.cancel();setActive(-1);return}const message='Image '+(i+1)+'. '+frames[i].title+'. '+frames[i].script+' Detailed examination. '+deepExamination[i].question+' Evidence required: '+deepExamination[i].evidence.join('. ')+'. Failure conditions: '+deepExamination[i].failure.join('. ')+'. Reopen boundary: '+deepExamination[i].release+'. What you just learned: '+transitions[i][0]+' What comes next: '+transitions[i][1];setActive(i);if(!speak(message,()=>setActive(-1)))setActive(-1)}
return <main className="room"><div className="wrap"><nav><Link href="/showrooms">← All showrooms</Link><Link href="/showrooms/environmental-atmospheric">Environmental & atmospheric →</Link><Link href="/">TA14 Exchange →</Link></nav><header><p className="eyebrow">TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT TECHNICAL SHOWROOM</p><h1>FROM LABORATORY EFFICACY<br/><em>TO AUTHORIZED DEPLOYMENT</em></h1><p className="lead">Eight-image guided examination of the evidence-to-execution boundary for air-treatment technologies.</p><p className="note">Independent teaching surface informed by research-to-deployment challenges discussed in correspondence concerning EPA–Blueprint Biosecurity CRADA work. Not an EPA or Blueprint publication, endorsement, collaboration, authorization, or review. No confidential CRADA information was used. All device configurations, numerical results, health outcomes and dispositions displayed in illustrations are hypothetical.</p><div className="actions"><a href={pdf} download>↓ Download Technical Reference v2.1 (PDF)</a><a className="outline" href="#sequence">Explore eight images ↓</a></div></header><section className="question"><small>THE GOVERNING QUESTION</small><h2>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</h2><p>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</p></section><section className="case" aria-label="Hypothetical worked examination"><p className="eyebrow">WORKED EXAMPLE · ILLUSTRATIVE ONLY · NO FORMAL DETERMINATION</p><h2>One classroom. Three different proposed consequences.</h2><p>A manufacturer presents controlled-chamber reduction of a defined airborne surrogate. A school considers installation in occupied rooms and suggests the result proves reduced infection risk. For teaching purposes, the classroom field conditions, human safety package and decision authority are not yet established. The three proposals must not be collapsed into a single PASS or FAIL.</p><div className="proposalGrid">{classroomProposals.map((p,i)=><div className="proposal" key={p.label}><small>DECISION RECORD {String.fromCharCode(65+i)}</small><h3>{p.label}</h3><p>{p.finding}</p><strong>{p.disposition}</strong><details><summary>What would reopen examination?</summary><p>{p.reopen}</p></details></div>)}</div><p className="scope">This example contains no real device testing, clinical outcomes or agency approvals. HOLD applies to the defined proposal; it does not provide authority to proceed or preclude a distinct, independently authorized proposal.</p></section><section id="sequence"><h2>Eight-image technical examination</h2><p className="casewarning">TEACHING SCENARIO ONLY — The images contain invented measurements and example dispositions. No field trial, clinical effect, agency decision, CRADA outcome or actual authorization is represented. All real-world requirements remain subject to independent scientific, safety, regulatory and local authority review.</p><p>Scroll freely or select any image. Each teaching panel includes optional spoken narration, using Samantha when available in your browser.</p><div className="jump">{frames.map((s,i)=><a href={'#image-'+(i+1)} key={s.title}>{String(i+1).padStart(2,'0')} · {s.title}</a>)}</div>{frames.map((f,i)=><article id={'image-'+(i+1)} key={f.file}><div className="framehead"><span>{String(i+1).padStart(2,'0')}</span><div><h3>{f.title}</h3><p>{f.description}</p></div></div><img loading={i<2?'eager':'lazy'} src={'/'+encodeURIComponent(f.file)} alt={f.title+' — TA14 educational infographic; all numerical examples are illustrative'} /><p className="imagewarning"><strong>ILLUSTRATIVE · NOT A REAL DETERMINATION.</strong> {imageNotices[i]}</p><section className="deepDive" aria-label={'Technical examination for image '+(i+1)}><p className="eyebrow">TECHNICAL EXAMINATION · FRAME {String(i+1).padStart(2,'0')}</p><h4>{deepExamination[i].question}</h4><div className="deepGrid"><div><h5>Evidence required</h5><ul>{deepExamination[i].evidence.map(item=><li key={item}>{item}</li>)}</ul></div><div><h5>Common failure / HOLD trigger</h5><ul>{deepExamination[i].failure.map(item=><li key={item}>{item}</li>)}</ul></div></div><p className="release"><strong>Release or reconsideration boundary:</strong> {deepExamination[i].release}</p></section><div className="under"><button type="button" onClick={()=>narrate(i)} aria-label={(active===i?'Stop':'Play')+' narration for image '+(i+1)}>{active===i?'■ Stop narration':'▶ Hear narration'}</button><details><summary>Read complete narration</summary><p>{f.script}</p><p><strong>Technical examination:</strong> {deepExamination[i].question}</p><p><strong>Evidence required:</strong> {deepExamination[i].evidence.join('; ')}.</p><p><strong>Failure conditions:</strong> {deepExamination[i].failure.join('; ')}.</p><p><strong>Release or reconsideration boundary:</strong> {deepExamination[i].release}</p><p><strong>What you just learned:</strong> {transitions[i][0]}</p><p><strong>What comes next:</strong> {transitions[i][1]}</p></details></div><aside className="transition" aria-label={'Learning summary for image '+(i+1)}><p><strong>WHAT YOU JUST LEARNED</strong><br/>{transitions[i][0]}</p><p><strong>WHAT COMES NEXT</strong><br/>{transitions[i][1]}</p></aside></article>)}</section><section className="close"><h2>What may legitimately be concluded?</h2><p>Scientific claim support, evidence transferability, safety, site authority and actor standing must be documented for the exact proposed action. A HOLD on a broad efficacy claim is not the same as a DENY for every narrower field study. An ALLOW is bounded by site, scope, actor, time and conditions and must be re-examined when they materially change.</p><p><strong>ALLOW / HOLD / DENY / ESCALATE</strong> apply to defined proposals, not technologies in the abstract. This room is an independent educational examination, not an engineering design, health claim, risk assessment, or regulatory determination.</p><div className="actions"><a href={pdf} download>↓ Technical Reference PDF</a><Link href="/showrooms">Explore all showrooms →</Link></div></section><footer>TA14 AUTHORITY GOVERNANCE INSTITUTION · EVIDENCE BEFORE CONSEQUENCE · NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</footer></div><style jsx>{`
.case{padding:38px 0;border-bottom:1px solid #315568}.case h2{font-size:clamp(25px,3.5vw,38px);margin:12px 0}.case>p{color:#c1d8e0;line-height:1.75}.proposalGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:22px 0}.proposal{background:#0d2838;border:1px solid #3c6980;border-radius:12px;padding:20px}.proposal small{color:#85dfea;letter-spacing:.11em;font-weight:800}.proposal h3{font-size:20px;line-height:1.25}.proposal p,.proposal details{color:#c4dbe2;line-height:1.65}.proposal>strong{display:inline-block;padding:7px 10px;background:#352716;color:#ffd590;border-radius:6px;font-size:12px}.proposal summary{cursor:pointer;margin:18px 0 4px;color:#a4edf3;font-weight:700}.scope{font-size:14px}.deepDive{margin:18px 0 25px;padding:25px;border:1px solid #39667c;border-radius:13px;background:#0a2130}.deepDive h4{font-size:clamp(21px,2.5vw,28px);margin:14px 0;line-height:1.35}.deepGrid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.deepGrid>div{border-top:1px solid #426174;padding-top:10px}.deepGrid h5{font-size:15px;color:#a4e7f3;margin:8px 0}.deepGrid ul{padding-left:21px;color:#ccdee5;line-height:1.7}.deepGrid li{margin:9px 0}.release{line-height:1.7;padding:14px;background:#112f3b;border-radius:8px;color:#dceff2}@media(max-width:800px){.proposalGrid{grid-template-columns:1fr}.deepGrid{grid-template-columns:1fr}}.room{min-height:100vh;background:#061722;color:#e7f4fa;font-family:Arial,sans-serif}.wrap{max-width:1180px;margin:auto;padding:25px 22px}nav{display:flex;gap:24px;flex-wrap:wrap;font-size:13px}nav :global(a){color:#8de4ef}header{padding:65px 0 45px}.eyebrow,.question small{color:#7decc5;font-size:12px;font-weight:800;letter-spacing:.14em}h1{font-size:clamp(38px,6vw,68px);line-height:1.07;letter-spacing:-.04em;margin:20px 0}h1 em{font-style:normal;color:#82e9f4}.lead{font-size:22px;line-height:1.55;max-width:900px}.note{font-size:14px;line-height:1.75;border:1px solid #765d3b;padding:17px;border-radius:12px;background:#211c19;color:#e5d7c3}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}.actions a{display:inline-block;background:#89e4ed;color:#06202c;padding:14px 18px;border-radius:9px;text-decoration:none;font-weight:800}.actions .outline{background:transparent;color:#91e6ed;border:1px solid #5696a4}.question{border-block:1px solid #315568;padding:36px 0 42px}.question h2{font-size:clamp(24px,3vw,37px);line-height:1.35;max-width:1000px}.question p{color:#94c4d2}#sequence{padding:40px 0}#sequence>h2,.close h2{font-size:32px}#sequence>p,.close p{color:#bad2dd;line-height:1.7}.jump{display:flex;flex-wrap:wrap;gap:9px;margin:26px 0 38px}.jump a{border:1px solid #426679;color:#c8eef5;padding:9px 12px;text-decoration:none;border-radius:8px;font-size:12px}article{scroll-margin-top:20px;border-top:1px solid #345060;padding:35px 0 48px}.framehead{display:flex;align-items:start;gap:18px;margin-bottom:19px}.framehead>span{font-size:33px;color:#77dbed;font-weight:900}.framehead h3{font-size:clamp(23px,3vw,34px);margin:0 0 8px}.framehead p{color:#a8c9d5;line-height:1.5;margin:0}article img{display:block;width:100%;height:auto;border-radius:12px;border:1px solid #274858} .under{display:flex;gap:20px;align-items:start;flex-wrap:wrap;margin-top:15px}.casewarning{padding:20px;background:#261d17;color:#ffdfb8;border:2px solid #c79753;border-radius:10px;line-height:1.7;font-size:15px}.imagewarning{padding:15px 18px;background:#261d17;border:1px solid #d0a15d;border-radius:8px;color:#f4dbc2;font-size:13px;line-height:1.6}.transition{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:24px;padding:18px;border:1px solid #41778a;border-radius:12px;background:#0b2634}.transition p{margin:0;line-height:1.7;color:#d1e6ec}.transition strong{color:#8de7f0;font-size:12px;letter-spacing:.07em}@media(max-width:650px){.transition{grid-template-columns:1fr}}.under button{background:#0d4c65;color:#fff;border:1px solid #6ed6e5;border-radius:8px;padding:12px 16px;cursor:pointer;font-weight:700}.under details{flex:1;min-width:240px;border:1px solid #305367;border-radius:8px;padding:12px 16px}.under summary{cursor:pointer;color:#93e5ed;font-weight:700}.under details p{color:#bdd2dc;line-height:1.7}.close{padding:35px 0 60px;border-top:1px solid #315568}footer{font-size:11px;text-align:center;color:#8eb1c1;border-top:1px solid #294b5b;padding:25px 0}@media(max-width:650px){.wrap{padding:16px}header{padding:36px 0}.framehead{gap:11px}.framehead>span{font-size:26px}}`}</style></main>}