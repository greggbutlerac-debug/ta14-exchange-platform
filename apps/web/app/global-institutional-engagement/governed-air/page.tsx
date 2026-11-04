'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';

type Visual={
  n:string;
  k:string;
  title:string;
  img:string;
  script:string;
  takeaway:string;
};

const visuals:Visual[]=[
  {
    n:'01',
    k:'YOU ALREADY HAVE THE BEGINNING',
    title:'Continuous monitoring gives you visibility. Governed Air takes it the rest of the way.',
    img:'/governed_air_from_monitoring_to_trust.png',
    script:'Follow the numbered progression on the image with me. Number one: you already have sensors. The building may already observe atmospheric conditions continuously, including carbon dioxide, particles, temperature, humidity, airflow and pressure. Number two: you already have systems. Your BAS, HVAC, indoor-air-quality tools, energy systems, alarms and equipment data already create visibility. Number three: you already have observations. Monitoring produces readings, measurements and trends over time. Number four: monitoring has value. It can support diagnosis, optimization and awareness. Number five: but monitoring is not yet Governed Air. Observation tells us what is seen. It does not by itself establish what may happen. Number six: what is missing? A preserved record, context, provenance, continuity, bounded reliance and consequence governance. Number seven: add governance. Protect the atmospheric record, govern evidence release, bound computational reliance and examine proposed consequence before it becomes real. Number eight: that is Governed Air. Preserved atmospheric evidence, bounded intelligence, governed consequence and verified outcome. The lesson at the bottom ties the whole board together: monitored air is not the same as Governed Air. Monitoring establishes observation. Governance determines what that evidence may legitimately support.',
    takeaway:'Monitoring establishes observation. It does not by itself establish what the observation is authorized to cause.'
  },
  {
    n:'02',
    k:'AIR · PROTECT THE RECORD',
    title:'Atmospheric Integrity Records preserve what was observed and the context around it.',
    img:'/governed-air-02-air-protect-the-record-wide-final.png',
    script:'Follow the eight numbered sections on the image with me. Number one: observe reality. Sensors, BAS points, field readings, samples, photos and occupant reports show what was actually observed. Number two: capture source and time. Record who or what measured it, when, where and under what conditions. Number three: preserve the raw observation. Keep the original reading intact; do not rewrite the evidence. Number four: add context. Preserve units, location, operating state, equipment state, weather, occupancy and calibration or method. Number five: protect continuity. Maintain chronology, chain of custody, versioning, intervention boundaries and an audit trail so there are no hidden edits. Number six: build the AIR package. Organize the observation data, source and method, location and conditions, photos or files, chain of custody and chronology into a structured Atmospheric Integrity Record. Number seven: do not collapse the layers. Observation is evidence. Diagnosis is analysis. Optimization proposes options. Authorization requires proper authority. Number eight: ready for examination. The protected AIR record can now support later governance, forensic review, regulatory inquiry, legal examination, performance evaluation and continuous intelligence. The rule across the bottom is the lesson: the record is not the diagnosis. Diagnosis is not optimization. Optimization is not authority.',
    takeaway:'The record is not the diagnosis. Diagnosis is not optimization. Optimization is not authority.'
  },
  {
    n:'03',
    k:'GOVERNED EVIDENCE RELEASE',
    title:'Releasing evidence to intelligence is itself a consequence that must be governed.',
    img:'/governed-air-03-governed-evidence-release-wide-final.png',
    script:'Follow the five numbered sections on this board. Number one: preserved record. We begin with real-world atmospheric observations that have already been preserved. Number two: boundary and filtering. Decide the purpose, scope, time window, location or system, and whether sensitive information must be removed or masked. Number three: controlled release. Create a governed evidence package containing only the selected data, time range, location or system, context, method and uncertainty needed for the defined purpose. Number four: to intelligence. The identified AI receives that governed evidence for a bounded purpose such as analyzing current conditions, identifying issues, evaluating options or producing recommendations. Number five: separate output. Insights, analysis, recommendations and potential risks remain AI output, not authority. The red boundary on the board matters: AI output is not a decision, permission or command to equipment. The rule at the bottom closes the lesson: observed is not inferred, and inferred is not authorized.',
    takeaway:'Evidence crossing into intelligence is not architecturally neutral.'
  },
  {
    n:'04',
    k:'ACA · BEFORE COMPUTE',
    title:'Govern what intelligence may legitimately rely upon before computation begins.',
    img:'/governed-air-04-aca-before-compute-wide-final.png',
    script:'Follow the four numbered sections on the image. Number one: admissible inputs. Use only evidence that is real, traceable and within the established scope. Number two: applicable scope. Define which building, which space, which time period, which purpose, which system and which method apply under current operating conditions. Number three: ACA computational reliance. Admissible Computation Architecture combines admissible data, scope and context, method and uncertainty, and current conditions to define what intelligence may legitimately rely upon. This is bounded reliance, not inference authority, and it must be revalidated when conditions change. Number four: AI output is non-authority. Intelligence may analyze patterns, recommend options, model scenarios and identify risks, but it does not decide. The highlighted rule on the board is the handoff: AI output is a recommendation, not permission or a command. And the bottom rule is equally important: an admissible input does not create an admissible output.',
    takeaway:'Capability is not authority. Governed input does not guarantee correct reasoning.'
  },
  {
    n:'05',
    k:'INTELLIGENCE · NOT PERMISSION',
    title:'Let intelligence be powerful without allowing it to manufacture authority.',
    img:'/governed-air-05-intelligence-not-permission-wide-final.png',
    script:'Follow the five numbered sections on this image. Number one: AI provides insight. It analyzes the evidence and identifies patterns, issues, possible causes and options. Number two: AI proposes options. Here the board shows examples such as increasing outside air, adjusting supply-air temperature, increasing filtration or shifting an occupancy schedule. These are recommendations with expected benefits, not permissions. Number three: examine the proposed consequence. Before action, test the exact proposal for Admissible Evidence, Applicable Authority and Established Standing. In the example, the evidence is established but authority and standing are not, so the result is HOLD. Number four: authorized execution only after examination. ALLOW can proceed and bind to execution; HOLD means more evidence, authority or standing is required; DENY means not permitted under current conditions; ESCALATE requires higher authority or broader examination. Number five: execute and verify. Only when authorized do we implement the change, return to physical reality, verify the actual outcome, update the record and revalidate if conditions materially change. The bottom line is the separation: intelligence informs, authority allows, execution proves.',
    takeaway:'An admissible input does not create an admissible output.'
  },
  {
    n:'06',
    k:'AEA · AUTHORIZED EXECUTION ONLY',
    title:'A recommendation becomes execution only after the exact consequence is admitted for this NOW.',
    img:'/governed-air-06-aea-authorized-execution-only-wide-final.png',
    script:'Follow the five numbered sections on the image. Number one: intelligence recommends. The AI analyzes the governed record and proposes a specific consequence; on this board, increase outside air to thirty percent for the next two hours. Number two: examine AEA. Test that exact proposed consequence for Admissible Evidence, Applicable Authority and Established Standing at this location and under current conditions. Number three: authority boundary. Even after the consequence is admitted, execution authority must be established locally through the applicable owner, enterprise, facility and equipment or BAS boundary. Authority context may travel, but execution authority must be established locally. Number four: authorized execution. Only after AEA is satisfied and local execution authority is established does the command reach the BAS, change the outdoor-air setting, get logged and update the record. Number five: new reality. The building responds, the atmospheric conditions change, and those results are measured for continuity and future use. The rule on the board is the controlling point: understanding is not permission. No admissible evidence, no admissible execution.',
    takeaway:'Understanding is not permission. Execution authority must be established locally.'
  },
  {
    n:'07',
    k:'COMMIT · EXECUTION · OUTCOME',
    title:'Execution changes reality. The outcome must be observed rather than assumed.',
    img:'/governed-air-07-commit-execution-outcome-wide-final.png',
    script:'Follow the five numbered sections on this board. Number one: real-world execution. The authorized action is performed in the actual building and environment; execution is where reality can change. Number two: observe the change. Measure and document the real outcome after execution. The board shows actual trends for temperature, carbon dioxide and particles rather than assuming success from a command. Number three: record as evidence. Preserve the outcome with data records, work records, context, method, uncertainty and traceable provenance so the result becomes an admissible outcome record. Number four: maintain continuity. Keep that record controlled, versioned, time-stamped, linked to authority and scope, and available for future examination. Number five: use the outcome. The recorded result can verify performance, support later recommendations, enable future decisions, satisfy later AEA examination and preserve continuity over time. The lesson is simple: a command sent is not an outcome established. A real outcome is observed, recorded and maintained as admissible evidence.',
    takeaway:'Command sent does not equal outcome established.'
  },
  {
    n:'08',
    k:'CONTINUITY · THE NEXT REALITY',
    title:'A governed outcome becomes the next reality, and the cycle begins again.',
    img:'/governed-air-08-complete-governed-air-loop-wide-final.png',
    script:'Follow the five numbered sections on the final board. Number one: governed outcome. The real-world change is observed and recorded as admissible evidence. Number two: update the record. Store the outcome together with data records, work records, context, method, uncertainty and traceable provenance so it is linked to what came before and what comes next. Number three: maintain continuity. Keep the record controlled, versioned, time-stamped, linked to authority and scope, available for future examination and connected to the chain of reality. Number four: new reality becomes input. The verified outcome now establishes the next governed starting point, supporting better indoor air, healthier occupants, reduced risk, more efficient operation, resilience and defensible evidence for future consequences. Number five: continuous cycle. Current reality becomes record, continuity is preserved, and the next reality enters another governed cycle. Continuity does not create permanent permission. Material conditions, authority or standing can change. Every new consequence gets its own NOW.',
    takeaway:'Every new consequence gets its own NOW.'
  }
];

function ReadAlong({text}:{text:string}){
  const [speaking,setSpeaking]=useState(false);
  const [paused,setPaused]=useState(false);
  const [active,setActive]=useState(-1);
  const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);
  const [voiceName,setVoiceName]=useState('Samantha');
  const [rate,setRate]=useState(.78);
  const [pitch,setPitch]=useState(.95);
  const words=[...text.matchAll(/\S+/g)].map(m=>({word:m[0],start:m.index||0}));

  useEffect(()=>{
    if(!('speechSynthesis' in window)) return;
    const load=()=>{
      const available=window.speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith('en'));
      setVoices(available);
      setVoiceName(
        available.some(v=>v.name==='Samantha')
          ? 'Samantha'
          : available.find(v=>v.lang==='en-US')?.name||available[0]?.name||''
      );
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged',load);
    return()=>{
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener('voiceschanged',load);
    };
  },[]);

  const stop=()=>{
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setPaused(false);
    setActive(-1);
  };

  const start=()=>{
    stop();
    const u=new SpeechSynthesisUtterance(text);
    const voice=voices.find(v=>v.name===voiceName);
    if(voice) u.voice=voice;
    u.rate=rate;
    u.pitch=pitch;
    u.onboundary=e=>{
      if(e.name!=='word') return;
      let x=0;
      for(let i=0;i<words.length;i++){
        if(words[i].start<=e.charIndex) x=i;
        else break;
      }
      setActive(x);
    };
    u.onend=()=>stop();
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const toggle=()=>{
    if(!speaking) return start();
    if(paused){
      window.speechSynthesis.resume();
      setPaused(false);
    }else{
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  return <div className="reader">
    <div className="readerTop">
      <div>
        <small>SAMANTHA · GUIDED WALKTHROUGH</small>
        <b>Listen while the full board stays visible.</b>
      </div>
      <div className="readerButtons">
        <button onClick={toggle}>{!speaking?'▶ PLAY':paused?'▶ RESUME':'Ⅱ PAUSE'}</button>
        <button onClick={start}>↻ RESTART</button>
        {speaking&&<button onClick={stop}>■ STOP</button>}
      </div>
    </div>
    <div className="controls">
      <label>VOICE
        <select value={voiceName} onChange={e=>{stop();setVoiceName(e.target.value)}}>
          {voices.map(v=><option key={v.name}>{v.name}</option>)}
        </select>
      </label>
      <label>SPEED · {rate.toFixed(2)}×
        <input type="range" min=".65" max="1.1" step=".05" value={rate} onChange={e=>{stop();setRate(+e.target.value)}}/>
      </label>
      <label>PITCH · {pitch.toFixed(2)}
        <input type="range" min=".75" max="1.2" step=".05" value={pitch} onChange={e=>{stop();setPitch(+e.target.value)}}/>
      </label>
    </div>
    <p className="readText">{words.map((w,i)=><span key={i} className={active===i?'active':''}>{w.word} </span>)}</p>
  </div>;
}

function ClassifyLab(){
  const [answer,setAnswer]=useState('');
  const ok=answer==='observation';
  return <div className="lab">
    <small>INTERACTIVE · SEPARATE THE LAYERS</small>
    <h3>A sensor reports CO₂ at 1,250 ppm. What has actually been established?</h3>
    <div className="choices">
      {['observation','diagnosis','optimization','authorization'].map(x=><button key={x} onClick={()=>setAnswer(x)}>{x.toUpperCase()}</button>)}
    </div>
    {answer&&<p className={ok?'feedback good':'feedback'}>{ok?'CORRECT · The sensor has established an observation. The other layers require additional evidence or authority.':'NOT YET · That adds interpretation, recommendation or permission beyond the observation itself.'}</p>}
  </div>;
}

function GateLab({kind}:{kind:'ACA'|'AEA'}){
  const [e,setE]=useState(true);
  const [a,setA]=useState(true);
  const [s,setS]=useState(false);
  const result=e&&a&&s?'ALLOW':'HOLD';
  const prompt=kind==='ACA'
    ? 'May this bounded atmospheric evidence package be released to this intelligence for this purpose NOW?'
    : 'May this exact proposed building consequence become reality NOW?';
  return <div className="lab">
    <small>INTERACTIVE · {kind==='ACA'?'GOVERNED RELIANCE':'GOVERNED CONSEQUENCE'}</small>
    <h3>{prompt}</h3>
    <div className="toggles">
      {[
        ['ADMISSIBLE EVIDENCE',e,setE],
        ['APPLICABLE AUTHORITY',a,setA],
        ['ESTABLISHED STANDING',s,setS]
      ].map(([t,on,set]:any)=><button key={t} className={on?'on':'off'} onClick={()=>set(!on)}>
        <b>{t}</b><span>{on?'ESTABLISHED':'NOT ESTABLISHED'}</span>
      </button>)}
    </div>
    <div className={'result '+result.toLowerCase()}>
      <span>CURRENT TEACHING DISPOSITION</span>
      <b>{result}</b>
      <p>{result==='ALLOW'
        ? 'All three represented conditions are established for this simplified teaching check.'
        : 'At least one required condition remains unestablished. The proposed consequence stays outside the boundary.'}</p>
    </div>
    <p className="note">Teaching scope: this simplified control demonstrates an ALLOW/HOLD threshold. DENY and ESCALATE require additional governing conditions not represented here.</p>
  </div>;
}

function RevalidationLab(){
  const [changed,setChanged]=useState(false);
  return <div className="lab revalidation">
    <small>INTERACTIVE · T0 → T1 REVALIDATION</small>
    <h3>What happens when material reality changes after an earlier ALLOW?</h3>
    <div className="timeGrid">
      <div><b>T0 · EARLIER STATE</b><span>Evidence valid</span><span>Authority established</span><span>Standing established</span><strong>ALLOW</strong></div>
      <button onClick={()=>setChanged(!changed)}>{changed?'↻ RESTORE T0':'CHANGE A MATERIAL CONDITION →'}</button>
      <div className={changed?'changed':''}><b>T1 · CURRENT STATE</b>{changed?<><span>Equipment placed in manual</span><span>Operating state changed</span><span>Prior determination no longer assumed current</span><strong>RE-EXAMINE NOW</strong></>:<><span>No material change represented</span><span>Current state still matches T0</span><span>Prior evidence remains the teaching baseline</span><strong>CURRENT</strong></>}</div>
    </div>
  </div>;
}

export default function GovernedAir(){
  const [open,setOpen]=useState<number|null>(null);

  return <main>
    <nav>
      <Link href="/global-institutional-engagement">← GLOBAL INSTITUTIONAL ENGAGEMENT</Link>
      <span>GOVERNED AIR · PUBLIC TEACHING SHOWROOM</span>
    </nav>

    <header>
      <p className="eye">GOVERNED AIR · PUBLIC TEACHING SHOWROOM</p>
      <h1>FROM CONTINUOUS MONITORING<br/><em>TO GOVERNED AIR.</em></h1>
      <p className="heroLead">Your building may already know more about its atmosphere than ever before. Sensors, BAS platforms, analytics and AI can observe, compare, diagnose, predict and optimize. <b>Governed Air adds the boundaries that determine what preserved atmospheric evidence may legitimately support before a real-world consequence occurs — and then verifies what actually happened.</b></p>
      <div className="heroRule">
        <span>CONTINUOUS MONITORING GIVES US VISIBILITY.</span>
        <b>GOVERNED AIR ADDS EVIDENTIARY CONTINUITY, BOUNDED RELIANCE, CONSEQUENCE GOVERNANCE, AND PROOF OF OUTCOME.</b>
      </div>
      <div className="boundary">PUBLIC TEACHING FRAMEWORK · NOT LEGAL ADVICE · NOT A CLAIM OF GOVERNMENTAL ADOPTION · NATIVE AUTHORITY REMAINS WITH THE APPLICABLE OWNER, INSTITUTION, REGULATOR, GOVERNMENT, LAW, POLICY, PROCEDURE OR OTHER AUTHORIZED SOURCE</div>
      <a className="pdfCta" href="/TA14_Technical_Orientation_v4.pdf" download>↓ DOWNLOAD TA14 TECHNICAL ORIENTATION V4</a>
    </header>

    <section className="value">
      <p className="eye">WHY GOVERNED AIR?</p>
      <h2>Monitoring can tell you what happened.<br/><em>Governance can tell you what that evidence may legitimately support.</em></h2>
      <div className="valueGrid">
        {[
          ['PROTECT THE RECORD','Preserve source, time, place, context, chronology and provenance so atmospheric observations remain examinable.'],
          ['CLARIFY RESPONSIBILITY','Separate observation, inference, recommendation, authorization, execution and outcome.'],
          ['BOUND AI RELIANCE','Define what intelligence may legitimately rely upon, for what purpose and under what current conditions.'],
          ['BOUND REAL-WORLD CONSEQUENCE','Require consequence-specific examination before a recommendation becomes action.'],
          ['VERIFY WHAT ACTUALLY HAPPENED','Return to physical reality after execution. Commanded state is not verified outcome.'],
          ['USE WHAT YOU ALREADY HAVE','Begin with sensors, BAS, analytics and monitoring infrastructure already in the building.']
        ].map(([t,p])=><article key={t}><b>{t}</b><p>{p}</p></article>)}
      </div>
    </section>

    <section className="comparison">
      <p className="eye">THE SIMPLE DISTINCTION</p>
      <h2>MONITORED AIR <em>≠</em> GOVERNED AIR</h2>
      <div className="compareGrid">
        <article>
          <small>MONITORED AIR</small>
          <h3>OBSERVES CONDITIONS.</h3>
          <ul>
            <li>Produces readings, trends, alarms and visibility.</li>
            <li>Can support diagnosis, optimization and operations.</li>
            <li>May be continuous and highly sophisticated.</li>
            <li>Does not by itself preserve an admissible record.</li>
            <li>Does not by itself establish legitimate computational reliance.</li>
            <li>Does not by itself establish permission for a consequence.</li>
            <li>Does not by itself prove physical outcome.</li>
          </ul>
        </article>
        <div className="neq">≠</div>
        <article className="governed">
          <small>GOVERNED AIR</small>
          <h3>GOVERNS RELIANCE + CONSEQUENCE.</h3>
          <ul>
            <li>Preserves Atmospheric Integrity Records (AIR).</li>
            <li>Controls what intelligence may legitimately rely upon.</li>
            <li>Keeps AI output distinct from authority.</li>
            <li>Examines proposed consequence for evidence, authority and standing.</li>
            <li>Binds authorized consequence to execution.</li>
            <li>Returns to reality and verifies outcome.</li>
            <li>Revalidates when material conditions change.</li>
          </ul>
        </article>
      </div>
    </section>

    <section className="method">
      <p className="eye">THE GOVERNED AIR METHOD</p>
      <div className="methodGrid">
        {['OBSERVE','PRESERVE AIR','GOVERN RELEASE','ACA','INTELLIGENCE','AEA','EXECUTE + VERIFY','NEW REALITY'].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b></div>)}
      </div>
      <p><b>Atmospheric Integrity Records (AIR)</b> protect the atmospheric record. <b>ACA</b> governs computational reliance. <b>AEA</b> governs proposed consequence. Execution returns to observable reality. Every new consequence gets its own NOW.</p>
    </section>

    {visuals.map((v,i)=><section className="visual" key={v.n}>
      <div className="visualHead">
        <span>{v.n}</span>
        <div><p className="eye">{v.k}</p><h2>{v.title}</h2></div>
      </div>
      <img src={v.img} alt={v.title}/>
      <div className="takeaway"><small>TAKEAWAY</small><b>{v.takeaway}</b></div>
      <div className="explain">
        <button onClick={()=>{
          if('speechSynthesis' in window) window.speechSynthesis.cancel();
          setOpen(open===i?null:i);
        }}>{open===i?'CLOSE WALKTHROUGH':'▶ EXPLAIN THIS VISUAL'}</button>
        <span>SAMANTHA · SYNCHRONIZED READ-ALONG</span>
      </div>
      {open===i&&<ReadAlong text={v.script}/>}
      {i===1&&<ClassifyLab/>}
      {i===2&&<GateLab kind="ACA"/>}
      {i===5&&<GateLab kind="AEA"/>}
      {i===7&&<RevalidationLab/>}
    </section>)}

    <section className="question">
      <p className="eye">THE GOVERNING QUESTION</p>
      <h2>Does this proposed consequence have sufficient <em>Admissible Evidence, Applicable Authority, and Established Standing</em> to become reality NOW?</h2>
      <div className="dispositions">{['ALLOW','HOLD','DENY','ESCALATE'].map(x=><b key={x}>{x}</b>)}</div>
      <p>If evidence was valid at T0, but a material condition changes before action at T1, the earlier determination must not simply be assumed current. Re-establish the evidence, authority and standing for the consequence that is proposed now.</p>
    </section>

    <section className="close">
      <p className="eye">THE COMPLETE IDEA</p>
      <h2>Govern the record.<br/>Govern what intelligence may rely upon.<br/>Govern what intelligence may cause.<br/><em>Then return to reality and prove what actually happened.</em></h2>
      <p>Governed Air is a consequence-governance method for preserved atmospheric evidence, computational reliance, proposed action, execution and outcome. It is not a sensor platform, BAS, AI model, engineering replacement, automatic-control scheme, regulatory regime, or substitute for native legal or institutional authority.</p>
      <p className="provenance">Developed through Atmospheric Integrity Records (AIR) and TA14 consequence-governance architectures. TA14 Authority Governance Institution provides the architecture and teaching framework; native authority remains native.</p>
      <a className="pdfCta" href="/TA14_Technical_Orientation_v4.pdf" download>↓ DOWNLOAD TA14 TECHNICAL ORIENTATION V4</a>
    </section>

    <footer>
      <b>TA14 AUTHORITY GOVERNANCE INSTITUTION · GOVERNED AIR</b>
      <span>No placement, example, interaction or technical demonstration on this page establishes governmental endorsement, adoption, certification, legal sufficiency, regulatory approval or execution authority.</span>
    </footer>

    <style jsx>{`
      :global(*){box-sizing:border-box}
      :global(html){scroll-behavior:smooth}
      :global(body){margin:0;background:#02070b;color:#effbff;font-family:Arial,Helvetica,sans-serif}
      main{max-width:1680px;margin:auto;padding:0 24px;background:radial-gradient(circle at 50% 0,rgba(13,102,144,.16),transparent 28%)}
      nav{display:flex;justify-content:space-between;gap:20px;padding:18px 0;border-bottom:1px solid #173945;font-size:11px;letter-spacing:.12em;position:sticky;top:0;background:rgba(2,7,11,.92);backdrop-filter:blur(10px);z-index:10}
      nav a{color:#72dcff;text-decoration:none}
      header,section{padding:72px 0;border-bottom:1px solid #15343e}
      .eye,small{color:#72dcff;font-size:10px;font-weight:900;letter-spacing:.17em}
      h1{font-size:clamp(50px,7.5vw,112px);line-height:.88;margin:22px 0;letter-spacing:-.05em}
      h1 em,h2 em{font-style:normal;color:#efc968}
      h2{font-size:clamp(32px,4.7vw,68px);line-height:1.02;margin:14px 0 28px;letter-spacing:-.025em}
      .heroLead{max-width:1180px;font-size:clamp(19px,2vw,27px);line-height:1.65;color:#b8ccd2}
      .heroLead b{color:#effbff}
      .heroRule{display:grid;grid-template-columns:1fr 2fr;gap:1px;margin-top:30px;border:1px solid #315966;background:#315966}
      .heroRule>*{background:#06151b;padding:18px}
      .heroRule span{color:#72dcff;font-size:11px;font-weight:900;letter-spacing:.08em}
      .heroRule b{color:#efc968;font-size:13px;line-height:1.5}
      .boundary{margin-top:18px;border:1px solid #806d38;color:#efc968;padding:15px;font-size:10px;font-weight:900;letter-spacing:.08em;line-height:1.5}
      .pdfCta{display:inline-block;margin-top:22px;padding:16px 22px;border:1px solid #72dcff;background:#08252f;color:#effbff;text-decoration:none;font-size:11px;font-weight:900;letter-spacing:.1em}
      .valueGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
      .valueGrid article,.compareGrid article{border:1px solid #2a5360;background:#06161c;padding:24px}
      .valueGrid b{color:#efc968;font-size:11px;letter-spacing:.1em}
      .valueGrid p,.method p,.question p,.close p{color:#aec3ca;line-height:1.7}
      .comparison{background:#031017}
      .compareGrid{display:grid;grid-template-columns:1fr 90px 1fr;align-items:stretch;gap:0}
      .compareGrid article{border-color:#2a6175}
      .compareGrid .governed{border-color:#806d38}
      .compareGrid h3{font-size:clamp(26px,3vw,44px);margin:14px 0 20px}
      .compareGrid ul{margin:0;padding-left:20px;color:#b8ccd2;line-height:1.9}
      .neq{display:flex;align-items:center;justify-content:center;font-size:56px;color:#efc968}
      .methodGrid{display:grid;grid-template-columns:repeat(8,1fr);gap:8px;margin:24px 0}
      .methodGrid div{border:1px solid #315966;padding:15px 10px;min-height:90px;background:#06151b}
      .methodGrid span{display:block;color:#72dcff;font-size:10px;margin-bottom:10px}
      .methodGrid b{font-size:10px}
      .visual{scroll-margin-top:64px}
      .visualHead{display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:start}
      .visualHead>span{display:flex;align-items:center;justify-content:center;width:66px;height:66px;border:2px solid #72dcff;border-radius:50%;font-size:24px;font-weight:900;color:#72dcff;box-shadow:0 0 28px rgba(114,220,255,.35)}
      .visualHead h2{max-width:1250px;margin-top:8px}
      .visual img{display:block;width:100%;height:auto;border:1px solid #315966;box-shadow:0 24px 75px #000;border-radius:4px}
      .takeaway{display:flex;align-items:center;gap:18px;margin-top:14px;padding:16px 18px;background:#06151b;border-left:3px solid #efc968}
      .takeaway small{color:#efc968}
      .takeaway b{font-size:14px;line-height:1.5}
      .explain{display:flex;gap:15px;align-items:center;flex-wrap:wrap;margin-top:16px}
      .explain button,.reader button{background:#08252f;border:1px solid #72dcff;color:#effbff;padding:13px 18px;font-weight:900;cursor:pointer}
      .explain span{color:#7899a3;font-size:10px;letter-spacing:.12em}
      .reader,.lab{margin-top:16px;border:1px solid #2c5663;background:#04141b;padding:24px}
      .readerTop{display:flex;justify-content:space-between;gap:15px;align-items:center}
      .readerTop>div:first-child{display:flex;flex-direction:column;gap:6px}
      .readerButtons{display:flex;gap:7px;flex-wrap:wrap}
      .controls{display:grid;grid-template-columns:2fr 1fr 1fr;gap:12px;margin:18px 0;padding:14px;border:1px solid #1f4652}
      .controls label{display:flex;flex-direction:column;gap:8px;color:#72dcff;font-size:10px;font-weight:900}
      .controls select{background:#02090d;color:white;border:1px solid #315966;padding:9px}
      .readText{font-size:clamp(17px,1.8vw,23px);line-height:1.9;color:#bfd0d5}
      .readText .active{background:#efc968;color:#061015;padding:3px 4px;border-radius:3px;font-weight:900}
      .lab h3{font-size:clamp(24px,3vw,40px);margin:10px 0 20px}
      .choices,.toggles{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
      .toggles{grid-template-columns:repeat(3,1fr)}
      .choices button,.toggles button{min-height:105px;background:#071b22;color:white;border:1px solid #355e68;padding:16px;cursor:pointer}
      .toggles button b,.toggles button span{display:block}
      .toggles button span{margin-top:10px;font-size:10px;letter-spacing:.1em}
      .toggles .on{border-color:#72e6b2}.toggles .on span{color:#72e6b2}
      .toggles .off{border-color:#9b7447}.toggles .off span{color:#efc968}
      .feedback,.note{color:#a9c0c7;line-height:1.6}
      .feedback{padding:14px;border-left:3px solid #efc968}
      .feedback.good{border-color:#72e6b2;color:#bdf8d9}
      .result{margin-top:12px;padding:22px;border:1px solid #806d38}
      .result span{font-size:9px;letter-spacing:.12em}
      .result>b{display:block;font-size:clamp(42px,6vw,76px);color:#efc968}
      .timeGrid{display:grid;grid-template-columns:1fr auto 1fr;gap:14px;align-items:stretch}
      .timeGrid>div{border:1px solid #315966;padding:20px;display:flex;flex-direction:column;gap:10px}
      .timeGrid>div b{color:#72dcff}.timeGrid>div strong{color:#72e6b2;font-size:28px;margin-top:auto}
      .timeGrid>div.changed{border-color:#efc968}.timeGrid>div.changed strong{color:#efc968}
      .timeGrid>button{align-self:center;background:#08252f;border:1px solid #72dcff;color:white;padding:14px;font-weight:900;cursor:pointer}
      .question{background:#06151b;border:1px solid #806d38!important;padding-left:30px;padding-right:30px}
      .question h2{max-width:1350px}
      .dispositions{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
      .dispositions b{text-align:center;border:1px solid #315966;padding:17px;color:#efc968}
      .close{text-align:center}
      .close h2,.close p{max-width:1100px;margin-left:auto;margin-right:auto}
      .provenance{font-size:13px}
      footer{display:flex;justify-content:space-between;gap:30px;padding:34px 0;color:#809ba4;font-size:11px}
      footer span{max-width:900px}
      @media(max-width:1000px){
        .valueGrid{grid-template-columns:repeat(2,1fr)}
        .methodGrid{grid-template-columns:repeat(4,1fr)}
        .heroRule{grid-template-columns:1fr}
      }
      @media(max-width:720px){
        main{padding:0 14px}
        nav,footer,.readerTop{flex-direction:column;align-items:flex-start}
        .valueGrid,.compareGrid,.controls,.choices,.toggles,.timeGrid,.dispositions{grid-template-columns:1fr}
        .neq{min-height:80px}
        .methodGrid{grid-template-columns:repeat(2,1fr)}
        .visualHead{grid-template-columns:1fr}
      }
    `}</style>
  </main>;
}
