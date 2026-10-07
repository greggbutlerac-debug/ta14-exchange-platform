'use client';
import {useState} from 'react';

const states=[
 {t:'Registered identity',s:'REGISTERED · PUBLIC',d:'Velos Systems v1.0.0 is the registered independent governance identity. Registration preserves identity and provenance; it does not establish Technical Freeze, interoperability, execution authority, safety, certification, or a TA-14 finding.'},
 {t:'Prior R1',s:'CLOSED · NO FINAL TA-14 FINDING',d:'The earlier R1 chain closed without a final TA-14 finding. A participant-reported local result remains distinct from an institutional finding and cannot be promoted into one retrospectively.'},
 {t:'Successor R1',s:'OPEN · PRESENT-STATE REVALIDATION',d:'The successor R1 is a new present-state chain. It does not repair, replace, or silently inherit standing from the prior closure.'},
 {t:'Reconciled facts',s:'FREEZE PREPARATION · NOT FREEZE',d:'Identity, authority, registered baseline, interface terminology, execution-crossing point, revocation behavior, receipt semantics, chronology model, performance exclusion, proposition, and non-claim boundary are sufficiently reconciled for freeze preparation.'},
 {t:'Freeze blockers',s:'HOLD · TECHNICAL FREEZE NOT YET ESTABLISHED',d:'Immutable artifact digests, final environment identities, target fixture, evidence collectors, reproducible failure fixtures, acceptance criteria, publication boundary, replay terms if used, and final participant freeze acceptance still have to be sealed.'},
 {t:'Attempt execution',s:'HOLD · EXECUTION NOT AUTHORIZED',d:'Until Technical Freeze is formally issued, execution remains exploratory and cannot be admitted as R1 examination evidence.'},
 {t:'Attempt silent inheritance',s:'DENY · NO SILENT INHERITANCE',d:'Neither registration nor the prior chain supplies present standing to the successor R1. Current-state evidence must independently satisfy the new examination chain.'}
] as const;

const route=[
 ['1','UPSTREAM STATE','A frozen TA-14 state is presented across the declared interface.'],
 ['2','NATIVE VELOS EVALUATION','Velos evaluates the received state using its own declared native invariants.'],
 ['3','LAYER-4 BOUNDARY','The declared execution cut is the tc_ingress decision point before the destination application socket.'],
 ['4','PASS OR INTERDICT','Declared progression is TC_ACT_OK; declared refusal uses TC_ACT_SHOT / channel teardown behavior within the frozen route.'],
 ['5','REFUSAL EVIDENCE','Kernel event and Governance Refusal Receipt must bind the challenged action to the refusal chronology.']
];

const guides={
 architecture:"This is Velos Systems v1.0.0, the registered governance identity preserved as TA-14-AIGR-000029. Read the architecture from left to right: an upstream state reaches the declared Velos boundary, Velos evaluates that state using its own native invariants, and the consequential question becomes whether progression is permitted or actively interdicted before the destination application socket. Registration preserves identity. It does not establish interoperability, performance, Technical Freeze, execution authority, or a TA-14 finding.",
 consequence:"The central test is not whether Velos can detect or describe a prohibited condition. The burden is stronger. If the frozen proposition requires refusal, the consequence must not cross the declared execution boundary. The evidence must then connect the challenged action, the native Velos determination, the execution cut, and the resulting refusal record. That is why active interdiction and passive observation are kept separate.",
 operating:"This image shows the broader operating context in which an enforcement substrate may be discussed. It is context, not an examination result. R1 remains bounded to one declared interface, one declared Layer-4 execution boundary, one frozen proposition, and evidence capable of proving whether the challenged consequence crossed. Broader claims about aviation, maritime, rail, utilities, cities, resilience, sustainability, security, safety, certification, superiority, or production readiness are not established by this showroom.",
 status:"There are two R1 chains associated with one registered Velos identity, but they do not share standing. The prior chain is closed without a final TA-14 finding. The successor chain is a present-state revalidation. It must establish its own current evidence and complete Technical Freeze before execution can count as R1 examination evidence. Nothing is silently inherited.",
 evidence:"The successor R1 proposition carries five burdens: interface correspondence, native Velos evaluation, pre-execution refusal, evidence correspondence, and proof that enforcement was active rather than merely observational. A future finding can be no broader than the admitted frozen evidence supporting those burdens."
} as const;

export default function VelosShowcase(){
 const [i,setI]=useState(0); const [speaking,setSpeaking]=useState<string|null>(null); const x=states[i];
 const speak=(key:keyof typeof guides)=>{if(typeof window==='undefined'||!('speechSynthesis' in window))return; window.speechSynthesis.cancel(); if(speaking===key){setSpeaking(null);return;} const u=new SpeechSynthesisUtterance(guides[key]); u.rate=.94; u.pitch=1.02; u.onend=()=>setSpeaking(null); u.onerror=()=>setSpeaking(null); setSpeaking(key); window.speechSynthesis.speak(u);};
 return <main className="shell">
  <div className="wrap">
   <nav><a href="/registry/records/TA-14-AIGR-000029">← PERMANENT REGISTRY RECORD</a><span>TA-14 · REGISTERED GOVERNANCE SHOWROOM</span></nav>
   <header className="hero">
    <p className="eyebrow">TA-14-AIGR-000029 · VELOS SYSTEMS · v1.0.0</p>
    <h1>Can an inadmissible consequence be stopped <em>before execution?</em></h1>
    <p className="lede">Velos declares a Layer-4 deterministic enforcement substrate. The TA-14 examination question is narrower than the marketing claim: can a frozen inadmissible state cross the declared interface, be evaluated by native Velos logic, and be actively interdicted before the consequence crosses the declared execution boundary—with evidence proving prevention rather than observation?</p>
    <div className="rule">REGISTRATION ≠ TECHNICAL FREEZE · TECHNICAL FREEZE ≠ EXECUTION · PRIOR EVIDENCE ≠ PRESENT STANDING</div>
   </header>

   <section className="visual">
    <p className="eyebrow">01 · THE REGISTERED ARCHITECTURE</p>
    <h2>Velos is the enforcement substrate. TA-14 does not redefine it.</h2>
    <img src="/Velos Systems Global Operations Hub.png" alt="Velos Systems registered governance architecture" />
    <div className="samantha"><div><span>SAMANTHA · ARCHITECTURE GUIDE</span><p>{guides.architecture}</p></div><button type="button" onClick={()=>speak('architecture')}>{speaking==='architecture'?'■ STOP':'▶ LISTEN TO SAMANTHA'}</button></div>
   </section>

   <section className="route">
    <p className="eyebrow">02 · THE CONSEQUENCE PATH</p><h2>Do not ask whether the system saw the violation. Ask whether the consequence crossed.</h2>
    <div className="routegrid">{route.map(r=><article key={r[0]}><b>{r[0]}</b><h3>{r[1]}</h3><p>{r[2]}</p></article>)}</div>
    <div className="maxim">ACTIVE INTERDICTION ≠ PASSIVE OBSERVATION</div><div className="samantha compact"><div><span>SAMANTHA · CONSEQUENCE GUIDE</span><p>{guides.consequence}</p></div><button type="button" onClick={()=>speak('consequence')}>{speaking==='consequence'?'■ STOP':'▶ LISTEN'}</button></div>
   </section>

   <section className="lab">
    <div className="controls"><p className="eyebrow">03 · OPERATE THE GOVERNANCE</p><h2>Two chains. One identity. No silent inheritance.</h2>{states.map((v,n)=><button key={v.t} onClick={()=>setI(n)} className={i===n?'active':''}>{String(n+1).padStart(2,'0')} · {v.t}</button>)}</div>
    <div className="state"><div className="voiceRow"><small>CURRENT CONTROLLED STATE</small><button type="button" onClick={()=>speak('status')}>{speaking==='status'?'■ STOP SAMANTHA':'▶ SAMANTHA EXPLAINS'}</button></div><h3>{x.s}</h3><p>{x.d}</p><div className="split"><span><b>PRIOR R1</b><br/>CLOSED<br/><small>NO FINAL TA-14 FINDING</small></span><strong>≠</strong><span><b>SUCCESSOR R1</b><br/>PRESENT-STATE CHAIN<br/><small>TECHNICAL FREEZE NOT YET ISSUED</small></span></div><button className="reset" onClick={()=>setI(0)}>RESTORE REGISTRATION BASELINE</button></div>
   </section>

   <section className="visual light">
    <p className="eyebrow">04 · THE COMPLETE OPERATING PICTURE</p><h2>The larger system matters. The examination claim remains bounded.</h2>
    <img src="/Velos Systems_ Governance in Motion.png" alt="Velos Systems governance workflow and operating picture" />
    <div className="samantha"><div><span>SAMANTHA · BOUNDARY GUIDE</span><p>{guides.operating}</p></div><button type="button" onClick={()=>speak('operating')}>{speaking==='operating'?'■ STOP':'▶ LISTEN TO SAMANTHA'}</button></div>
   </section>

   <section className="evidence">
    <p className="eyebrow">05 · WHAT THE SUCCESSOR R1 IS ACTUALLY TRYING TO ESTABLISH</p><h2>One proposition. Five burdens.</h2>
    <div className="cards">
     <article><b>P1-A</b><h3>Interface correspondence</h3><p>The frozen state must cross the exact declared carrier without semantic substitution or undeclared authority creation.</p></article>
     <article><b>P1-B</b><h3>Native evaluation</h3><p>Velos must evaluate the state using declared native invariants—not a TA-14-authored replacement engine.</p></article>
     <article><b>P1-C</b><h3>Pre-execution refusal</h3><p>When refusal is required, the challenged consequence must not cross the declared execution boundary.</p></article>
     <article><b>P1-D</b><h3>Evidence correspondence</h3><p>The event and receipt must correlate to the challenged action, native determination, execution cut, and chronology.</p></article>
     <article><b>P1-E</b><h3>Active enforcement</h3><p>The admitted evidence must distinguish prevention from detection, alerting, logging, or retrospective explanation.</p></article>
    </div><div className="samantha compact"><div><span>SAMANTHA · EVIDENCE GUIDE</span><p>{guides.evidence}</p></div><button type="button" onClick={()=>speak('evidence')}>{speaking==='evidence'?'■ STOP':'▶ LISTEN'}</button></div>
   </section>

   <section className="freeze">
    <div><p className="eyebrow">06 · PRESENT STATE</p><h2>Ready for final freeze-completion package.</h2><p>The proposition, native semantics, route, consequence boundary, evidence channels, and failure logic have advanced beyond broad architectural scoping. Exact identity sealing and final participant acceptance remain.</p></div>
    <div className="hold"><small>R1 STATUS</small><strong>TECHNICAL FREEZE<br/>NOT YET ISSUED</strong><p>No R1 examination execution is authorized until final immutable identities and freeze acceptance are preserved.</p></div>
   </section>

   <section className="ceiling">
    <p className="eyebrow">07 · CLAIM CEILING</p><h2>A successful future R1 would still be a bounded finding.</h2>
    <div className="claims"><span>NO UNIVERSAL INTEROPERABILITY</span><span>NO SECURITY CERTIFICATION</span><span>NO SAFETY CERTIFICATION</span><span>NO PRODUCTION RELIANCE</span><span>NO PERFORMANCE FINDING</span><span>NO ARCHITECTURE MERGER</span></div>
    <p className="note">The declared &lt;4.0 µs latency profile is excluded from R1. Any captured latency remains participant telemetry unless separately frozen and admitted under an appropriate measurement proposition.</p>
   </section>

   <footer><b>VELOS SYSTEMS · TA-14-AIGR-000029</b><span>REGISTERED IDENTITY → FREEZE → EXECUTION → EVIDENCE → FINDING</span><small>Registration is not certification. Interactive presentation does not create a finding.</small></footer>
  </div>
  <style jsx>{`
   :global(*){box-sizing:border-box}:global(body){margin:0;background:#02070d;color:#eef7fb;font-family:Inter,system-ui,sans-serif}:global(a){color:inherit;text-decoration:none}.shell{min-height:100vh;background:radial-gradient(circle at 12% 0%,#073c58 0,transparent 25%),radial-gradient(circle at 88% 18%,#49340d55 0,transparent 24%),linear-gradient(180deg,#02070d,#061522 52%,#02070d)}.wrap{width:min(1440px,100%);margin:auto}nav{padding:22px 4vw;display:flex;justify-content:space-between;border-bottom:1px solid #17384b;color:#91cfe3;font-size:.75rem;letter-spacing:.12em}.hero,.visual,.route,.lab,.evidence,.freeze,.ceiling,footer{margin:0 4vw}.hero{padding:85px 0 55px}.eyebrow{color:#70ddff;font-size:.7rem;font-weight:900;letter-spacing:.16em}.hero h1{font-size:clamp(3.4rem,7.4vw,7.3rem);line-height:.91;max-width:1200px;margin:14px 0 26px}.hero h1 em{font-style:normal;color:#e5b957}.lede{max-width:1040px;color:#b7cbd6;font-size:1.08rem;line-height:1.75}.rule{margin-top:28px;border:1px solid #8a6b2e;padding:16px;border-radius:12px;color:#f0c96f;background:#191506;font-weight:900;letter-spacing:.06em}.visual,.route,.evidence,.freeze,.ceiling{padding:55px 0;border-top:1px solid #15384a}.visual h2,.route h2,.evidence h2,.freeze h2,.ceiling h2,.controls h2{font-size:clamp(2rem,4vw,4.1rem);line-height:1.02;max-width:1050px;margin:9px 0 28px}.visual img{width:100%;display:block;border:1px solid #26556d;border-radius:20px;box-shadow:0 25px 70px #0009}.samantha{margin-top:18px;border:1px solid #8a6b2e;border-radius:16px;background:linear-gradient(135deg,#171306,#071724);padding:20px;display:flex;gap:22px;align-items:center;justify-content:space-between}.samantha span{color:#e7bc62;font-weight:950;letter-spacing:.09em;font-size:.75rem}.samantha p{color:#b7cad5;line-height:1.75;margin:9px 0 0;max-width:1050px}.samantha button,.voiceRow button{flex:0 0 auto;padding:11px 14px;border:1px solid #e0b458;border-radius:999px;background:#2c2209;color:#f4d17d;font-weight:900;cursor:pointer}.compact{margin-top:16px}.voiceRow{display:flex;justify-content:space-between;gap:15px;align-items:center}.voiceRow button{font-size:.68rem}.routegrid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.routegrid article,.cards article{border:1px solid #1d4c63;background:#06141f;border-radius:16px;padding:20px}.routegrid b,.cards b{color:#e6b957;font-size:1.4rem}.routegrid h3,.cards h3{font-size:1.05rem}.routegrid p,.cards p{color:#a9c0cd;line-height:1.6;font-size:.9rem}.maxim{margin-top:16px;text-align:center;padding:18px;border-radius:12px;background:#0a2636;border:1px solid #3c87a7;color:#8be4ff;font-weight:950;letter-spacing:.13em}.lab{display:grid;grid-template-columns:.8fr 1.2fr;gap:18px;padding:55px 0;border-top:1px solid #15384a}.controls,.state{border:1px solid #1b465c;border-radius:20px;background:#06131e;padding:25px}.controls button{display:block;width:100%;text-align:left;padding:12px 13px;margin:6px 0;border-radius:10px;border:1px solid #234b5f;background:#071a26;color:#bed1da;font-weight:800;cursor:pointer}.controls button.active{border-color:#e1b65d;background:#35290d;color:white}.state small{color:#7895a5;font-weight:900;letter-spacing:.12em}.state h3{color:#e5b957;font-size:clamp(2rem,4vw,3.7rem);margin:12px 0}.state>p{color:#b7cbd6;line-height:1.75}.split{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;margin-top:28px}.split span{border:1px solid #28536a;border-radius:13px;padding:20px;text-align:center;line-height:1.7}.split strong{color:#e5b957;font-size:2rem}.reset{margin-top:18px;padding:10px 14px;border:1px solid #7b6330;border-radius:9px;background:transparent;color:#e5b957;font-weight:900;cursor:pointer}.light{background:linear-gradient(180deg,transparent,#0a1b2855,transparent)}.cards{display:grid;grid-template-columns:repeat(5,1fr);gap:11px}.freeze{display:grid;grid-template-columns:1.3fr .7fr;gap:25px}.freeze>div>p{color:#adc3cf;line-height:1.7}.hold{border:1px solid #8a6b2e;border-radius:18px;background:#191406;padding:26px}.hold strong{display:block;color:#f0c96f;font-size:1.5rem;margin:12px 0}.claims{display:flex;flex-wrap:wrap;gap:9px}.claims span{border:1px solid #694b4b;background:#1a0d0d;padding:11px 13px;border-radius:999px;color:#ffc0c0;font-size:.75rem;font-weight:900}.note{color:#9fb7c4;line-height:1.7;max-width:1000px;margin-top:25px}footer{padding:45px 0 70px;border-top:1px solid #17384b;display:flex;gap:20px;justify-content:space-between;align-items:center;color:#8fa8b5;font-size:.75rem}footer b{color:#e6b957} @media(max-width:950px){.routegrid,.cards{grid-template-columns:1fr 1fr}.lab,.freeze{grid-template-columns:1fr}.split{grid-template-columns:1fr}.split strong{text-align:center}footer{align-items:flex-start;flex-direction:column}}@media(max-width:600px){.samantha,.voiceRow{align-items:flex-start;flex-direction:column}.routegrid,.cards{grid-template-columns:1fr}.hero{padding-top:55px}nav{gap:15px;flex-wrap:wrap}}
  `}</style>
 </main>
}