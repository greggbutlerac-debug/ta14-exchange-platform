'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

type Case = {title:string;prompt:string;answer:'ALLOW'|'HOLD'|'DENY'|'ESCALATE';reason:string};
const base:Case[]=[
 {title:'Evidence is not yet admissible',prompt:'A proposed consequence is supported by an observation, but the source attribution or record continuity is missing. What should happen before execution?',answer:'HOLD',reason:'Preserve the observation and obtain the missing admissibility basis. A measurement or assertion alone does not authorize execution.'},
 {title:'The actor exceeds authority',prompt:'The record is current and reliable, but the proposed consequence falls outside the scope of applicable authority. What is the supported determination?',answer:'DENY',reason:'Sufficient evidence cannot manufacture applicable authority. The specific unauthorized consequence must not proceed.'},
 {title:'A higher authority is required',prompt:'The proposed consequence triggers a documented requirement for review by another designated authority. What is the appropriate route?',answer:'ESCALATE',reason:'Route the matter to the required authority and preserve the unresolved decision; escalation is not permission to execute.'}
];
const topics:Record<string,string>={
 'smart-city':'municipal infrastructure','school':'school air and building operations','hvac':'HVAC intervention','filter':'filtration and indoor air','radon':'radon mitigation','energy':'energy and environmental outcomes','municipal':'municipal environmental action','predictive':'predictive recommendations','ai-':'AI-initiated consequences','building':'building operations','semiconductor':'semiconductor facility operations','air':'air-quality intervention','environmental':'environmental accountability','laboratory':'laboratory-to-field deployment','water':'water system intervention','traffic':'transportation operations','payment':'financial execution','refrigerant':'refrigerant-system intervention'
};
const excluded=['bruno-tudal','john-kay','anto-budiardjo','eight24-solutions','founding-institutional-sponsorship','environmental-atmospheric','prediction-is-not-permission'];
function topicFor(path:string){const slug=path.split('/').filter(Boolean).slice(1).join('/');const key=Object.keys(topics).find(k=>slug.includes(k));return key?topics[key]:'the proposed operational consequence';}
export default function ShowroomReviewChallenge(){
 const path=usePathname()||'';
 const slug=path.split('/').filter(Boolean).slice(1).join('/');
 const [answers,setAnswers]=useState<Record<number,string>>({});
 const [reveal,setReveal]=useState(false);
 if(!slug||excluded.some(x=>slug.startsWith(x)))return null;
 const subject=topicFor(path);
 const cases=base.map((c,i)=>({...c,prompt:i===0?c.prompt+' Consider this in the context of '+subject+'.':c.prompt}));
 const complete=cases.every((_,i)=>!!answers[i]);
 const score=cases.filter((c,i)=>answers[i]===c.answer).length;
 return <section id="independent-review-challenge" aria-labelledby="review-challenge-title" style={{background:'#061d2a',color:'#eef7fa',padding:'64px max(20px,calc((100vw - 1080px)/2))',borderTop:'2px solid #cda95a'}}>
  <div style={{maxWidth:1080,margin:'0 auto'}}>
   <p style={{fontSize:12,fontWeight:900,letterSpacing:'.14em',color:'#f0c875'}}>TA-14 ACADEMY · INDEPENDENT REVIEW CHALLENGE</p>
   <h2 id="review-challenge-title" style={{fontSize:'clamp(27px,4vw,43px)',margin:'10px 0'}}>Can you defend the determination?</h2>
   <p style={{color:'#c1d4dc',lineHeight:1.7,maxWidth:800}}>Apply the governance principles to three hypothetical cases relevant to {subject}. Choose a determination, then examine the reasoning. These cases teach the distinction between Admissible Evidence, Applicable Authority, and Established Standing; they do not issue real-world authorization.</p>
   <div style={{display:'grid',gap:15,marginTop:24}}>
    {cases.map((c,i)=><article key={c.title} style={{border:'1px solid #385e70',background:'#0b2938',borderRadius:14,padding:22}}>
      <p style={{color:'#f0c875',fontSize:12,fontWeight:900,margin:'0 0 6px'}}>CASE {String(i+1).padStart(2,'0')}</p>
      <h3 style={{fontSize:21,margin:'0 0 10px'}}>{c.title}</h3>
      <p style={{color:'#d3e2e9',lineHeight:1.65}}>{c.prompt}</p>
      <div role="group" aria-label={'Choose a determination for case '+(i+1)} style={{display:'flex',gap:9,flexWrap:'wrap'}}>
       {(['ALLOW','HOLD','DENY','ESCALATE'] as const).map(a=><button key={a} type="button" aria-pressed={answers[i]===a} onClick={()=>{setAnswers(x=>({...x,[i]:a}));setReveal(false)}} style={{border:'1px solid #7293a2',borderRadius:8,padding:'10px 15px',fontWeight:800,cursor:'pointer',background:answers[i]===a?'#f0c875':'#123749',color:answers[i]===a?'#061d2a':'#eef7fa'}}>{a}</button>)}
      </div>
      {reveal&&<div style={{borderLeft:'3px solid #f0c875',background:'#123748',padding:15,marginTop:16,lineHeight:1.65}}><strong>{answers[i]===c.answer?'SUPPORTED':'RE-EXAMINE'} · {c.answer}</strong><p style={{marginBottom:0}}>{c.reason}</p></div>}
     </article>)}
   </div>
   <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:22}}>
    <button type="button" disabled={!complete} onClick={()=>setReveal(true)} style={{border:0,borderRadius:9,padding:'13px 19px',background:complete?'#f0c875':'#7b8b92',color:'#061d2a',fontWeight:900,cursor:complete?'pointer':'not-allowed'}}>REVEAL THE EXAMINATION</button>
    <button type="button" onClick={()=>{setAnswers({});setReveal(false)}} style={{border:'1px solid #7a9aa9',borderRadius:9,padding:'13px 19px',background:'transparent',color:'#eef7fa',fontWeight:900,cursor:'pointer'}}>RESET CHALLENGE</button>
   </div>
   {reveal&&<p aria-live="polite" style={{fontWeight:800,marginTop:16}}>Supported determinations: {score} of {cases.length}. The reasoning matters more than the score.</p>}
   <p style={{fontSize:12,color:'#9eb8c4',lineHeight:1.7,marginTop:22}}>Independent educational examples only. The questions are hypothetical and do not assess a real institution, building, person, or operating system. Actual governance determinations require case-specific evidence, applicable authority, established standing, and bounded review.</p>
  </div>
 </section>;
}
