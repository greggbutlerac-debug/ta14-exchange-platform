"use client";

import { useEffect } from "react";

const CORRECT_BY_STEP: Record<number, number> = {1:1,2:0,3:1,4:0,5:0,6:1,7:1,8:0,9:0,10:0,11:0,12:0,13:0,14:0};

const DISTRACTORS: Record<number, string[]> = {
  1:["Capture the thermostat and equipment identity now, then open the air handler before photographing the operating condition so the internal inspection can complete the baseline.","Ask the homeowner for the complaint history and likely repair budget, record the thermostat state, then begin component testing while the equipment is still operating.","Preserve equipment identity and the thermostat call, then make a provisional refrigerant-side diagnosis that can be revised after the remaining baseline measurements are collected."],
  2:["Replace the loaded filter after photographing it, then treat the improved return condition as the reference state for the remaining airflow measurements because the restriction has already been preserved.","Record the restriction as the leading cause of the complaint while continuing airflow testing, since the visual evidence is strong enough to support a provisional causal determination.","Document the return condition and recommend the filtration correction now, then measure airflow afterward to determine whether additional duct work is necessary."],
  3:["Preserve the airflow measurements and treat the supported airflow defect as sufficient authority to postpone only charge adjustment while still using current refrigeration readings to classify refrigerant condition.","Because elevated static and low delivered airflow are independently measured, authorize blower correction now and establish the refrigeration baseline immediately afterward without preserving the pre-correction refrigeration state.","Record the airflow defect as primary and recommend return-duct modification before checking whether another bounded correction could restore the governing airflow condition."],
  4:["Record the stable supply voltage as evidence that the electrical path is presently acceptable through the disconnect and contactor, while leaving only motor and capacitor condition open for later checks.","Preserve the voltage reading and classify electrical supply as cleared for this call unless a later refrigeration measurement creates a reason to reopen the electrical branch.","Because voltage remains stable under load, defer the remaining electrical checks until after the airflow corrections so electrical measurements are taken under a more representative operating condition."],
  5:["Record the verified call and response, then close the control branch unless the homeowner can reproduce an intermittent failure during the remaining service sequence.","Treat the responding thermostat as sufficient evidence to exclude the control path from the current complaint while preserving a note that intermittent behavior was not tested.","Preserve the observed control response and temporarily bypass the thermostat during outdoor testing so cycling cannot interrupt the refrigeration evidence collection."],
  6:["Document the visible material without making a health claim, but classify the evaporator as contaminated for HVAC purposes and make cleaning a prerequisite to the remaining performance testing.","Preserve photographs and describe the material as suspected biological growth, while clearly telling the homeowner that laboratory confirmation would be required before any health conclusion.","Continue the HVAC sequence but exclude the visible material from the service record because it cannot be technically identified within the technician's present scope."],
  7:["Proceed outside with the supported airflow finding, but classify refrigerant mass as provisionally suspect so the outdoor sequence can be prioritized around confirming or rejecting that working diagnosis.","Correct the documented indoor restriction before going outside, preserve the correction, and use the improved indoor condition as the operating baseline for all remaining system determinations.","Give the homeowner a bounded diagnosis of airflow restriction as the cause of the complaint while keeping compressor and refrigerant conclusions explicitly unresolved."],
  8:["Preserve equipment identity, ambient temperature, and overall condenser condition, then clean only enough of the coil to obtain a representative airflow measurement before completing the outdoor baseline.","Photograph the impacted coil and record it as a supported heat-rejection restriction before measuring discharge airflow, since the physical obstruction itself establishes the operating consequence.","Document the undisturbed condenser, then authorize coil cleaning as a diagnostic intervention because restoring a known abnormal condition will make the remaining measurements more reliable."],
  9:["Classify condenser airflow restriction as the primary system fault and authorize cleaning before completing electrical load measurements, because the restriction is now supported by both visual and airflow evidence.","Preserve the supported heat-rejection restriction and use it to interpret elevated refrigeration pressures as evidence of an airflow-driven rather than charge-driven condition before correction.","Record the restriction and tell the homeowner that compressor stress is supported, while reserving compressor failure as an open determination until post-cleaning electrical testing."],
  10:["Record elevated current as a supported compressor-load abnormality caused by restricted heat rejection, then use the post-correction current only to quantify how much compressor stress was removed.","Preserve the reading and classify compressor condition as provisionally degraded because current is elevated relative to expected field behavior even though it remains within nameplate limits.","Treat the current as non-material until the condenser restriction is corrected, then establish the post-correction current as the valid electrical baseline for compressor assessment."],
  11:["Preserve the temperature pattern and classify refrigerant condition as provisionally abnormal, while withholding any charge adjustment until airflow restrictions are corrected and the provisional finding can be confirmed.","Use the elevated split only to strengthen the supported heat-rejection determination, excluding it from later refrigerant analysis because it was collected under known airflow restrictions.","Correct the known airflow restrictions, then discard these pre-correction temperature readings and establish a new refrigeration baseline after stabilization because the original values are confounded."],
  12:["Determine that airflow restrictions are the most probable root cause of the complaint and authorize correction, while keeping refrigerant and compressor failure formally open pending verification.","Determine that the supported restrictions justify corrective work plus a precautionary refrigerant evaluation during the same intervention because charge condition remains unresolved.","Classify the system as having multiple supported performance faults—indoor airflow, outdoor heat rejection, and elevated compressor load—while reserving only component replacement decisions for post-correction testing."],
  13:["Correct the supported restrictions and, while the system stabilizes, connect refrigeration instruments so post-correction charge evidence is available immediately without requiring a second stabilization period.","Correct the restrictions, document the work, and authorize a minor refrigerant adjustment only if the first post-correction temperature pattern remains abnormal, before completing the full comparison record.","Correct the supported restrictions and present compressor replacement as a contingent option before retesting, based on the previously elevated current and the possibility that load stress has already caused degradation."],
  14:["Create the before/after record and conclude that the corrected airflow restrictions caused the original complaint because every tracked operating indicator improved without refrigerant adjustment.","Preserve the improved measurements as proof of successful repair and close the service outcome, while noting that untested intermittent conditions remain outside the scope of the visit.","Compare the post-state to baseline and classify the system as fully restored within the tested operating envelope, allowing preventive refrigerant optimization to be offered separately from the completed repair."],
};

const POSITION_ROTATION: Record<number, number[]> = {1:[2,0,3,1],2:[1,3,0,2],3:[3,1,2,0],4:[0,2,1,3],5:[2,3,0,1],6:[1,0,3,2],7:[3,2,1,0],8:[2,0,1,3],9:[1,3,2,0],10:[3,1,0,2],11:[0,2,3,1],12:[2,1,3,0],13:[3,0,2,1],14:[1,2,0,3]};

function getStepNumber(){const zone=document.querySelector<HTMLElement>(".zone")?.textContent??"";const match=zone.match(/STEP\s+(\d+)\s+OF\s+14/i);return match?Number(match[1]):0;}
function normalize(text:string){return text.replace(/\s+/g," ").trim();}

export default function AnswerLengthIntegrity(){
  useEffect(()=>{
    const originals=new WeakMap<HTMLElement,string>();
    let lastStep=-1;

    const restore=()=>{document.querySelectorAll<HTMLElement>(".choice").forEach(button=>{const original=originals.get(button);if(original)button.textContent=original;button.style.order="";});};

    const apply=()=>{
      const step=getStepNumber();
      const buttons=Array.from(document.querySelectorAll<HTMLElement>(".choice"));
      if(!step||buttons.length!==4)return;
      if(step!==lastStep){restore();lastStep=step;}
      buttons.forEach(button=>{if(!originals.has(button))originals.set(button,normalize(button.textContent??""));});
      const correctIndex=CORRECT_BY_STEP[step];
      if(correctIndex===undefined)return;

      const wrongIndexes=buttons.map((_,index)=>index).filter(index=>index!==correctIndex);
      const replacements=DISTRACTORS[step]??[];
      wrongIndexes.forEach((index,position)=>{const next=replacements[position]??originals.get(buttons[index])??"";if(buttons[index].textContent!==next)buttons[index].textContent=next;});

      // Preserve the requested anti-length cue: seven steps deliberately contain
      // a wrong answer longer than the correct response. The other seven use
      // naturally competitive lengths rather than padding every distractor.
      if(step%2===0){
        const correctLength=normalize(originals.get(buttons[correctIndex])??"").length;
        const longestWrong=wrongIndexes.reduce((best,index)=>normalize(buttons[index].textContent??"").length>normalize(buttons[best].textContent??"").length?index:best,wrongIndexes[0]);
        if(normalize(buttons[longestWrong].textContent??"").length<=correctLength){buttons[longestWrong].textContent+= " The sequence can still appear defensible because each individual observation is real and documented, but the proposed conclusion crosses one governing boundary before the record authorizes it.";}
      }

      const visualOrder=POSITION_ROTATION[step]??[0,1,2,3];
      buttons.forEach((button,originalIndex)=>{button.style.order=String(visualOrder[originalIndex]);});
    };

    apply();
    const observer=new MutationObserver(()=>window.requestAnimationFrame(apply));
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    return()=>{observer.disconnect();restore();};
  },[]);
  return null;
}
