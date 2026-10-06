import Link from 'next/link';
import Samantha from './Samantha';

export const metadata={
  title:'Evidence-Governed HVAC Service | TA14 Industry Examination Showroom',
  description:'Open TA14 showroom examining the evidence, authority, execution and outcome boundaries of HVAC diagnostic and service practice.'
};

const stages=[
  ['01','EVIDENCE','Preserve the relevant pre-intervention state before service changes it.'],
  ['02','DIAGNOSTIC DETERMINATION','Separate what was directly observed from what was inferred.'],
  ['03','PROPOSED INTERVENTION','State what is proposed to change before execution, except within the bounded urgent path.'],
  ['04','INTERVENTION AUTHORIZATION','Establish who or what permits the proposed intervention.'],
  ['05','BOUNDED EXECUTION','Keep the work performed inside the authorized intervention.'],
  ['06','POST-INTERVENTION VERIFICATION','Test what remains validly evaluable after the intervention.'],
  ['07','OUTCOME','Classify only what the available evidence defensibly supports.']
];

const outcomes=[
  ['IMPROVED','Evidence supports improvement relative to the declared condition.'],
  ['RESTORED','Evidence supports restoration to the declared target or prior acceptable condition.'],
  ['UNCHANGED','Evidence supports no material change in the declared condition.'],
  ['DEGRADED','Evidence supports deterioration in the declared condition.'],
  ['PARTIALLY RESOLVED','Evidence supports resolution of part, but not all, of the declared problem.'],
  ['UNRESOLVED','Evidence supports that the declared problem remains unresolved.'],
  ['INDETERMINATE','Available evidence is insufficient to establish another outcome state defensibly.']
];

const narration=[
  'Section one starts with the executive proposition. HVAC service changes physical reality. Once an intervention occurs, parts of the pre-intervention state may no longer be reliably reconstructable. The framework therefore asks five questions: what was observed, what was determined, what was authorized, what was changed, and what evidence establishes the outcome.',
  'Section two shows the seven-boundary architecture. Evidence supports diagnostic determination. Determination supports a proposed intervention. Authorization permits bounded execution. Verification supports outcome. Progression is not permission. Entry is not diagnosis. Diagnosis is not intervention authorization. Capability is not authority.',
  'Section three examines the evidence boundary. Preserve the relevant pre-intervention state only to the extent necessary to support the diagnostic determination, proposed intervention, authorization, verification, or outcome. More data is not automatically more admissible evidence. Minimum does not mean optional.',
  'Section four examines authorization and execution. A proposed intervention must be identifiable. Authorization stands on evidence connecting the asset, observed condition, diagnostic determination, proposed intervention, applicable authority and execution relationship. Routine service may use prior delegation, but prior delegation is not unlimited authority.',
  'Section five is the urgent protective path. The framework does not require a technician to allow preventable damage, unsafe conditions or materially worsening conditions just to complete an ideal record. Urgent does not mean ungoverned. Preserve what can reasonably be preserved, record why the normal sequence was impracticable, bound the action, and verify afterward.',
  'Section six is verification. Completion is not proof of outcome. Verification propositions should be established before intervention when reasonably practicable. Where a proposition can no longer be evaluated after intervention, the record identifies that limitation rather than inventing certainty.',
  'Section seven is outcome classification. Improved, restored, unchanged, degraded, partially resolved, unresolved and indeterminate are distinct states. Indeterminate is not failure. It is the defensible answer when the available evidence cannot establish another result.',
  'Section eight is the examination boundary. This is a proposed industry framework, not an adopted ASHRAE standard and not a claim of consensus. The invitation is to challenge burden, duplication, safety, authority, testability and conflict with existing standards. The governing question remains: does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality now?'
];

export default function Page(){
  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 78% 4%,rgba(72,206,233,.13),transparent 25%),linear-gradient(180deg,#02070b,#06131b 45%,#02070b)',color:'#edf7f8',fontFamily:'Arial,sans-serif'}}>
    <div style={{maxWidth:1180,margin:'0 auto',padding:'0 22px'}}>
      <nav style={{padding:'28px 0',borderBottom:'1px solid rgba(112,220,255,.16)',display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
        <Link href="/showrooms" style={{color:'#70dcff',fontWeight:900,textDecoration:'none'}}>← ALL SHOWROOMS</Link>
        <span style={{fontSize:10,fontWeight:900,letterSpacing:1.8,color:'#78909b'}}>BUILDINGS & HVAC · OPEN INDUSTRY EXAMINATION</span>
      </nav>

      <header style={{padding:'88px 0 62px'}}>
        <p style={{color:'#71f2b6',fontSize:11,fontWeight:900,letterSpacing:2.1}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · PROPOSED / DRAFT</p>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(52px,8.8vw,104px)',lineHeight:.91,letterSpacing:'-.045em',margin:'18px 0 28px'}}>EVIDENCE-GOVERNED<br/><span style={{color:'#70dcff'}}>HVAC SERVICE.</span></h1>
        <p style={{maxWidth:980,fontFamily:'Georgia,serif',fontSize:'clamp(23px,3vw,37px)',lineHeight:1.3,color:'#dbe9ec'}}>A proposed industry framework for preserving reality from diagnosis through outcome.</p>
        <div style={{marginTop:28,padding:'22px 24px',border:'1px solid rgba(239,200,108,.36)',borderRadius:18,background:'rgba(50,38,8,.12)',color:'#cfc4a1',lineHeight:1.7}}>
          <b style={{color:'#efc86c'}}>DRAFT FOR INDUSTRY EXAMINATION.</b> This is not an ASHRAE Standard, Guideline, addendum, interpretation, committee document, or endorsed publication. No ASHRAE endorsement is implied. Independent review is deferred and not completed.
        </div>
      </header>

      <section style={{padding:'46px 0 66px',borderTop:'1px solid #17313b'}}>
        <p style={{color:'#70dcff',fontSize:10,fontWeight:900,letterSpacing:1.8}}>01 · EXECUTIVE PROPOSITION</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(42px,6vw,68px)',lineHeight:1.02,margin:'14px 0 18px'}}>HVAC service changes physical reality.</h2>
        <p style={{maxWidth:920,color:'#a8bec6',fontSize:19,lineHeight:1.8}}>Once an intervention occurs, portions of the pre-intervention state may no longer be reliably reconstructable. The question is not only whether the technician fixed it. The question is whether the record can establish what happened before, during, and after the consequence.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:12,marginTop:30}}>
          {['WHAT WAS OBSERVED?','WHAT WAS DETERMINED?','WHAT WAS AUTHORIZED?','WHAT WAS CHANGED?','WHAT EVIDENCE ESTABLISHES THE OUTCOME?'].map((q,i)=><div key={q} style={{padding:22,border:'1px solid rgba(112,220,255,.18)',borderRadius:15,background:'rgba(4,18,27,.72)'}}><span style={{display:'block',color:'#70dcff',fontWeight:900,fontSize:10,marginBottom:10}}>0{i+1}</span><b style={{fontSize:14,lineHeight:1.45}}>{q}</b></div>)}
        </div>
        <Samantha text={narration[0]}/>
      </section>

      <section style={{padding:'58px 0',borderTop:'1px solid #17313b'}}>
        <p style={{color:'#71f2b6',fontSize:10,fontWeight:900,letterSpacing:1.8}}>02 · THE SEVEN-BOUNDARY ARCHITECTURE</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(40px,5.6vw,66px)',margin:'14px 0 24px'}}>Progression is not permission.</h2>
        <div style={{display:'grid',gap:10}}>
          {stages.map(([n,t,d],i)=><article key={n} style={{display:'grid',gridTemplateColumns:'72px minmax(180px,.7fr) 1.6fr',gap:18,alignItems:'center',padding:'18px 20px',border:'1px solid rgba(112,220,255,.14)',borderRadius:15,background:i===3?'rgba(239,200,108,.08)':'rgba(4,18,27,.68)'}}>
            <b style={{color:i===3?'#efc86c':'#70dcff',fontSize:12}}>{n}</b><strong style={{fontSize:15}}>{t}</strong><span style={{color:'#91a8b1',lineHeight:1.55,fontSize:13}}>{d}</span>
          </article>)}
        </div>
        <div style={{marginTop:24,padding:26,border:'1px solid rgba(239,200,108,.28)',borderRadius:18,background:'rgba(52,39,7,.1)',fontSize:'clamp(18px,2.3vw,28px)',fontWeight:900,lineHeight:1.5}}>
          ENTRY ≠ DIAGNOSIS<br/>DIAGNOSIS ≠ INTERVENTION AUTHORIZATION<br/>CAPABILITY ≠ AUTHORITY
        </div>
        <Samantha text={narration[1]}/>
      </section>

      <section style={{padding:'58px 0',borderTop:'1px solid #17313b'}}>
        <p style={{color:'#70dcff',fontSize:10,fontWeight:900,letterSpacing:1.8}}>03 · EVIDENCE BEFORE INTERVENTION</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(40px,5.6vw,66px)',margin:'14px 0 18px'}}>Preserve what the consequence could erase.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:14,marginTop:28}}>
          {[
            ['RELEVANT PRE-STATE','Preserve the state necessary to support determination, authorization, verification, or outcome.'],
            ['OBSERVED VS. INFERRED','Keep direct observation distinguishable from diagnostic inference.'],
            ['MINIMUM ADMISSIBLE RECORD','A smaller record may be sufficient, but minimum does not mean optional.'],
            ['DECISION-RELEVANT EVIDENCE','A record is not mandatory merely because it can be collected.']
          ].map(([t,d])=><article key={t} style={{padding:24,border:'1px solid rgba(112,220,255,.16)',borderRadius:16,background:'#06131b'}}><h3 style={{fontSize:18,margin:'0 0 10px'}}>{t}</h3><p style={{color:'#94aab3',lineHeight:1.7,fontSize:13,margin:0}}>{d}</p></article>)}
        </div>
        <div style={{marginTop:24,padding:24,border:'1px solid rgba(113,242,182,.25)',borderRadius:16,background:'rgba(8,42,34,.12)',fontWeight:900,fontSize:22}}>MINIMUM ≠ OPTIONAL</div>
        <Samantha text={narration[2]}/>
      </section>

      <section style={{padding:'58px 0',borderTop:'1px solid #17313b'}}>
        <p style={{color:'#efc86c',fontSize:10,fontWeight:900,letterSpacing:1.8}}>04 · AUTHORIZATION + BOUNDED EXECUTION</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(40px,5.6vw,66px)',margin:'14px 0 18px'}}>A diagnosis does not authorize a consequence.</h2>
        <p style={{maxWidth:930,color:'#a8bec6',fontSize:18,lineHeight:1.8}}>Authorization stands on evidence connecting the asset, observed condition, diagnostic determination, proposed intervention, applicable authority, and the relationship between what was authorized and what was actually executed.</p>
        <div style={{marginTop:28,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:12}}>
          {[
            ['ASSET / SYSTEM','What physical system or component is the subject?'],
            ['OBSERVED CONDITION','What condition was actually observed?'],
            ['DETERMINATION','What diagnostic determination supports the proposed action?'],
            ['PROPOSED INTERVENTION','What is proposed to be changed?'],
            ['APPLICABLE AUTHORITY','Who or what permits execution?'],
            ['EXECUTION RELATIONSHIP','Did the work performed remain within what was authorized?']
          ].map(([t,d])=><div key={t} style={{padding:20,borderRadius:14,border:'1px solid rgba(239,200,108,.16)',background:'rgba(4,18,27,.68)'}}><b style={{color:'#efc86c',fontSize:11}}>{t}</b><p style={{color:'#96aab2',fontSize:13,lineHeight:1.55}}>{d}</p></div>)}
        </div>
        <div style={{marginTop:24,padding:22,borderRadius:15,border:'1px solid rgba(112,220,255,.18)',background:'#06131b',color:'#a7bcc4',lineHeight:1.7}}>Routine service may operate under valid prior delegation when the delegation clearly establishes a bounded class of interventions. Prior delegation is not unlimited authority. Work outside the envelope requires new authorization.</div>
        <Samantha text={narration[3]}/>
      </section>

      <section style={{padding:'58px 0',borderTop:'1px solid #17313b'}}>
        <p style={{color:'#efc86c',fontSize:10,fontWeight:900,letterSpacing:1.8}}>05 · URGENT PROTECTIVE INTERVENTION</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(40px,5.6vw,66px)',margin:'14px 0 18px'}}>Urgent ≠ ungoverned.</h2>
        <p style={{maxWidth:920,color:'#a8bec6',fontSize:18,lineHeight:1.8}}>The framework does not require a technician to allow preventable equipment damage, unsafe conditions, or materially worsening conditions merely to complete an ideal record. Urgency changes the timing. It does not erase governance.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(245px,1fr))',gap:12,marginTop:26}}>
          {[
            ['PRESERVE','Capture the maximum admissible pre-state reasonably obtainable without materially delaying protective action.'],
            ['RECORD','State the urgent condition and why the normal sequence was not reasonably practicable.'],
            ['AUTHORIZE','Identify the authority supporting the urgent protective action.'],
            ['BOUND','Limit execution to the protective action reasonably necessary.'],
            ['RE-ESTABLISH','Immediately after the action, establish verification propositions that remain evaluable.'],
            ['VERIFY','Do not infer satisfaction where intervention destroyed the evidence needed to test a proposition.']
          ].map(([t,d],i)=><article key={t} style={{padding:22,border:'1px solid rgba(239,200,108,.16)',borderRadius:15,background:'rgba(51,39,7,.09)'}}><span style={{color:'#efc86c',fontSize:10,fontWeight:900}}>0{i+1}</span><h3 style={{fontSize:18,margin:'8px 0'}}>{t}</h3><p style={{color:'#a9a082',fontSize:13,lineHeight:1.6}}>{d}</p></article>)}
        </div>
        <Samantha text={narration[4]}/>
      </section>

      <section style={{padding:'58px 0',borderTop:'1px solid #17313b'}}>
        <p style={{color:'#70dcff',fontSize:10,fontWeight:900,letterSpacing:1.8}}>06 · POST-INTERVENTION VERIFICATION</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(40px,5.6vw,66px)',margin:'14px 0 18px'}}>Completion is not proof of outcome.</h2>
        <div style={{padding:30,border:'1px solid rgba(112,220,255,.22)',borderRadius:18,background:'#06131b'}}>
          <p style={{fontFamily:'Georgia,serif',fontSize:'clamp(25px,3vw,38px)',lineHeight:1.35,margin:'0 0 20px'}}>The technician finished the work. What does the evidence actually establish?</p>
          <p style={{color:'#9eb3bc',lineHeight:1.8,fontSize:16}}>Verification examines the post-intervention state against propositions that remain validly evaluable. If intervention makes a proposition no longer evaluable, the record identifies that limitation rather than inferring satisfaction. Verification evidence remains distinguishable from the technician's conclusion.</p>
        </div>
        <Samantha text={narration[5]}/>
      </section>

      <section style={{padding:'58px 0',borderTop:'1px solid #17313b'}}>
        <p style={{color:'#71f2b6',fontSize:10,fontWeight:900,letterSpacing:1.8}}>07 · OUTCOME CLASSIFICATION</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(40px,5.6vw,66px)',margin:'14px 0 18px'}}>Seven outcomes. No manufactured certainty.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12,marginTop:28}}>
          {outcomes.map(([t,d])=><article key={t} style={{padding:22,border:t==='INDETERMINATE'?'1px solid rgba(239,200,108,.4)':'1px solid rgba(113,242,182,.14)',borderRadius:15,background:t==='INDETERMINATE'?'rgba(52,39,7,.12)':'rgba(4,18,27,.7)'}}><b style={{color:t==='INDETERMINATE'?'#efc86c':'#71f2b6',fontSize:13}}>{t}</b><p style={{color:'#96aab2',fontSize:13,lineHeight:1.6}}>{d}</p></article>)}
        </div>
        <div style={{marginTop:24,padding:25,border:'1px solid rgba(239,200,108,.26)',borderRadius:16,background:'rgba(52,39,7,.1)',fontFamily:'Georgia,serif',fontSize:'clamp(22px,2.8vw,34px)',lineHeight:1.35}}>INDETERMINATE is a defensible outcome when the available evidence cannot establish another state.</div>
        <Samantha text={narration[6]}/>
      </section>

      <section style={{padding:'58px 0 40px',borderTop:'1px solid #17313b'}}>
        <p style={{color:'#b9a8ff',fontSize:10,fontWeight:900,letterSpacing:1.8}}>08 · INDUSTRY EXAMINATION</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(40px,5.6vw,66px)',margin:'14px 0 18px'}}>Do not endorse it. Attack it.</h2>
        <p style={{maxWidth:930,color:'#a8bec6',fontSize:18,lineHeight:1.8}}>A serious examination should try to falsify the architecture, identify duplicated requirements, test burden in actual service conditions, and determine where the proposed process conflicts with existing authority or established practice.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))',gap:12,marginTop:28}}>
          {[
            'Are observation, inference, authorization, execution, verification, and outcome sufficiently separated?',
            'Are the minimum-record expectations workable in real service conditions?',
            'Does the urgent-action exception preserve safety without creating an ungoverned bypass?',
            'Can prior delegation be bounded clearly enough for routine service?',
            'Are outcome states testable without forcing false certainty?',
            'Does the proposal duplicate, conflict with, or leave gaps relative to existing standards and accepted practice?',
            'What empirical study would determine whether this process improves service quality, accountability, repeatability, or evidentiary integrity?'
          ].map((q,i)=><div key={q} style={{padding:22,border:'1px solid rgba(185,168,255,.15)',borderRadius:14,background:'rgba(42,32,72,.10)',color:'#bdb8c8',lineHeight:1.65}}><span style={{color:'#b9a8ff',fontWeight:900,marginRight:10}}>{String(i+1).padStart(2,'0')}</span>{q}</div>)}
        </div>
        <Samantha text={narration[7]}/>
      </section>

      <section style={{margin:'26px 0 28px',padding:'clamp(34px,6vw,64px)',border:'1px solid rgba(112,220,255,.28)',borderRadius:24,background:'linear-gradient(145deg,rgba(8,34,47,.82),rgba(2,10,16,.96))'}}>
        <p style={{color:'#70dcff',fontSize:10,fontWeight:900,letterSpacing:1.8}}>THE GOVERNING QUESTION</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(38px,5.8vw,72px)',lineHeight:1.06,letterSpacing:'-.025em',margin:'14px 0 28px'}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</h2>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {stages.map(([n,t])=><span key={n} style={{padding:'10px 12px',border:'1px solid rgba(112,220,255,.16)',borderRadius:999,background:'rgba(2,9,15,.55)',fontSize:9,fontWeight:900,color:'#9db6c0'}}>{n} · {t}</span>)}
        </div>
      </section>

      <section style={{marginBottom:28,padding:24,borderRadius:18,border:'1px solid rgba(255,255,255,.09)',background:'rgba(2,9,15,.55)',color:'#7f959f',fontSize:12,lineHeight:1.75}}>
        <b style={{color:'#c5d4da'}}>BOUNDARY / NON-CLAIM.</b> This showroom is an open technical examination surface. It does not establish adoption, consensus, certification, conformance, ASHRAE approval, or independent validation. Existing standards are not comprehensively characterized here. No universal technical threshold is created without supporting authority or evidence.
      </section>

      <section style={{padding:'38px 0 54px',display:'flex',justifyContent:'space-between',gap:20,alignItems:'center',flexWrap:'wrap',borderTop:'1px solid #17313b'}}>
        <div><p style={{color:'#71f2b6',fontSize:10,fontWeight:900,letterSpacing:1.5,marginBottom:8}}>OPEN EXAMINATION</p><h3 style={{fontFamily:'Georgia,serif',fontSize:32,margin:0}}>Challenge the framework.</h3><p style={{color:'#8fa5ae',maxWidth:680,lineHeight:1.7}}>No PDF gate. No download requirement. Examine the architecture here and send a technical challenge if you see a failure, conflict, burden, or missing authority.</p></div>
        <a href="mailto:ta14admissibleexecution@gmail.com?subject=Evidence-Governed%20HVAC%20Industry%20Examination" style={{padding:'15px 20px',borderRadius:12,background:'#70dcff',color:'#021019',textDecoration:'none',fontWeight:900,fontSize:11,letterSpacing:.5}}>SUBMIT A TECHNICAL CHALLENGE →</a>
      </section>

      <footer style={{padding:'30px 0 70px',borderTop:'1px solid rgba(255,255,255,.08)',display:'flex',justifyContent:'space-between',gap:14,flexWrap:'wrap',color:'#66818e',fontSize:10}}>
        <div>TA14 AUTHORITY GOVERNANCE INSTITUTION · EVIDENCE-GOVERNED HVAC SERVICE</div>
        <Link href="/showrooms" style={{color:'#70dcff',textDecoration:'none'}}>ALL SHOWROOMS →</Link>
      </footer>
    </div>
  </main>
}
