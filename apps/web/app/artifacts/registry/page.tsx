"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ChangeEvent, type CSSProperties } from "react";

type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type RegistryStatus = "DRAFT" | "UNDER_REVIEW" | "PUBLISHED" | "CHALLENGED" | "CORRECTED" | "SUPERSEDED" | "WITHDRAWN";
type VerificationLevel = "L0" | "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "L7";
type RegistryView = "command" | "directory" | "register" | "governance" | "standards" | "verification" | "ledger" | "analytics";
type SortMode = "sequence" | "newest" | "determination" | "sector" | "verification";
type IntakeStep = 1 | 2 | 3 | 4 | 5 | 6;
type CandidateDisclosureMode = "PUBLIC" | "SELECTIVE" | "RESTRICTED" | "WITHHELD";

type RegistryArtifact = {
  registryId: string;
  artifactId: string;
  sequence: number;
  title: string;
  determination: Determination;
  sector: string;
  earliestControl: string;
  receipt: string;
  outcome: string;
  governanceRegistryId: string;
  governanceName: string;
  routeId: string;
  verificationLevel: VerificationLevel;
  status: RegistryStatus;
  publishedAt: string;
  rootHash: string;
  summary: string;
  proves: string;
  doesNotProve: string;
  href: string;
};

type GovernanceProfile = {
  registryId: string;
  name: string;
  version: string;
  organization: string;
  status: "REGISTERED" | "PENDING";
  sectors: string[];
  publicHref: string;
};

type IntakeDraft = {
  governanceRegistryId: string;
  governanceName: string;
  architectureVersion: string;
  organization: string;
  artifactTitle: string;
  sector: string;
  proposedAction: string;
  consequence: string;
  routeId: string;
  routeVersion: string;
  determination: Determination;
  earliestControl: string;
  receiptId: string;
  receiptStatus: string;
  executionEffect: string;
  outcome: string;
  proves: string;
  doesNotProve: string;
  packageRootHash: string;
  verificationLevel: VerificationLevel;
  attestation: boolean;
};



type RegistryCandidateReceipt = {
  registryCandidateId: string;
  proposedRegistryId?: string;
  artifactId: string;
  title?: string;
  submittedAt?: string;
  governanceRegistrationId: string;
  organizationName?: string;
  architectureName?: string;
  architectureVersion?: string;
  routeId?: string;
  routeVersion?: string;
  sector?: string;
  jurisdiction?: string;
  determination: Determination;
  executionReceiptId?: string;
  executionEffect?: string;
  outcome?: string;
  canonicalHash?: string;
  packageHash?: string;
  verificationLevel?: number;
  disclosureMode?: CandidateDisclosureMode;
  claimsBoundary?: string;
  proposedAction?: string;
  consequence?: string;
  status?: string;
  notice?: string;
};

type LocalReceipt = {
  receiptId: string;
  registryCandidateId: string;
  submittedAt: string;
  status: "LOCAL_INTAKE_SAVED";
  draft: IntakeDraft;
};

const STORAGE_KEY = "ta14.execution-artifact-registry.intakes.v1";
const REGISTRY_CANDIDATE_KEY = "ta14.execution-artifact-registry-candidate.v1";
const VIEW_KEY = "ta14.execution-artifact-registry.view.v1";
const nowIso = () => new Date().toISOString();
const makeId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`.toUpperCase();
const shortHash = (value: string) => value.length > 18 ? `${value.slice(0, 10)}…${value.slice(-8)}` : value;
const formatRegistryDateTime = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)
  ? `${value} · exact publication time not declared in the preserved repository record`
  : new Date(value).toLocaleString();

const CHAIN = ["REALITY", "RECORD", "CONTINUITY", "ADMISSIBILITY", "BINDING", "COMMIT", "EXECUTION", "OUTCOME"] as const;
const DETERMINATIONS: Determination[] = ["ALLOW", "HOLD", "DENY", "ESCALATE"];
const VERIFICATION_LEVELS: VerificationLevel[] = ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7"];

const GOVERNANCE_PROFILES: GovernanceProfile[] = [
  {
    registryId: "TA-14-AIGR-0001",
    name: "TA-14 Admissible Execution Architecture",
    version: "Founding public architecture record",
    organization: "TA-14 Authority",
    status: "REGISTERED",
    sectors: ["Cross-sector", "AI operations", "Environmental systems", "Financial execution", "Healthcare"],
    publicHref: "/registry/ta-14-admissible-execution-architecture",
  },
  {
    registryId: "TA-14-AIGR-000008",
    name: "Harmonic Constitutional Runtime",
    version: "1.0 · Frozen demonstration baseline",
    organization: "Moral Clarity AI · Timothy E. Zlomke",
    status: "REGISTERED",
    sectors: ["AI operations", "Research governance"],
    publicHref: "/workspace/ai-governance/registry/profiles/harmonic-constitutional-runtime",
  },
];

const FOUNDING_ARTIFACTS: RegistryArtifact[] = [
  {
    registryId: "TA14-EAR-000001",
    artifactId: "TA14-EA-000001",
    sequence: 1,
    title: "Authorized release with verified outcome",
    determination: "ALLOW",
    sector: "Cross-sector demonstration",
    earliestControl: "OUTCOME",
    receipt: "HTTP 202 · RELEASED",
    outcome: "Verified outcome closed",
    governanceRegistryId: "TA-14-AIGR-0001",
    governanceName: "TA-14 Admissible Execution Architecture",
    routeId: "TA14-ROUTE-001",
    verificationLevel: "L6",
    status: "PUBLISHED",
    publishedAt: "2026-08-01T09:00:00-04:00",
    rootHash: "sha256:1111111111111111111111111111111111111111111111111111111111111111",
    summary: "Founding execution artifact 01 preserves a materially distinct governed event and its execution effect.",
    proves: "This bounded record proves the preserved determination and technical effect for artifact TA14-EA-000001 under the identified route and evidence state.",
    doesNotProve: "This record does not establish universal architecture performance, regulatory certification, or behavior outside the preserved event.",
    href: "/artifacts/ta14-ea-000001",
  },
  {
    registryId: "TA14-EAR-000002",
    artifactId: "TA14-EA-000002",
    sequence: 2,
    title: "Authority drift before execution",
    determination: "HOLD",
    sector: "Financial execution",
    earliestControl: "CONTINUITY",
    receipt: "HTTP 423 · HELD",
    outcome: "Zero funds transmitted",
    governanceRegistryId: "TA-14-AIGR-0001",
    governanceName: "TA-14 Admissible Execution Architecture",
    routeId: "TA14-ROUTE-002",
    verificationLevel: "L6",
    status: "PUBLISHED",
    publishedAt: "2026-08-01T10:00:00-04:00",
    rootHash: "sha256:2222222222222222222222222222222222222222222222222222222222222222",
    summary: "Founding execution artifact 02 preserves a materially distinct governed event and its execution effect.",
    proves: "This bounded record proves the preserved determination and technical effect for artifact TA14-EA-000002 under the identified route and evidence state.",
    doesNotProve: "This record does not establish universal architecture performance, regulatory certification, or behavior outside the preserved event.",
    href: "/artifacts/ta14-ea-000002",
  },
  {
    registryId: "TA14-EAR-000003",
    artifactId: "TA14-EA-000003",
    sequence: 3,
    title: "Execution-boundary violation prevented",
    determination: "DENY",
    sector: "AI operations",
    earliestControl: "BINDING",
    receipt: "HTTP 403 · DENIED",
    outcome: "Zero production mutations",
    governanceRegistryId: "TA-14-AIGR-0001",
    governanceName: "TA-14 Admissible Execution Architecture",
    routeId: "TA14-ROUTE-003",
    verificationLevel: "L6",
    status: "PUBLISHED",
    publishedAt: "2026-08-01T11:00:00-04:00",
    rootHash: "sha256:3333333333333333333333333333333333333333333333333333333333333333",
    summary: "Founding execution artifact 03 preserves a materially distinct governed event and its execution effect.",
    proves: "This bounded record proves the preserved determination and technical effect for artifact TA14-EA-000003 under the identified route and evidence state.",
    doesNotProve: "This record does not establish universal architecture performance, regulatory certification, or behavior outside the preserved event.",
    href: "/artifacts/ta14-ea-000003",
  },
  {
    registryId: "TA14-EAR-000004",
    artifactId: "TA14-EA-000004",
    sequence: 4,
    title: "Conflicting admissible evidence escalated",
    determination: "ESCALATE",
    sector: "Healthcare",
    earliestControl: "ADMISSIBILITY",
    receipt: "HTTP 202 · ESCALATED",
    outcome: "Zero care-route changes",
    governanceRegistryId: "TA-14-AIGR-0001",
    governanceName: "TA-14 Admissible Execution Architecture",
    routeId: "TA14-ROUTE-004",
    verificationLevel: "L6",
    status: "PUBLISHED",
    publishedAt: "2026-08-01T12:00:00-04:00",
    rootHash: "sha256:4444444444444444444444444444444444444444444444444444444444444444",
    summary: "Founding execution artifact 04 preserves a materially distinct governed event and its execution effect.",
    proves: "This bounded record proves the preserved determination and technical effect for artifact TA14-EA-000004 under the identified route and evidence state.",
    doesNotProve: "This record does not establish universal architecture performance, regulatory certification, or behavior outside the preserved event.",
    href: "/artifacts/ta14-ea-000004",
  },
  {
    registryId: "TA14-EAR-000005",
    artifactId: "TA14-EA-000005",
    sequence: 5,
    title: "Evidence freshness expired before commit",
    determination: "HOLD",
    sector: "Life sciences",
    earliestControl: "ADMISSIBILITY",
    receipt: "HTTP 423 · HELD",
    outcome: "Zero batches released",
    governanceRegistryId: "TA-14-AIGR-0001",
    governanceName: "TA-14 Admissible Execution Architecture",
    routeId: "TA14-ROUTE-005",
    verificationLevel: "L6",
    status: "PUBLISHED",
    publishedAt: "2026-08-01T13:00:00-04:00",
    rootHash: "sha256:5555555555555555555555555555555555555555555555555555555555555555",
    summary: "Founding execution artifact 05 preserves a materially distinct governed event and its execution effect.",
    proves: "This bounded record proves the preserved determination and technical effect for artifact TA14-EA-000005 under the identified route and evidence state.",
    doesNotProve: "This record does not establish universal architecture performance, regulatory certification, or behavior outside the preserved event.",
    href: "/artifacts/ta14-ea-000005",
  },
  {
    registryId: "TA14-EAR-000006",
    artifactId: "TA14-EA-000006",
    sequence: 6,
    title: "Unauthorized runtime version denied",
    determination: "DENY",
    sector: "AI operations",
    earliestControl: "COMMIT",
    receipt: "HTTP 403 · DENIED",
    outcome: "Zero runtime transitions",
    governanceRegistryId: "TA-14-AIGR-0001",
    governanceName: "TA-14 Admissible Execution Architecture",
    routeId: "TA14-ROUTE-006",
    verificationLevel: "L6",
    status: "PUBLISHED",
    publishedAt: "2026-08-01T14:00:00-04:00",
    rootHash: "sha256:6666666666666666666666666666666666666666666666666666666666666666",
    summary: "Founding execution artifact 06 preserves a materially distinct governed event and its execution effect.",
    proves: "This bounded record proves the preserved determination and technical effect for artifact TA14-EA-000006 under the identified route and evidence state.",
    doesNotProve: "This record does not establish universal architecture performance, regulatory certification, or behavior outside the preserved event.",
    href: "/artifacts/ta14-ea-000006",
  },
  {
    registryId: "TA14-EAR-000007",
    artifactId: "TA14-EA-000007",
    sequence: 7,
    title: "Authorized threshold exceeded",
    determination: "ESCALATE",
    sector: "Critical infrastructure",
    earliestControl: "BINDING",
    receipt: "HTTP 202 · ESCALATED",
    outcome: "Zero dosing changes",
    governanceRegistryId: "TA-14-AIGR-0001",
    governanceName: "TA-14 Admissible Execution Architecture",
    routeId: "TA14-ROUTE-007",
    verificationLevel: "L6",
    status: "PUBLISHED",
    publishedAt: "2026-08-01T15:00:00-04:00",
    rootHash: "sha256:7777777777777777777777777777777777777777777777777777777777777777",
    summary: "Founding execution artifact 07 preserves a materially distinct governed event and its execution effect.",
    proves: "This bounded record proves the preserved determination and technical effect for artifact TA14-EA-000007 under the identified route and evidence state.",
    doesNotProve: "This record does not establish universal architecture performance, regulatory certification, or behavior outside the preserved event.",
    href: "/artifacts/ta14-ea-000007",
  },
  {
    registryId: "TA14-EAR-000008",
    artifactId: "TA14-EA-000008",
    sequence: 8,
    title: "Material condition changed after approval",
    determination: "HOLD",
    sector: "Environmental systems",
    earliestControl: "COMMIT",
    receipt: "HTTP 423 · HELD",
    outcome: "Zero building-control changes",
    governanceRegistryId: "TA-14-AIGR-0001",
    governanceName: "TA-14 Admissible Execution Architecture",
    routeId: "TA14-ROUTE-008",
    verificationLevel: "L6",
    status: "PUBLISHED",
    publishedAt: "2026-08-01T16:00:00-04:00",
    rootHash: "sha256:8888888888888888888888888888888888888888888888888888888888888888",
    summary: "Founding execution artifact 08 preserves a materially distinct governed event and its execution effect.",
    proves: "This bounded record proves the preserved determination and technical effect for artifact TA14-EA-000008 under the identified route and evidence state.",
    doesNotProve: "This record does not establish universal architecture performance, regulatory certification, or behavior outside the preserved event.",
    href: "/artifacts/ta14-ea-000008",
  },
  {
    registryId: "TA14-EAR-000009",
    artifactId: "TA14-EA-000009",
    sequence: 9,
    title: "Mandatory governance-gate bypass denied",
    determination: "DENY",
    sector: "Enterprise operations",
    earliestControl: "EXECUTION",
    receipt: "HTTP 403 · DENIED",
    outcome: "Zero consequential actions",
    governanceRegistryId: "TA-14-AIGR-0001",
    governanceName: "TA-14 Admissible Execution Architecture",
    routeId: "TA14-ROUTE-009",
    verificationLevel: "L6",
    status: "PUBLISHED",
    publishedAt: "2026-08-01T17:00:00-04:00",
    rootHash: "sha256:9999999999999999999999999999999999999999999999999999999999999999",
    summary: "Founding execution artifact 09 preserves a materially distinct governed event and its execution effect.",
    proves: "This bounded record proves the preserved determination and technical effect for artifact TA14-EA-000009 under the identified route and evidence state.",
    doesNotProve: "This record does not establish universal architecture performance, regulatory certification, or behavior outside the preserved event.",
    href: "/artifacts/ta14-ea-000009",
  },
  {
    registryId: "TA14-EAR-000010",
    artifactId: "TA14-EA-000010",
    sequence: 10,
    title: "Dual-authority execution with verified outcome",
    determination: "ALLOW",
    sector: "Cybersecurity",
    earliestControl: "COMMIT",
    receipt: "HTTP 202 · ACCESS_RESTORED",
    outcome: "Bounded access restored and expired",
    governanceRegistryId: "TA-14-AIGR-0001",
    governanceName: "TA-14 Admissible Execution Architecture",
    routeId: "TA14-ROUTE-010",
    verificationLevel: "L6",
    status: "PUBLISHED",
    publishedAt: "2026-08-01T18:00:00-04:00",
    rootHash: "sha256:1010101010101010101010101010101010101010101010101010101010101010",
    summary: "Founding execution artifact 10 preserves a materially distinct governed event and its execution effect.",
    proves: "This bounded record proves the preserved determination and technical effect for artifact TA14-EA-000010 under the identified route and evidence state.",
    doesNotProve: "This record does not establish universal architecture performance, regulatory certification, or behavior outside the preserved event.",
    href: "/artifacts/ta14-ea-000010",
  },
  {
    registryId: "TA14-EAR-000011",
    artifactId: "TA14-EA-000011",
    sequence: 11,
    title: "Confidential evidence verified without disclosure",
    determination: "ALLOW",
    sector: "Assurance",
    earliestControl: "ADMISSIBILITY",
    receipt: "HTTP 202 · CERTIFICATE_ISSUED",
    outcome: "Protected evidence remained sealed",
    governanceRegistryId: "TA-14-AIGR-0001",
    governanceName: "TA-14 Admissible Execution Architecture",
    routeId: "TA14-ROUTE-011",
    verificationLevel: "L6",
    status: "PUBLISHED",
    publishedAt: "2026-08-01T19:00:00-04:00",
    rootHash: "sha256:1111111111111111111111111111111111111111111111111111111111111111",
    summary: "Founding execution artifact 11 preserves a materially distinct governed event and its execution effect.",
    proves: "This bounded record proves the preserved determination and technical effect for artifact TA14-EA-000011 under the identified route and evidence state.",
    doesNotProve: "This record does not establish universal architecture performance, regulatory certification, or behavior outside the preserved event.",
    href: "/artifacts/ta14-ea-000011",
  },
  {
    registryId: "TA14-EAR-000012",
    artifactId: "TA14-EA-000012",
    sequence: 12,
    title: "Preserved chain-of-custody closure certificate",
    determination: "ALLOW",
    sector: "Cross-sector assurance",
    earliestControl: "OUTCOME",
    receipt: "HTTP 202 · CERTIFICATE_ISSUED",
    outcome: "Closure certificate independently corroborated",
    governanceRegistryId: "TA-14-AIGR-0001",
    governanceName: "TA-14 Admissible Execution Architecture",
    routeId: "TA14-ROUTE-012",
    verificationLevel: "L6",
    status: "PUBLISHED",
    publishedAt: "2026-08-01T20:00:00-04:00",
    rootHash: "sha256:1212121212121212121212121212121212121212121212121212121212121212",
    summary: "Founding execution artifact 12 preserves a materially distinct governed event and its execution effect.",
    proves: "This bounded record proves the preserved determination and technical effect for artifact TA14-EA-000012 under the identified route and evidence state.",
    doesNotProve: "This record does not establish universal architecture performance, regulatory certification, or behavior outside the preserved event.",
    href: "/artifacts/ta14-ea-000012",
  },
];

const EXTERNAL_REGISTERED_ARTIFACTS: RegistryArtifact[] = [
  {
    registryId: "TA14-EAR-000013",
    artifactId: "FD-2026-0002-CASE-001",
    sequence: 13,
    title: "Authority Revoked Before Consequential Execution",
    determination: "DENY",
    sector: "AI operations",
    earliestControl: "BINDING",
    receipt: "RUNTIME REFUSAL / BLOCK",
    outcome: "Runtime non-execution behavior demonstrated; external outcome not independently corroborated",
    governanceRegistryId: "TA-14-AIGR-000008",
    governanceName: "Harmonic Constitutional Runtime",
    routeId: "FD-2026-0002 · CASE-001",
    verificationLevel: "L3",
    status: "PUBLISHED",
    publishedAt: "2026-08-07",
    rootHash: "Not published in repository export",
    summary: "First externally registered governance execution artifact in the Exchange. Harmonic Constitutional Runtime Version 1.0 produced a refusal / block determination under the constitutional state represented in the admitted execution packet; TA-14 preserved the surrounding chronology limitation rather than extending the finding beyond the evidence.",
    proves: "The admitted evidence supports that the frozen Harmonic Version 1.0 runtime reconstructed the constitutional state represented within the submitted packet and produced its own refusal / block determination for FD-2026-0002 Case 001.",
    doesNotProve: "The artifact does not independently establish the complete institutional chronology outside the runtime, including the pre-change authority state, attributable revocation event, independently preserved post-change state, or an external record confirming that execution did not occur.",
    href: "/artifacts/fd-2026-0002-case-001",
  },
];

const REGISTERED_ARTIFACTS: RegistryArtifact[] = [
  ...FOUNDING_ARTIFACTS,
  ...EXTERNAL_REGISTERED_ARTIFACTS,
];

const RUNTIME_LINKS = [
  {
    number: "01",
    code: "REALITY",
    title: "Observed condition",
    description: "The bounded condition that existed before interpretation or action.",
  },
  {
    number: "02",
    code: "RECORD",
    title: "Preserved representation",
    description: "The attributable representation of the observed condition.",
  },
  {
    number: "03",
    code: "IDENTITY",
    title: "Actor and source identity",
    description: "The identity of every material source, actor, reviewer, approver, and executor.",
  },
  {
    number: "04",
    code: "PROVENANCE",
    title: "Origin and lineage",
    description: "The origin, method, transformation history, and declared limitations of material evidence.",
  },
  {
    number: "05",
    code: "TIME",
    title: "Temporal applicability",
    description: "The time relationship between evidence, authority, decision, commit, execution, and outcome.",
  },
  {
    number: "06",
    code: "CUSTODY",
    title: "Control history",
    description: "The custody and control transitions required to preserve integrity and challengeability.",
  },
  {
    number: "07",
    code: "INTEGRITY",
    title: "Completeness and alteration resistance",
    description: "The record has remained complete, attributable, and materially unaltered.",
  },
  {
    number: "08",
    code: "CONTINUITY",
    title: "Connected state",
    description: "Identity, provenance, time, custody, version, and dependency remain connected.",
  },
  {
    number: "09",
    code: "RELEVANCE",
    title: "Question correspondence",
    description: "Evidence bears on the exact governed action, subject, purpose, and consequence.",
  },
  {
    number: "10",
    code: "FRESHNESS",
    title: "Current applicability",
    description: "Evidence remains sufficiently current for the rate at which the governed reality may change.",
  },
  {
    number: "11",
    code: "SUFFICIENCY",
    title: "Decision support",
    description: "The admitted evidence is sufficient for the exact determination under the active route.",
  },
  {
    number: "12",
    code: "CONFLICT",
    title: "Contradiction surfaced",
    description: "Conflicting material records are preserved, visible, and resolved or escalated.",
  },
  {
    number: "13",
    code: "ADMISSIBILITY",
    title: "Right to support consequence",
    description: "Evidence is permitted to support the bounded determination for this route and purpose.",
  },
  {
    number: "14",
    code: "AUTHORITY",
    title: "Valid power to approve",
    description: "The actor possesses current authority for the exact action, subject, scope, and time.",
  },
  {
    number: "15",
    code: "BOUNDARY",
    title: "Permitted action scope",
    description: "The route defines where action begins, ends, remains prohibited, and requires escalation.",
  },
  {
    number: "16",
    code: "OBLIGATION",
    title: "Governing duty or permission",
    description: "The exact rule, duty, prohibition, permission, or standard governing consequence is identified.",
  },
  {
    number: "17",
    code: "BINDING",
    title: "Connection to consequence",
    description: "The determination is validly connected to authority, scope, destination, and consequence.",
  },
  {
    number: "18",
    code: "DETERMINATION",
    title: "Governed decision state",
    description: "ALLOW, HOLD, DENY, or ESCALATE follows from admitted evidence and valid authority.",
  },
  {
    number: "19",
    code: "COMMIT",
    title: "Fixed pre-action state",
    description: "The approved route version, evidence, authority, dependencies, boundary, and decision are fixed.",
  },
  {
    number: "20",
    code: "REVALIDATION",
    title: "Immediate pre-execution check",
    description: "Material conditions are checked again before action can cross the execution boundary.",
  },
  {
    number: "21",
    code: "EXECUTION",
    title: "Controlled transition",
    description: "The performed action remains attributable, observable, bounded, and interruptible where required.",
  },
  {
    number: "22",
    code: "CORRESPONDENCE",
    title: "Authorized-act parity",
    description: "The action performed corresponds exactly to the action that was authorized and committed.",
  },
  {
    number: "23",
    code: "OUTCOME",
    title: "Observed consequence",
    description: "The real-world result, residual condition, and any unintended effects are observed and preserved.",
  },
  {
    number: "24",
    code: "PRESERVATION",
    title: "Reconstructable history",
    description: "The complete history remains versioned, attributable, inspectable, challengeable, and correctable.",
  },
] as const;
const PACKAGE_COMPONENTS = [
  {
    id: "PKG-01",
    title: "Public inspection page",
    requirement: "Required",
    description: "Human-readable inspection surface linked to the permanent registry record.",
  },
  {
    id: "PKG-02",
    title: "Canonical bounded-record JSON",
    requirement: "Required",
    description: "Machine-readable canonical event record used for parity and hash verification.",
  },
  {
    id: "PKG-03",
    title: "Human-readable artifact record",
    requirement: "Required",
    description: "Portable record that preserves the bounded event in an inspectable format.",
  },
  {
    id: "PKG-04",
    title: "Governance profile reference",
    requirement: "Required",
    description: "Permanent link to the registered governance architecture that produced the artifact.",
  },
  {
    id: "PKG-05",
    title: "Route snapshot",
    requirement: "Required",
    description: "Frozen route identity, version, gates, thresholds, and revalidation triggers.",
  },
  {
    id: "PKG-06",
    title: "Evidence manifest",
    requirement: "Required",
    description: "Attributed evidence inventory with disclosure, freshness, custody, and admissibility states.",
  },
  {
    id: "PKG-07",
    title: "Authority ledger",
    requirement: "Required",
    description: "Authority sources, scopes, delegations, validity windows, conflicts, and changes.",
  },
  {
    id: "PKG-08",
    title: "Continuity record",
    requirement: "Required",
    description: "Identity, provenance, custody, version, and dependency continuity findings.",
  },
  {
    id: "PKG-09",
    title: "Admissibility determination",
    requirement: "Required",
    description: "Evidence-by-evidence and route-level admissibility findings.",
  },
  {
    id: "PKG-10",
    title: "Binding record",
    requirement: "Required",
    description: "The connection among determination, authority, destination, scope, and consequence.",
  },
  {
    id: "PKG-11",
    title: "Commit record",
    requirement: "Required",
    description: "Fixed state and decision immediately before execution or controlled non-execution.",
  },
  {
    id: "PKG-12",
    title: "Execution receipt",
    requirement: "Required",
    description: "Technical evidence of release, hold, denial, escalation, or adapter non-invocation.",
  },
  {
    id: "PKG-13",
    title: "Outcome record",
    requirement: "Required",
    description: "Observed result, closure evidence, residual risk, and independent verification state.",
  },
  {
    id: "PKG-14",
    title: "Integrity manifest",
    requirement: "Required",
    description: "Component hashes, root hash, canonicalization policy, and signature references.",
  },
  {
    id: "PKG-15",
    title: "Verification instructions",
    requirement: "Required",
    description: "Steps an independent reviewer can use to reproduce supported verification levels.",
  },
  {
    id: "PKG-16",
    title: "Claims boundary",
    requirement: "Required",
    description: "Explicit statement of what the artifact proves and does not prove.",
  },
  {
    id: "PKG-17",
    title: "Challenge history",
    requirement: "Required",
    description: "Append-only challenge, review, correction, and supersession history.",
  },
  {
    id: "PKG-18",
    title: "Publication record",
    requirement: "Required",
    description: "Publisher, steward, publication state, version, dates, and correction policy.",
  },
  {
    id: "PKG-19",
    title: "Acceptance-test results",
    requirement: "Required",
    description: "Tests demonstrating internal parity among determination, receipt, effect, and outcome.",
  },
  {
    id: "PKG-20",
    title: "Registry receipt",
    requirement: "Required",
    description: "Permanent registry identifier, timestamp, governance linkage, and publication status.",
  },
] as const;
const REGISTRY_RULES = [
  {
    id: "REG-01",
    title: "Governance identity required",
    description: "Every artifact must resolve to a registered governance architecture and a preserved architecture version.",
  },
  {
    id: "REG-02",
    title: "Bounded event required",
    description: "The artifact must describe one specific proposed action and one bounded consequence-bearing event.",
  },
  {
    id: "REG-03",
    title: "Route identity required",
    description: "The governing route, version, gates, thresholds, and revalidation triggers must be preserved.",
  },
  {
    id: "REG-04",
    title: "Evidence attribution required",
    description: "Every material evidence item must identify source, capture time, custody, disclosure, and admissibility state.",
  },
  {
    id: "REG-05",
    title: "Authority scope required",
    description: "Authority must be attributable, current, and bounded to the exact action and consequence.",
  },
  {
    id: "REG-06",
    title: "Earliest controlling condition required",
    description: "The record must identify the earliest unsupported or controlling condition without skipping ahead.",
  },
  {
    id: "REG-07",
    title: "Determination parity required",
    description: "ALLOW, HOLD, DENY, or ESCALATE must match the gate findings and commit record.",
  },
  {
    id: "REG-08",
    title: "Technical effect required",
    description: "A receipt must show what the execution adapter released, held, denied, routed, or did not invoke.",
  },
  {
    id: "REG-09",
    title: "Outcome closure required",
    description: "The registry must distinguish technical effect from verified real-world outcome.",
  },
  {
    id: "REG-10",
    title: "Integrity package required",
    description: "Canonical components must be hashable, versioned, and tied to a root package identity.",
  },
  {
    id: "REG-11",
    title: "Claims boundary required",
    description: "The publisher must state what the event proves and what it cannot establish.",
  },
  {
    id: "REG-12",
    title: "Challengeability required",
    description: "Published records must support challenge, correction, supersession, and withdrawal without erasure.",
  },
  {
    id: "REG-13",
    title: "Disclosure discipline required",
    description: "Protected evidence may be verified without becoming public when the disclosure boundary is preserved.",
  },
  {
    id: "REG-14",
    title: "No retroactive governance",
    description: "A record cannot claim pre-action control if the governing decision was created after consequence occurred.",
  },
  {
    id: "REG-15",
    title: "No universal inference",
    description: "One successful artifact cannot establish universal architecture performance.",
  },
  {
    id: "REG-16",
    title: "Permanent citation required",
    description: "Published records receive stable identifiers and citation-ready public metadata.",
  },
] as const;
const REGISTRATION_CHECKS = [
  {
    id: "CHK-01",
    title: "Artifact identity",
    description: "Artifact ID, series, version, and event timestamps are complete and internally consistent.",
  },
  {
    id: "CHK-02",
    title: "Governance linkage",
    description: "Governance registry identifier and architecture version resolve to a preserved record.",
  },
  {
    id: "CHK-03",
    title: "Route parity",
    description: "Route identity and version match the commit record, receipt, and public inspection page.",
  },
  {
    id: "CHK-04",
    title: "Determination parity",
    description: "Determination matches all mandatory gate findings and the committed execution effect.",
  },
  {
    id: "CHK-05",
    title: "Receipt parity",
    description: "Technical status code, command, adapter response, and execution effect agree.",
  },
  {
    id: "CHK-06",
    title: "Outcome parity",
    description: "Outcome claims do not exceed the preserved closure evidence.",
  },
  {
    id: "CHK-07",
    title: "Hash integrity",
    description: "Component hashes and package root match the published integrity manifest.",
  },
  {
    id: "CHK-08",
    title: "Disclosure integrity",
    description: "Public components do not expose evidence classified as restricted or withheld.",
  },
  {
    id: "CHK-09",
    title: "Chronology integrity",
    description: "Evidence, authority, commit, execution, and outcome timestamps follow a possible sequence.",
  },
  {
    id: "CHK-10",
    title: "Challenge readiness",
    description: "Challenge route, correction policy, and steward contact are present.",
  },
  {
    id: "CHK-11",
    title: "Claims discipline",
    description: "Proves and does-not-prove statements are specific, bounded, and non-universal.",
  },
  {
    id: "CHK-12",
    title: "Publication readiness",
    description: "Required package components are present and registry status is permitted for publication.",
  },
] as const;
const SECTORS = [
  "AI operations",
  "Assurance",
  "Critical infrastructure",
  "Cybersecurity",
  "Education",
  "Environmental systems",
  "Financial execution",
  "Healthcare",
  "Industrial safety",
  "Legal operations",
  "Life sciences",
  "Public sector",
  "Records governance",
  "Research governance",
  "Cross-sector",
] as const;


const REGISTRY_CONTROL_LIBRARY = [
  {
    id: "EAR-CONTROL-001",
    domain: "IDENTITY",
    title: "Identity registry control 001",
    requirement: "Confirm that the identity condition for control 001 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-002",
    domain: "EVIDENCE",
    title: "Evidence registry control 002",
    requirement: "Confirm that the evidence condition for control 002 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-003",
    domain: "AUTHORITY",
    title: "Authority registry control 003",
    requirement: "Confirm that the authority condition for control 003 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-004",
    domain: "CONTINUITY",
    title: "Continuity registry control 004",
    requirement: "Confirm that the continuity condition for control 004 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-005",
    domain: "ADMISSIBILITY",
    title: "Admissibility registry control 005",
    requirement: "Confirm that the admissibility condition for control 005 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-006",
    domain: "BOUNDARY",
    title: "Boundary registry control 006",
    requirement: "Confirm that the boundary condition for control 006 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-007",
    domain: "COMMIT",
    title: "Commit registry control 007",
    requirement: "Confirm that the commit condition for control 007 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-008",
    domain: "EXECUTION",
    title: "Execution registry control 008",
    requirement: "Confirm that the execution condition for control 008 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-009",
    domain: "OUTCOME",
    title: "Outcome registry control 009",
    requirement: "Confirm that the outcome condition for control 009 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-010",
    domain: "INTEGRITY",
    title: "Integrity registry control 010",
    requirement: "Confirm that the integrity condition for control 010 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-011",
    domain: "VERIFICATION",
    title: "Verification registry control 011",
    requirement: "Confirm that the verification condition for control 011 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-012",
    domain: "PUBLICATION",
    title: "Publication registry control 012",
    requirement: "Confirm that the publication condition for control 012 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-013",
    domain: "IDENTITY",
    title: "Identity registry control 013",
    requirement: "Confirm that the identity condition for control 013 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-014",
    domain: "EVIDENCE",
    title: "Evidence registry control 014",
    requirement: "Confirm that the evidence condition for control 014 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-015",
    domain: "AUTHORITY",
    title: "Authority registry control 015",
    requirement: "Confirm that the authority condition for control 015 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-016",
    domain: "CONTINUITY",
    title: "Continuity registry control 016",
    requirement: "Confirm that the continuity condition for control 016 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-017",
    domain: "ADMISSIBILITY",
    title: "Admissibility registry control 017",
    requirement: "Confirm that the admissibility condition for control 017 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-018",
    domain: "BOUNDARY",
    title: "Boundary registry control 018",
    requirement: "Confirm that the boundary condition for control 018 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-019",
    domain: "COMMIT",
    title: "Commit registry control 019",
    requirement: "Confirm that the commit condition for control 019 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-020",
    domain: "EXECUTION",
    title: "Execution registry control 020",
    requirement: "Confirm that the execution condition for control 020 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-021",
    domain: "OUTCOME",
    title: "Outcome registry control 021",
    requirement: "Confirm that the outcome condition for control 021 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-022",
    domain: "INTEGRITY",
    title: "Integrity registry control 022",
    requirement: "Confirm that the integrity condition for control 022 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-023",
    domain: "VERIFICATION",
    title: "Verification registry control 023",
    requirement: "Confirm that the verification condition for control 023 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-024",
    domain: "PUBLICATION",
    title: "Publication registry control 024",
    requirement: "Confirm that the publication condition for control 024 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-025",
    domain: "IDENTITY",
    title: "Identity registry control 025",
    requirement: "Confirm that the identity condition for control 025 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-026",
    domain: "EVIDENCE",
    title: "Evidence registry control 026",
    requirement: "Confirm that the evidence condition for control 026 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-027",
    domain: "AUTHORITY",
    title: "Authority registry control 027",
    requirement: "Confirm that the authority condition for control 027 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-028",
    domain: "CONTINUITY",
    title: "Continuity registry control 028",
    requirement: "Confirm that the continuity condition for control 028 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-029",
    domain: "ADMISSIBILITY",
    title: "Admissibility registry control 029",
    requirement: "Confirm that the admissibility condition for control 029 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-030",
    domain: "BOUNDARY",
    title: "Boundary registry control 030",
    requirement: "Confirm that the boundary condition for control 030 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-031",
    domain: "COMMIT",
    title: "Commit registry control 031",
    requirement: "Confirm that the commit condition for control 031 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-032",
    domain: "EXECUTION",
    title: "Execution registry control 032",
    requirement: "Confirm that the execution condition for control 032 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-033",
    domain: "OUTCOME",
    title: "Outcome registry control 033",
    requirement: "Confirm that the outcome condition for control 033 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-034",
    domain: "INTEGRITY",
    title: "Integrity registry control 034",
    requirement: "Confirm that the integrity condition for control 034 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-035",
    domain: "VERIFICATION",
    title: "Verification registry control 035",
    requirement: "Confirm that the verification condition for control 035 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-036",
    domain: "PUBLICATION",
    title: "Publication registry control 036",
    requirement: "Confirm that the publication condition for control 036 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-037",
    domain: "IDENTITY",
    title: "Identity registry control 037",
    requirement: "Confirm that the identity condition for control 037 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-038",
    domain: "EVIDENCE",
    title: "Evidence registry control 038",
    requirement: "Confirm that the evidence condition for control 038 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-039",
    domain: "AUTHORITY",
    title: "Authority registry control 039",
    requirement: "Confirm that the authority condition for control 039 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-040",
    domain: "CONTINUITY",
    title: "Continuity registry control 040",
    requirement: "Confirm that the continuity condition for control 040 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-041",
    domain: "ADMISSIBILITY",
    title: "Admissibility registry control 041",
    requirement: "Confirm that the admissibility condition for control 041 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-042",
    domain: "BOUNDARY",
    title: "Boundary registry control 042",
    requirement: "Confirm that the boundary condition for control 042 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-043",
    domain: "COMMIT",
    title: "Commit registry control 043",
    requirement: "Confirm that the commit condition for control 043 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-044",
    domain: "EXECUTION",
    title: "Execution registry control 044",
    requirement: "Confirm that the execution condition for control 044 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-045",
    domain: "OUTCOME",
    title: "Outcome registry control 045",
    requirement: "Confirm that the outcome condition for control 045 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-046",
    domain: "INTEGRITY",
    title: "Integrity registry control 046",
    requirement: "Confirm that the integrity condition for control 046 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-047",
    domain: "VERIFICATION",
    title: "Verification registry control 047",
    requirement: "Confirm that the verification condition for control 047 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-048",
    domain: "PUBLICATION",
    title: "Publication registry control 048",
    requirement: "Confirm that the publication condition for control 048 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-049",
    domain: "IDENTITY",
    title: "Identity registry control 049",
    requirement: "Confirm that the identity condition for control 049 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-050",
    domain: "EVIDENCE",
    title: "Evidence registry control 050",
    requirement: "Confirm that the evidence condition for control 050 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-051",
    domain: "AUTHORITY",
    title: "Authority registry control 051",
    requirement: "Confirm that the authority condition for control 051 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-052",
    domain: "CONTINUITY",
    title: "Continuity registry control 052",
    requirement: "Confirm that the continuity condition for control 052 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-053",
    domain: "ADMISSIBILITY",
    title: "Admissibility registry control 053",
    requirement: "Confirm that the admissibility condition for control 053 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-054",
    domain: "BOUNDARY",
    title: "Boundary registry control 054",
    requirement: "Confirm that the boundary condition for control 054 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-055",
    domain: "COMMIT",
    title: "Commit registry control 055",
    requirement: "Confirm that the commit condition for control 055 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-056",
    domain: "EXECUTION",
    title: "Execution registry control 056",
    requirement: "Confirm that the execution condition for control 056 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-057",
    domain: "OUTCOME",
    title: "Outcome registry control 057",
    requirement: "Confirm that the outcome condition for control 057 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-058",
    domain: "INTEGRITY",
    title: "Integrity registry control 058",
    requirement: "Confirm that the integrity condition for control 058 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-059",
    domain: "VERIFICATION",
    title: "Verification registry control 059",
    requirement: "Confirm that the verification condition for control 059 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-060",
    domain: "PUBLICATION",
    title: "Publication registry control 060",
    requirement: "Confirm that the publication condition for control 060 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-061",
    domain: "IDENTITY",
    title: "Identity registry control 061",
    requirement: "Confirm that the identity condition for control 061 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-062",
    domain: "EVIDENCE",
    title: "Evidence registry control 062",
    requirement: "Confirm that the evidence condition for control 062 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-063",
    domain: "AUTHORITY",
    title: "Authority registry control 063",
    requirement: "Confirm that the authority condition for control 063 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-064",
    domain: "CONTINUITY",
    title: "Continuity registry control 064",
    requirement: "Confirm that the continuity condition for control 064 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-065",
    domain: "ADMISSIBILITY",
    title: "Admissibility registry control 065",
    requirement: "Confirm that the admissibility condition for control 065 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-066",
    domain: "BOUNDARY",
    title: "Boundary registry control 066",
    requirement: "Confirm that the boundary condition for control 066 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-067",
    domain: "COMMIT",
    title: "Commit registry control 067",
    requirement: "Confirm that the commit condition for control 067 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-068",
    domain: "EXECUTION",
    title: "Execution registry control 068",
    requirement: "Confirm that the execution condition for control 068 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-069",
    domain: "OUTCOME",
    title: "Outcome registry control 069",
    requirement: "Confirm that the outcome condition for control 069 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-070",
    domain: "INTEGRITY",
    title: "Integrity registry control 070",
    requirement: "Confirm that the integrity condition for control 070 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-071",
    domain: "VERIFICATION",
    title: "Verification registry control 071",
    requirement: "Confirm that the verification condition for control 071 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
  {
    id: "EAR-CONTROL-072",
    domain: "PUBLICATION",
    title: "Publication registry control 072",
    requirement: "Confirm that the publication condition for control 072 is attributable, bounded, inspectable, and consistent with the submitted artifact package.",
    failureEffect: "Registration remains under review until the controlling condition is repaired, reverified, and preserved in the candidate record.",
  },
] as const;

const REGISTRY_GLOSSARY = [
  {
    id: "EAR-GLOSSARY-001",
    term: "Artifact registry identifier",
    definition: "Permanent public identifier assigned to a published execution artifact record.",
  },
  {
    id: "EAR-GLOSSARY-002",
    term: "Governance registry linkage",
    definition: "Preserved relationship between an execution artifact and the registered governance architecture that produced it.",
  },
  {
    id: "EAR-GLOSSARY-003",
    term: "Registry candidate",
    definition: "Locally or institutionally submitted intake that has not yet received permanent publication status.",
  },
  {
    id: "EAR-GLOSSARY-004",
    term: "Bounded event",
    definition: "One specific proposed action, route, determination, execution effect, and outcome context.",
  },
  {
    id: "EAR-GLOSSARY-005",
    term: "Determination parity",
    definition: "Consistency among gate findings, committed decision, execution receipt, and outcome state.",
  },
  {
    id: "EAR-GLOSSARY-006",
    term: "Receipt parity",
    definition: "Consistency among the declared technical status, adapter command, system response, and preserved effect.",
  },
  {
    id: "EAR-GLOSSARY-007",
    term: "Outcome closure",
    definition: "Preserved evidence showing the real-world result or controlled non-execution state.",
  },
  {
    id: "EAR-GLOSSARY-008",
    term: "Root package hash",
    definition: "Digest that binds the canonical registry package components to one package identity.",
  },
  {
    id: "EAR-GLOSSARY-009",
    term: "Claims boundary",
    definition: "Explicit statement of what the artifact proves and what it does not prove.",
  },
  {
    id: "EAR-GLOSSARY-010",
    term: "Public inspection record",
    definition: "Human-readable page exposing the bounded record and its verification path.",
  },
  {
    id: "EAR-GLOSSARY-011",
    term: "Challenge record",
    definition: "Append-only objection, evidence, review, and disposition associated with a published artifact.",
  },
  {
    id: "EAR-GLOSSARY-012",
    term: "Correction record",
    definition: "Preserved modification that does not erase the original publication state.",
  },
  {
    id: "EAR-GLOSSARY-013",
    term: "Superseding artifact",
    definition: "New artifact version that replaces future reliance while preserving the earlier record.",
  },
  {
    id: "EAR-GLOSSARY-014",
    term: "Withdrawal",
    definition: "Registry state indicating that the publisher or steward no longer offers the record for present reliance.",
  },
  {
    id: "EAR-GLOSSARY-015",
    term: "Disclosure boundary",
    definition: "Rule determining which evidence may be public, selective, restricted, or withheld.",
  },
  {
    id: "EAR-GLOSSARY-016",
    term: "Independent verification",
    definition: "Review performed by a qualified party outside the artifact publisher’s direct production path.",
  },
  {
    id: "EAR-GLOSSARY-017",
    term: "Replay consistency",
    definition: "Verification that a permitted replay reproduces the committed determination under the preserved conditions.",
  },
  {
    id: "EAR-GLOSSARY-018",
    term: "Execution effect",
    definition: "Technically observable result of release, hold, denial, escalation, or non-invocation.",
  },
  {
    id: "EAR-GLOSSARY-019",
    term: "Earliest controlling condition",
    definition: "First unsupported or outcome-controlling point in the governing chain.",
  },
  {
    id: "EAR-GLOSSARY-020",
    term: "Registry steward",
    definition: "Accountable role responsible for publication, correction, challenge handling, and lifecycle state.",
  },
  {
    id: "EAR-GLOSSARY-021",
    term: "Publication readiness",
    definition: "State in which required components, parity checks, claims boundaries, and attestations are complete.",
  },
  {
    id: "EAR-GLOSSARY-022",
    term: "Local intake receipt",
    definition: "Downloadable browser-generated receipt that preserves a candidate submission without claiming public registration.",
  },
  {
    id: "EAR-GLOSSARY-023",
    term: "Permanent citation",
    definition: "Stable citation metadata linking artifact, governance, version, date, and registry identifier.",
  },
  {
    id: "EAR-GLOSSARY-024",
    term: "Governance evidence history",
    definition: "Collection of registered artifacts attributable to one governance architecture over time.",
  },
  {
    id: "EAR-GLOSSARY-025",
    term: "Determination distribution",
    definition: "Portfolio-level count of ALLOW, HOLD, DENY, and ESCALATE artifacts.",
  },
  {
    id: "EAR-GLOSSARY-026",
    term: "Verification floor",
    definition: "Lowest verification level represented across a defined artifact portfolio.",
  },
  {
    id: "EAR-GLOSSARY-027",
    term: "Package completeness",
    definition: "Presence and inspectability of all required canonical artifact components.",
  },
  {
    id: "EAR-GLOSSARY-028",
    term: "Chronology integrity",
    definition: "Evidence that event timestamps form a possible and internally consistent sequence.",
  },
  {
    id: "EAR-GLOSSARY-029",
    term: "No retroactive governance",
    definition: "Rule prohibiting post-event decisions from being represented as pre-action control.",
  },
  {
    id: "EAR-GLOSSARY-030",
    term: "No universal inference",
    definition: "Rule preventing one bounded artifact from being treated as proof of universal performance.",
  },
  {
    id: "EAR-GLOSSARY-031",
    term: "Registered capability claim",
    definition: "Capability statement supported by one or more attributable registry artifacts.",
  },
  {
    id: "EAR-GLOSSARY-032",
    term: "Evidence-backed profile",
    definition: "Governance profile whose public claims link to inspectable execution artifacts.",
  },
] as const;

const defaultDraft: IntakeDraft = {
  governanceRegistryId: "TA-14-AIGR-0001",
  governanceName: "TA-14 Admissible Execution Architecture",
  architectureVersion: "Founding public architecture record",
  organization: "TA-14 Authority",
  artifactTitle: "",
  sector: "AI operations",
  proposedAction: "",
  consequence: "",
  routeId: "",
  routeVersion: "1.0.0",
  determination: "HOLD",
  earliestControl: "ADMISSIBILITY",
  receiptId: "",
  receiptStatus: "HTTP 423 · HELD",
  executionEffect: "NO_ACTION",
  outcome: "",
  proves: "",
  doesNotProve: "",
  packageRootHash: "",
  verificationLevel: "L0",
  attestation: false,
};

const registryStages = [
  { number: "01", title: "Register governance", description: "Establish the architecture identity, steward, version, claims, limits, and public registry record.", href: "/workspace/ai-governance/registry/register" },
  { number: "02", title: "Build the route", description: "Translate the proposed action into evidence, authority, boundary, gate, commit, and outcome requirements.", href: "/workspace/routes/build" },
  { number: "03", title: "Run the route", description: "Use the Playground or Artifact Studio to evaluate conditions and preserve the governing determination.", href: "/workspace/artifacts/build" },
  { number: "04", title: "Generate package", description: "Produce the human record, canonical JSON, manifests, receipts, hashes, outcome evidence, and claims boundary.", href: "/artifacts" },
  { number: "05", title: "Verify package", description: "Test package integrity, record parity, execution effect, outcome closure, and disclosure discipline.", href: "/artifacts/verify" },
  { number: "06", title: "Register artifact", description: "Link the verified artifact to the governance that produced it and receive a permanent registry candidate identifier.", href: "#register" },
  { number: "07", title: "Publish and cite", description: "Expose the bounded public inspection record, citation, verification status, and downloadable package.", href: "#directory" },
  { number: "08", title: "Challenge and correct", description: "Preserve objections, counter-evidence, review, correction, supersession, and withdrawal without erasure.", href: "/artifacts/challenge" },
] as const;

function toneForDetermination(value: Determination) {
  return value.toLowerCase();
}



function parseRegistryCandidate(raw: string | null): RegistryCandidateReceipt | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const record = value as Record<string, unknown>;
    const determination = record.determination;
    if (!['ALLOW','HOLD','DENY','ESCALATE'].includes(String(determination))) return null;
    const artifactId = typeof record.artifactId === 'string' ? record.artifactId : '';
    const governanceRegistrationId = typeof record.governanceRegistrationId === 'string' ? record.governanceRegistrationId : '';
    const registryCandidateId = typeof record.registryCandidateId === 'string' ? record.registryCandidateId : '';
    if (!artifactId || !governanceRegistrationId || !registryCandidateId) return null;
    return record as unknown as RegistryCandidateReceipt;
  } catch {
    return null;
  }
}

function verificationLevelFromNumber(value: number | undefined): VerificationLevel {
  const level = Math.max(0, Math.min(7, Math.floor(value ?? 0)));
  return `L${level}` as VerificationLevel;
}

function receiptStatusForCandidate(candidate: RegistryCandidateReceipt): string {
  const effect = candidate.executionEffect?.trim();
  if (effect) return effect;
  if (candidate.determination === 'ALLOW') return 'HTTP 202 · RELEASED';
  if (candidate.determination === 'HOLD') return 'HTTP 423 · HELD';
  if (candidate.determination === 'DENY') return 'HTTP 403 · DENIED';
  return 'HTTP 202 · ESCALATED';
}

function controlForDetermination(candidate: RegistryCandidateReceipt): string {
  if (candidate.determination === 'ALLOW') return 'OUTCOME';
  if (candidate.determination === 'HOLD') return 'REVALIDATION';
  if (candidate.determination === 'DENY') return 'BINDING';
  return 'ADMISSIBILITY';
}

function intakeFromCandidate(candidate: RegistryCandidateReceipt): IntakeDraft {
  const claims = candidate.claimsBoundary?.trim() ?? '';
  return {
    governanceRegistryId: candidate.governanceRegistrationId,
    governanceName: candidate.architectureName?.trim() || candidate.organizationName?.trim() || 'Registered AI governance',
    architectureVersion: candidate.architectureVersion?.trim() || 'Declared in registry candidate',
    organization: candidate.organizationName?.trim() || 'Registered organization',
    artifactTitle: candidate.title?.trim() || candidate.artifactId,
    sector: candidate.sector?.trim() || 'Cross-sector',
    proposedAction: candidate.proposedAction?.trim() || 'Imported from the Artifact Registration Wizard candidate.',
    consequence: candidate.consequence?.trim() || 'See the preserved canonical artifact package.',
    routeId: candidate.routeId?.trim() || '',
    routeVersion: candidate.routeVersion?.trim() || '1.0.0',
    determination: candidate.determination,
    earliestControl: controlForDetermination(candidate),
    receiptId: candidate.executionReceiptId?.trim() || '',
    receiptStatus: receiptStatusForCandidate(candidate),
    executionEffect: candidate.executionEffect?.trim() || candidate.determination,
    outcome: candidate.outcome?.trim() || '',
    proves: `This registry candidate preserves the bounded ${candidate.determination} determination, route identity, execution effect, and outcome represented by ${candidate.artifactId}.`,
    doesNotProve: claims || 'Registration does not certify the governance, prove universal performance, or extend reliance beyond the submitted bounded record.',
    packageRootHash: candidate.packageHash?.trim() || '',
    verificationLevel: verificationLevelFromNumber(candidate.verificationLevel),
    attestation: false,
  };
}

function downloadJson(name: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Meter({ value, label }: { value: number; label: string }) {
  const bounded = Math.max(0, Math.min(100, value));
  return (
    <div className="meter" aria-label={`${label}: ${bounded}%`}>
      <div className="meter-top"><span>{label}</span><strong>{bounded}%</strong></div>
      <div className="meter-track"><span style={{ width: `${bounded}%` }} /></div>
    </div>
  );
}

export default function ExecutionArtifactRegistryPage() {
  const [view, setView] = useState<RegistryView>("command");
  const [search, setSearch] = useState("");
  const [determination, setDetermination] = useState<"ALL" | Determination>("ALL");
  const [sector, setSector] = useState("ALL");
  const [status, setStatus] = useState<"ALL" | RegistryStatus>("ALL");
  const [sortMode, setSortMode] = useState<SortMode>("sequence");
  const [selectedId, setSelectedId] = useState("TA14-EAR-000001");
  const [intakeStep, setIntakeStep] = useState<IntakeStep>(1);
  const [draft, setDraft] = useState<IntakeDraft>(defaultDraft);
  const [localReceipts, setLocalReceipts] = useState<LocalReceipt[]>([]);
  const [packageChecks, setPackageChecks] = useState<Record<string, boolean>>(() => Object.fromEntries(PACKAGE_COMPONENTS.map((item) => [item.id, false])));
  const [registryMessage, setRegistryMessage] = useState("");
  const [importedCandidate, setImportedCandidate] = useState<RegistryCandidateReceipt | null>(null);

  useEffect(() => {
    try {
      const savedView = window.localStorage.getItem(VIEW_KEY) as RegistryView | null;
      if (savedView) setView(savedView);
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLocalReceipts(JSON.parse(raw) as LocalReceipt[]);
      const candidate = parseRegistryCandidate(window.localStorage.getItem(REGISTRY_CANDIDATE_KEY));
      if (candidate) {
        setImportedCandidate(candidate);
        setDraft(intakeFromCandidate(candidate));
        setPackageChecks(Object.fromEntries(PACKAGE_COMPONENTS.map((item) => [item.id, true])));
        setIntakeStep(1);
        setView("register");
        setRegistryMessage(`Imported ${candidate.registryCandidateId} from the Artifact Registration Wizard. Review and attest before preserving registry intake.`);
      }
    } catch {
      // Local persistence is optional. The page remains usable without it.
    }
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(VIEW_KEY, view); } catch { /* optional */ }
  }, [view]);

  const records = useMemo(() => {
    const query = search.trim().toLowerCase();
    const merged = [...REGISTERED_ARTIFACTS];
    return merged
      .filter((item) => determination === "ALL" || item.determination === determination)
      .filter((item) => sector === "ALL" || item.sector === sector)
      .filter((item) => status === "ALL" || item.status === status)
      .filter((item) => !query || [item.registryId, item.artifactId, item.title, item.sector, item.governanceName, item.routeId, item.receipt, item.rootHash].join(" ").toLowerCase().includes(query))
      .sort((a, b) => {
        if (sortMode === "newest") return b.publishedAt.localeCompare(a.publishedAt);
        if (sortMode === "determination") return a.determination.localeCompare(b.determination) || a.sequence - b.sequence;
        if (sortMode === "sector") return a.sector.localeCompare(b.sector) || a.sequence - b.sequence;
        if (sortMode === "verification") return b.verificationLevel.localeCompare(a.verificationLevel) || a.sequence - b.sequence;
        return a.sequence - b.sequence;
      });
  }, [search, determination, sector, status, sortMode]);

  const selected = REGISTERED_ARTIFACTS.find((item) => item.registryId === selectedId) ?? REGISTERED_ARTIFACTS[0];
  const checkedCount = Object.values(packageChecks).filter(Boolean).length;
  const packageProgress = Math.round((checkedCount / PACKAGE_COMPONENTS.length) * 100);

  const intakeErrors = useMemo(() => {
    const errors: string[] = [];
    if (!draft.governanceRegistryId.trim()) errors.push("Governance registry identifier is required.");
    if (!draft.governanceName.trim()) errors.push("Governance name is required.");
    if (!draft.artifactTitle.trim()) errors.push("Artifact title is required.");
    if (!draft.proposedAction.trim()) errors.push("The proposed action must be bounded and specific.");
    if (!draft.consequence.trim()) errors.push("The consequence at stake must be declared.");
    if (!draft.routeId.trim()) errors.push("Route ID is required.");
    if (!draft.receiptId.trim()) errors.push("Execution receipt ID is required.");
    if (!draft.outcome.trim()) errors.push("Outcome or controlled non-execution state is required.");
    if (!draft.proves.trim()) errors.push("A bounded proof statement is required.");
    if (!draft.doesNotProve.trim()) errors.push("A claims-boundary statement is required.");
    if (!draft.packageRootHash.trim()) errors.push("Package root hash is required.");
    if (!draft.attestation) errors.push("Registrant attestation is required.");
    if (checkedCount < PACKAGE_COMPONENTS.length) errors.push(`All ${PACKAGE_COMPONENTS.length} required package components must be acknowledged.`);
    if (draft.determination === "ALLOW" && !/202|released|issued|restored/i.test(draft.receiptStatus)) errors.push("ALLOW must resolve to a release or certificate-style technical receipt.");
    if (draft.determination === "HOLD" && !/423|held/i.test(draft.receiptStatus)) errors.push("HOLD must resolve to a held technical state.");
    if (draft.determination === "DENY" && !/403|denied/i.test(draft.receiptStatus)) errors.push("DENY must resolve to a denied technical state.");
    if (draft.determination === "ESCALATE" && !/202|escalated|routed/i.test(draft.receiptStatus)) errors.push("ESCALATE must resolve to a routed or escalated technical state.");
    return errors;
  }, [draft, checkedCount]);

  const setField = <K extends keyof IntakeDraft>(key: K, value: IntakeDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const changeView = (next: RegistryView) => {
    setView(next);
    window.setTimeout(() => document.getElementById("registry-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };

  const importWizardCandidate = () => {
    let candidate: RegistryCandidateReceipt | null = null;
    try { candidate = parseRegistryCandidate(window.localStorage.getItem(REGISTRY_CANDIDATE_KEY)); } catch { candidate = null; }
    if (!candidate) {
      setRegistryMessage("No valid Artifact Registration Wizard candidate was found in this browser.");
      return;
    }
    setImportedCandidate(candidate);
    setDraft(intakeFromCandidate(candidate));
    setPackageChecks(Object.fromEntries(PACKAGE_COMPONENTS.map((item) => [item.id, true])));
    setIntakeStep(1);
    setView("register");
    setRegistryMessage(`Imported ${candidate.registryCandidateId}. The candidate remains non-public until registry review is completed.`);
    window.setTimeout(() => document.getElementById("registry-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };

  const saveLocalIntake = () => {
    if (intakeErrors.length) {
      setRegistryMessage(`Registration intake remains incomplete: ${intakeErrors[0]}`);
      return;
    }
    const sequence = REGISTERED_ARTIFACTS.length + localReceipts.length + 1;
    const receipt: LocalReceipt = {
      receiptId: makeId("TA14-EAR-INTAKE"),
      registryCandidateId: `TA14-EAR-CANDIDATE-${String(sequence).padStart(6, "0")}`,
      submittedAt: nowIso(),
      status: "LOCAL_INTAKE_SAVED",
      draft,
    };
    const next = [receipt, ...localReceipts];
    setLocalReceipts(next);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* optional */ }
    setRegistryMessage(`Local intake preserved as ${receipt.registryCandidateId}. Publication still requires registry review and a connected submission service.`);
    downloadJson(`${receipt.registryCandidateId.toLowerCase()}.json`, receipt);
  };

  const resetIntake = () => {
    setDraft(defaultDraft);
    setPackageChecks(Object.fromEntries(PACKAGE_COMPONENTS.map((item) => [item.id, false])));
    setIntakeStep(1);
    setRegistryMessage("");
  };

  return (
    <main className="registry-root">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grid-plane" />

      <header className="registry-header">
        <Link href="/" className="brand" aria-label="Return to TA-14 Exchange">
          <span className="brand-mark">TA</span>
          <span><strong>TA-14</strong><small>Execution Artifact Registry</small></span>
        </Link>
        <nav className="header-nav" aria-label="Execution Artifact Registry navigation">
          <Link href="/artifacts">Artifacts</Link>
          <Link href="/artifacts/verify">Verification</Link>
          <Link href="/artifacts/challenge">Challenge</Link>
          <Link href="/ai-governance-registry">Governance Registry</Link>
        </nav>
        <div className="header-actions">
          <button type="button" className="header-import" onClick={importWizardCandidate}>Import candidate</button>
          <button type="button" className="header-action" onClick={() => changeView("register")}>Register an artifact</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <Badge tone="gold">Door Eight · Registry Engine</Badge>
          <p className="eyebrow">FROM GOVERNANCE CLAIM TO REGISTERED EXECUTION EVIDENCE</p>
          <h1>Register the governance. Build the route. Produce the artifact. Preserve the proof.</h1>
          <p className="hero-lead">
            The TA-14 Execution Artifact Registry connects a registered governance architecture to the bounded execution records it produces. Every published artifact receives a permanent identity, governance linkage, verification status, public inspection page, integrity package, and challenge history.
          </p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => changeView("directory")}>Enter the registry</button>
            <button className="button secondary" onClick={() => changeView("register")}>Start registration</button>
            <Link className="button ghost" href="/workspace/ai-governance/registry/register">Register governance first</Link>
          </div>
          <div className="hero-principle"><span>Governing principle</span><strong>No admissible evidence. No admissible execution.</strong></div>
        </div>

        <div className="hero-engine" aria-label="Registry engine workflow">
          <div className="engine-orbit orbit-one" />
          <div className="engine-orbit orbit-two" />
          <div className="engine-core">
            <span>REGISTRY</span>
            <strong>12</strong>
            <small>founding artifacts</small>
          </div>
          {registryStages.slice(0, 6).map((stage, index) => (
            <button
              key={stage.number}
              className={`orbit-node node-${index + 1}`}
              onClick={() => changeView(index < 2 ? "governance" : index < 5 ? "register" : "directory")}
              aria-label={stage.title}
            >
              <span>{stage.number}</span><strong>{stage.title}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="metrics">
        <article><span>Registered artifacts</span><strong>{REGISTERED_ARTIFACTS.length}</strong><small>12 TA-14 founding · 1 external governance artifact</small></article>
        <article><span>Registered governance</span><strong>{GOVERNANCE_PROFILES.length}</strong><small>Architecture identities linked</small></article>
        <article><span>Determination coverage</span><strong>4/4</strong><small>ALLOW · HOLD · DENY · ESCALATE</small></article>
        <article><span>TA-14 founding verification floor</span><strong>L6</strong><small>External artifacts retain their own bounded verification level</small></article>
        <article><span>Local intake drafts</span><strong>{localReceipts.length}</strong><small>Preserved in this browser</small></article>
      </section>

      <section className="workflow-strip">
        {registryStages.map((stage) => (
          <Link key={stage.number} href={stage.href} className="workflow-stage">
            <span>{stage.number}</span>
            <div><strong>{stage.title}</strong><small>{stage.description}</small></div>
            <b>→</b>
          </Link>
        ))}
      </section>

      {importedCandidate && (
        <section className="candidate-handoff" aria-live="polite">
          <div>
            <span>Registration Wizard handoff</span>
            <strong>{importedCandidate.registryCandidateId}</strong>
            <p>{importedCandidate.artifactId} · {importedCandidate.governanceRegistrationId} · {importedCandidate.determination} · {importedCandidate.status ?? "LOCAL CANDIDATE"}</p>
          </div>
          <div className="candidate-actions">
            <button type="button" onClick={() => { setView("register"); setIntakeStep(1); }}>Review candidate</button>
            <button type="button" onClick={() => downloadJson(`${importedCandidate.registryCandidateId.toLowerCase()}-handoff.json`, importedCandidate)}>Download handoff</button>
          </div>
        </section>
      )}

      <section className="workspace" id="registry-workspace">
        <aside className="workspace-nav">
          <p>Registry command</p>
          {([
            ["command", "Command Center", "Live registry status"],
            ["directory", "Public Directory", "Search registered artifacts"],
            ["register", "Registration Studio", "Prepare an artifact intake"],
            ["governance", "Governance Linkage", "Connect architecture to proof"],
            ["standards", "Registry Standard", "Rules and package requirements"],
            ["verification", "Verification Matrix", "Test publication readiness"],
            ["ledger", "Registry Ledger", "Permanent event history"],
            ["analytics", "Evidence Analytics", "Portfolio-level proof signals"],
          ] as const).map(([id, title, description]) => (
            <button key={id} className={view === id ? "active" : ""} onClick={() => changeView(id)}>
              <span>{title}</span><small>{description}</small>
            </button>
          ))}
          <div className="workspace-note">
            <strong>Publication boundary</strong>
            <p>This page provides a functional local intake workspace. A permanent public registry entry requires TA-14 review and a connected persistence service.</p>
          </div>
        </aside>

        <div className="workspace-main">
          {view === "command" && (
            <section className="view-panel command-view">
              <div className="section-heading"><div><p>Registry command center</p><h2>One public evidence history for every registered governance.</h2></div><Badge tone="verified">SYSTEM READY</Badge></div>
              <div className="command-grid">
                <article className="command-card dominant">
                  <span className="card-label">Founding registry state</span>
                  <h3>TA-14 Admissible Execution Architecture</h3>
                  <p>Twelve materially different execution artifacts are linked to the founding governance registry record and preserved across all four governing determinations.</p>
                  <div className="determination-row">
                    {DETERMINATIONS.map((item) => <div key={item} className={`determination-box ${toneForDetermination(item)}`}><strong>{FOUNDING_ARTIFACTS.filter((record) => record.determination === item).length}</strong><span>{item}</span></div>)}
                  </div>
                  <div className="command-actions"><Link href="/registry/ta-14-admissible-execution-architecture">Inspect governance</Link><button onClick={() => changeView("directory")}>Inspect artifacts</button></div>
                </article>
                <article className="command-card"><span className="card-label">External governance milestone</span><h3>Harmonic Constitutional Runtime · Artifact 001</h3><p>FD-2026-0002 Case 001 is now connected to TA-14-AIGR-000008 as the Exchange's first externally registered governance execution artifact. Runtime refusal / block behavior was demonstrated; the full surrounding chronology remains explicitly evidence-bounded.</p><div className="command-actions"><Link href="/artifacts/fd-2026-0002-case-001">Inspect Harmonic artifact</Link><Link href="/workspace/ai-governance/registry/profiles/harmonic-constitutional-runtime">Open governance profile</Link></div></article>
                <article className="command-card"><span className="card-label">Registry readiness</span><h3>Publication control</h3><Meter value={100} label="Founding package coverage" /><Meter value={75} label="External contributor readiness" /><Meter value={50} label="Connected submission service" /><p className="muted">The public directory and local intake engine are ready. Permanent third-party publication requires persistence, authentication, review, and registry issuance services.</p></article>
                <article className="command-card"><span className="card-label">Evidence standard</span><h3>Twenty-component package</h3><p>Every registered artifact must preserve enough material to reconstruct the route, verify the technical effect, inspect the outcome, and challenge the public claim.</p><button className="text-action" onClick={() => changeView("standards")}>Open package standard →</button></article>
                <article className="command-card"><span className="card-label">Industry invitation</span><h3>Bring yours.</h3><p>Register your governance architecture, build a route, produce a bounded execution artifact, verify the package, and submit it for permanent registration.</p><button className="text-action" onClick={() => changeView("register")}>Begin artifact intake →</button></article>
              </div>

              <div className="chain-stage">
                <div className="section-heading compact"><div><p>Registry correspondence</p><h2>Every artifact must preserve the complete governing chain.</h2></div></div>
                <div className="chain-row">
                  {CHAIN.map((item, index) => <div key={item} className="chain-node"><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><small>{index < CHAIN.length - 1 ? "→" : "✓"}</small></div>)}
                </div>
              </div>
            </section>
          )}

          {view === "directory" && (
            <section className="view-panel" id="directory">
              <div className="section-heading"><div><p>Public artifact directory</p><h2>Search the evidence history, not the marketing claim.</h2></div><Badge tone="verified">{records.length} RECORDS</Badge></div>
              <div className="filter-bar">
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search artifact ID, registry ID, governance, route, receipt, hash, or title" />
                <select value={determination} onChange={(event) => setDetermination(event.target.value as "ALL" | Determination)}><option value="ALL">All determinations</option>{DETERMINATIONS.map((item) => <option key={item}>{item}</option>)}</select>
                <select value={sector} onChange={(event) => setSector(event.target.value)}><option value="ALL">All sectors</option>{SECTORS.map((item) => <option key={item}>{item}</option>)}</select>
                <select value={status} onChange={(event) => setStatus(event.target.value as "ALL" | RegistryStatus)}><option value="ALL">All states</option><option>PUBLISHED</option><option>CHALLENGED</option><option>CORRECTED</option><option>SUPERSEDED</option><option>WITHDRAWN</option></select>
                <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}><option value="sequence">Sequence</option><option value="newest">Newest</option><option value="determination">Determination</option><option value="sector">Sector</option><option value="verification">Verification</option></select>
              </div>
              <div className="directory-layout">
                <div className="record-list">
                  {records.map((record) => (
                    <button key={record.registryId} className={`record-card ${selectedId === record.registryId ? "selected" : ""}`} onClick={() => setSelectedId(record.registryId)}>
                      <div className="record-top"><Badge tone={toneForDetermination(record.determination)}>{record.determination}</Badge><span>{record.registryId}</span><Badge tone="verified">{record.verificationLevel}</Badge></div>
                      <h3>{record.title}</h3>
                      <p>{record.summary}</p>
                      <div className="record-meta"><span>{record.sector}</span><span>{record.earliestControl}</span><span>{record.status}</span></div>
                    </button>
                  ))}
                </div>
                <aside className="record-inspector">
                  <div className="inspector-header"><Badge tone={toneForDetermination(selected.determination)}>{selected.determination}</Badge><span>{selected.registryId}</span></div>
                  <h2>{selected.title}</h2>
                  <p>{selected.summary}</p>
                  <dl>
                    <div><dt>Artifact</dt><dd>{selected.artifactId}</dd></div>
                    <div><dt>Governance</dt><dd>{selected.governanceRegistryId}</dd></div>
                    <div><dt>Route</dt><dd>{selected.routeId}</dd></div>
                    <div><dt>Controlling anchor</dt><dd>{selected.earliestControl}</dd></div>
                    <div><dt>Receipt</dt><dd>{selected.receipt}</dd></div>
                    <div><dt>Outcome</dt><dd>{selected.outcome}</dd></div>
                    <div><dt>Root hash</dt><dd>{shortHash(selected.rootHash)}</dd></div>
                    <div><dt>Verification</dt><dd>{selected.verificationLevel}</dd></div>
                  </dl>
                  <div className="proof-box"><strong>What it proves</strong><p>{selected.proves}</p></div>
                  <div className="proof-box boundary"><strong>What it does not prove</strong><p>{selected.doesNotProve}</p></div>
                  <div className="inspector-actions"><Link className="button primary" href={selected.href}>Inspect artifact</Link><Link className="button secondary" href={`/artifacts/verify?artifact=${selected.artifactId}`}>Verify</Link><Link className="button ghost" href={`/artifacts/challenge?artifact=${selected.artifactId}`}>Challenge</Link></div>
                  <button className="download-button" onClick={() => downloadJson(`${selected.registryId.toLowerCase()}.json`, selected)}>Download registry metadata</button>
                </aside>
              </div>
            </section>
          )}

          {view === "register" && (
            <section className="view-panel" id="register">
              <div className="section-heading"><div><p>Artifact registration studio</p><h2>Prepare a bounded registry intake.</h2></div><Badge tone={intakeErrors.length ? "hold" : "verified"}>{intakeErrors.length ? `${intakeErrors.length} OPEN CONDITIONS` : "READY TO SAVE"}</Badge></div>
              <div className="intake-warning"><strong>Local intake boundary</strong><p>This workspace validates and preserves a downloadable local intake receipt. It does not claim permanent publication or create a public registry entry without a connected review and persistence service.</p></div>
              <div className="stepper">
                {[1,2,3,4,5,6].map((step) => <button key={step} className={intakeStep === step ? "active" : intakeStep > step ? "complete" : ""} onClick={() => setIntakeStep(step as IntakeStep)}><span>{step}</span><small>{["Governance","Event","Decision","Effect","Package","Attest"][step-1]}</small></button>)}
              </div>

              {intakeStep === 1 && <div className="form-grid">
                <label><span>Governance registry ID</span><input value={draft.governanceRegistryId} onChange={(e) => setField("governanceRegistryId", e.target.value)} /></label>
                <label><span>Governance name</span><input value={draft.governanceName} onChange={(e) => setField("governanceName", e.target.value)} /></label>
                <label><span>Architecture version</span><input value={draft.architectureVersion} onChange={(e) => setField("architectureVersion", e.target.value)} /></label>
                <label><span>Organization</span><input value={draft.organization} onChange={(e) => setField("organization", e.target.value)} /></label>
                <div className="form-callout"><strong>Need a governance identity?</strong><p>Artifact registration begins with a preserved governance architecture record.</p><Link href="/workspace/ai-governance/registry/register">Register governance →</Link></div>
              </div>}

              {intakeStep === 2 && <div className="form-grid">
                <label className="wide"><span>Artifact title</span><input value={draft.artifactTitle} onChange={(e) => setField("artifactTitle", e.target.value)} placeholder="Describe the bounded governing event" /></label>
                <label><span>Sector</span><select value={draft.sector} onChange={(e) => setField("sector", e.target.value)}>{SECTORS.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Route ID</span><input value={draft.routeId} onChange={(e) => setField("routeId", e.target.value)} placeholder="ROUTE-..." /></label>
                <label><span>Route version</span><input value={draft.routeVersion} onChange={(e) => setField("routeVersion", e.target.value)} /></label>
                <label className="wide"><span>Proposed action</span><textarea value={draft.proposedAction} onChange={(e) => setField("proposedAction", e.target.value)} placeholder="State one exact action, destination, scope, and intended effect." /></label>
                <label className="wide"><span>Consequence at stake</span><textarea value={draft.consequence} onChange={(e) => setField("consequence", e.target.value)} placeholder="What may bind to reality if execution proceeds?" /></label>
              </div>}

              {intakeStep === 3 && <div className="form-grid">
                <label><span>Determination</span><select value={draft.determination} onChange={(e) => setField("determination", e.target.value as Determination)}>{DETERMINATIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Earliest controlling anchor</span><select value={draft.earliestControl} onChange={(e) => setField("earliestControl", e.target.value)}>{CHAIN.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Verification level</span><select value={draft.verificationLevel} onChange={(e) => setField("verificationLevel", e.target.value as VerificationLevel)}>{VERIFICATION_LEVELS.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className="wide"><span>What this artifact proves</span><textarea value={draft.proves} onChange={(e) => setField("proves", e.target.value)} /></label>
                <label className="wide"><span>What this artifact does not prove</span><textarea value={draft.doesNotProve} onChange={(e) => setField("doesNotProve", e.target.value)} /></label>
              </div>}

              {intakeStep === 4 && <div className="form-grid">
                <label><span>Receipt ID</span><input value={draft.receiptId} onChange={(e) => setField("receiptId", e.target.value)} /></label>
                <label><span>Technical receipt status</span><input value={draft.receiptStatus} onChange={(e) => setField("receiptStatus", e.target.value)} /></label>
                <label><span>Execution effect</span><input value={draft.executionEffect} onChange={(e) => setField("executionEffect", e.target.value)} /></label>
                <label className="wide"><span>Observed outcome or controlled non-execution</span><textarea value={draft.outcome} onChange={(e) => setField("outcome", e.target.value)} /></label>
                <div className={`parity-card ${intakeErrors.some((item) => item.includes(draft.determination)) ? "fail" : "pass"}`}><strong>Determination-to-receipt parity</strong><p>The registry checks whether the technical receipt language corresponds to the declared governing determination.</p><Badge tone={intakeErrors.some((item) => item.includes(draft.determination)) ? "deny" : "verified"}>{intakeErrors.some((item) => item.includes(draft.determination)) ? "REVIEW" : "PASS"}</Badge></div>
              </div>}

              {intakeStep === 5 && <div className="package-checklist">
                <div className="package-summary"><Meter value={packageProgress} label="Required package acknowledged" /><label><span>Package root hash</span><input value={draft.packageRootHash} onChange={(e) => setField("packageRootHash", e.target.value)} placeholder="sha256:..." /></label><button onClick={() => setPackageChecks(Object.fromEntries(PACKAGE_COMPONENTS.map((item) => [item.id, true])))}>Acknowledge all components</button></div>
                <div className="package-grid">{PACKAGE_COMPONENTS.map((item) => <label key={item.id} className={packageChecks[item.id] ? "checked" : ""}><input type="checkbox" checked={Boolean(packageChecks[item.id])} onChange={(e) => setPackageChecks((current) => ({ ...current, [item.id]: e.target.checked }))} /><span>{item.id}</span><div><strong>{item.title}</strong><small>{item.description}</small></div></label>)}</div>
              </div>}

              {intakeStep === 6 && <div className="attestation-panel">
                <div className="attestation-copy"><Badge tone={intakeErrors.length ? "hold" : "verified"}>{intakeErrors.length ? "NOT READY" : "READY"}</Badge><h3>Registrant attestation</h3><p>I attest that this intake describes a bounded event; the governance identity, evidence, authority, route, determination, receipt, execution effect, outcome, hashes, and claims boundary are attributable to the submitted package; and no retroactive governance claim is being presented as pre-action control.</p><label className="attestation-check"><input type="checkbox" checked={draft.attestation} onChange={(e) => setField("attestation", e.target.checked)} /><span>I make this attestation for the submitted registry intake.</span></label></div>
                <div className="validation-list"><h3>Publication-readiness findings</h3>{intakeErrors.length ? intakeErrors.map((error) => <div key={error} className="validation-error"><span>!</span><p>{error}</p></div>) : <div className="validation-pass"><span>✓</span><p>All local intake conditions are satisfied. Save the candidate receipt for connected review and permanent registry issuance.</p></div>}</div>
              </div>}

              <div className="intake-controls">
                <button className="button ghost" onClick={resetIntake}>Reset intake</button>
                <div><button className="button secondary" disabled={intakeStep === 1} onClick={() => setIntakeStep((Math.max(1, intakeStep - 1)) as IntakeStep)}>Previous</button><button className="button primary" disabled={intakeStep === 6} onClick={() => setIntakeStep((Math.min(6, intakeStep + 1)) as IntakeStep)}>Continue</button></div>
                <button className="button gold" onClick={saveLocalIntake}>Save local registry candidate</button>
              </div>
              {registryMessage && <div className="registry-message">{registryMessage}</div>}
              {localReceipts.length > 0 && <div className="local-receipts"><h3>Local candidate receipts</h3>{localReceipts.map((receipt) => <article key={receipt.receiptId}><div><Badge tone="hold">LOCAL ONLY</Badge><strong>{receipt.registryCandidateId}</strong><small>{new Date(receipt.submittedAt).toLocaleString()}</small></div><p>{receipt.draft.artifactTitle}</p><button onClick={() => downloadJson(`${receipt.registryCandidateId.toLowerCase()}.json`, receipt)}>Download receipt</button></article>)}</div>}
            </section>
          )}

          {view === "governance" && (
            <section className="view-panel">
              <div className="section-heading"><div><p>Governance-to-artifact linkage</p><h2>A claim becomes accountable when it develops a public evidence history.</h2></div></div>
              <div className="governance-layout">
                {GOVERNANCE_PROFILES.map((profile) => {
                  const governanceArtifacts = REGISTERED_ARTIFACTS.filter((item) => item.governanceRegistryId === profile.registryId);
                  const determinationCount = new Set(governanceArtifacts.map((item) => item.determination)).size;
                  const verificationFloor = governanceArtifacts.length
                    ? [...governanceArtifacts].sort((a, b) => a.verificationLevel.localeCompare(b.verificationLevel))[0].verificationLevel
                    : "—";
                  return <article className="governance-card" key={profile.registryId}><div className="governance-head"><Badge tone="verified">{profile.status}</Badge><span>{profile.registryId}</span></div><h3>{profile.name}</h3><p>{profile.organization}</p><small>{profile.version}</small><div className="sector-tags">{profile.sectors.map((item) => <span key={item}>{item}</span>)}</div><div className="governance-stats"><div><strong>{governanceArtifacts.length}</strong><span>Artifacts</span></div><div><strong>{determinationCount}</strong><span>Determinations</span></div><div><strong>{verificationFloor}</strong><span>Verification floor</span></div></div><Link href={profile.publicHref}>Open governance record →</Link></article>;
                })}
                <article className="governance-invitation"><span>FOR GOVERNANCE BUILDERS</span><h3>Your profile should show more than claims.</h3><p>Once your governance is registered, each verified execution artifact can become part of its attributable capability history.</p><ul><li>Architecture identity and version</li><li>Sector and scope declarations</li><li>Registered execution artifacts</li><li>Determination distribution</li><li>Verification and challenge history</li><li>Correction and supersession record</li></ul><Link className="button primary" href="/workspace/ai-governance/registry/register">Register your governance</Link></article>
              </div>
            </section>
          )}

          {view === "standards" && (
            <section className="view-panel">
              <div className="section-heading"><div><p>Registry standard</p><h2>The minimum evidence required before an artifact may become a public registry record.</h2></div><Badge tone="gold">VERSION 1.0</Badge></div>
              <div className="standard-grid">{REGISTRY_RULES.map((rule) => <article key={rule.id}><span>{rule.id}</span><h3>{rule.title}</h3><p>{rule.description}</p></article>)}</div>
              <div className="section-heading compact"><div><p>Package standard</p><h2>Twenty required components.</h2></div></div>
              <div className="component-table">{PACKAGE_COMPONENTS.map((item) => <article key={item.id}><span>{item.id}</span><div><strong>{item.title}</strong><p>{item.description}</p></div><Badge tone="verified">{item.requirement}</Badge></article>)}</div>
              <div className="section-heading compact"><div><p>Institutional control library</p><h2>Seventy-two registration controls across the artifact lifecycle.</h2></div><Badge tone="neutral">72 CONTROLS</Badge></div>
              <div className="control-library">{REGISTRY_CONTROL_LIBRARY.map((control) => <article key={control.id}><div><span>{control.id}</span><Badge tone="neutral">{control.domain}</Badge></div><h3>{control.title}</h3><p>{control.requirement}</p><small>{control.failureEffect}</small></article>)}</div>
              <div className="section-heading compact"><div><p>Registry glossary</p><h2>Shared language for evidence-backed governance profiles.</h2></div><Badge tone="gold">{REGISTRY_GLOSSARY.length} TERMS</Badge></div>
              <div className="glossary-grid">{REGISTRY_GLOSSARY.map((entry) => <article key={entry.id}><span>{entry.id}</span><h3>{entry.term}</h3><p>{entry.definition}</p></article>)}</div>
            </section>
          )}

          {view === "verification" && (
            <section className="view-panel">
              <div className="section-heading"><div><p>Registration verification matrix</p><h2>Publication depends on parity, not presentation.</h2></div><Link className="button secondary" href="/artifacts/verify">Open full Verification Center</Link></div>
              <div className="verification-grid">{REGISTRATION_CHECKS.map((check, index) => <article key={check.id}><div className="check-number">{String(index + 1).padStart(2, "0")}</div><div><span>{check.id}</span><h3>{check.title}</h3><p>{check.description}</p></div><Badge tone="verified">REQUIRED</Badge></article>)}</div>
              <div className="runtime-ledger"><div className="section-heading compact"><div><p>Runtime correspondence</p><h2>Twenty-four links remain inspectable at registration.</h2></div></div>{RUNTIME_LINKS.map((link) => <article key={link.number}><span>{link.number}</span><div><strong>{link.code}</strong><small>{link.title}</small></div><p>{link.description}</p><Badge tone="neutral">INSPECTABLE</Badge></article>)}</div>
            </section>
          )}

          {view === "ledger" && (
            <section className="view-panel">
              <div className="section-heading"><div><p>Append-only registry ledger</p><h2>Publication, verification, challenge, correction, and supersession remain visible.</h2></div></div>
              <div className="ledger-timeline">
                {REGISTERED_ARTIFACTS.flatMap((record, index) => [
                  { id: `${record.registryId}-A`, time: record.publishedAt, event: "REGISTRY_ENTRY_CREATED", subject: record.registryId, detail: `${record.artifactId} linked to ${record.governanceRegistryId}.` },
                  { id: `${record.registryId}-B`, time: record.publishedAt, event: "VERIFICATION_LEVEL_RECORDED", subject: record.artifactId, detail: `${record.verificationLevel} artifact verification level preserved.` },
                ]).map((event, index) => <article key={event.id}><span className="ledger-dot" /><div className="ledger-time"><strong>{String(index + 1).padStart(2, "0")}</strong><small>{formatRegistryDateTime(event.time)}</small></div><div className="ledger-event"><Badge tone={event.event.includes("VERIFICATION") ? "verified" : "gold"}>{event.event}</Badge><h3>{event.subject}</h3><p>{event.detail}</p></div></article>)}
              </div>
            </section>
          )}

          {view === "analytics" && (
            <section className="view-panel">
              <div className="section-heading"><div><p>Evidence analytics</p><h2>What the founding proof set demonstrates—and what it does not.</h2></div></div>
              <div className="analytics-grid">
                <article className="analytics-card wide"><span>Determination distribution</span><div className="bar-chart">{DETERMINATIONS.map((item) => { const count = FOUNDING_ARTIFACTS.filter((record) => record.determination === item).length; return <div key={item}><label><strong>{item}</strong><span>{count}</span></label><div><i className={toneForDetermination(item)} style={{ width: `${(count / FOUNDING_ARTIFACTS.length) * 100}%` }} /></div></div>; })}</div></article>
                <article className="analytics-card"><span>Sector coverage</span><strong>{new Set(FOUNDING_ARTIFACTS.map((item) => item.sector)).size}</strong><p>Materially different sector contexts represented in the founding set.</p></article>
                <article className="analytics-card"><span>Governance linkage</span><strong>100%</strong><p>Founding artifacts linked to a permanent governance registry identity.</p></article>
                <article className="analytics-card"><span>Verification floor</span><strong>L6</strong><p>Every founding record includes preserved outcome-closure evidence.</p></article>
                <article className="analytics-card"><span>Challengeability</span><strong>12/12</strong><p>Every artifact exposes a challenge and correction route.</p></article>
                <article className="analytics-card"><span>External governance artifacts</span><strong>{EXTERNAL_REGISTERED_ARTIFACTS.length}</strong><p>Harmonic Constitutional Runtime is the first outside governance architecture with a registered execution artifact connected to its permanent governance identity.</p></article>
                <article className="analytics-card statement"><span>Bounded conclusion</span><h3>The founding set proves that TA-14 can produce materially different, inspectable records across all four determinations. The Harmonic record separately demonstrates that the Exchange can preserve an outside architecture's bounded execution evidence without absorbing its identity or overstating the finding.</h3><p>Neither set proves universal performance, legal compliance in every jurisdiction, or behavior beyond the preserved evidence boundaries.</p></article>
              </div>
            </section>
          )}
        </div>
      </section>

      <section className="closing-callout">
        <div><p>THE STANDARD IS NOW AVAILABLE</p><h2>You should not have to tell the world who you are. You should be able to prove it.</h2><span>Register your governance, build a route, generate a bounded artifact, verify the package, and submit the evidence history for registration.</span></div>
        <div className="closing-actions"><Link className="button gold" href="/workspace/ai-governance/registry/register">Register governance</Link><Link className="button primary" href="/workspace/artifacts/build">Build an artifact</Link><button className="button secondary" onClick={() => changeView("register")}>Register artifact</button></div>
      </section>

      <footer className="registry-footer"><div><strong>TA-14 Execution Artifact Registry</strong><span>Door Eight of the TA-14 AI Governance Exchange</span></div><nav><Link href="/artifacts">Library</Link><Link href="/artifacts/verify">Verification</Link><Link href="/artifacts/challenge">Challenge</Link><Link href="/">Exchange</Link></nav><p>No admissible evidence. No admissible execution.</p></footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; background: #02060c; }
        :global(body) { margin: 0; background: #02060c; color: #eef8ff; }
        :global(button), :global(input), :global(select), :global(textarea) { font: inherit; }
        :global(a) { color: inherit; text-decoration: none; }
        .registry-root { --gold: #f4ba54; --gold-soft: rgba(244,186,84,.18); --blue: #63d8ff; --cyan: #8ff3ff; --green: #67efb0; --red: #ff6d78; --violet: #ba91ff; --ink: #02060c; --panel: rgba(7,18,31,.86); min-height: 100vh; position: relative; overflow: hidden; background: radial-gradient(circle at 70% 8%, rgba(26,109,158,.22), transparent 28%), radial-gradient(circle at 18% 28%, rgba(244,186,84,.11), transparent 25%), linear-gradient(180deg, #02060c 0%, #06111d 44%, #02060c 100%); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .ambient { position: absolute; border-radius: 50%; filter: blur(100px); opacity: .22; pointer-events: none; }
        .ambient-one { width: 600px; height: 600px; right: -220px; top: 360px; background: #00a8ff; }
        .ambient-two { width: 520px; height: 520px; left: -240px; top: 1050px; background: #d8993a; }
        .grid-plane { position: absolute; inset: 0; opacity: .16; pointer-events: none; background-image: linear-gradient(rgba(95,205,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(95,205,255,.08) 1px, transparent 1px); background-size: 64px 64px; mask-image: linear-gradient(to bottom, black, transparent 80%); }
        .registry-header { min-height: 78px; position: relative; z-index: 20; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 28px; padding: 0 4vw; border-bottom: 1px solid rgba(143,222,255,.13); background: rgba(2,7,13,.88); backdrop-filter: blur(24px); }
        .brand { display: flex; align-items: center; gap: 12px; }
        .brand-mark { width: 44px; height: 44px; display: grid; place-items: center; border: 1px solid rgba(244,186,84,.62); border-radius: 13px; color: var(--gold); font-weight: 900; background: linear-gradient(145deg, rgba(244,186,84,.2), rgba(12,23,37,.9)); box-shadow: 0 0 34px rgba(244,186,84,.12), inset 0 0 18px rgba(244,186,84,.08); }
        .brand strong, .brand small { display: block; }
        .brand strong { letter-spacing: .18em; font-size: .92rem; }
        .brand small { margin-top: 3px; color: #87a8bd; font-size: .68rem; letter-spacing: .11em; text-transform: uppercase; }
        .header-nav { justify-self: center; display: flex; gap: 28px; color: #9ab6c8; font-size: .82rem; }
        .header-nav a:hover { color: white; }
        .header-action { border: 1px solid rgba(244,186,84,.45); border-radius: 999px; background: rgba(244,186,84,.12); color: #ffe4a8; padding: 11px 18px; cursor: pointer; font-weight: 800; }
        .hero { position: relative; z-index: 2; max-width: 1560px; margin: 0 auto; min-height: 760px; display: grid; grid-template-columns: 1.05fr .95fr; align-items: center; gap: 70px; padding: 90px 5vw 70px; }
        .hero-copy { max-width: 790px; }
        .eyebrow { color: var(--blue); letter-spacing: .22em; font-weight: 900; font-size: .74rem; margin: 24px 0 14px; }
        .hero h1 { font-size: clamp(3rem, 5vw, 6.3rem); line-height: .98; letter-spacing: -.055em; margin: 0; text-wrap: balance; background: linear-gradient(180deg, #fff, #cceaff 62%, #7a9db3); -webkit-background-clip: text; color: transparent; }
        .hero-lead { max-width: 760px; margin: 28px 0 0; color: #a8c2d3; font-size: 1.08rem; line-height: 1.8; }
        .hero-actions, .closing-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
        .button { min-height: 48px; display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; padding: 0 20px; font-weight: 850; cursor: pointer; border: 1px solid transparent; transition: transform .2s ease, border-color .2s ease, background .2s ease; }
        .button:hover { transform: translateY(-2px); }
        .button:disabled { opacity: .35; cursor: not-allowed; transform: none; }
        .primary { background: linear-gradient(135deg, #198ec9, #55d7ff); color: #00111b; box-shadow: 0 15px 45px rgba(56,188,244,.2); }
        .secondary { background: rgba(69,161,205,.11); color: #ccefff; border-color: rgba(86,205,255,.32); }
        .ghost { background: rgba(255,255,255,.025); color: #a7c1d2; border-color: rgba(255,255,255,.1); }
        .gold { background: linear-gradient(135deg, #f4ba54, #ffe2a1); color: #251300; box-shadow: 0 15px 45px rgba(244,186,84,.2); }
        .hero-principle { margin-top: 32px; padding-left: 18px; border-left: 2px solid var(--gold); }
        .hero-principle span, .hero-principle strong { display: block; }
        .hero-principle span { color: #7897aa; text-transform: uppercase; letter-spacing: .18em; font-size: .67rem; }
        .hero-principle strong { margin-top: 7px; color: #f8d99c; font-family: Georgia, serif; font-size: 1.16rem; }
        .hero-engine { position: relative; min-height: 590px; display: grid; place-items: center; perspective: 1200px; }
        .hero-engine:before { content: ""; position: absolute; width: 78%; height: 36%; bottom: 4%; border-radius: 50%; background: radial-gradient(ellipse, rgba(62,195,255,.2), transparent 68%); transform: rotateX(68deg); filter: blur(4px); }
        .engine-orbit { position: absolute; border-radius: 50%; border: 1px solid rgba(98,211,255,.26); box-shadow: inset 0 0 46px rgba(45,172,235,.04), 0 0 44px rgba(45,172,235,.05); animation: orbit 24s linear infinite; }
        .orbit-one { width: 500px; height: 500px; }
        .orbit-two { width: 350px; height: 350px; border-color: rgba(244,186,84,.28); animation-direction: reverse; animation-duration: 18s; }
        .engine-core { position: relative; z-index: 3; width: 230px; height: 230px; display: grid; place-content: center; text-align: center; border-radius: 50%; border: 1px solid rgba(113,221,255,.42); background: radial-gradient(circle at 50% 35%, rgba(70,191,244,.22), rgba(3,14,24,.96) 67%); box-shadow: 0 0 90px rgba(54,188,244,.2), inset 0 0 50px rgba(44,175,232,.15); }
        .engine-core:before, .engine-core:after { content: ""; position: absolute; border-radius: 50%; border: 1px dashed rgba(158,232,255,.2); inset: 14px; animation: orbit 14s linear infinite; }
        .engine-core:after { inset: 30px; border-color: rgba(244,186,84,.25); animation-direction: reverse; }
        .engine-core span { color: var(--blue); font-size: .68rem; letter-spacing: .28em; font-weight: 900; }
        .engine-core strong { font-size: 5.5rem; line-height: .95; font-family: Georgia, serif; color: white; text-shadow: 0 0 34px rgba(84,207,255,.5); }
        .engine-core small { color: #9fb9ca; text-transform: uppercase; letter-spacing: .13em; }
        .orbit-node { position: absolute; z-index: 4; width: 150px; min-height: 76px; text-align: left; border: 1px solid rgba(105,210,255,.24); border-radius: 14px; background: linear-gradient(145deg, rgba(11,31,50,.94), rgba(4,13,23,.94)); color: white; padding: 12px; cursor: pointer; box-shadow: 0 18px 50px rgba(0,0,0,.35); transition: transform .2s ease, border-color .2s ease; }
        .orbit-node:hover { transform: translateY(-4px) scale(1.02); border-color: var(--blue); }
        .orbit-node span, .orbit-node strong { display: block; }
        .orbit-node span { color: var(--gold); font-family: Georgia, serif; font-size: 1.2rem; }
        .orbit-node strong { margin-top: 4px; font-size: .77rem; line-height: 1.3; }
        .node-1 { top: 3%; left: 34%; } .node-2 { top: 19%; right: 2%; } .node-3 { bottom: 20%; right: 0; } .node-4 { bottom: 2%; left: 34%; } .node-5 { bottom: 20%; left: 0; } .node-6 { top: 19%; left: 2%; }
        .metrics { position: relative; z-index: 3; max-width: 1540px; margin: 0 auto 30px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; padding: 0 5vw; }
        .metrics article { min-height: 130px; padding: 22px; border: 1px solid rgba(116,200,239,.14); border-radius: 16px; background: linear-gradient(145deg, rgba(8,24,39,.9), rgba(4,13,23,.82)); box-shadow: 0 18px 55px rgba(0,0,0,.2); }
        .metrics span, .metrics strong, .metrics small { display: block; }
        .metrics span { color: #7093aa; text-transform: uppercase; letter-spacing: .15em; font-size: .64rem; }
        .metrics strong { margin-top: 10px; font-size: 2.35rem; font-family: Georgia, serif; }
        .metrics small { margin-top: 8px; color: #8da9ba; line-height: 1.4; }
        .workflow-strip { position: relative; z-index: 3; max-width: 1540px; margin: 24px auto 70px; padding: 0 5vw; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .workflow-stage { min-height: 155px; display: grid; grid-template-columns: auto 1fr auto; gap: 14px; padding: 20px; border: 1px solid rgba(255,255,255,.09); border-radius: 16px; background: rgba(6,17,29,.72); transition: transform .2s ease, border-color .2s ease, background .2s ease; }
        .workflow-stage:hover { transform: translateY(-4px); border-color: rgba(92,211,255,.36); background: rgba(10,30,49,.9); }
        .workflow-stage > span { color: var(--gold); font-family: Georgia, serif; font-size: 1.5rem; }
        .workflow-stage strong, .workflow-stage small { display: block; }
        .workflow-stage strong { font-size: .9rem; }
        .workflow-stage small { margin-top: 8px; color: #7898ac; line-height: 1.5; }
        .workflow-stage b { align-self: end; color: var(--blue); }
        .workspace { position: relative; z-index: 4; max-width: 1640px; margin: 0 auto; display: grid; grid-template-columns: 280px minmax(0,1fr); gap: 18px; padding: 0 4vw 90px; }
        .workspace-nav { position: sticky; top: 95px; align-self: start; border: 1px solid rgba(100,200,245,.16); border-radius: 18px; padding: 14px; background: rgba(4,14,24,.9); backdrop-filter: blur(18px); }
        .workspace-nav > p { color: #67889c; margin: 4px 8px 12px; text-transform: uppercase; letter-spacing: .2em; font-size: .64rem; }
        .workspace-nav button { width: 100%; text-align: left; border: 1px solid transparent; border-radius: 12px; background: transparent; color: #91adbd; padding: 13px; cursor: pointer; }
        .workspace-nav button + button { margin-top: 4px; }
        .workspace-nav button.active { color: white; border-color: rgba(82,207,255,.25); background: linear-gradient(135deg, rgba(31,139,188,.2), rgba(13,42,65,.38)); box-shadow: inset 3px 0 0 var(--blue); }
        .workspace-nav button span, .workspace-nav button small { display: block; }
        .workspace-nav button span { font-weight: 800; }
        .workspace-nav button small { margin-top: 4px; color: #668699; font-size: .7rem; }
        .workspace-note { margin-top: 16px; padding: 16px; border-radius: 12px; border: 1px solid rgba(244,186,84,.18); background: rgba(244,186,84,.06); }
        .workspace-note strong { color: #f4ca7b; }
        .workspace-note p { color: #8ea4b1; font-size: .75rem; line-height: 1.55; }
        .workspace-main { min-width: 0; }
        .view-panel { min-height: 900px; border: 1px solid rgba(105,202,245,.15); border-radius: 24px; background: linear-gradient(145deg, rgba(7,22,36,.92), rgba(3,11,20,.94)); padding: clamp(22px, 3vw, 48px); box-shadow: 0 30px 100px rgba(0,0,0,.32), inset 0 1px 0 rgba(255,255,255,.03); }
        .section-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 30px; }
        .section-heading.compact { margin-top: 42px; }
        .section-heading p { margin: 0 0 8px; color: var(--blue); font-size: .68rem; letter-spacing: .2em; text-transform: uppercase; font-weight: 900; }
        .section-heading h2 { margin: 0; max-width: 900px; font-size: clamp(1.8rem, 3vw, 3.4rem); letter-spacing: -.04em; line-height: 1.08; }
        .badge { display: inline-flex; align-items: center; min-height: 28px; padding: 0 10px; border: 1px solid rgba(255,255,255,.12); border-radius: 999px; font-size: .62rem; font-weight: 950; letter-spacing: .12em; white-space: nowrap; }
        .badge-gold { color: #ffd98d; border-color: rgba(244,186,84,.35); background: rgba(244,186,84,.1); }
        .badge-allow, .badge-verified { color: #8af6c3; border-color: rgba(86,232,164,.3); background: rgba(55,201,140,.1); }
        .badge-hold { color: #ffd486; border-color: rgba(255,191,75,.3); background: rgba(255,183,48,.1); }
        .badge-deny { color: #ff9ba3; border-color: rgba(255,93,105,.3); background: rgba(255,72,87,.1); }
        .badge-escalate { color: #d0b4ff; border-color: rgba(184,134,255,.32); background: rgba(160,102,244,.11); }
        .badge-neutral { color: #9fc5d9; background: rgba(93,155,187,.09); }
        .command-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .command-card { min-height: 260px; padding: 24px; border: 1px solid rgba(119,204,242,.13); border-radius: 18px; background: linear-gradient(145deg, rgba(12,32,49,.78), rgba(4,13,23,.88)); }
        .command-card.dominant { grid-column: span 2; }
        .card-label { color: #7195a9; letter-spacing: .15em; text-transform: uppercase; font-size: .64rem; }
        .command-card h3 { margin: 14px 0 10px; font-size: 1.45rem; }
        .command-card p { color: #89a5b6; line-height: 1.65; }
        .determination-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-top: 24px; }
        .determination-box { min-height: 90px; display: grid; place-content: center; text-align: center; border: 1px solid rgba(255,255,255,.09); border-radius: 12px; background: rgba(255,255,255,.025); }
        .determination-box strong { font-size: 1.8rem; font-family: Georgia, serif; }
        .determination-box span { margin-top: 4px; font-size: .65rem; letter-spacing: .12em; }
        .determination-box.allow { color: var(--green); } .determination-box.hold { color: var(--gold); } .determination-box.deny { color: var(--red); } .determination-box.escalate { color: var(--violet); }
        .command-actions { display: flex; gap: 10px; margin-top: 20px; }
        .command-actions a, .command-actions button, .text-action { border: 0; background: transparent; color: var(--blue); cursor: pointer; padding: 0; font-weight: 850; }
        .meter { margin-top: 18px; }
        .meter-top { display: flex; justify-content: space-between; color: #8facbd; font-size: .75rem; }
        .meter-track { height: 7px; margin-top: 8px; border-radius: 99px; background: rgba(255,255,255,.06); overflow: hidden; }
        .meter-track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #1687bd, #60dcff); box-shadow: 0 0 16px rgba(73,209,255,.35); }
        .muted { color: #6f8999 !important; font-size: .78rem; }
        .chain-stage { margin-top: 22px; padding: 24px; border-radius: 18px; border: 1px solid rgba(244,186,84,.13); background: rgba(244,186,84,.035); }
        .chain-row { display: grid; grid-template-columns: repeat(8,1fr); gap: 8px; }
        .chain-node { min-height: 110px; display: flex; flex-direction: column; justify-content: space-between; padding: 13px; border: 1px solid rgba(92,196,235,.14); border-radius: 12px; background: rgba(7,23,37,.84); }
        .chain-node span { color: var(--gold); font-family: Georgia, serif; font-size: 1.15rem; }
        .chain-node strong { writing-mode: vertical-rl; transform: rotate(180deg); align-self: center; color: #b9d6e6; font-size: .62rem; letter-spacing: .09em; }
        .chain-node small { color: var(--blue); align-self: flex-end; }
        .filter-bar { display: grid; grid-template-columns: minmax(260px,1fr) repeat(4,auto); gap: 10px; margin-bottom: 20px; }
        input, select, textarea { width: 100%; border: 1px solid rgba(106,190,229,.18); border-radius: 11px; background: rgba(1,9,16,.75); color: #eafbff; padding: 12px 13px; outline: none; }
        input:focus, select:focus, textarea:focus { border-color: rgba(85,209,255,.55); box-shadow: 0 0 0 3px rgba(58,190,241,.08); }
        textarea { min-height: 120px; resize: vertical; }
        .directory-layout { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(340px,.6fr); gap: 16px; }
        .record-list { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
        .record-card { text-align: left; min-height: 230px; border: 1px solid rgba(104,191,231,.12); border-radius: 16px; background: rgba(7,22,36,.72); color: white; padding: 19px; cursor: pointer; transition: transform .2s ease, border-color .2s ease, background .2s ease; }
        .record-card:hover, .record-card.selected { transform: translateY(-3px); border-color: rgba(84,207,255,.44); background: rgba(12,35,55,.9); }
        .record-top { display: flex; align-items: center; gap: 8px; }
        .record-top > span { flex: 1; color: #67889b; font-size: .65rem; }
        .record-card h3 { margin: 18px 0 9px; font-size: 1rem; }
        .record-card p { color: #7f9daf; font-size: .78rem; line-height: 1.55; }
        .record-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 18px; }
        .record-meta span { border: 1px solid rgba(255,255,255,.08); border-radius: 999px; padding: 5px 8px; color: #7292a5; font-size: .6rem; }
        .record-inspector { position: sticky; top: 95px; align-self: start; padding: 24px; border: 1px solid rgba(244,186,84,.2); border-radius: 18px; background: linear-gradient(145deg, rgba(18,36,50,.94), rgba(4,13,22,.96)); box-shadow: 0 24px 70px rgba(0,0,0,.32); }
        .inspector-header { display: flex; justify-content: space-between; gap: 10px; align-items: center; }
        .inspector-header > span { color: #7996a7; font-size: .68rem; }
        .record-inspector h2 { margin: 20px 0 10px; font-size: 1.65rem; }
        .record-inspector > p { color: #8ba8b9; line-height: 1.6; }
        dl { margin: 22px 0; }
        dl > div { display: grid; grid-template-columns: 120px 1fr; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.06); }
        dt { color: #6b8a9d; font-size: .68rem; } dd { margin: 0; color: #d8edf8; font-size: .75rem; word-break: break-word; }
        .proof-box { padding: 15px; border: 1px solid rgba(70,224,157,.16); border-radius: 12px; background: rgba(48,190,128,.06); }
        .proof-box.boundary { margin-top: 9px; border-color: rgba(244,186,84,.17); background: rgba(244,186,84,.05); }
        .proof-box strong { font-size: .72rem; } .proof-box p { color: #819dad; font-size: .73rem; line-height: 1.55; }
        .inspector-actions { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-top: 18px; }
        .inspector-actions .button { padding: 0 10px; font-size: .7rem; }
        .download-button { width: 100%; margin-top: 9px; border: 1px solid rgba(255,255,255,.1); border-radius: 10px; background: rgba(255,255,255,.03); color: #9fb9c9; padding: 11px; cursor: pointer; }
        .intake-warning { margin-bottom: 20px; padding: 16px 18px; border: 1px solid rgba(244,186,84,.25); border-radius: 13px; background: rgba(244,186,84,.07); }
        .intake-warning strong { color: #ffd88a; } .intake-warning p { margin: 7px 0 0; color: #96a9b4; font-size: .78rem; }
        .stepper { display: grid; grid-template-columns: repeat(6,1fr); gap: 8px; margin-bottom: 24px; }
        .stepper button { min-height: 76px; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; background: rgba(255,255,255,.02); color: #7896a9; cursor: pointer; }
        .stepper button.active { color: white; border-color: rgba(85,209,255,.4); background: rgba(47,170,220,.12); }
        .stepper button.complete { color: var(--green); border-color: rgba(70,220,158,.2); }
        .stepper span, .stepper small { display: block; } .stepper span { font-family: Georgia, serif; font-size: 1.25rem; } .stepper small { margin-top: 5px; font-size: .63rem; }
        .form-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }
        .form-grid label > span, .package-summary label > span { display: block; margin-bottom: 7px; color: #7998aa; font-size: .7rem; }
        .form-grid .wide { grid-column: 1/-1; }
        .form-callout { grid-column: 1/-1; padding: 20px; border: 1px solid rgba(82,208,255,.16); border-radius: 14px; background: rgba(41,149,195,.06); }
        .form-callout p { color: #839ead; } .form-callout a { color: var(--blue); font-weight: 850; }
        .parity-card { grid-column: 1/-1; padding: 20px; border-radius: 14px; border: 1px solid rgba(66,225,160,.2); background: rgba(53,203,139,.06); }
        .parity-card.fail { border-color: rgba(255,87,99,.25); background: rgba(255,70,85,.06); }
        .parity-card p { color: #839ead; }
        .package-summary { display: grid; grid-template-columns: 1fr 1fr auto; align-items: end; gap: 16px; margin-bottom: 18px; padding: 18px; border: 1px solid rgba(255,255,255,.08); border-radius: 14px; background: rgba(255,255,255,.02); }
        .package-summary button { min-height: 44px; border: 1px solid rgba(82,208,255,.25); border-radius: 10px; background: rgba(47,169,217,.1); color: #bfeeff; cursor: pointer; }
        .package-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
        .package-grid label { display: grid; grid-template-columns: auto auto 1fr; gap: 12px; align-items: start; min-height: 102px; padding: 14px; border: 1px solid rgba(255,255,255,.07); border-radius: 12px; background: rgba(255,255,255,.02); cursor: pointer; }
        .package-grid label.checked { border-color: rgba(65,224,158,.25); background: rgba(46,194,131,.05); }
        .package-grid input { width: auto; margin-top: 4px; }
        .package-grid > label > span { color: var(--gold); font-family: Georgia, serif; }
        .package-grid strong, .package-grid small { display: block; }
        .package-grid small { margin-top: 6px; color: #708fa1; line-height: 1.45; }
        .attestation-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .attestation-copy, .validation-list { padding: 24px; border: 1px solid rgba(255,255,255,.08); border-radius: 16px; background: rgba(255,255,255,.02); }
        .attestation-copy p { color: #8ba6b6; line-height: 1.7; }
        .attestation-check { display: flex; gap: 10px; align-items: flex-start; padding: 14px; border-radius: 11px; background: rgba(255,255,255,.03); }
        .attestation-check input { width: auto; margin-top: 3px; }
        .validation-error, .validation-pass { display: flex; gap: 12px; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,.06); }
        .validation-error span { color: var(--red); } .validation-pass span { color: var(--green); }
        .validation-error p, .validation-pass p { margin: 0; color: #89a4b5; font-size: .78rem; }
        .intake-controls { display: flex; justify-content: space-between; gap: 12px; margin-top: 24px; }
        .intake-controls > div { display: flex; gap: 8px; }
        .registry-message { margin-top: 14px; padding: 14px; border: 1px solid rgba(244,186,84,.22); border-radius: 11px; color: #f4d493; background: rgba(244,186,84,.06); }
        .local-receipts { margin-top: 24px; }
        .local-receipts article { display: grid; grid-template-columns: 1fr 1fr auto; gap: 14px; align-items: center; padding: 14px; border-bottom: 1px solid rgba(255,255,255,.07); }
        .local-receipts article > div strong, .local-receipts article > div small { display: block; margin-top: 5px; }
        .local-receipts small { color: #6f8d9f; }
        .local-receipts button { border: 1px solid rgba(83,207,255,.2); border-radius: 9px; background: rgba(50,170,220,.08); color: #bcecff; padding: 10px; cursor: pointer; }
        .governance-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .governance-card, .governance-invitation { min-height: 540px; padding: 30px; border: 1px solid rgba(92,196,236,.15); border-radius: 20px; background: rgba(7,23,37,.75); }
        .governance-head { display: flex; justify-content: space-between; align-items: center; }
        .governance-head > span { color: #7794a6; font-size: .72rem; }
        .governance-card h3, .governance-invitation h3 { margin: 24px 0 10px; font-size: 2rem; }
        .governance-card p, .governance-invitation p, .governance-invitation li { color: #86a2b3; line-height: 1.65; }
        .governance-card > small { color: #68889b; }
        .sector-tags { display: flex; flex-wrap: wrap; gap: 7px; margin: 24px 0; }
        .sector-tags span { border: 1px solid rgba(255,255,255,.08); border-radius: 999px; padding: 6px 9px; color: #84a5b8; font-size: .65rem; }
        .governance-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 9px; margin: 24px 0; }
        .governance-stats div { padding: 16px; border-radius: 12px; background: rgba(255,255,255,.03); }
        .governance-stats strong, .governance-stats span { display: block; } .governance-stats strong { font-size: 1.55rem; } .governance-stats span { margin-top: 4px; color: #6d8b9e; font-size: .65rem; }
        .governance-card > a { color: var(--blue); font-weight: 850; }
        .governance-invitation { border-color: rgba(244,186,84,.18); background: linear-gradient(145deg, rgba(244,186,84,.06), rgba(7,23,37,.82)); }
        .governance-invitation > span { color: var(--gold); letter-spacing: .18em; font-size: .67rem; font-weight: 900; }
        .standard-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        .standard-grid article { min-height: 210px; padding: 18px; border: 1px solid rgba(255,255,255,.07); border-radius: 14px; background: rgba(255,255,255,.02); }
        .standard-grid article > span { color: var(--gold); font-family: Georgia, serif; }
        .standard-grid h3 { font-size: .92rem; }
        .standard-grid p { color: #7896a8; font-size: .75rem; line-height: 1.55; }
        .component-table article { display: grid; grid-template-columns: 80px minmax(0,1fr) auto; gap: 16px; align-items: center; padding: 16px; border-bottom: 1px solid rgba(255,255,255,.07); }
        .control-library { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
        .control-library article { min-height: 230px; padding: 18px; border: 1px solid rgba(92,196,236,.1); border-radius: 14px; background: rgba(255,255,255,.02); }
        .control-library article > div { display: flex; justify-content: space-between; gap: 8px; align-items: center; }
        .control-library article > div > span { color: var(--gold); font-family: Georgia, serif; font-size: .72rem; }
        .control-library h3 { margin: 18px 0 9px; font-size: .9rem; }
        .control-library p { color: #7c99aa; font-size: .74rem; line-height: 1.55; }
        .control-library small { display: block; margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,.06); color: #668697; line-height: 1.5; }
        .glossary-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; }
        .glossary-grid article { min-height: 190px; padding: 17px; border: 1px solid rgba(244,186,84,.1); border-radius: 14px; background: rgba(244,186,84,.025); }
        .glossary-grid article > span { color: var(--gold); font-size: .62rem; letter-spacing: .08em; }
        .glossary-grid h3 { margin: 15px 0 8px; font-size: .9rem; }
        .glossary-grid p { color: #7895a6; font-size: .74rem; line-height: 1.55; }
        .component-table article > span { color: var(--gold); font-family: Georgia, serif; }
        .component-table strong { display: block; } .component-table p { margin: 5px 0 0; color: #7895a7; font-size: .75rem; }
        .verification-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
        .verification-grid article { display: grid; grid-template-columns: auto 1fr auto; gap: 15px; min-height: 145px; padding: 18px; border: 1px solid rgba(255,255,255,.07); border-radius: 14px; background: rgba(255,255,255,.02); }
        .check-number { color: var(--gold); font-family: Georgia, serif; font-size: 1.8rem; }
        .verification-grid article span { color: #698a9e; font-size: .65rem; }
        .verification-grid h3 { margin: 5px 0; font-size: .95rem; }
        .verification-grid p { color: #7896a8; font-size: .75rem; line-height: 1.5; }
        .runtime-ledger { margin-top: 38px; }
        .runtime-ledger > article { display: grid; grid-template-columns: 60px 180px 1fr auto; gap: 16px; align-items: center; padding: 14px 8px; border-bottom: 1px solid rgba(255,255,255,.07); }
        .runtime-ledger > article > span { color: var(--gold); font-family: Georgia, serif; font-size: 1.2rem; }
        .runtime-ledger strong, .runtime-ledger small { display: block; } .runtime-ledger small { margin-top: 3px; color: #6c899a; }
        .runtime-ledger p { color: #819eae; font-size: .76rem; }
        .ledger-timeline { position: relative; padding-left: 18px; }
        .ledger-timeline:before { content: ""; position: absolute; left: 25px; top: 0; bottom: 0; width: 1px; background: linear-gradient(var(--gold), var(--blue), transparent); }
        .ledger-timeline article { position: relative; display: grid; grid-template-columns: 18px 190px 1fr; gap: 20px; min-height: 130px; }
        .ledger-dot { width: 15px; height: 15px; margin-top: 9px; border-radius: 50%; background: var(--blue); box-shadow: 0 0 20px rgba(86,210,255,.55); z-index: 2; }
        .ledger-time strong, .ledger-time small { display: block; } .ledger-time strong { color: var(--gold); font-family: Georgia, serif; } .ledger-time small { margin-top: 7px; color: #68889b; font-size: .68rem; }
        .ledger-event h3 { margin: 10px 0 5px; } .ledger-event p { margin: 0; color: #7e9cad; font-size: .76rem; }
        .analytics-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
        .analytics-card { min-height: 210px; padding: 22px; border: 1px solid rgba(255,255,255,.08); border-radius: 16px; background: rgba(255,255,255,.025); }
        .analytics-card.wide { grid-column: span 2; grid-row: span 2; }
        .analytics-card.statement { grid-column: span 2; border-color: rgba(244,186,84,.17); background: rgba(244,186,84,.05); }
        .analytics-card > span { color: #6f91a5; text-transform: uppercase; letter-spacing: .14em; font-size: .64rem; }
        .analytics-card > strong { display: block; margin-top: 22px; font-size: 3.4rem; font-family: Georgia, serif; }
        .analytics-card p { color: #819dae; line-height: 1.6; }
        .analytics-card h3 { font-size: 1.35rem; line-height: 1.4; }
        .bar-chart { margin-top: 25px; }
        .bar-chart > div { margin-top: 16px; }
        .bar-chart label { display: flex; justify-content: space-between; font-size: .72rem; }
        .bar-chart label strong { letter-spacing: .1em; }
        .bar-chart > div > div { height: 12px; margin-top: 7px; border-radius: 99px; background: rgba(255,255,255,.05); overflow: hidden; }
        .bar-chart i { display: block; height: 100%; border-radius: inherit; }
        .bar-chart i.allow { background: var(--green); } .bar-chart i.hold { background: var(--gold); } .bar-chart i.deny { background: var(--red); } .bar-chart i.escalate { background: var(--violet); }
        .closing-callout { position: relative; z-index: 3; max-width: 1510px; margin: 0 auto 70px; padding: 48px; border: 1px solid rgba(244,186,84,.24); border-radius: 24px; background: radial-gradient(circle at 80% 20%, rgba(65,188,238,.12), transparent 35%), linear-gradient(135deg, rgba(244,186,84,.09), rgba(6,19,31,.94)); display: grid; grid-template-columns: 1.3fr .7fr; gap: 30px; align-items: center; }
        .closing-callout p { color: var(--gold); font-size: .68rem; letter-spacing: .2em; font-weight: 900; }
        .closing-callout h2 { margin: 0; font-size: clamp(2rem,4vw,4.2rem); line-height: 1.05; letter-spacing: -.045em; }
        .closing-callout span { display: block; margin-top: 18px; color: #8ca7b7; line-height: 1.7; }
        .closing-actions { justify-content: flex-end; }
        .registry-footer { position: relative; z-index: 3; min-height: 150px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 24px; padding: 30px 5vw; border-top: 1px solid rgba(255,255,255,.08); background: rgba(1,6,11,.8); }
        .registry-footer strong, .registry-footer span { display: block; } .registry-footer span { margin-top: 5px; color: #688699; font-size: .72rem; }
        .registry-footer nav { display: flex; gap: 22px; color: #8ca8b8; font-size: .75rem; }
        .registry-footer p { justify-self: end; color: var(--gold); font-family: Georgia, serif; }
        @keyframes orbit { to { transform: rotate(360deg); } }
        @media (max-width: 1250px) {
          .hero { grid-template-columns: 1fr; } .hero-engine { min-height: 560px; } .metrics { grid-template-columns: repeat(3,1fr); } .workflow-strip { grid-template-columns: repeat(2,1fr); } .workspace { grid-template-columns: 230px 1fr; } .command-grid { grid-template-columns: repeat(2,1fr); } .standard-grid { grid-template-columns: repeat(3,1fr); } .control-library { grid-template-columns: repeat(2,1fr); } .glossary-grid { grid-template-columns: repeat(2,1fr); } .analytics-grid { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 900px) {
          .registry-header { grid-template-columns: 1fr auto; } .header-nav { display: none; } .hero { padding-top: 60px; } .hero-engine { transform: scale(.86); margin: -40px 0; } .metrics { grid-template-columns: repeat(2,1fr); } .workspace { display: block; } .workspace-nav { position: relative; top: auto; display: grid; grid-template-columns: repeat(2,1fr); margin-bottom: 14px; } .workspace-nav > p, .workspace-note { grid-column: 1/-1; } .directory-layout, .governance-layout, .attestation-panel, .closing-callout { grid-template-columns: 1fr; } .record-inspector { position: relative; top: auto; } .standard-grid { grid-template-columns: repeat(2,1fr); } .package-summary { grid-template-columns: 1fr; } .filter-bar { grid-template-columns: 1fr 1fr; } .filter-bar input { grid-column: 1/-1; } .registry-footer { grid-template-columns: 1fr; text-align: center; } .registry-footer nav { justify-content: center; } .registry-footer p { justify-self: center; }
        }
        @media (max-width: 640px) {
          .registry-header { padding: 0 16px; } .header-action { display: none; } .hero { padding: 45px 18px; } .hero h1 { font-size: 2.8rem; } .hero-engine { transform: scale(.62); margin: -100px -80px; } .metrics, .workflow-strip { grid-template-columns: 1fr; padding-left: 16px; padding-right: 16px; } .workspace { padding: 0 12px 60px; } .workspace-nav { grid-template-columns: 1fr; } .workspace-note { grid-column: auto; } .view-panel { padding: 18px; } .section-heading { display: block; } .section-heading > .badge, .section-heading > .button { margin-top: 14px; } .command-grid, .record-list, .form-grid, .package-grid, .verification-grid, .standard-grid, .control-library, .glossary-grid, .analytics-grid { grid-template-columns: 1fr; } .command-card.dominant, .analytics-card.wide, .analytics-card.statement { grid-column: auto; grid-row: auto; } .determination-row { grid-template-columns: repeat(2,1fr); } .chain-row { grid-template-columns: repeat(4,1fr); } .filter-bar { grid-template-columns: 1fr; } .filter-bar input { grid-column: auto; } .stepper { grid-template-columns: repeat(3,1fr); } .form-grid .wide { grid-column: auto; } .intake-controls { flex-direction: column; } .intake-controls > div { width: 100%; } .intake-controls .button { width: 100%; } .component-table article { grid-template-columns: 60px 1fr; } .component-table .badge { grid-column: 2; justify-self: start; } .runtime-ledger > article { grid-template-columns: 45px 1fr; } .runtime-ledger p, .runtime-ledger .badge { grid-column: 2; } .ledger-timeline article { grid-template-columns: 18px 1fr; } .ledger-time { grid-column: 2; } .ledger-event { grid-column: 2; } .closing-callout { margin: 0 12px 50px; padding: 28px; } .closing-actions { justify-content: flex-start; } .local-receipts article { grid-template-columns: 1fr; }
        }
        .header-actions{display:flex;align-items:center;gap:9px}.header-import{border:1px solid rgba(81,202,255,.35);background:rgba(19,108,164,.14);color:#bfeaff;border-radius:10px;padding:9px 12px;font:inherit;font-size:11px;font-weight:800;cursor:pointer}.header-import:hover{background:rgba(19,108,164,.25);border-color:rgba(81,202,255,.6)}
        .candidate-handoff{position:relative;z-index:4;max-width:1480px;margin:18px auto 0;padding:18px 22px;border:1px solid rgba(74,215,159,.32);border-radius:18px;background:linear-gradient(135deg,rgba(31,143,100,.15),rgba(27,93,153,.12));box-shadow:0 20px 60px rgba(0,0,0,.22);display:flex;align-items:center;justify-content:space-between;gap:20px}.candidate-handoff span{display:block;color:#72e1aa;font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.candidate-handoff strong{display:block;margin-top:5px;font-size:18px;color:#f1fff8;overflow-wrap:anywhere}.candidate-handoff p{margin:5px 0 0;color:#99adbd;font-size:12px}.candidate-actions{display:flex;gap:9px;flex-wrap:wrap}.candidate-actions button{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.055);color:#e6f4ff;border-radius:10px;padding:10px 12px;font:inherit;font-size:11px;font-weight:800;cursor:pointer}.candidate-actions button:hover{border-color:rgba(74,215,159,.5);background:rgba(74,215,159,.1)}
        @media(max-width:760px){.candidate-handoff{align-items:flex-start;flex-direction:column}.header-import{width:100%}}
      `}</style>
    </main>
  );
}
