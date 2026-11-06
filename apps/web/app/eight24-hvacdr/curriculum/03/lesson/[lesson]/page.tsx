'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {module03ContentManifest} from '../../../../../../lib/academy/module03-content-manifest';

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
    <div style={{padding:22,border:'1px solid #514426',borderRadius:16,background:'#0b1013',margin:'30px 0'}}><b style={{color:'#efc86c'}}>INTEGRATION PREVIEW — NOT A DELIVERED LESSON</b><p style={{color:'#a9bdc6',lineHeight:1.7}}>The canonical lesson inventory is available. Samantha narration, the full teaching script, interactions, assessments and learner progression are still pending integration. This page does not issue a credential, DDD or authorization to intervene.</p></div>
    {lesson.visual&&<section style={{marginBottom:28}}><h2 style={{fontFamily:'Georgia,serif'}}>Proposed visual reference</h2><p style={{color:'#a9bdc6'}}>This image exists in the repository. Its association with this lesson is provisional and requires instructional approval.</p><div style={{position:'relative',width:'100%',aspectRatio:'3 / 2',background:'#06121a',border:'1px solid #173746',borderRadius:16,overflow:'hidden'}}><Image src={lesson.visual.src} alt={'Proposed teaching reference for '+lesson.title} fill sizes="(max-width: 940px) 100vw, 940px" style={{objectFit:'contain'}}/></div></section>}
    <section style={{padding:24,border:'1px solid #173746',borderRadius:16,background:'#06121a'}}><h2 style={{fontFamily:'Georgia,serif'}}>Expected training evidence</h2><p style={{color:'#a9bdc6'}}>{lesson.evidenceObject}</p><p style={{color:'#a9bdc6',lineHeight:1.7}}>Training evidence is not a field diagnostic determination. The technician gathers physical evidence; the Analyzer alone issues the formal DDD after the complete 14-step baseline is frozen. Refrigerant-system entry remains subject to NIRET and the independent fail-closed Refrigerant Governor.</p></section>
    <div style={{display:'flex',justifyContent:'space-between',gap:16,marginTop:30}}>{Number(number)>1?<Link href={'/eight24-hvacdr/curriculum/03/lesson/'+String(Number(number)-1).padStart(2,'0')} style={{color:'#70dcff'}}>← Previous lesson</Link>:<span/>}{Number(number)<16?<Link href={'/eight24-hvacdr/curriculum/03/lesson/'+String(Number(number)+1).padStart(2,'0')} style={{color:'#70dcff'}}>Next lesson →</Link>:<span/>}</div>
  </div></main>;
}
