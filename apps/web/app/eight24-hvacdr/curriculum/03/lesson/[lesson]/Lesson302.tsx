'use client';
import {useState} from 'react';

const stages=[
 {name:'RETURN AIR',detail:'Locate the occupied-space return openings and identify the path back to the air handler. A return grille is not proof that the path is unobstructed.'},
 {name:'FILTRATION',detail:'Identify the installed filter location, condition and fit. Record observations before moving or replacing the filter.'},
 {name:'BLOWER',detail:'Locate the air-moving assembly and document the commanded and observed operating state. A running motor does not independently establish delivered airflow.'},
 {name:'COIL',detail:'Identify the airside heat-exchange surface and its relationship to airflow and moisture. Preserve accessible observations; do not infer a refrigerant fault.'},
 {name:'SUPPLY',detail:'Trace supply plenum, ducts, dampers and outlets toward the occupied spaces. Note suspected leakage or restrictions as observations requiring verification.'},
 {name:'OCCUPIED SPACE',detail:'Connect delivery to the actual rooms and complaint locations. Record temperature, RH, location, time and operating conditions separately.'}
] as const;
const narration=[
 'Welcome to Lesson 3.02, Airflow Path and System Boundaries. Today we are going to follow the air, not jump to a component diagnosis.',
 'First, begin at the occupied space. The homeowner may say one room is hot, another is cold, or the building feels humid. Those statements establish the complaint, not the cause.',
 'Number one: return air. Find the return openings and trace the route toward the equipment. Look for blocked grilles, disconnected sections and obvious obstructions, but keep observation separate from verified flow.',
 'Number two: filtration. Identify where the filter actually sits in this system. Record the filter type, condition and fit before changing anything. A visibly dirty filter is relevant evidence; it is not by itself a complete system determination.',
 'Number three: the blower. Confirm what the controls are asking it to do and what it is observed doing. A blower that runs can still deliver an unknown quantity of air.',
 'Number four: the coil. Air must cross the heat-exchange surface for the cooling process to affect the air stream. Coil condition, airflow, load and moisture interact. A wet or cold coil does not automatically prove proper performance.',
 'Number five: the supply path. Follow the air leaving the equipment through the plenum, ducts, dampers and outlets. A single supply register reading cannot describe every branch of the system.',
 'Number six: the occupied space. The purpose of the air path is to serve the rooms. Record the condition at the complaint location, including temperature, relative humidity, measurement location and operating state.',
 'Now define the measurement boundary. The air handler, return duct, filter and supply duct may fall inside or outside a specific test boundary depending on the measurement and equipment configuration. External static pressure cannot be interpreted without the actual manufacturer-defined boundary and measurement locations.',
 'Keep the record attributable. Identify the asset, time, instrument, placement, units, operating state and any limitations. Where the path cannot be safely accessed or confirmed, say so instead of inventing continuity.',
 'The technician traces, inspects, measures and documents. The technician does not author the formal DDD or authorize refrigerant entry. Those are separate governed processes after the required baseline.',
 'By the end of this lesson, you should be able to draw the complete air path, identify where evidence was collected, and explain which conclusions remain unsupported.'
];
const questions=[
 {q:'A return grille is visibly unobstructed. What does that prove?',o:['The entire return duct has adequate airflow','Only the visible grille condition; the remainder requires examination','The refrigerant charge is correct'],a:1,why:'One visible segment does not establish the continuity or capacity of the entire air path.'},
 {q:'A blower motor is running. Which conclusion is justified?',o:['The blower is observed running, but delivered airflow remains to be established','Every occupied room receives design airflow','The evaporator coil has rated capacity'],a:0,why:'Observed operation and verified airflow are different propositions.'},
 {q:'Which information belongs with an airflow measurement?',o:['Only the displayed value','Only the customer complaint','Asset, measurement location, instrument, operating state, time and units'],a:2,why:'A measurement without context is not a defensible performance record.'},
 {q:'Where is the correct total external static pressure measurement boundary?',o:['Always directly across the filter','At the manufacturer-defined external equipment boundary with valid test locations','At any two accessible supply registers'],a:1,why:'Equipment configuration and manufacturer guidance establish the correct test boundary.'}
];
export default function Lesson302(){
 const [selected,setSelected]=useState<number|null>(null);
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const [checked,setChecked]=useState(false);
 const [notes,setNotes]=useState('');
 const score=questions.reduce((n,q,i)=>n+(answers[i]===q.a?1:0),0);
 const panel={padding:24,border:'1px solid #173746',borderRadius:16,background:'#06121a'} as const;
 return <div style={{display:'grid',gap:24,marginBottom:30}}>
   <section style={panel}><b style={{color:'#efc86c'}}>LESSON OBJECTIVE</b><p style={{color:'#d6e7ed',lineHeight:1.8}}>Trace return, filtration, blower, coil, supply and occupied-space boundaries before interpreting performance. Record what is visible and identify what still requires measurement.</p></section>
   <section style={panel}><b style={{color:'#efc86c'}}>GUIDED AIRFLOW PATH · SELECT A STAGE</b><div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:18}}>{stages.map((s,i)=><button key={s.name} onClick={()=>setSelected(i)} style={{padding:'12px 14px',borderRadius:10,border:'1px solid #285b78',background:selected===i?'#16435c':'#0b2030',color:'#edf5f8',cursor:'pointer',fontWeight:800}}>{i+1}. {s.name}</button>)}</div>{selected===null?<p style={{color:'#a9bdc6'}}>Choose each stage to examine its evidence boundary.</p>:<div aria-live="polite" style={{marginTop:20,padding:18,background:'#0b1013',borderRadius:12}}><b style={{color:'#70dcff'}}>{stages[selected].name}</b><p style={{color:'#d6e7ed',lineHeight:1.8}}>{stages[selected].detail}</p></div>}</section>
   <section style={panel}><b style={{color:'#efc86c'}}>SAMANTHA · FULL TEXT READ-ALONG</b><p style={{color:'#a9bdc6',fontSize:13}}>Narration text is staged for review. Recorded audio and synchronized playback are not integrated.</p>{narration.map((p,i)=><p key={i} style={{color:'#d6e7ed',fontSize:17,lineHeight:1.9,margin:'20px 0'}}>{p}</p>)}</section>
   <section style={panel}><b style={{color:'#efc86c'}}>GUIDED RECORD EXERCISE</b><p style={{color:'#d6e7ed',lineHeight:1.8}}>Scenario: the homeowner reports a humid upstairs bedroom. The blower is audibly running, the return grille appears clear, and the supply register feels cool. Identify what has been observed and which portions of the air path or operating condition remain unverified.</p><label style={{display:'block',color:'#a9bdc6',marginBottom:10}} htmlFor="m03-airpath-notes">Your field notes (local practice only)</label><textarea id="m03-airpath-notes" value={notes} onChange={e=>setNotes(e.target.value)} rows={5} style={{width:'100%',padding:14,background:'#02070c',border:'1px solid #285b78',borderRadius:10,color:'#edf5f8'}} placeholder="Observed: ...  Unverified: ...  Next safe evidence: ..."/><p style={{color:'#a9bdc6',fontSize:13}}>This text is not submitted or saved. Do not enter customer-identifying information.</p></section>
   <section style={panel}><b style={{color:'#efc86c'}}>INDEPENDENT REVIEW · KNOWLEDGE CHECK</b>{questions.map((q,i)=><fieldset key={i} style={{border:0,borderTop:'1px solid #173746',padding:'20px 0'}}><legend style={{fontWeight:800,paddingTop:10}}>{i+1}. {q.q}</legend>{q.o.map((o,j)=><label key={j} style={{display:'flex',gap:12,padding:'9px 0',color:'#d6e7ed'}}><input type="radio" name={'m03-302-'+i} checked={answers[i]===j} disabled={checked} onChange={()=>setAnswers(a=>({...a,[i]:j}))}/>{o}</label>)}{checked&&<p style={{color:answers[i]===q.a?'#8fe0bf':'#efc86c'}}>{answers[i]===q.a?'SUPPORTED':'REVIEW REQUIRED'} — {q.why}</p>}</fieldset>)}{checked?<><p style={{fontWeight:800}}>Practice score: {score} / {questions.length}</p><button onClick={()=>{setAnswers({});setChecked(false)}} style={{padding:12,cursor:'pointer'}}>RETRY</button></>:<button disabled={Object.keys(answers).length!==questions.length} onClick={()=>setChecked(true)} style={{padding:'12px 18px',borderRadius:10,background:'#7BAFD4',color:'#001426',fontWeight:900,cursor:'pointer',opacity:Object.keys(answers).length===questions.length?1:.5}}>CHECK ANSWERS</button>}<p style={{color:'#a9bdc6',fontSize:13}}>Practice feedback only; no grade or completion is persisted.</p></section>
   <section style={panel}><b style={{color:'#70dcff'}}>HANDOFF → LESSON 3.03</b><p style={{color:'#a9bdc6',lineHeight:1.8}}>Now that the air path and boundaries are identified, examine static pressure as evidence without confusing pressure with airflow or diagnosis.</p></section>
 </div>;
}
