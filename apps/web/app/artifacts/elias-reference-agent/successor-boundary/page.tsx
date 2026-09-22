'use client';
import Link from 'next/link';
import {useMemo,useState} from 'react';

type SuccessorState='UNCHANGED'|'MATERIAL_CHANGE'|'AUTHORITY_CHANGED'|'EVIDENCE_STALE';
const carry=[
 ['HISTORY','MUST CROSS','The predecessor record remains attributable and reconstructable.'],
 ['LINEAGE','MUST CROSS','The successor must identify the exact predecessor it succeeds.'],
 ['EVIDENCE','BOUNDED','Preserved evidence may remain historical evidence; its present sufficiency must be re-examined.'],
 ['STANDING','MUST NOT SILENTLY CROSS','A prior valid standing does not automatically become present standing.'],
 ['AUTHORITY','MUST NOT SILENTLY CROSS','Prior authority cannot be treated as current authority after a material successor change.'],
 ['EXECUTION PERMISSION','MUST NOT CROSS','A prior permission is not a reusable execution token.'],
] as const;

export default function EliasSuccessorBoundary(){
 const [state,setState]=useState<SuccessorState>('UNCHANGED');
 const [lineage,setLineage]=useState(true);
 const [revalidated,setRevalidated]=useState(false);
 const [currentAuthority,setCurrentAuthority]=useState(false);
 const result=useMemo(()=>{
  if(!lineage)return {d:'HOLD',why:'Successor lineage to the exact predecessor is not established.'};
  if(state==='UNCHANGED')return {d:'INSPECT',why:'No material successor proposition has been introduced. The frozen predecessor remains the historical object under inspection.'};
  if(!revalidated)return {d:'HOLD',why:'A changed successor condition requires a new validation chain. Historical evidence cannot silently establish present standing.'};
  if(!currentAuthority)return {d:'HOLD',why:'Revalidation alone does not create authority. Present authority for the successor consequence is not established.'};
  return {d:'ALLOW WITHIN NEW CHAIN',why:'Lineage is preserved, the changed condition has been revalidated, and present authority is established for this bounded successor proposition.'};
 },[state,lineage,revalidated,currentAuthority]);
 const accent=result.d.startsWith('ALLOW')?'#72f0c9':result.d==='INSPECT'?'#9e8cff':'#f5c869';
 return <main style={{minHeight:'100vh',padding:'42px 20px 100px',background:'radial-gradient(circle at 82% 3%,rgba(130,92,255,.22),transparent 30%),radial-gradient(circle at 12% 36%,rgba(56,235,196,.11),transparent 28%),linear-gradient(180deg,#030611,#07101b 58%,#03070c)',color:'#f3f6ff',fontFamily:'Inter,system-ui,sans-serif'}}>
  <div style={{maxWidth:1220,margin:'0 auto'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',paddingBottom:18,borderBottom:'1px solid rgba(158,140,255,.2)'}}><Link href="/artifacts/elias-reference-agent" style={{color:'#c8c0ff',textDecoration:'none',fontWeight:900}}>← Elias Reference Agent</Link><Link href="/" style={{color:'#8fa0b8',textDecoration:'none'}}>TA-14 Exchange →</Link></nav>
   <section style={{marginTop:26,padding:'clamp(34px,6vw,70px)',border:'1px solid rgba(158,140,255,.27)',borderRadius:30,background:'linear-gradient(145deg,rgba(18,19,50,.96),rgba(5,14,26,.97))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.2em',color:'#72f0c9'}}>ELIAS × TA-14 · POST-CLOSURE INTERACTIVE EXAMINATION SURFACE</div>
    <h1 style={{fontSize:'clamp(45px,7vw,88px)',lineHeight:.94,letterSpacing:'-.055em',margin:'20px 0'}}>WHAT MAY CROSS<br/><span style={{color:'#a99aff'}}>THE SUCCESSOR BOUNDARY?</span></h1>
    <p style={{fontSize:'clamp(18px,2.1vw,25px)',lineHeight:1.55,maxWidth:980,color:'#b7c2d8'}}>A frozen predecessor must remain frozen. A successor may preserve its history and lineage without inheriting its authority. This interactive surface examines the boundary between what must carry forward and what must be re-established now.</p>
   </section>
   <section style={{marginTop:22,padding:'clamp(26px,4vw,42px)',border:'1px solid rgba(114,240,201,.2)',borderRadius:24,background:'rgba(7,17,27,.84)'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:'#72f0c9'}}>THE MINIMUM / MAXIMUM SUCCESSOR CONTRACT</div>
    <h2 style={{fontSize:'clamp(28px,4vw,48px)',margin:'10px 0 12px'}}>The boundary governs both directions.</h2>
    <p style={{color:'#aeb9cb',lineHeight:1.7,maxWidth:960}}>The minimum contract identifies what a successor must carry across for continuity: exact predecessor identity, preserved history, attributable lineage and bounded evidence. The maximum contract identifies what cannot silently cross: standing, authority, execution permission, or a prior determination treated as present permission.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12,marginTop:20}}>{carry.map(([a,b,c])=><article key={a} style={{padding:20,borderRadius:16,border:'1px solid rgba(158,140,255,.18)',background:'rgba(4,11,22,.64)'}}><div style={{fontSize:11,color:b.includes('MUST NOT')?'#f5c869':'#72f0c9',fontWeight:950,letterSpacing:'.1em'}}>{b}</div><h3 style={{margin:'8px 0',fontSize:20}}>{a}</h3><p style={{margin:0,color:'#9eabc0',lineHeight:1.55}}>{c}</p></article>)}</div>
   </section>
   <section style={{marginTop:22,padding:'clamp(26px,4vw,42px)',border:'1px solid rgba(158,140,255,.25)',borderRadius:24,background:'linear-gradient(135deg,rgba(42,31,83,.3),rgba(5,14,26,.94))'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:'#a99aff'}}>INTERACTIVE INSPECTION · NOT HISTORICAL EXECUTION</div>
    <h2 style={{fontSize:'clamp(28px,4vw,48px)',margin:'10px 0'}}>Change the successor condition.</h2>
    <div style={{display:'flex',gap:9,flexWrap:'wrap',margin:'18px 0'}}>{(['UNCHANGED','MATERIAL_CHANGE','AUTHORITY_CHANGED','EVIDENCE_STALE'] as SuccessorState[]).map(x=><button key={x} onClick={()=>{setState(x);setRevalidated(false);setCurrentAuthority(false)}} style={{cursor:'pointer',padding:'10px 14px',borderRadius:999,border:`1px solid ${state===x?'#a99aff':'#53627a'}`,background:state===x?'rgba(169,154,255,.1)':'transparent',color:state===x?'#d9d2ff':'#9eabc0',fontWeight:900}}>{x.replaceAll('_',' ')}</button>)}</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))',gap:14}}>
     <div style={{padding:22,borderRadius:18,border:'1px solid rgba(114,240,201,.18)',background:'rgba(2,9,16,.66)'}}>
      <h3 style={{marginTop:0}}>Successor controls</h3>
      {[['Exact predecessor lineage',lineage,setLineage],['Changed condition revalidated',revalidated,setRevalidated],['Present authority established',currentAuthority,setCurrentAuthority]].map(([label,val,setter])=><label key={String(label)} style={{display:'flex',justifyContent:'space-between',gap:14,padding:'13px 0',borderBottom:'1px solid rgba(255,255,255,.07)',color:'#b9c4d4'}}><span>{String(label)}</span><input type="checkbox" checked={Boolean(val)} onChange={e=>(setter as (v:boolean)=>void)(e.target.checked)}/></label>)}
     </div>
     <div style={{padding:22,borderRadius:18,border:`1px solid ${accent}66`,background:'rgba(2,9,16,.72)'}}>
      <div style={{fontSize:11,fontWeight:950,letterSpacing:'.13em',color:'#8998ae'}}>WORKING DETERMINATION</div><div style={{fontSize:'clamp(27px,4vw,43px)',fontWeight:1000,color:accent,margin:'12px 0'}}>{result.d}</div><p style={{color:'#b7c2d8',lineHeight:1.65}}>{result.why}</p>
      <div style={{marginTop:18,fontSize:12,color:'#8fa0b8'}}>PREDECESSOR RECORD</div><b>PRESERVED · NOT REWRITTEN</b>
      <div style={{marginTop:13,fontSize:12,color:'#8fa0b8'}}>SUCCESSOR PROPOSITION</div><b>{state==='UNCHANGED'?'NOT YET CONSTITUTED':'NEW CHAIN REQUIRED'}</b>
     </div>
    </div>
   </section>
   <section style={{marginTop:22,padding:'clamp(26px,4vw,40px)',border:'1px solid rgba(245,200,105,.2)',borderRadius:24,background:'rgba(50,36,12,.16)'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:'#f5c869'}}>NON-NEGOTIABLE INSPECTION RULES</div>
    <h2 style={{fontSize:'clamp(27px,4vw,44px)',margin:'10px 0 18px'}}>The interactive layer cannot rewrite the governed record.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:10}}>{['INSPECTION ≠ EXECUTION','SIMULATION ≠ HISTORICAL EVIDENCE','CHANGED CONDITION ≠ CHANGED RECORD','PREDECESSOR EVIDENCE ≠ PRESENT AUTHORITY','NEW PROPOSITION = NEW CHAIN'].map(x=><div key={x} style={{padding:17,border:'1px solid rgba(245,200,105,.16)',borderRadius:14,fontWeight:950,color:'#f1d99e',background:'rgba(2,9,16,.45)'}}>{x}</div>)}</div>
   </section>
   <section style={{marginTop:22,padding:'clamp(26px,4vw,40px)',border:'1px solid rgba(114,240,201,.18)',borderRadius:24,background:'rgba(7,17,27,.84)'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:'#72f0c9'}}>TA-14 NATIVE CONTROL ALIGNMENT</div>
    <p style={{color:'#aeb9cb',lineHeight:1.7}}>This surface maps to existing TA-14 adversarial examination controls: AE-40 predecessor immutability, AE-41 exact successor-to-predecessor lineage, AE-50 no silent standing inheritance, AE-51 substantive revalidation, and AE-60 point-in-time reconstruction. The interface demonstrates the questions; it does not manufacture PASS or institutional standing.</p>
   </section>
   <section style={{marginTop:22,padding:'26px',border:'1px solid rgba(158,140,255,.17)',borderRadius:22,background:'rgba(7,13,25,.85)'}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.17em',color:'#a99aff'}}>ELIAS / TA-14 BOUNDARY NOTICE</div>
    <p style={{color:'#9eabc0',lineHeight:1.65,marginBottom:0}}>Elias remains an independently authored external architecture. This is a TA-14 interactive examination surface built from the registered ERA claim surface and TA-14's own successor-boundary controls. It does not rewrite Elias evidence, convert an Elias claim into a TA-14 finding, or alter any frozen predecessor examination. Any new governed proposition requires its own constituted chain and evidence.</p>
   </section>
  </div>
 </main>
}