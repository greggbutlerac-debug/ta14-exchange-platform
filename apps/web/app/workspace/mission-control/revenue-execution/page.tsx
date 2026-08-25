"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const START = new Date("2026-08-25T00:00:00-04:00");

const phases = [
  { range: "Days 1-10", title: "Make the money path real", items: ["Exclude internal/admin traffic from commercial analytics", "Connect real intake and persist every qualified lead", "Connect checkout and authoritative payment confirmation", "Connect conversion attribution and delivery", "Complete one end-to-end test purchase"] },
  { range: "Days 11-20", title: "Create useful free demand capture", items: ["Launch free EU AI Act / governance diagnostic", "Generate a portable TA-14 readiness record", "Give a useful result without requiring a sales call", "Instrument diagnostic start and completion", "Invite qualified outside prospects personally"] },
  { range: "Days 21-30", title: "Activate real trials", items: ["Launch 60-day trial onboarding", "No credit card and no contract", "Scope one real system or governed route", "Complete evidence inventory and authority boundary", "Complete first outside bounded governed route"] },
  { range: "Days 31-45", title: "Turn acquisition into a sales function", items: ["Rewrite highest-intent pages in buyer language", "One commercial CTA per intent", "Begin direct founding sales sprint", "Track source, reply, diagnostic, trial, objection, loss reason", "Repair the largest conversion leak every Friday"] },
  { range: "Days 46-60", title: "Earn the first retained revenue", items: ["Personally onboard founding customers", "Complete ALLOW / HOLD / DENY / ESCALATE paths", "Run changed-condition tests where meaningful", "Document and automate repeated friction", "Convert at least one customer to recurring paid service"] },
  { range: "Days 61-90", title: "Compound the system", items: ["Expand practitioner and consultant channel", "Target AI vendors and integrators", "Build referral motion", "Measure MRR, retention, cost-to-serve and expansion", "Scale only channels that produce qualified action"] },
];

const daily = [
  "Check Revenue Mission Control before building anything new",
  "Review outside qualified visitors and buyer-intent activity",
  "Work the highest-value qualified prospect list",
  "Complete personalized outreach / diagnostics / onboarding",
  "Move every active prospect to one clear next action",
  "Record every loss reason, objection and conversion reason",
  "Fix the single biggest funnel leak before adding volume",
];

const scorecard = [
  ["Qualified outside visitors", "Are relevant prospects reaching TA-14?"],
  ["Free assessment starts / completions", "Does the problem framing create action?"],
  ["60-day trial starts", "Does free value convert to product interest?"],
  ["First governed execution", "Did the customer experience the architecture?"],
  ["Checkout starts / completed payments", "Where is purchase friction?"],
  ["Paid subscriptions", "Did activated users choose continued value?"],
  ["MRR / ARR", "Is the institution becoming self-sustaining?"],
  ["30 / 60 / 90-day retention", "Does continuing value survive novelty?"],
  ["Cost to serve / gross margin", "Can this scale without founder subsidy?"],
];

function dayNumber() {
  const now = new Date();
  const diff = Math.floor((now.getTime() - START.getTime()) / 86400000) + 1;
  return Math.max(1, Math.min(90, diff));
}

export default function RevenueExecutionPage() {
  const day = useMemo(dayNumber, []);
  const currentPhase = day <= 10 ? 0 : day <= 20 ? 1 : day <= 30 ? 2 : day <= 45 ? 3 : day <= 60 ? 4 : 5;
  const [done, setDone] = useState<Record<string, boolean>>({});
  const storageKey = `ta14-revenue-execution-${new Date().toISOString().slice(0,10)}`;

  useEffect(() => {
    try { setDone(JSON.parse(localStorage.getItem(storageKey) || "{}")); } catch {}
  }, [storageKey]);

  function toggle(key: string) {
    const next = { ...done, [key]: !done[key] };
    setDone(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
  }

  const dailyCompleted = daily.filter((_, i) => done[`daily-${i}`]).length;

  return <main className="shell">
    <div className="grid" />
    <header className="topbar">
      <div className="brand"><span>TA</span><b>14</b><div><small>TA-14 AUTHORITY GOVERNANCE INSTITUTION</small><strong>Revenue Execution Command Center</strong></div></div>
      <nav><Link href="/workspace/mission-control">Mission Control</Link><Link href="/workspace/mission-control/seo-intelligence">SEO Intelligence</Link><Link href="/start">Commercial Front Door</Link></nav>
    </header>

    <section className="hero">
      <div>
        <p className="eyebrow">FOUNDING REVENUE OPERATING SYSTEM · V2.1</p>
        <h1>MAKE THE INSTITUTION<br/><em>MAKE MONEY.</em></h1>
        <p className="lead">This is the daily operating surface for the frozen TA-14 Recurring Revenue & Accessibility Engine. Nothing receives priority unless it materially improves discovery, comprehension, trust, purchase, delivery, activation, retention, expansion, or evidence integrity.</p>
      </div>
      <aside className="daycard"><small>90-DAY EXECUTION WINDOW</small><strong>DAY {day}</strong><span>{phases[currentPhase].range}</span><p>{phases[currentPhase].title}</p><div className="progress"><i style={{width:`${Math.round(day/90*100)}%`}}/></div><b>{Math.round(day/90*100)}% of execution window elapsed</b></aside>
    </section>

    <section className="truthbar"><div><small>PRIMARY COMMERCIAL OBJECTIVE</small><strong>Outside prospect → free diagnostic → activated trial → first governed execution → evidence record → paid subscription → retained MRR → expansion</strong></div><div><small>GOVERNING RULE</small><strong>Revenue evidence before revenue stories.</strong></div></section>

    <section className="today">
      <div className="sectionhead"><div><p className="eyebrow">TODAY</p><h2>Founder Revenue Work</h2></div><div className="count">{dailyCompleted}/{daily.length} COMPLETE</div></div>
      <div className="tasks">{daily.map((x,i)=><button key={x} onClick={()=>toggle(`daily-${i}`)} className={done[`daily-${i}`]?"task done":"task"}><span>{done[`daily-${i}`]?"✓":String(i+1).padStart(2,"0")}</span><b>{x}</b></button>)}</div>
    </section>

    <section className="weekly">
      <div className="sectionhead"><div><p className="eyebrow">WEEKLY FOUNDER SALES CADENCE</p><h2>Do not wait for SEO to rescue the pipeline.</h2></div></div>
      <div className="weekgrid">
        <article><small>MONDAY</small><h3>Build the qualified list.</h3><p>Target urgent compliance, audit, evidence, or execution-control problems. Record prospect, role, source, problem and reason for fit.</p></article>
        <article><small>TUESDAY - THURSDAY</small><h3>Work the market personally.</h3><p>Personalized outreach, free diagnostics, onboarding, follow-up and implementation help. Record replies, friction and objections.</p></article>
        <article><small>FRIDAY</small><h3>Repair the biggest leak.</h3><p>Review stage conversion, losses, support hours and next experiment. Fix the bottleneck before adding another campaign.</p></article>
        <article className="floor"><small>FOUNDING WEEKLY FLOOR</small><h3>50 qualified personalized attempts</h3><p>Operating hypothesis: target 10 meaningful replies, 5 completed diagnostics and 3 activated trials. Work intensity is unlimited. Manipulation is not.</p></article>
      </div>
    </section>

    <section className="phasewrap">
      <div className="sectionhead"><div><p className="eyebrow">90-DAY EXECUTION MAP</p><h2>Current phase: {phases[currentPhase].title}</h2></div></div>
      <div className="phases">{phases.map((p,idx)=><article key={p.range} className={idx===currentPhase?"phase current":"phase"}><div className="phasehead"><small>{p.range}</small><span>{idx<currentPhase?"PASSED":idx===currentPhase?"CURRENT":"UPCOMING"}</span></div><h3>{p.title}</h3><ul>{p.items.map(x=><li key={x}>{x}</li>)}</ul></article>)}</div>
    </section>

    <section className="score">
      <div className="sectionhead"><div><p className="eyebrow">REVENUE MISSION CONTROL</p><h2>The scoreboard that matters.</h2></div><Link href="/workspace/mission-control/seo-intelligence">OPEN LIVE SEO INTELLIGENCE →</Link></div>
      <div className="scoregrid">{scorecard.map(([metric,why])=><article key={metric}><strong>{metric}</strong><p>{why}</p></article>)}</div>
    </section>

    <section className="gates">
      <div><p className="eyebrow">DECISION GATES</p><h2>Do not change economics from frustration.</h2></div>
      <div className="gategrid"><article><b>DO NOT CUT PRICE</b><p>Until at least 20 qualified activated trials reach a real governed execution.</p></article><article><b>REPAIR ACTIVATION</b><p>If 10 trial starts produce fewer than 3 first governed executions, stop scaling acquisition and fix onboarding.</p></article><article><b>REPAIR CHANNEL</b><p>If 100 qualified landing visits or 20 qualified direct conversations produce zero assessment starts, rewrite/retarget once, then stop or reposition after a second failed bounded test.</p></article><article><b>PROTECT RETENTION</b><p>If customers pay and then leave, interview and repair recurring value before scaling.</p></article></div>
    </section>

    <section className="links"><Link href="/start">COMMERCIAL FRONT DOOR →</Link><Link href="/eu-ai-act">EU AI ACT WORLD →</Link><Link href="/workspace/ai-governance">AI GOVERNANCE →</Link><Link href="/workspace/mission-control/seo-intelligence">SEO INTELLIGENCE →</Link><Link href="/pricing">PRICING →</Link><Link href="/review">REVIEW INTAKE →</Link></section>

    <footer><strong>TA-14 Authority Governance Institution</strong><span>Complete governance. Economically accessible. Evidence before consequence.</span></footer>

    <style jsx>{`
      .shell{--bg:#03080e;--panel:#07121d;--line:#17354a;--cyan:#64dcff;--gold:#f0c765;--green:#66e0a8;position:relative;min-height:100vh;background:radial-gradient(circle at 45% -10%,#123f63 0,#06111c 28%,#02060b 60%,#010306 100%);color:#edf8ff;font-family:Inter,system-ui,sans-serif;padding-bottom:60px}.shell *{box-sizing:border-box}.shell a{color:inherit;text-decoration:none}.grid{position:fixed;inset:0;pointer-events:none;opacity:.15;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:44px 44px}.topbar,.hero,.truthbar,.today,.weekly,.phasewrap,.score,.gates,.links,footer{position:relative;z-index:2}.topbar{min-height:76px;padding:12px 4vw;display:flex;justify-content:space-between;align-items:center;gap:20px;border-bottom:1px solid var(--line);background:rgba(2,7,12,.9);backdrop-filter:blur(18px);position:sticky;top:0;z-index:20}.brand{display:flex;align-items:center;gap:6px}.brand>span,.brand>b{display:grid;place-items:center;width:34px;height:40px;border:1px solid #275573;background:#0a1b29}.brand>span{color:#7ee8ff;font-size:10px;font-weight:900}.brand>b{font-size:18px}.brand div{margin-left:8px}.brand small,.brand strong{display:block}.brand small{color:#658198;font-size:8px;letter-spacing:.14em}.brand strong{font-size:13px;margin-top:3px}.topbar nav{display:flex;gap:8px;flex-wrap:wrap}.topbar nav a{padding:9px 11px;border:1px solid #1b3d55;border-radius:8px;color:#9fdff0;font-size:9px;font-weight:900;letter-spacing:.07em}.hero{max-width:1480px;margin:auto;padding:80px 4vw 44px;display:grid;grid-template-columns:1.35fr .65fr;gap:36px}.eyebrow{color:var(--cyan);font-size:10px;font-weight:950;letter-spacing:.18em;margin:0 0 12px}.hero h1{font:clamp(48px,7vw,96px)/.9 Georgia,serif;letter-spacing:-.045em;margin:0}.hero h1 em{font-style:normal;color:#76e8ff}.lead{max-width:900px;color:#a6bdce;font-size:17px;line-height:1.8;margin-top:24px}.daycard{align-self:end;padding:26px;border:1px solid #315d75;background:linear-gradient(145deg,#0a2131,#06121c);box-shadow:0 24px 70px #0008}.daycard small{color:#799bb1;font-size:9px;letter-spacing:.14em}.daycard>strong{display:block;font:56px Georgia,serif;color:#fff;margin:12px 0 2px}.daycard>span{color:var(--cyan);font-size:11px;font-weight:900}.daycard p{font:24px/1.1 Georgia,serif;margin:18px 0}.progress{height:7px;border:1px solid #21465d;background:#02080d;margin:18px 0 8px}.progress i{display:block;height:100%;background:linear-gradient(90deg,#38aee0,#68e6ff)}.daycard>b{font-size:9px;color:#7995a8}.truthbar{max-width:1360px;margin:0 auto 38px;padding:18px 24px;display:grid;grid-template-columns:1.5fr .5fr;gap:30px;border:1px solid #5b4821;background:#151006}.truthbar small{display:block;color:var(--gold);font-size:8px;letter-spacing:.14em;margin-bottom:6px}.truthbar strong{font-size:12px;line-height:1.5;color:#f3e4b9}.today,.weekly,.phasewrap,.score,.gates{max-width:1360px;margin:0 auto 48px;padding:0 4vw}.sectionhead{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:18px}.sectionhead h2{font:36px Georgia,serif;margin:0}.count{padding:8px 10px;border:1px solid #245673;color:#9fe7ff;font-size:9px;font-weight:900}.tasks{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.task{width:100%;display:grid;grid-template-columns:48px 1fr;align-items:center;text-align:left;border:1px solid #1d4059;background:#07131e;color:#dcecf5;cursor:pointer;min-height:64px;padding:0}.task span{display:grid;place-items:center;height:100%;border-right:1px solid #1d4059;color:var(--cyan);font-size:11px;font-weight:950}.task b{padding:15px;font-size:12px}.task.done{opacity:.55;border-color:#24553f;background:#07140e}.task.done span{color:var(--green)}.weekgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.weekgrid article{padding:22px;border:1px solid #1c4058;background:#06131e}.weekgrid small{color:var(--cyan);font-size:8px;font-weight:950;letter-spacing:.14em}.weekgrid h3{font:25px Georgia,serif;margin:10px 0}.weekgrid p{color:#91a9ba;font-size:12px;line-height:1.65}.weekgrid .floor{grid-column:1/-1;border-color:#5a4823;background:#161107}.floor small{color:var(--gold)}.phases{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.phase{padding:20px;border:1px solid #17354a;background:#05101a;opacity:.72}.phase.current{opacity:1;border-color:#4eafcf;background:linear-gradient(145deg,#092334,#06121c);box-shadow:0 18px 55px #003e5c26}.phasehead{display:flex;justify-content:space-between;gap:10px}.phasehead small{color:#8ccfe0;font-weight:900}.phasehead span{font-size:8px;font-weight:950;color:#6b8597}.phase.current .phasehead span{color:var(--cyan)}.phase h3{font:24px Georgia,serif;margin:12px 0}.phase ul{padding:0;list-style:none;display:grid;gap:7px}.phase li{font-size:11px;color:#9cb1c1;line-height:1.45}.phase li:before{content:'•';color:#62dbff;margin-right:8px}.score .sectionhead>a{font-size:9px;font-weight:950;color:#91eaff}.scoregrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.scoregrid article{padding:18px;border:1px solid #17394f;background:#06121c}.scoregrid strong{display:block;font-size:12px}.scoregrid p{color:#748ea2;font-size:10px;line-height:1.5;margin:7px 0 0}.gates{padding:28px 4vw;border-top:1px solid #44381f;border-bottom:1px solid #44381f;background:linear-gradient(90deg,#100d06aa,#071019aa)}.gates h2{font:34px Georgia,serif;margin:0}.gategrid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin-top:20px}.gategrid article{padding:17px;border:1px solid #5a4825;background:#161107}.gategrid b{font-size:9px;letter-spacing:.12em;color:var(--gold)}.gategrid p{font-size:11px;color:#c3b998;line-height:1.55}.links{max-width:1360px;margin:45px auto;padding:0 4vw;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.links a{padding:16px;border:1px solid #1a4059;background:#071522;color:#a6eaff;font-size:9px;font-weight:950;letter-spacing:.07em}footer{max-width:1360px;margin:auto;padding:28px 4vw;border-top:1px solid #163247;display:flex;justify-content:space-between;gap:20px;color:#6e8799;font-size:10px}footer strong{color:#d3e4ed}@media(max-width:900px){.hero{grid-template-columns:1fr}.truthbar{grid-template-columns:1fr}.tasks,.weekgrid,.phases,.scoregrid,.gategrid,.links{grid-template-columns:1fr}.weekgrid .floor{grid-column:auto}.topbar{align-items:flex-start;flex-direction:column}.sectionhead{align-items:flex-start;flex-direction:column}footer{flex-direction:column}}
    `}</style>
  </main>;
}
