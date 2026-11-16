import Link from 'next/link';
import Samantha from '../epic-air-quality-fund/Samantha';

export const metadata = {
  title: 'When the Air Outside Becomes the Threat | TA-14 Governance Workshop Atlas',
  description: 'An eight-lesson, independently challengeable virtual-library exercise: the Lagos window decision, admissible evidence, authorized action, and a changed jurisdiction in Canada.',
  alternates: { canonical: '/showrooms/when-the-air-outside-becomes-the-threat' },
  openGraph: { title: 'When the Air Outside Becomes the Threat | TA-14', description: 'From environmental measurement to authorized building action.', url: 'https://www.ta14exchange.com/showrooms/when-the-air-outside-becomes-the-threat', type: 'website' }
};

const pdf = '/'+encodeURIComponent('TA14_Window_Decision_Governance_Workshop_Enhanced (1).pdf');
const lessons = [
  {n:'01', title:'The Library in Lagos', img:'The Library in Lagos_ A Governance Scenario.png',
   script:'A virtual library is placed in Lagos, Nigeria, to examine one simple problem: when outdoor pollution is elevated, may its operable windows remain open? The building and pollution event are hypothetical. The owner purpose, occupied zones, vulnerable users, window boundaries and actual control responsibilities must be specified before any decision is justified.',
   learned:'Establish the owner purpose, exact building boundary, occupants, and proposed consequence before considering automation.', next:'Define the window action and its competing environmental consequences.'},
  {n:'02', title:'The Window Decision', img:'The Window Decision_ Library Airflow Tradeoffs.png',
   script:'The hypothetical proposed action is to close specified operable windows for a defined duration. Opening or closing changes more than one variable. Outdoor and indoor particulate exposure, carbon dioxide, ventilation, temperature, relative humidity, energy, accessibility and occupant safety may move in different directions. The displayed readings, duration and thresholds are fictional workshop inputs, not site measurements or validated operating limits.',
   learned:'An exact action must be defined and evaluated against multiple environmental consequences.', next:'Test whether the observations are trustworthy enough to support that action.'},
  {n:'03', title:'Can We Trust the Evidence?', img:'Trustworthy Evidence Monitoring Workshop.png',
   script:'One outdoor PM2.5 value cannot by itself establish admissible evidence. An Atmospheric Integrity Record should preserve instrument identity, location and placement, custodian, calibration, time source, timestamps, missing data, uncertainty, corroboration and revision history. The green checks and calibration example in this image are illustrative only. A reviewer must be able to inspect contradictory and missing information rather than accept a confidence badge.',
   learned:'Decision-grade evidence is attributable, time-relevant, quality-assessed and independently challengeable.', next:'Separate what an AI model predicts from what anybody has permission to do.'},
  {n:'04', title:'Prediction Is Not Permission', img:'Prediction Is Not Permission (3).png',
   script:'An analytics model might forecast rising outdoor particles and recommend closing windows. A forecast is a claim about possible future conditions. It is not an instruction with independent authority to operate building equipment. Before execution, Admissible Execution Architecture evaluates Admissible Evidence, Applicable Authority and Established Standing for the precise proposed action now. The chart and green checkmarks are conceptual, not evidence of a configured or validated authorization gate.',
   learned:'Prediction may inform an authorized decision; prediction is never the source of permission.', next:'Examine the four outcomes of the execution boundary.'},
  {n:'05', title:'The Execution Boundary', img:'Execution Boundary_ TA-14 Governance Atlas.png',
   script:'A proposed consequential action reaches the AEA boundary. ALLOW means the action-specific requirements are satisfied within an approved scope. HOLD means a potentially resolvable gap prevents this discretionary action now. DENY rejects a prohibited request. ESCALATE routes the unresolved issue to the designated professional or authority. An outcome for one window command is not a general building-wide permission. Independently authorized fire, smoke-control and emergency actions must not be obstructed by a discretionary HOLD.',
   learned:'An execution decision is narrow, time-specific, reasoned and reviewable; an emergency safety path retains its separate authority.', next:'Ask who may actually invoke the governing instruction.'},
  {n:'06', title:'Who Has Authority?', img:'Who Has Authority_ Governance Workshop Atlas.png',
   script:'The asset owner may state the public-service objective, an operator may work within delegated control scope, a qualified engineer may establish technical safety constraints, a public authority may impose applicable obligations, and community representatives may have defined stewardship roles. These are illustrative roles, not legal assignments. Applicable Authority identifies the verified governing instrument; Established Standing establishes whether this particular actor may rely on it for these windows and conditions right now.',
   learned:'Having a relevant role is not the same as holding a valid, current delegation for the proposed action.', next:'Reconsider the exact same virtual library in a different jurisdiction.'},
  {n:'07', title:'Same Building, Canada', img:'Same Building, Canada_ Governance Reassessed.png',
   script:'Move the virtual library from Lagos to Canada. The digital building geometry may be unchanged, but local conditions, climate, building and safety rules, owner obligations, occupancy, equipment and delegated authority must be re-established. This image shows illustrative readings and a conditional ALLOW label; neither verifies Canadian law, a real indoor environment, or a legitimate window-control delegation. No Lagos authorization transfers automatically across borders.',
   learned:'The same model cannot carry environmental assumptions or permissions into a different jurisdiction without revalidation.', next:'Show how the decision is recorded and re-examined over the asset lifetime.'},
  {n:'08', title:'Prove It Over Time', img:'Prove It Over Time_ Governance Atlas.png',
   script:'A responsible window decision is not complete merely because a command was issued. An environmental integrity record should connect the request, admitted observations, governing rule, actor standing, outcome, actual equipment state, post-action environmental verification, exceptions, repairs, reauthorization and future assessment. The illustrated completed record is hypothetical and does not imply any facility has been commissioned. Independent reviewers should be able to challenge every material claim.',
   learned:'A lifetime record preserves what was proposed, why it was authorized or held, what happened, and what must be reviewed next.', next:'Take the independent examination and inspect the companion PDF.'}
];
const questions=[
  'A sensor exceeds a proposed threshold but calibration is uncertain. What would resolve an evidence HOLD?',
  'A vendor requests automatic closure without documented delegation. Is the request HELD or DENIED, and by whom?',
  'A discretionary HOLD coincides with separately authorized smoke control. How is the emergency path preserved?',
  'What exactly must be revalidated before a Lagos rule or delegation can be used in a Canadian library?',
  'Which post-action measurements, operator attestations and exceptions prove the intended outcome was achieved?'
];
const steps=[
  ['OBSERVE','Preserve actual indoor and outdoor conditions, source identity, timestamps and uncertainty.'],
  ['INTERPRET','Assess particle exposure alongside ventilation, CO2, comfort and safety tradeoffs.'],
  ['AUTHORIZE','Verify the applicable governing instrument and the requesting actor\'s standing.'],
  ['DECIDE','Return ALLOW, HOLD, DENY or ESCALATE for the specific window command.'],
  ['VERIFY','Record commanded and observed state, environmental outcome, exceptions and reassessment.']
];
export default function WindowDecisionShowroom() {
 return <main style={{minHeight:'100vh',color:'#eef8fc',background:'radial-gradient(ellipse at 65% 0%, #173c58 0%, #071d2e 34%, #071420 78%)',fontFamily:'Arial,Helvetica,sans-serif'}}>
  <div style={{maxWidth:1190,margin:'auto',padding:'24px 18px 90px'}}>
   <nav style={{display:'flex',flexWrap:'wrap',gap:19,borderBottom:'1px solid #365365',paddingBottom:18,fontSize:14}}>
    <Link href="/showrooms" style={{color:'#a9e8ee'}}>← All Showrooms</Link>
    <Link href="/showrooms/air-safe-healing-sanctuary" style={{color:'#a9e8ee'}}>Air-Safe Healing Sanctuary</Link>
    <Link href="/showrooms/onuma" style={{color:'#a9e8ee'}}>ONUMA Context</Link>
   </nav>
   <header style={{padding:'54px 0 27px'}}>
    <p style={{color:'#a0dce7',fontSize:12,letterSpacing:2.3,fontWeight:800}}>TA-14 GOVERNANCE WORKSHOP ATLAS · EIGHT-LESSON EDUCATIONAL EXAMINATION</p>
    <h1 style={{fontSize:'clamp(37px,6vw,68px)',lineHeight:1.06,letterSpacing:-1.4,margin:'15px 0'}}>WHEN THE AIR OUTSIDE<br/><span style={{color:'#f4ce72'}}>BECOMES THE THREAT</span></h1>
    <p style={{fontSize:'clamp(19px,2.4vw,28px)',lineHeight:1.45,color:'#d0e6f0'}}>From environmental measurement to authorized building action</p>
    <p style={{fontSize:17,lineHeight:1.85,maxWidth:975,color:'#bed4df'}}>A virtual public library begins in Lagos, Nigeria, with a single question: should its windows be open or closed when outdoor pollution is a concern? The same building is then moved to Canada. Observe how evidence, governing instructions, standing and environmental consequences must be re-established before an action can be permitted.</p>
    <div style={{margin:'25px 0',border:'1px solid #9b8154',background:'#342d1d',borderRadius:13,padding:'17px 21px',lineHeight:1.7,color:'#f4e6c5'}}><strong>HYPOTHETICAL EDUCATIONAL EXERCISE.</strong> No real Lagos or Canadian facility, live data, approved control sequence, verified legal duty, certified performance, partner endorsement or operational deployment is asserted. Measurements, statuses and thresholds shown in the artwork are illustrative.</div>
    <div style={{display:'flex',flexWrap:'wrap',gap:12}}>
     <a href={pdf} target="_blank" rel="noopener noreferrer" style={{background:'#f2d17c',color:'#152536',fontWeight:800,padding:'14px 19px',borderRadius:9,textDecoration:'none'}}>Download the enhanced 9-page PDF ↗</a>
     <a href="#lessons" style={{color:'#d4edf1',border:'1px solid #8eb9c7',padding:'14px 19px',borderRadius:9,textDecoration:'none'}}>Explore the eight lessons ↓</a>
    </div>
   </header>
   <section style={{background:'#103244',border:'1px solid #416b7b',borderRadius:18,padding:'25px 29px',margin:'18px 0 40px'}}>
    <p style={{fontSize:12,letterSpacing:2,fontWeight:800,color:'#97dce0'}}>THE CONSEQUENCE BOUNDARY</p>
    <h2 style={{fontSize:'clamp(22px,3.2vw,35px)',lineHeight:1.35}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</h2>
    <p style={{lineHeight:1.8,color:'#c2dbe2'}}>Atmospheric Integrity Records (AIR) support attributable observations. Environmental Integrity Governance (EIG) examines combined environmental effects. Admissible Execution Architecture (AEA) evaluates whether a specified action can proceed now. A sensor observation or AI forecast never, by itself, confers execution authority.</p>
   </section>
   <section id="lessons">
    <p style={{fontSize:12,letterSpacing:2,color:'#a7e9eb',fontWeight:800}}>THE GUIDED WORKSHOP</p>
    <h2 style={{fontSize:35}}>Eight distinct questions. One consequential action.</h2>
    <div style={{display:'flex',gap:9,flexWrap:'wrap',marginBottom:24}}>{lessons.map(s=><a key={s.n} href={'#lesson-'+s.n} style={{border:'1px solid #557989',borderRadius:8,padding:'9px 13px',color:'#c1eaeb',textDecoration:'none'}}>{s.n}</a>)}</div>
    {lessons.map((s,i)=><article key={s.n} id={'lesson-'+s.n} style={{borderTop:'1px solid #385567',padding:'33px 0 42px',scrollMarginTop:20}}>
     <p style={{color:'#f2ce76',fontSize:12,letterSpacing:2,fontWeight:800}}>LESSON {s.n} / 08</p>
     <h3 style={{fontSize:'clamp(27px,3.8vw,42px)',margin:'10px 0 19px'}}>{s.title}</h3>
     <img src={'/'+encodeURIComponent(s.img)} alt={'Hypothetical TA-14 governance workshop infographic, lesson '+s.n+': '+s.title} loading={i===0?'eager':'lazy'} style={{width:'100%',height:'auto',display:'block',borderRadius:15,border:'1px solid #4e6a7a'}}/>
     <div style={{margin:'15px 0'}}><Samantha text={s.script}/></div>
     <p style={{fontSize:17,lineHeight:1.85,color:'#cbdfe8',maxWidth:1060}}>{s.script}</p>
     <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:15}}>
      <div style={{background:'#102d39',border:'1px solid #356374',padding:21,borderRadius:13}}><strong style={{fontSize:12,letterSpacing:1.4,color:'#9fe7e4'}}>WHAT YOU LEARNED</strong><p style={{lineHeight:1.7}}>{s.learned}</p></div>
      <div style={{background:'#15273a',border:'1px solid #3e5b74',padding:21,borderRadius:13}}><strong style={{fontSize:12,letterSpacing:1.4,color:'#a9d4f3'}}>WHAT COMES NEXT</strong><p style={{lineHeight:1.7}}>{s.next}</p>{i<7&&<a href={'#lesson-'+lessons[i+1].n} style={{color:'#a8e8ee'}}>Continue to lesson {lessons[i+1].n} ↓</a>}</div>
     </div>
    </article>)}
   </section>
   <section style={{margin:'26px 0',padding:26,borderRadius:17,background:'#102e3f',border:'1px solid #477481'}}>
    <p style={{fontSize:12,letterSpacing:2,color:'#f1d483',fontWeight:800}}>FIVE-STAGE WINDOW DECISION</p>
    <h2 style={{fontSize:30}}>From observation to verified consequence</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:12}}>
     {steps.map(([title,body],i)=><div key={title} style={{background:'#173b4c',borderRadius:12,padding:'17px',border:'1px solid #3a6475'}}><strong style={{color:'#f2d17c'}}>{String(i+1).padStart(2,'0')} / {title}</strong><p style={{lineHeight:1.65}}>{body}</p></div>)}
    </div>
    <p style={{color:'#d3e6eb',lineHeight:1.8}}>Worked hypothetical: the outdoor sensor has uncertain calibration, a model recommends closing windows, and no valid vendor delegation is documented. <strong>HOLD the discretionary vendor command</strong> pending review and reauthorization. This does not prove that leaving windows open is safe and must not obstruct separately authorized life-safety actions.</p>
   </section>
   <section style={{border:'1px solid #49687a',background:'#0b2031',borderRadius:17,padding:27,margin:'33px 0'}}>
    <p style={{color:'#a6e3e8',fontSize:12,letterSpacing:2,fontWeight:800}}>OPEN INDEPENDENT EXAMINATION</p>
    <h2 style={{fontSize:31}}>Challenge the evidence and the authority</h2>
    <ol style={{lineHeight:1.85,paddingLeft:24,color:'#d2e6ed'}}>{questions.map(q=><li key={q} style={{padding:'6px 0'}}>{q}</li>)}</ol>
    <h3>What the workshop does not establish</h3><p style={{lineHeight:1.8,color:'#c6dce6'}}>It does not establish site measurements, local legal requirements, actual control integration, certified engineering design, commissioning, public-health outcomes, an approved partnership or a commercial commitment. The goal is to make the unanswered questions clear enough for independent testing.</p>
    <a href={pdf} target="_blank" rel="noopener noreferrer" style={{fontWeight:800,color:'#f2d681'}}>Read the complete governance technical companion PDF ↗</a>
   </section>
   <footer style={{paddingTop:23,borderTop:'1px solid #3b5969',color:'#a6c3cf',lineHeight:1.8}}>TA-14 Authority Governance Institution · Independent educational examination. Scenario adapted from Michael Bordenaro's November 12, 2026 proposed Become the Building workshop exercise; this room is not an approved joint publication or institutional endorsement.</footer>
  </div>
 </main>
}
