'use client';
import Link from 'next/link';
import {useState} from 'react';

const scenarios=[
  {label:'FROZEN BASELINE',co2:'Elevated',sensor:'Current + attributable',outdoor:'Acceptable',authority:'Established · bounded',standing:'Established',result:'ALLOW',tone:'allow',detail:'The frozen state supports the proposed 35% increase in outdoor-air ventilation within the examined boundary.'},
  {label:'OUTDOOR PM2.5 RISES',co2:'Elevated',sensor:'Current + attributable',outdoor:'Material PM2.5 concern',authority:'Established · bounded',standing:'Not established',result:'HOLD',tone:'hold',detail:'Reality changed before execution. The earlier proposal does not silently retain standing under the new environmental state.'},
  {label:'SENSOR BASIS LOST',co2:'Displayed as elevated',sensor:'Attribution / verification not established',outdoor:'Acceptable',authority:'Established · bounded',standing:'Not established',result:'HOLD',tone:'hold',detail:'A displayed value is not treated as sufficient current evidence when its evidence basis is no longer established.'},
  {label:'AUTHORITY EXPIRED',co2:'Elevated',sensor:'Current + attributable',outdoor:'Acceptable',authority:'Expired / not current',standing:'Not established',result:'DENY',tone:'deny',detail:'Technical capability does not substitute for current authority. The old permission cannot be silently reused.'},
  {label:'HIGHER-PRIORITY CONDITION',co2:'Elevated',sensor:'Current + attributable',outdoor:'Competing safety condition',authority:'Requires qualified review',standing:'Not established',result:'ESCALATE',tone:'escalate',detail:'A higher-priority condition changes the execution context and requires another qualified authority or process.'}
];

const chain=['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'];

export default function Page(){
  const [i,setI]=useState(0);
  const s=scenarios[i];
  return <main className="p"><div className="shell">
    <nav><Link className="brand" href="/"><b>TA-14</b> AUTHORITY</Link><Link href="/global-institutional-engagement/showrooms">PUBLIC SHOWROOMS</Link></nav>

    <header>
      <small>INDEPENDENT TA-14 PUBLIC TECHNICAL DEMONSTRATION · HEALTHY INDOOR AIR</small>
      <h1>From measurement to action.<br/><em>What authorizes the building to act?</em></h1>
      <p>Indoor-air science can tell us what is happening. Sensors can measure it. Analytics can interpret it. AI and building automation can propose a response. TA-14 isolates the next boundary: whether that proposed physical consequence has sufficient admissibility, authority, and standing to become reality now.</p>
      <div className="question">Does this proposed consequence have sufficient <b>ADMISSIBILITY</b>, <b>AUTHORITY</b>, and <b>STANDING</b> to become reality <b>NOW</b>?</div>
      <aside><b>INDEPENDENT TECHNICAL DEMONSTRATION</b> This surface is independently produced by TA-14 Authority. It is not a certification, endorsement, implementation, interpretation, or official examination of the Global Commission on Healthy Indoor Air, the International WELL Building Institute, the Global Framework for Action, or any participating commissioner or organization. No affiliation or endorsement is implied.</aside>
    </header>

    <section>
      <small>PUBLIC CONTEXT · SEPTEMBER 22, 2026</small>
      <h2>A global framework is moving healthy indoor air toward implementation.</h2>
      <p>The Global Commission on Healthy Indoor Air announced its Global Framework for Action during Climate Week in New York. The published framework describes more than 200 commissioners from over 40 countries, nine interconnected levers, 40 strategic focus areas, and nearly 180 recommendations. Its stated vision includes healthy indoor air becoming expected, measured, valued, financed, governed, and continuously improved.</p>
      <div className="context">
        <article><b>200+</b><span>COMMISSIONERS</span></article><article><b>40+</b><span>COUNTRIES</span></article><article><b>9</b><span>INTERCONNECTED LEVERS</span></article><article><b>~180</b><span>RECOMMENDATIONS</span></article>
      </div>
      <div className="source">PUBLIC CONTEXT ONLY · GLOBAL FRAMEWORK FOR ACTION · GLOBAL COMMISSION ON HEALTHY INDOOR AIR · IWBI · SEPTEMBER 22, 2026</div>
    </section>

    <section>
      <small>THE SCENARIO</small>
      <h2>Classroom 214 has elevated CO₂.</h2>
      <p>The ventilation system is operational. Twenty-seven people occupy the room. Initial outdoor-air conditions are acceptable. The control system proposes a physical response.</p>
      <div className="proposal"><span>PROPOSED CONSEQUENCE</span><strong>Increase outdoor-air ventilation by 35%.</strong><p>The intervention appears technically reasonable. But a reasonable intervention is not automatically an admissible execution.</p></div>
      <div className="tri">
        <article><b>01 · ADMISSIBILITY</b><h3>Is the evidence sufficient, attributable, and current?</h3><p>CO₂ measurement, sensor identity, occupancy, HVAC state, and relevant outdoor conditions must support the examination.</p></article>
        <article><b>02 · AUTHORITY</b><h3>Is this exact intervention permitted within scope?</h3><p>The proposing system may possess bounded control authority without possessing unlimited authority to act under every condition.</p></article>
        <article><b>03 · STANDING</b><h3>Do the conditions still apply now?</h3><p>Present evidence, authority, actors, systems, and environmental conditions must still support exercising that authority.</p></article>
      </div>
    </section>

    <section>
      <small>INTERACTIVE CONSEQUENCE BOUNDARY</small>
      <h2>Keep the record visible. Change reality.</h2>
      <p>Select a condition. The original proposal stays visible while its present execution eligibility is re-examined. A changed condition does not rewrite the earlier record.</p>
      <div className="buttons">{scenarios.map((x,n)=><button className={n===i?'on':''} onClick={()=>setI(n)} key={x.label}>{x.label}</button>)}</div>
      <div className="panel">
        <article>
          <small>PRESENTED STATE</small><h3>{s.label}</h3>
          <dl><div><dt>CLASSROOM CO₂</dt><dd>{s.co2}</dd></div><div><dt>SENSOR BASIS</dt><dd>{s.sensor}</dd></div><div><dt>OUTDOOR / CONTEXT</dt><dd>{s.outdoor}</dd></div><div><dt>AUTHORITY STATE</dt><dd>{s.authority}</dd></div><div><dt>CURRENT STANDING</dt><dd>{s.standing}</dd></div></dl>
        </article>
        <article className={'result '+s.tone}><small>TA-14 DETERMINATION</small><strong>{s.result}</strong><p>{s.detail}</p>{i>0&&<b>REVALIDATION REQUIRED · NEW PROPOSITION = NEW CHAIN</b>}</article>
      </div>
      <button className="restore" onClick={()=>setI(0)}>RESTORE FROZEN BASELINE</button>
    </section>

    <section>
      <small>THE RULE</small>
      <h2>The correct response is not silent correction.</h2>
      <p>If outdoor PM2.5 materially changes before execution, the system does not simply invent a replacement intervention and pretend the original chain remains valid. The proposed consequence is held, the changed condition is recorded, and a new proposal may begin under the new reality.</p>
      <div className="distinctions">
        {['MEASUREMENT ≠ INTERPRETATION','INTERPRETATION ≠ DECISION','DECISION ≠ EXECUTION AUTHORITY','AUTHORITY ≠ PRESENT STANDING','PREVIOUS APPROVAL ≠ CURRENT PERMISSION','ADMISSIBLE EVIDENCE ≠ INTERVENTION AUTHORITY'].map(x=><span key={x}>{x}</span>)}
      </div>
      <div className="outcome">A GOOD OUTCOME DOES NOT RETROACTIVELY AUTHORIZE AN INADMISSIBLE EXECUTION.</div>
    </section>

    <section>
      <small>THE COMPLETE BOUNDARY</small>
      <h2>Govern the chain all the way to consequence.</h2>
      <div className="chain">{chain.map(x=><span key={x}>{x}</span>)}</div>
      <p>After outcome, the artifact closes. Continued operation requires current evidence. Changed conditions require revalidation. A new consequential action begins a new chain.</p>
    </section>

    <section>
      <small>WHY THIS MATTERS NOW</small>
      <h2>The distance between observing reality and changing reality is shrinking.</h2>
      <p>Healthy indoor air is moving beyond periodic measurement. Buildings increasingly combine sensors, analytics, connected controls, automation, digital infrastructure, and artificial intelligence. That creates enormous opportunity—and makes the consequence boundary increasingly important.</p>
      <div className="finalq">The question can no longer be only:<br/><b>WHAT SHOULD THE BUILDING DO?</b><br/><br/>It must also be:<br/><strong>WHAT ESTABLISHES THAT THE BUILDING MAY DO IT NOW?</strong></div>
    </section>

    <footer><b>TA-14 AUTHORITY</b><br/>No admissible evidence. No admissible execution.<br/>Independent public technical demonstration · No IWBI or Global Commission endorsement or affiliation claimed.</footer>
  </div><style>{`
    *{box-sizing:border-box}.p{min-height:100vh;background:radial-gradient(circle at 14% 0%,rgba(55,175,214,.18),transparent 30%),radial-gradient(circle at 88% 8%,rgba(240,200,108,.08),transparent 25%),linear-gradient(180deg,#02080d,#071720 48%,#02080c);color:#edf6f8;font-family:Arial,sans-serif}.shell{width:min(1160px,calc(100% - 34px));margin:auto}nav{height:76px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff14}nav a{color:#cfe9f1;text-decoration:none;font-size:10px;font-weight:900;letter-spacing:.12em}.brand{font-size:18px!important}.brand b,small{color:#73e0ff}header{padding:86px 0 55px}header h1{max-width:1080px;margin:15px 0 22px;font:clamp(50px,7.5vw,90px)/.96 Georgia,serif;letter-spacing:-.045em}header h1 em{color:#f1ca6c;font-style:normal}header p,section>p{max-width:930px;color:#a8bbc5;font-size:17px;line-height:1.75}small{font-size:10px;font-weight:950;letter-spacing:.17em}.question{margin:32px 0;padding:30px;border:1px solid #73e0ff40;border-radius:18px;background:#081f2ac2;font:clamp(23px,3vw,36px)/1.35 Georgia,serif}.question b{color:#f1ca6c}aside{padding:22px;border:1px solid #f1ca6c38;border-radius:15px;color:#9eb0b9;font-size:12px;line-height:1.7}aside b{color:#f1ca6c;margin-right:12px}section{padding:68px 0;border-top:1px solid #ffffff12}section h2{max-width:980px;margin:10px 0 20px;font:clamp(36px,5vw,58px)/1.04 Georgia,serif}.context{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:30px}.context article,.tri article,.panel article{padding:24px;border:1px solid #ffffff19;border-radius:17px;background:#06141db8}.context b{display:block;color:#f1ca6c;font:36px Georgia,serif}.context span{font-size:9px;color:#8fa5b0;font-weight:900}.source{margin-top:20px;padding:14px;border-left:3px solid #73e0ff;color:#8fa5b0;font-size:9px;letter-spacing:.1em}.proposal{margin-top:30px;padding:30px;border:1px solid #f1ca6c38;border-radius:20px;background:#2a210a30}.proposal span{display:block;color:#f1ca6c;font-size:9px;font-weight:950;letter-spacing:.15em}.proposal strong{display:block;margin:10px 0;font:clamp(28px,4vw,46px) Georgia,serif}.proposal p{color:#98abb5;line-height:1.65}.tri{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px}.tri b{color:#73e0ff;font-size:10px}.tri h3{font:21px Georgia,serif}.tri p,.panel p{color:#8fa5b0;font-size:12px;line-height:1.7}.buttons{display:flex;flex-wrap:wrap;gap:8px;margin:28px 0}.buttons button,.restore{cursor:pointer;padding:11px 14px;border:1px solid #73e0ff38;border-radius:999px;background:#071923;color:#9eb5bf;font-size:9px;font-weight:900}.buttons .on{border-color:#73e0ff;color:white;background:#0c3443}.panel{display:grid;grid-template-columns:1.1fr .9fr;gap:15px}.panel h3{font:25px Georgia,serif}.panel dl div{display:flex;justify-content:space-between;gap:20px;padding:11px 0;border-top:1px solid #ffffff12}dt{color:#77909c;font-size:9px;font-weight:900}dd{margin:0;text-align:right;font-size:11px;font-weight:800}.result{display:flex;flex-direction:column;justify-content:center}.result strong{margin:15px 0;font-size:clamp(36px,5vw,60px);line-height:1}.result.allow strong{color:#70e0ae}.result.hold strong{color:#f1ca6c}.result.deny strong{color:#ff8d8d}.result.escalate strong{color:#bca8ff}.result>b{color:#73e0ff;font-size:9px}.restore{margin-top:15px}.distinctions{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:28px}.distinctions span{padding:18px;border:1px solid #73e0ff24;border-radius:12px;color:#b8dbe5;font-size:11px;font-weight:900}.outcome{margin-top:28px;padding:25px;border-left:3px solid #f1ca6c;background:#2a210a30;color:#f1ca6c;font:20px Georgia,serif}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:7px;margin:28px 0}.chain span{padding:14px 7px;border:1px solid #73e0ff26;border-radius:8px;text-align:center;color:#91cddd;font-size:8px;font-weight:900}.finalq{margin-top:30px;padding:34px;border:1px solid #ffffff16;border-radius:20px;background:#06141db8;color:#a8bbc5;font:20px/1.55 Georgia,serif}.finalq b{color:#dcecf1}.finalq strong{color:#f1ca6c;font-size:clamp(25px,4vw,42px)}footer{padding:48px 0 70px;border-top:1px solid #ffffff12;color:#748a95;font-size:10px;line-height:1.8}@media(max-width:850px){.context,.tri,.panel,.distinctions{grid-template-columns:1fr}.chain{grid-template-columns:1fr 1fr}} 
  `}</style></main>
}