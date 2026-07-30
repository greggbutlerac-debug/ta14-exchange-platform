"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type Tab =
  | "overview"
  | "institutions"
  | "applications"
  | "standards"
  | "instructors"
  | "evidence"
  | "reviews"
  | "findings"
  | "cycles"
  | "governance"
  | "matrix"
  | "site-review"
  | "panel"
  | "decisions"
  | "surveillance"
  | "reports";

type AccreditationState =
  | "APPLICANT"
  | "UNDER_REVIEW"
  | "CONDITIONAL"
  | "ACCREDITED"
  | "RENEWAL_DUE"
  | "SUSPENDED"
  | "EXPIRED";

type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type Severity = "CRITICAL" | "MAJOR" | "MINOR" | "OBSERVATION";
type EvidenceState = "UNVERIFIED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "EXPIRED";
type ReviewState = "PLANNED" | "EVIDENCE_OPEN" | "PANEL_REVIEW" | "DECISION_PENDING" | "COMPLETE";
type FindingState = "OPEN" | "CORRECTIVE_ACTION" | "VERIFICATION" | "CLOSED" | "OVERDUE";
type ApplicationState = "DRAFT" | "SUBMITTED" | "COMPLETENESS_REVIEW" | "ELIGIBLE" | "RETURNED";
type InstructorState = "PROPOSED" | "AUTHORIZED" | "CONDITIONAL" | "SUSPENDED" | "EXPIRED";
type CycleType = "INITIAL" | "SURVEILLANCE" | "RENEWAL" | "SPECIAL" | "CORRECTIVE_ACTION";

type Institution = {
  id: string;
  code: string;
  name: string;
  jurisdiction: string;
  program: string;
  state: AccreditationState;
  determination: Determination;
  readiness: number;
  evidenceComplete: number;
  standardsMet: number;
  standardsTotal: number;
  leadReviewer: string;
  accountableExecutive: string;
  nextMilestone: string;
  validThrough: string;
  submittedAt: string;
  lastReviewAt: string;
  openFindings: number;
  majorFindings: number;
  scope: string[];
  notes: string;
};

type Application = {
  id: string;
  institutionId: string;
  program: string;
  state: ApplicationState;
  owner: string;
  submittedAt: string;
  completeness: number;
  legalAuthority: boolean;
  programArchitecture: boolean;
  facultyRoster: boolean;
  evidencePlan: boolean;
  learnerProtection: boolean;
  notes: string;
};

type Standard = {
  id: string;
  code: string;
  title: string;
  category: string;
  principle: string;
  mandatory: boolean;
  weight: number;
  version: string;
  effectiveDate: string;
  state: "ACTIVE" | "DRAFT" | "RETIRED";
  evidence: string[];
  questions: string[];
};

type Instructor = {
  id: string;
  institutionId: string;
  name: string;
  email: string;
  role: string;
  programs: string[];
  state: InstructorState;
  qualificationScore: number;
  observedTeaching: string;
  authorizedAt: string;
  expiresAt: string;
  continuingEducationHours: number;
  conflictsDeclared: boolean;
  notes: string;
};

type EvidenceItem = {
  id: string;
  institutionId: string;
  standardId: string;
  title: string;
  type: string;
  source: string;
  owner: string;
  uploadedAt: string;
  observedAt: string;
  expiresAt: string;
  state: EvidenceState;
  confidence: number;
  hash: string;
  notes: string;
};

type Review = {
  id: string;
  institutionId: string;
  title: string;
  cycle: CycleType;
  state: ReviewState;
  opened: string;
  due: string;
  panel: string[];
  evidenceItems: number;
  verifiedItems: number;
  determination: Determination;
  summary: string;
};

type Finding = {
  id: string;
  institutionId: string;
  reviewId: string;
  standard: string;
  title: string;
  severity: Severity;
  state: FindingState;
  owner: string;
  opened: string;
  due: string;
  closed: string;
  description: string;
  correctiveAction: string;
  verification: string;
};

type Cycle = {
  id: string;
  institutionId: string;
  type: CycleType;
  windowStart: string;
  windowEnd: string;
  state: "UPCOMING" | "OPEN" | "COMPLETE" | "OVERDUE";
  owner: string;
  requiredReturns: string[];
  completion: number;
};

type AuditEvent = {
  id: string;
  institutionId: string;
  at: string;
  actor: string;
  action: string;
  objectType: string;
  objectId: string;
  detail: string;
};

type PersistedState = {
  tab: Tab;
  query: string;
  institutionFilter: "ALL" | AccreditationState;
  evidenceFilter: "ALL" | EvidenceState;
  findingFilter: "ALL" | FindingState;
  selectedInstitutionId: string;
  selectedApplicationId: string;
  selectedStandardId: string;
  selectedInstructorId: string;
  selectedEvidenceId: string;
  selectedReviewId: string;
  selectedFindingId: string;
  selectedCycleId: string;
  institutions: Institution[];
  applications: Application[];
  standards: Standard[];
  instructors: Instructor[];
  evidence: EvidenceItem[];
  reviews: Review[];
  findings: Finding[];
  cycles: Cycle[];
  audit: AuditEvent[];
};

const STORAGE_KEY = "ta14-academy-accreditation-center-production-v1";
const TODAY = "2026-07-30";

const initialInstitutions: Institution[] = [
  {
    id: "inst-001",
    code: "TA14-ACC-1001",
    name: "Northstar Governance Institute",
    jurisdiction: "United States",
    program: "Applied Route Reviewer",
    state: "UNDER_REVIEW",
    determination: "HOLD",
    readiness: 86,
    evidenceComplete: 91,
    standardsMet: 7,
    standardsTotal: 8,
    leadReviewer: "A. Rivera",
    accountableExecutive: "Dr. Lena Brooks",
    nextMilestone: "Panel review — Aug 12, 2026",
    validThrough: "Pending",
    submittedAt: "2026-06-18",
    lastReviewAt: "2026-07-24",
    openFindings: 1,
    majorFindings: 0,
    scope: ["Applied Route Reviewer", "Decision Record Lab"],
    notes: "Initial review is evidence-complete. One controlled-record issue remains open.",
  },
  {
    id: "inst-002",
    code: "TA14-ACC-1002",
    name: "Civic Systems Academy",
    jurisdiction: "Canada",
    program: "Governance Route Author",
    state: "CONDITIONAL",
    determination: "HOLD",
    readiness: 78,
    evidenceComplete: 83,
    standardsMet: 6,
    standardsTotal: 8,
    leadReviewer: "M. Okafor",
    accountableExecutive: "Elena Morales",
    nextMilestone: "Corrective action verification",
    validThrough: "2026-12-18",
    submittedAt: "2026-04-07",
    lastReviewAt: "2026-07-18",
    openFindings: 2,
    majorFindings: 2,
    scope: ["Governance Route Author"],
    notes: "Conditional standing remains active while independent appeal assignment is verified.",
  },
  {
    id: "inst-003",
    code: "TA14-ACC-1003",
    name: "Harborline Professional College",
    jurisdiction: "United States",
    program: "Applied Route Reviewer",
    state: "ACCREDITED",
    determination: "ALLOW",
    readiness: 96,
    evidenceComplete: 100,
    standardsMet: 8,
    standardsTotal: 8,
    leadReviewer: "S. Lind",
    accountableExecutive: "Marisol Grant",
    nextMilestone: "Annual surveillance — Nov 4, 2026",
    validThrough: "2028-05-31",
    submittedAt: "2025-11-12",
    lastReviewAt: "2026-05-31",
    openFindings: 0,
    majorFindings: 0,
    scope: ["Applied Route Reviewer", "Runtime Governance Steward"],
    notes: "Accredited without conditions. Surveillance sample is scheduled.",
  },
  {
    id: "inst-004",
    code: "TA14-ACC-1004",
    name: "Meridian Exchange School",
    jurisdiction: "United Kingdom",
    program: "Runtime Governance Steward",
    state: "APPLICANT",
    determination: "HOLD",
    readiness: 42,
    evidenceComplete: 37,
    standardsMet: 3,
    standardsTotal: 8,
    leadReviewer: "Unassigned",
    accountableExecutive: "Oliver Shaw",
    nextMilestone: "Application completeness review",
    validThrough: "Pending",
    submittedAt: "2026-07-25",
    lastReviewAt: "Not reviewed",
    openFindings: 0,
    majorFindings: 0,
    scope: ["Runtime Governance Steward"],
    notes: "Application is not yet eligible for substantive review.",
  },
  {
    id: "inst-005",
    code: "TA14-ACC-1005",
    name: "Axis Public Services Institute",
    jurisdiction: "Australia",
    program: "Governance Route Author",
    state: "RENEWAL_DUE",
    determination: "ESCALATE",
    readiness: 89,
    evidenceComplete: 76,
    standardsMet: 7,
    standardsTotal: 8,
    leadReviewer: "J. Bell",
    accountableExecutive: "Priya Shah",
    nextMilestone: "Renewal evidence due — Sep 2, 2026",
    validThrough: "2026-10-15",
    submittedAt: "2024-10-15",
    lastReviewAt: "2026-07-21",
    openFindings: 1,
    majorFindings: 1,
    scope: ["Governance Route Author", "Assessment Administration"],
    notes: "Two expired assessor credentials require immediate authority revalidation.",
  },
];

const initialApplications: Application[] = [
  { id: "app-001", institutionId: "inst-004", program: "Runtime Governance Steward", state: "COMPLETENESS_REVIEW", owner: "Oliver Shaw", submittedAt: "2026-07-25", completeness: 67, legalAuthority: true, programArchitecture: true, facultyRoster: false, evidencePlan: false, learnerProtection: true, notes: "Faculty authorization evidence and retention plan remain incomplete." },
  { id: "app-002", institutionId: "inst-001", program: "Applied Route Reviewer", state: "ELIGIBLE", owner: "Dr. Lena Brooks", submittedAt: "2026-06-18", completeness: 100, legalAuthority: true, programArchitecture: true, facultyRoster: true, evidencePlan: true, learnerProtection: true, notes: "Application passed completeness and eligibility review." },
  { id: "app-003", institutionId: "inst-002", program: "Governance Route Author", state: "ELIGIBLE", owner: "Elena Morales", submittedAt: "2026-04-07", completeness: 100, legalAuthority: true, programArchitecture: true, facultyRoster: true, evidencePlan: true, learnerProtection: true, notes: "Application entered substantive review with no completeness exceptions." },
];

const initialStandards: Standard[] = [
  { id: "std-01", code: "AC-01", title: "Institutional authority", category: "Institution", principle: "The institution must establish and preserve the authority under which accredited instruction, assessment, and credential recommendations occur.", mandatory: true, weight: 10, version: "1.0", effectiveDate: "2026-07-01", state: "ACTIVE", evidence: ["Charter or legal authority", "Governance appointments", "Delegation boundaries", "Accountable executive attestation"], questions: ["Who has authority to bind the institution?", "Is the authority current for this exact program?", "Can delegated authority survive challenge?"] },
  { id: "std-02", code: "AC-02", title: "Program correspondence", category: "Program", principle: "The delivered program must correspond to the approved Academy program, version, competencies, and governing boundaries.", mandatory: true, weight: 10, version: "1.0", effectiveDate: "2026-07-01", state: "ACTIVE", evidence: ["Approved curriculum map", "Version history", "Change approvals", "Learning outcome crosswalk"], questions: ["Does delivery correspond to the approved architecture?", "Are material changes controlled?", "Are prerequisites enforceable?"] },
  { id: "std-03", code: "AC-03", title: "Controlled learning records", category: "Evidence", principle: "Learning records must be attributable, reviewable, versioned, and preserved without overstating what occurred.", mandatory: true, weight: 10, version: "1.0", effectiveDate: "2026-07-01", state: "ACTIVE", evidence: ["Enrollment records", "Completion evidence", "Version and effective dates", "Retention controls"], questions: ["Can every record be attributed?", "Has continuity been preserved?", "Can correction be distinguished from deletion?"] },
  { id: "std-04", code: "AC-04", title: "Qualified instructors", category: "Faculty", principle: "Instruction may only be delivered by personnel whose competence and authority are current for the assigned program.", mandatory: true, weight: 10, version: "1.0", effectiveDate: "2026-07-01", state: "ACTIVE", evidence: ["Instructor qualifications", "Authorization records", "Observed teaching", "Continuing competence"], questions: ["Is the instructor qualified for this exact activity?", "Is authorization current?", "Are conflicts declared and bounded?"] },
  { id: "std-05", code: "AC-05", title: "Assessment integrity", category: "Assessment", principle: "Assessment must preserve identity, conditions, scoring integrity, challengeability, and separation of incompatible roles.", mandatory: true, weight: 10, version: "1.0", effectiveDate: "2026-07-01", state: "ACTIVE", evidence: ["Assessment blueprint", "Administration controls", "Scoring records", "Moderation records"], questions: ["Does the assessment test the claimed competence?", "Are scoring boundaries controlled?", "Can the decision survive challenge?"] },
  { id: "std-06", code: "AC-06", title: "Credential recommendation", category: "Credential", principle: "An institution may recommend a credential only after every required condition has been verified and unresolved conditions have been exposed.", mandatory: true, weight: 10, version: "1.0", effectiveDate: "2026-07-01", state: "ACTIVE", evidence: ["Eligibility review", "Final determination", "Recommendation record", "Unresolved condition disclosure"], questions: ["Has every condition been verified?", "Is the recommendation within scope?", "Has unsupported inference been excluded?"] },
  { id: "std-07", code: "AC-07", title: "Challenge and appeal", category: "Learner Protection", principle: "Learners and affected parties must have access to a bounded, independent, and preserved challenge process.", mandatory: true, weight: 10, version: "1.0", effectiveDate: "2026-07-01", state: "ACTIVE", evidence: ["Appeal procedure", "Independent assignment", "Disposition records", "Notice templates"], questions: ["Is the reviewer independent?", "Are challenge boundaries clear?", "Is the disposition preserved?"] },
  { id: "std-08", code: "AC-08", title: "Ongoing surveillance", category: "Continuity", principle: "Accreditation remains conditional on continued correspondence, current authority, material-change disclosure, and successful surveillance.", mandatory: true, weight: 10, version: "1.0", effectiveDate: "2026-07-01", state: "ACTIVE", evidence: ["Annual return", "Material change notices", "Surveillance findings", "Renewal plan"], questions: ["Has the institution remained within the approved boundary?", "Have material changes been disclosed?", "Is standing still supported by current evidence?"] },
];

const initialInstructors: Instructor[] = [
  { id: "ins-001", institutionId: "inst-001", name: "Maya Chen", email: "maya.chen@northstar.example", role: "Lead Instructor", programs: ["Applied Route Reviewer"], state: "AUTHORIZED", qualificationScore: 96, observedTeaching: "2026-06-28", authorizedAt: "2026-07-02", expiresAt: "2027-07-02", continuingEducationHours: 28, conflictsDeclared: true, notes: "Authorized for all current Applied Route Reviewer modules." },
  { id: "ins-002", institutionId: "inst-002", name: "Daniel Clarke", email: "d.clarke@civic.example", role: "Assessment Lead", programs: ["Governance Route Author"], state: "CONDITIONAL", qualificationScore: 82, observedTeaching: "2026-05-10", authorizedAt: "2026-05-22", expiresAt: "2026-12-18", continuingEducationHours: 16, conflictsDeclared: true, notes: "Independent appeal assignment must be demonstrated before unrestricted renewal." },
  { id: "ins-003", institutionId: "inst-003", name: "Sofia Lind", email: "s.lind@harborline.example", role: "Program Director", programs: ["Applied Route Reviewer", "Runtime Governance Steward"], state: "AUTHORIZED", qualificationScore: 98, observedTeaching: "2026-04-18", authorizedAt: "2026-05-31", expiresAt: "2028-05-31", continuingEducationHours: 41, conflictsDeclared: true, notes: "No restrictions." },
  { id: "ins-004", institutionId: "inst-005", name: "Aiden Grant", email: "a.grant@axis.example", role: "Assessor", programs: ["Governance Route Author"], state: "EXPIRED", qualificationScore: 88, observedTeaching: "2025-08-12", authorizedAt: "2025-09-01", expiresAt: "2026-07-15", continuingEducationHours: 12, conflictsDeclared: true, notes: "Assessment authority suspended pending revalidation." },
];

const initialEvidence: EvidenceItem[] = [
  { id: "ev-001", institutionId: "inst-001", standardId: "std-01", title: "Institutional charter and delegation register", type: "Authority Record", source: "Board Secretariat", owner: "Dr. Lena Brooks", uploadedAt: "2026-06-18", observedAt: "2026-06-15", expiresAt: "2027-06-15", state: "ACCEPTED", confidence: 98, hash: "sha256:1b72…a08f", notes: "Authority chain verified against board resolution." },
  { id: "ev-002", institutionId: "inst-001", standardId: "std-03", title: "Course version approval record", type: "Controlled Record", source: "Academic Quality Office", owner: "Maya Chen", uploadedAt: "2026-07-19", observedAt: "2026-07-18", expiresAt: "", state: "UNDER_REVIEW", confidence: 84, hash: "sha256:9af1…cc20", notes: "Effective date is present; supersession relationship is being confirmed." },
  { id: "ev-003", institutionId: "inst-002", standardId: "std-07", title: "Independent appeal assignment test records", type: "Verification Sample", source: "Learner Protection Office", owner: "Daniel Clarke", uploadedAt: "2026-07-28", observedAt: "2026-07-26", expiresAt: "", state: "UNDER_REVIEW", confidence: 76, hash: "sha256:42ee…907a", notes: "Three samples submitted. Reviewer independence requires confirmation." },
  { id: "ev-004", institutionId: "inst-003", standardId: "std-05", title: "Assessment moderation package", type: "Assessment Evidence", source: "Assessment Board", owner: "Sofia Lind", uploadedAt: "2026-05-20", observedAt: "2026-05-18", expiresAt: "2027-05-18", state: "ACCEPTED", confidence: 99, hash: "sha256:ce11…5f44", notes: "Sample demonstrates scoring consistency and independent moderation." },
  { id: "ev-005", institutionId: "inst-005", standardId: "std-04", title: "Assessor authorization roster", type: "Faculty Record", source: "Human Resources", owner: "Priya Shah", uploadedAt: "2026-07-21", observedAt: "2026-07-20", expiresAt: "2026-07-15", state: "EXPIRED", confidence: 93, hash: "sha256:fc92…160b", notes: "Two listed assessors exceeded authorization validity." },
  { id: "ev-006", institutionId: "inst-004", standardId: "std-04", title: "Proposed faculty roster", type: "Application Evidence", source: "Program Office", owner: "Oliver Shaw", uploadedAt: "2026-07-25", observedAt: "2026-07-24", expiresAt: "", state: "REJECTED", confidence: 61, hash: "sha256:7c90…e232", notes: "Roster does not contain role-specific authorization evidence." },
];

const initialReviews: Review[] = [
  { id: "rev-771", institutionId: "inst-001", title: "Initial institutional accreditation", cycle: "INITIAL", state: "PANEL_REVIEW", opened: "2026-06-18", due: "2026-08-12", panel: ["A. Rivera", "S. Lind", "J. Bell"], evidenceItems: 64, verifiedItems: 58, determination: "HOLD", summary: "Panel review is open. One record-continuity issue remains unresolved." },
  { id: "rev-772", institutionId: "inst-002", title: "Conditional accreditation follow-up", cycle: "CORRECTIVE_ACTION", state: "EVIDENCE_OPEN", opened: "2026-07-10", due: "2026-08-28", panel: ["M. Okafor", "P. Shah"], evidenceItems: 31, verifiedItems: 22, determination: "HOLD", summary: "Corrective evidence is being tested for independent appeal assignment." },
  { id: "rev-773", institutionId: "inst-003", title: "Annual surveillance review", cycle: "SURVEILLANCE", state: "PLANNED", opened: "2026-11-04", due: "2026-11-20", panel: ["S. Lind"], evidenceItems: 18, verifiedItems: 0, determination: "ALLOW", summary: "Surveillance sample scheduled; current standing remains active." },
  { id: "rev-774", institutionId: "inst-005", title: "Accreditation renewal", cycle: "RENEWAL", state: "EVIDENCE_OPEN", opened: "2026-07-21", due: "2026-09-02", panel: ["J. Bell", "A. Grant"], evidenceItems: 48, verifiedItems: 35, determination: "ESCALATE", summary: "Expired assessor authority requires immediate escalation and corrected sampling." },
];

const initialFindings: Finding[] = [
  { id: "find-101", institutionId: "inst-002", reviewId: "rev-772", standard: "AC-04", title: "Instructor authorization records are incomplete", severity: "MAJOR", state: "CORRECTIVE_ACTION", owner: "Elena Morales", opened: "2026-07-12", due: "2026-08-18", closed: "", description: "The active instructor roster cannot be fully reconciled to current role-specific authorization records.", correctiveAction: "Reconcile the roster, preserve approval history, and remove unsupported instructional assignments.", verification: "Pending reviewer verification." },
  { id: "find-102", institutionId: "inst-002", reviewId: "rev-772", standard: "AC-07", title: "Appeal process lacks independent reviewer assignment", severity: "MAJOR", state: "VERIFICATION", owner: "Daniel Clarke", opened: "2026-07-12", due: "2026-08-09", closed: "", description: "The appeal procedure describes independence but does not enforce independent assignment at runtime.", correctiveAction: "Deploy independent assignment control and submit three attributable test records.", verification: "Evidence submitted July 28; independence confirmation open." },
  { id: "find-103", institutionId: "inst-001", reviewId: "rev-771", standard: "AC-03", title: "One course version lacks preserved effective date", severity: "MINOR", state: "OPEN", owner: "Maya Chen", opened: "2026-07-24", due: "2026-08-06", closed: "", description: "A superseded course package contains approval evidence but no explicit effective date in the preserved record.", correctiveAction: "Attach the governing approval record and effective-date declaration without rewriting the historical artifact.", verification: "Not submitted." },
  { id: "find-104", institutionId: "inst-005", reviewId: "rev-774", standard: "AC-04", title: "Renewal sample contains expired assessor credentials", severity: "CRITICAL", state: "CORRECTIVE_ACTION", owner: "Priya Shah", opened: "2026-07-21", due: "2026-08-03", closed: "", description: "Two assessors performed credential-relevant activity after authorization expiration.", correctiveAction: "Suspend affected authority, identify impacted decisions, reassign review, and preserve revalidation evidence.", verification: "Authority suspension recorded; impact sample remains open." },
];

const initialCycles: Cycle[] = [
  { id: "cy-001", institutionId: "inst-003", type: "SURVEILLANCE", windowStart: "2026-11-04", windowEnd: "2026-11-20", state: "UPCOMING", owner: "S. Lind", requiredReturns: ["Annual institutional return", "Material change declaration", "Assessment sample", "Instructor currency roster"], completion: 18 },
  { id: "cy-002", institutionId: "inst-005", type: "RENEWAL", windowStart: "2026-07-21", windowEnd: "2026-09-02", state: "OPEN", owner: "J. Bell", requiredReturns: ["Renewal application", "Current authority register", "Faculty authorization sample", "Program correspondence declaration"], completion: 76 },
  { id: "cy-003", institutionId: "inst-002", type: "CORRECTIVE_ACTION", windowStart: "2026-07-10", windowEnd: "2026-08-28", state: "OPEN", owner: "M. Okafor", requiredReturns: ["Corrective action plan", "Implementation evidence", "Independent verification sample"], completion: 71 },
];

const initialAudit: AuditEvent[] = [
  { id: "audit-001", institutionId: "inst-005", at: "2026-07-30T09:42:00-04:00", actor: "J. Bell", action: "ESCALATED", objectType: "Review", objectId: "rev-774", detail: "Expired assessor authority may affect credential-relevant decisions." },
  { id: "audit-002", institutionId: "inst-002", at: "2026-07-29T16:18:00-04:00", actor: "M. Okafor", action: "EVIDENCE RECEIVED", objectType: "Finding", objectId: "find-102", detail: "Three appeal-assignment test records received for verification." },
  { id: "audit-003", institutionId: "inst-001", at: "2026-07-24T14:05:00-04:00", actor: "A. Rivera", action: "FINDING OPENED", objectType: "Finding", objectId: "find-103", detail: "Course version record lacks explicit effective date." },
  { id: "audit-004", institutionId: "inst-003", at: "2026-05-31T11:20:00-04:00", actor: "Accreditation Board", action: "ACCREDITED", objectType: "Institution", objectId: "inst-003", detail: "Accreditation granted through May 31, 2028." },
];

const initialState: PersistedState = {
  tab: "overview",
  query: "",
  institutionFilter: "ALL",
  evidenceFilter: "ALL",
  findingFilter: "ALL",
  selectedInstitutionId: initialInstitutions[0].id,
  selectedApplicationId: initialApplications[0].id,
  selectedStandardId: initialStandards[0].id,
  selectedInstructorId: initialInstructors[0].id,
  selectedEvidenceId: initialEvidence[0].id,
  selectedReviewId: initialReviews[0].id,
  selectedFindingId: initialFindings[0].id,
  selectedCycleId: initialCycles[0].id,
  institutions: initialInstitutions,
  applications: initialApplications,
  standards: initialStandards,
  instructors: initialInstructors,
  evidence: initialEvidence,
  reviews: initialReviews,
  findings: initialFindings,
  cycles: initialCycles,
  audit: initialAudit,
};

const tabs: { id: Tab; label: string; description: string }[] = [
  { id: "overview", label: "Command View", description: "Standing, risk, readiness, and upcoming work" },
  { id: "institutions", label: "Institutions", description: "Accreditation records and institutional scope" },
  { id: "applications", label: "Applications", description: "Completeness and eligibility workflow" },
  { id: "standards", label: "Standards", description: "Accreditation requirements and evidence questions" },
  { id: "instructors", label: "Instructors", description: "Qualification and authorization management" },
  { id: "evidence", label: "Evidence", description: "Attributable accreditation evidence repository" },
  { id: "reviews", label: "Reviews", description: "Panel assignments and determinations" },
  { id: "findings", label: "Findings", description: "Corrective action and closure verification" },
  { id: "cycles", label: "Cycles", description: "Surveillance, renewal, and special review windows" },
  { id: "governance", label: "Governance", description: "Authority, independence, conflicts, and controls" },
  { id: "matrix", label: "Evidence Matrix", description: "Standard-by-standard institutional sufficiency" },
  { id: "site-review", label: "Site Review", description: "Interview, observation, sampling, and visit controls" },
  { id: "panel", label: "Panel Room", description: "Deliberation, voting, recusals, and conditions" },
  { id: "decisions", label: "Decision Records", description: "Accreditation memoranda and binding boundaries" },
  { id: "surveillance", label: "Surveillance", description: "Material change and continuing-standing controls" },
  { id: "reports", label: "Reports", description: "Readiness, coverage, and audit exports" },
];

const accreditationTone: Record<AccreditationState, string> = {
  APPLICANT: "#8bb8ff",
  UNDER_REVIEW: "#f7c948",
  CONDITIONAL: "#fb923c",
  ACCREDITED: "#34d399",
  RENEWAL_DUE: "#c084fc",
  SUSPENDED: "#f87171",
  EXPIRED: "#94a3b8",
};

const determinationTone: Record<Determination, string> = {
  ALLOW: "#34d399",
  HOLD: "#f7c948",
  DENY: "#f87171",
  ESCALATE: "#c084fc",
};

const severityTone: Record<Severity, string> = {
  CRITICAL: "#f87171",
  MAJOR: "#fb923c",
  MINOR: "#f7c948",
  OBSERVATION: "#8bb8ff",
};

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function formatDate(value: string) {
  if (!value) return "Not set";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function daysUntil(value: string) {
  if (!value) return 9999;
  const start = new Date(`${TODAY}T12:00:00`).getTime();
  const end = new Date(`${value}T12:00:00`).getTime();
  return Math.ceil((end - start) / 86400000);
}

export default function AccreditationCenterPage() {
  const [state, setState] = useState<PersistedState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("Workspace ready");
  const [showNewInstitution, setShowNewInstitution] = useState(false);
  const [showNewFinding, setShowNewFinding] = useState(false);
  const [newInstitution, setNewInstitution] = useState({ name: "", jurisdiction: "United States", program: "Applied Route Reviewer", owner: "" });
  const [newFinding, setNewFinding] = useState({ title: "", institutionId: initialInstitutions[0].id, standard: "AC-01", severity: "MINOR" as Severity, owner: "", due: "2026-08-30" });
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        setState((previous) => ({ ...previous, ...parsed }));
      }
    } catch {
      setNotice("Stored workspace could not be read; sample data preserved");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  const selectedInstitution = state.institutions.find((item) => item.id === state.selectedInstitutionId) ?? state.institutions[0];
  const selectedApplication = state.applications.find((item) => item.id === state.selectedApplicationId) ?? state.applications[0];
  const selectedStandard = state.standards.find((item) => item.id === state.selectedStandardId) ?? state.standards[0];
  const selectedInstructor = state.instructors.find((item) => item.id === state.selectedInstructorId) ?? state.instructors[0];
  const selectedEvidence = state.evidence.find((item) => item.id === state.selectedEvidenceId) ?? state.evidence[0];
  const selectedReview = state.reviews.find((item) => item.id === state.selectedReviewId) ?? state.reviews[0];
  const selectedFinding = state.findings.find((item) => item.id === state.selectedFindingId) ?? state.findings[0];
  const selectedCycle = state.cycles.find((item) => item.id === state.selectedCycleId) ?? state.cycles[0];

  const q = state.query.trim().toLowerCase();
  const filteredInstitutions = useMemo(() => state.institutions.filter((item) => {
    const search = `${item.name} ${item.code} ${item.jurisdiction} ${item.program} ${item.leadReviewer}`.toLowerCase();
    return (!q || search.includes(q)) && (state.institutionFilter === "ALL" || item.state === state.institutionFilter);
  }), [state.institutions, state.institutionFilter, q]);

  const filteredEvidence = useMemo(() => state.evidence.filter((item) => {
    const institution = state.institutions.find((candidate) => candidate.id === item.institutionId);
    const standard = state.standards.find((candidate) => candidate.id === item.standardId);
    const search = `${item.title} ${item.type} ${item.source} ${item.owner} ${institution?.name ?? ""} ${standard?.code ?? ""}`.toLowerCase();
    return (!q || search.includes(q)) && (state.evidenceFilter === "ALL" || item.state === state.evidenceFilter);
  }), [state.evidence, state.evidenceFilter, state.institutions, state.standards, q]);

  const filteredFindings = useMemo(() => state.findings.filter((item) => {
    const institution = state.institutions.find((candidate) => candidate.id === item.institutionId);
    const search = `${item.title} ${item.standard} ${item.owner} ${institution?.name ?? ""}`.toLowerCase();
    return (!q || search.includes(q)) && (state.findingFilter === "ALL" || item.state === state.findingFilter);
  }), [state.findings, state.findingFilter, state.institutions, q]);

  const metrics = useMemo(() => {
    const accredited = state.institutions.filter((item) => item.state === "ACCREDITED").length;
    const activeReviews = state.reviews.filter((item) => item.state !== "COMPLETE" && item.state !== "PLANNED").length;
    const openFindings = state.findings.filter((item) => item.state !== "CLOSED").length;
    const critical = state.findings.filter((item) => item.severity === "CRITICAL" && item.state !== "CLOSED").length;
    const acceptedEvidence = state.evidence.filter((item) => item.state === "ACCEPTED").length;
    const evidenceRate = state.evidence.length ? Math.round((acceptedEvidence / state.evidence.length) * 100) : 0;
    const averageReadiness = state.institutions.length ? Math.round(state.institutions.reduce((sum, item) => sum + item.readiness, 0) / state.institutions.length) : 0;
    return { accredited, activeReviews, openFindings, critical, evidenceRate, averageReadiness };
  }, [state]);

  const upcomingDeadlines = useMemo(() => {
    const findings = state.findings.filter((item) => item.state !== "CLOSED").map((item) => ({ id: item.id, type: "Finding", title: item.title, due: item.due, institutionId: item.institutionId }));
    const reviews = state.reviews.filter((item) => item.state !== "COMPLETE").map((item) => ({ id: item.id, type: "Review", title: item.title, due: item.due, institutionId: item.institutionId }));
    return [...findings, ...reviews].sort((a, b) => daysUntil(a.due) - daysUntil(b.due)).slice(0, 7);
  }, [state.findings, state.reviews]);

  function update<K extends keyof PersistedState>(key: K, value: PersistedState[K]) {
    setState((previous) => ({ ...previous, [key]: value }));
  }

  function patchInstitution(patch: Partial<Institution>) {
    setState((previous) => ({ ...previous, institutions: previous.institutions.map((item) => item.id === selectedInstitution.id ? { ...item, ...patch } : item) }));
  }

  function patchApplication(patch: Partial<Application>) {
    setState((previous) => ({ ...previous, applications: previous.applications.map((item) => item.id === selectedApplication.id ? { ...item, ...patch } : item) }));
  }

  function patchStandard(patch: Partial<Standard>) {
    setState((previous) => ({ ...previous, standards: previous.standards.map((item) => item.id === selectedStandard.id ? { ...item, ...patch } : item) }));
  }

  function patchInstructor(patch: Partial<Instructor>) {
    setState((previous) => ({ ...previous, instructors: previous.instructors.map((item) => item.id === selectedInstructor.id ? { ...item, ...patch } : item) }));
  }

  function patchEvidence(patch: Partial<EvidenceItem>) {
    setState((previous) => ({ ...previous, evidence: previous.evidence.map((item) => item.id === selectedEvidence.id ? { ...item, ...patch } : item) }));
  }

  function patchReview(patch: Partial<Review>) {
    setState((previous) => ({ ...previous, reviews: previous.reviews.map((item) => item.id === selectedReview.id ? { ...item, ...patch } : item) }));
  }

  function patchFinding(patch: Partial<Finding>) {
    setState((previous) => ({ ...previous, findings: previous.findings.map((item) => item.id === selectedFinding.id ? { ...item, ...patch } : item) }));
  }

  function patchCycle(patch: Partial<Cycle>) {
    setState((previous) => ({ ...previous, cycles: previous.cycles.map((item) => item.id === selectedCycle.id ? { ...item, ...patch } : item) }));
  }

  function addAudit(institutionId: string, action: string, objectType: string, objectId: string, detail: string) {
    const event: AuditEvent = { id: uid("audit"), institutionId, at: new Date().toISOString(), actor: "Accreditation Workspace", action, objectType, objectId, detail };
    setState((previous) => ({ ...previous, audit: [event, ...previous.audit] }));
  }

  function createInstitution(event: FormEvent) {
    event.preventDefault();
    if (!newInstitution.name.trim()) return;
    const id = uid("inst");
    const record: Institution = {
      id,
      code: `TA14-ACC-${String(state.institutions.length + 1001)}`,
      name: newInstitution.name.trim(),
      jurisdiction: newInstitution.jurisdiction,
      program: newInstitution.program,
      state: "APPLICANT",
      determination: "HOLD",
      readiness: 10,
      evidenceComplete: 0,
      standardsMet: 0,
      standardsTotal: state.standards.filter((item) => item.state === "ACTIVE" && item.mandatory).length,
      leadReviewer: "Unassigned",
      accountableExecutive: newInstitution.owner || "Unassigned",
      nextMilestone: "Application submission",
      validThrough: "Pending",
      submittedAt: "",
      lastReviewAt: "Not reviewed",
      openFindings: 0,
      majorFindings: 0,
      scope: [newInstitution.program],
      notes: "New institutional accreditation record.",
    };
    setState((previous) => ({ ...previous, institutions: [...previous.institutions, record], selectedInstitutionId: id, tab: "institutions" }));
    setShowNewInstitution(false);
    setNewInstitution({ name: "", jurisdiction: "United States", program: "Applied Route Reviewer", owner: "" });
    addAudit(id, "INSTITUTION CREATED", "Institution", id, "New institutional accreditation record created.");
    setNotice("Institution created");
  }

  function createFinding(event: FormEvent) {
    event.preventDefault();
    if (!newFinding.title.trim()) return;
    const id = uid("find");
    const record: Finding = {
      id,
      institutionId: newFinding.institutionId,
      reviewId: state.reviews.find((item) => item.institutionId === newFinding.institutionId)?.id ?? "",
      standard: newFinding.standard,
      title: newFinding.title.trim(),
      severity: newFinding.severity,
      state: "OPEN",
      owner: newFinding.owner || "Unassigned",
      opened: TODAY,
      due: newFinding.due,
      closed: "",
      description: "New finding pending complete reviewer description.",
      correctiveAction: "Corrective action has not been submitted.",
      verification: "Not verified.",
    };
    setState((previous) => ({ ...previous, findings: [record, ...previous.findings], selectedFindingId: id, tab: "findings" }));
    setShowNewFinding(false);
    addAudit(newFinding.institutionId, "FINDING OPENED", "Finding", id, newFinding.title.trim());
    setNotice("Finding opened");
  }

  function exportWorkspace() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ta14-accreditation-center-${TODAY}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Workspace exported");
  }

  function exportReport() {
    const rows = [
      ["Institution", "Code", "Program", "State", "Determination", "Readiness", "Evidence", "Open Findings", "Valid Through"],
      ...state.institutions.map((item) => [item.name, item.code, item.program, item.state, item.determination, String(item.readiness), String(item.evidenceComplete), String(item.openFindings), item.validThrough]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ta14-accreditation-register-${TODAY}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Accreditation register exported");
  }

  function importWorkspace(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as PersistedState;
        setState({ ...initialState, ...parsed });
        setNotice("Workspace imported");
      } catch {
        setNotice("Import failed: invalid workspace JSON");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function resetWorkspace() {
    if (!window.confirm("Reset the Accreditation Center to its sample production workspace?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
    setNotice("Sample workspace restored");
  }

  return (
    <main className="page-shell">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="grid-overlay" />

      <header className="hero">
        <div>
          <Link href="/academy" className="eyebrow">TA-14 Academy · Institutional Assurance</Link>
          <h1>Accreditation Center</h1>
          <p className="hero-copy">Govern institutional standing from application through renewal. Preserve authority, evidence, review, findings, corrective action, and accreditation determinations as one challengeable record.</p>
          <div className="principle-row">
            <span>Reality</span><i>→</i><span>Record</span><i>→</i><span>Continuity</span><i>→</i><span>Admissibility</span><i>→</i><span>Standing</span>
          </div>
        </div>
        <div className="hero-actions">
          <button className="secondary" onClick={() => importRef.current?.click()}>Import JSON</button>
          <button className="secondary" onClick={exportWorkspace}>Export JSON</button>
          <button className="secondary" onClick={exportReport}>Export register</button>
          <button className="primary" onClick={() => setShowNewInstitution(true)}>New institution</button>
          <input ref={importRef} type="file" accept="application/json,.json" onChange={importWorkspace} hidden />
        </div>
      </header>

      <section className="governance-banner">
        <div className="banner-mark">24</div>
        <div>
          <strong>Accreditation is governed standing—not a decorative badge.</strong>
          <p>No institution may bind the Academy to a claim of quality, competence, or authorization unless the evidence, authority, continuity, scope, and review conditions remain admissible for that exact claim.</p>
        </div>
        <StatusPill label={notice} tone="#8bb8ff" />
      </section>

      <section className="metrics six">
        <Metric label="Accredited" value={metrics.accredited} note={`${state.institutions.length} institutions in register`} />
        <Metric label="Active reviews" value={metrics.activeReviews} note="Substantive work currently open" />
        <Metric label="Open findings" value={metrics.openFindings} note={`${metrics.critical} critical finding${metrics.critical === 1 ? "" : "s"}`} />
        <Metric label="Evidence acceptance" value={`${metrics.evidenceRate}%`} note="Accepted repository items" />
        <Metric label="Average readiness" value={`${metrics.averageReadiness}%`} note="Across registered institutions" />
        <Metric label="Standards" value={state.standards.filter((item) => item.state === "ACTIVE").length} note="Active institutional requirements" />
      </section>

      <section className="workspace-tools">
        <div className="search-wrap">
          <span>⌕</span>
          <input value={state.query} onChange={(event) => update("query", event.target.value)} placeholder="Search institutions, evidence, reviewers, findings, standards…" />
        </div>
        <div className="local-state"><span className={`pulse ${loaded ? "ready" : ""}`} />{loaded ? "Local persistence active" : "Loading workspace"}</div>
      </section>

      <nav className="tabs" aria-label="Accreditation Center sections">
        {tabs.map((tab) => (
          <button key={tab.id} className={state.tab === tab.id ? "active" : ""} onClick={() => update("tab", tab.id)} title={tab.description}>
            <span>{tab.label}</span><small>{tab.description}</small>
          </button>
        ))}
      </nav>

      {state.tab === "overview" && (
        <>
          <section className="dashboard-grid">
            <article className="panel span-two">
              <PanelTitle title="Institutional standing" subtitle="Current readiness, evidence, determination, and unresolved conditions" action={<button className="text-button" onClick={() => update("tab", "institutions")}>Open register →</button>} />
              <div className="institution-cards">
                {state.institutions.map((institution) => (
                  <button key={institution.id} className="institution-card" onClick={() => { update("selectedInstitutionId", institution.id); update("tab", "institutions"); }}>
                    <div className="institution-head"><div><strong>{institution.name}</strong><span>{institution.code} · {institution.jurisdiction}</span></div><StatusPill label={institution.state} tone={accreditationTone[institution.state]} /></div>
                    <div className="dual-progress"><Progress label="Readiness" value={institution.readiness} /><Progress label="Evidence" value={institution.evidenceComplete} /></div>
                    <div className="institution-foot"><StatusPill label={institution.determination} tone={determinationTone[institution.determination]} /><span>{institution.nextMilestone}</span></div>
                  </button>
                ))}
              </div>
            </article>

            <article className="panel">
              <PanelTitle title="Decision posture" subtitle="Current admissibility determinations" />
              <div className="donut" style={{ "--score": `${metrics.averageReadiness * 3.6}deg` } as CSSProperties}><div><strong>{metrics.averageReadiness}%</strong><span>portfolio readiness</span></div></div>
              <div className="posture-list">
                {(["ALLOW", "HOLD", "DENY", "ESCALATE"] as Determination[]).map((determination) => (
                  <div key={determination}><StatusPill label={determination} tone={determinationTone[determination]} /><strong>{state.institutions.filter((item) => item.determination === determination).length}</strong></div>
                ))}
              </div>
              <div className="decision-note"><strong>No silent approval.</strong><p>Unresolved authority, expired evidence, material change, open critical findings, or incomplete continuity must remain visible as HOLD, DENY, or ESCALATE.</p></div>
            </article>
          </section>

          <section className="dashboard-grid">
            <article className="panel">
              <PanelTitle title="Upcoming deadlines" subtitle="Nearest review and corrective-action commitments" />
              <div className="deadline-list">
                {upcomingDeadlines.map((item) => {
                  const institution = state.institutions.find((candidate) => candidate.id === item.institutionId);
                  const days = daysUntil(item.due);
                  return <div className="deadline" key={`${item.type}-${item.id}`}><div><span className="type-label">{item.type}</span><strong>{item.title}</strong><small>{institution?.name}</small></div><div className={days <= 7 ? "due urgent" : "due"}><strong>{days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}</strong><span>{formatDate(item.due)}</span></div></div>;
                })}
              </div>
            </article>

            <article className="panel">
              <PanelTitle title="Evidence health" subtitle="Repository admissibility by status" action={<button className="text-button" onClick={() => update("tab", "evidence")}>Open repository →</button>} />
              <div className="status-bars">
                {(["ACCEPTED", "UNDER_REVIEW", "UNVERIFIED", "REJECTED", "EXPIRED"] as EvidenceState[]).map((evidenceState) => {
                  const count = state.evidence.filter((item) => item.state === evidenceState).length;
                  const percent = state.evidence.length ? Math.round((count / state.evidence.length) * 100) : 0;
                  return <div key={evidenceState}><div className="bar-label"><span>{evidenceState.replaceAll("_", " ")}</span><strong>{count}</strong></div><div className="bar-track"><div className="bar-fill" style={{ width: `${percent}%` }} /></div></div>;
                })}
              </div>
            </article>

            <article className="panel">
              <PanelTitle title="Recent audit activity" subtitle="Preserved institutional actions and determinations" action={<button className="text-button" onClick={() => update("tab", "reports")}>Full audit →</button>} />
              <div className="audit-list compact">
                {state.audit.slice(0, 5).map((event) => <AuditRow key={event.id} event={event} institution={state.institutions.find((item) => item.id === event.institutionId)} />)}
              </div>
            </article>
          </section>
        </>
      )}

      {state.tab === "institutions" && (
        <section className="split-layout">
          <article className="panel list-panel">
            <PanelTitle title="Institution register" subtitle="Search and select an institutional accreditation record" action={<button className="text-button" onClick={() => setShowNewInstitution(true)}>+ Add institution</button>} />
            <div className="filter-row"><select value={state.institutionFilter} onChange={(event) => update("institutionFilter", event.target.value as PersistedState["institutionFilter"])}><option value="ALL">All standing</option>{Object.keys(accreditationTone).map((value) => <option key={value}>{value}</option>)}</select><span>{filteredInstitutions.length} records</span></div>
            <div className="select-list">
              {filteredInstitutions.map((institution) => <button key={institution.id} className={institution.id === selectedInstitution.id ? "select-row selected" : "select-row"} onClick={() => update("selectedInstitutionId", institution.id)}><div><strong>{institution.name}</strong><span>{institution.code} · {institution.program}</span></div><div className="row-status"><StatusPill label={institution.state} tone={accreditationTone[institution.state]} /><small>{institution.readiness}% ready</small></div></button>)}
            </div>
          </article>

          <article className="panel detail-panel">
            <div className="detail-heading"><div><span className="record-code">{selectedInstitution.code}</span><h2>{selectedInstitution.name}</h2><p>{selectedInstitution.jurisdiction} · {selectedInstitution.program}</p></div><div className="heading-pills"><StatusPill label={selectedInstitution.state} tone={accreditationTone[selectedInstitution.state]} /><StatusPill label={selectedInstitution.determination} tone={determinationTone[selectedInstitution.determination]} /></div></div>
            <div className="score-grid"><ScoreCard label="Institutional readiness" value={selectedInstitution.readiness} /><ScoreCard label="Evidence completeness" value={selectedInstitution.evidenceComplete} /><ScoreCard label="Standards met" value={Math.round((selectedInstitution.standardsMet / selectedInstitution.standardsTotal) * 100)} /></div>
            <div className="form-grid two">
              <Field label="Accreditation state"><select value={selectedInstitution.state} onChange={(event) => patchInstitution({ state: event.target.value as AccreditationState })}>{Object.keys(accreditationTone).map((value) => <option key={value}>{value}</option>)}</select></Field>
              <Field label="Determination"><select value={selectedInstitution.determination} onChange={(event) => patchInstitution({ determination: event.target.value as Determination })}>{Object.keys(determinationTone).map((value) => <option key={value}>{value}</option>)}</select></Field>
              <Field label="Lead reviewer"><input value={selectedInstitution.leadReviewer} onChange={(event) => patchInstitution({ leadReviewer: event.target.value })} /></Field>
              <Field label="Accountable executive"><input value={selectedInstitution.accountableExecutive} onChange={(event) => patchInstitution({ accountableExecutive: event.target.value })} /></Field>
              <Field label="Readiness score"><input type="number" min="0" max="100" value={selectedInstitution.readiness} onChange={(event) => patchInstitution({ readiness: clamp(Number(event.target.value)) })} /></Field>
              <Field label="Evidence completeness"><input type="number" min="0" max="100" value={selectedInstitution.evidenceComplete} onChange={(event) => patchInstitution({ evidenceComplete: clamp(Number(event.target.value)) })} /></Field>
              <Field label="Next milestone"><input value={selectedInstitution.nextMilestone} onChange={(event) => patchInstitution({ nextMilestone: event.target.value })} /></Field>
              <Field label="Valid through"><input value={selectedInstitution.validThrough} onChange={(event) => patchInstitution({ validThrough: event.target.value })} /></Field>
            </div>
            <Field label="Approved scope"><textarea rows={3} value={selectedInstitution.scope.join("\n")} onChange={(event) => patchInstitution({ scope: event.target.value.split("\n").filter(Boolean) })} /></Field>
            <Field label="Institution notes"><textarea rows={5} value={selectedInstitution.notes} onChange={(event) => patchInstitution({ notes: event.target.value })} /></Field>
            <div className="action-strip"><button onClick={() => { patchInstitution({ determination: "ALLOW", state: "ACCREDITED" }); addAudit(selectedInstitution.id, "ACCREDITATION ALLOWED", "Institution", selectedInstitution.id, "Institutional standing changed to accredited."); setNotice("Accreditation allowed"); }}>Allow standing</button><button onClick={() => { patchInstitution({ determination: "HOLD" }); addAudit(selectedInstitution.id, "STANDING HELD", "Institution", selectedInstitution.id, "Institutional standing placed on hold."); setNotice("Standing held"); }}>Place hold</button><button className="danger" onClick={() => { patchInstitution({ determination: "ESCALATE" }); addAudit(selectedInstitution.id, "STANDING ESCALATED", "Institution", selectedInstitution.id, "Institutional standing escalated for board review."); setNotice("Standing escalated"); }}>Escalate</button></div>
          </article>
        </section>
      )}

      {state.tab === "applications" && (
        <section className="split-layout">
          <article className="panel list-panel"><PanelTitle title="Application queue" subtitle="Completeness and institutional eligibility before substantive review" /><div className="select-list">{state.applications.map((application) => { const institution = state.institutions.find((item) => item.id === application.institutionId); return <button key={application.id} className={application.id === selectedApplication.id ? "select-row selected" : "select-row"} onClick={() => update("selectedApplicationId", application.id)}><div><strong>{institution?.name}</strong><span>{application.program} · {application.state.replaceAll("_", " ")}</span></div><div className="row-status"><strong>{application.completeness}%</strong><small>complete</small></div></button>; })}</div></article>
          <article className="panel detail-panel"><div className="detail-heading"><div><span className="record-code">{selectedApplication.id}</span><h2>{state.institutions.find((item) => item.id === selectedApplication.institutionId)?.name}</h2><p>{selectedApplication.program}</p></div><StatusPill label={selectedApplication.state} tone="#8bb8ff" /></div><ScoreCard label="Application completeness" value={selectedApplication.completeness} /><div className="check-grid">{(["legalAuthority", "programArchitecture", "facultyRoster", "evidencePlan", "learnerProtection"] as const).map((key) => <label key={key} className="check-card"><input type="checkbox" checked={selectedApplication[key]} onChange={(event) => patchApplication({ [key]: event.target.checked })} /><span>{key.replace(/([A-Z])/g, " $1")}</span><small>{selectedApplication[key] ? "Present" : "Missing"}</small></label>)}</div><div className="form-grid two"><Field label="Application state"><select value={selectedApplication.state} onChange={(event) => patchApplication({ state: event.target.value as ApplicationState })}>{["DRAFT", "SUBMITTED", "COMPLETENESS_REVIEW", "ELIGIBLE", "RETURNED"].map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="Completeness score"><input type="number" min="0" max="100" value={selectedApplication.completeness} onChange={(event) => patchApplication({ completeness: clamp(Number(event.target.value)) })} /></Field><Field label="Owner"><input value={selectedApplication.owner} onChange={(event) => patchApplication({ owner: event.target.value })} /></Field><Field label="Submitted"><input type="date" value={selectedApplication.submittedAt} onChange={(event) => patchApplication({ submittedAt: event.target.value })} /></Field></div><Field label="Application review notes"><textarea rows={7} value={selectedApplication.notes} onChange={(event) => patchApplication({ notes: event.target.value })} /></Field><div className="decision-note"><strong>Eligibility boundary</strong><p>Completeness does not prove accreditation. It only establishes whether the application contains enough admissible material to enter substantive review.</p></div></article>
        </section>
      )}

      {state.tab === "standards" && (
        <section className="split-layout">
          <article className="panel list-panel"><PanelTitle title="Accreditation standards" subtitle="Active requirements, controlled versions, and evidentiary burden" /><div className="select-list">{state.standards.map((standard) => <button key={standard.id} className={standard.id === selectedStandard.id ? "select-row selected" : "select-row"} onClick={() => update("selectedStandardId", standard.id)}><div><strong><span className="code-chip">{standard.code}</span>{standard.title}</strong><span>{standard.category} · v{standard.version}</span></div><div className="row-status"><StatusPill label={standard.state} tone={standard.state === "ACTIVE" ? "#34d399" : "#8bb8ff"} /><small>Weight {standard.weight}</small></div></button>)}</div></article>
          <article className="panel detail-panel"><div className="detail-heading"><div><span className="record-code">{selectedStandard.code}</span><h2>{selectedStandard.title}</h2><p>{selectedStandard.category} accreditation requirement</p></div><StatusPill label={selectedStandard.mandatory ? "MANDATORY" : "GUIDANCE"} tone={selectedStandard.mandatory ? "#34d399" : "#8bb8ff"} /></div><Field label="Governing principle"><textarea rows={5} value={selectedStandard.principle} onChange={(event) => patchStandard({ principle: event.target.value })} /></Field><div className="form-grid three"><Field label="Version"><input value={selectedStandard.version} onChange={(event) => patchStandard({ version: event.target.value })} /></Field><Field label="Effective date"><input type="date" value={selectedStandard.effectiveDate} onChange={(event) => patchStandard({ effectiveDate: event.target.value })} /></Field><Field label="Weight"><input type="number" min="0" max="100" value={selectedStandard.weight} onChange={(event) => patchStandard({ weight: Number(event.target.value) })} /></Field></div><div className="evidence-question-grid"><div><h3>Expected evidence</h3>{selectedStandard.evidence.map((item, index) => <div className="requirement" key={`${item}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div><div><h3>Governing questions</h3>{selectedStandard.questions.map((item, index) => <div className="requirement question" key={`${item}-${index}`}><span>?</span><p>{item}</p></div>)}</div></div></article>
        </section>
      )}

      {state.tab === "instructors" && (
        <section className="split-layout">
          <article className="panel list-panel"><PanelTitle title="Instructor authorization" subtitle="Qualification, observed capability, currency, and role-specific authority" /><div className="select-list">{state.instructors.filter((instructor) => !q || `${instructor.name} ${instructor.role} ${instructor.programs.join(" ")}`.toLowerCase().includes(q)).map((instructor) => <button key={instructor.id} className={instructor.id === selectedInstructor.id ? "select-row selected" : "select-row"} onClick={() => update("selectedInstructorId", instructor.id)}><div><strong>{instructor.name}</strong><span>{instructor.role} · {state.institutions.find((item) => item.id === instructor.institutionId)?.name}</span></div><div className="row-status"><StatusPill label={instructor.state} tone={instructor.state === "AUTHORIZED" ? "#34d399" : instructor.state === "EXPIRED" || instructor.state === "SUSPENDED" ? "#f87171" : "#f7c948"} /><small>{instructor.qualificationScore}%</small></div></button>)}</div></article>
          <article className="panel detail-panel"><div className="detail-heading"><div><span className="record-code">{selectedInstructor.id}</span><h2>{selectedInstructor.name}</h2><p>{selectedInstructor.role} · {selectedInstructor.email}</p></div><StatusPill label={selectedInstructor.state} tone={selectedInstructor.state === "AUTHORIZED" ? "#34d399" : "#f7c948"} /></div><div className="score-grid"><ScoreCard label="Qualification" value={selectedInstructor.qualificationScore} /><ScoreCard label="Continuing education" value={Math.min(100, selectedInstructor.continuingEducationHours * 3)} /><ScoreCard label="Authorization currency" value={daysUntil(selectedInstructor.expiresAt) > 0 ? Math.min(100, Math.round(daysUntil(selectedInstructor.expiresAt) / 3.65)) : 0} /></div><div className="form-grid two"><Field label="Authorization state"><select value={selectedInstructor.state} onChange={(event) => patchInstructor({ state: event.target.value as InstructorState })}>{["PROPOSED", "AUTHORIZED", "CONDITIONAL", "SUSPENDED", "EXPIRED"].map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="Qualification score"><input type="number" min="0" max="100" value={selectedInstructor.qualificationScore} onChange={(event) => patchInstructor({ qualificationScore: clamp(Number(event.target.value)) })} /></Field><Field label="Observed teaching"><input type="date" value={selectedInstructor.observedTeaching} onChange={(event) => patchInstructor({ observedTeaching: event.target.value })} /></Field><Field label="Authorization expires"><input type="date" value={selectedInstructor.expiresAt} onChange={(event) => patchInstructor({ expiresAt: event.target.value })} /></Field><Field label="Continuing education hours"><input type="number" min="0" value={selectedInstructor.continuingEducationHours} onChange={(event) => patchInstructor({ continuingEducationHours: Number(event.target.value) })} /></Field><label className="toggle-field"><input type="checkbox" checked={selectedInstructor.conflictsDeclared} onChange={(event) => patchInstructor({ conflictsDeclared: event.target.checked })} /><span>Conflict declaration current</span></label></div><Field label="Authorized programs"><textarea rows={3} value={selectedInstructor.programs.join("\n")} onChange={(event) => patchInstructor({ programs: event.target.value.split("\n").filter(Boolean) })} /></Field><Field label="Qualification notes"><textarea rows={5} value={selectedInstructor.notes} onChange={(event) => patchInstructor({ notes: event.target.value })} /></Field></article>
        </section>
      )}

      {state.tab === "evidence" && (
        <section className="split-layout">
          <article className="panel list-panel"><PanelTitle title="Evidence repository" subtitle="Attributable records supporting accreditation claims" /><div className="filter-row"><select value={state.evidenceFilter} onChange={(event) => update("evidenceFilter", event.target.value as PersistedState["evidenceFilter"])}><option value="ALL">All evidence states</option>{["UNVERIFIED", "UNDER_REVIEW", "ACCEPTED", "REJECTED", "EXPIRED"].map((value) => <option key={value}>{value}</option>)}</select><span>{filteredEvidence.length} items</span></div><div className="select-list">{filteredEvidence.map((evidence) => <button key={evidence.id} className={evidence.id === selectedEvidence.id ? "select-row selected" : "select-row"} onClick={() => update("selectedEvidenceId", evidence.id)}><div><strong>{evidence.title}</strong><span>{state.standards.find((item) => item.id === evidence.standardId)?.code} · {state.institutions.find((item) => item.id === evidence.institutionId)?.name}</span></div><div className="row-status"><StatusPill label={evidence.state} tone={evidence.state === "ACCEPTED" ? "#34d399" : evidence.state === "REJECTED" || evidence.state === "EXPIRED" ? "#f87171" : "#f7c948"} /><small>{evidence.confidence}% confidence</small></div></button>)}</div></article>
          <article className="panel detail-panel"><div className="detail-heading"><div><span className="record-code">{selectedEvidence.id}</span><h2>{selectedEvidence.title}</h2><p>{selectedEvidence.type} · {selectedEvidence.source}</p></div><StatusPill label={selectedEvidence.state} tone={selectedEvidence.state === "ACCEPTED" ? "#34d399" : "#f7c948"} /></div><div className="metadata-grid"><Metadata label="Institution" value={state.institutions.find((item) => item.id === selectedEvidence.institutionId)?.name ?? "Unknown"} /><Metadata label="Standard" value={state.standards.find((item) => item.id === selectedEvidence.standardId)?.code ?? "Unknown"} /><Metadata label="Owner" value={selectedEvidence.owner} /><Metadata label="Hash" value={selectedEvidence.hash} /></div><div className="form-grid two"><Field label="Evidence state"><select value={selectedEvidence.state} onChange={(event) => patchEvidence({ state: event.target.value as EvidenceState })}>{["UNVERIFIED", "UNDER_REVIEW", "ACCEPTED", "REJECTED", "EXPIRED"].map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="Confidence"><input type="number" min="0" max="100" value={selectedEvidence.confidence} onChange={(event) => patchEvidence({ confidence: clamp(Number(event.target.value)) })} /></Field><Field label="Observed at"><input type="date" value={selectedEvidence.observedAt} onChange={(event) => patchEvidence({ observedAt: event.target.value })} /></Field><Field label="Expires at"><input type="date" value={selectedEvidence.expiresAt} onChange={(event) => patchEvidence({ expiresAt: event.target.value })} /></Field></div><Field label="Evidence notes"><textarea rows={7} value={selectedEvidence.notes} onChange={(event) => patchEvidence({ notes: event.target.value })} /></Field><div className="decision-note"><strong>Evidence boundary</strong><p>Acceptance means this artifact is admissible for its stated purpose and scope. It does not automatically prove every institutional claim associated with it.</p></div></article>
        </section>
      )}

      {state.tab === "reviews" && (
        <section className="split-layout">
          <article className="panel list-panel"><PanelTitle title="Review workspace" subtitle="Panel assignment, evidence verification, and accreditation determination" /><div className="select-list">{state.reviews.map((review) => <button key={review.id} className={review.id === selectedReview.id ? "select-row selected" : "select-row"} onClick={() => update("selectedReviewId", review.id)}><div><strong>{review.title}</strong><span>{state.institutions.find((item) => item.id === review.institutionId)?.name} · {review.cycle.replaceAll("_", " ")}</span></div><div className="row-status"><StatusPill label={review.state} tone="#8bb8ff" /><small>{review.verifiedItems}/{review.evidenceItems} verified</small></div></button>)}</div></article>
          <article className="panel detail-panel"><div className="detail-heading"><div><span className="record-code">{selectedReview.id}</span><h2>{selectedReview.title}</h2><p>{state.institutions.find((item) => item.id === selectedReview.institutionId)?.name}</p></div><StatusPill label={selectedReview.determination} tone={determinationTone[selectedReview.determination]} /></div><Progress label="Evidence verification" value={selectedReview.evidenceItems ? Math.round((selectedReview.verifiedItems / selectedReview.evidenceItems) * 100) : 0} /><div className="form-grid two"><Field label="Review state"><select value={selectedReview.state} onChange={(event) => patchReview({ state: event.target.value as ReviewState })}>{["PLANNED", "EVIDENCE_OPEN", "PANEL_REVIEW", "DECISION_PENDING", "COMPLETE"].map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="Determination"><select value={selectedReview.determination} onChange={(event) => patchReview({ determination: event.target.value as Determination })}>{["ALLOW", "HOLD", "DENY", "ESCALATE"].map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="Due date"><input type="date" value={selectedReview.due} onChange={(event) => patchReview({ due: event.target.value })} /></Field><Field label="Verified evidence"><input type="number" min="0" max={selectedReview.evidenceItems} value={selectedReview.verifiedItems} onChange={(event) => patchReview({ verifiedItems: Number(event.target.value) })} /></Field></div><Field label="Review panel"><textarea rows={4} value={selectedReview.panel.join("\n")} onChange={(event) => patchReview({ panel: event.target.value.split("\n").filter(Boolean) })} /></Field><Field label="Panel summary"><textarea rows={7} value={selectedReview.summary} onChange={(event) => patchReview({ summary: event.target.value })} /></Field></article>
        </section>
      )}

      {state.tab === "findings" && (
        <section className="split-layout">
          <article className="panel list-panel"><PanelTitle title="Findings and corrective action" subtitle="Deficiency, ownership, due date, action, and independent closure" action={<button className="text-button" onClick={() => setShowNewFinding(true)}>+ Open finding</button>} /><div className="filter-row"><select value={state.findingFilter} onChange={(event) => update("findingFilter", event.target.value as PersistedState["findingFilter"])}><option value="ALL">All finding states</option>{["OPEN", "CORRECTIVE_ACTION", "VERIFICATION", "CLOSED", "OVERDUE"].map((value) => <option key={value}>{value}</option>)}</select><span>{filteredFindings.length} findings</span></div><div className="select-list">{filteredFindings.map((finding) => <button key={finding.id} className={finding.id === selectedFinding.id ? "select-row selected" : "select-row"} onClick={() => update("selectedFindingId", finding.id)}><div><strong><span className="code-chip">{finding.standard}</span>{finding.title}</strong><span>{state.institutions.find((item) => item.id === finding.institutionId)?.name} · due {formatDate(finding.due)}</span></div><div className="row-status"><StatusPill label={finding.severity} tone={severityTone[finding.severity]} /><small>{finding.state.replaceAll("_", " ")}</small></div></button>)}</div></article>
          <article className="panel detail-panel"><div className="detail-heading"><div><span className="record-code">{selectedFinding.id}</span><h2>{selectedFinding.title}</h2><p>{selectedFinding.standard} · {state.institutions.find((item) => item.id === selectedFinding.institutionId)?.name}</p></div><div className="heading-pills"><StatusPill label={selectedFinding.severity} tone={severityTone[selectedFinding.severity]} /><StatusPill label={selectedFinding.state} tone="#8bb8ff" /></div></div><div className="form-grid three"><Field label="Finding state"><select value={selectedFinding.state} onChange={(event) => patchFinding({ state: event.target.value as FindingState })}>{["OPEN", "CORRECTIVE_ACTION", "VERIFICATION", "CLOSED", "OVERDUE"].map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="Severity"><select value={selectedFinding.severity} onChange={(event) => patchFinding({ severity: event.target.value as Severity })}>{["CRITICAL", "MAJOR", "MINOR", "OBSERVATION"].map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="Due date"><input type="date" value={selectedFinding.due} onChange={(event) => patchFinding({ due: event.target.value })} /></Field></div><Field label="Finding description"><textarea rows={5} value={selectedFinding.description} onChange={(event) => patchFinding({ description: event.target.value })} /></Field><Field label="Corrective action"><textarea rows={6} value={selectedFinding.correctiveAction} onChange={(event) => patchFinding({ correctiveAction: event.target.value })} /></Field><Field label="Verification record"><textarea rows={5} value={selectedFinding.verification} onChange={(event) => patchFinding({ verification: event.target.value })} /></Field><div className="decision-note"><strong>Closure condition</strong><p>A finding is not closed because an action was promised. Closure requires admissible evidence that the action occurred, the deficiency was corrected, and an authorized independent reviewer verified the result.</p></div></article>
        </section>
      )}

      {state.tab === "cycles" && (
        <section className="split-layout">
          <article className="panel list-panel"><PanelTitle title="Accreditation cycles" subtitle="Initial, surveillance, renewal, special, and corrective-action windows" /><div className="select-list">{state.cycles.map((cycle) => <button key={cycle.id} className={cycle.id === selectedCycle.id ? "select-row selected" : "select-row"} onClick={() => update("selectedCycleId", cycle.id)}><div><strong>{cycle.type.replaceAll("_", " ")}</strong><span>{state.institutions.find((item) => item.id === cycle.institutionId)?.name} · {formatDate(cycle.windowStart)}–{formatDate(cycle.windowEnd)}</span></div><div className="row-status"><StatusPill label={cycle.state} tone={cycle.state === "COMPLETE" ? "#34d399" : cycle.state === "OVERDUE" ? "#f87171" : "#8bb8ff"} /><small>{cycle.completion}%</small></div></button>)}</div></article>
          <article className="panel detail-panel"><div className="detail-heading"><div><span className="record-code">{selectedCycle.id}</span><h2>{selectedCycle.type.replaceAll("_", " ")} cycle</h2><p>{state.institutions.find((item) => item.id === selectedCycle.institutionId)?.name}</p></div><StatusPill label={selectedCycle.state} tone="#8bb8ff" /></div><Progress label="Cycle completion" value={selectedCycle.completion} /><div className="form-grid two"><Field label="Cycle state"><select value={selectedCycle.state} onChange={(event) => patchCycle({ state: event.target.value as Cycle["state"] })}>{["UPCOMING", "OPEN", "COMPLETE", "OVERDUE"].map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="Owner"><input value={selectedCycle.owner} onChange={(event) => patchCycle({ owner: event.target.value })} /></Field><Field label="Window start"><input type="date" value={selectedCycle.windowStart} onChange={(event) => patchCycle({ windowStart: event.target.value })} /></Field><Field label="Window end"><input type="date" value={selectedCycle.windowEnd} onChange={(event) => patchCycle({ windowEnd: event.target.value })} /></Field></div><h3 className="section-label">Required returns</h3><div className="requirements-stack">{selectedCycle.requiredReturns.map((item, index) => <div className="requirement" key={`${item}-${index}`}><span>{index + 1}</span><p>{item}</p></div>)}</div><Field label="Completion"><input type="range" min="0" max="100" value={selectedCycle.completion} onChange={(event) => patchCycle({ completion: Number(event.target.value) })} /></Field></article>
        </section>
      )}


      {state.tab === "governance" && (
        <AccreditationGovernanceView
          institution={selectedInstitution}
          standards={state.standards}
          reviews={state.reviews}
          findings={state.findings}
          evidence={state.evidence}
        />
      )}

      {state.tab === "matrix" && (
        <AccreditationMatrixView
          institution={selectedInstitution}
          standards={state.standards}
          evidence={state.evidence}
          findings={state.findings}
          onSelectStandard={(id) => {
            update("selectedStandardId", id);
            update("tab", "standards");
          }}
        />
      )}

      {state.tab === "site-review" && (
        <SiteReviewView
          institution={selectedInstitution}
          review={selectedReview}
          standards={state.standards}
          evidence={state.evidence}
        />
      )}

      {state.tab === "panel" && (
        <PanelRoomView
          institution={selectedInstitution}
          review={selectedReview}
          findings={state.findings.filter((item) => item.institutionId === selectedInstitution.id)}
          evidence={state.evidence.filter((item) => item.institutionId === selectedInstitution.id)}
        />
      )}

      {state.tab === "decisions" && (
        <DecisionRecordView
          institution={selectedInstitution}
          review={selectedReview}
          standards={state.standards}
          findings={state.findings.filter((item) => item.institutionId === selectedInstitution.id)}
          evidence={state.evidence.filter((item) => item.institutionId === selectedInstitution.id)}
        />
      )}

      {state.tab === "surveillance" && (
        <SurveillanceView
          institution={selectedInstitution}
          cycles={state.cycles.filter((item) => item.institutionId === selectedInstitution.id)}
          instructors={state.instructors.filter((item) => item.institutionId === selectedInstitution.id)}
          evidence={state.evidence.filter((item) => item.institutionId === selectedInstitution.id)}
          findings={state.findings.filter((item) => item.institutionId === selectedInstitution.id)}
        />
      )}

      {state.tab === "reports" && (
        <>
          <section className="dashboard-grid reports">
            <article className="panel span-two"><PanelTitle title="Institutional readiness register" subtitle="Exportable board and accreditation management view" action={<button className="text-button" onClick={exportReport}>Download CSV</button>} /><div className="table-wrap"><table><thead><tr><th>Institution</th><th>State</th><th>Decision</th><th>Readiness</th><th>Evidence</th><th>Findings</th><th>Valid through</th></tr></thead><tbody>{state.institutions.map((institution) => <tr key={institution.id}><td><strong>{institution.name}</strong><small>{institution.code}</small></td><td><StatusPill label={institution.state} tone={accreditationTone[institution.state]} /></td><td><StatusPill label={institution.determination} tone={determinationTone[institution.determination]} /></td><td>{institution.readiness}%</td><td>{institution.evidenceComplete}%</td><td>{institution.openFindings}</td><td>{institution.validThrough}</td></tr>)}</tbody></table></div></article>
            <article className="panel"><PanelTitle title="Coverage profile" subtitle="Standard coverage across the portfolio" /><div className="coverage-list">{state.standards.map((standard) => { const evidenceCount = state.evidence.filter((item) => item.standardId === standard.id && item.state === "ACCEPTED").length; const coverage = clamp(evidenceCount * 25); return <div key={standard.id}><div><span>{standard.code}</span><strong>{standard.title}</strong><small>{evidenceCount} accepted artifacts</small></div><div className="mini-score">{coverage}%</div></div>; })}</div></article>
          </section>
          <section className="panel audit-panel"><PanelTitle title="Audit timeline" subtitle="Attributable actions, object references, and preserved detail" /><div className="audit-list">{state.audit.map((event) => <AuditRow key={event.id} event={event} institution={state.institutions.find((item) => item.id === event.institutionId)} />)}</div></section>
        </>
      )}

      <footer><div><strong>No admissible evidence. No admissible execution.</strong><span>Accreditation Center · local workspace · {loaded ? "preserved" : "loading"}</span></div><div><Link href="/academy">Academy</Link><Link href="/academy/certification-engine">Certification Engine</Link><button onClick={resetWorkspace}>Reset workspace</button></div></footer>

      {showNewInstitution && <Modal title="Create institutional record" onClose={() => setShowNewInstitution(false)}><form onSubmit={createInstitution} className="modal-form"><Field label="Institution name"><input autoFocus value={newInstitution.name} onChange={(event) => setNewInstitution((previous) => ({ ...previous, name: event.target.value }))} /></Field><div className="form-grid two"><Field label="Jurisdiction"><input value={newInstitution.jurisdiction} onChange={(event) => setNewInstitution((previous) => ({ ...previous, jurisdiction: event.target.value }))} /></Field><Field label="Accountable executive"><input value={newInstitution.owner} onChange={(event) => setNewInstitution((previous) => ({ ...previous, owner: event.target.value }))} /></Field></div><Field label="Program"><select value={newInstitution.program} onChange={(event) => setNewInstitution((previous) => ({ ...previous, program: event.target.value }))}><option>Applied Route Reviewer</option><option>Governance Route Author</option><option>Runtime Governance Steward</option><option>Institutional Accreditation</option></select></Field><div className="modal-actions"><button type="button" className="secondary" onClick={() => setShowNewInstitution(false)}>Cancel</button><button type="submit" className="primary">Create record</button></div></form></Modal>}

      {showNewFinding && <Modal title="Open accreditation finding" onClose={() => setShowNewFinding(false)}><form onSubmit={createFinding} className="modal-form"><Field label="Finding title"><input autoFocus value={newFinding.title} onChange={(event) => setNewFinding((previous) => ({ ...previous, title: event.target.value }))} /></Field><Field label="Institution"><select value={newFinding.institutionId} onChange={(event) => setNewFinding((previous) => ({ ...previous, institutionId: event.target.value }))}>{state.institutions.map((institution) => <option key={institution.id} value={institution.id}>{institution.name}</option>)}</select></Field><div className="form-grid two"><Field label="Standard"><select value={newFinding.standard} onChange={(event) => setNewFinding((previous) => ({ ...previous, standard: event.target.value }))}>{state.standards.map((standard) => <option key={standard.id} value={standard.code}>{standard.code} — {standard.title}</option>)}</select></Field><Field label="Severity"><select value={newFinding.severity} onChange={(event) => setNewFinding((previous) => ({ ...previous, severity: event.target.value as Severity }))}>{["CRITICAL", "MAJOR", "MINOR", "OBSERVATION"].map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="Owner"><input value={newFinding.owner} onChange={(event) => setNewFinding((previous) => ({ ...previous, owner: event.target.value }))} /></Field><Field label="Due date"><input type="date" value={newFinding.due} onChange={(event) => setNewFinding((previous) => ({ ...previous, due: event.target.value }))} /></Field></div><div className="modal-actions"><button type="button" className="secondary" onClick={() => setShowNewFinding(false)}>Cancel</button><button type="submit" className="primary">Open finding</button></div></form></Modal>}

      <style jsx>{`
        :global(*){box-sizing:border-box}
        :global(body){margin:0;background:#050810;color:#e9eef8;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        button,input,select,textarea{font:inherit}
        button{cursor:pointer}
        .page-shell{min-height:100vh;position:relative;overflow:hidden;padding:34px clamp(18px,4vw,68px) 48px;background:radial-gradient(circle at 18% -8%,rgba(63,110,222,.18),transparent 31%),radial-gradient(circle at 88% 9%,rgba(22,181,129,.12),transparent 26%),linear-gradient(180deg,#070b14 0%,#05070d 55%,#070a12 100%)}
        .grid-overlay{position:absolute;inset:0;pointer-events:none;opacity:.24;background-image:linear-gradient(rgba(104,132,177,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(104,132,177,.055) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(to bottom,black,transparent 78%)}
        .orb{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none;opacity:.18}.orb-one{width:430px;height:430px;background:#2e6df6;top:-240px;left:-140px}.orb-two{width:360px;height:360px;background:#18b77a;top:260px;right:-190px}
        .hero,.governance-banner,.metrics,.workspace-tools,.tabs,.dashboard-grid,.split-layout,.audit-panel,footer{max-width:1560px;margin-left:auto;margin-right:auto;position:relative;z-index:1}
        .hero{display:flex;justify-content:space-between;align-items:flex-start;gap:36px}.eyebrow{color:#80abff;text-decoration:none;text-transform:uppercase;font-size:11px;font-weight:850;letter-spacing:.19em}.hero h1{font-size:clamp(42px,6vw,78px);line-height:.94;letter-spacing:-.055em;margin:16px 0 17px}.hero-copy{max-width:920px;color:#9aa9bd;line-height:1.72;font-size:16px;margin:0}.principle-row{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:19px;color:#7890b4;font-size:12px;text-transform:uppercase;letter-spacing:.08em}.principle-row span{border:1px solid #273650;background:#0a1220;border-radius:999px;padding:6px 9px}.principle-row i{font-style:normal;color:#3c5478}.hero-actions{display:flex;gap:9px;justify-content:flex-end;flex-wrap:wrap;max-width:450px}.primary,.secondary,.action-strip button,.modal-actions button{border-radius:10px;padding:11px 14px;font-weight:800}.primary{border:1px solid #e7efff;background:#e7efff;color:#07101e}.secondary{border:1px solid #27344a;background:#0c1421;color:#d5dfef}.governance-banner{margin-top:27px;margin-bottom:16px;border:1px solid rgba(247,201,72,.25);background:linear-gradient(90deg,rgba(247,201,72,.075),rgba(247,201,72,.025));border-radius:16px;padding:16px 18px;display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:center}.banner-mark{width:42px;height:42px;border-radius:12px;background:#f7c948;color:#111827;display:grid;place-items:center;font-size:18px;font-weight:950}.governance-banner strong{color:#f6d977}.governance-banner p{margin:5px 0 0;color:#b9ad87;line-height:1.5;font-size:13px}
        .metrics{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin-bottom:16px}.metric,.panel{border:1px solid rgba(107,130,166,.22);background:linear-gradient(180deg,rgba(15,22,36,.94),rgba(8,13,23,.94));box-shadow:0 22px 65px rgba(0,0,0,.25);border-radius:18px}.metric{padding:17px}.metric span,.metric small{display:block;color:#8290a6}.metric span{font-size:12px}.metric strong{display:block;font-size:29px;margin:7px 0 4px;letter-spacing:-.03em}.metric small{font-size:11px;line-height:1.4}.workspace-tools{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:14px}.search-wrap{display:flex;align-items:center;gap:10px;flex:1;max-width:760px;border:1px solid #27344a;background:#080e18;border-radius:12px;padding:0 13px}.search-wrap span{font-size:22px;color:#6780a7}.search-wrap input{border:0;background:transparent;padding:12px 0}.local-state{color:#7f8da3;font-size:12px;display:flex;align-items:center;gap:8px}.pulse{width:8px;height:8px;border-radius:50%;background:#64748b}.pulse.ready{background:#34d399;box-shadow:0 0 0 5px rgba(52,211,153,.08)}
        .tabs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px;margin-bottom:18px}.tabs button{border:1px solid #202b3e;background:#0a101b;color:#8593a8;border-radius:13px;padding:12px 13px;text-align:left}.tabs button span,.tabs button small{display:block}.tabs button span{font-weight:800;color:#b9c5d6}.tabs button small{font-size:10px;line-height:1.35;margin-top:4px;color:#68768b}.tabs button.active{border-color:#6c98e8;background:linear-gradient(180deg,#132340,#0d182a);box-shadow:inset 0 0 0 1px rgba(108,152,232,.17)}.tabs button.active span{color:#e5efff}.tabs button.active small{color:#8fb0e5}
        .dashboard-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-bottom:16px}.dashboard-grid .span-two{grid-column:span 2}.panel{padding:21px;min-width:0}.panel-title{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:17px}.panel-title h2{font-size:18px;margin:0 0 5px}.panel-title p{font-size:12px;color:#748298;margin:0}.text-button{border:0;background:transparent;color:#84adf5;font-weight:750;padding:3px}.institution-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.institution-card{border:1px solid #1d2a3f;background:#090f1a;color:inherit;border-radius:14px;padding:15px;text-align:left}.institution-card:hover{border-color:#456ba5;background:#0c1626}.institution-head,.institution-foot,.dual-progress{display:flex;justify-content:space-between;gap:12px}.institution-head strong,.institution-head span{display:block}.institution-head span{font-size:11px;color:#708098;margin-top:5px}.institution-foot{align-items:center;margin-top:12px}.institution-foot>span{color:#77869b;font-size:11px;text-align:right}.dual-progress{margin-top:13px}.dual-progress>.progress-wrap{width:50%;margin:0}.donut{--score:0deg;width:150px;height:150px;border-radius:50%;background:conic-gradient(#6b9ef1 var(--score),#172033 0);margin:8px auto 20px;display:grid;place-items:center}.donut>div{width:118px;height:118px;border-radius:50%;background:#0a101b;display:grid;place-content:center;text-align:center}.donut strong{font-size:29px}.donut span{font-size:11px;color:#748298}.posture-list{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.posture-list>div{display:flex;justify-content:space-between;align-items:center;border:1px solid #1c2739;background:#080e18;border-radius:10px;padding:10px}.decision-note{border:1px solid #2a3d5c;background:#0a1525;border-radius:13px;padding:14px;margin-top:16px}.decision-note strong{color:#9abdf8}.decision-note p{color:#8796aa;line-height:1.55;font-size:12px;margin:6px 0 0}.deadline-list,.audit-list,.status-bars,.coverage-list{display:grid;gap:9px}.deadline{display:flex;justify-content:space-between;gap:13px;align-items:center;border-bottom:1px solid #182235;padding:9px 0}.deadline strong,.deadline small{display:block}.deadline>div:first-child strong{font-size:13px;margin:4px 0}.deadline small{color:#6f7d92;font-size:11px}.type-label{color:#80a7e5;font-size:9px;text-transform:uppercase;letter-spacing:.11em}.due{text-align:right}.due strong{font-size:17px}.due span{font-size:10px;color:#6f7d92}.due.urgent strong{color:#fb923c}.bar-label{display:flex;justify-content:space-between;color:#8d9cb0;font-size:11px;margin-bottom:6px}.bar-track{height:7px;border-radius:999px;background:#172033;overflow:hidden}.bar-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#4c7dcc,#39c795)}
        .split-layout{display:grid;grid-template-columns:minmax(360px,.82fr) minmax(0,1.55fr);gap:16px;margin-bottom:18px}.list-panel{max-height:980px;overflow:auto}.filter-row{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}.filter-row select{max-width:245px}.filter-row span{color:#6f7d92;font-size:11px}.select-list{display:grid;gap:8px}.select-row{width:100%;display:flex;justify-content:space-between;align-items:center;gap:14px;border:1px solid #1c283b;background:#080e18;color:inherit;border-radius:12px;padding:13px;text-align:left}.select-row:hover,.select-row.selected{border-color:#527bb8;background:#0d192b}.select-row strong,.select-row span{display:block}.select-row strong{font-size:13px}.select-row span{font-size:10px;color:#718097;margin-top:5px}.row-status{text-align:right;display:grid;justify-items:end;gap:5px}.row-status small{color:#6f7d92;font-size:10px}.detail-heading{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;border-bottom:1px solid #1b2638;padding-bottom:17px;margin-bottom:18px}.detail-heading h2{font-size:26px;letter-spacing:-.025em;margin:7px 0 5px}.detail-heading p{color:#7f8ea3;margin:0;font-size:12px}.record-code,.code-chip{display:inline-flex;border:1px solid #294166;background:#101e33;color:#86afea;border-radius:7px;padding:4px 7px;font-size:9px;font-weight:850;letter-spacing:.05em}.code-chip{margin-right:7px}.heading-pills{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.score-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:17px}.score-card{border:1px solid #1d2a3d;background:#080e18;border-radius:13px;padding:14px}.score-card span{color:#77869a;font-size:10px}.score-card strong{display:block;font-size:24px;margin:5px 0}.score-card div{height:6px;background:#172033;border-radius:999px;overflow:hidden}.score-card i{display:block;height:100%;background:linear-gradient(90deg,#4f83d8,#35c48d);border-radius:999px}.form-grid{display:grid;gap:12px}.form-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.form-grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}.field{display:block;color:#8190a5;font-size:11px;margin-bottom:12px}.field>span{display:block;margin-bottom:7px}.field input,.field select,.field textarea,input,select,textarea{width:100%;border:1px solid #263247;background:#070d17;color:#dce5f3;border-radius:10px;padding:11px 12px;outline:none}.field input:focus,.field select:focus,.field textarea:focus,input:focus,select:focus,textarea:focus{border-color:#5680bf;box-shadow:0 0 0 3px rgba(86,128,191,.1)}textarea{resize:vertical}.action-strip{display:flex;gap:9px;flex-wrap:wrap;border-top:1px solid #1b2638;padding-top:16px;margin-top:5px}.action-strip button{border:1px solid #2a3b54;background:#0d1727;color:#d7e2f3}.action-strip button:first-child{border-color:#2f6f5c;background:#0b211c;color:#8de3c3}.action-strip .danger{border-color:#6e3541;background:#251015;color:#f5a0ad}.progress-wrap{margin:13px 0}.progress-label{display:flex;justify-content:space-between;color:#8998ac;font-size:10px;margin-bottom:6px}.progress-track{height:7px;background:#172033;border-radius:999px;overflow:hidden}.progress-fill{height:100%;background:linear-gradient(90deg,#4e82d6,#35c38c);border-radius:999px}.status-pill{display:inline-flex;align-items:center;border:1px solid;padding:5px 8px;border-radius:999px;font-size:9px;font-weight:900;letter-spacing:.05em;white-space:nowrap;text-transform:uppercase}.check-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:16px 0}.check-card{border:1px solid #1d2a3d;background:#080e18;border-radius:12px;padding:12px;display:grid;gap:6px;cursor:pointer}.check-card input{width:auto}.check-card span{font-size:11px;text-transform:capitalize}.check-card small{font-size:9px;color:#758398}.evidence-question-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:18px}.evidence-question-grid h3,.section-label{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#7890b5}.requirement{display:flex;gap:10px;align-items:flex-start;border:1px solid #1b283b;background:#080e18;border-radius:11px;padding:11px;margin-bottom:8px}.requirement span{width:25px;height:25px;flex:0 0 25px;border-radius:8px;background:#14243c;color:#8db2ec;display:grid;place-items:center;font-size:9px;font-weight:900}.requirement p{margin:3px 0 0;color:#bac5d4;font-size:11px;line-height:1.5}.requirement.question span{background:#1b3028;color:#8de0bd}.toggle-field{display:flex;align-items:center;gap:9px;border:1px solid #263247;background:#070d17;border-radius:10px;padding:11px 12px;color:#aebacc;font-size:11px}.toggle-field input{width:auto}.metadata-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:17px}.metadata{border:1px solid #1c293c;background:#080e18;border-radius:11px;padding:11px}.metadata span,.metadata strong{display:block}.metadata span{color:#6f7e92;font-size:9px;text-transform:uppercase;letter-spacing:.08em}.metadata strong{font-size:11px;margin-top:6px;overflow-wrap:anywhere}.requirements-stack{margin-bottom:16px}
        .reports{grid-template-columns:minmax(0,2fr) minmax(320px,.8fr)}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:880px}th{text-align:left;color:#6f7e93;font-size:9px;text-transform:uppercase;letter-spacing:.1em;padding:10px;border-bottom:1px solid #263247}td{padding:13px 10px;border-bottom:1px solid #172132;color:#c8d2e1;font-size:12px}td strong,td small{display:block}td small{color:#69778c;font-size:9px;margin-top:4px}.coverage-list>div{display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #182235;padding:9px 0}.coverage-list span,.coverage-list strong,.coverage-list small{display:block}.coverage-list span{font-size:9px;color:#86a9df}.coverage-list strong{font-size:11px;margin:2px 0}.coverage-list small{font-size:9px;color:#69778b}.mini-score{font-size:17px;font-weight:850}.audit-panel{margin-bottom:18px}.audit-row{display:grid;grid-template-columns:155px minmax(180px,.55fr) minmax(0,1.45fr);gap:14px;align-items:start;border-bottom:1px solid #182235;padding:11px 0}.audit-row time{color:#6f7e93;font-size:10px}.audit-row strong,.audit-row span,.audit-row small{display:block}.audit-row strong{font-size:11px}.audit-row span{color:#8baee3;font-size:9px;margin-top:4px}.audit-row small{color:#8190a4;font-size:10px;line-height:1.5}.audit-list.compact .audit-row{grid-template-columns:1fr}.audit-list.compact .audit-row time{display:none}.audit-list.compact .audit-row>div:last-child{margin-top:-7px}
        footer{display:flex;justify-content:space-between;gap:18px;align-items:center;color:#68768a;font-size:11px;border-top:1px solid #172133;padding-top:18px}footer>div{display:flex;gap:10px;align-items:center;flex-wrap:wrap}footer strong,footer span{display:block}footer strong{color:#9cb1cf}footer a,footer button{color:#7898c7;text-decoration:none;border:0;background:transparent;padding:4px}
        .modal-backdrop{position:fixed;inset:0;z-index:30;background:rgba(2,5,10,.76);backdrop-filter:blur(8px);display:grid;place-items:center;padding:20px}.modal{width:min(680px,100%);max-height:90vh;overflow:auto;border:1px solid #31415b;background:#0a101b;border-radius:18px;box-shadow:0 30px 100px rgba(0,0,0,.55)}.modal-head{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid #1e2a3c}.modal-head h2{margin:0;font-size:18px}.modal-head button{width:34px;height:34px;border:1px solid #27344a;background:#0d1624;color:#cdd8e8;border-radius:9px}.modal-form{padding:20px}.modal-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:16px}

        .section-kicker{display:block;color:#82aef1;font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;margin-bottom:8px}
        .governance-hero,.matrix-banner,.site-review-header,.panel-room-header,.surveillance-header{max-width:1560px;margin:0 auto 16px;padding:25px;display:flex;justify-content:space-between;align-items:center;gap:25px;position:relative;z-index:1}
        .governance-hero h2,.matrix-banner h2,.site-review-header h2,.panel-room-header h2,.surveillance-header h2{font-size:clamp(26px,3vw,42px);letter-spacing:-.04em;margin:7px 0 9px}
        .governance-hero p,.matrix-banner p,.site-review-header p,.panel-room-header p,.surveillance-header p{color:#8c9bb0;line-height:1.65;max-width:880px;margin:0}
        .constitution-mark,.visit-readiness,.quorum-card,.standing-card{min-width:230px;border:1px solid #2b3c55;background:#07101c;border-radius:15px;padding:17px}
        .constitution-mark span,.constitution-mark strong,.constitution-mark small,.visit-readiness span,.visit-readiness strong,.visit-readiness small,.quorum-card span,.quorum-card strong,.quorum-card small,.standing-card span,.standing-card strong,.standing-card small{display:block}
        .constitution-mark span,.visit-readiness span,.quorum-card span,.standing-card span{font-size:9px;color:#70819a;text-transform:uppercase;letter-spacing:.1em}
        .constitution-mark strong,.visit-readiness strong,.quorum-card strong,.standing-card strong{font-size:25px;margin:8px 0;color:#f3d56a}
        .constitution-mark small,.visit-readiness small,.quorum-card small,.standing-card small{font-size:10px;color:#8492a7;line-height:1.5}
        .visit-readiness>div{height:6px;background:#172234;border-radius:999px;overflow:hidden;margin:10px 0}.visit-readiness i{display:block;height:100%;background:linear-gradient(90deg,#4f83d8,#35c48d)}
        .governance-scoreboard,.surveillance-metrics{max-width:1560px;margin:0 auto 16px;display:grid;grid-template-columns:repeat(5,1fr);gap:10px;position:relative;z-index:1}
        .governance-metric{border:1px solid rgba(107,130,166,.22);background:linear-gradient(180deg,rgba(15,22,36,.94),rgba(8,13,23,.94));border-radius:15px;padding:16px}.governance-metric span,.governance-metric small{display:block}.governance-metric span{font-size:10px;color:#78889e;text-transform:uppercase;letter-spacing:.08em}.governance-metric strong{display:block;font-size:24px;margin:7px 0;color:#e7edf8}.governance-metric small{font-size:9px;color:#68778d;line-height:1.45}
        .governance-layout,.site-review-layout,.panel-room-grid,.surveillance-layout{max-width:1560px;margin:0 auto 16px;display:grid;grid-template-columns:minmax(0,1.45fr) minmax(340px,.55fr);gap:16px;position:relative;z-index:1}.governance-controls-panel,.agenda-panel,.activity-workspace,.panel-members-card,.deliberation-workspace,.material-change-panel{padding:20px}.governance-side-stack,.surveillance-side-stack{display:grid;gap:16px}.governance-side-stack>.panel,.surveillance-side-stack>.panel{padding:20px}
        .control-register{display:grid;gap:10px}.control-record{display:grid;grid-template-columns:minmax(250px,1.1fr) minmax(280px,1fr) minmax(220px,.8fr) auto;gap:14px;align-items:center;border:1px solid #1d2a3d;background:#080f19;border-radius:13px;padding:15px}.control-identity span{font-size:9px;color:#83a8df;text-transform:uppercase;letter-spacing:.1em}.control-identity strong{display:block;margin:5px 0;font-size:13px}.control-identity p,.control-evidence p{margin:0;color:#7f8da2;font-size:10px;line-height:1.55}.control-facts{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.fact{border:1px solid #1e2b3e;background:#070c14;border-radius:9px;padding:9px}.fact span,.fact strong{display:block}.fact span{font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.08em}.fact strong{font-size:10px;margin-top:5px;line-height:1.35}.control-evidence span{font-size:8px;color:#6f7f95;text-transform:uppercase}.authority-link{display:flex;gap:11px;align-items:center;border-bottom:1px solid #192438;padding:10px 0}.authority-link>span{width:27px;height:27px;border-radius:8px;display:grid;place-items:center;background:#14243a;color:#8fb5ed;font-size:9px;font-weight:900}.authority-link strong,.authority-link small{display:block}.authority-link strong{font-size:11px}.authority-link small{font-size:9px;color:#708096;margin-top:3px}.boundary-item{display:flex;gap:10px;border-bottom:1px solid #192438;padding:11px 0}.boundary-item>span{width:24px;height:24px;border-radius:8px;background:#2a1217;color:#f596a4;display:grid;place-items:center;font-weight:900}.boundary-item strong{font-size:11px}.boundary-item p{font-size:9px;color:#77869a;line-height:1.5;margin:4px 0 0}.governance-assurance{max-width:1560px;margin:0 auto 16px;padding:20px;position:relative;z-index:1}.assurance-question-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.assurance-question{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;border:1px solid #1c293b;background:#080e18;border-radius:11px;padding:12px}.assurance-question>span{font-size:9px;color:#82a9e4}.assurance-question p{margin:0;font-size:10px;color:#a5b1c2;line-height:1.5}.assurance-question strong{font-size:8px;color:#f0c95d}
        .matrix-summary{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;min-width:320px}.matrix-summary>div{border:1px solid #24344b;background:#07101b;border-radius:11px;padding:12px}.matrix-summary strong,.matrix-summary span{display:block}.matrix-summary strong{font-size:21px}.matrix-summary span{font-size:8px;color:#708096;text-transform:uppercase;margin-top:4px}.matrix-panel{max-width:1560px;margin:0 auto 16px;padding:0;overflow:hidden;position:relative;z-index:1}.matrix-header-row,.matrix-record{display:grid;grid-template-columns:minmax(330px,1.35fr) minmax(150px,.55fr) 130px 90px minmax(220px,.8fr);gap:12px;align-items:center}.matrix-header-row{padding:12px 16px;background:#0c1421;border-bottom:1px solid #28364b;color:#718099;font-size:8px;text-transform:uppercase;letter-spacing:.08em}.matrix-record{width:100%;border:0;border-bottom:1px solid #182235;background:#080e18;color:inherit;text-align:left;padding:15px 16px}.matrix-record:hover{background:#0b1421}.matrix-standard span,.matrix-standard small{display:block}.matrix-standard span{font-size:8px;color:#82a9e4;text-transform:uppercase}.matrix-standard strong{display:block;font-size:12px;margin:5px 0}.matrix-standard p{margin:0;color:#7f8ca0;font-size:9px;line-height:1.45}.matrix-standard small{font-size:8px;color:#596a80;margin-top:6px}.matrix-disposition{display:grid;gap:5px;justify-items:start}.matrix-disposition>span{font-size:8px;color:#718096}.matrix-confidence strong{font-size:18px}.matrix-confidence>div{height:5px;background:#172234;border-radius:999px;overflow:hidden;margin:6px 0}.matrix-confidence i{display:block;height:100%;background:linear-gradient(90deg,#4d81d4,#34c38d)}.matrix-confidence small{font-size:8px;color:#65758b}.matrix-findings strong,.matrix-findings span{display:block}.matrix-findings strong{font-size:20px}.matrix-findings span{font-size:8px;color:#748298}.matrix-conclusion p{margin:0;font-size:9px;color:#8996aa;line-height:1.5}.matrix-conclusion span{display:block;color:#85abe4;font-size:8px;margin-top:7px}.matrix-bottom-grid,.site-review-bottom-grid,.surveillance-bottom-grid{max-width:1560px;margin:0 auto 16px;display:grid;grid-template-columns:repeat(2,1fr);gap:16px;position:relative;z-index:1}.matrix-bottom-grid>.panel,.site-review-bottom-grid>.panel,.surveillance-bottom-grid>.panel{padding:20px}.evidence-package{display:grid;grid-template-columns:180px 1fr;gap:16px;border-bottom:1px solid #192438;padding:12px 0}.evidence-package span,.evidence-package strong{display:block}.evidence-package span{font-size:8px;color:#82a9e4}.evidence-package strong{font-size:10px;margin-top:4px}.evidence-package ul{margin:0;padding-left:17px;color:#8391a6;font-size:9px;line-height:1.65}.reviewer-question-set{border-bottom:1px solid #192438;padding:11px 0}.reviewer-question-set span{font-size:8px;color:#83aae6}.reviewer-question-set p{margin:5px 0;color:#8e9bad;font-size:9px;line-height:1.5}
        .agenda-panel{max-height:860px;overflow:auto}.agenda-list{display:grid;gap:8px}.agenda-item{display:grid;grid-template-columns:85px 1fr auto;gap:12px;align-items:center;border:1px solid #1e2b3f;background:#080e18;color:inherit;border-radius:11px;padding:12px;text-align:left}.agenda-item.active{border-color:#4b6e9e;background:#0d1828}.agenda-time strong,.agenda-time span,.agenda-main strong,.agenda-main span{display:block}.agenda-time strong{font-size:16px}.agenda-time span,.agenda-main span{font-size:8px;color:#748298;margin-top:3px}.agenda-main strong{font-size:10px}.activity-fact-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:18px}.interview-protocol{border-top:1px solid #1b2638;padding-top:15px;margin-bottom:16px}.interview-protocol h3{font-size:11px}.protocol-step{display:grid;grid-template-columns:auto 28px 1fr;gap:9px;align-items:center;border-bottom:1px solid #182235;padding:9px 0}.protocol-step input{width:auto}.protocol-step>span{font-size:8px;color:#84aae5}.protocol-step p{font-size:9px;color:#8996aa;margin:0;line-height:1.45}.sample-row{display:grid;grid-template-columns:minmax(240px,1fr) 100px 80px auto;gap:12px;align-items:center;border-bottom:1px solid #192438;padding:11px 0}.sample-row strong,.sample-row span{display:block}.sample-row strong{font-size:10px}.sample-row span{font-size:8px;color:#718096;margin-top:3px}.coverage-row{display:grid;grid-template-columns:minmax(180px,.8fr) 1fr 45px;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid #192438}.coverage-row span,.coverage-row strong{display:block}.coverage-row span{font-size:8px;color:#83aae6}.coverage-row strong{font-size:9px}.coverage-track{height:6px;background:#172234;border-radius:999px;overflow:hidden}.coverage-track i{display:block;height:100%;background:linear-gradient(90deg,#4d81d4,#34c38d)}
        .panel-members-card{max-height:980px;overflow:auto}.panel-member{border:1px solid #1e2b3f;background:#080e18;border-radius:12px;padding:14px;margin-bottom:9px}.member-topline{display:flex;justify-content:space-between;gap:12px}.member-topline strong,.member-topline span{display:block}.member-topline strong{font-size:12px}.member-topline span{font-size:8px;color:#728197;margin-top:3px}.member-expertise{display:flex;gap:5px;flex-wrap:wrap;margin:9px 0}.member-expertise span{font-size:7px;border:1px solid #2b3a50;background:#0b1421;border-radius:999px;padding:4px 6px;color:#8ca9d2}.panel-member p,.panel-member small{font-size:9px;color:#7f8ca0;line-height:1.5}.member-vote{display:flex;justify-content:space-between;border-top:1px solid #1a2638;border-bottom:1px solid #1a2638;padding:8px 0;margin:9px 0}.member-vote span{font-size:8px;color:#6e7e93}.member-vote strong{font-size:10px;color:#f0ca5c}.deliberation-score-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:17px}.deliberation-gates{display:grid;gap:7px}.deliberation-gate{display:flex;justify-content:space-between;gap:15px;align-items:center;border:1px solid #1c293c;background:#080e18;border-radius:10px;padding:11px}.deliberation-gate strong{font-size:10px}.deliberation-gate p{font-size:8px;color:#75849a;margin:4px 0 0}.motion-builder{border-top:1px solid #1c293c;margin-top:18px;padding-top:16px}.motion-builder h3{font-size:11px}.motion-options{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:13px}.motion-options button{border:1px solid #27364d;background:#08101b;color:#8493a8;border-radius:9px;padding:10px;font-weight:900}.motion-options button.active{border-color:#5f82b4;background:#12223a;color:#e5edf9}.motion-language{border:1px solid #39455a;background:#0c1421;border-radius:11px;padding:13px}.motion-language span{font-size:8px;color:#7b8aa0;text-transform:uppercase}.motion-language p{font-size:10px;color:#a9b5c5;line-height:1.6;margin:7px 0 0}.dissent-panel{max-width:1560px;margin:0 auto 16px;padding:20px;position:relative;z-index:1}.dissent-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.dissent-grid>div{border:1px solid #1d2a3d;background:#080e18;border-radius:11px;padding:13px}.dissent-grid span{font-size:8px;color:#84aae5;text-transform:uppercase}.dissent-grid p{font-size:9px;color:#8996aa;line-height:1.55;margin:7px 0 0}
        .decision-record-layout{max-width:1560px;margin:0 auto 16px;display:grid;grid-template-columns:270px minmax(0,1fr);gap:16px;position:relative;z-index:1}.decision-nav{padding:18px;align-self:start;position:sticky;top:16px}.decision-nav>button{width:100%;display:grid;grid-template-columns:28px 1fr;gap:8px;align-items:center;border:0;border-bottom:1px solid #192438;background:transparent;color:#8190a5;text-align:left;padding:11px 5px}.decision-nav>button.active{color:#edf2fa}.decision-nav>button span{font-size:8px;color:#7198d1}.decision-nav>button strong{font-size:10px}.decision-integrity{border:1px solid #2a3a51;background:#08101b;border-radius:11px;padding:13px;margin-top:16px}.decision-integrity span,.decision-integrity strong,.decision-integrity small{display:block}.decision-integrity span{font-size:8px;color:#6f7f95;text-transform:uppercase}.decision-integrity strong{font-size:24px;margin:6px 0}.decision-integrity small{font-size:8px;color:#77869b}.decision-document{padding:0;overflow:hidden}.decision-document-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;padding:28px 32px;border-bottom:1px solid #263449;background:linear-gradient(180deg,#101b2a,#0a111c)}.decision-document-head span{font-size:8px;color:#82a9e4;text-transform:uppercase;letter-spacing:.12em}.decision-document-head h2{font-size:29px;letter-spacing:-.04em;margin:8px 0}.decision-document-head p{font-size:9px;color:#78879c;margin:0}.decision-section{display:grid;grid-template-columns:150px minmax(0,1fr);border-bottom:1px solid #202d40}.decision-section-title{padding:28px 18px;background:#080f19}.decision-section-title span{font-size:9px;color:#82a9e4}.decision-section-title h3{font-size:12px;margin:7px 0}.decision-section-body{padding:28px 32px}.decision-section-body>p{font-size:11px;color:#a3afbf;line-height:1.75}.decision-callout{border-left:3px solid #5e87c0;background:#0c1726;padding:14px;margin:16px 0}.decision-callout.hold{border-left-color:#efc653;background:#1c180b}.decision-callout strong{font-size:10px}.decision-callout p{font-size:9px;color:#8d9aae;line-height:1.55;margin:5px 0 0}.decision-definition{display:grid;grid-template-columns:190px 1fr;gap:15px;border-bottom:1px solid #1a2638;padding:9px 0}.decision-definition span{font-size:8px;color:#6f7f94;text-transform:uppercase}.decision-definition strong{font-size:10px}.scope-document-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin:16px 0}.scope-document-grid>div{border:1px solid #1d2a3d;background:#080e18;border-radius:10px;padding:12px}.scope-document-grid span,.scope-document-grid strong,.scope-document-grid small{display:block}.scope-document-grid span{font-size:8px;color:#718096;text-transform:uppercase}.scope-document-grid strong{font-size:10px;margin:5px 0}.scope-document-grid small{font-size:8px;color:#68778c}.decision-list{color:#8c99ac;font-size:9px;line-height:1.7;padding-left:18px}.relied-evidence-list>div{display:grid;grid-template-columns:minmax(220px,1fr) 100px 80px 150px;gap:12px;align-items:center;border-bottom:1px solid #1a2638;padding:10px 0}.relied-evidence-list strong,.relied-evidence-list span{display:block}.relied-evidence-list strong{font-size:9px}.relied-evidence-list span{font-size:8px;color:#718096}.relied-evidence-list code{font-size:8px;color:#84aae5}.standard-correspondence{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}.standard-correspondence>div{border:1px solid #1c293c;background:#080e18;border-radius:9px;padding:10px}.standard-correspondence span,.standard-correspondence strong,.standard-correspondence small{display:block}.standard-correspondence span{font-size:8px;color:#82a9e4}.standard-correspondence strong{font-size:9px;margin:4px 0}.standard-correspondence small{font-size:8px;color:#6f7e93}.decision-finding,.condition-record{border:1px solid #28364b;background:#080e18;border-radius:11px;padding:14px;margin-bottom:10px}.decision-finding>div:first-child,.condition-record>div:first-child{display:flex;justify-content:space-between;gap:12px;align-items:center}.decision-finding h3{font-size:12px}.decision-finding p,.condition-record p{font-size:9px;color:#8391a5;line-height:1.55}.condition-record strong{font-size:10px}.condition-record small{font-size:8px;color:#6f7e93}.appeal-timeline>div{display:grid;grid-template-columns:35px 1fr;gap:12px;border-bottom:1px solid #1a2638;padding:12px 0}.appeal-timeline>div>span{width:30px;height:30px;border-radius:9px;background:#14243a;color:#8fb4ec;display:grid;place-items:center;font-size:8px}.appeal-timeline strong,.appeal-timeline small{display:block}.appeal-timeline strong{font-size:10px}.appeal-timeline small{font-size:8px;color:#83a9e3;margin-top:3px}.appeal-timeline p{font-size:9px;color:#8190a5;margin:5px 0}.signature-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:15px 0}.signature-grid>div{border:1px solid #1d2a3d;background:#080e18;border-radius:10px;padding:14px}.signature-grid span,.signature-grid strong,.signature-grid small{display:block}.signature-grid span{font-size:8px;color:#718096;text-transform:uppercase}.signature-grid strong{font-size:12px;margin:11px 0 5px;border-bottom:1px solid #344157;padding-bottom:8px}.signature-grid p{font-size:8px;color:#8190a5}.signature-grid small{font-size:8px;color:#65758b}.decision-document-footer{display:flex;justify-content:space-between;padding:15px 32px;background:#080f19;color:#65758b;font-size:8px}
        .material-change{display:grid;grid-template-columns:1fr 150px;gap:12px;align-items:center;border-bottom:1px solid #192438;padding:11px 0}.material-change strong,.material-change span{display:block}.material-change strong{font-size:11px}.material-change span{font-size:8px;color:#718096;margin-top:4px}.material-change-test{border-top:1px solid #1b2739;margin-top:15px;padding-top:14px}.material-change-test h3{font-size:11px}.material-change-test label{display:flex;gap:9px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #182235;font-size:9px;color:#8996aa;line-height:1.45}.material-change-test input{width:auto}.watch-row{display:grid;grid-template-columns:1fr 105px auto;gap:10px;align-items:center;border-bottom:1px solid #192438;padding:9px 0}.watch-row strong,.watch-row span{display:block}.watch-row strong{font-size:9px}.watch-row span{font-size:8px;color:#718096;margin-top:3px}.surveillance-cycle{border:1px solid #1d2a3d;background:#080e18;border-radius:11px;padding:14px;margin-bottom:10px}.cycle-top{display:flex;justify-content:space-between;gap:12px}.cycle-top span,.cycle-top strong{display:block}.cycle-top span{font-size:8px;color:#82a9e4}.cycle-top strong{font-size:10px;margin-top:4px}.surveillance-cycle ul{font-size:9px;color:#8190a5;line-height:1.6;padding-left:17px}.consequence-step{display:grid;grid-template-columns:80px 1fr;gap:12px;border-bottom:1px solid #192438;padding:12px 0}.consequence-step>span{font-size:9px;font-weight:900;color:#f0ca5d}.consequence-step strong{font-size:10px}.consequence-step p{font-size:9px;color:#8190a5;line-height:1.5;margin:5px 0}.empty-state{text-align:center;border:1px dashed #2a384d;border-radius:11px;padding:25px}.empty-state strong{font-size:11px}.empty-state p{font-size:9px;color:#738298;margin:6px 0 0}
        @media(max-width:1250px){.metrics{grid-template-columns:repeat(3,1fr)}.tabs{grid-template-columns:repeat(3,1fr)}.dashboard-grid{grid-template-columns:repeat(2,1fr)}.dashboard-grid .span-two{grid-column:span 2}.split-layout{grid-template-columns:minmax(320px,.8fr) minmax(0,1.2fr)}.check-grid{grid-template-columns:repeat(3,1fr)}.metadata-grid{grid-template-columns:repeat(2,1fr)}}

        @media(max-width:1250px){.governance-scoreboard,.surveillance-metrics{grid-template-columns:repeat(3,1fr)}.control-record{grid-template-columns:1fr 1fr}.control-record>.status-pill{justify-self:start}.matrix-header-row,.matrix-record{grid-template-columns:minmax(280px,1.2fr) minmax(140px,.6fr) 110px 70px}.matrix-conclusion{display:none}.panel-room-grid{grid-template-columns:380px 1fr}.deliberation-score-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:980px){.governance-layout,.site-review-layout,.panel-room-grid,.surveillance-layout,.decision-record-layout{grid-template-columns:1fr}.decision-nav{position:static}.governance-side-stack,.surveillance-side-stack{grid-template-columns:repeat(2,1fr)}.matrix-header-row{display:none}.matrix-record{grid-template-columns:1fr 150px 120px 70px}.matrix-bottom-grid,.site-review-bottom-grid,.surveillance-bottom-grid{grid-template-columns:1fr}.decision-section{grid-template-columns:1fr}.decision-section-title{padding:16px 24px}.decision-section-body{padding:22px 24px}.control-record{grid-template-columns:1fr}.dissent-grid{grid-template-columns:1fr}.panel-room-grid{grid-template-columns:1fr}.governance-hero,.matrix-banner,.site-review-header,.panel-room-header,.surveillance-header{align-items:flex-start}.matrix-summary{min-width:270px}}
        @media(max-width:700px){.governance-hero,.matrix-banner,.site-review-header,.panel-room-header,.surveillance-header{flex-direction:column}.constitution-mark,.visit-readiness,.quorum-card,.standing-card,.matrix-summary{width:100%;min-width:0}.governance-scoreboard,.surveillance-metrics{grid-template-columns:repeat(2,1fr)}.governance-side-stack,.surveillance-side-stack{grid-template-columns:1fr}.assurance-question-grid{grid-template-columns:1fr}.matrix-record{grid-template-columns:1fr}.matrix-disposition,.matrix-confidence,.matrix-findings{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.evidence-package{grid-template-columns:1fr}.activity-fact-grid,.scope-document-grid,.standard-correspondence,.signature-grid{grid-template-columns:1fr}.agenda-item{grid-template-columns:65px 1fr}.agenda-item>.status-pill{grid-column:2}.sample-row,.watch-row,.material-change{grid-template-columns:1fr}.deliberation-score-grid,.motion-options{grid-template-columns:repeat(2,1fr)}.decision-definition{grid-template-columns:1fr}.relied-evidence-list>div{grid-template-columns:1fr}.decision-document-head{flex-direction:column}.decision-document-footer{flex-direction:column;gap:6px}}
        @media(max-width:900px){.page-shell{padding:26px 16px 38px}.hero{flex-direction:column}.hero-actions{max-width:none;justify-content:flex-start}.governance-banner{grid-template-columns:auto 1fr}.governance-banner>.status-pill{grid-column:1/-1;justify-self:start}.dashboard-grid,.split-layout,.reports{grid-template-columns:1fr}.dashboard-grid .span-two{grid-column:auto}.institution-cards{grid-template-columns:1fr}.list-panel{max-height:none}.tabs{grid-template-columns:repeat(2,1fr)}.score-grid,.form-grid.three{grid-template-columns:1fr}.audit-row{grid-template-columns:1fr}.audit-row>div:last-child{margin-top:-8px}.audit-row time{margin-bottom:-7px}}
        @media(max-width:620px){.metrics{grid-template-columns:repeat(2,1fr)}.workspace-tools{align-items:flex-start;flex-direction:column}.tabs{grid-template-columns:1fr}.tabs button small{display:none}.form-grid.two,.evidence-question-grid,.metadata-grid,.check-grid{grid-template-columns:1fr}.detail-heading{flex-direction:column}.heading-pills{justify-content:flex-start}.dual-progress{flex-direction:column}.dual-progress>.progress-wrap{width:100%}.governance-banner{grid-template-columns:1fr}.banner-mark{display:none}.metrics .metric{padding:14px}.metric strong{font-size:24px}footer{align-items:flex-start;flex-direction:column}}
      `}</style>
    </main>
  );
}


type GovernanceControl = {
  id: string;
  domain: string;
  title: string;
  owner: string;
  authority: string;
  evidence: string;
  status: "VALID" | "REVIEW" | "HOLD";
  lastTested: string;
  nextTest: string;
  question: string;
};

type MatrixCell = {
  standardId: string;
  status: "SUFFICIENT" | "PARTIAL" | "MISSING" | "CONFLICT";
  confidence: number;
  accepted: number;
  pending: number;
  rejected: number;
  findingCount: number;
  reviewer: string;
  conclusion: string;
};

type VisitActivity = {
  id: string;
  date: string;
  time: string;
  activity: string;
  method: string;
  participants: string;
  standard: string;
  owner: string;
  state: "PLANNED" | "READY" | "COMPLETE" | "HOLD";
  evidenceExpected: string;
};

type PanelMember = {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  independence: "CONFIRMED" | "LIMITED" | "RECUSED";
  conflictStatement: string;
  vote: "ALLOW" | "HOLD" | "DENY" | "ESCALATE" | "PENDING";
  rationale: string;
};

type DecisionCondition = {
  id: string;
  title: string;
  source: string;
  owner: string;
  due: string;
  verification: string;
  consequence: string;
  state: "OPEN" | "SATISFIED" | "OVERDUE";
};

const governanceControls: GovernanceControl[] = [
  {
    id: "gov-01",
    domain: "Authority",
    title: "Accreditation decision authority",
    owner: "Accreditation Board Chair",
    authority: "Board Charter §4.2",
    evidence: "Current appointment, quorum rule, delegated signing authority",
    status: "VALID",
    lastTested: "2026-07-18",
    nextTest: "2026-10-18",
    question: "Can this body bind the institution to an accreditation outcome for this exact scope?",
  },
  {
    id: "gov-02",
    domain: "Independence",
    title: "Panel independence and recusal",
    owner: "Accreditation Secretary",
    authority: "Panel Procedure §3",
    evidence: "Conflict declarations, affiliation checks, recusal log, replacement record",
    status: "REVIEW",
    lastTested: "2026-07-28",
    nextTest: "Before panel vote",
    question: "Has every reviewer demonstrated independence from the applicant and the reviewed work?",
  },
  {
    id: "gov-03",
    domain: "Evidence",
    title: "Evidence custody and continuity",
    owner: "Evidence Custodian",
    authority: "Evidence Control Standard AC-02",
    evidence: "Hash, source, observed date, upload date, supersession and access history",
    status: "VALID",
    lastTested: "2026-07-29",
    nextTest: "Continuous",
    question: "Can every material conclusion be traced to evidence whose continuity has been preserved?",
  },
  {
    id: "gov-04",
    domain: "Decision",
    title: "Determination boundary control",
    owner: "Lead Reviewer",
    authority: "Decision Procedure §7",
    evidence: "Scope statement, unresolved conditions, exclusions, validity period",
    status: "HOLD",
    lastTested: "2026-07-30",
    nextTest: "Before recommendation",
    question: "Does the proposed decision stay within the evidence-supported boundary?",
  },
  {
    id: "gov-05",
    domain: "Appeal",
    title: "Independent challenge and appeal",
    owner: "Appeals Registrar",
    authority: "Appeal Rule §2.1",
    evidence: "Notice, filing window, assignment test, panel separation, final record",
    status: "VALID",
    lastTested: "2026-07-22",
    nextTest: "2026-10-22",
    question: "Can the institution challenge a decision without returning to the original decision maker?",
  },
  {
    id: "gov-06",
    domain: "Surveillance",
    title: "Continuing-standing revalidation",
    owner: "Surveillance Director",
    authority: "Continuing Standing Rule §5",
    evidence: "Material change declarations, sampled outcomes, instructor currency, complaints",
    status: "REVIEW",
    lastTested: "2026-07-21",
    nextTest: "2026-08-21",
    question: "Does previously granted standing remain admissible under current conditions?",
  },
];

const siteVisitActivities: VisitActivity[] = [
  {
    id: "visit-01",
    date: "2026-08-11",
    time: "08:30",
    activity: "Opening conference and authority confirmation",
    method: "Live conference",
    participants: "Accountable executive, program director, lead reviewer",
    standard: "AC-01",
    owner: "Lead Reviewer",
    state: "READY",
    evidenceExpected: "Attendance record, authority confirmation, scope statement",
  },
  {
    id: "visit-02",
    date: "2026-08-11",
    time: "09:15",
    activity: "Program architecture trace",
    method: "Document walkthrough",
    participants: "Program director, curriculum owner",
    standard: "AC-03",
    owner: "Program Reviewer",
    state: "READY",
    evidenceExpected: "Outcome map, prerequisite controls, version history",
  },
  {
    id: "visit-03",
    date: "2026-08-11",
    time: "10:30",
    activity: "Instructor authorization interviews",
    method: "Structured interview",
    participants: "Three sampled instructors",
    standard: "AC-04",
    owner: "Faculty Reviewer",
    state: "PLANNED",
    evidenceExpected: "Interview notes, credential sample, assignment reconciliation",
  },
  {
    id: "visit-04",
    date: "2026-08-11",
    time: "13:00",
    activity: "Observed learning session",
    method: "Direct observation",
    participants: "Instructor and active cohort",
    standard: "AC-03",
    owner: "Instruction Reviewer",
    state: "PLANNED",
    evidenceExpected: "Observation instrument, learner identity sample, lesson correspondence",
  },
  {
    id: "visit-05",
    date: "2026-08-11",
    time: "14:30",
    activity: "Assessment administration trace",
    method: "Transaction replay",
    participants: "Assessment lead and records custodian",
    standard: "AC-05",
    owner: "Assessment Reviewer",
    state: "HOLD",
    evidenceExpected: "Identity control, scoring record, moderation and release trace",
  },
  {
    id: "visit-06",
    date: "2026-08-12",
    time: "09:00",
    activity: "Learner protection and appeal test",
    method: "Scenario test",
    participants: "Registrar, appeal officer, learner representative",
    standard: "AC-07",
    owner: "Learner Protection Reviewer",
    state: "PLANNED",
    evidenceExpected: "Complaint intake, independent assignment, response clock",
  },
  {
    id: "visit-07",
    date: "2026-08-12",
    time: "11:00",
    activity: "Evidence repository sample",
    method: "Random sample",
    participants: "Evidence custodian",
    standard: "AC-02",
    owner: "Evidence Reviewer",
    state: "READY",
    evidenceExpected: "Source metadata, continuity history, access and correction record",
  },
  {
    id: "visit-08",
    date: "2026-08-12",
    time: "14:00",
    activity: "Closing conference",
    method: "Formal conference",
    participants: "Executive team and review panel",
    standard: "All",
    owner: "Lead Reviewer",
    state: "PLANNED",
    evidenceExpected: "Confirmed observations, unresolved matters, response deadlines",
  },
];

const panelMembers: PanelMember[] = [
  {
    id: "panel-01",
    name: "A. Rivera",
    role: "Panel Chair",
    expertise: ["Accreditation", "Evidence governance", "Institutional authority"],
    independence: "CONFIRMED",
    conflictStatement: "No employment, financial, advisory, or family relationship declared.",
    vote: "HOLD",
    rationale: "The evidence base is strong, but the unresolved course-version continuity issue prevents final allowance.",
  },
  {
    id: "panel-02",
    name: "S. Lind",
    role: "Assessment Specialist",
    expertise: ["Assessment validity", "Moderation", "Credential decisions"],
    independence: "CONFIRMED",
    conflictStatement: "No disqualifying relationship identified during affiliation review.",
    vote: "ALLOW",
    rationale: "Assessment controls are sufficient and the remaining record issue is not outcome-determinative if corrected before binding.",
  },
  {
    id: "panel-03",
    name: "J. Bell",
    role: "Institutional Reviewer",
    expertise: ["Quality systems", "Faculty controls", "Surveillance"],
    independence: "LIMITED",
    conflictStatement: "Participated in a public workshop attended by the applicant; no private advisory relationship.",
    vote: "HOLD",
    rationale: "The limitation does not require recusal, but the record should preserve the disclosed contact and chair determination.",
  },
  {
    id: "panel-04",
    name: "R. Chen",
    role: "Observer",
    expertise: ["Learner protection", "Appeal systems"],
    independence: "RECUSED",
    conflictStatement: "Former contractor to a related organization; excluded from deliberation and vote.",
    vote: "PENDING",
    rationale: "No vote permitted. Observation access limited to non-confidential procedural segments.",
  },
];

const decisionConditions: DecisionCondition[] = [
  {
    id: "condition-01",
    title: "Preserve effective-date evidence for the superseded course package",
    source: "Finding find-103 / AC-03",
    owner: "Institutional Records Officer",
    due: "2026-08-06",
    verification: "Independent reviewer confirms governing approval and effective date without rewriting the historical record.",
    consequence: "Accreditation recommendation remains on HOLD until satisfied.",
    state: "OPEN",
  },
  {
    id: "condition-02",
    title: "Lock the accredited scope to the reviewed programs",
    source: "Panel scope determination",
    owner: "Accreditation Secretary",
    due: "Before issuance",
    verification: "Certificate, registry record, and decision memorandum contain identical scope language.",
    consequence: "Any unreviewed program remains outside accreditation standing.",
    state: "OPEN",
  },
  {
    id: "condition-03",
    title: "Schedule first-year surveillance sample",
    source: "Continuing standing rule",
    owner: "Surveillance Director",
    due: "2026-11-04",
    verification: "Approved surveillance plan with outcome, instructor, evidence, and complaint samples.",
    consequence: "Failure to submit may trigger special review or suspension.",
    state: "OPEN",
  },
];

function AccreditationGovernanceView({
  institution,
  standards,
  reviews,
  findings,
  evidence,
}: {
  institution: Institution;
  standards: Standard[];
  reviews: Review[];
  findings: Finding[];
  evidence: EvidenceItem[];
}) {
  const institutionReviews = reviews.filter((item) => item.institutionId === institution.id);
  const institutionFindings = findings.filter((item) => item.institutionId === institution.id);
  const institutionEvidence = evidence.filter((item) => item.institutionId === institution.id);
  const validControls = governanceControls.filter((item) => item.status === "VALID").length;
  const openFindings = institutionFindings.filter((item) => item.state !== "CLOSED").length;
  const acceptedEvidence = institutionEvidence.filter((item) => item.state === "ACCEPTED").length;

  return (
    <>
      <section className="governance-hero panel">
        <div>
          <span className="section-kicker">Accreditation governance constitution</span>
          <h2>Authority must exist before accreditation can bind.</h2>
          <p>
            This workspace does not treat accreditation as a score or a ceremonial approval. It tests whether the
            institution, reviewers, evidence, panel, and final decision remain inside a documented and challengeable
            authority chain.
          </p>
        </div>
        <div className="constitution-mark">
          <span>Current decision posture</span>
          <strong>{institution.determination}</strong>
          <small>{institution.name}</small>
        </div>
      </section>

      <section className="governance-scoreboard">
        <GovernanceMetric label="Controls valid" value={`${validControls}/${governanceControls.length}`} note="Authority and process controls" />
        <GovernanceMetric label="Active reviews" value={institutionReviews.length} note="Initial, renewal, or special" />
        <GovernanceMetric label="Accepted evidence" value={acceptedEvidence} note={`${institutionEvidence.length} artifacts in record`} />
        <GovernanceMetric label="Open findings" value={openFindings} note="Must be resolved or bounded" />
        <GovernanceMetric label="Standing" value={institution.state.replaceAll("_", " ")} note={institution.validThrough} />
      </section>

      <section className="governance-layout">
        <article className="panel governance-controls-panel">
          <PanelTitle
            title="Constitutional control register"
            subtitle="The controls that make an accreditation decision legitimate before consequence occurs"
          />
          <div className="control-register">
            {governanceControls.map((control) => (
              <div className="control-record" key={control.id}>
                <div className="control-identity">
                  <span>{control.domain}</span>
                  <strong>{control.title}</strong>
                  <p>{control.question}</p>
                </div>
                <div className="control-facts">
                  <Fact label="Owner" value={control.owner} />
                  <Fact label="Authority" value={control.authority} />
                  <Fact label="Last tested" value={formatDate(control.lastTested)} />
                  <Fact label="Next test" value={control.nextTest} />
                </div>
                <div className="control-evidence">
                  <span>Required evidence</span>
                  <p>{control.evidence}</p>
                </div>
                <StatusPill
                  label={control.status}
                  tone={control.status === "VALID" ? "#34d399" : control.status === "HOLD" ? "#f87171" : "#f7c948"}
                />
              </div>
            ))}
          </div>
        </article>

        <aside className="governance-side-stack">
          <article className="panel authority-chain-card">
            <PanelTitle title="Binding authority chain" subtitle="Each link must remain current" />
            {[
              ["1", "Institutional identity", institution.code],
              ["2", "Accountable executive", institution.accountableExecutive],
              ["3", "Application authority", "Application and scope declaration"],
              ["4", "Reviewer authority", institution.leadReviewer],
              ["5", "Panel authority", "Quorum and independence confirmed"],
              ["6", "Decision authority", "Accreditation Board"],
              ["7", "Registry binding", "Certificate and public scope record"],
              ["8", "Continuing standing", institution.validThrough],
            ].map(([number, title, detail]) => (
              <div className="authority-link" key={number}>
                <span>{number}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{detail}</small>
                </div>
              </div>
            ))}
          </article>

          <article className="panel governance-boundary-card">
            <PanelTitle title="Non-negotiable boundaries" subtitle="What accreditation may never infer" />
            <BoundaryItem title="No evidence substitution" text="Missing evidence cannot be replaced by reputation, confidence, or reviewer familiarity." />
            <BoundaryItem title="No scope expansion" text="A decision cannot cover programs, campuses, instructors, or delivery modes that were not reviewed." />
            <BoundaryItem title="No retroactive authority" text="Expired or absent authority cannot be repaired merely by approving the activity afterward." />
            <BoundaryItem title="No silent conflict" text="Contradictory evidence must be preserved and resolved, not averaged away." />
            <BoundaryItem title="No unbounded conditions" text="Conditional standing requires owners, dates, verification rules, and consequences." />
          </article>
        </aside>
      </section>

      <section className="panel governance-assurance">
        <PanelTitle title="Assurance questions before panel recommendation" subtitle="A complete decision must answer every question in the record" />
        <div className="assurance-question-grid">
          {[
            "Is the applicant the same legal and operational institution that submitted the evidence?",
            "Is the requested scope precise enough to prevent accreditation from attaching to unreviewed activity?",
            "Are the reviewers authorized and independent for this exact institution and review cycle?",
            "Is the evidence current, attributable, preserved, and sufficient for every material conclusion?",
            "Have conflicting records been resolved without deleting the conflict history?",
            "Are unresolved findings bounded by enforceable conditions rather than optimistic language?",
            "Can the institution challenge the decision through an independent and time-bounded appeal process?",
            "Will surveillance detect material change before outdated standing becomes operational fact?",
          ].map((question, index) => (
            <div className="assurance-question" key={question}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{question}</p>
              <strong>{index < 5 ? "ANSWERED" : "OPEN"}</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function AccreditationMatrixView({
  institution,
  standards,
  evidence,
  findings,
  onSelectStandard,
}: {
  institution: Institution;
  standards: Standard[];
  evidence: EvidenceItem[];
  findings: Finding[];
  onSelectStandard: (id: string) => void;
}) {
  const matrix: MatrixCell[] = standards.map((standard, index) => {
    const artifacts = evidence.filter((item) => item.institutionId === institution.id && item.standardId === standard.id);
    const accepted = artifacts.filter((item) => item.state === "ACCEPTED").length;
    const pending = artifacts.filter((item) => item.state === "UNDER_REVIEW" || item.state === "UNVERIFIED").length;
    const rejected = artifacts.filter((item) => item.state === "REJECTED" || item.state === "EXPIRED").length;
    const findingCount = findings.filter((item) => item.institutionId === institution.id && item.standard === standard.code && item.state !== "CLOSED").length;
    const status: MatrixCell["status"] = rejected > 0 ? "CONFLICT" : findingCount > 0 ? "PARTIAL" : accepted > 0 ? "SUFFICIENT" : index < institution.standardsMet ? "SUFFICIENT" : "MISSING";
    return {
      standardId: standard.id,
      status,
      confidence: status === "SUFFICIENT" ? 92 - index : status === "PARTIAL" ? 71 : status === "CONFLICT" ? 54 : 25,
      accepted,
      pending,
      rejected,
      findingCount,
      reviewer: index % 3 === 0 ? "A. Rivera" : index % 3 === 1 ? "S. Lind" : "J. Bell",
      conclusion: status === "SUFFICIENT"
        ? "Evidence supports the requirement within the reviewed scope."
        : status === "PARTIAL"
          ? "Evidence is materially present but one conclusion remains bounded."
          : status === "CONFLICT"
            ? "An expired, rejected, or contradictory artifact prevents reliance."
            : "The record does not yet contain sufficient evidence for a conclusion.",
    };
  });

  const sufficient = matrix.filter((item) => item.status === "SUFFICIENT").length;
  const partial = matrix.filter((item) => item.status === "PARTIAL").length;
  const blocked = matrix.filter((item) => item.status === "MISSING" || item.status === "CONFLICT").length;

  return (
    <>
      <section className="matrix-banner panel">
        <div>
          <span className="section-kicker">Institutional sufficiency matrix</span>
          <h2>{institution.name}</h2>
          <p>
            Every standard is evaluated independently. A high portfolio score cannot erase a missing mandatory
            requirement, a conflicting artifact, or an unresolved finding.
          </p>
        </div>
        <div className="matrix-summary">
          <div><strong>{sufficient}</strong><span>Sufficient</span></div>
          <div><strong>{partial}</strong><span>Partial</span></div>
          <div><strong>{blocked}</strong><span>Blocked</span></div>
          <div><strong>{institution.readiness}%</strong><span>Readiness</span></div>
        </div>
      </section>

      <section className="panel matrix-panel">
        <div className="matrix-header-row">
          <div>Standard and governing requirement</div>
          <div>Evidence disposition</div>
          <div>Confidence</div>
          <div>Findings</div>
          <div>Reviewer conclusion</div>
        </div>
        {standards.map((standard) => {
          const cell = matrix.find((item) => item.standardId === standard.id)!;
          return (
            <button className="matrix-record" key={standard.id} onClick={() => onSelectStandard(standard.id)}>
              <div className="matrix-standard">
                <span>{standard.code} · {standard.category}</span>
                <strong>{standard.title}</strong>
                <p>{standard.principle}</p>
                <small>{standard.mandatory ? "Mandatory requirement" : "Supplemental requirement"} · Weight {standard.weight}</small>
              </div>
              <div className="matrix-disposition">
                <StatusPill
                  label={cell.status}
                  tone={cell.status === "SUFFICIENT" ? "#34d399" : cell.status === "PARTIAL" ? "#f7c948" : "#f87171"}
                />
                <span>{cell.accepted} accepted</span>
                <span>{cell.pending} pending</span>
                <span>{cell.rejected} rejected or expired</span>
              </div>
              <div className="matrix-confidence">
                <strong>{cell.confidence}%</strong>
                <div><i style={{ width: `${cell.confidence}%` }} /></div>
                <small>{cell.reviewer}</small>
              </div>
              <div className="matrix-findings">
                <strong>{cell.findingCount}</strong>
                <span>{cell.findingCount === 1 ? "open finding" : "open findings"}</span>
              </div>
              <div className="matrix-conclusion">
                <p>{cell.conclusion}</p>
                <span>Open standard →</span>
              </div>
            </button>
          );
        })}
      </section>

      <section className="matrix-bottom-grid">
        <article className="panel">
          <PanelTitle title="Required evidence package" subtitle="Minimum package expected before a standard can be allowed" />
          {standards.slice(0, 4).map((standard) => (
            <div className="evidence-package" key={standard.id}>
              <div><span>{standard.code}</span><strong>{standard.title}</strong></div>
              <ul>{standard.evidence.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </article>
        <article className="panel">
          <PanelTitle title="Reviewer question set" subtitle="Questions that prevent unsupported conclusions" />
          {standards.slice(4).map((standard) => (
            <div className="reviewer-question-set" key={standard.id}>
              <span>{standard.code}</span>
              {standard.questions.slice(0, 2).map((question) => <p key={question}>{question}</p>)}
            </div>
          ))}
        </article>
      </section>
    </>
  );
}

function SiteReviewView({
  institution,
  review,
  standards,
  evidence,
}: {
  institution: Institution;
  review: Review;
  standards: Standard[];
  evidence: EvidenceItem[];
}) {
  const [selectedActivityId, setSelectedActivityId] = useState(siteVisitActivities[0].id);
  const [visitNote, setVisitNote] = useState("");
  const selected = siteVisitActivities.find((item) => item.id === selectedActivityId) ?? siteVisitActivities[0];
  const institutionEvidence = evidence.filter((item) => item.institutionId === institution.id);

  return (
    <>
      <section className="site-review-header panel">
        <div>
          <span className="section-kicker">Controlled site review workspace</span>
          <h2>{review.title}</h2>
          <p>{institution.name} · {formatDate(review.opened)} through {formatDate(review.due)}</p>
        </div>
        <div className="visit-readiness">
          <span>Visit readiness</span>
          <strong>82%</strong>
          <div><i style={{ width: "82%" }} /></div>
          <small>Two prerequisite records remain open</small>
        </div>
      </section>

      <section className="site-review-layout">
        <article className="panel agenda-panel">
          <PanelTitle title="Visit agenda" subtitle="Every activity has an owner, method, standard, and evidence expectation" />
          <div className="agenda-list">
            {siteVisitActivities.map((activity) => (
              <button
                key={activity.id}
                className={selectedActivityId === activity.id ? "agenda-item active" : "agenda-item"}
                onClick={() => setSelectedActivityId(activity.id)}
              >
                <div className="agenda-time"><strong>{activity.time}</strong><span>{formatDate(activity.date)}</span></div>
                <div className="agenda-main"><strong>{activity.activity}</strong><span>{activity.method} · {activity.standard}</span></div>
                <StatusPill
                  label={activity.state}
                  tone={activity.state === "READY" || activity.state === "COMPLETE" ? "#34d399" : activity.state === "HOLD" ? "#f87171" : "#8bb8ff"}
                />
              </button>
            ))}
          </div>
        </article>

        <article className="panel activity-workspace">
          <PanelTitle title={selected.activity} subtitle={`${selected.method} · ${selected.standard}`} />
          <div className="activity-fact-grid">
            <Fact label="Owner" value={selected.owner} />
            <Fact label="Participants" value={selected.participants} />
            <Fact label="Expected evidence" value={selected.evidenceExpected} />
            <Fact label="Current state" value={selected.state} />
          </div>

          <div className="interview-protocol">
            <h3>Controlled interview and observation protocol</h3>
            {[
              "Confirm participant identity, role, and authority before substantive questioning.",
              "State the reviewed scope and explain that observation does not itself establish compliance.",
              "Separate direct observation from participant explanation and reviewer interpretation.",
              "Capture contradictory statements without forcing premature reconciliation.",
              "Reference the exact standard and evidence expectation for every material note.",
              "Do not disclose tentative panel conclusions during evidence gathering.",
              "Confirm factual notes with the participant while preserving reviewer independence.",
              "Record unresolved access limitations as limitations, not as compliant evidence.",
            ].map((step, index) => (
              <label className="protocol-step" key={step}>
                <input type="checkbox" defaultChecked={index < 3} />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </label>
            ))}
          </div>

          <Field label="Reviewer observation note">
            <textarea
              rows={7}
              value={visitNote}
              onChange={(event) => setVisitNote(event.target.value)}
              placeholder="Record direct observation, source, time, limitation, and standard reference..."
            />
          </Field>
          <div className="action-strip">
            <button>Preserve observation</button>
            <button>Open evidence request</button>
            <button>Escalate access limitation</button>
          </div>
        </article>
      </section>

      <section className="site-review-bottom-grid">
        <article className="panel sample-register">
          <PanelTitle title="Evidence sample register" subtitle="Artifacts selected for direct trace during the visit" />
          {institutionEvidence.length ? institutionEvidence.map((item) => (
            <div className="sample-row" key={item.id}>
              <div><strong>{item.title}</strong><span>{item.type} · {item.source}</span></div>
              <div><span>Observed</span><strong>{formatDate(item.observedAt)}</strong></div>
              <div><span>Confidence</span><strong>{item.confidence}%</strong></div>
              <StatusPill label={item.state} tone={item.state === "ACCEPTED" ? "#34d399" : item.state === "REJECTED" || item.state === "EXPIRED" ? "#f87171" : "#f7c948"} />
            </div>
          )) : <EmptyState title="No institution-specific sample loaded" text="Select or import evidence before the visit begins." />}
        </article>

        <article className="panel visit-coverage">
          <PanelTitle title="Visit coverage" subtitle="Standards addressed by scheduled activities" />
          {standards.map((standard, index) => {
            const matching = siteVisitActivities.filter((activity) => activity.standard === standard.code || activity.standard === "All").length;
            const coverage = Math.min(100, matching * 42 + (index < 4 ? 16 : 0));
            return (
              <div className="coverage-row" key={standard.id}>
                <div><span>{standard.code}</span><strong>{standard.title}</strong></div>
                <div className="coverage-track"><i style={{ width: `${coverage}%` }} /></div>
                <strong>{coverage}%</strong>
              </div>
            );
          })}
        </article>
      </section>
    </>
  );
}

function PanelRoomView({
  institution,
  review,
  findings,
  evidence,
}: {
  institution: Institution;
  review: Review;
  findings: Finding[];
  evidence: EvidenceItem[];
}) {
  const [motion, setMotion] = useState<Determination>(review.determination);
  const [rationale, setRationale] = useState(review.summary);
  const accepted = evidence.filter((item) => item.state === "ACCEPTED").length;
  const unresolved = findings.filter((item) => item.state !== "CLOSED").length;

  return (
    <>
      <section className="panel-room-header panel">
        <div>
          <span className="section-kicker">Confidential panel deliberation</span>
          <h2>{institution.name}</h2>
          <p>{review.title} · {review.cycle.replaceAll("_", " ")}</p>
        </div>
        <div className="quorum-card">
          <span>Voting quorum</span>
          <strong>3 of 3</strong>
          <small>One observer recused and excluded</small>
        </div>
      </section>

      <section className="panel-room-grid">
        <article className="panel panel-members-card">
          <PanelTitle title="Panel constitution" subtitle="Independence must be preserved before deliberation" />
          {panelMembers.map((member) => (
            <div className="panel-member" key={member.id}>
              <div className="member-topline">
                <div><strong>{member.name}</strong><span>{member.role}</span></div>
                <StatusPill
                  label={member.independence}
                  tone={member.independence === "CONFIRMED" ? "#34d399" : member.independence === "RECUSED" ? "#f87171" : "#f7c948"}
                />
              </div>
              <div className="member-expertise">{member.expertise.map((item) => <span key={item}>{item}</span>)}</div>
              <p>{member.conflictStatement}</p>
              <div className="member-vote"><span>Recorded position</span><strong>{member.vote}</strong></div>
              <small>{member.rationale}</small>
            </div>
          ))}
        </article>

        <article className="panel deliberation-workspace">
          <PanelTitle title="Deliberation record" subtitle="The recommendation must preserve evidence, disagreement, and boundary" />
          <div className="deliberation-score-grid">
            <ScoreCard label="Institutional readiness" value={institution.readiness} />
            <ScoreCard label="Evidence completion" value={institution.evidenceComplete} />
            <ScoreCard label="Accepted sample" value={evidence.length ? Math.round((accepted / evidence.length) * 100) : 0} />
            <ScoreCard label="Standards met" value={Math.round((institution.standardsMet / institution.standardsTotal) * 100)} />
          </div>

          <div className="deliberation-gates">
            {[
              ["Identity and authority", "ALLOW", "Legal identity and accountable authority verified."],
              ["Scope precision", "ALLOW", "Requested programs and delivery boundaries are stated."],
              ["Evidence sufficiency", unresolved ? "HOLD" : "ALLOW", `${accepted} accepted artifacts; ${unresolved} unresolved finding(s).`],
              ["Faculty authority", "ALLOW", "Sampled instructors reconcile to current authorization records."],
              ["Assessment validity", "ALLOW", "Blueprint, administration, moderation, and appeal controls tested."],
              ["Record continuity", "HOLD", "One superseded course package lacks preserved effective-date evidence."],
              ["Learner protection", "ALLOW", "Complaint and appeal controls are accessible and time-bounded."],
              ["Continuing standing", "ALLOW", "Surveillance and material-change obligations can be enforced."],
            ].map(([gate, result, detail]) => (
              <div className="deliberation-gate" key={gate}>
                <div><strong>{gate}</strong><p>{detail}</p></div>
                <StatusPill label={result} tone={result === "ALLOW" ? "#34d399" : "#f7c948"} />
              </div>
            ))}
          </div>

          <div className="motion-builder">
            <h3>Draft motion</h3>
            <div className="motion-options">
              {(["ALLOW", "HOLD", "DENY", "ESCALATE"] as Determination[]).map((item) => (
                <button key={item} className={motion === item ? "active" : ""} onClick={() => setMotion(item)}>{item}</button>
              ))}
            </div>
            <Field label="Panel rationale">
              <textarea rows={8} value={rationale} onChange={(event) => setRationale(event.target.value)} />
            </Field>
            <div className="motion-language">
              <span>Proposed recommendation</span>
              <p>
                The panel recommends <strong>{motion}</strong> for the reviewed scope. The recommendation does not bind
                until the decision authority confirms quorum, independence, evidence sufficiency, conditions, validity,
                and registry correspondence.
              </p>
            </div>
            <div className="action-strip">
              <button>Preserve draft motion</button>
              <button>Request recorded vote</button>
              <button>Return to evidence review</button>
            </div>
          </div>
        </article>
      </section>

      <section className="panel dissent-panel">
        <PanelTitle title="Dissent and minority position" subtitle="Disagreement is preserved rather than erased by the majority" />
        <div className="dissent-grid">
          <div><span>Minority position</span><p>Allow with a pre-issuance administrative condition because the unresolved record does not undermine demonstrated learner competence.</p></div>
          <div><span>Majority response</span><p>The record-continuity requirement is mandatory. Accreditation cannot bind while a material course-version record remains historically ambiguous.</p></div>
          <div><span>Chair boundary</span><p>The disagreement concerns timing, not the existence of the requirement. The final memorandum must preserve both rationales.</p></div>
        </div>
      </section>
    </>
  );
}

function DecisionRecordView({
  institution,
  review,
  standards,
  findings,
  evidence,
}: {
  institution: Institution;
  review: Review;
  standards: Standard[];
  findings: Finding[];
  evidence: EvidenceItem[];
}) {
  const [section, setSection] = useState("determination");
  const activeFindings = findings.filter((item) => item.state !== "CLOSED");
  const accepted = evidence.filter((item) => item.state === "ACCEPTED");

  return (
    <section className="decision-record-layout">
      <aside className="panel decision-nav">
        <PanelTitle title="Decision memorandum" subtitle="Controlled sections" />
        {[
          ["determination", "Determination"],
          ["authority", "Authority and jurisdiction"],
          ["scope", "Accredited scope"],
          ["evidence", "Evidence relied upon"],
          ["findings", "Findings and conditions"],
          ["validity", "Validity and surveillance"],
          ["appeal", "Challenge and appeal"],
          ["signatures", "Approval and signatures"],
        ].map(([id, label], index) => (
          <button key={id} className={section === id ? "active" : ""} onClick={() => setSection(id)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
          </button>
        ))}
        <div className="decision-integrity">
          <span>Record integrity</span>
          <strong>94%</strong>
          <small>One pre-issuance condition open</small>
        </div>
      </aside>

      <article className="panel decision-document">
        <div className="decision-document-head">
          <div>
            <span>TA-14 Academy Accreditation Center</span>
            <h2>Institutional Accreditation Decision Memorandum</h2>
            <p>Decision record {review.id.toUpperCase()} · Draft for authorized review</p>
          </div>
          <StatusPill label={institution.determination} tone={determinationTone[institution.determination]} />
        </div>

        {section === "determination" && (
          <DecisionSection number="01" title="Determination">
            <p>
              Based on the application, evidence record, reviewer reports, panel deliberation, and the conditions stated
              below, the proposed determination for <strong>{institution.name}</strong> is <strong>{institution.determination}</strong>.
            </p>
            <div className="decision-callout hold">
              <strong>Binding status: NOT YET EFFECTIVE</strong>
              <p>The recommendation remains non-binding until the open record-continuity condition is independently verified.</p>
            </div>
            <DecisionDefinition label="Applicant" value={institution.name} />
            <DecisionDefinition label="Institution code" value={institution.code} />
            <DecisionDefinition label="Review cycle" value={review.cycle.replaceAll("_", " ")} />
            <DecisionDefinition label="Panel recommendation" value={review.determination} />
            <DecisionDefinition label="Decision authority" value="TA-14 Academy Accreditation Board" />
          </DecisionSection>
        )}

        {section === "authority" && (
          <DecisionSection number="02" title="Authority and jurisdiction">
            <p>
              This review is conducted under the Academy accreditation charter, the active accreditation standards,
              the panel procedure, evidence-control requirements, learner-protection rules, and the continuing-standing rule.
            </p>
            <div className="authority-table">
              <DecisionDefinition label="Applicant jurisdiction" value={institution.jurisdiction} />
              <DecisionDefinition label="Accountable executive" value={institution.accountableExecutive} />
              <DecisionDefinition label="Lead reviewer" value={institution.leadReviewer} />
              <DecisionDefinition label="Review authority" value="Initial institutional accreditation mandate" />
              <DecisionDefinition label="Panel quorum" value="Confirmed — three voting members" />
              <DecisionDefinition label="Independence" value="Confirmed with one disclosed limitation and one recusal" />
            </div>
            <div className="decision-callout">
              <strong>Authority boundary</strong>
              <p>No reviewer or panel member may enlarge the accredited scope, waive a mandatory standard, or convert an unresolved conflict into compliance.</p>
            </div>
          </DecisionSection>
        )}

        {section === "scope" && (
          <DecisionSection number="03" title="Accredited scope">
            <p>The decision applies only to the programs, delivery forms, sites, and credential activities expressly listed below.</p>
            <div className="scope-document-grid">
              {institution.scope.map((item) => (
                <div key={item}><span>Included program</span><strong>{item}</strong><small>Reviewed delivery and assessment architecture only</small></div>
              ))}
              <div><span>Jurisdiction</span><strong>{institution.jurisdiction}</strong><small>No automatic cross-jurisdiction extension</small></div>
              <div><span>Delivery mode</span><strong>Controlled hybrid delivery</strong><small>Online and observed practical activity</small></div>
              <div><span>Credential authority</span><strong>Recommendation within approved program scope</strong><small>Not authority for unrelated credentials</small></div>
            </div>
            <h3>Express exclusions</h3>
            <ul className="decision-list">
              <li>Programs, campuses, franchisees, or delivery partners not named in the final registry record.</li>
              <li>Instructor assignments made after authorization expiration or outside role-specific scope.</li>
              <li>Credential decisions based on assessments that differ materially from the reviewed assessment architecture.</li>
              <li>Claims that accreditation constitutes governmental approval, licensure, or universal regulatory recognition.</li>
            </ul>
          </DecisionSection>
        )}

        {section === "evidence" && (
          <DecisionSection number="04" title="Evidence relied upon">
            <p>The panel relied only on accepted evidence and expressly bounded any pending, rejected, expired, or contradictory artifact.</p>
            <div className="relied-evidence-list">
              {accepted.map((item) => (
                <div key={item.id}>
                  <div><strong>{item.title}</strong><span>{item.type} · {item.source}</span></div>
                  <div><span>Observed</span><strong>{formatDate(item.observedAt)}</strong></div>
                  <div><span>Confidence</span><strong>{item.confidence}%</strong></div>
                  <code>{item.hash}</code>
                </div>
              ))}
              {!accepted.length && <EmptyState title="No accepted evidence in selected record" text="The memorandum cannot advance until relied-upon evidence is identified." />}
            </div>
            <h3>Standard correspondence</h3>
            <div className="standard-correspondence">
              {standards.map((standard, index) => (
                <div key={standard.id}><span>{standard.code}</span><strong>{standard.title}</strong><small>{index < institution.standardsMet ? "Supported" : "Conditioned or unresolved"}</small></div>
              ))}
            </div>
          </DecisionSection>
        )}

        {section === "findings" && (
          <DecisionSection number="05" title="Findings and conditions">
            <p>Open findings are not hidden by the recommendation. Each is assigned an owner, due date, verification rule, and consequence.</p>
            {activeFindings.map((finding) => (
              <div className="decision-finding" key={finding.id}>
                <div><StatusPill label={finding.severity} tone={severityTone[finding.severity]} /><span>{finding.standard}</span></div>
                <h3>{finding.title}</h3>
                <p>{finding.description}</p>
                <DecisionDefinition label="Corrective action" value={finding.correctiveAction} />
                <DecisionDefinition label="Verification" value={finding.verification} />
                <DecisionDefinition label="Owner and due" value={`${finding.owner} · ${formatDate(finding.due)}`} />
              </div>
            ))}
            {decisionConditions.map((condition) => (
              <div className="condition-record" key={condition.id}>
                <div><strong>{condition.title}</strong><StatusPill label={condition.state} tone={condition.state === "SATISFIED" ? "#34d399" : "#f7c948"} /></div>
                <p>{condition.verification}</p>
                <small>{condition.owner} · {condition.due} · {condition.consequence}</small>
              </div>
            ))}
          </DecisionSection>
        )}

        {section === "validity" && (
          <DecisionSection number="06" title="Validity and continuing standing">
            <DecisionDefinition label="Proposed effective date" value="Upon verification and authorized issuance" />
            <DecisionDefinition label="Valid through" value={institution.validThrough} />
            <DecisionDefinition label="First surveillance" value="November 4, 2026" />
            <DecisionDefinition label="Material change notice" value="Within ten business days of a material change" />
            <DecisionDefinition label="Annual return" value="Required for every year of standing" />
            <h3>Events requiring revalidation</h3>
            <ul className="decision-list">
              <li>Change in legal identity, control, accountable executive, or accreditation ownership.</li>
              <li>Material revision to program outcomes, prerequisite rules, assessment architecture, or credential requirements.</li>
              <li>Use of a new campus, delivery partner, jurisdiction, language, or materially different delivery mode.</li>
              <li>Loss of instructor, assessor, reviewer, or institutional authority affecting accredited activity.</li>
              <li>Pattern of complaints, appeals, assessment anomalies, or evidence-integrity failures.</li>
            </ul>
          </DecisionSection>
        )}

        {section === "appeal" && (
          <DecisionSection number="07" title="Challenge and appeal">
            <p>The institution may challenge factual accuracy before issuance and may appeal an issued decision through an independent appeal body.</p>
            <div className="appeal-timeline">
              {[
                ["01", "Factual accuracy review", "Five business days", "Correct transcription or source errors without reopening merits."],
                ["02", "Notice of appeal", "Ten business days", "Identify challenged decision, grounds, requested remedy, and supporting evidence."],
                ["03", "Independence screening", "Three business days", "Assign reviewers with no participation in the original decision."],
                ["04", "Appeal record closure", "Fifteen business days", "Preserve the complete original record and accepted supplemental evidence."],
                ["05", "Appeal determination", "Thirty business days", "Affirm, vary, remand, or revoke within stated authority."],
              ].map(([number, title, window, text]) => (
                <div key={number}><span>{number}</span><div><strong>{title}</strong><small>{window}</small><p>{text}</p></div></div>
              ))}
            </div>
          </DecisionSection>
        )}

        {section === "signatures" && (
          <DecisionSection number="08" title="Approval and signatures">
            <p>The decision becomes effective only when every required signatory acts within current authority and the issued certificate matches this memorandum.</p>
            <div className="signature-grid">
              {[
                ["Panel Chair", "A. Rivera", "Recommendation preserved", "2026-08-12"],
                ["Accreditation Secretary", "Pending", "Record and quorum verification", "Pending"],
                ["Board Chair", "Pending", "Final authorized determination", "Pending"],
                ["Registry Custodian", "Pending", "Certificate and public record correspondence", "Pending"],
              ].map(([role, name, action, date]) => (
                <div key={role}><span>{role}</span><strong>{name}</strong><p>{action}</p><small>{date}</small></div>
              ))}
            </div>
            <div className="decision-callout hold">
              <strong>Do not issue</strong>
              <p>One mandatory pre-issuance condition remains open. No certificate, registry standing, or public claim may bind before verification.</p>
            </div>
          </DecisionSection>
        )}

        <div className="decision-document-footer">
          <span>Draft · controlled record · {review.id}</span>
          <span>No admissible evidence. No admissible execution.</span>
        </div>
      </article>
    </section>
  );
}

function SurveillanceView({
  institution,
  cycles,
  instructors,
  evidence,
  findings,
}: {
  institution: Institution;
  cycles: Cycle[];
  instructors: Instructor[];
  evidence: EvidenceItem[];
  findings: Finding[];
}) {
  const [materialChanges, setMaterialChanges] = useState([
    { id: "mc-01", title: "Program director appointment", reported: "2026-07-10", impact: "Authority", state: "ACCEPTED" },
    { id: "mc-02", title: "Assessment platform migration", reported: "2026-07-24", impact: "Assessment and records", state: "REVIEW" },
    { id: "mc-03", title: "New remote delivery cohort", reported: "2026-07-29", impact: "Scope", state: "HOLD" },
  ]);
  const expiredInstructors = instructors.filter((item) => item.state === "EXPIRED" || daysUntil(item.expiresAt) < 45);
  const expiredEvidence = evidence.filter((item) => item.state === "EXPIRED" || (item.expiresAt && daysUntil(item.expiresAt) < 45));
  const openFindings = findings.filter((item) => item.state !== "CLOSED");

  return (
    <>
      <section className="surveillance-header panel">
        <div>
          <span className="section-kicker">Continuing-standing control center</span>
          <h2>{institution.name}</h2>
          <p>Accreditation standing is revalidated against current reality. It is never assumed to remain true merely because a certificate has not expired.</p>
        </div>
        <div className="standing-card">
          <span>Current standing</span>
          <strong>{institution.state.replaceAll("_", " ")}</strong>
          <small>Valid through {institution.validThrough}</small>
        </div>
      </section>

      <section className="surveillance-metrics">
        <GovernanceMetric label="Material changes" value={materialChanges.length} note="One currently on HOLD" />
        <GovernanceMetric label="Authority expirations" value={expiredInstructors.length} note="Within the next 45 days" />
        <GovernanceMetric label="Evidence expirations" value={expiredEvidence.length} note="Requires refresh or bounded reliance" />
        <GovernanceMetric label="Open findings" value={openFindings.length} note="Continuing obligations" />
        <GovernanceMetric label="Next surveillance" value={cycles[0] ? formatDate(cycles[0].windowStart) : "Not scheduled"} note="Sample and annual return" />
      </section>

      <section className="surveillance-layout">
        <article className="panel material-change-panel">
          <PanelTitle title="Material change register" subtitle="Changes are tested before existing standing attaches to new reality" />
          {materialChanges.map((change) => (
            <div className="material-change" key={change.id}>
              <div><strong>{change.title}</strong><span>{change.impact} · reported {formatDate(change.reported)}</span></div>
              <select
                value={change.state}
                onChange={(event) => setMaterialChanges((previous) => previous.map((item) => item.id === change.id ? { ...item, state: event.target.value } : item))}
              >
                <option>ACCEPTED</option>
                <option>REVIEW</option>
                <option>HOLD</option>
              </select>
            </div>
          ))}
          <div className="material-change-test">
            <h3>Materiality test</h3>
            {[
              "Does the change alter legal identity, ownership, or accountable authority?",
              "Does the change affect program outcomes, prerequisites, assessment, or credential criteria?",
              "Does the change introduce a new site, jurisdiction, partner, language, or delivery mode?",
              "Does the change affect evidence capture, retention, identity, access, or continuity?",
              "Could the change invalidate evidence relied upon in the original decision?",
              "Would a reasonable learner or public user understand the change as inside the accredited scope?",
            ].map((question, index) => (
              <label key={question}><input type="checkbox" defaultChecked={index === 2 || index === 3} /><span>{question}</span></label>
            ))}
          </div>
        </article>

        <aside className="surveillance-side-stack">
          <article className="panel">
            <PanelTitle title="Authority watch" subtitle="Upcoming instructor and role expirations" />
            {instructors.map((instructor) => (
              <div className="watch-row" key={instructor.id}>
                <div><strong>{instructor.name}</strong><span>{instructor.role}</span></div>
                <div><span>Expires</span><strong>{formatDate(instructor.expiresAt)}</strong></div>
                <StatusPill label={instructor.state} tone={instructor.state === "AUTHORIZED" ? "#34d399" : "#f7c948"} />
              </div>
            ))}
            {!instructors.length && <EmptyState title="No instructor records" text="Load the institutional authorization roster." />}
          </article>

          <article className="panel">
            <PanelTitle title="Evidence freshness watch" subtitle="Standing cannot rely indefinitely on stale records" />
            {evidence.map((item) => (
              <div className="watch-row" key={item.id}>
                <div><strong>{item.title}</strong><span>{item.type}</span></div>
                <div><span>Expires</span><strong>{item.expiresAt ? formatDate(item.expiresAt) : "No expiry"}</strong></div>
                <StatusPill label={item.state} tone={item.state === "ACCEPTED" ? "#34d399" : item.state === "EXPIRED" ? "#f87171" : "#f7c948"} />
              </div>
            ))}
            {!evidence.length && <EmptyState title="No evidence records" text="No freshness test can be performed." />}
          </article>
        </aside>
      </section>

      <section className="surveillance-bottom-grid">
        <article className="panel">
          <PanelTitle title="Surveillance cycles" subtitle="Scheduled and event-triggered continuing-standing reviews" />
          {cycles.map((cycle) => (
            <div className="surveillance-cycle" key={cycle.id}>
              <div className="cycle-top"><div><span>{cycle.type.replaceAll("_", " ")}</span><strong>{formatDate(cycle.windowStart)} — {formatDate(cycle.windowEnd)}</strong></div><StatusPill label={cycle.state} tone={cycle.state === "COMPLETE" ? "#34d399" : "#8bb8ff"} /></div>
              <Progress label="Return completion" value={cycle.completion} />
              <ul>{cycle.requiredReturns.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
          {!cycles.length && <EmptyState title="No cycle scheduled" text="Continuing standing requires a future surveillance or renewal window." />}
        </article>

        <article className="panel">
          <PanelTitle title="Standing consequence ladder" subtitle="Response must correspond to the current evidence and risk" />
          {[
            ["ALLOW", "Standing continues", "Current evidence supports the accredited scope without unresolved material change."],
            ["HOLD", "Expansion or affected activity paused", "Existing standing is bounded while a change or evidence gap is reviewed."],
            ["CONDITIONAL", "Standing continues under enforceable conditions", "Owner, due date, verification, and consequence are recorded."],
            ["SUSPEND", "Accredited activity may not continue", "Authority, evidence, or learner-protection failure creates immediate exposure."],
            ["REVOKE", "Standing terminated", "The institution cannot demonstrate or restore the basis on which accreditation was granted."],
          ].map(([result, title, text]) => (
            <div className="consequence-step" key={result}><span>{result}</span><div><strong>{title}</strong><p>{text}</p></div></div>
          ))}
        </article>
      </section>
    </>
  );
}

function GovernanceMetric({ label, value, note }: { label: string; value: string | number; note: string }) {
  return (
    <article className="governance-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function BoundaryItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="boundary-item">
      <span>×</span>
      <div><strong>{title}</strong><p>{text}</p></div>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

function DecisionSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="decision-section">
      <div className="decision-section-title"><span>{number}</span><h3>{title}</h3></div>
      <div className="decision-section-body">{children}</div>
    </section>
  );
}

function DecisionDefinition({ label, value }: { label: string; value: string }) {
  return (
    <div className="decision-definition">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string | number; note: string }) {
  return <article className="metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function PanelTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return <div className="panel-title"><div><h2>{title}</h2><p>{subtitle}</p></div>{action}</div>;
}

function StatusPill({ label, tone }: { label: string; tone: string }) {
  return <span className="status-pill" style={{ color: tone, borderColor: `${tone}55`, background: `${tone}12` }}>{label.replaceAll("_", " ")}</span>;
}

function Progress({ label, value }: { label: string; value: number }) {
  return <div className="progress-wrap"><div className="progress-label"><span>{label}</span><strong>{clamp(value)}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${clamp(value)}%` }} /></div></div>;
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return <div className="score-card"><span>{label}</span><strong>{clamp(value)}%</strong><div><i style={{ width: `${clamp(value)}%` }} /></div></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function Metadata({ label, value }: { label: string; value: string }) {
  return <div className="metadata"><span>{label}</span><strong>{value}</strong></div>;
}

function AuditRow({ event, institution }: { event: AuditEvent; institution?: Institution }) {
  return <div className="audit-row"><time>{new Date(event.at).toLocaleString()}</time><div><strong>{event.action}</strong><span>{event.actor} · {institution?.name ?? "Institution"}</span></div><div><strong>{event.objectType} · {event.objectId}</strong><small>{event.detail}</small></div></div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-label={title}><div className="modal-head"><h2>{title}</h2><button onClick={onClose} aria-label="Close">×</button></div>{children}</section></div>;
}
