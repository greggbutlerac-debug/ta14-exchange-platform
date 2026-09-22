'use client';

import Link from 'next/link';
import { useState } from 'react';

const rules=[
['01','PERSISTENT IDENTITY','The governed object must be unambiguously addressable across systems.'],
['02','CURRENT REALITY','The relevant present state of the object must be available and attributable.'],
['03','EXPLICIT CONSEQUENCE','The proposed change, action, or outcome must be stated before governance.'],
['04','EVIDENCE + PROVENANCE','Supporting evidence must be addressable with its source and continuity.'],
['05','AUTHORITY','The authority being asserted for proposal, approval, and execution must be identifiable.'],
['06','CURRENT STANDING','Authority and evidence must still apply to this object, context, and moment.'],
['07','ATTACHED DETERMINATION','The TA-14 determination must return to the same governed object and proposition.'],
['08','EXECUTION ≠ DETERMINATION','ALLOW establishes a bounded determination. It does not itself operate the asset.'],
];
const graph=[
['OWNER NEED','The governed purpose and required outcome.'],
['GOVERNED OBJECT','Persistent identity establishes exactly what is being discussed.'],
['CURRENT REALITY','What is true about the object now.'],
['PROPOSED CONSEQUENCE','What is proposed to become real.'],
['EVIDENCE + PROVENANCE','What supports the proposition and where it came from.'],
['AUTHORITY','Who or what is authorized for this consequence.'],
['STANDING / CONTEXT','Whether that evidence and authority still apply now.'],
['TA-14 BOUNDARY','Admissibility · Authority · Standing · Now'],
['OUTCOME / NEW REALITY','What actually happens becomes the next record.'],
];

export default function GovernedConnectionProfile(){
 const [state,setState]=useState<'READY'|'HOLD'|'ALLOW'>('READY');
 return <main style={{minHeight:'100vh',padding:'48px 22px 100px',background:'radial-gradient(circle at 82% 4%,rgba(66,211,255,.16),transparent 28%),radial-gradient(circle at 8% 42%,rgba(127,240,189,.09),transparent 30%),linear-gradient(180deg,#02070d,#06111c 50%,#02070d)',color:'#eef7fb',fontFamily:'Inter,system-ui,sans-serif'}}>
 <div style={{maxWidth:1220,margin:'0 auto'}}>
 <nav style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',paddingBottom:20,borderBottom:'1px solid rgba(113,231,255,.14)'}}><Link href="/registry/ta-14-admissible-execution-architecture/showcase/cross-architecture-revalidation" style={{color:'#9edff0',textDecoration:'none',fontWeight:800}}>← Cross-Architecture Showcase</Link><Link href="/registry/ta-14-admissible-execution-architecture" style={{color:'#91a8b7',textDecoration:'none'}}>AEA Registry →</Link></nav>

 <section style={{marginTop:26,padding:'clamp(34px,6vw,70px)',border:'1px solid rgba(113,231,255,.22)',borderRadius:30,background:'linear-gradient(145deg,rgba(8,35,52,.96),rgba(5,14,24,.98) 55%,rgba(19,24,54,.92))',boxShadow:'0 36px 110px rgba(0,0,0,.42)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.22em',color:'#78e8ff'}}>TA-14 · PUBLIC TECHNICAL SHOWROOM · KNOWLEDGE GRAPH</div>
 <h1 style={{fontSize:'clamp(45px,7.4vw,88px)',lineHeight:.94,letterSpacing:'-.055em',margin:'20px 0 22px'}}>GOVERNED<br/><span style={{color:'#7ff0bd'}}>CONNECTION PROFILE</span></h1>
 <p style={{fontSize:'clamp(18px,2.2vw,26px)',lineHeight:1.48,maxWidth:950,color:'#b7c9d5',margin:0}}>What must a building, asset, or city expose so independent systems can connect meaningfully — and TA-14 can govern a proposed consequence at the boundary between proposal and reality?</p>
 </section>

 <section style={{margin:'22px 0',padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(127,240,189,.22)',borderRadius:26,background:'rgba(5,18,27,.88)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#7ff0bd'}}>THE CONNECTION PATTERN</div>
 <h2 style={{fontSize:'clamp(29px,4.6vw,52px)',letterSpacing:'-.04em',margin:'10px 0 8px'}}>Independent systems. Shared meaning. Governed consequence.</h2>
 <p style={{color:'#9eb3c0',lineHeight:1.6,maxWidth:900}}>This is not a requirement that a building become a TA-14 system. It is a minimum governed relationship that lets a semantic model identify the object, expose the proposition and supporting context, and receive a bounded governance determination back onto that same object.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10,marginTop:22}}>{[['RDF / TURTLE','Shared meaning + relationships'],['PERSISTENT IDs','Shared reference'],['API','Two-way interaction'],['TA-14','Consequence governance'],['SEMANTIC MODEL','Visible governed state']].map(([a,b],i)=><div key={a} style={{padding:18,borderRadius:15,border:'1px solid rgba(113,231,255,.18)',background:'rgba(3,10,17,.58)'}}><div style={{fontSize:10,color:'#78e8ff',fontWeight:900}}>0{i+1}</div><b style={{display:'block',marginTop:7}}>{a}</b><span style={{display:'block',marginTop:6,color:'#8fa6b5',fontSize:13}}>{b}</span></div>)}</div>
 </section>

 <section style={{padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(113,231,255,.16)',borderRadius:26,background:'rgba(4,13,22,.9)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#78e8ff'}}>MINIMUM KNOWLEDGE GRAPH</div>
 <div style={{marginTop:22,display:'grid',gap:8}}>{graph.map(([a,b],i)=><div key={a} style={{display:'grid',gridTemplateColumns:'48px minmax(170px,260px) 1fr',gap:14,alignItems:'center',padding:'14px 16px',borderRadius:14,border:'1px solid rgba(113,231,255,.12)',background:'rgba(2,9,15,.5)'}}><span style={{color:'#526e7e',fontWeight:900}}>{String(i+1).padStart(2,'0')}</span><b style={{color:i===7?'#7ff0bd':'#e8f6fa'}}>{a}</b><span style={{color:'#91a8b7',fontSize:13,lineHeight:1.45}}>{b}</span></div>)}</div>
 </section>

 <section style={{marginTop:22,padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(127,240,189,.24)',borderRadius:26,background:'linear-gradient(135deg,rgba(17,68,55,.24),rgba(5,17,28,.94))'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#7ff0bd'}}>RUN ONE · AHU-17</div>
 <h2 style={{fontSize:'clamp(30px,4.6vw,52px)',letterSpacing:'-.04em',margin:'10px 0'}}>Attach governance to the object.</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10}}>
 {[
 ['OBJECT','AHU-17 · persistent identity'],
 ['CURRENT REALITY','Supply-air condition outside expected range'],
 ['PROPOSAL','Change operating setpoint'],
 ['EVIDENCE','Sensor + model + provenance addressable'],
 ['AUTHORITY','Operator authority asserted'],
 ['STANDING','Current context requires validation'],
 ].map(([a,b])=><div key={a} style={{padding:16,borderRadius:14,border:'1px solid rgba(127,240,189,.16)',background:'rgba(2,10,17,.52)'}}><div style={{fontSize:10,fontWeight:950,color:'#7ff0bd',letterSpacing:'.1em'}}>{a}</div><div style={{marginTop:7,color:'#c5d7df',lineHeight:1.45}}>{b}</div></div>)}
 </div>
 <div style={{marginTop:22,padding:22,borderRadius:18,border:'1px solid rgba(127,240,189,.28)',background:'rgba(1,8,13,.66)',textAlign:'center'}}>
 <div style={{fontSize:12,color:'#9ab0bc',fontWeight:900,letterSpacing:'.12em'}}>TA-14 CONSEQUENCE BOUNDARY</div>
 <div style={{fontSize:'clamp(21px,3vw,34px)',fontWeight:950,margin:'12px 0'}}>Does this consequence have sufficient admissibility, authority, and standing to become reality <span style={{color:'#7ff0bd'}}>NOW?</span></div>
 <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginTop:18}}>
 <button onClick={()=>setState('HOLD')} style={{cursor:'pointer',padding:'12px 22px',borderRadius:999,border:'1px solid #f4c66a',background:'rgba(244,198,106,.09)',color:'#f4c66a',fontWeight:950}}>SIMULATE CHANGED CONTEXT</button>
 <button onClick={()=>setState('ALLOW')} style={{cursor:'pointer',padding:'12px 22px',borderRadius:999,border:'1px solid #7ff0bd',background:'rgba(127,240,189,.09)',color:'#7ff0bd',fontWeight:950}}>SIMULATE SUFFICIENT STATE</button>
 </div>
 {state!=='READY'&&<div style={{marginTop:22,fontSize:'clamp(30px,5vw,58px)',fontWeight:1000,color:state==='HOLD'?'#f4c66a':'#7ff0bd'}}>{state} · AHU-17</div>}
 {state==='HOLD'&&<p style={{color:'#c7b789',maxWidth:760,margin:'10px auto 0',lineHeight:1.55}}>The determination is attached to this object and proposition. The prior state does not silently travel forward. Revalidation is required against the changed reality.</p>}
 {state==='ALLOW'&&<p style={{color:'#9fcbb8',maxWidth:760,margin:'10px auto 0',lineHeight:1.55}}>ALLOW is a bounded governance determination. It is not the execution itself. The authorized operating system retains control of execution.</p>}
 </div>
 </section>

 <section style={{marginTop:22,padding:'clamp(26px,4vw,44px)',border:'1px solid rgba(113,231,255,.16)',borderRadius:26,background:'rgba(4,13,22,.9)'}}>
 <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#78e8ff'}}>EIGHT MINIMUM RULES</div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:10,marginTop:20}}>{rules.map(([n,a,b])=><div key={n} style={{padding:18,borderRadius:14,border:'1px solid rgba(113,231,255,.12)',background:'rgba(2,9,15,.5)'}}><span style={{fontSize:10,color:'#78e8ff',fontWeight:950}}>{n}</span><b style={{display:'block',marginTop:6}}>{a}</b><p style={{margin:'7px 0 0',color:'#91a8b7',fontSize:13,lineHeight:1.5}}>{b}</p></div>)}</div>
 </section>

 <section style={{marginTop:22,padding:'30px',borderRadius:24,border:'1px solid rgba(127,240,189,.2)',textAlign:'center',background:'rgba(10,31,31,.42)'}}><div style={{fontSize:'clamp(24px,4vw,44px)',fontWeight:950,letterSpacing:'-.03em'}}>The technologies may change.<br/><span style={{color:'#7ff0bd'}}>The governed process does not.</span></div><p style={{color:'#92a9b6',maxWidth:800,margin:'14px auto 0',lineHeight:1.6}}>RDF/Turtle, persistent identity, knowledge graphs, APIs, CloudBIM, open-source or proprietary tools can participate without collapsing into one product. TA-14 governs the bounded consequence after meaning, evidence, authority, and current context are available.</p></section>
 </div></main>
}