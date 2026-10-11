'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';

const lessons=[
['The Promise','What was actually pledged?','A public commitment establishes an intention or selected duty, not proof that an environmental condition was continuously fulfilled. Identify the precise commitment, accountable party, period, metric, and verification method.'],
['Human Infrastructure','Whose exposure and well-being are at stake?','A building contains people whose exposures and operating conditions change. The human consequence matters, but a building measurement is not itself a clinical diagnosis or proof of causation.'],
['Regulatory Obligation','Which law or duty actually applies?','Separate statutory duties, contractual obligations, operating policies, and voluntary pledges. Determine jurisdiction, covered building, dutyholder, provision, and effective date before asserting compliance.'],
['Measurement Limits','What can the instruments actually establish?','A sensor produces an observation with limitations. Preserve calibration, placement, averaging method, uncertainty, missing data, operating context, and independent corroboration.'],
['Atmospheric Integrity Records','What survives over time?','AIR preserves the original observation and its provenance, corrections without overwriting, uncertainty, challenges, decisions, execution records, and subsequent outcomes.'],
['The Authority Boundary','Who has standing to act?','An analyst, AI system, or instrument may identify a condition without having authority to intervene. Establish applicable authority and standing for the actor, asset, location, action, and time.'],
['The Intervention','From proposed action to authorized execution','Examine Reality, Record, Continuity, Admissibility, Binding, Commit, Execution, and Outcome. An unsupported compliance claim can remain on HOLD while separately authorized emergency protective action proceeds. Emergency action does not retroactively validate an unsupported compliance claim.'],
['The Verified Outcome','Did the intervention actually work?','This is a hypothetical teaching scenario, not a verified result. Uncalibrated or unverified sensor measurements cannot justify an ALLOW or PASS disposition. Compare post-action evidence with an admissible baseline, accounting for method, duration, uncertainty, and changed context. A bounded improvement does not automatically prove universal compliance or a health outcome.'],
['Independent Examination','Can another institution reproduce the finding?','Give the examiner the original record, method, authority basis, limits, and decision trail. Document disagreements and return only the supported ALLOW, HOLD, DENY, or ESCALATE disposition.'],
['The Institutional Invitation','From technical examination to a funded pilot','Invite a regulator or institutional partner to define a bounded, time-limited examination with roles, privacy, success criteria, falsifiers, and independent review. A pilot is not regulatory endorsement.']
];
// GitHub uploads were placed directly in apps/web/public; retain the packaged subfolder as a fallback.
const assetRoots=['/','/environmental-accountability/'];
const imageFiles=[
'TA14_Environmental_Accountability_01_The_Promise.png',
'TA14_Environmental_Accountability_02_Human_Infrastructure.png',
'TA14_Environmental_Accountability_03_Regulatory_Obligation.png',
'TA14_Environmental_Accountability_04_Measurement_Limits.png',
'TA14_Environmental_Accountability_05_Atmospheric_Integrity_Records.png',
'TA14_Environmental_Accountability_06_Authority_Boundary.png',
'TA14_Environmental_Accountability_07_Authorized_Intervention.png',
'TA14_Environmental_Accountability_08_Verified_Outcome.png',
'TA14_Environmental_Accountability_09_Independent_Examination.png',
'TA14_Environmental_Accountability_10_Institutional_Invitation.png'
];
// Original GitHub upload filenames verified in apps/web/public. These are illustrative title matches, not independently examined records.
const originalFilenameCandidates:Record<number,string[]>={
 0:['01-proof-over-promise-proof-is-not-permission.png'],
 1:['01-human-consequence-boundary.png'],
 3:['From Measurement to Environmental Evidence.png'],
 4:['Atmospheric Integrity Record Infographic.png'],
 5:['The Authority Boundary_ Environmental Governance Gate.png'],
 6:['From Evidence to Authorized Action.png'],
 7:['The Verified Outcome Infographic.png'],
 8:['The Independent Governance Overlay.png'],
 9:['01-pilot-ownership.png']
};
const referencePdf='TA14_Environmental_Accountability_Institutional_Examination_and_Pilot_Reference_v3.0.pdf';
const chain=['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'];
export default function EnvironmentalAccountabilityShowroom(){
 const [open,setOpen]=useState<number|null>(null);
 const [imageUrls,setImageUrls]=useState<string[]>(Array(imageFiles.length).fill(''));
 const [pdfUrl,setPdfUrl]=useState('');
 useEffect(()=>{
  let active=true;
  const findAsset=async (file:string)=>{
   for(const root of assetRoots){
    const url=root+encodeURIComponent(file);
    try{
     const response=await fetch(url,{method:'HEAD'});
     const type=response.headers.get('content-type')||'';
     if(response.ok&&type.includes(file.endsWith('.pdf')?'pdf':'image'))return url;
    }catch{}
   }
   return '';
  };
  Promise.all(imageFiles.map(async(file,i)=>{
   const primary=await findAsset(file);
   if(primary)return primary;
   for(const candidate of originalFilenameCandidates[i]||[]){
    const url=await findAsset(candidate);
    if(url)return url;
   }
   return '';
  })).then(urls=>{if(active)setImageUrls(urls);});
  findAsset(referencePdf).then(url=>{if(active)setPdfUrl(url);});
  return ()=>{active=false;};
 },[]);
 return <main style={{minHeight:'100vh',background:'#03101a',color:'#f1f8fb',fontFamily:'Arial,sans-serif'}}>
 <div style={{maxWidth:1150,margin:'auto',padding:'28px 20px 90px'}}>
 <nav style={{display:'flex',gap:22,flexWrap:'wrap',fontSize:12}}><Link href="/" style={{color:'#8fe9fb'}}>← TA14 EXCHANGE</Link><Link href="/showrooms" style={{color:'#8fe9fb'}}>ALL SHOWROOMS</Link><Link href="/environmental-integrity-governance" style={{color:'#8fe9fb'}}>EIG ARCHITECTURE</Link></nav>
 <header style={{padding:'75px 0 45px',borderBottom:'1px solid #28516a'}}>
 <p style={{color:'#6ce6e9',fontSize:12,fontWeight:800,letterSpacing:2}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT INSTITUTIONAL PRE-EXAMINATION</p>
 <h1 style={{fontSize:'clamp(42px,7vw,82px)',lineHeight:1.02,margin:'20px 0'}}>ENVIRONMENTAL<br/><span style={{color:'#82e5c1'}}>ACCOUNTABILITY</span></h1>
 <p style={{fontSize:23,maxWidth:800,lineHeight:1.45}}>From clean-air commitments to admissible evidence, applicable authority, and verified human consequence.</p>
 <p style={{color:'#f3d18b',fontSize:12,fontWeight:800}}>PRE-EXAMINATION · PROPOSED ARCHITECTURE · NO REGULATORY ENDORSEMENT · NO CERTIFICATION</p>
 <p style={{maxWidth:850,color:'#b3cbd5',lineHeight:1.7}}>This ten-part guided technical examination distinguishes public promises, environmental observations, legal duties, governed interventions, and reproducible findings. Illustrative scenarios are not field records, legal opinions, or validated health outcomes.</p>
 <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:24}}><a href="#lessons" style={{padding:'14px 18px',background:'#84e4c1',color:'#03101a',borderRadius:9,fontWeight:800,textDecoration:'none'}}>START THE TEN LESSONS ↓</a><Link href="/work-with-ta14" style={{padding:'14px 18px',border:'1px solid #7dd7ef',borderRadius:9,color:'#a4ecfa',textDecoration:'none'}}>REQUEST AN INSTITUTIONAL EXAMINATION →</Link></div>
 </header>
 <section style={{margin:'40px 0',padding:24,border:'1px solid #245269',borderRadius:16}}><h2>One governing question</h2><p style={{fontSize:20,lineHeight:1.5}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{chain.map(s=><span key={s} style={{border:'1px solid #386477',borderRadius:7,padding:9,fontSize:10,fontWeight:800}}>{s}</span>)}</div></section>
 {Boolean(pdfUrl)&&<section style={{padding:20,marginBottom:20,border:"1px solid #2e6475",borderRadius:12}}><a href={pdfUrl} download style={{color:"#83eac7",fontWeight:900}}>DOWNLOAD INSTITUTIONAL REFERENCE v3.0 (PDF) ↓</a></section>}
 <section id="lessons"><h2 style={{fontSize:32}}>Ten numbered examinations</h2><p style={{color:'#a8c4ce'}}>Free scrolling. Each lesson has a separately accessible narration script. Samantha audio is not yet published. Illustrations and reference materials appear only when their configured public files are available. Images are educational illustrations, not independent evidence. Existing public images are not automatically treated as evidence for this examination.</p>
 {lessons.map(([title,question,script],i)=><article key={title} id={`lesson-${i+1}`} style={{margin:'22px 0',border:'1px solid #24475a',borderRadius:16,overflow:'hidden',background:'#071c28'}}>
 {i===7&&Boolean(imageUrls[i])&&<p role="note" style={{margin:20,padding:15,border:'1px solid #e3b96c',borderRadius:8,color:'#ffe0a1',lineHeight:1.5}}><strong>Evidence warning:</strong> The following image is a hypothetical illustration. Any depicted PASS, ALLOW, verified outcome, or admissibility conclusion is NOT established where sensor calibration, provenance, baseline, and independent verification are missing. The appropriate evidentiary disposition remains HOLD pending examination.</p>}
 {Boolean(imageUrls[i])&&<img src={imageUrls[i]} alt={`${String(i+1).padStart(2,"0")}: ${title} — ${question}`} loading="lazy" style={{width:"100%",height:"auto",display:"block"}}/>}
 {!imageUrls[i]&&<p role="status" style={{margin:'18px 24px 0',color:'#f3d18b',fontSize:13}}>Illustration not yet verified at its configured public path. Lesson text remains available.</p>}
 <div style={{padding:'22px 24px'}}><p style={{color:'#78e7c3',fontWeight:900,letterSpacing:2,margin:'0 0 9px'}}>{String(i+1).padStart(2,'0')} / 10</p><h3 style={{fontSize:27,margin:'0 0 8px'}}>{title}</h3><p style={{color:'#c1dce7',fontSize:17,margin:'0 0 14px'}}>{question}</p><p style={{color:'#b1c9d2',lineHeight:1.7}}>{script}</p><button type="button" onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i} style={{background:'transparent',border:'1px solid #51889a',color:'#a8effc',padding:'11px 14px',borderRadius:8,cursor:'pointer'}}>{open===i?'HIDE':'SHOW'} NARRATION SCRIPT</button>{open===i&&<div style={{padding:16,marginTop:14,background:'#0e2a37',borderRadius:8,lineHeight:1.75}}>{script}</div>}</div></article>)}</section>
 <section style={{padding:'35px 0',borderTop:'1px solid #28516a'}}><h2>Institutional engagement pathway</h2><p style={{color:'#bbd0d8',lineHeight:1.7}}>A prospective authority or partner may request a briefing, submit a bounded proposition for examination, or discuss a funded pilot with independent review. The applicable law, scope, site, duties, data rights, and evaluation criteria must be established locally.</p><Link href="/work-with-ta14" style={{color:'#82e5c1',fontWeight:900}}>DISCUSS A BOUNDED EXAMINATION →</Link></section>
 <footer style={{color:'#7d9daa',fontSize:12}}>TA14 ENVIRONMENTAL ACCOUNTABILITY INITIATIVE · INDEPENDENT TECHNICAL PRE-EXAMINATION · NO INSTITUTIONAL ENDORSEMENT</footer>
 </div></main>
}
