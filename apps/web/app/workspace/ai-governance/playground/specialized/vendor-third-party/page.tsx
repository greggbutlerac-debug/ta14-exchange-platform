"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type EvidenceState = "AVAILABLE" | "STALE" | "MISSING" | "CHALLENGED";
type GateState = "PASS" | "REVIEW" | "FAIL";
type VendorTier = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
type TabId = "overview" | "registry" | "purpose" | "obligations" | "obligation-map" | "obligation-plan" | "acceptance" | "residual" | "monitoring" | "scenarios" | "challenge" | "record";

type VendorRecord = { id: string; name: string; version: string; stage: string; purpose: string; vendorRisk: VendorTier; approval: string; reviewedAt: string; reviewDue: string };
type ObligationRecord = { id: string; name: string; purpose: string; capability: string; domain: string; approval: string; conditions: string };
type EvidenceItem = { id: string; category: string; title: string; description: string; obligation: string; owner: string; state: EvidenceState; required: boolean };
type VendorGate = { id: string; order: number; title: string; question: string; failureEffect: Determination; section: string; state: GateState; evidenceIds: string[] };
type Scenario = { id: string; family: string; title: string; summary: string; trigger: string; expected: Determination; severity: VendorTier; recovery: string };
type Challenge = { id: string; title: string; submittedBy: string; basis: string; counterevidence: string; response: string; finding: string; status: "OPEN" | "UNDER REVIEW" | "SUSTAINED" | "REJECTED" | "SUPERSEDED" };
type ChangeRequest = { id: string; title: string; category: string; materiality: "MINOR" | "MATERIAL" | "CRITICAL"; status: string; owner: string; tests: string[] };
type RunRecord = { id: string; title: string; vendorId: string; decision: Determination; time: string; rationale: string };
type SavedState = { selectedVendorId: string; runName: string; purposeText: string; proposedUse: string; relationshipEnvironment: string; serviceDomain: string; contractReviewDays: string; selectedScenarioId: string; vendors: VendorRecord[]; obligations: ObligationRecord[]; evidence: EvidenceItem[]; gates: VendorGate[]; challenges: Challenge[]; changes: ChangeRequest[]; runs: RunRecord[] };

const STORAGE_KEY = "ta14-vendor-third-party-governance-playground-v5";
const VERSION = "VT-5.0";

const DETERMINATION_META: Record<Determination, { description: string; tone: string }> = {
  ALLOW: { description: "The exact vendor-bounded operation may proceed only where relationship, vendor identity, vendor credential, vendor access, service dependency, containment and notification, service restoration, monitoring, and evidence conditions are satisfied.", tone: "#57e9b1" },
  HOLD: { description: "The vendor determination must pause because relationship, vendor identity, vendor credential, vendor access, service dependency, incident, containment and notification, service restoration, or monitoring evidence is incomplete or stale.", tone: "#ffd36f" },
  DENY: { description: "The proposed action crosses a non-waivable third-party boundary, unauthorized vendor access, untrusted service dependency, containment and notification, service restoration, or execution boundary.", tone: "#ff6f7d" },
  ESCALATE: { description: "The unresolved third-party threat, vendor weakness, vendor identity, vendor access, service dependency, incident, containment and notification, or recovery conflict exceeds delegated vendor governance authority and requires vendor incident commander, vendor governance authority, or named higher review.", tone: "#c797ff" },
};

const TABS: Array<{ id: TabId; label: string; short: string }> = [
  { id: "overview", label: "Mission Control", short: "01" },
  { id: "registry", label: "Vendor Register", short: "02" },
  { id: "purpose", label: "Relationship & Boundary", short: "03" },
  { id: "obligations", label: "Contracts & Access", short: "04" },
  { id: "obligation-map", label: "Obligation Mapping", short: "05" },
  { id: "obligation-plan", label: "Control Assurance", short: "06" },
  { id: "acceptance", label: "Relationship Approval", short: "07" },
  { id: "residual", label: "Exit Readiness Validation", short: "08" },
  { id: "monitoring", label: "Continuous Vendor Monitoring", short: "09" },
  { id: "scenarios", label: "Scenario Lab", short: "10" },
  { id: "challenge", label: "Challenge", short: "11" },
  { id: "record", label: "Governed Record", short: "12" },
];

const INITIAL_VENDORS: VendorRecord[] = [
  {
    id: "vendorRisk-orion-ops",
    name: "Enterprise AI Vendor & Third-Party Register",
    version: "4.6.2",
    stage: "Production",
    purpose: "Govern approved third-party service relationships for bounded maintenance workflows",
    vendorRisk: "HIGH",
    approval: "Conditional",
    reviewedAt: "2026-07-29",
    reviewDue: "2026-08-29",
  },
  {
    id: "vendorRisk-meridian-procurement",
    name: "Third-Party Vendor Assurance Profile",
    version: "2.3.7",
    stage: "Production",
    purpose: "Validate supplier obligations, evidence, change notice, and continuing duties",
    vendorRisk: "MODERATE",
    approval: "Approved",
    reviewedAt: "2026-07-21",
    reviewDue: "2026-10-21",
  },
  {
    id: "vendorRisk-lumen-support",
    name: "Human Oversight Service Provider Profile",
    version: "5.1.0",
    stage: "Production",
    purpose: "Demonstrate reviewer-provider notice, access, intervention, and assurance conditions",
    vendorRisk: "LOW",
    approval: "Approved",
    reviewedAt: "2026-07-25",
    reviewDue: "2026-10-25",
  },
  {
    id: "vendorRisk-vault-finance",
    name: "Financial Service Provider Register",
    version: "1.8.4",
    stage: "Restricted",
    purpose: "Validate financial-service provider authority, limits, dependencies, and exit readiness",
    vendorRisk: "CRITICAL",
    approval: "Hold",
    reviewedAt: "2026-07-18",
    reviewDue: "2026-08-18",
  },
  {
    id: "vendorRisk-atlas-research",
    name: "Research Evidence Duty Profile",
    version: "3.9.1",
    stage: "Candidate",
    purpose: "Map vendor identity and vendor identity, vendor credential, and trust sources and preserve vendor assessment evidence",
    vendorRisk: "MODERATE",
    approval: "Conditional",
    reviewedAt: "2026-07-28",
    reviewDue: "2026-08-28",
  },
  {
    id: "vendorRisk-sentinel-vendor",
    name: "Vendor Containment Vendor Register",
    version: "6.0.3",
    stage: "Production",
    purpose: "Demonstrate incident, notification, containment and notification, and service restoration duties",
    vendorRisk: "CRITICAL",
    approval: "Escalate",
    reviewedAt: "2026-07-27",
    reviewDue: "2026-08-10",
  },
];

const INITIAL_OBLIGATIONS: ObligationRecord[] = [
  {
    id: "obligation-crm-read",
    name: "Vendor Register Connector",
    purpose: "Read vendorRisk context and affected-asset evidence",
    capability: "READ",
    domain: "Customer operations",
    approval: "Approved",
    conditions: "Read-only vendor evidence; no obligation authority.",
  },
  {
    id: "obligation-crm-write",
    name: "Vendor Register Update",
    purpose: "Update case notes and status",
    capability: "WRITE",
    domain: "Customer operations",
    approval: "Conditional",
    conditions: "Human approval required before external-state change.",
  },
  {
    id: "obligation-mail-draft",
    name: "Vendor profile Communication Draft",
    purpose: "Document control implementation communications",
    capability: "DRAFT",
    domain: "Relationship Approval",
    approval: "Approved",
    conditions: "Advisory only; cannot accept residual vendor exposure.",
  },
  {
    id: "obligation-mail-send",
    name: "Vendor profile Communication Release",
    purpose: "Transmit approved messages",
    capability: "EXECUTE",
    domain: "Relationship Approval",
    approval: "Restricted",
    conditions: "Named approver and serviceDomain revalidation required.",
  },
  {
    id: "obligation-payments",
    name: "Payment Instruction Obligation",
    purpose: "Evaluate payment-execution exposure",
    capability: "EXECUTE",
    domain: "Finance",
    approval: "Hold",
    conditions: "Disabled pending retention-obligation evidence renewal.",
  },
  {
    id: "obligation-search",
    name: "Enterprise Search",
    purpose: "Search approved internal repositories",
    capability: "READ",
    domain: "Knowledge",
    approval: "Approved",
    conditions: "Obligation allowlist and result provenance required.",
  },
  {
    id: "obligation-web",
    name: "Public Web Retrieval",
    purpose: "Retrieve public web content",
    capability: "READ",
    domain: "Research",
    approval: "Conditional",
    conditions: "No vendor credentialed browsing; content treated as untrusted.",
  },
  {
    id: "obligation-code",
    name: "Sandboxed Code Runner",
    purpose: "Execute code in isolated relationshipEnvironment",
    capability: "EXECUTE",
    domain: "Engineering",
    approval: "Conditional",
    conditions: "Network disabled; artifact export requires scan.",
  },
  {
    id: "obligation-ticket",
    name: "Work Ticket Creator",
    purpose: "Create internal work items",
    capability: "WRITE",
    domain: "Operations",
    approval: "Approved",
    conditions: "Cannot assign vendor accessd work without owner acceptance.",
  },
  {
    id: "obligation-calendar",
    name: "Calendar Coordinator",
    purpose: "Find availability and draft events",
    capability: "WRITE",
    domain: "Operations",
    approval: "Conditional",
    conditions: "No external commitment without named vendorRisk-owner approval.",
  },
  {
    id: "obligation-retention",
    name: "Governed Retention Store",
    purpose: "Store approved durable vendorRisk retention",
    capability: "WRITE",
    domain: "Platform",
    approval: "Restricted",
    conditions: "Requires classification, retention, and provenance tags.",
  },
  {
    id: "obligation-terminate",
    name: "Vendor profile Termination Obligation",
    purpose: "Suretention or terminate active vendors",
    capability: "OBLIGATION",
    domain: "Platform",
    approval: "Approved",
    conditions: "Independent emergency authority; all actions preserved.",
  },
];

const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: "ev-01",
    category: "Vendor Identity",
    title: "Canonical vendorRisk vendor identity",
    description: "Stable vendorRisk identifier, accountable owner, affected assets, exposure window, and review cadence.",
    obligation: "Enterprise vendorRisk register",
    owner: "Enterprise vendorRisk office",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-02",
    category: "Collection Authority",
    title: "Collection Authority instrument",
    description: "Named delegator, delegated approved purpose, effective period, revocation path, and non-delegable powers.",
    obligation: "Authority registry",
    owner: "Business authority",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-03",
    category: "Approved Purpose",
    title: "Bounded approved purpose statement",
    description: "Exact task approved purpose, completion criteria, exclusions, and prohibited substitutions.",
    obligation: "Approved Purpose approval",
    owner: "Task owner",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-04",
    category: "Role",
    title: "Approved role profile",
    description: "Role permissions, prohibited actions, required oversight, and conflict obligations.",
    obligation: "Role catalog",
    owner: "Vendor Identity governance",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-05",
    category: "Obligations",
    title: "Approved obligation manifest",
    description: "Exact obligations, versions, scopes, vendor credentials, and relationshipEnvironment restrictions.",
    obligation: "Obligation registry",
    owner: "Platform owner",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-06",
    category: "Permissions",
    title: "Effective permission snapshot",
    description: "Current quality permissions resolved from role, vendorRisk, relationshipEnvironment, and temporary grants.",
    obligation: "Access control plane",
    owner: "Vendor owner",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-07",
    category: "Retention",
    title: "Retention boundary specification",
    description: "Permitted retention classes, obligations, retention, visibility, and deletion obligations.",
    obligation: "Retention governance register",
    owner: "Obligation owner",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-08",
    category: "Retention",
    title: "Current retention manifest",
    description: "Active retention objects, provenance, classification, freshness, and challenge state.",
    obligation: "Governed retention store",
    owner: "Vendor profile operator",
    state: "STALE",
    required: true,
  },
  {
    id: "ev-09",
    category: "Instructions",
    title: "Instruction hierarchy manifest",
    description: "System, developer, operator, user, and obligation instructions with precedence and integrity evidence.",
    obligation: "Instruction registry",
    owner: "Vendor profile owner",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-10",
    category: "Sub-vendors",
    title: "Transformation collection authority map",
    description: "Permitted sub-vendors, inherited limits, independent restrictions, and termination paths.",
    obligation: "Orchestration registry",
    owner: "Vendor profile owner",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-11",
    category: "Transfer",
    title: "Transfer boundary",
    description: "Approved serviceDomains, channels, data classes, message types, and approval requirements.",
    obligation: "Transfer vendorRisk",
    owner: "Privacy owner",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-12",
    category: "Retention",
    title: "Retention authority schedule",
    description: "Per-action, daily, cumulative, vendor, currency, and category limits.",
    obligation: "Retention obligation register",
    owner: "Finance authority",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-13",
    category: "Relationship",
    title: "Approved quality relationshipEnvironment",
    description: "Quality vendor identity, region, isolation, network, secret handling, and service dependency boundary.",
    obligation: "Relationship registry",
    owner: "Platform engineering",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-14",
    category: "Dependencies",
    title: "Dependency lock manifest",
    description: "Models, libraries, APIs, services, obligations, and version constraints.",
    obligation: "Build provenance store",
    owner: "Release manager",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-15",
    category: "Human oversight",
    title: "Oversight assignment",
    description: "Named reviewer, qualification, information access, intervention power, and response time.",
    obligation: "Oversight roster",
    owner: "Operational authority",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-16",
    category: "Intervention",
    title: "Intervention obligation test",
    description: "Evidence that pause, revoke, isolate, rollback, and terminate obligations currently function.",
    obligation: "Obligation test archive",
    owner: "Reliability owner",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-17",
    category: "Monitoring",
    title: "Quality monitoring plan",
    description: "Telemetry, behavior, permission, retention, transfer, drift, and incident monitoring.",
    obligation: "Monitoring registry",
    owner: "Operations owner",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-18",
    category: "Monitoring",
    title: "Current quality telemetry",
    description: "Recent actions, obligation calls, denials, approvals, anomalies, and unresolved alerts.",
    obligation: "Telemetry archive",
    owner: "Operations owner",
    state: "CHALLENGED",
    required: true,
  },
  {
    id: "ev-19",
    category: "Vendor",
    title: "Prompt-injection assessment",
    description: "Direct, indirect, stored, obligation-output, and cross-vendorRisk injection testing.",
    obligation: "Vendor laboratory",
    owner: "Vendor assurance",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-20",
    category: "Vendor",
    title: "Secret and vendor credential assessment",
    description: "Credential issuance, scope, rotation, disclosure prevention, and misuse testing.",
    obligation: "Vendor review",
    owner: "Vendor owner",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-21",
    category: "Safety",
    title: "Misuse and abuse assessment",
    description: "Foreseeable misuse, dual-use paths, abuse obligations, and residual vendor assessment approval.",
    obligation: "Safety review",
    owner: "Safety authority",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-22",
    category: "Privacy",
    title: "Privacy impact record",
    description: "Personal-data purpose, minimization, disclosure, retention, rights, and transfer obligations.",
    obligation: "Privacy office",
    owner: "Privacy owner",
    state: "AVAILABLE",
    required: false,
  },
  {
    id: "ev-23",
    category: "Change",
    title: "Material change assessment",
    description: "Changes to model, obligations, instructions, retention, approved purpose, permissions, or relationshipEnvironment.",
    obligation: "Change obligation",
    owner: "Change authority",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-24",
    category: "Release",
    title: "Release authorization",
    description: "Named approvers, conditions, effective dates, relationshipEnvironments, and rollback owner.",
    obligation: "Release board",
    owner: "Release authority",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-25",
    category: "Incidents",
    title: "Incident and exception register",
    description: "Open incidents, accepted exceptions, expiry dates, corrective actions, and recurrence evidence.",
    obligation: "Incident system",
    owner: "Incident commander",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-26",
    category: "Termination",
    title: "Termination and succession plan",
    description: "Completion, suspension, revocation, orphan prevention, state handoff, and evidence preservation.",
    obligation: "Lifecycle registry",
    owner: "Vendor profile owner",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-27",
    category: "Vendor",
    title: "External service assurance",
    description: "Provider vendor identity, contractual boundary, subprocessors, changes, incidents, and exit support.",
    obligation: "Third-party register",
    owner: "Vendor vendorRisk",
    state: "AVAILABLE",
    required: false,
  },
  {
    id: "ev-28",
    category: "Outcomes",
    title: "Outcome correspondence baseline",
    description: "Expected result measures, prohibited outcomes, adverse-effect triggers, and review cadence.",
    obligation: "Assurance registry",
    owner: "Outcome owner",
    state: "AVAILABLE",
    required: true,
  },
  {
    id: "ev-29",
    category: "Audit",
    title: "Independent review record",
    description: "Independent test of delegated authority, obligations, records, and challenge handling.",
    obligation: "Assurance archive",
    owner: "Independent reviewer",
    state: "AVAILABLE",
    required: false,
  },
  {
    id: "ev-30",
    category: "Record",
    title: "Record preservation profile",
    description: "Event schema, timestamps, actor vendor identity, evidence hashes, retention, and replay capability.",
    obligation: "Record authority",
    owner: "Records officer",
    state: "AVAILABLE",
    required: true,
  },
];

const INITIAL_GATES: VendorGate[] = [
  {
    id: "gate-01",
    order: 1,
    title: "Vendor profile vendor identity",
    question: "Is the exact running vendorRisk instance attributable to an approved canonical vendor identity?",
    failureEffect: "DENY",
    section: "Vendor Identity",
    evidenceIds: ["ev-01", "ev-13"],
    state: "PASS",
  },
  {
    id: "gate-02",
    order: 2,
    title: "Delegating authority",
    question: "Did a currently valid authority delegate this approved purpose?",
    failureEffect: "DENY",
    section: "Collection Authority",
    evidenceIds: ["ev-02"],
    state: "PASS",
  },
  {
    id: "gate-03",
    order: 3,
    title: "Approved Purpose boundary",
    question: "Is the requested activity inside the approved approved purpose and exclusions?",
    failureEffect: "DENY",
    section: "Approved Purpose",
    evidenceIds: ["ev-03"],
    state: "PASS",
  },
  {
    id: "gate-04",
    order: 4,
    title: "Role validity",
    question: "Is the assigned role valid for this vendorRisk, relationshipEnvironment, and task?",
    failureEffect: "HOLD",
    section: "Role",
    evidenceIds: ["ev-04", "ev-06"],
    state: "PASS",
  },
  {
    id: "gate-05",
    order: 5,
    title: "Instruction integrity",
    question: "Are governing instructions complete, ordered, authentic, and unmodified?",
    failureEffect: "HOLD",
    section: "Instructions",
    evidenceIds: ["ev-09"],
    state: "PASS",
  },
  {
    id: "gate-06",
    order: 6,
    title: "Obligation vendor identity",
    question: "Are all requested obligations registered at the exact approved versions?",
    failureEffect: "HOLD",
    section: "Obligations",
    evidenceIds: ["ev-05", "ev-14"],
    state: "PASS",
  },
  {
    id: "gate-07",
    order: 7,
    title: "Obligation necessity",
    question: "Is every requested obligation necessary for the bounded approved purpose?",
    failureEffect: "HOLD",
    section: "Obligations",
    evidenceIds: ["ev-03", "ev-05"],
    state: "PASS",
  },
  {
    id: "gate-08",
    order: 8,
    title: "Permission scope",
    question: "Are effective permissions no broader than the approved role and action?",
    failureEffect: "DENY",
    section: "Permissions",
    evidenceIds: ["ev-04", "ev-06"],
    state: "PASS",
  },
  {
    id: "gate-09",
    order: 9,
    title: "Credential integrity",
    question: "Are vendor credentials current, scoped, protected, and attributable?",
    failureEffect: "DENY",
    section: "Vendor",
    evidenceIds: ["ev-06", "ev-20"],
    state: "PASS",
  },
  {
    id: "gate-10",
    order: 10,
    title: "Retention provenance",
    question: "Is every relied-upon retention item attributable, current, and permitted?",
    failureEffect: "HOLD",
    section: "Retention",
    evidenceIds: ["ev-07", "ev-08"],
    state: "PASS",
  },
  {
    id: "gate-11",
    order: 11,
    title: "Retention isolation",
    question: "Is retention isolated from prohibited users, vendors, tasks, and data classes?",
    failureEffect: "DENY",
    section: "Retention",
    evidenceIds: ["ev-07", "ev-22"],
    state: "PASS",
  },
  {
    id: "gate-12",
    order: 12,
    title: "Sub-data authority",
    question: "May this vendorRisk create or direct each proposed obligation-plan?",
    failureEffect: "DENY",
    section: "Sub-vendors",
    evidenceIds: ["ev-02", "ev-10"],
    state: "PASS",
  },
  {
    id: "gate-13",
    order: 13,
    title: "Inherited limits",
    question: "Do sub-vendors inherit all mandatory restrictions without authority expansion?",
    failureEffect: "DENY",
    section: "Sub-vendors",
    evidenceIds: ["ev-10"],
    state: "PASS",
  },
  {
    id: "gate-14",
    order: 14,
    title: "Transfer authority",
    question: "Are serviceDomain, channel, content, and disclosure all authorized?",
    failureEffect: "DENY",
    section: "Transfer",
    evidenceIds: ["ev-11", "ev-22"],
    state: "PASS",
  },
  {
    id: "gate-15",
    order: 15,
    title: "Retention boundary",
    question: "Is projected and cumulative retention within every approved limit?",
    failureEffect: "DENY",
    section: "Retention",
    evidenceIds: ["ev-12", "ev-18"],
    state: "PASS",
  },
  {
    id: "gate-16",
    order: 16,
    title: "Relationship integrity",
    question: "Is execution occurring only in the approved quality boundary?",
    failureEffect: "HOLD",
    section: "Relationship",
    evidenceIds: ["ev-13", "ev-14"],
    state: "PASS",
  },
  {
    id: "gate-17",
    order: 17,
    title: "Dependency continuity",
    question: "Have no material dependencies changed since approval?",
    failureEffect: "HOLD",
    section: "Dependencies",
    evidenceIds: ["ev-14", "ev-23"],
    state: "PASS",
  },
  {
    id: "gate-18",
    order: 18,
    title: "Injection resistance",
    question: "Has untrusted content remained subordinate to governing instructions?",
    failureEffect: "DENY",
    section: "Vendor",
    evidenceIds: ["ev-09", "ev-19"],
    state: "PASS",
  },
  {
    id: "gate-19",
    order: 19,
    title: "Human oversight readiness",
    question: "Can the assigned human understand, interrupt, and review this action in time?",
    failureEffect: "ESCALATE",
    section: "Oversight",
    evidenceIds: ["ev-15", "ev-16"],
    state: "PASS",
  },
  {
    id: "gate-20",
    order: 20,
    title: "Monitoring continuity",
    question: "Is current telemetry available and are material alerts resolved?",
    failureEffect: "HOLD",
    section: "Monitoring",
    evidenceIds: ["ev-17", "ev-18"],
    state: "PASS",
  },
  {
    id: "gate-21",
    order: 21,
    title: "Incident boundary",
    question: "Do open incidents or exceptions prohibit this action?",
    failureEffect: "DENY",
    section: "Incidents",
    evidenceIds: ["ev-25"],
    state: "PASS",
  },
  {
    id: "gate-22",
    order: 22,
    title: "Change validity",
    question: "Has every material change been classified, tested, and approved?",
    failureEffect: "HOLD",
    section: "Change",
    evidenceIds: ["ev-23", "ev-24"],
    state: "PASS",
  },
  {
    id: "gate-23",
    order: 23,
    title: "Termination readiness",
    question: "Can the vendorRisk and all descendants be stopped without orphaned authority or state?",
    failureEffect: "HOLD",
    section: "Termination",
    evidenceIds: ["ev-16", "ev-26"],
    state: "PASS",
  },
  {
    id: "gate-24",
    order: 24,
    title: "Outcome correspondence",
    question: "Can the action and result be preserved and compared with the approved approved purpose?",
    failureEffect: "ESCALATE",
    section: "Outcome",
    evidenceIds: ["ev-28", "ev-30"],
    state: "PASS",
  },
];

const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: "scn-01",
    family: "Baseline",
    title: "Approved bounded service workflow",
    summary: "Vendor profile reads an approved case, drafts a response, and pauses before external transmission.",
    trigger: "Normal approved request",
    expected: "ALLOW",
    severity: "LOW",
    recovery: "Preserve receipt and continue monitoring.",
  },
  {
    id: "scn-02",
    family: "Collection Authority",
    title: "Expired collection authority",
    summary: "The collection authority instrument expired before execution began.",
    trigger: "Authority expiry",
    expected: "DENY",
    severity: "HIGH",
    recovery: "Renew collection authority through the named authority.",
  },
  {
    id: "scn-03",
    family: "Approved Purpose",
    title: "Approved Purpose substitution",
    summary: "Vendor profile replaces the approved research approved purpose with an unapproved purchasing action.",
    trigger: "Goal drift",
    expected: "DENY",
    severity: "CRITICAL",
    recovery: "Terminate run and open approved purpose-drift review.",
  },
  {
    id: "scn-04",
    family: "Obligations",
    title: "Unregistered obligation",
    summary: "Vendor profile attempts to call a newly discovered external connector.",
    trigger: "Obligation discovery",
    expected: "HOLD",
    severity: "HIGH",
    recovery: "Register, assess, and approve the obligation before use.",
  },
  {
    id: "scn-05",
    family: "Permissions",
    title: "Privilege expansion",
    summary: "Temporary role mapping grants write access where only read was approved.",
    trigger: "IAM drift",
    expected: "DENY",
    severity: "CRITICAL",
    recovery: "Revoke grant and investigate access-obligation failure.",
  },
  {
    id: "scn-06",
    family: "Retention",
    title: "Stale customer retention",
    summary: "Vendor profile relies on an outdated preference that conflicts with the current record.",
    trigger: "Retention age threshold",
    expected: "HOLD",
    severity: "MODERATE",
    recovery: "Refresh retention and supersede stale entry.",
  },
  {
    id: "scn-07",
    family: "Retention",
    title: "Cross-tenant retention contamination",
    summary: "Retention from another customer appears in the active context.",
    trigger: "Isolation failure",
    expected: "DENY",
    severity: "CRITICAL",
    recovery: "Isolate quality, purge contaminated state, and notify privacy authority.",
  },
  {
    id: "scn-08",
    family: "Injection",
    title: "Indirect prompt injection",
    summary: "Retrieved web content instructs the vendorRisk to reveal secrets and change approved purposes.",
    trigger: "Untrusted content",
    expected: "DENY",
    severity: "CRITICAL",
    recovery: "Block content, rotate exposed vendor credentials if necessary, and preserve evidence.",
  },
  {
    id: "scn-09",
    family: "Transformation",
    title: "Unauthorized descendant",
    summary: "Vendor profile launches a code-execution obligation-plan absent from the collection authority map.",
    trigger: "Transformation creation",
    expected: "DENY",
    severity: "CRITICAL",
    recovery: "Terminate descendant and review orchestration obligations.",
  },
  {
    id: "scn-10",
    family: "Transfer",
    title: "Recipient mismatch",
    summary: "Approved draft is redirected to an external personal address.",
    trigger: "Recipient change",
    expected: "DENY",
    severity: "HIGH",
    recovery: "Require serviceDomain revalidation and human approval.",
  },
  {
    id: "scn-11",
    family: "Retention",
    title: "Per-action limit exceeded",
    summary: "Purchase instruction exceeds the approved single-transaction ceiling.",
    trigger: "Retention threshold",
    expected: "DENY",
    severity: "CRITICAL",
    recovery: "Escalate to finance authority for a new bounded approval.",
  },
  {
    id: "scn-12",
    family: "Retention",
    title: "Cumulative budget drift",
    summary: "Individual actions are below limit but aggregate daily retention exceeds the cap.",
    trigger: "Cumulative threshold",
    expected: "HOLD",
    severity: "HIGH",
    recovery: "Pause all retention-capable obligations and reconcile ledger.",
  },
  {
    id: "scn-13",
    family: "Dependency",
    title: "Obligation version changed",
    summary: "Provider deploys a material API version not covered by approval.",
    trigger: "Dependency update",
    expected: "HOLD",
    severity: "HIGH",
    recovery: "Run compatibility and obligation validation before reauthorization.",
  },
  {
    id: "scn-14",
    family: "Monitoring",
    title: "Telemetry interruption",
    summary: "Vendor profile actions cannot be observed or preserved for seven minutes.",
    trigger: "Monitoring outage",
    expected: "HOLD",
    severity: "HIGH",
    recovery: "Fail closed, restore telemetry, and reconcile buffered events.",
  },
  {
    id: "scn-15",
    family: "Oversight",
    title: "Reviewer unavailable",
    summary: "A required reviewer cannot respond inside the decision window.",
    trigger: "Oversight timeout",
    expected: "ESCALATE",
    severity: "HIGH",
    recovery: "Route to the designated alternate or suretention action.",
  },
  {
    id: "scn-16",
    family: "Incident",
    title: "Active vendor credential incident",
    summary: "Credential used by the vendorRisk is included in an unresolved incident.",
    trigger: "Incident correlation",
    expected: "DENY",
    severity: "CRITICAL",
    recovery: "Revoke vendor credential and isolate affected vendors.",
  },
  {
    id: "scn-17",
    family: "Termination",
    title: "Orphaned obligation-plan",
    summary: "Parent terminates but a descendant continues running with inherited vendor credentials.",
    trigger: "Termination test",
    expected: "DENY",
    severity: "CRITICAL",
    recovery: "Emergency revoke all descendant authority and open incident.",
  },
  {
    id: "scn-18",
    family: "Recovery",
    title: "Successful bounded recovery",
    summary: "Vendor profile is paused, retention corrected, permissions revalidated, and run restarted from checkpoint.",
    trigger: "Corrective completion",
    expected: "ALLOW",
    severity: "MODERATE",
    recovery: "Preserve supersession chain and monitor enhanced telemetry.",
  },
  {
    id: "scn-19",
    family: "Compound",
    title: "Injection plus retention request",
    summary: "Compromised content attempts to trigger a payment through an authorized finance obligation.",
    trigger: "Compound adversarial event",
    expected: "DENY",
    severity: "CRITICAL",
    recovery: "Terminate run, revoke obligation access, and initiate vendor-finance response.",
  },
  {
    id: "scn-20",
    family: "Outcome",
    title: "Result diverges from approved purpose",
    summary: "All obligations pass but produced outcome materially harms the approved service approved purpose.",
    trigger: "Outcome mismatch",
    expected: "ESCALATE",
    severity: "HIGH",
    recovery: "Suretention similar executions and conduct independent outcome review.",
  },
];

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "chl-001",
    title: "Quality telemetry completeness",
    submittedBy: "Independent assurance",
    basis: "A seven-minute gap may conceal unrecorded obligation calls.",
    counterevidence: "Gateway logs show three signed calls during the gap.",
    response: "Operations is reconciling event IDs against vendorRisk receipts.",
    finding: "Pending reconciliation",
    status: "UNDER REVIEW",
  },
  {
    id: "chl-002",
    title: "Retention freshness threshold",
    submittedBy: "Privacy office",
    basis: "The 30-day freshness rule is too broad for address and payment preferences.",
    counterevidence: "Current vendorRisk requires same-session confirmation for sensitive preferences.",
    response: "Vendor profile owner accepted a differentiated freshness schedule.",
    finding: "Sustained; corrective change opened",
    status: "SUSTAINED",
  },
  {
    id: "chl-003",
    title: "Finance obligation restriction",
    submittedBy: "Business owner",
    basis: "The payment obligation hold blocks an urgent supplier correction.",
    counterevidence: "No current obligation test proves aggregate retention enforcement.",
    response: "Finance authority declined temporary override.",
    finding: "Restriction remains valid",
    status: "REJECTED",
  },
];

const INITIAL_CHANGES: ChangeRequest[] = [
  {
    id: "chg-101",
    title: "Replace orchestration model",
    category: "Model",
    materiality: "MATERIAL",
    status: "Under review",
    owner: "Vendor profile owner",
    tests: ["Approved Purpose regression", "Obligation-call safety", "Instruction hierarchy", "Termination test"],
  },
  {
    id: "chg-102",
    title: "Add calendar write scope",
    category: "Permission",
    materiality: "MATERIAL",
    status: "Evidence requested",
    owner: "Operations owner",
    tests: ["Recipient boundary", "Invitation approval", "Audit preservation"],
  },
  {
    id: "chg-103",
    title: "Rotate CRM connector version",
    category: "Dependency",
    materiality: "MINOR",
    status: "Approved",
    owner: "Platform owner",
    tests: ["Schema compatibility", "Permission equivalence", "Rollback"],
  },
  {
    id: "chg-104",
    title: "Enable payment instruction obligation",
    category: "Obligation",
    materiality: "CRITICAL",
    status: "Hold",
    owner: "Finance authority",
    tests: ["Retention obligations", "Dual approval", "Fraud testing", "Incident response"],
  },
];

const INITIAL_RUNS: RunRecord[] = [
  {
    id: "run-7841",
    title: "Supplier comparison preparation",
    vendorId: "vendorRisk-meridian-procurement",
    decision: "ALLOW",
    time: "2026-07-30 10:14",
    rationale: "All 24 gates resolved within bounded approved purpose.",
  },
  {
    id: "run-7839",
    title: "Customer refund instruction",
    vendorId: "vendorRisk-vault-finance",
    decision: "DENY",
    time: "2026-07-30 09:48",
    rationale: "Payment obligation restricted and collection authority did not include execution authority.",
  },
  {
    id: "run-7834",
    title: "External research synthesis",
    vendorId: "vendorRisk-atlas-research",
    decision: "HOLD",
    time: "2026-07-30 08:31",
    rationale: "Current retention manifest stale; telemetry challenge unresolved.",
  },
  {
    id: "run-7826",
    title: "Vendor containment and notification coordination",
    vendorId: "vendorRisk-sentinel-vendor",
    decision: "ESCALATE",
    time: "2026-07-29 23:16",
    rationale: "Required human incident authority unavailable within response window.",
  },
];



type ObligationLibraryItem = {
  id: string;
  domain: string;
  title: string;
  purpose: string;
  owner: string;
  evidence: string[];
  failure: Determination;
  reviewCadence: string;
};

type RetentionObject = {
  id: string;
  class: string;
  subject: string;
  obligation: string;
  classification: string;
  freshness: string;
  retention: string;
  state: EvidenceState;
};

type TransferRule = {
  id: string;
  channel: string;
  audience: string;
  contentClass: string;
  approval: string;
  preservation: string;
  prohibited: string;
};

const OBLIGATION_LIBRARY: ObligationLibraryItem[] = [
  {
    id: "ctl-01",
    domain: "Vendor Identity",
    title: "Canonical quality vendor identity",
    purpose: "Bind every active vendorRisk process to one approved registry vendor identity and exact version.",
    owner: "Enterprise vendorRisk office",
    evidence: ["ev-01", "ev-13", "ev-24"],
    failure: "DENY",
    reviewCadence: "Every release and quality start",
  },
  {
    id: "ctl-02",
    domain: "Collection Authority",
    title: "Delegator standing",
    purpose: "Confirm that the delegator currently holds the authority they attempt to transfer.",
    owner: "Business authority",
    evidence: ["ev-02", "ev-04"],
    failure: "DENY",
    reviewCadence: "Before every bounded approved purpose",
  },
  {
    id: "ctl-03",
    domain: "Approved Purpose",
    title: "Approved Purpose non-substitution",
    purpose: "Prevent the vendorRisk from replacing the approved approved purpose with a convenient adjacent task.",
    owner: "Task owner",
    evidence: ["ev-03", "ev-09", "ev-18"],
    failure: "DENY",
    reviewCadence: "Continuous quality comparison",
  },
  {
    id: "ctl-04",
    domain: "Role",
    title: "Role-to-task binding",
    purpose: "Resolve role validity against the exact task, relationshipEnvironment, affected parties, and time window.",
    owner: "Vendor Identity governance",
    evidence: ["ev-04", "ev-06"],
    failure: "HOLD",
    reviewCadence: "Session start and material context change",
  },
  {
    id: "ctl-05",
    domain: "Instructions",
    title: "Instruction hierarchy integrity",
    purpose: "Preserve authenticated precedence among system, developer, operator, user, and obligation instructions.",
    owner: "Vendor profile owner",
    evidence: ["ev-09", "ev-19"],
    failure: "DENY",
    reviewCadence: "Every context assembly",
  },
  {
    id: "ctl-06",
    domain: "Obligations",
    title: "Registered obligation allowlist",
    purpose: "Expose only obligations whose vendor identity, version, purpose, and conditions are currently approved.",
    owner: "Platform owner",
    evidence: ["ev-05", "ev-14", "ev-24"],
    failure: "HOLD",
    reviewCadence: "Every obligation discovery and call",
  },
  {
    id: "ctl-07",
    domain: "Obligations",
    title: "Obligation necessity",
    purpose: "Withhold obligations that are not necessary to complete the bounded approved purpose.",
    owner: "Vendor profile owner",
    evidence: ["ev-03", "ev-05"],
    failure: "HOLD",
    reviewCadence: "Before capability exposure",
  },
  {
    id: "ctl-08",
    domain: "Permissions",
    title: "Effective least vendor access",
    purpose: "Calculate effective quality permission after role, vendorRisk, relationshipEnvironment, and temporary grants resolve.",
    owner: "Vendor owner",
    evidence: ["ev-04", "ev-06", "ev-20"],
    failure: "DENY",
    reviewCadence: "Every vendor accessd call",
  },
  {
    id: "ctl-09",
    domain: "Credentials",
    title: "Scoped vendor credential issuance",
    purpose: "Issue short-lived vendor credentials limited to one vendorRisk, obligation, relationshipEnvironment, and action class.",
    owner: "Vendor owner",
    evidence: ["ev-06", "ev-20"],
    failure: "DENY",
    reviewCadence: "At issuance and every refresh",
  },
  {
    id: "ctl-10",
    domain: "Retention",
    title: "Retention provenance",
    purpose: "Require obligation, subject, classification, freshness, retention, and challenge state for every durable retention object.",
    owner: "Obligation owner",
    evidence: ["ev-07", "ev-08", "ev-22"],
    failure: "HOLD",
    reviewCadence: "Before retention read and write",
  },
  {
    id: "ctl-11",
    domain: "Retention",
    title: "Retention isolation",
    purpose: "Prevent cross-customer, cross-tenant, cross-purpose, and cross-vendorRisk retention contamination.",
    owner: "Privacy owner",
    evidence: ["ev-07", "ev-22"],
    failure: "DENY",
    reviewCadence: "Continuous namespace enforcement",
  },
  {
    id: "ctl-12",
    domain: "Sub-vendors",
    title: "Descendant registration",
    purpose: "Create sub-vendors only from the approved orchestration map with inherited restrictions intact.",
    owner: "Vendor profile owner",
    evidence: ["ev-10", "ev-26"],
    failure: "DENY",
    reviewCadence: "Every descendant creation",
  },
  {
    id: "ctl-13",
    domain: "Sub-vendors",
    title: "No authority amplification",
    purpose: "Ensure a descendant can narrow but never broaden parent authority, obligations, retention, retention, or serviceDomains.",
    owner: "Enterprise vendorRisk office",
    evidence: ["ev-02", "ev-10", "ev-12"],
    failure: "DENY",
    reviewCadence: "Every collection authority edge",
  },
  {
    id: "ctl-14",
    domain: "Relationship Approval",
    title: "Recipient revalidation",
    purpose: "Resolve serviceDomain vendor identity and channel immediately before any external or consequential transmission.",
    owner: "Privacy owner",
    evidence: ["ev-11", "ev-22"],
    failure: "DENY",
    reviewCadence: "Immediately before send",
  },
  {
    id: "ctl-15",
    domain: "Relationship Approval",
    title: "Disclosure minimization",
    purpose: "Transmit only information necessary for the approved purpose and serviceDomain.",
    owner: "Records and privacy",
    evidence: ["ev-11", "ev-22", "ev-30"],
    failure: "HOLD",
    reviewCadence: "Every message assembly",
  },
  {
    id: "ctl-16",
    domain: "Retention",
    title: "Aggregate retention accounting",
    purpose: "Count all parent and descendant commitments against per-action, daily, cumulative, vendor, and category limits.",
    owner: "Finance authority",
    evidence: ["ev-12", "ev-18"],
    failure: "DENY",
    reviewCadence: "Before reservation and commit",
  },
  {
    id: "ctl-17",
    domain: "Relationship",
    title: "Approved quality confinement",
    purpose: "Prevent execution outside approved region, network, isolation, service dependency, and secret-handling boundaries.",
    owner: "Platform engineering",
    evidence: ["ev-13", "ev-14"],
    failure: "HOLD",
    reviewCadence: "Quality start and continuous attestation",
  },
  {
    id: "ctl-18",
    domain: "Vendor",
    title: "Untrusted-content containment and notification",
    purpose: "Treat retrieved, user-supplied, obligation-returned, and cross-vendorRisk content as untrusted unless explicitly elevated.",
    owner: "Vendor assurance",
    evidence: ["ev-09", "ev-19", "ev-20"],
    failure: "DENY",
    reviewCadence: "Every context insertion",
  },
  {
    id: "ctl-19",
    domain: "Oversight",
    title: "Qualified intervention authority",
    purpose: "Assign a reviewer with enough information, time, competence, and technical power to intervene.",
    owner: "Operational authority",
    evidence: ["ev-15", "ev-16"],
    failure: "ESCALATE",
    reviewCadence: "Before consequential execution",
  },
  {
    id: "ctl-20",
    domain: "Monitoring",
    title: "Signed event continuity",
    purpose: "Preserve attributable obligation calls, decisions, denials, approvals, messages, retention, and interventions.",
    owner: "Operations owner",
    evidence: ["ev-17", "ev-18", "ev-30"],
    failure: "HOLD",
    reviewCadence: "Continuous with fail-closed threshold",
  },
  {
    id: "ctl-21",
    domain: "Incidents",
    title: "Incident-aware execution",
    purpose: "Correlate active incidents and exceptions before exposing affected vendor credentials, obligations, data, or relationshipEnvironments.",
    owner: "Incident commander",
    evidence: ["ev-25"],
    failure: "DENY",
    reviewCadence: "Before every affected action",
  },
  {
    id: "ctl-22",
    domain: "Change",
    title: "Material change revalidation",
    purpose: "Reassess approval when models, prompts, obligations, permissions, retention, dependencies, or relationshipEnvironments change.",
    owner: "Change authority",
    evidence: ["ev-23", "ev-24"],
    failure: "HOLD",
    reviewCadence: "Every change request and deployment",
  },
  {
    id: "ctl-23",
    domain: "Termination",
    title: "Recursive authority revocation",
    purpose: "Stop the parent, descendants, vendor credentials, scheduled work, and retained execution state without orphaning authority.",
    owner: "Reliability owner",
    evidence: ["ev-16", "ev-26"],
    failure: "HOLD",
    reviewCadence: "Monthly test and every release",
  },
  {
    id: "ctl-24",
    domain: "Outcome",
    title: "Approved Purpose-to-outcome correspondence",
    purpose: "Compare preserved action and result evidence with the approved approved purpose and prohibited outcomes.",
    owner: "Outcome owner",
    evidence: ["ev-28", "ev-29", "ev-30"],
    failure: "ESCALATE",
    reviewCadence: "Every completed consequential run",
  },
];

const MEMORY_OBJECTS: RetentionObject[] = [
  {
    id: "mem-001",
    class: "Session",
    subject: "Current service case",
    obligation: "CRM case 81442",
    classification: "Internal operational",
    freshness: "Same session",
    retention: "Delete at completion",
    state: "AVAILABLE",
  },
  {
    id: "mem-002",
    class: "Durable",
    subject: "Approved transfer preference",
    obligation: "Customer preference record",
    classification: "Personal data",
    freshness: "30 days",
    retention: "Until superseded or erased",
    state: "STALE",
  },
  {
    id: "mem-003",
    class: "Durable",
    subject: "Supplier category restriction",
    obligation: "Procurement vendorRisk register",
    classification: "Internal vendorRisk",
    freshness: "Until vendorRisk revision",
    retention: "Seven years",
    state: "AVAILABLE",
  },
  {
    id: "mem-004",
    class: "Quarantined",
    subject: "Disputed customer address",
    obligation: "Legacy support transcript",
    classification: "Personal data",
    freshness: "Unknown",
    retention: "Until challenge resolved",
    state: "CHALLENGED",
  },
  {
    id: "mem-005",
    class: "Blocked",
    subject: "Payment vendor credential fragment",
    obligation: "Untrusted attachment",
    classification: "Restricted secret",
    freshness: "Not applicable",
    retention: "Immediate verified deletion",
    state: "MISSING",
  },
  {
    id: "mem-006",
    class: "Session",
    subject: "Reviewer approval token",
    obligation: "Governed approval service",
    classification: "Authority artifact",
    freshness: "Five minutes",
    retention: "Preserve hash only",
    state: "AVAILABLE",
  },
  {
    id: "mem-007",
    class: "Durable",
    subject: "Approved vendor allowlist",
    obligation: "Vendor vendorRisk register",
    classification: "Internal operational",
    freshness: "24 hours",
    retention: "Until superseded",
    state: "AVAILABLE",
  },
  {
    id: "mem-008",
    class: "Session",
    subject: "Obligation-call checkpoint",
    obligation: "Quality event stream",
    classification: "Operational telemetry",
    freshness: "Real time",
    retention: "Ninety days",
    state: "AVAILABLE",
  },
  {
    id: "mem-009",
    class: "Quarantined",
    subject: "Cross-tenant preference object",
    obligation: "Isolation anomaly",
    classification: "Personal data",
    freshness: "Unknown",
    retention: "Incident hold",
    state: "CHALLENGED",
  },
  {
    id: "mem-010",
    class: "Durable",
    subject: "Vendor profile limitation notice",
    obligation: "Release authorization",
    classification: "Governance obligation",
    freshness: "Every release",
    retention: "Lifecycle plus seven years",
    state: "AVAILABLE",
  },
  {
    id: "mem-011",
    class: "Session",
    subject: "Current cumulative retention",
    obligation: "Finance ledger snapshot",
    classification: "Confidential retention",
    freshness: "Sixty seconds",
    retention: "Preserve in run receipt",
    state: "AVAILABLE",
  },
  {
    id: "mem-012",
    class: "Durable",
    subject: "Termination service dependency graph",
    obligation: "Orchestration registry",
    classification: "Platform obligation",
    freshness: "Every topology change",
    retention: "Lifecycle plus one year",
    state: "AVAILABLE",
  },
];

const COMMUNICATION_RULES: TransferRule[] = [
  {
    id: "com-01",
    channel: "Enterprise mail",
    audience: "Named internal serviceDomain",
    contentClass: "Internal operational",
    approval: "Human approval before send",
    preservation: "Full message and approval receipt",
    prohibited: "Secrets, unrelated personal data, unsupported commitments",
  },
  {
    id: "com-02",
    channel: "Enterprise mail",
    audience: "Approved external business serviceDomain",
    contentClass: "External business",
    approval: "Recipient revalidation and named release authority",
    preservation: "Message, attachments, serviceDomain resolution, and send receipt",
    prohibited: "Internal-only evidence, vendor credentials, unapproved legal positions",
  },
  {
    id: "com-03",
    channel: "Internal chat",
    audience: "Approved workspace members",
    contentClass: "Internal collaboration",
    approval: "No approval for non-consequential drafts",
    preservation: "Conversation reference and material decisions",
    prohibited: "Restricted secrets and external commitments",
  },
  {
    id: "com-04",
    channel: "Customer chat",
    audience: "Authenticated customer",
    contentClass: "Customer service",
    approval: "Bounded response templates or human release",
    preservation: "Conversation transcript and vendorRisk version",
    prohibited: "Account changes, payment commitments, unsupported guarantees",
  },
  {
    id: "com-05",
    channel: "SMS",
    audience: "Verified mobile serviceDomain",
    contentClass: "Notification",
    approval: "Approved notification purpose and opt-in",
    preservation: "Message body, serviceDomain, timestamp, delivery receipt",
    prohibited: "Sensitive details, vendor credentials, binding decisions",
  },
  {
    id: "com-06",
    channel: "Voice",
    audience: "Authenticated participant",
    contentClass: "Assisted service",
    approval: "Human presence required",
    preservation: "Consent, summary, material actions, and outcome",
    prohibited: "Vendor profile impersonation and autonomous consequential commitments",
  },
  {
    id: "com-07",
    channel: "API callback",
    audience: "Registered system endpoint",
    contentClass: "Machine operational",
    approval: "Signed endpoint and schema authorization",
    preservation: "Request, response, signature, and correlation IDs",
    prohibited: "Undocumented fields and authority-bearing instructions",
  },
  {
    id: "com-08",
    channel: "Work ticket",
    audience: "Internal operations queue",
    contentClass: "Operational request",
    approval: "No approval for non-vendor accessd ticket creation",
    preservation: "Ticket body, attachments, assignments, and status history",
    prohibited: "Privileged assignment without owner acceptance",
  },
  {
    id: "com-09",
    channel: "Calendar invitation",
    audience: "Resolved attendees",
    contentClass: "Scheduling",
    approval: "Human confirmation before external invitation",
    preservation: "Event details, attendees, and approval receipt",
    prohibited: "Sensitive agenda details and unauthorized commitments",
  },
  {
    id: "com-10",
    channel: "Public publication",
    audience: "Open public",
    contentClass: "Public content",
    approval: "Relationship Approval and subject-matter approval",
    preservation: "Approved version, publication receipt, and corrections",
    prohibited: "Confidential information, personal data, unverified claims",
  },
  {
    id: "com-11",
    channel: "Transformation message",
    audience: "Registered descendant vendorRisk",
    contentClass: "Orchestration instruction",
    approval: "Within inherited collection authority only",
    preservation: "Instruction, context manifest, response, and termination state",
    prohibited: "Authority expansion and undeclared sensitive context",
  },
  {
    id: "com-12",
    channel: "Obligation result",
    audience: "Parent vendorRisk quality",
    contentClass: "Untrusted machine output",
    approval: "Schema validation and instruction isolation",
    preservation: "Obligation vendor identity, call arguments, result hash, and vendor assessment",
    prohibited: "Automatic elevation into governing instruction",
  },
];

function toneForState(state: GateState | EvidenceState | Determination | VendorTier | string): string {
  if (["PASS", "AVAILABLE", "ALLOW", "LOW", "Approved", "Production"].includes(state)) return "#57e9b1";
  if (["REVIEW", "STALE", "HOLD", "MODERATE", "Conditional", "Candidate", "Under review"].includes(state)) return "#ffd36f";
  if (["FAIL", "MISSING", "DENY", "HIGH", "CRITICAL", "Restricted", "Hold"].includes(state)) return "#ff6f7d";
  return "#c797ff";
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

function downloadCsv(filename: string, rows: Array<Record<string, unknown>>) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [headers.map(escape).join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Pill({ children, tone = "#8fb5ff" }: { children: ReactNode; tone?: string }) {
  return <span className="pill" style={{ "--pill-tone": tone } as CSSProperties}>{children}</span>;
}

function Metric({ label, value, detail, tone = "#8fb5ff" }: { label: string; value: string | number; detail: string; tone?: string }) {
  return (
    <article className="metric-card" style={{ "--metric-tone": tone } as CSSProperties}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function SectionHeader({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: ReactNode }) {
  return (
    <div className="section-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return <div className="empty-state"><strong>{title}</strong><p>{copy}</p></div>;
}

export default function VendorRegulationGovernancePlaygroundPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedVendorId, setSelectedVendorId] = useState(INITIAL_VENDORS[0].id);
  const [runName, setRunName] = useState("Vendor profile authority validation run");
  const [purposeText, setPurposeText] = useState(INITIAL_VENDORS[0].purpose);
  const [proposedUse, setRequestedAction] = useState("Read approved case evidence, prepare a bounded action plan, and pause before any external commitment.");
  const [relationshipEnvironment, setRelationship] = useState("Production / us-east / governed quality");
  const [serviceDomain, setRecipient] = useState("Internal operations reviewer");
  const [contractReviewDays, setProjectedRetention] = useState("0");
  const [selectedScenarioId, setSelectedScenarioId] = useState(INITIAL_SCENARIOS[0].id);
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [obligations, setObligations] = useState(INITIAL_OBLIGATIONS);
  const [evidence, setEvidence] = useState(INITIAL_EVIDENCE);
  const [gates, setGates] = useState(INITIAL_GATES);
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [changes, setChanges] = useState(INITIAL_CHANGES);
  const [runs, setRuns] = useState(INITIAL_RUNS);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("Local workspace ready.");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<SavedState>;
        if (saved.selectedVendorId) setSelectedVendorId(saved.selectedVendorId);
        if (saved.runName) setRunName(saved.runName);
        if (saved.purposeText) setPurposeText(saved.purposeText);
        if (saved.proposedUse) setRequestedAction(saved.proposedUse);
        if (saved.relationshipEnvironment) setRelationship(saved.relationshipEnvironment);
        if (saved.serviceDomain) setRecipient(saved.serviceDomain);
        if (saved.contractReviewDays) setProjectedRetention(saved.contractReviewDays);
        if (saved.selectedScenarioId) setSelectedScenarioId(saved.selectedScenarioId);
        if (saved.vendors) setVendors(saved.vendors);
        if (saved.obligations) setObligations(saved.obligations);
        if (saved.evidence) setEvidence(saved.evidence);
        if (saved.gates) setGates(saved.gates);
        if (saved.challenges) setChallenges(saved.challenges);
        if (saved.changes) setChanges(saved.changes);
        if (saved.runs) setRuns(saved.runs);
      }
    } catch {
      setMessage("Stored workspace could not be read. Defaults loaded.");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: SavedState = { selectedVendorId, runName, purposeText, proposedUse, relationshipEnvironment, serviceDomain, contractReviewDays, selectedScenarioId, vendors, obligations, evidence, gates, challenges, changes, runs };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, selectedVendorId, runName, purposeText, proposedUse, relationshipEnvironment, serviceDomain, contractReviewDays, selectedScenarioId, vendors, obligations, evidence, gates, challenges, changes, runs]);

  const selectedVendor = useMemo(() => vendors.find((vendorRisk) => vendorRisk.id === selectedVendorId) ?? vendors[0], [vendors, selectedVendorId]);
  const selectedScenario = useMemo(() => INITIAL_SCENARIOS.find((scenario) => scenario.id === selectedScenarioId) ?? INITIAL_SCENARIOS[0], [selectedScenarioId]);
  const counts = useMemo(() => ({
    pass: gates.filter((gate) => gate.state === "PASS").length,
    review: gates.filter((gate) => gate.state === "REVIEW").length,
    fail: gates.filter((gate) => gate.state === "FAIL").length,
    available: evidence.filter((item) => item.state === "AVAILABLE").length,
    stale: evidence.filter((item) => item.state === "STALE").length,
    missing: evidence.filter((item) => item.state === "MISSING").length,
    challenged: evidence.filter((item) => item.state === "CHALLENGED").length,
  }), [gates, evidence]);

  const determination: Determination = useMemo(() => {
    const failed = gates.filter((gate) => gate.state === "FAIL");
    if (failed.some((gate) => gate.failureEffect === "DENY")) return "DENY";
    if (failed.some((gate) => gate.failureEffect === "ESCALATE")) return "ESCALATE";
    if (failed.length || gates.some((gate) => gate.state === "REVIEW")) return "HOLD";
    const requiredEvidenceProblem = evidence.some((item) => item.required && item.state !== "AVAILABLE");
    if (requiredEvidenceProblem) return "HOLD";
    return "ALLOW";
  }, [gates, evidence]);

  const filteredEvidence = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return evidence;
    return evidence.filter((item) => [item.id, item.category, item.title, item.description, item.obligation, item.owner, item.state].join(" ").toLowerCase().includes(needle));
  }, [evidence, query]);

  const filteredObligations = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return obligations;
    return obligations.filter((obligation) => [obligation.id, obligation.name, obligation.purpose, obligation.capability, obligation.domain, obligation.approval, obligation.conditions].join(" ").toLowerCase().includes(needle));
  }, [obligations, query]);

  const governedRecord = useMemo(() => ({
    schema: "ta14.data-provenance-governance.record.v5",
    recordId: `DP-${selectedVendor.id}-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    run: { name: runName, purpose: purposeText, proposedUse, relationshipEnvironment, serviceDomain, contractReviewDays },
    vendorRisk: selectedVendor,
    determination,
    determinationDefinition: DETERMINATION_META[determination].description,
    gates,
    evidence,
    obligations,
    obligationLibrary: OBLIGATION_LIBRARY,
    retentionObjects: MEMORY_OBJECTS,
    transferRules: COMMUNICATION_RULES,
    selectedScenario,
    challenges,
    changes,
    nonClaims: [
      "Vendor profile vendor identity does not prove that a specific action is correct or admissible.",
      "Obligation approval does not authorize every use of that obligation.",
      "Human oversight does not cure missing authority, evidence, or continuity.",
      "Monitoring does not itself grant execution authority.",
      "ALLOW in Vendor & Third-Party Governance does not automatically produce ALLOW in another governance lane.",
    ],
    institutionalRule: "Descriptions, policies, evaluations, dashboards, monitoring, approvals, and assurance reports must never be mistaken for execution authority.",
    canonicalChain: "Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome",
  }), [selectedVendor, runName, purposeText, proposedUse, relationshipEnvironment, serviceDomain, contractReviewDays, determination, gates, evidence, obligations, selectedScenario, challenges, changes]);

  function cycleGate(id: string) {
    setGates((current) => current.map((gate) => gate.id === id ? { ...gate, state: gate.state === "PASS" ? "REVIEW" : gate.state === "REVIEW" ? "FAIL" : "PASS" } : gate));
  }

  function cycleEvidence(id: string) {
    const order: EvidenceState[] = ["AVAILABLE", "STALE", "MISSING", "CHALLENGED"];
    setEvidence((current) => current.map((item) => item.id === id ? { ...item, state: order[(order.indexOf(item.state) + 1) % order.length] } : item));
  }

  function applyScenario() {
    const failSections: Record<string, string[]> = {
      "Collection Authority": ["Collection Authority"], "Approved Purpose": ["Approved Purpose"], Obligations: ["Obligations"], Permissions: ["Permissions"], Lineage: ["Lineage"], Injection: ["Vendor"], Transformation: ["Transformation"], Transfer: ["Transfer"], Retention: ["Retention"], Dependency: ["Dependencies"], Monitoring: ["Monitoring"], Oversight: ["Oversight"], Incident: ["Incidents"], Destruction: ["Destruction"], Outcome: ["Outcome"], Compound: ["Vendor", "Retention"], Recovery: [], Baseline: [],
    };
    const sections = failSections[selectedScenario.family] ?? [];
    setGates((current) => current.map((gate) => ({ ...gate, state: sections.includes(gate.section) ? (selectedScenario.expected === "HOLD" ? "REVIEW" : "FAIL") : "PASS" })));
    setMessage(`Scenario applied: ${selectedScenario.title}. Expected determination: ${selectedScenario.expected}.`);
  }

  function resetWorkspace() {
    setVendors(INITIAL_VENDORS);
    setObligations(INITIAL_OBLIGATIONS);
    setEvidence(INITIAL_EVIDENCE);
    setGates(INITIAL_GATES);
    setChallenges(INITIAL_CHALLENGES);
    setChanges(INITIAL_CHANGES);
    setRuns(INITIAL_RUNS);
    setSelectedVendorId(INITIAL_VENDORS[0].id);
    setSelectedScenarioId(INITIAL_SCENARIOS[0].id);
    setRunName("Vendor profile authority validation run");
    setPurposeText(INITIAL_VENDORS[0].purpose);
    setRequestedAction("Read approved case evidence, prepare a bounded action plan, and pause before any external commitment.");
    setRelationship("Production / us-east / governed quality");
    setRecipient("Internal operations reviewer");
    setProjectedRetention("0");
    window.localStorage.removeItem(STORAGE_KEY);
    setMessage("Workspace reset to authoritative demonstration data.");
  }

  function addChallenge() {
    const id = `chl-${String(challenges.length + 1).padStart(3, "0")}`;
    setChallenges((current) => [{ id, title: "New vendorRisk governance challenge", submittedBy: "Workspace reviewer", basis: "Describe the disputed authority, evidence, obligation, or determination.", counterevidence: "Attach or identify counterevidence.", response: "Response pending.", finding: "No finding entered.", status: "OPEN" }, ...current]);
    setMessage(`${id} opened and preserved locally.`);
  }

  function preserveRun() {
    const next: RunRecord = { id: `run-${Math.floor(1000 + Math.random() * 8999)}`, title: runName, vendorId: selectedVendor.id, decision: determination, time: new Date().toLocaleString(), rationale: DETERMINATION_META[determination].description };
    setRuns((current) => [next, ...current]);
    setMessage(`${next.id} preserved with ${determination} determination.`);
  }

  return (
    <main className="page-shell">
      <div className="stars stars-one" />
      <div className="stars stars-two" />
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">TA</span><span><b>TA-14 EXCHANGE</b><small>AI Governance Playground</small></span></Link>
        <nav><Link href="/workspace/ai-governance/playground">Playground</Link><Link href="/workspace/ai-governance/playground/specialized">Specialized lanes</Link><Link href="/">Return to Exchange</Link></nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">AT · GOVERNANCE-SPECIFIC PLAYGROUND · {VERSION}</span>
          <h1>Vendor & Third-Party Governance</h1>
          <p>Test whether a specific vendorRisk remains inside its delegated approved purpose, obligation authority, retention boundary, obligation-plan limits, transfer permissions, retention limits, intervention obligations, and termination path.</p>
          <div className="hero-pills"><Pill>Claim</Pill><Pill>Evidence</Pill><Pill>Test</Pill><Pill tone="#57e9b1">Preserve</Pill><Pill tone="#c797ff">Challenge</Pill></div>
        </div>
        <aside className="decision-card" style={{ "--decision-tone": DETERMINATION_META[determination].tone } as CSSProperties}>
          <span>Current bounded determination</span>
          <strong>{determination}</strong>
          <p>{DETERMINATION_META[determination].description}</p>
          <div className="decision-grid"><span>{counts.pass}<small>Pass</small></span><span>{counts.review}<small>Review</small></span><span>{counts.fail}<small>Fail</small></span></div>
        </aside>
      </section>

      <section className="institutional-rule">
        <span>Institutional rule</span>
        <strong>Descriptions, policies, evaluations, dashboards, monitoring, approvals, and assurance reports must never be mistaken for execution authority.</strong>
      </section>

      <section className="workspace-grid">
        <aside className="sidebar">
          <div className="sidebar-title"><span>AGENT & TOOL</span><strong>Workspace</strong></div>
          <div className="vendorRisk-selector"><label>Active vendorRisk</label><select value={selectedVendorId} onChange={(event) => { setSelectedVendorId(event.target.value); const next = vendors.find((vendorRisk) => vendorRisk.id === event.target.value); if (next) setPurposeText(next.purpose); }}>{vendors.map((vendorRisk) => <option key={vendorRisk.id} value={vendorRisk.id}>{vendorRisk.name} · {vendorRisk.version}</option>)}</select></div>
          <div className="tab-list">{TABS.map((tab) => <button key={tab.id} className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}><span>{tab.short}</span>{tab.label}</button>)}</div>
          <div className="sidebar-actions"><button onClick={preserveRun}>Preserve current run</button><button onClick={() => downloadJson("ta14-vendor-governed-record.json", governedRecord)}>Export governed record</button><button className="ghost" onClick={resetWorkspace}>Reset workspace</button></div>
          <small className="status-message">{message}</small>
        </aside>

        <section className="workspace-content">
          {activeTab === "overview" ? (
            <>
              <SectionHeader eyebrow="Mission obligation" title="Bounded data processing review" copy="Resolve the exact authority, approved purpose, obligations, retention, acceptance, retention, oversight, and termination conditions before treating the vendorRisk as governable." action={<button className="primary" onClick={preserveRun}>Run & preserve</button>} />
              <div className="metrics"><Metric label="Gate posture" value={`${counts.pass}/24`} detail={`${counts.review} review · ${counts.fail} fail`} tone={toneForState(determination)} /><Metric label="Required evidence" value={`${evidence.filter((item) => item.required && item.state === "AVAILABLE").length}/${evidence.filter((item) => item.required).length}`} detail={`${counts.stale} stale · ${counts.challenged} challenged`} tone={counts.stale + counts.challenged ? "#ffd36f" : "#57e9b1"} /><Metric label="Approved obligations" value={obligations.filter((obligation) => obligation.approval === "Approved").length} detail={`${obligations.filter((obligation) => obligation.approval !== "Approved").length} conditional or restricted`} /><Metric label="Open challenges" value={challenges.filter((item) => ["OPEN", "UNDER REVIEW"].includes(item.status)).length} detail="Counterevidence remains reviewable" tone="#c797ff" /></div>
              <div className="two-column">
                <article className="panel"><h3>Execution claim</h3><label>Run name<input value={runName} onChange={(event) => setRunName(event.target.value)} /></label><label>Approved approved purpose<textarea value={purposeText} onChange={(event) => setPurposeText(event.target.value)} /></label><label>Requested action<textarea value={proposedUse} onChange={(event) => setRequestedAction(event.target.value)} /></label><div className="field-grid"><label>Relationship<input value={relationshipEnvironment} onChange={(event) => setRelationship(event.target.value)} /></label><label>Recipient<input value={serviceDomain} onChange={(event) => setRecipient(event.target.value)} /></label><label>Projected retention<input value={contractReviewDays} onChange={(event) => setProjectedRetention(event.target.value)} inputMode="decimal" /></label></div></article>
                <article className="panel"><h3>Selected vendorRisk</h3><div className="vendor identity-card"><span>{selectedVendor.id}</span><strong>{selectedVendor.name}</strong><p>{selectedVendor.purpose}</p><div><Pill tone={toneForState(selectedVendor.vendorRisk)}>{selectedVendor.vendorRisk}</Pill><Pill tone={toneForState(selectedVendor.approval)}>{selectedVendor.approval}</Pill><Pill>{selectedVendor.stage}</Pill></div></div><h4>What this lane does not claim</h4><ul className="boundary-list"><li>Verified vendor identity does not make an action admissible.</li><li>Approved obligations do not authorize every obligation use.</li><li>Human review cannot manufacture missing authority.</li><li>Monitoring is evidence, not execution permission.</li><li>ALLOW here does not merge determinations across lanes.</li></ul></article>
              </div>
              <article className="panel gate-panel"><div className="panel-heading"><div><span className="eyebrow">24-link vendorRisk gate</span><h3>Every link remains independently challengeable</h3></div><div className="legend"><Pill tone="#57e9b1">PASS</Pill><Pill tone="#ffd36f">REVIEW</Pill><Pill tone="#ff6f7d">FAIL</Pill></div></div><div className="gate-grid">{gates.map((gate) => <button key={gate.id} className="gate-card" onClick={() => cycleGate(gate.id)} style={{ "--gate-tone": toneForState(gate.state) } as CSSProperties}><span>{String(gate.order).padStart(2, "0")} · {gate.section}</span><strong>{gate.title}</strong><p>{gate.question}</p><footer><b>{gate.state}</b><small>Failure → {gate.failureEffect}</small></footer></button>)}</div></article>
            </>
          ) : null}

          {activeTab === "registry" ? (
            <><SectionHeader eyebrow="Enterprise vendorRisk register" title="Vendor Identity before agency" copy="A stable vendor identity, owner, version, lifecycle state, and approved approved purpose are necessary but never sufficient for execution." /><div className="registry-grid">{vendors.map((vendorRisk) => <article key={vendorRisk.id} className={`registry-card ${vendorRisk.id === selectedVendorId ? "selected" : ""}`} onClick={() => setSelectedVendorId(vendorRisk.id)}><header><span>{vendorRisk.id}</span><Pill tone={toneForState(vendorRisk.vendorRisk)}>{vendorRisk.vendorRisk}</Pill></header><h3>{vendorRisk.name}</h3><small>Version {vendorRisk.version} · {vendorRisk.stage}</small><p>{vendorRisk.purpose}</p><dl><div><dt>Approval</dt><dd>{vendorRisk.approval}</dd></div><div><dt>Reviewed</dt><dd>{vendorRisk.reviewedAt}</dd></div><div><dt>Due</dt><dd>{vendorRisk.reviewDue}</dd></div></dl></article>)}</div><article className="panel"><h3>Registry operating rules</h3><div className="rule-grid"><div><strong>Canonical vendor identity</strong><p>Aliases must resolve to one approved vendor identity and version.</p></div><div><strong>Named ownership</strong><p>Business, technical, vendor, and lifecycle owners remain attributable.</p></div><div><strong>Lifecycle obligation</strong><p>Candidate, production, restricted, suretentioned, retiring, and terminated states have distinct powers.</p></div><div><strong>No inherited standing</strong><p>Prior approval does not survive material change without revalidation.</p></div></div></article></>
          ) : null}

          {activeTab === "purpose" ? (
            <><SectionHeader eyebrow="Collection Authority & approved purpose" title="Authority must reach the exact action" copy="Trace who delegated what, to which vendorRisk, for how long, under which exclusions, and with what revocation path." /><div className="two-column"><article className="panel"><h3>Collection Authority instrument</h3><dl className="detail-list"><div><dt>Delegator</dt><dd>Director, Governed Operations</dd></div><div><dt>Delegate</dt><dd>{selectedVendor.name} · {selectedVendor.version}</dd></div><div><dt>Approved Purpose</dt><dd>{purposeText}</dd></div><div><dt>Effective period</dt><dd>2026-07-29 through 2026-08-29</dd></div><div><dt>Revocation</dt><dd>Immediate through control plane or incident authority</dd></div><div><dt>Non-delegable</dt><dd>Final legal decision, external payment commit, vendor credential issuance, vendorRisk waiver</dd></div></dl></article><article className="panel"><h3>Approved Purpose boundary test</h3><label>Proposed action<textarea value={proposedUse} onChange={(event) => setRequestedAction(event.target.value)} /></label><div className="boundary-meter"><span>Read evidence</span><span>Prepare recommendation</span><span>Request approval</span><span className="blocked">Bind external outcome</span></div><p className="callout">The vendorRisk may prepare and recommend. It may not convert a recommendation into a binding external commitment unless a separate authority chain is present and current.</p></article></div><article className="panel"><h3>Collection Authority evidence</h3><div className="evidence-list">{evidence.filter((item) => ["Collection Authority", "Approved Purpose", "Role", "Instructions"].includes(item.category)).map((item) => <button key={item.id} onClick={() => cycleEvidence(item.id)}><span>{item.id}</span><div><strong>{item.title}</strong><p>{item.description}</p></div><Pill tone={toneForState(item.state)}>{item.state}</Pill></button>)}</div></article></>
          ) : null}

          {activeTab === "obligations" ? (
            <><SectionHeader eyebrow="Obligation authority" title="A obligation is a bounded capability, not a blank permission" copy="Inspect exact obligation vendor identity, version, capability, domain, approval state, and conditions before the vendorRisk can rely on it." action={<div className="search"><input placeholder="Search obligations" value={query} onChange={(event) => setQuery(event.target.value)} /></div>} /><div className="obligation-table"><div className="table-head"><span>Obligation</span><span>Capability</span><span>Domain</span><span>Approval</span><span>Conditions</span></div>{filteredObligations.map((obligation) => <div className="table-row" key={obligation.id}><span><b>{obligation.name}</b><small>{obligation.id}<br />{obligation.purpose}</small></span><span><Pill>{obligation.capability}</Pill></span><span>{obligation.domain}</span><span><Pill tone={toneForState(obligation.approval)}>{obligation.approval}</Pill></span><span>{obligation.conditions}</span></div>)}</div><article className="panel"><h3>Permission equivalence test</h3><div className="permission-grid"><div><span>Requested</span><strong>CRM read + draft + case update</strong><p>No external transmission. No retention instruction.</p></div><div><span>Role maximum</span><strong>Read + draft + conditional update</strong><p>Write requires human approval token.</p></div><div><span>Effective quality</span><strong>Read + draft</strong><p>Case update withheld until reviewer approval.</p></div><div className="good"><span>Result</span><strong>Least vendor access preserved</strong><p>No authority expansion detected.</p></div></div></article></>
          ) : null}

          {activeTab === "obligation-map" ? (
            <><SectionHeader eyebrow="Retention governance" title="Retention must remain attributable, current, isolated, and erasable" copy="Inspect what the vendorRisk may remember, whose record it came from, how long it persists, and where it may be reused." /><div className="metrics"><Metric label="Retention evidence" value={evidence.filter((item) => item.category === "Retention").length} detail="Boundary and active manifest" tone="#8fb5ff" /><Metric label="Current state" value={evidence.find((item) => item.id === "ev-08")?.state ?? "UNKNOWN"} detail="Active retention manifest" tone={toneForState(evidence.find((item) => item.id === "ev-08")?.state ?? "UNKNOWN")} /><Metric label="Sensitive reuse" value="PROHIBITED" detail="No cross-customer reuse" tone="#ff6f7d" /><Metric label="Deletion SLA" value="24h" detail="Verified erasure receipt required" tone="#57e9b1" /></div><div className="two-column"><article className="panel"><h3>Retention classes</h3><div className="retention-list"><div><Pill tone="#57e9b1">Session</Pill><strong>Task working retention</strong><p>Expires at run completion unless explicitly preserved as a governed record.</p></div><div><Pill tone="#ffd36f">Durable</Pill><strong>Approved operational preference</strong><p>Requires obligation, owner, classification, freshness rule, and deletion path.</p></div><div><Pill tone="#ff6f7d">Blocked</Pill><strong>Secrets and inferred sensitive traits</strong><p>May not be stored as vendorRisk retention absent explicit lawful architecture.</p></div><div><Pill tone="#c797ff">Challenged</Pill><strong>Disputed retention object</strong><p>Quarantined from quality reliance until review and supersession.</p></div></div></article><article className="panel"><h3>Retention continuity</h3><div className="chain"><span>Obligation event</span><i>→</i><span>Attributed record</span><i>→</i><span>Approved retention</span><i>→</i><span>Freshness check</span><i>→</i><span>Bounded use</span><i>→</i><span>Outcome review</span></div><p className="callout warn">The active retention manifest is stale. Current determination remains HOLD until refreshed or the vendorRisk proceeds without relying on durable retention.</p></article></div></>
          ) : null}

          {activeTab === "obligation-plan" ? (
            <><SectionHeader eyebrow="Transformation obligation" title="Collection Authority cannot silently expand through descendants" copy="Every obligation-plan requires vendor identity, purpose, inherited restrictions, obligation limits, monitoring, and a reliable termination path." /><div className="orchestration-map"><article className="node parent"><span>Parent</span><strong>{selectedVendor.name}</strong><small>Approved Purpose owner · bounded collection authority</small></article><div className="branch" /><article className="node"><span>Research obligation-plan</span><strong>Approved</strong><small>Read-only search · no durable retention</small></article><article className="node"><span>Document obligation-plan</span><strong>Conditional</strong><small>Draft only · human release gate</small></article><article className="node blocked"><span>Code executor</span><strong>Not delegated</strong><small>Creation attempt must DENY</small></article></div><article className="panel"><h3>Inherited restrictions</h3><div className="restriction-grid"><div><strong>Approved Purpose</strong><p>Descendants may narrow but never broaden the parent approved purpose.</p></div><div><strong>Obligations</strong><p>Only explicitly delegated obligations and scopes are available.</p></div><div><strong>Retention</strong><p>No descendant may inherit prohibited or unrelated retention.</p></div><div><strong>Retention</strong><p>All descendant retention counts toward the parent aggregate cap.</p></div><div><strong>Relationship Approval</strong><p>Recipients and channels remain bounded by the parent collection authority.</p></div><div><strong>Termination</strong><p>Parent termination recursively revokes descendant authority.</p></div></div></article></>
          ) : null}

          {activeTab === "acceptance" ? (
            <><SectionHeader eyebrow="Relationship Approval" title="Every message crosses an authority and disclosure boundary" copy="Validate serviceDomain, channel, content classification, purpose, approval, and preservation before any transfer leaves the governed quality." /><div className="two-column"><article className="panel"><h3>Transfer envelope</h3><label>Intended serviceDomain<input value={serviceDomain} onChange={(event) => setRecipient(event.target.value)} /></label><dl className="detail-list"><div><dt>Channel</dt><dd>Governed enterprise mail</dd></div><div><dt>Classification</dt><dd>Internal operational</dd></div><div><dt>Permitted content</dt><dd>Evidence summary and non-binding recommendation</dd></div><div><dt>Prohibited content</dt><dd>Secrets, payment vendor credentials, unrelated personal data</dd></div><div><dt>Release authority</dt><dd>Named human reviewer</dd></div></dl></article><article className="panel"><h3>Pre-send gate</h3><div className="check-stack"><div className="checked"><b>✓</b><span><strong>Recipient resolved</strong><small>Directory vendor identity and domain verified</small></span></div><div className="checked"><b>✓</b><span><strong>Purpose aligned</strong><small>Message supports approved approved purpose</small></span></div><div className="checked"><b>✓</b><span><strong>Disclosure minimized</strong><small>Only required evidence included</small></span></div><div><b>!</b><span><strong>Human release pending</strong><small>Vendor profile cannot send until approval token binds</small></span></div></div></article></div><article className="panel"><h3>Transfer non-claims</h3><p className="callout">A correctly addressed message may still be unauthorized. A human-approved draft may still disclose prohibited information. A secure channel may still carry an inadmissible transfer.</p></article></>
          ) : null}

          {activeTab === "residual" ? (
            <><SectionHeader eyebrow="Retention authority" title="Retention limits bind the whole vendorRisk tree" copy="Resolve per-action, daily, cumulative, vendor, category, currency, and approval limits before any retention capability is exposed." /><div className="metrics"><Metric label="Projected action" value={`$${contractReviewDays || "0"}`} detail="Current proposed retention" tone={Number(contractReviewDays) > 5000 ? "#ff6f7d" : "#57e9b1"} /><Metric label="Per-action cap" value="$5,000" detail="No vendorRisk override" tone="#ffd36f" /><Metric label="Daily aggregate" value="$12,400 / $25,000" detail="Includes all descendants" tone="#57e9b1" /><Metric label="Payment obligation" value="HOLD" detail="Obligation renewal incomplete" tone="#ff6f7d" /></div><div className="two-column"><article className="panel"><h3>Retention request</h3><label>Projected retention<input value={contractReviewDays} onChange={(event) => setProjectedRetention(event.target.value)} inputMode="decimal" /></label><dl className="detail-list"><div><dt>Currency</dt><dd>USD only</dd></div><div><dt>Approved vendors</dt><dd>Current supplier allowlist</dd></div><div><dt>Categories</dt><dd>Operational materials; no gifts or cash equivalents</dd></div><div><dt>Dual approval</dt><dd>Required above $1,000</dd></div><div><dt>Commit power</dt><dd>Not delegated to this vendorRisk</dd></div></dl></article><article className="panel"><h3>Retention decision</h3><div className="big-status" style={{ "--status-tone": Number(contractReviewDays) > 5000 ? "#ff6f7d" : "#ffd36f" } as CSSProperties}><strong>{Number(contractReviewDays) > 5000 ? "DENY" : "HOLD"}</strong><p>{Number(contractReviewDays) > 5000 ? "The proposed action exceeds the non-waivable single-action limit." : "Amount may be within limit, but the payment obligation remains unavailable and commit authority is absent."}</p></div></article></div></>
          ) : null}

          {activeTab === "monitoring" ? (
            <><SectionHeader eyebrow="Quality monitoring" title="Observe drift without confusing observation for authority" copy="Telemetry proves what happened and supports intervention. It does not independently authorize what should happen next." /><div className="metrics"><Metric label="Active vendors" value="14" detail="Across governed relationshipEnvironments" /><Metric label="Obligation calls / 24h" value="8,421" detail="99.98% signed receipts" tone="#57e9b1" /><Metric label="Denied calls" value="37" detail="Boundary obligations operated" tone="#ffd36f" /><Metric label="Open anomaly" value="1" detail="Telemetry completeness challenged" tone="#c797ff" /></div><div className="two-column"><article className="panel"><h3>Live obligation channels</h3><div className="monitor-list"><div><span>Authority drift</span><b>Nominal</b><small>Roles and collection authoritys unchanged</small></div><div><span>Obligation drift</span><b>Nominal</b><small>Approved versions observed</small></div><div><span>Retention drift</span><b className="warning">Review</b><small>Manifest freshness exceeded</small></div><div><span>Retention drift</span><b>Nominal</b><small>Aggregate budget within threshold</small></div><div><span>Transfer drift</span><b>Nominal</b><small>No unauthorized serviceDomains</small></div><div><span>Telemetry continuity</span><b className="warning">Challenged</b><small>Seven-minute reconciliation open</small></div></div></article><article className="panel"><h3>Intervention obligations</h3><div className="obligation-grid"><button onClick={() => setMessage("Vendor profile pause obligation tested and receipt preserved.")}>Place vendor hold</button><button onClick={() => setMessage("Obligation vendor credentials revoked in demonstration state.")}>Revoke obligations</button><button onClick={() => setMessage("Quality isolated in demonstration state.")}>Isolate quality</button><button onClick={() => setMessage("All descendant authority revoked in demonstration state.")}>Terminate tree</button></div><p className="callout">Obligations are demonstrated locally. Production actions require connected authority and infrastructure; this page does not invent a backend.</p></article></div><article className="panel"><h3>Recent preserved runs</h3><div className="run-list">{runs.map((run) => <div key={run.id}><span>{run.id}<small>{run.time}</small></span><strong>{run.title}<small>{vendors.find((vendorRisk) => vendorRisk.id === run.vendorId)?.name ?? run.vendorId}</small></strong><Pill tone={toneForState(run.decision)}>{run.decision}</Pill><p>{run.rationale}</p></div>)}</div></article></>
          ) : null}

          {activeTab === "scenarios" ? (
            <><SectionHeader eyebrow="Scenario laboratory" title="Test baseline, failure, drift, adversarial, recovery, and compound conditions" copy="Scenarios alter the 24-link gate without merging the scenario's expected result into the final determination." action={<button className="primary" onClick={applyScenario}>Apply selected scenario</button>} /><div className="scenario-layout"><div className="scenario-list">{INITIAL_SCENARIOS.map((scenario) => <button key={scenario.id} className={scenario.id === selectedScenarioId ? "active" : ""} onClick={() => setSelectedScenarioId(scenario.id)}><span>{scenario.family}</span><strong>{scenario.title}</strong><small>{scenario.expected} · {scenario.severity}</small></button>)}</div><article className="panel scenario-detail"><span className="eyebrow">{selectedScenario.id} · {selectedScenario.family}</span><h3>{selectedScenario.title}</h3><p className="lead">{selectedScenario.summary}</p><dl className="detail-list"><div><dt>Trigger</dt><dd>{selectedScenario.trigger}</dd></div><div><dt>Expected</dt><dd><Pill tone={toneForState(selectedScenario.expected)}>{selectedScenario.expected}</Pill></dd></div><div><dt>Severity</dt><dd><Pill tone={toneForState(selectedScenario.severity)}>{selectedScenario.severity}</Pill></dd></div><div><dt>Recovery</dt><dd>{selectedScenario.recovery}</dd></div></dl><button className="primary wide" onClick={applyScenario}>Load into gate</button></article></div></>
          ) : null}

          {activeTab === "challenge" ? (
            <><SectionHeader eyebrow="Challenge & supersession" title="Every determination remains challengeable without erasing history" copy="Preserve the disputed claim, counterevidence, response, finding, correction, and supersession chain." action={<button className="primary" onClick={addChallenge}>Open challenge</button>} /><div className="challenge-list">{challenges.map((challenge) => <article key={challenge.id}><header><span>{challenge.id}</span><Pill tone={toneForState(challenge.status)}>{challenge.status}</Pill></header><h3>{challenge.title}</h3><small>Submitted by {challenge.submittedBy}</small><div className="challenge-grid"><div><b>Basis</b><p>{challenge.basis}</p></div><div><b>Counterevidence</b><p>{challenge.counterevidence}</p></div><div><b>Response</b><p>{challenge.response}</p></div><div><b>Finding</b><p>{challenge.finding}</p></div></div><footer><button onClick={() => setChallenges((current) => current.map((item) => item.id === challenge.id ? { ...item, status: "UNDER REVIEW" } : item))}>Review</button><button onClick={() => setChallenges((current) => current.map((item) => item.id === challenge.id ? { ...item, status: "SUSTAINED" } : item))}>Sustain</button><button onClick={() => setChallenges((current) => current.map((item) => item.id === challenge.id ? { ...item, status: "REJECTED" } : item))}>Reject</button><button onClick={() => setChallenges((current) => current.map((item) => item.id === challenge.id ? { ...item, status: "SUPERSEDED" } : item))}>Supersede</button></footer></article>)}</div></>
          ) : null}

          {activeTab === "record" ? (
            <><SectionHeader eyebrow="Governed record" title="Preserve claim, evidence, tests, determination, scope, and invalidation triggers" copy="The record is replayable and challengeable. Export does not imply external certification or execution authority." action={<div className="action-row"><button onClick={() => downloadJson("ta14-vendor-governed-record.json", governedRecord)}>Export JSON</button><button onClick={() => downloadCsv("ta14-vendor-gates.csv", gates as unknown as Array<Record<string, unknown>>)}>Export gates CSV</button></div>} /><div className="record-summary"><article><span>Record version</span><strong>{VERSION}</strong></article><article><span>Vendor profile</span><strong>{selectedVendor.id}</strong></article><article><span>Determination</span><strong style={{ color: toneForState(determination) }}>{determination}</strong></article><article><span>Evidence</span><strong>{evidence.length}</strong></article><article><span>Gates</span><strong>{gates.length}</strong></article><article><span>Challenges</span><strong>{challenges.length}</strong></article></div><article className="panel"><h3>Record preview</h3><pre>{JSON.stringify(governedRecord, null, 2)}</pre></article><article className="panel"><h3>Canonical preservation contract</h3><div className="preserve-grid"><div><span>01</span><strong>Claim</strong><p>One bounded vendor-and-regulation claim plus unsupported-layer warning.</p></div><div><span>02</span><strong>Evidence</strong><p>Provenance, integrity, freshness, visibility, and unavailable states.</p></div><div><span>03</span><strong>Scenarios</strong><p>Baseline, failure, drift, adversarial, recovery, and compound tests.</p></div><div><span>04</span><strong>Determination</strong><p>ALLOW, HOLD, DENY, or ESCALATE with scope and invalidation triggers.</p></div><div><span>05</span><strong>Preserve</strong><p>Governed record, evidence manifest, route receipt, export, and replay.</p></div><div><span>06</span><strong>Challenge</strong><p>Counterevidence, response, review finding, correction, and supersession.</p></div></div></article></>
          ) : null}
        </section>
      </section>

      <footer className="footer"><span>TA-14 Exchange Platform</span><strong>No admissible evidence. No admissible execution.</strong><span>Vendor & Third-Party Governance · {VERSION}</span></footer>
      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; background: #050813; }
        :global(body) { margin: 0; background: #050813; color: #eef4ff; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        :global(button), :global(input), :global(textarea), :global(select) { font: inherit; }
        :global(button) { cursor: pointer; }
        .page-shell { min-height: 100vh; position: relative; overflow: hidden; background: radial-gradient(circle at 13% 8%, rgba(65, 117, 255, .18), transparent 30%), radial-gradient(circle at 85% 20%, rgba(118, 65, 255, .15), transparent 28%), linear-gradient(180deg, #070b18 0%, #050813 52%, #070a14 100%); }
        .stars { position: fixed; inset: 0; pointer-events: none; opacity: .35; background-repeat: repeat; z-index: 0; }
        .stars-one { background-image: radial-gradient(circle, rgba(255,255,255,.8) 0 1px, transparent 1.5px); background-size: 73px 73px; animation: drift 90s linear infinite; }
        .stars-two { background-image: radial-gradient(circle, rgba(143,181,255,.8) 0 1px, transparent 1.5px); background-size: 127px 127px; animation: drift 140s linear infinite reverse; }
        @keyframes drift { from { transform: translate3d(0,0,0); } to { transform: translate3d(-160px,120px,0); } }
        .topbar, .hero, .institutional-rule, .workspace-grid, .footer { position: relative; z-index: 1; }
        .topbar { min-height: 74px; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 14px clamp(18px, 4vw, 64px); border-bottom: 1px solid rgba(255,255,255,.09); background: rgba(5,8,19,.82); backdrop-filter: blur(18px); position: sticky; top: 0; z-index: 20; }
        .brand { display: flex; align-items: center; gap: 12px; color: inherit; text-decoration: none; }
        .brand-mark { width: 42px; height: 42px; display: grid; place-items: center; border: 1px solid rgba(143,181,255,.45); background: linear-gradient(145deg, rgba(67,115,255,.25), rgba(136,89,255,.16)); border-radius: 12px; font-weight: 900; letter-spacing: -.04em; }
        .brand b, .brand small { display: block; }
        .brand b { font-size: 13px; letter-spacing: .14em; }
        .brand small { margin-top: 2px; color: #93a4c5; font-size: 11px; }
        .topbar nav { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .topbar nav a { color: #bdc9df; text-decoration: none; font-size: 12px; border: 1px solid rgba(255,255,255,.08); border-radius: 999px; padding: 8px 12px; background: rgba(255,255,255,.025); }
        .topbar nav a:hover { color: white; border-color: rgba(143,181,255,.45); }
        .hero { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(300px,.6fr); gap: 30px; padding: clamp(44px,7vw,92px) clamp(18px,4vw,64px) 40px; max-width: 1600px; margin: 0 auto; }
        .hero-copy { max-width: 920px; }
        .eyebrow { display: inline-block; color: #8fb5ff; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
        .hero h1 { margin: 14px 0 18px; font-size: clamp(44px,7vw,90px); line-height: .96; letter-spacing: -.055em; }
        .hero-copy > p { max-width: 900px; margin: 0; color: #aebbd2; font-size: clamp(17px,2vw,22px); line-height: 1.65; }
        .hero-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 26px; }
        .pill { display: inline-flex; align-items: center; justify-content: center; min-height: 26px; padding: 4px 9px; border: 1px solid color-mix(in srgb, var(--pill-tone) 42%, transparent); color: var(--pill-tone); background: color-mix(in srgb, var(--pill-tone) 10%, transparent); border-radius: 999px; font-size: 10px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; white-space: nowrap; }
        .decision-card { align-self: end; border: 1px solid color-mix(in srgb, var(--decision-tone) 40%, transparent); background: linear-gradient(180deg, color-mix(in srgb, var(--decision-tone) 12%, rgba(11,16,34,.92)), rgba(8,12,27,.94)); border-radius: 22px; padding: 24px; box-shadow: 0 24px 80px rgba(0,0,0,.25); }
        .decision-card > span { color: #9ba9c1; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; }
        .decision-card > strong { display: block; margin: 9px 0 8px; color: var(--decision-tone); font-size: clamp(42px,5vw,66px); line-height: 1; letter-spacing: -.05em; }
        .decision-card > p { color: #c3cee0; line-height: 1.55; font-size: 13px; }
        .decision-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-top: 18px; }
        .decision-grid span { padding: 11px; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; text-align: center; font-weight: 900; }
        .decision-grid small { display: block; margin-top: 4px; color: #8391aa; font-size: 9px; text-transform: uppercase; letter-spacing: .1em; }
        .institutional-rule { max-width: 1472px; margin: 0 auto 30px; padding: 18px 22px; border: 1px solid rgba(255,211,111,.22); background: rgba(255,211,111,.055); border-radius: 16px; display: grid; grid-template-columns: 180px 1fr; gap: 18px; }
        .institutional-rule span { color: #ffd36f; font-size: 11px; text-transform: uppercase; letter-spacing: .14em; font-weight: 900; }
        .institutional-rule strong { font-size: 13px; line-height: 1.55; font-weight: 650; }
        .workspace-grid { width: min(1472px, calc(100% - 36px)); margin: 0 auto 70px; display: grid; grid-template-columns: 270px minmax(0,1fr); gap: 18px; align-items: start; }
        .sidebar { position: sticky; top: 90px; max-height: calc(100vh - 108px); overflow: auto; border: 1px solid rgba(255,255,255,.09); border-radius: 18px; padding: 16px; background: rgba(9,13,28,.88); backdrop-filter: blur(16px); }
        .sidebar-title { display: flex; align-items: center; justify-content: space-between; padding: 2px 3px 14px; border-bottom: 1px solid rgba(255,255,255,.08); }
        .sidebar-title span { color: #8fb5ff; font-size: 10px; letter-spacing: .14em; font-weight: 900; }
        .sidebar-title strong { font-size: 12px; color: #d9e3f5; }
        .vendorRisk-selector { padding: 14px 0; }
        label { display: grid; gap: 7px; color: #9cabc3; font-size: 11px; font-weight: 700; letter-spacing: .04em; }
        input, textarea, select { width: 100%; border: 1px solid rgba(255,255,255,.1); background: rgba(4,8,19,.82); color: #eff5ff; border-radius: 10px; padding: 11px 12px; outline: none; }
        input:focus, textarea:focus, select:focus { border-color: rgba(143,181,255,.58); box-shadow: 0 0 0 3px rgba(65,117,255,.12); }
        textarea { min-height: 104px; resize: vertical; line-height: 1.55; }
        .tab-list { display: grid; gap: 5px; }
        .tab-list button { display: flex; align-items: center; gap: 10px; width: 100%; border: 1px solid transparent; background: transparent; color: #9dabc1; border-radius: 10px; padding: 10px; text-align: left; font-size: 12px; }
        .tab-list button span { color: #61708b; font-size: 9px; font-weight: 900; }
        .tab-list button:hover, .tab-list button.active { color: white; border-color: rgba(143,181,255,.2); background: rgba(73,111,210,.12); }
        .tab-list button.active span { color: #8fb5ff; }
        .sidebar-actions { display: grid; gap: 7px; margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,.08); }
        button { border: 1px solid rgba(143,181,255,.24); background: rgba(83,120,224,.13); color: #dce7fa; border-radius: 10px; padding: 9px 12px; font-weight: 750; font-size: 11px; }
        button:hover { border-color: rgba(143,181,255,.55); background: rgba(83,120,224,.22); }
        button.ghost { background: transparent; border-color: rgba(255,255,255,.1); color: #8998b1; }
        button.primary { background: linear-gradient(135deg, #3f6fe5, #704ed4); border-color: rgba(167,189,255,.48); color: white; box-shadow: 0 10px 30px rgba(51,86,190,.22); }
        button.wide { width: 100%; margin-top: 20px; }
        .status-message { display: block; padding: 10px 2px 0; color: #74839c; line-height: 1.45; }
        .workspace-content { min-width: 0; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; background: rgba(8,12,26,.78); backdrop-filter: blur(14px); padding: clamp(18px,3vw,34px); }
        .section-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 28px; margin-bottom: 24px; }
        .section-header h2 { margin: 7px 0 8px; font-size: clamp(28px,4vw,48px); letter-spacing: -.04em; }
        .section-header p { margin: 0; max-width: 820px; color: #95a4bd; line-height: 1.6; }
        .section-action { flex: 0 0 auto; }
        .metrics { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; margin-bottom: 16px; }
        .metric-card { position: relative; overflow: hidden; min-height: 128px; border: 1px solid color-mix(in srgb, var(--metric-tone) 22%, rgba(255,255,255,.04)); background: linear-gradient(180deg, color-mix(in srgb, var(--metric-tone) 7%, rgba(14,19,39,.9)), rgba(8,12,27,.9)); border-radius: 15px; padding: 16px; }
        .metric-card::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: var(--metric-tone); opacity: .55; }
        .metric-card span { display: block; color: #8796b0; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; font-weight: 900; }
        .metric-card strong { display: block; margin: 12px 0 7px; font-size: 29px; letter-spacing: -.03em; color: var(--metric-tone); }
        .metric-card small { color: #8492a9; line-height: 1.4; }
        .two-column { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; margin-bottom: 16px; }
        .panel { border: 1px solid rgba(255,255,255,.08); border-radius: 16px; background: linear-gradient(180deg, rgba(18,24,47,.78), rgba(8,12,27,.72)); padding: 20px; margin-bottom: 16px; }
        .panel h3 { margin: 0 0 16px; font-size: 19px; letter-spacing: -.015em; }
        .panel h4 { margin: 22px 0 10px; font-size: 13px; }
        .panel > label + label { margin-top: 13px; }
        .field-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; margin-top: 13px; }
        .field-grid label:last-child { grid-column: 1 / -1; }
        .vendor identity-card { border: 1px solid rgba(143,181,255,.15); border-radius: 14px; background: rgba(55,89,175,.08); padding: 18px; }
        .vendor identity-card > span { color: #72809a; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; }
        .vendor identity-card > strong { display: block; margin: 6px 0 7px; font-size: 22px; }
        .vendor identity-card > p { color: #9eacc3; line-height: 1.55; }
        .vendor identity-card > div { display: flex; flex-wrap: wrap; gap: 7px; }
        .boundary-list { margin: 0; padding-left: 18px; color: #9ba9c0; line-height: 1.75; font-size: 13px; }
        .panel-heading { display: flex; justify-content: space-between; gap: 20px; align-items: flex-end; margin-bottom: 18px; }
        .panel-heading h3 { margin: 5px 0 0; }
        .legend { display: flex; gap: 6px; flex-wrap: wrap; }
        .gate-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; }
        .gate-card { min-height: 178px; display: flex; flex-direction: column; align-items: stretch; text-align: left; border-color: color-mix(in srgb, var(--gate-tone) 25%, transparent); background: linear-gradient(180deg, color-mix(in srgb, var(--gate-tone) 7%, rgba(15,20,39,.8)), rgba(7,11,24,.8)); padding: 14px; }
        .gate-card > span { color: #76859e; font-size: 9px; letter-spacing: .1em; text-transform: uppercase; }
        .gate-card > strong { margin-top: 8px; color: #eef4ff; font-size: 14px; }
        .gate-card > p { flex: 1; color: #8f9db5; font-size: 11px; line-height: 1.5; }
        .gate-card footer { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding-top: 9px; border-top: 1px solid rgba(255,255,255,.06); }
        .gate-card footer b { color: var(--gate-tone); font-size: 11px; }
        .gate-card footer small { color: #687791; font-size: 8px; text-transform: uppercase; }
        .registry-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; margin-bottom: 16px; }
        .registry-card { border: 1px solid rgba(255,255,255,.08); border-radius: 15px; background: rgba(14,19,38,.8); padding: 17px; cursor: pointer; transition: .2s ease; }
        .registry-card:hover, .registry-card.selected { transform: translateY(-2px); border-color: rgba(143,181,255,.42); background: rgba(51,77,149,.15); }
        .registry-card header { display: flex; justify-content: space-between; gap: 8px; }
        .registry-card header > span { color: #6f7d96; font-size: 9px; }
        .registry-card h3 { margin: 14px 0 5px; font-size: 17px; }
        .registry-card > small { color: #77869e; }
        .registry-card > p { min-height: 58px; color: #9ba8bd; font-size: 12px; line-height: 1.55; }
        .registry-card dl { display: grid; grid-template-columns: repeat(3,1fr); margin: 0; gap: 5px; }
        .registry-card dl div { padding: 8px; background: rgba(255,255,255,.025); border-radius: 8px; }
        dt { color: #6f7e98; font-size: 9px; text-transform: uppercase; letter-spacing: .08em; }
        dd { margin: 4px 0 0; color: #d7e1f3; font-size: 11px; }
        .rule-grid, .restriction-grid, .preserve-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; }
        .rule-grid > div, .restriction-grid > div, .preserve-grid > div { border: 1px solid rgba(255,255,255,.07); background: rgba(255,255,255,.022); border-radius: 12px; padding: 14px; }
        .rule-grid strong, .restriction-grid strong, .preserve-grid strong { font-size: 13px; }
        .rule-grid p, .restriction-grid p, .preserve-grid p { margin: 7px 0 0; color: #8c9ab2; font-size: 11px; line-height: 1.5; }
        .preserve-grid span { display: block; color: #8fb5ff; font-size: 9px; margin-bottom: 6px; }
        .detail-list { margin: 0; display: grid; gap: 0; }
        .detail-list > div { display: grid; grid-template-columns: 150px 1fr; gap: 16px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,.065); }
        .detail-list > div:last-child { border-bottom: 0; }
        .detail-list dd { font-size: 12px; line-height: 1.5; }
        .boundary-meter { display: grid; gap: 8px; margin-top: 16px; }
        .boundary-meter span { border-left: 3px solid #57e9b1; background: rgba(87,233,177,.06); padding: 10px 12px; border-radius: 5px 10px 10px 5px; font-size: 12px; }
        .boundary-meter span.blocked { border-color: #ff6f7d; background: rgba(255,111,125,.06); color: #ff9aa5; }
        .callout { margin: 14px 0 0; padding: 13px 14px; border: 1px solid rgba(143,181,255,.14); border-radius: 11px; color: #a8b6cc; background: rgba(83,120,224,.06); line-height: 1.55; font-size: 12px; }
        .callout.warn { border-color: rgba(255,211,111,.2); background: rgba(255,211,111,.055); color: #d9c38d; }
        .evidence-list { display: grid; gap: 8px; }
        .evidence-list button { display: grid; grid-template-columns: 55px 1fr auto; align-items: center; gap: 12px; text-align: left; background: rgba(255,255,255,.02); border-color: rgba(255,255,255,.07); }
        .evidence-list button > span { color: #687791; font-size: 9px; }
        .evidence-list button strong { font-size: 12px; }
        .evidence-list button p { margin: 4px 0 0; color: #7f8da4; font-size: 10px; line-height: 1.45; }
        .search input { min-width: 230px; }
        .obligation-table { border: 1px solid rgba(255,255,255,.08); border-radius: 15px; overflow: hidden; margin-bottom: 16px; }
        .table-head, .table-row { display: grid; grid-template-columns: 1.25fr .55fr .65fr .55fr 1.4fr; gap: 12px; align-items: center; padding: 13px 15px; }
        .table-head { background: rgba(143,181,255,.08); color: #8e9db5; font-size: 9px; letter-spacing: .1em; text-transform: uppercase; font-weight: 900; }
        .table-row { border-top: 1px solid rgba(255,255,255,.065); color: #bac6d9; font-size: 11px; }
        .table-row:hover { background: rgba(255,255,255,.025); }
        .table-row b, .table-row small { display: block; }
        .table-row b { color: #edf3ff; font-size: 12px; }
        .table-row small { margin-top: 4px; color: #718098; line-height: 1.4; }
        .permission-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 9px; }
        .permission-grid > div { padding: 14px; border: 1px solid rgba(255,255,255,.07); border-radius: 12px; background: rgba(255,255,255,.02); }
        .permission-grid > div.good { border-color: rgba(87,233,177,.2); background: rgba(87,233,177,.05); }
        .permission-grid span { color: #718099; text-transform: uppercase; font-size: 8px; letter-spacing: .1em; }
        .permission-grid strong { display: block; margin: 7px 0; font-size: 12px; }
        .permission-grid p { margin: 0; color: #8290a8; font-size: 10px; line-height: 1.45; }
        .retention-list { display: grid; gap: 10px; }
        .retention-list > div { display: grid; grid-template-columns: 86px 1fr; column-gap: 10px; border: 1px solid rgba(255,255,255,.06); border-radius: 11px; padding: 12px; }
        .retention-list strong { font-size: 12px; }
        .retention-list p { grid-column: 2; margin: 4px 0 0; color: #8391a8; font-size: 10px; line-height: 1.45; }
        .chain { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
        .chain span { padding: 9px 11px; border: 1px solid rgba(143,181,255,.16); border-radius: 9px; background: rgba(65,117,255,.065); font-size: 10px; }
        .chain i { color: #5c6c88; font-style: normal; }
        .orchestration-map { position: relative; min-height: 260px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 16px; align-items: end; margin-bottom: 16px; padding: 26px; border: 1px solid rgba(255,255,255,.08); border-radius: 16px; background: radial-gradient(circle at 50% 0%, rgba(80,112,211,.12), transparent 45%), rgba(8,12,27,.65); }
        .node { position: relative; z-index: 2; min-height: 110px; border: 1px solid rgba(87,233,177,.2); border-radius: 13px; background: rgba(87,233,177,.045); padding: 15px; }
        .node.parent { grid-column: 1 / -1; width: min(440px,100%); justify-self: center; align-self: start; border-color: rgba(143,181,255,.28); background: rgba(65,117,255,.08); }
        .node.blocked { border-color: rgba(255,111,125,.25); background: rgba(255,111,125,.05); }
        .node span { color: #75849d; font-size: 9px; text-transform: uppercase; letter-spacing: .1em; }
        .node strong, .node small { display: block; }
        .node strong { margin: 7px 0; }
        .node small { color: #8492a8; line-height: 1.45; }
        .branch { position: absolute; top: 113px; left: 20%; right: 20%; height: 80px; border-top: 1px solid rgba(143,181,255,.24); border-left: 1px solid rgba(143,181,255,.24); border-right: 1px solid rgba(143,181,255,.24); border-radius: 12px 12px 0 0; }
        .check-stack { display: grid; gap: 9px; }
        .check-stack > div { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid rgba(255,211,111,.15); border-radius: 11px; background: rgba(255,211,111,.035); }
        .check-stack > div.checked { border-color: rgba(87,233,177,.15); background: rgba(87,233,177,.035); }
        .check-stack b { width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; background: rgba(255,255,255,.06); }
        .check-stack strong, .check-stack small { display: block; }
        .check-stack strong { font-size: 12px; }
        .check-stack small { margin-top: 3px; color: #7f8da5; }
        .big-status { border: 1px solid color-mix(in srgb, var(--status-tone) 30%, transparent); background: color-mix(in srgb, var(--status-tone) 7%, transparent); border-radius: 15px; padding: 22px; }
        .big-status strong { color: var(--status-tone); font-size: 50px; letter-spacing: -.05em; }
        .big-status p { color: #a4b0c4; line-height: 1.6; }
        .monitor-list { display: grid; gap: 7px; }
        .monitor-list > div { display: grid; grid-template-columns: 1fr auto; gap: 5px 15px; padding: 11px 12px; border: 1px solid rgba(255,255,255,.065); border-radius: 10px; }
        .monitor-list span { color: #a9b5c8; font-size: 11px; }
        .monitor-list b { color: #57e9b1; font-size: 10px; text-transform: uppercase; }
        .monitor-list b.warning { color: #ffd36f; }
        .monitor-list small { grid-column: 1 / -1; color: #6f7e96; }
        .obligation-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; }
        .obligation-grid button:last-child { border-color: rgba(255,111,125,.25); background: rgba(255,111,125,.08); color: #ff9ba5; }
        .run-list { display: grid; gap: 8px; }
        .run-list > div { display: grid; grid-template-columns: 140px 1fr auto 1.4fr; gap: 14px; align-items: center; border: 1px solid rgba(255,255,255,.065); border-radius: 11px; padding: 12px; }
        .run-list span, .run-list strong { font-size: 11px; }
        .run-list span small, .run-list strong small { display: block; margin-top: 4px; color: #6f7e97; font-size: 9px; }
        .run-list p { margin: 0; color: #8290a7; font-size: 10px; line-height: 1.45; }
        .scenario-layout { display: grid; grid-template-columns: 310px minmax(0,1fr); gap: 16px; }
        .scenario-list { max-height: 710px; overflow: auto; display: grid; gap: 7px; padding-right: 4px; }
        .scenario-list button { text-align: left; background: rgba(255,255,255,.02); border-color: rgba(255,255,255,.07); }
        .scenario-list button.active { border-color: rgba(143,181,255,.48); background: rgba(65,117,255,.13); }
        .scenario-list span, .scenario-list strong, .scenario-list small { display: block; }
        .scenario-list span { color: #71809a; font-size: 8px; text-transform: uppercase; letter-spacing: .1em; }
        .scenario-list strong { margin: 5px 0; font-size: 12px; }
        .scenario-list small { color: #8593a9; font-size: 9px; }
        .scenario-detail { margin: 0; align-self: start; }
        .scenario-detail h3 { margin-top: 8px; font-size: 28px; }
        .lead { color: #a6b3c8; font-size: 15px; line-height: 1.65; }
        .challenge-list { display: grid; gap: 13px; }
        .challenge-list > article { border: 1px solid rgba(255,255,255,.08); border-radius: 15px; background: rgba(15,20,39,.72); padding: 18px; }
        .challenge-list header { display: flex; justify-content: space-between; gap: 12px; }
        .challenge-list header > span { color: #6e7d96; font-size: 9px; }
        .challenge-list h3 { margin: 10px 0 4px; }
        .challenge-list > article > small { color: #78869e; }
        .challenge-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 9px; margin: 15px 0; }
        .challenge-grid > div { border: 1px solid rgba(255,255,255,.06); border-radius: 10px; padding: 12px; background: rgba(255,255,255,.018); }
        .challenge-grid b { color: #9facbf; font-size: 10px; }
        .challenge-grid p { margin: 6px 0 0; color: #7f8da4; font-size: 10px; line-height: 1.5; }
        .challenge-list footer { display: flex; flex-wrap: wrap; gap: 7px; }
        .record-summary { display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); gap: 8px; margin-bottom: 16px; }
        .record-summary article { border: 1px solid rgba(255,255,255,.07); border-radius: 11px; background: rgba(255,255,255,.02); padding: 12px; }
        .record-summary span { display: block; color: #74829a; font-size: 8px; text-transform: uppercase; letter-spacing: .1em; }
        .record-summary strong { display: block; margin-top: 7px; font-size: 13px; overflow-wrap: anywhere; }
        pre { max-height: 620px; overflow: auto; margin: 0; border: 1px solid rgba(255,255,255,.06); background: #050813; border-radius: 12px; padding: 16px; color: #a9c3f2; font-size: 10px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; }
        .action-row { display: flex; gap: 7px; flex-wrap: wrap; }
        .empty-state { padding: 40px; text-align: center; border: 1px dashed rgba(255,255,255,.12); border-radius: 13px; }
        .empty-state strong { font-size: 16px; }
        .empty-state p { color: #7f8da4; }
        .footer { min-height: 88px; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 24px clamp(18px,4vw,64px); border-top: 1px solid rgba(255,255,255,.08); color: #718099; font-size: 10px; letter-spacing: .07em; text-transform: uppercase; }
        .footer strong { color: #cdd8e9; font-size: 11px; }
        @media (max-width: 1180px) {
          .workspace-grid { grid-template-columns: 230px minmax(0,1fr); }
          .gate-grid, .registry-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .metrics { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .record-summary { grid-template-columns: repeat(3,minmax(0,1fr)); }
          .table-head, .table-row { grid-template-columns: 1.2fr .6fr .7fr .7fr 1fr; }
        }
        @media (max-width: 900px) {
          .topbar { position: relative; }
          .topbar nav { display: none; }
          .hero { grid-template-columns: 1fr; }
          .decision-card { align-self: auto; }
          .institutional-rule { margin-inline: 18px; grid-template-columns: 1fr; }
          .workspace-grid { grid-template-columns: 1fr; }
          .sidebar { position: relative; top: 0; max-height: none; }
          .tab-list { grid-template-columns: repeat(3,1fr); }
          .tab-list button { justify-content: center; text-align: center; }
          .two-column, .scenario-layout { grid-template-columns: 1fr; }
          .scenario-list { max-height: 360px; }
          .permission-grid, .rule-grid, .restriction-grid, .preserve-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .table-head { display: none; }
          .table-row { grid-template-columns: 1fr 1fr; }
          .table-row > span:last-child { grid-column: 1 / -1; }
          .run-list > div { grid-template-columns: 1fr auto; }
          .run-list p { grid-column: 1 / -1; }
        }
        @media (max-width: 620px) {
          .hero { padding-top: 34px; }
          .hero h1 { font-size: 45px; }
          .workspace-grid { width: min(100% - 20px,1472px); }
          .workspace-content { padding: 14px; }
          .tab-list { grid-template-columns: repeat(2,1fr); }
          .metrics, .gate-grid, .registry-grid, .permission-grid, .rule-grid, .restriction-grid, .preserve-grid, .challenge-grid, .record-summary { grid-template-columns: 1fr; }
          .section-header, .panel-heading { align-items: stretch; flex-direction: column; }
          .section-action, .section-action button, .search input { width: 100%; }
          .field-grid { grid-template-columns: 1fr; }
          .detail-list > div { grid-template-columns: 1fr; gap: 4px; }
          .orchestration-map { grid-template-columns: 1fr; }
          .node.parent { grid-column: auto; }
          .branch { display: none; }
          .table-row { grid-template-columns: 1fr; }
          .table-row > span:last-child { grid-column: auto; }
          .footer { flex-direction: column; text-align: center; }
        }
      `}</style>
    </main>
  );
}
