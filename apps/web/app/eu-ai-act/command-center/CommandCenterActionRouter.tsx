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
function cleanRecordText(value:string){
  return normalize(value)
    .replace(/([A-Z]\d{1,3}-\d{3})(?=[A-Z])/g,'$1 · ')
    .replace(/(Article\s+\d+[a-z]?)(?=[A-Z])/gi,'$1 · ')
    .replace(/(EVIDENCE GAP|STALE|REVIEW REQUIRED)(?=[A-Z])/g,'$1 · ')
    .replace(/(SUPPORTED|PARTIAL|CONDITIONAL|CURRENT)(?=[A-Z])/g,'$1 · ');
}
function isConversational(q:string){
  return /^(hi|hello|hey|good\s+(morning|afternoon|evening)|how('?s| is)\s+(your|it)|how are you|what('?s| is) up|thanks|thank you|who are you|what are you)[\s,.!?]*$/i.test(q.trim());
}
function conversationalAnswer(question:string){
  const q=question.toLowerCase();
  if(/thank/.test(q)) return 'You’re welcome. I’m here and ready to examine the governed record whenever you are.';
  if(/who are you|what are you/.test(q)) return 'I’m Atlas, the governed examiner in this Command Center. I can talk with you normally, and when you ask about this system I can examine the governed record while keeping assistance separate from the formal determination.';
  if(/how/.test(q)) return 'Doing well and ready to work with you. You can talk with me normally, or ask me about the active System Passport, Article 50, evidence gaps, oversight, source changes, or revalidation.';
  return 'Hello. I’m here. You can talk with me normally, or ask me to examine something in the governed record.';
}
function governedAnswer(question:string){
  if(isConversational(question)) return conversationalAnswer(question);
  const active=firstText('.passports>button.active h3')||firstText('.focus h2')||'the active system';
  const state=firstText('.focus .head i')||'UNRESOLVED';
  const gaps=collect('.ledger article').filter(x=>/EVIDENCE GAP|STALE|REVIEW REQUIRED/.test(x)).map(cleanRecordText);
  const changes=collect('.changes article').map(cleanRecordText);
  const q=question.toLowerCase();
  let focus=gaps;
  if(q.includes('article 50')||q.includes('transparency')) focus=gaps.filter(x=>x.includes('Article 50')||x.includes('A50'));
  if(q.includes('change')||q.includes('revalid')) focus=changes;
  if(q.includes('oversight')) focus=gaps.filter(x=>x.includes('Article 14')||x.includes('oversight'));
  const top=focus.slice(0,3);
  const lead=`For ${active}, the current governed state shown here is ${state}.`;
  if(!top.length) return `${lead} I do not see a matching unresolved item in the currently rendered Command Center record. That does not establish compliance; it means this view does not presently expose a matching gap. Open the relevant obligation or source record before relying on the conclusion.`;
  return `${lead}\n\nRecorded pressure points:\n${top.map((item,index)=>`${index+1}. ${item}`).join('\n')}\n\nAtlas is reading the Command Center record only. This response assists review and does not replace the governed determination.`;
}

function AtlasPrompt(){
 const[question,setQuestion]=useState('');const[answer,setAnswer]=useState('');
 const placeholder=useMemo(()=> 'Talk with Atlas or ask about Article 50, evidence gaps, revalidation, oversight, source changes, or the active System Passport…',[]);
 function submit(e:React.FormEvent){e.preventDefault();const q=question.trim();if(!q)return;setAnswer(governedAnswer(q))}
 return <div style={{width:'100%'}} data-atlas-command-center="interactive">
  <form onSubmit={submit} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:10}}>
   <input aria-label="Ask Atlas" value={question} onChange={e=>setQuestion(e.target.value)} placeholder={placeholder} style={{minWidth:0,padding:'15px 16px',border:'1px solid #37617a',background:'#030a11',color:'#eef7ff',fontSize:14,outline:'none'}}/>
   <button type="submit" disabled={!question.trim()} style={{padding:'12px 16px',border:'1px solid #5fdcf7',background:question.trim()?'#0a2634':'#07131d',color:'#bcecff',fontSize:9,fontWeight:900,cursor:question.trim()?'pointer':'not-allowed'}}>ASK ATLAS →</button>
  </form>
  <div style={{marginTop:8,color:'#6f8ea2',fontSize:9}}>Talk with Atlas normally, or ask Atlas to examine the governed record visible in this Command Center.</div>
  {answer&&<div role="status" style={{marginTop:14,padding:'15px 16px',border:'1px solid #28536b',background:'#06131e',color:'#cfe7f2',fontSize:12,lineHeight:1.65,whiteSpace:'pre-line'}}><b style={{display:'block',marginBottom:7,color:'#70e2f8',fontSize:9,letterSpacing:'.12em'}}>ATLAS · GOVERNED RESPONSE</b>{answer}</div>}
 </div>
}

export default function CommandCenterActionRouter(){
  const router=useRouter();const[target,setTarget]=useState<HTMLElement|null>(null);
  useEffect(()=>{
    const mountPrompt=()=>{
      const prompt=document.querySelector('.prompt') as HTMLElement|null;
      if(prompt){prompt.textContent='';setTarget(prompt);return true}
      return false;
    };
    if(!mountPrompt()){
      const observer=new MutationObserver(()=>{if(mountPrompt())observer.disconnect()});
      observer.observe(document.body,{childList:true,subtree:true});
      const timeout=window.setTimeout(()=>observer.disconnect(),5000);
      return()=>{window.clearTimeout(timeout);observer.disconnect()};
    }
  },[]);
  useEffect(()=>{
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
