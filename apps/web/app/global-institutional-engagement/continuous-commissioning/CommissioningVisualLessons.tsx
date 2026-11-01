'use client';
import {useState} from 'react';
const images=[
['The Building’s Promise','TA-14_ The Building’s Promise.png','Owner requirements define what the building is meant to do. The Basis of Design connects those requirements to intended system operation. Commissioning checks installation, sequences, performance and acceptance criteria. This makes a documented starting point, not a permanent authorization for every future action. A later sensor replacement, control update, changed schedule or altered load can invalidate the assumption that the accepted condition still exists. TA-14 preserves this foundation and asks whether the next proposed consequence remains justified now.'],
['Systems Working Together','Systems Working Together_ TA-14 Integration.png','Master Systems Integration connects the equipment, control points, protocols and operational relationships that allow a building to function together. But communication does not establish measurement accuracy, and functioning connections do not grant action authority. An online meter can report the wrong value. A BAS point can carry incorrect scaling or a stale timestamp. MSI makes signals understandable and traceable; commissioning confirms performance against requirements. The proposed TA-14 gate independently examines whether a particular consequence has sufficient evidence, authority and standing.'],
['The Reality of Record','TA-14_ The Reality of Record.png','A dashboard displays signals; a defensible record preserves their identities, timestamps, lineage, uncertainty and continuity. The synthetic air-handler demonstration requires two critical readings no more than 120 seconds old. If a critical point is 310 seconds old, communication can remain online while evidence is no longer sufficient for the proposed setpoint change. The correct result is HOLD, not an invented measurement or an automatic permission. A valid record must also connect to accepted requirements and expose contradictions rather than conceal them.'],
['The Admissibility Boundary','TA-14_ The Admissibility Boundary.png','This is the independent crossing from the ability to act to legitimate authorization for a particular consequence. First: is there enough admissible, relevant, current and attributable evidence? Second: does applicable owner or delegated authority permit this action within these limits? Third: is the required standing established for this subject, equipment, site and action class? The question is evaluated NOW, against the actual proposed action. Connection is not authority. Understanding is not permission. Historical acceptance is not a blanket future grant.'],
['The Decision Gate','TA-14 Decision Gate Infographic.png','The proposed gate applies declared, deterministic rules to a specific bounded command. ALLOW means the requirements are met for that action, subject to revalidation at commit. HOLD means current evidence or another remediable prerequisite is missing, stale or contradictory. DENY means the proposal violates a declared policy constraint. ESCALATE calls for an authorized reviewer or designated process. The decision must show the exact supporting records, rule version and reasons. In this synthetic showroom, no real actuator is connected and mandatory protective controls remain outside the experimental gate.'],
['Binding and Commitment','TA-14 Binding and Commitment Dashboard.png','A prior ALLOW is not timeless. Binding connects the decision to an exact target asset, command, operating bounds, evidence snapshot, authority version and expiry. Before commitment, the system rechecks the conditions. If evidence becomes stale or an owner revokes a delegation, the earlier decision does not silently survive. The proposed command must be held or otherwise resolved according to the rules. This is the moment where technical capability becomes a candidate for an actual consequence, and the record must show what was bound, by whom, under which authority and when.'],
['Execution and Verification','TA-14 Execution and Verification Infographic.png','A command being issued is not proof that the expected outcome occurred. After a valid bounded commit, the demonstration records execution separately from outcome verification. Reviewers should see the target equipment, authorized scope, actual response, comparison window, deviations and audit references. If the resulting air-handler performance differs from the accepted synthetic tolerance, preserve an outcome exception. Do not silently label that action successful. Before another consequence, the new reality may require a new evidence record and decision.'],
['Continuous Commissioning Never Ends','Continuous Commissioning Governance Cycle.png','Building conditions evolve after handover. Ongoing commissioning and monitoring-based practices examine drift, corrections and performance over time. This TA-14 concept proposes a distinct check at the execution boundary. Commissioned requirements lead to current records; records support or fail a specific proposed action; binding and commit recheck authority and standing; bounded execution produces a separately measured outcome. The outcome becomes evidence for the next cycle. It does not automatically expand anyone’s authority. Every consequential decision must be justified under the conditions that actually exist NOW.']
] as const;
const hero='TA-14 Continuous Commissioning Dashboard.png';
const pdf='TA-14_Continuous_Commissioning_Governed_Execution_Concept_v2 (1).pdf';
const asset=(x:string)=>'/'+encodeURIComponent(x);
export default function CommissioningVisualLessons(){
 const [active,setActive]=useState(0),[speaking,setSpeaking]=useState(false);
 const [title,image,script]=images[active];
 function stop(){if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();setSpeaking(false)}
 function select(i:number){stop();setActive(i)}
 function listen(){if(typeof window==='undefined'||!('speechSynthesis' in window))return;stop();const u=new SpeechSynthesisUtterance(title+'. '+script);u.lang='en-US';u.rate=.93;u.onend=()=>setSpeaking(false);u.onerror=()=>setSpeaking(false);window.speechSynthesis.speak(u);setSpeaking(true)}
 const buttonStyle={cursor:'pointer',border:'1px solid #57ddd5',borderRadius:9,padding:'10px 15px',color:'#eef',background:'#103543',fontWeight:750} as const;
 return <section id="visual-lessons" style={{padding:'45px 0 60px',borderTop:'1px solid #315869'}}>
   <div className="eyebrow">TA-14 AUTHORITY · NINE VISUALS · EIGHT LESSONS</div>
   <h2 style={{font:'700 clamp(32px,5vw,55px)/1.08 Georgia,serif',margin:'10px 0'}}>The complete architecture. Then the details.</h2>
   <p style={{color:'#adc5cf',lineHeight:1.7}}>Samantha explains each lesson in detail. All imagery and data are illustrative and the architecture remains an independent technical concept, not a deployed system.</p>
   <img src={asset(hero)} alt="Complete TA-14 continuous commissioning and governed execution architecture, with Samantha" style={{width:'100%',height:'auto',border:'1px solid #315b6a',borderRadius:15}}/>
   <div role="tablist" aria-label="Eight commissioning lessons" style={{display:'flex',gap:8,flexWrap:'wrap',margin:'24px 0'}}>
    {images.map((x,i)=><button key={x[0]} role="tab" aria-selected={i===active} aria-controls="visual-lesson-panel" onClick={()=>select(i)} style={{...buttonStyle,background:i===active?'#086b70':'#102936'}}>{String(i+1).padStart(2,'0')}</button>)}
   </div>
   <div id="visual-lesson-panel" role="tabpanel" style={{display:'flex',gap:22,flexWrap:'wrap',alignItems:'flex-start'}}>
     <div style={{flex:'1 1 500px',minWidth:0}}><img src={asset(image)} alt={'TA-14 visual lesson '+(active+1)+': '+title} style={{width:'100%',height:'auto',borderRadius:15,border:'1px solid #315b6a'}}/></div>
     <article style={{flex:'1 1 290px',minWidth:0,padding:22,borderRadius:15,border:'1px solid #315b6a',background:'#081a24'}}>
       <div className="eyebrow">SAMANTHA · TECHNICAL INTERPRETATION · {String(active+1).padStart(2,'0')}</div>
       <h3 style={{fontSize:25}}>{title}</h3><p style={{color:'#c5d9df',lineHeight:1.8}}>{script}</p>
       <button style={buttonStyle} onClick={listen}>▶ Listen to Samantha interpretation</button>{' '}
       <button style={buttonStyle} disabled={!speaking} onClick={stop}>■ Stop</button>
       <p style={{color:'#91aeba',fontSize:12,lineHeight:1.5}}>Voice playback uses the visitor's browser speech engine. The exact interpretation is preserved in text. Samantha does not grant execution authority.</p>
       <div style={{display:'flex',gap:10,flexWrap:'wrap'}}><button style={buttonStyle} disabled={active===0} onClick={()=>select(active-1)}>Previous</button><button style={buttonStyle} disabled={active===7} onClick={()=>select(active+1)}>Next lesson</button></div>
     </article>
   </div>
   <div style={{marginTop:60}}>
     <div className="eyebrow">TECHNICAL REFERENCE · VERSION 2.0 · 7 PAGES</div>
     <h2 style={{font:'700 clamp(30px,5vw,49px)/1.1 Georgia,serif'}}>Read the full technical concept.</h2>
     <p style={{color:'#b5cbd2',lineHeight:1.7}}>Review the responsibility matrix, declared policy, synthetic scenarios, pilot requirements and independent-review questions.</p>
     <div style={{display:'flex',gap:12,flexWrap:'wrap',margin:'20px 0'}}><a style={{...buttonStyle,textDecoration:'none'}} target="_blank" rel="noopener noreferrer" href={asset(pdf)}>Open PDF</a><a style={{...buttonStyle,textDecoration:'none'}} download href={asset(pdf)}>Download PDF</a></div>
     <iframe title="TA-14 Continuous Commissioning Technical Concept v2.0" src={asset(pdf)} style={{width:'100%',height:580,border:'1px solid #315869',borderRadius:15,background:'#fff'}}/>
   </div>
 </section>
}