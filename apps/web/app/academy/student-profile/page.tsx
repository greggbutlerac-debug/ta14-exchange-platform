"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Tab = "overview" | "pathway" | "competencies" | "timeline" | "notes";
type ActivityState = "COMPLETE" | "ACTIVE" | "LOCKED";
type CompetencyState = "DEMONSTRATED" | "DEVELOPING" | "NOT_EVALUATED";

type Module = {
  id: string;
  title: string;
  category: string;
  href: string;
  state: ActivityState;
  progress: number;
  score: number | null;
  duration: string;
  lastActivity: string;
  description: string;
};

type Competency = {
  id: string;
  title: string;
  state: CompetencyState;
  level: number;
  target: number;
  evidence: number;
  description: string;
};

type TimelineItem = {
  id: string;
  date: string;
  title: string;
  detail: string;
  kind: "LESSON" | "LAB" | "ASSESSMENT" | "CREDENTIAL" | "NOTE";
};

type Goal = {
  id: string;
  title: string;
  targetDate: string;
  progress: number;
};

type PersistedState = {
  activeTab: Tab;
  displayName: string;
  role: string;
  organization: string;
  learningGoal: string;
  publicProfile: boolean;
  notes: string;
  goals: Goal[];
};

const STORAGE_KEY = "ta14-academy-student-profile-v1";

const modules: Module[] = [
  {
    id: "m1",
    title: "What Is a Governance Route?",
    category: "Foundation",
    href: "/academy/what-is-a-route",
    state: "COMPLETE",
    progress: 100,
    score: 96,
    duration: "42 min",
    lastActivity: "2026-07-20",
    description: "Establishes the route model and the difference between explanation and governed execution.",
  },
  {
    id: "m2",
    title: "Reality and Record",
    category: "Foundation",
    href: "/academy/reality-and-record",
    state: "COMPLETE",
    progress: 100,
    score: 94,
    duration: "55 min",
    lastActivity: "2026-07-20",
    description: "Separates what occurred from what was captured, represented, or inferred.",
  },
  {
    id: "m3",
    title: "Continuity",
    category: "Foundation",
    href: "/academy/continuity",
    state: "COMPLETE",
    progress: 100,
    score: 91,
    duration: "49 min",
    lastActivity: "2026-07-21",
    description: "Tests whether the governing chain remains traceable without unexplained breaks.",
  },
  {
    id: "m4",
    title: "Admissibility",
    category: "Foundation",
    href: "/academy/admissibility",
    state: "COMPLETE",
    progress: 100,
    score: 93,
    duration: "61 min",
    lastActivity: "2026-07-22",
    description: "Determines whether evidence and conditions have earned the right to support execution.",
  },
  {
    id: "m5",
    title: "Authority and Binding",
    category: "Foundation",
    href: "/academy/authority-and-binding",
    state: "COMPLETE",
    progress: 100,
    score: 95,
    duration: "58 min",
    lastActivity: "2026-07-23",
    description: "Validates the source, scope, currency, and limits of authority.",
  },
  {
    id: "m6",
    title: "Commit and Version History",
    category: "Foundation",
    href: "/academy/commit-and-version-history",
    state: "COMPLETE",
    progress: 100,
    score: 90,
    duration: "44 min",
    lastActivity: "2026-07-24",
    description: "Preserves the versioned record that explains how a determination changed.",
  },
  {
    id: "m7",
    title: "Execution Correspondence",
    category: "Foundation",
    href: "/academy/execution-correspondence",
    state: "COMPLETE",
    progress: 100,
    score: 92,
    duration: "63 min",
    lastActivity: "2026-07-25",
    description: "Tests whether runtime action still corresponds to the approved determination.",
  },
  {
    id: "m8",
    title: "Outcome and Verification",
    category: "Foundation",
    href: "/academy/outcome-and-verification",
    state: "COMPLETE",
    progress: 100,
    score: 94,
    duration: "52 min",
    lastActivity: "2026-07-26",
    description: "Preserves what occurred and makes the outcome independently reviewable.",
  },
  {
    id: "m9",
    title: "Route Validation Workshop",
    category: "Applied lab",
    href: "/academy/route-validation-workshop",
    state: "COMPLETE",
    progress: 100,
    score: 89,
    duration: "2 hr 20 min",
    lastActivity: "2026-07-29",
    description: "Applies the eight-anchor review method across complete and defective routes.",
  },
  {
    id: "m10",
    title: "Evidence Conflict Resolution Lab",
    category: "Applied lab",
    href: "/academy/evidence-conflict-resolution-lab",
    state: "COMPLETE",
    progress: 100,
    score: 91,
    duration: "2 hr 05 min",
    lastActivity: "2026-07-30",
    description: "Resolves competing evidence without forcing unsupported certainty.",
  },
  {
    id: "m11",
    title: "Challenge and Appeal Lab",
    category: "Applied lab",
    href: "/academy/challenge-and-appeal-lab",
    state: "ACTIVE",
    progress: 50,
    score: null,
    duration: "3 of 6 missions",
    lastActivity: "Today",
    description: "Preserves challenge grounds, remedies, review findings, and attributable appeal outcomes.",
  },
  {
    id: "m12",
    title: "Capstone Mission",
    category: "Evaluation",
    href: "/academy/capstone-mission",
    state: "LOCKED",
    progress: 0,
    score: null,
    duration: "Estimated 3 hr",
    lastActivity: "Locked",
    description: "Demonstrates the complete TA-14 governance method from reality through verified outcome.",
  },
];

const competencies: Competency[] = [
  { id: "c1", title: "Reality and Record", state: "DEMONSTRATED", level: 4, target: 4, evidence: 7, description: "Distinguishes observable reality from preserved representation and identifies record limits." },
  { id: "c2", title: "Continuity", state: "DEMONSTRATED", level: 4, target: 4, evidence: 6, description: "Traces source evidence through determination, authority, execution, and outcome." },
  { id: "c3", title: "Admissibility", state: "DEMONSTRATED", level: 4, target: 4, evidence: 8, description: "Evaluates whether evidence and conditions may legitimately support execution." },
  { id: "c4", title: "Authority and Binding", state: "DEVELOPING", level: 3, target: 4, evidence: 5, description: "Validates authority source, scope, currency, conditions, and limitations." },
  { id: "c5", title: "Execution Correspondence", state: "DEVELOPING", level: 3, target: 4, evidence: 4, description: "Tests whether runtime action remains inside the approved execution boundary." },
  { id: "c6", title: "Outcome Verification", state: "DEMONSTRATED", level: 4, target: 4, evidence: 6, description: "Preserves what happened and maintains a challengeable verification record." },
  { id: "c7", title: "Evidence Conflict Resolution", state: "DEVELOPING", level: 3, target: 4, evidence: 3, description: "Classifies conflicting claims, missing evidence, and unresolved conditions." },
  { id: "c8", title: "Challenge and Appeal", state: "DEVELOPING", level: 2, target: 4, evidence: 2, description: "Preserves challenge grounds, requested remedies, findings, and appeal outcomes." },
];

const timeline: TimelineItem[] = [
  { id: "t1", date: "Today", title: "Challenge mission preserved", detail: "Completed mission three with an ESCALATE determination and documented authority conflict.", kind: "LAB" },
  { id: "t2", date: "2026-07-30", title: "Evidence Conflict Resolution Lab completed", detail: "Final score: 91. Governed conflict record accepted.", kind: "LAB" },
  { id: "t3", date: "2026-07-29", title: "Route Validation Workshop completed", detail: "Five missions completed. Reviewer confidence recorded at 89 percent.", kind: "LAB" },
  { id: "t4", date: "2026-07-29", title: "Foundation credential issued", detail: "Execution Admissibility Foundations credential became independently verifiable.", kind: "CREDENTIAL" },
  { id: "t5", date: "2026-07-28", title: "Academy assessment completed", detail: "Assessment threshold exceeded with a score of 94 percent.", kind: "ASSESSMENT" },
  { id: "t6", date: "2026-07-26", title: "Foundation pathway completed", detail: "All eight governance anchors recorded as complete.", kind: "LESSON" },
];

const defaultGoals: Goal[] = [
  { id: "g1", title: "Complete Challenge and Appeal Lab", targetDate: "2026-08-02", progress: 50 },
  { id: "g2", title: "Reach level 4 in Authority and Binding", targetDate: "2026-08-08", progress: 75 },
  { id: "g3", title: "Unlock the Capstone Mission", targetDate: "2026-08-10", progress: 82 },
];

const tabLabels: Record<Tab, string> = {
  overview: "Overview",
  pathway: "Learning pathway",
  competencies: "Competencies",
  timeline: "Timeline",
  notes: "Notes",
};

function safeRead(): Partial<PersistedState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Partial<PersistedState>) : {};
  } catch {
    return {};
  }
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function StudentProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [displayName, setDisplayName] = useState("Academy Learner");
  const [role, setRole] = useState("Governance Analyst");
  const [organization, setOrganization] = useState("TA-14 Exchange");
  const [learningGoal, setLearningGoal] = useState("Build defensible judgment across the complete governed-execution route.");
  const [publicProfile, setPublicProfile] = useState(false);
  const [notes, setNotes] = useState("Focus next on authority revalidation and challenge remedies. Preserve uncertainty rather than converting it into unsupported certainty.");
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const saved = safeRead();
    if (saved.activeTab) setActiveTab(saved.activeTab);
    if (typeof saved.displayName === "string") setDisplayName(saved.displayName);
    if (typeof saved.role === "string") setRole(saved.role);
    if (typeof saved.organization === "string") setOrganization(saved.organization);
    if (typeof saved.learningGoal === "string") setLearningGoal(saved.learningGoal);
    if (typeof saved.publicProfile === "boolean") setPublicProfile(saved.publicProfile);
    if (typeof saved.notes === "string") setNotes(saved.notes);
    if (Array.isArray(saved.goals)) setGoals(saved.goals);
  }, []);

  useEffect(() => {
    const payload: PersistedState = {
      activeTab,
      displayName,
      role,
      organization,
      learningGoal,
      publicProfile,
      notes,
      goals,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }, [activeTab, displayName, role, organization, learningGoal, publicProfile, notes, goals]);

  const completed = modules.filter((module) => module.state === "COMPLETE").length;
  const active = modules.filter((module) => module.state === "ACTIVE").length;
  const overallProgress = Math.round(modules.reduce((sum, module) => sum + module.progress, 0) / modules.length);
  const scored = modules.filter((module) => typeof module.score === "number");
  const averageScore = Math.round(scored.reduce((sum, module) => sum + (module.score ?? 0), 0) / Math.max(scored.length, 1));
  const demonstrated = competencies.filter((item) => item.state === "DEMONSTRATED").length;
  const readiness = Math.round((completed / modules.length) * 70 + (demonstrated / competencies.length) * 30);

  const categories = useMemo(() => ["All", ...Array.from(new Set(modules.map((module) => module.category)))], []);
  const filteredModules = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return modules.filter((module) => {
      const matchesCategory = categoryFilter === "All" || module.category === categoryFilter;
      const matchesQuery = !normalized || `${module.title} ${module.category} ${module.description}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [query, categoryFilter]);

  const nextModule = modules.find((module) => module.state === "ACTIVE") ?? modules.find((module) => module.state === "LOCKED");

  function updateGoal(id: string, field: keyof Goal, value: string | number) {
    setGoals((current) => current.map((goal) => (goal.id === id ? { ...goal, [field]: value } : goal)));
  }

  function addGoal() {
    setGoals((current) => [
      ...current,
      { id: `goal-${Date.now()}`, title: "New learning goal", targetDate: "2026-08-15", progress: 0 },
    ]);
  }

  function removeGoal(id: string) {
    setGoals((current) => current.filter((goal) => goal.id !== id));
  }

  function exportProfile() {
    downloadJson("ta14-academy-student-profile.json", {
      exportedAt: new Date().toISOString(),
      learner: { displayName, role, organization, learningGoal, publicProfile },
      metrics: { overallProgress, averageScore, completed, active, readiness },
      modules,
      competencies,
      timeline,
      goals,
      notes,
      disclaimer: "Academy completion and credentials do not themselves authorize execution.",
    });
  }

  return (
    <main className="pageShell">
      <div className="aurora auroraOne" aria-hidden="true" />
      <div className="aurora auroraTwo" aria-hidden="true" />

      <header className="topbar">
        <Link href="/academy" className="brand">
          <span className="mark">TA-14</span>
          <span className="brandWords"><strong>Academy</strong><small>Student Profile</small></span>
        </Link>
        <nav className="topnav" aria-label="Academy navigation">
          <Link href="/academy/dashboard">Mission Control</Link>
          <Link href="/academy/credential-dashboard">Credentials</Link>
          <Link href="/academy/review">Review Workspace</Link>
        </nav>
        <div className="saveState"><span className="saveDot" />{savedAt ? `Saved ${savedAt}` : "Local profile"}</div>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Learner identity and progress record</p>
          <h1>Your Academy journey,<br /><em>preserved as evidence.</em></h1>
          <p className="heroText">Track curriculum progress, demonstrated competencies, learning goals, notes, and graduation readiness without confusing education records with execution authority.</p>
          <div className="heroActions">
            {nextModule && <Link className="primaryButton" href={nextModule.href}>Continue learning <span>→</span></Link>}
            <button className="secondaryButton" type="button" onClick={exportProfile}>Export learner record</button>
          </div>
        </div>
        <div className="identityCard">
          <div className="avatar" aria-hidden="true">{displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
          <div className="identityMain">
            {editing ? (
              <>
                <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} aria-label="Display name" />
                <input value={role} onChange={(event) => setRole(event.target.value)} aria-label="Role" />
                <input value={organization} onChange={(event) => setOrganization(event.target.value)} aria-label="Organization" />
              </>
            ) : (
              <><h2>{displayName}</h2><p>{role}</p><span>{organization}</span></>
            )}
          </div>
          <button className="textButton" type="button" onClick={() => setEditing((value) => !value)}>{editing ? "Done" : "Edit profile"}</button>
          <div className="identityRule"><span>Academy standing</span><strong>Active · Good standing</strong></div>
          <label className="toggleRow"><span><strong>Public verification preview</strong><small>Share only credential-facing profile fields.</small></span><input type="checkbox" checked={publicProfile} onChange={(event) => setPublicProfile(event.target.checked)} /></label>
        </div>
      </section>

      <section className="metricsGrid" aria-label="Learner metrics">
        <article><span>Overall progress</span><strong>{overallProgress}%</strong><small>{completed} completed · {active} active</small></article>
        <article><span>Average score</span><strong>{averageScore}%</strong><small>Across {scored.length} scored activities</small></article>
        <article><span>Competencies</span><strong>{demonstrated}/{competencies.length}</strong><small>Demonstrated at target level</small></article>
        <article><span>Graduation readiness</span><strong>{readiness}%</strong><small>Learning evidence only</small></article>
      </section>

      <section className="notice"><span>Important distinction</span><p>Profile progress, completion records, scores, badges, and credentials are educational evidence. They do not independently grant authority or authorize execution.</p></section>

      <div className="tabBar" role="tablist" aria-label="Student profile sections">
        {(Object.keys(tabLabels) as Tab[]).map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tabLabels[tab]}</button>)}
      </div>

      {activeTab === "overview" && (
        <section className="contentGrid">
          <div className="mainColumn">
            <article className="panel spotlightPanel">
              <div className="panelHeading"><div><p className="eyebrow">Next best action</p><h2>{nextModule?.title ?? "Pathway complete"}</h2></div><span className="statusPill activePill">{nextModule?.state ?? "COMPLETE"}</span></div>
              <p>{nextModule?.description ?? "All current Academy requirements have been completed."}</p>
              <div className="progressTrack"><span style={{ width: `${nextModule?.progress ?? 100}%` }} /></div>
              <div className="spotlightFooter"><span>{nextModule?.duration}</span>{nextModule && <Link href={nextModule.href}>Open activity →</Link>}</div>
            </article>

            <article className="panel">
              <div className="panelHeading"><div><p className="eyebrow">Current curriculum</p><h2>Learning pathway</h2></div><button className="textButton" type="button" onClick={() => setActiveTab("pathway")}>View all</button></div>
              <div className="moduleList compactList">{modules.slice(8, 12).map((module) => <ModuleRow key={module.id} module={module} />)}</div>
            </article>

            <article className="panel">
              <div className="panelHeading"><div><p className="eyebrow">Professional development</p><h2>Learning goals</h2></div><button className="textButton" type="button" onClick={addGoal}>Add goal</button></div>
              <div className="goalsList">{goals.map((goal) => <div className="goalCard" key={goal.id}><div className="goalFields"><input value={goal.title} onChange={(event) => updateGoal(goal.id, "title", event.target.value)} /><input type="date" value={goal.targetDate} onChange={(event) => updateGoal(goal.id, "targetDate", event.target.value)} /></div><div className="goalProgress"><input type="range" min="0" max="100" value={goal.progress} onChange={(event) => updateGoal(goal.id, "progress", Number(event.target.value))} /><strong>{goal.progress}%</strong><button type="button" onClick={() => removeGoal(goal.id)} aria-label={`Remove ${goal.title}`}>×</button></div></div>)}</div>
            </article>
          </div>

          <aside className="sideColumn">
            <article className="panel"><p className="eyebrow">Learning intent</p><h2>Why you are here</h2>{editing ? <textarea value={learningGoal} onChange={(event) => setLearningGoal(event.target.value)} /> : <p>{learningGoal}</p>}</article>
            <article className="panel"><p className="eyebrow">Competency posture</p><h2>At a glance</h2><div className="miniCompetencies">{competencies.slice(0, 5).map((item) => <div key={item.id}><span>{item.title}</span><div className="levelDots">{[1,2,3,4].map((level) => <i key={level} className={level <= item.level ? "filled" : ""} />)}</div></div>)}</div><button className="fullTextButton" type="button" onClick={() => setActiveTab("competencies")}>Open competency matrix</button></article>
            <article className="panel"><p className="eyebrow">Recent record</p><h2>Latest activity</h2><div className="miniTimeline">{timeline.slice(0,3).map((item) => <div key={item.id}><span>{item.date}</span><strong>{item.title}</strong><p>{item.detail}</p></div>)}</div></article>
          </aside>
        </section>
      )}

      {activeTab === "pathway" && (
        <section className="panel fullPanel">
          <div className="panelHeading pathwayHeading"><div><p className="eyebrow">Curriculum record</p><h2>Complete learning pathway</h2><p>Filter the record without changing the underlying completion evidence.</p></div><div className="filters"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search modules" />{categories.map((category) => <button key={category} type="button" className={categoryFilter === category ? "selected" : ""} onClick={() => setCategoryFilter(category)}>{category}</button>)}</div></div>
          <div className="moduleList">{filteredModules.map((module) => <ModuleRow key={module.id} module={module} />)}</div>
          {filteredModules.length === 0 && <div className="emptyState"><strong>No modules match this view.</strong><p>Change the search term or category filter.</p></div>}
        </section>
      )}

      {activeTab === "competencies" && (
        <section className="panel fullPanel">
          <div className="panelHeading"><div><p className="eyebrow">Evidence-backed capability</p><h2>Competency matrix</h2><p>Levels are based on preserved Academy evidence and remain subject to review.</p></div><Link href="/academy/credential-dashboard" className="textLink">Open credentials →</Link></div>
          <div className="competencyGrid">{competencies.map((item) => <article className="competencyCard" key={item.id}><div className="competencyTop"><span className={`statusPill ${item.state === "DEMONSTRATED" ? "completePill" : "activePill"}`}>{item.state.replaceAll("_", " ")}</span><small>{item.evidence} evidence records</small></div><h3>{item.title}</h3><p>{item.description}</p><div className="levelLine"><div><span>Current level</span><strong>{item.level} / {item.target}</strong></div><div className="levelDots large">{[1,2,3,4].map((level) => <i key={level} className={level <= item.level ? "filled" : ""} />)}</div></div></article>)}</div>
        </section>
      )}

      {activeTab === "timeline" && (
        <section className="panel fullPanel">
          <div className="panelHeading"><div><p className="eyebrow">Attributable history</p><h2>Learning timeline</h2><p>Chronological activity is preserved as a learner-facing record, not as execution authorization.</p></div><button className="secondaryButton smallButton" type="button" onClick={exportProfile}>Export record</button></div>
          <div className="timeline">{timeline.map((item) => <article key={item.id}><div className={`timelineIcon ${item.kind.toLowerCase()}`}>{item.kind.slice(0,1)}</div><div className="timelineBody"><span>{item.date} · {item.kind}</span><h3>{item.title}</h3><p>{item.detail}</p></div></article>)}</div>
        </section>
      )}

      {activeTab === "notes" && (
        <section className="notesLayout">
          <article className="panel"><p className="eyebrow">Private learner record</p><h2>Working notes</h2><p>Use this space for questions, uncertainties, review prompts, and concepts that require reinforcement.</p><textarea className="notesArea" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Write learner notes..." /><div className="notesMeta"><span>Saved locally in this browser.</span><button className="secondaryButton smallButton" type="button" onClick={() => setNotes("")}>Clear notes</button></div></article>
          <aside className="panel"><p className="eyebrow">Reflection prompts</p><h2>Review before consequence</h2><ul className="promptList"><li>What evidence would change my determination?</li><li>Which uncertainty am I tempted to hide?</li><li>Does the authority apply to this exact action now?</li><li>Can another reviewer reconstruct my reasoning?</li><li>What outcome evidence would prove the execution occurred as authorized?</li></ul></aside>
        </section>
      )}

      <footer className="footer"><div><strong>TA-14 Academy</strong><p>Learning records support competence. They do not replace evidence, authority, or runtime governance.</p></div><div><Link href="/academy">Academy home</Link><Link href="/academy/dashboard">Mission Control</Link><Link href="/academy/assessment">Assessment Center</Link></div></footer>

      <style jsx>{`
        :global(*){box-sizing:border-box} :global(body){margin:0;background:#07100d;color:#eaf4ef;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.pageShell{position:relative;min-height:100vh;overflow:hidden;background:radial-gradient(circle at 12% -5%,rgba(92,225,177,.13),transparent 27%),radial-gradient(circle at 92% 8%,rgba(105,146,255,.12),transparent 23%),linear-gradient(180deg,#07100d 0%,#08110e 48%,#060b09 100%);padding:0 5vw 70px}.aurora{position:fixed;border-radius:999px;filter:blur(100px);opacity:.15;pointer-events:none}.auroraOne{width:420px;height:420px;background:#58ddb0;top:12%;left:-260px}.auroraTwo{width:460px;height:460px;background:#668cff;right:-300px;top:32%}.topbar{position:relative;z-index:5;display:flex;align-items:center;justify-content:space-between;min-height:84px;border-bottom:1px solid rgba(183,223,204,.13)}.brand{display:flex;align-items:center;gap:14px;color:inherit;text-decoration:none}.mark{display:grid;place-items:center;width:54px;height:36px;border:1px solid rgba(111,236,185,.5);border-radius:9px;color:#8cf0c7;font-size:13px;font-weight:900;letter-spacing:.12em}.brandWords{display:flex;flex-direction:column}.brandWords strong{font-size:15px;letter-spacing:.04em}.brandWords small{margin-top:2px;color:#8ea69b;font-size:11px;letter-spacing:.09em;text-transform:uppercase}.topnav{display:flex;gap:26px}.topnav a,.footer a{color:#a8bab1;text-decoration:none;font-size:13px}.topnav a:hover,.footer a:hover{color:#8cf0c7}.saveState{display:flex;align-items:center;gap:8px;color:#7f958a;font-size:12px}.saveDot{width:7px;height:7px;border-radius:50%;background:#76e8b9;box-shadow:0 0 12px rgba(118,232,185,.8)}.hero{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(320px,.65fr);gap:54px;align-items:center;padding:78px 0 54px}.eyebrow{margin:0 0 12px;color:#79dcb4;font-size:11px;font-weight:800;letter-spacing:.17em;text-transform:uppercase}.hero h1{margin:0;max-width:820px;font-family:Georgia,serif;font-size:clamp(46px,6vw,82px);font-weight:500;line-height:.98;letter-spacing:-.045em}.hero h1 em{color:#83e7bf;font-weight:400}.heroText{max-width:700px;margin:26px 0 0;color:#a8bbb1;font-size:17px;line-height:1.75}.heroActions{display:flex;gap:12px;margin-top:32px}.primaryButton,.secondaryButton{display:inline-flex;align-items:center;justify-content:center;gap:18px;min-height:46px;border-radius:10px;padding:0 18px;font-size:13px;font-weight:800;text-decoration:none;cursor:pointer}.primaryButton{border:1px solid #7ee8bd;background:#7ee8bd;color:#07100d}.primaryButton:hover{background:#9df2d0}.secondaryButton{border:1px solid rgba(181,222,202,.25);background:rgba(255,255,255,.025);color:#dcece4}.secondaryButton:hover{border-color:rgba(126,232,189,.5)}.smallButton{min-height:38px;padding:0 13px;font-size:12px}.identityCard,.panel{border:1px solid rgba(178,218,199,.14);background:linear-gradient(150deg,rgba(18,35,29,.86),rgba(10,20,16,.9));box-shadow:0 25px 80px rgba(0,0,0,.2);backdrop-filter:blur(18px)}.identityCard{display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:center;border-radius:18px;padding:24px}.avatar{display:grid;place-items:center;width:62px;height:62px;border-radius:16px;background:linear-gradient(135deg,#7de7bc,#6d91ff);color:#07100d;font-size:20px;font-weight:900}.identityMain h2{margin:0;font-size:20px}.identityMain p{margin:5px 0 2px;color:#a9bbb2;font-size:13px}.identityMain span{color:#73887e;font-size:12px}.identityMain input{display:block;width:100%;margin:4px 0;border:1px solid rgba(168,211,191,.2);border-radius:7px;background:#09120f;color:#edf7f2;padding:8px}.textButton,.fullTextButton{border:0;background:transparent;color:#83e7bf;font-size:12px;font-weight:800;cursor:pointer}.identityRule{grid-column:1/-1;display:flex;justify-content:space-between;border-top:1px solid rgba(183,223,204,.11);padding-top:17px}.identityRule span{color:#82978d;font-size:12px}.identityRule strong{color:#d9ebe2;font-size:12px}.toggleRow{grid-column:1/-1;display:flex;justify-content:space-between;gap:16px;align-items:center;padding:14px;border-radius:11px;background:rgba(255,255,255,.025)}.toggleRow span{display:flex;flex-direction:column;gap:4px}.toggleRow strong{font-size:12px}.toggleRow small{color:#80948a;font-size:11px}.toggleRow input{accent-color:#7ee8bd}.metricsGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:0 0 18px}.metricsGrid article{border:1px solid rgba(178,218,199,.12);border-radius:13px;background:rgba(14,27,22,.72);padding:20px}.metricsGrid span{display:block;color:#81958b;font-size:11px;text-transform:uppercase;letter-spacing:.09em}.metricsGrid strong{display:block;margin:9px 0 5px;font-family:Georgia,serif;font-size:34px;font-weight:500}.metricsGrid small{color:#80958a}.notice{display:flex;gap:18px;align-items:center;margin:0 0 26px;border-left:3px solid #d7b96d;border-radius:0 10px 10px 0;background:rgba(215,185,109,.07);padding:14px 18px}.notice span{flex:0 0 auto;color:#e5cc8f;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.12em}.notice p{margin:0;color:#b5b7a9;font-size:13px;line-height:1.55}.tabBar{display:flex;gap:6px;overflow:auto;border-bottom:1px solid rgba(181,220,201,.13);margin-bottom:22px}.tabBar button{border:0;border-bottom:2px solid transparent;background:transparent;color:#82978d;padding:14px 16px;font-size:12px;font-weight:800;white-space:nowrap;cursor:pointer}.tabBar button.active{border-bottom-color:#7ee8bd;color:#e6f5ed}.contentGrid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(290px,.65fr);gap:18px}.mainColumn,.sideColumn{display:flex;flex-direction:column;gap:18px}.panel{border-radius:16px;padding:24px}.panel h2{margin:0;font-family:Georgia,serif;font-size:26px;font-weight:500}.panel>p{color:#9bafa5;line-height:1.65}.panelHeading{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:20px}.panelHeading p{margin:6px 0 0;color:#8fa49a;font-size:13px;line-height:1.5}.spotlightPanel{background:linear-gradient(145deg,rgba(19,45,35,.92),rgba(11,22,18,.92))}.statusPill{display:inline-flex;border-radius:999px;padding:6px 9px;font-size:9px;font-weight:900;letter-spacing:.1em}.activePill{background:rgba(111,146,255,.14);color:#9ab2ff}.completePill{background:rgba(111,232,183,.12);color:#84e9bf}.lockedPill{background:rgba(255,255,255,.06);color:#82968c}.progressTrack{height:7px;overflow:hidden;border-radius:999px;background:rgba(255,255,255,.06);margin:20px 0}.progressTrack span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#71dfb3,#7595ff)}.spotlightFooter{display:flex;justify-content:space-between;color:#7f958a;font-size:12px}.spotlightFooter a,.textLink{color:#83e7bf;text-decoration:none;font-size:12px;font-weight:800}.moduleList{display:flex;flex-direction:column;gap:10px}.moduleRow{display:grid;grid-template-columns:minmax(0,1fr) 120px 90px 34px;gap:14px;align-items:center;border:1px solid rgba(183,223,204,.1);border-radius:12px;padding:15px;background:rgba(255,255,255,.015)}.moduleRow:hover{border-color:rgba(126,232,189,.28)}.moduleTitle{display:flex;gap:12px;align-items:flex-start}.moduleIndex{display:grid;place-items:center;width:30px;height:30px;border-radius:8px;background:rgba(126,232,189,.08);color:#83e7bf;font-size:10px;font-weight:900}.moduleTitle h3{margin:0 0 4px;font-size:14px}.moduleTitle p{margin:0;color:#81958b;font-size:11px;line-height:1.45}.moduleProgress span{display:block;color:#7f958a;font-size:10px}.moduleProgress strong{display:block;margin-top:5px;font-size:12px}.moduleScore{text-align:right}.moduleScore span{display:block;color:#789087;font-size:10px}.moduleScore strong{font-size:13px}.moduleRow>a{display:grid;place-items:center;width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,.035);color:#8debc5;text-decoration:none}.goalsList{display:flex;flex-direction:column;gap:10px}.goalCard{border:1px solid rgba(183,223,204,.1);border-radius:11px;padding:13px}.goalFields{display:grid;grid-template-columns:1fr auto;gap:10px}.goalFields input,.filters input,.panel textarea,.notesArea{border:1px solid rgba(178,218,199,.17);border-radius:9px;background:#09120f;color:#e8f3ed;padding:10px;font:inherit}.goalFields input:first-child{font-weight:700}.goalProgress{display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:center;margin-top:10px}.goalProgress input{accent-color:#75e1b6}.goalProgress strong{font-size:12px}.goalProgress button{border:0;background:transparent;color:#c87f7f;font-size:20px;cursor:pointer}.miniCompetencies{display:flex;flex-direction:column;gap:14px;margin-top:20px}.miniCompetencies>div{display:flex;justify-content:space-between;gap:14px}.miniCompetencies span{color:#adbbb4;font-size:12px}.levelDots{display:flex;gap:5px}.levelDots i{display:block;width:9px;height:9px;border-radius:3px;background:rgba(255,255,255,.07)}.levelDots i.filled{background:#76e4b8}.levelDots.large i{width:32px;height:7px;border-radius:99px}.fullTextButton{width:100%;margin-top:22px;border:1px solid rgba(126,232,189,.2);border-radius:9px;padding:11px}.miniTimeline{display:flex;flex-direction:column;gap:18px;margin-top:18px}.miniTimeline div{border-left:1px solid rgba(126,232,189,.22);padding-left:13px}.miniTimeline span{color:#71dcb1;font-size:10px}.miniTimeline strong{display:block;margin:5px 0;font-size:12px}.miniTimeline p{margin:0;color:#80958a;font-size:11px;line-height:1.5}.fullPanel{min-height:520px}.pathwayHeading{align-items:flex-end}.filters{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.filters input{width:180px}.filters button{border:1px solid rgba(181,220,201,.12);border-radius:999px;background:transparent;color:#8da198;padding:8px 11px;font-size:10px;cursor:pointer}.filters button.selected{border-color:#70ddb1;background:rgba(112,221,177,.09);color:#83e7bf}.emptyState{text-align:center;padding:70px;color:#879b91}.competencyGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.competencyCard{border:1px solid rgba(183,223,204,.1);border-radius:13px;background:rgba(255,255,255,.014);padding:18px}.competencyTop,.levelLine{display:flex;justify-content:space-between;gap:12px;align-items:center}.competencyTop small{color:#758a80}.competencyCard h3{margin:16px 0 8px}.competencyCard p{min-height:48px;margin:0;color:#879b91;font-size:12px;line-height:1.55}.levelLine{border-top:1px solid rgba(183,223,204,.09);margin-top:17px;padding-top:15px}.levelLine span{display:block;color:#758a80;font-size:10px}.levelLine strong{display:block;margin-top:3px;font-size:12px}.timeline{position:relative;display:flex;flex-direction:column;gap:0}.timeline:before{content:"";position:absolute;left:20px;top:20px;bottom:20px;width:1px;background:rgba(126,232,189,.18)}.timeline article{position:relative;display:grid;grid-template-columns:42px 1fr;gap:17px;padding:12px 0}.timelineIcon{position:relative;z-index:1;display:grid;place-items:center;width:42px;height:42px;border-radius:12px;background:#12241d;color:#85e9c0;font-size:11px;font-weight:900}.timelineBody{border:1px solid rgba(183,223,204,.1);border-radius:12px;padding:16px}.timelineBody span{color:#6fd9ad;font-size:10px;font-weight:800;letter-spacing:.08em}.timelineBody h3{margin:7px 0 5px;font-size:14px}.timelineBody p{margin:0;color:#84998e;font-size:12px;line-height:1.55}.notesLayout{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(280px,.6fr);gap:18px}.notesArea{width:100%;min-height:360px;resize:vertical;line-height:1.7}.notesMeta{display:flex;justify-content:space-between;align-items:center;margin-top:12px;color:#758a80;font-size:11px}.promptList{margin:20px 0 0;padding:0;list-style:none}.promptList li{border-bottom:1px solid rgba(183,223,204,.09);padding:14px 0;color:#a6b8af;font-size:12px;line-height:1.55}.footer{display:flex;justify-content:space-between;gap:30px;border-top:1px solid rgba(183,223,204,.12);margin-top:30px;padding-top:28px}.footer strong{font-size:13px}.footer p{max-width:650px;margin:7px 0 0;color:#758a80;font-size:11px}.footer>div:last-child{display:flex;gap:20px;align-items:center}
        @media(max-width:1050px){.hero{grid-template-columns:1fr}.metricsGrid{grid-template-columns:repeat(2,1fr)}.contentGrid,.notesLayout{grid-template-columns:1fr}.topnav{display:none}.competencyGrid{grid-template-columns:1fr}.pathwayHeading{align-items:flex-start;flex-direction:column}.filters{justify-content:flex-start}}
        @media(max-width:720px){.pageShell{padding:0 18px 50px}.topbar{min-height:70px}.saveState{display:none}.hero{padding:50px 0 35px}.hero h1{font-size:46px}.heroActions{flex-direction:column}.identityCard{grid-template-columns:auto 1fr}.identityCard>.textButton{grid-column:1/-1;text-align:left}.metricsGrid{grid-template-columns:1fr 1fr}.notice{align-items:flex-start;flex-direction:column}.moduleRow{grid-template-columns:1fr auto}.moduleProgress,.moduleScore{display:none}.goalFields{grid-template-columns:1fr}.panel{padding:18px}.footer{flex-direction:column}.footer>div:last-child{flex-wrap:wrap}}
        @media(max-width:470px){.metricsGrid{grid-template-columns:1fr}.identityCard{grid-template-columns:1fr}.avatar{width:54px;height:54px}.identityRule,.toggleRow{grid-column:1}.hero h1{font-size:39px}.tabBar button{padding-left:10px;padding-right:10px}.filters input{width:100%}.competencyCard p{min-height:0}}
      `}</style>
    </main>
  );
}

function ModuleRow({ module }: { module: Module }) {
  const pillClass = module.state === "COMPLETE" ? "completePill" : module.state === "ACTIVE" ? "activePill" : "lockedPill";
  return (
    <article className="moduleRow">
      <div className="moduleTitle"><span className="moduleIndex">{module.id.replace("m", "").padStart(2, "0")}</span><div><h3>{module.title}</h3><p>{module.category} · {module.duration}</p></div></div>
      <div className="moduleProgress"><span>Progress</span><strong>{module.progress}%</strong></div>
      <div className="moduleScore"><span className={`statusPill ${pillClass}`}>{module.state}</span><strong>{module.score === null ? "—" : `${module.score}%`}</strong></div>
      <Link href={module.href} aria-label={`Open ${module.title}`}>→</Link>
    </article>
  );
}
