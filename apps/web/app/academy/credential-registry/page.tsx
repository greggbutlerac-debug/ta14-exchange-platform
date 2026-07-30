"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type CredentialStatus =
  | "Draft"
  | "Pending Review"
  | "Active"
  | "Conditional"
  | "Renewal Due"
  | "Suspended"
  | "Revoked"
  | "Expired";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type EvidenceState = "Pending" | "Accepted" | "Rejected" | "Expired";
type EventType =
  | "Created"
  | "Issued"
  | "Verified"
  | "Renewed"
  | "Suspended"
  | "Reinstated"
  | "Revoked"
  | "Expired"
  | "Corrected";
type TabId =
  | "overview"
  | "registry"
  | "holders"
  | "programs"
  | "issuance"
  | "verification"
  | "standing"
  | "audit"
  | "reports";

type CredentialProgram = {
  id: string;
  code: string;
  title: string;
  level: string;
  version: string;
  status: "Active" | "Draft" | "Retired";
  validityMonths: number;
  renewalWindowDays: number;
  minimumScore: number;
  requirements: string[];
  competencies: string[];
  issuingAuthority: string;
  description: string;
};

type Holder = {
  id: string;
  name: string;
  email: string;
  organization: string;
  jurisdiction: string;
  learnerId: string;
  joinedAt: string;
  standing: "Good" | "Conditional" | "Restricted" | "Inactive";
  notes: string;
};

type EvidenceItem = {
  id: string;
  credentialId: string;
  title: string;
  source: string;
  observedAt: string;
  recordedAt: string;
  expiresAt: string;
  state: EvidenceState;
  confidence: number;
  hash: string;
  notes: string;
};

type RegistryCredential = {
  id: string;
  serial: string;
  holderId: string;
  programId: string;
  status: CredentialStatus;
  decision: Decision;
  issuedAt: string;
  effectiveAt: string;
  expiresAt: string;
  renewedAt: string;
  suspendedAt: string;
  revokedAt: string;
  issuer: string;
  issuedBy: string;
  score: number;
  evidenceCount: number;
  verificationCount: number;
  publicVerification: boolean;
  conditions: string[];
  scope: string[];
  notes: string;
};

type RegistryEvent = {
  id: string;
  credentialId: string;
  type: EventType;
  at: string;
  actor: string;
  authority: string;
  detail: string;
  previousStatus: string;
  nextStatus: string;
};

type VerificationRecord = {
  id: string;
  credentialId: string;
  at: string;
  requester: string;
  method: "Public Portal" | "Institution Review" | "API" | "Manual";
  result: "Valid" | "Invalid" | "Conditional" | "Not Found";
  purpose: string;
};

type WorkspaceState = {
  programs: CredentialProgram[];
  holders: Holder[];
  credentials: RegistryCredential[];
  evidence: EvidenceItem[];
  events: RegistryEvent[];
  verifications: VerificationRecord[];
};

const STORAGE_KEY = "ta14-academy-credential-registry-v1";

const initialPrograms: CredentialProgram[] = [
  {
    id: "PRG-EAF",
    code: "TA14-EAF",
    title: "Execution Admissibility Foundations",
    level: "Foundation",
    version: "2.0",
    status: "Active",
    validityMonths: 24,
    renewalWindowDays: 60,
    minimumScore: 85,
    requirements: [
      "Complete the eight Academy foundation lessons",
      "Pass the governed scenario assessment",
      "Complete the route review exercise",
      "Complete the capstone mission",
      "Accept the credential representation obligations",
    ],
    competencies: [
      "Reality and record",
      "Continuity",
      "Admissibility",
      "Authority and binding",
      "Commit and version history",
      "Execution correspondence",
      "Outcome verification",
    ],
    issuingAuthority: "TA-14 Academy Credential Council",
    description:
      "Recognizes foundational competence in the architecture and discipline required to prevent unsupported consequence from binding to reality.",
  },
  {
    id: "PRG-RVA",
    code: "TA14-RVA",
    title: "Route Validation Analyst",
    level: "Applied",
    version: "1.1",
    status: "Active",
    validityMonths: 18,
    renewalWindowDays: 45,
    minimumScore: 88,
    requirements: [
      "Complete Route Validation Workshop",
      "Complete Evidence Conflict Resolution Lab",
      "Complete Challenge and Appeal Lab",
      "Submit two accepted route review records",
      "Pass an instructor-observed analyst review",
    ],
    competencies: [
      "Eight-anchor inspection",
      "Defect classification",
      "Evidence conflict analysis",
      "Corrective action planning",
      "Reviewer attribution",
      "Challenge preservation",
    ],
    issuingAuthority: "TA-14 Academy Credential Council",
    description:
      "Recognizes applied competence in inspecting governed routes, classifying defects, preserving review evidence, and issuing supportable determinations.",
  },
  {
    id: "PRG-GER",
    code: "TA14-GER",
    title: "Governed Execution Reviewer",
    level: "Professional",
    version: "1.0",
    status: "Active",
    validityMonths: 12,
    renewalWindowDays: 45,
    minimumScore: 90,
    requirements: [
      "Maintain a current foundation credential",
      "Complete advanced boundary and authority labs",
      "Submit three accepted independent review records",
      "Pass a professional panel review",
      "Complete annual continuing competence requirements",
    ],
    competencies: [
      "Execution boundary analysis",
      "Authority revalidation",
      "Decision record integrity",
      "Challenge-before-consequence",
      "Outcome verification",
      "Remediation governance",
    ],
    issuingAuthority: "TA-14 Academy Professional Review Board",
    description:
      "Recognizes professional competence in reviewing execution admissibility, authority, continuity, and outcome evidence before consequence occurs.",
  },
  {
    id: "PRG-IAI",
    code: "TA14-IAI",
    title: "Institutional Accreditation Instructor",
    level: "Instructor",
    version: "1.0",
    status: "Draft",
    validityMonths: 24,
    renewalWindowDays: 90,
    minimumScore: 92,
    requirements: [
      "Hold the applicable professional credential",
      "Complete instructor authorization pathway",
      "Pass observed teaching evaluation",
      "Demonstrate assessment integrity controls",
      "Maintain conflict-of-interest disclosure",
    ],
    competencies: [
      "Instructional planning",
      "Evidence-based assessment",
      "Learner remediation",
      "Credential decision discipline",
      "Record preservation",
    ],
    issuingAuthority: "TA-14 Academy Faculty Standards Council",
    description:
      "Defines the controlled authorization pathway for instructors who teach, assess, or recommend credential decisions within accredited Academy programs.",
  },
];

const initialHolders: Holder[] = [
  {
    id: "HLD-001",
    name: "Maya Chen",
    email: "maya.chen@example.org",
    organization: "Northline Governance Group",
    jurisdiction: "United States",
    learnerId: "LRN-2026-0041",
    joinedAt: "2026-04-12",
    standing: "Good",
    notes: "Professional reviewer pathway candidate.",
  },
  {
    id: "HLD-002",
    name: "Daniel Ortiz",
    email: "daniel.ortiz@example.org",
    organization: "Harbor Systems Institute",
    jurisdiction: "United States",
    learnerId: "LRN-2026-0068",
    joinedAt: "2026-05-03",
    standing: "Good",
    notes: "Foundation credential issued after complete evidence review.",
  },
  {
    id: "HLD-003",
    name: "Amina Yusuf",
    email: "amina.yusuf@example.org",
    organization: "Continuity Labs",
    jurisdiction: "United Kingdom",
    learnerId: "LRN-2025-0184",
    joinedAt: "2025-10-18",
    standing: "Conditional",
    notes: "Renewal evidence remains incomplete.",
  },
  {
    id: "HLD-004",
    name: "Lucas Meyer",
    email: "lucas.meyer@example.org",
    organization: "Independent",
    jurisdiction: "Germany",
    learnerId: "LRN-2026-0087",
    joinedAt: "2026-05-28",
    standing: "Restricted",
    notes: "Credential suspended pending investigation of representation scope.",
  },
];

const initialCredentials: RegistryCredential[] = [
  {
    id: "CRD-001",
    serial: "TA14-EAF-2026-00041",
    holderId: "HLD-001",
    programId: "PRG-EAF",
    status: "Active",
    decision: "ALLOW",
    issuedAt: "2026-06-18",
    effectiveAt: "2026-06-18",
    expiresAt: "2028-06-18",
    renewedAt: "",
    suspendedAt: "",
    revokedAt: "",
    issuer: "TA-14 Academy",
    issuedBy: "Credential Council",
    score: 96,
    evidenceCount: 14,
    verificationCount: 8,
    publicVerification: true,
    conditions: [],
    scope: ["Foundation knowledge", "Governed route interpretation"],
    notes: "Issued after complete evidence and capstone review.",
  },
  {
    id: "CRD-002",
    serial: "TA14-RVA-2026-00019",
    holderId: "HLD-001",
    programId: "PRG-RVA",
    status: "Pending Review",
    decision: "HOLD",
    issuedAt: "",
    effectiveAt: "",
    expiresAt: "",
    renewedAt: "",
    suspendedAt: "",
    revokedAt: "",
    issuer: "TA-14 Academy",
    issuedBy: "Applied Credential Panel",
    score: 91,
    evidenceCount: 11,
    verificationCount: 0,
    publicVerification: false,
    conditions: ["Instructor-observed analyst review remains outstanding"],
    scope: ["Route validation", "Evidence conflict analysis"],
    notes: "Technical threshold met; issuance held for final observed review.",
  },
  {
    id: "CRD-003",
    serial: "TA14-EAF-2026-00068",
    holderId: "HLD-002",
    programId: "PRG-EAF",
    status: "Active",
    decision: "ALLOW",
    issuedAt: "2026-07-10",
    effectiveAt: "2026-07-10",
    expiresAt: "2028-07-10",
    renewedAt: "",
    suspendedAt: "",
    revokedAt: "",
    issuer: "TA-14 Academy",
    issuedBy: "Credential Council",
    score: 93,
    evidenceCount: 12,
    verificationCount: 3,
    publicVerification: true,
    conditions: [],
    scope: ["Foundation knowledge", "Governed route interpretation"],
    notes: "No open conditions.",
  },
  {
    id: "CRD-004",
    serial: "TA14-GER-2025-00008",
    holderId: "HLD-003",
    programId: "PRG-GER",
    status: "Renewal Due",
    decision: "HOLD",
    issuedAt: "2025-08-18",
    effectiveAt: "2025-08-18",
    expiresAt: "2026-08-18",
    renewedAt: "",
    suspendedAt: "",
    revokedAt: "",
    issuer: "TA-14 Academy",
    issuedBy: "Professional Review Board",
    score: 94,
    evidenceCount: 18,
    verificationCount: 21,
    publicVerification: true,
    conditions: ["Second current review record must be accepted before renewal"],
    scope: ["Independent governed execution review", "Boundary analysis"],
    notes: "Credential remains active during renewal window.",
  },
  {
    id: "CRD-005",
    serial: "TA14-RVA-2026-00026",
    holderId: "HLD-004",
    programId: "PRG-RVA",
    status: "Suspended",
    decision: "ESCALATE",
    issuedAt: "2026-04-09",
    effectiveAt: "2026-04-09",
    expiresAt: "2027-10-09",
    renewedAt: "",
    suspendedAt: "2026-07-24",
    revokedAt: "",
    issuer: "TA-14 Academy",
    issuedBy: "Applied Credential Panel",
    score: 90,
    evidenceCount: 13,
    verificationCount: 7,
    publicVerification: true,
    conditions: ["Do not represent credential as current while suspension remains active"],
    scope: ["Route validation", "Evidence conflict analysis"],
    notes: "Suspended pending scope-representation review.",
  },
];

const initialEvidence: EvidenceItem[] = [
  {
    id: "EVD-001",
    credentialId: "CRD-001",
    title: "Foundation assessment record",
    source: "Academy Assessment Center",
    observedAt: "2026-06-15",
    recordedAt: "2026-06-15",
    expiresAt: "",
    state: "Accepted",
    confidence: 98,
    hash: "sha256:4ac1...9f20",
    notes: "Score and item-level evidence preserved.",
  },
  {
    id: "EVD-002",
    credentialId: "CRD-001",
    title: "Capstone mission record",
    source: "Capstone Mission",
    observedAt: "2026-06-17",
    recordedAt: "2026-06-17",
    expiresAt: "",
    state: "Accepted",
    confidence: 96,
    hash: "sha256:83c7...11a4",
    notes: "Mission record includes determination, authority, execution, and outcome evidence.",
  },
  {
    id: "EVD-003",
    credentialId: "CRD-002",
    title: "Instructor-observed analyst review",
    source: "Academy Review Workspace",
    observedAt: "",
    recordedAt: "2026-07-28",
    expiresAt: "",
    state: "Pending",
    confidence: 0,
    hash: "pending",
    notes: "Required evidence not yet observed.",
  },
  {
    id: "EVD-004",
    credentialId: "CRD-004",
    title: "Annual knowledge review",
    source: "Assessment Center",
    observedAt: "2026-07-22",
    recordedAt: "2026-07-22",
    expiresAt: "2027-07-22",
    state: "Accepted",
    confidence: 95,
    hash: "sha256:1b7f...40bc",
    notes: "Current for renewal decision.",
  },
  {
    id: "EVD-005",
    credentialId: "CRD-004",
    title: "Second current review record",
    source: "Review Workspace",
    observedAt: "",
    recordedAt: "2026-07-29",
    expiresAt: "",
    state: "Pending",
    confidence: 0,
    hash: "pending",
    notes: "Renewal remains on HOLD until accepted.",
  },
  {
    id: "EVD-006",
    credentialId: "CRD-005",
    title: "Representation complaint record",
    source: "Credential Integrity Office",
    observedAt: "2026-07-23",
    recordedAt: "2026-07-24",
    expiresAt: "",
    state: "Accepted",
    confidence: 88,
    hash: "sha256:c991...e801",
    notes: "Evidence supports temporary suspension and formal review.",
  },
];

const initialEvents: RegistryEvent[] = [
  {
    id: "EVT-001",
    credentialId: "CRD-001",
    type: "Created",
    at: "2026-06-12T09:00:00-04:00",
    actor: "Academy Credential Engine",
    authority: "Program rule PRG-EAF v2.0",
    detail: "Credential candidate record created after pathway completion threshold was reached.",
    previousStatus: "None",
    nextStatus: "Pending Review",
  },
  {
    id: "EVT-002",
    credentialId: "CRD-001",
    type: "Issued",
    at: "2026-06-18T14:30:00-04:00",
    actor: "Credential Council",
    authority: "Decision memorandum DM-2026-041",
    detail: "Credential issued after evidence completeness and capstone review.",
    previousStatus: "Pending Review",
    nextStatus: "Active",
  },
  {
    id: "EVT-003",
    credentialId: "CRD-004",
    type: "Verified",
    at: "2026-07-28T11:18:00-04:00",
    actor: "Public Verification Portal",
    authority: "Published registry record",
    detail: "Credential returned as active with renewal due notice.",
    previousStatus: "Renewal Due",
    nextStatus: "Renewal Due",
  },
  {
    id: "EVT-004",
    credentialId: "CRD-005",
    type: "Suspended",
    at: "2026-07-24T16:05:00-04:00",
    actor: "Credential Integrity Officer",
    authority: "Interim protection authority CIA-4.2",
    detail: "Credential suspended pending review of representation beyond authorized scope.",
    previousStatus: "Active",
    nextStatus: "Suspended",
  },
];

const initialVerifications: VerificationRecord[] = [
  {
    id: "VRF-001",
    credentialId: "CRD-001",
    at: "2026-07-29T10:11:00-04:00",
    requester: "Northline Governance Group",
    method: "Institution Review",
    result: "Valid",
    purpose: "Reviewer assignment eligibility",
  },
  {
    id: "VRF-002",
    credentialId: "CRD-004",
    at: "2026-07-28T11:18:00-04:00",
    requester: "Public requester",
    method: "Public Portal",
    result: "Conditional",
    purpose: "Current standing check",
  },
  {
    id: "VRF-003",
    credentialId: "CRD-005",
    at: "2026-07-27T15:44:00-04:00",
    requester: "Harbor Systems Institute",
    method: "API",
    result: "Invalid",
    purpose: "Contractor qualification review",
  },
];

const initialState: WorkspaceState = {
  programs: initialPrograms,
  holders: initialHolders,
  credentials: initialCredentials,
  evidence: initialEvidence,
  events: initialEvents,
  verifications: initialVerifications,
};

const tabLabels: Record<TabId, string> = {
  overview: "Overview",
  registry: "Credential Registry",
  holders: "Holders",
  programs: "Programs",
  issuance: "Issuance",
  verification: "Verification",
  standing: "Standing & Actions",
  audit: "Audit History",
  reports: "Reports",
};

const statusTone: Record<CredentialStatus, string> = {
  Draft: "slate",
  "Pending Review": "amber",
  Active: "green",
  Conditional: "blue",
  "Renewal Due": "amber",
  Suspended: "red",
  Revoked: "red",
  Expired: "slate",
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const escape = (value: unknown) => {
    const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
    return `"${text.replaceAll('"', '""')}"`;
  };
  const csv = [
    columns.map(escape).join(","),
    ...rows.map((row) => columns.map((column) => escape(row[column])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
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
  if (!value) return "Not recorded";
  const date = new Date(value.includes("T") ? value : `${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function MetricCard({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string | number;
  detail: string;
  tone?: "default" | "good" | "warn" | "risk";
}) {
  return (
    <article className={`metric metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="section-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {actions ? <div className="section-actions">{actions}</div> : null}
    </header>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">◇</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export default function CredentialRegistryPage() {
  const [state, setState] = useState<WorkspaceState>(initialState);
  const [tab, setTab] = useState<TabId>("overview");
  const [selectedCredentialId, setSelectedCredentialId] = useState("CRD-001");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CredentialStatus | "All">("All");
  const [programFilter, setProgramFilter] = useState("All");
  const [verificationInput, setVerificationInput] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [showHolderForm, setShowHolderForm] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as WorkspaceState;
      if (
        parsed &&
        Array.isArray(parsed.programs) &&
        Array.isArray(parsed.holders) &&
        Array.isArray(parsed.credentials)
      ) {
        setState(parsed);
      }
    } catch {
      setNotice("Saved registry data could not be restored. The baseline workspace remains available.");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const programById = useMemo(
    () => Object.fromEntries(state.programs.map((program) => [program.id, program])),
    [state.programs],
  );
  const holderById = useMemo(
    () => Object.fromEntries(state.holders.map((holder) => [holder.id, holder])),
    [state.holders],
  );

  const selectedCredential =
    state.credentials.find((credential) => credential.id === selectedCredentialId) ??
    state.credentials[0];

  const selectedHolder = selectedCredential ? holderById[selectedCredential.holderId] : undefined;
  const selectedProgram = selectedCredential ? programById[selectedCredential.programId] : undefined;

  const filteredCredentials = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return state.credentials.filter((credential) => {
      const holder = holderById[credential.holderId];
      const program = programById[credential.programId];
      const matchesQuery =
        !lowered ||
        credential.serial.toLowerCase().includes(lowered) ||
        credential.id.toLowerCase().includes(lowered) ||
        holder?.name.toLowerCase().includes(lowered) ||
        holder?.organization.toLowerCase().includes(lowered) ||
        program?.title.toLowerCase().includes(lowered) ||
        program?.code.toLowerCase().includes(lowered);
      const matchesStatus = statusFilter === "All" || credential.status === statusFilter;
      const matchesProgram = programFilter === "All" || credential.programId === programFilter;
      return matchesQuery && matchesStatus && matchesProgram;
    });
  }, [holderById, programById, programFilter, query, state.credentials, statusFilter]);

  const activeCount = state.credentials.filter((credential) => credential.status === "Active").length;
  const actionCount = state.credentials.filter((credential) =>
    ["Pending Review", "Renewal Due", "Suspended", "Conditional"].includes(credential.status),
  ).length;
  const publicCount = state.credentials.filter((credential) => credential.publicVerification).length;
  const verificationCount = state.verifications.length;
  const acceptedEvidence = state.evidence.filter((item) => item.state === "Accepted").length;
  const pendingEvidence = state.evidence.filter((item) => item.state === "Pending").length;

  function updateCredential(id: string, patch: Partial<RegistryCredential>) {
    setState((current) => ({
      ...current,
      credentials: current.credentials.map((credential) =>
        credential.id === id ? { ...credential, ...patch } : credential,
      ),
    }));
  }

  function appendEvent(
    credential: RegistryCredential,
    type: EventType,
    nextStatus: CredentialStatus,
    detail: string,
    authority: string,
  ) {
    const event: RegistryEvent = {
      id: makeId("EVT"),
      credentialId: credential.id,
      type,
      at: new Date().toISOString(),
      actor: "Registry Administrator",
      authority,
      detail,
      previousStatus: credential.status,
      nextStatus,
    };
    setState((current) => ({ ...current, events: [event, ...current.events] }));
  }

  function applyStandingAction(
    credential: RegistryCredential,
    action: "activate" | "suspend" | "reinstate" | "revoke" | "renew",
  ) {
    if (action === "activate") {
      updateCredential(credential.id, {
        status: "Active",
        decision: "ALLOW",
        issuedAt: credential.issuedAt || new Date().toISOString().slice(0, 10),
        effectiveAt: credential.effectiveAt || new Date().toISOString().slice(0, 10),
      });
      appendEvent(
        credential,
        credential.issuedAt ? "Corrected" : "Issued",
        "Active",
        "Credential standing was approved after the required evidence and authority review.",
        "Credential Council decision",
      );
      setNotice("Credential activated and event history preserved.");
    }
    if (action === "suspend") {
      updateCredential(credential.id, {
        status: "Suspended",
        decision: "ESCALATE",
        suspendedAt: new Date().toISOString().slice(0, 10),
      });
      appendEvent(
        credential,
        "Suspended",
        "Suspended",
        "Credential was suspended pending controlled review. Public verification remains available with suspended standing.",
        "Credential integrity authority",
      );
      setNotice("Credential suspended. The action is visible in the audit history.");
    }
    if (action === "reinstate") {
      updateCredential(credential.id, {
        status: "Active",
        decision: "ALLOW",
        suspendedAt: "",
      });
      appendEvent(
        credential,
        "Reinstated",
        "Active",
        "Credential was reinstated after the suspension condition was resolved and verified.",
        "Reinstatement determination",
      );
      setNotice("Credential reinstated with an attributable determination.");
    }
    if (action === "revoke") {
      updateCredential(credential.id, {
        status: "Revoked",
        decision: "DENY",
        revokedAt: new Date().toISOString().slice(0, 10),
      });
      appendEvent(
        credential,
        "Revoked",
        "Revoked",
        "Credential was revoked. The historical record remains preserved and public verification returns revoked standing.",
        "Credential revocation authority",
      );
      setNotice("Credential revoked. Historical continuity has been preserved.");
    }
    if (action === "renew") {
      const program = programById[credential.programId];
      const start = new Date();
      const end = new Date(start);
      end.setMonth(end.getMonth() + (program?.validityMonths ?? 12));
      updateCredential(credential.id, {
        status: "Active",
        decision: "ALLOW",
        renewedAt: start.toISOString().slice(0, 10),
        expiresAt: end.toISOString().slice(0, 10),
        conditions: [],
      });
      appendEvent(
        credential,
        "Renewed",
        "Active",
        "Credential renewed after continuing competence and standing requirements were accepted.",
        "Renewal decision memorandum",
      );
      setNotice("Credential renewed and the new validity period recorded.");
    }
  }

  function verifyCredential(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = verificationInput.trim().toLowerCase();
    const credential = state.credentials.find(
      (item) => item.serial.toLowerCase() === term || item.id.toLowerCase() === term,
    );
    if (!credential) {
      setVerificationMessage("No credential record was found for that identifier.");
      return;
    }
    const result: VerificationRecord["result"] =
      credential.status === "Active"
        ? "Valid"
        : credential.status === "Conditional" || credential.status === "Renewal Due"
          ? "Conditional"
          : "Invalid";
    const record: VerificationRecord = {
      id: makeId("VRF"),
      credentialId: credential.id,
      at: new Date().toISOString(),
      requester: "Registry workspace user",
      method: "Manual",
      result,
      purpose: "Credential standing verification",
    };
    setState((current) => ({
      ...current,
      credentials: current.credentials.map((item) =>
        item.id === credential.id
          ? { ...item, verificationCount: item.verificationCount + 1 }
          : item,
      ),
      verifications: [record, ...current.verifications],
      events: [
        {
          id: makeId("EVT"),
          credentialId: credential.id,
          type: "Verified",
          at: record.at,
          actor: record.requester,
          authority: "Published registry standing",
          detail: `Verification returned ${result.toUpperCase()} for ${credential.serial}.`,
          previousStatus: credential.status,
          nextStatus: credential.status,
        },
        ...current.events,
      ],
    }));
    setSelectedCredentialId(credential.id);
    setVerificationMessage(
      `${credential.serial} — ${result}. Current registry standing: ${credential.status}.`,
    );
  }

  function importWorkspace(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as WorkspaceState;
        if (
          !parsed ||
          !Array.isArray(parsed.programs) ||
          !Array.isArray(parsed.holders) ||
          !Array.isArray(parsed.credentials) ||
          !Array.isArray(parsed.evidence) ||
          !Array.isArray(parsed.events) ||
          !Array.isArray(parsed.verifications)
        ) {
          throw new Error("Invalid registry workspace");
        }
        setState(parsed);
        setSelectedCredentialId(parsed.credentials[0]?.id ?? "");
        setNotice("Credential Registry workspace imported.");
      } catch {
        setNotice("Import failed. Select a valid Credential Registry JSON export.");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  function resetWorkspace() {
    if (!window.confirm("Reset the Credential Registry to the baseline demonstration data?")) return;
    setState(initialState);
    setSelectedCredentialId("CRD-001");
    setNotice("Credential Registry reset to baseline data.");
  }

  return (
    <main className="page-shell">
      <div className="stars stars-a" />
      <div className="stars stars-b" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      <header className="topbar">
        <Link href="/academy" className="brand" aria-label="TA-14 Academy home">
          <span className="brand-mark">TA</span>
          <span>
            <strong>TA-14 Academy</strong>
            <small>Credential Registry</small>
          </span>
        </Link>
        <nav className="topnav" aria-label="Academy navigation">
          <Link href="/academy/dashboard">Mission Control</Link>
          <Link href="/academy/accreditation-center">Accreditation</Link>
          <Link href="/academy/credential-dashboard">My Credentials</Link>
          <Link href="/academy/review">Review</Link>
        </nav>
        <div className="top-actions">
          <button className="button ghost" onClick={() => importRef.current?.click()}>
            Import
          </button>
          <button
            className="button ghost"
            onClick={() => downloadJson("ta14-credential-registry-workspace.json", state)}
          >
            Export
          </button>
          <input ref={importRef} type="file" accept="application/json" hidden onChange={importWorkspace} />
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Academy institutional infrastructure</span>
          <h1>Credential Registry</h1>
          <p className="hero-lead">
            Issue, preserve, verify, renew, suspend, revoke, and audit Academy credentials without allowing a badge, certificate, or claim to outrun the evidence and authority that support it.
          </p>
          <div className="principle">
            <span>Registry principle</span>
            <strong>No admissible evidence. No admissible credential.</strong>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-panel-head">
            <span>Institutional standing</span>
            <Badge tone="green">Operational</Badge>
          </div>
          <div className="hero-grid">
            <div><span>Registered</span><strong>{state.credentials.length}</strong></div>
            <div><span>Publicly verifiable</span><strong>{publicCount}</strong></div>
            <div><span>Actions required</span><strong>{actionCount}</strong></div>
            <div><span>Verifications</span><strong>{verificationCount}</strong></div>
          </div>
          <div className="decision-strip">
            <Badge tone="green">ALLOW {state.credentials.filter((item) => item.decision === "ALLOW").length}</Badge>
            <Badge tone="amber">HOLD {state.credentials.filter((item) => item.decision === "HOLD").length}</Badge>
            <Badge tone="red">DENY {state.credentials.filter((item) => item.decision === "DENY").length}</Badge>
            <Badge tone="blue">ESCALATE {state.credentials.filter((item) => item.decision === "ESCALATE").length}</Badge>
          </div>
        </div>
      </section>

      {notice ? <div className="notice" role="status">{notice}</div> : null}

      <section className="metrics-grid">
        <MetricCard label="Active credentials" value={activeCount} detail="Current and independently verifiable" tone="good" />
        <MetricCard label="Standing actions" value={actionCount} detail="Review, renewal, condition, or suspension" tone={actionCount ? "warn" : "default"} />
        <MetricCard label="Accepted evidence" value={acceptedEvidence} detail={`${pendingEvidence} evidence item(s) still pending`} tone={pendingEvidence ? "warn" : "good"} />
        <MetricCard label="Credential programs" value={state.programs.length} detail={`${state.programs.filter((program) => program.status === "Active").length} active program definitions`} />
      </section>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-title">
            <span>Registry workspace</span>
            <small>Institutional controls</small>
          </div>
          <nav className="tab-list" aria-label="Credential Registry sections">
            {(Object.keys(tabLabels) as TabId[]).map((item) => (
              <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
                <span>{tabLabels[item]}</span>
                {item === "registry" ? <small>{state.credentials.length}</small> : null}
                {item === "holders" ? <small>{state.holders.length}</small> : null}
                {item === "programs" ? <small>{state.programs.length}</small> : null}
                {item === "standing" ? <small>{actionCount}</small> : null}
              </button>
            ))}
          </nav>
          <div className="sidebar-card">
            <span className="eyebrow">Selected record</span>
            <strong>{selectedCredential?.serial ?? "None"}</strong>
            <p>{selectedHolder?.name ?? "Select a credential to inspect its complete record."}</p>
            {selectedCredential ? <Badge tone={statusTone[selectedCredential.status]}>{selectedCredential.status}</Badge> : null}
          </div>
          <button className="button danger-soft full" onClick={resetWorkspace}>Reset workspace</button>
        </aside>

        <section className="content-panel">
          {tab === "overview" ? (
            <OverviewTab
              state={state}
              holderById={holderById}
              programById={programById}
              onOpen={(id) => { setSelectedCredentialId(id); setTab("registry"); }}
              onVerify={() => setTab("verification")}
            />
          ) : null}

          {tab === "registry" ? (
            <RegistryTab
              state={state}
              credentials={filteredCredentials}
              holderById={holderById}
              programById={programById}
              selectedCredentialId={selectedCredentialId}
              query={query}
              statusFilter={statusFilter}
              programFilter={programFilter}
              onQuery={setQuery}
              onStatus={setStatusFilter}
              onProgram={setProgramFilter}
              onSelect={setSelectedCredentialId}
              onExport={() => downloadCsv("ta14-credential-registry.csv", filteredCredentials as unknown as Record<string, unknown>[])}
            />
          ) : null}

          {tab === "holders" ? (
            <HoldersTab
              state={state}
              holderById={holderById}
              programById={programById}
              showForm={showHolderForm}
              onToggleForm={() => setShowHolderForm((value) => !value)}
              onCreate={(holder) => {
                setState((current) => ({ ...current, holders: [holder, ...current.holders] }));
                setShowHolderForm(false);
                setNotice("Credential holder record created.");
              }}
              onOpenCredential={(id) => { setSelectedCredentialId(id); setTab("registry"); }}
            />
          ) : null}

          {tab === "programs" ? (
            <ProgramsTab
              programs={state.programs}
              credentials={state.credentials}
              showForm={showProgramForm}
              onToggleForm={() => setShowProgramForm((value) => !value)}
              onCreate={(program) => {
                setState((current) => ({ ...current, programs: [program, ...current.programs] }));
                setShowProgramForm(false);
                setNotice("Credential program definition created.");
              }}
            />
          ) : null}

          {tab === "issuance" ? (
            <IssuanceTab
              state={state}
              showForm={showIssueForm}
              onToggleForm={() => setShowIssueForm((value) => !value)}
              onIssue={(credential, event) => {
                setState((current) => ({
                  ...current,
                  credentials: [credential, ...current.credentials],
                  events: [event, ...current.events],
                }));
                setSelectedCredentialId(credential.id);
                setShowIssueForm(false);
                setNotice("Credential candidate record created and issuance decision preserved.");
              }}
              onOpen={(id) => { setSelectedCredentialId(id); setTab("registry"); }}
            />
          ) : null}

          {tab === "verification" ? (
            <VerificationTab
              state={state}
              holderById={holderById}
              programById={programById}
              verificationInput={verificationInput}
              verificationMessage={verificationMessage}
              onInput={setVerificationInput}
              onVerify={verifyCredential}
              onOpen={(id) => { setSelectedCredentialId(id); setTab("registry"); }}
            />
          ) : null}

          {tab === "standing" ? (
            <StandingTab
              credentials={state.credentials}
              holderById={holderById}
              programById={programById}
              onAction={applyStandingAction}
              onOpen={(id) => { setSelectedCredentialId(id); setTab("registry"); }}
            />
          ) : null}

          {tab === "audit" ? (
            <AuditTab
              events={state.events}
              credentials={state.credentials}
              holderById={holderById}
              programById={programById}
              onExport={() => downloadCsv("ta14-credential-registry-audit.csv", state.events as unknown as Record<string, unknown>[])}
            />
          ) : null}

          {tab === "reports" ? (
            <ReportsTab
              state={state}
              holderById={holderById}
              programById={programById}
              onExportJson={() => downloadJson("ta14-credential-registry-report.json", state)}
              onExportCredentials={() => downloadCsv("ta14-credentials.csv", state.credentials as unknown as Record<string, unknown>[])}
              onExportVerifications={() => downloadCsv("ta14-verifications.csv", state.verifications as unknown as Record<string, unknown>[])}
            />
          ) : null}
        </section>
      </div>

      <footer className="page-footer">
        <div>
          <strong>TA-14 Academy Credential Registry</strong>
          <span>Credential standing must remain attributable, current, scoped, and challengeable.</span>
        </div>
        <div className="footer-links">
          <Link href="/academy/accreditation-center">Accreditation Center</Link>
          <Link href="/academy/certification-engine">Certification Engine</Link>
          <Link href="/academy/credential-dashboard">Learner Credentials</Link>
        </div>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { background: #050816; }
        :global(body) { margin: 0; background: #050816; color: #edf4ff; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        :global(button), :global(input), :global(select), :global(textarea) { font: inherit; }
        :global(a) { color: inherit; text-decoration: none; }
        .page-shell { min-height: 100vh; position: relative; overflow: hidden; background: radial-gradient(circle at 10% 0%, rgba(30, 115, 190, .20), transparent 28%), radial-gradient(circle at 88% 12%, rgba(126, 77, 255, .15), transparent 30%), linear-gradient(180deg, #07101f 0%, #050816 42%, #060913 100%); }
        .stars { position: fixed; inset: 0; pointer-events: none; opacity: .5; background-image: radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.5px); background-size: 90px 90px; }
        .stars-b { background-size: 145px 145px; background-position: 33px 48px; opacity: .23; }
        .orb { position: fixed; width: 340px; height: 340px; border-radius: 999px; filter: blur(80px); opacity: .12; pointer-events: none; }
        .orb-one { background: #1ec8ff; top: 18%; left: -160px; }
        .orb-two { background: #7659ff; right: -140px; top: 48%; }
        .topbar { position: sticky; top: 0; z-index: 40; min-height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 12px clamp(18px, 4vw, 58px); background: rgba(4, 8, 20, .86); border-bottom: 1px solid rgba(151, 181, 220, .14); backdrop-filter: blur(18px); }
        .brand { display: flex; align-items: center; gap: 12px; min-width: 210px; }
        .brand-mark { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 12px; border: 1px solid rgba(104, 208, 255, .45); background: linear-gradient(145deg, rgba(19, 110, 174, .56), rgba(85, 42, 176, .45)); font-weight: 900; letter-spacing: -.04em; }
        .brand strong, .brand small { display: block; }
        .brand strong { font-size: 14px; letter-spacing: .03em; }
        .brand small { color: #91a3bd; margin-top: 2px; font-size: 11px; }
        .topnav { display: flex; gap: 6px; flex: 1; justify-content: center; }
        .topnav a { padding: 9px 12px; color: #aebbd0; border-radius: 9px; font-size: 13px; }
        .topnav a:hover { color: white; background: rgba(255,255,255,.06); }
        .top-actions { display: flex; gap: 8px; }
        .button { appearance: none; border: 1px solid rgba(132, 164, 205, .26); background: linear-gradient(180deg, rgba(49, 139, 213, .30), rgba(29, 78, 136, .28)); color: white; border-radius: 10px; padding: 9px 13px; cursor: pointer; font-weight: 750; font-size: 12px; }
        .button:hover { transform: translateY(-1px); border-color: rgba(117, 202, 255, .55); }
        .button.ghost { background: rgba(255,255,255,.035); color: #d6e1f0; }
        .button.primary { background: linear-gradient(135deg, #1d8ac4, #6452cc); border-color: rgba(126, 211, 255, .4); }
        .button.warn { background: rgba(215, 147, 38, .14); border-color: rgba(251, 191, 68, .34); color: #ffd98b; }
        .button.danger { background: rgba(190, 48, 65, .18); border-color: rgba(255, 91, 111, .38); color: #ffb0bc; }
        .button.danger-soft { background: rgba(180, 60, 78, .08); border-color: rgba(255, 106, 126, .22); color: #eab3ba; }
        .button.full { width: 100%; }
        .hero { position: relative; z-index: 1; max-width: 1540px; margin: 0 auto; padding: 66px clamp(20px, 5vw, 74px) 34px; display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(340px, .65fr); gap: 48px; align-items: end; }
        .hero h1 { font-size: clamp(42px, 6vw, 76px); letter-spacing: -.055em; line-height: .98; margin: 10px 0 18px; }
        .hero-lead { max-width: 850px; color: #b8c6da; font-size: clamp(16px, 1.7vw, 21px); line-height: 1.7; margin: 0; }
        .eyebrow { color: #7fd6ff; text-transform: uppercase; letter-spacing: .13em; font-size: 10px; font-weight: 900; }
        .principle { margin-top: 24px; padding: 15px 18px; display: inline-flex; flex-direction: column; gap: 4px; border-left: 3px solid #46c7ff; background: rgba(18, 64, 101, .18); border-radius: 0 10px 10px 0; }
        .principle span { color: #7f91aa; font-size: 10px; text-transform: uppercase; letter-spacing: .11em; }
        .principle strong { font-size: 14px; }
        .hero-panel { border: 1px solid rgba(120, 177, 224, .20); background: linear-gradient(180deg, rgba(14, 27, 49, .86), rgba(8, 15, 30, .88)); border-radius: 18px; padding: 20px; box-shadow: 0 26px 70px rgba(0,0,0,.26); }
        .hero-panel-head { display: flex; justify-content: space-between; align-items: center; color: #aab9cd; font-size: 12px; }
        .hero-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 18px 0; }
        .hero-grid div { border: 1px solid rgba(255,255,255,.07); border-radius: 12px; padding: 13px; background: rgba(255,255,255,.025); }
        .hero-grid span, .hero-grid strong { display: block; }
        .hero-grid span { color: #7f91ab; font-size: 10px; }
        .hero-grid strong { margin-top: 4px; font-size: 25px; }
        .decision-strip { display: flex; flex-wrap: wrap; gap: 7px; }
        .notice { position: relative; z-index: 4; max-width: 1400px; margin: 0 auto 18px; padding: 12px 16px; background: rgba(40, 138, 190, .14); border: 1px solid rgba(94, 198, 255, .26); border-radius: 11px; color: #d7f1ff; font-size: 13px; }
        .metrics-grid { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto 20px; padding: 0 20px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
        .metric { min-height: 126px; padding: 18px; border-radius: 15px; border: 1px solid rgba(142, 173, 214, .14); background: rgba(12, 20, 38, .76); }
        .metric span, .metric strong, .metric small { display: block; }
        .metric span { color: #91a2ba; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }
        .metric strong { font-size: 31px; margin: 9px 0 5px; letter-spacing: -.03em; }
        .metric small { color: #788aa4; line-height: 1.4; }
        .metric-good { border-color: rgba(80, 213, 151, .22); }
        .metric-warn { border-color: rgba(247, 186, 74, .22); }
        .metric-risk { border-color: rgba(255, 96, 116, .22); }
        .workspace { position: relative; z-index: 2; max-width: 1400px; min-height: 760px; margin: 0 auto 54px; padding: 0 20px; display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: 16px; }
        .sidebar { align-self: start; position: sticky; top: 88px; border: 1px solid rgba(143, 173, 211, .14); background: rgba(8, 14, 28, .82); border-radius: 16px; padding: 14px; backdrop-filter: blur(16px); }
        .sidebar-title { padding: 8px 8px 14px; border-bottom: 1px solid rgba(255,255,255,.07); }
        .sidebar-title span, .sidebar-title small { display: block; }
        .sidebar-title span { font-weight: 850; }
        .sidebar-title small { color: #7f91aa; margin-top: 4px; }
        .tab-list { display: grid; gap: 5px; margin: 12px 0; }
        .tab-list button { display: flex; align-items: center; justify-content: space-between; width: 100%; border: 0; background: transparent; color: #9caec5; padding: 11px 10px; border-radius: 9px; cursor: pointer; text-align: left; font-size: 12px; }
        .tab-list button:hover { background: rgba(255,255,255,.045); color: white; }
        .tab-list button.active { color: white; background: linear-gradient(90deg, rgba(30, 139, 198, .22), rgba(107, 79, 207, .14)); box-shadow: inset 2px 0 #50c9ff; }
        .tab-list small { min-width: 24px; text-align: center; color: #80d7ff; }
        .sidebar-card { margin: 16px 0 12px; padding: 13px; border-radius: 12px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); }
        .sidebar-card strong { display: block; margin: 7px 0; font-size: 12px; word-break: break-word; }
        .sidebar-card p { color: #8798b0; font-size: 11px; line-height: 1.45; }
        .content-panel { min-width: 0; border: 1px solid rgba(143, 173, 211, .14); background: rgba(8, 14, 28, .78); border-radius: 18px; padding: clamp(18px, 3vw, 30px); box-shadow: 0 28px 80px rgba(0,0,0,.22); backdrop-filter: blur(14px); }
        .section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 22px; }
        .section-header h2 { margin: 6px 0 8px; font-size: clamp(24px, 3vw, 36px); letter-spacing: -.035em; }
        .section-header p { color: #91a2b9; max-width: 760px; line-height: 1.6; margin: 0; }
        .section-actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
        .panel-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .panel-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .panel { border: 1px solid rgba(143, 173, 211, .13); background: rgba(255,255,255,.025); border-radius: 14px; padding: 17px; }
        .panel h3 { margin: 0 0 6px; font-size: 16px; }
        .panel p { color: #899bb3; line-height: 1.55; margin: 0; font-size: 12px; }
        .panel-head { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; margin-bottom: 12px; }
        .list { display: grid; gap: 8px; }
        .list-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,.06); }
        .list-row:last-child { border-bottom: 0; }
        .list-row strong, .list-row span, .list-row small { display: block; }
        .list-row strong { font-size: 12px; }
        .list-row span, .list-row small { color: #8193aa; font-size: 11px; margin-top: 3px; }
        .badge { display: inline-flex; align-items: center; white-space: nowrap; border: 1px solid rgba(152, 176, 207, .22); border-radius: 999px; padding: 4px 8px; font-size: 9px; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; color: #c6d1df; background: rgba(255,255,255,.04); }
        .badge-green { color: #8af0bd; border-color: rgba(74, 220, 147, .29); background: rgba(44, 180, 117, .10); }
        .badge-amber { color: #ffd889; border-color: rgba(250, 184, 58, .30); background: rgba(225, 149, 24, .10); }
        .badge-red { color: #ffadb9; border-color: rgba(255, 88, 110, .30); background: rgba(203, 54, 75, .11); }
        .badge-blue { color: #8ddaff; border-color: rgba(77, 190, 247, .30); background: rgba(47, 144, 201, .11); }
        .badge-slate { color: #b7c3d2; }
        .toolbar { display: grid; grid-template-columns: minmax(220px, 1fr) 180px 220px auto; gap: 10px; margin-bottom: 16px; }
        .input, .select, .textarea { width: 100%; border: 1px solid rgba(143, 173, 211, .18); background: rgba(3, 8, 18, .66); color: white; border-radius: 10px; padding: 10px 11px; outline: none; }
        .input:focus, .select:focus, .textarea:focus { border-color: rgba(77, 198, 255, .58); box-shadow: 0 0 0 3px rgba(57, 172, 232, .10); }
        .textarea { min-height: 100px; resize: vertical; }
        .field { display: grid; gap: 6px; }
        .field > span { color: #a6b4c8; font-size: 11px; font-weight: 750; }
        .field small { color: #71829a; line-height: 1.4; }
        .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 13px; }
        .form-grid .wide { grid-column: 1 / -1; }
        .form-panel { margin-bottom: 18px; padding: 18px; border: 1px solid rgba(77, 198, 255, .18); background: rgba(19, 67, 98, .10); border-radius: 14px; }
        .form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
        .table-wrap { overflow-x: auto; border: 1px solid rgba(143, 173, 211, .12); border-radius: 13px; }
        table { width: 100%; border-collapse: collapse; min-width: 920px; }
        th { padding: 11px 12px; color: #7f91aa; font-size: 9px; text-transform: uppercase; letter-spacing: .09em; text-align: left; background: rgba(255,255,255,.025); border-bottom: 1px solid rgba(255,255,255,.07); }
        td { padding: 13px 12px; border-bottom: 1px solid rgba(255,255,255,.055); color: #c8d3e1; font-size: 11px; vertical-align: top; }
        tr:last-child td { border-bottom: 0; }
        tbody tr { cursor: pointer; }
        tbody tr:hover { background: rgba(77, 198, 255, .035); }
        tbody tr.selected { background: rgba(77, 198, 255, .07); box-shadow: inset 3px 0 #4fc9ff; }
        td strong, td span, td small { display: block; }
        td strong { color: white; font-size: 12px; }
        td small { color: #7f91aa; margin-top: 4px; }
        .record-layout { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(300px, .75fr); gap: 16px; margin-top: 18px; }
        .record-hero { padding: 20px; border-radius: 15px; border: 1px solid rgba(91, 198, 255, .20); background: linear-gradient(145deg, rgba(20, 74, 107, .18), rgba(66, 43, 123, .12)); }
        .record-hero h3 { font-size: 23px; margin: 8px 0; }
        .record-hero p { color: #8fa1b8; line-height: 1.55; }
        .record-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; margin-top: 18px; }
        .record-meta div { border: 1px solid rgba(255,255,255,.07); background: rgba(255,255,255,.025); border-radius: 10px; padding: 10px; }
        .record-meta span, .record-meta strong { display: block; }
        .record-meta span { color: #788ba4; font-size: 9px; text-transform: uppercase; letter-spacing: .08em; }
        .record-meta strong { margin-top: 4px; font-size: 11px; }
        .detail-stack { display: grid; gap: 14px; }
        .chip-list { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 12px; }
        .chip { padding: 6px 9px; border-radius: 8px; background: rgba(255,255,255,.045); border: 1px solid rgba(255,255,255,.07); color: #b8c6d8; font-size: 10px; }
        .progress { height: 8px; border-radius: 999px; background: rgba(255,255,255,.07); overflow: hidden; }
        .progress > span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #2db2dd, #735de0); }
        .action-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
        .event-list { display: grid; gap: 10px; }
        .event { position: relative; padding: 14px 14px 14px 44px; border: 1px solid rgba(255,255,255,.07); border-radius: 12px; background: rgba(255,255,255,.02); }
        .event:before { content: ""; position: absolute; left: 18px; top: 18px; width: 9px; height: 9px; border-radius: 50%; background: #54c9ff; box-shadow: 0 0 0 5px rgba(84, 201, 255, .10); }
        .event strong { font-size: 12px; }
        .event p { color: #899ab1; margin: 6px 0; font-size: 11px; line-height: 1.5; }
        .event small { color: #6e8199; }
        .verify-box { max-width: 760px; margin: 28px auto; text-align: center; padding: 28px; border: 1px solid rgba(85, 202, 255, .22); border-radius: 17px; background: radial-gradient(circle at 50% 0%, rgba(48, 142, 194, .13), transparent 55%), rgba(255,255,255,.02); }
        .verify-box h3 { font-size: 27px; margin: 8px 0; }
        .verify-box p { color: #91a2ba; line-height: 1.6; }
        .verify-form { display: grid; grid-template-columns: 1fr auto; gap: 9px; margin-top: 20px; }
        .verification-message { margin-top: 14px; padding: 12px; border-radius: 10px; background: rgba(58, 168, 218, .10); color: #d7f3ff; font-size: 12px; }
        .report-card { min-height: 190px; display: flex; flex-direction: column; }
        .report-card .button { margin-top: auto; align-self: flex-start; }
        .empty-state { padding: 60px 24px; text-align: center; color: #8496ae; }
        .empty-icon { font-size: 32px; color: #62cfff; }
        .empty-state h3 { color: white; margin: 10px 0 6px; }
        .page-footer { position: relative; z-index: 2; border-top: 1px solid rgba(143, 173, 211, .13); padding: 26px clamp(20px, 5vw, 70px); display: flex; justify-content: space-between; gap: 24px; color: #7f91aa; font-size: 11px; background: rgba(3, 7, 16, .55); }
        .page-footer strong, .page-footer span { display: block; }
        .page-footer strong { color: #c8d4e2; margin-bottom: 4px; }
        .footer-links { display: flex; gap: 18px; flex-wrap: wrap; }
        .footer-links a:hover { color: white; }
        @media (max-width: 1120px) {
          .topnav { display: none; }
          .hero { grid-template-columns: 1fr; align-items: start; }
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
          .workspace { grid-template-columns: 1fr; }
          .sidebar { position: static; }
          .tab-list { grid-template-columns: repeat(3, 1fr); }
          .record-layout { grid-template-columns: 1fr; }
          .panel-grid.three { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 720px) {
          .topbar { flex-wrap: wrap; }
          .brand { flex: 1; }
          .hero { padding-top: 42px; }
          .metrics-grid { grid-template-columns: 1fr; }
          .tab-list { grid-template-columns: 1fr 1fr; }
          .toolbar { grid-template-columns: 1fr; }
          .panel-grid, .panel-grid.three, .form-grid { grid-template-columns: 1fr; }
          .record-meta { grid-template-columns: 1fr 1fr; }
          .section-header { flex-direction: column; }
          .section-actions { justify-content: flex-start; }
          .verify-form { grid-template-columns: 1fr; }
          .page-footer { flex-direction: column; }
        }
      `}</style>
    </main>
  );
}

function OverviewTab({
  state,
  holderById,
  programById,
  onOpen,
  onVerify,
}: {
  state: WorkspaceState;
  holderById: Record<string, Holder>;
  programById: Record<string, CredentialProgram>;
  onOpen: (id: string) => void;
  onVerify: () => void;
}) {
  const actionItems = state.credentials.filter((item) =>
    ["Pending Review", "Renewal Due", "Suspended", "Conditional"].includes(item.status),
  );
  return (
    <>
      <SectionHeader
        eyebrow="Registry command view"
        title="Credential standing at a glance"
        description="A single institutional view of issuance, standing, verification activity, evidence completeness, and the records that require a governed decision."
        actions={<button className="button primary" onClick={onVerify}>Verify a credential</button>}
      />
      <div className="panel-grid three">
        <article className="panel">
          <div className="panel-head"><div><h3>Current standing</h3><p>Credential population by registry status.</p></div><Badge tone="green">Live</Badge></div>
          <div className="list">
            {(["Active", "Pending Review", "Renewal Due", "Suspended", "Revoked"] as CredentialStatus[]).map((status) => (
              <div className="list-row" key={status}><div><strong>{status}</strong><span>Registry records</span></div><strong>{state.credentials.filter((item) => item.status === status).length}</strong></div>
            ))}
          </div>
        </article>
        <article className="panel">
          <div className="panel-head"><div><h3>Evidence health</h3><p>Evidence status across credential records.</p></div><Badge tone="blue">Controlled</Badge></div>
          <div className="list">
            {(["Accepted", "Pending", "Rejected", "Expired"] as EvidenceState[]).map((status) => (
              <div className="list-row" key={status}><div><strong>{status}</strong><span>Evidence items</span></div><strong>{state.evidence.filter((item) => item.state === status).length}</strong></div>
            ))}
          </div>
        </article>
        <article className="panel">
          <div className="panel-head"><div><h3>Verification activity</h3><p>Recent independent registry checks.</p></div><Badge tone="blue">{state.verifications.length}</Badge></div>
          <div className="list">
            {state.verifications.slice(0, 4).map((record) => {
              const credential = state.credentials.find((item) => item.id === record.credentialId);
              return <div className="list-row" key={record.id}><div><strong>{credential?.serial ?? record.credentialId}</strong><span>{record.requester} · {record.method}</span></div><Badge tone={record.result === "Valid" ? "green" : record.result === "Conditional" ? "amber" : "red"}>{record.result}</Badge></div>;
            })}
          </div>
        </article>
      </div>

      <div className="panel" style={{ marginTop: 14 }}>
        <div className="panel-head"><div><h3>Action queue</h3><p>Records that cannot remain unattended because standing, evidence, or authority has changed.</p></div><Badge tone={actionItems.length ? "amber" : "green"}>{actionItems.length} open</Badge></div>
        {actionItems.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Credential</th><th>Holder</th><th>Program</th><th>Status</th><th>Decision</th><th>Condition</th></tr></thead>
              <tbody>{actionItems.map((credential) => (
                <tr key={credential.id} onClick={() => onOpen(credential.id)}>
                  <td><strong>{credential.serial}</strong><small>{credential.id}</small></td>
                  <td><strong>{holderById[credential.holderId]?.name}</strong><small>{holderById[credential.holderId]?.organization}</small></td>
                  <td><strong>{programById[credential.programId]?.title}</strong><small>{programById[credential.programId]?.code}</small></td>
                  <td><Badge tone={statusTone[credential.status]}>{credential.status}</Badge></td>
                  <td><Badge tone={credential.decision === "ALLOW" ? "green" : credential.decision === "HOLD" ? "amber" : credential.decision === "DENY" ? "red" : "blue"}>{credential.decision}</Badge></td>
                  <td>{credential.conditions[0] ?? "No condition recorded"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <EmptyState title="No open standing actions" body="Every credential currently has a resolved and supportable standing." />}
      </div>
    </>
  );
}

function RegistryTab({
  state,
  credentials,
  holderById,
  programById,
  selectedCredentialId,
  query,
  statusFilter,
  programFilter,
  onQuery,
  onStatus,
  onProgram,
  onSelect,
  onExport,
}: {
  state: WorkspaceState;
  credentials: RegistryCredential[];
  holderById: Record<string, Holder>;
  programById: Record<string, CredentialProgram>;
  selectedCredentialId: string;
  query: string;
  statusFilter: CredentialStatus | "All";
  programFilter: string;
  onQuery: (value: string) => void;
  onStatus: (value: CredentialStatus | "All") => void;
  onProgram: (value: string) => void;
  onSelect: (id: string) => void;
  onExport: () => void;
}) {
  const selected = state.credentials.find((credential) => credential.id === selectedCredentialId);
  const holder = selected ? holderById[selected.holderId] : undefined;
  const program = selected ? programById[selected.programId] : undefined;
  const evidence = selected ? state.evidence.filter((item) => item.credentialId === selected.id) : [];
  const events = selected ? state.events.filter((item) => item.credentialId === selected.id) : [];
  return (
    <>
      <SectionHeader eyebrow="Authoritative register" title="Credential records" description="Search the complete credential population and inspect the holder, program, evidence, scope, standing, and event continuity behind each registry result." actions={<button className="button ghost" onClick={onExport}>Export filtered CSV</button>} />
      <div className="toolbar">
        <input className="input" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search serial, holder, organization, or program" />
        <select className="select" value={statusFilter} onChange={(event) => onStatus(event.target.value as CredentialStatus | "All")}><option>All</option>{Object.keys(statusTone).map((status) => <option key={status}>{status}</option>)}</select>
        <select className="select" value={programFilter} onChange={(event) => onProgram(event.target.value)}><option value="All">All programs</option>{state.programs.map((item) => <option key={item.id} value={item.id}>{item.code} · {item.title}</option>)}</select>
        <span className="button ghost">{credentials.length} record(s)</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Credential</th><th>Holder</th><th>Program</th><th>Standing</th><th>Validity</th><th>Evidence</th><th>Verification</th></tr></thead>
          <tbody>{credentials.map((credential) => (
            <tr key={credential.id} className={credential.id === selectedCredentialId ? "selected" : ""} onClick={() => onSelect(credential.id)}>
              <td><strong>{credential.serial}</strong><small>{credential.id}</small></td>
              <td><strong>{holderById[credential.holderId]?.name}</strong><small>{holderById[credential.holderId]?.organization}</small></td>
              <td><strong>{programById[credential.programId]?.code}</strong><small>{programById[credential.programId]?.title}</small></td>
              <td><Badge tone={statusTone[credential.status]}>{credential.status}</Badge><small>{credential.decision}</small></td>
              <td><strong>{formatDate(credential.effectiveAt)}</strong><small>to {formatDate(credential.expiresAt)}</small></td>
              <td><strong>{credential.evidenceCount}</strong><small>preserved items</small></td>
              <td><strong>{credential.verificationCount}</strong><small>{credential.publicVerification ? "Public" : "Restricted"}</small></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {selected && holder && program ? (
        <div className="record-layout">
          <div className="detail-stack">
            <article className="record-hero">
              <div className="panel-head"><div><span className="eyebrow">{program.level} credential</span><h3>{program.title}</h3><p>{holder.name} · {holder.organization}</p></div><Badge tone={statusTone[selected.status]}>{selected.status}</Badge></div>
              <div className="record-meta">
                <div><span>Serial</span><strong>{selected.serial}</strong></div>
                <div><span>Decision</span><strong>{selected.decision}</strong></div>
                <div><span>Score</span><strong>{selected.score}%</strong></div>
                <div><span>Issued</span><strong>{formatDate(selected.issuedAt)}</strong></div>
                <div><span>Expires</span><strong>{formatDate(selected.expiresAt)}</strong></div>
                <div><span>Issuer</span><strong>{selected.issuedBy}</strong></div>
              </div>
            </article>
            <article className="panel"><h3>Authorized scope</h3><p>The credential may only be represented within the preserved scope below.</p><div className="chip-list">{selected.scope.map((item) => <span className="chip" key={item}>{item}</span>)}</div></article>
            <article className="panel"><div className="panel-head"><div><h3>Evidence chain</h3><p>Evidence associated with this credential decision.</p></div><Badge tone={evidence.some((item) => item.state === "Pending") ? "amber" : "green"}>{evidence.length} item(s)</Badge></div><div className="list">{evidence.length ? evidence.map((item) => <div className="list-row" key={item.id}><div><strong>{item.title}</strong><span>{item.source} · observed {formatDate(item.observedAt)}</span><small>{item.hash}</small></div><Badge tone={item.state === "Accepted" ? "green" : item.state === "Pending" ? "amber" : "red"}>{item.state}</Badge></div>) : <p>No item-level evidence is attached to this demonstration record.</p>}</div></article>
            <article className="panel"><div className="panel-head"><div><h3>Credential event continuity</h3><p>Attributable actions that changed or confirmed standing.</p></div><Badge tone="blue">{events.length}</Badge></div><div className="event-list">{events.map((event) => <div className="event" key={event.id}><strong>{event.type}: {event.previousStatus} → {event.nextStatus}</strong><p>{event.detail}</p><small>{formatDate(event.at)} · {event.actor} · {event.authority}</small></div>)}</div></article>
          </div>
          <div className="detail-stack">
            <article className="panel"><h3>Holder record</h3><div className="list"><div className="list-row"><div><strong>{holder.name}</strong><span>{holder.email}</span></div><Badge tone={holder.standing === "Good" ? "green" : holder.standing === "Conditional" ? "amber" : "red"}>{holder.standing}</Badge></div><div className="list-row"><div><strong>{holder.organization}</strong><span>{holder.jurisdiction}</span></div></div><div className="list-row"><div><strong>{holder.learnerId}</strong><span>Academy learner identifier</span></div></div></div></article>
            <article className="panel"><h3>Program definition</h3><p>{program.description}</p><div className="list" style={{ marginTop: 12 }}><div className="list-row"><div><strong>{program.code} v{program.version}</strong><span>{program.level} · {program.status}</span></div></div><div className="list-row"><div><strong>{program.validityMonths} months</strong><span>Credential validity</span></div></div><div className="list-row"><div><strong>{program.minimumScore}%</strong><span>Minimum assessment threshold</span></div></div></div></article>
            <article className="panel"><h3>Conditions and limitations</h3>{selected.conditions.length ? <div className="list">{selected.conditions.map((condition) => <div className="list-row" key={condition}><div><strong>{condition}</strong><span>Must remain visible while applicable.</span></div><Badge tone="amber">Open</Badge></div>)}</div> : <p>No open credential conditions are recorded.</p>}</article>
            <article className="panel"><h3>Registry representation</h3><p>{selected.publicVerification ? "This record is available through public verification. Standing, scope, dates, and limitations may be returned to an independent requester." : "Public verification is restricted. Authorized institutional review is required."}</p><div className="action-row"><Badge tone={selected.publicVerification ? "green" : "amber"}>{selected.publicVerification ? "Public" : "Restricted"}</Badge><Badge tone="blue">{selected.verificationCount} checks</Badge></div></article>
          </div>
        </div>
      ) : <EmptyState title="No credential selected" body="Select a registry row to inspect the complete record." />}
    </>
  );
}

function HoldersTab({ state, showForm, onToggleForm, onCreate, onOpenCredential }: { state: WorkspaceState; holderById: Record<string, Holder>; programById: Record<string, CredentialProgram>; showForm: boolean; onToggleForm: () => void; onCreate: (holder: Holder) => void; onOpenCredential: (id: string) => void; }) {
  return <><SectionHeader eyebrow="Credential population" title="Holders and learner identities" description="Preserve the identity, organization, jurisdiction, learner record, and current standing associated with every credential holder." actions={<button className="button primary" onClick={onToggleForm}>{showForm ? "Close form" : "Add holder"}</button>} />{showForm ? <HolderForm onCreate={onCreate} /> : null}<div className="panel-grid">{state.holders.map((holder) => { const credentials = state.credentials.filter((item) => item.holderId === holder.id); return <article className="panel" key={holder.id}><div className="panel-head"><div><span className="eyebrow">{holder.learnerId}</span><h3>{holder.name}</h3><p>{holder.organization} · {holder.jurisdiction}</p></div><Badge tone={holder.standing === "Good" ? "green" : holder.standing === "Conditional" ? "amber" : "red"}>{holder.standing}</Badge></div><div className="list"><div className="list-row"><div><strong>{holder.email}</strong><span>Primary contact</span></div></div><div className="list-row"><div><strong>{credentials.length} credential record(s)</strong><span>Across all program versions</span></div></div></div><div className="chip-list">{credentials.map((credential) => <button key={credential.id} className="chip" onClick={() => onOpenCredential(credential.id)}>{credential.serial} · {credential.status}</button>)}</div><p style={{ marginTop: 12 }}>{holder.notes}</p></article>; })}</div></>;
}

function HolderForm({ onCreate }: { onCreate: (holder: Holder) => void }) {
  const [form, setForm] = useState({ name: "", email: "", organization: "", jurisdiction: "United States", standing: "Good" as Holder["standing"], notes: "" });
  function submit(event: FormEvent) { event.preventDefault(); onCreate({ id: makeId("HLD"), learnerId: `LRN-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`, joinedAt: new Date().toISOString().slice(0, 10), ...form }); }
  return <form className="form-panel" onSubmit={submit}><div className="form-grid"><Field label="Full name"><input required className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field><Field label="Email"><input required type="email" className="input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field><Field label="Organization"><input required className="input" value={form.organization} onChange={(event) => setForm({ ...form, organization: event.target.value })} /></Field><Field label="Jurisdiction"><input required className="input" value={form.jurisdiction} onChange={(event) => setForm({ ...form, jurisdiction: event.target.value })} /></Field><Field label="Standing"><select className="select" value={form.standing} onChange={(event) => setForm({ ...form, standing: event.target.value as Holder["standing"] })}><option>Good</option><option>Conditional</option><option>Restricted</option><option>Inactive</option></select></Field><Field label="Notes"><input className="input" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></Field></div><div className="form-actions"><button className="button primary" type="submit">Create holder record</button></div></form>;
}

function ProgramsTab({ programs, credentials, showForm, onToggleForm, onCreate }: { programs: CredentialProgram[]; credentials: RegistryCredential[]; showForm: boolean; onToggleForm: () => void; onCreate: (program: CredentialProgram) => void; }) {
  return <><SectionHeader eyebrow="Credential architecture" title="Program-to-credential definitions" description="Control the version, eligibility requirements, validity period, competencies, and issuing authority behind every credential family." actions={<button className="button primary" onClick={onToggleForm}>{showForm ? "Close form" : "New program"}</button>} />{showForm ? <ProgramForm onCreate={onCreate} /> : null}<div className="panel-grid">{programs.map((program) => <article className="panel" key={program.id}><div className="panel-head"><div><span className="eyebrow">{program.code} · v{program.version}</span><h3>{program.title}</h3><p>{program.description}</p></div><Badge tone={program.status === "Active" ? "green" : program.status === "Draft" ? "amber" : "slate"}>{program.status}</Badge></div><div className="record-meta"><div><span>Level</span><strong>{program.level}</strong></div><div><span>Validity</span><strong>{program.validityMonths} months</strong></div><div><span>Minimum score</span><strong>{program.minimumScore}%</strong></div><div><span>Renewal window</span><strong>{program.renewalWindowDays} days</strong></div><div><span>Issued records</span><strong>{credentials.filter((item) => item.programId === program.id).length}</strong></div><div><span>Authority</span><strong>{program.issuingAuthority}</strong></div></div><h3 style={{ marginTop: 18 }}>Credential requirements</h3><div className="list">{program.requirements.map((requirement, index) => <div className="list-row" key={requirement}><div><strong>{index + 1}. {requirement}</strong><span>Required before issuance or renewal.</span></div></div>)}</div><div className="chip-list">{program.competencies.map((item) => <span className="chip" key={item}>{item}</span>)}</div></article>)}</div></>;
}

function ProgramForm({ onCreate }: { onCreate: (program: CredentialProgram) => void }) {
  const [form, setForm] = useState({ code: "", title: "", level: "Professional", version: "1.0", status: "Draft" as CredentialProgram["status"], validityMonths: 12, renewalWindowDays: 45, minimumScore: 85, issuingAuthority: "TA-14 Academy Credential Council", description: "", requirements: "", competencies: "" });
  function submit(event: FormEvent) { event.preventDefault(); onCreate({ id: makeId("PRG"), ...form, requirements: form.requirements.split("\n").map((item) => item.trim()).filter(Boolean), competencies: form.competencies.split("\n").map((item) => item.trim()).filter(Boolean) }); }
  return <form className="form-panel" onSubmit={submit}><div className="form-grid"><Field label="Program code"><input required className="input" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} /></Field><Field label="Title"><input required className="input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></Field><Field label="Level"><input className="input" value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })} /></Field><Field label="Version"><input className="input" value={form.version} onChange={(event) => setForm({ ...form, version: event.target.value })} /></Field><Field label="Validity months"><input type="number" className="input" value={form.validityMonths} onChange={(event) => setForm({ ...form, validityMonths: Number(event.target.value) })} /></Field><Field label="Renewal window days"><input type="number" className="input" value={form.renewalWindowDays} onChange={(event) => setForm({ ...form, renewalWindowDays: Number(event.target.value) })} /></Field><Field label="Minimum score"><input type="number" className="input" value={form.minimumScore} onChange={(event) => setForm({ ...form, minimumScore: Number(event.target.value) })} /></Field><Field label="Issuing authority"><input className="input" value={form.issuingAuthority} onChange={(event) => setForm({ ...form, issuingAuthority: event.target.value })} /></Field><Field label="Description"><textarea className="textarea" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field><Field label="Requirements" hint="One requirement per line"><textarea className="textarea" value={form.requirements} onChange={(event) => setForm({ ...form, requirements: event.target.value })} /></Field><Field label="Competencies" hint="One competency per line"><textarea className="textarea" value={form.competencies} onChange={(event) => setForm({ ...form, competencies: event.target.value })} /></Field><Field label="Status"><select className="select" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as CredentialProgram["status"] })}><option>Draft</option><option>Active</option><option>Retired</option></select></Field></div><div className="form-actions"><button className="button primary" type="submit">Create program definition</button></div></form>;
}

function IssuanceTab({ state, showForm, onToggleForm, onIssue, onOpen }: { state: WorkspaceState; showForm: boolean; onToggleForm: () => void; onIssue: (credential: RegistryCredential, event: RegistryEvent) => void; onOpen: (id: string) => void; }) {
  const candidates = state.credentials.filter((item) => item.status === "Pending Review" || item.status === "Draft");
  return <><SectionHeader eyebrow="Controlled issuance" title="Credential issuance workspace" description="A credential does not become active merely because a learner completed a course. Issuance requires a current program rule, attributable evidence, valid authority, and a recorded decision." actions={<button className="button primary" onClick={onToggleForm}>{showForm ? "Close form" : "Create credential candidate"}</button>} />{showForm ? <IssueForm state={state} onIssue={onIssue} /> : null}<div className="panel-grid"><article className="panel"><h3>Issuance gate</h3><p>Every credential candidate must pass each gate before the final status can become Active.</p><div className="list" style={{ marginTop: 12 }}>{["Holder identity is attributable and current", "Program version is active", "Required learning and assessment evidence is complete", "Evidence is accepted and within its validity period", "Issuing authority is valid for this credential family", "Scope and conditions are explicitly preserved", "Decision memorandum is recorded before publication"].map((item, index) => <div className="list-row" key={item}><div><strong>{index + 1}. {item}</strong><span>Unresolved conditions require HOLD or ESCALATE.</span></div><Badge tone="blue">Gate</Badge></div>)}</div></article><article className="panel"><div className="panel-head"><div><h3>Candidate queue</h3><p>Credential records awaiting a final issuance decision.</p></div><Badge tone={candidates.length ? "amber" : "green"}>{candidates.length}</Badge></div><div className="list">{candidates.length ? candidates.map((credential) => <button className="list-row" key={credential.id} onClick={() => onOpen(credential.id)} style={{ width: "100%", background: "none", borderLeft: 0, borderRight: 0, borderTop: 0, color: "inherit", textAlign: "left", cursor: "pointer" }}><div><strong>{credential.serial}</strong><span>{state.holders.find((holder) => holder.id === credential.holderId)?.name} · {state.programs.find((program) => program.id === credential.programId)?.title}</span></div><Badge tone="amber">{credential.decision}</Badge></button>) : <p>No candidate records are awaiting review.</p>}</div></article></div></>;
}

function IssueForm({ state, onIssue }: { state: WorkspaceState; onIssue: (credential: RegistryCredential, event: RegistryEvent) => void }) {
  const [holderId, setHolderId] = useState(state.holders[0]?.id ?? "");
  const [programId, setProgramId] = useState(state.programs[0]?.id ?? "");
  const [score, setScore] = useState(0);
  const [decision, setDecision] = useState<Decision>("HOLD");
  const [scope, setScope] = useState("");
  const [conditions, setConditions] = useState("");
  const [notes, setNotes] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); const program = state.programs.find((item) => item.id === programId); const year = new Date().getFullYear(); const serial = `${program?.code ?? "TA14-CRD"}-${year}-${String(state.credentials.length + 1).padStart(5, "0")}`; const active = decision === "ALLOW"; const issued = new Date().toISOString().slice(0, 10); const expires = new Date(); expires.setMonth(expires.getMonth() + (program?.validityMonths ?? 12)); const credential: RegistryCredential = { id: makeId("CRD"), serial, holderId, programId, status: active ? "Active" : "Pending Review", decision, issuedAt: active ? issued : "", effectiveAt: active ? issued : "", expiresAt: active ? expires.toISOString().slice(0, 10) : "", renewedAt: "", suspendedAt: "", revokedAt: "", issuer: "TA-14 Academy", issuedBy: program?.issuingAuthority ?? "Credential Council", score, evidenceCount: 0, verificationCount: 0, publicVerification: active, conditions: conditions.split("\n").map((item) => item.trim()).filter(Boolean), scope: scope.split("\n").map((item) => item.trim()).filter(Boolean), notes }; const registryEvent: RegistryEvent = { id: makeId("EVT"), credentialId: credential.id, type: active ? "Issued" : "Created", at: new Date().toISOString(), actor: "Registry Administrator", authority: program?.issuingAuthority ?? "Credential Council", detail: active ? "Credential issued through the controlled issuance workspace." : "Credential candidate created with unresolved issuance conditions.", previousStatus: "None", nextStatus: credential.status }; onIssue(credential, registryEvent); }
  return <form className="form-panel" onSubmit={submit}><div className="form-grid"><Field label="Credential holder"><select className="select" value={holderId} onChange={(event) => setHolderId(event.target.value)}>{state.holders.map((holder) => <option key={holder.id} value={holder.id}>{holder.name} · {holder.learnerId}</option>)}</select></Field><Field label="Credential program"><select className="select" value={programId} onChange={(event) => setProgramId(event.target.value)}>{state.programs.filter((program) => program.status !== "Retired").map((program) => <option key={program.id} value={program.id}>{program.code} · {program.title} v{program.version}</option>)}</select></Field><Field label="Assessment score"><input className="input" type="number" min="0" max="100" value={score} onChange={(event) => setScore(Number(event.target.value))} /></Field><Field label="Issuance decision"><select className="select" value={decision} onChange={(event) => setDecision(event.target.value as Decision)}><option>ALLOW</option><option>HOLD</option><option>DENY</option><option>ESCALATE</option></select></Field><Field label="Authorized scope" hint="One scope item per line"><textarea className="textarea" value={scope} onChange={(event) => setScope(event.target.value)} /></Field><Field label="Conditions" hint="One condition per line"><textarea className="textarea" value={conditions} onChange={(event) => setConditions(event.target.value)} /></Field><div className="wide"><Field label="Decision notes"><textarea className="textarea" value={notes} onChange={(event) => setNotes(event.target.value)} /></Field></div></div><div className="form-actions"><button className="button primary" type="submit">Record issuance decision</button></div></form>;
}

function VerificationTab({ state, holderById, programById, verificationInput, verificationMessage, onInput, onVerify, onOpen }: { state: WorkspaceState; holderById: Record<string, Holder>; programById: Record<string, CredentialProgram>; verificationInput: string; verificationMessage: string; onInput: (value: string) => void; onVerify: (event: FormEvent<HTMLFormElement>) => void; onOpen: (id: string) => void; }) {
  return <><SectionHeader eyebrow="Independent verification" title="Verify credential standing" description="A verification result reflects the current registry record, including conditions, suspension, revocation, expiration, and the scope that may be represented." /><div className="verify-box"><span className="eyebrow">Public and institutional check</span><h3>Enter a credential serial or registry ID</h3><p>Try TA14-EAF-2026-00041, TA14-GER-2025-00008, or TA14-RVA-2026-00026.</p><form className="verify-form" onSubmit={onVerify}><input className="input" value={verificationInput} onChange={(event) => onInput(event.target.value)} placeholder="Credential serial or CRD identifier" /><button className="button primary" type="submit">Verify standing</button></form>{verificationMessage ? <div className="verification-message">{verificationMessage}</div> : null}</div><div className="panel"><div className="panel-head"><div><h3>Verification log</h3><p>Every check is preserved as a registry event without exposing private evidence.</p></div><Badge tone="blue">{state.verifications.length}</Badge></div><div className="table-wrap"><table><thead><tr><th>Credential</th><th>Holder</th><th>Program</th><th>Requester</th><th>Method</th><th>Result</th><th>Time</th></tr></thead><tbody>{state.verifications.map((record) => { const credential = state.credentials.find((item) => item.id === record.credentialId); return <tr key={record.id} onClick={() => credential && onOpen(credential.id)}><td><strong>{credential?.serial ?? record.credentialId}</strong><small>{record.purpose}</small></td><td>{credential ? holderById[credential.holderId]?.name : "Unknown"}</td><td>{credential ? programById[credential.programId]?.code : "Unknown"}</td><td>{record.requester}</td><td>{record.method}</td><td><Badge tone={record.result === "Valid" ? "green" : record.result === "Conditional" ? "amber" : "red"}>{record.result}</Badge></td><td>{formatDate(record.at)}</td></tr>; })}</tbody></table></div></div></>;
}

function StandingTab({ credentials, holderById, programById, onAction, onOpen }: { credentials: RegistryCredential[]; holderById: Record<string, Holder>; programById: Record<string, CredentialProgram>; onAction: (credential: RegistryCredential, action: "activate" | "suspend" | "reinstate" | "revoke" | "renew") => void; onOpen: (id: string) => void; }) {
  const managed = credentials.filter((item) => item.status !== "Draft");
  return <><SectionHeader eyebrow="Continuing standing" title="Renewal, suspension, reinstatement, and revocation" description="Credential standing changes must be controlled before the public record changes. Every action below creates an attributable event and preserves the prior state." /><div className="panel-grid">{managed.map((credential) => <article className="panel" key={credential.id}><div className="panel-head"><div><span className="eyebrow">{programById[credential.programId]?.code}</span><h3>{holderById[credential.holderId]?.name}</h3><p>{credential.serial}</p></div><Badge tone={statusTone[credential.status]}>{credential.status}</Badge></div><div className="list"><div className="list-row"><div><strong>{programById[credential.programId]?.title}</strong><span>Expires {formatDate(credential.expiresAt)}</span></div></div><div className="list-row"><div><strong>Decision: {credential.decision}</strong><span>{credential.conditions[0] ?? "No open condition"}</span></div></div></div><div className="action-row"><button className="button ghost" onClick={() => onOpen(credential.id)}>Open record</button>{credential.status === "Pending Review" || credential.status === "Conditional" ? <button className="button primary" onClick={() => onAction(credential, "activate")}>Activate</button> : null}{credential.status === "Active" || credential.status === "Renewal Due" ? <button className="button warn" onClick={() => onAction(credential, "suspend")}>Suspend</button> : null}{credential.status === "Suspended" ? <button className="button primary" onClick={() => onAction(credential, "reinstate")}>Reinstate</button> : null}{credential.status === "Renewal Due" ? <button className="button primary" onClick={() => onAction(credential, "renew")}>Renew</button> : null}{credential.status !== "Revoked" ? <button className="button danger" onClick={() => onAction(credential, "revoke")}>Revoke</button> : null}</div></article>)}</div></>;
}

function AuditTab({ events, credentials, holderById, programById, onExport }: { events: RegistryEvent[]; credentials: RegistryCredential[]; holderById: Record<string, Holder>; programById: Record<string, CredentialProgram>; onExport: () => void; }) {
  return <><SectionHeader eyebrow="Immutable continuity" title="Credential event and decision history" description="The registry preserves who acted, under what authority, what changed, and the state transition that followed." actions={<button className="button ghost" onClick={onExport}>Export audit CSV</button>} /><div className="event-list">{events.map((event) => { const credential = credentials.find((item) => item.id === event.credentialId); return <article className="event" key={event.id}><div className="panel-head"><div><strong>{event.type}: {event.previousStatus} → {event.nextStatus}</strong><p>{event.detail}</p></div><Badge tone={event.type === "Revoked" || event.type === "Suspended" ? "red" : event.type === "Renewed" || event.type === "Issued" || event.type === "Reinstated" ? "green" : "blue"}>{event.type}</Badge></div><small>{formatDate(event.at)} · {event.actor} · {event.authority}</small>{credential ? <div className="chip-list"><span className="chip">{credential.serial}</span><span className="chip">{holderById[credential.holderId]?.name}</span><span className="chip">{programById[credential.programId]?.code}</span></div> : null}</article>; })}</div></>;
}

function ReportsTab({ state, holderById, programById, onExportJson, onExportCredentials, onExportVerifications }: { state: WorkspaceState; holderById: Record<string, Holder>; programById: Record<string, CredentialProgram>; onExportJson: () => void; onExportCredentials: () => void; onExportVerifications: () => void; }) {
  const standing = Object.keys(statusTone).map((status) => ({ status, count: state.credentials.filter((item) => item.status === status).length }));
  const byProgram = state.programs.map((program) => ({ program, count: state.credentials.filter((item) => item.programId === program.id).length }));
  return <><SectionHeader eyebrow="Registry intelligence" title="Reporting and institutional exports" description="Create controlled extracts for credential populations, standing actions, public verification, program performance, and registry audit review." /><div className="panel-grid three"><article className="panel report-card"><h3>Complete workspace</h3><p>Export all programs, holders, credentials, evidence, events, and verification records as a portable JSON workspace.</p><button className="button primary" onClick={onExportJson}>Export JSON</button></article><article className="panel report-card"><h3>Credential population</h3><p>Export the current credential register for administrative review, archival, or controlled analysis.</p><button className="button ghost" onClick={onExportCredentials}>Export credentials CSV</button></article><article className="panel report-card"><h3>Verification activity</h3><p>Export verification records to inspect requester patterns, results, methods, and purposes.</p><button className="button ghost" onClick={onExportVerifications}>Export verifications CSV</button></article></div><div className="panel-grid" style={{ marginTop: 14 }}><article className="panel"><h3>Standing distribution</h3><div className="list">{standing.map((row) => <div className="list-row" key={row.status}><div><strong>{row.status}</strong><span>Credential records</span></div><strong>{row.count}</strong></div>)}</div></article><article className="panel"><h3>Program issuance distribution</h3><div className="list">{byProgram.map(({ program, count }) => <div className="list-row" key={program.id}><div><strong>{program.code} · {program.title}</strong><span>{program.level} · v{program.version}</span></div><strong>{count}</strong></div>)}</div></article></div><div className="panel" style={{ marginTop: 14 }}><h3>Institutional registry summary</h3><p>This workspace currently preserves {state.credentials.length} credential records across {state.programs.length} program definitions and {state.holders.length} holders. {state.credentials.filter((item) => item.publicVerification).length} records permit public verification. {state.credentials.filter((item) => ["Suspended", "Revoked"].includes(item.status)).length} records return a non-current standing. {state.evidence.filter((item) => item.state === "Pending").length} evidence items remain unresolved.</p><div className="chip-list">{state.credentials.slice(0, 6).map((credential) => <span className="chip" key={credential.id}>{credential.serial} · {holderById[credential.holderId]?.name} · {programById[credential.programId]?.code}</span>)}</div></div></>;
}
