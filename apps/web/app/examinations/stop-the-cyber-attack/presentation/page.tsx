'use client';
import Link from 'next/link';
import {useMemo,useState} from 'react';

type Run='baseline'|'narrowed'|'revoked'|'mismatch';
const runs={
 baseline:{name:'LEGITIMATE EMERGENCY RESPONSE',target:'RE1 · EMERGENCY POWER DISCONNECT',passport:'VALID · PRESENT',binding:'EXACT TARGET MATCH',now:'CURRENT',result:'ALLOW',note:'Authority context, target binding and present conditions align for the frozen candidate consequence.'},
 narrowed:{name:'ACCEPT — NARROWED',target:'RE1 · EMERGENCY POWER DISCONNECT',passport:'VALID · NARROWED',binding:'DISCONNECT ONLY',now:'CURRENT',result:'ALLOW',note:'The receiving domain accepts only the bounded electrical-disconnect consequence. Nothing beyond that scope inherits permission.'},
 revoked:{name:'PASSPORT REVOKED',target:'RE1 · EMERGENCY POWER DISCONNECT',passport:'REVOKED',binding:'TARGET IDENTIFIED',now:'CHANGED',result:'HOLD',note:'The connection and the authority-context object are separate. A revoked Passport requires present authority context to be re-established before progression.'},
 mismatch:{name:'TARGET MISMATCH',target:'RE1 · DIFFERENT ELECTRICAL OBJECT',passport:'VALID · PRESENT',binding:'REQUEST ≠ PROPOSED TARGET',now:'CURRENT',result:'HOLD',note:'A legitimate responder and legitimate connection do not authorize a different physical consequence. Exact target binding has not been established.'}
} as const;

export default function NistPresentation(){
 const [run,setRun]=useState<Run>('baseline');
 const [crossing,setCrossing]=useState(1);
 const [target,setTarget]=useState<'A'|'B'>('A');
 const [moment,setMoment]=useState<'t0'|'tn'>('t0');
 const r=runs[run];
 const disposition=useMemo(()=>r.result,[r]);
 return <main>
 <nav><Link href="/">TA-14 EXCHANGE</Link><span>NIST · STOP THE CYBER ATTACK · PRESENTATION SHOWROOM</span></nav>
 <header>
  <p className="eyebrow">TA-14 WORKING CONTRIBUTION · EXTENDS THE EXISTING NIST / ONUMA USE CASE</p>
  <h1>THE CONNECTION WORKED.<br/><em>NOW MAY THE BUILDING ACT?</em></h1>
  <p className="lead">This showroom does not replace the existing Stop the Cyber Attack examination. It picks up where that work leaves off: after an interaction reaches the receiving building domain and before a proposed physical consequence becomes reality.</p>
  <div className="status">WORKING PRESENTATION · OPEN FOR CORRECTION · NOT A NIST ENDORSEMENT · NO CLAIM OF NIST ADOPTION</div>
 </header>

 <section className="visualStory">
  <p className="eyebrow">01 · THE SITUATION</p>
  <h2>Ten entities. Nine connections. One real consequence.</h2>
  <img src="/nist-federation-to-consequence-master-v2.png" alt="Ten entities and nine governed connection boundaries leading to one real consequence" />
  <div className="bulletGrid">
    <article><b>WHAT IS HAPPENING</b><ul><li>Independent entities are connected.</li><li>Authority context must move across nine boundaries.</li><li>Execution authority does not travel with it.</li></ul></article>
    <article><b>THE GAP</b><ul><li>A successful connection does not equal permission to act.</li><li>Context can be narrowed, changed or separated from provenance.</li><li>The final consequence still has to be governed locally.</li></ul></article>
  </div>
 </section>

 <section className="architectureMap">
  <p className="eyebrow">02 · THE ARCHITECTURES THAT FILL THE GAPS</p>
  <h2>One job per layer.</h2>
  <div className="archList">
    <article><b>CONNECTION PROFILE</b><span>Gap</span><p>What is allowed to cross this boundary?</p><span>Fix</span><p>Defines the governed crossing.</p></article>
    <article><b>AVP</b><span>Gap</span><p>How does authority context stay attributable?</p><span>Fix</span><p>Carries bounded authority context across the connection.</p></article>
    <article><b>AFA</b><span>Gap</span><p>How does that context survive multiple independent crossings without becoming assumed execution authority?</p><span>Fix</span><p>Governs the federated journey across the nine connections.</p></article>
    <article><b>EABA</b><span>Gap</span><p>What happens when federated context reaches the receiving domain?</p><span>Fix</span><p>Marks the execution-authority boundary. Local execution authority must be established here.</p></article>
    <article><b>AEA / TA-14</b><span>Gap</span><p>Even with local authority, may this exact consequence become real now?</p><span>Fix</span><p>Examines Admissible Evidence, Applicable Authority, Established Standing and NOW.</p></article>
  </div>
  <div className="crossingLab"><small>INTERACTIVE · FOLLOW ONE PASSPORT</small><div className="cpButtons">{Array.from({length:9},(_,i)=><button key={i} onClick={()=>setCrossing(i+1)} className={crossing===i+1?'active':''}>CP{i+1}</button>)}</div><div className="crossingReadout"><b>AT CP{crossing}</b><span><strong>CROSSES:</strong> authority context carried by AVP</span><span><strong>DOES NOT CROSS:</strong> execution authority</span></div></div>
 </section>

 <section className="visualStory">
  <p className="eyebrow">03 · THE FINAL HANDOFF</p>
  <h2>Federation ends. Local consequence governance begins.</h2>
  <img src="/nist-final-handoff-to-reality.png" alt="Final handoff from Entity 10 through EABA and AEA TA-14 to reality" />
  <div className="bulletGrid">
    <article><b>EABA</b><ul><li>Incoming authority context is not local execution authority.</li><li>The receiving domain must establish authority for this consequence here.</li></ul></article>
    <article><b>AEA</b><ul><li>Local authority alone is still not enough.</li><li>The exact proposed consequence must satisfy evidence, authority, standing and NOW.</li></ul></article>
  </div>
 </section>

 <section className="visualStory">
  <p className="eyebrow">04 · THE GAP</p>
  <h2>Make the execution boundary inspectable.</h2>
  <img src="/nist-inside-execution-boundary.png" alt="Inside the execution boundary from proposed consequence through local execution authority and consequential examination" />
 </section>

 <section className="visualStory">
  <p className="eyebrow">05 · CHANGE ONE THING</p>
  <h2>Same responder. Same building. Different proposed consequence.</h2>
  <img src="/nist-fire-chief-match-vs-mismatch.png" alt="Fire Chief Panel A match versus Panel B consequence mismatch across the same federation" />
  <div className="matchLab"><small>INTERACTIVE</small><div className="toggle"><button className={target==='A'?'active':''} onClick={()=>setTarget('A')}>PROPOSE PANEL A</button><button className={target==='B'?'active':''} onClick={()=>setTarget('B')}>PROPOSE PANEL B</button></div><div className={target==='A'?'matchResult good':'matchResult stop'}><span>REQUESTED · PANEL A</span><span>AUTHORIZED · PANEL A</span><span>PROPOSED · PANEL {target}</span><strong>{target==='A'?'MATCH · CANDIDATE ALLOW':'MISMATCH · NOT ADMITTED'}</strong></div></div>
 </section>

 <section className="visualStory">
  <p className="eyebrow">06 · THE QUESTION</p>
  <h2>Strip everything away except the consequence.</h2>
  <img src="/nist-execution-boundary-one-question.png" alt="Authorized Panel A compared with proposed Panel A and Panel B at the TA-14 execution boundary" />
 </section>

 <section className="visualStory">
  <p className="eyebrow">07 · WHERE THE ANSWER COMES FROM</p>
  <h2>Four things have to be established.</h2>
  <img src="/nist-where-does-the-answer-come-from.png" alt="Explanation of admissible evidence, applicable authority, established standing, now, and governing sources" />
  <div className="bulletGrid four">
    <article><b>ADMISSIBLE EVIDENCE</b><ul><li>Not just data.</li><li>Evidence acceptable for this consequence.</li></ul></article>
    <article><b>APPLICABLE AUTHORITY</b><ul><li>Not just legitimate authority.</li><li>Authority that applies to this target, scope and condition.</li></ul></article>
    <article><b>ESTABLISHED STANDING</b><ul><li>Not just claimed standing.</li><li>The required relationship and validity are actually established.</li></ul></article>
    <article><b>NOW</b><ul><li>Past validity is not enough.</li><li>The basis must still hold at the execution boundary.</li></ul></article>
  </div>
  <div className="nowLab"><small>INTERACTIVE · T0 → TN</small><div className="toggle"><button className={moment==='t0'?'active':''} onClick={()=>setMoment('t0')}>T0 · ESTABLISHED</button><button className={moment==='tn'?'active':''} onClick={()=>setMoment('tn')}>TN · CONDITION CHANGED</button></div><div className={moment==='t0'?'timeResult good':'timeResult warn'}><b>{moment==='t0'?'T0':'TN'}</b><span>{moment==='t0'?'Evidence, authority and standing are established for the candidate consequence.':'A material condition changed. Historical validity no longer establishes the present basis.'}</span><strong>{moment==='t0'?'PRESENT BASIS ESTABLISHED':'RE-EXAMINE NOW'}</strong></div></div>
 </section>

 <section className="visualStory closingVisual">
  <p className="eyebrow">08 · THE SOLUTION REDUCED</p>
  <h2>Four things. One question. One disposition.</h2>
  <img src="/nist-before-consequence-becomes-reality.png" alt="TA-14 four-part consequence admissibility model leading to allow hold deny or escalate" />
 </section>

 <section className="interactive compactProof">
  <p className="eyebrow">09 · PROVE IT</p>
  <h2>Run the same consequence. Change one condition.</h2>
  <div className="buttons">{(Object.keys(runs) as Run[]).map(k=><button className={run===k?'active':''} onClick={()=>setRun(k)} key={k}>{runs[k].name}</button>)}</div>
  <div className="receipt"><div><small>PROPOSED CONSEQUENCE</small><b>{r.target}</b></div><div><small>AUTHORITY PASSPORT</small><b>{r.passport}</b></div><div><small>LOCAL BINDING</small><b>{r.binding}</b></div><div><small>PRESENT STATE</small><b>{r.now}</b></div><aside className={disposition.toLowerCase()}><small>CANDIDATE DISPOSITION</small><strong>{disposition}</strong><p>{r.note}</p></aside></div>
 </section>

 <section className="challenge compactChallenge">
  <p className="eyebrow">10 · THE NIST TEST</p>
  <h2>Show whether the layer is actually needed.</h2>
  <ul className="bigBullets">
    <li>Can the existing stack establish current evidence?</li>
    <li>Can it establish applicable local authority?</li>
    <li>Can it bind the exact physical target?</li>
    <li>Can it establish present standing immediately before Commit?</li>
    <li>Can it withhold the consequence when one fails and preserve the record?</li>
  </ul>
  <p>If yes, record overlap or equivalence. If no, the gap is demonstrated.</p>
  <div className="rule">NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</div>
 </section>

 <section className="cta"><small>CONTINUE THE RECORD</small><h2>The presentation ends here. The examination remains preserved.</h2><div><Link href="/examinations/stop-the-cyber-attack">OPEN ORIGINAL WORKING EXAMINATION →</Link><a href="#top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>RETURN TO TOP ↑</a></div></section>

 <footer><b>TA-14 AUTHORITY · WORKING NIST PRESENTATION</b><span>Built from the existing Stop the Cyber Attack working record and the September 25–27 working-team correspondence. CNS/CP remains Anto Budiardjo's domain to define and correct. NIST participation, endorsement, adoption or validation is not implied.</span></footer>
 <style jsx>{`
 :global(*){box-sizing:border-box}:global(html){scroll-behavior:smooth}:global(body){margin:0;background:#02070a;color:#eefcff;font-family:Arial,Helvetica,sans-serif}main{max-width:1600px;margin:auto;padding:24px}nav{display:flex;justify-content:space-between;border-bottom:1px solid #24464d;padding:14px 0;font-size:12px;letter-spacing:.12em}nav a{color:#72e6df;text-decoration:none}header,section{padding:64px 0;border-bottom:1px solid #17343b}.eyebrow,small{color:#72e6df;font-size:11px;letter-spacing:.16em;font-weight:900}h1{font-size:clamp(46px,7.7vw,112px);line-height:.9;margin:24px 0;max-width:1350px}h1 em,h2 em{font-style:normal;color:#e7c76e}h2{font-size:clamp(30px,4.2vw,58px);line-height:1.05;max-width:1100px;margin:16px 0 24px}.lead,.intro,p{color:#b9cdd1;line-height:1.65;max-width:1000px}.lead{font-size:clamp(18px,2vw,26px)}.status{border:1px solid #e7c76e;color:#e7c76e;padding:14px;margin-top:30px;font-size:11px;letter-spacing:.11em}.visualStory{position:relative}.visualStory img,.visualArchive img{width:100%;height:auto;display:block;border:1px solid #31555d;box-shadow:0 24px 80px rgba(0,0,0,.45);margin-top:28px}.visualStory p{font-size:18px}.keyGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:18px}.keyGrid.four{grid-template-columns:repeat(4,1fr)}.keyGrid article{background:#06151c;border:1px solid #24464d;padding:18px}.keyGrid b{color:#72e6df;font-size:12px;letter-spacing:.08em}.keyGrid p{font-size:13px;margin-bottom:0}.whyBand{margin-top:18px;background:#041117;border:1px solid #e7c76e;padding:26px}.whyBand h3{font-size:clamp(24px,3vw,38px);margin:10px 0}.whyBand p{font-size:17px}.whyFlow{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:20px}.whyFlow span{background:#06151c;border:1px solid #24464d;padding:15px;color:#b9cdd1;line-height:1.45}.whyFlow b{display:block;color:#72e6df;margin-bottom:6px}.keyGrid strong{color:#e7c76e}.bulletGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:18px}.bulletGrid.four{grid-template-columns:repeat(4,1fr)}.bulletGrid article,.archList article{background:#06151c;border:1px solid #24464d;padding:20px}.bulletGrid b,.archList b{color:#72e6df;letter-spacing:.08em}.bulletGrid ul,.bigBullets{margin:12px 0 0;padding-left:20px;color:#b9cdd1;line-height:1.65}.architectureMap{padding-top:48px}.archList{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:24px 0}.archList span{display:block;color:#e7c76e;font-size:10px;font-weight:900;letter-spacing:.12em;margin-top:12px}.archList p{font-size:13px;margin:4px 0}.compactProof,.compactChallenge{padding-top:48px;padding-bottom:48px}.bigBullets{max-width:900px;font-size:18px}.crossingLab,.matchLab,.nowLab{margin-top:18px;background:#031015;border:1px solid #31555d;padding:22px}.crossingLab h3,.matchLab h3,.nowLab h3{font-size:24px;margin:10px 0 18px}.cpButtons,.toggle{display:flex;gap:7px;flex-wrap:wrap}.cpButtons button,.toggle button{cursor:pointer;background:#071920;border:1px solid #31555d;color:#eefcff;padding:10px 13px;font-weight:900}.cpButtons button.active,.toggle button.active{border-color:#72e6df;background:#0b2930}.crossingReadout{margin-top:16px;display:grid;grid-template-columns:auto 1fr 1fr;gap:10px}.crossingReadout>*{border:1px solid #24464d;padding:14px}.crossingReadout span{color:#b9cdd1}.crossingReadout strong{color:#e7c76e}.matchResult,.timeResult{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#17343b;margin-top:14px}.matchResult>*,.timeResult>*{background:#06151c;padding:16px}.matchResult.good strong,.timeResult.good strong{color:#72e6df}.matchResult.stop strong{color:#ff8f8f}.timeResult.warn strong{color:#e7c76e}.chapterBreak{background:#041117;border:1px solid #31555d!important;padding:48px 32px}.chapterBreak h2{max-width:1200px}.chapterBreak p{font-size:20px;max-width:1100px}.closingVisual{padding-bottom:84px}.visualArchive{padding:24px 0}.visualArchive summary{cursor:pointer;color:#91a9ae;font-size:12px;letter-spacing:.12em}.quote{background:#041117;padding-left:32px;padding-right:32px}.quote h2{max-width:1250px}.three,.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.three article,.steps article,.split article,.roles article,.compare article{border:1px solid #24464d;background:#06151c;padding:24px}.three article.hot{border-color:#72e6df}.three b,.steps>b{color:#72e6df}.flow{display:grid;grid-template-columns:repeat(11,auto);align-items:stretch;gap:8px;margin-top:34px;overflow-x:auto;padding-bottom:8px}.flow>div{width:190px;border:1px solid #24464d;background:#06151c;padding:18px;display:flex;flex-direction:column;gap:9px}.flow>div.final{border-color:#e7c76e}.flow i{align-self:center;color:#e7c76e;font-style:normal;font-size:24px}.flow span{font-size:12px;color:#9eb5ba;line-height:1.45}.passport{display:grid;grid-template-columns:.8fr 1.2fr;gap:28px}.compare{display:grid;grid-template-columns:1fr 1fr;gap:12px}.question{background:#06151c;border:1px solid #e7c76e!important;padding-left:32px;padding-right:32px}.question h2{max-width:1300px}.buttons{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0}.buttons button{cursor:pointer;background:#071920;border:1px solid #31555d;color:#eefcff;padding:13px 16px;font-weight:800}.buttons button.active{border-color:#72e6df;background:#0b2930}.receipt{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#17343b}.receipt>div{background:#031015;padding:20px;min-height:105px}.receipt small,.receipt b{display:block}.receipt b{margin-top:10px}.receipt aside{grid-column:1/-1;padding:25px;background:#06151c;border-top:2px solid #72e6df}.receipt aside.hold{border-color:#e7c76e}.receipt strong{display:block;font-size:54px;margin:6px 0}.discipline{border-left:3px solid #e7c76e;padding:14px 18px;background:#031015}.split{display:grid;grid-template-columns:1fr 1fr;gap:12px}.split b{color:#e7c76e}.chain>div{display:grid;grid-template-columns:repeat(8,1fr);gap:5px;margin:30px 0}.chain span{border:1px solid #24464d;background:#06151c;padding:15px;min-height:95px}.chain span small,.chain span b{display:block}.chain span b{margin-top:12px;font-size:12px}.steps{grid-template-columns:repeat(4,1fr)}.steps article>b{font-size:28px;color:#e7c76e}.roles>div{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.challenge{background:#041117}.rule{font-size:clamp(25px,4vw,50px);font-weight:900;color:#e7c76e;margin-top:32px}.cta{text-align:center}.cta h2{margin-left:auto;margin-right:auto}.cta>div{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.cta a{border:1px solid #72e6df;color:#eefcff;padding:15px 20px;text-decoration:none;font-weight:900}footer{padding:36px 0;display:flex;justify-content:space-between;gap:30px;color:#91a9ae;font-size:12px}footer span{max-width:850px}
 @media(max-width:950px){.whyFlow,.keyGrid,.keyGrid.four,.bulletGrid,.bulletGrid.four,.archList,.crossingReadout,.matchResult,.timeResult{grid-template-columns:1fr}.three,.passport,.compare,.split,.steps,.roles>div,.chain>div,.receipt{grid-template-columns:1fr}.receipt aside{grid-column:auto}.flow{grid-template-columns:1fr}.flow>div{width:auto}.flow i{transform:rotate(90deg)}nav,footer{flex-direction:column}.quote,.question{padding-left:18px;padding-right:18px}}
 `}</style>
 </main>
}