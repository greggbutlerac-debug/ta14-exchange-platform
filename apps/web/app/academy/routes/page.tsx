"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type RouteState = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type AnchorStatus = "supported" | "limited" | "failed";

type RouteExample = {
  id: string;
  title: string;
  domain: string;
  consequence: string;
  state: RouteState;
  summary: string;
  failure?: string;
  repair: string;
  lesson: string;
  anchors: Array<{ label: string; value: string; status: AnchorStatus }>;
};

type SavedProgress = {
  version: "2.0";
  completed: string[];
  notes: Record<string, string>;
  updatedAt: string;
};

const STORAGE_KEY = "ta14-academy-route-reading-center-v2";

const routeExamples: RouteExample[] = [
  {
    id: "allow",
    title: "Bounded equipment restart",
    domain: "Facilities operations",
    consequence: "Restore one air-handling unit after a verified protective trip.",
    state: "ALLOW",
    summary: "Current evidence, valid authority, preserved continuity, and a bounded execution plan support one controlled restart with post-action verification.",
    repair: "No repair is required. The route must still preserve outcome evidence after the restart.",
    lesson: "ALLOW is permission for the exact committed action only. It is never a general authorization.",
    anchors: [
      { label: "Reality", value: "Protective trip occurred; no active fault remains.", status: "supported" },
      { label: "Record", value: "Timestamped controller history and technician measurements preserved.", status: "supported" },
      { label: "Continuity", value: "No material condition changed after inspection.", status: "supported" },
      { label: "Admissibility", value: "Evidence is current and sufficient for one restart decision.", status: "supported" },
      { label: "Binding", value: "Authorized facilities supervisor approved the bounded action.", status: "supported" },
      { label: "Commit", value: "Decision version and operating limits recorded before execution.", status: "supported" },
      { label: "Execution", value: "One restart only; no parameter changes permitted.", status: "supported" },
      { label: "Outcome", value: "Stable operation must be verified and preserved for 20 minutes.", status: "supported" },
    ],
  },
  {
    id: "hold",
    title: "Automated account suspension",
    domain: "Identity governance",
    consequence: "Suspend a user account based on an anomaly alert.",
    state: "HOLD",
    summary: "The alert is relevant, but the evidence is stale and the current authority boundary is incomplete. Execution must pause until the gaps are resolved.",
    failure: "Continuity is the earliest failed condition: the present identity state was not revalidated.",
    repair: "Refresh the identity state, establish current suspension authority, and rerun dependent gates.",
    lesson: "HOLD preserves the route while repair remains possible. It is not a soft approval.",
    anchors: [
      { label: "Reality", value: "Anomaly alert indicates unusual access behavior.", status: "supported" },
      { label: "Record", value: "Alert and source events are attributable.", status: "supported" },
      { label: "Continuity", value: "Latest identity state was not revalidated.", status: "failed" },
      { label: "Admissibility", value: "Evidence may no longer describe the present condition.", status: "limited" },
      { label: "Binding", value: "System role permits review but not automatic suspension.", status: "failed" },
      { label: "Commit", value: "No valid decision may be committed yet.", status: "limited" },
      { label: "Execution", value: "Suspension is blocked pending revalidation.", status: "failed" },
      { label: "Outcome", value: "No consequence is allowed to bind while held.", status: "supported" },
    ],
  },
  {
    id: "deny",
    title: "Unsupported reimbursement approval",
    domain: "Financial operations",
    consequence: "Release a reimbursement without required source documentation.",
    state: "DENY",
    summary: "The required evidence does not exist, and policy does not authorize a substitute. The requested execution is outside the admissible boundary.",
    failure: "Record is the earliest failed condition: the mandatory source evidence is absent.",
    repair: "A new request may be initiated only when the required source documentation exists and can be validated.",
    lesson: "DENY means the present action is prohibited under the preserved state. Later evidence cannot rewrite the original decision.",
    anchors: [
      { label: "Reality", value: "A reimbursement request exists.", status: "supported" },
      { label: "Record", value: "Required receipt and approval record are absent.", status: "failed" },
      { label: "Continuity", value: "There is no preserved source chain to validate.", status: "failed" },
      { label: "Admissibility", value: "The request cannot satisfy the evidence threshold.", status: "failed" },
      { label: "Binding", value: "No authority exists to waive the mandatory record.", status: "failed" },
      { label: "Commit", value: "A valid approval state cannot be created.", status: "failed" },
      { label: "Execution", value: "Payment release is prohibited.", status: "failed" },
      { label: "Outcome", value: "Denial and reason are preserved for challenge and correction.", status: "supported" },
    ],
  },
  {
    id: "escalate",
    title: "Conflicting clinical routing evidence",
    domain: "High-consequence workflow",
    consequence: "Route a case where two authoritative records materially conflict.",
    state: "ESCALATE",
    summary: "The system cannot resolve the conflict within its authorized scope. The case must move to a qualified decision authority without silently favoring either record.",
    failure: "Binding is the decisive limit: the current reviewer lacks authority to resolve the conflict.",
    repair: "Route the preserved conflict to a named qualified authority and require an attributable resolution.",
    lesson: "ESCALATE transfers judgment. It does not convert uncertainty into permission.",
    anchors: [
      { label: "Reality", value: "A consequential routing decision is pending.", status: "supported" },
      { label: "Record", value: "Two attributable records contain incompatible instructions.", status: "limited" },
      { label: "Continuity", value: "Both records are current and preserved.", status: "supported" },
      { label: "Admissibility", value: "Each record is relevant; neither can be silently displaced.", status: "limited" },
      { label: "Binding", value: "Current reviewer lacks authority to resolve the conflict.", status: "failed" },
      { label: "Commit", value: "Escalation state and conflict are preserved.", status: "supported" },
      { label: "Execution", value: "No downstream action occurs before qualified review.", status: "supported" },
      { label: "Outcome", value: "Resolution must return with attributable authority and rationale.", status: "supported" },
    ],
  },
];

const stateTone: Record<RouteState, string> = { ALLOW: "allow", HOLD: "hold", DENY: "deny", ESCALATE: "escalate" };

function StatePill({ state }: { state: RouteState }) {
  return <span className={`statePill ${stateTone[state]}`}>{state}</span>;
}

function scoreRoute(route: RouteExample) {
  const supported = route.anchors.filter((item) => item.status === "supported").length;
  return Math.round((supported / route.anchors.length) * 100);
}

export default function RouteReadingCenterPage() {
  const [activeId, setActiveId] = useState(routeExamples[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [mode, setMode] = useState<"reader" | "protocol" | "comparison">("reader");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedProgress;
      if (saved.version !== "2.0") return;
      setCompleted(saved.completed || []);
      setNotes(saved.notes || {});
    } catch {
      setSaveState("error");
    }
  }, []);

  const activeRoute = useMemo(() => routeExamples.find((route) => route.id === activeId) ?? routeExamples[0], [activeId]);
  const progress = Math.round((completed.length / routeExamples.length) * 100);
  const activeScore = scoreRoute(activeRoute);
  const firstFailure = activeRoute.anchors.find((item) => item.status === "failed");

  function toggleCompleted(id: string) {
    setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setSaveState("idle");
  }

  function saveProgress() {
    try {
      const payload: SavedProgress = { version: "2.0", completed, notes, updatedAt: new Date().toISOString() };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <main className="routePage">
      <div className="ambient" aria-hidden="true"><div className="stars"/><div className="gridFloor"/><div className="aurora one"/><div className="aurora two"/></div>
      <div className="shell">
        <header className="hero">
          <div className="heroCopy">
            <div className="liveLabel"><span/>TA-14 Academy · Route intelligence environment</div>
            <h1>Route Reading <em>Center</em></h1>
            <p>Learn to read a governed route from reality forward. Locate the first unsupported condition, understand why it controls every downstream state, and preserve a bounded analysis before building your own route.</p>
            <div className="heroActions"><button type="button" onClick={() => setMode("reader")} className="primaryButton">Enter route reader →</button><button type="button" onClick={() => setMode("comparison")} className="secondaryButton">Compare determinations</button></div>
            <div className="governingRule"><span>Reading discipline</span><strong>Do not begin with the desired outcome.</strong></div>
          </div>
          <div className={`commandCore ${stateTone[activeRoute.state]}`}>
            <div className="coreHeader"><div><span>Active determination</span><h2>{activeRoute.state}</h2></div><StatePill state={activeRoute.state}/></div>
            <p>{activeRoute.summary}</p>
            <div className="coreMetrics"><div><strong>{activeScore}%</strong><span>supported chain</span></div><div><strong>{firstFailure?.label ?? "None"}</strong><span>earliest failure</span></div></div>
          </div>
          <div className="heroRail">{activeRoute.anchors.map((anchor,index)=><div key={anchor.label} className={anchor.status}><span>{String(index+1).padStart(2,"0")}</span><strong>{anchor.label}</strong><i/></div>)}</div>
        </header>

        <section className="statDeck">
          <article><span>Examples reviewed</span><strong>{completed.length}/4</strong><small>Four decision states represented</small></article>
          <article><span>Learning progress</span><strong>{progress}%</strong><small>Locally preserved learner progress</small></article>
          <article><span>Anchor links</span><strong>8</strong><small>Reality through outcome</small></article>
          <article className="accent"><span>Current route</span><strong>{activeRoute.state}</strong><small>{activeRoute.domain}</small></article>
        </section>

        <nav className="modeTabs">
          <button type="button" className={mode==="reader"?"active":""} onClick={()=>setMode("reader")}>Route reader</button>
          <button type="button" className={mode==="protocol"?"active":""} onClick={()=>setMode("protocol")}>Reading protocol</button>
          <button type="button" className={mode==="comparison"?"active":""} onClick={()=>setMode("comparison")}>Decision comparison</button>
        </nav>

        {mode === "reader" && <section className="readerGrid">
          <aside className="routeDock">
            <div className="sectionIntro"><span>Demonstration routes</span><h2>Choose a route to inspect</h2><p>Each route carries a different decision state, failure pattern, and execution consequence.</p></div>
            <div className="routeList">{routeExamples.map((route,index)=><button key={route.id} type="button" onClick={()=>setActiveId(route.id)} className={activeId===route.id?"active":""}><span className="routeIndex">{String(index+1).padStart(2,"0")}</span><span className="routeCopy"><b>{route.domain}</b><strong>{route.title}</strong><small>{route.consequence}</small></span><StatePill state={route.state}/></button>)}</div>
          </aside>

          <div className="readingStage">
            <article className="routeOverview panel">
              <div className="panelHeader"><div><span>Selected route</span><h2>{activeRoute.title}</h2><p>{activeRoute.consequence}</p></div><StatePill state={activeRoute.state}/></div>
              <div className="overviewGrid"><div><span>Route summary</span><p>{activeRoute.summary}</p></div><div><span>Reading lesson</span><p>{activeRoute.lesson}</p></div></div>
            </article>

            <article className="chainPanel panel">
              <div className="panelHeader"><div><span>Execution chain</span><h2>Read from reality forward</h2><p>The first failed link controls the route. Later support cannot cure an earlier break.</p></div><div className="chainScore"><strong>{activeScore}%</strong><span>supported</span></div></div>
              <div className="anchorGrid">{activeRoute.anchors.map((anchor,index)=><article key={anchor.label} className={`anchorCard ${anchor.status}`}><div className="anchorTop"><span>{String(index+1).padStart(2,"0")}</span><b>{anchor.status}</b></div><h3>{anchor.label}</h3><p>{anchor.value}</p><i/></article>)}</div>
            </article>

            <article className={`decisionVault ${stateTone[activeRoute.state]}`}>
              <div className="vaultLabel">Bounded route determination</div>
              <div className="vaultMain"><div><h2>{activeRoute.state}</h2><p>{activeRoute.failure ?? "No unsupported upstream condition is present in the preserved route."}</p></div><StatePill state={activeRoute.state}/></div>
              <div className="vaultGrid"><div><span>Earliest controlling condition</span><strong>{firstFailure?.label ?? "No failure"}</strong></div><div><span>Repair discipline</span><p>{activeRoute.repair}</p></div></div>
            </article>

            <article className="analysisPanel panel">
              <div className="panelHeader"><div><span>Learner analysis</span><h2>Preserve your reading</h2><p>State the earliest failed or limited condition, explain the final state, and identify what would be required to change it.</p></div></div>
              <textarea value={notes[activeRoute.id] ?? ""} onChange={(event)=>{setNotes((current)=>({...current,[activeRoute.id]:event.target.value}));setSaveState("idle");}} rows={7} placeholder="Example: The route cannot proceed because continuity was not revalidated after the identity state changed..."/>
              <div className="analysisActions"><button type="button" className={`completeButton ${completed.includes(activeRoute.id)?"done":""}`} onClick={()=>toggleCompleted(activeRoute.id)}>{completed.includes(activeRoute.id)?"✓ Example reviewed":"Mark example reviewed"}</button><button type="button" className="primaryButton" onClick={saveProgress}>Save progress</button><span className={`saveState ${saveState}`}>{saveState==="saved"?"Progress preserved locally":saveState==="error"?"Unable to save locally":"Unsaved changes remain visible"}</span></div>
            </article>
          </div>
        </section>}

        {mode === "protocol" && <section className="protocolView">
          <div className="sectionIntro wide"><span>Institutional reading protocol</span><h2>Ten moves before interpretation becomes reliance.</h2><p>Use the same sequence every time. Route reading is not impressionistic; it is a disciplined inspection of consequence, evidence, authority, continuity, binding conditions, commitment, execution, and outcome.</p></div>
          <div className="protocolGrid">{[
            ["01","Name the consequence","What exact action may bind to reality?"],["02","Establish present reality","What condition actually exists now?"],["03","Locate the record","What was captured, by whom, and when?"],["04","Test continuity","Did identity, state, version, and custody remain connected?"],["05","Determine admissibility","May this evidence support this consequence here and now?"],["06","Resolve authority","Who may bind the decision, and within what scope?"],["07","Apply binding conditions","Which limits, thresholds, and prohibitions govern?"],["08","Find earliest failure","Which first unsupported link controls the route?"],["09","Inspect commitment","Was the decision fixed before action?"],["10","Verify execution and outcome","Did the determination control the action, and what followed?"]
          ].map(([number,title,question])=><article key={number}><span>{number}</span><h3>{title}</h3><p>{question}</p></article>)}</div>
        </section>}

        {mode === "comparison" && <section className="comparisonView">
          <div className="sectionIntro wide"><span>Decision comparison</span><h2>Four states. Four different operational meanings.</h2><p>Determinations are not labels. Each one changes what the system may do next.</p></div>
          <div className="comparisonGrid">{routeExamples.map((route)=><article key={route.id} className={stateTone[route.state]}><StatePill state={route.state}/><h3>{route.title}</h3><p>{route.summary}</p><div><span>Execution effect</span><strong>{route.state==="ALLOW"?"Release exact committed action":route.state==="HOLD"?"Pause and preserve repair condition":route.state==="DENY"?"Block the action path":"Transfer to named authority"}</strong></div><button type="button" onClick={()=>{setActiveId(route.id);setMode("reader");}}>Inspect route →</button></article>)}</div>
        </section>}

        <section className="nextDeck">
          <article><span>Next governed practice</span><h3>Route Construction Lab</h3><p>Convert an uncertain request into a bounded, attributable, challengeable route.</p><Link href="/academy/route-construction-lab">Build a route →</Link></article>
          <article><span>Challenge the result</span><h3>Review Workspace</h3><p>Preserve findings, objections, corrections, and version history without erasing uncertainty.</p><Link href="/academy/review">Open review →</Link></article>
          <article><span>Prove capability</span><h3>Assessment Center</h3><p>Separate attendance and completion from demonstrated, scope-bounded competency.</p><Link href="/academy/assessment">Open assessment →</Link></article>
        </section>

        <footer><strong>No admissible evidence. No admissible execution.</strong><span>Route completion reflects learner analysis and does not grant operational authority.</span></footer>
      </div>

      <style jsx global>{`
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#02060d;color:#eef6ff}.routePage{min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 18% 10%,rgba(0,220,255,.09),transparent 28%),radial-gradient(circle at 88% 16%,rgba(139,124,255,.12),transparent 30%),linear-gradient(180deg,#030812 0%,#02060d 54%,#050914 100%);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.ambient{position:absolute;inset:0;pointer-events:none;overflow:hidden}.stars{position:absolute;inset:0;background-image:radial-gradient(circle at 20% 30%,rgba(255,255,255,.9) 0 1px,transparent 1.5px),radial-gradient(circle at 70% 16%,rgba(101,234,255,.8) 0 1px,transparent 1.5px),radial-gradient(circle at 84% 62%,rgba(139,124,255,.8) 0 1px,transparent 1.5px);background-size:170px 170px,240px 240px,310px 310px;opacity:.2}.gridFloor{position:absolute;left:-20%;right:-20%;bottom:-180px;height:560px;background-image:linear-gradient(rgba(101,234,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(101,234,255,.07) 1px,transparent 1px);background-size:62px 62px;transform:perspective(520px) rotateX(64deg);transform-origin:center bottom;mask-image:linear-gradient(to top,#000,transparent 88%)}.aurora{position:absolute;width:42vw;height:42vw;border-radius:50%;filter:blur(90px);opacity:.12}.aurora.one{background:#00d9ff;left:-18vw;top:8vh}.aurora.two{background:#7d63ff;right:-18vw;top:22vh}.shell{position:relative;z-index:1;width:min(1460px,calc(100% - 32px));margin:0 auto;padding:28px 0 64px}.hero{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(360px,.85fr);gap:24px;padding:34px;border:1px solid rgba(255,255,255,.09);border-radius:34px;background:linear-gradient(135deg,rgba(9,21,39,.92),rgba(4,11,23,.84));box-shadow:0 35px 110px rgba(0,0,0,.5),inset 0 1px rgba(255,255,255,.06);backdrop-filter:blur(24px);position:relative;overflow:hidden}.hero:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(101,234,255,.04),transparent);transform:translateX(-100%);animation:scan 9s linear infinite}.liveLabel,.sectionIntro>span,.panelHeader span,.vaultLabel{font-size:11px;font-weight:900;letter-spacing:.22em;text-transform:uppercase;color:#66eaff}.liveLabel{display:flex;align-items:center;gap:10px}.liveLabel span{width:8px;height:8px;border-radius:50%;background:#57f1c9;box-shadow:0 0 18px #57f1c9}.hero h1{margin:18px 0 12px;font-size:clamp(48px,6.4vw,92px);line-height:.88;letter-spacing:-.07em}.hero h1 em{font-style:normal;color:#7deeff;text-shadow:0 0 34px rgba(101,234,255,.25)}.heroCopy>p{max-width:780px;color:#aab8cb;font-size:18px;line-height:1.75}.heroActions,.analysisActions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.primaryButton,.secondaryButton,.completeButton{appearance:none;border:0;border-radius:14px;padding:13px 18px;font-weight:900;font-size:14px;cursor:pointer;text-decoration:none;transition:.25s ease}.primaryButton{background:linear-gradient(135deg,#eafdff,#87f3ff);color:#03111c;box-shadow:0 16px 36px rgba(70,220,255,.18)}.primaryButton:hover{transform:translateY(-2px);box-shadow:0 22px 46px rgba(70,220,255,.28)}.secondaryButton,.completeButton{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:#eaf4ff}.secondaryButton:hover,.completeButton:hover{border-color:rgba(101,234,255,.4);background:rgba(101,234,255,.08)}.completeButton.done{background:rgba(81,239,190,.12);border-color:rgba(81,239,190,.32);color:#82f3d2}.governingRule{margin-top:26px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08);display:flex;gap:10px;flex-direction:column}.governingRule span{font-size:10px;text-transform:uppercase;letter-spacing:.2em;color:#75869d}.governingRule strong{font-size:17px}.commandCore{position:relative;border:1px solid rgba(255,255,255,.1);border-radius:28px;padding:26px;background:radial-gradient(circle at 80% 0%,rgba(101,234,255,.12),transparent 34%),rgba(2,8,18,.74);box-shadow:inset 0 1px rgba(255,255,255,.05),0 20px 60px rgba(0,0,0,.36)}.commandCore.allow{box-shadow:inset 0 0 70px rgba(81,239,190,.06),0 20px 60px rgba(0,0,0,.36)}.commandCore.hold{box-shadow:inset 0 0 70px rgba(255,194,92,.06),0 20px 60px rgba(0,0,0,.36)}.commandCore.deny{box-shadow:inset 0 0 70px rgba(255,102,129,.06),0 20px 60px rgba(0,0,0,.36)}.commandCore.escalate{box-shadow:inset 0 0 70px rgba(155,132,255,.08),0 20px 60px rgba(0,0,0,.36)}.coreHeader,.panelHeader,.vaultMain{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.coreHeader span{font-size:10px;letter-spacing:.19em;text-transform:uppercase;color:#7d8ca0}.coreHeader h2{font-size:42px;margin:6px 0 0;letter-spacing:-.05em}.commandCore>p{color:#a7b5c7;line-height:1.7}.coreMetrics{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px}.coreMetrics div{padding:16px;border-radius:18px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07)}.coreMetrics strong{display:block;font-size:22px}.coreMetrics span{display:block;margin-top:6px;color:#7f8fa5;font-size:11px;text-transform:uppercase;letter-spacing:.12em}.statePill{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:7px 10px;font-size:10px;font-weight:950;letter-spacing:.14em;border:1px solid}.statePill.allow{color:#83f4d4;background:rgba(81,239,190,.1);border-color:rgba(81,239,190,.28)}.statePill.hold{color:#ffd38b;background:rgba(255,194,92,.1);border-color:rgba(255,194,92,.28)}.statePill.deny{color:#ff91a8;background:rgba(255,102,129,.1);border-color:rgba(255,102,129,.28)}.statePill.escalate{color:#c0afff;background:rgba(155,132,255,.1);border-color:rgba(155,132,255,.28)}.heroRail{grid-column:1/-1;display:grid;grid-template-columns:repeat(8,1fr);gap:8px;margin-top:4px}.heroRail>div{position:relative;padding:12px;border-radius:13px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06)}.heroRail span{display:block;color:#61728a;font-size:9px}.heroRail strong{display:block;margin-top:4px;font-size:11px}.heroRail i{display:block;height:2px;margin-top:10px;background:#39485c}.heroRail .supported i{background:#51efbe}.heroRail .limited i{background:#ffc25c}.heroRail .failed i{background:#ff6681}.statDeck{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:18px 0}.statDeck article{padding:20px;border-radius:22px;background:rgba(7,17,31,.78);border:1px solid rgba(255,255,255,.075);box-shadow:0 16px 42px rgba(0,0,0,.24)}.statDeck span{font-size:10px;text-transform:uppercase;letter-spacing:.18em;color:#6f8098}.statDeck strong{display:block;font-size:30px;margin-top:8px}.statDeck small{display:block;color:#788aa2;margin-top:5px}.statDeck .accent{background:linear-gradient(135deg,rgba(101,234,255,.08),rgba(125,99,255,.08))}.modeTabs{display:flex;gap:6px;padding:6px;border:1px solid rgba(255,255,255,.07);border-radius:16px;background:rgba(3,9,19,.72);width:max-content;max-width:100%;margin-bottom:18px}.modeTabs button{border:0;background:transparent;color:#75869d;padding:11px 16px;border-radius:11px;font-weight:850;cursor:pointer}.modeTabs button.active{color:#041018;background:linear-gradient(135deg,#eaffff,#8ff5ff)}.readerGrid{display:grid;grid-template-columns:390px minmax(0,1fr);gap:18px}.routeDock,.panel,.protocolView,.comparisonView{border:1px solid rgba(255,255,255,.08);background:rgba(6,15,28,.82);border-radius:28px;box-shadow:0 24px 70px rgba(0,0,0,.34);backdrop-filter:blur(20px)}.routeDock{padding:24px;align-self:start;position:sticky;top:20px}.sectionIntro h2{font-size:28px;line-height:1.05;margin:8px 0 10px;letter-spacing:-.03em}.sectionIntro p{color:#8495ab;line-height:1.65;margin:0}.sectionIntro.wide{max-width:840px}.routeList{display:grid;gap:10px;margin-top:20px}.routeList button{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:12px;align-items:start;text-align:left;padding:15px;border-radius:17px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025);color:#eff7ff;cursor:pointer;transition:.22s}.routeList button:hover,.routeList button.active{transform:translateX(4px);border-color:rgba(101,234,255,.34);background:rgba(101,234,255,.055)}.routeIndex{font-size:11px;color:#65748a;margin-top:3px}.routeCopy b{display:block;color:#6deaff;font-size:9px;text-transform:uppercase;letter-spacing:.13em}.routeCopy strong{display:block;margin-top:5px;font-size:15px}.routeCopy small{display:block;margin-top:6px;color:#77889e;line-height:1.45}.readingStage{display:grid;gap:18px}.panel{padding:26px}.panelHeader h2{font-size:30px;margin:7px 0 8px;letter-spacing:-.04em}.panelHeader p{margin:0;color:#8192a8;line-height:1.6}.overviewGrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:22px}.overviewGrid>div{padding:18px;border-radius:18px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06)}.overviewGrid span,.vaultGrid span{font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.17em;color:#67eaff}.overviewGrid p,.vaultGrid p{color:#a9b6c6;line-height:1.65}.chainScore{text-align:right}.chainScore strong{display:block;font-size:27px}.chainScore span{font-size:10px;color:#75869d;text-transform:uppercase;letter-spacing:.15em}.anchorGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:22px}.anchorCard{position:relative;padding:18px;border-radius:19px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);overflow:hidden;min-height:178px}.anchorCard.supported{border-color:rgba(81,239,190,.18)}.anchorCard.limited{border-color:rgba(255,194,92,.23)}.anchorCard.failed{border-color:rgba(255,102,129,.25)}.anchorTop{display:flex;justify-content:space-between;color:#68798f;font-size:9px;text-transform:uppercase;letter-spacing:.12em}.anchorCard h3{font-size:20px;margin:13px 0 8px}.anchorCard p{color:#8394aa;line-height:1.55;font-size:13px}.anchorCard i{position:absolute;left:0;right:0;bottom:0;height:3px;background:#3f4e62}.anchorCard.supported i{background:#51efbe}.anchorCard.limited i{background:#ffc25c}.anchorCard.failed i{background:#ff6681}.decisionVault{padding:28px;border-radius:28px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(135deg,rgba(8,20,37,.96),rgba(4,10,20,.9));box-shadow:0 28px 90px rgba(0,0,0,.42)}.decisionVault.allow{box-shadow:inset 0 0 100px rgba(81,239,190,.05),0 28px 90px rgba(0,0,0,.42)}.decisionVault.hold{box-shadow:inset 0 0 100px rgba(255,194,92,.05),0 28px 90px rgba(0,0,0,.42)}.decisionVault.deny{box-shadow:inset 0 0 100px rgba(255,102,129,.06),0 28px 90px rgba(0,0,0,.42)}.decisionVault.escalate{box-shadow:inset 0 0 100px rgba(155,132,255,.07),0 28px 90px rgba(0,0,0,.42)}.vaultMain{margin-top:10px;align-items:center}.vaultMain h2{font-size:58px;margin:0;letter-spacing:-.06em}.vaultMain p{max-width:760px;color:#a6b4c5;line-height:1.65}.vaultGrid{display:grid;grid-template-columns:.7fr 1.3fr;gap:14px;margin-top:20px}.vaultGrid>div{padding:17px;border-radius:17px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)}.vaultGrid strong{display:block;margin-top:8px}.analysisPanel textarea{width:100%;margin-top:18px;border-radius:18px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.22);color:#eaf4ff;padding:18px;resize:vertical;outline:none;font:inherit;line-height:1.65}.analysisPanel textarea:focus{border-color:rgba(101,234,255,.4);box-shadow:0 0 0 4px rgba(101,234,255,.05)}.saveState{align-self:center;color:#6f8096;font-size:12px}.saveState.saved{color:#65eac3}.saveState.error{color:#ff8ca3}.protocolView,.comparisonView{padding:30px}.protocolGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:13px;margin-top:24px}.protocolGrid article{padding:21px;border-radius:20px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07)}.protocolGrid span{color:#67eaff;font-size:11px;font-weight:900}.protocolGrid h3{font-size:19px;margin:10px 0 8px}.protocolGrid p{color:#8495aa;line-height:1.6;margin:0}.comparisonGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:24px}.comparisonGrid article{padding:22px;border-radius:22px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07)}.comparisonGrid article.allow{border-color:rgba(81,239,190,.2)}.comparisonGrid article.hold{border-color:rgba(255,194,92,.2)}.comparisonGrid article.deny{border-color:rgba(255,102,129,.2)}.comparisonGrid article.escalate{border-color:rgba(155,132,255,.22)}.comparisonGrid h3{font-size:21px;margin:18px 0 10px}.comparisonGrid p{color:#8596ab;line-height:1.6}.comparisonGrid article>div{padding-top:15px;margin-top:15px;border-top:1px solid rgba(255,255,255,.07)}.comparisonGrid article>div span{display:block;color:#6e8097;font-size:9px;text-transform:uppercase;letter-spacing:.15em}.comparisonGrid article>div strong{display:block;margin-top:7px}.comparisonGrid button{margin-top:18px;border:0;background:none;color:#72eaff;font-weight:900;cursor:pointer;padding:0}.nextDeck{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px}.nextDeck article{padding:24px;border-radius:24px;background:rgba(7,17,31,.78);border:1px solid rgba(255,255,255,.075)}.nextDeck span{font-size:9px;text-transform:uppercase;letter-spacing:.17em;color:#67eaff}.nextDeck h3{font-size:22px;margin:9px 0}.nextDeck p{color:#8294a9;line-height:1.6}.nextDeck a{color:#e9fbff;text-decoration:none;font-weight:900}.nextDeck a:hover{color:#67eaff}footer{display:flex;justify-content:space-between;gap:20px;padding:26px 4px 0;color:#718198}footer strong{color:#eef7ff}@keyframes scan{to{transform:translateX(100%)}}
        @media(max-width:1100px){.hero{grid-template-columns:1fr}.readerGrid{grid-template-columns:1fr}.routeDock{position:relative;top:auto}.anchorGrid,.comparisonGrid{grid-template-columns:repeat(2,1fr)}.statDeck{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:720px){.shell{width:min(100% - 18px,1460px);padding-top:10px}.hero{padding:22px;border-radius:24px}.hero h1{font-size:52px}.heroCopy>p{font-size:15px}.heroRail{grid-template-columns:repeat(4,1fr)}.statDeck,.overviewGrid,.vaultGrid,.protocolGrid,.comparisonGrid,.nextDeck,.anchorGrid{grid-template-columns:1fr}.modeTabs{width:100%;overflow:auto}.modeTabs button{white-space:nowrap}.routeDock,.panel,.protocolView,.comparisonView{padding:20px;border-radius:22px}.vaultMain,.panelHeader,.coreHeader{flex-direction:column}.vaultMain h2{font-size:46px}footer{flex-direction:column}.coreMetrics{grid-template-columns:1fr}}
      `}</style>
    </main>
  );
}
