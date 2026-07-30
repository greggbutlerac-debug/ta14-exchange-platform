"use client";

/*
 * TA-14 Academy Research and Innovation Center
 * Governing principle: No admissible evidence. No admissible execution.
 * Production workspace for research portfolio governance, innovation initiatives, grants, ethics review, intellectual property,
 * collaboration, evidence preservation, milestones, budgets, institutional impact, and executive reporting.
 */

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

type TabKey =
  | "overview"
  | "success-plans"
  | "competencies"
  | "catalog"
  | "pathways"
  | "collaboration"
  | "observations"
  | "portfolio"
  | "improvement"
  | "readiness"
  | "evidence"
  | "reports"
  | "audit";

type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type PlanStatus = "DRAFT" | "ACTIVE" | "AT_RISK" | "COMPLETE" | "PAUSED";
type ActivityStatus = "PLANNED" | "OPEN" | "IN_PROGRESS" | "COMPLETE" | "CANCELLED";
type EvidenceStatus = "VERIFIED" | "PENDING" | "REJECTED" | "SUPERSEDED";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type CompetencyLevel = "FOUNDATIONAL" | "PRACTITIONER" | "ADVANCED" | "LEAD";
type ModalKey = "program" | "plan" | "activity" | "observation" | "evidence" | "improvement" | null;

type ProgramProfile = {
  id: string;
  name: string;
  email: string;
  title: string;
  program: string;
  status: "ACTIVE" | "REVIEW" | "LEAVE" | "INACTIVE";
  readiness: number;
  initiativeLoad: number;
  engagementHours: number;
  engagementTarget: number;
  advisorId: string | null;
  joined: string;
  nextReview: string;
  specialties: string[];
  goals: string[];
  notes: string;
};

type SuccessPlan = {
  id: string;
  programId: string;
  title: string;
  cycle: string;
  status: PlanStatus;
  priority: Priority;
  owner: string;
  start: string;
  due: string;
  progress: number;
  objectives: string[];
  successMeasures: string[];
  dependencies: string[];
  risks: string[];
  lastUpdate: string;
};

type Competency = {
  id: string;
  domain: string;
  name: string;
  description: string;
  requiredLevel: CompetencyLevel;
  evidenceStandard: string;
  revalidationMonths: number;
};

type CompetencyRecord = {
  id: string;
  programId: string;
  competencyId: string;
  level: CompetencyLevel;
  score: number;
  assessed: string;
  expires: string;
  assessor: string;
  evidenceIds: string[];
  determination: Determination;
};

type LearningActivity = {
  id: string;
  title: string;
  provider: string;
  category: string;
  format: "WORKSHOP" | "COURSE" | "COACHING" | "CONFERENCE" | "SELF_STUDY" | "LAB";
  status: ActivityStatus;
  start: string;
  end: string;
  hours: number;
  seats: number;
  enrolled: string[];
  competencyIds: string[];
  facilitator: string;
  description: string;
};

type LearningPathway = {
  id: string;
  name: string;
  audience: string;
  description: string;
  activityIds: string[];
  competencyIds: string[];
  estimatedHours: number;
  status: "DRAFT" | "PUBLISHED" | "RETIRED";
};

type Collaboration = {
  id: string;
  advisorId: string;
  adviseeId: string;
  focus: string;
  start: string;
  end: string;
  cadence: string;
  status: "PROPOSED" | "ACTIVE" | "COMPLETE" | "ON_HOLD";
  goals: string[];
  meetingCount: number;
  nextMeeting: string;
};

type Observation = {
  id: string;
  programId: string;
  reviewer: string;
  initiative: string;
  date: string;
  status: "SCHEDULED" | "COMPLETE" | "FOLLOW_UP" | "OVERDUE";
  score: number;
  strengths: string[];
  findings: string[];
  requiredActions: string[];
  evidenceIds: string[];
};

type PortfolioItem = {
  id: string;
  programId: string;
  title: string;
  category: string;
  created: string;
  summary: string;
  tags: string[];
  evidenceIds: string[];
  visibility: "PRIVATE" | "INSTITUTION" | "PUBLIC";
};

type ImprovementPlan = {
  id: string;
  programId: string;
  title: string;
  trigger: string;
  status: "OPEN" | "MONITORING" | "SATISFIED" | "ESCALATED";
  priority: Priority;
  opened: string;
  due: string;
  owner: string;
  actions: string[];
  checkpoints: string[];
  progress: number;
  determination: Determination;
};

type EvidenceRecord = {
  id: string;
  programId: string;
  title: string;
  type: string;
  source: string;
  captured: string;
  status: EvidenceStatus;
  hash: string;
  relatedIds: string[];
  limitations: string;
};

type AuditEvent = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  determination: Determination;
  detail: string;
};

type WorkspaceState = {
  schema: "TA14_ACADEMY_RESEARCH_INNOVATION_V1";
  program: ProgramProfile[];
  plans: SuccessPlan[];
  competencies: Competency[];
  competencyRecords: CompetencyRecord[];
  activities: LearningActivity[];
  pathways: LearningPathway[];
  collaborations: Collaboration[];
  observations: Observation[];
  portfolio: PortfolioItem[];
  improvements: ImprovementPlan[];
  evidence: EvidenceRecord[];
  audit: AuditEvent[];
};

const STORAGE_KEY = "ta14-academy-research-innovation-center-v1";
const today = () => new Date().toISOString().slice(0, 10);
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const competencyRank: Record<CompetencyLevel, number> = {
  FOUNDATIONAL: 1,
  PRACTITIONER: 2,
  ADVANCED: 3,
  LEAD: 4,
};

const determinationTone: Record<Determination, string> = {
  ALLOW: "#45d483",
  HOLD: "#f0c35c",
  DENY: "#ff6b76",
  ESCALATE: "#9f8cff",
};

const seedProgram: ProgramProfile[] = [
  {
    id: "FAC-001",
    name: "Dr. Mara Voss",
    email: "mara.voss@academy.example",
    title: "Lead Governance Advisor",
    program: "Admissible Execution",
    status: "ACTIVE",
    readiness: 96,
    initiativeLoad: 72,
    engagementHours: 31,
    engagementTarget: 36,
    advisorId: null,
    joined: "2025-08-12",
    nextReview: "2026-09-21",
    specialties: ["Evidence integrity", "Execution boundaries", "Institutional review"],
    goals: ["Publish advanced learning portfolio", "Qualify two new lead advisors"],
    notes: "Primary program lead for architecture and authority research portfolio.",
  },
  {
    id: "FAC-002",
    name: "Jordan Ellis",
    email: "jordan.ellis@academy.example",
    title: "Technical Research Portfolio Advisor",
    program: "HVAC Evidence Systems",
    status: "REVIEW",
    readiness: 81,
    initiativeLoad: 88,
    engagementHours: 18,
    engagementTarget: 30,
    advisorId: "FAC-001",
    joined: "2026-01-15",
    nextReview: "2026-08-11",
    specialties: ["Electrical evidence", "Field documentation", "Safety boundaries"],
    goals: ["Reduce learning overload", "Complete advanced facilitation pathway"],
    notes: "Workload adjustment is required before next cohort.",
  },
  {
    id: "FAC-003",
    name: "Priya Nand",
    email: "priya.nand@academy.example",
    title: "Assessment and Review Advisor",
    program: "Research Governance",
    status: "ACTIVE",
    readiness: 92,
    initiativeLoad: 61,
    engagementHours: 27,
    engagementTarget: 30,
    advisorId: "FAC-001",
    joined: "2025-11-04",
    nextReview: "2026-10-05",
    specialties: ["Assessment design", "Evidence review", "Corrective action"],
    goals: ["Lead assessor calibration", "Create challengeable rubric library"],
    notes: "Strong assessment practice and peer-review consistency.",
  },
  {
    id: "FAC-004",
    name: "Mateo Ruiz",
    email: "mateo.ruiz@academy.example",
    title: "Simulation Quality Review",
    program: "Applied Governance Labs",
    status: "ACTIVE",
    readiness: 87,
    initiativeLoad: 67,
    engagementHours: 24,
    engagementTarget: 30,
    advisorId: "FAC-003",
    joined: "2026-02-20",
    nextReview: "2026-11-12",
    specialties: ["Scenario design", "Simulation facilitation", "Debriefing"],
    goals: ["Complete lead simulator credential", "Build three cross-sector scenarios"],
    notes: "Expanding from HVAC labs into enterprise AI scenarios.",
  },
  {
    id: "FAC-005",
    name: "Amina Cole",
    email: "amina.cole@academy.example",
    title: "Adjunct Advisor",
    program: "Environmental Integrity",
    status: "LEAVE",
    readiness: 74,
    initiativeLoad: 32,
    engagementHours: 12,
    engagementTarget: 24,
    advisorId: "FAC-001",
    joined: "2026-03-10",
    nextReview: "2026-12-01",
    specialties: ["Indoor air evidence", "PAIR records", "Environmental literacy"],
    goals: ["Return-to-learning readiness review", "Refresh Academy platform training"],
    notes: "Approved leave through September 2026.",
  },
  {
    id: "FAC-006",
    name: "Daniel Cho",
    email: "daniel.cho@academy.example",
    title: "Research and Innovation Coordinator",
    program: "Research Operations",
    status: "ACTIVE",
    readiness: 94,
    initiativeLoad: 54,
    engagementHours: 38,
    engagementTarget: 36,
    advisorId: null,
    joined: "2025-09-22",
    nextReview: "2026-09-30",
    specialties: ["Quality coaching", "Quality analytics", "Learning design"],
    goals: ["Institutionalize advisoring review", "Publish annual compliance and assurance report"],
    notes: "Owns program-development cycle and institutional reporting.",
  },
  {
    id: "FAC-007",
    name: "Selene Brooks",
    email: "selene.brooks@academy.example",
    title: "Advisor",
    program: "Governed Records",
    status: "ACTIVE",
    readiness: 84,
    initiativeLoad: 79,
    engagementHours: 21,
    engagementTarget: 30,
    advisorId: "FAC-003",
    joined: "2026-04-01",
    nextReview: "2026-10-18",
    specialties: ["Record preservation", "Source attribution", "Registry workflows"],
    goals: ["Improve pacing in advanced modules", "Complete evidence challenge practicum"],
    notes: "High contributor satisfaction with pacing improvement opportunity.",
  },
  {
    id: "FAC-008",
    name: "Owen Hart",
    email: "owen.hart@academy.example",
    title: "Advisor Candidate",
    program: "Academy Foundations",
    status: "REVIEW",
    readiness: 69,
    initiativeLoad: 45,
    engagementHours: 14,
    engagementTarget: 24,
    advisorId: "FAC-002",
    joined: "2026-05-12",
    nextReview: "2026-08-25",
    specialties: ["Adult learning", "Technical orientation", "Field sequence"],
    goals: ["Earn initial learning authorization", "Complete three observed lessons"],
    notes: "Candidate remains under bounded co-learning authority.",
  },
];

const seedCompetencies: Competency[] = [
  {
    id: "CMP-001",
    domain: "Governance Foundations",
    name: "Evidence Before Intervention",
    description: "Separates observation, record, interpretation, and intervention without collapsing uncertainty.",
    requiredLevel: "ADVANCED",
    evidenceStandard: "Observed instruction plus preserved learning artifact and assessor calibration.",
    revalidationMonths: 12,
  },
  {
    id: "CMP-002",
    domain: "Governance Foundations",
    name: "Admissibility Before Execution",
    description: "Teaches why a permitted actor can still present an inadmissible action.",
    requiredLevel: "ADVANCED",
    evidenceStandard: "Scenario facilitation, challenge response, and validated determination record.",
    revalidationMonths: 12,
  },
  {
    id: "CMP-003",
    domain: "Research Practice",
    name: "Adult Learning Design",
    description: "Designs bounded, accessible learning for technical and institutional audiences.",
    requiredLevel: "PRACTITIONER",
    evidenceStandard: "Published lesson, contributor evidence, and research review.",
    revalidationMonths: 24,
  },
  {
    id: "CMP-004",
    domain: "Research Practice",
    name: "Facilitation and Debrief",
    description: "Facilitates consequence-bearing scenarios without supplying invented certainty.",
    requiredLevel: "ADVANCED",
    evidenceStandard: "Observed simulation and calibrated debrief rubric.",
    revalidationMonths: 12,
  },
  {
    id: "CMP-005",
    domain: "Assessment",
    name: "Evidence-Based Assessment",
    description: "Creates assessment instruments tied to declared competencies and challengeable evidence.",
    requiredLevel: "ADVANCED",
    evidenceStandard: "Assessment blueprint, moderation sample, and reliability review.",
    revalidationMonths: 12,
  },
  {
    id: "CMP-006",
    domain: "Assessment",
    name: "Corrective Feedback",
    description: "Provides actionable feedback while preserving source evidence and contributor dignity.",
    requiredLevel: "PRACTITIONER",
    evidenceStandard: "Observation record and contributor improvement evidence.",
    revalidationMonths: 18,
  },
  {
    id: "CMP-007",
    domain: "Institutional Practice",
    name: "Authority and Role Boundaries",
    description: "Operates only within declared learning, review, and credential authority.",
    requiredLevel: "LEAD",
    evidenceStandard: "Authority matrix review and conflict scenario performance.",
    revalidationMonths: 12,
  },
  {
    id: "CMP-008",
    domain: "Institutional Practice",
    name: "Conflict and Recusal",
    description: "Recognizes conflicts, records mitigation, and escalates when independence cannot be preserved.",
    requiredLevel: "ADVANCED",
    evidenceStandard: "Disclosure review and recusal case exercise.",
    revalidationMonths: 12,
  },
  {
    id: "CMP-009",
    domain: "Technical Practice",
    name: "HVAC Evidence Sequence",
    description: "Teaches the TA-14 field sequence without converting clues into diagnoses.",
    requiredLevel: "ADVANCED",
    evidenceStandard: "Observed lab, evidence packet, and safety boundary check.",
    revalidationMonths: 12,
  },
  {
    id: "CMP-010",
    domain: "Technical Practice",
    name: "Electrical Evidence",
    description: "Teaches electrical measurement sequence, expected values, and non-invasive boundaries.",
    requiredLevel: "PRACTITIONER",
    evidenceStandard: "Lab performance and preserved meter evidence.",
    revalidationMonths: 12,
  },
  {
    id: "CMP-011",
    domain: "Environmental Integrity",
    name: "AIR and PAIR Literacy",
    description: "Explains governed atmospheric records and their limitations.",
    requiredLevel: "PRACTITIONER",
    evidenceStandard: "Record interpretation exercise and limitation statement.",
    revalidationMonths: 18,
  },
  {
    id: "CMP-012",
    domain: "Digital Practice",
    name: "Academy Platform Operation",
    description: "Uses Academy workflows, local preservation, imports, exports, and audit history correctly.",
    requiredLevel: "PRACTITIONER",
    evidenceStandard: "Platform practicum and verified export packet.",
    revalidationMonths: 24,
  },
  {
    id: "CMP-013",
    domain: "Digital Practice",
    name: "Accessible Learning Delivery",
    description: "Meets accessibility expectations across content, interaction, and assessment.",
    requiredLevel: "PRACTITIONER",
    evidenceStandard: "Accessibility review and contributor accommodation artifact.",
    revalidationMonths: 24,
  },
  {
    id: "CMP-014",
    domain: "Leadership",
    name: "Quality Review and Improvement Coaching",
    description: "Guides program growth without laundering authority or suppressing adverse evidence.",
    requiredLevel: "LEAD",
    evidenceStandard: "Advisoring record, observed coaching, and outcome review.",
    revalidationMonths: 18,
  },
  {
    id: "CMP-015",
    domain: "Leadership",
    name: "Quality Stewardship",
    description: "Maintains research portfolio continuity, version lineage, and institutional boundaries.",
    requiredLevel: "LEAD",
    evidenceStandard: "Research ethics packet, reproducibility record, and innovation council determination.",
    revalidationMonths: 12,
  },
];

const seedCompetencyRecords: CompetencyRecord[] = [
  {
    id: "CCR-001",
    programId: "FAC-001",
    competencyId: "CMP-001",
    level: "FOUNDATIONAL",
    score: 68,
    assessed: "2026-03-01",
    expires: "2027-03-01",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-001"],
    determination: "ESCALATE",
  },
  {
    id: "CCR-002",
    programId: "FAC-001",
    competencyId: "CMP-002",
    level: "PRACTITIONER",
    score: 73,
    assessed: "2026-04-03",
    expires: "2027-04-03",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-002"],
    determination: "HOLD",
  },
  {
    id: "CCR-003",
    programId: "FAC-001",
    competencyId: "CMP-003",
    level: "ADVANCED",
    score: 78,
    assessed: "2026-05-05",
    expires: "2027-05-05",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-003"],
    determination: "HOLD",
  },
  {
    id: "CCR-004",
    programId: "FAC-001",
    competencyId: "CMP-004",
    level: "LEAD",
    score: 83,
    assessed: "2026-06-07",
    expires: "2027-06-07",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-004"],
    determination: "ALLOW",
  },
  {
    id: "CCR-005",
    programId: "FAC-001",
    competencyId: "CMP-005",
    level: "FOUNDATIONAL",
    score: 88,
    assessed: "2026-07-09",
    expires: "2027-07-09",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-005"],
    determination: "ALLOW",
  },
  {
    id: "CCR-006",
    programId: "FAC-001",
    competencyId: "CMP-006",
    level: "PRACTITIONER",
    score: 93,
    assessed: "2026-01-11",
    expires: "2027-01-11",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-006"],
    determination: "ALLOW",
  },
  {
    id: "CCR-007",
    programId: "FAC-001",
    competencyId: "CMP-007",
    level: "ADVANCED",
    score: 98,
    assessed: "2026-02-13",
    expires: "2027-02-13",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-007"],
    determination: "ALLOW",
  },
  {
    id: "CCR-008",
    programId: "FAC-001",
    competencyId: "CMP-008",
    level: "LEAD",
    score: 72,
    assessed: "2026-03-15",
    expires: "2027-03-15",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-008"],
    determination: "HOLD",
  },
  {
    id: "CCR-009",
    programId: "FAC-002",
    competencyId: "CMP-001",
    level: "PRACTITIONER",
    score: 75,
    assessed: "2026-03-04",
    expires: "2027-03-04",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-009"],
    determination: "HOLD",
  },
  {
    id: "CCR-010",
    programId: "FAC-002",
    competencyId: "CMP-002",
    level: "ADVANCED",
    score: 80,
    assessed: "2026-04-06",
    expires: "2027-04-06",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-010"],
    determination: "ALLOW",
  },
  {
    id: "CCR-011",
    programId: "FAC-002",
    competencyId: "CMP-003",
    level: "LEAD",
    score: 85,
    assessed: "2026-05-08",
    expires: "2027-05-08",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-011"],
    determination: "ALLOW",
  },
  {
    id: "CCR-012",
    programId: "FAC-002",
    competencyId: "CMP-004",
    level: "FOUNDATIONAL",
    score: 90,
    assessed: "2026-06-10",
    expires: "2027-06-10",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-012"],
    determination: "ALLOW",
  },
  {
    id: "CCR-013",
    programId: "FAC-002",
    competencyId: "CMP-005",
    level: "PRACTITIONER",
    score: 95,
    assessed: "2026-07-12",
    expires: "2027-07-12",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-013"],
    determination: "ALLOW",
  },
  {
    id: "CCR-014",
    programId: "FAC-002",
    competencyId: "CMP-006",
    level: "ADVANCED",
    score: 69,
    assessed: "2026-01-14",
    expires: "2027-01-14",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-014"],
    determination: "ESCALATE",
  },
  {
    id: "CCR-015",
    programId: "FAC-002",
    competencyId: "CMP-007",
    level: "LEAD",
    score: 74,
    assessed: "2026-02-16",
    expires: "2027-02-16",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-015"],
    determination: "HOLD",
  },
  {
    id: "CCR-016",
    programId: "FAC-002",
    competencyId: "CMP-008",
    level: "FOUNDATIONAL",
    score: 79,
    assessed: "2026-03-18",
    expires: "2027-03-18",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-016"],
    determination: "HOLD",
  },
  {
    id: "CCR-017",
    programId: "FAC-003",
    competencyId: "CMP-001",
    level: "ADVANCED",
    score: 82,
    assessed: "2026-03-07",
    expires: "2027-03-07",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-017"],
    determination: "ALLOW",
  },
  {
    id: "CCR-018",
    programId: "FAC-003",
    competencyId: "CMP-002",
    level: "LEAD",
    score: 87,
    assessed: "2026-04-09",
    expires: "2027-04-09",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-018"],
    determination: "ALLOW",
  },
  {
    id: "CCR-019",
    programId: "FAC-003",
    competencyId: "CMP-003",
    level: "FOUNDATIONAL",
    score: 92,
    assessed: "2026-05-11",
    expires: "2027-05-11",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-019"],
    determination: "ALLOW",
  },
  {
    id: "CCR-020",
    programId: "FAC-003",
    competencyId: "CMP-004",
    level: "PRACTITIONER",
    score: 97,
    assessed: "2026-06-13",
    expires: "2027-06-13",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-020"],
    determination: "ALLOW",
  },
  {
    id: "CCR-021",
    programId: "FAC-003",
    competencyId: "CMP-005",
    level: "ADVANCED",
    score: 71,
    assessed: "2026-07-15",
    expires: "2027-07-15",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-021"],
    determination: "HOLD",
  },
  {
    id: "CCR-022",
    programId: "FAC-003",
    competencyId: "CMP-006",
    level: "LEAD",
    score: 76,
    assessed: "2026-01-17",
    expires: "2027-01-17",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-022"],
    determination: "HOLD",
  },
  {
    id: "CCR-023",
    programId: "FAC-003",
    competencyId: "CMP-007",
    level: "FOUNDATIONAL",
    score: 81,
    assessed: "2026-02-19",
    expires: "2027-02-19",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-023"],
    determination: "ALLOW",
  },
  {
    id: "CCR-024",
    programId: "FAC-003",
    competencyId: "CMP-008",
    level: "PRACTITIONER",
    score: 86,
    assessed: "2026-03-21",
    expires: "2027-03-21",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-024"],
    determination: "ALLOW",
  },
  {
    id: "CCR-025",
    programId: "FAC-004",
    competencyId: "CMP-001",
    level: "LEAD",
    score: 89,
    assessed: "2026-03-10",
    expires: "2027-03-10",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-025"],
    determination: "ALLOW",
  },
  {
    id: "CCR-026",
    programId: "FAC-004",
    competencyId: "CMP-002",
    level: "FOUNDATIONAL",
    score: 94,
    assessed: "2026-04-12",
    expires: "2027-04-12",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-026"],
    determination: "ALLOW",
  },
  {
    id: "CCR-027",
    programId: "FAC-004",
    competencyId: "CMP-003",
    level: "PRACTITIONER",
    score: 68,
    assessed: "2026-05-14",
    expires: "2027-05-14",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-027"],
    determination: "ESCALATE",
  },
  {
    id: "CCR-028",
    programId: "FAC-004",
    competencyId: "CMP-004",
    level: "ADVANCED",
    score: 73,
    assessed: "2026-06-16",
    expires: "2027-06-16",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-028"],
    determination: "HOLD",
  },
  {
    id: "CCR-029",
    programId: "FAC-004",
    competencyId: "CMP-005",
    level: "LEAD",
    score: 78,
    assessed: "2026-07-18",
    expires: "2027-07-18",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-029"],
    determination: "HOLD",
  },
  {
    id: "CCR-030",
    programId: "FAC-004",
    competencyId: "CMP-006",
    level: "FOUNDATIONAL",
    score: 83,
    assessed: "2026-01-20",
    expires: "2027-01-20",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-030"],
    determination: "ALLOW",
  },
  {
    id: "CCR-031",
    programId: "FAC-004",
    competencyId: "CMP-007",
    level: "PRACTITIONER",
    score: 88,
    assessed: "2026-02-22",
    expires: "2027-02-22",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-031"],
    determination: "ALLOW",
  },
  {
    id: "CCR-032",
    programId: "FAC-004",
    competencyId: "CMP-008",
    level: "ADVANCED",
    score: 93,
    assessed: "2026-03-24",
    expires: "2027-03-24",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-032"],
    determination: "ALLOW",
  },
  {
    id: "CCR-033",
    programId: "FAC-005",
    competencyId: "CMP-001",
    level: "FOUNDATIONAL",
    score: 96,
    assessed: "2026-03-13",
    expires: "2027-03-13",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-033"],
    determination: "ALLOW",
  },
  {
    id: "CCR-034",
    programId: "FAC-005",
    competencyId: "CMP-002",
    level: "PRACTITIONER",
    score: 70,
    assessed: "2026-04-15",
    expires: "2027-04-15",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-034"],
    determination: "HOLD",
  },
  {
    id: "CCR-035",
    programId: "FAC-005",
    competencyId: "CMP-003",
    level: "ADVANCED",
    score: 75,
    assessed: "2026-05-17",
    expires: "2027-05-17",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-035"],
    determination: "HOLD",
  },
  {
    id: "CCR-036",
    programId: "FAC-005",
    competencyId: "CMP-004",
    level: "LEAD",
    score: 80,
    assessed: "2026-06-19",
    expires: "2027-06-19",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-036"],
    determination: "ALLOW",
  },
  {
    id: "CCR-037",
    programId: "FAC-005",
    competencyId: "CMP-005",
    level: "FOUNDATIONAL",
    score: 85,
    assessed: "2026-07-21",
    expires: "2027-07-21",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-037"],
    determination: "ALLOW",
  },
  {
    id: "CCR-038",
    programId: "FAC-005",
    competencyId: "CMP-006",
    level: "PRACTITIONER",
    score: 90,
    assessed: "2026-01-23",
    expires: "2027-01-23",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-038"],
    determination: "ALLOW",
  },
  {
    id: "CCR-039",
    programId: "FAC-005",
    competencyId: "CMP-007",
    level: "ADVANCED",
    score: 95,
    assessed: "2026-02-01",
    expires: "2027-02-01",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-039"],
    determination: "ALLOW",
  },
  {
    id: "CCR-040",
    programId: "FAC-005",
    competencyId: "CMP-008",
    level: "LEAD",
    score: 69,
    assessed: "2026-03-03",
    expires: "2027-03-03",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-040"],
    determination: "ESCALATE",
  },
  {
    id: "CCR-041",
    programId: "FAC-006",
    competencyId: "CMP-001",
    level: "PRACTITIONER",
    score: 72,
    assessed: "2026-03-16",
    expires: "2027-03-16",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-041"],
    determination: "HOLD",
  },
  {
    id: "CCR-042",
    programId: "FAC-006",
    competencyId: "CMP-002",
    level: "ADVANCED",
    score: 77,
    assessed: "2026-04-18",
    expires: "2027-04-18",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-042"],
    determination: "HOLD",
  },
  {
    id: "CCR-043",
    programId: "FAC-006",
    competencyId: "CMP-003",
    level: "LEAD",
    score: 82,
    assessed: "2026-05-20",
    expires: "2027-05-20",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-043"],
    determination: "ALLOW",
  },
  {
    id: "CCR-044",
    programId: "FAC-006",
    competencyId: "CMP-004",
    level: "FOUNDATIONAL",
    score: 87,
    assessed: "2026-06-22",
    expires: "2027-06-22",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-044"],
    determination: "ALLOW",
  },
  {
    id: "CCR-045",
    programId: "FAC-006",
    competencyId: "CMP-005",
    level: "PRACTITIONER",
    score: 92,
    assessed: "2026-07-24",
    expires: "2027-07-24",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-045"],
    determination: "ALLOW",
  },
  {
    id: "CCR-046",
    programId: "FAC-006",
    competencyId: "CMP-006",
    level: "ADVANCED",
    score: 97,
    assessed: "2026-01-02",
    expires: "2027-01-02",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-046"],
    determination: "ALLOW",
  },
  {
    id: "CCR-047",
    programId: "FAC-006",
    competencyId: "CMP-007",
    level: "LEAD",
    score: 71,
    assessed: "2026-02-04",
    expires: "2027-02-04",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-047"],
    determination: "HOLD",
  },
  {
    id: "CCR-048",
    programId: "FAC-006",
    competencyId: "CMP-008",
    level: "FOUNDATIONAL",
    score: 76,
    assessed: "2026-03-06",
    expires: "2027-03-06",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-048"],
    determination: "HOLD",
  },
  {
    id: "CCR-049",
    programId: "FAC-007",
    competencyId: "CMP-001",
    level: "ADVANCED",
    score: 79,
    assessed: "2026-03-19",
    expires: "2027-03-19",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-049"],
    determination: "HOLD",
  },
  {
    id: "CCR-050",
    programId: "FAC-007",
    competencyId: "CMP-002",
    level: "LEAD",
    score: 84,
    assessed: "2026-04-21",
    expires: "2027-04-21",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-050"],
    determination: "ALLOW",
  },
  {
    id: "CCR-051",
    programId: "FAC-007",
    competencyId: "CMP-003",
    level: "FOUNDATIONAL",
    score: 89,
    assessed: "2026-05-23",
    expires: "2027-05-23",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-051"],
    determination: "ALLOW",
  },
  {
    id: "CCR-052",
    programId: "FAC-007",
    competencyId: "CMP-004",
    level: "PRACTITIONER",
    score: 94,
    assessed: "2026-06-01",
    expires: "2027-06-01",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-052"],
    determination: "ALLOW",
  },
  {
    id: "CCR-053",
    programId: "FAC-007",
    competencyId: "CMP-005",
    level: "ADVANCED",
    score: 68,
    assessed: "2026-07-03",
    expires: "2027-07-03",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-053"],
    determination: "ESCALATE",
  },
  {
    id: "CCR-054",
    programId: "FAC-007",
    competencyId: "CMP-006",
    level: "LEAD",
    score: 73,
    assessed: "2026-01-05",
    expires: "2027-01-05",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-054"],
    determination: "HOLD",
  },
  {
    id: "CCR-055",
    programId: "FAC-007",
    competencyId: "CMP-007",
    level: "FOUNDATIONAL",
    score: 78,
    assessed: "2026-02-07",
    expires: "2027-02-07",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-055"],
    determination: "HOLD",
  },
  {
    id: "CCR-056",
    programId: "FAC-007",
    competencyId: "CMP-008",
    level: "PRACTITIONER",
    score: 83,
    assessed: "2026-03-09",
    expires: "2027-03-09",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-056"],
    determination: "ALLOW",
  },
  {
    id: "CCR-057",
    programId: "FAC-008",
    competencyId: "CMP-001",
    level: "LEAD",
    score: 86,
    assessed: "2026-03-22",
    expires: "2027-03-22",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-057"],
    determination: "ALLOW",
  },
  {
    id: "CCR-058",
    programId: "FAC-008",
    competencyId: "CMP-002",
    level: "FOUNDATIONAL",
    score: 91,
    assessed: "2026-04-24",
    expires: "2027-04-24",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-058"],
    determination: "ALLOW",
  },
  {
    id: "CCR-059",
    programId: "FAC-008",
    competencyId: "CMP-003",
    level: "PRACTITIONER",
    score: 96,
    assessed: "2026-05-02",
    expires: "2027-05-02",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-059"],
    determination: "ALLOW",
  },
  {
    id: "CCR-060",
    programId: "FAC-008",
    competencyId: "CMP-004",
    level: "ADVANCED",
    score: 70,
    assessed: "2026-06-04",
    expires: "2027-06-04",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-060"],
    determination: "HOLD",
  },
  {
    id: "CCR-061",
    programId: "FAC-008",
    competencyId: "CMP-005",
    level: "LEAD",
    score: 75,
    assessed: "2026-07-06",
    expires: "2027-07-06",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-061"],
    determination: "HOLD",
  },
  {
    id: "CCR-062",
    programId: "FAC-008",
    competencyId: "CMP-006",
    level: "FOUNDATIONAL",
    score: 80,
    assessed: "2026-01-08",
    expires: "2027-01-08",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-062"],
    determination: "ALLOW",
  },
  {
    id: "CCR-063",
    programId: "FAC-008",
    competencyId: "CMP-007",
    level: "PRACTITIONER",
    score: 85,
    assessed: "2026-02-10",
    expires: "2027-02-10",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-063"],
    determination: "ALLOW",
  },
  {
    id: "CCR-064",
    programId: "FAC-008",
    competencyId: "CMP-008",
    level: "ADVANCED",
    score: 90,
    assessed: "2026-03-12",
    expires: "2027-03-12",
    assessor: "Quality Review Panel",
    evidenceIds: ["EVD-064"],
    determination: "ALLOW",
  },
];

const seedPlans: SuccessPlan[] = [
  {
    id: "PLN-001",
    programId: "FAC-001",
    title: "2026 Research Advancement Plan \u2014 Dr. Mara Voss",
    cycle: "2026 Annual Cycle",
    status: "ACTIVE",
    priority: "HIGH",
    owner: "Daniel Cho",
    start: "2026-01-15",
    due: "2026-09-11",
    progress: 82,
    objectives: ["Evidence integrity", "Execution boundaries"],
    successMeasures: ["Observed practice meets declared competency threshold", "Evidence packet is complete and challengeable"],
    dependencies: ["Scheduled observation", "Required learning activities"],
    risks: [],
    lastUpdate: "2026-07-25",
  },
  {
    id: "PLN-002",
    programId: "FAC-002",
    title: "2026 Research Advancement Plan \u2014 Jordan Ellis",
    cycle: "2026 Annual Cycle",
    status: "AT_RISK",
    priority: "CRITICAL",
    owner: "Daniel Cho",
    start: "2026-01-15",
    due: "2026-10-12",
    progress: 58,
    objectives: ["Electrical evidence", "Field documentation"],
    successMeasures: ["Observed practice meets declared competency threshold", "Evidence packet is complete and challengeable"],
    dependencies: ["Scheduled observation", "Required learning activities"],
    risks: ["Initiative load may delay milestones"],
    lastUpdate: "2026-07-25",
  },
  {
    id: "PLN-003",
    programId: "FAC-003",
    title: "2026 Research Advancement Plan \u2014 Priya Nand",
    cycle: "2026 Annual Cycle",
    status: "ACTIVE",
    priority: "MEDIUM",
    owner: "Daniel Cho",
    start: "2026-01-15",
    due: "2026-11-13",
    progress: 76,
    objectives: ["Assessment design", "Evidence review"],
    successMeasures: ["Observed practice meets declared competency threshold", "Evidence packet is complete and challengeable"],
    dependencies: ["Scheduled observation", "Required learning activities"],
    risks: [],
    lastUpdate: "2026-07-25",
  },
  {
    id: "PLN-004",
    programId: "FAC-004",
    title: "2026 Research Advancement Plan \u2014 Mateo Ruiz",
    cycle: "2026 Annual Cycle",
    status: "ACTIVE",
    priority: "MEDIUM",
    owner: "Daniel Cho",
    start: "2026-01-15",
    due: "2026-08-14",
    progress: 71,
    objectives: ["Scenario design", "Simulation facilitation"],
    successMeasures: ["Observed practice meets declared competency threshold", "Evidence packet is complete and challengeable"],
    dependencies: ["Scheduled observation", "Required learning activities"],
    risks: [],
    lastUpdate: "2026-07-25",
  },
  {
    id: "PLN-005",
    programId: "FAC-005",
    title: "2026 Research Advancement Plan \u2014 Amina Cole",
    cycle: "2026 Annual Cycle",
    status: "PAUSED",
    priority: "HIGH",
    owner: "Daniel Cho",
    start: "2026-01-15",
    due: "2026-09-15",
    progress: 43,
    objectives: ["Indoor air evidence", "PAIR records"],
    successMeasures: ["Observed practice meets declared competency threshold", "Evidence packet is complete and challengeable"],
    dependencies: ["Scheduled observation", "Required learning activities"],
    risks: [],
    lastUpdate: "2026-07-25",
  },
  {
    id: "PLN-006",
    programId: "FAC-006",
    title: "2026 Research Advancement Plan \u2014 Daniel Cho",
    cycle: "2026 Annual Cycle",
    status: "ACTIVE",
    priority: "MEDIUM",
    owner: "Daniel Cho",
    start: "2026-01-15",
    due: "2026-10-16",
    progress: 88,
    objectives: ["Quality coaching", "Quality analytics"],
    successMeasures: ["Observed practice meets declared competency threshold", "Evidence packet is complete and challengeable"],
    dependencies: ["Scheduled observation", "Required learning activities"],
    risks: [],
    lastUpdate: "2026-07-25",
  },
  {
    id: "PLN-007",
    programId: "FAC-007",
    title: "2026 Research Advancement Plan \u2014 Selene Brooks",
    cycle: "2026 Annual Cycle",
    status: "ACTIVE",
    priority: "HIGH",
    owner: "Daniel Cho",
    start: "2026-01-15",
    due: "2026-11-17",
    progress: 69,
    objectives: ["Record preservation", "Source attribution"],
    successMeasures: ["Observed practice meets declared competency threshold", "Evidence packet is complete and challengeable"],
    dependencies: ["Scheduled observation", "Required learning activities"],
    risks: ["Initiative load may delay milestones"],
    lastUpdate: "2026-07-25",
  },
  {
    id: "PLN-008",
    programId: "FAC-008",
    title: "2026 Research Advancement Plan \u2014 Owen Hart",
    cycle: "2026 Annual Cycle",
    status: "DRAFT",
    priority: "HIGH",
    owner: "Daniel Cho",
    start: "2026-01-15",
    due: "2026-08-18",
    progress: 35,
    objectives: ["Adult learning", "Technical orientation"],
    successMeasures: ["Observed practice meets declared competency threshold", "Evidence packet is complete and challengeable"],
    dependencies: ["Scheduled observation", "Required learning activities"],
    risks: [],
    lastUpdate: "2026-07-25",
  },
];

const seedActivities: LearningActivity[] = [
  {
    id: "ACT-001",
    title: "Calibrated Evidence Review 1",
    provider: "TA-14 Academy",
    category: "Research Practice",
    format: "WORKSHOP",
    status: "OPEN",
    start: "2026-08-03",
    end: "2026-09-05",
    hours: 3,
    seats: 9,
    enrolled: ["FAC-002", "FAC-003"],
    competencyIds: ["CMP-001"],
    facilitator: "Mateo Ruiz",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-002",
    title: "Advanced Scenario Facilitation 1",
    provider: "TA-14 Academy",
    category: "Governance Foundations",
    format: "COURSE",
    status: "IN_PROGRESS",
    start: "2026-09-05",
    end: "2026-10-07",
    hours: 4,
    seats: 10,
    enrolled: ["FAC-003", "FAC-004", "FAC-005"],
    competencyIds: ["CMP-002"],
    facilitator: "Amina Cole",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-003",
    title: "Accessible Initiative Design 1",
    provider: "TA-14 Academy",
    category: "Assessment",
    format: "COACHING",
    status: "PLANNED",
    start: "2026-10-07",
    end: "2026-11-09",
    hours: 5,
    seats: 11,
    enrolled: ["FAC-004", "FAC-005", "FAC-006", "FAC-007"],
    competencyIds: ["CMP-003"],
    facilitator: "Daniel Cho",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-004",
    title: "Authority Boundary Practicum 1",
    provider: "TA-14 Academy",
    category: "Technical Practice",
    format: "CONFERENCE",
    status: "COMPLETE",
    start: "2026-11-09",
    end: "2026-12-11",
    hours: 6,
    seats: 12,
    enrolled: ["FAC-005"],
    competencyIds: ["CMP-004"],
    facilitator: "Selene Brooks",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-005",
    title: "HVAC Evidence Lab 1",
    provider: "TA-14 Academy",
    category: "Leadership",
    format: "SELF_STUDY",
    status: "OPEN",
    start: "2026-12-11",
    end: "2026-01-13",
    hours: 7,
    seats: 13,
    enrolled: ["FAC-006", "FAC-007"],
    competencyIds: ["CMP-005"],
    facilitator: "Owen Hart",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-006",
    title: "Advisor Coaching Roundtable 1",
    provider: "TA-14 Academy",
    category: "Digital Practice",
    format: "LAB",
    status: "IN_PROGRESS",
    start: "2026-01-13",
    end: "2026-02-15",
    hours: 8,
    seats: 14,
    enrolled: ["FAC-007", "FAC-008", "FAC-001"],
    competencyIds: ["CMP-006"],
    facilitator: "Dr. Mara Voss",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-007",
    title: "Assessment Moderation Studio 1",
    provider: "TA-14 Academy",
    category: "Research Practice",
    format: "WORKSHOP",
    status: "PLANNED",
    start: "2026-02-15",
    end: "2026-03-17",
    hours: 2,
    seats: 15,
    enrolled: ["FAC-008", "FAC-001", "FAC-002", "FAC-003"],
    competencyIds: ["CMP-007"],
    facilitator: "Jordan Ellis",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-008",
    title: "Governed Records Workshop 1",
    provider: "TA-14 Academy",
    category: "Governance Foundations",
    format: "COURSE",
    status: "COMPLETE",
    start: "2026-03-17",
    end: "2026-04-19",
    hours: 3,
    seats: 16,
    enrolled: ["FAC-001"],
    competencyIds: ["CMP-008"],
    facilitator: "Priya Nand",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-009",
    title: "PAIR Interpretation Lab 1",
    provider: "TA-14 Academy",
    category: "Assessment",
    format: "COACHING",
    status: "OPEN",
    start: "2026-04-19",
    end: "2026-05-21",
    hours: 4,
    seats: 17,
    enrolled: ["FAC-002", "FAC-003"],
    competencyIds: ["CMP-009"],
    facilitator: "Mateo Ruiz",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-010",
    title: "Learning Portfolio Clinic 1",
    provider: "TA-14 Academy",
    category: "Technical Practice",
    format: "CONFERENCE",
    status: "IN_PROGRESS",
    start: "2026-05-21",
    end: "2026-06-23",
    hours: 5,
    seats: 18,
    enrolled: ["FAC-003", "FAC-004", "FAC-005"],
    competencyIds: ["CMP-010"],
    facilitator: "Amina Cole",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-011",
    title: "Calibrated Evidence Review 2",
    provider: "TA-14 Academy",
    category: "Leadership",
    format: "SELF_STUDY",
    status: "PLANNED",
    start: "2026-06-23",
    end: "2026-07-01",
    hours: 6,
    seats: 19,
    enrolled: ["FAC-004", "FAC-005", "FAC-006", "FAC-007"],
    competencyIds: ["CMP-011"],
    facilitator: "Daniel Cho",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-012",
    title: "Advanced Scenario Facilitation 2",
    provider: "TA-14 Academy",
    category: "Digital Practice",
    format: "LAB",
    status: "COMPLETE",
    start: "2026-07-01",
    end: "2026-08-03",
    hours: 7,
    seats: 20,
    enrolled: ["FAC-005"],
    competencyIds: ["CMP-012"],
    facilitator: "Selene Brooks",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-013",
    title: "Accessible Initiative Design 2",
    provider: "TA-14 Academy",
    category: "Research Practice",
    format: "WORKSHOP",
    status: "OPEN",
    start: "2026-08-03",
    end: "2026-09-05",
    hours: 8,
    seats: 8,
    enrolled: ["FAC-006", "FAC-007"],
    competencyIds: ["CMP-013"],
    facilitator: "Owen Hart",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-014",
    title: "Authority Boundary Practicum 2",
    provider: "TA-14 Academy",
    category: "Governance Foundations",
    format: "COURSE",
    status: "IN_PROGRESS",
    start: "2026-09-05",
    end: "2026-10-07",
    hours: 2,
    seats: 9,
    enrolled: ["FAC-007", "FAC-008", "FAC-001"],
    competencyIds: ["CMP-014"],
    facilitator: "Dr. Mara Voss",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-015",
    title: "HVAC Evidence Lab 2",
    provider: "TA-14 Academy",
    category: "Assessment",
    format: "COACHING",
    status: "PLANNED",
    start: "2026-10-07",
    end: "2026-11-09",
    hours: 3,
    seats: 10,
    enrolled: ["FAC-008", "FAC-001", "FAC-002", "FAC-003"],
    competencyIds: ["CMP-015"],
    facilitator: "Jordan Ellis",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-016",
    title: "Advisor Coaching Roundtable 2",
    provider: "TA-14 Academy",
    category: "Technical Practice",
    format: "CONFERENCE",
    status: "COMPLETE",
    start: "2026-11-09",
    end: "2026-12-11",
    hours: 4,
    seats: 11,
    enrolled: ["FAC-001"],
    competencyIds: ["CMP-001"],
    facilitator: "Priya Nand",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-017",
    title: "Assessment Moderation Studio 2",
    provider: "TA-14 Academy",
    category: "Leadership",
    format: "SELF_STUDY",
    status: "OPEN",
    start: "2026-12-11",
    end: "2026-01-13",
    hours: 5,
    seats: 12,
    enrolled: ["FAC-002", "FAC-003"],
    competencyIds: ["CMP-002"],
    facilitator: "Mateo Ruiz",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-018",
    title: "Governed Records Workshop 2",
    provider: "TA-14 Academy",
    category: "Digital Practice",
    format: "LAB",
    status: "IN_PROGRESS",
    start: "2026-01-13",
    end: "2026-02-15",
    hours: 6,
    seats: 13,
    enrolled: ["FAC-003", "FAC-004", "FAC-005"],
    competencyIds: ["CMP-003"],
    facilitator: "Amina Cole",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-019",
    title: "PAIR Interpretation Lab 2",
    provider: "TA-14 Academy",
    category: "Research Practice",
    format: "WORKSHOP",
    status: "PLANNED",
    start: "2026-02-15",
    end: "2026-03-17",
    hours: 7,
    seats: 14,
    enrolled: ["FAC-004", "FAC-005", "FAC-006", "FAC-007"],
    competencyIds: ["CMP-004"],
    facilitator: "Daniel Cho",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-020",
    title: "Learning Portfolio Clinic 2",
    provider: "TA-14 Academy",
    category: "Governance Foundations",
    format: "COURSE",
    status: "COMPLETE",
    start: "2026-03-17",
    end: "2026-04-19",
    hours: 8,
    seats: 15,
    enrolled: ["FAC-005"],
    competencyIds: ["CMP-005"],
    facilitator: "Selene Brooks",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-021",
    title: "Calibrated Evidence Review 3",
    provider: "TA-14 Academy",
    category: "Assessment",
    format: "COACHING",
    status: "OPEN",
    start: "2026-04-19",
    end: "2026-05-21",
    hours: 2,
    seats: 16,
    enrolled: ["FAC-006", "FAC-007"],
    competencyIds: ["CMP-006"],
    facilitator: "Owen Hart",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-022",
    title: "Advanced Scenario Facilitation 3",
    provider: "TA-14 Academy",
    category: "Technical Practice",
    format: "CONFERENCE",
    status: "IN_PROGRESS",
    start: "2026-05-21",
    end: "2026-06-23",
    hours: 3,
    seats: 17,
    enrolled: ["FAC-007", "FAC-008", "FAC-001"],
    competencyIds: ["CMP-007"],
    facilitator: "Dr. Mara Voss",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-023",
    title: "Accessible Initiative Design 3",
    provider: "TA-14 Academy",
    category: "Leadership",
    format: "SELF_STUDY",
    status: "PLANNED",
    start: "2026-06-23",
    end: "2026-07-01",
    hours: 4,
    seats: 18,
    enrolled: ["FAC-008", "FAC-001", "FAC-002", "FAC-003"],
    competencyIds: ["CMP-008"],
    facilitator: "Jordan Ellis",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-024",
    title: "Authority Boundary Practicum 3",
    provider: "TA-14 Academy",
    category: "Digital Practice",
    format: "LAB",
    status: "COMPLETE",
    start: "2026-07-01",
    end: "2026-08-03",
    hours: 5,
    seats: 19,
    enrolled: ["FAC-001"],
    competencyIds: ["CMP-009"],
    facilitator: "Priya Nand",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-025",
    title: "HVAC Evidence Lab 3",
    provider: "TA-14 Academy",
    category: "Research Practice",
    format: "WORKSHOP",
    status: "OPEN",
    start: "2026-08-03",
    end: "2026-09-05",
    hours: 6,
    seats: 20,
    enrolled: ["FAC-002", "FAC-003"],
    competencyIds: ["CMP-010"],
    facilitator: "Mateo Ruiz",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-026",
    title: "Advisor Coaching Roundtable 3",
    provider: "TA-14 Academy",
    category: "Governance Foundations",
    format: "COURSE",
    status: "IN_PROGRESS",
    start: "2026-09-05",
    end: "2026-10-07",
    hours: 7,
    seats: 8,
    enrolled: ["FAC-003", "FAC-004", "FAC-005"],
    competencyIds: ["CMP-011"],
    facilitator: "Amina Cole",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-027",
    title: "Assessment Moderation Studio 3",
    provider: "TA-14 Academy",
    category: "Assessment",
    format: "COACHING",
    status: "PLANNED",
    start: "2026-10-07",
    end: "2026-11-09",
    hours: 8,
    seats: 9,
    enrolled: ["FAC-004", "FAC-005", "FAC-006", "FAC-007"],
    competencyIds: ["CMP-012"],
    facilitator: "Daniel Cho",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-028",
    title: "Governed Records Workshop 3",
    provider: "TA-14 Academy",
    category: "Technical Practice",
    format: "CONFERENCE",
    status: "COMPLETE",
    start: "2026-11-09",
    end: "2026-12-11",
    hours: 2,
    seats: 10,
    enrolled: ["FAC-005"],
    competencyIds: ["CMP-013"],
    facilitator: "Selene Brooks",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-029",
    title: "PAIR Interpretation Lab 3",
    provider: "TA-14 Academy",
    category: "Leadership",
    format: "SELF_STUDY",
    status: "OPEN",
    start: "2026-12-11",
    end: "2026-01-13",
    hours: 3,
    seats: 11,
    enrolled: ["FAC-006", "FAC-007"],
    competencyIds: ["CMP-014"],
    facilitator: "Owen Hart",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
  {
    id: "ACT-030",
    title: "Learning Portfolio Clinic 3",
    provider: "TA-14 Academy",
    category: "Digital Practice",
    format: "LAB",
    status: "IN_PROGRESS",
    start: "2026-01-13",
    end: "2026-02-15",
    hours: 4,
    seats: 12,
    enrolled: ["FAC-007", "FAC-008", "FAC-001"],
    competencyIds: ["CMP-015"],
    facilitator: "Dr. Mara Voss",
    description: "Structured compliance and assurance activity with preserved participation evidence, declared outcomes, and bounded authority.",
  },
];

const seedPathways: LearningPathway[] = [
  {
    id: "PTH-001",
    name: "New Quality Review Authorization Pathway",
    audience: "Advisor candidates",
    description: "Builds platform, research, authority, and observation readiness before independent learning.",
    activityIds: ["ACT-003", "ACT-004", "ACT-007", "ACT-008"],
    competencyIds: ["CMP-003", "CMP-007", "CMP-012", "CMP-013"],
    estimatedHours: 28,
    status: "PUBLISHED",
  },
  {
    id: "PTH-002",
    name: "Advanced Governance Quality Pathway",
    audience: "Experienced governance advisors",
    description: "Deepens admissibility, facilitation, challenge response, and institutional boundary practice.",
    activityIds: ["ACT-001", "ACT-002", "ACT-004", "ACT-006"],
    competencyIds: ["CMP-001", "CMP-002", "CMP-004", "CMP-007"],
    estimatedHours: 32,
    status: "PUBLISHED",
  },
  {
    id: "PTH-003",
    name: "Technical Evidence Advisor Pathway",
    audience: "HVAC and environmental program",
    description: "Qualifies advisors to teach evidence sequence, electrical boundaries, and atmospheric records.",
    activityIds: ["ACT-005", "ACT-009", "ACT-015", "ACT-019"],
    competencyIds: ["CMP-009", "CMP-010", "CMP-011"],
    estimatedHours: 36,
    status: "PUBLISHED",
  },
  {
    id: "PTH-004",
    name: "Quality Leadership Pathway",
    audience: "Quality leads and reviewers",
    description: "Prepares program for coaching, stewardship, calibration, and institutional review.",
    activityIds: ["ACT-006", "ACT-010", "ACT-016", "ACT-026"],
    competencyIds: ["CMP-014", "CMP-015", "CMP-007", "CMP-008"],
    estimatedHours: 24,
    status: "DRAFT",
  },
];

const seedCollaborations: Collaboration[] = [
  {
    id: "MNT-001",
    advisorId: "FAC-006",
    adviseeId: "FAC-003",
    focus: "Evidence review",
    start: "2026-02-01",
    end: "2026-11-30",
    cadence: "Monthly",
    status: "ACTIVE",
    goals: ["Complete observed coaching cycle", "Preserve meeting and outcome evidence"],
    meetingCount: 3,
    nextMeeting: "2026-08-11",
  },
  {
    id: "MNT-002",
    advisorId: "FAC-007",
    adviseeId: "FAC-004",
    focus: "Simulation facilitation",
    start: "2026-02-01",
    end: "2026-11-30",
    cadence: "Weekly",
    status: "PROPOSED",
    goals: ["Complete observed coaching cycle", "Preserve meeting and outcome evidence"],
    meetingCount: 4,
    nextMeeting: "2026-08-12",
  },
  {
    id: "MNT-003",
    advisorId: "FAC-008",
    adviseeId: "FAC-005",
    focus: "Quality leadership",
    start: "2026-02-01",
    end: "2026-11-30",
    cadence: "Biweekly",
    status: "ON_HOLD",
    goals: ["Complete observed coaching cycle", "Preserve meeting and outcome evidence"],
    meetingCount: 5,
    nextMeeting: "2026-08-13",
  },
  {
    id: "MNT-004",
    advisorId: "FAC-001",
    adviseeId: "FAC-006",
    focus: "Research pacing",
    start: "2026-02-01",
    end: "2026-11-30",
    cadence: "Monthly",
    status: "ACTIVE",
    goals: ["Complete observed coaching cycle", "Preserve meeting and outcome evidence"],
    meetingCount: 6,
    nextMeeting: "2026-08-14",
  },
  {
    id: "MNT-005",
    advisorId: "FAC-002",
    adviseeId: "FAC-007",
    focus: "Evidence review",
    start: "2026-02-01",
    end: "2026-11-30",
    cadence: "Weekly",
    status: "ACTIVE",
    goals: ["Complete observed coaching cycle", "Preserve meeting and outcome evidence"],
    meetingCount: 7,
    nextMeeting: "2026-08-15",
  },
  {
    id: "MNT-006",
    advisorId: "FAC-003",
    adviseeId: "FAC-008",
    focus: "Simulation facilitation",
    start: "2026-02-01",
    end: "2026-11-30",
    cadence: "Biweekly",
    status: "PROPOSED",
    goals: ["Complete observed coaching cycle", "Preserve meeting and outcome evidence"],
    meetingCount: 8,
    nextMeeting: "2026-08-16",
  },
  {
    id: "MNT-007",
    advisorId: "FAC-004",
    adviseeId: "FAC-001",
    focus: "Quality leadership",
    start: "2026-02-01",
    end: "2026-11-30",
    cadence: "Monthly",
    status: "ON_HOLD",
    goals: ["Complete observed coaching cycle", "Preserve meeting and outcome evidence"],
    meetingCount: 9,
    nextMeeting: "2026-08-17",
  },
  {
    id: "MNT-008",
    advisorId: "FAC-005",
    adviseeId: "FAC-002",
    focus: "Research pacing",
    start: "2026-02-01",
    end: "2026-11-30",
    cadence: "Weekly",
    status: "ACTIVE",
    goals: ["Complete observed coaching cycle", "Preserve meeting and outcome evidence"],
    meetingCount: 10,
    nextMeeting: "2026-08-18",
  },
];

const seedObservations: Observation[] = [
  {
    id: "OBS-001",
    programId: "FAC-001",
    reviewer: "Mateo Ruiz",
    initiative: "Electricity Made Simple",
    date: "2026-06-04",
    status: "COMPLETE",
    score: 77,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["Make unresolved conditions more visible"],
    requiredActions: ["Submit revised debrief plan"],
    evidenceIds: ["EVD-OBS-001"],
  },
  {
    id: "OBS-002",
    programId: "FAC-002",
    reviewer: "Amina Cole",
    initiative: "Governed Records",
    date: "2026-07-07",
    status: "FOLLOW_UP",
    score: 84,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-002"],
  },
  {
    id: "OBS-003",
    programId: "FAC-003",
    reviewer: "Daniel Cho",
    initiative: "Assessment Design",
    date: "2026-08-10",
    status: "OVERDUE",
    score: 91,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-003"],
  },
  {
    id: "OBS-004",
    programId: "FAC-004",
    reviewer: "Selene Brooks",
    initiative: "PAIR Foundations",
    date: "2026-01-13",
    status: "SCHEDULED",
    score: 98,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-004"],
  },
  {
    id: "OBS-005",
    programId: "FAC-005",
    reviewer: "Owen Hart",
    initiative: "Execution Admissibility",
    date: "2026-02-16",
    status: "COMPLETE",
    score: 76,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["Make unresolved conditions more visible"],
    requiredActions: ["Submit revised debrief plan"],
    evidenceIds: ["EVD-OBS-005"],
  },
  {
    id: "OBS-006",
    programId: "FAC-006",
    reviewer: "Dr. Mara Voss",
    initiative: "Electricity Made Simple",
    date: "2026-03-19",
    status: "FOLLOW_UP",
    score: 83,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-006"],
  },
  {
    id: "OBS-007",
    programId: "FAC-007",
    reviewer: "Jordan Ellis",
    initiative: "Governed Records",
    date: "2026-04-22",
    status: "OVERDUE",
    score: 90,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-007"],
  },
  {
    id: "OBS-008",
    programId: "FAC-008",
    reviewer: "Priya Nand",
    initiative: "Assessment Design",
    date: "2026-05-01",
    status: "SCHEDULED",
    score: 97,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-008"],
  },
  {
    id: "OBS-009",
    programId: "FAC-001",
    reviewer: "Mateo Ruiz",
    initiative: "PAIR Foundations",
    date: "2026-06-04",
    status: "COMPLETE",
    score: 75,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["Make unresolved conditions more visible"],
    requiredActions: ["Submit revised debrief plan"],
    evidenceIds: ["EVD-OBS-009"],
  },
  {
    id: "OBS-010",
    programId: "FAC-002",
    reviewer: "Amina Cole",
    initiative: "Execution Admissibility",
    date: "2026-07-07",
    status: "FOLLOW_UP",
    score: 82,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-010"],
  },
  {
    id: "OBS-011",
    programId: "FAC-003",
    reviewer: "Daniel Cho",
    initiative: "Electricity Made Simple",
    date: "2026-08-10",
    status: "OVERDUE",
    score: 89,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-011"],
  },
  {
    id: "OBS-012",
    programId: "FAC-004",
    reviewer: "Selene Brooks",
    initiative: "Governed Records",
    date: "2026-01-13",
    status: "SCHEDULED",
    score: 96,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-012"],
  },
  {
    id: "OBS-013",
    programId: "FAC-005",
    reviewer: "Owen Hart",
    initiative: "Assessment Design",
    date: "2026-02-16",
    status: "COMPLETE",
    score: 74,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["Make unresolved conditions more visible"],
    requiredActions: ["Submit revised debrief plan"],
    evidenceIds: ["EVD-OBS-013"],
  },
  {
    id: "OBS-014",
    programId: "FAC-006",
    reviewer: "Dr. Mara Voss",
    initiative: "PAIR Foundations",
    date: "2026-03-19",
    status: "FOLLOW_UP",
    score: 81,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["Make unresolved conditions more visible"],
    requiredActions: ["Submit revised debrief plan"],
    evidenceIds: ["EVD-OBS-014"],
  },
  {
    id: "OBS-015",
    programId: "FAC-007",
    reviewer: "Jordan Ellis",
    initiative: "Execution Admissibility",
    date: "2026-04-22",
    status: "OVERDUE",
    score: 88,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-015"],
  },
  {
    id: "OBS-016",
    programId: "FAC-008",
    reviewer: "Priya Nand",
    initiative: "Electricity Made Simple",
    date: "2026-05-01",
    status: "SCHEDULED",
    score: 95,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-016"],
  },
  {
    id: "OBS-017",
    programId: "FAC-001",
    reviewer: "Mateo Ruiz",
    initiative: "Governed Records",
    date: "2026-06-04",
    status: "COMPLETE",
    score: 73,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["Make unresolved conditions more visible"],
    requiredActions: ["Submit revised debrief plan"],
    evidenceIds: ["EVD-OBS-017"],
  },
  {
    id: "OBS-018",
    programId: "FAC-002",
    reviewer: "Amina Cole",
    initiative: "Assessment Design",
    date: "2026-07-07",
    status: "FOLLOW_UP",
    score: 80,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["Make unresolved conditions more visible"],
    requiredActions: ["Submit revised debrief plan"],
    evidenceIds: ["EVD-OBS-018"],
  },
  {
    id: "OBS-019",
    programId: "FAC-003",
    reviewer: "Daniel Cho",
    initiative: "PAIR Foundations",
    date: "2026-08-10",
    status: "OVERDUE",
    score: 87,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-019"],
  },
  {
    id: "OBS-020",
    programId: "FAC-004",
    reviewer: "Selene Brooks",
    initiative: "Execution Admissibility",
    date: "2026-01-13",
    status: "SCHEDULED",
    score: 94,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-020"],
  },
  {
    id: "OBS-021",
    programId: "FAC-005",
    reviewer: "Owen Hart",
    initiative: "Electricity Made Simple",
    date: "2026-02-16",
    status: "COMPLETE",
    score: 72,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["Make unresolved conditions more visible"],
    requiredActions: ["Submit revised debrief plan"],
    evidenceIds: ["EVD-OBS-021"],
  },
  {
    id: "OBS-022",
    programId: "FAC-006",
    reviewer: "Dr. Mara Voss",
    initiative: "Governed Records",
    date: "2026-03-19",
    status: "FOLLOW_UP",
    score: 79,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["Make unresolved conditions more visible"],
    requiredActions: ["Submit revised debrief plan"],
    evidenceIds: ["EVD-OBS-022"],
  },
  {
    id: "OBS-023",
    programId: "FAC-007",
    reviewer: "Jordan Ellis",
    initiative: "Assessment Design",
    date: "2026-04-22",
    status: "OVERDUE",
    score: 86,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-023"],
  },
  {
    id: "OBS-024",
    programId: "FAC-008",
    reviewer: "Priya Nand",
    initiative: "PAIR Foundations",
    date: "2026-05-01",
    status: "SCHEDULED",
    score: 93,
    strengths: ["Clear evidence boundaries", "Strong contributor engagement"],
    findings: ["No material finding"],
    requiredActions: [],
    evidenceIds: ["EVD-OBS-024"],
  },
];

const seedPortfolio: PortfolioItem[] = [
  {
    id: "PRT-001",
    programId: "FAC-001",
    title: "Assessment Blueprint 1",
    category: "Assessment",
    created: "2026-03-05",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-001"],
    visibility: "INSTITUTION",
  },
  {
    id: "PRT-002",
    programId: "FAC-002",
    title: "Simulation Debrief 2",
    category: "Simulation",
    created: "2026-04-09",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-002"],
    visibility: "PUBLIC",
  },
  {
    id: "PRT-003",
    programId: "FAC-003",
    title: "Research Portfolio Revision 3",
    category: "Research Portfolio",
    created: "2026-05-13",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-003"],
    visibility: "PRIVATE",
  },
  {
    id: "PRT-004",
    programId: "FAC-004",
    title: "Collaboration Reflection 4",
    category: "Leadership",
    created: "2026-06-17",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-004"],
    visibility: "INSTITUTION",
  },
  {
    id: "PRT-005",
    programId: "FAC-005",
    title: "Evidence Challenge Response 5",
    category: "Evidence",
    created: "2026-07-21",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-005"],
    visibility: "PUBLIC",
  },
  {
    id: "PRT-006",
    programId: "FAC-006",
    title: "Observed Lesson Artifact 6",
    category: "Learning",
    created: "2026-01-01",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-006"],
    visibility: "PRIVATE",
  },
  {
    id: "PRT-007",
    programId: "FAC-007",
    title: "Assessment Blueprint 7",
    category: "Assessment",
    created: "2026-02-05",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-007"],
    visibility: "INSTITUTION",
  },
  {
    id: "PRT-008",
    programId: "FAC-008",
    title: "Simulation Debrief 8",
    category: "Simulation",
    created: "2026-03-09",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-008"],
    visibility: "PUBLIC",
  },
  {
    id: "PRT-009",
    programId: "FAC-001",
    title: "Research Portfolio Revision 9",
    category: "Research Portfolio",
    created: "2026-04-13",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-009"],
    visibility: "PRIVATE",
  },
  {
    id: "PRT-010",
    programId: "FAC-002",
    title: "Collaboration Reflection 10",
    category: "Leadership",
    created: "2026-05-17",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-010"],
    visibility: "INSTITUTION",
  },
  {
    id: "PRT-011",
    programId: "FAC-003",
    title: "Evidence Challenge Response 11",
    category: "Evidence",
    created: "2026-06-21",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-011"],
    visibility: "PUBLIC",
  },
  {
    id: "PRT-012",
    programId: "FAC-004",
    title: "Observed Lesson Artifact 12",
    category: "Learning",
    created: "2026-07-01",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-012"],
    visibility: "PRIVATE",
  },
  {
    id: "PRT-013",
    programId: "FAC-005",
    title: "Assessment Blueprint 13",
    category: "Assessment",
    created: "2026-01-05",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-013"],
    visibility: "INSTITUTION",
  },
  {
    id: "PRT-014",
    programId: "FAC-006",
    title: "Simulation Debrief 14",
    category: "Simulation",
    created: "2026-02-09",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-014"],
    visibility: "PUBLIC",
  },
  {
    id: "PRT-015",
    programId: "FAC-007",
    title: "Research Portfolio Revision 15",
    category: "Research Portfolio",
    created: "2026-03-13",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-015"],
    visibility: "PRIVATE",
  },
  {
    id: "PRT-016",
    programId: "FAC-008",
    title: "Collaboration Reflection 16",
    category: "Leadership",
    created: "2026-04-17",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-016"],
    visibility: "INSTITUTION",
  },
  {
    id: "PRT-017",
    programId: "FAC-001",
    title: "Evidence Challenge Response 17",
    category: "Evidence",
    created: "2026-05-21",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-017"],
    visibility: "PUBLIC",
  },
  {
    id: "PRT-018",
    programId: "FAC-002",
    title: "Observed Lesson Artifact 18",
    category: "Learning",
    created: "2026-06-01",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-018"],
    visibility: "PRIVATE",
  },
  {
    id: "PRT-019",
    programId: "FAC-003",
    title: "Assessment Blueprint 19",
    category: "Assessment",
    created: "2026-07-05",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-019"],
    visibility: "INSTITUTION",
  },
  {
    id: "PRT-020",
    programId: "FAC-004",
    title: "Simulation Debrief 20",
    category: "Simulation",
    created: "2026-01-09",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-020"],
    visibility: "PUBLIC",
  },
  {
    id: "PRT-021",
    programId: "FAC-005",
    title: "Research Portfolio Revision 21",
    category: "Research Portfolio",
    created: "2026-02-13",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-021"],
    visibility: "PRIVATE",
  },
  {
    id: "PRT-022",
    programId: "FAC-006",
    title: "Collaboration Reflection 22",
    category: "Leadership",
    created: "2026-03-17",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-022"],
    visibility: "INSTITUTION",
  },
  {
    id: "PRT-023",
    programId: "FAC-007",
    title: "Evidence Challenge Response 23",
    category: "Evidence",
    created: "2026-04-21",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-023"],
    visibility: "PUBLIC",
  },
  {
    id: "PRT-024",
    programId: "FAC-008",
    title: "Observed Lesson Artifact 24",
    category: "Learning",
    created: "2026-05-01",
    summary: "Preserved program-development artifact with declared scope, source attribution, and limitations.",
    tags: ["program-development", "evidence", "academy"],
    evidenceIds: ["EVD-PRT-024"],
    visibility: "PRIVATE",
  },
];

const seedImprovements: ImprovementPlan[] = [
  {
    id: "IMP-001",
    programId: "FAC-003",
    title: "Observation follow-up",
    trigger: "Peer observation finding",
    status: "MONITORING",
    priority: "HIGH",
    opened: "2026-04-05",
    due: "2026-07-25",
    owner: "Research and Innovation Council",
    actions: ["Complete coaching session", "Submit revised artifact", "Pass follow-up observation"],
    checkpoints: ["Initial review", "Midpoint evidence check", "Final determination"],
    progress: 34,
    determination: "ESCALATE",
  },
  {
    id: "IMP-002",
    programId: "FAC-004",
    title: "Assessment calibration",
    trigger: "Moderation variance",
    status: "SATISFIED",
    priority: "LOW",
    opened: "2026-05-05",
    due: "2026-08-25",
    owner: "Research and Innovation Council",
    actions: ["Complete coaching session", "Submit revised artifact", "Pass follow-up observation"],
    checkpoints: ["Initial review", "Midpoint evidence check", "Final determination"],
    progress: 43,
    determination: "ESCALATE",
  },
  {
    id: "IMP-003",
    programId: "FAC-005",
    title: "Authority-boundary remediation",
    trigger: "Scope boundary finding",
    status: "ESCALATED",
    priority: "CRITICAL",
    opened: "2026-06-05",
    due: "2026-09-25",
    owner: "Research and Innovation Council",
    actions: ["Complete coaching session", "Submit revised artifact", "Pass follow-up observation"],
    checkpoints: ["Initial review", "Midpoint evidence check", "Final determination"],
    progress: 52,
    determination: "HOLD",
  },
  {
    id: "IMP-004",
    programId: "FAC-006",
    title: "Initiative load stabilization",
    trigger: "Workload threshold",
    status: "OPEN",
    priority: "MEDIUM",
    opened: "2026-07-05",
    due: "2026-10-25",
    owner: "Research and Innovation Council",
    actions: ["Complete coaching session", "Submit revised artifact", "Pass follow-up observation"],
    checkpoints: ["Initial review", "Midpoint evidence check", "Final determination"],
    progress: 61,
    determination: "HOLD",
  },
  {
    id: "IMP-005",
    programId: "FAC-007",
    title: "Observation follow-up",
    trigger: "Peer observation finding",
    status: "MONITORING",
    priority: "HIGH",
    opened: "2026-01-05",
    due: "2026-01-25",
    owner: "Research and Innovation Council",
    actions: ["Complete coaching session", "Submit revised artifact", "Pass follow-up observation"],
    checkpoints: ["Initial review", "Midpoint evidence check", "Final determination"],
    progress: 70,
    determination: "HOLD",
  },
  {
    id: "IMP-006",
    programId: "FAC-008",
    title: "Assessment calibration",
    trigger: "Moderation variance",
    status: "SATISFIED",
    priority: "LOW",
    opened: "2026-02-05",
    due: "2026-02-25",
    owner: "Research and Innovation Council",
    actions: ["Complete coaching session", "Submit revised artifact", "Pass follow-up observation"],
    checkpoints: ["Initial review", "Midpoint evidence check", "Final determination"],
    progress: 79,
    determination: "HOLD",
  },
  {
    id: "IMP-007",
    programId: "FAC-001",
    title: "Authority-boundary remediation",
    trigger: "Scope boundary finding",
    status: "ESCALATED",
    priority: "CRITICAL",
    opened: "2026-03-05",
    due: "2026-03-25",
    owner: "Research and Innovation Council",
    actions: ["Complete coaching session", "Submit revised artifact", "Pass follow-up observation"],
    checkpoints: ["Initial review", "Midpoint evidence check", "Final determination"],
    progress: 88,
    determination: "ALLOW",
  },
  {
    id: "IMP-008",
    programId: "FAC-002",
    title: "Initiative load stabilization",
    trigger: "Workload threshold",
    status: "OPEN",
    priority: "MEDIUM",
    opened: "2026-04-05",
    due: "2026-04-25",
    owner: "Research and Innovation Council",
    actions: ["Complete coaching session", "Submit revised artifact", "Pass follow-up observation"],
    checkpoints: ["Initial review", "Midpoint evidence check", "Final determination"],
    progress: 27,
    determination: "ESCALATE",
  },
  {
    id: "IMP-009",
    programId: "FAC-003",
    title: "Observation follow-up",
    trigger: "Peer observation finding",
    status: "MONITORING",
    priority: "HIGH",
    opened: "2026-05-05",
    due: "2026-05-25",
    owner: "Research and Innovation Council",
    actions: ["Complete coaching session", "Submit revised artifact", "Pass follow-up observation"],
    checkpoints: ["Initial review", "Midpoint evidence check", "Final determination"],
    progress: 36,
    determination: "ESCALATE",
  },
  {
    id: "IMP-010",
    programId: "FAC-004",
    title: "Assessment calibration",
    trigger: "Moderation variance",
    status: "SATISFIED",
    priority: "LOW",
    opened: "2026-06-05",
    due: "2026-06-25",
    owner: "Research and Innovation Council",
    actions: ["Complete coaching session", "Submit revised artifact", "Pass follow-up observation"],
    checkpoints: ["Initial review", "Midpoint evidence check", "Final determination"],
    progress: 45,
    determination: "ESCALATE",
  },
  {
    id: "IMP-011",
    programId: "FAC-005",
    title: "Authority-boundary remediation",
    trigger: "Scope boundary finding",
    status: "ESCALATED",
    priority: "CRITICAL",
    opened: "2026-07-05",
    due: "2026-07-25",
    owner: "Research and Innovation Council",
    actions: ["Complete coaching session", "Submit revised artifact", "Pass follow-up observation"],
    checkpoints: ["Initial review", "Midpoint evidence check", "Final determination"],
    progress: 54,
    determination: "HOLD",
  },
  {
    id: "IMP-012",
    programId: "FAC-006",
    title: "Initiative load stabilization",
    trigger: "Workload threshold",
    status: "OPEN",
    priority: "MEDIUM",
    opened: "2026-01-05",
    due: "2026-08-25",
    owner: "Research and Innovation Council",
    actions: ["Complete coaching session", "Submit revised artifact", "Pass follow-up observation"],
    checkpoints: ["Initial review", "Midpoint evidence check", "Final determination"],
    progress: 63,
    determination: "HOLD",
  },
];

const seedEvidence: EvidenceRecord[] = [
  {
    id: "EVD-001",
    programId: "FAC-001",
    title: "Workshop completion 1",
    type: "COMPLETION",
    source: "Quality evidence upload",
    captured: "2026-04-06",
    status: "VERIFIED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000016a95",
    relatedIds: ["FAC-001"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-002",
    programId: "FAC-002",
    title: "Learning artifact 2",
    type: "ARTIFACT",
    source: "Learning system",
    captured: "2026-05-11",
    status: "PENDING",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000002d52a",
    relatedIds: ["FAC-002"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-003",
    programId: "FAC-003",
    title: "Assessment moderation 3",
    type: "ASSESSMENT",
    source: "Research director",
    captured: "2026-06-16",
    status: "VERIFIED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000043fbf",
    relatedIds: ["FAC-003"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-004",
    programId: "FAC-004",
    title: "Advisoring record 4",
    type: "MENTORING",
    source: "Academy review panel",
    captured: "2026-07-21",
    status: "SUPERSEDED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000005aa54",
    relatedIds: ["FAC-004"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-005",
    programId: "FAC-005",
    title: "Authority review 5",
    type: "AUTHORITY",
    source: "Quality evidence upload",
    captured: "2026-01-02",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000000714e9",
    relatedIds: ["FAC-005"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-006",
    programId: "FAC-006",
    title: "Contributor feedback 6",
    type: "FEEDBACK",
    source: "Learning system",
    captured: "2026-02-07",
    status: "VERIFIED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000087f7e",
    relatedIds: ["FAC-006"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-007",
    programId: "FAC-007",
    title: "Portfolio artifact 7",
    type: "PORTFOLIO",
    source: "Research director",
    captured: "2026-03-12",
    status: "PENDING",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000009ea13",
    relatedIds: ["FAC-007"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-008",
    programId: "FAC-008",
    title: "Observation rubric 8",
    type: "OBSERVATION",
    source: "Academy review panel",
    captured: "2026-04-17",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000000b54a8",
    relatedIds: ["FAC-008"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-009",
    programId: "FAC-001",
    title: "Workshop completion 9",
    type: "COMPLETION",
    source: "Quality evidence upload",
    captured: "2026-05-22",
    status: "SUPERSEDED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000000cbf3d",
    relatedIds: ["FAC-001"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-010",
    programId: "FAC-002",
    title: "Learning artifact 10",
    type: "ARTIFACT",
    source: "Learning system",
    captured: "2026-06-03",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000000e29d2",
    relatedIds: ["FAC-002"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-011",
    programId: "FAC-003",
    title: "Assessment moderation 11",
    type: "ASSESSMENT",
    source: "Research director",
    captured: "2026-07-08",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000000f9467",
    relatedIds: ["FAC-003"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-012",
    programId: "FAC-004",
    title: "Advisoring record 12",
    type: "MENTORING",
    source: "Academy review panel",
    captured: "2026-01-13",
    status: "PENDING",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000010fefc",
    relatedIds: ["FAC-004"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-013",
    programId: "FAC-005",
    title: "Authority review 13",
    type: "AUTHORITY",
    source: "Quality evidence upload",
    captured: "2026-02-18",
    status: "VERIFIED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000126991",
    relatedIds: ["FAC-005"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-014",
    programId: "FAC-006",
    title: "Contributor feedback 14",
    type: "FEEDBACK",
    source: "Learning system",
    captured: "2026-03-23",
    status: "SUPERSEDED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000013d426",
    relatedIds: ["FAC-006"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-015",
    programId: "FAC-007",
    title: "Portfolio artifact 15",
    type: "PORTFOLIO",
    source: "Research director",
    captured: "2026-04-04",
    status: "VERIFIED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000153ebb",
    relatedIds: ["FAC-007"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-016",
    programId: "FAC-008",
    title: "Observation rubric 16",
    type: "OBSERVATION",
    source: "Academy review panel",
    captured: "2026-05-09",
    status: "VERIFIED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000016a950",
    relatedIds: ["FAC-008"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-017",
    programId: "FAC-001",
    title: "Workshop completion 17",
    type: "COMPLETION",
    source: "Quality evidence upload",
    captured: "2026-06-14",
    status: "PENDING",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000001813e5",
    relatedIds: ["FAC-001"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-018",
    programId: "FAC-002",
    title: "Learning artifact 18",
    type: "ARTIFACT",
    source: "Learning system",
    captured: "2026-07-19",
    status: "VERIFIED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000197e7a",
    relatedIds: ["FAC-002"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-019",
    programId: "FAC-003",
    title: "Assessment moderation 19",
    type: "ASSESSMENT",
    source: "Research director",
    captured: "2026-01-24",
    status: "SUPERSEDED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000001ae90f",
    relatedIds: ["FAC-003"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-020",
    programId: "FAC-004",
    title: "Advisoring record 20",
    type: "MENTORING",
    source: "Academy review panel",
    captured: "2026-02-05",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000001c53a4",
    relatedIds: ["FAC-004"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-021",
    programId: "FAC-005",
    title: "Authority review 21",
    type: "AUTHORITY",
    source: "Quality evidence upload",
    captured: "2026-03-10",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000001dbe39",
    relatedIds: ["FAC-005"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-022",
    programId: "FAC-006",
    title: "Contributor feedback 22",
    type: "FEEDBACK",
    source: "Learning system",
    captured: "2026-04-15",
    status: "PENDING",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000001f28ce",
    relatedIds: ["FAC-006"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-023",
    programId: "FAC-007",
    title: "Portfolio artifact 23",
    type: "PORTFOLIO",
    source: "Research director",
    captured: "2026-05-20",
    status: "VERIFIED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000209363",
    relatedIds: ["FAC-007"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-024",
    programId: "FAC-008",
    title: "Observation rubric 24",
    type: "OBSERVATION",
    source: "Academy review panel",
    captured: "2026-06-01",
    status: "SUPERSEDED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000021fdf8",
    relatedIds: ["FAC-008"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-025",
    programId: "FAC-001",
    title: "Workshop completion 25",
    type: "COMPLETION",
    source: "Quality evidence upload",
    captured: "2026-07-06",
    status: "VERIFIED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000023688d",
    relatedIds: ["FAC-001"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-026",
    programId: "FAC-002",
    title: "Learning artifact 26",
    type: "ARTIFACT",
    source: "Learning system",
    captured: "2026-01-11",
    status: "VERIFIED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000024d322",
    relatedIds: ["FAC-002"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-027",
    programId: "FAC-003",
    title: "Assessment moderation 27",
    type: "ASSESSMENT",
    source: "Research director",
    captured: "2026-02-16",
    status: "PENDING",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000263db7",
    relatedIds: ["FAC-003"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-028",
    programId: "FAC-004",
    title: "Advisoring record 28",
    type: "MENTORING",
    source: "Academy review panel",
    captured: "2026-03-21",
    status: "VERIFIED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000027a84c",
    relatedIds: ["FAC-004"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-029",
    programId: "FAC-005",
    title: "Authority review 29",
    type: "AUTHORITY",
    source: "Quality evidence upload",
    captured: "2026-04-02",
    status: "SUPERSEDED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000002912e1",
    relatedIds: ["FAC-005"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-030",
    programId: "FAC-006",
    title: "Contributor feedback 30",
    type: "FEEDBACK",
    source: "Learning system",
    captured: "2026-05-07",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000002a7d76",
    relatedIds: ["FAC-006"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-031",
    programId: "FAC-007",
    title: "Portfolio artifact 31",
    type: "PORTFOLIO",
    source: "Research director",
    captured: "2026-06-12",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000002be80b",
    relatedIds: ["FAC-007"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-032",
    programId: "FAC-008",
    title: "Observation rubric 32",
    type: "OBSERVATION",
    source: "Academy review panel",
    captured: "2026-07-17",
    status: "PENDING",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000002d52a0",
    relatedIds: ["FAC-008"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-033",
    programId: "FAC-001",
    title: "Workshop completion 33",
    type: "COMPLETION",
    source: "Quality evidence upload",
    captured: "2026-01-22",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000002ebd35",
    relatedIds: ["FAC-001"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-034",
    programId: "FAC-002",
    title: "Learning artifact 34",
    type: "ARTIFACT",
    source: "Learning system",
    captured: "2026-02-03",
    status: "SUPERSEDED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000003027ca",
    relatedIds: ["FAC-002"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-035",
    programId: "FAC-003",
    title: "Assessment moderation 35",
    type: "ASSESSMENT",
    source: "Research director",
    captured: "2026-03-08",
    status: "VERIFIED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000031925f",
    relatedIds: ["FAC-003"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-036",
    programId: "FAC-004",
    title: "Advisoring record 36",
    type: "MENTORING",
    source: "Academy review panel",
    captured: "2026-04-13",
    status: "VERIFIED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000032fcf4",
    relatedIds: ["FAC-004"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-037",
    programId: "FAC-005",
    title: "Authority review 37",
    type: "AUTHORITY",
    source: "Quality evidence upload",
    captured: "2026-05-18",
    status: "PENDING",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000346789",
    relatedIds: ["FAC-005"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-038",
    programId: "FAC-006",
    title: "Contributor feedback 38",
    type: "FEEDBACK",
    source: "Learning system",
    captured: "2026-06-23",
    status: "VERIFIED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000035d21e",
    relatedIds: ["FAC-006"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-039",
    programId: "FAC-007",
    title: "Portfolio artifact 39",
    type: "PORTFOLIO",
    source: "Research director",
    captured: "2026-07-04",
    status: "SUPERSEDED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000373cb3",
    relatedIds: ["FAC-007"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-040",
    programId: "FAC-008",
    title: "Observation rubric 40",
    type: "OBSERVATION",
    source: "Academy review panel",
    captured: "2026-01-09",
    status: "VERIFIED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000038a748",
    relatedIds: ["FAC-008"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-041",
    programId: "FAC-001",
    title: "Workshop completion 41",
    type: "COMPLETION",
    source: "Quality evidence upload",
    captured: "2026-02-14",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000003a11dd",
    relatedIds: ["FAC-001"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-042",
    programId: "FAC-002",
    title: "Learning artifact 42",
    type: "ARTIFACT",
    source: "Learning system",
    captured: "2026-03-19",
    status: "PENDING",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000003b7c72",
    relatedIds: ["FAC-002"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-043",
    programId: "FAC-003",
    title: "Assessment moderation 43",
    type: "ASSESSMENT",
    source: "Research director",
    captured: "2026-04-24",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000003ce707",
    relatedIds: ["FAC-003"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-044",
    programId: "FAC-004",
    title: "Advisoring record 44",
    type: "MENTORING",
    source: "Academy review panel",
    captured: "2026-05-05",
    status: "SUPERSEDED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000003e519c",
    relatedIds: ["FAC-004"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-045",
    programId: "FAC-005",
    title: "Authority review 45",
    type: "AUTHORITY",
    source: "Quality evidence upload",
    captured: "2026-06-10",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000003fbc31",
    relatedIds: ["FAC-005"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-046",
    programId: "FAC-006",
    title: "Contributor feedback 46",
    type: "FEEDBACK",
    source: "Learning system",
    captured: "2026-07-15",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000004126c6",
    relatedIds: ["FAC-006"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-047",
    programId: "FAC-007",
    title: "Portfolio artifact 47",
    type: "PORTFOLIO",
    source: "Research director",
    captured: "2026-01-20",
    status: "PENDING",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000042915b",
    relatedIds: ["FAC-007"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-048",
    programId: "FAC-008",
    title: "Observation rubric 48",
    type: "OBSERVATION",
    source: "Academy review panel",
    captured: "2026-02-01",
    status: "VERIFIED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000043fbf0",
    relatedIds: ["FAC-008"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-049",
    programId: "FAC-001",
    title: "Workshop completion 49",
    type: "COMPLETION",
    source: "Quality evidence upload",
    captured: "2026-03-06",
    status: "SUPERSEDED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000456685",
    relatedIds: ["FAC-001"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-050",
    programId: "FAC-002",
    title: "Learning artifact 50",
    type: "ARTIFACT",
    source: "Learning system",
    captured: "2026-04-11",
    status: "VERIFIED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000046d11a",
    relatedIds: ["FAC-002"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-051",
    programId: "FAC-003",
    title: "Assessment moderation 51",
    type: "ASSESSMENT",
    source: "Research director",
    captured: "2026-05-16",
    status: "VERIFIED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000483baf",
    relatedIds: ["FAC-003"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-052",
    programId: "FAC-004",
    title: "Advisoring record 52",
    type: "MENTORING",
    source: "Academy review panel",
    captured: "2026-06-21",
    status: "PENDING",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000049a644",
    relatedIds: ["FAC-004"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-053",
    programId: "FAC-005",
    title: "Authority review 53",
    type: "AUTHORITY",
    source: "Quality evidence upload",
    captured: "2026-07-02",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000004b10d9",
    relatedIds: ["FAC-005"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-054",
    programId: "FAC-006",
    title: "Contributor feedback 54",
    type: "FEEDBACK",
    source: "Learning system",
    captured: "2026-01-07",
    status: "SUPERSEDED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000004c7b6e",
    relatedIds: ["FAC-006"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-055",
    programId: "FAC-007",
    title: "Portfolio artifact 55",
    type: "PORTFOLIO",
    source: "Research director",
    captured: "2026-02-12",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000004de603",
    relatedIds: ["FAC-007"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-056",
    programId: "FAC-008",
    title: "Observation rubric 56",
    type: "OBSERVATION",
    source: "Academy review panel",
    captured: "2026-03-17",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000004f5098",
    relatedIds: ["FAC-008"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-057",
    programId: "FAC-001",
    title: "Workshop completion 57",
    type: "COMPLETION",
    source: "Quality evidence upload",
    captured: "2026-04-22",
    status: "PENDING",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000050bb2d",
    relatedIds: ["FAC-001"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-058",
    programId: "FAC-002",
    title: "Learning artifact 58",
    type: "ARTIFACT",
    source: "Learning system",
    captured: "2026-05-03",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000005225c2",
    relatedIds: ["FAC-002"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-059",
    programId: "FAC-003",
    title: "Assessment moderation 59",
    type: "ASSESSMENT",
    source: "Research director",
    captured: "2026-06-08",
    status: "SUPERSEDED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000539057",
    relatedIds: ["FAC-003"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-060",
    programId: "FAC-004",
    title: "Advisoring record 60",
    type: "MENTORING",
    source: "Academy review panel",
    captured: "2026-07-13",
    status: "VERIFIED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000054faec",
    relatedIds: ["FAC-004"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-061",
    programId: "FAC-005",
    title: "Authority review 61",
    type: "AUTHORITY",
    source: "Quality evidence upload",
    captured: "2026-01-18",
    status: "VERIFIED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000566581",
    relatedIds: ["FAC-005"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-062",
    programId: "FAC-006",
    title: "Contributor feedback 62",
    type: "FEEDBACK",
    source: "Learning system",
    captured: "2026-02-23",
    status: "PENDING",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000057d016",
    relatedIds: ["FAC-006"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-063",
    programId: "FAC-007",
    title: "Portfolio artifact 63",
    type: "PORTFOLIO",
    source: "Research director",
    captured: "2026-03-04",
    status: "VERIFIED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000593aab",
    relatedIds: ["FAC-007"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-064",
    programId: "FAC-008",
    title: "Observation rubric 64",
    type: "OBSERVATION",
    source: "Academy review panel",
    captured: "2026-04-09",
    status: "SUPERSEDED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000005aa540",
    relatedIds: ["FAC-008"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-065",
    programId: "FAC-001",
    title: "Workshop completion 65",
    type: "COMPLETION",
    source: "Quality evidence upload",
    captured: "2026-05-14",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000005c0fd5",
    relatedIds: ["FAC-001"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-066",
    programId: "FAC-002",
    title: "Learning artifact 66",
    type: "ARTIFACT",
    source: "Learning system",
    captured: "2026-06-19",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000005d7a6a",
    relatedIds: ["FAC-002"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-067",
    programId: "FAC-003",
    title: "Assessment moderation 67",
    type: "ASSESSMENT",
    source: "Research director",
    captured: "2026-07-24",
    status: "PENDING",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000005ee4ff",
    relatedIds: ["FAC-003"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-068",
    programId: "FAC-004",
    title: "Advisoring record 68",
    type: "MENTORING",
    source: "Academy review panel",
    captured: "2026-01-05",
    status: "VERIFIED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000604f94",
    relatedIds: ["FAC-004"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-069",
    programId: "FAC-005",
    title: "Authority review 69",
    type: "AUTHORITY",
    source: "Quality evidence upload",
    captured: "2026-02-10",
    status: "SUPERSEDED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000061ba29",
    relatedIds: ["FAC-005"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-070",
    programId: "FAC-006",
    title: "Contributor feedback 70",
    type: "FEEDBACK",
    source: "Learning system",
    captured: "2026-03-15",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000006324be",
    relatedIds: ["FAC-006"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-071",
    programId: "FAC-007",
    title: "Portfolio artifact 71",
    type: "PORTFOLIO",
    source: "Research director",
    captured: "2026-04-20",
    status: "VERIFIED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000648f53",
    relatedIds: ["FAC-007"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-072",
    programId: "FAC-008",
    title: "Observation rubric 72",
    type: "OBSERVATION",
    source: "Academy review panel",
    captured: "2026-05-01",
    status: "PENDING",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000065f9e8",
    relatedIds: ["FAC-008"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-073",
    programId: "FAC-001",
    title: "Workshop completion 73",
    type: "COMPLETION",
    source: "Quality evidence upload",
    captured: "2026-06-06",
    status: "VERIFIED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000067647d",
    relatedIds: ["FAC-001"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-074",
    programId: "FAC-002",
    title: "Learning artifact 74",
    type: "ARTIFACT",
    source: "Learning system",
    captured: "2026-07-11",
    status: "SUPERSEDED",
    hash: "sha256:000000000000000000000000000000000000000000000000000000000068cf12",
    relatedIds: ["FAC-002"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-075",
    programId: "FAC-003",
    title: "Assessment moderation 75",
    type: "ASSESSMENT",
    source: "Research director",
    captured: "2026-01-16",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000006a39a7",
    relatedIds: ["FAC-003"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-076",
    programId: "FAC-004",
    title: "Advisoring record 76",
    type: "MENTORING",
    source: "Academy review panel",
    captured: "2026-02-21",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000006ba43c",
    relatedIds: ["FAC-004"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-077",
    programId: "FAC-005",
    title: "Authority review 77",
    type: "AUTHORITY",
    source: "Quality evidence upload",
    captured: "2026-03-02",
    status: "PENDING",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000006d0ed1",
    relatedIds: ["FAC-005"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-078",
    programId: "FAC-006",
    title: "Contributor feedback 78",
    type: "FEEDBACK",
    source: "Learning system",
    captured: "2026-04-07",
    status: "VERIFIED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000006e7966",
    relatedIds: ["FAC-006"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-079",
    programId: "FAC-007",
    title: "Portfolio artifact 79",
    type: "PORTFOLIO",
    source: "Research director",
    captured: "2026-05-12",
    status: "SUPERSEDED",
    hash: "sha256:00000000000000000000000000000000000000000000000000000000006fe3fb",
    relatedIds: ["FAC-007"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
  {
    id: "EVD-080",
    programId: "FAC-008",
    title: "Observation rubric 80",
    type: "OBSERVATION",
    source: "Academy review panel",
    captured: "2026-06-17",
    status: "VERIFIED",
    hash: "sha256:0000000000000000000000000000000000000000000000000000000000714e90",
    relatedIds: ["FAC-008"],
    limitations: "Supports the declared program-development purpose only; does not independently authorize learning.",
  },
];

const seedAudit: AuditEvent[] = [
  {
    id: "AUD-001",
    timestamp: "2026-07-01T09:07:00.000Z",
    actor: "Research and Innovation Council",
    action: "EVIDENCE_VERIFIED",
    target: "Success plan 1",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-002",
    timestamp: "2026-07-02T10:14:00.000Z",
    actor: "Research Director",
    action: "OBSERVATION_RECORDED",
    target: "Evidence record 2",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-003",
    timestamp: "2026-07-03T11:21:00.000Z",
    actor: "System Import",
    action: "READINESS_RECALCULATED",
    target: "Observation 3",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-004",
    timestamp: "2026-07-04T12:28:00.000Z",
    actor: "Daniel Cho",
    action: "MENTORSHIP_UPDATED",
    target: "Collaboration 4",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-005",
    timestamp: "2026-07-05T13:35:00.000Z",
    actor: "Research and Innovation Council",
    action: "PLAN_UPDATED",
    target: "Research project 5",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-006",
    timestamp: "2026-07-06T14:42:00.000Z",
    actor: "Research Director",
    action: "EVIDENCE_VERIFIED",
    target: "Success plan 6",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-007",
    timestamp: "2026-07-07T15:49:00.000Z",
    actor: "System Import",
    action: "OBSERVATION_RECORDED",
    target: "Evidence record 7",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-008",
    timestamp: "2026-07-08T16:56:00.000Z",
    actor: "Daniel Cho",
    action: "READINESS_RECALCULATED",
    target: "Observation 8",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-009",
    timestamp: "2026-07-09T17:03:00.000Z",
    actor: "Research and Innovation Council",
    action: "MENTORSHIP_UPDATED",
    target: "Collaboration 9",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-010",
    timestamp: "2026-07-10T18:10:00.000Z",
    actor: "Research Director",
    action: "PLAN_UPDATED",
    target: "Research project 10",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-011",
    timestamp: "2026-07-11T19:17:00.000Z",
    actor: "System Import",
    action: "EVIDENCE_VERIFIED",
    target: "Success plan 11",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-012",
    timestamp: "2026-07-12T20:24:00.000Z",
    actor: "Daniel Cho",
    action: "OBSERVATION_RECORDED",
    target: "Evidence record 12",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-013",
    timestamp: "2026-07-13T21:31:00.000Z",
    actor: "Research and Innovation Council",
    action: "READINESS_RECALCULATED",
    target: "Observation 13",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-014",
    timestamp: "2026-07-14T22:38:00.000Z",
    actor: "Research Director",
    action: "MENTORSHIP_UPDATED",
    target: "Collaboration 14",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-015",
    timestamp: "2026-07-15T23:45:00.000Z",
    actor: "System Import",
    action: "PLAN_UPDATED",
    target: "Research project 15",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-016",
    timestamp: "2026-07-16T00:52:00.000Z",
    actor: "Daniel Cho",
    action: "EVIDENCE_VERIFIED",
    target: "Success plan 16",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-017",
    timestamp: "2026-07-17T01:59:00.000Z",
    actor: "Research and Innovation Council",
    action: "OBSERVATION_RECORDED",
    target: "Evidence record 17",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-018",
    timestamp: "2026-07-18T02:06:00.000Z",
    actor: "Research Director",
    action: "READINESS_RECALCULATED",
    target: "Observation 18",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-019",
    timestamp: "2026-07-19T03:13:00.000Z",
    actor: "System Import",
    action: "MENTORSHIP_UPDATED",
    target: "Collaboration 19",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-020",
    timestamp: "2026-07-20T04:20:00.000Z",
    actor: "Daniel Cho",
    action: "PLAN_UPDATED",
    target: "Research project 20",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-021",
    timestamp: "2026-07-21T05:27:00.000Z",
    actor: "Research and Innovation Council",
    action: "EVIDENCE_VERIFIED",
    target: "Success plan 21",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-022",
    timestamp: "2026-07-22T06:34:00.000Z",
    actor: "Research Director",
    action: "OBSERVATION_RECORDED",
    target: "Evidence record 22",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-023",
    timestamp: "2026-07-23T07:41:00.000Z",
    actor: "System Import",
    action: "READINESS_RECALCULATED",
    target: "Observation 23",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-024",
    timestamp: "2026-07-24T08:48:00.000Z",
    actor: "Daniel Cho",
    action: "MENTORSHIP_UPDATED",
    target: "Collaboration 24",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-025",
    timestamp: "2026-07-25T09:55:00.000Z",
    actor: "Research and Innovation Council",
    action: "PLAN_UPDATED",
    target: "Research project 25",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-026",
    timestamp: "2026-07-26T10:02:00.000Z",
    actor: "Research Director",
    action: "EVIDENCE_VERIFIED",
    target: "Success plan 26",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-027",
    timestamp: "2026-07-27T11:09:00.000Z",
    actor: "System Import",
    action: "OBSERVATION_RECORDED",
    target: "Evidence record 27",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-028",
    timestamp: "2026-07-28T12:16:00.000Z",
    actor: "Daniel Cho",
    action: "READINESS_RECALCULATED",
    target: "Observation 28",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-029",
    timestamp: "2026-07-01T13:23:00.000Z",
    actor: "Research and Innovation Council",
    action: "MENTORSHIP_UPDATED",
    target: "Collaboration 29",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-030",
    timestamp: "2026-07-02T14:30:00.000Z",
    actor: "Research Director",
    action: "PLAN_UPDATED",
    target: "Research project 30",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-031",
    timestamp: "2026-07-03T15:37:00.000Z",
    actor: "System Import",
    action: "EVIDENCE_VERIFIED",
    target: "Success plan 31",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-032",
    timestamp: "2026-07-04T16:44:00.000Z",
    actor: "Daniel Cho",
    action: "OBSERVATION_RECORDED",
    target: "Evidence record 32",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-033",
    timestamp: "2026-07-05T17:51:00.000Z",
    actor: "Research and Innovation Council",
    action: "READINESS_RECALCULATED",
    target: "Observation 33",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-034",
    timestamp: "2026-07-06T18:58:00.000Z",
    actor: "Research Director",
    action: "MENTORSHIP_UPDATED",
    target: "Collaboration 34",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-035",
    timestamp: "2026-07-07T19:05:00.000Z",
    actor: "System Import",
    action: "PLAN_UPDATED",
    target: "Research project 35",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-036",
    timestamp: "2026-07-08T20:12:00.000Z",
    actor: "Daniel Cho",
    action: "EVIDENCE_VERIFIED",
    target: "Success plan 36",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-037",
    timestamp: "2026-07-09T21:19:00.000Z",
    actor: "Research and Innovation Council",
    action: "OBSERVATION_RECORDED",
    target: "Evidence record 37",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-038",
    timestamp: "2026-07-10T22:26:00.000Z",
    actor: "Research Director",
    action: "READINESS_RECALCULATED",
    target: "Observation 38",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-039",
    timestamp: "2026-07-11T23:33:00.000Z",
    actor: "System Import",
    action: "MENTORSHIP_UPDATED",
    target: "Collaboration 39",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-040",
    timestamp: "2026-07-12T00:40:00.000Z",
    actor: "Daniel Cho",
    action: "PLAN_UPDATED",
    target: "Research project 40",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-041",
    timestamp: "2026-07-13T01:47:00.000Z",
    actor: "Research and Innovation Council",
    action: "EVIDENCE_VERIFIED",
    target: "Success plan 41",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-042",
    timestamp: "2026-07-14T02:54:00.000Z",
    actor: "Research Director",
    action: "OBSERVATION_RECORDED",
    target: "Evidence record 42",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-043",
    timestamp: "2026-07-15T03:01:00.000Z",
    actor: "System Import",
    action: "READINESS_RECALCULATED",
    target: "Observation 43",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-044",
    timestamp: "2026-07-16T04:08:00.000Z",
    actor: "Daniel Cho",
    action: "MENTORSHIP_UPDATED",
    target: "Collaboration 44",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-045",
    timestamp: "2026-07-17T05:15:00.000Z",
    actor: "Research and Innovation Council",
    action: "PLAN_UPDATED",
    target: "Research project 45",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-046",
    timestamp: "2026-07-18T06:22:00.000Z",
    actor: "Research Director",
    action: "EVIDENCE_VERIFIED",
    target: "Success plan 46",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-047",
    timestamp: "2026-07-19T07:29:00.000Z",
    actor: "System Import",
    action: "OBSERVATION_RECORDED",
    target: "Evidence record 47",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-048",
    timestamp: "2026-07-20T08:36:00.000Z",
    actor: "Daniel Cho",
    action: "READINESS_RECALCULATED",
    target: "Observation 48",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-049",
    timestamp: "2026-07-21T09:43:00.000Z",
    actor: "Research and Innovation Council",
    action: "MENTORSHIP_UPDATED",
    target: "Collaboration 49",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-050",
    timestamp: "2026-07-22T10:50:00.000Z",
    actor: "Research Director",
    action: "PLAN_UPDATED",
    target: "Research project 50",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-051",
    timestamp: "2026-07-23T11:57:00.000Z",
    actor: "System Import",
    action: "EVIDENCE_VERIFIED",
    target: "Success plan 51",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-052",
    timestamp: "2026-07-24T12:04:00.000Z",
    actor: "Daniel Cho",
    action: "OBSERVATION_RECORDED",
    target: "Evidence record 52",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-053",
    timestamp: "2026-07-25T13:11:00.000Z",
    actor: "Research and Innovation Council",
    action: "READINESS_RECALCULATED",
    target: "Observation 53",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-054",
    timestamp: "2026-07-26T14:18:00.000Z",
    actor: "Research Director",
    action: "MENTORSHIP_UPDATED",
    target: "Collaboration 54",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-055",
    timestamp: "2026-07-27T15:25:00.000Z",
    actor: "System Import",
    action: "PLAN_UPDATED",
    target: "Research project 55",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-056",
    timestamp: "2026-07-28T16:32:00.000Z",
    actor: "Daniel Cho",
    action: "EVIDENCE_VERIFIED",
    target: "Success plan 56",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-057",
    timestamp: "2026-07-01T17:39:00.000Z",
    actor: "Research and Innovation Council",
    action: "OBSERVATION_RECORDED",
    target: "Evidence record 57",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-058",
    timestamp: "2026-07-02T18:46:00.000Z",
    actor: "Research Director",
    action: "READINESS_RECALCULATED",
    target: "Observation 58",
    determination: "HOLD",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-059",
    timestamp: "2026-07-03T19:53:00.000Z",
    actor: "System Import",
    action: "MENTORSHIP_UPDATED",
    target: "Collaboration 59",
    determination: "ESCALATE",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
  {
    id: "AUD-060",
    timestamp: "2026-07-04T20:00:00.000Z",
    actor: "Daniel Cho",
    action: "PLAN_UPDATED",
    target: "Research project 60",
    determination: "ALLOW",
    detail: "Preserved program-development action with actor, target, determination, and bounded detail.",
  },
];


const initialState: WorkspaceState = {
  schema: "TA14_ACADEMY_RESEARCH_INNOVATION_V1",
  program: seedProgram,
  plans: seedPlans,
  competencies: seedCompetencies,
  competencyRecords: seedCompetencyRecords,
  activities: seedActivities,
  pathways: seedPathways,
  collaborations: seedCollaborations,
  observations: seedObservations,
  portfolio: seedPortfolio,
  improvements: seedImprovements,
  evidence: seedEvidence,
  audit: seedAudit,
};

function scoreTone(score: number): string {
  if (score >= 90) return "#45d483";
  if (score >= 75) return "#71b7ff";
  if (score >= 60) return "#f0c35c";
  return "#ff6b76";
}

function downloadText(filename: string, text: string, type = "application/json") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  return [
    keys.map(csvCell).join(","),
    ...rows.map((row) => keys.map((key) => csvCell(row[key])).join(",")),
  ].join("\n");
}

function validateWorkspace(value: unknown): value is WorkspaceState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<WorkspaceState>;
  return (
    candidate.schema === "TA14_ACADEMY_RESEARCH_INNOVATION_V1" &&
    Array.isArray(candidate.program) &&
    Array.isArray(candidate.plans) &&
    Array.isArray(candidate.competencies) &&
    Array.isArray(candidate.activities) &&
    Array.isArray(candidate.evidence) &&
    Array.isArray(candidate.audit)
  );
}

const tabs: { key: TabKey; label: string; description: string }[] = [
  { key: "overview", label: "Mission Overview", description: "Institutional development posture" },
  { key: "success-plans", label: "Development Plans", description: "Objectives, milestones, and risk" },
  { key: "competencies", label: "Competency Framework", description: "Required capability and evidence" },
  { key: "catalog", label: "Learning Catalog", description: "Workshops, initiatives, coaching, and labs" },
  { key: "pathways", label: "Research Portfolio Paths", description: "Sequenced program progression" },
  { key: "collaboration", label: "Governance Reviews", description: "Bounded coaching relationships" },
  { key: "observations", label: "Quality Reviews", description: "Research review and learning evidence" },
  { key: "portfolio", label: "Learning Portfolio", description: "Preserved program artifacts" },
  { key: "improvement", label: "Improvement Plans", description: "Corrective action and monitoring" },
  { key: "readiness", label: "Readiness", description: "Evidence-bound readiness scoring" },
  { key: "evidence", label: "Evidence Repository", description: "Source, status, hash, and limitations" },
  { key: "reports", label: "Reports", description: "Institutional analysis and export" },
  { key: "audit", label: "Audit Timeline", description: "Attributable action history" },
];

export default function ProgramDevelopmentCenterPage() {
  const [workspace, setWorkspace] = useState<WorkspaceState>(initialState);
  const [tab, setTab] = useState<TabKey>("overview");
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedProgramId, setSelectedProgramId] = useState(seedProgram[0].id);
  const [modal, setModal] = useState<ModalKey>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (validateWorkspace(parsed)) setWorkspace(parsed);
      }
    } catch {
      setToast("Local workspace could not be restored. Seed data remains active.");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  }, [workspace, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const programs = useMemo(
    () => Array.from(new Set(workspace.program.map((member) => member.program))).sort(),
    [workspace.program],
  );

  const filteredProgram = useMemo(() => {
    const query = search.trim().toLowerCase();
    return workspace.program.filter((member) => {
      const matchesQuery =
        !query ||
        [member.name, member.email, member.title, member.program, ...member.specialties]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesProgram = program === "ALL" || member.program === program;
      const matchesStatus = statusFilter === "ALL" || member.status === statusFilter;
      return matchesQuery && matchesProgram && matchesStatus;
    });
  }, [workspace.program, search, program, statusFilter]);

  const selectedProgram = workspace.program.find((member) => member.id === selectedProgramId) ?? workspace.program[0];
  const selectedPlans = workspace.plans.filter((plan) => plan.programId === selectedProgram?.id);
  const selectedRecords = workspace.competencyRecords.filter((record) => record.programId === selectedProgram?.id);
  const selectedEvidence = workspace.evidence.filter((record) => record.programId === selectedProgram?.id);

  const metrics = useMemo(() => {
    const active = workspace.program.filter((member) => member.status === "ACTIVE").length;
    const atRisk = workspace.plans.filter((plan) => plan.status === "AT_RISK").length;
    const readiness = Math.round(
      workspace.program.reduce((sum, member) => sum + member.readiness, 0) /
        Math.max(workspace.program.length, 1),
    );
    const verifiedEvidence = workspace.evidence.filter((item) => item.status === "VERIFIED").length;
    const openImprovements = workspace.improvements.filter((item) => ["OPEN", "MONITORING", "ESCALATED"].includes(item.status)).length;
    const overdueObservations = workspace.observations.filter((item) => item.status === "OVERDUE").length;
    return { active, atRisk, readiness, verifiedEvidence, openImprovements, overdueObservations };
  }, [workspace]);

  function addAudit(action: string, target: string, determination: Determination, detail: string) {
    setWorkspace((current) => ({
      ...current,
      audit: [
        {
          id: uid("AUD"),
          timestamp: new Date().toISOString(),
          actor: "Current Academy Administrator",
          action,
          target,
          determination,
          detail,
        },
        ...current.audit,
      ],
    }));
  }

  function updateProgram(member: ProgramProfile) {
    setWorkspace((current) => ({
      ...current,
      program: current.program.map((item) => (item.id === member.id ? member : item)),
    }));
    addAudit("FACULTY_UPDATED", member.id, "ALLOW", `Updated program profile for ${member.name}.`);
    setToast("Program profile preserved locally.");
  }

  function exportJson() {
    downloadText(
      `TA-14_Program_Development_Export_${today()}.json`,
      JSON.stringify(workspace, null, 2),
    );
    addAudit("WORKSPACE_EXPORTED", "Compliance and Assurance Center", "ALLOW", "Exported complete JSON workspace.");
    setToast("Complete JSON workspace exported.");
  }

  function exportProgramCsv() {
    downloadText(
      `TA-14_Program_Development_Program_${today()}.csv`,
      toCsv(workspace.program as unknown as Record<string, unknown>[]),
      "text/csv",
    );
    addAudit("FACULTY_CSV_EXPORTED", "Program roster", "ALLOW", "Exported program roster as CSV.");
    setToast("Program CSV exported.");
  }

  async function importWorkspace(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!validateWorkspace(parsed)) throw new Error("Schema mismatch");
      setWorkspace(parsed);
      setSelectedProgramId(parsed.program[0]?.id ?? "");
      setToast("Validated workspace imported.");
    } catch {
      setToast("Import denied: file does not match the Program Success schema.");
    } finally {
      event.target.value = "";
    }
  }

  function resetWorkspace() {
    if (!window.confirm("Reset the Compliance and Assurance Center to its institutional seed state?")) return;
    setWorkspace(initialState);
    setSelectedProgramId(initialState.program[0].id);
    setToast("Workspace reset to institutional seed data.");
  }

  return (
    <main style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }
        button, input, select, textarea { font: inherit; }
        th { text-align: left; color: #93abc4; background: rgba(12,35,61,.96); padding: 12px; position: sticky; top: 0; z-index: 1; }
        td { padding: 12px; border-top: 1px solid rgba(128,173,224,.11); vertical-align: top; color: #c7d6e6; }
        tr:hover td { background: rgba(80,145,220,.045); }
        @media (max-width: 1100px) {
          .ta14-hide-mobile { display: none; }
        }
      `}</style>
      <div style={styles.backdropOne} />
      <div style={styles.backdropTwo} />
      <header style={styles.header}>
        <div>
          <div style={styles.eyebrow}>TA-14 ACADEMY · INSTITUTIONAL ADMINISTRATION</div>
          <h1 style={styles.title}>Compliance and Assurance Center</h1>
          <p style={styles.subtitle}>
            Govern program growth through preserved plans, evidence-bound competency, collaboration,
            observation, corrective action, and challengeable readiness determinations.
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.buttonSecondary} onClick={() => importRef.current?.click()}>Import JSON</button>
          <button style={styles.buttonSecondary} onClick={exportProgramCsv}>Export CSV</button>
          <button style={styles.buttonPrimary} onClick={exportJson}>Export Workspace</button>
          <input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importWorkspace} />
        </div>
      </header>

      <section style={styles.canonBanner}>
        <strong>No admissible evidence. No admissible execution.</strong>
        <span>
          Development activity does not itself create learning authority. Readiness must remain tied to
          current evidence, declared scope, preserved continuity, and authorized institutional review.
        </span>
      </section>

      <section style={styles.metricsGrid}>
        <MetricCard label="Active program" value={metrics.active} detail={`${workspace.program.length} total records`} />
        <MetricCard label="Institutional readiness" value={`${metrics.readiness}%`} detail="Average evidence-bound score" tone={scoreTone(metrics.readiness)} />
        <MetricCard label="Plans at risk" value={metrics.atRisk} detail="Require bounded intervention" tone="#f0c35c" />
        <MetricCard label="Verified evidence" value={metrics.verifiedEvidence} detail={`${workspace.evidence.length} repository records`} />
        <MetricCard label="Open intervention and remediation plans" value={metrics.openImprovements} detail="Open, monitoring, or escalated" tone="#ff9b6b" />
        <MetricCard label="Overdue observations" value={metrics.overdueObservations} detail="Research review continuity risk" tone="#ff6b76" />
      </section>

      <section style={styles.workspaceShell}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarTitle}>Development workspaces</div>
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              style={{ ...styles.tabButton, ...(tab === item.key ? styles.tabButtonActive : {}) }}
            >
              <span style={styles.tabLabel}>{item.label}</span>
              <span style={styles.tabDescription}>{item.description}</span>
            </button>
          ))}
          <div style={styles.sidebarFooter}>
            <button style={styles.buttonDangerGhost} onClick={resetWorkspace}>Reset local workspace</button>
            <small style={styles.muted}>Schema: {workspace.schema}</small>
          </div>
        </aside>

        <div style={styles.content}>
          <div style={styles.toolbar}>
            <input
              style={styles.search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search program, title, program, specialty..."
            />
            <select style={styles.select} value={program} onChange={(event) => setProgram(event.target.value)}>
              <option value="ALL">All programs</option>
              {programs.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select style={styles.select} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="REVIEW">Review</option>
              <option value="LEAVE">Leave</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <button style={styles.buttonPrimary} onClick={() => setModal("program")}>New research project</button>
          </div>

          {tab === "overview" && <OverviewTab workspace={workspace} filteredProgram={filteredProgram} onSelect={setSelectedProgramId} selectedProgramId={selectedProgramId} />}
          {tab === "success-plans" && <PlansTab workspace={workspace} selectedProgram={selectedProgram} onCreate={() => setModal("plan")} />}
          {tab === "competencies" && <CompetenciesTab workspace={workspace} selectedProgram={selectedProgram} />}
          {tab === "catalog" && <CatalogTab workspace={workspace} onCreate={() => setModal("activity")} />}
          {tab === "pathways" && <PathwaysTab workspace={workspace} />}
          {tab === "collaboration" && <CollaborationTab workspace={workspace} />}
          {tab === "observations" && <ObservationsTab workspace={workspace} onCreate={() => setModal("observation")} />}
          {tab === "portfolio" && <PortfolioTab workspace={workspace} selectedProgram={selectedProgram} />}
          {tab === "improvement" && <ImprovementTab workspace={workspace} onCreate={() => setModal("improvement")} />}
          {tab === "readiness" && <ReadinessTab workspace={workspace} />}
          {tab === "evidence" && <EvidenceTab workspace={workspace} onCreate={() => setModal("evidence")} />}
          {tab === "reports" && <ReportsTab workspace={workspace} />}
          {tab === "audit" && <AuditTab workspace={workspace} />}
        </div>
      </section>

      {selectedProgram && (
        <section style={styles.detailRail}>
          <div style={styles.detailHeader}>
            <div>
              <div style={styles.eyebrow}>SELECTED FACULTY RECORD</div>
              <h2 style={styles.sectionTitle}>{selectedProgram.name}</h2>
              <p style={styles.muted}>{selectedProgram.title} · {selectedProgram.program}</p>
            </div>
            <span style={{ ...styles.scoreBadge, borderColor: scoreTone(selectedProgram.readiness), color: scoreTone(selectedProgram.readiness) }}>
              {selectedProgram.readiness}% ready
            </span>
          </div>
          <div style={styles.detailGrid}>
            <DetailCard title="Development posture" lines={[
              `Status: ${selectedProgram.status}`,
              `Initiative load: ${selectedProgram.initiativeLoad}%`,
              `Engagement and participation: ${selectedProgram.engagementHours}/${selectedProgram.engagementTarget} hours`,
              `Next review: ${selectedProgram.nextReview}`,
            ]} />
            <DetailCard title="Current plans" lines={selectedPlans.length ? selectedPlans.map((plan) => `${plan.status} · ${plan.title} · ${plan.progress}%`) : ["No active plan"]} />
            <DetailCard title="Competency evidence" lines={[
              `${selectedRecords.length} competency records`,
              `${selectedRecords.filter((record) => record.determination === "ALLOW").length} ALLOW determinations`,
              `${selectedEvidence.filter((record) => record.status === "VERIFIED").length} verified evidence objects`,
            ]} />
            <DetailCard title="Declared goals" lines={selectedProgram.goals} />
          </div>
        </section>
      )}

      {modal === "program" && <ProgramModal onClose={() => setModal(null)} onSave={(member) => { setWorkspace((current) => ({ ...current, program: [member, ...current.program] })); setSelectedProgramId(member.id); setModal(null); setToast("Research project created."); }} />}
      {modal === "plan" && <PlanModal program={workspace.program} selectedProgramId={selectedProgramId} onClose={() => setModal(null)} onSave={(plan) => { setWorkspace((current) => ({ ...current, plans: [plan, ...current.plans] })); setModal(null); setToast("Success plan created."); }} />}
      {modal === "activity" && <ActivityModal competencies={workspace.competencies} onClose={() => setModal(null)} onSave={(activity) => { setWorkspace((current) => ({ ...current, activities: [activity, ...current.activities] })); setModal(null); setToast("Learning activity created."); }} />}
      {modal === "observation" && <ObservationModal program={workspace.program} onClose={() => setModal(null)} onSave={(observation) => { setWorkspace((current) => ({ ...current, observations: [observation, ...current.observations] })); setModal(null); setToast("Observation scheduled."); }} />}
      {modal === "evidence" && <EvidenceModal program={workspace.program} onClose={() => setModal(null)} onSave={(record) => { setWorkspace((current) => ({ ...current, evidence: [record, ...current.evidence] })); setModal(null); setToast("Evidence record preserved."); }} />}
      {modal === "improvement" && <ImprovementModal program={workspace.program} onClose={() => setModal(null)} onSave={(plan) => { setWorkspace((current) => ({ ...current, improvements: [plan, ...current.improvements] })); setModal(null); setToast("Improvement plan opened."); }} />}
      {toast && <div style={styles.toast}>{toast}</div>}
    </main>
  );
}

function MetricCard({ label, value, detail, tone = "#71b7ff" }: { label: string; value: string | number; detail: string; tone?: string }) {
  return <article style={styles.metricCard}><div style={styles.metricLabel}>{label}</div><div style={{ ...styles.metricValue, color: tone }}>{value}</div><div style={styles.metricDetail}>{detail}</div></article>;
}

function ProgressBar({ value }: { value: number }) {
  return <div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${Math.max(0, Math.min(100, value))}%`, background: scoreTone(value) }} /></div>;
}

function Pill({ children, tone = "#71b7ff" }: { children: React.ReactNode; tone?: string }) {
  return <span style={{ ...styles.pill, color: tone, borderColor: `${tone}66`, background: `${tone}16` }}>{children}</span>;
}

function SectionHeading({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div style={styles.sectionHeading}><div><h2 style={styles.sectionTitle}>{title}</h2><p style={styles.muted}>{description}</p></div>{action}</div>;
}

function OverviewTab({ workspace, filteredProgram, onSelect, selectedProgramId }: { workspace: WorkspaceState; filteredProgram: ProgramProfile[]; onSelect: (id: string) => void; selectedProgramId: string }) {
  const upcoming = [...workspace.activities].filter((activity) => activity.status !== "COMPLETE").sort((a, b) => a.start.localeCompare(b.start)).slice(0, 6);
  return <div>
    <SectionHeading title="Program development mission control" description="A single view of program readiness, workload, development risk, and upcoming institutional activity." />
    <div style={styles.twoColumn}>
      <div style={styles.panel}>
        <h3 style={styles.cardTitle}>Program roster</h3>
        <div style={styles.stack}>{filteredProgram.map((member) => <button key={member.id} onClick={() => onSelect(member.id)} style={{ ...styles.listButton, ...(selectedProgramId === member.id ? styles.listButtonActive : {}) }}><div><strong>{member.name}</strong><div style={styles.mutedSmall}>{member.title} · {member.program}</div></div><div style={styles.listRight}><Pill tone={member.status === "ACTIVE" ? "#45d483" : "#f0c35c"}>{member.status}</Pill><strong style={{ color: scoreTone(member.readiness) }}>{member.readiness}%</strong></div></button>)}</div>
      </div>
      <div style={styles.panel}>
        <h3 style={styles.cardTitle}>Upcoming development activity</h3>
        <div style={styles.stack}>{upcoming.map((activity) => <div key={activity.id} style={styles.rowCard}><div><strong>{activity.title}</strong><div style={styles.mutedSmall}>{activity.start} · {activity.format} · {activity.hours} hours</div></div><Pill tone={activity.status === "IN_PROGRESS" ? "#f0c35c" : "#71b7ff"}>{activity.status}</Pill></div>)}</div>
      </div>
    </div>
    <div style={styles.threeColumn}>
      <SummaryPanel title="Plan health" items={[
        `${workspace.plans.filter((item) => item.status === "ACTIVE").length} active`,
        `${workspace.plans.filter((item) => item.status === "AT_RISK").length} at risk`,
        `${workspace.plans.filter((item) => item.status === "COMPLETE").length} complete`,
      ]} />
      <SummaryPanel title="Observation posture" items={[
        `${workspace.observations.filter((item) => item.status === "COMPLETE").length} complete`,
        `${workspace.observations.filter((item) => item.status === "FOLLOW_UP").length} follow-up`,
        `${workspace.observations.filter((item) => item.status === "OVERDUE").length} overdue`,
      ]} />
      <SummaryPanel title="Evidence posture" items={[
        `${workspace.evidence.filter((item) => item.status === "VERIFIED").length} verified`,
        `${workspace.evidence.filter((item) => item.status === "PENDING").length} pending`,
        `${workspace.evidence.filter((item) => item.status === "REJECTED").length} rejected`,
      ]} />
    </div>
  </div>;
}

function PlansTab({ workspace, selectedProgram, onCreate }: { workspace: WorkspaceState; selectedProgram?: ProgramProfile; onCreate: () => void }) {
  const plans = selectedProgram ? workspace.plans.filter((plan) => plan.programId === selectedProgram.id) : workspace.plans;
  return <div><SectionHeading title="Professional success plans" description="Objectives remain attributable, measurable, time-bound, and connected to preserved evidence." action={<button style={styles.buttonPrimary} onClick={onCreate}>Create plan</button>} /><div style={styles.cardGrid}>{plans.map((plan) => <article key={plan.id} style={styles.panel}><div style={styles.cardHeader}><div><Pill tone={plan.status === "AT_RISK" ? "#ff9b6b" : plan.status === "ACTIVE" ? "#45d483" : "#71b7ff"}>{plan.status}</Pill><h3 style={styles.cardTitle}>{plan.title}</h3><p style={styles.mutedSmall}>{plan.cycle} · Due {plan.due}</p></div><Pill tone={plan.priority === "CRITICAL" ? "#ff6b76" : "#f0c35c"}>{plan.priority}</Pill></div><ProgressBar value={plan.progress} /><div style={styles.objectiveGrid}><div><strong>Objectives</strong>{plan.objectives.map((item) => <p key={item} style={styles.mutedSmall}>• {item}</p>)}</div><div><strong>Success measures</strong>{plan.successMeasures.map((item) => <p key={item} style={styles.mutedSmall}>• {item}</p>)}</div></div>{plan.risks.length > 0 && <div style={styles.warningBox}><strong>Declared risks</strong>{plan.risks.map((risk) => <div key={risk}>• {risk}</div>)}</div>}</article>)}</div></div>;
}

function CompetenciesTab({ workspace, selectedProgram }: { workspace: WorkspaceState; selectedProgram?: ProgramProfile }) {
  return <div><SectionHeading title="Learning competency framework" description="Required levels are separated from current evidence and cannot be inferred from role title alone." /><div style={styles.tableWrap}><table style={styles.table}><thead><tr><th>Competency</th><th>Domain</th><th>Required</th><th>Current</th><th>Score</th><th>Evidence determination</th><th>Revalidate</th></tr></thead><tbody>{workspace.competencies.map((competency) => { const record = workspace.competencyRecords.find((item) => item.competencyId === competency.id && item.programId === selectedProgram?.id); const current = record?.level ?? "UNASSESSED"; const gap = record ? competencyRank[record.level] < competencyRank[competency.requiredLevel] : true; return <tr key={competency.id}><td><strong>{competency.name}</strong><div style={styles.mutedSmall}>{competency.description}</div></td><td>{competency.domain}</td><td><Pill>{competency.requiredLevel}</Pill></td><td><Pill tone={gap ? "#f0c35c" : "#45d483"}>{current}</Pill></td><td>{record ? `${record.score}%` : "—"}</td><td>{record ? <Pill tone={determinationTone[record.determination]}>{record.determination}</Pill> : <Pill tone="#f0c35c">HOLD</Pill>}</td><td>{competency.revalidationMonths} months</td></tr>; })}</tbody></table></div></div>;
}

function CatalogTab({ workspace, onCreate }: { workspace: WorkspaceState; onCreate: () => void }) {
  return <div><SectionHeading title="Learning activity catalog" description="Development offerings declare provider, facilitator, competency relationship, capacity, and status." action={<button style={styles.buttonPrimary} onClick={onCreate}>Add activity</button>} /><div style={styles.cardGrid}>{workspace.activities.map((activity) => <article key={activity.id} style={styles.panel}><div style={styles.cardHeader}><div><Pill>{activity.format}</Pill><h3 style={styles.cardTitle}>{activity.title}</h3></div><Pill tone={activity.status === "COMPLETE" ? "#45d483" : activity.status === "IN_PROGRESS" ? "#f0c35c" : "#71b7ff"}>{activity.status}</Pill></div><p style={styles.muted}>{activity.description}</p><div style={styles.metaGrid}><span>Provider: {activity.provider}</span><span>Facilitator: {activity.facilitator}</span><span>Dates: {activity.start} → {activity.end}</span><span>Hours: {activity.hours}</span><span>Seats: {activity.enrolled.length}/{activity.seats}</span><span>Category: {activity.category}</span></div></article>)}</div></div>;
}

function PathwaysTab({ workspace }: { workspace: WorkspaceState }) {
  return <div><SectionHeading title="Program research pathways" description="Sequenced development does not replace the evidence and authority required for final learning authorization." /><div style={styles.cardGrid}>{workspace.pathways.map((pathway) => <article key={pathway.id} style={styles.panel}><div style={styles.cardHeader}><h3 style={styles.cardTitle}>{pathway.name}</h3><Pill tone={pathway.status === "PUBLISHED" ? "#45d483" : "#f0c35c"}>{pathway.status}</Pill></div><p style={styles.muted}>{pathway.description}</p><div style={styles.metaGrid}><span>Audience: {pathway.audience}</span><span>Estimated: {pathway.estimatedHours} hours</span><span>{pathway.activityIds.length} activities</span><span>{pathway.competencyIds.length} competencies</span></div><div style={styles.chain}>{pathway.activityIds.map((id, index) => <span key={id} style={styles.chainNode}>{index + 1}. {workspace.activities.find((item) => item.id === id)?.title ?? id}</span>)}</div></article>)}</div></div>;
}

function CollaborationTab({ workspace }: { workspace: WorkspaceState }) {
  const name = (id: string) => workspace.program.find((member) => member.id === id)?.name ?? id;
  return <div><SectionHeading title="Collaboration and coaching" description="Collaboration preserves role boundaries, goals, cadence, meeting evidence, and outcome review." /><div style={styles.cardGrid}>{workspace.collaborations.map((item) => <article key={item.id} style={styles.panel}><div style={styles.cardHeader}><div><Pill tone={item.status === "ACTIVE" ? "#45d483" : "#f0c35c"}>{item.status}</Pill><h3 style={styles.cardTitle}>{name(item.advisorId)} → {name(item.adviseeId)}</h3></div><span style={styles.largeNumber}>{item.meetingCount}</span></div><p style={styles.muted}>{item.focus}</p><div style={styles.metaGrid}><span>Cadence: {item.cadence}</span><span>Next meeting: {item.nextMeeting}</span><span>Window: {item.start} → {item.end}</span></div>{item.goals.map((goal) => <div key={goal} style={styles.goalLine}>• {goal}</div>)}</article>)}</div></div>;
}

function ObservationsTab({ workspace, onCreate }: { workspace: WorkspaceState; onCreate: () => void }) {
  const name = (id: string) => workspace.program.find((member) => member.id === id)?.name ?? id;
  return <div><SectionHeading title="Performance observations and research review" description="Observation preserves strengths, adverse findings, required actions, and supporting evidence." action={<button style={styles.buttonPrimary} onClick={onCreate}>Schedule observation</button>} /><div style={styles.tableWrap}><table style={styles.table}><thead><tr><th>Program</th><th>Initiative</th><th>Reviewer</th><th>Date</th><th>Status</th><th>Score</th><th>Findings</th><th>Required action</th></tr></thead><tbody>{workspace.observations.map((item) => <tr key={item.id}><td><strong>{name(item.programId)}</strong></td><td>{item.initiative}</td><td>{item.reviewer}</td><td>{item.date}</td><td><Pill tone={item.status === "OVERDUE" ? "#ff6b76" : item.status === "COMPLETE" ? "#45d483" : "#f0c35c"}>{item.status}</Pill></td><td style={{ color: scoreTone(item.score), fontWeight: 800 }}>{item.score}%</td><td>{item.findings.join("; ")}</td><td>{item.requiredActions.join("; ") || "None"}</td></tr>)}</tbody></table></div></div>;
}

function PortfolioTab({ workspace, selectedProgram }: { workspace: WorkspaceState; selectedProgram?: ProgramProfile }) {
  const items = selectedProgram ? workspace.portfolio.filter((item) => item.programId === selectedProgram.id) : workspace.portfolio;
  return <div><SectionHeading title="Learning evidence portfolio" description="Artifacts preserve provenance, declared visibility, evidence relationships, and bounded claims." /><div style={styles.cardGrid}>{items.map((item) => <article key={item.id} style={styles.panel}><div style={styles.cardHeader}><div><Pill>{item.category}</Pill><h3 style={styles.cardTitle}>{item.title}</h3></div><Pill tone={item.visibility === "PUBLIC" ? "#45d483" : item.visibility === "INSTITUTION" ? "#71b7ff" : "#9f8cff"}>{item.visibility}</Pill></div><p style={styles.muted}>{item.summary}</p><div style={styles.tagRow}>{item.tags.map((tag) => <span key={tag} style={styles.tag}>#{tag}</span>)}</div><div style={styles.mutedSmall}>{item.created} · {item.evidenceIds.length} evidence relationship(s)</div></article>)}</div></div>;
}

function ImprovementTab({ workspace, onCreate }: { workspace: WorkspaceState; onCreate: () => void }) {
  const name = (id: string) => workspace.program.find((member) => member.id === id)?.name ?? id;
  return <div><SectionHeading title="Program intervention and remediation plans" description="Corrective action is separated from punishment and remains tied to findings, checkpoints, and fresh evidence." action={<button style={styles.buttonPrimary} onClick={onCreate}>Open improvement plan</button>} /><div style={styles.cardGrid}>{workspace.improvements.map((item) => <article key={item.id} style={styles.panel}><div style={styles.cardHeader}><div><Pill tone={item.status === "ESCALATED" ? "#ff6b76" : item.status === "SATISFIED" ? "#45d483" : "#f0c35c"}>{item.status}</Pill><h3 style={styles.cardTitle}>{item.title}</h3><p style={styles.mutedSmall}>{name(item.programId)} · Trigger: {item.trigger}</p></div><Pill tone={determinationTone[item.determination]}>{item.determination}</Pill></div><ProgressBar value={item.progress} /><div style={styles.metaGrid}><span>Owner: {item.owner}</span><span>Due: {item.due}</span><span>Priority: {item.priority}</span><span>{item.progress}% complete</span></div><div style={styles.objectiveGrid}><div><strong>Actions</strong>{item.actions.map((action) => <p key={action} style={styles.mutedSmall}>• {action}</p>)}</div><div><strong>Checkpoints</strong>{item.checkpoints.map((checkpoint) => <p key={checkpoint} style={styles.mutedSmall}>• {checkpoint}</p>)}</div></div></article>)}</div></div>;
}

function ReadinessTab({ workspace }: { workspace: WorkspaceState }) {
  return <div><SectionHeading title="Program readiness scoring" description="Readiness is an operational aid, not independent permission. Missing authority or stale evidence can still force HOLD." /><div style={styles.tableWrap}><table style={styles.table}><thead><tr><th>Program</th><th>Readiness</th><th>Initiative load</th><th>CE completion</th><th>Competency ALLOW</th><th>Verified evidence</th><th>Open improvement</th><th>Institutional posture</th></tr></thead><tbody>{workspace.program.map((member) => { const records = workspace.competencyRecords.filter((item) => item.programId === member.id); const allow = records.filter((item) => item.determination === "ALLOW").length; const evidence = workspace.evidence.filter((item) => item.programId === member.id && item.status === "VERIFIED").length; const improvements = workspace.improvements.filter((item) => item.programId === member.id && item.status !== "SATISFIED").length; const posture: Determination = member.readiness >= 85 && member.initiativeLoad <= 85 && improvements === 0 ? "ALLOW" : member.readiness >= 70 ? "HOLD" : "ESCALATE"; return <tr key={member.id}><td><strong>{member.name}</strong><div style={styles.mutedSmall}>{member.title}</div></td><td><strong style={{ color: scoreTone(member.readiness) }}>{member.readiness}%</strong><ProgressBar value={member.readiness} /></td><td>{member.initiativeLoad}%</td><td>{member.engagementHours}/{member.engagementTarget}</td><td>{allow}/{records.length}</td><td>{evidence}</td><td>{improvements}</td><td><Pill tone={determinationTone[posture]}>{posture}</Pill></td></tr>; })}</tbody></table></div><div style={styles.infoBox}><strong>Scoring boundary:</strong> readiness combines development evidence, workload, engagement and participation, observed practice, and corrective-action posture. It cannot override expired authorization, unresolved conflict, or missing institutional authority.</div></div>;
}

function EvidenceTab({ workspace, onCreate }: { workspace: WorkspaceState; onCreate: () => void }) {
  const name = (id: string) => workspace.program.find((member) => member.id === id)?.name ?? id;
  return <div><SectionHeading title="Program management evidence repository" description="Every record declares source, capture date, verification state, related objects, hash, and limitations." action={<button style={styles.buttonPrimary} onClick={onCreate}>Preserve evidence</button>} /><div style={styles.tableWrap}><table style={styles.table}><thead><tr><th>Evidence</th><th>Program</th><th>Type</th><th>Source</th><th>Captured</th><th>Status</th><th>Hash</th><th>Limitations</th></tr></thead><tbody>{workspace.evidence.map((item) => <tr key={item.id}><td><strong>{item.title}</strong><div style={styles.mutedSmall}>{item.id}</div></td><td>{name(item.programId)}</td><td>{item.type}</td><td>{item.source}</td><td>{item.captured}</td><td><Pill tone={item.status === "VERIFIED" ? "#45d483" : item.status === "PENDING" ? "#f0c35c" : "#ff6b76"}>{item.status}</Pill></td><td><code style={styles.code}>{item.hash.slice(0, 18)}…</code></td><td>{item.limitations}</td></tr>)}</tbody></table></div></div>;
}

function ReportsTab({ workspace }: { workspace: WorkspaceState }) {
  const byProgram = Array.from(new Set(workspace.program.map((item) => item.program))).map((program) => { const members = workspace.program.filter((item) => item.program === program); return { program, count: members.length, readiness: Math.round(members.reduce((sum, item) => sum + item.readiness, 0) / members.length), load: Math.round(members.reduce((sum, item) => sum + item.initiativeLoad, 0) / members.length) }; });
  return <div><SectionHeading title="Program management reporting" description="Reports expose favorable and adverse conditions without turning approval rate into the primary success metric." /><div style={styles.threeColumn}><SummaryPanel title="Participation" items={[`${workspace.activities.reduce((sum, item) => sum + item.enrolled.length, 0)} participations`, `${workspace.collaborations.filter((item) => item.status === "ACTIVE").length} active collaborations`, `${workspace.portfolio.length} learning-record artifacts`]} /><SummaryPanel title="Quality and review" items={[`${workspace.observations.filter((item) => item.status === "FOLLOW_UP").length} follow-up observations`, `${workspace.plans.filter((item) => item.status === "AT_RISK").length} plans at risk`, `${workspace.improvements.filter((item) => item.status === "ESCALATED").length} escalated improvements`]} /><SummaryPanel title="Evidence integrity" items={[`${workspace.evidence.filter((item) => item.status === "VERIFIED").length} verified`, `${workspace.evidence.filter((item) => item.status === "PENDING").length} pending`, `${workspace.evidence.filter((item) => item.status === "SUPERSEDED").length} superseded`]} /></div><div style={styles.panel}><h3 style={styles.cardTitle}>Program posture</h3>{byProgram.map((item) => <div key={item.program} style={styles.reportRow}><div><strong>{item.program}</strong><div style={styles.mutedSmall}>{item.count} program</div></div><div style={styles.reportBars}><span>Readiness {item.readiness}%</span><ProgressBar value={item.readiness} /><span>Load {item.load}%</span><ProgressBar value={item.load} /></div></div>)}</div></div>;
}

function AuditTab({ workspace }: { workspace: WorkspaceState }) {
  return <div><SectionHeading title="Audit timeline and activity history" description="Institutional actions remain attributable, time-stamped, target-specific, and determination-aware." /><div style={styles.timeline}>{workspace.audit.map((event) => <article key={event.id} style={styles.timelineItem}><div style={{ ...styles.timelineDot, background: determinationTone[event.determination] }} /><div style={styles.timelineCard}><div style={styles.cardHeader}><div><strong>{event.action}</strong><div style={styles.mutedSmall}>{new Date(event.timestamp).toLocaleString()} · {event.actor}</div></div><Pill tone={determinationTone[event.determination]}>{event.determination}</Pill></div><p style={styles.muted}>{event.target}</p><p style={styles.mutedSmall}>{event.detail}</p></div></article>)}</div></div>;
}

function SummaryPanel({ title, items }: { title: string; items: string[] }) { return <article style={styles.panel}><h3 style={styles.cardTitle}>{title}</h3>{items.map((item) => <div key={item} style={styles.summaryLine}>{item}</div>)}</article>; }
function DetailCard({ title, lines }: { title: string; lines: string[] }) { return <article style={styles.detailCard}><h3 style={styles.cardTitle}>{title}</h3>{lines.map((line) => <div key={line} style={styles.detailLine}>{line}</div>)}</article>; }

function ModalShell({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) { return <div style={styles.modalBackdrop} onMouseDown={onClose}><div style={styles.modal} onMouseDown={(event) => event.stopPropagation()}><div style={styles.modalHeader}><h2 style={styles.sectionTitle}>{title}</h2><button style={styles.closeButton} onClick={onClose}>×</button></div>{children}</div></div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label style={styles.field}><span style={styles.fieldLabel}>{label}</span>{children}</label>; }

function ProgramModal({ onClose, onSave }: { onClose: () => void; onSave: (member: ProgramProfile) => void }) {
  const [form, setForm] = useState({ name: "", email: "", title: "", program: "", notes: "" });
  function submit(event: FormEvent) { event.preventDefault(); onSave({ id: uid("FAC"), name: form.name, email: form.email, title: form.title, program: form.program, status: "REVIEW", readiness: 0, initiativeLoad: 0, engagementHours: 0, engagementTarget: 24, advisorId: null, joined: today(), nextReview: today(), specialties: [], goals: ["Complete initial compliance and assurance plan"], notes: form.notes }); }
  return <ModalShell title="Create compliance and assurance record" onClose={onClose}><form onSubmit={submit} style={styles.formGrid}><Field label="Name"><input required style={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field><Field label="Email"><input required type="email" style={styles.input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field><Field label="Title"><input required style={styles.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field><Field label="Program"><input required style={styles.input} value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} /></Field><Field label="Notes"><textarea style={styles.textarea} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field><div style={styles.modalActions}><button type="button" style={styles.buttonSecondary} onClick={onClose}>Cancel</button><button style={styles.buttonPrimary}>Create record</button></div></form></ModalShell>;
}

function PlanModal({ program, selectedProgramId, onClose, onSave }: { program: ProgramProfile[]; selectedProgramId: string; onClose: () => void; onSave: (plan: SuccessPlan) => void }) {
  const [programId, setProgramId] = useState(selectedProgramId); const [title, setTitle] = useState(""); const [due, setDue] = useState(today()); const [objective, setObjective] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); onSave({ id: uid("PLN"), programId, title, cycle: "2026 Development Cycle", status: "DRAFT", priority: "MEDIUM", owner: "Research and Innovation Council", start: today(), due, progress: 0, objectives: [objective], successMeasures: ["Objective supported by preserved evidence"], dependencies: ["Program and supervisor review"], risks: [], lastUpdate: today() }); }
  return <ModalShell title="Create professional success plan" onClose={onClose}><form onSubmit={submit} style={styles.formGrid}><Field label="Program"><select style={styles.input} value={programId} onChange={(e) => setProgramId(e.target.value)}>{program.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></Field><Field label="Plan title"><input required style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} /></Field><Field label="Due date"><input required type="date" style={styles.input} value={due} onChange={(e) => setDue(e.target.value)} /></Field><Field label="Primary objective"><textarea required style={styles.textarea} value={objective} onChange={(e) => setObjective(e.target.value)} /></Field><div style={styles.modalActions}><button type="button" style={styles.buttonSecondary} onClick={onClose}>Cancel</button><button style={styles.buttonPrimary}>Create plan</button></div></form></ModalShell>;
}

function ActivityModal({ competencies, onClose, onSave }: { competencies: Competency[]; onClose: () => void; onSave: (activity: LearningActivity) => void }) {
  const [title, setTitle] = useState(""); const [category, setCategory] = useState("Research Practice"); const [hours, setHours] = useState(4); const [competencyId, setCompetencyId] = useState(competencies[0]?.id ?? "");
  function submit(event: FormEvent) { event.preventDefault(); onSave({ id: uid("ACT"), title, provider: "TA-14 Academy", category, format: "WORKSHOP", status: "PLANNED", start: today(), end: today(), hours, seats: 12, enrolled: [], competencyIds: [competencyId], facilitator: "To be assigned", description: "New compliance and assurance activity pending facilitator and evidence-plan review." }); }
  return <ModalShell title="Add learning activity" onClose={onClose}><form onSubmit={submit} style={styles.formGrid}><Field label="Activity title"><input required style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} /></Field><Field label="Category"><input required style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)} /></Field><Field label="Hours"><input type="number" min={1} style={styles.input} value={hours} onChange={(e) => setHours(Number(e.target.value))} /></Field><Field label="Primary competency"><select style={styles.input} value={competencyId} onChange={(e) => setCompetencyId(e.target.value)}>{competencies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field><div style={styles.modalActions}><button type="button" style={styles.buttonSecondary} onClick={onClose}>Cancel</button><button style={styles.buttonPrimary}>Add activity</button></div></form></ModalShell>;
}

function ObservationModal({ program, onClose, onSave }: { program: ProgramProfile[]; onClose: () => void; onSave: (observation: Observation) => void }) {
  const [programId, setProgramId] = useState(program[0]?.id ?? ""); const [initiative, setInitiative] = useState(""); const [reviewer, setReviewer] = useState(""); const [date, setDate] = useState(today());
  function submit(event: FormEvent) { event.preventDefault(); onSave({ id: uid("OBS"), programId, reviewer, initiative, date, status: "SCHEDULED", score: 0, strengths: [], findings: [], requiredActions: [], evidenceIds: [] }); }
  return <ModalShell title="Schedule peer observation" onClose={onClose}><form onSubmit={submit} style={styles.formGrid}><Field label="Program"><select style={styles.input} value={programId} onChange={(e) => setProgramId(e.target.value)}>{program.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></Field><Field label="Initiative"><input required style={styles.input} value={initiative} onChange={(e) => setInitiative(e.target.value)} /></Field><Field label="Reviewer"><input required style={styles.input} value={reviewer} onChange={(e) => setReviewer(e.target.value)} /></Field><Field label="Date"><input type="date" style={styles.input} value={date} onChange={(e) => setDate(e.target.value)} /></Field><div style={styles.modalActions}><button type="button" style={styles.buttonSecondary} onClick={onClose}>Cancel</button><button style={styles.buttonPrimary}>Schedule</button></div></form></ModalShell>;
}

function EvidenceModal({ program, onClose, onSave }: { program: ProgramProfile[]; onClose: () => void; onSave: (record: EvidenceRecord) => void }) {
  const [programId, setProgramId] = useState(program[0]?.id ?? ""); const [title, setTitle] = useState(""); const [type, setType] = useState("ARTIFACT"); const [source, setSource] = useState(""); const [limitations, setLimitations] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); onSave({ id: uid("EVD"), programId, title, type, source, captured: today(), status: "PENDING", hash: `pending:${uid("hash")}`, relatedIds: [programId], limitations }); }
  return <ModalShell title="Preserve program evidence" onClose={onClose}><form onSubmit={submit} style={styles.formGrid}><Field label="Program"><select style={styles.input} value={programId} onChange={(e) => setProgramId(e.target.value)}>{program.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></Field><Field label="Evidence title"><input required style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} /></Field><Field label="Type"><input required style={styles.input} value={type} onChange={(e) => setType(e.target.value)} /></Field><Field label="Source"><input required style={styles.input} value={source} onChange={(e) => setSource(e.target.value)} /></Field><Field label="Limitations"><textarea required style={styles.textarea} value={limitations} onChange={(e) => setLimitations(e.target.value)} /></Field><div style={styles.modalActions}><button type="button" style={styles.buttonSecondary} onClick={onClose}>Cancel</button><button style={styles.buttonPrimary}>Preserve record</button></div></form></ModalShell>;
}

function ImprovementModal({ program, onClose, onSave }: { program: ProgramProfile[]; onClose: () => void; onSave: (plan: ImprovementPlan) => void }) {
  const [programId, setProgramId] = useState(program[0]?.id ?? ""); const [title, setTitle] = useState(""); const [trigger, setTrigger] = useState(""); const [due, setDue] = useState(today());
  function submit(event: FormEvent) { event.preventDefault(); onSave({ id: uid("IMP"), programId, title, trigger, status: "OPEN", priority: "HIGH", opened: today(), due, owner: "Research and Innovation Council", actions: ["Complete bounded review with program member"], checkpoints: ["Initial evidence review", "Midpoint check", "Final determination"], progress: 0, determination: "HOLD" }); }
  return <ModalShell title="Open program improvement plan" onClose={onClose}><form onSubmit={submit} style={styles.formGrid}><Field label="Program"><select style={styles.input} value={programId} onChange={(e) => setProgramId(e.target.value)}>{program.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></Field><Field label="Plan title"><input required style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} /></Field><Field label="Trigger finding"><textarea required style={styles.textarea} value={trigger} onChange={(e) => setTrigger(e.target.value)} /></Field><Field label="Due date"><input type="date" style={styles.input} value={due} onChange={(e) => setDue(e.target.value)} /></Field><div style={styles.modalActions}><button type="button" style={styles.buttonSecondary} onClick={onClose}>Cancel</button><button style={styles.buttonPrimary}>Open plan</button></div></form></ModalShell>;
}


const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "linear-gradient(180deg,#06101f 0%,#07192d 44%,#081525 100%)", color: "#eef6ff", padding: "32px", position: "relative", overflow: "hidden", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" },
  backdropOne: { position: "fixed", inset: "-20% auto auto -10%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle,rgba(48,130,255,.20),rgba(48,130,255,0) 70%)", pointerEvents: "none" },
  backdropTwo: { position: "fixed", right: "-12%", bottom: "-25%", width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle,rgba(111,66,193,.18),rgba(111,66,193,0) 70%)", pointerEvents: "none" },
  header: { position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", gap: 28, alignItems: "flex-start", maxWidth: 1680, margin: "0 auto 22px" },
  eyebrow: { color: "#7fc4ff", fontSize: 12, fontWeight: 900, letterSpacing: "0.16em", marginBottom: 8 },
  title: { margin: 0, fontSize: "clamp(34px,5vw,66px)", lineHeight: 1, letterSpacing: "-0.04em", maxWidth: 900 },
  subtitle: { maxWidth: 900, color: "#aabbd0", fontSize: 17, lineHeight: 1.7, margin: "16px 0 0" },
  headerActions: { display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "flex-end" },
  buttonPrimary: { border: "1px solid #4c9dff", background: "linear-gradient(135deg,#1776dc,#3156d8)", color: "white", borderRadius: 12, padding: "11px 16px", fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 30px rgba(36,102,220,.24)" },
  buttonSecondary: { border: "1px solid rgba(129,173,222,.35)", background: "rgba(12,31,54,.78)", color: "#dcecff", borderRadius: 12, padding: "11px 16px", fontWeight: 800, cursor: "pointer" },
  buttonDangerGhost: { width: "100%", border: "1px solid rgba(255,107,118,.35)", background: "rgba(255,107,118,.08)", color: "#ff9da5", borderRadius: 12, padding: "10px 12px", fontWeight: 800, cursor: "pointer" },
  canonBanner: { position: "relative", zIndex: 1, maxWidth: 1680, margin: "0 auto 22px", border: "1px solid rgba(112,183,255,.3)", background: "linear-gradient(90deg,rgba(27,75,126,.44),rgba(13,31,54,.72))", borderRadius: 18, padding: "16px 20px", display: "flex", gap: 18, alignItems: "center", color: "#cfe7ff", lineHeight: 1.55 },
  metricsGrid: { position: "relative", zIndex: 1, maxWidth: 1680, margin: "0 auto 22px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12 },
  metricCard: { border: "1px solid rgba(128,173,224,.18)", background: "rgba(9,26,47,.82)", backdropFilter: "blur(16px)", borderRadius: 16, padding: 18, boxShadow: "0 16px 40px rgba(0,0,0,.2)" },
  metricLabel: { color: "#91a7c0", fontSize: 12, textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 800 },
  metricValue: { fontSize: 32, fontWeight: 950, marginTop: 8 },
  metricDetail: { color: "#8096ad", fontSize: 12, marginTop: 4 },
  workspaceShell: { position: "relative", zIndex: 1, maxWidth: 1680, margin: "0 auto", display: "grid", gridTemplateColumns: "270px minmax(0,1fr)", border: "1px solid rgba(128,173,224,.18)", background: "rgba(5,17,32,.72)", borderRadius: 22, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.28)" },
  sidebar: { padding: 16, background: "rgba(5,15,29,.76)", borderRight: "1px solid rgba(128,173,224,.14)", maxHeight: "calc(100vh - 120px)", overflowY: "auto" },
  sidebarTitle: { padding: "8px 10px 14px", color: "#91a7c0", textTransform: "uppercase", fontSize: 11, letterSpacing: ".12em", fontWeight: 900 },
  tabButton: { width: "100%", textAlign: "left", border: "1px solid transparent", background: "transparent", color: "#c4d3e3", borderRadius: 12, padding: "12px 11px", cursor: "pointer", marginBottom: 5 },
  tabButtonActive: { borderColor: "rgba(91,164,255,.36)", background: "linear-gradient(135deg,rgba(28,105,190,.34),rgba(56,68,160,.22))", boxShadow: "inset 0 0 24px rgba(64,142,255,.08)" },
  tabLabel: { display: "block", fontWeight: 850, fontSize: 13 },
  tabDescription: { display: "block", color: "#72879e", fontSize: 10, marginTop: 3 },
  sidebarFooter: { borderTop: "1px solid rgba(128,173,224,.12)", marginTop: 12, paddingTop: 14, display: "grid", gap: 10 },
  content: { minWidth: 0, padding: 22, maxHeight: "calc(100vh - 120px)", overflowY: "auto" },
  toolbar: { display: "grid", gridTemplateColumns: "minmax(240px,1fr) 190px 160px auto", gap: 10, alignItems: "center", marginBottom: 22 },
  search: { width: "100%", boxSizing: "border-box", border: "1px solid rgba(128,173,224,.22)", background: "rgba(5,19,36,.8)", color: "white", borderRadius: 12, padding: "12px 14px", outline: "none" },
  select: { border: "1px solid rgba(128,173,224,.22)", background: "#0a1b31", color: "white", borderRadius: 12, padding: "12px 14px", outline: "none" },
  sectionHeading: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 18, marginBottom: 18 },
  sectionTitle: { margin: 0, fontSize: 25, letterSpacing: "-0.025em" },
  muted: { color: "#91a7c0", lineHeight: 1.55, margin: "7px 0" },
  mutedSmall: { color: "#7f95ad", fontSize: 12, lineHeight: 1.5 },
  twoColumn: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 14, marginBottom: 14 },
  threeColumn: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 14, marginBottom: 14 },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))", gap: 14 },
  panel: { border: "1px solid rgba(128,173,224,.17)", background: "linear-gradient(155deg,rgba(14,36,62,.8),rgba(7,23,42,.82))", borderRadius: 17, padding: 17, boxShadow: "0 15px 35px rgba(0,0,0,.16)" },
  stack: { display: "grid", gap: 8 },
  listButton: { width: "100%", border: "1px solid rgba(128,173,224,.12)", background: "rgba(7,21,39,.64)", color: "white", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left", cursor: "pointer" },
  listButtonActive: { borderColor: "rgba(91,164,255,.5)", background: "rgba(28,91,158,.24)" },
  listRight: { display: "flex", alignItems: "center", gap: 10 },
  rowCard: { border: "1px solid rgba(128,173,224,.12)", background: "rgba(7,21,39,.64)", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  cardHeader: { display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" },
  cardTitle: { margin: "8px 0 5px", fontSize: 17 },
  pill: { display: "inline-flex", alignItems: "center", border: "1px solid", borderRadius: 999, padding: "4px 8px", fontSize: 10, lineHeight: 1, fontWeight: 900, letterSpacing: ".06em" },
  progressTrack: { height: 8, background: "rgba(255,255,255,.07)", borderRadius: 99, overflow: "hidden", margin: "12px 0" },
  progressFill: { height: "100%", borderRadius: 99, transition: "width .3s ease" },
  objectiveGrid: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 14, marginTop: 14 },
  warningBox: { border: "1px solid rgba(240,195,92,.32)", background: "rgba(240,195,92,.08)", color: "#f6daa0", borderRadius: 12, padding: 12, fontSize: 12, lineHeight: 1.6, marginTop: 12 },
  infoBox: { border: "1px solid rgba(113,183,255,.28)", background: "rgba(113,183,255,.07)", color: "#cfe7ff", borderRadius: 13, padding: 14, lineHeight: 1.6, marginTop: 14 },
  metaGrid: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px 14px", color: "#91a7c0", fontSize: 12, marginTop: 14 },
  chain: { display: "grid", gap: 7, marginTop: 14 },
  chainNode: { borderLeft: "3px solid #4d97ed", background: "rgba(48,105,173,.12)", borderRadius: "0 10px 10px 0", padding: "9px 11px", color: "#cfe2f6", fontSize: 12 },
  largeNumber: { fontSize: 34, fontWeight: 950, color: "#71b7ff" },
  goalLine: { color: "#b8c8da", fontSize: 13, lineHeight: 1.7 },
  tableWrap: { overflowX: "auto", border: "1px solid rgba(128,173,224,.17)", borderRadius: 16 },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 980, background: "rgba(6,20,37,.68)", fontSize: 12 },
  code: { color: "#9bcfff", fontSize: 11 },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 7, margin: "12px 0" },
  tag: { color: "#8abfff", fontSize: 11, background: "rgba(75,142,216,.1)", borderRadius: 999, padding: "4px 8px" },
  reportRow: { display: "grid", gridTemplateColumns: "220px 1fr", alignItems: "center", gap: 18, borderTop: "1px solid rgba(128,173,224,.12)", padding: "14px 0" },
  reportBars: { display: "grid", gridTemplateColumns: "100px 1fr 80px 1fr", alignItems: "center", gap: 10, color: "#91a7c0", fontSize: 12 },
  timeline: { position: "relative", paddingLeft: 16 },
  timelineItem: { position: "relative", paddingLeft: 22, paddingBottom: 14, borderLeft: "1px solid rgba(128,173,224,.2)" },
  timelineDot: { position: "absolute", left: -5, top: 18, width: 9, height: 9, borderRadius: "50%", boxShadow: "0 0 14px currentColor" },
  timelineCard: { border: "1px solid rgba(128,173,224,.15)", background: "rgba(9,28,50,.72)", borderRadius: 14, padding: 14 },
  summaryLine: { padding: "10px 0", borderTop: "1px solid rgba(128,173,224,.1)", color: "#bdcde0" },
  detailRail: { position: "relative", zIndex: 1, maxWidth: 1680, margin: "22px auto 0", border: "1px solid rgba(128,173,224,.18)", background: "rgba(7,22,40,.82)", borderRadius: 20, padding: 20 },
  detailHeader: { display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" },
  detailGrid: { display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12, marginTop: 16 },
  detailCard: { border: "1px solid rgba(128,173,224,.14)", background: "rgba(9,28,49,.7)", borderRadius: 14, padding: 14 },
  detailLine: { borderTop: "1px solid rgba(128,173,224,.08)", padding: "8px 0", color: "#aebfd2", fontSize: 12 },
  scoreBadge: { border: "1px solid", borderRadius: 999, padding: "8px 12px", fontWeight: 900 },
  modalBackdrop: { position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,7,16,.76)", backdropFilter: "blur(8px)", display: "grid", placeItems: "center", padding: 20 },
  modal: { width: "min(720px,96vw)", maxHeight: "90vh", overflowY: "auto", background: "linear-gradient(160deg,#0b2340,#081629)", border: "1px solid rgba(119,178,240,.3)", borderRadius: 20, padding: 20, boxShadow: "0 34px 100px rgba(0,0,0,.5)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 },
  closeButton: { border: "1px solid rgba(128,173,224,.2)", background: "rgba(255,255,255,.04)", color: "white", borderRadius: 10, width: 36, height: 36, fontSize: 22, cursor: "pointer" },
  formGrid: { display: "grid", gap: 13 },
  field: { display: "grid", gap: 6 },
  fieldLabel: { color: "#b8c9db", fontSize: 12, fontWeight: 800 },
  input: { width: "100%", boxSizing: "border-box", border: "1px solid rgba(128,173,224,.24)", background: "#07182c", color: "white", borderRadius: 11, padding: "11px 12px", outline: "none" },
  textarea: { width: "100%", minHeight: 92, boxSizing: "border-box", border: "1px solid rgba(128,173,224,.24)", background: "#07182c", color: "white", borderRadius: 11, padding: "11px 12px", outline: "none", resize: "vertical" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 },
  toast: { position: "fixed", right: 24, bottom: 24, zIndex: 80, border: "1px solid rgba(113,183,255,.38)", background: "#0b2747", color: "#eaf5ff", borderRadius: 13, padding: "13px 16px", boxShadow: "0 20px 60px rgba(0,0,0,.4)", fontWeight: 750 },
};
