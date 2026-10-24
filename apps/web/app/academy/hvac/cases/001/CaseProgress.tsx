"use client";
import {useEffect,useState} from "react";
const STORAGE_KEY="ta14-case001-practice-v1";
const PROGRESS_EVENT="ta14-case001-progress";
export default function CaseProgress(){
 const [completed,setCompleted]=useState<number[]>([]);
 useEffect(()=>{
  const refresh=()=>{try{const record=JSON.parse(window.sessionStorage.getItem(STORAGE_KEY)||"{}") as Record<string,number>;setCompleted(Object.keys(record).map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=14&&record[String(n)]>0).sort((a,b)=>a-b));}catch{setCompleted([]);}};
  refresh();window.addEventListener(PROGRESS_EVENT,refresh);return()=>window.removeEventListener(PROGRESS_EVENT,refresh);
 },[]);
 return <section className="case-progress" aria-label="Practice progress">
 <div className="progress-heading"><strong>Case 001 · Practice progress</strong><span>{completed.length} / 14 checks completed</span></div>
 <div className="progress-track" role="progressbar" aria-label="Completed understanding checks" aria-valuenow={completed.length} aria-valuemin={0} aria-valuemax={14}><div style={{width:`${completed.length/14*100}%`}}/></div>
 <div className="progress-lessons">{Array.from({length:14},(_,i)=>i+1).map(n=><a key={n} href={`#image-${n}`} className={completed.includes(n)?"done":""} aria-label={`Lesson ${n}: ${completed.includes(n)?"check completed":"not yet completed"}`}>{String(n).padStart(2,"0")}{completed.includes(n)?" ✓":""}</a>)}</div>
 <small>Practice progress is stored only for this browser tab session. It is not an authenticated student record or credential.</small>
 </section>;
}
