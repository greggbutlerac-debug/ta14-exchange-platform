'use client';

import { useMemo, useState } from 'react';

type EvidenceKey = 'identity' | 'calibration' | 'timestamps' | 'attribution' | 'freshness' | 'corrections';
const evidenceLabels: Record<EvidenceKey,string> = {
  identity:'Sensor identity and source', calibration:'Calibration / fitness for purpose',
  timestamps:'Timestamp continuity', attribution:'Actor and record attribution',
  freshness:'Current-condition freshness', corrections:'Correction history preserved'
};
const evidenceKeys = Object.keys(evidenceLabels) as EvidenceKey[];

const challenges = [
  {
    title:'An uncalibrated environmental probe',
    scenario:'A probe reports elevated particles, but its calibration and fitness-for-purpose evidence is missing. A controller recommends a ventilation change.',
    choices:['ALLOW','HOLD','DENY','ESCALATE'],
    answer:'HOLD',
    why:'The admissibility basis is insufficient. Preserve the reading and seek the missing calibration evidence; do not release the command on this record.'
  },
  {
    title:'A command outside the authorized scope',
    scenario:'The evidence is current and the actor is identifiable, but the applicable authority does not permit the proposed remote operational change.',
    choices:['ALLOW','HOLD','DENY','ESCALATE'],
    answer:'DENY',
    why:'The consequence is outside applicable authority. Better measurements cannot create permission that does not exist.'
  },
  {
    title:'An unresolved higher-authority condition',
    scenario:'A safety exception requires review by a separately designated authority before anyone may commit the proposed action.',
    choices:['ALLOW','HOLD','DENY','ESCALATE'],
    answer:'ESCALATE',
    why:'The defined escalation condition routes the matter to the appropriate authority. It is not an implicit approval.'
  }
] as const;

export default function IndependentExamination(){
  const [evidence,setEvidence]=useState<Record<EvidenceKey,boolean>>({
    identity:true,calibration:true,timestamps:true,attribution:true,freshness:true,corrections:true
  });
  const [outside,setOutside]=useState(false);
  const [actorStanding,setActorStanding]=useState(false);
  const [changed,setChanged]=useState(true);
  const [reexamined,setReexamined]=useState(false);
  const [escalation,setEscalation]=useState(false);
  const [answers,setAnswers]=useState<Record<number,string>>({});
  const [revealed,setRevealed]=useState(false);
  const failed=evidenceKeys.filter(k=>!evidence[k]);
  const decision=escalation?'ESCALATE':failed.length?'HOLD':outside?'DENY':!actorStanding?'HOLD':changed&&!reexamined?'HOLD':'ALLOW';
  const explanation=escalation?'A separately designated authority must resolve the flagged condition.':
    failed.length?'Evidence continuity or admissibility is unsupported: '+failed.map(k=>evidenceLabels[k]).join(', ')+'.':
    outside?'The proposed action falls outside the selected applicable authority.':
    !actorStanding?'The actor’s standing to invoke that authority has not been established.':
    changed&&!reexamined?'Changed environmental conditions require a fresh evidence and binding examination.':
    'All selected illustrative gates are satisfied for this bounded example. No real-world permission is issued.';
  const receipt=useMemo(()=>[
    'TA-14 | ILLUSTRATIVE EXAMINATION RECEIPT',
    'EDUCATIONAL SIMULATION — NOT AN ADMISSIBLE FIELD RECORD OR AUTHORIZATION',
    'Scenario: Classroom 214 — proposed outdoor-air ventilation increase',
    'Source: User-selected teaching controls; no actual sensor, actor, or authority verification',
    'Evidence gates: '+evidenceKeys.map(k=>evidenceLabels[k]+': '+(evidence[k]?'selected sufficient':'selected missing')).join('; '),
    'Applicable authority: '+(outside?'selected absent/out of scope':'selected present'),
    'Actor standing: '+(actorStanding?'selected established':'selected not established'),
    'Changed outdoor PM2.5 condition: '+(changed?'yes':'no'),
    'Fresh examination of changed conditions: '+(reexamined?'selected complete':'not selected'),
    'Escalation condition: '+(escalation?'selected required':'none selected'),
    'ILLUSTRATIVE DETERMINATION: '+decision,
    'RATIONALE: '+explanation,
    'Reconsideration: Resolve missing evidence, verify applicable authority and actor standing, re-evaluate changed conditions and binding constraints, and make a new bounded determination.',
    'This receipt is generated solely from hypothetical inputs. It has no evidentiary or execution authority.'
  ].join('\n'),[evidence,outside,actorStanding,changed,reexamined,escalation,decision,explanation]);
  const download=()=>{
    const blob=new Blob([receipt],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='TA14-Illustrative-Examination-Receipt.txt';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  };
  const score=challenges.reduce((sum,c,i)=>sum+(answers[i]===c.answer?1:0),0);
  return <section id="independent-examination" className="ie" aria-labelledby="ie-title">
    <style>{`
      .ie{border-top:1px solid #2a5263;padding:68px 0 75px;color:#eaf4f8}.ie *{box-sizing:border-box}.ie-label{font-size:11px;font-weight:900;letter-spacing:.17em;color:#8be2ef}.ie h2{font-size:clamp(28px,4vw,46px);letter-spacing:-.03em;margin:13px 0}.ie-lead{color:#b7cbd4;font-size:16px;line-height:1.75;max-width:880px}.ie-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:28px 0}.ie-card{background:#092331;border:1px solid #356174;border-radius:17px;padding:24px}.ie-card h3{font-size:23px;margin:4px 0 14px}.ie-card p{line-height:1.65;color:#bfd1db}.ie-kicker{color:#f1cb72;font-size:11px;letter-spacing:.13em;font-weight:900}.ie-compare{display:grid;grid-template-columns:1fr 1fr;gap:10px}.ie-phase{background:#061822;border:1px solid #2e5666;border-radius:12px;padding:17px}.ie-phase b{display:block;color:#f0cc76;margin-bottom:9px}.ie-phase span{display:block;color:#bcd0d9;font-size:13px;line-height:1.8}.ie-evidence{display:grid;gap:9px}.ie-evidence label,.ie-check{display:flex;align-items:start;gap:11px;border:1px solid #2b4c5e;padding:13px;border-radius:10px;color:#d7e8ee;line-height:1.5;cursor:pointer}.ie input{accent-color:#e9c56b;width:17px;height:17px;flex-shrink:0;margin-top:2px}.ie-controls{display:grid;gap:10px;margin:16px 0}.ie-state{border:1px solid #a88b54;background:#201e19;padding:18px;border-radius:13px;margin-top:15px}.ie-state strong{font:800 clamp(36px,5vw,58px)/1 Georgia,serif;color:#f0c56a}.ie-state strong.deny{color:#ff8d91}.ie-state strong.allow{color:#80e4b6}.ie-state strong.escalate{color:#c9b4ff}.ie-state p{margin-bottom:0}.ie-btn{border:1px solid #eac977;background:#eac977;color:#061722;padding:13px 16px;border-radius:9px;font-weight:900;font-size:12px;cursor:pointer}.ie-btn.secondary{background:transparent;color:#eaf5fa;border-color:#6d9eb1}.ie-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}.ie-challenge{margin-top:36px}.ie-question{padding:20px;border:1px solid #31596c;border-radius:13px;background:#071d29;margin-top:13px}.ie-question h4{font-size:19px;margin:5px 0}.ie-question p{color:#c3d4dc;line-height:1.65}.ie-options{display:flex;gap:8px;flex-wrap:wrap}.ie-options button{background:#112e3d;border:1px solid #4e7385;color:#e4f4f9;padding:10px 15px;border-radius:8px;font-weight:850;cursor:pointer}.ie-options button[aria-pressed=true]{background:#eac977;color:#061722;border-color:#eac977}.ie-answer{margin-top:13px;padding:14px;border-left:3px solid #eac977;background:#122e38;color:#d5e5ed;line-height:1.65}.ie-disclaimer{font-size:12px;color:#9eb6c2;line-height:1.7;margin-top:18px}@media(max-width:820px){.ie-grid,.ie-compare{grid-template-columns:1fr}.ie-card{padding:17px}}
    `}</style>
    <span className="ie-label">ADVANCED LEARNING LAB · INDEPENDENT EXAMINATION</span>
    <h2 id="ie-title">Examine the evidence. Challenge the consequence.</h2>
    <p className="ie-lead">This second-stage teaching lab uses deliberately hypothetical data. Change the evidence and governance findings, compare earlier and current environmental conditions, then produce an illustrative decision receipt. No selections verify real sensors, credentials, legal authority, or standing.</p>
    <div className="ie-grid">
      <article className="ie-card">
        <span className="ie-kicker">01 · WHAT CHANGED?</span><h3>One recommendation. Two environments.</h3>
        <div className="ie-compare">
          <div className="ie-phase"><b>EARLIER · PROPOSAL</b><span>Classroom CO₂: 1,420 ppm</span><span>Outdoor PM₂.₅: 12 µg/m³</span><span>Proposal: increase outdoor air</span></div>
          <div className="ie-phase"><b>CURRENT · BEFORE COMMIT</b><span>Classroom CO₂: 1,420 ppm</span><span>Outdoor PM₂.₅: 38 µg/m³</span><span>Question: is the proposal still justified?</span></div>
        </div>
        <p>Increasing outdoor air could reduce CO₂ yet introduce more outdoor particles, depending on filtration and design. A changed environmental condition calls for renewed evidence and binding examination; it does <b>not</b> automatically remove actor standing.</p>
        <label className="ie-check"><input type="checkbox" checked={changed} onChange={e=>setChanged(e.target.checked)}/>Outdoor particulate conditions have materially changed</label>
        <label className="ie-check" style={{marginTop:9}}><input type="checkbox" checked={reexamined} onChange={e=>setReexamined(e.target.checked)}/>A fresh examination of changed conditions and binding constraints is selected complete</label>
      </article>
      <article className="ie-card">
        <span className="ie-kicker">02 · EVIDENCE CONTINUITY</span><h3>Can the record support this action?</h3>
        <p>Uncheck any required evidence element to see the consequence held. Each item is a simulated finding, not a verified field record.</p>
        <div className="ie-evidence">{evidenceKeys.map(key=><label key={key}><input type="checkbox" checked={evidence[key]} onChange={e=>setEvidence(x=>({...x,[key]:e.target.checked}))}/><span>{evidenceLabels[key]}</span></label>)}</div>
        <p className="ie-disclaimer">Correction history must remain visible. A sensor number without attribution, time continuity, and fitness for purpose is not automatically Admissible Evidence.</p>
      </article>
      <article className="ie-card">
        <span className="ie-kicker">03 · AUTHORITY AND STANDING</span><h3>Who can invoke the authority?</h3>
        <div className="ie-controls">
          <label className="ie-check"><input type="checkbox" checked={!outside} onChange={e=>setOutside(!e.target.checked)}/>Applicable authority permits this specific consequence</label>
          <label className="ie-check"><input type="checkbox" checked={actorStanding} onChange={e=>setActorStanding(e.target.checked)}/>Actor, declared capacity, standing basis, and authority relationship are selected established</label>
          <label className="ie-check"><input type="checkbox" checked={escalation} onChange={e=>setEscalation(e.target.checked)}/>A separately designated authority must resolve an escalation condition</label>
        </div>
        <p>Applicable Authority ≠ Established Standing. Neither a recommendation nor a prior approval creates permanent permission.</p>
      </article>
      <article className="ie-card">
        <span className="ie-kicker">04 · ILLUSTRATIVE DETERMINATION</span><h3>Preserve the reason, not just the label.</h3>
        <div className="ie-state" aria-live="polite"><strong className={decision.toLowerCase()}>{decision}</strong><p>{explanation}</p></div>
        <p>Every generated receipt records the selected findings and why the teaching logic reached its result. It is not an institutional determination or an Admissible Evidence artifact.</p>
        <div className="ie-actions"><button className="ie-btn" type="button" onClick={download}>↓ DOWNLOAD ILLUSTRATIVE RECEIPT</button><button className="ie-btn secondary" type="button" onClick={()=>navigator.clipboard?.writeText(receipt)}>COPY RECEIPT</button></div>
      </article>
    </div>
    <div className="ie-challenge">
      <span className="ie-label">INDEPENDENT REVIEW CHALLENGE</span><h2>Three decisions. Can you defend each one?</h2>
      <p className="ie-lead">Choose the supported determination for each hypothetical case. Reveal the reasoning only when ready.</p>
      {challenges.map((c,i)=><article className="ie-question" key={c.title}>
        <span className="ie-kicker">CASE {String(i+1).padStart(2,'0')}</span><h4>{c.title}</h4><p>{c.scenario}</p>
        <div className="ie-options">{c.choices.map(choice=><button type="button" key={choice} aria-pressed={answers[i]===choice} onClick={()=>{setAnswers(a=>({...a,[i]:choice}));setRevealed(false)}}>{choice}</button>)}</div>
        {revealed&&<div className="ie-answer"><b>{answers[i]===c.answer?'SUPPORTED':'RE-EXAMINE'} · {c.answer}</b><div>{c.why}</div></div>}
      </article>)}
      <div className="ie-actions"><button className="ie-btn" type="button" onClick={()=>setRevealed(true)} disabled={Object.keys(answers).length!==challenges.length}>REVEAL THE EXAMINATION</button><button className="ie-btn secondary" type="button" onClick={()=>{setAnswers({});setRevealed(false)}}>RESET CHALLENGE</button></div>
      {revealed&&<p aria-live="polite"><b>Supported determinations: {score} of {challenges.length}.</b> Review the explanations, not just the score.</p>}
      <p className="ie-disclaimer">These examples simplify complex governance. Real admissibility, authority, standing, safety, and escalation determinations require the applicable evidence and institutional procedures. The teaching lab never controls equipment or authorizes execution.</p>
    </div>
  </section>;
}
