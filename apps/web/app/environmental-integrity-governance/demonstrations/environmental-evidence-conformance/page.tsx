'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const systems = [
  ['iaq','Continuous IAQ monitoring','PM2.5, CO2, VOC, temperature and humidity dashboard'],
  ['bms','BMS / building controls','Building automation trends, alarms and control points'],
  ['twin','Digital twin','Model-linked environmental and equipment observations'],
  ['outdoor','Outdoor sensor network','Distributed ambient environmental measurements'],
  ['lab','Laboratory feed','Sampling and laboratory analytical results'],
  ['wearable','Wearable / personal monitor','Person-centered atmospheric observations across locations'],
] as const;

const checks = [
  ['Source / device identity',true,'The observation is attributable to an identified source.'],
  ['Location identity',true,'The observation is bound to a declared place or bounded context.'],
  ['Calibration / configuration state',false,'Current calibration or relied-upon configuration is not established.'],
  ['Timestamp integrity',true,'A time value exists and is preserved with the observation.'],
  ['Provenance and custody',false,'The route from observation to relied-upon record is incomplete.'],
  ['Continuity / gap status',false,'A material evidence gap remains unresolved.'],
  ['Baseline',true,'A comparison baseline is available.'],
  ['Threshold basis',false,'The dashboard threshold is visible but its authority and reliance basis are not established.'],
  ['Interpretation boundary',false,'The measurement has been converted into a conclusion without a governed interpretation boundary.'],
  ['Reliance purpose',false,'The exact proposition or decision for which the evidence will be relied upon is undeclared.'],
  ['Intervention authority',false,'Authority to cause a consequential environmental action is not established.'],
  ['Outcome proof',false,'No governed post-intervention outcome record is present.'],
  ['Retention / future reliance',false,'Retention, supersession and future-reliance limits are not established.'],
] as const;

export default function EnvironmentalEvidenceConformanceShowcase(){
  const [system,setSystem]=useState('iaq');
  const [mode,setMode]=useState<'monitoring'|'governed'>('monitoring');
  const selected=useMemo(()=>systems.find(x=>x[0]===system)??systems[0],[system]);
  const rows=checks.map(([name,base,note])=>({name,ok:mode==='governed'?true:base,note:mode==='governed'?(base?note:'TA-14 conformance evidence is established for this demonstration state.'):note}));
  const established=rows.filter(r=>r.ok).length;
  const determination=mode==='governed'?'ALLOW':'HOLD';

  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0%,#153d32 0,#071511 36%,#020605 82%)',color:'#edf9f4',fontFamily:'Arial,Helvetica,sans-serif'}}>
    <nav style={{padding:'18px clamp(20px,5vw,72px)',borderBottom:'1px solid rgba(120,240,190,.18)',display:'flex',justifyContent:'space-between',gap:18,flexWrap:'wrap'}}>
      <Link href='/environmental-integrity-governance/demonstrations' style={{color:'#83f0bd',textDecoration:'none',fontWeight:900}}>← DOOR 03 · ENVIRONMENTAL PROVING GROUND</Link>
      <Link href='/environmental-integrity-governance' style={{color:'#b8d0c5',textDecoration:'none'}}>Environmental Integrity Governance</Link>
    </nav>

    <section style={{maxWidth:1180,margin:'0 auto',padding:'72px 24px 100px'}}>
      <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.18em',fontSize:12}}>EIG SHOWCASE · ENVIRONMENTAL EVIDENCE CONFORMANCE</p>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(44px,7vw,78px)',lineHeight:1,margin:'14px 0 18px'}}>Can your monitoring system produce evidence that is admissible for reliance?</h1>
      <p style={{maxWidth:900,color:'#b8d0c5',fontSize:18,lineHeight:1.7}}>Continuous monitoring can establish visibility. Environmental Integrity Governance asks what the resulting record can actually prove before a consequential claim, intervention, policy decision, automation or other reliance is allowed to cross the boundary.</p>

      <div style={{marginTop:34,padding:24,border:'1px solid rgba(120,240,190,.2)',borderRadius:20,background:'rgba(5,20,15,.72)'}}>
        <label style={{display:'block',fontWeight:900,color:'#83f0bd',marginBottom:12}}>1 · CHOOSE AN EXISTING ENVIRONMENTAL SYSTEM</label>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10}}>{systems.map(([id,title,desc])=><button key={id} onClick={()=>{setSystem(id);setMode('monitoring')}} style={{textAlign:'left',padding:16,borderRadius:14,border:id===system?'1px solid #83f0bd':'1px solid rgba(120,240,190,.16)',background:id===system?'rgba(50,130,96,.25)':'rgba(255,255,255,.025)',color:'#edf9f4',cursor:'pointer'}}><strong style={{display:'block'}}>{title}</strong><small style={{display:'block',marginTop:6,color:'#9fb7ac',lineHeight:1.45}}>{desc}</small></button>)}</div>
      </div>

      <div style={{marginTop:18,padding:24,border:'1px solid rgba(120,240,190,.2)',borderRadius:20,background:'rgba(5,20,15,.72)'}}>
        <div style={{display:'flex',justifyContent:'space-between',gap:20,alignItems:'end',flexWrap:'wrap'}}><div><small style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.12em'}}>SELECTED SYSTEM</small><h2 style={{fontFamily:'Georgia,serif',fontSize:34,margin:'7px 0'}}>{selected[1]}</h2><p style={{color:'#a9c0b5',margin:0}}>{selected[2]}</p></div><div style={{display:'flex',gap:8}}><button onClick={()=>setMode('monitoring')} style={tab(mode==='monitoring')}>MONITORING STATE</button><button onClick={()=>setMode('governed')} style={tab(mode==='governed')}>TA-14 GOVERNED STATE</button></div></div>

        <div style={{marginTop:24,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:10}}>{rows.map(r=><div key={r.name} style={{padding:15,borderRadius:12,border:`1px solid ${r.ok?'rgba(91,229,166,.28)':'rgba(255,191,92,.28)'}`,background:r.ok?'rgba(40,120,86,.12)':'rgba(120,74,20,.12)'}}><div style={{display:'flex',justifyContent:'space-between',gap:10}}><strong>{r.name}</strong><b style={{color:r.ok?'#75efb7':'#ffc86b'}}>{r.ok?'ESTABLISHED':'NOT ESTABLISHED'}</b></div><small style={{display:'block',color:'#9fb7ac',lineHeight:1.5,marginTop:7}}>{r.note}</small></div>)}</div>

        <div style={{marginTop:22,padding:22,borderRadius:16,border:`1px solid ${mode==='governed'?'rgba(91,229,166,.5)':'rgba(255,191,92,.5)'}`,background:mode==='governed'?'rgba(34,116,79,.18)':'rgba(117,72,16,.2)'}}><small style={{fontWeight:900,letterSpacing:'.14em',color:mode==='governed'?'#75efb7':'#ffc86b'}}>TA-14 DEMONSTRATION DETERMINATION</small><div style={{fontFamily:'Georgia,serif',fontSize:48,fontWeight:900,marginTop:6,color:mode==='governed'?'#75efb7':'#ffc86b'}}>{determination}</div><p style={{fontSize:17,lineHeight:1.6,maxWidth:850,marginBottom:0}}>{mode==='governed'?`All ${established} demonstration evidence properties are established. The bounded demonstration reliance may proceed. This does not create universal admissibility outside the declared context.`:`${established} of ${rows.length} demonstration evidence properties are established. The air may have been continuously monitored, but the record is not yet admissible for the proposed consequential reliance.`}</p></div>
      </div>

      <section style={{marginTop:22,padding:30,border:'1px solid rgba(130,187,255,.25)',borderRadius:20,background:'rgba(7,19,34,.58)'}}><small style={{color:'#87bcff',fontWeight:900,letterSpacing:'.14em'}}>THE UPGRADE PATH</small><h2 style={{fontFamily:'Georgia,serif',fontSize:40,margin:'10px 0'}}>Keep your monitoring. Add governance.</h2><p style={{maxWidth:880,color:'#bccbdb',lineHeight:1.7}}>TA-14 does not require useful sensing, controls or analytics to be discarded. Existing systems may remain observation sources. The conformance question is whether the relied-upon evidence route establishes the identity, continuity, admissibility, authority, intervention and outcome properties required for the bounded environmental proposition.</p><button onClick={()=>setMode('governed')} style={{marginTop:10,padding:'14px 18px',borderRadius:10,border:'1px solid #83f0bd',background:'#83f0bd',color:'#04110d',fontWeight:900,cursor:'pointer'}}>SEE THE SAME SYSTEM WITH TA-14 GOVERNANCE →</button></section>

      <section style={{marginTop:22,padding:30,border:'1px solid rgba(176,140,255,.24)',borderRadius:20,background:'rgba(28,18,48,.45)'}}><small style={{color:'#c9afff',fontWeight:900,letterSpacing:'.14em'}}>CONFORMANCE BOUNDARY</small><h2 style={{fontFamily:'Georgia,serif',fontSize:34,margin:'10px 0'}}>TA-14 conformance is not created by self-declaration.</h2><p style={{color:'#cfc4df',lineHeight:1.7}}>This showcase is an educational demonstration, not a certification or license. A real system may monitor environmental conditions without TA-14. Representation as TA-14 licensed, TA-14 conformant, or carrying a TA-14 environmental assurance designation requires the applicable TA-14 examination and express authorization.</p><div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:18}}><Link href='/registry' style={cta}>REGISTER YOUR ENVIRONMENTAL ARCHITECTURE — FREE</Link><Link href='/workspace/entity-review' style={cta}>REQUEST ENVIRONMENTAL CONFORMANCE EXAMINATION →</Link></div></section>

      <p style={{marginTop:28,color:'#6f887d',fontSize:12,lineHeight:1.6}}>Demonstration boundary: illustrative evidence states only. No claim of regulatory approval, universal admissibility, medical conclusion, legal conclusion, or fitness of any specific commercial monitoring system is made by this showcase.</p>
    </section>
  </main>;
}

const tab=(active:boolean):React.CSSProperties=>({padding:'11px 13px',borderRadius:9,border:active?'1px solid #83f0bd':'1px solid rgba(120,240,190,.16)',background:active?'rgba(60,150,110,.25)':'rgba(255,255,255,.025)',color:active?'#edf9f4':'#9fb7ac',fontWeight:900,cursor:'pointer'});
const cta:React.CSSProperties={display:'inline-block',padding:'13px 16px',border:'1px solid rgba(201,175,255,.45)',borderRadius:10,color:'#eee7ff',textDecoration:'none',fontWeight:900};