'use client';
import Link from 'next/link';
import Image from 'next/image';
import {useState} from 'react';
import SamanthaNarration from '../../components/SamanthaNarration';

const raw=[["Clean Air Sanctuary_ Verified Outcomes.png","From Owner Intention to Verified Outcomes","A community need becomes an owner-defined objective, not an automatic technology purchase.","Start with the proposed municipal library refuge. Its purpose is public benefit during poor outdoor air quality. The owner must define who is served, what protection is intended, and who has authority to approve a response. The building pictured is conceptual, not an identified or approved municipal facility.","A public objective needs an accountable owner and testable acceptance criteria.","Follow that objective through the complete responsibility chain."],["TA-14 Clean Air Responsibility Chain.png","The Chain of Responsibility","Seven linked stages separate intention, intelligence, authorization and results.","Community need leads to owner intention. ONUMA-type digital building context describes systems and constraints. Environmental evidence and frontier AI can recommend a bounded response. TA-14 Admissible Execution Architecture then examines Admissible Evidence, Applicable Authority, and Established Standing. Only an authorized actor or system executes within its approved limits. Finally, actual outcomes are measured and preserved. No stage silently inherits authority from the preceding stage.","AI recommendations and execution permission are separate decisions.","See what happens when an apparently reasonable recommendation lacks valid evidence."],["Clean Air Decision Control Room.png","The Moment the Building Must Decide","A hypothetical smoke event exposes the difference between recommendation and permission.","Imagine wildfire smoke and elevated outdoor particulate levels. AI proposes increasing filtration and adjusting ventilation. But a required sensor calibration has expired. The AEA execution gate returns HOLD for that proposed discretionary intervention, preserving the reason and the evidence record. The numerical readings in this image are illustrative, not site observations. HOLD must not disable independent life-safety systems or established emergency procedures.","A plausible recommendation can still be inadmissible for execution.","Learn how evidence can be restored and the decision re-examined."],["HOLD to Resolution_ Clean Air Path.png","From HOLD to Resolution","Correcting a deficient record triggers re-evaluation—not automatic permission.","A qualified party verifies or replaces the measurement source, records calibration and uncertainty, and rebuilds the evidence package. The AEA then re-evaluates the exact proposed action against current evidence, applicable authority, actor standing, policy, and safety constraints. ALLOW is only one possible outcome; HOLD, DENY, or ESCALATE may remain appropriate. The green ALLOW shown is a hypothetical conditional result, not a guaranteed transition.","Repairing evidence never bypasses a fresh execution decision.","Examine what building and environmental information must be available."],["Clean Air Sanctuary_ Building Context.png","Environmental Evidence and Building Context","Measurements only become decision-grade when their meaning and limits survive.","A defensible record links indoor and outdoor measurements to instrument identity, time, location, calibration, uncertainty, missing intervals, and building operating state. Digital asset context identifies system capabilities, ventilation and filtration limits, occupancy, and owner-approved policy. The ductwork in this illustration is conceptual, not an engineering schematic. The readings are hypothetical. AI may interpret this combined context, but the governor independently tests permission.","Environmental measurements, asset context and authorization must remain traceable and distinct.","Meet the four proposed architectural contributions."],["Four Contributions, One Clean Air Sanctuary.png","Four Architectural Contributions","Four complementary contributions are proposed, not yet contractually assigned.","Asset Leadership Network and Michael Bordenaro contribute a prospective owner-intent and asset-leadership perspective. ONUMA and Kimon Onuma contribute digital building and asset context. UnityNet International and Lloyd Helferty bring prospective Clean Air Sanctuary objectives and community-benefit coordination. TA-14 supplies the Admissible Execution Architecture and its evidence, authority and standing checks. The graphic illustrates a possible integration; it is not an endorsement or signed division of responsibilities.","The integration is compelling only if each party's scope and authority are explicitly agreed.","Define what an independently evaluated pilot would actually measure."],["TA-14 Clean Air Sanctuary Pilot (1).png","Demonstration and Independent Evaluation","Proposed outcomes are evaluation questions, not achieved performance claims.","A proposed pilot would define owner success criteria, integrate building context, deploy attributable environmental monitoring, apply the AEA gate, and document authorized actions and exceptions. Independent reviewers would assess indoor environmental performance, refuge accessibility and usable hours, energy and environmental trade-offs, equipment reliability, and evidence quality. The charts are illustrative. No measured improvement, certification, or public-benefit result has yet been established.","Credibility comes from pre-agreed methods, measured outcomes and transparent limitations.","Explore the conditions for replication beyond one building."],["From One Demonstration to Global Impact.png","From One Demonstration to a Replicable Model","Replication is a conditional pathway that must be earned by evidence.","First demonstrate the architecture in a bounded real-world setting. Then independently verify results, package requirements and methods, test replication in additional facilities, and consider municipal or wider scaling. Every location has different laws, authorities, systems and community needs. This image presents possible future applications, not existing deployments, international adoption or United Nations endorsement.","A reusable governance method requires independent evidence and local authority at every deployment.","Review the prospectus and challenge the proposed demonstration."]];
const lessons=raw.map((r)=>({img:r[0],title:r[1],intro:r[2],script:r[3],learned:r[4],next:r[5]}));
const narrationLessons=lessons.map(l=>({title:l.title,learned:l.learned,next:l.next}));
const pdf='/'+encodeURIComponent('TA14_Owner_Intent_Verified_Outcomes_V3_Refined_Prospectus (1).pdf');
const questions=[
'Who is the eligible municipal or nonprofit applicant, and has that organization accepted the role?',
'Which building, decision owner, operating policies and delegated authorities are actually available?',
'What evidence must be valid at execution time, and what happens when it is missing, stale or contradictory?',
'How do emergency and life-safety functions remain independently protected when a discretionary action is on HOLD?',
'Which public-benefit measures, baselines, uncertainties and independent evaluation methods will be agreed in advance?',
'What are the partner scopes, budget responsibilities, data rights, privacy limits and go/no-go milestones?'
];
export default function CleanAirSanctuaryShowroom(){
 const [active,setActive]=useState(0);
 const [answer,setAnswer]=useState<'ALLOW'|'HOLD'|'DENY'|'ESCALATE'|null>(null);
 const lesson=lessons[active];
 return <main style={{background:'#030b12',color:'#eef8fb',minHeight:'100vh',fontFamily:'Arial, sans-serif'}}>
 <div style={{maxWidth:1220,margin:'auto',padding:'0 22px 90px'}}>
 <nav style={{display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap',padding:'25px 0',borderBottom:'1px solid #284653',fontSize:12,fontWeight:800}}>
 <Link href="/showrooms" style={{color:'#78e8ed'}}>← ALL SHOWROOMS</Link>
 <Link href="/showrooms/environmental-atmospheric" style={{color:'#a9c1cb'}}>ENVIRONMENTAL & ATMOSPHERIC</Link>
 </nav>
 <header style={{padding:'72px 0 42px'}}>
 <p style={{letterSpacing:2,color:'#7be6e6',fontWeight:800,fontSize:12}}>TA-14 AUTHORITY GOVERNANCE INSTITUTION · PROPOSED MUNICIPAL DEMONSTRATION</p>
 <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(40px,6vw,76px)',lineHeight:1.04,maxWidth:1080,margin:'20px 0'}}>From Owner Intention to <span style={{color:'#7be6e6'}}>Admissible Execution</span> and Verified Outcomes</h1>
 <p style={{fontSize:21,lineHeight:1.65,maxWidth:970,color:'#c7d8df'}}>A proposed Clean Air Sanctuary demonstration connecting owner requirements, building intelligence, frontier AI, TA-14 execution governance and independently examinable public benefit.</p>
 <div style={{padding:22,border:'1px solid #4d6b78',borderRadius:14,background:'#0a1b25',lineHeight:1.7,maxWidth:1020}}><strong style={{color:'#f2cb7c'}}>PROPOSAL STATUS · NOT AN APPROVED OR OPERATING PILOT.</strong> The library, scenarios, data and outcomes depicted are conceptual or illustrative. ALN, ONUMA, UNIC and TA-14 contributions are proposed; no municipal approval, partner endorsement, funding award or verified outcome is implied.</div>
 <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:24}}>
 <a href={pdf} download style={{padding:'14px 20px',background:'#7be6e6',color:'#03151d',borderRadius:9,fontWeight:900,textDecoration:'none'}}>↓ DOWNLOAD 13-PAGE TECHNICAL & FUNDING PROSPECTUS</a>
 <a href="#lessons" style={{padding:'14px 20px',border:'1px solid #78e8ed',color:'#d6fafa',borderRadius:9,textDecoration:'none',fontWeight:800}}>EXPLORE EIGHT LESSONS</a>
 </div>
 </header>
 <section id="lessons" aria-label="Eight teaching images" style={{borderTop:'1px solid #23404e',paddingTop:36}}>
 <p style={{color:'#7be6e6',fontWeight:900,letterSpacing:2,fontSize:12}}>EIGHT-IMAGE EDUCATIONAL SHOWROOM</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:9,margin:'18px 0 25px'}}>
 {lessons.map((l,i)=><button type="button" key={i} onClick={()=>{setActive(i);setAnswer(null)}} aria-pressed={active===i} style={{textAlign:'left',background:active===i?'#13404b':'#0b1a24',color:'#f1fbff',border:active===i?'2px solid #7be6e6':'1px solid #31505c',borderRadius:9,padding:'13px 12px',cursor:'pointer',fontWeight:800,fontSize:13}}>{String(i+1).padStart(2,'0')} · {l.title}</button>)}
 </div>
 <h2 style={{fontSize:'clamp(26px,3vw,42px)',margin:'14px 0'}}>{String(active+1).padStart(2,'0')} / 08 · {lesson.title}</h2>
 <p style={{fontSize:18,color:'#bdd4dc',lineHeight:1.6}}>{lesson.intro}</p>
 <div style={{position:'relative',width:'100%',aspectRatio:'16 / 9',borderRadius:14,overflow:'hidden',border:'1px solid #335867',background:'#09131a'}}>
 <Image src={'/'+encodeURIComponent(lesson.img)} alt={lesson.title+' — conceptual educational illustration'} fill sizes="(max-width: 900px) 100vw, 1200px" style={{objectFit:'contain'}} priority={active===0}/>
 </div>
 <div style={{margin:'20px 0',padding:20,border:'1px solid #294e5a',borderRadius:12,background:'#081b25'}}>
 <SamanthaNarration lessons={narrationLessons} lessonIndex={active} script={lesson.script}/>
 <p style={{lineHeight:1.8,color:'#bfd4de',marginBottom:0}}>{lesson.script}</p>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:14,marginBottom:20}}>
 <div style={{padding:21,background:'#10242b',borderRadius:12}}><strong style={{color:'#7be6e6'}}>WHAT YOU LEARNED</strong><p style={{lineHeight:1.7}}>{lesson.learned}</p></div>
 <div style={{padding:21,background:'#10242b',borderRadius:12}}><strong style={{color:'#7be6e6'}}>WHAT COMES NEXT</strong><p style={{lineHeight:1.7}}>{lesson.next}</p></div>
 </div>
 <div style={{display:'flex',justifyContent:'space-between',gap:12}}>
 <button type="button" disabled={active===0} onClick={()=>{setActive(v=>Math.max(0,v-1));setAnswer(null)}} style={{padding:'12px 22px',background:'#17343d',color:'white',border:0,borderRadius:8,cursor:'pointer',opacity:active===0?.4:1}}>← PREVIOUS</button>
 <button type="button" disabled={active===7} onClick={()=>{setActive(v=>Math.min(7,v+1));setAnswer(null)}} style={{padding:'12px 22px',background:'#76dfe5',color:'#03151d',fontWeight:900,border:0,borderRadius:8,cursor:'pointer',opacity:active===7?.4:1}}>NEXT LESSON →</button>
 </div>
 </section>
 <section style={{marginTop:75,padding:'28px',border:'1px solid #345462',borderRadius:16,background:'#081b24'}}>
 <p style={{color:'#7be6e6',fontWeight:900,letterSpacing:1.5}}>INTERACTIVE GOVERNANCE EXAMINATION · HYPOTHETICAL</p>
 <h2 style={{fontSize:30}}>AI recommends an HVAC adjustment. Required sensor calibration is expired. What happens?</h2>
 <p style={{lineHeight:1.7,color:'#c0d6df'}}>Assume the proposed action is discretionary, the calibration is mandatory under the owner-approved policy, and emergency/life-safety systems remain independently governed.</p>
 <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{(['ALLOW','HOLD','DENY','ESCALATE'] as const).map(v=><button type="button" key={v} onClick={()=>setAnswer(v)} style={{padding:'12px 18px',borderRadius:8,border:answer===v?'2px solid #7be6e6':'1px solid #47626c',background:'#12313d',color:'white',cursor:'pointer',fontWeight:900}}>{v}</button>)}</div>
 {answer&&<p role="status" style={{padding:18,background:'#0f3037',borderRadius:8,lineHeight:1.7}}><strong>{answer==='HOLD'?'Correct for this stated scenario.':'Not the expected decision under these assumptions.'}</strong> The discretionary command remains on HOLD because mandatory evidence is invalid. Preserve the reason, restore valid evidence, then independently re-evaluate evidence, authority, standing and constraints. Different facts or policy may justify DENY or ESCALATE; do not infer automatic ALLOW.</p>}
 </section>
 <section style={{marginTop:60}}>
 <p style={{color:'#7be6e6',fontWeight:900,letterSpacing:1.5}}>INDEPENDENT REVIEW CHALLENGE</p><h2 style={{fontSize:36}}>What would you challenge before funding or deployment?</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:12}}>{questions.map((q,i)=><div key={i} style={{padding:20,border:'1px solid #2a4855',borderRadius:10,background:'#091922',lineHeight:1.65}}><strong style={{color:'#78e8ed'}}>0{i+1}</strong> · {q}</div>)}</div>
 <p style={{lineHeight:1.8,color:'#b9cfd8',marginTop:24}}>This public teaching room invites technical critique. It is not a solicitation claiming approved partner roles, a signed municipal agreement, an awarded grant, or validated performance. The prospectus contains preliminary budget assumptions and decision gates for prospective reviewers.</p>
 <a href={pdf} download style={{color:'#7be6e6',fontWeight:900}}>DOWNLOAD THE FULL PROSPECTUS →</a>
 </section>
 <footer style={{marginTop:70,paddingTop:24,borderTop:'1px solid #294654',color:'#9cb6c1'}}>TA-14 Authority Governance Institution · Proposed collaboration · Evidence before intervention · AI recommendation is not permission</footer>
 </div></main>;
}