'use client';
import {useState} from 'react';
const options=['ALLOW','HOLD','DENY','ESCALATE'] as const;
const requirements=[
 {title:'Admissible evidence',detail:'Raw observation, instrument context, provenance, uncertainty and relevance are documented.'},
 {title:'Applicable authority',detail:'The specific local legal or institutional decision power is documented.'},
 {title:'Established standing',detail:'The person or entity making this decision has documented standing.'},
 {title:'Bounded execution scope',detail:'Action, responsible actor, conditions, duration and verification are specified.'}
];
export default function KarongaDecision(){
 const [checks,setChecks]=useState([false,false,false,false]);
 const [choice,setChoice]=useState<string|null>(null);
 const ready=checks.every(Boolean),count=checks.filter(Boolean).length;
 const status=ready?'REVIEW ELIGIBLE — all four illustrative prerequisites are marked established. This does not issue permission.':'HOLD — '+(4-count)+' of four prerequisites remain unestablished. No execution.';
 return <section style={{padding:'40px 0',borderTop:'1px solid #244050'}} aria-labelledby="karonga-heading">
 <p style={{color:'#efc56b',fontWeight:900,letterSpacing:1}}>ILLUSTRATIVE PRACTITIONER PRESSURE TEST</p>
 <h2 id="karonga-heading" style={{fontFamily:'Georgia,serif',fontSize:'clamp(30px,4vw,44px)',marginBottom:12}}>The Karonga decision</h2>
 <p style={{lineHeight:1.75,maxWidth:850}}>Hypothetical scenario: a district team proposes a bounded school air-quality intervention after reported PM2.5 concerns. No actual Malawi measurement, authorization, or government decision is represented.</p>
 <h3 style={{fontSize:22,marginTop:32}}>1. Examine the four prerequisites</h3>
 <p style={{color:'#b8ced9'}}>Check only what the hypothetical record actually establishes. All four start unestablished.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,320px),1fr))',gap:14}}>
 {requirements.map((item,i)=><label key={item.title} style={{display:'flex',gap:14,alignItems:'flex-start',padding:20,background:'#0a2335',border:'1px solid '+(checks[i]?'#6aa7ae':'#365668'),borderRadius:12,cursor:'pointer',minHeight:128}}>
 <input type="checkbox" aria-label={item.title} checked={checks[i]} onChange={e=>{setChecks(old=>old.map((v,j)=>i===j?e.target.checked:v));setChoice(null)}} style={{width:22,height:22,marginTop:3,flexShrink:0,accentColor:'#70c8bd'}}/>
 <span style={{display:'block'}}><strong style={{display:'block',fontSize:17,marginBottom:9}}>{i+1}. {item.title}</strong><span style={{color:'#bed1dc',lineHeight:1.65}}>{item.detail}</span></span>
 </label>)}
 </div>
 <div role="status" aria-live="polite" style={{marginTop:22,padding:22,border:'2px solid '+(ready?'#6aa7ae':'#d1a45a'),borderRadius:12,background:'#091e2c'}}>
 <strong style={{display:'block',color:ready?'#9de0d4':'#f3cc81',fontSize:20,marginBottom:8}}>{status}</strong>
 <span style={{color:'#c6d8e1'}}>{count} / 4 prerequisites marked established. Marking a box represents a hypothetical assertion, not independent verification.</span>
 </div>
 <h3 style={{fontSize:22,marginTop:34}}>2. Examine a proposed disposition</h3>
 <p style={{color:'#bed1dc'}}>Choose an option to see what its justification would require. Selection does not authorize action.</p>
 <div role="group" aria-label="Proposed disposition" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(125px,1fr))',gap:12}}>
 {options.map(option=><button key={option} type="button" aria-pressed={choice===option} onClick={()=>setChoice(option)} style={{cursor:'pointer',border:'2px solid '+(choice===option?'#efc56b':'#54768b'),borderRadius:10,padding:'17px 12px',fontWeight:800,fontSize:15,color:'#fff',background:choice===option?'#245a73':'#0a2335'}}>{option}</button>)}
 </div>
 {choice&&<div role="status" aria-live="polite" style={{padding:22,background:'#0a2335',border:'1px solid #496477',borderRadius:12,lineHeight:1.75,marginTop:16}}><strong style={{color:'#efc56b'}}>{choice}</strong> — {choice==='ALLOW'?(ready?'All four illustrative prerequisites are marked established. Any actual authorization still requires a competent local actor, validation and a preserved decision record.':'NOT SUPPORTED. An ALLOW disposition cannot be justified while one or more prerequisites remain unestablished.'):choice==='HOLD'?'Pause the proposed action pending missing evidence, authority, standing or scope. A HOLD is not proof of a violation.':choice==='DENY'?'DENY requires an affirmative, documented basis to refuse, not merely missing information.':'ESCALATE unresolved jurisdiction, authority or high-consequence questions to a competent body and preserve the referral.'}</div>}
 <p style={{fontSize:13,color:'#a9beca',marginTop:22}}>Independent educational simulation only. These checkboxes do not verify real-world facts, and no choice grants legal or institutional permission to act.</p>
 </section>;
}
