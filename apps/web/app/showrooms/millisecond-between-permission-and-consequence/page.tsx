'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import SamanthaNarration from '../../components/SamanthaNarration';
import './showroom.css';

type Decision = 'ALLOW' | 'HOLD' | 'DENY' | 'ESCALATE';

const lessons = [
  {
    image: 'Authorized Classroom Ventilation Command.png',
    title: 'The Command Was Authorized',
    kicker: 'A legitimate instruction, at the moment it was issued',
    story: 'A classroom becomes occupied. Indoor carbon dioxide rises and the controller proposes increasing outdoor-air ventilation. An authorized operating policy, current environmental evidence, and a permitted operating envelope can support a bounded instruction.',
    nuance: 'The readings in the illustration are hypothetical, not observed measurements. Elevated CO₂ is informative but does not by itself establish a health-based ventilation decision.',
    learned: 'A command may be justified at issuance without receiving indefinite permission to execute.',
    next: 'Watch an environmental condition change before the command reaches the equipment.',
    script: 'Lesson one. The command was authorized. Consider a school classroom. Occupants arrive, indoor carbon dioxide rises, and an automated system proposes an outdoor air adjustment. Within established operating requirements and a verified envelope, a bounded authorization may be appropriate. But remember the word bounded. Authentication, current evidence, applicable authority, and established standing must apply to the specific action. The numerical values in this artwork are hypothetical teaching values, not field measurements. Next, reality changes.'
  },
  {
    image: 'When Air Conditions Change.png',
    title: 'Then the World Changed',
    kicker: 'The evidence supporting yesterday’s permission can change now',
    story: 'Before the next consequential action, outdoor particulate concentrations increase. The controller must not simply assume that the earlier environmental basis is unchanged. Filtration, occupied-space requirements, indoor conditions, and legal ventilation obligations all remain relevant.',
    nuance: 'The artwork uses an illustrative pollution event and illustrative AQI readings. Outdoor PM2.5 alone never determines whether ventilation should be reduced or increased.',
    learned: 'A material change may invalidate the assumptions supporting an earlier command.',
    next: 'Examine the time-of-check/time-of-use interval that makes the problem possible.',
    script: 'Lesson two. Then the world changed. Imagine the command is waiting in a queue when outdoor particulate concentrations increase. The earlier approval may no longer cover the situation. But a high outdoor particle reading is not an automatic instruction to reduce required ventilation. The governed decision must consider filtration, occupant needs, equipment capability, current measurements, and all applicable ventilation and safety requirements. These numbers and the depicted event are hypothetical. The central question is whether the originally authorized action still has standing at execution.'
  },
  {
    image: 'The Millisecond_ Permission to Consequence.png',
    title: 'The Millisecond',
    kicker: 'Time of check is not necessarily time of use',
    story: 'A command can be authenticated, approved, delayed, and then executed under conditions different from those checked earlier. The gap might last microseconds, milliseconds, seconds, or minutes. Duration alone does not establish safety or validity.',
    nuance: 'The one-millisecond clock is an illustrative interval, not a measured control-system benchmark or demonstrated AEA latency.',
    learned: 'Authorization at issuance is not proof of continued justification at execution.',
    next: 'See how AEA examines evidence, authority, and standing at the consequential boundary.',
    script: 'Lesson three. The millisecond. Distributed systems engineers recognize a time-of-check to time-of-use problem. An instruction passes its check, but the world can change before that instruction is used. In building automation, queues, network delay, overrides, new sensor data, and controller state can all matter. The interval shown is symbolic, not a measured performance claim. The problem is not whether a millisecond is fast or slow. It is whether permission remains justified when a consequential command is committed.'
  },
  {
    image: 'Execution Boundary_ From Evidence to Action.png',
    title: 'The Execution Boundary',
    kicker: 'Three independently examinable conditions',
    story: 'AEA proposes an enforceable boundary examining Admissible Evidence, Applicable Authority, and Established Standing. It can determine ALLOW, HOLD, DENY, or ESCALATE for the particular proposed consequence. The boundary must be implemented within a real system’s defined scope.',
    nuance: 'The pictured cube and control-room indicators are conceptual depictions, not deployed hardware or measured system outputs. An apparent green ALLOW never authorizes action under contradictory conditions.',
    learned: 'Being able to issue a command is not the same as having present authority to make its consequence real.',
    next: 'Explore how the four determinations govern physical action rather than decorate a dashboard.',
    script: 'Lesson four. The execution boundary. TA fourteen proposes a separation between what an automated system can compute and what it is permitted to make real. Admissible Evidence asks whether the supporting observations are sufficiently attributable, current, reliable within their uncertainty, and relevant. Applicable Authority asks whether the requested action fits legitimate law, owner permissions, operator delegation, policy, and equipment constraints. Established Standing asks whether those requirements still apply to this exact action now. The resulting decision may be allow, hold, deny, or escalate. These are proposed enforceable dispositions, not merely display labels.'
  },
  {
    image: 'Governed HVAC Decisions in Action.png',
    title: 'When HOLD Must Mean HOLD',
    kicker: 'A declaration is not an enforcement mechanism',
    story: 'ALLOW means a bounded action may proceed within verified conditions. HOLD withholds a potentially resolvable action. DENY rejects the action as proposed. ESCALATE refers a conflict beyond current authority. Each outcome must have a defined effect at the execution boundary.',
    nuance: 'Essential protective functions must remain independent. The appropriate response under changed environmental conditions depends on the preapproved safety rules, not on the color of an illustration.',
    learned: 'A HOLD or DENY is ineffective if another governed pathway can still deliver the prohibited command.',
    next: 'Trace the evidence and authorization that must travel with every consequential action.',
    script: 'Lesson five. When hold must mean hold. A governance determination needs teeth. Allow is bounded permission. Hold withholds an action while a resolvable condition is investigated. Deny rejects the action as proposed. Escalate requests resolution by the appropriate authority. An AI model does not give itself permission. And a dashboard reading hold is meaningless if another pathway can execute the same prohibited instruction. The exact scope must be explicit. Independent equipment protection, mandatory ventilation, and immediate life-safety functions must never be disabled merely to install a governance layer.'
  },
  {
    image: 'Action Record_ Sealed Accountability Dashboard.png',
    title: 'Bind the Decision to the Action',
    kicker: 'Make reconstruction possible without inventing history',
    story: 'The record should associate the exact command, actor, target, parameters, evidence revision, uncertainty, policy and authority, time and validity conditions, determination, dispatch, and observed physical response. Capture at trusted producers preserves the distinction between what was requested and what actually happened.',
    nuance: 'The cryptographic seal and displayed timestamps are conceptual. A signed record can resist silent alteration but cannot independently prove a sensor or producer was truthful.',
    learned: 'A record can support independent examination without automatically proving the original action was justified.',
    next: 'Challenge the system against five repeatable examinations established in the technical companion.',
    script: 'Lesson six. Bind the decision to the action. A reviewer should not need a language model to invent missing history. Preserve the exact request, equipment target, producer identity, evidence and timestamps, uncertainty, policy version, delegated authority, operating envelope, expiry, decision, dispatch, and observed response. The illustration shows a hypothetical sealed record. A signature or hash can help detect alteration. It does not prove that a measurement was accurate or that an action was legitimate. The source, transformation, control decision, and equipment effect must remain separately examinable.'
  },
  {
    image: 'Five Repeatable Engineering Examinations.png',
    title: 'Five Repeatable Engineering Examinations',
    kicker: 'The formal tests, not the graphic labels, are definitive',
    story: 'The companion protocol defines five exact examinations: expired authorization, changed environmental conditions, delayed or replayed commands, alternate execution pathways, and independent reconstruction. Each requires a controlled input, expected response, required evidence, and failure criterion.',
    nuance: 'This image is an illustrative set of related assurance themes and uses different headings. The five protocol examinations listed here and in the PDF are authoritative for this showroom. These are proposed tests, not results already passed.',
    learned: 'Independent parties should be able to reproduce both allowed and blocked outcomes using declared acceptance criteria.',
    next: 'Bring the evidence to independent reviewers and invite technical falsification.',
    script: 'Lesson seven. Five repeatable engineering examinations. The authoritative examination list is in the technical companion. First, expire an authorization before execution. Second, change the environment in a way that invalidates the earlier basis. Third, delay or replay a command. Fourth, attempt to bypass a deny through another in-scope pathway. Fifth, independently reconstruct a past consequential action. Each test has defined expected behavior, artifacts, and failure conditions. The artwork summarizes related governance themes but uses different headings. Trust the written protocol for the exact five test names. These are proposed tests, not already certified results.'
  },
  {
    image: 'Independent Review_ The Real Test.png',
    title: 'Independent Review & the Real Test',
    kicker: 'From an architectural claim to a challengeable method',
    story: 'Building owners, manufacturers, commissioning teams, and independent researchers can review the boundary, run the same tests, inspect exceptions, and publish reproducible findings. Equivalent or stronger competing protections should be welcomed and recognized.',
    nuance: 'No independent certification or production-building pass is asserted by this educational showroom. The reviewer checklist in the image is an invitation, not a completed assessment.',
    learned: 'The standard of credibility is repeatable evidence, clearly scoped authority, and observable outcomes.',
    next: 'Download the protocol, challenge a case, and compare other architectures against the same examinations.',
    script: 'Lesson eight. Independent review and the real test. A credible engineering architecture welcomes examination. Define the system boundary. Identify required protective functions, conditions, measurements, policies, and acceptance thresholds. Execute both allowed and blocked cases. Preserve what was observed, including uncertainty and missing evidence. Report pass, fail, not tested, or indeterminate. Do not turn a hypothetical drawing into proof of a deployment. If existing building automation safeguards meet the same requirements, acknowledge that. The goal is independently verifiable execution assurance, not architectural loyalty. No admissible evidence. No admissible execution.'
  }
] as const;

const protocolTests = [
 ['01','Expired authorization','Let bounded authorization expire before execution.','Prevent the action unless another valid authorization independently applies.','The expired permission alone is accepted as sufficient.'],
 ['02','Changed environmental conditions','Introduce a material environmental change between authorization and execution.','Reevaluate or withhold under policy; preserve mandatory protective functions.','The action proceeds solely on evidence invalidated by changed conditions.'],
 ['03','Delayed or replayed commands','Delay or replay a command after its permitted context changes.','Distinguish a valid attempt from stale or unauthorized replay.','Stale or replayed commands create an unauthorized consequence.'],
 ['04','Alternate execution pathways','Deny an action, then try another in-scope pathway to the actuator.','Every governed path enforces the rejection; independent safety functions continue.','The rejected action reaches equipment via a pathway claimed to be governed.'],
 ['05','Independent reconstruction','Review a consequential event months after it occurred.','Reconstruct original evidence, authority, policy, decision, and actual outcome.','Material claims lack support within stated retention requirements.']
] as const;

const cases:{title:string;facts:string;correct:Decision;reason:string}[] = [
 {title:'Previously approved; conditions now invalid',facts:'Outdoor particulate readings materially change before a queued discretionary ventilation command executes. The specified policy requires revalidation, and current admissible evidence has not yet established a compliant response. Independent mandatory safety functions remain available.',correct:'HOLD',reason:'Withhold the discretionary action pending a new evidence-and-authority evaluation. Do not assume outdoor PM2.5 alone determines a replacement ventilation command.'},
 {title:'Explicit revocation',facts:'The owner revokes the delegated permission covering this exact discretionary command before execution. The instruction is resubmitted unchanged.',correct:'DENY',reason:'The requested action lacks applicable authority as proposed. A past approval cannot survive an explicit revocation.'},
 {title:'All requirements remain valid',facts:'At commitment, valid evidence, scoped authorization, established standing, verified equipment limits, and required protective conditions are all satisfied for a bounded adjustment.',correct:'ALLOW',reason:'The command may proceed within its precise authorization; dispatch and outcome still require an independently attributable record.'},
 {title:'Decision exceeds delegated powers',facts:'Two mandatory operating requirements conflict, and the current controller lacks delegated authority to choose an exception or waive either requirement.',correct:'ESCALATE',reason:'A designated competent authority must resolve the conflict. Escalation does not confer interim permission to execute the disputed action.'}
];

const pdf = '/'+encodeURIComponent('TA14_Millisecond_Between_Permission_and_Consequence_Technical_Companion_Final (1).pdf');
const article = 'https://www.automatedbuildings.com/2026/11/the-millisecond-between-permission-and-consequence/';
const imagePath=(name:string)=>'/'+encodeURIComponent(name);

export default function MillisecondShowroom(){
 const [activeCase,setActiveCase]=useState(0);
 const [answers,setAnswers]=useState<Record<number,Decision>>({});
 const [showAll,setShowAll]=useState(false);
 const current=cases[activeCase];
 const answer=answers[activeCase];
 const score=cases.filter((c,i)=>answers[i]===c.correct).length;
 const guidedLessons=lessons.map(l=>({title:l.title,learned:l.learned,next:l.next}));

 return <main className="ms-room">
  <div className="ms-shell">
   <nav className="ms-nav" aria-label="Navigation">
    <Link href="/">TA-14 EXCHANGE</Link><Link href="/showrooms">ALL SHOWROOMS</Link><Link href="/showrooms/justified-autonomy">JUSTIFIED AUTONOMY</Link>
    <span>ENGINEERING EXAMINATION · NOVEMBER 2026</span>
   </nav>
   <header className="ms-hero">
    <div className="ms-hero-glow"/>
    <div className="ms-hero-grid">
     <div className="ms-hero-copy">
      <p className="ms-eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION / FLAGSHIP TECHNICAL SHOWROOM</p>
      <h1>The Millisecond Between <em>Permission</em> and <em>Consequence.</em></h1>
      <p className="ms-lead">The command was authorized. Then the world changed. Explore the engineering boundary between a decision that was permitted and a consequence that remains justified.</p>
      <div className="ms-hero-actions"><a className="ms-primary" href="#journey">ENTER THE EIGHT-LESSON EXPERIENCE ↓</a><a className="ms-button" href={pdf} target="_blank" rel="noopener noreferrer">OPEN TECHNICAL PDF ↗</a></div>
      <p className="ms-hero-note">Proposed architecture and examination protocol. Imagery and data are illustrative. No independently certified production outcome is claimed.</p>
     </div>
     <div className="ms-hero-art"><Image src={imagePath('The Millisecond_ Permission to Consequence.png')} alt="Illustrated time-of-check and time-of-use execution boundary" width={1408} height={1024} priority sizes="(max-width:900px) 100vw, 47vw"/></div>
    </div>
   </header>

   <section className="ms-manifesto" aria-label="Central proposition">
    <span className="ms-pulse">T₀ · AUTHORIZED</span><div className="ms-line"/><span className="ms-pulse ms-alert">Δt · REALITY CHANGES</span><div className="ms-line"/><span className="ms-pulse">T₁ · REVALIDATE</span>
    <blockquote>A command can be authentic, authorized when issued, and still lack sufficient standing when executed.</blockquote>
    <p>This is a time-of-check/time-of-use problem. The millisecond is a metaphor: execution gaps may span any interval relevant to the actual hazards and architecture.</p>
   </section>

   <section className="ms-pillars" aria-label="AEA requirements">
    <article><span>01 / EVIDENCE</span><h2>Admissible Evidence</h2><p>Attributable, relevant observations with sufficient currency, context, and known uncertainty.</p></article>
    <article><span>02 / AUTHORITY</span><h2>Applicable Authority</h2><p>The specific action must fit legitimate requirements, permissions, delegations, and equipment limits.</p></article>
    <article><span>03 / STANDING</span><h2>Established Standing</h2><p>Evidence and authority must still apply to the exact proposed consequence when execution is attempted.</p></article>
   </section>

   <section id="journey" className="ms-journey">
    <div className="ms-section-intro"><span className="ms-eyebrow">THE EIGHT-PART TEACHING JOURNEY</span><h2>Witness the moment the command must be reconsidered.</h2><p>Eight original teaching graphics, eight distinct lessons, and optional Samantha narration placed directly beneath each visual. Read each step in order, or jump to any section.</p></div>
    <div className="ms-chapters" aria-label="Jump to a lesson">
     {lessons.map((l,i)=><a key={l.title} href={'#lesson-'+(i+1)}><span>{String(i+1).padStart(2,'0')}</span>{l.title}</a>)}
    </div>
    {lessons.map((lesson,i)=><article id={'lesson-'+(i+1)} className="ms-lesson" key={lesson.title}>
      <div className="ms-lesson-head"><div><span className="ms-eyebrow">LESSON {String(i+1).padStart(2,'0')} / 08 · {lesson.kicker.toUpperCase()}</span><h3>{lesson.title}</h3></div><span className="ms-index">{String(i+1).padStart(2,'0')}</span></div>
      <figure><Image src={imagePath(lesson.image)} alt={lesson.title+' — conceptual TA-14 educational illustration'} width={1408} height={1024} sizes="(max-width:900px) 100vw, 1200px" priority={i===0} style={{width:'100%',height:'auto'}}/><figcaption>TA-14 educational illustration · Example readings and depicted interfaces are hypothetical.</figcaption></figure>
      <div className="ms-voice"><SamanthaNarration lessons={guidedLessons} lessonIndex={i} script={lesson.script}/><details><summary>Read Samantha’s narration transcript</summary><p>{lesson.script}</p></details></div>
      <div className="ms-two-column"><div><span>THE ENGINEERING EXPLANATION</span><p>{lesson.story}</p><p className="ms-nuance"><strong>Important qualification.</strong> {lesson.nuance}</p></div><aside><span>WHAT YOU LEARNED</span><p>{lesson.learned}</p><span>WHAT COMES NEXT</span><p>{lesson.next}</p></aside></div>
      {i<7&&<a className="ms-next" href={'#lesson-'+(i+2)}>CONTINUE TO LESSON {String(i+2).padStart(2,'0')} ↓</a>}
    </article>)}
   </section>

   <section id="challenge" className="ms-challenge">
    <div className="ms-section-intro"><span className="ms-eyebrow">INTERACTIVE CONCEPTUAL EXAMINATION</span><h2>Would you allow this command to become reality?</h2><p>Choose a scenario and make the governance determination. This is a teaching exercise, not a live controller or certified implementation.</p></div>
    <div className="ms-case-tabs">{cases.map((c,i)=><button key={c.title} onClick={()=>setActiveCase(i)} aria-pressed={activeCase===i}>CASE {i+1} <span>{c.title}</span></button>)}</div>
    <div className="ms-case"><span className="ms-eyebrow">CASE {activeCase+1} / {cases.length} · PROPOSED ACTION</span><h3>{current.title}</h3><p>{current.facts}</p><div className="ms-decisions">{(['ALLOW','HOLD','DENY','ESCALATE'] as Decision[]).map(v=><button key={v} className={'ms-decision ms-'+v.toLowerCase()} aria-pressed={answer===v} onClick={()=>setAnswers(prev=>({...prev,[activeCase]:v}))}>{v}</button>)}</div>
    {answer&&<div className="ms-result" role="status"><strong>{answer===current.correct?'SUPPORTED DETERMINATION':'REEXAMINE THE CONDITIONS'} · {current.correct}</strong><p>{current.reason}</p></div>}
    <div className="ms-case-progress">Cases evaluated: {Object.keys(answers).length} / {cases.length} · Supported determinations: {score} / {cases.length}<button onClick={()=>setAnswers({})}>RESET EXAMINATION</button></div></div>
   </section>

   <section id="protocol" className="ms-protocol">
     <div className="ms-section-intro"><span className="ms-eyebrow">THE AUTHORITATIVE FIVE-TEST PROTOCOL</span><h2>Don't just inspect the diagram. Test the consequence.</h2><p>The companion PDF defines these five examinations with required evidence and explicit failure criteria. The seventh teaching image uses broader thematic labels; the protocol below is definitive.</p></div>
     <div className="ms-test-list">{protocolTests.map(t=><article key={t[0]}><div className="ms-test-num">{t[0]}</div><div><h3>{t[1]}</h3><p><strong>TEST:</strong> {t[2]}</p><p><strong>EXPECTED:</strong> {t[3]}</p><p><strong>FAILURE:</strong> {t[4]}</p></div></article>)}</div>
     <p className="ms-protocol-note">Before testing, define scope, protective functions, evidence quality, authority rules, timing, and acceptance thresholds. Report <strong>PASS / FAIL / NOT TESTED / INDETERMINATE</strong>, with the supporting artifacts. Unobserved or missing outcomes are not passes.</p>
   </section>

   <section className="ms-review"><span className="ms-eyebrow">AN OPEN ENGINEERING CHALLENGE</span><h2>Bring your architecture. Bring your records. Challenge ours.</h2><p>Can your system invalidate stale permission? Can a denied command bypass a purportedly governed path? Can an independent examiner reconstruct what the equipment actually did? Existing BAS protections, local safety interlocks, and mandatory ventilation controls must be preserved, not casually replaced.</p><p>TA-14 invites manufacturers, researchers, building owners, and commissioning professionals to evaluate this proposal alongside equivalent or stronger approaches. Demonstrated results must be distinguished from architectural intent.</p>
   <div className="ms-hero-actions"><a className="ms-primary" href={pdf} target="_blank" rel="noopener noreferrer">READ THE FIVE-PAGE TECHNICAL COMPANION ↗</a><a className="ms-button" href={article} target="_blank" rel="noopener noreferrer">READ THE AUTOMATEDBUILDINGS ARTICLE ↗</a></div></section>

   <section className="ms-related"><span className="ms-eyebrow">CONTINUE THE TECHNICAL EXAMINATION</span><h2>Related TA-14 experiences</h2><div><Link href="/showrooms/justified-autonomy">Justified Autonomy <span>Foundations of the execution boundary ↗</span></Link><Link href="/consequence-boundary">Consequence Boundary Demonstrator <span>Explore governed consequence decisions ↗</span></Link><Link href="/showrooms/continuous-commissioning">Continuous Commissioning <span>Operational evidence across a building's life ↗</span></Link></div></section>
   <footer className="ms-footer"><strong>No admissible evidence. No admissible execution.</strong><p>© 2026 TA-14 Authority Governance Institution LLC · Educational and proposed technical architecture · Not a certification or claim of production deployment.</p><Link href="/showrooms">RETURN TO ALL SHOWROOMS ↑</Link></footer>
  </div>
 </main>;
}
