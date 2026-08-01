"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

type View = "inspection" | "chain" | "runtime" | "evidence" | "authority" | "conflict" | "control" | "outcome" | "integrity" | "verify" | "challenge";
type GateResult = "PASS" | "FAIL" | "UNRESOLVED" | "NOT_APPLICABLE";
type VerificationState = "IDLE" | "RUNNING" | "VERIFIED";

type ChainItem = { number: string; link: string; result: GateResult; question: string; finding: string; proof: string };
type GateItem = { number: string; title: string; result: GateResult; reasonCode: string; summary: string };
type EvidenceItem = { id: string; title: string; source: string; type: string; disclosure: string; status: string; capturedAt: string; hash: string; supports: string; limitation: string };
type AuthorityItem = { id: string; actor: string; role: string; scope: string; state: string };
type TimelineItem = { time: string; event: string; detail: string; state: string };
type ControlItem = { id: string; title: string; detail: string };
type VerificationItem = { level: string; label: string; detail: string };
type AcceptanceItem = { id: string; result: string; condition: string };
type PackageItem = { number: string; component: string; status: string; detail: string };

const ARTIFACT_ID = "TA14-EA-000004";
const ARTIFACT_TITLE = "Conflicting Admissible Evidence Escalated";
const ROUTE_ID = "TA14-ROUTE-EVIDENCE-CONFLICT-ESCALATE-004";
const ROUTE_VERSION = "2.0.0";
const RECORD_HASH = "sha256:4f9b5339148f4ddac3dd3d4c77034df9678ee1c7ba7a34c861f018a82691744a";
const PACKAGE_HASH = "sha256:4a074ca48d8f7619b90eb2d09c246a9f7f89c9b92399b574bb0a3e95f84e174d";
const RECEIPT_HASH = "sha256:1fa92b9e81389577e2df11399d00dfd141cb44825fd179755da3424d12d909e2";

const chain: ChainItem[] = [
  {
    number: "01",
    link: "Reality",
    result: "PASS",
    question: "What condition existed before interpretation?",
    finding: "A consequential clinical routing decision was proposed for one patient episode while two current evidence packages supported incompatible next actions.",
    proof: "The patient episode, proposed action, affected parties, consequence, uncertainty, and decision deadline were frozen before evaluation.",
  },
  {
    number: "02",
    link: "Record",
    result: "PASS",
    question: "What attributable representation was preserved?",
    finding: "Both evidence packages, source identities, capture times, methods, review notes, route snapshot, and disclosure boundaries were recorded.",
    proof: "Every material input has a stable identifier, provenance statement, integrity commitment, and review status.",
  },
  {
    number: "03",
    link: "Continuity",
    result: "PASS",
    question: "Did identity, provenance, time, custody, and version remain connected?",
    finding: "Continuity remained intact for both evidence packages through intake, review, and runtime evaluation.",
    proof: "Neither source was stale, altered, detached from identity, or substituted after capture.",
  },
  {
    number: "04",
    link: "Admissibility",
    result: "UNRESOLVED",
    question: "May the material support this exact consequence now?",
    finding: "Each package was individually admissible, but the two admissible records supported incompatible consequential outcomes.",
    proof: "The route prohibited silent preference, averaging, or convenience-based selection and required named adjudication.",
  },
  {
    number: "05",
    link: "Binding",
    result: "UNRESOLVED",
    question: "What rule validly governs the consequence?",
    finding: "The conflict rule bound the route to ESCALATE because no single determination could be supported without resolving the contradiction.",
    proof: "The named adjudication requirement was applied before any care-routing instruction could bind.",
  },
  {
    number: "06",
    link: "Commit",
    result: "PASS",
    question: "Was the decision fixed before action?",
    finding: "ESCALATE was committed with the conflict code, named adjudicator, exact hold scope, and permitted next action.",
    proof: "The commit record predates the adapter command and prevents escalation from being treated as approval.",
  },
  {
    number: "07",
    link: "Execution",
    result: "PASS",
    question: "Did the determination control the action path?",
    finding: "The adapter held the proposed care-routing instruction and routed the record to the designated clinical adjudicator.",
    proof: "Receipt EA-000004-EX-01 records HTTP 202, AWAITING_ADJUDICATION, zero care-path changes, and no alternate-path release.",
  },
  {
    number: "08",
    link: "Outcome",
    result: "PASS",
    question: "What consequence actually bound to reality?",
    finding: "No consequential care-routing instruction was released before adjudication. The conflict and next required authority remain preserved.",
    proof: "Queue state, target-system audit, and outcome review confirm zero route changes while the case remained available for bounded resolution.",
  },
];

const runtime: GateItem[] = [
  {
    number: "01",
    title: "Reality identified",
    result: "PASS",
    reasonCode: "SUPPORTED",
    summary: "Required support was present, attributable, current, and connected for this route.",
  },
  {
    number: "02",
    title: "Proposed action bounded",
    result: "PASS",
    reasonCode: "SUPPORTED",
    summary: "Required support was present, attributable, current, and connected for this route.",
  },
  {
    number: "03",
    title: "Affected subject identified",
    result: "PASS",
    reasonCode: "SUPPORTED",
    summary: "Required support was present, attributable, current, and connected for this route.",
  },
  {
    number: "04",
    title: "Consequence declared",
    result: "PASS",
    reasonCode: "SUPPORTED",
    summary: "Required support was present, attributable, current, and connected for this route.",
  },
  {
    number: "05",
    title: "Source identity verified",
    result: "PASS",
    reasonCode: "SUPPORTED",
    summary: "Required support was present, attributable, current, and connected for this route.",
  },
  {
    number: "06",
    title: "Evidence provenance verified",
    result: "PASS",
    reasonCode: "SUPPORTED",
    summary: "Required support was present, attributable, current, and connected for this route.",
  },
  {
    number: "07",
    title: "Capture time verified",
    result: "PASS",
    reasonCode: "SUPPORTED",
    summary: "Required support was present, attributable, current, and connected for this route.",
  },
  {
    number: "08",
    title: "Custody preserved",
    result: "PASS",
    reasonCode: "SUPPORTED",
    summary: "Required support was present, attributable, current, and connected for this route.",
  },
  {
    number: "09",
    title: "Integrity verified",
    result: "PASS",
    reasonCode: "SUPPORTED",
    summary: "Required support was present, attributable, current, and connected for this route.",
  },
  {
    number: "10",
    title: "Continuity preserved",
    result: "PASS",
    reasonCode: "SUPPORTED",
    summary: "Required support was present, attributable, current, and connected for this route.",
  },
  {
    number: "11",
    title: "Relevance established",
    result: "PASS",
    reasonCode: "SUPPORTED",
    summary: "Required support was present, attributable, current, and connected for this route.",
  },
  {
    number: "12",
    title: "Freshness established",
    result: "PASS",
    reasonCode: "SUPPORTED",
    summary: "Required support was present, attributable, current, and connected for this route.",
  },
  {
    number: "13",
    title: "Sufficiency established",
    result: "PASS",
    reasonCode: "SUPPORTED",
    summary: "Required support was present, attributable, current, and connected for this route.",
  },
  {
    number: "14",
    title: "Conflict surfaced",
    result: "UNRESOLVED",
    reasonCode: "ADMISSIBLE_EVIDENCE_CONFLICT",
    summary: "Two admissible records supported incompatible consequential outcomes.",
  },
  {
    number: "15",
    title: "Admissibility evaluated",
    result: "UNRESOLVED",
    reasonCode: "ADMISSIBILITY_REQUIRES_ADJUDICATION",
    summary: "The route could not select either conclusion without named adjudication.",
  },
  {
    number: "16",
    title: "Authority identified",
    result: "PASS",
    reasonCode: "ESCALATION_AUTHORITY_READY",
    summary: "The designated adjudicator and escalation obligation were identified and in scope.",
  },
  {
    number: "17",
    title: "Authority scope verified",
    result: "PASS",
    reasonCode: "ESCALATION_AUTHORITY_READY",
    summary: "The designated adjudicator and escalation obligation were identified and in scope.",
  },
  {
    number: "18",
    title: "Obligation resolved",
    result: "PASS",
    reasonCode: "ESCALATION_AUTHORITY_READY",
    summary: "The designated adjudicator and escalation obligation were identified and in scope.",
  },
  {
    number: "19",
    title: "Binding rule applied",
    result: "UNRESOLVED",
    reasonCode: "CONFLICT_RULE_BINDS_ESCALATION",
    summary: "The binding rule prohibited release and required escalation.",
  },
  {
    number: "20",
    title: "Determination committed",
    result: "PASS",
    reasonCode: "ESCALATION_ENFORCED",
    summary: "ESCALATE was committed, technically enforced, and preserved through outcome closure.",
  },
  {
    number: "21",
    title: "Pre-execution revalidation",
    result: "PASS",
    reasonCode: "ESCALATION_ENFORCED",
    summary: "ESCALATE was committed, technically enforced, and preserved through outcome closure.",
  },
  {
    number: "22",
    title: "Execution controlled",
    result: "PASS",
    reasonCode: "ESCALATION_ENFORCED",
    summary: "ESCALATE was committed, technically enforced, and preserved through outcome closure.",
  },
  {
    number: "23",
    title: "Correspondence verified",
    result: "PASS",
    reasonCode: "ESCALATION_ENFORCED",
    summary: "ESCALATE was committed, technically enforced, and preserved through outcome closure.",
  },
  {
    number: "24",
    title: "Outcome preserved",
    result: "PASS",
    reasonCode: "ESCALATION_ENFORCED",
    summary: "ESCALATE was committed, technically enforced, and preserved through outcome closure.",
  },
];

const evidence: EvidenceItem[] = [
  {
    id: "EV-001",
    title: "Patient episode snapshot",
    source: "Clinical intake system",
    type: "SYSTEM_RECORD",
    disclosure: "PUBLIC_SUMMARY",
    status: "ADMITTED",
    capturedAt: "2026-08-01T12:04:11Z",
    hash: "sha256:bcf1b43a7edc25b1a7c53cfcbde6020d",
    supports: "Establishes the bounded patient episode and proposed routing action.",
    limitation: "Does not independently resolve the conflicting clinical conclusion.",
  },
  {
    id: "EV-002",
    title: "Laboratory evidence package",
    source: "Accredited laboratory interface",
    type: "MEASUREMENT_PACKAGE",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-08-01T12:05:03Z",
    hash: "sha256:6840f1da2c5f649e80eb67ba686d9f1c",
    supports: "Supports urgent specialist review based on current measured findings.",
    limitation: "One admissible source; not entitled to erase contradictory evidence.",
  },
  {
    id: "EV-003",
    title: "Imaging interpretation package",
    source: "Credentialed imaging service",
    type: "CLINICAL_INTERPRETATION",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-08-01T12:05:37Z",
    hash: "sha256:90b9d6cf7f5f31a98d86cbe9c72e94de",
    supports: "Supports monitored observation rather than immediate specialist routing.",
    limitation: "One admissible source; contains declared interpretive uncertainty.",
  },
  {
    id: "EV-004",
    title: "Laboratory provenance ledger",
    source: "Evidence custodian",
    type: "PROVENANCE_RECORD",
    disclosure: "PUBLIC_SUMMARY",
    status: "ADMITTED",
    capturedAt: "2026-08-01T12:06:10Z",
    hash: "sha256:0dc2e3798a4a60288b9f5354a07027f3",
    supports: "Proves source identity, capture method, version, and custody for EV-002.",
    limitation: "Proves integrity and lineage, not clinical correctness by itself.",
  },
  {
    id: "EV-005",
    title: "Imaging provenance ledger",
    source: "Evidence custodian",
    type: "PROVENANCE_RECORD",
    disclosure: "PUBLIC_SUMMARY",
    status: "ADMITTED",
    capturedAt: "2026-08-01T12:06:22Z",
    hash: "sha256:cb1e738836a8fd2ea6542d948345f83e",
    supports: "Proves source identity, capture method, version, and custody for EV-003.",
    limitation: "Proves integrity and lineage, not clinical correctness by itself.",
  },
  {
    id: "EV-006",
    title: "Route snapshot",
    source: "TA-14 route resolver",
    type: "ROUTE_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01T12:06:40Z",
    hash: "sha256:941f83620b7f81666e31d9ac614f46d8",
    supports: "Freezes conflict rules, gate order, adjudication authority, and execution boundary.",
    limitation: "Applies only to this route version and declared consequence.",
  },
  {
    id: "EV-007",
    title: "Adjudicator authority record",
    source: "Clinical governance office",
    type: "AUTHORITY_RECORD",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-08-01T12:06:57Z",
    hash: "sha256:9f729859ba3e94436477150322f51438",
    supports: "Establishes the named clinical adjudicator and exact conflict-resolution scope.",
    limitation: "Does not pre-decide the adjudicator’s substantive conclusion.",
  },
  {
    id: "EV-008",
    title: "Execution adapter receipt",
    source: "TA-14 reference adapter",
    type: "SYSTEM_RECEIPT",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01T12:08:18Z",
    hash: "sha256:364c40391f82f3ee87964ec4834b9bb5",
    supports: "Proves the instruction was held and routed to adjudication.",
    limitation: "Proves control effect, not the final adjudicated clinical outcome.",
  },
  {
    id: "EV-009",
    title: "Target-system audit",
    source: "Clinical routing audit service",
    type: "AUDIT_RECORD",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-08-01T12:08:45Z",
    hash: "sha256:4f33843cfca4ce93829235caf782f65a",
    supports: "Confirms zero consequential route changes before adjudication.",
    limitation: "Covers the bounded target system and recorded interval only.",
  },
  {
    id: "EV-010",
    title: "Outcome closure statement",
    source: "Outcome verifier",
    type: "OUTCOME_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01T12:09:11Z",
    hash: "sha256:69eeea3e652d5123e250686259555968",
    supports: "Preserves the held state, residual uncertainty, and next required action.",
    limitation: "Does not claim the clinical conflict itself has been resolved.",
  },
  {
    id: "EV-011",
    title: "Challenge channel record",
    source: "TA-14 challenge office",
    type: "REVIEW_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01T12:09:35Z",
    hash: "sha256:06cad81f2f9ff7b18931e034bf8d429e",
    supports: "Provides a bounded method to challenge evidence, process, or public claims.",
    limitation: "A challenge does not silently alter the original event.",
  },
  {
    id: "EV-012",
    title: "Package parity report",
    source: "TA-14 integrity packager",
    type: "INTEGRITY_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01T12:09:59Z",
    hash: "sha256:9e07a6f593e87b15432005bf0a509b9a",
    supports: "Confirms page, JSON, manifest, receipt, and outcome share one frozen root.",
    limitation: "Parity does not substitute for independent substantive review.",
  },
];

const authorities: AuthorityItem[] = [
  {
    id: "AUTH-001",
    actor: "Clinical route steward",
    role: "Route Steward",
    scope: "Maintains route logic, conflict rules, and declared limits.",
    state: "VALID",
  },
  {
    id: "AUTH-002",
    actor: "Evidence custodian",
    role: "Evidence Custodian",
    scope: "Preserves source identity, provenance, custody, freshness, and disclosure.",
    state: "VALID",
  },
  {
    id: "AUTH-003",
    actor: "Clinical adjudicator A-17",
    role: "Named Adjudicator",
    scope: "May resolve this exact evidence conflict within the declared clinical scope.",
    state: "VALID",
  },
  {
    id: "AUTH-004",
    actor: "Runtime operator",
    role: "Runtime Operator",
    scope: "May execute the route but may not resolve the substantive conflict.",
    state: "VALID",
  },
  {
    id: "AUTH-005",
    actor: "Reference adapter",
    role: "Execution Adapter",
    scope: "May hold and route the instruction; may not release a consequential instruction while conflict remains unresolved.",
    state: "VALID",
  },
  {
    id: "AUTH-006",
    actor: "Outcome verifier",
    role: "Outcome Verifier",
    scope: "May confirm target-system state and preserve closure evidence.",
    state: "VALID",
  },
];

const timeline: TimelineItem[] = [
  {
    time: "12:04:11 UTC",
    event: "ACTION PROPOSED",
    detail: "A clinical routing instruction was proposed for one bounded patient episode.",
    state: "INTAKE",
  },
  {
    time: "12:05:03 UTC",
    event: "LABORATORY PACKAGE RECEIVED",
    detail: "Current measured findings supported urgent specialist review.",
    state: "SOURCE_A",
  },
  {
    time: "12:05:37 UTC",
    event: "IMAGING PACKAGE RECEIVED",
    detail: "Current imaging interpretation supported monitored observation.",
    state: "SOURCE_B",
  },
  {
    time: "12:06:22 UTC",
    event: "CONTINUITY VERIFIED",
    detail: "Identity, provenance, custody, time, and version remained intact for both packages.",
    state: "CONTINUOUS",
  },
  {
    time: "12:07:04 UTC",
    event: "CONFLICT SURFACED",
    detail: "The two admissible packages supported incompatible consequential outcomes.",
    state: "CONFLICT",
  },
  {
    time: "12:07:29 UTC",
    event: "ADMISSIBILITY HELD OPEN",
    detail: "Neither record was silently preferred, averaged, or discarded.",
    state: "UNRESOLVED",
  },
  {
    time: "12:07:52 UTC",
    event: "ESCALATE COMMITTED",
    detail: "The named adjudicator, hold scope, and permitted next action were fixed before adapter invocation.",
    state: "COMMITTED",
  },
  {
    time: "12:08:18 UTC",
    event: "EXECUTION HELD AND ROUTED",
    detail: "The adapter returned HTTP 202 and moved the case to AWAITING_ADJUDICATION.",
    state: "ENFORCED",
  },
  {
    time: "12:08:45 UTC",
    event: "ZERO ROUTE CHANGE VERIFIED",
    detail: "The target-system audit confirmed no consequential care-routing instruction was released.",
    state: "VERIFIED",
  },
  {
    time: "12:09:11 UTC",
    event: "OUTCOME CLOSED",
    detail: "The preserved outcome remained held pending adjudication with residual uncertainty visible.",
    state: "CLOSED",
  },
];

const controls: ControlItem[] = [
  {
    id: "CONFLICT-01",
    title: "No silent preference",
    detail: "The runtime may not select the more convenient, familiar, or favorable admissible source.",
  },
  {
    id: "CONFLICT-02",
    title: "No averaging of incompatible conclusions",
    detail: "Materially different consequential outcomes may not be blended into a synthetic approval.",
  },
  {
    id: "CONFLICT-03",
    title: "Preserve both records",
    detail: "Both evidence packages remain visible, attributable, and challengeable.",
  },
  {
    id: "CONFLICT-04",
    title: "Named adjudicator required",
    detail: "Only the designated authority may resolve this conflict for this route.",
  },
  {
    id: "CONFLICT-05",
    title: "Escalation is not approval",
    detail: "The adapter must not interpret assignment to a human as permission to execute.",
  },
  {
    id: "CONFLICT-06",
    title: "Exact hold scope",
    detail: "Only the proposed care-routing instruction is held; unrelated permitted care remains outside this record.",
  },
  {
    id: "CONFLICT-07",
    title: "Revalidation after adjudication",
    detail: "Any later decision must revalidate evidence, authority, patient state, and route version.",
  },
  {
    id: "CONFLICT-08",
    title: "Original event immutable",
    detail: "A later resolution appends to this artifact and does not rewrite the original ESCALATE event.",
  },
  {
    id: "CONFLICT-09",
    title: "No alternate-path release",
    detail: "Retries, manual resubmission, and alternate adapters inherit the unresolved conflict state.",
  },
  {
    id: "CONFLICT-10",
    title: "Outcome must be observed",
    detail: "The route closes only after zero route change or a later authorized consequence is verified.",
  },
  {
    id: "CONFLICT-11",
    title: "Claims remain bounded",
    detail: "This record proves one controlled conflict event, not universal clinical validity.",
  },
  {
    id: "CONFLICT-12",
    title: "Challenge remains open",
    detail: "Reviewers may challenge source fitness, route logic, adjudicator scope, or public claims.",
  },
];

const verificationLevels: VerificationItem[] = [
  {
    level: "L0",
    label: "Declared",
    detail: "The publisher declares the bounded record and its stated limits.",
  },
  {
    level: "L1",
    label: "Package integrity",
    detail: "Component hashes reproduce the published package root.",
  },
  {
    level: "L2",
    label: "Signature validity",
    detail: "The integrity manifest validates against the published signing policy.",
  },
  {
    level: "L3",
    label: "Record parity",
    detail: "Page, canonical JSON, manifest, receipt, and outcome resolve to one record root.",
  },
  {
    level: "L4",
    label: "Replay consistency",
    detail: "Disclosed inputs and route version reproduce ESCALATE.",
  },
  {
    level: "L5",
    label: "Execution effect",
    detail: "The adapter receipt proves HELD_AND_ROUTED with zero route changes.",
  },
  {
    level: "L6",
    label: "Outcome closure",
    detail: "Target-system audit supports the reported held state and residual uncertainty.",
  },
  {
    level: "L7",
    label: "Independent review",
    detail: "A qualified reviewer may publish a bounded opinion without becoming the artifact owner.",
  },
];

const acceptanceTests: AcceptanceItem[] = [
  {
    id: "AT-01",
    result: "PASS",
    condition: "One immutable artifact root links the scenario, route, evidence, authority, gates, commit, effect, and outcome.",
  },
  {
    id: "AT-02",
    result: "PASS",
    condition: "Both evidence packages remain attributable, current, and integrity-committed.",
  },
  {
    id: "AT-03",
    result: "PASS",
    condition: "Continuity passes and is not misidentified as the controlling failure.",
  },
  {
    id: "AT-04",
    result: "PASS",
    condition: "Admissibility remains unresolved because admissible sources conflict.",
  },
  {
    id: "AT-05",
    result: "PASS",
    condition: "Neither source is silently preferred, discarded, or averaged.",
  },
  {
    id: "AT-06",
    result: "PASS",
    condition: "ESCALATE is committed before adapter invocation.",
  },
  {
    id: "AT-07",
    result: "PASS",
    condition: "The named adjudicator and exact authority scope are preserved.",
  },
  {
    id: "AT-08",
    result: "PASS",
    condition: "Execution effect is HELD_AND_ROUTED, not ALLOW, HOLD, or DENY.",
  },
  {
    id: "AT-09",
    result: "PASS",
    condition: "Receipt reports HTTP 202 and AWAITING_ADJUDICATION.",
  },
  {
    id: "AT-10",
    result: "PASS",
    condition: "Target audit confirms zero consequential route changes.",
  },
  {
    id: "AT-11",
    result: "PASS",
    condition: "A bypass attempt cannot release the instruction under the unresolved state.",
  },
  {
    id: "AT-12",
    result: "PASS",
    condition: "Repair requires adjudication plus revalidation, not retroactive approval.",
  },
  {
    id: "AT-13",
    result: "PASS",
    condition: "Public claims state what the artifact proves and does not prove.",
  },
  {
    id: "AT-14",
    result: "PASS",
    condition: "Challenge and correction append without erasing the original event.",
  },
  {
    id: "AT-15",
    result: "PASS",
    condition: "All downloadable components resolve to the same frozen record root.",
  },
];

const packageComponents: PackageItem[] = [
  {
    number: "01",
    component: "Public inspection page",
    status: "READY",
    detail: "Human-readable sixty-second view and progressive disclosure.",
  },
  {
    number: "02",
    component: "Bounded-record PDF",
    status: "READY",
    detail: "Institutional export generated from the frozen record.",
  },
  {
    number: "03",
    component: "Canonical JSON",
    status: "READY",
    detail: "Machine-readable graph of the complete bounded event.",
  },
  {
    number: "04",
    component: "Scenario snapshot",
    status: "READY",
    detail: "Proposed action, consequence, subjects, assumptions, and limits.",
  },
  {
    number: "05",
    component: "Route snapshot",
    status: "READY",
    detail: "Frozen route version, conflict rule, gate order, and jurisdiction profile.",
  },
  {
    number: "06",
    component: "Evidence manifest",
    status: "READY",
    detail: "Source metadata, hashes, freshness, admissibility, and disclosure states.",
  },
  {
    number: "07",
    component: "Authority ledger",
    status: "READY",
    detail: "Named actors, sources, scopes, validity, and separation of duties.",
  },
  {
    number: "08",
    component: "Continuity record",
    status: "READY",
    detail: "Identity, provenance, time, custody, version, and dependency continuity.",
  },
  {
    number: "09",
    component: "Admissibility record",
    status: "READY",
    detail: "Individual admissibility findings and unresolved conflict conclusion.",
  },
  {
    number: "10",
    component: "24-gate ledger",
    status: "READY",
    detail: "Ordered runtime results, reason codes, and earliest controlling failure.",
  },
  {
    number: "11",
    component: "Commit record",
    status: "READY",
    detail: "ESCALATE determination, reasons, time, adjudicator, and permitted next action.",
  },
  {
    number: "12",
    component: "Execution receipt",
    status: "READY",
    detail: "HTTP 202, HELD_AND_ROUTED, queue state, and zero route changes.",
  },
  {
    number: "13",
    component: "Target audit",
    status: "READY",
    detail: "Independent system record confirming no consequential route change.",
  },
  {
    number: "14",
    component: "Outcome record",
    status: "READY",
    detail: "Held state, residual uncertainty, and required next action.",
  },
  {
    number: "15",
    component: "Integrity manifest",
    status: "READY",
    detail: "Record hash, package hash, component hashes, and verifier version.",
  },
  {
    number: "16",
    component: "Verification guide",
    status: "READY",
    detail: "Online and offline procedures with expected outputs.",
  },
  {
    number: "17",
    component: "Replay package",
    status: "READY",
    detail: "Permitted inputs sufficient to reproduce ESCALATE.",
  },
  {
    number: "18",
    component: "Acceptance report",
    status: "READY",
    detail: "Fifteen tests covering conflict, control effect, parity, and boundaries.",
  },
  {
    number: "19",
    component: "Challenge record",
    status: "READY",
    detail: "Append-only channel for disputes, responses, and corrections.",
  },
  {
    number: "20",
    component: "Claims-boundary statement",
    status: "READY",
    detail: "Exact statement of proof and non-proof.",
  },
];


const institutionalReviewQuestions = [
  {
    id: "REVIEW-001",
    domain: "REALITY",
    question: "Institutional review question 001",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-002",
    domain: "RECORD",
    question: "Institutional review question 002",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-003",
    domain: "CONTINUITY",
    question: "Institutional review question 003",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-004",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 004",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-005",
    domain: "BINDING",
    question: "Institutional review question 005",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-006",
    domain: "COMMIT",
    question: "Institutional review question 006",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-007",
    domain: "EXECUTION",
    question: "Institutional review question 007",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-008",
    domain: "OUTCOME",
    question: "Institutional review question 008",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-009",
    domain: "REALITY",
    question: "Institutional review question 009",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-010",
    domain: "RECORD",
    question: "Institutional review question 010",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-011",
    domain: "CONTINUITY",
    question: "Institutional review question 011",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-012",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 012",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-013",
    domain: "BINDING",
    question: "Institutional review question 013",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-014",
    domain: "COMMIT",
    question: "Institutional review question 014",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-015",
    domain: "EXECUTION",
    question: "Institutional review question 015",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-016",
    domain: "OUTCOME",
    question: "Institutional review question 016",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-017",
    domain: "REALITY",
    question: "Institutional review question 017",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-018",
    domain: "RECORD",
    question: "Institutional review question 018",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-019",
    domain: "CONTINUITY",
    question: "Institutional review question 019",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-020",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 020",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-021",
    domain: "BINDING",
    question: "Institutional review question 021",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-022",
    domain: "COMMIT",
    question: "Institutional review question 022",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-023",
    domain: "EXECUTION",
    question: "Institutional review question 023",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-024",
    domain: "OUTCOME",
    question: "Institutional review question 024",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-025",
    domain: "REALITY",
    question: "Institutional review question 025",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-026",
    domain: "RECORD",
    question: "Institutional review question 026",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-027",
    domain: "CONTINUITY",
    question: "Institutional review question 027",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-028",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 028",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-029",
    domain: "BINDING",
    question: "Institutional review question 029",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-030",
    domain: "COMMIT",
    question: "Institutional review question 030",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-031",
    domain: "EXECUTION",
    question: "Institutional review question 031",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-032",
    domain: "OUTCOME",
    question: "Institutional review question 032",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-033",
    domain: "REALITY",
    question: "Institutional review question 033",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-034",
    domain: "RECORD",
    question: "Institutional review question 034",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-035",
    domain: "CONTINUITY",
    question: "Institutional review question 035",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-036",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 036",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-037",
    domain: "BINDING",
    question: "Institutional review question 037",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-038",
    domain: "COMMIT",
    question: "Institutional review question 038",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-039",
    domain: "EXECUTION",
    question: "Institutional review question 039",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-040",
    domain: "OUTCOME",
    question: "Institutional review question 040",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-041",
    domain: "REALITY",
    question: "Institutional review question 041",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-042",
    domain: "RECORD",
    question: "Institutional review question 042",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-043",
    domain: "CONTINUITY",
    question: "Institutional review question 043",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-044",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 044",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-045",
    domain: "BINDING",
    question: "Institutional review question 045",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-046",
    domain: "COMMIT",
    question: "Institutional review question 046",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-047",
    domain: "EXECUTION",
    question: "Institutional review question 047",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-048",
    domain: "OUTCOME",
    question: "Institutional review question 048",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-049",
    domain: "REALITY",
    question: "Institutional review question 049",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-050",
    domain: "RECORD",
    question: "Institutional review question 050",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-051",
    domain: "CONTINUITY",
    question: "Institutional review question 051",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-052",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 052",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-053",
    domain: "BINDING",
    question: "Institutional review question 053",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-054",
    domain: "COMMIT",
    question: "Institutional review question 054",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-055",
    domain: "EXECUTION",
    question: "Institutional review question 055",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-056",
    domain: "OUTCOME",
    question: "Institutional review question 056",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-057",
    domain: "REALITY",
    question: "Institutional review question 057",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-058",
    domain: "RECORD",
    question: "Institutional review question 058",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-059",
    domain: "CONTINUITY",
    question: "Institutional review question 059",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-060",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 060",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-061",
    domain: "BINDING",
    question: "Institutional review question 061",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-062",
    domain: "COMMIT",
    question: "Institutional review question 062",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-063",
    domain: "EXECUTION",
    question: "Institutional review question 063",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-064",
    domain: "OUTCOME",
    question: "Institutional review question 064",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-065",
    domain: "REALITY",
    question: "Institutional review question 065",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-066",
    domain: "RECORD",
    question: "Institutional review question 066",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-067",
    domain: "CONTINUITY",
    question: "Institutional review question 067",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-068",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 068",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-069",
    domain: "BINDING",
    question: "Institutional review question 069",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-070",
    domain: "COMMIT",
    question: "Institutional review question 070",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-071",
    domain: "EXECUTION",
    question: "Institutional review question 071",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-072",
    domain: "OUTCOME",
    question: "Institutional review question 072",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-073",
    domain: "REALITY",
    question: "Institutional review question 073",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-074",
    domain: "RECORD",
    question: "Institutional review question 074",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-075",
    domain: "CONTINUITY",
    question: "Institutional review question 075",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-076",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 076",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-077",
    domain: "BINDING",
    question: "Institutional review question 077",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-078",
    domain: "COMMIT",
    question: "Institutional review question 078",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-079",
    domain: "EXECUTION",
    question: "Institutional review question 079",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-080",
    domain: "OUTCOME",
    question: "Institutional review question 080",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-081",
    domain: "REALITY",
    question: "Institutional review question 081",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-082",
    domain: "RECORD",
    question: "Institutional review question 082",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-083",
    domain: "CONTINUITY",
    question: "Institutional review question 083",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-084",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 084",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-085",
    domain: "BINDING",
    question: "Institutional review question 085",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-086",
    domain: "COMMIT",
    question: "Institutional review question 086",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-087",
    domain: "EXECUTION",
    question: "Institutional review question 087",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-088",
    domain: "OUTCOME",
    question: "Institutional review question 088",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-089",
    domain: "REALITY",
    question: "Institutional review question 089",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-090",
    domain: "RECORD",
    question: "Institutional review question 090",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-091",
    domain: "CONTINUITY",
    question: "Institutional review question 091",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-092",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 092",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-093",
    domain: "BINDING",
    question: "Institutional review question 093",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-094",
    domain: "COMMIT",
    question: "Institutional review question 094",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-095",
    domain: "EXECUTION",
    question: "Institutional review question 095",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-096",
    domain: "OUTCOME",
    question: "Institutional review question 096",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-097",
    domain: "REALITY",
    question: "Institutional review question 097",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-098",
    domain: "RECORD",
    question: "Institutional review question 098",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-099",
    domain: "CONTINUITY",
    question: "Institutional review question 099",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-100",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 100",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-101",
    domain: "BINDING",
    question: "Institutional review question 101",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-102",
    domain: "COMMIT",
    question: "Institutional review question 102",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-103",
    domain: "EXECUTION",
    question: "Institutional review question 103",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-104",
    domain: "OUTCOME",
    question: "Institutional review question 104",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-105",
    domain: "REALITY",
    question: "Institutional review question 105",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-106",
    domain: "RECORD",
    question: "Institutional review question 106",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-107",
    domain: "CONTINUITY",
    question: "Institutional review question 107",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-108",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 108",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-109",
    domain: "BINDING",
    question: "Institutional review question 109",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-110",
    domain: "COMMIT",
    question: "Institutional review question 110",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-111",
    domain: "EXECUTION",
    question: "Institutional review question 111",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-112",
    domain: "OUTCOME",
    question: "Institutional review question 112",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-113",
    domain: "REALITY",
    question: "Institutional review question 113",
    criterion: "Confirm that reality evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-114",
    domain: "RECORD",
    question: "Institutional review question 114",
    criterion: "Confirm that record evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-115",
    domain: "CONTINUITY",
    question: "Institutional review question 115",
    criterion: "Confirm that continuity evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-116",
    domain: "ADMISSIBILITY",
    question: "Institutional review question 116",
    criterion: "Confirm that admissibility evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-117",
    domain: "BINDING",
    question: "Institutional review question 117",
    criterion: "Confirm that binding evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-118",
    domain: "COMMIT",
    question: "Institutional review question 118",
    criterion: "Confirm that commit evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-119",
    domain: "EXECUTION",
    question: "Institutional review question 119",
    criterion: "Confirm that execution evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
  {
    id: "REVIEW-120",
    domain: "OUTCOME",
    question: "Institutional review question 120",
    criterion: "Confirm that outcome evidence, authority, limits, and claims remain consistent with the frozen conflict record and do not convert ESCALATE into approval.",
  },
] as const;

const views: Array<{ id: View; label: string; code: string }> = [
  { id: "inspection", label: "Inspection", code: "01" },
  { id: "chain", label: "Eight anchors", code: "02" },
  { id: "runtime", label: "24-link runtime", code: "03" },
  { id: "evidence", label: "Evidence", code: "04" },
  { id: "authority", label: "Authority", code: "05" },
  { id: "conflict", label: "Conflict record", code: "06" },
  { id: "control", label: "Control effect", code: "07" },
  { id: "outcome", label: "Outcome", code: "08" },
  { id: "integrity", label: "Integrity", code: "09" },
  { id: "verify", label: "Verify", code: "10" },
  { id: "challenge", label: "Challenge", code: "11" },
];

const canonicalRecord = {
  artifactId: ARTIFACT_ID,
  title: ARTIFACT_TITLE,
  classification: "CANONICAL EXECUTION PROOF",
  series: "TA-14 FOUNDING EXECUTION ARTIFACTS",
  status: "PUBLISHED",
  demonstration: true,
  route: { routeId: ROUTE_ID, version: ROUTE_VERSION },
  scenario: {
    proposedAction: "Release one consequential clinical routing instruction for a bounded patient episode.",
    consequence: "A patient may be redirected to urgent specialist review or maintained under monitored observation.",
    environment: "Controlled TA-14 clinical-routing demonstration environment",
    declaredLimit: "No production patient-care system is affected by this demonstration record.",
  },
  earliestControllingFailure: {
    anchor: "ADMISSIBILITY",
    runtimeLink: "14",
    reasonCode: "ADMISSIBLE_EVIDENCE_CONFLICT",
    explanation: "Two individually admissible evidence packages supported incompatible consequential outcomes.",
  },
  determination: {
    value: "ESCALATE",
    committedAt: "2026-08-01T12:07:52Z",
    reasonCodes: ["ADMISSIBLE_EVIDENCE_CONFLICT", "NAMED_ADJUDICATION_REQUIRED"],
    permittedNextAction: "Route the preserved conflict to Clinical Adjudicator A-17; do not release a care-routing instruction.",
  },
  executionEffect: {
    command: "HOLD_AND_ROUTE_TO_ADJUDICATION",
    httpStatus: 202,
    adapterState: "HELD_AND_ROUTED",
    queueState: "AWAITING_ADJUDICATION",
    consequentialRouteChanges: 0,
    receiptId: "EA-000004-EX-01",
    receiptHash: RECEIPT_HASH,
  },
  outcome: {
    state: "HELD_PENDING_ADJUDICATION",
    careInstructionReleased: false,
    targetSystemChanges: 0,
    residualUncertainty: "The substantive evidence conflict remains unresolved until named adjudication and revalidation.",
  },
  integrity: { recordHash: RECORD_HASH, packageHash: PACKAGE_HASH },
};

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

function tone(result: string) {
  return result.toLowerCase().replaceAll("_", "-");
}

function Panel({ title, eyebrow, children, className = "" }: { title: string; eyebrow?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`ea-panel ${className}`}>
      <div className="ea-panel-head">
        {eyebrow ? <span>{eyebrow}</span> : null}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Pill({ children, variant = "neutral" }: { children: ReactNode; variant?: string }) {
  return <span className={`ea-pill ${variant}`}>{children}</span>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="ea-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="ea-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CodeBlock({ value }: { value: string }) {
  return <code className="ea-code-block">{value}</code>;
}

export default function Artifact000004Page() {
  const [view, setView] = useState<View>("inspection");
  const [verificationState, setVerificationState] = useState<VerificationState>("IDLE");
  const [verificationStep, setVerificationStep] = useState(0);
  const [challenge, setChallenge] = useState("");
  const [challengeSaved, setChallengeSaved] = useState(false);
  const [expandedGate, setExpandedGate] = useState<string>("14");
  const [expandedEvidence, setExpandedEvidence] = useState<string>("EV-002");

  const passCount = useMemo(() => runtime.filter((item) => item.result === "PASS").length, []);
  const reviewQuestionCount = institutionalReviewQuestions.length;
  const unresolvedCount = useMemo(() => runtime.filter((item) => item.result === "UNRESOLVED").length, []);

  const changeView = (next: View) => {
    setView(next);
    window.setTimeout(() => document.getElementById("artifact-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }), 20);
  };

  const runVerification = () => {
    setVerificationState("RUNNING");
    setVerificationStep(0);
    verificationLevels.forEach((_, index) => {
      window.setTimeout(() => {
        setVerificationStep(index + 1);
        if (index === verificationLevels.length - 1) setVerificationState("VERIFIED");
      }, 260 * (index + 1));
    });
  };

  const saveChallenge = () => {
    if (!challenge.trim()) return;
    localStorage.setItem(`${ARTIFACT_ID}.challenge`, JSON.stringify({ challenge: challenge.trim(), savedAt: new Date().toISOString() }));
    setChallengeSaved(true);
  };

  return (
    <main className="ea-page">
      <style jsx global>{`
        :root {
          --ea-bg: #03060c;
          --ea-panel: rgba(8, 15, 27, 0.84);
          --ea-panel-2: rgba(12, 22, 38, 0.9);
          --ea-line: rgba(132, 210, 255, 0.16);
          --ea-line-strong: rgba(132, 210, 255, 0.34);
          --ea-text: #eff8ff;
          --ea-muted: #8ca2b7;
          --ea-cyan: #66dbff;
          --ea-blue: #6f8cff;
          --ea-violet: #b68cff;
          --ea-amber: #ffbf69;
          --ea-green: #76efbd;
          --ea-red: #ff7f8f;
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: var(--ea-bg); color: var(--ea-text); }
        button, input, textarea { font: inherit; }
        button { color: inherit; }
        .ea-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 18% 8%, rgba(102, 219, 255, .12), transparent 26%),
            radial-gradient(circle at 82% 18%, rgba(182, 140, 255, .12), transparent 24%),
            linear-gradient(180deg, #050914 0%, #02050a 48%, #050812 100%);
        }
        .ea-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .24;
          background-image:
            linear-gradient(rgba(103, 184, 255, .06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(103, 184, 255, .06) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: linear-gradient(to bottom, black, transparent 82%);
        }
        .ea-shell { width: min(1540px, calc(100% - 36px)); margin: 0 auto; position: relative; z-index: 1; }
        .ea-topbar {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid var(--ea-line);
        }
        .ea-brand { display: flex; align-items: center; gap: 13px; text-decoration: none; color: var(--ea-text); }
        .ea-brand-mark {
          width: 42px; height: 42px; display: grid; place-items: center; border-radius: 13px;
          border: 1px solid var(--ea-line-strong); background: linear-gradient(145deg, rgba(102,219,255,.18), rgba(182,140,255,.12));
          box-shadow: inset 0 0 24px rgba(102,219,255,.08), 0 16px 40px rgba(0,0,0,.28);
          font-weight: 900; letter-spacing: -.04em;
        }
        .ea-brand-copy strong { display: block; font-size: 13px; letter-spacing: .16em; text-transform: uppercase; }
        .ea-brand-copy span { display: block; margin-top: 3px; color: var(--ea-muted); font-size: 11px; }
        .ea-top-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
        .ea-link, .ea-button {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 40px; padding: 0 14px;
          border-radius: 10px; border: 1px solid var(--ea-line); background: rgba(255,255,255,.025); color: var(--ea-text);
          text-decoration: none; cursor: pointer; transition: .2s ease;
        }
        .ea-link:hover, .ea-button:hover { transform: translateY(-1px); border-color: var(--ea-line-strong); background: rgba(102,219,255,.07); }
        .ea-button.primary { border-color: rgba(102,219,255,.45); background: linear-gradient(135deg, rgba(102,219,255,.18), rgba(111,140,255,.15)); }
        .ea-hero { padding: 54px 0 30px; display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(330px, .8fr); gap: 24px; align-items: stretch; }
        .ea-hero-copy, .ea-decision-core {
          border: 1px solid var(--ea-line); border-radius: 24px; position: relative; overflow: hidden;
          background: linear-gradient(145deg, rgba(10,19,33,.92), rgba(4,9,17,.9));
          box-shadow: 0 34px 90px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,255,255,.03);
        }
        .ea-hero-copy { padding: 38px; }
        .ea-hero-copy::after, .ea-decision-core::after {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(120deg, transparent 30%, rgba(102,219,255,.05), transparent 72%);
        }
        .ea-kicker { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .ea-kicker span { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--ea-cyan); }
        .ea-hero h1 { margin: 20px 0 14px; max-width: 820px; font-size: clamp(42px, 6vw, 84px); line-height: .95; letter-spacing: -.055em; }
        .ea-hero h1 span { display: block; color: var(--ea-amber); }
        .ea-hero-copy > p { max-width: 820px; margin: 0; color: #aebed0; font-size: 16px; line-height: 1.75; }
        .ea-hero-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 26px; }
        .ea-decision-core { padding: 28px; display: flex; flex-direction: column; justify-content: space-between; }
        .ea-decision-label { color: var(--ea-muted); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; }
        .ea-decision-value { margin: 12px 0 5px; color: var(--ea-amber); font-size: clamp(46px, 7vw, 82px); line-height: 1; font-weight: 950; letter-spacing: -.06em; }
        .ea-decision-core p { margin: 0; color: #b5c6d8; line-height: 1.6; }
        .ea-decision-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 24px; }
        .ea-field { border: 1px solid var(--ea-line); border-radius: 12px; padding: 13px; background: rgba(255,255,255,.02); }
        .ea-field span { display: block; color: var(--ea-muted); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; }
        .ea-field strong { display: block; margin-top: 6px; font-size: 12px; line-height: 1.45; }
        .ea-metrics { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 24px; }
        .ea-metric { min-height: 138px; padding: 18px; border: 1px solid var(--ea-line); border-radius: 16px; background: var(--ea-panel); box-shadow: 0 18px 50px rgba(0,0,0,.2); }
        .ea-metric span { color: var(--ea-muted); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; }
        .ea-metric strong { display: block; margin-top: 10px; font-size: 24px; letter-spacing: -.04em; }
        .ea-metric p { margin: 7px 0 0; color: var(--ea-muted); font-size: 12px; line-height: 1.45; }
        .ea-nav {
          position: sticky; top: 0; z-index: 30; display: flex; gap: 8px; overflow-x: auto; padding: 12px;
          border: 1px solid var(--ea-line); border-radius: 16px; background: rgba(4,9,17,.88); backdrop-filter: blur(18px);
          box-shadow: 0 18px 55px rgba(0,0,0,.28); margin-bottom: 24px;
        }
        .ea-nav button { flex: 0 0 auto; border: 1px solid transparent; border-radius: 10px; background: transparent; padding: 10px 12px; color: var(--ea-muted); cursor: pointer; }
        .ea-nav button strong { margin-right: 7px; font-size: 10px; color: #60758a; }
        .ea-nav button.active { color: var(--ea-text); border-color: var(--ea-line-strong); background: rgba(102,219,255,.08); }
        .ea-workspace { scroll-margin-top: 90px; min-height: 800px; padding-bottom: 48px; }
        .ea-panel { border: 1px solid var(--ea-line); border-radius: 22px; padding: 24px; background: var(--ea-panel); box-shadow: 0 24px 70px rgba(0,0,0,.24); }
        .ea-panel + .ea-panel { margin-top: 18px; }
        .ea-panel-head { margin-bottom: 20px; }
        .ea-panel-head span { color: var(--ea-cyan); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; }
        .ea-panel-head h2 { margin: 7px 0 0; font-size: clamp(24px, 4vw, 40px); letter-spacing: -.04em; }
        .ea-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .ea-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .ea-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .ea-card { border: 1px solid var(--ea-line); border-radius: 16px; padding: 18px; background: rgba(255,255,255,.022); }
        .ea-card h3 { margin: 10px 0 8px; font-size: 17px; }
        .ea-card p { margin: 0; color: var(--ea-muted); line-height: 1.6; font-size: 13px; }
        .ea-pill { display: inline-flex; min-height: 24px; align-items: center; padding: 0 9px; border-radius: 999px; border: 1px solid var(--ea-line); color: var(--ea-muted); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; }
        .ea-pill.pass, .ea-pill.ready, .ea-pill.verified { color: var(--ea-green); border-color: rgba(118,239,189,.3); background: rgba(118,239,189,.06); }
        .ea-pill.unresolved, .ea-pill.escalate { color: var(--ea-amber); border-color: rgba(255,191,105,.34); background: rgba(255,191,105,.06); }
        .ea-pill.fail { color: var(--ea-red); border-color: rgba(255,127,143,.34); background: rgba(255,127,143,.06); }
        .ea-pill.public { color: var(--ea-cyan); }
        .ea-inspection-lead { display: grid; grid-template-columns: 1.15fr .85fr; gap: 16px; }
        .ea-callout { border: 1px solid rgba(255,191,105,.26); border-radius: 18px; padding: 22px; background: linear-gradient(145deg, rgba(255,191,105,.07), rgba(255,255,255,.015)); }
        .ea-callout strong { display: block; font-size: 22px; letter-spacing: -.03em; }
        .ea-callout p { margin: 9px 0 0; color: #b9c9d9; line-height: 1.65; }
        .ea-chain { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .ea-chain-card { border: 1px solid var(--ea-line); border-radius: 16px; padding: 16px; background: rgba(255,255,255,.02); }
        .ea-chain-card header { display: flex; justify-content: space-between; gap: 10px; align-items: center; }
        .ea-chain-card header span:first-child { font-weight: 900; color: var(--ea-cyan); }
        .ea-chain-card h3 { margin: 14px 0 7px; font-size: 18px; }
        .ea-chain-card p { margin: 0; color: var(--ea-muted); line-height: 1.55; font-size: 12px; }
        .ea-chain-card .proof { margin-top: 12px; color: #b7c8d9; }
        .ea-runtime { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .ea-gate { text-align: left; border: 1px solid var(--ea-line); border-radius: 14px; padding: 14px; background: rgba(255,255,255,.02); cursor: pointer; }
        .ea-gate.active { border-color: rgba(255,191,105,.42); background: rgba(255,191,105,.05); }
        .ea-gate-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .ea-gate-head strong { color: var(--ea-cyan); }
        .ea-gate h3 { margin: 11px 0 7px; font-size: 15px; }
        .ea-gate p { margin: 0; color: var(--ea-muted); font-size: 12px; line-height: 1.5; }
        .ea-gate code { display: block; margin-top: 10px; color: #9fc5dd; font-size: 10px; overflow-wrap: anywhere; }
        .ea-list { display: grid; gap: 10px; }
        .ea-row { border: 1px solid var(--ea-line); border-radius: 14px; padding: 15px; background: rgba(255,255,255,.02); }
        .ea-row header { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
        .ea-row h3 { margin: 6px 0 0; font-size: 16px; }
        .ea-row p { margin: 9px 0 0; color: var(--ea-muted); line-height: 1.55; font-size: 12px; }
        .ea-row code { display: block; margin-top: 10px; color: #a5cae1; overflow-wrap: anywhere; font-size: 10px; }
        .ea-evidence-button { width: 100%; text-align: left; color: inherit; cursor: pointer; }
        .ea-evidence-detail { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--ea-line); display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .ea-timeline { position: relative; display: grid; gap: 12px; }
        .ea-timeline::before { content: ""; position: absolute; left: 19px; top: 10px; bottom: 10px; width: 1px; background: linear-gradient(var(--ea-cyan), var(--ea-amber), transparent); }
        .ea-event { position: relative; margin-left: 42px; border: 1px solid var(--ea-line); border-radius: 14px; padding: 16px; background: rgba(255,255,255,.02); }
        .ea-event::before { content: ""; position: absolute; left: -30px; top: 20px; width: 10px; height: 10px; border-radius: 50%; background: var(--ea-cyan); box-shadow: 0 0 18px rgba(102,219,255,.7); }
        .ea-event time { color: var(--ea-cyan); font-size: 10px; letter-spacing: .1em; }
        .ea-event strong { display: block; margin-top: 7px; }
        .ea-event p { margin: 8px 0 0; color: var(--ea-muted); line-height: 1.55; font-size: 12px; }
        .ea-receipt { border: 1px solid rgba(255,191,105,.35); border-radius: 20px; padding: 24px; background: linear-gradient(145deg, rgba(255,191,105,.07), rgba(5,10,18,.95)); }
        .ea-receipt-command { margin: 18px 0; padding: 18px; border: 1px solid var(--ea-line); border-radius: 14px; background: #050a12; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: #cfeeff; overflow-wrap: anywhere; }
        .ea-code-block { display: block; padding: 15px; border: 1px solid var(--ea-line); border-radius: 12px; background: #04080f; color: #bfe8ff; line-height: 1.5; overflow-wrap: anywhere; font-size: 11px; }
        .ea-table-wrap { overflow-x: auto; border: 1px solid var(--ea-line); border-radius: 16px; }
        .ea-table { width: 100%; min-width: 780px; border-collapse: collapse; }
        .ea-table th, .ea-table td { padding: 14px; text-align: left; vertical-align: top; border-bottom: 1px solid var(--ea-line); }
        .ea-table th { color: var(--ea-muted); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; background: rgba(255,255,255,.02); }
        .ea-table td { font-size: 12px; line-height: 1.5; }
        .ea-table tr:last-child td { border-bottom: 0; }
        .ea-progress { height: 8px; border: 1px solid var(--ea-line); border-radius: 999px; overflow: hidden; background: #050a11; }
        .ea-progress i { display: block; height: 100%; background: linear-gradient(90deg, var(--ea-cyan), var(--ea-green)); transition: width .25s ease; }
        .ea-verify-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
        .ea-verification-row { display: grid; grid-template-columns: 60px 180px 1fr 96px; gap: 12px; align-items: center; border: 1px solid var(--ea-line); border-radius: 13px; padding: 13px; background: rgba(255,255,255,.02); }
        .ea-verification-row p { margin: 0; color: var(--ea-muted); line-height: 1.45; font-size: 12px; }
        .ea-challenge textarea { width: 100%; min-height: 180px; resize: vertical; border: 1px solid var(--ea-line); border-radius: 14px; padding: 16px; background: rgba(3,7,13,.82); color: var(--ea-text); outline: none; }
        .ea-challenge textarea:focus { border-color: rgba(102,219,255,.5); box-shadow: 0 0 0 3px rgba(102,219,255,.06); }
        .ea-footer { padding: 30px 0 54px; border-top: 1px solid var(--ea-line); color: var(--ea-muted); }
        .ea-footer-inner { display: flex; justify-content: space-between; gap: 18px; align-items: center; }
        .ea-footer strong { color: var(--ea-text); }
        @media (max-width: 1180px) {
          .ea-hero, .ea-inspection-lead { grid-template-columns: 1fr; }
          .ea-metrics { grid-template-columns: repeat(3, 1fr); }
          .ea-chain { grid-template-columns: repeat(2, 1fr); }
          .ea-runtime { grid-template-columns: repeat(2, 1fr); }
          .ea-grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 760px) {
          .ea-shell { width: min(100% - 20px, 1540px); }
          .ea-topbar { align-items: flex-start; padding: 15px 0; }
          .ea-top-actions { display: none; }
          .ea-hero { padding-top: 22px; }
          .ea-hero-copy, .ea-decision-core, .ea-panel { padding: 18px; border-radius: 18px; }
          .ea-metrics, .ea-grid-2, .ea-grid-3, .ea-grid-4, .ea-chain, .ea-runtime { grid-template-columns: 1fr; }
          .ea-decision-grid { grid-template-columns: 1fr; }
          .ea-verification-row { grid-template-columns: 48px 1fr; }
          .ea-verification-row p { grid-column: 1 / -1; }
          .ea-footer-inner { align-items: flex-start; flex-direction: column; }
        }
      `}</style>

      <div className="ea-shell">
        <header className="ea-topbar">
          <Link className="ea-brand" href="/artifacts">
            <span className="ea-brand-mark">14</span>
            <span className="ea-brand-copy"><strong>TA-14 Authority</strong><span>Eighth Door · Execution Artifacts</span></span>
          </Link>
          <nav className="ea-top-actions" aria-label="Artifact navigation">
            <Link className="ea-link" href="/artifacts/ta14-ea-000003">← Artifact 000003</Link>
            <Link className="ea-link" href="/artifacts">Artifact library</Link>
            <Link className="ea-link" href="/workspace/artifacts/build">Artifact Studio</Link>
          </nav>
        </header>

        <section className="ea-hero">
          <div className="ea-hero-copy">
            <div className="ea-kicker">
              <Pill variant="public">Published</Pill>
              <Pill>Canonical demonstration</Pill>
              <span>{ARTIFACT_ID}</span>
            </div>
            <h1>Conflicting admissible evidence <span>did not become silent approval.</span></h1>
            <p>
              Two current, attributable, individually admissible clinical evidence packages supported incompatible consequential outcomes.
              TA-14 preserved both records, fixed ESCALATE before action, held the care-routing instruction, and routed the conflict to a named adjudicator.
            </p>
            <div className="ea-hero-actions">
              <button className="ea-button primary" onClick={() => changeView("inspection")}>Inspect bounded record</button>
              <button className="ea-button" onClick={() => changeView("verify")}>Run verification</button>
              <button className="ea-button" onClick={() => downloadJson(`${ARTIFACT_ID}.canonical.json`, canonicalRecord)}>Download canonical JSON</button>
            </div>
          </div>

          <aside className="ea-decision-core">
            <div>
              <span className="ea-decision-label">Committed determination</span>
              <div className="ea-decision-value">ESCALATE</div>
              <p>A named clinical authority must resolve the preserved conflict. Escalation is not approval.</p>
            </div>
            <div className="ea-decision-grid">
              <Field label="Earliest controlling link" value="14 · Admissibility" />
              <Field label="Execution effect" value="HELD_AND_ROUTED" />
              <Field label="Queue state" value="AWAITING_ADJUDICATION" />
              <Field label="Route changes" value="0" />
            </div>
          </aside>
        </section>

        <section className="ea-metrics" aria-label="Artifact metrics">
          <Metric label="Runtime links" value="24" detail={`${passCount} pass · ${unresolvedCount} unresolved`} />
          <Metric label="Evidence records" value="12" detail="Both conflicting sources preserved" />
          <Metric label="Authority actors" value="6" detail="Named adjudication authority ready" />
          <Metric label="Verification" value="L7" detail={`${reviewQuestionCount} institutional review checks`} />
          <Metric label="Outcome" value="0 changes" detail="No care-routing instruction released" />
        </section>

        <nav className="ea-nav" aria-label="Artifact workspace views">
          {views.map((item) => (
            <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => changeView(item.id)}>
              <strong>{item.code}</strong>{item.label}
            </button>
          ))}
        </nav>

        <div id="artifact-workspace" className="ea-workspace">
          {view === "inspection" && (
            <>
              <Panel eyebrow="Sixty-second inspection" title="What happened, what controlled it, and what followed">
                <div className="ea-inspection-lead">
                  <div className="ea-grid-2">
                    <article className="ea-card"><Pill>Proposed action</Pill><h3>Release one consequential clinical routing instruction.</h3><p>The instruction could redirect the patient toward urgent specialist review or monitored observation.</p></article>
                    <article className="ea-card"><Pill>What was at risk</Pill><h3>An unresolved conflict could become real-world consequence.</h3><p>Either source could be wrong, incomplete, or contextually limited. Silent selection was prohibited.</p></article>
                    <article className="ea-card"><Pill variant="unresolved">Earliest control</Pill><h3>Admissibility remained unresolved.</h3><p>Both packages were admissible individually, but they could not jointly support one consequence without adjudication.</p></article>
                    <article className="ea-card"><Pill variant="pass">Execution effect</Pill><h3>The instruction was held and routed.</h3><p>HTTP 202 confirmed assignment to the named adjudicator and zero consequential route changes.</p></article>
                  </div>
                  <div className="ea-callout">
                    <Pill variant="escalate">Why ESCALATE</Pill>
                    <strong>Conflict was preserved instead of concealed.</strong>
                    <p>The route did not reject either source, average incompatible conclusions, or allow a runtime operator to choose. It committed a bounded next action: named adjudication followed by revalidation.</p>
                  </div>
                </div>
              </Panel>

              <Panel eyebrow="Proof boundary" title="What this artifact proves—and what it does not">
                <div className="ea-grid-2">
                  <article className="ea-card"><Pill variant="verified">Proves</Pill><h3>TA-14 can surface a material evidence conflict before consequence.</h3><p>It proves one bounded route preserved both sources, committed ESCALATE, technically held execution, and verified zero route changes.</p></article>
                  <article className="ea-card"><Pill variant="unresolved">Does not prove</Pill><h3>No universal clinical correctness or production certification is claimed.</h3><p>The artifact does not decide which source is substantively correct and does not certify all clinical systems, routes, or future events.</p></article>
                </div>
              </Panel>
            </>
          )}

          {view === "chain" && (
            <Panel eyebrow="Eight-anchor execution chain" title="The complete event from reality to preserved outcome">
              <div className="ea-chain">
                {chain.map((item) => (
                  <article className="ea-chain-card" key={item.number}>
                    <header><span>{item.number}</span><Pill variant={tone(item.result)}>{item.result}</Pill></header>
                    <h3>{item.link}</h3>
                    <p>{item.question}</p>
                    <p className="proof"><strong>Finding:</strong> {item.finding}</p>
                    <p className="proof"><strong>Proof:</strong> {item.proof}</p>
                  </article>
                ))}
              </div>
            </Panel>
          )}

          {view === "runtime" && (
            <>
              <Panel eyebrow="Twenty-four-link runtime" title="Ordered gate ledger and earliest controlling failure">
                <div className="ea-runtime">
                  {runtime.map((gate) => (
                    <button key={gate.number} className={`ea-gate ${expandedGate === gate.number ? "active" : ""}`} onClick={() => setExpandedGate(gate.number)}>
                      <div className="ea-gate-head"><strong>{gate.number}</strong><Pill variant={tone(gate.result)}>{gate.result}</Pill></div>
                      <h3>{gate.title}</h3>
                      <p>{gate.summary}</p>
                      <code>{gate.reasonCode}</code>
                    </button>
                  ))}
                </div>
              </Panel>
              <Panel eyebrow="Earliest-failure discipline" title="Later links cannot cure an unresolved admissibility conflict">
                <div className="ea-grid-3">
                  <article className="ea-card"><Pill variant="pass">Continuity passed</Pill><h3>Both sources remained intact.</h3><p>Identity, provenance, time, custody, integrity, and version were preserved for each package.</p></article>
                  <article className="ea-card"><Pill variant="unresolved">Admissibility unresolved</Pill><h3>The records conflicted materially.</h3><p>Individual fitness did not create a joint right to support one consequential determination.</p></article>
                  <article className="ea-card"><Pill variant="escalate">Next action bounded</Pill><h3>Named adjudication only.</h3><p>No later approval, runtime preference, or successful outcome may be backdated into this commit.</p></article>
                </div>
              </Panel>
            </>
          )}

          {view === "evidence" && (
            <Panel eyebrow="Evidence manifest" title="Both admissible packages remain visible, attributable, and challengeable">
              <div className="ea-list">
                {evidence.map((item) => (
                  <button key={item.id} className="ea-row ea-evidence-button" onClick={() => setExpandedEvidence(expandedEvidence === item.id ? "" : item.id)}>
                    <header><div><Pill>{item.id}</Pill><h3>{item.title}</h3></div><div><Pill variant="pass">{item.status}</Pill></div></header>
                    <p>{item.source} · {item.type} · {item.disclosure} · {item.capturedAt}</p>
                    <code>{item.hash}</code>
                    {expandedEvidence === item.id && (
                      <div className="ea-evidence-detail">
                        <div><Pill variant="verified">Supports</Pill><p>{item.supports}</p></div>
                        <div><Pill variant="unresolved">Limitation</Pill><p>{item.limitation}</p></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Panel>
          )}

          {view === "authority" && (
            <>
              <Panel eyebrow="Authority resolution" title="Escalation routes to a named authority without becoming approval">
                <div className="ea-grid-3">
                  {authorities.map((item) => (
                    <article className="ea-card" key={item.id}>
                      <div className="ea-kicker"><Pill>{item.id}</Pill><Pill variant="pass">{item.state}</Pill></div>
                      <h3>{item.actor}</h3>
                      <p><strong>{item.role}</strong></p>
                      <p>{item.scope}</p>
                    </article>
                  ))}
                </div>
              </Panel>
              <Panel eyebrow="Separation of duties" title="No actor may silently assume another actor’s authority">
                <div className="ea-grid-4">
                  <article className="ea-card"><Pill>Evidence custodian</Pill><h3>Preserves source fitness.</h3><p>Cannot decide the substantive conflict.</p></article>
                  <article className="ea-card"><Pill>Runtime operator</Pill><h3>Executes the frozen route.</h3><p>Cannot reinterpret ESCALATE as ALLOW.</p></article>
                  <article className="ea-card"><Pill>Adapter</Pill><h3>Holds and routes.</h3><p>Cannot release the instruction while conflict remains unresolved.</p></article>
                  <article className="ea-card"><Pill>Adjudicator</Pill><h3>Resolves within scope.</h3><p>Any later decision still requires revalidation before execution.</p></article>
                </div>
              </Panel>
            </>
          )}

          {view === "conflict" && (
            <Panel eyebrow="Conflict chronology" title="The contradiction remained visible from intake through outcome closure">
              <div className="ea-timeline">
                {timeline.map((item) => (
                  <article className="ea-event" key={`${item.time}-${item.event}`}>
                    <time>{item.time}</time><strong>{item.event}</strong><p>{item.detail}</p><div style={{ marginTop: 10 }}><Pill variant={item.state === "CONFLICT" || item.state === "UNRESOLVED" ? "unresolved" : "pass"}>{item.state}</Pill></div>
                  </article>
                ))}
              </div>
            </Panel>
          )}

          {view === "control" && (
            <>
              <Panel eyebrow="Execution effect receipt" title="The committed determination changed what the system could do">
                <div className="ea-receipt">
                  <div className="ea-grid-3">
                    <Field label="Receipt ID" value="EA-000004-EX-01" />
                    <Field label="HTTP status" value="202 · ESCALATED" />
                    <Field label="Adapter state" value="HELD_AND_ROUTED" />
                    <Field label="Queue state" value="AWAITING_ADJUDICATION" />
                    <Field label="Route changes" value="0" />
                    <Field label="Bypass release" value="NONE" />
                  </div>
                  <div className="ea-receipt-command">CONTROL COMMAND: HOLD_AND_ROUTE_TO_ADJUDICATION · TARGET: BOUNDED CARE-ROUTING INSTRUCTION · AUTHORITY: CLINICAL_ADJUDICATOR_A17</div>
                  <CodeBlock value={RECEIPT_HASH} />
                </div>
              </Panel>
              <Panel eyebrow="Conflict controls" title="Twelve controls prevent contradiction from becoming consequence">
                <div className="ea-grid-3">
                  {controls.map((item) => <article className="ea-card" key={item.id}><Pill>{item.id}</Pill><h3>{item.title}</h3><p>{item.detail}</p></article>)}
                </div>
              </Panel>
            </>
          )}

          {view === "outcome" && (
            <>
              <Panel eyebrow="Outcome closure" title="No consequential care-routing instruction was released">
                <div className="ea-grid-4">
                  <Metric label="Care instruction" value="Not released" detail="Held pending adjudication" />
                  <Metric label="Target changes" value="0" detail="Verified by target-system audit" />
                  <Metric label="Residual risk" value="Visible" detail="Substantive conflict remains unresolved" />
                  <Metric label="Next action" value="Adjudicate" detail="Then revalidate before any execution" />
                </div>
              </Panel>
              <Panel eyebrow="Repair and continuation" title="What must happen before a later consequential action may proceed">
                <div className="ea-grid-3">
                  <article className="ea-card"><Pill>01</Pill><h3>Named adjudication</h3><p>Clinical Adjudicator A-17 must issue a scoped, attributable resolution or request additional evidence.</p></article>
                  <article className="ea-card"><Pill>02</Pill><h3>Append the resolution</h3><p>The resolution is appended to this event; the original ESCALATE commit remains immutable.</p></article>
                  <article className="ea-card"><Pill>03</Pill><h3>Revalidate before execution</h3><p>Patient state, evidence freshness, authority, route version, and execution boundary must be checked again.</p></article>
                </div>
              </Panel>
            </>
          )}

          {view === "integrity" && (
            <>
              <Panel eyebrow="Integrity manifest" title="Every public representation resolves to one frozen record root">
                <div className="ea-grid-3">
                  <article className="ea-card"><Pill>Record hash</Pill><h3>Canonical event root</h3><CodeBlock value={RECORD_HASH} /></article>
                  <article className="ea-card"><Pill>Package hash</Pill><h3>Artifact package root</h3><CodeBlock value={PACKAGE_HASH} /></article>
                  <article className="ea-card"><Pill>Receipt hash</Pill><h3>Execution effect commitment</h3><CodeBlock value={RECEIPT_HASH} /></article>
                </div>
              </Panel>
              <Panel eyebrow="Twenty-component package" title="Human-readable and machine-verifiable components">
                <div className="ea-table-wrap"><table className="ea-table"><thead><tr><th>#</th><th>Component</th><th>Status</th><th>Purpose</th></tr></thead><tbody>{packageComponents.map((item) => <tr key={item.number}><td>{item.number}</td><td><strong>{item.component}</strong></td><td><Pill variant="ready">{item.status}</Pill></td><td>{item.detail}</td></tr>)}</tbody></table></div>
                <div className="ea-hero-actions">
                  <button className="ea-button" onClick={() => downloadJson(`${ARTIFACT_ID}.integrity-manifest.json`, { artifactId: ARTIFACT_ID, recordHash: RECORD_HASH, packageHash: PACKAGE_HASH, receiptHash: RECEIPT_HASH, components: packageComponents })}>Download integrity manifest</button>
                  <button className="ea-button" onClick={() => downloadJson(`${ARTIFACT_ID}.execution-receipt.json`, canonicalRecord.executionEffect)}>Download execution receipt</button>
                  <button className="ea-button" onClick={() => downloadJson(`${ARTIFACT_ID}.evidence-manifest.json`, evidence)}>Download evidence manifest</button>
                </div>
              </Panel>
            </>
          )}

          {view === "verify" && (
            <>
              <Panel eyebrow="Verification center" title="Verify package integrity, parity, replay, control effect, and outcome">
                <div className="ea-verify-head">
                  <div><Pill variant={verificationState === "VERIFIED" ? "verified" : verificationState === "RUNNING" ? "unresolved" : "neutral"}>{verificationState}</Pill></div>
                  <button className="ea-button primary" onClick={runVerification} disabled={verificationState === "RUNNING"}>{verificationState === "RUNNING" ? "Verifying…" : "Run full verification"}</button>
                </div>
                <div className="ea-progress"><i style={{ width: `${Math.round((verificationStep / verificationLevels.length) * 100)}%` }} /></div>
                <div className="ea-list" style={{ marginTop: 16 }}>
                  {verificationLevels.map((item, index) => (
                    <article className="ea-verification-row" key={item.level}>
                      <strong>{item.level}</strong><span>{item.label}</span><p>{item.detail}</p><Pill variant={verificationStep > index ? "verified" : "neutral"}>{verificationStep > index ? "VERIFIED" : "PENDING"}</Pill>
                    </article>
                  ))}
                </div>
              </Panel>
              <Panel eyebrow="Acceptance tests" title="Fifteen required conditions for this bounded artifact">
                <div className="ea-table-wrap"><table className="ea-table"><thead><tr><th>Test</th><th>Result</th><th>Pass condition</th></tr></thead><tbody>{acceptanceTests.map((item) => <tr key={item.id}><td><strong>{item.id}</strong></td><td><Pill variant="pass">{item.result}</Pill></td><td>{item.condition}</td></tr>)}</tbody></table></div>
              </Panel>
            </>
          )}

          {view === "challenge" && (
            <Panel eyebrow="Challenge and correction" title="Dispute the record without erasing the original event">
              <div className="ea-grid-2">
                <div className="ea-challenge">
                  <textarea value={challenge} onChange={(event) => { setChallenge(event.target.value); setChallengeSaved(false); }} placeholder="Identify the exact evidence record, gate, authority scope, execution effect, outcome claim, or public statement being challenged…" />
                  <div className="ea-hero-actions"><button className="ea-button primary" onClick={saveChallenge}>Preserve local challenge draft</button>{challengeSaved ? <Pill variant="verified">Draft preserved</Pill> : null}</div>
                </div>
                <article className="ea-callout"><Pill>Append-only rule</Pill><strong>A correction cannot rewrite the original ESCALATE event.</strong><p>Challenges, responses, corrections, supersession, or withdrawal are appended with their own identity, time, evidence, authority, and integrity commitments.</p></article>
              </div>
            </Panel>
          )}
        </div>

        <footer className="ea-footer">
          <div className="ea-footer-inner">
            <div><strong>TA-14 Authority · Eighth Door</strong><br />No admissible evidence. No admissible execution.</div>
            <div className="ea-top-actions">
              <Link className="ea-link" href="/artifacts/ta14-ea-000003">← Artifact 000003</Link>
              <Link className="ea-link" href="/artifacts">Return to library</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
