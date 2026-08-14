"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ARCADE_608_BANK } from "./question-bank";
import type { ArcadeQuestion } from "./exam1-bank";
import ArcadePressureLayer, { stageForQuestion, stageMeta } from "./ArcadePressureLayer";
import PlayerCommandCenter from "./PlayerCommandCenter";
import { getArcadeSupabase } from "../../lib/arcade-supabase";

type WorldKey = "core" | "type1" | "type2" | "type3" | "transition" | "universal";

const WORLDS = [
  { key: "core" as const, title: "CORE ORBIT", sub: "Core • Three Rs • Safety", icon: "🌎", target: 100 },
  { key: "type1" as const, title: "TYPE I MOON", sub: "Small appliances", icon: "🌙", target: 100 },
  { key: "type2" as const, title: "TYPE II GIANT", sub: "High / very-high pressure", icon: "🪐", target: 100 },
  { key: "type3" as const, title: "TYPE III VOID", sub: "Low-pressure appliances", icon: "🌌", target: 100 },
  { key: "transition" as const, title: "A2L FRONTIER", sub: "Modern refrigerant transition", icon: "🔥", target: 100 },
  { key: "universal" as const, title: "UNIVERSE GATE", sub: "All worlds combined", icon: "🏆", target: 500 },
];

function tone(ok: boolean) {
  if (typeof window === "undefined") return;
  const AC = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  const c = new AC(), n = c.currentTime;
  const notes = ok ? [523, 659, 784] : [196, 165, 147];
  notes.forEach((f, i) => {
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.value = f;
    g.gain.setValueAtTime(.0001, n + i * .06);
    g.gain.exponentialRampToValueAtTime(.07, n + i * .06 + .01);
    g.gain.exponentialRampToValueAtTime(.0001, n + i * .06 + .18);
    o.connect(g).connect(c.destination); o.start(n + i * .06); o.stop(n + i * .06 + .2);
  });
  setTimeout(() => void c.close(), 600);
}

export default function RefrigerantOps() {
  const supabase = getArcadeSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [world, setWorld] = useState<WorldKey>("core");
  const [idx, setIdx] = useState(0), [score, setScore] = useState(0), [bestScore, setBestScore] = useState(0), [streak, setStreak] = useState(0), [miss, setMiss] = useState(0), [seconds, setSeconds] = useState(0);
  const [msg, setMsg] = useState("Read the evidence. Choose the most defensible answer.");
  const [flash, setFlash] = useState<"good" | "bad" | null>(null), [studying, setStudying] = useState(false), [sound, setSound] = useState(true), [finished, setFinished] = useState(false);
  const [criticalLock, setCriticalLock] = useState<ArcadeQuestion | null>(null);
  const [criticalEventId, setCriticalEventId] = useState<number | null>(null);
  const [remediation, setRemediation] = useState<ArcadeQuestion | null>(null);
  const [remediationAttempts, setRemediationAttempts] = useState(0);

  const pool = useMemo(() => world === "universal" ? ARCADE_608_BANK : ARCADE_608_BANK.filter(x => x.world === world), [world]);
  const campaignQuestion = (idx % 100) + 1, stage = stageForQuestion(campaignQuestion), run = stageMeta(stage), runQuestion = ((campaignQuestion - 1) % 25) + 1;
  const q = pool[(campaignQuestion - 1) % Math.max(1, pool.length)];
  const currentWorld = WORLDS.find(w => w.key === world)!;
  const studyQuestion = criticalLock ?? q;
  const loaded = (k: WorldKey) => k === "universal" ? ARCADE_608_BANK.length : ARCADE_608_BANK.filter(x => x.world === k).length;

  function pickRemediation(source: ArcadeQuestion, offset = 0, sourcePool = pool) {
    const sameLesson = sourcePool.filter(candidate => candidate.critical && candidate.bucket === source.bucket && candidate.lesson === source.lesson && candidate.id !== source.id);
    const sameBucket = sourcePool.filter(candidate => candidate.critical && candidate.bucket === source.bucket && candidate.id !== source.id);
    const candidates = sameLesson.length ? sameLesson : sameBucket;
    return candidates.length ? candidates[offset % candidates.length] : source;
  }

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    async function restore(player: User | null) {
      if (!alive) return;
      setUser(player);
      if (!player) return;
      const { data } = await supabase.from("arcade_critical_events")
        .select("id,world_key,question_id,bucket,remediation_attempts,status")
        .eq("user_id", player.id).eq("arcade_key", "epa-608").neq("status", "cleared")
        .order("locked_at", { ascending: false }).limit(1).maybeSingle();
      if (!alive || !data) return;
      const source = ARCADE_608_BANK.find(item => item.id === Number(data.question_id));
      if (!source) return;
      const restoredWorld = (data.world_key as WorldKey) || source.world;
      const restoredPool = restoredWorld === "universal" ? ARCADE_608_BANK : ARCADE_608_BANK.filter(item => item.world === restoredWorld);
      setWorld(restoredWorld);
      setCriticalLock(source);
      setCriticalEventId(Number(data.id));
      setRemediationAttempts(Number(data.remediation_attempts || 0));
      setRemediation(pickRemediation(source, Number(data.remediation_attempts || 0), restoredPool));
      setMsg(`PERSISTENT READINESS LOCK RESTORED — ${source.bucket.toUpperCase()} remains NOT CLEARED until remediation is passed.`);
    }
    supabase.auth.getUser().then(({ data }) => restore(data.user));
    const { data: auth } = supabase.auth.onAuthStateChange((_event, session) => void restore(session?.user ?? null));
    return () => { alive = false; auth.subscription.unsubscribe(); };
  }, [supabase]);

  useEffect(() => { if (finished) return; const t = setInterval(() => setSeconds(s => s + 1), 1000); return () => clearInterval(t); }, [finished, world]);
  useEffect(() => { try { setBestScore(Number(localStorage.getItem(`ta14-608-best-${world}`) || 0)); } catch {} }, [world]);
  useEffect(() => { if (score <= bestScore) return; setBestScore(score); try { localStorage.setItem(`ta14-608-best-${world}`, String(score)); } catch {} }, [score, bestScore, world]);

  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const correct = campaignQuestion - 1 - miss;
  const accuracy = campaignQuestion > 1 ? Math.max(0, Math.round(correct / (campaignQuestion - 1) * 100)) : 100;

  function advanceAfterDecision() {
    setTimeout(() => {
      if (campaignQuestion === 100) { setFinished(true); setFlash(null); setMsg(`WORLD COMPLETE • ${Math.max(0, 100 - miss)}/100 correct • ${time}. Accuracy ranks first; faster time breaks ties.`); return; }
      setIdx(x => x + 1); setFlash(null); setMsg("Next decision loaded. Accuracy first. Speed breaks the tie.");
    }, 900);
  }

  async function persistCriticalMiss(source: ArcadeQuestion, nextRemediation: ArcadeQuestion) {
    if (!supabase || !user) return;
    const { data, error } = await supabase.from("arcade_critical_events").insert({
      user_id: user.id, arcade_key: "epa-608", world_key: world, question_id: source.id,
      bucket: source.bucket, lesson: source.lesson, original_why: source.why, status: "remediation",
      remediation_attempts: 0, last_remediation_question_id: nextRemediation.id, updated_at: new Date().toISOString(),
    }).select("id").single();
    if (!error && data) setCriticalEventId(Number(data.id));
  }

  async function updateCriticalEvidence(status: "remediation" | "cleared", attempts: number, remediationQuestionId: number) {
    if (!supabase || !user || criticalEventId === null) return;
    await supabase.from("arcade_critical_events").update({
      status, remediation_attempts: attempts, last_remediation_question_id: remediationQuestionId,
      cleared_at: status === "cleared" ? new Date().toISOString() : null, updated_at: new Date().toISOString(),
    }).eq("id", criticalEventId).eq("user_id", user.id);
  }

  function choose(i: number) {
    if (studying || finished || criticalLock) return;
    const ok = i === q.correct;
    if (ok) {
      const stageBoost = stage === 4 ? 1.6 : stage === 3 ? 1.35 : stage === 2 ? 1.15 : 1, streakBoost = streak >= 4 ? 2 : streak >= 2 ? 1.5 : 1;
      const pts = Math.round((q.critical ? 1200 : 650) * stageBoost * streakBoost);
      setScore(s => s + pts); setStreak(s => s + 1); setMsg(`${q.critical ? "CRITICAL GATE CLEARED" : "RULE LOCKED"} +${pts} XP — ${q.why}`); setFlash("good"); if (sound) tone(true); advanceAfterDecision(); return;
    }
    setMiss(m => m + 1); setStreak(0); setScore(s => Math.max(0, s - (q.critical ? 500 : 150))); setFlash("bad"); if (sound) tone(false);
    if (q.critical) {
      const nextRemediation = pickRemediation(q);
      setCriticalLock(q); setCriticalEventId(null); setRemediationAttempts(0); setRemediation(nextRemediation);
      setMsg(`CRITICAL MISS — ${q.bucket.toUpperCase()} READINESS NOT CLEARED. ${q.why}${user ? " Evidence record created." : " Sign in to persist this readiness record."}`);
      void persistCriticalMiss(q, nextRemediation); return;
    }
    setMsg(`NOT QUITE. ${q.why}`); advanceAfterDecision();
  }

  function answerRemediation(i: number) {
    if (!criticalLock || !remediation || studying || finished) return;
    const ok = i === remediation.correct;
    if (ok) {
      const attempts = remediationAttempts + 1;
      void updateCriticalEvidence("cleared", attempts, remediation.id);
      setScore(s => s + 250); setFlash("good"); setMsg(`REMEDIATION CLEARED — ${criticalLock.bucket.toUpperCase()} READINESS RESTORED. ${remediation.why}`); if (sound) tone(true);
      setCriticalLock(null); setCriticalEventId(null); setRemediation(null); setRemediationAttempts(0); advanceAfterDecision(); return;
    }
    const nextAttempt = remediationAttempts + 1, nextRemediation = pickRemediation(criticalLock, nextAttempt);
    setRemediationAttempts(nextAttempt); setScore(s => Math.max(0, s - 100)); setFlash("bad"); setMsg(`REMEDIATION NOT CLEARED — ${criticalLock.bucket.toUpperCase()} REMAINS LOCKED. Review the rule and retest.`); setRemediation(nextRemediation); if (sound) tone(false);
    void updateCriticalEvidence("remediation", nextAttempt, nextRemediation.id);
  }

  function select(k: WorldKey) {
    if (criticalLock) { setMsg(`WORLD CHANGE BLOCKED — ${criticalLock.bucket.toUpperCase()} has an unresolved critical readiness lock.`); return; }
    setWorld(k); setIdx(0); setScore(0); setStreak(0); setMiss(0); setSeconds(0); setFinished(false); setStudying(false); setMsg("World loaded. Race clock started. Accuracy first; speed breaks ties.");
  }

  return <main className={`ops ${flash || ""}`}><style>{`
 *{box-sizing:border-box}body{margin:0;background:#02030a}.ops{min-height:100vh;color:#eefcff;font-family:Inter,system-ui,sans-serif;background:radial-gradient(circle at 50% 20%,#0a2940 0,#030711 40%,#010208 75%);position:relative}.top{display:flex;justify-content:space-between;align-items:center;padding:18px 24px;border-bottom:1px solid #16384a;background:#020713e8;position:sticky;top:0;z-index:20}.brand b{font-size:9px;letter-spacing:.18em;color:#65eaff}.brand h1{margin:4px 0 0;font-size:24px}.stats{display:flex;gap:8px;align-items:center}.stat{min-width:78px;padding:8px 10px;border:1px solid #17394b;border-radius:10px;background:#06121d;text-align:center}.stat small{display:block;color:#668998;font-size:8px;font-weight:900;letter-spacing:.12em}.stat strong{font-size:17px;color:#e8fbff}.race strong{color:#ffd363}.sound{border:1px solid #24506a;background:#071725;color:white;border-radius:10px;padding:10px;cursor:pointer}.layout{display:grid;grid-template-columns:245px minmax(0,1fr) 270px;gap:14px;padding:14px;align-items:start}.panel{border:1px solid #153748;background:#03101ad9;border-radius:16px;box-shadow:0 15px 50px #0007}.left,.right{padding:12px}.stage{padding:22px;min-height:690px}.title{font-size:9px;color:#65eaff;font-weight:1000;letter-spacing:.14em;margin:3px 4px 10px}.worlds{display:grid;gap:7px}.world{display:flex;gap:10px;align-items:center;width:100%;padding:10px;border:1px solid #17394a;background:#06121c;color:#bdd4df;border-radius:11px;text-align:left;cursor:pointer}.world.active{border-color:#5deaff;background:#092333;box-shadow:0 0 18px #55eaff18}.world span{font-size:23px}.world b,.world small{display:block}.world b{font-size:10px;color:#e9fbff}.world small{font-size:8px;color:#64818e;margin-top:2px}.badge{display:inline-block;margin:0 6px 8px 0;padding:7px 10px;border:1px solid #2b6575;border-radius:999px;color:#66eaff;font-size:9px;font-weight:900;letter-spacing:.1em}.bucket{color:#ffd36b;border-color:#6d5d25}.criticalBadge{color:#ff8c9e;border-color:#8f263a;background:#2b0810}.stage h2{font-size:clamp(22px,2.4vw,36px);line-height:1.12;margin:16px 0}.evidence{padding:13px;border:1px solid #256452;border-radius:13px;background:#06221c99;color:#c9f6e6;font-size:12px}.evidence b{display:block;color:#60efb0;font-size:9px;letter-spacing:.13em;margin-bottom:4px}.answers{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}.answer{min-height:94px;padding:15px;border:1px solid #24495b;border-radius:13px;background:linear-gradient(135deg,#071725,#04101a);color:#d7eaf2;text-align:left;font-size:13px;line-height:1.45;cursor:pointer}.answer:hover{border-color:#64eaff;transform:translateY(-1px)}.answer b{color:#ffd56c;font-size:17px;margin-right:6px}.remediation{border:1px solid #8f263a;background:linear-gradient(145deg,#200811,#09070c);border-radius:14px;padding:16px;margin-top:12px}.remediation h3{margin:6px 0 8px;color:#ff9aaa;font-size:16px}.remediation p{color:#d7a9b0;font-size:12px;line-height:1.5}.lockLine{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px}.lockPill{padding:6px 9px;border-radius:999px;border:1px solid #8f263a;color:#ff9aaa;background:#250910;font-size:8px;font-weight:1000;letter-spacing:.09em}.msg{margin-top:14px;min-height:58px;padding:13px;border-radius:12px;background:#050c14;color:#a7c8d5;font-size:12px;line-height:1.45}.studyBtn{margin-top:12px;border:1px solid #ffd36b;background:#2a2208;color:#ffe59d;padding:10px 12px;border-radius:10px;font-weight:900;cursor:pointer}.sideCard{margin-top:10px;padding:12px;border:1px solid #153748;border-radius:12px;background:#061520;color:#8fabb8;font-size:11px;line-height:1.5}.sideCard b{color:#ffd66d;font-size:9px;letter-spacing:.1em}.lockCard{border-color:#7d2738;background:#1d0810;color:#e8a9b4}.lockCard b{color:#ff8c9e}.runDock{position:fixed;left:16px;bottom:16px;z-index:30;width:220px;padding:10px;border:1px solid #2a596d;border-radius:13px;background:#03101af2;box-shadow:0 12px 35px #000b}.runDockTop{display:flex;justify-content:space-between;align-items:center;font-size:8px;color:#7595a3}.runDockTop strong{color:#6de9ff;letter-spacing:.1em}.stageRail{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:7px}.stageNode{padding:6px 2px;border:1px solid #244858;border-radius:7px;background:#04101a;color:#62808f;font-size:7px;font-weight:1000;text-align:center}.stageNode.on{border-color:#65eaff;color:#e8fcff;background:#082432}.stageNode.done{border-color:#2e6a55;color:#6cf1b6}.raceRule{margin-top:8px;color:#ffd363;font-size:8px}.modal{position:fixed;z-index:50;inset:0;background:#000c;display:grid;place-items:center;padding:20px}.lesson{max-width:760px;padding:25px;border:1px solid #4e9fb6;border-radius:18px;background:#061521}.lesson button{padding:10px;border:1px solid #65eaff;background:#092333;color:white;border-radius:9px}.foot{text-align:center;color:#4f6d7b;font-size:9px;padding:12px 250px 26px}.good .stage{box-shadow:0 0 45px #45ff9a22}.bad .stage{box-shadow:0 0 45px #ff476622}@media(max-width:1050px){.layout{grid-template-columns:210px 1fr}.right{display:none}.stats .stat:nth-child(2),.stats .stat:nth-child(3){display:none}}@media(max-width:760px){.top{align-items:flex-start;gap:10px}.brand h1{font-size:17px}.layout{grid-template-columns:1fr}.left{order:2}.stage{order:1;padding:15px;min-height:auto}.answers{grid-template-columns:1fr}.runDock{left:8px;bottom:8px;width:190px}.foot{padding:80px 15px 20px}.stat{min-width:65px}.stats .stat:nth-child(4){display:none}}
 `}</style><ArcadePressureLayer stage={stage} enabled={!studying && !finished}/>
 {studying&&<div className="modal"><section className="lesson"><small>FIELD GUIDE • RACE CLOCK CONTINUES • {time}</small><h3>{studyQuestion.lesson}</h3><p>{studyQuestion.why}</p><p>The timer never pauses. Learn the governing rule, return to the mission, and make the decision from evidence rather than answer position or length.</p><button onClick={()=>setStudying(false)}>RETURN TO MISSION ▶</button></section></div>}
 <header className="top"><div className="brand"><b>TA-14 ACADEMY // HVACDR TRAINING UNIVERSE</b><h1>EPA 608 REFRIGERANT OPS</h1></div><div className="stats"><div className="stat"><small>SCORE</small><strong>{score.toLocaleString()}</strong></div><div className="stat"><small>BEST</small><strong>{bestScore.toLocaleString()}</strong></div><div className="stat"><small>ACCURACY</small><strong>{accuracy}%</strong></div><div className="stat"><small>QUESTION</small><strong>{campaignQuestion}/100</strong></div><div className="stat race"><small>RACE TIME ↑</small><strong>{time}</strong></div><button className="sound" onClick={()=>setSound(s=>!s)}>{sound?"🔊":"🔇"}</button></div></header>
 <div className="layout"><aside className="panel left"><div className="title">SELECT TRAINING WORLD</div><div className="worlds">{WORLDS.map(w=><button key={w.key} onClick={()=>select(w.key)} className={`world ${world===w.key?"active":""}`}><span>{w.icon}</span><div><b>{w.title}</b><small>{w.sub}</small><small>{loaded(w.key)} / {w.target} loaded</small></div></button>)}</div><div className="sideCard"><b>COMPETITIVE RULE</b><p>Knowledge wins first. A more accurate run always outranks a less accurate run. When accuracy ties, the faster completion time wins.</p></div>{criticalLock&&<div className="sideCard lockCard"><b>CRITICAL MISS WALL</b><p><strong>{criticalLock.bucket}</strong> is NOT CLEARED. Progression and world switching are blocked until remediation is passed.{criticalEventId!==null?" Persistent evidence record active.":user?" Evidence record pending.":" Sign in to persist."}</p></div>}</aside>
 <section className="panel stage"><span className="badge">{currentWorld.title} // {run.name} // {runQuestion} OF 25</span><span className={`badge bucket ${criticalLock?"criticalBadge":""}`}>{criticalLock?`${criticalLock.bucket} • READINESS LOCKED`:`${q.bucket} • LEVEL ${q.level}${q.critical?" • CRITICAL":""}`}</span>
 {criticalLock&&remediation?<><div className="remediation"><div className="lockLine"><span className="lockPill">CRITICAL MISS</span><span className="lockPill">{criticalLock.bucket.toUpperCase()} NOT CLEARED</span><span className="lockPill">RETEST {remediationAttempts+1}</span>{criticalEventId!==null&&<span className="lockPill">EVIDENCE #{criticalEventId}</span>}</div><h3>REMEDIATION LOCK — PROVE THE RULE BEFORE CONTINUING</h3><p><strong>Why the original action was blocked:</strong> {criticalLock.why}</p><p>The race clock continues. The current readiness bucket remains locked until you correctly answer a critical retest from the same governing area.</p></div><button className="studyBtn" onClick={()=>setStudying(true)}>📘 REVIEW GOVERNING RULE — CLOCK KEEPS RUNNING</button><h2>{remediation.prompt}</h2><div className="evidence"><b>REMEDIATION RULE / EVIDENCE BOUNDARY</b>{remediation.lesson}. Clear the concept, not the answer position.</div><div className="answers">{remediation.choices.map((a,i)=><button className="answer" onClick={()=>answerRemediation(i)} key={`remed-${remediation.id}-${i}`}><b>{String.fromCharCode(65+i)}.</b>{a}</button>)}</div></>:<><h2>{q.prompt}</h2><div className="evidence"><b>TESTED RULE / EVIDENCE BOUNDARY</b>{q.lesson}. Read every choice. Answer length is not a clue.</div>{run.help?<button className="studyBtn" onClick={()=>setStudying(true)}>📘 FIELD GUIDE — CLOCK KEEPS RUNNING</button>:<div className="sideCard"><b>⚡ ASSISTANCE OFFLINE</b><br/>{run.name} is proving retention under pressure.</div>}<div className="answers">{q.choices.map((a,i)=><button className="answer" onClick={()=>choose(i)} key={`${q.id}-${i}`}><b>{String.fromCharCode(65+i)}.</b>{a}</button>)}</div></>}<div className="msg">{msg}</div></section>
 <aside className="panel right"><div className="title">PLAYER RUN DATA</div><div className="sideCard"><b>RACE CLOCK</b><p style={{fontSize:30,color:"#ffd363",margin:"4px 0"}}>{time}</p><span>Counts upward. Faster time wins only when accuracy is tied.</span></div><div className="sideCard"><b>LIVE PERFORMANCE</b><p>Correct: {Math.max(0,campaignQuestion-1-miss)}<br/>Misses: {miss}<br/>Accuracy: {accuracy}%<br/>Streak: {streak}x<br/>Score: {score.toLocaleString()}</p></div>{criticalLock&&<div className="sideCard lockCard"><b>READINESS LOCK</b><p>{criticalLock.bucket}: <strong>NOT CLEARED</strong><br/>Remediation attempts: {remediationAttempts+1}<br/>Next question: BLOCKED<br/>Persistence: {criticalEventId!==null?"RECORDED":user?"PENDING":"LOCAL ONLY"}</p></div>}<div className="sideCard"><b>LEADERBOARD ORDER</b><p>1. Accuracy<br/>2. Completion time<br/>3. XP / score<br/>4. Best streak</p></div><div className="sideCard"><b>QUESTION BANK</b><p>{loaded(world)} questions currently loaded for this world.</p></div></aside></div>
 <PlayerCommandCenter />
 <div className="runDock"><div className="runDockTop"><strong>{criticalLock?"READINESS LOCKED":"RUN STATUS"}</strong><span>{criticalLock?criticalLock.bucket:`${run.name} • Q${runQuestion}/25`}</span></div><div className="stageRail">{([1,2,3,4] as const).map(s=><div key={s} className={`stageNode ${s===stage?"on":s<stage?"done":""}`}>RUN {s}<br/>{s*25}</div>)}</div><div className="raceRule">{criticalLock?"CRITICAL MISS • CLEAR REMEDIATION TO PROCEED":"ACCURACY FIRST • SPEED BREAKS TIES"}</div></div>
 <footer className="foot">TA-14 Academy HVACDR readiness training • Not EPA certification • Competitive timing rewards correct knowledge before speed • TA14Exchange.com</footer></main>;
}
