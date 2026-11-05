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
const subjectCases:Record<string,Case[]> = {
 'smart-city':[
  {title:'Critical building in a curtailment zone',prompt:'A city optimizer proposes reducing cooling across municipal buildings, but the target building is an emergency shelter and its protected operating constraints have not been examined. What is supported?',answer:'HOLD',reason:'A blanket optimization cannot bypass facility-specific evidence, occupancy risk, or binding operational constraints.'},
  {title:'Utility request outside municipal authority',prompt:'A utility requests a remote change to a city asset, but no applicable delegation authorizes the utility to commit that change. What is supported?',answer:'DENY',reason:'A request or technical capability does not establish applicable authority to act on the municipal asset.'},
  {title:'Emergency override requires designated review',prompt:'The proposed municipal override triggers a documented emergency approval requirement that the initiating actor cannot satisfy. What is supported?',answer:'ESCALATE',reason:'Refer the matter to the designated emergency authority; escalation is not an execution permit.'}
 ],
 'school':[
  {title:'Classroom ventilation versus outdoor particles',prompt:'A controller recommends increasing outdoor air based on indoor CO₂, but outdoor particulate conditions have materially changed since the recommendation. No new binding assessment exists. What is supported?',answer:'HOLD',reason:'Changed environmental conditions require fresh examination of the evidence, filtration, exposure, and applicable constraints.'},
  {title:'Unverified school operator',prompt:'The evidence is complete, but the individual attempting to issue a district-wide building command has no established standing in that capacity. What is supported?',answer:'HOLD',reason:'Actor identity and standing basis must be established independently of technical evidence and general organizational authority.'},
  {title:'District-level safety exception',prompt:'A proposed school intervention triggers a district safety approval that the site operator cannot issue. What is supported?',answer:'ESCALATE',reason:'The designated district authority must resolve the exception before the consequence can be committed.'}
 ],
 'hvac':[
  {title:'Incomplete fourteen-step baseline',prompt:'A technician proposes refrigerant adjustment before the required HVAC baseline is complete and frozen, and before the system-issued DDD. What is supported?',answer:'HOLD',reason:'The technician gathers evidence; a bounded system determination and applicable entry gate must precede any justified intervention.'},
  {title:'Unauthorized refrigerant entry',prompt:'A refrigerant intervention is proposed despite a failed non-invasive entry threshold and no authorization from the independent Refrigerant Governor. What is supported?',answer:'DENY',reason:'The fail-closed governor must prevent unauthorized refrigerant-system entry.'},
  {title:'Unresolved safety condition',prompt:'The analyzer flags a condition that requires an appropriately authorized specialist before intervention. What is supported?',answer:'ESCALATE',reason:'Preserve the evidence and route the matter to the actor with applicable authority and standing.'}
 ],
 'radon':[
  {title:'Mitigation installed, verification missing',prompt:'A mitigation system was installed, but post-intervention radon measurements and record continuity have not been established. May the outcome be declared verified?',answer:'HOLD',reason:'Installation is an intervention, not proof of a verified exposure outcome.'},
  {title:'Claim beyond assessment scope',prompt:'An actor claims regulatory clearance from a measurement protocol that does not authorize that conclusion. What is supported?',answer:'DENY',reason:'An assessment cannot be extended beyond its applicable authority and declared scope.'},
  {title:'Specialized remediation decision',prompt:'A documented condition requires an independently authorized remediation determination before further work. What is supported?',answer:'ESCALATE',reason:'Route the condition to the designated authority without treating referral as approval.'}
 ],
 'energy':[
  {title:'Savings with unexamined occupant exposure',prompt:'An optimizer projects lower energy use by reducing ventilation, but occupant exposure and environmental consequences have not been assessed. What is supported?',answer:'HOLD',reason:'Energy performance does not establish environmental acceptability or authorization.'},
  {title:'Out-of-scope demand response',prompt:'A demand-response actor attempts to override a building safety constraint without delegated authority. What is supported?',answer:'DENY',reason:'Energy objectives do not override applicable authority boundaries.'},
  {title:'Competing energy and safety mandates',prompt:'A documented conflict requires a designated building authority to reconcile two binding requirements. What is supported?',answer:'ESCALATE',reason:'Preserve the conflict and refer it to the actor authorized to resolve it.'}
 ],
 'laboratory':[
  {title:'Laboratory result without field continuity',prompt:'A technology performed well in a laboratory, but site-specific exposure conditions and field evidence have not been examined. May deployment be authorized on that result alone?',answer:'HOLD',reason:'Laboratory efficacy is not itself sufficient evidence for a particular field consequence.'},
  {title:'Unapproved deployment claim',prompt:'A vendor attempts to deploy outside the scope of its site authorization based on a successful demonstration. What is supported?',answer:'DENY',reason:'Demonstration success cannot expand applicable authority.'},
  {title:'Required institutional approval',prompt:'Field use requires a separate institutional safety review that has not yet been completed. What is supported?',answer:'ESCALATE',reason:'The required reviewing authority must determine whether the bounded deployment may proceed.'}
 ]
};
function casesFor(slug:string,subject:string):Case[]{
 const key=Object.keys(subjectCases).find(k=>slug.includes(k));
 if(key)return subjectCases[key];
 return base.map((c,i)=>({...c,prompt:i===0?c.prompt+' Consider this in the context of '+subject+'.':c.prompt}));
}
const excluded=['bruno-tudal','john-kay','anto-budiardjo','eight24-solutions','founding-institutional-sponsorship','environmental-atmospheric','prediction-is-not-permission'];
function topicFor(path:string){const slug=path.split('/').filter(Boolean).slice(1).join('/');const key=Object.keys(topics).find(k=>slug.includes(k));return key?topics[key]:'the proposed operational consequence';}
export default function ShowroomReviewChallenge(){
 const path=usePathname()||'';
 const slug=path.split('/').filter(Boolean).slice(1).join('/');
 const [answers,setAnswers]=useState<Record<number,string>>({});
 const [reveal,setReveal]=useState(false);
 if(!slug||slug==='maria-neira-air-health-humanity'||excluded.some(x=>slug.startsWith(x)))return null;
 const subject=topicFor(path);
 const cases=casesFor(slug,subject);
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
