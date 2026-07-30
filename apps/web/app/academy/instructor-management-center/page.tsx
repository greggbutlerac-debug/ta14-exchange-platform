"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type InstructorStatus = "ACTIVE" | "REVIEW" | "SUSPENDED" | "DRAFT";
type AuthorizationStatus = "AUTHORIZED" | "CONDITIONAL" | "EXPIRED" | "SUSPENDED";
type ReviewStatus = "OPEN" | "COMPLETE" | "OVERDUE";
type TabKey =
  | "overview"
  | "instructors"
  | "authorizations"
  | "assignments"
  | "competency"
  | "credentials"
  | "reviews"
  | "evidence"
  | "disclosures"
  | "workflows"
  | "audit"
  | "reports";

type Instructor = {
  id: string;
  name: string;
  email: string;
  title: string;
  department: string;
  status: InstructorStatus;
  readiness: number;
  workload: number;
  courses: string[];
  competencies: string[];
  licenses: Credential[];
  authorizations: Authorization[];
  continuingEducationHours: number;
  continuingEducationTarget: number;
  lastObservation: string;
  nextReview: string;
  conflicts: Disclosure[];
  notes: string;
};

type Credential = {
  id: string;
  name: string;
  issuer: string;
  issued: string;
  expires: string;
  status: "CURRENT" | "EXPIRING" | "EXPIRED";
  evidenceId: string;
};

type Authorization = {
  id: string;
  scope: string;
  level: string;
  status: AuthorizationStatus;
  effective: string;
  expires: string;
  approver: string;
  limitations: string;
};

type Disclosure = {
  id: string;
  category: string;
  description: string;
  status: "CLEAR" | "MITIGATION" | "ESCALATED";
  reviewed: string;
};

type EvidenceRecord = {
  id: string;
  instructorId: string;
  type: string;
  title: string;
  date: string;
  source: string;
  status: "VERIFIED" | "PENDING" | "REJECTED";
  hash: string;
};

type AuditEvent = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  determination: "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
  details: string;
};

type Assignment = {
  id: string;
  course: string;
  cohort: string;
  instructorId: string;
  start: string;
  end: string;
  hours: number;
  status: "PLANNED" | "ACTIVE" | "COMPLETE";
};

type Observation = {
  id: string;
  instructorId: string;
  reviewer: string;
  date: string;
  score: number;
  status: ReviewStatus;
  findings: string;
};

const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const isoDate = () => new Date().toISOString().slice(0, 10);

const seedInstructors: Instructor[] = [
  {
    id: "INS-001",
    name: "Dr. Mara Voss",
    email: "mara.voss@academy.example",
    title: "Lead Governance Instructor",
    department: "Admissible Execution",
    status: "ACTIVE",
    readiness: 96,
    workload: 72,
    courses: ["Execution Admissibility", "Authority Validation"],
    competencies: ["Evidence integrity", "Execution boundaries", "Institutional review"],
    licenses: [
      {
        id: "CRD-101",
        name: "TA-14 Senior Instructor Credential",
        issuer: "TA-14 Academy",
        issued: "2026-01-12",
        expires: "2027-01-12",
        status: "CURRENT",
        evidenceId: "EVD-001",
      },
    ],
    authorizations: [
      {
        id: "AUT-201",
        scope: "Academy core governance curriculum",
        level: "Lead",
        status: "AUTHORIZED",
        effective: "2026-01-15",
        expires: "2027-01-15",
        approver: "Institutional Review Board",
        limitations: "No independent credential revocation authority",
      },
    ],
    continuingEducationHours: 31,
    continuingEducationTarget: 36,
    lastObservation: "2026-06-21",
    nextReview: "2026-09-21",
    conflicts: [],
    notes: "Primary instructor for advanced governance pathways.",
  },
  {
    id: "INS-002",
    name: "Jordan Ellis",
    email: "jordan.ellis@academy.example",
    title: "Technical Curriculum Instructor",
    department: "HVAC Evidence Systems",
    status: "REVIEW",
    readiness: 81,
    workload: 88,
    courses: ["Electricity Made Simple", "Diagnostic Evidence"],
    competencies: ["Electrical evidence", "Field documentation", "Safety boundaries"],
    licenses: [
      {
        id: "CRD-102",
        name: "EPA 608 Universal",
        issuer: "Approved Certifying Organization",
        issued: "2024-04-08",
        expires: "2099-12-31",
        status: "CURRENT",
        evidenceId: "EVD-002",
      },
    ],
    authorizations: [
      {
        id: "AUT-202",
        scope: "HVAC foundational instruction",
        level: "Instructor",
        status: "CONDITIONAL",
        effective: "2026-03-01",
        expires: "2026-10-01",
        approver: "Program Chair",
        limitations: "Advanced lab supervision requires co-instructor",
      },
    ],
    continuingEducationHours: 18,
    continuingEducationTarget: 30,
    lastObservation: "2026-05-11",
    nextReview: "2026-08-11",
    conflicts: [
      {
        id: "COI-001",
        category: "Vendor relationship",
        description: "Occasional paid equipment training for a manufacturer.",
        status: "MITIGATION",
        reviewed: "2026-05-15",
      },
    ],
    notes: "Workload requires adjustment before next cohort begins.",
  },
  {
    id: "INS-003",
    name: "Priya Nand",
    email: "priya.nand@academy.example",
    title: "Assessment and Review Instructor",
    department: "Institutional Assurance",
    status: "ACTIVE",
    readiness: 91,
    workload: 61,
    courses: ["Review Workspace", "Assessment Design"],
    competencies: ["Assessment design", "Evidence review", "Corrective action"],
    licenses: [
      {
        id: "CRD-103",
        name: "Institutional Assessor Authorization",
        issuer: "TA-14 Academy",
        issued: "2026-02-22",
        expires: "2027-02-22",
        status: "CURRENT",
        evidenceId: "EVD-003",
      },
    ],
    authorizations: [
      {
        id: "AUT-203",
        scope: "Assessment and peer review",
        level: "Senior",
        status: "AUTHORIZED",
        effective: "2026-02-25",
        expires: "2027-02-25",
        approver: "Accreditation Director",
        limitations: "Cannot review own course materials",
      },
    ],
    continuingEducationHours: 28,
    continuingEducationTarget: 30,
    lastObservation: "2026-07-02",
    nextReview: "2026-10-02",
    conflicts: [],
    notes: "Eligible for lead reviewer designation after next observation.",
  },
  {
    id: "INS-004",
    name: "Samuel Ortega",
    email: "samuel.ortega@academy.example",
    title: "Adjunct Simulation Instructor",
    department: "Scenario Operations",
    status: "SUSPENDED",
    readiness: 48,
    workload: 0,
    courses: [],
    competencies: ["Simulation facilitation", "Scenario debriefing"],
    licenses: [
      {
        id: "CRD-104",
        name: "Simulation Facilitator Credential",
        issuer: "TA-14 Academy",
        issued: "2025-09-10",
        expires: "2026-06-10",
        status: "EXPIRED",
        evidenceId: "EVD-004",
      },
    ],
    authorizations: [
      {
        id: "AUT-204",
        scope: "Execution simulation facilitation",
        level: "Adjunct",
        status: "SUSPENDED",
        effective: "2025-09-15",
        expires: "2026-06-15",
        approver: "Program Chair",
        limitations: "Suspended pending credential renewal and corrective action",
      },
    ],
    continuingEducationHours: 6,
    continuingEducationTarget: 24,
    lastObservation: "2026-04-18",
    nextReview: "2026-08-18",
    conflicts: [],
    notes: "Reinstatement requires renewed credential and verified remediation.",
  },
];

const seedEvidence: EvidenceRecord[] = [
  { id: "EVD-001", instructorId: "INS-001", type: "Credential", title: "Senior Instructor Credential", date: "2026-01-12", source: "Credential Registry", status: "VERIFIED", hash: "91a7…f203" },
  { id: "EVD-002", instructorId: "INS-002", type: "License", title: "EPA 608 Universal", date: "2024-04-08", source: "Uploaded certificate", status: "VERIFIED", hash: "82bc…119d" },
  { id: "EVD-003", instructorId: "INS-003", type: "Authorization", title: "Institutional Assessor Authorization", date: "2026-02-22", source: "Accreditation Center", status: "VERIFIED", hash: "9cc1…d8aa" },
  { id: "EVD-004", instructorId: "INS-004", type: "Credential", title: "Simulation Facilitator Credential", date: "2025-09-10", source: "Credential Registry", status: "VERIFIED", hash: "11de…7ca2" },
  { id: "EVD-005", instructorId: "INS-002", type: "Observation", title: "Spring classroom observation", date: "2026-05-11", source: "Peer Review", status: "PENDING", hash: "pending" },
];

const seedAssignments: Assignment[] = [
  { id: "ASN-001", course: "Execution Admissibility", cohort: "Executive Cohort 07", instructorId: "INS-001", start: "2026-08-05", end: "2026-09-12", hours: 42, status: "PLANNED" },
  { id: "ASN-002", course: "Electricity Made Simple", cohort: "HVAC Foundations 12", instructorId: "INS-002", start: "2026-07-18", end: "2026-09-02", hours: 58, status: "ACTIVE" },
  { id: "ASN-003", course: "Assessment Design", cohort: "Assessor Track 03", instructorId: "INS-003", start: "2026-08-20", end: "2026-09-18", hours: 32, status: "PLANNED" },
];

const seedObservations: Observation[] = [
  { id: "OBS-001", instructorId: "INS-001", reviewer: "Priya Nand", date: "2026-06-21", score: 95, status: "COMPLETE", findings: "Strong boundary discipline and evidence traceability." },
  { id: "OBS-002", instructorId: "INS-002", reviewer: "Mara Voss", date: "2026-08-11", score: 0, status: "OPEN", findings: "Scheduled review; workload and lab authorization are in scope." },
  { id: "OBS-003", instructorId: "INS-004", reviewer: "Institutional Review Board", date: "2026-06-20", score: 48, status: "OVERDUE", findings: "Corrective action evidence incomplete." },
];

const seedAudit: AuditEvent[] = [
  { id: "AUD-001", timestamp: "2026-07-29 16:42", actor: "Accreditation Director", action: "Authorization renewed", target: "INS-001 / AUT-201", determination: "ALLOW", details: "Current evidence, authority, and review conditions satisfied." },
  { id: "AUD-002", timestamp: "2026-07-28 10:15", actor: "Program Chair", action: "Workload review opened", target: "INS-002", determination: "HOLD", details: "Assignment exceeds preferred workload threshold." },
  { id: "AUD-003", timestamp: "2026-07-26 14:08", actor: "Credential Registry", action: "Credential expiration detected", target: "INS-004 / CRD-104", determination: "DENY", details: "Teaching authorization cannot continue on expired credential evidence." },
  { id: "AUD-004", timestamp: "2026-07-24 09:31", actor: "Conflict Review Officer", action: "Disclosure mitigation accepted", target: "INS-002 / COI-001", determination: "ALLOW", details: "Recusal and content-review conditions preserved." },
];

const tabs: { key: TabKey; label: string; short: string }[] = [
  { key: "overview", label: "Operations Dashboard", short: "Overview" },
  { key: "instructors", label: "Instructor Profiles", short: "Profiles" },
  { key: "authorizations", label: "Authority & Teaching Authorization", short: "Authority" },
  { key: "assignments", label: "Course Assignment & Workload", short: "Assignments" },
  { key: "competency", label: "Competency & Continuing Education", short: "Competency" },
  { key: "credentials", label: "Certification & License Management", short: "Credentials" },
  { key: "reviews", label: "Observations & Peer Reviews", short: "Reviews" },
  { key: "evidence", label: "Teaching Evidence Repository", short: "Evidence" },
  { key: "disclosures", label: "Conflict-of-Interest Disclosures", short: "Disclosures" },
  { key: "workflows", label: "Approval, Suspension & Reinstatement", short: "Workflows" },
  { key: "audit", label: "Audit Timeline", short: "Audit" },
  { key: "reports", label: "Search & Reporting", short: "Reports" },
];

function downloadText(filename: string, text: string, mime = "application/json") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value: unknown) {
  const s = String(value ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

function statusClass(value: string) {
  return `status status-${value.toLowerCase()}`;
}

function readinessBand(score: number) {
  if (score >= 90) return "Ready";
  if (score >= 75) return "Conditional";
  if (score >= 60) return "Hold";
  return "Not ready";
}

export default function InstructorManagementCenterPage() {
  const [tab, setTab] = useState<TabKey>("overview");
  const [instructors, setInstructors] = useState<Instructor[]>(seedInstructors);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>(seedEvidence);
  const [assignments, setAssignments] = useState<Assignment[]>(seedAssignments);
  const [observations, setObservations] = useState<Observation[]>(seedObservations);
  const [audit, setAudit] = useState<AuditEvent[]>(seedAudit);
  const [selectedId, setSelectedId] = useState("INS-001");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [notice, setNotice] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftDepartment, setDraftDepartment] = useState("Admissible Execution");
  const [actionType, setActionType] = useState<"APPROVE" | "SUSPEND" | "REINSTATE">("APPROVE");
  const [actionReason, setActionReason] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ta14-academy-instructor-management-v1");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.instructors)) setInstructors(parsed.instructors);
      if (Array.isArray(parsed.evidence)) setEvidence(parsed.evidence);
      if (Array.isArray(parsed.assignments)) setAssignments(parsed.assignments);
      if (Array.isArray(parsed.observations)) setObservations(parsed.observations);
      if (Array.isArray(parsed.audit)) setAudit(parsed.audit);
    } catch {
      setNotice("Local data could not be restored. Seed records remain available.");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ta14-academy-instructor-management-v1",
      JSON.stringify({ instructors, evidence, assignments, observations, audit })
    );
  }, [instructors, evidence, assignments, observations, audit]);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(t);
  }, [notice]);

  const departments = useMemo(
    () => Array.from(new Set(instructors.map((x) => x.department))).sort(),
    [instructors]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return instructors.filter((i) => {
      const matchesQuery = !q || [i.name, i.email, i.title, i.department, ...i.courses, ...i.competencies].join(" ").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || i.status === statusFilter;
      const matchesDepartment = departmentFilter === "ALL" || i.department === departmentFilter;
      return matchesQuery && matchesStatus && matchesDepartment;
    });
  }, [instructors, query, statusFilter, departmentFilter]);

  const selected = instructors.find((x) => x.id === selectedId) ?? instructors[0];
  const activeCount = instructors.filter((i) => i.status === "ACTIVE").length;
  const suspendedCount = instructors.filter((i) => i.status === "SUSPENDED").length;
  const expiringCount = instructors.flatMap((i) => i.licenses).filter((c) => c.status !== "CURRENT").length;
  const avgReadiness = Math.round(instructors.reduce((sum, i) => sum + i.readiness, 0) / Math.max(instructors.length, 1));
  const overloaded = instructors.filter((i) => i.workload >= 85).length;
  const openReviews = observations.filter((x) => x.status !== "COMPLETE").length;

  const addAudit = (action: string, target: string, determination: AuditEvent["determination"], details: string) => {
    setAudit((prev) => [
      { id: uid("AUD"), timestamp: new Date().toLocaleString(), actor: "Current Academy Administrator", action, target, determination, details },
      ...prev,
    ]);
  };

  const addInstructor = () => {
    if (!draftName.trim() || !draftEmail.trim()) {
      setNotice("Name and email are required.");
      return;
    }
    const instructor: Instructor = {
      id: `INS-${String(instructors.length + 1).padStart(3, "0")}`,
      name: draftName.trim(),
      email: draftEmail.trim(),
      title: "Instructor Candidate",
      department: draftDepartment,
      status: "DRAFT",
      readiness: 35,
      workload: 0,
      courses: [],
      competencies: [],
      licenses: [],
      authorizations: [],
      continuingEducationHours: 0,
      continuingEducationTarget: 24,
      lastObservation: "Not observed",
      nextReview: isoDate(),
      conflicts: [],
      notes: "New instructor record awaiting evidence and authorization review.",
    };
    setInstructors((prev) => [...prev, instructor]);
    setSelectedId(instructor.id);
    addAudit("Instructor profile created", instructor.id, "HOLD", "New record created without authorization; evidence review required.");
    setDraftName("");
    setDraftEmail("");
    setShowAdd(false);
    setTab("instructors");
    setNotice("Instructor record created and held for review.");
  };

  const executeAction = () => {
    if (!selected) return;
    if (!actionReason.trim()) {
      setNotice("A reason is required for an authority-changing action.");
      return;
    }
    const nextStatus: InstructorStatus = actionType === "SUSPEND" ? "SUSPENDED" : "ACTIVE";
    const determination: AuditEvent["determination"] = actionType === "SUSPEND" ? "DENY" : actionType === "REINSTATE" ? "ALLOW" : "ALLOW";
    setInstructors((prev) => prev.map((i) => i.id === selected.id ? { ...i, status: nextStatus, readiness: actionType === "SUSPEND" ? Math.min(i.readiness, 55) : Math.max(i.readiness, 75) } : i));
    addAudit(`${actionType.toLowerCase()} instructor`, selected.id, determination, actionReason.trim());
    setActionReason("");
    setShowAction(false);
    setNotice(`${actionType} workflow recorded.`);
  };

  const exportJson = () => {
    downloadText("TA-14_Academy_Instructor_Management_Export.json", JSON.stringify({ exportedAt: new Date().toISOString(), instructors, evidence, assignments, observations, audit }, null, 2));
    setNotice("JSON export created.");
  };

  const exportCsv = () => {
    const head = ["id", "name", "email", "title", "department", "status", "readiness", "workload", "courses", "competencies", "ce_hours", "ce_target", "next_review"];
    const rows = instructors.map((i) => [i.id, i.name, i.email, i.title, i.department, i.status, i.readiness, i.workload, i.courses.join("; "), i.competencies.join("; "), i.continuingEducationHours, i.continuingEducationTarget, i.nextReview]);
    downloadText("TA-14_Academy_Instructor_Report.csv", [head, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n"), "text/csv");
    setNotice("CSV report created.");
  };

  const importJson = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed.instructors)) throw new Error("Invalid instructor export");
      setInstructors(parsed.instructors);
      if (Array.isArray(parsed.evidence)) setEvidence(parsed.evidence);
      if (Array.isArray(parsed.assignments)) setAssignments(parsed.assignments);
      if (Array.isArray(parsed.observations)) setObservations(parsed.observations);
      if (Array.isArray(parsed.audit)) setAudit(parsed.audit);
      setSelectedId(parsed.instructors[0]?.id ?? "");
      setNotice("Instructor management data imported.");
    } catch {
      setNotice("Import failed. Select a valid TA-14 JSON export.");
    }
  };

  const resetData = () => {
    setInstructors(seedInstructors);
    setEvidence(seedEvidence);
    setAssignments(seedAssignments);
    setObservations(seedObservations);
    setAudit(seedAudit);
    setSelectedId("INS-001");
    setNotice("Demonstration data restored.");
  };

  return (
    <main className="page-shell">
      <div className="sky" aria-hidden="true">
<span />
<span />
<span />
<span />
<span />
</div>
      <header className="hero">
        <div className="hero-topline">
          <div>
            <div className="eyebrow">TA-14 ACADEMY · INSTITUTIONAL ADMINISTRATION</div>
            <h1>Instructor Management Center</h1>
            <p className="hero-copy">Manage instructor identity, qualification, authority, workload, evidence, review, readiness, and institutional standing without confusing a profile, credential, or approval with present execution authority.</p>
          </div>
          <div className="hero-actions">
            <button className="btn btn-ghost" onClick={() => importRef.current?.click()}>Import JSON</button>
            <button className="btn btn-ghost" onClick={exportCsv}>Export CSV</button>
            <button className="btn btn-primary" onClick={exportJson}>Export governed record</button>
            <input ref={importRef} hidden type="file" accept="application/json" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
          </div>
        </div>
        <div className="law-banner">
          <span className="law-mark">INSTITUTIONAL RULE</span>
          <strong>Instructor standing is not teaching permission.</strong>
          <span>Every assignment must establish current evidence, authority, scope, continuity, and review conditions before instruction begins.</span>
        </div>
      </header>

      <section className="metrics-grid">
        <Metric label="Total instructors" value={String(instructors.length)} detail={`${activeCount} active`} />
        <Metric label="Average readiness" value={`${avgReadiness}%`} detail={readinessBand(avgReadiness)} />
        <Metric label="Open reviews" value={String(openReviews)} detail={`${observations.filter((x) => x.status === "OVERDUE").length} overdue`} />
        <Metric label="Credential exceptions" value={String(expiringCount)} detail="Expiring or expired" />
        <Metric label="Workload holds" value={String(overloaded)} detail="At or above 85%" />
        <Metric label="Suspended" value={String(suspendedCount)} detail="Execution denied" />
      </section>

      <section className="workspace">
        <aside className="sidebar">
          <div className="side-title">CONTROL CENTER</div>
          <nav>{tabs.map((t) => <button key={t.key} className={tab === t.key ? "nav-item active" : "nav-item"} onClick={() => setTab(t.key)}>
<span>{t.short}</span>
<small>{t.label}</small>
</button>)}</nav>
          <div className="side-boundary">
            <strong>No admissible evidence.<br />No admissible execution.</strong>
            <p>Records support review. They do not self-authorize action.</p>
          </div>
        </aside>

        <div className="content">
          <div className="content-toolbar">
            <div>
              <div className="section-kicker">{tabs.find((x) => x.key === tab)?.label}</div>
              <h2>{tab === "overview" ? "Instructor operations at a glance" : tabs.find((x) => x.key === tab)?.short}</h2>
            </div>
            <div className="toolbar-actions">
              <button className="btn btn-ghost" onClick={resetData}>Restore demo</button>
              <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Add instructor</button>
            </div>
          </div>

          {tab === "overview" && <Overview instructors={instructors} observations={observations} audit={audit} onSelect={(id) => { setSelectedId(id); setTab("instructors"); }} />}
          {tab === "instructors" && <Profiles instructors={filtered} selected={selected} selectedId={selectedId} setSelectedId={setSelectedId} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} departmentFilter={departmentFilter} setDepartmentFilter={setDepartmentFilter} departments={departments} onAction={() => setShowAction(true)} />}
          {tab === "authorizations" && <Authorizations instructors={instructors} onSelect={(id) => setSelectedId(id)} />}
          {tab === "assignments" && <Assignments assignments={assignments} instructors={instructors} />}
          {tab === "competency" && <Competency instructors={instructors} />}
          {tab === "credentials" && <Credentials instructors={instructors} />}
          {tab === "reviews" && <Reviews observations={observations} instructors={instructors} />}
          {tab === "evidence" && <Evidence evidence={evidence} instructors={instructors} />}
          {tab === "disclosures" && <Disclosures instructors={instructors} />}
          {tab === "workflows" && <Workflows instructors={instructors} onSelect={(id) => { setSelectedId(id); setShowAction(true); }} />}
          {tab === "audit" && <Audit audit={audit} />}
          {tab === "reports" && <Reports instructors={filtered} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} departmentFilter={departmentFilter} setDepartmentFilter={setDepartmentFilter} departments={departments} onExportCsv={exportCsv} onExportJson={exportJson} />}
        </div>
      </section>

      {showAdd && <Modal title="Create instructor record" subtitle="A new profile begins in DRAFT and remains on HOLD until evidence and authority are established." onClose={() => setShowAdd(false)}>
        <label>Full name<input value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="Instructor name" />
</label>
        <label>Email<input value={draftEmail} onChange={(e) => setDraftEmail(e.target.value)} placeholder="name@institution.org" />
</label>
        <label>Department<select value={draftDepartment} onChange={(e) => setDraftDepartment(e.target.value)}>{["Admissible Execution", "HVAC Evidence Systems", "Institutional Assurance", "Scenario Operations"].map((x) => <option key={x}>{x}</option>)}</select>
</label>
        <div className="modal-actions">
<button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
<button className="btn btn-primary" onClick={addInstructor}>Create held record</button>
</div>
      </Modal>}

      {showAction && selected && <Modal title={`${actionType[0]}${actionType.slice(1).toLowerCase()} instructor`} subtitle={`${selected.name} · ${selected.id}`} onClose={() => setShowAction(false)}>
        <label>Workflow<select value={actionType} onChange={(e) => setActionType(e.target.value as typeof actionType)}>
<option value="APPROVE">Approve / activate</option>
<option value="SUSPEND">Suspend authority</option>
<option value="REINSTATE">Reinstate authority</option>
</select>
</label>
        <label>Evidence-bound reason<textarea rows={5} value={actionReason} onChange={(e) => setActionReason(e.target.value)} placeholder="State the evidence, authority, scope, limitations, and effective condition supporting this action." />
</label>
        <div className="boundary-note">This workflow records an institutional determination. It does not bypass credential, assignment, conflict, or continuity review.</div>
        <div className="modal-actions">
<button className="btn btn-ghost" onClick={() => setShowAction(false)}>Cancel</button>
<button className="btn btn-primary" onClick={executeAction}>Record determination</button>
</div>
      </Modal>}

      {notice && <div className="toast">{notice}</div>}
      <style jsx>{styles}</style>
    </main>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <article className="metric">
<span>{label}</span>
<strong>{value}</strong>
<small>{detail}</small>
</article>;
}

function Overview({ instructors, observations, audit, onSelect }: { instructors: Instructor[]; observations: Observation[]; audit: AuditEvent[]; onSelect: (id: string) => void }) {
  const attention = [...instructors].sort((a, b) => a.readiness - b.readiness).slice(0, 3);
  return <div className="stack">
    <div className="grid two">
      <Panel title="Readiness distribution" subtitle="Institutional readiness is a review signal, not automatic authorization.">
        <div className="readiness-list">{instructors.map((i) => <button key={i.id} className="readiness-row" onClick={() => onSelect(i.id)}>
<span>
<strong>{i.name}</strong>
<small>{i.department}</small>
</span>
<div className="bar">
<i style={{ width: `${i.readiness}%` }} />
</div>
<b>{i.readiness}%</b>
</button>)}</div>
      </Panel>
      <Panel title="Attention queue" subtitle="Earliest unresolved conditions first.">
        <div className="queue">{attention.map((i) => <button key={i.id} onClick={() => onSelect(i.id)}>
<span className={statusClass(i.status)}>{i.status}</span>
<strong>{i.name}</strong>
<p>{i.readiness < 60 ? "Readiness below institutional threshold." : i.workload >= 85 ? "Workload requires review." : "Conditional review remains open."}</p>
</button>)}</div>
      </Panel>
    </div>
    <div className="grid two">
      <Panel title="Review calendar" subtitle="Upcoming, open, and overdue observations.">
        <div className="table-wrap">
<table>
<thead>
<tr>
<th>Instructor</th>
<th>Date</th>
<th>Status</th>
<th>Reviewer</th>
</tr>
</thead>
<tbody>{observations.map((o) => <tr key={o.id}>
<td>{instructors.find((i) => i.id === o.instructorId)?.name}</td>
<td>{o.date}</td>
<td>
<span className={statusClass(o.status)}>{o.status}</span>
</td>
<td>{o.reviewer}</td>
</tr>)}</tbody>
</table>
</div>
      </Panel>
      <Panel title="Recent determinations" subtitle="Authority-changing activity is preserved in the audit chain.">
        <div className="timeline compact">{audit.slice(0, 4).map((e) => <div key={e.id}>
<span className={`determination ${e.determination.toLowerCase()}`}>{e.determination}</span>
<section>
<strong>{e.action}</strong>
<p>{e.target}</p>
<small>{e.timestamp} · {e.actor}</small>
</section>
</div>)}</div>
      </Panel>
    </div>
  </div>;
}

function Profiles(props: { instructors: Instructor[]; selected?: Instructor; selectedId: string; setSelectedId: (id: string) => void; query: string; setQuery: (v: string) => void; statusFilter: string; setStatusFilter: (v: string) => void; departmentFilter: string; setDepartmentFilter: (v: string) => void; departments: string[]; onAction: () => void }) {
  const { instructors, selected, selectedId, setSelectedId, query, setQuery, statusFilter, setStatusFilter, departmentFilter, setDepartmentFilter, departments, onAction } = props;
  return <div className="profile-layout">
    <div className="profile-list-panel">
      <Filters query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} departmentFilter={departmentFilter} setDepartmentFilter={setDepartmentFilter} departments={departments} />
      <div className="profile-list">{instructors.map((i) => <button key={i.id} className={selectedId === i.id ? "profile-card selected" : "profile-card"} onClick={() => setSelectedId(i.id)}>
<div className="avatar">{i.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}</div>
<span>
<strong>{i.name}</strong>
<small>{i.title}</small>
<em>{i.department}</em>
</span>
<b>{i.readiness}%</b>
</button>)}</div>
    </div>
    {selected && <div className="profile-detail">
      <div className="profile-head">
<div>
<div className="eyebrow">{selected.id}</div>
<h3>{selected.name}</h3>
<p>{selected.title} · {selected.department}</p>
</div>
<div>
<span className={statusClass(selected.status)}>{selected.status}</span>
<button className="btn btn-primary" onClick={onAction}>Authority action</button>
</div>
</div>
      <div className="mini-grid">
<Mini label="Readiness" value={`${selected.readiness}%`} />
<Mini label="Workload" value={`${selected.workload}%`} />
<Mini label="CE progress" value={`${selected.continuingEducationHours}/${selected.continuingEducationTarget}h`} />
<Mini label="Next review" value={selected.nextReview} />
</div>
      <div className="detail-sections">
        <section>
<h4>Teaching assignments</h4>{selected.courses.length ? selected.courses.map((x) => <span className="chip" key={x}>{x}</span>) : <p className="muted">No active course assignment.</p>}</section>
        <section>
<h4>Competency record</h4>{selected.competencies.length ? selected.competencies.map((x) => <span className="chip" key={x}>{x}</span>) : <p className="muted">Competency evidence not yet recorded.</p>}</section>
        <section>
<h4>Current authority</h4>{selected.authorizations.length ? selected.authorizations.map((a) => <div className="record" key={a.id}>
<span className={statusClass(a.status)}>{a.status}</span>
<strong>{a.scope}</strong>
<p>{a.level} · Expires {a.expires}</p>
<small>{a.limitations}</small>
</div>) : <p className="muted">No current teaching authorization.</p>}</section>
        <section>
<h4>Credential evidence</h4>{selected.licenses.length ? selected.licenses.map((c) => <div className="record" key={c.id}>
<span className={statusClass(c.status)}>{c.status}</span>
<strong>{c.name}</strong>
<p>{c.issuer} · {c.evidenceId}</p>
<small>Expires {c.expires}</small>
</div>) : <p className="muted">No verified credential evidence.</p>}</section>
        <section>
<h4>Notes</h4>
<p>{selected.notes}</p>
</section>
      </div>
    </div>}
  </div>;
}

function Authorizations({ instructors }: { instructors: Instructor[]; onSelect: (id: string) => void }) {
  const rows = instructors.flatMap((i) => i.authorizations.map((a) => ({ ...a, instructor: i.name, instructorStatus: i.status })));
  return <Panel title="Teaching authority register" subtitle="Authority is bounded by scope, level, effective dates, approver, limitations, and current instructor standing.">
<div className="table-wrap">
<table>
<thead>
<tr>
<th>Instructor</th>
<th>Scope</th>
<th>Level</th>
<th>Status</th>
<th>Effective</th>
<th>Expires</th>
<th>Limitations</th>
</tr>
</thead>
<tbody>{rows.map((r) => <tr key={r.id}>
<td>
<strong>{r.instructor}</strong>
<small>{r.id}</small>
</td>
<td>{r.scope}</td>
<td>{r.level}</td>
<td>
<span className={statusClass(r.status)}>{r.status}</span>
</td>
<td>{r.effective}</td>
<td>{r.expires}</td>
<td>{r.limitations}</td>
</tr>)}</tbody>
</table>
</div>
</Panel>;
}

function Assignments({ assignments, instructors }: { assignments: Assignment[]; instructors: Instructor[] }) {
  return <div className="stack">
<div className="grid three">{instructors.map((i) => <article className="workload-card" key={i.id}>
<span className={statusClass(i.workload >= 85 ? "HOLD" : "ALLOW")}>{i.workload >= 85 ? "HOLD" : "ALLOW"}</span>
<h3>{i.name}</h3>
<p>{i.department}</p>
<div className="bar large">
<i style={{ width: `${i.workload}%` }} />
</div>
<strong>{i.workload}% planned workload</strong>
<small>{i.workload >= 85 ? "Assignment review required before additional load." : "Within preferred planning threshold."}</small>
</article>)}</div>
<Panel title="Course assignment register" subtitle="Planned work remains non-binding until instructor authority and assignment conditions are revalidated.">
<div className="table-wrap">
<table>
<thead>
<tr>
<th>Course</th>
<th>Cohort</th>
<th>Instructor</th>
<th>Dates</th>
<th>Hours</th>
<th>Status</th>
</tr>
</thead>
<tbody>{assignments.map((a) => <tr key={a.id}>
<td>
<strong>{a.course}</strong>
<small>{a.id}</small>
</td>
<td>{a.cohort}</td>
<td>{instructors.find((i) => i.id === a.instructorId)?.name}</td>
<td>{a.start} → {a.end}</td>
<td>{a.hours}</td>
<td>
<span className={statusClass(a.status)}>{a.status}</span>
</td>
</tr>)}</tbody>
</table>
</div>
</Panel>
</div>;
}

function Competency({ instructors }: { instructors: Instructor[] }) {
  return <div className="grid two">{instructors.map((i) => <Panel key={i.id} title={i.name} subtitle={i.department}>
<div className="ce-line">
<strong>Continuing education</strong>
<span>{i.continuingEducationHours}/{i.continuingEducationTarget} hours</span>
</div>
<div className="bar large">
<i style={{ width: `${Math.min(100, i.continuingEducationHours / i.continuingEducationTarget * 100)}%` }} />
</div>
<h4 className="subhead">Verified competency areas</h4>
<div>{i.competencies.map((c) => <span key={c} className="chip">{c}</span>)}</div>
<div className="boundary-note">Competency evidence supports review. It does not expand teaching scope beyond current authorization.</div>
</Panel>)}</div>;
}

function Credentials({ instructors }: { instructors: Instructor[] }) {
  const rows = instructors.flatMap((i) => i.licenses.map((c) => ({ ...c, instructor: i.name })));
  return <Panel title="Certification and license register" subtitle="Expired or unsupported credentials invalidate dependent teaching authority until re-established.">
<div className="table-wrap">
<table>
<thead>
<tr>
<th>Instructor</th>
<th>Credential</th>
<th>Issuer</th>
<th>Issued</th>
<th>Expires</th>
<th>Status</th>
<th>Evidence</th>
</tr>
</thead>
<tbody>{rows.map((c) => <tr key={c.id}>
<td>{c.instructor}</td>
<td>
<strong>{c.name}</strong>
<small>{c.id}</small>
</td>
<td>{c.issuer}</td>
<td>{c.issued}</td>
<td>{c.expires}</td>
<td>
<span className={statusClass(c.status)}>{c.status}</span>
</td>
<td>{c.evidenceId}</td>
</tr>)}</tbody>
</table>
</div>
</Panel>;
}

function Reviews({ observations, instructors }: { observations: Observation[]; instructors: Instructor[] }) {
  return <div className="stack">
<div className="grid three">{observations.map((o) => <article className="review-card" key={o.id}>
<span className={statusClass(o.status)}>{o.status}</span>
<h3>{instructors.find((i) => i.id === o.instructorId)?.name}</h3>
<p>{o.date} · {o.reviewer}</p>
<strong>{o.score ? `${o.score}%` : "Pending score"}</strong>
<small>{o.findings}</small>
</article>)}</div>
<Panel title="Observation controls" subtitle="Observation evidence must identify reviewer authority, criteria, date, findings, limitations, and corrective action where applicable.">
<div className="control-grid">
<div>
<strong>Pre-observation</strong>
<p>Scope, course, criteria, reviewer independence, and evidence plan.</p>
</div>
<div>
<strong>Observation</strong>
<p>Direct record, attributable notes, learner interaction, and boundary compliance.</p>
</div>
<div>
<strong>Determination</strong>
<p>Findings, score, limitations, corrective actions, and next review date.</p>
</div>
<div>
<strong>Closure</strong>
<p>Response, evidence of correction, approver, and preserved outcome record.</p>
</div>
</div>
</Panel>
</div>;
}

function Evidence({ evidence, instructors }: { evidence: EvidenceRecord[]; instructors: Instructor[] }) {
  return <Panel title="Teaching evidence repository" subtitle="Evidence is attributable, dated, source-bound, status-labeled, and preserved for challenge and replay.">
<div className="table-wrap">
<table>
<thead>
<tr>
<th>Record</th>
<th>Instructor</th>
<th>Type</th>
<th>Title</th>
<th>Date</th>
<th>Source</th>
<th>Status</th>
<th>Integrity</th>
</tr>
</thead>
<tbody>{evidence.map((e) => <tr key={e.id}>
<td>{e.id}</td>
<td>{instructors.find((i) => i.id === e.instructorId)?.name}</td>
<td>{e.type}</td>
<td>
<strong>{e.title}</strong>
</td>
<td>{e.date}</td>
<td>{e.source}</td>
<td>
<span className={statusClass(e.status)}>{e.status}</span>
</td>
<td>
<code>{e.hash}</code>
</td>
</tr>)}</tbody>
</table>
</div>
</Panel>;
}

function Disclosures({ instructors }: { instructors: Instructor[] }) {
  const rows = instructors.flatMap((i) => i.conflicts.map((c) => ({ ...c, instructor: i.name })));
  return <div className="stack">
<Panel title="Conflict-of-interest register" subtitle="Disclosures do not automatically disqualify an instructor; they require bounded review, mitigation, recusal, escalation, or denial.">{rows.length ? <div className="table-wrap">
<table>
<thead>
<tr>
<th>Instructor</th>
<th>Category</th>
<th>Description</th>
<th>Status</th>
<th>Reviewed</th>
</tr>
</thead>
<tbody>{rows.map((r) => <tr key={r.id}>
<td>{r.instructor}</td>
<td>{r.category}</td>
<td>{r.description}</td>
<td>
<span className={statusClass(r.status)}>{r.status}</span>
</td>
<td>{r.reviewed}</td>
</tr>)}</tbody>
</table>
</div> : <p className="muted">No disclosures recorded.</p>}</Panel>
<Panel title="Required review logic" subtitle="The institution must preserve the reason for every conflict determination.">
<div className="control-grid">
<div>
<strong>Identify</strong>
<p>Relationship, financial interest, personal interest, prior role, or competing obligation.</p>
</div>
<div>
<strong>Assess</strong>
<p>Course, learner, assessment, procurement, credential, and review impact.</p>
</div>
<div>
<strong>Mitigate</strong>
<p>Disclosure, recusal, second review, content boundary, or reassignment.</p>
</div>
<div>
<strong>Revalidate</strong>
<p>Review whenever scope, relationship, assignment, or evidence changes.</p>
</div>
</div>
</Panel>
</div>;
}

function Workflows({ instructors, onSelect }: { instructors: Instructor[]; onSelect: (id: string) => void }) {
  return <div className="stack">
<div className="workflow-grid">
<Workflow title="Approval" determination="ALLOW" copy="Requires verified identity, qualification evidence, current credentials, bounded teaching scope, conflict review, and authorized approver." />
<Workflow title="Conditional approval" determination="HOLD" copy="Preserves limitations, co-instructor requirements, remediation, reduced scope, or time-bound review conditions." />
<Workflow title="Suspension" determination="DENY" copy="Stops teaching authority when evidence, credentials, conduct, scope, safety, or institutional conditions fail." />
<Workflow title="Reinstatement" determination="ESCALATE" copy="Requires proof of correction, current authority, independent review, and a new effective determination." />
</div>
<Panel title="Instructor workflow queue" subtitle="Select an instructor to record an approval, suspension, or reinstatement determination.">
<div className="queue">{instructors.map((i) => <button key={i.id} onClick={() => onSelect(i.id)}>
<span className={statusClass(i.status)}>{i.status}</span>
<strong>{i.name}</strong>
<p>{i.notes}</p>
</button>)}</div>
</Panel>
</div>;
}

function Audit({ audit }: { audit: AuditEvent[] }) {
  return <Panel title="Institutional audit timeline" subtitle="Every authority-changing event remains dated, attributable, reviewable, and bounded by its recorded evidence.">
<div className="timeline">{audit.map((e) => <div key={e.id}>
<span className={`determination ${e.determination.toLowerCase()}`}>{e.determination}</span>
<section>
<strong>{e.action}</strong>
<p>{e.target}</p>
<small>{e.timestamp} · {e.actor}</small>
<em>{e.details}</em>
</section>
</div>)}</div>
</Panel>;
}


const instructorGovernancePrinciples = [
  "Identity must be attributable before authority is considered.",
  "A profile is not a teaching authorization.",
  "Credentials must remain current and source-verifiable.",
  "Teaching authority is bounded by explicit scope.",
  "Authority must identify an accountable approver.",
  "Limitations travel with every authorization.",
  "Course assignment does not expand instructor authority.",
  "Workload risk must be reviewed before additional assignment.",
  "Competency evidence must remain distinct from attendance.",
  "Continuing education does not silently cure expired authority.",
  "Observation records must identify criteria and reviewer authority.",
  "Corrective actions require attributable closure evidence.",
  "Conflicts require disclosure, review, and preserved mitigation.",
  "Suspension interrupts dependent teaching execution.",
  "Reinstatement requires present-condition revalidation.",
  "Expired evidence invalidates dependent determinations.",
  "Uncertainty must remain visible rather than being averaged away.",
  "Institutional review must preserve dissent and challenge.",
  "Every authority-changing action requires an evidence-bound reason.",
  "Local records support operations but do not duplicate the Registry.",
  "Exports must preserve scope, time, source, and determination state.",
  "A readiness score summarizes evidence; it does not replace evidence.",
  "The earliest failed condition controls the operational result.",
  "No admissible evidence means no admissible instructional execution.",
] as const;

function Reports(props: { instructors: Instructor[]; query: string; setQuery: (v: string) => void; statusFilter: string; setStatusFilter: (v: string) => void; departmentFilter: string; setDepartmentFilter: (v: string) => void; departments: string[]; onExportCsv: () => void; onExportJson: () => void }) {
  return <div className="stack">
<Panel title="Advanced search and reporting" subtitle="Filter the live institutional record, then export the bounded result set.">
<Filters {...props} />
<div className="report-actions">
<button className="btn btn-ghost" onClick={props.onExportCsv}>Export CSV</button>
<button className="btn btn-primary" onClick={props.onExportJson}>Export complete JSON</button>
<span>{props.instructors.length} matching instructor records</span>
</div>
</Panel>
<Panel title="Readiness report" subtitle="A score summarizes current recorded conditions; the underlying evidence remains controlling.">
<div className="table-wrap">
<table>
<thead>
<tr>
<th>Instructor</th>
<th>Department</th>
<th>Status</th>
<th>Readiness</th>
<th>Workload</th>
<th>CE completion</th>
<th>Band</th>
</tr>
</thead>
<tbody>{props.instructors.map((i) => <tr key={i.id}>
<td>
<strong>{i.name}</strong>
<small>{i.id}</small>
</td>
<td>{i.department}</td>
<td>
<span className={statusClass(i.status)}>{i.status}</span>
</td>
<td>{i.readiness}%</td>
<td>{i.workload}%</td>
<td>{i.continuingEducationHours}/{i.continuingEducationTarget}h</td>
<td>{readinessBand(i.readiness)}</td>
</tr>)}</tbody>
</table>
</div>
</Panel>
<Panel title="Twenty-four instructor governance principles" subtitle="These controls preserve the distinction between identity, qualification, authority, assignment, and present permission to teach.">
<div className="principles-grid">
{instructorGovernancePrinciples.map((principle, index) => (
<article className="principle-card" key={principle}>
<span>{String(index + 1).padStart(2, "0")}</span>
<p>{principle}</p>
</article>
))}
</div>
</Panel>
</div>;
}

function Filters(props: { query: string; setQuery: (v: string) => void; statusFilter: string; setStatusFilter: (v: string) => void; departmentFilter: string; setDepartmentFilter: (v: string) => void; departments: string[] }) {
  return <div className="filters">
<input value={props.query} onChange={(e) => props.setQuery(e.target.value)} placeholder="Search name, course, competency, title…" />
<select value={props.statusFilter} onChange={(e) => props.setStatusFilter(e.target.value)}>
<option value="ALL">All statuses</option>{["ACTIVE", "REVIEW", "SUSPENDED", "DRAFT"].map((x) => <option key={x}>{x}</option>)}</select>
<select value={props.departmentFilter} onChange={(e) => props.setDepartmentFilter(e.target.value)}>
<option value="ALL">All departments</option>{props.departments.map((x) => <option key={x}>{x}</option>)}</select>
</div>;
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <section className="panel">
<div className="panel-head">
<div>
<h3>{title}</h3>
<p>{subtitle}</p>
</div>
</div>{children}</section>;
}
function Mini({ label, value }: { label: string; value: string }) { return <div className="mini">
<span>{label}</span>
<strong>{value}</strong>
</div>; }
function Workflow({ title, determination, copy }: { title: string; determination: AuditEvent["determination"]; copy: string }) { return <article className="workflow">
<span className={`determination ${determination.toLowerCase()}`}>{determination}</span>
<h3>{title}</h3>
<p>{copy}</p>
</article>; }
function Modal({ title, subtitle, children, onClose }: { title: string; subtitle: string; children: React.ReactNode; onClose: () => void }) { return <div className="modal-backdrop" onMouseDown={onClose}>
<div className="modal" onMouseDown={(e) => e.stopPropagation()}>
<button className="modal-x" onClick={onClose}>×</button>
<div className="eyebrow">GOVERNED WORKFLOW</div>
<h2>{title}</h2>
<p>{subtitle}</p>{children}</div>
</div>; }

const styles = `
:global(*){
box-sizing:border-box
}
 :global(body){
margin:0;
background:#050915;
color:#eaf3ff;
font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
}
.page-shell{
min-height:100vh;
background:radial-gradient(circle at 12% 0%,rgba(38,121,184,.18),transparent 32%),radial-gradient(circle at 95% 18%,rgba(119,81,180,.16),transparent 28%),linear-gradient(180deg,#07101f 0%,#050915 52%,#070b14 100%);
position:relative;
overflow:hidden;
padding:32px
}
.sky{
position:fixed;
inset:0;
pointer-events:none;
opacity:.65
}
.sky span{
position:absolute;
width:2px;
height:2px;
background:#fff;
border-radius:50%;
box-shadow:0 0 10px #8ddcff;
animation:drift 12s linear infinite
}
.sky span:nth-child(1){
left:10%;
top:20%
}
.sky span:nth-child(2){
left:32%;
top:8%;
animation-delay:-3s
}
.sky span:nth-child(3){
left:64%;
top:22%;
animation-delay:-7s
}
.sky span:nth-child(4){
left:82%;
top:12%;
animation-delay:-9s
}
.sky span:nth-child(5){
left:92%;
top:36%;
animation-delay:-5s
}
@keyframes drift{
0%{
transform:translate(0,0);
opacity:.2
}
50%{
opacity:1
}
100%{
transform:translate(-110px,80px);
opacity:.1
}

}
.hero,.metrics-grid,.workspace{
max-width:1600px;
margin:0 auto;
position:relative;
z-index:1
}
.hero{
padding:30px;
border:1px solid rgba(134,186,229,.22);
background:linear-gradient(135deg,rgba(9,24,43,.94),rgba(11,17,35,.9));
border-radius:24px;
box-shadow:0 28px 80px rgba(0,0,0,.32)
}
.hero-topline{
display:flex;
justify-content:space-between;
gap:28px;
align-items:flex-start
}
.eyebrow,.section-kicker,.side-title{
font-size:11px;
letter-spacing:.18em;
font-weight:800;
color:#73c7ff
}
.hero h1{
font-size:clamp(34px,5vw,64px);
line-height:1;
margin:10px 0 16px;
letter-spacing:-.045em
}
.hero-copy{
max-width:850px;
color:#a9bad0;
font-size:17px;
line-height:1.7;
margin:0
}
.hero-actions,.toolbar-actions,.modal-actions,.report-actions{
display:flex;
gap:10px;
flex-wrap:wrap;
align-items:center
}
.law-banner{
margin-top:26px;
padding:16px 18px;
border:1px solid rgba(255,196,92,.35);
background:rgba(96,65,15,.2);
border-radius:14px;
display:flex;
gap:12px;
align-items:center;
flex-wrap:wrap;
color:#d8e4f2
}
.law-banner .law-mark{
color:#ffd47e;
font-size:10px;
letter-spacing:.15em;
font-weight:900
}
.btn{
border:1px solid rgba(139,183,222,.25);
border-radius:10px;
padding:11px 14px;
font-weight:750;
color:#eaf5ff;
background:rgba(10,23,41,.7);
cursor:pointer
}
.btn:hover{
transform:translateY(-1px);
border-color:rgba(117,204,255,.6)
}
.btn-primary{
background:linear-gradient(135deg,#1985c5,#576ad8);
border-color:transparent
}
.btn-ghost{
background:rgba(8,17,31,.65)
}
.metrics-grid{
display:grid;
grid-template-columns:repeat(6,1fr);
gap:12px;
margin-top:16px
}
.metric{
padding:18px;
border:1px solid rgba(136,176,209,.18);
border-radius:16px;
background:rgba(8,17,31,.82)
}
.metric span{
display:block;
color:#91a7bd;
font-size:12px
}
.metric strong{
display:block;
font-size:30px;
margin:4px 0
}
.metric small{
color:#72c8ff
}
.workspace{
display:grid;
grid-template-columns:260px minmax(0,1fr);
gap:16px;
margin-top:16px
}
.sidebar{
border:1px solid rgba(136,176,209,.18);
border-radius:20px;
background:rgba(7,15,28,.9);
padding:16px;
align-self:start;
position:sticky;
top:16px
}
.side-title{
padding:7px 10px 14px
}
.sidebar nav{
display:grid;
gap:5px
}
.nav-item{
width:100%;
text-align:left;
padding:11px 12px;
border:1px solid transparent;
border-radius:11px;
background:transparent;
color:#d6e3f0;
cursor:pointer
}
.nav-item span{
display:block;
font-weight:750
}
.nav-item small{
display:block;
color:#71879e;
margin-top:2px;
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis
}
.nav-item:hover,.nav-item.active{
background:rgba(45,122,175,.18);
border-color:rgba(103,190,246,.3)
}
.nav-item.active span{
color:#8bd5ff
}
.side-boundary{
margin-top:18px;
padding:14px;
border-radius:12px;
background:rgba(11,28,46,.75);
border:1px solid rgba(111,186,232,.2)
}
.side-boundary strong{
font-size:13px;
color:#9bdcff
}
.side-boundary p{
font-size:12px;
color:#8094a9;
line-height:1.5;
margin:8px 0 0
}
.content{
min-width:0;
border:1px solid rgba(136,176,209,.18);
border-radius:20px;
background:rgba(6,13,25,.78);
padding:20px
}
.content-toolbar{
display:flex;
justify-content:space-between;
align-items:center;
gap:20px;
margin-bottom:16px
}
.content-toolbar h2{
margin:5px 0 0;
font-size:26px
}
.stack{
display:grid;
gap:16px
}
.grid{
display:grid;
gap:16px
}
.grid.two{
grid-template-columns:repeat(2,minmax(0,1fr))
}
.grid.three{
grid-template-columns:repeat(3,minmax(0,1fr))
}
.panel,.workload-card,.review-card,.workflow{
border:1px solid rgba(132,177,213,.18);
border-radius:16px;
background:linear-gradient(180deg,rgba(12,25,43,.84),rgba(8,16,29,.88));
padding:18px;
min-width:0
}
.panel-head h3,.workload-card h3,.review-card h3,.workflow h3{
margin:0 0 5px
}
.panel-head p,.workload-card p,.review-card p,.workflow p{
color:#8fa3b8;
line-height:1.55;
margin:0 0 16px
}
.table-wrap{
overflow:auto;
border-radius:12px;
border:1px solid rgba(139,177,207,.14)
}
table{
width:100%;
border-collapse:collapse;
min-width:780px
}
th,td{
text-align:left;
padding:12px;
border-bottom:1px solid rgba(139,177,207,.12);
vertical-align:top
}
th{
font-size:10px;
letter-spacing:.13em;
color:#78bfe9;
background:rgba(8,20,35,.8)
}
td{
font-size:13px;
color:#cbd8e5
}
td strong,td small{
display:block
}
td small{
color:#70879d;
margin-top:3px
}
.status,.determination{
display:inline-flex;
align-items:center;
justify-content:center;
border-radius:999px;
padding:5px 8px;
font-size:9px;
letter-spacing:.08em;
font-weight:900;
border:1px solid rgba(255,255,255,.12)
}
.status-active,.status-authorized,.status-current,.status-verified,.status-complete,.status-allow,.determination.allow{
color:#8ff0c0;
background:rgba(22,122,76,.18);
border-color:rgba(65,218,147,.28)
}
.status-review,.status-conditional,.status-expiring,.status-pending,.status-open,.status-hold,.determination.hold{
color:#ffd27c;
background:rgba(137,91,17,.2);
border-color:rgba(235,180,72,.3)
}
.status-suspended,.status-expired,.status-rejected,.status-overdue,.status-deny,.determination.deny{
color:#ff9f9f;
background:rgba(142,42,42,.2);
border-color:rgba(246,93,93,.32)
}
.status-draft,.status-escalated,.determination.escalate{
color:#c4a9ff;
background:rgba(89,59,151,.2);
border-color:rgba(156,117,239,.3)
}
.status-clear,.status-planned{
color:#9fdfff;
background:rgba(32,104,148,.2)
}
.status-mitigation,.status-active.status-active{
color:#9fe8ff
}
.readiness-list{
display:grid;
gap:9px
}
.readiness-row{
display:grid;
grid-template-columns:minmax(150px,1fr) 1.2fr 50px;
gap:12px;
align-items:center;
padding:10px;
border:0;
border-radius:10px;
background:rgba(4,12,23,.55);
color:#dce8f4;
text-align:left;
cursor:pointer
}
.readiness-row span strong,.readiness-row span small{
display:block
}
.readiness-row span small{
color:#70879d
}
.bar{
height:7px;
border-radius:999px;
background:#18283a;
overflow:hidden
}
.bar.large{
height:9px;
margin:12px 0
}
.bar i{
display:block;
height:100%;
background:linear-gradient(90deg,#2ea4e2,#7e78ed);
border-radius:inherit
}
.queue{
display:grid;
gap:10px
}
.queue button{
display:grid;
grid-template-columns:auto 1fr;
gap:4px 10px;
text-align:left;
padding:12px;
border-radius:11px;
border:1px solid rgba(129,177,211,.14);
background:rgba(4,12,23,.6);
color:#dce9f6;
cursor:pointer
}
.queue button strong{
align-self:center
}
.queue button p{
grid-column:2;
color:#8297ac;
margin:0
}
.profile-layout{
display:grid;
grid-template-columns:360px minmax(0,1fr);
gap:16px
}
.profile-list-panel,.profile-detail{
border:1px solid rgba(136,176,209,.17);
border-radius:16px;
background:rgba(9,19,34,.76);
padding:14px;
min-width:0
}
.filters{
display:grid;
grid-template-columns:1.5fr 1fr 1fr;
gap:8px;
margin-bottom:12px
}
input,select,textarea{
width:100%;
border:1px solid rgba(137,181,214,.22);
background:#081321;
color:#dce9f5;
border-radius:9px;
padding:11px;
font:inherit
}
textarea{
resize:vertical
}
.profile-list{
display:grid;
gap:8px;
max-height:720px;
overflow:auto
}
.profile-card{
display:grid;
grid-template-columns:44px 1fr auto;
gap:10px;
align-items:center;
padding:11px;
border:1px solid transparent;
border-radius:12px;
background:rgba(4,12,23,.55);
color:#dce8f4;
text-align:left;
cursor:pointer
}
.profile-card.selected{
border-color:rgba(92,185,240,.45);
background:rgba(36,111,161,.18)
}
.avatar{
width:44px;
height:44px;
border-radius:12px;
display:grid;
place-items:center;
background:linear-gradient(135deg,#1f82b8,#5a63c7);
font-weight:900
}
.profile-card span strong,.profile-card span small,.profile-card span em{
display:block
}
.profile-card span small{
color:#9aacc0
}
.profile-card span em{
color:#6f879f;
font-style:normal;
font-size:11px
}
.profile-card b{
color:#7ed3ff
}
.profile-head{
display:flex;
justify-content:space-between;
gap:18px;
align-items:flex-start
}
.profile-head h3{
font-size:30px;
margin:6px 0
}
.profile-head p{
color:#8fa3b8
}
.profile-head>div:last-child{
display:flex;
gap:8px;
align-items:center;
flex-wrap:wrap;
justify-content:flex-end
}
.mini-grid{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:10px;
margin:16px 0
}
.mini{
padding:13px;
border-radius:11px;
background:rgba(4,12,23,.65);
border:1px solid rgba(130,176,209,.13)
}
.mini span,.mini strong{
display:block
}
.mini span{
color:#71879d;
font-size:11px
}
.mini strong{
margin-top:4px
}
.detail-sections{
display:grid;
gap:15px
}
.detail-sections section{
padding-top:12px;
border-top:1px solid rgba(130,176,209,.13)
}
.detail-sections h4,.subhead{
margin:0 0 9px
}
.chip{
display:inline-flex;
padding:6px 9px;
border-radius:999px;
background:rgba(51,116,161,.18);
border:1px solid rgba(93,180,235,.22);
color:#a9ddff;
font-size:12px;
margin:0 6px 6px 0
}
.record{
position:relative;
padding:12px;
border-radius:10px;
background:rgba(4,12,23,.55);
margin-bottom:8px
}
.record .status{
float:right
}
.record strong,.record p,.record small{
display:block
}
.record p,.record small{
color:#8095aa;
margin:4px 0
}
.muted{
color:#71879d
}
.ce-line{
display:flex;
justify-content:space-between;
color:#c9d8e5
}
.boundary-note{
margin-top:14px;
padding:12px;
border-left:3px solid #e0ad4a;
background:rgba(119,79,14,.15);
color:#cbbd9b;
font-size:12px;
line-height:1.55
}
.workload-card strong,.workload-card small,.review-card strong,.review-card small{
display:block
}
.workload-card small,.review-card small{
color:#8196aa;
margin-top:7px;
line-height:1.5
}
.review-card>strong{
font-size:28px;
margin-top:12px
}
.control-grid{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:10px
}
.control-grid div{
padding:13px;
border-radius:11px;
background:rgba(4,12,23,.58)
}
.control-grid p{
color:#7f95aa;
line-height:1.5;
margin:5px 0 0;
font-size:12px
}
.workflow-grid{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:12px
}
.workflow p{
margin-bottom:0
}
.timeline{
display:grid
}
.timeline>div{
display:grid;
grid-template-columns:82px 1fr;
gap:14px;
padding:14px 0;
border-bottom:1px solid rgba(130,176,209,.13)
}
.timeline section strong,.timeline section p,.timeline section small,.timeline section em{
display:block
}
.timeline section p{
color:#aab9c8;
margin:3px 0
}
.timeline section small{
color:#6e8499
}
.timeline section em{
font-style:normal;
color:#899db0;
margin-top:7px;
line-height:1.5
}
.timeline.compact>div{
padding:9px 0
}
.report-actions{
margin-top:12px
}
.report-actions span{
color:#8297ac
}
.principles-grid{
display:grid;
grid-template-columns:repeat(3,minmax(0,1fr));
gap:10px;
}
.principle-card{
min-height:118px;
padding:14px;
border-radius:12px;
border:1px solid rgba(132,177,213,.15);
background:rgba(4,12,23,.56);
}
.principle-card span{
display:inline-flex;
width:30px;
height:30px;
align-items:center;
justify-content:center;
border-radius:9px;
background:rgba(46,164,226,.14);
color:#82d2ff;
font-size:10px;
font-weight:900;
letter-spacing:.08em;
}
.principle-card p{
margin:10px 0 0;
color:#aebfce;
font-size:12px;
line-height:1.55;
}
.modal-backdrop{
position:fixed;
inset:0;
background:rgba(0,0,0,.72);
display:grid;
place-items:center;
z-index:20;
padding:20px
}
.modal{
width:min(620px,100%);
max-height:90vh;
overflow:auto;
border:1px solid rgba(118,190,237,.32);
border-radius:20px;
background:linear-gradient(180deg,#0c1b2e,#08111f);
padding:24px;
box-shadow:0 30px 100px rgba(0,0,0,.6);
position:relative
}
.modal h2{
margin:7px 0
}
.modal>p{
color:#8fa3b8
}
.modal label{
display:block;
color:#aabccd;
font-size:12px;
font-weight:700;
margin-top:14px
}
.modal label input,.modal label select,.modal label textarea{
margin-top:6px
}
.modal-actions{
justify-content:flex-end;
margin-top:18px
}
.modal-x{
position:absolute;
right:14px;
top:10px;
border:0;
background:transparent;
color:#9bb0c5;
font-size:28px;
cursor:pointer
}
.toast{
position:fixed;
right:24px;
bottom:24px;
z-index:30;
padding:14px 18px;
border-radius:12px;
background:#102a3e;
border:1px solid rgba(106,201,255,.35);
box-shadow:0 18px 50px rgba(0,0,0,.4);
color:#dff4ff
}
code{
color:#9ddfff
}
@media(max-width:1200px){
.metrics-grid{
grid-template-columns:repeat(3,1fr)
}
.workspace{
grid-template-columns:220px minmax(0,1fr)
}
.profile-layout{
grid-template-columns:310px minmax(0,1fr)
}
.grid.three,.workflow-grid{
grid-template-columns:repeat(2,1fr)
}
.control-grid{
grid-template-columns:repeat(2,1fr)
}

}
@media(max-width:900px){
.principles-grid{
grid-template-columns:repeat(2,minmax(0,1fr));
}
.page-shell{
padding:16px
}
.hero-topline,.content-toolbar{
flex-direction:column
}
.metrics-grid{
grid-template-columns:repeat(2,1fr)
}
.workspace{
grid-template-columns:1fr
}
.sidebar{
position:static
}
.sidebar nav{
grid-template-columns:repeat(3,1fr)
}
.grid.two,.profile-layout{
grid-template-columns:1fr
}
.profile-list{
max-height:360px
}
.mini-grid{
grid-template-columns:repeat(2,1fr)
}
.filters{
grid-template-columns:1fr
}
.hero-actions{
width:100%
}
.hero-actions .btn{
flex:1
}

}
@media(max-width:600px){
.principles-grid{
grid-template-columns:1fr;
}
.metrics-grid,.grid.three,.workflow-grid,.control-grid{
grid-template-columns:1fr
}
.sidebar nav{
grid-template-columns:repeat(2,1fr)
}
.law-banner{
align-items:flex-start;
flex-direction:column
}
.mini-grid{
grid-template-columns:1fr
}
.profile-head{
flex-direction:column
}
.profile-head>div:last-child{
justify-content:flex-start
}
.content{
padding:13px
}
.hero{
padding:20px
}

}

`;
