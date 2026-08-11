"use client";

import { useEffect, useMemo, useState } from "react";

export type PressureStage = 1|2|3|4;
type EventKind="customer"|"environment"|"equipment"|"crew";
type PressureEvent={kind:EventKind;who:string;line:string;icon:string};
type Position={left:string;top:string;tilt:number};

const EVENTS:PressureEvent[]=[
 {kind:"customer",who:"HOMEOWNER",line:"So what do you think it is?",icon:"🏠"},{kind:"customer",who:"HOMEOWNER",line:"How much is this going to cost me?",icon:"💵"},{kind:"customer",who:"HOMEOWNER",line:"Do you really know what you're doing?",icon:"🤨"},{kind:"customer",who:"HOMEOWNER",line:"I've only got 20 minutes before I have to leave.",icon:"⏱️"},{kind:"customer",who:"HOMEOWNER",line:"The last guy said I need a whole new system.",icon:"🗣️"},{kind:"customer",who:"HOMEOWNER",line:"Can't you just add a little refrigerant and see what happens?",icon:"🧊"},{kind:"customer",who:"HOMEOWNER",line:"Is that mold? Should I be worried?",icon:"❓"},{kind:"customer",who:"HOMEOWNER",line:"Can you tell me right now whether I should replace it?",icon:"🏠"},
 {kind:"environment",who:"FIELD EVENT",line:"The thermostat setting was changed while you were outside.",icon:"🌡️"},{kind:"environment",who:"FIELD EVENT",line:"A door has been left open. Conditions are changing.",icon:"🚪"},{kind:"environment",who:"FIELD EVENT",line:"Outdoor conditions are shifting. Preserve your sequence.",icon:"🌦️"},
 {kind:"equipment",who:"SYSTEM EVENT",line:"The equipment sound just changed. Observe before concluding.",icon:"⚙️"},{kind:"equipment",who:"SYSTEM EVENT",line:"A breaker was cycled. Your earlier operating state may no longer be continuous.",icon:"⚡"},
 {kind:"crew",who:"OTHER TECH",line:"I'd just throw gauges on it and see what the pressures are.",icon:"🧰"},{kind:"crew",who:"DISPATCH",line:"Your next call is waiting. Can you wrap this one up?",icon:"📱"},
];
const STAGES={1:{name:"CADET RUN",tag:"FOUNDATION",help:true,pressure:"LOW"},2:{name:"TECHNICIAN RUN",tag:"APPLICATION",help:true,pressure:"MEDIUM"},3:{name:"PRO RUN",tag:"NO ASSIST",help:false,pressure:"HIGH"},4:{name:"MASTER RUN",tag:"FIELD PRESSURE",help:false,pressure:"MAX"}} as const;
export function stageForQuestion(n:number):PressureStage{return Math.min(4,Math.max(1,Math.ceil(n/25))) as PressureStage}
export function stageMeta(stage:PressureStage){return STAGES[stage]}
function randomPosition():Position{const zones=[{left:[3,22],top:[16,35]},{left:[68,80],top:[16,36]},{left:[4,24],top:[57,76]},{left:[66,80],top:[56,77]},{left:[34,56],top:[10,23]},{left:[34,56],top:[68,80]}];const z=zones[Math.floor(Math.random()*zones.length)];return{left:`${z.left[0]+Math.random()*(z.left[1]-z.left[0])}%`,top:`${z.top[0]+Math.random()*(z.top[1]-z.top[0])}%`,tilt:-2+Math.random()*4}}

export default function ArcadePressureLayer({stage,enabled=true}:{stage:PressureStage;enabled?:boolean}){
 const [event,setEvent]=useState<PressureEvent|null>(null),[serial,setSerial]=useState(0);const [position,setPosition]=useState<Position>({left:"70%",top:"18%",tilt:0});
 const cadence=useMemo(()=>stage===1?[24000,37000]:stage===2?[17000,28000]:stage===3?[12000,22000]:[8500,16500],[stage]);
 useEffect(()=>{if(!enabled){setEvent(null);return}let timer:number|undefined,hide:number|undefined;const schedule=()=>{const delay=cadence[0]+Math.random()*(cadence[1]-cadence[0]);timer=window.setTimeout(()=>{setPosition(randomPosition());setEvent(EVENTS[Math.floor(Math.random()*EVENTS.length)]);setSerial(s=>s+1);hide=window.setTimeout(()=>{setEvent(null);schedule()},3000+Math.random()*1200)},delay)};schedule();return()=>{if(timer)clearTimeout(timer);if(hide)clearTimeout(hide)}},[cadence,enabled]);
 if(!event)return null;
 return <div key={serial} className={`pressureEvent pressure-${event.kind}`} style={{left:position.left,top:position.top,transform:`rotate(${position.tilt}deg)`}} role="status" aria-live="polite"><div className="pressureIcon">{event.icon}</div><div><small>{event.who} // DISTRACTION EVENT</small><strong>{event.line}</strong><span>Maintain sequence. Pressure does not create evidence.</span></div></div>;
}
