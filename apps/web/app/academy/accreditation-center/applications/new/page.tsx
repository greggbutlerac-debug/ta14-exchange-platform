"use client";

/*
 * TA-14 Academy Accreditation Application Intake
 * Production institutional build
 * Governing principle: No admissible evidence. No admissible execution.
 * This page preserves application scope, authority, evidence continuity,
 * standards readiness, disclosures, attestation, and submission receipts.
 */

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

type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type ApplicationState = "DRAFT" | "READY" | "SUBMITTED" | "RETURNED";
type SectionId =
  | "identity"
  | "authority"
  | "scope"
  | "program"
  | "faculty"
  | "standards"
  | "evidence"
  | "learner"
  | "conflicts"
  | "attestation"
  | "review";
type EvidenceStatus = "MISSING" | "PLANNED" | "ATTACHED" | "VERIFIED";
type SelfRating = "NOT_ASSESSED" | "NOT_READY" | "PARTIAL" | "READY";

type Contact = {
  name: string;
  title: string;
  email: string;
  phone: string;
};

type FacultyMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  programs: string;
  qualification: string;
  license: string;
  continuingEducationHours: number;
  conflictDeclared: boolean;
};

type StandardResponse = {
  id: string;
  code: string;
  title: string;
  category: string;
  rating: SelfRating;
  narrative: string;
  evidenceRefs: string;
  owner: string;
};

type EvidenceRequirement = {
  id: string;
  title: string;
  category: string;
  required: boolean;
  status: EvidenceStatus;
  owner: string;
  observedAt: string;
  expiresAt: string;
  source: string;
  hash: string;
  notes: string;
};

type ConflictDisclosure = {
  id: string;
  person: string;
  relationship: string;
  interest: string;
  mitigation: string;
  state: "DISCLOSED" | "REVIEW_REQUIRED" | "RESOLVED";
};

type Application = {
  id: string;
  receiptId: string;
  state: ApplicationState;
  determination: Determination;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  organizationName: string;
  legalName: string;
  tradingName: string;
  organizationType: string;
  website: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  jurisdiction: string;
  registrationNumber: string;
  taxIdLast4: string;
  foundedYear: string;
  primaryContact: Contact;
  accountableExecutive: Contact;
  authorizedSignatory: Contact;
  ownershipSummary: string;
  parentOrganization: string;
  beneficialOwners: string;
  legalAuthorityBasis: string;
  sanctionsDisclosure: string;
  litigationDisclosure: string;
  priorAccreditation: string;
  accreditationScope: string[];
  deliveryModes: string[];
  learnerPopulation: string;
  annualEnrollment: string;
  requestedTerm: string;
  geographicScope: string;
  exclusions: string;
  programName: string;
  programCode: string;
  programDescription: string;
  learningOutcomes: string;
  curriculumArchitecture: string;
  assessmentModel: string;
  competencyModel: string;
  evidenceModel: string;
  qualityModel: string;
  learnerProtections: string;
  complaintsProcess: string;
  recordsRetention: string;
  privacyControls: string;
  accessibilityControls: string;
  businessContinuity: string;
  faculty: FacultyMember[];
  standards: StandardResponse[];
  evidence: EvidenceRequirement[];
  conflicts: ConflictDisclosure[];
  declarationAccuracy: boolean;
  declarationAuthority: boolean;
  declarationCooperation: boolean;
  declarationChanges: boolean;
  signatureName: string;
  signatureTitle: string;
  signatureDate: string;
  signatureIntent: boolean;
  notes: string;
};

const STORAGE_KEY = "ta14-academy-accreditation-application-intake-v1";

const now = () => new Date().toISOString();
const id = (prefix: string) => {
  try {
    return `${prefix}-${crypto.randomUUID()}`;
  } catch {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
};

const STANDARD_SEED: StandardResponse[] = [
  {
    id: "STD-001",
    code: "AC-1.1",
    title: "Authority and accountability",
    category: "Institutional governance",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-002",
    code: "AC-1.2",
    title: "Defined accreditation scope",
    category: "Institutional governance",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-003",
    code: "AC-1.3",
    title: "Governance charter",
    category: "Institutional governance",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-004",
    code: "AC-1.4",
    title: "Delegated authority controls",
    category: "Institutional governance",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-005",
    code: "AC-1.5",
    title: "Conflict-of-interest governance",
    category: "Institutional governance",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-006",
    code: "AC-1.6",
    title: "Policy lifecycle management",
    category: "Institutional governance",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-007",
    code: "AC-1.7",
    title: "Board oversight",
    category: "Institutional governance",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-008",
    code: "AC-1.8",
    title: "Executive accountability",
    category: "Institutional governance",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-009",
    code: "AC-1.9",
    title: "Decision traceability",
    category: "Institutional governance",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-010",
    code: "AC-1.10",
    title: "Independent challenge process",
    category: "Institutional governance",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-011",
    code: "AC-1.11",
    title: "Regulatory obligations register",
    category: "Institutional governance",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-012",
    code: "AC-1.12",
    title: "Institutional risk governance",
    category: "Institutional governance",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-013",
    code: "AC-2.1",
    title: "Program architecture",
    category: "Academic integrity",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-014",
    code: "AC-2.2",
    title: "Competency and assessment model",
    category: "Academic integrity",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-015",
    code: "AC-2.3",
    title: "Evidence integrity and continuity",
    category: "Academic integrity",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-016",
    code: "AC-2.4",
    title: "Learning outcome alignment",
    category: "Academic integrity",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-017",
    code: "AC-2.5",
    title: "Curriculum sequencing",
    category: "Academic integrity",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-018",
    code: "AC-2.6",
    title: "Prerequisite governance",
    category: "Academic integrity",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-019",
    code: "AC-2.7",
    title: "Assessment security",
    category: "Academic integrity",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-020",
    code: "AC-2.8",
    title: "Academic honesty controls",
    category: "Academic integrity",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-021",
    code: "AC-2.9",
    title: "Remediation architecture",
    category: "Academic integrity",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-022",
    code: "AC-2.10",
    title: "Prior learning recognition",
    category: "Academic integrity",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-023",
    code: "AC-2.11",
    title: "Program change control",
    category: "Academic integrity",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-024",
    code: "AC-2.12",
    title: "Completion determination",
    category: "Academic integrity",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-025",
    code: "AC-3.1",
    title: "Qualified and authorized instructors",
    category: "Faculty",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-026",
    code: "AC-3.2",
    title: "Continuing competence",
    category: "Faculty",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-027",
    code: "AC-3.3",
    title: "Instructor onboarding",
    category: "Faculty",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-028",
    code: "AC-3.4",
    title: "Teaching authorization boundaries",
    category: "Faculty",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-029",
    code: "AC-3.5",
    title: "Faculty workload governance",
    category: "Faculty",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-030",
    code: "AC-3.6",
    title: "Peer observation",
    category: "Faculty",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-031",
    code: "AC-3.7",
    title: "Performance improvement",
    category: "Faculty",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-032",
    code: "AC-3.8",
    title: "License and certification monitoring",
    category: "Faculty",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-033",
    code: "AC-3.9",
    title: "Mentor qualification",
    category: "Faculty",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-034",
    code: "AC-3.10",
    title: "Substitute instructor controls",
    category: "Faculty",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-035",
    code: "AC-3.11",
    title: "Faculty conflict disclosure",
    category: "Faculty",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-036",
    code: "AC-3.12",
    title: "Faculty record preservation",
    category: "Faculty",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-037",
    code: "AC-4.1",
    title: "Learner protection and transparency",
    category: "Learner protection",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-038",
    code: "AC-4.2",
    title: "Complaints appeals and remediation",
    category: "Learner protection",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-039",
    code: "AC-4.3",
    title: "Admissions transparency",
    category: "Learner protection",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-040",
    code: "AC-4.4",
    title: "Tuition and fee disclosure",
    category: "Learner protection",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-041",
    code: "AC-4.5",
    title: "Refund and withdrawal controls",
    category: "Learner protection",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-042",
    code: "AC-4.6",
    title: "Accessibility accommodations",
    category: "Learner protection",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-043",
    code: "AC-4.7",
    title: "Privacy and consent",
    category: "Learner protection",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-044",
    code: "AC-4.8",
    title: "Records access",
    category: "Learner protection",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-045",
    code: "AC-4.9",
    title: "Non-retaliation protections",
    category: "Learner protection",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-046",
    code: "AC-4.10",
    title: "Grievance escalation",
    category: "Learner protection",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-047",
    code: "AC-4.11",
    title: "Teach-out protections",
    category: "Learner protection",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-048",
    code: "AC-4.12",
    title: "Marketing accuracy",
    category: "Learner protection",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-049",
    code: "AC-5.1",
    title: "Quality assurance and improvement",
    category: "Quality",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-050",
    code: "AC-5.2",
    title: "Records privacy and retention",
    category: "Quality",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-051",
    code: "AC-5.3",
    title: "Business continuity and teach-out",
    category: "Quality",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-052",
    code: "AC-5.4",
    title: "Internal audit program",
    category: "Quality",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-053",
    code: "AC-5.5",
    title: "Corrective action governance",
    category: "Quality",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-054",
    code: "AC-5.6",
    title: "Performance indicator monitoring",
    category: "Quality",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-055",
    code: "AC-5.7",
    title: "Program review cadence",
    category: "Quality",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-056",
    code: "AC-5.8",
    title: "Benchmarking controls",
    category: "Quality",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-057",
    code: "AC-5.9",
    title: "Root-cause analysis",
    category: "Quality",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-058",
    code: "AC-5.10",
    title: "Management review",
    category: "Quality",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-059",
    code: "AC-5.11",
    title: "Risk-based surveillance",
    category: "Quality",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-060",
    code: "AC-5.12",
    title: "Continuous improvement evidence",
    category: "Quality",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-061",
    code: "AC-6.1",
    title: "Evidence source authority",
    category: "Evidence and technology",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-062",
    code: "AC-6.2",
    title: "Evidence timestamp integrity",
    category: "Evidence and technology",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-063",
    code: "AC-6.3",
    title: "Chain-of-custody continuity",
    category: "Evidence and technology",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-064",
    code: "AC-6.4",
    title: "Record version control",
    category: "Evidence and technology",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-065",
    code: "AC-6.5",
    title: "Hash and provenance controls",
    category: "Evidence and technology",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-066",
    code: "AC-6.6",
    title: "System access governance",
    category: "Evidence and technology",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-067",
    code: "AC-6.7",
    title: "Backup and recovery",
    category: "Evidence and technology",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-068",
    code: "AC-6.8",
    title: "Cybersecurity safeguards",
    category: "Evidence and technology",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-069",
    code: "AC-6.9",
    title: "AI-assisted decision boundaries",
    category: "Evidence and technology",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-070",
    code: "AC-6.10",
    title: "Automated control validation",
    category: "Evidence and technology",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-071",
    code: "AC-6.11",
    title: "Data quality monitoring",
    category: "Evidence and technology",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-072",
    code: "AC-6.12",
    title: "Technology change management",
    category: "Evidence and technology",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-073",
    code: "AC-7.1",
    title: "Enrollment capacity planning",
    category: "Operations",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-074",
    code: "AC-7.2",
    title: "Cohort governance",
    category: "Operations",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-075",
    code: "AC-7.3",
    title: "Attendance integrity",
    category: "Operations",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-076",
    code: "AC-7.4",
    title: "Scheduling controls",
    category: "Operations",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-077",
    code: "AC-7.5",
    title: "Facility readiness",
    category: "Operations",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-078",
    code: "AC-7.6",
    title: "Laboratory safety",
    category: "Operations",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-079",
    code: "AC-7.7",
    title: "Equipment calibration",
    category: "Operations",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-080",
    code: "AC-7.8",
    title: "Vendor oversight",
    category: "Operations",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-081",
    code: "AC-7.9",
    title: "Outsourced service controls",
    category: "Operations",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-082",
    code: "AC-7.10",
    title: "Incident response",
    category: "Operations",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-083",
    code: "AC-7.11",
    title: "Emergency communications",
    category: "Operations",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-084",
    code: "AC-7.12",
    title: "Operational resilience",
    category: "Operations",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-085",
    code: "AC-8.1",
    title: "Financial viability",
    category: "Finance and sustainability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-086",
    code: "AC-8.2",
    title: "Budget governance",
    category: "Finance and sustainability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-087",
    code: "AC-8.3",
    title: "Revenue concentration monitoring",
    category: "Finance and sustainability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-088",
    code: "AC-8.4",
    title: "Tuition dependency analysis",
    category: "Finance and sustainability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-089",
    code: "AC-8.5",
    title: "Reserve policy",
    category: "Finance and sustainability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-090",
    code: "AC-8.6",
    title: "Financial audit controls",
    category: "Finance and sustainability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-091",
    code: "AC-8.7",
    title: "Fraud prevention",
    category: "Finance and sustainability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-092",
    code: "AC-8.8",
    title: "Procurement integrity",
    category: "Finance and sustainability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-093",
    code: "AC-8.9",
    title: "Related-party transaction review",
    category: "Finance and sustainability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-094",
    code: "AC-8.10",
    title: "Financial aid governance",
    category: "Finance and sustainability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-095",
    code: "AC-8.11",
    title: "Insurance adequacy",
    category: "Finance and sustainability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-096",
    code: "AC-8.12",
    title: "Long-term sustainability",
    category: "Finance and sustainability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-097",
    code: "AC-9.1",
    title: "Partnership authority",
    category: "Partnerships and external delivery",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-098",
    code: "AC-9.2",
    title: "Memorandum lifecycle control",
    category: "Partnerships and external delivery",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-099",
    code: "AC-9.3",
    title: "Joint program governance",
    category: "Partnerships and external delivery",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-100",
    code: "AC-9.4",
    title: "External instructor authorization",
    category: "Partnerships and external delivery",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-101",
    code: "AC-9.5",
    title: "Partner evidence requirements",
    category: "Partnerships and external delivery",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-102",
    code: "AC-9.6",
    title: "International delivery controls",
    category: "Partnerships and external delivery",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-103",
    code: "AC-9.7",
    title: "Articulation agreement governance",
    category: "Partnerships and external delivery",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-104",
    code: "AC-9.8",
    title: "Clinical placement oversight",
    category: "Partnerships and external delivery",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-105",
    code: "AC-9.9",
    title: "Apprenticeship partner controls",
    category: "Partnerships and external delivery",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-106",
    code: "AC-9.10",
    title: "Third-party marketing controls",
    category: "Partnerships and external delivery",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-107",
    code: "AC-9.11",
    title: "Partner performance review",
    category: "Partnerships and external delivery",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-108",
    code: "AC-9.12",
    title: "Partnership termination plan",
    category: "Partnerships and external delivery",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-109",
    code: "AC-10.1",
    title: "Code of conduct",
    category: "Ethics and institutional conduct",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-110",
    code: "AC-10.2",
    title: "Ethics reporting channel",
    category: "Ethics and institutional conduct",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-111",
    code: "AC-10.3",
    title: "Whistleblower protection",
    category: "Ethics and institutional conduct",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-112",
    code: "AC-10.4",
    title: "Research integrity",
    category: "Ethics and institutional conduct",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-113",
    code: "AC-10.5",
    title: "Human-subject protections",
    category: "Ethics and institutional conduct",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-114",
    code: "AC-10.6",
    title: "Professional boundaries",
    category: "Ethics and institutional conduct",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-115",
    code: "AC-10.7",
    title: "Anti-discrimination controls",
    category: "Ethics and institutional conduct",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-116",
    code: "AC-10.8",
    title: "Harassment prevention",
    category: "Ethics and institutional conduct",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-117",
    code: "AC-10.9",
    title: "Gift and hospitality controls",
    category: "Ethics and institutional conduct",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-118",
    code: "AC-10.10",
    title: "Public-interest obligations",
    category: "Ethics and institutional conduct",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-119",
    code: "AC-10.11",
    title: "Misconduct investigation",
    category: "Ethics and institutional conduct",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-120",
    code: "AC-10.12",
    title: "Ethics training evidence",
    category: "Ethics and institutional conduct",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-121",
    code: "AC-11.1",
    title: "Outcome measurement",
    category: "Outcomes and public accountability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-122",
    code: "AC-11.2",
    title: "Credential integrity",
    category: "Outcomes and public accountability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-123",
    code: "AC-11.3",
    title: "Completion reporting",
    category: "Outcomes and public accountability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-124",
    code: "AC-11.4",
    title: "Placement claims governance",
    category: "Outcomes and public accountability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-125",
    code: "AC-11.5",
    title: "Public disclosure accuracy",
    category: "Outcomes and public accountability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-126",
    code: "AC-11.6",
    title: "Stakeholder feedback",
    category: "Outcomes and public accountability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-127",
    code: "AC-11.7",
    title: "Employer validation",
    category: "Outcomes and public accountability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-128",
    code: "AC-11.8",
    title: "Graduate follow-up",
    category: "Outcomes and public accountability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-129",
    code: "AC-11.9",
    title: "Adverse outcome review",
    category: "Outcomes and public accountability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-130",
    code: "AC-11.10",
    title: "Public directory accuracy",
    category: "Outcomes and public accountability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-131",
    code: "AC-11.11",
    title: "Accreditation mark controls",
    category: "Outcomes and public accountability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  },
  {
    id: "STD-132",
    code: "AC-11.12",
    title: "Annual institutional reporting",
    category: "Outcomes and public accountability",
    rating: "NOT_ASSESSED",
    narrative: "",
    evidenceRefs: "",
    owner: "",
  }
];

const EVIDENCE_SEED: EvidenceRequirement[] = [
  {
    id: "EV-001",
    title: "Legal formation record",
    category: "Authority",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-002",
    title: "Authorized signatory delegation",
    category: "Authority",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-003",
    title: "Ownership and control disclosure",
    category: "Authority",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-004",
    title: "Governance charter",
    category: "Authority",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-005",
    title: "Board roster",
    category: "Authority",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-006",
    title: "Delegation matrix",
    category: "Authority",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-007",
    title: "Conflict disclosure register",
    category: "Authority",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-008",
    title: "Regulatory authority register",
    category: "Authority",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-009",
    title: "Insurance certificate",
    category: "Authority",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-010",
    title: "Sanctions screening record",
    category: "Authority",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-011",
    title: "Litigation disclosure",
    category: "Authority",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-012",
    title: "Policy approval record",
    category: "Authority",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-013",
    title: "Program architecture map",
    category: "Program",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-014",
    title: "Curriculum and learning outcome crosswalk",
    category: "Program",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-015",
    title: "Assessment and competency framework",
    category: "Program",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-016",
    title: "Course sequencing map",
    category: "Program",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-017",
    title: "Prerequisite matrix",
    category: "Program",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-018",
    title: "Learning material inventory",
    category: "Program",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-019",
    title: "Assessment blueprint",
    category: "Program",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-020",
    title: "Remediation procedure",
    category: "Program",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-021",
    title: "Prior learning policy",
    category: "Program",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-022",
    title: "Program change log",
    category: "Program",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-023",
    title: "Completion rules",
    category: "Program",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-024",
    title: "Credential specification",
    category: "Program",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-025",
    title: "Faculty roster and qualification records",
    category: "Faculty",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-026",
    title: "Instructor authorization procedure",
    category: "Faculty",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-027",
    title: "License verification records",
    category: "Faculty",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-028",
    title: "Continuing education log",
    category: "Faculty",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-029",
    title: "Peer observation records",
    category: "Faculty",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-030",
    title: "Workload allocation record",
    category: "Faculty",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-031",
    title: "Faculty onboarding checklist",
    category: "Faculty",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-032",
    title: "Mentor assignment record",
    category: "Faculty",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-033",
    title: "Performance review evidence",
    category: "Faculty",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-034",
    title: "Improvement plan record",
    category: "Faculty",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-035",
    title: "Substitute authorization record",
    category: "Faculty",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-036",
    title: "Faculty conflict disclosures",
    category: "Faculty",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-037",
    title: "Learner protection policy",
    category: "Learner",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-038",
    title: "Complaints and appeals procedure",
    category: "Learner",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-039",
    title: "Admissions disclosure packet",
    category: "Learner",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-040",
    title: "Tuition and fee schedule",
    category: "Learner",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-041",
    title: "Refund and withdrawal policy",
    category: "Learner",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-042",
    title: "Accessibility review",
    category: "Learner",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-043",
    title: "Privacy notice and consent",
    category: "Learner",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-044",
    title: "Student record access procedure",
    category: "Learner",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-045",
    title: "Non-retaliation policy",
    category: "Learner",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-046",
    title: "Teach-out communication plan",
    category: "Learner",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-047",
    title: "Marketing review record",
    category: "Learner",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-048",
    title: "Learner handbook",
    category: "Learner",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-049",
    title: "Records retention schedule",
    category: "Quality",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-050",
    title: "Quality assurance plan",
    category: "Quality",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-051",
    title: "Business continuity and teach-out plan",
    category: "Quality",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-052",
    title: "Internal audit schedule",
    category: "Quality",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-053",
    title: "Corrective action register",
    category: "Quality",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-054",
    title: "Management review minutes",
    category: "Quality",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-055",
    title: "Performance indicator dashboard",
    category: "Quality",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-056",
    title: "Program review report",
    category: "Quality",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-057",
    title: "Root-cause analysis record",
    category: "Quality",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-058",
    title: "Benchmarking report",
    category: "Quality",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-059",
    title: "Risk register",
    category: "Quality",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-060",
    title: "Continuous improvement plan",
    category: "Quality",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-061",
    title: "System architecture diagram",
    category: "Technology",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-062",
    title: "Access control matrix",
    category: "Technology",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-063",
    title: "Backup restoration test",
    category: "Technology",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-064",
    title: "Cybersecurity assessment",
    category: "Technology",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-065",
    title: "Data quality report",
    category: "Technology",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-066",
    title: "Version control record",
    category: "Technology",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-067",
    title: "Hash verification record",
    category: "Technology",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-068",
    title: "AI use disclosure",
    category: "Technology",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-069",
    title: "Automated control validation",
    category: "Technology",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-070",
    title: "Incident response test",
    category: "Technology",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-071",
    title: "Technology change log",
    category: "Technology",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-072",
    title: "Vendor security review",
    category: "Technology",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-073",
    title: "Enrollment capacity plan",
    category: "Operations",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-074",
    title: "Cohort roster controls",
    category: "Operations",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-075",
    title: "Attendance verification procedure",
    category: "Operations",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-076",
    title: "Facility readiness inspection",
    category: "Operations",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-077",
    title: "Laboratory safety record",
    category: "Operations",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-078",
    title: "Equipment calibration log",
    category: "Operations",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-079",
    title: "Vendor due diligence",
    category: "Operations",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-080",
    title: "Outsourcing agreement",
    category: "Operations",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-081",
    title: "Emergency response plan",
    category: "Operations",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-082",
    title: "Communication continuity test",
    category: "Operations",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-083",
    title: "Operational incident register",
    category: "Operations",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-084",
    title: "Resource allocation plan",
    category: "Operations",
    required: true,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-085",
    title: "Audited financial statements",
    category: "Finance",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-086",
    title: "Approved operating budget",
    category: "Finance",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-087",
    title: "Reserve policy record",
    category: "Finance",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-088",
    title: "Revenue concentration analysis",
    category: "Finance",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-089",
    title: "Tuition dependency report",
    category: "Finance",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-090",
    title: "Fraud risk assessment",
    category: "Finance",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-091",
    title: "Procurement policy",
    category: "Finance",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-092",
    title: "Related-party transaction register",
    category: "Finance",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-093",
    title: "Financial aid procedure",
    category: "Finance",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-094",
    title: "Insurance adequacy review",
    category: "Finance",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-095",
    title: "Sustainability forecast",
    category: "Finance",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-096",
    title: "Board finance review",
    category: "Finance",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-097",
    title: "Executed partnership agreement",
    category: "Partnerships",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-098",
    title: "Partner due diligence record",
    category: "Partnerships",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-099",
    title: "Joint governance charter",
    category: "Partnerships",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-100",
    title: "External instructor authorization",
    category: "Partnerships",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-101",
    title: "Partner evidence schedule",
    category: "Partnerships",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-102",
    title: "International delivery approval",
    category: "Partnerships",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-103",
    title: "Articulation agreement",
    category: "Partnerships",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-104",
    title: "Clinical placement agreement",
    category: "Partnerships",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-105",
    title: "Apprenticeship oversight record",
    category: "Partnerships",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-106",
    title: "Third-party marketing approval",
    category: "Partnerships",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-107",
    title: "Partner performance review",
    category: "Partnerships",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-108",
    title: "Partnership exit plan",
    category: "Partnerships",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-109",
    title: "Institutional code of conduct",
    category: "Ethics",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-110",
    title: "Ethics reporting procedure",
    category: "Ethics",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-111",
    title: "Whistleblower protection policy",
    category: "Ethics",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-112",
    title: "Research integrity policy",
    category: "Ethics",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-113",
    title: "Human-subject review record",
    category: "Ethics",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-114",
    title: "Professional boundaries policy",
    category: "Ethics",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-115",
    title: "Anti-discrimination policy",
    category: "Ethics",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-116",
    title: "Harassment prevention training",
    category: "Ethics",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-117",
    title: "Gift and hospitality register",
    category: "Ethics",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-118",
    title: "Public-interest statement",
    category: "Ethics",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-119",
    title: "Misconduct investigation procedure",
    category: "Ethics",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-120",
    title: "Ethics training completion report",
    category: "Ethics",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-121",
    title: "Outcome measurement plan",
    category: "Outcomes",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-122",
    title: "Completion data report",
    category: "Outcomes",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-123",
    title: "Credential issuance register",
    category: "Outcomes",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-124",
    title: "Placement claim substantiation",
    category: "Outcomes",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-125",
    title: "Public disclosure review",
    category: "Outcomes",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-126",
    title: "Stakeholder feedback report",
    category: "Outcomes",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-127",
    title: "Employer validation record",
    category: "Outcomes",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-128",
    title: "Graduate follow-up report",
    category: "Outcomes",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-129",
    title: "Adverse outcome analysis",
    category: "Outcomes",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-130",
    title: "Public directory reconciliation",
    category: "Outcomes",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-131",
    title: "Accreditation mark usage record",
    category: "Outcomes",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  },
  {
    id: "EV-132",
    title: "Annual institutional report",
    category: "Outcomes",
    required: false,
    status: "MISSING",
    owner: "",
    observedAt: "",
    expiresAt: "",
    source: "",
    hash: "",
    notes: "",
  }
];

const emptyContact = (): Contact => ({ name: "", title: "", email: "", phone: "" });

const createApplication = (): Application => ({
  id: id("APP"),
  receiptId: "",
  state: "DRAFT",
  determination: "HOLD",
  createdAt: now(),
  updatedAt: now(),
  submittedAt: "",
  organizationName: "",
  legalName: "",
  tradingName: "",
  organizationType: "Education provider",
  website: "",
  address1: "",
  address2: "",
  city: "",
  region: "",
  postalCode: "",
  country: "United States",
  jurisdiction: "",
  registrationNumber: "",
  taxIdLast4: "",
  foundedYear: "",
  primaryContact: emptyContact(),
  accountableExecutive: emptyContact(),
  authorizedSignatory: emptyContact(),
  ownershipSummary: "",
  parentOrganization: "",
  beneficialOwners: "",
  legalAuthorityBasis: "",
  sanctionsDisclosure: "",
  litigationDisclosure: "",
  priorAccreditation: "",
  accreditationScope: [],
  deliveryModes: [],
  learnerPopulation: "",
  annualEnrollment: "",
  requestedTerm: "3 years",
  geographicScope: "",
  exclusions: "",
  programName: "",
  programCode: "",
  programDescription: "",
  learningOutcomes: "",
  curriculumArchitecture: "",
  assessmentModel: "",
  competencyModel: "",
  evidenceModel: "",
  qualityModel: "",
  learnerProtections: "",
  complaintsProcess: "",
  recordsRetention: "",
  privacyControls: "",
  accessibilityControls: "",
  businessContinuity: "",
  faculty: [],
  standards: STANDARD_SEED.map((item) => ({ ...item })),
  evidence: EVIDENCE_SEED.map((item) => ({ ...item })),
  conflicts: [],
  declarationAccuracy: false,
  declarationAuthority: false,
  declarationCooperation: false,
  declarationChanges: false,
  signatureName: "",
  signatureTitle: "",
  signatureDate: "",
  signatureIntent: false,
  notes: "",
});

const sections: { id: SectionId; label: string; eyebrow: string }[] = [
  { id: "identity", label: "Institution identity", eyebrow: "01" },
  { id: "authority", label: "Authority & ownership", eyebrow: "02" },
  { id: "scope", label: "Requested scope", eyebrow: "03" },
  { id: "program", label: "Program architecture", eyebrow: "04" },
  { id: "faculty", label: "Faculty declaration", eyebrow: "05" },
  { id: "standards", label: "Readiness assessment", eyebrow: "06" },
  { id: "evidence", label: "Evidence schedule", eyebrow: "07" },
  { id: "learner", label: "Learner protections", eyebrow: "08" },
  { id: "conflicts", label: "Conflict disclosures", eyebrow: "09" },
  { id: "attestation", label: "Authorized attestation", eyebrow: "10" },
  { id: "review", label: "Review & submit", eyebrow: "11" },
];

const fieldStyle: CSSProperties = {
  width: "100%",
  border: "1px solid rgba(255,255,255,.13)",
  background: "rgba(7,12,24,.72)",
  color: "#f7fbff",
  borderRadius: 12,
  padding: "12px 13px",
  outline: "none",
  fontSize: 14,
};

function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label style={{ display: "grid", gap: 7, color: "#c9d5e8", fontSize: 12, fontWeight: 700 }}>
      <span>{children}{required ? <b style={{ color: "#75e7ff" }}> *</b> : null}</span>
    </label>
  );
}

function Field({ label, value, onChange, required, placeholder = "", type = "text" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; placeholder?: string; type?: string }) {
  return (
    <Label required={required}>{label}
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} style={fieldStyle} />
    </Label>
  );
}

function TextArea({ label, value, onChange, rows = 5, required, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; rows?: number; required?: boolean; placeholder?: string }) {
  return (
    <Label required={required}>{label}
      <textarea value={value} rows={rows} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.55 }} />
    </Label>
  );
}

function SelectField({ label, value, onChange, options, required }: { label: string; value: string; onChange: (value: string) => void; options: string[]; required?: boolean }) {
  return (
    <Label required={required}>{label}
      <select value={value} onChange={(event) => onChange(event.target.value)} style={fieldStyle}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </Label>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (checked: boolean) => void; children: ReactNode }) {
  return (
    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 13px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, background: "rgba(255,255,255,.025)", cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} style={{ marginTop: 3 }} />
      <span style={{ color: "#cfdaea", fontSize: 13, lineHeight: 1.5 }}>{children}</span>
    </label>
  );
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "cyan" | "gold" | "red" | "green" }) {
  const colors = {
    neutral: ["#b8c4d8", "rgba(184,196,216,.12)"],
    cyan: ["#75e7ff", "rgba(117,231,255,.12)"],
    gold: ["#f6c769", "rgba(246,199,105,.12)"],
    red: ["#ff8e9d", "rgba(255,91,114,.12)"],
    green: ["#7cf0bd", "rgba(52,211,153,.12)"],
  }[tone];
  return <span style={{ display: "inline-flex", padding: "6px 9px", borderRadius: 999, color: colors[0], background: colors[1], border: `1px solid ${colors[0]}44`, fontSize: 11, fontWeight: 800, letterSpacing: ".06em" }}>{children}</span>;
}

function Panel({ title, eyebrow, children, aside }: { title: string; eyebrow?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section style={{ border: "1px solid rgba(255,255,255,.11)", borderRadius: 22, background: "linear-gradient(145deg, rgba(15,25,45,.84), rgba(5,10,20,.86))", boxShadow: "0 24px 80px rgba(0,0,0,.28)", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start", padding: "22px 24px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <div>{eyebrow ? <div style={{ color: "#75e7ff", fontSize: 11, fontWeight: 900, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>{eyebrow}</div> : null}<h2 style={{ margin: 0, color: "#fff", fontSize: 23, letterSpacing: "-.025em" }}>{title}</h2></div>
        {aside}
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </section>
  );
}

function Grid({ children, columns = 2 }: { children: ReactNode; columns?: number }) {
  return <div className={`grid grid-${columns}`}>{children}</div>;
}

function scoreSection(application: Application, section: SectionId): number {
  switch (section) {
    case "identity": {
      const values = [application.organizationName, application.legalName, application.organizationType, application.address1, application.city, application.region, application.postalCode, application.country, application.jurisdiction, application.primaryContact.name, application.primaryContact.email, application.accountableExecutive.name];
      return Math.round((values.filter(Boolean).length / values.length) * 100);
    }
    case "authority": {
      const values = [application.registrationNumber, application.ownershipSummary, application.legalAuthorityBasis, application.authorizedSignatory.name, application.authorizedSignatory.title, application.authorizedSignatory.email];
      return Math.round((values.filter(Boolean).length / values.length) * 100);
    }
    case "scope": {
      const values = [application.accreditationScope.length > 0, application.deliveryModes.length > 0, application.learnerPopulation, application.annualEnrollment, application.geographicScope];
      return Math.round((values.filter(Boolean).length / values.length) * 100);
    }
    case "program": {
      const values = [application.programName, application.programDescription, application.learningOutcomes, application.curriculumArchitecture, application.assessmentModel, application.competencyModel, application.evidenceModel, application.qualityModel];
      return Math.round((values.filter(Boolean).length / values.length) * 100);
    }
    case "faculty": return application.faculty.length ? Math.min(100, 35 + application.faculty.length * 20) : 0;
    case "standards": return Math.round((application.standards.filter((item) => item.rating !== "NOT_ASSESSED" && item.narrative.trim()).length / application.standards.length) * 100);
    case "evidence": return Math.round((application.evidence.filter((item) => item.status === "ATTACHED" || item.status === "VERIFIED").length / application.evidence.filter((item) => item.required).length) * 100);
    case "learner": return Math.round(([application.learnerProtections, application.complaintsProcess, application.recordsRetention, application.privacyControls, application.accessibilityControls, application.businessContinuity].filter(Boolean).length / 6) * 100);
    case "conflicts": return 100;
    case "attestation": return Math.round(([application.declarationAccuracy, application.declarationAuthority, application.declarationCooperation, application.declarationChanges, application.signatureIntent, application.signatureName, application.signatureTitle, application.signatureDate].filter(Boolean).length / 8) * 100);
    case "review": return 100;
  }
}

function completeness(application: Application) {
  const scored = sections.filter((item) => item.id !== "review").map((item) => scoreSection(application, item.id));
  return Math.round(scored.reduce((sum, value) => sum + value, 0) / scored.length);
}

function requiredIssues(application: Application): string[] {
  const issues: string[] = [];
  if (!application.organizationName.trim()) issues.push("Organization name is required.");
  if (!application.legalName.trim()) issues.push("Legal name is required.");
  if (!application.jurisdiction.trim()) issues.push("Governing jurisdiction is required.");
  if (!application.primaryContact.name.trim() || !application.primaryContact.email.trim()) issues.push("Primary contact name and email are required.");
  if (!application.accountableExecutive.name.trim()) issues.push("Accountable executive is required.");
  if (!application.authorizedSignatory.name.trim()) issues.push("Authorized signatory is required.");
  if (!application.legalAuthorityBasis.trim()) issues.push("Legal authority basis is required.");
  if (!application.accreditationScope.length) issues.push("At least one accreditation scope must be selected.");
  if (!application.deliveryModes.length) issues.push("At least one delivery mode must be selected.");
  if (!application.programName.trim()) issues.push("Program name is required.");
  if (!application.learningOutcomes.trim()) issues.push("Learning outcomes are required.");
  if (!application.curriculumArchitecture.trim()) issues.push("Curriculum architecture is required.");
  if (!application.assessmentModel.trim()) issues.push("Assessment model is required.");
  if (application.faculty.length === 0) issues.push("At least one faculty member must be declared.");
  if (application.standards.some((item) => item.rating === "NOT_ASSESSED")) issues.push("Every accreditation standard must receive a readiness rating.");
  if (application.evidence.filter((item) => item.required).some((item) => item.status === "MISSING")) issues.push("Every required evidence item must be attached or planned.");
  if (!application.learnerProtections.trim() || !application.complaintsProcess.trim()) issues.push("Learner protections and complaints process are required.");
  if (![application.declarationAccuracy, application.declarationAuthority, application.declarationCooperation, application.declarationChanges, application.signatureIntent].every(Boolean)) issues.push("All attestations must be accepted.");
  if (!application.signatureName.trim() || !application.signatureTitle.trim() || !application.signatureDate) issues.push("Signature name, title, and date are required.");
  return issues;
}

export default function AccreditationApplicationIntakePage() {
  const [application, setApplication] = useState<Application>(() => createApplication());
  const [activeSection, setActiveSection] = useState<SectionId>("identity");
  const [savedAt, setSavedAt] = useState("");
  const [notice, setNotice] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Application>;
      setApplication((current) => ({ ...current, ...parsed, primaryContact: { ...current.primaryContact, ...(parsed.primaryContact || {}) }, accountableExecutive: { ...current.accountableExecutive, ...(parsed.accountableExecutive || {}) }, authorizedSignatory: { ...current.authorizedSignatory, ...(parsed.authorizedSignatory || {}) }, faculty: Array.isArray(parsed.faculty) ? parsed.faculty : current.faculty, standards: Array.isArray(parsed.standards) ? parsed.standards : current.standards, evidence: Array.isArray(parsed.evidence) ? parsed.evidence : current.evidence, conflicts: Array.isArray(parsed.conflicts) ? parsed.conflicts : current.conflicts }));
    } catch {
      setNotice("A stored draft could not be restored. A clean draft has been opened.");
    }
  }, []);

  useEffect(() => {
    if (application.state === "SUBMITTED") return;
    const handle = window.setTimeout(() => {
      try {
        const updated = { ...application, updatedAt: now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } catch {
        setNotice("Browser persistence is unavailable. Export the draft to preserve it.");
      }
    }, 700);
    return () => window.clearTimeout(handle);
  }, [application]);

  const sectionScores = useMemo(() => Object.fromEntries(sections.map((item) => [item.id, scoreSection(application, item.id)])) as Record<SectionId, number>, [application]);
  const total = useMemo(() => completeness(application), [application]);
  const issues = useMemo(() => requiredIssues(application), [application]);
  const currentIndex = sections.findIndex((item) => item.id === activeSection);
  const requiredEvidence = application.evidence.filter((item) => item.required);
  const attachedEvidence = requiredEvidence.filter((item) => item.status === "ATTACHED" || item.status === "VERIFIED").length;
  const readyStandards = application.standards.filter((item) => item.rating === "READY").length;
  const partialStandards = application.standards.filter((item) => item.rating === "PARTIAL").length;

  const patch = <K extends keyof Application>(key: K, value: Application[K]) => setApplication((current) => ({ ...current, [key]: value, updatedAt: now() }));
  const patchContact = (key: "primaryContact" | "accountableExecutive" | "authorizedSignatory", field: keyof Contact, value: string) => setApplication((current) => ({ ...current, [key]: { ...current[key], [field]: value }, updatedAt: now() }));

  const toggleArray = (key: "accreditationScope" | "deliveryModes", value: string) => {
    const current = application[key];
    patch(key, (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]) as Application[typeof key]);
  };

  const addFaculty = () => patch("faculty", [...application.faculty, { id: id("FAC"), name: "", role: "Instructor", email: "", programs: "", qualification: "", license: "", continuingEducationHours: 0, conflictDeclared: false }]);
  const updateFaculty = (facultyId: string, field: keyof FacultyMember, value: string | number | boolean) => patch("faculty", application.faculty.map((member) => member.id === facultyId ? { ...member, [field]: value } : member));
  const removeFaculty = (facultyId: string) => patch("faculty", application.faculty.filter((member) => member.id !== facultyId));

  const updateStandard = (standardId: string, field: keyof StandardResponse, value: string) => patch("standards", application.standards.map((item) => item.id === standardId ? { ...item, [field]: value } : item));
  const updateEvidence = (evidenceId: string, field: keyof EvidenceRequirement, value: string | boolean) => patch("evidence", application.evidence.map((item) => item.id === evidenceId ? { ...item, [field]: value } : item));

  const addConflict = () => patch("conflicts", [...application.conflicts, { id: id("COI"), person: "", relationship: "", interest: "", mitigation: "", state: "DISCLOSED" }]);
  const updateConflict = (conflictId: string, field: keyof ConflictDisclosure, value: string) => patch("conflicts", application.conflicts.map((item) => item.id === conflictId ? { ...item, [field]: value } : item));
  const removeConflict = (conflictId: string) => patch("conflicts", application.conflicts.filter((item) => item.id !== conflictId));

  const download = (name: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => download(`TA-14-accreditation-application-${application.id}.json`, JSON.stringify(application, null, 2), "application/json");
  const exportReceipt = () => {
    const lines = [
      "TA-14 ACADEMY ACCREDITATION APPLICATION RECEIPT",
      "",
      `Receipt: ${application.receiptId || "DRAFT"}`,
      `Application: ${application.id}`,
      `Institution: ${application.organizationName || "Not supplied"}`,
      `Program: ${application.programName || "Not supplied"}`,
      `State: ${application.state}`,
      `Determination: ${application.determination}`,
      `Submitted: ${application.submittedAt || "Not submitted"}`,
      `Completeness at submission: ${total}%`,
      "",
      "Boundary statement:",
      "Receipt confirms that an application record was submitted to the TA-14 Academy Accreditation Center. It is not an accreditation decision, governmental approval, statutory recognition, licensure, or certification.",
    ];
    download(`TA-14-accreditation-receipt-${application.receiptId || application.id}.txt`, lines.join("\n"), "text/plain");
  };

  const importJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<Application>;
        setApplication((current) => ({ ...current, ...parsed, primaryContact: { ...current.primaryContact, ...(parsed.primaryContact || {}) }, accountableExecutive: { ...current.accountableExecutive, ...(parsed.accountableExecutive || {}) }, authorizedSignatory: { ...current.authorizedSignatory, ...(parsed.authorizedSignatory || {}) }, faculty: Array.isArray(parsed.faculty) ? parsed.faculty : current.faculty, standards: Array.isArray(parsed.standards) ? parsed.standards : current.standards, evidence: Array.isArray(parsed.evidence) ? parsed.evidence : current.evidence, conflicts: Array.isArray(parsed.conflicts) ? parsed.conflicts : current.conflicts, updatedAt: now() }));
        setNotice("Draft imported successfully.");
      } catch {
        setNotice("The selected file is not a valid TA-14 accreditation application draft.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const submitApplication = (event: FormEvent) => {
    event.preventDefault();
    setShowErrors(true);
    if (issues.length) {
      setNotice(`Submission held. ${issues.length} required condition${issues.length === 1 ? "" : "s"} remain unresolved.`);
      return;
    }
    const submittedAt = now();
    const receiptId = `TA14-ACR-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const submitted: Application = { ...application, state: "SUBMITTED", determination: "HOLD", submittedAt, updatedAt: submittedAt, receiptId };
    setApplication(submitted);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(submitted)); } catch { /* no-op */ }
    setNotice("Application submitted and receipt record created. Accreditation remains HOLD pending completeness and eligibility review.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetDraft = () => {
    if (!window.confirm("Start a new application and replace the local draft?")) return;
    const fresh = createApplication();
    setApplication(fresh);
    setActiveSection("identity");
    setShowErrors(false);
    setNotice("A new application draft has been opened.");
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)); } catch { /* no-op */ }
  };

  const next = () => setActiveSection(sections[Math.min(sections.length - 1, currentIndex + 1)].id);
  const previous = () => setActiveSection(sections[Math.max(0, currentIndex - 1)].id);

  return (
    <main className="page-shell">
      <div className="atmosphere" aria-hidden="true"><span /><span /><span /></div>
      <header className="topbar">
        <div>
          <Link href="/academy" className="brand">TA-14 ACADEMY</Link>
          <div className="breadcrumb"><Link href="/academy/accreditation-center">Accreditation Center</Link><span>/</span><strong>Application intake</strong></div>
        </div>
        <div className="top-actions">
          <Badge tone={application.state === "SUBMITTED" ? "green" : "gold"}>{application.state}</Badge>
          <button className="button secondary" onClick={exportJson}>Export draft</button>
          <button className="button secondary" onClick={() => fileRef.current?.click()}>Import</button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={importJson} hidden />
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="kicker">Institutional application intake · governed submission</div>
          <h1>Apply for TA-14 Academy accreditation.</h1>
          <p>Define the institution, establish authority, bound the requested scope, declare the program architecture, identify responsible faculty, schedule the evidence, and preserve the authorized application record.</p>
          <div className="boundary"><strong>Recognition boundary</strong><span>TA-14 Academy accreditation is an institutional determination within the TA-14 system. It is not governmental approval, state licensure, U.S. Department of Education recognition, CHEA recognition, or a substitute for any legally required authorization.</span></div>
        </div>
        <div className="hero-card">
          <div className="score-ring" style={{ "--score": `${total * 3.6}deg` } as CSSProperties}><div><strong>{total}%</strong><span>complete</span></div></div>
          <div className="hero-metrics">
            <div><span>Required evidence</span><strong>{attachedEvidence}/{requiredEvidence.length}</strong></div>
            <div><span>Standards ready</span><strong>{readyStandards}</strong></div>
            <div><span>Open conditions</span><strong>{issues.length}</strong></div>
            <div><span>Autosave</span><strong>{savedAt || "pending"}</strong></div>
          </div>
        </div>
      </section>

      {notice ? <div className="notice"><span>{notice}</span><button onClick={() => setNotice("")}>Dismiss</button></div> : null}

      <div className="workspace">
        <aside className="rail">
          <div className="rail-label">Application sequence</div>
          {sections.map((section) => {
            const score = sectionScores[section.id];
            return <button key={section.id} className={`rail-item ${activeSection === section.id ? "active" : ""}`} onClick={() => setActiveSection(section.id)}><span className="rail-number">{section.eyebrow}</span><span className="rail-copy"><strong>{section.label}</strong><small>{score}% complete</small></span><span className={`dot ${score === 100 ? "done" : score > 0 ? "progress" : ""}`} /></button>;
          })}
          <div className="rail-summary"><span>Application ID</span><code>{application.id}</code><span>Determination</span><Badge tone="gold">{application.determination}</Badge></div>
        </aside>

        <form className="content" onSubmit={submitApplication}>
          {activeSection === "identity" ? <Panel eyebrow="Section 01" title="Institution identity" aside={<Badge tone="cyan">Foundational record</Badge>}>
            <p className="section-intro">Identify the legal entity seeking accreditation and the people accountable for the application.</p>
            <Grid columns={2}>
              <Field label="Public organization name" required value={application.organizationName} onChange={(value) => patch("organizationName", value)} />
              <Field label="Legal entity name" required value={application.legalName} onChange={(value) => patch("legalName", value)} />
              <Field label="Trading name" value={application.tradingName} onChange={(value) => patch("tradingName", value)} />
              <SelectField label="Organization type" required value={application.organizationType} onChange={(value) => patch("organizationType", value)} options={["Education provider", "Corporate academy", "Professional association", "Government training unit", "Nonprofit institution", "University or college", "Independent training organization", "Other"]} />
              <Field label="Website" value={application.website} onChange={(value) => patch("website", value)} placeholder="https://" />
              <Field label="Year founded" value={application.foundedYear} onChange={(value) => patch("foundedYear", value)} />
              <Field label="Street address" required value={application.address1} onChange={(value) => patch("address1", value)} />
              <Field label="Address line 2" value={application.address2} onChange={(value) => patch("address2", value)} />
              <Field label="City" required value={application.city} onChange={(value) => patch("city", value)} />
              <Field label="State / region" required value={application.region} onChange={(value) => patch("region", value)} />
              <Field label="Postal code" required value={application.postalCode} onChange={(value) => patch("postalCode", value)} />
              <Field label="Country" required value={application.country} onChange={(value) => patch("country", value)} />
              <Field label="Governing jurisdiction" required value={application.jurisdiction} onChange={(value) => patch("jurisdiction", value)} />
              <Field label="Registration number" value={application.registrationNumber} onChange={(value) => patch("registrationNumber", value)} />
            </Grid>
            <div className="subhead">Primary application contact</div>
            <Grid columns={2}>
              <Field label="Name" required value={application.primaryContact.name} onChange={(value) => patchContact("primaryContact", "name", value)} />
              <Field label="Title" value={application.primaryContact.title} onChange={(value) => patchContact("primaryContact", "title", value)} />
              <Field label="Email" required type="email" value={application.primaryContact.email} onChange={(value) => patchContact("primaryContact", "email", value)} />
              <Field label="Phone" value={application.primaryContact.phone} onChange={(value) => patchContact("primaryContact", "phone", value)} />
            </Grid>
            <div className="subhead">Accountable executive</div>
            <Grid columns={2}>
              <Field label="Name" required value={application.accountableExecutive.name} onChange={(value) => patchContact("accountableExecutive", "name", value)} />
              <Field label="Title" value={application.accountableExecutive.title} onChange={(value) => patchContact("accountableExecutive", "title", value)} />
              <Field label="Email" type="email" value={application.accountableExecutive.email} onChange={(value) => patchContact("accountableExecutive", "email", value)} />
              <Field label="Phone" value={application.accountableExecutive.phone} onChange={(value) => patchContact("accountableExecutive", "phone", value)} />
            </Grid>
          </Panel> : null}

          {activeSection === "authority" ? <Panel eyebrow="Section 02" title="Authority, ownership, and legal standing" aside={<Badge tone="gold">Authority before submission</Badge>}>
            <p className="section-intro">Show who owns, controls, and has authority to bind the applicant institution.</p>
            <Grid columns={2}>
              <TextArea label="Ownership and control summary" required value={application.ownershipSummary} onChange={(value) => patch("ownershipSummary", value)} />
              <TextArea label="Beneficial owners or controlling interests" value={application.beneficialOwners} onChange={(value) => patch("beneficialOwners", value)} />
              <Field label="Parent organization" value={application.parentOrganization} onChange={(value) => patch("parentOrganization", value)} />
              <Field label="Tax ID - last four only" value={application.taxIdLast4} onChange={(value) => patch("taxIdLast4", value.replace(/\D/g, "").slice(0, 4))} />
            </Grid>
            <TextArea label="Legal authority basis" required rows={6} value={application.legalAuthorityBasis} onChange={(value) => patch("legalAuthorityBasis", value)} placeholder="Describe the charter, registration, license, delegation, or other basis authorizing the institution to operate and offer the proposed program." />
            <Grid columns={2}>
              <TextArea label="Sanctions or regulatory disclosure" value={application.sanctionsDisclosure} onChange={(value) => patch("sanctionsDisclosure", value)} placeholder="State none if not applicable." />
              <TextArea label="Material litigation disclosure" value={application.litigationDisclosure} onChange={(value) => patch("litigationDisclosure", value)} placeholder="State none if not applicable." />
              <TextArea label="Prior accreditation history" value={application.priorAccreditation} onChange={(value) => patch("priorAccreditation", value)} placeholder="Include current, prior, denied, suspended, withdrawn, or expired accreditation." />
            </Grid>
            <div className="subhead">Authorized signatory</div>
            <Grid columns={2}>
              <Field label="Name" required value={application.authorizedSignatory.name} onChange={(value) => patchContact("authorizedSignatory", "name", value)} />
              <Field label="Title" required value={application.authorizedSignatory.title} onChange={(value) => patchContact("authorizedSignatory", "title", value)} />
              <Field label="Email" required type="email" value={application.authorizedSignatory.email} onChange={(value) => patchContact("authorizedSignatory", "email", value)} />
              <Field label="Phone" value={application.authorizedSignatory.phone} onChange={(value) => patchContact("authorizedSignatory", "phone", value)} />
            </Grid>
          </Panel> : null}

          {activeSection === "scope" ? <Panel eyebrow="Section 03" title="Requested accreditation scope" aside={<Badge tone="cyan">Bounded determination</Badge>}>
            <p className="section-intro">Accreditation is limited to the exact programs, delivery modes, populations, locations, and terms included in the final decision.</p>
            <div className="choice-grid">
              {["Institution", "Program", "Instructor preparation", "Assessment system", "Continuing education", "Credentialing operation"].map((item) => <Check key={item} checked={application.accreditationScope.includes(item)} onChange={() => toggleArray("accreditationScope", item)}>{item}</Check>)}
            </div>
            <div className="subhead">Delivery modes</div>
            <div className="choice-grid">
              {["In person", "Synchronous online", "Asynchronous online", "Hybrid", "Simulation / VR", "Workplace-based"].map((item) => <Check key={item} checked={application.deliveryModes.includes(item)} onChange={() => toggleArray("deliveryModes", item)}>{item}</Check>)}
            </div>
            <Grid columns={2}>
              <Field label="Learner population" required value={application.learnerPopulation} onChange={(value) => patch("learnerPopulation", value)} placeholder="Who the institution serves" />
              <Field label="Estimated annual enrollment" required value={application.annualEnrollment} onChange={(value) => patch("annualEnrollment", value)} />
              <SelectField label="Requested accreditation term" value={application.requestedTerm} onChange={(value) => patch("requestedTerm", value)} options={["1 year", "2 years", "3 years", "5 years"]} />
              <Field label="Geographic scope" required value={application.geographicScope} onChange={(value) => patch("geographicScope", value)} />
            </Grid>
            <TextArea label="Explicit exclusions and boundaries" value={application.exclusions} onChange={(value) => patch("exclusions", value)} placeholder="Identify programs, locations, delivery modes, credentials, or activities that must remain outside the requested scope." />
          </Panel> : null}

          {activeSection === "program" ? <Panel eyebrow="Section 04" title="Program architecture" aside={<Badge tone="cyan">Architecture before approval</Badge>}>
            <Grid columns={2}>
              <Field label="Program name" required value={application.programName} onChange={(value) => patch("programName", value)} />
              <Field label="Internal program code" value={application.programCode} onChange={(value) => patch("programCode", value)} />
            </Grid>
            <TextArea label="Program purpose and description" required rows={6} value={application.programDescription} onChange={(value) => patch("programDescription", value)} />
            <TextArea label="Learning outcomes" required rows={7} value={application.learningOutcomes} onChange={(value) => patch("learningOutcomes", value)} placeholder="State observable and assessable outcomes." />
            <TextArea label="Curriculum architecture and sequence" required rows={7} value={application.curriculumArchitecture} onChange={(value) => patch("curriculumArchitecture", value)} placeholder="Describe modules, prerequisites, sequencing, practice, review, and completion conditions." />
            <Grid columns={2}>
              <TextArea label="Assessment model" required value={application.assessmentModel} onChange={(value) => patch("assessmentModel", value)} />
              <TextArea label="Competency model" required value={application.competencyModel} onChange={(value) => patch("competencyModel", value)} />
              <TextArea label="Evidence model" required value={application.evidenceModel} onChange={(value) => patch("evidenceModel", value)} />
              <TextArea label="Quality and improvement model" required value={application.qualityModel} onChange={(value) => patch("qualityModel", value)} />
            </Grid>
          </Panel> : null}

          {activeSection === "faculty" ? <Panel eyebrow="Section 05" title="Faculty and instructor declaration" aside={<button type="button" className="button primary" onClick={addFaculty}>Add faculty member</button>}>
            <p className="section-intro">Declare every person expected to teach, assess, supervise, authorize, or govern the proposed accredited program.</p>
            {application.faculty.length === 0 ? <div className="empty-state"><strong>No faculty declared</strong><span>Add at least one responsible instructor or academic leader.</span><button type="button" className="button primary" onClick={addFaculty}>Add first faculty member</button></div> : null}
            <div className="record-stack">
              {application.faculty.map((member, index) => <div key={member.id} className="record-card">
                <div className="record-head"><div><span>Faculty {String(index + 1).padStart(2, "0")}</span><strong>{member.name || "Unnamed faculty member"}</strong></div><button type="button" className="text-button danger" onClick={() => removeFaculty(member.id)}>Remove</button></div>
                <Grid columns={2}>
                  <Field label="Name" required value={member.name} onChange={(value) => updateFaculty(member.id, "name", value)} />
                  <SelectField label="Role" value={member.role} onChange={(value) => updateFaculty(member.id, "role", value)} options={["Instructor", "Lead instructor", "Assessor", "Program director", "Academic leader", "Reviewer", "Supervisor"]} />
                  <Field label="Email" type="email" value={member.email} onChange={(value) => updateFaculty(member.id, "email", value)} />
                  <Field label="Programs / modules" value={member.programs} onChange={(value) => updateFaculty(member.id, "programs", value)} />
                  <TextArea label="Qualification basis" required value={member.qualification} onChange={(value) => updateFaculty(member.id, "qualification", value)} />
                  <TextArea label="License, certification, or authorization" value={member.license} onChange={(value) => updateFaculty(member.id, "license", value)} />
                  <Field label="Continuing education hours" type="number" value={String(member.continuingEducationHours)} onChange={(value) => updateFaculty(member.id, "continuingEducationHours", Number(value))} />
                </Grid>
                <Check checked={member.conflictDeclared} onChange={(value) => updateFaculty(member.id, "conflictDeclared", value)}>This person has completed the required conflict-of-interest declaration.</Check>
              </div>)}
            </div>
          </Panel> : null}

          {activeSection === "standards" ? <Panel eyebrow="Section 06" title="Standards-readiness self-assessment" aside={<div style={{ display: "flex", gap: 8 }}><Badge tone="green">{readyStandards} ready</Badge><Badge tone="gold">{partialStandards} partial</Badge></div>}>
            <p className="section-intro">Rate present readiness. A self-rating is not an accreditation finding and may be challenged during review.</p>
            <div className="standards-table">
              {application.standards.map((standard) => <div key={standard.id} className="standard-row">
                <div className="standard-meta"><Badge tone="cyan">{standard.code}</Badge><strong>{standard.title}</strong><span>{standard.category}</span></div>
                <SelectField label="Readiness" value={standard.rating} onChange={(value) => updateStandard(standard.id, "rating", value)} options={["NOT_ASSESSED", "NOT_READY", "PARTIAL", "READY"]} />
                <Field label="Responsible owner" value={standard.owner} onChange={(value) => updateStandard(standard.id, "owner", value)} />
                <TextArea label="Readiness narrative" value={standard.narrative} onChange={(value) => updateStandard(standard.id, "narrative", value)} rows={4} />
                <TextArea label="Evidence references" value={standard.evidenceRefs} onChange={(value) => updateStandard(standard.id, "evidenceRefs", value)} rows={3} />
              </div>)}
            </div>
          </Panel> : null}

          {activeSection === "evidence" ? <Panel eyebrow="Section 07" title="Evidence schedule" aside={<Badge tone="cyan">{attachedEvidence}/{requiredEvidence.length} required attached</Badge>}>
            <p className="section-intro">Identify the source, owner, observation date, expiration boundary, and preserved reference for each required evidence item.</p>
            <div className="evidence-list">
              {application.evidence.map((item) => <div key={item.id} className="evidence-row">
                <div className="evidence-title"><div><Badge tone={item.required ? "gold" : "neutral"}>{item.required ? "REQUIRED" : "SUPPORTING"}</Badge><Badge tone="cyan">{item.category}</Badge></div><strong>{item.title}</strong></div>
                <SelectField label="State" value={item.status} onChange={(value) => updateEvidence(item.id, "status", value)} options={["MISSING", "PLANNED", "ATTACHED", "VERIFIED"]} />
                <Field label="Owner" value={item.owner} onChange={(value) => updateEvidence(item.id, "owner", value)} />
                <Field label="Source / record URL" value={item.source} onChange={(value) => updateEvidence(item.id, "source", value)} />
                <Grid columns={2}>
                  <Field label="Observed at" type="date" value={item.observedAt} onChange={(value) => updateEvidence(item.id, "observedAt", value)} />
                  <Field label="Expires at" type="date" value={item.expiresAt} onChange={(value) => updateEvidence(item.id, "expiresAt", value)} />
                </Grid>
                <Field label="Hash / preserved identifier" value={item.hash} onChange={(value) => updateEvidence(item.id, "hash", value)} />
                <TextArea label="Notes" value={item.notes} onChange={(value) => updateEvidence(item.id, "notes", value)} rows={3} />
              </div>)}
            </div>
          </Panel> : null}

          {activeSection === "learner" ? <Panel eyebrow="Section 08" title="Learner protections and institutional continuity" aside={<Badge tone="gold">Protection before enrollment</Badge>}>
            <p className="section-intro">Describe the controls that protect learners before, during, and after participation in the proposed program.</p>
            <Grid columns={2}>
              <TextArea label="Learner protection framework" required rows={7} value={application.learnerProtections} onChange={(value) => patch("learnerProtections", value)} />
              <TextArea label="Complaints and appeals process" required rows={7} value={application.complaintsProcess} onChange={(value) => patch("complaintsProcess", value)} />
              <TextArea label="Records retention and transcript continuity" required rows={7} value={application.recordsRetention} onChange={(value) => patch("recordsRetention", value)} />
              <TextArea label="Privacy and data protection controls" required rows={7} value={application.privacyControls} onChange={(value) => patch("privacyControls", value)} />
              <TextArea label="Accessibility and accommodation controls" required rows={7} value={application.accessibilityControls} onChange={(value) => patch("accessibilityControls", value)} />
              <TextArea label="Business continuity and teach-out plan" required rows={7} value={application.businessContinuity} onChange={(value) => patch("businessContinuity", value)} />
            </Grid>
          </Panel> : null}

          {activeSection === "conflicts" ? <Panel eyebrow="Section 09" title="Conflict-of-interest disclosures" aside={<button type="button" className="button primary" onClick={addConflict}>Add disclosure</button>}>
            <p className="section-intro">Disclose financial, familial, governance, employment, contractual, or other interests that could affect the application or review.</p>
            {application.conflicts.length === 0 ? <div className="empty-state"><strong>No conflicts recorded</strong><span>If no conflicts exist, leave this section empty. Add every known or potential conflict requiring review.</span><button type="button" className="button primary" onClick={addConflict}>Add disclosure</button></div> : null}
            <div className="record-stack">
              {application.conflicts.map((conflict, index) => <div key={conflict.id} className="record-card">
                <div className="record-head"><div><span>Disclosure {String(index + 1).padStart(2, "0")}</span><strong>{conflict.person || "Unnamed person"}</strong></div><button type="button" className="text-button danger" onClick={() => removeConflict(conflict.id)}>Remove</button></div>
                <Grid columns={2}>
                  <Field label="Person or entity" required value={conflict.person} onChange={(value) => updateConflict(conflict.id, "person", value)} />
                  <SelectField label="Review state" value={conflict.state} onChange={(value) => updateConflict(conflict.id, "state", value)} options={["DISCLOSED", "REVIEW_REQUIRED", "RESOLVED"]} />
                  <TextArea label="Relationship" value={conflict.relationship} onChange={(value) => updateConflict(conflict.id, "relationship", value)} />
                  <TextArea label="Interest or potential influence" value={conflict.interest} onChange={(value) => updateConflict(conflict.id, "interest", value)} />
                  <TextArea label="Mitigation or recusal plan" value={conflict.mitigation} onChange={(value) => updateConflict(conflict.id, "mitigation", value)} />
                </Grid>
              </div>)}
            </div>
          </Panel> : null}

          {activeSection === "attestation" ? <Panel eyebrow="Section 10" title="Authorized attestation" aside={<Badge tone="red">Binding declaration</Badge>}>
            <div className="attestation-box"><strong>Read before signing</strong><p>The signatory represents that they have current authority to submit this application for the named institution. Submission creates a preserved institutional record. It does not create accreditation, certification, governmental recognition, licensure, or permission to make unqualified public claims.</p></div>
            <div className="check-stack">
              <Check checked={application.declarationAccuracy} onChange={(value) => patch("declarationAccuracy", value)}>I attest that the application is complete and accurate to the best of my knowledge and that material omissions have not been knowingly made.</Check>
              <Check checked={application.declarationAuthority} onChange={(value) => patch("declarationAuthority", value)}>I attest that I have current authority to bind the applicant institution for the purpose of this application.</Check>
              <Check checked={application.declarationCooperation} onChange={(value) => patch("declarationCooperation", value)}>The institution agrees to evidence review, interviews, observation, site review, conflict controls, corrective action, surveillance, and preservation of decision records when required.</Check>
              <Check checked={application.declarationChanges} onChange={(value) => patch("declarationChanges", value)}>The institution will disclose material changes affecting authority, ownership, scope, faculty, learner protection, evidence, or continuing standing.</Check>
              <Check checked={application.signatureIntent} onChange={(value) => patch("signatureIntent", value)}>Typing my name below constitutes my electronic signature and intent to submit this application.</Check>
            </div>
            <Grid columns={2}>
              <Field label="Authorized signatory name" required value={application.signatureName} onChange={(value) => patch("signatureName", value)} />
              <Field label="Title" required value={application.signatureTitle} onChange={(value) => patch("signatureTitle", value)} />
              <Field label="Signature date" required type="date" value={application.signatureDate} onChange={(value) => patch("signatureDate", value)} />
            </Grid>
          </Panel> : null}

          {activeSection === "review" ? <Panel eyebrow="Section 11" title="Review and governed submission" aside={<Badge tone={issues.length ? "red" : "green"}>{issues.length ? `${issues.length} open conditions` : "Ready to submit"}</Badge>}>
            <div className="review-grid">
              <div className="review-card"><span>Institution</span><strong>{application.organizationName || "Not supplied"}</strong><small>{application.legalName || "Legal name missing"}</small></div>
              <div className="review-card"><span>Program</span><strong>{application.programName || "Not supplied"}</strong><small>{application.accreditationScope.join(", ") || "Scope missing"}</small></div>
              <div className="review-card"><span>Authority</span><strong>{application.authorizedSignatory.name || "Not supplied"}</strong><small>{application.authorizedSignatory.title || "Title missing"}</small></div>
              <div className="review-card"><span>Evidence</span><strong>{attachedEvidence}/{requiredEvidence.length}</strong><small>required records attached or verified</small></div>
              <div className="review-card"><span>Standards</span><strong>{readyStandards} ready</strong><small>{partialStandards} partial</small></div>
              <div className="review-card"><span>Overall</span><strong>{total}%</strong><small>application completeness</small></div>
            </div>
            {issues.length ? <div className="issue-box"><strong>Submission conditions</strong><ol>{issues.map((issue) => <li key={issue}>{issue}</li>)}</ol></div> : <div className="ready-box"><strong>Application conditions satisfied</strong><p>The record is ready for governed submission. Submission will remain HOLD until completeness and eligibility review are completed.</p></div>}
            <TextArea label="Final application notes" value={application.notes} onChange={(value) => patch("notes", value)} rows={6} />
            {application.state === "SUBMITTED" ? <div className="receipt"><div><span>Submission receipt</span><strong>{application.receiptId}</strong><small>{new Date(application.submittedAt).toLocaleString()}</small></div><button type="button" className="button primary" onClick={exportReceipt}>Download receipt</button></div> : <button type="submit" className="submit-button">Submit governed application</button>}
          </Panel> : null}

          <div className="footer-nav">
            <button type="button" className="button secondary" onClick={previous} disabled={currentIndex === 0}>Previous</button>
            <div><span>Section {currentIndex + 1} of {sections.length}</span><strong>{sections[currentIndex].label}</strong></div>
            {currentIndex < sections.length - 1 ? <button type="button" className="button primary" onClick={next}>Continue</button> : <button type="submit" className="button primary">Submit application</button>}
          </div>

          <div className="utility-row"><button type="button" className="text-button" onClick={exportJson}>Export JSON backup</button><button type="button" className="text-button danger" onClick={resetDraft}>Start new draft</button></div>
        </form>
      </div>

      <footer className="site-footer"><div><strong>TA-14 Academy Accreditation Center</strong><span>Evidence before decision. Authority before binding. Scope before standing.</span></div><Link href="/academy/accreditation-center">Return to Accreditation Center</Link></footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          margin: 0;
          background: #040811;
          color: #eef5ff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        button, input, textarea, select {
          font: inherit;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        .page-shell {
          min-height: 100vh;
          background: radial-gradient(circle at 20% -10%, rgba(37, 174, 214, .16), transparent 34%), radial-gradient(circle at 90% 12%, rgba(217, 163, 67, .11), transparent 30%), linear-gradient(180deg, #07101e 0%, #040811 52%, #03060d 100%);
          position: relative;
          overflow: hidden;
        }
        .atmosphere {
          pointer-events: none;
          position: fixed;
          inset: 0;
          overflow: hidden;
          opacity: .8;
        }
        .atmosphere span {
          position: absolute;
          border: 1px solid rgba(117,231,255,.11);
          border-radius: 50%;
          filter: blur(.2px);
        }
        .atmosphere span:nth-child(1) {
          width: 520px;
          height: 520px;
          right: -260px;
          top: 18%;
        }
        .atmosphere span:nth-child(2) {
          width: 340px;
          height: 340px;
          left: -180px;
          top: 42%;
          border-color: rgba(246,199,105,.1);
        }
        .atmosphere span:nth-child(3) {
          width: 760px;
          height: 760px;
          left: 28%;
          bottom: -620px;
        }
        .topbar {
          position: sticky;
          top: 0;
          z-index: 30;
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: center;
          padding: 18px clamp(20px, 4vw, 64px);
          border-bottom: 1px solid rgba(255,255,255,.09);
          background: rgba(4,8,17,.82);
          backdrop-filter: blur(22px);
        }
        .brand {
          color: #fff;
          font-weight: 950;
          letter-spacing: .18em;
          font-size: 12px;
        }
        .breadcrumb {
          display: flex;
          gap: 8px;
          margin-top: 7px;
          color: #7f91aa;
          font-size: 12px;
        }
        .breadcrumb strong {
          color: #d9e5f6;
        }
        .top-actions {
          display: flex;
          gap: 9px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .button {
          border: 0;
          border-radius: 11px;
          padding: 10px 14px;
          cursor: pointer;
          font-weight: 800;
          font-size: 12px;
          transition: .18s ease;
        }
        .button:hover {
          transform: translateY(-1px);
        }
        .button:disabled {
          opacity: .35;
          cursor: not-allowed;
          transform: none;
        }
        .button.primary {
          color: #02121a;
          background: linear-gradient(135deg, #75e7ff, #8dd8ff);
          box-shadow: 0 8px 30px rgba(117,231,255,.16);
        }
        .button.secondary {
          color: #d7e3f4;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12);
        }
        .hero {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(320px, .65fr);
          gap: 42px;
          align-items: center;
          padding: 76px clamp(20px, 6vw, 96px) 54px;
          max-width: 1600px;
          margin: auto;
        }
        .kicker {
          color: #75e7ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
        .hero h1 {
          margin: 0;
          max-width: 850px;
          color: #fff;
          font-size: clamp(44px, 6vw, 86px);
          line-height: .98;
          letter-spacing: -.058em;
        }
        .hero p {
          max-width: 850px;
          margin: 24px 0 0;
          color: #aebdd0;
          font-size: 18px;
          line-height: 1.7;
        }
        .boundary {
          margin-top: 28px;
          display: grid;
          grid-template-columns: 170px 1fr;
          gap: 18px;
          padding: 17px 18px;
          border: 1px solid rgba(246,199,105,.28);
          border-radius: 15px;
          background: rgba(246,199,105,.065);
        }
        .boundary strong {
          color: #f6c769;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .1em;
        }
        .boundary span {
          color: #cbd4e3;
          font-size: 13px;
          line-height: 1.55;
        }
        .hero-card {
          display: grid;
          place-items: center;
          gap: 24px;
          padding: 30px;
          border: 1px solid rgba(255,255,255,.11);
          border-radius: 26px;
          background: linear-gradient(145deg, rgba(16,27,48,.86), rgba(4,9,19,.88));
          box-shadow: 0 30px 100px rgba(0,0,0,.3);
        }
        .score-ring {
          width: 178px;
          height: 178px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: conic-gradient(#75e7ff var(--score), rgba(255,255,255,.08) 0);
          position: relative;
        }
        .score-ring:after {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          background: #07101e;
        }
        .score-ring div {
          position: relative;
          z-index: 1;
          display: grid;
          text-align: center;
        }
        .score-ring strong {
          font-size: 39px;
          letter-spacing: -.05em;
        }
        .score-ring span {
          color: #8192aa;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .14em;
        }
        .hero-metrics {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .hero-metrics div {
          padding: 12px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 12px;
          background: rgba(255,255,255,.025);
        }
        .hero-metrics span {
          display: block;
          color: #7e8da4;
          font-size: 10px;
          margin-bottom: 5px;
        }
        .hero-metrics strong {
          font-size: 15px;
          color: #f4f8ff;
        }
        .notice {
          position: relative;
          z-index: 2;
          max-width: 1500px;
          margin: 0 auto 20px;
          padding: 13px 17px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          border: 1px solid rgba(117,231,255,.26);
          border-radius: 13px;
          color: #d8f7ff;
          background: rgba(20,132,160,.11);
          font-size: 13px;
        }
        .notice button {
          border: 0;
          background: none;
          color: #75e7ff;
          font-weight: 800;
          cursor: pointer;
        }
        .workspace {
          position: relative;
          z-index: 1;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 64px) 70px;
          display: grid;
          grid-template-columns: 290px minmax(0, 1fr);
          gap: 26px;
          align-items: start;
        }
        .rail {
          position: sticky;
          top: 96px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 20px;
          background: rgba(8,14,27,.8);
          backdrop-filter: blur(18px);
          padding: 13px;
          max-height: calc(100vh - 120px);
          overflow: auto;
        }
        .rail-label {
          padding: 8px 9px 13px;
          color: #6f8098;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .rail-item {
          width: 100%;
          border: 0;
          background: transparent;
          color: #aebcd0;
          display: grid;
          grid-template-columns: 28px 1fr 9px;
          gap: 8px;
          text-align: left;
          align-items: center;
          padding: 11px 9px;
          border-radius: 11px;
          cursor: pointer;
        }
        .rail-item:hover {
          background: rgba(255,255,255,.04);
          color: #fff;
        }
        .rail-item.active {
          color: #fff;
          background: linear-gradient(90deg, rgba(117,231,255,.13), rgba(117,231,255,.035));
          border: 1px solid rgba(117,231,255,.16);
        }
        .rail-number {
          color: #75e7ff;
          font-size: 10px;
          font-weight: 900;
        }
        .rail-copy {
          display: grid;
          gap: 3px;
        }
        .rail-copy strong {
          font-size: 12px;
        }
        .rail-copy small {
          color: #687990;
          font-size: 9px;
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #26334a;
        }
        .dot.progress {
          background: #f6c769;
          box-shadow: 0 0 12px rgba(246,199,105,.5);
        }
        .dot.done {
          background: #7cf0bd;
          box-shadow: 0 0 12px rgba(124,240,189,.45);
        }
        .rail-summary {
          margin-top: 13px;
          padding: 14px;
          display: grid;
          gap: 8px;
          border-radius: 13px;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(255,255,255,.08);
        }
        .rail-summary span {
          color: #74849b;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .1em;
        }
        .rail-summary code {
          overflow: hidden;
          text-overflow: ellipsis;
          color: #d8e5f7;
          font-size: 10px;
        }
        .content {
          min-width: 0;
          display: grid;
          gap: 18px;
        }
        .section-intro {
          margin: 0 0 22px;
          max-width: 920px;
          color: #9eb0c7;
          font-size: 14px;
          line-height: 1.65;
        }
        .grid {
          display: grid;
          gap: 16px;
          margin-bottom: 18px;
        }
        .grid-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .grid-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .subhead {
          margin: 28px 0 15px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,.08);
          color: #fff;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: .05em;
          text-transform: uppercase;
        }
        .choice-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 11px;
          margin-bottom: 20px;
        }
        .record-stack, .standards-table, .evidence-list {
          display: grid;
          gap: 15px;
        }
        .record-card, .standard-row, .evidence-row {
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 16px;
          background: rgba(255,255,255,.025);
          padding: 18px;
        }
        .record-head {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: center;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .record-head div {
          display: grid;
          gap: 4px;
        }
        .record-head span {
          color: #75e7ff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .record-head strong {
          font-size: 16px;
        }
        .text-button {
          border: 0;
          background: none;
          color: #75e7ff;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
          padding: 5px;
        }
        .text-button.danger {
          color: #ff8e9d;
        }
        .empty-state {
          min-height: 230px;
          display: grid;
          place-items: center;
          align-content: center;
          text-align: center;
          gap: 10px;
          border: 1px dashed rgba(255,255,255,.16);
          border-radius: 16px;
          color: #95a5bb;
        }
        .empty-state strong {
          color: #fff;
          font-size: 20px;
        }
        .empty-state span {
          max-width: 520px;
          font-size: 13px;
          line-height: 1.55;
        }
        .standard-row {
          display: grid;
          grid-template-columns: minmax(220px,.8fr) minmax(160px,.4fr) minmax(180px,.5fr) minmax(260px,1fr) minmax(220px,.8fr);
          gap: 13px;
          align-items: start;
        }
        .standard-meta {
          display: grid;
          justify-items: start;
          gap: 8px;
        }
        .standard-meta strong {
          color: #fff;
          line-height: 1.4;
        }
        .standard-meta span {
          color: #75869e;
          font-size: 11px;
        }
        .evidence-row {
          display: grid;
          grid-template-columns: minmax(220px,1fr) minmax(140px,.4fr) minmax(150px,.5fr) minmax(210px,.8fr);
          gap: 14px;
          align-items: start;
        }
        .evidence-title {
          display: grid;
          gap: 10px;
        }
        .evidence-title div {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .evidence-title strong {
          font-size: 15px;
          line-height: 1.4;
        }
        .evidence-row > .grid, .evidence-row > label:last-child, .evidence-row > label:nth-last-child(2) {
          grid-column: span 2;
        }
        .attestation-box {
          padding: 19px;
          margin-bottom: 18px;
          border: 1px solid rgba(255,142,157,.25);
          border-radius: 15px;
          background: rgba(255,91,114,.07);
        }
        .attestation-box strong {
          color: #ff9dac;
        }
        .attestation-box p {
          margin: 8px 0 0;
          color: #c5cedd;
          line-height: 1.6;
          font-size: 13px;
        }
        .check-stack {
          display: grid;
          gap: 10px;
          margin-bottom: 22px;
        }
        .review-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 12px;
          margin-bottom: 20px;
        }
        .review-card {
          padding: 17px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 14px;
          background: rgba(255,255,255,.025);
          display: grid;
          gap: 6px;
        }
        .review-card span {
          color: #75e7ff;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .13em;
          font-weight: 900;
        }
        .review-card strong {
          color: #fff;
          font-size: 18px;
        }
        .review-card small {
          color: #77889e;
          line-height: 1.4;
        }
        .issue-box, .ready-box {
          padding: 18px 20px;
          border-radius: 15px;
          margin-bottom: 20px;
        }
        .issue-box {
          border: 1px solid rgba(255,142,157,.25);
          background: rgba(255,91,114,.07);
        }
        .issue-box strong {
          color: #ff9dac;
        }
        .issue-box ol {
          margin: 11px 0 0;
          padding-left: 22px;
          color: #d1d8e4;
          font-size: 13px;
          line-height: 1.8;
        }
        .ready-box {
          border: 1px solid rgba(124,240,189,.25);
          background: rgba(52,211,153,.07);
        }
        .ready-box strong {
          color: #7cf0bd;
        }
        .ready-box p {
          color: #c8d7d1;
          margin: 8px 0 0;
          font-size: 13px;
          line-height: 1.55;
        }
        .submit-button {
          width: 100%;
          margin-top: 8px;
          border: 0;
          border-radius: 14px;
          padding: 17px;
          color: #011217;
          background: linear-gradient(135deg, #75e7ff, #7cf0bd);
          font-size: 15px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 16px 50px rgba(117,231,255,.18);
        }
        .receipt {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border: 1px solid rgba(124,240,189,.28);
          border-radius: 16px;
          background: rgba(52,211,153,.08);
        }
        .receipt div {
          display: grid;
          gap: 5px;
        }
        .receipt span {
          color: #7cf0bd;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .receipt strong {
          font-size: 20px;
        }
        .receipt small {
          color: #8da49b;
        }
        .footer-nav {
          display: grid;
          grid-template-columns: 150px 1fr 150px;
          align-items: center;
          gap: 18px;
          padding: 17px 18px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 15px;
          background: rgba(8,14,27,.78);
        }
        .footer-nav > div {
          display: grid;
          text-align: center;
          gap: 3px;
        }
        .footer-nav span {
          color: #6e7f96;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .12em;
        }
        .footer-nav strong {
          font-size: 13px;
        }
        .utility-row {
          display: flex;
          justify-content: center;
          gap: 18px;
          padding: 5px;
        }
        .site-footer {
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(255,255,255,.08);
          padding: 28px clamp(20px, 5vw, 80px);
          display: flex;
          justify-content: space-between;
          gap: 30px;
          color: #7c8da4;
          background: rgba(3,6,13,.8);
        }
        .site-footer div {
          display: grid;
          gap: 5px;
        }
        .site-footer strong {
          color: #d8e4f4;
          font-size: 12px;
        }
        .site-footer span, .site-footer a {
          font-size: 11px;
        }
        .site-footer a {
          color: #75e7ff;
          font-weight: 800;
        }
        input:focus, textarea:focus, select:focus, button:focus-visible, a:focus-visible {
          outline: 2px solid #75e7ff;
          outline-offset: 2px;
        }
        @media (max-width: 1180px) {
          .hero {
            grid-template-columns: 1fr;
          }
          .hero-card {
            grid-template-columns: 180px 1fr;
          }
          .workspace {
            grid-template-columns: 240px minmax(0,1fr);
          }
          .standard-row, .evidence-row {
            grid-template-columns: repeat(2, minmax(0,1fr));
          }
          .standard-meta, .evidence-title {
            grid-column: span 2;
          }
          .standard-row > label:nth-last-child(-n+2) {
            grid-column: span 2;
          }
        }
        @media (max-width: 820px) {
          .topbar {
            align-items: flex-start;
          }
          .top-actions {
            max-width: 50%;
          }
          .workspace {
            display: block;
          }
          .rail {
            position: relative;
            top: auto;
            max-height: none;
            margin-bottom: 18px;
            display: grid;
            grid-template-columns: repeat(2, minmax(0,1fr));
          }
          .rail-label, .rail-summary {
            grid-column: 1 / -1;
          }
          .hero {
            padding-top: 48px;
          }
          .hero-card {
            grid-template-columns: 1fr;
          }
          .grid-2, .grid-3, .choice-grid, .review-grid {
            grid-template-columns: 1fr;
          }
          .standard-row, .evidence-row {
            grid-template-columns: 1fr;
          }
          .standard-meta, .evidence-title, .standard-row > label:nth-last-child(-n+2), .evidence-row > .grid, .evidence-row > label:last-child, .evidence-row > label:nth-last-child(2) {
            grid-column: auto;
          }
          .boundary {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 560px) {
          .topbar {
            position: relative;
            display: grid;
          }
          .top-actions {
            max-width: none;
            justify-content: flex-start;
          }
          .hero h1 {
            font-size: 45px;
          }
          .hero-metrics {
            grid-template-columns: 1fr;
          }
          .rail {
            grid-template-columns: 1fr;
          }
          .rail-label, .rail-summary {
            grid-column: auto;
          }
          .footer-nav {
            grid-template-columns: 1fr;
          }
          .site-footer {
            display: grid;
          }
          .receipt {
            display: grid;
          }
        }
        @media print {
          .topbar, .rail, .footer-nav, .utility-row, .site-footer, .button, .text-button, .atmosphere {
            display: none !important;
          }
          .page-shell {
            background: white;
            color: black;
          }
          .workspace, .hero {
            display: block;
            max-width: none;
            padding: 20px;
          }
          .hero h1, h2, strong {
            color: black !important;
          }
          .hero p, p, span, small, label {
            color: #222 !important;
          }
          section {
            break-inside: avoid;
            background: white !important;
            border-color: #bbb !important;
            box-shadow: none !important;
          }
          input, textarea, select {
            color: black !important;
            background: white !important;
            border-color: #bbb !important;
          }
        }
      `}</style>
    </main>
  );
}
