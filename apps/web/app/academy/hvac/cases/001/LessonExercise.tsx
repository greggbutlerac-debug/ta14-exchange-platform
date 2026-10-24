"use client";
import {useEffect,useState} from "react";
const PROGRESS_EVENT="ta14-case001-progress";
const STORAGE_KEY="ta14-case001-practice-v1";

const exercises:{question:string;choices:string[];correct:number;why:string}[]=[
{question:"What is established by the customer's statement that the house won't cool?",choices:["A confirmed refrigerant defect","A reported symptom requiring investigation","A verified equipment failure"],correct:1,why:"The complaint is a report, not a measured diagnosis."},
{question:"What comes before routine diagnostic testing?",choices:["Safety and authority assessment","Reset every control","Connect refrigerant gauges"],correct:0,why:"Safety, access, qualification and authorization govern the first action."},
{question:"What must be verified before applying manufacturer performance limits?",choices:["The customer's preferred temperature only","Equipment identity and actual configuration","A generic equipment illustration"],correct:1,why:"Nameplate and configuration evidence must match the installed equipment."},
{question:"Which field sequence preserves admissibility?",choices:["Change the filter, then estimate the original state","Observe and preserve baseline before authorized correction","Declare restoration from a single reading"],correct:1,why:"Original-state observations must be preserved before intervention."},
{question:"Which measurement record is most useful?",choices:["A temperature number without context","Reading, location, units, operating mode, time and instrument","An unlabeled photograph"],correct:1,why:"Measurement context supports repeatability and examination."},
{question:"How should the 13°F illustrative temperature difference be handled?",choices:["As authenticated field proof","As a working value distinct from raw measurements","As manufacturer-certified compliance"],correct:1,why:"The scenario's illustrative difference is not authenticated raw field data."},
{question:"Does a high static pressure number alone establish exact airflow?",choices:["Yes, always","Only if the technician is experienced","No; test configuration and fan information are needed"],correct:2,why:"Static pressure alone does not quantify airflow or exclude other causes."},
{question:"Should gauges be connected under the Case 001 NIRET disposition?",choices:["Yes, because the house is warm","No; NIRET HOLD and no authorized refrigerant entry","Yes, because diagnosis grants permission"],correct:1,why:"NIRET HOLD excludes refrigerant entry; diagnosis does not establish authority."},
{question:"What is true of competing causes in this case?",choices:["All other faults are excluded","Refrigerant pressures were measured","Other causes remain open without relevant evidence"],correct:2,why:"The case does not contain authorized refrigerant measurements or rule out alternatives."},
{question:"What can the loaded filter support?",choices:["A bounded contributing-cause determination","A complete diagnosis of every component","Automatic authority for all repairs"],correct:0,why:"A supported contributor is not a blanket diagnosis or authorization."},
{question:"Before replacing the filter, the technician must:",choices:["Verify standing, permission, scope and safety","Assume the diagnosis is permission","Skip the original-state record"],correct:0,why:"The intervention must be authorized and bounded."},
{question:"What does the illustrative 13°F to 18°F comparison establish?",choices:["Guaranteed restored comfort","Possible improvement, subject to comparability and evidence limits","Verified OEM compliance"],correct:1,why:"Directional improvement does not prove design performance or comfort restoration."},
{question:"Which record supports Proof of Performance?",choices:["Only the final reading","Comparable original and post records with provenance and uncertainty","An illustration claiming completion"],correct:1,why:"Proof requires traceable, comparable records and disclosed limitations."},
{question:"What is the correct final Case 001 disposition?",choices:["RESTORED AND COMPLETE","REFRIGERANT FAILURE CONFIRMED","IMPROVED; RESTORED NOT ESTABLISHED"],correct:2,why:"The simulation supports bounded improvement, not verified full restoration."}
];
export default function LessonExercise({lesson}:{lesson:number}){
 const exercise=exercises[lesson-1];
 const [selected,setSelected]=useState<number|null>(null);
 const [submitted,setSubmitted]=useState(false);
 const [attempts,setAttempts]=useState(0);
 const [passed,setPassed]=useState(false);
 const [reason,setReason]=useState("");
 const [reasonChecked,setReasonChecked]=useState(false);
 const [rubric,setRubric]=useState([false,false,false]);
 const [reviewed,setReviewed]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(window.sessionStorage.getItem(STORAGE_KEY)||"{}") as Record<string,number>;if(saved[String(lesson)]>0){setPassed(true);setAttempts(saved[String(lesson)]);}}catch{}},[lesson]);
 if(!exercise)return null;
 const correct=selected===exercise.correct;
 function submit(){if(selected===null||passed)return;setSubmitted(true);setAttempts(a=>a+1);if(correct){setReasonChecked(true);return;}}
 function confirmReason(){if(reason.trim().length<40||!rubric.every(Boolean)||!reviewed||passed)return;setPassed(true);try{const saved=JSON.parse(window.sessionStorage.getItem(STORAGE_KEY)||"{}") as Record<string,number>;saved[String(lesson)]=attempts;window.sessionStorage.setItem(STORAGE_KEY,JSON.stringify(saved));window.dispatchEvent(new Event(PROGRESS_EVENT));}catch{}}
 return <div className="exercise" aria-label={`Lesson ${lesson} understanding check`}>
 <div className="exercise-title">YOUR TURN · EVIDENCE DECISION</div>
 <h3>{exercise.question}</h3>
 <fieldset disabled={passed}><legend className="sr-only">Choose one answer</legend>
 {exercise.choices.map((choice,i)=><label key={i} className="exercise-choice"><input type="radio" name={`case001-exercise-${lesson}`} checked={selected===i} onChange={()=>{setSelected(i);setSubmitted(false);setReasonChecked(false);setReason("");setRubric([false,false,false]);setReviewed(false);}}/>{choice}</label>)}
 </fieldset>
 <button type="button" onClick={submit} disabled={selected===null||passed}>{passed?"Self-review completed":"Submit decision"}</button>
 {reasonChecked&&!passed&&<div className="exercise-feedback"><label htmlFor={`reason-${lesson}`}><strong>Explain your reasoning</strong></label><p>In your own words, what evidence or authority boundary supports this decision?</p><textarea id={`reason-${lesson}`} rows={3} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Explain the observation, missing evidence, or authority limit..." style={{width:"100%",padding:12,borderRadius:8,background:"#071c2b",color:"white",border:"1px solid #5e94ad"}}/><div className="reason-rubric"><strong>Self-review against the case evidence</strong><p>{exercise.why}</p>{["I identified the observation or source of evidence, without treating a report as a verified measurement.","I identified what remains unknown, or what authority or standing limits the next action.","My conclusion stays within the evidence and does not claim unverified restoration or permission."].map((item,i)=><label key={i} style={{display:"flex",gap:10,margin:"10px 0",alignItems:"flex-start"}}><input type="checkbox" checked={rubric[i]} onChange={e=>setRubric(previous=>previous.map((v,j)=>j===i?e.target.checked:v))}/>{item}</label>)}<label style={{display:"flex",gap:10,margin:"12px 0",alignItems:"flex-start"}}><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/>I compared my written explanation with the reference reasoning and identified any differences.</label></div><button type="button" disabled={reason.trim().length<40||!rubric.every(Boolean)||!reviewed} onClick={confirmReason}>Complete self-review</button><p><small>You are checking your own reasoning against the rubric. This is not independent validation or instructor grading.</small></p></div>}
 {submitted&&<div className="exercise-feedback" role="status"><strong>{correct?"CORRECT OPTION — explain why":"RE-EXAMINE — try again"}</strong><p>{exercise.why}</p>{!correct&&<p>Review Samantha's explanation, then choose again.</p>}</div>}
 {passed&&<div className="exercise-feedback" role="status"><strong>SELF-REVIEW RECORDED — NOT INDEPENDENTLY GRADED</strong><p>{exercise.why}</p><p>For a verified assessment, an instructor must review the explanation and supporting evidence.</p></div>}
 <small>{passed?`Completed in ${attempts} attempt${attempts===1?"":"s"} (this session only).`:"Practice only. Written reasoning and rubric selections are self-reviewed, not independently graded or authenticated."}</small>
 </div>;
}
