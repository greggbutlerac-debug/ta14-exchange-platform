'use client';

import Link from 'next/link';
import {useState} from 'react';

const scenarios=[
 {label:'BASELINE',fungi:'165 CFU/m³',plants:'Potted plants',substrate:'Stable / undisturbed',airflow:'Normal HVAC operation',humidity:'Within observed room range',provenance:'Sampling context preserved',result:'HOLD',why:'A fungal count alone does not establish a plant source or authorize removal, ventilation change, shutdown, or another physical consequence.'},
 {label:'IRRIGATION EVENT',fungi:'179 CFU/m³',plants:'Botanical biofilter',substrate:'Recently irrigated / disturbed',airflow:'Forced through growing media',humidity:'Local moisture condition changed',provenance:'Event timing preserved',result:'INVESTIGATE',why:'The literature reports conditional increases associated with substrate disturbance and irrigation. Attribution must be established before consequence.'},
 {label:'BROKEN CONTEXT',fungi:'207 CFU/m³',plants:'Indoor vegetation present',substrate:'Unknown',airflow:'Unknown',humidity:'Unknown',provenance:'Sampling value survives; context does not',result:'HOLD',why:'The number remains a record, but missing ventilation, moisture, substrate and sampling context prevents silent causal attribution.'},
 {label:'CURRENT EVIDENCE',fungi:'210 CFU/m³',plants:'Active green wall',substrate:'Moist media confirmed',airflow:'Forced airflow confirmed',humidity:'Current state recorded',provenance:'Identity + time + method continuous',result:'ESCALATE',why:'A stronger evidence package can support a specific proposition, but intervention still requires applicable authority, exact binding and current standing.'}
];

const card:React.CSSProperties={padding:20,border:'1px solid rgba(111,232,255,.16)',borderRadius:16,background:'rgba(2,12,15,.76)'};

export default function Page(){
 const [i,setI]=useState(0); const s=scenarios[i];
 return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 14% 3%,rgba(64,235,180,.16),transparent 28%),radial-gradient(circle at 88% 8%,rgba(105,220,255,.14),transparent 28%),linear-gradient(180deg,#010807,#041713 52%,#010706)',color:'#eefcf8',fontFamily:'Inter,system-ui,sans-serif',padding:'34px 20px 100px'}}>
  <div style={{maxWidth:1220,margin:'auto'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',paddingBottom:18,borderBottom:'1px solid rgba(111,232,255,.16)'}}><Link href="/environmental-integrity-governance" style={{color:'#8cebd7',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL INTEGRITY GOVERNANCE</Link><span style={{fontSize:10,fontWeight:950,letterSpacing:'.16em',color:'#789f98'}}>PUBLIC TECHNICAL SHOWROOM · INTERACTIVE</span></nav>

   <header style={{padding:'clamp(42px,7vw,82px) 0 46px'}}>
    <p style={{fontSize:11,fontWeight:950,letterSpacing:'.2em',color:'#62f0c4'}}>TA-14 · AIR · ENVIRONMENTAL INTEGRITY · EVIDENCE TO CONSEQUENCE</p>
    <h1 style={{fontSize:'clamp(50px,8vw,100px)',lineHeight:.88,letterSpacing:'-.06em',margin:'18px 0'}}>THE SPORE COUNT<br/><span style={{color:'#6fe8ff'}}>DOES NOT AUTHORIZE THE CONSEQUENCE.</span></h1>
    <p style={{maxWidth:980,fontSize:'clamp(18px,2.2vw,26px)',lineHeight:1.55,color:'#b5cbc5'}}>A bounded fungal-bioaerosol case showing why a measurement, even when technically valid, does not by itself establish source attribution, intervention authority, or present standing to change a building.</p>
   </header>

   <section style={{padding:'clamp(28px,5vw,52px)',border:'1px solid rgba(98,240,196,.24)',borderRadius:24,background:'rgba(2,17,17,.9)'}}>
    <small style={{color:'#62f0c4',fontWeight:950,letterSpacing:'.16em'}}>PEER-REVIEWED EVIDENCE BOUNDARY</small>
    <h2 style={{fontSize:'clamp(32px,5vw,58px)',letterSpacing:'-.045em',margin:'10px 0'}}>Indoor vegetation is not one exposure condition.</h2>
    <p style={{color:'#abc2bb',lineHeight:1.75,fontSize:17,maxWidth:1000}}>Soto, Altamirano and Ciric (2026) systematically reviewed seven studies that directly measured airborne fungal bioaerosols around indoor vegetation. Across potted plants, passive green walls and active biofiltration, vegetation was not consistently associated with increased airborne mould. Several studies reported unchanged or lower concentrations. Where increases occurred, substrate, irrigation, forced airflow and building conditions mattered.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:12,marginTop:22}}>
     {[['7','eligible quantitative studies'],['3','plant-system contexts'],['3,540','records initially identified'],['OPEN','question — not a universal causal rule']].map(([a,b])=><article key={b} style={card}><strong style={{display:'block',fontSize:32,color:'#6fe8ff'}}>{a}</strong><span style={{color:'#94ada6'}}>{b}</span></article>)}
    </div>
    <p style={{fontSize:12,color:'#7f9992',marginTop:18}}>SOURCE · Jorge Ignacio Soto, Hector Altamirano & Lena Ciric · Journal of Physics: Conference Series 3302 (2026) 012081 · DOI 10.1088/1742-6596/3302/1/012081. Independent TA-14 technical interpretation; not an author or IOP endorsement.</p>
   </section>

   <section style={{marginTop:26,padding:'clamp(28px,5vw,52px)',border:'1px solid rgba(111,232,255,.22)',borderRadius:24,background:'rgba(3,16,21,.92)'}}>
    <small style={{color:'#6fe8ff',fontWeight:950,letterSpacing:'.16em'}}>THE ATTRIBUTION PROBLEM</small>
    <h2 style={{fontSize:'clamp(32px,5vw,58px)',letterSpacing:'-.045em',margin:'10px 0'}}>What does the building actually know?</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10,marginTop:22}}>
     {[['MEASUREMENT','A fungal concentration was observed.'],['METHOD','What sampling method and detection boundary produced it?'],['MOISTURE','What were humidity, irrigation and substrate conditions?'],['AIRFLOW','Was air forced through growing media? What was HVAC state?'],['ATTRIBUTION','Foliage, substrate, outdoor air, filtration and disturbance are not interchangeable causes.'],['TIME','Does the evidence still describe the condition at the contemplated moment of action?']].map(([a,b])=><article key={a} style={card}><b style={{color:'#62f0c4'}}>{a}</b><p style={{color:'#9db7b0',lineHeight:1.6,fontSize:13}}>{b}</p></article>)}
    </div>
   </section>

   <section style={{marginTop:26,padding:'clamp(28px,5vw,52px)',border:'1px solid rgba(255,209,92,.23)',borderRadius:24,background:'rgba(17,14,4,.78)'}}>
    <small style={{color:'#ffd15c',fontWeight:950,letterSpacing:'.16em'}}>INTERACTIVE AIR RECORD</small>
    <h2 style={{fontSize:'clamp(32px,5vw,58px)',letterSpacing:'-.045em',margin:'10px 0'}}>Keep the question fixed. Change the evidence context.</h2>
    <p style={{color:'#b9b39f',lineHeight:1.7,maxWidth:930}}>Select a presented state. The exercise does not diagnose a building or prescribe treatment. It exposes which facts would have to survive in an Atmospheric Integrity Record before a consequential claim could be evaluated.</p>
    <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'20px 0'}}>{scenarios.map((x,n)=><button key={x.label} onClick={()=>setI(n)} style={{padding:'11px 14px',cursor:'pointer',borderRadius:999,fontWeight:950,border:n===i?'1px solid #ffd15c':'1px solid rgba(255,209,92,.2)',background:n===i?'rgba(255,209,92,.12)':'rgba(12,10,4,.7)',color:n===i?'#ffe28a':'#9f987c'}}>{x.label}</button>)}</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:14}}>
     <article style={card}><small style={{color:'#789f98'}}>PRESENTED AIR RECORD</small><h3 style={{fontSize:28,color:'#6fe8ff'}}>{s.fungi}</h3><dl>{[['VEGETATION',s.plants],['SUBSTRATE',s.substrate],['AIRFLOW',s.airflow],['HUMIDITY',s.humidity],['PROVENANCE',s.provenance]].map(([a,b])=><div key={a} style={{padding:'10px 0',borderTop:'1px solid rgba(255,255,255,.06)'}}><dt style={{fontSize:10,color:'#789f98',fontWeight:900}}>{a}</dt><dd style={{margin:'4px 0 0',color:'#d9e9e5'}}>{b}</dd></div>)}</dl></article>
     <article style={{...card,borderColor:'rgba(255,209,92,.3)'}}><small style={{color:'#9b9273'}}>TA-14 BOUNDED DISPOSITION</small><strong style={{display:'block',fontSize:'clamp(38px,6vw,68px)',margin:'12px 0',color:s.result==='HOLD'?'#ffd15c':s.result==='ESCALATE'?'#b9a7ff':'#6fe8ff'}}>{s.result}</strong><p style={{color:'#c7c0aa',lineHeight:1.7}}>{s.why}</p></article>
    </div>
   </section>

   <section style={{marginTop:26,padding:'clamp(28px,5vw,52px)',border:'1px solid rgba(98,240,196,.22)',borderRadius:24,background:'rgba(2,15,15,.92)'}}>
    <small style={{color:'#62f0c4',fontWeight:950,letterSpacing:'.16em'}}>EVIDENCE → ACTION</small>
    <h2 style={{fontSize:'clamp(32px,5vw,58px)',letterSpacing:'-.045em',margin:'10px 0'}}>A correct observation still cannot authorize itself.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10,marginTop:20}}>{[
     ['01 · DETECT','Airborne fungal event observed.'],['02 · VALIDATE','Method, identity, timing and continuity checked.'],['03 · ATTRIBUTE','Competing source explanations remain visible.'],['04 · PROPOSE','State the exact building consequence.'],['05 · AUTHORITY','Identify who or what may authorize it.'],['06 · REVALIDATE','Confirm evidence and conditions still stand now.'],['07 · COMMIT','ALLOW / HOLD / DENY / ESCALATE.'],['08 · OUTCOME','Preserve what actually happened; new chain thereafter.']
    ].map(([a,b])=><article key={a} style={card}><b style={{color:'#6fe8ff'}}>{a}</b><p style={{color:'#9db7b0',fontSize:13,lineHeight:1.55}}>{b}</p></article>)}</div>
   </section>

   <section style={{marginTop:26,padding:'clamp(28px,5vw,52px)',border:'1px solid rgba(180,148,255,.22)',borderRadius:24,background:'rgba(8,9,19,.9)'}}>
    <small style={{color:'#b9a7ff',fontWeight:950,letterSpacing:'.16em'}}>AIR ≠ PAIR ≠ DIAGNOSIS</small>
    <h2 style={{fontSize:'clamp(32px,5vw,58px)',letterSpacing:'-.045em',margin:'10px 0'}}>Building evidence and person-centered exposure chronology remain bounded records.</h2>
    <p style={{color:'#aaa8bd',fontSize:17,lineHeight:1.75,maxWidth:1000}}>AIR can preserve place-based atmospheric conditions and their context. PAIR can preserve a person-centered chronology across places. Association between the two does not silently establish medical diagnosis, individual causation, regulatory finding, or intervention authority.</p>
   </section>

   <section style={{marginTop:26,padding:'clamp(30px,5vw,56px)',textAlign:'center',border:'1px solid rgba(111,232,255,.25)',borderRadius:24,background:'linear-gradient(145deg,rgba(5,31,39,.94),rgba(2,12,16,.98))'}}>
    <small style={{color:'#6fe8ff',fontWeight:950,letterSpacing:'.16em'}}>THE CONSEQUENCE BOUNDARY</small>
    <h2 style={{fontSize:'clamp(38px,6vw,72px)',letterSpacing:'-.055em',margin:'12px auto',maxWidth:1000}}>THE NUMBER MAY BE TRUE.<br/><span style={{color:'#62f0c4'}}>THE CONSEQUENCE STILL HAS TO EARN STANDING.</span></h2>
    <p style={{color:'#a9c0ba',lineHeight:1.7,maxWidth:850,margin:'0 auto'}}>No admissible evidence. No admissible execution. And admissible evidence alone is not intervention authority.</p>
   </section>
  </div>
 </main>
}
