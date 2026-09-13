"use client";
import {useMemo,useState,useEffect} from "react";

type Props={step:number;world:"inside"|"outside";onScore:(delta:number,message:string)=>void};
type Target={label:string;icon:string;from:number;instruction:string;good:string};

const TARGETS:Target[]=[
 {from:1,label:"OPEN AIR HANDLER",icon:"▣",instruction:"What is the correct first field move at this node?",good:"ORIGINAL INDOOR CONDITION PRESERVED"},
 {from:2,label:"PROVE HEAT RESPONSE",icon:"♨",instruction:"What should the technician prove next?",good:"HEAT / FURNACE COMMAND-RESPONSE VERIFIED"},
 {from:3,label:"PROVE BLOWER + AIRFLOW",icon:"◉",instruction:"What is the correct next evidence move?",good:"BLOWER MOTOR & AIRFLOW INTEGRITY VERIFIED"},
 {from:4,label:"SHOW THE EVAPORATOR",icon:"≋",instruction:"What should be inspected and preserved next?",good:"EVAPORATOR COIL CONDITION PRESERVED"},
 {from:5,label:"IDENTIFY METERING DEVICE",icon:"◇",instruction:"What must be established before charge-method discussion?",good:"METERING DEVICE IDENTIFIED"},
 {from:6,label:"CHECK FILTER + RETURN",icon:"▥",instruction:"What airflow evidence should be checked next?",good:"FILTER & RETURN AIRFLOW VERIFIED"},
 {from:7,label:"REASSEMBLE AIR HANDLER",icon:"▤",instruction:"What closes the indoor sequence before moving outside?",good:"INDOOR SEQUENCE CLOSED CORRECTLY"},
 {from:8,label:"PRESERVE CONDENSER BASELINE",icon:"▧",instruction:"What is the correct first outdoor move?",good:"OUTDOOR ORIGINAL STATE PRESERVED"},
 {from:9,label:"TEST START COMPONENTS",icon:"⚡",instruction:"What electrical evidence should be established next?",good:"START / CAPACITOR / INSULATION EVIDENCE VERIFIED"},
 {from:10,label:"MEASURE OPERATING AMPS",icon:"A",instruction:"What operating evidence should be measured next?",good:"COMPRESSOR & FAN AMP DRAW VERIFIED"},
 {from:11,label:"REASSEMBLE CONDENSER",icon:"▤",instruction:"What should happen before later system judgment?",good:"CONDENSER MECHANICAL INTEGRITY RESTORED"},
 {from:12,label:"RESTORE CONDENSER AIRFLOW",icon:"↻",instruction:"What must be restored before refrigerant interpretation?",good:"CONDENSER AIRFLOW & HEAT REJECTION RESTORED"},
 {from:13,label:"EVALUATE REFRIGERANT",icon:"❄",instruction:"The prior evidence gates are complete. What comes next?",good:"REFRIGERANT EVALUATION THRESHOLD EARNED"},
 {from:14,label:"VERIFY CONDENSATE + CLOSE",icon:"✓",instruction:"What action closes the TA-14 service chain?",good:"TA-14 SYSTEM CLOSURE PROVEN"},
];

export default function EquipmentArcade({step,onScore}:Props){
 const[selected,setSelected]=useState<number|null>(null);
 const target=useMemo(()=>TARGETS.find(t=>t.from===step)!,[step]);
 useEffect(()=>setSelected(null),[step]);
 const choices=useMemo(()=>{
  const correct=TARGETS.findIndex(t=>t.from===step);
  const offsets=[0,3,7,10];
  const indexes=offsets.map(offset=>(correct+offset)%TARGETS.length);
  if(!indexes.includes(correct))indexes[0]=correct;
  const unique=Array.from(new Set(indexes));
  for(let i=0;unique.length<4&&i<TARGETS.length;i++)if(!unique.includes(i))unique.push(i);
  return unique.slice(0,4).map(i=>TARGETS[i]);
 },[step]);
 function answer(choice:Target,index:number){
  if(selected!==null)return;
  setSelected(index);
  if(choice.from===step)onScore(300,`CORRECT ACTION // ${target.good}`);
  else onScore(-75,`NOT YET // STEP ${String(step).padStart(2,"0")} REQUIRES ${target.label}`);
 }
 return <div className="equipmentArcade">
  <section className="questionCard" aria-label={`TA-14 step ${step} question`}>
   <div className="questionMeta">{step<=7?"7 IN // INSIDE":"7 OUT // OUTSIDE"} · STEP {String(step).padStart(2,"0")} OF 14</div>
   <h2>{target.instruction}</h2>
   <div className="choiceGrid">{choices.map((choice,i)=>{
    const answered=selected!==null;
    const correct=choice.from===step;
    const state=answered?(correct?"correct":selected===i?"wrong":""):"";
    return <button key={choice.from} className={`choice ${state}`} onClick={()=>answer(choice,i)} disabled={answered}>
     <b>{String.fromCharCode(65+i)}</b><span>{choice.label}</span>
    </button>
   })}</div>
   {selected!==null&&<div className="result">{choices[selected].from===step?`CORRECT — ${target.good}`:`NOT YET — THE SUPPORTED NEXT MOVE IS ${target.label}`}</div>}
  </section>
  <style jsx>{`.equipmentArcade{position:absolute;inset:0;z-index:12;display:grid;place-items:center;padding:22px;background:rgba(2,8,13,.72);backdrop-filter:blur(3px)}.questionCard{width:min(760px,94%);padding:24px;border:1px solid rgba(92,234,255,.5);border-radius:18px;background:linear-gradient(180deg,rgba(4,18,29,.98),rgba(2,9,16,.98));box-shadow:0 28px 80px rgba(0,0,0,.55);text-align:center}.questionMeta{color:#65eaff;font:1000 9px ui-monospace;letter-spacing:.16em}.questionCard h2{margin:16px auto 22px;max-width:680px;color:#f4fbff;font-size:clamp(22px,3vw,34px);line-height:1.18}.choiceGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.choice{min-height:76px;display:grid;grid-template-columns:38px 1fr;align-items:center;gap:10px;padding:12px;border:1px solid rgba(92,211,242,.28);border-radius:12px;background:#071725;color:#e4f5fb;text-align:left;cursor:pointer}.choice b{width:34px;height:34px;display:grid;place-items:center;border:1px solid rgba(101,234,255,.5);border-radius:50%;color:#65eaff;font:1000 13px ui-monospace}.choice span{font-size:12px;font-weight:900;letter-spacing:.02em}.choice:hover:not(:disabled){border-color:#65eaff;background:#0a2635}.choice.correct{border-color:#65ffad;background:#09251a}.choice.wrong{border-color:#ff7189;background:#2b0b13}.choice:disabled{cursor:default}.result{margin-top:14px;padding:10px;border-radius:10px;background:rgba(3,11,17,.92);color:#bfffd9;font:1000 9px ui-monospace;letter-spacing:.08em}@media(max-width:700px){.equipmentArcade{padding:10px}.questionCard{padding:16px}.choiceGrid{grid-template-columns:1fr}.choice{min-height:62px}.questionCard h2{font-size:22px}}`}</style>
 </div>
}
