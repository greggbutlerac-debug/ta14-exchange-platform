"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const LABELS: Record<string,string> = {
  core: "CORE ORBIT",
  type1: "TYPE I MOON",
  type2: "TYPE II GIANT",
  type3: "TYPE III VOID",
  transition: "A2L FRONTIER",
  universal: "UNIVERSE GATE",
};

export default function WorldAutoSelect(){
  const params = useSearchParams();
  useEffect(()=>{
    const requested = params.get("world");
    if(!requested || !LABELS[requested]) return;
    let attempts=0;
    const timer=window.setInterval(()=>{
      attempts++;
      const buttons=Array.from(document.querySelectorAll<HTMLButtonElement>("button.world"));
      const target=buttons.find(btn=>btn.textContent?.includes(LABELS[requested]));
      if(target){target.click();window.clearInterval(timer);}
      if(attempts>30) window.clearInterval(timer);
    },80);
    return()=>window.clearInterval(timer);
  },[params]);
  return null;
}
