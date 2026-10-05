import Link from 'next/link';

export const metadata={
  title:'EPIC Air Quality Fund · Open Data to Governed Consequence | TA14',
  description:'Independent TA14 technical demonstration examining how open PM2.5 monitoring evidence can preserve provenance, continuity, admissibility and policy consequence.'
};

const chain=[
 ['01','PHYSICAL REALITY','Outdoor PM2.5 exists before the measurement system describes it.'],
 ['02','MEASUREMENT','A monitor produces an observation tied to place, time, instrument and operating state.'],
 ['03','OPEN RECORD','The measurement becomes inspectable and reusable rather than trapped in a closed system.'],
 ['04','CONTINUITY','Provenance, timestamps, instrument identity, calibration context and transformations remain traceable.'],
 ['05','ADMISSIBILITY','The evidence is tested against the specific proposition or policy consequence it is being asked to support.'],
 ['06','BINDING','Applicable law, policy, institutional authority and standing are connected to that consequence.'],
 ['07','COMMIT + EXECUTION','An authorized actor accepts responsibility and causes a bounded real-world action.'],
 ['08','OUTCOME','What changed is measured, preserved and becomes the next reality.']
];

const questions=[
 'Can a future reviewer recover the raw observation rather than only a dashboard summary?',
 'Can the observation still be tied to the correct instrument, location, time and operating context?',
 'Are corrections, aggregation, validation and other transformations preserved separately from the raw record?',
 'What evidence is sufficient for the exact policy claim being made?',
 'Who has standing to interpret, recommend, decide and execute?',
 'What changed after the decision, and was the claimed outcome actually measured?'
];

const visuals=[
 {src:'/TA14_EPIC_01_Open_Data_Is_The_Start.png',title:'01 · OPEN DATA IS THE START — NOT THE CONSEQUENCE',audio:'Section one begins with physical reality. Air exists before a monitor describes it. Section two is measurement: the instrument creates an observation tied to time, place, identity and operating state. Section three makes that observation open and inspectable. But open data is still evidence, not permission. Before a policy proposal becomes a real-world consequence, the evidence must cross a governance boundary where continuity, admissibility, applicable authority and standing are established. The lesson is simple: measurement can inform a consequence, but measurement alone does not authorize one.'},
 {src:'/TA14_EPIC_02_What_Must_Survive_With_PM25.png',title:'02 · WHAT MUST SURVIVE WITH THE PM2.5 OBSERVATION?',audio:'This image asks what must travel with a PM2.5 number if someone may later rely on it. Section one preserves time. Section two preserves location. Section three preserves instrument identity. Section four preserves calibration and verification context. Section five protects the raw value. Section six records every transformation rather than silently replacing the original observation. Section seven preserves context and uncertainty. Section eight preserves provenance: where the record came from, who handled it, and how its history can be reconstructed. A number without this continuity may remain useful information, but it becomes much harder to defend when the proposed consequence carries legal, institutional, financial or public-policy weight.'},
 {src:'/TA14_EPIC_03_Atmosphere_To_Outcome.png',title:'03 · FROM ATMOSPHERE TO OUTCOME',audio:'Now follow the complete route. One: physical reality is the atmospheric condition itself. Two: measurement captures an observation. Three: the open record makes that observation inspectable and reusable. Four: continuity preserves provenance, timestamps, instrument identity, calibration context and transformations. Five: admissibility tests whether the evidence is sufficient for the exact proposition being advanced. Six: binding connects applicable law, policy, institutional authority and standing. Seven: commit and execution require an authorized actor to accept responsibility and cause a bounded action. Eight: outcome measures what actually changed and preserves that result as the next reality. Each crossing matters. Skipping a crossing does not make the missing authority appear.'},
 {src:'/TA14_EPIC_04_Policy_Consequence_Boundary.png',title:'04 · THE POLICY CONSEQUENCE BOUNDARY',audio:'The final image separates three things that are often collapsed. Section one is observed: what was actually measured in the air, at a particular place and time, by a particular instrument. Section two is inferred: models, assumptions, aggregation and interpretation may tell us what that observation could mean. But inference is not authorization. The governance boundary asks whether the evidence is sufficient, which authority applies, who has standing, whether the decision record is preserved and whether permission exists for the proposed action. Only then do we reach section three: an authorized consequence carried out by a qualified actor within defined scope. Observed is not inferred. Inferred is not authorized.'}
];

export default function Page(){
 return <main style={{minHeight:'100vh',background:'linear-gradient(180deg,#02070c,#06131b 50%,#02070c)',color:'#eef6f8',fontFamily:'Arial,sans-serif'}}>
  <div style={{maxWidth:1160,margin:'auto',padding:'0 22px'}}>
   <nav style={{padding:'28px 0',borderBottom:'1px solid #18303b',display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
    <Link href="/showrooms/environmental-atmospheric" style={{color:'#70dcff',fontWeight:900,textDecoration:'none'}}>← ENVIRONMENTAL & ATMOSPHERIC</Link>
    <a href="https://aqfund.epic.uchicago.edu/" target="_blank" rel="noreferrer" style={{color:'#efc86c',fontWeight:900,textDecoration:'none'}}>EPIC AIR QUALITY FUND ↗</a>
   </nav>

   <header style={{padding:'88px 0 54px',maxWidth:1040}}>
    <p style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:2.2}}>INDEPENDENT TECHNICAL DEMONSTRATION · OPEN PM2.5 DATA · POLICY CONSEQUENCE</p>
    <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(48px,8vw,92px)',lineHeight:.94,letterSpacing:'-.035em',margin:'20px 0 28px'}}>OPEN DATA IS THE START.<br/><span style={{color:'#efc86c'}}>WHAT MAKES THE CONSEQUENCE DEFENSIBLE?</span></h1>
    <p style={{fontFamily:'Georgia,serif',fontSize:'clamp(23px,3vw,36px)',lineHeight:1.28,maxWidth:980}}>EPIC Air Quality Fund supports organizations that generate and openly share PM2.5 data to drive national-level clean-air policy impact. TA14 examines the next boundary: how evidence survives the passage from observation to consequence.</p>
    <div style={{marginTop:30,padding:22,border:'1px solid #355262',borderRadius:16,background:'#06121a',color:'#9fb4be',lineHeight:1.7}}>
      <b style={{color:'#efc86c'}}>INDEPENDENT · NO ENDORSEMENT IMPLIED.</b> This showroom was created by TA14 Authority Governance Institution as a public technical demonstration. It is not commissioned, approved, affiliated with, or endorsed by EPIC or the University of Chicago.
    </div>
   </header>

   <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16,marginBottom:54}}>
    <article style={{padding:30,border:'1px solid #244654',borderRadius:18,background:'#07131c'}}><small style={{color:'#70dcff',fontWeight:900}}>EPIC PUBLIC MODEL</small><h2 style={{fontFamily:'Georgia,serif',fontSize:34}}>Measure → Share → Influence policy</h2><p style={{color:'#9fb4be',lineHeight:1.75}}>The Fund's public 2026 criteria center on stationary outdoor PM2.5 monitoring, fully open data, and a credible path to national-level policy impact.</p></article>
    <article style={{padding:30,border:'1px solid #244654',borderRadius:18,background:'#07131c'}}><small style={{color:'#efc86c',fontWeight:900}}>TA14 QUESTION</small><h2 style={{fontFamily:'Georgia,serif',fontSize:34}}>What must survive between them?</h2><p style={{color:'#9fb4be',lineHeight:1.75}}>Open access makes evidence available. It does not by itself establish provenance, continuity, sufficiency, authority, standing, or permission for a specific policy consequence.</p></article>
   </section>

   <section style={{padding:'54px 0',borderTop:'1px solid #18303b'}}>
    <p style={{color:'#efc86c',fontSize:11,fontWeight:900,letterSpacing:2}}>THE GOVERNANCE GAP</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(36px,5vw,58px)',lineHeight:1.08,maxWidth:980}}>An admissible input does not automatically create an admissible output.</h2>
    <p style={{maxWidth:900,color:'#a3b6be',fontSize:18,lineHeight:1.8}}>A PM2.5 observation may be technically sound and openly available. A later policy decision can still require additional evidence, applicable authority, established standing, scope, interpretation discipline and a preserved decision record. TA14 keeps those layers separate so the route from measurement to consequence can be inspected rather than assumed.</p>
   </section>

   <section style={{padding:'58px 0',borderTop:'1px solid #18303b'}}>
    <p style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:2}}>VISUAL EXAMINATION · SAMANTHA NARRATION</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(36px,5vw,58px)',lineHeight:1.08}}>See the evidence chain. Then hear why each crossing matters.</h2>
    <div style={{display:'grid',gap:38,marginTop:30}}>
     {visuals.map((v,i)=><article key={v.src} style={{border:'1px solid #244654',borderRadius:18,overflow:'hidden',background:'#06121a'}}>
      <img src={v.src} alt={v.title} style={{display:'block',width:'100%',height:'auto'}}/>
      <div style={{padding:'24px 26px 28px'}}><h3 style={{fontFamily:'Georgia,serif',fontSize:26,margin:'0 0 14px'}}>{v.title}</h3><details style={{border:'1px solid #355262',borderRadius:12,padding:'15px 17px',background:'#041019'}}><summary style={{cursor:'pointer',color:'#70dcff',fontWeight:900}}>▶ SAMANTHA · LISTEN / READ THE TEACHING</summary><p style={{color:'#b7c8ce',fontSize:16,lineHeight:1.8,margin:'16px 0 0'}}>{v.audio}</p></details></div>
     </article>)}
    </div>
   </section>

   <section style={{padding:'54px 0',borderTop:'1px solid #18303b'}}>
    <p style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:2}}>FROM ATMOSPHERE TO OUTCOME</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(245px,1fr))',gap:14,marginTop:24}}>
     {chain.map(([n,t,b])=><article key={n} style={{padding:24,border:'1px solid #244654',borderRadius:16,background:'#06121a'}}><b style={{color:'#70dcff'}}>{n}</b><h3 style={{fontFamily:'Georgia,serif',fontSize:24,margin:'8px 0'}}>{t}</h3><p style={{color:'#98adb6',lineHeight:1.65,margin:0}}>{b}</p></article>)}
    </div>
   </section>

   <section style={{padding:'58px 0',borderTop:'1px solid #18303b'}}>
    <p style={{color:'#efc86c',fontSize:11,fontWeight:900,letterSpacing:2}}>THE PRACTITIONER PRESSURE TEST</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,54px)'}}>Observed is not inferred. Inferred is not authorized.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:12,marginTop:26}}>
     {questions.map((q,i)=><div key={q} style={{padding:22,border:'1px solid #1e3d4b',borderRadius:14,background:'#041019',color:'#b7c8ce',lineHeight:1.65}}><span style={{color:'#70dcff',fontWeight:900,marginRight:10}}>{String(i+1).padStart(2,'0')}</span>{q}</div>)}
    </div>
   </section>

   <section style={{padding:'58px 0',borderTop:'1px solid #18303b'}}>
    <p style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:2}}>A POSSIBLE EPIC × TA14 DEMONSTRATION</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,54px)'}}>Add a governed evidence layer without closing the data.</h2>
    <p style={{maxWidth:920,color:'#a3b6be',fontSize:18,lineHeight:1.8}}>A collaborative demonstration could begin with an existing open PM2.5 stream and preserve the evidence chain around one policy-relevant question: raw observation, instrument and location identity, transformations, continuity, applicable authority, standing, decision, execution and measured outcome. The purpose would not be to replace EPIC's open-data model. It would test whether the path from open data to consequential use can become more replayable, auditable and defensible.</p>
    <div style={{marginTop:26,padding:28,border:'1px solid #4c4a2b',borderRadius:18,background:'#111006'}}>
      <p style={{color:'#efc86c',fontWeight:900,letterSpacing:1.3}}>CANONICAL QUESTION</p>
      <p style={{fontFamily:'Georgia,serif',fontSize:'clamp(26px,3.5vw,40px)',lineHeight:1.3,marginBottom:0}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p>
    </div>
   </section>

   <section style={{padding:'58px 0 86px',borderTop:'1px solid #18303b'}}>
    <p style={{color:'#efc86c',fontSize:11,fontWeight:900,letterSpacing:2}}>CURRENT STATUS · OCTOBER 5, 2026</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(32px,4vw,48px)'}}>The 2026 EPIC funding call is closed. The technical conversation is not.</h2>
    <p style={{maxWidth:900,color:'#a3b6be',fontSize:17,lineHeight:1.8}}>EPIC's public registry remains open to air-quality actors, and EPIC publicly invites partnership inquiries. TA14 is presenting this room as a bounded demonstration and invitation to examine whether evidence-governance infrastructure can strengthen the durability of open PM2.5 programs and the policy consequences they support.</p>
    <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:30}}>
     <a href="https://aqfund.epic.uchicago.edu/air-quality-registry/" target="_blank" rel="noreferrer" style={{padding:'14px 18px',borderRadius:12,background:'#70dcff',color:'#001018',fontWeight:900,textDecoration:'none'}}>EPIC AIR QUALITY REGISTRY ↗</a>
     <a href="https://aqfund.epic.uchicago.edu/call-for-proposals/" target="_blank" rel="noreferrer" style={{padding:'14px 18px',borderRadius:12,border:'1px solid #365366',color:'#edf5f8',fontWeight:900,textDecoration:'none'}}>2026 CALL RECORD ↗</a>
    </div>
   </section>
  </div>
 </main>
}