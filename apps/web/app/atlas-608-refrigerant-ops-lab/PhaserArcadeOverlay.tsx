"use client";

import {useEffect,useState} from "react";
import PhaserEffectsLayer from "./PhaserEffectsLayer";

export default function PhaserArcadeOverlay(){
 const [flash,setFlash]=useState<"good"|"bad"|null>(null);
 const [streak,setStreak]=useState(0);

 useEffect(()=>{
  let clearTimer:number|undefined;
  let last="";

  const readState=()=>{
   const board=document.querySelector("main.ops");
   if(!board)return;
   const next=board.classList.contains("good")?"good":board.classList.contains("bad")?"bad":"";
   if(!next||next===last)return;
   last=next;
   setFlash(next as "good"|"bad");
   if(next==="good")setStreak(s=>s+1);else setStreak(0);
   if(clearTimer)window.clearTimeout(clearTimer);
   clearTimer=window.setTimeout(()=>{
    setFlash(null);
    last="";
   },next==="good"?1250:700);
  };

  const observer=new MutationObserver(readState);
  const attach=()=>{
   const board=document.querySelector("main.ops");
   if(board){observer.observe(board,{attributes:true,attributeFilter:["class"]});readState();return true}
   return false;
  };

  if(!attach()){
   const bodyObserver=new MutationObserver(()=>{if(attach())bodyObserver.disconnect()});
   bodyObserver.observe(document.body,{childList:true,subtree:true});
   return()=>{bodyObserver.disconnect();observer.disconnect();if(clearTimer)window.clearTimeout(clearTimer)};
  }

  return()=>{observer.disconnect();if(clearTimer)window.clearTimeout(clearTimer)};
 },[]);

 return <PhaserEffectsLayer flash={flash} streak={streak}/>;
}
