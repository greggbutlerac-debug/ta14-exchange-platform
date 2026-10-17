'use client';
import {useState} from 'react';
import Samantha from '../epic-air-quality-fund/Samantha';
const lessons=[
['01','The Coordinated Model','A multidisciplinary model can establish spatial coordination and technical context. It cannot alone establish permission to execute.','Identify the modeled assets, revisions, coordination status and unresolved clashes.','Coordination is a technical claim, not an execution authorization.','Examine the underlying record.'],
['02','The Evidence Boundary','A clash report, issue ticket, drawing and field verification are distinct records. Preserve their provenance and scope.','Compare the source model revision with the clash report and field observations.','Observed is not inferred. Inferred is not authorized.','Test continuity and admissibility.'],
['03','The MEP Change','A hypothetical duct reroute resolves a clash in the model but changes installation scope and may affect fire separation.','Inspect revision identity, constructability, applicable design requirements and field conditions.','A technically feasible change may still need qualified review and approval.','Find the applicable authority.'],
['04','Applicable Authority','Contracts, design responsibilities, codes and delegated approvals vary by project and jurisdiction.','Identify which controlling instrument applies to this particular proposed modification.','Software access and coordination responsibility do not create authority.','Establish the actor’s standing.'],
['05','Established Standing','A named actor must have capacity, standing basis and an authority relationship for this specific consequence.','Examine the actor, role, delegation, project, asset, time and scope.','Applicable Authority is not the same as Established Standing.','Bind the decision.'],
['06','Construction Payment','An approved model revision is not automatically evidence that work was installed, accepted or payable.','Separate model completion, field verification, contractual milestones and payment authorization.','Technical completion, physical completion and financial consequence require separate examinations.','Consider operational consequences.'],
['07','Digital Twin Intervention','An operational model may indicate an equipment fault, but a recommendation is not permission to change a live system.','Compare the observation, equipment state, maintenance authority and safety limits.','Investigation may be allowed while physical intervention remains on HOLD.','Make a bounded decision.'],
['08','The Execution Decision','At the consequence boundary, examine Admissible Evidence, Applicable Authority and Established Standing NOW.','Bind actor, asset, action, scope, time and stop conditions; preserve the resulting record.','ALLOW / HOLD / DENY / ESCALATE are different, accountable dispositions.','Verify the outcome before claiming success.']
];
export default function VR4BIMRoom(){
 const [selected,setSelected]=useState('missing');
 const disposition=selected==='complete'?'ALLOW':selected==='prohibited'?'DENY':selected==='disputed'?'ESCALATE':'HOLD';
 const rationale={ALLOW:'Illustrative bounded approval only: evidence, applicable authority and standing are assumed verified for the specified scope. Recheck current field conditions before execution.',HOLD:'Field verification or documented approval is missing. Preserve the issue and seek the required evidence before work.',DENY:'The proposed modification conflicts with an assumed controlling prohibition. Do not proceed; a new proposal is required.',ESCALATE:'The authority relationship is disputed. Refer the issue to the competent project decision-maker.'};
 return <main style={{background:'#07131f',color:'#eef5fa',minHeight:'100vh',fontFamily:'Arial,sans-serif'}}>
 <div style={{maxWidth:1100,margin:'auto',padding:'30px 22px'}}>
 <header style={{padding:'55px 0 35px'}}>
 <p style={{color:'#e9c47d',letterSpacing:2,fontWeight:700}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT COLLABORATION CONCEPT</p>
 <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(38px,6vw,76px)',lineHeight:1.08}}>The Model Is Coordinated.<br/><span style={{color:'#e9c47d'}}>Who Authorizes Reality?</span></h1>
 <p style={{fontSize:21,lineHeight:1.6,maxWidth:850}}>A proposed VR4BIM × TA14 interoperability demonstration: from multidisciplinary BIM coordination to accountable construction and operational consequences.</p>
 <p style={{border:'1px solid #526a78',padding:18,borderRadius:12,lineHeight:1.65}}>UNLISTED CONCEPT · NOT A PARTNERSHIP ANNOUNCEMENT · NO VR4BIM ENDORSEMENT · NO FORMAL EXAMINATION OR DISPOSITION. All cases, approvals, roles and outcomes are hypothetical. This page does not represent a real VR4BIM project or integrated product. No registration or payment is required to explore a potential commercial collaboration.</p>
 <p style={{fontWeight:700}}>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</p>
 <h2>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</h2>
 </header>
 <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:15,marginBottom:35}}>
 {['BIM coordination: technical context','TA14 examination: admissibility and authority','Execution: bounded action and verified outcome'].map((x,i)=><div key={x} style={{padding:22,border:'1px solid #36576c',borderRadius:12,background:'#102637'}}><strong style={{color:'#e9c47d'}}>0{i+1}</strong><p>{x}</p></div>)}
 </section>
 {lessons.map(([num,title,teach,inspect,learn,next])=><section key={num} id={'lesson-'+num} style={{padding:'38px 0',borderTop:'1px solid #36576c'}}>
 <p style={{color:'#e9c47d',fontWeight:700}}>LESSON {num} / 08</p><h2 style={{fontFamily:'Georgia,serif',fontSize:34}}>{title}</h2>
 <div style={{background:'#102637',padding:25,borderRadius:14}}>
 <p style={{fontSize:18,lineHeight:1.75}}><strong>What the illustration should teach:</strong> {teach}</p>
 <div role="img" aria-label={'Conceptual governance chain for '+title} style={{display:'flex',flexWrap:'wrap',gap:10,padding:'24px 0'}}>
 {['MODEL','RECORD','EVIDENCE','AUTHORITY','STANDING','DECISION'].map((v,i)=><span key={v} style={{border:'1px solid #64879a',padding:'14px 10px',borderRadius:8,background:i===Number(num)%6?'#385269':'#182f40',fontWeight:700,fontSize:13}}>{v}</span>)}
 </div>
 <Samantha text={'Lesson '+num+'. '+title+'. Look at the six numbered concepts represented across the conceptual governance chain: model, record, evidence, authority, standing, and decision. First, '+teach+' Next, '+inspect+' Ask what the image establishes, what it does not establish, and which authority must be verified before the proposed action. This is a hypothetical teaching illustration, not an actual VR4BIM project or approval.'}/>
 <p style={{lineHeight:1.75}}><strong>Image examination:</strong> {inspect}</p>
 </div>
 <p><strong>What we learned:</strong> {learn}</p><p><strong>What comes next:</strong> {next}</p>
 </section>)}
 <section id="decision-lab" style={{background:'#122b3c',padding:25,borderRadius:15,margin:'35px 0'}}>
 <p style={{color:'#e9c47d',fontWeight:700}}>INTERACTIVE · HYPOTHETICAL MEP CHANGE EXAMINATION</p><h2>Should the duct reroute proceed?</h2>
 <p>A coordinated model proposes rerouting ductwork around a structural obstruction. Select the evidence and authority condition. This is a teaching exercise, not an actual project determination.</p>
 <label htmlFor="condition">Examination condition</label>
 <select id="condition" value={selected} onChange={e=>setSelected(e.target.value)} style={{display:'block',margin:'12px 0',padding:12,width:'100%',maxWidth:680,color:'#07131f'}}>
 <option value="missing">Clash resolved in BIM; field verification and approval missing</option>
 <option value="complete">Field verification, governing approval and actor standing all established</option>
 <option value="prohibited">Controlling design restriction explicitly prohibits the proposed reroute</option>
 <option value="disputed">Two project parties dispute who may approve the change</option>
 </select>
 <div aria-live="polite" style={{padding:18,border:'1px solid #e9c47d',borderRadius:10}}><strong style={{fontSize:28,color:'#e9c47d'}}>{disposition}</strong><p>{rationale[disposition as keyof typeof rationale]}</p></div>
 </section>
 <footer style={{padding:'28px 0 60px',borderTop:'1px solid #36576c'}}>
 <h2>Explore a bounded collaboration</h2><p>VR4BIM may identify one representative MEP coordination, revision or construction-approval workflow. TA14 can then discuss a scoped, nonbinding demonstration without registration or an introductory fee.</p>
 <a style={{color:'#e9c47d'}} href="mailto:ta14admissibleexecution@gmail.com?subject=VR4BIM%20TA14%20Collaboration">Discuss the demonstration by email →</a>
 <p style={{fontSize:13,color:'#b8cbd6'}}>Independent conceptual material prepared by TA14 Authority Governance Institution. No VR4BIM participation or endorsement implied.</p>
 </footer></div></main>
}