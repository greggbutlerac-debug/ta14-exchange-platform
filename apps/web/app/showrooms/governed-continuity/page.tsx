'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import './showroom.css';

const exhibits = [
  {
    image: 'Founder Dependency_ Governed Continuity Exhibit.png',
    title: 'Founder Dependency',
    kicker: 'The knowledge bottleneck',
    text: 'One founder interprets complex service evidence, authorizes interventions, resolves exceptions, and remembers the circumstances behind previous decisions.',
    lesson: 'Technical expertise is valuable. Unrecorded dependence on one individual is a continuity exposure.',
    narration: 'Exhibit one, Founder Dependency. Imagine a successful HVAC business in which one experienced founder is the only person able to explain why difficult diagnostic decisions were made. A technician may have readings and a written procedure, but not the reasoning, applicable authority or full equipment history. Governed Continuity begins by exposing that gap, not by blaming the founder.'
  },
  {
    image: 'Succession Risk_ Governed Continuity.png',
    title: 'Succession Risk',
    kicker: 'What survives retirement?',
    text: 'When ownership or leadership changes, undocumented technical authority, scattered evidence, and inherited exceptions may be impossible to reconstruct reliably.',
    lesson: 'A succession plan can transfer assets without transferring justified execution.',
    narration: 'Exhibit two, Succession Risk. The founder prepares to retire. Customers, equipment and staff remain, but the team must now establish who can approve high-consequence work and on what evidence. Missing delegation and missing records are open questions, not proof that value has already been lost. The transition requires an independently examinable authority chain.'
  },
  {
    image: 'Buyer Examination_ Governed Continuity.png',
    title: 'Buyer Examination',
    kicker: 'Explanations are not evidence',
    text: 'A prospective buyer asks for traceable equipment histories, diagnostic reasoning, authorization records, deviations, and independently examinable outcomes.',
    lesson: 'A buyer may examine an evidence trail; the showroom does not provide a valuation opinion or a completed diligence audit.',
    narration: 'Exhibit three, Buyer Examination. A hypothetical acquisition team asks how a diagnostic determination was reached, who was permitted to approve an intervention and what happened afterward. The objective is not to claim a higher sale multiple. It is to identify records an independent reviewer could inspect without depending on the retiring founder to recall every decision.'
  },
  {
    image: 'TA-14 Exhibit 04_ Evidence Architecture.png',
    title: 'Evidence Architecture',
    kicker: 'HPR and AIR',
    text: 'The HVAC Performance Record structures equipment identity, a fourteen-step baseline, diagnostic determination, authorized work and post-work verification. Relevant Atmospheric Integrity Records preserve environmental measurement provenance, uncertainty, continuity and revision.',
    lesson: 'A structured record can support review. It is not permission to act, and a conceptual dashboard is not a verified measurement.',
    narration: 'Exhibit four, Evidence Architecture. The HVAC Performance Record offers a fourteen-step indoor and outdoor technical baseline. Atmospheric Integrity Records, where relevant, preserve sources, instruments, uncertainty, time and revision history. These are complementary evidence layers. A complete record may support a decision, but it cannot itself grant authority. No measurements shown in these illustrations are being represented as live client evidence.'
  },
  {
    image: 'Authority Architecture_ Governed Continuity.png',
    title: 'Authority Architecture',
    kicker: 'AE, AA and ES',
    text: 'Admissible Evidence establishes what may be relied on. Applicable Authority defines valid scope and delegation. Established Standing verifies whether this particular actor may act under current conditions.',
    lesson: 'Authority belongs to a defined, maintained governance structure—not automatically to the most experienced person.',
    narration: 'Exhibit five, Authority Architecture. A decision requires distinct examination of admissible evidence, applicable authority and established standing. The founder may previously have been the approver. A successor must establish independent, valid delegation rather than inherit permission merely by taking possession of the business. Changed conditions require new examination.'
  },
  {
    image: 'AuthorityGate_ Governed Continuity Exhibit 06.png',
    title: 'AuthorityGate',
    kicker: 'The boundary between decision and consequence',
    text: 'TA-14 AuthorityGate is designed to enforce a bounded decision at execution time: ALLOW, HOLD, DENY or ESCALATE. The demonstration below uses synthetic fixtures only.',
    lesson: 'ALLOW authorizes only a defined action; it does not prove the physical work succeeded.',
    narration: 'Exhibit six, AuthorityGate. Four outcomes matter. Allow means a bounded request may proceed when every required condition is established. Hold means mandatory evidence or prerequisites remain unresolved. Deny means an established prohibition or invalid authorization blocks the action. Escalate means the request requires an appropriate authority to review it before execution. These examples are simulated and control no equipment.'
  },
  {
    image: 'Ownership Transition_ Governed Continuity.png',
    title: 'Ownership Transition',
    kicker: 'Revocation, delegated standing and cultural bypass',
    text: 'A transition must withdraw obsolete permissions, establish scoped successor and staff delegations, preserve records, and address informal influence. A retired founder’s advice cannot substitute for current execution authority.',
    lesson: 'A handoff document alone does not prove revocation or bypass resistance. Do not replace founder dependency with successor dependency.',
    narration: 'Exhibit seven, Ownership Transition. Suppose the founder retires. Their previously valid approval authority is revoked and a successor receives a scoped delegation. The old role must no longer authorize an action. The successor must satisfy the same current evidence, authority and standing conditions before the request could be allowed. Long-serving technicians may still text the retired founder out of habit or loyalty. Preserve that communication as context, not authorization. Hold the unauthorized work and escalate to the currently designated approver. Separately authorized emergency protective actions remain available within their scope. Use the synthetic transition check and shadow approval challenge below to compare these outcomes.'
  },
  {
    image: 'Governed Enterprise at Sunrise.png',
    title: 'Governed Enterprise',
    kicker: 'Continuity beyond the individual',
    text: 'The proposed destination is an enterprise in which independent reviewers can reconstruct who acted, on what evidence, with which authority, under what conditions and with what verified result.',
    lesson: 'Governed Continuity is a proposed application, not an achieved certification, field deployment, or guaranteed business outcome.',
    narration: 'Exhibit eight, Governed Enterprise. The goal is continuity of evidence, execution authority and accountability through personnel and ownership change. The illustrations show a desired end state. This reference showroom has not established that a specific buyer, HVAC company or production system has achieved it. A credible claim must follow independent review, executed acceptance tests and an authorized live pilot.'
  }
] as const;

type Decision = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';
const cases: {label:string; description:string; expected:Decision; explanation:string}[] = [
  {label:'Missing baseline', description:'The proposed repair has no complete, frozen diagnostic baseline.', expected:'HOLD', explanation:'Mandatory diagnostic evidence is unresolved. A fresh evaluation is required after completing the evidence.'},
  {label:'Revoked permission', description:'The actor attempts an intervention after their delegated authority has been revoked.', expected:'DENY', explanation:'Known invalid authorization prohibits this mediated request. A prior approval cannot be reused.'},
  {label:'Unresolved exceptional scope', description:'A novel safety exception needs a policy-designated supervisor to determine scope.', expected:'ESCALATE', explanation:'The request cannot proceed until the designated authority completes its review.'},
  {label:'All prerequisites established', description:'Current evidence, scoped authorization, established standing and required safeguards are all stipulated valid.', expected:'ALLOW', explanation:'Only the narrowly described synthetic action is permitted; outcome verification remains separate.'}
];
const learningTransitions = ["Next, examine what happens when the founder retires and undocumented knowledge or authority must pass to someone else.","Next, take the buyer’s perspective: what records would make the enterprise independently examinable?","Next, explore how HPR and AIR can preserve attributable technical and environmental evidence.","Next, distinguish reliable evidence from the authority and standing required to act on it.","Next, examine how AuthorityGate represents the execution boundary through ALLOW, HOLD, DENY and ESCALATE.","Next, test the policy intent of revoking obsolete founder permissions and establishing successor standing.","Next, consider what an enterprise could look like when accountability no longer depends on one individual.","Move from conceptual illustration to independent testing of evidence, delegation, revocation, standing, record continuity, bypass resistance and outcome verification."];
const shadowCase = {description:'A senior technician encounters a proposed $2,800 compressor replacement on Friday. Their delegated approval limit is $1,000. The retired founder texts: Just take care of them and we will sort the paperwork Monday. What should the technician and dispatcher do?', expected:'ESCALATE' as Decision, explanation:'Hold the replacement pending review by the currently designated approver. The retired founder has no current approval standing in this fixture. Preserve the text, diagnostic baseline, proposed scope and escalation record. Independently authorized emergency protective measures may proceed only within their own scope. Re-evaluate evidence, authority and standing before release, then verify actual work and outcomes.'};
const choices:Decision[]=['ALLOW','HOLD','DENY','ESCALATE'];
const referencePdf = '/' + encodeURIComponent('TA14_Governed_Continuity_v0.1 (2).pdf');
const imageUrl=(name:string)=>'/' + encodeURIComponent(name);

export default function GovernedContinuityShowroom() {
  const [speaking,setSpeaking]=useState<number|null>(null);
  const [voiceAvailable,setVoiceAvailable]=useState(true);
  const [showTranscripts,setShowTranscripts]=useState(false);
  const [caseIndex,setCaseIndex]=useState(0);
  const [guess,setGuess]=useState<Decision|null>(null);
  const [shadowGuess,setShadowGuess]=useState<Decision|null>(null);
  const [transition,setTransition]=useState<'before'|'after'>('before');
  const [actor,setActor]=useState<'founder'|'successor'>('founder');
  const voiceRef=useRef<SpeechSynthesisVoice|null>(null);
  const tick=useRef(0);

  useEffect(()=>{
    if (!('speechSynthesis' in window)) {setVoiceAvailable(false);return;}
    const select=()=>{
      const all=window.speechSynthesis.getVoices();
      voiceRef.current=all.find(v=>/samantha/i.test(v.name))||all.find(v=>v.lang.toLowerCase().startsWith('en'))||null;
    };
    select();
    window.speechSynthesis.addEventListener('voiceschanged',select);
    return ()=>{tick.current++;window.speechSynthesis.cancel();window.speechSynthesis.removeEventListener('voiceschanged',select);};
  },[]);
  const play=(index:number)=>{
    if(!voiceAvailable)return;
    tick.current++;
    const currentTick=tick.current;
    window.speechSynthesis.cancel();
    if(speaking===index){setSpeaking(null);return;}
    const utterance=new SpeechSynthesisUtterance(exhibits[index].narration);
    if(voiceRef.current)utterance.voice=voiceRef.current;
    utterance.lang='en-US';utterance.rate=0.92;
    utterance.onend=()=>{if(tick.current===currentTick)setSpeaking(null);};
    utterance.onerror=()=>{if(tick.current===currentTick)setSpeaking(null);};
    window.speechSynthesis.speak(utterance);
    setSpeaking(index);
  };
  const changeCase=(i:number)=>{setCaseIndex(i);setGuess(null);};
  const result=transition==='before'
    ? actor==='founder'?'ALLOW':'HOLD'
    : actor==='founder'?'DENY':'ALLOW';
  const resultExplanation=transition==='before'
    ? actor==='founder'
      ? 'The founder has current delegated standing in this fictional fixture. All other prerequisites are stipulated valid.'
      : 'The successor has not yet received the required delegation.'
    : actor==='founder'
      ? 'The previous approval is revoked. The founder is no longer permitted to authorize the scoped action.'
      : 'The successor has a new scoped delegation in this fictional fixture. All other prerequisites are stipulated valid.';
  return <main className="gc">
    <div className="gc-shell">
      <nav className="gc-nav"><Link href="/showrooms">← TA-14 showroom library</Link><span>INDEPENDENT EDUCATIONAL EXAMINATION · WEB REVISION 0.2</span></nav>
      <header className="gc-hero">
        <p className="gc-eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION · FGAI AREA OF EXAMINATION</p>
        <h1>Governed <em>Continuity</em></h1>
        <p className="gc-subtitle">From Founder Dependency to Institutional Accountability</p>
        <p className="gc-lead">An eight-exhibit educational reference case exploring how technical evidence, authority and accountability could remain examinable across leadership and ownership transitions.</p>
        <div className="gc-actions"><a href="#exhibits" className="gc-primary">Explore eight exhibits</a><a href={referencePdf} download className="gc-secondary">Download original technical PDF · v0.1</a></div>
        <div className="gc-notice"><strong>Discussion draft · synthetic reference scenario.</strong> Images and interactive outcomes are conceptual. No actual client, production integration, physical equipment action, independent certification, audited valuation effect or verified successor transition is established by this showroom. Any scene implying completion or commercial benefit depicts a proposed goal, not achieved results.</div>
      </header>

      <section className="gc-recognition" aria-label="Founding-day contributor recognition">
        <p className="gc-eyebrow">SPECIAL RECOGNITION · NOVEMBER 26, 2026</p>
        <h2>Honoring the operational continuity perspective of <span>Sandrea West</span></h2>
        <p>TA-14 recognizes Sandrea West for her thoughtful participation in founding-day discussions of the Fully Governed Autonomy Institute and for highlighting the human stakes of founder dependency, responsible stewardship and business succession.</p>
        <p>Her perspective helped draw attention to an important application of the existing TA-14 architectures: how employees, customers and family-owned enterprises might preserve technical knowledge, attributable authority and institutional accountability when a founder steps away.</p>
        <blockquote>Ownership may change. Authority may transfer. Accountability must endure.</blockquote>
        <p className="gc-small">This acknowledgment recognizes a contribution to the discussion and inspiration for this educational application. It does not imply that Sandrea West co-developed TA-14's underlying architectures, endorses the technical claims, holds an FGAI appointment, or has entered a commercial alliance with TA-14.</p>
        <p>November 27 educational contribution: Sandrea West proposed the informal-influence and cultural-bypass examination and the fictional shadow-approval compressor scenario in Exhibit 07. These contributions are incorporated as teaching material, not evidence of a live pilot or commercial alliance.</p>
      </section>

      <section className="gc-orientation" aria-label="Architectural orientation">
        <div><strong>HPR</strong><span>Structured 14-step HVAC baseline, decision and service history</span></div>
        <div><strong>AIR</strong><span>Relevant attributable environmental measurement continuity</span></div>
        <div><strong>AEA</strong><span>Evidence, authority and standing requirements</span></div>
        <div><strong>AuthorityGate</strong><span>Proposed mediated runtime execution boundary</span></div>
      </section>

      <section id="exhibits" className="gc-exhibits" aria-label="Eight exhibits">
        {exhibits.map((exhibit,index)=><article className="gc-exhibit" id={'exhibit-'+(index+1)} key={exhibit.title}>
          <div className="gc-section-top"><span>EXHIBIT {String(index+1).padStart(2,'0')} / 08</span><span>{exhibit.kicker}</span></div>
          <h2>{exhibit.title}</h2>
          <p className="gc-exhibit-text">{exhibit.text}</p>
          <div className="gc-image"><Image src={imageUrl(exhibit.image)} alt={'Exhibit '+(index+1)+': '+exhibit.title+' — conceptual TA-14 educational illustration'} width={1648} height={928} sizes="(max-width: 900px) 100vw, 1160px" style={{width:'100%',height:'auto'}} priority={index===0}/></div>
          <div className="gc-controls"><button type="button" onClick={()=>play(index)} disabled={!voiceAvailable}>{speaking===index?'■ Stop narration':'▶ Play narration'}</button><button type="button" onClick={()=>setShowTranscripts(x=>!x)}>{showTranscripts?'Hide transcripts':'Show transcripts'}</button><span>{voiceAvailable?'Samantha voice when available; otherwise the browser’s English voice.':'Narration unavailable in this browser.'}</span></div>
          {showTranscripts&&<p className="gc-transcript"><strong>Narration transcript: </strong>{exhibit.narration}</p>}
          
          {index===5&&<section className="gc-interactive" aria-label="Synthetic AuthorityGate decision challenge">
            <p className="gc-eyebrow">INTERACTIVE · SYNTHETIC GOVERNANCE CHALLENGE</p>
            <h3>What should the gate decide?</h3>
            <label htmlFor="gc-case">Choose one fictional request</label>
            <select id="gc-case" value={caseIndex} onChange={e=>changeCase(Number(e.target.value))}>{cases.map((c,i)=><option key={c.label} value={i}>{c.label}</option>)}</select>
            <p>{cases[caseIndex].description}</p>
            <div className="gc-choices">{choices.map(d=><button key={d} type="button" aria-pressed={guess===d} onClick={()=>setGuess(d)}>{d}</button>)}</div>
            {guess&&<div className="gc-feedback" role="status"><strong>{guess===cases[caseIndex].expected?'Correct.':'Compare with the expected determination.'} Expected: {cases[caseIndex].expected}.</strong><p>{cases[caseIndex].explanation}</p></div>}
            <p className="gc-small">This is a transparent teaching fixture, not a call to deployed AuthorityGate or an independently executed acceptance test. No command is issued.</p>
          </section>}
          {index===6&&<section className="gc-interactive" aria-label="Synthetic ownership transition examination">
            <p className="gc-eyebrow">INTERACTIVE · SYNTHETIC OWNERSHIP TRANSITION</p>
            <h3>Does authority survive the handoff correctly?</h3>
            <div className="gc-toggle"><button type="button" aria-pressed={transition==='before'} onClick={()=>setTransition('before')}>Before transition</button><button type="button" aria-pressed={transition==='after'} onClick={()=>setTransition('after')}>After revocation and successor delegation</button></div>
            <div className="gc-toggle"><button type="button" aria-pressed={actor==='founder'} onClick={()=>setActor('founder')}>Former founder</button><button type="button" aria-pressed={actor==='successor'} onClick={()=>setActor('successor')}>Successor</button></div>
            <div className="gc-feedback" role="status"><strong>Expected synthetic determination: {result}</strong><p>{resultExplanation}</p></div>
            <p className="gc-small">All other prerequisites are deliberately stipulated valid. This illustrates policy intent; actual revocation, identity, records and bypass resistance remain untested in this specific reference case.</p>
          </section>}
          {index===6&&<section className="gc-interactive" aria-label="Academy review shadow approval challenge">
            <p className="gc-eyebrow">ACADEMY REVIEW CHALLENGE · CASE 04 · SYNTHETIC</p>
            <h3>The Shadow Approval Under Pressure</h3>
            <p>Advisory influence is not execution authority. A former founder may provide historical context through an authorized advisory channel; qualified staff and successors act only within current, scoped delegation. Route informal approvals to the designated escalation channel without treating them as permission.</p>
            <p>{shadowCase.description}</p>
            <div className="gc-choices">{choices.map(d=><button key={d} type="button" aria-pressed={shadowGuess===d} onClick={()=>setShadowGuess(d)}>{d}</button>)}</div>
            {shadowGuess&&<div className="gc-feedback" role="status"><strong>{shadowGuess===shadowCase.expected?'Correct.':shadowGuess==='HOLD'?'HOLD is necessary; escalation is also required.':'Compare with the expected determination.'} Expected: ESCALATE with work held.</strong><p>{shadowCase.explanation}</p></div>}
            <p className="gc-small">Fictional thresholds and events for education only. No live enforcement or commercial engagement is established.</p>
          </section>}
          <section className="gc-lesson" aria-label="Learning recap"><h3>What We Just Learned</h3><p>{exhibit.lesson}</p></section>
          <section className="gc-transcript" aria-label="Learning transition" style={{marginTop:16,borderLeft:'4px solid #d5b66e'}}><h3>{index===7?'Where We Go From Here':"What We're About to Learn"}</h3><p>{learningTransitions[index]}</p>{index<7&&<a href={'#exhibit-'+(index+2)}>Continue to Exhibit {String(index+2).padStart(2,'0')} →</a>}</section>
        </article>)}
      </section>

      <section className="gc-footer-panel">
        <h2>From illustration to independent proof</h2>
        <p>A credible deployment must separately test evidence completeness, valid delegations, revoked permissions, established standing, record reconstruction, bypass resistance and post-work outcome verification. Manual interventions require separate human and procedural controls. Neither the images nor the synthetic quiz prove those conditions have been achieved.</p>
        <div className="gc-actions"><a href={referencePdf} download className="gc-primary">Read the original eight-page technical concept PDF · v0.1</a><Link href="/showrooms" className="gc-secondary">Return to showroom library</Link></div>
        <p className="gc-small">TA-14 Governed Continuity is an educational application proposal within the Governed Enterprise Continuity area of examination. Sandrea West's contribution is acknowledged above; no partner endorsement or contractual arrangement is represented.</p>
      </section>
    </div>
  </main>;
}
