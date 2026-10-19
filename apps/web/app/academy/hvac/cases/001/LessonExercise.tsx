"use client";
import {useState} from "react";

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
 if(!exercise)return null;
 const correct=selected===exercise.correct;
 function submit(){if(selected===null||passed)return;setSubmitted(true);setAttempts(a=>a+1);if(correct)setPassed(true);}
 return <div className="exercise" aria-label={`Lesson ${lesson} understanding check`}>
 <div className="exercise-title">YOUR TURN · EVIDENCE DECISION</div>
 <h3>{exercise.question}</h3>
 <fieldset disabled={passed}><legend className="sr-only">Choose one answer</legend>
 {exercise.choices.map((choice,i)=><label key={i} className="exercise-choice"><input type="radio" name={`case001-exercise-${lesson}`} checked={selected===i} onChange={()=>{setSelected(i);setSubmitted(false);}}/>{choice}</label>)}
 </fieldset>
 <button type="button" onClick={submit} disabled={selected===null||passed}>{passed?"Understanding demonstrated":"Submit decision"}</button>
 {submitted&&<div className="exercise-feedback" role="status"><strong>{correct?"SUPPORTED — correct decision":"RE-EXAMINE — try again"}</strong><p>{exercise.why}</p>{!correct&&<p>Review Samantha's explanation, then choose again.</p>}</div>}
 <small>{passed?`Completed in ${attempts} attempt${attempts===1?"":"s"} (this session only).`:"Practice check only — not a professional credential or authenticated assessment."}</small>
 </div>;
}
