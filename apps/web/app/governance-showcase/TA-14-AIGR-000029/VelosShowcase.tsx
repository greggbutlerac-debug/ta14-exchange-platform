'use client';
import {useState} from 'react';

const states=[
 {t:'Registered identity',s:'REGISTERED · PUBLIC',d:'Velos Systems v1.0.0 is a registered independent governance identity. Registration does not establish Technical Freeze, execution authority, interoperability, safety, certification, or a TA-14 finding.'},
 {t:'Prior R1',s:'CLOSED · NO FINAL TA-14 FINDING',d:'The prior R1 evidence-reconciliation chain closed incomplete for final evidence reconciliation. A participant-reported local result remains distinct from an institutional TA-14 finding.'},
 {t:'Successor R1',s:'OPEN · PRESENT-STATE REVALIDATION',d:'The successor R1 is a new present-state chain. It does not repair, replace, or silently inherit authority from the prior closure.'},
 {t:'Reconciled facts',s:'FREEZE PREPARATION · NOT FREEZE',d:'Participant identity and authority, registered baseline, interface terminology, execution-crossing point, revocation behavior, receipt semantics, clock/correlation model, performance exclusion, proposition, and non-claim boundary are reconciled.'},
 {t:'Freeze blockers',s:'HOLD · TECHNICAL FREEZE NOT YET ESTABLISHED',d:'Executable artifact hashes, environment identities, target fixture, evidence collectors, reproducible F0-F9 fixtures, frozen F0-F9 acceptance criteria, publication boundary, replay terms if used, and final participant freeze acceptance remain blockers.'},
 {t:'Attempt execution',s:'HOLD · EXECUTION NOT AUTHORIZED',d:'Until Technical Freeze is formally issued, execution is exploratory and may not be treated as R1 examination evidence.'},
 {t:'Attempt silent inheritance',s:'DENY · NO SILENT INHERITANCE',d:'Neither registration nor a prior chain supplies present standing to the successor R1. Current-state evidence must independently satisfy the new chain.'}
] as const;

export default function VelosShowcase(){
 const [i,setI]=useState(0); const x=states[i];
 return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 12% 0%,rgba(28,100,139,.25),transparent 31%),linear-gradient(180deg,#020813,#06111e 48%,#020710)',color:'#f3f6f9',padding:'64px 20px',fontFamily:'Inter,system-ui,sans-serif'}}>
 <div style={{width:'min(1100px,100%)',margin:'0 auto'}}>
 <a href="/registry/records/TA-14-AIGR-000029" style={{color:'#a9bfd2',textDecoration:'none'}}>← PERMANENT REGISTRY RECORD</a>
 <header style={{marginTop:36,padding:'clamp(30px,6vw,58px)',border:'1px solid rgba(213,167,75,.28)',borderRadius:28,background:'rgba(8,26,45,.86)'}}>
 <div style={{color:'#d7aa51',fontSize:11,fontWeight:900,letterSpacing:'.15em'}}>TA-14 GOVERNANCE SHOWCASE · TA-14-AIGR-000029</div>
 <h1 style={{fontSize:'clamp(48px,8vw,86px)',lineHeight:.95,margin:'16px 0'}}>VELOS SYSTEMS</h1>
 <p style={{fontSize:22,color:'#7edcf3'}}>v1.0.0 · Layer-4 Deterministic Enforcement Substrate</p>
 <p style={{color:'#b4c5d5',fontSize:17,lineHeight:1.8,maxWidth:850}}>Two examination chains share one registered identity, but they do not share standing. Explore the boundary between registration, historical closure, present-state revalidation, Technical Freeze, and execution.</p>
 </header>
 <section style={{marginTop:28,padding:'clamp(24px,4vw,38px)',border:'1px solid rgba(126,220,243,.22)',borderRadius:22,background:'rgba(5,17,30,.9)'}}>
 <div style={{color:'#7edcf3',fontSize:11,fontWeight:900,letterSpacing:'.14em'}}>RECORDED EXAMINATION PLAYER</div>
 <h2 style={{fontSize:'clamp(30px,4vw,46px)',margin:'10px 0'}}>Two chains. One identity. No silent inheritance.</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:9,marginTop:22}}>
 {states.map((v,n)=><button key={v.t} type="button" onClick={()=>setI(n)} style={{textAlign:'left',padding:'14px 15px',borderRadius:11,cursor:'pointer',fontFamily:'inherit',fontWeight:850,border:i===n?'1px solid rgba(215,170,81,.75)':'1px solid rgba(126,220,243,.16)',background:i===n?'rgba(80,57,14,.42)':'rgba(3,12,22,.72)',color:i===n?'#e1b85f':'#d9e8f1'}}>{String(n+1).padStart(2,'0')} · {v.t}</button>)}
 </div>
 <div style={{marginTop:18,padding:25,borderRadius:16,border:'1px solid rgba(215,170,81,.25)',background:'rgba(2,9,17,.8)'}}>
 <small style={{color:'#7893a7',fontWeight:900,letterSpacing:1.2}}>CURRENT STATE</small><div style={{color:'#e1b85f',fontSize:'clamp(21px,3vw,31px)',fontWeight:950,margin:'8px 0 12px'}}>{x.s}</div><p style={{color:'#bdccd7',lineHeight:1.75}}>{x.d}</p>
 <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:12,alignItems:'center',marginTop:22}}>
 <div style={{padding:16,border:'1px solid rgba(255,143,143,.2)',borderRadius:12}}><b>PRIOR R1</b><p style={{color:'#9fb5c4',lineHeight:1.6}}>Closed without final TA-14 finding.</p></div><div style={{color:'#d7aa51',fontWeight:950}}>≠</div><div style={{padding:16,border:'1px solid rgba(126,220,243,.22)',borderRadius:12}}><b>SUCCESSOR R1</b><p style={{color:'#9fb5c4',lineHeight:1.6}}>Open present-state revalidation.</p></div></div>
 <button type="button" onClick={()=>setI(0)} style={{marginTop:18,padding:'10px 14px',borderRadius:10,border:'1px solid rgba(215,170,81,.3)',background:'transparent',color:'#e1b85f',fontWeight:850,cursor:'pointer'}}>RESTORE REGISTRATION BASELINE</button>
 </div>
 <p style={{fontSize:12,color:'#71899a',lineHeight:1.65,marginTop:16}}>Interactive presentation only. It does not establish Technical Freeze, authorize execution, create a TA-14 finding, or transfer standing from the prior R1 into the successor chain.</p>
 </section></div></main>
}
