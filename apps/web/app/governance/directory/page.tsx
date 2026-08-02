"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type DirectoryView = "directory" | "profile" | "evidence" | "method";
type RegistrationStatus = "PUBLISHED" | "IN_REVIEW" | "CORRECTED" | "CHALLENGED";
type AssuranceStatus = "VERIFIED" | "REVIEWED" | "DECLARED";
type SortMode = "evidence" | "artifacts" | "verification" | "name";
type RecordKind = "INSTITUTIONAL" | "DEMONSTRATION";

type GovernanceRecord = {
  id: string;
  organization: string;
  architecture: string;
  version: string;
  jurisdiction: string;
  category: string;
  registrationStatus: RegistrationStatus;
  assurance: AssuranceStatus;
  verificationLevel: number;
  routes: number;
  artifacts: number;
  challenges: number;
  sectors: string[];
  jurisdictions: string[];
  accountableOwner: string;
  claim: string;
  limitation: string;
  recordKind: RecordKind;
};

type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

type EvidenceMetric = {
  label: string;
  value: number;
  note: string;
};

type BadgeTone = "gold" | "cyan" | "green" | "amber" | "red" | "violet" | "slate";

const GOVERNANCES: GovernanceRecord[] = [
  {
    id: "GOV-TA14-0001",
    recordKind: "INSTITUTIONAL",
    organization: "TA-14 Authority",
    architecture: "TA-14 Admissible Execution Architecture",
    version: "2.0",
    jurisdiction: "United States",
    category: "Institutional governance infrastructure",
    registrationStatus: "PUBLISHED" as RegistrationStatus,
    assurance: "VERIFIED" as AssuranceStatus,
    verificationLevel: 7,
    routes: 12,
    artifacts: 24,
    challenges: 1,
    sectors: ["AI operations", "Critical infrastructure", "Financial execution", "Healthcare"],
    jurisdictions: ["United States", "United Kingdom", "European Union"],
    accountableOwner: "TA-14 accountable governance council",
    claim: "Execution governance must be demonstrated through bounded, inspectable records.",
    limitation: "Registration does not certify universal fitness or legal compliance.",
  },
  {
    id: "GOV-DEMO-0002",
    recordKind: "DEMONSTRATION",
    organization: "Northstar Model Governance Lab",
    architecture: "Northstar Control Fabric",
    version: "1.8",
    jurisdiction: "Canada",
    category: "AI assurance laboratory",
    registrationStatus: "PUBLISHED" as RegistrationStatus,
    assurance: "REVIEWED" as AssuranceStatus,
    verificationLevel: 6,
    routes: 8,
    artifacts: 14,
    challenges: 0,
    sectors: ["AI operations", "Data governance", "Research governance"],
    jurisdictions: ["Canada", "United States"],
    accountableOwner: "Independent model assurance board",
    claim: "Produces bounded model-release and runtime-control artifacts.",
    limitation: "Demonstration profile; production claims require independent verification.",
  },
  {
    id: "GOV-DEMO-0003",
    recordKind: "DEMONSTRATION",
    organization: "CivicRoute Public Systems",
    architecture: "CivicRoute Decision Governance",
    version: "3.1",
    jurisdiction: "United States",
    category: "Public-sector governance",
    registrationStatus: "PUBLISHED" as RegistrationStatus,
    assurance: "VERIFIED" as AssuranceStatus,
    verificationLevel: 6,
    routes: 11,
    artifacts: 19,
    challenges: 2,
    sectors: ["Public sector", "Procurement", "Education"],
    jurisdictions: ["United States"],
    accountableOwner: "Public accountability officer",
    claim: "Governs evidence, authority, and appeal for public decision routes.",
    limitation: "Does not replace statutory review, due process, or agency authority.",
  },
  {
    id: "GOV-DEMO-0004",
    recordKind: "DEMONSTRATION",
    organization: "Aegis Clinical Governance",
    architecture: "Aegis Clinical Admissibility Framework",
    version: "2.4",
    jurisdiction: "United Kingdom",
    category: "Clinical AI governance",
    registrationStatus: "PUBLISHED" as RegistrationStatus,
    assurance: "REVIEWED" as AssuranceStatus,
    verificationLevel: 5,
    routes: 9,
    artifacts: 17,
    challenges: 1,
    sectors: ["Healthcare", "Life sciences"],
    jurisdictions: ["United Kingdom", "European Union"],
    accountableOwner: "Clinical safety and evidence board",
    claim: "Preserves evidence conflict, named authority, and patient-impact boundaries.",
    limitation: "Does not constitute medical-device certification or clinical authorization.",
  },
  {
    id: "GOV-DEMO-0005",
    recordKind: "DEMONSTRATION",
    organization: "ClearLedger Execution Controls",
    architecture: "ClearLedger Bounded Finance Architecture",
    version: "1.6",
    jurisdiction: "United States",
    category: "Financial execution governance",
    registrationStatus: "PUBLISHED" as RegistrationStatus,
    assurance: "VERIFIED" as AssuranceStatus,
    verificationLevel: 7,
    routes: 15,
    artifacts: 28,
    challenges: 0,
    sectors: ["Financial execution", "Financial services", "Enterprise operations"],
    jurisdictions: ["United States", "Canada"],
    accountableOwner: "Financial control steward",
    claim: "Binds financial actions to evidence, delegated authority, and amount ceilings.",
    limitation: "Does not provide accounting, banking, or regulatory certification.",
  },
  {
    id: "GOV-DEMO-0006",
    recordKind: "DEMONSTRATION",
    organization: "Sentinel Infrastructure Council",
    architecture: "Sentinel Consequence Control System",
    version: "4.0",
    jurisdiction: "European Union",
    category: "Critical infrastructure governance",
    registrationStatus: "PUBLISHED" as RegistrationStatus,
    assurance: "REVIEWED" as AssuranceStatus,
    verificationLevel: 6,
    routes: 13,
    artifacts: 23,
    challenges: 2,
    sectors: ["Critical infrastructure", "Environmental systems", "Physical systems"],
    jurisdictions: ["European Union", "United Kingdom"],
    accountableOwner: "Infrastructure consequence authority",
    claim: "Controls threshold changes, runtime drift, revalidation, and verified outcomes.",
    limitation: "Sector deployment requires local operator and regulator approval.",
  },
  {
    id: "GOV-DEMO-0007",
    recordKind: "DEMONSTRATION",
    organization: "Harbor Data Stewardship",
    architecture: "Harbor Evidence Boundary Model",
    version: "2.2",
    jurisdiction: "Singapore",
    category: "Data governance",
    registrationStatus: "PUBLISHED" as RegistrationStatus,
    assurance: "DECLARED" as AssuranceStatus,
    verificationLevel: 3,
    routes: 5,
    artifacts: 7,
    challenges: 0,
    sectors: ["Data governance", "Digital platforms", "Research governance"],
    jurisdictions: ["Singapore", "Australia"],
    accountableOwner: "Data stewardship committee",
    claim: "Demonstrates provenance, custody, privacy-preserving proof, and export boundaries.",
    limitation: "Independent review is pending; reliance is limited to declared controls.",
  },
  {
    id: "GOV-DEMO-0008",
    recordKind: "DEMONSTRATION",
    organization: "Orion Autonomous Systems",
    architecture: "Orion Runtime Assurance Architecture",
    version: "1.9",
    jurisdiction: "United States",
    category: "Autonomous systems governance",
    registrationStatus: "IN_REVIEW" as RegistrationStatus,
    assurance: "DECLARED" as AssuranceStatus,
    verificationLevel: 2,
    routes: 4,
    artifacts: 4,
    challenges: 1,
    sectors: ["Mobility", "Industrial safety", "AI operations"],
    jurisdictions: ["United States"],
    accountableOwner: "Autonomous systems review board",
    claim: "Tests execution boundaries, runtime versions, bypass resistance, and rollback.",
    limitation: "Profile remains under review and is not eligible for public artifact reliance.",
  },
  {
    id: "GOV-DEMO-0009",
    recordKind: "DEMONSTRATION",
    organization: "Meridian Workforce Governance",
    architecture: "Meridian Employment Decision Controls",
    version: "2.7",
    jurisdiction: "United States",
    category: "Employment AI governance",
    registrationStatus: "PUBLISHED" as RegistrationStatus,
    assurance: "REVIEWED" as AssuranceStatus,
    verificationLevel: 5,
    routes: 10,
    artifacts: 16,
    challenges: 3,
    sectors: ["Employment", "Enterprise operations"],
    jurisdictions: ["United States", "Canada"],
    accountableOwner: "Workforce governance officer",
    claim: "Preserves evidence, authority, challenge, and correction for employment decisions.",
    limitation: "Does not establish employment-law compliance across every jurisdiction.",
  },
  {
    id: "GOV-DEMO-0010",
    recordKind: "DEMONSTRATION",
    organization: "Atlas Learning Integrity",
    architecture: "Atlas Educational Placement Governance",
    version: "1.5",
    jurisdiction: "Australia",
    category: "Education governance",
    registrationStatus: "PUBLISHED" as RegistrationStatus,
    assurance: "VERIFIED" as AssuranceStatus,
    verificationLevel: 6,
    routes: 12,
    artifacts: 21,
    challenges: 0,
    sectors: ["Education", "Public sector"],
    jurisdictions: ["Australia", "New Zealand"],
    accountableOwner: "Learner-impact governance council",
    claim: "Governs placement recommendations through evidence, review, and appeal routes.",
    limitation: "Does not authorize autonomous final placement without institutional authority.",
  },
  {
    id: "GOV-DEMO-0011",
    recordKind: "DEMONSTRATION",
    organization: "Verity Claims Governance",
    architecture: "Verity Insurance Decision Architecture",
    version: "3.0",
    jurisdiction: "United Kingdom",
    category: "Insurance governance",
    registrationStatus: "CORRECTED" as RegistrationStatus,
    assurance: "REVIEWED" as AssuranceStatus,
    verificationLevel: 5,
    routes: 8,
    artifacts: 13,
    challenges: 2,
    sectors: ["Insurance", "Financial services"],
    jurisdictions: ["United Kingdom", "European Union"],
    accountableOwner: "Claims governance executive",
    claim: "Maintains decision records, evidence freshness, authority, and correction history.",
    limitation: "One published portfolio claim was corrected; amendment history remains visible.",
  },
  {
    id: "GOV-DEMO-0012",
    recordKind: "DEMONSTRATION",
    organization: "Palisade Research Controls",
    architecture: "Palisade Dual-Use Release Framework",
    version: "2.1",
    jurisdiction: "United States",
    category: "Research governance",
    registrationStatus: "CHALLENGED" as RegistrationStatus,
    assurance: "REVIEWED" as AssuranceStatus,
    verificationLevel: 4,
    routes: 7,
    artifacts: 11,
    challenges: 4,
    sectors: ["Research governance", "Cybersecurity", "Life sciences"],
    jurisdictions: ["United States", "European Union"],
    accountableOwner: "Research release authority",
    claim: "Routes exceptional-risk publication decisions to named institutional authority.",
    limitation: "An open challenge limits prospective reliance on one declared capability.",
  },
];

const DETERMINATION_PALETTE: Record<Determination, { tone: BadgeTone; description: string }> = {
  ALLOW: { tone: "green", description: "All mandatory conditions supported the exact committed action." },
  HOLD: { tone: "amber", description: "A repairable or revalidation condition prevented execution." },
  DENY: { tone: "red", description: "A prohibited condition or hard boundary prevented execution." },
  ESCALATE: { tone: "violet", description: "Named institutional judgment was required before consequence." },
};

const INSTITUTIONAL_RECORDS = GOVERNANCES.filter((record) => record.recordKind === "INSTITUTIONAL");
const DEMONSTRATION_RECORDS = GOVERNANCES.filter((record) => record.recordKind === "DEMONSTRATION");

const EVIDENCE_METRICS: EvidenceMetric[] = [
  { label: "Institutional registrations", value: INSTITUTIONAL_RECORDS.length, note: "Current attributable governance registrations represented as institutional records." },
  { label: "Demonstration profiles", value: DEMONSTRATION_RECORDS.length, note: "Synthetic examples used to demonstrate directory behavior, filtering, and evidence states." },
  { label: "Institutional artifacts", value: INSTITUTIONAL_RECORDS.reduce((sum, record) => sum + record.artifacts, 0), note: "Artifacts attributed to institutional records only; simulated portfolio counts are excluded." },
  { label: "Institutional routes", value: INSTITUTIONAL_RECORDS.reduce((sum, record) => sum + record.routes, 0), note: "Governed routes attributed to institutional records only; simulated route counts are excluded." },
];

const VERIFICATION_LEVELS = [
  "Declared",
  "Package integrity",
  "Signature validity",
  "Record parity",
  "Replay consistency",
  "Execution effect",
  "Outcome closure",
  "Independent review",
];

const DIRECTORY_PRINCIPLES = [
  ["Registration is attribution", "A profile identifies who owns the governance architecture, its version, scope, claims, and limits."],
  ["Registration is not certification", "A directory entry does not prove effectiveness. Registered execution artifacts provide the evidence."],
  ["Artifacts remain bounded", "Every artifact preserves its own route, evidence, authority, determination, receipt, outcome, and claims boundary."],
  ["Challenges remain visible", "Corrections and reversals append to history instead of silently rewriting the original record."],
  ["Reliance is level-specific", "Visitors can distinguish declared claims from package integrity, execution-effect proof, outcome closure, and independent review."],
  ["No registered governance, no registered artifact", "Artifact admission requires an eligible governance registration and version-consistent ownership."],
];

const DIRECTORY_CONTROLS = [
  { id: "DIR-001", area: "Registration identity", requirement: "A stable governance registration identifier is present and resolves to one attributable profile.", mandatory: false },
  { id: "DIR-002", area: "Architecture version", requirement: "The named architecture and version are explicit and cannot be silently replaced after publication.", mandatory: true },
  { id: "DIR-003", area: "Accountable ownership", requirement: "The accountable owner and governance steward are identified with bounded responsibilities.", mandatory: true },
  { id: "DIR-004", area: "Declared scope", requirement: "Declared capabilities are paired with explicit limitations and non-claims.", mandatory: true },
  { id: "DIR-005", area: "Sector applicability", requirement: "Supported sectors remain visible and do not imply universal applicability.", mandatory: true },
  { id: "DIR-006", area: "Jurisdiction", requirement: "Jurisdictional coverage is declared and separated from legal certification.", mandatory: false },
  { id: "DIR-007", area: "Artifact linkage", requirement: "Every registered artifact links back to the eligible governance registration and version.", mandatory: true },
  { id: "DIR-008", area: "Verification", requirement: "Verification levels state what was checked, what was not checked, and the supported reliance boundary.", mandatory: true },
  { id: "DIR-009", area: "Challenge visibility", requirement: "Material challenges remain public while review and disposition are pending.", mandatory: true },
  { id: "DIR-010", area: "Correction history", requirement: "Corrections append to the original record and preserve prospective reliance history.", mandatory: true },
  { id: "DIR-011", area: "Public claims", requirement: "Public profile statements resolve to attributable registration or artifact evidence.", mandatory: false },
  { id: "DIR-012", area: "Claims boundaries", requirement: "Registration is never presented as certification, endorsement, or universal fitness.", mandatory: true },
  { id: "DIR-013", area: "Registration identity", requirement: "A stable governance registration identifier is present and resolves to one attributable profile.", mandatory: true },
  { id: "DIR-014", area: "Architecture version", requirement: "The named architecture and version are explicit and cannot be silently replaced after publication.", mandatory: true },
  { id: "DIR-015", area: "Accountable ownership", requirement: "The accountable owner and governance steward are identified with bounded responsibilities.", mandatory: true },
  { id: "DIR-016", area: "Declared scope", requirement: "Declared capabilities are paired with explicit limitations and non-claims.", mandatory: false },
  { id: "DIR-017", area: "Sector applicability", requirement: "Supported sectors remain visible and do not imply universal applicability.", mandatory: true },
  { id: "DIR-018", area: "Jurisdiction", requirement: "Jurisdictional coverage is declared and separated from legal certification.", mandatory: true },
  { id: "DIR-019", area: "Artifact linkage", requirement: "Every registered artifact links back to the eligible governance registration and version.", mandatory: true },
  { id: "DIR-020", area: "Verification", requirement: "Verification levels state what was checked, what was not checked, and the supported reliance boundary.", mandatory: true },
  { id: "DIR-021", area: "Challenge visibility", requirement: "Material challenges remain public while review and disposition are pending.", mandatory: false },
  { id: "DIR-022", area: "Correction history", requirement: "Corrections append to the original record and preserve prospective reliance history.", mandatory: true },
  { id: "DIR-023", area: "Public claims", requirement: "Public profile statements resolve to attributable registration or artifact evidence.", mandatory: true },
  { id: "DIR-024", area: "Claims boundaries", requirement: "Registration is never presented as certification, endorsement, or universal fitness.", mandatory: true },
  { id: "DIR-025", area: "Registration identity", requirement: "A stable governance registration identifier is present and resolves to one attributable profile.", mandatory: true },
  { id: "DIR-026", area: "Architecture version", requirement: "The named architecture and version are explicit and cannot be silently replaced after publication.", mandatory: false },
  { id: "DIR-027", area: "Accountable ownership", requirement: "The accountable owner and governance steward are identified with bounded responsibilities.", mandatory: true },
  { id: "DIR-028", area: "Declared scope", requirement: "Declared capabilities are paired with explicit limitations and non-claims.", mandatory: true },
  { id: "DIR-029", area: "Sector applicability", requirement: "Supported sectors remain visible and do not imply universal applicability.", mandatory: true },
  { id: "DIR-030", area: "Jurisdiction", requirement: "Jurisdictional coverage is declared and separated from legal certification.", mandatory: true },
  { id: "DIR-031", area: "Artifact linkage", requirement: "Every registered artifact links back to the eligible governance registration and version.", mandatory: false },
  { id: "DIR-032", area: "Verification", requirement: "Verification levels state what was checked, what was not checked, and the supported reliance boundary.", mandatory: true },
  { id: "DIR-033", area: "Challenge visibility", requirement: "Material challenges remain public while review and disposition are pending.", mandatory: true },
  { id: "DIR-034", area: "Correction history", requirement: "Corrections append to the original record and preserve prospective reliance history.", mandatory: true },
  { id: "DIR-035", area: "Public claims", requirement: "Public profile statements resolve to attributable registration or artifact evidence.", mandatory: true },
  { id: "DIR-036", area: "Claims boundaries", requirement: "Registration is never presented as certification, endorsement, or universal fitness.", mandatory: false },
  { id: "DIR-037", area: "Registration identity", requirement: "A stable governance registration identifier is present and resolves to one attributable profile.", mandatory: true },
  { id: "DIR-038", area: "Architecture version", requirement: "The named architecture and version are explicit and cannot be silently replaced after publication.", mandatory: true },
  { id: "DIR-039", area: "Accountable ownership", requirement: "The accountable owner and governance steward are identified with bounded responsibilities.", mandatory: true },
  { id: "DIR-040", area: "Declared scope", requirement: "Declared capabilities are paired with explicit limitations and non-claims.", mandatory: true },
  { id: "DIR-041", area: "Sector applicability", requirement: "Supported sectors remain visible and do not imply universal applicability.", mandatory: false },
  { id: "DIR-042", area: "Jurisdiction", requirement: "Jurisdictional coverage is declared and separated from legal certification.", mandatory: true },
  { id: "DIR-043", area: "Artifact linkage", requirement: "Every registered artifact links back to the eligible governance registration and version.", mandatory: true },
  { id: "DIR-044", area: "Verification", requirement: "Verification levels state what was checked, what was not checked, and the supported reliance boundary.", mandatory: true },
  { id: "DIR-045", area: "Challenge visibility", requirement: "Material challenges remain public while review and disposition are pending.", mandatory: true },
  { id: "DIR-046", area: "Correction history", requirement: "Corrections append to the original record and preserve prospective reliance history.", mandatory: false },
  { id: "DIR-047", area: "Public claims", requirement: "Public profile statements resolve to attributable registration or artifact evidence.", mandatory: true },
  { id: "DIR-048", area: "Claims boundaries", requirement: "Registration is never presented as certification, endorsement, or universal fitness.", mandatory: true },
  { id: "DIR-049", area: "Registration identity", requirement: "A stable governance registration identifier is present and resolves to one attributable profile.", mandatory: true },
  { id: "DIR-050", area: "Architecture version", requirement: "The named architecture and version are explicit and cannot be silently replaced after publication.", mandatory: true },
  { id: "DIR-051", area: "Accountable ownership", requirement: "The accountable owner and governance steward are identified with bounded responsibilities.", mandatory: false },
  { id: "DIR-052", area: "Declared scope", requirement: "Declared capabilities are paired with explicit limitations and non-claims.", mandatory: true },
  { id: "DIR-053", area: "Sector applicability", requirement: "Supported sectors remain visible and do not imply universal applicability.", mandatory: true },
  { id: "DIR-054", area: "Jurisdiction", requirement: "Jurisdictional coverage is declared and separated from legal certification.", mandatory: true },
  { id: "DIR-055", area: "Artifact linkage", requirement: "Every registered artifact links back to the eligible governance registration and version.", mandatory: true },
  { id: "DIR-056", area: "Verification", requirement: "Verification levels state what was checked, what was not checked, and the supported reliance boundary.", mandatory: false },
  { id: "DIR-057", area: "Challenge visibility", requirement: "Material challenges remain public while review and disposition are pending.", mandatory: true },
  { id: "DIR-058", area: "Correction history", requirement: "Corrections append to the original record and preserve prospective reliance history.", mandatory: true },
  { id: "DIR-059", area: "Public claims", requirement: "Public profile statements resolve to attributable registration or artifact evidence.", mandatory: true },
  { id: "DIR-060", area: "Claims boundaries", requirement: "Registration is never presented as certification, endorsement, or universal fitness.", mandatory: true },
  { id: "DIR-061", area: "Registration identity", requirement: "A stable governance registration identifier is present and resolves to one attributable profile.", mandatory: false },
  { id: "DIR-062", area: "Architecture version", requirement: "The named architecture and version are explicit and cannot be silently replaced after publication.", mandatory: true },
  { id: "DIR-063", area: "Accountable ownership", requirement: "The accountable owner and governance steward are identified with bounded responsibilities.", mandatory: true },
  { id: "DIR-064", area: "Declared scope", requirement: "Declared capabilities are paired with explicit limitations and non-claims.", mandatory: true },
  { id: "DIR-065", area: "Sector applicability", requirement: "Supported sectors remain visible and do not imply universal applicability.", mandatory: true },
  { id: "DIR-066", area: "Jurisdiction", requirement: "Jurisdictional coverage is declared and separated from legal certification.", mandatory: false },
  { id: "DIR-067", area: "Artifact linkage", requirement: "Every registered artifact links back to the eligible governance registration and version.", mandatory: true },
  { id: "DIR-068", area: "Verification", requirement: "Verification levels state what was checked, what was not checked, and the supported reliance boundary.", mandatory: true },
  { id: "DIR-069", area: "Challenge visibility", requirement: "Material challenges remain public while review and disposition are pending.", mandatory: true },
  { id: "DIR-070", area: "Correction history", requirement: "Corrections append to the original record and preserve prospective reliance history.", mandatory: true },
  { id: "DIR-071", area: "Public claims", requirement: "Public profile statements resolve to attributable registration or artifact evidence.", mandatory: false },
  { id: "DIR-072", area: "Claims boundaries", requirement: "Registration is never presented as certification, endorsement, or universal fitness.", mandatory: true },
  { id: "DIR-073", area: "Registration identity", requirement: "A stable governance registration identifier is present and resolves to one attributable profile.", mandatory: true },
  { id: "DIR-074", area: "Architecture version", requirement: "The named architecture and version are explicit and cannot be silently replaced after publication.", mandatory: true },
  { id: "DIR-075", area: "Accountable ownership", requirement: "The accountable owner and governance steward are identified with bounded responsibilities.", mandatory: true },
  { id: "DIR-076", area: "Declared scope", requirement: "Declared capabilities are paired with explicit limitations and non-claims.", mandatory: false },
  { id: "DIR-077", area: "Sector applicability", requirement: "Supported sectors remain visible and do not imply universal applicability.", mandatory: true },
  { id: "DIR-078", area: "Jurisdiction", requirement: "Jurisdictional coverage is declared and separated from legal certification.", mandatory: true },
  { id: "DIR-079", area: "Artifact linkage", requirement: "Every registered artifact links back to the eligible governance registration and version.", mandatory: true },
  { id: "DIR-080", area: "Verification", requirement: "Verification levels state what was checked, what was not checked, and the supported reliance boundary.", mandatory: true },
  { id: "DIR-081", area: "Challenge visibility", requirement: "Material challenges remain public while review and disposition are pending.", mandatory: false },
  { id: "DIR-082", area: "Correction history", requirement: "Corrections append to the original record and preserve prospective reliance history.", mandatory: true },
  { id: "DIR-083", area: "Public claims", requirement: "Public profile statements resolve to attributable registration or artifact evidence.", mandatory: true },
  { id: "DIR-084", area: "Claims boundaries", requirement: "Registration is never presented as certification, endorsement, or universal fitness.", mandatory: true },
  { id: "DIR-085", area: "Registration identity", requirement: "A stable governance registration identifier is present and resolves to one attributable profile.", mandatory: true },
  { id: "DIR-086", area: "Architecture version", requirement: "The named architecture and version are explicit and cannot be silently replaced after publication.", mandatory: false },
  { id: "DIR-087", area: "Accountable ownership", requirement: "The accountable owner and governance steward are identified with bounded responsibilities.", mandatory: true },
  { id: "DIR-088", area: "Declared scope", requirement: "Declared capabilities are paired with explicit limitations and non-claims.", mandatory: true },
  { id: "DIR-089", area: "Sector applicability", requirement: "Supported sectors remain visible and do not imply universal applicability.", mandatory: true },
  { id: "DIR-090", area: "Jurisdiction", requirement: "Jurisdictional coverage is declared and separated from legal certification.", mandatory: true },
  { id: "DIR-091", area: "Artifact linkage", requirement: "Every registered artifact links back to the eligible governance registration and version.", mandatory: false },
  { id: "DIR-092", area: "Verification", requirement: "Verification levels state what was checked, what was not checked, and the supported reliance boundary.", mandatory: true },
  { id: "DIR-093", area: "Challenge visibility", requirement: "Material challenges remain public while review and disposition are pending.", mandatory: true },
  { id: "DIR-094", area: "Correction history", requirement: "Corrections append to the original record and preserve prospective reliance history.", mandatory: true },
  { id: "DIR-095", area: "Public claims", requirement: "Public profile statements resolve to attributable registration or artifact evidence.", mandatory: true },
  { id: "DIR-096", area: "Claims boundaries", requirement: "Registration is never presented as certification, endorsement, or universal fitness.", mandatory: false },
  { id: "DIR-097", area: "Registration identity", requirement: "A stable governance registration identifier is present and resolves to one attributable profile.", mandatory: true },
  { id: "DIR-098", area: "Architecture version", requirement: "The named architecture and version are explicit and cannot be silently replaced after publication.", mandatory: true },
  { id: "DIR-099", area: "Accountable ownership", requirement: "The accountable owner and governance steward are identified with bounded responsibilities.", mandatory: true },
  { id: "DIR-100", area: "Declared scope", requirement: "Declared capabilities are paired with explicit limitations and non-claims.", mandatory: true },
  { id: "DIR-101", area: "Sector applicability", requirement: "Supported sectors remain visible and do not imply universal applicability.", mandatory: false },
  { id: "DIR-102", area: "Jurisdiction", requirement: "Jurisdictional coverage is declared and separated from legal certification.", mandatory: true },
  { id: "DIR-103", area: "Artifact linkage", requirement: "Every registered artifact links back to the eligible governance registration and version.", mandatory: true },
  { id: "DIR-104", area: "Verification", requirement: "Verification levels state what was checked, what was not checked, and the supported reliance boundary.", mandatory: true },
  { id: "DIR-105", area: "Challenge visibility", requirement: "Material challenges remain public while review and disposition are pending.", mandatory: true },
  { id: "DIR-106", area: "Correction history", requirement: "Corrections append to the original record and preserve prospective reliance history.", mandatory: false },
  { id: "DIR-107", area: "Public claims", requirement: "Public profile statements resolve to attributable registration or artifact evidence.", mandatory: true },
  { id: "DIR-108", area: "Claims boundaries", requirement: "Registration is never presented as certification, endorsement, or universal fitness.", mandatory: true },
  { id: "DIR-109", area: "Registration identity", requirement: "A stable governance registration identifier is present and resolves to one attributable profile.", mandatory: true },
  { id: "DIR-110", area: "Architecture version", requirement: "The named architecture and version are explicit and cannot be silently replaced after publication.", mandatory: true },
  { id: "DIR-111", area: "Accountable ownership", requirement: "The accountable owner and governance steward are identified with bounded responsibilities.", mandatory: false },
  { id: "DIR-112", area: "Declared scope", requirement: "Declared capabilities are paired with explicit limitations and non-claims.", mandatory: true },
  { id: "DIR-113", area: "Sector applicability", requirement: "Supported sectors remain visible and do not imply universal applicability.", mandatory: true },
  { id: "DIR-114", area: "Jurisdiction", requirement: "Jurisdictional coverage is declared and separated from legal certification.", mandatory: true },
  { id: "DIR-115", area: "Artifact linkage", requirement: "Every registered artifact links back to the eligible governance registration and version.", mandatory: true },
  { id: "DIR-116", area: "Verification", requirement: "Verification levels state what was checked, what was not checked, and the supported reliance boundary.", mandatory: false },
  { id: "DIR-117", area: "Challenge visibility", requirement: "Material challenges remain public while review and disposition are pending.", mandatory: true },
  { id: "DIR-118", area: "Correction history", requirement: "Corrections append to the original record and preserve prospective reliance history.", mandatory: true },
  { id: "DIR-119", area: "Public claims", requirement: "Public profile statements resolve to attributable registration or artifact evidence.", mandatory: true },
  { id: "DIR-120", area: "Claims boundaries", requirement: "Registration is never presented as certification, endorsement, or universal fitness.", mandatory: true },
] as const;


const DIRECTORY_PROFILE_FIELDS = [
  {
    id: "FIELD-001",
    domain: "Identity",
    label: "Stable governance registration ID",
    publicRequired: false,
  },
  {
    id: "FIELD-002",
    domain: "Identity",
    label: "Legal or institutional organization name",
    publicRequired: true,
  },
  {
    id: "FIELD-003",
    domain: "Identity",
    label: "Public operating name",
    publicRequired: true,
  },
  {
    id: "FIELD-004",
    domain: "Identity",
    label: "Accountable owner",
    publicRequired: false,
  },
  {
    id: "FIELD-005",
    domain: "Identity",
    label: "Registry steward",
    publicRequired: true,
  },
  {
    id: "FIELD-006",
    domain: "Architecture",
    label: "Architecture name",
    publicRequired: true,
  },
  {
    id: "FIELD-007",
    domain: "Architecture",
    label: "Architecture version",
    publicRequired: false,
  },
  {
    id: "FIELD-008",
    domain: "Architecture",
    label: "Architecture hash",
    publicRequired: true,
  },
  {
    id: "FIELD-009",
    domain: "Architecture",
    label: "Effective date",
    publicRequired: true,
  },
  {
    id: "FIELD-010",
    domain: "Architecture",
    label: "Superseded version link",
    publicRequired: false,
  },
  {
    id: "FIELD-011",
    domain: "Scope",
    label: "Supported sectors",
    publicRequired: true,
  },
  {
    id: "FIELD-012",
    domain: "Scope",
    label: "Supported jurisdictions",
    publicRequired: true,
  },
  {
    id: "FIELD-013",
    domain: "Scope",
    label: "Consequence classes",
    publicRequired: false,
  },
  {
    id: "FIELD-014",
    domain: "Scope",
    label: "Approved execution adapters",
    publicRequired: true,
  },
  {
    id: "FIELD-015",
    domain: "Scope",
    label: "Declared exclusions",
    publicRequired: true,
  },
  {
    id: "FIELD-016",
    domain: "Claims",
    label: "Published capability claims",
    publicRequired: false,
  },
  {
    id: "FIELD-017",
    domain: "Claims",
    label: "Explicit non-claims",
    publicRequired: true,
  },
  {
    id: "FIELD-018",
    domain: "Claims",
    label: "Claims-boundary statement",
    publicRequired: true,
  },
  {
    id: "FIELD-019",
    domain: "Claims",
    label: "Evidence supporting each claim",
    publicRequired: false,
  },
  {
    id: "FIELD-020",
    domain: "Claims",
    label: "Correction status",
    publicRequired: true,
  },
  {
    id: "FIELD-021",
    domain: "Routes",
    label: "Registered route IDs",
    publicRequired: true,
  },
  {
    id: "FIELD-022",
    domain: "Routes",
    label: "Route versions",
    publicRequired: false,
  },
  {
    id: "FIELD-023",
    domain: "Routes",
    label: "Route publication states",
    publicRequired: true,
  },
  {
    id: "FIELD-024",
    domain: "Routes",
    label: "Revalidation triggers",
    publicRequired: true,
  },
  {
    id: "FIELD-025",
    domain: "Routes",
    label: "Route ownership",
    publicRequired: false,
  },
  {
    id: "FIELD-026",
    domain: "Artifacts",
    label: "Published artifact IDs",
    publicRequired: true,
  },
  {
    id: "FIELD-027",
    domain: "Artifacts",
    label: "Artifact determinations",
    publicRequired: true,
  },
  {
    id: "FIELD-028",
    domain: "Artifacts",
    label: "Execution receipt states",
    publicRequired: false,
  },
  {
    id: "FIELD-029",
    domain: "Artifacts",
    label: "Outcome closure levels",
    publicRequired: true,
  },
  {
    id: "FIELD-030",
    domain: "Artifacts",
    label: "Challenge links",
    publicRequired: true,
  },
  {
    id: "FIELD-031",
    domain: "Verification",
    label: "Current verification level",
    publicRequired: false,
  },
  {
    id: "FIELD-032",
    domain: "Verification",
    label: "Signature status",
    publicRequired: true,
  },
  {
    id: "FIELD-033",
    domain: "Verification",
    label: "Record parity status",
    publicRequired: true,
  },
  {
    id: "FIELD-034",
    domain: "Verification",
    label: "Execution-effect status",
    publicRequired: false,
  },
  {
    id: "FIELD-035",
    domain: "Verification",
    label: "Independent review status",
    publicRequired: true,
  },
  {
    id: "FIELD-036",
    domain: "Reliance",
    label: "Permitted reliance uses",
    publicRequired: true,
  },
  {
    id: "FIELD-037",
    domain: "Reliance",
    label: "Prohibited reliance uses",
    publicRequired: false,
  },
  {
    id: "FIELD-038",
    domain: "Reliance",
    label: "Open challenge impact",
    publicRequired: true,
  },
  {
    id: "FIELD-039",
    domain: "Reliance",
    label: "Supersession impact",
    publicRequired: true,
  },
  {
    id: "FIELD-040",
    domain: "Reliance",
    label: "Withdrawal status",
    publicRequired: false,
  },
  {
    id: "FIELD-041",
    domain: "Identity",
    label: "Stable governance registration ID",
    publicRequired: true,
  },
  {
    id: "FIELD-042",
    domain: "Identity",
    label: "Legal or institutional organization name",
    publicRequired: true,
  },
  {
    id: "FIELD-043",
    domain: "Identity",
    label: "Public operating name",
    publicRequired: false,
  },
  {
    id: "FIELD-044",
    domain: "Identity",
    label: "Accountable owner",
    publicRequired: true,
  },
  {
    id: "FIELD-045",
    domain: "Identity",
    label: "Registry steward",
    publicRequired: true,
  },
  {
    id: "FIELD-046",
    domain: "Architecture",
    label: "Architecture name",
    publicRequired: false,
  },
  {
    id: "FIELD-047",
    domain: "Architecture",
    label: "Architecture version",
    publicRequired: true,
  },
  {
    id: "FIELD-048",
    domain: "Architecture",
    label: "Architecture hash",
    publicRequired: true,
  },
  {
    id: "FIELD-049",
    domain: "Architecture",
    label: "Effective date",
    publicRequired: false,
  },
  {
    id: "FIELD-050",
    domain: "Architecture",
    label: "Superseded version link",
    publicRequired: true,
  },
  {
    id: "FIELD-051",
    domain: "Scope",
    label: "Supported sectors",
    publicRequired: true,
  },
  {
    id: "FIELD-052",
    domain: "Scope",
    label: "Supported jurisdictions",
    publicRequired: false,
  },
  {
    id: "FIELD-053",
    domain: "Scope",
    label: "Consequence classes",
    publicRequired: true,
  },
  {
    id: "FIELD-054",
    domain: "Scope",
    label: "Approved execution adapters",
    publicRequired: true,
  },
  {
    id: "FIELD-055",
    domain: "Scope",
    label: "Declared exclusions",
    publicRequired: false,
  },
  {
    id: "FIELD-056",
    domain: "Claims",
    label: "Published capability claims",
    publicRequired: true,
  },
  {
    id: "FIELD-057",
    domain: "Claims",
    label: "Explicit non-claims",
    publicRequired: true,
  },
  {
    id: "FIELD-058",
    domain: "Claims",
    label: "Claims-boundary statement",
    publicRequired: false,
  },
  {
    id: "FIELD-059",
    domain: "Claims",
    label: "Evidence supporting each claim",
    publicRequired: true,
  },
  {
    id: "FIELD-060",
    domain: "Claims",
    label: "Correction status",
    publicRequired: true,
  },
  {
    id: "FIELD-061",
    domain: "Routes",
    label: "Registered route IDs",
    publicRequired: false,
  },
  {
    id: "FIELD-062",
    domain: "Routes",
    label: "Route versions",
    publicRequired: true,
  },
  {
    id: "FIELD-063",
    domain: "Routes",
    label: "Route publication states",
    publicRequired: true,
  },
  {
    id: "FIELD-064",
    domain: "Routes",
    label: "Revalidation triggers",
    publicRequired: false,
  },
  {
    id: "FIELD-065",
    domain: "Routes",
    label: "Route ownership",
    publicRequired: true,
  },
  {
    id: "FIELD-066",
    domain: "Artifacts",
    label: "Published artifact IDs",
    publicRequired: true,
  },
  {
    id: "FIELD-067",
    domain: "Artifacts",
    label: "Artifact determinations",
    publicRequired: false,
  },
  {
    id: "FIELD-068",
    domain: "Artifacts",
    label: "Execution receipt states",
    publicRequired: true,
  },
  {
    id: "FIELD-069",
    domain: "Artifacts",
    label: "Outcome closure levels",
    publicRequired: true,
  },
  {
    id: "FIELD-070",
    domain: "Artifacts",
    label: "Challenge links",
    publicRequired: false,
  },
  {
    id: "FIELD-071",
    domain: "Verification",
    label: "Current verification level",
    publicRequired: true,
  },
  {
    id: "FIELD-072",
    domain: "Verification",
    label: "Signature status",
    publicRequired: true,
  },
  {
    id: "FIELD-073",
    domain: "Verification",
    label: "Record parity status",
    publicRequired: false,
  },
  {
    id: "FIELD-074",
    domain: "Verification",
    label: "Execution-effect status",
    publicRequired: true,
  },
  {
    id: "FIELD-075",
    domain: "Verification",
    label: "Independent review status",
    publicRequired: true,
  },
  {
    id: "FIELD-076",
    domain: "Reliance",
    label: "Permitted reliance uses",
    publicRequired: false,
  },
  {
    id: "FIELD-077",
    domain: "Reliance",
    label: "Prohibited reliance uses",
    publicRequired: true,
  },
  {
    id: "FIELD-078",
    domain: "Reliance",
    label: "Open challenge impact",
    publicRequired: true,
  },
  {
    id: "FIELD-079",
    domain: "Reliance",
    label: "Supersession impact",
    publicRequired: false,
  },
  {
    id: "FIELD-080",
    domain: "Reliance",
    label: "Withdrawal status",
    publicRequired: true,
  },
  {
    id: "FIELD-081",
    domain: "Identity",
    label: "Stable governance registration ID",
    publicRequired: true,
  },
  {
    id: "FIELD-082",
    domain: "Identity",
    label: "Legal or institutional organization name",
    publicRequired: false,
  },
  {
    id: "FIELD-083",
    domain: "Identity",
    label: "Public operating name",
    publicRequired: true,
  },
  {
    id: "FIELD-084",
    domain: "Identity",
    label: "Accountable owner",
    publicRequired: true,
  },
  {
    id: "FIELD-085",
    domain: "Identity",
    label: "Registry steward",
    publicRequired: false,
  },
  {
    id: "FIELD-086",
    domain: "Architecture",
    label: "Architecture name",
    publicRequired: true,
  },
  {
    id: "FIELD-087",
    domain: "Architecture",
    label: "Architecture version",
    publicRequired: true,
  },
  {
    id: "FIELD-088",
    domain: "Architecture",
    label: "Architecture hash",
    publicRequired: false,
  },
  {
    id: "FIELD-089",
    domain: "Architecture",
    label: "Effective date",
    publicRequired: true,
  },
  {
    id: "FIELD-090",
    domain: "Architecture",
    label: "Superseded version link",
    publicRequired: true,
  },
  {
    id: "FIELD-091",
    domain: "Scope",
    label: "Supported sectors",
    publicRequired: false,
  },
  {
    id: "FIELD-092",
    domain: "Scope",
    label: "Supported jurisdictions",
    publicRequired: true,
  },
  {
    id: "FIELD-093",
    domain: "Scope",
    label: "Consequence classes",
    publicRequired: true,
  },
  {
    id: "FIELD-094",
    domain: "Scope",
    label: "Approved execution adapters",
    publicRequired: false,
  },
  {
    id: "FIELD-095",
    domain: "Scope",
    label: "Declared exclusions",
    publicRequired: true,
  },
  {
    id: "FIELD-096",
    domain: "Claims",
    label: "Published capability claims",
    publicRequired: true,
  },
  {
    id: "FIELD-097",
    domain: "Claims",
    label: "Explicit non-claims",
    publicRequired: false,
  },
  {
    id: "FIELD-098",
    domain: "Claims",
    label: "Claims-boundary statement",
    publicRequired: true,
  },
  {
    id: "FIELD-099",
    domain: "Claims",
    label: "Evidence supporting each claim",
    publicRequired: true,
  },
  {
    id: "FIELD-100",
    domain: "Claims",
    label: "Correction status",
    publicRequired: false,
  },
  {
    id: "FIELD-101",
    domain: "Routes",
    label: "Registered route IDs",
    publicRequired: true,
  },
  {
    id: "FIELD-102",
    domain: "Routes",
    label: "Route versions",
    publicRequired: true,
  },
  {
    id: "FIELD-103",
    domain: "Routes",
    label: "Route publication states",
    publicRequired: false,
  },
  {
    id: "FIELD-104",
    domain: "Routes",
    label: "Revalidation triggers",
    publicRequired: true,
  },
  {
    id: "FIELD-105",
    domain: "Routes",
    label: "Route ownership",
    publicRequired: true,
  },
  {
    id: "FIELD-106",
    domain: "Artifacts",
    label: "Published artifact IDs",
    publicRequired: false,
  },
  {
    id: "FIELD-107",
    domain: "Artifacts",
    label: "Artifact determinations",
    publicRequired: true,
  },
  {
    id: "FIELD-108",
    domain: "Artifacts",
    label: "Execution receipt states",
    publicRequired: true,
  },
  {
    id: "FIELD-109",
    domain: "Artifacts",
    label: "Outcome closure levels",
    publicRequired: false,
  },
  {
    id: "FIELD-110",
    domain: "Artifacts",
    label: "Challenge links",
    publicRequired: true,
  },
  {
    id: "FIELD-111",
    domain: "Verification",
    label: "Current verification level",
    publicRequired: true,
  },
  {
    id: "FIELD-112",
    domain: "Verification",
    label: "Signature status",
    publicRequired: false,
  },
  {
    id: "FIELD-113",
    domain: "Verification",
    label: "Record parity status",
    publicRequired: true,
  },
  {
    id: "FIELD-114",
    domain: "Verification",
    label: "Execution-effect status",
    publicRequired: true,
  },
  {
    id: "FIELD-115",
    domain: "Verification",
    label: "Independent review status",
    publicRequired: false,
  },
  {
    id: "FIELD-116",
    domain: "Reliance",
    label: "Permitted reliance uses",
    publicRequired: true,
  },
  {
    id: "FIELD-117",
    domain: "Reliance",
    label: "Prohibited reliance uses",
    publicRequired: true,
  },
  {
    id: "FIELD-118",
    domain: "Reliance",
    label: "Open challenge impact",
    publicRequired: false,
  },
  {
    id: "FIELD-119",
    domain: "Reliance",
    label: "Supersession impact",
    publicRequired: true,
  },
  {
    id: "FIELD-120",
    domain: "Reliance",
    label: "Withdrawal status",
    publicRequired: true,
  },
] as const;

type DirectoryReviewQuestion = {
  id: string;
  topic: string;
  question: string;
  required: boolean;
};

const DIRECTORY_REVIEW_QUESTIONS: DirectoryReviewQuestion[] = [
  {
    id: "Q-001",
    topic: "Identity",
    question: "What evidence connects this public profile to the accountable legal or institutional owner?",
    required: false,
  },
  {
    id: "Q-002",
    topic: "Architecture",
    question: "Which versioned architecture is represented, and how are later changes distinguished?",
    required: true,
  },
  {
    id: "Q-003",
    topic: "Claims",
    question: "Which public claims are supported by registered execution artifacts rather than registration alone?",
    required: true,
  },
  {
    id: "Q-004",
    topic: "Limits",
    question: "What does the governance explicitly decline to claim, certify, or authorize?",
    required: true,
  },
  {
    id: "Q-005",
    topic: "Scope",
    question: "Are the declared sectors, jurisdictions, actions, and consequence classes bounded and inspectable?",
    required: false,
  },
  {
    id: "Q-006",
    topic: "Routes",
    question: "Do published routes correspond to the architecture version shown in the registration?",
    required: true,
  },
  {
    id: "Q-007",
    topic: "Artifacts",
    question: "Do artifact IDs resolve to bounded records with determinations, receipts, outcomes, and integrity commitments?",
    required: true,
  },
  {
    id: "Q-008",
    topic: "Verification",
    question: "What is the highest achieved verification level, and what reliance does that level support?",
    required: true,
  },
  {
    id: "Q-009",
    topic: "Challenges",
    question: "Are open challenges, corrections, and supersessions visible without erasing original history?",
    required: false,
  },
  {
    id: "Q-010",
    topic: "Ownership",
    question: "Does the submitter remain authorized to act for the registered governance profile?",
    required: true,
  },
  {
    id: "Q-011",
    topic: "Identity",
    question: "What evidence connects this public profile to the accountable legal or institutional owner?",
    required: true,
  },
  {
    id: "Q-012",
    topic: "Architecture",
    question: "Which versioned architecture is represented, and how are later changes distinguished?",
    required: true,
  },
  {
    id: "Q-013",
    topic: "Claims",
    question: "Which public claims are supported by registered execution artifacts rather than registration alone?",
    required: false,
  },
  {
    id: "Q-014",
    topic: "Limits",
    question: "What does the governance explicitly decline to claim, certify, or authorize?",
    required: true,
  },
  {
    id: "Q-015",
    topic: "Scope",
    question: "Are the declared sectors, jurisdictions, actions, and consequence classes bounded and inspectable?",
    required: true,
  },
  {
    id: "Q-016",
    topic: "Routes",
    question: "Do published routes correspond to the architecture version shown in the registration?",
    required: true,
  },
  {
    id: "Q-017",
    topic: "Artifacts",
    question: "Do artifact IDs resolve to bounded records with determinations, receipts, outcomes, and integrity commitments?",
    required: false,
  },
  {
    id: "Q-018",
    topic: "Verification",
    question: "What is the highest achieved verification level, and what reliance does that level support?",
    required: true,
  },
  {
    id: "Q-019",
    topic: "Challenges",
    question: "Are open challenges, corrections, and supersessions visible without erasing original history?",
    required: true,
  },
  {
    id: "Q-020",
    topic: "Ownership",
    question: "Does the submitter remain authorized to act for the registered governance profile?",
    required: true,
  },
  {
    id: "Q-021",
    topic: "Identity",
    question: "What evidence connects this public profile to the accountable legal or institutional owner?",
    required: false,
  },
  {
    id: "Q-022",
    topic: "Architecture",
    question: "Which versioned architecture is represented, and how are later changes distinguished?",
    required: true,
  },
  {
    id: "Q-023",
    topic: "Claims",
    question: "Which public claims are supported by registered execution artifacts rather than registration alone?",
    required: true,
  },
  {
    id: "Q-024",
    topic: "Limits",
    question: "What does the governance explicitly decline to claim, certify, or authorize?",
    required: true,
  },
  {
    id: "Q-025",
    topic: "Scope",
    question: "Are the declared sectors, jurisdictions, actions, and consequence classes bounded and inspectable?",
    required: false,
  },
  {
    id: "Q-026",
    topic: "Routes",
    question: "Do published routes correspond to the architecture version shown in the registration?",
    required: true,
  },
  {
    id: "Q-027",
    topic: "Artifacts",
    question: "Do artifact IDs resolve to bounded records with determinations, receipts, outcomes, and integrity commitments?",
    required: true,
  },
  {
    id: "Q-028",
    topic: "Verification",
    question: "What is the highest achieved verification level, and what reliance does that level support?",
    required: true,
  },
  {
    id: "Q-029",
    topic: "Challenges",
    question: "Are open challenges, corrections, and supersessions visible without erasing original history?",
    required: false,
  },
  {
    id: "Q-030",
    topic: "Ownership",
    question: "Does the submitter remain authorized to act for the registered governance profile?",
    required: true,
  },
  {
    id: "Q-031",
    topic: "Identity",
    question: "What evidence connects this public profile to the accountable legal or institutional owner?",
    required: true,
  },
  {
    id: "Q-032",
    topic: "Architecture",
    question: "Which versioned architecture is represented, and how are later changes distinguished?",
    required: true,
  },
  {
    id: "Q-033",
    topic: "Claims",
    question: "Which public claims are supported by registered execution artifacts rather than registration alone?",
    required: false,
  },
  {
    id: "Q-034",
    topic: "Limits",
    question: "What does the governance explicitly decline to claim, certify, or authorize?",
    required: true,
  },
  {
    id: "Q-035",
    topic: "Scope",
    question: "Are the declared sectors, jurisdictions, actions, and consequence classes bounded and inspectable?",
    required: true,
  },
  {
    id: "Q-036",
    topic: "Routes",
    question: "Do published routes correspond to the architecture version shown in the registration?",
    required: true,
  },
  {
    id: "Q-037",
    topic: "Artifacts",
    question: "Do artifact IDs resolve to bounded records with determinations, receipts, outcomes, and integrity commitments?",
    required: false,
  },
  {
    id: "Q-038",
    topic: "Verification",
    question: "What is the highest achieved verification level, and what reliance does that level support?",
    required: true,
  },
  {
    id: "Q-039",
    topic: "Challenges",
    question: "Are open challenges, corrections, and supersessions visible without erasing original history?",
    required: true,
  },
  {
    id: "Q-040",
    topic: "Ownership",
    question: "Does the submitter remain authorized to act for the registered governance profile?",
    required: true,
  },
  {
    id: "Q-041",
    topic: "Identity",
    question: "What evidence connects this public profile to the accountable legal or institutional owner?",
    required: false,
  },
  {
    id: "Q-042",
    topic: "Architecture",
    question: "Which versioned architecture is represented, and how are later changes distinguished?",
    required: true,
  },
  {
    id: "Q-043",
    topic: "Claims",
    question: "Which public claims are supported by registered execution artifacts rather than registration alone?",
    required: true,
  },
  {
    id: "Q-044",
    topic: "Limits",
    question: "What does the governance explicitly decline to claim, certify, or authorize?",
    required: true,
  },
  {
    id: "Q-045",
    topic: "Scope",
    question: "Are the declared sectors, jurisdictions, actions, and consequence classes bounded and inspectable?",
    required: false,
  },
  {
    id: "Q-046",
    topic: "Routes",
    question: "Do published routes correspond to the architecture version shown in the registration?",
    required: true,
  },
  {
    id: "Q-047",
    topic: "Artifacts",
    question: "Do artifact IDs resolve to bounded records with determinations, receipts, outcomes, and integrity commitments?",
    required: true,
  },
  {
    id: "Q-048",
    topic: "Verification",
    question: "What is the highest achieved verification level, and what reliance does that level support?",
    required: true,
  },
  {
    id: "Q-049",
    topic: "Challenges",
    question: "Are open challenges, corrections, and supersessions visible without erasing original history?",
    required: false,
  },
  {
    id: "Q-050",
    topic: "Ownership",
    question: "Does the submitter remain authorized to act for the registered governance profile?",
    required: true,
  },
  {
    id: "Q-051",
    topic: "Identity",
    question: "What evidence connects this public profile to the accountable legal or institutional owner?",
    required: true,
  },
  {
    id: "Q-052",
    topic: "Architecture",
    question: "Which versioned architecture is represented, and how are later changes distinguished?",
    required: true,
  },
  {
    id: "Q-053",
    topic: "Claims",
    question: "Which public claims are supported by registered execution artifacts rather than registration alone?",
    required: false,
  },
  {
    id: "Q-054",
    topic: "Limits",
    question: "What does the governance explicitly decline to claim, certify, or authorize?",
    required: true,
  },
  {
    id: "Q-055",
    topic: "Scope",
    question: "Are the declared sectors, jurisdictions, actions, and consequence classes bounded and inspectable?",
    required: true,
  },
  {
    id: "Q-056",
    topic: "Routes",
    question: "Do published routes correspond to the architecture version shown in the registration?",
    required: true,
  },
  {
    id: "Q-057",
    topic: "Artifacts",
    question: "Do artifact IDs resolve to bounded records with determinations, receipts, outcomes, and integrity commitments?",
    required: false,
  },
  {
    id: "Q-058",
    topic: "Verification",
    question: "What is the highest achieved verification level, and what reliance does that level support?",
    required: true,
  },
  {
    id: "Q-059",
    topic: "Challenges",
    question: "Are open challenges, corrections, and supersessions visible without erasing original history?",
    required: true,
  },
  {
    id: "Q-060",
    topic: "Ownership",
    question: "Does the submitter remain authorized to act for the registered governance profile?",
    required: true,
  },
  {
    id: "Q-061",
    topic: "Identity",
    question: "What evidence connects this public profile to the accountable legal or institutional owner?",
    required: false,
  },
  {
    id: "Q-062",
    topic: "Architecture",
    question: "Which versioned architecture is represented, and how are later changes distinguished?",
    required: true,
  },
  {
    id: "Q-063",
    topic: "Claims",
    question: "Which public claims are supported by registered execution artifacts rather than registration alone?",
    required: true,
  },
  {
    id: "Q-064",
    topic: "Limits",
    question: "What does the governance explicitly decline to claim, certify, or authorize?",
    required: true,
  },
  {
    id: "Q-065",
    topic: "Scope",
    question: "Are the declared sectors, jurisdictions, actions, and consequence classes bounded and inspectable?",
    required: false,
  },
  {
    id: "Q-066",
    topic: "Routes",
    question: "Do published routes correspond to the architecture version shown in the registration?",
    required: true,
  },
  {
    id: "Q-067",
    topic: "Artifacts",
    question: "Do artifact IDs resolve to bounded records with determinations, receipts, outcomes, and integrity commitments?",
    required: true,
  },
  {
    id: "Q-068",
    topic: "Verification",
    question: "What is the highest achieved verification level, and what reliance does that level support?",
    required: true,
  },
  {
    id: "Q-069",
    topic: "Challenges",
    question: "Are open challenges, corrections, and supersessions visible without erasing original history?",
    required: false,
  },
  {
    id: "Q-070",
    topic: "Ownership",
    question: "Does the submitter remain authorized to act for the registered governance profile?",
    required: true,
  },
  {
    id: "Q-071",
    topic: "Identity",
    question: "What evidence connects this public profile to the accountable legal or institutional owner?",
    required: true,
  },
  {
    id: "Q-072",
    topic: "Architecture",
    question: "Which versioned architecture is represented, and how are later changes distinguished?",
    required: true,
  },
  {
    id: "Q-073",
    topic: "Claims",
    question: "Which public claims are supported by registered execution artifacts rather than registration alone?",
    required: false,
  },
  {
    id: "Q-074",
    topic: "Limits",
    question: "What does the governance explicitly decline to claim, certify, or authorize?",
    required: true,
  },
  {
    id: "Q-075",
    topic: "Scope",
    question: "Are the declared sectors, jurisdictions, actions, and consequence classes bounded and inspectable?",
    required: true,
  },
  {
    id: "Q-076",
    topic: "Routes",
    question: "Do published routes correspond to the architecture version shown in the registration?",
    required: true,
  },
  {
    id: "Q-077",
    topic: "Artifacts",
    question: "Do artifact IDs resolve to bounded records with determinations, receipts, outcomes, and integrity commitments?",
    required: false,
  },
  {
    id: "Q-078",
    topic: "Verification",
    question: "What is the highest achieved verification level, and what reliance does that level support?",
    required: true,
  },
  {
    id: "Q-079",
    topic: "Challenges",
    question: "Are open challenges, corrections, and supersessions visible without erasing original history?",
    required: true,
  },
  {
    id: "Q-080",
    topic: "Ownership",
    question: "Does the submitter remain authorized to act for the registered governance profile?",
    required: true,
  },
  {
    id: "Q-081",
    topic: "Identity",
    question: "What evidence connects this public profile to the accountable legal or institutional owner?",
    required: false,
  },
  {
    id: "Q-082",
    topic: "Architecture",
    question: "Which versioned architecture is represented, and how are later changes distinguished?",
    required: true,
  },
  {
    id: "Q-083",
    topic: "Claims",
    question: "Which public claims are supported by registered execution artifacts rather than registration alone?",
    required: true,
  },
  {
    id: "Q-084",
    topic: "Limits",
    question: "What does the governance explicitly decline to claim, certify, or authorize?",
    required: true,
  },
  {
    id: "Q-085",
    topic: "Scope",
    question: "Are the declared sectors, jurisdictions, actions, and consequence classes bounded and inspectable?",
    required: false,
  },
  {
    id: "Q-086",
    topic: "Routes",
    question: "Do published routes correspond to the architecture version shown in the registration?",
    required: true,
  },
  {
    id: "Q-087",
    topic: "Artifacts",
    question: "Do artifact IDs resolve to bounded records with determinations, receipts, outcomes, and integrity commitments?",
    required: true,
  },
  {
    id: "Q-088",
    topic: "Verification",
    question: "What is the highest achieved verification level, and what reliance does that level support?",
    required: true,
  },
  {
    id: "Q-089",
    topic: "Challenges",
    question: "Are open challenges, corrections, and supersessions visible without erasing original history?",
    required: false,
  },
  {
    id: "Q-090",
    topic: "Ownership",
    question: "Does the submitter remain authorized to act for the registered governance profile?",
    required: true,
  },
  {
    id: "Q-091",
    topic: "Identity",
    question: "What evidence connects this public profile to the accountable legal or institutional owner?",
    required: true,
  },
  {
    id: "Q-092",
    topic: "Architecture",
    question: "Which versioned architecture is represented, and how are later changes distinguished?",
    required: true,
  },
  {
    id: "Q-093",
    topic: "Claims",
    question: "Which public claims are supported by registered execution artifacts rather than registration alone?",
    required: false,
  },
  {
    id: "Q-094",
    topic: "Limits",
    question: "What does the governance explicitly decline to claim, certify, or authorize?",
    required: true,
  },
  {
    id: "Q-095",
    topic: "Scope",
    question: "Are the declared sectors, jurisdictions, actions, and consequence classes bounded and inspectable?",
    required: true,
  },
  {
    id: "Q-096",
    topic: "Routes",
    question: "Do published routes correspond to the architecture version shown in the registration?",
    required: true,
  },
  {
    id: "Q-097",
    topic: "Artifacts",
    question: "Do artifact IDs resolve to bounded records with determinations, receipts, outcomes, and integrity commitments?",
    required: false,
  },
  {
    id: "Q-098",
    topic: "Verification",
    question: "What is the highest achieved verification level, and what reliance does that level support?",
    required: true,
  },
  {
    id: "Q-099",
    topic: "Challenges",
    question: "Are open challenges, corrections, and supersessions visible without erasing original history?",
    required: true,
  },
  {
    id: "Q-100",
    topic: "Ownership",
    question: "Does the submitter remain authorized to act for the registered governance profile?",
    required: true,
  },
];

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}


function isDemonstration(record: GovernanceRecord) {
  return record.recordKind === "DEMONSTRATION";
}

function toneForRegistration(status: RegistrationStatus): BadgeTone {
  if (status === "PUBLISHED") return "green";
  if (status === "IN_REVIEW") return "amber";
  if (status === "CORRECTED") return "cyan";
  return "violet";
}

function toneForAssurance(status: AssuranceStatus): BadgeTone {
  if (status === "VERIFIED") return "green";
  if (status === "REVIEWED") return "cyan";
  return "slate";
}

function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={cx("badge", `badge-${tone}`)}>{children}</span>;
}

function Metric({ label, value, note }: EvidenceMetric) {
  return (
    <article className="metric-card">
      <div className="metric-value">{value.toLocaleString()}</div>
      <div className="metric-label">{label}</div>
      <p>{note}</p>
    </article>
  );
}

function VerificationRail({ level }: { level: number }) {
  return (
    <div className="verification-rail" aria-label={`Verification level ${level} of 7`}>
      {VERIFICATION_LEVELS.map((name, index) => (
        <div className={cx("verification-node", index <= level && "active")} key={name} title={`${index} — ${name}`}>
          <span>{index}</span>
        </div>
      ))}
    </div>
  );
}

function GovernanceCard({ record, selected, onSelect }: { record: GovernanceRecord; selected: boolean; onSelect: () => void }) {
  return (
    <button className={cx("governance-card", selected && "selected")} onClick={onSelect} type="button">
      <div className="card-topline">
        <span className="registry-id">{record.id}</span>
        <Badge tone={isDemonstration(record) ? "amber" : toneForRegistration(record.registrationStatus)}>{isDemonstration(record) ? "DEMONSTRATION" : record.registrationStatus.replaceAll("_", " ")}</Badge>
      </div>
      {isDemonstration(record) && <div className="demo-banner">Synthetic example · not a registered entity</div>}
      <div className="card-emblem" aria-hidden="true">{record.organization.split(" ").map((word) => word[0]).slice(0, 2).join("")}</div>
      <h3>{record.organization}</h3>
      <p className="architecture-name">{record.architecture} · v{record.version}</p>
      <p className="card-claim">{record.claim}</p>
      <div className="card-stat-grid">
        <span><strong>{record.routes}</strong> routes</span>
        <span><strong>{record.artifacts}</strong> artifacts</span>
        <span><strong>L{record.verificationLevel}</strong> verification</span>
      </div>
      <VerificationRail level={record.verificationLevel} />
      <div className="card-footer">
        <Badge tone={isDemonstration(record) ? "slate" : toneForAssurance(record.assurance)}>{isDemonstration(record) ? `SIMULATED ${record.assurance}` : record.assurance}</Badge>
        <span>{record.jurisdiction}</span>
      </div>
    </button>
  );
}

function ProfilePanel({ record }: { record: GovernanceRecord }) {
  const distribution: Array<[Determination, number]> = [
    ["ALLOW", Math.max(1, Math.floor(record.artifacts * 0.34))],
    ["HOLD", Math.max(1, Math.floor(record.artifacts * 0.24))],
    ["DENY", Math.max(1, Math.floor(record.artifacts * 0.22))],
    ["ESCALATE", Math.max(1, record.artifacts - Math.floor(record.artifacts * 0.34) - Math.floor(record.artifacts * 0.24) - Math.floor(record.artifacts * 0.22))],
  ];

  return (
    <aside className="profile-panel" id="profile-inspector">
      <div className="profile-glow" aria-hidden="true" />
      <div className="profile-heading">
        <div>
          <span className="eyebrow">{isDemonstration(record) ? "Demonstration governance profile" : "Registered governance profile"}</span>
          <h2>{record.organization}</h2>
          <p>{record.architecture} · Version {record.version}</p>
        </div>
        <div className="profile-seal">L{record.verificationLevel}</div>
      </div>

      <div className="profile-status-row">
        {isDemonstration(record) && <Badge tone="amber">DEMONSTRATION · NOT A REGISTERED ENTITY</Badge>}
        <Badge tone={isDemonstration(record) ? "slate" : toneForRegistration(record.registrationStatus)}>{isDemonstration(record) ? `SIMULATED ${record.registrationStatus.replaceAll("_", " ")}` : record.registrationStatus.replaceAll("_", " ")}</Badge>
        <Badge tone={isDemonstration(record) ? "slate" : toneForAssurance(record.assurance)}>{isDemonstration(record) ? `SIMULATED ${record.assurance}` : record.assurance}</Badge>
        <Badge tone="gold">{record.id}</Badge>
      </div>

      {isDemonstration(record) && (
        <section className="demo-disclosure">
          <strong>Demonstration disclosure</strong>
          <p>This is a synthetic profile created to demonstrate directory behavior, evidence states, verification levels, and challenge history. It does not identify a real registered organization, real architecture owner, or real portfolio of routes and artifacts.</p>
        </section>
      )}

      <section className="profile-section">
        <span className="section-label">Public claim</span>
        <p className="profile-claim">{record.claim}</p>
      </section>

      <section className="profile-section limitation-box">
        <span className="section-label">Declared limitation</span>
        <p>{record.limitation}</p>
      </section>

      <div className="profile-facts">
        <div><span>Accountable owner</span><strong>{record.accountableOwner}</strong></div>
        <div><span>Primary jurisdiction</span><strong>{record.jurisdiction}</strong></div>
        <div><span>Governance category</span><strong>{record.category}</strong></div>
        <div><span>Open challenges</span><strong>{record.challenges}</strong></div>
      </div>

      <section className="profile-section">
        <div className="section-heading-row"><span className="section-label">Verification ladder</span><strong>Level {record.verificationLevel} of 7</strong></div>
        <VerificationRail level={record.verificationLevel} />
        <p className="microcopy">{isDemonstration(record) ? `Simulated ${VERIFICATION_LEVELS[record.verificationLevel].toLowerCase()} is the highest example state represented for this synthetic profile.` : `${VERIFICATION_LEVELS[record.verificationLevel]} is the highest represented verification state for this institutional profile.`}</p>
      </section>

      <section className="profile-section">
        <span className="section-label">Execution artifact distribution</span>
        <div className="determination-grid">
          {distribution.map(([determination, count]) => (
            <div className="determination-item" key={determination}>
              <Badge tone={DETERMINATION_PALETTE[determination].tone}>{determination}</Badge>
              <strong>{count}</strong>
              <small>{DETERMINATION_PALETTE[determination].description}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="profile-section">
        <span className="section-label">Supported sectors</span>
        <div className="chip-row">{record.sectors.map((sector) => <span className="chip" key={sector}>{sector}</span>)}</div>
      </section>

      <section className="profile-section">
        <span className="section-label">Declared jurisdictions</span>
        <div className="chip-row">{record.jurisdictions.map((jurisdiction) => <span className="chip muted" key={jurisdiction}>{jurisdiction}</span>)}</div>
      </section>

      <div className="profile-actions">
        <Link className="button primary" href="/artifacts">Inspect artifact portfolio</Link>
        <Link className="button secondary" href="/artifacts/verify">Open verification center</Link>
      </div>
    </aside>
  );
}

export default function GovernanceDirectoryPage() {
  const [view, setView] = useState<DirectoryView>("directory");
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("ALL");
  const [jurisdiction, setJurisdiction] = useState("ALL");
  const [assurance, setAssurance] = useState("ALL");
  const [sort, setSort] = useState<SortMode>("evidence");
  const [selectedId, setSelectedId] = useState(GOVERNANCES[0].id);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("ta14-governance-directory-bookmarks");
      if (stored) setBookmarks(JSON.parse(stored) as string[]);
    } catch {
      setBookmarks([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("ta14-governance-directory-bookmarks", JSON.stringify(bookmarks));
    } catch {
      // Directory remains usable when local storage is unavailable.
    }
  }, [bookmarks]);

  const sectors = useMemo(() => Array.from(new Set(GOVERNANCES.flatMap((record) => record.sectors))).sort(), []);
  const jurisdictions = useMemo(() => Array.from(new Set(GOVERNANCES.flatMap((record) => record.jurisdictions))).sort(), []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const rows = GOVERNANCES.filter((record) => {
      const matchesQuery = !normalized || [record.id, record.organization, record.architecture, record.category, record.claim, record.accountableOwner, ...record.sectors, ...record.jurisdictions].join(" ").toLowerCase().includes(normalized);
      const matchesSector = sector === "ALL" || record.sectors.includes(sector);
      const matchesJurisdiction = jurisdiction === "ALL" || record.jurisdictions.includes(jurisdiction);
      const matchesAssurance = assurance === "ALL" || record.assurance === assurance;
      return matchesQuery && matchesSector && matchesJurisdiction && matchesAssurance;
    });

    return [...rows].sort((a, b) => {
      if (sort === "name") return a.organization.localeCompare(b.organization);
      if (sort === "artifacts") return b.artifacts - a.artifacts;
      if (sort === "verification") return b.verificationLevel - a.verificationLevel;
      return (b.artifacts * 10 + b.verificationLevel * 20 - b.challenges * 2) - (a.artifacts * 10 + a.verificationLevel * 20 - a.challenges * 2);
    });
  }, [assurance, jurisdiction, query, sector, sort]);

  const selected = GOVERNANCES.find((record) => record.id === selectedId) ?? GOVERNANCES[0];

  function choose(record: GovernanceRecord) {
    setSelectedId(record.id);
    setView("profile");
    window.setTimeout(() => document.getElementById("profile-inspector")?.scrollIntoView({ behavior: "smooth", block: "start" }), 20);
  }

  function toggleBookmark(id: string) {
    setBookmarks((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function resetFilters() {
    setQuery("");
    setSector("ALL");
    setJurisdiction("ALL");
    setAssurance("ALL");
    setSort("evidence");
  }

  return (
    <main className="directory-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="grid-field" aria-hidden="true" />

      <header className="hero">
        <nav className="top-nav" aria-label="Governance directory navigation">
          <Link className="brand" href="/"><span className="brand-mark">TA</span><span><strong>TA-14</strong><small>AI Governance Exchange</small></span></Link>
          <div className="top-links">
            <Link href="/governance/register">Register governance</Link>
            <Link href="/governance/workspace">Governance workspace</Link>
            <Link href="/artifacts">Execution artifacts</Link>
          </div>
        </nav>

        <div className="hero-layout">
          <section className="hero-copy">
            <span className="eyebrow">Public institutional directory</span>
            <h1>Registered governance and clearly labeled demonstrations, connected to evidence.</h1>
            <p className="hero-lead">Inspect the current institutional registration separately from synthetic demonstration profiles. Follow each record into its declared scope, limitations, governed routes, execution artifacts, verification states, and challenge history without confusing examples with real registrations.</p>
            <div className="hero-actions">
              <a className="button primary" href="#directory">Explore governance records</a>
              <Link className="button secondary" href="/governance/register">Register your governance</Link>
            </div>
            <div className="governing-rule"><span>No registered governance.</span><strong>No registered artifact.</strong></div>
          </section>

          <section className="hero-core" aria-label="Directory evidence core">
            <div className="core-orbit orbit-a" />
            <div className="core-orbit orbit-b" />
            <div className="core-center"><span>GOV</span><strong>DIRECTORY</strong><small>Attribution → Evidence → Reliance</small></div>
            <div className="core-node node-one">REGISTER</div>
            <div className="core-node node-two">BUILD</div>
            <div className="core-node node-three">PROVE</div>
            <div className="core-node node-four">VERIFY</div>
          </section>
        </div>

        <div className="metrics-grid">
          {EVIDENCE_METRICS.map((metric) => <Metric key={metric.label} {...metric} />)}
        </div>
      </header>

      <section className="command-bar">
        <div className="view-tabs" role="tablist" aria-label="Directory views">
          {(["directory", "profile", "evidence", "method"] as DirectoryView[]).map((item) => (
            <button className={cx("view-tab", view === item && "active")} key={item} onClick={() => setView(item)} type="button">{item}</button>
          ))}
        </div>
        <div className="command-actions">
          <span>{filtered.length} profiles visible · {filtered.filter((record) => !isDemonstration(record)).length} institutional</span>
          <span>{bookmarks.length} bookmarked</span>
        </div>
      </section>

      <section className="directory-workspace" id="directory">
        <div className="directory-main">
          <div className="section-intro">
            <div><span className="eyebrow">Governance directory</span><h2>Inspect the organization, then inspect the evidence.</h2></div>
            <p>Institutional records and synthetic demonstrations are separated visibly. Profiles describe identity, architecture, scope, ownership, claims, and limitations; execution artifacts—not registration alone—support evidence-based reliance.</p>
          </div>

          <div className="directory-disclosure">
            <strong>Directory status disclosure</strong>
            <p>This launch directory contains {INSTITUTIONAL_RECORDS.length} institutional registration and {DEMONSTRATION_RECORDS.length} synthetic demonstration profiles. Demonstration records are not registered legal entities, do not represent outside organizations, and do not establish real artifact or route totals.</p>
          </div>

          <div className="filter-console">
            <label className="search-field"><span>Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Organization, registration ID, architecture, sector, claim…" /></label>
            <label><span>Sector</span><select value={sector} onChange={(event) => setSector(event.target.value)}><option value="ALL">All sectors</option>{sectors.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Jurisdiction</span><select value={jurisdiction} onChange={(event) => setJurisdiction(event.target.value)}><option value="ALL">All jurisdictions</option>{jurisdictions.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Assurance</span><select value={assurance} onChange={(event) => setAssurance(event.target.value)}><option value="ALL">All assurance states</option><option>VERIFIED</option><option>REVIEWED</option><option>DECLARED</option></select></label>
            <label><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}><option value="evidence">Evidence strength</option><option value="artifacts">Artifact count</option><option value="verification">Verification level</option><option value="name">Organization name</option></select></label>
            <button className="reset-button" onClick={resetFilters} type="button">Reset filters</button>
          </div>

          {view === "evidence" ? (
            <div className="evidence-board">
              {GOVERNANCES.map((record) => (
                <article className="evidence-row" key={record.id}>
                  <div><strong>{record.organization}</strong><span>{record.id}</span>{isDemonstration(record) && <Badge tone="amber">DEMONSTRATION</Badge>}</div>
                  <VerificationRail level={record.verificationLevel} />
                  <div className="evidence-counts"><span>{record.routes} routes</span><span>{record.artifacts} artifacts</span><span>{record.challenges} challenges</span></div>
                  <button type="button" onClick={() => choose(record)}>Inspect</button>
                </article>
              ))}
            </div>
          ) : view === "method" ? (
            <>
            <div className="method-grid">
              {DIRECTORY_PRINCIPLES.map(([title, description], index) => (
                <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>
              ))}
            </div>
              <div className="control-register">
                <div className="section-intro"><div><span className="eyebrow">Institutional controls</span><h2>Directory controls</h2></div><p>{DIRECTORY_CONTROLS.length} bounded controls govern attribution, evidence linkage, reliance, and public claims.</p></div>
                {DIRECTORY_CONTROLS.map((control) => <article className="control-row" key={control.id}><span>{control.id}</span><strong>{control.area}</strong><p>{control.requirement}</p><Badge tone={control.mandatory ? "gold" : "slate"}>{control.mandatory ? "MANDATORY" : "ADVISORY"}</Badge></article>)}
              </div>
              <div className="review-register">
                <div className="section-intro"><div><span className="eyebrow">Bounded inspection</span><h2>Directory review questions</h2></div><p>{DIRECTORY_REVIEW_QUESTIONS.length} questions help visitors distinguish registration, evidence, verification, and justified reliance.</p></div>
                {DIRECTORY_REVIEW_QUESTIONS.map((item) => (
                  <article className="review-row" key={item.id}>
                    <span>{item.id}</span>
                    <strong>{item.topic}</strong>
                    <p>{item.question}</p>
                    <Badge tone={item.required ? "cyan" : "slate"}>{item.required ? "REQUIRED" : "GUIDANCE"}</Badge>
                  </article>
                ))}
              </div>
              <div className="field-register">
                <div className="section-intro"><div><span className="eyebrow">Public profile schema</span><h2>Directory profile fields</h2></div><p>{DIRECTORY_PROFILE_FIELDS.length} bounded profile fields define what is attributable, inspectable, and eligible for public reliance.</p></div>
                <div className="field-grid">
                  {DIRECTORY_PROFILE_FIELDS.map((field) => (
                    <article className="field-card" key={field.id}>
                      <span>{field.id}</span>
                      <strong>{field.domain}</strong>
                      <p>{field.label}</p>
                      <Badge tone={field.publicRequired ? "green" : "slate"}>{field.publicRequired ? "PUBLIC" : "CONTROLLED"}</Badge>
                    </article>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="governance-grid">
              {filtered.map((record) => (
                <div className="card-wrap" key={record.id}>
                  <GovernanceCard record={record} selected={record.id === selected.id} onSelect={() => choose(record)} />
                  <button className={cx("bookmark", bookmarks.includes(record.id) && "active")} onClick={() => toggleBookmark(record.id)} type="button" aria-label={`${bookmarks.includes(record.id) ? "Remove" : "Add"} ${record.organization} bookmark`}>★</button>
                </div>
              ))}
              {filtered.length === 0 && <div className="empty-state"><strong>No governance profiles match these filters.</strong><p>Reset the filters or broaden your search.</p><button onClick={resetFilters} type="button">Show all profiles</button></div>}
            </div>
          )}
        </div>

        <ProfilePanel record={selected} />
      </section>

      <section className="proof-path">
        <div className="section-intro light"><div><span className="eyebrow">Evidence pathway</span><h2>A profile is the beginning—not the proof.</h2></div><p>Follow the governing architecture from registration into routes, execution artifacts, verification, and challenge.</p></div>
        <div className="path-grid">
          {[
            ["01", "Register governance", "Attribute the architecture, version, accountable owner, scope, claims, and explicit limits.", "/governance/register"],
            ["02", "Build governed routes", "Translate declared governance into versioned conditions, gates, authority, and execution boundaries.", "/workspace/artifacts/build"],
            ["03", "Produce execution artifacts", "Preserve determination, technical control effect, and outcome as bounded evidence.", "/artifacts/studio"],
            ["04", "Register and verify", "Publish the artifact under the registered governance and expose its justified reliance level.", "/artifacts/verify"],
            ["05", "Accept challenge", "Keep disputes, corrections, reversals, and prospective reliance visible and attributable.", "/artifacts/challenge"],
          ].map(([number, title, description, href]) => (
            <Link className="path-card" href={href} key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p><strong>Open →</strong></Link>
          ))}
        </div>
      </section>

      <section className="institutional-callout">
        <div><span className="eyebrow">Join the evidence standard</span><h2>You should not have to tell the market who you are. You should be able to prove it.</h2><p>Register your governance, declare its limits, build governed routes, produce bounded execution artifacts, and allow prospective customers, partners, researchers, and reviewers to inspect the evidence.</p></div>
        <div className="callout-actions"><Link className="button primary" href="/governance/register">Begin governance registration</Link><Link className="button secondary" href="/artifacts">Inspect founding artifacts</Link></div>
      </section>

      <footer className="directory-footer">
        <div><strong>TA-14 AI Governance Exchange</strong><span>Registered governance connected to execution evidence.</span></div>
        <div><Link href="/">Exchange</Link><Link href="/governance/register">Register</Link><Link href="/governance/workspace">Workspace</Link><Link href="/artifacts">Artifacts</Link><Link href="/artifacts/verify">Verify</Link></div>
        <p>No admissible evidence. No admissible execution.</p>
      </footer>

      <style jsx>{`

        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; background: #050914; }
        :global(body) { margin: 0; background: #050914; color: #f6f8ff; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        :global(a) { color: inherit; text-decoration: none; }
        :global(button), :global(input), :global(select) { font: inherit; }
        .directory-shell { min-height: 100vh; overflow: hidden; position: relative; background: radial-gradient(circle at 8% 8%, rgba(39, 213, 255, .14), transparent 24rem), radial-gradient(circle at 85% 12%, rgba(223, 179, 80, .14), transparent 29rem), linear-gradient(180deg, #050914 0%, #07101e 56%, #050914 100%); }
        .ambient { position: fixed; width: 34rem; height: 34rem; border-radius: 50%; filter: blur(110px); opacity: .22; pointer-events: none; z-index: 0; }
        .ambient-one { background: #1dcff3; top: -17rem; left: -12rem; }
        .ambient-two { background: #d7a82d; top: 14rem; right: -20rem; }
        .grid-field { position: fixed; inset: 0; opacity: .08; pointer-events: none; background-image: linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px); background-size: 44px 44px; mask-image: linear-gradient(to bottom, black, transparent 82%); }
        .hero, .command-bar, .directory-workspace, .proof-path, .institutional-callout, .directory-footer { position: relative; z-index: 1; }
        .hero { padding: 1.25rem clamp(1rem, 4vw, 4.8rem) 3rem; max-width: 1600px; margin: 0 auto; }
        .top-nav { display: flex; justify-content: space-between; align-items: center; padding: .7rem 0 2.7rem; gap: 1.5rem; }
        .brand { display: flex; align-items: center; gap: .85rem; }
        .brand-mark { width: 2.8rem; height: 2.8rem; border: 1px solid rgba(216,175,74,.7); display: grid; place-items: center; border-radius: .85rem; color: #e7c976; font-weight: 900; background: linear-gradient(145deg, rgba(216,175,74,.18), rgba(255,255,255,.02)); box-shadow: inset 0 0 22px rgba(216,175,74,.1); }
        .brand strong, .brand small { display: block; }
        .brand strong { letter-spacing: .16em; }
        .brand small { color: #8ea0b8; margin-top: .15rem; }
        .top-links { display: flex; gap: 1.4rem; color: #aebcd0; font-size: .9rem; }
        .top-links a:hover { color: #fff; }
        .hero-layout { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(360px, .8fr); gap: clamp(2rem, 5vw, 6rem); align-items: center; }
        .eyebrow { display: inline-flex; text-transform: uppercase; letter-spacing: .16em; font-weight: 800; font-size: .72rem; color: #55daf5; }
        .hero h1 { font-size: clamp(3rem, 6vw, 6.7rem); line-height: .91; margin: 1rem 0 1.35rem; max-width: 13ch; letter-spacing: -.065em; background: linear-gradient(135deg, #fff 30%, #bad9e7 70%, #dbb85d); -webkit-background-clip: text; color: transparent; }
        .hero-lead { color: #b4c0d3; font-size: clamp(1rem, 1.45vw, 1.24rem); max-width: 760px; line-height: 1.75; }
        .hero-actions, .callout-actions, .profile-actions { display: flex; gap: .8rem; flex-wrap: wrap; margin-top: 1.7rem; }
        .button { min-height: 3rem; display: inline-flex; align-items: center; justify-content: center; padding: .8rem 1.15rem; border-radius: .8rem; font-weight: 850; border: 1px solid rgba(255,255,255,.15); transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease; }
        .button:hover { transform: translateY(-2px); }
        .button.primary { color: #06101b; background: linear-gradient(135deg, #7be7fa, #d9b456); box-shadow: 0 16px 40px rgba(66,208,236,.16); }
        .button.secondary { background: rgba(255,255,255,.055); color: #eef5ff; }
        .governing-rule { margin-top: 2rem; display: flex; gap: .6rem; flex-wrap: wrap; color: #9aacbf; }
        .governing-rule strong { color: #e2bf63; }
        .hero-core { min-height: 510px; position: relative; display: grid; place-items: center; perspective: 900px; }
        .core-center { position: relative; z-index: 3; width: 210px; height: 210px; border-radius: 50%; display: grid; place-content: center; text-align: center; background: radial-gradient(circle at 35% 25%, rgba(102,229,250,.35), rgba(9,25,42,.95) 60%); border: 1px solid rgba(105,224,246,.6); box-shadow: 0 0 70px rgba(72,215,240,.22), inset 0 0 45px rgba(72,215,240,.1); }
        .core-center span { color: #69e6f9; letter-spacing: .3em; font-size: .72rem; }
        .core-center strong { font-size: 1.75rem; margin: .45rem 0; }
        .core-center small { color: #91a6bd; max-width: 150px; line-height: 1.4; }
        .core-orbit { position: absolute; border: 1px solid rgba(113,222,244,.28); border-radius: 50%; transform: rotateX(68deg); }
        .orbit-a { width: 420px; height: 420px; animation: orbit 16s linear infinite; }
        .orbit-b { width: 330px; height: 330px; border-color: rgba(219,180,81,.28); animation: orbitReverse 13s linear infinite; }
        .core-node { position: absolute; padding: .65rem .8rem; border-radius: .7rem; border: 1px solid rgba(255,255,255,.14); background: rgba(8,17,31,.9); color: #c8d5e5; font-size: .68rem; letter-spacing: .15em; box-shadow: 0 12px 35px rgba(0,0,0,.35); }
        .node-one { top: 14%; left: 13%; }.node-two { top: 18%; right: 8%; }.node-three { bottom: 18%; left: 10%; }.node-four { bottom: 12%; right: 16%; }
        @keyframes orbit { to { transform: rotateX(68deg) rotateZ(360deg); } }
        @keyframes orbitReverse { to { transform: rotateX(68deg) rotateZ(-360deg); } }
        .metrics-grid { margin-top: 3.4rem; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .9rem; }
        .metric-card { padding: 1.15rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,.11); background: linear-gradient(145deg, rgba(255,255,255,.07), rgba(255,255,255,.025)); box-shadow: 0 24px 55px rgba(0,0,0,.18); }
        .metric-value { font-size: 2rem; font-weight: 950; color: #fff; }.metric-label { color: #d8bd72; font-weight: 800; margin: .18rem 0 .4rem; }.metric-card p { margin: 0; color: #8798ad; line-height: 1.5; font-size: .82rem; }
        .command-bar { max-width: 1510px; margin: 0 auto; padding: .65rem clamp(1rem, 4vw, 3rem); min-height: 4.5rem; border: 1px solid rgba(255,255,255,.1); border-radius: 1rem 1rem 0 0; background: rgba(7,14,27,.88); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .view-tabs { display: flex; gap: .35rem; flex-wrap: wrap; }.view-tab { color: #91a2b7; border: 0; background: transparent; padding: .65rem .9rem; border-radius: .65rem; cursor: pointer; text-transform: capitalize; font-weight: 800; }.view-tab.active { color: #06101b; background: linear-gradient(135deg, #65ddf3, #d7b257); }
        .command-actions { display: flex; gap: 1rem; color: #8798ae; font-size: .82rem; }
        .directory-workspace { max-width: 1510px; margin: 0 auto 5rem; display: grid; grid-template-columns: minmax(0, 1fr) 410px; gap: 1rem; padding: 0 clamp(1rem, 4vw, 3rem) 3rem; background: rgba(4,9,18,.48); border-inline: 1px solid rgba(255,255,255,.07); border-bottom: 1px solid rgba(255,255,255,.07); }
        .directory-main { min-width: 0; padding-top: 2.2rem; }
        .section-intro { display: flex; justify-content: space-between; gap: 2rem; align-items: end; margin-bottom: 1.5rem; }.section-intro h2 { font-size: clamp(1.8rem, 3vw, 3rem); margin: .5rem 0 0; letter-spacing: -.04em; }.section-intro > p { max-width: 610px; color: #94a5ba; line-height: 1.65; margin: 0; }
        .filter-console { display: grid; grid-template-columns: 2fr repeat(4, minmax(120px, 1fr)) auto; gap: .6rem; padding: .9rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.035); margin-bottom: 1rem; }
        .filter-console label { display: grid; gap: .35rem; color: #8698ad; font-size: .72rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }.filter-console input, .filter-console select { width: 100%; min-height: 2.75rem; border: 1px solid rgba(255,255,255,.11); border-radius: .65rem; padding: .65rem .75rem; background: #08111f; color: #edf4ff; outline: none; }.filter-console input:focus, .filter-console select:focus { border-color: #4dd8f3; box-shadow: 0 0 0 3px rgba(77,216,243,.08); }
        .reset-button { align-self: end; min-height: 2.75rem; padding: .6rem .8rem; border-radius: .65rem; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.04); color: #c4d1df; cursor: pointer; }
        .governance-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .85rem; }
        .card-wrap { position: relative; }.governance-card { width: 100%; min-height: 385px; text-align: left; position: relative; overflow: hidden; padding: 1.15rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,.1); color: #edf4ff; background: linear-gradient(145deg, rgba(17,31,50,.9), rgba(6,13,25,.95)); cursor: pointer; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }.governance-card::before { content: ""; position: absolute; inset: -60% 30% auto -30%; height: 210px; transform: rotate(-12deg); background: linear-gradient(90deg, transparent, rgba(94,222,244,.1), transparent); }.governance-card:hover, .governance-card.selected { transform: translateY(-4px); border-color: rgba(91,219,244,.42); box-shadow: 0 26px 55px rgba(0,0,0,.3), 0 0 30px rgba(62,206,234,.07); }
        .card-topline, .card-footer, .section-heading-row { display: flex; justify-content: space-between; align-items: center; gap: .7rem; }.registry-id { color: #7edff1; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .74rem; }.card-emblem { margin: 1.25rem 0 .8rem; width: 3.3rem; height: 3.3rem; display: grid; place-items: center; border-radius: .9rem; border: 1px solid rgba(218,180,81,.44); color: #e5c66d; font-weight: 950; background: rgba(218,180,81,.07); }.governance-card h3 { font-size: 1.25rem; margin: 0; }.architecture-name { color: #92a5ba; margin: .45rem 0 .85rem; }.card-claim { color: #b9c5d4; line-height: 1.55; min-height: 4.8rem; }.card-stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .45rem; margin: 1rem 0; }.card-stat-grid span { padding: .55rem; border: 1px solid rgba(255,255,255,.08); border-radius: .55rem; color: #8496aa; font-size: .72rem; }.card-stat-grid strong { color: #fff; display: block; font-size: 1rem; }.card-footer { margin-top: 1rem; color: #7f91a7; font-size: .75rem; }
        .badge { display: inline-flex; align-items: center; min-height: 1.55rem; border-radius: 999px; padding: .25rem .55rem; font-size: .64rem; letter-spacing: .07em; font-weight: 900; border: 1px solid transparent; white-space: nowrap; }.badge-gold { color: #f0cf79; background: rgba(210,170,70,.11); border-color: rgba(210,170,70,.3); }.badge-cyan { color: #71e5f8; background: rgba(74,208,235,.1); border-color: rgba(74,208,235,.3); }.badge-green { color: #7cf4bc; background: rgba(65,219,150,.1); border-color: rgba(65,219,150,.28); }.badge-amber { color: #ffd37a; background: rgba(235,176,58,.1); border-color: rgba(235,176,58,.28); }.badge-red { color: #ff8f9b; background: rgba(239,83,101,.1); border-color: rgba(239,83,101,.28); }.badge-violet { color: #c9a2ff; background: rgba(153,94,230,.1); border-color: rgba(153,94,230,.28); }.badge-slate { color: #b1c0d1; background: rgba(149,165,184,.08); border-color: rgba(149,165,184,.23); }
        .verification-rail { display: grid; grid-template-columns: repeat(8, 1fr); gap: .25rem; }.verification-node { height: 1.55rem; border: 1px solid rgba(255,255,255,.08); border-radius: .35rem; display: grid; place-items: center; color: #4c5b6d; font-size: .62rem; background: rgba(255,255,255,.025); }.verification-node.active { color: #06101b; border-color: transparent; background: linear-gradient(135deg, #66dff3, #ddbd68); box-shadow: 0 0 16px rgba(78,211,237,.14); }
        .bookmark { position: absolute; top: .95rem; right: .95rem; z-index: 3; width: 2rem; height: 2rem; border-radius: 50%; border: 1px solid rgba(255,255,255,.1); color: #5e6c7e; background: rgba(5,11,21,.8); cursor: pointer; }.bookmark.active { color: #e1bd5f; border-color: rgba(225,189,95,.5); }
        .profile-panel { align-self: start; position: sticky; top: 1rem; margin-top: 2.2rem; padding: 1.25rem; border-radius: 1.1rem; border: 1px solid rgba(255,255,255,.12); background: linear-gradient(155deg, rgba(15,28,46,.97), rgba(5,11,21,.98)); overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,.35); }.profile-glow { position: absolute; width: 18rem; height: 18rem; border-radius: 50%; right: -8rem; top: -9rem; background: rgba(55,210,238,.18); filter: blur(65px); }.profile-heading { position: relative; display: flex; justify-content: space-between; gap: 1rem; }.profile-heading h2 { margin: .45rem 0 .3rem; font-size: 1.8rem; letter-spacing: -.04em; }.profile-heading p { color: #8da0b6; margin: 0; }.profile-seal { flex: 0 0 auto; width: 4rem; height: 4rem; border-radius: 50%; display: grid; place-items: center; color: #06101b; font-size: 1.2rem; font-weight: 950; background: linear-gradient(135deg, #75e5f7, #dfbb60); box-shadow: 0 0 30px rgba(92,218,242,.2); }.profile-status-row { display: flex; gap: .4rem; flex-wrap: wrap; margin: 1rem 0; }.profile-section { border-top: 1px solid rgba(255,255,255,.08); padding-top: 1rem; margin-top: 1rem; }.section-label { color: #d8b75f; font-size: .69rem; text-transform: uppercase; letter-spacing: .13em; font-weight: 900; }.profile-claim { color: #d8e1ed; line-height: 1.62; }.limitation-box { padding: 1rem; border: 1px solid rgba(238,177,63,.2); border-radius: .75rem; background: rgba(238,177,63,.055); }.limitation-box p { color: #d5c7a6; margin-bottom: 0; line-height: 1.55; }.profile-facts { display: grid; grid-template-columns: 1fr 1fr; gap: .55rem; margin-top: 1rem; }.profile-facts div { padding: .65rem; border-radius: .65rem; background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.07); }.profile-facts span, .profile-facts strong { display: block; }.profile-facts span { color: #7d90a6; font-size: .68rem; margin-bottom: .25rem; }.profile-facts strong { color: #dce6f2; font-size: .78rem; line-height: 1.35; }.microcopy { color: #71849a; font-size: .72rem; line-height: 1.5; }.determination-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; margin-top: .65rem; }.determination-item { padding: .65rem; border: 1px solid rgba(255,255,255,.075); border-radius: .65rem; background: rgba(255,255,255,.025); }.determination-item strong { display: block; font-size: 1.35rem; margin: .45rem 0 .25rem; }.determination-item small { color: #73869b; line-height: 1.35; }.chip-row { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: .55rem; }.chip { padding: .35rem .55rem; border-radius: 999px; color: #9eeafb; border: 1px solid rgba(82,213,239,.2); background: rgba(82,213,239,.06); font-size: .7rem; }.chip.muted { color: #aebbd0; border-color: rgba(174,187,208,.18); background: rgba(174,187,208,.05); }.profile-actions .button { flex: 1; font-size: .78rem; }
        .evidence-board { display: grid; gap: .55rem; }.evidence-row { display: grid; grid-template-columns: 1.3fr 1.5fr .9fr auto; gap: 1rem; align-items: center; padding: .85rem; border: 1px solid rgba(255,255,255,.09); border-radius: .8rem; background: rgba(255,255,255,.03); }.evidence-row strong, .evidence-row span { display: block; }.evidence-row > div:first-child span { color: #73869a; font-size: .72rem; margin-top: .25rem; }.evidence-counts { display: flex; gap: .6rem; color: #8fa0b4; font-size: .7rem; }.evidence-row button, .empty-state button { border: 1px solid rgba(92,217,241,.28); border-radius: .6rem; background: rgba(92,217,241,.08); color: #86e5f7; padding: .55rem .8rem; cursor: pointer; }.method-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: .75rem; }.method-grid article { min-height: 190px; padding: 1rem; border-radius: .9rem; border: 1px solid rgba(255,255,255,.1); background: linear-gradient(145deg, rgba(255,255,255,.05), rgba(255,255,255,.02)); }.method-grid article > span { color: #5bd8ef; font-family: ui-monospace, monospace; }.method-grid h3 { font-size: 1.2rem; margin: 1.4rem 0 .55rem; }.method-grid p { color: #91a2b7; line-height: 1.6; }.empty-state { grid-column: 1/-1; padding: 4rem 1rem; text-align: center; border: 1px dashed rgba(255,255,255,.16); border-radius: 1rem; color: #9aabbf; }
        .proof-path { max-width: 1510px; margin: 0 auto; padding: 5rem clamp(1rem, 4vw, 3rem); }.section-intro.light h2 { color: #fff; }.path-grid { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: .65rem; }.path-card { min-height: 260px; padding: 1rem; border: 1px solid rgba(255,255,255,.1); border-radius: .9rem; background: linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.018)); transition: transform .2s ease, border-color .2s ease; }.path-card:hover { transform: translateY(-4px); border-color: rgba(89,218,242,.42); }.path-card > span { color: #d9b85f; font-family: ui-monospace, monospace; }.path-card h3 { margin: 3rem 0 .7rem; }.path-card p { color: #8fa0b5; line-height: 1.55; font-size: .85rem; }.path-card strong { display: block; margin-top: 1rem; color: #77e2f5; }
        .institutional-callout { max-width: 1450px; margin: 0 auto 5rem; padding: clamp(1.5rem, 4vw, 3rem); display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center; border: 1px solid rgba(219,181,79,.3); border-radius: 1.2rem; background: radial-gradient(circle at 90% 20%, rgba(219,181,79,.12), transparent 22rem), linear-gradient(135deg, rgba(21,34,52,.95), rgba(8,15,28,.98)); }.institutional-callout h2 { font-size: clamp(2rem, 4vw, 4rem); line-height: 1; letter-spacing: -.05em; max-width: 17ch; margin: .7rem 0 1rem; }.institutional-callout p { max-width: 800px; color: #a3b2c4; line-height: 1.7; }.callout-actions { min-width: 260px; flex-direction: column; }
        .directory-footer { border-top: 1px solid rgba(255,255,255,.08); padding: 2rem clamp(1rem, 4vw, 4rem); max-width: 1600px; margin: 0 auto; display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: center; color: #7f90a5; }.directory-footer strong, .directory-footer span { display: block; }.directory-footer strong { color: #d9e2ed; }.directory-footer div:nth-child(2) { display: flex; gap: 1rem; flex-wrap: wrap; font-size: .78rem; }.directory-footer p { grid-column: 1/-1; margin: .7rem 0 0; color: #c8a950; font-weight: 800; }

        .demo-banner { margin: .75rem 0 -.25rem; padding: .55rem .7rem; border-radius: .65rem; border: 1px solid rgba(235,176,58,.32); background: rgba(235,176,58,.08); color: #ffd37a; font-size: .68rem; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; }
        .demo-disclosure, .directory-disclosure { padding: 1rem; border-radius: .85rem; border: 1px solid rgba(235,176,58,.28); background: rgba(235,176,58,.07); }
        .demo-disclosure { margin: 1rem 0 0; }
        .demo-disclosure strong, .directory-disclosure strong { color: #ffd37a; }
        .demo-disclosure p, .directory-disclosure p { margin: .45rem 0 0; color: #d6c79f; line-height: 1.55; }
        .directory-disclosure { margin-bottom: 1rem; }
        @media (max-width: 1200px) { .directory-workspace { grid-template-columns: 1fr; }.profile-panel { position: relative; top: 0; margin-top: 0; }.filter-console { grid-template-columns: repeat(3, 1fr); }.search-field { grid-column: 1/-1; }.path-grid { grid-template-columns: repeat(3, 1fr); }.hero-layout { grid-template-columns: 1fr 420px; }.governance-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 860px) { .top-links { display: none; }.hero-layout { grid-template-columns: 1fr; }.hero-core { min-height: 390px; }.metrics-grid { grid-template-columns: repeat(2, 1fr); }.command-bar { align-items: flex-start; flex-direction: column; }.filter-console { grid-template-columns: 1fr 1fr; }.governance-grid, .method-grid { grid-template-columns: 1fr; }.path-grid { grid-template-columns: 1fr 1fr; }.institutional-callout { grid-template-columns: 1fr; }.evidence-row { grid-template-columns: 1fr; }.evidence-counts { flex-wrap: wrap; }.directory-footer { grid-template-columns: 1fr; }.directory-footer div:nth-child(2) { justify-content: flex-start; } }
        @media (max-width: 560px) { .field-grid { grid-template-columns: 1fr; } .hero { padding-inline: 1rem; }.hero h1 { font-size: 3.25rem; }.hero-core { min-height: 330px; transform: scale(.82); margin-inline: -2rem; }.metrics-grid, .filter-console, .profile-facts, .determination-grid, .path-grid { grid-template-columns: 1fr; }.directory-workspace { padding-inline: 1rem; }.section-intro { display: block; }.section-intro > p { margin-top: 1rem; }.card-stat-grid { grid-template-columns: 1fr; }.profile-heading { display: block; }.profile-seal { margin-top: 1rem; }.command-actions { flex-wrap: wrap; }.top-nav { padding-bottom: 1.4rem; } }
        @media (prefers-reduced-motion: reduce) { .core-orbit { animation: none; } * { scroll-behavior: auto !important; transition-duration: .001ms !important; } }

        .control-register { margin-top: 1rem; display: grid; gap: .45rem; }
        .control-row { display: grid; grid-template-columns: 80px 180px 1fr auto; align-items: center; gap: .8rem; padding: .7rem .8rem; border-radius: .65rem; border: 1px solid rgba(255,255,255,.075); background: rgba(255,255,255,.025); }
        .control-row > span { color: #65ddf3; font-family: ui-monospace, monospace; font-size: .72rem; }
        .control-row > strong { color: #dbe5f0; font-size: .78rem; }
        .control-row p { color: #899bb0; margin: 0; line-height: 1.45; font-size: .76rem; }
        .review-register { margin-top: 2.5rem; display: grid; gap: .45rem; }
        .field-register { margin-top: 2.5rem; }
        .field-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .5rem; }
        .field-card { min-height: 135px; padding: .8rem; border-radius: .7rem; border: 1px solid rgba(255,255,255,.075); background: rgba(255,255,255,.025); }
        .field-card > span { color: #64dcef; font-family: ui-monospace, monospace; font-size: .68rem; }
        .field-card > strong { display: block; color: #d8b75f; font-size: .72rem; margin: .7rem 0 .25rem; }
        .field-card p { color: #a2b1c3; margin: 0 0 .7rem; font-size: .78rem; }
        .review-row { display: grid; grid-template-columns: 80px 140px 1fr auto; align-items: center; gap: .8rem; padding: .7rem .8rem; border-radius: .65rem; border: 1px solid rgba(255,255,255,.075); background: rgba(255,255,255,.025); }
        .review-row > span { color: #d8b75f; font-family: ui-monospace, monospace; font-size: .72rem; }
        .review-row > strong { color: #dbe5f0; font-size: .78rem; }
        .review-row p { color: #899bb0; margin: 0; line-height: 1.45; font-size: .76rem; }
        @media (max-width: 860px) { .field-grid { grid-template-columns: 1fr 1fr; } .control-row, .review-row { grid-template-columns: 70px 1fr; }.control-row p, .control-row .badge, .review-row p, .review-row .badge { grid-column: 1/-1; } }

      `}</style>
    </main>
  );
}
