'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useState} from 'react';
import Lesson302 from './Lesson302';
import Lesson303 from './Lesson303';
import {module03ContentManifest} from '../../../../../../lib/academy/module03-content-manifest';

const lesson301Narration = [
  'Welcome to Module 03. Air is not an accessory to the cooling system. It is part of the system itself.',
  'The blower, return path, filter, coil, supply path, and occupied space form an interacting air circuit. A cooling complaint cannot be evaluated reliably by examining refrigerant readings in isolation.',
  'Airflow influences heat transfer, coil conditions, moisture removal, and how much conditioned air reaches the occupied space.',
  'A cold supply register is an observation. It does not prove that the required volume of air is moving, that rated sensible capacity is being delivered, or that humidity is being controlled.',
  'A dirty filter or blocked return can be an important observation, but it does not automatically establish the entire cause of a complaint. We must preserve the physical condition and collect measurements in context.',
  'The technician identifies the equipment, traces the air path, observes physical conditions, places suitable instruments, and records authentic evidence.',
  'The technician does not write or change the formal Declared Diagnostic Determination. The Analyzer issues that determination only after the complete fourteen-step baseline is documented and frozen.',
  'Today, your job is to recognize air as a necessary operating condition and to distinguish what you can see from what you still need to measure.',
  'When you leave this lesson, remember: air is part of the system, and evidence comes before intervention.'
];
const lesson301Questions = [
 {question:'A supply register feels cold. What has that established?',options:['The system has verified rated capacity','The air at that location feels cold; delivered airflow and capacity remain unverified','The refrigerant charge is correct'],correct:1,reason:'A localized temperature observation cannot establish airflow or total system performance.'},
 {question:'Which path belongs in the air-system examination?',options:['Return → filter → blower/coil → supply → occupied space','Compressor → condenser → metering device only','Thermostat → invoice → replacement'],correct:0,reason:'The air circuit includes return, treatment and delivery paths; actual equipment order must be verified.'},
 {question:'The homeowner says the upstairs rooms are humid. What should happen first?',options:['Add refrigerant','Replace the blower','Preserve the complaint, establish operating state, and gather temperature, humidity and airflow evidence'],correct:2,reason:'The complaint starts an examination; it is not a supported equipment diagnosis.'}
];
function Lesson301(){
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const [submitted,setSubmitted]=useState(false);
 const score=lesson301Questions.reduce((n,q,i)=>n+(answers[i]===q.correct?1:0),0);
 return <div style={{display:'grid',gap:22,marginBottom:30}}>
   <section style={{padding:24,border:'1px solid #173746',borderRadius:16,background:'#06121a'}}>
     <b style={{color:'#efc86c'}}>BEFORE YOU LISTEN</b>
     <p style={{color:'#a9bdc6',lineHeight:1.8}}>A system may produce cold air at one location without establishing that the required air volume reaches the occupied space. Follow the entire air path, then distinguish observed conditions from verified performance.</p>
   </section>
   <section style={{padding:24,border:'1px solid #173746',borderRadius:16,background:'#06121a'}}>
     <b style={{color:'#efc86c'}}>SAMANTHA · READ-ALONG SCRIPT</b>
     <p style={{color:'#a9bdc6',fontSize:13}}>Text narration only. Recorded audio and synchronized playback are not yet integrated.</p>
     {lesson301Narration.map((p,i)=><p key={i} style={{color:'#d6e7ed',fontSize:17,lineHeight:1.9,margin:'20px 0'}}>{p}</p>)}
   </section>
   <section style={{padding:24,border:'1px solid #173746',borderRadius:16,background:'#06121a'}}>
     <b style={{color:'#efc86c'}}>INDEPENDENT REVIEW · PRACTICE CHECK</b>
     {lesson301Questions.map((q,i)=><fieldset key={i} style={{border:0,borderTop:'1px solid #173746',padding:'22px 0'}}>
       <legend style={{paddingTop:12,fontWeight:800}}>{i+1}. {q.question}</legend>
       {q.options.map((option,j)=><label key={j} style={{display:'flex',gap:12,alignItems:'start',padding:'9px 0',color:'#d6e7ed'}}><input type="radio" name={'module03-q-'+i} checked={answers[i]===j} disabled={submitted} onChange={()=>setAnswers(a=>({...a,[i]:j}))}/>{option}</label>)}
       {submitted&&<p style={{color:answers[i]===q.correct?'#8fe0bf':'#efc86c'}}>{answers[i]===q.correct?'SUPPORTED':'REVIEW REQUIRED'} — {q.reason}</p>}
     </fieldset>)}
     {!submitted?<button disabled={Object.keys(answers).length!==lesson301Questions.length} onClick={()=>setSubmitted(true)} style={{padding:'12px 20px',borderRadius:999,background:'#7BAFD4',color:'#001426',fontWeight:900,cursor:'pointer',opacity:Object.keys(answers).length!==lesson301Questions.length?.5:1}}>CHECK ANSWERS</button>:<div><p style={{fontSize:20,fontWeight:800}}>Practice score: {score} / {lesson301Questions.length}</p><p style={{color:'#a9bdc6'}}>Local practice feedback only. No completion, credential or diagnostic record is saved.</p><button onClick={()=>{setAnswers({});setSubmitted(false)}} style={{padding:'12px 20px',borderRadius:999,background:'#7BAFD4',color:'#001426',fontWeight:900,cursor:'pointer'}}>RETRY</button></div>}
   </section>
   <section style={{padding:24,border:'1px solid #173746',borderRadius:16,background:'#06121a'}}>
     <b style={{color:'#70dcff'}}>WHAT YOU JUST LEARNED</b><p style={{color:'#a9bdc6',lineHeight:1.8}}>Airflow is a required operating condition. A temperature observation, humidity complaint or visible restriction cannot independently establish a complete system diagnosis.</p>
     <b style={{color:'#70dcff'}}>NEXT · LESSON 3.02</b><p style={{color:'#a9bdc6',lineHeight:1.8}}>Trace the return, filtration, blower, coil, supply and occupied-space boundaries before interpreting system performance.</p>
   </section>
 </div>;
}
/** Preview-only lesson shell. No LMS completion or DDD/authorization actions. */
export default function Module03LessonPreview(){
  const params=useParams<{lesson:string}>();
  const number=String(params.lesson||'').padStart(2,'0');
  const lesson=module03ContentManifest.find(item=>item.id==='3.'+number);
  if(!lesson)return <main style={{padding:40,background:'#02070c',minHeight:'100vh',color:'#edf5f8'}}><h1>Lesson not found</h1><Link href="/eight24-hvacdr/curriculum/03">Return to Module 03</Link></main>;
  return <main style={{minHeight:'100vh',background:'#02070c',color:'#edf5f8',fontFamily:'Arial,sans-serif',padding:'32px 20px 80px'}}><div style={{maxWidth:940,margin:'auto'}}>
    <Link href="/eight24-hvacdr/curriculum/03" style={{color:'#70dcff'}}>← Module 03 curriculum</Link>
    <p style={{color:'#efc86c',fontSize:12,fontWeight:900,letterSpacing:2,marginTop:55}}>TA-14 ACADEMY × EIGHT24 · LESSON {lesson.id} · CONTENT PREVIEW</p>
    <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(36px,6vw,64px)',lineHeight:1.08}}>{lesson.title}</h1>
    <p style={{color:'#a9bdc6'}}>{lesson.minutes} minutes · {lesson.delivery}</p>
    <div style={{padding:22,border:'1px solid #514426',borderRadius:16,background:'#0b1013',margin:'30px 0'}}><b style={{color:'#efc86c'}}>INTEGRATION PREVIEW — NOT A DELIVERED LESSON</b><p style={{color:'#a9bdc6',lineHeight:1.7}}>The canonical lesson inventory is available. Lessons 3.01, 3.02 and 3.03 now include written teaching and local practice checks. Recorded narration and saved learner progression are still pending. Other lessons remain inventory previews. This page does not issue a credential, DDD or authorization to intervene.</p></div>
    {lesson.id==='3.01'&&<Lesson301/>}
    {lesson.id==='3.02'&&<Lesson302/>}
    {lesson.id==='3.03'&&<Lesson303/>}
    {lesson.visual&&<section style={{marginBottom:28}}><h2 style={{fontFamily:'Georgia,serif'}}>Proposed visual reference</h2><p style={{color:'#a9bdc6'}}>This image exists in the repository. Its association with this lesson is provisional and requires instructional approval.</p><div style={{position:'relative',width:'100%',aspectRatio:'3 / 2',background:'#06121a',border:'1px solid #173746',borderRadius:16,overflow:'hidden'}}><Image src={lesson.visual.src} alt={'Proposed teaching reference for '+lesson.title} fill sizes="(max-width: 940px) 100vw, 940px" style={{objectFit:'contain'}}/></div></section>}
    <section style={{padding:24,border:'1px solid #173746',borderRadius:16,background:'#06121a'}}><h2 style={{fontFamily:'Georgia,serif'}}>Expected training evidence</h2><p style={{color:'#a9bdc6'}}>{lesson.evidenceObject}</p><p style={{color:'#a9bdc6',lineHeight:1.7}}>Training evidence is not a field diagnostic determination. The technician gathers physical evidence; the Analyzer alone issues the formal DDD after the complete 14-step baseline is frozen. Refrigerant-system entry remains subject to NIRET and the independent fail-closed Refrigerant Governor.</p></section>
    <div style={{display:'flex',justifyContent:'space-between',gap:16,marginTop:30}}>{Number(number)>1?<Link href={'/eight24-hvacdr/curriculum/03/lesson/'+String(Number(number)-1).padStart(2,'0')} style={{color:'#70dcff'}}>← Previous lesson</Link>:<span/>}{Number(number)<16?<Link href={'/eight24-hvacdr/curriculum/03/lesson/'+String(Number(number)+1).padStart(2,'0')} style={{color:'#70dcff'}}>Next lesson →</Link>:<span/>}</div>
  </div></main>;
}
