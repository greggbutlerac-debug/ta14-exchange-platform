import Link from 'next/link';
import Image from 'next/image';
import Samantha from './Samantha';

export const metadata={
  title:'Arizona IAQ · Preserving the Building as Evidence | TA14',
  description:'A long-form public technical examination of environmental evidence continuity, authority, execution, and outcome.'
};

const chain=[
  {n:'01',t:'REALITY',b:'What physically existed in the building at the time?'},
  {n:'02',t:'RECORD',b:'What was actually observed, measured, photographed, logged, sampled, or otherwise preserved?'},
  {n:'03',t:'CONTINUITY',b:'Can the surviving record still be connected reliably to the original place, time, instrument, system state, and event?'},
  {n:'04',t:'ADMISSIBILITY',b:'Is that evidence sufficient and appropriate for the specific consequence now being proposed?'},
  {n:'05',t:'BINDING',b:'What applicable rule, obligation, contract, standard, policy, or authority actually attaches?'},
  {n:'06',t:'COMMIT',b:'Has the final decision boundary been legitimately crossed?'},
  {n:'07',t:'EXECUTION',b:'What action was actually caused in the real world?'},
  {n:'08',t:'OUTCOME',b:'What changed, and what new reality must now be recorded?'}
];

const evidence=[
  'raw sensor or sample observations','timestamp and duration','physical location and zone identity','instrument make, model and identifier','calibration or verification status','measurement uncertainty','outdoor environmental context','HVAC operating state','occupancy and activity','doors, windows and pressure relationships','maintenance or intervention history','chain of custody or record provenance','subsequent edits or transformations','professional interpretation','decision authority','executed intervention','post-condition verification'
];

const audiences=['Environmental consultants','Industrial hygienists','Building scientists','Mechanical engineers','Commissioning professionals','Controls professionals','Attorneys','Insurers','Owners and operators','Researchers','Government agencies','Standards organizations'];

export default function Page(){
  return <main style={{minHeight:'100vh',background:'linear-gradient(180deg,#02070c 0%,#061019 48%,#02070c 100%)',color:'#edf5f8',fontFamily:'Arial,sans-serif'}}>
    <div style={{maxWidth:1180,margin:'auto',padding:'0 22px'}}>
      <nav style={{padding:'28px 0',borderBottom:'1px solid #18303b',display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
        <Link href="/showrooms/environmental-atmospheric" style={{color:'#70dcff',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL & ATMOSPHERIC</Link>
        <Link href="/showrooms/arizona-building-as-evidence" style={{color:'#efc86c',textDecoration:'none',fontWeight:900}}>ARIZONA BUILDING AS EVIDENCE →</Link>
      </nav>

      <header style={{padding:'96px 0 64px',maxWidth:1040}}>
        <p style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:2.3}}>PUBLIC TECHNICAL EXAMINATION · ARIZONA · IAQ EVIDENCE CONTINUITY</p>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(52px,8vw,94px)',lineHeight:.92,margin:'20px 0 30px',letterSpacing:'-.03em'}}>PRESERVING THE<br/><span style={{color:'#efc86c'}}>BUILDING AS EVIDENCE</span></h1>
        <p style={{fontFamily:'Georgia,serif',fontSize:'clamp(24px,3vw,38px)',lineHeight:1.25,maxWidth:980,margin:'0 0 28px'}}>A building can change in minutes. The consequences of what happened inside it can be argued months or years later.</p>
        <p style={{maxWidth:880,color:'#a9bbc3',fontSize:19,lineHeight:1.8}}>The technical problem is not simply whether someone collected a reading. It is whether enough trustworthy context survives for another qualified person—who was not there—to determine what actually existed, what changed, who was authorized to act, and what happened afterward.</p>
        <Samantha text="Welcome to the Arizona indoor air quality evidence continuity examination. A building can change in minutes, while questions about what happened inside it may remain for months or years. This showroom asks what evidence must survive so a qualified person who was not present can later reconstruct the original condition, distinguish observation from interpretation, determine what authority actually applied, and examine the consequence that followed. Follow the Monday-through-six-months-later scenario, then examine the seventeen contextual elements and the eight-stage TA14 consequence boundary. The purpose is not to declare that every investigation requires every possible record. The purpose is to make the evidentiary question explicit before the original physical reality disappears."/>
      </header>

      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16,marginBottom:42}}>
        <div style={{padding:30,border:'1px solid #365366',borderRadius:20,background:'#07131c'}}>
          <small style={{color:'#efc86c',fontWeight:900,letterSpacing:1.5}}>THE CORE PROBLEM</small>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:34,lineHeight:1.1}}>The building does not remain still.</h2>
          <p style={{color:'#9fb4be',lineHeight:1.75}}>Filters are changed. Dampers move. Equipment cycles. Spaces are cleaned. Occupancy changes. Weather shifts. Materials are removed. Controls are rewritten. The original condition can disappear before anyone realizes how important it was.</p>
        </div>
        <div style={{padding:30,border:'1px solid #365366',borderRadius:20,background:'#07131c'}}>
          <small style={{color:'#70dcff',fontWeight:900,letterSpacing:1.5}}>THE LATER QUESTION</small>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:34,lineHeight:1.1}}>What actually happened here?</h2>
          <p style={{color:'#9fb4be',lineHeight:1.75}}>Later, an owner, consultant, attorney, insurer, physician, researcher, agency, contractor, or commissioning professional may need an answer. By then, the physical state they need to examine may no longer exist.</p>
        </div>
      </section>

      <div style={{margin:'34px 0 8px',border:'1px solid #244654',borderRadius:18,overflow:'hidden',background:'#041019'}}><Image src="/TA14_Arizona_IAQ_01_When_The_Building_Changes_What_Survives.png" alt="TA14 Arizona IAQ timeline showing how the same building can change before later examination" width={1536} height={1024} sizes="(max-width: 1180px) 100vw, 1136px" style={{width:'100%',height:'auto',display:'block'}} /></div>
      <Samantha text="Explain visual one. Start on Monday. The occupied building has a real physical condition, whether or not anyone has fully understood it yet. On Tuesday, people begin converting that reality into evidence: readings, photographs, samples, trends, notes, equipment states, and observations. Those records are not the building itself. They are representations of what existed at a particular time and place. On Wednesday, someone changes the building. A filter may be replaced, ventilation adjusted, equipment repaired, controls rewritten, materials removed, or a space cleaned. By Friday, the original condition may be gone. Six months later, a new person may need to determine what existed on Monday, what evidence supported the interpretation, who had authority to act, what intervention actually occurred, and whether it worked. The visual is teaching a continuity problem. Physical reality does not wait for a future dispute. If the evidence chain is not preserved while the event is happening, later expertise cannot recreate missing facts simply by being expert. This is why the phrase something had to survive matters. The surviving record must be sufficient for the later question being asked, not merely convenient for the person who created it."/>

      <section style={{padding:'56px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:2}}>A SIMPLE SCENARIO</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,56px)',margin:'10px 0 28px'}}>Monday existed. Friday looks different.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:12}}>
          {[['MONDAY','An occupied space shows an environmental condition that may matter.'],['TUESDAY','Measurements, photos, samples, trends, observations or consultant notes are created.'],['WEDNESDAY','Maintenance or an operational intervention changes the building.'],['FRIDAY','The condition has changed or disappeared.'],['SIX MONTHS LATER','Someone asks what actually existed on Monday and what justified the intervention.']].map(([d,b])=><div key={d} style={{padding:24,border:'1px solid #244654',borderRadius:16,background:'#041019'}}><b style={{color:'#efc86c',fontSize:12,letterSpacing:1.3}}>{d}</b><p style={{color:'#b1c2c9',lineHeight:1.65}}>{b}</p></div>)}
        </div>
        <p style={{fontFamily:'Georgia,serif',fontSize:27,lineHeight:1.4,maxWidth:900,marginTop:34}}>At that point, memory is not enough. A screenshot may not be enough. A summarized report may not be enough. The building itself can no longer show Monday's reality. <span style={{color:'#efc86c'}}>Something had to survive.</span></p>
      </section>

      <section style={{padding:'56px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#efc86c',fontSize:11,fontWeight:900,letterSpacing:2}}>WHAT MAY NEED TO SURVIVE</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,56px)',margin:'10px 0 18px'}}>A number without context is not the whole event.</h2>
        <p style={{maxWidth:900,color:'#9fb4be',fontSize:17,lineHeight:1.8}}>TA14 is not declaring that every investigation must preserve every item below. The question is whether a defensible mechanism can determine which contextual elements are necessary for the later use being proposed.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:10,marginTop:28}}>{evidence.map((x,i)=><div key={x} style={{padding:'16px 18px',border:'1px solid #193847',borderRadius:12,background:'#06121a',color:'#c7d5da'}}><span style={{color:'#70dcff',fontWeight:900,marginRight:10}}>{String(i+1).padStart(2,'0')}</span>{x}</div>)}</div>
      </section>

      <div style={{margin:'34px 0 8px',border:'1px solid #244654',borderRadius:18,overflow:'hidden',background:'#041019'}}><Image src="/TA14_Arizona_IAQ_02_What_Must_Survive.png" alt="TA14 Arizona IAQ evidence continuity visual showing contextual elements that may need to survive" width={1536} height={1024} sizes="(max-width: 1180px) 100vw, 1136px" style={{width:'100%',height:'auto',display:'block'}} /></div>
      <Samantha text="Explain visual two. The point of this visual is that an indoor air quality number rarely carries its full meaning by itself. Imagine a carbon dioxide value, a particulate reading, a humidity value, a laboratory result, or a pressure measurement. To examine it later, we may need to know when it was taken, for how long, exactly where, with which instrument, whether that instrument had a current verification or calibration basis, and what uncertainty belongs to the measurement. We may also need the outdoor condition, HVAC operating state, occupancy, activity, doors, windows, pressure relationships, and maintenance history. Then another layer begins: provenance. Can we show where the record came from, whether it was transformed, summarized, corrected, or interpreted, and distinguish the raw observation from the professional conclusion? Finally, if the evidence supported a decision, who possessed decision authority, what intervention was actually executed, and was the post-condition verified? TA14 is not saying all seventeen elements are mandatory in every case. It is saying the later use must determine what context is necessary. The more serious the proposed consequence, the less defensible it becomes to let essential context disappear."/>

      <section style={{padding:'62px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:2}}>THE CRITICAL DISTINCTION</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(36px,5vw,60px)',lineHeight:1.08,maxWidth:1000}}>Observation is not interpretation.<br/>Interpretation is not authority.<br/><span style={{color:'#efc86c'}}>Capability is not permission.</span></h2>
        <p style={{maxWidth:900,color:'#9fb4be',fontSize:17,lineHeight:1.8}}>A sensor can observe. A consultant can interpret. A control system can execute. An owner can instruct. A regulator can impose obligations. Those are not interchangeable roles. Before evidence becomes consequence, the route between them must remain inspectable.</p>
      </section>

      <div style={{margin:'34px 0 8px',border:'1px solid #244654',borderRadius:18,overflow:'hidden',background:'#041019'}}><Image src="/TA14_Arizona_IAQ_03_Observation_Interpretation_Authority_Permission.png" alt="TA14 distinction between observation, interpretation, authority and permission" width={1536} height={1024} sizes="(max-width: 1180px) 100vw, 1136px" style={{width:'100%',height:'auto',display:'block'}} /></div>
      <Samantha text="Explain visual three. This visual separates four things that are often collapsed into one. Observation asks what was detected or recorded. Interpretation asks what a qualified person believes that observation means in context. Authority asks what rule, contract, ownership right, professional duty, policy, statute, order, or other legitimate source gives someone standing to make a particular decision. Permission asks whether this specific consequence may actually cross into reality now. Those are different questions. A sensor may be technically valid without being capable of interpreting itself. A consultant may make a technically sound recommendation without possessing the owner's execution authority. A control system may be capable of changing ventilation, temperature, pressure, or equipment state without being authorized to make every change it is technically capable of making. This is the heart of Capability does not equal Authority and Understanding does not equal Permission. TA14 keeps these layers separate so a later examiner can see where evidence ended, where interpretation began, what authority attached, and how permission for the actual consequence was established."/>

      <section style={{padding:'58px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#efc86c',fontSize:11,fontWeight:900,letterSpacing:2}}>THE TA14 CONSEQUENCE BOUNDARY</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,56px)',lineHeight:1.18,maxWidth:1050}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:14,marginTop:34}}>
          {chain.map(x=><article key={x.n} style={{padding:24,border:'1px solid #244654',borderRadius:16,background:'#06121a'}}><small style={{color:'#70dcff',fontWeight:900}}>{x.n}</small><h3 style={{fontFamily:'Georgia,serif',fontSize:25,margin:'8px 0'}}>{x.t}</h3><p style={{color:'#98adb6',lineHeight:1.65,marginBottom:0}}>{x.b}</p></article>)}
        </div>
      </section>

      <div style={{margin:'34px 0 8px',border:'1px solid #244654',borderRadius:18,overflow:'hidden',background:'#041019'}}><Image src="/TA14_Arizona_IAQ_04_Reality_To_Outcome_Consequence_Boundary.png" alt="TA14 consequence boundary from Reality through Record, Continuity, Admissibility, Binding, Commit, Execution and Outcome" width={1536} height={1024} sizes="(max-width: 1180px) 100vw, 1136px" style={{width:'100%',height:'auto',display:'block'}} /></div>
      <Samantha text="Explain visual four. This is the full consequence path. Reality comes first: what physically existed. Record asks what part of that reality was preserved. Continuity asks whether the surviving evidence can still be connected reliably to the original time, place, instrument, system state, and event. Admissibility asks whether that evidence is sufficient and appropriate for the specific consequence being proposed now. Binding asks what applicable authority actually attaches: perhaps a contract, policy, standard, legal obligation, ownership right, professional duty, or other governing source. Commit is the decision boundary. This is where a proposed consequence must not cross merely because a system is capable of acting. The governing question is: Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW? If yes, execution is the real-world act. Outcome then asks what actually changed. That outcome becomes new reality, and the record begins again. This is why TA14 says no admissible evidence, no admissible execution. The architecture is not finished when someone makes a decision. It closes the loop by preserving what actually happened after the decision became real."/>

      <section style={{padding:'58px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#efc86c',fontSize:11,fontWeight:900,letterSpacing:2}}>WHY ARIZONA IS THE EXAMINATION SURFACE</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,56px)',margin:'10px 0 20px'}}>Arizona is the location of the open technical question—not a shortcut to a legal conclusion.</h2>
        <p style={{maxWidth:930,color:'#9fb4be',fontSize:17,lineHeight:1.8}}>This examination arose from Arizona-focused professional outreach concerning preservation of indoor-environmental conditions as evidence. TA14 is therefore keeping the question anchored to Arizona while deliberately avoiding an unsupported claim that Arizona law, regulation, or professional practice already requires the TA14 architecture described here.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:14,marginTop:26}}>
          {[['THE JURISDICTION MATTERS','Applicable duties, standards, contracts, professional practices and legal consequences can depend on the jurisdiction and the specific use of the evidence.'],['THE TECHNICAL QUESTION REMAINS OPEN','What must be preserved depends on what a later decision is asking the surviving record to prove.'],['THE INVITATION IS SPECIFIC','Arizona practitioners are invited to identify the established mechanism, correct the framing, or submit a better evidentiary path.']].map(([t,b])=><article key={t} style={{padding:25,border:'1px solid #244654',borderRadius:16,background:'#06121a'}}><h3 style={{fontFamily:'Georgia,serif',fontSize:24,color:'#efc86c'}}>{t}</h3><p style={{color:'#9fb4be',lineHeight:1.7}}>{b}</p></article>)}
        </div>
        <Samantha text="Why Arizona? Because this open examination grew from Arizona-focused professional outreach about preserving a building's indoor environmental condition as evidence. That does not mean TA14 is claiming Arizona law requires this architecture. The jurisdiction matters because applicable duties, contracts, standards, professional practices, and later legal uses may differ. The technical question remains narrower and testable: for the consequence being proposed, what evidence and context must survive, and what established Arizona mechanism already governs that preservation if one exists? Arizona practitioners are invited to identify it, correct this framing, or bring forward a better mechanism."/>
      </section>

      <section style={{padding:'58px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:2}}>WHERE THE RECORD CAN FAIL</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,56px)',margin:'10px 0 24px'}}>The risk is not only a bad sensor.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:14}}>
          {[['CONTEXT LOSS','The value survives, but the location, HVAC state, occupancy, outdoor condition, or instrument context does not.'],['INTERPRETATION COLLAPSE','A later conclusion is treated as though it were the original raw observation.'],['AUTHORITY COLLAPSE','A technically reasonable recommendation is treated as automatic permission to cause a real-world consequence.'],['OUTCOME LOSS','An intervention is recorded, but nobody preserves whether it actually produced the claimed result.']].map(([t,b])=><article key={t} style={{padding:26,border:'1px solid #4b3540',borderRadius:16,background:'#130b10'}}><h3 style={{fontFamily:'Georgia,serif',fontSize:25,color:'#f0d0d6'}}>{t}</h3><p style={{color:'#bda9af',lineHeight:1.7}}>{b}</p></article>)}
        </div>
      </section>

      <section style={{padding:'62px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#efc86c',fontSize:11,fontWeight:900,letterSpacing:2}}>THE PROFESSION IS INVITED TO CHALLENGE THIS</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(36px,5vw,60px)',lineHeight:1.1}}>We are not asking for agreement.<br/>We are asking for an answer that survives examination.</h2>
        <p style={{maxWidth:920,color:'#9fb4be',fontSize:17,lineHeight:1.8}}>If an established standard, protocol, evidentiary method, chain-of-custody practice, commissioning record, forensic procedure, or legal mechanism already solves this problem, identify it. If TA14 has framed the problem incorrectly, show where. If the architecture is incomplete, improve it. If something better already exists, bring it forward.</p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',margin:'26px 0 6px'}}><Link href="/workspace/ai-governance/reviews/submit" style={{display:'inline-block',padding:'14px 18px',borderRadius:12,background:'#70dcff',color:'#021018',fontWeight:900,textDecoration:'none'}}>SUBMIT A TECHNICAL RESPONSE →</Link><Link href="/workspace/ai-governance/reviews" style={{display:'inline-block',padding:'14px 18px',borderRadius:12,border:'1px solid #365366',color:'#d7e8ee',fontWeight:900,textDecoration:'none'}}>REVIEW THE RESPONSE PATH</Link></div>
        <p style={{maxWidth:900,color:'#78919b',fontSize:13,lineHeight:1.7}}>Use the governed submission surface for an independent review, evidence challenge, factual correction, technical comment, replication request, or other attributable response. A submission remains attributable to its submitter and does not become a TA14 finding merely because it is received.</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:9,marginTop:28}}>{audiences.map(x=><span key={x} style={{padding:'10px 13px',border:'1px solid #244654',borderRadius:999,color:'#c5d4da',fontSize:12,fontWeight:800}}>{x}</span>)}</div>
      </section>

      <section style={{padding:'70px 0',borderTop:'1px solid #18303b',textAlign:'center'}}>
        <p style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:2}}>THE QUESTION STILL STANDING</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(38px,6vw,70px)',lineHeight:1.05,maxWidth:1000,margin:'18px auto 28px'}}>What must survive so yesterday's environmental reality can still be examined tomorrow?</h2>
        <p style={{fontFamily:'Georgia,serif',fontSize:'clamp(22px,3vw,32px)',lineHeight:1.4,maxWidth:980,margin:'0 auto',color:'#efc86c'}}>And before that surviving evidence causes anything in the real world: does the proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p>
      </section>

      <footer style={{padding:'40px 0 60px',borderTop:'1px solid #142832',color:'#647d88',fontSize:10,lineHeight:1.7}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT PUBLIC TECHNICAL EXAMINATION · NO CLAIM OF GOVERNMENTAL OR THIRD-PARTY ENDORSEMENT · TECHNICAL QUESTIONS REMAIN OPEN TO CHALLENGE</footer>
    </div>
  </main>
}