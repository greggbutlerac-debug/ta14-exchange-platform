'use client';
import Link from 'next/link';
import {Fragment,useEffect,useState} from 'react';

const lessons=[
{title:'The HVAC System That Remembers Its Entire Life',image:'HVAC Lifetime Accountability Architecture.png',focus:'Commissioning becomes the first attributable operating reference.',script:'An HVAC system should not lose its operating history whenever a technician leaves. TA-14 proposes a lifecycle evidence record that starts with commissioning and follows the equipment through inspections, maintenance, interventions and verified outcomes. A cryptographic seal can help reveal changes after recording, but does not alone prove that a reading was accurate. Establish source, context, calibration, installation quality and verified manufacturer specifications before treating a claim as proven.'},
{title:'The Environmental Integrity Nodes',image:'Environmental Integrity Nodes_ HVAC Evidence Flow.png',focus:'Measure physical conditions; preserve measurements apart from interpretations.',script:'Environmental Integrity Nodes capture return-air and supply-air conditions around the evaporator. Available measurements include airflow, static pressure, dry bulb, wet bulb or humidity, electrical data and other relevant environmental observations. The Environmental Integrity Recorder preserves timestamps, uncertainty, source and continuity as Atmospheric Integrity Records. Comparing airflow and air-side enthalpy can inform capacity analysis, but a calculation or inferred fault must not overwrite the original observation.'},
{title:'The AEA Chain in Action',image:'AEA Chain_ From Measurement to Action.png',focus:'Admissible Execution Architecture is foundational, not an optional downstream wrapper.',script:'Reality, Record, Continuity, Admissibility, Binding, Commit, Execution and Outcome form the Admissible Execution Architecture chain. Admissible Computation Architecture preserves assumptions, transformation lineage and model constraints. A controller or HVAC Analyzer can propose an intervention, but it cannot grant itself permission. AEA tests Admissible Evidence, Applicable Authority and Established Standing, and revalidates at the commitment boundary now. The resulting outcome enters the next record of reality.'},
{title:'The Declared Diagnostic Determination',image:'Evidence to Authorized Action_ TA-14 DDD.png',focus:'A system-issued DDD requires a completed, frozen 14-step baseline.',script:'The technician gathers evidence, places probes, inspects equipment and explains findings, but does not author or change the formal Declared Diagnostic Determination. The HVAC Analyzer uses verified model and serial identification, applicable manufacturer specifications, measured operation and required physical inspections. After the fourteen-step baseline is completed and frozen, it determines what the admissible evidence establishes, including uncertainty and whether no correction is needed. Diagnostic interpretation must remain separate from later optimization proposals.'},
{title:'NIRET and the Refrigerant Governor',image:'TA-14 Refrigerant Governor Workflow.png',focus:'The Analyzer proposes, AEA authorizes, and the Governor enforces only the approved boundary.',script:'NIRET, the Non-Invasive Refrigerant Entry Threshold, examines whether refrigerant-system entry is justified rather than assuming poor performance means incorrect charge. Airflow, coil condition, electrical faults, metering-device configuration and other explanations must be considered. The proposed HVAC Analyzer computes bounded adjustments; Admissible Execution Architecture authorizes or refuses them. The independent fail-closed Refrigerant Governor enforces only the current authorization. Automated refrigerant charging remains a proposed physical capability requiring validation and applicable compliance, not an established replacement for manufacturer charging procedures.'},
{title:'The TA-14 Authority Cloud',image:'TA-14 HVAC Authority Cloud Records.png',focus:'The original baseline remains intact as new annual records are added.',script:'The proposed TA-14 Authority Cloud would preserve equipment-specific commissioning, inspection, diagnostic, intervention and post-intervention records. Each event carries provenance, timestamp, integrity evidence and access controls. Homeowners could see their equipment history, contractors could access records needed for authorized service, and manufacturers or warranty administrators could receive permissioned or de-identified information appropriate to their purpose. Cryptographic integrity protects the recorded bytes after sealing; it does not independently validate sensor placement or diagnostic conclusions.'},
{title:'Manufacturer Intelligence and Warranty Accountability',image:'HVAC Lifetime Governance_ Manufacturer Intelligence.png',focus:'A verified operating history can improve reliability investigation without predetermining warranty outcomes.',script:'With appropriate permissions, manufacturers could examine year-by-year performance patterns across equipment models, climates and installation conditions. Warranty reviewers could evaluate documented commissioning, maintenance and pre-existing conditions against later failures. These records can help explain what was known and when; they do not automatically establish causation, homeowner responsibility or claim denial. Warranty decisions remain subject to actual contracts and consumer law. The commercial opportunity is better evidence, fairer claims, more informed engineering and reduced uncertainty.'},
{title:'The Future of HVAC: Founding Evaluation Partners',image:'TA-14 HVAC Lifetime Governance Infographic.png',focus:'Move from architectural demonstration to a bounded, independently reviewed pilot.',script:'TA-14 invites manufacturers, warranty organizations and qualified service partners to evaluate lifetime evidence records through a defined pilot. Agree on sensor validation, commissioning requirements, baseline integrity, consent, privacy, diagnostic reproducibility, intervention safety, claim review procedures and independent acceptance criteria. Distinguish implemented software, proposed hardware and cloud integrations, and actual independently demonstrated performance. No institutional endorsement, certification, warranty approval or proven cost savings is implied by this educational showroom.'}
] as const;
const pdf='/TA-14_The_HVAC_System_That_Remembers_Its_Entire_Life_V2_Manufacturer_Brief%20%281%29.pdf';
const img=(name:string)=>'/'+encodeURIComponent(name);


const learningCheckpoints=[
 {learned:'A lifelong HVAC record starts with verified commissioning, attributable measurements and an original baseline that later visits cannot silently overwrite.',next:'How Environmental Integrity Nodes collect the physical measurements and source context needed to establish that baseline.'},
 {learned:'Return-air and supply-air observations, airflow, static pressure, electrical data and inspections are evidence inputs—not automatic fault diagnoses or permissions to act.',next:'How the eight-link Admissible Execution Architecture keeps those measurements connected to continuity, admissibility and authorized consequences.'},
 {learned:'The AEA chain separates reality, records, computation, authority, execution and verified outcomes. The ability to propose a control action is not permission to execute it.',next:'How the HVAC Analyzer produces a Declared Diagnostic Determination only after the 14-step evidence baseline is complete and frozen.'},
 {learned:'A DDD is issued by the governed system from an evidence-bound baseline. The technician gathers and explains observations, but cannot create or alter that formal determination.',next:'Why refrigerant-system entry must first satisfy NIRET—and why a separate physical Governor enforces only specifically authorized adjustments.'},
 {learned:'NIRET establishes whether invasive refrigerant work is justified. The Analyzer proposes; AEA evaluates authority and standing NOW; the independent Governor enforces a bounded, fail-closed action.',next:'How commissioning, diagnostics, authorized interventions and post-work measurements could become a permissioned lifetime equipment history.'},
 {learned:'The proposed TA-14 Authority Cloud preserves the chronology of source records and later events. Integrity checks help reveal record changes, but do not by themselves establish measurement accuracy.',next:'How consented lifetime records could help manufacturers investigate equipment reliability and support fairer warranty examination.'},
 {learned:'Lifetime evidence may improve product engineering and warranty investigations, but recorded correlation cannot automatically establish causation, customer fault or warranty eligibility.',next:'What a founding manufacturer or warranty partner would actually evaluate in a bounded pilot—and which claims still need independent testing.'}
] as const;

const supplemental: Record<number, {name:string;title:string;caption:string}[]> = {
  0: [{name:'TA-14 HVAC Lifecycle Evidence Ecosystem.png',title:'Ecosystem architecture reference',caption:'The wider lifetime equipment evidence architecture, from measurement through governed service and outcome.'}],
  2: [{name:'The 8-Link Chain of Integration.png',title:'The eight-link chain reference',caption:'The AEA sequence, shown in a second teaching visual for independent examination.'}]
};
export default function Page(){
 const [speaking,setSpeaking]=useState<number|null>(null);
 const [failed,setFailed]=useState<Record<string,boolean>>({});
 useEffect(()=>()=>{if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel()},[]);
 function stop(){if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();setSpeaking(null)}
 function play(i:number){
   if(typeof window==='undefined'||!('speechSynthesis' in window))return;
   stop();
   const lesson=lessons[i];
   const utterance=new SpeechSynthesisUtterance('Lesson '+(i+1)+' of eight. '+lesson.title+'. '+lesson.script);
   utterance.lang='en-US';utterance.rate=.9;
   const voices=window.speechSynthesis.getVoices();
   utterance.voice=voices.find(v=>/samantha/i.test(v.name)&&/^en/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang))||null;
   utterance.onend=()=>setSpeaking(null);
   utterance.onerror=()=>setSpeaking(null);
   window.speechSynthesis.speak(utterance);
   setSpeaking(i);
 }
 const panel={background:'#102439',border:'1px solid #284e65',borderRadius:16,padding:24};
 const image=(filename:string,alt:string)=>{
   return failed[filename]?<p style={{background:'#1d3544',padding:20}}>This image could not load: {filename}. The lesson text remains available.</p>:
   <img src={img(filename)} loading="lazy" alt={alt} onError={()=>setFailed(prev=>({...prev,[filename]:true}))} style={{width:'100%',height:'auto',display:'block',background:'#18364b'}}/>;
 };
 return <main style={{minHeight:'100vh',background:'#061321',color:'#f2f8fc',fontFamily:'Arial,sans-serif',padding:'25px 18px'}}>
 <div style={{maxWidth:1190,margin:'auto'}}>
 <nav style={{display:'flex',gap:25,flexWrap:'wrap',marginBottom:48}}><Link href="/showrooms" style={{color:'#80dcee'}}>← All showrooms</Link><Link href="/showrooms/environmental-atmospheric" style={{color:'#80dcee'}}>Environmental & Atmospheric</Link></nav>
 <header style={{padding:'30px 0 55px'}}>
 <p style={{color:'#85dfef',letterSpacing:2,fontSize:12,fontWeight:800}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT ARCHITECTURAL SHOWROOM</p>
 <h1 style={{fontSize:'clamp(40px,7vw,83px)',letterSpacing:-2,lineHeight:1.04,maxWidth:1100}}>The HVAC System That <span style={{color:'#edc76a'}}>Remembers Its Entire Life.</span></h1>
 <p style={{fontSize:21,color:'#b9d2df',maxWidth:920,lineHeight:1.65}}>Imagine an HVAC system whose installation, operating condition, service history and proposed interventions can be reconstructed years later—from original measurements, not memories or assurances. TA-14 proposes the governed evidence architecture to make that possible.</p>
 <p style={{color:'#eed28b',fontSize:12}}>PROPOSED INTEGRATED ARCHITECTURE · INDEPENDENT TECHNICAL EVALUATION INVITED · NO MANUFACTURER ENDORSEMENT</p>
 <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:24}}>
 <a href="#lessons" style={{display:'inline-block',background:'#77deeb',color:'#052130',padding:'15px 22px',borderRadius:9,fontWeight:800,textDecoration:'none'}}>Explore all eight lessons ↓</a>
 <a href={pdf} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',border:'1px solid #78bed4',color:'#b7eef7',padding:'15px 22px',borderRadius:9,fontWeight:800,textDecoration:'none'}}>Read the 14-page manufacturer PDF ↗</a>
 <a href="#manufacturer-pilot" style={{display:'inline-block',border:'1px solid #668a9a',color:'#d9e7ec',padding:'15px 22px',borderRadius:9,textDecoration:'none'}}>Explore a manufacturer pilot ↓</a>
 </div>
 <p style={{fontSize:12,color:'#9db7c7',lineHeight:1.65,maxWidth:940}}>Educational concepts and illustrations. Physical refrigerant governance, lifetime cloud custody, and warranty integrations are proposed capabilities requiring independent validation. This page does not issue a real DDD, authorization or warranty determination.</p>
 </header>
 <section style={{...panel,marginBottom:45}}>
 <h2 style={{fontSize:29}}>Four distinct lanes. One preserved equipment history.</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
 {[
 ['01','REALITY & RECORD','Preserve measurements, inspection evidence, equipment identity and provenance.'],
 ['02','INTERPRETATION & DDD','Establish evidence-supported operating conditions and uncertainty.'],
 ['03','OPTIMIZATION & PROPOSAL','Propose corrections without self-authorizing intervention.'],
 ['04','OUTCOME UNDERSTANDING','Measure the resulting reality; preserve the earlier baseline.']
 ].map(([n,title,copy])=><div key={n} style={{background:'#172e43',padding:18,borderRadius:10}}><b style={{color:'#77deeb'}}>{n} · {title}</b><p style={{lineHeight:1.6,color:'#c4d9e4',fontSize:13}}>{copy}</p></div>)}
 </div><p style={{color:'#f0d080'}}>Execution boundary: Admissible Evidence + Applicable Authority + Established Standing → NOW</p>
 </section>

 <section style={{...panel,marginBottom:45}}>
 <p style={{color:'#77deeb',letterSpacing:2,fontSize:12,fontWeight:800}}>THE INTEGRATED EXPRESSION OF AEA</p>
 <h2 style={{fontSize:30,margin:'8px 0 18px'}}>Physical reality → trustworthy intelligence → authorized consequence</h2>
 <p style={{color:'#bdd7e3',lineHeight:1.7,maxWidth:1000}}>AEA is the foundational execution architecture. The Nodes, Recorder, AIR, ACA, Analyzer, NIRET and Refrigerant Governor fulfill different responsibilities; none may convert technical capability into permission on its own.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(165px,1fr))',gap:10,margin:'25px 0'}}>
 {[
 ['01','NODES + RECORDER','Capture physical observations and maintain source lineage.'],
 ['02','AIR','Preserve provenance, timestamps, continuity, uncertainty and admissibility context.'],
 ['03','ACA','Trace calculations, assumptions, model boundaries and proposed consequences.'],
 ['04','HVAC ANALYZER','Compare operating evidence with verified manufacturer specifications.'],
 ['05','AEA','Check admissible evidence, applicable authority and established standing NOW.'],
 ['06','GOVERNOR + OUTCOME','Enforce only a current authorized command; record the resulting reality.']
 ].map(([num,name,copy])=><div key={num} style={{padding:'19px 16px',background:'#162f42',border:'1px solid #375a70',borderRadius:11}}>
 <small style={{color:'#72dbe9',fontWeight:900}}>{num}</small><h3 style={{fontSize:14,margin:'12px 0 8px',color:'#fff'}}>{name}</h3><p style={{fontSize:12,lineHeight:1.6,color:'#c5d8e3'}}>{copy}</p>
 </div>)}
 </div>
 <p style={{color:'#f3ce76',lineHeight:1.65}}>No admissible evidence. No admissible execution. Commissioned once does not mean authorized forever.</p>
 </section>
 <section style={{...panel,marginBottom:45}}>
 <p style={{color:'#77deeb',letterSpacing:2,fontSize:12,fontWeight:800}}>THE FIELD SERVICE SEQUENCE</p>
 <h2 style={{fontSize:30,margin:'8px 0 18px'}}>What happens on an actual service visit?</h2>
 <p style={{color:'#bdd7e3',lineHeight:1.7}}>The showroom's teaching-image numbering is educational, not a replacement for the operational sequence. The proposed workflow keeps these steps in order:</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(175px,1fr))',gap:11,margin:'20px 0'}}>
 {[
 ['01','HPR-BL','Complete all required baseline steps and freeze the authentic evidence.'],
 ['02','NIRET','Decide whether refrigerant-system entry is justified using non-invasive evidence.'],
 ['03','DDD','The governed Analyzer issues the evidence-bound operating determination.'],
 ['04','INTERVENTION','Execute only an appropriately justified, currently authorized correction.'],
 ['05','HPR-V','Document and verify the post-intervention performance and outcome.']
 ].map(([n,title,copy])=><div key={n} style={{border:'1px solid #416477',padding:20,borderRadius:10,background:'#102c40'}}>
 <b style={{color:'#87e5f1'}}>{n} · {title}</b><p style={{color:'#c5dbe3',lineHeight:1.65,fontSize:13}}>{copy}</p></div>)}
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))',gap:14,marginTop:22}}>
 <div style={{background:'#182e3f',borderRadius:12,padding:22,border:'1px solid #335769'}}><h3 style={{marginTop:0}}>The technician documents the reality</h3><p style={{color:'#c8dde7',lineHeight:1.7}}>Identifies model and serial information, positions probes, observes equipment, photographs coils and components, records installed-part differences, completes guided steps, performs authorized physical work and explains findings to the homeowner.</p></div>
 <div style={{background:'#182e3f',borderRadius:12,padding:22,border:'1px solid #335769'}}><h3 style={{marginTop:0}}>The governed system issues the determination</h3><p style={{color:'#c8dde7',lineHeight:1.7}}>Verifies the evidence, checks applicable manufacturer specifications, preserves computational lineage, issues the DDD after the frozen baseline, evaluates proposed corrections and tests admissibility, authority and standing before execution.</p></div>
 </div>
 <p style={{color:'#e9ce83',lineHeight:1.6,marginTop:22}}>The technician is essential to authentic evidence collection—but does not author or alter the formal DDD, or override the independent fail-closed Governor.</p>
 </section>
 <section style={{...panel,marginBottom:45}}>
 <p style={{color:'#77deeb',letterSpacing:2,fontSize:12,fontWeight:800}}>ILLUSTRATIVE ENGINEERING EXAMINATION · NOT FIELD DATA</p>
 <h2 style={{fontSize:30,margin:'8px 0 18px'}}>What can two air-side nodes actually establish?</h2>
 <p style={{color:'#bdd7e3',lineHeight:1.75}}>Consider a hypothetical cooling system operating at <strong style={{color:'#fff'}}>1,600 CFM</strong>. If properly measured return-air enthalpy is <strong style={{color:'#fff'}}>31 Btu/lb of dry air</strong> and supply-air enthalpy is <strong style={{color:'#fff'}}>23 Btu/lb</strong>, the difference is 8 Btu/lb. Using the conventional approximate standard-air factor:</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,margin:'22px 0'}}>
 {[
 ['AIRFLOW','1,600 CFM','Hypothetical, measured at appropriate conditions'],
 ['ENTHALPY DIFFERENCE','8 Btu/lb','Return 31 − supply 23'],
 ['ESTIMATED AIR-SIDE TOTAL CAPACITY','57,600 Btu/h','4.5 × CFM × Δh ≈ 4.8 tons']
 ].map(([title,value,note])=><div key={title} style={{background:'#17374b',border:'1px solid #3c6a7c',borderRadius:12,padding:20}}><p style={{fontSize:11,letterSpacing:1,color:'#93e2ee',fontWeight:900}}>{title}</p><strong style={{fontSize:25,color:'#fff'}}>{value}</strong><p style={{fontSize:12,color:'#b5d3df',lineHeight:1.55}}>{note}</p></div>)}
 </div>
 <p style={{color:'#c7dce5',lineHeight:1.7}}>This estimate depends on air density, reliable flow and psychrometric measurements, sensor placement, mixing and uncertainty. It can help evaluate heat transfer; <strong>it cannot alone determine refrigerant charge, distinguish every fault, establish warranty coverage or authorize an intervention.</strong> The Analyzer must also examine electrical consumption, static pressure, coil and component inspections, operating context and the applicable manufacturer requirements.</p>
 </section>

 <section style={{...panel,marginBottom:45}}>
 <p style={{color:'#77deeb',letterSpacing:2,fontSize:12,fontWeight:800}}>HYPOTHETICAL DDD · ILLUSTRATIVE VALUES ONLY</p>
 <h2 style={{fontSize:30,margin:'8px 0 17px'}}>A real operating determination is not a repair suggestion.</h2>
 <p style={{color:'#c7dce6',lineHeight:1.75,maxWidth:1000}}>Suppose a fictional four-ton unit has been identified by model and serial number. In this teaching example, the manufacturer dataset is stipulated as verified and applicable; the measurements below are invented to illustrate the <strong>separation of evidence, determination, proposal and authorization</strong>. They are not real manufacturer specifications, certified measurements, or a validated TA-14 output.</p>
 <div style={{overflowX:'auto',margin:'20px 0'}}>
 <table style={{width:'100%',borderCollapse:'collapse',minWidth:620,textAlign:'left',fontSize:14}}>
 <thead><tr style={{background:'#244456'}}><th style={{padding:13}}>Evidence field</th><th style={{padding:13}}>Fictional applicable requirement</th><th style={{padding:13}}>Fictional observed condition</th><th style={{padding:13}}>Interpretation</th></tr></thead>
 <tbody>
 {[
 ['Equipment identity','Matched model, serial and configuration','Identity and installed configuration documented','Applicable specification basis established'],
 ['Airflow','1,500–1,700 CFM for stated mode','1,280 CFM','Below illustrative target'],
 ['External static pressure','Maximum 0.50 in. w.c. at specified test point','0.83 in. w.c.','Elevated; inspect actual restrictions and measurement context'],
 ['Blower capacitor','7.5 µF ± 5% for matched component','6.4 µF','Outside illustrative component tolerance'],
 ['Coil inspection','Authentic image and condition report required','Image received; fouling not yet confirmed','Do not infer fouling from airflow alone'],
 ['Refrigerant evidence','NIRET prerequisites and applicable methods','Airflow and electrical deviations unresolved','Refrigerant entry not justified on this record']
 ].map(([field,required,observed,meaning],i)=><tr key={field} style={{background:i%2?'#0e2536':'#183349',borderBottom:'1px solid #34566a'}}><td style={{padding:12,fontWeight:800}}>{field}</td><td style={{padding:12,color:'#c5dce7'}}>{required}</td><td style={{padding:12,color:'#c5dce7'}}>{observed}</td><td style={{padding:12,color:'#f1d48f'}}>{meaning}</td></tr>)}
 </tbody></table></div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(235px,1fr))',gap:13,margin:'22px 0'}}>
 {[
 ['01 · RECORD','Preserve original airflow, static-pressure and capacitance measurements; equipment identity, photos, timestamps and uncertainty.'],
 ['02 · DDD','After the complete 14-step baseline is frozen, the governed Analyzer may determine documented airflow and component deviations.'],
 ['03 · PROPOSED CORRECTION','Inspect the actual airflow restriction and evaluate the out-of-tolerance capacitor for replacement. No refrigerant charging is proposed.'],
 ['04 · AEA DISPOSITION','Illustrative HOLD on execution until the specific correction, qualified actor, authorization, standing and current conditions are established.'],
 ['05 · OUTCOME','No corrected performance is claimed until an authorized repair occurs and HPR-V documents a new measurement event.']
 ].map(([title,copy])=><div key={title} style={{background:'#17364a',border:'1px solid #41677b',borderRadius:12,padding:19}}><b style={{color:'#93e5f3'}}>{title}</b><p style={{color:'#c9dce6',fontSize:13,lineHeight:1.7}}>{copy}</p></div>)}
 </div>
 <p style={{color:'#eacb80',lineHeight:1.7}}>Teaching conclusion: the DDD identifies supported equipment conditions; NIRET evaluates refrigerant entry; optimization proposes a correction; AEA governs whether that specific correction may be executed NOW. These are separate events with distinct evidence and authority.</p>
 </section>
  <section id="lessons" style={{scrollMarginTop:25}}>
 <p style={{color:'#77deeb',letterSpacing:2,fontSize:12}}>COMPLETE · SCROLLABLE · EIGHT-LESSON EXAMINATION</p>
 <h2 style={{fontSize:34}}>Every lesson and every visual, in sequence</h2>
 <p style={{lineHeight:1.65,color:'#b6d0de'}}>All eight main teaching images and both additional architecture references are displayed below. Scroll normally to read the whole experience. No image must be unlocked, selected, or advanced to appear.</p>
 <nav aria-label="Jump to a lesson" style={{display:'flex',gap:8,flexWrap:'wrap',margin:'24px 0 40px'}}>
 {lessons.map((l,i)=><a key={l.title} href={'#lesson-'+String(i+1).padStart(2,'0')} style={{border:'1px solid #315267',background:'#10283b',color:'#b8e9f5',padding:'10px 12px',borderRadius:9,textDecoration:'none',fontSize:12}}>{String(i+1).padStart(2,'0')} · {l.title}</a>)}
 </nav>
 {lessons.map((lesson,i)=><Fragment key={lesson.title}><article id={'lesson-'+String(i+1).padStart(2,'0')} style={{...panel,padding:0,overflow:'hidden',marginBottom:0,scrollMarginTop:24}}>
 <div style={{padding:'24px 27px'}}>
 <p style={{color:'#77deeb',fontSize:12,fontWeight:800}}>LESSON {String(i+1).padStart(2,'0')} / 08</p>
 <h3 style={{fontSize:'clamp(25px,4vw,39px)',margin:'8px 0'}}>{lesson.title}</h3>
 <p style={{color:'#eed38e',lineHeight:1.6}}>{lesson.focus}</p></div>
 {image(lesson.image,'TA-14 lesson '+(i+1)+': '+lesson.title)}
 {(supplemental[i]||[]).map(extra=><div key={extra.name} style={{padding:'24px 20px 4px',background:'#0b1f30'}}>
 <h4 style={{fontSize:21,margin:'4px 7px 12px'}}>{extra.title}</h4>
 {image(extra.name,extra.title)}
 <p style={{color:'#abc8d9',lineHeight:1.65,fontSize:13,padding:'4px 7px 8px'}}>{extra.caption}</p>
 </div>)}
 <div style={{padding:27}}>
 <h4 style={{fontSize:20,margin:'0 0 12px'}}>▶ SAMANTHA — EXPLAIN · LESSON {String(i+1).padStart(2,'0')}</h4>
 <button type="button" onClick={()=>speaking===i?stop():play(i)} style={{padding:'12px 18px',background:'#77deeb',border:0,borderRadius:8,color:'#042130',fontWeight:800,cursor:'pointer'}}>{speaking===i?'■ Stop narration':'▶ Play English narration'}</button>
 <p style={{fontSize:12,color:'#8daab9',lineHeight:1.65}}>Samantha is selected when available on the device; another English voice is used otherwise. Audio is optional. The complete explanation is always open below.</p>
 <div style={{border:'1px solid #35566b',borderRadius:10,padding:'15px 19px',marginTop:16,background:'#152d3f'}}>
 <p style={{fontSize:12,fontWeight:800,color:'#8cdeee',letterSpacing:1}}>FULL NARRATION TRANSCRIPT</p>
 <p style={{lineHeight:1.8,color:'#d2e3ed',fontSize:15,marginBottom:0}}>{lesson.script}</p>
 </div>
 </div></article>
 {i<learningCheckpoints.length&&<aside aria-label={'Learning checkpoint '+(i+1)+' to '+(i+2)} style={{margin:'20px 0 58px',padding:'clamp(21px,3vw,38px)',border:'1px solid #38647a',borderRadius:15,background:'linear-gradient(135deg,#0e3042,#081c2b 65%,#173449)'}}>
 <div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',borderBottom:'1px solid #35596d',paddingBottom:15,marginBottom:19}}>
 <b style={{color:'#88deee',fontSize:12,letterSpacing:1.5}}>LEARNING CHECKPOINT</b>
 <span style={{color:'#a3c7d6',fontSize:12}}>{String(i+1).padStart(2,'0')} → {String(i+2).padStart(2,'0')}</span>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:30}}>
 <div><p style={{color:'#f1cf78',fontWeight:900,fontSize:12,letterSpacing:1.3}}>✓ WHAT YOU'VE LEARNED</p><h3 style={{fontSize:'clamp(22px,3vw,30px)',margin:'9px 0'}}>What we established</h3><p style={{color:'#d0e2eb',fontSize:16,lineHeight:1.8}}>{learningCheckpoints[i].learned}</p></div>
 <div><p style={{color:'#f1cf78',fontWeight:900,fontSize:12,letterSpacing:1.3}}>→ WHAT YOU'LL LEARN NEXT</p><h3 style={{fontSize:'clamp(22px,3vw,30px)',margin:'9px 0'}}>{lessons[i+1].title}</h3><p style={{color:'#d0e2eb',fontSize:16,lineHeight:1.8}}>{learningCheckpoints[i].next}</p>
 <a href={'#lesson-'+String(i+2).padStart(2,'0')} style={{display:'inline-block',padding:'8px 0',marginTop:4,color:'#82e3f5',fontWeight:800,textDecoration:'underline',textUnderlineOffset:6}}>Continue to lesson {String(i+2).padStart(2,'0')} ↓</a>
 </div>
 </div></aside>}
 </Fragment>)}
 </section>

 <section style={{...panel,marginTop:45}}>
 <p style={{color:'#77deeb',letterSpacing:2,fontSize:12,fontWeight:800}}>THE LIFETIME EQUIPMENT RECORD</p>
 <h2 style={{fontSize:30,margin:'8px 0 17px'}}>One machine. Many evidence events. No overwritten history.</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:12}}>
 {[
 ['INSTALLATION','Commissioning baseline','Installed configuration, manufacturer match, original operating measurements and attributable inspection evidence.'],
 ['YEAR 01','Annual operating record','Frozen measurements, observed changes, required maintenance and a current evidence-based determination.'],
 ['YEAR 03','Component change','Original part identity, replacement justification, authorized repair, and independently verifiable post-record.'],
 ['YEAR 07','Warranty investigation','Reconstruct historical conditions, compare actual policy terms, and examine the evidence without automatically assigning fault.']
 ].map(([period,title,copy])=><div key={period} style={{background:'#172f43',border:'1px solid #375a70',padding:20,borderRadius:10}}><p style={{color:'#83e3f0',fontSize:12,fontWeight:900}}>{period}</p><h3 style={{margin:'8px 0',fontSize:18}}>{title}</h3><p style={{color:'#c5dbe6',lineHeight:1.7,fontSize:13}}>{copy}</p></div>)}
 </div>
 <p style={{color:'#a9c9d8',lineHeight:1.65}}>Illustrative chronology. The design proposes permissioned, auditable records for homeowners, contractors, manufacturers and warranty administrators; it does not imply a deployed cloud service or automatic warranty entitlement.</p>
 </section>
  <section id="manufacturer-pilot" style={{...panel,marginTop:45,scrollMarginTop:24}}>
 <p style={{color:'#77deeb',letterSpacing:2,fontSize:12,fontWeight:800}}>INSTITUTIONAL EVALUATION INVITATION</p>
 <h2 style={{fontSize:30}}>Manufacturer and warranty evaluation</h2>
 <p style={{color:'#c4d8e2',lineHeight:1.75,maxWidth:950}}>A proposed paid evaluation would test how equipment-specific evidence can improve engineering decisions, field service, product reliability and fair warranty review—not ask an institution to accept an unvalidated claim.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12,margin:'22px 0'}}>
 {[
 ['PHASE 01','Define and verify','Agree on equipment models, authentic specs, sensor calibration, privacy and ownership, commissioning criteria, scope and independent review.'],
 ['PHASE 02','Collect and challenge','Run bounded commissioning and maintenance cases; test gaps, changes in context, incorrect parts, intervention refusal and record integrity.'],
 ['PHASE 03','Report measured value','Evaluate reproducibility, diagnostic agreement, record completeness, technician time, fault attribution limitations and warranty-review usability.']
 ].map(([phase,title,copy])=><div key={phase} style={{background:'#17364a',border:'1px solid #3c6478',borderRadius:12,padding:22}}><small style={{color:'#88e2ef',fontWeight:900}}>{phase}</small><h3 style={{fontSize:19}}>{title}</h3><p style={{color:'#c5dbe4',fontSize:13,lineHeight:1.7}}>{copy}</p></div>)}
 </div>
 <div style={{background:'#0c2e40',border:'1px solid #45738a',borderRadius:12,padding:22,margin:'20px 0'}}>
 <h3 style={{fontSize:21,margin:'0 0 12px'}}>What an evaluation partner receives</h3>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:13}}>
 {[
 ['Architecture mapping','An equipment-specific map of evidence acquisition, ACA computation, DDD issuance, AEA authorization and outcome custody.'],
 ['Documented demonstration','A bounded set of commissioning and service scenarios, with source-to-conclusion traceability and explicit unsupported conditions.'],
 ['Pilot evaluation report','Defined results, limitations, open risks, repeatability checks and potential next steps—not an automatically favorable determination.']
 ].map(([title,copy])=><div key={title}><b style={{color:'#99e4f0'}}>{title}</b><p style={{fontSize:13,color:'#c7dce5',lineHeight:1.65}}>{copy}</p></div>)}
 </div></div>
 <p style={{color:'#b8d0dd',fontSize:13,lineHeight:1.65}}>Evaluation scope, data access, cost, deliverables and technical acceptance criteria are agreed in writing. Success is not assumed. Warranty eligibility remains subject to the actual contract and applicable consumer law.</p>
 <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:20}}><Link href="/pricing" style={{padding:'14px 20px',background:'#77deeb',color:'#062230',borderRadius:9,textDecoration:'none',fontWeight:800}}>Request a scoped evaluation →</Link><Link href="/showrooms/founding-institutional-sponsorship" style={{padding:'14px 20px',border:'1px solid #537c91',color:'#a5e6f3',borderRadius:9,textDecoration:'none'}}>Founding institutional support →</Link><a href={pdf} target="_blank" rel="noopener noreferrer" style={{padding:'14px 20px',border:'1px solid #537c91',color:'#a5e6f3',borderRadius:9,textDecoration:'none'}}>Technical brief PDF ↗</a></div>
 </section>
 <footer style={{marginTop:65,padding:'35px 0',borderTop:'1px solid #294756',fontSize:12,color:'#91aebb'}}>TA-14 · No admissible evidence. No admissible execution. · Architectural demonstration; not field authorization.</footer>
 </div></main>
}
