'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const chain = ['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'] as const;
const consequences = [
  ['investigation','Authorize additional investigation'],
  ['containment','Authorize limited containment'],
  ['remediation','Authorize major remediation'],
  ['defect','Support attribution to building defect'],
  ['responsibility','Support financial responsibility'],
] as const;

type Consequence = typeof consequences[number][0];
type State = 'ALLOW'|'HOLD'|'DENY'|'ESCALATE';

const packages = [
  {code:'A',reading:'~500 spores/m³',summary:'Lower reported airborne concentration.',facts:['Laboratory continuity preserved','Sampling location limited','HVAC operating state undocumented','Moisture history incomplete','Concealed wall cavity not examined']},
  {code:'B',reading:'~2,200,000 spores/m³',summary:'Higher reported airborne concentration.',facts:['Collected near disturbed affected material','Wall assembly had been opened','HVAC documented off','Known moisture condition present','Sampling context differs from Package A']},
];

const base: Record<Consequence,{state:State;reason:string}> = {
  investigation:{state:'ALLOW',reason:'The combined record supports further bounded investigation without requiring unsupported source, liability, or health conclusions.'},
  containment:{state:'ALLOW',reason:'A limited protective action may be supported where its scope remains bounded to the established environmental concern.'},
  remediation:{state:'HOLD',reason:'The evidence establishes concern but does not yet establish a sufficiently bounded major remediation scope.'},
  defect:{state:'HOLD',reason:'Moisture involvement is partly supported, but the causal building-defect pathway is not yet established.'},
  responsibility:{state:'ESCALATE',reason:'Financial or legal responsibility exceeds the demonstrated EIG evidentiary and authority boundary.'},
};

export default function ConflictingEnvironmentalRecordDemo(){
  const [consequence,setConsequence]=useState<Consequence>('remediation');
  const [changed,setChanged]=useState(false);
  const [stage,setStage]=useState(5);
  const determination=useMemo(()=>{
    if(changed && consequence!=='investigation') return {state:'HOLD' as State,reason:'A concealed plumbing leak entered the record before commitment. Prior admissibility no longer has present standing for this consequence; revalidation is required.'};
    return base[consequence];
  },[changed,consequence]);

  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0%,#12372d 0,#071511 38%,#030807 78%)',color:'#edf9f4',fontFamily:'Arial,Helvetica,sans-serif'}}>
    <nav style={{display:'flex',justifyContent:'space-between',gap:20,padding:'18px clamp(20px,5vw,72px)',borderBottom:'1px solid rgba(120,240,190,.18)',background:'rgba(3,12,9,.82)',position:'sticky',top:0,zIndex:10,backdropFilter:'blur(16px)'}}>
      <Link href='/environmental-integrity-governance' style={{color:'#83f0bd',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL INTEGRITY GOVERNANCE</Link>
      <span style={{fontSize:12,letterSpacing:'.16em',color:'#9ebcaf'}}>EIG DEMONSTRATION 001 · R1</span>
    </nav>

    <section style={{maxWidth:1240,margin:'0 auto',padding:'72px 24px 30px'}}>
      <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.18em',fontSize:12}}>ENVIRONMENTAL PROVING GROUND · SYNTHETIC BOUNDED CASE</p>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(42px,7vw,82px)',lineHeight:.95,margin:'14px 0 20px'}}>The Conflicting<br/>Environmental Record</h1>
      <p style={{maxWidth:900,color:'#b8d0c5',fontSize:18,lineHeight:1.7}}>Two environmental measurements can both be authentic records without being equivalent evidence. This demonstration tests whether consequence can be prevented from outrunning what the admitted evidence actually supports.</p>
      <div style={{marginTop:26,padding:18,border:'1px solid rgba(255,211,106,.32)',background:'rgba(83,57,8,.16)',color:'#f1d994'}}><strong>NON-CLAIM:</strong> This demonstration does not diagnose illness, establish health causation, create a mold safety threshold, determine negligence, or decide legal liability.</div>
    </section>

    <section style={{maxWidth:1240,margin:'0 auto',padding:'24px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:18}}>
      {packages.map(p=><article key={p.code} style={{padding:26,border:'1px solid rgba(121,225,179,.22)',background:'rgba(7,28,21,.78)',borderRadius:18}}><small style={{color:'#6ee8ad',fontWeight:900}}>EVIDENCE PACKAGE {p.code}</small><h2 style={{fontSize:34,margin:'10px 0 4px'}}>{p.reading}</h2><p style={{color:'#a9c2b7'}}>{p.summary}</p><ul style={{lineHeight:1.8,color:'#d4e6de',paddingLeft:20}}>{p.facts.map(x=><li key={x}>{x}</li>)}</ul></article>)}
    </section>

    <section style={{maxWidth:1240,margin:'20px auto',padding:24}}>
      <div style={{padding:26,border:'1px solid rgba(255,209,92,.28)',borderRadius:18,background:'rgba(40,31,5,.42)'}}><small style={{color:'#ffd15c',fontWeight:900,letterSpacing:'.14em'}}>COMPARABILITY GATE</small><h2 style={{fontSize:38,margin:'8px 0'}}>NON-COMPARABLE</h2><p style={{color:'#d6cda8',lineHeight:1.65,maxWidth:920}}>The magnitude difference does not authorize a winner. The records were produced under materially different sampling and building states. Both readings remain preserved; equivalence is not manufactured.</p></div>
    </section>

    <section style={{maxWidth:1240,margin:'0 auto',padding:24}}>
      <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.14em',fontSize:12}}>PROPOSITION SEPARATION</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10}}>{[
        ['P1 CONDITION','SUPPORTED'],['P2 SOURCE','PARTIALLY SUPPORTED'],['P3 INTERVENTION','CONSEQUENCE-RELATIVE'],['P4 RESPONSIBILITY','NOT ESTABLISHED'],['P5 HEALTH CAUSATION','OUTSIDE EIG AUTHORITY']
      ].map(([a,b])=><div key={a} style={{padding:18,border:'1px solid rgba(120,240,190,.16)',background:'rgba(6,23,18,.72)'}}><small style={{color:'#8ca99c'}}>{a}</small><strong style={{display:'block',marginTop:8,color:'#e9fff5'}}>{b}</strong></div>)}</div>
    </section>

    <section style={{maxWidth:1240,margin:'24px auto',padding:24}}>
      <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.14em',fontSize:12}}>CHOOSE THE CONSEQUENCE</p>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{consequences.map(([id,label])=><button key={id} onClick={()=>setConsequence(id)} style={{cursor:'pointer',padding:'12px 14px',border:consequence===id?'1px solid #7af0b8':'1px solid rgba(120,240,190,.2)',background:consequence===id?'rgba(69,198,139,.18)':'rgba(4,17,13,.7)',color:'#eafff5',borderRadius:10}}>{label}</button>)}</div>

      <div style={{marginTop:20,padding:28,border:'1px solid rgba(120,240,190,.28)',background:'rgba(4,21,15,.9)',borderRadius:18}}>
        <small style={{color:'#86aa99'}}>CURRENT COMMIT DETERMINATION</small>
        <h2 style={{fontSize:52,margin:'6px 0',color:determination.state==='ALLOW'?'#7df0b9':determination.state==='HOLD'?'#ffd15c':'#ff9d86'}}>{determination.state}</h2>
        <p style={{maxWidth:900,lineHeight:1.7,color:'#c7d9d1'}}>{determination.reason}</p>
      </div>
    </section>

    <section style={{maxWidth:1240,margin:'0 auto',padding:24}}>
      <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.14em',fontSize:12}}>GOVERNING CHAIN</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(8,minmax(90px,1fr))',overflowX:'auto',gap:7}}>{chain.map((x,i)=><button key={x} onClick={()=>setStage(i)} style={{minWidth:105,padding:'16px 8px',border:i===stage?'1px solid #77efb7':'1px solid rgba(120,240,190,.15)',background:i===stage?'rgba(54,188,128,.18)':'rgba(4,18,13,.72)',color:'#e9fff5',fontSize:10,fontWeight:900}}><span style={{display:'block',color:'#739486',marginBottom:6}}>{String(i+1).padStart(2,'0')}</span>{x}</button>)}</div>
      <p style={{padding:'18px 0',color:'#a9c3b7'}}>Selected stage: <strong style={{color:'#eafff5'}}>{chain[stage]}</strong>. The demonstration preserves each stage rather than allowing a later determination to rewrite an earlier record.</p>
    </section>

    <section style={{maxWidth:1240,margin:'20px auto 0',padding:'24px 24px 90px'}}>
      <div style={{padding:30,border:changed?'1px solid rgba(255,120,95,.55)':'1px solid rgba(116,224,178,.22)',borderRadius:18,background:changed?'rgba(63,17,10,.45)':'rgba(5,25,18,.72)'}}>
        <small style={{color:changed?'#ff9b86':'#76e9b2',fontWeight:900,letterSpacing:'.14em'}}>CHANGED-CONDITION INJECTION</small>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:34}}>A concealed plumbing leak is discovered before Commit.</h2>
        <p style={{color:'#bdd2c8',lineHeight:1.7}}>The new evidence does not erase either original measurement or the prior determination. It changes the presently established reality and forces revalidation before consequence may cross the boundary.</p>
        <button onClick={()=>setChanged(v=>!v)} style={{cursor:'pointer',padding:'14px 18px',border:'1px solid rgba(255,255,255,.3)',background:changed?'#6e2419':'#125638',color:'white',fontWeight:900,borderRadius:10}}>{changed?'RESET TO T₀':'INJECT NEW EVIDENCE AT T₃'}</button>
      </div>
      <blockquote style={{margin:'38px 0 0',padding:'22px 26px',borderLeft:'3px solid #73eab1',background:'rgba(5,20,15,.62)',fontFamily:'Georgia,serif',fontSize:24,lineHeight:1.45}}>Governance is not choosing which expert to believe. Governance is preventing consequence from exceeding proof.</blockquote>
    </section>
  </main>;
}
