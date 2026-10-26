'use client';
import Link from 'next/link';
import { useState } from 'react';

function ChapterVisual({ index, name }: { index: number; name: string }) {
  const [missing, setMissing] = useState(false);
  const filename = `chapter-${String(index + 1).padStart(2, '0')}-${name.toLowerCase()}.png`;
  return <figure style={{ margin: '22px 0' }}>
    {missing ? <div role="status" style={{ padding: '36px 20px', border: '1px dashed #54727c', borderRadius: 12, color: '#b6d2d8', textAlign: 'center' }}>Chapter illustration awaiting asset publication</div> : <img src={`/showrooms/industry-execution-governance/${filename}`} alt={`Illustrative TA14 governance diagram: ${name}`} loading="lazy" onError={() => setMissing(true)} style={{ display: 'block', width: '100%', maxWidth: 1100, height: 'auto', borderRadius: 12, border: '1px solid #315461' }} />}
    <figcaption style={{ marginTop: 10, fontSize: 13, color: '#d8c68d' }}>Illustrative only. Synthetic engineering scenario; not evidence of deployment or validated outcomes.{index === 7 ? ' Health, attendance and engagement claims appearing within the draft illustration are not substantiated and must not be treated as findings.' : ''}</figcaption>
  </figure>;
}


const chapters = [
  {name:'Reality',question:'What is physically happening?',lesson:'A measured condition is an observation, not permission to intervene.',next:'Preserve the observations with their sources.',detail:'In our synthetic occupied-school example, CO₂, particulate matter, temperature, humidity, occupancy, and outdoor conditions are observed. No measurement alone establishes that a proposed ventilation change is safe or authorized.'},
  {name:'Record',question:'What can be demonstrated from original evidence?',lesson:'Preserve raw observations, provenance, calibration status, timestamps, and operating context.',next:'Examine continuity across the decision interval.',detail:'AIR/PAIR distinguishes observed readings from adjusted values, inferred values, and model outputs. Retain source identity and original files so another engineer can inspect the basis of the proposed action.'},
  {name:'Continuity',question:'Does the evidence remain attributable and sufficient over time?',lesson:'A missing interval cannot be silently replaced by a confident prediction.',next:'Examine whether the available evidence is admissible.',detail:'A 90-minute synthetic data gap may require HOLD while the relevant interval and limitations are examined. A gap is not automatically disqualifying for every purpose; sufficiency depends on the proposed consequence.'},
  {name:'Admissibility',question:'Is this evidence fit for this specific proposed consequence?',lesson:'A plausible model output does not establish evidentiary sufficiency or execution authority.',next:'Bind the evidence to the exact proposed action.',detail:'ACA examines the provenance, transformation, assumptions, missingness, and relevance of computations. The evidence must support this particular intervention rather than a general claim that air quality should improve.'},
  {name:'Binding',question:'Which exact consequence is under examination?',lesson:'Bind the decision to named equipment, operating limits, context, and evidence.',next:'Examine authority and standing at the commitment boundary.',detail:'The illustrative proposal concerns an identified air-handling unit and outside-air damper, with defined duration, operating limits, and conditions. Binding does not itself grant permission to execute.'},
  {name:'Commit',question:'Is this proposed consequence authorized NOW?',lesson:'Capability is not authority. Authority and standing must be established for the current conditions.',next:'Observe what physically executes, if permitted.',detail:'AEA examines admissible evidence, applicable authority, established standing, scope, and present conditions. A disposition of ALLOW is bounded permission, not proof that the command was sent or the equipment moved.'},
  {name:'Execution',question:'What did the equipment actually do?',lesson:'An issued command is not proof of physical execution.',next:'Measure the resulting environmental outcome.',detail:'Compare the command and execution receipt with independently observed actuator position, airflow, interlocks, and deviations. A failed or incomplete action must not be recorded as successful simply because software acknowledged a request.'},
  {name:'Outcome',question:'What changed, and what can be verified?',lesson:'Observed environmental change is not automatic proof of causation or improved health.',next:'Preserve findings for independent technical examination.',detail:'Compare synthetic baseline and post-action observations with timestamps, weather, occupancy, and system state. Do not claim improved attendance, healthier children, or a validated intervention without supporting evidence.'},
];
const caseOptions = [
  {label:'Missing sensor evidence across the decision interval',disposition:'HOLD',why:'The evidence required for this particular action has not been established. Request or reconstruct verifiable evidence before reconsidering.'},
  {label:'Proposed command exceeds the actor’s documented authority',disposition:'DENY',why:'A technically possible action does not become authorized merely because the equipment can perform it.'},
  {label:'Safety interlock or authority conflict needs responsible review',disposition:'ESCALATE',why:'The conflict must be resolved by the appropriate responsible authority; the demonstration does not override safety controls.'},
  {label:'Evidence, standing, authority, scope and current conditions all established',disposition:'ALLOW',why:'The bounded proposal may proceed only within its established conditions. Actual execution and outcome still require separate verification.'},
];
export default function IndustryExecutionGovernance() {
  const [selected,setSelected] = useState(0);
  return <main style={{minHeight:'100vh',background:'#071923',color:'#e9f4f5',padding:'36px clamp(20px,5vw,86px)',fontFamily:'Arial,Helvetica,sans-serif'}}>
    <nav><Link href="/showrooms" style={{color:'#80e0ec'}}>← All TA14 showrooms</Link></nav>
    <header style={{maxWidth:1100,padding:'65px 0 32px'}}>
      <p style={{color:'#7ee0c5',letterSpacing:2,fontSize:13}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · PUBLIC ENGINEERING EDUCATION</p>
      <h1 style={{fontSize:'clamp(36px,5vw,72px)',lineHeight:1.07,margin:'18px 0'}}>From Measurable Standards to Accountable Engineering Consequences</h1>
      <p style={{fontSize:23,lineHeight:1.5,color:'#b8d6df'}}>The industry can measure reality. Who establishes authority for the consequence?</p>
      <p style={{fontSize:19,lineHeight:1.6,borderLeft:'4px solid #7ee0c5',paddingLeft:20}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p>
      <p style={{color:'#e8cf92',lineHeight:1.6}}>Illustrative only. All people, readings, equipment actions, approvals, and outcomes in the teaching scenario are synthetic. No production deployment, professional-body endorsement, Raven Delta Group adoption, certification, or independently validated performance is claimed.</p>
    </header>
    <section style={{maxWidth:1050,padding:'28px 0'}}>
      <h2>Why this matters to engineering practice</h2>
      <p style={{lineHeight:1.8}}>Measurements, standards, analytics and AI can inform decisions. They do not, by themselves, demonstrate that a specific intervention is justified, authorized, executed as intended, or responsible for a claimed outcome. TA14 proposes a reviewable chain that complements—not replaces—existing professional obligations, safety controls, standards and lawful authority.</p>
      <p style={{color:'#7ee0c5'}}>AIR/PAIR (preserved atmospheric evidence) → ACA (admissible computation) → AEA (admissible execution) → execution receipt → observed outcome.</p>
    </section>
    <section aria-label="Eight engineering chapters">
      <h2>Eight linked examinations. One proposed consequence.</h2>
      {chapters.map((c,i)=><article key={c.name} id={'chapter-'+(i+1)} style={{margin:'22px 0',padding:'clamp(20px,3vw,34px)',border:'1px solid #315461',borderRadius:14,background:i%2?'#102b36':'#0b222d'}}>
        <p style={{color:'#7ee0c5',letterSpacing:1,fontSize:13}}>CHAPTER {String(i+1).padStart(2,'0')} / 08</p>
        <h3 style={{fontSize:'clamp(25px,3vw,36px)',margin:'8px 0'}}>{c.name} — {c.question}</h3>
        <ChapterVisual index={i} name={c.name} />
        <p style={{fontSize:18,lineHeight:1.7}}>{c.detail}</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:14}}>
          <div style={{background:'#173946',padding:18,borderRadius:10}}><strong>What you learned</strong><p style={{lineHeight:1.6}}>{c.lesson}</p></div>
          <div style={{background:'#173946',padding:18,borderRadius:10}}><strong>What comes next</strong><p style={{lineHeight:1.6}}>{c.next}</p></div>
        </div>
      </article>)}
    </section>
    <section style={{margin:'48px 0',padding:'clamp(22px,4vw,40px)',border:'1px solid #3d6975',borderRadius:16,background:'#12313d'}}>
      <p style={{color:'#7ee0c5'}}>INTERACTIVE · SYNTHETIC TEACHING EXERCISE</p>
      <h2>One school-ventilation proposal. Four different dispositions.</h2>
      <p style={{lineHeight:1.7}}>A platform proposes a bounded change to outside-air ventilation. Select a condition to see how the governance response changes. This exercise does not issue commands or grant real authority.</p>
      <label htmlFor="scenario-condition" style={{display:'block',marginBottom:12}}>Condition under examination</label>
      <select id="scenario-condition" value={selected} onChange={e=>setSelected(Number(e.target.value))} style={{width:'100%',padding:14,fontSize:16,background:'#eaf7f7',color:'#08212b',borderRadius:8}}>
        {caseOptions.map((o,i)=><option key={o.disposition} value={i}>{o.label}</option>)}
      </select>
      <div aria-live="polite" style={{marginTop:20,padding:22,background:'#08232d',borderRadius:10}}>
        <p style={{fontSize:30,fontWeight:700,margin:'0 0 10px',color:'#91e4d0'}}>{caseOptions[selected].disposition}</p>
        <p style={{lineHeight:1.7}}>{caseOptions[selected].why}</p>
      </div>
    </section>
    <section style={{maxWidth:1080,margin:'40px 0 65px'}}>
      <h2>Professional-body invitation: examine one bounded engineering decision</h2>
      <p style={{lineHeight:1.8}}>Select a representative procedure, preserve the relevant evidence and existing controls, examine the proposed consequence against those controls, compare findings, and report where existing practice is sufficient or where a proposed TA14 checkpoint adds value or needs revision. The deliverable is a reviewable technical findings report—not endorsement, equipment intervention, or certification.</p>
      <p><strong>Examination sequence:</strong> Select → Preserve → Examine → Compare → Report.</p>
      <p>For the seven-page companion brief, request the current PDF from <a href="mailto:ta14admissibleexecution@gmail.com?subject=TA14%20Professional%20Engineering%20Brief" style={{color:'#8be9d5'}}>ta14admissibleexecution@gmail.com</a>. A verified public PDF download will be added when the asset is published.</p>
    </section>
    <footer style={{borderTop:'1px solid #315461',paddingTop:20,color:'#abc7cf'}}>TA14 Authority Governance Institution · Educational demonstration · <Link href="/" style={{color:'#8be9d5'}}>TA14 Exchange</Link></footer>
  </main>;
}
