'use client';

import { useState } from 'react';

const states = [
  {label:'Registered baseline', result:'REGISTERED · FROZEN EVIDENCE OBJECT', detail:'ERA v1.0 has an attributable registered identity and preserved evidence object. Registration is not a TA-14 finding, certification, or execution authority.'},
  {label:'Capability available', result:'HOLD · AUTHORITY NOT YET ESTABLISHED', detail:'Technical capability does not establish standing to create consequence. Authority, human standing, scope, and present-state conditions remain separate questions.'},
  {label:'Conditions established', result:'PERMIT · WITHIN DECLARED CLAIM SURFACE', detail:'The registered ERA claim surface says execution may be permitted when constituted governance conditions are established. This is an explanatory replay of the claim, not an independent TA-14 PASS.'},
  {label:'Material state change', result:'WITHHOLD · REASSESS PRESENT STANDING', detail:'A previously valid permission does not automatically establish present authority after a materially relevant change. Present standing must be reassessed.'},
  {label:'Required condition fails', result:'REFUSE · CONDITION NOT SATISFIED', detail:'ERA claims it can refuse consequential execution when required governing conditions are not satisfied. The historical record remains preserved.'},
  {label:'Uncertainty remains', result:'ESCALATE · UNCERTAINTY PRESERVED', detail:'Uncertainty remains admissible. It is not silently converted into permission; unresolved standing can be escalated rather than inferred.'},
  {label:'Outside governed path', result:'BOUNDARY · CONSEQUENCE NOT ESTABLISHED', detail:'ERA does not claim prevention of irreversible consequences outside its governed execution path. External execution remains outside this registered claim surface.'},
];

export default function ERARecordedExamination(){
  const [index,setIndex]=useState(0);
  const state=states[index];
  return <section style={{marginTop:34,padding:'30px clamp(22px,4vw,40px)',border:'1px solid rgba(114,240,201,.22)',borderRadius:22,background:'linear-gradient(135deg,rgba(18,67,58,.23),rgba(8,15,29,.84))'}}>
    <div style={{color:'#72f0c9',fontWeight:950,fontSize:11,letterSpacing:'.15em'}}>RECORDED EXAMINATION PLAYER · REGISTERED CLAIM SURFACE</div>
    <h2 style={{fontSize:'clamp(30px,4vw,46px)',margin:'12px 0 10px',letterSpacing:'-.035em'}}>Change the condition. Preserve the boundary.</h2>
    <p style={{color:'#aebdce',lineHeight:1.7,maxWidth:900}}>Replay bounded conditions against the registered ERA v1.0 claim surface. The player explains what the architecture claims should happen; it does not manufacture a TA-14 finding.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:9,marginTop:22}}>
      {states.map((x,i)=><button key={x.label} type="button" onClick={()=>setIndex(i)} style={{textAlign:'left',padding:'14px 15px',borderRadius:11,cursor:'pointer',fontFamily:'inherit',fontWeight:850,border:i===index?'1px solid rgba(114,240,201,.75)':'1px solid rgba(158,140,255,.18)',background:i===index?'rgba(22,75,62,.42)':'rgba(3,12,22,.72)',color:i===index?'#72f0c9':'#d9e1f1'}}>{String(i+1).padStart(2,'0')} · {x.label}</button>)}
    </div>
    <div style={{marginTop:18,padding:25,borderRadius:16,border:'1px solid rgba(158,140,255,.25)',background:'rgba(2,9,17,.8)'}}>
      <small style={{color:'#7886a4',fontWeight:900,letterSpacing:1.2}}>CURRENT EXPLANATORY STATE</small>
      <div style={{color:'#a99aff',fontSize:'clamp(21px,3vw,31px)',fontWeight:950,margin:'8px 0 12px'}}>{state.result}</div>
      <p style={{color:'#bdc7d8',lineHeight:1.75}}>{state.detail}</p>
      <button type="button" onClick={()=>setIndex(0)} style={{marginTop:10,padding:'10px 14px',borderRadius:10,border:'1px solid rgba(114,240,201,.3)',background:'transparent',color:'#72f0c9',fontWeight:850,cursor:'pointer'}}>RESTORE REGISTERED BASELINE</button>
    </div>
    <p style={{fontSize:12,color:'#718099',lineHeight:1.65,marginTop:16}}>Interactive presentation only. It does not establish a TA-14 PASS, certification, independent adjudication, production readiness, legal or organisational authority, or permission to execute. Findings require a separately frozen proposition, challenge conditions, preserved evidence return, and TA-14 determination.</p>
  </section>;
}
