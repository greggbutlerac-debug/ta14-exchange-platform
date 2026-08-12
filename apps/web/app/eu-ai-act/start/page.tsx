'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Answer = 'yes' | 'no' | 'unsure' | '';
type FormState = {
  euMarket: Answer;
  provider: Answer;
  deployer: Answer;
  interacts: Answer;
  synthetic: Answer;
  employment: Answer;
  education: Answer;
  credit: Answer;
  essential: Answer;
  biometrics: Answer;
  safetyProduct: Answer;
  gpai: Answer;
  changes: Answer;
  evidence: Answer;
};

const initial: FormState = {
  euMarket:'',provider:'',deployer:'',interacts:'',synthetic:'',employment:'',education:'',credit:'',essential:'',biometrics:'',safetyProduct:'',gpai:'',changes:'',evidence:''
};

const questions: Array<{key:keyof FormState;title:string;copy:string}> = [
  {key:'euMarket',title:'Does this AI system or service reach the EU market or people in the EU?',copy:'EU AI Act obligations can apply based on market placement, deployment, affected persons, or outputs used in the Union.'},
  {key:'provider',title:'Do you develop, place on the market, or put the AI system into service under your name or trademark?',copy:'This can indicate a provider role or a need for provider-role analysis.'},
  {key:'deployer',title:'Do you use an AI system under your authority in a professional or organizational context?',copy:'This can indicate deployer obligations even when another company built the system.'},
  {key:'interacts',title:'Does the system interact directly with natural persons?',copy:'This may create Article 50 transparency questions depending on the system and context.'},
  {key:'synthetic',title:'Does it generate or manipulate text, audio, images, or video?',copy:'Synthetic-content marking and disclosure pathways may need to be evaluated.'},
  {key:'employment',title:'Is it used in employment, worker management, recruitment, evaluation, or access to work?',copy:'Certain employment-related uses can fall into high-risk categories depending on the facts.'},
  {key:'education',title:'Is it used in education, admissions, assessment, or access to educational opportunities?',copy:'Certain education-related uses can fall into high-risk categories.'},
  {key:'credit',title:'Is it used for creditworthiness, insurance risk, eligibility, or similarly consequential financial decisions?',copy:'Certain financial or eligibility uses may trigger heightened requirements.'},
  {key:'essential',title:'Is it used in essential private or public services, justice, migration, critical infrastructure, or public authority functions?',copy:'These contexts can materially change the risk and obligation picture.'},
  {key:'biometrics',title:'Does it use biometrics, emotion recognition, biometric categorization, or remote biometric identification?',copy:'Biometric use can involve prohibited-practice, high-risk, and transparency questions.'},
  {key:'safetyProduct',title:'Is the AI system a safety component of a regulated product or embedded in a regulated product?',copy:'Product-safety integration can affect high-risk timing and conformity pathways.'},
  {key:'gpai',title:'Do you provide or materially modify a general-purpose AI model?',copy:'GPAI providers have a distinct obligations pathway.'},
  {key:'changes',title:'Have the model, provider, purpose, workflow, authority, affected population, or integration changed recently?',copy:'Material change can weaken reliance on earlier evidence and trigger revalidation.'},
  {key:'evidence',title:'Could you produce current evidence for the controls you believe are operating today?',copy:'Policies and intentions are not the same as contemporaneous evidence that a control actually operated.'},
];

function Choice({value,onChange}:{value:Answer;onChange:(v:Answer)=>void}){
  return <div className="choices">{(['yes','no','unsure'] as const).map(v=><button key={v} onClick={()=>onChange(v)} className={value===v?'active':''}>{v.toUpperCase()}</button>)}</div>
}

export default function EUAIActStart(){
  const [state,setState]=useState<FormState>(initial);
  const [submitted,setSubmitted]=useState(false);
  const answered=Object.values(state).filter(Boolean).length;
  const summary=useMemo(()=>{
    const flags:string[]=[];
    if(state.euMarket==='yes'||state.euMarket==='unsure') flags.push('EU applicability should be examined');
    if(state.provider==='yes') flags.push('Provider-role pathway');
    if(state.deployer==='yes') flags.push('Deployer-role pathway');
    if(state.interacts==='yes') flags.push('Article 50 interaction-transparency pathway');
    if(state.synthetic==='yes') flags.push('Synthetic-content transparency pathway');
    if(['employment','education','credit','essential','biometrics','safetyProduct'].some(k=>state[k as keyof FormState]==='yes')) flags.push('High-risk / prohibited-practice classification review');
    if(state.gpai==='yes') flags.push('GPAI obligations pathway');
    if(state.changes==='yes') flags.push('Material-change revalidation pathway');
    if(state.evidence==='no'||state.evidence==='unsure') flags.push('Evidence-readiness gap review');
    return flags;
  },[state]);
  const complete=answered===questions.length;

  return <main className="page">
    <div className="stars" aria-hidden="true"/>
    <nav><Link href="/eu-ai-act">← EU AI ACT WORLD</Link><span>FREE POSITION SCREEN</span><Link href="/eu-ai-act/commercial">PRICING →</Link></nav>

    <header>
      <small>TA-14 · GOVERNED WORLD 05</small>
      <h1>CHECK YOUR<br/><em>EU AI ACT POSITION</em></h1>
      <p>Fourteen questions. No credit card. No compliance claim. The purpose is to identify the evidence and obligation pathways worth examining before you spend money.</p>
      <div className="progress"><i style={{width:`${Math.round(answered/questions.length*100)}%`}}/><span>{answered} / {questions.length} ANSWERED</span></div>
    </header>

    {!submitted?<section className="questions">{questions.map((q,i)=><article key={q.key} className={state[q.key]?'answered':''}><div className="num">{String(i+1).padStart(2,'0')}</div><div><h2>{q.title}</h2><p>{q.copy}</p></div><Choice value={state[q.key]} onChange={v=>setState(s=>({...s,[q.key]:v}))}/></article>)}</section>:null}

    {!submitted?<section className="submit"><div><small>FREE SCREEN · INFORMATIONAL GOVERNANCE ROUTING</small><h2>Ready to see the pathways your answers surfaced?</h2><p>This screen does not determine legal compliance, high-risk classification, or conformity status. It identifies issues that may justify evidence mapping, qualified legal analysis, or further review.</p></div><button disabled={!complete} onClick={()=>setSubmitted(true)}>{complete?'GENERATE MY POSITION →':'ANSWER ALL QUESTIONS TO CONTINUE'}</button></section>:null}

    {submitted?<section className="results">
      <div className="resultHead"><small>YOUR FREE TA-14 POSITION SCREEN</small><h2>{summary.length?`${summary.length} PATHWAYS IDENTIFIED`:'NO IMMEDIATE PATHWAY IDENTIFIED'}</h2><p>This is a routing result, not a legal determination. The next step is to establish the underlying facts and evidence for any pathway you choose to examine.</p></div>
      <div className="resultGrid">{summary.length?summary.map((x,i)=><article key={x}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b><small>OPEN FOR EVIDENCE MAPPING</small></article>):<article><span>01</span><b>Preserve this screen and reassess if the system, market, purpose, role, or EU use changes.</b><small>NO CURRENT ROUTE ASSERTED</small></article>}</div>
      <div className="evidenceCallout"><div><small>THE COMMERCIAL HANDOFF</small><h3>Want TA-14 to maintain the evidence state instead of leaving this as a one-time screen?</h3><p>The $19 Evidence Passport begins the living record: system identity, role, obligation map, Article 4 and Article 50 trackers, evidence inventory, change history, and monthly evidence status.</p></div><Link href="/eu-ai-act/commercial">SEE THE $19 EVIDENCE PASSPORT →</Link></div>
      <div className="resultActions"><Link href="/workspace/ai-governance/eu-ai-act">OPEN FULL REQUIREMENTS ENGINE →</Link><button onClick={()=>{setState(initial);setSubmitted(false)}}>START ANOTHER SCREEN</button></div>
    </section>:null}

    <footer><b>TA-14 AUTHORITY GOVERNANCE INSTITUTION</b><span>EU AI ACT EVIDENCE & COMPLIANCE EXCHANGE</span><small>Evidence readiness and governance infrastructure. Not legal advice or regulatory certification.</small></footer>

    <style jsx>{`
      *{box-sizing:border-box}.page{min-height:100vh;background:#02050b;color:#edf7ff;font-family:Inter,system-ui,sans-serif;position:relative;overflow:hidden}.stars{position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 0%,rgba(17,98,179,.28),transparent 30%),radial-gradient(circle at 15% 40%,rgba(0,186,255,.08),transparent 24%),radial-gradient(circle,#fff 0 1px,transparent 1.4px);background-size:auto,auto,75px 75px;opacity:.55}.page>:not(.stars){position:relative;z-index:1}nav{height:70px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(109,218,255,.18);background:rgba(2,7,14,.8);backdrop-filter:blur(12px)}nav :global(a){text-decoration:none;color:#86e7ff;font-size:11px;font-weight:900;letter-spacing:.1em}nav span{font-size:10px;letter-spacing:.18em;color:#9db2c6}header{max-width:1100px;margin:0 auto;padding:90px 24px 60px;text-align:center}header small,.submit small,.resultHead small,.evidenceCallout small{letter-spacing:.23em;color:#6cdbff;font-weight:900}h1{font-size:clamp(54px,8vw,110px);line-height:.86;letter-spacing:-.055em;margin:20px 0 28px;font-family:Georgia,serif}h1 em{font-style:normal;color:#7ce5ff}header p{max-width:820px;margin:auto;font-size:18px;line-height:1.7;color:#aac0d3}.progress{max-width:720px;height:38px;margin:40px auto 0;border:1px solid rgba(107,222,255,.25);background:#040a12;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}.progress i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#0a6ea4,#39d8ff);opacity:.35;transition:.3s}.progress span{position:relative;font-size:9px;letter-spacing:.17em;font-weight:900}.questions{width:min(1280px,calc(100% - 34px));margin:auto;display:grid;gap:10px}.questions article{display:grid;grid-template-columns:58px 1fr auto;gap:22px;align-items:center;padding:24px;border:1px solid #14283b;background:linear-gradient(135deg,rgba(7,18,31,.96),rgba(3,9,16,.96));transition:.25s}.questions article.answered{border-color:#236886;box-shadow:inset 3px 0 #51d8ff}.num{font-family:Georgia,serif;font-size:22px;color:#63dfff}.questions h2{font-size:18px;margin:0 0 7px}.questions p{font-size:12px;color:#879db0;line-height:1.55;margin:0;max-width:760px}.choices{display:flex;gap:6px}.choices button{border:1px solid #24445f;background:#07111d;color:#9eb5c8;padding:10px 12px;font-size:9px;font-weight:900;letter-spacing:.08em;cursor:pointer}.choices button.active{background:#60defc;color:#021018;border-color:#b9f4ff}.submit,.results{width:min(1280px,calc(100% - 34px));margin:38px auto 90px}.submit{padding:34px;border:1px solid #274b67;background:#050d17;display:flex;justify-content:space-between;align-items:center;gap:30px}.submit h2{font-family:Georgia,serif;font-size:32px;margin:9px 0}.submit p{max-width:770px;color:#94a9bb;line-height:1.6}.submit button{min-width:290px;padding:18px;border:1px solid #70e6ff;background:#73e3ff;color:#031018;font-weight:950;letter-spacing:.08em;cursor:pointer}.submit button:disabled{opacity:.35;cursor:not-allowed}.results{border:1px solid #1d455f;background:rgba(3,10,18,.94);padding:45px}.resultHead{text-align:center;max-width:900px;margin:0 auto 35px}.resultHead h2{font-family:Georgia,serif;font-size:clamp(34px,5vw,62px);margin:12px 0}.resultHead p{color:#9db1c3;line-height:1.65}.resultGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}.resultGrid article{min-height:145px;border:1px solid #1d3e57;background:#07121f;padding:20px;display:flex;flex-direction:column}.resultGrid span{color:#70e4ff;font-family:Georgia,serif;font-size:20px}.resultGrid b{margin:16px 0;line-height:1.35}.resultGrid small{margin-top:auto;color:#7592a8;letter-spacing:.1em}.evidenceCallout{margin-top:30px;padding:30px;border:1px solid #b78537;background:linear-gradient(135deg,#1c1409,#07101a);display:flex;align-items:center;justify-content:space-between;gap:25px}.evidenceCallout small{color:#f0c16d}.evidenceCallout h3{font-family:Georgia,serif;font-size:27px;margin:9px 0}.evidenceCallout p{color:#a8b6c3;line-height:1.6;max-width:800px}.evidenceCallout :global(a){flex:0 0 auto;text-decoration:none;background:#f2c269;color:#171005;padding:16px 19px;font-size:10px;font-weight:950}.resultActions{display:flex;gap:10px;justify-content:center;margin-top:25px;flex-wrap:wrap}.resultActions :global(a),.resultActions button{padding:13px 17px;border:1px solid #2d6b8a;background:#07131f;color:#82e1ff;text-decoration:none;font-size:9px;font-weight:900;letter-spacing:.08em}.resultActions button{cursor:pointer}footer{display:grid;gap:6px;text-align:center;padding:30px;border-top:1px solid #162a3b;color:#8499aa}footer b{color:#d6e6f2}footer small{font-size:9px}@media(max-width:780px){nav span{display:none}.questions article{grid-template-columns:42px 1fr}.choices{grid-column:1/-1;justify-content:center}.submit,.evidenceCallout{display:block}.submit button,.evidenceCallout :global(a){display:block;width:100%;min-width:0;margin-top:20px;text-align:center}.results{padding:24px}}
    `}</style>
  </main>
}
