'use client';
import Link from 'next/link';
import {useMemo,useState} from 'react';

type Scenario='emergency'|'attack'|'normal';
type Connection='BOUND'|'REFUSED'|'NEVER ATTEMPTED';
type Decision='ALLOW'|'HOLD'|'DENY'|'ESCALATE';

const scenarios={
 emergency:{name:'EMERGENCY RESPONSE',attempt:'Legitimate responder requests a bounded building interaction.',crosses:true,connection:'BOUND' as Connection,consequence:'Disconnect AHU-1 electrical power for the emergency condition.'},
 attack:{name:'CYBERATTACK',attempt:'Unauthorized or compromised person, machine, system, or AI agent attempts to interact.',crosses:true,connection:'REFUSED' as Connection,consequence:'Issue a consequential building command.'},
 normal:{name:'NORMAL OPERATIONS',attempt:'Routine facility operation stays inside the owner’s systems.',crosses:false,connection:'NEVER ATTEMPTED' as Connection,consequence:'Perform a routine authorized facility operation.'}
};

export default function Page(){
 const [scenario,setScenario]=useState<Scenario>('emergency');
 const [evidence,setEvidence]=useState(true);
 const [authority,setAuthority]=useState(true);
 const [standing,setStanding]=useState(true);
 const [current,setCurrent]=useState(true);
 const [connectionRevoked,setConnectionRevoked]=useState(false);
 const [passportRevoked,setPassportRevoked]=useState(false);
 const s=scenarios[scenario];
 const connection:Connection=connectionRevoked&&s.connection==='BOUND'?'REFUSED':s.connection;
 const decision=useMemo<Decision>(()=>{
   if(connection!=='BOUND') return connection==='REFUSED'?'DENY':'ALLOW';
   if(passportRevoked||!current||!evidence) return 'HOLD';
   if(!authority) return 'DENY';
   if(!standing) return 'ESCALATE';
   return 'ALLOW';
 },[connection,passportRevoked,current,evidence,authority,standing]);
 const reset=(x:Scenario)=>{setScenario(x);setEvidence(true);setAuthority(true);setStanding(true);setCurrent(true);setConnectionRevoked(false);setPassportRevoked(false)};
 return <main>
 <nav><Link href="/">TA-14 EXCHANGE</Link><span>NIST WORKSHOP EXAMINATION SURFACE · WORKING DRAFT</span></nav>
 <header><small>STOP THE CYBER ATTACK · OCTOBER 20</small><h1>CONNECTION <em>≠</em> AUTHORITY TO EXECUTE</h1><p>A plain-English experiment surface for observing two different questions: did an interaction cross a boundary correctly, and given what arrived, may a proposed consequence become reality now?</p><div className="status">WORKING DRAFT · OPEN FOR CORRECTION · NOT A NIST ENDORSEMENT · NOT A PRODUCTION CNS/CP IMPLEMENTATION</div></header>
 <section><small>WHAT ARE WE TESTING?</small><h2>Same building. Different interaction, connection, context and authority.</h2><div className="cards">{(Object.keys(scenarios) as Scenario[]).map(k=><button key={k} onClick={()=>reset(k)} className={scenario===k?'active':''}><b>{scenarios[k].name}</b><span>{scenarios[k].attempt}</span></button>)}</div></section>
 <section className="experiment"><div className="panel"><small>01 · ATTEMPTED INTERACTION</small><h3>{s.name}</h3><p>{s.attempt}</p><dl><dt>Ownership / organizational boundary?</dt><dd>{s.crosses?'YES':'NO · CONTROL CASE'}</dd><dt>Proposed consequence</dt><dd>{s.consequence}</dd></dl></div>
 <div className="arrow">→</div><div className="panel"><small>02 · CONNECTION OBSERVATION</small><h3>{connection}</h3><p>This panel records the connection-layer observation separately from any TA-14 determination.</p><dl><dt>Governed crossing</dt><dd>{s.crosses?'OBSERVE PROFILE / EXISTING MECHANISM':'NO CROSS-ORGANIZATION PROFILE REQUIRED'}</dd><dt>Connection result</dt><dd>{connection}</dd><dt>What crossed?</dt><dd>{connection==='BOUND'?'Passport + passportDigest; response properties observed separately':'Nothing through a bound Profile'}</dd></dl>{s.connection==='BOUND'&&<button onClick={()=>setConnectionRevoked(v=>!v)}>{connectionRevoked?'RESTORE CONNECTION':'REVOKE CONNECTION'}</button>}</div>
 <div className="stop">STOP<br/><span>CONNECTION LAYER ENDS</span></div>
 <div className="panel ta"><small>03 · TA-14 LOCAL EXAMINATION</small><h3>{connection==='BOUND'?decision:'NOT REACHED / OBSERVE'}</h3><p>TA-14 does not assume that a valid connection authorizes an action. It examines the proposed consequence against present conditions.</p><blockquote>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</blockquote>{connection==='BOUND'?<div className="checks">
 <label><input type="checkbox" checked={evidence} onChange={e=>setEvidence(e.target.checked)}/> Admissible Evidence</label>
 <label><input type="checkbox" checked={authority} onChange={e=>setAuthority(e.target.checked)}/> Applicable Authority</label>
 <label><input type="checkbox" checked={standing} onChange={e=>setStanding(e.target.checked)}/> Established Standing</label>
 <label><input type="checkbox" checked={current} onChange={e=>setCurrent(e.target.checked)}/> Current condition / NOW</label>
 <label><input type="checkbox" checked={!passportRevoked} onChange={e=>setPassportRevoked(!e.target.checked)}/> Authority Passport not revoked</label></div>:<p className="muted">If no governed connection delivers the interaction to this examination, do not manufacture a TA-14 decision. Record where the attempt stopped.</p>}</div></section>
 <section><small>WHAT DO WE RECORD?</small><h2>Two observations. Never collapse them into one.</h2><div className="two"><div><h3>CONNECTION</h3><p>Attempted interaction · ownership boundary · governing mechanism/Profile · parties and roles · allowed properties · bound/refused/never attempted · properties that actually moved · revocation and visibility.</p></div><div><h3>CONSEQUENCE</h3><p>Proposed consequence · evidence · authority · standing · current conditions · ALLOW/HOLD/DENY/ESCALATE · Commit/No Commit · execution attempt · outcome evidence.</p></div></div></section>
 <section><small>CHANGED CONDITIONS</small><h2>An earlier ALLOW does not authorize a consequence forever.</h2><p>During the experiment, deliberately change or revoke conditions and observe what stops. Connection revocation and Passport/authority changes are recorded separately. A valid connection can coexist with HOLD, DENY or ESCALATE on the consequence side.</p><div className="rule">NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</div></section>
 <section><small>NIST CHALLENGE</small><h2>What are we missing?</h2><p>Challenge the experiment from the cybersecurity perspective: What would concern you? What evidence would you want to see? Where is the interaction actually enforced?</p></section>
 <footer><b>WORKING EXAMINATION SURFACE</b><span>Built from the Stop the Cyber Attack read-ahead. CNS/CP details remain Anto Budiardjo’s section to correct and own. TA-14 owns only the local consequence-admissibility observation shown here.</span></footer>
 <style jsx>{`
 :global(*){box-sizing:border-box} :global(body){margin:0;background:#02070a;color:#eefcff;font-family:Arial,Helvetica,sans-serif} main{max-width:1500px;margin:auto;padding:24px} nav{display:flex;justify-content:space-between;border-bottom:1px solid #24464d;padding:14px 0;font-size:12px;letter-spacing:.12em} nav a{color:#71e7df;text-decoration:none} header,section{padding:54px 0;border-bottom:1px solid #17343b} small{color:#71e7df;letter-spacing:.16em;font-weight:800} h1{font-size:clamp(42px,7vw,92px);line-height:.92;margin:18px 0} h1 em{color:#e7c76e;font-style:normal} h2{font-size:clamp(28px,4vw,50px);max-width:900px} p{color:#b7cbd0;line-height:1.65;max-width:900px}.status{border:1px solid #e7c76e;padding:14px;margin-top:28px;color:#e7c76e;font-size:12px;letter-spacing:.1em}.cards,.two{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.cards button,.panel,.two>div{background:#06151c;border:1px solid #24464d;color:#eefcff;padding:22px;text-align:left}.cards button{cursor:pointer}.cards button.active{border-color:#71e7df}.cards span{display:block;color:#9fb7be;margin-top:10px;line-height:1.5}.experiment{display:grid;grid-template-columns:1fr 40px 1fr 120px 1.25fr;gap:10px;align-items:stretch}.panel h3{font-size:28px}.arrow,.stop{display:flex;align-items:center;justify-content:center;color:#e7c76e;font-weight:800;text-align:center}.stop{border:1px dashed #e7c76e;padding:8px;font-size:16px}.stop span{font-size:9px}.ta{border-color:#71e7df} dl{display:grid;gap:7px}dt{color:#8da7ad;font-size:11px;text-transform:uppercase;letter-spacing:.08em}dd{margin:0 0 10px;font-weight:700}button{background:#0b222a;border:1px solid #71e7df;color:#eefcff;padding:12px}.checks{display:grid;gap:9px;margin-top:20px}.checks label{background:#031015;padding:11px;border:1px solid #17343b}blockquote{margin:20px 0;padding:16px;border-left:3px solid #e7c76e;color:#fff;font-weight:700;line-height:1.5}.two{grid-template-columns:1fr 1fr}.rule{margin-top:24px;font-size:clamp(22px,4vw,42px);font-weight:900;color:#e7c76e}footer{padding:35px 0;display:flex;gap:20px;justify-content:space-between;color:#9fb7be;font-size:12px}footer span{max-width:800px}.muted{color:#8da7ad}
 @media(max-width:900px){.cards,.two,.experiment{grid-template-columns:1fr}.arrow{transform:rotate(90deg)}.stop{min-height:80px}nav,footer{flex-direction:column;gap:10px}}
 `}</style></main>
}