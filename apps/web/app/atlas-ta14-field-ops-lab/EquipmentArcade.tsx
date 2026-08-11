"use client";
import {useMemo,useState} from "react";

type Props={step:number;world:"inside"|"outside";onScore:(delta:number,message:string)=>void};
type Target={id:string;label:string;icon:string;from:number;instruction:string;good:string;x:string;y:string};
const TARGETS:Target[]=[
 {id:"arrival",label:"START HERE",icon:"▶",from:1,instruction:"Meet the homeowner. Listen to the complaint. Do not diagnose or sell yet.",good:"ARRIVAL PROTOCOL COMPLETE",x:"50%",y:"48%"},
 {id:"filter",label:"FILTER",icon:"▥",from:2,instruction:"Inspect the return-air filter and preserve what you see before changing anything.",good:"FILTER CONDITION CAPTURED",x:"28%",y:"55%"},
 {id:"blower",label:"BLOWER",icon:"◉",from:3,instruction:"Inspect the blower and airflow path. Do not jump to refrigerant conclusions.",good:"BLOWER / AIRFLOW EVIDENCE CAPTURED",x:"50%",y:"55%"},
 {id:"power",label:"ELECTRICAL",icon:"⚡",from:4,instruction:"Verify the electrical condition safely. Keep the homeowner away from exposed electrical parts.",good:"ELECTRICAL VERIFICATION COMPLETE",x:"70%",y:"38%"},
 {id:"control",label:"THERMOSTAT",icon:"⌁",from:5,instruction:"Verify the thermostat call and control sequence before blaming a component.",good:"CONTROL SEQUENCE VERIFIED",x:"27%",y:"28%"},
 {id:"coil",label:"INDOOR COIL",icon:"≋",from:6,instruction:"Inspect and photograph the coil condition. Describe what you see without outrunning your qualifications.",good:"EVAPORATOR CONDITION PRESERVED",x:"70%",y:"63%"},
 {id:"temp",label:"INDOOR READINGS",icon:"°",from:7,instruction:"Finish the indoor evidence package with the required temperatures and equipment context.",good:"INDOOR EVIDENCE PACKAGE COMPLETE",x:"50%",y:"30%"},
 {id:"identity",label:"OUTDOOR ID",icon:"#",from:8,instruction:"Verify the outdoor equipment identity and condition before touching service components.",good:"OUTDOOR EQUIPMENT IDENTITY VERIFIED",x:"28%",y:"30%"},
 {id:"condenser",label:"CONDENSER COIL",icon:"▦",from:9,instruction:"Inspect condenser airflow and coil condition before trusting refrigerant behavior.",good:"CONDENSER AIRFLOW CONDITION CAPTURED",x:"38%",y:"58%"},
 {id:"disconnect",label:"ELECTRICAL",icon:"⚡",from:10,instruction:"Verify the outdoor electrical condition safely and keep the homeowner clear.",good:"HIGH-VOLTAGE FIELD VERIFIED",x:"72%",y:"30%"},
 {id:"amps",label:"OPERATING AMPS",icon:"A",from:11,instruction:"Measure operating current and compare it with the equipment evidence.",good:"OPERATING CURRENT EVIDENCE CAPTURED",x:"68%",y:"60%"},
 {id:"restore",label:"RESTORE AIRFLOW",icon:"↻",from:12,instruction:"Restore trustworthy condenser airflow before making refrigerant judgments.",good:"HEAT-REJECTION CONDITION RESTORED",x:"30%",y:"62%"},
 {id:"refrigerant",label:"REFRIGERANT GATE",icon:"❄",from:13,instruction:"Only now evaluate refrigerant-side evidence in the context of everything already proven.",good:"REFRIGERANT GATE EARNED",x:"50%",y:"48%"},
 {id:"outcome",label:"FINAL RECORD",icon:"✓",from:14,instruction:"Create the post-intervention record. Show what changed and what was verified.",good:"POST-INTERVENTION RECORD COMPLETE",x:"74%",y:"62%"},
];

export default function EquipmentArcade({step,world,onScore}:Props){
 const[hit,setHit]=useState(false);
 const target=useMemo(()=>TARGETS.find(t=>t.from===step)!,[step]);
 function fire(){onScore(300,`CORRECT ACTION // ${target.good}`);setHit(true);setTimeout(()=>setHit(false),450)}
 return <div className="equipmentArcade">
   <div className="guidedMission"><small>WHAT DO I DO?</small><strong>STEP {String(step).padStart(2,"0")}</strong><p>{target.instruction}</p><span>CLICK THE GLOWING {target.label}</span></div>
   <button onClick={fire} className={`equipmentTarget live ${hit?"hit":""}`} style={{left:target.x,top:target.y}} aria-label={target.label}><span>{target.icon}</span><b>{target.label}</b><em>CLICK ME</em></button>
   <div className="equipmentHint">ONE ACTIVE TASK AT A TIME // THE GAME WILL TELL YOU WHAT COMES NEXT</div>
   <style jsx>{`
   .equipmentArcade{position:absolute;inset:0;z-index:12}.guidedMission{position:absolute;z-index:6;left:50%;top:16px;transform:translateX(-50%);width:min(540px,70%);padding:12px 16px;border:1px solid #5ceaff88;border-radius:8px;background:linear-gradient(180deg,#06182ff2,#03101ef2);box-shadow:0 0 34px #40dfff22;text-align:center}.guidedMission small{display:block;color:#65eaff;font:1000 7px ui-monospace;letter-spacing:.18em}.guidedMission strong{display:block;margin-top:3px;color:#75ffb3;font:1000 14px ui-monospace}.guidedMission p{margin:6px auto;color:#d5e6ed;font-size:11px;line-height:1.45}.guidedMission span{display:inline-block;margin-top:2px;padding:5px 9px;border:1px solid #63ffad55;background:#092519;color:#7affb6;font:1000 7px ui-monospace;letter-spacing:.12em}.equipmentTarget{position:absolute;transform:translate(-50%,-50%);width:112px;height:112px;border-radius:50%;border:3px solid #6affae;background:radial-gradient(circle,#103c35 0,#071d29 55%,#020914 100%);color:#8affbf;cursor:pointer;box-shadow:0 0 0 8px #06140faa,0 0 34px #54ff9b88,0 0 70px #38dfff44,inset 0 0 26px #48ff9422;animation:targetLive .75s ease-in-out infinite alternate}.equipmentTarget span{display:block;font:1000 30px ui-monospace}.equipmentTarget b{display:block;margin-top:4px;font:1000 8px ui-monospace;letter-spacing:.08em}.equipmentTarget em{display:block;margin-top:6px;color:#fff;font:1000 7px ui-monospace;font-style:normal;letter-spacing:.14em}.equipmentTarget:before,.equipmentTarget:after{content:"";position:absolute;background:#6affae;box-shadow:0 0 10px #6affae}.equipmentTarget:before{left:-20px;right:-20px;top:50%;height:2px}.equipmentTarget:after{top:-20px;bottom:-20px;left:50%;width:2px}.equipmentTarget:hover{filter:brightness(1.35);transform:translate(-50%,-50%) scale(1.06)}.equipmentTarget.hit{animation:targetHit .45s ease-out}.equipmentHint{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);padding:7px 11px;border:1px solid #5aeaff33;background:#020b15e8;color:#88b8c7;font:900 7px ui-monospace;letter-spacing:.12em;white-space:nowrap}@keyframes targetLive{to{box-shadow:0 0 0 12px #07170faa,0 0 48px #54ff9baa,0 0 90px #38dfff66,inset 0 0 34px #48ff9430}}@keyframes targetHit{35%{transform:translate(-50%,-50%) scale(1.3);filter:brightness(2)}}@media(max-width:700px){.guidedMission{width:86%;top:12px}.equipmentTarget{width:86px;height:86px}.equipmentTarget span{font-size:22px}.equipmentHint{font-size:6px;max-width:90%;white-space:normal;text-align:center}}
   `}</style>
 </div>
}
