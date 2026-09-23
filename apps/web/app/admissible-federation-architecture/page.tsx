'use client';

import Link from 'next/link';
import {useState} from 'react';
import GuidedShowroom from '../components/GuidedShowroom';

const decisions=[
 ['ACCEPT_NARROWED','Receiver accepts only a provably narrower authority context.'],
 ['HOLD','Required present evidence or authority is not established.'],
 ['REJECT','Receiver refuses the presented context and preserves refusal evidence.'],
 ['SUSPEND','Previously usable context is temporarily unusable.'],
 ['ESCALATE','Additional evidence or authority is required while safe posture is preserved.'],
];
const failures=[
 ['STALE CONTEXT','SUSPEND','Cryptographic validity does not establish present-tense freshness.'],
 ['BROADENING','INHERITANCE_FAILURE','A descendant may not exceed source authority.'],
 ['TRUST AS AUTHORITY','REJECT','Trust, identity and compatibility do not create execution authority.'],
 ['RECEIPT TAMPER','FAIL_CLOSED','A projected decision that differs from the signed receipt cannot be relied on.'],
 ['CHANGED CONDITION','REVALIDATION_REQUIRED','A prior determination cannot survive a material changed condition.'],
];
const blocked=['LOCAL LEASE','LOCAL CAPSULE','COMMIT','EXECUTION','EFFECT'];

export default function AFAShowroom(){
 const [decision,setDecision]=useState(0);
 const [failure,setFailure]=useState(0);
 const [step,setStep]=useState(0);
 const [receipt,setReceipt]=useState(false);
 const [testRun,setTestRun]=useState(false);
 const [blockedAttempt,setBlockedAttempt]=useState('');
 const [boundaryStep,setBoundaryStep]=useState(0);
 const [changedCondition,setChangedCondition]=useState(false);
 const [sandboxRun,setSandboxRun]=useState(false);
 const [reverseDirection,setReverseDirection]=useState(false);
 const [lab,setLab]=useState({identity:true,integrity:true,freshness:true,scope:true,revocation:true,localStanding:true});
 const labResult=!lab.identity||!lab.integrity?'REJECT':!lab.revocation?'SUSPEND':!lab.localStanding?'ESCALATE':!lab.freshness||!lab.scope?'HOLD':'ACCEPT_NARROWED';
 const toggleLab=(k:keyof typeof lab)=>setLab(v=>({...v,[k]:!v[k]}));
 const d=decisions[decision], f=failures[failure];
 return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0,#0a2730 0,#031015 35%,#010609 78%)',color:'#efffff',fontFamily:'Inter,system-ui,sans-serif'}}>
  <div style={{width:'min(1220px,calc(100% - 34px))',margin:'0 auto',padding:'26px 0 100px'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:18,alignItems:'center',paddingBottom:22,borderBottom:'1px solid #17363e'}}>
    <Link href="/" style={{color:'#fff',textDecoration:'none',fontWeight:950,letterSpacing:'.13em'}}>TA-14 EXCHANGE</Link>
    <span style={{fontSize:10,color:'#71e7df',fontWeight:900,letterSpacing:'.14em'}}>AFA v1.0-RC1 · REGISTERED · TA-14-AIGR-000042</span>
   </nav>
 <div style={{display:'flex',flexWrap:'wrap',gap:8,margin:'18px 0 28px',padding:'12px',border:'1px solid #24464d',borderRadius:12,background:'rgba(3,15,21,.82)'}}>
<Link href="/federation-authority" style={{padding:'10px 12px',border:'1px solid #31545b',borderRadius:8,color:'#d7eeee',textDecoration:'none',fontSize:10,fontWeight:900}}>FAMILY HOME</Link>
<Link href="/admissible-federation-architecture" style={{padding:'10px 12px',border:'1px solid #31545b',borderRadius:8,color:'#d7eeee',textDecoration:'none',fontSize:10,fontWeight:900}}>EXPLORE AFA</Link>
 <Link href="/federation-authority/foundations" style={{padding:'10px 12px',border:'1px solid #31545b',borderRadius:8,color:'#d7eeee',textDecoration:'none',fontSize:10,fontWeight:900}}>EXPLORE AVP</Link>
<Link href="/execution-authority-boundary-architecture" style={{padding:'10px 12px',border:'1px solid #31545b',borderRadius:8,color:'#d7eeee',textDecoration:'none',fontSize:10,fontWeight:900}}>EXPLORE EABA</Link>
<Link href="/authority-journey" style={{padding:'10px 12px',borderRadius:8,background:'#71e7df',color:'#031216',textDecoration:'none',fontSize:10,fontWeight:950}}>RUN AUTHORITY JOURNEY</Link>
<Link href="/afa-eaba-operational-challenge" style={{padding:'10px 12px',border:'1px solid #e7c76e',borderRadius:8,color:'#e7c76e',textDecoration:'none',fontSize:10,fontWeight:900}}>INSPECT FROZEN CHALLENGE</Link>
</div>

   <section style={{padding:'82px 0 54px',maxWidth:1050}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.2em',color:'#71e7df'}}>ADMISSIBLE FEDERATION ARCHITECTURE</div>
    <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:16}}>{['REGISTRY · TA-14-AIGR-000042','STATUS · REGISTERED RC1 / NOT YET FROZEN','STEWARD · TA-14 AUTHORITY · GREGGORY DON BUTLER','AUTHORITY OBJECT · AVP V1.0.2','FOUNDING PROFILE · AFA-IP-001'].map(x=><span key={x} style={{padding:'7px 9px',border:'1px solid #244b52',borderRadius:7,color:'#91aeb5',fontSize:9,fontWeight:900}}>{x}</span>)}</div>
    <h1 style={{fontSize:'clamp(48px,8.3vw,104px)',lineHeight:.91,letterSpacing:'-.055em',margin:'18px 0 28px'}}>AUTHORITY CONTEXT<br/><span style={{color:'#71e7df'}}>MAY CROSS.</span><br/>EXECUTION AUTHORITY<br/><span style={{color:'#e7c76e'}}>MUST BE ESTABLISHED LOCALLY.</span></h1>
    <p style={{fontSize:19,lineHeight:1.7,color:'#a8c1c8',maxWidth:860}}>AFA governs the seam between independently governed domains. It permits bounded authority context to travel while preserving a hard architectural barrier before local consequence.</p>
    <div style={{display:'flex',flexWrap:'wrap',gap:10,marginTop:28}}>
     <a href="https://doi.org/10.5281/zenodo.22846133" target="_blank" rel="noreferrer" style={{padding:'13px 16px',borderRadius:9,background:'#71e7df',color:'#031216',fontWeight:950,fontSize:11,textDecoration:'none'}}>OPEN CANONICAL RC1 · DOI 10.5281/zenodo.22846133 ↗</a>
     <Link href="/workspace/ai-governance/registry/records/TA-14-AIGR-000042" style={{padding:'13px 16px',border:'1px solid #e7c76e',borderRadius:9,color:'#e7c76e',fontWeight:950,fontSize:11,textDecoration:'none'}}>OPEN PERMANENT REGISTRY RECORD →</Link><Link href="/federation-authority" style={{padding:'13px 16px',border:'1px solid #28545b',borderRadius:9,color:'#d7eeee',fontWeight:900,fontSize:11,textDecoration:'none'}}>FEDERATION & AUTHORITY →</Link>
    </div>
   </section>

   <section id="sandbox" style={{padding:'34px',margin:'0 0 34px',border:'1px solid #2a555c',borderRadius:22,background:'linear-gradient(135deg,rgba(12,54,61,.30),rgba(4,20,27,.94))',boxShadow:'0 28px 90px rgba(0,0,0,.28)'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.18em',color:'#71e7df'}}>THE CONNECTION SANDBOX</div>
    <h2 style={{fontSize:'clamp(36px,6vw,68px)',letterSpacing:'-.045em',lineHeight:1,margin:'12px 0 18px'}}>LINKED ✓ → CONNECTED ✓ → <span style={{color:'#e7c76e'}}>EXECUTE ?</span></h2>
    <p style={{fontSize:17,color:'#a9c0c6',lineHeight:1.7,maxWidth:860}}>Same building object. Governed connection. One proposed consequence. The Connection Profile gets the request to the boundary. From there, the public question is simply TA-14.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:9,margin:'24px 0'}}>
     {[['LINKED','BUILDING OBJECT ✓'],['CONNECTION PROFILE','CONNECTED ✓'],['TA-14',sandboxRun?'DETERMINING NOW':'READY'],['CONSEQUENCE',sandboxRun?'HOLD':'?']].map((x,i)=><div key={x[0]} style={{padding:20,borderRadius:12,border:'1px solid '+(i>=2?'#6b5829':'#24555d'),background:'#04151c'}}><small style={{display:'block',color:'#8fa9af',fontSize:9}}>{x[0]}</small><strong style={{display:'block',marginTop:7,color:i>=2?'#e7c76e':'#71e7df'}}>{x[1]}</strong></div>)}
    </div>
    <div style={{padding:22,border:'1px solid #214a51',borderRadius:14,background:'#020b0f'}}>
     <small style={{color:'#8fa9af'}}>PROPOSED ACTION</small><strong style={{display:'block',fontSize:26,margin:'8px 0 16px'}}>Change building setpoint to 72°F.</strong>
     <button onClick={()=>setSandboxRun(true)} style={{cursor:'pointer',padding:'13px 17px',border:0,borderRadius:9,background:'#71e7df',color:'#031216',fontWeight:950}}>RUN THROUGH TA-14 →</button>
     {sandboxRun&&<div style={{marginTop:20,padding:20,border:'1px solid #e7c76e',borderRadius:12,background:'rgba(91,65,12,.18)'}}><strong style={{display:'block',fontSize:34,color:'#e7c76e'}}>HOLD</strong><p style={{color:'#d4c7a2',lineHeight:1.7}}>Connection established. Execution authority is not yet established.</p><p style={{color:'#eef7fb',fontWeight:850,lineHeight:1.65}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p></div>}
    </div>
    <div style={{marginTop:18,padding:'16px 18px',border:'1px dashed #71e7df',borderRadius:11,textAlign:'center',fontWeight:950,color:'#dffdfa'}}>LINKING IS NOT CONNECTING. CONNECTING IS NOT AUTHORITY TO EXECUTE.</div>
    <a href="#architecture" style={{display:'inline-block',marginTop:18,color:'#71e7df',fontSize:11,fontWeight:950,textDecoration:'none'}}>EXPLORE HOW TA-14 WORKS ↓</a>
   </section>

   <div id="architecture"></div>

   <GuidedShowroom
    eyebrow="AFA · GUIDED SHOWROOM"
    title="Understand federation before you move the Passport."
    intro="AFA is about crossing between independently governed domains without pretending that context, trust, identity, or acceptance automatically becomes local permission to act."
    accent="#71e7df"
    gold="#e7c76e"
    steps={[
      {label:'01 · ORIGIN',title:'Domain A has bounded authority context',plain:'The issuing domain knows what it is presenting, under what version, purpose, lineage, and authority state.',why:'Nothing here proves that another domain may execute anything.'},
      {label:'02 · PRESENT',title:'The Authority Passport crosses',plain:'A bounded authority context is presented at a named federation boundary. The crossing carries context, not local execution entitlement.',result:'CONTEXT MAY CROSS · EXECUTION AUTHORITY DOES NOT'},
      {label:'03 · VERIFY',title:'The receiver checks what arrived',plain:'Identity, integrity, version, freshness, revocation context, scope, and interface semantics are evaluated before reliance.',why:'Successful transport is not successful authorization.'},
      {label:'04 · DETERMINE',title:'The receiving domain decides',plain:'The receiver may accept narrowly, HOLD, reject, suspend, or escalate. The receiving domain keeps its right to refuse.',result:'ACCEPTANCE STILL DOES NOT GRANT COMMIT OR EXECUTION AUTHORITY'},
      {label:'05 · TERMINATE',title:'Federation stops before local consequence',plain:'The federation interaction ends. Local lease, local capsule, commit, execution, and effect must be established under the receiving domain’s own governance.',why:'This is the seam AFA protects.'},
    ]}
   />

   <section style={{padding:'30px',border:'1px solid #20525a',borderRadius:22,background:'rgba(4,20,27,.88)',boxShadow:'0 28px 90px rgba(0,0,0,.35)'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.18em',color:'#71e7df'}}>INTERACTIVE FEDERATION SEAM</div>
    <h2 style={{fontSize:34,margin:'10px 0 24px'}}>Move the Passport. Watch where authority stops.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10,alignItems:'stretch'}}>
     {['DOMAIN A','AUTHORITY PASSPORT','FEDERATION BOUNDARY','RECEIVING DETERMINATION','STOP'].map((x,i)=><button key={x} onClick={()=>setStep(i)} style={{cursor:'pointer',padding:'20px 14px',borderRadius:12,border:i===step?'1px solid #71e7df':'1px solid #21444b',background:i===step?'rgba(45,141,143,.2)':'#06171d',color:i===step?'#8ff5ee':'#9cb6bd',fontWeight:950,fontSize:11}}>{i<4?x+'  →':x}</button>)}
    </div>
    <div style={{marginTop:18,padding:20,borderRadius:12,background:'#020b0f',border:'1px solid #18363d'}}>
     <strong style={{color:step===4?'#e7c76e':'#71e7df'}}>{['ORIGIN','PRESENT','VERIFY / RECEIVE','DETERMINE','TERMINATE'][step]}</strong>
     <p style={{color:'#9eb6bd',lineHeight:1.65,marginBottom:0}}>{[
      'Domain A possesses bounded authority context. Nothing here grants Domain B permission to act.',
      'The Authority Passport is presented at a named FederationBoundary.',
      'Integrity, identity, version, freshness and interface semantics are checked.',
      'The receiver records a bounded seam decision. Even ACCEPT is not execution permission.',
      'The federation interaction ends. Local execution entitlement does not cross this line.'
     ][step]}</p>
    </div>
    <div style={{display:'flex',gap:10,marginTop:18,flexWrap:'wrap'}}><button onClick={()=>setStep(Math.min(4,step+1))} style={{cursor:'pointer',padding:'12px 16px',border:0,borderRadius:9,background:'#71e7df',color:'#031216',fontWeight:950}}>PRESENT / ADVANCE PASSPORT →</button><button onClick={()=>setStep(0)} style={{cursor:'pointer',padding:'12px 16px',border:'1px solid #28545b',borderRadius:9,background:'transparent',color:'#cde4e8',fontWeight:900}}>RESET</button></div>
    <div style={{marginTop:18,padding:'15px 18px',border:'1px dashed #e7c76e',borderRadius:10,color:'#e7c76e',fontSize:11,fontWeight:950,letterSpacing:'.08em',textAlign:'center'}}>STOP CONDITION · NO LOCAL LEASE · NO LOCAL CAPSULE · NO COMMIT · NO EXECUTION · NO EFFECT</div>
   </section>

   <section style={{padding:'72px 0 22px'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#71e7df'}}>DECISION CONSOLE</div>
    <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'10px 0'}}>The receiver keeps the right to refuse.</h2>
    <div style={{display:'flex',flexWrap:'wrap',gap:8,margin:'20px 0'}}>{decisions.map((x,i)=><button key={x[0]} onClick={()=>setDecision(i)} style={{cursor:'pointer',padding:'11px 13px',borderRadius:9,border:i===decision?'1px solid #71e7df':'1px solid #24464d',background:i===decision?'rgba(45,141,143,.18)':'#041318',color:i===decision?'#8ff5ee':'#a2b8be',fontWeight:900,fontSize:10}}>{x[0]}</button>)}</div>
    <div style={{padding:25,border:'1px solid #214a51',borderRadius:15,background:'#04151c'}}><strong style={{fontSize:25,color:'#71e7df'}}>{d[0]}</strong><p style={{fontSize:15,color:'#a6bcc2',lineHeight:1.7}}>{d[1]}</p><b style={{fontSize:11,color:'#e7c76e'}}>EXECUTION AUTHORITY: NOT ESTABLISHED BY FEDERATION</b><div style={{marginTop:18}}><button onClick={()=>setReceipt(true)} style={{cursor:'pointer',padding:'11px 14px',borderRadius:8,border:'1px solid #71e7df',background:'rgba(45,141,143,.14)',color:'#8ff5ee',fontWeight:950}}>GENERATE BOUNDARY RECEIPT</button></div>{receipt&&<pre style={{marginTop:16,padding:16,overflow:'auto',border:'1px solid #24464d',borderRadius:10,background:'#02090c',color:'#9bded9',fontSize:11,lineHeight:1.6}}>{`ReceivingDetermination {\n  decision: "${d[0]}",\n  boundary: "AFA-IP-001",\n  receipt: "INTEGRITY_BOUND",\n  federation_state: "TERMINATED",\n  execution_authority: "NOT_ESTABLISHED"\n}`}</pre>}</div>
   </section>

   <section id="authority-lab" style={{padding:'72px 0 30px'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#71e7df'}}>LIVE RECEIVING-DOMAIN LAB</div>
    <h2 style={{fontSize:'clamp(34px,5vw,58px)',letterSpacing:'-.04em',lineHeight:1.02,margin:'10px 0'}}>Change the authority context. Watch the receiving decision change.</h2>
    <p style={{color:'#9fb7be',lineHeight:1.72,maxWidth:900}}>Start with a valid crossing. Break one condition at a time. AFA does not silently repair the Passport, inherit permission, or convert successful transport into execution authority.</p>
    <div style={{display:'grid',gridTemplateColumns:'minmax(280px,1.2fr) minmax(260px,.8fr)',gap:14,marginTop:24}}>
     <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:8}}>
      {([['identity','ISSUER IDENTITY'],['integrity','PASSPORT INTEGRITY'],['freshness','FRESHNESS'],['scope','SCOPE'],['revocation','REVOCATION STATUS'],['localStanding','LOCAL STANDING']] as const).map(([k,label])=><button key={k} onClick={()=>toggleLab(k)} style={{cursor:'pointer',padding:17,textAlign:'left',borderRadius:10,border:'1px solid '+(lab[k]?'#3b7d78':'#8b4937'),background:lab[k]?'rgba(45,141,143,.13)':'rgba(86,25,13,.22)',color:lab[k]?'#8ff5ee':'#ffb29a',fontWeight:950}}><span>{lab[k]?'●':'×'} {label}</span><small style={{display:'block',marginTop:7,color:'#8fa9af'}}>{lab[k]?'ESTABLISHED · click to break':'NOT ESTABLISHED · click to restore'}</small></button>)}
     </div>
     <div style={{padding:28,borderRadius:16,border:'1px solid '+(labResult==='ACCEPT_NARROWED'?'#71e7df':'#e7c76e'),background:'#04151c'}}>
      <small style={{color:'#8299ad'}}>RECEIVING DETERMINATION</small><strong style={{display:'block',fontSize:38,margin:'8px 0',color:labResult==='ACCEPT_NARROWED'?'#71e7df':'#e7c76e'}}>{labResult}</strong>
      <p style={{color:'#a6bcc2',lineHeight:1.7}}>{labResult==='ACCEPT_NARROWED'?'The bounded authority context may enter local assessment. Execution authority is still not established.':labResult==='REJECT'?'Identity or integrity failed. The receiving domain refuses the presented context.':labResult==='SUSPEND'?'Revocation status no longer supports continued reliance. The route is suspended.':labResult==='ESCALATE'?'Local standing is unresolved. The receiving domain preserves the safe posture and escalates.':'A required condition is not established. The receiving domain holds the route pending revalidation.'}</p>
      <div style={{padding:'12px 14px',border:'1px dashed #e7c76e',borderRadius:9,color:'#e7c76e',fontSize:10,fontWeight:950}}>EXECUTION AUTHORITY · NOT ESTABLISHED BY FEDERATION</div>
      <button onClick={()=>setLab({identity:true,integrity:true,freshness:true,scope:true,revocation:true,localStanding:true})} style={{cursor:'pointer',marginTop:14,padding:'11px 14px',borderRadius:8,border:'1px solid #28545b',background:'transparent',color:'#d7eeee',fontWeight:900}}>RESET CROSSING</button>
     </div>
    </div>
   </section>

   <section style={{padding:'70px 0',borderTop:'1px solid #143139'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#71e7df'}}>NEGATIVE SPACE REVEAL</div>
    <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'10px 0'}}>These objects cannot ride the Passport.</h2>
    <p style={{color:'#9fb7be',lineHeight:1.7,maxWidth:820}}>Successful transport, identity, trust, compatibility, receipt or acceptance never imply the receiving domain's protected consequence authority.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10,marginTop:24}}>{blocked.map(x=><button onClick={()=>setBlockedAttempt(x)} key={x} style={{cursor:'pointer',padding:'24px 15px',border:'1px solid #6a402f',borderRadius:12,background:'rgba(74,25,13,.18)',textAlign:'center',fontWeight:950,color:'#ffb29a'}}>⊘ {x}<div style={{fontSize:9,color:'#a98275',marginTop:8}}>TRY TO CROSS</div></button>)}</div>{blockedAttempt&&<div style={{marginTop:16,padding:18,border:'1px solid #8b4937',borderRadius:11,background:'rgba(86,25,13,.22)',color:'#ffb29a',fontWeight:950}}>AFA-F05 · DIRECT_EFFECTOR — DENIED · {blockedAttempt} CANNOT CROSS THE FEDERATION BOUNDARY</div>}
   </section>

   <section style={{padding:'70px 0',borderTop:'1px solid #143139'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#71e7df'}}>FAILURE LAB</div>
    <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'10px 0'}}>Attack the seam, not just the happy path.</h2>
    <div style={{display:'grid',gridTemplateColumns:'minmax(220px,.8fr) minmax(280px,1.4fr)',gap:14,marginTop:25}}>
     <div style={{display:'grid',gap:8}}>{failures.map((x,i)=><button key={x[0]} onClick={()=>{setFailure(i);setTestRun(false)}} style={{cursor:'pointer',textAlign:'left',padding:15,borderRadius:10,border:i===failure?'1px solid #71e7df':'1px solid #203f46',background:i===failure?'rgba(45,141,143,.16)':'#041318',color:i===failure?'#8ff5ee':'#a1b6bc',fontWeight:900}}>{x[0]}</button>)}</div>
     <div style={{padding:26,border:'1px solid #214a51',borderRadius:14,background:'#04151c'}}><div style={{fontSize:10,color:'#8ba2a8'}}>GOVERNED RESULT</div><strong style={{display:'block',fontSize:28,color:'#e7c76e',margin:'10px 0'}}>{f[1]}</strong><p style={{color:'#a5bbc1',lineHeight:1.7}}>{f[2]}</p><button onClick={()=>setTestRun(true)} style={{cursor:'pointer',marginTop:14,padding:'11px 14px',borderRadius:8,border:'1px solid #e7c76e',background:'transparent',color:'#e7c76e',fontWeight:950}}>RUN SHOWROOM TEST</button>{testRun&&<div style={{marginTop:18,fontSize:10,color:'#79d9d2',fontWeight:900}}>SIMULATED RESULT: {f[1]} · EXECUTION AUTHORITY: NOT ESTABLISHED · LOCAL EXECUTION OBSERVED: FALSE</div>}</div>
    </div>
   </section>

   <section style={{padding:'70px 0',borderTop:'1px solid #143139'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#71e7df'}}>COMPOSITION LAB · A → B → C</div>
    <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'10px 0'}}>Federation does not compound authority.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,marginTop:25,alignItems:'center'}}>
     {['DOMAIN A','A→B BOUNDARY','DOMAIN B','B→C BOUNDARY','DOMAIN C'].map((x,i)=><div key={x} style={{padding:'22px 10px',border:'1px solid #214a51',borderRadius:12,background:i%2?'rgba(45,141,143,.12)':'#04151c',textAlign:'center',fontSize:10,fontWeight:950,color:i%2?'#71e7df':'#dceff2'}}>{x}</div>)}
    </div>
    <p style={{color:'#9fb7be',lineHeight:1.7,marginTop:20}}>If B accepts narrowed authority from A, B may re-present only a provably preserved or narrower descendant to C. C must make its own ReceivingDetermination. B's receipt is not proof that B possessed execution authority, and neither acceptance grants C permission to act.</p>
   </section>

   <section style={{padding:'70px 0',borderTop:'1px solid #143139'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#71e7df'}}>EVIDENCE DRAWER</div>
    <h2 style={{fontSize:40,letterSpacing:'-.03em',margin:'10px 0'}}>Inspect the record behind the showroom.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(235px,1fr))',gap:11,marginTop:22}}>
     {[
      ['AFA v1.0-RC1','22-page release candidate. Not yet frozen.','https://doi.org/10.5281/zenodo.22846133'],
      ['AFA-IP-001 v0.3','TA-14-authored AVP × CNS/CP Connection Profile examination artifact · LOCAL EXERCISE / UNPUBLISHED / NON-RESOLVABLE.','/federation-authority'],
      ['15 FIXTURES','Failure-first bounded examination model.','#failure-lab'],
      ['RUNTIME STATUS','Harness implemented. Real Node/CI execution evidence pending.','#runtime'],
     ].map(([t,p,h])=><a key={t} href={h} style={{padding:20,border:'1px solid #214a51',borderRadius:13,background:'#04151c',textDecoration:'none'}}><strong style={{display:'block',color:'#71e7df',fontSize:11}}>{t}</strong><span style={{display:'block',marginTop:9,color:'#9db3b9',fontSize:12,lineHeight:1.55}}>{p}</span></a>)}
    </div>
    <div id="runtime" style={{marginTop:20,padding:18,border:'1px solid #5b4d2a',borderRadius:12,background:'rgba(42,32,8,.25)',color:'#d8c98f',fontSize:12,lineHeight:1.65}}><strong>CLAIM BOUNDARY:</strong> AFA v1.0-RC1 does not claim completed CNS/CP registry publication, proven external interoperability, TA14_RECOGNIZED implementation, transfer of execution authority, or completed runtime/CI execution evidence.</div>
   </section>

   <section id="cnscp-eaba" style={{padding:'70px 0',borderTop:'1px solid #143139'}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#71e7df'}}>CNS/CP × TA-14 · THE HANDOFF</div>
    <h2 style={{fontSize:'clamp(34px,5vw,58px)',letterSpacing:'-.04em',lineHeight:1.02,margin:'10px 0'}}>The Connection Profile stops here.<br/><span style={{color:'#e7c76e'}}>TA-14 consequence determination begins here.</span></h2>
    <p style={{color:'#a9c0c6',fontSize:16,lineHeight:1.75,maxWidth:940}}>Two independently developed architectures can meet at one boundary without either absorbing the other. CNS/CP governs whether parties may bind across an organizational boundary and the Connection Profile defines the <strong style={{color:'#eef7fb'}}>permitted crossing envelope</strong>: both the minimum that must cross for the relationship to be meaningful and the maximum that may cross without importing local execution entitlement. TA-14 does not re-determine that relationship. The receiving TA-14-governed domain independently determines whether what arrived has sufficient present standing to become protected consequence.</p>

    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:8,marginTop:28}}>
     {[
      ['01','CNS/CP','May these parties bind, under what contract and context?'],
      ['02','CONNECTION PROFILE','Minimum required crossing + maximum permitted crossing.'],
      ['03','TA-14','Does the proposed consequence have sufficient present evidence, authority and standing to become reality now?'],
      ['04','CONSEQUENCE','ALLOW · HOLD · DENY · ESCALATE before protected commit.']
     ].map((x,i)=><button key={x[0]} onClick={()=>setBoundaryStep(i)} style={{cursor:'pointer',padding:18,textAlign:'left',borderRadius:11,border:i===boundaryStep?'1px solid #e7c76e':'1px solid #214a51',background:i===boundaryStep?'rgba(112,83,18,.2)':'#04151c',color:i===boundaryStep?'#f3d989':'#a7bcc2'}}><small style={{color:'#71e7df',fontWeight:950}}>{x[0]}</small><strong style={{display:'block',margin:'7px 0',fontSize:11}}>{x[1]}</strong><span style={{fontSize:10,lineHeight:1.5}}>{x[2]}</span></button>)}
    </div>

    <div style={{marginTop:16,padding:24,border:'1px solid #2a555c',borderRadius:15,background:'#020b0f'}}>
     <div style={{fontSize:10,color:'#71e7df',fontWeight:950}}>BOUNDARY EXPLANATION</div>
     <strong style={{display:'block',fontSize:24,color:'#fff',margin:'8px 0'}}>{[
      'CNS/CP establishes the cross-boundary relationship.',
      'The Connection Profile bounds the permitted crossing envelope.',
      'TA-14 owns the independent consequence determination.',
      'The result governs the protected commit — not the prior relationship.'
     ][boundaryStep]}</strong>
     <p style={{color:'#9fb7be',lineHeight:1.7,marginBottom:0}}>{[
      'TA-14 does not reach backward and re-grade whether CNS/CP legitimately established the relationship. That remains CNS/CP ground.',
      'The minimum side says what must be present for a meaningful governed crossing. The maximum side says what may cross and where inheritance must stop. Meaning and evidence may travel; local execution entitlement does not.',
      'TA-14 receives the governed request and supporting context, then independently asks whether this exact proposed consequence has sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW.',
      'A legitimate connection can end in HOLD, DENY or ESCALATE without implying that CNS/CP or the Connection Profile failed.'
     ][boundaryStep]}</p>
    </div>

    <div style={{marginTop:22,padding:22,border:'1px dashed #6b5829',borderRadius:14,background:'rgba(74,56,12,.12)',textAlign:'center'}}><strong style={{color:'#e7c76e',fontSize:'clamp(16px,2.3vw,24px)'}}>MEANING MAY CROSS · EVIDENCE MAY CROSS · AUTHORITY CONTEXT MAY CROSS · EXECUTION AUTHORITY MUST BE ESTABLISHED LOCALLY</strong></div>

    <div style={{marginTop:28,padding:28,border:'1px solid #2a555c',borderRadius:18,background:'linear-gradient(135deg,rgba(12,54,61,.28),rgba(4,20,27,.92))'}}>
     <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#71e7df'}}>REVERSE THE DIRECTION · LIVE BOUNDARY EXAM</div>
     <h3 style={{fontSize:32,letterSpacing:'-.03em',margin:'10px 0'}}>Same parties. Same graph. Reverse the action.</h3>
     <p style={{color:'#a9c0c6',lineHeight:1.7,maxWidth:900}}>A graph can preserve identity, meaning, relationships and provenance across independently operated environments. Reverse the direction from receiving information to proposing a live building consequence and a different boundary becomes visible.</p>
     <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:8,margin:'22px 0'}}>
      {(!reverseDirection?[
       ['RE1 → TA-14','GRAPH / DATA CROSSES'],
       ['PROVENANCE','PRESERVED'],
       ['PHYSICAL CONSEQUENCE','NOT REQUESTED'],
       ['EXECUTION AUTHORITY','NOT INVOKED']
      ]:[
       ['TA-14 → PAE','CHANGE THIS SETPOINT'],
       ['CNS/CP','CONNECTION TERMS'],
       ['CONNECTION PROFILE','GOVERNED REQUEST CROSSES'],
       ['TA-14','CONSEQUENCE DETERMINATION']
      ]).map((x,i)=><div key={x[0]} style={{padding:18,borderRadius:11,border:'1px solid '+(reverseDirection&&i===3?'#e7c76e':'#24555d'),background:'#04151c'}}><small style={{display:'block',color:'#8fa9af',fontSize:9}}>{x[0]}</small><strong style={{display:'block',marginTop:7,color:reverseDirection&&i===3?'#e7c76e':'#71e7df'}}>{x[1]}</strong></div>)}
     </div>
     <button onClick={()=>setReverseDirection(v=>!v)} style={{cursor:'pointer',padding:'13px 16px',borderRadius:9,border:'1px solid #71e7df',background:reverseDirection?'#71e7df':'transparent',color:reverseDirection?'#031216':'#71e7df',fontWeight:950}}>{reverseDirection?'RESTORE DATA DIRECTION':'REVERSE THE DIRECTION →'}</button>
     {reverseDirection&&<div style={{marginTop:18,padding:20,border:'1px solid #e7c76e',borderRadius:12,background:'rgba(91,65,12,.2)'}}>
      <strong style={{fontSize:22,color:'#e7c76e'}}>THE GRAPH CAN RECORD THE AGREEMENT. THE GRAPH DOES NOT CREATE THE AGREEMENT.</strong>
      <p style={{color:'#d4c7a2',lineHeight:1.7,margin:'12px 0 0'}}>CNS/CP addresses whether the governed connection exists and on what terms. The Connection Profile carries the governed request to the boundary. TA-14 independently determines whether this exact consequence may become reality now: ALLOW, HOLD, DENY or ESCALATE before protected commit.</p>
     </div>}
     <div style={{display:'grid',gap:7,marginTop:20,padding:'18px 20px',border:'1px dashed #6b5829',borderRadius:12,textAlign:'center',fontWeight:950}}>
      <span style={{color:'#e7c76e'}}>CONNECTION ≠ AUTHORITY</span>
      <span style={{color:'#eef7fb'}}>AUTHORITY CAN TRAVEL. EXECUTION AUTHORITY MUST BE ESTABLISHED LOCALLY.</span>
      <span style={{color:'#71e7df'}}>UNDERSTANDING ≠ PERMISSION.</span>
     </div>
    </div>

    <div style={{marginTop:28,padding:28,border:'1px solid #6b5829',borderRadius:18,background:'linear-gradient(135deg,rgba(74,56,12,.24),rgba(4,20,27,.9))'}}>
     <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#e7c76e'}}>MONDAY LIVE · ONE-FACT DEMONSTRATION</div>
     <h3 style={{fontSize:32,letterSpacing:'-.03em',margin:'10px 0'}}>A legitimate crossing can still produce HOLD.</h3>
     <p style={{color:'#a9c0c6',lineHeight:1.7,maxWidth:880}}>Start with a legitimate CNS/CP relationship and a valid Connection Profile received by TA-14. Then change one material condition before commit. Nothing about the connection has to fail for consequence authority to disappear.</p>
     <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:8,margin:'22px 0'}}>
      {[
       ['CNS/CP RELATIONSHIP','LEGITIMATE'],
       ['CONNECTION PROFILE','VALID'],
       ['TA-14 INPUT','RECEIVED'],
       ['LOCAL EVIDENCE',changedCondition?'CHANGED':'CURRENT'],
       ['TA-14 RESULT',changedCondition?'HOLD':'ALLOW']
      ].map((x,i)=><div key={x[0]} style={{padding:18,borderRadius:11,border:'1px solid '+(i===4||i===3&&changedCondition?'#e7c76e':'#24555d'),background:'#04151c'}}><small style={{display:'block',color:'#8fa9af',fontSize:9}}>{x[0]}</small><strong style={{display:'block',marginTop:7,color:i===4||i===3&&changedCondition?'#e7c76e':'#71e7df'}}>{x[1]}</strong></div>)}
     </div>
     <button onClick={()=>setChangedCondition(v=>!v)} style={{cursor:'pointer',padding:'13px 16px',borderRadius:9,border:'1px solid #e7c76e',background:changedCondition?'#e7c76e':'transparent',color:changedCondition?'#071014':'#e7c76e',fontWeight:950}}>{changedCondition?'RESTORE ORIGINAL CONDITION':'CHANGE ONE MATERIAL CONDITION →'}</button>
     {changedCondition&&<div style={{marginTop:18,padding:20,border:'1px solid #e7c76e',borderRadius:12,background:'rgba(91,65,12,.2)'}}><strong style={{fontSize:30,color:'#e7c76e'}}>HOLD</strong><p style={{color:'#d4c7a2',lineHeight:1.7,marginBottom:0}}>The relationship remains legitimate. The Connection Profile remains valid. The crossing remains authentic. But present consequence authority no longer stands. Revalidation is required before protected commit.</p></div>}
    </div>

    <div style={{marginTop:20,padding:'18px 20px',border:'1px dashed #71e7df',borderRadius:12,textAlign:'center',fontWeight:950,color:'#dffdfa',letterSpacing:'.03em'}}>THE CONNECTION PROFILE GOVERNS THE CROSSING. TA-14 GOVERNS WHETHER WHAT CROSSED MAY BECOME CONSEQUENCE.</div>
    <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:18}}><Link href="/registry/ta-14-admissible-execution-architecture" style={{padding:'12px 15px',borderRadius:9,background:'#71e7df',color:'#031216',fontWeight:950,fontSize:10,textDecoration:'none'}}>EXPLORE TA-14 ARCHITECTURE →</Link><Link href="/federation-authority" style={{padding:'12px 15px',border:'1px solid #28545b',borderRadius:9,color:'#d7eeee',fontWeight:900,fontSize:10,textDecoration:'none'}}>OPEN FEDERATION & AUTHORITY →</Link></div>
   </section>

   <section style={{padding:34,border:'1px solid #24555d',borderRadius:20,background:'linear-gradient(135deg,rgba(17,69,76,.35),rgba(4,20,27,.85))',marginTop:10}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#71e7df'}}>MONDAY LIVE</div>
    <h2 style={{fontSize:'clamp(30px,5vw,54px)',lineHeight:1.05,letterSpacing:'-.04em',margin:'12px 0'}}>“You told me the Connection Profile was the seam. I built the seam.”</h2>
    <p style={{color:'#a9c0c6',fontSize:16,lineHeight:1.7,maxWidth:900}}>Then we separated the seam from the architecture, made AFA protocol-neutral, and defined exactly why authority context can cross while execution authority must still be established locally. AFA-IP-001 v0.3 is now the bounded examination object for that proposition.</p>
   </section>
  </div>
 </main>
}