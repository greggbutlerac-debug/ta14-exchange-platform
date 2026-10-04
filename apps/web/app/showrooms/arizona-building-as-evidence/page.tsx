import Link from 'next/link';

export const metadata={
 title:'The Building as Evidence — Arizona | TA-14',
 description:'Public technical showroom examining atmospheric condition, HVAC history, evidence continuity, intervention, and post-condition records in Arizona buildings.'
};

const stages=[
 ['01','REALITY','What was the building actually doing at the consequential time?'],
 ['02','RECORD','What atmospheric, mechanical, service, complaint, and occupancy evidence was preserved?'],
 ['03','CONTINUITY','Can the record survive gaps in time, custody, location, system state, and changed conditions?'],
 ['04','INTERVENTION','What repair, control change, remediation, or operating action occurred?'],
 ['05','POST-CONDITION','What changed afterward, and was the result measured rather than assumed?'],
 ['06','EXAMINATION','What claims can the preserved record actually support — and what remains unresolved?']
];

const lanes=[
 ['SCHOOLS','Arizona Building Renewal Grants expressly recognize Classroom Temperature, Classroom Air Quality, and Building Systems deficiencies. The funding pathway can include Assessment, Design, Procurement, Construction, and commissioning for applied HVAC systems.','https://sfb.az.gov/funding-programs/building-renewal-grant'],
 ['HOUSING / HABITABILITY','Arizona enforcement actions in 2026 have focused on failed air conditioning, extreme indoor heat, repair obligations, and preservation of HVAC-related records.','https://www.azag.gov/press-release/attorney-general-mayes-demands-spectra-west-apartments-glendale-restore-functioning'],
 ['LITIGATION / FORENSIC EVIDENCE','In Mason v. Eastside/Wasatch, the Arizona Court of Appeals record shows how weak chain of custody, poor documentation, and later sampling can undermine attempts to prove earlier indoor environmental conditions.','https://law.justia.com/cases/arizona/court-of-appeals-division-one-unpublished/2010/cv090155.html'],
 ['PROCUREMENT / IMPLEMENTATION','Arizona already procures environmental monitoring, building assessment, engineering, and technical services. TA-14 can enter as an evidence-integrity and consequence-governance layer rather than pretending to replace licensed engineering or industrial hygiene.','https://spo.az.gov/suppliers']
];

export default function ArizonaBuildingEvidence(){
 return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 82% 0%,rgba(51,184,230,.16),transparent 28%),linear-gradient(180deg,#02070c,#07131b 48%,#02070c)',color:'#edf5f8',fontFamily:'Arial,sans-serif',padding:'0 20px'}}>
  <div style={{maxWidth:1200,margin:'0 auto'}}>
   <nav style={{padding:'28px 0',borderBottom:'1px solid rgba(112,220,255,.14)',display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
    <Link href="/showrooms/environmental-atmospheric" style={{color:'#70dcff',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL & ATMOSPHERIC</Link>
    <span style={{fontSize:10,fontWeight:900,letterSpacing:1.8,color:'#78909b'}}>PUBLIC TECHNICAL SHOWROOM · ARIZONA</span>
   </nav>

   <header style={{padding:'90px 0 52px'}}>
    <p style={{color:'#efc86c',fontSize:11,fontWeight:900,letterSpacing:2}}>ATMOSPHERIC EVIDENCE · HVAC HISTORY · CONTINUITY · OUTCOME</p>
    <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(58px,9vw,108px)',lineHeight:.9,letterSpacing:'-.05em',margin:'18px 0 28px'}}>THE BUILDING<br/><em style={{fontStyle:'normal',color:'#70dcff'}}>AS EVIDENCE.</em></h1>
    <p style={{maxWidth:930,color:'#b5c9d2',fontSize:'clamp(20px,2.5vw,29px)',lineHeight:1.55}}>When a school, apartment, workplace, insurer, attorney, court, or public agency needs to understand what happened inside a building, a later snapshot is not the same thing as a preserved atmospheric record.</p>
    <div style={{marginTop:32,padding:'26px',border:'1px solid rgba(113,242,182,.34)',borderRadius:20,background:'rgba(5,22,29,.72)',fontSize:'clamp(21px,3vw,35px)',fontWeight:900,lineHeight:1.25}}>A later inspection can describe the building now. It cannot automatically prove what the building was doing then.</div>
    <div style={{marginTop:18,padding:'22px 24px',border:'1px solid rgba(112,220,255,.24)',borderRadius:18,background:'rgba(4,18,27,.72)'}}>
     <small style={{display:'block',color:'#70dcff',fontWeight:900,letterSpacing:1.4,marginBottom:10}}>TA14 GOVERNING QUESTION</small>
     <div style={{fontFamily:'Georgia,serif',fontSize:'clamp(20px,2.4vw,31px)',lineHeight:1.35}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</div>
    </div>
   </header>

   <section style={{padding:'34px 0 16px'}}>
    <p style={{color:'#70dcff',fontSize:10,fontWeight:900,letterSpacing:1.7}}>WHY ARIZONA · WHY NOW</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(38px,5vw,62px)',margin:'12px 0 28px'}}>Arizona already funds, regulates, and examines building condition.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:14}}>
     {lanes.map(([t,d,u])=><a key={t} href={u} target="_blank" rel="noreferrer" style={{padding:24,border:'1px solid rgba(112,220,255,.18)',borderRadius:18,background:'rgba(4,18,27,.78)',color:'#edf5f8',textDecoration:'none'}}>
      <small style={{color:'#efc86c',fontWeight:900,letterSpacing:1.1}}>{t}</small>
      <p style={{color:'#9fb4be',lineHeight:1.65,fontSize:14}}>{d}</p>
      <b style={{color:'#70dcff',fontSize:10}}>VIEW SOURCE →</b>
     </a>)}
    </div>
    <div style={{marginTop:16,padding:'22px 24px',border:'1px solid rgba(255,211,111,.2)',borderRadius:16,background:'rgba(56,43,10,.1)',color:'#c8bea4',lineHeight:1.65}}>
     <b style={{color:'#efc86c'}}>CURRENT ARIZONA RECORD-PRESERVATION SIGNAL.</b> In a 2026 housing enforcement matter, the Arizona Attorney General demanded functioning air conditioning, written proof of compliance, and preservation of maintenance and HVAC-system records. That is the same evidentiary problem this showroom is designed to make visible: condition, chronology, intervention, and proof afterward.
    </div>
   </section>

   <section style={{marginTop:34,padding:'clamp(30px,5vw,54px)',border:'1px solid rgba(112,220,255,.18)',borderRadius:24,background:'linear-gradient(145deg,rgba(8,34,47,.82),rgba(2,10,16,.96))'}}>
    <p style={{color:'#71f2b6',fontSize:10,fontWeight:900,letterSpacing:1.7}}>THE EVIDENCE PATH</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12,marginTop:22}}>
     {stages.map(([n,t,d])=><article key={n} style={{padding:22,border:'1px solid rgba(255,255,255,.08)',borderRadius:16,background:'rgba(2,9,15,.58)'}}>
      <div style={{color:'#70dcff',fontSize:10,fontWeight:900}}>{n}</div>
      <h3 style={{fontSize:20,margin:'8px 0'}}>{t}</h3>
      <p style={{color:'#98adb7',lineHeight:1.6,fontSize:13}}>{d}</p>
     </article>)}
    </div>
   </section>

   <section style={{marginTop:28,padding:'clamp(30px,5vw,54px)',border:'1px solid rgba(255,211,111,.24)',borderRadius:24,background:'rgba(56,43,10,.12)'}}>
    <p style={{color:'#efc86c',fontSize:10,fontWeight:900,letterSpacing:1.7}}>HISTORICAL ARIZONA PRESSURE TEST</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,58px)',margin:'12px 0 18px'}}>Later testing cannot automatically reconstruct earlier atmospheric reality.</h2>
    <p style={{maxWidth:980,color:'#c6c0ad',fontSize:17,lineHeight:1.72}}>The Mason litigation illustrates the evidentiary problem: weak sample documentation and chain of custody were challenged, and testing performed years later could not reliably establish earlier mold conditions because temperature, humidity, remediation, and other intervening conditions were not known. The lesson is not that one party was right. The lesson is that missing chronology can become decisive.</p>
    <div style={{marginTop:22,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10,alignItems:'stretch'}}>
     {[
      ['2001','EARLIER BUILDING REALITY'],
      ['GAP','MISSING CONTINUITY'],
      ['2003','LATER TESTING'],
      ['LIMIT','CANNOT AUTOMATICALLY RECONSTRUCT 2001']
     ].map(([a,b])=><div key={a} style={{padding:18,border:'1px solid rgba(255,211,111,.18)',borderRadius:14,background:'rgba(2,9,15,.5)'}}><b style={{display:'block',color:'#efc86c',fontSize:18}}>{a}</b><span style={{display:'block',marginTop:8,color:'#b7ad95',fontSize:11,fontWeight:900,lineHeight:1.45}}>{b}</span></div>)}
    </div>
    <a href="https://law.justia.com/cases/arizona/court-of-appeals-division-one-unpublished/2010/cv090155.html" target="_blank" rel="noreferrer" style={{display:'inline-block',marginTop:18,color:'#70dcff',textDecoration:'none',fontWeight:900,fontSize:11}}>READ THE ARIZONA COURT RECORD →</a>
   </section>

   <section style={{marginTop:28,padding:'clamp(30px,5vw,54px)',border:'1px solid rgba(113,242,182,.24)',borderRadius:24,background:'rgba(8,42,34,.12)'}}>
    <p style={{color:'#71f2b6',fontSize:10,fontWeight:900,letterSpacing:1.7}}>TA-14 PROPOSED SERVICE LAYER</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,58px)',margin:'12px 0 18px'}}>Preserve the building before someone has to reconstruct it later.</h2>
    <div style={{margin:'0 0 24px',padding:'22px',border:'1px solid rgba(113,242,182,.18)',borderRadius:16,background:'rgba(2,10,16,.58)'}}>
     <small style={{color:'#71f2b6',fontWeight:900,letterSpacing:1.3}}>EVIDENCE ARCHITECTURE</small>
     <div style={{marginTop:12,fontSize:'clamp(16px,2vw,23px)',fontWeight:900,lineHeight:1.5}}>REALITY → AIR → CONTINUITY → ENVIRONMENTAL RECORD INTERPRETER → ADMISSIBILITY → AUTHORIZED HUMAN / INSTITUTIONAL USE</div>
     <p style={{margin:'12px 0 0',color:'#9eb7ae',fontSize:13,lineHeight:1.65}}>AIR preserves the atmospheric record. The Environmental Record Interpreter makes the preserved record human-readable without silently turning observation into diagnosis, legal conclusion, or automatic permission. PAIR is used only when person-centered atmospheric continuity across places is actually relevant.</p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12}}>
     {[
      ['ATMOSPHERIC BASELINE','Indoor temperature, humidity, CO₂, particles, pressure, equipment state, occupancy context, complaints, and other relevant observations — bounded to the actual examination.'],
      ['MECHANICAL CHRONOLOGY','Service events, control changes, equipment state, failures, repairs, bypass conditions, commissioning observations, and material changed conditions.'],
      ['INTERVENTION RECORD','What was proposed, what authority applied, what work actually occurred, by whom, when, and within what scope.'],
      ['POST-CONDITION EVIDENCE','What changed after intervention, whether the claimed result was measured, what remained unresolved, and what future reliance is justified.'],
      ['ENVIRONMENTAL RECORD INTERPRETER','A human-readable technical interpretation layer that separates observed record from inference, claim, diagnosis, legal conclusion, or automatic consequence.'],
      ['EXAMINATION PACKAGE','A replayable evidence package for owners, districts, consultants, insurers, counsel, experts, or agencies to examine without TA-14 pretending to decide the underlying legal or professional question.']
     ].map(([t,d])=><article key={t} style={{padding:22,border:'1px solid rgba(113,242,182,.12)',borderRadius:16,background:'rgba(2,10,16,.58)'}}><h3 style={{fontSize:18,margin:'0 0 10px',color:'#e7fff3'}}>{t}</h3><p style={{color:'#9eb7ae',fontSize:13,lineHeight:1.65}}>{d}</p></article>)}
    </div>
   </section>

   <section style={{marginTop:28,padding:'clamp(32px,5vw,58px)',border:'1px solid rgba(185,168,255,.25)',borderRadius:24,background:'rgba(42,32,72,.13)'}}>
    <p style={{color:'#b9a8ff',fontSize:10,fontWeight:900,letterSpacing:1.7}}>PILOT PATH</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(36px,5vw,62px)',margin:'12px 0 20px'}}>Start with one bounded building problem.</h2>
    <p style={{maxWidth:970,color:'#b9b3c9',fontSize:18,lineHeight:1.7}}>A school HVAC deficiency. An apartment cooling complaint. A mold or moisture dispute. A post-repair verification problem. A portfolio that needs defensible operating history. The pilot does not decide the case. It establishes a better record of reality before, during, and after consequence.</p>
    <div style={{marginTop:24,padding:22,borderRadius:16,border:'1px solid rgba(185,168,255,.2)',background:'rgba(2,9,15,.58)',fontWeight:900,lineHeight:1.5}}>PROPOSED PILOT OUTPUT: BASELINE → CHRONOLOGY → INTERVENTION → POST-CONDITION → PRESERVED EVIDENCE PACKAGE → TECHNICAL EXAMINATION</div>
   </section>

   <section style={{marginTop:28,padding:'clamp(30px,5vw,50px)',borderRadius:20,border:'1px solid rgba(112,220,255,.24)',background:'rgba(4,18,27,.72)'}}>
    <p style={{color:'#70dcff',fontSize:10,fontWeight:900,letterSpacing:1.7}}>ARIZONA PILOT INVITATION</p>
    <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,56px)',margin:'12px 0 16px'}}>Propose one Arizona Building-as-Evidence pilot.</h2>
    <p style={{maxWidth:850,color:'#aebfc7',fontSize:17,lineHeight:1.7}}>One building. One condition. One evidence problem. No endorsement required. We are looking for a bounded Arizona case where better atmospheric and mechanical continuity would make the later technical examination more defensible.</p>
    <a href="mailto:ta14admissibleexecution@gmail.com?subject=Arizona%20Building-as-Evidence%20Pilot" style={{display:'inline-block',marginTop:18,padding:'15px 20px',borderRadius:12,background:'#70dcff',color:'#021019',textDecoration:'none',fontWeight:900,fontSize:11,letterSpacing:.5}}>PROPOSE AN ARIZONA PILOT →</a>
   </section>

   <section style={{marginTop:28,padding:24,borderRadius:18,border:'1px solid rgba(255,255,255,.09)',background:'rgba(2,9,15,.55)',color:'#7f959f',fontSize:12,lineHeight:1.7}}>
    <b style={{color:'#b7c8cf'}}>BOUNDARY / NON-CLAIM.</b> This showroom is a public technical examination surface. It is not legal advice, expert testimony, engineering licensure, industrial-hygiene certification, medical guidance, a claim of Arizona governmental adoption, or a representation that a TA-14 record is automatically admissible in court. Licensed and jurisdictionally competent professionals remain controlling where required.
   </section>

   <footer style={{padding:'44px 0 70px',marginTop:32,borderTop:'1px solid rgba(255,255,255,.08)',display:'flex',justifyContent:'space-between',gap:14,flexWrap:'wrap',color:'#66818e',fontSize:10}}>
    <div>TA14 AUTHORITY GOVERNANCE INSTITUTION · ARIZONA BUILDING-AS-EVIDENCE SHOWROOM</div>
    <Link href="/showrooms" style={{color:'#70dcff',textDecoration:'none'}}>ALL SHOWROOMS →</Link>
   </footer>
  </div>
 </main>
}