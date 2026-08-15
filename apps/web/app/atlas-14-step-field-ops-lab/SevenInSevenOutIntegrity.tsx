"use client";

import { useEffect, useState } from "react";

type Phase = "READY" | "7 IN" | "7 OUT" | "COMPLETE" | "EXPIRED";

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

  useEffect(() => {
    const inspect = () => {
      const currentStep = readStep();
      const timer = readTimer();
      const finished = Boolean(document.querySelector(".finishScreen"));
      const started = Boolean(document.querySelector(".mission"));
      setStep(currentStep);

      if (finished && timer === "00:00" && currentStep < 14) {
        document.body.classList.add("fieldops-timeout");
        setPhase("EXPIRED");
      } else {
        document.body.classList.remove("fieldops-timeout");
        if (finished) setPhase("COMPLETE");
        else if (!started) setPhase("READY");
        else if (currentStep > 0 && currentStep <= 7) setPhase("7 IN");
        else if (currentStep >= 8) setPhase("7 OUT");
      }
    };

    inspect();
    const timer = window.setInterval(inspect, 250);
    return () => {
      window.clearInterval(timer);
      document.body.classList.remove("fieldops-timeout");
    };
  }, []);

  return <>
    <style>{`
      .seven-route-integrity{position:fixed;z-index:30;left:50%;bottom:14px;transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:9px 12px;border:1px solid rgba(91,234,255,.32);border-radius:999px;background:rgba(2,10,17,.9);backdrop-filter:blur(14px);box-shadow:0 12px 40px rgba(0,0,0,.38);font:900 10px/1 Inter,system-ui,sans-serif;letter-spacing:.1em;color:#8aa8b7;pointer-events:none}.seven-route-integrity b{color:#eaffff}.seven-route-integrity .on{color:#68efb2}.seven-route-integrity .divider{opacity:.35}.seven-route-integrity.expired{border-color:rgba(255,90,108,.65);color:#ff9aa7}.fieldops-timeout .finishInner{visibility:hidden}.fieldops-expired{display:none}.fieldops-timeout .fieldops-expired{display:grid;position:fixed;z-index:40;inset:0;place-items:center;padding:30px;background:rgba(4,3,9,.94);color:#eefcff;font-family:Inter,system-ui,sans-serif;text-align:center}.fieldops-expired section{max-width:720px;padding:30px;border:1px solid rgba(255,90,108,.58);border-radius:22px;background:rgba(30,7,14,.96)}.fieldops-expired small{color:#ff9aaa;font-weight:1000;letter-spacing:.16em}.fieldops-expired h2{font-size:clamp(34px,6vw,70px);line-height:.94;margin:12px 0}.fieldops-expired p{color:#cbaeb4;line-height:1.65}.fieldops-expired strong{color:#ffd36b}@media(max-width:760px){.seven-route-integrity{bottom:8px;font-size:8px;white-space:nowrap}}
    `}</style>
    <div className={`seven-route-integrity ${phase === "EXPIRED" ? "expired" : ""}`} aria-live="polite">
      <b>14-STEP ROUTE</b><span className="divider">|</span><span className={phase === "7 IN" ? "on" : ""}>7 IN</span><span>→</span><span className={phase === "7 OUT" ? "on" : ""}>7 OUT</span>
      {step > 0 && <><span className="divider">|</span><span>STEP {step}/14</span></>}
      {phase === "COMPLETE" && <><span className="divider">|</span><span className="on">OUTCOME PROVED</span></>}
      {phase === "EXPIRED" && <><span className="divider">|</span><span>NOT CLEARED</span></>}
    </div>
    <div className="fieldops-expired" role="alert"><section><small>TA-14 FIELD OPS // RUN EXPIRED</small><h2>TIME EXPIRED.<br/>OUTCOME NOT PROVED.</h2><p>The 14-step chain was not completed before the mission clock reached zero. <strong>No completed chain. No completion claim.</strong></p></section></div>
  </>;
}
