import Link from 'next/link';
import Samantha from '../epic-air-quality-fund/Samantha';

export const metadata = {title:'HibouAir × TA-14 | From Environmental Intelligence to Governed Intervention',description:'Independent eight-image manufacturer technical pre-examination of environmental records, admissibility, standing, bounded decisions and verified outcomes.'};
const pdf='/TA14_HibouAir_Manufacturer_Technical_Examination_v2%20(1).pdf';
const slides=[
  {
    "number": "01",
    "title": "Environmental Reality: What the Sensor Actually Knows",
    "image": "/Environmental%20Intelligence%20to%20Governed%20Action.png",
    "script": "A sensor measures an environmental condition. Its observation does not by itself establish cause, compliance, exposure or permission to intervene. This independent teaching scenario uses hypothetical HibouAir-format readings, not a live manufacturer feed.",
    "learned": "A measurement is an observation, not authorization.",
    "upcoming": "Next, examine where the reading came from."
  },
  {
    "number": "02",
    "title": "Source Record & Provenance",
    "image": "/Source%20Record%20%26%20Provenance%20Infographic.png",
    "script": "An examinable source record retains identity, location, original timestamps, units, quality declarations and revisions. Preserve raw observations separately from interpretation. A hash can detect a later change but cannot prove the original measurement was accurate.",
    "learned": "Original provenance must survive interpretation.",
    "upcoming": "Next, test whether its chronology remained intact."
  },
  {
    "number": "03",
    "title": "Continuity & Atmospheric Integrity Records",
    "image": "/Continuity%20%26%20Atmospheric%20Integrity%20Records.png",
    "script": "Atmospheric Integrity Records preserve the sequence, missing intervals, transformations, uncertainty and linked receipts. A missing observation must remain visible. Continuity can be examined, challenged and replayed, but a preserved record does not automatically establish admissibility.",
    "learned": "Gaps and revisions must remain examinable.",
    "upcoming": "Next, examine fitness for a particular consequence."
  },
  {
    "number": "04",
    "title": "Admissibility: Is the Evidence Sufficient?",
    "image": "/HibouAir%20TA-14%20Evidence%20Admissibility%20Infographic.png",
    "script": "An elevated classroom carbon dioxide reading may warrant investigation. In this hypothetical case, calibration evidence, quantified uncertainty, equipment mapping and the applicable decision threshold are incomplete. The proposed ventilation change receives HOLD; investigation may continue under separate authority.",
    "learned": "Relevant observations can still be insufficient for intervention.",
    "upcoming": "Next, identify who may lawfully invoke a decision."
  },
  {
    "number": "05",
    "title": "Applicable Authority & Established Standing",
    "image": "/Authority%20%26%20Standing%20Examination.png",
    "script": "Applicable Authority asks which governing rule permits this particular action. Established Standing asks whether this specific actor, in a declared capacity, may invoke that authority for this asset, place and time. Neither is inferred from possession of a sensor or access to a dashboard. The evidence HOLD still applies.",
    "learned": "Authority and standing are separate, actor-specific gates.",
    "upcoming": "Next, see how a bounded disposition is issued."
  },
  {
    "number": "06",
    "title": "Bounded Determination: ALLOW / HOLD / DENY / ESCALATE",
    "image": "/Bounded%20Determination%20Governance%20Framework.png",
    "script": "TA-14 examines a precise proposed consequence and issues ALLOW, HOLD, DENY or ESCALATE with reason codes, scope and expiry. In our running scenario, incomplete evidence produces HOLD even if authority and standing are otherwise established. Illustrative receipts are not actual operational determinations.",
    "learned": "A bounded determination is not a controller command.",
    "upcoming": "Next, separate permission from physical actuation."
  },
  {
    "number": "07",
    "title": "The Intervention Boundary: Permission Is Not Execution",
    "image": "/Permission%20Is%20Not%20Execution.png",
    "script": "Permission is not execution. This image illustrates a separate hypothetical future in which deficiencies have been remedied and authorization re-examined. Even then, the local facility system or authorized operator must execute and log any change. Phase one of the proposed HibouAir evaluation remains read-only.",
    "learned": "Only separately authorized local systems or operators execute.",
    "upcoming": "Next, verify whether an authorized action achieved its intended result."
  },
  {
    "number": "08",
    "title": "Verified Outcome & Continuing Record",
    "image": "/Verified%20Environmental%20Outcome%20Dashboard%20(1).png",
    "script": "Execution is not proof of success. This final panel illustrates a hypothetical post-intervention improvement, not measured HibouAir results. A reviewer would need linked pre- and post-action records, context, independent verification and sustained observations. The earlier HOLD is not automatically converted to ALLOW.",
    "learned": "Outcome claims require independent examination and continuing evidence.",
    "upcoming": "You have completed the eight lessons. Review the pilot charter and challenge the proposed architecture."
  }
];
export default function HibouAirShowroom(){return <main style={{minHeight:'100vh',background:'#06101e',color:'#e8f6ff',fontFamily:'Arial,Helvetica,sans-serif'}}><div style={{maxWidth:1190,margin:'auto',padding:'26px 18px 84px'}}><nav style={{display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap',borderBottom:'1px solid #28415b',paddingBottom:18}}><Link href='/showrooms/environmental-atmospheric' style={{color:'#83d8ef'}}>← Environmental & Atmospheric</Link><Link href='/showrooms' style={{color:'#83d8ef'}}>All showrooms</Link></nav><header style={{padding:'45px 0 30px'}}><p style={{fontSize:12,letterSpacing:2,color:'#7ce1e9',fontWeight:800}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT MANUFACTURER TECHNICAL PRE-EXAMINATION</p><h1 style={{fontSize:'clamp(34px,6vw,65px)',lineHeight:1.1}}>HibouAir × TA-14<br/><span style={{color:'#83def5'}}>From Environmental Intelligence to Governed Intervention</span></h1><p style={{fontSize:18,lineHeight:1.7,color:'#b9cfdd'}}>Eight illustrated lessons examining how environmental observations could become source-linked AIR records, bounded governance determinations and independently examined outcomes without replacing the manufacturer's equipment.</p><p style={{padding:20,border:'1px solid #806a51',borderRadius:12,background:'#241e1b',lineHeight:1.7,color:'#f2d6ae'}}>INDEPENDENT EDUCATIONAL EXPLORATION · NO HIBOUAIR ENDORSEMENT OR PARTNERSHIP CLAIMED. Illustrative readings, devices, receipts, permissions, actions and outcomes only. The private R1 adapter is simulated, without live credentials or verified manufacturer integration. No field authority, legal admissibility, certification or actual intervention is established.</p></header><section style={{padding:24,border:'1px solid #365a73',background:'#0b2235',borderRadius:18,marginBottom:35}}><p style={{fontSize:12,color:'#7ee3f1',fontWeight:800}}>PRIMARY TECHNICAL REFERENCE · V2.0</p><h2>Manufacturer Technical Examination & Commercial Evaluation</h2><p style={{color:'#bbd3df',lineHeight:1.7}}>Read the technical reference before or alongside the eight lessons. Proposed evaluation only; no agreed commercial arrangement.</p><a href={pdf} target='_blank' rel='noopener noreferrer' style={{display:'inline-block',padding:'12px 18px',borderRadius:10,background:'#76dbeb',color:'#041925',fontWeight:800}}>Open / Download PDF ↗</a><iframe src={pdf+'#toolbar=1'} title='HibouAir TA-14 technical reference v2' style={{display:'block',marginTop:20,width:'100%',height:'min(70vh,720px)',minHeight:360,border:'1px solid #38536b',borderRadius:10,background:'#fff'}}/></section><section style={{padding:24,background:'#0c1c2d',borderLeft:'4px solid #7de5ed',marginBottom:30}}><p style={{color:'#83ddea',fontWeight:800}}>THE GOVERNING QUESTION</p><h2 style={{lineHeight:1.35}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</h2><p style={{color:'#b9cfdd'}}>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</p></section><div style={{display:'flex',flexWrap:'wrap',gap:10,marginBottom:28}}>{slides.map(s=><a key={s.number} href={'#lesson-'+s.number} style={{color:'#9fe8f4',border:'1px solid #42667a',borderRadius:9,padding:11,textDecoration:'none'}}>{s.number}</a>)}</div>{slides.map((s,i)=><section key={s.number} id={'lesson-'+s.number} style={{padding:'36px 0 44px',borderTop:'1px solid #29475b',scrollMarginTop:20}}><p style={{color:'#89daeb',fontSize:12,letterSpacing:2,fontWeight:800}}>IMAGE {s.number} / 08</p><h2 style={{fontSize:'clamp(26px,4vw,42px)',margin:'10px 0'}}>{s.title}</h2><img src={s.image} alt={'Illustrative HibouAir and TA-14 teaching panel '+s.number+': '+s.title} style={{display:'block',width:'100%',height:'auto',border:'1px solid #315873',borderRadius:14}}/><Samantha text={s.script}/><p style={{lineHeight:1.8,color:'#bdd4e0',fontSize:16,margin:'20px 0'}}>{s.script}</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16}}><div style={{padding:20,background:'#0c2b32',border:'1px solid #315d68',borderRadius:14}}><strong style={{color:'#88e8df'}}>WHAT YOU LEARNED</strong><p style={{lineHeight:1.7}}>{s.learned}</p></div><div style={{padding:20,background:'#111e39',border:'1px solid #3c557d',borderRadius:14}}><strong style={{color:'#a8c5ff'}}>WHAT YOU'RE ABOUT TO LEARN</strong><p style={{lineHeight:1.7}}>{s.upcoming}</p>{i<7&&<a href={'#lesson-'+slides[i+1].number} style={{color:'#a4e7ff'}}>Continue to next lesson ↓</a>}</div></div></section>)}<section style={{padding:28,border:'1px solid #3a6075',background:'#102638',borderRadius:17}}><h2>Independent Review Challenge</h2><p style={{lineHeight:1.75}}>Challenge the evidence and proposed decision: remove calibration evidence; insert a missing observation; revoke an actor's authority; substitute an out-of-scope asset; or present an unverified actuation log. Expected outcomes include HOLD for unsupported evidence and DENY for invalid authority or standing. Any proposed ALLOW must be re-examined at the actual commitment boundary.</p><h2>Proposed bounded evaluation</h2><p style={{lineHeight:1.75}}>Begin with one consenting site, one authorized source stream and one specified environmental claim. Confirm API rights, preservation and uncertainty requirements, acceptance tests, independent review, responsibilities and commercial terms in writing. The initial phase is read-only and has no actuator access.</p><a href={pdf} style={{color:'#96ebf2',fontWeight:800}}>Read the full technical reference ↗</a></section><footer style={{marginTop:35,paddingTop:21,borderTop:'1px solid #29475b',color:'#9bb7c9',lineHeight:1.7}}>No Admissible Evidence. No Admissible Execution. · Independent discussion edition · November 2026.</footer></div></main>}
