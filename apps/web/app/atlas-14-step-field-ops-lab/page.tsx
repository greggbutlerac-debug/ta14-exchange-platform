"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Step = {
  id: number;
  zone: "INSIDE" | "OUTSIDE";
  title: string;
  mission: string;
  evidence: string;
  choices: string[];
  correct: number;
  points: number;
};

const STEPS: Step[] = [
  { id: 1, zone: "INSIDE", title: "Approach & Opening", mission: "Before touching the system, establish the initial condition and preserve what is observable.", evidence: "The equipment is calling for cooling. Indoor temperature is 78°F. No cabinet has been opened.", choices: ["Open the refrigerant circuit", "Capture the initial operating condition", "Replace the thermostat"], correct: 1, points: 500 },
  { id: 2, zone: "INSIDE", title: "Filter & Return Air", mission: "Inspect the return-air path before interpreting refrigeration behavior.", evidence: "Filter is heavily loaded and return grille is partially obstructed.", choices: ["Record the restriction and continue airflow evidence", "Add refrigerant", "Condemn the compressor"], correct: 0, points: 650 },
  { id: 3, zone: "INSIDE", title: "Blower & Airflow Integrity", mission: "Establish whether airflow is sufficient before refrigerant-side conclusions.", evidence: "Total external static pressure is elevated and delivered airflow is below target.", choices: ["Refrigerant charge is low", "Airflow condition must be resolved or bounded first", "Metering device has failed"], correct: 1, points: 900 },
  { id: 4, zone: "INSIDE", title: "Electrical Supply", mission: "Verify electrical conditions rather than assuming power quality.", evidence: "Supply voltage is stable under load and connections show no visible heat damage.", choices: ["Preserve the electrical baseline", "Replace the disconnect", "Skip electrical evidence"], correct: 0, points: 650 },
  { id: 5, zone: "INSIDE", title: "Controls & Call", mission: "Confirm that the control sequence matches the requested operating state.", evidence: "Thermostat call is present and the indoor control path is responding.", choices: ["Record the verified control state", "Bypass the safeties", "Change the thermostat immediately"], correct: 0, points: 650 },
  { id: 6, zone: "INSIDE", title: "Evaporator Condition", mission: "Observe coil condition in context with the airflow evidence already established.", evidence: "Evaporator is uniformly cool; no isolated frost pattern is present. Airflow remains the dominant abnormal condition.", choices: ["Declare a refrigerant leak", "Preserve coil observations without overclaiming", "Add two pounds of refrigerant"], correct: 1, points: 850 },
  { id: 7, zone: "INSIDE", title: "Indoor Evidence Gate", mission: "Decide whether the inside sequence supports moving outside without inventing a diagnosis.", evidence: "Return restriction and low airflow are supported. Electrical and control conditions are bounded. Refrigerant defect is not established.", choices: ["Proceed with the bounded indoor record", "Declare compressor failure", "Erase the airflow finding"], correct: 0, points: 1000 },
  { id: 8, zone: "OUTSIDE", title: "Outdoor Approach", mission: "Preserve outdoor operating reality before intervention.", evidence: "Condenser is running. Ambient is 94°F. Coil surface is visibly impacted with debris.", choices: ["Record ambient and condenser condition", "Wash the coil before recording it", "Recover the refrigerant"], correct: 0, points: 650 },
  { id: 9, zone: "OUTSIDE", title: "Condenser Airflow", mission: "Determine whether heat rejection is being constrained.", evidence: "Fan rotation is correct, but discharge airflow is weak across the impacted coil surface.", choices: ["Evidence supports a condenser airflow restriction", "Evidence proves low refrigerant", "Replace the compressor"], correct: 0, points: 900 },
  { id: 10, zone: "OUTSIDE", title: "Outdoor Electrical", mission: "Verify motor and compressor electrical behavior under the observed load.", evidence: "Voltage is stable. Compressor current is elevated but remains within nameplate limits under the present heat-rejection condition.", choices: ["Record load behavior in context", "Current alone proves compressor failure", "Ignore the electrical reading"], correct: 0, points: 800 },
  { id: 11, zone: "OUTSIDE", title: "Temperature Evidence", mission: "Compare temperatures without allowing one number to become the diagnosis.", evidence: "Condenser split is elevated. Indoor airflow evidence and outdoor coil restriction are both preserved.", choices: ["Use the temperature evidence with the existing record", "Temperature alone authorizes charging", "Delete the indoor evidence"], correct: 0, points: 850 },
  { id: 12, zone: "OUTSIDE", title: "Determination Threshold", mission: "Choose the narrowest determination actually supported by the accumulated evidence.", evidence: "Low indoor airflow and restricted condenser heat rejection are established. No evidence yet establishes incorrect refrigerant mass.", choices: ["System needs refrigerant", "Airflow/heat-rejection defects are supported; refrigerant intervention is not yet authorized", "Replace every major component"], correct: 1, points: 1400 },
  { id: 13, zone: "OUTSIDE", title: "Refrigerant Decision", mission: "Decide whether refrigerant-side intervention is admissible at this point.", evidence: "Known airflow defects have not yet been corrected and post-correction operating conditions do not exist.", choices: ["Add refrigerant now", "Refuse refrigerant intervention until governing conditions are corrected and retested", "Vent refrigerant to compare pressures"], correct: 1, points: 1800 },
  { id: 14, zone: "OUTSIDE", title: "Post-Intervention Proof", mission: "After correcting the supported airflow restrictions, prove what changed against the baseline.", evidence: "Filter and condenser restrictions are corrected. Airflow rises, static pressure falls, temperatures normalize, and compressor current improves.", choices: ["Create the post-intervention performance record and compare it to baseline", "Call it fixed without recording anything", "Change refrigerant charge anyway"], correct: 0, points: 2500 },
];

const ARCADE = [
  ["AIRFLOW_KING", 24850],
  ["METER_MIKE", 24610],
  ["STATICNINJA", 24300],
  ["HEATPUMP77", 23940],
  ["COILHUNTER", 23775],
] as const;

function tone(kind: "good" | "miss" | "start" | "finish") {
  if (typeof window === "undefined") return;
  const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const now = ctx.currentTime;
  const notes = kind === "good" ? [440, 660, 880] : kind === "miss" ? [220, 185, 155] : kind === "finish" ? [392, 523, 659, 784] : [262, 392, 523];
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = kind === "miss" ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, now + index * 0.08);
    gain.gain.setValueAtTime(0.0001, now + index * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.11, now + index * 0.08 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.18);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + index * 0.08);
    osc.stop(now + index * 0.08 + 0.2);
  });
  window.setTimeout(() => void ctx.close(), 800);
}

export default function AtlasFieldOpsLab() {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [misses, setMisses] = useState(0);
  const [seconds, setSeconds] = useState(20 * 60);
  const [message, setMessage] = useState("Establish the truth before you touch the system.");
  const [burst, setBurst] = useState(0);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const tick = useRef<number | null>(null);

  const step = STEPS[stepIndex];
  const progress = finished ? 100 : (stepIndex / STEPS.length) * 100;
  const accuracy = stepIndex + misses === 0 ? 100 : Math.round((stepIndex / (stepIndex + misses)) * 100);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem("ta14-field-ops-best") || 0);
    setBest(stored);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    tick.current = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          if (tick.current) window.clearInterval(tick.current);
          setFinished(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => {
      if (tick.current) window.clearInterval(tick.current);
    };
  }, [started, finished]);

  const time = useMemo(() => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`, [seconds]);

  function begin() {
    setStarted(true);
    setStepIndex(0);
    setScore(0);
    setStreak(0);
    setMisses(0);
    setSeconds(20 * 60);
    setFinished(false);
    setMessage("Mission live. Build the evidence chain.");
    if (soundOn) tone("start");
  }

  function choose(index: number) {
    if (finished) return;
    if (index !== step.correct) {
      setScore((s) => Math.max(0, s - 125));
      setStreak(0);
      setMisses((m) => m + 1);
      setMessage("Not established yet. No big deal — keep investigating.");
      setBurst((b) => b + 1);
      if (soundOn) tone("miss");
      return;
    }

    const multiplier = streak >= 4 ? 2 : streak >= 2 ? 1.5 : 1;
    const earned = Math.round(step.points * multiplier);
    const nextScore = score + earned;
    setScore(nextScore);
    setStreak((s) => s + 1);
    setMessage(step.id === 13 ? `ADMISSIBLE REFUSAL +${earned} XP` : `EVIDENCE LOCKED +${earned} XP`);
    setBurst((b) => b + 1);
    if (soundOn) tone("good");

    if (stepIndex === STEPS.length - 1) {
      const timeBonus = seconds * 2;
      const finalScore = nextScore + timeBonus;
      setScore(finalScore);
      setFinished(true);
      setMessage(`OUTCOME VERIFIED • TIME BONUS +${timeBonus}`);
      if (finalScore > best) {
        setBest(finalScore);
        window.localStorage.setItem("ta14-field-ops-best", String(finalScore));
      }
      if (soundOn) window.setTimeout(() => tone("finish"), 260);
      return;
    }

    window.setTimeout(() => setStepIndex((s) => s + 1), 420);
  }

  return (
    <main className="fieldOps">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #01050a; }
        button { font: inherit; }
        .fieldOps { min-height:100vh; overflow:hidden; color:#eafaff; font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; background:radial-gradient(circle at 50% -10%,rgba(40,220,255,.18),transparent 32%),radial-gradient(circle at 90% 80%,rgba(58,255,160,.10),transparent 30%),#01050a; position:relative; }
        .stars,.stars:before,.stars:after { content:""; position:fixed; inset:0; pointer-events:none; background-image:radial-gradient(circle,rgba(255,255,255,.8) 0 1px,transparent 1.4px); background-size:137px 137px; opacity:.22; animation:drift 22s linear infinite; }
        .stars:before { background-size:211px 211px; opacity:.24; transform:translateX(55px); animation-duration:31s; }
        .stars:after { background-size:293px 293px; opacity:.17; transform:translateX(110px); animation-duration:43s; }
        @keyframes drift { to { transform:translate3d(-120px,80px,0); } }
        .scan { position:fixed; inset:0; pointer-events:none; opacity:.06; background:repeating-linear-gradient(0deg,transparent 0 3px,#fff 4px); }
        .topbar { position:relative; z-index:5; display:flex; justify-content:space-between; align-items:center; gap:16px; padding:16px 22px; border-bottom:1px solid rgba(103,232,255,.18); background:rgba(2,10,17,.82); backdrop-filter:blur(18px); }
        .brand { display:flex; gap:12px; align-items:center; }
        .mark { width:44px; height:44px; display:grid; place-items:center; border:1px solid rgba(81,235,255,.45); border-radius:12px; font-weight:1000; color:#65edff; box-shadow:0 0 30px rgba(72,225,255,.16); }
        .eyebrow { color:#62eaff; font-size:11px; font-weight:900; letter-spacing:.18em; text-transform:uppercase; }
        .brand h1 { margin:2px 0 0; font-size:18px; letter-spacing:.04em; }
        .private { color:#ffd36b; border:1px solid rgba(255,211,107,.35); background:rgba(255,211,107,.06); padding:8px 11px; border-radius:999px; font-size:11px; font-weight:900; letter-spacing:.08em; }
        .sound { cursor:pointer; color:#dffaff; background:#07131d; border:1px solid rgba(118,220,245,.25); padding:9px 12px; border-radius:10px; }
        .shell { position:relative; z-index:2; width:min(1500px,100%); margin:0 auto; padding:22px; display:grid; grid-template-columns:260px minmax(0,1fr) 300px; gap:18px; }
        .panel { border:1px solid rgba(102,211,239,.17); background:linear-gradient(180deg,rgba(7,20,31,.92),rgba(3,11,18,.94)); border-radius:18px; box-shadow:0 20px 80px rgba(0,0,0,.28); overflow:hidden; }
        .panelTitle { padding:14px 16px; border-bottom:1px solid rgba(102,211,239,.13); color:#83efff; font-size:11px; font-weight:1000; letter-spacing:.16em; text-transform:uppercase; }
        .hud { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:14px; }
        .hudCard { padding:13px; border:1px solid rgba(102,211,239,.15); border-radius:14px; background:rgba(5,17,27,.75); }
        .hudCard span { display:block; color:#7792a4; font-size:10px; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .hudCard strong { display:block; margin-top:4px; font-size:24px; font-variant-numeric:tabular-nums; }
        .score strong { color:#65f0b3; }
        .timer strong { color:#ffd36b; }
        .steps { padding:10px; display:grid; gap:6px; }
        .stepRow { display:grid; grid-template-columns:32px 1fr; gap:9px; align-items:center; padding:8px; border-radius:10px; color:#6e8797; font-size:11px; border:1px solid transparent; }
        .stepRow.active { color:#eaffff; background:rgba(64,223,255,.08); border-color:rgba(64,223,255,.24); }
        .stepRow.done { color:#67eeb0; }
        .stepNo { width:30px; height:30px; border-radius:9px; display:grid; place-items:center; background:#07131d; font-weight:1000; }
        .stepRow.active .stepNo { box-shadow:0 0 24px rgba(64,223,255,.22); color:#67edff; }
        .mainStage { min-width:0; }
        .progressTrack { height:6px; background:#07131d; border-radius:999px; overflow:hidden; margin-bottom:14px; }
        .progressFill { height:100%; background:linear-gradient(90deg,#43dfff,#55f1a8); box-shadow:0 0 18px rgba(67,223,255,.4); transition:width .4s ease; }
        .mission { min-height:610px; position:relative; padding:28px; display:flex; flex-direction:column; }
        .zone { display:inline-flex; align-self:flex-start; gap:8px; align-items:center; padding:8px 11px; border-radius:999px; background:rgba(70,224,255,.08); border:1px solid rgba(70,224,255,.24); color:#7feeff; font-size:11px; font-weight:1000; letter-spacing:.12em; }
        .mission h2 { font-size:clamp(30px,4vw,56px); line-height:.98; margin:20px 0 10px; letter-spacing:-.04em; }
        .missionText { color:#9bb2c0; font-size:16px; line-height:1.65; max-width:760px; }
        .evidenceBox { margin:22px 0; padding:18px; border-radius:15px; border:1px solid rgba(92,239,180,.22); background:rgba(53,231,162,.055); }
        .evidenceBox b { color:#65efb0; font-size:11px; letter-spacing:.13em; text-transform:uppercase; }
        .evidenceBox p { margin:8px 0 0; line-height:1.6; color:#d8f5eb; }
        .choices { display:grid; gap:10px; margin-top:auto; }
        .choice { cursor:pointer; text-align:left; padding:15px 17px; border-radius:13px; border:1px solid rgba(118,207,232,.18); background:linear-gradient(180deg,#091925,#06121b); color:#dff8ff; transition:.18s ease; }
        .choice:hover { transform:translateY(-2px); border-color:rgba(78,229,255,.55); box-shadow:0 10px 35px rgba(31,211,255,.09); }
        .message { margin-top:14px; min-height:46px; display:flex; align-items:center; justify-content:center; text-align:center; color:#a9c6d4; font-size:13px; font-weight:800; letter-spacing:.03em; }
        .leader { padding:12px; }
        .leaderRow { display:grid; grid-template-columns:30px 1fr auto; gap:8px; padding:10px 8px; border-bottom:1px solid rgba(100,207,236,.08); align-items:center; }
        .leaderRow strong { color:#f3fbff; font-size:12px; }
        .leaderRow span { color:#6f8b9c; font-size:11px; }
        .leaderRow em { color:#67eeb0; font-style:normal; font-weight:900; font-size:12px; }
        .you { margin:12px; padding:14px; border-radius:13px; border:1px solid rgba(255,211,107,.25); background:rgba(255,211,107,.05); }
        .you small { color:#ffd36b; font-weight:1000; letter-spacing:.12em; }
        .you strong { display:block; margin-top:6px; font-size:25px; }
        .rule { margin:12px; padding:14px; border-radius:13px; background:#06131d; color:#89a5b5; font-size:12px; line-height:1.55; }
        .rule b { color:#dffaff; }
        .startScreen,.finishScreen { min-height:610px; padding:40px; display:grid; place-items:center; text-align:center; }
        .startInner,.finishInner { max-width:720px; }
        .startInner h2,.finishInner h2 { font-size:clamp(38px,6vw,76px); line-height:.92; margin:14px 0; letter-spacing:-.055em; }
        .startInner p,.finishInner p { color:#9cb4c2; line-height:1.7; }
        .startBtn { cursor:pointer; margin-top:20px; padding:17px 26px; border:0; border-radius:14px; background:linear-gradient(90deg,#49e5ff,#5bf0ad); color:#001015; font-weight:1000; letter-spacing:.08em; box-shadow:0 0 45px rgba(73,229,255,.18); }
        .bigScore { font-size:64px; font-weight:1000; color:#62efb0; margin:12px 0; }
        .burst { position:fixed; inset:0; z-index:20; pointer-events:none; }
        .spark { position:absolute; left:50%; top:50%; width:7px; height:7px; border-radius:50%; background:#6feeff; animation:explode .75s ease-out forwards; box-shadow:0 0 14px currentColor; }
        .spark:nth-child(2n) { background:#65efb0; }
        .spark:nth-child(3n) { background:#ffd36b; }
        @keyframes explode { from { transform:translate(-50%,-50%) scale(.2); opacity:1; } to { transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) scale(1.6); opacity:0; } }
        .foot { position:relative; z-index:2; text-align:center; color:#486170; font-size:10px; letter-spacing:.12em; padding:8px 20px 24px; text-transform:uppercase; }
        @media (max-width:1100px) { .shell { grid-template-columns:220px minmax(0,1fr); } .right { display:none; } }
        @media (max-width:760px) { .shell { grid-template-columns:1fr; padding:12px; } .left { display:none; } .hud { grid-template-columns:repeat(2,1fr); } .mission { min-height:670px; padding:20px; } .topbar { padding:12px; } .private { display:none; } }
      `}</style>

      <div className="stars" />
      <div className="scan" />
      {burst > 0 && (
        <div className="burst" key={burst}>
          {Array.from({ length: 34 }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / 34;
            const distance = 90 + ((i * 37) % 220);
            const style = { "--x": `${Math.cos(angle) * distance}px`, "--y": `${Math.sin(angle) * distance}px` } as React.CSSProperties;
            return <i className="spark" style={style} key={i} />;
          })}
        </div>
      )}

      <header className="topbar">
        <div className="brand">
          <div className="mark">14</div>
          <div><div className="eyebrow">TA-14 Academy • Atlas Lab</div><h1>FIELD OPS // 14-STEP CHALLENGE</h1></div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}><span className="private">PRIVATE PRE-RELEASE</span><button className="sound" onClick={() => setSoundOn((v) => !v)}>{soundOn ? "🔊 SOUND ON" : "🔇 SOUND OFF"}</button></div>
      </header>

      <section className="shell">
        <aside className="panel left">
          <div className="panelTitle">Mission Route</div>
          <div className="steps">
            {STEPS.map((item, index) => <div key={item.id} className={`stepRow ${index === stepIndex && started && !finished ? "active" : ""} ${index < stepIndex || finished ? "done" : ""}`}><span className="stepNo">{String(item.id).padStart(2,"0")}</span><span>{item.title}</span></div>)}
          </div>
        </aside>

        <section className="mainStage">
          <div className="hud">
            <div className="hudCard score"><span>Score</span><strong>{score.toLocaleString()}</strong></div>
            <div className="hudCard timer"><span>Time</span><strong>{time}</strong></div>
            <div className="hudCard"><span>Evidence Streak</span><strong>{streak}x</strong></div>
            <div className="hudCard"><span>Accuracy</span><strong>{accuracy}%</strong></div>
          </div>
          <div className="progressTrack"><div className="progressFill" style={{width:`${progress}%`}} /></div>
          <div className="panel">
            {!started ? (
              <div className="startScreen"><div className="startInner"><div className="eyebrow">SERVICE CALL 001 // NO COOLING</div><h2>ESTABLISH THE TRUTH.</h2><p>You have 20 minutes. Follow the TA-14 14-Step field sequence, build the evidence chain, resist premature intervention, and prove the outcome against the baseline. Speed matters — but admissible evidence matters more.</p><button className="startBtn" onClick={begin}>⚡ START MISSION</button></div></div>
            ) : finished ? (
              <div className="finishScreen"><div className="finishInner"><div className="eyebrow">MISSION COMPLETE</div><h2>YOU DIDN&apos;T JUST FIX IT.<br/>YOU PROVED WHAT CHANGED.</h2><div className="bigScore">{score.toLocaleString()}</div><p>Baseline preserved. Evidence chain built. Unsupported refrigerant intervention refused. Post-intervention performance compared against the original record.</p>{score >= best && score > 0 ? <div className="private" style={{display:"inline-block",marginTop:12}}>🏆 NEW PERSONAL RECORD</div> : null}<br/><button className="startBtn" onClick={begin}>↻ RUN IT AGAIN</button></div></div>
            ) : (
              <div className="mission">
                <span className="zone">{step.zone === "INSIDE" ? "🏠" : "❄️"} {step.zone} SEQUENCE • STEP {step.id} OF 14</span>
                <h2>{step.title}</h2>
                <p className="missionText">{step.mission}</p>
                <div className="evidenceBox"><b>Observed Evidence</b><p>{step.evidence}</p></div>
                <div className="choices">{step.choices.map((choice,index) => <button className="choice" key={choice} onClick={() => choose(index)}><b>{String.fromCharCode(65+index)}.</b> {choice}</button>)}</div>
                <div className="message">{message}</div>
              </div>
            )}
          </div>
        </section>

        <aside className="panel right">
          <div className="panelTitle">Global Arcade Board • Prototype</div>
          <div className="leader">{ARCADE.map(([name,value],i) => <div className="leaderRow" key={name}><span>#{i+1}</span><strong>{name}</strong><em>{value.toLocaleString()}</em></div>)}</div>
          <div className="you"><small>YOUR PERSONAL BEST</small><strong>{best.toLocaleString()}</strong><span style={{color:"#718c9c",fontSize:11}}>Local prototype record</span></div>
          <div className="rule"><b>Scoring doctrine</b><br/>Evidence quality + sequence discipline + diagnostic accuracy + intervention discipline + outcome verification + efficiency. Fastest does not automatically mean best.</div>
          <div className="rule"><b>Prestige challenge</b><br/>Complete the mission without an unsupported intervention attempt to earn the future “No admissible evidence. No admissible execution.” achievement.</div>
        </aside>
      </section>
      <footer className="foot">Direct-access prototype • Not linked from public Academy navigation • Scores are not credentials or certification</footer>
    </main>
  );
}
