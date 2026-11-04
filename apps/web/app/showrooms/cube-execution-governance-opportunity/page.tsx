'use client';
import Link from 'next/link';
import Image from 'next/image';
import {useEffect,useState} from 'react';

const pdf='/TA-14_CUBE_Strategic_Opportunity_Brief_v3%20(1).pdf';
const slides=[
  {
    "number": "01",
    "title": "The Opportunity",
    "image": "/Trustworthy Building Operations Opportunity.png",
    "description": "CUBE organizes connected contractor work. TA-14 could independently examine the permission to turn a recommendation into real-world action.",
    "script": "Image one: the opportunity. In this proposed architecture, CUBE remains the system of work, connecting job records, commissioning, service operations, and AI-assisted workflows. TA-14 would not replace those tools. It would be evaluated as an independent governance boundary for selected consequential actions. When a proposed action could change a real building, the review asks whether admissible evidence, applicable authority, and established standing are sufficient now. This is an exploration, not a claim that the platforms are integrated."
  },
  {
    "number": "02",
    "title": "Detection Is Not Authorization",
    "image": "/Detection Is Not Authorization.png",
    "description": "A controller command and physical field observation can disagree. A deficiency alone does not prove root cause or grant permission to intervene.",
    "script": "Image two: detection is not authorization. Consider an illustrative outdoor air damper commanded to twenty percent while field inspection observes it closed. The mismatch deserves investigation. But neither the controller output nor the field observation, standing alone, establishes why the discrepancy occurred or who may change a live system. CUBE could document and route the deficiency. A separate TA-14 examination would assess a precisely proposed corrective action, rather than converting a detected discrepancy directly into permission."
  },
  {
    "number": "03",
    "title": "From Observation to Admissible Evidence",
    "image": "/From Field Finding to Admissible Evidence.png",
    "description": "Preserve measurements, field photos, timestamps, identities, context, and continuity before asking what action is justified.",
    "script": "Image three: the evidence record. Begin with source measurements and independently documented field conditions. Preserve when, where, how, and by whom the observations were made. Record instrument identity, calibration or measurement limitations where applicable, and preserve continuity so later reviewers can distinguish original observations from interpretation. TA-14 can examine the admissibility of that packet for a specific proposed action. Admissible evidence is necessary, but it does not itself establish permission or standing. The green checks in this teaching image are conceptual, not actual determinations on real CUBE records."
  },
  {
    "number": "04",
    "title": "Authority and Standing Boundary",
    "image": "/Authority and Standing Boundary.png",
    "description": "A technically justified fix still requires applicable authority and an actor with standing to invoke it.",
    "script": "Image four: authority and standing. Evidence describes what can be substantiated. Applicable authority identifies the rule, contractual permission, delegation, or other governing basis relevant to the exact action. Established standing identifies the actor, the capacity in which they act, their standing basis, and their relationship to that applicable authority. These are separate checks. A contractor may discover a defect without having permission to rewrite a building sequence. A service manager may have organizational standing for one intervention but not another. CUBE can route the work, while a proposed TA-14 boundary examines whether this exact actor can lawfully and properly invoke the authority now."
  },
  {
    "number": "05",
    "title": "The Eight-Link Chain",
    "image": "/TA-14 Eight-Link Chain Infographic.png",
    "description": "Follow Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome.",
    "script": "Image five: the eight-link chain. Reality is the actual building condition. Record captures observations. Continuity preserves an examinable chain of information. Admissibility evaluates whether the evidence is fit for the proposed purpose. Binding ties the evidence and authority context to the exact proposed consequence. At commit, the system must revalidate current evidence, authority, standing, and conditions. Only a bounded, valid allow permits the permitted execution to be considered by the responsible local system. Outcome requires actual post-action verification. A command log by itself is not proof that the intended physical result occurred."
  },
  {
    "number": "06",
    "title": "Four Possible Determinations",
    "image": "/Four Determinations_ Clear Decision Framework.png",
    "description": "ALLOW, HOLD, DENY, and ESCALATE are bounded governance dispositions, not automatic building-control commands.",
    "script": "Image six: four possible determinations. Allow means the specific proposal satisfies the relevant gates under stated current conditions, with further commit-time validation. Hold means information or validation is incomplete and execution must not proceed yet. Deny means the proposal is not permitted under the examined conditions. Escalate routes material ambiguity or unresolved responsibility to a named reviewer. The image shows a hypothetical decision receipt. Its example identifier is not a real CUBE or TA-14 execution record. A determination can be returned to a workflow without granting an AI assistant unrestricted actuator access."
  },
  {
    "number": "07",
    "title": "From Demonstration to Pilot",
    "image": "/Measured Path to a Controlled Pilot.png",
    "description": "Begin with architecture review and read-only evidence, then evaluate shadow-mode results before considering any bounded operational pilot.",
    "script": "Image seven: a measured pilot. The written proposal begins with architecture review: select one workflow and map evidence sources, identities, permissions, and consequences. Next, use synthetic or explicitly consented records for a read-only demonstration that changes no physical equipment. A shadow-mode assessment can compare governance receipts with human review, tracking completeness, false holds, latency, and usefulness. Only if those stages justify it should either organization consider a bounded operational pilot with written safety, security, authorization, responsibility, rollback, and acceptance criteria. The image's next-steps panel describes possible later collaboration, not an automatic commitment."
  },
  {
    "number": "08",
    "title": "Intelligent Buildings With Accountable Execution",
    "image": "/Intelligent Buildings, Accountable Execution.png",
    "description": "The potential future is connected operational work with independently examinable, authorized consequences—not a claimed existing partnership.",
    "script": "Image eight: the possible future. CUBE could continue to own the contractor workflow and operational records. TA-14 could provide an independent, evidence-bound examination at selected consequence boundaries. Together, those complementary roles may improve traceability, owner assurance, and confidence about why an action was or was not permitted. Those outcomes are hypotheses to test, not measured benefits or guaranteed risk reductions. The immediate invitation to Hector and CUBE is simply to select one workflow, examine technical feasibility, and decide whether a read-only demonstration deserves further consideration."
  }
];
const buttonStyle={border:'1px solid #315e78',background:'#09273b',color:'#d5f4ff',padding:'12px 17px',borderRadius:10,fontWeight:700,cursor:'pointer'} as const;

export default function CubeOpportunityShowroom(){
 const [index,setIndex]=useState(0);
 const [playing,setPlaying]=useState(false);
 const [paused,setPaused]=useState(false);
 const [reader,setReader]=useState(true);
 const current=slides[index];
 useEffect(()=>()=>{if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel()},[]);
 const stop=()=>{if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();setPlaying(false);setPaused(false)};
 const go=(n:number)=>{stop();setIndex(Math.max(0,Math.min(slides.length-1,n)));};
 const play=()=>{if(typeof window==='undefined'||!('speechSynthesis' in window))return;stop();const utterance=new SpeechSynthesisUtterance(current.script);utterance.rate=.88;utterance.pitch=1;const voices=window.speechSynthesis.getVoices();utterance.voice=voices.find(v=>v.name==='Samantha')||voices.find(v=>v.lang==='en-US')||null;utterance.onend=()=>{setPlaying(false);setPaused(false)};utterance.onerror=()=>{setPlaying(false);setPaused(false)};setPlaying(true);window.speechSynthesis.speak(utterance)};
 const pause=()=>{if(typeof window==='undefined'||!('speechSynthesis' in window))return;if(paused){window.speechSynthesis.resume();setPaused(false)}else{window.speechSynthesis.pause();setPaused(true)}};
 return <main style={{background:'#06101e',color:'#e8f6ff',minHeight:'100vh',fontFamily:'Arial,Helvetica,sans-serif'}}>
 <div style={{maxWidth:1190,margin:'auto',padding:'26px 18px 84px'}}>
 <nav style={{display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap',borderBottom:'1px solid #28415b',paddingBottom:18,fontSize:13}}>
 <Link href='/showrooms/interoperability-systems' style={{color:'#83d8ef'}}>← Interoperability & Systems</Link><Link href='/showrooms' style={{color:'#83d8ef'}}>Showrooms</Link>
 </nav>
 <header style={{padding:'50px 0 35px'}}>
 <p style={{fontSize:12,letterSpacing:2,color:'#7ce1e9',fontWeight:800}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT STRATEGIC EXPLORATION</p>
 <h1 style={{fontSize:'clamp(38px,6vw,70px)',lineHeight:1.08,letterSpacing:'-.035em',margin:'22px 0 20px'}}>CUBE × TA-14<br/><span style={{color:'#83def5'}}>The Next Trust Layer for Intelligent Buildings</span></h1>
 <p style={{fontSize:19,lineHeight:1.65,color:'#b9cfdd',maxWidth:950}}>An eight-image guided explanation of the strategic opportunity brief prepared for Hector Hernandez, CEO of CUBE USA: connected contractor workflows, independent execution governance, and a careful path to evaluation.</p>
 <p style={{padding:'18px 20px',border:'1px solid #7b6854',borderRadius:12,background:'#241e1b',fontSize:14,lineHeight:1.7,color:'#f2d6ae'}}>INDEPENDENT DISCUSSION MATERIAL · NOT A PARTNERSHIP ANNOUNCEMENT. No CUBE endorsement, completed TA-14 examination, technical integration, or commercial commitment is claimed. All demonstrations and decision records are illustrative.</p>
 </header>
 <section aria-label='Strategic opportunity brief' style={{padding:'26px',border:'1px solid #365a73',background:'#0b2235',borderRadius:18,marginBottom:42}}>
 <p style={{fontSize:12,color:'#7ee3f1',fontWeight:800,letterSpacing:2}}>THE PRIMARY REFERENCE · DISCUSSION EDITION V3.0 · 13 PAGES</p>
 <h2 style={{fontSize:'clamp(26px,3.7vw,39px)',margin:'12px 0'}}>CUBE × TA-14 Strategic Opportunity Brief</h2>
 <p style={{color:'#bbd3df',lineHeight:1.7}}>Read the original briefing first, or use the eight visual explanations below. The reference describes a possible technical complement—not an operating integration.</p>
 <div style={{display:'flex',gap:12,flexWrap:'wrap',margin:'18px 0'}}><a href={pdf} target='_blank' rel='noopener noreferrer' style={{...buttonStyle,textDecoration:'none',background:'#76dbeb',color:'#041925'}}>Open PDF ↗</a><a href={pdf} download style={{...buttonStyle,textDecoration:'none'}}>Download 13-page PDF ↓</a><button type='button' onClick={()=>setReader(!reader)} style={buttonStyle}>{reader?'Hide':'Show'} embedded PDF reader</button></div>
 {reader&&<iframe src={pdf+'#toolbar=1'} title='CUBE TA-14 strategic opportunity brief version 3' style={{width:'100%',height:'min(75vh,750px)',minHeight:400,border:'1px solid #38536b',borderRadius:11,background:'#fff'}}/>}
 </section>
 <section aria-label='The governing boundary' style={{marginBottom:38,padding:'24px',borderLeft:'4px solid #7de5ed',background:'#0c1c2d'}}>
 <p style={{color:'#83ddea',fontWeight:800,fontSize:12,letterSpacing:2}}>THE GOVERNING QUESTION</p>
 <h2 style={{fontSize:'clamp(23px,3vw,35px)',lineHeight:1.35}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</h2>
 <p style={{color:'#a9bdcb',fontSize:16,lineHeight:1.7}}>A detected deficiency is not itself a diagnosis. A diagnosis is not permission. Any ALLOW must be bounded to the proposed action and revalidated at commit.</p>
 </section>
 <section aria-label='Eight numbered visual lessons'>
 <p style={{fontSize:12,color:'#8ccbe4',fontWeight:800,letterSpacing:2}}>EIGHT VISUAL LESSONS · SELECT ANY IMAGE</p>
 <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:23}}>{slides.map((s,i)=><button type='button' key={s.number} onClick={()=>go(i)} aria-current={index===i?'step':undefined} style={{...buttonStyle,background:index===i?'#8ee7f1':'#0b2539',color:index===i?'#041c2c':'#c3dfed'}}>{s.number}</button>)}</div>
 <div style={{border:'1px solid #2b5a74',borderRadius:17,overflow:'hidden',background:'#091c2d'}}>
 <div style={{padding:'21px 24px 14px'}}>
 <p style={{color:'#89daeb',fontSize:12,letterSpacing:2,fontWeight:800,margin:0}}>IMAGE {current.number} / 08</p>
 <h2 style={{fontSize:'clamp(26px,3.6vw,41px)',lineHeight:1.16,margin:'10px 0'}}>{current.title}</h2>
 <p style={{color:'#bdd4e0',lineHeight:1.7,fontSize:16}}>{current.description}</p>
 </div>
 <Image src={current.image} alt={'CUBE and TA-14 teaching image '+current.number+': '+current.title} width={1648} height={928} sizes='(max-width:1190px) 100vw, 1190px' priority={index===0} style={{display:'block',width:'100%',height:'auto'}}/>
 <div style={{padding:'22px 24px',borderTop:'1px solid #2b5168'}}>
 <p style={{color:'#8de6ec',fontWeight:800,letterSpacing:1,fontSize:13,marginTop:0}}>▶ SAMANTHA — EXPLAIN</p>
 <div style={{display:'flex',gap:9,flexWrap:'wrap'}}><button onClick={play} type='button' style={buttonStyle}>▶ {playing?'Restart':'Play'} narration</button><button onClick={pause} type='button' disabled={!playing} style={{...buttonStyle,opacity:playing?1:.5}}>{paused?'▶ Resume':'Ⅱ Pause'}</button><button onClick={stop} type='button' style={buttonStyle}>■ Stop</button></div>
 <p style={{lineHeight:1.8,color:'#b9cdd9',fontSize:15,maxWidth:1000}}>{current.script}</p>
 <div style={{display:'flex',justifyContent:'space-between',gap:14,flexWrap:'wrap',marginTop:18}}><button type='button' onClick={()=>go(index-1)} disabled={index===0} style={{...buttonStyle,opacity:index===0?.45:1}}>← Previous image</button><button type='button' onClick={()=>go(index+1)} disabled={index===7} style={{...buttonStyle,opacity:index===7?.45:1,background:'#76ddeb',color:'#052236'}}>Next image →</button></div>
 </div></div></section>
 <section style={{marginTop:45,padding:'28px',background:'#102638',border:'1px solid #3a6075',borderRadius:17}}>
 <p style={{color:'#9cdaeb',fontWeight:800,fontSize:12,letterSpacing:2}}>A BOUNDED FIRST STEP</p><h2 style={{fontSize:30,margin:'12px 0'}}>Explore one workflow. Verify technical fit. Measure the result.</h2>
 <p style={{color:'#b6cfdd',lineHeight:1.75}}>The proposed sequence is architecture review, read-only synthetic demonstration, shadow-mode evaluation, and—only with written safety and authorization criteria—a controlled operational pilot. CUBE retains its operational product responsibilities; TA-14 governance remains independent.</p>
 <a href={pdf} target='_blank' rel='noopener noreferrer' style={{color:'#96ebf2',fontWeight:800}}>Review the full strategic brief ↗</a>
 </section>
 <footer style={{marginTop:35,paddingTop:21,borderTop:'1px solid #29475b',fontSize:13,color:'#9bb7c9',lineHeight:1.7}}>No admissible evidence. No admissible execution. · Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome.<br/>Discussion edition · November 3, 2026 · Prepared for Hector Hernandez · TA14 Authority Governance Institution</footer>
 </div></main>
}
