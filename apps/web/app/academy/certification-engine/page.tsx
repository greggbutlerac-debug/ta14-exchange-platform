"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type EngineTab = "overview" | "programs" | "candidates" | "issuance" | "registry" | "governance";
type ProgramState = "DRAFT" | "ACTIVE" | "PAUSED" | "RETIRED";
type CandidateState = "INELIGIBLE" | "ELIGIBLE" | "UNDER_REVIEW" | "APPROVED" | "ISSUED" | "RENEWAL_DUE" | "REVOKED";
type ReviewDecision = "PENDING" | "APPROVE" | "RETURN" | "DENY";
type CredentialState = "ACTIVE" | "EXPIRING" | "EXPIRED" | "REVOKED";
type EvidenceState = "VERIFIED" | "PENDING" | "DEFICIENT";
type GovernanceAction = "ISSUE" | "RENEW" | "SUSPEND" | "REVOKE" | "REINSTATE";

type Requirement = {
  id: string;
  label: string;
  description: string;
  mandatory: boolean;
  weight: number;
};

type CertificationProgram = {
  id: string;
  code: string;
  title: string;
  summary: string;
  state: ProgramState;
  version: string;
  validityMonths: number;
  passingScore: number;
  reviewQuorum: number;
  renewalWindowDays: number;
  requirements: Requirement[];
  competencies: string[];
  updatedAt: string;
};

type CandidateEvidence = {
  id: string;
  requirementId: string;
  title: string;
  source: string;
  state: EvidenceState;
  submittedAt: string;
  verifier: string;
};

type Candidate = {
  id: string;
  name: string;
  role: string;
  organization: string;
  programId: string;
  state: CandidateState;
  score: number;
  completion: number;
  submittedAt: string;
  assignedReviewer: string;
  evidence: CandidateEvidence[];
  decision: ReviewDecision;
  reviewNote: string;
};

type Credential = {
  id: string;
  candidateId: string;
  holder: string;
  programId: string;
  programCode: string;
  programTitle: string;
  issuedAt: string;
  expiresAt: string;
  state: CredentialState;
  version: string;
  verificationCode: string;
  lastAction: GovernanceAction;
  actionReason: string;
};

type AuditEvent = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  subject: string;
  detail: string;
};

type PersistedState = {
  tab: EngineTab;
  selectedProgramId: string;
  selectedCandidateId: string;
  selectedCredentialId: string;
  candidateSearch: string;
  registrySearch: string;
  candidateFilter: "ALL" | CandidateState;
  programs: CertificationProgram[];
  candidates: Candidate[];
  credentials: Credential[];
  audit: AuditEvent[];
};

const STORAGE_KEY = "ta14-academy-certification-engine-v1";

const initialPrograms: CertificationProgram[] = [
  {
    id: "program-route-reviewer",
    code: "TA14-ARR",
    title: "Applied Route Reviewer",
    summary: "Certifies the ability to review governance routes from authority through verified outcome.",
    state: "ACTIVE",
    version: "2.1",
    validityMonths: 24,
    passingScore: 85,
    reviewQuorum: 2,
    renewalWindowDays: 90,
    competencies: [
      "Authority and binding",
      "Evidence admissibility",
      "Determination quality",
      "Execution correspondence",
      "Outcome verification",
      "Challenge and appeal",
    ],
    requirements: [
      { id: "arr-r1", label: "Core curriculum", description: "Complete all required Academy foundation modules.", mandatory: true, weight: 20 },
      { id: "arr-r2", label: "Applied laboratories", description: "Complete the route, evidence, execution, and appeal laboratories.", mandatory: true, weight: 25 },
      { id: "arr-r3", label: "Proctored assessment", description: "Achieve the program passing score under the approved assessment protocol.", mandatory: true, weight: 25 },
      { id: "arr-r4", label: "Capstone determination", description: "Submit a complete review record for independent evaluation.", mandatory: true, weight: 30 },
    ],
    updatedAt: "2026-07-28T14:30:00.000Z",
  },
  {
    id: "program-route-author",
    code: "TA14-GRA",
    title: "Governance Route Author",
    summary: "Certifies the ability to construct reviewable governance routes with explicit transitions and controls.",
    state: "ACTIVE",
    version: "1.4",
    validityMonths: 24,
    passingScore: 88,
    reviewQuorum: 2,
    renewalWindowDays: 90,
    competencies: ["Route architecture", "Continuity", "Decision records", "Runtime governance", "Version control"],
    requirements: [
      { id: "gra-r1", label: "Reviewer credential", description: "Hold an active Applied Route Reviewer credential.", mandatory: true, weight: 15 },
      { id: "gra-r2", label: "Construction labs", description: "Complete route construction and architecture exercises.", mandatory: true, weight: 30 },
      { id: "gra-r3", label: "Published route specimen", description: "Produce a route specimen meeting the Academy review standard.", mandatory: true, weight: 35 },
      { id: "gra-r4", label: "Oral defense", description: "Defend governing choices before an authorized review panel.", mandatory: true, weight: 20 },
    ],
    updatedAt: "2026-07-24T10:00:00.000Z",
  },
  {
    id: "program-runtime-steward",
    code: "TA14-RGS",
    title: "Runtime Governance Steward",
    summary: "Advanced certification for runtime oversight, controlled intervention, and execution assurance.",
    state: "DRAFT",
    version: "0.8",
    validityMonths: 18,
    passingScore: 90,
    reviewQuorum: 3,
    renewalWindowDays: 120,
    competencies: ["Runtime boundaries", "Intervention authority", "Incident preservation", "Execution verification"],
    requirements: [
      { id: "rgs-r1", label: "Active author credential", description: "Hold an active Governance Route Author credential.", mandatory: true, weight: 20 },
      { id: "rgs-r2", label: "Runtime studio", description: "Complete all governed execution studio missions.", mandatory: true, weight: 30 },
      { id: "rgs-r3", label: "Incident exercise", description: "Resolve a controlled runtime incident and preserve the review record.", mandatory: true, weight: 30 },
      { id: "rgs-r4", label: "Stewardship review", description: "Receive panel approval for operational stewardship readiness.", mandatory: true, weight: 20 },
    ],
    updatedAt: "2026-07-29T17:15:00.000Z",
  },
];

const initialCandidates: Candidate[] = [
  {
    id: "candidate-2041",
    name: "Maya Chen",
    role: "Governance Analyst",
    organization: "Northstar Operations",
    programId: "program-route-reviewer",
    state: "UNDER_REVIEW",
    score: 93,
    completion: 100,
    submittedAt: "2026-07-27T13:20:00.000Z",
    assignedReviewer: "A. Rivera",
    decision: "PENDING",
    reviewNote: "",
    evidence: [
      { id: "ev-1", requirementId: "arr-r1", title: "Foundation transcript", source: "Academy transcript", state: "VERIFIED", submittedAt: "2026-07-26", verifier: "System" },
      { id: "ev-2", requirementId: "arr-r2", title: "Laboratory completion packet", source: "Academy laboratories", state: "VERIFIED", submittedAt: "2026-07-26", verifier: "System" },
      { id: "ev-3", requirementId: "arr-r3", title: "Assessment result — 93", source: "Assessment service", state: "VERIFIED", submittedAt: "2026-07-27", verifier: "Assessment engine" },
      { id: "ev-4", requirementId: "arr-r4", title: "Capstone review record", source: "Instructor review", state: "PENDING", submittedAt: "2026-07-27", verifier: "A. Rivera" },
    ],
  },
  {
    id: "candidate-2042",
    name: "Elena Morales",
    role: "Compliance Lead",
    organization: "Civic Systems Group",
    programId: "program-route-reviewer",
    state: "ELIGIBLE",
    score: 88,
    completion: 94,
    submittedAt: "2026-07-25T09:10:00.000Z",
    assignedReviewer: "J. Okafor",
    decision: "PENDING",
    reviewNote: "",
    evidence: [
      { id: "ev-5", requirementId: "arr-r1", title: "Foundation transcript", source: "Academy transcript", state: "VERIFIED", submittedAt: "2026-07-24", verifier: "System" },
      { id: "ev-6", requirementId: "arr-r2", title: "Laboratory completion packet", source: "Academy laboratories", state: "DEFICIENT", submittedAt: "2026-07-24", verifier: "J. Okafor" },
      { id: "ev-7", requirementId: "arr-r3", title: "Assessment result — 88", source: "Assessment service", state: "VERIFIED", submittedAt: "2026-07-25", verifier: "Assessment engine" },
    ],
  },
  {
    id: "candidate-2037",
    name: "Priya Nair",
    role: "Senior Route Reviewer",
    organization: "Public Exchange Office",
    programId: "program-route-author",
    state: "APPROVED",
    score: 96,
    completion: 100,
    submittedAt: "2026-07-22T15:45:00.000Z",
    assignedReviewer: "Certification Panel 4",
    decision: "APPROVE",
    reviewNote: "Route specimen and oral defense satisfy the published standard.",
    evidence: [
      { id: "ev-8", requirementId: "gra-r1", title: "Active reviewer credential", source: "Credential registry", state: "VERIFIED", submittedAt: "2026-07-21", verifier: "Registry" },
      { id: "ev-9", requirementId: "gra-r2", title: "Construction lab portfolio", source: "Academy portfolio", state: "VERIFIED", submittedAt: "2026-07-21", verifier: "System" },
      { id: "ev-10", requirementId: "gra-r3", title: "Published route specimen", source: "Panel record", state: "VERIFIED", submittedAt: "2026-07-22", verifier: "Panel 4" },
      { id: "ev-11", requirementId: "gra-r4", title: "Oral defense finding", source: "Panel record", state: "VERIFIED", submittedAt: "2026-07-22", verifier: "Panel 4" },
    ],
  },
  {
    id: "candidate-1998",
    name: "Marcus Reed",
    role: "Operations Reviewer",
    organization: "Meridian Exchange",
    programId: "program-route-reviewer",
    state: "RENEWAL_DUE",
    score: 91,
    completion: 100,
    submittedAt: "2024-09-11T11:30:00.000Z",
    assignedReviewer: "Renewal Desk",
    decision: "PENDING",
    reviewNote: "",
    evidence: [
      { id: "ev-12", requirementId: "arr-r1", title: "Continuing education record", source: "Renewal portfolio", state: "PENDING", submittedAt: "2026-07-18", verifier: "Renewal Desk" },
    ],
  },
];

const initialCredentials: Credential[] = [
  {
    id: "credential-10047",
    candidateId: "candidate-1981",
    holder: "Noah Williams",
    programId: "program-route-reviewer",
    programCode: "TA14-ARR",
    programTitle: "Applied Route Reviewer",
    issuedAt: "2025-11-14",
    expiresAt: "2027-11-14",
    state: "ACTIVE",
    version: "2.0",
    verificationCode: "ARR-10047-7Q9M",
    lastAction: "ISSUE",
    actionReason: "Initial issuance after panel approval.",
  },
  {
    id: "credential-10031",
    candidateId: "candidate-1970",
    holder: "Sofia Brooks",
    programId: "program-route-author",
    programCode: "TA14-GRA",
    programTitle: "Governance Route Author",
    issuedAt: "2025-08-02",
    expiresAt: "2027-08-02",
    state: "ACTIVE",
    version: "1.3",
    verificationCode: "GRA-10031-2L8K",
    lastAction: "RENEW",
    actionReason: "Renewed after continuing competency review.",
  },
  {
    id: "credential-9924",
    candidateId: "candidate-1884",
    holder: "Darius King",
    programId: "program-route-reviewer",
    programCode: "TA14-ARR",
    programTitle: "Applied Route Reviewer",
    issuedAt: "2024-09-06",
    expiresAt: "2026-09-06",
    state: "EXPIRING",
    version: "1.8",
    verificationCode: "ARR-09924-4F3N",
    lastAction: "ISSUE",
    actionReason: "Initial issuance after panel approval.",
  },
  {
    id: "credential-9733",
    candidateId: "candidate-1762",
    holder: "Iris Patel",
    programId: "program-route-reviewer",
    programCode: "TA14-ARR",
    programTitle: "Applied Route Reviewer",
    issuedAt: "2023-04-18",
    expiresAt: "2025-04-18",
    state: "REVOKED",
    version: "1.5",
    verificationCode: "ARR-09733-8D1R",
    lastAction: "REVOKE",
    actionReason: "Credential revoked by authorized governance decision GR-2026-014.",
  },
];

const initialAudit: AuditEvent[] = [
  { id: "audit-1", timestamp: "2026-07-30T09:42:00.000Z", actor: "Certification Panel 4", action: "Approved candidate", subject: "Priya Nair", detail: "All mandatory requirements verified; issuance authorized." },
  { id: "audit-2", timestamp: "2026-07-29T16:18:00.000Z", actor: "A. Rivera", action: "Opened review", subject: "Maya Chen", detail: "Capstone evidence assigned for independent review." },
  { id: "audit-3", timestamp: "2026-07-29T12:05:00.000Z", actor: "Program Office", action: "Updated program", subject: "Runtime Governance Steward", detail: "Draft version advanced to 0.8; panel quorum raised to three." },
  { id: "audit-4", timestamp: "2026-07-28T15:54:00.000Z", actor: "Registry Authority", action: "Revoked credential", subject: "ARR-09733-8D1R", detail: "Action linked to governance decision GR-2026-014." },
];

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function statusClass(value: string) {
  if (["ACTIVE", "APPROVED", "ISSUED", "VERIFIED", "ELIGIBLE"].includes(value)) return "good";
  if (["UNDER_REVIEW", "PENDING", "EXPIRING", "RENEWAL_DUE", "DRAFT"].includes(value)) return "warn";
  if (["REVOKED", "DENY", "DEFICIENT", "INELIGIBLE", "EXPIRED"].includes(value)) return "bad";
  return "neutral";
}

export default function CertificationEnginePage() {
  const [state, setState] = useState<PersistedState>({
    tab: "overview",
    selectedProgramId: initialPrograms[0].id,
    selectedCandidateId: initialCandidates[0].id,
    selectedCredentialId: initialCredentials[0].id,
    candidateSearch: "",
    registrySearch: "",
    candidateFilter: "ALL",
    programs: initialPrograms,
    candidates: initialCandidates,
    credentials: initialCredentials,
    audit: initialAudit,
  });
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState("Engine ready. No credential action occurs without an explicit authorized decision.");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setState(JSON.parse(stored) as PersistedState);
    } catch {
      setNotice("Saved certification data could not be restored; the demonstration dataset is active.");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const selectedProgram = state.programs.find((program) => program.id === state.selectedProgramId) ?? state.programs[0];
  const selectedCandidate = state.candidates.find((candidate) => candidate.id === state.selectedCandidateId) ?? state.candidates[0];
  const selectedCredential = state.credentials.find((credential) => credential.id === state.selectedCredentialId) ?? state.credentials[0];

  const filteredCandidates = useMemo(() => {
    const query = state.candidateSearch.trim().toLowerCase();
    return state.candidates.filter((candidate) => {
      const matchesFilter = state.candidateFilter === "ALL" || candidate.state === state.candidateFilter;
      const program = state.programs.find((item) => item.id === candidate.programId);
      const matchesQuery = !query || [candidate.name, candidate.role, candidate.organization, candidate.id, program?.title ?? ""].join(" ").toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [state.candidates, state.candidateFilter, state.candidateSearch, state.programs]);

  const filteredCredentials = useMemo(() => {
    const query = state.registrySearch.trim().toLowerCase();
    return state.credentials.filter((credential) => !query || [credential.holder, credential.programCode, credential.programTitle, credential.verificationCode, credential.state].join(" ").toLowerCase().includes(query));
  }, [state.credentials, state.registrySearch]);

  const metrics = useMemo(() => ({
    activePrograms: state.programs.filter((item) => item.state === "ACTIVE").length,
    pendingReviews: state.candidates.filter((item) => ["ELIGIBLE", "UNDER_REVIEW"].includes(item.state)).length,
    approvedAwaitingIssue: state.candidates.filter((item) => item.state === "APPROVED").length,
    activeCredentials: state.credentials.filter((item) => item.state === "ACTIVE").length,
    renewalDue: state.candidates.filter((item) => item.state === "RENEWAL_DUE").length + state.credentials.filter((item) => item.state === "EXPIRING").length,
  }), [state]);

  function addAudit(action: string, subject: string, detail: string) {
    const event: AuditEvent = { id: makeId("audit"), timestamp: new Date().toISOString(), actor: "Academy Certification Officer", action, subject, detail };
    setState((current) => ({ ...current, audit: [event, ...current.audit].slice(0, 100) }));
  }

  function updateCandidate(patch: Partial<Candidate>) {
    setState((current) => ({ ...current, candidates: current.candidates.map((candidate) => candidate.id === current.selectedCandidateId ? { ...candidate, ...patch } : candidate) }));
  }

  function recordDecision(decision: ReviewDecision) {
    if (!selectedCandidate) return;
    const nextState: CandidateState = decision === "APPROVE" ? "APPROVED" : decision === "RETURN" ? "ELIGIBLE" : decision === "DENY" ? "INELIGIBLE" : selectedCandidate.state;
    updateCandidate({ decision, state: nextState });
    addAudit(`Recorded ${decision.toLowerCase()} decision`, selectedCandidate.name, selectedCandidate.reviewNote || "Decision recorded without an additional note.");
    setNotice(`Decision recorded for ${selectedCandidate.name}. Issuance remains a separate governed action.`);
  }

  function issueCredential() {
    if (!selectedCandidate || selectedCandidate.state !== "APPROVED") {
      setNotice("Issuance blocked: select a candidate with an approved certification decision.");
      return;
    }
    const program = state.programs.find((item) => item.id === selectedCandidate.programId);
    if (!program || program.state !== "ACTIVE") {
      setNotice("Issuance blocked: the governing certification program is not active.");
      return;
    }
    const issued = new Date();
    const expires = new Date(issued);
    expires.setMonth(expires.getMonth() + program.validityMonths);
    const credential: Credential = {
      id: makeId("credential"),
      candidateId: selectedCandidate.id,
      holder: selectedCandidate.name,
      programId: program.id,
      programCode: program.code,
      programTitle: program.title,
      issuedAt: issued.toISOString().slice(0, 10),
      expiresAt: expires.toISOString().slice(0, 10),
      state: "ACTIVE",
      version: program.version,
      verificationCode: `${program.code.replace("TA14-", "")}-${String(Date.now()).slice(-5)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      lastAction: "ISSUE",
      actionReason: "Issued after approved certification decision and final eligibility verification.",
    };
    setState((current) => ({
      ...current,
      candidates: current.candidates.map((candidate) => candidate.id === selectedCandidate.id ? { ...candidate, state: "ISSUED" } : candidate),
      credentials: [credential, ...current.credentials],
      selectedCredentialId: credential.id,
      tab: "registry",
    }));
    addAudit("Issued credential", credential.verificationCode, `${credential.holder} — ${credential.programTitle}`);
    setNotice(`Credential ${credential.verificationCode} issued and entered in the registry.`);
  }

  function governCredential(action: GovernanceAction) {
    if (!selectedCredential) return;
    const nextState: CredentialState = action === "REVOKE" ? "REVOKED" : action === "SUSPEND" ? "REVOKED" : action === "REINSTATE" || action === "RENEW" ? "ACTIVE" : selectedCredential.state;
    const reason = action === "RENEW" ? "Renewed after documented continuing competency review." : action === "REVOKE" ? "Revoked by authorized certification governance action." : action === "SUSPEND" ? "Suspended pending governance review." : "Reinstated after authorized review.";
    setState((current) => ({ ...current, credentials: current.credentials.map((credential) => credential.id === selectedCredential.id ? { ...credential, state: nextState, lastAction: action, actionReason: reason } : credential) }));
    addAudit(`${action[0]}${action.slice(1).toLowerCase()} credential`, selectedCredential.verificationCode, reason);
    setNotice(`${action} recorded for ${selectedCredential.verificationCode}.`);
  }

  function resetDemo() {
    window.localStorage.removeItem(STORAGE_KEY);
    setState({
      tab: "overview",
      selectedProgramId: initialPrograms[0].id,
      selectedCandidateId: initialCandidates[0].id,
      selectedCredentialId: initialCredentials[0].id,
      candidateSearch: "",
      registrySearch: "",
      candidateFilter: "ALL",
      programs: initialPrograms,
      candidates: initialCandidates,
      credentials: initialCredentials,
      audit: initialAudit,
    });
    setNotice("Demonstration certification data restored.");
  }

  return (
    <main className="engine-shell">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #07101c; }
        button, input, select, textarea { font: inherit; }
        .engine-shell { min-height: 100vh; color: #e9f0f8; background: radial-gradient(circle at 8% 0%, rgba(42,117,150,.20), transparent 28rem), radial-gradient(circle at 100% 12%, rgba(122,83,179,.15), transparent 30rem), #07101c; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .topbar { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .9rem clamp(1rem, 3vw, 2.5rem); border-bottom: 1px solid #223249; background: rgba(7,16,28,.92); backdrop-filter: blur(16px); }
        .brand { display: flex; align-items: center; gap: .8rem; }
        .mark { display:grid; place-items:center; width: 2.35rem; height:2.35rem; border:1px solid #4f83a2; border-radius:.65rem; background:#10253a; font-weight:900; color:#91d7f7; }
        .brand strong { display:block; letter-spacing:.03em; }
        .brand small { color:#8fa3b9; }
        .top-actions { display:flex; gap:.55rem; flex-wrap:wrap; justify-content:flex-end; }
        .btn, .link-btn { border:1px solid #36506d; border-radius:.55rem; background:#102035; color:#e9f0f8; padding:.62rem .85rem; cursor:pointer; text-decoration:none; font-weight:750; }
        .btn:hover, .link-btn:hover { border-color:#6eaacb; background:#16304a; }
        .btn.primary { background:#16739b; border-color:#2b9dca; color:white; }
        .btn.danger { border-color:#8f4951; background:#32191f; }
        .btn.good { border-color:#34765b; background:#143328; }
        .btn:disabled { opacity:.45; cursor:not-allowed; }
        .layout { display:grid; grid-template-columns: 15.5rem minmax(0,1fr); min-height:calc(100vh - 65px); }
        .sidebar { padding:1.2rem; border-right:1px solid #1f3045; background:rgba(8,18,31,.78); }
        .sidebar h2 { margin:.2rem 0 1rem; font-size:.78rem; color:#7f94aa; letter-spacing:.14em; text-transform:uppercase; }
        .nav { display:grid; gap:.38rem; }
        .nav button { text-align:left; padding:.76rem .8rem; border:1px solid transparent; border-radius:.55rem; background:transparent; color:#aebdcb; cursor:pointer; font-weight:740; }
        .nav button:hover { background:#101f32; color:white; }
        .nav button.active { border-color:#315c78; background:#102b40; color:#a8e3ff; }
        .guardrail { margin-top:1.2rem; padding:.85rem; border:1px solid #584d2d; border-radius:.65rem; background:#241f12; color:#d8c995; font-size:.82rem; line-height:1.45; }
        .content { min-width:0; padding:clamp(1rem,3vw,2.2rem); }
        .hero { display:flex; justify-content:space-between; gap:1.5rem; align-items:flex-end; margin-bottom:1.2rem; }
        .eyebrow { margin:0 0 .35rem; color:#71c3e9; font-weight:850; letter-spacing:.12em; text-transform:uppercase; font-size:.75rem; }
        h1 { margin:0; font-size:clamp(1.75rem,4vw,3rem); letter-spacing:-.035em; }
        .hero p { max-width:54rem; color:#9eb0c2; line-height:1.55; margin:.65rem 0 0; }
        .notice { padding:.8rem 1rem; margin:0 0 1rem; border:1px solid #2d536b; border-radius:.65rem; background:#0d2738; color:#b7dced; }
        .metrics { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:.8rem; margin-bottom:1rem; }
        .metric { padding:1rem; border:1px solid #263b52; border-radius:.75rem; background:rgba(13,28,47,.88); }
        .metric span { display:block; color:#8ca0b5; font-size:.77rem; font-weight:800; text-transform:uppercase; letter-spacing:.08em; }
        .metric strong { display:block; margin-top:.25rem; font-size:1.7rem; }
        .grid { display:grid; gap:1rem; }
        .grid.two { grid-template-columns:minmax(0,1.25fr) minmax(19rem,.75fr); }
        .grid.equal { grid-template-columns:repeat(2,minmax(0,1fr)); }
        .card { border:1px solid #263a51; border-radius:.8rem; background:rgba(11,25,42,.92); overflow:hidden; }
        .card-head { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1rem 1.05rem; border-bottom:1px solid #22354a; }
        .card-head h2, .card-head h3 { margin:0; font-size:1rem; }
        .card-body { padding:1rem 1.05rem; }
        .stack { display:grid; gap:.7rem; }
        .row { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
        .muted { color:#8fa2b6; }
        .tiny { font-size:.78rem; }
        .pill { display:inline-flex; align-items:center; padding:.25rem .48rem; border:1px solid #40546b; border-radius:99px; font-size:.7rem; font-weight:900; letter-spacing:.06em; }
        .pill.good { background:#123529; border-color:#337457; color:#a8ebca; }
        .pill.warn { background:#392d16; border-color:#75602d; color:#f4d68a; }
        .pill.bad { background:#3a1b22; border-color:#82414b; color:#f6abb5; }
        .pill.neutral { background:#182536; color:#b7c4d2; }
        .list-item { width:100%; display:block; text-align:left; padding:.8rem; border:1px solid #263b52; border-radius:.65rem; background:#0c1d31; color:inherit; cursor:pointer; }
        .list-item:hover, .list-item.selected { border-color:#4e83a2; background:#102a40; }
        .list-title { display:flex; align-items:flex-start; justify-content:space-between; gap:.8rem; }
        .list-title strong { font-size:.92rem; }
        .meta { display:flex; flex-wrap:wrap; gap:.4rem .8rem; margin-top:.42rem; color:#899db1; font-size:.77rem; }
        .field { display:grid; gap:.35rem; }
        .field label { color:#94a8bc; font-size:.76rem; font-weight:820; text-transform:uppercase; letter-spacing:.06em; }
        input, select, textarea { width:100%; border:1px solid #334a63; border-radius:.52rem; background:#081728; color:#eef5fb; padding:.68rem .72rem; outline:none; }
        textarea { min-height:7rem; resize:vertical; line-height:1.45; }
        input:focus, select:focus, textarea:focus { border-color:#5ca5c9; box-shadow:0 0 0 3px rgba(66,154,197,.14); }
        .toolbar { display:flex; flex-wrap:wrap; gap:.55rem; align-items:center; margin-bottom:.8rem; }
        .toolbar input { flex:1 1 18rem; }
        .toolbar select { width:auto; min-width:12rem; }
        .progress { height:.5rem; border-radius:99px; overflow:hidden; background:#18283a; }
        .progress > span { display:block; height:100%; background:linear-gradient(90deg,#2d8bb3,#73d0e8); }
        .requirement { padding:.8rem; border:1px solid #263a50; border-radius:.6rem; background:#0b1c2e; }
        .requirement p { margin:.35rem 0 0; color:#90a3b6; line-height:1.45; }
        .evidence { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:.8rem; padding:.75rem 0; border-bottom:1px solid #203247; }
        .evidence:last-child { border-bottom:0; }
        .decision-bar { display:flex; flex-wrap:wrap; gap:.55rem; padding-top:.75rem; }
        .table-wrap { overflow:auto; }
        table { width:100%; border-collapse:collapse; min-width:760px; }
        th, td { text-align:left; padding:.72rem .8rem; border-bottom:1px solid #213247; font-size:.82rem; }
        th { color:#8fa3b7; font-size:.7rem; text-transform:uppercase; letter-spacing:.07em; }
        tr.clickable { cursor:pointer; }
        tr.clickable:hover, tr.clickable.selected { background:#10283c; }
        .audit { display:grid; grid-template-columns:10rem 11rem minmax(0,1fr); gap:.8rem; padding:.75rem 0; border-bottom:1px solid #203247; }
        .audit:last-child { border:0; }
        .empty { padding:2rem; text-align:center; color:#8ea1b5; }
        .footer-note { margin-top:1rem; padding:1rem; border:1px dashed #385069; border-radius:.7rem; color:#8da2b7; font-size:.8rem; line-height:1.55; }
        @media (max-width:1100px) { .metrics { grid-template-columns:repeat(3,1fr); } .grid.two,.grid.equal { grid-template-columns:1fr; } }
        @media (max-width:780px) { .layout { grid-template-columns:1fr; } .sidebar { position:static; border-right:0; border-bottom:1px solid #1f3045; } .nav { grid-template-columns:repeat(3,1fr); } .nav button { text-align:center; font-size:.78rem; } .guardrail { display:none; } .hero { align-items:flex-start; flex-direction:column; } .metrics { grid-template-columns:repeat(2,1fr); } .topbar { align-items:flex-start; } .brand small { display:none; } .audit { grid-template-columns:1fr; gap:.25rem; } }
        @media (max-width:520px) { .metrics { grid-template-columns:1fr; } .nav { grid-template-columns:repeat(2,1fr); } .top-actions .link-btn { display:none; } .content { padding:1rem; } }
      `}</style>

      <header className="topbar">
        <div className="brand"><div className="mark">14</div><div><strong>TA-14 Academy</strong><small>Certification governance workspace</small></div></div>
        <div className="top-actions">
          <Link className="link-btn" href="/academy/instructor-console">Instructor Console</Link>
          <Link className="link-btn" href="/academy/credential-dashboard">Credential Dashboard</Link>
          <button className="btn" onClick={() => downloadJson("ta14-certification-engine-export.json", state)}>Export</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <h2>Certification engine</h2>
          <nav className="nav">
            {(["overview", "programs", "candidates", "issuance", "registry", "governance"] as EngineTab[]).map((tab) => (
              <button key={tab} className={state.tab === tab ? "active" : ""} onClick={() => setState((current) => ({ ...current, tab }))}>{tab[0].toUpperCase() + tab.slice(1)}</button>
            ))}
          </nav>
          <div className="guardrail"><strong>Governance boundary</strong><br />This interface records certification decisions. It does not create authority, waive requirements, or prove competence merely because a control was clicked.</div>
        </aside>

        <section className="content">
          <div className="hero">
            <div><p className="eyebrow">Academy administration</p><h1>Certification Engine</h1><p>Define certification standards, evaluate candidate evidence, preserve authorized decisions, issue verifiable credentials, and govern the credential lifecycle.</p></div>
            <button className="btn" onClick={resetDemo}>Reset demo</button>
          </div>
          <div className="notice">{notice}</div>

          {state.tab === "overview" && <>
            <div className="metrics">
              <div className="metric"><span>Active programs</span><strong>{metrics.activePrograms}</strong></div>
              <div className="metric"><span>Pending reviews</span><strong>{metrics.pendingReviews}</strong></div>
              <div className="metric"><span>Approved to issue</span><strong>{metrics.approvedAwaitingIssue}</strong></div>
              <div className="metric"><span>Active credentials</span><strong>{metrics.activeCredentials}</strong></div>
              <div className="metric"><span>Renewal attention</span><strong>{metrics.renewalDue}</strong></div>
            </div>
            <div className="grid two">
              <div className="card"><div className="card-head"><h2>Decision queue</h2><button className="btn" onClick={() => setState((c) => ({ ...c, tab: "candidates" }))}>Open queue</button></div><div className="card-body stack">
                {state.candidates.filter((candidate) => ["ELIGIBLE", "UNDER_REVIEW", "APPROVED", "RENEWAL_DUE"].includes(candidate.state)).map((candidate) => {
                  const program = state.programs.find((item) => item.id === candidate.programId);
                  return <button key={candidate.id} className="list-item" onClick={() => setState((c) => ({ ...c, tab: candidate.state === "APPROVED" ? "issuance" : "candidates", selectedCandidateId: candidate.id }))}><div className="list-title"><strong>{candidate.name}</strong><span className={`pill ${statusClass(candidate.state)}`}>{candidate.state.replaceAll("_", " ")}</span></div><div className="meta"><span>{program?.code}</span><span>{candidate.completion}% complete</span><span>{candidate.score} assessment</span><span>{candidate.assignedReviewer}</span></div></button>;
                })}
              </div></div>
              <div className="card"><div className="card-head"><h2>Control posture</h2></div><div className="card-body stack">
                <div className="requirement"><div className="row"><strong>Separation of decision and issuance</strong><span className="pill good">ENFORCED</span></div><p>Approval changes candidate status; a separate issuance action creates the registry record.</p></div>
                <div className="requirement"><div className="row"><strong>Program version binding</strong><span className="pill good">ENFORCED</span></div><p>Every credential records the program version in force at issuance.</p></div>
                <div className="requirement"><div className="row"><strong>Lifecycle audit</strong><span className="pill good">ACTIVE</span></div><p>Issue, renewal, suspension, revocation, and reinstatement actions are preserved.</p></div>
                <div className="requirement"><div className="row"><strong>External verification</strong><span className="pill warn">DEMO</span></div><p>Verification codes are generated locally in this page and are not connected to a production registry service.</p></div>
              </div></div>
            </div>
            <div className="card" style={{ marginTop: "1rem" }}><div className="card-head"><h2>Recent audit activity</h2></div><div className="card-body">{state.audit.slice(0, 6).map((event) => <div className="audit" key={event.id}><span className="tiny muted">{formatDate(event.timestamp)}</span><strong>{event.actor}</strong><div><strong>{event.action}</strong> · {event.subject}<div className="tiny muted">{event.detail}</div></div></div>)}</div></div>
          </>}

          {state.tab === "programs" && <div className="grid two">
            <div className="card"><div className="card-head"><h2>Certification programs</h2><span className="pill neutral">{state.programs.length} TOTAL</span></div><div className="card-body stack">{state.programs.map((program) => <button className={`list-item ${program.id === selectedProgram?.id ? "selected" : ""}`} key={program.id} onClick={() => setState((c) => ({ ...c, selectedProgramId: program.id }))}><div className="list-title"><strong>{program.code} · {program.title}</strong><span className={`pill ${statusClass(program.state)}`}>{program.state}</span></div><div className="meta"><span>v{program.version}</span><span>{program.validityMonths} months</span><span>{program.requirements.length} requirements</span><span>{program.reviewQuorum}-reviewer quorum</span></div></button>)}</div></div>
            {selectedProgram && <div className="card"><div className="card-head"><h2>Program standard</h2><span className={`pill ${statusClass(selectedProgram.state)}`}>{selectedProgram.state}</span></div><div className="card-body stack">
              <div><h3 style={{ margin: 0 }}>{selectedProgram.title}</h3><p className="muted">{selectedProgram.summary}</p></div>
              <div className="grid equal"><div className="requirement"><span className="tiny muted">PASSING SCORE</span><strong style={{ display: "block", fontSize: "1.4rem" }}>{selectedProgram.passingScore}%</strong></div><div className="requirement"><span className="tiny muted">VALIDITY</span><strong style={{ display: "block", fontSize: "1.4rem" }}>{selectedProgram.validityMonths} mo</strong></div></div>
              <div><strong>Requirements</strong><div className="stack" style={{ marginTop: ".55rem" }}>{selectedProgram.requirements.map((requirement) => <div className="requirement" key={requirement.id}><div className="row"><strong>{requirement.label}</strong><span className="pill neutral">{requirement.weight}%</span></div><p>{requirement.description}</p></div>)}</div></div>
              <div><strong>Competency scope</strong><div className="meta">{selectedProgram.competencies.map((competency) => <span className="pill neutral" key={competency}>{competency}</span>)}</div></div>
              <div className="field"><label>Program state</label><select value={selectedProgram.state} onChange={(event) => setState((current) => ({ ...current, programs: current.programs.map((program) => program.id === selectedProgram.id ? { ...program, state: event.target.value as ProgramState, updatedAt: new Date().toISOString() } : program) }))}><option>DRAFT</option><option>ACTIVE</option><option>PAUSED</option><option>RETIRED</option></select></div>
              <button className="btn" onClick={() => { addAudit("Updated program state", selectedProgram.title, `Program state is now ${selectedProgram.state}.`); setNotice("Program state preserved in the local audit record."); }}>Record program update</button>
            </div></div>}
          </div>}

          {state.tab === "candidates" && <>
            <div className="toolbar"><input value={state.candidateSearch} onChange={(event) => setState((c) => ({ ...c, candidateSearch: event.target.value }))} placeholder="Search candidates, organizations, programs…" /><select value={state.candidateFilter} onChange={(event) => setState((c) => ({ ...c, candidateFilter: event.target.value as PersistedState["candidateFilter"] }))}><option value="ALL">All states</option>{["INELIGIBLE", "ELIGIBLE", "UNDER_REVIEW", "APPROVED", "ISSUED", "RENEWAL_DUE", "REVOKED"].map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="grid two"><div className="card"><div className="card-head"><h2>Candidate queue</h2><span className="pill neutral">{filteredCandidates.length} SHOWN</span></div><div className="card-body stack">{filteredCandidates.length ? filteredCandidates.map((candidate) => { const program = state.programs.find((item) => item.id === candidate.programId); return <button key={candidate.id} className={`list-item ${candidate.id === selectedCandidate?.id ? "selected" : ""}`} onClick={() => setState((c) => ({ ...c, selectedCandidateId: candidate.id }))}><div className="list-title"><strong>{candidate.name}</strong><span className={`pill ${statusClass(candidate.state)}`}>{candidate.state.replaceAll("_", " ")}</span></div><div className="meta"><span>{program?.code}</span><span>{candidate.organization}</span><span>{candidate.score}% score</span><span>{candidate.completion}% complete</span></div></button>; }) : <div className="empty">No candidates match this view.</div>}</div></div>
              {selectedCandidate && <div className="card"><div className="card-head"><h2>Eligibility and evidence</h2><span className={`pill ${statusClass(selectedCandidate.state)}`}>{selectedCandidate.state.replaceAll("_", " ")}</span></div><div className="card-body stack">
                <div><h3 style={{ margin: 0 }}>{selectedCandidate.name}</h3><div className="muted">{selectedCandidate.role} · {selectedCandidate.organization}</div></div>
                <div><div className="row tiny"><span>Completion</span><strong>{selectedCandidate.completion}%</strong></div><div className="progress"><span style={{ width: `${selectedCandidate.completion}%` }} /></div></div>
                <div>{selectedCandidate.evidence.map((evidence) => <div className="evidence" key={evidence.id}><div><strong>{evidence.title}</strong><div className="tiny muted">{evidence.source} · {evidence.verifier} · {formatDate(evidence.submittedAt)}</div></div><span className={`pill ${statusClass(evidence.state)}`}>{evidence.state}</span></div>)}</div>
                <div className="field"><label>Review finding</label><textarea value={selectedCandidate.reviewNote} onChange={(event) => updateCandidate({ reviewNote: event.target.value })} placeholder="State the evidence reviewed, the governing standard, the finding, and any required remediation." /></div>
                <div className="decision-bar"><button className="btn good" onClick={() => recordDecision("APPROVE")}>Approve</button><button className="btn" onClick={() => recordDecision("RETURN")}>Return for remediation</button><button className="btn danger" onClick={() => recordDecision("DENY")}>Deny</button></div>
              </div></div>}
            </div>
          </>}

          {state.tab === "issuance" && <div className="grid two">
            <div className="card"><div className="card-head"><h2>Approved candidates</h2><span className="pill neutral">SEPARATE ACTION</span></div><div className="card-body stack">{state.candidates.filter((candidate) => candidate.state === "APPROVED").length ? state.candidates.filter((candidate) => candidate.state === "APPROVED").map((candidate) => <button className={`list-item ${candidate.id === selectedCandidate?.id ? "selected" : ""}`} key={candidate.id} onClick={() => setState((c) => ({ ...c, selectedCandidateId: candidate.id }))}><div className="list-title"><strong>{candidate.name}</strong><span className="pill good">APPROVED</span></div><div className="meta"><span>{state.programs.find((item) => item.id === candidate.programId)?.title}</span><span>{candidate.score}% score</span><span>{candidate.assignedReviewer}</span></div></button>) : <div className="empty">No candidates are awaiting issuance.</div>}</div></div>
            <div className="card"><div className="card-head"><h2>Issuance control</h2></div><div className="card-body stack">{selectedCandidate ? <>
              <div className="requirement"><span className="tiny muted">CANDIDATE</span><strong style={{ display: "block" }}>{selectedCandidate.name}</strong></div>
              <div className="requirement"><span className="tiny muted">PROGRAM</span><strong style={{ display: "block" }}>{state.programs.find((item) => item.id === selectedCandidate.programId)?.title ?? "Unknown program"}</strong></div>
              <div className="requirement"><span className="tiny muted">DECISION</span><strong style={{ display: "block" }}>{selectedCandidate.decision}</strong></div>
              <div className="requirement"><span className="tiny muted">MANDATORY EVIDENCE</span><strong style={{ display: "block" }}>{selectedCandidate.evidence.filter((item) => item.state === "VERIFIED").length} verified · {selectedCandidate.evidence.filter((item) => item.state !== "VERIFIED").length} unresolved</strong></div>
              <button className="btn primary" disabled={selectedCandidate.state !== "APPROVED"} onClick={issueCredential}>Issue credential and register</button>
              <p className="tiny muted">Issuance creates a distinct credential record bound to the selected program version. This demonstration uses local browser state and does not sign a production credential.</p>
            </> : <div className="empty">Select an approved candidate.</div>}</div></div>
          </div>}

          {state.tab === "registry" && <>
            <div className="toolbar"><input value={state.registrySearch} onChange={(event) => setState((c) => ({ ...c, registrySearch: event.target.value }))} placeholder="Search holder, program, verification code, or state…" /><button className="btn" onClick={() => downloadJson("ta14-credential-registry.json", state.credentials)}>Export registry</button></div>
            <div className="card"><div className="card-head"><h2>Credential registry</h2><span className="pill neutral">{filteredCredentials.length} RECORDS</span></div><div className="table-wrap"><table><thead><tr><th>Verification code</th><th>Holder</th><th>Program</th><th>Issued</th><th>Expires</th><th>State</th></tr></thead><tbody>{filteredCredentials.map((credential) => <tr key={credential.id} className={`clickable ${credential.id === selectedCredential?.id ? "selected" : ""}`} onClick={() => setState((c) => ({ ...c, selectedCredentialId: credential.id }))}><td><strong>{credential.verificationCode}</strong></td><td>{credential.holder}</td><td>{credential.programCode} · v{credential.version}</td><td>{formatDate(credential.issuedAt)}</td><td>{formatDate(credential.expiresAt)}</td><td><span className={`pill ${statusClass(credential.state)}`}>{credential.state}</span></td></tr>)}</tbody></table></div></div>
            {selectedCredential && <div className="grid equal" style={{ marginTop: "1rem" }}><div className="card"><div className="card-head"><h2>Registry record</h2></div><div className="card-body stack"><div><h3 style={{ margin: 0 }}>{selectedCredential.holder}</h3><p className="muted">{selectedCredential.programTitle}</p></div><div className="requirement"><span className="tiny muted">VERIFICATION CODE</span><strong style={{ display: "block", fontSize: "1.2rem" }}>{selectedCredential.verificationCode}</strong></div><div className="grid equal"><div className="requirement"><span className="tiny muted">ISSUED</span><strong style={{ display: "block" }}>{formatDate(selectedCredential.issuedAt)}</strong></div><div className="requirement"><span className="tiny muted">EXPIRES</span><strong style={{ display: "block" }}>{formatDate(selectedCredential.expiresAt)}</strong></div></div></div></div>
              <div className="card"><div className="card-head"><h2>Public verification preview</h2><span className={`pill ${statusClass(selectedCredential.state)}`}>{selectedCredential.state}</span></div><div className="card-body stack"><p>This record confirms that the registry contains the credential shown. It does not grant execution authority outside the scope established by the holder's organization and governing route.</p><div className="requirement"><strong>Last lifecycle action</strong><p>{selectedCredential.lastAction}: {selectedCredential.actionReason}</p></div><button className="btn" onClick={() => downloadJson(`${selectedCredential.verificationCode}.json`, selectedCredential)}>Export verification record</button></div></div></div>}
          </>}

          {state.tab === "governance" && <div className="grid two">
            <div className="card"><div className="card-head"><h2>Credential lifecycle control</h2></div><div className="card-body stack">{selectedCredential ? <><div className="requirement"><span className="tiny muted">SELECTED RECORD</span><strong style={{ display: "block" }}>{selectedCredential.verificationCode}</strong><p>{selectedCredential.holder} · {selectedCredential.programTitle}</p></div><div className="decision-bar"><button className="btn good" onClick={() => governCredential("RENEW")}>Renew</button><button className="btn" onClick={() => governCredential("SUSPEND")}>Suspend</button><button className="btn danger" onClick={() => governCredential("REVOKE")}>Revoke</button><button className="btn" onClick={() => governCredential("REINSTATE")}>Reinstate</button></div><p className="tiny muted">Production actions should require authenticated authority, reason codes, referenced decision records, and durable server-side audit storage. This page demonstrates the workflow only.</p></> : <div className="empty">Select a credential in the registry.</div>}</div></div>
            <div className="card"><div className="card-head"><h2>Audit ledger</h2><button className="btn" onClick={() => downloadJson("ta14-certification-audit.json", state.audit)}>Export audit</button></div><div className="card-body">{state.audit.map((event) => <div className="audit" key={event.id}><span className="tiny muted">{formatDate(event.timestamp)}</span><strong>{event.actor}</strong><div><strong>{event.action}</strong> · {event.subject}<div className="tiny muted">{event.detail}</div></div></div>)}</div></div>
          </div>}

          <div className="footer-note"><strong>Implementation note:</strong> This is a client-side Academy administration interface with local persistence for demonstration and review. Production issuance, signing, identity verification, authorization, revocation publication, and registry durability require trusted server-side services and are intentionally not implied by this page.</div>
        </section>
      </div>
    </main>
  );
}
