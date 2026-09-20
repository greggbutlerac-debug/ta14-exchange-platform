'use client';

import Link from 'next/link';
import {useState} from 'react';

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
 const d=decisions[decision], f=failures[failure];
 return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0,#0a2730 0,#031015 35%,#010609 78%)',color:'#efffff',fontFamily:'Inter,system-ui,sans-serif'}}>
  <div style={{width:'min(1220px,calc(100% - 34px))',margin:'0 auto',padding:'26px 0 100px'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:18,alignItems:'center',paddingBottom:22,borderBottom:'1px solid #17363e'}}>
    <Link href="/" style={{color:'#fff',textDecoration:'none',fontWeight:950,letterSpacing:'.13em'}}>TA-14 EXCHANGE</Link>
    <span style={{fontSize:10,color:'#71e7df',fontWeight:900,letterSpacing:'.14em'}}>AFA v1.0-RC1 · RELEASE CANDIDATE</span>
   </nav>

   <section style={{padding:'82px 0 54px',maxWidth:1050}}>
    <div style={{fontSize:11,fontWeight:950,letterSpacing:'.2em',color:'#71e7df'}}>ADMISSIBLE FEDERATION ARCHITECTURE</div>
    <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:16}}>{['STATUS · RELEASE CANDIDATE / NOT YET FROZEN','STEWARD · TA-14 AUTHORITY · GREGGORY DON BUTLER','AUTHORITY OBJECT · AVP V1.0.2','FOUNDING PROFILE · AFA-IP-001'].map(x=><span key={x} style={{padding:'7px 9px',border:'1px solid #244b52',borderRadius:7,color:'#91aeb5',fontSize:9,fontWeight:900}}>{x}</span>)}</div>
    <h1 style={{fontSize:'clamp(48px,8.3vw,104px)',lineHeight:.91,letterSpacing:'-.055em',margin:'18px 0 28px'}}>AUTHORITY CONTEXT<br/><span style={{color:'#71e7df'}}>MAY CROSS.</span><br/>EXECUTION AUTHORITY<br/><span style={{color:'#e7c76e'}}>MUST BE ESTABLISHED LOCALLY.</span></h1>
    <p style={{fontSize:19,lineHeight:1.7,color:'#a8c1c8',maxWidth:860}}>AFA governs the seam between independently governed domains. It permits bounded authority context to travel while preserving a hard architectural barrier before local consequence.</p>
    <div style={{display:'flex',flexWrap:'wrap',gap:10,marginTop:28}}>
     <a href="https://doi.org/10.5281/zenodo.22846133" target="_blank" rel="noreferrer" style={{padding:'13px 16px',borderRadius:9,background:'#71e7df',color:'#031216',fontWeight:950,fontSize:11,textDecoration:'none'}}>OPEN CANONICAL RC1 · DOI 10.5281/zenodo.22846133 ↗</a>
     <Link href="/federation-authority" style={{padding:'13px 16px',border:'1px solid #28545b',borderRadius:9,color:'#d7eeee',fontWeight:900,fontSize:11,textDecoration:'none'}}>FEDERATION & AUTHORITY →</Link>
    </div>
   </section>

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

   <section style={{padding:34,border:'1px solid #24555d',borderRadius:20,background:'linear-gradient(135deg,rgba(17,69,76,.35),rgba(4,20,27,.85))',marginTop:10}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.17em',color:'#71e7df'}}>MONDAY LIVE</div>
    <h2 style={{fontSize:'clamp(30px,5vw,54px)',lineHeight:1.05,letterSpacing:'-.04em',margin:'12px 0'}}>“You told me the Connection Profile was the seam. I built the seam.”</h2>
    <p style={{color:'#a9c0c6',fontSize:16,lineHeight:1.7,maxWidth:900}}>Then we separated the seam from the architecture, made AFA protocol-neutral, and defined exactly why authority context can cross while execution authority must still be established locally. AFA-IP-001 v0.3 is now the bounded examination object for that proposition.</p>
   </section>
  </div>
 </main>
}