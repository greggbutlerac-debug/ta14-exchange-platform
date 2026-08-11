"use client";
import {useEffect,useState} from "react";

const RUNS=[
 {n:1,name:"CADET RUN",range:"01–25",rule:"FULL FIELD GUIDE"},
 {n:2,name:"TECHNICIAN RUN",range:"26–50",rule:"HARDER APPLICATION"},
 {n:3,name:"PRO RUN",range:"51–75",rule:"NO ASSIST"},
 {n:4,name:"MASTER RUN",range:"76–100",rule:"MAX FIELD PRESSURE"},
] as const;

export default function RunProgressionHUD(){
 const[current,setCurrent]=useState(1),[unlocked,setUnlocked]=useState(1);
 useEffect(()=>{
  try{setUnlocked(Math.max(1,Math.min(4,Number(localStorage.getItem("ta14-608-unlocked-run")||1))))}catch{}
  const read=()=>{const board=document.querySelector("main.ops");if(!board)return;let n=1;for(let i=1;i<=4;i++)if(board.classList.contains(`stage-${i}`))n=i;setCurrent(n);setUnlocked(u=>{const next=Math.max(u,n);try{localStorage.setItem("ta14-608-unlocked-run",String(next))}catch{}return next})};
  const observer=new MutationObserver(read),attach=()=>{const board=document.querySelector("main.ops");if(!board)return false;observer.observe(board,{attributes:true,attributeFilter:["class"]});read();return true};
  if(!attach()){const body=new MutationObserver(()=>{if(attach())body.disconnect()});body.observe(document.body,{childList:true,subtree:true});return()=>{body.disconnect();observer.disconnect()}}
  return()=>observer.disconnect();
 },[]);
 return <aside className="runProgress" aria-label="EPA 608 arcade run progression"><div className="runTitle"><b>100-Q WORLD CAMPAIGN</b><span>4 × 25 QUESTION RUNS</span></div><div className="runTrack">{RUNS.map(r=>{const state=r.n<current?"cleared":r.n===current?"active":r.n<=unlocked?"unlocked":"locked";return <div key={r.n} className={`runNode ${state}`}><i>{state==="cleared"?"✓":state==="locked"?"◆":r.n}</i><div><strong>{r.name}</strong><small>{r.range} // {r.rule}</small></div></div>})}</div><style jsx>{`.runProgress{position:fixed;z-index:30;left:50%;bottom:14px;transform:translateX(-50%);width:min(920px,calc(100vw - 28px));padding:8px 10px;border:1px solid #22586c;border-radius:15px;background:linear-gradient(180deg,#061522ed,#020914f2);box-shadow:0 12px 45px #000b,0 0 28px #39dcff16;backdrop-filter:blur(10px);pointer-events:none}.runTitle{display:flex;justify-content:space-between;gap:10px;padding:0 4px 6px;font:900 8px ui-monospace;letter-spacing:.13em}.runTitle b{color:#65eaff}.runTitle span{color:#67f0b2}.runTrack{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.runNode{display:flex;align-items:center;gap:8px;min-width:0;padding:7px 9px;border:1px solid #173a49;border-radius:10px;background:#030d16;color:#557482;transition:.25s}.runNode i{display:grid;place-items:center;flex:0 0 25px;height:25px;border:1px solid currentColor;border-radius:50%;font:1000 9px ui-monospace;font-style:normal}.runNode strong,.runNode small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.runNode strong{font:1000 8px ui-monospace;letter-spacing:.06em}.runNode small{margin-top:2px;font:800 6px ui-monospace;opacity:.72}.runNode.active{border-color:#5be9ff;color:#dffcff;background:#082332;box-shadow:inset 0 0 22px #35ddff16,0 0 18px #35ddff18}.runNode.active i{color:#6affb3;box-shadow:0 0 14px #62ffad55}.runNode.cleared{border-color:#27684f;color:#6ff0b5;background:#061a14}.runNode.unlocked{border-color:#665b27;color:#ffe28a}.runNode.locked{opacity:.42;filter:saturate(.55)}@media(max-width:700px){.runProgress{bottom:7px}.runTitle span{display:none}.runTrack{grid-template-columns:repeat(4,1fr)}.runNode{justify-content:center;padding:6px 3px}.runNode div{display:none}}`}</style></aside>
}
