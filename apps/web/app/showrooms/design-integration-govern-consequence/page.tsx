'use client';

import Link from 'next/link';
import {useMemo,useState} from 'react';

const systems=[
 {id:'bas',name:'BAS',detail:'Coordinates HVAC sequences, schedules, setpoints and equipment commands.'},
 {id:'lighting',name:'LIGHTING',detail:'Controls occupied-state lighting, schedules and demand response.'},
 {id:'metering',name:'METERING',detail:'Provides electrical and energy observations used by supervisory logic.'},
 {id:'fire',name:'FIRE / LIFE SAFETY',detail:'Carries life-safety state that can materially change what other systems should do.'},
 {id:'access',name:'ACCESS CONTROL',detail:'Controls physical access and may exchange occupancy or emergency-state context.'},
 {id:'ai',name:'AI / ANALYTICS',detail:'Can interpret observations and propose actions without thereby acquiring execution authority.'},
];

const scenarios=[
 {name:'NORMAL OPERATION',signal:'CO₂ rising in occupied zone while outdoor-air quality is degraded',proposal:'Increase outside-air ventilation',evidence:'Current CO₂, occupancy and outdoor-air observations are available; the ventilation recommendation is technically reasonable.',authority:'The BAS is permitted to modulate ventilation, but the applicable operating envelope must account for the competing outdoor-air condition.',standing:'Standing for this specific increase is not yet established until the current outdoor-air constraint and operating limit are resolved.',defaultDecision:'HOLD'},
 {name:'CHANGED REALITY',signal:'Fire alarm state changes after an HVAC optimization was calculated',proposal:'Start supply fan from the earlier optimization',evidence:'The earlier optimization may remain technically valid as a historical computation, but reality has materially changed.',authority:'The prior operating route cannot silently outrank current life-safety constraints.',standing:'Present standing must be re-established against the changed state before consequence.',defaultDecision:'HOLD'},
 {name:'CYBER EVENT',signal:'Authenticated BAS command arrives during an active security anomaly',proposal:'Override AHU operating mode',evidence:'Identity and transport may be valid while the surrounding evidence state remains unresolved.',authority:'Authentication establishes who or what sent the command; it does not by itself establish authority for this consequence.',standing:'Current standing is unresolved until the anomaly and applicable authority are examined.',defaultDecision:'ESCALATE'},
];

export default function Page(){
 const [selected,setSelected]=useState('bas');
 const [scenario,setScenario]=useState(0);
 const [stage,setStage]=useState(0);
 const [decision,setDecision]=useState<string|null>(null);
 const current=scenarios[scenario];
 const system=useMemo(()=>systems.find(s=>s.id===selected)!,[selected]);
 const stages=['OWNER INTENT','SYSTEMS','USE CASE','INTEGRATION','CYBERSECURITY','COMMISSIONING','RUNTIME','CONSEQUENCE'];
 function reset(i:number){setScenario(i);setStage(0);setDecision(null)}
 return <main className="page">
  <nav className="nav wrap"><Link href="/showrooms">TA-14 EXCHANGE · SHOWROOMS</Link><div><a href="#lab">INTERACTIVE TEST</a><a href="#boundary">CONSEQUENCE BOUNDARY</a></div></nav>

  <header className="hero wrap">
   <p className="eyebrow">TA-14 RESPONSE SHOWROOM · SMART BUILDINGS · CONTROLS · CYBERSECURITY</p>
   <p className="attribution">PROMPTED BY A PUBLIC ENGINEERING PROPOSITION FROM GREGORY FITZPATRICK · RECC</p>
   <h1>Design the integration.<br/><em>Then govern the consequence.</em></h1>
   <p className="lede">Gregory Fitzpatrick argues that engineers should understand the owner, systems, use cases, cybersecurity, interoperability, responsibilities, commissioning and acceptance requirements before designing an integrated controls system. TA-14 accepts that proposition here as the starting point—not as an endorsement of TA-14—and asks what comes next when the finished integration is operating in changing reality.</p>
   <div className="thesis"><small>THE NEXT QUESTION</small><strong>After the integration is designed, commissioned, secured and connected — what determines whether a particular consequence is permitted to occur now?</strong></div>
  </header>

  <section className="quoteBand"><div className="wrap">
   <p className="eyebrow">01 · THE ENGINEERING SEQUENCE</p>
   <blockquote>“The goal is simple: design the integration before you specify the components.”</blockquote>
   <p className="source">PUBLIC POST · GREGORY FITZPATRICK · QUOTED AS THE PROPOSITION THAT PROMPTED THIS TA-14 RESPONSE</p>
   <div className="sequence">{['OWNER GOALS','SYSTEMS','USE CASES','INTEGRATION DRAWING','IT + CYBER','DATA + INTEROPERABILITY','ROLES','COMMISSIONING + ACCEPTANCE'].map((x,i)=><span key={x}><b>{String(i+1).padStart(2,'0')}</b>{x}</span>)}</div>
   <p className="note">This showroom does not claim Gregory Fitzpatrick, RECC, Ken Sinclair or AutomatedBuildings.com adopts TA-14. It examines a question TA-14 sees immediately downstream of the published engineering sequence.</p>
  </div></section>

  <section className="wrap section" id="boundary">
   <p className="eyebrow">02 · WHERE TA-14 ENTERS</p>
   <h2>Commissioning can establish a baseline.<br/><em>Runtime still has a consequence boundary.</em></h2>
   <div className="journey">{stages.map((x,i)=><button key={x} className={stage===i?'active':''} onClick={()=>setStage(i)}><small>{String(i+1).padStart(2,'0')}</small><b>{x}</b></button>)}</div>
   <div className="stageRead"><small>CURRENT STEP · {String(stage+1).padStart(2,'0')}</small><strong>{stages[stage]}</strong><p>{stage<6?'Necessary engineering work can establish the designed system, its intended relationships and its accepted baseline. TA-14 does not treat completion of this step as unlimited future execution authority.':stage===6?'The integrated building is now encountering present conditions. Evidence, authority, continuity and standing may differ from the commissioned baseline.':'A proposed command is about to become physical reality. This is the point at which capability must not be mistaken for authority.'}</p></div>
   <div className="handoff"><small>THE HANDOFF · COMMISSIONING → RUNTIME</small><p><strong>Commissioning established that the system was acceptable under the conditions examined then.</strong></p><span>Runtime asks whether the proposed consequence has standing under the conditions that exist now.</span></div><div className="maxim"><b>COMMISSIONED ONCE ≠ AUTHORIZED FOREVER.</b><b>CONNECTION ≠ AUTHORITY.</b><b>CAPABILITY ≠ AUTHORITY.</b></div>
  </section>

  <section className="labBand" id="lab"><div className="wrap section">
   <p className="eyebrow">03 · INTERACTIVE INTEGRATED BUILDING</p>
   <h2>Everything can be connected.<br/><em>The answer can still be HOLD.</em></h2>
   <p className="intro">Select a building system, then run one of three runtime conditions. The point is not to simulate a complete controls specification. It is to expose the seam between successful integration and permission for a particular physical consequence.</p>
   <div className="building">
    <div className="systems">{systems.map(s=><button key={s.id} onClick={()=>setSelected(s.id)} className={selected===s.id?'on':''}><small>CONNECTED</small><b>{s.name}</b></button>)}</div>
    <div className="hub"><small>INTEGRATION LAYER</small><strong>CONNECTED</strong><span>INTEROPERABLE</span><span>COMMAND CAPABLE</span></div>
   </div>
   <div className="systemRead"><small>SELECTED SYSTEM</small><h3>{system.name}</h3><p>{system.detail}</p><div><b>CONNECTED — YES</b><b>INTEROPERABLE — ASSUMED FOR THIS TEST</b><b>COMMAND CAPABLE — YES</b></div></div>

   <div className="scenarioTabs">{scenarios.map((s,i)=><button key={s.name} onClick={()=>reset(i)} className={scenario===i?'on':''}>{s.name}</button>)}</div>
   <div className="exam">
    <article><small>OBSERVED REALITY</small><h3>{current.signal}</h3><p>{current.evidence}</p></article>
    <article><small>PROPOSED CONSEQUENCE</small><h3>{current.proposal}</h3><p>A technically routable command is now approaching the consequence boundary.</p></article>
   </div>
   <div className="preflight"><small>CONVENTIONAL INTEGRATION CHECKS</small><div>{['CONNECTED ✓','INTEROPERABLE ✓','AUTHENTICATED ✓','COMMAND VALID ✓','CYBER CHECK PASSED ✓'].map(x=><b key={x}>{x}</b>)}</div><strong>AUTHORIZED NOW?</strong><p>Five green lights establish important conditions. None, by itself, answers the consequence question below.</p></div>
   <div className="gate">
    <small>TA-14 · CONSEQUENCE BOUNDARY</small>
    <h3>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</h3>
    <div className="three"><div><b>ADMISSIBLE EVIDENCE</b><p>{current.evidence}</p></div><div><b>APPLICABLE AUTHORITY</b><p>{current.authority}</p></div><div><b>ESTABLISHED STANDING</b><p>{current.standing}</p></div></div>
    <div className="decisions">{['ALLOW','HOLD','DENY','ESCALATE'].map(d=><button key={d} className={decision===d?'on':''} onClick={()=>setDecision(d)}>{d}</button>)}</div>
    {decision&&<div className="receipt"><small>YOUR TEST DETERMINATION</small><strong>{decision}</strong><p>{decision===current.defaultDecision?'This selection matches the illustrative bounded outcome encoded for this scenario. The important point is the route: the consequence is examined against present evidence, authority and standing rather than inferred from connectivity alone.':'This is a visitor-selected determination. A real examination would require the actual evidence, authority, standing, identities, timestamps, system state and applicable constraints; this showroom does not treat a button selection as operational authority.'}</p></div>}
   </div>
  </div></section>

  <section className="wrap section">
   <p className="eyebrow">04 · CYBERSECURITY AND AUTHORITY</p>
   <h2>Secure transport answers an essential question.<br/><em>It does not answer every question.</em></h2>
   <div className="compare"><article><small>CYBER / INTEGRATION CAN HELP ESTABLISH</small><h3>Can we trust the connection, identity, integrity and permitted technical relationship?</h3><p>Those controls are essential. TA-14 does not replace them.</p></article><article><small>TA-14 CONSEQUENCE QUESTION</small><h3>May this bounded consequence become reality under present conditions?</h3><p>That requires the evidence, authority and standing applicable to the actual consequence now.</p></article></div>
   <div className="warning">AUTHENTICATED ≠ AUTHORIZED FOR EVERY CONSEQUENCE · SECURELY DELIVERED ≠ ADMISSIBLE TO EXECUTE</div>
  </section>

  <section className="chainBand"><div className="wrap section">
   <p className="eyebrow">05 · FROM REALITY TO OUTCOME</p><h2>The integration carries the command.<br/><em>Governance carries the burden of consequence.</em></h2>
   <div className="chain">{['Reality','Record','Continuity','Admissibility','Binding','Commit','Execution','Outcome'].map((x,i)=><div key={x}><small>{String(i+1).padStart(2,'0')}</small><b>{x}</b></div>)}</div>
   <p className="intro">A proposed action can be technically possible, correctly addressed and securely transmitted while still lacking what is required to cross Commit. TA-14 preserves that distinction explicitly.</p>
  </div></section>

  <section className="wrap section invitation">
   <p className="eyebrow">06 · AN OPEN TECHNICAL INVITATION</p>
   <h2>Gregory gave us the first half of the sentence.</h2>
   <div className="callout"><p>Design the integration before you specify the components.</p><span>↓</span><p><strong>TA-14 asks:</strong> after the integration is designed, commissioned, secured and connected, what determines whether a particular consequence is permitted to occur now?</p></div>
   <p className="intro">This room is an independent TA-14 technical response to that question. If Gregory Fitzpatrick or RECC sees a missing assumption, a better test case, or a boundary TA-14 has drawn incorrectly, the useful next step is examination—not attribution by implication.</p>
   <div className="rules"><b>DESIGN ≠ RUNTIME STANDING</b><b>CONNECTION ≠ AUTHORITY</b><b>UNDERSTANDING ≠ PERMISSION</b><b>NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</b></div>
  </section>

  <footer className="wrap"><div><b>TA-14 AUTHORITY · INDEPENDENT RESPONSE SHOWROOM</b><p>Prompted by a public smart-building engineering discussion. No endorsement or affiliation is implied.</p></div><Link href="/showrooms">RETURN TO SHOWROOMS →</Link></footer>

  <style>{`
   *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0}.page{min-height:100vh;background:radial-gradient(circle at 10% 0,#113a5c66,transparent 27%),radial-gradient(circle at 90% 10%,#7355223d,transparent 24%),#02070c;color:#eef6fb;font-family:Arial,sans-serif}.wrap{width:min(1180px,calc(100% - 36px));margin:auto}.nav{min-height:76px;border-bottom:1px solid #ffffff17;display:flex;justify-content:space-between;align-items:center}.nav div{display:flex;gap:18px}a{color:#8ddcff;text-decoration:none;font-size:10px;font-weight:950;letter-spacing:.09em}.hero{padding:92px 0 75px}.eyebrow{color:#efc86c;font-size:10px;font-weight:950;letter-spacing:.17em}.attribution{color:#7995a4;font-size:9px;font-weight:900;letter-spacing:.12em;margin-top:16px}.hero h1,h2{font:clamp(48px,7vw,92px)/.95 Georgia,serif;letter-spacing:-.045em;margin:24px 0}.hero h1 em,h2 em{color:#efc86c;font-weight:400}.lede,.intro{max-width:940px;color:#9fb5c1;font-size:18px;line-height:1.7}.thesis{margin-top:34px;max-width:1030px;padding:25px;border:1px solid #8ddcff44;border-radius:16px;background:#8ddcff08}.thesis small,.stageRead small,.systemRead>small,.gate>small,.receipt small{display:block;color:#8ddcff;font-size:8px;font-weight:950;letter-spacing:.14em;margin-bottom:9px}.thesis strong{font:25px/1.4 Georgia,serif}.quoteBand,.labBand,.chainBand{border-top:1px solid #ffffff14;border-bottom:1px solid #ffffff14;background:#06121a}.quoteBand .wrap{padding:70px 0}.quoteBand blockquote{margin:22px 0 8px;padding:30px;border-left:3px solid #efc86c;background:#efc86c08;font:clamp(30px,4vw,50px)/1.25 Georgia,serif}.source,.note{color:#708b98;font-size:9px;line-height:1.6;font-weight:850;letter-spacing:.08em}.sequence{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:30px 0}.sequence span{padding:16px;border:1px solid #ffffff17;border-radius:12px;color:#b9cbd4;font-size:10px;font-weight:900}.sequence b{display:block;color:#efc86c;font-size:8px;margin-bottom:7px}.section{padding:75px 0}h2{font-size:clamp(38px,5vw,64px)}.journey{display:grid;grid-template-columns:repeat(8,1fr);gap:6px}.journey button,.systems button,.scenarioTabs button,.decisions button{appearance:none;border:1px solid #ffffff1b;background:#06121a;color:#8fa7b3;border-radius:11px;padding:15px 10px;cursor:pointer;font-weight:900}.journey button small{display:block;color:#617c89;margin-bottom:7px}.journey button b{font-size:9px}.journey button.active,.systems button.on,.scenarioTabs button.on,.decisions button.on{border-color:#8ddcff88;color:#8ddcff;background:#8ddcff0c}.stageRead,.systemRead{margin-top:12px;padding:24px;border:1px solid #ffffff18;border-radius:15px;background:#030b12}.stageRead strong{font:28px Georgia,serif}.stageRead p,.systemRead p,.exam p,.three p,.compare p,.receipt p,footer p{color:#91a9b5;line-height:1.6}.handoff{margin-top:12px;padding:24px;border-left:3px solid #efc86c;background:#efc86c08;border-radius:0 14px 14px 0}.handoff small{display:block;color:#efc86c;font-size:8px;font-weight:950;letter-spacing:.14em}.handoff p{font:22px/1.45 Georgia,serif;margin:10px 0;color:#e8f1f5}.handoff span{color:#9db4bf;line-height:1.6}.maxim,.rules{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.maxim b,.rules b{padding:10px 12px;border:1px solid #efc86c3d;border-radius:999px;color:#efc86c;font-size:9px}.building{display:grid;grid-template-columns:2fr 1fr;gap:12px;margin-top:32px}.systems{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.systems button{text-align:left;min-height:92px}.systems small{display:block;color:#6f8a97;font-size:7px;margin-bottom:10px}.hub{display:flex;flex-direction:column;justify-content:center;padding:25px;border:1px solid #7ff0bd55;border-radius:16px;background:#7ff0bd08}.hub small{color:#7ff0bd;font-size:8px;font-weight:900}.hub strong{font:28px Georgia,serif;margin:8px 0}.hub span{color:#9bb4c0;font-size:9px;font-weight:900;margin-top:6px}.systemRead h3,.exam h3,.compare h3,.gate h3{font:27px/1.25 Georgia,serif;margin:8px 0}.systemRead div{display:flex;gap:8px;flex-wrap:wrap}.systemRead div b{color:#7ff0bd;font-size:8px}.scenarioTabs{display:flex;gap:8px;margin:32px 0 10px}.exam{display:grid;grid-template-columns:1fr 1fr;gap:10px}.exam article,.compare article,.three div{padding:24px;border:1px solid #ffffff18;border-radius:15px;background:#030b12}.exam small,.compare small{color:#8ddcff;font-size:8px;font-weight:950;letter-spacing:.13em}.preflight{margin-top:18px;padding:24px;border:1px solid #7ff0bd55;border-radius:16px;background:#7ff0bd08}.preflight small{display:block;color:#7ff0bd;font-size:8px;font-weight:950;letter-spacing:.14em}.preflight div{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 20px}.preflight div b{padding:9px 11px;border:1px solid #7ff0bd44;border-radius:999px;color:#bdf8dc;font-size:8px}.preflight>strong{display:block;font:clamp(30px,4vw,48px) Georgia,serif;color:#efc86c}.preflight p{color:#91a9b5;line-height:1.6;margin-bottom:0}.gate{margin-top:12px;padding:30px;border:1px solid #efc86c55;border-radius:18px;background:#efc86c07}.gate h3{font-size:clamp(26px,3vw,40px);max-width:1050px}.three,.compare{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:22px}.three b{color:#efc86c;font-size:9px}.decisions{display:flex;gap:8px;margin-top:18px}.decisions button{min-width:120px}.receipt{margin-top:12px;padding:18px;border:1px solid #7ff0bd44;border-radius:12px;background:#7ff0bd07}.receipt strong{color:#7ff0bd;font-size:20px}.compare{grid-template-columns:1fr 1fr}.warning{margin-top:14px;padding:16px;text-align:center;border:1px solid #efc86c44;color:#efc86c;font-size:10px;font-weight:950;letter-spacing:.09em}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:7px;margin:30px 0}.chain div{padding:17px 10px;border:1px solid #ffffff18;border-radius:12px;background:#02070c}.chain small{display:block;color:#efc86c;font-size:8px;margin-bottom:7px}.chain b{font-size:10px}.invitation{text-align:center}.invitation .eyebrow,.invitation .intro{margin-left:auto;margin-right:auto}.callout{max-width:920px;margin:28px auto;padding:30px;border:1px solid #8ddcff44;border-radius:18px;background:#8ddcff07}.callout p{font:27px/1.45 Georgia,serif;margin:8px}.callout span{color:#efc86c;font-size:30px}.rules{justify-content:center}footer{padding:38px 0 70px;border-top:1px solid #ffffff18;display:flex;justify-content:space-between;gap:24px;align-items:center}footer b{color:#7ff0bd;font-size:10px;letter-spacing:.1em}footer p{font-size:10px;margin-bottom:0}
   @media(max-width:850px){.nav,footer{align-items:flex-start;flex-direction:column;padding:22px 0}.sequence,.journey,.systems,.three,.chain{grid-template-columns:repeat(2,1fr)}.building,.exam,.compare{grid-template-columns:1fr}.scenarioTabs,.decisions{flex-wrap:wrap}.hero{padding-top:65px}.nav div{flex-wrap:wrap}}
   @media(max-width:520px){.sequence,.journey,.systems,.three,.chain{grid-template-columns:1fr}.decisions button{min-width:calc(50% - 4px)}}
  `}</style>
 </main>
}