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

type Tab =
  | "overview"
  | "organizations"
  | "structure"
  | "people"
  | "programs"
  | "policies"
  | "compliance"
  | "reports"
  | "audit";

type OrganizationStatus =
  | "ACTIVE"
  | "WATCH"
  | "HOLD"
  | "ONBOARDING";

type SeatStatus =
  | "ASSIGNED"
  | "AVAILABLE"
  | "PENDING"
  | "SUSPENDED";

type ProgramStatus =
  | "HEALTHY"
  | "ATTENTION"
  | "HOLD"
  | "COMPLETE";

type FindingSeverity =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW";

type FindingState =
  | "OPEN"
  | "IN_REVIEW"
  | "CLOSED";

type PolicyState =
  | "DRAFT"
  | "ISSUED"
  | "ACKNOWLEDGMENT_DUE"
  | "SUPERSEDED";

type Role =
  | "Enterprise Admin"
  | "Instructor"
  | "Reviewer"
  | "Learner";

type Modal =
  | "NONE"
  | "ADD_ORGANIZATION"
  | "ADD_PERSON"
  | "ASSIGN_PROGRAM"
  | "ISSUE_POLICY"
  | "CREATE_FINDING"
  | "CONFIRM_HOLD";

type Organization = {
  id: string;
  name: string;
  legalName: string;
  sector: string;
  region: string;
  status: OrganizationStatus;
  campuses: number;
  departments: number;
  seats: number;
  assigned: number;
  learners: number;
  instructors: number;
  completion: number;
  compliance: number;
  renewal: string;
  owner: string;
  authorityRecord: string;
  evidenceCurrent: boolean;
};

type Campus = {
  id: string;
  organizationId: string;
  name: string;
  location: string;
  authorityOwner: string;
  departments: number;
  learners: number;
  compliance: number;
  status: "ACTIVE" | "WATCH" | "HOLD";
};

type Department = {
  id: string;
  campusId: string;
  organizationId: string;
  name: string;
  manager: string;
  learners: number;
  instructors: number;
  requiredPrograms: number;
  completion: number;
};

type Person = {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  campusId: string;
  departmentId: string;
  role: Role;
  seat: SeatStatus;
  programs: number;
  completion: number;
  lastActive: string;
  authorityExpires: string;
};

type Program = {
  id: string;
  name: string;
  organizationId: string;
  owner: string;
  status: ProgramStatus;
  enrolled: number;
  instructors: number;
  completion: number;
  passRate: number;
  start: string;
  end: string;
  mandatory: boolean;
};

type Policy = {
  id: string;
  title: string;
  organizationId: string;
  version: string;
  state: PolicyState;
  issued: string;
  effective: string;
  audience: string;
  acknowledgments: number;
  required: number;
  owner: string;
};

type Finding = {
  id: string;
  organizationId: string;
  title: string;
  severity: FindingSeverity;
  owner: string;
  due: string;
  state: FindingState;
  correctiveAction: string;
  evidence: string;
};

type AuditEvent = {
  id: string;
  timestamp: string;
  actor: string;
  organizationId: string;
  action: string;
  object: string;
  result: "COMMITTED" | "HELD" | "DENIED" | "ESCALATED";
  evidence: string;
};

type PersistedState = {
  activeTab: Tab;
  search: string;
  organizationFilter: "ALL" | OrganizationStatus;
  personRoleFilter: "ALL" | Role;
  selectedOrganizationId: string;
  selectedCampusId: string;
  selectedPersonId: string;
  selectedProgramId: string;
  notes: Record<string, string>;
  organizations: Organization[];
  people: Person[];
  policies: Policy[];
  findings: Finding[];
};

const STORAGE_KEY = "ta14-academy-enterprise-management-v2";

const initialOrganizations: Organization[] = [
  {
    id: "ORG-101",
    name: "Northstar Operations",
    legalName: "Northstar Operations Group, Inc.",
    sector: "Industrial Operations",
    region: "United States",
    status: "ACTIVE",
    campuses: 4,
    departments: 11,
    seats: 240,
    assigned: 198,
    learners: 176,
    instructors: 14,
    completion: 78,
    compliance: 94,
    renewal: "Dec 19, 2026",
    owner: "Maya Chen",
    authorityRecord: "AUTH-NSO-2026-04",
    evidenceCurrent: true,
  },
  {
    id: "ORG-102",
    name: "Civic Systems Group",
    legalName: "Civic Systems Group, LLC",
    sector: "Public Services",
    region: "United States",
    status: "WATCH",
    campuses: 7,
    departments: 18,
    seats: 420,
    assigned: 391,
    learners: 358,
    instructors: 21,
    completion: 66,
    compliance: 82,
    renewal: "Oct 2, 2026",
    owner: "Elena Morales",
    authorityRecord: "AUTH-CSG-2026-11",
    evidenceCurrent: true,
  },
  {
    id: "ORG-103",
    name: "Harborline Health",
    legalName: "Harborline Health Network",
    sector: "Healthcare",
    region: "North America",
    status: "ACTIVE",
    campuses: 9,
    departments: 26,
    seats: 650,
    assigned: 588,
    learners: 544,
    instructors: 32,
    completion: 84,
    compliance: 97,
    renewal: "Feb 11, 2027",
    owner: "David Okafor",
    authorityRecord: "AUTH-HLH-2026-09",
    evidenceCurrent: true,
  },
  {
    id: "ORG-104",
    name: "Polar Ridge Finance",
    legalName: "Polar Ridge Financial Services PLC",
    sector: "Financial Services",
    region: "European Union",
    status: "HOLD",
    campuses: 3,
    departments: 8,
    seats: 180,
    assigned: 172,
    learners: 151,
    instructors: 9,
    completion: 51,
    compliance: 71,
    renewal: "Sep 8, 2026",
    owner: "Sofia Lind",
    authorityRecord: "AUTH-PRF-2025-18",
    evidenceCurrent: false,
  },
  {
    id: "ORG-105",
    name: "Clearpath Energy",
    legalName: "Clearpath Energy Systems, Inc.",
    sector: "Energy",
    region: "United States",
    status: "ONBOARDING",
    campuses: 5,
    departments: 12,
    seats: 300,
    assigned: 116,
    learners: 92,
    instructors: 8,
    completion: 29,
    compliance: 88,
    renewal: "Apr 30, 2027",
    owner: "Marcus Reed",
    authorityRecord: "AUTH-CPE-2026-01",
    evidenceCurrent: true,
  },
  {
    id: "ORG-106",
    name: "Commonwealth Transit",
    legalName: "Commonwealth Transit Authority",
    sector: "Transportation",
    region: "United Kingdom",
    status: "ACTIVE",
    campuses: 6,
    departments: 15,
    seats: 360,
    assigned: 321,
    learners: 294,
    instructors: 17,
    completion: 73,
    compliance: 91,
    renewal: "Jan 15, 2027",
    owner: "Aisha Grant",
    authorityRecord: "AUTH-CWT-2026-07",
    evidenceCurrent: true,
  },
];

const campuses: Campus[] = [
  {
    id: "CAM-101",
    organizationId: "ORG-101",
    name: "Northstar Central",
    location: "Chicago, Illinois",
    authorityOwner: "Maya Chen",
    departments: 4,
    learners: 71,
    compliance: 97,
    status: "ACTIVE",
  },
  {
    id: "CAM-102",
    organizationId: "ORG-101",
    name: "Northstar Gulf",
    location: "Houston, Texas",
    authorityOwner: "Ramon Vega",
    departments: 3,
    learners: 48,
    compliance: 92,
    status: "ACTIVE",
  },
  {
    id: "CAM-201",
    organizationId: "ORG-102",
    name: "Civic East",
    location: "Baltimore, Maryland",
    authorityOwner: "Elena Morales",
    departments: 5,
    learners: 116,
    compliance: 84,
    status: "WATCH",
  },
  {
    id: "CAM-301",
    organizationId: "ORG-103",
    name: "Harborline Medical Center",
    location: "Boston, Massachusetts",
    authorityOwner: "David Okafor",
    departments: 9,
    learners: 212,
    compliance: 98,
    status: "ACTIVE",
  },
  {
    id: "CAM-401",
    organizationId: "ORG-104",
    name: "Polar Ridge EU Operations",
    location: "Frankfurt, Germany",
    authorityOwner: "Sofia Lind",
    departments: 4,
    learners: 88,
    compliance: 69,
    status: "HOLD",
  },
  {
    id: "CAM-501",
    organizationId: "ORG-105",
    name: "Clearpath Launch Campus",
    location: "Denver, Colorado",
    authorityOwner: "Marcus Reed",
    departments: 6,
    learners: 92,
    compliance: 88,
    status: "WATCH",
  },
];

const departments: Department[] = [
  {
    id: "DEP-101",
    campusId: "CAM-101",
    organizationId: "ORG-101",
    name: "Field Operations",
    manager: "Maya Chen",
    learners: 28,
    instructors: 3,
    requiredPrograms: 4,
    completion: 81,
  },
  {
    id: "DEP-102",
    campusId: "CAM-101",
    organizationId: "ORG-101",
    name: "Quality Assurance",
    manager: "Ramon Vega",
    learners: 19,
    instructors: 2,
    requiredPrograms: 5,
    completion: 88,
  },
  {
    id: "DEP-201",
    campusId: "CAM-201",
    organizationId: "ORG-102",
    name: "Public Program Review",
    manager: "Elena Morales",
    learners: 54,
    instructors: 4,
    requiredPrograms: 4,
    completion: 63,
  },
  {
    id: "DEP-301",
    campusId: "CAM-301",
    organizationId: "ORG-103",
    name: "Clinical Governance",
    manager: "David Okafor",
    learners: 81,
    instructors: 7,
    requiredPrograms: 6,
    completion: 91,
  },
  {
    id: "DEP-401",
    campusId: "CAM-401",
    organizationId: "ORG-104",
    name: "Model Risk Review",
    manager: "Sofia Lind",
    learners: 42,
    instructors: 3,
    requiredPrograms: 5,
    completion: 49,
  },
  {
    id: "DEP-501",
    campusId: "CAM-501",
    organizationId: "ORG-105",
    name: "Enterprise Onboarding",
    manager: "Marcus Reed",
    learners: 61,
    instructors: 5,
    requiredPrograms: 3,
    completion: 31,
  },
];

const initialPeople: Person[] = [
  {
    id: "P-1001",
    name: "Maya Chen",
    email: "maya.chen@example.com",
    organizationId: "ORG-101",
    campusId: "CAM-101",
    departmentId: "DEP-101",
    role: "Enterprise Admin",
    seat: "ASSIGNED",
    programs: 4,
    completion: 100,
    lastActive: "12 minutes ago",
    authorityExpires: "Dec 19, 2026",
  },
  {
    id: "P-1002",
    name: "Elena Morales",
    email: "elena.morales@example.com",
    organizationId: "ORG-102",
    campusId: "CAM-201",
    departmentId: "DEP-201",
    role: "Instructor",
    seat: "ASSIGNED",
    programs: 3,
    completion: 94,
    lastActive: "Today",
    authorityExpires: "Oct 2, 2026",
  },
  {
    id: "P-1003",
    name: "Jon Bell",
    email: "jon.bell@example.com",
    organizationId: "ORG-102",
    campusId: "CAM-201",
    departmentId: "DEP-201",
    role: "Learner",
    seat: "ASSIGNED",
    programs: 2,
    completion: 38,
    lastActive: "9 days ago",
    authorityExpires: "Not applicable",
  },
  {
    id: "P-1004",
    name: "Priya Shah",
    email: "priya.shah@example.com",
    organizationId: "ORG-103",
    campusId: "CAM-301",
    departmentId: "DEP-301",
    role: "Reviewer",
    seat: "ASSIGNED",
    programs: 5,
    completion: 100,
    lastActive: "2 hours ago",
    authorityExpires: "Feb 11, 2027",
  },
  {
    id: "P-1005",
    name: "Sofia Lind",
    email: "sofia.lind@example.com",
    organizationId: "ORG-104",
    campusId: "CAM-401",
    departmentId: "DEP-401",
    role: "Enterprise Admin",
    seat: "ASSIGNED",
    programs: 3,
    completion: 87,
    lastActive: "Yesterday",
    authorityExpires: "Sep 8, 2026",
  },
  {
    id: "P-1006",
    name: "Liam Carter",
    email: "liam.carter@example.com",
    organizationId: "ORG-105",
    campusId: "CAM-501",
    departmentId: "DEP-501",
    role: "Learner",
    seat: "PENDING",
    programs: 1,
    completion: 0,
    lastActive: "Invitation sent",
    authorityExpires: "Not applicable",
  },
];

const programs: Program[] = [
  {
    id: "PRG-401",
    name: "Foundation Certification",
    organizationId: "ORG-101",
    owner: "Maya Chen",
    status: "HEALTHY",
    enrolled: 91,
    instructors: 6,
    completion: 82,
    passRate: 94,
    start: "Jul 6, 2026",
    end: "Sep 18, 2026",
    mandatory: true,
  },
  {
    id: "PRG-402",
    name: "Applied Route Review",
    organizationId: "ORG-102",
    owner: "Elena Morales",
    status: "ATTENTION",
    enrolled: 148,
    instructors: 8,
    completion: 61,
    passRate: 79,
    start: "Jun 15, 2026",
    end: "Oct 30, 2026",
    mandatory: true,
  },
  {
    id: "PRG-403",
    name: "Healthcare Governance Operations",
    organizationId: "ORG-103",
    owner: "David Okafor",
    status: "HEALTHY",
    enrolled: 210,
    instructors: 13,
    completion: 86,
    passRate: 96,
    start: "May 4, 2026",
    end: "Nov 20, 2026",
    mandatory: true,
  },
  {
    id: "PRG-404",
    name: "Reviewer Renewal",
    organizationId: "ORG-104",
    owner: "Sofia Lind",
    status: "HOLD",
    enrolled: 72,
    instructors: 4,
    completion: 48,
    passRate: 68,
    start: "Jul 1, 2026",
    end: "Sep 8, 2026",
    mandatory: true,
  },
  {
    id: "PRG-405",
    name: "Enterprise Onboarding",
    organizationId: "ORG-105",
    owner: "Marcus Reed",
    status: "ATTENTION",
    enrolled: 92,
    instructors: 8,
    completion: 29,
    passRate: 88,
    start: "Jul 20, 2026",
    end: "Dec 4, 2026",
    mandatory: true,
  },
];

const initialPolicies: Policy[] = [
  {
    id: "POL-701",
    title: "Execution Authority Validation",
    organizationId: "ORG-101",
    version: "3.2",
    state: "ISSUED",
    issued: "Jul 15, 2026",
    effective: "Aug 1, 2026",
    audience: "All reviewers and instructors",
    acknowledgments: 161,
    required: 176,
    owner: "Maya Chen",
  },
  {
    id: "POL-702",
    title: "Evidence Currency and Revalidation",
    organizationId: "ORG-102",
    version: "2.0",
    state: "ACKNOWLEDGMENT_DUE",
    issued: "Jul 21, 2026",
    effective: "Aug 5, 2026",
    audience: "All governed roles",
    acknowledgments: 214,
    required: 358,
    owner: "Elena Morales",
  },
  {
    id: "POL-703",
    title: "Clinical Route Review Boundary",
    organizationId: "ORG-103",
    version: "5.1",
    state: "ISSUED",
    issued: "Jun 30, 2026",
    effective: "Jul 15, 2026",
    audience: "Clinical governance teams",
    acknowledgments: 521,
    required: 544,
    owner: "David Okafor",
  },
  {
    id: "POL-704",
    title: "Financial Model Execution Hold",
    organizationId: "ORG-104",
    version: "1.4",
    state: "DRAFT",
    issued: "Not issued",
    effective: "Pending review",
    audience: "Model risk reviewers",
    acknowledgments: 0,
    required: 151,
    owner: "Sofia Lind",
  },
];

const initialFindings: Finding[] = [
  {
    id: "F-701",
    organizationId: "ORG-104",
    title: "Reviewer renewal evidence is incomplete",
    severity: "CRITICAL",
    owner: "Sofia Lind",
    due: "Aug 5, 2026",
    state: "OPEN",
    correctiveAction: "Re-establish reviewer authority and submit current evidence.",
    evidence: "EVID-PRF-118",
  },
  {
    id: "F-702",
    organizationId: "ORG-102",
    title: "Instructor-to-learner ratio exceeds policy",
    severity: "HIGH",
    owner: "Elena Morales",
    due: "Aug 14, 2026",
    state: "IN_REVIEW",
    correctiveAction: "Assign two additional qualified instructors.",
    evidence: "EVID-CSG-204",
  },
  {
    id: "F-703",
    organizationId: "ORG-105",
    title: "Campus authority mapping not finalized",
    severity: "MEDIUM",
    owner: "Marcus Reed",
    due: "Aug 21, 2026",
    state: "OPEN",
    correctiveAction: "Complete campus authority records before activation.",
    evidence: "EVID-CPE-031",
  },
  {
    id: "F-704",
    organizationId: "ORG-101",
    title: "Quarterly evidence export completed",
    severity: "LOW",
    owner: "Maya Chen",
    due: "Jul 29, 2026",
    state: "CLOSED",
    correctiveAction: "No further action required.",
    evidence: "EVID-NSO-411",
  },
];

const auditEvents: AuditEvent[] = [
  {
    id: "AUD-9001",
    timestamp: "Jul 30, 2026 · 08:14 EDT",
    actor: "Maya Chen",
    organizationId: "ORG-101",
    action: "Assigned enterprise seat",
    object: "P-1088 · Field Reviewer",
    result: "COMMITTED",
    evidence: "REC-29014",
  },
  {
    id: "AUD-9002",
    timestamp: "Jul 30, 2026 · 07:51 EDT",
    actor: "Sofia Lind",
    organizationId: "ORG-104",
    action: "Requested reviewer renewal",
    object: "Reviewer Authority Cohort",
    result: "HELD",
    evidence: "REC-29007",
  },
  {
    id: "AUD-9003",
    timestamp: "Jul 29, 2026 · 16:42 EDT",
    actor: "Elena Morales",
    organizationId: "ORG-102",
    action: "Issued policy version",
    object: "Evidence Currency and Revalidation v2.0",
    result: "COMMITTED",
    evidence: "REC-28976",
  },
  {
    id: "AUD-9004",
    timestamp: "Jul 29, 2026 · 14:18 EDT",
    actor: "System Governor",
    organizationId: "ORG-105",
    action: "Evaluated campus activation",
    object: "Clearpath Launch Campus",
    result: "ESCALATED",
    evidence: "REC-28951",
  },
  {
    id: "AUD-9005",
    timestamp: "Jul 29, 2026 · 11:06 EDT",
    actor: "David Okafor",
    organizationId: "ORG-103",
    action: "Approved program assignment",
    object: "Healthcare Governance Operations",
    result: "COMMITTED",
    evidence: "REC-28917",
  },
];

const defaultState: PersistedState = {
  activeTab: "overview",
  search: "",
  organizationFilter: "ALL",
  personRoleFilter: "ALL",
  selectedOrganizationId: initialOrganizations[0].id,
  selectedCampusId: campuses[0].id,
  selectedPersonId: initialPeople[0].id,
  selectedProgramId: programs[0].id,
  notes: {},
  organizations: initialOrganizations,
  people: initialPeople,
  policies: initialPolicies,
  findings: initialFindings,
};

function cx(
  ...classes: Array<string | false | null | undefined>
) {
  return classes.filter(Boolean).join(" ");
}

function tone(status: string) {
  if (
    [
      "ACTIVE",
      "HEALTHY",
      "CLOSED",
      "ASSIGNED",
      "ISSUED",
      "COMMITTED",
      "COMPLETE",
    ].includes(status)
  ) {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }

  if (
    [
      "WATCH",
      "ATTENTION",
      "IN_REVIEW",
      "PENDING",
      "ONBOARDING",
      "ACKNOWLEDGMENT_DUE",
      "ESCALATED",
    ].includes(status)
  ) {
    return "border-amber-400/30 bg-amber-400/10 text-amber-100";
  }

  if (
    [
      "HOLD",
      "CRITICAL",
      "SUSPENDED",
      "DENIED",
      "HELD",
    ].includes(status)
  ) {
    return "border-rose-400/30 bg-rose-400/10 text-rose-100";
  }

  return "border-sky-400/30 bg-sky-400/10 text-sky-100";
}

function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full border px-2.5 py-1",
        "text-[11px] font-semibold tracking-[0.12em]",
        tone(value),
      )}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}

function Progress({ value }: { value: number }) {
  const bounded = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className={cx(
          "h-full rounded-full",
          "bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400",
        )}
        style={{ width: `${bounded}%` }}
      />
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-white/10",
        "bg-white/[0.045] p-5 shadow-2xl",
        "shadow-black/10 backdrop-blur-xl",
      )}
    >
      <p
        className={cx(
          "text-xs font-semibold uppercase",
          "tracking-[0.22em] text-slate-400",
        )}
      >
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-white">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        {detail}
      </p>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section
      className={cx(
        "rounded-3xl border border-white/10",
        "bg-slate-950/55 p-5 shadow-2xl",
        "shadow-black/20 backdrop-blur-xl lg:p-6",
      )}
    >
      <div
        className={cx(
          "mb-5 flex flex-col gap-3",
          "sm:flex-row sm:items-start sm:justify-between",
        )}
      >
        <div>
          <h2 className="text-xl font-semibold text-white">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-dashed border-white/15",
        "bg-white/[0.025] px-6 py-12 text-center",
      )}
    >
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}

export default function EnterpriseManagementPage() {
  const [state, setState] = useState<PersistedState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState(
    "Enterprise state is preserved locally in this browser.",
  );
  const [modal, setModal] = useState<Modal>("NONE");
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftRole, setDraftRole] = useState<Role>("Learner");
  const [draftSeverity, setDraftSeverity] =
    useState<FindingSeverity>("MEDIUM");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as Partial<PersistedState>;
        setState({
          ...defaultState,
          ...parsed,
        });
      }
    } catch {
      setNotice(
        "Local state could not be restored. The default enterprise view is active.",
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state),
    );
  }, [state, hydrated]);

  const selectedOrganization =
    state.organizations.find(
      (organization) =>
        organization.id === state.selectedOrganizationId,
    ) ?? state.organizations[0];

  const selectedCampus =
    campuses.find(
      (campus) => campus.id === state.selectedCampusId,
    ) ?? campuses[0];

  const selectedPerson =
    state.people.find(
      (person) => person.id === state.selectedPersonId,
    ) ?? state.people[0];

  const selectedProgram =
    programs.find(
      (program) => program.id === state.selectedProgramId,
    ) ?? programs[0];

  const filteredOrganizations = useMemo(() => {
    const query = state.search.trim().toLowerCase();

    return state.organizations.filter((organization) => {
      const matchesFilter =
        state.organizationFilter === "ALL" ||
        organization.status === state.organizationFilter;

      const matchesSearch =
        !query ||
        [
          organization.name,
          organization.legalName,
          organization.sector,
          organization.region,
          organization.owner,
          organization.id,
        ].some((value) =>
          value.toLowerCase().includes(query),
        );

      return matchesFilter && matchesSearch;
    });
  }, [
    state.organizationFilter,
    state.organizations,
    state.search,
  ]);

  const organizationPeople = useMemo(() => {
    return state.people.filter(
      (person) =>
        person.organizationId === selectedOrganization.id,
    );
  }, [selectedOrganization.id, state.people]);

  const filteredPeople = useMemo(() => {
    const query = state.search.trim().toLowerCase();

    return state.people.filter((person) => {
      const matchesRole =
        state.personRoleFilter === "ALL" ||
        person.role === state.personRoleFilter;

      const matchesSearch =
        !query ||
        [
          person.name,
          person.email,
          person.role,
          person.id,
        ].some((value) =>
          value.toLowerCase().includes(query),
        );

      return matchesRole && matchesSearch;
    });
  }, [state.people, state.personRoleFilter, state.search]);

  const organizationCampuses = campuses.filter(
    (campus) => campus.organizationId === selectedOrganization.id,
  );

  const campusDepartments = departments.filter(
    (department) => department.campusId === selectedCampus.id,
  );

  const organizationPrograms = programs.filter(
    (program) =>
      program.organizationId === selectedOrganization.id,
  );

  const organizationPolicies = state.policies.filter(
    (policy) =>
      policy.organizationId === selectedOrganization.id,
  );

  const organizationFindings = state.findings.filter(
    (finding) =>
      finding.organizationId === selectedOrganization.id,
  );

  const organizationAudit = auditEvents.filter(
    (event) =>
      event.organizationId === selectedOrganization.id,
  );

  const totals = useMemo(() => {
    const seats = state.organizations.reduce(
      (sum, organization) => sum + organization.seats,
      0,
    );
    const assigned = state.organizations.reduce(
      (sum, organization) => sum + organization.assigned,
      0,
    );
    const learners = state.organizations.reduce(
      (sum, organization) => sum + organization.learners,
      0,
    );
    const instructors = state.organizations.reduce(
      (sum, organization) => sum + organization.instructors,
      0,
    );
    const compliance = Math.round(
      state.organizations.reduce(
        (sum, organization) => sum + organization.compliance,
        0,
      ) / Math.max(1, state.organizations.length),
    );

    return {
      seats,
      assigned,
      learners,
      instructors,
      compliance,
    };
  }, [state.organizations]);

  const openFindings = state.findings.filter(
    (finding) => finding.state !== "CLOSED",
  ).length;

  const acknowledgmentRate = useMemo(() => {
    const required = state.policies.reduce(
      (sum, policy) => sum + policy.required,
      0,
    );
    const acknowledged = state.policies.reduce(
      (sum, policy) => sum + policy.acknowledgments,
      0,
    );

    if (!required) {
      return 0;
    }

    return Math.round((acknowledged / required) * 100);
  }, [state.policies]);

  function update<K extends keyof PersistedState>(
    key: K,
    value: PersistedState[K],
  ) {
    setState((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function setOrganizationStatus(
    organizationId: string,
    status: OrganizationStatus,
  ) {
    setState((current) => ({
      ...current,
      organizations: current.organizations.map(
        (organization) =>
          organization.id === organizationId
            ? {
                ...organization,
                status,
              }
            : organization,
      ),
    }));

    setNotice(
      `${selectedOrganization.name} status changed to ${status}.`,
    );
  }

  function assignSeat(personId: string) {
    setState((current) => ({
      ...current,
      people: current.people.map((person) =>
        person.id === personId
          ? {
              ...person,
              seat: "ASSIGNED",
            }
          : person,
      ),
    }));

    setNotice("The selected enterprise seat was assigned.");
  }

  function suspendSeat(personId: string) {
    setState((current) => ({
      ...current,
      people: current.people.map((person) =>
        person.id === personId
          ? {
              ...person,
              seat: "SUSPENDED",
            }
          : person,
      ),
    }));

    setNotice("The selected seat was suspended and preserved in audit state.");
  }

  function closeFinding(findingId: string) {
    setState((current) => ({
      ...current,
      findings: current.findings.map((finding) =>
        finding.id === findingId
          ? {
              ...finding,
              state: "CLOSED",
            }
          : finding,
      ),
    }));

    setNotice("Finding closed. Corrective-action evidence remains preserved.");
  }

  function issuePolicy(policyId: string) {
    setState((current) => ({
      ...current,
      policies: current.policies.map((policy) =>
        policy.id === policyId
          ? {
              ...policy,
              state: "ISSUED",
              issued: "Jul 30, 2026",
            }
          : policy,
      ),
    }));

    setNotice("Policy issued to its governed audience.");
  }

  function exportState() {
    const payload = {
      exportedAt: new Date().toISOString(),
      state,
      campuses,
      departments,
      programs,
      auditEvents,
    };

    const blob = new Blob(
      [JSON.stringify(payload, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download =
      "ta14-academy-enterprise-management-export.json";
    anchor.click();
    URL.revokeObjectURL(url);

    setNotice("Enterprise management export created.");
  }

  function exportPeopleCsv() {
    const header = [
      "id",
      "name",
      "email",
      "organizationId",
      "role",
      "seat",
      "completion",
      "lastActive",
    ];

    const rows = state.people.map((person) => [
      person.id,
      person.name,
      person.email,
      person.organizationId,
      person.role,
      person.seat,
      person.completion,
      person.lastActive,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replaceAll('"', '""')}"`,
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "ta14-enterprise-people.csv";
    anchor.click();
    URL.revokeObjectURL(url);

    setNotice("Enterprise people CSV created.");
  }

  function importState(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(
          String(reader.result),
        ) as {
          state?: Partial<PersistedState>;
        };

        if (!parsed.state) {
          throw new Error("Missing state payload");
        }

        setState((current) => ({
          ...current,
          ...parsed.state,
        }));
        setNotice("Enterprise state imported successfully.");
      } catch {
        setNotice(
          "Import failed. Select a valid TA-14 enterprise JSON export.",
        );
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  function submitOrganization(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const name = draftName.trim();

    if (!name) {
      setNotice("Organization name is required.");
      return;
    }

    const id = `ORG-${String(
      state.organizations.length + 107,
    ).padStart(3, "0")}`;

    const organization: Organization = {
      id,
      name,
      legalName: name,
      sector: "Unclassified",
      region: "Not established",
      status: "ONBOARDING",
      campuses: 0,
      departments: 0,
      seats: 0,
      assigned: 0,
      learners: 0,
      instructors: 0,
      completion: 0,
      compliance: 0,
      renewal: "Not scheduled",
      owner: "Unassigned",
      authorityRecord: "Pending",
      evidenceCurrent: false,
    };

    setState((current) => ({
      ...current,
      organizations: [
        ...current.organizations,
        organization,
      ],
      selectedOrganizationId: id,
    }));
    setDraftName("");
    setModal("NONE");
    setNotice(
      "Organization created in ONBOARDING state. Activation remains unavailable until authority and evidence are established.",
    );
  }

  function submitPerson(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const name = draftName.trim();
    const email = draftEmail.trim();

    if (!name || !email) {
      setNotice("Name and email are required.");
      return;
    }

    const id = `P-${1100 + state.people.length}`;
    const campusId = organizationCampuses[0]?.id ?? "UNASSIGNED";
    const departmentId = departments.find(
      (department) =>
        department.organizationId === selectedOrganization.id,
    )?.id ?? "UNASSIGNED";

    const person: Person = {
      id,
      name,
      email,
      organizationId: selectedOrganization.id,
      campusId,
      departmentId,
      role: draftRole,
      seat: "PENDING",
      programs: 0,
      completion: 0,
      lastActive: "Invitation created",
      authorityExpires:
        draftRole === "Learner"
          ? "Not applicable"
          : "Authority pending",
    };

    setState((current) => ({
      ...current,
      people: [...current.people, person],
      selectedPersonId: id,
    }));
    setDraftName("");
    setDraftEmail("");
    setDraftRole("Learner");
    setModal("NONE");
    setNotice(
      "Person added with a pending seat. No access has been granted yet.",
    );
  }

  function submitPolicy(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const title = draftTitle.trim();

    if (!title) {
      setNotice("Policy title is required.");
      return;
    }

    const id = `POL-${800 + state.policies.length}`;
    const policy: Policy = {
      id,
      title,
      organizationId: selectedOrganization.id,
      version: "1.0",
      state: "DRAFT",
      issued: "Not issued",
      effective: "Pending review",
      audience: "Not assigned",
      acknowledgments: 0,
      required: selectedOrganization.learners,
      owner: selectedOrganization.owner,
    };

    setState((current) => ({
      ...current,
      policies: [...current.policies, policy],
    }));
    setDraftTitle("");
    setModal("NONE");
    setNotice(
      "Policy draft created. It has not been issued or made effective.",
    );
  }

  function submitFinding(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const title = draftTitle.trim();

    if (!title) {
      setNotice("Finding title is required.");
      return;
    }

    const id = `F-${800 + state.findings.length}`;
    const finding: Finding = {
      id,
      organizationId: selectedOrganization.id,
      title,
      severity: draftSeverity,
      owner: selectedOrganization.owner,
      due: "Not scheduled",
      state: "OPEN",
      correctiveAction: "Corrective action not yet established.",
      evidence: "Evidence pending",
    };

    setState((current) => ({
      ...current,
      findings: [...current.findings, finding],
    }));
    setDraftTitle("");
    setDraftSeverity("MEDIUM");
    setModal("NONE");
    setNotice(
      "Finding opened. Closure requires corrective-action evidence.",
    );
  }

  const tabs: Array<{
    id: Tab;
    label: string;
  }> = [
    {
      id: "overview",
      label: "Command overview",
    },
    {
      id: "organizations",
      label: "Organizations",
    },
    {
      id: "structure",
      label: "Structure",
    },
    {
      id: "people",
      label: "People & seats",
    },
    {
      id: "programs",
      label: "Programs",
    },
    {
      id: "policies",
      label: "Policies",
    },
    {
      id: "compliance",
      label: "Compliance",
    },
    {
      id: "reports",
      label: "Reports",
    },
    {
      id: "audit",
      label: "Audit history",
    },
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={cx(
            "absolute left-[-12rem] top-[-10rem]",
            "h-[34rem] w-[34rem] rounded-full",
            "bg-cyan-500/10 blur-3xl",
          )}
        />
        <div
          className={cx(
            "absolute right-[-14rem] top-[8rem]",
            "h-[38rem] w-[38rem] rounded-full",
            "bg-violet-500/10 blur-3xl",
          )}
        />
        <div
          className={cx(
            "absolute bottom-[-18rem] left-[28%]",
            "h-[42rem] w-[42rem] rounded-full",
            "bg-sky-500/10 blur-3xl",
          )}
        />
      </div>

      <section
        className={cx(
          "relative mx-auto max-w-[1680px]",
          "px-4 py-6 sm:px-6 lg:px-8",
        )}
      >
        <header
          className={cx(
            "rounded-3xl border border-white/10",
            "bg-slate-950/65 p-6 shadow-2xl",
            "shadow-black/30 backdrop-blur-2xl lg:p-8",
          )}
        >
          <div
            className={cx(
              "flex flex-col gap-6",
              "xl:flex-row xl:items-start xl:justify-between",
            )}
          >
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cx(
                    "rounded-full border border-cyan-400/30",
                    "bg-cyan-400/10 px-3 py-1",
                    "text-xs font-semibold uppercase",
                    "tracking-[0.22em] text-cyan-100",
                  )}
                >
                  TA-14 Academy
                </span>
                <span
                  className={cx(
                    "rounded-full border border-white/10",
                    "bg-white/5 px-3 py-1 text-xs text-slate-300",
                  )}
                >
                  Enterprise Management · v2.0
                </span>
              </div>

              <h1
                className={cx(
                  "mt-5 text-3xl font-semibold tracking-tight",
                  "text-white sm:text-4xl lg:text-5xl",
                )}
              >
                Enterprise governance command center
              </h1>

              <p
                className={cx(
                  "mt-4 max-w-3xl text-base leading-8",
                  "text-slate-300 sm:text-lg",
                )}
              >
                Govern organizations, campuses, departments, people,
                seats, programs, policies, findings, and enterprise
                evidence without treating administration as permission
                to execute.
              </p>

              <div
                className={cx(
                  "mt-6 rounded-2xl border border-amber-400/20",
                  "bg-amber-400/[0.07] p-4",
                )}
              >
                <p
                  className={cx(
                    "text-xs font-semibold uppercase",
                    "tracking-[0.2em] text-amber-200",
                  )}
                >
                  Governing boundary
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-50/80">
                  Enterprise enrollment, role assignment, policy
                  distribution, and program completion do not by
                  themselves establish admissible authority for a
                  specific execution. Authority, evidence, continuity,
                  and boundary must still be validated at runtime.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/academy/dashboard"
                className={cx(
                  "rounded-xl border border-white/10",
                  "bg-white/5 px-4 py-2.5 text-sm font-medium",
                  "text-slate-200 transition hover:bg-white/10",
                )}
              >
                Academy dashboard
              </Link>
              <button
                type="button"
                onClick={() => importRef.current?.click()}
                className={cx(
                  "rounded-xl border border-white/10",
                  "bg-white/5 px-4 py-2.5 text-sm font-medium",
                  "text-slate-200 transition hover:bg-white/10",
                )}
              >
                Import JSON
              </button>
              <button
                type="button"
                onClick={exportState}
                className={cx(
                  "rounded-xl border border-cyan-400/30",
                  "bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold",
                  "text-cyan-100 transition hover:bg-cyan-400/15",
                )}
              >
                Export enterprise state
              </button>
              <input
                ref={importRef}
                type="file"
                accept="application/json"
                onChange={importState}
                className="hidden"
              />
            </div>
          </div>
        </header>

        <div
          className={cx(
            "mt-5 flex flex-col gap-3 rounded-2xl",
            "border border-white/10 bg-slate-950/50 p-4",
            "backdrop-blur-xl lg:flex-row lg:items-center",
            "lg:justify-between",
          )}
        >
          <p className="text-sm text-slate-300">
            {notice}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setModal("ADD_ORGANIZATION")}
              className={cx(
                "rounded-xl bg-white px-4 py-2",
                "text-sm font-semibold text-slate-950",
                "transition hover:bg-cyan-100",
              )}
            >
              Add organization
            </button>
            <button
              type="button"
              onClick={() => setModal("ADD_PERSON")}
              className={cx(
                "rounded-xl border border-white/10",
                "bg-white/5 px-4 py-2 text-sm font-medium",
                "text-slate-200 transition hover:bg-white/10",
              )}
            >
              Add person
            </button>
          </div>
        </div>

        <nav
          className={cx(
            "mt-5 flex gap-2 overflow-x-auto rounded-2xl",
            "border border-white/10 bg-slate-950/55 p-2",
            "backdrop-blur-xl",
          )}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => update("activeTab", tab.id)}
              className={cx(
                "whitespace-nowrap rounded-xl px-4 py-2.5",
                "text-sm font-medium transition",
                state.activeTab === tab.id
                  ? "bg-white text-slate-950"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Metric
            label="Organizations"
            value={String(state.organizations.length)}
            detail={`${
              state.organizations.filter(
                (organization) => organization.status === "ACTIVE",
              ).length
            } active enterprise tenants`}
          />
          <Metric
            label="Licensed seats"
            value={totals.seats.toLocaleString()}
            detail={`${totals.assigned.toLocaleString()} assigned across all organizations`}
          />
          <Metric
            label="Learners"
            value={totals.learners.toLocaleString()}
            detail={`${totals.instructors.toLocaleString()} qualified instructors`}
          />
          <Metric
            label="Compliance"
            value={`${totals.compliance}%`}
            detail={`${openFindings} findings remain open`}
          />
          <Metric
            label="Acknowledgment"
            value={`${acknowledgmentRate}%`}
            detail="Issued policy acknowledgment rate"
          />
        </div>

        {state.activeTab === "overview" ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <Panel
              title="Enterprise portfolio"
              description="Current organizational posture, seat utilization, completion, and compliance."
              action={
                <button
                  type="button"
                  onClick={() => update("activeTab", "organizations")}
                  className="text-sm font-medium text-cyan-200"
                >
                  Open organizations →
                </button>
              }
            >
              <div className="space-y-3">
                {state.organizations.map((organization) => (
                  <button
                    key={organization.id}
                    type="button"
                    onClick={() => {
                      update(
                        "selectedOrganizationId",
                        organization.id,
                      );
                      update("activeTab", "organizations");
                    }}
                    className={cx(
                      "grid w-full gap-4 rounded-2xl border",
                      "p-4 text-left transition",
                      "lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr]",
                      organization.id ===
                        state.selectedOrganizationId
                        ? "border-cyan-400/35 bg-cyan-400/[0.07]"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                    )}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-white">
                          {organization.name}
                        </p>
                        <StatusBadge value={organization.status} />
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        {organization.sector} · {organization.region}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Seats
                      </p>
                      <p className="mt-1 text-sm text-white">
                        {organization.assigned} / {organization.seats}
                      </p>
                      <div className="mt-2">
                        <Progress
                          value={
                            organization.seats
                              ? (organization.assigned /
                                  organization.seats) *
                                100
                              : 0
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Completion
                      </p>
                      <p className="mt-1 text-sm text-white">
                        {organization.completion}%
                      </p>
                      <div className="mt-2">
                        <Progress value={organization.completion} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Compliance
                      </p>
                      <p className="mt-1 text-sm text-white">
                        {organization.compliance}%
                      </p>
                      <div className="mt-2">
                        <Progress value={organization.compliance} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Panel>

            <div className="space-y-6">
              <Panel
                title="Runtime attention"
                description="Conditions requiring action before organizational posture can improve."
              >
                <div className="space-y-3">
                  {state.findings
                    .filter((finding) => finding.state !== "CLOSED")
                    .slice(0, 4)
                    .map((finding) => (
                      <button
                        key={finding.id}
                        type="button"
                        onClick={() => {
                          update(
                            "selectedOrganizationId",
                            finding.organizationId,
                          );
                          update("activeTab", "compliance");
                        }}
                        className={cx(
                          "w-full rounded-2xl border border-white/10",
                          "bg-white/[0.03] p-4 text-left",
                          "transition hover:bg-white/[0.06]",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium text-white">
                            {finding.title}
                          </p>
                          <StatusBadge value={finding.severity} />
                        </div>
                        <p className="mt-2 text-xs text-slate-400">
                          Due {finding.due} · {finding.owner}
                        </p>
                      </button>
                    ))}
                </div>
              </Panel>

              <Panel
                title="Execution posture"
                description="The selected organization's current organizational boundary."
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-400">
                      Organizational status
                    </span>
                    <StatusBadge value={selectedOrganization.status} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-400">
                      Authority record
                    </span>
                    <span className="text-sm text-white">
                      {selectedOrganization.authorityRecord}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-400">
                      Evidence currency
                    </span>
                    <StatusBadge
                      value={
                        selectedOrganization.evidenceCurrent
                          ? "ACTIVE"
                          : "HOLD"
                      }
                    />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Determination
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {selectedOrganization.status === "HOLD" ||
                      !selectedOrganization.evidenceCurrent
                        ? "Enterprise administration may continue, but governed execution remains held until authority and evidence are revalidated."
                        : "Enterprise administration is active. Individual executions still require their own admissibility determination."}
                    </p>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        ) : null}

        {state.activeTab === "organizations" ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Panel
              title="Organizations"
              description="Search, select, and inspect enterprise tenants."
              action={
                <button
                  type="button"
                  onClick={() => setModal("ADD_ORGANIZATION")}
                  className="text-sm font-medium text-cyan-200"
                >
                  Add organization
                </button>
              }
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  value={state.search}
                  onChange={(event) =>
                    update("search", event.target.value)
                  }
                  placeholder="Search organization, owner, sector, or ID"
                  className={cx(
                    "rounded-xl border border-white/10",
                    "bg-white/5 px-4 py-3 text-sm text-white",
                    "outline-none placeholder:text-slate-500",
                    "focus:border-cyan-400/40",
                  )}
                />
                <select
                  value={state.organizationFilter}
                  onChange={(event) =>
                    update(
                      "organizationFilter",
                      event.target.value as
                        | "ALL"
                        | OrganizationStatus,
                    )
                  }
                  className={cx(
                    "rounded-xl border border-white/10",
                    "bg-slate-900 px-4 py-3 text-sm text-white",
                    "outline-none focus:border-cyan-400/40",
                  )}
                >
                  <option value="ALL">All statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="WATCH">Watch</option>
                  <option value="HOLD">Hold</option>
                  <option value="ONBOARDING">Onboarding</option>
                </select>
              </div>

              <div className="mt-4 space-y-3">
                {filteredOrganizations.length ? (
                  filteredOrganizations.map((organization) => (
                    <button
                      key={organization.id}
                      type="button"
                      onClick={() =>
                        update(
                          "selectedOrganizationId",
                          organization.id,
                        )
                      }
                      className={cx(
                        "w-full rounded-2xl border p-4 text-left",
                        "transition",
                        organization.id ===
                          state.selectedOrganizationId
                          ? "border-cyan-400/35 bg-cyan-400/[0.07]"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">
                            {organization.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {organization.id} · {organization.sector}
                          </p>
                        </div>
                        <StatusBadge value={organization.status} />
                      </div>
                    </button>
                  ))
                ) : (
                  <EmptyState message="No organizations match the current search and status filter." />
                )}
              </div>
            </Panel>

            <Panel
              title={selectedOrganization.name}
              description={selectedOrganization.legalName}
              action={
                <StatusBadge value={selectedOrganization.status} />
              }
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  ["Sector", selectedOrganization.sector],
                  ["Region", selectedOrganization.region],
                  ["Enterprise owner", selectedOrganization.owner],
                  ["Renewal", selectedOrganization.renewal],
                  ["Campuses", String(selectedOrganization.campuses)],
                  ["Departments", String(selectedOrganization.departments)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Seat utilization
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    {selectedOrganization.assigned} / {selectedOrganization.seats}
                  </p>
                  <div className="mt-3">
                    <Progress
                      value={
                        selectedOrganization.seats
                          ? (selectedOrganization.assigned /
                              selectedOrganization.seats) *
                            100
                          : 0
                      }
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Program completion
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    {selectedOrganization.completion}%
                  </p>
                  <div className="mt-3">
                    <Progress value={selectedOrganization.completion} />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Compliance posture
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    {selectedOrganization.compliance}%
                  </p>
                  <div className="mt-3">
                    <Progress value={selectedOrganization.compliance} />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Organization controls
                    </p>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                      Status changes are bounded administrative actions.
                      Placing an organization on HOLD prevents the interface
                      from representing the tenant as execution-ready.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOrganizationStatus(
                          selectedOrganization.id,
                          "ACTIVE",
                        )
                      }
                      className={cx(
                        "rounded-xl border border-emerald-400/30",
                        "bg-emerald-400/10 px-4 py-2",
                        "text-sm font-medium text-emerald-100",
                      )}
                    >
                      Mark active
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setOrganizationStatus(
                          selectedOrganization.id,
                          "WATCH",
                        )
                      }
                      className={cx(
                        "rounded-xl border border-amber-400/30",
                        "bg-amber-400/10 px-4 py-2",
                        "text-sm font-medium text-amber-100",
                      )}
                    >
                      Place on watch
                    </button>
                    <button
                      type="button"
                      onClick={() => setModal("CONFIRM_HOLD")}
                      className={cx(
                        "rounded-xl border border-rose-400/30",
                        "bg-rose-400/10 px-4 py-2",
                        "text-sm font-medium text-rose-100",
                      )}
                    >
                      Place on hold
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium text-white">
                  Enterprise review notes
                </label>
                <textarea
                  value={state.notes[selectedOrganization.id] ?? ""}
                  onChange={(event) =>
                    update("notes", {
                      ...state.notes,
                      [selectedOrganization.id]: event.target.value,
                    })
                  }
                  rows={5}
                  placeholder="Record review notes, unresolved conditions, and next actions."
                  className={cx(
                    "mt-2 w-full rounded-2xl border border-white/10",
                    "bg-white/5 px-4 py-3 text-sm leading-6 text-white",
                    "outline-none placeholder:text-slate-500",
                    "focus:border-cyan-400/40",
                  )}
                />
              </div>
            </Panel>
          </div>
        ) : null}

        {state.activeTab === "structure" ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
            <Panel
              title="Campus hierarchy"
              description="Select a campus to inspect its bounded departmental structure."
            >
              <div className="space-y-3">
                {organizationCampuses.length ? (
                  organizationCampuses.map((campus) => (
                    <button
                      key={campus.id}
                      type="button"
                      onClick={() =>
                        update("selectedCampusId", campus.id)
                      }
                      className={cx(
                        "w-full rounded-2xl border p-4 text-left",
                        "transition",
                        campus.id === state.selectedCampusId
                          ? "border-cyan-400/35 bg-cyan-400/[0.07]"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">
                            {campus.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {campus.location} · {campus.id}
                          </p>
                        </div>
                        <StatusBadge value={campus.status} />
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {campus.departments}
                          </p>
                          <p className="text-xs text-slate-500">
                            Departments
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {campus.learners}
                          </p>
                          <p className="text-xs text-slate-500">
                            Learners
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {campus.compliance}%
                          </p>
                          <p className="text-xs text-slate-500">
                            Compliance
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <EmptyState message="No campus records exist for this organization." />
                )}
              </div>
            </Panel>

            <Panel
              title={selectedCampus.name}
              description={`${selectedCampus.location} · Authority owner: ${selectedCampus.authorityOwner}`}
              action={<StatusBadge value={selectedCampus.status} />}
            >
              <div className="space-y-3">
                {campusDepartments.length ? (
                  campusDepartments.map((department) => (
                    <div
                      key={department.id}
                      className={cx(
                        "grid gap-4 rounded-2xl border border-white/10",
                        "bg-white/[0.03] p-4",
                        "lg:grid-cols-[1.3fr_0.8fr_0.7fr_0.7fr]",
                      )}
                    >
                      <div>
                        <p className="font-semibold text-white">
                          {department.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {department.id} · Manager: {department.manager}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          People
                        </p>
                        <p className="mt-1 text-sm text-white">
                          {department.learners} learners · {department.instructors} instructors
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Programs
                        </p>
                        <p className="mt-1 text-sm text-white">
                          {department.requiredPrograms} required
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Completion
                        </p>
                        <p className="mt-1 text-sm text-white">
                          {department.completion}%
                        </p>
                        <div className="mt-2">
                          <Progress value={department.completion} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="No departmental records are available for this campus." />
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                  Structure boundary
                </p>
                <p className="mt-2 text-sm leading-6 text-sky-50/80">
                  Campus and department membership establish administrative
                  scope only. They do not automatically confer authority to
                  review, approve, bind, or execute a governed route.
                </p>
              </div>
            </Panel>
          </div>
        ) : null}

        {state.activeTab === "people" ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Panel
              title="People and enterprise seats"
              description="Manage enrollment posture without silently granting execution authority."
              action={
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={exportPeopleCsv}
                    className="text-sm font-medium text-slate-300"
                  >
                    Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal("ADD_PERSON")}
                    className="text-sm font-medium text-cyan-200"
                  >
                    Add person
                  </button>
                </div>
              }
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  value={state.search}
                  onChange={(event) =>
                    update("search", event.target.value)
                  }
                  placeholder="Search person, email, role, or ID"
                  className={cx(
                    "rounded-xl border border-white/10",
                    "bg-white/5 px-4 py-3 text-sm text-white",
                    "outline-none placeholder:text-slate-500",
                  )}
                />
                <select
                  value={state.personRoleFilter}
                  onChange={(event) =>
                    update(
                      "personRoleFilter",
                      event.target.value as "ALL" | Role,
                    )
                  }
                  className={cx(
                    "rounded-xl border border-white/10",
                    "bg-slate-900 px-4 py-3 text-sm text-white",
                  )}
                >
                  <option value="ALL">All roles</option>
                  <option value="Enterprise Admin">
                    Enterprise Admin
                  </option>
                  <option value="Instructor">Instructor</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Learner">Learner</option>
                </select>
              </div>

              <div className="mt-4 space-y-3">
                {filteredPeople.length ? (
                  filteredPeople.map((person) => {
                    const organization = state.organizations.find(
                      (item) => item.id === person.organizationId,
                    );

                    return (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() =>
                          update("selectedPersonId", person.id)
                        }
                        className={cx(
                          "grid w-full gap-4 rounded-2xl border p-4",
                          "text-left transition",
                          "lg:grid-cols-[1.2fr_0.8fr_0.7fr]",
                          person.id === state.selectedPersonId
                            ? "border-cyan-400/35 bg-cyan-400/[0.07]"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                        )}
                      >
                        <div>
                          <p className="font-semibold text-white">
                            {person.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {person.email}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {organization?.name ?? person.organizationId}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            Role
                          </p>
                          <p className="mt-1 text-sm text-white">
                            {person.role}
                          </p>
                        </div>
                        <div className="flex items-start justify-between gap-3 lg:block">
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                              Seat
                            </p>
                            <div className="mt-2">
                              <StatusBadge value={person.seat} />
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 lg:mt-3">
                            {person.completion}% complete
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <EmptyState message="No people match the current search and role filter." />
                )}
              </div>
            </Panel>

            <Panel
              title={selectedPerson.name}
              description={`${selectedPerson.id} · ${selectedPerson.email}`}
              action={<StatusBadge value={selectedPerson.seat} />}
            >
              <div className="space-y-4">
                {[
                  ["Role", selectedPerson.role],
                  ["Programs", String(selectedPerson.programs)],
                  ["Completion", `${selectedPerson.completion}%`],
                  ["Last active", selectedPerson.lastActive],
                  ["Authority expires", selectedPerson.authorityExpires],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 border-b border-white/10 pb-3"
                  >
                    <span className="text-sm text-slate-400">
                      {label}
                    </span>
                    <span className="text-right text-sm text-white">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">
                  Seat controls
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Seat assignment permits Academy access. It does not grant
                  reviewer, approval, or execution authority.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => assignSeat(selectedPerson.id)}
                    className={cx(
                      "rounded-xl border border-emerald-400/30",
                      "bg-emerald-400/10 px-4 py-2",
                      "text-sm font-medium text-emerald-100",
                    )}
                  >
                    Assign seat
                  </button>
                  <button
                    type="button"
                    onClick={() => suspendSeat(selectedPerson.id)}
                    className={cx(
                      "rounded-xl border border-rose-400/30",
                      "bg-rose-400/10 px-4 py-2",
                      "text-sm font-medium text-rose-100",
                    )}
                  >
                    Suspend seat
                  </button>
                </div>
              </div>
            </Panel>
          </div>
        ) : null}

        {state.activeTab === "programs" ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Panel
              title="Enterprise programs"
              description="Program assignments, completion posture, and instructional capacity."
              action={
                <button
                  type="button"
                  onClick={() => setModal("ASSIGN_PROGRAM")}
                  className="text-sm font-medium text-cyan-200"
                >
                  Assign program
                </button>
              }
            >
              <div className="space-y-3">
                {programs.map((program) => {
                  const organization = state.organizations.find(
                    (item) => item.id === program.organizationId,
                  );

                  return (
                    <button
                      key={program.id}
                      type="button"
                      onClick={() =>
                        update("selectedProgramId", program.id)
                      }
                      className={cx(
                        "grid w-full gap-4 rounded-2xl border p-4",
                        "text-left transition",
                        "lg:grid-cols-[1.35fr_0.7fr_0.7fr]",
                        program.id === state.selectedProgramId
                          ? "border-cyan-400/35 bg-cyan-400/[0.07]"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                      )}
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-white">
                            {program.name}
                          </p>
                          {program.mandatory ? (
                            <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300">
                              Mandatory
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          {organization?.name ?? program.organizationId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Completion
                        </p>
                        <p className="mt-1 text-sm text-white">
                          {program.completion}%
                        </p>
                        <div className="mt-2">
                          <Progress value={program.completion} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Status
                        </p>
                        <div className="mt-2">
                          <StatusBadge value={program.status} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel
              title={selectedProgram.name}
              description={`${selectedProgram.id} · Owner: ${selectedProgram.owner}`}
              action={<StatusBadge value={selectedProgram.status} />}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Enrolled", String(selectedProgram.enrolled)],
                  ["Instructors", String(selectedProgram.instructors)],
                  ["Completion", `${selectedProgram.completion}%`],
                  ["Pass rate", `${selectedProgram.passRate}%`],
                  ["Start", selectedProgram.start],
                  ["End", selectedProgram.end],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
                  Completion boundary
                </p>
                <p className="mt-2 text-sm leading-6 text-violet-50/80">
                  Program completion demonstrates learning evidence. It does
                  not automatically establish current authority, context,
                  continuity, or admissibility for a live execution.
                </p>
              </div>
            </Panel>
          </div>
        ) : null}

        {state.activeTab === "policies" ? (
          <div className="mt-6">
            <Panel
              title="Policy distribution and acknowledgment"
              description="Versioned enterprise policies with bounded issuance and acknowledgment posture."
              action={
                <button
                  type="button"
                  onClick={() => setModal("ISSUE_POLICY")}
                  className="text-sm font-medium text-cyan-200"
                >
                  Create policy draft
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-slate-500">
                      <th className="px-3 py-3">Policy</th>
                      <th className="px-3 py-3">Organization</th>
                      <th className="px-3 py-3">Version</th>
                      <th className="px-3 py-3">State</th>
                      <th className="px-3 py-3">Acknowledgment</th>
                      <th className="px-3 py-3">Effective</th>
                      <th className="px-3 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.policies.map((policy) => {
                      const organization = state.organizations.find(
                        (item) => item.id === policy.organizationId,
                      );
                      const rate = policy.required
                        ? Math.round(
                            (policy.acknowledgments / policy.required) *
                              100,
                          )
                        : 0;

                      return (
                        <tr
                          key={policy.id}
                          className="border-b border-white/5 align-top"
                        >
                          <td className="px-3 py-4">
                            <p className="font-medium text-white">
                              {policy.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {policy.id} · {policy.owner}
                            </p>
                          </td>
                          <td className="px-3 py-4 text-slate-300">
                            {organization?.name ?? policy.organizationId}
                          </td>
                          <td className="px-3 py-4 text-slate-300">
                            {policy.version}
                          </td>
                          <td className="px-3 py-4">
                            <StatusBadge value={policy.state} />
                          </td>
                          <td className="min-w-44 px-3 py-4">
                            <p className="text-slate-300">
                              {policy.acknowledgments} / {policy.required}
                            </p>
                            <div className="mt-2">
                              <Progress value={rate} />
                            </div>
                          </td>
                          <td className="px-3 py-4 text-slate-300">
                            {policy.effective}
                          </td>
                          <td className="px-3 py-4">
                            {policy.state === "DRAFT" ? (
                              <button
                                type="button"
                                onClick={() => issuePolicy(policy.id)}
                                className="text-sm font-medium text-cyan-200"
                              >
                                Issue
                              </button>
                            ) : (
                              <span className="text-xs text-slate-500">
                                Preserved
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        ) : null}

        {state.activeTab === "compliance" ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Panel
              title="Findings and corrective actions"
              description="Open conditions remain visible until corrective-action evidence is preserved."
              action={
                <button
                  type="button"
                  onClick={() => setModal("CREATE_FINDING")}
                  className="text-sm font-medium text-cyan-200"
                >
                  Open finding
                </button>
              }
            >
              <div className="space-y-3">
                {state.findings.map((finding) => {
                  const organization = state.organizations.find(
                    (item) => item.id === finding.organizationId,
                  );

                  return (
                    <div
                      key={finding.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-white">
                              {finding.title}
                            </p>
                            <StatusBadge value={finding.severity} />
                            <StatusBadge value={finding.state} />
                          </div>
                          <p className="mt-2 text-sm text-slate-400">
                            {organization?.name ?? finding.organizationId} · Due {finding.due}
                          </p>
                          <p className="mt-3 text-sm leading-6 text-slate-300">
                            {finding.correctiveAction}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            Evidence: {finding.evidence} · Owner: {finding.owner}
                          </p>
                        </div>
                        {finding.state !== "CLOSED" ? (
                          <button
                            type="button"
                            onClick={() => closeFinding(finding.id)}
                            className={cx(
                              "rounded-xl border border-emerald-400/30",
                              "bg-emerald-400/10 px-4 py-2",
                              "text-sm font-medium text-emerald-100",
                            )}
                          >
                            Close with evidence
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            <div className="space-y-6">
              <Panel
                title="Selected organization posture"
                description={selectedOrganization.name}
                action={<StatusBadge value={selectedOrganization.status} />}
              >
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        Compliance score
                      </span>
                      <span className="font-medium text-white">
                        {selectedOrganization.compliance}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <Progress value={selectedOrganization.compliance} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        Program completion
                      </span>
                      <span className="font-medium text-white">
                        {selectedOrganization.completion}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <Progress value={selectedOrganization.completion} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-sm text-slate-400">
                      Current evidence
                    </span>
                    <StatusBadge
                      value={
                        selectedOrganization.evidenceCurrent
                          ? "ACTIVE"
                          : "HOLD"
                      }
                    />
                  </div>
                </div>
              </Panel>

              <Panel
                title="Readiness questions"
                description="Enterprise readiness cannot be inferred from a single score."
              >
                <div className="space-y-3">
                  {[
                    "Is the organizational authority record current?",
                    "Are reviewer and instructor qualifications still valid?",
                    "Are required policies issued and acknowledged?",
                    "Are open findings bounded from execution?",
                    "Can the organization preserve evidence through challenge?",
                  ].map((question) => (
                    <div
                      key={question}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-slate-300"
                    >
                      {question}
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        ) : null}

        {state.activeTab === "reports" ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel
              title="Enterprise reporting"
              description="Generate bounded exports for review, reconciliation, and preserved reporting."
            >
              <div className="space-y-3">
                {[
                  {
                    title: "Organization posture report",
                    detail:
                      "Status, authority, evidence currency, completion, and compliance.",
                    action: exportState,
                  },
                  {
                    title: "People and seat report",
                    detail:
                      "Role, seat state, program count, completion, and activity.",
                    action: exportPeopleCsv,
                  },
                  {
                    title: "Policy acknowledgment report",
                    detail:
                      "Issued versions, governed audiences, and acknowledgment gaps.",
                    action: exportState,
                  },
                  {
                    title: "Finding and corrective-action report",
                    detail:
                      "Severity, owner, due date, state, and preserved evidence references.",
                    action: exportState,
                  },
                ].map((report) => (
                  <div
                    key={report.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-white">
                          {report.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {report.detail}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={report.action}
                        className={cx(
                          "rounded-xl border border-cyan-400/30",
                          "bg-cyan-400/10 px-4 py-2",
                          "text-sm font-medium text-cyan-100",
                        )}
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel
              title="Portfolio distribution"
              description="A directional portfolio view for enterprise review."
            >
              <div className="space-y-5">
                {state.organizations.map((organization) => (
                  <div key={organization.id}>
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-slate-300">
                        {organization.name}
                      </span>
                      <span className="text-white">
                        {organization.compliance}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <Progress value={organization.compliance} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
                <p className="text-sm font-semibold text-amber-100">
                  Reporting limitation
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-50/75">
                  Aggregated scores support oversight. They cannot replace
                  object-level evidence or authorize a particular execution.
                </p>
              </div>
            </Panel>
          </div>
        ) : null}

        {state.activeTab === "audit" ? (
          <div className="mt-6">
            <Panel
              title="Enterprise audit history"
              description="Attributable administrative events with preserved results and evidence references."
            >
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-slate-500">
                      <th className="px-3 py-3">Timestamp</th>
                      <th className="px-3 py-3">Actor</th>
                      <th className="px-3 py-3">Organization</th>
                      <th className="px-3 py-3">Action</th>
                      <th className="px-3 py-3">Object</th>
                      <th className="px-3 py-3">Result</th>
                      <th className="px-3 py-3">Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditEvents.map((event) => {
                      const organization = state.organizations.find(
                        (item) => item.id === event.organizationId,
                      );

                      return (
                        <tr
                          key={event.id}
                          className="border-b border-white/5"
                        >
                          <td className="px-3 py-4 text-slate-400">
                            {event.timestamp}
                          </td>
                          <td className="px-3 py-4 text-white">
                            {event.actor}
                          </td>
                          <td className="px-3 py-4 text-slate-300">
                            {organization?.name ?? event.organizationId}
                          </td>
                          <td className="px-3 py-4 text-slate-300">
                            {event.action}
                          </td>
                          <td className="px-3 py-4 text-slate-300">
                            {event.object}
                          </td>
                          <td className="px-3 py-4">
                            <StatusBadge value={event.result} />
                          </td>
                          <td className="px-3 py-4 font-mono text-xs text-cyan-200">
                            {event.evidence}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        ) : null}

        <footer
          className={cx(
            "mt-8 flex flex-col gap-4 rounded-2xl",
            "border border-white/10 bg-slate-950/50 p-5",
            "text-sm text-slate-400 backdrop-blur-xl",
            "sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <p>
            No admissible evidence. No admissible execution.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/academy/instructor-console"
              className="transition hover:text-white"
            >
              Instructor Console
            </Link>
            <Link
              href="/academy/certification-engine"
              className="transition hover:text-white"
            >
              Certification Engine
            </Link>
            <Link
              href="/academy/credential-dashboard"
              className="transition hover:text-white"
            >
              Credential Dashboard
            </Link>
          </div>
        </footer>
      </section>

      {modal !== "NONE" ? (
        <div
          className={cx(
            "fixed inset-0 z-50 flex items-center justify-center",
            "bg-slate-950/80 p-4 backdrop-blur-md",
          )}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={cx(
              "w-full max-w-xl rounded-3xl border border-white/10",
              "bg-[#0a1022] p-6 shadow-2xl shadow-black/40",
            )}
          >
            {modal === "ADD_ORGANIZATION" ? (
              <form onSubmit={submitOrganization}>
                <h2 className="text-2xl font-semibold text-white">
                  Add organization
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  New organizations begin in ONBOARDING state with no
                  execution authority.
                </p>
                <label className="mt-5 block text-sm font-medium text-white">
                  Organization name
                </label>
                <input
                  autoFocus
                  value={draftName}
                  onChange={(event) =>
                    setDraftName(event.target.value)
                  }
                  className={cx(
                    "mt-2 w-full rounded-xl border border-white/10",
                    "bg-white/5 px-4 py-3 text-white outline-none",
                  )}
                />
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModal("NONE")}
                    className="rounded-xl px-4 py-2 text-sm text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                  >
                    Create organization
                  </button>
                </div>
              </form>
            ) : null}

            {modal === "ADD_PERSON" ? (
              <form onSubmit={submitPerson}>
                <h2 className="text-2xl font-semibold text-white">
                  Add person
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  The person will be added to {selectedOrganization.name}
                  with a pending seat.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-white">
                      Name
                    </label>
                    <input
                      value={draftName}
                      onChange={(event) =>
                        setDraftName(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      value={draftEmail}
                      onChange={(event) =>
                        setDraftEmail(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                    />
                  </div>
                </div>
                <label className="mt-4 block text-sm font-medium text-white">
                  Role
                </label>
                <select
                  value={draftRole}
                  onChange={(event) =>
                    setDraftRole(event.target.value as Role)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                >
                  <option value="Learner">Learner</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Enterprise Admin">
                    Enterprise Admin
                  </option>
                </select>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModal("NONE")}
                    className="rounded-xl px-4 py-2 text-sm text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                  >
                    Add person
                  </button>
                </div>
              </form>
            ) : null}

            {modal === "ISSUE_POLICY" ? (
              <form onSubmit={submitPolicy}>
                <h2 className="text-2xl font-semibold text-white">
                  Create policy draft
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Draft creation does not issue the policy or make it
                  effective.
                </p>
                <label className="mt-5 block text-sm font-medium text-white">
                  Policy title
                </label>
                <input
                  value={draftTitle}
                  onChange={(event) =>
                    setDraftTitle(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                />
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModal("NONE")}
                    className="rounded-xl px-4 py-2 text-sm text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                  >
                    Create draft
                  </button>
                </div>
              </form>
            ) : null}

            {modal === "CREATE_FINDING" ? (
              <form onSubmit={submitFinding}>
                <h2 className="text-2xl font-semibold text-white">
                  Open compliance finding
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Findings remain open until corrective-action evidence is
                  preserved and reviewed.
                </p>
                <label className="mt-5 block text-sm font-medium text-white">
                  Finding title
                </label>
                <input
                  value={draftTitle}
                  onChange={(event) =>
                    setDraftTitle(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                />
                <label className="mt-4 block text-sm font-medium text-white">
                  Severity
                </label>
                <select
                  value={draftSeverity}
                  onChange={(event) =>
                    setDraftSeverity(
                      event.target.value as FindingSeverity,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModal("NONE")}
                    className="rounded-xl px-4 py-2 text-sm text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                  >
                    Open finding
                  </button>
                </div>
              </form>
            ) : null}

            {modal === "CONFIRM_HOLD" ? (
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Place organization on hold?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {selectedOrganization.name} will remain visible, but its
                  organizational posture will no longer be represented as
                  active.
                </p>
                <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-4 text-sm leading-6 text-rose-50/80">
                  This action does not erase records, remove findings, or
                  rewrite prior audit history.
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModal("NONE")}
                    className="rounded-xl px-4 py-2 text-sm text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOrganizationStatus(
                        selectedOrganization.id,
                        "HOLD",
                      );
                      setModal("NONE");
                    }}
                    className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Confirm hold
                  </button>
                </div>
              </div>
            ) : null}

            {modal === "ASSIGN_PROGRAM" ? (
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Program assignment
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Select a program for {selectedOrganization.name}. This
                  demonstration preserves the boundary between assignment
                  and authority.
                </p>
                <div className="mt-5 space-y-3">
                  {programs.slice(0, 4).map((program) => (
                    <button
                      key={program.id}
                      type="button"
                      onClick={() => {
                        setNotice(
                          `${program.name} assigned to ${selectedOrganization.name} as a governed draft assignment.`,
                        );
                        setModal("NONE");
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.06]"
                    >
                      <p className="font-medium text-white">
                        {program.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {program.id} · {program.start} to {program.end}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setModal("NONE")}
                    className="rounded-xl px-4 py-2 text-sm text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
