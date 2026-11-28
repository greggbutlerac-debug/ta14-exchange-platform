'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';

const exhibits=[
 {title:'Human State',file:'Human State_ HVAC Readiness Check.png',subtitle:'Human readiness is relevant context, never automatic authority.',
 narration:'Exhibit one examines human state. Attention, fatigue, stress, workload and uncertainty may matter to a bounded task. These signals do not define a person and do not independently grant or deny authority. Before action, ask what is actually known, what remains uncertain and what support the human needs.',
 learned:'Human-state observations provide bounded context, not permission, diagnosis or a general judgment about a person.',next:'The next exhibit examines where the human is, which people and assets are involved, and what constraints define the present moment.'},
 {title:'Situational Context',file:'Situational Context_ Library HVAC Scan.png',subtitle:'Know the task, people, asset, environment and material constraints NOW.',
 narration:'Exhibit two moves from the person to the situation. A hypothetical library has occupied spaces, a designated air handling unit and changing outdoor conditions. The wearable companion may show contextual observations, but a valid interpretation must retain uncertainty and must not be mistaken for execution authority.',
 learned:'A proposed action must be bound to the actual asset, location, task, people and current conditions.',next:'Next we examine whether each material measurement and observation has an attributable source and an intact chain of provenance.'},
 {title:'Evidence Provenance',file:'Exhibit 03_ Evidence Provenance.png',subtitle:'Trace source, timestamp, calibration, uncertainty and record continuity.',
 narration:'Exhibit three asks where the evidence came from. Instrument identity, calibration, time, transformation and continuity all matter. One displayed reading is not automatically a complete admissible record. Recording the original context makes later interpretation and review possible.',
 learned:'Trusted evidence must be attributable and fit for the specific proposed consequence, not merely plausible.',next:'Now we test sequence integrity. What happens when a human attempts a later step before a necessary prerequisite is complete?'},
 {title:'Sequence Integrity',file:'Sequence Integrity_ HVAC Step 03 Gate.png',subtitle:'A timely warning is not physical control of the human.',
 narration:'Exhibit four uses an illustrative fourteen-step diagnostic. The technician is on step three and attempts to advance to step four before required evidence is complete. Guidance through smart glasses and an earpiece alerts the technician: Step three is incomplete. You are attempting to advance prematurely. The human must decide whether to complete, defer, or depart from the guidance. The system must distinguish a requested step from an action actually performed. If the human proceeds anyway, the attributable record should preserve the warning, the human choice, what actually occurred and any observed outcome, to the extent captured. The guidance does not physically control the technician.',
 learned:'An advisory or governed HOLD is not proof that a human was physically stopped. A warning, human decision, actual action and observed outcome are distinct states.',next:'The next exhibit asks which exact consequential intervention is proposed and whether its execution boundary is justified.'},
 {title:'Intervention Boundary',file:'Intervention Boundary_ AuthorityGate Exhibit 05.png',subtitle:'Evidence, authority and standing must be established for the bounded action.',
 narration:'Exhibit five examines the human-facing intervention boundary. The system can perceive, analyze, explain and recommend. Before the proposed consequence is committed, Admissible Evidence, Applicable Authority, Established Standing and present conditions must be examined. AuthorityGate represents the proposed execution-governance boundary with ALLOW, HOLD, DENY and ESCALATE determinations. In a human task, those determinations do not automatically compel the person to act.',
 learned:'A recommendation or technical capability cannot manufacture permission for an actual intervention.',next:'Next we examine why a previously reasonable recommendation may lose its basis when conditions change.'},
 {title:'Changed-Condition Revalidation',file:'Changed-Condition Revalidation Dashboard.png',subtitle:'Past permission is not present authority.',
 narration:'Exhibit six depicts a hypothetical change in outdoor air during an HVAC decision. A condition relied upon earlier no longer holds. The relevant proposed action returns to examination, with the prior reliance marked insufficient until revalidation. The values and scenes in this illustration are teaching examples, not measured field results.',
 learned:'Material changes can invalidate reliance before the next consequential human commit, even after an earlier ALLOW.',next:'The next layer preserves the moment when a person considers current guidance and chooses whether to commit to action.'},
 {title:'Human Commit',file:'TA-14 Human Commit Exhibit.png',subtitle:'ALLOW permits a human choice; it does not command the human.',
 narration:'Exhibit seven separates a system determination from the accountable human decision. The person may accept guidance, decline, pause or seek review. When the required evidence, authority, standing and current conditions support a bounded action, a human commit remains a distinct event from the action actually carried out.',
 learned:'Human commit is separate from recommendation, governance determination and observed execution.',next:'Finally, the record must preserve what was shown, chosen, done and observed—without substituting an imagined outcome for evidence.'},
 {title:'Receipt + Replay',file:'TA-14 Receipt and Replay Interface.png',subtitle:'The resulting record must distinguish advice, actual conduct and observed outcome.',
 narration:'Exhibit eight completes the loop. The Human-Action Receipt links what was proposed, the evidence and authority relied upon, what the system presented, the human choice, what was actually performed and any observed outcome. An illustrated blocked-step label is only a fictional interface depiction: a wearable warning does not prove physical prevention. To claim prevention, an implementation would require independent evidence of actual enforcement. Replay supports bounded review rather than generalized surveillance.',
 learned:'The truth of the moment includes guidance, human agency, performed action, uncertainty, result and correction history.',next:'The next consequential moment begins from a new, attributable baseline.'}
] as const;

const pdf='/'+encodeURIComponent('TA14_Human_Performance_Stack_HPS_v1.0_ZENODO_FINAL_PREDEPOSIT (3) (1).pdf');
const hero='Human Performance Stack in Action.png';
export default function IllustratedExhibits(){
 const [speaking,setSpeaking]=useState<number|null>(null);
 const [transcripts,setTranscripts]=useState(false);
 const synth=useRef<SpeechSynthesisVoice|null>(null);
 const epoch=useRef(0);
 const [audioAvailable,setAudioAvailable]=useState(false);
 useEffect(()=>{
  if(typeof window==='undefined'||!('speechSynthesis' in window))return;
  setAudioAvailable(true);
  const choose=()=>{const voices=window.speechSynthesis.getVoices();synth.current=voices.find(v=>/samantha/i.test(v.name))||voices.find(v=>v.lang==='en-US')||voices.find(v=>v.lang.startsWith('en'))||null;};
  choose();window.speechSynthesis.addEventListener('voiceschanged',choose);
  return()=>{epoch.current++;window.speechSynthesis.cancel();window.speechSynthesis.removeEventListener('voiceschanged',choose);};
 },[]);
 function play(i:number){
  if(!audioAvailable)return;
  epoch.current++;const current=epoch.current;
  window.speechSynthesis.cancel();
  if(speaking===i){setSpeaking(null);return;}
  const utterance=new SpeechSynthesisUtterance(exhibits[i].narration);
  if(synth.current)utterance.voice=synth.current;
  utterance.lang='en-US';utterance.rate=.92;
  utterance.onend=()=>{if(epoch.current===current)setSpeaking(null);};
  utterance.onerror=()=>{if(epoch.current===current)setSpeaking(null);};
  window.speechSynthesis.speak(utterance);setSpeaking(i);
 }
 return <section id="illustrated-examination" style={{padding:'84px 0',borderTop:'1px solid rgba(114,241,184,.25)'}}>
  <p className="eyebrow">ILLUSTRATED TEACHING EDITION · EIGHT CANONICAL LAYERS</p>
  <h2>Eight moments.<br/><em>One accountable human actor.</em></h2>
  <p className="sectionLead">Follow one conceptual wearable-guidance sequence: a person sees material context through smart glasses, hears bounded prompts through an earpiece and may consult a phone or tablet for details and records. HPS governs the human-action boundary; HPGS describes the guidance implementation. Neither replaces professional judgment or domain-specific authority.</p>
  <div style={{display:'flex',flexWrap:'wrap',gap:12,margin:'24px 0'}}>
   <a href={pdf} target="_blank" rel="noreferrer" style={{padding:'12px 17px',border:'1px solid #6ec7cb',borderRadius:8,color:'#b6faff',textDecoration:'none',fontWeight:800,fontSize:12}}>OPEN CANONICAL HPS v1.0 PDF ↗</a>
   <button type="button" onClick={()=>setTranscripts(v=>!v)} style={{padding:'12px 17px',background:'#082731',border:'1px solid #6ec7cb',borderRadius:8,color:'#b6faff',fontWeight:800,fontSize:12,cursor:'pointer'}}>{transcripts?'HIDE':'SHOW'} NARRATION TRANSCRIPTS</button>
  </div>
  <p style={{padding:'18px 20px',background:'rgba(255,211,111,.055)',border:'1px solid rgba(255,211,111,.35)',borderRadius:12,color:'#e5d6aa',fontSize:13,lineHeight:1.7}}>Conceptual education only: the illustrated device interfaces, readings, recordings, and apparent validation states are fictional demonstrations. They are not evidence of a deployed TA-14 wearable product, verified enforcement, professional authorization, medical/legal conclusions or real outcomes. Human-state, voice, gesture and language interpretations are uncertain context; collection and retention require appropriate authority and data minimization. The HPS canonical specification controls normative meaning.</p>
  <div style={{position:'relative',aspectRatio:'16 / 9',maxWidth:1120,background:'#07131b',borderRadius:16,overflow:'hidden',border:'1px solid rgba(112,220,255,.25)',margin:'30px 0'}}>
   <Image src={'/'+encodeURIComponent(hero)} fill priority sizes="(max-width: 900px) 100vw, 1120px" style={{objectFit:'contain'}} alt="Conceptual hero illustration showing human performance guidance through wearable and mobile tools."/>
  </div>
  {exhibits.map((ex,i)=><article key={ex.title} id={'hps-exhibit-'+String(i+1).padStart(2,'0')} style={{padding:'clamp(18px,2.7vw,32px)',margin:'48px 0',border:'1px solid rgba(112,220,255,.25)',borderRadius:20,background:'linear-gradient(160deg,#082332,#041018)'}}>
   <p className="eyebrow" style={{color:'#ffd36f'}}>EXHIBIT {String(i+1).padStart(2,'0')} / 08 · {i+1===8?'FINAL LAYER':'OPERATING LAYER'}</p>
   <h3 style={{fontSize:'clamp(28px,4vw,48px)',letterSpacing:'-.04em',margin:'10px 0'}}>{ex.title}</h3>
   <p style={{fontSize:17,color:'#bfd8e3',lineHeight:1.6}}>{ex.subtitle}</p>
   <div style={{position:'relative',aspectRatio:'16 / 9',border:'1px solid #2b6473',background:'#030b11',borderRadius:12,overflow:'hidden',margin:'22px 0'}}>
    <Image src={'/'+encodeURIComponent(ex.file)} alt={'Conceptual teaching artwork for HPS Exhibit '+String(i+1).padStart(2,'0')+': '+ex.title} fill sizes="(max-width: 900px) 100vw, 1120px" style={{objectFit:'contain'}}/>
   </div>
   <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}}>
    <button type="button" disabled={!audioAvailable} onClick={()=>play(i)} style={{background:'#72f1b8',border:'none',padding:'12px 18px',borderRadius:8,color:'#04201b',fontSize:12,fontWeight:800,cursor:'pointer',opacity:audioAvailable?1:.55}}>{speaking===i?'STOP NARRATION':'PLAY NARRATION'}</button>
    <span style={{color:'#8ea5b0',fontSize:12}}>{audioAvailable?'Browser voice narration · Samantha when available':'Narration not supported in this browser'}</span>
   </div>
   {transcripts&&<p style={{padding:'17px 18px',marginTop:16,border:'1px solid #28515b',borderRadius:10,color:'#c4d7df',fontSize:14,lineHeight:1.7}}>{ex.narration}</p>}
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:14,marginTop:22}}>
    <div style={{padding:20,background:'#0a2b2a',borderRadius:12,border:'1px solid #2c7269'}}><b style={{color:'#86f2c6',fontSize:11,letterSpacing:1}}>WHAT WE JUST LEARNED</b><p style={{color:'#bcdad3',fontSize:14,lineHeight:1.7}}>{ex.learned}</p></div>
    <div style={{padding:20,background:'#142332',borderRadius:12,border:'1px solid #35607a'}}><b style={{color:'#8ee3ff',fontSize:11,letterSpacing:1}}>WHAT WE ARE ABOUT TO LEARN</b><p style={{color:'#b9d0de',fontSize:14,lineHeight:1.7}}>{ex.next}</p></div>
   </div>
  </article>)}
  <div style={{padding:'28px',border:'1px solid #4f806d',borderRadius:18,background:'#071e19',lineHeight:1.8}}>
   <p className="eyebrow">CLOSING DOCTRINE</p>
   <h3 style={{fontSize:'clamp(25px,4vw,40px)',margin:'8px 0'}}>The human remains the actor.</h3>
   <p style={{color:'#c4ded4'}}>The system guides. The record preserves the truth. The outcome becomes reviewable. A wearable may alert, translate, contextualize and warn; it must not silently turn an inference into knowledge, a recommendation into authority or a stated intention into verified action.</p>
   <Link href="/showrooms/human-performance" style={{color:'#a0f2dc'}}>EXPLORE THE HUMAN PERFORMANCE SHOWROOM COLLECTION →</Link>
  </div>
 </section>;
}
