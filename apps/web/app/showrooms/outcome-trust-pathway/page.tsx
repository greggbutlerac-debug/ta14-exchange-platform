'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';

const exhibits=[
 {image:'Outcome Trust Pathway Infographic.png',title:'One Building Element. Verifiable Claims.',subtitle:'The full owner-to-outcome pathway',script:'Welcome to Outcome Trust Pathway, an independently developed TA-14 educational examination. We begin with one hypothetical occupied room and one outdoor-air damper during wildfire smoke. The six stages are applicable requirements, owner intent informed by community needs, admissible evidence, an authorized execution decision, independently examinable outcomes, and ongoing stewardship. This is a proposed read-only demonstration, not an operating building or proven intervention.',point:'A forecast can inform a decision; it cannot authorize a building action.'},
 {image:'Alpha to Omega_ Verified Outcomes.png',title:'Alpha and Omega',subtitle:'Agree on the purpose and proof before engineering the solution',script:'Alpha is the legitimate building owner\'s intended service, with measurable acceptance criteria, lawful operating constraints and community-informed requirements. Omega asks what independent evidence would establish that the intended service was actually delivered. The green verified-result graphic is conceptual, not an achieved outcome. Work backward from these two endpoints to find only the building data, sensors, rules, and responsibilities needed.',point:'Owner intent and independently verifiable success must be specified in advance.'},
 {image:'The Bounded Demonstration_ Wildfire HVAC Evaluation.png',title:'Case OTP-01: One Proposed Consequence',subtitle:'One room, one damper, one hypothetical request',script:'An AI system or analyst proposes a time-limited change to the outdoor-air damper serving one occupied room while outdoor smoke may threaten air quality. This is one discretionary request, not a recommendation to close or open a real damper. No facility owner, actual controller, binding operating threshold, or qualified operator has yet been selected. The examination will never send an actuation command.',point:'The case asks whether a proposed consequence may occur, not whether a model sounds persuasive.'},
 {image:'Admissible Evidence_ Verified Air Quality Data.png',title:'Admissible Evidence',subtitle:'What information can support the decision?',script:'Relevant evidence may include indoor and outdoor fine particles, carbon dioxide, temperature, humidity, airflow, minimum ventilation requirements, filtration, occupancy, damper state and independent life-safety status. Each required record also needs source identity, timestamps, sensor qualification, uncertainty and provenance. Official warnings, public-health guidance, forecasts and building measurements play distinct roles. The illustration is hypothetical; showing a data panel is not proof that a valid measurement exists.',point:'Missing or invalid mandatory evidence cannot be silently replaced by prediction.'},
 {image:'Authority and Standing Framework.png',title:'Authority and Standing',subtitle:'Who may authorize this particular action?',script:'The legitimate facility owner establishes lawful service intent and operating delegations. Qualified operators and engineers assess system constraints. Community contributors including Lloyd Helferty and UnityNet International Canada may inform service needs and stewardship, without becoming the legal building owner. AI can recommend but does not grant permission. TA-14 proposes a decision boundary that tests admissible evidence, applicable authority and established standing. Standing means the requesting actor or system has valid identity, delegation, scope and timing. Occupancy and carbon dioxide are operational evidence, not standing.',point:'The proposed governance gate checks authority; it does not create authority.'},
 {image:'TA-14 Execution Boundary Infographic.png',title:'ALLOW, HOLD, DENY, ESCALATE',subtitle:'A governed choice at the proposed consequence boundary',script:'In the proposed TA-14 architecture, ALLOW requires all mandatory evidence, authority, standing and safeguards to be satisfied. HOLD is appropriate when required proof or permissions are unresolved. DENY applies to a known binding prohibition or constraint. ESCALATE directs a policy-designated question to a qualified human. Case OTP-01 has missing indoor fine-particle evidence, unverified minimum ventilation and unverified delegation. Its expected simulated decision is HOLD. This graphic illustrates possible outcomes; it is not a record of a live or independently tested software gate.',point:'A simulated HOLD never sends a command; resolving missing evidence requires a fresh decision.'},
 {image:'Omega — Independent Verification.png',title:'Omega: What Can Actually Be Proven?',subtitle:'Four distinct claims, four distinct evidence paths',script:'An independently examined result separates authorization, actual equipment response, environmental change and fulfillment of the owner\'s service criteria. A read-only simulated case can specify or test a decision rule but cannot demonstrate that a real damper moved, that indoor air improved, or that occupants received a safe service. Numerical air-quality readings and green check marks in this image are synthetic examples only. No verified environmental benefit is claimed. Real outcomes require an approved field protocol, trustworthy data and independent evaluation.',point:'An ALLOW decision is not proof of cleaner air. A simulated outcome is not an observed one.'},
 {image:'Stewardship Accountability Cycle Infographic.png',title:'Stewardship Beyond the Decision',subtitle:'Maintain, reassess, preserve and suspend when necessary',script:'Responsibility does not end with one decision. An actual service would require monitoring, periodic and event-triggered reassessment, preserved evidence and exceptions, clear authority to suspend or adjust operations, and accessible review of outcomes and limitations. Community stewardship is separate from owner and professional operating authority. The completed pathway offers a testable method, not a claim that an ongoing public service has already been established.',point:'A credible service remains accountable as circumstances change.'}
] as const;

const pdf='/'+encodeURIComponent('Outcome_Trust_Pathway_Examination_Edition_v2 (1).pdf');
const ink='#effafe',muted='#bbd1db',teal='#75e3e6';
export default function OutcomeTrustPathway(){
 const [speaking,setSpeaking]=useState<number|null>(null);
 const [supported,setSupported]=useState(true);
 const [answer,setAnswer]=useState<'ALLOW'|'HOLD'|'DENY'|'ESCALATE'|null>(null);
 const [transcripts,setTranscripts]=useState(false);
 const voice=useRef<SpeechSynthesisVoice|null>(null);
 const epoch=useRef(0);
 useEffect(()=>{
  if(!('speechSynthesis' in window)){setSupported(false);return;}
  const select=()=>{const v=window.speechSynthesis.getVoices();voice.current=v.find(x=>/samantha/i.test(x.name))||v.find(x=>x.lang.startsWith('en'))||null;};
  select();window.speechSynthesis.addEventListener('voiceschanged',select);
  return ()=>{epoch.current++;window.speechSynthesis.cancel();window.speechSynthesis.removeEventListener('voiceschanged',select);};
 },[]);
 const play=(i:number)=>{
  if(!supported)return;
  const token=++epoch.current;
  window.speechSynthesis.cancel();
  if(speaking===i){setSpeaking(null);return;}
  const utterance=new SpeechSynthesisUtterance(exhibits[i].script);
  if(voice.current)utterance.voice=voice.current;
  utterance.lang='en-US';utterance.rate=.92;
  utterance.onend=()=>{if(epoch.current===token)setSpeaking(null);};
  utterance.onerror=()=>{if(epoch.current===token)setSpeaking(null);};
  window.speechSynthesis.speak(utterance);setSpeaking(i);
 };
 const link={color:teal,textDecoration:'underline',textUnderlineOffset:4};
 return <main style={{background:'linear-gradient(145deg,#06121c,#092b36 43%,#04131d)',color:ink,minHeight:'100vh',fontFamily:'Arial,Helvetica,sans-serif'}}>
  <div style={{maxWidth:1190,margin:'auto',padding:'25px 20px 92px'}}>
   <nav style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,fontSize:14}}><Link href="/showrooms" style={link}>← All showrooms</Link><span style={{color:muted}}>TA-14 · Independent examination</span></nav>
   <header style={{padding:'70px 0 35px'}}>
    <p style={{color:teal,fontWeight:800,letterSpacing:3,fontSize:12}}>ONE ELEMENT · ONE CONSEQUENCE · EIGHT EXHIBITS</p>
    <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(38px,6vw,72px)',lineHeight:1.06,margin:'18px 0'}}>Outcome Trust <span style={{color:teal}}>Pathway</span></h1>
    <p style={{fontSize:'clamp(18px,2vw,23px)',color:muted,lineHeight:1.6,maxWidth:950}}>From lawful owner intent to independently examinable outcomes. Follow one hypothetical outdoor-air damper request through the requirements, evidence and execution boundary.</p>
    <p style={{padding:'18px 21px',border:'1px solid #7b6a3a',borderRadius:12,background:'#192a31',lineHeight:1.65,maxWidth:1040}}><strong style={{color:'#ffd48a'}}>Working reference, not an operational pilot.</strong> The building, action, evidence fixtures, illustrated sensor values and results are hypothetical. No facility owner, municipal approval, PAE data access, real-world actuation, partner endorsement, or independently verified health benefit is claimed. The illustrated Omega slide contains fictional example values and checkmarks.</p>
    <div style={{display:'flex',gap:13,flexWrap:'wrap',marginTop:24}}>
      <a href="#exhibits" style={{padding:'14px 20px',borderRadius:9,color:'#041924',background:teal,textDecoration:'none',fontWeight:800}}>Explore all eight exhibits</a>
      <a href={pdf} download style={{padding:'14px 20px',borderRadius:9,color:ink,border:'1px solid #4a8794',textDecoration:'none',fontWeight:800}}>Download examination PDF</a>
    </div>
   </header>
   <section id="exhibits" aria-label="Outcome Trust Pathway eight exhibits">
    {exhibits.map((e,i)=><article key={i} id={'exhibit-'+(i+1)} style={{margin:'50px 0',padding:'clamp(15px,2vw,28px)',border:'1px solid #315463',borderRadius:16,background:'#0b2430'}}>
     <p style={{color:teal,letterSpacing:2,fontWeight:800,fontSize:12}}>EXHIBIT {String(i+1).padStart(2,'0')} / 08</p>
     <h2 style={{fontSize:'clamp(25px,3.2vw,39px)',margin:'8px 0 7px'}}>{e.title}</h2>
     <p style={{color:muted,fontSize:17,lineHeight:1.6,margin:'0 0 23px'}}>{e.subtitle}</p>
     <div style={{position:'relative',width:'100%',aspectRatio:'16 / 9',overflow:'hidden',borderRadius:12,background:'#071622',border:'1px solid #476b75'}}>
      <Image src={'/'+encodeURIComponent(e.image)} alt={e.title+' — conceptual educational illustration; all depicted values and outcomes are hypothetical'} fill sizes="(max-width: 900px) 100vw, 1150px" style={{objectFit:'contain'}} priority={i===0}/>
     </div>
     {i===6&&<p style={{fontWeight:800,color:'#ffd48a',lineHeight:1.6,marginTop:14}}>Illustrative values and green check marks are NOT real measurements, achieved outcomes, or examiner approvals.</p>}
     <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center',margin:'18px 0'}}>
      <button type="button" disabled={!supported} onClick={()=>play(i)} style={{border:0,borderRadius:8,background:teal,color:'#031722',fontWeight:900,padding:'12px 18px',cursor:'pointer'}}>{speaking===i?'■ Stop narration':'▶ Play Samantha'}</button>
      <button type="button" onClick={()=>setTranscripts(x=>!x)} style={{border:'1px solid #5a8995',borderRadius:8,color:ink,background:'transparent',padding:'12px 18px',cursor:'pointer'}}>{transcripts?'Hide all transcripts':'Show all transcripts'}</button>
      {!supported&&<span>Voice synthesis is unavailable in this browser.</span>}
     </div>
     {transcripts&&<p style={{lineHeight:1.75,color:muted}}><strong>Narration transcript: </strong>{e.script}</p>}
     <p style={{background:'#153946',padding:'14px 18px',borderLeft:'4px solid '+teal,borderRadius:5,lineHeight:1.7}}><strong>Key lesson:</strong> {e.point}</p>
    </article>)}
   </section>
   <section aria-label="Interactive synthetic decision challenge" style={{border:'1px solid #3d7885',borderRadius:16,padding:'clamp(19px,3vw,35px)',background:'#102d39',marginTop:60}}>
    <p style={{color:teal,fontWeight:800,letterSpacing:2,fontSize:12}}>INTERACTIVE EXAMINATION · CASE OTP-01 · SIMULATED</p>
    <h2 style={{fontSize:'clamp(26px,3.4vw,37px)'}}>What should the proposed governor decide?</h2>
    <p style={{lineHeight:1.8,color:muted}}>AI recommends a 60-minute discretionary damper adjustment. Indoor PM2.5 evidence is missing, the required ventilation minimum is unverified, and the operator\'s delegation has not been established. Independent emergency and life-safety functions remain outside this proposed gate. What is the expected decision for this synthetic fixture?</p>
    <div style={{display:'flex',flexWrap:'wrap',gap:10}}>{(['ALLOW','HOLD','DENY','ESCALATE'] as const).map(v=><button type="button" key={v} onClick={()=>setAnswer(v)} aria-pressed={answer===v} style={{border:answer===v?'2px solid #9ce7ee':'1px solid #51727b',background:answer===v?'#235d68':'#0b222c',color:ink,borderRadius:8,padding:'14px 19px',fontWeight:800,cursor:'pointer'}}>{v}</button>)}</div>
    {answer&&<p role="status" style={{marginTop:17,padding:19,borderRadius:9,background:'#0a2029',lineHeight:1.8}}><strong>{answer==='HOLD'?'Expected decision: HOLD.':'Not the expected decision for these stipulated facts.'}</strong> The case fixture specifies unresolved mandatory evidence and authority prerequisites; no discretionary command is issued. Remediation requires a fresh evaluation. Other facts, including a known binding prohibition or policy-designated conflict, could require DENY or ESCALATE. This is a stated expected result, not an independently executed software test.</p>}
   </section>
   <section style={{padding:'54px 0 25px',maxWidth:950}}>
    <h2 style={{fontSize:32}}>What would an independent examiner need?</h2>
    <p style={{color:muted,lineHeight:1.85}}>A frozen owner-intent specification; locally reviewed requirements register; synthetic fixture with provenance and data-quality limits; versioned rules with precedence; actor delegation and standing records; expected decision traces; and a separate Omega verification plan. A read-only simulation can examine rules, but cannot prove that a real damper actuated or that a cleaner-air respite service succeeded.</p>
    <a href={pdf} download style={{color:teal,fontWeight:800,fontSize:17}}>Read the full Examination Edition 2.0 PDF →</a>
   </section>
   <footer style={{borderTop:'1px solid #305764',paddingTop:24,fontSize:13,color:muted,lineHeight:1.8}}>Prepared as an independent TA-14 Authority Governance Institution educational examination. Potential ALN, UNIC, ONUMA, Toronto and PAE roles or data paths are not confirmations of participation, approval or endorsement. Owner and qualified professionals retain their legal and operating responsibilities.</footer>
  </div>
 </main>;
}
