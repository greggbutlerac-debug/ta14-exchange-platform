"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "READY" | "7 IN" | "7 OUT" | "COMPLETE" | "EXPIRED";

const CANONICAL_ROUTE = [
  "Approaching & Opening the Air Handler",
  "Heat Kit & Furnace Operation Check",
  "Blower Motor & Airflow Integrity",
  "Evaporator Coil Inspection",
  "Metering Device Identification",
  "Filter & Return Airflow Check",
  "Air Handler Reassembly Check",
  "Condenser Visual Inspection & Controlled Panel Opening",
  "Start Components, Capacitors & Compressor Insulation Verification",
  "Compressor & Fan Motor Amp Draw Verification",
  "Condenser Panel Reassembly & Mechanical Integrity Check",
  "Condenser Coil Cleaning & Airflow Restoration",
  "Refrigerant Charge Approximation",
  "Condensate Management Verification & System Closure",
];

function readStep() {
  const zone = document.querySelector<HTMLElement>(".zone")?.textContent ?? "";
  const match = zone.match(/STEP\s+(\d+)\s+OF\s+14/i);
  return match ? Number(match[1]) : 0;
}

function readTimer() {
  return document.querySelector<HTMLElement>(".timer strong")?.textContent?.trim() ?? "20:00";
}

export default function SevenInSevenOutIntegrity() {
  const [phase, setPhase] = useState<Phase>("READY");
  const [step, setStep] = useState(0);
  const attempts = useRef(0);
  const correct = useRef(0);
  const lastStep = useRef(0);

  useEffect(() => {
    const resetAccuracy = () => {
      attempts.current = 0;
      correct.current = 0;
      lastStep.current = 0;
    };

    const rewriteMissionRoute = () => {
      const candidates = Array.from(document.querySelectorAll<HTMLElement>("div,section,aside,nav"));
      const route = candidates.find((el) => {
        const text = el.textContent ?? "";
        return text.includes("Mission Route") && text.includes("Approach & Opening") && text.includes("Post-Intervention Proof");
      });
      if (!route) return;

      const all = Array.from(route.querySelectorAll<HTMLElement>("*"));
      CANONICAL_ROUTE.forEach((title, index) => {
        const number = String(index + 1).padStart(2, "0");
        const oldLabels = [
          "Approach & Opening","Filter & Return Air","Blower & Airflow Integrity","Electrical Supply","Controls & Call","Evaporator Condition","Indoor Evidence Gate","Outdoor Approach","Condenser Airflow","Outdoor Electrical","Temperature Evidence","Determination Threshold","Intervention Gate","Post-Intervention Proof",
        ];
        const node = all.find((el) => el.children.length === 0 && el.textContent?.trim() === oldLabels[index]);
        if (node) node.textContent = title;
        const numberNode = all.find((el) => el.children.length === 0 && el.textContent?.trim() === number);
        if (numberNode) numberNode.setAttribute("data-ta14-phase", index < 7 ? "7-IN" : "7-OUT");
      });
    };

    const updateAccuracyHud = () => {
      const cards = Array.from(document.querySelectorAll<HTMLElement>(".hudCard"));
      const accuracyCard = cards.find((card) => card.querySelector("span")?.textContent?.trim() === "Accuracy");
      const value = accuracyCard?.querySelector<HTMLElement>("strong");
      if (!value) return;
      const accuracy = attempts.current === 0 ? 100 : Math.round((correct.current / attempts.current) * 100);
      value.textContent = `${accuracy}%`;
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest(".startBtn")) {
        resetAccuracy();
        window.setTimeout(updateAccuracyHud, 0);
        return;
      }
      if (!target.closest(".choice")) return;
      const before = readStep();
      attempts.current += 1;
      window.setTimeout(() => {
        const after = readStep();
        if (after > before || (before === 14 && Boolean(document.querySelector(".finishScreen")))) correct.current += 1;
        updateAccuracyHud();
      }, 650);
    };

    const inspect = () => {
      rewriteMissionRoute();
      const currentStep = readStep();
      const timer = readTimer();
      const finished = Boolean(document.querySelector(".finishScreen"));
      const started = Boolean(document.querySelector(".mission"));
      setStep(currentStep);
      if (currentStep > lastStep.current) lastStep.current = currentStep;
      updateAccuracyHud();
      if (finished && timer === "00:00" && lastStep.current < 14) {
        document.body.classList.add("fieldops-timeout");
        setPhase("EXPIRED");
      } else {
        document.body.classList.remove("fieldops-timeout");
        if (finished && lastStep.current === 14) setPhase("COMPLETE");
        else if (!started) setPhase("READY");
        else if (currentStep > 0 && currentStep <= 7) setPhase("7 IN");
        else if (currentStep >= 8) setPhase("7 OUT");
      }
    };

    document.addEventListener("click", onClick, true);
    inspect();
    const timer = window.setInterval(inspect, 250);
    return () => { document.removeEventListener("click", onClick, true); window.clearInterval(timer); document.body.classList.remove("fieldops-timeout"); };
  }, []);

  return <>
    <style>{`
      .seven-route-integrity{position:fixed;z-index:30;left:50%;bottom:14px;transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:9px 12px;border:1px solid rgba(91,234,255,.32);border-radius:999px;background:rgba(2,10,17,.9);backdrop-filter:blur(14px);box-shadow:0 12px 40px rgba(0,0,0,.38);font:900 10px/1 Inter,system-ui,sans-serif;letter-spacing:.1em;color:#8aa8b7;pointer-events:none}.seven-route-integrity b{color:#eaffff}.seven-route-integrity .on{color:#68efb2}.seven-route-integrity .divider{opacity:.35}.seven-route-integrity.expired{border-color:rgba(255,90,108,.65);color:#ff9aa7}.fieldops-timeout .finishInner{visibility:hidden}.fieldops-expired{display:none}.fieldops-timeout .fieldops-expired{display:grid;position:fixed;z-index:40;inset:0;place-items:center;padding:30px;background:rgba(4,3,9,.94);color:#eefcff;font-family:Inter,system-ui,sans-serif;text-align:center}.fieldops-expired section{max-width:720px;padding:30px;border:1px solid rgba(255,90,108,.58);border-radius:22px;background:rgba(30,7,14,.96)}.fieldops-expired small{color:#ff9aaa;font-weight:1000;letter-spacing:.16em}.fieldops-expired h2{font-size:clamp(34px,6vw,70px);line-height:.94;margin:12px 0}.fieldops-expired p{color:#cbaeb4;line-height:1.65}.fieldops-expired strong{color:#ffd36b}[data-ta14-phase="7-IN"]::after{content:" IN";margin-left:5px;color:#68efb2;font-size:.55em;font-weight:1000}[data-ta14-phase="7-OUT"]::after{content:" OUT";margin-left:5px;color:#5beaff;font-size:.55em;font-weight:1000}@media(max-width:760px){.seven-route-integrity{bottom:8px;font-size:8px;white-space:nowrap}}
    `}</style>
    <div className={`seven-route-integrity ${phase === "EXPIRED" ? "expired" : ""}`} aria-live="polite"><b>TA-14 14-STEP ROUTE</b><span className="divider">|</span><span className={phase === "7 IN" ? "on" : ""}>7 IN</span><span>→</span><span className={phase === "7 OUT" ? "on" : ""}>7 OUT</span>{step > 0 && <><span className="divider">|</span><span>STEP {step}/TA-14</span></>}{phase === "COMPLETE" && <><span className="divider">|</span><span className="on">OUTCOME PROVED</span></>}{phase === "EXPIRED" && <><span className="divider">|</span><span>NOT CLEARED</span></>}</div>
    <div className="fieldops-expired" role="alert"><section><small>TA-14 FIELD OPS // RUN EXPIRED</small><h2>TIME EXPIRED.<br/>OUTCOME NOT PROVED.</h2><p>The TA-14 14-step chain was not completed before the mission clock reached zero. <strong>No completed chain. No completion claim.</strong></p></section></div>
  </>;
}
