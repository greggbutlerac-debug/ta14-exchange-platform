'use client';
import {useState} from 'react';

const lessons = [
 {title:'The building in context',file:'The Graph Can Know_ Governed Building Intelligence.png',alt:'Conceptual connected building and semantic intelligence overview',question:'What does a digital building model actually establish?',detail:'The model can describe spaces, equipment, relationships, and reported operational signals. This is represented knowledge. Physical conditions, identity, and record continuity still need their own evidence.',checkpoint:'Locate the building and affected space before drawing a conclusion.'},
 {title:'Semantic Bridge relationships',file:'The Semantic Bridge Graph.png',alt:'Illustrated Semantic Bridge graph connecting building spaces assets and observations',question:'Does a connected node prove the current condition?',detail:'A graph can connect IFC and IFCx context, systems, sensor reports, owners, and work orders. It makes relationships discoverable. Each observation still requires provenance, freshness, identity matching, and admissibility examination.',checkpoint:'Differentiate an asserted relationship from a verified field observation.'},
 {title:'The overheating-floor report',file:'HVAC Investigation_ Level 2 Overheating (1).png',alt:'Conceptual office floor thermal overlay showing reported overheating and investigation context',question:'What is known, and what is only reported?',detail:'An overheating complaint can justify a bounded investigation. It does not, by itself, verify floor temperatures, attribute the cause to AHU-3, or establish permission to intervene. The illustrated measurements are examples only.',checkpoint:'Preserve raw observations, timing, and unresolved alternative explanations.'},
 {title:'A proposed mechanical intervention',file:'HVAC Overheating Action Authority Flow.png',alt:'Hypothetical HVAC adjustment proposal and proposed authority decision',question:'Does a credible recommendation grant permission?',detail:'A work order, model recommendation, or operator proposal is a proposed consequence. Changing a chilled-water valve may affect other zones and system stability. Before action, determine the precise asset, requested change, consequences, and authorized scope.',checkpoint:'Separate the proposal to act from the authority to act.'},
 {title:'Three conditions of admissible execution',file:'Semantic Graphs and Authority Governance Dashboard (1).png',alt:'Conceptual dashboard connecting semantic data and three TA14 authority conditions',question:'Are evidence, authority, and standing actually established?',detail:'Examine Admissible Evidence, Applicable Authority, and Established Standing. A checkbox, a dashboard, or a connected identity is not the underlying record. The actor, capacity, standing basis, authority relationship, and relevant limits must be established.',checkpoint:'The proposed consequence is held unless its actual prerequisites are met.'},
 {title:'Bounded disposition',file:'Semantic Bridge_ Authority in Action.png',alt:'Conceptual decision boundary between connected knowledge and authorized action',question:'What can be permitted without permitting everything?',detail:'ALLOW, HOLD, DENY, and ESCALATE are bounded dispositions. In this illustration, non-invasive investigation may proceed within established scope while unverified physical intervention remains on HOLD. A teaching diagram never issues a live authorization.',checkpoint:'Document the exact permitted and prohibited consequences.'},
 {title:'Outcome and continuity',file:'Evidence to Action_ Governed Building Intelligence.png',alt:'Conceptual evidence-to-action chain and verification dashboard',question:'How is a later outcome made accountable?',detail:'An authorized intervention requires a local execution record, observed results, and preserved distinctions between prediction, action, and measurement. A clean-looking post-action graph cannot retroactively establish the original authority.',checkpoint:'Record who acted, what changed, when, under which authority, and what was measured.'},
 {title:'From one building to a governed pattern',file:'The Governed Building Data Framework.png',alt:'Conceptual building data governance framework for repeatable operations',question:'What transfers between buildings, and what does not?',detail:'The design pattern can be reused across facilities and portfolios, but local execution standing and authority must be established in each operating context. Federation may convey authority context; it does not automatically transfer permission to act.',checkpoint:'Capability ≠ Authority. Authority must be established at the local consequence boundary.'}
];
export default function VisualLessons(){
 const [active,setActive]=useState(0);
 const lesson=lessons[active];
 return <section style={{background:'linear-gradient(135deg,#09283c,#071522)',border:'1px solid #3b7187',borderRadius:24,padding:'clamp(20px,4vw,42px)',margin:'28px 0'}}>
 <p style={{fontSize:12,letterSpacing:2,color:'#ffd18a',fontWeight:800}}>EIGHT ILLUSTRATED TEACHING LESSONS · INDEPENDENT TA14 CONCEPT</p>
 <h2 style={{fontSize:'clamp(28px,4vw,43px)',margin:'12px 0'}}>Inside the governed building</h2>
 <p style={{color:'#c8dae6',lineHeight:1.75}}>Explore the graph-to-consequence journey. All graphics are original conceptual artwork, not ONUMA screenshots, project evidence, real sensor readings, verified system associations, or an implemented ONUMA–TA14 integration. Details embedded inside the illustrations are hypothetical and may be visually simplified.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:9,margin:'22px 0'}}>
 {lessons.map((item,i)=><button type="button" aria-pressed={active===i} key={i} onClick={()=>setActive(i)} style={{padding:'12px 8px',cursor:'pointer',borderRadius:10,border:active===i?'2px solid #8ce7e0':'1px solid #43687a',background:active===i?'#164858':'#102a3c',color:'#fff',fontWeight:800,fontSize:13}}>{String(i+1).padStart(2,'0')} · {item.title}</button>)}
 </div>
 <figure style={{margin:0}}>
 <img src={'/'+encodeURIComponent(lesson.file)} alt={lesson.alt} loading="lazy" style={{width:'100%',height:'auto',borderRadius:15,border:'1px solid #396c84',display:'block'}}/>
 <figcaption style={{fontSize:12,color:'#a5c2d4',marginTop:10}}>Lesson {active+1} of 8 · Conceptual graphic. All numerical readings and depicted operations are illustrative and not operational data.</figcaption>
 </figure>
 <div style={{background:'#0b2436',border:'1px solid #355f73',borderRadius:16,padding:'24px',marginTop:18}}>
 <p style={{color:'#8be6dc',fontSize:12,fontWeight:800,letterSpacing:1.5}}>SAMANTHA TEACHING SCRIPT · TEXT REFERENCE</p>
 <h3 style={{fontSize:25,margin:'10px 0'}}>{lesson.question}</h3>
 <p style={{color:'#d4e5ef',lineHeight:1.85}}>{lesson.detail}</p>
 <p style={{borderLeft:'3px solid #f2c47b',paddingLeft:15,color:'#f5dfae',lineHeight:1.7}}>Teaching checkpoint: {lesson.checkpoint}</p>
 <p style={{fontSize:12,color:'#a5bccc'}}>Narration text is provided for editorial review; no audio narration is claimed or activated here.</p>
 </div>
 <div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',marginTop:18}}>
 <button type="button" disabled={active===0} onClick={()=>setActive(i=>Math.max(0,i-1))} style={{border:'1px solid #638395',borderRadius:10,background:'#102c3d',color:'#fff',padding:'12px 20px',cursor:'pointer',opacity:active===0?.45:1}}>← Previous image</button>
 <button type="button" onClick={()=>setActive(i=>(i+1)%lessons.length)} style={{border:0,borderRadius:10,background:'#83e8df',color:'#07232f',fontWeight:900,padding:'12px 20px',cursor:'pointer'}}>{active===7?'Return to lesson 1 ↺':'Next image →'}</button>
 </div>
 </section>;
}
