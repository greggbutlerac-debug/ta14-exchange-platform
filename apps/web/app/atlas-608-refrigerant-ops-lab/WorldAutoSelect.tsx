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
    const label = LABELS[requested];
    let completed = false;
    let boot = 0;
    let stopBoot = 0;
    const observer = new MutationObserver(enforce);

    function stop(){
      window.clearInterval(boot);
      window.clearTimeout(stopBoot);
      observer.disconnect();
    }

    function enforce(){
      if(completed) return;
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("button.world"));
      const target = buttons.find(btn => btn.textContent?.includes(label));
      if(!target) return;
      if(!target.classList.contains("active")) target.click();
      completed = true;
      stop();
    }

    boot = window.setInterval(enforce,100);
    observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});
    stopBoot = window.setTimeout(stop,5000);
    enforce();

    return stop;
  },[params]);

  return null;
}
