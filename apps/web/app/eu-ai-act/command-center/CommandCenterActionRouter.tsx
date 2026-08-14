'use client';

import {useEffect,useMemo,useState} from 'react';
import {useRouter} from 'next/navigation';
import {createPortal} from 'react-dom';

const routes:Record<string,string>={
  'OPEN CHANGE IMPACT →':'/eu-ai-act/revalidation-engine',
  'OPEN EVIDENCE ROUTE →':'/eu-ai-act/article-50',
  'OPEN CLASSIFICATION →':'/eu-ai-act/classifier',
  'OPEN OVERSIGHT →':'/eu-ai-act/obligation-engine?focus=A14-002',
  'OPEN SOURCE IMPACT →':'/eu-ai-act/revalidation-engine?change=source-delta',
  'OPEN IMPACT GRAPH →':'/eu-ai-act/revalidation-engine',
  'EXAMINER ROOMS · NEXT RELEASE':'/eu-ai-act/institution',
};

function normalize(value:string){return value.replace(/\s+/g,' ').trim()}
function firstText(selector:string){return normalize(document.querySelector(selector)?.textContent??'')}
function collect(selector:string){return Array.from(document.querySelectorAll(selector)).map(el=>normalize(el.textContent??'')).filter(Boolean)}

function governedAnswer(question:string){
  const active=firstText('.passports>button.active h3')||firstText('.focus h2')||'the active system';
  const state=firstText('.focus .head i')||'UNRESOLVED';
  const gaps=collect('.ledger article').filter(x=>/EVIDENCE GAP|STALE|REVIEW REQUIRED/.test(x));
  const changes=collect('.changes article');
  const q=question.toLowerCase();
  let focus=gaps;
  if(q.includes('article 50')||q.includes('transparency')) focus=gaps.filter(x=>x.includes('Article 50')||x.includes('A50'));
  if(q.includes('change')||q.includes('revalid')) focus=changes;
  if(q.includes('oversight')) focus=gaps.filter(x=>x.includes('Article 14')||x.includes('oversight'));
  const top=focus.slice(0,3);
  const lead=`For ${active}, the current governed state shown here is ${state}.`;
  if(!top.length) return `${lead} I do not see a matching unresolved item in the currently rendered Command Center record. That does not establish compliance; it only means this view does not presently expose a matching gap. Open the relevant obligation or source record before relying on the conclusion.`;
  return `${lead} Before relying on this route, resolve these recorded pressure points: ${top.join(' | ')}. Atlas is reading the Command Center record only; this response assists review and does not replace the governed determination.`;
}

function AtlasPrompt(){
 const[question,setQuestion]=useState('');const[answer,setAnswer]=useState('');
 const placeholder=useMemo(()=> 'Ask about Article 50, evidence gaps, revalidation, oversight, source changes, or the active System Passport…',[]);
 function submit(e:React.FormEvent){e.preventDefault();const q=question.trim();if(!q)return;setAnswer(governedAnswer(q))}
 return <div style={{width:'100%'}}>
  <form onSubmit={submit} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:10}}>
   <input aria-label="Ask Atlas about the governed record" value={question} onChange={e=>setQuestion(e.target.value)} placeholder={placeholder} style={{minWidth:0,padding:'15px 16px',border:'1px solid #37617a',background:'#030a11',color:'#eef7ff',fontSize:14,outline:'none'}}/>
   <button type="submit" disabled={!question.trim()} style={{padding:'12px 16px',border:'1px solid #5fdcf7',background:question.trim()?'#0a2634':'#07131d',color:'#bcecff',fontSize:9,fontWeight:900,cursor:question.trim()?'pointer':'not-allowed'}}>ASK ATLAS →</button>
  </form>
  <div style={{marginTop:8,color:'#6f8ea2',fontSize:9}}>Atlas stays inside this Command Center and reasons only over the governed record visible here.</div>
  {answer&&<div role="status" style={{marginTop:14,padding:'15px 16px',border:'1px solid #28536b',background:'#06131e',color:'#cfe7f2',fontSize:12,lineHeight:1.65}}><b style={{display:'block',marginBottom:7,color:'#70e2f8',fontSize:9,letterSpacing:'.12em'}}>ATLAS · GOVERNED RECORD RESPONSE</b>{answer}</div>}
 </div>
}

export default function CommandCenterActionRouter(){
  const router=useRouter();const[target,setTarget]=useState<HTMLElement|null>(null);
  useEffect(()=>{
    const prompt=document.querySelector('.prompt') as HTMLElement|null;
    if(prompt){prompt.textContent='';setTarget(prompt)}
    const handler=(event:MouseEvent)=>{
      const targetEl=event.target as HTMLElement|null;
      const button=targetEl?.closest('button');
      if(!button)return;
      const href=routes[normalize(button.textContent??'')];
      if(!href)return;
      event.preventDefault();event.stopPropagation();router.push(href);
    };
    document.addEventListener('click',handler,true);
    return()=>document.removeEventListener('click',handler,true);
  },[router]);
  return target?createPortal(<AtlasPrompt/>,target):null;
}
