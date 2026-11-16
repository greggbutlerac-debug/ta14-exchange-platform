'use client';
import Link from 'next/link';
import Image from 'next/image';
import {useState} from 'react';
import SamanthaNarration from '../../components/SamanthaNarration';

const pdf='/'+encodeURIComponent('TA14_Clean_Air_Sanctuary_Technical_Demonstration_Protocol_v0_4_corrected (1).pdf');
const raw=[
{
title:"The Owner's Intention",
img:"Clean Air Sanctuary_ Owner’s Intention.png",
intro:"A building owner starts with a specific public purpose, not permission for an algorithm to act.",
script:"A hypothetical public library is considered as a temporary Clean Air Sanctuary during an outdoor particle-pollution episode. The institution must define who the refuge is intended to serve, what environmental outcome is sought, what constraints apply, and who possesses authority to approve changes. The scene is conceptual: no municipal library has been selected or approved. Owner intention cannot override statutory duties, professional safety requirements, or the needs of affected occupants. Before any technical test, the proposed action and the criteria for judging it must be written down and frozen.",
learned:"An intended benefit is an accountable requirement to test, not evidence that the benefit has occurred.",
next:"Ask how affected people can contribute without claiming authority that belongs elsewhere."
},
{
title:"Community Governance",
img:"TA14_Clean_Air_Sanctuary_Image_02_Community_Governance_CORRECTED.png",
intro:"Community needs inform the purpose and stewardship of the sanctuary, without creating automatic operational permission.",
script:"For a public-facing Clean Air Sanctuary, we must identify which people are affected by an intervention, how their needs will be heard, what consent or consultation requirements actually apply, and who can speak on behalf of which interests. Community preferences and institutional operating authority are not identical. A community request cannot itself authorize a change that requires approval from a building owner, qualified professional, or applicable public authority. The governance model is proposed for technical examination; no community group has formally approved this demonstration.",
learned:"Represent consent, stewardship, and community interest separately from legal and professional execution authority.",
next:"Examine how a building representation supplies context but not verified physical truth."
},
{
title:"Building Representation",
img:"Clean Air Sanctuary_ Building Representation.png",
intro:"A digital model organizes the building context; a model is not a substitute for inspected physical conditions.",
script:"ONUMA-type building representation can connect spaces, equipment, air pathways and operating constraints to the proposed action. For this demonstration, the model would describe the hypothetical library and the exact window or ventilation state being evaluated. Its version, limitations, assumed system capacities and any field-confirmed elements must be marked separately. A visually persuasive digital twin does not prove that sensors are calibrated, dampers respond, or the building is safe. ONUMA participation is prospective, not a formal commitment or a claim that an integration is operating.",
learned:"Building intelligence describes context; independently attributable evidence establishes observed conditions.",
next:"Test whether environmental measurements are fresh, traceable, calibrated and fit for the action."
},
{
title:"Environmental Evidence",
img:"Environmental Evidence_ HVAC Integrity Nodes.png",
intro:"Decision-grade environmental evidence includes its provenance and uncertainty, not just a dashboard value.",
script:"The proposed evaluation may consider indoor and outdoor particulate observations alongside ventilation indicators, carbon dioxide, temperature and humidity where relevant to the action. Each required source should preserve its identity, location, timestamp, calibration status, data age, uncertainty, gaps and revisions. The environmental integrity nodes and green confirmation marks shown here are illustrative. They do not attest to installed sensors or verified calibration at a real site. In the test harness, a missing calibration record, stale measurement or contradictory source must remain visible and prevent unsupported permission under the frozen policy.",
learned:"Missing evidence is an explicit test condition, never a fact to infer or silently supply.",
next:"Identify the authority and standing needed at the exact moment of the proposed consequence."
},
{
title:"Authority & Standing",
img:"Authority & Standing_ Clean Air Sanctuary.png",
intro:"A proposed action is not admissible just because the data or recommendation looks convincing.",
script:"TA-14's Admissible Execution Architecture examines Admissible Evidence, Applicable Authority, and Established Standing for a particular action at the moment of decision. The owner, responsible professional, operator and community steward may have distinct rights and obligations; none inherits another's authority automatically. In the proposed simulation, the decision boundary may return ALLOW, HOLD, DENY or ESCALATE. An ALLOW is limited to the stated scope and duration within the test harness. Any real facility action would require separate institutional permissions, engineering review and safety controls.",
learned:"Authority must apply to this action, this actor, this place and this moment.",
next:"Examine why the decision was issued and whether the reason can be independently reconstructed."
},
{
title:"Decision & Rationale",
img:"Decision & Rationale_ Clean Air Sanctuary.png",
intro:"Every disposition must record the tested conditions, governing rule and reason for its result.",
script:"A reproducible decision binds the candidate consequence, evaluation time, evidence snapshot, policy version, authority and standing to one transaction identifier. The demonstration tests four dispositions. ALLOW means the exact simulated action satisfies its frozen prerequisites. HOLD means required evidence or another prerequisite is insufficient. DENY means the action violates a prohibition or hard limit. ESCALATE means an authorized person or institution must resolve an authority conflict. This illustration includes DDD, short for Declared Diagnostic Determination, an HVAC diagnostic term; DDD is not a required artifact for every Clean Air Sanctuary governance decision. The proper demonstration output here is a recorded AEA disposition with a reviewable rationale. The green ALLOW depiction is hypothetical, not a verified result.",
learned:"A decision, an attempted execution, and a verified environmental outcome are three separate claims.",
next:"Invite a reviewer to test the rules against cases specifically designed to expose failure."
},
{
title:"Independent Review",
img:"Independent Review Clean Air Sanctuary.png",
intro:"A credible demonstration invites independent reviewers to challenge assumptions and reproduce decisions.",
script:"The protocol proposes ten adversarial fixtures: a valid baseline, missing calibration, a persuasive prediction without authorization, a prohibited action, an authority conflict, an unestablished emergency claim, stale data, an unverified outcome, borrowed jurisdictional permission and contradictory measurements. Before any run, participants must freeze one expected disposition per fixture and the precedence rules that resolve conflicts. Reviewers should receive the scenario, policy, authority matrix, inputs, raw logs, exceptions and revisions. Green checkmarks in the image are conceptual and do not imply independent tests have already passed.",
learned:"A justified HOLD or DENY can be a successful governance test; results must be reproducible and failures retained.",
next:"Preserve the full decision history so another examiner can replay what was known and what occurred."
},
{
title:"Reproducible Record",
img:"Clean Air Sanctuary_ Reproducible Record.png",
intro:"The final product of the first demonstration is a challengeable decision record, not a claim of a completed lifetime deployment.",
script:"A reproducible record should bind what was proposed, what evidence was available at that time, which policy and authority applied, who held standing, the disposition, any simulated action attempt and the observed or unverified outcome. Preserve source, receipt, decision and action timestamps; revision lineage; gaps; failures; and reviewer findings. The lifetime record, completed maintenance items, cryptographic seal and green checkmarks in this illustration describe proposed capabilities or aspirations, not verified operations in a real Clean Air Sanctuary. The first controlled test must produce a bounded replayable package; longer-term stewardship and physical verification would require further work and authorization.",
learned:"Record integrity makes the decision inspectable; it does not itself prove improved air quality or health.",
next:"Read the technical protocol and challenge the proposed test before any field deployment."
}
] as const;
const lessons=raw.map(l=>({...l}));
const narrationLessons=lessons.map(l=>({title:l.title,learned:l.learned,next:l.next}));
type Disposition='ALLOW'|'HOLD'|'DENY'|'ESCALATE';
const fixtures:{id:string;condition:string;expected:Disposition;note:string}[]=[
{id:'F01',condition:'Evidence, authority, standing and constraints all valid',expected:'ALLOW',note:'Only within the frozen simulated scope'},
{id:'F02',condition:'Required calibration record missing',expected:'HOLD',note:'Missing mandatory evidence'},
{id:'F03',condition:'Strong prediction but no action authorization',expected:'HOLD',note:'Prediction does not confer permission'},
{id:'F04',condition:'Action violates a known hard limit',expected:'DENY',note:'Known prohibition takes precedence'},
{id:'F05',condition:'Competing authority claims require an adjudicator',expected:'ESCALATE',note:'Human or institutional resolution required'},
{id:'F06',condition:'Emergency authority claimed but unestablished',expected:'HOLD',note:'Never presume emergency override'},
{id:'F07',condition:'Evidence exceeds the frozen freshness bound',expected:'HOLD',note:'Retain the expired evidence version'},
{id:'F08',condition:'Authorized simulation but outcome remains unverified',expected:'ALLOW',note:'Decision may pass; outcome remains unproven'},
{id:'F09',condition:'Lagos authority reused for a Canadian building',expected:'HOLD',note:'No transfer of local permission'},
{id:'F10',condition:'Material contradiction in required sensor streams',expected:'HOLD',note:'Resolve uncertainty before action'}
];
const disclosure="PROPOSED TECHNICAL EXAMINATION · NO DEPLOYED PILOT OR CONFIRMED PARTNERSHIP. The facility, digital screens, green checks and test outcomes in the illustrations are conceptual. No building control, certification, measured air improvement, municipal approval, partner endorsement or funding award is asserted.";
const actionStyle={borderRadius:9,padding:'12px 16px',fontWeight:800,cursor:'pointer'} as const;
export default function CleanAirSanctuaryProtocol(){
 const [selected,setSelected]=useState<Disposition|null>(null);
 const [fixture,setFixture]=useState(1);
 const test=fixtures[fixture];
 return <main style={{background:'#06131d',color:'#f1f8fa',minHeight:'100vh',fontFamily:'Arial,Helvetica,sans-serif'}}>
 <div style={{maxWidth:1190,margin:'0 auto',padding:'0 20px 90px'}}>
 <nav style={{display:'flex',gap:20,flexWrap:'wrap',padding:'23px 0',borderBottom:'1px solid #31505c'}}>
 <Link href="/showrooms" style={{color:'#8ee9e7'}}>All showrooms</Link>
 <Link href="/showrooms/environmental-atmospheric" style={{color:'#8ee9e7'}}>Environmental & Atmospheric</Link>
 <Link href="/showrooms/clean-air-sanctuary-owner-intent" style={{color:'#8ee9e7'}}>Owner-intention showroom</Link>
 </nav>
 <header style={{padding:'54px 0 34px'}}>
 <p style={{color:'#8ee9e7',fontSize:12,fontWeight:900,letterSpacing:2}}>TA-14 AUTHORITY GOVERNANCE INSTITUTION · BOUNDED TECHNICAL EXAMINATION</p>
 <h1 style={{fontSize:'clamp(37px,6vw,69px)',lineHeight:1.07,margin:'15px 0',maxWidth:1050}}>Clean Air Sanctuary<br/><span style={{color:'#82e2df'}}>From Intention to a Reproducible Decision</span></h1>
 <p style={{fontSize:20,lineHeight:1.65,maxWidth:950,color:'#c2d8df'}}>Eight lessons, one bounded library scenario, ten adversarial test fixtures and a technical protocol for independent scrutiny of the proposed execution boundary.</p>
 <div style={{background:'#1d251d',border:'1px solid #9c8353',borderRadius:12,padding:20,lineHeight:1.8,color:'#f6e7c9'}}>{disclosure}</div>
 <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:23}}>
 <a href={pdf} target="_blank" rel="noopener noreferrer" style={{...actionStyle,background:'#8ee9e7',color:'#071721',textDecoration:'none'}}>READ 13-PAGE TECHNICAL PDF</a>
 <a href={pdf} download style={{...actionStyle,background:'#14323e',border:'1px solid #85b6c4',color:'#f1f8fa',textDecoration:'none'}}>DOWNLOAD PDF</a>
 <a href="#lessons" style={{...actionStyle,border:'1px solid #85b6c4',color:'#f1f8fa',textDecoration:'none'}}>EXPLORE EIGHT LESSONS</a>
 </div>
 </header>
 <section style={{padding:'25px 28px',borderRadius:15,background:'#0d2a38',border:'1px solid #335e6b'}}>
 <p style={{color:'#8ee9e7',fontWeight:800,letterSpacing:1.5,fontSize:12}}>THE EXECUTION-BOUNDARY QUESTION</p>
 <h2 style={{fontSize:'clamp(23px,3.1vw,35px)',lineHeight:1.34}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</h2>
 <p style={{lineHeight:1.75,color:'#bcd5de'}}>The proposed first evaluation is simulation or offline replay only. Independent life-safety and emergency procedures are outside the discretionary action gate and retain their own applicable authority.</p>
 </section>
 <section id="lessons" style={{paddingTop:45}}>
 <p style={{color:'#8ee9e7',fontWeight:900,letterSpacing:2}}>EIGHT IMAGE-GUIDED LESSONS</p>
 <p style={{fontSize:18,lineHeight:1.7,color:'#c0d5de'}}>Scroll straight down through all eight lessons. Every image, Samantha narration, explanation and takeaway appears in sequence without clicking Next.</p>
 {lessons.map((lesson,i)=><article key={lesson.img} id={'lesson-'+(i+1)} style={{padding:'35px 0 42px',borderBottom:'1px solid #365b69'}}>
 <h2 style={{fontSize:'clamp(26px,4vw,42px)',margin:'12px 0'}}>{String(i+1).padStart(2,'0')} / 08 · {lesson.title}</h2>
 <p style={{fontSize:18,color:'#c0d5de',lineHeight:1.65}}>{lesson.intro}</p>
 <div style={{position:'relative',width:'100%',aspectRatio:'16 / 9',borderRadius:15,overflow:'hidden',border:'1px solid #457283',background:'#11212d'}}>
 <Image src={'/'+encodeURIComponent(lesson.img)} alt={'Lesson '+(i+1)+' educational image: '+lesson.title+'; imagery and dashboards are conceptual'} fill sizes="(max-width: 900px) 100vw, 1190px" style={{objectFit:'contain'}} priority={i===0}/>
 </div>
 <div style={{marginTop:17,padding:23,border:'1px solid #365b69',borderRadius:13,background:'#0b2430'}}>
 <SamanthaNarration lessons={narrationLessons} lessonIndex={i} script={lesson.script}/>
 <p style={{lineHeight:1.85,color:'#d2e4e8',fontSize:16}}>{lesson.script}</p>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(275px,1fr))',gap:13,margin:'17px 0'}}>
 <div style={{padding:20,borderRadius:12,background:'#123039'}}><strong style={{color:'#8ee9e7'}}>WHAT YOU LEARNED</strong><p style={{lineHeight:1.7}}>{lesson.learned}</p></div>
 <div style={{padding:20,borderRadius:12,background:'#123039'}}><strong style={{color:'#8ee9e7'}}>WHAT COMES NEXT</strong><p style={{lineHeight:1.7}}>{lesson.next}</p></div>
 </div>
 </article>)}
 </section>
 <section id="review" style={{marginTop:72,padding:28,borderRadius:16,border:'1px solid #49707d',background:'#0b2835'}}>
 <p style={{color:'#8ee9e7',letterSpacing:2,fontWeight:900,fontSize:12}}>INTERACTIVE TECHNICAL EXAMINATION · SIMULATED POLICY ONLY</p>
 <h2 style={{fontSize:'clamp(27px,4vw,42px)'}}>Can you reproduce the disposition?</h2>
 <p style={{lineHeight:1.75,color:'#c7dade'}}>Select a frozen test fixture, then choose the expected AEA outcome. The answers below are <strong>predeclared proposed expectations</strong>, not results of an executed test. No real command is sent.</p>
 <label htmlFor="fixtureSelect" style={{display:'block',fontWeight:800,marginBottom:9}}>TEST CASE</label>
 <select id="fixtureSelect" value={fixture} onChange={e=>{setFixture(Number(e.target.value));setSelected(null)}} style={{padding:15,width:'100%',maxWidth:850,borderRadius:9,background:'#113844',color:'#fff',border:'1px solid #70aabb',fontSize:15}}>
 {fixtures.map((f,i)=><option key={f.id} value={i}>{f.id} · {f.condition}</option>)}
 </select>
 <p style={{fontSize:17,lineHeight:1.7}}>{test.condition}</p>
 <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
 {(['ALLOW','HOLD','DENY','ESCALATE'] as const).map(d=><button key={d} type="button" onClick={()=>setSelected(d)} aria-pressed={selected===d} style={{...actionStyle,background:selected===d?'#1f6570':'#112c38',color:'#fff',border:selected===d?'2px solid #99f3e5':'1px solid #53808e'}}>{d}</button>)}
 </div>
 {selected&&<div role="status" style={{background:'#14414c',padding:20,marginTop:17,borderRadius:11,lineHeight:1.75}}>
 <strong>{selected===test.expected?'Matches the proposed fixture expectation.':'Different from the proposed fixture expectation.'}</strong> Under the discussion-policy defaults, {test.id} expects <strong>{test.expected}</strong>. {test.note}. This is a teaching comparison only; participants must approve and freeze the policy before executing the test harness.
 </div>}
 <h3 style={{fontSize:25,marginTop:32}}>All ten proposed adversarial fixtures</h3>
 <div style={{overflowX:'auto'}}>
 <table style={{borderCollapse:'collapse',width:'100%',fontSize:14}}>
 <thead><tr style={{background:'#1a4754',textAlign:'left'}}><th style={{padding:13}}>ID</th><th style={{padding:13}}>Condition</th><th style={{padding:13}}>Expected</th></tr></thead>
 <tbody>{fixtures.map(f=><tr key={f.id} style={{borderBottom:'1px solid #345360'}}><td style={{padding:13}}>{f.id}</td><td style={{padding:13}}>{f.condition}</td><td style={{padding:13,fontWeight:800}}>{f.expected}</td></tr>)}</tbody>
 </table>
 </div>
 <p style={{fontSize:13,lineHeight:1.65,color:'#bdd1d8'}}>F08 deliberately separates an admissible decision from an unverified outcome. A passing gate does not demonstrate physical air-quality improvement. All thresholds, rule precedence and actor permissions remain subject to approval and freeze before testing.</p>
 </section>
 <section style={{marginTop:58}}>
 <p style={{color:'#8ee9e7',fontWeight:900,letterSpacing:2}}>INDEPENDENT REVIEW CHALLENGE</p>
 <h2 style={{fontSize:34}}>What evidence would justify the claim?</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',gap:13}}>
 {[
 ['01','Exact consequence','Which window or ventilation state, bounds, duration and rollback are being evaluated?'],
 ['02','Evidence integrity','Can a reviewer inspect instrument provenance, calibration, uncertainty, timestamps and revisions?'],
 ['03','Authority and standing','Which jurisdiction, institution and named actor can approve the decision now?'],
 ['04','Deterministic policy','Were one expected disposition per fixture and all precedence rules frozen before testing?'],
 ['05','Execution isolation','Can the harness demonstrate that no non-ALLOW disposition results in simulated actuation?'],
 ['06','Reproducibility','Can an independent reviewer replay the decisions using the preserved package alone?']
 ].map(([n,title,desc])=><div key={n} style={{padding:21,borderRadius:11,background:'#102a35',border:'1px solid #355b69'}}><strong style={{color:'#8ee9e7'}}> {n} · {title}</strong><p style={{lineHeight:1.7,color:'#d2e2e6'}}>{desc}</p></div>)}
 </div>
 <div style={{marginTop:26,padding:21,borderLeft:'4px solid #8ee9e7',background:'#112a33'}}>
 <strong>PUBLICATION BOUNDARY</strong><p style={{lineHeight:1.7,marginBottom:0}}>This showroom teaches a proposed method. Named partners are prospective participants only. Any participant commitments, municipal site, source data, test results, health outcome or funding assertion must be separately verified and approved for disclosure before publication.</p>
 </div>
 </section>
 <footer style={{marginTop:70,borderTop:'1px solid #31525e',paddingTop:26,display:'flex',flexWrap:'wrap',gap:22}}>
 <Link href="/showrooms" style={{color:'#8ee9e7'}}>All showrooms</Link>
 <Link href="/showrooms/clean-air-sanctuary-owner-intent" style={{color:'#8ee9e7'}}>Related owner-intent showroom</Link>
 <a href={pdf} style={{color:'#8ee9e7'}}>Technical protocol v0.4 (PDF)</a>
 </footer>
 </div>
 </main>;
}
