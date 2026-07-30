"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type BuilderTab = "outline" | "content" | "checks" | "settings" | "preview";
type LessonStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
type BlockKind = "TEXT" | "CALLOUT" | "SCENARIO" | "CHECKLIST" | "CODE" | "REFLECTION";
type CheckKind = "SINGLE" | "MULTI" | "BOOLEAN" | "SHORT";
type CompetencyLevel = "INTRODUCE" | "PRACTICE" | "DEMONSTRATE";

type ContentBlock = {
  id: string;
  kind: BlockKind;
  title: string;
  body: string;
  tone?: "INFO" | "CAUTION" | "SUCCESS";
};

type KnowledgeCheck = {
  id: string;
  kind: CheckKind;
  prompt: string;
  options: string[];
  correct: number[];
  rationale: string;
  required: boolean;
};

type CompetencyMap = {
  id: string;
  title: string;
  level: CompetencyLevel;
  evidenceRequired: boolean;
};

type LessonState = {
  title: string;
  slug: string;
  summary: string;
  status: LessonStatus;
  duration: number;
  difficulty: "FOUNDATION" | "APPLIED" | "ADVANCED";
  audience: string;
  prerequisites: string[];
  objectives: string[];
  blocks: ContentBlock[];
  checks: KnowledgeCheck[];
  competencies: CompetencyMap[];
  passingScore: number;
  allowRetry: boolean;
  requireSequential: boolean;
  certificateEligible: boolean;
  updatedAt: string;
};

type PersistedBuilderState = {
  tab: BuilderTab;
  selectedBlockId: string;
  selectedCheckId: string;
  lesson: LessonState;
};

const STORAGE_KEY = "ta14-academy-lesson-builder-v1";

const initialLesson: LessonState = {
  title: "Continuity: Preserving the Governing Chain",
  slug: "continuity-preserving-the-governing-chain",
  summary:
    "An applied lesson on identifying, documenting, and resolving breaks between governing authority, evidence, determination, execution, and outcome.",
  status: "DRAFT",
  duration: 48,
  difficulty: "APPLIED",
  audience: "Governance reviewers, route authors, compliance leads, and operational approvers",
  prerequisites: ["What Is a Governance Route?", "Reality and Record"],
  objectives: [
    "Distinguish a continuity gap from an ordinary documentation defect.",
    "Trace the governing chain from authority through verified outcome.",
    "Identify which missing link prevents a route from proceeding.",
    "Create a reviewable continuity finding and remediation request.",
  ],
  blocks: [
    {
      id: "block-1",
      kind: "TEXT",
      title: "Why continuity matters",
      body:
        "A governance route is only as reliable as the chain that connects its source of authority to the action ultimately taken. Continuity is not a claim that every event is perfect. It is the requirement that each governing transition is visible, attributable, and reviewable.",
    },
    {
      id: "block-2",
      kind: "CALLOUT",
      title: "Core rule",
      body:
        "A route must not cross an unexplained break. When the chain cannot show how one state became the next, execution pauses until the missing transition is resolved or an authorized exception is recorded.",
      tone: "CAUTION",
    },
    {
      id: "block-3",
      kind: "CHECKLIST",
      title: "Continuity review sequence",
      body:
        "1. Identify the governing authority.\n2. Confirm the evidence admitted under that authority.\n3. Verify the determination produced from the admitted record.\n4. Confirm the approved execution instruction.\n5. Match the runtime action to that instruction.\n6. Preserve the outcome and verification record.",
    },
    {
      id: "block-4",
      kind: "SCENARIO",
      title: "Scenario: the missing approval",
      body:
        "A payment correction was executed after an analyst updated the calculation record. The evidence and calculation are preserved, but the approval event does not appear in the route history. The system log shows who initiated execution, not who authorized the corrected amount. Determine whether the route has continuity and what must happen next.",
    },
    {
      id: "block-5",
      kind: "REFLECTION",
      title: "Reviewer reflection",
      body:
        "What evidence would allow an independent reviewer to distinguish an omitted approval record from an approval that never occurred? Write the minimum remediation request you would issue.",
    },
  ],
  checks: [
    {
      id: "check-1",
      kind: "SINGLE",
      prompt: "Which condition most clearly establishes a continuity break?",
      options: [
        "A record contains a minor formatting inconsistency.",
        "The route cannot show how an admitted record produced the approved determination.",
        "A reviewer prefers a different wording style.",
        "The outcome was completed earlier than expected.",
      ],
      correct: [1],
      rationale:
        "Continuity depends on visible governing transitions. A missing connection between admitted evidence and determination prevents independent reconstruction of the route.",
      required: true,
    },
    {
      id: "check-2",
      kind: "MULTI",
      prompt: "Which records can help establish execution continuity? Select all that apply.",
      options: [
        "Approved execution instruction",
        "Runtime event log",
        "Outcome verification record",
        "An unrelated policy document",
      ],
      correct: [0, 1, 2],
      rationale:
        "The instruction, runtime event, and verified outcome together allow reviewers to test whether execution corresponded to the approved decision.",
      required: true,
    },
    {
      id: "check-3",
      kind: "BOOLEAN",
      prompt: "A continuity gap may be ignored when the final result appears reasonable.",
      options: ["True", "False"],
      correct: [1],
      rationale:
        "A reasonable-looking outcome does not cure a missing governing transition. The route must remain reviewable on its own record.",
      required: true,
    },
  ],
  competencies: [
    {
      id: "comp-1",
      title: "Trace governed state transitions",
      level: "PRACTICE",
      evidenceRequired: true,
    },
    {
      id: "comp-2",
      title: "Identify material continuity breaks",
      level: "DEMONSTRATE",
      evidenceRequired: true,
    },
    {
      id: "comp-3",
      title: "Draft reviewable remediation findings",
      level: "PRACTICE",
      evidenceRequired: true,
    },
  ],
  passingScore: 80,
  allowRetry: true,
  requireSequential: true,
  certificateEligible: true,
  updatedAt: new Date().toISOString(),
};

const blockLabels: Record<BlockKind, string> = {
  TEXT: "Text",
  CALLOUT: "Callout",
  SCENARIO: "Scenario",
  CHECKLIST: "Checklist",
  CODE: "Code / record",
  REFLECTION: "Reflection",
};

const checkLabels: Record<CheckKind, string> = {
  SINGLE: "Single choice",
  MULTI: "Multiple choice",
  BOOLEAN: "True / false",
  SHORT: "Short response",
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function LessonBuilderPage() {
  const [tab, setTab] = useState<BuilderTab>("outline");
  const [lesson, setLesson] = useState<LessonState>(initialLesson);
  const [selectedBlockId, setSelectedBlockId] = useState(initialLesson.blocks[0].id);
  const [selectedCheckId, setSelectedCheckId] = useState(initialLesson.checks[0].id);
  const [savedMessage, setSavedMessage] = useState("Ready");
  const [importError, setImportError] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistedBuilderState;
      if (parsed.lesson?.title) {
        setLesson(parsed.lesson);
        setTab(parsed.tab || "outline");
        setSelectedBlockId(parsed.selectedBlockId || parsed.lesson.blocks[0]?.id || "");
        setSelectedCheckId(parsed.selectedCheckId || parsed.lesson.checks[0]?.id || "");
      }
    } catch {
      setSavedMessage("Local draft could not be restored");
    }
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const nextLesson = { ...lesson, updatedAt: new Date().toISOString() };
      const persisted: PersistedBuilderState = {
        tab,
        selectedBlockId,
        selectedCheckId,
        lesson: nextLesson,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
      setSavedMessage(`Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [lesson, tab, selectedBlockId, selectedCheckId]);

  const selectedBlock = lesson.blocks.find((block) => block.id === selectedBlockId) || lesson.blocks[0];
  const selectedCheck = lesson.checks.find((check) => check.id === selectedCheckId) || lesson.checks[0];

  const completion = useMemo(() => {
    const checks = [
      lesson.title.trim().length > 4,
      lesson.summary.trim().length > 20,
      lesson.objectives.length >= 2,
      lesson.blocks.length >= 3,
      lesson.checks.length >= 1,
      lesson.competencies.length >= 1,
      lesson.duration > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [lesson]);

  const wordCount = useMemo(() => {
    const text = [lesson.title, lesson.summary, ...lesson.objectives, ...lesson.blocks.flatMap((block) => [block.title, block.body])].join(" ");
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [lesson]);

  const estimatedMinutes = Math.max(1, Math.round(wordCount / 180) + lesson.checks.length * 2);

  function patchLesson(patch: Partial<LessonState>) {
    setLesson((current) => ({ ...current, ...patch }));
  }

  function updateBlock(id: string, patch: Partial<ContentBlock>) {
    patchLesson({ blocks: lesson.blocks.map((block) => (block.id === id ? { ...block, ...patch } : block)) });
  }

  function addBlock(kind: BlockKind) {
    const block: ContentBlock = {
      id: makeId("block"),
      kind,
      title: `New ${blockLabels[kind]}`,
      body: "Add lesson content here.",
      ...(kind === "CALLOUT" ? { tone: "INFO" as const } : {}),
    };
    patchLesson({ blocks: [...lesson.blocks, block] });
    setSelectedBlockId(block.id);
    setTab("content");
  }

  function removeBlock(id: string) {
    const next = lesson.blocks.filter((block) => block.id !== id);
    patchLesson({ blocks: next });
    if (selectedBlockId === id) setSelectedBlockId(next[0]?.id || "");
  }

  function moveBlock(id: string, direction: -1 | 1) {
    const index = lesson.blocks.findIndex((block) => block.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= lesson.blocks.length) return;
    const next = [...lesson.blocks];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    patchLesson({ blocks: next });
  }

  function addObjective() {
    patchLesson({ objectives: [...lesson.objectives, "New measurable learning objective"] });
  }

  function addCheck(kind: CheckKind) {
    const next: KnowledgeCheck = {
      id: makeId("check"),
      kind,
      prompt: "Enter a knowledge-check prompt.",
      options: kind === "BOOLEAN" ? ["True", "False"] : kind === "SHORT" ? [] : ["Option A", "Option B"],
      correct: kind === "SHORT" ? [] : [0],
      rationale: "Explain why the expected response is correct.",
      required: true,
    };
    patchLesson({ checks: [...lesson.checks, next] });
    setSelectedCheckId(next.id);
    setTab("checks");
  }

  function updateCheck(id: string, patch: Partial<KnowledgeCheck>) {
    patchLesson({ checks: lesson.checks.map((check) => (check.id === id ? { ...check, ...patch } : check)) });
  }

  function removeCheck(id: string) {
    const next = lesson.checks.filter((check) => check.id !== id);
    patchLesson({ checks: next });
    if (selectedCheckId === id) setSelectedCheckId(next[0]?.id || "");
  }

  function resetDraft() {
    if (!window.confirm("Reset the lesson builder to the provided TA-14 sample?")) return;
    setLesson(initialLesson);
    setSelectedBlockId(initialLesson.blocks[0].id);
    setSelectedCheckId(initialLesson.checks[0].id);
    setTab("outline");
    setSavedMessage("Sample restored");
  }

  function importLesson(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as LessonState;
        if (!parsed.title || !Array.isArray(parsed.blocks) || !Array.isArray(parsed.checks)) {
          throw new Error("Unsupported lesson file");
        }
        setLesson({ ...parsed, updatedAt: new Date().toISOString() });
        setSelectedBlockId(parsed.blocks[0]?.id || "");
        setSelectedCheckId(parsed.checks[0]?.id || "");
        setImportError("");
        setSavedMessage("Lesson imported");
      } catch (error) {
        setImportError(error instanceof Error ? error.message : "Unable to import lesson");
      }
    };
    reader.readAsText(file);
  }

  const tabs: Array<{ id: BuilderTab; label: string }> = [
    { id: "outline", label: "Outline" },
    { id: "content", label: "Content" },
    { id: "checks", label: "Checks" },
    { id: "settings", label: "Settings" },
    { id: "preview", label: "Preview" },
  ];

  return (
    <main className="lesson-builder-shell">
      <style jsx global>{`
        :root {
          color-scheme: dark;
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: #07111f; color: #eef6ff; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        button, input, textarea, select { font: inherit; }
        button { cursor: pointer; }
        a { color: inherit; }
        .lesson-builder-shell { min-height: 100vh; background: radial-gradient(circle at top left, rgba(31, 125, 255, .17), transparent 33%), linear-gradient(180deg, #081423 0%, #07101c 100%); }
        .topbar { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 14px 24px; border-bottom: 1px solid rgba(150,190,230,.16); background: rgba(6,15,28,.9); backdrop-filter: blur(18px); }
        .brand { display: flex; align-items: center; gap: 12px; }
        .brand-mark { display:grid; place-items:center; width:38px; height:38px; border-radius:11px; font-weight:900; background:linear-gradient(135deg,#28a4ff,#645cff); box-shadow:0 10px 28px rgba(38,123,255,.28); }
        .eyebrow { margin:0 0 3px; color:#7fb9ec; font-size:11px; letter-spacing:.14em; text-transform:uppercase; font-weight:800; }
        .brand h1 { margin:0; font-size:16px; }
        .top-actions { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .status-pill, .metric-pill { border:1px solid rgba(150,190,230,.18); background:rgba(255,255,255,.045); border-radius:999px; padding:8px 11px; font-size:12px; color:#b9d2e8; }
        .btn { border:1px solid rgba(143,187,228,.22); border-radius:10px; padding:9px 13px; background:rgba(255,255,255,.05); color:#edf7ff; font-weight:750; }
        .btn:hover { background:rgba(255,255,255,.09); }
        .btn.primary { border-color:#408fff; background:linear-gradient(135deg,#1687ff,#645cff); }
        .btn.danger { color:#ffb5bd; border-color:rgba(255,100,120,.28); }
        .workspace { display:grid; grid-template-columns:280px minmax(0,1fr); min-height:calc(100vh - 67px); }
        .sidebar { padding:20px 16px; border-right:1px solid rgba(150,190,230,.13); background:rgba(8,19,34,.7); }
        .backlink { display:inline-flex; gap:8px; text-decoration:none; color:#91b9dc; font-size:13px; margin:0 8px 18px; }
        .lesson-card { padding:16px; border:1px solid rgba(141,183,222,.16); border-radius:14px; background:rgba(255,255,255,.035); }
        .lesson-card h2 { margin:6px 0 8px; font-size:17px; line-height:1.35; }
        .lesson-card p { margin:0; color:#96b2cb; font-size:12px; line-height:1.5; }
        .progress-track { height:7px; background:#12243a; border-radius:99px; overflow:hidden; margin:14px 0 8px; }
        .progress-fill { height:100%; background:linear-gradient(90deg,#1aa5ff,#6d63ff); }
        .nav-tabs { display:grid; gap:7px; margin-top:18px; }
        .nav-tab { width:100%; text-align:left; border:0; border-radius:10px; padding:11px 12px; color:#9ebad2; background:transparent; font-weight:750; }
        .nav-tab:hover, .nav-tab.active { color:#fff; background:rgba(72,139,229,.16); }
        .sidebar-section { margin-top:22px; padding:0 8px; }
        .sidebar-section h3 { margin:0 0 10px; color:#7fa4c4; font-size:11px; letter-spacing:.12em; text-transform:uppercase; }
        .quick-stat { display:flex; justify-content:space-between; gap:12px; padding:8px 0; border-bottom:1px solid rgba(150,190,230,.08); color:#a9c0d5; font-size:12px; }
        .quick-stat strong { color:#f2f8ff; }
        .editor { padding:28px; min-width:0; }
        .page-head { display:flex; justify-content:space-between; gap:24px; align-items:flex-start; margin-bottom:22px; }
        .page-head h2 { margin:4px 0 8px; font-size:30px; letter-spacing:-.03em; }
        .page-head p { margin:0; color:#9eb6cc; max-width:760px; line-height:1.6; }
        .grid { display:grid; gap:16px; }
        .grid.two { grid-template-columns:repeat(2,minmax(0,1fr)); }
        .panel { border:1px solid rgba(145,187,225,.15); border-radius:16px; background:rgba(255,255,255,.035); padding:18px; box-shadow:0 20px 60px rgba(0,0,0,.12); }
        .panel h3 { margin:0 0 6px; font-size:17px; }
        .panel-sub { margin:0 0 16px; color:#91abc2; font-size:13px; line-height:1.5; }
        .field { display:grid; gap:7px; margin-bottom:14px; }
        .field:last-child { margin-bottom:0; }
        .field label { color:#a9c2d8; font-size:12px; font-weight:750; }
        .input, .textarea, .select { width:100%; border:1px solid rgba(145,187,225,.18); border-radius:10px; padding:10px 11px; background:#0a1728; color:#f3f8ff; outline:none; }
        .input:focus, .textarea:focus, .select:focus { border-color:#388cff; box-shadow:0 0 0 3px rgba(56,140,255,.12); }
        .textarea { min-height:110px; resize:vertical; line-height:1.55; }
        .row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
        .objective { display:grid; grid-template-columns:1fr auto; gap:8px; margin-bottom:8px; }
        .chip-list { display:flex; flex-wrap:wrap; gap:8px; }
        .chip { display:inline-flex; align-items:center; gap:7px; border:1px solid rgba(142,183,221,.18); border-radius:999px; padding:7px 10px; color:#bdd1e3; background:rgba(255,255,255,.035); font-size:12px; }
        .chip button { border:0; background:transparent; color:#ff9ca8; padding:0; }
        .block-layout, .check-layout { display:grid; grid-template-columns:300px minmax(0,1fr); gap:16px; }
        .list-panel { border:1px solid rgba(145,187,225,.14); border-radius:15px; background:rgba(255,255,255,.025); padding:12px; max-height:690px; overflow:auto; }
        .list-item { width:100%; display:block; text-align:left; border:1px solid transparent; border-radius:11px; padding:12px; margin-bottom:8px; color:#a9bfd3; background:rgba(255,255,255,.025); }
        .list-item.active { border-color:rgba(71,143,255,.55); color:#fff; background:rgba(57,124,220,.14); }
        .list-item strong { display:block; margin-bottom:5px; font-size:13px; }
        .list-item span { display:block; color:#7898b4; font-size:11px; text-transform:uppercase; letter-spacing:.08em; }
        .toolbar { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
        .mini { border:1px solid rgba(145,187,225,.16); border-radius:8px; background:rgba(255,255,255,.04); color:#bcd0e2; padding:7px 9px; font-size:12px; }
        .divider { height:1px; background:rgba(145,187,225,.1); margin:16px 0; }
        .toggle-row { display:flex; justify-content:space-between; gap:20px; align-items:center; padding:12px 0; border-bottom:1px solid rgba(145,187,225,.09); }
        .toggle-row:last-child { border-bottom:0; }
        .toggle-copy strong { display:block; font-size:13px; }
        .toggle-copy span { display:block; margin-top:4px; color:#88a4bc; font-size:12px; }
        .switch { width:46px; height:25px; padding:3px; border:0; border-radius:99px; background:#1b324a; }
        .switch span { display:block; width:19px; height:19px; border-radius:50%; background:#9fb8cd; transition:.2s; }
        .switch.on { background:#2f78e8; }
        .switch.on span { transform:translateX(21px); background:#fff; }
        .preview-page { max-width:860px; margin:0 auto; border:1px solid rgba(145,187,225,.16); border-radius:18px; background:#0a1728; overflow:hidden; }
        .preview-hero { padding:34px; background:linear-gradient(135deg,rgba(27,126,242,.25),rgba(102,79,220,.18)); border-bottom:1px solid rgba(145,187,225,.13); }
        .preview-hero h2 { margin:8px 0 10px; font-size:34px; }
        .preview-meta { display:flex; flex-wrap:wrap; gap:8px; color:#b9cce0; font-size:12px; }
        .preview-body { padding:34px; }
        .preview-block { margin-bottom:26px; }
        .preview-block h3 { margin:0 0 10px; font-size:20px; }
        .preview-block p, .preview-block pre { margin:0; color:#b8cada; line-height:1.75; white-space:pre-wrap; }
        .preview-callout { border-left:4px solid #4b9dff; border-radius:10px; background:rgba(54,130,231,.12); padding:18px; }
        .preview-scenario { border:1px solid rgba(171,139,255,.32); border-radius:14px; background:rgba(103,74,189,.1); padding:18px; }
        .check-card { border:1px solid rgba(145,187,225,.15); border-radius:14px; padding:17px; margin-top:14px; background:rgba(255,255,255,.025); }
        .option { display:flex; gap:10px; align-items:flex-start; padding:9px 0; color:#afc3d5; }
        .empty { padding:34px; text-align:center; color:#87a2ba; }
        .notice { border:1px solid rgba(255,176,71,.25); border-radius:10px; padding:10px 12px; background:rgba(255,154,45,.08); color:#ffd0a1; font-size:12px; margin-bottom:14px; }
        @media (max-width: 980px) {
          .workspace { grid-template-columns:1fr; }
          .sidebar { border-right:0; border-bottom:1px solid rgba(150,190,230,.13); }
          .nav-tabs { grid-template-columns:repeat(5,minmax(0,1fr)); }
          .nav-tab { text-align:center; padding:9px 6px; font-size:12px; }
          .sidebar-section { display:none; }
          .block-layout, .check-layout { grid-template-columns:1fr; }
          .list-panel { max-height:280px; }
        }
        @media (max-width: 700px) {
          .topbar { align-items:flex-start; padding:12px 14px; }
          .top-actions .metric-pill, .top-actions .status-pill { display:none; }
          .editor { padding:20px 14px; }
          .grid.two { grid-template-columns:1fr; }
          .page-head { display:block; }
          .page-head h2 { font-size:25px; }
          .nav-tabs { grid-template-columns:repeat(3,minmax(0,1fr)); }
          .preview-hero, .preview-body { padding:22px; }
          .preview-hero h2 { font-size:27px; }
        }
      `}</style>

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">14</div>
          <div>
            <p className="eyebrow">TA-14 Academy</p>
            <h1>Lesson Builder</h1>
          </div>
        </div>
        <div className="top-actions">
          <span className="metric-pill">{wordCount} words</span>
          <span className="metric-pill">~{estimatedMinutes} min read</span>
          <span className="status-pill">{savedMessage}</span>
          <button className="btn" onClick={() => downloadJson(`${lesson.slug || "lesson"}.json`, lesson)}>Export JSON</button>
          <button className="btn primary" onClick={() => patchLesson({ status: lesson.status === "PUBLISHED" ? "DRAFT" : "IN_REVIEW" })}>
            {lesson.status === "PUBLISHED" ? "Create revision" : "Submit for review"}
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <Link className="backlink" href="/academy/instructor-console">← Instructor Console</Link>
          <div className="lesson-card">
            <p className="eyebrow">Current lesson</p>
            <h2>{lesson.title || "Untitled lesson"}</h2>
            <p>{lesson.status.replace("_", " ")} · {lesson.difficulty}</p>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${completion}%` }} /></div>
            <p>{completion}% publishing readiness</p>
          </div>

          <nav className="nav-tabs" aria-label="Lesson builder sections">
            {tabs.map((item) => (
              <button key={item.id} className={`nav-tab ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-section">
            <h3>Lesson inventory</h3>
            <div className="quick-stat"><span>Objectives</span><strong>{lesson.objectives.length}</strong></div>
            <div className="quick-stat"><span>Content blocks</span><strong>{lesson.blocks.length}</strong></div>
            <div className="quick-stat"><span>Knowledge checks</span><strong>{lesson.checks.length}</strong></div>
            <div className="quick-stat"><span>Competencies</span><strong>{lesson.competencies.length}</strong></div>
          </div>
        </aside>

        <section className="editor">
          {tab === "outline" && (
            <>
              <div className="page-head">
                <div>
                  <p className="eyebrow">Structure and intent</p>
                  <h2>Lesson outline</h2>
                  <p>Define what learners will understand, practice, and demonstrate before composing the lesson itself.</p>
                </div>
              </div>
              <div className="grid two">
                <div className="panel">
                  <h3>Identity</h3>
                  <p className="panel-sub">The title and summary appear throughout the Academy catalog and learner pathway.</p>
                  <div className="field"><label>Lesson title</label><input className="input" value={lesson.title} onChange={(event) => patchLesson({ title: event.target.value })} /></div>
                  <div className="field"><label>URL slug</label><input className="input" value={lesson.slug} onChange={(event) => patchLesson({ slug: event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} /></div>
                  <div className="field"><label>Summary</label><textarea className="textarea" value={lesson.summary} onChange={(event) => patchLesson({ summary: event.target.value })} /></div>
                </div>
                <div className="panel">
                  <h3>Delivery profile</h3>
                  <p className="panel-sub">Set the expected learner context and instructional load.</p>
                  <div className="field"><label>Audience</label><textarea className="textarea" value={lesson.audience} onChange={(event) => patchLesson({ audience: event.target.value })} /></div>
                  <div className="grid two">
                    <div className="field"><label>Difficulty</label><select className="select" value={lesson.difficulty} onChange={(event) => patchLesson({ difficulty: event.target.value as LessonState["difficulty"] })}><option>FOUNDATION</option><option>APPLIED</option><option>ADVANCED</option></select></div>
                    <div className="field"><label>Target minutes</label><input className="input" type="number" min={1} value={lesson.duration} onChange={(event) => patchLesson({ duration: Number(event.target.value) })} /></div>
                  </div>
                </div>
                <div className="panel">
                  <div className="row" style={{ justifyContent: "space-between" }}><div><h3>Learning objectives</h3><p className="panel-sub">Use observable verbs and define what success looks like.</p></div><button className="btn" onClick={addObjective}>Add objective</button></div>
                  {lesson.objectives.map((objective, index) => (
                    <div className="objective" key={`${index}-${objective.slice(0, 12)}`}>
                      <input className="input" value={objective} onChange={(event) => patchLesson({ objectives: lesson.objectives.map((item, itemIndex) => itemIndex === index ? event.target.value : item) })} />
                      <button className="btn danger" onClick={() => patchLesson({ objectives: lesson.objectives.filter((_, itemIndex) => itemIndex !== index) })}>Remove</button>
                    </div>
                  ))}
                </div>
                <div className="panel">
                  <h3>Prerequisites</h3>
                  <p className="panel-sub">Sequence the lesson after concepts learners must already know.</p>
                  <div className="chip-list">
                    {lesson.prerequisites.map((item, index) => <span className="chip" key={`${item}-${index}`}>{item}<button onClick={() => patchLesson({ prerequisites: lesson.prerequisites.filter((_, i) => i !== index) })}>×</button></span>)}
                  </div>
                  <div className="row" style={{ marginTop: 14 }}>
                    <button className="btn" onClick={() => patchLesson({ prerequisites: [...lesson.prerequisites, "New prerequisite"] })}>Add prerequisite</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === "content" && (
            <>
              <div className="page-head">
                <div><p className="eyebrow">Instructional composition</p><h2>Content blocks</h2><p>Build the learner experience from focused, reorderable blocks rather than one uninterrupted wall of text.</p></div>
              </div>
              <div className="toolbar">
                {(Object.keys(blockLabels) as BlockKind[]).map((kind) => <button className="mini" key={kind} onClick={() => addBlock(kind)}>+ {blockLabels[kind]}</button>)}
              </div>
              <div className="block-layout">
                <div className="list-panel">
                  {lesson.blocks.map((block, index) => (
                    <button key={block.id} className={`list-item ${selectedBlock?.id === block.id ? "active" : ""}`} onClick={() => setSelectedBlockId(block.id)}>
                      <span>{index + 1}. {blockLabels[block.kind]}</span><strong>{block.title}</strong>
                    </button>
                  ))}
                  {!lesson.blocks.length && <div className="empty">Add the first content block.</div>}
                </div>
                <div className="panel">
                  {selectedBlock ? (
                    <>
                      <div className="row" style={{ justifyContent: "space-between" }}>
                        <div><h3>Edit block</h3><p className="panel-sub">{blockLabels[selectedBlock.kind]}</p></div>
                        <div className="row"><button className="mini" onClick={() => moveBlock(selectedBlock.id, -1)}>Move up</button><button className="mini" onClick={() => moveBlock(selectedBlock.id, 1)}>Move down</button><button className="btn danger" onClick={() => removeBlock(selectedBlock.id)}>Delete</button></div>
                      </div>
                      <div className="field"><label>Block type</label><select className="select" value={selectedBlock.kind} onChange={(event) => updateBlock(selectedBlock.id, { kind: event.target.value as BlockKind })}>{(Object.keys(blockLabels) as BlockKind[]).map((kind) => <option key={kind} value={kind}>{blockLabels[kind]}</option>)}</select></div>
                      <div className="field"><label>Heading</label><input className="input" value={selectedBlock.title} onChange={(event) => updateBlock(selectedBlock.id, { title: event.target.value })} /></div>
                      {selectedBlock.kind === "CALLOUT" && <div className="field"><label>Tone</label><select className="select" value={selectedBlock.tone || "INFO"} onChange={(event) => updateBlock(selectedBlock.id, { tone: event.target.value as ContentBlock["tone"] })}><option>INFO</option><option>CAUTION</option><option>SUCCESS</option></select></div>}
                      <div className="field"><label>Body</label><textarea className="textarea" style={{ minHeight: 310 }} value={selectedBlock.body} onChange={(event) => updateBlock(selectedBlock.id, { body: event.target.value })} /></div>
                    </>
                  ) : <div className="empty">Select or add a content block.</div>}
                </div>
              </div>
            </>
          )}

          {tab === "checks" && (
            <>
              <div className="page-head"><div><p className="eyebrow">Assessment design</p><h2>Knowledge checks</h2><p>Measure comprehension at the point of learning and preserve the rationale behind expected responses.</p></div></div>
              <div className="toolbar">{(Object.keys(checkLabels) as CheckKind[]).map((kind) => <button className="mini" key={kind} onClick={() => addCheck(kind)}>+ {checkLabels[kind]}</button>)}</div>
              <div className="check-layout">
                <div className="list-panel">
                  {lesson.checks.map((check, index) => <button key={check.id} className={`list-item ${selectedCheck?.id === check.id ? "active" : ""}`} onClick={() => setSelectedCheckId(check.id)}><span>{index + 1}. {checkLabels[check.kind]}</span><strong>{check.prompt}</strong></button>)}
                  {!lesson.checks.length && <div className="empty">Add the first knowledge check.</div>}
                </div>
                <div className="panel">
                  {selectedCheck ? (
                    <>
                      <div className="row" style={{ justifyContent: "space-between" }}><div><h3>Edit check</h3><p className="panel-sub">Define the prompt, options, expected answer, and rationale.</p></div><button className="btn danger" onClick={() => removeCheck(selectedCheck.id)}>Delete</button></div>
                      <div className="grid two"><div className="field"><label>Check type</label><select className="select" value={selectedCheck.kind} onChange={(event) => updateCheck(selectedCheck.id, { kind: event.target.value as CheckKind })}>{(Object.keys(checkLabels) as CheckKind[]).map((kind) => <option key={kind} value={kind}>{checkLabels[kind]}</option>)}</select></div><div className="field"><label>Required</label><select className="select" value={selectedCheck.required ? "YES" : "NO"} onChange={(event) => updateCheck(selectedCheck.id, { required: event.target.value === "YES" })}><option value="YES">Required</option><option value="NO">Optional</option></select></div></div>
                      <div className="field"><label>Prompt</label><textarea className="textarea" value={selectedCheck.prompt} onChange={(event) => updateCheck(selectedCheck.id, { prompt: event.target.value })} /></div>
                      {selectedCheck.kind !== "SHORT" && <div className="field"><label>Answer options</label>{selectedCheck.options.map((option, index) => <div className="objective" key={`${selectedCheck.id}-${index}`}><input className="input" value={option} onChange={(event) => updateCheck(selectedCheck.id, { options: selectedCheck.options.map((item, i) => i === index ? event.target.value : item) })} /><button className={`btn ${selectedCheck.correct.includes(index) ? "primary" : ""}`} onClick={() => { const has = selectedCheck.correct.includes(index); const correct = selectedCheck.kind === "MULTI" ? (has ? selectedCheck.correct.filter((value) => value !== index) : [...selectedCheck.correct, index]) : [index]; updateCheck(selectedCheck.id, { correct }); }}>{selectedCheck.correct.includes(index) ? "Correct" : "Mark"}</button></div>)}<button className="btn" onClick={() => updateCheck(selectedCheck.id, { options: [...selectedCheck.options, `Option ${selectedCheck.options.length + 1}`] })}>Add option</button></div>}
                      <div className="field"><label>Rationale</label><textarea className="textarea" value={selectedCheck.rationale} onChange={(event) => updateCheck(selectedCheck.id, { rationale: event.target.value })} /></div>
                    </>
                  ) : <div className="empty">Select or add a knowledge check.</div>}
                </div>
              </div>
            </>
          )}

          {tab === "settings" && (
            <>
              <div className="page-head"><div><p className="eyebrow">Governance and publication</p><h2>Lesson settings</h2><p>Control progression, competency alignment, evidence expectations, and publication state.</p></div></div>
              <div className="grid two">
                <div className="panel">
                  <h3>Assessment policy</h3><p className="panel-sub">Set completion rules for this lesson.</p>
                  <div className="field"><label>Passing score</label><input className="input" type="number" min={0} max={100} value={lesson.passingScore} onChange={(event) => patchLesson({ passingScore: Number(event.target.value) })} /></div>
                  <div className="toggle-row"><div className="toggle-copy"><strong>Allow retry</strong><span>Learners may repeat failed knowledge checks.</span></div><button className={`switch ${lesson.allowRetry ? "on" : ""}`} onClick={() => patchLesson({ allowRetry: !lesson.allowRetry })}><span /></button></div>
                  <div className="toggle-row"><div className="toggle-copy"><strong>Require sequential completion</strong><span>Blocks unlock in authored order.</span></div><button className={`switch ${lesson.requireSequential ? "on" : ""}`} onClick={() => patchLesson({ requireSequential: !lesson.requireSequential })}><span /></button></div>
                  <div className="toggle-row"><div className="toggle-copy"><strong>Credential eligible</strong><span>Completion may contribute to a credential pathway.</span></div><button className={`switch ${lesson.certificateEligible ? "on" : ""}`} onClick={() => patchLesson({ certificateEligible: !lesson.certificateEligible })}><span /></button></div>
                </div>
                <div className="panel">
                  <h3>Publication</h3><p className="panel-sub">Move the lesson through an explicit lifecycle.</p>
                  <div className="field"><label>Status</label><select className="select" value={lesson.status} onChange={(event) => patchLesson({ status: event.target.value as LessonStatus })}><option>DRAFT</option><option>IN_REVIEW</option><option>PUBLISHED</option><option>ARCHIVED</option></select></div>
                  <div className="quick-stat"><span>Publishing readiness</span><strong>{completion}%</strong></div>
                  <div className="quick-stat"><span>Authored reading time</span><strong>{estimatedMinutes} min</strong></div>
                  <div className="quick-stat"><span>Target duration</span><strong>{lesson.duration} min</strong></div>
                  <div className="divider" />
                  <label className="btn" style={{ display: "inline-block" }}>Import JSON<input type="file" accept="application/json" hidden onChange={(event) => importLesson(event.target.files?.[0])} /></label>
                  {importError && <div className="notice" style={{ marginTop: 12 }}>{importError}</div>}
                  <button className="btn danger" style={{ marginLeft: 8 }} onClick={resetDraft}>Reset sample</button>
                </div>
                <div className="panel" style={{ gridColumn: "1 / -1" }}>
                  <div className="row" style={{ justifyContent: "space-between" }}><div><h3>Competency mapping</h3><p className="panel-sub">Show exactly what the lesson introduces, practices, or requires learners to demonstrate.</p></div><button className="btn" onClick={() => patchLesson({ competencies: [...lesson.competencies, { id: makeId("comp"), title: "New competency", level: "PRACTICE", evidenceRequired: true }] })}>Add competency</button></div>
                  {lesson.competencies.map((competency) => (
                    <div className="grid" style={{ gridTemplateColumns: "minmax(0,1fr) 180px 160px auto", alignItems: "end", marginBottom: 10 }} key={competency.id}>
                      <div className="field"><label>Competency</label><input className="input" value={competency.title} onChange={(event) => patchLesson({ competencies: lesson.competencies.map((item) => item.id === competency.id ? { ...item, title: event.target.value } : item) })} /></div>
                      <div className="field"><label>Level</label><select className="select" value={competency.level} onChange={(event) => patchLesson({ competencies: lesson.competencies.map((item) => item.id === competency.id ? { ...item, level: event.target.value as CompetencyLevel } : item) })}><option>INTRODUCE</option><option>PRACTICE</option><option>DEMONSTRATE</option></select></div>
                      <div className="field"><label>Evidence</label><select className="select" value={competency.evidenceRequired ? "REQUIRED" : "NOT_REQUIRED"} onChange={(event) => patchLesson({ competencies: lesson.competencies.map((item) => item.id === competency.id ? { ...item, evidenceRequired: event.target.value === "REQUIRED" } : item) })}><option value="REQUIRED">Required</option><option value="NOT_REQUIRED">Not required</option></select></div>
                      <button className="btn danger" style={{ marginBottom: 14 }} onClick={() => patchLesson({ competencies: lesson.competencies.filter((item) => item.id !== competency.id) })}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "preview" && (
            <>
              <div className="page-head"><div><p className="eyebrow">Learner view</p><h2>Lesson preview</h2><p>This preview renders the authored structure without changing learner records or assessment results.</p></div></div>
              <article className="preview-page">
                <header className="preview-hero">
                  <p className="eyebrow">{lesson.difficulty} LESSON</p>
                  <h2>{lesson.title || "Untitled lesson"}</h2>
                  <p style={{ color: "#bfd1e2", lineHeight: 1.7 }}>{lesson.summary}</p>
                  <div className="preview-meta"><span>{lesson.duration} minutes</span><span>•</span><span>{lesson.objectives.length} objectives</span><span>•</span><span>{lesson.checks.length} checks</span></div>
                </header>
                <div className="preview-body">
                  <div className="preview-block"><h3>Learning objectives</h3><ol style={{ color: "#b8cada", lineHeight: 1.8 }}>{lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ol></div>
                  {lesson.blocks.map((block) => (
                    <section key={block.id} className={`preview-block ${block.kind === "CALLOUT" ? "preview-callout" : block.kind === "SCENARIO" ? "preview-scenario" : ""}`}>
                      <p className="eyebrow">{blockLabels[block.kind]}</p><h3>{block.title}</h3>{block.kind === "CODE" ? <pre>{block.body}</pre> : <p>{block.body}</p>}
                    </section>
                  ))}
                  <section className="preview-block"><h3>Knowledge checks</h3>{lesson.checks.map((check, index) => <div className="check-card" key={check.id}><p className="eyebrow">Check {index + 1} · {checkLabels[check.kind]}</p><strong>{check.prompt}</strong>{check.options.map((option, optionIndex) => <label className="option" key={`${check.id}-${optionIndex}`}><input type={check.kind === "MULTI" ? "checkbox" : "radio"} name={check.id} /> <span>{option}</span></label>)}</div>)}</section>
                </div>
              </article>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
