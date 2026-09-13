"use client";

import { useEffect } from "react";

const QUESTIONS: Record<number,string> = {
  1:"Before opening or changing anything on an operating HVAC system, what should the technician do first?",
  2:"A loaded filter and return restriction are visible, but airflow has not been measured. What should the technician do next?",
  3:"Static pressure is elevated and delivered airflow is below target. What does the evidence support at this point?",
  4:"Supply voltage is stable under load with no visible heat damage. What conclusion is supported?",
  5:"The thermostat call is present and the indoor control path responds during testing. What should be recorded?",
  6:"Dark surface material is visible near the evaporator, but no qualified identification exists. What should the technician do?",
  7:"The indoor sequence supports an airflow restriction, but refrigerant mass and compressor condition remain unestablished. What is the correct next move?",
  8:"At the condenser, no outdoor baseline has been captured yet. What should happen before cleaning, opening, or adjusting anything?",
  9:"Condenser discharge airflow is weak across a documented impacted coil. What does the evidence establish?",
  10:"Compressor current is elevated but within nameplate limits while condenser heat rejection is restricted. What should the technician do?",
  11:"Temperature readings are abnormal while known indoor and outdoor airflow restrictions remain uncorrected. What is the correct interpretation?",
  12:"The pre-intervention record establishes indoor and outdoor airflow restrictions, but not refrigerant mass or compressor failure. What determination is supported?",
  13:"The evidence supports correcting the documented airflow restrictions only. What intervention is admissible?",
  14:"After the bounded corrections, airflow, static pressure, temperatures, heat rejection, and compressor current improve. What closes the service chain?",
};

function readStep(){
  const text=document.querySelector<HTMLElement>(".zone")?.textContent??"";
  const match=text.match(/STEP\s+(\d+)\s+OF\s+14/i);
  return match?Number(match[1]):0;
}

export default function QuestionOnlyPlay(){
  useEffect(()=>{
    const apply=()=>{
      const mission=document.querySelector<HTMLElement>(".mission");
      if(!mission)return;
      const step=readStep();
      if(!step)return;
      let prompt=mission.querySelector<HTMLElement>(".ta14-question-prompt");
      if(!prompt){
        prompt=document.createElement("h2");
        prompt.className="ta14-question-prompt";
        const choices=mission.querySelector(".choices");
        if(choices) mission.insertBefore(prompt,choices);
      }
      prompt.textContent=QUESTIONS[step]??"What does the evidence support next?";
    };
    apply();
    const observer=new MutationObserver(()=>window.requestAnimationFrame(apply));
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    return()=>observer.disconnect();
  },[]);

  return <style>{`
    .mission>div:first-child{display:flex;justify-content:center}
    .mission>div:first-child .gate{display:none!important}
    .mission>h2:not(.ta14-question-prompt),.mission>.missionText,.mission>.evidenceBox,.mission>.guardBox{display:none!important}
    .mission{justify-content:center!important;min-height:620px!important;padding:clamp(22px,4vw,54px)!important}
    .ta14-question-prompt{display:block!important;max-width:920px;margin:24px auto 28px!important;text-align:center;font-size:clamp(28px,4vw,52px)!important;line-height:1.08!important;letter-spacing:-.035em!important;color:#effcff}
    .mission .choices{width:min(940px,100%);margin:0 auto!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:14px!important}
    .mission .choice{min-height:108px!important;padding:20px!important;font-size:15px!important;line-height:1.45!important}
    .mission .choice b{display:inline-block!important;min-width:28px;color:#6eeaff;font-size:20px!important}
    .mission .message{margin:18px auto 0!important;max-width:900px}
    @media(max-width:760px){.mission .choices{grid-template-columns:1fr!important}.mission .choice{min-height:82px!important}.ta14-question-prompt{font-size:30px!important}}
  `}</style>;
}
