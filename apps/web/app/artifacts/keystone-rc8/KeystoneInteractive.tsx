'use client';

import { useState } from 'react';

const scenarios = [
  {
    title:'Frozen RC8 baseline',
    determination:'BASELINE · PRESERVED',
    detail:'Keystone v1.0.0-rc8 remains the dated registered object. Its reported 256/256 system-test position and the preserved H4/H5 adverse condition travel together.',
    keystone:'No new execution proposition is being admitted.',
    ta14:'No TA-14 interoperability finding is created by viewing this baseline.'
  },
  {
    title:'Identity established',
    determination:'HOLD · AUTHORITY NOT YET ESTABLISHED',
    detail:'A known actor and frozen object establish identity context, but identity credentials or technical capability alone do not establish consequence-bearing financial execution authority.',
    keystone:'Identity is present; authority and execution permission remain distinct.',
    ta14:'No admissible financial consequence is inferred from identity alone.'
  },
  {
    title:'Payload-bound permission established',
    determination:'HOLD · EXECUTION-TIME REVALIDATION PENDING',
    detail:'The exact proposed financial action now has bounded permission, but the relevant conditions still have to survive revalidation at the execution boundary.',
    keystone:'Permission is bound to this payload rather than treated as a reusable entitlement.',
    ta14:'The comparison still has not established present evidentiary standing for consequence.'
  },
  {
    title:'Conditions survive revalidation',
    determination:'KEYSTONE PATH · ELIGIBLE WITHIN CLAIMED BOUNDARY',
    detail:'Within the registered Keystone proposition, identity, authority, payload-bound permission, and relevant execution-time conditions are represented as satisfied.',
    keystone:'This demonstrates the claimed Keystone path only; it is not TA-14 certification or production validation.',
    ta14:'A separate TA-14 FEIG determination has not been made.'
  },
  {
    title:'Trust anchor continuity breaks',
    determination:'HOLD · H4/H5 CONDITION PRESERVED',
    detail:'An unrelated K2 replacement inheriting a K1 checkpoint without authorized rotation activates the preserved RC8 trust-anchor / registration-continuity weakness.',
    keystone:'The adverse condition remains attached to RC8 even alongside the reported 256/256 test position.',
    ta14:'The evidence cannot be silently upgraded into a positive interoperability finding.'
  },
  {
    title:'TA-14 standing is missing',
    determination:'COMPARISON · WITHHOLD CONSEQUENCE',
    detail:'This is the proposed Keystone × TA-14 FEIG seam: even where Keystone conditions are represented as satisfied, TA-14 may independently lack present admissible evidence for the financial consequence.',
    keystone:'Keystone remains sovereign; its frozen baseline is not rewritten.',
    ta14:'The proposition remains a future bounded examination, not a finding.'
  },
  {
    title:'Successor release appears',
    determination:'HOLD · NEW EVIDENCE OBJECT REQUIRED',
    detail:'A successor version cannot inherit RC8 standing merely because it follows RC8. Corrections or changed conditions belong to a distinct versioned evidence object and, where applicable, re-examination.',
    keystone:'Historical RC8 remains intact.',
    ta14:'No successor is treated as examined until its own evidence is established.'
  }
] as const;

export default function KeystoneInteractive(){
  const [selected,setSelected]=useState(0);
  const s=scenarios[selected];
  return <section style={{marginTop:32,padding:'clamp(24px,4vw,36px)',border:'1px solid rgba(113,231,255,.25)',borderRadius:22,background:'linear-gradient(145deg,rgba(9,38,55,.8),rgba(5,14,24,.96))'}}>
    <div style={{color:'#71e7ff',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>RECORDED EXAMINATION PLAYER · FROZEN RC8</div>
    <h2 style={{fontSize:'clamp(30px,4vw,46px)',margin:'10px 0 8px'}}>Change the condition. Preserve the record.</h2>
    <p style={{color:'#a8bbc8',lineHeight:1.7,maxWidth:900}}>Walk the registered Keystone boundary without converting historical evidence into a new finding. Each state keeps Keystone's claims separate from TA-14's independent evidentiary standing.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:9,marginTop:22}}>
      {scenarios.map((x,i)=><button type="button" key={x.title} onClick={()=>setSelected(i)} style={{textAlign:'left',cursor:'pointer',padding:'14px 15px',borderRadius:12,border:selected===i?'1px solid rgba(127,240,189,.7)':'1px solid rgba(113,231,255,.16)',background:selected===i?'rgba(29,81,63,.38)':'rgba(7,18,30,.78)',color:selected===i?'#7ff0bd':'#dbeaf5',fontWeight:850,fontFamily:'inherit'}}>{String(i+1).padStart(2,'0')} · {x.title}</button>)}
    </div>
    <div style={{marginTop:18,padding:24,borderRadius:16,border:'1px solid rgba(242,204,104,.25)',background:'rgba(4,12,20,.78)'}}>
      <small style={{color:'#8299a9',letterSpacing:1.2,fontWeight:900}}>CURRENT STATE</small>
      <div style={{color:'#f2cc68',fontSize:'clamp(21px,3vw,31px)',fontWeight:950,margin:'7px 0 12px'}}>{s.determination}</div>
      <p style={{color:'#b7c7d1',lineHeight:1.7}}>{s.detail}</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12,marginTop:18}}>
        <div style={{padding:16,borderRadius:12,border:'1px solid rgba(127,240,189,.18)'}}><b style={{color:'#7ff0bd'}}>KEYSTONE RECORD</b><p style={{color:'#aebfc9',lineHeight:1.6,marginBottom:0}}>{s.keystone}</p></div>
        <div style={{padding:16,borderRadius:12,border:'1px solid rgba(113,231,255,.18)'}}><b style={{color:'#71e7ff'}}>TA-14 BOUNDARY</b><p style={{color:'#aebfc9',lineHeight:1.6,marginBottom:0}}>{s.ta14}</p></div>
      </div>
      <button type="button" onClick={()=>setSelected(0)} style={{marginTop:18,padding:'10px 14px',borderRadius:10,border:'1px solid rgba(242,204,104,.28)',background:'rgba(242,204,104,.06)',color:'#f2cc68',fontWeight:850,cursor:'pointer'}}>RESTORE FROZEN BASELINE</button>
    </div>
    <p style={{fontSize:12,color:'#71899a',lineHeight:1.6,marginTop:16}}>Interactive presentation only. This player does not certify Keystone, erase H4/H5, authorize execution, validate a successor release, or create the proposed Keystone × TA-14 FEIG interoperability finding.</p>
  </section>;
}
