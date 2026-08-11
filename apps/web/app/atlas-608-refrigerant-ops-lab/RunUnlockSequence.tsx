"use client";

import {useEffect,useState} from "react";

const META:{[k:number]:{name:string;tag:string;rule:string}}={
 1:{name:"CADET RUN",tag:"FOUNDATION",rule:"FIELD GUIDE AVAILABLE"},
 2:{name:"TECHNICIAN RUN",tag:"APPLICATION",rule:"HARDER APPLICATION PRESSURE"},
 3:{name:"PRO RUN",tag:"NO ASSIST",rule:"FIELD GUIDE DISABLED"},
 4:{name:"MASTER RUN",tag:"FIELD PRESSURE",rule:"MAXIMUM DISTRACTION PRESSURE"},
};

function worldFrom(board:Element){for(const c of Array.from(board.classList)){if(c.startsWith("world-"))return c.slice(6)}return "core"}
function stageFrom(board:Element){for(let i=1;i<=4;i++)if(board.classList.contains(`stage-${i}`))return i;return 1}

export default function RunUnlockSequence(){
 const[stage,setStage]=useState(1),[show,setShow]=useState(false),[world,setWorld]=useState("core");
 useEffect(()=>{
  let timer:number|undefined;let previousStage=1;let previousWorld="";
  const read=()=>{
   const board=document.querySelector("main.ops");if(!board)return;
   const nextStage=stageFrom(board),nextWorld=worldFrom(board);
   if(nextWorld!==previousWorld){previousWorld=nextWorld;previousStage=nextStage;setWorld(nextWorld);setStage(nextStage);return}
   if(nextStage>previousStage){previousStage=nextStage;setStage(nextStage);setWorld(nextWorld);setShow(true);try{localStorage.setItem(`ta14-608-${nextWorld}-unlocked-run`,String(nextStage))}catch{}if(timer)clearTimeout(timer);timer=window.setTimeout(()=>setShow(false),3600)}else previousStage=nextStage;
  };
  const observer=new MutationObserver(read);
  const attach=()=>{const board=document.querySelector("main.ops");if(!board)return false;observer.observe(board,{attributes:true,attributeFilter:["class"]});read();return true};
  if(!attach()){const body=new MutationObserver(()=>{if(attach())body.disconnect()});body.observe(document.body,{childList:true,subtree:true});return()=>{body.disconnect();observer.disconnect();if(timer)clearTimeout(timer)}}
  return()=>{observer.disconnect();if(timer)clearTimeout(timer)};
 },[]);
 if(!show||stage===1)return null;
 const m=META[stage];
 return <div className="runUnlock" role="status" aria-live="assertive"><div className="unlockGrid"/><div className="unlockCore"><small>{world.toUpperCase()} // SECTOR UNLOCK</small><div className="unlockNumber">0{stage}</div><h2>{m.name}</h2><b>{m.tag}</b><p>{m.rule}</p><span>RUN {stage-1} CLEARED // QUESTIONS {(stage-1)*25+1}–{stage*25} NOW ACTIVE</span></div><style jsx>{`.runUnlock{position:fixed;z-index:999999;inset:0;display:grid;place-items:center;pointer-events:none;background:radial-gradient(circle at center,#073448d9 0,#020914e8 42%,#00030af5 100%);animation:unlockFade 3.6s ease forwards;overflow:hidden}.runUnlock:before,.runUnlock:after{content:"";position:absolute;left:50%;top:50%;width:240px;height:240px;border:3px solid #65ffb0;border-radius:50%;transform:translate(-50%,-50%) scale(.1);box-shadow:0 0 60px #4effa766;animation:unlockWave 1.5s ease-out forwards}.runUnlock:after{border-color:#55eaff;animation-delay:.28s}.unlockGrid{position:absolute;inset:-40%;background:linear-gradient(#43eaff11 1px,transparent 1px),linear-gradient(90deg,#43eaff11 1px,transparent 1px);background-size:48px 48px;transform:perspective(700px) rotateX(68deg);animation:gridRush 3.3s linear forwards}.unlockCore{position:relative;z-index:2;width:min(680px,90vw);padding:34px;text-align:center;border:1px solid #63eaff;border-radius:22px;background:linear-gradient(180deg,#07192df4,#04101ff7);box-shadow:0 0 0 4px #020712,0 0 70px #42dcff55,0 0 120px #53ff9a22;animation:coreIn .42s cubic-bezier(.2,.9,.2,1)}.unlockCore small{display:block;color:#63eaff;font:1000 10px ui-monospace;letter-spacing:.2em}.unlockNumber{margin:10px auto 2px;color:#73ffb5;font:1000 78px/1 ui-monospace;text-shadow:0 0 28px #5cff9b88}.unlockCore h2{margin:4px 0;color:#fff;font:1000 35px ui-monospace;letter-spacing:.04em;text-shadow:0 0 20px #56eaff55}.unlockCore b{display:inline-block;padding:7px 12px;border:1px solid #63ffad66;border-radius:999px;color:#77ffba;background:#09251a;font:1000 9px ui-monospace;letter-spacing:.16em}.unlockCore p{margin:14px 0 8px;color:#ccecf4;font:900 14px ui-monospace}.unlockCore span{display:block;color:#7899a7;font:900 9px ui-monospace;letter-spacing:.12em}@keyframes coreIn{from{opacity:0;transform:scale(.72) translateY(30px)}to{opacity:1;transform:none}}@keyframes unlockWave{to{transform:translate(-50%,-50%) scale(7);opacity:0}}@keyframes gridRush{from{transform:perspective(700px) rotateX(68deg) translateY(0)}to{transform:perspective(700px) rotateX(68deg) translateY(600px)}}@keyframes unlockFade{0%,78%{opacity:1}100%{opacity:0}}`}</style></div>;
}
