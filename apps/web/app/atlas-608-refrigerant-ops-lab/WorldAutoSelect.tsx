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
    let lastClick = 0;

    const enforce = () => {
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("button.world"));
      const target = buttons.find(btn => btn.textContent?.includes(label));
      if(!target) return;
      const active = target.classList.contains("active");
      if(!active && Date.now() - lastClick > 250){
        lastClick = Date.now();
        target.click();
      }
    };

    const boot = window.setInterval(enforce, 100);
    const observer = new MutationObserver(enforce);
    observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});
    const stopBoot = window.setTimeout(()=>window.clearInterval(boot),5000);
    enforce();

    return()=>{
      window.clearInterval(boot);
      window.clearTimeout(stopBoot);
      observer.disconnect();
    };
  },[params]);

  return null;
}
