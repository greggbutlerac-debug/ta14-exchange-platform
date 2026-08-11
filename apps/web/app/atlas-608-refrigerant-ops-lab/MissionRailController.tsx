"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const INTEL:Record<string,string[]>={
 core:["Separate observation from determination.","Know recover vs recycle vs reclaim.","Verify refrigerant and cylinder identity before action.","A missing governing fact can make NOT YET the correct move."],
 type1:["Type I clue: factory-sealed appliance with 5 lb or less.","Small charge does not erase recovery responsibility.","Compressor condition can change the applicable recovery logic.","Empty-looking is not proof of an empty circuit."],
 type2:["Classify appliance and refrigerant before Type II logic.","Do not confuse service rules with new-equipment transition rules.","Recovery comes before opening when required.","Physical compatibility is not authorization."],
 type3:["Low pressure does not mean empty.","Watch purge and noncondensable behavior.","Protect against freeze risk during low-pressure work.","Do not open the circuit on a gauge reading alone."],
 transition:["Read the equipment label before assuming refrigerant compatibility.","A2L work adds tool, ignition, ventilation and procedure controls.","R-32 and R-454B are not automatic R-410A drop-ins.","Identity + use conditions + approved procedure come before action."],
 universal:["Every world is live here.","Classify before choosing the rule.","Resist plausible answers that outrun the evidence.","The highest-scoring move may be a controlled refusal."],
};
const TITLES:Record<string,string>={core:"CORE ORBIT",type1:"TYPE I MOON",type2:"TYPE II GIANT",type3:"TYPE III VOID",transition:"A2L FRONTIER",universal:"UNIVERSE GATE"};

export default function MissionRailController(){
 const params=useSearchParams();
 const [world,setWorld]=useState(params.get("world")||"core");
 useEffect(()=>{
  const sync=()=>{const active=document.querySelector<HTMLButtonElement>("button.world.active");const text=active?.textContent||"";const found=Object.entries(TITLES).find(([,v])=>text.includes(v));if(found)setWorld(found[0])};
  const t=window.setInterval(sync,400);sync();return()=>window.clearInterval(t);
 },[]);
 const clues=INTEL[world]||INTEL.core;
 return <div className="missionIntelOverlay">
   <div className="intelHead"><small>MISSION INTELLIGENCE // WORLD LOCKED</small><strong>{TITLES[world]||TITLES.core}</strong></div>
   <div className="intelGrid">{clues.map((c,i)=><div className="intelClue" key={c}><b>CLUE {String(i+1).padStart(2,"0")}</b><span>{c}</span></div>)}</div>
   <button className="gateExit" onClick={()=>{window.location.href="/atlas-608-refrigerant-ops-lab"}}>↩ EXIT TO UNIVERSE GATE</button>
   <div className="lockNote">World switching is disabled during an active mission.</div>
 </div>;
}
