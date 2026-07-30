"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Tab = "command" | "learners" | "reviews" | "cohorts" | "reports";
type LearnerState = "ON_TRACK" | "WATCH" | "AT_RISK" | "COMPLETE";
type ReviewState = "PENDING" | "IN_REVIEW" | "RETURNED" | "APPROVED";
type Priority = "HIGH" | "MEDIUM" | "LOW";
type NoticeTone = "INFO" | "WARNING" | "SUCCESS";

type Learner = {
  id: string;
  name: string;
  role: string;
  organization: string;
  cohort: string;
  state: LearnerState;
  progress: number;
  average: number;
  completed: number;
  total: number;
  lastActivity: string;
  activeModule: string;
  evidence: number;
  flags: string[];
};

type Review = {
  id: string;
  learnerId: string;
  learner: string;
  artifact: string;
  kind: string;
  submitted: string;
  due: string;
  state: ReviewState;
  priority: Priority;
  score: number | null;
  finding: string;
};

type Cohort = {
  id: string;
  name: string;
  program: string;
  instructor: string;
  learners: number;
  active: number;
  completion: number;
  start: string;
  end: string;
  cadence: string;
};

type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: string;
  tone: NoticeTone;
  created: string;
};

type PersistedState = {
  activeTab: Tab;
  search: string;
  learnerFilter: "ALL" | LearnerState;
  reviewFilter: "ALL" | ReviewState;
  selectedLearnerId: string;
  selectedReviewId: string;
  instructorNotes: Record<string, string>;
  reviewFindings: Record<string, string>;
  announcements: Announcement[];
};

const STORAGE_KEY = "ta14-academy-instructor-console-v1";

const learners: Learner[] = [
  {
    id: "L-2041",
    name: "Maya Chen",
    role: "Governance Analyst",
    organization: "Northstar Operations",
    cohort: "Applied Route Review — Summer 2026",
    state: "ON_TRACK",
    progress: 82,
    average: 93,
    completed: 14,
    total: 17,
    lastActivity: "12 minutes ago",
    activeModule: "Challenge and Appeal Lab",
    evidence: 37,
    flags: [],
  },
  {
    id: "L-2042",
    name: "Elena Morales",
    role: "Compliance Lead",
    organization: "Civic Systems Group",
    cohort: "Applied Route Review — Summer 2026",
    state: "WATCH",
    progress: 64,
    average: 86,
    completed: 11,
    total: 17,
    lastActivity: "Yesterday",
    activeModule: "Evidence Conflict Resolution Lab",
    evidence: 24,
    flags: ["Two returned reviews", "Authority competency below target"],
  },
  {
    id: "L-2043",
    name: "Jon Bell",
    role: "Operations Reviewer",
    organization: "Meridian Exchange",
    cohort: "Applied Route Review — Summer 2026",
    state: "AT_RISK",
    progress: 38,
    average: 72,
    completed: 6,
    total: 17,
    lastActivity: "9 days ago",
    activeModule: "Authority and Binding",
    evidence: 11,
    flags: ["Inactive for 9 days", "Assessment below threshold", "Missing continuity evidence"],
  },
  {
    id: "L-2044",
    name: "Priya Shah",
    role: "Program Manager",
    organization: "Axis Public Services",
    cohort: "Foundation Certification — July 2026",
    state: "COMPLETE",
    progress: 100,
    average: 96,
    completed: 12,
    total: 12,
    lastActivity: "2 days ago",
    activeModule: "Credential issued",
    evidence: 42,
    flags: [],
  },
  {
    id: "L-2045",
    name: "David Okafor",
    role: "Risk Specialist",
    organization: "Harborline Health",
    cohort: "Foundation Certification — July 2026",
    state: "ON_TRACK",
    progress: 75,
    average: 90,
    completed: 9,
    total: 12,
    lastActivity: "3 hours ago",
    activeModule: "Execution Correspondence",
    evidence: 28,
    flags: [],
  },
  {
    id: "L-2046",
    name: "Sofia Lind",
    role: "Audit Manager",
    organization: "Polar Ridge Finance",
    cohort: "Reviewer Renewal — Q3 2026",
    state: "WATCH",
    progress: 58,
    average: 84,
    completed: 7,
    total: 12,
    lastActivity: "3 days ago",
    activeModule: "Runtime Governance Lab",
    evidence: 19,
    flags: ["Renewal deadline in 19 days"],
  },
  {
    id: "L-2047",
    name: "Marcus Reed",
    role: "Policy Architect",
    organization: "Clearpath Energy",
    cohort: "Reviewer Renewal — Q3 2026",
    state: "ON_TRACK",
    progress: 91,
    average: 95,
    completed: 11,
    total: 12,
    lastActivity: "45 minutes ago",
    activeModule: "Capstone Mission",
    evidence: 39,
    flags: [],
  },
  {
    id: "L-2048",
    name: "Aisha Grant",
    role: "Governance Counsel",
    organization: "Commonwealth Transit",
    cohort: "Applied Route Review — Summer 2026",
    state: "ON_TRACK",
    progress: 70,
    average: 91,
    completed: 12,
    total: 17,
    lastActivity: "Today",
    activeModule: "Decision Record Lab",
    evidence: 31,
    flags: [],
  },
];

const reviews: Review[] = [
  {
    id: "R-771",
    learnerId: "L-2041",
    learner: "Maya Chen",
    artifact: "Challenge record — Mission 4",
    kind: "Applied lab",
    submitted: "Today, 08:14",
    due: "Tomorrow",
    state: "PENDING",
    priority: "HIGH",
    score: null,
    finding: "",
  },
  {
    id: "R-772",
    learnerId: "L-2042",
    learner: "Elena Morales",
    artifact: "Evidence conflict determination",
    kind: "Applied lab",
    submitted: "Yesterday",
    due: "Today",
    state: "IN_REVIEW",
    priority: "HIGH",
    score: null,
    finding: "Distinguishes conflicting representations but must preserve the unresolved authority condition explicitly.",
  },
  {
    id: "R-773",
    learnerId: "L-2043",
    learner: "Jon Bell",
    artifact: "Authority boundary exercise",
    kind: "Scenario assessment",
    submitted: "6 days ago",
    due: "Overdue",
    state: "RETURNED",
    priority: "HIGH",
    score: 68,
    finding: "Authority source was named, but scope and binding conditions were not established.",
  },
  {
    id: "R-774",
    learnerId: "L-2045",
    learner: "David Okafor",
    artifact: "Execution correspondence review",
    kind: "Foundation exercise",
    submitted: "Today, 06:32",
    due: "In 2 days",
    state: "PENDING",
    priority: "MEDIUM",
    score: null,
    finding: "",
  },
  {
    id: "R-775",
    learnerId: "L-2047",
    learner: "Marcus Reed",
    artifact: "Capstone route package",
    kind: "Capstone",
    submitted: "Yesterday",
    due: "In 3 days",
    state: "IN_REVIEW",
    priority: "HIGH",
    score: null,
    finding: "Strong route continuity. Verification record and appeal posture remain under review.",
  },
  {
    id: "R-776",
    learnerId: "L-2048",
    learner: "Aisha Grant",
    artifact: "Decision record package",
    kind: "Applied lab",
    submitted: "2 days ago",
    due: "Tomorrow",
    state: "APPROVED",
    priority: "LOW",
    score: 97,
    finding: "Decision record is attributable, versioned, and preserves both authority and dissent.",
  },
];

const cohorts: Cohort[] = [
  {
    id: "C-301",
    name: "Applied Route Review — Summer 2026",
    program: "Route Validation Analyst",
    instructor: "Greggory Butler",
    learners: 18,
    active: 17,
    completion: 67,
    start: "2026-06-15",
    end: "2026-09-04",
    cadence: "Tuesdays and Thursdays",
  },
  {
    id: "C-302",
    name: "Foundation Certification — July 2026",
    program: "Execution Admissibility Foundations",
    instructor: "Academy Faculty",
    learners: 24,
    active: 21,
    completion: 78,
    start: "2026-07-01",
    end: "2026-08-14",
    cadence: "Self-paced with weekly review",
  },
  {
    id: "C-303",
    name: "Reviewer Renewal — Q3 2026",
    program: "Governed Execution Reviewer Renewal",
    instructor: "Greggory Butler",
    learners: 12,
    active: 12,
    completion: 61,
    start: "2026-07-10",
    end: "2026-08-28",
    cadence: "Weekly clinic",
  },
];

const defaultAnnouncements: Announcement[] = [
  {
    id: "A-1",
    title: "Capstone review window opens Friday",
    body: "Submit complete route packages with preserved evidence, authority, determination, execution, and verification records.",
    audience: "Applied Route Review — Summer 2026",
    tone: "INFO",
    created: "Today",
  },
  {
    id: "A-2",
    title: "Renewal evidence reminder",
    body: "Renewal candidates must preserve two current review records before the attestation window closes.",
    audience: "Reviewer Renewal — Q3 2026",
    tone: "WARNING",
    created: "Yesterday",
  },
];

const competencyRows = [
  { label: "Reality and record", demonstrated: 38, developing: 12, attention: 2 },
  { label: "Continuity", demonstrated: 34, developing: 15, attention: 3 },
  { label: "Admissibility", demonstrated: 36, developing: 13, attention: 3 },
  { label: "Authority and binding", demonstrated: 29, developing: 18, attention: 5 },
  { label: "Execution correspondence", demonstrated: 31, developing: 17, attention: 4 },
  { label: "Outcome verification", demonstrated: 33, developing: 16, attention: 3 },
  { label: "Conflict resolution", demonstrated: 24, developing: 21, attention: 7 },
  { label: "Challenge and appeal", demonstrated: 19, developing: 24, attention: 9 },
];

function stateLabel(state: LearnerState) {
  if (state === "ON_TRACK") return "On track";
  if (state === "AT_RISK") return "At risk";
  if (state === "COMPLETE") return "Complete";
  return "Watch";
}

function reviewLabel(state: ReviewState) {
  if (state === "IN_REVIEW") return "In review";
  if (state === "RETURNED") return "Returned";
  if (state === "APPROVED") return "Approved";
  return "Pending";
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function InstructorConsolePage() {
  const [activeTab, setActiveTab] = useState<Tab>("command");
  const [search, setSearch] = useState("");
  const [learnerFilter, setLearnerFilter] = useState<"ALL" | LearnerState>("ALL");
  const [reviewFilter, setReviewFilter] = useState<"ALL" | ReviewState>("ALL");
  const [selectedLearnerId, setSelectedLearnerId] = useState(learners[0].id);
  const [selectedReviewId, setSelectedReviewId] = useState(reviews[0].id);
  const [instructorNotes, setInstructorNotes] = useState<Record<string, string>>({});
  const [reviewFindings, setReviewFindings] = useState<Record<string, string>>({});
  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [announcementAudience, setAnnouncementAudience] = useState(cohorts[0].name);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (parsed.activeTab) setActiveTab(parsed.activeTab);
      if (typeof parsed.search === "string") setSearch(parsed.search);
      if (parsed.learnerFilter) setLearnerFilter(parsed.learnerFilter);
      if (parsed.reviewFilter) setReviewFilter(parsed.reviewFilter);
      if (parsed.selectedLearnerId) setSelectedLearnerId(parsed.selectedLearnerId);
      if (parsed.selectedReviewId) setSelectedReviewId(parsed.selectedReviewId);
      if (parsed.instructorNotes) setInstructorNotes(parsed.instructorNotes);
      if (parsed.reviewFindings) setReviewFindings(parsed.reviewFindings);
      if (parsed.announcements) setAnnouncements(parsed.announcements);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const payload: PersistedState = {
      activeTab,
      search,
      learnerFilter,
      reviewFilter,
      selectedLearnerId,
      selectedReviewId,
      instructorNotes,
      reviewFindings,
      announcements,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setSaved(true);
    const timer = window.setTimeout(() => setSaved(false), 900);
    return () => window.clearTimeout(timer);
  }, [activeTab, search, learnerFilter, reviewFilter, selectedLearnerId, selectedReviewId, instructorNotes, reviewFindings, announcements]);

  const filteredLearners = useMemo(() => {
    const query = search.trim().toLowerCase();
    return learners.filter((learner) => {
      const matchesFilter = learnerFilter === "ALL" || learner.state === learnerFilter;
      const matchesSearch = !query || [learner.name, learner.role, learner.organization, learner.cohort, learner.activeModule]
        .join(" ")
        .toLowerCase()
        .includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [search, learnerFilter]);

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reviews.filter((review) => {
      const matchesFilter = reviewFilter === "ALL" || review.state === reviewFilter;
      const matchesSearch = !query || [review.learner, review.artifact, review.kind, review.id]
        .join(" ")
        .toLowerCase()
        .includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [search, reviewFilter]);

  const selectedLearner = learners.find((learner) => learner.id === selectedLearnerId) ?? learners[0];
  const selectedReview = reviews.find((review) => review.id === selectedReviewId) ?? reviews[0];
  const atRiskCount = learners.filter((learner) => learner.state === "AT_RISK").length;
  const watchCount = learners.filter((learner) => learner.state === "WATCH").length;
  const pendingCount = reviews.filter((review) => review.state === "PENDING" || review.state === "IN_REVIEW").length;
  const activeLearners = learners.filter((learner) => learner.state !== "COMPLETE").length;
  const averageProgress = Math.round(learners.reduce((sum, learner) => sum + learner.progress, 0) / learners.length);

  function addAnnouncement() {
    if (!announcementTitle.trim() || !announcementBody.trim()) return;
    setAnnouncements((current) => [
      {
        id: `A-${Date.now()}`,
        title: announcementTitle.trim(),
        body: announcementBody.trim(),
        audience: announcementAudience,
        tone: "INFO",
        created: "Just now",
      },
      ...current,
    ]);
    setAnnouncementTitle("");
    setAnnouncementBody("");
  }

  function updateFinding(value: string) {
    setReviewFindings((current) => ({ ...current, [selectedReview.id]: value }));
  }

  function exportInstructorReport() {
    downloadJson("ta14-academy-instructor-report.json", {
      generatedAt: new Date().toISOString(),
      summary: { activeLearners, averageProgress, pendingReviews: pendingCount, atRisk: atRiskCount, watch: watchCount },
      cohorts,
      learners,
      reviews: reviews.map((review) => ({ ...review, instructorFinding: reviewFindings[review.id] ?? review.finding })),
      announcements,
    });
  }

  return (
    <main className="academy-shell">
      <header className="topbar">
        <div className="brand-block">
          <Link className="brand" href="/academy">TA-14 Academy</Link>
          <span className="divider">/</span>
          <span className="section-name">Instructor Console</span>
        </div>
        <div className="top-actions">
          <span className={`save-state ${saved ? "is-saving" : ""}`}>{saved ? "Saved locally" : "Workspace current"}</span>
          <button className="button ghost" onClick={exportInstructorReport}>Export report</button>
          <Link className="button primary" href="/academy/dashboard">Learner view</Link>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">FACULTY WORKSPACE · GOVERNED LEARNING OVERSIGHT</p>
          <h1>Instructor Console</h1>
          <p className="hero-copy">
            Review learner evidence, identify intervention needs, preserve attributable findings, and manage Academy cohorts without confusing course completion with operational authority.
          </p>
        </div>
        <div className="hero-badge">
          <strong>{pendingCount}</strong>
          <span>open reviews</span>
          <small>{atRiskCount + watchCount} learners need attention</small>
        </div>
      </section>

      <nav className="tabs" aria-label="Instructor console sections">
        {([
          ["command", "Command center"],
          ["learners", "Learners"],
          ["reviews", "Reviews"],
          ["cohorts", "Cohorts"],
          ["reports", "Reports & notices"],
        ] as [Tab, string][]).map(([value, label]) => (
          <button key={value} className={activeTab === value ? "active" : ""} onClick={() => setActiveTab(value)}>{label}</button>
        ))}
      </nav>

      {activeTab === "command" && (
        <section className="page-section">
          <div className="metric-grid">
            <article className="metric-card"><span>Active learners</span><strong>{activeLearners}</strong><small>Across {cohorts.length} current cohorts</small></article>
            <article className="metric-card"><span>Average progress</span><strong>{averageProgress}%</strong><small>Weighted across current enrollment</small></article>
            <article className="metric-card warning"><span>Attention queue</span><strong>{atRiskCount + watchCount}</strong><small>{atRiskCount} at risk · {watchCount} watch</small></article>
            <article className="metric-card"><span>Review queue</span><strong>{pendingCount}</strong><small>{reviews.filter((review) => review.priority === "HIGH" && review.state !== "APPROVED").length} high priority</small></article>
          </div>

          <div className="two-column command-grid">
            <article className="panel">
              <div className="panel-heading">
                <div><p className="kicker">INTERVENTION QUEUE</p><h2>Learners requiring attention</h2></div>
                <button className="text-button" onClick={() => { setLearnerFilter("WATCH"); setActiveTab("learners"); }}>Open roster →</button>
              </div>
              <div className="stack-list">
                {learners.filter((learner) => learner.state === "WATCH" || learner.state === "AT_RISK").map((learner) => (
                  <button key={learner.id} className="learner-row" onClick={() => { setSelectedLearnerId(learner.id); setActiveTab("learners"); }}>
                    <div className="avatar">{learner.name.split(" ").map((part) => part[0]).join("")}</div>
                    <div className="row-main"><strong>{learner.name}</strong><span>{learner.activeModule}</span><small>{learner.flags[0]}</small></div>
                    <div className="row-end"><span className={`pill ${learner.state.toLowerCase()}`}>{stateLabel(learner.state)}</span><b>{learner.progress}%</b></div>
                  </button>
                ))}
              </div>
            </article>

            <article className="panel">
              <div className="panel-heading">
                <div><p className="kicker">FACULTY ACTION</p><h2>Priority reviews</h2></div>
                <button className="text-button" onClick={() => setActiveTab("reviews")}>Open queue →</button>
              </div>
              <div className="stack-list">
                {reviews.filter((review) => review.state !== "APPROVED").slice(0, 4).map((review) => (
                  <button key={review.id} className="review-row" onClick={() => { setSelectedReviewId(review.id); setActiveTab("reviews"); }}>
                    <div><strong>{review.artifact}</strong><span>{review.learner} · {review.kind}</span></div>
                    <div className="row-end"><span className={`priority ${review.priority.toLowerCase()}`}>{review.priority}</span><small>{review.due}</small></div>
                  </button>
                ))}
              </div>
            </article>
          </div>

          <div className="two-column lower-grid">
            <article className="panel">
              <div className="panel-heading"><div><p className="kicker">COHORT HEALTH</p><h2>Completion posture</h2></div></div>
              <div className="cohort-summary-list">
                {cohorts.map((cohort) => (
                  <div className="cohort-summary" key={cohort.id}>
                    <div className="cohort-top"><div><strong>{cohort.name}</strong><span>{cohort.active} active of {cohort.learners}</span></div><b>{cohort.completion}%</b></div>
                    <div className="progress-track"><span style={{ width: `${cohort.completion}%` }} /></div>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel governance-panel">
              <p className="kicker">INSTRUCTIONAL GOVERNANCE</p>
              <h2>Credential evidence is not execution authority</h2>
              <p>
                Academy records demonstrate learning, assessment, and reviewed competence. They do not independently authorize a learner to execute a governed action in an operational system.
              </p>
              <ul>
                <li>Preserve the reviewed artifact and the instructor finding.</li>
                <li>State uncertainty rather than manufacturing a passing condition.</li>
                <li>Record remediation before issuing or renewing a credential.</li>
              </ul>
              <Link className="inline-link" href="/academy/authority-and-binding">Review authority and binding →</Link>
            </article>
          </div>
        </section>
      )}

      {activeTab === "learners" && (
        <section className="page-section">
          <div className="toolbar">
            <label className="search-box"><span>Search</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, organization, cohort, module…" /></label>
            <div className="filter-group">
              {(["ALL", "ON_TRACK", "WATCH", "AT_RISK", "COMPLETE"] as const).map((value) => (
                <button key={value} className={learnerFilter === value ? "active" : ""} onClick={() => setLearnerFilter(value)}>{value === "ALL" ? "All" : stateLabel(value)}</button>
              ))}
            </div>
          </div>

          <div className="workspace-grid">
            <article className="panel roster-panel">
              <div className="panel-heading"><div><p className="kicker">LEARNER ROSTER</p><h2>{filteredLearners.length} records</h2></div></div>
              <div className="roster-table" role="table">
                <div className="table-head" role="row"><span>Learner</span><span>Status</span><span>Progress</span><span>Average</span></div>
                {filteredLearners.map((learner) => (
                  <button key={learner.id} className={`table-row ${selectedLearnerId === learner.id ? "selected" : ""}`} onClick={() => setSelectedLearnerId(learner.id)}>
                    <span className="person-cell"><b>{learner.name}</b><small>{learner.organization}</small></span>
                    <span><em className={`pill ${learner.state.toLowerCase()}`}>{stateLabel(learner.state)}</em></span>
                    <span><b>{learner.progress}%</b><small>{learner.completed}/{learner.total} complete</small></span>
                    <span><b>{learner.average}</b><small>{learner.evidence} evidence records</small></span>
                  </button>
                ))}
              </div>
            </article>

            <aside className="panel detail-panel">
              <div className="profile-heading">
                <div className="avatar large">{selectedLearner.name.split(" ").map((part) => part[0]).join("")}</div>
                <div><p className="kicker">{selectedLearner.id}</p><h2>{selectedLearner.name}</h2><span>{selectedLearner.role} · {selectedLearner.organization}</span></div>
              </div>
              <div className="detail-status"><span className={`pill ${selectedLearner.state.toLowerCase()}`}>{stateLabel(selectedLearner.state)}</span><small>Last activity: {selectedLearner.lastActivity}</small></div>
              <div className="detail-metrics">
                <div><span>Progress</span><strong>{selectedLearner.progress}%</strong></div>
                <div><span>Average</span><strong>{selectedLearner.average}</strong></div>
                <div><span>Evidence</span><strong>{selectedLearner.evidence}</strong></div>
              </div>
              <div className="detail-block"><span>Current activity</span><strong>{selectedLearner.activeModule}</strong><small>{selectedLearner.cohort}</small></div>
              <div className="detail-block"><span>Intervention flags</span>{selectedLearner.flags.length ? <ul>{selectedLearner.flags.map((flag) => <li key={flag}>{flag}</li>)}</ul> : <p>No active intervention flags.</p>}</div>
              <label className="notes-field"><span>Instructor notes</span><textarea rows={6} value={instructorNotes[selectedLearner.id] ?? ""} onChange={(event) => setInstructorNotes((current) => ({ ...current, [selectedLearner.id]: event.target.value }))} placeholder="Preserve coaching notes, intervention context, or follow-up commitments…" /></label>
              <div className="detail-actions"><button className="button primary" onClick={() => { const review = reviews.find((item) => item.learnerId === selectedLearner.id); if (review) { setSelectedReviewId(review.id); setActiveTab("reviews"); } }}>Open learner review</button><Link className="button ghost" href="/academy/student-profile">Profile model</Link></div>
            </aside>
          </div>
        </section>
      )}

      {activeTab === "reviews" && (
        <section className="page-section">
          <div className="toolbar">
            <label className="search-box"><span>Search</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Learner, artifact, review ID…" /></label>
            <div className="filter-group">
              {(["ALL", "PENDING", "IN_REVIEW", "RETURNED", "APPROVED"] as const).map((value) => (
                <button key={value} className={reviewFilter === value ? "active" : ""} onClick={() => setReviewFilter(value)}>{value === "ALL" ? "All" : reviewLabel(value)}</button>
              ))}
            </div>
          </div>

          <div className="workspace-grid review-workspace">
            <article className="panel queue-panel">
              <div className="panel-heading"><div><p className="kicker">REVIEW QUEUE</p><h2>{filteredReviews.length} artifacts</h2></div></div>
              <div className="review-queue">
                {filteredReviews.map((review) => (
                  <button key={review.id} className={`queue-item ${selectedReviewId === review.id ? "selected" : ""}`} onClick={() => setSelectedReviewId(review.id)}>
                    <div className="queue-top"><span className={`priority ${review.priority.toLowerCase()}`}>{review.priority}</span><small>{review.id}</small></div>
                    <strong>{review.artifact}</strong><span>{review.learner}</span>
                    <div className="queue-bottom"><em className={`review-pill ${review.state.toLowerCase()}`}>{reviewLabel(review.state)}</em><small>{review.due}</small></div>
                  </button>
                ))}
              </div>
            </article>

            <article className="panel review-detail">
              <div className="panel-heading">
                <div><p className="kicker">{selectedReview.id} · {selectedReview.kind}</p><h2>{selectedReview.artifact}</h2><span className="subtle">Submitted by {selectedReview.learner} · {selectedReview.submitted}</span></div>
                <span className={`review-pill ${selectedReview.state.toLowerCase()}`}>{reviewLabel(selectedReview.state)}</span>
              </div>
              <div className="review-banner"><strong>Review standard</strong><p>Evaluate the preserved evidence and route logic. Do not infer missing authority, continuity, or verification merely because the learner selected a plausible outcome.</p></div>
              <div className="rubric-grid">
                {["Reality and record", "Continuity", "Admissibility", "Authority and binding", "Execution correspondence", "Outcome verification"].map((label, index) => (
                  <div className="rubric-card" key={label}><span>{label}</span><strong>{index < 4 ? "Meets" : "Review"}</strong><small>{index < 4 ? "Evidence is explicit and attributable." : "Confirm the final artifact record."}</small></div>
                ))}
              </div>
              <label className="notes-field finding-field"><span>Attributable instructor finding</span><textarea rows={8} value={reviewFindings[selectedReview.id] ?? selectedReview.finding} onChange={(event) => updateFinding(event.target.value)} placeholder="State what the artifact supports, what remains unresolved, and the required remedy…" /></label>
              <div className="decision-grid">
                <button className="decision-card approve"><strong>Approve</strong><span>Evidence meets the stated standard.</span></button>
                <button className="decision-card return"><strong>Return for correction</strong><span>Preserve the defect and required remediation.</span></button>
                <button className="decision-card escalate"><strong>Escalate</strong><span>Authority or governance question exceeds instructor scope.</span></button>
              </div>
              <div className="review-footer"><small>Due: {selectedReview.due}</small><button className="button ghost" onClick={() => downloadJson(`${selectedReview.id.toLowerCase()}-review.json`, { ...selectedReview, instructorFinding: reviewFindings[selectedReview.id] ?? selectedReview.finding })}>Export review record</button></div>
            </article>
          </div>
        </section>
      )}

      {activeTab === "cohorts" && (
        <section className="page-section">
          <div className="section-intro"><div><p className="kicker">PROGRAM DELIVERY</p><h2>Current cohorts</h2></div><button className="button primary">Create cohort</button></div>
          <div className="cohort-card-grid">
            {cohorts.map((cohort) => (
              <article className="panel cohort-card" key={cohort.id}>
                <div className="cohort-card-head"><span>{cohort.id}</span><b>{cohort.completion}% complete</b></div>
                <h3>{cohort.name}</h3><p>{cohort.program}</p>
                <div className="progress-track large"><span style={{ width: `${cohort.completion}%` }} /></div>
                <div className="cohort-stats"><div><span>Learners</span><strong>{cohort.learners}</strong></div><div><span>Active</span><strong>{cohort.active}</strong></div><div><span>Instructor</span><strong>{cohort.instructor}</strong></div></div>
                <dl><div><dt>Window</dt><dd>{cohort.start} — {cohort.end}</dd></div><div><dt>Cadence</dt><dd>{cohort.cadence}</dd></div></dl>
                <div className="cohort-actions"><button className="button ghost">Manage cohort</button><button className="text-button" onClick={() => { setSearch(cohort.name); setActiveTab("learners"); }}>View learners →</button></div>
              </article>
            ))}
          </div>

          <article className="panel competency-panel">
            <div className="panel-heading"><div><p className="kicker">CROSS-COHORT ANALYTICS</p><h2>Competency distribution</h2></div><small>52 active learner records</small></div>
            <div className="competency-table">
              <div className="competency-head"><span>Competency</span><span>Demonstrated</span><span>Developing</span><span>Attention</span></div>
              {competencyRows.map((row) => (
                <div className="competency-row" key={row.label}><strong>{row.label}</strong><span>{row.demonstrated}</span><span>{row.developing}</span><span>{row.attention}</span></div>
              ))}
            </div>
          </article>
        </section>
      )}

      {activeTab === "reports" && (
        <section className="page-section reports-layout">
          <div className="reports-main">
            <article className="panel">
              <div className="panel-heading"><div><p className="kicker">FACULTY COMMUNICATION</p><h2>Publish announcement</h2></div></div>
              <div className="announcement-form">
                <label><span>Audience</span><select value={announcementAudience} onChange={(event) => setAnnouncementAudience(event.target.value)}>{cohorts.map((cohort) => <option key={cohort.id}>{cohort.name}</option>)}<option>All active learners</option></select></label>
                <label><span>Title</span><input value={announcementTitle} onChange={(event) => setAnnouncementTitle(event.target.value)} placeholder="Announcement title" /></label>
                <label><span>Message</span><textarea rows={5} value={announcementBody} onChange={(event) => setAnnouncementBody(event.target.value)} placeholder="Write a clear, attributable Academy notice…" /></label>
                <button className="button primary" onClick={addAnnouncement}>Publish announcement</button>
              </div>
            </article>

            <article className="panel">
              <div className="panel-heading"><div><p className="kicker">RECENT NOTICES</p><h2>Announcement record</h2></div></div>
              <div className="announcement-list">
                {announcements.map((announcement) => (
                  <div className={`announcement ${announcement.tone.toLowerCase()}`} key={announcement.id}><div className="announcement-meta"><span>{announcement.audience}</span><small>{announcement.created}</small></div><strong>{announcement.title}</strong><p>{announcement.body}</p><button className="text-button" onClick={() => setAnnouncements((current) => current.filter((item) => item.id !== announcement.id))}>Remove</button></div>
                ))}
              </div>
            </article>
          </div>

          <aside className="reports-side">
            <article className="panel export-panel"><p className="kicker">REPORTING</p><h2>Instructor report package</h2><p>Export the current learner, cohort, review, and announcement state as a portable JSON record.</p><button className="button primary full" onClick={exportInstructorReport}>Export complete report</button></article>
            <article className="panel"><p className="kicker">QUICK EXPORTS</p><div className="export-list"><button onClick={() => downloadJson("ta14-learners.json", learners)}>Learner roster <span>JSON</span></button><button onClick={() => downloadJson("ta14-review-queue.json", reviews)}>Review queue <span>JSON</span></button><button onClick={() => downloadJson("ta14-cohorts.json", cohorts)}>Cohort summary <span>JSON</span></button><button onClick={() => downloadJson("ta14-competencies.json", competencyRows)}>Competency distribution <span>JSON</span></button></div></article>
            <article className="panel audit-note"><p className="kicker">AUDIT POSTURE</p><h3>Local demonstration data</h3><p>This console preserves browser-local working state for Academy demonstration. Production deployment should bind changes to authenticated faculty identity and durable, versioned records.</p></article>
          </aside>
        </section>
      )}

      <footer className="academy-footer">
        <div><strong>TA-14 Academy</strong><span>Instructor Console · Faculty workspace</span></div>
        <div className="footer-links"><Link href="/academy">Academy home</Link><Link href="/academy/credential-dashboard">Credentials</Link><Link href="/academy/assessment">Assessment</Link></div>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(body) { margin: 0; background: #071018; color: #e8f0f4; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        :global(button), :global(input), :global(textarea), :global(select) { font: inherit; }
        :global(a) { color: inherit; text-decoration: none; }
        .academy-shell { min-height: 100vh; background: radial-gradient(circle at 82% 4%, rgba(53, 172, 145, .12), transparent 32rem), linear-gradient(180deg, #071018 0%, #09131d 45%, #071018 100%); }
        .topbar { min-height: 68px; padding: 14px clamp(18px, 4vw, 64px); border-bottom: 1px solid #1e303d; display: flex; align-items: center; justify-content: space-between; gap: 20px; background: rgba(6, 15, 23, .88); position: sticky; top: 0; z-index: 20; backdrop-filter: blur(18px); }
        .brand-block, .top-actions { display: flex; align-items: center; gap: 12px; }
        .brand { font-weight: 800; letter-spacing: -.02em; }.divider { color: #446170; }.section-name { color: #9eb1bb; font-size: 14px; }.save-state { color: #748b97; font-size: 12px; }.save-state.is-saving { color: #65d5b5; }
        .button { border-radius: 8px; border: 1px solid #2a4150; padding: 10px 14px; color: #e8f0f4; background: #10202b; cursor: pointer; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; }.button:hover { border-color: #527286; transform: translateY(-1px); }.button.primary { background: #5ce0bb; border-color: #5ce0bb; color: #062019; }.button.ghost { background: transparent; }.button.full { width: 100%; }
        .hero { padding: 72px clamp(18px, 5vw, 82px) 52px; max-width: 1480px; margin: 0 auto; display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; }.eyebrow, .kicker { color: #63d7b7; font-size: 11px; letter-spacing: .16em; font-weight: 800; margin: 0 0 10px; }.hero h1 { font-size: clamp(42px, 6vw, 78px); line-height: .96; margin: 0 0 20px; letter-spacing: -.055em; }.hero-copy { max-width: 820px; color: #a6b7c0; font-size: 18px; line-height: 1.7; margin: 0; }.hero-badge { width: 210px; border: 1px solid #29404e; border-radius: 18px; padding: 24px; background: rgba(16, 31, 41, .72); }.hero-badge strong { display: block; font-size: 46px; line-height: 1; color: #5ce0bb; }.hero-badge span { display: block; font-weight: 800; margin: 8px 0; }.hero-badge small { color: #91a5af; }
        .tabs { max-width: 1480px; margin: 0 auto; padding: 0 clamp(18px, 5vw, 82px); border-bottom: 1px solid #1e303d; display: flex; gap: 26px; overflow-x: auto; }.tabs button { color: #8297a3; border: 0; border-bottom: 2px solid transparent; background: transparent; padding: 16px 0; white-space: nowrap; cursor: pointer; font-weight: 700; }.tabs button.active { color: #f3f7f9; border-color: #5ce0bb; }
        .page-section { max-width: 1480px; margin: 0 auto; padding: 34px clamp(18px, 5vw, 82px) 70px; }.metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }.metric-card { border: 1px solid #213542; border-radius: 14px; background: rgba(13, 28, 38, .78); padding: 20px; }.metric-card span { color: #91a5af; font-size: 13px; }.metric-card strong { display: block; font-size: 34px; margin: 10px 0 5px; }.metric-card small { color: #718792; }.metric-card.warning strong { color: #ffc978; }
        .two-column { display: grid; grid-template-columns: 1.15fr .85fr; gap: 18px; margin-top: 18px; }.lower-grid { grid-template-columns: 1fr 1fr; }.panel { border: 1px solid #213542; border-radius: 16px; background: rgba(11, 25, 35, .84); padding: 22px; box-shadow: 0 18px 60px rgba(0, 0, 0, .18); }.panel-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; margin-bottom: 18px; }.panel-heading h2, .section-intro h2 { margin: 0; font-size: 22px; letter-spacing: -.025em; }.panel-heading .subtle { display: block; color: #8297a3; margin-top: 5px; font-size: 13px; }.text-button { border: 0; background: transparent; color: #66dbba; cursor: pointer; padding: 0; font-weight: 700; font-size: 13px; }
        .stack-list { display: grid; gap: 8px; }.learner-row, .review-row { width: 100%; border: 1px solid transparent; border-radius: 11px; background: #0d1d27; color: inherit; padding: 13px; cursor: pointer; display: flex; align-items: center; gap: 12px; text-align: left; }.learner-row:hover, .review-row:hover { border-color: #2c4b5b; }.avatar { width: 38px; height: 38px; border-radius: 11px; background: #183746; color: #78e4c5; display: grid; place-items: center; font-weight: 900; font-size: 12px; flex: 0 0 auto; }.avatar.large { width: 52px; height: 52px; font-size: 15px; }.row-main { min-width: 0; flex: 1; }.row-main strong, .row-main span, .row-main small, .review-row strong, .review-row span { display: block; }.row-main span, .review-row span { color: #99adb7; font-size: 12px; margin-top: 3px; }.row-main small { color: #d8aa64; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.row-end { margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }.row-end small { color: #7d939e; }
        .pill, .review-pill, .priority { display: inline-flex; width: fit-content; border-radius: 999px; padding: 4px 8px; font-style: normal; font-size: 10px; font-weight: 900; letter-spacing: .05em; text-transform: uppercase; }.pill.on_track, .pill.complete, .review-pill.approved { color: #74dfbf; background: rgba(78, 211, 171, .11); }.pill.watch, .priority.medium, .review-pill.in_review { color: #ffd083; background: rgba(255, 198, 105, .11); }.pill.at_risk, .priority.high, .review-pill.returned { color: #ff9d96; background: rgba(255, 109, 100, .11); }.review-pill.pending, .priority.low { color: #9fc8ff; background: rgba(99, 164, 255, .11); }
        .cohort-summary-list { display: grid; gap: 20px; }.cohort-top { display: flex; justify-content: space-between; gap: 18px; }.cohort-top strong, .cohort-top span { display: block; }.cohort-top span { color: #8297a3; font-size: 12px; margin-top: 4px; }.progress-track { height: 7px; background: #142833; border-radius: 999px; overflow: hidden; margin-top: 10px; }.progress-track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #4cc9a8, #79e7c8); }.progress-track.large { height: 10px; }.governance-panel p, .governance-panel li { color: #9db0b9; line-height: 1.65; }.governance-panel ul { padding-left: 18px; }.inline-link { color: #66dbba; font-weight: 800; }
        .toolbar { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 18px; }.search-box { display: grid; gap: 7px; min-width: min(430px, 100%); }.search-box span, .notes-field span, .announcement-form label span { color: #8fa4af; font-size: 12px; font-weight: 700; }.search-box input, .notes-field textarea, .announcement-form input, .announcement-form textarea, .announcement-form select { width: 100%; color: #edf4f7; background: #0b1b25; border: 1px solid #29404e; border-radius: 9px; padding: 11px 12px; outline: none; }.search-box input:focus, .notes-field textarea:focus, .announcement-form input:focus, .announcement-form textarea:focus, .announcement-form select:focus { border-color: #54cbaa; }.filter-group { display: flex; gap: 6px; flex-wrap: wrap; }.filter-group button { border: 1px solid #29404e; border-radius: 999px; background: transparent; color: #8499a4; padding: 7px 10px; cursor: pointer; font-size: 11px; font-weight: 800; }.filter-group button.active { color: #062019; background: #5ce0bb; border-color: #5ce0bb; }
        .workspace-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(320px, .65fr); gap: 18px; }.roster-panel { padding: 0; overflow: hidden; }.roster-panel .panel-heading { padding: 20px 20px 0; }.roster-table { width: 100%; }.table-head, .table-row { display: grid; grid-template-columns: 1.4fr .7fr .8fr .8fr; gap: 12px; align-items: center; }.table-head { padding: 11px 18px; color: #728894; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; border-top: 1px solid #1d303b; border-bottom: 1px solid #1d303b; }.table-row { width: 100%; padding: 14px 18px; background: transparent; color: inherit; border: 0; border-bottom: 1px solid #172a35; text-align: left; cursor: pointer; }.table-row:hover, .table-row.selected { background: #10232e; }.table-row b, .table-row small { display: block; }.table-row small { color: #778e99; margin-top: 3px; }.person-cell b { color: #eef5f7; }.detail-panel { align-self: start; position: sticky; top: 92px; }.profile-heading { display: flex; gap: 13px; align-items: center; }.profile-heading h2 { margin: 0 0 4px; }.profile-heading span { color: #8ca0aa; font-size: 12px; }.detail-status { display: flex; justify-content: space-between; align-items: center; margin: 18px 0; padding: 11px 0; border-top: 1px solid #1d303b; border-bottom: 1px solid #1d303b; }.detail-status small { color: #8196a1; }.detail-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }.detail-metrics div { background: #0d1d27; border-radius: 9px; padding: 12px; }.detail-metrics span, .detail-block > span { display: block; color: #7d929d; font-size: 11px; margin-bottom: 5px; }.detail-metrics strong { font-size: 22px; }.detail-block { margin-top: 18px; }.detail-block strong, .detail-block small { display: block; }.detail-block small, .detail-block p, .detail-block li { color: #8ea3ad; line-height: 1.55; }.detail-block ul { margin: 8px 0 0; padding-left: 18px; }.notes-field { display: grid; gap: 7px; margin-top: 18px; }.notes-field textarea { resize: vertical; line-height: 1.55; }.detail-actions { display: flex; gap: 8px; margin-top: 14px; }
        .review-workspace { grid-template-columns: 380px minmax(0, 1fr); }.queue-panel { padding: 0; overflow: hidden; }.queue-panel .panel-heading { padding: 20px 20px 0; }.review-queue { display: grid; }.queue-item { color: inherit; background: transparent; border: 0; border-top: 1px solid #1c303b; padding: 16px 18px; text-align: left; cursor: pointer; }.queue-item:hover, .queue-item.selected { background: #10232e; }.queue-item > strong, .queue-item > span { display: block; }.queue-item > strong { margin-top: 9px; }.queue-item > span { color: #8ea2ad; margin-top: 4px; font-size: 12px; }.queue-top, .queue-bottom { display: flex; justify-content: space-between; align-items: center; }.queue-top small, .queue-bottom small { color: #738995; }.queue-bottom { margin-top: 11px; }.review-banner { border: 1px solid #345062; background: #0d202b; border-radius: 11px; padding: 14px; }.review-banner p { color: #94a9b4; margin: 5px 0 0; line-height: 1.55; font-size: 13px; }.rubric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; margin-top: 16px; }.rubric-card { background: #0c1d27; border: 1px solid #1d3340; border-radius: 10px; padding: 12px; }.rubric-card span, .rubric-card strong, .rubric-card small { display: block; }.rubric-card span { color: #8ea3ad; font-size: 11px; }.rubric-card strong { color: #6cddbd; margin: 8px 0 4px; }.rubric-card small { color: #718792; line-height: 1.45; }.finding-field { margin-top: 16px; }.decision-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; margin-top: 14px; }.decision-card { background: #0d1d27; color: inherit; border: 1px solid #29404e; border-radius: 10px; padding: 13px; text-align: left; cursor: pointer; }.decision-card strong, .decision-card span { display: block; }.decision-card span { color: #8297a3; margin-top: 5px; font-size: 11px; line-height: 1.45; }.decision-card.approve:hover { border-color: #51cea9; }.decision-card.return:hover { border-color: #e2b168; }.decision-card.escalate:hover { border-color: #e27c76; }.review-footer { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; }.review-footer small { color: #859aa5; }
        .section-intro { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }.cohort-card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }.cohort-card-head { display: flex; justify-content: space-between; color: #8196a1; font-size: 11px; }.cohort-card h3 { font-size: 20px; margin: 18px 0 6px; }.cohort-card > p { color: #8fa4ae; min-height: 42px; }.cohort-stats { display: grid; grid-template-columns: .7fr .7fr 1.6fr; gap: 8px; margin: 18px 0; }.cohort-stats div { background: #0c1c26; border-radius: 9px; padding: 10px; }.cohort-stats span, .cohort-stats strong { display: block; }.cohort-stats span { color: #748a95; font-size: 10px; }.cohort-stats strong { margin-top: 5px; font-size: 13px; }.cohort-card dl { margin: 0; display: grid; gap: 8px; }.cohort-card dl div { display: flex; justify-content: space-between; gap: 18px; }.cohort-card dt { color: #718792; }.cohort-card dd { margin: 0; text-align: right; }.cohort-actions { margin-top: 18px; display: flex; justify-content: space-between; align-items: center; }.competency-panel { margin-top: 18px; }.competency-table { width: 100%; }.competency-head, .competency-row { display: grid; grid-template-columns: 2fr repeat(3, .7fr); gap: 12px; padding: 11px 12px; }.competency-head { color: #748994; font-size: 10px; text-transform: uppercase; letter-spacing: .08em; border-bottom: 1px solid #1e323e; }.competency-row { border-bottom: 1px solid #172b36; }.competency-row span { color: #a0b2bb; }
        .reports-layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 18px; }.reports-main, .reports-side { display: grid; gap: 18px; align-content: start; }.announcement-form { display: grid; gap: 13px; }.announcement-form label { display: grid; gap: 7px; }.announcement-list { display: grid; gap: 10px; }.announcement { border: 1px solid #233a47; border-left: 3px solid #5dcfb0; border-radius: 10px; padding: 14px; background: #0d1d27; }.announcement.warning { border-left-color: #efb660; }.announcement.success { border-left-color: #7ad0ff; }.announcement-meta { display: flex; justify-content: space-between; color: #7d929d; font-size: 11px; }.announcement > strong { display: block; margin-top: 10px; }.announcement p { color: #93a7b1; line-height: 1.55; }.export-panel p, .audit-note p { color: #91a5af; line-height: 1.6; }.export-list { display: grid; }.export-list button { display: flex; justify-content: space-between; color: #e6eef2; background: transparent; border: 0; border-bottom: 1px solid #1e323d; padding: 12px 0; cursor: pointer; text-align: left; }.export-list button span { color: #6bdaba; font-size: 10px; font-weight: 900; }
        .academy-footer { border-top: 1px solid #1c303b; padding: 28px clamp(18px, 5vw, 82px); display: flex; justify-content: space-between; align-items: center; gap: 20px; color: #7f949f; }.academy-footer strong, .academy-footer span { display: block; }.academy-footer strong { color: #dce7eb; }.academy-footer span { font-size: 12px; margin-top: 4px; }.footer-links { display: flex; gap: 20px; font-size: 12px; }.footer-links a:hover { color: #62d8b7; }
        @media (max-width: 1100px) { .metric-grid { grid-template-columns: repeat(2, 1fr); }.workspace-grid, .review-workspace, .reports-layout { grid-template-columns: 1fr; }.detail-panel { position: static; }.cohort-card-grid { grid-template-columns: 1fr 1fr; }.rubric-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 760px) { .topbar, .hero, .toolbar, .academy-footer, .section-intro { align-items: flex-start; flex-direction: column; }.top-actions { width: 100%; flex-wrap: wrap; }.hero { padding-top: 44px; }.hero-badge { width: 100%; }.metric-grid, .two-column, .cohort-card-grid, .decision-grid { grid-template-columns: 1fr; }.tabs { gap: 18px; }.filter-group { width: 100%; }.table-head { display: none; }.table-row { grid-template-columns: 1fr 1fr; }.rubric-grid { grid-template-columns: 1fr; }.competency-head, .competency-row { grid-template-columns: 1.5fr repeat(3, .7fr); font-size: 12px; }.footer-links { flex-wrap: wrap; } }
        @media (max-width: 480px) { .metric-grid, .detail-metrics { grid-template-columns: 1fr; }.table-row { grid-template-columns: 1fr; }.cohort-stats { grid-template-columns: 1fr; }.competency-head { display: none; }.competency-row { grid-template-columns: 1fr repeat(3, .6fr); }.brand-block { flex-wrap: wrap; }.section-name { width: 100%; }.divider { display: none; } }
      `}</style>
    </main>
  );
}
