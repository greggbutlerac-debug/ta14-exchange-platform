'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';

const PDF='/TA14_Arizona_Building_as_Evidence_Technical_Reference_v1_COMPRESSED%20(2).pdf';

const sourceCards=[
 ['SCHOOLS','Arizona Building Renewal Grants expressly recognize Classroom Temperature, Classroom Air Quality, and Building Systems deficiencies. The pathway can include assessment, design, procurement, construction, and supporting documentation.','https://sfb.az.gov/funding-programs/building-renewal-grant'],
 ['HOUSING / HABITABILITY','Arizona enforcement in 2026 has focused on failed air conditioning, extreme indoor heat, repair obligations, proof of compliance, and preservation of HVAC-related records.','https://www.azag.gov/press-release/attorney-general-mayes-demands-spectra-west-apartments-glendale-restore-functioning'],
 ['LITIGATION / FORENSIC EVIDENCE','Mason v. Eastside/Wasatch shows the evidentiary problem created when later testing is asked to establish an earlier indoor condition without sufficient continuity, documentation, or chain of custody.','https://law.justia.com/cases/arizona/court-of-appeals-division-one-unpublished/2010/cv090155.html'],
 ['PROCUREMENT / IMPLEMENTATION','Arizona already procures environmental monitoring, assessment, engineering, and technical services. TA14 enters as an evidence-integrity and consequence-governance layer, not as a replacement for licensed practice.','https://spo.az.gov/suppliers']
] as const;

const evidencePath=[
 ['01','REALITY','What was the building actually doing at the consequential time?'],
 ['02','RECORD','What atmospheric, mechanical, service, complaint, occupancy, and system evidence was preserved?'],
 ['03','CONTINUITY','Can the record survive gaps in time, custody, location, system state, changed conditions, and later reconstruction?'],
 ['04','INTERVENTION','What repair, control change, remediation, operating action, or capital improvement actually occurred?'],
 ['05','POST-CONDITION','What changed afterward, what did not change, and was the result measured rather than assumed?'],
 ['06','EXAMINATION','What can the preserved record legitimately support now — and what remains unresolved?']
] as const;

const serviceCards=[
 ['ATMOSPHERIC BASELINE','Temperature, humidity, CO₂, particles, pressure, equipment state, occupancy context, complaints, timestamps, and other bounded observations establish what the building was doing before intervention.'],
 ['MECHANICAL CHRONOLOGY','Service events, control changes, failures, repairs, bypass conditions, commissioning observations, configuration changes, and material changed conditions preserve how the system moved through time.'],
 ['INTERVENTION RECORD','The record identifies what was proposed, what authority applied, what work actually occurred, who performed it, when it occurred, and the scope under which it was performed.'],
 ['POST-CONDITION EVIDENCE','After work is complete, the building is measured again. Improvement, non-improvement, drift, or unresolved conditions are recorded without rewriting execution as success.'],
 ['ENVIRONMENTAL RECORD INTERPRETER','ERI makes the preserved record understandable while keeping observation separate from inference, diagnosis, legal conclusion, and execution authority.'],
 ['EXAMINATION PACKAGE','The resulting package can be replayed by owners, districts, consultants, insurers, counsel, experts, or agencies without TA14 pretending to decide the underlying legal or professional question.']
] as const;

const visuals=[
 {
  n:'01',k:'THE BUILDING AS EVIDENCE',title:'The building leaves a record before anyone tells a story about it.',
  img:'/Arizona%20School%20Building%20Evidence%20Infographic%20(1).png',
  alt:'Arizona school building evidence infographic',
  learned:'A building is not just a location. Its atmosphere, systems, operation, occupancy, maintenance, and timestamps can form a technical record.',
  next:'Next, we test what happens when that record is missing and someone tries to reconstruct the past from a later inspection.',
  script:'Start with the building itself. Before there is a claim, a lawsuit, a funding request, an expert opinion, or a repair recommendation, there is a physical reality. The building is producing temperature, humidity, particle conditions, pressure relationships, equipment states, control behavior, service events, occupancy context, and time. TA14 does not call every measurement admissible evidence automatically. The point of this visual is more basic: the building is continuously producing facts that can either be preserved or lost. If those facts are preserved with attribution and continuity, another person can later examine what the building was actually doing. If they are not preserved, the future examination may depend on memory, fragments, later testing, or assumptions. The first discipline is therefore not interpretation. It is record preservation. Reality first. Record second. Meaning comes later.'
 },
 {
  n:'02',k:'NOW ≠ THEN',title:'A later inspection can describe now without proving then.',
  img:'/Now%20%E2%89%A0%20Then_%20Arizona%20Building%20Evidence%20(1).png',
  alt:'Now does not equal then Arizona building evidence infographic',
  learned:'A later test is evidence of the later condition. It does not automatically establish the earlier condition when continuity is missing.',
  next:'Next, we turn that lesson into a full evidence path that preserves the building before, during, and after intervention.',
  script:'This is the central Arizona evidentiary pressure test. On one side is the earlier building reality. On the other side is later testing. Between them is time. During that interval, temperature can change, humidity can change, occupancy can change, equipment can be repaired or replaced, controls can be adjusted, moisture can enter or dry, filters can change, remediation can occur, and people can alter the space. If the record across that interval is incomplete, later testing may be useful without being able to establish the earlier condition. Mason is important here because the court record illustrates exactly this problem: later testing was asked to support an earlier proposition while intervening conditions were not sufficiently established. TA14 is not saying later evidence is worthless. TA14 is saying time matters. Continuity matters. Chain of custody matters. And a conclusion cannot borrow certainty from a period the record does not actually preserve.'
 },
 {
  n:'03',k:'THE ARIZONA EVIDENCE PATH',title:'Preserve the condition, the intervention, and the outcome as one connected record.',
  img:'/Arizona%20Evidence%20Path%20Infographic%20(1).png',
  alt:'Arizona evidence path infographic',
  learned:'Baseline, problem, intervention, verification, and post-condition evidence should be connected rather than stored as unrelated snapshots.',
  next:'Next, we examine the moment after the work: commissioning and verification.',
  script:'This visual moves from the problem to the method. A defensible record does not begin after a contractor leaves. It begins before intervention. First, establish the baseline: what was observed, when, where, under what operating and occupancy conditions, and with what provenance. Second, identify the problem without overstating what the observations prove. Third, record the intervention itself: scope, actor, authority, time, settings, equipment, and changed conditions. Fourth, commission and verify the system after the work. Fifth, preserve the post-condition record. The important idea is continuity across the whole sequence. The baseline and the post-condition should be comparable enough to support a bounded claim about change. Otherwise, a building can be repaired, money can be spent, and everyone can still be left arguing about what actually improved.'
 },
 {
  n:'04',k:'COMMISSIONING & VERIFICATION',title:'Execution is not the same thing as a verified outcome.',
  img:'/Commissioning%20and%20Verification%20Infographic%20(1).png',
  alt:'Commissioning and verification infographic',
  learned:'The fact that work was performed does not establish that the intended atmospheric or mechanical outcome occurred.',
  next:'Next, we preserve the entire before-during-after history so the result can survive future examination.',
  script:'This visual separates intervention from outcome. A repair can be correctly performed and still fail to produce the intended environmental result. New equipment can operate and still be improperly configured. A control change can execute and later drift. Commissioning and verification therefore ask the building again: what are you doing now? The post-condition record should be compared to the baseline using measurements that are meaningful for the exact proposition being examined. Improvement can be recorded as improvement. No material improvement can be recorded as no material improvement. New problems can be preserved as new problems. TA14 does not allow the sentence work completed to silently become outcome achieved. That distinction protects owners, occupants, contractors, funders, and future examiners because execution and outcome remain separate facts.'
 },
 {
  n:'05',k:'THE COMPLETE RECORD OVER TIME',title:'A building history becomes more valuable every time a future decision depends on it.',
  img:'/Arizona%20Building%20Evidence%20Continuity%20Infographic%20(1).png',
  alt:'Arizona building evidence continuity infographic',
  learned:'A complete record preserves the sequence from baseline through intervention and post-condition instead of forcing future reconstruction.',
  next:'Next, we show what that preserved history can support — and what it still cannot authorize by itself.',
  script:'Now we zoom out. A single project may feel complete when the repair is closed, but the building keeps operating. Complaints can return. Equipment can drift. Ownership can change. Another renovation can begin. An insurer, school district, attorney, regulator, or new service provider may later need to understand what happened. The complete record over time gives those future actors something stronger than disconnected invoices, screenshots, and recollections. It preserves baseline evidence, issue identification, service and intervention records, testing, commissioning, photographs, drawings, final conditions, and ongoing monitoring where appropriate. The record is not proof of every later proposition. It is the preserved substrate from which later propositions can be examined without inventing the missing middle.'
 },
 {
  n:'06',k:'FROM RECORDS TO REAL OUTCOMES',title:'Evidence can improve decisions without becoming automatic permission.',
  img:'/Arizona%20Building%20Records%20to%20Outcomes%20(1).png',
  alt:'Arizona building records to outcomes infographic',
  learned:'Better records can support risk reduction, dispute resolution, operations, and accountability — but evidence alone does not grant authority.',
  next:'Next, we extend the record beyond one project into the full lifecycle of building decisions.',
  script:'This visual answers the practical question: why preserve all of this? Because a defensible record can support better decisions. It can help identify problems earlier, support risk assessment, provide context during disputes, show what work was actually performed, and make later verification possible. But notice the TA14 boundary. Evidence does not become authority merely because it is useful. A strong record can inform a school official, property owner, insurer, engineer, industrial hygienist, attorney, court, or public agency. Each actor still operates under their own applicable authority, competence, scope, and standing. TA14 is not trying to replace those roles. It is trying to make sure the record they receive is not weaker than it needs to be.'
 },
 {
  n:'07',k:'A LIFECYCLE OF ACCOUNTABLE DECISIONS',title:'The value of continuity compounds across the life of the building.',
  img:'/Lifecycle%20of%20Accountable%20Decisions.png',
  alt:'Lifecycle of accountable decisions infographic',
  learned:'Operations, maintenance, funding, compliance, disputes, and renovation all rely on the history created by earlier decisions.',
  next:'Next, we connect preserved evidence directly to funding and capital improvement decisions.',
  script:'A building does not have one consequential moment. It has thousands. Day-to-day operation produces records. Maintenance changes system state. Funding requests rely on evidence of need. Compliance reviews rely on inspection and service records. Disputes rely on chronology. Renovations rely on understanding the condition inherited from earlier work. This is why continuity should be designed as an operating discipline instead of added only after something goes wrong. Each authorized action should leave a record that the next decision can inherit without inheriting yesterday\'s authority. The history travels. The authority for the next consequence still has to be established in the present. That is how a building can remain inspectable across years without pretending that an old approval governs every future condition.'
 },
 {
  n:'08',k:'EVIDENCE THAT SUPPORTS FUNDING & IMPROVEMENTS',title:'Public or private investment should be able to show what condition justified the work and what changed afterward.',
  img:'/Arizona%20Evidence-to-Action%20Funding%20Roadmap%20(1).png',
  alt:'Arizona evidence to action funding roadmap',
  learned:'Evidence can support prioritization, scope, funding, execution oversight, and verification of the result.',
  next:'The final step is a bounded Arizona pilot: one building, one condition, one evidence problem, and a record that can be examined.',
  script:'The final visual connects the evidence discipline to investment. Funding decisions are stronger when the need is documented, the proposed scope is tied to observed conditions, approvals and authority are preserved, implementation is recorded, and the post-improvement condition is verified. This matters in schools, housing, public facilities, insurance, and private portfolios because money and consequence meet in the same place. A funded intervention changes real equipment and real environments. The record should therefore be able to answer: why was this work selected, what evidence supported the scope, who authorized it, what was actually changed, and what measurable result followed? That is the pilot opportunity for Arizona. Not adopt an institution in the abstract. Take one real building problem and test whether a stronger evidence chain produces a better, more defensible record.'
 }
] as const;

const btn={cursor:'pointer',padding:'10px 13px',borderRadius:9,border:'1px solid rgba(111,220,255,.3)',background:'rgba(8,37,47,.9)',color:'#eef8fb',fontWeight:950,fontSize:10} as const;

function SamanthaReadAlong({text}:{text:string}){
 const [speaking,setSpeaking]=useState(false),[paused,setPaused]=useState(false),[active,setActive]=useState(-1);
 const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]),[voiceName,setVoiceName]=useState('Samantha'),[rate,setRate]=useState(.8);
 const words=[...text.matchAll(/\S+/g)].map(m=>({word:m[0],start:m.index||0}));
 const spans=useRef<(HTMLSpanElement|null)[]>([]);
 useEffect(()=>{if(!('speechSynthesis' in window))return;const load=()=>{const v=window.speechSynthesis.getVoices().filter(x=>x.lang.toLowerCase().startsWith('en'));setVoices(v);setVoiceName(v.some(x=>x.name==='Samantha')?'Samantha':v.find(x=>x.lang==='en-US')?.name||v[0]?.name||'')};load();window.speechSynthesis.addEventListener('voiceschanged',load);return()=>window.speechSynthesis.removeEventListener('voiceschanged',load)},[]);
 useEffect(()=>()=>window.speechSynthesis?.cancel(),[]);
 const stop=()=>{window.speechSynthesis?.cancel();setSpeaking(false);setPaused(false);setActive(-1)};
 const start=()=>{stop();const u=new SpeechSynthesisUtterance(text);const v=voices.find(x=>x.name===voiceName);if(v)u.voice=v;u.rate=rate;u.pitch=.95;u.onboundary=e=>{if(e.name!=='word')return;let x=0;for(let i=0;i<words.length;i++){if(words[i].start<=e.charIndex)x=i;else break}setActive(x)};u.onend=()=>{setSpeaking(false);setPaused(false);setActive(-1)};setSpeaking(true);window.speechSynthesis.speak(u)};
 const toggle=()=>{if(!speaking)return start();if(paused){window.speechSynthesis.resume();setPaused(false)}else{window.speechSynthesis.pause();setPaused(true)}};
 return <div style={{marginTop:14,padding:20,borderRadius:16,border:'1px solid rgba(111,220,255,.22)',background:'rgba(2,10,17,.88)'}}>
  <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',flexWrap:'wrap'}}>
   <b style={{fontSize:10,letterSpacing:'.14em',color:'#70dcff'}}>SAMANTHA · SYNCHRONIZED READ-ALONG</b>
   <div style={{display:'flex',gap:7,flexWrap:'wrap'}}><button onClick={toggle} style={btn}>{!speaking?'▶ PLAY':paused?'▶ RESUME':'Ⅱ PAUSE'}</button><button onClick={start} style={btn}>↻ RESTART</button>{speaking?<button onClick={stop} style={btn}>■ STOP</button>:null}</div>
  </div>
  <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap',marginTop:14}}>
   <label style={{fontSize:9,fontWeight:900,color:'#8fb2c0'}}>VOICE <select value={voiceName} onChange={e=>{stop();setVoiceName(e.target.value)}} style={{marginLeft:7,background:'#020a11',color:'#eef8fb',border:'1px solid rgba(111,220,255,.22)',padding:7}}>{voices.map(v=><option key={v.name}>{v.name}</option>)}</select></label>
   <label style={{fontSize:9,fontWeight:900,color:'#8fb2c0'}}>SPEED · {rate.toFixed(2)}× <input type="range" min=".65" max="1.15" step=".05" value={rate} onChange={e=>{stop();setRate(+e.target.value)}} /></label>
  </div>
  <p style={{fontSize:'clamp(16px,1.7vw,21px)',lineHeight:1.9,color:'#bfd0d7',marginBottom:0}}>{words.map((w,i)=><span key={i} ref={el=>{spans.current[i]=el}} style={active===i?{background:'#71f2b6',color:'#03100b',padding:'2px 3px',borderRadius:3,fontWeight:900}:undefined}>{w.word} </span>)}</p>
 </div>
}

function TeachingVisual({v}:{v:typeof visuals[number]}){
 const [open,setOpen]=useState(false);
 return <section style={{marginTop:30,padding:'clamp(20px,3vw,30px)',border:'1px solid rgba(111,220,255,.18)',borderRadius:24,background:'linear-gradient(145deg,rgba(5,24,37,.88),rgba(2,9,15,.98))'}}>
  <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#70dcff'}}>{v.n} · {v.k}</div>
  <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(28px,4vw,50px)',lineHeight:1.05,margin:'10px 0 20px'}}>{v.title}</h2>
  <Image src={v.img} alt={v.alt} width={1536} height={1024} sizes="(max-width: 1280px) 100vw, 1280px" style={{display:'block',width:'100%',height:'auto',borderRadius:16,border:'1px solid rgba(111,220,255,.24)',boxShadow:'0 24px 80px rgba(0,0,0,.45)'}}/>
  <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap',marginTop:16}}>
   <button onClick={()=>{window.speechSynthesis?.cancel();setOpen(!open)}} style={{...btn,border:'1px solid rgba(113,242,182,.4)',background:'rgba(113,242,182,.11)',color:'#e6fff2'}}>{open?'CLOSE EXPLANATION':'▶ SAMANTHA — EXPLAIN THIS VISUAL'}</button>
   <span style={{fontSize:9,fontWeight:900,letterSpacing:'.12em',color:'#7896a3'}}>LISTEN · READ · PAUSE · RESTART</span>
  </div>
  {open?<SamanthaReadAlong text={v.script}/>:null}
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12,marginTop:16}}>
   <div style={{padding:18,borderRadius:14,border:'1px solid rgba(113,242,182,.16)',background:'rgba(8,42,34,.16)'}}><small style={{display:'block',color:'#71f2b6',fontWeight:950,letterSpacing:1.2}}>WHAT THIS VISUAL TEACHES</small><p style={{color:'#a8c1b7',lineHeight:1.65,marginBottom:0}}>{v.learned}</p></div>
   <div style={{padding:18,borderRadius:14,border:'1px solid rgba(185,168,255,.16)',background:'rgba(42,32,72,.14)'}}><small style={{display:'block',color:'#b9a8ff',fontWeight:950,letterSpacing:1.2}}>WHAT COMES NEXT</small><p style={{color:'#b8b1c9',lineHeight:1.65,marginBottom:0}}>{v.next}</p></div>
  </div>
 </section>
}

export default function ArizonaBuildingEvidenceClient(){
 return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 82% 0%,rgba(51,184,230,.16),transparent 28%),linear-gradient(180deg,#02070c,#07131b 48%,#02070c)',color:'#edf5f8',fontFamily:'Arial,sans-serif',padding:'0 20px'}}>
  <div style={{maxWidth:1200,margin:'0 auto'}}>
   <nav style={{padding:'28px 0',borderBottom:'1px solid rgba(112,220,255,.14)',display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
    <Link href="/showrooms/environmental-atmospheric" style={{color:'#70dcff',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL & ATMOSPHERIC</Link>
    <span style={{fontSize:10,fontWeight:900,letterSpacing:1.8,color:'#78909b'}}>PUBLIC TECHNICAL SHOWROOM · ARIZONA</span>
   </nav>

   <header style={{padding:'86px 0 48px'}}>
    <p style={{color:'#efc86c',fontSize:11,fontWeight:900,letterSpacing:2}}>ATMOSPHERIC EVIDENCE · HVAC HISTORY · CONTINUITY · OUTCOME</p>
    <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(58px,9vw,108px)',lineHeight:.9,letterSpacing:'-.05em',margin:'18px 0 28px'}}>THE BUILDING<br/><em style={{fontStyle:'normal',color:'#70dcff'}}>AS EVIDENCE.</em></h1>
    <p style={{maxWidth:960,color:'#b5c9d2',fontSize:'clamp(20px,2.5vw,29px)',lineHeight:1.55}}>When a school, apartment, workplace, insurer, attorney, court, consultant, or public agency needs to understand what happened inside a building, the question is not merely what can be measured today. The question is what condition actually existed, what changed, what intervention occurred, and what record survived.</p>
    <div style={{marginTop:32,padding:26,border:'1px solid rgba(113,242,182,.34)',borderRadius:20,background:'rgba(5,22,29,.72)',fontSize:'clamp(21px,3vw,35px)',fontWeight:900,lineHeight:1.25}}>A later inspection can describe the building now. It cannot automatically prove what the building was doing then.</div>
    <div style={{marginTop:18,padding:'22px 24px',border:'1px solid rgba(112,220,255,.24)',borderRadius:18,background:'rgba(4,18,27,.72)'}}><small style={{display:'block',color:'#70dcff',fontWeight:900,letterSpacing:1.4,marginBottom:10}}>TA14 GOVERNING QUESTION</small><div style={{fontFamily:'Georgia,serif',fontSize:'clamp(20px,2.4vw,31px)',lineHeight:1.35}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</div></div>
    <div style={{marginTop:24,display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}><a href={PDF} target="_blank" rel="noreferrer" style={{display:'inline-block',padding:'15px 20px',borderRadius:12,background:'#70dcff',color:'#021019',textDecoration:'none',fontWeight:900,fontSize:11}}>DOWNLOAD TECHNICAL REFERENCE — PDF</a><span style={{color:'#7f959f',fontSize:11}}>14-page Arizona technical reference · v1.0</span></div>
   </header>

   <TeachingVisual v={visuals[0]}/>

   <section style={{padding:'58px 0 16px'}}>
    <p style={{color:'#70dcff',fontSize:10,fontWeight:900,letterSpacing:1.7}}>WHY ARIZONA · WHY NOW</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(38px,5vw,62px)',margin:'12px 0 16px'}}>Arizona already funds, regulates, litigates, and examines building condition.</h2>
    <p style={{maxWidth:930,color:'#9fb4be',fontSize:17,lineHeight:1.72}}>The opportunity is not to invent a new need. It is to strengthen the record around needs Arizona already has: classroom temperature and air quality, HVAC deficiencies, housing cooling failures, environmental disputes, capital improvements, compliance, and later technical examination.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:14,marginTop:26}}>{sourceCards.map(([t,d,u])=><a key={t} href={u} target="_blank" rel="noreferrer" style={{padding:24,border:'1px solid rgba(112,220,255,.18)',borderRadius:18,background:'rgba(4,18,27,.78)',color:'#edf5f8',textDecoration:'none'}}><small style={{color:'#efc86c',fontWeight:900,letterSpacing:1.1}}>{t}</small><p style={{color:'#9fb4be',lineHeight:1.65,fontSize:14}}>{d}</p><b style={{color:'#70dcff',fontSize:10}}>VIEW SOURCE →</b></a>)}</div>
    <div style={{marginTop:16,padding:'22px 24px',border:'1px solid rgba(255,211,111,.2)',borderRadius:16,background:'rgba(56,43,10,.1)',color:'#c8bea4',lineHeight:1.65}}><b style={{color:'#efc86c'}}>CURRENT RECORD-PRESERVATION SIGNAL.</b> In a 2026 housing enforcement matter, the Arizona Attorney General demanded functioning air conditioning, written proof of compliance, and preservation of maintenance and HVAC-system records. That is the same evidentiary problem this showroom makes visible: condition, chronology, intervention, and proof afterward.</div>
   </section>

   <TeachingVisual v={visuals[1]}/>

   <section style={{marginTop:30,padding:'clamp(30px,5vw,54px)',border:'1px solid rgba(112,220,255,.18)',borderRadius:24,background:'linear-gradient(145deg,rgba(8,34,47,.82),rgba(2,10,16,.96))'}}>
    <p style={{color:'#71f2b6',fontSize:10,fontWeight:900,letterSpacing:1.7}}>THE EVIDENCE PATH</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,56px)',margin:'12px 0 10px'}}>Preserve the sequence, not just the snapshots.</h2>
    <p style={{color:'#9fb4be',lineHeight:1.7,maxWidth:920}}>TA14 treats the building record as a chain that moves from physical reality through observation, continuity, intervention, verification, and examination. Each stage has a different job. None is allowed to silently substitute for another.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12,marginTop:22}}>{evidencePath.map(([n,t,d])=><article key={n} style={{padding:22,border:'1px solid rgba(255,255,255,.08)',borderRadius:16,background:'rgba(2,9,15,.58)'}}><div style={{color:'#70dcff',fontSize:10,fontWeight:900}}>{n}</div><h3 style={{fontSize:20,margin:'8px 0'}}>{t}</h3><p style={{color:'#98adb7',lineHeight:1.6,fontSize:13}}>{d}</p></article>)}</div>
   </section>

   <TeachingVisual v={visuals[2]}/>

   <section style={{marginTop:30,padding:'clamp(30px,5vw,54px)',border:'1px solid rgba(255,211,111,.24)',borderRadius:24,background:'rgba(56,43,10,.12)'}}>
    <p style={{color:'#efc86c',fontSize:10,fontWeight:900,letterSpacing:1.7}}>HISTORICAL ARIZONA PRESSURE TEST</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,58px)',margin:'12px 0 18px'}}>Mason makes the continuity problem concrete.</h2>
    <p style={{maxWidth:980,color:'#c6c0ad',fontSize:17,lineHeight:1.72}}>The Mason litigation illustrates the evidentiary risk: sample documentation and chain of custody were challenged, and testing years later could not reliably establish earlier mold conditions where temperature, humidity, remediation, and other intervening conditions were not known. The lesson is not that one party was right. The lesson is that a missing chronology can become decisive.</p>
    <div style={{marginTop:22,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10}}>{[['2001','EARLIER BUILDING REALITY'],['GAP','MISSING CONTINUITY'],['2003','LATER TESTING'],['LIMIT','CANNOT AUTOMATICALLY RECONSTRUCT 2001']].map(([a,b])=><div key={a} style={{padding:18,border:'1px solid rgba(255,211,111,.18)',borderRadius:14,background:'rgba(2,9,15,.5)'}}><b style={{display:'block',color:'#efc86c',fontSize:18}}>{a}</b><span style={{display:'block',marginTop:8,color:'#b7ad95',fontSize:11,fontWeight:900,lineHeight:1.45}}>{b}</span></div>)}</div>
    <a href="https://law.justia.com/cases/arizona/court-of-appeals-division-one-unpublished/2010/cv090155.html" target="_blank" rel="noreferrer" style={{display:'inline-block',marginTop:18,color:'#70dcff',textDecoration:'none',fontWeight:900,fontSize:11}}>READ THE ARIZONA COURT RECORD →</a>
   </section>

   <TeachingVisual v={visuals[3]}/>
   <TeachingVisual v={visuals[4]}/>

   <section style={{marginTop:30,padding:'clamp(30px,5vw,54px)',border:'1px solid rgba(113,242,182,.24)',borderRadius:24,background:'rgba(8,42,34,.12)'}}>
    <p style={{color:'#71f2b6',fontSize:10,fontWeight:900,letterSpacing:1.7}}>TA14 EVIDENCE ARCHITECTURE</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,58px)',margin:'12px 0 18px'}}>Keep the record, interpretation, and consequence distinct.</h2>
    <div style={{padding:22,border:'1px solid rgba(113,242,182,.18)',borderRadius:16,background:'rgba(2,10,16,.58)'}}><small style={{color:'#71f2b6',fontWeight:900,letterSpacing:1.3}}>EVIDENCE ARCHITECTURE</small><div style={{marginTop:12,fontSize:'clamp(16px,2vw,23px)',fontWeight:900,lineHeight:1.5}}>REALITY → AIR → CONTINUITY → ENVIRONMENTAL RECORD INTERPRETER → ADMISSIBILITY → AUTHORIZED HUMAN / INSTITUTIONAL USE</div><p style={{margin:'12px 0 0',color:'#9eb7ae',fontSize:13,lineHeight:1.65}}>AIR preserves atmospheric condition and chronology. ERI makes the preserved record understandable without silently converting observation into diagnosis, legal conclusion, or execution authority. PAIR is used only where person-centered atmospheric continuity is actually relevant.</p></div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12,marginTop:20}}>{serviceCards.map(([t,d])=><article key={t} style={{padding:22,border:'1px solid rgba(113,242,182,.12)',borderRadius:16,background:'rgba(2,10,16,.58)'}}><h3 style={{fontSize:18,margin:'0 0 10px',color:'#e7fff3'}}>{t}</h3><p style={{color:'#9eb7ae',fontSize:13,lineHeight:1.65}}>{d}</p></article>)}</div>
   </section>

   <TeachingVisual v={visuals[5]}/>
   <TeachingVisual v={visuals[6]}/>
   <TeachingVisual v={visuals[7]}/>

   <section style={{marginTop:30,padding:'clamp(32px,5vw,58px)',border:'1px solid rgba(185,168,255,.25)',borderRadius:24,background:'rgba(42,32,72,.13)'}}>
    <p style={{color:'#b9a8ff',fontSize:10,fontWeight:900,letterSpacing:1.7}}>PROPOSED ARIZONA PILOT</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(36px,5vw,62px)',margin:'12px 0 20px'}}>One building. One condition. One evidence problem.</h2>
    <p style={{maxWidth:970,color:'#b9b3c9',fontSize:18,lineHeight:1.7}}>A school HVAC or IAQ deficiency. An apartment cooling or habitability complaint. A mold or moisture evidence problem. Post-repair verification. Or a portfolio that needs defensible operating history. The pilot does not decide the case. It establishes a stronger record of reality around the consequential route.</p>
    <div style={{marginTop:24,padding:22,borderRadius:16,border:'1px solid rgba(185,168,255,.2)',background:'rgba(2,9,15,.58)',fontWeight:900,lineHeight:1.5}}>BASELINE → CHRONOLOGY → INTERVENTION → POST-CONDITION → PRESERVED EVIDENCE PACKAGE → TECHNICAL EXAMINATION</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12,marginTop:18}}>{[
      ['01','Freeze the proposition and scope.'],['02','Establish baseline evidence and provenance.'],['03','Preserve mechanical and service chronology.'],['04','Record authority, actor, intervention, time, and scope.'],['05','Verify post-condition performance.'],['06','Produce a replayable examination package.']
    ].map(([n,t])=><div key={n} style={{padding:18,borderRadius:14,border:'1px solid rgba(185,168,255,.14)',background:'rgba(2,9,15,.5)'}}><b style={{color:'#b9a8ff'}}>{n}</b><p style={{color:'#b9b3c9',lineHeight:1.55,marginBottom:0}}>{t}</p></div>)}</div>
   </section>

   <section style={{marginTop:28,padding:'clamp(30px,5vw,50px)',borderRadius:20,border:'1px solid rgba(112,220,255,.24)',background:'rgba(4,18,27,.72)'}}>
    <p style={{color:'#70dcff',fontSize:10,fontWeight:900,letterSpacing:1.7}}>ARIZONA PILOT INVITATION</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,56px)',margin:'12px 0 16px'}}>Bring one building problem. Let the record be challenged.</h2>
    <p style={{maxWidth:880,color:'#aebfc7',fontSize:17,lineHeight:1.7}}>No endorsement is required. The useful result may be confirmation, a HOLD, a missing record, a broken continuity chain, an unresolved authority question, or a finding that the proposed method needs to change. The purpose of the pilot is to make that visible before the record is relied upon for a consequential decision.</p>
    <a href="mailto:ta14admissibleexecution@gmail.com?subject=Arizona%20Building-as-Evidence%20Pilot" style={{display:'inline-block',marginTop:18,padding:'15px 20px',borderRadius:12,background:'#70dcff',color:'#021019',textDecoration:'none',fontWeight:900,fontSize:11}}>PROPOSE AN ARIZONA PILOT →</a>
   </section>

   <section style={{marginTop:28,padding:24,borderRadius:18,border:'1px solid rgba(255,255,255,.09)',background:'rgba(2,9,15,.55)',color:'#7f959f',fontSize:12,lineHeight:1.7}}>
    <b style={{color:'#b7c8cf'}}>BOUNDARY / NON-CLAIM.</b> This showroom is a public technical examination surface. It is not legal advice, expert testimony, engineering licensure, industrial-hygiene certification, medical guidance, a claim of Arizona governmental adoption, or a representation that a TA14 record is automatically admissible in court. Licensed and jurisdictionally competent professionals remain controlling where required. The Mason decision discussed here is unpublished and carries the limitations stated by the Arizona Court of Appeals.
   </section>

   <footer style={{padding:'44px 0 70px',marginTop:32,borderTop:'1px solid rgba(255,255,255,.08)',display:'flex',justifyContent:'space-between',gap:14,flexWrap:'wrap',color:'#66818e',fontSize:10}}><div>TA14 AUTHORITY GOVERNANCE INSTITUTION · THE BUILDING AS EVIDENCE — ARIZONA</div><Link href="/showrooms" style={{color:'#70dcff',textDecoration:'none'}}>ALL SHOWROOMS →</Link></footer>
  </div>
 </main>
}