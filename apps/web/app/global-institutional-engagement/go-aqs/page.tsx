'use client';
import Link from 'next/link';
import {useState} from 'react';

const stages=[
 ['01','BENCHMARK','GO AQS','An open indoor-environment standard establishes a reference condition or safe-limit benchmark.'],
 ['02','MEASURE','BUILDING / SENSOR','A real indoor environment produces measurements tied to a place and time.'],
 ['03','PRESERVE','TA-14 · AIR','The environmental record preserves source, identity, chronology, context and continuity.'],
 ['04','TEST','TA-14 · ADMISSIBILITY','TA-14 asks whether the evidence is current, attributable and sufficient for the proposed consequence.'],
 ['05','BIND','TA-14 · AUTHORITY','Evidence does not create authority. The actor, scope, building, action and present authority must bind.'],
 ['06','EXECUTE','AUTHORIZED ACTOR','Only an admissible, bound action may cross into consequential execution.'],
 ['07','VERIFY','TA-14 · OUTCOME','The post-action reality returns to the record. Changed conditions require revalidation and a new chain.']
];

export default function Page(){
 const [threshold,setThreshold]=useState(true);
 const [continuity,setContinuity]=useState(true);
 const [authority,setAuthority]=useState(false);
 const [changed,setChanged]=useState(false);
 const verdict=!threshold?'OBSERVE':!continuity?'HOLD':changed?'REVALIDATE':!authority?'HOLD':'ALLOW';
 const why=!threshold?'No declared benchmark exceedance is present in this bounded scenario.':!continuity?'The benchmark may be valid, but the evidence chain is not continuous enough to support consequence.':changed?'A changed condition breaks reliance on the prior state. Revalidation is required before execution.':!authority?'Evidence can support a finding without granting anyone authority to act. Present authority must be established.':'The benchmark, current evidence, continuity and authority are established for this bounded action.';
 return <main className="p"><div className="s">
  <nav><Link className="brand" href="/"><b>TA-14</b> AUTHORITY</Link><Link href="/global-institutional-engagement/showrooms">GLOBAL SHOWROOMS</Link><Link href="/global-institutional-engagement">GLOBAL ENGAGEMENT</Link></nav>
  <header>
   <p className="eye">PUBLIC INTEROPERABILITY SHOWROOM · GOOD-FAITH TECHNICAL EXAMINATION</p>
   <h1>THE BENCHMARK IS NOT<br/><em>THE EXECUTION.</em></h1>
   <p className="lead">A public examination of the boundary between <b>GO AQS</b> environmental benchmarks and <b>TA-14</b> evidence-to-authority-to-execution governance.</p>
   <div className="identity"><div><small>PUBLIC WORK EXAMINED</small><h2>GO AQS</h2><p>Global Open Air Quality Standards</p></div><div><small>FOUNDER</small><h2>Sotirios Papathanasiou</h2><p>Publicly identified founder of GO AQS</p></div></div>
   <div className="notice"><b>INDEPENDENT PUBLIC EXAMINATION</b><p>GO AQS is not TA-14. TA-14 is not GO AQS. This showroom does not represent or imply endorsement, partnership, affiliation, authorization or participation by GO AQS or Sotirios Papathanasiou. It examines public claims and a possible technical seam in good faith.</p></div>
  </header>

  <section><p className="eye">THE POSITION WE ARE PRESERVING</p><h2>GO AQS defines its own role.</h2><div className="quote">“GO AQS is an advocacy body for better policies and legislations that has developed an open standard for the indoor environment with a clear definition of what are the safe limits for air quality.”</div><p className="source">— Sotirios Papathanasiou, direct clarification to Greggory Don Butler, June 11, 2026. Presented here to preserve the boundary he stated; not as an endorsement of this showroom.</p>
   <div className="three"><article><b>GO AQS</b><h3>DEFINE THE BENCHMARK</h3><p>Advocacy · policy · legislation · open indoor-environment standard · safe-limit definition.</p></article><span>→</span><article><b>MEASUREMENT</b><h3>OBSERVE REALITY</h3><p>A sensor, assessment or monitoring system records the actual indoor condition.</p></article><span>→</span><article className="hot"><b>TA-14</b><h3>GOVERN CONSEQUENCE</h3><p>Continuity · admissibility · authority · binding · execution · verified outcome.</p></article></div>
  </section>

  <section className="lab"><p className="eye">LIVE BOUNDED EXAMINATION</p><h2>One benchmark. One condition. One consequential question.</h2><p className="lead">Change the facts. The GO AQS benchmark remains what GO AQS defines. TA-14 changes only its determination about whether the evidence may support consequence.</p>
   <div className="controls">
    <button onClick={()=>setThreshold(!threshold)} className={threshold?'on':''}><small>GO AQS THRESHOLD</small><b>{threshold?'EXCEEDED':'NOT EXCEEDED'}</b></button>
    <button onClick={()=>setContinuity(!continuity)} className={continuity?'on':''}><small>EVIDENCE CONTINUITY</small><b>{continuity?'INTACT':'BROKEN'}</b></button>
    <button onClick={()=>setAuthority(!authority)} className={authority?'on':''}><small>PRESENT AUTHORITY</small><b>{authority?'ESTABLISHED':'MISSING'}</b></button>
    <button onClick={()=>setChanged(!changed)} className={changed?'warn':''}><small>CHANGED CONDITION</small><b>{changed?'YES':'NO'}</b></button>
   </div>
   <div className={'verdict '+verdict.toLowerCase()}><small>TA-14 DETERMINATION</small><strong>{verdict}</strong><p>{why}</p></div>
  </section>

  <section><p className="eye">THE INTEROPERABILITY PATH</p><h2>Preserve each system without pretending they are the same system.</h2><div className="stages">{stages.map(([n,t,o,d])=><article key={n}><small>{n} · {o}</small><h3>{t}</h3><p>{d}</p></article>)}</div></section>

  <section><p className="eye">THE QUESTION THAT MATTERS</p><h2>What happens after a safe-limit benchmark meets a real building?</h2><div className="questions"><article><b>THE STANDARD CAN SAY</b><p>“This is the benchmark.”</p></article><article><b>THE SENSOR CAN SAY</b><p>“This is what I measured.”</p></article><article><b>TA-14 MUST ASK</b><p>“Can this evidence still be relied upon for this action, by this authority, now?”</p></article><article><b>THE OUTCOME MUST SHOW</b><p>“This is what actually happened after action.”</p></article></div></section>

  <section className="invite"><p className="eye">OPEN TECHNICAL INVITATION</p><h2>One bounded interoperability demonstration.</h2><p className="lead">One GO AQS threshold. One declared building condition. One preserved evidence record. One question: can TA-14 govern the consequence-bearing seam while preserving GO AQS exactly as GO AQS defines itself?</p><div className="one">GO AQS BENCHMARK <span>→</span> BUILDING CONDITION <span>→</span> PRESERVED EVIDENCE <span>→</span> AUTHORITY TEST <span>→</span> ACTION <span>→</span> VERIFIED OUTCOME</div><p>This is an invitation to examine complementarity, not a claim that complementarity has already been accepted or proven.</p><a className="cta" href="mailto:ta14admissibleexecution@gmail.com?subject=GO%20AQS%20x%20TA-14%20bounded%20interoperability%20examination">OPEN A WRITTEN EXAMINATION →</a></section>

  <section className="sources"><p className="eye">PUBLIC REFERENCE</p><a href="https://goaqs.org/" target="_blank" rel="noreferrer">GO AQS · Official public site ↗</a><a href="https://www.linkedin.com/in/sotirios-papathanasiou/" target="_blank" rel="noreferrer">Sotirios Papathanasiou · Public LinkedIn profile ↗</a></section>
  <footer>TA-14 AUTHORITY · GO AQS PUBLIC INTEROPERABILITY SHOWROOM · SEPTEMBER 2026<br/>NO ENDORSEMENT OR AFFILIATION REPRESENTED · NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</footer>
 </div><style>{`
 .p{min-height:100vh;background:#05090f;color:#f4f7f9;font-family:Arial,sans-serif}.s{max-width:1180px;margin:auto;padding:0 28px}nav{padding:24px 0;border-bottom:1px solid #23313d;display:flex;gap:24px}a{color:#8fc6ff;text-decoration:none}.brand{margin-right:auto}.eye{color:#67d5e7;font-size:10px;font-weight:900;letter-spacing:2px}header,section{padding:64px 0;border-bottom:1px solid #23313d}h1{font:72px Georgia,serif;line-height:.98;max-width:1050px}h1 em{color:#67d5e7}h2{font:36px Georgia,serif}.lead{font-size:18px;line-height:1.7;color:#b6c2c9;max-width:900px}.identity{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:32px}.identity>div,.notice,article,.quote,.verdict{padding:24px;border:1px solid #29485e;border-radius:16px;background:#08131d}.identity small,.source,article small{color:#7e98a6;font-size:9px;letter-spacing:1px;font-weight:900}.identity h2{margin:7px 0}.notice{margin-top:12px;border-left:4px solid #67d5e7}.notice b{color:#67d5e7}.notice p,.source,article p,.invite>p{color:#aebbc2;line-height:1.65}.quote{font:24px Georgia,serif;line-height:1.55;border-left:4px solid #67d5e7}.source{font-size:11px}.three{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:12px;align-items:center;margin-top:32px}.three>span{font-size:28px;color:#67d5e7}.three article b{color:#67d5e7}.three .hot{border:2px solid #67d5e7;background:#09202a}.lab{background:linear-gradient(135deg,rgba(28,171,193,.10),rgba(4,9,15,.1));padding-left:24px!important;padding-right:24px!important}.controls{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:28px 0}.controls button{cursor:pointer;text-align:left;padding:18px;border:1px solid #344a57;border-radius:13px;background:#09131c;color:#f4f7f9}.controls button small,.controls button b{display:block}.controls button small{font-size:8px;color:#8da1ab;letter-spacing:1px}.controls button b{margin-top:8px}.controls button.on{border-color:#67d5e7}.controls button.warn{border-color:#f0a55a}.verdict{border:2px solid #67d5e7}.verdict small{color:#8da1ab}.verdict strong{display:block;font:52px Georgia,serif;margin:8px 0;color:#67d5e7}.verdict.hold strong,.verdict.revalidate strong{color:#f0a55a}.stages{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}.stages article{padding:16px}.stages h3{font-size:12px;color:#67d5e7}.stages p{font-size:11px}.questions{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.questions b{color:#67d5e7}.invite{border:1px solid #315b67!important;border-radius:20px;margin:34px 0;padding-left:26px!important;padding-right:26px!important}.one{padding:20px;border:1px solid #315b67;border-radius:12px;margin:25px 0;color:#dbe8ec;font-size:11px;font-weight:900;letter-spacing:.4px}.one span{color:#67d5e7;margin:0 8px}.cta{display:inline-block;margin-top:15px;padding:14px 18px;border:1px solid #67d5e7;border-radius:10px;font-size:11px;font-weight:900}.sources a{display:block;padding:14px;margin:8px 0;border:1px solid #29485e;border-radius:10px}footer{padding:40px 0 70px;color:#778b96;font-size:9px;line-height:1.7}@media(max-width:800px){h1{font-size:47px}.identity,.controls,.questions,.stages{grid-template-columns:1fr}.three{grid-template-columns:1fr}.three>span{transform:rotate(90deg);text-align:center}nav{flex-wrap:wrap}}
 `}</style></main>
}