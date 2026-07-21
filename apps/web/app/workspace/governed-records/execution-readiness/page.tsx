"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GateState = "PASS" | "HOLD" | "FAIL" | "UNKNOWN";
type ReadinessState = "READY" | "READY_WITH_CONDITIONS" | "HOLD" | "NOT_READY";
type ReviewStatus = "DRAFT" | "PRESERVED" | "SUPERSEDED" | "WITHDRAWN";

type Gate = {
  id: string;
  label: string;
  state: GateState;
  evidence: string;
  boundary: string;
};

type Blocker = {
  id: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  description: string;
  correctiveAction: string;
  responsibleParty: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "EXCEPTED";
};

type ReadinessRecord = {
  id: string;
  title: string;
  version: number;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  sourceRecordId: string;
  interpretationId: string;
  continuityReviewId: string;
  evidenceReviewId: string;
  authorityReviewId: string;
  admissibilityReviewId: string;
  reviewer: string;
  organization: string;
  executionScope: string;
  executionWindow: string;
  authorizedActor: string;
  constrainedVersion: string;
  residualRisk: string;
  executionConstraints: string;
  mayRelyUpon: string;
  mayNotRelyUpon: string;
  summary: string;
  determination: ReadinessState;
  gates: Gate[];
  blockers: Blocker[];
};

const WORKSPACE_KEY = "ta14-execution-readiness-workspace-v1";
const LIBRARY_KEY = "ta14-execution-readiness-library-v1";

const defaultGates: Gate[] = [
  {
    id: "gate-record",
    label: "Governed record preserved",
    state: "PASS",
    evidence: "Source record identity and preserved artifact are declared.",
    boundary: "Confirms preservation only; it does not validate the underlying claim.",
  },
  {
    id: "gate-interpretation",
    label: "Governed interpretation preserved",
    state: "PASS",
    evidence: "Bounded interpretation artifact is declared and linked.",
    boundary: "Interpretation remains separate from diagnosis and execution.",
  },
  {
    id: "gate-continuity",
    label: "Continuity accepted",
    state: "HOLD",
    evidence: "Continuity review identifier is declared, but acceptance is not yet confirmed.",
    boundary: "Whole-period reliance remains unavailable until continuity standing is explicit.",
  },
  {
    id: "gate-evidence",
    label: "Evidence sufficient",
    state: "UNKNOWN",
    evidence: "Evidence sufficiency standing has not been supplied.",
    boundary: "No execution may rely on evidence whose sufficiency is unresolved.",
  },
  {
    id: "gate-authority",
    label: "Authority established",
    state: "UNKNOWN",
    evidence: "Authority source, scope, and validity window are incomplete.",
    boundary: "Execution authority cannot be inferred from role, access, or technical ability.",
  },
  {
    id: "gate-admissibility",
    label: "Admissibility achieved",
    state: "HOLD",
    evidence: "Admissibility review is referenced but not declared admissible.",
    boundary: "A review artifact alone is not an admissibility determination.",
  },
  {
    id: "gate-identity",
    label: "Required identities verified",
    state: "UNKNOWN",
    evidence: "Reviewer and executing actor identities require verification.",
    boundary: "Names entered into this workspace are declarations, not identity proof.",
  },
  {
    id: "gate-version",
    label: "Required version current",
    state: "PASS",
    evidence: "Execution is constrained to the declared version.",
    boundary: "Any material version change requires a new readiness review.",
  },
  {
    id: "gate-blockers",
    label: "No unresolved blocking findings",
    state: "HOLD",
    evidence: "At least one blocking condition remains open.",
    boundary: "A blocker may be resolved, formally excepted, or preserved as a refusal basis.",
  },
];

const defaultBlockers: Blocker[] = [
  {
    id: "BLK-001",
    severity: "HIGH",
    description: "Execution authority has not been proven for the declared scope.",
    correctiveAction: "Provide the authority source, delegated scope, validity window, and approver identity.",
    responsibleParty: "Route owner",
    status: "OPEN",
  },
];

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `TA-14-ERR-${stamp}-${random}`;
}

function makeDraft(): ReadinessRecord {
  const now = nowIso();
  return {
    id: makeId(),
    title: "Execution Readiness Review",
    version: 1,
    status: "DRAFT",
    createdAt: now,
    updatedAt: now,
    sourceRecordId: "",
    interpretationId: "",
    continuityReviewId: "",
    evidenceReviewId: "",
    authorityReviewId: "",
    admissibilityReviewId: "",
    reviewer: "",
    organization: "",
    executionScope: "",
    executionWindow: "",
    authorizedActor: "",
    constrainedVersion: "",
    residualRisk: "",
    executionConstraints: "",
    mayRelyUpon: "",
    mayNotRelyUpon: "",
    summary: "",
    determination: "HOLD",
    gates: defaultGates,
    blockers: defaultBlockers,
  };
}

function downloadJson(record: ReadinessRecord) {
  const blob = new Blob([JSON.stringify(record, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${record.id}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ExecutionReadinessPage() {
  const [record, setRecord] = useState<ReadinessRecord>(makeDraft);
  const [library, setLibrary] = useState<ReadinessRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedWorkspace = window.localStorage.getItem(WORKSPACE_KEY);
      const savedLibrary = window.localStorage.getItem(LIBRARY_KEY);
      if (savedWorkspace) setRecord(JSON.parse(savedWorkspace));
      if (savedLibrary) setLibrary(JSON.parse(savedLibrary));
    } catch {
      // Keep the default bounded front-end workspace if stored data is invalid.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify({ ...record, updatedAt: nowIso() }));
  }, [record, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  }, [library, hydrated]);

  const counts = useMemo(() => {
    return record.gates.reduce(
      (acc, gate) => {
        acc[gate.state] += 1;
        return acc;
      },
      { PASS: 0, HOLD: 0, FAIL: 0, UNKNOWN: 0 } as Record<GateState, number>,
    );
  }, [record.gates]);

  const autoDetermination = useMemo<ReadinessState>(() => {
    const unresolvedCritical = record.blockers.some(
      (item) => item.severity === "CRITICAL" && item.status !== "RESOLVED",
    );
    if (counts.FAIL > 0 || unresolvedCritical) return "NOT_READY";
    if (counts.HOLD > 0 || counts.UNKNOWN > 0) return "HOLD";
    const unresolved = record.blockers.some(
      (item) => item.status === "OPEN" || item.status === "IN_PROGRESS",
    );
    return unresolved ? "READY_WITH_CONDITIONS" : "READY";
  }, [counts, record.blockers]);

  const completeness = useMemo(() => {
    const required = [
      record.sourceRecordId,
      record.interpretationId,
      record.continuityReviewId,
      record.evidenceReviewId,
      record.authorityReviewId,
      record.admissibilityReviewId,
      record.reviewer,
      record.organization,
      record.executionScope,
      record.executionWindow,
      record.authorizedActor,
      record.constrainedVersion,
    ];
    const completed = required.filter((value) => value.trim().length > 0).length;
    return Math.round((completed / required.length) * 100);
  }, [record]);

  function update<K extends keyof ReadinessRecord>(key: K, value: ReadinessRecord[K]) {
    setRecord((current) => ({ ...current, [key]: value, updatedAt: nowIso() }));
  }

  function updateGate(id: string, patch: Partial<Gate>) {
    update(
      "gates",
      record.gates.map((gate) => (gate.id === id ? { ...gate, ...patch } : gate)),
    );
  }

  function updateBlocker(id: string, patch: Partial<Blocker>) {
    update(
      "blockers",
      record.blockers.map((blocker) => (blocker.id === id ? { ...blocker, ...patch } : blocker)),
    );
  }

  function addBlocker() {
    const next = record.blockers.length + 1;
    update("blockers", [
      ...record.blockers,
      {
        id: `BLK-${String(next).padStart(3, "0")}`,
        severity: "MODERATE",
        description: "",
        correctiveAction: "",
        responsibleParty: "",
        status: "OPEN",
      },
    ]);
  }

  function removeBlocker(id: string) {
    update(
      "blockers",
      record.blockers.filter((blocker) => blocker.id !== id),
    );
  }

  function loadSample() {
    const sample = makeDraft();
    setRecord({
      ...sample,
      title: "Vendor Payment Route — Execution Readiness",
      sourceRecordId: "TA-14-GR-20260721-001",
      interpretationId: "TA-14-GIR-20260721-001",
      continuityReviewId: "TA-14-CR-20260721-001",
      evidenceReviewId: "TA-14-ESR-20260721-001",
      authorityReviewId: "TA-14-AR-20260721-001",
      admissibilityReviewId: "TA-14-ADR-20260721-001",
      reviewer: "TA-14 Review Team",
      organization: "TA-14 Authority Governance Institution",
      executionScope: "Release one vendor payment not exceeding $27,500 to the declared beneficiary.",
      executionWindow: "Valid only during the declared approval window.",
      authorizedActor: "Finance execution role named in the authority record",
      constrainedVersion: "Vendor-payment route v1.3",
      residualRisk:
        "Beneficiary identity and procurement authority remain unresolved. No assumption may substitute for those records.",
      executionConstraints:
        "Execution is limited to the declared amount, beneficiary, authority source, route version, and time window. Any material change requires a new readiness review.",
      mayRelyUpon:
        "The preserved route record, bounded interpretation, declared payment amount, and the evidence specifically linked in the upstream reviews.",
      mayNotRelyUpon:
        "Role-based assumptions, unverified beneficiary data, expired approvals, inferred authority, or evidence outside the declared review boundary.",
      summary:
        "The route is not ready for consequential execution. The record and interpretation exist, but authority and beneficiary evidence remain unresolved. Preserve the HOLD and obtain the missing proof before reassessment.",
      determination: "HOLD",
    });
  }

  function preserve() {
    const preserved: ReadinessRecord = {
      ...record,
      determination: autoDetermination,
      status: "PRESERVED",
      updatedAt: nowIso(),
    };
    setRecord(preserved);
    setLibrary((current) => {
      const exists = current.some((item) => item.id === preserved.id);
      return exists
        ? current.map((item) => (item.id === preserved.id ? preserved : item))
        : [preserved, ...current];
    });
  }

  function reopen(item: ReadinessRecord) {
    setRecord({ ...item, status: "DRAFT", version: item.version + 1, updatedAt: nowIso() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removePreserved(id: string) {
    setLibrary((current) => current.filter((item) => item.id !== id));
  }

  return (
    <>
      <style jsx global>{`
        :root {
          color-scheme: dark;
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: #030712; color: #eef8ff; }
        button, input, textarea, select { font: inherit; }
        .err-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 12% 8%, rgba(63, 230, 206, .16), transparent 28%),
            radial-gradient(circle at 86% 18%, rgba(113, 91, 255, .18), transparent 30%),
            radial-gradient(circle at 50% 92%, rgba(0, 153, 255, .12), transparent 32%),
            linear-gradient(180deg, #020612 0%, #07101f 48%, #030712 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .err-grid {
          position: fixed; inset: 0; pointer-events: none; opacity: .2;
          background-image: linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }
        .err-orb { position: fixed; border-radius: 50%; filter: blur(1px); pointer-events: none; animation: drift 12s ease-in-out infinite; }
        .err-orb.one { width: 8px; height: 8px; top: 14%; left: 7%; background: #65ffe2; box-shadow: 0 0 28px #65ffe2; }
        .err-orb.two { width: 5px; height: 5px; top: 40%; right: 9%; background: #a796ff; box-shadow: 0 0 22px #a796ff; animation-delay: -4s; }
        .err-orb.three { width: 7px; height: 7px; bottom: 13%; left: 22%; background: #4bb8ff; box-shadow: 0 0 25px #4bb8ff; animation-delay: -8s; }
        @keyframes drift { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(24px,-34px,0); } }
        .err-shell { width: min(1420px, calc(100% - 32px)); margin: 0 auto; padding: 34px 0 80px; position: relative; z-index: 1; }
        .err-topbar { display:flex; align-items:center; justify-content:space-between; gap:20px; margin-bottom: 28px; }
        .err-brand { display:flex; align-items:center; gap:12px; }
        .err-mark { width:46px; height:46px; border-radius:15px; display:grid; place-items:center; font-weight:900; color:#041313; background:linear-gradient(135deg,#73ffe5,#54b5ff); box-shadow:0 0 35px rgba(94,242,222,.25); }
        .err-brand strong { display:block; font-size:14px; letter-spacing:.13em; text-transform:uppercase; }
        .err-brand span { display:block; color:#8ea8bd; font-size:12px; margin-top:3px; }
        .err-nav { display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; }
        .err-link, .err-button { border:1px solid rgba(151,208,226,.22); background:rgba(8,22,38,.68); color:#eafcff; border-radius:12px; padding:10px 14px; text-decoration:none; cursor:pointer; transition:.2s ease; }
        .err-link:hover, .err-button:hover { transform:translateY(-1px); border-color:rgba(103,255,226,.6); background:rgba(17,45,62,.86); }
        .err-button.primary { border-color:rgba(105,255,226,.55); background:linear-gradient(135deg,rgba(57,232,199,.24),rgba(55,142,255,.22)); }
        .err-button.danger { border-color:rgba(255,111,136,.35); color:#ffc2cc; }
        .err-hero { display:grid; grid-template-columns:minmax(0,1.45fr) minmax(320px,.55fr); gap:22px; margin-bottom:22px; }
        .err-panel { border:1px solid rgba(147,201,225,.18); background:linear-gradient(180deg,rgba(10,25,43,.86),rgba(5,14,27,.82)); border-radius:24px; box-shadow:0 22px 70px rgba(0,0,0,.32), inset 0 1px rgba(255,255,255,.03); backdrop-filter:blur(18px); }
        .err-hero-main { padding:32px; }
        .err-kicker { color:#75ffe5; font-size:12px; letter-spacing:.18em; text-transform:uppercase; font-weight:800; }
        .err-hero h1 { margin:10px 0 14px; font-size:clamp(36px,5vw,68px); line-height:.96; letter-spacing:-.045em; }
        .err-hero p { margin:0; color:#a9bfd0; max-width:820px; line-height:1.75; }
        .err-chain { margin-top:22px; display:flex; gap:8px; flex-wrap:wrap; }
        .err-chain span { font-size:11px; letter-spacing:.08em; text-transform:uppercase; padding:8px 10px; border-radius:999px; border:1px solid rgba(124,193,220,.18); color:#8fa9bd; background:rgba(4,13,24,.58); }
        .err-chain .active { color:#071514; background:#72ffe4; border-color:#72ffe4; font-weight:900; }
        .err-status { padding:26px; display:flex; flex-direction:column; justify-content:space-between; min-height:100%; }
        .err-status-label { color:#819bac; text-transform:uppercase; letter-spacing:.14em; font-size:11px; }
        .err-determination { font-size:32px; font-weight:900; letter-spacing:-.04em; margin:10px 0; }
        .err-determination.ready { color:#72ffe4; }
        .err-determination.hold { color:#ffd276; }
        .err-determination.not-ready { color:#ff8ca1; }
        .err-meter { height:9px; background:rgba(255,255,255,.06); border-radius:999px; overflow:hidden; margin:18px 0 10px; }
        .err-meter > span { display:block; height:100%; background:linear-gradient(90deg,#56c6ff,#72ffe4); border-radius:inherit; transition:width .25s ease; }
        .err-small { color:#8fa7b8; font-size:12px; line-height:1.55; }
        .err-layout { display:grid; grid-template-columns:minmax(0,1fr) 360px; gap:22px; align-items:start; }
        .err-main { display:grid; gap:22px; }
        .err-side { display:grid; gap:22px; position:sticky; top:18px; }
        .err-section { padding:26px; }
        .err-section-head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:20px; }
        .err-section h2 { margin:0; font-size:22px; letter-spacing:-.02em; }
        .err-section-head p { margin:6px 0 0; color:#8fa7b8; line-height:1.55; font-size:13px; }
        .err-grid-2, .err-grid-3 { display:grid; gap:14px; }
        .err-grid-2 { grid-template-columns:repeat(2,minmax(0,1fr)); }
        .err-grid-3 { grid-template-columns:repeat(3,minmax(0,1fr)); }
        .err-field { display:grid; gap:7px; }
        .err-field label { color:#9ab3c4; font-size:12px; font-weight:700; }
        .err-field input, .err-field textarea, .err-field select { width:100%; border:1px solid rgba(148,203,226,.19); background:rgba(3,11,22,.72); color:#effcff; border-radius:12px; padding:12px 13px; outline:none; }
        .err-field textarea { min-height:116px; resize:vertical; line-height:1.55; }
        .err-field input:focus, .err-field textarea:focus, .err-field select:focus { border-color:rgba(105,255,226,.65); box-shadow:0 0 0 3px rgba(105,255,226,.08); }
        .err-gates { display:grid; gap:12px; }
        .err-gate { border:1px solid rgba(145,201,224,.15); border-radius:17px; padding:16px; background:rgba(3,12,24,.48); }
        .err-gate-top { display:grid; grid-template-columns:minmax(0,1fr) 150px; gap:14px; align-items:center; }
        .err-gate strong { font-size:14px; }
        .err-gate-details { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px; }
        .err-badge { display:inline-flex; align-items:center; justify-content:center; border-radius:999px; padding:7px 10px; font-size:11px; font-weight:900; letter-spacing:.08em; }
        .err-badge.pass { color:#041512; background:#72ffe4; }
        .err-badge.hold { color:#231700; background:#ffd276; }
        .err-badge.fail { color:#27020a; background:#ff8ca1; }
        .err-badge.unknown { color:#d5e8f2; background:rgba(133,160,179,.28); }
        .err-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
        .err-stat { padding:14px; border-radius:15px; border:1px solid rgba(145,201,224,.14); background:rgba(2,10,20,.5); }
        .err-stat span { display:block; color:#8098aa; font-size:10px; letter-spacing:.1em; text-transform:uppercase; }
        .err-stat strong { display:block; margin-top:7px; font-size:24px; }
        .err-blocker { border:1px solid rgba(255,156,113,.18); border-radius:18px; padding:16px; background:rgba(35,13,13,.22); margin-top:12px; }
        .err-blocker-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
        .err-blocker-head strong { color:#ffd5c3; }
        .err-actions { display:flex; flex-wrap:wrap; gap:10px; }
        .err-notice { padding:15px; border-radius:15px; background:rgba(87,236,207,.08); border:1px solid rgba(87,236,207,.18); color:#acd9d2; font-size:12px; line-height:1.65; }
        .err-library { display:grid; gap:12px; }
        .err-library-card { border:1px solid rgba(145,201,224,.15); border-radius:17px; padding:16px; background:rgba(2,10,20,.48); }
        .err-library-card h3 { margin:0 0 6px; font-size:15px; }
        .err-library-meta { color:#8199aa; font-size:11px; line-height:1.6; margin-bottom:12px; }
        .err-empty { text-align:center; padding:28px 12px; color:#7991a2; border:1px dashed rgba(145,201,224,.18); border-radius:16px; }
        @media (max-width: 1050px) { .err-hero, .err-layout { grid-template-columns:1fr; } .err-side { position:static; } }
        @media (max-width: 720px) { .err-shell { width:min(100% - 18px,1420px); padding-top:18px; } .err-topbar { align-items:flex-start; flex-direction:column; } .err-nav { justify-content:flex-start; } .err-hero-main, .err-status, .err-section { padding:20px; } .err-grid-2, .err-grid-3, .err-gate-details { grid-template-columns:1fr; } .err-gate-top { grid-template-columns:1fr; } .err-stats { grid-template-columns:repeat(2,1fr); } }
      `}</style>

      <div className="err-page">
        <div className="err-grid" />
        <div className="err-orb one" />
        <div className="err-orb two" />
        <div className="err-orb three" />

        <div className="err-shell">
          <header className="err-topbar">
            <div className="err-brand">
              <div className="err-mark">TA</div>
              <div>
                <strong>TA-14 Governed Records</strong>
                <span>No admissible evidence. No admissible execution.</span>
              </div>
            </div>
            <nav className="err-nav">
              <Link className="err-link" href="/workspace/governed-records/admissibility-review">Previous: Admissibility</Link>
              <Link className="err-link" href="/workspace/governed-records">Playground</Link>
              <Link className="err-link" href="/workspace/governed-records/execution-record">Next: Execution Record</Link>
            </nav>
          </header>

          <section className="err-hero">
            <div className="err-panel err-hero-main">
              <div className="err-kicker">Final pre-execution gate</div>
              <h1>Execution Readiness</h1>
              <p>
                Determine whether every required governance layer has standing sufficient to permit a bounded execution route to advance. This workspace does not execute, diagnose, optimize, or manufacture authority. It preserves the readiness determination and every reason for refusal, limitation, or conditional advancement.
              </p>
              <div className="err-chain">
                <span>Reality</span><span>Record</span><span>Continuity</span><span>Admissibility</span><span>Binding</span><span>Commit</span><span className="active">Execution Readiness</span><span>Outcome</span>
              </div>
            </div>

            <aside className="err-panel err-status">
              <div>
                <div className="err-status-label">Computed determination</div>
                <div className={`err-determination ${autoDetermination === "READY" ? "ready" : autoDetermination === "NOT_READY" ? "not-ready" : "hold"}`}>
                  {autoDetermination.replaceAll("_", " ")}
                </div>
                <div className="err-small">The computed state is derived from gate standings and unresolved blockers. It does not replace upstream review artifacts.</div>
              </div>
              <div>
                <div className="err-meter"><span style={{ width: `${completeness}%` }} /></div>
                <div className="err-small">Identity and boundary completion: {completeness}%</div>
              </div>
            </aside>
          </section>

          <div className="err-layout">
            <main className="err-main">
              <section className="err-panel err-section">
                <div className="err-section-head">
                  <div><h2>Readiness identity</h2><p>Bind this review to the exact upstream artifacts, reviewer, organization, scope, actor, time window, and route version.</p></div>
                  <span className={`err-badge ${record.status === "PRESERVED" ? "pass" : "unknown"}`}>{record.status}</span>
                </div>
                <div className="err-grid-2">
                  <div className="err-field"><label>Review title</label><input value={record.title} onChange={(e) => update("title", e.target.value)} /></div>
                  <div className="err-field"><label>Readiness review ID</label><input value={record.id} readOnly /></div>
                  <div className="err-field"><label>Source governed record ID</label><input value={record.sourceRecordId} onChange={(e) => update("sourceRecordId", e.target.value)} placeholder="TA-14-GR-..." /></div>
                  <div className="err-field"><label>Governed interpretation ID</label><input value={record.interpretationId} onChange={(e) => update("interpretationId", e.target.value)} placeholder="TA-14-GIR-..." /></div>
                  <div className="err-field"><label>Continuity review ID</label><input value={record.continuityReviewId} onChange={(e) => update("continuityReviewId", e.target.value)} placeholder="TA-14-CR-..." /></div>
                  <div className="err-field"><label>Evidence sufficiency review ID</label><input value={record.evidenceReviewId} onChange={(e) => update("evidenceReviewId", e.target.value)} placeholder="TA-14-ESR-..." /></div>
                  <div className="err-field"><label>Authority review ID</label><input value={record.authorityReviewId} onChange={(e) => update("authorityReviewId", e.target.value)} placeholder="TA-14-AR-..." /></div>
                  <div className="err-field"><label>Admissibility review ID</label><input value={record.admissibilityReviewId} onChange={(e) => update("admissibilityReviewId", e.target.value)} placeholder="TA-14-ADR-..." /></div>
                  <div className="err-field"><label>Reviewer</label><input value={record.reviewer} onChange={(e) => update("reviewer", e.target.value)} /></div>
                  <div className="err-field"><label>Organization</label><input value={record.organization} onChange={(e) => update("organization", e.target.value)} /></div>
                  <div className="err-field"><label>Authorized executing actor</label><input value={record.authorizedActor} onChange={(e) => update("authorizedActor", e.target.value)} /></div>
                  <div className="err-field"><label>Constrained route/version</label><input value={record.constrainedVersion} onChange={(e) => update("constrainedVersion", e.target.value)} /></div>
                </div>
                <div className="err-grid-2" style={{ marginTop: 14 }}>
                  <div className="err-field"><label>Execution scope</label><textarea value={record.executionScope} onChange={(e) => update("executionScope", e.target.value)} /></div>
                  <div className="err-field"><label>Execution window</label><textarea value={record.executionWindow} onChange={(e) => update("executionWindow", e.target.value)} /></div>
                </div>
              </section>

              <section className="err-panel err-section">
                <div className="err-section-head">
                  <div><h2>Governance gate summary</h2><p>Each gate is a separate declared standing. This page may record the standing, but it may not rewrite the upstream review.</p></div>
                </div>
                <div className="err-stats" style={{ marginBottom: 16 }}>
                  <div className="err-stat"><span>Pass</span><strong>{counts.PASS}</strong></div>
                  <div className="err-stat"><span>Hold</span><strong>{counts.HOLD}</strong></div>
                  <div className="err-stat"><span>Fail</span><strong>{counts.FAIL}</strong></div>
                  <div className="err-stat"><span>Unknown</span><strong>{counts.UNKNOWN}</strong></div>
                </div>
                <div className="err-gates">
                  {record.gates.map((gate) => (
                    <div className="err-gate" key={gate.id}>
                      <div className="err-gate-top">
                        <strong>{gate.label}</strong>
                        <select value={gate.state} onChange={(e) => updateGate(gate.id, { state: e.target.value as GateState })}>
                          <option>PASS</option><option>HOLD</option><option>FAIL</option><option>UNKNOWN</option>
                        </select>
                      </div>
                      <div className="err-gate-details">
                        <div className="err-field"><label>Evidence basis</label><textarea value={gate.evidence} onChange={(e) => updateGate(gate.id, { evidence: e.target.value })} /></div>
                        <div className="err-field"><label>Boundary</label><textarea value={gate.boundary} onChange={(e) => updateGate(gate.id, { boundary: e.target.value })} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="err-panel err-section">
                <div className="err-section-head">
                  <div><h2>Blocking conditions</h2><p>Preserve every condition that prevents or limits execution, together with the corrective action and accountable party.</p></div>
                  <button className="err-button" type="button" onClick={addBlocker}>Add blocker</button>
                </div>
                {record.blockers.length === 0 ? <div className="err-empty">No blocking conditions are declared.</div> : record.blockers.map((blocker) => (
                  <div className="err-blocker" key={blocker.id}>
                    <div className="err-blocker-head"><strong>{blocker.id}</strong><button className="err-button danger" type="button" onClick={() => removeBlocker(blocker.id)}>Remove</button></div>
                    <div className="err-grid-3">
                      <div className="err-field"><label>Severity</label><select value={blocker.severity} onChange={(e) => updateBlocker(blocker.id, { severity: e.target.value as Blocker["severity"] })}><option>LOW</option><option>MODERATE</option><option>HIGH</option><option>CRITICAL</option></select></div>
                      <div className="err-field"><label>Status</label><select value={blocker.status} onChange={(e) => updateBlocker(blocker.id, { status: e.target.value as Blocker["status"] })}><option>OPEN</option><option>IN_PROGRESS</option><option>RESOLVED</option><option>EXCEPTED</option></select></div>
                      <div className="err-field"><label>Responsible party</label><input value={blocker.responsibleParty} onChange={(e) => updateBlocker(blocker.id, { responsibleParty: e.target.value })} /></div>
                    </div>
                    <div className="err-grid-2" style={{ marginTop: 12 }}>
                      <div className="err-field"><label>Description</label><textarea value={blocker.description} onChange={(e) => updateBlocker(blocker.id, { description: e.target.value })} /></div>
                      <div className="err-field"><label>Required corrective action</label><textarea value={blocker.correctiveAction} onChange={(e) => updateBlocker(blocker.id, { correctiveAction: e.target.value })} /></div>
                    </div>
                  </div>
                ))}
              </section>

              <section className="err-panel err-section">
                <div className="err-section-head"><div><h2>Execution boundary</h2><p>State precisely what execution may rely upon, what it may not rely upon, and the conditions that constrain any allowed consequence.</p></div></div>
                <div className="err-grid-2">
                  <div className="err-field"><label>Residual risk</label><textarea value={record.residualRisk} onChange={(e) => update("residualRisk", e.target.value)} /></div>
                  <div className="err-field"><label>Execution constraints</label><textarea value={record.executionConstraints} onChange={(e) => update("executionConstraints", e.target.value)} /></div>
                  <div className="err-field"><label>Execution may rely upon</label><textarea value={record.mayRelyUpon} onChange={(e) => update("mayRelyUpon", e.target.value)} /></div>
                  <div className="err-field"><label>Execution may not rely upon</label><textarea value={record.mayNotRelyUpon} onChange={(e) => update("mayNotRelyUpon", e.target.value)} /></div>
                </div>
                <div className="err-field" style={{ marginTop: 14 }}><label>Readiness summary</label><textarea value={record.summary} onChange={(e) => update("summary", e.target.value)} /></div>
              </section>
            </main>

            <aside className="err-side">
              <section className="err-panel err-section">
                <div className="err-section-head"><div><h2>Workspace controls</h2><p>Front-end preservation only. No backend capability is implied.</p></div></div>
                <div className="err-actions">
                  <button className="err-button" type="button" onClick={loadSample}>Load sample</button>
                  <button className="err-button primary" type="button" onClick={preserve}>Preserve review</button>
                  <button className="err-button" type="button" onClick={() => downloadJson({ ...record, determination: autoDetermination })}>Export JSON</button>
                  <button className="err-button danger" type="button" onClick={() => setRecord(makeDraft())}>New review</button>
                </div>
                <div className="err-notice" style={{ marginTop: 16 }}>
                  Preserving this review records a bounded readiness artifact in this browser. It does not authorize execution, certify compliance, or replace the required upstream evidence and authority records.
                </div>
              </section>

              <section className="err-panel err-section">
                <div className="err-section-head"><div><h2>Preserved reviews</h2><p>Reopen, export, or remove browser-local readiness artifacts.</p></div></div>
                <div className="err-library">
                  {library.length === 0 ? <div className="err-empty">No preserved readiness reviews yet.</div> : library.map((item) => (
                    <article className="err-library-card" key={item.id}>
                      <h3>{item.title}</h3>
                      <div className="err-library-meta">{item.id}<br />Version {item.version} · {item.determination.replaceAll("_", " ")}<br />Updated {new Date(item.updatedAt).toLocaleString()}</div>
                      <div className="err-actions">
                        <button className="err-button" type="button" onClick={() => reopen(item)}>Reopen</button>
                        <button className="err-button" type="button" onClick={() => downloadJson(item)}>Export</button>
                        <button className="err-button danger" type="button" onClick={() => removePreserved(item.id)}>Remove</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
