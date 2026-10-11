'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';

const chapters=[
{title:'When Community Air Becomes Evidence',file:'Community Air Becomes Evidence.png',script:'Chapter one. Tamale, Northern Ghana. Community air is a public health concern. TA14 asks how observed conditions can become defensible records, locally authorized interventions, and verified outcomes. This is an independent educational demonstration, not a report of field measurements.'},
{title:'Community Reality',file:'Community Reality_ Air Pollution in Tamale.png',script:'Chapter two. Household cooking smoke, open burning, seasonal Harmattan dust and daily activity can create different exposure pathways. Observe conditions without assuming the source, individual dose, or health effect. Document what is seen and what remains uncertain.'},
{title:'Environmental Observation',file:'Environmental Observation Evidence Guide.png',script:'Chapter three. Define the pollutant, units and averaging period. Preserve device identity, placement, timestamp, meteorology and quality flags. A low cost sensor reading is a candidate observation, not automatic proof of exposure or harm. All numbers illustrated are hypothetical.'},
{title:'Atmospheric Integrity Records',file:'Atmospheric Integrity Records in Tamale.png',script:'Chapter four. An Atmospheric Integrity Record preserves original readings, provenance, context, changes and uncertainty. Keep raw and adjusted data separate. Preserve access history and protect household privacy. The illustrated record is fictional.'},
{title:'Community Intervention',file:'Community Intervention_ From Education to Evidence.png',script:'Chapter five. Community education, household consent, proposed changes and implementation must be documented. Who requested the action? Who has permission? What was actually done? The illustrations are teaching scenarios, not evidence that a program was implemented.'},
{title:'Evidence Admissibility',file:'Evidence Admissibility in Tamale.png',script:'Chapter six. Examine data quality, comparability, context and claim-specific sufficiency. A change in monitored air quality does not automatically prove personal exposure reduction or health benefit. The TA14 dispositions are allow, hold, deny and escalate. This showroom makes no formal disposition.'},
{title:'Local Execution Authority',file:'Local Execution Authority in Tamale.png',script:'Chapter seven. Capability is not authority. Establish consent, applicable local permission, responsible actors and bounded scope before execution. TA14 does not grant authority in Ghana and cannot override household, health service or regulatory requirements.'},
{title:'Verified Outcomes',file:'Verified Air Quality Outcomes in Tamale.png',script:'Chapter eight. Compare like with like after intervention, accounting for seasonal dust, weather, occupancy, instruments and activity. Record both successes and uncertainty. Environmental improvement is not proof of a health benefit. The displayed charts and results are hypothetical.'}
];
const pdf='/TA14_Tamale_Community_Air_Evidence_Technical_Reference_v2.3%20(1).pdf';
export default function TamaleShowroom(){
 const [playing,setPlaying]=useState(-1);
 const [answers,setAnswers]=useState({evidence:false,authority:false,standing:false});
 useEffect(()=>()=>{if(typeof window!=='undefined')window.speechSynthesis?.cancel()},[]);
 function speak(i:number){if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();if(playing===i){setPlaying(-1);return;}const u=new SpeechSynthesisUtterance(chapters[i].script);u.lang='en-US';u.rate=0.9;const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>/samantha/i.test(v.name))||voices.find(v=>v.lang.startsWith('en')&&/female/i.test(v.name))||null;u.onend=()=>setPlaying(-1);u.onerror=()=>setPlaying(-1);setPlaying(i);window.speechSynthesis.speak(u);}
 const keys=['evidence','authority','standing'] as const;
 const all=keys.every(k=>answers[k]);
 return <main style={{background:'#f4f7fa',color:'#09223c',minHeight:'100vh',fontFamily:'Arial,sans-serif'}}>
 <div style={{maxWidth:1160,margin:'auto',padding:'24px 20px 90px'}}>
 <nav style={{display:'flex',gap:20,flexWrap:'wrap',fontSize:14}}><Link href="/showrooms/environmental-atmospheric">← Environmental & Atmospheric</Link><Link href="/showrooms">All Showrooms →</Link></nav>
 <header style={{padding:'60px 0 36px'}}>
 <p style={{letterSpacing:2,fontWeight:700,color:'#13728a'}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT TECHNICAL PRE-EXAMINATION</p>
 <h1 style={{fontSize:'clamp(38px,6vw,72px)',lineHeight:1.06,margin:'20px 0'}}>When Community Air Becomes Evidence</h1>
 <p style={{fontSize:25,color:'#126f86'}}>Tamale, Northern Ghana</p>
 <p style={{fontSize:20,maxWidth:850}}>From household exposure concerns to defensible environmental evidence, locally authorized intervention, and verified outcomes.</p>
 <p style={{padding:16,background:'#e7eef3',borderLeft:'4px solid #126f86',lineHeight:1.6}}>Independent educational demonstration. All pictured people, scenarios, measurements, charts and decisions are illustrative. No field data verification, frozen baseline, formal TA14 disposition, partnership, Ghana Health Service, Quali-Breeze, Kombian James Libaarbor or Air Aware Labs endorsement is claimed.</p>
 <a href={pdf} download style={{display:'inline-block',padding:'15px 22px',background:'#073451',color:'white',borderRadius:8,textDecoration:'none',fontWeight:700}}>↓ Download Technical Governance Reference v2.3 (PDF)</a>
 </header>
 <p style={{color:'#526779'}}>Eight illustrated chapters. Select Play Narration for browser speech; a Samantha voice is used when available. Images remain independently scrollable.</p>
 {chapters.map((c,i)=><section id={'chapter-'+(i+1)} key={c.file} style={{background:'white',margin:'30px 0',padding:'clamp(16px,3vw,34px)',borderRadius:16,boxShadow:'0 3px 20px #0b25320d'}}>
 <p style={{fontWeight:800,color:'#127b91',letterSpacing:2}}>CHAPTER {String(i+1).padStart(2,'0')} / 08</p>
 <h2 style={{fontSize:'clamp(24px,3vw,36px)',margin:'10px 0 20px'}}>{c.title}</h2>
 <img src={'/'+encodeURIComponent(c.file)} alt={'Chapter '+(i+1)+': '+c.title+' — illustrative educational infographic'} style={{width:'100%',height:'auto',borderRadius:8}} loading="lazy"/>
 <div style={{display:'flex',gap:12,alignItems:'center',marginTop:20,flexWrap:'wrap'}}><button onClick={()=>speak(i)} style={{border:0,borderRadius:8,background:'#073451',color:'white',padding:'12px 20px',cursor:'pointer'}}>{playing===i?'■ Stop narration':'▶ Play narration'}</button><span style={{fontSize:14,color:'#536779'}}>Narration {i+1} · browser voice</span></div>
 <p style={{fontSize:17,lineHeight:1.7}}>{c.script}</p>
 </section>)}
 <section style={{background:'white',borderRadius:16,padding:'32px',marginTop:36}}>
 <h2>Interactive Authority Exercise</h2><p><strong>Hypothetical case:</strong> A community monitor reports elevated PM2.5. A household cookstove change is proposed. Before any action, examine the three distinct gates.</p>
 {keys.map((k,i)=><label key={k} style={{display:'block',padding:'12px 0'}}><input type="checkbox" checked={answers[k]} onChange={e=>setAnswers(s=>({...s,[k]:e.target.checked}))}/> {['Admissible Evidence — instrument quality, context and claim sufficiency independently established','Applicable Authority — consent and required local permissions established','Established Standing — requester and decision-maker are entitled to act for this scope'][i]}</label>)}
 <p style={{padding:18,background:'#edf3f6',borderRadius:8}}><strong>Illustrative result: {all?'READY FOR INDEPENDENT REVIEW — NOT AUTOMATICALLY ALLOW':'HOLD'}</strong><br/>{all?'All three gates are asserted, but must be independently verified before any bounded disposition.':'One or more required gates remains unestablished. Continue investigation; do not treat a reading as execution permission.'}</p>
 <p style={{fontWeight:700}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p>
 <p>Possible dispositions: ALLOW / HOLD / DENY / ESCALATE. No live decision is made here.</p>
 </section>
 <footer style={{marginTop:50,borderTop:'1px solid #cad7de',paddingTop:24,fontSize:14,color:'#536779'}}>TA14 Authority Governance Institution · Independent educational pre-examination · Baseline not frozen · No formal disposition · Technical reference v2.3</footer>
 </div></main>;
}
