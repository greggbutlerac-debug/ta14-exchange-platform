'use client';

import {useState} from 'react';

export type GuidedStep={
  label:string;
  title:string;
  plain:string;
  why?:string;
  result?:string;
};

export default function GuidedShowroom({
  eyebrow='GUIDED SHOWROOM',
  title='Understand this in 60 seconds.',
  intro,
  steps,
  accent='#79d8ff',
  gold='#f1cb73',
}:{
  eyebrow?:string;
  title?:string;
  intro:string;
  steps:GuidedStep[];
  accent?:string;
  gold?:string;
}){
  const [active,setActive]=useState(0);
  const [started,setStarted]=useState(false);
  const step=steps[active];
  const next=()=>{setStarted(true);setActive(v=>Math.min(steps.length-1,v+1))};
  const reset=()=>{setStarted(false);setActive(0)};
  return <section style={{padding:30,border:'1px solid '+accent+'55',borderRadius:22,background:'linear-gradient(135deg,'+accent+'18,rgba(4,15,25,.94))',boxShadow:'0 24px 70px rgba(0,0,0,.28)',margin:'30px 0 64px'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.18em',color:accent}}>{eyebrow}</div>
    <h2 style={{fontSize:'clamp(30px,4vw,48px)',lineHeight:1.03,letterSpacing:'-.035em',margin:'10px 0 12px'}}>{title}</h2>
    <p style={{maxWidth:900,color:'#a9bdcc',lineHeight:1.72,fontSize:15}}>{intro}</p>
    {!started?<button onClick={()=>setStarted(true)} style={{cursor:'pointer',marginTop:8,padding:'13px 16px',borderRadius:9,border:'1px solid '+accent,background:accent,color:'#03101c',fontWeight:950,fontSize:10}}>START GUIDED TOUR →</button>:null}
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(155px,1fr))',gap:8,marginTop:24}}>
      {steps.map((s,i)=><button key={s.label} onClick={()=>{setStarted(true);setActive(i)}} style={{cursor:'pointer',padding:'15px 13px',borderRadius:10,textAlign:'left',border:i===active?'1px solid '+accent:'1px solid #28445e',background:i===active?accent+'1f':'#061522',color:i===active?'#fff':'#a9bdcc',fontWeight:900}}>
        <small style={{display:'block',color:i===active?accent:'#6e879b',marginBottom:6}}>{s.label}</small>{s.title}
      </button>)}
    </div>
    {started?<div style={{marginTop:12,padding:22,border:'1px solid #315778',borderRadius:14,background:'#030b13'}}>
      <small style={{color:accent,fontWeight:950}}>{step.label}</small>
      <h3 style={{fontSize:24,margin:'8px 0',color:'#fff'}}>{step.title}</h3>
      <p style={{fontSize:15,lineHeight:1.7,color:'#bfd0df'}}>{step.plain}</p>
      {step.why?<div style={{padding:13,borderLeft:'3px solid '+gold,background:gold+'10',color:'#d3c49e',fontSize:12,lineHeight:1.6}}><b>WHY IT MATTERS:</b> {step.why}</div>:null}
      {step.result?<div style={{marginTop:10,padding:12,border:'1px dashed '+accent,borderRadius:9,color:accent,fontWeight:900,fontSize:11}}>{step.result}</div>:null}
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:16}}>
        <button onClick={()=>setActive(v=>Math.max(0,v-1))} disabled={active===0} style={{cursor:active===0?'default':'pointer',opacity:active===0?.45:1,padding:'10px 13px',borderRadius:8,border:'1px solid #3b5870',background:'transparent',color:'#dce9f4',fontWeight:900}}>← PREVIOUS</button>
        <button onClick={next} disabled={active===steps.length-1} style={{cursor:active===steps.length-1?'default':'pointer',opacity:active===steps.length-1?.45:1,padding:'10px 13px',borderRadius:8,border:'1px solid '+accent,background:accent,color:'#03101c',fontWeight:950}}>NEXT →</button>
        <button onClick={reset} style={{cursor:'pointer',padding:'10px 13px',borderRadius:8,border:'1px solid #3b5870',background:'transparent',color:'#9fb4c5',fontWeight:900}}>RESET</button>
      </div>
    </div>:null}
  </section>
}
