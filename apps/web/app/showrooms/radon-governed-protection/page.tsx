import Link from 'next/link';
import Samantha from './Samantha';

export const metadata={
 title:'Radon: From Measurement to Governed Protection | TA-14 Exchange',
 description:'Eight illustrated lessons on trustworthy radon measurement, verified qualifications, authorized mitigation, independent verification and long-term stewardship. Independent educational architecture, not a certification.'
};

const scenes=[
 {image:'Radon_ The Invisible Risk.png',eyebrow:'01 · THE INVISIBLE CONDITION',title:'A home can look safe and still require testing.',
  lesson:'Radon is a naturally occurring radioactive gas. It cannot be detected by sight or smell, and it can enter buildings from the ground. A beautifully maintained home does not establish its indoor radon condition.',
  detail:'Start with the actual building and the question being asked. Appropriate testing—not appearances, assumptions or a map of nearby homes—establishes an observation at a specific place and time.',
  caution:'The blue arrows in this illustration are conceptual. Radon is invisible, and the image does not document an actual home.',
  audio:'Lesson one: the invisible condition. Radon is a naturally occurring radioactive gas. A house can look perfect while its radon condition remains unknown. The blue arrows are a teaching illustration, not visible radon or a documented entry path. The first responsibility is to decide why testing is needed, and then obtain an appropriate measurement. A single reading describes conditions over its measurement period, not a permanent guarantee.',
  next:'What makes a test record sufficiently trustworthy to support a consequential decision?'},
 {image:'Radon Governance_ Measured to Protected Homes.png',eyebrow:'02 · THE WHOLE PATH',title:'A reading is the beginning of accountability, not its conclusion.',
  lesson:'The proposed chain is: recognize potential risk, measure appropriately, establish professional responsibility, evaluate an intervention, perform authorized work, verify results and maintain protection.',
  detail:'Those are different evidence and responsibility boundaries. TA-14 does not issue radon credentials, impose standards or execute mitigation. The governance layer evaluates whether a proposed consequential step has support from admissible evidence, applicable authority and established standing.',
  caution:'This overview graphic is a conceptual teaching map; its checkmarks and flow are not results from a real property.',
  audio:'Lesson two: the whole path. More testing does not automatically deliver protection. We must distinguish measurement, interpretation, qualified responsibility, an authorized intervention, physical installation, post-work measurement and ongoing stewardship. TA-14 describes a proposed governance boundary. It evaluates whether an action is admissible but does not perform the work or create legal authority. Every transition must remain inspectable.',
  next:'How do we know whether the original measurement was collected correctly?'},
 {image:'Radon Measurement Integrity in Action.png',eyebrow:'03 · MEASUREMENT INTEGRITY',title:'Method, placement, conditions and quality assurance matter.',
  lesson:'A defensible radon record identifies the purpose of the test, relevant protocol and edition, location, dates and duration, device or laboratory identity, quality-control context, building conditions, tester identity and any deviations.',
  detail:'Testing requirements differ for screening, real-estate transactions, diagnostic investigations and post-mitigation verification. Deviations or missing records should remain visible rather than becoming implied compliance.',
  caution:'Any numeric spacing annotations depicted in the illustration are not approved universal placement instructions. Verify exact distances and procedures against the currently applicable measurement protocol.',
  audio:'Lesson three: measurement integrity. A radon number without a trustworthy record can be difficult to interpret or defend. Preserve the test purpose, method, placement, test duration, instrument or laboratory, quality assurance, building conditions, tester identity and deviations. The graphic contains example placement dimensions; these are not a substitute for the applicable ANSI AARST protocol or state rules. A continuous sensor reading does not automatically replace a required test method.',
  next:'Who is actually qualified, and who has legitimate authority for the work?'},
 {image:'Radon Qualifications and Accountability Infographic.png',eyebrow:'04 · CREDENTIALS AND RESPONSIBILITY',title:'Licensing, certification, competence and authority are not interchangeable.',
  lesson:'Licensing is a jurisdiction-specific legal requirement where applicable. Certification may be voluntary or legally required. Training, field competence, quality-assurance records and the right to authorize property work must be examined separately.',
  detail:'A proposed program could require documented competence even where state licensing is absent—but it must label such conditions as program requirements, not invented state law. The record should distinguish verified credentials from claims that were not independently checked.',
  caution:'The illustration describes certification as voluntary; that is not universally true. Certification requirements depend on jurisdiction and the specific professional role. All depicted checkmarks are hypothetical.',
  audio:'Lesson four: qualifications and accountability. Radon professions may be subject to different licensing, certification, registration or other requirements in different states. Certification is not always voluntary. Training and experience are not identical to a credential, and a credential does not by itself grant permission to enter or alter someone else’s property. Verify the role, scope, status and applicable authority before treating a proposed intervention as admissible.',
  next:'What happens when evidence or authority is incomplete at the proposed action boundary?'},
 {image:'AER Decision Boundary_ Governed Radon Lifecycle.png',eyebrow:'05 · ADMISSIBLE EXECUTION ARCHITECTURE',title:'Evidence is not authority. Authority is not execution.',
  lesson:'AEA evaluates whether a particular proposed consequential action has sufficient Admissible Evidence, Applicable Authority and Established Standing at the relevant moment. Conceptual outcomes are ALLOW, HOLD, DENY and ESCALATE.',
  detail:'The property owner or other legally authorized party establishes permission for work; qualified professionals make technical recommendations and perform their authorized roles. AEA neither creates their authority nor performs the intervention. An ALLOW is a bounded evaluation outcome, not an independent legal permit or proof of safety.',
  caution:'The illustrated “decision engine” is a teaching metaphor, not a deployed or independently certified automatic decision system. Existing health-protective actions must not be obstructed.',
  audio:'Lesson five: the decision boundary. AEA asks whether the exact proposed consequence has sufficient admissible evidence, applicable authority and established standing to become reality now. ALLOW, HOLD, DENY and ESCALATE are conceptual governance outcomes, not installation commands. An ALLOW does not create regulatory or property authority, and it is not proof that exposure has been reduced. Any independently authorized urgent protective response must remain available.',
  next:'Who designs and installs mitigation, and what does a completed installation actually establish?'},
 {image:'Radon Mitigation Governance Blueprint.png',eyebrow:'06 · AUTHORIZED MITIGATION',title:'A mitigation system is physical work—not a governance verdict.',
  lesson:'An appropriately qualified professional selects and installs a method suited to the property and applicable requirements. The responsible parties preserve scope, consent, required permits, specifications, system details, installation date, commissioning information and owner instructions.',
  detail:'For some buildings, active soil depressurization is a common approach. The actual design, fan location, discharge, electrical details and system verification must follow the requirements governing that property.',
  caution:'The pipework and airflow arrows are conceptual, with some illustrative directional inconsistencies. Do not use this image as a field installation diagram or code-compliance guide.',
  audio:'Lesson six: authorized mitigation. The governance layer can examine whether a mitigation proposal has sufficient evidence, authority and standing, but the physical work belongs to the appropriate professional. The installation record should document design, consent, permits if required, installer, equipment and commissioning. This drawing is conceptual and its airflow arrows are not installation instructions. Most important, installation completion does not prove the occupied space has achieved the desired radon result.',
  next:'What separate evidence demonstrates whether mitigation actually worked?'},
 {image:'Independent Radon Verification Lifecycle.png',eyebrow:'07 · VERIFY THE OUTCOME',title:'A working fan does not prove reduced exposure.',
  lesson:'Post-mitigation testing is a separate evidence event. It requires an appropriate method, timing, location, test conditions and result, with the tester’s qualifications and independence disclosed when relevant.',
  detail:'A suitable follow-up result may support a bounded conclusion for the tested period and conditions. If it does not support the intended objective—or essential context is missing—the proposed effectiveness claim returns to investigation and corrective planning.',
  caution:'The green “verified outcome” graphic illustrates the required step; it does not contain a measured result or demonstrate a successful installation. Independent third-party testing is not universally mandated.',
  audio:'Lesson seven: verification. An invoice, installed fan or contractor declaration shows work performed. It does not demonstrate the resulting indoor radon concentration. A separate properly timed test is needed, interpreted against applicable guidance and documented with its limitations. Independent testers may be required or preferred depending on the setting. This graphic does not show a real verified reading. If the result is unsatisfactory, investigate and plan additional corrective work rather than claiming success.',
  next:'How do we preserve protection after the first acceptable follow-up result?'},
 {image:'Radon Stewardship and Homeowner Trust.png',eyebrow:'08 · STEWARDSHIP AND PUBLIC TRUST',title:'The record continues after the contractor leaves.',
  lesson:'The long-term record can identify the owner of maintenance responsibilities, radon system checks, appropriate retesting intervals and triggers, building changes, new measurements, disclosure limits and a history of corrections.',
  detail:'A homeowner-facing report should explain what was measured, what it means, what remains unknown, who acted, what the follow-up evidence showed and what to do next. The information must be understandable without exposing private property data to unauthorized recipients.',
  caution:'The smiling homeowners and completed checkmarks are illustrative, not evidence of permanent safety. No result is a lifetime guarantee.',
  audio:'Lesson eight: long-term stewardship and homeowner trust. Building use, renovations, ventilation, equipment conditions and mitigation faults may change exposure after an earlier test. Preserve the original record, follow-up tests, revisions and maintenance responsibilities. Explain findings in plain language and protect private home data. A successful test does not prove permanent safety. TA-14 invites practitioners, state programs and homeowners to challenge what would make such a system genuinely accountable.',
  next:'Examine the prospectus and challenge the proposed criteria with professional evidence.'}
] as const;
const pdf='TA14_Radon_Governed_Protection_Prospectus_V2 (1).pdf';
const asset=(name:string)=>'/'+encodeURIComponent(name);
const heading={fontFamily:'Georgia,serif',fontWeight:700} as const;
export default function Page(){
 return <main style={{minHeight:'100vh',background:'linear-gradient(180deg,#020810 0%,#081622 38%,#030911 100%)',color:'#f0f5f8',fontFamily:'Arial,sans-serif'}}>
 <div style={{maxWidth:1180,margin:'auto',padding:'0 22px'}}>
 <nav style={{display:'flex',gap:24,flexWrap:'wrap',justifyContent:'space-between',padding:'26px 0',borderBottom:'1px solid #294454',fontSize:12,fontWeight:800}}>
  <Link href="/showrooms/environmental-atmospheric" style={{color:'#8ee1ee'}}>← ENVIRONMENTAL & ATMOSPHERIC</Link>
  <Link href="/showrooms/radon-mitigation-evidence-continuity" style={{color:'#d9bc72'}}>RELATED: RADON EVIDENCE CONTINUITY →</Link>
 </nav>
 <header style={{padding:'76px 0 50px'}}>
  <div style={{color:'#d9bc72',fontSize:11,fontWeight:900,letterSpacing:2}}>TA-14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT EDUCATIONAL SHOWROOM</div>
  <h1 style={{...heading,fontSize:'clamp(44px,6.7vw,86px)',lineHeight:1.04,maxWidth:1100,margin:'22px 0'}}>RADON: FROM MEASUREMENT TO <span style={{color:'#e9c471'}}>GOVERNED PROTECTION</span></h1>
  <p style={{fontFamily:'Georgia,serif',fontSize:'clamp(22px,2.9vw,35px)',lineHeight:1.33,maxWidth:940,color:'#cfdae1'}}>How do we establish reliable measurements, qualified responsibility, justified interventions and long-term accountability—especially where licensing is incomplete?</p>
  <p style={{fontSize:17,color:'#a8c0cf',lineHeight:1.85,maxWidth:930}}>This eight-part examination responds to questions raised in professional discussion about radon testing, ANSI/AARST standards, qualification, continuous monitoring, mitigation verification and homeowner stewardship. It is not affiliated with, commissioned by, reviewed by or endorsed by any named practitioner or standards body.</p>
  <div style={{margin:'28px 0',padding:'22px 24px',background:'#101b22',border:'1px solid #74633f',borderRadius:16,color:'#e6d2a8',lineHeight:1.7}}>
   <b>EDUCATIONAL STATUS · NO FIELD VALIDATION</b><div>Imagery, checkmarks, actors, equipment and decision outcomes are illustrative. The prospectus proposes governance requirements; it does not confer radon credentials, certify a property, establish legal authority or demonstrate deployed enforcement. Verify actual requirements with the applicable ANSI/AARST standards, EPA guidance and state radon program.</div>
  </div>
  <a href={asset(pdf)} download style={{display:'inline-block',background:'#e5c579',color:'#13202b',borderRadius:10,padding:'16px 22px',textDecoration:'none',fontWeight:900}}>↓ DOWNLOAD FIVE-PAGE TECHNICAL PROSPECTUS (PDF)</a>
 </header>
 <div style={{borderTop:'1px solid #284458',padding:'40px 0 24px'}}>
  <p style={{color:'#86dbea',letterSpacing:2,fontSize:11,fontWeight:900}}>THE CENTRAL DISTINCTION</p>
  <p style={{...heading,fontSize:'clamp(26px,3.7vw,43px)',lineHeight:1.32,maxWidth:1050}}>A measurement is not a decision. A recommendation is not authorization. Installed mitigation is not verified exposure reduction.</p>
  <p style={{color:'#a6bbc8',lineHeight:1.7,maxWidth:890}}>Follow eight original illustrations in order. Samantha narration is available directly beneath every image, followed by the lesson, a technical qualification and the question that leads to the next section.</p>
 </div>
 {scenes.map((s,i)=><section key={s.image} id={'lesson-'+(i+1)} style={{padding:'52px 0 62px',borderTop:'1px solid #294454'}}>
  <p style={{color:'#e5c579',letterSpacing:1.7,fontSize:12,fontWeight:900}}>{s.eyebrow}</p>
  <h2 style={{...heading,fontSize:'clamp(30px,4.3vw,55px)',lineHeight:1.1,margin:'12px 0 25px',maxWidth:990}}>{s.title}</h2>
  <div style={{border:'1px solid #314d5a',borderRadius:18,overflow:'hidden',background:'#081420'}}>
   <img src={asset(s.image)} alt={'Illustrative TA-14 radon lesson '+(i+1)+': '+s.title} loading={i===0?'eager':'lazy'} style={{width:'100%',height:'auto',display:'block'}}/>
  </div>
  <Samantha text={s.audio}/>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:18,marginTop:28}}>
   <article style={{border:'1px solid #294454',background:'#081723',borderRadius:14,padding:25,lineHeight:1.78}}><h3 style={{color:'#8ee1ee',marginTop:0,fontSize:15}}>WHAT YOU LEARNED</h3><p>{s.lesson}</p><p style={{color:'#a9bdcb'}}>{s.detail}</p></article>
   <article style={{border:'1px solid #705c38',background:'#171710',borderRadius:14,padding:25,lineHeight:1.78}}><h3 style={{color:'#e8c57a',marginTop:0,fontSize:15}}>WHAT THE IMAGE DOES NOT PROVE</h3><p>{s.caution}</p><h3 style={{color:'#e8c57a',fontSize:15,marginTop:28}}>WHAT COMES NEXT</h3><p>{s.next}</p></article>
  </div>
 </section>)}
 <section style={{padding:'44px 30px',background:'#0b1e2b',border:'1px solid #4b6d79',borderRadius:18,margin:'30px 0 44px'}}>
  <p style={{color:'#e8c57a',fontSize:11,fontWeight:900,letterSpacing:2}}>WORKED HYPOTHETICAL · A PROPOSED CLAIM</p>
  <h2 style={{...heading,fontSize:37}}>“The radon system was installed, so the home is safe.”</h2>
  <p style={{lineHeight:1.8,fontSize:17,color:'#d0dee5'}}>The installation record may support the narrower statement that mitigation work was completed. If the proposed claim of reduced exposure lacks an appropriate attributable post-mitigation test, the illustrative AEA disposition is <strong style={{color:'#e8c57a'}}>HOLD</strong> on that claim—not a finding that occupants must delay any independently authorized protective measures.</p>
  <p style={{lineHeight:1.8,color:'#a9c4d1'}}>The responsible professionals should obtain and interpret testing according to the applicable requirements, document limitations and revisit the proposed claim. A later acceptable result remains bounded by its method, time and conditions.</p>
 </section>
 <section style={{padding:'44px 0',borderTop:'1px solid #294454'}}>
  <p style={{color:'#86dbea',fontSize:11,letterSpacing:2,fontWeight:900}}>INVITATION TO INDEPENDENT CRITIQUE</p>
  <h2 style={{...heading,fontSize:'clamp(32px,4.5vw,52px)',lineHeight:1.1}}>What would qualified radon professionals change?</h2>
  <p style={{color:'#b5c8d1',fontSize:17,lineHeight:1.8,maxWidth:970}}>TA-14 invites measurement professionals, mitigation contractors, ANSI/AARST practitioners, state radon programs, public-health specialists and homeowners to examine the proposed thresholds for evidence sufficiency, credential verification, decision authority, independent testing, retest triggers, privacy and record continuity. The current showroom is a teaching proposal, not evidence that the proposed governance model has been field validated.</p>
  <a href={asset(pdf)} download style={{display:'inline-block',padding:'15px 22px',borderRadius:10,background:'#e8c57a',color:'#182431',textDecoration:'none',fontWeight:900}}>↓ EXAMINE THE TECHNICAL PROSPECTUS</a>
  <p style={{marginTop:24}}><Link href="/work-with-ta14?source_showroom=radon-governed-protection" style={{color:'#91e3f0'}}>Request a bounded professional examination →</Link></p>
 </section>
 <footer style={{padding:'32px 0 65px',borderTop:'1px solid #294454',color:'#829ba9',lineHeight:1.7,fontSize:12}}>TA-14 Authority Governance Institution · Independent educational concept · No certification · No legal or regulatory jurisdiction created · No affiliated endorsement · No field-validated operational claim.</footer>
 </div></main>
}
