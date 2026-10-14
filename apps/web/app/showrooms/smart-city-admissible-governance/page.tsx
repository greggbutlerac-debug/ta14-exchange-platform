'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';

const pdf='/TA14_Smart_City_Admissible_Governance_Technical_Reference_v3.2 (1).pdf';
const slides=[
 {title:'Smart City Governance Overview',file:'Eight Anchors_ Smart City Governance.png',voice:'A smart city is not necessarily a governed city. Technology may observe and propose action; each consequence still requires admissible evidence, applicable authority, and established standing. The overview depicts eight anchors, not evidence of an actual city deployment.'},
 {title:'Reality — What Actually Happened?',file:'Smart City Reality_ Measured Conditions.png',voice:'Begin with reality. Record what was actually observed, including source, asset, time, units, calibration, and environmental conditions. Illustrative measurements in this image are hypothetical and must not be mistaken for operational results.'},
 {title:'Record — What Was Preserved?',file:'Smart City Data Record Governance Infographic.png',voice:'The record preserves original observations with timestamps, provenance, source identity, custody, and any changes. Multiple feeds may be linked, but their agreement is not assumed and their integrity must be independently examined.'},
 {title:'Continuity and Admissibility',file:'Smart City Governance_ Continuity and Admissibility.png',voice:'Continuity asks whether evidence remains intact over time. Admissibility asks whether it is fit for this specific decision. Checks, grades, and records shown here are illustrative, not an actual certified evidence assessment.'},
 {title:'Applicable Authority and Established Standing',file:'Authority and Standing Governance Infographic (1).png',voice:'Applicable authority identifies the governing rule and scope. Established standing identifies who can propose, approve, or execute the action in a defined capacity. Neither sensor evidence nor the existence of an organization establishes permission by itself.'},
 {title:'Binding and Local Commit',file:'Smart City Binding and Local Commitment.png',voice:'A proposed consequence must bind to a particular actor, asset, policy, time, and limit. Authority context may travel between organizations, but execution authority must be established locally. The depicted city, signatures, budgets, and authorizations are invented teaching examples.'},
 {title:'Authorized Execution',file:'Authorized Execution_ Smart City Operations.png',voice:'Execution must be constrained to the authorized scope, method, actor, and time. Preserve command logs, site records, safety checks, and deviations. The depicted operations are not proof of a real TA14 municipal deployment.'},
 {title:'Outcome and Accountability',file:'Outcome and Accountability in a Smarter City.png',voice:'Finally, compare observed outcomes with a defined baseline and keep the record available for review and correction. The before-and-after figures on this image are entirely hypothetical, not measured municipal performance or demonstrated causal benefit.'}
] as const;
const topics=['Overview','Reality','Record','Continuity + Admissibility','Authority + Standing','Binding + Commit','Execution','Outcome'];
const anchorNotes=['Overview of all eight architectural anchors','Architectural anchor 01 — REALITY','Architectural anchor 02 — RECORD','Architectural anchors 03 and 04 — CONTINUITY + ADMISSIBILITY','Architectural anchor 05 — BINDING, with separate applicable authority and established standing','Architectural anchors 05 and 06 — BINDING + COMMIT','Architectural anchor 07 — EXECUTION','Architectural anchor 08 — OUTCOME'];
export default function SmartCityShowroom(){
 const [speaking,setSpeaking]=useState(-1);
 useEffect(()=>()=>{if(typeof window!=='undefined')window.speechSynthesis?.cancel()},[]);
 function narrate(i:number){
  if(!('speechSynthesis' in window))return;
  window.speechSynthesis.cancel();
  if(speaking===i){setSpeaking(-1);return}
  const u=new SpeechSynthesisUtterance('Teaching image '+(i+1)+' of eight. '+anchorNotes[i]+'. '+slides[i].title+'. '+slides[i].voice);
  const voices=window.speechSynthesis.getVoices();
  u.voice=voices.find(v=>/Samantha/i.test(v.name))||voices.find(v=>v.lang.startsWith('en'))||null;
  u.rate=.9;u.onend=()=>setSpeaking(-1);u.onerror=()=>setSpeaking(-1);window.speechSynthesis.speak(u);setSpeaking(i);
 }
 return <main style={{background:'#061424',minHeight:'100vh',color:'#edf5ff',fontFamily:'Arial,sans-serif'}}>
 <div style={{maxWidth:1210,margin:'auto',padding:'28px 20px 90px'}}>
 <nav style={{display:'flex',gap:18,flexWrap:'wrap',fontSize:14}}><Link href="/showrooms" style={{color:'#91dcf4'}}>← All Showrooms</Link><Link href="/showrooms/interoperability-systems" style={{color:'#91dcf4'}}>Interoperability &amp; Systems</Link></nav>
 <header style={{padding:'65px 0 30px'}}>
  <p style={{letterSpacing:2,fontSize:12,fontWeight:800,color:'#f4ca62'}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT TECHNICAL PRE-EXAMINATION</p>
  <h1 style={{fontSize:'clamp(38px,6vw,70px)',lineHeight:1.09,margin:'15px 0'}}>A Smart City Is Not Necessarily <span style={{color:'#f4ca62'}}>a Governed City</span></h1>
  <p style={{maxWidth:900,fontSize:20,lineHeight:1.6,color:'#d3e3ef'}}>Eight illustrated teaching examinations of what happens between connected-city observation and an authorized real-world consequence.</p>
  <p style={{border:'1px solid #a88750',padding:18,borderRadius:12,background:'#241f1a',color:'#ffe5b1',lineHeight:1.6}}>INDEPENDENT PRE-EXAMINATION · CONCEPTUAL APPLICATION · BASELINE NOT FROZEN · NO FORMAL DISPOSITION · NO MUNICIPAL ENDORSEMENT. All illustrated measurements, identities, law/policy examples, approvals, performance changes, and outcomes are hypothetical; this is not evidence of a deployed municipal system.</p>
 </header>
 <div style={{display:'flex',flexWrap:'wrap',gap:12,marginBottom:42}}>
  <a href={pdf} download style={{padding:'15px 20px',borderRadius:9,background:'#9de2eb',color:'#082232',textDecoration:'none',fontWeight:800}}>↓ Technical Reference v3.2 (PDF)</a>
  <a href="#images" style={{padding:'15px 20px',borderRadius:9,border:'1px solid #5983a4',color:'#dbefff',textDecoration:'none'}}>Explore eight images ↓</a>
 </div>
 <section style={{padding:'10px 0 34px',borderBottom:'1px solid #35506a'}}>
  <h2 style={{fontSize:26}}>The governing question</h2>
  <p style={{fontSize:22,lineHeight:1.55,maxWidth:1000}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p>
  <p style={{color:'#8ecedc'}}>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</p>
  <div style={{display:'flex',gap:9,flexWrap:'wrap',marginTop:22}}>{['ALLOW','HOLD','DENY','ESCALATE'].map((x,i)=><span key={x} style={{padding:'9px 16px',borderRadius:8,fontWeight:800,background:['#176b4c','#805f1c','#82333d','#50408c'][i]}}>{x}</span>)}</div>
 </section>
 <p style={{fontSize:15,lineHeight:1.7,color:'#ffdfa0',background:'#1e2837',padding:'15px 18px',borderRadius:10}}>NUMBERING KEY: The 01–08 labels below are <strong>showroom teaching-image numbers</strong>, not the eight TA14 architectural anchor numbers. The overview is Teaching Image 01; Reality is architectural Anchor 01 but Teaching Image 02; Record is architectural Anchor 02 but Teaching Image 03. Some original infographic trackers visually emphasize a different number. Use the architectural labels given above each image as the authoritative sequence. Original artworks are retained without alteration.</p>
 <nav aria-label="Teaching image navigation" style={{display:'flex',flexWrap:'wrap',gap:8,padding:'26px 0'}}>{slides.map((s,i)=><a href={'#image-'+(i+1)} key={s.file} style={{border:'1px solid #476986',borderRadius:7,padding:'9px 12px',textDecoration:'none',color:'#e6f5ff',fontSize:13}}>{String(i+1).padStart(2,'0')} · {topics[i]}</a>)}</nav>
 <div id="images">{slides.map((s,i)=><section key={s.file} id={'image-'+(i+1)} style={{scrollMarginTop:25,borderTop:'1px solid #365370',padding:'42px 0 36px'}}>
  <p style={{color:'#f5cb70',fontSize:12,fontWeight:800,letterSpacing:2}}>ORIGINAL TEACHING IMAGE {String(i+1).padStart(2,'0')} OF 08</p>
  <p style={{fontSize:15,fontWeight:800,color:'#9de2eb',margin:'8px 0'}}>{anchorNotes[i]}</p>
  <h2 style={{fontSize:'clamp(25px,4vw,38px)',margin:'8px 0 22px'}}>{s.title}</h2>
  <img src={'/'+encodeURIComponent(s.file)} alt={'TA14 Smart City teaching image '+String(i+1).padStart(2,'0')+': '+s.title+'; all readings, approvals and outcomes hypothetical'} loading={i===0?'eager':'lazy'} style={{width:'100%',height:'auto',display:'block',borderRadius:12,border:'1px solid #375675'}}/>
  {(i===1||i===2)&&<p style={{fontSize:14,lineHeight:1.5,color:'#ffe2a8',margin:'12px 0 0'}}>Illustration numbering caution: this original image's internal progress tracker does not identify the architectural anchor taught by this section. {anchorNotes[i]} is the authoritative label. The source image has not been edited.</p>}
  <div style={{display:'flex',flexWrap:'wrap',gap:13,alignItems:'center',marginTop:20}}>
   <button type="button" onClick={()=>narrate(i)} style={{background:'#9de2eb',color:'#062232',padding:'12px 17px',fontWeight:800,border:0,borderRadius:9,cursor:'pointer'}}>{speaking===i?'■ Stop narration':'▶ Samantha narration '+String(i+1).padStart(2,'0')}</button>
   <span style={{fontSize:13,color:'#aec8d9'}}>Samantha when available on your device; otherwise an English voice.</span>
  </div>
  <p style={{fontSize:17,lineHeight:1.78,color:'#d5e5ef',maxWidth:1100}}>{s.voice}</p>
  {i===0&&<p style={{fontSize:14,color:'#f2cf81'}}>This overview is the approved first image in the eight-image showroom sequence; the separate Smart City companion poster remains in the downloadable technical reference.</p>}
 </section>)}</div>
 <section style={{marginTop:38,border:'1px solid #41627d',borderRadius:15,padding:25,background:'#0c243a'}}>
  <h2>What the examination does not establish</h2><p style={{lineHeight:1.7,color:'#d6e5ef'}}>This public room teaches TA14's evidence-and-authority boundary. It makes no claim that a municipality has approved, certified, deployed, or tested TA14; that pictured interventions occurred; or that the visualized outcomes are independently verified. The technical reference describes how a named municipal owner could define a bounded pilot and its acceptance criteria.</p>
  <p style={{fontWeight:800,color:'#f5ca68'}}>Observed is not inferred. Inferred is not authorized. Capability ≠ Authority.</p>
  <Link href="/showrooms" style={{color:'#9de2eb'}}>← Explore all TA14 showrooms</Link>
 </section></div></main>;
}
